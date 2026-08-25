# SPACE AGE GAUNTLET X V3 — MASTER HANDOFF

## PURPOSE OF THIS FILE

This file is the authoritative handoff for **Space Age Gauntlet X V3**.

Any coding LLM, agentic coding harness, or autonomous software agent receiving this file should treat it as the project brief, architectural contract, operating rules, and continuation guide.

The objective is to continue improving and extending the existing V3 codebase without losing its current architecture, safety boundaries, or core Gauntlet philosophy.

---

# 1. PROJECT IDENTITY

**Project:** Space Age Gauntlet X  
**Version:** V3  
**Type:** Intelligent Gauntlet compiler + local/self-hosted autonomous execution engine  
**Primary Use:** Generate and execute multi-round AI quality-control workflows against real software/code projects.

Core principle:

> **Builder ≠ Critic ≠ Judge**

The system must never rely on a builder to certify its own work.

The actual artifact must earn the score.

---

# 2. WHAT V3 ALREADY DOES

V3 is not merely a prompt generator.

It currently supports:

1. User enters a mission in a web UI.
2. System classifies the task.
3. System creates:
   - benchmark manifest
   - workstream decomposition
   - specialist critic bench
   - scoring rubric
   - model-routing suggestions
   - stop conditions
4. User exports a `gauntlet.project.json`.
5. Local/self-hosted runner loads the config.
6. Builder model receives the project workspace.
7. Builder returns full replacement files in structured JSON.
8. Runner writes only inside the configured workspace.
9. Human-defined shell checks execute.
10. For websites, Playwright may inspect a live URL.
11. Fresh critic model evaluates the real artifact/check evidence.
12. Independent judge decides whether the round actually passes.
13. PASS/regression ledger is updated.
14. Plateau detection monitors score stagnation.
15. If scores stall, strategy-change instructions are injected.
16. The loop continues until:
    - hard requirements pass,
    - quality gate is met,
    - no regressions remain,
    - judge approves shipping,
    - or max rounds is reached.
17. Every round is saved as evidence.

---

# 3. CURRENT EXECUTION FLOW

```text
USER MISSION
      ↓
TASK CLASSIFIER
      ↓
BENCHMARK MANIFEST
      ↓
WORKSTREAM COMPILER
      ↓
CRITIC BENCH
      ↓
QUALITY RUBRIC
      ↓
MODEL ROUTER
      ↓
RUNNER CONFIG
      ↓
────────────────────────────
BUILDER
      ↓
WRITE REAL PROJECT FILES
      ↓
RUN HUMAN-DEFINED CHECKS
      ↓
OPTIONAL PLAYWRIGHT INSPECTION
      ↓
FRESH CRITIC
      ↓
INDEPENDENT JUDGE
      ↓
REGRESSION LEDGER
      ↓
PLATEAU DETECTOR
      ↓
FIX LARGEST GAP
      ↓
REPEAT
────────────────────────────
      ↓
SHIP / STOP
```

---

# 4. CURRENT CODEBASE STRUCTURE

Primary project structure:

```text
space-age-gauntlet-x-v3/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── compile/
│           └── route.ts
│
├── lib/
│   ├── classifier.ts
│   ├── catalog.ts
│   ├── compiler.ts
│   ├── types.ts
│   └── providers/
│       ├── base.mjs
│       ├── index.mjs
│       ├── openai.mjs
│       ├── xai.mjs
│       ├── gemini.mjs
│       ├── openrouter.mjs
│       └── generic.mjs
│
├── runner/
│   ├── fs-tools.mjs
│   ├── checks.mjs
│   ├── prompts.mjs
│   └── state.mjs
│
├── scripts/
│   ├── gauntlet-runner.mjs
│   └── inspect-web.mjs
│
├── tests/
│   └── home.spec.ts
│
├── examples/
│   └── gauntlet.project.example.json
│
├── supabase/
│   └── schema.sql
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── playwright.config.ts
├── .env.example
├── V3_MANIFEST.json
└── README.md
```

---

# 5. IMPORTANT FILE RESPONSIBILITIES

