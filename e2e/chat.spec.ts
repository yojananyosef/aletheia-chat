import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
    test('deep-link a /genesis/1 carga el capítulo sin errores de hidratación', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await page.goto('/genesis/1');
        // El <h1> SEO prerenderizado convive con el del header hasta hidratar;
        // el strict-mode no reintenta con 2 matches, así que se espera primero
        // a que el gate lo desmonte y quede un solo heading.
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /creación/i }).first()).toBeVisible();

        expect(consoleErrors.filter((e) => e.toLowerCase().includes('hydrat'))).toEqual([]);
    });

    test('deep-link a /apocalipsis/1 carga el capítulo (profecía integrada)', async ({ page }) => {
        await page.goto('/apocalipsis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Apocalipsis/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /judas/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/judas/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Judas/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /saludo/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /3juan/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/3juan/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Juan/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /caridad/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /2juan/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/2juan/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Juan/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /exhortación/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /1juan/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/1juan/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Juan/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /2pedro/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/2pedro/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Pedro/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /1pedro/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/1pedro/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Pedro/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /santiago/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/santiago/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Santiago/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /pruebas/i })).toBeVisible({ timeout: 20_000 });
    });

    test('deep-link a /hebreos/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/hebreos/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Hebreos/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /superioridad/i })).toBeVisible();
    });

    test('deep-link a /filemon/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/filemon/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Filemón/ })).toBeVisible();
        // El primer título (Elogio, v4) llega tras el auto-avance de v1-v3.
        await expect(page.getByRole('button', { name: /elogio/i })).toBeVisible({ timeout: 30_000 });
    });

    test('deep-link a /tito/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/tito/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Tito/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible();
    });

    test('deep-link a /2timoteo/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/2timoteo/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Timoteo/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /saludo/i })).toBeVisible();
    });

    test('deep-link a /1timoteo/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/1timoteo/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Timoteo/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /saludo/i })).toBeVisible();
    });

    test('deep-link a /2tesalonicenses/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/2tesalonicenses/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Tesalonicenses/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /saludo/i })).toBeVisible();
    });

    test('deep-link a /1tesalonicenses/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/1tesalonicenses/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Tesalonicenses/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible();
    });

    test('deep-link a /colosenses/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/colosenses/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Colosenses/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible();
    });

    test('deep-link a /filipenses/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/filipenses/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Filipenses/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible();
    });

    test('deep-link a /efesios/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/efesios/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Efesios/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /salutación/i })).toBeVisible();
    });

    test('deep-link a /galatas/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/galatas/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Gálatas/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible();
    });

    test('deep-link a /2corintios/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/2corintios/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Corintios/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible();
    });

    test('deep-link a /1corintios/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/1corintios/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Corintios/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible();
    });

    test('deep-link a /romanos/1 carga el capítulo (epístola integrada)', async ({ page }) => {
        await page.goto('/romanos/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Romanos/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible();
    });

    test('deep-link a /hechos/1 carga el capítulo (libro NT integrado)', async ({ page }) => {
        await page.goto('/hechos/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Hechos/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /prólogo/i })).toBeVisible();
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

        // Subir al versículo (follow-mode deja el viewport abajo) y dejar
        // que el scroll suave termine antes del doble-tap.
        await bubble.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await bubble.dblclick();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();

        await page.reload();
        await expect(page.locator('[class*="bg-red-500"]')).toBeVisible();
    });
});
