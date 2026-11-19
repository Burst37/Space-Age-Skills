# Getting started

One server, one URL, OAuth sign-in. No API keys anywhere. The endpoint serves both
MCP transports — streamable HTTP and SSE — so use whichever your client prefers.

```
https://api.sellermate.ai/mcp/sse
```

Prerequisite for every client: a SellerMate account (free — no credit card) with your
Amazon Advertising account connected. Create one at <https://www.sellermate.ai>.

## Claude (claude.ai — free plan works)

1. In Claude, open **Settings → Connectors** (or click **Add to Claude** on
   [sellermate.ai/product/mcp](https://www.sellermate.ai/product/mcp)) and add
   **SellerMate** from the directory.
2. Approve the OAuth sign-in with your SellerMate account.
3. New chat → ask about your account:
   > Which of my campaigns had the highest ACOS last week, and why?

## Claude Desktop

Settings → Connectors → add custom connector → paste the URL above. First tool call
opens the browser for OAuth.

## Claude Code

```bash
claude mcp add --transport sse sellermate https://api.sellermate.ai/mcp/sse
```

## Cursor / VS Code / Windsurf

Add a remote MCP server in the editor's MCP settings with the URL above. Example
(Cursor `mcp.json`):

```json
{
  "mcpServers": {
    "sellermate": { "url": "https://api.sellermate.ai/mcp/sse" }
  }
}
```

## ChatGPT

Add a **custom connector** with the same URL. Connector availability varies by ChatGPT
plan — see the current notes on
[sellermate.ai/product/mcp](https://www.sellermate.ai/product/mcp).

## Gemini CLI

Register the URL as a remote MCP server per the CLI's MCP configuration.

## First questions to try

- Which search terms spent money with zero orders in the last 30 days?
- Why did ACOS jump last week — which campaigns drove it?
- What's my true TACoS this month?
- Which keywords should I negate? *(then: "queue them for approval")*
- Which campaigns win top-of-search placement, and at what cost?

## Troubleshooting

- **The client can't connect** — confirm the URL is exactly
  `https://api.sellermate.ai/mcp/sse` (no trailing slash). The endpoint accepts both
  streamable HTTP and SSE; if one transport misbehaves in your client, try the other.
- **OAuth window doesn't appear** — some clients only trigger sign-in on the first tool
  call; ask a question about your account.
- **"No account found"** — your SellerMate workspace has no Amazon account connected
  yet; finish onboarding at <https://www.sellermate.ai> first.
