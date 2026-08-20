# codebase-memory-mcp

Persistent MCP codebase memory — indexes your entire codebase once, stores it in a local vector DB, answers structural questions in sub-millisecond queries. Supports 158 languages.

## Source
`DeusData/codebase-memory-mcp` on GitHub

## What This Skill Covers
- One-time codebase indexing → persistent memory across Claude sessions
- Sub-ms semantic search across the full codebase
- "Where is X defined?", "What calls Y?", "Show me all uses of Z" answered instantly
- Works offline — no data leaves your machine
- Supports: JS/TS, Python, Go, Rust, Ruby, PHP, Java, C/C++, and 150+ more

## Setup (One Time)

```bash
# Install
npx @deusdata/codebase-memory-mcp init

# Index your project (run from project root)
npx @deusdata/codebase-memory-mcp index .

# Add to Claude MCP config (~/.claude/claude_desktop_config.json)
{
  "mcpServers": {
    "codebase-memory": {
      "command": "npx",
      "args": ["@deusdata/codebase-memory-mcp", "serve", "/path/to/project"]
    }
  }
}
```

Re-index after major refactors: `npx @deusdata/codebase-memory-mcp index . --update`

## Slash Commands

### `/find [symbol-or-concept]`
Find where something is defined or used across the entire codebase.

**Examples:**
- `/find UserAuthMiddleware` — where is this defined and where is it used?
- `/find "rate limiting"` — find all rate limiting implementations
- `/find database connection` — find all DB connection patterns

**Steps:**
1. Query the MCP with the symbol/concept
2. Return: file path, line number, surrounding context (±5 lines)
3. Group results: definitions first, then usages

### `/trace [function-name]`
Full call chain trace — who calls this function, and what does it call?

**Steps:**
1. Find the function definition
2. Find all callers (upstream)
3. Find all callees (downstream)
4. Output as a tree:
```
UserService.createUser()
  ← AuthController.register() [controllers/auth.ts:45]
  ← AdminController.importUsers() [controllers/admin.ts:112]
  → validateEmail() [utils/validation.ts:23]
  → hashPassword() [utils/crypto.ts:67]
  → db.users.create() [models/user.ts:89]
```

### `/impact [file-or-function]`
Before modifying something, understand what breaks if you change it.

**Steps:**
1. Find all direct imports/usages
2. Find transitive dependencies (2 levels deep)
3. Flag high-risk touch points (used in 10+ places, used in tests, used in public API)
4. Output: change impact score (Low / Medium / High) with reasoning

### `/dead-code`
Find unused exports, functions, and variables.

**Steps:**
1. List all exports in the codebase
2. Cross-reference against all imports
3. Flag exports with zero usages
4. Also flag: functions defined but never called, variables assigned but never read

### `/arch-map`
Generate an architecture map of the codebase.

**Output:**
- Entry points (main files, index files, CLI entrypoints)
- Layer diagram: routes → controllers → services → models → DB
- External dependencies grouped by category (auth, DB, HTTP, AI, storage)
- Circular dependency warnings

### `/refactor-safe [old-name] [new-name]`
Rename a symbol safely across the entire codebase.

**Steps:**
1. Find all usages (definitions + imports + string references)
2. List every file that needs updating
3. Show a diff preview
4. Apply only after confirmation
5. Verify zero remaining references to old name

## Query Examples

```
# Natural language queries the MCP understands:
"Show me all API endpoints"
"Find all database migrations"
"Where are environment variables read?"
"What files import from utils/?"
"Show me all error handling patterns"
"Find all TODO and FIXME comments"
"What tests cover the payment module?"
```

## When to Use
- Starting work on an unfamiliar codebase
- Before any refactor — understand blast radius first
- Debugging: trace a bug through the call chain
- Code review: quickly understand what changed and what it affects
- Architecture review: get a map of the full system
