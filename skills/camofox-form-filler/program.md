# program.md — LoyaltyBot Success-Rate Autoresearch Loop

> Karpathy `autoresearch` pattern applied to signup success rate instead of
> `val_bpb`. Agent runs fixed-budget experiments, measures the metric, keeps
> improvements, discards regressions, loops. You wake up to a better bot.

## Product scope: general application engine

This product is a multi-category application and enrollment engine. Job
applications are one lane; the main inventory also includes restaurant and
grocery rewards, retail loyalty programs, free mail-order catalog requests,
travel memberships, community memberships, and other categories. It must not
be presented as a credit-building service merely because some enrolled
customers have thin credit files.

The archived master contains 2,724 distinct URLs in 36 categories, including
2,482 marked auto feasible. Within that feasible cohort, the CSV declares
1,707 email/name/phone flows, 606 email-only flows, and 169 email/name flows.
These are inventory labels, not proof that those sites currently expose such
simple forms. A live inventory pass must verify the direct URL, current flow,
required fields, and completion evidence before the label drives automation.

Build one reusable profile and form engine, then add adapters for recurring
signup platforms and high-volume site families. Route by the site's observed
flow, not only by its category. Each adapter should know how to open the real
form, fill and validate required fields, submit at most once, and verify the
outcome. Fall back to the generic engine when no adapter applies. Send email
verification, CAPTCHA, ambiguous outcomes, and sensitive applications to an
assisted queue with clear customer consent and no silent resubmission.

An outcome has different evidence in each lane: an active loyalty account for
restaurant or retail rewards, a request receipt for a free catalog, a member
ID or confirmed account for travel, and an application receipt for a job. Do
not call form completion itself a success, and do not conflate catalog mailing
with credit reporting.

Measure the full 2,482-URL cohort and each category separately. Track URL
reach, form discovery, valid fill, submitted, pending verification, completed
account/application, and browser failures. An accepted application is a
completed application; it is not a job offer, approved credit, or a credit
score change. Publish both fully automated and assisted completion rates and
the number of sites excluded from each cohort.

## The Metric

**Verified live signup rate = confirmed success / all eligible unique URLs**
in the fixed cohort. An email verification prompt is pending, not completed.
Use the original master CSV as denominator, including URLs never attempted.
Historical Playwright slice: **24 / 511 ≈ 4.7%** labeled success. The later
archive records 627 / 14,037 attempts labeled success (4.5% per attempt),
but these labels are not independently verified and retries distort that rate.
**There is no trustworthy completed-signup baseline yet.**

Secondary metrics (diagnose *why* a run is low):
- `browser_closed_rate` = browser/page/context closure / attempts
- `no_form_rate` = `"no form fields found"` / processed
- `timeout_rate` = `timeout` / processed                 ← slow / bot-check loops
- `captcha_rate` = `captcha_skipped` / processed

## Fixed Experiment Protocol

- **Sample:** same 100 feasible URLs every run. `--limit 100` after
  `sort_by_priority` makes the slice deterministic. Never change the sample
  mid-study or the numbers stop comparing.
- **Budget:** one `--dry-run` pass for form discovery only. Dry runs never
  measure successful signups. For a live rate, submit on a separately tracked
  authorized cohort and verify the completed enrollment outcomes.
- **One variable per experiment.** Change one thing, re-run, compare.

```bash
# A — baseline Playwright engine
python auto-signup-parallel-FIXED.py --dry-run --limit 100 \
    --config config_tyjuan01.json --results A_playwright.csv --progress A.json

# B — camofox engine, same sample
python auto_signup_camofox_parallel.py --dry-run --limit 100 \
    --config config_tyjuan01.json --results B_camofox.csv --progress B.json
```

Compare dry runs by form-reach rate only. For live runs, score with
`python score_results.py --csv loyalty-rewards-MASTER.csv --results B.csv`.
Do not infer an 80–90% live rate from a form-reach experiment.

## Hypotheses Queue (ranked by expected payoff)

Worked top-down. Each line is one experiment.

1. **Stabilize the browser.** Start with the new two-worker default on the
   documented N6000 host. Compare browser closures and form reach at one and
   two workers. The runner stops an unhealthy batch after three consecutive
   closures; restart the browser before resuming remaining URLs.
2. **Engine swap → camofox.** H: some reachable pages may block the earlier
   Playwright engine. Compare form reach on a fixed sample after browser
   stability has been measured; the anti-bot cause is unverified.
3. **Residential proxy on camofox** (`PROXY_HOST/PORT/USER/PASS`). H: geo/IP
   fencing causes a chunk of `failed`/`timeout`. Expect timeout_rate down on
   airline/luxury/pharmacy sites.
4. **Per-brand session warmth** — run the sample twice; the 2nd run reuses
   persisted profiles. H: success_rate rises run-2 as first-visit bot checks
   are already cleared.
5. **`--delay` sweep** {0.5, 1.5, 3, 5}s. H: bursty traffic from one
   IP/profile is itself a signal; find the knee.
6. **MAX_NAV_HOPS sweep** {1,2,3}. H: more hops reach more modal-gated forms
   but cost time; find where success_rate stops climbing.
7. **VNC first-pass on captcha_skipped brands.** Solve once, persist, re-run.

## Scoring

Keep the master cohort fixed throughout the study. `score_results.py` counts
each eligible URL once and reports unattempted, pending email verification,
and unverified outcomes separately. For 2,500 eligible URLs, 80% means at
least 2,000 confirmed successes; 90% means 2,250. Report these only after a
live run and independent review of a sample of claimed successes.

## Loop

```
while hypotheses remain:
    pick top hypothesis
    run fixed experiment (one variable)
    score.py both arms
    if success_rate improved beyond noise: keep change, commit, update baseline
    else: revert, note result, move on
```

Log every result (date, variable, success_rate, deltas) in `EXPERIMENTS.md`
so you never re-test the same idea twice.
