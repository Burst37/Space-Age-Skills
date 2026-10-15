# CLI-Anything catalog (snapshot)

Snapshot of the CLI-Anything registries taken 2026-08-27. **The live catalog is
authoritative** — always confirm with `cli-hub list` / `cli-hub search <term>`
before telling anyone a harness does or does not exist. New harnesses land weekly.

Install any of these with `cli-hub install <name>`; the entry point is
`cli-anything-<name>`, and each ships a `SKILL.md` an agent can read.

## Harness CLIs (79)

Built by the CLI-Anything project — purpose-made agent harnesses.

### 3d (3)

- **`blender`** — Blender. 3D modeling, animation, and rendering via blender --background --python
- **`freecad`** — FreeCAD. Parametric 3D CAD modeling via FreeCAD CLI (258 commands: Part, Sketcher, PartDesign, Assembly, Mesh, TechDraw, Draft, FEM, CAM, and more)
- **`meerk40t`** — MeerK40t. Laser cutting/engraving via the real MeerK40t kernel — elements, operations, SVG/G-code export with placement guard, and real GRBL hardware control (detect, preflight check, jog, frame) with machine profiles and --json output

### ai (8)

- **`comfyui`** — ComfyUI. AI image generation workflow management via ComfyUI REST API
- **`dify-workflow`** — Dify Workflow. CLI-Anything wrapper for the Dify workflow DSL editor covering create, inspect, validate, edit, export, and layout operations
- **`magnific`** — Magnific. Agent-native CLI harness for Magnific's remote MCP media-generation server — generate and upscale images and video via mcpc OAuth without loading the full MCP schema each turn
- **`minimax`** — MiniMax. Chat and TTS via MiniMax AI API — MiniMax-M3 and MiniMax-M2.7 chat models and speech-2.x TTS
- **`notebooklm`** — NotebookLM. Experimental NotebookLM harness scaffold wrapping the installed notebooklm CLI for notebook, source, chat, artifact, download, and sharing workflows
- **`novita`** — Novita. Access AI models via Novita's OpenAI-compatible API (DeepSeek, GLM, MiniMax)
- **`ollama`** — Ollama. Local LLM inference and model management via Ollama REST API
- **`openwebui`** — OpenWebUI. Operate a running OpenWebUI backend through an agent-friendly CLI

### audio (2)

- **`audacity`** — Audacity. Audio editing and processing via sox
- **`wavetone`** — WaveTone. Prepare WaveTone 2.61 audio transcription manifests, probe audio files, and launch the real Windows WaveTone executable

### automation (3)

- **`eez-studio`** — EEZ Studio. EEZ Studio project, LVGL UI, and SCPI command automation via native .eez-project JSON and real EEZ Studio backend hooks
- **`macrocli`** — MacroCLI. Layered macro runtime that converts GUI workflows into parameterized, agent-callable macros — record once, run anywhere via CLI with backend routing across native APIs, file transforms, accessibility controls, and visual template matching
- **`n8n`** — n8n. Workflow automation via n8n REST API — 55+ commands

### communication (2)

- **`ve-twini`** — VE Twini. Unified Twitter/X CLI bridging bird (GraphQL API) and opencli (browser automation)
- **`zoom`** — Zoom. Meeting management via Zoom REST API (OAuth2)

### database (2)

- **`chromadb`** — ChromaDB. Vector database operations — collections, documents, semantic search via ChromaDB HTTP API
- **`openrefine`** — OpenRefine. Agent-native CLI for OpenRefine import, operation-history cleaning, row inspection, export, and session undo/redo through the real local HTTP API.

### debugging (2)

- **`lldb`** — LLDB. Stateful native debugging via LLDB with JSON CLI workflows and a stdio Debug Adapter Protocol server
- **`unrealinsights`** — Unreal Insights. Windows-first Unreal trace capture, background session control, engine-matched UnrealInsights builds, and headless Timing Insights export workflows

### design (2)

- **`inkstitch`** — Ink/Stitch. Machine-embroidery digitization — set stitch params, validate, preview, and export to DST/PES/JEF/VP3 via Ink/Stitch
- **`sketch`** — Sketch. Generate Sketch design files (.sketch) from JSON design specifications via sketch-constructor

