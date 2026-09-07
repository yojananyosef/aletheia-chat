# Tasks — naas-fase3-biblia-alethia

## 1. Scaffolding
- [x] 1.1 `scripts/attribute-speakers/{patterns.es.json,participants.json,run.mjs,llm-review.mjs,schema.json,README.md}` creados.
- [x] 1.2 `participants.json` completo 66 libros (+Marineros/Jonás); `CODE_BY_SLUG` 66 códigos gateway (exportado, reuse en `llm-review`); ids nuevos = código gateway en minúsculas (`g/e` históricos se conservan).

## 1b. Extensión validada (smoke)
- [x] 1b.1 Reglas Jesús/Pablo/Satán/Jonás/Marineros; tallo `diciendo`; aviso de discurso continuado (`verso termina en ':'`).
- [x] 1b.2 Test canon: JOB 1:7 Satán + JON 1:6 Marineros (`node --test` 5/5).
- [x] 1b.3 Ingeridos `rut` 1-4 (143 msgs), `jonas` 1-4 (68 msgs), `salmos` 1-150 (2664 msgs): `--dry-run` → `reviewed/` (8+80 ficheros) → `--apply --write` → `availableChapters` activos en `books.ts` (Rut/Jonás/Salmos desbloqueados).
- [x] 1b.4 Fixes de precisión descubiertos en la revisión: gap templado en `findCuts` (corte en dicendi más cercano al `:`), VSO-primero con destinatario `a/al`, exclusión pre-verbal `a|oh|en|contra|nombre de`, degradado pronominal (ella/él/yo/tú/ti/mí...), mención-sin-corte siempre a revisión, tallos `dic|dec|replic`, extracción de encabezado `«...»` a título Sistema, aviso de continuación extendido. Voces nuevas: Noemí, Nueras, Criado, Segadores, Pariente, Ancianos, Mujeres, Pueblo, Rey de Nínive, Impíos, Pueblos.
- [x] 1b.5 Génesis 4-50 (1453 versos, 2003 msgs): 27 reglas patriarcales + `llamó su nombre X` nunca hablante (VSO excluye `nombre`) + objeto `a` con artículo/posesivo + mensajeros plural. 293 ambiguos + silenciosos resueltos en `reviewed/genesis-*.json`; reporter conserva voz; teofanía = Dios. Génesis 1-50 desbloqueado (2126 msgs).
- [x] 1b.6 Deploy Vercel: `output: VERCEL ? undefined : standalone` (`next.config.js`) — Next 16.3 + standalone + adapter = ENOENT `next-server.js.nft.json` en onBuildComplete (upstream #96646). Verificado ambas rutas en limpio.

## 2. Heurística
- [x] 2.1 `run.mjs --book genesis --chapter 3 --source SpaRVG` parte discurso y asigna speaker; `--dry-run` imprime tabla verso→speaker→rule→confidence (GEN1 0 sayer-ambiguos, GEN3 4 ambiguos con defaults correctos).
- [x] 2.2 Fixtures `GEN 1, GEN 3, EXO 3` en `run.test.mjs`; `node --test scripts/attribute-speakers/run.test.mjs` 4/4 verde.
- [ ] 2.3 `--write` emite `public/data/<slug>/<cap>.json` válido `ChapterDataSchema` (pendiente: regenerar Génesis 1-3 + Éxodo 1-4 y validar e2e pausas Dios).

## 3. LLM review
- [x] 3.1 `llm-review.mjs` genera cola con cache sha1, valida vocabulario, fusiona con `--apply --write` sobre el JSON existente (conserva títulos/headings).
- [x] 3.2 25/25 ambiguos GEN1-3+EXO1-4 revisados en `reviewed/*.json` y fusionados (solo cambian los que el default erraba).

## 4. Integración
- [x] 4.1 (hecho en tanda routing, quedaba stale) `generateStaticParams` lee FS con fallback `BIBLE_BOOKS`; helper compartido en `src/core/services/catalogFs.ts`.
- [x] 4.2 Ingesta inicial Génesis 1-3 + Éxodo 1-4 regenerados desde SpaRVG con speakers nuevos (pausas Dios verificadas en e2e).
- [x] 4.3 Aviso de licencias SpaRVG/Platense + fallback RV1909 en README (sección «Fuentes bíblicas y licencias»).
- [x] 4.4 `pnpm lint test build` + e2e 6/6 verde.
