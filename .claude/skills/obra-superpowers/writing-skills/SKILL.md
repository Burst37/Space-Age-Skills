---
name: writing-skills
description: >
  Use when creating a new skill document. Applies TDD to skill creation — no skill
  without a failing test first. Documents baseline behavior before writing guidance.
---

# WRITING SKILLS

Source: https://github.com/obra/superpowers

## Core Rule

NO SKILL WITHOUT A FAILING TEST FIRST.

Document baseline agent behavior (without the skill) before writing the skill to change it.

## The RED-GREEN-REFACTOR Cycle

**RED:** Run pressure scenarios without the skill. Capture specific rationalizations agents use to violate what you want the skill to enforce.

**GREEN:** Write minimal skill content addressing those documented violations. Verify agents comply when the skill is present.

**REFACTOR:** Identify new workarounds from testing. Add explicit counters until bulletproof.

## Critical: Description Field Rule

Skill descriptions must state **triggering conditions only** — never summarize the workflow.

When descriptions include process details, agents follow the description as a shortcut instead of reading the full skill. This breaks the skill.

## When to Create Skills

Create for:
- Techniques non-obvious enough you'd reference across projects
- Patterns broadly applicable beyond a single project
- Things that would benefit other agents

Skip for:
- One-off solutions
- Project-specific conventions
- Mechanically enforceable constraints (use linters/CI instead)

## SKILL.md Format

```yaml
---
name: skill-name  # letters, numbers, hyphens only
description: >
  Use when [triggering condition only — NO workflow summary]
---
```

Followed by:
- Overview with core principle
- Specific triggering conditions
- Clear examples and patterns
- Common mistakes section
- Rationalization table (for discipline-enforcing skills)

## Testing Requirements

- Test discipline-enforcing skills under combined pressures (time pressure, sunk cost, exhaustion)
- Use micro-tests with fresh contexts before full scenario runs
- Include no-guidance controls to verify the failure actually exists
- Manually review all results — automated scoring misses nuance
