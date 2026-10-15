---  
name: sa-graphify-operator  
description: >  
 Master knowledge-graph operator for Space Age AI Solutions using Graphify v8.  
 Converts any codebase, docs, PDFs, images, videos, or mixed-corpus project into  
 a queryable knowledge graph — outputting graph.html (interactive), GRAPH_REPORT.md  
 (god nodes, surprises, suggested questions), and graph.json (persistent query store).  
 TRIGGER IMMEDIATELY on any of: `/graphify`, "build the graph", "map this codebase",  
 "knowledge graph", "graphify this", "graph my project", "query the graph", "what  
 connects X to Y", "explain this node", "PR impact", "graph diff", "callflow diagram",  
 "graph report", "god nodes", or when the user pastes a directory/repo path alongside  
 any intent to understand structure or connections. Also trigger when user asks to  
 install graphify, set up graphify on Hermes/Claude Code/Antigravity, run graphify  
 in CI, or do headless extraction. This is the SA-standard tool for all codebase  
 intelligence — load it before attempting any architecture analysis or dependency  
 research on any Space Age project.  
---  
  
# SA Graphify Operator  
  
> **Platform**: `graphifyy` (PyPI) — CLI is `graphify`, package name has double-y   
> **SA Deployment**: DigitalOcean VPS 146.190.78.120 · Hermes Agent · Claude Code   
> **Version target**: v8 (active dev branch)  
  
---  
  
## Quick-Start (3-command path)  
  
```bash  
# 1. Install  
uv tool install graphifyy  
  
# 2. Register with your agent  
graphify install # Claude Code (Linux/Mac)  
graphify install --platform hermes # Hermes Agent on VPS  
graphify install --platform antigravity # Google Antigravity  
graphify install --platform codex # OpenAI Codex  
  
# 3. Run  
/graphify .  
```  
  
Output lands in `graphify-out/`:  
```  
graphify-out/  
├── graph.html ← open in browser — click/filter/search nodes  
├── GRAPH_REPORT.md ← god nodes, surprising connections, suggested questions  
└── graph.json ← full persistent graph — query without re-reading files  
```  
  
---  
  
## SA Install Matrix  
  
| Platform | Install Command |  
|---|---|  
| Claude Code (Linux/Mac) | `graphify install` |  
| Claude Code (Windows) | `graphify install --platform windows` |  
| **Hermes (VPS)** | `graphify install --platform hermes` |  
| **Google Antigravity** | `graphify antigravity install` |  
| Codex | `graphify install --platform codex` |  
| OpenCode | `graphify install --platform opencode` |  
| Gemini CLI | `graphify gemini install` |  
| Cursor | `graphify cursor install` |  
| Aider | `graphify install --platform aider` |  
| VS Code Copilot Chat | `graphify vscode install` |  
  
**Project-scoped install** (commit to repo):  
```bash  
graphify install --project  
graphify install --project --platform codex  
```  
  
---  
  
## Three-Pass Pipeline  
  
```  
detect() → extract() → build_graph() → cluster() → analyze() → report() → export()  
```  
  
| Pass | What happens | API cost? |  
|---|---|---|  
| **Pass 1** — Code (33 langs) | Tree-sitter AST — classes, functions, calls, imports | **Free. Local only.** |  
| **Pass 2** — Video/Audio | faster-whisper transcription, seeded with god nodes | **Free. Local only.** |  
| **Pass 3** — Docs/PDFs/Images | LLM subagents extract semantic nodes + edges | **Costs tokens (one-time)** |  
  
> Re-runs skip unchanged files via SHA256 cache. Only modified files re-extract.  
  
---  
  
## SA Backend Routing  
  
Route headless extraction (`graphify extract`) to SA API keys, loaded from your own
`.env` — never hardcode a key value in this file or any committed doc:  
  
```bash  
# DeepSeek (primary — cheapest at scale)  
DEEPSEEK_API_KEY=$(grep DEEPSEEK_API_KEY ~/.env | cut -d= -f2) \\  
 graphify extract ./src --backend deepseek  
  
# Gemini (free tier — use for large doc corpora)  
GEMINI_API_KEY=$(grep GEMINI_API_KEY ~/.env | cut -d= -f2) \\  
 graphify extract ./docs --backend gemini  
  
# Claude (Anthropic — highest quality semantic extraction)  
ANTHROPIC_API_KEY=\<from .env> graphify extract ./corpus --backend claude  
  
# OpenRouter (model flexibility)  
OPENAI_API_KEY=$(grep OPENAI_API_KEY ~/.env | cut -d= -f2) \\  
 OPENAI_BASE_URL=https://openrouter.ai/api/v1 \\  
 graphify extract ./corpus --backend openai  
  
# Claude Code CLI (no key needed — uses Claude subscription)  
graphify extract ./corpus --backend claude-cli  
```  
  
