---
name: obsidian-vault-intelligence
version: 2.0.0
trigger: obsidian | vault | wiki | notes | /wiki | /ingest | /vault-query | /wiki-update | /canvas | /daily | /weekly | knowledge base | second brain | zettelkasten | PKM | obsidian markdown | wikilinks | backlinks | properties | callouts | bases | json canvas | defuddle | note graph | compounding wiki | knowledge management
description: >
  Universal Obsidian vault intelligence skill. Covers full Obsidian Flavored Markdown
  authoring, Bases database syntax, JSON Canvas visual maps, CLI vault operations,
  multi-agent wiki workflows (ingest/query/lint/rebuild), PKM architecture
  (PARA, Zettelkasten, LYT), daydream insight mining, web-to-vault scraping via
  Defuddle, and Pinecone semantic search bridge. Client-agnostic — works for any
  project, any domain, any vault structure. Synthesized from kepano/obsidian-skills
  (27.3k stars), AgriciDaniel/claude-obsidian, ballred/obsidian-claude-pkm,
  and glebis/claude-skills.
author: Space Age AI Solutions
sources:
  - https://github.com/kepano/obsidian-skills
  - https://github.com/AgriciDaniel/claude-obsidian
  - https://github.com/ballred/obsidian-claude-pkm
  - https://github.com/glebis/claude-skills
tags: [obsidian, vault, PKM, wiki, knowledge-management, markdown, canvas, CLI, RAG, universal]
---

# Obsidian Vault Intelligence

## WHEN TO ACTIVATE

Load this skill when the user:
- Asks to create, edit, or manage Obsidian notes, vaults, or knowledge bases
- Mentions wikilinks `[[note]]`, backlinks, properties, callouts, or embeds
- Wants to build a second brain, compounding wiki, or knowledge system
- Uses `/wiki`, `/ingest`, `/vault-query`, `/daily`, `/weekly`, `/canvas`, `/daydream`
- Needs to work with `.md`, `.base`, `.canvas` files in Obsidian
- References the Obsidian CLI, plugins, or vault commands
- Asks about knowledge graphs or semantic note connections
- Needs to scrape web content into vault notes (defuddle)
- Any client project requiring structured knowledge documentation or retrieval

---

## MODULE 1 — OBSIDIAN FLAVORED MARKDOWN (OFM)

### Core Syntax

```markdown
# Wikilinks
[[Note Name]]              # Link to note
[[Note Name|Display Text]] # Aliased link
[[Note Name#Heading]]      # Link to heading
[[Note Name#^block-id]]    # Link to block

# Embeds
![[Note Name]]             # Embed full note
![[image.png]]             # Embed image
![[Note Name#Heading]]     # Embed section only

# Properties (YAML frontmatter)
---
title: My Note
date: 2026-05-03
tags: [topic, project, status]
status: active
type: project
related: [[Other Note]]
---

# Callouts
> [!NOTE] Title
> Content here

> [!WARNING] Alert
> Critical info

> [!TIP]- Collapsible tip
> Hidden by default

# Callout types:
# note, abstract, info, tip, success, question, warning,
# failure, danger, bug, example, quote, check, todo, important

# Tags
#topic #project/subproject #status/active

# Comments (hidden in preview)
%%This comment is invisible in reading mode%%

# Footnotes
Text with footnote[^1]
[^1]: Footnote content here

# Highlights & math
==highlighted text==
$inline equation$
$$block equation$$
```

### Universal Note Templates

**Project Note:**
```markdown
---
title: {{project_name}}
type: project
client: {{client_name}}
status: active
date_started: {{date}}
tags: [project, {{domain}}]
related: []
---

# {{project_name}}

## Overview
> [!INFO] Brief
> One-line description

## Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2

## Notes

## Related
```

**Client Profile:**
```markdown
---
title: {{client_name}}
type: client
industry: {{industry}}
status: active
website:
contact:
tags: [client, {{industry}}]
---

# {{client_name}}

## Brand Identity
- Colors:
- Typography:
- Tone:

## Active Projects

## History & Notes
```

**Research Note:**
```markdown
---
title: {{topic}}
type: research
source: {{url_or_reference}}
date: {{date}}
tags: [research, {{domain}}]
---

# {{topic}}

## Key Findings

## Entities Mentioned

## Related Concepts
```

---

## MODULE 2 — OBSIDIAN BASES (Database Syntax)

Bases turn folders into queryable databases — built into Obsidian v1.8+, no plugins required.

```yaml
# Table view
table:
  from:
    folder: "Projects"
  filter:
    status: "active"
  columns:
    - property: title
    - property: client
    - property: status
    - property: date_started
  sort:
    - property: date_started
      direction: desc

# Gallery view
gallery:
  from:
    folder: "Clients"
  columns:
    - property: title
    - property: industry
    - property: status

# Kanban/Board view
board:
  from:
    folder: "Tasks"
  groupBy: status
  columns:
    - property: title
    - property: due_date
    - property: priority

# Filter operators
filter:
  status: "active"          # equals
  priority:
    gt: 3                   # greater than
  tags:
    contains: "important"   # array contains
  date:
    after: "2026-01-01"     # date comparison
  status:
    not: "archived"         # not equal

# Formulas in columns
columns:
  - property: title
  - formula: "prop('date_started').age()"
    label: "Days Active"
  - formula: "prop('rate') * prop('hours')"
    label: "Revenue"

# Summaries
summary:
  count: true
  sum: [revenue]
  average: [rate]
```

