# qa-report.md — barrido 2026-09-06 (tras backfill Job/Exodo + Juan completo)

Generado con `node scripts/attribute-speakers/qa-sweep.mjs` · exit 0 · 24 libros · 25.306 mensajes.

## Resumen por libro

| libro | msgs | revisado | sospechoso | ambiguo-sin-revisar |
|---|---|---|---|---|
| genesis | 2127 | 468 | 0 | 0 |
| exodus | 1460 | 418 | 0 | 0 |
| levitico | 905 | 132 | 0 | 0 |
| numeros | 1444 | 444 | 0 | 0 |
| deuteronomio | 1047 | 948 | 0 | 0 |
| josue | 760 | 155 | 0 | 0 |
| jueces | 887 | 203 | 0 | 0 |
| rut | 144 | 29 | 0 | 0 |
| 1samuel | 1241 | 311 | 0 | 0 |
| 2samuel | 1037 | 256 | 0 | 0 |
| 1reyes | 1106 | 292 | 0 | 0 |
| 2reyes | 1074 | 263 | 0 | 0 |
| 1cronicas | 1000 | 132 | 0 | 0 |
| 2cronicas | 960 | 185 | 0 | 0 |
| esdras | 299 | 74 | 0 | 0 |
| nehemias | 458 | 101 | 0 | 0 |
| ester | 206 | 35 | 0 | 0 |
| job | 1124 | 802 | 0 | 0 |
| salmos | 2664 | 148 | 0 | 0 |
| proverbios | 932 | 889 | 0 | 0 |
| eclesiastes | 232 | 225 | 0 | 0 |
| cantares | 121 | 116 | 0 | 0 |
| isaias | 1462 | 843 | 0 | 0 |
| jeremias | 1715 | 269 | 0 | 0 |
| lamentaciones | 163 | 162 | 0 | 0 |
| ezequiel | 1504 | 410 | 0 | 0 |
| daniel | 421 | 305 | 0 | 0 |
| oseas | 210 | 178 | 0 | 0 |
| joel | 77 | 53 | 0 | 0 |
| amos | 190 | 54 | 0 | 0 |
| jonas | 68 | 26 | 0 | 0 |
| mateo | 1464 | 320 | 0 | 0 |
| marcos | 952 | 215 | 0 | 0 |
| lucas | 1576 | 472 | 0 | 0 |
| juan | 1303 | 226 | 0 | 0 |
| **total** | **32333** | **10159** | **0** | **0** |

`revisado` = divergencia dry↔aplicado respaldada por `reviewed/`. `sospechoso` = sin respaldo.
`ambiguo-sin-revisar` = ambiguos del dry actual publicados con el default y sin entrada `reviewed/`.

Integridad: **0** capitulo-faltante · 0 capitulo-extra · 0 texto-perdido · 0 schema · 0 id-duplicado · **0** vocabulario-invalido.

## Sospechosos por cluster (aplicado ← dry, sin respaldo reviewed/)

**NINGUNO — barrido limpio (2026-09-06): 0 sospechosos en los 24 libros.**

Histórico del barrido: 1.971 → 704 (evangelios 4.2) → 332 (numeros/genesis) → 91 (josue/
jueces/lev/deut/exodus) → **0** (cola menor + salmos). Advertencias de deriva-fuente: 135
(known gateway drift, no bloquean).

### Deuda ambiguo-sin-revisar — RESUELTA (2026-09-06, 414 → 0)
Los ambiguos del dry publicados con default y sin respaldo `reviewed/` se clasificaron en:
- **408 confirmaciones** (aplicado == dry, el dry solo reporta baja confianza): la decisión
  publicada del corpus se respaldó con entrada `reviewed/` (confidence 0.85, 2ª pasada sin
  cambios de corpus). Muestras verificadas verso a verso: estatuto del tabernáculo (Éx 25-31,
  35-40: instrucción divina genuina), ciclos de Job/Elifaz/Bildad/Zofar/Eliú (2:9 Esposa,
  3:3 Job, 4:2 Elifaz), NT con doctrina del relator ya revisada en 4.2 (mateo 9:14 Discípulos,
  13:36 Jesús; lucas 1:28 Ángel, 3:22 Dios; juan 6:5 Jesús, 9:40 Fariseos).
