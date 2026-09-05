# Tasks — naas-fase0-correctness-a11y

## 1. Correctness
- [x] 1.1 `app/(app)/[book]/[chapter]/page.tsx`: `key={`${book}:${chapterNumber}`}` en `<ChatView>` (remount; bloque render-time queda como fallback documentado para tests).
- [x] 1.2 `ChatView`: `onMessageNext` con `useCallback([playPop])`; auto-avance con `timeoutId + clearTimeout`, sin `setState` tras unmount.
- [ ] 1.3 `UIStateContext`: `value` con `useMemo`; `PersistentStateContext.subscribe`: refcount + `typeof window` guard.
- [ ] 1.4 Tests: navegación entre capítulos no mezcla; re-render no reinicia timer (fake timers).

## 2. A11y
- [x] 2.1 `app/layout.tsx`: quitar `maximumScale/userScalable`.
- [x] 2.2 `Surface.tsx`: `role=button tabIndex=0 onKeyDown` + `aria-pressed` + foco visible (doble-Enter = like).
- [x] 2.3 `HomeView.tsx:200-208`: `disabled + aria-disabled + tabIndex=-1` en nav futuro.
- [x] 2.4 Drawers (`Favorites/GroupInfo`): `Escape` (hook `useDismissOnEscape`), `role=dialog aria-modal`, foco inicial. `OptionsMenu` queda pendiente.
- [x] 2.5 `MessageBubble`: burbujas Narrador/Serpiente/Dios con rol/teclado + `aria-label` con estado de like (alternativa a doble-tap).
- [x] 2.6 `pnpm lint && pnpm test` (30/30) + e2e 6/6 + `pnpm build` verde. Chequeo manual lector pendiente.