### devops (6)

- **`cc-switch`** — CC Switch. Manage AI coding tool configurations - inspect providers, skills, MCP servers, usage stats, and proxy settings
- **`eth2-quickstart`** — ETH2 QuickStart. Hardened Ethereum node deployment and operations via the eth2-quickstart automation scripts
- **`iterm2`** — iTerm2. Control a running iTerm2 instance — manage windows, tabs, split panes, send text, read output, run tmux -CC, broadcast keystrokes, and configure preferences.
- **`jumpserver`** — JumpServer. Bastion host management — manage assets, users, permissions, sessions, accounts, and audit logs via JumpServer REST API
- **`nslogger`** — NSLogger. Capture, parse, filter, export, and mirror NSLogger iOS/macOS logs from the CLI
- **`pm2`** — PM2. Node.js process management — list, start, stop, restart, logs, and metrics via PM2 CLI

### diagrams (2)

- **`drawio`** — Draw.io. Diagram creation and export via draw.io CLI
- **`mermaid`** — Mermaid. Mermaid Live Editor state files and renderer URLs

### finance (1)

- **`firefly-iii`** — Firefly III. Personal finance management via the Firefly III REST API

### game (1)

- **`slay_the_spire_ii`** — Slay the Spire 2. Control the real Slay the Spire 2 game via local STS2_Bridge HTTP API

### gamedev (3)

- **`godot`** — Godot Engine. Game engine project management, scene editing, export and GDScript execution via Godot 4 headless mode
- **`sbox`** — s&box. Game engine project management for s&box (Source 2): scenes, prefabs, materials, sounds, codegen, asset graph, project validation
- **`ueatelier`** — UEAtelier. Unreal Editor 5.6/5.7 MCP self-extension workbench - editor automation, build diagnostics, Task Atlas workflows, PIE smoke verification, scaffold pipeline

### generation (1)

- **`anygen`** — AnyGen. Generate docs, slides, websites and more via AnyGen cloud API

### graphics (6)

- **`3mf`** — 3MF. Mesh geometry editor for 3D printing files — detect and resize cylindrical holes, repair meshes, compare 3MF files
- **`cloudanalyzer`** — CloudAnalyzer. Point cloud and trajectory QA: Chamfer/AUC/F1, ATE/RPE/drift, ground segmentation metrics, config-driven quality gates, baseline evolution — harness wraps the CloudAnalyzer Python API
- **`cloudcompare`** — CloudCompare. 3D point cloud and mesh processing: load/save, color ops, normal estimation, Delaunay meshing, noise filtering, ICP registration, connected component segmentation
- **`live2d`** — Live2D Cubism. Inspect, validate, edit, lint, diff, batch-manage, and deploy Live2D Cubism models (.model3.json, .moc3, .motion3.json, .exp3.json) from the command line — 42 commands covering the full model lifecycle
- **`nsight-graphics`** — Nsight Graphics CLI. Windows-first Nsight Graphics CLI for Graphics/OpenGL capture, GPU Trace summary, Generate C++ Capture, and ngfx-replay analysis
- **`renderdoc`** — RenderDoc. GPU frame capture analysis: pipeline state, shader export, texture inspection, draw call browsing

### image (3)

- **`gimp`** — GIMP. Raster image processing via gimp -i -b (batch mode)
- **`inkscape`** — Inkscape. SVG vector graphics with export via inkscape --export-filename
- **`krita`** — Krita. Digital painting and raster image editing via Krita CLI export pipeline

### knowledge (2)

- **`joplin`** — Joplin. Note-taking and to-do automation — manage notebooks, notes, to-dos, tags, attachments, search, sync, and import/export via the Joplin terminal CLI
- **`obsidian`** — Obsidian. Knowledge management and note-taking — manage notes, search vault, execute commands via Obsidian Local REST API

### knowledge-management (1)

- **`siyuan`** — SiYuan CLI. Knowledge management and note-taking via SiYuan HTTP API — manage notebooks, documents, blocks, and search content from the command line

### music (1)

- **`musescore`** — MuseScore. CLI for music notation — transpose, export PDF/audio/MIDI, extract parts, manage instruments

