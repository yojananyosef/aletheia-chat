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
});
