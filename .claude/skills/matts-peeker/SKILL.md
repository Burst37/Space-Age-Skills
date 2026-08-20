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
