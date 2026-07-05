---
name: matts-peeker
description: Analyze a video (URL or local file) by extracting frames at 1Hz plus its transcript, and produce a structured report answering a specific question about it. TRIGGER when the user wants to analyze, review, break down, or ask questions about the content of a video — competitor ad teardown, tutorial breakdown, "what happens in this video", frame-by-frame analysis. Phrases: 'peek this video', 'analyze this video', 'break down this video', 'what happens at timestamp X', 'review this YouTube video'.
version: 1.0.0
---

# /peek Skill Overview

**Matt's Peeker** is a video analysis tool that extracts frames and transcripts, then generates structured output for follow-up work.

## Core Function

The skill processes video sources (URLs or local files) by sampling frames at 1 Hz and sending them to Google Gemini 2.5 Flash via OpenRouter for frame-by-frame descriptions.

## Key Capabilities

- Works with public video URLs and local video files
- Frame extraction via `yt-dlp` and `ffmpeg`
- Batch vision processing through OpenRouter
- Three-tier transcript retrieval: YouTube captions → Deepgram audio analysis → Super Data API

## Output Package

The tool generates three artifacts:
- `report.json`
- `report.md`
- `agent_context.txt`

## Setup Requirements

All API credentials (OpenRouter, Deepgram, Super Data) load from environment variables rather than hardcoded values.

| Variable | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | Frame vision descriptions (recommended) |
| `DEEPGRAM_API_KEY` | Audio transcription fallback |
| `SUPERDATA_API_KEY` | Last-resort transcript service |

## Usage Pattern

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/peeker.py" --source "<url-or-file>" \
  --question "<user-question>" --out-dir "<output-folder>"
```

Responses should cite timestamps, transcript evidence, and visual frame descriptions when relevant to the analysis.
