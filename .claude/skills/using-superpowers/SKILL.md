---
name: using-superpowers
description: Meta-skill for finding and using other skills. Load this when you need to discover what skills are available or how to use them.
---

# Using Superpowers

## What are skills?

Skills are reusable workflow guides stored in `.claude/skills/`. Each skill describes:
- When to load and use it
- A step-by-step process
- What to avoid
- How it connects to other skills

## How to find the right skill

### By situation

| Situation | Skill to load |
|-----------|---------------|
| Request is ambiguous or could go many ways | `brainstorming` |
| About to build something complex | `writing-plans` |
| Have a plan, ready to implement | `executing-plans` |
| Complex work, want parallel execution | `dispatching-parallel-agents` |
| Feature complete, want review | `requesting-code-review` |
| Received review feedback | `receiving-code-review` |
| Feature done, ready to ship | `finishing-a-development-branch` |
| Bug that isn't obvious | `systematic-debugging` |
| Building something new | `test-driven-development` |
| Need isolated workspace | `using-git-worktrees` |
| Want structured dev + review cycle | `subagent-driven-development` |
| About to declare task done | `verification-before-completion` |
| Building a new skill | `writing-skills` |

## How to use a skill

1. Load the skill file: `Read .claude/skills/<skill-name>/SKILL.md`
2. Follow the instructions in the skill
3. Skills often reference other skills — follow the chain

## Skill chaining example

For a typical feature build:
```
brainstorming → writing-plans → executing-plans 
  → requesting-code-review → receiving-code-review 
  → verification-before-completion → finishing-a-development-branch
```
