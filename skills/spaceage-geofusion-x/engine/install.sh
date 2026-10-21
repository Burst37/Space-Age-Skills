#!/usr/bin/env bash
# One-command install for GeoFusion X engine. Pinned versions; no secrets read or written.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; TOOLS="${GEOFUSION_TOOLS:-$HOME/.geofusion/tools}"; mkdir -p "$TOOLS"
GOSOM_COMMIT=d0b51bcf3cd56d9a3f71e049cb6e226554e24162
pip install -e "$HERE[full]"
# GoSom Maps collector (MIT) built from the pinned commit; needs Go >= 1.24. Docker image is the fallback.
if command -v go >/dev/null; then
  [ -d "$TOOLS/gosom" ] || git clone -q https://github.com/gosom/google-maps-scraper "$TOOLS/gosom"
  git -C "$TOOLS/gosom" fetch -q origin "$GOSOM_COMMIT" && git -C "$TOOLS/gosom" checkout -q "$GOSOM_COMMIT"
  (cd "$TOOLS/gosom" && go build -o "$TOOLS/gmaps-scraper" .)
  echo "export GEOFUSION_GOSOM_BIN=$TOOLS/gmaps-scraper"
else echo "Go not found: install Go or run 'docker pull gosom/google-maps-scraper'"; fi
# Real Lighthouse audits
(cd "$TOOLS" && npm init -y >/dev/null && npm i -s lighthouse@12.8.2) && echo "export GEOFUSION_LIGHTHOUSE=$TOOLS/node_modules/.bin/lighthouse"
# Agent Reach (social channel manager) + Exa search via mcporter
AR="${AGENT_REACH_DIR:-$HERE/../../agent-reach}"
if [ -d "$AR" ]; then pip install -e "$AR"; else pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"; fi
npm i -g mcporter@0.15.0
python -m playwright install chromium || echo "Playwright browser install skipped (set CHROME_PATH to an existing Chromium)"
echo "Done. Run: python -m geofusion readiness youtube,instagram,facebook,x,reddit,linkedin,tiktok"
