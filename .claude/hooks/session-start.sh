#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies (cached after first run)
cd "$CLAUDE_PROJECT_DIR"
npm install --silent

# Sync all skills from repo into ~/.claude/skills/ so they appear in slash menu
SKILLS_SRC="$CLAUDE_PROJECT_DIR/.claude/skills"
SKILLS_DST="$HOME/.claude/skills"

if [ -d "$SKILLS_SRC" ]; then
  mkdir -p "$SKILLS_DST"
  for skill_dir in "$SKILLS_SRC"/*/; do
    skill_name=$(basename "$skill_dir")
    rm -rf "$SKILLS_DST/$skill_name"
    cp -r "$skill_dir" "$SKILLS_DST/$skill_name"
  done
fi

# Inject infra env vars
cat >> "$CLAUDE_ENV_FILE" << 'EOF'
export SA_SESSION_MEMORY_FOLDER="1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU"
export SA_SKILLS_DRIVE_FOLDER="1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9"
export SA_VPS_HOST="146.190.78.120"
export SA_GITHUB_USER="Burst37"
export SA_SKILLS_REPO="Burst37/Space-Age-Skills"
EOF

# Inject session memory + protocol into Claude's context via additionalContext
TODAY=$(date +%Y-%m-%d)

CONTEXT="=== SPACE AGE SESSION INIT — $TODAY ===

RULE #1: You are operating under the Space Age AI Solutions SESSION_INIT protocol.
Before doing ANYTHING else, you must:
1. Read today's session memory from Google Drive:
   - Search parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU' for title = '${TODAY}.md'
   - Read it with mcp__Google_Drive__read_file_content
   - If not found, get the most recent file in that folder and read it
2. Load Tier 0 skills: SpaceAge_Orchestrator_v2, karpathy-guidelines, icm-workspace-architect, sa-obsidian-vault-ops
3. Identify project type and load Tier 2 stack from SESSION_INIT.md

INFRA QUICK REF:
- VPS: 146.190.78.120
- Skills Repo: Burst37/Space-Age-Skills
- Skills Drive: 1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9
- SESSION_MEMORY: 1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU
- Vercel Team: team_b7Ju9bt8GNoiLnMor6ieC8J7
- Model: claude-opus-4-8 for heavy tasks
- Obsidian vault is on Windows machine — NOT on VPS. Drive is the memory layer.

DO NOT skip this. DO NOT start any task before reading Drive memory."

# Output JSON with additionalContext so it appears in Claude's context before first prompt
printf '%s' "{\"hookSpecificOutput\": {\"hookEventName\": \"SessionStart\", \"additionalContext\": $(printf '%s' "$CONTEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'), \"reloadSkills\": true}}"
