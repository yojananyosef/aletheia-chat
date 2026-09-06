# qa-report.md — barrido 2026-09-06 (post-fix vocabulario)

Generado con `node scripts/attribute-speakers/qa-sweep.mjs` · exit 0 · 24 libros · 25.306 mensajes.

## Resumen por libro

| libro | msgs | revisado | sospechoso | ambiguo-sin-revisar |
|---|---|---|---|---|
| genesis | 2127 | 380 | 119 | 126 |
| exodus | 1460 | 104 | 376 | 225 |
| levitico | 905 | 124 | 8 | 8 |
| numeros | 1444 | 191 | 253 | 253 |
| deuteronomio | 1047 | 933 | 15 | 22 |
| josue | 760 | 113 | 48 | 54 |
| jueces | 887 | 158 | 50 | 64 |
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
| job | 1124 | 68 | 734 | 240 |
| salmos | 2664 | 119 | 38 | 38 |
| jonas | 68 | 22 | 4 | 4 |
| mateo | 1464 | 299 | 51 | 68 |
| marcos | 952 | 191 | 39 | 39 |
| lucas | 1576 | 402 | 84 | 100 |
| juan | 1303 | 187 | 103 | 123 |
| **total** | **25306** | **4935** | **1971** | **1436** |

`revisado` = divergencia dry↔aplicado respaldada por `reviewed/`. `sospechoso` = sin respaldo.
`ambiguo-sin-revisar` = ambiguos del dry actual publicados con el default y sin entrada `reviewed/`.

Integridad: **0** capitulo-faltante · 0 capitulo-extra · 0 texto-perdido · 0 schema · 0 id-duplicado · **0** vocabulario-invalido.

## Sospechosos por cluster (aplicado ← dry, sin respaldo reviewed/)

- 379 · job | Job ← Narrador
- 255 · exodus | Dios ← Narrador
- 248 · numeros | Narrador ← Dios
- 102 · job | Eliú ← Narrador
- 89 · exodus | Narrador ← Dios
- 78 · genesis | Narrador ← Dios
- 78 · juan | Narrador ← Jesús
- 74 · job | Elifaz ← Narrador
- 63 · job | Dios ← Narrador
- 38 · job | Bildad ← Narrador
- 36 · job | Zofar ← Narrador
- 35 · josue | Narrador ← Dios
- 35 · lucas | Narrador ← Dios
- 29 · mateo | Narrador ← Jesús
- 25 · salmos | Narrador ← Dios
- 24 · job | Eliú ← Dios
- 23 · exodus | Narrador ← Moisés
- 18 · jueces | Narrador ← Dios
- 17 · marcos | Narrador ← Jesús
- 16 · lucas | Narrador ← Jesús

## Triaje (cubetas del tasks.md)

### Cubeta a — resuelta en este barrido
- `CanonicalSpeaker` sin `Asael` (2samuel), `Asa`/`Reina` (2cronicas) → añadidos a `Message.ts`.
- `books.ts` sin `Mujer` (genesis), sin `Hija de Herodías`/`Ancianos` (mateo) → añadidos.
- Tras los fixes: 0 vocabulario-invalido.

### Cubeta a2 — backfill mecánico de `reviewed/` (doctrina vigente respalda el aplicado)
La voz aplicada es doctrinalmente correcta y el dry actual solo la pierde por mejoras posteriores de
la heurística (carryover se introdujo DESPUÉS de integrar estos libros). Proteger contra
regeneraciones volcando el aplicado a `reviewed/<libro>-<cap>.json` (mismo speaker, confidence 0.85):
- `job` (734): ciclos de discurso Job/Elifaz/Bildad/Zofar/Eliú — quien mueve la boca en escena.
- `exodus` Dios←Narrador (255): instrucciones del tabernáculo/ley en 1ª persona divina (Éx 25-31, 35-40).
- `exodus` Moisés←Narrador (23): Moisés habla en 1ª persona divina (doctrina del triage fase3).

### Cubeta b — adjudicación doctrinal verso a verso (requiere leer el texto)
- `numeros` Narrador←Dios (248) y resto AT (genesis 78, josue 35, jueces 18…): carryover divino
  ("Y habló Jehová a Moisés, diciendo:") llegó después de la integración. Método del triage fase3:
  volcado aplicado vs dry por capítulo, adjudicar, `reviewed/` + `--apply --write`, verificación
  2ª pasada 0 fusionados. Prioridad: Números (253), Génesis (126), Josué (48), Jueces (50).
- Evangelios Narrador←Jesús/Dios (283 en total): doctrina del relator conserva voz. Empezar por
  `juan 9` (sospecha de bug real documentada en el triage fase3), luego mateo 15/26, lucas 9,
  marcos 14, juan 18.
- `salmos` (38) + 1.436 ambiguo-sin-revisar: clusters doctrinales del triage fase3 (salmos 18/50/60/99/110)
  más deuda de review en capítulos publicados (numeros 253, job 240, exodus 225…).

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