## `app/page.tsx`
Web control center.

Responsibilities:
- mission input
- task type
- execution surface
- mode
- budget
- autonomy
- references
- constraints
- definition of done
- advanced systems
- compile action
- runner config download
- prompt download

Do not turn this into a generic dashboard.

It should remain focused on:
**compile → configure → execute → inspect**

---

## `app/api/compile/route.ts`

Server-side endpoint for compiling a mission into a structured Gauntlet plan.

Input:
- goal
- task type
- harness
- mode
- budget
- autonomy
- references
- constraints
- definition of done
- enabled systems

Output:
- task class
- benchmark manifest
- workstreams
- critics
- rubric
- routes
- compiled prompt
- runner config

---

## `lib/compiler.ts`

This is the central compiler.

It must preserve the distinction between:

- user goal
- benchmark bar
- workstreams
- critics
- rubric
- model routing
- stop rules
- runner configuration

Do not collapse these into one giant prompt string.

The structured plan is important.

---

## `lib/catalog.ts`

Contains task-class-specific:

- benchmark defaults
- critic benches
- workstreams

Current task classes include:

- Website / UI
- Software / App
- AI Skill / Agent
- Research
- Marketing / Copy
- Creative / Visual
- Video / Motion
- General

Any future class should receive its own:
- benchmark dimensions
- critic roles
- workstreams

---

## `lib/providers/*`

Provider adapters.

Current adapters:

- OpenAI
- xAI
- Gemini
- OpenRouter
- generic OpenAI-compatible API

Important rule:

**The rest of the system should not care which provider is used.**

Any new provider should conform to the provider adapter pattern.

---

## `scripts/gauntlet-runner.mjs`

This is the autonomous engine.

Responsibilities:
- load config
- choose available providers
- create run state
- snapshot workspace
- call builder
- parse structured JSON
- safely write files
- run configured checks
- optionally inspect web artifact
- call critic
- call judge
- update ledger
- detect plateaus
- persist round evidence
- decide whether to ship or continue

Treat this file as high leverage.

Do not casually rewrite it without preserving all of the above behavior.

---

## `runner/fs-tools.mjs`

Safety-critical.

Models may only write inside the configured workspace.

Protected paths currently include:

- `.git`
- `.env`
- `.env.local`
- `node_modules`
- `runs`

Do not weaken path traversal protection.

Do not give models arbitrary filesystem access.

---

## `runner/checks.mjs`

Runs only commands supplied by the human-authored config.

Important principle:

**The model does not invent arbitrary shell commands.**

This is a deliberate safety boundary.

---

## `runner/prompts.mjs`

Contains structured prompt contracts for:

- builder
- critic
- judge

Builder must return strict JSON with full replacement files.

Critic must return strict JSON with:

- score
- hardFailure
- largestGap
- evidence
- passed
- regressions
- recommendation

Judge must return strict JSON with:

- score
- ship
- hardFailure
- reason
- acceptedPasses
- rejectedPasses

Do not remove structured output.

---

## `runner/state.mjs`

Persists:

- run ID
- round
- status
- score history
- pass ledger
- events
- config
- per-round evidence

This state system is important for:
- regression memory
- plateaus
- future resumability
- auditability

---

# 6. MODES

## QUICK

Goal:
Low-cost, small decomposition.

Expected behavior:
- minimal subagents
- few critics
- 2–3 high-value rounds
- fastest path to acceptable quality

---

## PRO

Goal:
Strong default mode.

Expected behavior:
- dependency-aware workstreams
- specialist critics
- scoring
- targeted rework
- integration checks
- balanced compute

---

## WAR

Goal:
Maximum competitive quality.

Future target:
- multiple candidate builders
- parallel implementations
- blind tournaments
- specialist judging
- integration pass
- regression waves
- adversarial final review

V3 currently supports aggressive looping but does not yet fully implement parallel candidate swarms.

---

## DESIGN

Goal:
Premium website / UI quality.

Must independently judge:

