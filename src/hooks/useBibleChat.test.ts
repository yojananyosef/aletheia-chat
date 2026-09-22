import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBibleChat } from './useBibleChat';
import { Message } from '../core/domain/Message';
import { ValidChapterData } from '../core/services/BibleDataService';

const MESSAGES = {
    title: new Message({ id: 'sec', speaker: 'Sistema', text: 'La creación', verse: 1, isSectionTitle: true }),
    narrator: new Message({ id: 'v1', speaker: 'Narrador', text: 'En el principio Dios creó los cielos y la tierra.', verse: 1 }),
    god: new Message({ id: 'v2', speaker: 'Dios', text: '¡Que haya luz!', verse: 3 }),
    human: new Message({ id: 'v3', speaker: 'Adán', text: 'Hola, soy Adán.', verse: 4 }),
};

type MessageKey = keyof typeof MESSAGES;

function buildChapter(order: MessageKey[] = ['title', 'narrator', 'god', 'human']): ValidChapterData {
    return {
        book: 'Génesis',
        chapter: 1,
        title: 'La Creación',
        messages: order.map(key => MESSAGES[key]),
    };
}

const loadChapterService: Mock<(book: string, chapter: number) => Promise<ValidChapterData>> =
    vi.fn(async (): Promise<ValidChapterData> => buildChapter());

// speed diminuta → los delays de auto-avance quedan en milisegundos
function renderChat(speed = 0.002) {
    return renderHook(() => useBibleChat({
        book: 'genesis',
        chapter: 1,
        speed,
        isActive: true,
        loadChapterService,
    }));
}

const flushLoad = async () => {
    await waitFor(() => expect(loadChapterService).toHaveBeenCalled());
};

