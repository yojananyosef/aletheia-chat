import { test, expect } from '@playwright/test';

/** PWA instalable: banner beforeinstallprompt e icono maskable en el manifest. */
test.describe('Instalación PWA', () => {
    test('manifest declara icono maskable', async ({ page }) => {
        const res = await page.request.get('/manifest.webmanifest');
        expect(res.ok()).toBe(true);
        const manifest = (await res.json()) as {
            icons: { src: string; sizes: string; purpose?: string }[];
        };
        expect(manifest.icons.some((i) => i.purpose === 'maskable')).toBe(true);
    });

    test('banner de instalación aparece con beforeinstallprompt', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();
        await expect(page.getByRole('dialog', { name: /instalar aplicación/i })).toHaveCount(0);

        await page.evaluate(() => window.dispatchEvent(new Event('beforeinstallprompt')));
        await expect(page.getByRole('dialog', { name: /instalar aplicación/i })).toBeVisible();

        await page.getByRole('button', { name: /descartar instalación/i }).click();
        await expect(page.getByRole('dialog', { name: /instalar aplicación/i })).toHaveCount(0);
    });
});
