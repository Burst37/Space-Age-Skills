---
name: autonomous-trading-agent
description: Architect, build, and promote a 24/7 autonomous crypto trading agent with a slow frontier-model Brain, a fast System One Reflex (TypeSafe's Jev), and a deterministic Spine that owns every number, limit, and order. Use when the user wants an agent that trades on its own, a live decision loop, a kill switch or risk layer, a Jev decision schema for trading, or a self-improving strategy loop. Enforces a promotion ladder (backtest → walk-forward → paper → shadow → canary → scaled) so nothing touches real capital until it has earned it.
metadata:
  origin: Authored for Space Age AI Solutions as a hardened rebuild of a circulating "Opus + Jev + AgenKit 24/7 trading agent" prompt. Keeps its two-layer idea, fixes its timeframe mismatch, in-loop LLM escalation, uncalibrated Kelly sizing, and unvalidated nightly self-rewrite, and drops the vendor plug.
  license: MIT
---

# Autonomous Trading Agent

**The one-line rule:** the model judges, the code decides, and capital is earned
stage by stage. Anything that can lose money lives in deterministic code that a model
cannot override.

The paste-ready build prompt is in [`PROMPT.md`](./PROMPT.md). This file is the
doctrine the prompt enforces. Read §0 and §9 even if you read nothing else.

---

## 0. Hard Stops — Check Before Writing Any Code

Refuse to proceed to live capital (paper is fine) until each is true:

- [ ] **One strategy archetype per book** (§1). No mixing fundamentals and microstructure in one loop.
- [ ] **Exchange API keys are trade-only.** Withdrawals disabled, IP allow-listed, separate sub-account per book.
- [ ] **Keys live in a secret store**, never in the repo, prompt, chat, or session memory notes.
- [ ] **Operator has set the max loss they can absorb** in currency, not percent. That number caps everything below.
- [ ] **Jurisdiction checked.** Derivatives and leverage are restricted in many places. The operator owns this; the agent asks, not assumes.
- [ ] **No external harness installed into the build environment without a review.** A coding harness sees your shell and your keys. Vet the source (repo, maintainers, what it executes) first. Claude Code's own plan → tests → review loop is sufficient.

---

## 1. Pick One Archetype Per Book

The source prompt researched 5–10 altcoins on tokenomics and then traded them off the
live order book every candle. That is two strategies with incompatible horizons fighting
in one loop. Choose one per book; run several books if you want several.

| Archetype | Horizon | Edge source | Reflex cadence | What Jev judges |
|---|---|---|---|---|
| **A. Thesis swing** | days–weeks | fundamentals, catalysts, flows | 4h / 1d close | regime, thesis-still-valid, catalyst-status |
| **B. Regime trend** | hours–days | trend + vol regime on majors | 1h / 4h close | regime, direction, setup quality |
| **C. Mean reversion** | minutes–hours | overextension vs. liquidity | 5m / 15m close | regime, exhaustion, toxic flow |
| **D. Microstructure** | seconds–minutes | order-book imbalance, spread | sub-minute | **Don't use an LLM here.** Latency, fees, and HFT competition kill it. Use code or a trained model. |

**Default recommendation: B on BTC/ETH perps or spot.** Deepest liquidity, lowest
slippage, most data, least manipulation. Start there; add A as a second book later.

---

## 2. Architecture — Three Layers, Never Blurred

```
            ┌───────────────────────── OFFLINE (minutes–hours) ─────────────────────────┐
            │  BRAIN  (Opus)  research · strategy spec · code · nightly review · proposals │
            └──────────────┬───────────────────────────────────────────────▲──────────────┘
                   ships schema/params                                     │ logs, fills, alerts
                   via PR + human gate                                     │
┌───────────────────────────▼──────────────── LIVE LOOP (per bar) ─────────┴──────────────┐
│  STATE ENGINE ──► REFLEX (Jev) ──► POLICY ──► RISK GATE ──► EXECUTOR ──► RECONCILER      │
│   code, causal      labels +       code:        code:         code:        code: fills vs │
│   snapshot          probabilities  thresholds,  limits, kill  idempotent   intent, PnL,   │
│                                    sizing       switch        orders       drawdown       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                         WATCHDOG (separate process): heartbeat, staleness, flatten-on-silence
```

| Layer | Owner | Latency budget | May it block the loop? |
|---|---|---|---|
| Brain | Opus | unbounded | **Never in the live loop.** It proposes; it does not trade. |
| Reflex | Jev via our `judge()` wrapper | < 1s with timeout | No — timeout ⇒ fallback (§4.4) |
| Spine (state, policy, risk, executor, reconciler) | Deterministic code | ms | It *is* the loop |
| Watchdog | Separate process/host | heartbeat interval | Can flatten independently |

**The fix to the original "escalate to Opus mid-trade" rule:** when the Reflex is unsure
or the regime flips to crisis, the Spine **de-risks immediately in code** (no new entries,
tighten or flatten per policy), then files an async review ticket for the Brain. You never
hold open risk while waiting on a slow model.

---

## 3. State Engine — The Only Thing the Reflex Sees

A compact, strictly causal numeric snapshot per bar. Jev is documented as bad at
arithmetic, counting, number formats, and date comparison — so **every number is
computed in code and bucketed into words before Jev sees it.**

```yaml
# snapshot @ bar close — all fields computed from data with ts <= bar_close
asof: 2026-09-27T12:00:00Z        # for logs only; not sent to Jev
symbol: BTC-PERP
trend_1h: up_strong               # buckets from EMA slope z-score
trend_4h: up_weak
trend_1d: flat
realized_vol_24h: high            # percentile vs 90d: low/normal/high/extreme
vol_change: expanding
funding: positive_elevated        # bucketed; raw value stays in code
open_interest_change_24h: rising
spread: normal
book_imbalance: bid_heavy
liquidation_cluster_nearby: above
btc_dominance_trend: rising
stablecoin_supply_trend: rising
position: long_small              # none / long_small / long_full / short_*
unrealized_pnl: small_gain
drawdown_from_peak: moderate      # vs. book limit, bucketed
```

Rules:
- **Causality test is mandatory:** for every field, a unit test that recomputes it with data after `bar_close` removed and asserts equality. This is the single most common way backtests lie.
- **No raw text in live state.** News headlines, tweets, and forum posts are attacker-controlled and can steer Jev (prompt injection, jev-routing §4 #8). Text is summarized offline by the Brain into a bucketed `narrative_state` field, reviewed, and frozen for the day.
- Keep it under ~400 tokens. Irrelevant state measurably degrades Jev.
- Same code path builds the snapshot in backtest, paper, and live. One function, three data sources.

---

## 4. Reflex — The Jev Decision Schema

One request per bar; independent questions in parallel over the same state.

| Field | Primitive | Options / scale | Used for |
|---|---|---|---|
| `regime` | Choice | trending · mean_reverting · high_vol_chop · crisis | policy branch |
| `direction` | Choice | long · short · neutral | entry side |
| `setup_quality` | Score | 0 none · 1 weak · 2 clean · 3 textbook | entry gate |
| `toxic_flow` | Noul | P(adverse informed flow / squeeze risk) | entry veto |
| `thesis_valid` (archetype A only) | Noul | P(original thesis still holds) | exit trigger |

Write each question literally (Jev reads literally) and give level descriptions for
every Score. Version the schema file; every log line records the schema version.

### 4.1 Policy (code)

```
ENTER only if all:
  regime != crisis
  setup_quality.expected >= 2.0
  direction.top in {long, short} and direction.p_top >= ENTRY_CONF   # start 0.80
  toxic_flow.p < 0.30
  risk_gate.allows(new_order)
EXIT / REDUCE if any:
  regime == crisis with p >= 0.50         → flatten
  direction flips against position with p >= 0.70 → exit
  thesis_valid.p < 0.40 (archetype A)      → exit
  any stop, time stop, or risk-gate breach → per §5
```

### 4.2 Calibration before trust

Jev's `Choice` and `Score` run **overconfident out of distribution**. A raw 0.80 is not an
80% hit rate. So:
1. Log every judgment with its eventual outcome (did price move in `direction` by ≥ X within the holding window).
2. After ≥ 300 scored decisions, fit an isotonic calibrator mapping raw p → observed frequency. Track Brier score and a reliability diagram per regime.
3. Policy thresholds apply to **calibrated** p. Until the calibrator exists, thresholds apply to raw p *and* sizing stays fixed (§6).

### 4.3 Uncertainty = de-risk, not escalate-and-wait

If `direction.p_top < 0.60` or `regime` distribution is flat (entropy above threshold):
no new entries, existing positions keep their stops, and a review ticket is queued for
the Brain. Nothing waits on it.

### 4.4 Availability

`judge()` has a hard timeout (e.g. 1500 ms) and a circuit breaker. Jev slow, down, or
rate-limited ⇒ treat as `regime=unknown`: **no new entries, manage existing positions by
code-only stops.** Never fail open. Jev launched in Sept 2026 with vendor-stated
dynamic rate limits — assume outages.

Always call Jev through our own `judge()` wrapper so the implementation is a one-file
swap (a trained classifier, another System One model, or a rules baseline).

---

## 5. Risk Gate — Deterministic, Checked Before Every Order

Order of checks, first failure wins, all in code, all unit-tested:

1. **Kill switch armed?** (file flag + env + remote toggle; any one set ⇒ halt and flatten)
2. **Data fresh?** Last tick/bar age < 2× cadence, clock skew < 1s, no gaps in snapshot.
3. **Watchdog heartbeat OK?**
4. **Book drawdown** from high-water mark < `MAX_DD` (default 10%; hitting it flattens and halts until a human resets)
5. **Daily loss** < `MAX_DAILY_LOSS` (default 2% of book; halts new entries until next UTC day)
6. **Per-trade risk** (entry-to-stop distance × size) ≤ `RISK_PER_TRADE` (default 0.5% of book)
7. **Position and gross exposure caps**, leverage cap (default 2×), per-symbol cap
8. **Order sanity:** price within X bps of mid, size within min/max lot, no duplicate client IDs, rate limit budget
9. **Consecutive-loss breaker:** N losses in a row (default 5) ⇒ pause entries 24h and file a review

Also:
- **Stops live on the exchange**, not only in the bot. If the process dies, the stop still fires.
- **Reconciler** compares intended vs. actual positions every cycle; any mismatch ⇒ halt new entries and alert.
- **Watchdog** runs in a separate process (ideally separate host). No heartbeat for 3 cycles ⇒ cancel open orders and flatten via its own key.
- Limits are **config the model can't write.** The Brain may *propose* a limit change in a PR; only a human merges it.

The original prompt's 15% max drawdown is too loose for an unproven system. Start at 10%
book drawdown on a book that is itself a small slice of capital (§7).

---

## 6. Sizing

| Stage | Method |
|---|---|
| Before calibration (< 300 scored decisions) | Fixed fractional: risk `RISK_PER_TRADE` per trade from stop distance. No Kelly. |
| After calibration | Fractional Kelly on **calibrated** p and **measured** payoff ratio, shrunk toward zero by estimate uncertainty, capped at 0.25× Kelly **and** at the per-trade risk cap. The smaller wins. |

`f* = p − (1 − p) / b`. If `f* ≤ 0`, no trade — the policy gate passing doesn't override a
negative edge estimate. Recompute `b` (avg win / avg loss) from live-and-paper fills net of
fees, not from backtest.

---

## 7. Promotion Ladder — Capital Is Earned

No stage is skipped. Each gate is a PR with the evidence attached and a human approval.

| Stage | Duration / size | Promote when | Kill when |
|---|---|---|---|
| **1. Backtest** | ≥ 2 years, incl. a crash regime (e.g. 2022) | Positive expectancy **after** fees + slippage + funding; > 100 trades; passes `quant-backtest-diagnostician` plausibility gate | Sharpe > 3 or no losing month (treat as a bug until proven otherwise) |
| **2. Walk-forward** | rolling train/test, parameters frozen per fold | Out-of-sample Sharpe ≥ 50% of in-sample; deflated Sharpe > 0 given number of variants tried | OOS edge disappears |
| **3. Paper** | ≥ 30 days and ≥ 200 Jev decisions, live data | Paper PnL within backtest's expected band; Brier improving; zero risk-gate bugs | Any unexplained position mismatch |
| **4. Shadow** | ≥ 14 days, real exchange, orders computed but not sent (or min-size) | Slippage vs. model within tolerance | Latency or fill assumptions wrong |
| **5. Canary live** | ≤ 2% of trading capital, ≥ 30 days | Live metrics inside paper band; no limit breaches | Book DD limit hit ⇒ back to stage 3 |
| **6. Scaled** | step up ≤ 2× per month | Continues to hold | Any regression ⇒ step down one stage |

Log the **number of strategy variants tried** from day one. It's the input to deflated
Sharpe and the honest answer to "is this edge or data-mining?"

---

## 8. Brain — Research, Build, Nightly Review

### 8.1 Research protocol (archetype A/B)

Market regime first, then candidates. For each candidate: supply and unlock schedule,
revenue and fees, TVL, active users, holder concentration, and whether value accrues to
the token. Hand the thesis work to `trading-thesis-research` (Director → Quant → Risk
debate). Requirements:
- Cite primary sources with dates. Label every estimate and every speculation.
- Separate confirmed catalysts from rumored ones.
- Write the bear case before the bull case.
- State the observable that invalidates each thesis — it becomes `thesis_valid`'s level description.
- Use `market-data-terminal` / TradingView MCP for data where configured; never invent a metric.

### 8.2 Nightly review — Champion / Challenger, not self-rewrite

The source prompt rewrote the schema each night and shipped it before "the next open."
Crypto has no open, and nightly rewrite-and-ship is curve-fitting on one day of noise.

1. Brain reads the day's decisions, fills, misses, and calibration drift. Produces a **report**, not a deploy.
2. At most **one change** per cycle (a question's wording, a level description, a threshold) becomes a **challenger**.
3. Challenger is replayed on held-out history **and** run in paper alongside the champion for ≥ 7 days.
4. Promote only if it beats the champion on Brier and net expectancy with the difference outside noise. Human merges the PR.
5. Risk limits are never in scope for automated change.

---

## 9. Build Plan — Six Phases, Human Gate Each

| Phase | Output | Gate evidence |
|---|---|---|
| 1. Spec | `docs/spec.md`: archetype, universe, cadence, limits, promotion criteria | Operator signs off |
| 2. Architecture | module boundaries, data flow, failure modes table | Every failure mode has a code-level response |
| 3. Plan | ordered task list with tests named first | Tests exist before code |
| 4. Build (test-first) | code below | `pytest` green; causality + risk-gate tests 100% |
| 5. Review | adversarial review (`code-review`, security review of key handling) | No open blocking findings |
| 6. Ship to paper | deployed with watchdog + alerts | 24h paper run with no errors |

### Repo layout

```
trading-agent/
├── config/
│   ├── book.yaml              # archetype, universe, cadence
│   └── limits.yaml            # risk limits — CODEOWNERS: human only
├── schema/
│   └── jev_v001.yaml          # questions, options, level descriptions
├── src/
│   ├── data/feeds.py          # exchange WS/REST, bar builder, gap detection
│   ├── state/engine.py        # causal snapshot + bucketing
│   ├── reflex/judge.py        # judge() wrapper: timeout, breaker, logging, swap point
│   ├── policy/policy.py       # thresholds → intent
│   ├── risk/gate.py           # §5 checks, pure functions
│   ├── risk/killswitch.py
│   ├── exec/executor.py       # idempotent orders, exchange-side stops
│   ├── exec/reconciler.py
│   ├── sizing/sizing.py       # fixed fractional → fractional Kelly
│   ├── calibration/fit.py     # isotonic, Brier, reliability
│   └── loop.py                # one bar = one pass, same code for backtest/paper/live
├── watchdog/watchdog.py       # separate process, own key
├── backtest/                  # event-driven, fees/slippage/funding modeled
├── review/nightly.py          # Brain report + challenger proposal
├── tests/                     # causality, risk gate, sizing, reconciler, replay
└── logs/decisions.parquet     # every judgment, intent, order, fill, outcome
```

Python 3.12, `ccxt` (or the exchange's official SDK) for execution, `pandas`/`polars` for
data, `pytest`. Keep it boring.

---

## 10. Monitoring and Alerts

Alert (push + email) on: kill switch fired, DD or daily-loss limit hit, reconciler
mismatch, data staleness, Jev breaker open > 10 min, consecutive-loss breaker, watchdog
flatten, calibration Brier worsening 3 days running. Daily digest: PnL net of fees,
exposure, decisions taken vs. vetoed and why, calibration chart.

---

## 11. Anti-Patterns → Fixes

| From the source prompt | Why it fails | Do instead |
|---|---|---|
| Fundamentals research feeding a per-candle order-book loop | Horizons don't match | One archetype per book (§1) |
| Escalate to Opus when confidence < 0.60 | Holding risk while a slow model thinks | De-risk in code, review async (§4.3) |
| Kelly from Jev's probability | Uncalibrated, overconfident OOD | Fixed fractional until calibrated (§6) |
| Nightly schema rewrite, ship before open | Overfits; crypto has no open | Champion/challenger + holdout (§8.2) |
| "Every block" / "every candle" used interchangeably | Undefined cadence | Cadence fixed per archetype |
| 15% max drawdown on day one | Too loose for unproven system | 10% on a canary-sized book (§5, §7) |
| No backtest or paper phase | Live is the first test | Promotion ladder (§7) |
| No exchange, key scope, or custody spec | Keys can withdraw funds | Trade-only keys, sub-accounts (§0) |
| Install an unvetted harness to build it | Harness sees keys and shell | Vet first, or use Claude Code's own loop |
| "81 ms" vendor latency as a design input | Marketing number | Measure p50/p99 yourself; design for timeouts |

---

## 12. What Could I Be Wrong About?

End every build, review, and promotion PR with this section. Minimum questions:

- Is the edge organic, or incentive-driven (emissions, points, airdrop farming) and about to end?
- Is the catalyst already priced in? What would the chart look like if it were?
- Does value actually accrue to the token, or only to the protocol/equity?
- Does expectancy survive fees, slippage, funding, and a 2× worse fill model?
- How many variants were tried before this one? Does deflated Sharpe still hold?
- Which regime has this never seen? What happens to it in a 30% daily crash with exchange outages?
- Is any hard limit being enforced by a model instead of code?
- If Jev disappeared tomorrow, does the book stay safe?

**Prefer the system that survives over the one that looks profitable.**

---

## Hand-offs

| Need | Skill |
|---|---|
| Thesis research with adversarial critique | `trading-thesis-research` |
| Backtest broken or too good to be true | `quant-backtest-diagnostician` |
| Jev integration rules, failure modes, escalation contract | `jev-routing` |
| Market / macro data pulls | `market-data-terminal`, `codex-skills/TradingView-MCP` |
| Code discipline | `karpathy-guidelines` |

Not financial advice. The operator owns every capital, legal, and tax decision; this
skill's job is to make sure the machine never makes one of those decisions for them.
