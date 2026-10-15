# program.md — LoyaltyBot Success-Rate Autoresearch Loop

> Karpathy `autoresearch` pattern applied to signup success rate instead of
> `val_bpb`. Agent runs fixed-budget experiments, measures the metric, keeps
> improvements, discards regressions, loops. You wake up to a better bot.

## The Metric

**`success_rate = success / processed`** on a fixed sample. Higher = better.
Baseline (production Playwright engine, real run): **24 / 511 ≈ 4.7%**.

Secondary metrics (diagnose *why* a run is low):
- `no_form_rate` = `"no form fields found"` / processed  ← bot-blocked/blank pages
- `timeout_rate` = `timeout` / processed                 ← slow / bot-check loops
- `captcha_rate` = `captcha_skipped` / processed

## Fixed Experiment Protocol

- **Sample:** same 100 feasible URLs every run. `--limit 100` after
  `sort_by_priority` makes the slice deterministic. Never change the sample
  mid-study or the numbers stop comparing.
- **Budget:** one pass, `--dry-run` (fill + detect form, do NOT submit — keeps
  the study side-effect-free and repeatable; submitting changes site state).
- **One variable per experiment.** Change one thing, re-run, compare.

```bash
# A — baseline Playwright engine
python auto-signup-parallel-FIXED.py --dry-run --limit 100 \
    --config config_tyjuan01.json --results A_playwright.csv --progress A.json

# B — camofox engine, same sample
python auto_signup_camofox_parallel.py --dry-run --limit 100 \
    --config config_tyjuan01.json --results B_camofox.csv --progress B.json
```

Score each with the one-liner in `score.py` (below). Keep the engine/config
that wins on `success_rate`; if tied, prefer lower `no_form_rate`.

## Hypotheses Queue (ranked by expected payoff)

Worked top-down. Each line is one experiment.

1. **Engine swap → camofox.** H: most failures are pre-form bot blocks, which
   Camoufox's C++ fingerprint spoofing defeats. Expect `no_form_rate` to drop
   hardest. ← primary fix, already built.
2. **Residential proxy on camofox** (`PROXY_HOST/PORT/USER/PASS`). H: geo/IP
   fencing causes a chunk of `failed`/`timeout`. Expect timeout_rate down on
   airline/luxury/pharmacy sites.
3. **Per-brand session warmth** — run the sample twice; the 2nd run reuses
   persisted profiles. H: success_rate rises run-2 as first-visit bot checks
   are already cleared.
4. **`--delay` sweep** {0.5, 1.5, 3, 5}s. H: bursty traffic from one
   IP/profile is itself a signal; find the knee.
5. **MAX_NAV_HOPS sweep** {1,2,3}. H: more hops reach more modal-gated forms
   but cost time; find where success_rate stops climbing.
6. **VNC first-pass on captcha_skipped brands.** Solve once, persist, re-run.

## score.py (drop next to the results CSVs)

```python
import csv, sys
from collections import Counter
c = Counter()
for row in csv.DictReader(open(sys.argv[1], encoding="utf-8")):
    c[row["status"].strip()] += 1
tot = sum(c.values()) or 1
succ = c["success"] + c.get("dry_run", 0)
print(f"{sys.argv[1]}: n={tot}  success_rate={succ/tot:.1%}  "
      f"no_form={c['failed']/tot:.1%}  timeout={c['timeout']/tot:.1%}  "
      f"captcha={c['captcha_skipped']/tot:.1%}")
print(dict(c))
```

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
