/** Progreso de lectura canónico: capítulos/libros/AT/NT/Biblia. Funciones puras. */

import { BIBLE_BOOKS } from '../constants/books';
import type { BookInfo } from '../types/bible';

export const AT_BOOK_IDS: readonly string[] = [
    'genesis', 'exodus', 'levitico', 'numeros', 'deuteronomio',
    'josue', 'jueces', 'rut', '1samuel', '2samuel', '1reyes', '2reyes',
    '1cronicas', '2cronicas', 'esdras', 'nehemias', 'ester',
    'job', 'salmos', 'proverbios', 'eclesiastes', 'cantares',
    'isaias', 'jeremias', 'lamentaciones', 'ezequiel', 'daniel',
    'oseas', 'joel', 'amos', 'abdias', 'jonas', 'miqueas', 'nahum',
    'habacuc', 'sofonias', 'hageo', 'zacarias', 'malaquias',
];

export const NT_BOOK_IDS: readonly string[] = [
    'mateo', 'marcos', 'lucas', 'juan', 'hechos',
    'romanos', '1corintios', '2corintios', 'galatas', 'efesios',
    'filipenses', 'colosenses', '1tesalonicenses', '2tesalonicenses',
    '1timoteo', '2timoteo', 'tito', 'filemon',
    'hebreos', 'santiago', '1pedro', '2pedro', '1juan', '2juan',
    '3juan', 'judas', 'apocalipsis',
];

function chaptersOf(id: string, books: readonly BookInfo[] = BIBLE_BOOKS): number[] {
    return books.find((b) => b.id === id)?.availableChapters ?? [];
}

export const TOTAL_BOOKS = BIBLE_BOOKS.length; // 66
export const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((n, b) => n + b.availableChapters.length, 0); // 1189
export const AT_CHAPTERS = AT_BOOK_IDS.reduce((n, id) => n + chaptersOf(id).length, 0); // 929
export const NT_CHAPTERS = NT_BOOK_IDS.reduce((n, id) => n + chaptersOf(id).length, 0); // 260

export interface ReadingStats {
    completedChapters: number;
    completedBooks: number;
    atChapters: number;
    ntChapters: number;
    atBooks: number;
    ntBooks: number;
    atComplete: boolean;
    ntComplete: boolean;
    bibleComplete: boolean;
}

/** Un libro está completo cuando todos sus capítulos disponibles lo están. */
export function isBookComplete(
    book: BookInfo,
    isChapterComplete: (bookId: string, chapter: number) => boolean,
): boolean {
    if (book.availableChapters.length === 0) return false;
    return book.availableChapters.every((c) => isChapterComplete(book.id, c));
}

export function computeReadingStats(
    isChapterComplete: (bookId: string, chapter: number) => boolean,
    books: readonly BookInfo[] = BIBLE_BOOKS,
): ReadingStats {
    let completedChapters = 0;
    let completedBooks = 0;
    let atChapters = 0;
    let ntChapters = 0;
    let atBooks = 0;
    let ntBooks = 0;
    const atSet = new Set(AT_BOOK_IDS);
    const ntSet = new Set(NT_BOOK_IDS);

    for (const b of books) {
        let bookDone = true;
        for (const c of b.availableChapters) {
            if (isChapterComplete(b.id, c)) {
                completedChapters++;
                if (atSet.has(b.id)) atChapters++;
                if (ntSet.has(b.id)) ntChapters++;
            } else {
                bookDone = false;
            }
        }
        if (bookDone && b.availableChapters.length > 0) {
            completedBooks++;
            if (atSet.has(b.id)) atBooks++;
            if (ntSet.has(b.id)) ntBooks++;
        }
    }

    const atComplete = atBooks === AT_BOOK_IDS.length;
    const ntComplete = ntBooks === NT_BOOK_IDS.length;
    return {
        completedChapters,
        completedBooks,
        atChapters,
        ntChapters,
        atBooks,
        ntBooks,
        atComplete,
        ntComplete,
        bibleComplete: atComplete && ntComplete,
    };
}
