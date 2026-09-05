# Tasks — naas-fase2-robustez-perf

- [x] 2.1 `app/(app)/loading.tsx, error.tsx, not-found.tsx` (con `Link`, retry + regresar); el `Zod throw` de `BibleDataService` cae en `error.tsx` en vez de romper el feed.
- [x] 2.2 Quitar `clearProgress` de `navigateToChapter` (hecho en tanda routing+robustez); rango `>=0` validado en `useBibleChat`.
- [x] 2.3 Feed con `content-visibility:auto` (`globals.css .chat-feed > *`) + botón flotante ir-abajo (`useScrollOnUpdate` expone `isFarFromBottom/scrollToBottom`, `data-testid="scroll-down"`).
- [x] 2.4 Icons PWA redimensionados a su tamaño real + strip (192: 426K→36K; 512: 426K→264K, parcial por gradientes); preload `pop.mp3` en `layout`; `tsconfig` strict (hecho en Fase 1); `data-testid="chat-feed"` como patrón testid (migración total de `getByText` queda pendiente).
- [x] 2.5 `pnpm lint test` (35/35) + e2e 6/6 + `pnpm build` verde. Lighthouse manual pendiente.
