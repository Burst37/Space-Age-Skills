# Graph Report - .  (2026-06-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 217 nodes · 261 edges · 26 communities (18 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c320336`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `run()` - 12 edges
3. `Space Age Agent OS` - 11 edges
4. `appendJournalEntry()` - 7 edges
5. `appendDailyLog()` - 7 edges
6. `config` - 6 edges
7. `vaultPath()` - 6 edges
8. `appendToVault()` - 6 edges
9. `todayISO()` - 5 edges
10. `readJournal()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `appendJournalEntry()`  [EXTRACTED]
  src/app/api/journal/route.ts → src/lib/vaultWriter.ts
- `GET()` --calls--> `run()`  [EXTRACTED]
  src/app/api/pipeline-status/route.ts → src/lib/runner.ts
- `GET()` --calls--> `run()`  [EXTRACTED]
  src/app/api/vitals/route.ts → src/lib/runner.ts
- `appendDailyLog()` --calls--> `run()`  [EXTRACTED]
  src/lib/vaultWriter.ts → src/lib/runner.ts
- `appendJournalEntry()` --calls--> `run()`  [EXTRACTED]
  src/lib/vaultWriter.ts → src/lib/runner.ts

## Import Cycles
- None detected.

## Communities (26 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (17): POST(), createProject(), ensureDir(), getRenderJob(), listProjects(), listRenderJobs(), PROJECTS_DIR, readRenderLog() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (11): ApiAgentId, config, expandHome(), findVault(), ApiRunResult, runApiAgent(), run(), RunResult (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): devDependencies, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @types/ssh2, @types/three (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (18): dependencies, cmdk, framer-motion, highlight.js, lucide-react, @modelcontextprotocol/sdk, next, react (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (6): Agent, AGENT_META, ALL_AGENTS, API_AGENTS, CLI_AGENTS, Msg

### Community 6 - "Community 6"
Cohesion: 0.38
Nodes (11): GET(), POST(), appendDailyLog(), appendJournalEntry(), appendToVault(), ensureDir(), listJournalDays(), readJournal() (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (11): Agent Routing, Caveman Mode, Design System, Environment Variables, Image Model Routing, Quick Start, Routes, Space Age Agent OS (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (4): AGENTS, fadeUp, QUICK, stagger

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (3): metadata, AGENT_COLORS, NAV

## Knowledge Gaps
- **92 isolated node(s):** `install-agent-os.sh script`, `nextConfig`, `name`, `version`, `private` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `install-agent-os.sh script`, `nextConfig`, `name` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
