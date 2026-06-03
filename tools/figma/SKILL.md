---
name: figma-integration
description: Complete Figma integration toolkit for Space Age Agent OS. Covers three tools: Figma-Context-MCP (read Figma designs from Claude Code / Cursor), cursor-talk-to-figma-mcp (bidirectional real-time read+write via WebSocket), and Figma plugin-samples (official Plugin API reference for building automation plugins). Use when implementing a design from Figma, automating Figma edits, or building Figma plugins.
license: MIT
---

# Figma Integration — Space Age Agent OS

Three tools, three jobs. Pick the right one, then follow its setup.

---

## Decision Tree — Which Tool to Use

```
What do I need?
│
├── READ a Figma design to implement it as code
│   └── No need to write back to Figma
│       → figma-context-mcp  (Framelink)
│         Simple: Figma API token only, no plugin needed
│
├── READ + WRITE to Figma in real time
│   └── Want AI to directly create/move/edit nodes in Figma
│       → cursor-talk-to-figma-mcp
│         Requires: Figma plugin installed + WebSocket server running
│
└── BUILD a Figma plugin
    └── Automate repetitive Figma tasks (export, transform, batch edit)
        → plugin-samples (reference library)
          Fork a sample, adapt it to your use case
```

---

## Tool 1: figma-context-mcp (Framelink)

**What it does:** MCP server that fetches a Figma file via the REST API, strips it down to only the layout/style data the model needs, and hands it to Claude Code or Cursor. One-shot design implementation.

**Why it's better than screenshots:** The raw Figma JSON contains computed layout, exact colors, typography tokens, component names, and spacing — everything you'd need to write accurate CSS/JSX. Screenshots lose all of that.

### Setup

```bash
cd tools/figma/figma-context-mcp
pnpm install
pnpm build
```

Add to `.mcp.json` in your project root (or `~/.cursor/mcp.json` for Cursor):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
    }
  }
}
```

Or from source:
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["tools/figma/figma-context-mcp/dist/index.js", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "YOUR_TOKEN"
      }
    }
  }
}
```

Get your token: Figma → Account Settings → Personal Access Tokens → Generate new token.

### How to use with Claude Code

Once configured, paste a Figma URL in your prompt:

```
Implement this Figma frame as a React component matching Space Age VL-01 
design system (dark glass, Orbitron/DM Sans/JetBrains Mono fonts, CSS vars 
from globals.css):

https://www.figma.com/file/ABC123/Space-Age-OS?node-id=42%3A100
```

Claude Code will call the MCP server automatically, get the simplified design tree, and write the component.

### What it exposes (MCP tools)

| Tool | What it does |
|------|-------------|
| `get_figma_data` | Fetch a file/frame/component by URL, returns simplified layout+style JSON |
| `download_figma_images` | Download image fills and SVG exports from a Figma node |

### Architecture — how the simplification works

Raw Figma API responses can be 100k+ tokens. `figma-context-mcp` runs a transformer pipeline:

```
Raw Figma API response
  → layoutExtractor    (position, size, padding, gap, alignment)
  → textExtractor      (content, font, size, weight, color, lineHeight)
  → visualsExtractor   (fills, strokes, effects, border-radius)
  → componentExtractor (component names, variants, props)
  → SimplifiedDesign   (compact JSON the model actually reads)
```

The extractors live in `figma-context-mcp/src/extractors/`. You can customize what data is included by modifying or composing the extractors.

---

## Tool 2: cursor-talk-to-figma-mcp

**What it does:** Bidirectional bridge — AI can read the current Figma document AND write to it in real time. Uses a WebSocket server as the relay between the MCP server and a Figma plugin running inside Figma desktop.

**Use cases:**
- Generate component variations directly in Figma
- Bulk-update text content across a design
- Propagate component instance overrides
- Build prototypes from a prompt without opening Figma UI

### Architecture

```
Claude Code / Cursor
    ↕ MCP protocol (stdio)
MCP Server (Node.js / Bun)
    ↕ WebSocket (ws://)
WebSocket Relay (socket.ts)
    ↕ WebSocket (plugin channel)
Figma Plugin (runs inside Figma desktop)
    ↕ Figma Plugin API
Figma Document
```

### Setup

```bash
cd tools/figma/cursor-talk-to-figma-mcp

# Install Bun if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Start WebSocket relay (keep running in background)
bun run socket
```

Install the Figma plugin:
1. Figma desktop → Plugins → Development → New Plugin → "Link existing plugin"
2. Select `tools/figma/cursor-talk-to-figma-mcp/src/cursor_mcp_plugin/manifest.json`

Add MCP server to `.mcp.json`:
```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bunx",
      "args": ["cursor-talk-to-figma-mcp@latest"]
    }
  }
}
```

Or from local source:
```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "bun",
      "args": ["tools/figma/cursor-talk-to-figma-mcp/src/talk_to_figma_mcp/server.ts"]
    }
  }
}
```

### Available MCP tools (read + write)

**Read:**
- `get_document_info` — full document tree
- `get_selection` — currently selected nodes
- `get_node_info` — details on a specific node ID

**Write:**
- `create_frame`, `create_rectangle`, `create_text` — add nodes
- `set_text_content` — update text in a node
- `set_fill_color` — change fill color
- `move_node` — reposition elements
- `resize_node` — change dimensions
- `clone_node` — duplicate a node
- `delete_node` — remove nodes
- `set_font_name`, `set_font_size`, `set_font_weight` — typography
- `set_instance_overrides` — propagate overrides across component instances

### Example prompt

```
In the currently open Figma file, find all text nodes that say "Agent Name" 
and replace them with the actual agent names from our org: Claude, Codex, 
Gemini, OpenClaw, Hermes, DeepSeek. Keep the same font and position.
```

