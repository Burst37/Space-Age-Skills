#!/bin/zsh
# pingpong.sh in.mp4 out.mp4 : forward + reversed, seamless loop, web size, no audio
ffmpeg -v error -y -i "$1" -filter_complex "[0:v]scale=960:-2,split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -an -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart "$2"
