#!/usr/bin/env bash
# Render an enhanced version of a pre-edited captioned video by overlaying
# b-roll images and applying zoom punch-ins on top of the source.
#
# Usage:
#   render.sh <video_path>
#
# Requires (in workdir under ~/.cache/video-edit/):
#   broll_plan.json   (Claude-curated)
#   zoom_plan.json    (zoom_plan.py output, can be edited)
#   broll/<n>.png     (Higgsfield-generated b-roll images)
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTION_DIR="$SKILL_DIR/remotion"

# Serialize concurrent renders. The Remotion install at $REMOTION_DIR has a
# single shared `src/props.json` and `public/` dir — running two renders at
# once corrupts both AND a 4K final render is heavy enough that two at once
# thrash the machine (load avg 80+). The lock path MUST be machine-global:
# `$TMPDIR` is per-process on macOS (`/var/folders/.../T/`), so two renders
# launched from separate shells got DIFFERENT lock files and never saw each
# other — exactly the concurrent-render pileup seen May 22 2026. Hardcode
# `/tmp` (shared, stable) so every render on the box contends one lock.
LOCK_FILE="/tmp/video-edit-render.lock"
if [ -z "${VIDEO_EDIT_RENDER_LOCKED:-}" ] && command -v flock >/dev/null 2>&1; then
  export VIDEO_EDIT_RENDER_LOCKED=1
  exec flock -x "$LOCK_FILE" bash "$0" "$@"
fi
# macOS doesn't ship flock by default; fall back to a hand-rolled spin-lock.
# PID-aware + self-healing: the holder writes its PID into the lock dir; a
# waiter whose holder PID is dead STEALS the lock. Without this, a render
# killed with SIGKILL (traps don't run) strands the lock dir and every
# future render spins forever — which is exactly what happens during batch
# work when a batch gets stopped.
if ! command -v flock >/dev/null 2>&1; then
  while ! mkdir "$LOCK_FILE.d" 2>/dev/null; do
    holder=$(cat "$LOCK_FILE.d/pid" 2>/dev/null || true)
    if [ -n "$holder" ] && ! kill -0 "$holder" 2>/dev/null; then
      echo "[lock] stealing stale lock from dead pid $holder"
      rm -rf "$LOCK_FILE.d" 2>/dev/null || true
      continue
    fi
    sleep 1
  done
  echo "$$" > "$LOCK_FILE.d/pid"
  trap 'rm -rf "$LOCK_FILE.d" 2>/dev/null || true' EXIT
fi

if [ -z "${1:-}" ]; then
  echo "usage: render.sh <video_path> [variant]"
  echo "  variant: optional subdir under workdir for plan files (e.g., 'approachA')"
  echo "           reads <workdir>/<variant>/broll_plan.json  -> outputs <video>.<variant>.mp4"
  echo "           omitted -> reads <workdir>/broll_plan.json -> outputs <video>.enhanced.mp4"
  exit 2
fi

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
mkdir -p "$PLAN_DIR"

if [ ! -f "$PLAN_DIR/broll_plan.json" ]; then
  echo "[warn] no $PLAN_DIR/broll_plan.json — rendering without b-roll"
  echo "[]" > "$PLAN_DIR/broll_plan.json"
fi

# ── PLAN SOURCE PRESERVATION ───────────────────────────────────────────
# align_to_speech.py, sync_list_items.py, and close_gaps.py REWRITE
# broll_plan.json in place. Without a frozen source-of-truth, every render
# reads the previously-mutated values as the new "authored" intent — so
# long beats silently shrink across renders (scene-6's 18s vertical_timeline
# was clobbered to 1.5s after one render, May 22 2026). Fix: freeze the
# authored plan to broll_plan.source.json on first render (and whenever the
# author hand-edits broll_plan.json — detected by content diff), then
# RESTORE from source.json at the start of every render so mutations never
# leak across renders. End-of-render also restores so the next render's
# diff check doesn't see mutation residue as "user-edited".
SRC_PLAN="$PLAN_DIR/broll_plan.source.json"
if [ -f "$PLAN_DIR/broll_plan.json" ]; then
  if [ ! -f "$SRC_PLAN" ] || ! cmp -s "$PLAN_DIR/broll_plan.json" "$SRC_PLAN"; then
    cp "$PLAN_DIR/broll_plan.json" "$SRC_PLAN"
    echo "[plan] froze authored plan -> $(basename "$SRC_PLAN")"
  fi
  # Always start each render from the frozen source.
  cp "$SRC_PLAN" "$PLAN_DIR/broll_plan.json"
fi

# Lint the plan: every entry needs a `reason`, list entries need items, etc.
# Errors abort render; warnings are surfaced and continue.
# Snap each beat with a `speech_anchor` to actual word boundaries in
# words.json. Also auto-derives quote_pull typewriter cadence so typing
# finishes around when the speaker finishes the quote.
if [ -f "$WORKDIR/words.json" ]; then
  # AI-powered transcript polish: catches context-dependent mishearings
  # (failed↔filled, skill↔scale, Claude↔Club, routine↔routing) that the
  # deterministic Cloud→Claude pass in transcribe.py can't disambiguate.
  # Skipped silently if ANTHROPIC_API_KEY isn't set.
  #
  # RUNS ONCE ONLY. polish is NOT idempotent — it re-corrects the transcript
  # against the AUDIO every time, so any MANUAL fix a human makes to
  # words.json afterwards (e.g. "Gemini"→"Hermes" for a brand the model
  # can't know) gets silently reverted on the next render. The .polished
  # marker locks the transcript after the first pass; delete it to re-polish.
  if [ ! -f "$WORKDIR/.polished" ]; then
    python3 "$SKILL_DIR/scripts/polish_transcript.py" "$WORKDIR/words.json" || true
    touch "$WORKDIR/.polished"
  fi
  # Script-match: if the canonical script for this video is on disk
  # (<workdir>/script.txt — written by the agent from the content DB's
  # `content_pieces.script` field), align the transcript to it. This makes
  # the REAL script the source of truth for words — no more guessing brand
  # names. align_transcript_to_script.py only adopts script words where the
  # two locally disagree by a short span (a mishearing); genuine spoken
  # deviations are left alone. Runs once, or again whenever script.txt is
  # updated (newer than the marker).
  if [ -f "$WORKDIR/script.txt" ] \
     && { [ ! -f "$WORKDIR/.script_matched" ] \
          || [ "$WORKDIR/script.txt" -nt "$WORKDIR/.script_matched" ]; }; then
    python3 "$SKILL_DIR/scripts/align_transcript_to_script.py" \
      "$WORKDIR/words.json" "$WORKDIR/script.txt" || true
    touch "$WORKDIR/.script_matched"
  fi
  python3 "$SKILL_DIR/scripts/align_to_speech.py" "$PLAN_DIR/broll_plan.json" "$WORKDIR/words.json" || true
  # Pin every list-overlay item's appear_sec to the moment the speaker actually
  # says it (in addition to the speech_anchor snap above). Crucially, this also
  # extends list `end_sec` past the LAST item's appear_sec + 1.5s dwell — without
  # this, lists whose anchor only covers the intro phrase ("the skill was three
  # pages") silently drop later items because the Sequence already ended.
  python3 "$SKILL_DIR/scripts/sync_list_items.py" "$PLAN_DIR/broll_plan.json" "$WORKDIR/words.json" || true
