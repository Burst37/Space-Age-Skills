# LoyaltyBot — consolidated

Everything found in this repo and in Google Drive under "LoyaltyBot" /
"camofox" / "loyalty" as of 2026-09-23, gathered into one place at the
user's request. Three prior efforts existed in three different locations;
this folder is the index, not a rewrite.

## What's here

### `data/`
Pulled from Google Drive (`chuma.black314@gmail.com`), de-duplicated
(each existed in 2-3 copies across different Drive folders):

- **`loyalty-rewards-MASTER-2724.csv`** — 2,723 rows, the full working master
  list: Category, Brand, Program, Direct Sign-Up URL, Free-to-Join,
  Sign_Up_Type, Required_Fields, Auto_Signup_Feasible, Reward_on_Signup,
  Barriers. This is the current real target list — bigger and more complete
  than the 121-row sample CSV in `skills/camofox-form-filler/`.
- **`loyaltybot_new_urls.csv`** — 692 additional candidate sites (Site_Name,
  Domain, Category, Sub_Category, Batch_Source), not yet merged into the
  master.

### `engine-recognition/`
The code from PR #46 (`claude/loyalty-bot-form-filler-l7ji02`, opened but
never merged, last commit 2026-07-04) — a **separate, earlier attempt** at
the same problem, independent of the camofox engine in
`skills/camofox-form-filler/`:

- `auto-signup.py` / `old_engine.py` — an engine generation prior to camofox
- `recognition.py` — label-aware form-field recognition (matches fields by
  their visible label text, not just input type/name)
- `run_compare.py` — A/B harness to compare engine versions
- `scan_and_clean_master.py` — an earlier version of what
  `purge_master_csv.py` does in the camofox skill
- `fixtures/` — 10 synthetic test-page HTML fixtures (trivial form, wrapping
  labels, hidden decoy fields, shadow DOM, junk/no-form page, etc.) + a
  `build.py`/`manifest.json` to regenerate them. Useful for testing a
  recognizer without hitting real sites.
- `deploy/` — a VPS deploy kit: systemd `.service`/`.timer` units for
  scheduled/retry runs, `setup-vps.sh`, `.env.example` (template only, no
  real secrets)
- `README.md`, `REPORT.md` — this engine's own docs, written at the time

**This was never reconciled with the camofox engine.** The two don't share
code. If you want one engine going forward, `recognition.py`'s label-aware
matching is the one idea here worth pulling into
`skills/camofox-form-filler/` — it does something the camofox engine's
`FIELD_PATTERNS` regex approach doesn't (matches by rendered label text, not
just field name/type).

### The camofox engine itself
Lives at `skills/camofox-form-filler/` (not duplicated here) — the engine
with the 24 bug fixes, 29 tests, and `FIXES.md`. That's the one to run.
See its own `SKILL.md` and `HANDOFF.md`.

## What's in Drive but NOT copied here

Checked, not pulled in — either redundant, too large to fetch cleanly, or
needs an explicit decision from the user first:

| File | Why not copied |
|---|---|
| `progress_tyjuan01.json` | Live run-state log tied to a specific client run. No PII in it (brand names + pass/fail status only), but it's a point-in-time log, not reference material — pull it from Drive directly if you need that specific run's history. |
| `loyaltybot_server.py` (3 copies across Drive folders) | Superseded by `loyaltybot_server.patched.py` in `skills/camofox-form-filler/`. |
| `loyaltybot-for-opus.zip`, `LoyaltyBot Dashboard.zip`, `auto_signup_camofox.py.gz` | Archives of older snapshots of code that's already in this repo in newer form. |
| `Master_Loyalty_916_FINAL`, `LoyaltyBot — Client Onboarding` (Sheet + PDF) | Google Sheets/onboarding docs, not code — link them from Drive if needed rather than exporting to CSV here. |
| `perplexity-loyaltybot-handoff.pdf`, `LoyaltyBotSkillv3.md` (×2), `upgrade-path.md.pdf`, `loyalty_database_minimax.md` | Historical planning docs, superseded by `FIXES.md` and this README. |
| **`Sites for loyalty bot.pdf` / Google Doc (created 2026-09-23)** | Not opened or copied — flagged this session as needing your say-so before inclusion. Tell me directly if you want it pulled in. |

## Provenance map

```
Space-Age-Skills repo
├── skills/camofox-form-filler/   ← the engine to run (24 fixes, tests, FIXES.md)
└── LoyaltyBot/                   ← this folder: everything else, consolidated
    ├── data/                     ← real master lists, pulled from Drive
    └── engine-recognition/       ← PR #46's separate, unmerged attempt
```
