#!/bin/bash
# Space Age AI Solutions — Session Start Hook v2
# Emits additionalContext FIRST (non-blocking), then syncs skills in background.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

TODAY=$(date +%Y-%m-%d)
DOW=$(date +%A)

CONTEXT="╔══════════════════════════════════════════════════════════════╗
║   SPACE AGE SESSION INIT v2 — ${TODAY} (${DOW})
╚══════════════════════════════════════════════════════════════╝

HARD GATE: Complete all 4 steps before responding to any user task.

━━━ STEP 1 — MEMORY FIRST (sa-obsidian-vault-ops) ━━━━━━━━━━━━
  This is the most important step. Without it, every other skill
  runs blind. No context. No continuity. Do not skip.

  mcp__Google_Drive__search_files:
    query: title = '${TODAY}.md' and '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU' in parents
  → read file with mcp__Google_Drive__read_file_content
  → if not found: get most recent file in folder, read that
  → load ALL context: pending tasks, active projects, key IDs, credentials names
  → at session END: write updated note back to Drive (same folder, today's date)

━━━ STEP 2 — TIER 0 SKILLS (ALL active, every session) ━━━━━━━
  sa-obsidian-vault-ops → ALREADY RUNNING (Step 1). Memory layer. Read start, write end.
  SpaceAge_Orchestrator_v2 → Routing brain. Consult before any task.
  caveman              → ACTIVE NOW. Full mode. Every response. No revert.
  superpowers          → Spec-first. No code without approved spec.
  karpathy-guidelines  → Code quality baseline on all output.
  icm-workspace-architect → Workspace structure decisions.

━━━ STEP 3 — ROUTE TO TIER 2 STACK ━━━━━━━━━━━━━━━━━━━━━━━━━━
  bot/scraper/loyalty   → LoyaltyBot (VPS 146.190.78.120 + pm2 + Node.js)
  website/Vercel/Next   → Web (mcp__Vercel__* + Next.js + Tailwind)
  image/logo/design     → Design (mcp__Adobe_for_creativity__* + mcp__Figma__*)
  data/pipeline/base    → Data (mcp__Airtable__* + mcp__Coupler_io__*)
  VPS/server/deploy     → Infra (SSH + pm2 + nginx)
  Obsidian/vault/notes  → Obsidian stack (obsidian-skills + obsidian-cli + obsidian-markdown)
  doc/slides/report     → Docs (quarkdown + mcp__Gamma__*)
  social/web search     → Reach (agent-reach MCP)
  agent/parallel/plan   → Agents (superpowers subagent-driven-development + cavecrew)

━━━ STEP 4 — CONFIRM CHECKLIST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [ ] Drive memory read (or confirmed empty)
  [ ] caveman ACTIVE full mode
  [ ] superpowers loaded
  [ ] SpaceAge_Orchestrator_v2 routing done
  [ ] Model routing: claude-opus-4-8 heavy / claude-haiku-4-5-20251001 light
  [ ] MCP > CLI > SDK > raw key priority confirmed

━━━ AUTO-TRIGGER RULES (always on, no invocation needed) ━━━━━
  git commit           → caveman-commit skill
  PR review            → caveman-review skill
  bug / test failure   → systematic-debugging BEFORE any fix
  claiming done / PR   → verification-before-completion FIRST
  multi-task plan      → subagent-driven-development
  user pastes URL      → defuddle (not WebFetch), unless .md
  spawning subagents   → cavecrew for correct type

━━━ INFRA QUICK REF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  VPS:            146.190.78.120
  GitHub:         Burst37
  Skills Repo:    Burst37/Space-Age-Skills
  Skills Drive:   1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9
  SESSION_MEMORY: 1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU
  Vercel Team:    team_b7Ju9bt8GNoiLnMor6ieC8J7
  Agent Dashboard:http://146.190.78.120:3000
  API Proxy:      http://146.190.78.120:3400
  Model heavy:    claude-opus-4-8
  Model light:    claude-haiku-4-5-20251001
  Obsidian vault: Windows machine ONLY — NOT on VPS. Drive is memory.

━━━ ANTI-FORGET RULES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CapSolver key → check Drive LoyaltyBot note BEFORE asking user
  Vercel        → MCP or CLI, never ask for token
  GitHub        → mcp__github__* or gh CLI
  Credentials   → log NAMES only in Drive. NEVER values.
  caveman       → never self-revert. Off only on: 'stop caveman' / 'normal mode'
  LoyaltyBot    → standalone. ZERO connection to website pipeline.
  Encore logo   → upper left chest in ALL generated images.
  Skill naming  → lowercase-hyphen only. NO SA- prefix.

ONLY AFTER ALL 4 STEPS: respond to user task."

# ── EMIT JSON — must be first and only stdout ─────────────────────────────────
printf '%s' "{\"hookSpecificOutput\": {\"hookEventName\": \"SessionStart\", \"additionalContext\": $(printf '%s' "$CONTEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'), \"reloadSkills\": true}}"

# ── BACKGROUND TASKS ──────────────────────────────────────────────────────────
(
  SKILLS_SRC="$CLAUDE_PROJECT_DIR/.claude/skills"
  SKILLS_DST="$HOME/.claude/skills"

  if [ -d "$SKILLS_SRC" ]; then
    mkdir -p "$SKILLS_DST"
    for skill_dir in "$SKILLS_SRC"/*/; do
      [ -d "$skill_dir" ] || continue
      skill_name=$(basename "$skill_dir")
      rm -rf "${SKILLS_DST:?}/$skill_name"
      cp -r "$skill_dir" "$SKILLS_DST/$skill_name"
    done
  fi

  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    cat >> "$CLAUDE_ENV_FILE" << 'ENVEOF'
export SA_SESSION_MEMORY_FOLDER="1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU"
export SA_SKILLS_DRIVE_FOLDER="1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9"
export SA_VPS_HOST="146.190.78.120"
export SA_GITHUB_USER="Burst37"
export SA_SKILLS_REPO="Burst37/Space-Age-Skills"
export SA_VERCEL_TEAM="team_b7Ju9bt8GNoiLnMor6ieC8J7"
export SA_MODEL_HEAVY="claude-opus-4-8"
export SA_MODEL_LIGHT="claude-haiku-4-5-20251001"
ENVEOF
  fi

  if [ -f "$CLAUDE_PROJECT_DIR/package.json" ]; then
    npm install --silent 2>/dev/null || true
  fi
) &