**VPS .env** stores all keys — load with `source ~/.env` before running headless CI.  
  
---  
  
## Common Commands  
  
### Build & Update  
```bash  
/graphify . # build full graph for current dir  
/graphify ./src --update # re-extract only changed files (fast)  
/graphify . --cluster-only # rerun clustering, skip re-extraction  
/graphify . --no-viz # report + JSON only, skip HTML (CI-friendly)  
/graphify . --mode deep # aggressive extraction — more edges, more tokens  
/graphify . --wiki # build markdown wiki navigable by agent  
/graphify . --obsidian # generate Obsidian vault from graph  
graphify export callflow-html # Mermaid architecture/call-flow HTML diagram  
```  
  
### Query  
```bash  
/graphify query "what connects auth to the database?"  
/graphify query "show the payment flow" --dfs --budget 1500  
/graphify path "UserService" "DatabasePool"  
/graphify explain "RateLimiter"  
```  
  
### Ingest External Content  
```bash  
/graphify add https://arxiv.org/abs/1706.03762 # add a paper  
/graphify add \<youtube-url> # transcribe + add video  
/graphify add https://... --author "Name"  
```  
  
### Git Integration  
```bash  
graphify hook install # auto-rebuild on every commit (AST only, free)  
graphify hook status  
graphify merge-graphs a.json b.json --out merged.json  
graphify clone https://github.com/\<org>/\<repo>  
```  
  
### PR Intelligence  
```bash  
graphify prs # PR dashboard: CI, review status, graph impact  
graphify prs 42 # deep dive on PR #42  
graphify prs --triage # AI ranks review queue  
graphify prs --conflicts # PRs sharing communities (merge-order risk)  
```  
  
### MCP Server Mode  
```bash  
# Expose graph as MCP tool-callable server  
python -m graphify.serve graphify-out/graph.json  
  
# Register with Hermes Agent  
# Add to Hermes MCP config:  
{  
 "type": "stdio",  
 "command": "python",  
 "args": ["-m", "graphify.serve", "graphify-out/graph.json"]  
}  
```  
  
MCP tools exposed: `query_graph`, `get_node`, `get_neighbors`, `shortest_path`,  
`list_prs`, `get_pr_impact`, `triage_prs`  
  
---  
  
## SA Lead-Gen Pipeline Usage  
  
When graphifying a **generated cinematic site** before outreach:  
  
```bash  
# Map site source before build  
/graphify ./sites/acme-plumbing --update --no-viz  
  
# Query to verify structure  
/graphify query "what components need SEO schema?"  
/graphify query "which sections have no contact CTA?"  
```  
  
When building **multi-site agent swarm** (5-agent parallel):  
- Each swarm agent runs `graphify install --project` in its site directory  
- Agent reads `GRAPH_REPORT.md` before touching any file  
- After build: `graphify hook install` so git commits keep graph live  
  
---  
  
## Graph Output Schema  
  
**Node attributes:**  
```json  
{  
 "id": "unique_string",  
 "label": "human name",  
 "file_type": "code|document|paper|image|rationale",  
 "source_file": "path/to/file.py",  
 "source_location": "L42",  
 "community": 3  
}  
```  
  
**Edge attributes:**  
```json  
{  
 "source": "id_a",  
 "target": "id_b",  
 "relation": "calls|imports|uses|implements|semantically_similar_to|...",  
 "confidence": "EXTRACTED|INFERRED|AMBIGUOUS",  
 "confidence_score": 0.85  
}  
```  
  
**Confidence rubric:**  
  
| Label | Meaning | Score |  
|---|---|---|  
| `EXTRACTED` | Explicit in source (import, function call) | 1.0 |  
| `INFERRED` | Reasonable deduction | 0.55–0.95 |  
| `AMBIGUOUS` | Uncertain — flagged for review | N/A |  
  
---  
  
## File Type Coverage  
  
