# aletheia-pendientes

## Why

Backlog de brechas detectadas en la auditoría (ver `aletheia-seo-branding` y
`aletheia-wallpaper-identidad`) que NINGÚN change existente cubre. Se documenta para no
perderlas y para distinguirlas de lo ya cubierto por otros specs.

## What Changes (backlog, sin orden de ejecución)

- **SSR del contenido** (la más importante): home y `[book]/[chapter]` son client
  components completos; ni el catálogo ni el texto bíblico están en el HTML
  prerenderizado. Crawlers y lectores no ven contenido. Migrar a server components con
  islas client (feed interactivo) o prerender de los primeros N mensajes.
- **A11y avanzada**: `aria-live` para anunciar mensajes nuevos/typing a lectores de
  pantalla, skip-link, contraste del micro-texto `text-[8px]/[9px]` gris sobre claro,
  semántica dialog en `OptionsMenu` (nota pendiente en fase0 2.4).
- **PWA offline**: no hay service worker; sin red la app no abre. SW + estrategia
  cache-first para `public/data/**` (los JSON son inmutables por capítulo publicado).
- **Slug `revelation` → `apocalipsis`**: único libro con slug en inglés, rompe la
  convención es-ES del catálogo; requiere migración + redirect 301 para no romper URLs.
- **NT completo**: 23 libros / 171 capítulos pendientes de ingesta con el pipeline
  (`scripts/attribute-speakers/`), flujo por unidad ya establecido.

## Ya cubierto por otros changes (no duplicar aquí)

- Tests de fake timers (mezcla de capítulos / timer) → `naas-fase0-correctness-a11y` 1.4.
- Lighthouse manual → `naas-fase2-robustez-perf` 2.5 (nota pendiente).
- Migración total `getByText` → testid → `naas-fase2-robustez-perf` 2.4 (nota pendiente).
- Regeneración Génesis 1-3 + Éxodo 1-4 con `--write` → `naas-fase3-biblia-alethia` 2.3.
- SEO, favicon, robots/sitemap, caché `/data/**`, 404 raíz → `aletheia-seo-branding` (hecho).
- Muro del feed + logo v2 + dominio → `aletheia-wallpaper-identidad` (hecho).

## Impact

- Affected specs: `indexabilidad` (nueva), `chat-visual` (extensión a11y), `pwa-offline` (nueva)
- Affected code: `src/views/**`, `src/components/chat/**`, `src/constants/books.ts`,
  `public/data/**`, `next.config.js` (redirects)
