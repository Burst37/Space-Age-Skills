---
name: icm-workspace-architect
description: >
  SA-Interpreted Context Methodology (ICM) architect — filesystem-as-orchestration
  for all Space Age AI pipeline workspaces. Replaces multi-agent framework overhead
  with numbered folder stages, markdown CONTEXT.md contracts, and layered context
  loading so one agent (Claude/Hermes) executes the full pipeline without coordination
  code. This is the context engineering standard for every SA pipeline workspace: lead
  gen, voice agent, site builder, Record Exec, credit repair, and Hermes Agent
  sequences. Load BEFORE architecting any multi-step pipeline. TRIGGER: "build a
  workspace", "stage the pipeline", "organize the context", "ICM structure", "set up
  the stages", "build the folder structure", or any time a pipeline has more than 2
  sequential steps that Claude Code or Hermes will execute.
license: MIT
source: https://github.com/RinDig/Interpretable-Context-Methodology-ICM-
paper: https://arxiv.org/abs/2603.16021v2
---

# ICM Workspace Architect — Space Age AI Solutions

**Source:** Jake Van Clief / RinDig — Interpretable Context Methodology (ICM)
**Adapted for:** Space Age AI Solutions multi-step pipeline architecture
**Primary Agent:** Claude (Opus 4.x) orchestrates; Sonnet 4.x handles sub-tasks
**Applies to:** All SA pipeline workspaces on VPS (146.190.78.120) and Claude Code

---

## WHAT ICM IS

Filesystem-as-orchestration. Instead of multi-agent frameworks (CrewAI, LangChain, AutoGen) with code-level orchestration logic, ICM organizes agent work into:

- **Numbered folders** = execution stages in sequence
- **Markdown files** = prompts, context, contracts at each stage
- **Local scripts** = mechanical non-AI work (file moves, CSV exports, API pings)
- **One orchestrating agent** reading the right files at the right moment

The folder structure tells the agent what to do. No framework needed for sequential pipelines.

### Why This Beats Frameworks for SA Pipelines

| Dimension | Framework (LangChain, CrewAI) | ICM (SA Standard) |
|---|---|---|
| Change stage order | Edit code, redeploy | Rename/reorder folders |
| Modify a prompt | Edit agent config in code | Edit a markdown file |
| Add/remove a stage | New agent class + update orchestrator | Add/delete a folder |
| Inspect intermediate state | Build logging dashboard | Open the folder, read the files |
| Who can make changes | Developer | Anyone with a text editor |
| Error recovery | Built-in retry/fallback in code | Manual re-run of failed stage |
| Concurrent execution | Native parallel agent coordination | Sequential by design |
| Token cost | All context loaded monolithically | Stage-scoped, 2k–8k per step |

**SA Rule:** For sequential pipelines where Hermes reviews output at each step, ICM is always preferred. Frameworks only if true concurrent multi-agent coordination is needed.

---

## THE 5-LAYER CONTEXT HIERARCHY

Every ICM workspace loads context in layers. Each agent only receives layers relevant to its current stage. Total context per stage: **2,000–8,000 tokens** (not 40k+).

| Layer | File | ~Tokens | Question it answers | Kind |
|---|---|---|---|---|
| 0 | `CLAUDE.md` | ~800 | "Where am I?" | Structural routing |
| 1 | `CONTEXT.md` | ~300 | "Where do I go?" | Workspace-level routing |
| 2 | Stage `CONTEXT.md` | 200–500 | "What do I do?" | Stage contract |
| 3 | `references/` | 500–2k | "What rules apply?" | Factory — stable across runs |
| 4 | `output/` artifacts | varies | "What am I working with?" | Product — per-run content |

### Layer 3 vs Layer 4 — The Critical Distinction

| | Layer 3: Reference (The Factory) | Layer 4: Working Artifacts (The Product) |
|---|---|---|
| Changes between runs | No | Yes |
| SA examples | voice.md, brand-tokens.md, sa-offer.md, lead-scoring-rules.md | lead-brief.json, site-draft.html, outreach-email.html |
| Model should | Internalize as constraints | Process as input |
| Configured during | Workspace setup (once) | Pipeline execution (each run) |
| Folder location | `references/`, `_config/`, `shared/` | `output/` |
| Analogy | The recipe | The ingredients |

