# Security & guardrails

Handing an AI write access to an advertising account is a trust decision. This page
says exactly what the SellerMate MCP server does and does not allow.

## Authentication

- **OAuth 2.1 with PKCE.** The MCP client redirects you to SellerMate's sign-in; the
  client receives a scoped token. There are no API keys to paste, store, or leak.
- **Account-level access control.** The token acts as *you*, inside *your* workspace,
  with your role's permissions — an analyst's token cannot do what it couldn't do in
  the dashboard.
- Your AI assistant never sees your SellerMate credentials, and SellerMate never sees
  your conversation — only the tool calls the assistant makes.

## Read path

- **Read-only by default.** A fresh connection can analyze; it cannot change anything
  until write actions are enabled on the plan and permitted by workspace policy.
- **Zero data caching.** Answers are produced from live account data at question time;
  the MCP layer does not retain copies.

## Write path — the platform enforces the limits, not the prompt

Every write action (budgets, bids, negatives, campaign changes) is checked server-side
against workspace policies your admin controls:

- minimum and maximum **budget** and **bid** values,
- **change-multiplier caps** relative to the current value (no 10× "typos"),
- **per-currency floors**.

A call that exceeds policy is rejected by the platform — regardless of what the model
asked for. Sensitive changes can additionally require **admin approval**: the action is
queued, a human approves or rejects it, and only then does anything touch Amazon.

## Audit

Every action — who asked, what changed, when — lands in a full audit trail
(`get_activity_log` exposes it to the AI itself, so you can literally ask "what did you
change yesterday?").

## Reporting a concern

Security contact and disclosure: <https://www.sellermate.ai> → contact. Please do not
open public issues for security reports.
