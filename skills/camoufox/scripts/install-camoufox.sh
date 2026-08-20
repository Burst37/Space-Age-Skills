#!/usr/bin/env bash
# Install Camoufox (anti-detect Firefox) for Playwright automation.
# Idempotent: safe to re-run. Uses the active Python/venv.
set -euo pipefail

echo "▶ Installing camoufox[geoip] …"
pip install --upgrade "camoufox[geoip]"

echo "▶ Fetching the Camoufox browser (~150MB, one-time) …"
python -m camoufox fetch

echo "✓ Camoufox ready. Smoke-test it with:"
echo "    python \"\$(dirname \"\$0\")/launch_camoufox.py\" --url https://bot.sannysoft.com --headless"
