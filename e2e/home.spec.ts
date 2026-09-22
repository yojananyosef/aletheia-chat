import { test, expect } from '@playwright/test';

test.describe('Home', () => {
    test('renderiza el catálogo de libros con la marca NAAS', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();
        await expect(page.getByText('Génesis', { exact: true })).toBeVisible();
        await expect(page.getByText('Éxodo', { exact: true })).toBeVisible();
        // Libro bloqueado no navega
        await expect(page.getByText('Levítico', { exact: true })).toBeVisible();
    });

    test('la fila muestra el último mensaje leído estilo chat', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();
        // Libro sin leer: badge Nuevo.
        const genesisRow = page.getByRole('button', { name: /abrir génesis/i });
        await expect(genesisRow.getByText('Nuevo')).toBeVisible();

        // Lee en Génesis 1 hasta el primer Narrador (2 títulos + auto-avance).
        await genesisRow.click();
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        const titleBtn = page.getByRole('button', { name: /creación/i });
        await titleBtn.click();
        await titleBtn.click();
        await expect(page.getByText('En el principio creó Dios el cielo y la tierra.')).toBeVisible({ timeout: 20_000 });

        // De vuelta en home: snippet + hora, sin badge Nuevo.
        await page.goto('/');
        const row = page.getByRole('button', { name: /abrir génesis/i });
        await expect(row.getByText(/narrador: en el principio/i)).toBeVisible();
        await expect(row.getByText(/ahora|hace \d+ min/i)).toBeVisible();
        await expect(row.getByText('Nuevo')).toHaveCount(0);
    });

    test('libros bloqueados se desbloquean al completar el anterior', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();

        // Perfil fresco: Éxodo bloqueado con pista, sin botón de apertura.
        await expect(page.getByText('Completa Génesis')).toBeVisible();
        await expect(page.getByRole('button', { name: /abrir éxodo/i })).toHaveCount(0);

        // Completa Génesis (50 caps) → Éxodo abre.
        await page.evaluate(() => {
            for (let c = 1; c <= 50; c++) {
                window.localStorage.setItem(`naas:v1:completed:genesis:${c}`, '1');
            }
        });
        await page.reload();
        await expect(page.getByRole('button', { name: /abrir éxodo/i })).toBeVisible();
        await expect(page.getByText('Completa Génesis')).toHaveCount(0);
    });
});
