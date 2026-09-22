# Tasks — naas-qa-auditoria-corpus

## 1. Tooling de barrido
- [x] 1.1 `scripts/attribute-speakers/qa-sweep.mjs`: integridad (schema, ids, capítulos vs
      `availableChapters`, texto vs gateway con tolerancia capNarr/«»/puntuación) + vocabulario
      (corpus ⊆ participants.json ∧ books.ts ∧ CanonicalSpeaker, `Sistema` exento) + deuda de
      review + divergencias dry↔aplicado clasificadas.
- [x] 1.2 Salida dual: tabla humana por stdout + `--json`; `--book <slug>` para barrido parcial;
      exit 1 solo en hallazgos duros.

## 2. Barrido inicial (solo medir, no corregir)
- [x] 2.1 Barrido completo de los 24 libros con datos (25.306 mensajes); snapshot en `qa-report.md`.
- [x] 2.2 Triaje en cubetas documentado en `qa-report.md`: (a) mecánicos → resueltos (5 voces de
      vocabulario), (a2) backfill doctrinal de `reviewed/` (job 734, exodus 278), (b) doctrinales
      verso a verso (numeros 253, genesis 126, evangelios 283…), deriva-fuente 135 aceptada.

## 3. Correcciones mecánicas (cubeta a)
- [x] 3.1 Vocabulario: `CanonicalSpeaker` += Asael/Asa/Reina (`Message.ts`); `books.ts` += Mujer
      (genesis), Hija de Herodías + Ancianos (mateo). Barrido en 0 vocabulario-invalido.
- [x] 3.2 Backfill de `reviewed/` donde la doctrina vigente respalda el aplicado (cubeta a2):
      job (990 entradas, 37 caps: ciclos de discurso + discursos del torbellino) y exodus (Éx 3,
      21-23, 26-30). Merge-safe sobre reviewed existente, `--apply --write`, 2ª pasada 0 fusionados,
      2ª pasada del barrido: job 734→0 sospechosos, exodus 376→120.
- [x] 3.3 Huecos de deuda `ambiguo-sin-revisar` en capítulos publicados: **RESUELTA (0 en 66/66,
      verificado 2026-09-22)** — los 1.388 del triage se adjudicaron vía 4.2/4.3 durante la
      ingesta NT; re-corrida con fuentes gateway (`ALETHEIA_GATEWAY`): 0 duros, 0 sospechosos,
      0 ambiguo-sin-revisar; 147 `deriva-fuente` (categoría aceptada: 124 sobrescritos de salmos
      + 23 solo-puntuación, incl. GEN 39:12 documentado). `run.test.mjs` 55/55. Además el sweep
      ahora avisa (`sinFuente`) cuando falta el gateway en vez de reportar ceros silenciosos.

## 4. Clusters doctrinales (cubeta b) — decisión explícita antes de tocar
- [x] 4.1 Salmos: salmista-Narrador vs oráculo divino genuino — **RESUELTA junto a 4.3**
      (ver entrada 4.1 doctrina de Salmos abajo); se marca done la entrada duplicada.
- [x] 4.2 Evangelios: doctrina del relator conserva voz — **COMPLETADO (2026-09-06)**, los 4
      evangelios con 0 sospechosos: juan 98→0 (81 fixes), mateo 51→0 (39), lucas 84→0 (57),
      marcos 39→0 (25: discursos 7/8/10/12/13/14, 13:4 Discípulos, 14:71 Pedro, 14:72b cita
      narrada→Narrador, 14:65b "Profetiza"=Sacerdotes; 14 documentaciones).
- [x] 4.3 AT carryover divino posterior a la integración: **COMPLETADO (0 sospechosos en los
      24 libros)** — numeros (248→0), genesis (118→0, 36 fixes), josue (48→0, 12), jueces
      (50→0, 11), deuteronomio (15→0), levitico (8→0), exodus (120→0, 62 fixes: Pascua,
      Faraón, oráculos), salmos (38→0, oráculos 50/60/82; salmista-Narrador), 2cronicas
      (26→0, 19 fixes), samuel/reyes/rut/jonas/nehemias (27→0).
- [x] 4.1 doctrina de Salmos (encabezados y doctrina propia): **RESUELTA junto a 4.3** —
      salmista-Narrador salvo oráculo genuino con marco explícito (50:16→17-23, 60:6→7-8);
      documentado en qa-report.
- [x] 4.4 Casos nuevos que arrojen re-corridas: **re-corrida 2026-09-22 (66 libros, 147
      deriva-fuente vs 135 aceptadas en qa-report) → 12 casos nuevos, todos ACEPTADOS sin
      cambios** (misma clase aceptada: puntuación/case en fronteras de corte, `capNarr`
      intencional; verificados verso a verso contra SpaRVG): ezequiel 8:12, 12:23, 20:49;
      isaias 39:8, 40:6; jeremias 4:10, 14:13, 15:2, 22:18; hechos 17:18, 26:1;
      hebreos 10:30. 0 duros, 0 sospechosos, 0 ambiguo-sin-revisar en la misma corrida.
- [x] 4.5 Deuda ambiguo-sin-revisar (414 → 0, 2026-09-06): 408 confirmaciones del estado
      publicado (aplicado == dry, muestras verificadas) + 6 subIds fantasma documentados con el
      verso entero; 0 conflictos. Método y detalle en qa-report.

## 5. Cierre
- [x] 5.1 Re-corrida del barrido: **0 duros · 0 sospechosos · 24/24 libros limpios** (2026-09-06,
      qa final rev 6655); deriva-fuente 135 aceptada y documentada (advertencia conocida).
- [x] 5.2 `run.test.mjs` speakers 31/31 + `pnpm lint` verde + `NODE_ENV=test pnpm test` 37/37;
      commits por lote (corpus + docs openspec) siguiendo el patrón del repo.
- [x] 5.3 `triage-doctrinal-pendiente.md` (fase3) actualizado: nota RESUELTO enlazando a
      `qa-report.md` del change `naas-qa-auditoria-corpus`.
