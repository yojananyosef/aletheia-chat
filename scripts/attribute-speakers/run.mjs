#!/usr/bin/env node
/**
 * attribute-speakers / run.mjs — Paso 1 heurístico (determinista, sin red).
 *
 * Lee un capítulo gateway (SpaRVG/SpaPlatense):
 *   /home/Johan/orca/aletheia-gateway/public/data/bibles/<Version>/<CODE>.json
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
const GATEWAY = '/home/Johan/orca/aletheia-gateway/public/data/bibles';

/** Slug bible-app-naas -> código gateway (SpaRVG/RV1909/Platense comparten códigos). */
export const CODE_BY_SLUG = {
  genesis: 'GEN', exodus: 'EXO', levitico: 'LEV', numeros: 'NUM', deuteronomio: 'DEU',
  josue: 'JOS', jueces: 'JDG', rut: 'RUT', '1samuel': '1SA', '2samuel': '2SA',
  '1reyes': '1KI', '2reyes': '2KI', '1cronicas': '1CH', '2cronicas': '2CH',
  esdras: 'EZR', nehemias: 'NEH', ester: 'EST', job: 'JOB', salmos: 'PSA',
  proverbios: 'PRO', eclesiastes: 'ECC', cantares: 'SNG', isaias: 'ISA',
  jeremias: 'JER', lamentaciones: 'LAM', ezequiel: 'EZK', daniel: 'DAN',
  oseas: 'HOS', joel: 'JOL', amos: 'AMO', abdias: 'OBA', jonas: 'JON',
  miqueas: 'MIC', nahum: 'NAM', habacuc: 'HAB', sofonias: 'ZEP', hageo: 'HAG',
  zacarias: 'ZEC', malaquias: 'MAL', mateo: 'MAT', marcos: 'MRK', lucas: 'LUK',
  juan: 'JHN', hechos: 'ACT', romanos: 'ROM', '1corintios': '1CO', '2corintios': '2CO',
  galatas: 'GAL', efesios: 'EPH', filipenses: 'PHP', colosenses: 'COL',
  '1tesalonicenses': '1TH', '2tesalonicenses': '2TH', '1timoteo': '1TI',
  '2timoteo': '2TI', tito: 'TIT', filemon: 'PHM', hebreos: 'HEB', santiago: 'JAS',
  '1pedro': '1PE', '2pedro': '2PE', '1juan': '1JN', '2juan': '2JN', '3juan': '3JN',
  judas: 'JUD', revelation: 'REV',
};
// IDs históricos cortos para génesis/éxodo (compat localStorage); resto = código gateway.
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
    if (rxRule(rule).test(speech)) return { speaker: rule.speaker, confidence: rule.confidence, rule: rule.id };
  }
  return null;
}

/**
 * Regex Unicode-aware: \b nativo es ASCII-only (\w = [A-Za-z0-9_]) y ROMPE con
 * tildes en el borde ("Jehová:", "Moisés,", "habló"). Se sustituyen los \b
 * perimetrales por lookarounds \p{L} con flag /u.
 */
function rx(pattern, flags = 'i', global = false) {
  let p = pattern.replace(/^\\b/, '(?<![\\p{L}\\p{N}_])').replace(/\\b$/, '(?![\\p{L}\\p{N}_])');
  let f = flags.includes('u') ? flags : flags + 'u';
  if (global && !f.includes('g')) f += 'g';
  return new RegExp(p, f);
}

function rxRule(rule, global = false) {
  return rx(rule.pattern, rule.flags ?? 'i', global);
}

const DICENDI_RE = rx('\\b(dij[\\p{L}]+|dic[\\p{L}]+|dec[\\p{L}]+|respond[\\p{L}]+|llam[\\p{L}]+|habl[\\p{L}]+|bend[\\p{L}]+|clam[\\p{L}]+|pregunt[\\p{L}]+|contest[\\p{L}]+|replic[\\p{L}]+|exclam[\\p{L}]+|grit[\\p{L}]+|salud[\\p{L}]+)\\b', 'i');

/**
 * Sujeto del verbo dicendi: PRIMER candidato (el sujeto suele ir primero en español).
 * Si hay ≥2 speakers distintos en el narrador ("la serpiente... que Jehová Dios había hecho...
 * la cual dijo"), se devuelve el primero pero marcado multi:true para forzar revisión LLM —
 * antes esto elegía mal con confianza alta (v1b Serpiente→Dios, v9b Dios→Adán).
 */