describe('useBibleChat', () => {
    beforeEach(() => {
        window.localStorage.clear();
        loadChapterService.mockClear();
        loadChapterService.mockImplementation(async (): Promise<ValidChapterData> => buildChapter());
    });

    it('arranca en -1 cuando el primer mensaje es título (avance manual)', async () => {
        const { result } = renderChat();
        await flushLoad();

        await waitFor(() => {
            expect(result.current.data).not.toBeNull();
            expect(result.current.currentIndex).toBe(-1);
        });
        expect(result.current.visibleMessages).toHaveLength(0);
        expect(result.current.canAdvanceManually).toBe(true);
    });

    it('avanza manualmente con un mensaje humano y persiste el progreso', async () => {
        // título → humano: ambos requieren avance manual, sin auto-avance intermedio
        loadChapterService.mockImplementation(async (): Promise<ValidChapterData> =>
            buildChapter(['title', 'human', 'god'])
        );

        const { result } = renderChat();
        await flushLoad();

        await waitFor(() => expect(result.current.currentIndex).toBe(-1));

        act(() => result.current.handleManualNext());

        expect(result.current.currentIndex).toBe(0);
        expect(window.localStorage.getItem('naas:v1:progress:genesis:1')).toBe('0');

        act(() => result.current.handleManualNext());
        expect(result.current.currentIndex).toBe(1);
        expect(window.localStorage.getItem('naas:v1:progress:genesis:1')).toBe('1');
    });

    it('auto-avanza solo Narrador y pausa Dios + humanos', async () => {
        const { result } = renderChat();
        await flushLoad();

        await waitFor(() => expect(result.current.currentIndex).toBe(-1));

        act(() => result.current.handleManualNext()); // index 0 (título)
        act(() => result.current.handleManualNext()); // index 1 (Narrador)

        // El siguiente es Dios → pausa, requiere tap (todo no-Narrador)
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });
        expect(result.current.currentIndex).toBe(1);
        expect(result.current.canAdvanceManually).toBe(true);

        act(() => result.current.handleManualNext()); // index 2 (Dios)
        expect(result.current.currentIndex).toBe(2);

        // El siguiente es humano (Adán) → sigue en pausa
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });
        expect(result.current.currentIndex).toBe(2);
        expect(result.current.canAdvanceManually).toBe(true);
    });

    it('auto-avanza Narrador tras Narrador sin tap', async () => {
        loadChapterService.mockImplementation(async (): Promise<ValidChapterData> =>
            buildChapter(['narrator', 'narrator', 'human'])
        );
        // Primer Narrador arranca en 0 (no requiere tap)
        const { result } = renderChat();
        await flushLoad();
        await waitFor(() => expect(result.current.data).not.toBeNull());
        // Avanza solo al segundo Narrador y se detiene ante humano
        await waitFor(() => expect(result.current.currentIndex).toBe(1), { timeout: 2000 });
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });
        expect(result.current.currentIndex).toBe(1);
        expect(result.current.canAdvanceManually).toBe(true);
    });

    it('reanuda desde el progreso guardado', async () => {
        window.localStorage.setItem('naas:v1:progress:genesis:1', '2');

        const { result } = renderChat();
        await flushLoad();

        await waitFor(() => expect(result.current.currentIndex).toBe(2));
    });

    it('restartChapter vuelve al inicio y limpia el progreso', async () => {
        const { result } = renderChat();
        await flushLoad();

        await waitFor(() => expect(result.current.currentIndex).toBe(-1));

        act(() => result.current.handleManualNext());
        act(() => result.current.handleManualNext());

        act(() => result.current.restartChapter());

        expect(result.current.currentIndex).toBe(-1);
        expect(window.localStorage.getItem('naas:v1:progress:genesis:1')).toBeNull();
    });

    it('propaga el error del servicio', async () => {
        loadChapterService.mockRejectedValueOnce(new Error('El capítulo 1 no pudo ser cargado.'));
        const { result } = renderChat();

        await waitFor(() => {
            expect(result.current.error).toBe('El capítulo 1 no pudo ser cargado.');
        });
    });

    it('con initialData (SSR) no llama al servicio y arranca sin espera', () => {
        const initialData = buildChapter();
        const { result } = renderHook(() => useBibleChat({
            book: 'genesis',
            chapter: 1,
            speed: 0.002,
            isActive: true,
            loadChapterService,
            initialData,
        }));

        expect(loadChapterService).not.toHaveBeenCalled();
        expect(result.current.data).not.toBeNull();
        // El primer mensaje es título → pausa en -1, igual que la vía fetch
        expect(result.current.currentIndex).toBe(-1);
        expect(result.current.visibleMessages).toHaveLength(0);
        expect(result.current.canAdvanceManually).toBe(true);
    });

    it('con initialData reanuda desde el progreso guardado', async () => {
        window.localStorage.setItem('naas:v1:progress:genesis:1', '2');
        const { result } = renderHook(() => useBibleChat({
            book: 'genesis',
            chapter: 1,
            speed: 0.002,
            isActive: true,
            loadChapterService,
            initialData: buildChapter(),
        }));

        await waitFor(() => expect(result.current.currentIndex).toBe(2));
        expect(loadChapterService).not.toHaveBeenCalled();
    });

    // Fase0 1.4: navegación entre capítulos no mezcla mensajes ni conserva el índice.
    it('navegar de capítulo resetea sin mezclar mensajes', async () => {
        const ch2: ValidChapterData = {
            book: 'Génesis',
            chapter: 2,
            title: 'Capítulo 2',
            messages: [
                new Message({ id: 'sec2', speaker: 'Sistema', text: 'CH2 título', verse: 1, isSectionTitle: true }),
                new Message({ id: 'v1b', speaker: 'Narrador', text: 'CH2 narrador', verse: 1 }),
                new Message({ id: 'v2b', speaker: 'Eva', text: 'CH2 Eva', verse: 2 }),
            ],
        };
        loadChapterService.mockImplementation(async (_book: string, chapter: number): Promise<ValidChapterData> =>
            chapter === 2 ? ch2 : buildChapter()
        );

        const { result, rerender } = renderHook(
            ({ chapter }: { chapter: number }) => useBibleChat({
                book: 'genesis',
                chapter,
                speed: 0.002,
                isActive: true,
                loadChapterService,
            }),
            { initialProps: { chapter: 1 } }
        );
        await waitFor(() => expect(result.current.data?.title).toBe('La Creación'));

        act(() => result.current.handleManualNext());
        expect(result.current.currentIndex).toBeGreaterThanOrEqual(0);

        rerender({ chapter: 2 });
        await waitFor(() => expect(result.current.data?.title).toBe('Capítulo 2'));
        expect(loadChapterService).toHaveBeenLastCalledWith('genesis', 2);

        // Índice reseteado (el primer mensaje CH2 es título → pausa en -1)…
        expect(result.current.currentIndex).toBe(-1);
        expect(result.current.visibleMessages).toHaveLength(0);

        // …y al avanzar solo aparecen mensajes del capítulo 2.
        act(() => result.current.handleManualNext());
        expect(result.current.visibleMessages.map(m => m.text)).toEqual(['CH2 título']);
    });

    // Fase0 1.4: un re-render con las mismas props no reinicia el timer de auto-avance.
    describe('fake timers', () => {
        afterEach(() => {
            vi.useRealTimers();
        });

        it('re-render no reinicia el timer de auto-avance', async () => {
            vi.useFakeTimers();
            loadChapterService.mockImplementation(async (): Promise<ValidChapterData> =>
                buildChapter(['narrator', 'narrator', 'human'])
            );
            const props = {
                book: 'genesis',
                chapter: 1,
                speed: 1,
                isActive: true,
                loadChapterService,
            };
            const { result, rerender } = renderHook((p: typeof props) => useBibleChat(p), {
                initialProps: props,
            });
            await act(async () => {});
            expect(result.current.data).not.toBeNull();
            expect(result.current.currentIndex).toBe(0);

            // Avance parcial (delay real 4840 con speed=1): el timer sigue pendiente.
            await act(async () => {
                vi.advanceTimersByTime(3000);
            });
            expect(result.current.currentIndex).toBe(0);

            // Re-render con las mismas props: el timer conserva su horario original.
            rerender({ ...props });

            // Con 2000 más (5000 en total) el timer original dispara exactamente una vez.
            // Si el re-render lo hubiera reiniciado, seguiría en 0 (necesitaría 4840
            // desde el re-render); si lo hubiera duplicado, saltaría a 2.
            await act(async () => {
                vi.advanceTimersByTime(2000);
            });
            expect(result.current.currentIndex).toBe(1);
        });

        it('cambiar speed sí reprograma el timer (control negativo)', async () => {
            vi.useFakeTimers();
            loadChapterService.mockImplementation(async (): Promise<ValidChapterData> =>
                buildChapter(['narrator', 'narrator', 'human'])
            );
            const props = {
                book: 'genesis',
                chapter: 1,
                speed: 1,
                isActive: true,
                loadChapterService,
            };
            const { result, rerender } = renderHook((p: typeof props) => useBibleChat(p), {
                initialProps: props,
            });
            await act(async () => {});
            expect(result.current.currentIndex).toBe(0);

            await act(async () => {
                vi.advanceTimersByTime(3000);
            });
            // Al cambiar speed el efecto se re-ejecuta: el timer viejo se limpia y
            // el nuevo parte de cero, así que con 2000 más aún no dispara.
            rerender({ ...props, speed: 2 });
            await act(async () => {
                vi.advanceTimersByTime(2000);
            });
            expect(result.current.currentIndex).toBe(0);
        });
    });
});