### network (2)

- **`adguardhome`** — AdGuardHome. DNS ad-blocking and network infrastructure management via AdGuardHome REST API
- **`rms`** — Teltonika RMS. Device management and monitoring via Teltonika RMS REST API

### office (4)

- **`calibre`** — Calibre. E-book library management — list, search, metadata editing, format conversion via calibredb, ebook-convert, ebook-meta
- **`libreoffice`** — LibreOffice. Create and manipulate ODF documents, export to PDF/DOCX/XLSX/PPTX via headless mode
- **`mubu`** — Mubu. Knowledge management and outlining via local Mubu desktop data
- **`zotero`** — Zotero. CLI & MCP server for Zotero 7/8 — 52 MCP tools + 70+ CLI commands for search, import, PDF, BibTeX, notes, and more

### osint (1)

- **`intelwatch`** — Intelwatch. Competitive intelligence, M&A due diligence, and OSINT directly from your terminal.

### project-management (1)

- **`seaclip`** — SeaClip. Kanban board, 6-agent AI pipeline, and issue management via SeaClip-Lite FastAPI + SQLite

### science (2)

- **`stata`** — Stata. Run Stata do-files, batch jobs, and reproducible econometric projects from the terminal with JSON output, log parsing, project scaffolding, and security guard
- **`unimol_tools`** — Uni-Mol Tools. Molecular property prediction — train and predict with 5 task types (classification, regression, multiclass, multilabel) for drug discovery

### scientific (1)

- **`qgis`** — QGIS. Geospatial project authoring, layout export, and processing via PyQGIS and qgis_process

### search (2)

- **`exa`** — Exa. AI-powered web search and content extraction via the Exa API
- **`hacker-feeds-cli`** — Hacker Feeds CLI. CLI for GitHub Trending, Hacker News, Reddit, Product Hunt, DEV.to, Lobsters, EchoJS, and V2EX feeds

### storage (1)

- **`tigris`** — Tigris. Object storage management — buckets, objects, presigned URLs, snapshots, IAM, scoped access keys. Wraps the official `tigris` CLI (S3-compatible, globally distributed, no egress fees)

### streaming (1)

- **`obs-studio`** — OBS Studio. Create and manage streaming/recording scenes via command line

### testing (1)

- **`wiremock`** — WireMock. HTTP mock server management — create stubs, inspect requests, record traffic, and manage scenarios via WireMock REST API

### video (6)

- **`kdenlive`** — Kdenlive. Video editing and rendering via melt
- **`openscreen`** — Openscreen. Screen recording editor — zoom, speed ramps, trim, crop, annotations, backgrounds, and polished exports via ffmpeg
- **`palmier`** — Palmier Pro. Agent-native CLI harness for the Palmier Pro local MCP video editor — drive timeline editing, media, captions, and AI generation from the command line
- **`quietshrink`** — QuietShrink. Compress macOS screen recordings on Apple Silicon — 70-90% smaller files at visually lossless quality, hardware-encoded, computer stays silent
- **`shotcut`** — Shotcut. Video editing and rendering via melt/ffmpeg
- **`videocaptioner`** — VideoCaptioner. AI-powered video captioning — transcribe speech, optimize/translate subtitles, burn styled subtitles into video

### web (6)

- **`browser`** — Browser. Browser automation via DOMShell MCP server. Maps Chrome's Accessibility Tree to a virtual filesystem for agent-native navigation.
- **`clibrowser`** — clibrowser. Zero-dependency CLI browser for AI agents with search, extraction, forms, RSS, crawling, auth, and WebMCP support
- **`mailchimp`** — Mailchimp. Mailchimp Marketing API v3.0 — manage audiences, campaigns, reports, automations, ecommerce, templates, and more from an agent-native CLI
- **`safari`** — Safari. Native macOS Safari browser automation via safari-mcp — 84 tools for navigation, DOM, forms, network capture, and screenshots
- **`tinyfish`** — TinyFish Web Agent. All four TinyFish products from the terminal: web search, clean page extraction, natural-language browser automation, and remote CDP browser sessions — via the REST APIs.
- **`web-yu-pri`** — Web Yu-pri. Japan Post Web Yu-pri browser workflow automation for login, inspection, screenshots, dry-run planning, and contents-form filling

