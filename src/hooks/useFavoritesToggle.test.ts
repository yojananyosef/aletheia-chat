import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { PersistentStateProvider } from '../context/PersistentStateContext';
import { useFavoritesToggle } from './useFavoritesToggle';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(PersistentStateProvider, null, children);

const FAV = {
    bookName: 'Génesis',
    chapter: 1,
    speaker: 'Dios',
    text: '¡Que haya luz!',
    verse: 3,
};

describe('useFavoritesToggle', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('añade si falta y borra si existe (misma firma)', () => {
        const { result } = renderHook(() => useFavoritesToggle(), { wrapper });

        expect(result.current.isFavorite('genesis', 'g1_3b')).toBe(false);

        act(() => result.current.toggleFavorite('g1_3b', 'genesis', FAV));
        expect(result.current.isFavorite('genesis', 'g1_3b')).toBe(true);

        act(() => result.current.toggleFavorite('g1_3b', 'genesis'));
        expect(result.current.isFavorite('genesis', 'g1_3b')).toBe(false);
    });

    it('sin datos no añade fantasmas', () => {
        const { result } = renderHook(() => useFavoritesToggle(), { wrapper });

        act(() => result.current.toggleFavorite('g1_3b', 'genesis'));
        expect(result.current.isFavorite('genesis', 'g1_3b')).toBe(false);
    });
});
