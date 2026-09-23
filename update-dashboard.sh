#!/usr/bin/env bash
set -e
DIR=/root/spaceage-dashboard
ENVF=/root/agent-os/.env
# If a MiniMax key was passed inline, save it to .env (upsert)
if [ -n "${MINIMAX_API_KEY:-}" ] && [ "$MINIMAX_API_KEY" != "PASTE_YOUR_KEY" ]; then
  touch "$ENVF"
  if grep -q '^MINIMAX_API_KEY=' "$ENVF"; then
    sed -i "s#^MINIMAX_API_KEY=.*#MINIMAX_API_KEY=${MINIMAX_API_KEY}#" "$ENVF"
  else
    echo "MINIMAX_API_KEY=${MINIMAX_API_KEY}" >> "$ENVF"
  fi
  echo "→ MiniMax key saved"
fi
echo "→ fetching Space Age dashboard v5…"
rm -rf "$DIR.new"; mkdir -p "$DIR.new"
curl -fsSL "https://raw.githubusercontent.com/Burst37/Space-Age-Skills/refs/heads/claude/stoic-rubin-ze3f9i/spaceage-dashboard-src-v5.tgz" | tar xz -C "$DIR.new"
cp /root/agent-os/.env* "$DIR.new"/ 2>/dev/null || true
cp "$DIR"/.env* "$DIR.new"/ 2>/dev/null || true
rm -rf "$DIR"; mv "$DIR.new" "$DIR"
cd "$DIR"
echo "→ installing deps…"; npm install --no-audit --no-fund
echo "→ building (~1–2 min)…"; npm run build
pm2 delete spaceage 2>/dev/null || true
PORT=3000 pm2 start npm --name spaceage -- start
pm2 save 2>/dev/null || true
echo "✓ DONE — open http://146.190.78.120:3000 → MiniMax in the sidebar"
