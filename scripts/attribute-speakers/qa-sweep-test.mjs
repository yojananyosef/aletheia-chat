#!/usr/bin/env node
/**
 * Corredor de la suite del corpus SIN el gateway.
 *
 * `qa-sweep.mjs` es el auditor real y necesita el workspace aletheia-gateway
 * (comparación de texto contra la fuente). Sin él degrada a "sinFuente" y deja
 * sin cubrir schema, ids, vocabulario y las reglas de atribución. Este script
 * corre las suites que sí son autónomas, para que la integridad del corpus se
 * pueda verificar en cualquier máquina:
 *
 *   qa-sweep.test.mjs     integridad del corpus publicado
 *   run.replay.test.mjs   no-regresión de las reglas de run.mjs sobre el
 *                         corpus publicado, reingerido verso a verso
 *
 * `run.test.mjs` queda fuera a propósito: sus fixtures leen el gateway, así que
 * sin él fallan todos por ENOENT y no aportan señal. Se corre con el workspace
 * presente (`pnpm test:speakers`).
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
let status = 0;
for (const suite of ['qa-sweep.test.mjs', 'run.replay.test.mjs']) {
  const r = spawnSync(process.execPath, ['--test', join(HERE, suite)], { stdio: 'inherit' });
  status ||= r.status ?? 1;
}
process.exitCode = status;
