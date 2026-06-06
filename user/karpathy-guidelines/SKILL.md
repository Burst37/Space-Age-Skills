---
name: karpathy-guidelines
version: 1.0
updated: 2026-05-15
description: >
  Behavioral enforcement layer for all AI-assisted coding across Space Age AI Solutions.
  Derived from Andrej Karpathy's documented observations on LLM coding failure modes.
  Load this skill whenever writing, reviewing, refactoring, debugging, or extending ANY
  code — pipelines, lead gen scraper, voice agent, Shopify themes, cinematic HTML sites,
  dashboards, Claude Code automation, or Hermes Agent tasks. Enforces four non-negotiable
  principles: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven
  Execution. Eliminates silent assumptions, overengineered abstractions, drive-by
  refactoring, and vague unverifiable task definitions. Apply on every coding session
  without exception.
license: MIT
source: https://github.com/multica-ai/andrej-karpathy-skills
---

# Karpathy Guidelines — Space Age AI Solutions
**Source:** Andrej Karpathy's coding observations via `multica-ai/andrej-karpathy-skills`
**License:** MIT
**Applies To:** All coding work across every Space Age stack

> **Tradeoff:** These guidelines bias toward caution over speed. For trivial one-liners and obvious typo fixes, use judgment. For everything non-trivial — apply all four principles without exception.

---

## QUICK DECISION TREE

Use this before starting any coding task to identify which principle(s) to front-load.

```
Am I starting something new, or editing something that exists?
│
├── NEW code
│   ├── Do I know exactly what the output looks like? → No → THINK BEFORE CODING first
│   ├── Am I adding more than what was asked?         → Yes → SIMPLICITY FIRST check
│   └── Did I define a verifiable success criterion?  → No → GOAL-DRIVEN EXECUTION first
│
└── EDITING existing code
    ├── Will I touch lines not in scope of the request? → Yes → SURGICAL CHANGES violation
    ├── Do I understand the current behavior?           → No → THINK BEFORE CODING first
    └── Am I "cleaning up" while I'm in there?         → Yes → SURGICAL CHANGES violation
```

**Shorthand:** New code → Think + Goal. Editing code → Surgical first, then Think.

---

## THE FOUR PRINCIPLES

### 1. THINK BEFORE CODING
**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before writing a single line:
- **State assumptions explicitly.** If uncertain about scope, format, fields, or intent — ask, don't guess.
- **Present multiple interpretations** when ambiguity exists. Never pick silently and run.
- **Push back when a simpler approach exists.** Say so before implementing the complex one.
- **Stop when confused.** Name exactly what's unclear. Ask. Do not produce hallucinated code to fill the gap.

**Space Age Context:** When building lead gen pipeline steps, voice agent logic, or cinematic site modules — never assume which API endpoint, which file format, which variable name, or which deployment target without confirmation. One wrong assumption in the scraper = corrupted CSV = dead pipeline run.

---

### 2. SIMPLICITY FIRST
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50 — rewrite it.

**The test:** Would a senior engineer say this is overcomplicated? If yes, simplify.

**Space Age Context:** The lead gen pipeline runs on a DO VPS with a 5-agent swarm firing direct API calls. Every added abstraction layer = more surface area for failure, more tokens burned, more latency per lead. The Hermes Agent is controlled via Telegram — it needs simple, auditable logic, not factory patterns.

**Anti-patterns to eliminate in this stack:**
- Wrapping a single Playwright call in a class with 4 methods
- Building a config system for something that has one configuration
- Adding retry logic with exponential backoff to a step that runs once
- Creating a base class before any subclasses exist
- Parameterizing something that will only ever have one value

---

### 3. SURGICAL CHANGES
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code — mention it, don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless explicitly asked.

**The test:** Every changed line must trace directly to the user's request.

**Space Age Context:** The cinematic site HTML files are 2,000–4,000 lines. The lead gen scraper is a 4-file Node.js package with interdependencies. LoyaltyBot has a fragile Playwright session management layer. A single unsolicited "improvement" to an adjacent function in any of these files can silently break a production pipeline. Do not touch what wasn't asked about.

**Specific rule for this stack:** When editing a SKILL.md, a pipeline script, a Shopify Liquid section, or a cinematic HTML file — change only the section that addresses the request. Do not reformat the rest of the file. Do not update headers. Do not "clean up" whitespace.

---

### 4. GOAL-DRIVEN EXECUTION
**Define success criteria. Loop until verified.**

Transform imperative tasks into verifiable goals:

| Instead of... | Transform to... |
|--------------|-----------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |
| "Make it faster" | "Reduce p95 latency from 800ms to <200ms, verified by timing log" |
| "Wire up the pipeline" | "Scraper → CSV → verified by 3 rows with correct schema → brief generation → verified by `build_brief` keys present" |

