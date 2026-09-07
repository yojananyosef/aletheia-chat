# Tasks — aletheia-pendientes

Backlog sin orden fijo; cada unidad se ejecuta end-to-end (cambios → validaciones →
openspec → commits) siguiendo el flujo estándar del repo.

- [ ] 1. SSR del contenido: catálogo de la home prerenderizado en server + primeros mensajes del capítulo en HTML (islas client para interacción). Meta: el texto bíblico visible sin JS.
- [ ] 2. A11y avanzada: `aria-live="polite"` en el feed (anunciar mensajes nuevos/typing), skip-link, subir contraste del micro-texto gris (`text-gray-400/500` → tono AA), `OptionsMenu` con semántica dialog (cruza fase0 2.4).
- [ ] 3. PWA offline: service worker (o `next-pwa`/serwist si compatible con Next 16) con cache-first para `public/data/**` y app-shell.
- [ ] 4. Slug `apocalipsis` (hoy `revelation`): renombrar en `books.ts` + `public/data/` + redirects 301 en `next.config.js`.
- [ ] 5. NT completo: ingesta de los 23 libros restantes con el flujo por unidad (heurística → LLM review → sweep → unlock → e2e).
