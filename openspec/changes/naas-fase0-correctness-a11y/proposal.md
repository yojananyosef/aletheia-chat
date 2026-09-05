# naas-fase0-correctness-a11y

## Why

Deuda P0 verificada: `setState` durante render (`useBibleChat.ts:29-37`), `onMessageNext` inline que
reinicia timers cada render (`ChatView.tsx:49-51` → deps `useBibleChat.ts:125`), timers sin `clearTimeout`,
`UIStateContext` sin `useMemo`, listener `storage` por suscriptor sin refcount ni guard SSR,
`maximumScale:1/userScalable:false` que bloquea zoom (`app/layout.tsx:30-36`), `Surface` como `div`
clicable sin teclado, botones futuros focuseables, modales sin `Escape/focus`.

## What Changes

- Correctness: `key={book:chapter}` en página chat (o `useEffect` reset) para eliminar setState-en-render;
  `onMessageNext` con `useCallback`; auto-avance con `clearTimeout` + `AbortController`-like; `useMemo`
  en `UIStateContext`; `subscribe` con refcount + guard SSR.
- A11y: quitar bloqueo zoom; `Surface` → `button` real (o `role/tabIndex/onKeyDown`); botones
  `COMMUNITY/SCRIPTORIUM` con `disabled + aria-disabled`; drawers con `Escape`, `aria-modal`, foco inicial;
  doble-tap like con alternativa botón teclado.

## Impact

- Affected specs: `correctness`, `accessibility`
- Affected code: `app/layout.tsx`, `app/(app)/[book]/[chapter]/page.tsx`, `src/hooks/useBibleChat.ts`,
  `src/views/ChatView.tsx`, `src/context/*`, `src/components/ui/Surface.tsx`, drawers, `HomeView.tsx`
- Out of scope: rediseño visual, nuevos features.
