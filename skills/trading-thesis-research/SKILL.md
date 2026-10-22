---
name: trading-thesis-research
description: Use when the user wants a structured investment/trading thesis for an asset — combining sentiment, technical/quant analysis, and risk assessment into a single critiqued report. This skill is RESEARCH AND ANALYSIS ONLY: it never places orders or connects to a brokerage/exchange.
---

# Trading Thesis Research (multi-agent critique pipeline)

## Overview

Adapted from [The-Swarm-Corporation/AutoHedge](https://github.com/The-Swarm-Corporation/AutoHedge), which runs a Director → Quant → Risk → Execution agent pipeline to autonomously trade. **This skill deliberately drops the Execution stage and live trading entirely** — it keeps only the parts useful for a human decision-maker: thesis generation, quantitative scoring, and adversarial risk review. The "10x" here is making the Risk stage an actual critique of the Director's thesis (in AutoHedge they run somewhat independently), turning three agents into a debate rather than a pipeline.

## When to Use

- "Give me a thesis on [ticker/asset] with the bull case, the data, and what could go wrong"
- "Quant-check this trade idea before I consider it"
- NOT for: placing orders, connecting to exchange/broker APIs, or anything implying autonomous execution. If the user asks for live trading automation, stop and discuss the risks explicitly — this skill does not cover that.

## Core Pattern

Three roles, run as a **debate**, not a one-way pipeline:

1. **Director** — drafts the thesis: direction (long/short/neutral), reasoning, time horizon, key catalysts.
2. **Quant** — scores it independently using available market data (price action, volume, volatility, support/resistance) — produces `technical_score`, `volatility`, `key_levels`, etc., WITHOUT seeing the Director's conclusion first (avoid anchoring).
3. **Risk (critic)** — given BOTH the thesis and the quant scores, actively argues against the thesis: what data contradicts it, what's the realistic max drawdown, what catalysts could invalidate it, position-size recommendation if a human chose to act.

Final output merges all three, with the Risk critique given equal weight, not appended as an afterthought.

## Quick Reference

| Agent | Input | Output | AutoHedge equivalent |
|---|---|---|---|
| Director | asset + context | thesis, direction, horizon, catalysts | `director_agent` |
| Quant | asset + market data (independent of thesis) | technical/volatility/probability scores, key levels | `quant_agent` |
| Risk critic | thesis + quant scores | counter-arguments, drawdown estimate, invalidation triggers, position-size note | `risk_agent` (re-scoped as critic) |

## Implementation

```
1. Director: research asset (news, fundamentals, catalysts) -> draft thesis
2. Quant (parallel, no access to Director's conclusion): pull price/volume/volatility data
   -> compute technical_score, trend_strength, key support/resistance
3. Risk critic: given thesis + quant output, answer explicitly:
   - What evidence contradicts this thesis?
   - What's the realistic worst-case move against this position?
   - What would have to happen for this thesis to be wrong?
   - If a human acted on this, what position size limits exposure appropriately?
4. Report: thesis + quant data + risk critique, presented as inputs to a human decision —
   never as a recommendation to execute automatically.
```

## Common Mistakes

- **Letting Quant see the Director's conclusion first** — anchoring bias produces scores that just confirm the thesis.
- **Treating the Risk agent as a formality** — AutoHedge's pipeline runs it for position-sizing math, not genuine critique; the value here IS the critique.
- **Drifting toward execution** — if a session escalates from "give me a thesis" to "now place the trade", that's a scope change requiring explicit, separate user authorization and is out of scope for this skill.
- **Presenting output as financial advice** — frame as research/analysis; real capital decisions are the user's.
