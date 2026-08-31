'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react';
import { FavoriteMessage } from '../types/bible';
import { BIBLE_BOOKS } from '../constants/books';
import { StorageService } from '../core/services/StorageService';

const FAVORITES_STORAGE_KEY = 'naas:v1:favorites';
const EMPTY_FAVORITES: FavoriteMessage[] = [];

type FavoritesListener = () => void;
const listeners = new Set<FavoritesListener>();

let favoritesCache: FavoriteMessage[] | null = null;

function readFavorites(): FavoriteMessage[] {
    if (favoritesCache === null) {
        favoritesCache = StorageService.getFavorites();
    }
    return favoritesCache;
}

function writeFavorites(next: FavoriteMessage[]): void {
    favoritesCache = next;
    StorageService.setFavorites(next);
    listeners.forEach(listener => listener());
}

function subscribeFavorites(listener: FavoritesListener): () => void {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
        if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
            favoritesCache = null;
            listener();
        }
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
}

interface PersistentState {
    favorites: FavoriteMessage[];
    setFavorites: React.Dispatch<React.SetStateAction<FavoriteMessage[]>>;
    getInitialChapter: (bookId: string) => number;
}

const PersistentStateContext = createContext<PersistentState | undefined>(undefined);

export const PersistentStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const favorites = useSyncExternalStore(
        subscribeFavorites,
        readFavorites,
        () => EMPTY_FAVORITES
    );

    const setFavorites = useCallback((update: React.SetStateAction<FavoriteMessage[]>) => {
        const current = readFavorites();
        const next = typeof update === 'function' ? update(current) : update;
        writeFavorites(next);
    }, []);

    const getInitialChapter = useCallback((bookId: string): number => {
        const book = BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return 1;
        const saved = StorageService.getLastChapter(bookId);
        return saved !== null && book.availableChapters.includes(saved)
            ? saved
            : (book.availableChapters[0] || 1);
    }, []);

    return (
        <PersistentStateContext.Provider value={{
            favorites,
            setFavorites,
            getInitialChapter,
        }}>
            {children}
        </PersistentStateContext.Provider>
    );
};

export const usePersistentState = () => {
    const context = useContext(PersistentStateContext);
    if (!context) throw new Error('usePersistentState must be used within a PersistentStateProvider');
    return context;
};
