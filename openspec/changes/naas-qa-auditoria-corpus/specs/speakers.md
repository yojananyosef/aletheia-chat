# Spec: speakers — auditoría de corpus

## ADDED Requirements

### Requirement: Barrido QA reproducible
`qa-sweep.mjs` SHALL recorrer todo `public/data/**` con datos y verificar por capítulo:
(a) cada mensaje tiene `id` único, `verse` numérico, `speaker` no vacío y `text` no vacío;
(b) los capítulos publicados coinciden con `availableChapters` de `books.ts`;
(c) el texto de los mensajes de cada verso (excluidos títulos) reconstruye el texto de la fuente
gateway SpaRVG normalizando whitespace, la capitalización inicial (`capNarr`) y los «» extraídos a
títulos; diferencias solo de puntuación o corpus-superset SHALL reportarse como `deriva-fuente`
(advertencia) y no como pérdida;
(d) todo `speaker` pertenece al vocabulario del libro (`participants.json` ∧ `participants` de
`books.ts`) y a `CanonicalSpeaker` de `src/core/domain/Message.ts`, con `Sistema` exento (voz de
infraestructura de títulos, no participante de chat).
El barrido SHALL poder repetirse en cualquier momento con el mismo resultado si no cambian datos ni
heurística (determinista, sin red).

#### Scenario: corpus con voz fuera de vocabulario
- GIVEN `public/data/rut/1.json` con un mensaje `speaker: "Booz "` (espacio final)
- THEN el barrido lo reporta como vocabulario-invalido y la corrida termina no-cero.

#### Scenario: texto deg lost en generación
- GIVEN un capítulo cuyo verso 5 tiene en el corpus solo la mitad del texto fuente
- THEN el barrido reporta texto-perdido para ese verso con la longitud faltante.

### Requirement: Divergencia dry↔aplicado siempre clasificada
Para cada mensaje cuyo `speaker` aplicado difiere del que la heurística actual produce, el barrido
SHALL clasificarlo como `revisado` (existe entrada en `reviewed/<libro>-<cap>.json` con ese
`verse`+`subId` y ese speaker) o `sospechoso` (sin respaldo). Los `sospechoso` SHALL listarse con
libro, capítulo, verso, subId, speaker aplicado y speaker del dry-run.

#### Scenario: override intencional
- GIVEN `reviewed/ester-3.json` con `{verse:11, subId:"b", speaker:"Asuero"}` y aplicado `Asuero`
  mientras el dry-run produce `Dios`
- THEN se cuenta como `revisado`, no como `sospechoso`.
