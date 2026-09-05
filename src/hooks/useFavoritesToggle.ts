'use client';

import { useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import type { FavoriteMessage } from '../core/domain/Message';

export interface FavoriteInput {
    id: string;
    bookId: string;
    bookName: string;
    chapter: number;
    speaker: FavoriteMessage['speaker'];
    text: string;
    verse: number;
    isSectionTitle?: boolean;
}

/**
 * Toggle único de favoritos (Fase 1): añade si falta, borra si existe.
 * Misma firma para Home, Chat y Drawer.
 */
export const useFavoritesToggle = () => {
    const { favorites, setFavorites } = usePersistentState();

    const isFavorite = useCallback(
        (bookId: string, id: string) =>
            favorites.some((f) => f.bookId === bookId && f.id === id),
        [favorites]
    );

    const toggleFavorite = useCallback(
        (id: string, bookId: string, data?: Omit<FavoriteInput, 'id' | 'bookId'>) => {
            setFavorites((prev) => {
                if (prev.some((f) => f.bookId === bookId && f.id === id)) {
                    return prev.filter((f) => !(f.bookId === bookId && f.id === id));
                }
                if (!data) return prev;
                return [...prev, { id, bookId, ...data }];
            });
        },
        [setFavorites]
    );

    return { favorites, isFavorite, toggleFavorite };
};
