---
name: vibe-trading
description: Self-hosted Vibe-Trading AI trading terminal/analyst as a paid pro trading terminal replacement. Use when deploying or configuring the Vibe-Trading agent stack on the Space Age VPS.
source: https://github.com/HKUDS/Vibe-Trading
---

## Overview

Vibe-Trading pairs an LLM-driven trading agent with a terminal/analyst UI. Verified from the repo's actual `docker-compose.yml` and `agent/.env.example` — it's an agent process + optional dev frontend, not a full trading platform with its own exchange connectivity built in by default.

## Deploy (VPS-tailored)

```bash
git clone https://github.com/HKUDS/Vibe-Trading.git
cd Vibe-Trading
cp agent/.env.example agent/.env
```

Pick one LLM provider block in `agent/.env` and fill it in — per your CLAUDE.md infra rules, prefer a real provider over DeepSeek if this agent's outputs matter for real trading decisions:

```
LANGCHAIN_PROVIDER=openrouter
LANGCHAIN_MODEL_NAME=<your chosen model>
OPENROUTER_API_KEY=<key>
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

```bash
docker compose up -d vibe-trading
```

The compose file binds the agent to `127.0.0.1:8899` only — it is **not exposed externally by default**. That's a deliberate safety choice for a service that can place trades; don't change the port binding to `0.0.0.0` without putting real auth in front of it.

To reach the UI remotely, tunnel rather than exposing directly:

```bash
ssh -L 8899:localhost:8899 user@146.190.78.120
```

Or, if you do want it on a subdomain, put Caddy in front with `basicauth` or an auth proxy — never expose 8899 raw.

## Enhancement: persistent agent state

The compose file already mounts `vibe-home:/home/vibe/.vibe-trading` — this is called out in the file's own comment as critical: it holds persistent memory, the session search index, user-created skills, and broker connector config. **Don't remove this volume on a rebuild** or all agent memory and connector config is wiped (the compose comment references upstream issue #197). Back this volume up alongside your other Docker volumes in the nightly dump.

## Gotchas (from source inspection)

- Default LLM in the example env is `deepseek/deepseek-v4-pro` via OpenRouter — per your own CLAUDE.md rule ("Never deepseek-chat or deepseek-reasoner"), swap this to a Claude/OpenAI model in `agent/.env` before running.
- `OLLAMA_BASE_URL` defaults to reaching the *host's* Ollama via `host.docker.internal` — if you don't run local models, this is irrelevant, but if you do, Ollama needs to be running on the VPS itself, not inside another container.
- The `frontend` service is dev-only (`npm run dev`, live-mounted source) — not meant for production; if you want a persistent UI, build it and serve statically instead.
