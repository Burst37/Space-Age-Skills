# External components (pinned, verified 2026-10-18)

| Component | Version / commit | License | How used |
|---|---|---|---|
| GoSom google-maps-scraper | d0b51bcf3cd56d9a3f71e049cb6e226554e24162 | MIT | external binary built from source (or Docker image); fast mode |
| Omkar google-maps-scraper | 828f6d9301a6fcd6ca802bb19725e47a71f6fc2d | MIT | not integrated: repo has docs/screenshots only |
| Agent Reach | 1.5.0 @ 94f06c1 (vendored at Space-Age-Skills/skills/agent-reach) | MIT | channel readiness (doctor), yt-dlp YouTube reads, Exa search via mcporter |
| mcporter | 0.15.0 | MIT | MCP client for Exa |
| Lighthouse | 12.8.2 | Apache-2.0 | external CLI |
| Playwright (Python) | 1.56.0 | Apache-2.0 | browser escalation |
| openpyxl | 3.1.5 | MIT | XLSX export |
| Scrapling | not pinned | BSD-3-Clause | v0.4 optional single-page adapter (kept, unchanged) |
| Firecrawl SDK | not pinned | MIT (SDK) | v0.4 optional adapter (kept); needs FIRECRAWL_API_KEY |
| TypeSafe Jev | API jev-latest | proprietary API | optional judge, POST /v1/systemone |
| Headroom | — | — | not used: not a scraper; no raw-evidence compression is done |

No upstream source is copied into `geofusion/`. Preserve the upstream notices when redistributing binaries.
