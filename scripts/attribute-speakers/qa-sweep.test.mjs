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

describe('corpus: el mandato del Génesis 2 es palabra de Dios', () => {
  // Regresión de Génesis 2:16-17. "Y mandó Jehová Dios al hombre, diciendo:" es un
  // marco de narración, pero lo que viene tras los dos puntos es el decreto
  // divino (el mandato de comer y la prohibición del árbol), igual que
  // "Y dijo Dios:" en Génesis 1:26. El v.17 no lleva marco porque continúa el
  // discurso abierto en el v.16 (mismo criterio que GEN 1:29b -> 1:30a).
  const porVerso = (book, chapter) => {
    const cap = JSON.parse(readFileSync(join(DATA, book, `${chapter}.json`), 'utf8'));
    const out = new Map();
    for (const m of cap.messages) {
      if (m.isSectionTitle) continue;
      if (!out.has(m.verse)) out.set(m.verse, []);
      out.get(m.verse).push(m);
    }
    return out;
  };

  it('GEN 2: el marco queda en Narrador y el decreto en Dios', () => {
    const g2 = porVerso('genesis', 2);
    assert.deepEqual(
      g2.get(16).map((m) => [m.id, m.speaker]),
      [['g2_16a', 'Narrador'], ['g2_16b', 'Dios']],
    );
    assert.deepEqual(
      g2.get(16).map((m) => m.text),
      ['Y mandó Jehová Dios al hombre, diciendo:', 'De todo árbol del huerto libremente podrás comer;'],
    );
    assert.deepEqual(g2.get(17).map((m) => m.speaker), ['Dios'], 'v.17 continua el mandato de Dios');
  });

  it('GEN 2: no se perdió ni una letra al desdoblar v.16-17', () => {
    const g2 = porVerso('genesis', 2);
    const letras = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const fuente = {
      16: 'Y mandó Jehová Dios al hombre, diciendo: De todo árbol del huerto libremente podrás comer;',
      17: 'pero del árbol del conocimiento del bien y el mal no comerás; porque el día que de él comieres, ciertamente morirás.',
    };
    for (const [v, t] of Object.entries(fuente)) {
      const juntos = g2.get(Number(v)).map((m) => m.text).join(' ');
      assert.equal(letras(juntos), letras(t), `v.${v}: el texto no cuadra`);
    }
  });

  it('corpus: ningún marco "diciendo:" sin desdoblar queda en un turno del narrador', () => {
    // El mismo fallo de Génesis 2:16, sistematicamente. Un turno de Narrador
    // que TODAVIA contiene la cita tras los dos puntos debe estar desdoblado
    // (marco Narrador + voz del hablante). Un caso nuevo debe romper esto.
    //
    // HEB 4:7b es la única excepción, y es correcta: "como está dicho: Si
    // oyereis hoy su voz..." cita el Salmo 95:8 dentro de la reflexión del
    // autor, igual que 4:4b y 4:5, que el corpus también deja en Narrador
    // porque ahí quien habla es el Salmo, no un personaje de la escena.
    const EXCEPTO = new Map([['heb4_7b', 'cita del Salmo 95:8 en la reflexión del autor']]);
    const culpables = [];
    for (const { path } of chapters()) {
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        if (m.isSectionTitle || m.speaker !== 'Narrador') continue;
        if (EXCEPTO.has(m.id)) continue;
        if (/(?:diciendo|dicho|dici\u00f3|habl\u00f3)\s*:\s*\S/u.test(m.text)) culpables.push(`${m.id} :: ${m.text}`);
      }
    }
    assert.deepEqual(culpables, []);
  });

  it('las excepciones del barrido siguen siendo las documentadas', () => {
    // Si alguien reintroduce un caso "arreglado", la excepción debe quitarse
    // también: aquí se verifica que HEB 4:7b sigue siendo el único que queda.
    const cap = JSON.parse(readFileSync(join(DATA, 'hebreos', '4.json'), 'utf8'));
    const b = cap.messages.find((m) => m.id === 'heb4_7b');
    assert.equal(b.speaker, 'Narrador');
    assert.match(b.text, /como est\u00e1 dicho:/);
  });
});

