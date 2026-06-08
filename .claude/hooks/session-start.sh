#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

# ── Install Node dependencies ─────────────────────────────────────────────
if [ -f "$CLAUDE_PROJECT_DIR/package.json" ]; then
  cd "$CLAUDE_PROJECT_DIR"
  npm install --prefer-offline 2>&1 | tail -5 || npm install 2>&1 | tail -5
fi

# ── Sync custom skills to global ~/.claude/skills ──────────────────────────
SKILLS_SRC="$CLAUDE_PROJECT_DIR/.claude/skills"
SKILLS_DEST="$HOME/.claude/skills"

if [ -d "$SKILLS_SRC" ]; then
  mkdir -p "$SKILLS_DEST"
  for skill_dir in "$SKILLS_SRC"/*/; do
    skill_name=$(basename "$skill_dir")
    dest="$SKILLS_DEST/$skill_name"
    mkdir -p "$dest"
    cp -r "$skill_dir"* "$dest/" 2>/dev/null || true
  done
  echo "✅ Synced $(ls "$SKILLS_SRC" | wc -l | tr -d ' ') skills → ~/.claude/skills"
else
  echo "⚠️  No .claude/skills directory found — skipping skill sync"
fi