- **6 subIds fantasma** (el dry propone un split que el corpus no publicó): se documentó el
  verso entero con su speaker aplicado — exodus 1:22b/2:10b/4:25b Narrador, 3:16b/3:17b/4:23b
  Dios. El corpus conserva el verso sin dividir (no redimible vía `reviewed/`).
Total: 414 entradas en 19 libros, 0 conflictos (aplicado ≠ dry) encontrados.

### Proverbios — integración nueva (2026-09-06)
Libro desbloqueado con mapa de voz doctrinal (932 mensajes, 31 caps; barrido 0 sospechosos/
0 ambiguos/0 duros). Voces: **Salomón** = el maestro-padre ("Hijo mío...") y recitador de las
colecciones 10-29; **Sabiduría** = discursos personificados (1:22-33, 8:4-36, 9:4-12); **Mujer
insensata** = su invitación (9:16-18); **Agur** = 30:2-33; **Madre de Lemuel** = la lección
materna (31:2-9, la boca en escena es la madre: "oh Lemuel"); **Narrador** = prólogo 1:1-7,
marcos narrados (1:20-21, 8:1-3, 9:1-3, 9:13-15), marco editorial 25:1 (varones de Ezequías) y
el poema anónimo 31:10-31. Citas intercaladas del dry (17 splits) con doctrina del relator:
conservan la voz del citador (1:11 Salomón citando a los pecadores). El dry puro era inútil
aquí (915 Narrador: no hay escenas marcadas); toda la atribución es doctrinal via `reviewed/`.

