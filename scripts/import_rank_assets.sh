#!/usr/bin/env bash
# Imports Max's official rank art (folder fight-dynasty-assets, "VERSION 1") into public/ranks/.
# The art is used AS IS: no crop, no redraw. Only resized for phones (longest side 640 px for images,
# 480 px for videos) and re-encoded (webp / H.264) so the game stays light.
# Usage: scripts/import_rank_assets.sh "<path to fight-dynasty-assets>"
set -euo pipefail
SRC="${1:?assets folder}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/ranks"
mkdir -p "$OUT"
RANKS="bronze argent or platine diamant maitre champion dynasty"
for r in $RANKS; do
  for k in badge cadre; do
    f="$(ls "$SRC/$k-$r".png "$SRC/$k-$r".webp 2>/dev/null | head -1 || true)"
    [ -n "$f" ] || { echo "MANQUANT : $k-$r (.png/.webp)"; exit 1; }
    ffmpeg -v error -y -i "$f" -vf "scale='if(gt(iw,ih),min(640,iw),-2)':'if(gt(iw,ih),-2,min(640,ih))':flags=lanczos" -c:v libwebp -quality 90 "$OUT/$k-$r.webp"
  done
done
for r in diamant maitre champion dynasty; do
  for k in badge cadre; do
    f="$SRC/$k-$r-anim.mp4"
    [ -f "$f" ] || { echo "MANQUANT : $k-$r-anim.mp4"; exit 1; }
    ffmpeg -v error -y -i "$f" -an -vf "scale='if(gt(iw,ih),min(480,iw),-2)':'if(gt(iw,ih),-2,min(480,ih))':flags=lanczos,format=yuv420p" \
      -c:v libx264 -profile:v main -crf 24 -preset slow -movflags +faststart "$OUT/$k-$r-anim.mp4"
  done
done
du -ch "$OUT" | tail -1