fi

# Auto-fix micro-gaps (<0.5s) between adjacent beats so the speaker layer
# doesn't flash through for a fraction of a second between cuts.
python3 "$SKILL_DIR/scripts/close_gaps.py" "$PLAN_DIR/broll_plan.json" || true

python3 "$SKILL_DIR/scripts/lint_plan.py" "$PLAN_DIR/broll_plan.json" "$VIDEO_PATH" || {
  echo "[fail] broll_plan.json failed lint — fix the errors above before rendering."
  echo "       (override: SKIP_LINT=1 bash render.sh ...)"
  if [ "${SKIP_LINT:-0}" != "1" ]; then exit 1; fi
  echo "[warn] SKIP_LINT=1 — rendering anyway."
}
# Zoom plan is shared across variants — lives at workdir root. We build it
# from transcript-emphasis cues (zoom_plan.py) so emphasis MOMENTS get a gentle
# punch-in. In follow-cam mode these are LAYERED ON TOP of the drifting camera
# (EditedVideo multiplies globalScale into the follow transform); in CAMERA=zoom
# mode they ARE the camera. Disable entirely with ZOOM=0.
if [ "${ZOOM:-1}" = "0" ]; then
  echo "[]" > "$WORKDIR/zoom_plan.json"
  echo "==> ZOOM=0 — no emphasis zoom punches"
elif [ -f "$WORKDIR/words.json" ]; then
  echo "==> Building emphasis zoom plan (transcript cues)…"
  python3 "$SKILL_DIR/scripts/zoom_plan.py" "$VIDEO_PATH" \
    || { echo "[warn] zoom_plan.py failed — no zoom punches"; echo "[]" > "$WORKDIR/zoom_plan.json"; }
elif [ ! -f "$WORKDIR/zoom_plan.json" ]; then
  echo "[warn] no $WORKDIR/words.json — rendering without zoom punches"
  echo "[]" > "$WORKDIR/zoom_plan.json"
fi

# Probe ORIGINAL source: width,height,fps, duration
PROBE_STREAM=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,avg_frame_rate \
  -of csv=p=0 "$VIDEO_PATH")
WIDTH=$(echo "$PROBE_STREAM" | python3 -c "import sys; print(sys.stdin.read().split(',')[0])")
HEIGHT=$(echo "$PROBE_STREAM" | python3 -c "import sys; print(sys.stdin.read().split(',')[1])")
FPS=$(echo "$PROBE_STREAM" | python3 -c "import sys; r=sys.stdin.read().split(',')[2].strip(); n,d=r.split('/') if '/' in r else (r,'1'); print(round(int(n)/int(d)))")
DURATION=$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$VIDEO_PATH")
echo "Source: ${WIDTH}x${HEIGHT} @ ${FPS}fps  ${DURATION}s"

# ── QUALITY mode (preview-by-default for fast iteration) ───────────────
# preview = 720p comp + 720p source proxy + no audio score + CRF 26 fast preset
# final   = source-res comp + full source + full audio score + CRF 20 medium preset
# Defined here (before asset staging) because the source proxy depends on it.
QUALITY="${QUALITY:-preview}"
case "$QUALITY" in
  preview)
    if [ "$WIDTH" -gt "$HEIGHT" ]; then
      RENDER_W=1280; RENDER_H=720
    else
      RENDER_W=720; RENDER_H=1280
    fi
    RENDER_CRF=26
    RENDER_PRESET=fast
    # Audio score skipped in preview for fast iteration (~10-30s saved per
    # render). Final mode always scores. Override with SCORE=1 to force
    # music on a preview render when you want to QA the audio bed too.
    DO_SCORE=0
    OUT_SUFFIX="preview"
    ;;
  final)
    # 1080p is the platform spec for YT Shorts / IG Reels / TikTok — going
    # higher gets DOWNSCALED on upload and burns 4× the render time for no
    # visible gain. Codified May 23 2026 ("shouldn't we just render them
    # in 1080p? that's good enough for shorts right" — yes).
    if [ "$WIDTH" -gt "$HEIGHT" ]; then
      RENDER_W=1920; RENDER_H=1080
    else
      RENDER_W=1080; RENDER_H=1920
    fi
    RENDER_CRF=20
    RENDER_PRESET=medium
    DO_SCORE=1
    OUT_SUFFIX="enhanced"
    ;;
  4k)
    # Native-resolution master for YouTube long-form / intros — keeps the 4K
    # source quality (NOT a short, so the 1080p rationale doesn't apply).
    # Renders the comp at the source resolution; full audio score.
    if [ "$WIDTH" -gt "$HEIGHT" ]; then
      RENDER_W=3840; RENDER_H=2160
    else
      RENDER_W=2160; RENDER_H=3840
    fi
    RENDER_CRF=17
    RENDER_PRESET=medium
    DO_SCORE=1
    OUT_SUFFIX="enhanced"
    ;;
  *)
    echo "[fail] unknown QUALITY=$QUALITY (expected 'preview', 'final', or '4k')"
    exit 1
    ;;
esac
echo "==> QUALITY=$QUALITY  comp=${RENDER_W}x${RENDER_H}  crf=$RENDER_CRF  preset=$RENDER_PRESET  score=$DO_SCORE"

