---
name: brainstorming
description: >
  Use when starting any new feature, project, or non-trivial task. Enforces a hard
  gate: no implementation until a design is presented and approved by the user.
---

# BRAINSTORMING

Source: https://github.com/obra/superpowers

## Core Principle

Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.

## Process Steps

1. **Explore context** — Review existing files, docs, commits, project state
2. **Offer visual tools just-in-time** — Only when a question genuinely benefits from mockup/diagram
3. **Ask clarifying questions** — One at a time. Understand purpose and constraints fully.
4. **Propose 2-3 approaches** — With trade-offs for each
5. **Present design** — Get approval section by section
6. **Write spec document** — Save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
7. **Self-review spec** — Check for placeholders, contradictions, ambiguity
8. **User reviews written spec** — Wait for explicit approval
9. **Invoke writing-plans** — This is the ONLY permitted next step

## Key Guardrails

- "This Is Too Simple To Need A Design" is an anti-pattern. Reject it.
- Simple projects are where unexamined assumptions cause the most wasted work
- Break large projects into independently-scoped sub-projects with separate specs
- Follow existing codebase patterns; include targeted improvements where relevant
- Only invoke the **writing-plans skill** after brainstorming — no other implementation tools

## Common Mistakes

- Jumping to implementation because the task "seems obvious"
- Asking multiple clarifying questions at once
- Skipping the written spec when the design "fits in your head"
- Offering the visual companion upfront instead of just-in-time
