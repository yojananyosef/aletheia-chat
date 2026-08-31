# tooling

## ADDED

### Requirement: pnpm como único gestor
El repositorio DEBE tener un único lockfile (`pnpm-lock.yaml`), `.npmrc` con `engine-strict=true`, `engines.node >=22` y `mise.toml` fijando node 22 + pnpm. `bun.lock` DEJA DE EXISTIR y la documentación DEBE instruir `pnpm`.

### Requirement: QA automatizado
El proyecto DEBE tener `pnpm lint` (ESLint flat con next/core-web-vitals + next/typescript), `pnpm test` (Vitest + Testing Library, jsdom) y `pnpm test:e2e` (Playwright) ejecutables en verde.

#### Scenario: Suite completa
- **WHEN** se ejecuta `pnpm lint && pnpm test && pnpm build`
- **THEN** los tres comandos terminan sin errores
