'use client';

import { useEffect, useState } from 'react';
import { BibleDataService } from '../core/services/BibleDataService';
import { StorageService } from '../core/services/StorageService';
import { usePersistentState } from './usePersistentState';
import { pickVerseOfDay } from '../utils/verseOfDay';

export interface Story {
    id: string;
    eyebrow: string;
    title: string;
    text: string;
    /** Origen para compartir/leer más (ausente en tarjetas sin capítulo). */
    ref?: { bookId: string; bookName: string; chapter: number };
}

/** Historias del home: versículo del día + racha + favorito. Solo cliente. */
export function useStories(enabled: boolean): { stories: Story[]; loading: boolean } {
    const { favorites } = usePersistentState();
    const [verseText, setVerseText] = useState<string | null>(null);

    const ref = pickVerseOfDay();
    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        BibleDataService.loadChapter(ref.book, ref.chapter)
            .then((data) => {
                if (cancelled) return;
                const parts = data.messages.filter(
                    (m) => m.verse === ref.verse && !m.isTitle(),
                );
                if (parts.length) setVerseText(parts.map((m) => m.text).join(' '));
            })
            .catch(() => {
                if (!cancelled) setVerseText(null);
            });
        return () => {
            cancelled = true;
        };
        // La ref depende solo de la fecha: se fija por montaje.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    if (!enabled) return { stories: [], loading: false };

    const stories: Story[] = [];
    stories.push({
        id: 'versiculo-del-dia',
        eyebrow: 'Versículo del día',
        title: ref.label,
        text: verseText ?? 'Cargando la palabra de hoy…',
        ref: { bookId: ref.book, bookName: ref.bookName, chapter: ref.chapter },
    });

    const streak = StorageService.getStreak();
    stories.push({
        id: 'racha',
        eyebrow: 'Tu racha',
        title: streak === 1 ? '1 día' : `${streak} días`,
        text:
            streak > 0
                ? 'Sigue así: cada día de lectura enciende tu racha.'
                : 'Lee hoy tu primer capítulo y enciende tu racha.',
    });

    if (favorites.length > 0) {
        const fav = favorites[favorites.length - 1];
        stories.push({
            id: `fav-${fav.id}`,
            eyebrow: 'De tus favoritos',
            title: `${fav.bookName} ${fav.chapter}:${fav.verse}`,
            text: fav.text,
            ref: { bookId: fav.bookId, bookName: fav.bookName, chapter: fav.chapter },
        });
    }

    return { stories, loading: verseText === null };
}
