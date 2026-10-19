# Attribution

This skill is copied unmodified from:

https://github.com/vercel-labs/skills (`skills/find-skills/`)

Licensed under the MIT License — Copyright (c) 2026 Vercel, Inc. Full license text: https://github.com/vercel-labs/skills/blob/main/LICENSE

## What it is

`find-skills` teaches an agent how to use the `skills` CLI (`npx skills`) — Vercel's package manager for the open agent skills ecosystem — to search, evaluate, and install *other* skills on demand (e.g. `npx skills find react performance`, `npx skills add vercel-labs/agent-skills@web-design-guidelines`). It's a meta-skill: not a capability itself, but a way to discover and pull in more capabilities as they're needed, with built-in guidance on vetting quality (install count, source reputation, GitHub stars) before recommending anything.

## Keeping in sync

```bash
git clone --depth 1 https://github.com/vercel-labs/skills.git
cp vercel-labs-skills/skills/find-skills/SKILL.md Space-Age-Skills/skills/find-skills/SKILL.md
```
