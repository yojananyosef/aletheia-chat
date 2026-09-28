/**
 * Card de versículo dibujada a mano en <canvas> para compartir como imagen.
 *
 * Por qué canvas y no una captura del DOM: una captura arrastra el layout
 * responsive, el modo oscuro y el scroll — y necesita una librería de terceros
 * (html2canvas &c). La card es sintética, así que se dibuja con la API nativa:
 * cero dependencias, mismo resultado en cualquier viewport, y el texto se
 * compone con el mismo balance de líneas que el bubbles del chat.
 */

export interface ShareCardMessage {
    /**
     * Id estable del mensaje en el corpus (`g1_3b`). Necesario porque un mismo
     * versículo puede tener varios mensajes del mismo hablante (GEN 1:3 tiene
     * "Y dijo Dios:" y "Y fue la luz.", ambos del Narrador), así que
     * verso+hablante NO es una clave única.
     */
    id: string;
    /** Hablante (Dios, Adán, Narrador…). */
    speaker: string;
    /** Texto del mensaje. */
    text: string;
    /** Número de versículo. */
    verse: number;
}

export interface ShareCardSpec {
    /** Mensajes a dibujar, en orden de lectura. */
    messages: ShareCardMessage[];
    /** Referencia legible, p. ej. "Génesis 1:3-4". */
    reference: string;
    /** Pie de la card (URL del sitio). */
    footer?: string;
}

const W = 1080;
const H = 1350; // 4:5, el formato que se ve bien en WhatsApp e Instagram
const PAD = 72;

const PAPER = '#F7F4ED'; // el papel cálido real del feed, no el de las burbujas
const INK = '#141413';
const MUTED = '#57534E';
const ACCENT = '#FFD600';
const CARD_LINE = '#E6DFD8';
/** Relleno de las burbujas de personaje, tal cual en MessageBubble. */
const BUBBLE = '#EFE9DE';
/** Relleno de la burbuja de Dios, tal cual en MessageBubble. */
const BUBBLE_GOD = '#FAF9F5';

/**
 * Familia de la UI (Space Grotesk / Inter de next/font) con fallback de sistema.
 *
 * OJO con el peso: Space Grotesk solo se sirve de 300 a 700, así que pedir 900
 * en canvas no usa la fuente sino una synthesis del navegador que cae a una
 * genérica — el texto salía con otra tipografía sin avisar. Por eso el tope de
 * `displayWeight` es 700.
 */
const DISPLAY_WEIGHT = 700;

