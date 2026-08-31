import { test, expect } from '@playwright/test';

test.describe('Home', () => {
    test('renderiza el catálogo de libros con la marca NAAS', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'BIBLIA CHAT' })).toBeVisible();
        await expect(page.getByText('Génesis')).toBeVisible();
        await expect(page.getByText('Éxodo')).toBeVisible();
        // Libro bloqueado no navega
        await expect(page.getByText('Levítico')).toBeVisible();
    });
});
