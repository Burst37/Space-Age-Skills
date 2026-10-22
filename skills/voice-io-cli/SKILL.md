---
name: voice-io-cli
description: Use when the user wants Claude to generate spoken audio from text (TTS), transcribe audio/voice notes to text (STT), or clone/use a custom voice profile via a local Voicebox instance. Trigger on "read this aloud", "make an audio version", "transcribe this recording", "use my voice for this".
---

# Voice I/O via Voicebox

## Overview

[jamiepine/voicebox](https://github.com/jamiepine/voicebox) runs a local voice studio (TTS + STT + voice cloning) with a FastAPI backend and an MCP server (`backend/mcp_server`). This skill wires Claude Code into that backend so voice generation/transcription becomes a normal part of a workflow instead of a manual step in a separate app.

## When to Use

- "Turn this script into narration" / "read this email to me"
- "Transcribe this voice memo / meeting recording"
- "Generate this in my cloned voice" (a voice profile already exists in Voicebox)
- NOT for real-time conversational voice (Voicebox dictation mode is for live OS-level dictation, not agent-driven generation)

## Core Pattern

Voicebox exposes REST routes under `backend/routes/`: `speak.py` (TTS), `transcription.py` (STT), `profiles.py` (voice profiles), `models.py` (available TTS/STT models). The MCP server in `backend/mcp_server` wraps these for agent use — prefer the MCP tools if the MCP shim is registered; otherwise call the REST API directly.

## Quick Reference

| Task | Endpoint / MCP tool | Notes |
|---|---|---|
| List voice profiles | `GET /profiles` | Use a cloned profile's `id` for `speak` |
| Generate speech | `POST /speak` `{text, profile_id, model}` | Returns audio file/stream |
| Transcribe audio | `POST /transcription` `{file}` | Whisper-class model under the hood |
| List models | `GET /models` | Check what's downloaded before requesting a model |
| Check task status | `GET /tasks/{id}` | TTS/STT can be async for long inputs |

## Implementation

```bash
# 1. Confirm Voicebox backend is reachable
curl -s http://localhost:<PORT>/health

# 2. List available voice profiles (find the user's cloned voice)
curl -s http://localhost:<PORT>/profiles | jq '.[] | {id, name}'

# 3. Generate narration with a specific profile
curl -s -X POST http://localhost:<PORT>/speak \
  -H "Content-Type: application/json" \
  -d '{"text":"Here is your update.","profile_id":"<id>","model":"<model>"}' \
  -o output.wav

# 4. Transcribe a recording
curl -s -X POST http://localhost:<PORT>/transcription \
  -F "file=@meeting.wav"
```

If a generation/transcription task is async, poll `GET /tasks/{id}` until `status: "done"`, then fetch the result file.

## Common Mistakes

- **Assuming a default voice profile exists** — always `GET /profiles` first; cloned voices have user-specific IDs.
- **Treating TTS as instant** — long text gets queued as a task; poll rather than assuming the response is the final audio.
- **Skipping `/models`** — if the requested TTS/STT model isn't downloaded, the call fails; check availability first or fall back to a default model.
- **Using this for live dictation** — Voicebox's dictation feature is OS-level push-to-talk, not something an agent drives; don't try to "start dictation" via API.
