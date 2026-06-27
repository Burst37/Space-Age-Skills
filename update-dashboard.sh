#!/usr/bin/env bash
set -e
DIR=/root/spaceage-dashboard
echo "→ fetching Space Age dashboard v4 (DeepSeek V4 Pro · Gemini 3.5 Flash · MiniMax M3)…"
rm -rf "$DIR.new"; mkdir -p "$DIR.new"
curl -fsSL "https://raw.githubusercontent.com/Burst37/Space-Age-Skills/refs/heads/claude/stoic-rubin-ze3f9i/spaceage-dashboard-src-v4.tgz" | tar xz -C "$DIR.new"
cp /root/agent-os/.env* "$DIR.new"/ 2>/dev/null || true
cp "$DIR"/.env* "$DIR.new"/ 2>/dev/null || true
rm -rf "$DIR"; mv "$DIR.new" "$DIR"
cd "$DIR"
echo "→ installing deps…"; npm install --no-audit --no-fund
echo "→ building (~1–2 min)…"; npm run build
echo "→ restarting on :3000…"
pm2 delete spaceage 2>/dev/null || true
PORT=3000 pm2 start npm --name spaceage -- start
pm2 save 2>/dev/null || true
echo "✓ DONE — http://146.190.78.120:3000  ·  DeepSeek V4 Pro / Gemini 3.5 Flash / MiniMax M3 in Agents"
