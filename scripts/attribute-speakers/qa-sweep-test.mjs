#!/usr/bin/env node
/**
 * Corredor de la suite del corpus SIN el gateway.
 *
 * `qa-sweep.mjs` es el auditor real y necesita el workspace aletheia-gateway
 * (comparación de texto contra la fuente). Sin él degrada a "sinFuente" y deja
 * sin cubrir schema, ids, vocabulario y las reglas de atribución. Este script
 * corre `qa-sweep.test.mjs`, que sí es autónomo, para que la integridad del
 * corpus se pueda verificar en cualquier máquina.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const r = spawnSync(process.execPath, ['--test', join(HERE, 'qa-sweep.test.mjs')], { stdio: 'inherit' });
process.exitCode = r.status ?? 1;
