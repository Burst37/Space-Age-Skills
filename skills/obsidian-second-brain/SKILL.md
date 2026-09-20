---
name: obsidian-second-brain
description: "One brain, eight platforms, 47 commands" — a cross-platform Obsidian PKM/second-brain skill runnable on Claude Code, Codex, Gemini, OpenCode, Antigravity, Hermes, Pi, and Grok Bot. Use for full Obsidian vault knowledge-management workflows (linked notes, PARA-style organization, daily notes) that go beyond the read/write-memory scope of `sa-obsidian-vault-ops`. Note: per CLAUDE.md, the Obsidian vault itself lives on the Windows machine, not the VPS — Google Drive remains the cross-session memory layer for VPS/agent work.
version: 1.0.0
source: https://github.com/eugeniughelbur/obsidian-second-brain
---

## Overview

Vendored as-is from upstream. A full second-brain workflow skill for
Obsidian: note linking, PARA-style structuring, and a large command
surface (47 commands) portable across 8 different agent runtimes via
its own `.claude-plugin/` + per-platform adapters.

Distinct from the existing `obsidian-skills` entry in this repo (which
is kepano's official, narrower Obsidian *operations* skill set —
markdown/CLI/bases/canvas/defuddle) and from `sa-obsidian-vault-ops`
(which is the Space Age Google-Drive-based session-memory layer, not a
full PKM system). This skill is the heavier, full second-brain layer —
load it when the task is actually organizing/growing a personal
knowledge vault, not just logging session memory.

## When to reach for it

- Setting up or maintaining an Obsidian vault as a second brain (not
  just session logging).
- Cross-agent PKM work where the same vault needs to be driven from
  more than one CLI (Claude Code, Codex, Gemini, etc).

## License

Vendored as-is; see `CITATION.cff` / license notices in this folder.
