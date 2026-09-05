# attribute-speakers — ingesta híbrida Gateway → NAAS

Fuente: `/home/j/proyectos/alethia-gateway/public/data/bibles/{SpaRVG,SpaPlatense}/*.json`
(`verse = {number, text[, headings, footnotes]}` — sin speaker).
Salida: `public/data/<slug>/<cap>.json` formato NAAS (`{book, chapter, title, messages[]}`).

## Paso 1 — heurística (sin red)

```bash
node scripts/attribute-speakers/run.mjs --book genesis --chapter 3 --source SpaRVG --dry-run
node scripts/attribute-speakers/run.mjs --book genesis --chapter 3 --source SpaRVG --platense-headings --write
```

Reglas (`patterns.es.json`, orden): `heading → split "dijo:" → speaker regex → fallback Narrador`.
`participants.json` es vocabulario cerrado; fuera de lista o `confidence<0.8` ⇒ `ambiguous:true`.

## Paso 2 — LLM solo ambiguos (offline/manual, cache sha1)

```bash
node scripts/attribute-speakers/llm-review.mjs --book genesis --chapter 3 --source SpaRVG > /tmp/review.json
# completar con LLM/manual → reviewed.json [{verse, subId, speaker, confidence}]
node scripts/attribute-speakers/llm-review.mjs --book genesis --chapter 3 --apply reviewed.json --write
```

Política: `confidence>=0.9` auto-merge, resto a `review-queue.json` manual.

## Licencias

SpaRVG/Platense: revisar antes de redistribuir. Fallback dominio público: `RV1909`
(`--source RV1909` funciona igual, mismo formato gateway).
