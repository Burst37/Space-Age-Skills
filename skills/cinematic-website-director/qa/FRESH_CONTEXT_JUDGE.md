# Fresh-Context Judge Packet

**Purpose:** the one evaluation this package cannot run on itself. The benchmark run in
`BENCHMARK_RUN_2026-08-24.md` was executed by the model that authored the skill, so it
proves divergence and executability but says nothing credible about **quality**.

Run this in a *different* model — Codex, Gemini, DeepSeek, GLM, Grok, a fresh Claude
session with no memory of this work. Paste the packet, attach the files it names, and
record the verdict in `AUDIT_LOG.md`.

## Rules for the operator (you)

1. **Do not paste the skill's rationale.** No `AUDIT_LOG.md`, no `BENCHMARK_RUN`, no PR
   description, no "here's why we did it this way." The judge scores the artifact, not the
   defence of it.
2. **Do not say the work is yours** or that a previous model rated it well. Anchoring
   destroys the entire point.
3. Run judges **separately** — one model per conversation. Three judges in one thread is
   one judge with three voices.
4. Record every score, including the bad ones. A benchmark run that finds nothing was not
   run adversarially.

---

## PACKET A — Judge the skill package

> Attach: `SKILL.md`, all of `modules/`, all of `references/`.

```
You are a senior design engineer evaluating a website-production skill written for AI
coding agents. You did not write it and have no stake in it.

Score these categories 0-10 using this anchored scale ONLY:
  10 = best-in-class; a specialist would learn from it
   9 = ships as-is; a specialist would sign it
   8 = ships after named minor fixes
   7 = competent but unremarkable
   6 = works, with a weakness a competitor beats
   5 = generic, indistinguishable from a template
   3 = actively harms the goal
   1 = broken

Categories: architecture · UI/UX intelligence · typography intelligence · motion
intelligence · frontend executability · portability across models · context efficiency ·
economics fit · failure handling · QA rigor · anti-generic protection.

Every score MUST cite a specific line, table, or value. A score without evidence is
invalid — write "INVALID" instead of guessing. Use no decimals finer than 0.5.

Then answer, in one paragraph each and without hedging:
  1. Could a competent frontend engineer follow this and produce a distinctive, shippable
     site? Where exactly would they get stuck?
  2. What is the single biggest weakness? Name the file and line.
  3. What does this package tell an agent to do that is actually WRONG?
  4. Is there anything here that is padding — present to look thorough rather than to
     change an outcome?

Be harsh. A 9 should be hard to earn.
```

---

## PACKET B — Judge the produced build

> Attach: `benchmark-artifacts/01-hvac/index.html`. Say only that it is a local HVAC
> company's emergency-repair page. Nothing else.

```
You are a design director reviewing a single-page website for a local HVAC company whose
primary business is emergency furnace and AC repair.

Score 0-10 on the anchored scale below, citing specific evidence from the markup or CSS:
  10 best-in-class · 9 ships as-is · 8 minor fixes · 7 competent but unremarkable
   6 real weakness · 5 generic/template · 3 harms the goal · 1 broken

Categories: creative direction · UI/UX · typography · responsive strategy · conversion ·
accessibility · code quality.

Then answer:
  1. Cover the company name. Could this be any HVAC company's site, or does it have a
     point of view?
  2. Would a homeowner with no heat at 11pm succeed on this page on a phone? Walk the path.
  3. What would you cut? What is missing?
  4. Does the typography do real work, or is it just legible?
  5. Name one thing that is genuinely well-judged and one that is lazy.

Do not be generous. "Fine" is a 7, not a 9.
```

---

## PACKET C — Divergence spot-check

> Give the judge briefs 1, 5 and 7 from `BENCHMARK_SUITE.md` **only** — not the run table.

```
Here are three website briefs. For each, state in under 120 words: the hero archetype you
would choose, a display/body type pairing with real families, a palette direction, a
motion score 0-4, and the single primary conversion action.

Brief 1: Local HVAC company, emergency furnace and AC repair, small budget, mobile-heavy
         audience, needs phone calls.
Brief 2: Law firm serving high-net-worth private clients, estate and tax. Authority and
         discretion matter more than novelty.
Brief 3: AI SaaS platform for data pipelines, technical buyers, competing in a crowded
         market where every competitor site looks the same.

Then: how similar are your three answers to each other, honestly? If two of them share a
hero archetype or type class, say so and say why that is or is not defensible.
```

**How to read Packet C:** compare the judge's three answers to rows 1, 5 and 7 of the run
table. You are not looking for agreement — a different model reaching different-but-
defensible directions is a *pass*. You are looking for whether the **briefs themselves**
force divergence, or whether any competent model collapses them toward one house style.
If the judge's three answers look like each other, the divergence in this package's run
came from author effort, not from the skill's mechanisms — and the skill needs stronger
forcing functions, not better prose.

---

## Recording the result

Append to `AUDIT_LOG.md`:

```
## <date> — fresh-context judge run
Model: <name/version>       Packet: A | B | C
Scores: <category: score, ...>
Below threshold: <categories under the SKILL_GAUNTLET minimum>
Key criticism: <the one thing worth acting on>
Action: fixed | disputed (why) | accepted as trade-off
```

A judge finding nothing is a signal the packet was too gentle or the rules above were
broken — not a signal the package is finished.
