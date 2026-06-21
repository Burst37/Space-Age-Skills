#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

# Install npm dependencies (cached after first run)
cd "$CLAUDE_PROJECT_DIR"
npm install

# Sync all skills from repo into ~/.claude/skills/ so they appear in slash menu
SKILLS_SRC="$CLAUDE_PROJECT_DIR/.claude/skills"
SKILLS_DST="$HOME/.claude/skills"

if [ -d "$SKILLS_SRC" ]; then
  mkdir -p "$SKILLS_DST"
  for skill_dir in "$SKILLS_SRC"/*/; do
    skill_name=$(basename "$skill_dir")
    cp -r "$skill_dir" "$SKILLS_DST/$skill_name"
  done
fi
