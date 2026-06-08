---
name: gemini-cli
description: Operate Google's Gemini CLI as a terminal AI agent. Use for long-context tasks, Google ecosystem integrations, and as an alternative reasoning engine.
allowed-tools: Bash
---

# GEMINI CLI
## Space Age AI Solutions — Gemini Terminal Agent

## When to load this skill

- User asks to use Gemini or Google AI
- Task requires 1M+ token context window
- Google Workspace integration needed (Docs, Sheets, Gmail)
- Parallel processing with a different AI model
- Claude Code Router has directed task to Gemini

---

## GEMINI CLI BASICS

```bash
# Start interactive session
gemini

# Single prompt
gemini -p "[prompt]"

# With file context
gemini -p "[prompt]" < file.txt

# Pipe output
cat large_file.txt | gemini -p "Summarize this"

# Model selection
gemini -m gemini-2.0-flash -p "[prompt]"
gemini -m gemini-2.5-pro -p "[prompt]"
```

---

## CONTEXT WINDOW ADVANTAGE

Use Gemini CLI when:
- File or codebase exceeds Claude's context
- Need to analyze entire repositories at once
- Processing very long transcripts, documents, or logs
- Comparing multiple large files simultaneously

```bash
# Send entire codebase
find . -name "*.py" | xargs cat | gemini -p "Review this codebase for security issues"

# Large document analysis
cat massive_document.pdf | gemini -p "Extract all action items and deadlines"
```

---

## GOOGLE ECOSYSTEM TASKS

Gemini CLI has native Google integration for:
- Google Drive file access
- Google Docs reading/writing
- Gmail analysis
- Google Sheets data processing
- YouTube transcript analysis

---

## PARALLEL OPERATION WITH CLAUDE

Run Gemini in parallel when:
- Need second opinion on critical decisions
- Different models have complementary strengths
- Speed matters (dispatch both, use faster result)

```bash
# Run Gemini in background
gemini -p "[task A]" &
# Continue Claude Code work on task B
# Collect Gemini result when done
wait
```

---

## WHAT TO AVOID

- Don't use Gemini CLI without confirming it's installed (`which gemini`)
- Don't send sensitive credentials through CLI
- Don't use for tasks requiring Space Age MCP tools (use Claude Code for those)
