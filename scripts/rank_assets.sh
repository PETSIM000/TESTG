#!/usr/bin/env bash
# Builds the rank badges and frames from Max's reference videos (one video per animated rank:
# badge on the left, profile frame on the right). Output goes to public/ranks/.
#   - black background crushed to pure black and edges faded out, so the clip melts into the dark UI
#     with `mix-blend-mode: screen` (no visible box);
#   - seamless loop (the last second cross-fades into the first);
#   - a still .webp of each for small sizes, low-end phones and reduced motion;
#   - Bronze -> Platine: still images re-tinted from the Champion art until Max supplies their own art.
# Usage: scripts/rank_assets.sh "<folder with the mp4 files>"
set -euo pipefail
SRC="${1:?source folder}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/ranks"
TMP="$(mktemp -d)"
mkdir -p "$OUT"
q() { ffmpeg -v error -y "$@"; }

# Soft-edged masks (white centre, black border) multiplied into every frame.
python -I "$ROOT/scripts/rank_masks.py" "$TMP"

CRUSH="curves=all='0/0 0.1/0 1/1'"
LOOP="split[a][b];[a]trim=1:10,setpts=PTS-STARTPTS[m];[b]trim=0:1,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=1:offset=8"
declare -A BADGE=([diamant]="480:620:0:0" [maitre]="480:620:0:0" [champion]="480:620:0:0" [dynasty]="672:672:0:0")
declare -A FRAME=([diamant]="736:736:510:0" [maitre]="736:736:510:0" [champion]="736:736:510:0" [dynasty]="672:672:672:0")
declare -A FILE=([diamant]=diamond [maitre]=master [champion]=champion [dynasty]=dynasty)
size() { if [ "$1" = badge ]; then [ "$2" = dynasty ] && echo "300:300" || echo "280:362"; else echo "320:320"; fi; }
mask() { if [ "$1" = badge ]; then [ "$2" = dynasty ] && echo "$TMP/round-300.png" || echo "$TMP/badge-280x362.png"; else echo "$TMP/round-320.png"; fi; }

for id in diamant maitre champion dynasty; do
  v="$(ls "$SRC"/media-generation-anime-${FILE[$id]}-badge-cadre-*.mp4 | head -1)"
  for kind in badge frame; do
    c=${BADGE[$id]}; [ $kind = frame ] && c=${FRAME[$id]}
    s=$(size $kind $id); mk=$(mask $kind $id)
    q -i "$v" -loop 1 -i "$mk" -filter_complex \
      "[0:v]$LOOP,crop=$c,scale=$s,$CRUSH,format=gbrp[v];[1:v]format=gbrp[k];[v][k]blend=all_mode=multiply:shortest=1,format=yuv420p" \
      -an -c:v libx264 -profile:v main -crf 28 -preset slow -movflags +faststart "$OUT/$id-$kind.mp4"
    q -ss 4 -i "$v" -i "$mk" -filter_complex \
      "[0:v]crop=$c,scale=$s,$CRUSH,format=gbrp[v];[1:v]format=gbrp[k];[v][k]blend=all_mode=multiply" \
      -frames:v 1 -c:v libwebp -quality 86 "$OUT/$id-$kind.webp"
  done
done

V="$(ls "$SRC"/media-generation-anime-champion-badge-cadre-*.mp4 | head -1)"
declare -A TINT=(
  [bronze]="hue=s=0,colorchannelmixer=1.08:0:0:0:0:.78:0:0:0:0:.58:0,eq=brightness=0.03:contrast=1.12:saturation=1.3"
  [argent]="hue=s=0,eq=brightness=0.06:contrast=1.15,colorchannelmixer=1:0:0:0:0:1:0:0:0:0:1.08:0"
  [or]="eq=saturation=0.85"
  [platine]="hue=s=0.25:h=170,eq=brightness=0.05:contrast=1.1,colorchannelmixer=.85:0:0:0:0:1:0:0:0:0:1.1:0"
)
for id in bronze argent or platine; do
  for kind in badge frame; do
    c=${BADGE[champion]}; [ $kind = frame ] && c=${FRAME[champion]}
    s=$(size $kind champion); mk=$(mask $kind champion)
    q -ss 4 -i "$V" -i "$mk" -filter_complex \
      "[0:v]crop=$c,scale=$s,${TINT[$id]},$CRUSH,format=gbrp[v];[1:v]format=gbrp[k];[v][k]blend=all_mode=multiply" \
      -frames:v 1 -c:v libwebp -quality 86 "$OUT/$id-$kind.webp"
  done
done
rm -rf "$TMP"
du -ch "$OUT" | tail -1