For multi-step tasks, state a brief plan before executing:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

**Space Age Context:** The 5-agent swarm targets 25–80 sites/day. "Make it work" is not a success criterion. "Scraper returns 50 leads with quality_score ≥ 3, CSV exported, top 10 ranked by priority" is. Strong success criteria let the Hermes Agent loop independently on the VPS without requiring manual intervention.

---

## SPACE AGE STACK APPLICATION GUIDE

### Lead Gen Pipeline (`146.190.78.120`)
| Scenario | Principle Priority |
|----------|-----------|
| Adding a new scoring field to the scraper | Surgical Changes → don't touch existing fields |
| Building a new pipeline step | Goal-Driven → define what "done" looks like in the CSV/output |
| Debugging a failed agent run | Think Before Coding → reproduce the error state first |
| Optimizing API call batch size | Simplicity First → change one variable, measure, don't rebuild |

### Cinematic Site Builder
| Scenario | Principle Priority |
|----------|-----------|
| Adding a new GSAP module | Surgical Changes → inject only, don't reformat existing sections |
| Debugging a broken scroll animation | Think Before Coding → state which browser/device/viewport first |
| Adapting a demo site for a new lead | Simplicity First → clone and edit, don't abstract into a template system |

### Voice Agent (Vapi / Gemini Flash TTS)
| Scenario | Principle Priority |
|----------|-----------|
| Adding a new conversation branch | Think Before Coding → map the full decision tree before writing JSON |
| Fixing a broken webhook handler | Surgical Changes → only the broken handler, leave others alone |
| Improving detection accuracy | Goal-Driven → define pass/fail criteria before any changes |

### Shopify / LoyaltyBot
| Scenario | Principle Priority |
|----------|-----------|
| Adding a new loyalty program to LoyaltyBot | Surgical Changes → new entry in programs list only |
| Fixing a Playwright session timeout | Think Before Coding → reproduce the timeout condition first |
| New Shopify section | Simplicity First → single `.liquid` file, no new abstractions |

---

## ANTI-PATTERNS QUICK REFERENCE

| Anti-Pattern | Principle Violated | Space Age Example |
|-------------|-------------------|-------------------|
| Silently assuming API response shape | Think Before Coding | Assuming scraper CSV columns without checking schema |
| Building a plugin system for one plugin | Simplicity First | Abstracting Hermes commands before there are 2 command types |
| Reformatting a 2,000-line HTML file while fixing one module | Surgical Changes | Touching cinematic site scroll modules not in scope |
| "Make the pipeline better" without criteria | Goal-Driven | Vague optimization run with no measurable target |
| Adding TypeScript types to a JS file that didn't have them | Surgical Changes | Unprompted style drift in pipeline scripts |
| Writing 10 helper functions for a 3-step task | Simplicity First | Over-engineering a lead brief parser |
| Fixing a bug without first reproducing it | Goal-Driven | Patching voice agent logic without a failing test case |

---

## VERIFICATION LOOP PROTOCOL

For any non-trivial coding task on this stack, run this checklist before delivering:

```
PRE-CODE:
☐ Stated all assumptions explicitly
☐ Confirmed ambiguous requirements (don't guess)
☐ Identified simplest possible solution
☐ Defined success criteria

DURING CODE:
☐ Only touching lines that trace to the request
☐ Matching existing code style
☐ No speculative features added
☐ No abstractions without confirmed need

POST-CODE:
☐ Success criteria met and verifiable
☐ No orphaned imports/variables from my changes
☐ No unrelated changes in the diff
☐ If any unrelated issues noticed — mentioned, not "fixed"
```

---

## INSTALLATION

**Claude Code Plugin:**
```bash
/plugin marketplace add multica-ai/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

**Per-project CLAUDE.md (append):**
```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

**Cursor:** `.cursor/rules/karpathy-guidelines.mdc` is pre-committed in the repo — opens automatically when project is loaded in Cursor.

---

## HOW TO KNOW IT'S WORKING

These guidelines are working when you see:
- **Fewer unnecessary changes in diffs** — only requested lines changed
- **Clarifying questions before implementation** — not after mistakes
- **Clean minimal commits** — no drive-by refactoring, no "improvements"
- **First drafts that don't need rewrites** — because complexity was right-sized from the start
- **Pipeline runs that succeed first try** — because assumptions were surfaced, not buried

---

## REFERENCES

- Source repo: `https://github.com/multica-ai/andrej-karpathy-skills`
- Original Karpathy post: `https://x.com/karpathy/status/2015883857489522876`
- Full examples with before/after code: `EXAMPLES.md` in source repo
- Cursor integration: `CURSOR.md` in source repo