# Stage assets in remotion/public/<job>/ using hardlinks
JOB_HASH=$(echo -n "${VIDEO_PATH}|${VARIANT}" | shasum | cut -c1-8)
JOB_ID="job-$JOB_HASH"
PUB="$REMOTION_DIR/public/$JOB_ID"
rm -rf "$PUB"
mkdir -p "$PUB/broll"

VIDEO_EXT="${VIDEO_PATH##*.}"

# Pre-downscale source whenever it's bigger than the render. The 4K decode-
# per-frame is the dominant cost in a Remotion render (we sample every frame
# to get the speaker layer); rendering the comp at 1080p doesn't help that.
# Pre-scaling the source ONCE and reusing it for subsequent renders typically
# 4-6×s the per-render time. Applies to BOTH preview AND final modes — was
# preview-only originally; extended May 23 2026 after a final render took
# 10+ min decoding 4K per frame to output 1080p (waste).
#
# Cache key includes the render resolution so preview (720p proxy) and final
# (1080p proxy) get separate cached files.
EFFECTIVE_VIDEO="$VIDEO_PATH"
# Use the SHORT dimension as the proxy size — for portrait 9:16 the short
# side is the width (e.g. 720 or 1080). For landscape it's the height.
PROXY_SHORT="$([ "$WIDTH" -lt "$HEIGHT" ] && echo "$RENDER_W" || echo "$RENDER_H")"
SRC_SHORT="$([ "$WIDTH" -lt "$HEIGHT" ] && echo "$WIDTH" || echo "$HEIGHT")"
if [ "$SRC_SHORT" -gt "$PROXY_SHORT" ]; then
  PROXY_SRC="$WORKDIR/source_${PROXY_SHORT}p.mp4"
  # Regenerate if missing, stale, OR CORRUPT. A render killed mid-downscale
  # leaves a partial proxy ("moov atom not found"); without the validity
  # check render.sh would reuse it forever and every render would fail in
  # the compositor. ffprobe is the cheap gate.
  if [ ! -f "$PROXY_SRC" ] || [ "$VIDEO_PATH" -nt "$PROXY_SRC" ] \
     || ! ffprobe -v error "$PROXY_SRC" >/dev/null 2>&1; then
    echo "==> Pre-downscaling source $WIDTH×$HEIGHT → ${PROXY_SHORT}p (one-time, cached at $PROXY_SRC)"
    rm -f "$PROXY_SRC"
    # scale -2 keeps aspect ratio; scale to PROXY_SHORT on the short side.
    SCALE_EXPR="$([ "$WIDTH" -lt "$HEIGHT" ] && echo "${PROXY_SHORT}:-2" || echo "-2:${PROXY_SHORT}")"
    ffmpeg -y -i "$VIDEO_PATH" \
      -vf "scale=${SCALE_EXPR}" \
      -c:v h264 -crf 22 -preset veryfast \
      -c:a copy \
      "$PROXY_SRC" 2>&1 | grep -E "frame=|^Output" | tail -1
  fi
  EFFECTIVE_VIDEO="$PROXY_SRC"
fi

ln "$EFFECTIVE_VIDEO" "$PUB/source.${VIDEO_EXT}" 2>/dev/null || cp "$EFFECTIVE_VIDEO" "$PUB/source.${VIDEO_EXT}"

