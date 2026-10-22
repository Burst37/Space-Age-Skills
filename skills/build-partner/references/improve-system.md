# Improve System mode

Keep the user's AI setup sharp. Four sub-modes; detect from context or ask.

| Sub-mode | Trigger | Does |
|---|---|---|
| **Setup Review** | "review my setup", first use | Prioritized audit of the environment |
| **Experience Capture** | "capture/log this", a win or lesson | Writes a structured note |
| **Session Review** | "recap my week", bare invocation for returning users | Weekly recap |
| **Audit** | "audit", "health check", "what's stale" | Finds rot and contradictions |

## Data sources (local only; read what exists, skip what doesn't)

- Instruction files: global and project `CLAUDE.md` / `AGENTS.md` / `.cursorrules` / custom-GPT instructions the user pastes.
- Config: `~/.claude/settings.json`, project `.claude/settings.json`, MCP configs (`.mcp.json`, `~/.claude.json`).
- Skills: `~/.claude/skills/`, project `.claude/skills/`, `skills/`.
- Session history: `~/.claude/projects/*/*.jsonl` (projects, tools/skills used, timestamps).
- Git: `git log --oneline --since="2 weeks ago"`.
- Knowledge folder: `./knowledge/` if present.

No file access (other LLMs)? Ask the user to paste their instruction file, tool/skill list, and a summary of recent work, then proceed.

## Rules

- Every finding is backed by evidence from their files/sessions. No generic tips.
- Fixes are copy-paste specific. If you can apply one now, offer to.
- Always include "What's Working Well".
- Flag patterns only when they recur, not from a single instance.
- Never apply changes or delete anything without explicit approval.
- Don't report raw session/token counts; use relative terms and project names.
- Contradictions may be context-dependent — document when each applies instead of picking a winner.

## Setup Review

Check: instruction file clarity/size (always-loaded context should be lean), rules that duplicate or conflict, procedures that should be skills, repeated manual tasks that should be scripts/hooks, MCP servers configured vs used, permissions causing friction, missing project instructions in active repos.

```
## Setup Review

### What's Working Well
- ...

### What to Improve (ranked by impact)
1. <issue> — evidence: <file/line or session pattern> — fix: <exact change>

### Quick Win
<one change under 5 minutes>
```

Then: "Want me to apply any of these?" Work through approved fixes one at a time.

## Experience Capture

Write `./knowledge/experiences/{YYYY-MM-DD}-{slug}.md` (create dirs):

```markdown
# {Date} - {Title}

## What happened
{1-2 paragraphs}

## Key learning
- {transferable insight}

## Why it matters
{one sentence}

## Tags
{topic1, topic2}
```

Confirm with: `Captured: **{title}** → {path}`.

## Session Review

Last 7 days of sessions + git log. Output ≤ 15 lines:

```
## This Week
**Focus: {main project}**

### What you worked on
- ...

### Best session
{one sentence}

### Add to your playbook
- {1-2 habits from this week's patterns}
```

Then ask if there's a win/lesson to capture. Save the recap to `./knowledge/experiences/recaps/{YYYY-MM-DD}-weekly-recap.md`.

## Audit

Checks: stale rules (reference tools/patterns not seen recently), unused MCP servers, dead skills (missing files, broken references), contradictions, orphaned knowledge files.

```
## System Audit
**Health:** Good / Needs attention / Needs cleanup

### Issues Found
1. <issue> — <what to do>

### Clean
- ...
```

Max 10 items. Fix only what's approved.
