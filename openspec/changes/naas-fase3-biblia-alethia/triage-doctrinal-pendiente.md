# Triage doctrinal pendiente (post-carryover)

Generado 2026-09-06 tras el parche de carryover de voz (`ea960c7` + `cda93c5`).
El barrido dry-run-nuevo vs aplicado (`/tmp/opencode/sweep2.txt`, regenerar con
el heuristic actual antes de corregir) dejó estos clusters que NO son mecánicos:
requieren decisión de doctrina caso por caso. No aplicar a ciegas.

## 1. Salmos: ¿salmista-Narrador o discurso divino genuino?
Doctrina vigente: salmista = Narrador, Dios solo en citas genuinas.
Candidatos `dry=Dios → aplicado=Narrador`:
- `salmos 50:17,18,19,20,21,22,23` — "¿Por qué tomas mi pacto en tu boca?..."
  Parece discurso divino genuino (Dios habla en el salmo de Asaf) → probable fix a Dios.
- `salmos 110:2,3,4,5` — oráculo real ("Dijo Jehová a mi Señor..."). Decidir:
  ¿Narrador (salmista cita) o Dios (oráculo, como Jos 24:3-13)?
- `salmos 18:46a,47,48,49` — revisar en contexto (acción de gracias de David).
- `salmos 60:7,8,9,10` — "Dios ha dicho en su santuario..." → probable Dios.
- `salmos 99:9` — revisar en contexto.

## 2. NT: ¿relator o hablante? (doctrina del relator conserva voz)
Doctrina vigente: el relator conserva la voz en parábolas/citas; habla quien
mueve la boca en escena. Los conteos `dry=X → aplicado=Narrador`:
Jesús 255, Discípulos 41, Fariseos 30, Pedro 16, Felipe 15, Judíos 11,
Ángel 8, Pilato 5, Familiares 5, Doctor 5 (+ resto).
OJO: muchos aplicados-Narrador pueden estar BIEN (relator). Ejemplos vistos:
- `juan 9` (17 hits: 9:7a, 9:9c-12c, 9:16c-28a, 9:36a, 9:38a...) — discurso
  directo ("Y le dijo: Ve, lávate...") parece auténticamente Jesús/vecinos/
  fariseos hablando → sospecha de bug real, priorizar este capítulo.
- `mateo 15:6,7a,8,9` dry=Dios — ¡dry MAL aquí!: es Jesús citando a Isaías
  ("Hipócritas, bien profetizó...") → debe ser Jesús (relator), NO Dios.
- `mateo 26` (9), `mateo 15` (8), `lucas 9` (8), `marcos 14` (7), `juan 18` (7)...
Método: por capítulo, volcar aplicado vs dry, adjudicar con la doctrina del
relator, corregir vía `reviewed/<libro>-<cap>.json` + `--apply --write` +
verificación `mismatches: 0` + QA. Empezar por `juan 9`.

## 3. Nota de mecanismo
- `dry=Dios → aplicado=Moisés` en Deuteronomio (75) está BIEN (doctrina:
  Moisés habla en 1ª persona divina). El dry ahí se equivoca; manda el review.
- Marcos con cita hipotética/encadenada (tipo `exodo 7:9b` Faraón,
  `exodo 32:12b` Egipcios) se dejan como decidió el review previo salvo
  doctrina explícita en contra.
