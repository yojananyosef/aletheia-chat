import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookFilter } from './useBookFilter';
import { BIBLE_BOOKS } from '../constants/books';

describe('useBookFilter', () => {
    it('sin query devuelve todo el canon', () => {
        const { result } = renderHook(() => useBookFilter(''));
        expect(result.current.filteredBooks).toHaveLength(BIBLE_BOOKS.length);
    });

    it('filtra por nombre', () => {
        const { result } = renderHook(() => useBookFilter(''));
        act(() => result.current.setQuery('génesis'));
        expect(result.current.filteredBooks.map(b => b.id)).toEqual(['genesis']);
    });

    it('filtra por categoría', () => {
        const { result } = renderHook(() => useBookFilter(''));
        act(() => result.current.setQuery('poesía'));
        expect(result.current.filteredBooks.length).toBeGreaterThan(0);
        expect(result.current.filteredBooks.every(b => b.category === 'Poesía')).toBe(true);
    });

    it('query sin coincidencias devuelve vacío', () => {
        const { result } = renderHook(() => useBookFilter(''));
        act(() => result.current.setQuery('apócrifo'));
        expect(result.current.filteredBooks).toHaveLength(0);
    });
});
