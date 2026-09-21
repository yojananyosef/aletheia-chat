import { describe, it, expect } from 'vitest';
import {
    selectPrerenderMessages,
    requiresManualAdvanceData,
    PRERENDER_MAX_MESSAGES,
    PRERENDER_MIN_MESSAGES,
} from './prerender';

const narr = (id: string) => ({ speaker: 'Narrador', text: id });
const god = (id: string) => ({ speaker: 'Dios', text: id });
const title = (id: string) => ({ speaker: 'Sistema', text: id, isSectionTitle: true as const });

describe('requiresManualAdvanceData (espejo de Message)', () => {
    it('solo el Narrador no-título fluye', () => {
        expect(requiresManualAdvanceData(narr('a'))).toBe(false);
        expect(requiresManualAdvanceData(god('a'))).toBe(true);
        expect(requiresManualAdvanceData(title('a'))).toBe(true);
        expect(requiresManualAdvanceData({ speaker: 'Narrador', isSectionTitle: true })).toBe(true);
    });
});

describe('selectPrerenderMessages', () => {
    it('cierra en la primera pausa manual tras el mínimo (génesis 1: 2 títulos + 3 narr + Dios)', () => {
        const msgs = [title('t1'), title('t2'), narr('n1'), narr('n2'), narr('n3'), god('g1'), narr('n4')];
        const out = selectPrerenderMessages(msgs);
        expect(out.map((m) => m.text)).toEqual(['t1', 't2', 'n1', 'n2', 'n3', 'g1']);
    });

    it('respeta el mínimo aunque la primera pausa llegue antes', () => {
        const msgs = [title('t1'), narr('n1'), narr('n2'), narr('n3'), narr('n4'), god('g1')];
        const out = selectPrerenderMessages(msgs);
        expect(out).toHaveLength(PRERENDER_MIN_MESSAGES + 1);
        expect(out[out.length - 1]?.text).toBe('g1');
    });

    it('corta en el tope aunque no haya pausa', () => {
        const msgs = Array.from({ length: 30 }, (_, i) => narr(`n${i}`));
        expect(selectPrerenderMessages(msgs)).toHaveLength(PRERENDER_MAX_MESSAGES);
    });

    it('capítulo vacío → vacío; capítulo corto → entero', () => {
        expect(selectPrerenderMessages([])).toEqual([]);
        const msgs = [narr('n1'), narr('n2')];
        expect(selectPrerenderMessages(msgs)).toHaveLength(2);
    });
});
