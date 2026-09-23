import { describe, it, expect } from 'vitest';
import {
    computeXP,
    getLevelByXP,
    XP_LEVELS,
    MAX_XP_GOAL,
    XP_PER_CHAPTER,
    XP_PER_FAVORITE,
    MAX_COUNTED_FAVORITES,
    XP_PER_STREAK_DAY,
} from './xp';

describe('computeXP', () => {
    it('capítulos mandan: 10 XP por cap', () => {
        expect(computeXP({ chapters: 3, favorites: 0, streak: 0 })).toBe(3 * XP_PER_CHAPTER);
    });

    it('favoritos topados a 50 (anti-farmer)', () => {
        const capped = computeXP({ chapters: 0, favorites: 500, streak: 0 });
        expect(capped).toBe(MAX_COUNTED_FAVORITES * XP_PER_FAVORITE);
    });

    it('racha suma 5 XP por día', () => {
        expect(computeXP({ chapters: 0, favorites: 0, streak: 7 })).toBe(7 * XP_PER_STREAK_DAY);
    });

    it('sanea ceros y negativos', () => {
        expect(computeXP({ chapters: -2, favorites: NaN, streak: -1 })).toBe(0);
    });
});

describe('getLevelByXP (20 niveles gamer)', () => {
    it('20 umbrales estrictamente crecientes', () => {
        expect(XP_LEVELS).toHaveLength(20);
        const mins = XP_LEVELS.map((l) => l.min);
        expect([...mins].sort((a, b) => a - b)).toEqual(mins);
        expect(new Set(mins).size).toBe(20);
    });

    it('arranca en Novato sin progreso', () => {
        const level = getLevelByXP(0);
        expect(level.title).toBe('Novato');
        expect(level.rank).toBe('Nivel 1');
        expect(level.progress).toBe(0);
    });

    it('gancho rápido: primera sesión (2 caps + racha 1) = Despertar', () => {
        const xp = computeXP({ chapters: 2, favorites: 0, streak: 1 });
        expect(xp).toBe(25);
        expect(getLevelByXP(xp).title).toBe('Despertar');
    });

    it('progreso relativo al siguiente nivel', () => {
        // Entre 25 (Despertar) y 80 (Chispa): (52-25)/(80-25) ≈ 49%
        const level = getLevelByXP(52);
        expect(level.title).toBe('Despertar');
        expect(level.nextTitle).toBe('Chispa');
        expect(level.progress).toBeCloseTo(49.09, 1);
    });

    it('techo alcanzable solo leyendo la Biblia entera (1189 caps, sin racha ni favs)', () => {
        const xp = computeXP({ chapters: 1189, favorites: 0, streak: 0 });
        expect(xp).toBeGreaterThanOrEqual(MAX_XP_GOAL);
        const level = getLevelByXP(xp);
        expect(level.title).toBe('Ungido');
        expect(level.rank).toBe('Nivel 20');
        expect(level.nextTitle).toBeUndefined();
        expect(level.progress).toBe(100);
    });

    it('a medio camino no se regala el máximo', () => {
        expect(getLevelByXP(computeXP({ chapters: 600, favorites: 0, streak: 0 })).title).not.toBe('Ungido');
    });
});
