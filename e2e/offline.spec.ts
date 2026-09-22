import { test, expect } from '@playwright/test';

/**
 * PWA offline: el SW sirve HTML cacheado + JSON del corpus sin red.
 * NOTA: la re-hidratación completa offline solo se verifica en producción
 * (`pnpm build && pnpm start`, comprobado manual: gate a 0 sin errores);
 * en `next dev` el runtime de desarrollo no hidrata sin conexión, así que
 * aquí se aserta lo que el SW garantiza en ambos entornos.
 */
test.describe('PWA offline', () => {
    test('capítulo visitado se sirve sin red (HTML + JSON del SW)', async ({ page, context }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Génesis/ })).toBeVisible();

        const swReady = await page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return false;
            try {
                await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
                ]);
                return (await navigator.serviceWorker.getRegistration()) != null;
            } catch {
                return false;
            }
        });
        test.skip(!swReady, 'SW no registrado (servidor dev reutilizado sin NEXT_PUBLIC_SW=1)');

        // Recarga online para poblar caché de navegación; el JSON se ceba
        // explícito (la app puede no fetchearlo si el prerender le basta).
        await page.reload();
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        const onlineTitle = await page.evaluate(async () => {
            const res = await fetch('/data/genesis/1.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return ((await res.json()) as { title: string }).title;
        });
        await page.waitForTimeout(1000);

        await context.setOffline(true);
        await page.reload();
        // HTML prerenderizado servido desde la caché del SW (sin hidratar en dev).
        await expect(page.getByRole('heading', { name: /Génesis/ }).first()).toBeVisible({
            timeout: 20_000,
        });
        await expect(page.getByText('En el principio creó Dios el cielo y la tierra.')).toBeVisible({
            timeout: 20_000,
        });
        // El JSON del corpus sale de la caché cache-first del SW.
        const chapter = await page.evaluate(async () => {
            const res = await fetch('/data/genesis/1.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return (await res.json()) as { title: string; messages: unknown[] };
        });
        expect(chapter.messages.length).toBeGreaterThan(0);
        expect(chapter.title).toBe(onlineTitle);
    });

    test('capítulo no visitado sin red cae a la página offline', async ({ page, context }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'ALETHEIA CHAT' })).toBeVisible();

        const swReady = await page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return false;
            try {
                await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
                ]);
                return (await navigator.serviceWorker.getRegistration()) != null;
            } catch {
                return false;
            }
        });
        test.skip(!swReady, 'SW no registrado (servidor dev reutilizado sin NEXT_PUBLIC_SW=1)');

        // Levítico 1 nunca se visitó en este contexto: sin red debe servir /offline.
        await context.setOffline(true);
        await page.goto('/levitico/1');
        await expect(page.getByRole('heading', { name: /sin conexión/i })).toBeVisible({
            timeout: 20_000,
        });
        await expect(page.getByRole('link', { name: /volver al inicio/i })).toBeVisible();
    });
});
