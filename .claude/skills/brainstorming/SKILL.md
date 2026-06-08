---
name: brainstorming
description: Explores user intent before implementation. Use when the user's request could go in many directions or when you sense there might be a better approach.
---

# Brainstorming

## When to use this skill

Load this skill when:
- The user's request is ambiguous or could be solved in multiple ways
- You're about to implement something but aren't sure it's the right thing to build
- The user says "brainstorm", "explore options", "what are my options", or similar
- You want to surface a better approach before committing to implementation

## How to brainstorm effectively

### 1. Clarify the goal, not the solution

Ask about the **outcome** the user wants, not about implementation details:
- "What should users be able to do after this is built?"
- "What problem are we actually solving?"
- "What does success look like?"

### 2. Generate multiple approaches

Present 2-4 distinct options. For each option:
- Name it clearly
- Describe the core approach in 1-2 sentences
- List 2-3 key trade-offs (pros and cons)

### 3. Give your recommendation

After presenting options, state which you'd recommend and why. Don't leave the user to choose without guidance.

### 4. Visual companion (optional)

For complex system designs, consider creating a simple ASCII diagram or table to illustrate the options:

```
Option A: [approach]
  + [pro]
  - [con]

Option B: [approach]
  + [pro]
  - [con]
```

## What to avoid

- Don't ask more than 2 clarifying questions at once
- Don't brainstorm forever — move to implementation once direction is clear
- Don't present options without recommending one
- Don't explore options the user has already ruled out

## After brainstorming

Once you've aligned on an approach:
1. Confirm the chosen direction with the user
2. Consider using the `writing-plans` skill before implementing
3. Proceed with implementation or dispatch subagents