**Never mix Layer 3 and Layer 4 in one context load.** Mixing forces the agent to sort stable rules from per-run content — that's your job, done in the folder structure.

---

## STANDARD WORKSPACE FOLDER STRUCTURE

```
workspace-name/
├── CLAUDE.md                   ← L0: Global identity. "You are in [workspace]. Here is the structure."
├── CONTEXT.md                  ← L1: Routing table. "For task X, go to stage Y."
├── _config/
│   └── sa-constants.md         ← L3: SA global constants (offer, pricing, VPS, API endpoints)
├── shared/
│   └── brand-voice.md          ← L3: Shared reference used by multiple stages
├── stages/
│   ├── 01-[stage-name]/
│   │   ├── CONTEXT.md          ← L2: Stage contract (inputs, process, outputs, success criteria)
│   │   ├── references/         ← L3: Stage-specific reference (stable rules for this step)
│   │   └── output/             ← L4: This stage's output (input to next stage)
│   ├── 02-[stage-name]/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   └── 03-[stage-name]/
│       ├── CONTEXT.md
│       ├── references/
│       └── output/
└── setup/
    └── questionnaire.md        ← One-time setup: gather workspace config from user
```

---

## STAGE CONTRACT — THE CONTROL POINT

Every `stages/NN-name/CONTEXT.md` is a **stage contract**. This is the most important file in ICM. It defines exactly what the agent loads, does, and produces.

### Stage Contract Template

```markdown
# Stage [NN]: [Stage Name]

## Role
You are a [specific role]. In this stage you [one sentence job description].

## Inputs
Load these files before executing:

| File | Layer | What to do with it |
|------|-------|---------------------|
| `../../_config/sa-constants.md` | L3 | Internalize as constraints |
| `../../shared/brand-voice.md` | L3 | Apply to all written output |
| `../[prev-stage]/output/[file].json` | L4 | This is your primary input — process it |

Do NOT load any files not listed above.

## Process
[Step-by-step numbered list of exactly what to do. Be specific.]
1. Read [file], extract [specific fields]
2. Apply [rule from Layer 3 reference]
3. Produce [specific output format]

## Outputs
Write to `output/` in this stage folder:

| File | Format | Description |
|------|--------|-------------|
| `[output-file].json` | JSON | [Exact schema] |
| `[output-file].md` | Markdown | [Human-readable summary for review] |

## Success Criteria
Stage is complete when:
- [ ] `output/[file].json` exists and contains [specific keys]
- [ ] [measurable condition 2]
- [ ] [measurable condition 3]

## Handoff to Next Stage
Next: `stages/[NN+1]-[next-stage]/CONTEXT.md`
Human review point: [Yes/No] — [what to review before advancing]
```

---

## SA PIPELINE WORKSPACES — BUILT ON ICM

These are the active SA pipelines structured as ICM workspaces.

### 1. Lead Gen Pipeline Workspace (`lead-gen-pipeline/`)

```
lead-gen-pipeline/
├── CLAUDE.md
├── CONTEXT.md
├── _config/
│   ├── sa-offer.md             ← "$300–750 website offer, cold outreach specs"
│   ├── lead-scoring-rules.md   ← "Quality score 1–5 criteria"
│   └── vps-config.md           ← "146.190.78.120, DeepSeek endpoint, model routing"
├── shared/
│   └── target-business-profile.md  ← "What a quality lead looks like"
└── stages/
    ├── 01-scrape/              ← Google Maps scraper → raw CSV
    ├── 02-score-and-rank/      ← CSV → scored + ranked lead list
    ├── 03-brief-generation/    ← Lead row → build_brief JSON (lead-to-brief skill)
    ├── 04-site-build/          ← build_brief → cinematic HTML site (5-agent swarm)
    ├── 05-outreach-copy/       ← build_brief → email + Vapi script (outreach-copywriter skill)
    └── 06-deploy-and-call/     ← HTML → VPS deploy + Vapi agent queued (vapi-orchestrator skill)
```

