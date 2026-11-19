#!/bin/zsh
# gen_image.sh <out.png> <aspect> <prompt> [ref ...]
#
# One Nano Banana 2 image via the Higgsfield CLI (2k by default, 2 credits), downloaded and
# logged to the ledger. Every [ref] is passed as an image reference (downscaled to a 1600px JPEG
# first so uploads stay small). Use refs to chain keyframes: kf N+1 references kf N.
#
#   WORKDIR   project folder (default: current directory). The ledger lives here.
#   LEDGER    credit ledger (default: $WORKDIR/ledger.tsv)  ISO time, model, credits, job id, path
#   RES       1k | 2k | 4k (default 2k)
#
# Requires: higgsfield CLI (logged in), curl, python3, sips (macOS) or ImageMagick.
set -o pipefail
OUT=$1; AR=$2; PROMPT=$3; shift 3 2>/dev/null
[[ -z "$OUT" || -z "$AR" || -z "$PROMPT" ]] && { echo "usage: gen_image.sh <out.png> <aspect> <prompt> [ref ...]"; exit 1; }
WORKDIR=${WORKDIR:-$PWD}; LEDGER=${LEDGER:-$WORKDIR/ledger.tsv}; RES=${RES:-2k}
[[ "$OUT" = /* ]] || OUT="$PWD/$OUT"
mkdir -p "${OUT:h}"

small_jpeg() {  # <in> <out.jpg>
  if command -v sips >/dev/null; then sips -Z 1600 -s format jpeg -s formatOptions 88 "$1" --out "$2" >/dev/null 2>&1
  elif command -v magick >/dev/null; then magick "$1" -resize '1600x1600>' -quality 88 "$2"
  else cp "$1" "$2"; fi
}
REFS=()
for r in "$@"; do
  [[ -r "$r" ]] || { echo "ref not readable: $r"; exit 1; }
  j="${r%.*}.ref.jpg"; [[ -f "$j" ]] || small_jpeg "$r" "$j"
  REFS+=(--image "$j")
done

for attempt in 1 2; do
  # < /dev/null matters: the higgsfield CLI reads stdin and will swallow the rest of a while-read loop.
  RES_JSON=$(higgsfield generate create nano_banana_2 --prompt "$PROMPT" --aspect_ratio "$AR" --resolution "$RES" \
    "${REFS[@]}" --wait --wait-timeout 10m --json < /dev/null 2>&1)
  print -r -- "$RES_JSON" > "${OUT%.*}.job.json"      # persist the job the moment it exists
  URL=$(print -r -- "$RES_JSON" | python3 -c "import sys,re;s=sys.stdin.read();m=re.findall(r'https://[^\"\s]+\.(?:png|jpg|jpeg|webp)[^\"\s]*',s);print(m[-1] if m else '')")
  ID=$(print -r -- "$RES_JSON" | python3 -c "import sys,re;s=sys.stdin.read();m=re.findall(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',s);print(m[0] if m else '')")
  [[ -n "$URL" ]] && break
  if print -r -- "$RES_JSON" | grep -qi 'nsfw\|safety\|moderat\|policy'; then
    echo "SAFETY FILTER on $OUT. Rephrase: upright cylinders, tubes, pillars and rods trip it."
    echo "Try 'low wide drum', 'disc stack', 'round plinth', 'rounded block'. Not retrying the same prompt."
    exit 3
  fi
  echo "retry $OUT: $(print -r -- "$RES_JSON" | tail -3)"; sleep 10
done
[[ -z "$URL" ]] && { echo "FAIL $OUT"; exit 1; }
curl -fsSL -A "Mozilla/5.0" -o "$OUT" "$URL" || { echo "FAIL download $OUT (job id in ${OUT%.*}.job.json, do not pay twice)"; exit 1; }
printf "%s\tnano_banana_2\t2\t%s\t%s\n" "$(date -u +%FT%TZ)" "$ID" "$OUT" >> "$LEDGER"
echo "OK $OUT"