# Speaker cutout (text-behind-subject). If any beat in the plan is flagged
# `behind_subject`, we need an alpha-matte cutout of the speaker. Segmentation
# is slow (~0.3s/frame) so the result is cached in the workdir keyed on the
# source; re-renders reuse it. Staged as cutout.webm next to source.
NEEDS_CUTOUT=$(python3 -c "
import json
try:
    plan = json.load(open('$PLAN_DIR/broll_plan.json'))
    print('1' if any(b.get('behind_subject') for b in plan) else '0')
except Exception:
    print('0')
")
# Camera mode. Default is `follow` — a motion-tracked pan+zoom that drifts
# with the speaker (the zoom punch-ins are retired as the default; set
# CAMERA=zoom to get them back). Follow-cam derives its track straight from
# the video (fast sparse sampling) — it does NOT need the full speaker matte.
# The matte (segment_speaker.py, slow) only runs when a behind_subject beat
# actually needs it.
CAMERA="${CAMERA:-follow}"
SPEAKER_CUTOUT_REL=""
if [ "$NEEDS_CUTOUT" = "1" ]; then
  CUTOUT_CACHE="$WORKDIR/speaker_cutout"
  if [ ! -f "$CUTOUT_CACHE/manifest.txt" ] || [ "$VIDEO_PATH" -nt "$CUTOUT_CACHE/manifest.txt" ]; then
    echo "==> Segmenting speaker for text-behind-subject (one-time, cached)…"
    "$SKILL_DIR/.venv/bin/python" "$SKILL_DIR/scripts/segment_speaker.py" \
      "$VIDEO_PATH" "$CUTOUT_CACHE" --width "$RENDER_W" --height "$RENDER_H" \
      || echo "[warn] segmentation failed — text-behind-subject disabled this render"
  fi
  if [ -f "$CUTOUT_CACHE/manifest.txt" ]; then
    mkdir -p "$PUB/cutout"
    # Hardlink every frame (fast, no copy); fall back to cp per file.
    for f in "$CUTOUT_CACHE"/frame_*.png; do
      ln "$f" "$PUB/cutout/$(basename "$f")" 2>/dev/null || cp "$f" "$PUB/cutout/$(basename "$f")"
    done
    SPEAKER_CUTOUT_REL="$JOB_ID/cutout"
  fi
fi

# Follow-cam track — CACHED (a "loose part"). The track depends ONLY on the
# source video + FOLLOW_SCALE + FOLLOW_STRENGTH — nothing in broll_plan.json
# or the templates. So it's keyed on exactly those three: a changed scale
# rebuilds it, but an iteration where you only touched a plan or a template
# reuses the cached track instantly instead of burning 15-20s rebuilding an
# identical track. Delete .followcam.key (or change a param) to force it.
FC_CACHE="$WORKDIR/followcam_plan.json"
FC_KEY="$WORKDIR/.followcam.key"
if [ "$CAMERA" = "follow" ]; then
  FC_WANT="$(date -r "$VIDEO_PATH" +%s 2>/dev/null || echo 0)|${FOLLOW_SCALE:-1.1}|${FOLLOW_STRENGTH:-0.7}|${FOLLOW_VBIAS:-7}"
  if [ -f "$FC_CACHE" ] && [ "$(cat "$FC_KEY" 2>/dev/null || true)" = "$FC_WANT" ]; then
    echo "==> Follow-cam track — cache hit (source + params unchanged), reusing"
  else
    echo "==> Building follow-cam track (fast — sparse sample)…"
    if "$SKILL_DIR/.venv/bin/python" "$SKILL_DIR/scripts/build_followcam.py" \
        "$FC_CACHE" --video "$VIDEO_PATH" \
        --scale "${FOLLOW_SCALE:-1.1}" --follow "${FOLLOW_STRENGTH:-0.7}" \
        --head-room "${FOLLOW_VBIAS:-7}"; then
      echo "$FC_WANT" > "$FC_KEY"
    else
      echo "[warn] followcam build failed — falling back to zoom"
      rm -f "$FC_CACHE" "$FC_KEY"
    fi
  fi
else
  rm -f "$FC_CACHE" "$FC_KEY"
fi

# Stage assets referenced in broll_plan.json. Look in: <plan_dir>, <plan_dir>/broll,
# <workdir>, <workdir>/broll, <workdir>/motion. Copies any .png/.jpg/.mp4/.webm.
python3 - "$PLAN_DIR" "$WORKDIR" "$PUB/broll" "$SKILL_DIR" <<'PY'
import json, os, sys, shutil
plan_dir, workdir, pub_broll, skill_dir = sys.argv[1:]
plan = json.load(open(os.path.join(plan_dir, "broll_plan.json")))
search = [
    plan_dir,
    os.path.join(plan_dir, "broll"),
    workdir,
    os.path.join(workdir, "broll"),
    os.path.join(workdir, "motion"),
    os.path.join(workdir, "seedance"),
    os.path.join(workdir, "icons"),
    # Shared logo library — central place for brand/tool logos that get
    # referenced across many scenes. Authored as `image_path: "logos/x.png"`
    # in plans. Added May 23 2026 so we don't have to copy 15+ logos into
    # each scene's workdir.
    os.path.join(skill_dir, "assets", "logos"),
]
def asset_paths(b):
    """Return list of all asset paths a beat references."""
    out = []
    for key in ("image_path", "app_icon", "before_image", "after_image",
                "logo_path"):
        v = b.get(key)
        if v:
            out.append(v)
    # logo_paths (array form for hook_title lockups) — each entry is its own asset
    for v in (b.get("logo_paths") or []):
        if v:
            out.append(v)
    # portrait_burst / tool_logo_burst keep image paths on each item:
    # items: [{image_path, label?, appear_sec}, ...]
    if b.get("kind") in ("portrait_burst", "tool_logo_burst", "broll_picker"):
        for it in b.get("items", []):
            if isinstance(it, dict) and it.get("image_path"):
                out.append(it["image_path"])
    return out

needed = []
for b in plan:
    needed.extend(asset_paths(b))
for img_path in needed:
    name = os.path.basename(img_path)
    if not name:
        continue
    found = None
    for d in search:
        cand = os.path.join(d, name)
        if os.path.exists(cand):
            found = cand
            break
    if not found:
        print(f"[warn] asset not found for: {name}")
        continue
    dst = os.path.join(pub_broll, name)
    try:
        os.link(found, dst)
    except (OSError, FileExistsError):
        if not os.path.exists(dst):
            shutil.copyfile(found, dst)
    print(f"  staged {name} <- {found}")
PY

# Invalidate Remotion bundle cache so new public/ assets get picked up
rm -rf "$REMOTION_DIR/node_modules/.cache" 2>/dev/null || true

KEN_BURNS="${KEN_BURNS_INTENSITY:-1.15}"
ZOOM_EASE="${ZOOM_EASE_FRAMES:-8}"

# Build the captions plan from words.json (YouTube-intro mode).
# Skipped silently if words.json is missing OR the source has captions
# already burned in (legacy shorts pipeline). Writes captions_plan.json
# next to broll_plan.json. Emphasis phrases come via CAPTION_EMPHASIS env
# var (pipe-separated). Suppress entirely with INTRO_MODE=0.
INTRO_MODE_DEFAULT=0
# Auto-default: 16:9 sources are almost always YT longform (no burned captions).
if [ "$WIDTH" -gt "$HEIGHT" ]; then INTRO_MODE_DEFAULT=1; fi
INTRO_MODE="${INTRO_MODE:-$INTRO_MODE_DEFAULT}"
# CAPTIONS: spoken-word caption track. Defaults ON — every short gets
# captions of everything said (the comp hides them during full-screen
# takeovers; see EditedVideo filteredCaptions). Set CAPTIONS=0 only when the
# source ALREADY has captions burned in.
CAPTIONS="${CAPTIONS:-1}"
if { [ "$INTRO_MODE" = "1" ] || [ "$CAPTIONS" = "1" ]; } && [ -f "$WORKDIR/words.json" ]; then
  # Shorts (portrait) use the cinematic word-punch cadence: ≤3 words/line.
  CAP_MAXWORDS=0
  if [ "$WIDTH" -lt "$HEIGHT" ]; then CAP_MAXWORDS=3; fi
  python3 "$SKILL_DIR/scripts/captions_plan.py" \
    "$WORKDIR/words.json" \
    "$PLAN_DIR/captions_plan.json" \
    --emphasis "${CAPTION_EMPHASIS:-}" --max-words "$CAP_MAXWORDS" \
    || echo "[warn] captions_plan.py failed; rendering without captions"
elif [ ! -f "$PLAN_DIR/captions_plan.json" ]; then
  echo "[]" > "$PLAN_DIR/captions_plan.json"
fi

# Build props.json — comp width/height come from RENDER_W/H, not the source.
# In preview mode this is 720p; in final mode it's the source resolution.
# OffthreadVideo auto-scales the source video to fit the comp dimensions.
python3 - "$PLAN_DIR" "$WORKDIR" "$JOB_ID" "$VIDEO_EXT" "$FPS" "$RENDER_W" "$RENDER_H" "$DURATION" \
  "$KEN_BURNS" "$ZOOM_EASE" "$REMOTION_DIR/src/props.json" "$SPEAKER_CUTOUT_REL" <<'PY'
import json, sys, os
(plan_dir, workdir, job_id, video_ext, fps, w, h, duration,
 ken_burns, zoom_ease, out_props, speaker_cutout_rel) = sys.argv[1:]
fps, w, h = int(fps), int(w), int(h)
duration = float(duration)

broll_plan = json.load(open(os.path.join(plan_dir, "broll_plan.json")))
zoom_plan = json.load(open(os.path.join(workdir, "zoom_plan.json")))
fc_path = os.path.join(workdir, "followcam_plan.json")
followcam_plan = json.load(open(fc_path)) if os.path.exists(fc_path) else None
caps_path = os.path.join(plan_dir, "captions_plan.json")
captions_plan = json.load(open(caps_path)) if os.path.exists(caps_path) else []

broll_out = []
# Kinds that ABSOLUTELY require an image_path on disk. The rest of the
# template-library kinds are programmatic and have no image.
IMAGE_REQUIRED = {"static", "icon", "video", "ai_image_on_grid", "annotated_screenshot", "image_card"}
for b in broll_plan:
    kind = b.get("kind", "static")
    img = b.get("image_path", "")
    if kind in IMAGE_REQUIRED and not img:
        print(f"[warn] dropping {kind} beat at {b.get('start_sec')}s — no image_path", file=sys.stderr)
        continue
    entry = {
        "start_sec": float(b["start_sec"]),
        "end_sec": float(b["end_sec"]),
        "kind": kind,
        "prompt": b.get("prompt", ""),
        "reason": b.get("reason", ""),
        "source": b.get("source", ""),
    }
    if img:
        entry["image_path"] = f"{job_id}/broll/{os.path.basename(img)}"
    # Rewrite paths for additional asset-referencing fields so the React
    # comp can resolve them via staticFile() on the staged copies.
    for path_field in ("app_icon", "before_image", "after_image", "logo_path"):
        v = b.get(path_field)
        if v:
            entry[path_field] = f"{job_id}/broll/{os.path.basename(v)}"
    # logo_paths — array form for hook_title lockups
    if b.get("logo_paths"):
        entry["logo_paths"] = [
            f"{job_id}/broll/{os.path.basename(v)}" for v in b["logo_paths"] if v
        ]
    if kind in {"static", "icon", "video"} and "fit" in b:
        entry["fit"] = b["fit"]
    if kind == "static" and "inset" in b:
        entry["inset"] = float(b["inset"])
    # video card mode (editorial b-roll: rounded clip on black + Playfair caption)
    if kind == "video":
        if b.get("ungraded"):          entry["ungraded"] = True
        if b.get("fullframe"):         entry["fullframe"] = True
        if b.get("card"):              entry["card"] = True
        if "caption_space" in b:       entry["caption_space"] = str(b["caption_space"])
        if "card_top" in b:            entry["card_top"] = float(b["card_top"])
        if "caption" in b:             entry["caption"] = str(b["caption"])
        if "vertical" in b:            entry["vertical"] = float(b["vertical"])
        if "caption_x" in b:           entry["caption_x"] = float(b["caption_x"])
        if "caption_y" in b:           entry["caption_y"] = float(b["caption_y"])
        if "caption_align" in b:       entry["caption_align"] = str(b["caption_align"])
        if isinstance(b.get("caption_segments"), list):
            segs_out = []
            for sg in b["caption_segments"]:
                if not isinstance(sg, dict):
                    continue
                so = {"text": str(sg.get("text", ""))}
                if "appear_sec" in sg:   so["appear_sec"] = float(sg["appear_sec"])
                if "x" in sg:            so["x"] = float(sg["x"])
                if "y" in sg:            so["y"] = float(sg["y"])
                if "align" in sg:        so["align"] = str(sg["align"])
                segs_out.append(so)
            entry["caption_segments"] = segs_out
    # `anchor` is used by icon, notification_toast, corner_stat, side_panel
    if "anchor" in b:
        entry["anchor"] = b["anchor"]
    if kind == "icon":
        if "size" in b:   entry["size"] = float(b["size"])
        if "bare" in b:   entry["bare"] = bool(b["bare"])
        if "aspect" in b: entry["aspect"] = float(b["aspect"])
        if "x" in b:      entry["x"] = float(b["x"])
        if "solo" in b:   entry["solo"] = bool(b["solo"])
        if "y" in b:      entry["y"] = float(b["y"])
    if kind == "list":
        entry["title"] = b.get("title", "")
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, str):
                items_out.append(it)
            elif isinstance(it, dict):
                norm = {"text": str(it.get("text", ""))}
                if "appear_sec" in it:
                    norm["appear_sec"] = float(it["appear_sec"])
                items_out.append(norm)
        entry["items"] = items_out
    if kind == "word_pop":
        # Cardless centered typography overlay — each item shows centered
        # at its absolute appear_sec, replaced by the next. WordPop.tsx
        # reads these as { text, appear_sec, accent? }.
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, dict):
                norm = {
                    "text": str(it.get("text", "")),
                    "appear_sec": float(it.get("appear_sec", b["start_sec"])),
                }
                if it.get("accent"):
                    norm["accent"] = True
                items_out.append(norm)
        entry["items"] = items_out
        if "size" in b:
            entry["size"] = float(b["size"])
        if "vertical" in b:
            entry["vertical"] = float(b["vertical"])
    if kind == "bullet_burst":
        # Cardless multi-item summed-up bullets accumulating on screen,
        # each at its own appear_sec. BulletBurst.tsx reads these as
        # { text, appear_sec, accent? }.
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, dict):
                norm = {
                    "text": str(it.get("text", "")),
                    "appear_sec": float(it.get("appear_sec", b["start_sec"])),
                }
                if it.get("accent"):
                    norm["accent"] = True
                items_out.append(norm)
        entry["items"] = items_out
    if kind == "portrait_burst":
        # Small circular portraits in scattered slots, each at its own
        # appear_sec. PortraitBurst.tsx reads { image_path, label?, appear_sec }.
        # image_path is rewritten to the job-staged broll dir so staticFile()
        # resolves it.
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, dict) and it.get("image_path"):
                norm = {
                    "image_path": f"{job_id}/broll/{os.path.basename(it['image_path'])}",
                    "appear_sec": float(it.get("appear_sec", b["start_sec"])),
                }
                if it.get("label"):
                    norm["label"] = str(it["label"])
                items_out.append(norm)
        entry["items"] = items_out
    if kind == "tool_logo_burst":
        # Rounded-square logo tiles in scattered slots. Items WITHOUT
        # image_path render as TEXT-only tiles (lime hairline rectangle,
        # label as the brand name) — used for tools that don't have a
        # public/Wikipedia logo (channel's own tools, brand-new products).
        items_out = []
        for it in b.get("items", []):
            if not isinstance(it, dict):
                continue
            norm = {"appear_sec": float(it.get("appear_sec", b["start_sec"]))}
            if it.get("image_path"):
                norm["image_path"] = f"{job_id}/broll/{os.path.basename(it['image_path'])}"
            if it.get("label"): norm["label"] = str(it["label"])
            if it.get("accent"): norm["accent"] = True
            # Optional placement overrides (0..1 center anchor) so a single
            # hero logo can sit in the clear LOWER zone (skill rule 4cn).
            for k in ("x", "y", "size", "rotate"):
                if it.get(k) is not None:
                    norm[k] = float(it[k])
            if it.get("slide_from"): norm["slide_from"] = str(it["slide_from"])
            # Skip empty tiles (no logo AND no label).
            if not norm.get("image_path") and not norm.get("label"):
                continue
            items_out.append(norm)
        entry["items"] = items_out
        if b.get("bare"):
            entry["bare"] = True
    if kind == "broll_picker":
        # Grid of real b-roll thumbnails; a lime highlight locks onto pick_index.
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, dict) and it.get("image_path"):
                items_out.append({"image_path": f"{job_id}/broll/{os.path.basename(it['image_path'])}"})
        entry["items"] = items_out
        if b.get("pick_index") is not None:
            entry["pick_index"] = int(b["pick_index"])
        if b.get("count_label"):
            entry["count_label"] = str(b["count_label"])
    if kind == "password_type":
        if b.get("password"): entry["password"] = str(b["password"])
        if b.get("label"): entry["label"] = str(b["label"])
        if b.get("mask"): entry["mask"] = True
        if b.get("vertical") is not None: entry["vertical"] = float(b["vertical"])
    if kind == "agent_avatar_burst":
        # Inline-SVG robot avatars, each at appear_sec, optional dim_at
        # for the "killed" pattern. No external assets.
        items_out = []
        for it in b.get("items", []):
            if isinstance(it, dict):
                norm = {
                    "appear_sec": float(it.get("appear_sec", b["start_sec"])),
                }
                if it.get("label"): norm["label"] = str(it["label"])
                if it.get("dim_at") is not None:
                    norm["dim_at"] = float(it["dim_at"])
                if it.get("kept"): norm["kept"] = True
                items_out.append(norm)
        entry["items"] = items_out
    if kind == "org_diagram":
        # Parent box + N children boxes with bezier-connected arrows. Each
        # child has appear_sec + optional dim_at (the "fired once" pattern).
        if b.get("parent_label"):
            entry["parent_label"] = str(b["parent_label"])
        nodes_out = []
        for n in b.get("nodes", []):
            if isinstance(n, dict):
                nn = {"appear_sec": float(n.get("appear_sec", b["start_sec"]))}
                if n.get("label"): nn["label"] = str(n["label"])
                if n.get("dim_at") is not None:
                    nn["dim_at"] = float(n["dim_at"])
                if n.get("kept"): nn["kept"] = True
                nodes_out.append(nn)
        entry["nodes"] = nodes_out
    if kind == "claude_code_terminal":
        # Mac-style terminal frame showing a Claude Code session. Lines
        # typewriter-reveal at their own appear_sec.
        lines_out = []
        for ln in b.get("lines", []):
            if isinstance(ln, dict) and ln.get("text"):
                lo = {
                    "text": str(ln["text"]),
                    "appear_sec": float(ln.get("appear_sec", b["start_sec"])),
                }
                if ln.get("type"): lo["type"] = str(ln["type"])
                if ln.get("cps") is not None: lo["cps"] = float(ln["cps"])
                lines_out.append(lo)
        entry["lines"] = lines_out
    if kind == "dashboard_card":
        # Mock SaaS dashboard with stat tiles + optional sparkline. Numbers
        # count up on entrance.
        stats_out = []
        for s in b.get("stats", []):
            if isinstance(s, dict) and s.get("label") and s.get("value") is not None:
                so = {"label": str(s["label"]), "value": str(s["value"])}
                if s.get("trend"): so["trend"] = str(s["trend"])
                stats_out.append(so)
        entry["stats"] = stats_out
        if b.get("sparkline"):
            entry["sparkline"] = [float(x) for x in b["sparkline"]]
    if kind == "ratio_dots":
        # X-of-Y dots visualization. total + marked are required; mark_at
        # is when the marked dots flip color (negative polarity = lime ->
        # gray+X; positive = gray -> lime).
        if b.get("total") is not None: entry["total"] = int(b["total"])
        if b.get("marked") is not None: entry["marked"] = int(b["marked"])
        if b.get("polarity"): entry["polarity"] = str(b["polarity"])
        if b.get("appear_sec") is not None:
            entry["appear_sec"] = float(b["appear_sec"])
        if b.get("mark_at") is not None:
            entry["mark_at"] = float(b["mark_at"])
        if b.get("caption"): entry["caption"] = str(b["caption"])
        if b.get("columns") is not None: entry["columns"] = int(b["columns"])
    if kind == "inline_chart":
        # Small line-graph overlay for continuous data. data is required.
        if b.get("data"):
            entry["data"] = [float(x) for x in b["data"]]
        if b.get("labels"):
            entry["labels"] = [str(x) for x in b["labels"]]
        if b.get("draw_duration") is not None:
            entry["draw_duration"] = float(b["draw_duration"])
    if kind == "kinetic_statement":
        # VO-synced kinetic typography. Each word carries its absolute spoken
        # time (appear_sec from words.json) + optional emphasis flag. The comp
        # localizes appear_sec against the beat start.
        words_out = []
        for wd in b.get("words", []):
            if isinstance(wd, dict) and wd.get("text"):
                wo = {
                    "text": str(wd["text"]),
                    "appear_sec": float(wd.get("appear_sec", b["start_sec"])),
                }
                if wd.get("emphasis"):
                    wo["emphasis"] = True
                words_out.append(wo)
        entry["words"] = words_out

    if kind == "concept_build":
        # Free-form VO-synced explainer canvas. Elements positioned by x,y
        # (0-1 fractions); connectors reference element ids. Each piece carries
        # its absolute spoken appear_sec; the comp localizes against beat start.
        els_out = []
        for el in b.get("elements", []):
            if not (isinstance(el, dict) and el.get("id") and el.get("label")):
                continue
            eo = {
                "id": str(el["id"]),
                "label": str(el["label"]),
                "x": float(el.get("x", 0.5)),
                "y": float(el.get("y", 0.5)),
            }
            if el.get("sublabel"): eo["sublabel"] = str(el["sublabel"])
            if el.get("glyph"):    eo["glyph"] = str(el["glyph"])
            if el.get("variant"):  eo["variant"] = str(el["variant"])
            if el.get("emphasis"): eo["emphasis"] = True
            if el.get("w") is not None: eo["w"] = float(el["w"])
            if el.get("h") is not None: eo["h"] = float(el["h"])
            if el.get("appear_sec") is not None:
                eo["appear_sec"] = float(el["appear_sec"])
            else:
                eo["appear_sec"] = float(b["start_sec"])
            els_out.append(eo)
        entry["elements"] = els_out

        cons_out = []
        for c in b.get("connectors", []):
            if not (isinstance(c, dict) and c.get("from") and c.get("to")):
                continue
            co = {"from": str(c["from"]), "to": str(c["to"])}
            if c.get("label"):    co["label"] = str(c["label"])
            if c.get("flowing"):  co["flowing"] = True
            if c.get("emphasis"): co["emphasis"] = True
            if c.get("appear_sec") is not None:
                co["appear_sec"] = float(c["appear_sec"])
            else:
                co["appear_sec"] = float(b["start_sec"])
            cons_out.append(co)
        entry["connectors"] = cons_out

    if kind == "network_spread":
        # Hub-and-spoke network-effect metaphor. center_label = the hub; spokes
        # = the ring of outer dots; flow = direction of the $ tokens ("in" =
        # value flows back to the hub). Choreography is internal to the comp.
        if b.get("center_label"):
            entry["center_label"] = str(b["center_label"])
        if b.get("center_glyph"):
            entry["center_glyph"] = str(b["center_glyph"])
        if b.get("flow"):
            entry["flow"] = str(b["flow"])
        if b.get("flow_glyph"):
            entry["flow_glyph"] = str(b["flow_glyph"])
        spokes_out = []
        for sp in b.get("spokes", []):
            if not isinstance(sp, dict):
                continue
            so = {}
            if sp.get("label"): so["label"] = str(sp["label"])
            if sp.get("glyph"): so["glyph"] = str(sp["glyph"])
            if so:
                spokes_out.append(so)
        entry["spokes"] = spokes_out

    if kind == "command_deck":
        # "AI OS" control panel that boots up a business department-by-dept.
        # Each tile = {label, glyph, appear_sec(absolute)}. brand = title-bar chip.
        if b.get("brand"):
            entry["brand"] = str(b["brand"])
        tiles_out = []
        for t in b.get("tiles", []):
            if not isinstance(t, dict) or not t.get("label"):
                continue
            to = {"label": str(t["label"])}
            if t.get("glyph"): to["glyph"] = str(t["glyph"])
            to["appear_sec"] = float(t["appear_sec"]) if t.get("appear_sec") is not None else float(b["start_sec"])
            tiles_out.append(to)
        entry["tiles"] = tiles_out

    # Template-library kinds: pass through all known props verbatim.
    template_props = [
        "title", "number", "subtitle",
        "steps",
        "callout_prefix", "callout_highlight", "callout_suffix",
        "value", "caption", "pre_label",
        "quote_text", "attribution", "chars_per_second",
        "top_label", "top_items", "bottom_label", "bottom_items", "winner",
        "chips",
        "progress",
        "chapter_number", "chapter_title",
        # Metric reveal + notification toast
        "target", "decimals", "duration_sec",
        "app_name", "app_icon", "body", "time",
        # Chat / stat-grid / flow / bulleted / comparison
        "messages", "stats", "nodes", "bullets", "columns", "rows",
        # New cinematic batch
        "bars", "max", "orientation",
        "network_nodes", "network_edges",
        "highlights", "zoom_to_highlights",
        "chapter", "kicker",
        "ticker_items",
        "before_image", "after_image", "before_label", "after_label",
        "wipe_start_sec", "wipe_duration_sec",
        # Partial-overlay variants
        "side_items",
        # Text-behind-subject flag + word_pop/hook_title placement
        "behind_subject", "vertical", "align", "left_text", "right_text",
        # cinematic hook variant
        "style", "hook_font",
        # headline_card
        "headline", "dek",
        # calendar_months (count) + layer_stack (layers)
        "count", "layers",
        # overlay-on-speaker flag (text kinds: kinetic_statement, callout)
        "overlay",
        # wide (landscape) screen-share PiP card + its size/placement/aspect
        "wide", "overlay_y", "size", "aspect",
        # ⭐ cinematic motion viz: the device name + its data props object
        "viz", "props",
    ]
    for p in template_props:
        if p in b:
            entry[p] = b[p]
    broll_out.append(entry)

