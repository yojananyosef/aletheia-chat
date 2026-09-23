import { describe, it, expect } from 'vitest';
import {
    AT_BOOK_IDS,
    NT_BOOK_IDS,
    TOTAL_BOOKS,
    TOTAL_CHAPTERS,
    AT_CHAPTERS,
    NT_CHAPTERS,
    computeReadingStats,
    isBookComplete,
} from './readingProgress';
import { BIBLE_BOOKS } from '../constants/books';

describe('canon totals', () => {
    it('66 libros y 1189 capítulos (AT 929 / NT 260)', () => {
        expect(TOTAL_BOOKS).toBe(66);
        expect(AT_BOOK_IDS).toHaveLength(39);
        expect(NT_BOOK_IDS).toHaveLength(27);
        expect(TOTAL_CHAPTERS).toBe(1189);
        expect(AT_CHAPTERS).toBe(929);
        expect(NT_CHAPTERS).toBe(260);
        expect(AT_CHAPTERS + NT_CHAPTERS).toBe(TOTAL_CHAPTERS);
    });
});

describe('computeReadingStats', () => {
    it('vacío: todo en cero', () => {
        const s = computeReadingStats(() => false);
        expect(s).toMatchObject({
            completedChapters: 0,
            completedBooks: 0,
            atComplete: false,
            ntComplete: false,
            bibleComplete: false,
        });
    });

    it('1 capítulo no completa libro', () => {
        const s = computeReadingStats((b, c) => b === 'genesis' && c === 1);
        expect(s.completedChapters).toBe(1);
        expect(s.completedBooks).toBe(0);
    });

    it('libro corto de 1 cap (abdias) cuenta como libro', () => {
        const s = computeReadingStats((b, c) => b === 'abdias' && c === 1);
        expect(s.completedChapters).toBe(1);
        expect(s.completedBooks).toBe(1);
    });

    it('Biblia completa con todo true', () => {
        const s = computeReadingStats(() => true);
        expect(s.completedChapters).toBe(1189);
        expect(s.completedBooks).toBe(66);
        expect(s.atBooks).toBe(39);
        expect(s.ntBooks).toBe(27);
        expect(s.bibleComplete).toBe(true);
    });

    it('isBookComplete exige todos los capítulos', () => {
        const rut = BIBLE_BOOKS.find((b) => b.id === 'rut')!;
        expect(isBookComplete(rut, () => true)).toBe(true);
        expect(isBookComplete(rut, (_b, c) => c !== 4)).toBe(false);
    });
});
