---
name: obsidian-skills
description: Official Obsidian agent skills by kepano (Obsidian creator). Covers vault operations, markdown standards, CLI usage, JSON Canvas, Bases, and Defuddle. Use for reading/writing Obsidian vaults, daily notes, PARA memory, and session logging. Load this skill whenever working with the Obsidian vault at AGENTIC_OS_VAULT.
version: 1.0.0
source: https://github.com/kepano/obsidian-skills
---

## Overview

Agent Skills for Obsidian — compatible with Claude Code, Codex, and OpenCode. Covers the full surface area of Obsidian vault operations.

## Skills Included

- **obsidian-markdown** — Obsidian-flavored Markdown: wikilinks, embeds, callouts, tags, frontmatter
- **obsidian-cli** — CLI access to vault (read, write, search, daily notes)
- **obsidian-bases** — Bases (Obsidian's native database views)
- **json-canvas** — JSON Canvas format spec for infinite canvas files
- **defuddle** — Content extraction: clean article text from URLs into vault notes

## Vault Ops — Session Pattern

```
# Read today's daily note
cat "$AGENTIC_OS_VAULT/Daily Notes/$(date +%Y-%m-%d).md"

# Append session log entry
echo "\n## Session $(date +%H:%M) — $TASK_INTENT" >> "$AGENTIC_OS_VAULT/Daily Notes/$(date +%Y-%m-%d).md"

# Read last project note
ls -t "$AGENTIC_OS_VAULT/Projects/" | head -1 | xargs -I{} cat "$AGENTIC_OS_VAULT/Projects/{}"
```

## Wikilink Format

```markdown
[[Note Title]]              — internal link
[[Note Title|Display Text]] — aliased link
![[image.png]]              — embed
#tag                        — tag
```

## Frontmatter

```yaml
---
date: 2026-06-21
tags: [session, space-age]
status: active
---
```

## Attribution

MIT License — kepano / obsidian-skills