zoom_out = [
    {
        "start_sec": float(z["start_sec"]),
        "end_sec": float(z["end_sec"]),
        "scale": float(z.get("scale", 1.06)),
    }
    for z in zoom_plan
]

duration_frames = max(1, round(duration * fps))

props = {
    "videoSrc": f"{job_id}/source.{video_ext}",
    "broll": broll_out,
    "zoom": zoom_out,
    **({"speakerCutoutDir": speaker_cutout_rel} if speaker_cutout_rel else {}),
    **({"followCam": followcam_plan} if followcam_plan else {}),
    "captions": captions_plan,
    "styles": {
        "kenBurnsIntensity": float(ken_burns),
        "zoomEaseFrames": int(zoom_ease),
    },
    "fps": fps,
    "width": w,
    "height": h,
    "durationInFrames": duration_frames,
}

with open(out_props, "w") as f:
    json.dump(props, f, indent=2)
print(f"props.json -> {out_props} ({duration_frames} frames @ {fps}fps, {len(broll_out)} broll, {len(zoom_out)} zoom)")
PY

if [ -n "$VARIANT" ]; then
  OUT_PATH="${VIDEO_PATH%.*}.${VARIANT}.mp4"
else
  OUT_PATH="${VIDEO_PATH%.*}.${OUT_SUFFIX}.mp4"
