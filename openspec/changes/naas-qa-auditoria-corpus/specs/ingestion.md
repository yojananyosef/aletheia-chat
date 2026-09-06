# Spec: ingestion — auditoría de integridad

## ADDED Requirements

### Requirement: Integridad verificable del corpus publicado
El corpus publicado (`public/data/<libro>/<cap>.json`) SHALL poder auditarse mecánicamente contra
su fuente: cada verso del gateway SHALL estar representado (salvo encabezados extraídos a títulos
Sistema) y la concatenación de sus mensajes SHALL preservar el texto fuente. El barrido
`qa-sweep.mjs` SHALL ser la herramienta de auditoría y SHALL ejecutarse antes de cada release de
libros nuevos o correcciones por lotes.

#### Scenario: capítulo anunciado pero ausente
- GIVEN `books.ts` anuncia Ester capítulo 7 y no existe `public/data/ester/7.json`
- THEN el barrido reporta capitulo-faltante y termina no-cero.
