---
name: camofox-form-filler
description: >
  Anti-detection browser automation for high-success automated form filling
  (signups, loyalty/rewards enrollment, onboarding forms). Wraps
  camofox-browser (Camoufox-based, fingerprint-spoofed Firefox + REST API +
  accessibility-snapshot element refs) and provides a Python client plus a
  drop-in replacement for Playwright-based signup scripts such as
  LoyaltyBot's `auto-signup-playwright.py`. Use when an existing Playwright/
  Selenium/Chromium form-filler has a low success rate because sites detect
  the automated browser (Cloudflare challenges, "verify you are human",
  blocked/blank pages). Trigger on: "camofox", "anti-detection browser",
  "form filler success rate", "LoyaltyBot", "auto signup bot getting
  blocked", "bypass bot detection for form filling".
source: https://github.com/jo-inc/camofox-browser
stack: Python 3.10+ (client/runner) + Node.js 18+ (camofox-browser server)
requires: camofox-browser server running (npm install && npm start), Python `requests`
---

# Camofox Form Filler — Anti-Detection Signup Automation

Drop-in upgrade for Python form-filling bots (e.g. **LoyaltyBot**'s
`auto-signup-playwright.py`) whose success rate is low because the target
sites fingerprint and block Playwright/Selenium + Chromium.

## Why the success rate is low today

Plain Playwright drives Chromium with `navigator.webdriver`, predictable
GPU/canvas/AudioContext fingerprints, and a headless-ish profile that
Cloudflare and most loyalty-program signup pages detect and either:

- show a CAPTCHA / "verify you are human" challenge, or
- silently serve a blocked/blank page, or
- redirect to a bot-check loop that never resolves.