fi

# ── RENDER-SKIP: the whole render is a "loose part" too ────────────────
# Fingerprint every input that can change the output: props.json (all the
# plan/timing/asset/caption/followcam data, freshly rebuilt above), every
# template source file, and the source video's mtime. If the fingerprint
# matches the last SUCCESSFUL render AND the output file still exists, the
# render would be byte-for-byte identical — skip it. This is what makes
# re-running an already-done scene in a batch instant, and what makes a
# crash-resume not re-render the scenes that already finished.
# Override with FORCE_RENDER=1.
RENDER_FP=$(
  {
    cat "$REMOTION_DIR/src/props.json" 2>/dev/null
    find "$REMOTION_DIR/src" \( -name '*.tsx' -o -name '*.ts' \) -print0 2>/dev/null \
      | sort -z | xargs -0 cat 2>/dev/null
    date -r "$VIDEO_PATH" +%s 2>/dev/null
    echo "$QUALITY|$RENDER_W|$RENDER_H|$RENDER_CRF|$RENDER_PRESET|${SCORE:-$DO_SCORE}"
  } | shasum | cut -c1-16
)
FP_FILE="$WORKDIR/.render.fp.$(echo -n "${VARIANT:-_}|$OUT_SUFFIX" | shasum | cut -c1-8)"
if [ "${FORCE_RENDER:-0}" != "1" ] && [ -f "$OUT_PATH" ] \
   && [ "$(cat "$FP_FILE" 2>/dev/null || true)" = "$RENDER_FP" ]; then
  echo "==> Render skipped — inputs unchanged since last successful render."
  echo "    $OUT_PATH  (override: FORCE_RENDER=1 bash render.sh ...)"
  exit 0
