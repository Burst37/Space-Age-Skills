---
name: writing-skills
description: TDD applied to process documentation. Use when creating a new skill for the .claude/skills/ directory.
---

# Writing Skills

## When to use this skill

Load this skill when:
- Creating a new skill document
- Improving an existing skill
- The user asks you to "write a skill for X"

## Skills are process documentation

A skill is a reusable workflow guide. It should:
- Tell Claude WHEN to use it (trigger conditions)
- Tell Claude HOW to do it (step-by-step process)
- Tell Claude what NOT to do (anti-patterns)
- Connect to adjacent skills (the skill graph)

## TDD for skills: write the test first

Before writing the skill, write the test:
1. Describe a concrete scenario where this skill would be used
2. Describe what "using the skill correctly" looks like
3. Describe what failure looks like

This test is your acceptance criterion.

## Skill structure

```markdown
---
name: skill-name
description: One sentence — what this skill does and when to load it.
---

# Skill Name

## When to use this skill
[Trigger conditions — specific and concrete]

## [Core process section(s)]
[Step-by-step guide]

## What to avoid
[Anti-patterns]

## [Optional: connections to other skills]
```

## Quality checklist

- [ ] Trigger conditions are specific (not "when it seems useful")
- [ ] Steps are actionable (not "think carefully")
- [ ] Anti-patterns are concrete (not "don't do bad things")
- [ ] Fits in one screen when possible
- [ ] A new user could follow it without explanation

## Where to save

```
.claude/skills/<skill-name>/SKILL.md
```

## What to avoid

- Don't write skills that are too general to be useful
- Don't write steps that are just good general advice
- Don't make skills longer than they need to be
- Don't duplicate content from another skill — link to it instead
