# CLAUDE.md — Space Age AI Solutions
## Loaded automatically every session. Non-negotiable. No skipping.

---

## RULE #1 — SESSION START PROTOCOL (HARD GATE)

You are blocked from doing any user task until all 4 steps complete.

### STEP 1 — Read Drive Memory
```
Search: parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU'
File:   YYYY-MM-DD.md (today's date)
Tool:   mcp__Google_Drive__search_files → mcp__Google_Drive__read_file_content
```
- Found → read it, load all context, pending tasks, key IDs
- Not found → get most recent file in that folder and read it
- Still nothing → note it, proceed without blocking

### STEP 2 — Activate Tier 0 Skills (ALL, every session)

| # | Skill | Behavior |
|---|-------|----------|
| 1 | `caveman` | ACTIVE NOW. Full mode. Every response. Zero exceptions. |
| 2 | `superpowers` | Spec-first before ANY build. No code without approved spec. |
| 3 | `SpaceAge_Orchestrator_v2` | Routes tasks → correct Tier 2 stack. Consult before choosing tools. |
| 4 | `karpathy-guidelines` | Code quality baseline. Applied to all code output. |
| 5 | `icm-workspace-architect` | Workspace structure decisions. |
| 6 | `sa-obsidian-vault-ops` | Drive memory read/write ops. Session start + end. |

### STEP 3 — Identify Project Type → Load Tier 2 Stack

Consult `SpaceAge_Orchestrator_v2` routing matrix. Fallback: read SESSION_INIT.md from Drive Skills folder.

**Quick routing:**
| Signal in request | Tier 2 stack |
|-------------------|-------------|
| bot / scraper / loyalty | LoyaltyBot stack |
| website / landing / Vercel | Web stack (Vercel MCP + Next.js) |
| image / logo / design | Adobe MCP + Figma MCP |
| data / pipeline / airtable | Airtable MCP + Coupler.io |
| VPS / server / deploy | SSH + pm2 + nginx stack |
| Obsidian / vault / notes | obsidian-skills + obsidian-cli |
| doc / report / presentation | quarkdown + Gamma MCP |

### STEP 4 — Confirm Checklist
- [ ] Drive memory read (or confirmed empty)
- [ ] caveman active (full mode)
- [ ] superpowers loaded
- [ ] SpaceAge_Orchestrator_v2 consulted for routing
- [ ] Model routing set: claude-opus-4-8 for heavy tasks
- [ ] MCP priority confirmed: MCP > CLI > SDK > raw API key

**Only after all 4 steps: begin user task.**

---

## INFRA QUICK REFERENCE

| Key | Value |
|-----|-------|
| VPS | `146.190.78.120` |
| GitHub user | `Burst37` |
| Skills Repo | `Burst37/Space-Age-Skills` |
| Skills Drive | `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9` |
| SESSION_MEMORY | `1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU` |
| Vercel Team | `team_b7Ju9bt8GNoiLnMor6ieC8J7` |
| Agent Dashboard | `http://146.190.78.120:3000` |
| API Proxy | `http://146.190.78.120:3400` |
| Model (heavy) | `claude-opus-4-8` |
| Model (light) | `claude-haiku-4-5-20251001` |

---

## TOOL PRIORITY (always in this order)

```
MCP server tool  >  gh CLI / vercel CLI  >  SDK  >  raw API key
```
Never ask for credentials if an MCP tool can do the job.

---

## ANTI-FORGETTING RULES

1. **CapSolver key** — check Drive LoyaltyBot note BEFORE asking user
2. **Vercel** — use `mcp__Vercel__*` or `vercel` CLI, never ask for token
3. **GitHub** — use `mcp__github__*` or `gh` CLI
4. **Model** — `claude-opus-4-8` heavy, `claude-haiku-4-5-20251001` cheap/fast. Never deepseek-*
5. **Skill naming** — lowercase-hyphen only. NO `SA-` prefix
6. **LoyaltyBot** — standalone product. Zero connection to website pipeline. Do not conflate.
7. **Encore logo** — upper left chest always in generated images
8. **Obsidian vault** — Windows machine only. NOT on VPS. Drive is the memory layer.
9. **Credentials** — log names only in Drive notes, NEVER values
10. **caveman** — stays active until user says "normal mode" or "stop caveman". Never self-revert.

---

## SESSION END CHECKLIST (before closing any session)

- [ ] Write to Drive SESSION_MEMORY: `YYYY-MM-DD.md` — completed work + pending + key context
- [ ] Log credential names that exist (values never stored)
- [ ] Push all code changes to correct repo + branch
- [ ] Note skills that need creating or updating
- [ ] If new IDs/endpoints discovered: add to Drive note

---

## SKILL LOADING MECHANICS

Skills live in `.claude/skills/` → synced to `~/.claude/skills/` by session-start hook.

To add a new skill:
1. Clone or create source in `.claude/skills/<name>/`
2. Add `SKILL.md` with frontmatter `name:` and `description:`
3. Mirror to `skills/<name>/` for repo-level storage
4. Commit + push → available next session automatically

---

## PROJECTS MAP

| Project | Repo | Stack | Notes |
|---------|------|-------|-------|
| LoyaltyBot | Burst37/... | Node.js + VPS | Standalone. Not website. |
| Space Age Skills | Burst37/Space-Age-Skills | Skills repo | This repo |
| Website | TBD | Next.js + Vercel | team_b7Ju9bt8GNoiLnMor6ieC8J7 |
