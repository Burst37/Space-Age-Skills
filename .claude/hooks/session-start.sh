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
    rm -rf "$SKILLS_DST/$skill_name"
    cp -r "$skill_dir" "$SKILLS_DST/$skill_name"
  done
fi

# Write session context reminder to env so Claude loads it automatically
# SESSION_MEMORY folder: 1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU
# Skills Drive folder:   1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9
cat >> "$CLAUDE_ENV_FILE" << 'EOF'
export SA_SESSION_MEMORY_FOLDER="1uimIv6Uou7Ug0bYabz_P4YLr2LhVLiIU"
export SA_SKILLS_DRIVE_FOLDER="1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9"
export SA_VPS_HOST="146.190.78.120"
export SA_GITHUB_USER="Burst37"
export SA_SKILLS_REPO="Burst37/Space-Age-Skills"
EOF
