# performance

## MODIFIED

### Requirement: Auto-scroll del chat no invasivo
El scroll al aparecer un mensaje DEBE ejecutarse en `requestAnimationFrame`, con `behavior: smooth`, y SOLO si el usuario está cerca del bottom (<160px). Si el usuario subió a re-leer, el scroll NO DEBE secuestrarse.

#### Scenario: Usuario leyendo al final
- **WHEN** llega un mensaje nuevo estando cerca del bottom
- **THEN** el contenedor hace scroll suave al final en el siguiente frame

#### Scenario: Usuario re-leyendo arriba
- **WHEN** llega un mensaje nuevo con el usuario lejos del bottom
- **THEN** la posición de scroll no cambia
