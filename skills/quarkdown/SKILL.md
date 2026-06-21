---
name: quarkdown
description: Markdown with superpowers — a Turing-complete document authoring language that compiles to HTML, PDF, or slides. Extends standard Markdown with functions, variables, conditionals, loops, and layout control. Use when the user needs to generate rich documents, presentations, or reports from structured Markdown source.
source: https://github.com/iamgio/quarkdown
---

## Overview

Quarkdown is a modern document language built on Markdown. It adds:

- **Functions** — reusable content blocks with parameters
- **Variables** — define and reference values throughout a document
- **Control flow** — conditionals, loops, iterations
- **Layout control** — multi-column, page breaks, custom themes
- **Multiple output targets** — HTML (paged/slides), PDF

## When to Use

- Generating documents or reports programmatically
- Creating presentations from Markdown
- Any doc that needs dynamic content, variables, or reuse

## Key Commands

```bash
# Compile a .qmd document
quarkdown compile input.qmd

# Watch mode
quarkdown compile input.qmd --watch
```

## File Extension

`.qmd` — Quarkdown source files

## Attribution

iamgio/quarkdown — MIT License
