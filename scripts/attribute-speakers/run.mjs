#!/usr/bin/env node
/**
 * attribute-speakers / run.mjs — Paso 1 heurístico (determinista, sin red).
 *
 * Lee un capítulo gateway (SpaRVG/SpaPlatense):
 *   /home/j/proyectos/alethia-gateway/public/data/bibles/<Version>/<CODE>.json
 * y emite mensajes NAAS [{id, speaker, verse, text, isSectionTitle?}] + diagnóstico
 * [{verse, subId, speaker, confidence, rule, ambiguous}].
 *
 * Orden de reglas (ver specs/speakers.md Fase 3):
 *  1. headings Platense (no vacíos) -> Sistema isSectionTitle (confidence .95, rule 'heading')
 *  2. split "Y X dijo: <cita>" -> Narrador + cita (rule 'split-dijo')
 *  3. regex speaker sobre (cita o verso) -> speaker (rule speakerRules.id)
 *  4. fallback Narrador confidence .55 ambiguous:true (salvo que participants lo permita)
 *
 * Uso:
 *   node scripts/attribute-speakers/run.mjs --book genesis --chapter 3 --source SpaRVG [--dry-run] [--write] [--platense-headings]
 *   --dry-run imprime tabla verso->speaker->rule->confidence (default si no hay --write)
 *   --write escribe public/data/<slug>/<cap>.json (válido ChapterDataSchema)
 *   --platense-headings fusiona headings desde SpaPlatense aunque source sea SpaRVG
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const GATEWAY = '/home/j/proyectos/alethia-gateway/public/data/bibles';

const CODE_BY_SLUG = { genesis: 'GEN', exodus: 'EXO' };
const ABBR_BY_SLUG = { genesis: 'g', exodus: 'e' };

function parseArgs(argv) {
  const out = { book: 'genesis', chapter: 1, source: 'SpaRVG', write: false, platenseHeadings: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--book') out.book = argv[++i];
    else if (a === '--chapter') out.chapter = Number(argv[++i]);
    else if (a === '--source') out.source = argv[++i];
    else if (a === '--write') out.write = true;
    else if (a === '--dry-run') out.write = false;
    else if (a === '--platense-headings') out.platenseHeadings = true;
  }
  return out;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function detectSpeechSpeaker(speech, patterns) {
  for (const rule of patterns.speakerRules) {
    const re = new RegExp(rule.pattern, rule.flags ?? 'i');
    if (re.test(speech)) return { speaker: rule.speaker, confidence: rule.confidence, rule: rule.id };
  }
  return null;
}

const DICENDI_RE = /\b(dijo|respondi[óo]|llam[óo]|bendijo|habl[óo]|clam[óo]|pregunt[óo]|contest[óo])\b/i;

/**
 * Sujeto del verbo dicendi: PRIMER candidato (el sujeto suele ir primero en español).
 * Si hay ≥2 speakers distintos en el narrador ("la serpiente... que Jehová Dios había hecho...
 * la cual dijo"), se devuelve el primero pero marcado multi:true para forzar revisión LLM —
 * antes esto elegía mal con confianza alta (v1b Serpiente→Dios, v9b Dios→Adán).
 */
function detectSayer(narratorPart, patterns) {
  const hits = [];
  for (const rule of patterns.speakerRules) {
    const re = new RegExp(rule.pattern, (rule.flags ?? 'i') + 'g');
    for (const m of narratorPart.matchAll(re)) {
      hits.push({ idx: m.index ?? 0, speaker: rule.speaker, confidence: rule.confidence, rule: rule.id });
    }
  }
  if (!hits.length) return null;
  hits.sort((a, b) => a.idx - b.idx);
  // Destino antepuesto sin sujeto ("A la mujer dijo:", "Y al hombre dijo:") — el único
  // candidato es el destinatario, no el hablante (suele ser Dios en contexto de juicio).
  // Se devuelve null para caer al default-Dios ambiguo que confirma el LLM.
  if (/^\s*(y\s+)?a(l)?\s+/i.test(narratorPart)) return null;
  // Solo compiten los candidatos ANTES del verbo (sujetos). Lo que va después ("dijo a la
  // mujer", "llamó Dios ... a Adán") es destinatario, no sayer alternativo.
  const verb = narratorPart.match(DICENDI_RE);
  const verbIdx = verb && verb.index != null ? verb.index : -1;
  const pre = verbIdx >= 0 ? hits.filter(h => h.idx <= verbIdx) : hits;
  const pool = pre.length ? pre : hits;
  const distinct = new Set(pool.map(h => h.speaker));
  const first = pool[0];
  if (distinct.size > 1) {
    return { speaker: first.speaker, confidence: 0.5, rule: `sayer-multi-${first.rule}`, multi: true };
  }
  const tag = pre.length ? 'sayer' : 'sayer-postverb';
  return { speaker: first.speaker, confidence: first.confidence, rule: `${tag}-${first.rule}` };
}