## Public CLIs (24)

Third-party CLIs the hub can also install (`pip`, `npm`, `brew`, or bundled).

- **`1password-cli`** — Official 1Password CLI for vault access, secrets retrieval, item automation, and desktop-app-backed authentication
- **`android-cli`** — Official Android terminal interface for SDK setup, project creation, emulator/device management, app run/deploy workflows, docs access, and skill management for any agent
- **`arcgis-pro`** — Agent-native CLI for ArcGIS Pro (ArcPy): professional cartography (layouts + map series), geoprocessing, and feature query/edit — plus a live-Pro MCP bridge that drives the open session.
- **`browser-cdp`** — Browser automation via raw Chrome DevTools Protocol — connects to YOUR existing Chrome, no extensions, no new browser, inherits all cookies and sessions
- **`cloakbrowser`** — Agent-friendly CLI for CloakBrowser — stealth Chromium that passes every bot detection test. Covers fingerprint flags, humanize behaviors, page operations, content extraction, cookies, storage, network, multi-page sessions, and CDP gateway.
- **`contentful`** — Official Contentful CLI for spaces, migrations, imports, exports, seeding, and environment management
- **`deployhq`** — Deploy code, manage projects/servers, run and monitor deployments via the DeployHQ platform — for humans and AI agents
- **`elevenlabs`** — Official ElevenLabs CLI for managing voice agents as code with local configs, templates, auth, push/pull sync, tests, widgets, and branch-aware workflows
- **`feishu`** — Official Lark (Feishu) CLI for managing Lark apps, bots, and cloud resources from the terminal
- **`generate-veo-video`** — CLI for generating videos with Google Veo 3.1 via Vertex AI/Gemini — text-to-video, image-to-video, reference images, frame morphing, and video extension
- **`jimeng`** — Official ByteDance AI image and video generation CLI — text-to-image, text-to-video, image-to-video, digital human, and intelligent canvas; domestic brand is Jimeng (即梦), international brand is Dreamina
- **`minimax-cli`** — MiniMax AI platform CLI for managing tokens, models, and API interactions from the command line
- **`obsidian-agent-cli`** — Full-featured CLI for Obsidian — manage notes, canvases, Excalidraw diagrams, Kanban boards, periodic notes, git, tasks, and more. Includes an AI agent skill for persistent knowledge capture and project memory.
- **`obsidian-cli`** — Official Obsidian command line interface for vault automation, developer tools, screenshots, search, history, and plugin workflows
- **`pieces`** — Agent-native CLI for Pieces OS — persistent long-term memory for developers. Search, create, and manage memory assets, snippets, and models via Pieces OS REST API.
- **`py4csr`** — GxP-compliant agent harness for CDISC Clinical Study Report (CSR) and Tables/Figures/Listings (TFL) generation
- **`sanity`** — Official Sanity CLI for studios, datasets, schemas, imports, exports, and structured content workflows
- **`sentry`** — Official Sentry CLI for releases, sourcemaps, debug files, monitors, and org/project automation
- **`shopify`** — Official Shopify CLI for apps, themes, functions, extensions, and Hydrogen storefront workflows
- **`smithue-cli`** — CLI tool for controlling Unreal Engine editor via SmithUE plugin. Enables AI agents to execute editor commands, list tools, search capabilities, and monitor editor status.
- **`suno`** — CLI for generating music with Suno AI from lyrics and style prompts, with batch generation, status polling, downloads, and automatic MP3 tagging
- **`vivideo`** — Vivideo AI video generation CLI — create avatar and text-to-video content from the terminal, scripts, CI, or agents. Supports auto and manual modes, model/avatar/voice/brand-kit listing, credit estimates, and status/wait polling.
- **`wecom`** — Official WeCom open-platform CLI for contacts, todos, meetings, messages, calendars, docs, and smart sheets
- **`x-twitter-scraper`** — CLI for Twitter search, profile and follower exports, monitoring, webhooks, and approved X actions through Xquik. Not affiliated with X Corp.
