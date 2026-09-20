---
name: ponytail
description: "Lazy senior dev" autonomous coding agent plugin — reads task context, writes minimal one-shot diffs, and stops. Cross-tool plugin (Claude Code, Codex, Cursor, Cline, Kiro, Grok, Devin, Windsurf). Use when a task needs a terse, surgical, no-narration implementation pass instead of a verbose multi-turn build.
version: 1.0.0
source: https://github.com/DietrichGebert/ponytail
---

## Overview

Ponytail — "He says nothing. He writes one line. It works." An agent
plugin built around minimal, surgical patches instead of large rewrites
or verbose explanations. Ships as a multi-tool plugin: `.claude-plugin/`,
`.codex-plugin/`, `.cursor/`, `.clinerules/`, `.kiro/`, `.grok-plugin/`,
`.devin-plugin/` — same behavior wired into whichever agent runtime is
present.

Vendored as-is from the upstream repo (see `source` above for install
instructions, config, and the full command surface).

## When to reach for it

- A task calls for the smallest possible diff with zero narration —
  pairs well with `karpathy-guidelines`' "Surgical Changes" principle
  already enforced across Space Age sessions.
- You want a second, deliberately terse agent persona available
  alongside the verbose default for quick one-line fixes.

## License

See the plugin's own license/terms in this folder; this is a vendored
copy, not a Space Age original.
