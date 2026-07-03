---
name: codebase-memory-mcp
description: codebase-memory-mcp, a local MCP server that turns a codebase into a persistent tree-sitter + LSP knowledge graph for fast structural queries (search, trace, impact analysis, dead-code detection). Use when deciding whether to add this MCP server for large/unfamiliar codebase work, or to explain what it does if it's already configured.
source: https://github.com/DeusData/codebase-memory-mcp
---

## Overview

A single static binary (zero dependencies, Rust/C-adjacent, no daemon beyond itself) that indexes a repository into a persistent knowledge graph — functions, classes, call chains, HTTP routes, cross-service links — using tree-sitter AST parsing across 158 languages, enhanced with real LSP-based type resolution for Python, TS/JS/JSX/TSX, PHP, C#, Go, C, C++, Java, Kotlin, Rust. Exposes 14 MCP tools (indexing, search, trace, architecture/impact analysis, Cypher graph queries, dead-code detection, ADR management). MIT license. All processing is local — per the README, code never leaves the machine.

The project backs its performance claims with a published preprint (arXiv:2603.27277): 83% answer quality, 10x fewer tokens, 2.1x fewer tool calls vs. file-by-file exploration across 31 real-world repos. Full-indexes the Linux kernel (28M LOC / 75K files) in ~3 minutes per the README; sub-millisecond structural queries after that.

**Where this fits in the Space Age stack:** this is infrastructure for *working on* codebases (yours or a client's), not something to deploy on the VPS — it runs locally alongside whatever coding agent is doing the work, similar in spirit to how `agent-reach` or `matts-peeker` extend agent capability rather than serving traffic.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
```

With the optional 3D graph visualization UI (browsable at `localhost:9749`):
```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

Or, inside an already-running Claude Code session, just ask it directly — the README documents this as a supported install path:
```
Install this MCP server: https://github.com/DeusData/codebase-memory-mcp
```

Pre-built signed/checksummed binaries exist for macOS (arm64/Intel), Linux (x86_64/ARM64), and Windows if the installer script isn't preferred — see the README's binary table.

## Enhancement: point it at the Space-Age-Skills and web-agent repos

Once installed, index both working repos so the agent's structural queries (impact analysis, dead-code detection, cross-file call tracing) are available across the whole Skills ecosystem, not just whatever single repo happens to be open:

```
index_repository → /path/to/Space-Age-Skills
index_repository → /path/to/web-agent
```

Auto-sync keeps the graph fresh after that per the README — no need to manually re-index after every edit.

## Gotchas (from source inspection)

- The README is explicit that this tool "writes to your agent configuration files" as part of normal operation — that's by design (registering itself as an MCP server), not a bug, but worth knowing before installing on a shared machine.
- Building from source needs a C and C++ compiler (`gcc`/`clang`, `g++`/`clang++`) — the pre-built binaries avoid that entirely; there's no reason to build from source unless auditing the code first.
- The Hybrid LSP layer (real type resolution, not just AST shape) only covers 11 of the 158 parsed languages — for everything else you still get tree-sitter structural data, just without cross-file type inference.
