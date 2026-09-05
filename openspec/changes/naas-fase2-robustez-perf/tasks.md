# Tasks — naas-fase2-robustez-perf

- [ ] 2.1 `loading/error/not-found` + `ErrorBoundary` capítulo; test Zod inválido → error UI, no crash.
- [ ] 2.2 Quitar `clearProgress` de `navigateToChapter`; validar rango en `useBibleChat` (`savedProgress < length` ya existe, añadir `>=0` + clamp).
- [ ] 2.3 Feed `content-visibility` + botón ir-abajo (extender `useScrollOnUpdate` para exponer `isFarFromBottom`).
- [ ] 2.4 Optimizar icons + preload audio; `tsconfig` strict; e2e `testId`.
- [ ] 2.5 `pnpm lint test build` + Lighthouse humo.
