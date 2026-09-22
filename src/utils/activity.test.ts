import { describe, it, expect } from 'vitest';
import { timeAgo, toDateKey, computeStreak } from './activity';

describe('timeAgo', () => {
    const now = new Date('2026-09-22T12:00:00').getTime();

    it('ahora mismo y futuro', () => {
        expect(timeAgo(new Date(now).toISOString(), now)).toBe('ahora');
        expect(timeAgo('no-fecha', now)).toBe('ahora');
    });

    it('minutos, horas, ayer y días', () => {
        expect(timeAgo(new Date(now - 5 * 60000).toISOString(), now)).toBe('hace 5 min');
        expect(timeAgo(new Date(now - 3 * 3600000).toISOString(), now)).toBe('hace 3 h');
        expect(timeAgo(new Date(now - 26 * 3600000).toISOString(), now)).toBe('ayer');
        expect(timeAgo(new Date(now - 4 * 86400000).toISOString(), now)).toBe('hace 4 d');
    });
});

describe('computeStreak', () => {
    it('cuenta días consecutivos hasta hoy', () => {
        const days = { '2026-09-22': true, '2026-09-21': true, '2026-09-20': true };
        expect(computeStreak(days, new Date('2026-09-22T12:00:00'))).toBe(3);
    });

    it('sin hoy cuenta desde ayer', () => {
        const days = { '2026-09-21': true, '2026-09-20': true };
        expect(computeStreak(days, new Date('2026-09-22T12:00:00'))).toBe(2);
    });

    it('corte ante un hueco', () => {
        const days = { '2026-09-22': true, '2026-09-20': true };
        expect(computeStreak(days, new Date('2026-09-22T12:00:00'))).toBe(1);
    });

    it('vacío es 0', () => {
        expect(computeStreak({}, new Date('2026-09-22T12:00:00'))).toBe(0);
    });

    it('toDateKey es local y estable', () => {
        expect(toDateKey(new Date('2026-09-22T12:00:00'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
