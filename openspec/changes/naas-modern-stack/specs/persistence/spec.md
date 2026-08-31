# persistence

## ADDED

### Requirement: StorageService como única puerta a localStorage
Todo acceso a `localStorage` DEBE pasar por `src/core/services/StorageService.ts` con claves versionadas `naas:v1:*`, validación Zod (`safeParse`) y `try/catch`. En SSR DEBE ser no-op devolviendo defaults.

#### Scenario: Roundtrip de favoritos
- **WHEN** se guardan favoritos y se releeen
- **THEN** se recuperan idénticos y validados contra `FavoriteMessageSchema`

#### Scenario: JSON corrupto
- **WHEN** la clave contiene JSON inválido o datos que no pasan el schema
- **THEN** se devuelve el default y no se lanza excepción

### Requirement: Migración legacy
Al leer, el servicio DEBE migrar en perezoso desde claves legacy (`bible_favorites`, `isMuted`, `readingSpeedMultiplier`, `lastChapter_{book}`, `chatProgress_{book}_{chapter}`) hacia las claves `naas:v1:*` sin borrar las legacy hasta escribir con éxito la nueva.

#### Scenario: Usuario con favoritos previos
- **WHEN** existe `bible_favorites` válido y no existe `naas:v1:favorites`
- **THEN** `getFavorites()` devuelve los favoritos legacy y los escribe en la clave nueva

### Requirement: Hidratación SSR-safe
Los contextos/hooks que persisten estado DEBEN iniciar con defaults puros, hidratar en un efecto y solo persistir tras el flag `hydrated` (nunca escribir defaults sobre datos reales).

#### Scenario: Primer render en servidor
- **WHEN** la app hace SSR/prerender
- **THEN** no se accede a `localStorage` y no hay mismatch de hidratación
