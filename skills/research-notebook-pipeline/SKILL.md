---
name: research-notebook-pipeline
description: Use when the user wants to collect sources (articles, PDFs, transcripts, links) into a persistent research notebook, ask questions across those sources, generate notes/insights from them, or turn a notebook into a podcast-style audio summary via a local Open Notebook instance.
---

# Research Notebook Pipeline

## Overview

[lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) is a self-hosted NotebookLM alternative with a REST API (`api/routers/`) covering notebooks, sources, notes, insights, chat-over-sources, and podcast generation. This skill turns it into a durable research workspace Claude can read/write across sessions, instead of re-fetching the same sources every time.

## When to Use

- "Add this article/PDF/video to my research notebook on X"
- "What have I collected so far on X? Summarize it."
- "Generate a podcast from my notes on X"
- "Ask the notebook: does any source mention Y?"
- NOT for one-off questions unrelated to an ongoing research project — use normal web research instead.

## Core Pattern

Open Notebook's data model: **Notebook** → **Sources** (ingested docs/links/transcripts) → **Notes** / **Insights** (derived) → optional **Podcast** (generated audio from notes via `episode_profiles` + `podcasts` routers). The key discipline is: ingest once, query many times — check whether a source already exists in the notebook before re-adding it.

## Quick Reference

| Task | Endpoint |
|---|---|
| List notebooks | `GET /notebooks` |
| Create notebook | `POST /notebooks` `{name, description}` |
| Add a source (URL/file/text) | `POST /sources` `{notebook_id, type, content/url}` |
| Search across sources | `POST /search` `{query, notebook_id}` |
| Chat over sources | `POST /source_chat` `{notebook_id, message}` |
| Save an insight/note | `POST /notes` `{notebook_id, content}` |
| List/create episode profile | `GET/POST /episode_profiles` |
| Generate podcast | `POST /podcasts` `{notebook_id, episode_profile_id}` |

## Implementation

```bash
# 1. Find or create the notebook for this topic
curl -s http://localhost:<PORT>/notebooks | jq '.[] | {id, name}'
curl -s -X POST http://localhost:<PORT>/notebooks -d '{"name":"AI agent frameworks"}'

# 2. Before adding a source, search to avoid duplicates
curl -s -X POST http://localhost:<PORT>/search -d '{"notebook_id":"<id>","query":"<title or URL>"}'

# 3. Add new source
curl -s -X POST http://localhost:<PORT>/sources -d '{"notebook_id":"<id>","type":"url","url":"<source>"}'

# 4. Ask a question across everything in the notebook
curl -s -X POST http://localhost:<PORT>/source_chat -d '{"notebook_id":"<id>","message":"Summarize the tradeoffs discussed across these sources"}'

# 5. (optional) Generate a podcast from accumulated notes
curl -s -X POST http://localhost:<PORT>/podcasts -d '{"notebook_id":"<id>","episode_profile_id":"<profile_id>"}'
```

## Common Mistakes

- **Re-ingesting the same source** — search the notebook before adding; duplicates dilute `source_chat` answers.
- **One giant notebook for everything** — create per-topic notebooks; cross-source chat quality drops when sources are unrelated.
- **Skipping `/notes`** — insights generated during a session disappear unless explicitly saved as a note for next time.
- **Generating a podcast before the episode profile exists** — create/select an `episode_profiles` entry first (voice, format, length).