function detectSayer(narratorPart, patterns) {
  const hits = [];
  for (const rule of patterns.speakerRules) {
    for (const m of narratorPart.matchAll(rxRule(rule, true))) {
      hits.push({ idx: m.index ?? 0, len: m[0].length, speaker: rule.speaker, confidence: rule.confidence, rule: rule.id });
    }
  }
  if (!hits.length) return null;
  hits.sort((a, b) => a.idx - b.idx);
  // Reglas solapadas ("hija de Faraón" contiene "Faraón", "Jehová Dios" contiene
  // "Jehová"): quedarse con el match más largo y descartar los contenidos en él.
  const deduped = [];
  for (const h of hits) {
    const hEnd = h.idx + h.len;
    if (deduped.some(d => h.idx >= d.idx && hEnd <= d.idx + d.len && (d.len > h.len || d.idx < h.idx))) continue;
    // Si este es más largo y contiene anteriores, expulsarlos.
    for (let i = deduped.length - 1; i >= 0; i--) {
      const d = deduped[i];
      if (d.idx >= h.idx && d.idx + d.len <= hEnd && h.len > d.len) deduped.splice(i, 1);
    }
    deduped.push(h);
  }
  // Destino antepuesto sin sujeto ("A la mujer dijo:", "Y al hombre dijo:") — el único
  // candidato es el destinatario, no el hablante (suele ser Dios en contexto de juicio).
  // Solo aplica si NO hay candidato post-verbal (sujeto explícito tras el verbo, ej.
  // "a la cual dijo la hija de Faraón" → Hija de Faraón). Si no, default-Dios ambiguo.
  const verbM = narratorPart.match(DICENDI_RE);
  const verbIdx = verbM && verbM.index != null ? verbM.index : -1;
  const verbEnd = verbIdx >= 0 ? verbIdx + verbM[0].length : -1;
  if (/^\s*(y\s+)?a(l)?\s+/i.test(narratorPart) && !deduped.some(h => verbIdx >= 0 && h.idx > verbIdx)) return null;
  // VSO PRIMERO: sujeto post-verbal no introducido por a/al ("Y Noemí le dijo:" ->
  // Noemí; "Y dijo Moisés a Dios" -> Moisés). Gana a menciones pre-verbales ("Sea
  // él bendito de Jehová... Y Noemí le dijo:" hablaba Noemí, no Dios — RUT 2:20).
  // Con a/al es destinatario ("dijo a la mujer") y se ignora.
  if (verbEnd >= 0) {
    // Objeto preposicional justo antes del candidato ("dijo Moisés a Dios",
    // "llamó el nombre de Jehová", "habló contra Dios"): nunca es el sujeto
    // (GEN 16:13 habla Agar, no Jehová). El sujeto VSO no lleva preposición.
    const isDest = (h) => /(\s|^)(a(l)?|de(l)?|en|con|por|para|contra|entre|sobre|bajo|hacia|desde|sin|tras|seg[úu]n|nombre)(\s+\S+){0,3}\s*$/i.test(narratorPart.slice(verbEnd, h.idx));
    const post = deduped.filter(h => h.idx > verbIdx && !isDest(h));
    if (post.length) {
      const distinct = new Set(post.map(h => h.speaker));
      const first = post[0];
      if (distinct.size > 1) {
        return { speaker: first.speaker, confidence: 0.5, rule: `sayer-vso-multi-${first.rule}`, multi: true };
      }
      return { speaker: first.speaker, confidence: first.confidence, rule: `sayer-vso-${first.rule}` };
    }
  }
  // Sin sujeto post-verbal: compiten los candidatos ANTES del verbo (sujetos),
  // salvo que vayan introducidos por a/al ("oró a Jehová, y dijo:" habla Jonás,
  // no Dios — JON 4:2): el objeto de "a" es destinatario, nunca sujeto.
  const pre = (verbIdx >= 0 ? deduped.filter(h => h.idx <= verbIdx) : deduped)
    // Objeto directo con a personal + artículo/posesivo ("vio a las mujeres",
    // "dijo a su siervo"): tampoco es sujeto (GEN 33:5 habla Esaú, no Mujeres).
    .filter(h => !/(\s|^)a(l)?(\s+(el|la|los|las|un|una|mi|tu|su|este|esta|estos|estas))?\s*$/i.test(narratorPart.slice(0, h.idx)))
    // Vocativo ("oh Jehová") y complementos ("en Jehová he confiado", "hablaron
    // contra Dios", "el nombre de Jehová") no son sujeto (PSA 11:1, 31:14, 78:19).
    .filter(h => !/(^|\s)(oh|en|contra|nombre de)\s*$/i.test(narratorPart.slice(0, h.idx)));
  if (!pre.length) return null;
  const distinct = new Set(pre.map(h => h.speaker));
  const first = pre[0];
  // Sujeto pronominal ("Y ella contó a su suegra... y dijo:" habla Rut, no la
  // suegra — RUT 2:19): con ella/él/este/esta + candidato nominal, a revisión.
  // OJO: \b nativo es ASCII-only ("ésta" no tiene borde); usar rx() unicode-aware.
  // Solo pronombres (tildados o 1ª/2ª persona): "el" solo es artículo.
  // yo/tú/ti/conmigo/contigo/mí resuelven correferencia imposible ("Mas yo en ti
  // confié... yo dije:" habla David, no Jehová — PSA 31:14; "tú les respondías" 99:8).
  const pronounSubj = rx('\\b(ella|él|este|esta|[eé]ste|[eé]sta|yo|tú|ti|conmigo|contigo|mí)\\b', 'i').test(narratorPart);
  if (pronounSubj) {
    return { speaker: first.speaker, confidence: Math.min(first.confidence, 0.7), rule: `sayer-pron-${first.rule}`, multi: true };
  }
  if (distinct.size > 1) {
    return { speaker: first.speaker, confidence: 0.5, rule: `sayer-multi-${first.rule}`, multi: true };
  }
  return { speaker: first.speaker, confidence: first.confidence, rule: `sayer-${first.rule}` };
}

