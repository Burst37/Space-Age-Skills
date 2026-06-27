#!/usr/bin/env bash
# Space Age OS – v6 deploy
# Usage (with MiniMax direct API):
#   MINIMAX_API_KEY="..." MINIMAX_GROUP_ID="..." bash deploy-dashboard.sh
# Usage (OpenRouter only, skip MiniMax direct):
#   OPENROUTER_API_KEY="..." bash deploy-dashboard.sh
set -e

BRANCH="claude/stoic-rubin-ze3f9i"
TGZ="spaceage-dashboard-src-v7.tgz"
RAW="https://raw.githubusercontent.com/Burst37/Space-Age-Skills/refs/heads/${BRANCH}/${TGZ}"
DIR=/root/spaceage-dashboard

echo "→ fetching Space Age OS v6…"
rm -rf "$DIR"; mkdir -p "$DIR"
curl -fsSL "$RAW" | tar xz -C "$DIR"

# merge existing .env then layer in anything passed as env vars
ENV_FILE="$DIR/.env.local"
if [ -f /root/agent-os/.env ]; then cp /root/agent-os/.env "$ENV_FILE"; fi
if [ -f /root/agent-os/.env.local ]; then cat /root/agent-os/.env.local >> "$ENV_FILE"; fi

# write keys supplied via shell env into .env.local
for VAR in OPENROUTER_API_KEY MINIMAX_API_KEY MINIMAX_GROUP_ID; do
  if [ -n "${!VAR}" ]; then
    # remove any old line for this var, then append fresh
    sed -i "/^${VAR}=/d" "$ENV_FILE" 2>/dev/null || true
    echo "${VAR}=${!VAR}" >> "$ENV_FILE"
    echo "  ✓ wrote ${VAR} to .env.local"
  fi
done

cd "$DIR"
echo "→ installing deps (~30s)…"
npm install --no-audit --no-fund 2>&1 | tail -3
echo "→ building (~1–2 min)…"
npm run build 2>&1 | tail -5

echo "→ (re)starting pm2 on port 3000…"
pm2 delete spaceage 2>/dev/null || true
pm2 start node_modules/.bin/next --name spaceage -- start -H 0.0.0.0 -p 3000
pm2 save 2>/dev/null || true

echo ""
echo "✓ Space Age OS v6 live → http://146.190.78.120:3000"
echo ""
echo "  Agents ready:"
echo "  • DeepSeek V4 Pro  — needs OPENROUTER_API_KEY in .env.local"
echo "  • Gemini 3.5 Flash — needs OPENROUTER_API_KEY in .env.local"
echo "  • MiniMax M3       — needs MINIMAX_API_KEY (direct) or OPENROUTER_API_KEY (fallback)"
echo "  • MiniMax MCP      — install via Hermes → MCP Catalog → MiniMax"
