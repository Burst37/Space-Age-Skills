---
name: tradingview-mcp
version: 1.0.0
description: Codex-facing operating skill for the uploaded TradingView MCP package. Use to connect compatible agents to TradingView-oriented market-data/chart workflows through MCP when configured and authorized.
---
# TradingView MCP — Codex Skill

## Source compatibility
The uploaded repository includes Codex-specific MCP/plugin configuration. Treat the MCP server as an external capability that must be installed/configured separately; this skill does not imply the server is currently running.

## Workflow
1. Confirm MCP server configuration and required environment variables.
2. Use read/data operations before any stateful action.
3. Define symbol, timeframe, market, indicators, and desired output explicitly.
4. Validate returned timestamps and instrument identity.
5. Separate observed market data from model interpretation.
6. Never claim live/current data unless the connected tool confirms it.
7. Keep credentials out of skill files and logs.

## Output
Return instrument, timeframe, data timestamp, observations, interpretation, and any missing/failed MCP capability.
