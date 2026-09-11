# Spec: ingestion — Fase 3 (SpaRVG + Platense)

## ADDED Requirements

### Requirement: Fuente y mapeo
Pipeline SHALL leer `/home/Johan/orca/aletheia-gateway/public/data/bibles/SpaRVG/*.json` (primario)
y `SpaPlatense/*.json` (deuterocanónicos + `headings` semilla). SHALL mapear códigos
`GEN→genesis, EXO→exodus...` vía `BibleBooks.ts` gateway y emitir `public/data/<slug>/<cap>.json`.

### Requirement: Formato NAAS preservado
Cada salida SHALL ser `{book, chapter, title, messages:[{id, speaker, verse, text, isSectionTitle?}]}`,
donde `title` = primer `headings[0]` Platense o `bookName cap N`, e `id` = `{slugAbbr}{cap}_{verse}[a-z]`.
`ChapterDataSchema.parse` SHALL pasar; si falla, el capítulo SHALL excluirse del build con warning (no romper `pnpm build`).

#### Scenario: GEN 3 conserva discurso partido
- GIVEN `SpaRVG GEN 3:1 "Pero la serpiente era astuta... la cual dijo a la mujer: ¿Conque...?"`
- THEN emite `e3_1a Narrador` + `e3_1b Serpiente` (o `Mujer` según regla), no un solo bloque.

### Requirement: generateStaticParams desde FS
`app/(app)/[book]/[chapter]/page.tsx` SHALL generar params listando `public/data/*/*.json`,
no desde `BIBLE_BOOKS` hardcodeado. `BIBLE_BOOKS.availableChapters` SHALL derivarse del mismo listado en build/test.
