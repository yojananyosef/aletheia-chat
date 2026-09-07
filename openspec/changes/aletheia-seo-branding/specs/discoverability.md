# Spec: discoverability — SEO + branding

## ADDED Requirements

### Requirement: Metadata completa y canónica
El root layout SHALL definir `metadataBase` desde `NEXT_PUBLIC_SITE_URL` (con fallback
documentado), `title.template '%s | Aletheia Chat'`, OpenGraph (`es_ES`, `website`,
siteName Aletheia Chat), Twitter card `summary_large_image` y og-image derivada del logo.
Cada capítulo SHALL emitir canonical `/[book]/[chapter]` y título `«Libro N»` con la
marca aplicada por el template.

#### Scenario: capítulo comparte en redes
- GIVEN `/genesis/1` prerenderizado
- WHEN se inspecciona el `<head>`
- THEN contiene `og:title` "Génesis 1 | Aletheia Chat", `og:image` absoluta y
  `<link rel="canonical" href="{SITE_URL}/genesis/1">`.

### Requirement: Descubribilidad de rutas
`app/robots.ts` SHALL permitir todo y apuntar al sitemap. `app/sitemap.ts` SHALL listar
home + todos los capítulos publicados (fuente de verdad: FS de `public/data`, fallback
`BIBLE_BOOKS`). El manifest SHALL incluir `id` y `lang`.

#### Scenario: sitemap refleja el corpus
- GIVEN 43 libros con 1018 capítulos en `public/data`
- WHEN se sirve `/sitemap.xml`
- THEN contiene 1019 `<url>` (home + capítulos).

### Requirement: Iconografía unificada
Todo favicon/icono PWA/og-image SHALL derivarse de un único SVG maestro
(`public/logo.svg`) mediante `scripts/brand/build-icons.sh`; no SHALL haber iconos
huérfanos sin origen en el maestro.

#### Scenario: regeneración reproducible
- GIVEN el repo recién clonado con `rsvg-convert` e ImageMagick
- WHEN se ejecuta `scripts/brand/build-icons.sh`
- THEN `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`,
  `public/icon-{192,512}.png` y `app/opengraph-image.png` se regeneran byte-idénticos
  en dimensiones (512/180/1200x630).

### Requirement: Caché del corpus y 404 raíz
`public/data/**` SHALL servirse con `Cache-Control` público (`max-age=3600`,
`stale-while-revalidate=86400`) y la respuesta global SHALL incluir `nosniff`,
`Referrer-Policy` y `X-Frame-Options`. Rutas fuera del grupo `(app)` SHALL caer en un
`app/not-found.tsx` raíz con heading y enlace a inicio.

#### Scenario: capítulo JSON cacheado en CDN
- GIVEN `GET /data/genesis/1.json` en producción
- THEN la respuesta lleva `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.