---

## MODULE 3 — JSON CANVAS

Open standard for visual knowledge maps (`.canvas` files).

```json
{
  "nodes": [
    {
      "id": "node1",
      "type": "text",
      "text": "## Core Concept\nDescription here",
      "x": 0, "y": 0,
      "width": 300, "height": 150,
      "color": "1"
    },
    {
      "id": "node2",
      "type": "file",
      "file": "Projects/My Project.md",
      "x": 400, "y": 0,
      "width": 300, "height": 150
    },
    {
      "id": "node3",
      "type": "link",
      "url": "https://example.com",
      "x": 0, "y": 250,
      "width": 300, "height": 150
    },
    {
      "id": "group1",
      "type": "group",
      "label": "Group Label",
      "x": -50, "y": -50,
      "width": 800, "height": 350,
      "color": "6"
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "fromNode": "node1",
      "fromSide": "right",
      "toNode": "node2",
      "toSide": "left",
      "label": "relationship",
      "color": "4",
      "fromEnd": "none",
      "toEnd": "arrow"
    }
  ]
}
```

| Color Code | Color |
|------------|-------|
| 1 | Red |
| 2 | Orange |
| 3 | Yellow |
| 4 | Green |
| 5 | Cyan |
| 6 | Purple |

**Node types:** `text`, `file`, `link`, `group`
**Edge ends:** `none`, `arrow`
**Edge sides:** `top`, `right`, `bottom`, `left`

---

## MODULE 4 — OBSIDIAN CLI OPERATIONS

```bash
# File operations
obsidian files total                         # Count all vault files
obsidian files list --folder "Projects"      # List folder contents
obsidian files create --path "New Note.md"   # Create note
obsidian files read --path "Note.md"         # Read note
obsidian files write --path "Note.md" --content "# Title\nContent"

# Search
obsidian search query="keyword" format=json  # Full-text search
obsidian search query="tag:#active"          # Tag search
obsidian search query="path:Projects"        # Path filter

# Tags & structure
obsidian tags counts sort=count              # Tag frequency list
obsidian tags list                           # All tags
obsidian orphans                             # Notes with no links
obsidian unresolved                          # Broken wikilinks

# Links
obsidian links list --from "Note.md"         # Outgoing links
obsidian backlinks list --to "Note.md"       # Backlinks

# Tasks
obsidian tasks                               # All open tasks
obsidian tasks --folder "Projects"           # Scoped tasks

# Daily notes
obsidian daily:create                        # Create today's daily note
obsidian daily:append content="- [ ] Task"   # Append to daily note

# Vault info
obsidian vault:path                          # Get vault root path
obsidian vault:config                        # Get vault config

# Plugins
obsidian plugins list                        # Installed plugins
obsidian plugins enable --id "dataview"      # Enable plugin
```

---

## MODULE 5 — DEFUDDLE (Web-to-Vault Pipeline)

Strips web clutter → clean markdown → vault-ready notes.

```bash
# Install
npm install -g defuddle-cli

# Basic extraction
defuddle https://example.com/article > output.md

# Save to vault raw inbox
defuddle https://example.com/article \
  --output ~/vault/_raw/article-title.md \
  --metadata

# Batch from URL list
cat urls.txt | xargs -I{} defuddle {} --output ~/vault/_raw/

# Output structure
---
title: Article Title
url: https://source.com
date_scraped: 2026-05-03
word_count: 1200
---
# Article Title
[Clean extracted content — ads, nav, sidebars removed]
```

**Pipeline: Research → Vault:**
```bash
# 1. Scrape source
defuddle https://competitor-or-research-url.com \
  --output ~/vault/_raw/research-topic.md --metadata

# 2. Then /wiki-ingest to process into wiki structure
# (See Module 6)
```

---

## MODULE 6 — MULTI-AGENT WIKI SYSTEM

Based on Karpathy LLM Wiki pattern. Builds a compounding knowledge base that gets richer with every ingest.

### Commands

**`/wiki-ingest [source]`**
Reads source → extracts entities, concepts, relationships → files into vault.

```
Accepted input types:
- Markdown files
- PDFs (with page ranges)
- URLs (via defuddle auto-pipeline)
- JSONL conversation exports
- Plain text / transcripts / meeting notes
- Images (vision model required)

Output:
- concept pages in wiki/concepts/
- entity pages in wiki/entities/
- cross-reference links added to existing pages
- index updated
```

**`/wiki-query [question]`**
Hot cache scan → index scan → relevant pages → synthesized answer with vault citations.

**`/wiki-lint`**
Vault health audit:
- Broken wikilinks → flag for fix
- Orphaned notes → suggest connections
- Missing required properties → list gaps
- Duplicate concepts → suggest merges
- Inconsistent tagging → normalize

