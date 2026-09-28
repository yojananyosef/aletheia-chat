import { test, expect } from '@playwright/test';

/**
 * El desbloqueo progresivo no puede depender de un enlace compartido.
 * computeUnlocked abre un libro si el anterior está completo o si ya fue
 * visitado; antes, ChatView escribía `lastChapter` al montar, así que abrir
 * un deep-link de un libro bloqueado lo dejaba abierto PARA SIEMPRE.
 *
 * Claves: naas:v1:completed:<book>:<cap>, :lastChapter:<book>, :linkedChapter:<book>
 */
/** Marca capítulos como completados. Un solo argumento: Playwright no acepta más. */
const setComplete = ({ book, caps }: { book: string; caps: number[] }) => {
    for (const c of caps) window.localStorage.setItem(`naas:v1:completed:${book}:${c}`, '1');
};

test.describe('desbloqueo progresivo y enlaces compartidos', () => {
    test('entrar por enlace a un libro bloqueado NO lo desbloquea', async ({ page }) => {
        await page.goto('/');
        // Éxodo está bloqueado al arrancar (Génesis incompleto).
        await expect(page.getByRole('button', { name: /Abrir Éxodo|Próximamente/ }).first()).toBeVisible();

        // Deep-link a Éxodo 5: la ruta existe y se puede leer (por diseño).
        await page.goto('/exodus/5');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        await expect(page.getByRole('heading', { name: /Éxodo/ })).toBeVisible();

        // Pero NO puede contar como visitado.
        const last = await page.evaluate(() => window.localStorage.getItem('naas:v1:lastChapter:exodus'));
        expect(last).toBeNull();

        // El capítulo compartido queda registrado aparte, para poder ofrecerlo.
        const linked = await page.evaluate(() => window.localStorage.getItem('naas:v1:linkedChapter:exodus'));
        expect(linked).toBe('5');
    });

    test('el Home ofrece el capítulo compartido sin abrir el libro entero', async ({ page }) => {
        await page.goto('/exodus/5');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });

        await page.goto('/');
        const fila = page.getByRole('button', { name: /Abrir Éxodo, capítulo 5/ });
        await expect(fila).toBeVisible();
        // Y al pulsarlo se va a ese capítulo, no al primero.
        await fila.click();
        await expect(page).toHaveURL(/\/exodus\/5$/);
    });

    test('leer un libro ya desbloqueado sí registra el progreso', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        // Génesis es el primero: siempre abierto, así que es lectura propia.
        const last = await page.evaluate(() => window.localStorage.getItem('naas:v1:lastChapter:genesis'));
        expect(last).toBe('1');
        const linked = await page.evaluate(() => window.localStorage.getItem('naas:v1:linkedChapter:genesis'));
        expect(linked).toBeNull();
    });

    test('completar el anterior abre el siguiente', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toHaveCount(0, { timeout: 20_000 });
        // Los 50 capítulos de Génesis como completados.
        await page.evaluate(setComplete, { book: 'genesis', caps: Array.from({ length: 50 }, (_, i) => i + 1) });
        await page.goto('/');
        await expect(page.getByRole('button', { name: /Abrir Éxodo/ }).first()).toBeVisible();
    });

    test('un enlace NO puede abrir un libro que sigue bloqueado', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(setComplete, { book: 'genesis', caps: [1] }); // a medias: Éxodo sigue cerrado
        await page.goto('/');
        // Éxodo no debe ser accesible desde la lista.
        const abierto = page.getByRole('button', { name: /Abrir Éxodo/ });
        await expect(abierto).toHaveCount(0);
        await expect(page.getByText(/Completa Génesis/)).toBeVisible();
    });
});
