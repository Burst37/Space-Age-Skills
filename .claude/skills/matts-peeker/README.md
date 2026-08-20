# Matt's Peeker

A Python-based video inspection tool that extracts frames and transcripts from videos, then enriches them with AI descriptions.

## Requirements

- Python 3.10+
- `yt-dlp` (for URL downloads)
- `ffmpeg` + `ffprobe`

## Environment Variables

| Variable | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | Frame vision descriptions via Gemini 2.5 Flash |
| `OPENROUTER_MODEL` | Override model (default: `google/gemini-2.5-flash`) |
| `OPENROUTER_VISION_BATCH_SIZE` | Frames per API call (default: 8) |
| `DEEPGRAM_API_KEY` | Audio transcription fallback |
| `DEEPGRAM_MODEL` | Override model (default: `nova-2`) |
| `SUPERDATA_API_KEY` | Last-resort transcript service |
| `SUPERDATA_API_BASE_URL` | Override base URL (default: `https://api.superdata.ai`) |

## Usage

```bash
python3 scripts/peeker.py \
  --source "https://youtube.com/watch?v=..." \
  --question "What happens at the 2 minute mark?" \
  --out-dir ./output
```

## Output

- `report.json` — full timeline data
- `report.md` — human-readable summary
- `agent_context.txt` — AI-ready context file
- `frames/` — extracted JPEG frames
- `transcript.json` — timestamped transcript segments
