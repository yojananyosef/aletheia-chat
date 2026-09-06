# qa-report.md — barrido 2026-09-06 (tras backfill Job/Exodo + Juan completo)

Generado con `node scripts/attribute-speakers/qa-sweep.mjs` · exit 0 · 24 libros · 25.306 mensajes.

## Resumen por libro

| libro | msgs | revisado | sospechoso | ambiguo-sin-revisar |
|---|---|---|---|---|
| genesis | 2127 | 467 | 0 | 8 |
| exodus | 1460 | 480 | 0 | 224 |
| levitico | 905 | 132 | 0 | 8 |
| numeros | 1444 | 444 | 0 | 0 |
| deuteronomio | 1047 | 948 | 0 | 22 |
| josue | 760 | 161 | 0 | 54 |
| jueces | 887 | 208 | 0 | 64 |
| rut | 144 | 27 | 2 | 5 |
| 1samuel | 1241 | 306 | 5 | 8 |
| 2samuel | 1037 | 253 | 6 | 9 |
| 1reyes | 1106 | 291 | 4 | 5 |
| 2reyes | 1074 | 262 | 1 | 1 |
| 1cronicas | 1000 | 130 | 2 | 2 |
| 2cronicas | 960 | 168 | 26 | 27 |
| esdras | 299 | 74 | 0 | 0 |
| nehemias | 458 | 98 | 3 | 4 |
| ester | 206 | 35 | 0 | 11 |
| job | 1124 | 802 | 0 | 198 |
| salmos | 2664 | 119 | 38 | 38 |
| jonas | 68 | 22 | 4 | 4 |
| mateo | 1464 | 320 | 0 | 17 |
| marcos | 952 | 215 | 0 | 0 |
| lucas | 1576 | 472 | 0 | 16 |
| juan | 1303 | 226 | 0 | 20 |
| **total** | **25306** | **6588** | **91** | **744** |

`revisado` = divergencia dry↔aplicado respaldada por `reviewed/`. `sospechoso` = sin respaldo.
`ambiguo-sin-revisar` = ambiguos del dry actual publicados con el default y sin entrada `reviewed/`.

Integridad: **0** capitulo-faltante · 0 capitulo-extra · 0 texto-perdido · 0 schema · 0 id-duplicado · **0** vocabulario-invalido.

## Sospechosos por cluster (aplicado ← dry, sin respaldo reviewed/)

- 248 · numeros | Narrador ← Dios
- 89 · exodus | Narrador ← Dios
- 78 · genesis | Narrador ← Dios
- 35 · josue | Narrador ← Dios
- 35 · lucas | Narrador ← Dios
- 29 · mateo | Narrador ← Jesús
- 25 · salmos | Narrador ← Dios
- 23 · exodus | Narrador ← Moisés
- 18 · jueces | Narrador ← Dios
- 17 · marcos | Narrador ← Jesús
- 16 · lucas | Narrador ← Jesús
- 15 · deuteronomio | Narrador ← Dios
- 15 · lucas | Narrador ← Discípulos
- 12 · salmos | Narrador ← Impíos

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

### Cubeta b — adjudicación doctrinal verso a verso (pendiente, 91)
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
- **Salmos doctrina (4.1):** salmista-Narrador vs oráculo genuino (salmos 18/50/60/99/110 del
  triage fase3).

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
