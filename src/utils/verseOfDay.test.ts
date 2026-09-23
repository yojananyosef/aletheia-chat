import { describe, it, expect } from 'vitest';
import { pickVerseOfDay, VERSE_ROTATION } from './verseOfDay';

describe('pickVerseOfDay', () => {
    it('es determinista por fecha', () => {
        const a = pickVerseOfDay(new Date('2026-09-22T12:00:00'));
        const b = pickVerseOfDay(new Date('2026-09-22T23:59:59'));
        expect(a).toEqual(b);
        expect(VERSE_ROTATION).toContainEqual(a);
    });

    it('cubre el año sin repetir (rotación >= 366 y labels únicos)', () => {
        expect(VERSE_ROTATION.length).toBeGreaterThanOrEqual(366);
        const labels = VERSE_ROTATION.map((v) => v.label);
        expect(new Set(labels).size).toBe(labels.length);
    });

    it('no repite en ninguna ventana de 366 días', () => {
        const seen = new Set<string>();
        const start = new Date('2026-01-01T12:00:00');
        for (let i = 0; i < 366; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            seen.add(pickVerseOfDay(d).label);
        }
        expect(seen.size).toBe(366);
    });

    it('rota entre días y varía entre años', () => {
        const jan = pickVerseOfDay(new Date('2026-01-15T12:00:00'));
        const feb = pickVerseOfDay(new Date('2026-02-15T12:00:00'));
        expect(jan.label).not.toBe(feb.label);
        const nextYear = pickVerseOfDay(new Date('2027-01-15T12:00:00'));
        expect(VERSE_ROTATION).toContainEqual(nextYear);
    });
});