---

## Tool 3: plugin-samples (Official Figma Plugin API)

**What it does:** 20+ reference plugins from Figma's official team covering every major plugin API surface. Use as a starting point when building your own plugin.

### Sample inventory — what to fork for each job

| Sample | What it shows | Fork when you need to... |
|--------|--------------|--------------------------|
| `barchart` | Canvas drawing, data → shapes | Generate charts/infographics from data |
| `esbuild-react` | React UI inside a plugin | Build a plugin with a rich UI panel |
| `webpack-react` | Webpack + React plugin setup | Same as above (alternative bundler) |
| `text-search` | Find/replace across document | Batch text operations |
| `text-review` | Iterate text nodes, call API | Spell-check, translate, AI-rewrite text |
| `variables-import-export` | Read/write Figma variables | Sync design tokens to/from code |
| `styles-to-variables` | Migrate styles → tokens | Token migration/refactoring |
| `codegen` | Code generation plugin | Export components as code |
| `svg-inserter` | Import SVG programmatically | Batch SVG import |
| `invert-image` | Image processing (pixel ops) | Image filter effects |
| `annotations` | Dev mode annotation layer | Add code-linked annotations |
| `create-rects-shapes` | Basic shape creation API | Understand node creation primitives |
| `post-message` | iframe ↔ plugin messaging | Plugin UI ↔ code communication |
| `resizer` | Resize selected nodes | Batch layout operations |
| `snippet-saver` | Persist data across sessions | Plugin state / user preferences |

### Plugin structure (every plugin has this shape)

```
plugin-name/
  manifest.json     ← plugin ID, permissions, entry points
  code.ts           ← main thread: accesses Figma API
  ui.html           ← optional iframe UI panel
  tsconfig.json     ← extends root tsconfig
```

**`manifest.json` minimum:**
```json
{
  "name": "My Plugin",
  "id": "your-unique-plugin-id",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"]
}
```

**`code.ts` minimal pattern:**
```typescript
figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'run') {
    // Access the document
    const nodes = figma.currentPage.findAll(n => n.type === 'TEXT');
    nodes.forEach(n => {
      if (n.type === 'TEXT') n.characters = 'Updated';
    });
    figma.ui.postMessage({ type: 'done', count: nodes.length });
  }
  if (msg.type === 'cancel') figma.closePlugin();
};
```

### Build and install a plugin

```bash
cd tools/figma/plugin-samples
npm install           # installs shared @figma/plugin-typings

cd barchart           # or whichever sample
tsc                   # compiles code.ts → code.js
```

Then in Figma: Plugins → Development → Import plugin from manifest → select `manifest.json`.

---

## Integration with Space Age Agent OS

### Pattern 1 — Design-to-code (figma-context-mcp)

When implementing a new Space Age component from a Figma design:

1. Designer shares a Figma frame URL
2. Add `figma-context-mcp` to `.mcp.json`
3. Prompt Claude Code:

```
Implement the Figma frame [URL] as a Space Age component.
Rules:
- Inline styles only (no Tailwind/CSS modules)  
- Use CSS vars from src/app/globals.css (--fg, --fg-dim, --fg-muted, --orange, --agent-{id}, etc.)
- Fonts: Orbitron for names/titles, Rajdhani (uppercase) for labels, DM Sans for body, JetBrains Mono for data
- Glass card: background rgba(255,255,255,0.035), border 1px solid rgba(255,255,255,0.07), backdropFilter blur(48px) saturate(200%)
- Padding scale: 28px 32px page, 16px 18px standard card, 8px 10px tight
- Match Figma layout exactly, then apply Space Age VL-01 tokens
```

### Pattern 2 — Live Figma editing (cursor-talk-to-figma-mcp)

When you want Claude Code to generate designs directly in Figma:

1. Start `bun socket` (WebSocket relay)
2. Open Figma plugin in Figma desktop
3. Add `TalkToFigma` to `.mcp.json`
4. Prompt: "Create a Space Age agent card in the current Figma file for an agent named Hermes with color #f5a623"

### Pattern 3 — Design token sync plugin

Fork `variables-import-export` to sync Space Age's CSS vars to Figma variables:

```typescript
// Export from Space Age globals.css
const tokens = {
  '--orange':      { r: 1,    g: 0.42, b: 0 },
  '--fg':          { r: 0.94, g: 0.96, b: 1 },
  '--fg-dim':      { r: 0.61, g: 0.64, b: 0.77 },
  '--fg-muted':    { r: 0.35, g: 0.38, b: 0.54 },
  '--agent-claude':  { r: 1,  g: 0.42, b: 0 },
  // ...
};

// Write as Figma Variables
const collection = figma.variables.createVariableCollection('Space Age VL-01');
Object.entries(tokens).forEach(([name, rgb]) => {
  const v = figma.variables.createVariable(name, collection, 'COLOR');
  v.setValueForMode(collection.defaultModeId, rgb);
});
```

---

## MCP Config Reference

Complete `.mcp.json` to enable all three (pick what you need):

```json
{
  "mcpServers": {
    "figma-read": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"],
      "description": "Read Figma designs for implementation (figma-context-mcp)"
    },
    "figma-write": {
      "command": "bun",
      "args": ["tools/figma/cursor-talk-to-figma-mcp/src/talk_to_figma_mcp/server.ts"],
      "description": "Bidirectional Figma editing (requires bun socket running)"
    }
  }
}
```

---

## Sources

- `tools/figma/figma-context-mcp/` — Framelink MCP server (GLips/Figma-Context-MCP)
- `tools/figma/cursor-talk-to-figma-mcp/` — Bidirectional bridge (grab/cursor-talk-to-figma-mcp)
- `tools/figma/plugin-samples/` — Official plugin API samples (figma/plugin-samples)
