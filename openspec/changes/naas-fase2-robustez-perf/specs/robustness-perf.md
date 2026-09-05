# Spec: robustness+perf — Fase 2

## ADDED Requirements

### Requirement: Navegación conserva progreso
`navigateToChapter` SHALL NOT borrar progreso del destino. Solo `restartChapter` SHALL limpiar.
Al abrir un capítulo con progreso `0 <= i < messages.length`, el hook SHALL reanudar en `i`.

#### Scenario: salir y volver resume
- GIVEN Génesis 1 en índice 5 persistido
- WHEN ir a Home y volver a `/genesis/1`
- THEN `currentIndex === 5`.

### Requirement: Estados de ruta
`/[book]/[chapter]` inválido SHALL renderizar `not-found`; fallo Zod/red SHALL renderizar `error` con botón "Regresar"; carga SHALL mostrar `loading` (reusa "ABRIENDO CAPÍTULO...").

### Requirement: Feed escalable
Feed SHALL usar `content-visibility:auto; contain-intrinsic-size` por burbuja y botón "ir abajo"
cuando `scrollRef` esté a >600px del bottom. Icons PWA SHALL pesar <100K c/u o servirse como `webmanifest` optimizado.
