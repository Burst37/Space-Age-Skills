---
name: agent-reach
description: Give AI agents read/search access to 13 internet platforms (Twitter/X, Reddit, YouTube, XHS, LinkedIn, HN, GitHub, RSS, web, Bluesky, Mastodon, Telegram, Discord). Installer + diagnostics + MCP server. After install, agents call upstream tools directly — this is glue, not a wrapper.
version: 1.5.0
source: https://github.com/Panniantong/Agent-Reach
---

## Overview

Agent Reach is a Python CLI + library that installs, configures, and doctors 13 platform channels for AI agent access. It exposes an MCP server so Claude Code can reach any channel directly.

## Install

```bash
pip install -e .
python -m agent_reach.cli install --env=auto
python -m agent_reach.cli doctor   # verify all channels
```

## MCP Server

Add to Claude Code MCP config (`mcporter.json` in `config/`):
```json
{ "agent_reach": { "command": "python -m agent_reach.integrations.mcp_server" } }
```

## Channels

Twitter/X · Reddit · YouTube · XHS · LinkedIn · HN · GitHub · RSS · Web · Bluesky · Mastodon · Telegram · Discord

Each channel: `can_handle(url)` / `read(url)` / `search(query)` / `check()`

## Cookie Auth (Twitter, XHS)

Use Cookie-Editor browser export only. XHS: never QR scan — it will hang.

## Core Pattern

```python
from agent_reach.core import read, search

result = read("https://x.com/somepost")
results = search("AI agent tools", channel="reddit")
```

## Rules

- NEVER modify upstream source of any integrated platform
- Route and call only — don't reimagine internals
- Run `pytest tests/ -v` before any commit
- Version must match in 3 places: `pyproject.toml`, `__init__.py`, `tests/test_cli.py`

## Attribution

MIT License — Panniantong / Agent-Reach
