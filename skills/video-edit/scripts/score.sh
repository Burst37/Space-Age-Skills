#!/usr/bin/env bash
# Mix a music bed + hook SFX under an existing video's voice track,
# with sidechain ducking on the music. Music drops ~10 dB whenever the
# speaker is talking; recovers over ~400ms.
#
# Usage:
#   score.sh <input.mp4> [<music-or-dir>] [<output.mp4>] [<sfx>]
#
# Defaults:
#   music   = ~/.claude/skills/video-edit/music/   (auto-picks a track)
#   sfx     = ~/.claude/skills/video-edit/sfx/flare-hit.mp3 (placed at t=0)
#   output  = <input %.mp4>.scored.mp4
#
# Track rotation (when music is a dir):
#   Picks deterministically from the input filename's SHA1 modulo track count.
#   Same input → same track every time. Different inputs across the 14-scene
#   batch → different tracks distributed across whatever's in music/.
#
# Loudness math (2026 short-form register):
#   Voice  → -16 LUFS, peak -1.5 dBTP
#   Music  → -26 LUFS raw, ducked ~10 dB under VO via sidechain. Updated
#            May 22 2026 — the old -38 LUFS / weight 0.22 bed was effectively
#            inaudible ("the music is just boring"). At -26 / weight 0.42 the
#            signature track is FELT: clear energy in the gaps, ducked under
#            speech, lifted further by the MUSIC_SWELL_AT arc at the climax.
#   SFX    → at -12 dBFS at t=0, fades after 0.4s
#   Final  → -14 LUFS integrated, -1 dBTP ceiling
#
# Mix weights: voice=1.0, music=0.42, sfx=0.7
# The bed is a real, felt soundtrack — not invisible, not corny-loud.
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "usage: score.sh <input.mp4> [<music-or-dir>] [<output.mp4>] [<sfx>]"
  exit 2
fi

INPUT="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
MUSIC_ARG="${2:-$HOME/.claude/skills/video-edit/music}"
OUT="${3:-${INPUT%.mp4}.scored.mp4}"
SFX="${4:-$HOME/.claude/skills/video-edit/sfx/flare-hit.mp3}"

# NO-MUSIC mode — keep the SFX, drop the music bed entirely. For clips that
# should run on voice (+ SFX) alone. score.sh still receives a music path from
# render.sh; this branch simply ignores it. Set NO_MUSIC=1.
if [ "${NO_MUSIC:-0}" = "1" ]; then
  if [ -f "$SFX" ]; then
    NF='[0:a]loudnorm=I=-16:TP=-1.5:LRA=11[voice];'
    NF+='[1:a]volume=1.0,apad=pad_dur=60[sfx];'
    NF+='[voice][sfx]amix=inputs=2:duration=first:normalize=0:weights=0.5 0.72[premix];'
    NF+='[premix]alimiter=level_in=1:level_out=1:limit=0.97[lim];'
    NF+='[lim]loudnorm=I=-14:TP=-1:LRA=11[aout]'
    ffmpeg -y -i "$INPUT" -i "$SFX" -filter_complex "$NF" \
      -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
  else
    ffmpeg -y -i "$INPUT" -af "loudnorm=I=-14:TP=-1:LRA=11" \
      -c:v copy -c:a aac -b:a 192k "$OUT"
  fi
  echo "==> Done (no music, SFX kept): $OUT"
  exit 0
fi

