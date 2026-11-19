# Amazon Ads MCP Server — by SellerMate.AI

Connect Claude, ChatGPT, Cursor, or any MCP client to your **live Amazon Advertising
data** — and, with approval guardrails, let it act: negate wasted search terms, adjust
budgets and bids, launch campaigns.

**Remote server. One URL, both transports (streamable HTTP and SSE). No API keys.
Free on every plan.**

```
https://api.sellermate.ai/mcp/sse
```

- **Listed in Claude's connector directory** — one-click add, sign in, ask.
- **OAuth 2.1 + PKCE** — no keys to paste or rotate; account-level access control.
- **Read + write, policy-checked** — every write action passes your workspace guardrails
  (budget/bid floors and ceilings, change-multiplier caps, per-currency limits) and can
  require admin approval. Full audit trail.
- **Read-only by default. Zero data caching.**
- **No Amazon Ads API credentials required** — a free [SellerMate](https://www.sellermate.ai)
  account connected to your Amazon account is all you need.

Used by 2,000+ brands and agencies in 20+ countries · $1B+ ad spend optimized ·
2026 Amazon Ads Partner Awards — Technology Innovation Global Finalist.

---

## Quickstart

### Claude (claude.ai, free plan works)

1. Open Claude's connector directory and add **SellerMate**
   (or start from [sellermate.ai/product/mcp](https://www.sellermate.ai/product/mcp) →
   *Add to Claude*).
2. Sign in with your SellerMate account when prompted (secure OAuth — SellerMate never
   sees your Claude conversation, Claude never sees your credentials).
3. Ask: *"Which search terms wasted budget with zero orders in the last 30 days?"*

### Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, Gemini CLI

Add a remote MCP server with the URL:

```
https://api.sellermate.ai/mcp/sse
```

The client opens a browser window for the OAuth sign-in on first use. In Claude Code:

```bash
claude mcp add --transport sse sellermate https://api.sellermate.ai/mcp/sse
```

### ChatGPT

Add SellerMate as a **custom connector** using the same URL. (Connector support varies
by ChatGPT plan; see [the setup guide](https://www.sellermate.ai/product/mcp).)

Full walkthroughs per client: [docs/getting-started.md](docs/getting-started.md)

---

## What you can ask it

| You ask | It uses |
|---|---|
| "Why did ACOS jump last week?" | campaign / targeting / placement performance |
| "Which search terms burn budget with zero orders?" | `get_search_term_performance` |
| "Negate those" *(queued for approval)* | `add_negative_keywords` |
| "Shift budget to the winners" | `update_campaign` — policy-checked |
| "What's my true TACoS this month?" | retail + ads performance |
| "Launch a campaign for my new product" | `create_campaign` |
| "How do my Search Query Performance trends look?" | `get_sqp_report` |
| "Set up dayparting so we stop overspending at night" | `create_dayparting` |

The server exposes **50+ tools** across reporting, campaign management, targeting,
negatives, automations, dayparting, DSP, vendor/retail analytics, and account
organization. The complete reference: [docs/capabilities.md](docs/capabilities.md).

---

## Safe to hand to an AI

The AI proposes; **your policies decide**. Every write action is checked server-side
against workspace guardrails your admin controls — minimum/maximum budgets and bids,
change-multiplier caps relative to current values, per-currency floors. Sensitive
changes can require explicit admin approval before anything touches Amazon, and every
action lands in an audit log. The model cannot exceed the limits you set, because the
platform enforces them on every call — not the prompt.

Details: [docs/security.md](docs/security.md)

---

## How is this different from Amazon's official Ads MCP server?

Amazon's [Ads MCP server (open beta)](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta)
is a strong option **if you hold Amazon Ads API partner credentials** and are building
your own integration. SellerMate's MCP is built for sellers and agencies who want the
same conversational access **without developer setup, plus a managed guardrail layer**:

| | **SellerMate MCP** | **Amazon Ads MCP (open beta)** |
|---|---|---|
| Requirements | Free SellerMate account | Active Amazon Ads API partner credentials |
| Setup | One click from Claude's directory, or one URL | Developer OAuth (Login with Amazon) configuration |
| Write safety | Policy guardrails + approval queue + audit trail, enforced server-side | Bring your own guardrails |
| Data scope | Ads + Search Query Performance, retail, vendor & inventory context | Ads API surface (campaigns, reporting, account, billing) |
| Cost | Free (read/analysis); write actions on paid plan | Free API access for approved partners |

They also work side by side. Longer discussion:
[docs/vs-amazon-official-mcp.md](docs/vs-amazon-official-mcp.md)

---

## FAQ

**Is it really free?** Yes — connecting and analyzing your data is free, no credit card.
Write actions and SellerMate's purpose-built AI agent are on the paid plan.

**Do I need a paid Claude account?** No. Free Claude works.

**Is my data safe?** OAuth 2.1 + PKCE, zero caching, account-level access control,
read-only by default, full audit log. See [docs/security.md](docs/security.md).

**Which clients work?** Claude.ai, Claude Desktop, Claude Code, ChatGPT (custom
connector), Cursor, VS Code, Windsurf, Gemini CLI — anything that speaks MCP over
streamable HTTP or SSE; the endpoint serves both.

**Where does the data come from?** Your own Amazon Advertising account, connected to
SellerMate. Nothing is scraped; nothing is shared across accounts.

---

## Links

- Product page: <https://www.sellermate.ai/product/mcp>
- Get started free: <https://www.sellermate.ai>
- Model Context Protocol: <https://modelcontextprotocol.io>
- More servers on [Claude Market's MCP directory](https://www.claudemarket.ai/mcp)

*SellerMate.AI — AI-powered Amazon advertising automation. © Sellermate Technologies Pvt Ltd.*
