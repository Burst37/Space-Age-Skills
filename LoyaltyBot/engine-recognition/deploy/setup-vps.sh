#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# LoyaltyBot — VPS setup (Ubuntu/Debian, e.g. the DigitalOcean droplet)
#
#   Idempotent. Safe to re-run. Installs system deps, a Python venv, the bot's
#   Python packages, the Chromium browser (+ its OS libraries), and — optionally
#   — the Camoufox stealth browser.
#
# Usage:
#   cd loyaltybot/deploy
#   bash setup-vps.sh              # Chromium only
#   bash setup-vps.sh --camoufox   # also fetch the Camoufox stealth browser
#
# After it finishes:
#   1. cp .env.example ../.env        && edit ../.env   (CapSolver key, workers…)
#   2. cp config.example.json ../config.json && edit    (client PII — NEVER commit)
#   3. bash run.sh --headless true --limit 25            (smoke test)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

WITH_CAMOUFOX=0
[[ "${1:-}" == "--camoufox" ]] && WITH_CAMOUFOX=1

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$(cd "$HERE/.." && pwd)"     # the loyaltybot/ directory
VENV="$BOT_DIR/.venv"

log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }

# 1. System packages ----------------------------------------------------------
log "Installing system packages (python venv, build tools)…"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y python3 python3-venv python3-pip xvfb ca-certificates curl

# 2. Python venv --------------------------------------------------------------
log "Creating Python virtualenv at $VENV …"
[[ -d "$VENV" ]] || python3 -m venv "$VENV"
# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install --upgrade pip wheel

# 3. Python deps --------------------------------------------------------------
log "Installing Python requirements…"
pip install -r "$HERE/requirements.txt"

# 4. Chromium + its system libraries -----------------------------------------
log "Installing Chromium browser and OS dependencies for Playwright…"
python -m playwright install-deps chromium
python -m playwright install chromium

# 5. Optional: Camoufox stealth browser --------------------------------------
if [[ "$WITH_CAMOUFOX" == "1" ]]; then
  log "Fetching the Camoufox stealth browser (~150MB)…"
  python -m camoufox fetch
  echo "Camoufox ready. Set LB_BROWSER=camoufox in .env to use it."
fi

log "Done. venv at $VENV"
cat <<EOF

Next steps:
  cd "$BOT_DIR"
  cp deploy/.env.example .env                 && \$EDITOR .env
  cp deploy/config.example.json config.json   && \$EDITOR config.json   # client PII — never commit
  bash deploy/run.sh --headless true --limit 25   # smoke test

To run as a background service, see deploy/loyaltybot.service and DEPLOY.md.
EOF
