# SpaceAge GeoFusion X — engine v0.5

Maps + website + social intelligence with durable jobs, provenance, versioned evidence-based scores and tabbed exports.
Built on the v0.4 engine (store, dedupe, onboarding, catalog kept; its 14 tests still pass).
What works, what is partial and what is blocked: **`STATUS.md`**. Measured numbers: **`BENCHMARKS.md`**.

## Quickstart

```bash
./install.sh                                   # GoSom @d0b51bc, lighthouse 12.8.2, playwright 1.56.0, agent-reach, mcporter
python -m unittest discover -s tests           # offline regression suite
python -m geofusion readiness youtube,instagram,facebook,x,reddit,tiktok
python -m geofusion audit https://example.com --phone "+1 214 555 0101" --city Mesquite
python -m geofusion run examples/mesquite-landscaping.json --workdir runs/mesquite --job mesquite-1
python -m geofusion report --workdir runs/mesquite --job mesquite-1 --out runs/mesquite/report
```

## Modules

| File | Role |
|---|---|
| `core.py` | normalize (GoSom JSON aware; absent ≠ 0), identity/dedupe, SQLite store, jobs, checkpoints, audits |
| `maps.py` | GoSom collector: bbox tiling, multi-query per tile, resume, circuit breaker, raw files + sha256; Omkar status |
| `web.py` | static → Playwright escalation, page sampling, SEO/local/AI/conversion signals, robots/sitemap/llms.txt, Lighthouse |
| `social.py` | Agent Reach readiness, YouTube reads, Exa search (rate-limit aware), name-token channel matching |
| `router.py` | capability registry, deterministic gates, `route()`, Jev `Judge` (floor, timeout bypass, escalation, log) |
| `scoring.py` | `geofusion-score-1.0`: website quality /100, technical SEO, local SEO, AI search, social, opportunity |
| `pipeline.py` | resumable job: maps → area/category → no-website verification → audit → social → scores |
| `export.py` | tabs (Ranked Leads first), CSV/JSONL/XLSX, Google Sheets REST + read-back `verify()` |
| `adapters.py`, `onboarding.py`, `cli.py` | v0.4 adapters and wizard (kept), CLI |

## Environment variables (names only)

`GEOFUSION_GOSOM_BIN`, `GEOFUSION_LIGHTHOUSE`, `CHROME_PATH`, `GEOFUSION_MCPORTER_CONFIG`, `TYPESAFE_API_KEY`, `EXA_API_KEY`,
`FIRECRAWL_API_KEY`, `GOOGLE_OAUTH_ACCESS_TOKEN`. None are required for the offline tests.

## Licenses

GoSom (MIT) and Lighthouse (Apache-2.0) run as external tools; Agent Reach (MIT) is vendored in this repo at
`skills/agent-reach`; Playwright (Apache-2.0) and openpyxl (MIT) are pip dependencies. No upstream code is copied into
`geofusion/`. See `UPSTREAM.md`.
