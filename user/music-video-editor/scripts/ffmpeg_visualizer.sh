#!/bin/bash
# Space Age AI Solutions — FFmpeg Pure Visualizer
# No Python needed. Pure FFmpeg audio visualization.
# Usage: ./ffmpeg_visualizer.sh input.mp3 output.mp4 "ARTIST" "TRACK" orange bars

AUDIO="$1"
OUTPUT="${2:-output.mp4}"
ARTIST="${3:-ARTIST}"
TITLE="${4:-TRACK}"
THEME="${5:-orange}"
STYLE="${6:-bars}"

# Theme colors (R:G:B for drawbox/drawtext)
case "$THEME" in
  orange) COLOR="0xFF8C00" GLOW="0xFF5000" ;;
  cyan)   COLOR="0x00DCFF" GLOW="0x00B4DC" ;;
  purple) COLOR="0xA000FF" GLOW="0x7800C8" ;;
  green)  COLOR="0x00FF64" GLOW="0x00C850" ;;
  white)  COLOR="0xF0F0F0" GLOW="0xFFFFFF" ;;
  red)    COLOR="0xFF1E1E" GLOW="0xC80000" ;;
  gold)   COLOR="0xFFC800" GLOW="0xDCA000" ;;
  *)      COLOR="0xFF8C00" GLOW="0xFF5000" ;;
esac

W=1080
H=1920

case "$STYLE" in
  bars)
    VF="showfreqs=s=${W}x${H}:mode=bar:ascale=log:fscale=log:colors=${COLOR}|${GLOW},\
        drawtext=text='${ARTIST}':fontsize=72:fontcolor=${COLOR}:x=(w-text_w)/2:y=h*0.08:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,\
        drawtext=text='${TITLE}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h*0.16:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,\
        drawtext=text='STREAM NOW':fontsize=56:fontcolor=${COLOR}:x=(w-text_w)/2:y=h*0.92:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,\
        vignette=PI/4"
    ;;
  waveform)
    VF="showwaves=s=${W}x${H}:mode=cline:rate=30:colors=${COLOR},\
        drawtext=text='${ARTIST}':fontsize=72:fontcolor=${COLOR}:x=(w-text_w)/2:y=h*0.08:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,\
        drawtext=text='${TITLE}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h*0.16:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,\
        vignette=PI/4"
    ;;
  spectrum)
    VF="showspectrum=s=${W}x${H}:color=channel:scale=log:saturation=5:slide=scroll:mode=combined,\
        drawtext=text='${ARTIST}':fontsize=72:fontcolor=${COLOR}:x=(w-text_w)/2:y=h*0.08:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,\
        drawtext=text='${TITLE}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h*0.16:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,\
        vignette=PI/4"
    ;;
  cqt)
    VF="showcqt=s=${W}x${H}:count=30:fps=30:bar_g=5:axis_h=0:tc=0.33,\
        drawtext=text='${ARTIST}':fontsize=72:fontcolor=${COLOR}:x=(w-text_w)/2:y=h*0.08:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,\
        drawtext=text='${TITLE}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h*0.16:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ;;
  *)
    VF="showfreqs=s=${W}x${H}:mode=bar:colors=${COLOR}"
    ;;
esac

echo "Rendering: $ARTIST - $TITLE ($STYLE/$THEME)"
echo "Output: $OUTPUT"

ffmpeg -y \
  -i "$AUDIO" \
  -filter_complex "$VF" \
  -c:v libx264 -preset fast -crf 20 \
  -c:a aac -b:a 192k \
  -s ${W}x${H} -r 30 \
  -shortest -movflags +faststart \
  "$OUTPUT"

echo "Done: $OUTPUT"
