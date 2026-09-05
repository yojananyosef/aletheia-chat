import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBookFilter, normalizeEs } from './useBookFilter';
import { BIBLE_BOOKS } from '../constants/books';

describe('useBookFilter', () => {
    it('sin query devuelve todo el canon', () => {
        const { result } = renderHook(() => useBookFilter(''));
        expect(result.current.filteredBooks).toHaveLength(BIBLE_BOOKS.length);
    });

    it('filtra por nombre', () => {
        const { result } = renderHook(() => useBookFilter('génesis'));
        expect(result.current.filteredBooks.map(b => b.id)).toEqual(['genesis']);
    });

    it('es insensible a tildes, mayúsculas y espacios', () => {
        for (const q of ['genesis', 'GÉNESIS', '  génesis  ', 'GENESIS']) {
            const { result } = renderHook(() => useBookFilter(q));
            expect(result.current.filteredBooks.map(b => b.id)).toEqual(['genesis']);
        }
    });

    it('filtra por categoría', () => {
        const { result } = renderHook(() => useBookFilter('poesia'));
        expect(result.current.filteredBooks.length).toBeGreaterThan(0);
        expect(result.current.filteredBooks.every(b => b.category === 'Poesía')).toBe(true);
    });

    it('query sin coincidencias devuelve vacío', () => {
        const { result } = renderHook(() => useBookFilter('apócrifo'));
        expect(result.current.filteredBooks).toHaveLength(0);
    });

    it('normalizeEs recorta y quita diacríticos', () => {
        expect(normalizeEs('  Génesis  ')).toBe('genesis');
        expect(normalizeEs('Éxodo')).toBe('exodo');
    });
});
