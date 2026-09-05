# naas-fase2-robustez-perf

## Why

Sin `loading/error/not-found`, `Zod throw` de `BibleDataService` llega como texto crudo al feed;
`navigateToChapter` hace `clearProgress` del destino (nunca resume); `getProgress` no valida rango;
chat sin virtualización (50+ `motion.div` en Génesis 1); `useScrollOnUpdate` solo autoscroll si cerca
pero sin botón "ir abajo"; icons PWA 420K; `tsconfig` con `noUnusedLocals:false`; e2e solo chromium.

## What Changes

- `app/(app)/loading.tsx, error.tsx, not-found.tsx` + `ErrorBoundary` por capítulo inválido.
- No borrar progreso al navegar (solo `restart` explícito); `getProgress` valida `0 <= i < length` en hook.
- Perf: `content-visibility:auto` en feed + botón flotante "ir abajo" cuando usuario sube; `preload` pop.mp3; optimizar icons.
- `tsconfig` strict real (`noUnusedLocals/Parameters:true`); Playwright `chromium+firefox` (o al menos `testId` estables en vez de `getByText`).

## Impact

- Affected specs: `routing-robustness`, `performance`
- Affected code: `app/**`, `src/hooks/useBibleChat.ts`, `StorageService.ts`, `ChatView.tsx`, `useScrollOnUpdate.ts`, `public/*`, configs
