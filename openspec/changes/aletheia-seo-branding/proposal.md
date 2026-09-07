# aletheia-seo-branding

## Why

La app no es indexable ni compartible: sin `metadataBase`, OpenGraph, Twitter cards,
canonical, `robots.txt`, `sitemap.xml`, favicon ni og-image. Los iconos existentes
(`public/icon-192/512.png`) no tienen logo propio ni favicon derivado. El README aún
usa wording Neo-AIDA/NAAS. Además, `public/data/**` se sirve sin cabeceras de caché
(el corpus se re-descarga en cada visita) y no hay 404 raíz fuera del grupo `(app)`.

## What Changes

- Identidad: logo propio (SVG maestro en `public/logo.svg`) del que se derivan,
  con script reproducible (`scripts/brand/build-icons.sh`), `app/icon.svg`,
  `app/favicon.ico`, `app/apple-icon.png`, iconos PWA 192/512 y og-image.
- SEO: `metadataBase` + `title.template/default` + OpenGraph + Twitter card +
  canonical en layout; `title` + canonical por capítulo; `app/robots.ts`,
  `app/sitemap.ts` (1019 URLs desde el catálogo), `manifest.ts` con `id`/`lang`.
- Infra: `headers()` en `next.config.js` con caché para `/data/**` y cabeceras de
  seguridad; `app/not-found.tsx` raíz.
- Docs: README reescrito bajo la marca Aletheia Chat (sin wording Neo-AIDA/NAAS),
  con logo, despliegue (`NEXT_PUBLIC_SITE_URL`), SEO/PWA y QA.

## Impact

- Affected specs: `discoverability` (nueva)
- Affected code: `app/layout.tsx`, `app/(app)/[book]/[chapter]/page.tsx`,
  `app/manifest.ts`, `app/robots.ts` y `app/sitemap.ts` (nuevos),
  `app/not-found.tsx` (nuevo), `app/icon.svg` / `app/favicon.ico` /
  `app/apple-icon.png` / `app/opengraph-image.*` (nuevos), `public/logo.svg` e
  iconos PWA (nuevos/regenerados), `scripts/brand/` (nuevo), `next.config.js`,
  `src/constants/site.ts` (nuevo), `README.md`
