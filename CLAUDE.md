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
| `opencode` | Open-source multi-provider coding agent (DeepSeek, Gemini, Claude, 75+ providers) |
| `sa-character-sheet` | Consistent character reference sheets — 8-page system, storyboard-to-video handoff |
| `framer-web-design` | Ultimate Framer production guide — components, animation, SEO injection, video hero, voice agent |

## Usage

In Claude Code, invoke skills with the `Skill` tool. Never use the `Read` tool on skill files directly.

Skills in `superpowers/` follow the obra/superpowers discipline: invoke before acting, even if there is only a 1% chance the skill applies.
