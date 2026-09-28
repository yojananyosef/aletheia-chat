import { test, expect } from '@playwright/test';

/** Quita la Web Share API de verdad: `share`/`canShare` viven en el prototipo,
 *  así que `delete navigator.share` no borraba nada. */
const SIN_SHARE = () => {
    for (const m of ['share', 'canShare']) {
        Object.defineProperty(Navigator.prototype, m, { value: undefined, configurable: true });
    }
};

/**
 * Compartir: la hoja ofrece dos destinos — enlace (deep-link) e imagen (card
 * PNG del versículo). En desktop sin Web Share API el enlace va por
 * portapapeles y la imagen cae a la descarga del PNG.
 */
test.describe('Compartir', () => {
    test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

    test('copia el enlace del capítulo desde la hoja', async ({ page, context }) => {
        // Sin Web Share API en desktop Chromium: va por la vía portapapeles.
        await context.addInitScript(SIN_SHARE);
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();

        await page.getByRole('button', { name: /compartir capítulo/i }).click();

        // La hoja ofrece los dos destinos y ninguno se dispara solo.
        const sheet = page.getByRole('dialog', { name: /Compartir/i });
        await expect(sheet).toBeVisible();
        await expect(sheet.getByRole('button', { name: /^Enlace/ })).toBeVisible();
        await expect(sheet.getByRole('button', { name: /Imagen/ })).toBeVisible();

        await sheet.getByRole('button', { name: /^Enlace/ }).click();

        // Feedback visible + URL real en el portapapeles.
        await expect(sheet.getByText(/¡Enlace copiado!/i)).toBeVisible();
        const clip = await page.evaluate(() => navigator.clipboard.readText());
        expect(clip).toContain('/genesis/1');
    });

    test('la hoja se cierra con Escape', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });

        await page.getByRole('button', { name: /compartir capítulo/i }).click();
        const sheet = page.getByRole('dialog', { name: /Compartir/i });
        await expect(sheet).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(sheet).toHaveCount(0);
    });

    test('no hay botón de compartir en las burbujas', async ({ page, context }) => {
        // Un icono por mensaje rompía la lectura; el selector vive en la hoja.
        await context.addInitScript(() => {
            window.localStorage.setItem('naas:v1:progress:genesis:1', '20');
        });
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.locator('button[aria-label*="Compartir versículo"]')).toHaveCount(0);
    });

    test('la hoja deja multi-seleccionar versículos y descarga la card', async ({ page, context }) => {
        await context.addInitScript(() => {
            for (const m of ['share', 'canShare']) {
                Object.defineProperty(Navigator.prototype, m, { value: undefined, configurable: true });
            }
            window.localStorage.setItem('naas:v1:progress:genesis:1', '6');
        });
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });

        await page.getByRole('button', { name: /compartir capítulo/i }).click();
        const sheet = page.getByRole('dialog', { name: /Compartir/ });
        await expect(sheet).toBeVisible();

        // Solo ofrece los mensajes ya leídos, y por defecto marca el último
        // (el que el lector tiene en pantalla).
        const opciones = sheet.locator('li button[aria-pressed]');
        await expect(opciones.first()).toBeVisible();
        expect(await opciones.count()).toBeGreaterThan(1);
        const imagen = sheet.getByRole('button', { name: /Imagen/ });
        await expect(imagen).toContainText('1 versículo');

        // Marcar un segundo versículo amplía la referencia a un rango. Los dos
        // pueden no ser consecutivos, así que se comprueban los dos extremos
        // (min y max) en lugar de un "v1-v2" que dependería del orden de marcado.
        const segundo = opciones.nth(1);
        const v2 = Number((await segundo.textContent())!.match(/v\.(\d+)/)![1]);
        const vPorDefecto = Number((await imagen.textContent())!.match(/1:(\d+)/)![1]);
        await segundo.click();
        await expect(imagen).toContainText('2 versículos');
        await expect(imagen).toContainText(`1:${Math.min(v2, vPorDefecto)}-${Math.max(v2, vPorDefecto)}`);

        // Desmarcarlo vuelve al caso de un solo versículo.
        await segundo.click();
        await expect(imagen).toContainText('1 versículo');

        const downloadPromise = page.waitForEvent('download', { timeout: 20_000 });
        await imagen.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/^genesis-1-\d+\.png$/);
        await expect(sheet.getByText(/Imagen descargada/i)).toBeVisible();
    });

    test('el versículo 3 separa la voz de Dios de la del narrador', async ({ request }) => {
        // Regresión del corpus: "Sea la luz; y fue la luz." es discurso + narración.
        const res = await request.get('/data/genesis/1.json');
        expect(res.ok()).toBeTruthy();
        const cap = await res.json();
        const v3 = cap.messages.filter((m: { verse: number }) => m.verse === 3);
        expect(v3.map((m: { speaker: string }) => m.speaker)).toEqual(['Narrador', 'Dios', 'Narrador']);
        expect(v3.map((m: { text: string }) => m.text)).toEqual(['Y dijo Dios:', 'Sea la luz.', 'Y fue la luz.']);
    });
});
