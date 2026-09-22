import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallPrompt } from './InstallPrompt';

function fireInstallPrompt() {
    const event = new Event('beforeinstallprompt');
    (event as unknown as { prompt: () => Promise<void> }).prompt = vi.fn(async () => {});
    window.dispatchEvent(event);
}

describe('InstallPrompt', () => {
    it('no muestra nada hasta el evento del navegador', () => {
        render(<InstallPrompt />);
        expect(screen.queryByRole('dialog', { name: /instalar aplicación/i })).toBeNull();
    });

    it('muestra el banner e instala al aceptar', async () => {
        render(<InstallPrompt />);
        fireInstallPrompt();

        const dialog = await screen.findByRole('dialog', { name: /instalar aplicación/i });
        expect(dialog).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: /^instalar$/i }));
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: /instalar aplicación/i })).toBeNull();
        });
    });

    it('se descarta con la X', async () => {
        render(<InstallPrompt />);
        fireInstallPrompt();
        await screen.findByRole('dialog', { name: /instalar aplicación/i });

        fireEvent.click(screen.getByRole('button', { name: /descartar instalación/i }));
        expect(screen.queryByRole('dialog', { name: /instalar aplicación/i })).toBeNull();
    });

    it('en modo standalone nunca molesta', async () => {
        window.matchMedia = (() => ({ matches: true })) as unknown as typeof window.matchMedia;
        try {
            render(<InstallPrompt />);
            fireInstallPrompt();
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(screen.queryByRole('dialog', { name: /instalar aplicación/i })).toBeNull();
        } finally {
            // @ts-expect-error restaura el jsdom sin matchMedia
            delete window.matchMedia;
        }
    });
});
