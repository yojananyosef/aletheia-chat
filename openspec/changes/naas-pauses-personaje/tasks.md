# Tasks — naas-pauses-personaje

## 1. Dominio
- [x] 1.1 `Message`: añadir `isNarratorFlow()` (= `speaker==='Narrador' && !isTitle()`) y `requiresManualAdvance()` (= `!isNarratorFlow()`); mantener `isHuman()/isTitle()` sin romper callers.
- [x] 1.2 Unit test `Message.test.ts`: Narrador→false, Dios→true, Adán→true, Sistema+título→true.

## 2. Hook
- [x] 2.1 `useBibleChat.ts:81` → `canAdvanceManually = nextMessage.requiresManualAdvance()`; `needsManualStart` usa misma regla; rango progreso `>=0`; `clearTimeout` en cleanup.
- [x] 2.2 Actualizar `useBibleChat.test.ts`: Dios pausa (no auto-avanza), Narrador auto-avanza, título manual, resume intacto.

## 3. UI
- [x] 3.1 `InputBar`: rama `isNextUser` cubre Dios/personajes (preview + Send) vía `canAdvanceManually`; rama "ESCRIBIENDO" queda para Narrador en auto.
- [x] 3.2 `ChatView`: `TypingIndicator` solo Narrador; `onMessageNext` con `useCallback`; `key={book:chapter}` en `page.tsx`.
- [x] 3.3 e2e `chat.spec.ts`: caso Génesis 1 — Dios "Sea la luz" pide tap, no auto-avanza, Send lo revela (6/6 e2e verde).

## 4. QA
- [x] 4.1 `pnpm test` (30 pass) && `pnpm lint` (0 errors) && `pnpm build` verde (verificado 2026-09-05).
