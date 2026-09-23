import { describe, it, expect } from 'vitest';
import { getBadges } from './badges';
import { computeReadingStats } from './readingProgress';

const empty = computeReadingStats(() => false);

describe('getBadges', () => {
    it('6 hitos, todos bloqueados al inicio', () => {
        const badges = getBadges(empty);
        expect(badges).toHaveLength(6);
        expect(badges.map((b) => b.id)).toEqual([
            'primer-capitulo',
            'primer-libro',
            'diez-libros',
            'nt-completo',
            'at-completo',
            'biblia-completa',
        ]);
        expect(badges.every((b) => !b.unlocked)).toBe(true);
    });

    it('1 capítulo desbloquea Primer Paso pero no Libro Entero', () => {
        const s = computeReadingStats((b, c) => b === 'genesis' && c === 1);
        const badges = getBadges(s);
        expect(badges[0].unlocked).toBe(true);
        expect(badges[1].unlocked).toBe(false);
    });

    it('abdias (1 cap) desbloquea primer libro', () => {
        const s = computeReadingStats((b) => b === 'abdias');
        expect(getBadges(s)[1].unlocked).toBe(true);
    });

    it('Biblia completa desbloquea todo', () => {
        const s = computeReadingStats(() => true);
        const badges = getBadges(s);
        expect(badges.every((b) => b.unlocked)).toBe(true);
        expect(badges.every((b) => b.progress === 100)).toBe(true);
    });

    it('progreso parcial NT entre 0 y 100', () => {
        const s = computeReadingStats((b) => b === 'mateo');
        const nt = getBadges(s).find((b) => b.id === 'nt-completo')!;
        expect(nt.unlocked).toBe(false);
        expect(nt.progress).toBeGreaterThan(0);
        expect(nt.progress).toBeLessThan(100);
    });
});
