# Tasks — naas-fase0-correctness-a11y

## 1. Correctness
- [x] 1.1 `app/(app)/[book]/[chapter]/page.tsx`: `key={`${book}:${chapterNumber}`}` en `<ChatView>` (remount; bloque render-time queda como fallback documentado para tests).
- [x] 1.2 `ChatView`: `onMessageNext` con `useCallback([playPop])`; auto-avance con `timeoutId + clearTimeout`, sin `setState` tras unmount.
- [ ] 1.3 `UIStateContext`: `value` con `useMemo`; `PersistentStateContext.subscribe`: refcount + `typeof window` guard.
- [ ] 1.4 Tests: navegación entre capítulos no mezcla; re-render no reinicia timer (fake timers).

## 2. A11y
- [x] 2.1 `app/layout.tsx`: quitar `maximumScale/userScalable`.
- [ ] 2.2 `Surface.tsx`: convertir a `button` (mantener estilos `data-aida/data-cta`) o añadir rol/teclado.
- [ ] 2.3 `HomeView.tsx:200-208`: `disabled` real en nav futuro.
- [ ] 2.4 Drawers (`Favorites/GroupInfo`) + `OptionsMenu`: `Escape`, `role=dialog`, foco.
- [ ] 2.5 `MessageBubble`: botón like explícito además de doble-tap.
- [ ] 2.6 `pnpm lint && pnpm test && pnpm build` + chequeo manual teclado/lector.
