/** Desbloqueo progresivo: un libro abre al completar el anterior.
 *
 * Reglas (puras, testeables):
 * - El primer libro siempre está abierto.
 * - Un libro abre si el anterior está completo (todos sus capítulos) o si
 *   ya fue visitado antes de esta mecánica (no se castiga a usuarios previos).
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
