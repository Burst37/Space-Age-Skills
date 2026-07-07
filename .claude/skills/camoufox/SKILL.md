---
name: camoufox
description: Launch and drive Camoufox — an anti-detect Firefox fork — from Playwright for stealth browser automation that evades bot walls (Cloudflare, PerimeterX, DataDome). Use when a Chromium/Playwright run gets blocked, challenged, or fingerprinted, or when a task needs a hardened browser fingerprint. Includes an installer and a bot-detection smoke test. Powers the LoyaltyBot LB_BROWSER=camoufox backend.
version: 0.1.0
source: https://github.com/daijro/camoufox
---

## Overview

**Camoufox** is a custom, anti-detect build of Firefox. Instead of patching a
normal browser from JavaScript (which detection scripts can catch), it spoofs
the fingerprint at the **C++ level** — navigator, screen, WebGL, fonts,
timezone, WebRTC — so automated Firefox looks like an ordinary human's browser.
It speaks the Playwright Firefox protocol, so you drive it with the Playwright
API you already know.

Use it when the default Chromium path gets **blocked, CAPTCHA-walled, or
fingerprinted** (Cloudflare, PerimeterX/HUMAN, DataDome, Kasada). For most
sites, plain Chromium + `playwright-stealth` is faster and fine — reach for
Camoufox when a site actively fights you.

## Install

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/install-camoufox.sh"
# equivalently:
pip install "camoufox[geoip]"     # geoip aligns timezone/locale to the exit IP
python -m camoufox fetch          # downloads the browser (~150MB), one time
```

## Smoke test (run this first)

Confirms Camoufox launches on the current machine and passes a bot-detection
probe before you rely on it:

```bash
python "${CLAUDE_SKILL_DIR}/scripts/launch_camoufox.py" --url https://bot.sannysoft.com --headless
# or check a specific site that was blocking you:
python "${CLAUDE_SKILL_DIR}/scripts/launch_camoufox.py" --url https://example.com --headless --screenshot out.png
```

It prints `navigator.webdriver`, the reported UA/platform, and (for
sannysoft) a pass/fail summary, and can save a screenshot.

## Minimal usage (async Playwright)

```python
from camoufox.async_api import AsyncCamoufox

async with AsyncCamoufox(headless=True, humanize=True, os=("windows", "macos"),
                         locale="en-US", geoip=True) as browser:
    page = await browser.new_page()
    await page.goto("https://example.com")
    print(await page.title())
```

`AsyncCamoufox` yields a normal Playwright `Browser`; everything after
`new_page()` is ordinary Playwright.

### Options that matter

| option | effect |
|---|---|
| `headless=True` | no display; on a bare VPS use this (or `"virtual"` for xvfb) |
| `humanize=True` | human-like cursor trajectories between clicks |
| `os=("windows","macos")` | randomize the spoofed platform per launch |
| `geoip=True` | set timezone/locale/WebRTC to match the exit IP (needs `[geoip]`) |
| `proxy={...}` | route through a proxy; combine with `geoip=True` |
| `locale="en-US"` | language headers + JS locale |

## Using it inside LoyaltyBot

The bot has a built-in opt-in backend — no code changes needed:

```bash
# in loyaltybot/.env
LB_BROWSER=camoufox
# or per run:
python auto-signup.py --browser camoufox --headless true
```

If the `camoufox` package or browser isn't installed, the bot logs a warning and
falls back to Chromium, so a run never hard-fails. Validate with the smoke test
above on the VPS **before** pointing a full batch at it.

## Gotchas

- **First launch downloads the browser** — run `python -m camoufox fetch` during
  setup, not mid-run.
- **It's Firefox, not Chromium.** Chrome-only launch flags and CDP don't apply;
  use Playwright's Firefox-compatible surface.
- **Slower than Chromium** when `humanize=True` — that's the trade for stealth.
- **geoip needs the extra** (`camoufox[geoip]`) or it silently won't align the IP.
- **Concurrency:** each `AsyncCamoufox` is its own browser + temp profile. For
  many workers, launch one per worker and close each on shutdown.

## Files

| file | purpose |
|---|---|
| `scripts/install-camoufox.sh` | pip install + `camoufox fetch` |
| `scripts/launch_camoufox.py` | standalone launcher + bot-detection smoke test |
