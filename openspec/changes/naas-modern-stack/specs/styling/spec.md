# styling

## ADDED

### Requirement: Tailwind 4 con config en CSS
El proyecto DEBE compilar con Tailwind CSS 4 vía `@tailwindcss/postcss`; la configuración de tema (fuentes, colores) DEBE vivir en `src/index.css` bajo `@theme`. `tailwind.config.js` DEJA DE EXISTIR.

#### Scenario: Clases usadas en app/ y src/ se generan
- **WHEN** se ejecuta `pnpm build`
- **THEN** las utilidades empleadas en `app/**` y `src/**` están presentes en el CSS producido (autodetección v4, sin array `content`)

### Requirement: Fuentes self-hosted
Las fuentes Inter y Space Grotesk DEBEN cargarse con `next/font` (variables CSS `--font-inter` / `--font-grotesk`), sin `<link>` al CDN de Google.

#### Scenario: Tokens de fuente conectados
- **WHEN** la app renderiza
- **THEN** `font-sans` resuelve a Inter y `font-display` a Space Grotesk vía `@theme`

## MODIFIED

### Requirement: Utilidades NAAS preservadas
`naas-border`, `naas-shadow`, `naas-shadow-lg`, `naas-interactive`, `safe-top/bottom`, `no-scrollbar` DEBEN seguir disponibles (definidas con `@utility` / CSS plano).