/**
 * Corte múltiple "verbo dicendi + :": devuelve pares {start,end} (inicio del verbo,
 * fin tras los :) de cada corte válido.
 * Válido = primer corte del verso, o segmento con fin de frase (?!.…) antes de la cola
 * narrativa. Evita fragmentar citas internas ("ha dicho: No comáis...").
 * La segmentación usa los STARTS: narr_k = text[s_k:e_k], speech_k = text[e_k:s_{k+1}].
 */
export function findCuts(text, verbStem, flags) {
  // Gap templado: el corte empieza en el dicendi MÁS CERCANO al ':' ("bendito...
  // dijo:" corta en "dijo:", no en "bendito"). Sin esto el [^:]* tragaba discurso
  // intermedio (RUT 2:20 partía "Sea él bendito..." por la mitad).
  const gap = `((?:(?!${verbStem})[^:])*)`;
  const cutRe = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${verbStem})(?![\\p{L}\\p{N}_])${gap}:`, flags.includes('u') ? flags + 'g' : flags + 'ug');
  const cuts = [];
  let lastEnd = 0;
  for (const m of text.matchAll(cutRe)) {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    const segment = text.slice(lastEnd, end);
    const isFirst = cuts.length === 0;
    const hasSentenceEnd = /[?!.…]["”'»)]?\s+\S/.test(segment);
    if (isFirst || hasSentenceEnd) {
      cuts.push({ start, end });
      lastEnd = end;
    }
  }
  return cuts;
}

export function attributeChapter({ verses, headingsByVerse = {}, slug, chapter, patterns, participants }) {
  const messages = [];
  const diagnosis = [];
  const abbr = ABBR_BY_SLUG[slug] ?? (CODE_BY_SLUG[slug] ?? slug).toLowerCase();
  const verbStem = patterns.splits[0].verbStem;
  const splitFlags = patterns.splits[0].flags ?? 'i';
  const minSpeechLen = patterns.splits[0].minSpeechLen ?? 2;
  const valid = new Set(participants[slug] ?? participants._default);
  let subCode = 0;
  const nextSub = () => (subCode < 26 ? String.fromCharCode(97 + subCode++) : `z${subCode++}`);

  const pushMsg = (verse, subId, speaker, text, extra = {}) => {
    messages.push({ id: `${abbr}${chapter}_${verse}${subId}`, speaker, verse, text, ...extra });
  };

  // Voz activa heredable: un verso-marco que termina en "...diciendo:" abre un
  // discurso cuya voz continúa en los versos siguientes sin marco (Jos 1:1 ->
  // 1:2-9: "Jehová habló a Josué... diciendo:" + discurso divino puro). Se
  // actualiza con cada marco/discurso identificado y la rompe la narración pura.
  let carried = null;
  // Marcas de discurso directo en 1ª/2ª persona (el relato en 3ª persona casi
  // nunca las usa): distinguen continuación de discurso de interludio narrativo.
  // OJO: \b en JS es ASCII aunque haya flag 'u' — para palabras con tilde
  // hay que usar lookarounds unicode (igual que rx()).
  const WB_L = '(?<![\\p{L}\\p{N}_])';
  const WB_R = '(?![\\p{L}\\p{N}_])';
  const SPEECHMARK_RE = new RegExp(`[?¡¿!]|(${WB_L}(yo|mi|me|mí|conmigo|tú|tu|te|ti|contigo|os|vosotros|vosotras|vuestro|vuestra|vuestros|vuestras|nuestro|nuestra|mío|mía|míos|mías)${WB_R})`, 'iu');
  // Imperativo 2ª persona ("Pasad", "Acordaos", "Levántate"): distingue una
  // orden transmitida (Jos 1:11a = Josué) de un marco narrativo puro
  // ("Y dijo al pueblo:" = Narrador). Denylist de sustantivos -ad/-ed.
  const IMPERATIVE_RE = new RegExp(`${WB_L}(?!verdad|bondad|maldad|ciudad|trinidad|mitad|voluntad|hermandad|amistad|merced|pared|edad|enfermedad)(\\w{3,}(?:ad|ed|id|aos|eos|[íi]os|ate|ete))${WB_R}`, 'iu');
  // Verbos en 2ª persona (futuro/condicional/pretérito/subjuntivo: casi nunca
  // son sustantivos). El presente -as/-es se excluye por ruido ("manos").
  const VERB2_RE = new RegExp(`${WB_L}(?!atrás|jamás|además|país|raíz|maíz|compás|revés)([a-záéíóúñü]\\w*(?:arás|erás|irás|arías|erías|irías|aste|iste|ares|ieres|ases|ieses|áis|éis|aréis|eréis|iréis))${WB_R}`, 'u');
  // Arranque narrativo ("Y vio/llamó/hizo Dios..."): el discurso divino dice
  // "yo", no "Dios" en 3ª. Bloquea la red divina en interludios de acción.
  const NARRSTART_RE = new RegExp(`^(?:y|e|entonces|mas|pero|pues|as[íi]|y aconteci[óo]|y sucedi[óo])\\s+(?:vio|vieron|llam[óo]|llamaron|hizo|hicieron|cre[óo]|crearon|puso|pusieron|fue|fueron|era|eran|hubo|hab[íi]a|hab[íi]an|estaba|estaban|dijo|dijeron|habl[óo]|hablaron|vino|vinieron|tom[óo]|tomaron|dio|dieron|envi[óo]|enviaron|sali[óo]|salieron|entr[óo]|entraron|muri[óo]|murieron|levant[óo]|levantaron|edific[óo]|ofreci[óo]|ofrecieron|junt[óo]|juntaron|reuni[óo]|extendi[óo]|sac[óo]|trajo|dej[óo]|oy[óo]|respondi[óo]|volvi[óo]|descendi[óo]|subi[óo]|durmi[óo]|comi[óo]|bebi[óo]|anduvo|pas[óo]|mir[óo]|hall[óo]|bendijo|hablaba|produjo|produjeron|apart[óo]|junt[óo]|separ[óo])${WB_R}`, 'iu');
  const looksSpeech = (t) => SPEECHMARK_RE.test(t) || IMPERATIVE_RE.test(t) || VERB2_RE.test(t);
  // Hablante que introduce un verso-marco "...diciendo:". Orden:
  // 1) sujeto inicial explícito ("Y Josué mandó... diciendo:" -> Josué);
  // 2) Jehová como emisor ("Jehová habló a Josué... diciendo:" -> Dios,
  //    pero "clamó/oró a Jehová:" es oración humana, no voz divina);
  // 3) detectSayer como fallback.
  const resolveIntro = (frameText) => {
    const subjM = frameText.trim().match(/^(?:y|entonces|mas|pero|también|he aquí que)\s+([\p{Lu}][\p{L}]+)/iu);
    if (subjM && valid.has(subjM[1])) return subjM[1];
    if (/jehov[áa]/iu.test(frameText)
      && new RegExp(`${WB_L}(habl|dijo|dij|respond|llam)[\\p{L}]*`, 'i').test(frameText)
      && !/(clam|or[oó]|rog|suplic|bendij)[\p{L}]*\s+a\s+jehov[áa]/iu.test(frameText)) return 'Dios';
    const s = detectSayer(frameText, patterns);
    if (s && valid.has(s.speaker) && !s.multi) return s.speaker;
    return null;
  };

  for (const v of verses) {
    const verseNum = v.number;
    const headings = [...(v.headings ?? []), ...(headingsByVerse[String(verseNum)] ?? [])].filter(Boolean);
    let rawText = (v.text ?? '').trim();
    // Encabezado incrustado SpaRVG («Salmo de David.» al inicio del verso, 124 casos
    // solo en PSA): extraer a título Sistema en vez de contaminar el versículo.
    const leadQuote = rawText.match(/^«([^»]+)»\s*([\s\S]*)$/);
    if (leadQuote && leadQuote[2].trim()) {
      headings.unshift(leadQuote[1].trim());
      rawText = leadQuote[2].trim();
    }
    // 1. headings -> títulos Sistema (solo el primero no genérico por verso para no duplicar)
    for (const h of headings) {
      const hid = `${abbr}${chapter}_sec${verseNum}_${createHash('sha1').update(h).digest('hex').slice(0, 4)}`;
      messages.push({ id: hid, speaker: 'Sistema', verse: verseNum, text: h, isSectionTitle: true });
        diagnosis.push({ verse: verseNum, subId: 'h', speaker: 'Sistema', confidence: 0.95, rule: 'heading', ambiguous: false });
    }

    const text = rawText;
    if (!text) continue;
    const cuts = findCuts(text, verbStem, splitFlags);

    if (cuts.length) {
      // narr_0 = text[0:e_1]; luego por cada corte k: speech_k = text[e_k:s_{k+1}],
      // narr_k = text[s_{k+1}:e_{k+1}]. El hablante de speech_k sale de narr_{k-1}.
      subCode = 0;
      const emitNarr = (part) => {
        const p = part.trim();
        if (!p) return '';
        // Cola narrativa final sin verbo (tras la última cita) se fusiona con la
        // burbuja anterior en vez de crear huérfana.
        if (!DICENDI_RE.test(p) && messages.length > verseStart) {
          messages[messages.length - 1].text = `${messages[messages.length - 1].text} ${p}`;
          return prevNarr;
        }
        const sub = nextSub();
        pushMsg(verseNum, sub, 'Narrador', p);
        diagnosis.push({ verse: verseNum, subId: sub, speaker: 'Narrador', confidence: 0.9, rule: 'split-dijo', ambiguous: false });
        lastNarr = { sub, text: p };
        return p;
      };
      let lastSpeech = null;
      let lastSpeechDefault = false;
      let lastNarr = null;
      const carriedBefore = carried;
      const emitSpeech = (part, narrCtx) => {
        const p = part.trim();
        if (!p || p.length < minSpeechLen) return;
        // Solo el SUJETO del verbo dicendi (del narrador precedente) atribuye.
        // Sin sujeto explícito -> default Dios ambiguo (el review corrige).
        const sayer = detectSayer(narrCtx, patterns);
        const speaker = sayer?.speaker ?? 'Dios';
        const confidence = sayer?.confidence ?? 0.6;
        const rule = sayer ? sayer.rule : 'split-default-Dios';
        const ambiguous = !valid.has(speaker) || confidence < 0.8 || !!sayer?.multi;
        const sub = nextSub();
        pushMsg(verseNum, sub, speaker, p);
        diagnosis.push({ verse: verseNum, subId: sub, speaker, confidence, rule, ambiguous });
        if (valid.has(speaker) && speaker !== 'Narrador' && speaker !== 'Sistema') {
          lastSpeech = speaker;
          lastSpeechDefault = !sayer;
        }
      };
      const verseStart = messages.length;
      // Capitaliza narradores que empiezan a mitad de frase ("dijo la mujer:" -> "Dijo la mujer:").
      const capNarr = (p) => p.replace(/^(\s*[«"“']*)(\p{L})/u, (_, pre, c) => pre + c.toLocaleUpperCase('es'));
      let prevNarr = emitNarr(capNarr(text.slice(0, cuts[0].end)));
      for (let k = 0; k < cuts.length; k++) {
        let speechEnd = k + 1 < cuts.length ? cuts[k + 1].start : text.length;
        let speech = text.slice(cuts[k].end, speechEnd);
        // La cola narrativa previa al siguiente verbo ("...egipcio? Entonces Moisés
        // tuvo miedo, y" + "dijo:") pertenece al narrador: se corta en el último
        // fin de frase y el resto viaja con el narrador ("Y dijo la mujer:").
        let carry = '';
        if (k + 1 < cuts.length) {
          const ends = [...speech.matchAll(/[?!.…]["”'»)]?(?=\s|$)/gu)];
          if (ends.length) {
            const cutAt = (ends[ends.length - 1].index ?? 0) + ends[ends.length - 1][0].length;
            carry = speech.slice(cutAt).trimStart();
            speech = speech.slice(0, cutAt);
          }
        }
        emitSpeech(speech, prevNarr);
        if (k + 1 < cuts.length) {
          prevNarr = emitNarr(capNarr(carry + text.slice(cuts[k + 1].start, cuts[k + 1].end)));
        }
      }
      // La voz del último discurso identificado queda activa para los versos
      // siguientes sin marco. Un default-Dios no pisa una voz humana activa
      // (el review decide el discurso; la voz sigue).
      if (lastSpeech && !lastSpeechDefault) carried = lastSpeech;
      else if (lastSpeechDefault && carriedBefore && carriedBefore !== 'Dios' && valid.has(carriedBefore)
        && lastNarr && /:\s*$/.test(lastNarr.text) && !resolveIntro(lastNarr.text) && looksSpeech(lastNarr.text)) {
        // Marco con discurso propio + discurso sin hablante en contexto de voz
        // humana activa: el marco es discurso transmitido de esa voz
        // (Jos 1:11a = orden de Josué; "Y dijo al pueblo:" sigue Narrador;
        // el 11b queda a revisión como hasta ahora).
        const di = diagnosis.findLastIndex(d => d.verse === verseNum && d.subId === lastNarr.sub);
        const entry = { verse: verseNum, subId: lastNarr.sub, speaker: carriedBefore, confidence: 0.6, rule: 'frame-carryover', ambiguous: true };
        if (di >= 0) diagnosis[di] = entry;
        else diagnosis.push(entry);
        const msg = messages.find(m => m.id === `${abbr}${chapter}_${verseNum}${lastNarr.sub}`);
        if (msg) msg.speaker = carriedBefore;
        carried = carriedBefore;
      } else if (/:\s*$/.test(text) && DICENDI_RE.test(text)) {
        // Marco puro al final del verso ("...diciendo:" sin discurso propio):
        // fija la voz activa (Jos 1:1 -> Dios, Jos 1:10 -> Josué). Si el marco
        // no resuelve hablante pero hay voz activa, el marco mismo es discurso
        // transmitido (Jos 1:11a = orden de Josué a los oficiales).
        const introSpk = resolveIntro(prevNarr);
        if (introSpk) carried = introSpk;
        const useSpk = introSpk ?? carried;
        // Solo si el marco mismo trae discurso (imperativo/marcas); un marco
        // narrativo puro ("Y ellos respondieron:") sigue siendo Narrador.
        if (useSpk && valid.has(useSpk) && looksSpeech(text)) {
          const lastMsg = messages[messages.length - 1];
          const sub = (lastMsg.id.match(/_(\d+)([a-z0-9]*)$/) ?? [])[2] ?? '';
          lastMsg.speaker = useSpk;
          // Re-etiqueta la entrada split-dijo original en vez de duplicarla.
          const entry = { verse: verseNum, subId: sub, speaker: useSpk, confidence: 0.6, rule: introSpk ? 'speech-intro' : 'frame-carryover', ambiguous: true };
          const di = diagnosis.findLastIndex(d => d.verse === verseNum && d.subId === sub);
          if (di >= 0) diagnosis[di] = entry;
          else diagnosis.push(entry);
        }
      }
    } else if (/:\s*$/.test(text) && DICENDI_RE.test(text)) {
      // Verso-marco puro ("...diciendo:"): fija la voz activa (ver resolveIntro).
      const introSpk = resolveIntro(text);
      if (introSpk) carried = introSpk;
      const useSpk = introSpk ?? carried;
      if (looksSpeech(text) && useSpk && valid.has(useSpk)) {
        // El marco mismo es discurso citado (orden transmitida: Jos 1:11a =
        // orden de Josué a los oficiales vía "Josué mandó... diciendo:").
        pushMsg(verseNum, '', useSpk, text);
        diagnosis.push({ verse: verseNum, subId: '', speaker: useSpk, confidence: 0.6, rule: introSpk ? 'speech-intro' : 'frame-carryover', ambiguous: true });
      } else {
        pushMsg(verseNum, '', 'Narrador', text);
        diagnosis.push({ verse: verseNum, subId: '', speaker: 'Narrador', confidence: 0.55, rule: 'fallback-narrator', ambiguous: false });
      }
    } else {
      const hit = detectSpeechSpeaker(text, patterns);
      if (hit && valid.has(hit.speaker)) {
        // Verso narrado que menciona a alguien no implica discurso; solo citas en 1ª persona o “dijo a X:” ya cubiertas.
        // Si el verso es pregunta/cita directa (¿...? / ¡...! / “...”), atribuir; si no, Narrador.
        const looksQuoted = /^[¿¡"“]/.test(text) || /[?!”"]\s*$/.test(text);
        if (looksQuoted) {
          // Mención ≠ hablante (RUT 1:13/21 mencionan a Jehová pero habla Noemí;
          // "llamaréis" no es verbo dicendi aunque case con llam-). La atribución
          // por mención sin corte siempre va a revisión (capa 0.75); los casos
          // genuinos ("dijo Dios:" etc.) ya salieron por la vía de cortes.
          const confidence = Math.min(hit.confidence, 0.75);
          const ambiguous = true;
          pushMsg(verseNum, '', hit.speaker, text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: hit.speaker, confidence, rule: hit.rule, ambiguous });
        } else if (carried && valid.has(carried) && looksSpeech(text)) {
          // Continuación del discurso abierto por el marco previo (Jos 1:2-9).
          // Sin marcas de discurso se asume interludio narrativo (rompe la voz).
          pushMsg(verseNum, '', carried, text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: carried, confidence: 0.6, rule: 'speech-carryover', ambiguous: true });
        } else if (carried === 'Dios' && valid.has('Dios') && !NARRSTART_RE.test(text)) {
          // En contexto de discurso divino, un verso sin marcas puede ser
          // continuación (Ex 9:4) o interludio narrativo: va a revisión en
          // vez de perderse en silencio. La voz sigue activa. Los arranques
          // de acción ("Y vio Dios...") siguen siendo Narrador en silencio.
          pushMsg(verseNum, '', 'Dios', text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: 'Dios', confidence: 0.5, rule: 'speech-carryover-divine', ambiguous: true });
        } else {
          if (!DICENDI_RE.test(text)) carried = null;
          pushMsg(verseNum, '', 'Narrador', text);
          diagnosis.push({ verse: verseNum, subId: '', speaker: 'Narrador', confidence: 0.55, rule: 'fallback-narrator', ambiguous: false });
        }
      } else if (carried && valid.has(carried) && looksSpeech(text)) {
        pushMsg(verseNum, '', carried, text);
        diagnosis.push({ verse: verseNum, subId: '', speaker: carried, confidence: 0.6, rule: 'speech-carryover', ambiguous: true });
      } else if (carried === 'Dios' && valid.has('Dios') && !NARRSTART_RE.test(text)) {
        pushMsg(verseNum, '', 'Dios', text);
        diagnosis.push({ verse: verseNum, subId: '', speaker: 'Dios', confidence: 0.5, rule: 'speech-carryover-divine', ambiguous: true });
      } else {
        if (!DICENDI_RE.test(text)) carried = null;
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
    // Discurso continuado: verso que TERMINA en ':' ("respondió Elifaz, y dijo:",
    // JOB 4:1) cuyo siguiente NO tiene cortes → el siguiente queda como Narrador
    // aunque sea discurso. También verso con ':' medio sin cortes propios ni del
    // siguiente (RUT 1:8b). Revisar a mano.
    const cutVerses = new Set(verses.filter(v => findCuts(v.text ?? '', patterns.splits[0].verbStem, patterns.splits[0].flags ?? 'i').length).map(v => v.number));
    const dangling = verses.filter(v => {
      const t = v.text ?? '';
      if (!cutVerses.has(v.number + 1)) {
        if (/:\\s*$/.test(t)) return true;
        if (/:/.test(t) && !cutVerses.has(v.number)) return true;
      }
      return false;
    }).map(v => v.number);
    if (dangling.length) console.log(`# AVISO posible discurso continuado tras versos ${dangling.join(', ')} — verificar speaker del verso siguiente`);
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
