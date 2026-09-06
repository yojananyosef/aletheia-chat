import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
    test('deep-link a /genesis/1 carga el capítulo sin errores de hidratación', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await page.goto('/genesis/1');
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /creación/i }).first()).toBeVisible();

        expect(consoleErrors.filter((e) => e.toLowerCase().includes('hydrat'))).toEqual([]);
    });

    test('deep-link a ruta inválida devuelve 404', async ({ page }) => {
        const response = await page.goto('/genesis/99');
        expect(response?.status()).toBe(404);
    });

    test('navega Home → Chat → Back', async ({ page }) => {
        await page.goto('/');
        await page.getByText('Génesis').click();
        await expect(page).toHaveURL(/\/genesis\/\d+/);
        await page.goBack();
        await expect(page).toHaveURL(/\/$/);
    });

    test('mensaje de Dios pausa y requiere tap (no auto-avanza)', async ({ page }) => {
        // Velocidad rápida para no esperar los delays de lectura en el test
        await page.goto('/genesis/1');
        await page.evaluate(() => window.localStorage.setItem('naas:v1:settings', JSON.stringify({ isMuted: true, readingSpeed: 0.25 })));
        await page.reload();

        // Dos títulos de sección (Platense) requieren tap
        const titleBtn = page.getByRole('button', { name: /creación/i });
        await titleBtn.click();
        await titleBtn.click();

        // Tras los narradores en auto, Dios pide tap: preview + Send, sin auto-avance
        const sendGod = page.getByRole('button', { name: /enviar mensaje de dios/i });
        await expect(sendGod).toBeVisible({ timeout: 30_000 });
        await page.waitForTimeout(2000);
        await expect(sendGod).toBeVisible();

        await sendGod.click();
        await expect(page.getByText('Sea la luz; y fue la luz.')).toBeVisible();
    });

    test('doble-tap en un versículo lo marca como favorito y persiste tras recargar', async ({ page }) => {
        await page.goto('/genesis/1');

        // El capítulo arranca con títulos de sección que requieren avance manual
        const titleBtn = page.getByRole('button', { name: /creación/i });
        await titleBtn.click();
        await titleBtn.click();

        const bubble = page.getByText('En el principio creó Dios el cielo y la tierra.');
        await expect(bubble).toBeVisible({ timeout: 20_000 });

        // Esperar a que la narración se pause en el mensaje de Dios:
        // con follow-mode el scroll suave compite con el doble-tap si el auto-avance sigue activo.
        await expect(page.getByRole('button', { name: /enviar mensaje de dios/i })).toBeVisible({ timeout: 30_000 });

        await bubble.dblclick();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();

        await page.reload();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();
    });
});