**Context budget:** Each stage: ~3k–6k tokens. vs. monolithic load: ~42k+.

### 2. Record Exec Pipeline Workspace (`record-exec-pipeline/`)

```
record-exec-pipeline/
├── CLAUDE.md
├── CONTEXT.md
├── _config/
│   ├── artist-roster.md        ← Enrolled artists + physical specs
│   └── platform-specs.md       ← IG/TikTok/FB dimensions + posting rules
└── stages/
    ├── 01-artist-onboard/      ← EPK generation + character sheet
    ├── 02-content-calendar/    ← Weekly content plan
    ├── 03-image-prompts/       ← NanoBanana / ChatGPT Image 2.0 prompt batch
    ├── 04-video-prompts/       ← Kling 3.0 / Seedance 2.0 prompt batch
    └── 05-publish-queue/       ← Canva render + schedule
```

### 3. Credit Repair Workspace (`credit-repair-pipeline/`)

```
credit-repair-pipeline/
├── CLAUDE.md
├── CONTEXT.md
├── _config/
│   └── protocol-mode.md        ← "Accelerated Pressure Protocol Mode 3 active"
└── stages/
    ├── 01-forensic-audit/      ← Credit report → dispute targets
    ├── 02-affidavit-gen/       ← Targets → Anti-OCR affidavits (dynamic variability)
    ├── 03-bureau-response/     ← Response letter handling
    └── 04-escalation/          ← FDCPA / MOV demands / estoppel
```

---

## HERMES AGENT — ICM NAVIGATION COMMANDS

When Hermes (Telegram-controlled Claude Code agent on VPS) runs an ICM workspace:

```bash
# Navigate to workspace
cd /workspaces/[workspace-name]

# Read root routing
cat CLAUDE.md
cat CONTEXT.md

# Execute a specific stage
cd stages/03-brief-generation
cat CONTEXT.md        # load stage contract
cat references/*      # load Layer 3
cat ../02-score-and-rank/output/ranked-leads.json  # load Layer 4

# Execute stage → write to output/

# Advance to next stage
cd ../04-site-build
cat CONTEXT.md
# ... repeat
```

**Hermes Telegram commands:**
```
/run-stage lead-gen-pipeline 03-brief-generation
/review-output lead-gen-pipeline 03-brief-generation
/advance lead-gen-pipeline
/run-all lead-gen-pipeline          ← runs all stages sequentially, pauses at review points
```

---

## BUILDING A NEW ICM WORKSPACE

### Step 1 — Identify the stages (one job each)
List every step in the pipeline. Each step = one stage folder. If a step has two jobs, split it. Use the Unix principle: one program does one thing.

### Step 2 — Write CLAUDE.md (Layer 0)
```markdown
# [Workspace Name]

You are in the [workspace-name] workspace.

## Folder Map
- `_config/` — SA global constants for this workspace
- `shared/` — Reference material shared across stages
- `stages/01-*/` through `stages/0N-*/` — Numbered execution stages
- `setup/` — One-time workspace configuration

## Primary Agent
Claude Opus 4.x orchestrates. Delegate sub-tasks to Sonnet 4.x via Agent Teams.

## How to Start
Read `CONTEXT.md` next. It will route you to the correct stage.
```

### Step 3 — Write CONTEXT.md (Layer 1)
```markdown
# [Workspace Name] — Routing Table

## What do you want to do?

| Task | Go to |
|------|-------|
| Start a fresh pipeline run | stages/01-[first-stage]/CONTEXT.md |
| Resume at [stage] | stages/0N-[stage]/CONTEXT.md |
| Review last output | stages/0N-[stage]/output/ |
| Update reference material | _config/ or shared/ |
```

### Step 4 — Write each Stage CONTEXT.md (Layer 2)
Use the Stage Contract Template above. Be specific about:
- **Exactly which files to load** (no more, no less)
- **Numbered process steps** (not vague instructions)
- **Exact output schema** (filenames, JSON keys, format)
- **Success criteria checkboxes** (verifiable, not subjective)
- **Human review point** (yes/no + what to check)

