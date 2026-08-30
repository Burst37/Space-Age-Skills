# FFmpeg Frame Extraction

Frames extracted at 15 fps using ffmpeg (`-vf fps=15`), encoded as WebP (quality 90).

| Source video | Resolution | Duration | Frames |
|--------------|-----------|----------|--------|
| video1_004408 | 1470x630 | 12.04s | 181 |
| video2_003923 | 960x960  | 10.04s | 151 |

Command used:
```
ffmpeg -i <input>.mp4 -vf fps=15 -c:v libwebp -quality 90 frame_%04d.webp
```
