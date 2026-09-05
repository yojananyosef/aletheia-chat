# Bible Chat NAAS 📖✨

Una aplicación de lectura bíblica inmersiva diseñada bajo el sistema **Neo-AIDA Accessible System (NAAS)**. Esta app transforma la lectura tradicional en una experiencia de chat interactiva, fluida y visualmente impactante.

## 🚀 Características Premium

- **Experiencia Inmersiva de Chat:** Lee la Biblia como si estuvieras en una conversación en tiempo real con sus protagonistas.
- **Rutas reales por capítulo:** Deep-linking (`/genesis/1`), back-button del navegador y metadata por libro/capítulo (App Router).
- **Diseño Adaptativo Extremo:** Optimizado para todo tipo de pantallas, desde móviles hasta monitores 4K Cinema.
- **Sistema NAAS v3.4:** Interfaz de alto contraste, tipografía premium (Space Grotesk) y jerarquía visual matemática.
- **Lectura Adaptativa Humana:** Los mensajes avanzan a un ritmo de lectura natural, calculando el tiempo según la longitud del texto.
- **Efectos de Sonido:** Micro-interacciones auditivas (pop) para una mayor inmersión.
- **Navegación Inteligente:** Selector de libros dinámico y pausas estratégicas en títulos de sección.
- **Likes Interactivos:** Doble toque estilo Instagram para marcar tus versículos favoritos con un corazón dinámico.
- **Persistencia versionada:** Progreso, favoritos y ajustes en `localStorage` con claves `naas:v1:*`, validación Zod y migración automática desde versiones anteriores.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Arquitectura:** Screaming Architecture (Dominio Aislado) + Clean Code / Principios SOLID
- **Estilos:** Tailwind CSS 4 (config CSS-first con `@theme`) + `next/font`
- **Animaciones:** Motion (ex Framer Motion)
- **Iconos:** Lucide React
- **Validación:** Zod (datos de capítulos y persistencia)
- **QA:** ESLint 9 (flat config) + Vitest + Testing Library + Playwright

## 📦 Instalación y Desarrollo

Requisitos: Node 22+ y pnpm (ver `mise.toml`).

1. Clona el repositorio:
   ```bash
   git clone https://github.com/yojananyosef/bible-app-naas.git
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   (Abre http://localhost:3000)

4. Verificación completa:
   ```bash
   pnpm lint        # ESLint
   pnpm test        # Vitest (unit)
   pnpm build       # Build de producción
   pnpm test:e2e    # Playwright (e2e, arranca pnpm dev)
   ```

## 🗺️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home: catálogo de libros, búsqueda y favoritos |
| `/[book]/[chapter]` | Chat de lectura (ej. `/genesis/1`, `/exodus/4`) — prerenderizado con `generateStaticParams`, 404 para combinaciones inválidas |

## 📂 Estructura de Datos

Los capítulos se almacenan en formato JSON en `public/data/[libro]/[capitulo].json` con la siguiente estructura:

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

## 💾 Persistencia (localStorage)

| Clave | Contenido |
|-------|-----------|
| `naas:v1:favorites` | Versículos marcados con ❤️ (schema Zod) |
| `naas:v1:settings` | Sonido y velocidad de lectura |
| `naas:v1:lastChapter:{book}` | Último capítulo visitado por libro |
| `naas:v1:progress:{book}:{chapter}` | Índice de mensaje para reanudar lectura |

Las claves legacy (`bible_favorites`, `isMuted`, `readingSpeedMultiplier`, `lastChapter_*`, `chatProgress_*`) se migran automáticamente la primera vez que se leen.

## 🎨 Principios de Diseño

- **AIDA:** Attention (Header/Title), Interest (Chat Feed), Desire (Interactivity), Action (Section Buttons).
- **Contraste:** Uso de negro puro `#0A0A0A` sobre fondo `#FAFAFA` para máxima legibilidad.
- **Acentos:** El color "Divine Yellow" `#FFD600` para resaltar a Dios y acciones principales.

---
Desarrollado con ❤️ para una experiencia bíblica moderna.
