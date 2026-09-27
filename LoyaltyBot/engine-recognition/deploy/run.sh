#!/usr/bin/env bash
# Convenience wrapper: activate the venv, load .env, run the bot.
# All extra args are passed straight through to auto-signup.py.
#
#   bash deploy/run.sh --headless true --limit 25
#   bash deploy/run.sh --workers 6
#   bash deploy/run.sh --report                 # print the rate breakdown, no run
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$(cd "$HERE/.." && pwd)"
VENV="$BOT_DIR/.venv"

# shellcheck disable=SC1091
source "$VENV/bin/activate"

# Load .env if present (exports LB_BROWSER, CAPSOLVER_API_KEY, etc.)
if [[ -f "$BOT_DIR/.env" ]]; then
  set -a; # shellcheck disable=SC1091
  source "$BOT_DIR/.env"; set +a
fi

cd "$BOT_DIR"
exec python auto-signup.py "$@"