function readFonts(): { display: string; body: string } {
    if (typeof window === 'undefined') {
        return { display: 'sans-serif', body: 'sans-serif' };
    }
    const cs = getComputedStyle(document.documentElement);
    const pick = (v: string) => cs.getPropertyValue(v).trim();
    // next/font emite '"Space Grotesk", "Space Grotesk Fallback"': nos queda
    // con la primera familia, que es la real (la Fallback es la métrica).
    const first = (v: string) => v.split(',')[0].trim().replace(/^["']|["']$/g, '');
    const grotesk = pick('--font-grotesk');
    const inter = pick('--font-inter');
    return {
        display: grotesk ? `"${first(grotesk)}", sans-serif` : 'sans-serif',
        body: inter ? `"${first(inter)}", sans-serif` : 'sans-serif',
    };
}

/** Reparte el texto en líneas que quepan en maxWidth. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    for (const para of text.split('\n')) {
        const words = para.split(/\s+/).filter(Boolean);
        if (!words.length) { lines.push(''); continue; }
        let line = words[0]!;
        for (let i = 1; i < words.length; i++) {
            const next = `${line} ${words[i]!}`;
            if (ctx.measureText(next).width <= maxWidth) {
                line = next;
            } else {
                lines.push(line);
                line = words[i]!;
            }
        }
        lines.push(line);
    }
    return lines;
}

/**
 * Rectángulo redondeado sobre un path NUEVO.
 *
 * OJO: `ctx.roundRect` no llama a `beginPath()`, añade al path actual. Sin el
 * `beginPath` explícito de aquí, cada burbuja heredaba el trazo de la anterior y
 * su `fill()` repintaba encima del texto ya dibujado.
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
        return;
    }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/**
 * Elige el mayor tamaño de fuente (entre max y min) con el que el texto cabe
 * en maxHeight. Si ni el mínimo cabe, recorta con puntos suspensivos.
 */
function fitText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxHeight: number,
    lineHeight: (size: number) => number,
    max: number,
    min: number,
): { lines: string[]; size: number } {
    const font = readFonts().body;
    for (let size = max; size >= min; size -= 2) {
        ctx.font = `500 ${size}px ${font}`;
        const lines = wrap(ctx, text, maxWidth);
        if (lines.length * lineHeight(size) <= maxHeight) return { lines, size };
    }
    ctx.font = `500 ${min}px ${font}`;
    const lines = wrap(ctx, text, maxWidth);
    const fit = Math.max(1, Math.floor(maxHeight / lineHeight(min)));
    if (lines.length <= fit) return { lines, size: min };
    const kept = lines.slice(0, fit);
    kept[fit - 1] = `${kept[fit - 1]!.replace(/[.,;:]?$/, '')}…`;
    return { lines: kept, size: min };
}

/** Rellena el fondo con el patrón del chat en mosaico, como `.chat-feed`. */
function drawWallpaper(ctx: CanvasRenderingContext2D, pattern: CanvasPattern | null) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    if (!pattern) return;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, W, H);
}

/** Marco exterior + filete interior, como el borde de las tarjetas del sitio. */
function drawFrame(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, W - 12, H - 12);
    ctx.strokeStyle = CARD_LINE;
    ctx.lineWidth = 2;
    ctx.strokeRect(PAD - 18, PAD - 18, W - (PAD - 18) * 2, H - (PAD - 18) * 2);
    ctx.fillStyle = ACCENT;
    ctx.fillRect(PAD - 18, PAD - 18, W - (PAD - 18) * 2, 14);
}

/** Sello "ALETHEIA" arriba a la derecha, sobre una placa negra. */
function drawBrand(ctx: CanvasRenderingContext2D, fonts: { display: string }) {
    ctx.font = `${DISPLAY_WEIGHT} 28px ${fonts.display}`;
    const brand = 'ALETHEIA';
    const bw = ctx.measureText(brand).width;
    ctx.fillStyle = INK;
    roundRect(ctx, W - PAD - bw - 36, PAD + 44, bw + 36, 60, 8);
    ctx.fill();
    ctx.fillStyle = ACCENT;
    ctx.textBaseline = 'middle';
    ctx.fillText(brand, W - PAD - bw - 18, PAD + 76);
}

interface LaidOutBubble {
    m: ShareCardMessage;
    lines: string[];
    size: number;
    lh: number;
    h: number;
    boxX: number;
    boxW: number;
    /** Cromo ya escalado, para pintar con la misma medida con la que se midió. */
    pad: number;
    label: number;
    scale: number;
    /** Avatar a un lado, con su letra. */
    avatar: { cx: number; r: number; letter: string } | null;
}

const PAD_X = 34;
const LABEL_H = 40;
const RADIUS = 26;
const GAP = 30;
const AVATAR = 84;
/**
 * Margen reservado a los avatares. Viven FUERA de la caja (como en el chat) y
 * se recortan contra el filete interior, así que el ancho útil es menor que el
 * de la tarjeta. Sin descontarlos, el avatar de Dios se salía de la card.
 */
const AVATAR_GUTTER = AVATAR + 12;

/**
 * Cromo de una burbuja (relleno + cabecera) al 100% de escala. Escala también
 * con el ajuste global: con 8 mensajes, 108px fijos por burbuja son 864px de
 * puro adorno y no queda sitio para el texto. Al encogerse, las burbujas se
 * vuelven filas compactas en vez de recortarse.
 */