### Eclesiastés — integración nueva (2026-09-06)
Libro desbloqueado (232 mensajes, 12 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Voces:
**Predicador** = la voz primera de Kohelet (1:2-12:8, con sus marcos internos "dijo el
Predicador"); **Narrador** = el título (1:1) y el epílogo del editor en 3ª persona (12:9-14,
incl. el veredicto final 12:13-14). Sin oráculos divinos en el libro (Dios siempre en 3ª
persona; los 12 "Dios" del dry eran falsos positivos de carryover). 21 splits del dry heredan
la voz circundante.

### Cantares — integración nueva (2026-09-06)
Libro desbloqueado (121 mensajes, 8 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Diálogo
dramático: **Amada** y **Amado** (las dos voces principales), **Hijas de Jerusalén** = el coro
(1:8, 3:6, 3:11, 5:9, 6:1, 6:13), **Hermanos** = los hermanos de la amada (8:8-9), **Narrador**
= título (1:1) y la litera de Salomón (3:7-10). Citas dramatizadas: discurso del Amado 2:10b-15
y su llamada 5:2b (con los marcos 2:10a/5:2a en la Amada). Cruxes documentadas: 7:9 "mi amado"
→ Amada (la voz femenina del texto publicado, sin split posible); 8:5 pregunta del coro +
respuesta de la Amada → Amada.

### Isaías — integración nueva (2026-09-06)
Libro desbloqueado (1462 mensajes, 66 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Doctrina
doctrinal del libro: **Isaías** = la voz del profeta por defecto (autor nombrado; doctrina del
relator: su boca transmite el oráculo — precedente proverbios 1:11 / mateo 15:7-9); **Dios** =
las citas tras marco dividido y su continuación (1:2b-23, 3:16b-26, 7:3b-9, 8:1b-10, 10:24b-34,
43:1b-28, 44:2b-28, 45:1b-25...), los versos con fórmula en línea ("dice Jehová/dice el Santo":
3:15, 14:22-23, 40:1-2, 40:25) y los oráculos del Siervo con voz divina ("mi siervo": 42:1-9/
14-17, 52:13-15, 41:9b); **Narrador** = títulos ("Carga de..."), biografía (7:1, 20:1-3) y
marcos 'a' del dry. Escena de 36-39 con voces: **Rabsaces** (36:4b-10, 12-21), **Eliaquim**
(36:11b), **Siervos** de Ezequías (37:3b-4), **Rey de Asiria** (la carta 37:10-13, patrón
Asuero de ester), **Ezequías** (oración 37:16-20; escritura 38:10-20; 39:3d/4d/8b-d), **Acaz**
(7:12b), **Serafines** (6:3b/7b), **Mujeres** (4:1b). 138 correcciones sobre el dry (falsos
Dios en citas de terceros: 6:5b/8d/11b Isaías, 8:2/16-18, 10:8b-14, 14:8b/13b/16b, 24:16b,
28:15b, 21:9b, 57:10b, 63:11b; 37:36-38 Narrador; 38:5a Dios).

### Jeremías — integración nueva (2026-09-06)
Libro desbloqueado (1715 mensajes, 52 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Hereda
la doctrina de Isaías: **Jeremías** = la voz del profeta por defecto (transmisión, lamentos
20:7-18, oración 32:17-25, su defensa 26:12-15 y 37:18-20); **Dios** = citas tras marco dividido
y su continuación (dominante en 1-29 y 46-51), carta de la cautividad 29:4-32, oráculos 28:13a/
32:7a, citas dentro del bloque divino; **Narrador** = superscripción 1:1-3 y las escenas
históricas 26-45 y 52 (toda la crónica del sitio, Narrador). Escenas con voces: **Sedequías**
(32:3-5, 37:3/17, 38:5/10/14-24), **Hananías** (su falsa profecía 28:2-4/11), **Baruc**
(36:18b), **Ebed-melec** (38:9/12), **Príncipes** (36:14-19, 38:4, 40:14-15), **Sacerdotes**
(26:8-11), **Ancianos** (26:18-19 citando a Micaías), **Pueblo** (42:2-3, 44:16-19), **Azarías**
(43:2-3), **Gedalías** (40:9-10, 40:16b), **Capitán** (37:13b, 40:2b-5b), **Hombres** (41:8b).
142 correcciones sobre el dry (réplicas de Jeremías 1:6b/11d/13d, 4:10b, 14:13b, 20:9b, 24:3d;
lamentos 20:7-18; narraciones 34:6-11, 37:15-16, 51:59-60, 28:5/10/17).

### Lamentaciones — integración nueva (2026-09-06)
Libro desbloqueado (163 mensajes, 5 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Poesía de
duelo sin marcos narrativos: mapa doctrinal a mano. **Jeremías** = la voz del poeta por defecto
(descripción de la ruina 1:1-11 y 2:1-19, el varón de aflicción cap. 3 entero, oráculo contra
Edom y consuelo a Sión 4:21-22); **Jerusalén** = la ciudad personificada en 1ª persona
(1:12-16, 1:18-22, súplica 2:20-22); **Pueblo** = la comunidad del remanente que reza el cap.
5 entero; **Dios** = única cita divina "No temas" (3:57b, el citado de "dijiste"); voces de
escena: **Niños** (2:12b), **Sacerdotes** (4:15b), **Enemigos** (la burla 2:15b/16b). 24
correcciones sobre el dry (los 12 falsos Dios incluidos).

### Ezequiel — integración nueva (2026-09-06)
Libro desbloqueado (1504 mensajes, 48 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Hereda
la doctrina de Isaías/Jeremías: **Ezequiel** = la voz del profeta por defecto (visión del
merkaba cap. 1, actos simbólicos 4-5/12/24:18/37:7/37:10, tour del templo 40-48, exclamaciones
11:13b y 37:3d); **Dios** = dominante (marcos "Y me vino palabra de Jehová, diciendo:" y su
continuación, comisionamiento 2-3, oráculos 25-39, voz desde la casa 43:7-12, y en 40-48 lo
que el texto atribuye expresamente "me dijo Jehová"/"así dice Jehová"); **Ángel** = el varón
de la caña de medir que guía el tour (40:4b, 40:45b, 41:4b, 41:22b, 42:13b, 46:20b, 46:24b,
47:6b, 47:8b); **Pueblo** = citas de la casa de Israel (12:22b, 33:24b, 37:11d, 37:18b),
pregunta 24:19b y mofa 33:30b (esta última correcta en el dry); **Mensajero** = el fugitivo
que anuncia la caída de Jerusalén (33:21b). 21 correcciones sobre el dry (falsos Pueblo en
3:11b, falsos Benaía/Hombres en 11:13b/15b).

### Daniel — integración nueva (2026-09-06)
Libro desbloqueado (421 mensajes, 12 caps; barrido 0 sospechosos/0 ambiguos/0 duros). Libro
bicéfalo. **Caps 1-6** (narrativa de corte en 3ª persona): **Narrador** por defecto; escenas
con **Nabucodonosor** (sueños 2/4, horno 3, edictos 3:28-29), **Caldeos** (los sabios 2-3),
**Sadrac** (los tres jóvenes ante el horno, primer-nombrado), **Arioc** (2:25b), **Eunuco**
(1:10b), **Belsasar** (5:7/13-16), **Reina** (5:10-12), **Darío** (6:16/20/25-27), **Príncipes**
(los conspiradores 6 y consejeros 3:24d), **Daniel** (ruegos 1:11-13, alabanza 2:20-23,
interpretaciones 2:28-45/4:19-27/5:17-28, foso 6:21-22). **Caps 7-12** (visiones en 1ª
persona): **Daniel** por defecto; **Ángel** = el intérprete de la visión (7:17-27), los santos
(8:13-14) y el varón de lino con su discurso (10-11 entero, 12:1-4/6b/9b); **Gabriel** = donde
el texto lo nombra (8:17-26, 9:22-27); **Dios** = la voz del cielo (4:31b-32) y la voz que
ordena a Gabriel (8:16b). 229 correcciones sobre el dry (casi todo estaba en Narrador/Dios).

### Oseas — integración nueva (2026-09-06)
Libro desbloqueado (210 mensajes, 14 caps; barrido 0 sospechosos/0 ambiguos/0 duros). **Caps
1-3** (biografía simbólica de Gomer): las órdenes divinas de nombrar a los hijos ya llegan
como Dios por los splits; 1:3/1:8 corregidas a Narrador (narración de los nacimientos) y
3:2/3:3b a Oseas (su compra e instrucciones, 1ª persona). **Cap 2**: el pleito y las nuevas
bodas en 1ª persona divina (2:2-4, 2:6-11, 2:13-23); citas de la esposa sin nombre (2:5b,
2:12b) en Dios como relator del bloque. **Caps 4-14** (oráculos): discurso divino dominante —
Dios por defecto; **Oseas** solo donde habla él: exordio en 3ª persona (4:1-3), lamento sobre
el profeta (9:7-9), intercesión (9:14, 9:17), exhortación final (14:1-2a); **Pueblo** = la
oración penitencial que Oseas pone en boca de Israel (14:2b-3); **Efraín** = la personificación
nombrada en el marco "Y dijo Efraín:" (12:8b, patrón Jerusalén de Lamentaciones). Citas breves
sin nombre (8:2b, 10:3, 13:10b) en Dios como relator. 181 correcciones sobre el dry (el dry
tenía 185/210 en Narrador).

### Joel — integración nueva (2026-09-06)
Libro desbloqueado (77 mensajes, 3 caps; barrido 0 sospechosos/0 ambiguos/0 duros). **Caps
1-2:10**: la voz del profeta (conversión Narrador→Joel) describe la plaga de langostas y llama
al duelo; sus gemidos al cielo corregidos a Joel (1:15-16, 1:19b, 2:11 — el dry los tenía en
Dios). **2:12-16**: la llamada divina a la conversión ("Convertíos a mí con todo vuestro
corazón"). **2:17**: la oración de los sacerdotes entre el pórtico y el altar → **Sacerdotes**
(el dry inventó 'Alguaciles'). **2:18-32**: la respuesta divina ("He aquí yo os enviaré
trigo... derramaré mi Espíritu sobre toda carne"). **Cap 3**: el juicio en el valle de Josafat
y la restauración, todo en 1ª persona divina. 26 correcciones sobre el dry.

### Amós — integración nueva (2026-09-06)
Libro desbloqueado (190 mensajes, 9 caps; barrido 0 sospechosos/0 ambiguos/0 duros). **Caps
1-6**: oráculos divinos dominantes (el dry ya separaba bien los "Así dice Jehová"); corrección
del título (1:2b → Amós) y del yo divino del juicio (4:2-13 → Dios, el dry los tenía en
Narrador). La elegía 5:1-2 y los ayes 6:1-7 → Amós (conversión). **Caps 7-8** (visiones en 1ª
persona): **Amós** por defecto — relato y sus respuestas al interrogatorio divino (7:2b/5b/8d,
8:2d); **Dios** en las preguntas y veredictos (7:8b/f, 8:2b/f, 7:9). **7:10-17**: escena de
**Amasías** (voz nueva): su denuncia al rey (7:10b), su orden de marcha (7:12b-13) y su orden
citada por Amós en el rebuke (7:16b); la cita "así ha dicho Amós" (7:11b) vuelve a Amós como
citado con nombre; la orden de profetizar (7:15b) y el oráculo contra Amasías (7:17b) → Dios.
**Cap 9**: juicio y restauración en 1ª persona divina (9:2-5, 9:8-15 → Dios). 34 correcciones.

## Triaje (estado del tasks.md)

### Cubeta a — resuelta (barrido 1)
- `CanonicalSpeaker` += Asael (2samuel), Asa/Reina (2cronicas); `books.ts` += Mujer (genesis),
  Hija de Herodías + Ancianos (mateo). 0 vocabulario-invalido.

### Cubeta a2 — resuelta (backfill doctrinal de `reviewed/`)
La voz aplicada es doctrinalmente correcta y el dry actual solo la pierde porque el carryover de voz
llegó después de integrar esos libros. Volcado aplicado→`reviewed/` (confidence 0.85, merge-safe,
2ª pasada 0 fusionados):
- `job` (734 entradas, 37 caps): ciclos de discurso Job/Elifaz/Bildad/Zofar/Eliú + discursos del
  torbellino (Dios en 39/41). Sospechosos 734 → 0.
- `exodus` (256 entradas, 9 caps): instrucciones divinas (Éx 3, 21-23, 26-30). Sospechosos 376 → 120.

### Cubeta b — adjudicación doctrinal verso a verso (COMPLETADA, 0)
- **Evangelios (4.2) COMPLETADOS (2026-09-06): 0 sospechosos en los 4** — juan (202 fixes:
  9 piloto + 81 resto), mateo (39), lucas (57), marcos (25). Total: 323 fixes + ~70
  documentaciones de narraciones legítimas y voces confirmadas.
  - Juan: pan de vida (6:38-58), Buen Pastor (10), Cenáculo (14), oración sacerdotal (17),
    templo (7-8, 12); 6:9 Andrés, 6:14b Multitud (`Hombres` no está en el vocabulario juan),
    5:7 Hombre, 11:22 Marta, 11:48 Sacerdotes, 16:30 Discípulos, 1:20/1:27 Juan el Bautista;
    caso inverso documentado (18:6b "Yo soy" = Jesús, el dry decía Dios).
  - Mateo: 1:21/1:23a y 28:6-7 Ángel; 15:7-9 Jesús citando a Isaías, NO Dios (doctrina del
    relator del triage); 17:15 Hombre; 22:17 Discípulos; 22:36 Doctor (voz añadida a books.ts);
    26:75b Narrador (cita narrada: el relator conserva la voz, el aplicado Jesús era incorrecto).
  - Lucas: Magnificat 1:47-49 María, Benedictus 1:69 Zacarías, Sermón del llano 6:21-38 Jesús,
    parábola del acreedor 7:41-47 Jesús, 9:24-27 y 12:21-40 Jesús, Padre nuestro 11:3 Jesús (lo
    enseña Él), 11:50-51 cita de la Sabiduría = Jesús, tentación 4:10-11 Demonio (precedente
    mateo 4:6b), 7:7-8 Centurión, 1:32 Ángel; genealogía 3:23-38 narración.
  - Marcos: discursos 7/8/10/12/13/14 Jesús; 13:4 Discípulos preguntan; 14:71 Pedro ("No conozco
    a este hombre"); 14:72b cita narrada → Narrador (aplicado Jesús era incorrecto);
    14:65b "Profetiza" = Sacerdotes; 12:33 Escribas.
- **AT carryover divino (4.3):** Números COMPLETADO (2026-09-06: 248→0, 253 documentaciones de
  narración en 25 caps — **hallazgo: el carryover divino actual sobre-fija** sobre narraciones de
  ejecución/censos/ofrendas ("Tomó, pues, Moisés...", "los contados de ellos..."); el aplicado
  Narrador era correcto en el 100% de los casos. Mejora heurística opcional: ampliar NARRSTART_RE
  con arranques narrativos ("Y Moisés", "Entonces Jehová descendió", "Y partieron", "Y los hijos
  de...").
- **Génesis COMPLETADO** (2026-09-06: 118→0, 36 fixes + 83 documentaciones): 1:15 y 15:19-21 habla
  divina (creación, concesión de la tierra), 18:24-25 intercesión de Abraham, 27:7-10 Rebeca,
  28:2-4 Isaac, 29:27/31:30 Labán, 32:10-12 oración de Jacob, 40:13-19/43:5a/44:2-31/47:24/48:4/
  48:8/50:5 José y Judá, 43:18b Hermanos; narraciones documentadas (genealogía 11:8-31, diluvio,
  circuncisión 17:24-27).
- **Josué COMPLETADO** (2026-09-06: 48→0, 12 fixes + 36 docs): pueblo 1:17-18, Rahab 2:5, Josué
  3:12, órdenes divinas 4:2/4:16/13:2-4/20:4-6; narraciones de conquista y reparto.
- **Jueces COMPLETADO** (2026-09-06: 50→0, 11 fixes + 39 docs): oráculo de Débora 4:7 (Dios),
  Zebul 9:32-33, voto de Jefté 11:31, Espías 18:10, Criado 19:13, Levita 20:5-7, Israel/Pueblo
  20:13/21:11 (consistente con 20:12b/21:10b Pueblo); canto de Débora 5:31 = Narrador (5:3).
- **Levítico COMPLETADO** (2026-09-06: 8→0, todo Narrador): cierres "mandó" en 3ª persona 7:37-38/
  27:34, ejecuciones 8:4/21:24, blasfemo 24:10-12.
- **Deuteronomio COMPLETADO** (2026-09-06: 15→0, todo Narrador): paréntesis históricos del editor
  2:10-23/3:9/3:14/10:6-9, 31:22/31:30.
- **Éxodo COMPLETADO** (2026-09-06: 120→0, 62 fixes + 58 docs): Pascua 12:2-20/12:44-49 (Dios),
  12:23-27a Moisés a ancianos, 13:3-16 Moisés, Faraón 1:16/5:7-8a, siervos 10:7b, Moisés
  5:23/16:16/16:26/18:16/35:3, oráculos 11:2/14:2-4/14:16-18/16:5/19:11/19:22, Aarón 32:23-24;
  narraciones (plagas, Mar Rojo, mana, Sinaí, becerro). Nota: serie reviewed unificada
  `exodus-*.json` (slug del sweep).
- **Salmos COMPLETADO** (2026-09-06: 38→0, 9 fixes + 29 docs — cierra 4.1): oráculos genuinos a
  **Dios** (50:17-23 con marco 50:16 dividido; 60:7-8 con marco 60:6 dividido); el salmista-
  Narrador documentado en 18:46-50, 36:2-12, 60:9-12, 82:2, 89:49, 94:8, 99:9 y 110:2-7 (110:1
  y 60:6 SÍ están divididos marco+oráculo; 110:4 "Juró Jehová" queda Narrador por no poder
  redividir). Doctrina 4.1 resuelta: salmista habla salvo oráculo con marco explícito.
- **2 Crónicas COMPLETADO** (2026-09-06: 26→0, 19 fixes + 7 docs): carta de Hiram 2:13-16,
  Pueblo 10:4, Roboam 10:11, Asa 16:3, Micaías 18:26a, Jehú 19:3, carta de Elías 21:13-15
  (consistente con 21:12b Elías), Joás 25:19a, Sacerdotes 29:19, Ezequías 30:8-9/32:7-8,
  caso inverso 20:31 (aplicado Dios → Narrador, resumen regnal).
- **Samuel/Reyes y resto COMPLETADO** (2026-09-06: 27→0): 2samuel (Abner 3:9-10, Mensajero
  11:24), 1reyes (David 2:2-3, Mensajero 20:3), 2reyes (Eliseo 4:26a), rut (Noemí 1:12b,
  Ancianos 4:11b), 1samuel (2:27b oráculo del varón de Dios = Dios aplicado, Filisteos 5:8b/
  5:11b, Saúl 17:37b), jonas/nehemias/1cronicas documentaciones de narración.

### Deriva-fuente (advertencia, no bug)
- salmos 124: headings «…» extraídos a títulos Sistema (transformación conocida) + puntuación.
- genesis 2 (incl. GEN 39:12: el corpus conserva "y salió fuera" y el gateway SpaRVG actual ya no
  lo trae; RV1909 "salióse fuera" y SpaPlatense "salió afuera" confirman que el corpus está bien).
- evangelios 9: puntuación/case.

## Corrida

```bash
node scripts/attribute-speakers/qa-sweep.mjs            # tabla humana, exit 1 si hay duros
node scripts/attribute-speakers/qa-sweep.mjs --json     # máquina-readable
node scripts/attribute-speakers/qa-sweep.mjs --book ester
```
