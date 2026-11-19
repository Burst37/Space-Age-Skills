#!/bin/zsh
# gen_clip.sh <out.mp4> <credits> <model> [higgsfield params ...]
#
# One Higgsfield video job: create, persist the job id, wait, download, log to the ledger.
# The <credits> number is only what gets written to the ledger, so quote it from the price card.
#
#   gen_clip.sh hero.mp4 45 seedance_2_0 --mode std --resolution 1080p --duration 5 \
#     --start-image a.png --end-image b.png --generate_audio false --prompt "..."
#
#   WORKDIR / LEDGER as in gen_image.sh.
WORKDIR=${WORKDIR:-$PWD}; LEDGER=${LEDGER:-$WORKDIR/ledger.tsv}
OUT=$1; COST=$2; MODEL=$3; shift 3 2>/dev/null
[[ -z "$OUT" || -z "$COST" || -z "$MODEL" ]] && { echo "usage: gen_clip.sh <out.mp4> <credits> <model> [params...]"; exit 1; }
[[ "$OUT" = /* ]] || OUT="$PWD/$OUT"
mkdir -p "${OUT:h}"
uuid() { python3 -c "import sys,re;s=sys.stdin.read();m=re.findall(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',s);print(m[0] if m else '')"; }
mp4url() { python3 -c "import sys,re;s=sys.stdin.read();m=re.findall(r'https://[^\"\s]+\.mp4[^\"\s]*',s);print(m[-1] if m else '')"; }
for attempt in 1 2 3; do
  # resume: a job id on disk from an earlier run is waited on, not paid for again
  if [[ -s "${OUT%.*}.job-id" && $attempt == 1 ]]; then JID=$(cat "${OUT%.*}.job-id"); echo "resuming job $JID"
  else
    CREATE=$(higgsfield generate create $MODEL "$@" --json < /dev/null 2>&1)
    JID=$(print -r -- "$CREATE" | uuid)
    if [[ -z "$JID" ]]; then
      echo "no job id: $(print -r -- "$CREATE" | tail -c 300)"
      print -r -- "$CREATE" | grep -qi 'nsfw\|safety\|moderat\|policy' && { echo "SAFETY FILTER: rephrase upright cylinders/tubes/pillars (try drum, disc stack, plinth)."; exit 3; }
      sleep 20; continue
    fi
    print -r -- "$JID" > "${OUT%.*}.job-id"
  fi
  WAIT=$(higgsfield generate wait "$JID" --timeout 25m --interval 8s --json < /dev/null 2>&1)
  print -r -- "$WAIT" > "${OUT%.*}.wait.json"
  URL=$(print -r -- "$WAIT" | mp4url)
  if [[ -n "$URL" ]] && curl -fsSL -A "Mozilla/5.0" -o "$OUT" "$URL"; then
    printf "%s\t%s\t%s\t%s\t%s\n" "$(date -u +%FT%TZ)" "$MODEL" "$COST" "$JID" "$OUT" >> "$LEDGER"
    echo "OK $OUT $(ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames -of csv=p=0 "$OUT")"; exit 0
  fi
  rm -f "${OUT%.*}.job-id"
  echo "failed attempt $attempt (server-side failures are not billed; check the balance before retrying): $(print -r -- "$WAIT" | tail -c 300)"; sleep 15
done
echo "GAVE UP $OUT"; exit 1
