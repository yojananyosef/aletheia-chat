import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createRef } from 'react';
import { useScrollOnUpdate } from './useScrollOnUpdate';

const setupElement = ({ scrollHeight, scrollTop, clientHeight }: { scrollHeight: number; scrollTop: number; clientHeight: number }) => {
    const el = document.createElement('div');
    Object.defineProperties(el, {
        scrollHeight: { value: scrollHeight, configurable: true },
        scrollTop: { value: scrollTop, writable: true, configurable: true },
        clientHeight: { value: clientHeight, configurable: true },
    });
    el.scrollTo = vi.fn(((opts?: ScrollToOptions) => {
        if (typeof opts?.top === 'number') (el as unknown as { scrollTop: number }).scrollTop = opts.top;
    }) as () => void) as unknown as typeof el.scrollTo;
    return el;
};

describe('useScrollOnUpdate (seguir narración)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('acompaña al fondo aunque el usuario esté lejos (avance de narración)', () => {
        const el = setupElement({ scrollHeight: 5000, scrollTop: 0, clientHeight: 800 });
        const ref = createRef<HTMLElement | null>();
        (ref as { current: unknown }).current = el;

        const { rerender } = renderHook(({ idx }: { idx: number }) => useScrollOnUpdate(ref, [idx]), {
            initialProps: { idx: 0 },
        });
        act(() => {
            rerender({ idx: 1 });
            // requestAnimationFrame
            vi.runAllTimers();
        });
        expect(el.scrollTo).toHaveBeenCalled();
        const calls = (el.scrollTo as unknown as ReturnType<typeof vi.fn>).mock.calls;
        const last = calls[calls.length - 1]?.[0] as ScrollToOptions;
        expect(last.top).toBe(5000);
    });

    it('pausa el follow si el usuario hace scroll manual hacia arriba', () => {
        const el = setupElement({ scrollHeight: 5000, scrollTop: 4200, clientHeight: 800 });
        const ref = createRef<HTMLElement | null>();
        (ref as { current: unknown }).current = el;

        const { rerender } = renderHook(({ idx }: { idx: number }) => useScrollOnUpdate(ref, [idx]), {
            initialProps: { idx: 0 },
        });
        act(() => {
            vi.runAllTimers();
        });
        (el.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        // Gesto manual: el usuario sube a 1000px del fondo
        act(() => {
            Object.defineProperty(el, 'scrollTop', { value: 3400, writable: true, configurable: true });
            el.dispatchEvent(new Event('scroll'));
            rerender({ idx: 1 });
            vi.runAllTimers();
        });
        expect(el.scrollTo).not.toHaveBeenCalled();
    });
});
