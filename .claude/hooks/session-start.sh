#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Emit additionalContext JSON FIRST before any blocking operations
TODAY=$(date +%Y-%m-%d)

CONTEXT="=== SPACE AGE SESSION INIT — $TODAY ===

RULE #1: You are operating under the Space Age AI Solutions SESSION_INIT protocol.
Before doing ANYTHING else, you must:
1. Read today's session memory from Google Drive:
   - Search parentId = '1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU' for title = '${TODAY}.md'
   - Read it with mcp__Google_Drive__read_file_content
   - If not found, get the most recent file in that folder and read it
2. Skills auto-trigger from their SKILL.md description/TRIGGER phrases — every skill in
   skills/ and .claude/skills/ is discoverable this session (see the skills list below).
   Don't blanket-load them; invoke only the ones matching the current task (e.g. editing a
   video → video-edit, a scroll-driven client site → cinematic-website-prompts, an Obsidian
   vault task → sa-obsidian-vault-ops). Always-relevant regardless of task: sa-obsidian-vault-ops
   (session memory lives in the Drive-backed vault).
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

# Output JSON with additionalContext — must be first stdout so Claude sees it immediately
printf '%s' "{\"hookSpecificOutput\": {\"hookEventName\": \"SessionStart\", \"additionalContext\": $(printf '%s' "$CONTEXT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'), \"reloadSkills\": true}}"

# Inject infra env vars
cat >> "$CLAUDE_ENV_FILE" << 'EOF'
export SA_SESSION_MEMORY_FOLDER="1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU"
export SA_SKILLS_DRIVE_FOLDER="1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9"
export SA_VPS_HOST="146.190.78.120"
export SA_GITHUB_USER="Burst37"
export SA_SKILLS_REPO="Burst37/Space-Age-Skills"
EOF

# Sync skills (after context emit — non-blocking for Claude).
# Two sources feed the same destination: .claude/skills (project-local, e.g. installed
# Obsidian sub-skills) and the top-level skills/ library (the canonical Space-Age-Skills
# catalog). Adding a skill to either directory is enough to make it auto-discoverable in
# every future session — no manual duplication needed.
SKILLS_SRCS=("$CLAUDE_PROJECT_DIR/.claude/skills" "$CLAUDE_PROJECT_DIR/skills")
SKILLS_DST="$HOME/.claude/skills"

mkdir -p "$SKILLS_DST"
for SKILLS_SRC in "${SKILLS_SRCS[@]}"; do
  if [ -d "$SKILLS_SRC" ]; then
    for skill_dir in "$SKILLS_SRC"/*/; do
      skill_name=$(basename "$skill_dir")
      rm -rf "$SKILLS_DST/$skill_name"
      cp -r "$skill_dir" "$SKILLS_DST/$skill_name"
    done
  fi
done

# npm install last — slow on cold cache, runs after context already injected
cd "$CLAUDE_PROJECT_DIR"
npm install --silent 2>/dev/null || true
