# Tasks — naas-fase3-biblia-alethia

## 1. Scaffolding
- [x] 1.1 `scripts/attribute-speakers/{patterns.es.json,participants.json,run.mjs,llm-review.mjs,schema.json,README.md}` creados.
- [ ] 1.2 `participants.json` completo por libro (semilla génesis/éxodo + resto desde `books.ts`).

## 2. Heurística
- [x] 2.1 `run.mjs --book genesis --chapter 3 --source SpaRVG` parte discurso y asigna speaker; `--dry-run` imprime tabla verso→speaker→rule→confidence (GEN1 0 sayer-ambiguos, GEN3 4 ambiguos con defaults correctos).
- [x] 2.2 Fixtures `GEN 1, GEN 3, EXO 3` en `run.test.mjs`; `node --test scripts/attribute-speakers/run.test.mjs` 4/4 verde.
- [ ] 2.3 `--write` emite `public/data/<slug>/<cap>.json` válido `ChapterDataSchema` (pendiente: regenerar Génesis 1-3 + Éxodo 1-4 y validar e2e pausas Dios).

## 3. LLM review
- [ ] 3.1 `llm-review.mjs --only-ambiguous` con cache sha1 + Zod + `review-queue.json`.
- [ ] 3.2 Política: `>=0.9` auto-merge, resto manual.

## 4. Integración
- [ ] 4.1 `generateStaticParams` + `availableChapters` desde FS; `books.ts` como fallback.
- [ ] 4.2 Ingesta inicial Génesis 1-3 + Éxodo 1-4 regenerados desde SpaRVG con speakers nuevos (pausas Dios verificadas en e2e).
- [ ] 4.3 README aviso licencia SpaRVG/Platense + fallback RV1909.
- [ ] 4.4 `pnpm lint test build` verde.
