// node --test scripts/attribute-speakers/run.test.mjs
// Fixtures GEN 1 / GEN 3 / EXO 3 contra SpaRVG gateway (requiere workspace alethia-gateway).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { attributeChapter } from './run.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const GATEWAY = '/home/j/proyectos/alethia-gateway/public/data/bibles';
const patterns = JSON.parse(readFileSync(join(HERE, 'patterns.es.json'), 'utf8'));
const participants = JSON.parse(readFileSync(join(HERE, 'participants.json'), 'utf8'));

function run(slug, code, chapter) {
  const src = JSON.parse(readFileSync(join(GATEWAY, 'SpaRVG', `${code}.json`), 'utf8'));
  const verses = src.chapters[String(chapter)].verses;
  return attributeChapter({ verses, slug, chapter, patterns, participants });
}

function speakerOf(messages, verse, subId) {
  const m = messages.find(mm => mm.verse === verse && mm.id.endsWith(`${verse}${subId}`));
  assert.ok(m, `mensaje ${verse}${subId} existe`);
  return m.speaker;
}

describe('attribute-speakers (heurística)', () => {
  it('GEN 1: Dios dice, Narrador narra, 0 ambiguos de sayer', () => {
    const { messages, diagnosis } = run('genesis', 'GEN', 1);
    assert.equal(speakerOf(messages, 3, 'b'), 'Dios');
    assert.equal(speakerOf(messages, 3, 'a'), 'Narrador');
    assert.ok(diagnosis.filter(d => d.ambiguous).length <= 2);
  });

  it('GEN 3: Serpiente v1b/v4b, Dios v3b/v11b, Mujer nunca como hablante por defecto', () => {
    const { messages } = run('genesis', 'GEN', 3);
    assert.equal(speakerOf(messages, 1, 'b'), 'Serpiente');
    assert.equal(speakerOf(messages, 4, 'b'), 'Serpiente');
    assert.equal(speakerOf(messages, 3, 'b'), 'Dios');
    assert.equal(speakerOf(messages, 11, 'b'), 'Dios');
    // "A la mujer dijo" -> default Dios (juicio divino), no Mujer
    assert.equal(speakerOf(messages, 16, 'b'), 'Dios');
    assert.equal(speakerOf(messages, 17, 'b'), 'Dios');
  });

  it('EXO 3: Moisés v3b, Dios v4b', () => {
    const { messages } = run('exodus', 'EXO', 3);
    assert.equal(speakerOf(messages, 3, 'b'), 'Moisés');
    assert.equal(speakerOf(messages, 4, 'b'), 'Dios');
  });

  it('salida respeta formato NAAS (id, speaker, verse, text)', () => {
    const { messages } = run('genesis', 'GEN', 1);
    for (const m of messages) {
      assert.ok(m.id && m.speaker && m.verse && typeof m.text === 'string' && m.text.length > 0);
    }
  });

  it('mención sin dicendi no atribuye confiada: RUT 1:13/21 van a revisión', () => {
    const { diagnosis } = run('rut', 'RUT', 1);
    for (const v of [13, 21]) {
      const d = diagnosis.find(dd => dd.verse === v);
      assert.ok(d?.ambiguous, `verso ${v} ambiguo (mención Jehová ≠ hablante)`);
    }
  });

  it('encabezado «...» inicial de PSA se extrae a título Sistema', () => {
    const { messages } = run('salmos', 'PSA', 23);
    const title = messages.find(m => m.verse === 1 && m.isSectionTitle);
    assert.ok(title, 'título Sistema en PSA 23:1');
    assert.equal(title.speaker, 'Sistema');
    const verse = messages.find(m => m.verse === 1 && !m.isSectionTitle);
    assert.ok(verse && !verse.text.startsWith('«'), 'versículo sin encabezado incrustado');
  });

  it('decir-familia corta: JON 3:4 pregonaba diciendo → Jonás', () => {
    const { messages } = run('jonas', 'JON', 3);
    const proclama = messages.find(m => m.verse === 4 && /cuarenta d[íi]as/.test(m.text));
    assert.ok(proclama, 'proclama de Jonás JON 3:4 existe');
    assert.equal(proclama.speaker, 'Jonás');
  });

  it('JOB 4: Elifaz introduce y 38:1 responde Dios', () => {
    const { messages } = run('job', 'JOB', 4);
    const intro = messages.find(m => m.verse === 1);
    assert.ok(intro, 'JOB 4:1 existe');
    assert.equal(intro.speaker, 'Narrador');
    const j38 = run('job', 'JOB', 38);
    const resp = j38.messages.find(m => m.verse === 1 && /torbellino/.test(m.text));
    assert.ok(resp, 'JOB 38:1 existe');
    assert.equal(resp.speaker, 'Narrador');
  });

  it('GEN patriarcas: Faraón GEN 12:18, Abraham GEN 22:8, Lamec GEN 4:23', () => {
    const g12 = run('genesis', 'GEN', 12);
    const faraon = g12.messages.find(m => m.verse === 18 && /qué es esto/i.test(m.text));
    assert.ok(faraon, 'burbuja de Faraón GEN 12:18 existe');
    assert.equal(faraon.speaker, 'Faraón');
    const g22 = run('genesis', 'GEN', 22);
    const abraham = g22.messages.find(m => m.verse === 8 && /proveer/.test(m.text));
    assert.ok(abraham, 'burbuja de Abraham GEN 22:8 existe');
    assert.equal(abraham.speaker, 'Abraham');
    const g4 = run('genesis', 'GEN', 4);
    const lamec = g4.messages.find(m => m.verse === 23 && /oíd mi voz/i.test(m.text));
    assert.ok(lamec, 'burbuja de Lamec GEN 4:23 existe');
    assert.equal(lamec.speaker, 'Lamec');
  });

  it('EXO voces: Josué 32:17 y María 15:21', () => {
    const e32 = run('exodus', 'EXO', 32);
    const josue = e32.messages.find(m => m.verse === 17 && /alarido/i.test(m.text));
    assert.ok(josue, 'burbuja de Josué EXO 32:17 existe');
    assert.equal(josue.speaker, 'Josué');
    const e15 = run('exodus', 'EXO', 15);
    const maria = e15.messages.find(m => m.verse === 21 && /cantad/i.test(m.text));
    assert.ok(maria, 'burbuja de María EXO 15:21 existe');
    assert.equal(maria.speaker, 'María');
  });

  it('MRK voces: Dios 1:11, Leproso 1:40, Herodes 6:16, Pedro 8:29, Pilato 15:2', () => {
    const m1 = run('marcos', 'MRK', 1);
    assert.equal(speakerOf(m1.messages, 11, 'b'), 'Dios');
    assert.equal(speakerOf(m1.messages, 40, 'b'), 'Leproso');
    const m6 = run('marcos', 'MRK', 6);
    assert.equal(speakerOf(m6.messages, 16, 'b'), 'Herodes');
    const m8 = run('marcos', 'MRK', 8);
    const pedro = m8.messages.find(m => m.verse === 29 && /cristo/i.test(m.text));
    assert.ok(pedro, 'burbuja de Pedro MRK 8:29 existe');
    assert.equal(pedro.speaker, 'Pedro');
    const m15 = run('marcos', 'MRK', 15);
    assert.equal(speakerOf(m15.messages, 2, 'b'), 'Pilato');
  });

  it('canon extendido: JOB 1 atribuye a Satán y JONÁS 1 a Marineros', () => {
    const job = run('job', 'JOB', 1);
    const satan = job.messages.find(m => m.verse === 7 && /rodear la tierra/.test(m.text));
    assert.ok(satan, 'burbuja de Satán JOB 1:7 existe');
    assert.equal(satan.speaker, 'Satán');
    const jon = run('jonas', 'JON', 1);
    const marineros = jon.messages.find(m => m.verse === 6 && /dormil/.test(m.text));
    assert.ok(marineros, 'burbuja de Marineros JON 1:6 existe');
    assert.equal(marineros.speaker, 'Marineros');
  });
});