**`/wiki-update` (run from project context)**
Reads project state → distills decisions, patterns, concepts → updates or creates wiki pages.

**`/autoresearch [topic]`**
```
1. Web search → defuddle → _raw/
2. Extract entities + concepts
3. Cross-reference existing vault pages
4. Create/update wiki pages
5. Build citation graph
6. Output daily research digest
```

---

## MODULE 7 — PKM ARCHITECTURE PATTERNS

### PARA (Navigation Layer)
```
Projects/ → Active deliverables with end dates
Areas/    → Ongoing responsibilities (no end date)
Resources/ → Reference materials & domain knowledge
Archives/ → Completed or inactive items
```

### Zettelkasten (Knowledge Layer)
```
wiki/
├── concepts/ → Permanent atomic notes (one idea each)
├── entities/ → Reference notes (people, tools, companies)
└── meta/     → Maps of Content (MOC), indexes, dashboards
```

### LYT (Linking Your Thinking)
```
MOC notes act as hubs — they aggregate related notes
without requiring rigid hierarchy.
Every concept note links to at least one MOC.
```

### Recommended Hybrid: PARA + Zettelkasten
```
PARA handles navigation (where things live).
Zettelkasten handles knowledge (what things mean).
They coexist — project notes reference wiki concepts.
```

### Note Maturity Levels

| Level | Tag | Description |
|-------|-----|-------------|
| Capture | `#fleeting` | Raw idea, unprocessed |
| Literature | `#literature` | Processed from source |
| Permanent | `#permanent` | Atomic, evergreen |
| Structure | `#MOC` | Map of Content index |

---

## MODULE 8 — DAYDREAM INSIGHT MINING

Mines non-obvious connections across vault notes using parallel subagents.

```
Process:
1. Glob vault → extract note excerpts
2. Generate N random note pairs (recency-weighted)
3. Task(model: sonnet) × 10 → synthesize connections [parallel]
4. Task(model: haiku) × 10 → critique/score [parallel]
5. Filter: avg score >= 7.0
6. Write: insight notes + daily digest → wiki/meta/daydream-YYYY-MM-DD.md

Estimated cost: ~$0.40–0.50 per run (~50 pairs)
Dependencies: Claude Code with Task tool, no external packages
```

---

## MODULE 9 — SEMANTIC SEARCH BRIDGE (Pinecone)

Connects vault notes to a Pinecone vector index for semantic retrieval.
See `PineconeVectorEngine_SKILL.md` for full implementation (not yet in this repo — see the
prioritized backlog in this session's summary).

```python
# Index vault notes into Pinecone
def index_vault(vault_root: str, index_name: str, namespace: str = "vault"):
    for md_file in glob.glob(f"{vault_root}/**/*.md", recursive=True):
        chunks = chunk_obsidian_note(md_file, vault_root)
        embeddings = embed_batch([c["text"] for c in chunks])

        vectors = [{
            "id": f"{c['note_path']}#{c['chunk_index']}",
            "values": emb,
            "metadata": {
                "path": c["note_path"],
                "title": c["note_title"],
                "tags": c["tags"],
                "type": c["type"],
                "text": c["text"][:500],
            }
        } for c, emb in zip(chunks, embeddings)]

        index.upsert(vectors=vectors, namespace=namespace)

# Query vault semantically
def vault_search(question: str, filter_type: str = None):
    results = index.query(
        vector=embed(question),
        top_k=10,
        namespace="vault",
        filter={"type": {"$eq": filter_type}} if filter_type else None,
        include_metadata=True,
    )
    return [
        f"[[{m.metadata['title']}]]: {m.metadata['text']}"
        for m in results.matches
    ]
```

---

## DECISION TREE

```
Obsidian task?
├── Creating/editing notes      → MODULE 1 (OFM syntax)
├── Database/table view         → MODULE 2 (Bases)
├── Visual map/graph            → MODULE 3 (JSON Canvas)
├── Automate vault ops          → MODULE 4 (CLI)
├── Scrape web → vault          → MODULE 5 (Defuddle)
├── Wiki ingest/query/lint      → MODULE 6 (Multi-Agent Wiki)
├── Structure new vault         → MODULE 7 (PKM Architecture)
├── Find hidden connections     → MODULE 8 (Daydream)
└── Semantic search on vault    → MODULE 9 + PineconeVectorEngine_SKILL.md
```

---

## QUICK REFERENCE

| Task | Syntax / Command |
|------|-------------------|
| Link to note | `[[Note Name]]` |
| Embed note | `![[Note Name]]` |
| Callout | `> [!NOTE] Title` |
| Tag | `#tag` or `tags: [tag]` in props |
| Search | `obsidian search query="term"` |
| Orphan check | `obsidian orphans` |
| Fix broken links | `obsidian unresolved` |
| Create daily | `obsidian daily:create` |
| Scrape URL | `defuddle [url] --output vault/_raw/` |
| Ingest source | `/wiki-ingest [source]` |
| Query knowledge | `/wiki-query [question]` |
| Mine connections | `/daydream` |
