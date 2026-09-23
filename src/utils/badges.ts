/** Badges de lectura del perfil: derivados puros de ReadingStats (sin storage propio). */

import type { ReadingStats } from './readingProgress';
import { TOTAL_BOOKS, TOTAL_CHAPTERS } from './readingProgress';

export interface Badge {
    id: string;
    title: string;
    description: string;
    /** Letra/monograma para el medallón (estilo neo-brutalista del perfil). */
    icon: string;
    unlocked: boolean;
    /** 0-100 para la mini-barra de los bloqueados. */
    progress: number;
    /** Texto tipo "3/66 libros" o "260/260 caps". */
    detail: string;
}

const pct = (done: number, goal: number): number =>
    goal <= 0 ? 100 : Math.min(100, Math.floor((done / goal) * 100));

/** 6 hitos clave de lectura: 1 cap → 1 libro → 10 libros → NT → AT → Biblia. */
export function getBadges(stats: ReadingStats): Badge[] {
    const firstChapter = stats.completedChapters >= 1;
    const firstBook = stats.completedBooks >= 1;
    const tenBooks = stats.completedBooks >= 10;

    return [
        {
            id: 'primer-capitulo',
            title: 'Primer Paso',
            description: 'Completa tu primer capítulo',
            icon: '1',
            unlocked: firstChapter,
            progress: firstChapter ? 100 : pct(stats.completedChapters, 1),
            detail: firstChapter ? '1/1 cap' : '0/1 cap',
        },
        {
            id: 'primer-libro',
            title: 'Libro Entero',
            description: 'Completa un libro de principio a fin',
            icon: 'B',
            unlocked: firstBook,
            progress: firstBook ? 100 : 0,
            detail: `${Math.min(stats.completedBooks, TOTAL_BOOKS)}/1 libro`,
        },
        {
            id: 'diez-libros',
            title: 'Peregrino',
            description: 'Completa 10 libros',
            icon: 'X',
            unlocked: tenBooks,
            progress: tenBooks ? 100 : pct(stats.completedBooks, 10),
            detail: `${Math.min(stats.completedBooks, TOTAL_BOOKS)}/10 libros`,
        },
        {
            id: 'nt-completo',
            title: 'Nuevo Pacto',
            description: 'Completa el Nuevo Testamento (27 libros)',
            icon: 'N',
            unlocked: stats.ntComplete,
            progress: stats.ntComplete ? 100 : pct(stats.ntBooks, 27),
            detail: `${stats.ntBooks}/27 libros`,
        },
        {
            id: 'at-completo',
            title: 'Antiguo Pacto',
            description: 'Completa el Antiguo Testamento (39 libros)',
            icon: 'A',
            unlocked: stats.atComplete,
            progress: stats.atComplete ? 100 : pct(stats.atBooks, 39),
            detail: `${stats.atBooks}/39 libros`,
        },
        {
            id: 'biblia-completa',
            title: 'Palabra Plena',
            description: `Completa toda la Biblia (${TOTAL_BOOKS} libros)`,
            icon: '★',
            unlocked: stats.bibleComplete,
            progress: stats.bibleComplete ? 100 : pct(stats.completedChapters, TOTAL_CHAPTERS),
            detail: `${stats.completedChapters}/${TOTAL_CHAPTERS} caps`,
        },
    ];
}
