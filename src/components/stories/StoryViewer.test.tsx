import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StoryViewer } from './StoryViewer';
import type { Story } from '../../hooks/useStories';

const STORIES: Story[] = [
    {
        id: 'a',
        eyebrow: 'Versículo del día',
        title: 'Juan 3:16',
        text: 'Porque de tal manera amó Dios al mundo.',
        ref: { bookId: 'juan', bookName: 'Juan', chapter: 3 },
    },
    { id: 'b', eyebrow: 'Tu racha', title: '3 días', text: 'Sigue así.' },
];

function renderViewer(props?: Partial<{ index: number; durationMs: number }>) {
    const onIndexChange = vi.fn();
    const onClose = vi.fn();
    render(
        <StoryViewer
            stories={STORIES}
            index={props?.index ?? 0}
            onIndexChange={onIndexChange}
            onClose={onClose}
            durationMs={props?.durationMs ?? 60_000}
        />,
    );
    return { onIndexChange, onClose };
}

describe('StoryViewer', () => {
    it('muestra la historia y navega con tap', () => {
        const { onIndexChange } = renderViewer();
        expect(screen.getByRole('heading', { name: /juan 3:16/i })).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: /historia siguiente/i }));
        expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('atrás en la primera cierra', () => {
        const { onClose } = renderViewer();
        fireEvent.click(screen.getByRole('button', { name: /historia anterior/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('X y Escape cierran', () => {
        const { onClose } = renderViewer();
        fireEvent.click(screen.getByRole('button', { name: /cerrar historias/i }));
        expect(onClose).toHaveBeenCalledTimes(1);

        renderViewer();
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('auto-avanza al terminar la duración', async () => {
        const { onIndexChange } = renderViewer({ durationMs: 30 });
        await waitFor(() => {
            expect(onIndexChange).toHaveBeenCalledWith(1);
        });
    });
});
