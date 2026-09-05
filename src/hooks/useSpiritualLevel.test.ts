import { describe, it, expect } from 'vitest';
import { getSpiritualLevel, useSpiritualLevel } from './useSpiritualLevel';

describe('getSpiritualLevel', () => {
    it('arranca en Iniciado sin progreso', () => {
        const level = getSpiritualLevel(0);
        expect(level.title).toBe('Iniciado');
        expect(level.rank).toBe('Nivel 1');
        expect(level.progress).toBe(0);
    });

    it('alcanza Oyente Fiel con 3 favoritos', () => {
        const level = getSpiritualLevel(3);
        expect(level.title).toBe('Oyente Fiel');
        expect(level.nextTitle).toBe('Buscador');
    });

    it('calcula progreso relativo al siguiente nivel', () => {
        const level = getSpiritualLevel(4); // entre 3 (Oyente Fiel) y 7 (Buscador)
        expect(level.title).toBe('Oyente Fiel');
        expect(level.progress).toBeCloseTo(25);
    });

    it('nivel máximo Ungido sin siguiente consagración', () => {
        const level = getSpiritualLevel(500);
        expect(level.title).toBe('Ungido');
        expect(level.nextTitle).toBeUndefined();
        expect(level.progress).toBe(100);
    });

    it('mantiene alias hook deprecated', () => {
        expect(useSpiritualLevel(0).title).toBe('Iniciado');
    });
});