| Category | Extensions |  
|---|---|  
| **Code** (33 langs) | `.py .ts .js .jsx .tsx .go .rs .java .c .cpp .rb .cs .kt .swift .php .lua .zig .sql .sh .vue .svelte .astro .dart` + more |  
| **MCP configs** | `.mcp.json` `claude_desktop_config.json` — extracts server nodes, env requirements |  
| **Docs** | `.md .mdx .html .txt .rst .yaml .yml` |  
| **Office** | `.docx .xlsx` (requires `pip install graphifyy[office]`) |  
| **PDFs** | `.pdf` (requires `pip install graphifyy[pdf]`) |  
| **Images** | `.png .jpg .webp .gif` |  
| **Video/Audio** | `.mp4 .mov .mp3 .wav` (requires `pip install graphifyy[video]`) |  
| **YouTube/URLs** | Any video URL (requires `[video]` extra) |  
| **Google Workspace** | `.gdoc .gsheet .gslides` (requires `gws auth` + `--google-workspace`) |  
  
---  
  
## SA Optional Extras  
  
Install only what the pipeline needs:  
  
```bash  
pip install "graphifyy[pdf,office,video,mcp,openai,gemini]" # SA-standard install  
pip install "graphifyy[all]" # everything  
```  
  
| Extra | Adds |  
|---|---|  
| `pdf` | PDF extraction |  
| `office` | .docx / .xlsx |  
| `video` | Video transcription (faster-whisper + yt-dlp) |  
| `mcp` | MCP stdio server |  
| `openai` | OpenAI/OpenRouter compatible APIs |  
| `gemini` | Google Gemini API |  
| `sql` | SQL schema extraction |  
| `neo4j` | Neo4j push support |  
| `leiden` | Leiden community detection (Python \< 3.13) |  
  
---  
  
## CI / Headless Extraction (VPS)  
  
```bash  
# Full headless build on VPS with DeepSeek  
DEEPSEEK_API_KEY=$(grep DEEPSEEK_API_KEY ~/.env | cut -d= -f2) \\  
 graphify extract ./project --backend deepseek --max-workers 4 --no-cluster  
  
# Gemini free-tier for doc-heavy corpora (no cost)  
GEMINI_API_KEY=$(grep GEMINI_API_KEY ~/.env | cut -d= -f2) \\  
 graphify extract ./docs --backend gemini --mode deep  
  
# After extraction, rerun clustering separately (free)  
graphify cluster-only ./project --resolution 1.5  
```  
  
**CI integration** (GitHub Actions / VPS cron):  
```yaml  
- name: Graphify build  
 run: |  
 uv tool install graphifyy  
 graphify extract . --backend deepseek --no-viz  
 graphify export callflow-html  
```  
  
---  
  
## Environment Variables  
  
| Variable | Purpose | SA Value |  
|---|---|---|  
| `DEEPSEEK_API_KEY` | DeepSeek backend | In VPS `.env` — never hardcode |  
| `ANTHROPIC_API_KEY` | Claude backend | In VPS `.env` — never hardcode |  
| `GEMINI_API_KEY` | Gemini free tier | In VPS `.env` — never hardcode |  
| `OPENAI_API_KEY` | OpenRouter/OpenAI | In VPS `.env` — never hardcode |  
| `GRAPHIFY_MAX_WORKERS` | AST parallelism | `2` on local (N6000 limit) · `8` on VPS |  
| `GRAPHIFY_MAX_OUTPUT_TOKENS` | Output cap for dense files | `32768` for large corpora |  
| `GRAPHIFY_API_TIMEOUT` | HTTP timeout (default 600s) | `900` for VPS local models |  
| `GRAPHIFY_FORCE` | Force rebuild even if fewer nodes | Set after refactors |  
| `GRAPHIFY_OUT` | Override output dir | Useful for worktrees |  
| `GRAPHIFY_TRIAGE_BACKEND` | Backend for PR triage | `deepseek` |  
  
---  
  
## Troubleshooting  
  
| Problem | Fix |  
|---|---|  
| `graphify: command not found` | Use `uv tool install graphifyy` or `pipx install graphifyy` |  
| PowerShell path error (`/graphify`) | Use `graphify .` without leading slash on Windows |  
| Fewer nodes after `--update` | Run with `--force` to overwrite |  
| Ghost duplicate nodes | `graphify extract . --force` |  
| `graph.json` conflict markers | `graphify hook install` — auto-merges on conflict |  
| Empty nodes for docs/PDFs | Check API key: `ANTHROPIC_API_KEY=sk-... graphify extract ./docs --backend claude` |  
| Skill version mismatch | `uv tool upgrade graphifyy && graphify install` |  
| Ollama VRAM exceeded | `GRAPHIFY_OLLAMA_NUM_CTX=8192 graphify extract . --backend ollama --token-budget 4000` |  
| Graph HTML too large (>5000 nodes) | `graphify cluster-only . --no-viz` then `graphify query "..."` |  
  
