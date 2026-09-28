/** Desbloqueo progresivo: un libro abre al completar el anterior.
 *
 * Reglas (puras, testeables):
 * - El primer libro siempre está abierto.
 * - Un libro abre si el anterior está completo (todos sus capítulos) o si
 *   ya fue visitado antes de esta mecánica (no se castiga a usuarios previos).
 *
 * OJO — `isVisited` solo debe reflejar lectura PROPIA. Si escribir un deep-link
 * marcara "visitado", mandar un enlace de Éxodo 5 dejaría Éxodo abierto para
 * siempre sin haber leído nada. Por eso el acceso por enlace va aparte
 * (StorageService.getLinkedChapter) y no cuenta como visita.
 */
export function computeUnlocked(
    order: { id: string; availableChapters: number[] }[],
    isComplete: (book: string, chapter: number) => boolean,
    isVisited: (book: string) => boolean,
): Set<string> {
    const open = new Set<string>();
    order.forEach((book, i) => {
        if (i === 0) {
            open.add(book.id);
            return;
        }
        const prev = order[i - 1];
        const prevComplete = prev.availableChapters.every((ch) => isComplete(prev.id, ch));
        if (prevComplete || isVisited(book.id)) open.add(book.id);
    });
    return open;
}

/**
 * Estado de apertura de UN libro. Existe para que el Home y el Chat apliquen
 * exactamente la misma regla: si se divergentan, un deep-link puede abrir un
 * libro en el chat que el Home sigue mostrando bloqueado (o al revés).
 */
export function isUnlocked(
    order: { id: string; availableChapters: number[] }[],
    bookId: string,
    isComplete: (book: string, chapter: number) => boolean,
    isVisited: (book: string) => boolean,
): boolean {
    return computeUnlocked(order, isComplete, isVisited).has(bookId);
}
