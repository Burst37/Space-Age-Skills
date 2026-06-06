---
name: calibrate
version: 1.0
updated: 2026-05-15
description: In-session self-improvement for Space Age AI Solutions. Reviews the current conversation for corrections, preferences, and patterns, then suggests specific updates to SA- skills, CLAUDE.md, Google Drive backups, and memory. Triggers on "calibrate", "what can you improve", "update your skills", "what did we learn", "tune up", "calibrate lite". SA-aware: understands SA- prefix conventions, VL-01 UI standard, Drive folder ID, cinematic prompt rules, brand colors, and all Space Age sub-brands.
---

# SA-Calibrate: In-Session Self-Improvement
## Space Age AI Solutions Edition

## What This Does

Scans the current conversation and surfaces specific, actionable updates to SA- skills, instruction files, memory, and the Google Drive Skills backup. Outputs numbered suggestions. You pick which to apply. Nothing changes without your go.

---

## Two Modes

| Mode | Trigger | Scan Depth | Max Suggestions |
|---|---|---|---|
| **Full** | `calibrate` | Entire session | 7 |
| **Lite** | `calibrate lite` | Last 10–20 turns | 3 |

Lite is the right call for short sessions, routine lookups, or quick "anything to fix?" checks. If lite returns nothing: output `Clean — nothing to calibrate` in one line. Do not pad.

---

## Updateable Targets (SA-Aware)

When matching findings to targets, use this priority order:

| Target | When to Use |
|---|---|
| **SA- skill file** (`user/[skill]/SKILL.md` in repo; `/mnt/skills/user/[skill]/SKILL.md` on VPS) | Issue is about how a specific pipeline task executes |
| **CLAUDE.md / instruction file** | General agent behavior, red lines, routing rules |
| **Memory** | Persistent preferences, client context, brand decisions |
| **Google Drive backup** | Any skill change must also flag a Drive sync to `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9` |
| **Cinematic prompt rules** | Camera, lighting, character spec, shot sequence violations |
| **VL-01 UI standard** | Any UI/dashboard deviation from Dark Glassmorphism spec |
| **Brand color / identity** | Orange used where electric blue belongs, or vice versa |
| **Sub-brand rules** | Pilot's Son, WYSIWYG, TheOtherLevelOnline, Record Exec, Credit Solutions |

**Path convention:** In the `space-age-skills` GitHub repo, skill files live at `user/[skill-name]/SKILL.md`. On the VPS (`146.190.78.120`), they live at `/mnt/skills/user/[skill-name]/SKILL.md`. When suggesting a skill edit, cite the repo path for PRs and the VPS path for live edits.

---

## Process

### Step 1 — Scan

Full mode: scan entire session.
Lite mode: last 10–20 turns only.

Look for:

- **Corrections** — "no", "wrong", "not that", "I meant X", "that's not how we do it"
- **Preferences revealed** — format, tone, naming, workflow choices
- **SA convention violations** — wrong prefix, wrong font, wrong color, wrong camera, wrong routing
- **Process gaps** — steps missed that a skill should encode
- **Repeated patterns** — same correction 2+ times = systemic, fix the skill
- **What worked** — approaches accepted without pushback (reinforce in skill)
- **Model routing violations** — Claude doing code execution that should go to DeepSeek/Minimax/Gemma

### Step 2 — Match to Target

For each finding, identify the exact file that needs updating. Check if the fix is already in the skill before suggesting it — no redundant suggestions.

### Step 3 — Present Suggestions

```
[N]. [TARGET: SA-skill-name / CLAUDE.md / MEMORY / DRIVE] — [exactly what to change]
Why: [one sentence — what happened in session that triggered this]
Drive sync: [YES / NO — yes if any skill file is being modified]
```

**Rules:**
- Max 7 suggestions (full) / 3 suggestions (lite)
- Be surgical — not "improve prompts" but "add rule: always lead cinematic shot list with URSA Cine 17K"
- Only suggest what session data supports
- Flag Drive sync on every skill file change
- If nothing to update: `Clean session — nothing to calibrate`

### Step 4 — Apply

Wait for confirmation (e.g. "do 1 and 3", "all", "skip 2").

Then for each approved suggestion:
1. Edit the target file
2. Re-read it to verify coherence
3. Confirm with file path + one-line summary of change
4. If skill file changed → remind to sync to Drive folder `1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9` (use `disableConversionToGoogleType: True`)

### Step 5 — Done

No follow-up needed. Changes are live.

---

## SA Convention Checklist

Every suggestion touching a skill file must check:

- [ ] Skill file named with SA- prefix + descriptive name
- [ ] Output files have specific descriptive names (never generic)
- [ ] Session transcripts would go to `/mnt/transcripts/` + `journal.txt`
- [ ] UI work follows VL-01: `#050508` base, Orbitron/DM Sans/JetBrains Mono, `backdrop-filter: blur(40px) saturate(180%)`
- [ ] Space Age brand: chrome gradient, electric blue — NOT orange (orange = internal product UIs only)
- [ ] Cinematic prompts: URSA Cine 17K first, ≥150 words, YAML output, JSON shot sequence
- [ ] Model routing: Claude = orchestration only; code → DeepSeek V4 Pro / Minimax 2.7 / Gemma
- [ ] API calls: DeepSeek at `https://api.deepseek.com/v1`, OpenRouter at `https://openrouter.ai/api/v1`

---

## What NOT to Suggest

- Changes already encoded in the target skill (check first)
- Generic best practices not grounded in session data
- Temporary fixes for one-off situations
- Changes that would put orange on Space Age agency-facing outputs
- Anything that routes code execution back to Claude instead of the correct model
