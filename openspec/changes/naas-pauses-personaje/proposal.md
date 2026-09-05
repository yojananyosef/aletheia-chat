# naas-pauses-personaje

## Why

Hoy solo pausan Humanos + Títulos (`useBibleChat.ts:81` `canAdvanceManually = isHuman() || isTitle()`).
`Dios` va en auto-avance como `Narrador`, así que los parlamentos divinos pasan sin interacción
y se pierde el efecto drama/chat. Pedido: **pausa cuando hable algún personaje, no solo en títulos**.

Decisión votada: **Todo no-Narrador pausa** (Narrador auto, Dios + Humanos + Títulos con tap).

## What Changes

- `Message` expone `requiresManualAdvance()` / `isNarratorFlow()`: solo `Narrador` (no-título) fluye en auto.
- `useBibleChat`: `canAdvanceManually = nextMessage.requiresManualAdvance()`; `needsManualStart` usa la misma regla.
- `InputBar`: rama preview+Send cubre Dios + cualquier personaje (hoy solo `isNextUser` humano/título); rama "X ESCRIBIENDO..." queda solo para Narrador.
- `ChatView`: `TypingIndicator` se muestra para todo no-Narrador pendiente (`!isNarratorFlow`), no solo `isHuman()`.
- `onMessageNext`: sigue sonando `pop` para todo salvo `title` + `Narrador`.

## Impact

- Affected specs: `playback`
- Affected code: `src/core/domain/Message.ts`, `src/hooks/useBibleChat.ts`, `src/components/chat/InputBar.tsx`, `src/views/ChatView.tsx`, tests `useBibleChat.test.ts`, e2e `chat.spec.ts`
- Out of scope: coalescing de ráfagas del mismo speaker (se documenta como follow-up, no se implementa: cada mensaje Dios pausa aunque repita speaker).
