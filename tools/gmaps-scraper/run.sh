#!/usr/bin/env bash
# Space Age — Google Maps Scraper Runner
# Run from inside tools/gmaps-scraper/

set -e

echo "=== Space Age Google Maps Scraper ==="
echo "Target: Mesquite TX (default)"
echo ""

# Install deps if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo "Installing Playwright browser..."
  npx playwright install chromium
fi

# Run scraper — pass through any extra args
node scraper.js "$@"
