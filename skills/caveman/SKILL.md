---
name: caveman
description: >
  Ultra-compressed communication mode (SA-caveman) that cuts token usage ~75% while maintaining
  full technical precision. Use when running long pipeline sessions, batch operations, or any
  work where token cost / context window space matters. Trigger on: "caveman mode", "compress",
  "short answers only", "token save mode", "just the code", "no explanation", "be brief",
  "minimal output", or when a session is approaching context limits. Also auto-suggest this mode
  when a session is long and work is execution-only (not planning) — e.g. batch website builds,
  batch outreach runs. Deactivate with "full mode" or "explain this".
allowed-tools: Read, Bash
---

# Caveman — Space Age Ultra-Compressed Mode

Adapted from Matt Pocock's `/caveman` skill. Same core mechanic, SA pipeline context added.

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
