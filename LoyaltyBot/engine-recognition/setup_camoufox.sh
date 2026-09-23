#!/usr/bin/env bash
# One-shot Camoufox setup + smoke test for LoyaltyBot on the VPS.
# Run from /opt/loyaltybot. Installs Camoufox into the bot's venv,
# fetches the browser, then proves it defeats bot-detection and can
# reach a real retail signup page that blocks plain headless Chromium.
set -uo pipefail

VENV_PY="/opt/loyaltybot/.venv/bin/python"
VENV_PIP="/opt/loyaltybot/.venv/bin/pip"

echo "============================================================"
echo "  STEP 1/4  Install camoufox[geoip] into the bot venv"
echo "============================================================"
"$VENV_PIP" install --upgrade "camoufox[geoip]" || { echo "PIP INSTALL FAILED"; exit 1; }

echo
echo "============================================================"
echo "  STEP 2/4  Fetch the Camoufox browser (~150MB, one time)"
echo "============================================================"
"$VENV_PY" -m camoufox fetch || { echo "CAMOUFOX FETCH FAILED"; exit 1; }

echo
echo "============================================================"
echo "  STEP 3/4  Smoke test — is the fingerprint clean?"
echo "============================================================"
"$VENV_PY" - <<'PYEOF'
from camoufox.sync_api import Camoufox
try:
    with Camoufox(headless=True) as browser:
        page = browser.new_page()
        page.goto("https://bot.sannysoft.com", timeout=30000)
        page.wait_for_timeout(2500)
        wd = page.evaluate("() => navigator.webdriver")
        ua = page.evaluate("() => navigator.userAgent")
        print("  title             :", page.title())
        print("  navigator.webdriver:", wd, "  <-- want False/None")
        print("  userAgent         :", ua)
except Exception as e:
    print("  SMOKE TEST ERROR:", e)
PYEOF

echo
echo "============================================================"
echo "  STEP 4/4  Real-site test — Albertsons (blocks Chromium)"
echo "============================================================"
"$VENV_PY" - <<'PYEOF'
from camoufox.sync_api import Camoufox
targets = [
    "https://www.albertsons.com/account/register.html",
    "https://www.kroger.com/account/create",
    "https://www.safeway.com/account/register.html",
]
try:
    with Camoufox(headless=True) as browser:
        page = browser.new_page()
        for url in targets:
            try:
                resp = page.goto(url, timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(1500)
                code = resp.status if resp else "no-response"
                print(f"  [{code}] {url}")
                print(f"        title: {page.title()[:70]}")
            except Exception as e:
                print(f"  [ERR] {url} -> {str(e)[:60]}")
except Exception as e:
    print("  BROWSER LAUNCH ERROR:", e)
PYEOF

echo
echo "============================================================"
echo "  DONE. If STEP 3 shows webdriver=False and STEP 4 shows"
echo "  200s (not 403/404), Camoufox beats the bot walls. Then run"
echo "  the full bot with:  --browser camoufox --headless true"
echo "============================================================"
