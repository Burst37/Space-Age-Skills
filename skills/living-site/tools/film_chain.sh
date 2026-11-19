#!/bin/zsh
# film_chain.sh <project-dir> [resolution=1080p] [seconds=5]
#
# Renders a scroll film from N chained keyframes, then turns it into scroll frames and gates it.
#   <dir>/kf/k1.png ... kN.png     keyframes, each made with the one before it as a reference
#   <dir>/film/prompts.txt         N-1 lines, one camera move per clip ("One continuous single shot, no cuts. The camera ...")
# Clip i starts on the EXACT last frame of clip i-1 (pixels from ffmpeg, never the keyframe) and ends on keyframe i+1.
# Seedance 2.0, audio off, both ends pinned. Strictly in order. Resumable: finished clips are kept, saved job ids resume.
# Stops at the first clip with a hidden cut: move the keyframes closer (same camera angle) and rerun.
# Output: <dir>/frames/f_0001.jpg ... (1920 wide, q3) and a continuity verdict.
set -e
H=${0:A:h}; D=${1:A}; RES=${2:-1080p}; SEC=${3:-5}
[[ -d "$D/kf" && -s "$D/film/prompts.txt" ]] || { echo "need $D/kf/k1..kN.png and $D/film/prompts.txt"; exit 1; }
cd "$D"; export WORKDIR=${WORKDIR:-$D}
case $RES in 1080p) C=$((12*SEC));; 720p) C=$((6*SEC));; 480p) C=$((3*SEC));; esac
P=("${(@f)$(cat film/prompts.txt)}"); N=$(( ${#P} + 1 ))
START=kf/k1.png; CLIPS=()
for i in $(seq 1 $((N-1))); do
  OUT=film/c$i.mp4; END=kf/k$((i+1)).png
  [[ -s $OUT ]] || zsh $H/gen_clip.sh $OUT $C seedance_2_0 --mode std --resolution $RES --duration $SEC --generate_audio false \
      --start-image $START --end-image $END --prompt "${P[$i]}" < /dev/null
  python3 $H/cutscan.py $OUT || { echo "CUT inside $OUT: regenerate with closer keyframes"; exit 2; }
  ffmpeg -v error -y -sseof -0.1 -i $OUT -frames:v 1 -update 1 film/c$i-last.png
  START=film/c$i-last.png; CLIPS+=($OUT)
done
# join: clip 2 onwards drops its first frame (it equals the previous last frame)
rm -rf frames; mkdir -p frames
INS=(); F=""; for i in $(seq 1 ${#CLIPS}); do INS+=(-i ${CLIPS[$i]}); done
for i in $(seq 0 $((${#CLIPS}-1))); do
  if (( i == 0 )); then F+="[0:v]setpts=PTS-STARTPTS[v0];"; else F+="[$i:v]trim=start_frame=1,setpts=PTS-STARTPTS[v$i];"; fi
done
for i in $(seq 0 $((${#CLIPS}-1))); do F+="[v$i]"; done; F+="concat=n=${#CLIPS}:v=1[c];[c]scale=1920:-2[v]"
ffmpeg -v error "${INS[@]}" -filter_complex "$F" -map "[v]" -q:v 3 frames/f_%04d.jpg
echo "frames: $(ls frames | wc -l | tr -d ' ')"
zsh $H/continuity-gate.sh frames 4 | tail -1
