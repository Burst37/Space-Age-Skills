# LoyaltyBot — auto form filler

Automates signing a client up for many programs — **catalogs, loyalty / rewards,
sweepstakes, soft-pull credit** — far faster than filling them by hand. That is
the whole job.

## What changed

The old engine recognized fields only by `name` / `id` / `placeholder` /
`autocomplete`, so any form that labeled its fields in the `<label>` text (very
common on catalog / loyalty / sweepstakes sites) went unrecognized — the bot
"just sat there." It also had no consent-checkbox or split-DOB handling and
counted junk pages (auto clubs, phone-only, app-only) as failures.

**`recognition.py`** replaces the recognition brain:

- Reads each field's **resolved `<label>` text** + all attributes (pierces
  **shadow DOM**), so label-only forms fill correctly.
- Iterates **all** matches (fixes the hidden-decoy `.first` bug), skips
  hidden/disabled fields.
- Handles **required consent checkboxes**, **split month/day/year DOB**, and
  fuzzy `<select>` options.
- **Junk classifier** cleanly **skips** non-fillable pages (phone-only,
  app-only, non-signup) with a reason, so they don't count against the
  fillable-only success rate.

It is wired into `auto-signup.py` → `process_entry` as the primary pass, ahead
of the legacy selector/shadow/brute-force passes (kept as fallback). If
`recognition.py` is missing, the bot falls back to the old engine.

## Prove it

```bash
pip install playwright
python run_compare.py     # old vs new on 10 fixtures
```

Result: fully-correct fillable forms **OLD 4/9 → NEW 9/9**; the junk page is
skipped instead of failing. See `REPORT.md` for the full diagnosis (including
why 54% of the old failure CSV was an already-fixed crash, not recognition).

## Files

| file | purpose |
|---|---|
| `auto-signup.py` | production bot (patched) |
| `recognition.py` | new label-aware engine + junk classifier |
| `old_engine.py` | extracted legacy engine — baseline for the harness |
| `run_compare.py` | old-vs-new fixture harness |
| `fixtures/` | 10 synthetic forms + expected fills (`build.py`, `manifest.json`) |
| `REPORT.md` | diagnosis + proof |

## Never commit

Real client config (`config_*.json`), run results (`results*.csv`),
`dead-urls.json`, CapSolver key, or any client PII. See `.gitignore`.