const chromeOf = (scale: number) => ({
    // Con muchos mensajes el relleno y la cabecera no se encogen tanto como la
    // tipografía: si lo hicieran a la misma proporción, la card quedaba hecha
    // de cajas diminutas con el texto ilegible. El cromo tiene su propio suelo.
    pad: Math.max(20, PAD_X * scale),
    label: Math.max(26, LABEL_H * scale),
});

/**
 * Mide una burbuja sin dibujarla. Medir antes de pintar es lo que permite
 * repartirlas en la card y garantizar que ninguna invade la referencia.
 */
function layoutBubble(
    ctx: CanvasRenderingContext2D,
    m: ShareCardMessage,
    maxW: number,
    maxH: number,
    scale = 1,
): LaidOutBubble {
    const isNarrator = m.speaker === 'Narrador';
    const isGod = m.speaker === 'Dios';
    const { pad, label } = chromeOf(scale);
    // La caja ocupa el ancho útil menos el margen del avatar (solo si lo lleva).
    const gutter = isNarrator ? 0 : Math.max(40, AVATAR_GUTTER * scale);
    const boxW = Math.min(maxW - gutter, 880);
    const textW = boxW - pad * 2;
    const { lines, size } = fitText(ctx, m.text, textW, maxH - pad * 2 - label, (s) => s * 1.34, 44 * scale, 16 * scale);
    const lh = size * 1.34;
    const h = pad * 2 + label + lh * lines.length;
    return {
        m, lines, size, lh, h, pad, label, scale,
        // El narrador se centra; los personajes se alinean al lado de su avatar
        // (Dios a la izquierda, el resto a la derecha, como en MessageBubble).
        boxX: isNarrator ? (maxW - boxW) / 2 : isGod ? gutter : 0,
        boxW,
        avatar: isNarrator
            ? null
            : {
                cx: isGod ? gutter / 2 : maxW - gutter / 2,
                r: Math.max(18, (AVATAR / 2) * scale),
                letter: (m.speaker[0] ?? '?').toUpperCase(),
            },
    };
}

/**
 * Escala mínima de tipografía antes de recortar mensajes. Con 8 versículos
 * largos el texto baja a ~15px: por debajo de eso leerlo en un móvil duele, así
 * que es preferible recortar a ofrecer una card ilegible.
 */
const MIN_SCALE = 0.4;

const measureAll = (
    ctx: CanvasRenderingContext2D,
    messages: ShareCardMessage[],
    maxW: number,
    maxH: number,
    scale: number,
): LaidOutBubble[] => messages.map((m) => layoutBubble(ctx, m, maxW, maxH, scale));

