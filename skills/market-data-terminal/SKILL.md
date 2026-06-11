---
name: market-data-terminal
description: Use when the user wants market data, economic indicators, news, or portfolio info pulled from a local Fincept Terminal instance via its MCP tool bridge — e.g. "what's the latest on X stock", "pull macro data for Y", "check my portfolio exposure".
---

# Market Data via Fincept Terminal MCP

## Overview

[Fincept-Corporation/FinceptTerminal](https://github.com/Fincept-Corporation/FinceptTerminal) is a Bloomberg-terminal-style desktop app (C++/Qt6) with 30+ data service modules (equities, crypto, economics, geopolitics, gov data, news, portfolio, options) and a built-in MCP server (`src/mcp/`) exposing these as tools to AI agents. This skill structures how to query it efficiently rather than guessing tool names.

## When to Use

- User asks for current market/financial/economic data and a Fincept Terminal MCP connection is configured
- "Check my portfolio" / "what's my exposure to X sector"
- News/geopolitical/macro queries that benefit from Fincept's aggregated data sources over a generic web search
- NOT for placing trades — Terminal has trading/algo modules, but this skill covers data retrieval only; trading actions need explicit separate authorization

## Core Pattern

Fincept's MCP layer (`McpProvider`, `ToolRetriever`, `SchemaValidator`) exposes tools per service domain (`services/markets`, `services/crypto`, `services/economics`, `services/geopolitics`, `services/portfolio`, `services/news`, etc.). The retriever pattern means: **discover available tools first** (`McpService` tool list), don't assume a fixed tool name — Fincept supports many data providers (akshare, dbnomics, databento) and which are configured varies per install.

## Quick Reference

| Need | Likely tool domain |
|---|---|
| Stock/equity quote, fundamentals | `services/equity`, `services/markets` |
| Crypto prices/derivatives | `services/crypto` |
| Macro/economic indicators | `services/economics`, `services/dbnomics` |
| News | `services/news` |
| Geopolitical risk | `services/geopolitics` |
| Government/official data | `services/gov_data` |
| Portfolio positions/exposure | `services/portfolio` |
| Options chain/analytics | `services/options`, `algo_engine/fno` |

## Implementation

```
1. List available MCP tools (via ToolRetriever / self-test) — confirm which data
   providers are actually configured for this install (akshare? databento? dbnomics?).
2. Match the user's request to the narrowest relevant tool domain from the table above.
3. Call the tool with explicit symbol/region/date-range parameters — Fincept's
   SchemaValidator will reject malformed calls, so check the tool's schema first
   if the call fails rather than guessing parameter names repeatedly.
4. For portfolio queries, confirm which workspace/account is active before reporting
   numbers — Fincept supports multiple workspaces (src/storage/workspace).
```

## Common Mistakes

- **Assuming a specific data provider is wired up** — Fincept supports many (akshare, databento, dbnomics, polymarket); check what's actually configured before saying "no data available".
- **Guessing tool/parameter names** — use the schema/self-test (`ToolSelfTest`, `SchemaValidator`) to confirm exact names rather than retrying variants.
- **Conflating "data terminal" with "trading terminal"** — `services/algo_trading` and `trading/brokers` exist for execution; don't invoke them for a data-lookup request.
- **Reporting portfolio numbers without confirming active workspace** — multi-workspace support means stale/wrong-account data is easy to surface accidentally.
