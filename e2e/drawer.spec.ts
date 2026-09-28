import { test, expect } from '@playwright/test';

/**
 * El modal de información del grupo se acotaba a max-w-md sin alto máximo ni
 * scroll: con 45 chips (Génesis) "Verificación Canónica" y el CTA quedaban
 * recortados e inalcanzables, porque <main> y <body> son overflow-hidden.
 */
const VIEWPORTS = [
    { name: 'iPhone SE landscape (peor caso)', w: 667, h: 375 },
    { name: 'iPhone SE portrait', w: 375, h: 667 },
    { name: 'iPad portrait', w: 768, h: 1024 },
    { name: 'escritorio', w: 1296, h: 877 },
];

for (const vp of VIEWPORTS) {
    test.describe(`modal del grupo @ ${vp.name}`, () => {
        test.use({ viewport: { width: vp.w, height: vp.h } });

        test('cabe en el viewport, hace scroll y el CTA es alcanzable', async ({ page }) => {
            await page.goto('/genesis/1');
            await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });

            await page.getByRole('button', { name: 'Opciones de lectura' }).click();
            await page.getByRole('button', { name: /Información del Grupo/i }).click();
            const panel = page.getByRole('dialog', { name: /Información del grupo/i });
            await expect(panel).toBeVisible();

            const m = await panel.evaluate((p) => {
                const scroll = p.querySelector('.overflow-y-auto')!;
                const cta = [...p.querySelectorAll('button')].find((b) => /Reanudar/i.test(b.textContent || ''))!;
                const pr = p.getBoundingClientRect();
                const cr = cta.getBoundingClientRect();
                return {
                    vh: window.innerHeight,
                    panelTop: pr.top, panelBottom: pr.bottom,
                    ctaTop: cr.top, ctaBottom: cr.bottom,
                    scrollClient: scroll.clientHeight, scrollContent: scroll.scrollHeight,
                };
            });

            // 1. El panel no se sale del viewport.
            expect(m.panelTop).toBeGreaterThanOrEqual(-0.5);
            expect(m.panelBottom).toBeLessThanOrEqual(m.vh + 0.5);
            // 2. El CTA está dentro del panel y de la pantalla.
            expect(m.ctaTop).toBeGreaterThanOrEqual(m.panelTop - 0.5);
            expect(m.ctaBottom).toBeLessThanOrEqual(m.panelBottom + 0.5);
            expect(m.ctaBottom).toBeLessThanOrEqual(m.vh + 0.5);
            // 3. El contenido excede y por tanto debe poder desplazarse.
            expect(m.scrollContent).toBeGreaterThan(m.scrollClient);
            // 4. Y el área de scroll no queda estrangulada.
            expect(m.scrollClient).toBeGreaterThan(40);
        });

        test('el scroll del modal alcanza el final del contenido', async ({ page }) => {
            await page.goto('/genesis/1');
            await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
            await page.getByRole('button', { name: 'Opciones de lectura' }).click();
            await page.getByRole('button', { name: /Información del Grupo/i }).click();
            const panel = page.getByRole('dialog', { name: /Información del grupo/i });
            await expect(panel).toBeVisible();

            // "Verificación Canónica" está al final: si no hay scroll, es inalcanzable.
            const verificacion = panel.getByText(/Verificación Canónica/i);
            await panel.locator('.overflow-y-auto').evaluate((el) => el.scrollTo(0, el.scrollHeight));
            await expect(verificacion).toBeInViewport();

            // El CTA sigue siendo clicable tras desplazar.
            await panel.getByRole('button', { name: /Reanudar Lectura/i }).click();
            await expect(panel).toHaveCount(0);
        });
    });
}

/** Un libro corto no debe dejar un panel hueco ni estirado. */
test.describe('modal del grupo — libro corto', () => {
    test.use({ viewport: { width: 1296, height: 877 } });

    test('Abdías (2 miembros) ajusta el panel al libro', async ({ page }) => {
        await page.goto('/abdias/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await page.getByRole('button', { name: 'Opciones de lectura' }).click();
        await page.getByRole('button', { name: /Información del Grupo/i }).click();
        const panel = page.getByRole('dialog', { name: /Información del grupo/i });
        await expect(panel).toBeVisible();

        const h = await panel.evaluate((p) => p.getBoundingClientRect().height);
        // Con max-h (no h-fijo) un libro de 2 miembros no ocupa 85vh de vacío.
        expect(h).toBeLessThan(877 * 0.85);
    });
});
