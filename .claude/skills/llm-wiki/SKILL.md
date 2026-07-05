---
name: llm-wiki
description: Set up and maintain a persistent, LLM-curated personal knowledge wiki (a directory of interlinked markdown files) instead of doing one-shot RAG over raw documents. TRIGGER when the user wants to build a knowledge base, second brain, research wiki, or Obsidian vault that compounds over time as sources are added — for personal tracking, research, book notes, competitive analysis, due diligence, or team/business knowledge. Phrases: 'build me a wiki', 'second brain', 'knowledge base that stays current', 'set up an Obsidian vault for X', 'track this over time', 'ingest this source'.
version: 1.0.0
source: personal idea file, adapted for Claude Code
---

# LLM Wiki

A pattern for building personal knowledge bases with an LLM, instead of plain RAG.

Most RAG setups (NotebookLM, ChatGPT file uploads) retrieve chunks from raw documents at query time and re-derive an answer from scratch every time — nothing accumulates. This skill instead has the LLM **incrementally build and maintain a persistent wiki**: a structured, interlinked collection of markdown files that sits between the user and the raw sources. Every new source gets read, extracted, and integrated — updating entity pages, revising summaries, flagging contradictions with older claims. The wiki is compiled once and then kept current, not re-derived on every query.

Good for: personal tracking (goals, health, journaling), deep research over weeks/months, book/fan-wiki companions, team knowledge fed by meeting notes and Slack threads, competitive analysis, due diligence, trip planning, hobby deep-dives — anything accumulating knowledge over time that should stay organized rather than scattered.

## Architecture — three layers

1. **Raw sources** — the curated, immutable collection (articles, papers, transcripts, data). The LLM reads from these but never modifies them. Source of truth.
2. **The wiki** — a directory of LLM-owned markdown files: summaries, entity pages, concept pages, comparisons, an overview/synthesis. The LLM creates and updates these; the human reads them.
3. **The schema** (`CLAUDE.md` / `AGENTS.md` in the wiki repo) — tells the LLM the wiki's structure, conventions, and workflows for ingesting sources, answering questions, and maintaining the wiki. This is the key file that turns the LLM into a disciplined wiki maintainer instead of a generic chatbot. Co-evolve it with the user as conventions get discovered.

## Setting up a new wiki

When the user wants to start one, scaffold:

```
<wiki-root>/
  CLAUDE.md          # the schema — conventions, workflows, page templates
  raw/               # immutable source documents
    assets/          # downloaded images from clipped sources
  wiki/
    index.md         # content-oriented catalog of every page
    log.md           # append-only chronological record
    entities/        # people, places, tools, orgs — one page each
    concepts/        # topic/theme pages
    sources/         # one summary page per ingested source
```

Initialize it as a git repo — free version history, branching, and (if wanted) collaboration.

## Operations

**Ingest.** Drop a new source into `raw/`, then: read it → discuss key takeaways with the user → write a summary page under `wiki/sources/` → update `index.md` → update every relevant entity/concept page (a single source might touch 10–15 pages) → append an entry to `log.md`. Default to ingesting one source at a time and staying involved (read summaries, check updates, let the user guide emphasis); batch-ingest with less supervision only if the user asks for it.

**Query.** Search `index.md` for relevant pages first (cheaper than embedding search at moderate scale — up to ~100 sources / hundreds of pages), read them, synthesize an answer with citations back to source pages. Offer to file the answer back into the wiki as a new page if it's a reusable synthesis (comparison, analysis, discovered connection) — don't let it disappear into chat history.

**Lint.** Periodically health-check the wiki: contradictions between pages, stale claims superseded by newer sources, orphan pages with no inbound links, concepts mentioned but lacking their own page, missing cross-references, gaps a web search could fill. Suggest new questions/sources worth pursuing.

## index.md and log.md conventions

- **index.md** — one line per page: link, one-line summary, optional date/source-count metadata, grouped by category (entities/concepts/sources). Update on every ingest. Read this first when answering any query.
- **log.md** — append-only, chronological, one consistent entry prefix per line so it's `grep`-able: `## [YYYY-MM-DD] ingest | <Source Title>`. `grep "^## \[" log.md | tail -5` gives the last 5 entries.

## Optional tooling

- A search engine over wiki pages once it outgrows `index.md` — [qmd](https://github.com/tobi/qmd) is a solid local option (hybrid BM25/vector search + LLM re-ranking, has both a CLI and an MCP server).
- **Obsidian** as the human-facing IDE for the wiki: Web Clipper to pull sources in as markdown, graph view to see structure, Dataview for frontmatter-driven tables, Marp for slide decks generated from wiki content. See the `obsidian-*` skills in this repo for the mechanics.
- Set Obsidian's attachment folder to `raw/assets/` and bind a hotkey to "Download attachments for current file" so clipped images land on disk instead of relying on possibly-broken URLs.

## Why this works

The tedious part of maintaining a knowledge base isn't the reading or thinking — it's the bookkeeping: updating cross-references, keeping summaries current, flagging contradictions, staying consistent across dozens of pages. That's exactly what an LLM doesn't get bored of and can do across 15 files in one pass. The human curates sources, directs the analysis, and asks good questions; the LLM does the rest.

## Note

This is a pattern, not a fixed implementation. The directory layout, schema conventions, page formats, and tooling above are a reasonable default — adapt them to the domain. A text-only source set doesn't need image handling; a small wiki doesn't need a search engine; the user may want a completely different set of output formats. Work out the specifics with the user and record them in that wiki's own `CLAUDE.md` as they're discovered.
