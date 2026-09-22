import { describe, it, expect } from 'vitest';
import { pickVerseOfDay, VERSE_ROTATION } from './verseOfDay';

describe('pickVerseOfDay', () => {
    it('es determinista por fecha', () => {
        const a = pickVerseOfDay(new Date('2026-09-22T12:00:00'));
        const b = pickVerseOfDay(new Date('2026-09-22T23:59:59'));
        expect(a).toEqual(b);
        expect(VERSE_ROTATION).toContainEqual(a);
    });

    it('rota entre días', () => {
        const labels = new Set(
            Array.from({ length: VERSE_ROTATION.length }, (_, i) =>
                pickVerseOfDay(new Date(`2026-01-${String(i + 1).padStart(2, '0')}T12:00:00`)).label,
            ),
        );
        expect(labels.size).toBeGreaterThan(1);
    });
});
