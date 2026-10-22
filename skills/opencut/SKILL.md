# opencut

Open-source browser-based video editor — the free, self-hostable alternative to CapCut. Agentic video production: trim, cut, add captions, overlay audio, export. Pairs with Higgsfield for a full AI video pipeline.

## Source
`OpenCut-app/OpenCut` on GitHub — runs in browser, no install required

## What This Skill Covers
- Browser-based non-linear video editing
- Caption and subtitle generation/overlay
- Multi-track timeline: video + audio + text layers
- Export in multiple formats and resolutions
- Integration with Higgsfield-generated video clips
- Batch processing for social media content

## Self-Hosting Setup

```bash
git clone https://github.com/OpenCut-app/OpenCut
cd OpenCut
npm install
npm run dev
# Available at http://localhost:3000
```

For VPS deployment (146.190.78.120):
```bash
npm run build
npm run start  # or use PM2: pm2 start npm --name opencut -- start
# Add to nginx as a reverse proxy on port 3001
```

## Full AI Video Pipeline

This is the recommended workflow combining Higgsfield + OpenCut:

```
1. Ideate & Generate (Higgsfield)
   → /generate-image  — create stills, concept art, thumbnails
   → /generate-video  — create AI video clips (5–10s each)
   → /create-voice    — generate voiceover

2. Enhance (Higgsfield)
   → /upscale         — upscale clips to 4K
   → /remove-bg       — isolate subjects

3. Edit & Assemble (OpenCut)
   → Import clips to timeline
   → Trim, sequence, add transitions
   → Overlay voiceover on audio track
   → Add captions

4. Export
   → MP4 for YouTube/upload
   → Short crop for Reels/TikTok/Shorts
```

## Slash Commands

### `/video-project [brief]`
Plan and set up a new video project.

**Steps:**
1. Define: platform target (YouTube, TikTok, Instagram Reel, ad), duration, aspect ratio
2. Create shot list: intro hook (0–3s), main content sections, CTA (last 5s)
3. Identify assets needed: AI-generated clips, stock footage, VO script, music
4. Generate Higgsfield prompts for each clip

**Platform specs:**
| Platform | Ratio | Resolution | Max Duration |
|----------|-------|------------|-------------|
| YouTube | 16:9 | 1920×1080 | Unlimited |
| TikTok / Reels / Shorts | 9:16 | 1080×1920 | 60s–3min |
| Instagram Feed | 1:1 | 1080×1080 | 60s |
| Twitter/X | 16:9 | 1280×720 | 2:20 |

### `/caption-video`
Generate and overlay captions on a video.

**Steps:**
1. Transcribe audio (use Whisper or Higgsfield's media_summarize)
2. Generate SRT/VTT subtitle file with accurate timestamps
3. Style: large white text, black outline, centered bottom third
4. Import into OpenCut as a text layer synced to timeline
5. Export with captions burned in or as a separate subtitle file

### `/social-cut [source-video]`
Cut a long video into social-optimized short clips.

**Steps:**
1. Identify the 3–5 strongest moments (hook, key insight, CTA)
2. Cut each to 15–60 seconds
3. Reframe from 16:9 to 9:16 (use Higgsfield `/reframe` if needed)
4. Add captions to each clip
5. Export as individual files named by platform: `clip-tiktok.mp4`, `clip-reel.mp4`

### `/export [platform]`
Export the current project for a target platform.

**Settings by platform:**
- YouTube: H.264, 1080p or 4K, 8–15 Mbps, AAC 320kbps
- TikTok/Reels: H.264, 1080×1920, 10 Mbps, AAC 128kbps
- Twitter/X: H.264, 1280×720, 5 Mbps, max 512MB file size
- Web embed: H.264, 720p, 4 Mbps, faststart flag for streaming

### `/thumbnail [video-title]`
Create a YouTube/social thumbnail.

**Steps:**
1. Use Higgsfield `/generate-image` with the video concept as prompt
2. Apply Adobe Creative Suite `/edit-image` for color grading
3. Add text overlay: bold title, contrast color, face if applicable
4. Export at 1280×720 (YouTube) or 1080×1080 (Instagram)

## VPS Deployment Note
OpenCut can be deployed to your VPS (146.190.78.120) for a private, always-on editing environment accessible from any device. Recommend running on port 3001 behind nginx, with PM2 for process management.

## When to Use
- Assembling Higgsfield-generated AI clips into full videos
- Creating social content at scale
- Adding captions and overlays to existing videos
- Building out a video production workflow without paying for CapCut/Premiere