# Resolve music: if dir, pick deterministically by input filename hash
if [ -d "$MUSIC_ARG" ]; then
  TRACKS=( "$MUSIC_ARG"/*.mp3 )
  if [ ${#TRACKS[@]} -eq 0 ]; then
    echo "no .mp3 tracks in $MUSIC_ARG"
    exit 1
  fi
  HASH=$(echo -n "$(basename "$INPUT")" | shasum | cut -c1-8)
  IDX=$(( 16#${HASH} % ${#TRACKS[@]} ))
  MUSIC="${TRACKS[$IDX]}"
  echo "==> picked track $((IDX + 1))/${#TRACKS[@]}: $(basename "$MUSIC")"
else
  MUSIC="$MUSIC_ARG"
fi

if [ ! -f "$MUSIC" ]; then
  echo "music not found: $MUSIC"
  exit 1
fi

# Build filter graph. Music is much quieter (-32 LUFS, weight 0.40) so it
# sits as a wash under the voice rather than competing.
HAS_SFX=0
if [ -f "$SFX" ]; then HAS_SFX=1; fi

# Music tempo (1.0 = original; >1.0 = faster, no pitch shift via atempo).
SPEED="${MUSIC_SPEED:-1.0}"

# Music ARC. When MUSIC_SWELL_AT is set (seconds — the video's climax beat),
# the music bed swells ~+55% into that moment and settles after, instead of
# running flat the whole video. Trapezoid envelope: rise over 6s, hold 2s
# through the payoff, fall over 3s. Applied to the audible music branch only
# (NOT the sidechain detector). MUSIC_SWELL_AT=0/unset → flat bed (legacy).
SWELL_AT="${MUSIC_SWELL_AT:-0}"
MUSIC_ENV=""
if [ "$(echo "$SWELL_AT > 1" | bc -l 2>/dev/null || echo 0)" = "1" ]; then
  R0=$(echo "$SWELL_AT - 6" | bc -l)   # rise start
  F1=$(echo "$SWELL_AT + 5" | bc -l)   # fall end
  # volume = 1 + 0.55 * trapezoid(t): min of the rise ramp and the fall ramp.
  MUSIC_ENV=",volume=volume='1+0.55*clip(min((t-(${R0}))/6\,((${F1})-t)/5)\,0\,1)':eval=frame"
fi

if [ "$HAS_SFX" = "1" ]; then
  FILTER="[1:a]atempo=${SPEED},loudnorm=I=-26:TP=-1.5:LRA=7,asplit=2[sc][mixraw];"
  FILTER+="[mixraw]anull${MUSIC_ENV}[mix];"
  FILTER+='[0:a]loudnorm=I=-16:TP=-1.5:LRA=11[voice];'
  FILTER+='[2:a]volume=1.0,apad=pad_dur=60[sfx];'
  FILTER+='[voice][sc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400:makeup=1[duckctrl];'
  FILTER+='[mix][duckctrl]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400:makeup=1[ducked];'
  # normalize=0 → weights are ABSOLUTE gains, not divided by their sum. The old
  # default (normalize=1) divided every input by sum(weights)=2.12, which dropped
  # the subtle SFX (authored ~0.15–0.3) to inaudible (×0.33 of an already-quiet
  # sample). Now voice/music keep their tuned levels while SFX sit clearly
  # present; the alimiter catches any transient peak so nothing clips.
  FILTER+='[voice][ducked][sfx]amix=inputs=3:duration=first:normalize=0:weights=0.5 0.18 0.72[premix];'
  FILTER+='[premix]alimiter=level_in=1:level_out=1:limit=0.97[lim];'
  # FINAL loudness normalization — the amix weights only set voice/music BALANCE;
  # without this the integrated loudness drifted to ~-22..-30 LUFS (way under the
  # -14 social target → platforms boost it +16 dB and amplify harshness). This
  # stage enforces the documented -14 LUFS / -1 dBTP final. (Fixed 2026-06-13.)
  FILTER+='[lim]loudnorm=I=-14:TP=-1:LRA=11[aout]'
  ffmpeg -y -i "$INPUT" -stream_loop -1 -i "$MUSIC" -i "$SFX" -filter_complex "$FILTER" \
    -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
else
  FILTER="[1:a]atempo=${SPEED},loudnorm=I=-26:TP=-1.5:LRA=7,asplit=2[sc][mixraw];"
  FILTER+="[mixraw]anull${MUSIC_ENV}[mix];"
  FILTER+='[0:a]loudnorm=I=-16:TP=-1.5:LRA=11[voice];'
  FILTER+='[voice][sc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400:makeup=1[duckctrl];'
  FILTER+='[mix][duckctrl]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400:makeup=1[ducked];'
  FILTER+='[voice][ducked]amix=inputs=2:duration=first:normalize=0:weights=0.5 0.18[premix];'
  FILTER+='[premix]alimiter=level_in=1:level_out=1:limit=0.97[lim];'
  # FINAL loudness normalization — the amix weights only set voice/music BALANCE;
  # without this the integrated loudness drifted to ~-22..-30 LUFS (way under the
  # -14 social target → platforms boost it +16 dB and amplify harshness). This
  # stage enforces the documented -14 LUFS / -1 dBTP final. (Fixed 2026-06-13.)
  FILTER+='[lim]loudnorm=I=-14:TP=-1:LRA=11[aout]'
  ffmpeg -y -i "$INPUT" -stream_loop -1 -i "$MUSIC" -filter_complex "$FILTER" \
    -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
fi

echo "==> Done: $OUT"
