# accessibility

## MODIFIED

### Requirement: Selección de texto en contenido
El `body` NO DEBE tener `select-none` global; el bloqueo de selección DEBE quedar scoped al chrome de UI (headers, nav, menús, botones), dejando las burbujas de versículos seleccionables/copiables.

#### Scenario: Copiar un versículo
- **WHEN** el usuario selecciona el texto de una burbuja de mensaje
- **THEN** la selección funciona

## ADDED

### Requirement: Botones de solo icono con nombre accesible
Todo botón que solo contenga un icono DEBE tener `aria-label` descriptivo.
