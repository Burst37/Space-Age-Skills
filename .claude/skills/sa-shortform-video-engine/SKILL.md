---
name: sa-shortform-video-engine
description: >
  SA-supercharged version of harry0703/MoneyPrinterTurbo (~50k stars). Full
  pipeline for generating AI short-form videos (9:16 + 16:9) from a topic or
  script. Two modes: TURBO (MoneyPrinterTurbo for volume/speed, royalty-free
  stock) and CINEMATIC (Higgsfield Seedance/Kling for branded premium output).
  Use for: faceless content, Record Exec artist clips, Space Age promos,
  TheOtherLevel product videos, WYSIWYG brand content.
  Trigger: "make a short video", "faceless content", "AI video", "Reels",
  "TikTok content", "YouTube Shorts", "product video", "promo clip".
license: Space Age AI Solutions — internal use
---

# SA Short-Form Video Engine Skill
## Base: MoneyPrinterTurbo + Higgsfield Cinematic Layer | SA-extended May 2026

---

## TWO MODES

TURBO MODE: High-volume faceless content, stock footage, fast turnaround
CINEMATIC MODE: Higgsfield-generated visuals, SA prompt standards, premium brand output

---

## TURBO MODE SETUP

Docker install (VPS):
docker pull harry0703/moneyprinter-turbo:main
docker run -d -p 8501:8501 harry0703/moneyprinter-turbo:main

SA VPS (146.190.78.120):
docker run -d --name moneyprinter -p 8501:8501 \
  -e DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY \
  harry0703/moneyprinter-turbo:main

Hermes trigger: /video <topic> <duration> <voice>

LLM Routing:
Primary: deepseek-v4-pro via https://api.deepseek.com/v1
Fallback: google/gemini-flash-2.5 via OpenRouter

SA Voice Map:
authoritative_male: en-US-GuyNeural
cinematic_narrator: en-US-AndrewNeural
female_commercial: en-US-JennyNeural
hiphop_energy: en-US-TonyNeural
professional: en-US-RyanNeural

---

## CINEMATIC MODE (Higgsfield Integration)

Decision Matrix:
Stock footage OK -> TURBO MODE (faceless educational, topic explainers, high volume)
Higgsfield Required -> CINEMATIC MODE (brand hero, artist clips, product showcases, client deliverables)

Cinematic Pipeline:
1. Script -> DeepSeek V4 Pro (SA voice, no slop)
2. Scene breakdown -> SA cinematic-prompt-director skill
3. Characters -> NanoBanana Pro | Products -> ChatGPT Image 2.0 | BG -> Seedream 5
4. Video -> Seedance 2.0 (primary) | Hero -> Kling 3.0 | Lipsync -> Veo 3.1
5. Assembly -> music-visualizer skill
6. Voiceover -> Gemini Flash 3.1 TTS
7. Subtitles -> whisper auto
8. Export: 9:16 Reels/TikTok, 16:9 YouTube

---

## SA SCRIPT TEMPLATES

Faceless Educational (TURBO 60s):
Hook (0-3s): Bold statement. No "Hey guys".
Problem (3-15s): Specific pain. One sentence.
Agitation (15-25s): Cost of inaction.
Solution (25-40s): Your answer. Specific.
Proof (40-52s): Number or before/after.
CTA (52-60s): One action.

Brand Promo (CINEMATIC 30s):
[0-2s] Title card / logo
[2-8s] Problem in the world
[8-18s] Product as solution (hero shot)
[18-26s] Social proof or result
[26-30s] CTA + URL

Artist Clip (CINEMATIC 15s):
[0-2s] Artist name card, dark glassmorphism
[2-10s] Artist in environment, Soul ID
[10-14s] Song title + release date
[14-15s] Save/Follow CTA

---

## EXPORT SPECS

reels_tiktok: 1080x1920, 30fps, 8000k, h264
youtube_shorts: 1080x1920, 60fps, 10000k
youtube_standard: 1920x1080, 30fps, 8000k
instagram_feed: 1080x1080, 30fps, 6000k

Subtitle Standards:
Font: DM Sans Bold
Color: #FFFFFF on dark, #1A1A1A on light
Highlight: #FF6B00 (SA orange)
Size: 72-80px mobile-first
Max 32 chars per line

---

## CONTENT CALENDAR (Record Exec)

Monday: 1 educational clip (TURBO, 60s)
Wednesday: 1 artist promo clip (CINEMATIC, 15s)
Friday: 1 product/service clip (CINEMATIC, 30s)
Sunday: 1 behind-the-scenes clip (TURBO, 45s)

---

## REPO

- https://github.com/harry0703/MoneyPrinterTurbo (~50k stars)
