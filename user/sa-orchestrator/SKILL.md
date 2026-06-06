---
name: sa-orchestrator
version: 2.0.0
updated: 2026-05-15
description: >
  Universal capability reasoning engine for Space Age AI Solutions. Fires on every
  message at load_order 0 — before all other skills. Scans /mnt/skills/user/,
  /mnt/skills/public/, connected MCPs, and available CLIs at session start to build
  a live capability map. Extracts intent signals from each message, reasons about
  the best capability match, identifies multi-step chains, checks ambiguity (max 2
  questions), and executes silently. No hardcoded tool names — adapts automatically
  as capabilities are added, removed, or renamed. Self-corrects on user redirection.
  Triggers: every message.
---

# SA-ORCHESTRATOR — Universal Capability Reasoning Engine
**Version:** 2.0.0 | **Class:** Meta-Skill | **Priority:** HIGHEST
**Surfaces:** Claude Code + Claude.ai Web — identical behavior on both

---

## CORE PRINCIPLE

This skill contains **no hardcoded tool names**. It is a reasoning engine.

On every message it:
1. Scans what's actually available right now
2. Reasons about the task against what it finds
3. Asks clarifying questions if the task is ambiguous
4. Routes to the best match and executes

When tools are added, removed, or renamed — this skill keeps working without edits.
The registry is always live. The reasoning is always fresh.

---

## STEP 0 — SCAN AVAILABLE CAPABILITIES (every session, once)

Before the first response in any session, build a live capability map:

### Skills
```
Scan in this order:
  /mnt/skills/user/          → user-installed skills (highest priority)
  /mnt/skills/public/        → public/format skills
  /mnt/skills/examples/      → example/utility skills (lowest priority)
  ~/.claude/skills/           → Claude Code local skills (if in CC mode)

For each skill found:
  Read the `description:` field from the SKILL.md frontmatter (first ~20 lines)
  Store: { skill_id, description, path, tier }
```

### MCPs
```
Read connected MCPs from session context (they appear as available tools).
For each MCP tool visible:
  Store: { mcp_name, tool_names[], inferred_purpose }
```

### CLIs
```
In Claude Code mode only — probe with `which`:
  Check for: ffmpeg, ffprobe, yt-dlp, node, npx, python3, git,
             playwright, rclone, curl, wget, ssh, docker
  Store only what's actually present on PATH
```

### Result: Live Capability Map
```
{
  skills: [ { id, description, path, tier } ... ],
  mcps:   [ { name, tools[], purpose } ... ],
  clis:   [ { name, path } ... ]
}
```

This map is built once per session and reused. It reflects reality —
whatever is actually installed at this moment, nothing more.

---

## STEP 1 — SIGNAL EXTRACTION (every message)

Parse the raw input for intent signals:

```
WHAT signals to extract:
  - URLs (note domain + path pattern)
  - File paths or extensions
  - Action verbs ("build", "generate", "fix", "analyze", "write", "deploy", "send")
  - Subject nouns ("site", "video", "image", "email", "form", "script", "doc")
  - Named entities (brand names, product names, people, platforms)
  - Modifiers ("cinematic", "fast", "production", "draft", "local", "automated")
  - Output format clues ("download", "file", "deploy", "export", "send")
  - Pipeline/stage signals ("brief", "outreach", "lead", "onboard", "launch")
  - Negations ("not X", "without Y", "skip Z")

WHAT NOT to do:
  - Don't pre-match to a specific skill yet
  - Don't assume — extract signals only
```

---

## STEP 2 — REASONING PASS

With the Live Capability Map and extracted signals, reason through the match:

```
FOR EACH capability in the map:

  Score it against the signals:
    - Does the skill/MCP description mention the subject?
    - Does it cover the action verb?
    - Does it handle the input type (URL / file / text)?
    - Does it produce the right output format?
    - Is it upstream or downstream in a logical chain?

  Ask internally:
    - Is there a skill whose description directly covers this task?
    - Is there an MCP that handles this action on this platform?
    - Is there a CLI that executes this operation?
    - Could multiple capabilities chain together to complete this?
    - Is this task fully handled by Claude's general knowledge (no tool needed)?

RANK the results:
  Tier 1 match:  skill/MCP description directly covers the task
  Tier 2 match:  skill/MCP covers part of the task (chain candidate)
  Tier 3 match:  tangentially related
  No match:      Claude general knowledge handles it

IDENTIFY chains:
  If the task requires multiple steps (A produces input for B),
  identify the full chain in sequence order.
  Fire chain steps automatically — don't wait for user confirmation between steps.
```

---

## STEP 3 — AMBIGUITY CHECK

Before executing, ask: **"Do I have enough information to route correctly?"**

