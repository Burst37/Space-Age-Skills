---
name: caveman
description: >
  Token reduction on two fronts. (A) Ultra-compressed chat mode (SA-caveman) that cuts Claude's
  own output ~75% while keeping full technical precision. (B) Machine-side token budgeting for
  pipelines that spend tokens on Claude's behalf — builder/critic/judge loops, batch runners,
  agent gauntlets — where the real burn is 50-200x larger than chat. Trigger on: "caveman mode",
  "compress", "short answers only", "token save mode", "just the code", "no explanation",
  "be brief", "minimal output", session approaching context limits, batch execution runs, OR
  "why is this run so expensive", "reduce token usage", "cut the API bill", "token audit",
  "the gauntlet costs too much". Deactivate chat mode with "full mode" or "explain this".
allowed-tools: Read, Grep, Glob, Bash
---

# Caveman — Space Age Ultra-Compressed Mode

Adapted from Matt Pocock's `/caveman` skill. Same core mechanic, SA pipeline context added.

Two modes. Know which one is being asked for:

| | Mode A — Chat compression | Mode B — Pipeline budget |
|---|---|---|
| Saves | tokens Claude *writes* | tokens the *code* spends |
| Scale | ~75% of Claude's output | ~74% of a multi-round run |
| Trigger | "caveman", "be brief" | "token audit", "cut the bill" |
| Rules | this file | `references/pipeline-token-budget.md` |

Mode A is the default on the trigger words below. Mode B is an **audit task**, not a
speaking style — read `references/pipeline-token-budget.md`, then apply it to the runner.
Do not load Mode B references during ordinary chat: they cost more than they save.

---

## Activation

User says any of:
- "caveman mode" / "caveman"
- "compress" / "compressed mode"
- "token save" / "save tokens"
- "just the output" / "no explanation"
- "short" / "minimal" / "tight"

Or Claude detects:
- Session > 60 messages with no new planning
- User is in batch execution mode (e.g. mass-producing site builds)
- Context window approaching limit
- Repeated similar operations (pipeline batch)

---

## Caveman Rules (Active When Mode Is On)

### Output Rules
✅ Code only — no preamble, no explanation
✅ Error → one-line diagnosis + fix
✅ Questions → one word or one line
✅ Status → done / failed / blocked
✅ File paths → bare path only

❌ NO: "Great question! Let me explain..."
❌ NO: "Here's what I'm going to do..."
❌ NO: "As you can see from the output..."
❌ NO: Any sentence that starts with "I"

### Response Format

| Normal Mode | Caveman Mode |
|---|---|
| "Here's the updated script. I've made the following changes to fix the webhook timeout issue..." | `[file.js updated — timeout 5000→30000]` |
| "The error you're seeing is caused by X. To fix it, you need to Y and Z..." | `Error: missing env var. Add VAPI_KEY to .env` |
| "I'll now run the scraper on the first 10 rows to test..." | `running scraper — 10 rows` |
| "The build completed successfully. The HTML file is at..." | `✅ /outputs/plumber-dallas.html` |

---

## SA Pipeline Caveman Formats

### Site Build Status
```
✅ [business-name] — [city] — /outputs/[filename].html
❌ [business-name] — FAILED — [reason in 5 words]
⏳ [business-name] — building...
```

### Outreach Batch Status
```
📧 [n] emails queued
📞 [n] Vapi calls deployed
❌ [n] failed — [reason]
```

### VPS Command Output
```
$ [command]
→ [result in 1 line]
```

### Error Report
```
ERR: [file:line] [error type]
FIX: [solution in <10 words]
```

### Skill Output (Compressed)
```
BRIEF: [client] | [vertical] | [city] | [tier]
STACK: [tech] | [cta] | [archetype]
NEXT: → [skill name]
```

---

## Mode B — Pipeline Token Budget (audit task)

When the cost is in a runner rather than in chat, compressing Claude's replies is noise.
Go after the loop.

**Load `references/pipeline-token-budget.md`** for the 8 rules. Headlines:

1. Never re-send an unchanged file — delta snapshots (75-85% of the snapshot)
2. Never pretty-print JSON into a prompt (10-20% of every payload)
3. A passing check has no stdout worth sending (5,028 tok → 9 tok, measured)
4. Send evidence once, to one reader — no critic/judge duplication
5. Stable text first, volatile last — or no prefix cache ever hits
6. Strip non-judgeable fields (screenshot paths, minor a11y, console dumps)
7. Budget before you spend — throw pre-flight, not post-invoice
8. Price the ledger or it reports $0 forever

**Drop-in:** `assets/token-budget.mjs` — `deltaSnapshot`, `compressChecks`,
`compressWebInspection`, `assemblePrompt`, `assertBudget`, `estimateCost`, `PRICE_TABLE`.

**Worked example:** `references/gauntlet-x-v4.md` — the 10 findings in Space Age
Gauntlet X V4 and the exact edits. 1.48M → ~380k tokens per run.

### Audit order (fastest payback first)
```
1. snapshot/context assembly  → is anything re-sent unchanged?
2. tool output (test/build)   → is success carrying stdout?
3. prompt ordering            → is a round counter above the payload?
4. fan-out                    → does N candidates mean N copies of one blob?
5. ledger                     → does it report a real number?
```

### Rule that overrides all of the above
Never compress something a downstream role has to **act on**. Cutting the error line a
builder needs costs a whole extra round — more than it saved. Cut bytes nobody reads.

---

## Deactivation

User says any of:
- "full mode" / "normal mode"
- "explain this"
- "why did you..."
- "walk me through..."
- "elaborate"

When deactivated, confirm: `[full mode restored]`

---

## Context Window Emergency Mode

When context is critically close to limit (Claude will sense this from degraded recall),
auto-activate caveman AND suggest:

```
[context limit approaching — suggest: session handoff + new session]
Continue in caveman until handoff?
```

---

## Boundary — Never Applies to Client-Facing Output

Caveman compresses Claude's *own* working communication with Mr. Black during execution — it
never compresses generated deliverables (site copy, email copy, Vapi scripts, client-facing
reports). Those keep their normal full-detail standards regardless of caveman state.
