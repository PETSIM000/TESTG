#!/usr/bin/env bash
# Imports Max's official rank art (folder "fight-dynasty-assets V2") into public/ranks/.
# Badges and frames come from alpha/ (transparent PNG); animations (Diamant and up) from the root .mp4.
# The art is used AS IS: no crop, no redraw. Only resized for phones (longest side 640 px for images,
# 480 px for videos; plus a 128 px badge for list thumbnails). Videos: near-black lifted by
# compression is set back to pure black, so mix-blend-mode: screen leaves no visible square. and re-encoded (webp / H.264) so the game stays light.
# Usage: scripts/import_rank_assets.sh "<path to fight-dynasty-assets>"
set -euo pipefail
SRC="${1:?assets folder}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/ranks"
mkdir -p "$OUT"
RANKS="bronze argent or platine diamant maitre champion dynasty"
for r in $RANKS; do
  for k in badge cadre; do
    f="$SRC/alpha/$k-$r-alpha.png"
    [ -f "$f" ] || { echo "MANQUANT : alpha/$k-$r-alpha.png"; exit 1; }
    python -I -c "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGBA');im.thumbnail((640,640),Image.LANCZOS);im.save(sys.argv[2],'WEBP',quality=90,method=6)" "$f" "$OUT/$k-$r.webp"
    [ $k = badge ] && python -I -c "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGBA');im.thumbnail((128,128),Image.LANCZOS);im.save(sys.argv[2],'WEBP',quality=88,method=6)" "$f" "$OUT/$k-$r-sm.webp"
  done
done
for r in diamant maitre champion dynasty; do
  for k in badge cadre; do
    f="$SRC/$k-$r-anim.mp4"
    [ -f "$f" ] || { echo "MANQUANT : $k-$r-anim.mp4"; exit 1; }
    ffmpeg -v error -y -i "$f" -an -vf "scale='if(gt(iw,ih),min(480,iw),-2)':'if(gt(iw,ih),-2,min(480,ih))':flags=lanczos,curves=all='0/0 0.05/0 1/1',format=yuv420p" \
      -c:v libx264 -profile:v main -crf 24 -preset slow -movflags +faststart "$OUT/$k-$r-anim.mp4"
  done
done
du -ch "$OUT" | tail -1