### Step 5 — Populate Layer 3 references
Copy relevant SA skill content into each stage's `references/` folder. Don't link to the full SKILL.md — extract only the section relevant to this stage. Keep Layer 3 files under 1,500 tokens per file.

### Step 6 — Test one stage end-to-end
Run stage 01 manually. Verify `output/` file exists with correct schema. Then run stage 02 manually, confirming it reads stage 01's output correctly. Only then wire up Hermes automation.

---

## CONTEXT ENGINEERING RULES — SA ENFORCEMENT

These apply to every ICM workspace and every SKILL.md:

1. **Stage-scope everything.** Never load a full skill or reference file — extract the relevant section only. Full cinematic-website-builder SKILL.md = 68k tokens. Stage-relevant extract = ~1,500 tokens. Load the extract.
2. **Layer 3 ≠ Layer 4.** Never put per-run artifacts in `references/`. Never put stable rules in `output/`. The model reads them differently.
3. **One CONTEXT.md per stage.** Never combine two stages into one CONTEXT.md. The contract boundary IS the cognitive boundary.
4. **Outputs are always edit surfaces.** Every stage writes to its `output/` folder. Hermes (or you) can edit those files before the next stage runs. This is human-in-the-loop by design, not as an afterthought.
5. **Plain text only.** All stage contracts, references, and outputs in markdown or JSON. No binary formats. No external database dependencies for stage handoff. The filesystem is the state machine.
6. **Token budget enforcement:**
   - L0 CLAUDE.md: ≤ 800 tokens
   - L1 CONTEXT.md: ≤ 300 tokens
   - L2 Stage CONTEXT.md: ≤ 500 tokens
   - L3 per-file: ≤ 1,500 tokens
   - Total per stage: target 2k–8k, hard ceiling 12k

---

## INTEGRATION WITH EXISTING SA SKILLS

ICM is the **architectural layer** that sits above existing SA skills. Each skill becomes a **stage-level executor** inside an ICM workspace.

| SA Skill | ICM Stage Role |
|---|---|
| lead-to-brief | Stage 03 executor — reads scored CSV, writes build_brief JSON |
| outreach-copywriter | Stage 05 executor — reads build_brief, writes email + Vapi script |
| vapi-orchestrator | Stage 06 executor — reads Vapi script, deploys call |
| cinematic-website-builder | Stage 04 executor — reads build_brief, writes HTML file |
| local-business-seo | Stage 04 sub-module — injected into cinematic builder stage context |
| credit-repair | All stages of credit-repair workspace |
| record-exec-in-a-box | All stages of record-exec pipeline workspace |
| karpathy-guidelines | Layer 3 reference — injected into every coding stage's `references/` |

**The skill SKILL.md is the factory setting (Layer 3).** **The stage-specific extract from the SKILL.md is what actually loads in each stage.**

---

## QUICK REFERENCE — ICM vs. CURRENT SA APPROACH

| SA Current State | ICM Upgrade |
|---|---|
| Pipeline logic lives in Claude's memory | Pipeline logic lives in filesystem contracts |
| Claude reloads full skills every session | Each stage loads only its scoped extract |
| Hermes gets verbal instructions | Hermes navigates CLAUDE.md → CONTEXT.md → Stage CONTEXT.md |
| Stage handoffs are implicit | Stage handoffs are output/ folders — explicit and editable |
| Human review is manual and ad hoc | Human review points are declared in each Stage Contract |
| Skills are monolithic | Skills are decomposed into stage-level reference extracts |

---

## REFERENCES

- ICM Paper: https://arxiv.org/abs/2603.16021v2
- ICM Repository: https://github.com/RinDig/Interpretable-Context-Methodology-ICM-
- Context Engineering (Karpathy): https://x.com/karpathy/status/2015883857489522876
- SA Karpathy Guidelines: `/mnt/skills/user/karpathy-guidelines/SKILL.md`
- SA n8n Pipeline Architect: `/mnt/skills/user/n8n-pipeline-architect/SKILL.md`
