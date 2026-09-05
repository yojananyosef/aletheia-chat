# Spec: accessibility — Fase 0

## ADDED Requirements

### Requirement: Zoom permitido
`viewport` SHALL NOT incluir `maximumScale:1` ni `userScalable:false`.

### Requirement: Superficies clicables operables por teclado
Todo `onClick` SHALL estar en `button/a` nativo o exponer `role="button" tabIndex={0} onKeyDown(Enter/Espacio)`.

#### Scenario: lector de pantalla en burbuja título
- WHEN foco en título de sección
- THEN se anuncia como botón con su texto.

### Requirement: Controles futuros no focuseables
Botones `COMMUNITY/SCRIPTORIUM` SHALL tener `disabled aria-disabled="true" tabIndex={-1}` hasta implementarse.

### Requirement: Modales cerrables y modales
Drawers SHALL cerrar con `Escape`, tener `role="dialog" aria-modal="true" aria-label`, y mover foco al abrir/cerrar.
Doble-tap like SHALL tener botón alternativo visible por teclado (`aria-pressed`).
