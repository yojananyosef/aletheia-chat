// Verifica que GroupInfoDrawer NUNCA se sale del viewport, en viewports extremos.
// Uso: node scripts/verify-drawer.mjs   (requiere el dev server en :3000)
import { chromium } from '@playwright/test';

const URL = process.env.URL ?? 'http://localhost:3000/genesis/1';
// Viewports reales representativos, del móvil pequeño al escritorio grande.
const VIEWPORTS = [
    { name: 'iPhone SE landscape (peor caso real)', w: 667, h: 375 },
    { name: 'iPhone SE portrait', w: 375, h: 667 },
    { name: 'Galaxy S8 portrait', w: 360, h: 740 },
    { name: 'iPad portrait', w: 768, h: 1024 },
    { name: 'escritorio', w: 1296, h: 877 },
];

const browser = await chromium.launch();
let fail = 0;

for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Opciones de lectura' }).click();
    await page.getByRole('button', { name: /Información del Grupo/i }).click();
    const panel = page.locator('[aria-modal="true"]');
    await panel.waitFor();

    const m = await page.evaluate(() => {
        const p = document.querySelector('[aria-modal="true"]');
        const scroll = p.querySelector('.overflow-y-auto');
        const cta = [...p.querySelectorAll('button')].find((b) => /Reanudar/i.test(b.textContent || ''));
        const pr = p.getBoundingClientRect();
        const cr = cta.getBoundingClientRect();
        return {
            vh: window.innerHeight,
            panelTop: Math.round(pr.top), panelBottom: Math.round(pr.bottom),
            panelH: Math.round(pr.height), panelW: Math.round(pr.width),
            scrollClient: scroll.clientHeight, scrollContent: scroll.scrollHeight,
            ctaTop: Math.round(cr.top), ctaBottom: Math.round(cr.bottom),
            ctaVisible: cr.top >= -0.5 && cr.bottom <= window.innerHeight + 0.5,
            ctaEnPanel: cr.top >= pr.top - 0.5 && cr.bottom <= pr.bottom + 0.5,
        };
    });

    const dentro = m.panelTop >= -0.5 && m.panelBottom <= m.vh + 0.5;
    const problemas = [];
    if (!dentro) problemas.push('el panel se sale del viewport');
    if (!m.ctaVisible) problemas.push('el CTA no se ve');
    if (!m.ctaEnPanel) problemas.push('el CTA se sale del panel');
    if (m.scrollContent > m.scrollClient + 1 && m.scrollClient < 40) problemas.push(`el scroll se estrangula (${m.scrollClient}px)`);
    if (problemas.length) fail++;

    console.log(`${problemas.length ? '✗' : '✓'} ${vp.name} ${vp.w}x${vp.h}`);
    console.log(`    panel ${m.panelW}x${m.panelH}  y=[${m.panelTop},${m.panelBottom}] vh=${m.vh}`);
    console.log(`    scroll ${m.scrollClient}/${m.scrollContent}   CTA y=[${m.ctaTop},${m.ctaBottom}]`);
    if (problemas.length) console.log(`    → ${problemas.join(' · ')}`);

    await page.close();
}

await browser.close();
console.log(fail ? `\n${fail} viewport(s) con problemas` : '\nOK: el modal cabe y es alcanzable en todos los viewports');
process.exitCode = fail ? 1 : 0;
