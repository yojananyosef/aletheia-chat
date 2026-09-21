import type { MessageData } from './Message';

/** Tope del HTML prerenderizado: evita inflar capítulos largos (Salmos 119, etc.). */
export const PRERENDER_MAX_MESSAGES = 15;
/** Mínimo para no dejar un HTML anecdótico (p. ej. un solo título de sección). */
export const PRERENDER_MIN_MESSAGES = 5;

type PrerenderMessage = Pick<MessageData, 'speaker' | 'isSectionTitle'>;

/** Espejo de `Message.requiresManualAdvance` sin instanciar la clase (usable en server). */
export function requiresManualAdvanceData(msg: PrerenderMessage): boolean {
    if (msg.isSectionTitle) return true;
    return msg.speaker !== 'Narrador';
}

/**
 * Primeros mensajes para el HTML prerenderizado (SEO / sin JS):
 * avanza hasta cerrar en una pausa manual (Dios, personaje o título),
 * con mínimo PRERENDER_MIN_MESSAGES y tope PRERENDER_MAX_MESSAGES.
 */
export function selectPrerenderMessages<T extends PrerenderMessage>(messages: T[]): T[] {
    const out: T[] = [];
    for (const m of messages) {
        if (out.length >= PRERENDER_MAX_MESSAGES) break;
        out.push(m);
        if (out.length >= PRERENDER_MIN_MESSAGES && requiresManualAdvanceData(m)) break;
    }
    return out;
}
