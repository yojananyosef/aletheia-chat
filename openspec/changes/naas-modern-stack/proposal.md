# naas-modern-stack

## Why

Bible Chat NAAS corre sobre Next.js 16 pero lo usa como hosting de Vite: routing con `useState` (sin deep-link/back/SEO), Tailwind 3 con purge incompleto, `localStorage` leído en `initialState` (warnings de hidratación React 19), 2 lockfiles (`bun.lock` + `pnpm-lock.yaml`), sin ESLint/tests, persistencia fragmentada en 5 claves sin validación, `select-none` global que rompe copiar versículos, y scroll forzado síncrono por mensaje.

## What Changes

- **Tooling**: pnpm único (elimina `bun.lock`), `.npmrc engine-strict`, `mise.toml` (node 22 + pnpm), todas las deps a latest (Tailwind 4, motion, ESLint 10, Vitest 4, Playwright).
- **Routing**: rutas reales `app/(app)/page.tsx` y `app/(app)/[book]/[chapter]/page.tsx` con `generateStaticParams`, `generateMetadata`, `notFound()`; `src/App.tsx` eliminado; navegación vía `useRouter`.
- **Styling**: Tailwind 4 (`@import "tailwindcss"` + `@theme`, `@tailwindcss/postcss`), `tailwind.config.js` eliminado, fuentes vía `next/font` (fuera del CDN de Google).
- **Persistence**: `StorageService` con claves versionadas `naas:v1:*`, validación Zod, `try/catch`, migración desde claves legacy; hidratación SSR-safe (defaults + efecto, flag `hydrated`).
- **Accessibility**: `select-none` removido del `body` y scoped al chrome de UI; `aria-label` en botones de solo icono.
- **Performance**: `useScrollOnUpdate` con `requestAnimationFrame`, scroll suave y guard near-bottom (no secuestra el scroll del usuario).

## Impact

- Affected specs: `routing`, `styling`, `persistence`, `tooling`, `accessibility`, `performance`
- Affected code: `app/**`, `src/**`, `package.json`, `postcss.config.*`, `tailwind.config.js` (borrado), `README.md`
- **Out of scope**: contenido bíblico (solo 7 capítulos JSON; la ingesta de la Biblia completa se hará en otro cambio), backend/auth/DB.
