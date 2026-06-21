---
name: sa-graphify-operator
description: >
  Space Age graphify operator. Uses graphifyy (PyPI) to build knowledge graphs from codebases,
  client projects, and skill libraries. 3-pass pipeline: extract entities, map relationships,
  generate graph. Routes to DeepSeek/Gemini/Claude based on task. Enables cross-project
  intelligence and PR diff analysis. Load when analyzing complex codebases or building
  project intelligence maps.
---

# SA Graphify Operator OS

## What graphifyy Does

graphifyy is a Python knowledge graph tool that:
- Extracts entities (functions, classes, modules, concepts) from code and text
- Maps relationships between entities (calls, imports, depends-on, related-to)
- Generates graph visualizations and JSON export
- Enables cross-project pattern analysis

## Installation

```bash
pip install graphifyy
# or in project
pip install graphifyy --quiet
```

## 3-Pass Pipeline

### Pass 1: Entity Extraction
Extract all meaningful entities from the source.

```python
from graphifyy import EntityExtractor

extractor = EntityExtractor(
    model="deepseek-v4-pro",  # SA model routing: complex extraction
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com/v1"
)

entities = extractor.extract(
    source="./src",           # directory or file or text
    entity_types=[            # what to look for
        "function",
        "class", 
        "module",
        "concept",
        "dependency",
        "pattern"
    ]
)
```

### Pass 2: Relationship Mapping
Map how entities connect to each other.

```python
from graphifyy import RelationshipMapper

mapper = RelationshipMapper(
    model="gemini-2.0-flash",  # SA model routing: fast pattern matching
    api_key=os.environ["GEMINI_API_KEY"]
)

graph = mapper.map(
    entities=entities,
    relationship_types=[
        "calls",
        "imports",
        "depends_on", 
        "implements",
        "extends",
        "related_to",
        "conflicts_with"
    ]
)
```

### Pass 3: Graph Generation + Export

```python
from graphifyy import GraphBuilder

builder = GraphBuilder()
result = builder.build(
    graph=graph,
    output_format="json",    # json / svg / html / mermaid
    output_path="./graphs/project-graph.json"
)

# For Obsidian canvas export
builder.build(graph=graph, output_format="json-canvas", output_path="./graphs/project.canvas")
```

## SA Backend Routing

| Task | Route To | Reason |
|---|---|---|
| Entity extraction from large codebase | DeepSeek V4 Pro | Best code comprehension |
| Relationship mapping | Gemini Flash | Fast pattern matching at scale |
| Graph synthesis + summary | Claude | Reasoning + explanation |
| Quick entity count | DeepSeek V4 Flash | Cheap, fast |
| Security relationship audit | Codex (three-brain) | Security-aware review |

## PR Intelligence Mode

Run graphify on git diffs to map what a PR actually changes:

```python
import subprocess
from graphifyy import DiffAnalyzer

# Get the diff
diff = subprocess.run(['git', 'diff', 'HEAD~1', '--unified=5'], capture_output=True, text=True).stdout

analyzer = DiffAnalyzer(model="deepseek-v4-pro", api_key=os.environ["DEEPSEEK_API_KEY"])

pr_graph = analyzer.analyze(
    diff=diff,
    questions=[
        "What functions are added, removed, or modified?",
        "What are the dependency changes?",
        "What modules does this change affect?",
        "Are there any circular dependency risks introduced?"
    ]
)

print(pr_graph.summary())
print(pr_graph.risk_assessment())
```

## Global Cross-Project Graph

For the Space Age Skills repo — build a graph of ALL skills and how they relate:

```python
from graphifyy import ProjectIndexer

indexer = ProjectIndexer(
    root="~/.claude/skills",
    model="gemini-2.0-flash",
    api_key=os.environ["GEMINI_API_KEY"]
)

# Index all SKILL.md files
skills_graph = indexer.index(
    file_pattern="**/SKILL.md",
    extract_relationships=True,
    relationship_types=["fires_before", "fires_after", "depends_on", "conflicts_with", "shares_context_with"]
)

# Export for visualization
skills_graph.export("./graphs/sa-skills-universe.json")
skills_graph.export_canvas("./graphs/sa-skills-universe.canvas")  # Obsidian canvas
```

## SA Superpowers Extensions

### Skills Universe Map
Run monthly to see the full skill dependency graph:
```
graphifyy index ~/.claude/skills --output ./graphs/skills-universe.json
```

### Codebase Intelligence (before major refactors)
```
graphifyy analyze ./src --model deepseek-v4-pro --output ./graphs/pre-refactor.json
```

### Client Project Archive
```
graphifyy analyze ./[client-project] --model gemini-flash --output ./graphs/[client]-map.json
```

### Session Knowledge Graph
At session end, graph today's decisions + outputs for Drive memory:
```python
# From sa-obsidian-vault-ops pattern
session_graph = graphify_session(
    session_log=today_drive_note,
    model="deepseek-v4-flash"  # fast, cheap
)
```

## Output Interpretation

When graphify returns results, look for:
- **High in-degree nodes** — heavily depended-on, high risk to change
- **Isolated nodes** — dead code or unused skills
- **Circular dependencies** — architectural debt
- **Bridge nodes** — single points of failure connecting two clusters
- **Relationship density** — low density = loosely coupled (good), high = tightly coupled (risky)
