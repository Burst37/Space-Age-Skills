---
name: browserbase-cli
description: >
  Use the Browserbase CLI (`bb`) for Browserbase Functions and platform API workflows.
  Use when the user asks to run `bb`, deploy or invoke functions, manage sessions,
  projects, contexts, or extensions, fetch a page through the Browserbase Fetch API,
  search the web through the Browserbase Search API, or scaffold starter templates.
  Prefer the Browser skill for interactive browsing; use `bb browse` only when the user
  explicitly wants the Browserbase CLI path.
compatibility: >
  Requires the Browserbase CLI (`npm install -g @browserbasehq/cli`).
  API commands require `BROWSERBASE_API_KEY`.
  `BROWSERBASE_PROJECT_ID` is only needed for `bb functions dev` and `bb functions publish`.
  `bb browse` additionally requires `npm install -g @browserbasehq/browse-cli`.
license: MIT
allowed-tools:
  - Bash
  - Browserbase CLI
---

# Browserbase CLI (`bb`)

Use the official `bb` CLI for Browserbase platform operations, Functions workflows,
and Fetch/Search API calls.

---

## Setup check

```bash
which bb || npm install -g @browserbasehq/cli
bb --help

export BROWSERBASE_API_KEY="bb_live_8jAsnudKvYpjVctGAiijaVENlek"
export BROWSERBASE_PROJECT_ID=""  # required for bb functions dev/publish
```

---

## When to use this skill

- Run Browserbase commands through `bb`
- Scaffold, develop, publish, or invoke Browserbase Functions
- Inspect or manage sessions, projects, contexts, or extensions
- Fetch a page without opening a browser session
- Search the web without opening a browser session
- Browse or scaffold starter templates

## When NOT to use this skill

- Interactive browsing, screenshots, clicking, typing → use the `browser` skill
- Simple HTTP content retrieval → use the `fetch` skill

---

## Common Workflows

### Functions

```bash
bb functions init my-function
cd my-function
bb functions dev index.ts
bb functions publish index.ts
bb functions invoke <function_id> --params '{"url":"https://example.com"}'
bb functions invoke --check-status <invocation_id>  # poll existing invocation
```

### Platform APIs

```bash
bb projects list
bb sessions create --proxies --advanced-stealth --region us-east-1
bb sessions create --solve-captchas --context-id ctx_abc --persist
bb sessions get <session_id>
bb sessions downloads get <session_id> --output session-artifacts.zip
bb contexts create --body '{"region":"us-west-2"}'
bb extensions upload ./my-extension.zip
```

### Fetch API

```bash
bb fetch https://example.com
bb fetch https://example.com --allow-redirects --output page.html
```

### Search API

```bash
bb search "plumber Dallas TX"
bb search "hvac contractor Houston" --num-results 10
bb search "electrician reviews" --output results.json
```

### Templates

```bash
bb templates list
bb templates list --language typescript
bb templates clone form-filling --language typescript
bb templates clone amazon-product-scraping --language python ./my-scraper
```

### Install Skills

```bash
bb skills install  # install Browserbase agent skills for Claude Code
```

---

## Best Practices

1. Run `bb --help` and subgroup `--help` before guessing flags
2. Use dash-case flags exactly as shown in CLI help
3. Use `--output <file>` on `bb fetch` and `bb search` to save results
4. Use environment variables for auth
5. Pass structured request bodies with JSON strings in `--body` or `--params`
6. `bb functions ...` uses `--api-url`; platform API commands use `--base-url`
7. If `bb browse` fails, install `@browserbasehq/browse-cli` or switch to browser skill

---

## Troubleshooting

| Error | Fix |
|---|---|
| Missing API key | Set `BROWSERBASE_API_KEY` or pass `--api-key` |
| Missing project ID | Set `BROWSERBASE_PROJECT_ID` or pass `--project-id` |
| Unknown flag | Run the command with `--help` |
| `bb browse` error | Run `npm install -g @browserbasehq/browse-cli` |

---

## Space Age Pipeline Integration

```bash
# Create a stealth session for Maps scraping
bb sessions create --proxies --advanced-stealth --solve-captchas --region us-west-2

# Fetch a business website for enrichment
bb fetch https://businesswebsite.com --output enrichment.html

# Search for leads when Maps is throttled
bb search "plumber Dallas TX reviews" --num-results 20 --output leads.json

# Deploy the scraper as a scheduled Function
bb functions publish scraper.ts
bb functions invoke <function_id> --params '{"category":"plumber","city":"Dallas","state":"TX"}'
```
