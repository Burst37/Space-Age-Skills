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
6. `ponytail` — always on, level `full` (smallest complete change)
7. `caveman` — always on, Mode A chat compression (see *Token discipline*)

### 3. Identify Project Type → Load Tier 2 Stack
See SESSION_INIT.md in Google Drive for full routing matrix.

### 4. Run Session Start Checklist
- [ ] Drive memory read — today's note loaded
- [ ] Tier 0 skills loaded (incl. ponytail + caveman, always on)
- [ ] Project type identified → Tier 2 stack loaded
- [ ] VPS .env integrity confirmed if needed
- [ ] Model routing confirmed (claude-opus-4-8 for heavy tasks)
- [ ] MCP > CLI > SDK > raw key priority confirmed

---

## RULE #2 — TOKEN DISCIPLINE (ALWAYS ON, EVERY PROJECT)

Hardwired. Applies to every session in every repo, no trigger word needed.

**Ponytail** (`skills/ponytail`) — *what code gets written*:
- Smallest change that fully solves the task. Reuse what the codebase has → stdlib → installed deps → new code last.
- No unrequested abstractions, options, wrappers or "for later" code. Never add a dependency for a few lines.
- Never cut: validation at trust boundaries, data-loss error handling, security, accessibility, anything asked for.
- Non-trivial new logic leaves one small test or assert. Known limits get `// shortcut: <limit>, <when to upgrade>`.
- End coding replies with one line: what was skipped or not checked, and any risk.

**Caveman** (`skills/caveman`, Mode A) — *how much Claude says*:
- No preamble, no recap, no filler. Status as done / failed / blocked. Errors as one-line cause + fix.
- Lead with the result; bullets over paragraphs.
- Pipelines and batch runs: also apply Mode B (`skills/caveman/references/pipeline-token-budget.md`).

**Never compress:** client deliverables (decks, PDFs, meal plans, sites, copy), commit messages, PR bodies,
safety or security warnings, and anything the user must act on. Those stay complete and clear.
Off switch: "full mode" / "normal mode" / "stop ponytail" (session only).

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
4. **Model** — claude-opus-4-8 for heavy tasks. deepseek-chat/deepseek-reasoner are allowed *only* via the DeepSeek Harness (`dsh`, vendored in `Burst37/web-agent:vendor/deepseek-harness`) as a cheap/bulk lane — never as the main-pipeline model in Claude Code itself
5. **Skill folder naming** — lowercase-hyphen only, NO SA- prefix
6. **LoyaltyBot** — standalone product, zero connection to website pipeline
7. **Encore logo** — always upper left chest in generated images
8. **Obsidian vault** — lives on Windows machine, NOT on VPS. Google Drive is the memory layer.
9. **Animation naming** — use `animation-vocabulary` when a user describes a motion effect but needs the proper UI/animation term.
10. **TypeSafe (Jev)** — `typesafe:typesafe-ai` plugin (marketplace `typesafe-ai/skills`), installed user-scope. Use when a feature needs programmable common sense (routing, ranking, extraction, verification) that could become a typed AI judgment instead of an ad hoc LLM prompt-and-parse step. Read TypeSafe's live docs (docs.typesafe.ai) as source of truth when building an integration.

## SESSION END CHECKLIST

Before closing any session:
- [ ] Write completed work + pending tasks to Drive SESSION_MEMORY/YYYY-MM-DD.md
- [ ] Log any credentials that exist (names only, never values)
- [ ] Push any code changes to relevant repo
- [ ] Note which skills need updating

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
