---
name: quant-backtest-diagnostician
description: Use when a user reports a quant trading strategy backtest failed, errored, produced zero trades, or has suspicious results (no losses, instant convergence, unrealistic returns) — diagnoses the root cause via an error taxonomy and verifies the fix against fresh metrics, never just by re-running once.
---

# Quant Backtest Diagnostician

## Overview

Forked from [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading)'s `backtest-diagnose` skill, which provides a solid error taxonomy (runtime errors, logic bugs, data errors) but its "verify the fix" step is just "inspect the new metrics.csv" — it doesn't define what a *correct* result looks like vs. merely a *different* one. This version adds a "is this result actually plausible" gate, since a fixed bug can produce a new, differently-wrong result (e.g. zero trades → now overtrading every bar).

## When to Use

- "My backtest crashed / errored / produced no trades"
- "These backtest results look too good / too bad to be true"
- Re-running a backtest after a strategy code change
- NOT for live trading — diagnosis and fixes apply to the backtest code/config only

## Core Pattern

Original taxonomy unchanged (runtime errors / logic bugs / data errors / data-source ignore-list). Added: a **plausibility gate** run after every fix, before declaring done.

| Symptom | Likely cause | Fix area |
|---|---|---|
| `exit_code != 0` | ImportError/KeyError/IndexError/TypeError | deps, column names, length checks, return type |
| `trade_count == 0` | signal logic too strict | inspect signal series — is it ever non-zero? |
| First trade >2yr after start | lookback window / dropna too aggressive | shorten window, check data retention |
| Capital utilization <50% | sparse signals or sizing bug | check trigger frequency, sizing formula |
| Open position at end | missing forced liquidation | add end-of-backtest exit |
| "no data"/"rate limit"/"API limit" keywords | data-provider issue, NOT code | do not edit code — flag to user |

**Plausibility gate (new)** — after any fix, before reporting success, check the NEW `metrics.csv`/`trades.csv` against these red flags:
- Win rate ~100% or trade count suddenly 10x+ higher than before → likely overfitting to noise or signal inverted/always-true
- Sharpe ratio implausibly high (>5) for the asset class/timeframe → check for lookahead bias (using future data in signal calc)
- Max drawdown near 0% over a multi-year backtest → suspicious; check if positions are actually being held

## Quick Reference

1. `read_file` artifacts: `metrics.csv`, `equity.csv`, `trades.csv`
2. `read_file` `code/signal_engine.py`, `config.json`
3. Classify via taxonomy table above
4. Apply minimal fix via `edit_file`
5. Rerun backtest
6. **Plausibility gate** on new metrics — if a red flag fires, treat as a NEW bug, return to step 3
7. Only report done when metrics are both non-error AND plausible

## Common Mistakes

- **Declaring victory because `exit_code == 0` and `trades.csv` is non-empty** — a backtest can run cleanly and still be wrong (lookahead bias, signal inversion).
- **Editing code for data-provider errors** — "no data available", "rate limit", "API limit", "daily limit" mean fix the config/wait, not the strategy code.
- **Fixing zero-trades by loosening conditions arbitrarily** until trades appear, without checking the resulting trade frequency is realistic for the strategy's stated logic.
- **Not checking for lookahead bias after "fixing" a too-good Sharpe** — the most common silent failure in backtests.