/** Pinta una burbuja ya medida, en su posición final. */
function paintBubble(
    ctx: CanvasRenderingContext2D,
    b: LaidOutBubble,
    x: number,
    y: number,
    fonts: { display: string; body: string },
) {
    const { m, lines, size, lh, h, boxX, boxW, avatar, pad, label } = b;
    const isNarrator = m.speaker === 'Narrador';
    const isGod = m.speaker === 'Dios';
    const bx = x + boxX;

    // Avatar primero: queda detrás de la caja, como en el chat. Alineado al
    // CENTRO VERTICAL de la caja para que no flote arriba ni se corte abajo.
    if (avatar) {
        const cy = y + h / 2;
        const r = Math.min(avatar.r, h / 2 - 4);
        ctx.beginPath();
        ctx.arc(x + avatar.cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = isGod ? ACCENT : BUBBLE;
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.font = `${DISPLAY_WEIGHT} ${Math.round(r * 0.86)}px ${fonts.display}`;
        ctx.fillStyle = INK;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(avatar.letter, x + avatar.cx, cy + 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
    }

    // Caja. El diálogo humano usa un borde macizo, como en el chat; el
    // narrador conserva el punteado que lo distingue allí también.
    ctx.fillStyle = isGod ? BUBBLE_GOD : BUBBLE;
    roundRect(ctx, bx, y, boxW, h, RADIUS);
    ctx.fill();
    ctx.save();
    if (isNarrator) ctx.setLineDash([12, 10]);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Cabecera. Se conserva la etiqueta del chat: Narrador arriba centrado y en
    // versúsculas, el resto a la izquierda con su versículo a la derecha. Todas
    // las medidas usan el cromo YA escalado, para que lo pintado coincida con
    // lo medido.
    if (isNarrator) {
        ctx.font = `700 ${Math.round(21 * b.scale)}px ${fonts.display}`;
        ctx.fillStyle = MUTED;
        ctx.textAlign = 'center';
        ctx.fillText(`V.${m.verse} NARRADOR`, bx + boxW / 2, y + pad);
        ctx.textAlign = 'left';
    } else {
        ctx.font = `700 ${Math.round(23 * b.scale)}px ${fonts.display}`;
        ctx.fillStyle = isGod ? INK : MUTED;
        ctx.textAlign = 'left';
        ctx.fillText(m.speaker.toUpperCase(), bx + pad, y + pad);
        ctx.font = `700 ${Math.round(21 * b.scale)}px ${fonts.body}`;
        ctx.fillStyle = MUTED;
        ctx.textAlign = 'right';
        ctx.fillText(`V.${m.verse}`, bx + boxW - pad, y + pad + 1);
        ctx.textAlign = 'left';
    }

    // Texto
    ctx.textBaseline = 'top';
    ctx.font = `500 ${size}px ${fonts.body}`;
    ctx.fillStyle = INK;
    lines.forEach((l, i) => ctx.fillText(l, bx + pad, y + pad + label + i * lh));
}

/** Dibuja la card. Exportado para poder inspeccionarla en tests. */
export function drawShareCard(
    ctx: CanvasRenderingContext2D,
    spec: ShareCardSpec,
    pattern: CanvasPattern | null = null,
) {
    const fonts = readFonts();
    drawWallpaper(ctx, pattern);
    drawFrame(ctx);
    drawBrand(ctx, fonts);

    const inner = W - PAD * 2;
    const refY = H - PAD - 96;
    const top = PAD + 132;
    const disponible = refY - 44 - top;

    // 1) MEDIR: se busca la mayor escala con la que la selección COMPLETA quepa.
    //    Reduce a la vez tipografía, cromo y hueco entre burbujas — con 8
    //    mensajes, 108px de relleno fijo por burbuja son 864px de adorno y no
    //    queda sitio para el texto. Medir solo contra un tope por burbuja hacía
    //    que cada una pareciera caber y el conjunto se pasara: se truncaban 4
    //    de 8 mensajes en silencio.
    const n = spec.messages.length;
    const gapFor = (count: number) => Math.max(8, GAP * Math.min(1, count / 4));
    const fit = (scale: number) => {
        const g = gapFor(n);
        const porBurbuja = (disponible - g * Math.max(0, n - 1)) / Math.max(1, n);
        return measureAll(ctx, spec.messages, inner, porBurbuja, scale);
    };
    const alto = (l: LaidOutBubble[], count: number) =>
        l.slice(0, count).reduce((a, b) => a + b.h, 0) + gapFor(count) * Math.max(0, count - 1);

    let scale = 1;
    let laid = fit(scale);
    while (alto(laid, n) > disponible && scale > MIN_SCALE) {
        scale -= 0.03;
        laid = fit(scale);
    }

    // 2) Si ni con la escala mínima cabe, se recorta la cola. Es el único caso
    //    en que se pierde contenido, y MAX_SELECTION lo mantiene raro.
    while (laid.length > 1 && alto(laid, laid.length) > disponible) {
        laid = laid.slice(0, -1);
    }

    const g = gapFor(laid.length);
    const total = laid.reduce((a, b) => a + b.h, 0) + g * Math.max(0, laid.length - 1);

    // 3) PINTAR de arriba abajo, centrado si sobra espacio.
    let y = top + Math.max(0, (disponible - total) / 2);
    for (const b of laid) {
        paintBubble(ctx, b, PAD, y, fonts);
        y += b.h + g;
    }

    // Referencia
    ctx.font = `${DISPLAY_WEIGHT} 42px ${fonts.display}`;
    ctx.fillStyle = INK;
    ctx.textBaseline = 'middle';
    ctx.fillText(spec.reference, PAD, refY);

    // Pie
    if (spec.footer) {
        ctx.font = `700 28px ${fonts.body}`;
        ctx.fillStyle = MUTED;
        ctx.fillText(spec.footer, PAD, refY + 52);
    }
}

/**
 * Carga el muro del chat como textura repetida. Reutiliza el mismo SVG que
 * `.chat-feed` para que la card se lea como un recorte de la app y no como un
 * cartel aparte. Si falla, la card sale solo con el papel: es decorativo.
 */
async function loadPattern(ctx: CanvasRenderingContext2D): Promise<CanvasPattern | null> {
    if (typeof Image === 'undefined') return null;
    try {
        const res = await fetch('/chat-pattern.svg');
        if (!res.ok) return null;
        const svg = await res.text();
        const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        // <img> + decode(): createImageBitmap() con un Blob SVG falla en varios
        // navegadores, y el ImageBitmap tampoco siempre implementa createPattern.
        const img = new Image();
        img.src = url;
        await img.decode();
        // El SVG es 480x480 y el feed lo tesela a 480px: mismo tamaño aquí.
        return ctx.createPattern(img, 'repeat');
    } catch {
        return null;
    }
}

/**
 * Renderiza la card y devuelve el PNG como Blob. Espera a las fuentes de
 * next/font: sin eso `measureText` usa la fallback y el ajuste de líneas sale
 * mal, que es justo lo que decide el tamaño de cada burbuja.
 */
export async function createShareCard(spec: ShareCardSpec): Promise<Blob> {
    if (typeof document !== 'undefined' && 'fonts' in document) {
        try { await (document as Document & { fonts: FontFaceSet }).fonts.ready; } catch { /* sin FontFaceSet */ }
    }
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Sin contexto 2D: no se puede generar la card.');
    const pattern = await loadPattern(ctx);
    drawShareCard(ctx, spec, pattern);
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('El canvas no devolvió imagen.'))),
            'image/png',
        );
    });
}

