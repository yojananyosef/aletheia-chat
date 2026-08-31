import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
    test('deep-link a /genesis/1 carga el capítulo sin errores de hidratación', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await page.goto('/genesis/1');
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();
        await expect(page.getByText('La Creación').first()).toBeVisible();

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

    test('doble-tap en un versículo lo marca como favorito y persiste tras recargar', async ({ page }) => {
        await page.goto('/genesis/1');

        // El capítulo arranca con un título de sección que requiere avance manual
        await page.getByRole('button', { name: 'La Creación' }).click();

        const bubble = page.getByText('En el principio, Dios creó los cielos y la tierra.');
        await expect(bubble).toBeVisible({ timeout: 20_000 });

        await bubble.dblclick();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();

        await page.reload();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();
    });
});
