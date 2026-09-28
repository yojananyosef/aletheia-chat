// node --test scripts/attribute-speakers/qa-sweep.test.mjs
// Verifica el sweep de integridad del corpus SIN la fuente del gateway: schema,
// ids únicos y vocabulario. Necesario porque qa-sweep degrada a "sinFuente" si
// el gateway no está presente, y sin esto no habría red de seguridad.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const DATA = join(ROOT, 'public', 'data');

const participants = JSON.parse(readFileSync(join(HERE, 'participants.json'), 'utf8'));

const SYST = new Set(['Sistema']);

function* chapters() {
  for (const book of readdirSync(DATA)) {
    const dir = join(DATA, book);
    if (!existsSync(join(dir, '1.json'))) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.json')) yield { book, file: f, path: join(dir, f) };
    }
  }
}

describe('corpus: integridad', () => {
  it('todos los capítulos parsean y cumplen el schema mínimo', () => {
    const ids = new Set();
    let n = 0;
    for (const { book, path } of chapters()) {
      const data = JSON.parse(readFileSync(path, 'utf8'));
      assert.ok(typeof data.book === 'string', `${book}: falta book`);
      assert.ok(Number.isFinite(data.chapter), `${book}: chapter inválido`);
      assert.ok(Array.isArray(data.messages) && data.messages.length, `${book}: messages vacío`);
      for (const m of data.messages) {
        assert.ok(m.id && typeof m.id === 'string', `${book}: id inválido`);
        assert.ok(!ids.has(m.id), `id duplicado: ${m.id}`);
        ids.add(m.id);
        assert.ok(m.speaker && typeof m.speaker === 'string', `${m.id}: speaker vacío`);
        assert.ok(Number.isFinite(m.verse), `${m.id}: verse inválido`);
        assert.ok(typeof m.text === 'string' && m.text.length, `${m.id}: texto vacío`);
        n++;
      }
    }
    assert.ok(n > 30000, `mensajes inesperados: ${n}`);
  });

  it('todo speaker está en el vocabulario cerrado de su libro', () => {
    const fuera = [];
    for (const { book, path } of chapters()) {
      const vocab = new Set(participants[book] ?? participants._default);
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        if (SYST.has(m.speaker)) continue;
        if (!vocab.has(m.speaker)) fuera.push(`${m.id}=${m.speaker}`);
      }
    }
    assert.deepEqual(fuera, []);
  });

  it('el orden de los mensajes respeta el número de versículo', () => {
    for (const { book, path } of chapters()) {
      let prev = 0;
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        assert.ok(m.verse >= prev, `${book}: verso ${m.verse} va antes que ${prev} (${m.id})`);
        prev = m.verse;
      }
    }
  });
});

describe('corpus: la cola de clímax pertenece al narrador', () => {
  // Regresión de Génesis 1: "Sea la luz; y fue la luz." es discurso de Dios
  // seguido de narración, no un solo turno de habla.
  it('ningún turno de habla termina en la fórmula de narración', () => {
    const culpables = [];
    for (const { path } of chapters()) {
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        if (m.isSectionTitle) continue;
        if (m.speaker === 'Narrador' || m.speaker === 'Sistema') continue;
        if (/[.;]\s*Y fue as[ií]\.$/.test(m.text.trim())) culpables.push(`${m.id}=${m.speaker}`);
      }
    }
    assert.deepEqual(culpables, []);
  });

  it('GEN 1: los seis desdobles están aplicados', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '1.json'), 'utf8'));
    const porVerso = new Map();
    for (const m of cap.messages) {
      if (m.isSectionTitle) continue;
      if (!porVerso.has(m.verse)) porVerso.set(m.verse, []);
      porVerso.get(m.verse).push(m);
    }
    for (const v of [3, 9, 11, 15, 24, 30]) {
      const ms = porVerso.get(v);
      assert.ok(ms.length >= 2, `v.${v} debería estar desdoblado`);
      const cola = ms[ms.length - 1];
      assert.equal(cola.speaker, 'Narrador', `v.${v}: la cola debe ser Narrador`);
      assert.match(cola.text, /^Y fue/, `v.${v}: texto de cola inesperado: ${cola.text}`);
    }
    // v.3 exacto, que es el caso que motivationsó el cambio
    assert.deepEqual(
      porVerso.get(3).map((m) => m.speaker),
      ['Narrador', 'Dios', 'Narrador'],
    );
    assert.deepEqual(
      porVerso.get(3).map((m) => m.text),
      ['Y dijo Dios:', 'Sea la luz.', 'Y fue la luz.'],
    );
  });

  it('GEN 1: no se perdió ni una letra al desdoblar', () => {
    // El texto fuente del gateway, verso por verso, tal como estaba ANTES de
    // desdoblar. Se compara por letras porque el desdoblado re-puntúa (el "; "
    // entre cita y cola pasa a "." al quedar en burbujas separadas).
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '1.json'), 'utf8'));
    const letras = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const fuente = {
      1: 'En el principio creó Dios el cielo y la tierra.',
      2: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.',
      3: 'Y dijo Dios: Sea la luz; y fue la luz.',
      4: 'Y vio Dios que la luz era buena y separó Dios la luz de las tinieblas.',
      5: 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana el primer día.',
      6: 'Y dijo Dios: Haya un firmamento en medio de las aguas, y separe las aguas de las aguas.',
      7: 'E hizo Dios el firmamento, y apartó las aguas que estaban debajo del firmamento, de las aguas que estaban sobre el firmamento. Y fue así.',
      8: 'Y llamó Dios al firmamento Cielos. Y fue la tarde y la mañana el segundo día.',
      9: 'Y dijo Dios: Júntense las aguas que están debajo de los cielos en un lugar, y descúbrase lo seco. Y fue así.',
      10: 'Y llamó Dios a lo seco Tierra, y a la reunión de las aguas llamó Mares. Y vio Dios que era bueno.',
      11: 'Y dijo Dios: Produzca la tierra hierba verde, hierba que dé semilla; árbol de fruto que dé fruto según su género, que su semilla esté en él, sobre la tierra. Y fue así.',
    };
    for (const [v, t] of Object.entries(fuente)) {
      const juntos = cap.messages
        .filter((x) => x.verse === Number(v) && !x.isSectionTitle)
        .map((x) => x.text).join(' ');
      assert.equal(letras(juntos), letras(t), `v.${v}: el texto no cuadra`);
    }
  });
});
