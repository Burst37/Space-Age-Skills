#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  AGENT OS — VPS Setup Script
#  Paste this into your VPS console. It does everything.
#  Run as root on Ubuntu/Debian VPS.
# ═══════════════════════════════════════════════════════════════
set -e

REPO="https://github.com/Burst37/Space-Age-Skills.git"
BRANCH="claude/vibrant-bardeen-vvij07"
INSTALL_DIR="/opt/agent-os"
PORT=3737

echo ""
echo "═══════════════════════════════════════════"
echo "  🚀  Agent OS — VPS Setup"
echo "═══════════════════════════════════════════"
echo ""

# ─── 1. System packages ────────────────────────────────────────
echo "▶ Updating system packages..."
apt-get update -qq
apt-get install -y -qq curl git ufw python3 python3-pip 2>/dev/null

# ─── 2. Node.js 22 (always refresh to latest patch) ──────────
echo "▶ Installing/updating Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null 2>&1
apt-get install -y -qq nodejs
echo "  ✓ Node $(node -v)"

# ─── 3. PM2 (keeps the app running after logout / on reboot) ──
echo "▶ Installing PM2 process manager..."
npm install -g pm2 --silent
echo "  ✓ PM2 $(pm2 --version)"

# ─── 4. Clone / update repo ───────────────────────────────────
echo "▶ Getting Agent OS source..."
if [ -d "$INSTALL_DIR/.git" ]; then
  cd "$INSTALL_DIR"
  git fetch origin "$BRANCH" --quiet
  git checkout "$BRANCH" --quiet
  git pull origin "$BRANCH" --quiet
  echo "  ✓ Updated to latest"
else
  git clone --branch "$BRANCH" --depth 1 "$REPO" "$INSTALL_DIR" --quiet
  echo "  ✓ Cloned"
fi

# ─── 5. Install deps & build ──────────────────────────────────
cd "$INSTALL_DIR/source"
echo "▶ Installing npm dependencies (first time takes 2–3 min)..."
npm install --no-fund --no-audit --silent
echo "  ✓ Dependencies installed"

echo "▶ Building dashboard..."
PORT=$PORT npm run build --silent
echo "  ✓ Build complete"

# ─── 6. Create config ─────────────────────────────────────────
mkdir -p ~/.agentic-os
cat > ~/.agentic-os/config.json << CONFIG
{
  "locationLabel": "Dallas"
}
CONFIG
echo "  ✓ Config created at ~/.agentic-os/config.json"

# ─── 7. PM2 — start & save ────────────────────────────────────
echo "▶ Starting Agent OS with PM2..."
pm2 delete agent-os 2>/dev/null || true
pm2 start npm --name "agent-os" -- start -- --port $PORT
pm2 save --force
pm2 startup 2>/dev/null | tail -1 | bash 2>/dev/null || true
echo "  ✓ Agent OS running on port $PORT"

# ─── 8. Firewall — open port ──────────────────────────────────
echo "▶ Opening firewall port $PORT..."
ufw allow $PORT/tcp 2>/dev/null || true
echo "  ✓ Port $PORT open"

# ─── Done ─────────────────────────────────────────────────────
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || echo "146.190.78.120")
echo ""
echo "═══════════════════════════════════════════"
echo "  ✅  Agent OS is live!"
echo ""
echo "  Open this in your browser:"
echo "  👉  http://$VPS_IP:$PORT"
echo ""
echo "  PM2 commands:"
echo "  pm2 status          — check it's running"
echo "  pm2 logs agent-os   — see live logs"
echo "  pm2 restart agent-os — restart after changes"
echo "═══════════════════════════════════════════"
echo ""
