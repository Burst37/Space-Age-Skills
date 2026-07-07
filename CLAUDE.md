# CLAUDE.md — Space Age AI Solutions
## Load This First. Every Session. No Exceptions.

## RULE #1 — SESSION START PROTOCOL

Before touching ANY task, run this checklist in order:

### 1. Read Session Memory from Google Drive
- Search `parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU'` for today's `YYYY-MM-DD.md`
- If found, read it — load all context, pending tasks, key IDs
- If not found, read the most recent file in that folder
- This is non-negotiable. Do not skip it.

### 2. Load Tier 0 Skills (Every Session)
1. `SpaceAge_Orchestrator_v2`
2. `karpathy-guidelines`
3. `icm-workspace-architect`
4. `sa-obsidian-vault-ops`
5. `animation-vocabulary`

### 3. Identify Project Type → Load Tier 2 Stack
See SESSION_INIT.md in Google Drive for full routing matrix.

### 4. Run Session Start Checklist
- [ ] Drive memory read — today's note loaded
- [ ] Tier 0 skills loaded
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
9. **Animation naming** — use `animation-vocabulary` when a user describes a motion effect but needs the proper UI/animation term.

## SESSION END CHECKLIST

Before closing any session:
- [ ] Write completed work + pending tasks to Drive SESSION_MEMORY/YYYY-MM-DD.md
- [ ] Log any credentials that exist (names only, never values)
- [ ] Push any code changes to relevant repo
- [ ] Note which skills need updating
