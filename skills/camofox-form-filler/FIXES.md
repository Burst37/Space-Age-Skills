# Camofox Signup Engine — Bug Fix Report

**Branch:** `claude/loyalty-boy-signup-bugs-6wg60w` (repo `Burst37/Space-Age-Skills`)
**Commits:** `f613b25` (23 bug fixes), `67ef6fd` (drop committed `__pycache__`), `ef8975a` (`purge_master_csv.py`)
**Files touched:** `camofox_client.py`, `auto_signup_camofox.py`, `auto_signup_camofox_parallel.py`, `loyaltybot_server.patched.py`
**Net diff:** +769 / −186 across 9 files
**Regression suite:** `test_camofox_engine.py` — 26 tests, all passing, no camofox server or network required (uses a scripted fake client)

Run it with either:

```bash
python3 test_camofox_engine.py
python3 -m unittest test_camofox_engine -v
```

---

## Why the success rate was ~4.7%

The failures were not one big problem. They were three separate layers each
losing most of what the layer above handed it:

1. **Most sites never produced a form at all** — the snapshot parser only
   understood one of three formats, only the first page of a paginated
   snapshot was read, and the bot snapshotted before JS-rendered forms drew.
   Everything downstream saw an empty page.
2. **Forms that did get found often couldn't submit** — checkboxes were never
   ticked, dropdowns were typed into instead of selected, and two regex
   precedence bugs wrote data into the wrong fields.
3. **Outcomes were recorded wrong even when things worked** — any page without
   a CAPTCHA counted as `success`, worker threads died silently and dropped
   their rows, and browser sessions were never closed, so long runs starved
   the camofox server.

---

## Group 1 — Made sites reachable that previously reported "no form fields found"

| # | Bug | Fix |
|---|-----|-----|
| 1 | `parse_snapshot()` understood only `[textbox e3] Label`. Any other snapshot renderer → zero items → every page looked formless. | Parser now accepts all three formats: `[role eN] label`, `- role "label" [ref=eN]`, `role "label" (eN)`. |
| 2 | Only the FIRST snapshot chunk was read; the API pages by `offset`. Fields below the fold were invisible. | `CamofoxClient.snapshot_text()` follows `offset`/`nextOffset`/`hasMore` pagination. |
| 3 | One fixed 3s wait after opening the tab, then snapshot. JS-rendered forms had not drawn yet. | `wait_for_form()` polls once per second up to `--page-timeout` (default 20s). |
| 4 | Hop loop took the first link matching an alternation containing both `create account` and `sign in`, in document order — the header "Sign In" won on most retail sites. | Split into `PRIMARY_SIGNUP_LINK_PATTERNS` (registration) tried fully before `FALLBACK_SIGNUP_LINK_PATTERNS` (login). |
| 5 | Hop guard `A and not B or C` parses as `(A and not B) or C` — the `or` re-admitted the submit buttons the guard was written to exclude. | Explicit ordered pattern iteration. |
| 6 | A CAPTCHA wall (no form rendered) was recorded as `no form fields found` → the 2-strike rule permanently retired live sites. | CAPTCHA is checked *before* a no-form strike is issued. |

**Bug 6 is the compounding one.** Every CAPTCHA-walled site got two strikes
and landed in `dead-urls.json` forever, so re-runs never retried sites that
were perfectly alive.

---

## Group 2 — Made filled forms actually submit

| # | Bug | Fix |
|---|-----|-----|
| 7 | Checkboxes were never touched — most programs refuse to submit with Terms unticked. | Required boxes (terms / privacy / age / consent) ticked; marketing and paid opt-ins explicitly skipped. |
| 8 | `<select>` fields (state, country) were typed into instead of selected. | `client.select()` with a click/type fallback. |
| 9 | `spinbutton` (numeric: zip, income) and `textarea` were missing from `INTERACTIVE_ROLES`. | Both added. |
| 10 | Re-fill after a CAPTCHA appended to already-filled fields → `"AdaAda"` → validation failure. | Fields cleared before typing; a `filled_refs` set skips fields already done. |
| 11 | `\bcity|town\b` parses as `(\bcity)` OR `(town\b)` — matched "Downtown". Same shape in the state rule. | Per-alternative word boundaries. |
| 12 | `street|address\s*(line\s*1|1)?\b` also matched "Address Line 2", writing the street into the apartment field. | Address line 2 gets its own rule, checked first. |

---

## Group 3 — Stopped losing work and misreporting outcomes

