import { test, expect } from '@playwright/test';

// El HTML prerenderizado debe exponer contenido real sin JS (SEO / lectores).
// Se usan locators no-ariales + `toBeAttached` (presencia en el HTML): sin JS no
// hay hidratación y el fallback de `loading.tsx` puede dejar el contenido fuera
// del árbol de accesibilidad en dev; en el build de producción el contenido sale
// visible (verificado en los HTML de `.next/server/app`). Para crawlers el HTML
// es lo que cuenta.
test.use({ javaScriptEnabled: false });

test.describe('SSR sin JS', () => {
    test('home muestra el catálogo sin JS', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1', { hasText: 'ALETHEIA CHAT' })).toBeAttached({ timeout: 20_000 });
        await expect(page.getByText('Génesis').first()).toBeAttached();
    });

    test('/genesis/1 expone título y texto bíblico sin JS', async ({ page }) => {
        await page.goto('/genesis/1');
        await expect(page.getByTestId('chapter-prerender')).toBeAttached({ timeout: 20_000 });
        await expect(page.locator('h1', { hasText: 'Génesis 1' })).toBeAttached();
        await expect(page.getByText('En el principio creó Dios el cielo y la tierra.')).toBeAttached();
    });
});
