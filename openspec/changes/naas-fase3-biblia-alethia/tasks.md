# Tasks — naas-fase3-biblia-alethia

## 1. Scaffolding
- [x] 1.1 `scripts/attribute-speakers/{patterns.es.json,participants.json,run.mjs,llm-review.mjs,schema.json,README.md}` creados.
- [x] 1.2 `participants.json` génesis/éxodo completo (Dios, Serpiente, Mujer, Adán, Moisés, Faraón, Reuel, Séfora, Parteras, Hija de Faraón, Hermana, Hijas, Hebreo). Resto de libros pendiente.

## 2. Heurística
- [x] 2.1 `run.mjs --book genesis --chapter 3 --source SpaRVG` parte discurso y asigna speaker; `--dry-run` imprime tabla verso→speaker→rule→confidence (GEN1 0 sayer-ambiguos, GEN3 4 ambiguos con defaults correctos).
- [x] 2.2 Fixtures `GEN 1, GEN 3, EXO 3` en `run.test.mjs`; `node --test scripts/attribute-speakers/run.test.mjs` 4/4 verde.
- [ ] 2.3 `--write` emite `public/data/<slug>/<cap>.json` válido `ChapterDataSchema` (pendiente: regenerar Génesis 1-3 + Éxodo 1-4 y validar e2e pausas Dios).

## 3. LLM review
- [x] 3.1 `llm-review.mjs` genera cola con cache sha1, valida vocabulario, fusiona con `--apply --write` sobre el JSON existente (conserva títulos/headings).
- [x] 3.2 25/25 ambiguos GEN1-3+EXO1-4 revisados en `reviewed/*.json` y fusionados (solo cambian los que el default erraba).

## 4. Integración
- [ ] 4.1 `generateStaticParams` + `availableChapters` desde FS; `books.ts` como fallback.
- [x] 4.2 Ingesta inicial Génesis 1-3 + Éxodo 1-4 regenerados desde SpaRVG con speakers nuevos (pausas Dios verificadas en e2e).
- [ ] 4.3 README aviso licencia SpaRVG/Platense + fallback RV1909.
- [x] 4.4 `pnpm lint test build` + e2e 6/6 verde.