describe('corpus: citar a Dios no es hablar como Dios', () => {
  // Regresión de Génesis 3:3. "Pero del fruto del árbol que está en medio
  // del huerto dijo Dios: No comeréis de él..." es la MUJER recitando la
  // prohibición a la serpiente, no una aparición de Dios en el diálogo. En el
  // hebreo (TM) el v.3 abre vayyōmer ha-ʾiššâ — la mujer es el sujeto — y el
  // "dijo Dios" va dentro de su turno, sin reentrada del narrador.
  //
  // La regla ya se aplicaba bien dos versículos antes: en el v.1 la serpiente
  // cita a Dios ("¿Conque Dios os ha dicho: No comáis...?") y la cita queda
  // dentro de la burbuja de la Serpiente. El v.3 rompía esa misma regla.
  //
  // La firma que lo delata en cualquier capítulo: un marco del Narrador que
  // (a) arranca con conectivo, (b) no trae sujeto narrativo propio,
  // (c) está pegado al turno de un personaje, y (d) salta a DIOS. El corpus
  // tiene 39 marcos "dijo Dios:" y solo este los cumplía los cuatro.
  it('GEN 3: el v.3 es la Mujer citando a Dios, no una intervención de Dios', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '3.json'), 'utf8'));
    const v3 = cap.messages.filter((m) => m.verse === 3 && !m.isSectionTitle);
    assert.deepEqual(v3.map((m) => m.id), ['g3_3'], 'v.3 debe ser un turno único');
    assert.equal(v3[0].speaker, 'Mujer');
    assert.match(v3[0].text, /^pero del fruto/, 'continúa la frase abierta en el v.2');
    assert.match(v3[0].text, /dijo Dios: No comeréis/, 'la cita a Dios va dentro de su turno');
  });

  it('GEN 3: v.1-v.4 el diálogo es serpiente ↔ mujer, sin Dios en escena', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '3.json'), 'utf8'));
    const voces = new Map();
    for (const m of cap.messages) {
      if (m.verse > 4 || m.verse < 1 || m.isSectionTitle) continue;
      if (!voces.has(m.verse)) voces.set(m.verse, []);
      voces.get(m.verse).push(m.speaker);
    }
    assert.deepEqual(voces.get(1), ['Narrador', 'Serpiente']);
    assert.deepEqual(voces.get(2), ['Narrador', 'Mujer']);
    assert.deepEqual(voces.get(3), ['Mujer']);
    assert.deepEqual(voces.get(4), ['Narrador', 'Serpiente']);
    // Dios no reaparece hasta el v.8, cuando ya se pasea en el huerto.
    const conDios = cap.messages.filter((m) => m.speaker === 'Dios' && m.verse < 8);
    assert.deepEqual(conDios, [], 'Dios no debe hablar antes del v.8');
  });

  it('GEN 3: no se perdió ni una letra al fundir v.3', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '3.json'), 'utf8'));
    const letras = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const juntos = cap.messages
      .filter((m) => m.verse === 3 && !m.isSectionTitle)
      .map((m) => m.text).join(' ');
    const fuente = 'Pero del fruto del árbol que está en medio del huerto dijo Dios: '
      + 'No comeréis de él, ni le tocaréis, para que no muráis.';
    assert.equal(letras(juntos), letras(fuente), 'v.3: el texto no cuadra');
  });

  it('corpus: un personaje que cita a Dios no genera una burbuja de Dios', () => {
    // La firma de GEN 3:3, que es lo único que la distingue de los marcos
    // legítimos: el turno PREVIO es de un personaje, no del narrador. El
    // narrador no reentra, no hay aparición de Dios, la cita va dentro del
    // turno del personaje.
    //
    // No se confunde con los marcos válidos, que son de otra forma:
    //   EZK 34:17a "Mas vosotras, ovejas mías, así dice Jehová el Señor:"
    //     -> el turno previo es de Dios y el marco abre con vocativo: le
    //        habla a su rebaño, sí es palabra divina.
    //   PSA 50:16a "Pero al malo dijo Dios:"
    //     -> el turno previo es de Dios y el narrador (Asaph) introduce la
    //        cita; la burbuja de Dios es correcta.
    const CITA = /(?:dijo|dice|habl\u00f3)\s+(?:Jehov\u00e1\s+)?(?:Dios|el Se\u00f1or)\s*:/;
    const personajes = (s) => !['Narrador', 'Dios', 'Sistema', 'Serpiente'].includes(s);
    const culpables = [];
    for (const { path } of chapters()) {
      const ms = JSON.parse(readFileSync(path, 'utf8')).messages;
      for (let i = 1; i < ms.length; i++) {
        if (ms[i].speaker !== 'Dios') continue;
        if (!personajes(ms[i - 1].speaker)) continue;
        if (!/^(?:Pero|Mas)\s/.test(ms[i - 1].text)) continue;
        if (CITA.test(ms[i - 1].text)) culpables.push(`${ms[i - 1].id} (${ms[i - 1].speaker}) -> ${ms[i].id} :: ${ms[i - 1].text}`);
      }
    }
    assert.deepEqual(culpables, []);
  });
});

