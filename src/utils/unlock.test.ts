import { describe, it, expect } from 'vitest';
import { computeUnlocked, isUnlocked } from './unlock';

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

describe('isUnlocked', () => {
    it('coincide con computeUnlocked para cada libro', () => {
        const complete = new Set(['genesis:1', 'genesis:2']);
        const isComplete = (b: string, c: number) => complete.has(`${b}:${c}`);
        const isVisited = (b: string) => b === 'levitico';
        const open = computeUnlocked(ORDER, isComplete, isVisited);
        for (const b of ORDER) {
            expect(isUnlocked(ORDER, b.id, isComplete, isVisited)).toBe(open.has(b.id));
        }
    });

    it('un enlace no cuenta como visita: exodus sigue bloqueado', () => {
        // El deep-link a /exodus/5 no puede abrir el libro: getLinkedChapter se
        // guarda en otra clave justamente para que isVisited no lo vea.
        const isComplete = () => false;
        const isVisited = () => false;
        expect(isUnlocked(ORDER, 'exodus', isComplete, isVisited)).toBe(false);
    });
});
