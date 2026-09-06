# naas-qa-auditoria-corpus

## Why

El catálogo ya tiene **24 libros ingestados** (≈700 capítulos, 25.306 mensajes) integrados a lo largo
de varias sesiones, con reglas heurísticas que evolucionaron entre libros (gap templado en `findCuts`,
VSO, carryover de voz, degradado pronominal). Esa evolución deja deuda conocida y no medida:

1. El `triage-doctrinal-pendiente.md` documenta clusters doctrinales (Salmos, NT relator) pero el
   barrido que lo generó vive en `/tmp` y no es reproducible.
2. Falsos positivos de carryover confirmados en Ester (`banquete`/`judíos`/`correos`/`facultad`
   activan el detector de imperativos) probablemente afectan a libros anteriores que se integraron
   con versiones más antiguas de la heurística.
3. No existe una verificación mecánica de integridad: texto preservado vs fuente SpaRVG, voces del
   corpus dentro del vocabulario de `books.ts` / `CanonicalSpeaker`, capítulos completos vs
   `availableChapters`, ids únicos.
4. `reviewed/` tiene huecos (Salmos 84/150, Job 33/42, 1 Reyes 19/22, 1 Crónicas 15/29…): no se sabe
   cuántos ambiguos quedan sin adjudicar en los capítulos ya publicados.

Se votó: **auditar antes de seguir integrando libros**. Primero medir con un barrido reproducible,
luego corregir por lotes con la doctrina vigente (el review manda sobre el dry-run), sin decisiones
a ciegas.

## What Changes

- `scripts/attribute-speakers/qa-sweep.mjs`: barrido reproducible por libro/capítulo que reporta
  - **Integridad**: schema de mensajes (id único, verse, speaker, text), capítulos publicados vs
    `availableChapters`, texto reconstruido por verso == fuente gateway SpaRVG (whitespace-normalizado).
  - **Vocabulario**: todo speaker del corpus ∈ `participants.json` del libro ∧ ∈ `books.ts`
    (participants) ∧ ∈ `CanonicalSpeaker` (`src/core/domain/Message.ts`).
  - **Deuda de review**: ambiguos del dry-run actual sin entrada en `reviewed/` ni speaker revisado.
  - **Divergencias heurística↔aplicado**: cada mensaje cuyo speaker difiere del dry-run se clasifica
    como revisado-intencional (hay entrada `reviewed/` que lo respalda) o sospechoso (no hay
    respaldo; candidato a bug de carryover/split).
- Reporte snapshot versionado en este change (`qa-report.md`) + salida stdout máquina-readable
  (`--json`) para re-corridas.
- Correcciones por lotes derivadas del reporte, cada una con commit propio y verificación
  (`mismatches: 0`, suite de speakers `node --test`, `pnpm lint`, `NODE_ENV=test pnpm test`).

## Impact

- Affected specs: `speakers`, `ingestion`
- Affected code: `scripts/attribute-speakers/qa-sweep.mjs` (nuevo), `public/data/**` (solo si
  correcciones), `scripts/attribute-speakers/reviewed/**` (nuevas adjudicaciones),
  `src/constants/books.ts` (solo si vocabulario diverge)
- Out of scope: re-ingestar libros completos desde cero, cambiar doctrina vigente (relator conserva
  voz; salmista = Narrador; Moisés 1ª persona divina), nuevos libros bloqueados.
