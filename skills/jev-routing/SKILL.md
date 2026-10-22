---
name: jev-routing
description: Route cheap, repetitive judgments to a System One model (TypeSafe's Jev) and reserve frontier models for reasoning, planning, and generation. Use when a pipeline or agent loop is burning Opus/GPT-class tokens on work that reduces to one label or one probability — relevance filtering, skill/subagent routing, tool-output gating, lead qualification, guardrails. Covers the four integration seams that actually exist inside closed harnesses (Claude Code, Codex, Cursor, Antigravity), the eleven documented failure modes that must never be routed to Jev, and the mandatory escalation contract. Read before wiring any System One call into a hot path.
metadata:
  origin: Authored for Space Age AI Solutions. Grounded in TypeSafe's live docs (docs.typesafe.ai, model jev-1.13.0) plus independent measurements from LangChain and Parallel.ai. Written 2026-09-21, six days after Jev's public launch — see the Maturity Gate section before shipping this to production.
  license: MIT
---

# Jev Routing

**The pattern:** frontier models are billed for reasoning you often aren't using. A
step that reduces to "pick one of N" or "does this hold, 0–1" does not need Opus. Move
those to a System One model; keep the frontier model for multi-step reasoning, planning,
synthesis, and code generation.

**The implementation in this skill is TypeSafe's Jev.** The pattern is older and
broader than the vendor — swap the implementation freely (a fine-tuned classifier is
frequently cheaper for high-volume stable judgments; see Maturity Gate). Do not let
this skill become a reason to reach for Jev when a `switch` statement would do.

---

## 1. The Decision Boundary

Route to **Jev** when *all* of these hold:

- The state is already gathered — no tool calls, no retrieval, no reasoning needed to obtain it.
- The answer is one of a bounded set, a probability, or a position on ordered levels.
- The judgment is semantic. Code can't do it with a regex or a lookup.
- An error is **detectable** — it will surface in a later step, or you gate it on confidence.

Keep on the **frontier model** when *any* of these hold:

- The step requires multiple dependent inferences, or building new state from an earlier answer.
- The output is text a human or downstream system reads.
- The step writes code, a plan, or a diff.
- An error is **silent** — nothing downstream will catch it.

Keep it in **code** when the rule is known: calculations, exact lookups, date
arithmetic, counting, thresholds, sorting. Jev is documented as unreliable at all of
these (§4). Code is free and exact — it beats both models.

### The primitives

| Need | Primitive | Returns |
|---|---|---|
| One of a defined set | `Choice` | Selected option + distribution over options |
| Whether a condition holds | `Noul` | Probability of yes (no separate confidence) |
| Degree along a described dimension | `Score` | Probability-weighted position on ordered levels |

One narrow judgment per question. Independent questions over the same state go in
**one request** — they run in parallel and cannot see each other's answers. A second
request is only warranted when an earlier answer determines what state to fetch next.

---

## 2. Where This Actually Plugs Into an Agentic Harness

**Read this before designing anything.** Claude Code, Codex, Cursor, and Antigravity
are closed loops. You **cannot** swap the model that decides "which file do I read
next," "is this search result relevant," or "should I escalate." Those decisions happen
inside the harness and are not exposed. Any design that assumes Jev transparently
intercepts the agent's internal reasoning is not buildable without forking the harness.

Four seams exist today:

| Seam | What it can do | Saves frontier tokens? |
|---|---|---|
| **MCP tool** | Agent *deliberately* calls Jev for a judgment | Only when Jev replaces a large tool result the model would otherwise reason over — the decision to call it already cost a round-trip |
| **PostToolUse hook** | Filter/compress a tool result before it enters context | **Yes — this is the highest-leverage seam.** No model participation required |
| **PreToolUse hook** | Gate a command or tool call (allow/deny/flag) | Indirectly — prevents bad calls and their error-recovery loops |
| **Skill / subagent routing** | Rank which skill or subagent to dispatch | Yes at large rosters — see below |

**Skill routing is the one agentic use with published numbers.** TypeSafe's
`skill_suggestion` cookbook, measured on a 182-skill roster: wrong loads 16.8% → 7.3%,
needless loads 9.8% → 4.0%. Two-stage — a wide `Choice` rank over truncated
descriptions with a 0.30 gate, then a rerank of the top 3 against full descriptions.
Oracle ceiling is 2.5%/1.2%, so roughly half the remaining error is the method's floor,
not tuning you can recover.

Two cautions on that result:
- It only pays at large rosters. Below ~30 skills the frontier model picks correctly on its own and you've added latency for nothing.
- **Inject the suggestion in a separate block after the roster, never inside it** — rewriting the roster invalidates prefix caching, and the cache you destroy costs more than the judgment you saved.

Measured integration cost from a community Claude Code router: **166–420ms added per
prompt**. That router defaults to off. Treat added latency as the real price; the token
saving is often the smaller number.

---

## 3. The Escalation Contract — Non-Negotiable

A System One answer is **never terminal**. Every call ships with all four:

1. **Confidence floor.** Below it, escalate to the frontier model. Set the floor per action, by consequence — a wrong skill load is cheap, a wrong `rm` gate is not.
2. **Escalation path.** The frontier model must be reachable on every judgment. If there's no path, you haven't saved cost, you've moved a failure.
3. **Timeout + bypass.** Jev unreachable or slow ⇒ fall through to the frontier model. Never block the loop on it, never fail closed on an availability blip.
4. **Logging.** Log every judgment, its confidence, and the eventual outcome. Without this you cannot measure the cheap layer's error rate, which means you cannot know whether it's helping.

### Why the floor matters more than the docs suggest

TypeSafe's `confidence.md` prescribes high/medium/low bands and says *"start with
conservative thresholds, test with your own data, and adjust as you observe results."*
It does **not** warn about out-of-distribution overconfidence. Independent testing
found `Choice` and `Score` run **overconfident out of distribution** (`Noul`
underconfident). That is the dangerous direction: an overconfident wrong `Choice` clears
your floor, skips escalation, and the frontier model never sees the mistake.

**In an agent loop, errors compound per step.** A 3% misjudgment rate over 20 steps is
not 3%. Set floors conservatively and raise them only against logged outcomes.

Also note: **no guaranteed structural relationship between primitives.** A `Noul` at
0.7 and a `Choice` distribution putting 0.7 on the same outcome are not the same
quantity. Never compare or combine them arithmetically.

---

## 4. Never Route These to Jev

Eleven failure modes from TypeSafe's own jaggedness page for `jev-1.13`. These are
vendor-documented, not speculation:

| # | Failure mode | Do this instead |
|---|---|---|
| 1 | **Literal reading** — answers the written question, not implied intent | State exact conditions; split ambiguous cases into literal sub-questions |
| 2 | **Math** — "not a calculator" | Arithmetic in code |
| 3 | **Counting** — unreliable, worse at scale | Iterate and count in code |
| 4 | **Numeric representations** — hex, RGB, binary | Convert in code; pass semantic buckets |
| 5 | **Date/time comparison** — reads dates as text, cannot order them | Extract with the model, compare in code |
| 6 | **Indirection** — double negatives, multi-hop | Write directly; name the state field |
| 7 | **Large irrelevant state** — accuracy falls as unrelated content grows | Pass only the fields the judgment needs |
| 8 | **Adversarial content** — injected instructions can steer the output | See below |
| 9 | **Contradictory instructions vs. criteria** | Align the language exactly |
| 10 | **Structural invariants** — none across primitives | Never compare Noul and Choice numerically |
| 11 | **Generation** — not trained to generate text | Use bounded extraction |

**#8 is a security boundary, not a quality note.** Jev treats input as neutral data,
and injected instructions can steer it. If you gate tool calls or filter tool output
with Jev, you have put a promptinjectable component on your permission path. Scraped
pages, PR comments, issue bodies, and CI logs are all attacker-influenced. **Never let
a Jev judgment alone authorize a destructive or irreversible action** — it advises, a
deterministic rule or a human decides.

Failure mode #7 also inverts the naive instinct: do not dump whole files or page
scrapes into `state` to save yourself a filtering step. Large irrelevant state degrades
the judgment you're paying for.

---

## 5. Cost and Limits

Verified against `docs.typesafe.ai/models` (2026-09-21):

- **Model:** `jev-1.13.0` (aliases `jev-latest`, `jev-preview`)
- **Pricing:** $0.042 per million input tokens. **Output free.**
- **Context:** 64K per request total; 32K for `state` plus the longest question
- **Rate limits:** 250,000 tokens/sec, 1,200 req/min
- **Input:** text only — string, JSON object, or array of text values

**The rate limits are explicitly unstable.** The docs state they are "adjusting
dynamically" under demand and "can change without notice." There is no pricing page, no
rate-limit page, and no SLA page in the documentation index — the numbers above live
only on the models page and may move.

**Do the comparison honestly.** The headline cost advantage is against *frontier*
models. It is not against the thing you'd otherwise use for a high-volume stable
judgment. Parallel.ai's independent testing found Jev **materially more expensive per
document than their own specialized classifiers**, underperforming on large-label-set
topic classification and on freshness/OOD. Their conclusion: specialized classifiers
will often still beat it on cost and speed.

**Jev's real edge is zero-shot breadth** — ad-hoc judgments you'd never justify
training a classifier for. If a judgment is high-volume and stable, train the classifier
and own it.

**Its best-measured edge is repeatability, not accuracy.** LangChain measured
per-case variance ~92× lower than Claude on the same eval set, at $0.34 vs $28.17
total. That makes it strong for **evaluation and scoring harnesses**, where
determinism is the product — arguably a better first deployment than your hot path.

One independent reranking study found nDCG gain over *no reranking at all*
statistically insignificant (+0.021, p=0.83). Measure against the null, not just
against the frontier model.

---

## 6. Maturity Gate — Read Before Production

Jev launched publicly **2026-09-16**. TypeSafe is seed-stage ($40M, DCVC). At the time
of writing:

- No published SLA, no rate-limit page, no pricing page in the docs
- Rate limits dynamically throttled, vendor-stated as capacity-constrained
- Public integrations exist but are days old, single-author, low-star — no longitudinal production data
- No independent multi-week reliability reporting

**Standing recommendation:** do not make a six-day-old closed model from a
capacity-constrained seed-stage vendor a hard dependency in a revenue path. A
rate-limit tightening on their side is an outage on yours.

**Ship it here first:**
1. Evaluation and scoring harnesses (repeatability is the measured win, and nothing breaks if it's down)
2. `PostToolUse` output filtering behind a bypass
3. Offline/batch enrichment where latency and availability don't matter

**Not yet:**
- Anything in a customer-facing synchronous path
- Anything authorizing an irreversible action (see §4 #8)
- Any step with no escalation route

Re-evaluate this section when independent multi-week production reports exist. Until
then every integration keeps its bypass, and the interface stays swappable — code
against your own `judge()` wrapper, never against the vendor SDK directly, so replacing
the implementation is a one-file change.

---

## 7. Space Age Pipeline Fit

Highest-value candidates in our stack, in order:

1. **Skill routing** — our roster is large enough for the cookbook's numbers to apply. Separate block after the roster; preserve prefix caching.
2. **`lead-to-brief` qualification** — "does this lead match the ICP" is a `Noul`; "which archetype" is a `Choice`. High volume, error detectable at the brief stage. Strong fit.
3. **`sa-deep-research-engine` source filtering** — relevance judgment over already-retrieved candidates. Classic rerank. Measure against no-rerank first (§5).
4. **`local-business-seo` category matching** — bounded set, stable. **Candidate for a trained classifier instead**, not Jev.
5. **Guardrails on generated copy** — `outreach-copywriter` and `ai-content-creator` output checks, as advisory flags feeding a human or frontier review. Never as the sole gate.

**Explicitly not:** cinematic prompt construction, site generation, brief synthesis,
any `credit-repair` document generation. Those are generation and multi-step reasoning —
frontier work by definition (§4 #11).

---

## 8. Checklist Before Merging Any Jev Call

- [ ] Judgment is semantic, bounded, and over already-gathered state
- [ ] Not on the §4 list; nothing arithmetic, temporal, or counting-based routed to the model
- [ ] `state` carries only fields the judgment needs (failure mode #7)
- [ ] Independent questions batched into one request
- [ ] Confidence floor set by consequence, not one global number
- [ ] Escalation path to frontier model wired and tested
- [ ] Timeout + bypass on Jev failure; loop never blocks
- [ ] Every judgment logged with confidence and eventual outcome
- [ ] No destructive/irreversible action authorized by a Jev answer alone
- [ ] Called through our own `judge()` wrapper, not the vendor SDK directly
- [ ] Measured against the null (no judgment) and against a `switch`, not just against the frontier model
- [ ] Latency delta measured — added ms, not just saved tokens
- [ ] API key server-side only

---

## Sources

- TypeSafe docs: `docs.typesafe.ai` — `models`, `confidence`, `model-jaggedness/jev-1.13`, `cookbooks/skill_suggestion`, `patterns/confidence-routing`
- LangChain, Jev agent evals in LangSmith — variance and cost measurements
- Parallel.ai, "Testing Jev" — independent reranking/classification benchmarks
- Community: `yibie/awesome-jev` (integration index), `typesafe-mod` (measured Claude Code router latency)

Vendor claims and independent measurements are distinguished inline. Where they
disagree, the independent number is the one quoted.
