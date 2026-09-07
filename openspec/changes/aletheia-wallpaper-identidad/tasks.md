# Tasks — aletheia-wallpaper-identidad

- [x] 1.1 Logo v2: estrella blanca elevada en `public/logo.svg` y espejo en `scripts/brand/opengraph.svg`; regeneración completa de iconos.
- [x] 1.2 `public/chat-pattern.svg`: tile 480 con 20 motas del dominio en estilo línea (`stroke #0A0A0A`, `opacity 0.06`).
- [x] 1.3 `.chat-feed` en `globals.css` con `#F7F4ED` + patrón (480px); `bg-white` retirado del `<section>` en `ChatView.tsx`.
- [x] 1.4 `src/constants/site.ts`: fallback `https://aletheiachat.johan.cl`; README actualizado.
- [x] 1.5 Validación: lint 0, `tsc --noEmit` 0, `NODE_ENV=test pnpm test` 37/37, `pnpm build` verde y sitemap emitiendo el dominio nuevo.
