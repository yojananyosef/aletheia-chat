import { test, expect } from '@playwright/test';

/** Perfil: identidad, racha y stats + navegación de favoritos. */
test.describe('Perfil', () => {
    test('muestra identidad y stats, y vuelve al inicio', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();

        await page.getByRole('button', { name: /abrir perfil/i }).click();
        await expect(page).toHaveURL(/\/perfil/);
        await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible();
        await expect(page.getByText(/días? de racha/i)).toBeVisible();
        await expect(page.getByText('Favoritos')).toBeVisible();
        await expect(page.getByText('Capítulos completos')).toBeVisible();
        await expect(page.getByText('Libros abiertos')).toBeVisible();

        await page.getByRole('button', { name: /volver al inicio/i }).click();
        await expect(page).toHaveURL(/\/$/);
    });
});
