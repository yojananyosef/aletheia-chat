# Spec: playback — pausas por personaje

## ADDED Requirements

### Requirement: Pausa todo no-Narrador
El sistema SHALL requerir avance manual (`canAdvanceManually=true`) cuando `nextMessage` sea Título (`isSectionTitle`), `Dios`, o cualquier speaker humano/personaje (`Moisés`, `Serpiente`, `Eva`, `Faraón`, ...). Solo `Narrador` no-título SHALL auto-avanzar.

#### Scenario: Dios pausa
- GIVEN capítulo con secuencia `Narrador → Dios`
- WHEN el Narrador ya es visible y `nextMessage.speaker === 'Dios'`
- THEN `canAdvanceManually === true`, no corre timer de auto-avance, `InputBar` muestra preview + botón Send con `aria-label "Enviar mensaje de Dios"`.

#### Scenario: Narrador fluye en auto
- GIVEN `nextMessage.speaker === 'Narrador'` y no es título
- WHEN `isActive=true`
- THEN corre auto-avance con delay `readingTime/typingTime` existente y `TypingIndicator` NO se muestra (o muestra "Narrador ESCRIBIENDO..." solo como estado transitorio, sin requerir tap).

#### Scenario: Título siempre manual
- GIVEN `nextMessage.isSectionTitle === true`
- THEN `canAdvanceManually === true` aunque `speaker === 'Sistema'`.

#### Scenario: Primer mensaje Dios/personaje arranca en -1
- GIVEN `messages[0].requiresManualAdvance() === true`
- WHEN termina `loadChapterService`
- THEN `currentIndex === -1` (espera tap), igual que hoy para títulos/humanos.

### Requirement: Indicador de escritura para personajes
`ChatView` SHALL renderizar `TypingIndicator` cuando `nextMessage && isAdvancing && nextMessage.requiresManualAdvance()` sea falso... precisely: cuando el próximo es Narrador en auto; Y cuando el próximo es personaje en pausa, `InputBar` SHALL mostrar preview (no spinner infinito). El spinner "X ESCRIBIENDO..." queda reservado a Narrador en tránsito.

#### Scenario: Typing solo Narrador
- GIVEN `nextMessage.speaker === 'Dios'`
- THEN no hay auto `isAdvancing`; `InputBar` muestra tarjeta Dios + Send.
