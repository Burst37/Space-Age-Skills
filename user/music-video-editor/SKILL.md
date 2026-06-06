---
name: music-video-editor
description: >
  Full-stack music video creation and editing engine for Space Age AI Solutions.
  Three execution paths: (1) Claude Code fully autonomous Python+FFmpeg render with beat sync,
  (2) Canva MCP branded 9:16 story/reel output, (3) CapCut web automation via Playwright.
  Use IMMEDIATELY for any of: music visualizer, audio reactive video, beat-synced visuals,
  frequency bars/waveform/spectrum/ring/particles, music video for an artist, Instagram
  Reel/TikTok/YouTube Short visual, "make a video for this track", "create a music visual",
  "edit this video to the beat", "visualizer for [artist]", "animate to the music",
  lyric video, audio waveform video, DJ set video, podcast video, cinematic music video,
  export to CapCut, export to Canva, or any request combining video/animation with audio.
  Replaces and supersedes the older music-visualizer skill — full editing capabilities added.
version: 3.0
updated: 2026-05-15
---

# Music Video Editor — Space Age AI Solutions v3.0

Three fully automated workflows. Claude picks the right one or user specifies.

---

## DECISION TREE

```
Audio file provided?
  ├── User wants Canva branding? ──► PATH 2: CANVA
  ├── User wants CapCut editing? ──► PATH 3: CAPCUT  
  └── Default / "just make it"   ──► PATH 1: AUTONOMOUS
```

---

## PATH 1 — AUTONOMOUS (Claude Code Runs Everything)

Claude executes the engine directly. FFmpeg + Python. No user machine needed.

### Quick Start
```bash
# Install deps (one-time)
pip install librosa opencv-python-headless numpy

# Run
python scripts/music_video_engine.py \
  --audio "track.mp3" \
  --style bars \
  --theme orange \
  --artist "DRE NOVA" \
  --title "NEW WAVE" \
  --output "dre_nova_new_wave.mp4"
```

### Styles
| Style | Description | Best For |
|-------|-------------|----------|
| `bars` | 64 frequency bars, beat-flash vignette | Hip-hop, trap, EDM |
| `waveform` | Centered wave with mirror reflection | R&B, lo-fi, soul |
| `ring` | Circular equalizer, beat pulse | Electronic, ambient |
| `spectrum` | Full frequency waterfall | DJ sets, podcasts |
| `particles` | Beat-reactive floating particles | Pop, cinematic |
| `dual` | Bars + ring combined | Any genre, premium |
| `cinema` | Bars + particles cinematic | Music videos, reels |

### Themes
| Theme | RGB Primary | Vibe |
|-------|------------|------|
| `orange` | 255,140,0 | Space Age default — hip-hop, trap |
| `cyan` | 0,220,255 | EDM, lo-fi, commercial pop |
| `purple` | 160,0,255 | Dark, atmospheric, neo-soul |
| `green` | 0,255,100 | Underground, drill |
| `white` | 240,240,240 | Cinematic, minimal |
| `red` | 255,30,30 | Aggressive, high energy |
| `gold` | 255,200,0 | Luxury, R&B, soul |
| `neon` | 255,0,150 | Club, future bass |

### With Background Video
```bash
python scripts/music_video_engine.py \
  --audio track.mp3 \
  --bg background_loop.mp4 \
  --style cinema \
  --theme purple \
  --artist "ARTIST" --title "TRACK" \
  --output final.mp4
```

### FFmpeg-Only Mode (Fastest — Zero Python Deps)
```bash
bash scripts/ffmpeg_visualizer.sh track.mp3 output.mp4 "ARTIST" "TRACK" orange bars
# Styles: bars | waveform | spectrum | cqt
```

---

## PATH 2 — CANVA WORKFLOW

### Step 1: Render + Auto-Upload
```bash
python scripts/music_video_engine.py \
  --audio track.mp3 \
  --artist "ARTIST" --title "TRACK" \
  --style cinema --theme orange \
  --export canva \
  --output render.mp4
# → Outputs public URL + canva_handoff.txt
```

### Step 2: Claude Canva MCP Actions
1. `upload-asset-from-url` with the transfer.sh URL → get `asset_id`
2. `generate-design`:
   - `design_type`: `"your_story"` (1080×1920)
   - `asset_ids`: [asset_id]
   - Prompt: dark premium music visual, artist name large bold at top, track title below, "Stream Now" CTA bottom
3. Return Canva edit link

### Upload Fallbacks
```
Primary:   transfer.sh (7 days, free, auto in script)
Fallback:  file.io (auto fallback in script)
Permanent: Cloudflare R2 via MCP (use if link needs to persist > 7 days)
```

---

## PATH 3 — CAPCUT WORKFLOW

### Option A: Playwright Automation
```bash
# 1. Render
python scripts/music_video_engine.py --audio track.mp3 --export capcut --output render.mp4

# 2. Automate CapCut web
python scripts/capcut_automator.py \
  --video render.mp4 \
  --artist "ARTIST" \
  --title "TRACK" \
  --color "#FF8C00"
# → Opens CapCut browser, imports video, adds text, awaits manual export
```

### Option B: Manual CapCut Import Package
```bash
python scripts/music_video_engine.py \
  --audio track.mp3 --export capcut --output render.mp4
# Outputs: render_capcut/
#   ├── visualizer.mp4       ← Import as main clip
#   ├── beat_markers.srt     ← Import as subtitle track for timing
#   ├── timeline.json        ← Beat timestamps for manual reference
#   └── README.md            ← Import instructions
```

### CapCut Import Steps (Manual)
1. New Project → Import `visualizer.mp4`
2. Add `beat_markers.srt` as subtitle track (timing guide)
3. Add text at beat timestamps from `timeline.json`
4. Export: MP4, 1080×1920, High quality

---

## OUTPUT SPECS

| Format | Dimensions | FPS | Video Codec | Audio |
|--------|-----------|-----|------------|-------|
| Default | 1080×1920 | 30 | H.264 (CRF 20) | AAC 192k |
| Canva upload | 1080×1920 | 30 | H.264 | AAC 192k |
| CapCut export | 1080×1920 | 30 | H.264 | AAC 192k |

---

## INTEGRATION WITH RECORD EXEC IN A BOX

This skill feeds directly into the content calendar pipeline:
- Output 9:16 = Instagram/TikTok/Reels/YouTube Shorts
- Save Canva edit URL in artist profile for reuse  
- Default theme `orange` = Space Age brand look for all artists
- Pair with `social-media-designer` for additional platform variants (1:1 for feed, 16:9 for YouTube)

## SCRIPTS IN THIS SKILL

| Script | Purpose |
|--------|---------|
| `scripts/music_video_engine.py` | Full Python engine: beat sync, visuals, effects, text overlay |
| `scripts/ffmpeg_visualizer.sh` | FFmpeg-only fast renderer (bars/waveform/spectrum/cqt) |
| `scripts/capcut_automator.py` | Playwright CapCut web automation |
