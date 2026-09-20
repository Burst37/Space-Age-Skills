---
name: claude-mem
description: Persistent cross-session memory system for Claude Code — SQLite-backed, hooks into session start/end to store and retrieve project context, decisions, and history automatically. Use when a project needs durable memory beyond a single session without relying on the Google Drive SESSION_MEMORY pattern (sa-obsidian-vault-ops). Complementary, not a replacement, for that vault-ops flow.
version: 1.0.0
source: https://github.com/thedotmack/claude-mem
---

## Overview

Vendored copy of the installable `plugin/` surface from claude-mem: a
Claude Code plugin (`.claude-plugin/`) with session-lifecycle hooks,
an MCP server config (`.mcp.json`), a local SQLite store (`sqlite/`),
and a set of `skills/` for querying stored memory. Trimmed from the
upstream repo — `plans/` (slide decks), `tests/`, `docs/`, `src/`
(build source), and other-agent client dirs (`claude-mem-cursor`,
`claude-mem-grok-bot`, `openclaw`, `cowork`) were dropped to keep this
vendor copy lean; pull the full upstream repo if you need to build it
from source or use it with another agent runtime.

## When to reach for it

- A project wants automatic, queryable memory of past sessions rather
  than manual daily-note logging.
- Evaluating it against `sa-obsidian-vault-ops` / `sa-para-memory` for
  which memory layer fits a given pipeline — they can run side by side
  (claude-mem for fine-grained session recall, Drive vault for the
  human-readable daily-note layer Mr. Black reads directly).

## Install

See `plugin/.claude-plugin/` and the upstream README (`source` above)
for the full install/config flow, including required env vars.

## License

Vendored as-is; see `LICENSE` / `NOTICE` in this folder.
