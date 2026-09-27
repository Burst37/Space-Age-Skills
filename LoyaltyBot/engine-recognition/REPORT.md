# LoyaltyBot — Form-Recognition Fix

**Goal:** raise the auto-form-filler's success rate to 80–90%, measured against
**fillable forms only** (genuine web signups). Junk/dead/app-only/phone-only
pages are cleanly skipped and do **not** count as failures.

The bot's job, at its core: automate signing a client up for many programs
(catalogs, loyalty/rewards, sweepstakes, soft-pull credit) far faster than doing
it by hand. Nothing more. The fix keeps that scope and makes the recognition
actually work.

---

## 1. What was really wrong

The user's eyewitness account — *"sites pull up, could be auto-filled, and it
just sits there and does nothing… it doesn't recognize all but the most basic
forms"* — pointed at **field recognition**, not crashes. The data confirms it.

### 1a. The old failure CSV is dominated by an already-fixed crash

`signup-results.csv` — 14,037 rows:

| bucket | rows | share |
|---|---|---|
| **crash artifact** (`browser has been closed`) — already fixed by per-worker browsers | 7,625 | 54.3% |
| **no form fields found** — recognition failure | 1,730 | 12.3% |
| genuine dead (DNS / connection / SSL / HTTP) | 167 | 1.2% |
| timeout | 2,784 | 19.8% |
| success | 627 | 4.5% |

More than half of all "failures" were one crash that the current per-worker-browser
code already eliminates. **Excluding that crash**, the real picture (denominator
6,412):

- **27%** of real attempts died on **"no form fields found"** — the recognition bug.
- Only **2.6%** were genuinely dead sites.
- Success was **9.8%**.

So the single biggest remaining lever is recognition, exactly as reported.

### 1b. Why recognition failed

The old engine matched fields with a static CSS `FIELD_SELECTORS` dict keyed on
`name` / `id` / `placeholder` / `aria-label` / `autocomplete`. It had **no way to
read a field's `<label>` text**, used `.first` (so a hidden decoy could shadow the
real input), and had no handling for consent checkboxes or split date-of-birth
selects. Catalog / loyalty / sweepstakes forms routinely label their fields in the
`<label>` ("Mailing Address", "ZIP / Postal Code") with opaque names like
`q_0001` — invisible to the old brain. Result: it filled the one obvious password
box and stalled.

---

## 2. The fix — `recognition.py`

A universal, label-aware engine:

- **One DOM walk** (pierces open **shadow DOM**) collects every candidate field
  with its **resolved label** (via `for=`, wrapping `<label>`, `aria-labelledby`,
  preceding text) plus all attributes, and tags each with `data-lb-id`.
- **Classifies on the union of all signals** — so a field known only by its label
  is recognized. Iterates **all** matches (kills the `.first` decoy bug), skips
  hidden/disabled.
- Handles **required consent checkboxes** (terms / 18+), never marketing opt-ins;
  handles **split month/day/year DOB** selects; fuzzy-matches `<select>` options.
- **Junk classifier** (`classify_page`) — a page is *fillable* if it has an email
  **or ≥2 real fields** (so an address-only catalog form still qualifies).
  Otherwise it returns a skip reason: `phone-only-enrollment`, `app-only-enrollment`,
  `no-fillable-form`, or `not-a-signup-form`. The bot returns `"skipped"`, which is
  already tallied separately from failures.

It is wired into `process_entry` as the **primary pass**, before the legacy
selector/shadow/brute-force passes (which remain as fallback). If `recognition.py`
is absent, the bot falls back to the old engine — no hard dependency.

---

## 3. Proof — old vs new on 10 fixtures

`run_compare.py` drives both engines through real headless Chromium against 10
synthetic forms that reproduce the real-world shapes.

| fixture | shape | OLD filled | NEW filled |
|---|---|---|---|
| 01_trivial | clean `name=` | 4/4 ✅ | 4/4 ✅ |
| 02_label_only | signal only in `<label for>` | **1/5** ❌ | 5/5 ✅ |
| 03_wrapping_label | wrapping `<label>`, `name=q_0001` | **1/5** ❌ | 5/5 ✅ |
| 04_consent_checkbox | terms/age must be ticked | 3/4 ❌ | 4/4 ✅ |
| 05_split_dob | month/day/year selects | 2/3 ❌ | 3/3 ✅ |
| 06_odd_wording | "Given name" / "you@example.com" placeholders | **1/4** ❌ | 4/4 ✅ |
| 07_email_only | single email field | gate blocks | 1/1 ✅ |
| 08_decoy_hidden | hidden decoy email first | 3/3* | 3/3 ✅ |
| 09_shadow | inputs in shadow DOM | 3/3 | 3/3 ✅ |
| 10_junk_no_form | auto-club, "call to enroll" | no-op (counts as fail) | **skipped w/ reason** ✅ |

**Fully-correct fillable forms: OLD 4/9 → NEW 9/9.** Junk page: OLD stalls into a
"no form fields" failure; NEW skips it cleanly as `phone-only-enrollment`.

Reproduce:
```
python run_compare.py
```

---

## 3b. Reliability fixes for the rest of the buckets

Recognition addresses the "no form fields" bucket. These changes go after the
remaining losses so the *real* signup rate is as high as it can be:

- **Timeout cap reconciled (the 19.8% timeout bucket).** The outer watchdog was
  `timeout=60` while the captcha budget was 120s and the full CapSolver + fill +
  submit path needs ~80–100s — so every captcha site and every slow-but-valid
  site was killed as a "timeout" before it could finish. Raised to a named
  `PER_SITE_HARD_CAP_SEC = 110` (interactive modes get extra headroom so the
  operator's own captcha solving isn't cut off). Non-captcha sites finish in
  30–50s and are unaffected — this only stops killing the winnable slow ones.
- **CapSolver wait 20s → 40s.** Hard reCAPTCHA v2 image challenges routinely need
  >20s; the old cap turned solvable captchas into `captcha_failed`. The 110s
  per-site cap absorbs the extra time.
- **Batch manual-captcha wait bounded to 12s.** In headless batch there's no human
  to solve what CapSolver couldn't, so the 120s manual fallback just burned the
  cap. Interactive (`--manual`) runs still get the full wait.
- **Submit hardened.** Added a shadow-DOM form-submit fallback and an Enter-key
  last resort (many single-field email joins submit on Enter), plus a **second-
  chance submit**: if the form is still present, retry once (Enter + click) and
  re-check for a success signal before calling it a failure. This targets the
  "submit button not found" and "form still present after submit" losses.

Success detection keeps its existing conservative keyword/redirect logic, and the
"already have an account" case is still counted as a win (the client can use it).

## 4. Files

- `recognition.py` — the new engine (imported by the bot; falls back gracefully).
- `auto-signup.py` — production bot, patched: smart pass + junk-skip wired into
  `process_entry`.
- `fixtures/` — 10 HTML forms + `manifest.json` (expected fills) + `build.py`.
- `run_compare.py` — old-vs-new harness (the numbers above).

**No client PII** (SSN, email, phone, CapSolver key, config_*.json) is included in
this directory or the repo.
