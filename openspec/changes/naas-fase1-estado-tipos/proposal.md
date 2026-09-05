# naas-fase1-estado-tipos

## Why

Duplicación y estado inconsistente: `BookInfo` idéntico en `domain/BookInfo.ts` vs `types/bible.ts`,
`FavoriteMessage` vs `FavoriteMessageData`, `Speaker = union | string` que anula el union,
`InputBar` espera `Message` plano pero recibe clase (`isSectionTitle` prop vs `isTitle()` método),
`handleToggleLike` partida Home (solo borra) vs Chat (toggle), clave favoritos duplicada,
`useBookFilter` desincronizado de `homeSearchQuery` global y sin `normalize` (genesis ≠ génesis),
`useSpiritualLevel` mal llamado hook, `READING_SPEEDS` con `val==multiplier` y semántica invertida.

## What Changes

- Single source: `BookInfo/FavoriteMessage/Speaker` en `core/domain`, `types/bible` re-exporta.
  `Speaker` cerrado + `OtherSpeaker string` documentado, no `| string` libre.
- API `Message` única: métodos `isTitle()/isNarratorFlow()/requiresManualAdvance()`; `InputBar` usa clase.
- `handleToggleLike(id, bookId)` única en hook `useFavoritesToggle`.
- `useBookFilter(query)` controlado: `trim().toLowerCase().normalize('NFD').replace(diacríticos)`, sin estado interno duplicado.
- `getSpiritualLevel(count)` función pura (renombrar, mantener alias hook deprecated).
- `READING_SPEEDS`: `{label, multiplier}` + comentario "mayor = más lento".

## Impact

- Affected specs: `domain`, `state`
- Affected code: `src/core/domain/*`, `src/types/bible.ts`, `src/components/**`, `src/hooks/useBookFilter.ts`, `useSpiritualLevel.ts`, `src/constants/books.ts`
