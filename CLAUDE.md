## SA-ORCHESTRATOR — Active on every turn

Skill: /mnt/skills/user/sa-orchestrator/SKILL.md

On every message before responding:
- Scan available skills, MCPs, and CLIs to build a live capability map
- Extract intent signals from the input
- Reason about which capability or chain best matches the task
- Ask at most 2 clarifying questions if ambiguous, then execute
- Execute silently — no announcements, no menus
- Self-correct immediately if the user redirects

This runs on every turn. It is always active.

---

# Space Age AI Solutions — Skills Repository

This repository contains skills for Claude Code. At session start, invoke the `using-superpowers` skill.

## Skill Directories

Skills live in two directories:

- `superpowers/` — Core skills from [obra/superpowers](https://github.com/obra/superpowers): TDD, debugging, planning, code review, and collaboration patterns
- `user/` — Space Age AI Solutions custom skills: brand extraction, page upgrades, and client deliverables

## Available Skills

### Core (superpowers/)

| Skill | Trigger |
|-------|---------|
| `using-superpowers` | Session start — establishes skill-first workflow |
| `brainstorming` | Before any new feature, component, or creative work |
| `writing-plans` | After brainstorming, before implementation |
| `executing-plans` | When working through a written plan |
| `subagent-driven-development` | When dispatching agents to implement plan tasks |
| `dispatching-parallel-agents` | When 3+ independent problems exist simultaneously |
| `test-driven-development` | All code changes — RED/GREEN/REFACTOR |
| `systematic-debugging` | Any bug investigation |
| `using-git-worktrees` | Creating isolated workspaces |
| `requesting-code-review` | After completing a feature or task |
| `receiving-code-review` | When review feedback arrives |
| `finishing-a-development-branch` | When a branch is ready to merge or ship |
| `verification-before-completion` | Before any completion claim |
| `writing-skills` | When creating or updating SKILL.md files |

### Custom (user/)

| Skill | Trigger |
|-------|---------|
| `sa-orchestrator` | Every message — universal capability routing engine (load_order: 0) |
| `brand-extractor` | When extracting or applying a client brand identity |
| `page-upgrade` | When auditing and upgrading an existing client page |

#### Orchestration & Intelligence

| Skill | Trigger |
|-------|---------|
| `sa-site-intelligence` | **Run first on every new project.** Presents the intake questionnaire (batch leads / single build / existing site rebuild), classifies business type, selects context-appropriate GSAP modules (landscaper gets 5 targeted modules, not 30), writes the coding brief, and dispatches the right coding agent. Claude is the director — this skill is how it thinks. |
| `sa-prospecting-agent` | "find [niche] in [city]", "scrape leads", "find businesses that need a website", "generate leads for [industry]" — scrapes Google Maps, audits each site, sorts into Google Sheets (Bucket 1: no site / Bucket 2: needs upgrade / Bucket 3: skip), hands off to pipeline |

#### Video & Storyboard Pipeline

| Skill | Trigger |
|-------|---------|
| `character-storyboard-stylesheet` | "create a storyboard", "plan a cinematic sequence", "build a fight scene storyboard", "create a character action sequence", "plan a 15-second sequence" — 5-column storyboard table + Seedance 2.0 prompts per shot |
| `cinema-worldbuilder` | "write a Seedance prompt", "direct this scene", "create a video prompt for…", any single-scene or multi-cut video prompt — applies 5-mode cinema grammar (M1–M5) with canonical camera blocks |
| `seedance-prompt-engineer` | Fine-grained Seedance 2.0 prompt engineering — use after `cinema-worldbuilder` for per-shot polish |
| `cinematic-video-architect` | Image-to-video across Sora 2, Kling 3.0, Runway Gen-4, Veo 3.1, Pika 2.0, Luma, Seedance 2.0, Hailuo 2.3 — invoke when a reference image is uploaded for video generation |

#### Web Production Pipeline

| Skill | Trigger |
|-------|---------|
| `sa-design-md` | After brand extraction, before any web build — generates DESIGN.md with VL-01 Dark Glassmorphism tokens |
| `cinematic-website-builder` | Final build stage — 30 GSAP + ScrollTrigger modules, single-file HTML, Playwright QA 3-device matrix. Claude selects 3–8 modules via `sa-site-intelligence` before invoking. |

## Full Workflow Chains

### Complete Pipeline — Batch Prospecting to Parallel Deploy

```
[SESSION START] → sa-site-intelligence (questionnaire: A/B/C/D)

MODE A — Batch Build from Leads
  sa-prospecting-agent
    → Google Maps scrape + website audit + Google Sheets (3 buckets)
    → Handoff: Bucket 1 + 2 leads
  [Per lead — all in parallel]
    brand-extractor → sa-design-md
    NanoBanana Pro → hero image
    Higgsfield | Sora | Veo → hero video → FFmpeg → frame assets
    google-stitch → UI/UX wireframe
    sa-site-intelligence → classify business → select modules → write brief → assign agent
    [Parallel agent dispatch — one per site]
      Codex · Claude Code · Gemini Pro · MiniMax 2.7 · DeepSeek v4 · Kimi K2
    Hermes Agent → integration layer (CRM, booking, email, reviews) per site
    Playwright QA → Vercel deploy

MODE B — Single Site Build
  sa-site-intelligence → classify → modules → brief
  brand-extractor → sa-design-md
  NanoBanana Pro + hero video → FFmpeg
  google-stitch → cinematic-website-builder → Hermes Agent → Playwright → Vercel

MODE C — Existing Site Rebuild
  page-upgrade (audit existing) → brand-extractor → sa-design-md
  → [same as Mode B from here]
```

### Hermes Agent Role
Hermes is the **integration specialist**, not the primary builder. It runs AFTER the coding agent
delivers the HTML, connecting every site to: CRM · booking · email automation · payments ·
review platforms · AI chat widget. Every site gets a Hermes integration pass before QA.

### Video-Only Chain
```
character-storyboard-stylesheet → cinema-worldbuilder → seedance-prompt-engineer
```

## Usage

In Claude Code, invoke skills with the `Skill` tool. Never use the `Read` tool on skill files directly.

Skills in `superpowers/` follow the obra/superpowers discipline: invoke before acting, even if there is only a 1% chance the skill applies.
