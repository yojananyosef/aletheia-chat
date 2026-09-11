#!/usr/bin/env node
/**
 * qa-sweep.mjs — Barrido QA del corpus publicado (determinista, sin red).
 *
 * Verifica por libro/capítulo (openspec: naas-qa-auditoria-corpus):
 *   - Integridad: schema de mensajes, ids únicos, capítulos publicados vs books.ts,
 *     texto reconstruido por verso vs fuente gateway SpaRVG.
 *   - Vocabulario: speaker ∈ participants.json(libro) ∧ books.ts ∧ CanonicalSpeaker.
 *   - Divergencias dry↔aplicado: clasificadas en revisado (respaldadas por reviewed/)
 *     o sospechoso (sin respaldo). Deuda: ambiguos del dry sin entrada reviewed/.
 *
 * Uso:
 *   node scripts/attribute-speakers/qa-sweep.mjs              # tabla humana
 *   node scripts/attribute-speakers/qa-sweep.mjs --json       # máquina-readable
 *   node scripts/attribute-speakers/qa-sweep.mjs --book ester # un libro
 * Exit 1 si hay hallazgos duros (capitulo-faltante, texto-perdido, vocabulario-invalido, schema).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { attributeChapter, CODE_BY_SLUG } from './run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const GATEWAY = '/home/Johan/orca/aletheia-gateway/public/data/bibles/SpaRVG';
const DATA = join(ROOT, 'public', 'data');

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
};
const asJson = process.argv.includes('--json');
const onlyBook = arg('--book');

const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

/** books.ts por regex (TS no importable): id, availableChapters, participants por objeto. */
function parseBooks() {
  const src = readFileSync(join(ROOT, 'src', 'constants', 'books.ts'), 'utf8');
  const books = new Map();
  for (const m of src.matchAll(/\{[^{}]*\}/g)) {
    const id = m[0].match(/id:\s*'([^']+)'/)?.[1];
    const chs = m[0].match(/availableChapters:\s*\[([^\]]*)\]/)?.[1];
    const parts = m[0].match(/participants:\s*\[([^\]]*)\]/)?.[1];
    if (!id || chs == null) continue;
    books.set(id, {
      availableChapters: chs.split(',').map(s => s.trim()).filter(Boolean).map(Number),
      participants: new Set((parts ?? '').split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(Boolean)),
    });
  }
  return books;
}