/** Nombre de archivo estable y legible: genesis-1-3.png */
export function cardFilename(reference: string): string {
    const slug = reference
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${slug || 'versiculo'}.png`;
}

/** Dispara la descarga del PNG (fallback cuando no hay Web Share con archivos). */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Libera el object URL en el siguiente turno para no cancelar la descarga.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ShareImageOutcome = 'shared' | 'downloaded' | 'cancelled';

/**
 * Comparte el PNG con la Web Share API aceptando `files` (Android Chrome,
 * iOS 15+). Si el navegador no soporta compartir —con o sin archivos— cae
 * siempre a la descarga: pidió la imagen, se la entregamos, y desde la galería
 * la puede reenviar. Nunca se le niega la imagen.
 */
export async function shareImage(
    blob: Blob,
    filename: string,
    title: string,
): Promise<ShareImageOutcome> {
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
    };
    if (typeof nav.share === 'function' && (!nav.canShare || nav.canShare({ files: [file] }))) {
        try {
            await nav.share({ files: [file], title });
            return 'shared';
        } catch (err) {
            // AbortError = el usuario cerró la hoja: silencio, no es un fallo.
            // Cualquier otro error (NotAllowedError por falta de gesto, target no
            // soportado) cae a la descarga: el objetivo es que la imagen llegue.
            if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
            downloadBlob(blob, filename);
            return 'downloaded';
        }
    }
    // Sin Web Share, o sin soporte de archivos: la descarga entrega igual.
    downloadBlob(blob, filename);
    return 'downloaded';
}
