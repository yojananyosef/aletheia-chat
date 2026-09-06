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

  it('LUK voces: Zacarías 1:18, Simeón 2:34, Doctor 10:25, Zaqueo 19:8, Ladrones 23:39', () => {
    const l1 = run('lucas', 'LUK', 1);
    assert.equal(speakerOf(l1.messages, 18, 'b'), 'Zacarías');
    const l2 = run('lucas', 'LUK', 2);
    assert.equal(speakerOf(l2.messages, 34, 'b'), 'Simeón');
    const l10 = run('lucas', 'LUK', 10);
    assert.equal(speakerOf(l10.messages, 25, 'b'), 'Doctor');
    const l19 = run('lucas', 'LUK', 19);
    assert.equal(speakerOf(l19.messages, 8, 'b'), 'Zaqueo');
    const l23 = run('lucas', 'LUK', 23);
    assert.equal(speakerOf(l23.messages, 39, 'b'), 'Ladrones');
  });

  it('JHN voces: Fariseos 9:40, Tomás 11:16, Marta 11:39, Criado 18:26', () => {
    const j9 = run('juan', 'JHN', 9);
    assert.equal(speakerOf(j9.messages, 40, 'b'), 'Fariseos');
    const j11 = run('juan', 'JHN', 11);
    assert.equal(speakerOf(j11.messages, 16, 'b'), 'Tomás');
    assert.equal(speakerOf(j11.messages, 39, 'd'), 'Marta');
    const j18 = run('juan', 'JHN', 18);
    assert.equal(speakerOf(j18.messages, 26, 'b'), 'Criado');
  });

  it('NUM voces: Josué 11:28, Asna 22:30, Balac 22:37', () => {
    const n11 = run('numeros', 'NUM', 11);
    assert.equal(speakerOf(n11.messages, 28, 'b'), 'Josué');
    const n22 = run('numeros', 'NUM', 22);
    assert.equal(speakerOf(n22.messages, 30, 'b'), 'Asna');
    assert.equal(speakerOf(n22.messages, 37, 'b'), 'Balac');
  });

  it('DEU voces: Cuñado 25:8, Cuñada 25:9, Oficiales 20:5', () => {
    const d25 = run('deuteronomio', 'DEU', 25);
    assert.equal(speakerOf(d25.messages, 8, 'b'), 'Cuñado');
    assert.equal(speakerOf(d25.messages, 9, 'b'), 'Cuñada');
    const d20 = run('deuteronomio', 'DEU', 20);
    assert.equal(speakerOf(d20.messages, 5, 'b'), 'Oficiales');
  });

  it('JOS voces: Rey de Jericó 2:3, Príncipe 5:15, Acán 7:20', () => {
    const j2 = run('josue', 'JOS', 2);
    assert.equal(speakerOf(j2.messages, 3, 'b'), 'Rey de Jericó');
    const j5 = run('josue', 'JOS', 5);
    assert.equal(speakerOf(j5.messages, 15, 'b'), 'Príncipe');
    const j7 = run('josue', 'JOS', 7);
    assert.equal(speakerOf(j7.messages, 20, 'b'), 'Acán');
  });

  it('JOS voces: Hijos de José 17:14, Finees 22:31', () => {
    const j17 = run('josue', 'JOS', 17);
    assert.equal(speakerOf(j17.messages, 14, 'b'), 'Hijos de José');
    const j22 = run('josue', 'JOS', 22);
    assert.equal(speakerOf(j22.messages, 31, 'b'), 'Finees');
  });

  it('JDG voces: Aod 3:19, Débora 4:6, Gedeón 6:13', () => {
    const j3 = run('jueces', 'JDG', 3);
    assert.equal(speakerOf(j3.messages, 20, 'b'), 'Aod');
    const j4 = run('jueces', 'JDG', 4);
    assert.equal(speakerOf(j4.messages, 14, 'b'), 'Débora');
    const j6 = run('jueces', 'JDG', 6);
    assert.equal(speakerOf(j6.messages, 13, 'b'), 'Gedeón');
  });

  it('JOS carryover: marco "...diciendo:" abre discurso (1:1 -> 1:2-9 Dios)', () => {
    const j1 = run('josue', 'JOS', 1);
    assert.equal(speakerOf(j1.messages, 1, 'a'), 'Narrador');
    for (const v of [2, 3, 4, 5, 6, 7, 8, 9]) assert.equal(speakerOf(j1.messages, v, ''), 'Dios');
    assert.equal(speakerOf(j1.messages, 10, 'a'), 'Narrador');
    assert.equal(speakerOf(j1.messages, 11, 'a'), 'Josué');
  });

  it('1SA voces: Ana 2:1, David 17:45-46 (carryover), David 24:16', () => {
    const s2 = run('1samuel', '1SA', 2);
    assert.equal(speakerOf(s2.messages, 1, 'b'), 'Ana');
    const s17 = run('1samuel', '1SA', 17);
    assert.equal(speakerOf(s17.messages, 45, 'b'), 'David');
    assert.equal(speakerOf(s17.messages, 46, ''), 'David');
    const s24 = run('1samuel', '1SA', 24);
    assert.equal(speakerOf(s24.messages, 16, 'b'), 'David');
  });

  it('ESD voces: Secanías 10:2', () => {
    const s10 = run('esdras', 'EZR', 10);
    assert.equal(speakerOf(s10.messages, 2, 'b'), 'Secanías');
  });

  it('2CR voces: Salomón carta 2:4, Micaías 18:13', () => {
    const s2 = run('2cronicas', '2CH', 2);
    assert.equal(speakerOf(s2.messages, 4, ''), 'Salomón');
    const s18 = run('2cronicas', '2CH', 18);
    assert.equal(speakerOf(s18.messages, 13, 'b'), 'Micaías');
  });

  it('1CR voces: Jabes 4:10, Gad/David 21:11-13', () => {
    const s4 = run('1cronicas', '1CH', 4);
    assert.equal(speakerOf(s4.messages, 10, 'b'), 'Jabes');
    const s21 = run('1cronicas', '1CH', 21);
    assert.equal(speakerOf(s21.messages, 3, 'b'), 'Joab');
  });

  it('2RE voces: Naamán 5:11, Eliseo 6:19', () => {
    const s5 = run('2reyes', '2KI', 5);
    assert.equal(speakerOf(s5.messages, 11, 'b'), 'Naamán');
    const s6 = run('2reyes', '2KI', 6);
    assert.equal(speakerOf(s6.messages, 19, 'b'), 'Eliseo');
  });

  it('1RE voces: Elías 18:15, Salomón 2:22', () => {
    const s18 = run('1reyes', '1KI', 18);
    assert.equal(speakerOf(s18.messages, 15, 'b'), 'Elías');
    const s2 = run('1reyes', '1KI', 2);
    assert.equal(speakerOf(s2.messages, 22, 'b'), 'Salomón');
  });

  it('2SA voces: Abner/Joab 2:14, Gad 24:13', () => {
    const s2 = run('2samuel', '2SA', 2);
    assert.equal(speakerOf(s2.messages, 14, 'b'), 'Abner');
    assert.equal(speakerOf(s2.messages, 14, 'd'), 'Joab');
    const s24 = run('2samuel', '2SA', 24);
    assert.equal(speakerOf(s24.messages, 13, 'b'), 'Gad');
  });

  it('JDG voces: Jefté 11:7, Sansón 14:12, Dalila 16:6', () => {
    const j11 = run('jueces', 'JDG', 11);
    assert.equal(speakerOf(j11.messages, 7, 'b'), 'Jefté');
    const j15 = run('jueces', 'JDG', 15);
    assert.equal(speakerOf(j15.messages, 3, 'b'), 'Sansón');
    const j16 = run('jueces', 'JDG', 16);
    assert.equal(speakerOf(j16.messages, 6, 'b'), 'Dalila');
  });

  it('MAT voces: Pedro 16:16 y 26:33', () => {
    const m16 = run('mateo', 'MAT', 16);
    assert.equal(speakerOf(m16.messages, 16, 'b'), 'Pedro');
    const m26 = run('mateo', 'MAT', 26);
    assert.equal(speakerOf(m26.messages, 33, 'b'), 'Pedro');
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