describe('corpus: el propósito con infinitivo cierra el discurso', () => {
  // Regresión de Génesis 4:15. "Ciertamente que cualquiera que matare a
  // Caín, siete veces será castigado. Entonces Jehová puso señal en Caín,
  // para que no lo matase cualquiera que le hallara." estaba entero en la
  // burbuja de DIOS, pero solo la primera oración es divina.
  //
  // El hebreo (TM) lo decide sin ambigüedad:
  //   wayyōmer-lō YHWH        "y dijo Jehová a él"    -> marco
  //   miyyēn ... yāšaq        "siete veces será..."   -> discurso
  //   wayyāśəm YHWH śîmēn     "y puso Jehová señal"   -> NARRACIÓN
  //     ʿal-Qayîn              wayyiqtol, 3ª preterito
  //   ləballōt hakkēh-ʾōṯô   "para que no lo matase" -> NARRACIÓN
  //     limṣāʾô                INFINITIVO lə-: no puede haber infinitivo
  //                           dentro de discurso directo
  //
  // Es el mismo subtipo que la cola de clímax de Génesis 1 ("Sea la luz; y
  // fue la luz"), pero con propósito en vez de fórmula de cierre: por eso
  // run.mjs:splitClimax —que solo corta "y fue así"— no lo cubría.
  const COLA = new RegExp(
    '(?:^|(?<=[.;])\\s+)'
    + '(?:Entonces\\s+)?'
    + '(?:Jehov\u00e1|Dios|el Se\u00f1or)\\s+'
    + '(?:puso|se\u00f1al|dio|hizo|estableci\u00f3|pondr\u00e1)\\b',
    'u',
  );
  const PROPOSITO = /\bpara que no\b/;

  it('GEN 4: el v.15 se parte en decreto divino y acción narrativa', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '4.json'), 'utf8'));
    const v15 = cap.messages.filter((m) => m.verse === 15 && !m.isSectionTitle);
    assert.deepEqual(v15.map((m) => m.id), ['g4_15a', 'g4_15b', 'g4_15c']);
    assert.deepEqual(v15.map((m) => m.speaker), ['Narrador', 'Dios', 'Narrador']);
    assert.equal(v15[1].text, 'Ciertamente que cualquiera que matare a Caín, siete veces será castigado.');
    assert.match(v15[2].text, /^Entonces Jehová puso se\u00f1al en Ca\u00edn, para que no/);
  });

  it('GEN 4: no se perdió ni una letra al desdoblar v.15', () => {
    const cap = JSON.parse(readFileSync(join(DATA, 'genesis', '4.json'), 'utf8'));
    const letras = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const juntos = cap.messages
      .filter((m) => m.verse === 15 && !m.isSectionTitle)
      .map((m) => m.text).join(' ');
    const fuente = 'Y le respondió Jehová: Ciertamente que cualquiera que matare a Caín, '
      + 'siete veces será castigado. Entonces Jehová puso señal en Caín, para que no lo '
      + 'matase cualquiera que le hallara.';
    assert.equal(letras(juntos), letras(fuente), 'v.15: el texto no cuadra');
  });

  it('corpus: ninguna burbuja de habla contiene una cola con propósito', () => {
    const culpables = [];
    for (const { path } of chapters()) {
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        if (m.speaker === 'Narrador' || m.speaker === 'Sistema' || m.isSectionTitle) continue;
        const hit = COLA.exec(m.text);
        if (!hit || !PROPOSITO.test(m.text)) continue;
        culpables.push(`${m.id}=${m.speaker} :: ...${m.text.slice(hit.index).trim().slice(0, 80)}`);
      }
    }
    assert.deepEqual(culpables, []);
  });
});