---  
  
## Global Cross-Project Graph  
  
Combine multiple SA project graphs into one:  
  
```bash  
graphify global add graphify-out/graph.json sa-pipeline  
graphify global add ../wysiwyg/graphify-out/graph.json wysiwyg-eyewear  
graphify global add ../theotherlevel/graphify-out/graph.json theotherlevel  
graphify global list  
graphify global path # prints path to ~/.graphify/global.json  
```  
  
Query across all projects:  
```bash  
graphify query "what components are shared across SA sub-brands?" \\  
 --graph ~/.graphify/global.json  
```  
  
---  
  
## GRAPH_REPORT.md Contents  
  
After every build, read `GRAPH_REPORT.md` for:  
  
- **God nodes** — most-connected concepts. Everything flows through these.  
- **Surprising connections** — cross-file/cross-community links ranked by surprise score  
 (`AMBIGUOUS > INFERRED > EXTRACTED`, cross-type bonus, peripheral→hub bonus)  
- **Suggested questions** — 4–7 questions the graph is uniquely positioned to answer  
 (derived from AMBIGUOUS edges, bridge nodes, underexplored god nodes, isolated nodes)  
- **Confidence tags** — every inferred relationship marked `EXTRACTED`, `INFERRED`, or  
 `AMBIGUOUS`; you always know what was found vs guessed  
  
**Rule**: Before answering architecture or codebase questions in any session,  
read `graphify-out/GRAPH_REPORT.md` first. If `graphify-out/wiki/index.md` exists,  
navigate it instead of reading raw files.  
  
---  
  
## SA Superpowers Enhancements  
  
These are Space Age extensions beyond the stock graphify v8 behavior:  
  
### 1. Swarm-Aware Build Orchestration  
When running the 5-agent site build swarm, each agent should:  
1. `graphify install --project` in its site directory  
2. Build → `graphify update . --no-cluster` (AST only, free, fast)  
3. Claude orchestrator runs `graphify merge-graphs` across all 5 site graphs  
4. Query merged graph: `graphify query "which site is missing contact schema?"`  
  
### 2. Lead-Gen Intelligence Layer  
Before generating a site for a scraped lead:  
```bash  
/graphify ./leads/acme-landscaping --mode deep  
/graphify query "what local SEO keywords appear in this business's existing content?"  
/graphify query "what services does this business offer?"  
```  
Feed `GRAPH_REPORT.md` into `lead-to-brief` skill for richer Build Brief.  
  
### 3. Callflow HTML for Client Deliverables  
```bash  
graphify export callflow-html --output docs/site-architecture.html  
```  
Deliver alongside cinematic site as architecture documentation — premium upsell.  
  
### 4. Skill Library Graph  
Map the entire Space Age skill library:  
```bash  
/graphify /mnt/skills/user --no-viz --mode deep  
/graphify query "which skills have overlapping workflows?"  
/graphify query "what is the dependency chain for a full website build?"  
```  
  
### 5. VPS Auto-Update Hook  
After `graphify hook install` on VPS repos, every Hermes Agent git commit  
auto-rebuilds the AST graph (zero API cost). Keeps architecture intelligence live  
24/7 without manual intervention.  
  
---  
  
## Uninstall  
  
```bash  
graphify uninstall # remove from all platforms  
graphify uninstall --purge # also delete graphify-out/  
graphify claude uninstall # per-platform removal  
```  
  
---  
  
## Reference  
  
- [How it works — pipeline detail](https://github.com/safishamsi/graphify/blob/v8/docs/how-it-works.md)  
- [Architecture module breakdown](https://github.com/safishamsi/graphify/blob/v8/ARCHITECTURE.md)  
- [Docker MCP + SQLite integration](https://github.com/safishamsi/graphify/blob/v8/docs/docker-mcp-sqlite.md)  
- [PyPI package](https://pypi.org/project/graphifyy/)  
- [Full changelog](https://github.com/safishamsi/graphify/blob/v8/CHANGELOG.md)  