export function attributeChapter({ verses, headingsByVerse = {}, slug, chapter, patterns, participants }) {
  const messages = [];
  const diagnosis = [];
  const abbr = ABBR_BY_SLUG[slug] ?? slug[0];
  const splitRe = new RegExp(patterns.splits[0].pattern, patterns.splits[0].flags ?? 'i');
  const valid = new Set(participants[slug] ?? participants._default);

  const pushMsg = (verse, subId, speaker, text, extra = {}) => {
    messages.push({ id: `${abbr}${chapter}_${verse}${subId}`, speaker, verse, text, ...extra });
  };

  for (const v of verses) {
    const verseNum = v.number;
    const headings = [...(v.headings ?? []), ...(headingsByVerse[String(verseNum)] ?? [])].filter(Boolean);
    // 1. headings -> títulos Sistema (solo el primero no genérico por verso para no duplicar)
    for (const h of headings) {
      const hid = `${abbr}${chapter}_sec${verseNum}_${createHash('sha1').update(h).digest('hex').slice(0, 4)}`;
      messages.push({ id: hid, speaker: 'Sistema', verse: verseNum, text: h, isSectionTitle: true });
      diagnosis.push({ verse: verseNum, subId: '', speaker: 'Sistema', confidence: 0.95, rule: 'heading', ambiguous: false });
    }

    const text = (v.text ?? '').trim();
    if (!text) continue;
    const m = text.match(splitRe);

    if (m && m[2] && m[2].trim().length >= (patterns.splits[0].minSpeechLen ?? 2)) {
      const narratorPart = m[1].trim();
      const speech = m[2].trim();
      pushMsg(verseNum, 'a', 'Narrador', narratorPart);
      diagnosis.push({ verse: verseNum, subId: 'a', speaker: 'Narrador', confidence: 0.9, rule: 'split-dijo', ambiguous: false });
      // Prioridad al SUJETO del verbo dicendi ("la serpiente dijo a la mujer: X" -> X lo dice la Serpiente,
      // aunque la cita mencione a Dios). Solo si el narrador no nombra sujeto, mirar la cita.
      const sayer = detectSayer(narratorPart, patterns);
      const hit = sayer ?? detectSpeechSpeaker(speech, patterns);
      const speaker = hit?.speaker ?? 'Dios';
      const confidence = hit?.confidence ?? 0.6;
      const rule = hit ? hit.rule : 'split-default-Dios';
      const ambiguous = !valid.has(speaker) || confidence < 0.8 || !!hit?.multi;
      pushMsg(verseNum, 'b', speaker, speech);
      diagnosis.push({ verse: verseNum, subId: 'b', speaker, confidence, rule, ambiguous });
    } else {
      const hit = detectSpeechSpeaker(text, patterns);
      if (hit && valid.has(hit.speaker)) {
        // Verso narrado que menciona a alguien no implica discurso; solo citas en 1ª persona o “dijo a X:” ya cubiertas.
        // Si el verso es pregunta/cita directa (¿...? / ¡...! / “...”), atribuir; si no, Narrador.
        const looksQuoted = /^[¿¡"“]/.test(text) || /[?!”"]\s*$/.test(text);
        if (looksQuoted) {
          const ambiguous = hit.confidence < 0.8;
          pushMsg(verseNum, '', hit.speaker, text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: hit.speaker, confidence: hit.confidence, rule: hit.rule, ambiguous });
        } else {
          pushMsg(verseNum, '', 'Narrador', text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: 'Narrador', confidence: 0.55, rule: 'fallback-narrator', ambiguous: false });
        }
      } else {
        pushMsg(verseNum, '', 'Narrador', text);
        diagnosis.push({ verse: verseNum, subId: '', speaker: 'Narrador', confidence: 0.55, rule: 'fallback-narrator', ambiguous: false });
      }
    }
  }
  return { messages, diagnosis };
}

