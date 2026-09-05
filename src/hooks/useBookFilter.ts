import { useMemo } from 'react';
import { BIBLE_BOOKS } from '../constants/books';

/** Normaliza para búsqueda ES: trim + minúsculas + sin tildes (`génesis` = `genesis`). */
export const normalizeEs = (s: string): string =>
    s.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

/** Filtro controlado: `query` viene del estado global (UIState), sin copia local. */
export const useBookFilter = (query: string = '') => {
    const filteredBooks = useMemo(() => {
        const q = normalizeEs(query);
        if (!q) return BIBLE_BOOKS;
        return BIBLE_BOOKS.filter(
            (b) => normalizeEs(b.name).includes(q) || normalizeEs(b.category).includes(q)
        );
    }, [query]);

    return { filteredBooks };
};
