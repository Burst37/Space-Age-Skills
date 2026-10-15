# Web research layer — Agent Reach (P0 intake + competitor scan)

Owner skill: [`agent-reach`](../../agent-reach/SKILL.md) (Panniantong/Agent-Reach, MIT).
Agent Reach is the **read** layer: it fetches what a link or platform says so P0 can analyze it.
It does not write, post, log in or design. Load this file when P0 starts; skip it if the person
sent no links and no competitor research is needed.

## When P0 calls it

| Situation | What to run | Feeds |
|---|---|---|
| Person pastes a reference **website** | `curl -s "https://r.jina.ai/<URL>"` for clean text; then `brand-extractor` / `extract-design-system` for tokens | `references[].findings` (copy tone, sections, offer) |
| Reference is a **YouTube** video (ad, walkthrough, motion ref) | `yt-dlp --write-sub --write-auto-sub --skip-download -o "/tmp/%(id)s" "<URL>"` → transcript; frames via `sa-watch` | motion + copy findings |
| Reference is on **X / Instagram / Reddit / Facebook** | `agent-reach doctor --json` first, then the `social.md` command for the active backend | audience language, proof, objections |
| "Who are my competitors?" / local market | Exa: `mcporter call exa.web_search_exa query="<category> <city>" numResults=8`, then read each top site via Jina | competitor table: promise, price signals, proof, design patterns to beat |
| What customers say | Reddit + X search on the brand/category; Google reviews via `firecrawl-mcp` if needed | `synthesis.voice_of_customer`, copy hooks for `stop-slop-pro` |
| Dribbble / Behance / Pinterest link | Jina read for title/notes; image analysis from the screenshot the person uploads | LOOK / LAYOUT tags |

## Rules

1. Say what you use: "using agent-reach, platform X via backend Y".
2. Read-only. Never post, like, follow or log in on the person's behalf. Never print cookie or token values.
3. Run `agent-reach doctor --json` before any login-backed platform (X, Reddit, Instagram, Facebook);
   if the backend is missing, ask for an upload or screenshot instead of guessing.
4. Bulk crawling of a whole site (sitemap, every page) is `firecrawl-mcp` or `scrapegraph-ai`, not Agent Reach.
5. Cap research at what changes the build: max 5 competitor sites and 1 social sweep per platform.
   Record sources in `direction-brief.yaml → references[].source`.
6. No unvetted installs mid-build. If `agent-reach` is not installed, fall back to Jina reads
   (`r.jina.ai`), `defuddle` and `firecrawl-mcp`, and note it in the brief.

## Output (append to the Direction Brief)

```yaml
research:
  competitors:            # ≤ 5
    - url: ""
      promise: ""
      proof: ""
      design_patterns: [] # what they do well → what we do better
  voice_of_customer: []   # exact phrases from reviews / Reddit / X
  sources: []             # every URL read, with the backend used
```
