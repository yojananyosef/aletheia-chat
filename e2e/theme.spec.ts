import { test, expect } from '@playwright/test';

/** Tema oscuro: toggle en el centro de control + persistencia. */
test.describe('Tema', () => {
    test('alterna a oscuro y persiste tras recargar', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();
        await expect(page.locator('html.dark')).toHaveCount(0);

        await page.getByRole('button', { name: /abrir centro de control/i }).click();
        await page.getByRole('button', { name: /tema oscuro/i }).click();
        await expect(page.locator('html.dark')).toHaveCount(1);

        const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(bg).toBe('rgb(24, 23, 21)');

        await page.reload();
        await expect(page.locator('html.dark')).toHaveCount(1);

        // Volver a claro.
        await page.getByRole('button', { name: /abrir centro de control/i }).click();
        await page.getByRole('button', { name: /tema claro/i }).click();
        await expect(page.locator('html.dark')).toHaveCount(0);
    });

    test('chat legible en oscuro', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await page.evaluate(() => {
            window.localStorage.setItem(
                'naas:v1:settings',
                JSON.stringify({ isMuted: true, readingSpeed: 1, theme: 'dark' }),
            );
        });
        await page.reload();
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.locator('html.dark')).toHaveCount(1);
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();
    });
});
