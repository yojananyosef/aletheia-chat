# Spec: correctness — Fase 0

## ADDED Requirements

### Requirement: Reset de capítulo sin setState en render
El sistema SHALL resetear `data/currentIndex/isAdvancing/error` al cambiar `book:chapter` vía
`key` en el server component o `useEffect`, NUNCA con `setState` durante render.

#### Scenario: navegar Génesis 1 → 2 no mezcla mensajes
- GIVEN chat en Génesis 1 con 10 mensajes visibles
- WHEN `router.push('/genesis/2')`
- THEN feed muestra loader "ABRIENDO CAPÍTULO...", luego mensajes de Génesis 2 desde inicio/resume, sin flash del capítulo anterior.

### Requirement: Callbacks estables no reinician timers
`onMessageUpdate` SHALL ser estable (`useCallback`) y el efecto auto-avance SHALL limpiar su
`setTimeout` con `clearTimeout` en cleanup. No SHALL llamar `setState` tras unmount.

#### Scenario: render extra no alarga delay
- GIVEN Narrador visible, próximo Narrador con delay 3s
- WHEN re-render por like o toggle mute a los 2s
- THEN el mensaje aparece ~1s después (no se reinicia a 3s).