- visual hierarchy
- typography
- layout
- interaction
- motion
- responsive behavior
- originality
- accessibility
- performance
- conversion

Must include anti-AI-slop evaluation.

---

# 7. WEBSITE ANTI-SLOP RULES

For website tasks, aggressively detect unjustified use of:

- repetitive bento grids
- arbitrary glassmorphism
- excessive pill UI
- generic gradients
- stock icon rows
- giant empty hero sections
- repetitive rounded cards
- fake social proof
- generic AI-written copy
- default Tailwind-looking layouts
- weak typography
- uniform spacing rhythm
- decorative motion without narrative purpose
- desktop-first composition
- cookie-cutter SaaS aesthetics

The objective is NOT to ban these patterns entirely.

The objective is to reject them when they are generic, unjustified, or visually lazy.

---

# 8. REGRESSION MEMORY

The system maintains a PASS ledger.

Example:

```text
Typography hierarchy → PASS
Mobile navigation → PASS
Hero composition → PASS
Accessibility basics → PASS
```

If a later round breaks one of these, the capability must be removed from the PASS ledger.

A new improvement may not silently destroy an old improvement.

This is mandatory.

---

# 9. PLATEAU LOGIC

Current logic:

If score changes remain below the configured delta for a configured number of rounds, the next builder receives a plateau instruction.

The builder must NOT simply repeat the same strategy.

Acceptable responses to a plateau:

- change implementation strategy
- change decomposition
- replace a weak architectural assumption
- attack another root cause
- use a different builder model
- use a different critic model
- acquire a stronger reference
- rewrite a component instead of polishing it
- reconsider the interaction model

Future improvement:
Make plateau response itself configurable.

---

# 10. PROVIDER STRATEGY

Current supported routes:

- OpenAI
- xAI
- Gemini
- OpenRouter
- Generic OpenAI-compatible

Recommended topology:

```text
BUILDER
strong coding model

CRITIC
different model family if possible

JUDGE
third independent strong model
```

Low-cost topology:

```text
BUILDER
DeepSeek / Kimi / GLM / MiniMax via OpenRouter or generic endpoint

CRITIC
Gemini-class inexpensive evaluator

JUDGE
frontier reasoning model only for final/high-value rounds
```

Do not hard-code model names across the entire codebase.

Keep:
- provider
- model
- role

separate.

---

# 11. LOCAL RUNNING

Install:

```bash
npm install
npx playwright install
```

Start compiler:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Compile a mission.

Download:

```text
gauntlet.project.json
```

Then run:

```bash
npm run runner -- gauntlet.project.json
```

---

# 12. EXISTING CODEBASE MODE

To run the Gauntlet against a real existing project:

Edit:

```json
"workspace": "/path/to/project"
```

The project should be under version control.

Recommended before running:

```bash
git status
git add -A
git commit -m "pre-gauntlet checkpoint"
```

Never run destructive autonomous iteration against an unversioned production codebase.

---

# 13. WEBSITE VISUAL INSPECTION

A target website must be running separately.

Example:

```bash
npm run dev
```

Then enable:

```json
"web": {
  "enabled": true,
  "url": "http://127.0.0.1:3000"
}
```

Current default viewports:

```text
390 × 844
768 × 1024
1440 × 1000
```

Playwright currently captures:

- page status
- page title
- console errors
- screenshots

Future target:
Send screenshot images directly into multimodal critics.

---

# 14. CURRENT SAFETY BOUNDARIES

DO NOT REMOVE THESE WITHOUT AN EXPLICIT DESIGN DECISION.

### Boundary A
Models cannot write outside workspace.

### Boundary B
Protected paths cannot be overwritten.

### Boundary C
Models do not get arbitrary shell access.

### Boundary D
Shell commands come from human-authored config.

### Boundary E
Builder output must be structured.

### Boundary F
Fresh critic judges independently.

### Boundary G
Independent judge controls shipping.

These boundaries are intentional.

---

# 15. CURRENT LIMITATIONS

V3 does NOT yet fully include:

