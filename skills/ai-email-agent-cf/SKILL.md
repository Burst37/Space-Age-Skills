---
name: ai-email-agent-cf
description: Use when the user wants to read, search, summarize, or draft replies to email through their Agentic Inbox (Cloudflare Workers email client) MCP server — e.g. "check my inbox for X", "draft a reply to the email from Y", "summarize unread emails about Z". Never sends an email without explicit per-message confirmation.
---

# AI Email Agent (Agentic Inbox / Cloudflare)

## Overview

[cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) is a self-hosted email client on Cloudflare Workers (Durable Objects + R2 + Workers AI) with a built-in 9-tool email agent and an MCP server at `/mcp`. The README explicitly flags that **any user passing the shared Cloudflare Access policy can operate on ANY mailbox** via the MCP server by passing a `mailboxId` — there's no per-mailbox authorization. The repo's own auto-draft feature already requires explicit confirmation before sending; this skill generalizes that to a hard rule for ALL agent actions, and adds a mailbox-scoping check at the start of every session.

## When to Use

- "Check my email for X" / "what's in my inbox about Y"
- "Draft a reply to [email]" — drafting is fine without per-action confirmation
- "Summarize unread/recent emails"
- NOT for sending emails without the user reviewing the exact draft first — drafting and sending are separate steps, always
- NOT for operating on a mailbox other than the one the user specified — confirm `mailboxId` explicitly if more than one mailbox exists

## Core Pattern

1. **Mailbox scoping check** (new, first step every session): if the deployment has multiple mailboxes, confirm which `mailboxId` the user means before calling any tool — the MCP server will happily operate on any mailbox it's pointed at, so an ambiguous request could read/draft in the wrong inbox.
2. **Read/search freely** — listing, searching, summarizing emails is safe and doesn't need per-action confirmation.
3. **Draft, never send, autonomously** — when asked to "reply to X", produce a draft and show it to the user verbatim. Sending requires the user's explicit go-ahead on THAT specific draft (matches the repo's own auto-draft design intent, made into a hard rule here).

## Quick Reference

| Task | Tool category | Confirmation needed? |
|---|---|---|
| List/search emails | read tools | No |
| Summarize thread/inbox | read tools | No |
| Draft a reply | draft tool | No (but show draft to user) |
| Send email / send drafted reply | send tool | YES — always, per-message |
| Operate on a specific mailbox | any (mailboxId param) | Confirm mailboxId if >1 mailbox exists |

## Implementation

```
1. At session start, if context doesn't make the mailbox unambiguous, ask which
   mailbox (mailboxId) to operate on.
2. For read/search/summarize requests: call the relevant MCP tools directly,
   no confirmation needed.
3. For "draft a reply" requests: generate the draft text, present it in full to
   the user, and stop — do not call the send tool yet.
4. Only call the send tool after the user has seen the exact draft (subject,
   body, recipients) and explicitly approves THIS send.
5. If the user says "always send drafts without asking" — note that this is a
   standing preference but still show the final draft text in the response so
   there's a record of what was sent.
```

## Common Mistakes

- **Sending a "drafted" reply automatically** because the user asked to "reply to X" — "reply" is ambiguous between draft and send; default to draft + show + confirm.
- **Operating on the wrong mailbox** in a multi-mailbox deployment — the MCP server has no per-mailbox auth, so a wrong `mailboxId` silently succeeds against the wrong inbox.
- **Treating "auto-draft on new email" as license for auto-send** — the repo's own design requires explicit confirmation before sending; this skill makes that universal for all agent-driven sends.
- **Forgetting attachments/CC/BCC in the shown draft** — the user needs to see the FULL outgoing message (recipients, subject, body, attachments) before approving a send, not just the body text.

## Attribution

Forked from [cloudflare/agentic-inbox](https://github.com/cloudflare/agentic-inbox) (MCP server + email agent design). Original already requires confirmation for its own auto-draft feature and flags the mailbox-isolation caveat in its README; this skill makes both a hard rule for all agent-driven actions and adds the upfront mailbox-scoping check.
