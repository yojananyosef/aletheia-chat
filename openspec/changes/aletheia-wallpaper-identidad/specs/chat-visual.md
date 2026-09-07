# Spec: chat-visual — muro del feed

## ADDED Requirements

### Requirement: Muro legible con textura propia
El feed SHALL usar un fondo papel cálido (`#F7F4ED`) con patrón de motas del dominio
(`/chat-pattern.svg`, tile 480px) cuya tinta no supere ~6% de opacidad, de modo que las
burbujas (Narrador, Dios, personajes) mantengan el contraste sin cambios. El patrón SHALL
derivarse del mismo lenguaje visual (línea `#0A0A0A`, esquinas redondeadas) que el resto
de la interfaz.

#### Scenario: lectura sobre el muro
- GIVEN `/genesis/1` renderizado
- WHEN se inspecciona `.chat-feed`
- THEN su `background-color` es `#F7F4ED` con `background-image /chat-pattern.svg` a 480px,
  y las burbujas conservan sus fondos sólidos.

### Requirement: Iconografía unificada v2
En el logo la estrella de 4 puntas SHALL ser blanca y SHALL quedar sobre la burbuja sin
solapar el libro. Todos los iconos SHALL regenerarse desde el maestro con
`scripts/brand/build-icons.sh`.

#### Scenario: regeneración post-ajuste
- WHEN se ejecuta el script de marca
- THEN favicon, icon.svg, apple-icon, PWA 192/512 y og-image reflejan la estrella v2.
