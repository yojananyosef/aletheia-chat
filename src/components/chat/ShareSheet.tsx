'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link2, ImageDown, X, Check, MessageSquareQuote } from 'lucide-react';
import { SITE_URL } from '../../constants/site';
import { useDismissOnEscape } from '../../hooks/useDismissOnEscape';
import { createShareCard, cardFilename, shareImage, type ShareImageOutcome, type ShareCardMessage } from '../../utils/shareCard';

export interface ShareTarget {
    bookId: string;
    bookName: string;
    chapter: number;
    /** Mensajes ya leidos en el capitulo, en orden. Es lo unico compartible. */
    messages: ShareCardMessage[];
}

interface ShareSheetProps {
    isOpen: boolean;
    target: ShareTarget | null;
    onClose: () => void;
}

/**
 * Cuántos versículos caben en una card sin que el texto se vuelva ilegible.
 * El ajuste de la card escala tipografía y cromo hasta cierto punto; a partir
 * de ~7 mensajes largos hay que recortar, y es preferible a bajar de ~18px.
 */
const MAX_SELECTION = 6;

/**
 * Hoja de compartir con dos destinos:
 *  - Enlace: deep-link al capitulo, para seguir leyendo juntos.
 *  - Imagen: card PNG de los versiculos elegidos, con el muro del chat.
 *
 * La seleccion de versiculos vive aqui y no en las burbujas: un boton por
 * mensaje rompe la lectura (cada burbuja pide atencion) y ademas obliga a
 * compartir de a uno, cuando lo que se quiere es el dialogo completo.
 */
/** Clave única: el id del corpus. No vale verso+hablante (ver ShareCardMessage). */
const keyOf = (m: ShareCardMessage) => m.id;

/** Filtra lo que tiene sentido compartir: nada de títulos de sección ni vacíos. */
const compartible = (messages: ShareCardMessage[]) =>
    messages.filter((m) => m.speaker !== 'Sistema' && !m.text.trim().startsWith('I.') && m.text.length > 3);