[camofox-browser](https://github.com/jo-inc/camofox-browser) wraps
[Camoufox](https://camoufox.com) — a Firefox fork patched **at the C++
level** (hardwareConcurrency, WebGL renderer, AudioContext, screen geometry,
WebRTC, timezone/locale/geo via proxy GeoIP) — behind a small REST API
designed for agents:

- Accessibility-snapshot based interaction (`[textbox e3] First Name`) instead
  of brittle CSS selectors that break every time a site redesigns its form.
- Per-user session isolation with persisted cookies/localStorage
  (`~/.camofox/profiles/`) so a brand's signup flow doesn't start from a
  blank fingerprint every run.
- Optional residential-proxy + GeoIP so locale/timezone/coordinates are
  consistent with the exit IP.
- A noVNC plugin for **visual CAPTCHA solving** — same "manual pause" UX
  LoyaltyBot already documents, but for a remote/headless server instead of
  a local visible Chromium window.

## Setup

### 1. Run the camofox-browser server (once, alongside LoyaltyBot)

```bash
git clone https://github.com/jo-inc/camofox-browser
cd camofox-browser
npm install && npm start
# -> http://localhost:9377
```

For better success on hard sites (Walgreens, CVS, etc.), add a residential
proxy so fingerprint geo matches the exit IP:

```bash
export PROXY_HOST=...
export PROXY_PORT=...
export PROXY_USERNAME=...
export PROXY_PASSWORD=...
npm start
```

To enable visual CAPTCHA solving (recommended for the first run per brand,
then the session/profile persists so subsequent runs skip it):

```bash
export ENABLE_VNC=1
export VNC_PASSWORD=yourpassword
npm start
# noVNC UI -> http://<host>:6080
```

### 2. Install the Python side (next to LoyaltyBot's existing script)

```bash
pip install -r requirements.txt   # just `requests`
```

Copy `camofox_client.py` and `auto_signup_camofox.py` into the LoyaltyBot
project root (same folder as `config.json` and `loyalty-rewards-MASTER.csv`).

## Usage — same inputs/outputs as `auto-signup-playwright.py`

```bash
# Dry run, 5 sites
python auto_signup_camofox.py --dry-run --limit 5

# Real run, 20 sites
python auto_signup_camofox.py --limit 20

# Resume from row 50
python auto_signup_camofox.py --start-index 50 --delay 5
```

It reads the same `config.json` (first_name, last_name, email, phone,
password, date_of_birth, address.*) and the same
`loyalty-rewards-MASTER.csv` (Category, Brand Name, Program Name, Direct
Sign-Up URL, Auto_Signup_Feasible), and writes
`signup-results-camofox.csv` with the same `url, brand, program, status,
timestamp` columns the dashboard already reads — `status` is one of
`success`, `dry_run`, `captcha_skipped`, `failed`.

## How field filling works

1. `GET /tabs/:id/snapshot` returns the accessibility tree with stable refs:
   `[textbox e3] First Name`, `[textbox e4] Email Address`, `[button e9] Create Account`.
2. Each interactive field's label is fuzzy-matched against the client config
   (first/last name, email, phone, password incl. confirm-password, DOB,
   street/city/state/zip) via `FIELD_PATTERNS` in `auto_signup_camofox.py`.
3. Matched fields are filled via `POST /tabs/:id/type` using the ref — no CSS
   selectors to maintain per site.
4. The snapshot is scanned for CAPTCHA/challenge text
   (`recaptcha|hcaptcha|cloudflare|verify you are human|...`). If found and
   `ENABLE_VNC=1`, the script prints the noVNC URL and polls until the
   challenge clears (or `--captcha-timeout` expires).
5. A submit button is located by label (`sign up|create account|register|
   join|enroll|continue|submit`) and clicked, unless `--dry-run`.

## Drop-in engine for LoyaltyBot_V3 (parallel + dashboard)

LoyaltyBot_V3's real architecture is bigger than a single-process script:
`loyaltybot_server.py` runs a local dashboard server (port 8765) and spawns
`auto-signup-parallel-FIXED.py` per client with `--workers N --config
config_<id>.json --progress progress_<id>.json --results
signup-results_<id>.csv [--dry-run] [--limit N]`. That script is async,
multi-worker Playwright + ~250 lines of hand-rolled `STEALTH_JS` (patching
`navigator.webdriver`, WebGL, plugins, etc.) plus optional CapSolver
auto-CAPTCHA-solving.

`auto_signup_camofox_parallel.py` in this skill is a drop-in alternate
**engine** with the *same* CLI flags and the *same* file contract, so
`loyaltybot_server.py`'s `do_launch()` can spawn it instead with no other
changes:

- **Config**: reads the real nested `config_<id>.json` schema
  (`address{}`, `employment{}`, `education{}`, `ssn`, `capsolver_api_key`,
  etc.) via `flat_config()`, which flattens nested sections into dotted keys
  (`employment.employer`, `education.college`, ...) and also derives
  `full_name` from `first_name`/`last_name`.
- **CSV**: reads `loyalty-rewards-MASTER.csv` including the `Barriers`
  column and reproduces the same smart queue (`sort_by_priority` /
  `get_priority` — no-barrier sites first, SSN/payment/in-store-only sites
  last).
- **Results**: writes the real 7-column schema
  `url,brand,program,status,worker,error,timestamp` (not the simplified
  5-column one `auto_signup_camofox.py` uses).
- **Progress**: writes `progress_<id>.json` with the same
  `{running, start_time, stats{total,processed,success,failed,captcha,
  skipped}, current_workers[], log[], eta_seconds}` shape the dashboard
  already polls.
- **Dead URLs**: shares `dead-urls.json` with the Playwright engine — same
  3-strike (overall failure) and 2-strike (no-form-fields-in-session)
  retirement rules, via `load_dead_urls` / `retire_repeated_failures` /
  `check_no_form_strike`.
- **Workers**: `--workers N` spawns N threads, each with its own
  `CamofoxClient`; per-brand session persistence (`userId =
  loyaltybot-<slugified-brand>`) means concurrent workers never collide on
  the same camofox profile.
- **Retry**: `--retry` re-processes only URLs whose last status was
  `failed`/`timeout`/`navigation_error`/`captcha_failed`/`captcha_skipped`.

To wire it in, change the `do_launch()` subprocess command in
`loyaltybot_server.py` from `auto-signup-parallel-FIXED.py` to
`auto_signup_camofox_parallel.py` (keep the same `--workers/--config
--progress --results [--dry-run] [--limit]` args you already build) —
ideally behind a per-client `"engine": "camofox" | "playwright"` flag in
`config_<id>.json` so you can A/B the two engines per brand and compare
`signup-results_<id>.csv` success rates directly.

### CapSolver caveat

camofox-browser's REST API has no generic JS-eval endpoint, so this engine
**cannot** auto-inject CapSolver tokens the way `auto-signup-parallel-FIXED.py`
does. In practice this matters less than it sounds: most of the production
failures (≈88% of 511 processed rows in one real run) were `"no form fields
found"` or 60-second timeouts — i.e. Playwright/Chromium getting
blocked/blank-paged before a CAPTCHA was ever served — which is exactly what
Camoufox's fingerprint spoofing targets. Any CAPTCHA that *does* render still
falls back to the noVNC manual-solve flow (`ENABLE_VNC=1`), same as
`auto_signup_camofox.py`.

## Per-brand session persistence

Each row uses `userId = loyaltybot-<slugified-brand>`. camofox persists that
user's cookies/localStorage across runs
(`~/.camofox/profiles/<hashed-userId>/storage_state.json`), so:

- A brand that required a manual CAPTCHA solve once (via VNC) won't need it
  again on the next run — the authenticated/cleared session carries over.
- Re-running `--start-index` to retry failures doesn't re-trigger
  first-visit bot checks for brands that already succeeded.

## Tuning for higher success rates

- **Run with `ENABLE_VNC=1` for the first pass** on any brand that comes
  back `captcha_skipped`, solve it once visually, then re-run — the
  persisted profile usually clears the challenge on subsequent visits.
- **Add a proxy** (`PROXY_HOST`/`PROXY_PORT`/...) if many `failed` rows are
  concentrated on sites known to geo-fence or rate-limit by IP.
- **Increase `--delay`** between sites — bursty traffic from one IP/profile
  is itself a detection signal.
- **Extend `FIELD_PATTERNS`** in `auto_signup_camofox.py` for any
  brand-specific label wording that isn't matching (e.g. "Confirm Email",
  "Birthdate", "Postal Code").
- Check `signup-results-camofox.csv` for clusters of `failed` vs
  `captcha_skipped` — `failed` with `filled 0 field(s)` in the log usually
  means the page structure didn't match any `FIELD_PATTERNS` and needs a
  pattern added, not a proxy.

## Files in this skill

| File | Purpose |
|---|---|
| `camofox_client.py` | Thin Python REST client for camofox-browser (tabs, snapshot, click, type, navigate, cookies) |
| `auto_signup_camofox.py` | Single-process signup runner + shared helpers (`FIELD_PATTERNS`, `flat_config`, smart-queue/dead-URL helpers) reused by the parallel engine |
| `auto_signup_camofox_parallel.py` | Multi-worker engine matching LoyaltyBot_V3's `auto-signup-parallel-FIXED.py` CLI/file contract (nested config, 7-column results CSV, `progress_<id>.json`, `dead-urls.json`) — drop-in replacement for `do_launch()` |
| `loyaltybot_server.patched.py` | Reference patch of LoyaltyBot_V3's `loyaltybot_server.py` with a per-client `"engine": "camofox"\|"playwright"` toggle wired into `do_launch()` (client name defaults scrubbed). Diff against your local copy or drop in. |
| `program.md` | Karpathy-autoresearch fixed-budget A/B loop to measure success_rate per engine/config change |
| `requirements.txt` | Python deps (`requests`) |

## Trigger This Skill When

- A Playwright/Selenium-based form-filler (LoyaltyBot or similar) has a low
  success rate due to bot detection / CAPTCHAs / blocked pages.
- User mentions "camofox", "anti-detection browser", or asks to bypass bot
  detection for automated signups/form filling.
- User wants to add proxy + GeoIP + persistent sessions to an existing
  automated signup pipeline.
