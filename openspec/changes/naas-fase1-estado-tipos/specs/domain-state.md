# Spec: domain+state — Fase 1

## ADDED Requirements

### Requirement: Single source de tipos
`src/types/bible.ts` SHALL re-exportar desde `src/core/domain/*`. No SHALL existir dos interfaces
`BookInfo`/`FavoriteMessage` con mismo shape y distinto nombre.

### Requirement: Búsqueda insensible a tildes
Filtro de libros SHALL usar `trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')`
sobre nombre + categoría. `useBookFilter` SHALL ser controlado (recibe `query`, no guarda copia desincronizada).

#### Scenario: buscar "genesis" encuentra "Génesis"
- WHEN `query === 'genesis'`
- THEN `Génesis` está en resultados.

### Requirement: Toggle favoritos único
Un solo `handleToggleLike(id, bookId)` SHALL añadir si falta y borrar si existe, usado por Home, Chat y Drawer con la misma firma.
