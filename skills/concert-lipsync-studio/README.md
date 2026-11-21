# Concert Lipsync Studio Skill (Seedance 2.5)

Turn one song + one character reference image into a 16:9 live-concert lip-sync music video package: timing map, ≤30 s segment audio, Seedance 2.5 prompts, edit plan, hero stills and a thumbnail brief. Optional modes blend in music-video story sections.

## What's in this folder
- `SKILL.md` — the agent skill (drop into any agent that supports SKILL.md skills, e.g. a `skills/concert-lipsync-studio/` folder). Trigger: "concert lipsync studio" (alias "concert video") or /concert-lipsync-studio.
- `concert-video-system-prompt.md` — the same workflow as a paste-in system prompt for ChatGPT, Claude, Grok or any LLM, including the canonical concert prompt block.
- `scripts/measure_offset.py` — free per-clip lip-sync drift fix: measures how early/late Seedance placed the song inside each generated clip (needs Python 3, numpy, ffmpeg).

## Quick start
1. Load the skill (or paste the system prompt).
2. Upload your song and your singer's reference image.
3. Pick a mode (Full Concert, Concert + MV, Best of Both Worlds), length and venue.
4. Copy the prompts into Seedance 2.5 (omni reference, 16:9) with each segment's audio file.

From Eric Palazzolo / MetricsMule.