/** CanonicalSpeaker de Message.ts: literales del type alias. */
function parseCanonicalSpeakers() {
  const src = readFileSync(join(ROOT, 'src', 'core', 'domain', 'Message.ts'), 'utf8');
  const start = src.indexOf('export type CanonicalSpeaker');
  const end = src.indexOf(';', start);
  const body = src.slice(start, end);
  return new Set([...body.matchAll(/'([^']+)'/g)].map(m => m[1]));
}

function loadReviewed(slug) {
  const dir = join(HERE, 'reviewed');
  if (!existsSync(dir)) return new Map();
  const byCap = new Map();
  for (const f of readdirSync(dir)) {
    const m = f.match(new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)\\.json$`));
    if (!m) continue;
    const items = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    byCap.set(Number(m[1]), new Map(items.map(it => [`${it.verse}${it.subId}`, it.speaker])));
  }
  return byCap;
}

const HARD = new Set(['capitulo-faltante', 'capitulo-extra', 'texto-perdido', 'schema', 'id-duplicado', 'vocabulario-invalido']);
const findings = [];

function add(type, slug, cap, detail) {
  findings.push({ type, slug, cap, ...detail });
}

function sweepBook(slug, info, participants, canonical) {
  const dir = join(DATA, slug);
  if (!existsSync(dir)) return;
  const caps = readdirSync(dir).filter(f => f.endsWith('.json')).map(f => Number(f.replace('.json', ''))).sort((a, b) => a - b);
  const reviewed = loadReviewed(slug);
  const vocab = new Set([...(participants[slug] ?? participants._default ?? [])]);
  const booksVocab = info.participants;
  const code = CODE_BY_SLUG[slug];
  const srcBook = code && existsSync(join(GATEWAY, `${code}.json`)) ? JSON.parse(readFileSync(join(GATEWAY, `${code}.json`), 'utf8')) : null;
  const totals = { msgs: 0, revisado: 0, sospechoso: 0, ambiguoSinRevisar: 0 };

  for (const cap of info.availableChapters) {
    if (!caps.includes(cap)) add('capitulo-faltante', slug, cap, {});
  }
  for (const cap of caps) {
    if (!info.availableChapters.includes(cap)) add('capitulo-extra', slug, cap, {});
    const data = JSON.parse(readFileSync(join(dir, `${cap}.json`), 'utf8'));
    const msgs = data.messages ?? [];
    totals.msgs += msgs.length;
    const seenIds = new Set();
    for (const m of msgs) {
      if (!m.id || !m.speaker || typeof m.verse !== 'number' || typeof m.text !== 'string' || !m.text.length) {
        add('schema', slug, cap, { verse: m.verse, id: m.id });
      }
      if (seenIds.has(m.id)) add('id-duplicado', slug, cap, { verse: m.verse, id: m.id });
      seenIds.add(m.id);
      if (m.speaker && !vocab.has(m.speaker)) {
        add('vocabulario-invalido', slug, cap, { verse: m.verse, id: m.id, speaker: m.speaker, vocab: [...vocab].join(', ') });
      }
      if (m.speaker && m.speaker !== 'Sistema' && booksVocab.size && !booksVocab.has(m.speaker)) {
        add('vocabulario-invalido', slug, cap, { verse: m.verse, id: m.id, speaker: m.speaker, origen: 'books.ts' });
      }
      if (m.speaker && canonical.size && !canonical.has(m.speaker)) {
        add('vocabulario-invalido', slug, cap, { verse: m.verse, id: m.id, speaker: m.speaker, origen: 'CanonicalSpeaker' });
      }
    }

    // Texto por verso: reconstrucción con y sin títulos == fuente gateway.
    // La capitalización del primer carácter es intencional (capNarr) y no cuenta como pérdida.
    if (srcBook?.chapters?.[String(cap)]) {
      const byVerse = new Map();
      for (const m of msgs) {
        if (!byVerse.has(m.verse)) byVerse.set(m.verse, []);
        byVerse.get(m.verse).push(m);
      }
      const deCap = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);
      // Nivel letras: ignora puntuación/case/«» (capNarr, deriva upstream de la fuente, headings
      // extraídos). Solo una diferencia a nivel letras es pérdida real de texto.
      const letras = (s) => (s ?? '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      for (const v of srcBook.chapters[String(cap)].verses) {
        const src = deCap(norm(v.text));
        const ms = byVerse.get(v.number) ?? [];
        const withTitles = deCap(norm(ms.map(m => m.text).join(' ')));
        const noTitles = deCap(norm(ms.filter(m => !m.isSectionTitle).map(m => m.text).join(' ')));
        if (withTitles === src || noTitles === src) continue;
        if (letras(withTitles) === letras(src) || letras(noTitles) === letras(src)
          || letras(noTitles).length > letras(src).length) {
          // Puntuación/case/«» distintos, o corpus con MÁS letras que la fuente actual
          // (deriva upstream del gateway: GEN 39:12 "salió fuera" — RV1909/Platense lo confirman).
          add('deriva-fuente', slug, cap, { verse: v.number, fuente: src.length, corpus: noTitles.length });
        } else {
          add('texto-perdido', slug, cap, { verse: v.number, fuente: src.length, corpus: noTitles.length });
        }
      }
    }

    // Divergencias dry↔aplicado + deuda de review.
    if (code && srcBook?.chapters?.[String(cap)]) {
      const { messages: dryMsgs, diagnosis } = attributeChapter({
        verses: srcBook.chapters[String(cap)].verses, slug, chapter: cap, patterns, participants,
      });
      const dry = new Map(dryMsgs.flatMap(m => {
        const vm = m.id.match(/_(\d+)([a-z0-9]*)$/);
        return vm ? [[`${vm[1]}${vm[2]}`, m.speaker]] : [];
      }));
      const rev = reviewed.get(cap) ?? new Map();
      for (const m of msgs) {
        if (m.isSectionTitle) continue;
        const vm = m.id.match(/_(\d+)([a-z0-9]*)$/);
        if (!vm) continue;
        const key = `${vm[1]}${vm[2]}`;
        const drySpk = dry.get(key);
        if (drySpk && drySpk !== m.speaker) {
          if (rev.get(key) === m.speaker) totals.revisado++;
          else { totals.sospechoso++; add('sospechoso', slug, cap, { verse: vm[1], subId: vm[2], aplicado: m.speaker, dry: drySpk }); }
        }
      }
      for (const d of diagnosis) {
        if (!d.ambiguous || d.subId === 'h') continue;
        if (!rev.has(`${d.verse}${d.subId}`)) totals.ambiguoSinRevisar++;
      }
    }
  }
  return totals;
}

const books = parseBooks();
const canonical = parseCanonicalSpeakers();
const participants = JSON.parse(readFileSync(join(HERE, 'participants.json'), 'utf8'));
const patterns = JSON.parse(readFileSync(join(HERE, 'patterns.es.json'), 'utf8'));

const summary = [];
for (const [slug, info] of books) {
  if (info.availableChapters.length === 0) continue;
  if (onlyBook && slug !== onlyBook) continue;
  const totals = sweepBook(slug, info, participants, canonical) ?? { msgs: 0, revisado: 0, sospechoso: 0, ambiguoSinRevisar: 0 };
  summary.push({ slug, ...totals });
}

if (asJson) {
  process.stdout.write(JSON.stringify({ findings, summary }, null, 2) + '\n');
} else {
  for (const s of summary) {
    console.log(`${s.slug.padEnd(14)} ${String(s.msgs).padStart(5)} msgs  revisado=${s.revisado}  sospechoso=${s.sospechoso}  ambiguo-sin-revisar=${s.ambiguoSinRevisar}`);
  }
  if (findings.length) {
    console.log('\n# HALLAZGOS');
    const byType = new Map();
    for (const f of findings) {
      if (!byType.has(f.type)) byType.set(f.type, []);
      byType.get(f.type).push(f);
    }
    for (const [type, fs] of byType) {
      console.log(`\n[${type}] ${fs.length}`);
      for (const f of fs.slice(0, type === 'sospechoso' ? 400 : 60)) {
        const extra = [f.origen, f.speaker && `speaker=${f.speaker}`, f.aplicado && `aplicado=${f.aplicado}`, f.dry && `dry=${f.dry}`, f.fuente && `fuente=${f.fuente}`, f.corpus && `corpus=${f.corpus}`, f.verse != null && `verso=${f.verse}`, f.subId && `sub=${f.subId}`, f.id && `id=${f.id}`].filter(Boolean).join(' ');
        console.log(`  ${f.slug} ${f.cap}: ${extra}`);
      }
      if (fs.length > 60 && type !== 'sospechoso') console.log(`  … ${fs.length - 60} más`);
    }
  }
  const hard = findings.filter(f => HARD.has(f.type)).length;
  console.log(`\n# ${findings.length} hallazgos (${hard} duros) · ${summary.length} libros · exit ${hard ? 1 : 0}`);
}
process.exitCode = findings.some(f => HARD.has(f.type)) ? 1 : 0;
