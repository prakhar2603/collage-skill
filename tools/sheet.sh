#!/bin/sh
# Contact sheet of every image in a folder, so you can look at them in one go.
#   sh sheet.sh <folder> <out.jpg> [background]      background: white (default) or red (use red for cutouts)
set -e; D="$1"; O="$2"; BG="${3:-white}"; [ "$BG" = red ] && BG=0xD9352B
T="$(mktemp -d)"; n=0
for f in "$D"/*.jpg "$D"/*.jpeg "$D"/*.png "$D"/*.webp; do [ -f "$f" ] || continue
  ffmpeg -v error -y -f lavfi -i "color=c=$BG:s=360x300" -i "$f" -filter_complex "[1:v]scale=360:300:force_original_aspect_ratio=decrease[a];[0:v][a]overlay=(W-w)/2:(H-h)/2,format=yuvj420p" -frames:v 1 "$T/$(printf %03d $n).jpg"
  echo "$n: $(basename "$f")"; n=$((n+1)); done
[ "$n" -gt 0 ] || { echo "no images in $D"; exit 1; }
c=5; r=$(( (n + c - 1) / c ))
ffmpeg -v error -y -i "$T/%03d.jpg" -vf "tile=${c}x${r}" -frames:v 1 "$O"; rm -rf "$T"; echo "-> $O  (read left to right, top to bottom, in the order listed)"