export const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, target, onClose }) => {
    useDismissOnEscape(isOpen, onClose);
    // El feedback se etiqueta con el destino al que pertenece: si el objetivo
    // cambia, el mensaje viejo deja de mostrarse por derivacion (sin efecto).
    const [status, setStatus] = useState<{ key: string; msg: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const targetKey = target ? `${target.bookId}:${target.chapter}` : '';
    const elegibles = useMemo(
        () => (target ? compartible(target.messages) : []),
        [target],
    );

    // Por defecto, el último versículo leído: es el que se está mirando. El
    // inicializador lazy corre en el montaje (donde `elegibles` ya está
    // calculado); el reinicio al cambiar de capítulo se hace ajustando estado
    // durante el render, patrón documentado por React para estado derivado y
    // no un efecto, que dispararía un render en cascada.
    const sheetKey = `${targetKey}:${elegibles.length}`;
    const porDefecto = () => new Set(elegibles.length ? [keyOf(elegibles[elegibles.length - 1]!)] : []);
    const [seleccion, setSeleccion] = useState<Set<string>>(porDefecto);
    const [prevSheetKey, setPrevSheetKey] = useState(sheetKey);
    if (prevSheetKey !== sheetKey) {
        setPrevSheetKey(sheetKey);
        setSeleccion(porDefecto());
    }

    const isOn = (m: ShareCardMessage) => seleccion.has(keyOf(m));
    const atMax = seleccion.size >= MAX_SELECTION;

    const toggle = (m: ShareCardMessage) => {
        const k = keyOf(m);
        setSeleccion((prev) => {
            const base = prev;
            if (base.has(k)) {
                const next = new Set(base);
                next.delete(k);
                return next;
            }
            if (base.size >= MAX_SELECTION) return base;
            const next = new Set(base);
            next.add(k);
            return next;
        });
    };

    /** Mensajes seleccionados en el orden original del capítulo. */
    const chosen = elegibles.filter((m) => isOn(m));

    const url = target ? `${SITE_URL}/${target.bookId}/${target.chapter}` : '';
    const message = status?.key === targetKey ? status.msg : null;

    // Referencia del rango: "Génesis 1:3" o "Génesis 1:3-4". Un rango con el
    // mismo versículo en ambos extremos ("1:3-3") es ruido: se reduce a "1:3".
    const verses = chosen.map((m) => m.verse);
    const lo = verses.length ? Math.min(...verses) : null;
    const hi = verses.length ? Math.max(...verses) : null;
    const reference = !target
        ? ''
        : lo === null
            ? `${target.bookName} ${target.chapter}`
            : lo === hi
                ? `${target.bookName} ${target.chapter}:${lo}`
                : `${target.bookName} ${target.chapter}:${lo}-${hi}`;

    const flash = (msg: string) => {
        setStatus({ key: targetKey, msg });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setStatus(null), 4000);
    };

    const shareLink = async () => {
        const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (typeof nav.share === 'function') {
            try {
                await nav.share({ title: `${reference} | Aletheia Chat`, text: reference, url });
            } catch {
                return; // Cancelado por el usuario: sin feedback.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            flash('¡Enlace copiado!');
        } catch {
            flash('No se pudo copiar el enlace.');
        }
    };

    const sharePicture = async () => {
        if (!chosen.length) { flash('Elige al menos un versículo.'); return; }
        setBusy(true);
        try {
            const blob = await createShareCard({
                messages: chosen,
                reference,
                footer: SITE_URL.replace(/^https?:\/\//, ''),
            });
            const outcome: ShareImageOutcome = await shareImage(blob, cardFilename(reference), reference);
            if (outcome === 'shared') flash('¡Imagen compartida!');
            else if (outcome === 'downloaded') flash('Imagen descargada: compártela desde tu galería.');
            else setStatus(null); // el usuario cerró la hoja de compartir
        } catch {
            flash('No se pudo generar la imagen.');
        } finally {
            setBusy(false);
        }
    };

    if (!target) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                // `fixed`, no `absolute`: la hoja se monta desde el header, y con
                // `absolute inset-0` su overlay se confinaba al div.relative más
                // cercano (96x44px) en vez de cubrir la pantalla.
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40, rotate: -1 }}
                        animate={{ scale: 1, y: 0, rotate: 0 }}
                        exit={{ scale: 0.9, y: 40, rotate: 1 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Compartir ${target.bookName} ${target.chapter}`}
                        className="w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col relative bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1] border-[3px] border-[#141413] dark:border-[#EDE9E1] shadow-[8px_8px_0_#141413] dark:shadow-[8px_8px_0_#000]"
                    >
                        <div className="shrink-0 bg-[#FFD600] text-black border-b-[3px] border-[#141413] dark:border-[#EDE9E1] p-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-lg font-black uppercase tracking-tight leading-tight">Compartir</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 truncate">
                                    {target.bookName} {target.chapter}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                autoFocus
                                aria-label="Cerrar compartir"
                                className="p-2 border-2 border-black bg-[#FAF9F5] hover:bg-black hover:text-[#EDE9E1] transition-all shadow-[2px_2px_0_#0A0A0A] active:translate-y-0.5 active:shadow-none shrink-0"
                            >
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-5">
                            {/* Selector de versiculos leidos */}
                            <p className="text-[10px] font-black text-[#57534E] dark:text-[#A8A29E] uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MessageSquareQuote className="w-4 h-4" /> Elige los versículos
                            </p>
                            <ul className="space-y-1.5 mb-4">
                                {elegibles.map((m) => {
                                    const on = isOn(m);
                                    return (
                                        <li key={keyOf(m)}>
                                            <button
                                                onClick={() => toggle(m)}
                                                aria-pressed={on}
                                                disabled={!on && atMax}
                                                className={`w-full text-left flex items-start gap-3 p-2.5 border-2 transition-all ${
                                                    on
                                                        ? 'border-[#141413] dark:border-[#EDE9E1] bg-[#FFD600] text-black'
                                                        : 'border-[#E6DFD8] dark:border-[#3A3733] bg-[#FAF9F5] dark:bg-[#252320] hover:border-[#141413] dark:hover:border-[#EDE9E1]'
                                                } ${!on && atMax ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            >
                                                <span className={`mt-0.5 w-4 h-4 shrink-0 border-2 flex items-center justify-center ${
                                                    on ? 'border-black bg-black' : 'border-[#141413] dark:border-[#A8A29E]'
                                                }`}>
                                                    {on && <Check className="w-3 h-3 text-[#FFD600]" strokeWidth={4} />}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[9px] font-black uppercase tracking-[0.12em] opacity-70">
                                                        v.{m.verse} · {m.speaker}
                                                    </span>
                                                    <span className="block text-xs font-medium leading-snug line-clamp-2">
                                                        {m.text}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {atMax && (
                                <p className="text-[10px] font-bold uppercase tracking-wide text-[#A33] mb-3">
                                    Máximo {MAX_SELECTION} versículos por card.
                                </p>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={shareLink}
                                    className="w-full flex items-center gap-4 text-left p-4 border-2 border-[#141413] dark:border-[#EDE9E1] bg-[#FAF9F5] dark:bg-[#252320] hover:bg-[#F5F0E8] dark:hover:bg-[#2E2B27] transition-all shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none"
                                >
                                    <Link2 className="w-6 h-6 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                                    <span className="min-w-0">
                                        <span className="block font-black uppercase text-sm tracking-tight">Enlace</span>
                                        <span className="block text-[11px] text-[#57534E] dark:text-[#A8A29E] truncate">{url.replace(/^https?:\/\//, '')}</span>
                                    </span>
                                </button>

                                <button
                                    onClick={sharePicture}
                                    disabled={busy || !chosen.length}
                                    className="w-full flex items-center gap-4 text-left p-4 border-2 border-[#141413] dark:border-[#EDE9E1] bg-[#FFD600] text-black hover:brightness-95 transition-all shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-wait"
                                >
                                    <ImageDown className="w-6 h-6 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                                    <span className="min-w-0">
                                        <span className="block font-black uppercase text-sm tracking-tight">
                                            {busy ? 'Generando…' : 'Imagen'}
                                        </span>
                                        <span className="block text-[11px] opacity-80 truncate">
                                            {chosen.length ? `${chosen.length} versículo${chosen.length > 1 ? 's' : ''} · ${reference}` : 'Elige un versículo'}
                                        </span>
                                    </span>
                                </button>
                            </div>

                            {/* Feedback: rol status para lectores de pantalla. */}
                            <p
                                role="status"
                                aria-live="polite"
                                className={`mt-4 min-h-[20px] text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 ${
                                    message?.startsWith('¡') ? 'text-[#3D3D3A] dark:text-[#EDE9E1]' : 'text-[#A33]'
                                }`}
                            >
                                {message && <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                                {message}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
