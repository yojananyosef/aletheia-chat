# routing

## ADDED

### Requirement: Rutas reales por libro y capítulo
La app DEBE exponer `/` (Home) y `/[book]/[chapter]` (Chat) como rutas del App Router, con deep-linking y back-button del navegador funcionales.

#### Scenario: Deep-link a un capítulo existente
- **WHEN** el usuario navega a `/genesis/1`
- **THEN** se renderiza el ChatView de Génesis capítulo 1 con su metadata (`generateMetadata`)

#### Scenario: Ruta inválida
- **WHEN** el usuario navega a `/levitico/1` (libro locked) o `/genesis/99`
- **THEN** la app responde 404 (`notFound()`, `dynamicParams = false`)

### Requirement: Navegación programática
La navegación entre vistas DEBE usar `next/navigation` (`useRouter`), no estado local de React.

#### Scenario: Home → Chat
- **WHEN** el usuario selecciona un libro disponible en la Home
- **THEN** la URL cambia a `/[book]/[initialChapter]`

#### Scenario: Chat → atrás
- **WHEN** el usuario pulsa el botón back del chat
- **THEN** la URL vuelve a `/`

## REMOVED

### Requirement: Router por useState
`src/App.tsx` con `useState<'home'|'chat'>` DEJA DE EXISTIR.
