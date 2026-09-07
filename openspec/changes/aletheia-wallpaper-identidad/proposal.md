# aletheia-wallpaper-identidad

## Why

La estrella del logo se perdía fusionada con el borde superior del libro; el muro del
chat era blanco puro (frío y con menos jerarquía que el muro con textura de WhatsApp,
referencia visual del producto) y el dominio de producción pasa de
`bible-app-naas.vercel.app` a `aletheiachat.johan.cl`.

## What Changes

- Logo v2: estrella de 4 puntas **blanca** y elevada (ya no solapa el libro); todos los
  iconos regenerados con `scripts/brand/build-icons.sh` (icon.svg, favicon.ico,
  apple-icon, PWA 192/512, og-image).
- Muro del feed: patrón SVG propio (`public/chat-pattern.svg`, tile 480, motas del
  dominio —burbuja, libro, pez, paloma, cruz, cáliz, ancla, arca, trigo...— al 6% de
  opacidad) sobre papel cálido `#F7F4ED`, estilo línea coherente con el neo-brutalist
  de la app. Las burbujas no cambian.
- `SITE_URL` por defecto → `https://aletheiachat.johan.cl` (canonical, OG y sitemap).

## Impact

- Affected specs: `chat-visual` (nueva)
- Affected code: `public/logo.svg`, `public/chat-pattern.svg` (nuevo),
  `scripts/brand/*`, iconos derivados, `app/globals.css`, `src/views/ChatView.tsx`,
  `src/constants/site.ts`, `README.md`
