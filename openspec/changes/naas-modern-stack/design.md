# Design — naas-modern-stack

## Context

SPA cliente-pesada (chat simulado con auto-avance) servida por Next.js 16 App Router. Todo el estado interactivo es client-side; los datos viven en `public/data/**/*.json` y `localStorage`.

## Goals / Non-Goals

- Goal: deep-linking real, build limpio con Tailwind 4, hidratación sin mismatch, persistencia validada y versionada, QA automatizado (lint + unit + e2e).
- Non-Goal: SSR del contenido bíblico, API routes, DB, ingesta de Biblia completa.

## Decisions

### D1. URL como fuente de verdad para libro/capítulo
`currentBookId`/`currentChapter` salen de `PersistentStateContext`; pasan a ser **props desde `params`** del server component. El contexto queda solo con `favorites` + helpers de lectura (`getInitialChapter`). `ChatView` registra `lastChapter` en un efecto (para la Home).

### D2. Rutas estáticas con `dynamicParams = false`
`generateStaticParams` genera las 7 páginas existentes (genesis 1-3, exodus 1-4); combinaciones inválidas → 404 por build. En Next 16 `params` es Promise: `await params` en server components.

### D3. Tailwind 4 vía PostCSS, config en CSS
`postcss.config.mjs` con `@tailwindcss/postcss`; `src/index.css` usa `@import "tailwindcss"` + `@theme` (font tokens desde variables de `next/font`); utilidades NAAS con `@utility`. Notas v4 aplicadas: `shadow-inner` → `shadow-[inset_*]`, autodetección de contenido (sin array `content`).

### D4. `motion` en lugar de `framer-motion`
Mismo API (`motion/react`); framer-motion es alias legacy del mismo proyecto.

### D5. Hidratación SSR-safe con patrón default → hydrate → persist
Estado inicial = default puro (sin tocar `localStorage`); un efecto hidrata; un flag `hydrated` evita escribir defaults sobre datos reales. Se elimina el hack duplicado `isMounted` donde el valor hidratado lo cubre.

### D6. `StorageService` como única puerta a `localStorage`
Claves `naas:v1:{favorites,settings,lastChapter:{book},progress:{book}:{chapter}}`. Lecturas con Zod `safeParse` + `try/catch`; migración perezosa desde claves legacy (`bible_favorites`, `isMuted`, `readingSpeedMultiplier`, `lastChapter_*`, `chatProgress_*`) sin borrarlas hasta escritura exitosa en la clave nueva. SSR: no-ops en server.

### D7. A11y sin romper el look
`select-none` solo en chrome (headers, nav, menús, botones); burbujas de mensajes seleccionables. `aria-label` en icon-only buttons. `Surface` no se hace `role="button"` (las burbujas usan doble-tap para like y serían ruido para lectores).

### D8. Scroll del chat respetando al usuario
rAF + `scrollTo({ behavior: 'smooth' })` solo si el usuario está cerca del bottom (<160px). Si subió a re-leer, no se le secuestra el scroll.

## Risks / Trade-offs

- Tailwind 4 cambia defaults (border-color, shadow scale) → la app usa colores de borde explícitos; `shadow-inner` migrado a arbitrary. Verificado con build + e2e visual básico.
- `next/font` requiere red en build → fallback documentado a `<link>` si el sandbox lo bloquea.
- Migración de storage: si el parseo legacy falla, se descarta en silencio (favoritos corruptos no bloquean la app).
- ESLint 10 + FlatCompat: `eslint-config-next` declara `eslint >= 9`, compatible.

## Migration Plan

1. Tooling + deps (no toca código de app) → build verde.
2. Tailwind 4 + fonts → snapshot visual por e2e de humo.
3. StorageService + hidratación → unit tests de migración.
4. Routing → e2e deep-link/back/capítulos.
5. A11y + scroll → verificación manual + e2e.

Rollback: cada paso es un commit atómico; revert por paso.
