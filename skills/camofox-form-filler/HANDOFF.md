# HANDOFF — LoyaltyBot × camofox integration

Paste this whole file as your first message to a fresh Claude agent to resume
with full context.

---

## Resume prompt (copy from here down)

You are picking up an in-progress project. Read this before doing anything.

### What the project is
LoyaltyBot_V3 is a Python auto-form-filler that signs a client up for many
loyalty/rewards programs from a master CSV. Production success rate is only
**~4.7% (24/511)** — dominated by `"no form fields found"` and `timeout`.
Root cause: the production engine `auto-signup-parallel-FIXED.py` drives
Playwright + Chromium with ~250 lines of hand-rolled `STEALTH_JS`, which
modern anti-bot (Cloudflare/Akamai/DataDome/PerimeterX) still detects, so
pages are blocked/blanked **before a form ever renders**.

The fix is an alternate browser engine built on **camofox-browser**
(https://github.com/jo-inc/camofox-browser) — Camoufox (Firefox) with
C++-level fingerprint spoofing, wrapped in a REST API at `http://localhost:9377`.

### Architecture you're working with
- `loyaltybot_server.py` — local dashboard server (port 8765). `do_launch(cid,
  mode, workers, limit)` spawns one bot subprocess per client with
  `--workers --config config_<id>.json --progress progress_<id>.json
  --results signup-results_<id>.csv [--dry-run] [--limit]`.
- `auto-signup-parallel-FIXED.py` — async Playwright engine: smart queue
  (easy sites first, SSN/payment/in-store last), CapSolver auto-CAPTCHA,
  3-strike dead-URL retirement (`dead-urls.json`), `progress_<id>.json` +
  7-col results CSV `url,brand,program,status,worker,error,timestamp`.
- `dashboard.html` — polls `/status/<id>` and `/results/<id>`.
- Config schema (nested): `address{}`, `employment{}`, `education{}`, plus
  `ssn`, `capsolver_api_key`, flat fallbacks. **Real client config contains
  live PII (SSN, CapSolver key) — NEVER commit, log, or upload it anywhere.**

### What was built (this skill)
Folder `skills/camofox-form-filler/`:
- `camofox_client.py` — REST client for camofox-browser.
- `auto_signup_camofox.py` — single-process runner + **shared helpers**
  (`FIELD_PATTERNS`, `flat_config`, `match_field`, `get_priority`,
  `sort_by_priority`, `load_dead_urls`, `retire_repeated_failures`,
  `save_dead_urls`). Covers nested employment/education/SSN fields.
- `auto_signup_camofox_parallel.py` — **the drop-in engine.** Same CLI/file
  contract as `auto-signup-parallel-FIXED.py` (7-col CSV, progress.json,
  shared dead-urls.json, smart queue, `--retry`). Adds `navigate_to_form()`
  (clicks Sign Up/Create Account/Sign In + modal tabs when landing page has
  <2 fields) and `dismiss_cookie_banner()`. Multi-worker via threads, each
  with its own `CamofoxClient`; per-brand session persistence via
  `userId = loyaltybot-<slug>`.
- `loyaltybot_server.patched.py` — `do_launch()` patched with a per-client
  `"engine": "camofox"|"playwright"` toggle (client names scrubbed).
- `program.md` — Karpathy-autoresearch fixed-budget A/B loop to measure
  success_rate per change.
- `SKILL.md` — full skill doc.

### Where it lives
- Repo `Burst37/web-agent`, branch `claude/kind-babbage-vui0qq`, **PR #10** (draft).
- Repo `Burst37/Space-Age-Skills`, branch `claude/kind-babbage-vui0qq`,
  **PR #31** (draft) — same skill under `skills/camofox-form-filler/`.
- Google Drive: folder `LoyaltyBot-Camofox-Skill` inside the user's shared
  LoyaltyBot folder (partial upload — see "Open items").

### Known limitation
camofox-browser's REST API has **no JS-eval endpoint**, so the camofox engine
cannot inject CapSolver tokens (no auto-CAPTCHA). This is acceptable: the
dominant failures are pre-CAPTCHA bot blocks. CAPTCHAs that do render fall
back to noVNC manual solve (`ENABLE_VNC=1` on the camofox server).

### How to actually use it (user's machine, `C:\...\LoyaltyBot_V3\`)
1. `git clone https://github.com/jo-inc/camofox-browser && cd camofox-browser
   && npm install && npm start`  (→ :9377)
2. `pip install requests` and copy the 4 runtime files next to
   `config_<id>.json`.
3. A/B per `program.md`:
   `python auto-signup-parallel-FIXED.py --dry-run --limit 100 --config config_<id>.json --results A.csv --progress A.json`
   `python auto_signup_camofox_parallel.py --dry-run --limit 100 --config config_<id>.json --results B.csv --progress B.json`
   then score both and keep the winner.
4. To wire into the dashboard: apply `loyaltybot_server.patched.py`'s
   `do_launch()` change and set `"engine":"camofox"` on the client.

### Open items / next steps
- Finish Google Drive upload (SKILL.md, auto_signup_camofox.py, the parallel
  engine, patched server still pending at interruption).
- Run the real A/B (needs the camofox server + real CSV/config — not possible
  in the sandbox).
- Optionally: residential proxy on camofox, `--delay`/`MAX_NAV_HOPS` sweeps
  (hypotheses 2–5 in `program.md`).
- PRs #10 and #31 are draft; no CI configured on either. Mark ready / merge
  when validated locally.

### Guardrails
- Do NOT commit/log/upload real client PII (SSN, CapSolver key, email, phone).
- Develop on branch `claude/kind-babbage-vui0qq`; push there; keep PRs draft
  unless told otherwise.
