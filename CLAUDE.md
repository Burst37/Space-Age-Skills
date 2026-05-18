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

#### Video & Storyboard Pipeline

| Skill | Trigger |
|-------|---------|
| `character-storyboard-stylesheet` | "create a storyboard", "plan a cinematic sequence", "build a fight scene storyboard", "create a character action sequence", "make a shot breakdown", "plan a 15-second sequence" — outputs 5-column storyboard table + Seedance 2.0 prompts per shot |
| `cinema-worldbuilder` | "write a Seedance prompt", "direct this scene", "create a video prompt for…", "worldbuild this shot", any single-scene or multi-cut video prompt request — applies 5-mode cinema grammar (M1–M5) with canonical camera blocks |
| `seedance-prompt-engineer` | Fine-grained Seedance 2.0 prompt engineering, multi-shot MVP system, Director's Card framework — use after `cinema-worldbuilder` or `character-storyboard-stylesheet` for per-shot polish |
| `cinematic-video-architect` | Image-to-video prompt generation across multiple platforms (Sora 2, Kling 3.0, Runway Gen-4, Veo 3.1, Pika 2.0, Luma) — invoke when a reference image is uploaded for video generation |

#### Web Production Pipeline

| Skill | Trigger |
|-------|---------|
| `sa-design-md` | After brand extraction, before any web build — generates DESIGN.md with VL-01 Dark Glassmorphism tokens |
| `cinematic-website-builder` | Final stage of the web pipeline — "build the website", "apply cinematic effects", "add GSAP animations" — 30 GSAP + ScrollTrigger modules, single-file HTML, Playwright QA |

## Workflow Chains

### Video Production Chain
```
User intent (scene/character/action)
  → character-storyboard-stylesheet   # plan multi-shot structure + per-shot prompts
  → cinema-worldbuilder               # apply professional cinema grammar to each shot
  → seedance-prompt-engineer          # polish final prompts for Seedance 2.0 delivery
```

### Web Production Chain
```
User intent (client brief / brand)
  → brand-extractor                   # extract brand identity
  → sa-design-md                      # generate DESIGN.md token system
  → ui-ux-designer (Google Stitch)    # wireframe → component layout
  → cinematic-website-builder         # 30-module GSAP build + Playwright QA
```

### Full Client Delivery Chain
```
brand-extractor → sa-design-md → production-pipeline-orchestrator
  ├── NanoBanana Pro (hero images)
  ├── character-storyboard-stylesheet → cinema-worldbuilder → Seedance 2.0 (hero video)
  └── ui-ux-designer → cinematic-website-builder (website)
```

## Usage

In Claude Code, invoke skills with the `Skill` tool. Never use the `Read` tool on skill files directly.

Skills in `superpowers/` follow the obra/superpowers discipline: invoke before acting, even if there is only a 1% chance the skill applies.