```
EXECUTE IMMEDIATELY if:
  - One capability scores clearly higher than all others (>80% confidence)
  - The task is unambiguous — one reasonable interpretation exists
  - A chain is clear and all inputs are available

ASK FIRST if ANY of these are true:
  - Two or more capabilities score similarly and would produce different outputs
  - The task could mean different things (e.g. "make a video" could be
    prompt-writing, generation, editing, or analysis)
  - A required input is missing (e.g. "write the email" but no lead data provided)
  - The output destination is unclear and it matters
    (e.g. "save this" — to Drive? locally? as a file here?)

ASKING RULES:
  - Maximum 2 questions per ambiguity check
  - Ask only what's needed to route — not to gather all project details
  - Frame as options when possible: "Is this for X or Y?"
  - After getting answers, execute immediately — no further confirmation
  - Never ask questions that Claude can reasonably infer from context
```

---

## STEP 4 — EXECUTION

```
SURFACE DETECTION (first, every session):
  IF bash_tool is available AND /mnt/skills/ is readable:
    → Claude Code mode: CLIs executable, Python runnable, VPS accessible
  ELSE:
    → Claude.ai web mode: MCPs + tools only, bash sandboxed

EXECUTE the winning capability:
  - Load its SKILL.md fully before starting
  - Follow its instructions exactly
  - For chains: execute each step, passing output to the next
  - For MCPs: call the tool directly
  - For CLIs: run via bash_tool

WHEN a capability isn't available on the current surface:
  - Don't say "I can't do that"
  - Find the closest available equivalent
  - If no equivalent exists, generate the artifact (script, config, instructions)
    as a file output with deployment notes

SILENCE RULES:
  - Never announce "Loading skill X" or "Using MCP Y"
  - Never explain the routing decision before executing
  - Just execute and deliver the output
  - A brief footnote at the END is acceptable if it adds useful context
    e.g. *(analysis via sa-watch → built with cinematic-website-builder)*
```

---

## STEP 5 — SELF-CORRECTION LOOP

After delivering output, stay alert to correction signals:

```
IF user says something like:
  "that's not what I meant"
  "wrong tool"
  "I wanted X not Y"
  "use [different thing] instead"

THEN:
  1. Re-run signal extraction on the original message + correction
  2. Re-score the capability map with the new signal set
  3. Execute the correct match
  4. Do NOT apologize excessively — just re-route and deliver
```

---

## CHAIN DETECTION LOGIC

Some tasks are inherently multi-step. Detect chains by asking:

```
Does this task require:
  1. Extracting or gathering information first?
     → That step runs before the build/generate step

  2. A design or planning phase before production?
     → Design/planning skill runs first, output feeds production skill

  3. Content creation before distribution?
     → Create first, then distribute/send/deploy

  4. Analysis before action?
     → Analyze first, then act on findings

General chain pattern:
  [gather/extract] → [plan/design] → [build/generate] → [distribute/deploy]

When a chain is detected:
  - Execute all steps sequentially without asking for confirmation between steps
  - State the chain once at the start: "Running: [A] → [B] → [C]"
  - Then execute silently
```

---

## CONFLICT RESOLUTION

When two capabilities are genuinely tied:

```
Priority order (all else equal):
  1. User-installed skills (most specific to this operator's stack)
  2. Public/format skills (document/file handling)
  3. MCPs (platform-specific actions)
  4. CLIs (direct system execution)
  5. Claude general knowledge (no external tool)

Within the same tier:
  - More specific description wins over broader description
  - Upstream pipeline position wins (gather before build, design before code)
  - If still tied → ask ONE question to disambiguate
```

---

## WHAT THIS SKILL DOES NOT DO

- Does not maintain a static list of skill names
- Does not hardcode which skills exist
- Does not break when skills are added, removed, or renamed
- Does not require the user to know what tools exist
- Does not require any command syntax from the user
- Does not ask unnecessary questions when intent is clear
- Does not announce routing decisions before executing

---

## INSTALLATION

### Claude Code — add to top of `~/.claude/CLAUDE.md`

```markdown
## SA-ORCHESTRATOR — Active on every turn

Skill: /mnt/skills/user/sa-orchestrator/SKILL.md

On every message before responding:
- Scan available skills, MCPs, and CLIs to build a live capability map
- Extract intent signals from the input
- Reason about which capability or chain best matches the task
- Ask at most 2 clarifying questions if ambiguous, then execute
- Execute silently — no announcements, no menus
- Self-correct immediately if the user redirects

This runs on every turn. It is always active.
```

### Claude.ai Web — Skill install

Settings → Capabilities → Skills → `+` → upload this file.
Activates automatically. No configuration needed.

---

## METADATA

```yaml
skill_id: SA-ORCHESTRATOR
version: 2.0.0
class: meta-skill
priority: highest
load_order: 0
fires_on: every_message
execution: silent
conflict_resolution: auto_silent
hardcoded_tools: none
registry: dynamic_runtime_scan
surfaces:
  - claude_code
  - claude_ai_web
maintainability: zero — add/remove any tool, this skill stays current
```
