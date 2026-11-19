---
name: sellermate-amazon-ads-mcp
description: >
  Connect to and use SellerMate's remote Amazon Ads MCP server (https://api.sellermate.ai/mcp/sse):
  50+ tools for Amazon Advertising reporting, campaigns, targeting, negatives, automations and
  dayparting, with server-side write guardrails. Trigger on: "SellerMate", "Amazon Ads MCP",
  "Amazon PPC", "ACOS", "wasted search terms", "negate search terms", "TACoS", "dayparting",
  "Sponsored Products", "Search Query Performance", or any request to analyze or change an
  Amazon Advertising account through an MCP client.
allowed-tools: Read, Grep, Glob, Bash
---

# SellerMate Amazon Ads MCP

Source: github.com/SellerMate-AI/amazon-ads-mcp (docs-only repo; the server itself is hosted, not open source).
Vendored copy: `reference/` (README, server.json, docs/, examples/). Cloned 2026-10-20.

## Connect
- URL: `https://api.sellermate.ai/mcp/sse` (serves streamable HTTP and SSE)
- Auth: OAuth 2.1 + PKCE in the client's browser flow. No API keys. Never ask the user for tokens.
- Claude Code: `claude mcp add --transport sse sellermate https://api.sellermate.ai/mcp/sse`
- Needs a free SellerMate account linked to the Amazon Ads account. Reads are free; writes need a paid plan.
- Cloud sandbox: the egress proxy blocks `api.sellermate.ai` (403) unless allowlisted. Connect from a local client instead.

## Operating rules
1. Call `get_sellermate_capabilities`, `get_user_context` and `resolve_account` first to confirm account and workspace.
2. Read before write. Pull `get_search_term_performance` / `get_campaign_performance` and show the numbers before proposing changes.
3. Writes (`update_campaign`, `add_negative_keywords`, `create_campaign`, `add_targets`, ...) are policy-checked and may queue for admin approval. Tell the user when an action is queued, not applied.
4. Confirm each write with the user before calling it. The live tool list is authoritative over `reference/docs/capabilities.md`.
5. Use `get_activity_log` to answer "what changed".

## Tool groups (51 at 2026-09-03)
Performance/reporting, campaigns, targeting and negatives, automations and dayparting, account/org. Full table: `reference/docs/capabilities.md`. Example prompts: `reference/examples/prompts.md`. Guardrails: `reference/docs/security.md`.

## Notes
- Zero data caching; read-only by default.
- Compared with Amazon's official Ads MCP: see `reference/docs/vs-amazon-official-mcp.md`.
