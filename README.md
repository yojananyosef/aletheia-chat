# Aletheia Chat

<p align="center">
  <img src="public/logo.svg" width="112" alt="Logo de Aletheia Chat: burbuja de chat amarilla con libro abierto">
</p>

Lectura bíblica conversacional: cada capítulo se lee como una conversación en tiempo real
entre sus protagonistas. Diseñada mobile-first, instalable como PWA y con rutas reales por
capítulo para compartir y indexar.

## ✨ Características

- **Lectura tipo chat:** la narración del Narrador avanza sola a un ritmo de lectura natural; Dios y los personajes **pausan** y esperan tu toque (con preview y botón de envío).
- **Rutas reales por capítulo:** deep-linking (`/genesis/1`), back-button y metadata por libro/capítulo; prerenderizado estático de los 1.018 capítulos publicados con 404 para combinaciones inválidas.
- **Favoritos:** doble toque (o doble Enter) sobre una burbuja para marcar versículos con ❤️.
- **Progreso:** reanuda donde dejaste cada capítulo y recuerda el último capítulo visitado por libro.
- **Centro de control:** catálogo con búsqueda (sin tildes: "genesis" encuentra Génesis), favoritos y progresión espiritual por niveles según lo que guardas.
- **Sonido e inmersión:** micro-interacción `pop` por mensaje (silenciable) y velocidades Zen / Norm / Fast.
- **PWA instalable:** manifest standalone, iconos propios y tema amarillo `#FFD600`.

## 🛠️ Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Arquitectura:** Screaming Architecture (dominio aislado en `src/`) + Clean Code
- **Estilos:** Tailwind CSS 4 (config CSS-first con `@theme`) + `next/font`
- **Animaciones:** Motion (ex Framer Motion) · **Iconos:** Lucide React
- **Validación:** Zod (datos de capítulos y persistencia)
- **QA:** ESLint 9 (flat config) + Vitest + Testing Library + Playwright

## 📦 Inicio rápido

Requisitos: Node 22+ y pnpm (ver `mise.toml`).

```bash
git clone https://github.com/yojananyosef/aletheia-chat.git
cd aletheia-chat
pnpm install
pnpm dev        # http://localhost:3000
```

Verificación completa:

```bash
pnpm lint                 # ESLint
npx tsc --noEmit          # Tipos
NODE_ENV=test pnpm test   # Vitest (con NODE_ENV=test: si el shell exporta production, React rompe en tests)
pnpm build                # Build de producción
pnpm test:e2e             # Playwright (arranca pnpm dev)
node --test scripts/attribute-speakers/run.test.mjs   # Regresión del pipeline del corpus
```

## 🗺️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home: catálogo de libros, búsqueda y favoritos |
| `/[book]/[chapter]` | Chat de lectura (ej. `/genesis/1`) — prerenderizado con `generateStaticParams`, 404 para combinaciones inválidas |

## 🏗️ Arquitectura

- `app/` solo routing (layout, `manifest.ts`, `robots.ts`, `sitemap.ts`, iconos, route group `(app)/`).
- `src/` contiene el dominio: `views/`, `components/`, `hooks/`, `context/`, `core/` (`domain/Message.ts` es la fuente de verdad de hablantes y reglas de avance) y `constants/books.ts` (manifiesto del canon: 66 libros, 43 desbloqueados).
- `scripts/attribute-speakers/`: pipeline que genera el corpus (heurística de hablantes + revisión LLM de ambiguos + QA).
- `scripts/brand/`: iconos derivados de un único SVG maestro (`public/logo.svg`).

## 🔍 SEO, PWA y despliegue

- **Metadata completa:** `metadataBase`, `title.template` (`«Génesis 1 | Aletheia Chat»`), OpenGraph y Twitter card con `app/opengraph-image.png`, y canonical por página.
- **Descubribilidad:** `app/robots.ts` + `app/sitemap.ts` (home + todos los capítulos publicados) generados en build desde el catálogo.
- **Iconos:** `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` e iconos PWA 192/512 derivados de `public/logo.svg` con:

  ```bash
  ./scripts/brand/build-icons.sh   # requiere librsvg (rsvg-convert) e ImageMagick
  ```

- **Despliegue (Vercel):** define `NEXT_PUBLIC_SITE_URL` con el dominio final para que canonical, OpenGraph y sitemap emitan URLs absolutas correctas (por defecto: `https://aletheiachat.johan.cl`).
- **Caché y seguridad:** `next.config.js` sirve `public/data/**` con `Cache-Control` (`max-age=3600`, `stale-while-revalidate=86400`) y añade `nosniff`, `Referrer-Policy` y `X-Frame-Options`.

## 📂 Estructura de datos

Los capítulos viven en `public/data/[libro]/[capitulo].json`:

```json
{
  "book": "Génesis",
  "chapter": 1,
  "title": "La Creación",
  "messages": [
    {
      "id": "g1_1",
      "speaker": "Narrador",
      "verse": 1,
      "text": "En el principio, Dios creó los cielos y la tierra."
    }
  ]
}
```

## 📜 Fuentes bíblicas y licencias

El corpus de `public/data/` se genera con `scripts/attribute-speakers/` desde
`/home/j/proyectos/alethia-gateway/public/data/bibles/`:

| Fuente | Libros | Uso |
|--------|--------|-----|
| **SpaRVG** (Reina Valera Gómez 2010) | 66 / 1189 caps | Texto principal en español moderno |
| **SpaPlatense** (Straubinger) | 73 / 1334 caps | Títulos de sección (`headings`) + deuterocanónicos |
| **RV1909** (Reina Valera 1909) | 66 / 1189 caps | Fallback de dominio público (`--source RV1909`) |

> ⚖️ **Aviso legal:** SpaRVG y Platense pueden tener restricciones de redistribución.
> Revisa sus licencias antes de publicar el corpus. RV1909 es dominio público y es la
> opción segura si redistribuyes la app con datos incluidos. Ver `scripts/attribute-speakers/README.md`.

Estado del corpus: **43 / 66 libros publicados** (1.018 capítulos). Pendiente el Nuevo
Testamento completo (23 libros, 171 capítulos) más los desbloqueos en `books.ts`.

## 💾 Persistencia (localStorage)

| Clave | Contenido |
|-------|-----------|
| `naas:v1:favorites` | Versículos marcados con ❤️ (schema Zod) |
| `naas:v1:settings` | Sonido y velocidad de lectura |
| `naas:v1:lastChapter:{book}` | Último capítulo visitado por libro |
| `naas:v1:progress:{book}:{chapter}` | Índice de mensaje para reanudar lectura |

> Las claves conservan el prefijo histórico `naas:v1:*` como identificador interno de
> almacenamiento; la marca visible de la app es **Aletheia Chat**. Las claves legacy
> (`bible_favorites`, `isMuted`, `readingSpeedMultiplier`, `lastChapter_*`, `chatProgress_*`)
> se migran automáticamente la primera vez que se leen.

## 🎨 Diseño

- Alto contraste: negro `#0A0A0A` sobre blanco `#FAFAFA` con acento "Divine Yellow" `#FFD600`.
- Tipografía Space Grotesk (identidad) + Inter (lectura), self-hosted con `next/font`.
- Sombras offset y bordes duros, optimizado de móvil a 4K.

---

Desarrollado con ❤️ para una experiencia bíblica moderna.
