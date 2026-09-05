# Spec: speakers — Fase 3 (híbrido)

## ADDED Requirements

### Requirement: Heurística determinista primero
`run.mjs` SHALL aplicar en orden: (1) `headings` Platense → `Sistema isSectionTitle`; (2) split
`"Y X dijo:"` → `Narrador` + cita; (3) regex speaker `dijo|respondió|llamó|habló + (Jehová Dios|Dios|serpiente|mujer|Moisés|Faraón|...)`;
(4) 1ª persona entre comillas → último speaker citado. Cada mensaje SHALL llevar `{speaker, confidence, rule}` interno;
si `confidence < 0.8` o speaker fuera de `participants.json`, SHALL marcar `ambiguous:true`.

#### Scenario: SNG usa headings como speaker
- GIVEN `SpaPlatense SNG 1:1 headings ["...","Esposa"]`
- THEN `speaker === 'Esposa'` con `rule === 'heading'`, `confidence >= 0.9`.

### Requirement: LLM solo ambiguos
`llm-review.mjs` SHALL llamarse solo para versículos `ambiguous`, con input
`{book, chapter, verses[{number,text,headings}], participants}` y output JSON estricto
`[{verse, subId, speaker, confidence}]` validado con Zod. SHALL cachear por `sha1(capítulo)` y
reintentar máx 2 veces. `confidence >= 0.9` auto-merge; resto a cola manual (`review-queue.json`).

### Requirement: Vocabulario cerrado por libro
`participants.json` SHALL listar speakers válidos por libro (de `books.ts` + alias:
`Jehová Dios→Dios`, `la serpiente→Serpiente`, `la mujer→Eva/Mujer` según libro). Speaker fuera de lista SHALL ser `ambiguous`.
