#!/usr/bin/env bash
# Extract one PNG per beat from an existing rendered video — instant feedback.
#
# Pulls from <video>.preview.mp4 (or .enhanced.mp4 if preview missing) using
# ffmpeg `-ss` seek + single-frame extract. ~0.3s per still, no Remotion
# bundle reload. Use AFTER a preview render to scrub the visual choices.
#
# Usage:
#   extract_stills.sh <video_path> [<variant>]
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "usage: extract_stills.sh <video_path> [variant]"
  exit 2
fi

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VIDEO_PATH="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
VARIANT="${2:-}"

WORKDIR=$(python3 -c "
import hashlib
from pathlib import Path
p = Path('$VIDEO_PATH').resolve()
digest = hashlib.sha1(str(p).encode()).hexdigest()[:12]
print(Path.home() / '.cache' / 'video-edit' / f'{p.stem[:40]}_{digest}')
")
PLAN_DIR="$WORKDIR${VARIANT:+/$VARIANT}"

# Pick the rendered video to extract from. Prefer .preview.mp4 (it has the
# beats but no audio score so the encoder is faster); fall back to
# .enhanced.mp4 if you've only rendered final.
BASE="${VIDEO_PATH%.*}"
SOURCE="$BASE.preview.mp4"
[ -f "$SOURCE" ] || SOURCE="$BASE.enhanced.mp4"
if [ ! -f "$SOURCE" ]; then
  echo "[fail] no $BASE.preview.mp4 or $BASE.enhanced.mp4 found."
  echo "       Run 'bash render.sh \"$VIDEO_PATH\"' first to render a preview."
  exit 1
fi

PLAN_PATH="$PLAN_DIR/broll_plan.json"
if [ ! -f "$PLAN_PATH" ]; then
  echo "[fail] no broll_plan.json at $PLAN_PATH"
  exit 1
fi

STILLS_DIR="$BASE.stills"
mkdir -p "$STILLS_DIR"
rm -f "$STILLS_DIR"/beat_*.png

# Walk beats, extract midpoint frame from the rendered MP4.
python3 - "$PLAN_PATH" > "$WORKDIR/.beat_times.tsv" <<'PY'
import json, sys
plan = json.load(open(sys.argv[1]))
for i, b in enumerate(plan):
    start = float(b.get("start_sec", 0))
    end = float(b.get("end_sec", start + 1))
    mid = start + (end - start) * 0.5
    kind = b.get("kind", "static")
    print(f"{i:02d}\t{mid:.3f}\t{kind}")
PY

BEAT_COUNT=$(wc -l < "$WORKDIR/.beat_times.tsv" | tr -d ' ')
echo "==> Extracting $BEAT_COUNT stills from $(basename "$SOURCE") -> $STILLS_DIR"

while IFS=$'\t' read -r idx ts kind; do
  out="$STILLS_DIR/beat_${idx}_${kind}.png"
  echo "  beat $idx ($kind) t=${ts}s -> $(basename "$out")"
  ffmpeg -y -ss "$ts" -i "$SOURCE" -frames:v 1 -q:v 2 "$out" 2>/dev/null
done < "$WORKDIR/.beat_times.tsv"

rm -f "$WORKDIR/.beat_times.tsv"

echo "==> Done. open '$STILLS_DIR'"
