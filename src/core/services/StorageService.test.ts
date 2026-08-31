import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from './StorageService';
import { FavoriteMessage } from '../../types/bible';

const favorite: FavoriteMessage = {
    id: 'g1_1',
    speaker: 'Narrador',
    text: 'En el principio, Dios creó los cielos y la tierra.',
    verse: 1,
    bookId: 'genesis',
    bookName: 'Génesis',
    chapter: 1,
};

beforeEach(() => {
    window.localStorage.clear();
});

describe('StorageService — favoritos', () => {
    it('roundtrip: guarda y recupera favoritos validados', () => {
        StorageService.setFavorites([favorite]);
        expect(StorageService.getFavorites()).toEqual([favorite]);
    });

    it('devuelve [] con JSON corrupto', () => {
        window.localStorage.setItem('naas:v1:favorites', '{no-json');
        expect(StorageService.getFavorites()).toEqual([]);
    });

    it('descarta favoritos que no pasan el schema Zod', () => {
        window.localStorage.setItem('naas:v1:favorites', JSON.stringify([{ foo: 'bar' }]));
        expect(StorageService.getFavorites()).toEqual([]);
    });

    it('migra desde la clave legacy bible_favorites', () => {
        window.localStorage.setItem('bible_favorites', JSON.stringify([favorite]));
        expect(StorageService.getFavorites()).toEqual([favorite]);
        expect(window.localStorage.getItem('naas:v1:favorites')).not.toBeNull();
        // la clave legacy se conserva hasta confirmar escritura
        expect(window.localStorage.getItem('bible_favorites')).not.toBeNull();
    });
});

describe('StorageService — settings', () => {
    it('devuelve defaults cuando no hay nada guardado', () => {
        expect(StorageService.getSettings()).toEqual({ isMuted: false, readingSpeed: 1 });
    });

    it('migra isMuted y readingSpeedMultiplier legacy', () => {
        window.localStorage.setItem('isMuted', 'true');
        window.localStorage.setItem('readingSpeedMultiplier', '2');
        expect(StorageService.getSettings()).toEqual({ isMuted: true, readingSpeed: 2 });
    });
});

describe('StorageService — progreso de lectura', () => {
    it('roundtrip de progreso por libro y capítulo', () => {
        expect(StorageService.getProgress('genesis', 1)).toBeNull();
        StorageService.setProgress('genesis', 1, 7);
        expect(StorageService.getProgress('genesis', 1)).toBe(7);
        StorageService.clearProgress('genesis', 1);
        expect(StorageService.getProgress('genesis', 1)).toBeNull();
    });

    it('migra chatProgress legacy y clearProgress borra ambas claves', () => {
        window.localStorage.setItem('chatProgress_exodus_2', '4');
        expect(StorageService.getProgress('exodus', 2)).toBe(4);
        StorageService.clearProgress('exodus', 2);
        expect(window.localStorage.getItem('chatProgress_exodus_2')).toBeNull();
        expect(window.localStorage.getItem('naas:v1:progress:exodus:2')).toBeNull();
    });
});

describe('StorageService — último capítulo visitado', () => {
    it('migra lastChapter legacy', () => {
        window.localStorage.setItem('lastChapter_genesis', '3');
        expect(StorageService.getLastChapter('genesis')).toBe(3);
    });

    it('setLastChapter escribe la clave versionada', () => {
        StorageService.setLastChapter('exodus', 4);
        expect(window.localStorage.getItem('naas:v1:lastChapter:exodus')).toBe('4');
        expect(StorageService.getLastChapter('exodus')).toBe(4);
    });
});