1. automatic live benchmark research
2. multimodal screenshot attachment to critic APIs
3. automatic dev-server lifecycle management
4. GitHub branch/commit/PR automation
5. token and dollar cost normalization
6. resumable interrupted runs
7. cloud sandbox provisioning
8. parallel builder swarms
9. automatic model benchmarking
10. provider health/rate-limit routing
11. full visual regression diffing
12. Lighthouse/axe native report parsers
13. live dashboard streaming
14. user preset persistence
15. authenticated multi-user run history

These are extension targets.

---

# 16. PRIORITY V3.x ROADMAP

## V3.1 — LIVE BENCHMARK SCOUT

Goal:
Before building, automatically research the best quality bars.

For websites:
- relevant best-in-class sites
- competitor references
- motion references
- design-system references
- performance/accessibility targets

Output:

```json
{
  "benchmark_manifest": [
    {
      "dimension": "Typography",
      "reference": "...",
      "reason": "...",
      "measurable_target": "..."
    }
  ]
}
```

Important:
Benchmark Scout should triangulate multiple references.

It must not clone one website.

---

## V3.2 — MULTIMODAL VISUAL JUDGE

Goal:
Attach real screenshots to vision-capable critics.

The critic should evaluate:

- hierarchy
- typography
- spacing
- composition
- visual originality
- breakpoint quality
- motion evidence where available

Do not rely on screenshot filenames or DOM summaries alone.

---

## V3.3 — DEV SERVER MANAGER

Goal:
Allow V3 to:

- detect project framework
- install only when authorized
- start dev server
- wait for health
- inspect
- restart if needed
- terminate cleanly

This requires careful process isolation.

---

## V3.4 — GIT WORKFLOW

Goal:
Every Gauntlet run operates safely in version control.

Possible model:

```text
pre-run checkpoint
↓
gauntlet branch
↓
round commits
↓
final diff
↓
optional PR
```

Do not auto-push to production.

---

## V3.5 — COST LEDGER

Track per round:

- provider
- model
- input tokens
- output tokens
- estimated cost
- score gain
- score gain per dollar

This enables compute allocation based on ROI.

---

## V3.6 — PARALLEL CANDIDATES

For high-leverage workstreams:

```text
Builder A
Builder B
Builder C
   ↓
Blind Judge
   ↓
Winner
```

Only use this where the expected quality gain justifies cost.

---

# 17. V4 TARGET ARCHITECTURE

V4 should become a true Gauntlet swarm.

```text
MISSION
   ↓
BENCHMARK SCOUTS
   ↓
TASK GRAPH
   ↓
──────────────────────────────────────
│ Workstream A                         │
│ Builder A1 ─┐                        │
│ Builder A2 ─┼→ Blind Judge → Winner │
│ Builder A3 ─┘                        │
│                                      │
│ Workstream B                         │
│ Builder B1 ─┐                        │
│ Builder B2 ─┼→ Blind Judge → Winner │
│ Builder B3 ─┘                        │
──────────────────────────────────────
   ↓
SPECIALIST CRITICS
   ↓
INTEGRATION DIRECTOR
   ↓
REGRESSION GAUNTLET
   ↓
FINAL RED TEAM
   ↓
SHIP
```

---

# 18. NON-NEGOTIABLE DESIGN PHILOSOPHY

Any future version must preserve:

### 1. Builder ≠ Judge
Never self-certify.

### 2. Artifact > prose
Judge the real output.

### 3. Evidence > vibes
Scores require evidence.

### 4. Largest-gap allocation
Spend the next round where it matters most.

### 5. Regression protection
Improvement must be cumulative.

### 6. Plateau response
Do not repeat failed strategy indefinitely.

### 7. Hard failures override averages
Never hide a critical defect inside a high aggregate score.

### 8. Model portability
No single-provider lock-in.

### 9. Safe autonomy
Agents should have enough power to work, not enough power to destroy the environment.

### 10. Integration matters
Individually excellent parts may still create a poor whole.

---

# 19. HANDOFF INSTRUCTIONS FOR ANOTHER LLM

When another LLM receives this project, it should:

