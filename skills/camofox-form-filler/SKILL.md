---
name: camofox-form-filler
description: Fill and measure client-authorized loyalty signup forms with the camofox-browser REST API. Use to diagnose LoyaltyBot form discovery, field matching, registration navigation, result verification, retries, and large-batch reliability.
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
`signup-results-camofox.csv` with the seven columns
`url,brand,program,status,worker,error,timestamp`. A `dry_run` indicates form
fill only. `verification_required` and `unverified` are not completed signups.

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
- **Results**: both runners write the 7-column schema
  `url,brand,program,status,worker,error,timestamp`.
- **Progress**: writes `progress_<id>.json` with the same
  `{running, start_time, stats{total,processed,success,failed,captcha,
  skipped}, current_workers[], log[], eta_seconds}` shape the dashboard
  already polls.
- **Dead URLs**: honors manually curated `dead-urls.json`; transient form,
  CAPTCHA, and network failures do not automatically retire URLs. Use
  `--ignore-dead-urls` to audit entries retired by earlier versions.
- **Workers**: `--workers N` spawns N threads, each with its own
  `CamofoxClient`; browser profile identifiers include a digest of client
  email and target URL to isolate clients and repeated brands.
- **Retry**: `--retry` re-processes recorded failures and challenges.
  Review pending verification and uncertain submissions manually before any
  resubmission, because the first request may already have created an account.

To wire it in, change the `do_launch()` subprocess command in
`loyaltybot_server.py` from `auto-signup-parallel-FIXED.py` to
`auto_signup_camofox_parallel.py` (keep the same `--workers/--config
--progress --results [--dry-run] [--limit]` args you already build) —
ideally behind a per-client `"engine": "camofox" | "playwright"` flag in
`config_<id>.json` so you can A/B the two engines per brand and compare
`signup-results_<id>.csv` success rates directly.

### CapSolver caveat

This engine does not integrate CapSolver. Current upstream releases expose an
evaluation endpoint, so the older claim that the REST API cannot evaluate
JavaScript is obsolete. CAPTCHA and no-form outcomes need separate review;
the previous 511-row Playwright run does not establish Camoufox's live rate.
Where a program requires a human challenge, use its normal manual route.

## Session isolation

Each row uses a stable per-client and per-URL identifier. Depending on the
camofox server's session deletion semantics, closing the session may remove
its cookies/localStorage. Do not assume a solved challenge survives a rerun.
Test persistence against the server version actually deployed before relying
on cookies across runs. Each completed row closes its tab and session.

## Tuning for higher success rates

- **Run a supervised manual pass** for `captcha_skipped` rows where the
  program supports it; verify completion independently.
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
| `purge_master_csv.py` | Drops dead/retired/structurally-unfit rows from `loyalty-rewards-MASTER.csv` (dead-URL retirement, optional live HTTP check, dealership/in-store junk filter) |
| `test_camofox_engine.py` | Offline regression suite (scripted fake camofox client — no server or network needed) |
| `score_results.py` | Count unique URLs and separate filled forms from confirmed signups |
| `FIXES.md` | Full writeup of the 23 engine bugs fixed in the success-rate pass, with the failure analysis and test coverage map |
| `program.md` | Karpathy-autoresearch fixed-budget A/B loop to measure success_rate per engine/config change |
| `requirements.txt` | Python deps (`requests`) |

## Trigger This Skill When

- A Playwright/Selenium-based form-filler (LoyaltyBot or similar) has a low
  success rate due to bot detection / CAPTCHAs / blocked pages.
- User mentions "camofox", "anti-detection browser", or asks to bypass bot
  detection for automated signups/form filling.
- User wants to add proxy + GeoIP + persistent sessions to an existing
  automated signup pipeline.

---

## Reliability fixes (success-rate pass)

23 bugs fixed across `camofox_client.py`, `auto_signup_camofox.py`,
`auto_signup_camofox_parallel.py`, `loyaltybot_server.patched.py`.

**Full writeup with every bug and its fix: [`FIXES.md`](FIXES.md).**

Short version — the failures were three stacked layers, each losing most of
what the layer above handed it:

1. **Most sites never produced a form.** The snapshot parser understood one of
   three formats, only the first page of a paginated snapshot was read, and
   pages were snapshotted before JS-rendered forms drew. A CAPTCHA wall was
   also misreported as "no form fields found", so the 2-strike rule
   permanently retired live sites.
2. **Forms that were found often couldn't submit.** Checkboxes were never
   ticked, `<select>` was typed into, `spinbutton`/`textarea` were ignored,
   and two regex precedence bugs wrote values into the wrong fields.
3. **Outcomes were recorded wrong.** Any page without a CAPTCHA counted as
   `success`; worker threads died on unhandled exceptions and dropped their
   rows silently; browser sessions were never closed, so long runs starved the
   camofox server and finished with fewer workers than they started with.

Regression suite: `test_camofox_engine.py` — 29 tests, no server or network
needed (scripted fake client).

```
python3 test_camofox_engine.py
python3 -m unittest test_camofox_engine -v
```

### New flag
`--page-timeout` (default 20s) on both engines — how long to wait for a form to render.

---

## Purging dead/junk rows: `purge_master_csv.py`

Run against the real `loyalty-rewards-MASTER.csv` on the client's machine
(not present in either sandbox repo). Three filters, all report-then-apply:

1. **Dead-URL retirement** — rows already 3-strike/no-form-strike retired in
   `dead-urls.json` from real runs (optionally re-mined from a results CSV
   with `--results`).
2. **Live-check** (`--live-check`, off by default) — HEAD/GET each remaining
   URL and drop DNS failures, connection errors, and 404/410/5xx.
3. **Structural junk** — car dealership / franchise brands (Nissan, Toyota,
   Ford, ...) and categories (`Automotive`, `auto financing`, `rent-to-own`,
   `timeshare`) and any barrier reading "in-store signup only" / "requires a
   visit". These aren't bugs to fix — a dealership "rewards" page is a lead
   form or financing application gated behind visiting a specific store, not
   a self-service signup. Add more with `--exclude-brand`/`--exclude-category`
   (comma-separated, additive to the built-in list).

```
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv                 # dry run + report
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --live-check    # + real HTTP check
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --apply         # writes cleaned CSV
```

`--apply` always writes a `.bak` of the original first (skip with
`--no-backup`) and a `purge-report.csv` of everything removed and why.

**Bug found and fixed while building this**: writing the cleaned CSV back to
the same path being read (the default, in-place purge) truncated the file
mid-`DictReader`-iteration — every row after the truncation point vanished
instead of being evaluated. Fixed by reading every row into memory before any
write. Covered by `test_camofox_engine.py::TestPurgeMasterCsv`.
