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
- [ ] 3.2 Backfill de `reviewed/` donde la doctrina vigente respalda el aplicado (cubeta a2):
      job (ciclos de discurso), exodus (1ª persona divina del tabernáculo + Moisés). Volcar
      aplicado→`reviewed/<libro>-<cap>.json` (confidence 0.85), `--apply --write`, 2ª pasada
      0 fusionados, commit `feat(corpus): backfill reviewed <libro>`.
- [ ] 3.3 Huecos de deuda `ambiguo-sin-revisar` en capítulos publicados (1.436 total; prioridad
      numeros 253, job 240, exodus 225, genesis 126, juan 123, lucas 100): adjudicar con el
      método del triage fase3 y re-corrida del barrido.

## 4. Clusters doctrinales (cubeta b) — decisión explícita antes de tocar
- [ ] 4.1 Salmos: salmista-Narrador vs oráculo divino genuino (salmos 18, 50, 60, 99, 110 del
      triage fase3) — decidir por salmo y registrar la doctrina resultante en la spec `speakers`.
- [ ] 4.2 Evangelios (283 sospechosos): doctrina del relator conserva voz — empezar por `juan 9`
      (bug real sospechado), luego mateo 15/26, lucas 9, marcos 14, juan 18.
- [ ] 4.3 AT carryover divino posterior a la integración: numeros (248), genesis (78), josue (35),
      jueces (18), deuteronomio (15), salmos (25): volcado aplicado vs dry por capítulo,
      adjudicar, `reviewed/` + `--apply --write`.
- [ ] 4.4 Casos nuevos que arrojen re-corridas: listar aquí con decisión tomada.

## 5. Cierre
- [ ] 5.1 Re-corrida del barrido: 0 duros (mantener), sospechosos y deuda medidos y cada cluster
      aceptado (documentado aquí) o corregido.
- [ ] 5.2 `node --test scripts/attribute-speakers/run.test.mjs` + `pnpm lint` +
      `NODE_ENV=test pnpm test` verde; commits por lote según el patrón del repo.
- [ ] 5.3 Actualizar `triage-doctrinal-pendiente.md` (change fase3) enlazando a este barrido y
      marcando lo resuelto.
