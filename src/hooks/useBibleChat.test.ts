import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const loadChapterService = vi.fn(async (): Promise<ValidChapterData> => buildChapter());

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
});
