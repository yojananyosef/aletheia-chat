import { describe, it, expect } from 'vitest';
import { computeUnlocked } from './unlock';

const ORDER = [
    { id: 'genesis', availableChapters: [1, 2] },
    { id: 'exodus', availableChapters: [1] },
    { id: 'levitico', availableChapters: [1] },
];

describe('computeUnlocked', () => {
    it('solo el primero abre sin progreso', () => {
        const open = computeUnlocked(ORDER, () => false, () => false);
        expect([...open]).toEqual(['genesis']);
    });

    it('completar el anterior abre el siguiente', () => {
        const complete = new Set(['genesis:1', 'genesis:2']);
        const open = computeUnlocked(
            ORDER,
            (b, c) => complete.has(`${b}:${c}`),
            () => false,
        );
        expect([...open].sort()).toEqual(['exodus', 'genesis']);
    });

    it('a medias no abre', () => {
        const complete = new Set(['genesis:1']);
        const open = computeUnlocked(
            ORDER,
            (b, c) => complete.has(`${b}:${c}`),
            () => false,
        );
        expect([...open]).toEqual(['genesis']);
    });

    it('lo ya visitado no se bloquea (usuarios previos)', () => {
        const open = computeUnlocked(ORDER, () => false, (b) => b === 'levitico');
        expect([...open].sort()).toEqual(['genesis', 'levitico']);
    });
});
