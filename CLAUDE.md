# CLAUDE.md — Space Age AI Solutions
## Load This First. Every Session. No Exceptions.

## RULE #1 — SESSION START PROTOCOL

Before touching ANY task, run this checklist in order:

### 1. Read Session Memory from Google Drive
- Search `parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU'` for today's `YYYY-MM-DD.md`
- If found, read it — load all context, pending tasks, key IDs
- If not found, read the most recent file in that folder
- This is non-negotiable. Do not skip it.

### 2. Skills auto-trigger — don't blanket-load
Every skill under `skills/` and `.claude/skills/` is synced into every session by
`.claude/hooks/session-start.sh`, so its name + TRIGGER description is always visible without
spending tokens on the full body. Only the skill(s) matching the actual task get invoked (via
the Skill tool) — that's the token-saving mechanism. `sa-obsidian-vault-ops` is the one
exception worth loading proactively every session, since session memory lives in the
Drive-backed vault.

### Task → Skill Routing (contingent, not blanket)
| Task looks like… | Load |
|---|---|
| "redo/build a cinematic/award-winning/scroll-driven website" | `cinematic-website-prompts` |
| "edit this video / add captions / add b-roll / one-shot this" | `video-edit` |
| "build a wiki / second brain / knowledge base that stays current" | `llm-wiki` |
| "analyze / break down / peek this video" | `matts-peeker` |
| any Obsidian vault read/write, daily notes, PARA memory | `sa-obsidian-vault-ops`, `obsidian-skills` |
| installing/recommending an Obsidian plugin or theme | `obsidian-releases` |
| giving an agent read/search access to Twitter, Reddit, YouTube, etc. | `agent-reach` |

Note: `SpaceAge_Orchestrator_v2`, `karpathy-guidelines`, and `icm-workspace-architect`
(previously listed here as Tier 0) do not exist as skills in this repo or under an exact
matching name in the Skills Drive folder — the closest matches found there are several
differently-named orchestrator variants and a `karpathy-autoresearch` folder. Until one of
those is confirmed as canonical and imported properly, don't try to "load" them by name.

### 3. Identify Project Type → Load Tier 2 Stack
See SESSION_INIT.md in Google Drive for full routing matrix.

### 4. Run Session Start Checklist
- [ ] Drive memory read — today's note loaded
- [ ] Skills catalog visible (synced by session-start.sh) — no blanket load, task-triggered only
- [ ] Project type identified → Tier 2 stack loaded
- [ ] VPS .env integrity confirmed if needed
- [ ] Model routing confirmed (claude-opus-4-8 for heavy tasks)
- [ ] MCP > CLI > SDK > raw key priority confirmed

---

## QUICK REFERENCE — INFRA

| Key | Value |
|-----|-------|
| VPS | 146.190.78.120 |
| GitHub | Burst37 |
| Skills Repo | Burst37/Space-Age-Skills |
| Skills Drive Folder | 1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9 |
| SESSION_MEMORY Folder | 1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU |
| Vercel Team | team_b7Ju9bt8GNoiLnMor6ieC8J7 |
| Agent Dashboard | http://146.190.78.120:3000 |
| API Proxy | http://146.190.78.120:3400 |

## ANTI-FORGETTING RULES

1. **CapSolver key** — check Drive/Obsidian LoyaltyBot note before asking
2. **Vercel** — use MCP or CLI, never ask for token
3. **GitHub** — use gh CLI or GitHub MCP
4. **Model** — claude-opus-4-8 for heavy tasks. Never deepseek-chat or deepseek-reasoner
5. **Skill folder naming** — lowercase-hyphen only, NO SA- prefix
6. **LoyaltyBot** — standalone product, zero connection to website pipeline
7. **Encore logo** — always upper left chest in generated images
8. **Obsidian vault** — lives on Windows machine, NOT on VPS. Google Drive is the memory layer.

## SESSION END CHECKLIST

Before closing any session:
- [ ] Write completed work + pending tasks to Drive SESSION_MEMORY/YYYY-MM-DD.md
- [ ] Log any credentials that exist (names only, never values)
- [ ] Push any code changes to relevant repo
- [ ] Note which skills need updating
