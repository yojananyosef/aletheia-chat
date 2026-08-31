# Tasks — naas-modern-stack

## 1. Tooling & Deps
- [x] 1.1 Eliminar `bun.lock`; `package.json` a latest (next 16.3.3, tailwind 4.3, motion 13, lucide-react 1.38, vitest 4, playwright 1.62, eslint 10, @types/react 19) y scripts (`lint` = eslint, `test`, `test:e2e`)
- [x] 1.2 `.npmrc` con `engine-strict=true` + `engines.node >=22`; `mise.toml` (node 22, pnpm latest)
- [x] 1.3 `pnpm install` verde con lockfile único `pnpm-lock.yaml`

## 2. Styling (Tailwind 4 + next/font)
- [x] 2.1 `postcss.config.mjs` con `@tailwindcss/postcss`; borrar `tailwind.config.js`
- [x] 2.2 `src/index.css`: `@import "tailwindcss"` + `@theme` (font tokens, colores) + `@utility naas-*`; migrar `shadow-inner`
- [x] 2.3 `app/layout.tsx`: `next/font` (Inter + Space Grotesk), fuera CDN Google

## 3. Persistence
- [x] 3.1 `FavoriteMessageSchema` en `bibleSchemas.ts`
- [x] 3.2 `src/core/services/StorageService.ts`: claves `naas:v1:*`, Zod safeParse, try/catch, migración legacy, SSR no-op
- [x] 3.3 `PersistentStateContext` → solo favorites + getInitialChapter, patrón default→hydrate→persist
- [x] 3.4 `useSettings`/`useAudio` vía StorageService, SSR-safe
- [x] 3.5 `useBibleChat` progreso vía StorageService

## 4. Routing
- [x] 4.1 `src/components/AppProviders.tsx` (client) + `app/(app)/layout.tsx`
- [x] 4.2 `app/(app)/page.tsx` → HomeView (client, `useRouter.push`)
- [x] 4.3 `app/(app)/[book]/[chapter]/page.tsx`: `await params`, zod/`notFound()`, `generateStaticParams`, `generateMetadata`, `dynamicParams=false`
- [x] 4.4 ChatView con props `bookId`/`chapter`, `router.push` para back/capítulos, registra `lastChapter`
- [x] 4.5 Eliminar `src/App.tsx` y `app/page.tsx` legacy

## 5. Accessibility
- [x] 5.1 Quitar `select-none` global del body; scoped a chrome de UI
- [x] 5.2 `aria-label` en icon-only buttons (header home, chat header, drawers, send)

## 6. Performance
- [x] 6.1 `useScrollOnUpdate`: rAF + smooth + near-bottom guard

## 7. QA
- [x] 7.1 `eslint.config.mjs` flat (FlatCompat next/core-web-vitals + next/typescript)
- [x] 7.2 `vitest.config.ts` + setup; tests: Message, useSpiritualLevel, useBookFilter, StorageService, useBibleChat
- [x] 7.3 `playwright.config.ts` + e2e: deep-link, navegación home→chat→back, doble-tap like + persistencia
- [x] 7.4 `pnpm lint && pnpm test && pnpm build` verde
- [x] 7.5 README: pnpm único + estructura actualizada
