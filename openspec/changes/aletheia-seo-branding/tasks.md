# Tasks — aletheia-seo-branding

- [x] 1.1 Logo maestro `public/logo.svg` (burbuja de chat Divine Yellow sobre negro #0A0A0A con libro abierto) y script reproducible `scripts/brand/build-icons.sh` (rsvg-convert + ImageMagick).
- [x] 1.2 Derivar: `app/icon.svg`, `app/favicon.ico` (16/32/48), `app/apple-icon.png` (180), `public/icon-192.png`, `public/icon-512.png`, `app/opengraph-image.png` (1200x630) + `opengraph-image.alt.txt`.
- [x] 2.1 `src/constants/site.ts` con `SITE_URL` (`NEXT_PUBLIC_SITE_URL` con fallback) reutilizado por layout/robots/sitemap.
- [x] 2.2 `app/layout.tsx`: `metadataBase`, `title.template/default`, OpenGraph (`es_ES`), Twitter card, `applicationName`.
- [x] 2.3 `generateMetadata` por capítulo: `title` sin marca (la aplica el template) + `alternates.canonical` `/[book]/[chapter]` + OpenGraph propio del capítulo (título, canonical e imagen).
- [x] 2.4 `app/robots.ts` (allow all + sitemap) y `app/sitemap.ts` (1019 URLs: home + capítulos desde FS con fallback a `BIBLE_BOOKS`); `chaptersFromFs` extraído a `src/core/services/catalogFs.ts` y reutilizado por la página del chat.
- [x] 2.5 `app/manifest.ts`: `id: '/'` y `lang: 'es'`.
- [x] 3.1 `next.config.js`: `headers()` con `Cache-Control` para `/data/**` y seguridad (nosniff, referrer, frame).
- [x] 3.2 `app/not-found.tsx` raíz con heading y vuelta a inicio.
- [x] 4.1 README reescrito: marca Aletheia Chat (sin Neo-AIDA/NAAS), logo, stack, quick start, QA, corpus/licencias, persistencia, despliegue + SEO/PWA.
- [x] 4.2 Validación: `pnpm lint` (0), `tsc --noEmit` (0), `NODE_ENV=test pnpm test` (37/37), `pnpm build` verde (1028 páginas). Verificado en HTML: `Génesis 1 | Aletheia Chat`, canonical `/genesis/1`, og:image 1200x630, favicon ico+svg+apple-icon, robots.txt y sitemap.xml con 1019 `<loc>`.