| # | Bug | Fix |
|---|-----|-----|
| 13 | Any non-`CamofoxError` (ConnectionError, ReadTimeout, KeyError) escaped `process_entry` → **the worker thread died**, its popped row vanished with no result written, and the run silently continued with fewer workers. | `_request()` wraps every `requests` exception as `CamofoxError`; `process_entry` and `worker_loop` both catch broadly and always record a row. |
| 14 | No transport retry — one network blip = permanent site failure. | 3 attempts with exponential backoff on connection errors and 408/425/429/5xx. |
| 15 | Any post-submit page without a CAPTCHA was recorded `success`, including pages still reading "Email is required". | `verify_submission()` classifies confirmation / validation-error / form-still-present. |
| 16 | Tabs leaked on every error path; browser sessions were **never closed at all** — 500+ sites exhausted the camofox server mid-run. | `finally: close_tab()` + `close_session()`. |
| 17 | `elif "captcha" in status` was checked before `elif status == "captcha_skipped"`, making the skipped branch unreachable — the dashboard's skipped counter was permanently 0. | Reordered. |
| 18 | `_no_form_strikes` was mutated from every worker thread with no lock. | Guarded by `_dead_urls_lock`. |
| 19 | The single-process runner wrote a 5-column CSV against the 7-column contract — unreadable by the dashboard and by `retire_repeated_failures()`. | Both engines now write the same 7 columns. |
| 20 | `create_tab` did `data["tabId"]` → raw `KeyError` on any other response shape. | Tolerant `tabId`/`id`/`tab_id` lookup with a clear error if none present. |
| 21 | `datetime.utcnow()` / `utcfromtimestamp()` — deprecated, returns naive timestamps. | `datetime.now(timezone.utc)`. |
| 22 | Server: camofox + manual mode still launched 5 workers, so a human watching over noVNC saw five tabs racing. | Clamped to 1 worker in manual mode. |
| 23 | Server: `_errors[cid]` written from the watcher thread without `_lock`, unlike every other access. | Locked. |

**Bugs 13 and 16 are why long runs got worse over time** — workers died off one
by one and sessions accumulated until the browser server stopped accepting new
ones. A run that started with 5 workers could finish with 1.

---

## New CLI flag

`--page-timeout` (default `20.0` seconds) on both engines — how long to wait
for a form to render before giving up on a page.

---

## Companion tool: `purge_master_csv.py`

Separate from the engine fixes. Cleans dead and structurally-unfit rows out of
the master CSV so the failure count reflects real bugs instead of rows that
were never going to work.

Three filters, all report-first:

1. **Dead-URL retirement** — rows already 3-strike retired in `dead-urls.json`
   from real runs (optionally re-mined from a results CSV with `--results`).
2. **Live check** (`--live-check`, off by default) — HEAD then GET each URL,
   drop DNS failures, connection errors, and 404/410/5xx.
3. **Structural junk** — dealership and franchise brands, automotive/financing/
   rent-to-own/timeshare categories, and any barrier reading "in-store signup
   only" or "requires a visit". A dealership "rewards" page is a lead form or
   financing application gated behind visiting a store — no engine fix makes
   those succeed.

```bash
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv                # dry run + report
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --live-check   # + real HTTP check
python purge_master_csv.py --csv loyalty-rewards-MASTER.csv --apply        # write cleaned CSV
```

`--apply` writes a `.bak` of the original first (skip with `--no-backup`) and a
`purge-report.csv` listing everything removed and why.

**Bug found and fixed while building this:** writing the cleaned CSV back to the
same path being read (the default in-place purge) truncated the file
mid-`DictReader`-iteration — every row after the truncation point silently
vanished instead of being evaluated. A test CSV that should have kept 1 row
produced a file with only a header. Fixed by reading every row into memory
before any write happens. Covered by
`test_camofox_engine.py::TestPurgeMasterCsv`.

---

## Test coverage

`test_camofox_engine.py` — 26 tests against a scripted fake camofox client.

| Class | Covers |
|---|---|
| `TestParser` | All three snapshot formats parse correctly |
| `TestFieldMatching` | Alternation precedence, address line 2 vs street, email vs address |
| `TestFillForm` | Text fills, select-vs-type, required-only checkboxes, no double-typing on refill, clear-before-type |
| `TestNavigation` | Create-account preferred over sign-in; submit buttons not clicked as navigation hops |
| `TestOutcomes` | Success requires confirmation; validation errors aren't success; CAPTCHA ≠ no-form; tab and session always released; unexpected exceptions don't escape |
| `TestWorkerLoop` | A crashing site still records a result and keeps the worker alive; `captcha_skipped` counts as skipped, not captcha |
| `TestResultsCsv` | The 7-column contract holds |
| `TestPurgeMasterCsv` | Dealership/dead/in-store rows purged; apply writes only survivors; source not truncated mid-read; backup intact; dry run writes nothing; `--exclude-brand` is additive |

Two bugs were found in the test file itself while writing it, both worth
remembering:

- A missing `import csv` only surfaced under `python3 -m unittest`, not under
  direct execution.
- `if __name__ == "__main__": unittest.main()` sat *above* a later-appended
  test class, so running the file directly silently executed 19 of 26 tests
  and reported success. Module-level discovery found all 26. The guard now
  sits at the true end of the file.
