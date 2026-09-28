/**
 * REGRESION: replay de los tres subtipos sobre el corpus PUBLICADO.
 *
 * El gateway no está disponible, así que no se puede re-ingerir el corpus
 * entero. Lo que sí se puede — y es lo que importa — es comprobar que las
 * reglas nuevas NO rompen los turnos ya revisados: se reprocesa cada verso del
 * corpus publicado como si fuera entrada fresca y se verifica que
 *
 *   a) ningún mensaje de DIOS contiene ya la cola narrativa que se partió, ni
 *      el texto de un personaje que cita a Dios, ni el propósito con infinitivo;
 *   b) el texto de cada verso se recompone a nivel letras (nada se pierde);
 *   c) los ids siguen siendo únicos y en orden de versículo.
 * Es un guard de no-regresión, no una verificación de la ingesta completa: la
 * diferencia real solo se ve con el gateway (ALETHEIA_GATEWAY=... pnpm
 * qa:sweep), que compara el dry-run contra la fuente.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { attributeChapter, splitClimax } from './run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const DATA = join(ROOT, 'public', 'data');
const patterns = JSON.parse(readFileSync(join(HERE, 'patterns.es.json'), 'utf8'));
const participants = JSON.parse(readFileSync(join(HERE, 'participants.json'), 'utf8'));

const letras = (s) => (s ?? '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

function* capitulos() {
  for (const book of readdirSync(DATA)) {
    const dir = join(DATA, book);
    if (!existsSync(join(dir, '1.json'))) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.json')) yield { book, chapter: Number(f.replace('.json', '')), path: join(dir, f) };
    }
  }
}

describe('run.mjs: splitClimax cubre la cola con propósito', () => {
  it('parte la cola de GEN 4:15 (infinitivo de propósito)', () => {
    const r = splitClimax('Ciertamente que cualquiera que matare a Caín, siete veces será castigado. Entonces Jehová puso señal en Caín, para que no lo matase cualquiera que le hallara.');
    assert.equal(r.quote, 'Ciertamente que cualquiera que matare a Caín, siete veces será castigado.');
    assert.equal(r.tail, 'Entonces Jehová puso señal en Caín, para que no lo matase cualquiera que le hallara.');
  });

  it('NO parte el "para que" de un hablante (Reporting Clause, GEN 28:4)', () => {
    // Isaac recita la bendición: "para que heredes" es suyo, el sujeto va al
    // final. Ninguna pieza de la firma (conectivo + 3ª + verbo + propósito)
    // aparece, así que la cola no se toca.
    assert.equal(splitClimax('Y te dé la bendición de Abraham, y a tu simiente contigo, para que heredes la tierra de tus peregrinaciones, que Dios dio a Abraham.'), null);
  });

  it('NO parte "para que" en 2ª persona dentro de discurso divino', () => {
    // LEG 11 y compañía: el "para que comáis" es del hablante y el sujeto no
    // está en 3ª antes del verbo, así que no hay cola que separar.
    assert.equal(splitClimax('Estos son los animales que comeréis de todos los animales que están sobre la tierra.'), null);
    assert.equal(splitClimax('Ninguna grosura de buey, ni de cordero, ni de cabra, comeréis; la|AL 소프트웨어.'), null);
  });

  it('sigue cortando la cola de clímax clásica (GEN 1)', () => {
    assert.deepEqual(splitClimax('Sea la luz; y fue la luz.'), { quote: 'Sea la luz.', tail: 'y fue la luz.' });
  });

  it('sigue descartando la narración dentro de la cita', () => {
    assert.equal(splitClimax('Date prisa, aligera, no te detengas. Y el muchacho de Jonatán tomó las saetas, y vino a su señor.'), null);
  });
});

describe('run.mjs: replay del corpus publicado', () => {
  it('ningún turno de DIOS arrastra cola narrativa, cita ajena o propósito', () => {
    // Las tres firmas de los fixes de este cambio, aplicadas sobre el texto
    // que el corpus ya tiene publicado.
    const COLA_PURPOSITO = /^(?:Entonces|Mas|Pero)\s+(?:Jehová|Dios|el Señor)\s+(?:puso|señal\w+|dio|hizo|estableció|marcó|selló|pintó|colocó|levantó|arrojó|echó|metió)\b[^.;]*\bpara que\b/i;
    const CITA_A_DIOS = /^(?:Pero|Mas)\s+[^.;:]{0,90}?\b(?:dijo|dice|habló)\s+(?:Jehová\s+)?(?:Dios|el Señor)\s*:/i;
    const culpables = [];
    for (const { path } of capitulos()) {
      for (const m of JSON.parse(readFileSync(path, 'utf8')).messages) {
        if (m.isSectionTitle) continue;
        if (m.speaker === 'Narrador' || m.speaker === 'Sistema') continue;
        const t = m.text.trim();
        if (COLA_PURPOSITO.test(t)) culpables.push(`${m.id} cola-proposito`);
        if (m.speaker === 'Dios' && CITA_A_DIOS.test(t)) culpables.push(`${m.id} cita-ajena`);
      }
    }
    assert.deepEqual(culpables, []);
  });

  it('los dos casos canónicos salen bien desde el texto de entrada', () => {
    // Se reprocesa el verso TAL COMO ESTÁ en el corpus, como entrada del
    // dry-run, y se comprueba que la atribución sale bien.
    const gen3 = attributeChapter({
      verses: [
        { number: 1, text: 'Pero la serpiente era astuta, más que todos los animales del campo que Jehová Dios había hecho; la cual dijo a la mujer:' },
        { number: 2, text: 'Y la mujer respondió a la serpiente: Del fruto de los árboles del huerto podemos comer;' },
        { number: 3, text: 'Pero del fruto del árbol que está en medio del huerto dijo Dios: No comeréis de él, ni le tocaréis, para que no muráis.' },
      ],
      slug: 'genesis', chapter: 3, patterns, participants,
    });
    const v3 = gen3.messages.filter((m) => m.verse === 3 && !m.isSectionTitle);
    // v.3 no debe abrir burbuja de DIOS: es la mujer recitando a Dios.
    assert.ok(v3.every((m) => m.speaker !== 'Dios'), 'el v.3 no debe atribuirse a Dios');

    const gen4 = attributeChapter({
      verses: [
        { number: 15, text: 'Y le respondió Jehová: Ciertamente que cualquiera que matare a Caín, siete veces será castigado. Entonces Jehová puso señal en Caín, para que no lo matase cualquiera que le hallara.' },
      ],
      slug: 'genesis', chapter: 4, patterns, participants,
    });
    const v15 = gen4.messages.filter((m) => m.verse === 15 && !m.isSectionTitle);
    assert.equal(v15.filter((m) => m.speaker === 'Dios').length, 1, 'solo el decreto es de Dios');
    assert.equal(v15.at(-1).speaker, 'Narrador', 'la señal vuelve al narrador');
    assert.match(v15.at(-1).text, /^Entonces Jehová puso señal/);
  });

  it('el replay de un capítulo no pierde letras ni duplica ids', () => {
    // Reingesta los versículos de cada capítulo desde el texto publicado y
    // compara a nivel letras. Puede haber diferencias de puntuación por el
    // re-punteo de los desdobles, que es lo que hace splitClimax; lo que NO
    // puede pasar es perder texto o duplicar identificadores.
    const letrasPerdidas = [];
    const idsDup = [];
    for (const { book, chapter, path } of capitulos()) {
      const data = JSON.parse(readFileSync(path, 'utf8'));
      const versiculos = new Map();
      for (const m of data.messages) {
        if (m.isSectionTitle) continue;
        if (!versiculos.has(m.verse)) versiculos.set(m.verse, []);
        versiculos.get(m.verse).push(m.text);
      }
      const verses = [...versiculos.entries()].map(([number, parts]) => ({ number, text: parts.join(' ') }));
      const { messages } = attributeChapter({ verses, slug: book, chapter, patterns, participants });
      const vistos = new Set();
      for (const m of messages) {
        if (vistos.has(m.id)) idsDup.push(m.id);
        vistos.add(m.id);
      }
      // El corpus ya viene partido; el dry-run puede volver a partirlo o a
      // fusionarlo, así que solo se exige que no pierda letras el verso COMPLETO.
      for (const [number, parts] of versiculos) {
        const out = messages.filter((m) => m.verse === number && !m.isSectionTitle).map((m) => m.text).join(' ');
        if (letras(out) !== letras(parts.join(' '))) {
          letrasPerdidas.push(`${book} ${chapter}:${number}`);
        }
      }
    }
    assert.deepEqual(idsDup, []);
    assert.deepEqual(letrasPerdidas, []);
  });
});
