#!/usr/bin/env bash
# Silent preflight check. Runs on every session start.
# Exits 0 (no output) if everything is ready. Prints one hint if not.
set -euo pipefail
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/setup.py" --check 2>&1 || true
