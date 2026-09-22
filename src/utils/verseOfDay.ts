/** Versículo del día: rotación determinista por fecha (sin backend). */

export interface VerseRef {
    book: string;
    bookName: string;
    chapter: number;
    verse: number;
    label: string;
}

export const VERSE_ROTATION: VerseRef[] = [
    { book: 'genesis', bookName: 'Génesis', chapter: 1, verse: 3, label: 'Génesis 1:3' },
    { book: 'salmos', bookName: 'Salmos', chapter: 23, verse: 1, label: 'Salmos 23:1' },
    { book: 'proverbios', bookName: 'Proverbios', chapter: 3, verse: 5, label: 'Proverbios 3:5' },
    { book: 'isaias', bookName: 'Isaías', chapter: 41, verse: 10, label: 'Isaías 41:10' },
    { book: 'jeremias', bookName: 'Jeremías', chapter: 29, verse: 11, label: 'Jeremías 29:11' },
    { book: 'mateo', bookName: 'Mateo', chapter: 11, verse: 28, label: 'Mateo 11:28' },
    { book: 'juan', bookName: 'Juan', chapter: 3, verse: 16, label: 'Juan 3:16' },
    { book: 'romanos', bookName: 'Romanos', chapter: 8, verse: 28, label: 'Romanos 8:28' },
    { book: 'filipenses', bookName: 'Filipenses', chapter: 4, verse: 13, label: 'Filipenses 4:13' },
    { book: 'salmos', bookName: 'Salmos', chapter: 91, verse: 1, label: 'Salmos 91:1' },
];

function dayOfYear(d: Date): number {
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function pickVerseOfDay(date: Date = new Date()): VerseRef {
    return VERSE_ROTATION[dayOfYear(date) % VERSE_ROTATION.length];
}
