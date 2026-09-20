---
name: claude-plugins-official
description: Mirror of Anthropic's official Claude Code plugin marketplace (anthropics/claude-plugins-official) — the curated directory of first-party and vetted third-party plugins installable via `/plugin`. Use as a reference when deciding which official plugin covers a need before building a custom Space Age skill, or to browse `/plugins` (Anthropic-maintained) and `/external_plugins` (partner/community) offline.
version: 1.0.0
source: https://github.com/anthropics/claude-plugins-official
---

## Overview

This is the directory Claude Code's `/plugin > Discover` browses. Two
top-level folders:

- **`plugins/`** — plugins developed and maintained by Anthropic.
- **`external_plugins/`** — third-party plugins from partners/community
  (not audited by Anthropic — check each plugin's own homepage before
  installing/trusting one).

Install any entry directly with:

```
/plugin install {plugin-name}@claude-plugins-official
```

## When to reach for it

- Before building a new Space Age skill from scratch, check this
  directory first — an official plugin may already cover it.
- Reference for plugin.json / manifest conventions when authoring new
  Space Age plugins.

## License

Vendored as-is; see each plugin's own LICENSE inside this folder.
