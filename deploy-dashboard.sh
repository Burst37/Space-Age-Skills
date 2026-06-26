#!/usr/bin/env bash
set -e
DIR=/root/spaceage-dashboard
echo "→ fetching the Space Age dashboard…"
rm -rf "$DIR"; mkdir -p "$DIR"
curl -fsSL "https://raw.githubusercontent.com/Burst37/Space-Age-Skills/refs/heads/claude/stoic-rubin-ze3f9i/spaceage-dashboard-src.tgz" | tar xz -C "$DIR"
# bring over your existing env/keys so agents light up
cp /root/agent-os/.env* "$DIR"/ 2>/dev/null || true
cd "$DIR"
echo "→ installing deps (~30s)…"
npm install --no-audit --no-fund
echo "→ building (~1–2 min)…"
npm run build
echo "→ starting on port 3001 (your current dashboard stays on 3000)…"
pm2 delete spaceage 2>/dev/null || true
PORT=3001 pm2 start npm --name spaceage -- start
pm2 save 2>/dev/null || true
echo "✓ DONE — open http://146.190.78.120:3001  (your old one is still on :3000)"
