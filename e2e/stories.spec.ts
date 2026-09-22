import { test, expect } from '@playwright/test';

/** Stories: fila en home + visor con navegación y cierre. */
test.describe('Stories', () => {
    test('abre el visor, avanza y cierra', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();

        const first = page.getByRole('button', { name: /historia:/i }).first();
        await expect(first).toBeVisible();
        await first.click();

        const dialog = page.getByRole('dialog', { name: /historia:/i });
        await expect(dialog).toBeVisible();
        // El versículo carga async: espera que salga el placeholder.
        await expect(dialog.getByText(/cargando/i)).toHaveCount(0, { timeout: 15_000 });

        // Siguiente: tarjeta de racha.
        await page.getByRole('button', { name: /historia siguiente/i }).click();
        await expect(dialog.getByRole('heading', { name: /días?/i })).toBeVisible();

        // Atrás vuelve al versículo.
        await page.getByRole('button', { name: /historia anterior/i }).click();
        await expect(dialog).toBeVisible();

        await page.getByRole('button', { name: /cerrar historias/i }).click();
        await expect(dialog).toHaveCount(0);
    });
});
