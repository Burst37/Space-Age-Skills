---
name: SpaceAge_Orchestrator_v2
description: >
  Space Age AI Solutions master routing skill. Consult at session start and before
  any non-trivial task. Decides which Tier 2 skill stack to activate based on project
  type and user intent. Also defines auto-trigger rules for recurring sub-skills
  (caveman-commit, caveman-review, systematic-debugging, verification-before-completion,
  defuddle, cavecrew, subagent-driven-development). Load this every session as part of
  Tier 0 — it is the routing brain.
---

# SpaceAge Orchestrator v2

Central routing and skill activation logic for Space Age AI Solutions sessions.

## Session Start Routing Matrix

Read user's first message. Route immediately.

| User signals | Activate Tier 2 stack |
|---|---|
| bot / scraper / loyalty / CapSolver | `LoyaltyBot` — Node.js + VPS (146.190.78.120) + pm2 |
| website / landing / Next.js / Vercel | `Web` — mcp__Vercel__* + Next.js + Tailwind |
| image / logo / design / poster / brand | `Design` — mcp__Adobe_for_creativity__* + mcp__Figma__* |
| data / pipeline / airtable / sheet / report | `Data` — mcp__Airtable__* + mcp__Coupler_io__* |
| VPS / server / nginx / pm2 / SSH / deploy | `Infra` — SSH + pm2 + nginx + systemd |
| Obsidian / vault / notes / daily / PARA | `Obsidian` — obsidian-skills + obsidian-cli + obsidian-markdown |
| doc / slides / presentation / PDF | `Docs` — quarkdown + mcp__Gamma__* |
| social / twitter / reddit / web search | `Reach` — agent-reach MCP |
| agent / subagent / orchestrate / parallel | `Agents` — superpowers subagent-driven-development + cavecrew |
| skills / claude.md / hook / session | `Meta` — this repo (Burst37/Space-Age-Skills) |

If ambiguous: ask one clarifying question before routing.

## Auto-Trigger Rules (always active, no manual invocation needed)

### On every git commit
→ use `caveman-commit` skill for compressed conventional commit message

### On any PR review request
→ use `caveman-review` skill for compressed inline review comments

### On any bug / test failure / unexpected output
→ use `systematic-debugging` BEFORE proposing any fix

### Before claiming work is complete / saying "done" / creating a PR
→ run `verification-before-completion` — evidence before assertions

### When executing a multi-task plan
→ use `subagent-driven-development` — one subagent per task, review after each

### When user pastes a URL to read/analyze
→ use `defuddle` skill (not WebFetch) unless URL ends in `.md`

### When spawning subagents for research or parallel execution
→ consult `cavecrew` for correct subagent type (investigator / builder / reviewer)

## Tier 2 Stack Details

### LoyaltyBot Stack
- VPS: `146.190.78.120` — SSH access, pm2 process manager
- Stack: Node.js, likely Express or similar
- **IMPORTANT**: LoyaltyBot is standalone. Zero connection to website pipeline.
- CapSolver key: check Drive LoyaltyBot note before asking user

### Web Stack
- Vercel team: `team_b7Ju9bt8GNoiLnMor6ieC8J7`
- MCP: `mcp__Vercel__deploy_to_vercel`, `mcp__Vercel__list_projects`
- CLI fallback: `vercel` CLI — never ask for token

### Design Stack
- MCP: `mcp__Adobe_for_creativity__*` for image/PDF/InDesign ops
- MCP: `mcp__Figma__*` for UI design and component work
- Rule: Encore logo always upper left chest in generated images

### Obsidian Stack
Skills to load together (activate as a group):
- `obsidian-skills` — master bundle
- `obsidian-cli` — vault CLI ops
- `obsidian-markdown` — OFM syntax
- `obsidian-bases` — .base database views
- `json-canvas` — .canvas visual maps
- `obsidian-releases` — plugin lookup only when needed
- **IMPORTANT**: Vault lives on Windows machine. NOT on VPS. Drive is memory layer.

## Model Routing

| Task weight | Model |
|---|---|
| Heavy: architecture, complex code, long docs | `claude-opus-4-8` |
| Standard: most tasks | `claude-sonnet-4-6` (current session model) |
| Light: quick lookups, short transforms | `claude-haiku-4-5-20251001` |

Never use `deepseek-chat` or `deepseek-reasoner`.

## Tool Priority (enforced always)

```
MCP server tool  >  gh/vercel/npm CLI  >  Anthropic SDK  >  raw API key
```

Never ask user for a credential if an MCP or CLI can authenticate automatically.

## Memory Protocol

Session start: read Drive SESSION_MEMORY for today's `YYYY-MM-DD.md`.
Session end: write completed work + pending + new IDs to same file.
Drive folder: `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU`

Credential logging: names only. NEVER values in Drive notes.