fi

echo "==> Rendering to $OUT_PATH"
RENDER_CONCURRENCY=$([ "$QUALITY" = "preview" ] && echo 4 || echo 2)
(cd "$REMOTION_DIR" && npx --no-install remotion render src/index.ts EditedVideo "$OUT_PATH" \
  --concurrency="$RENDER_CONCURRENCY" \
  --codec=h264 \
  --crf="$RENDER_CRF" \
  --x264-preset="$RENDER_PRESET" \
  --timeout=120000)

echo "==> Done (video): $OUT_PATH"

# ── Audio scoring (music bed + timed SFX) ──────────────────────────────
# Mix in a calm music bed (from skill's music/ library) plus SFX timed to
# every visual cue (hook flash, card pops on timeline appears, caption
# emphasis ticks). Auto-skipped in preview mode for ~10s faster iteration.
# Force on/off with SCORE=1 / SCORE=0.
SCORE="${SCORE:-$DO_SCORE}"
if [ "$SCORE" = "1" ]; then
  SFX_TRACK="$WORKDIR/sfx_track.wav"
  # Music arc — find the climax beat (quote_pull = the takeaway line, else the
  # last full-screen takeover) and hand its time to score.sh so the music
  # swells into the payoff instead of running flat.
  MUSIC_SWELL_AT=$(python3 -c "
import json
try:
    plan = json.load(open('$PLAN_DIR/broll_plan.json'))
    q = [b for b in plan if b.get('kind') == 'quote_pull']
    pick = q[0] if q else None
    if pick is None:
        tk = [b for b in plan if b.get('kind') in
              ('cinematic_title','stat_punch','vs_split','vertical_timeline')]
        pick = tk[-1] if tk else None
    print(round((float(pick['start_sec'])+float(pick['end_sec']))/2, 2) if pick else 0)
except Exception:
    print(0)
")
  export MUSIC_SWELL_AT
  echo "==> Building SFX track from broll_plan + captions_plan"
  python3 "$SKILL_DIR/scripts/build_sfx_track.py" \
    "$PLAN_DIR/broll_plan.json" \
    "$PLAN_DIR/captions_plan.json" \
    "$DURATION" \
    "$SFX_TRACK" || {
      echo "[warn] build_sfx_track.py failed; will score with hook SFX only"
      SFX_TRACK=""
    }

  SCORED_TMP="$WORKDIR/scored_tmp.mp4"
  # Music selection — SIGNATURE TRACK. Codified May 22 2026: shorts use ONE
  # consistent track every video so the channel has a sonic identity (a
  # rotating bed isn't branding). `vibehorn-background-music-496933.mp3` is
  # the locked BuildLoop signature — owner-picked May 22 2026 (the earlier
  # bg-feelgood-builder was rejected as "cartoonish/funky"). Same track,
  # every short. Override per-render with MUSIC_TRACK=<filename> for one-offs.
  if [ -n "${MUSIC_TRACK:-}" ]; then
    MUSIC_PATH="$HOME/.claude/skills/video-edit/music/${MUSIC_TRACK}"
  else
    MUSIC_PATH="$HOME/.claude/skills/video-edit/music/vibehorn-background-music-496933.mp3"
  fi
  # Music speed via atempo. 1.0 = original. >1.0 = faster (no pitch shift).
  # Default 1.0 — bg-feelgood-carefree is already 96 BPM, no speedup needed.
  # Override per-render with MUSIC_SPEED=1.15 etc. when using a slower track.
  if [ -z "${MUSIC_SPEED:-}" ]; then
    export MUSIC_SPEED=1.0
  fi
  echo "==> Scoring (music: $(basename "$MUSIC_PATH") @ ${MUSIC_SPEED}x + SFX) -> $OUT_PATH"
  bash "$SKILL_DIR/scripts/score.sh" "$OUT_PATH" "$MUSIC_PATH" "$SCORED_TMP" "$SFX_TRACK"
  mv "$SCORED_TMP" "$OUT_PATH"
  echo "==> Done (scored): $OUT_PATH"
fi

# Record the render fingerprint — a re-run with identical inputs now skips
# straight to the top-of-render exit. Written ONLY here, after a fully
# successful render (+ score), so a crash never leaves a false cache hit.
echo "$RENDER_FP" > "$FP_FILE"

# Restore broll_plan.json from the frozen source one last time, so the next
# render's "did the author edit this?" diff check sees the pristine source
# instead of this run's mutation residue.
if [ -f "$SRC_PLAN" ]; then
  cp "$SRC_PLAN" "$PLAN_DIR/broll_plan.json"
fi
