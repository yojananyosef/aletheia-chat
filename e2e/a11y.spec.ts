import { test, expect } from '@playwright/test';

/**
 * A11y avanzada: live-region del feed, skip-link, semántica dialog del
 * OptionsMenu y ausencia de micro-texto gris bajo contraste (AA).
 */
test.describe('A11y avanzada', () => {
    test('skip-link salta al contenido (home)', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();

        const skip = page.getByRole('link', { name: /saltar al contenido/i });
        await page.keyboard.press('Tab');
        await expect(skip).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.locator('#contenido')).toBeFocused();
    });

    test('feed anuncia mensajes (live region) y chat sin grises bajo contraste', async ({
        page,
    }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();

        const feed = page.getByTestId('chat-feed');
        await expect(feed).toHaveAttribute('aria-live', 'polite');

        // Skip-link también llega al main del chat.
        await page.keyboard.press('Tab');
        await expect(page.getByRole('link', { name: /saltar al contenido/i })).toBeFocused();

        const lowContrast = await page.evaluate(
            () => document.querySelectorAll('.text-gray-400, .text-gray-500').length,
        );
        expect(lowContrast).toBe(0);
    });

    test('OptionsMenu es un diálogo con foco gestionado', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();

        const trigger = page.getByRole('button', { name: /opciones de lectura/i });
        await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
        await trigger.click();

        const dialog = page.getByRole('dialog', { name: /ajustes de revelación/i });
        await expect(dialog).toBeVisible();
        // Sin micro-texto gris bajo contraste ni siquiera con el menú abierto.
        const lowContrast = await page.evaluate(
            () => document.querySelectorAll('.text-gray-400, .text-gray-500').length,
        );
        expect(lowContrast).toBe(0);
        // Foco inicial dentro del diálogo.
        await expect(dialog.getByRole('button').first()).toBeFocused();

        // Escape cierra y devuelve el foco al trigger.
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
    });

    test('home sin grises bajo contraste', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();
        const lowContrast = await page.evaluate(
            () => document.querySelectorAll('.text-gray-400, .text-gray-500').length,
        );
        expect(lowContrast).toBe(0);
    });
});
