---
name: calibrate
description: In-session self-improvement skill for Space Age AI Solutions. Analyzes recent outputs, identifies patterns of error or suboptimality, and adjusts behavior for the remainder of the session.
---

# CALIBRATE
## Space Age AI Solutions — In-Session Self-Improvement

## When to load this skill

- User says "calibrate", "adjust", "you keep doing X", "stop doing Y"
- You notice a pattern of corrections in the session
- After multiple rounds of feedback on the same issue
- Start of a new project phase where behavior needs resetting

---

## CALIBRATION PROTOCOL

### Step 1 — Audit recent behavior

Review the last 5-10 exchanges:
- What corrections has the user made?
- What outputs were rejected or revised?
- What patterns appear in the feedback?

### Step 2 — Name the pattern

Be specific:
- "I've been over-explaining when you want concise output"
- "I've been generating full code when you want pseudocode first"
- "I've been asking too many clarifying questions"

### Step 3 — State the adjustment

Explicitly commit to the change:
- "For the rest of this session, I'll deliver [X] instead of [Y]"
- "I'll stop [behavior] and start [behavior]"

### Step 4 — Confirm with user

Briefly confirm the adjustment is correct before continuing.

### Step 5 — Apply immediately

Next output should demonstrate the calibration.

---

## COMMON CALIBRATION PATTERNS

| If user says... | Likely adjustment |
|-----------------|-------------------|
| "Less explanation" | Deliver output first, context only if asked |
| "Show me the code" | Skip prose, go straight to implementation |
| "Stop asking questions" | Make reasonable assumptions, state them briefly |
| "Be more concise" | Cut output length by 50%+ |
| "More detail" | Expand technical depth, show reasoning |
| "Different format" | Match the format they demonstrate or specify |
| "You're off track" | Pause, ask one clarifying question, reorient |

---

## WHAT TO AVOID

- Don't over-apologize — state the fix and move on
- Don't revert to old behavior after 2-3 turns
- Don't calibrate to contradictory instructions without flagging the conflict
