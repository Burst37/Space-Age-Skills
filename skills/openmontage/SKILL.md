---
name: openmontage
description: OpenMontage, an open-source agentic video production system — an AI coding assistant orchestrates research, scripting, asset generation, editing, and final composition into a real rendered video. Use when a video request needs a full production pipeline (multi-scene, multi-asset) rather than a single HyperFrames composition.
source: https://github.com/calesthio/OpenMontage
---

## Overview

OpenMontage turns an AI coding assistant (Claude Code, Cursor, Copilot, Codex) into a video production studio: it drives research → script → asset generation (via image/video-gen provider APIs) → editing → Remotion-based composition → final render. AGPLv3. Verified by cloning the actual repo and inspecting `skills/`, `AGENT_GUIDE.md`, and the Quick Start.

**How this differs from the `hyperframes` skills already in this repo:** HyperFrames is a rendering engine — you write HTML, it renders video, and the 20 hyperframes skills teach an agent *how* to author that HTML for specific formats (captions, motion graphics, etc.). OpenMontage is a full **production pipeline** with role-based "director" agents (idea-director, script-director, asset-director, edit-director, compose-director, publish-director) that orchestrate a whole project end-to-end, and it actually uses `hyperframes` as one of its documented core rendering options (`skills/core/hyperframes.md`) alongside `remotion.md`, `ffmpeg.md`, `whisperx.md`. Use OpenMontage when the ask is "produce a finished multi-scene video from a concept," and reach for the standalone `hyperframes-*` skills when the ask is a single, already-scoped composition.

OpenMontage ships 9 named pipelines (`clip-factory`, `cinematic`, `documentary-montage`, `hybrid`, `localization-dub`, `podcast-repurpose`, `talking-head`, `explainer`, `character-animation`, `animation`, `screen-demo`, `avatar-spokesperson`) — each is a full director-role folder under `skills/pipelines/`, not a portable standalone skill (they reference OpenMontage's own `config.yaml`, `backlot/` asset store, and provider setup), so this repo is used by cloning and running it as its own project rather than copying files into this Skills repo.

## Deploy / run

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

Requires: Python 3.10+, FFmpeg, Node.js 18+, and an AI coding assistant. Then open the project in Claude Code (or another supported assistant) and describe the video in plain language — the assistant reads `CLAUDE.md`/`AGENT_GUIDE.md` and takes it from there.

See `docs/PROVIDERS.md` in the repo for which image/video-gen API keys unlock which capabilities — the demo videos in the README show real costs per project (as low as $0.02–$1.33) depending on provider choice.

## Enhancement: point it at Higgsfield instead of ad-hoc provider keys

Space Age already has Higgsfield MCP configured for image/video generation. Rather than provisioning a separate set of API keys (OpenAI images, fal.ai/Kling, etc.) purely for OpenMontage, check `docs/PROVIDERS.md` for a generic/custom provider hook — if OpenMontage supports pluggable providers via API-compatible endpoints, route its asset-generation calls through the same Higgsfield credentials already in use elsewhere in the Space Age pipeline instead of duplicating billing relationships.

## Gotchas (from source inspection)

- AGPLv3 — stricter than the MIT/Apache licenses on most other tools in this Skills repo; if OpenMontage output or a modified copy of it is ever distributed as part of a paid product, read the AGPL obligations first.
- The `skills/pipelines/*/idea-director.md` files explicitly say "present the constraint, don't silently pick" for runtime/model selection — OpenMontage is designed to surface cost/quality tradeoffs to the human, not auto-decide; expect it to ask clarifying questions before generating anything expensive.
- This is a large, actively-changing project (160MB+ with docs/assets) — treat it as a tool you clone and run fresh each time, not something to vendor a copy of.
