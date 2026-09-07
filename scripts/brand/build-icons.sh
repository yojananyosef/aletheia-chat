#!/usr/bin/env bash
# Deriva todos los iconos de marca desde public/logo.svg (fuente única).
# Requisitos: librsvg (rsvg-convert) e ImageMagick (magick).
set -euo pipefail
cd "$(dirname "$0")/../.."

SRC=public/logo.svg
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Icono SVG del app (favicon vectorial, browsers modernos)
cp "$SRC" app/icon.svg

# Iconos PWA
rsvg-convert -w 512 -h 512 "$SRC" -o public/icon-512.png
rsvg-convert -w 192 -h 192 "$SRC" -o public/icon-192.png

# Apple touch icon (iOS usa 180x180)
rsvg-convert -w 180 -h 180 "$SRC" -o app/apple-icon.png

# favicon.ico multi-resolución (16/32/48)
for s in 16 32 48; do
  rsvg-convert -w "$s" -h "$s" "$SRC" -o "$TMP/icon-$s.png"
done
magick "$TMP/icon-16.png" "$TMP/icon-32.png" "$TMP/icon-48.png" app/favicon.ico

# Open Graph image (1200x630)
rsvg-convert -w 1200 -h 630 scripts/brand/opengraph.svg -o app/opengraph-image.png

echo "Iconos regenerados desde $SRC"