function main() {
  const args = parseArgs(process.argv);
  const slug = args.book.toLowerCase();
  const code = CODE_BY_SLUG[slug];
  if (!code) throw new Error(`book no soportado (slug): ${args.book}. Soportados: ${Object.keys(CODE_BY_SLUG).join(', ')}`);
  const patterns = loadJson(join(HERE, 'patterns.es.json'));
  const participants = loadJson(join(HERE, 'participants.json'));

  const srcBook = loadJson(join(GATEWAY, args.source, `${code}.json`));
  const verses = srcBook.chapters[String(args.chapter)]?.verses;
  if (!verses) throw new Error(`Capítulo no encontrado: ${args.source}/${code} cap ${args.chapter}`);

  let headingsByVerse = {};
  if (args.platenseHeadings && args.source !== 'SpaPlatense') {
    try {
      const plat = loadJson(join(GATEWAY, 'SpaPlatense', `${code}.json`));
      const pverses = plat.chapters[String(args.chapter)]?.verses ?? [];
      for (const pv of pverses) {
        if (pv.headings?.length) headingsByVerse[String(pv.number)] = pv.headings;
      }
    } catch { /* Platense sin ese libro: seguir sin headings */ }
  } else if (args.source === 'SpaPlatense') {
    for (const pv of verses) {
      if (pv.headings?.length) headingsByVerse[String(pv.number)] = [];
    }
  }

  const { messages, diagnosis } = attributeChapter({ verses, headingsByVerse, slug, chapter: args.chapter, patterns, participants });
  const ambiguous = diagnosis.filter(d => d.ambiguous);

  if (!args.write) {
    console.log(`# ${slug} cap ${args.chapter} · fuente ${args.source} · ${messages.length} mensajes · ${ambiguous.length} ambiguos`);
    console.log('verse\tsub\tspeaker\tconf\trule\tambiguous\ttext…');
    for (const d of diagnosis) {
      const msg = messages.find(mm => mm.verse === d.verse && mm.id.endsWith(d.subId || `${d.verse}`));
      console.log(`${d.verse}\t${d.subId || '-'}\t${d.speaker}\t${d.confidence}\t${d.rule}\t${d.ambiguous ? 'AMBIGUO' : ''}\t${(msg?.text ?? '').slice(0, 80)}`);
    }
    if (ambiguous.length) {
      console.log(`\nLlevar a llm-review: node scripts/attribute-speakers/llm-review.mjs --book ${slug} --chapter ${args.chapter}`);
    }
    return;
  }

  const bookName = srcBook.bookName ?? slug;
  const title = verses[0]?.headings?.[0] ?? `${bookName} ${args.chapter}`;
  const out = { book: bookName, chapter: args.chapter, title, messages };
  const dest = join(ROOT, 'public', 'data', slug, `${args.chapter}.json`);
  mkdirSync(dirname(dest), { recursive: true });
  // No escribir diagnóstico en el JSON público (solo mensajes formato NAAS)
  writeFileSync(dest, JSON.stringify(out, null, 4) + '\n');
  console.log(`Escrito ${dest} (${messages.length} mensajes, ${ambiguous.length} ambiguos)`);
  if (ambiguous.length && existsSync(join(HERE, 'llm-review.mjs'))) {
    console.log('Ambiguos pendientes de llm-review (no bloquean --write).');
  }
}

// Solo correr CLI si se invoca directo, no al importar en tests
if (import.meta.url === `file://${process.argv[1]}`) main();
