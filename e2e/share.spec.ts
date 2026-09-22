import { test, expect } from '@playwright/test';

/**
 * Compartir capítulo: sin Web Share API (desktop) copia el enlace al
 * portapapeles con confirmación visible.
 */
test.describe('Compartir', () => {
    test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

    test('copia el enlace del capítulo con feedback', async ({ page, context }) => {
        // Sin Web Share API en desktop Chromium: va por la vía portapapeles.
        await context.addInitScript(() => {
            const nav = window.navigator as Navigator & { share?: unknown };
            // @ts-expect-error simula desktop sin share nativo
            delete nav.share;
        });
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();

        await page.getByRole('button', { name: /compartir capítulo/i }).click();

        // Feedback visible + URL real en el portapapeles.
        await expect(page.getByRole('button', { name: /¡enlace copiado!/i })).toBeVisible();
        const clip = await page.evaluate(() => navigator.clipboard.readText());
        expect(clip).toContain('/genesis/1');
    });
});