1. Read this entire handoff first.
2. Inspect the actual codebase before proposing changes.
3. Confirm the current architecture from the files.
4. Do not assume this document overrides newer code behavior where the code has intentionally evolved.
5. Preserve current capabilities while upgrading.
6. Run type/build/tests before declaring completion.
7. Avoid unnecessary framework rewrites.
8. Prefer incremental architecture improvements.
9. Maintain provider abstraction.
10. Maintain strict structured builder/critic/judge outputs.
11. Maintain workspace safety boundaries.
12. Update README and this handoff when architecture materially changes.

---

# 20. CODEX-SPECIFIC HANDOFF

If running this through Codex:

```text
Read SPACE_AGE_GAUNTLET_X_V3_HANDOFF.md first.
Then inspect the repository.
Treat the current codebase as authoritative.
Do not merely explain changes—implement them.
Run typecheck/build/tests after modifications.
Preserve safe workspace boundaries and builder/critic/judge separation.
Work in small coherent patches.
Do not replace the architecture with a generic agent framework unless the current architecture demonstrably cannot support the requested feature.
```

---

# 21. CLAUDE CODE-SPECIFIC HANDOFF

If running through Claude Code:

```text
Read the handoff and repository before coding.
Use subagents only when workstreams are genuinely independent.
Do not let builder agents evaluate their own output.
Preserve strict JSON contracts.
Inspect real files and test results.
Do not expand the prompt system into unnecessary prose.
Prefer clear modular changes over one massive rewrite.
```

---

# 22. GEMINI / ANTIGRAVITY HANDOFF

```text
Treat this as an autonomous software system, not a prompt-writing exercise.
Inspect the actual repository.
Preserve provider abstraction and execution safety.
Use multimodal capability when adding visual judging.
Keep benchmark research separate from building.
Run real validation before completion.
```

---

# 23. GROK HANDOFF

```text
Read the project and handoff first.
Do not optimize only for speed.
Preserve independent judging and regression memory.
When adding agentic behavior, keep shell/file permissions constrained.
Implement changes directly and validate them against the existing runner.
```

---

# 24. HERMES / GENERIC AGENT HANDOFF

```text
Operate from the repository state.
Do not assume provider-specific capabilities.
Maintain portable interfaces.
Use explicit structured outputs for agent-to-agent communication.
Keep all autonomous file writes inside workspace.
Require human-defined shell commands unless a future sandbox design explicitly changes that boundary.
```

---

# 25. FIRST TASK FOR ANY NEW LLM

Before editing anything, produce a short repository assessment containing:

```text
CURRENT VERSION:
CURRENT CAPABILITIES:
CURRENT LIMITATIONS:
FILES MOST RELEVANT TO REQUESTED CHANGE:
RISKS:
IMPLEMENTATION PLAN:
VALIDATION PLAN:
```

Then proceed with implementation.

Do not stop after planning unless explicitly asked.

---

# 26. QUALITY STANDARD FOR FUTURE WORK

A future upgrade is not complete because:

- the code compiles,
- the UI looks nicer,
- the prompt is longer,
- more agents were added.

A future upgrade is complete when it produces measurable improvement in:

- reliability
- quality
- autonomy
- evaluation rigor
- portability
- safety
- cost efficiency
- maintainability

Every major new feature should answer:

> What failure mode does this eliminate or what measurable capability does this unlock?

---

# 27. PROJECT OWNER INTENT

The system is intended to become a high-end reusable Gauntlet engine that can be used across:

- AI website creation
- UI/UX design
- frontend engineering
- animation and scroll systems
- AI skills
- coding projects
- research
- creative systems
- general agent workflows

The website/design use case is especially important.

For premium websites, the system should push toward:

- top-tier UI/UX
- typography
- cinematic hero treatment
- advanced scroll choreography
- GSAP-quality interaction
- responsive excellence
- accessibility
- performance
- conversion clarity
- originality
- anti-AI-slop enforcement

The goal is not "good AI output."

The goal is:

> **production-quality work that survives independent comparison against elite references.**

---

# END OF MASTER HANDOFF
