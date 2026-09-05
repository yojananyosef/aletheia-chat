# naas-fase3-biblia-alethia

## Why

`bible-app-naas` solo tiene 7 capítulos artesanales (`public/data/genesis|exodus/*.json`).
`alethia-gateway/public/data/bibles/` es superset verificado (139M, ~1350 JSON, 22 versiones) frente a
`alethia-reader` (64M). Ninguna trae `speaker/actor` (`verse.keys = number,text[,headings,footnotes]`),
así que hay que construir la capa speaker. Votado: fuente **SpaRVG (66/1189, español moderno)** +
**SpaPlatense (73/1334, deuterocanónicos + headings/notas)**, atribución **híbrida**
(heurística determinista + LLM solo ambiguos).

## What Changes

- Pipeline `scripts/attribute-speakers/`: staging desde gateway → split versículo con discurso
  (replica segmentación `g1_3a Narrador "Y Dios dijo:" + g1_3b Dios "¡Que haya luz!"`) → speaker por
  regex + headings + participantes → marca `ambiguous` si confianza <0.8 → `llm-review` solo ambiguos
  (JSON estricto, Zod, cache sha1) → emite `public/data/[libro]/[cap].json` formato NAAS.
- `participants.json` derivado de `books.ts` + concordancia gateway; `patterns.es.json` versionado.
- Salida validada con `ChapterDataSchema` + nuevo `SpeakerSchema`; `generateStaticParams` desde FS real.
- Aviso legal en README: SpaRVG/Platense revisar licencia antes de redistribuir; RV1909 como fallback DP.

## Impact

- Affected specs: `ingestion`, `speakers`
- Affected code: `scripts/attribute-speakers/*`, `public/data/**` (generado), `src/constants/books.ts`
  (`availableChapters` desde FS), `src/core/validation/bibleSchemas.ts`, docs
- Out of scope: traducir más versiones, TTS por personaje.
