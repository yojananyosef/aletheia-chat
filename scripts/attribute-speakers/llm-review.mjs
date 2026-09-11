#!/usr/bin/env node
/**
 * llm-review.mjs — Paso 2: solo versículos ambiguous del run.mjs.
 *
 * Lee el diagnóstico (--dry-run) del capítulo, filtra ambiguous:true y genera
 * review-queue.json con el prompt listo para LLM offline/manual. No llama a ninguna API:
 * el operador pega el output validado (JSON estricto) y re-ejecuta con --apply <file>.
 *
 * Uso:
 *   node scripts/attribute-speakers/llm-review.mjs --book genesis --chapter 3 --source SpaRVG > review-queue.json
 *   # ... completar speakers con LLM/manual ...
 *   node scripts/attribute-speakers/llm-review.mjs --book genesis --chapter 3 --apply reviewed.json --write
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { attributeChapter, CODE_BY_SLUG } from './run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const GATEWAY = '/home/Johan/orca/aletheia-gateway/public/data/bibles/SpaRVG';

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
}

const slug = (arg('--book', 'genesis') ?? '').toLowerCase();
const chapter = Number(arg('--chapter', '3'));
const source = arg('--source', 'SpaRVG');
const applyFile = arg('--apply', null);
const write = process.argv.includes('--write');
const code = CODE_BY_SLUG[slug];

const patterns = JSON.parse(readFileSync(join(HERE, 'patterns.es.json'), 'utf8'));
const participants = JSON.parse(readFileSync(join(HERE, 'participants.json'), 'utf8'));
const srcBook = JSON.parse(readFileSync(join(GATEWAY, `${code}.json`), 'utf8'));
const verses = srcBook.chapters[String(chapter)]?.verses ?? [];
const { diagnosis } = attributeChapter({ verses, slug, chapter, patterns, participants });
const ambiguous = diagnosis.filter(d => d.ambiguous);
const sha = createHash('sha1').update(JSON.stringify(verses)).digest('hex').slice(0, 12);

if (!applyFile) {
  const queue = {
    cacheKey: `sha1:${sha}`,
    book: slug,
    chapter,
    source,
    participants: participants[slug] ?? participants._default,
    instructions: 'Para cada item ambiguous devuelve {verse, subId, speaker, confidence}. Speaker SOLO del vocabulario participants. Spanish.',
    ambiguous: ambiguous.map(d => ({
      ...d,
      text: verses.find(v => v.number === d.verse)?.text ?? '',
    })),
    prompt: `Atribuye speaker bíblico por sub-versículo (${slug} cap ${chapter}, fuente ${source}). Vocabulario: ${(participants[slug] ?? participants._default).join(', ')}. Responde SOLO JSON array [{verse, subId, speaker, confidence}].`,
  };
  process.stdout.write(JSON.stringify(queue, null, 2) + '\n');
  process.stderr.write(`# ${ambiguous.length} ambiguos · cacheKey sha1:${sha} · --apply reviewed.json --write para fusionar\n`);
} else {
  const reviewed = JSON.parse(readFileSync(applyFile, 'utf8'));
  const items = Array.isArray(reviewed) ? reviewed : reviewed.items ?? reviewed.resolved ?? [];
  // Validación mínima Zod-like sin dependencia: speaker en vocabulario, confidence 0..1
  const valid = new Set(participants[slug] ?? participants._default);
  for (const it of items) {
    if (!valid.has(it.speaker)) throw new Error(`speaker fuera de vocabulario: ${it.speaker} (verso ${it.verse})`);
    if (!(it.confidence >= 0 && it.confidence <= 1)) throw new Error(`confidence inválida verso ${it.verse}`);
  }
  if (!write) {
    process.stdout.write(JSON.stringify({ cacheKey: `sha1:${sha}`, resolved: items.length, items }, null, 2) + '\n');
  } else {
    // Si ya existe public/data/<slug>/<ch>.json (p. ej. generado con --platense-headings),
    // fusionar speakers sobre él para no perder títulos/headings. Si no, regenerar.
    const dest = join(HERE, '..', '..', 'public', 'data', slug, `${chapter}.json`);
    const byKey = new Map(items.map(it => [`${it.verse}${it.subId}`, it]));
    let messages;
    let book;
    let title;
    try {
      const existing = JSON.parse(readFileSync(dest, 'utf8'));
      messages = existing.messages;
      book = existing.book;
      title = existing.title;
    } catch {
      const fresh = attributeChapter({ verses, slug, chapter, patterns, participants });
      messages = fresh.messages;
      book = srcBook.bookName;
      title = `${srcBook.bookName} ${chapter}`;
    }
    let fused = 0;
    for (const m of messages) {
      const verseMatch = m.id.match(/_(\d+)([a-z0-9]*)$/);
      const key = verseMatch ? `${verseMatch[1]}${verseMatch[2]}` : null;
      const it = key && byKey.get(key);
      if (it && m.speaker !== it.speaker) {
        m.speaker = it.speaker;
        fused++;
      }
    }
    // Validar que todos los items encontraron su mensaje
    const ids = new Set(messages.map(m => {
      const vm = m.id.match(/_(\d+)([a-z0-9]*)$/);
      return vm ? `${vm[1]}${vm[2]}` : null;
    }));
    const missing = items.filter(it => !ids.has(`${it.verse}${it.subId}`));
    if (missing.length) throw new Error(`items sin mensaje destino: ${JSON.stringify(missing)}`);
    writeFileSync(dest, JSON.stringify({ book, chapter, title, messages }, null, 4) + '\n');
    process.stderr.write(`# Fusionados ${fused}/${items.length} speakers en ${dest}\n`);
  }
}
