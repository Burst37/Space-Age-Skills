---
name: browser
description: >
  Automate web browser interactions using natural language via CLI commands. Use when
  the user asks to browse websites, navigate web pages, extract data from websites,
  take screenshots, fill forms, click buttons, or interact with web applications.
  Supports remote Browserbase sessions with automatic CAPTCHA solving, anti-bot stealth
  mode, and residential proxies — ideal for scraping protected websites, bypassing bot
  detection, and interacting with JavaScript-heavy pages.
compatibility: >
  Requires the browse CLI (`npm install -g @browserbasehq/browse-cli`).
  Remote Browserbase sessions need `BROWSERBASE_API_KEY`.
  Local mode uses Chrome/Chromium on your machine.
license: MIT
allowed-tools: Bash
bins:
  - node
  - "@browserbasehq/browse-cli"
  - browse
---

# Browser Automation

Automate browser interactions using the browse CLI with Claude.

---

## Setup check

Before running any browser commands, verify the CLI is available:

```bash
which browse || npm install -g @browserbasehq/browse-cli
```

---

## Environment Selection (Local vs Remote)

The CLI supports explicit per-session environment overrides. If you do nothing, the next
session defaults to Browserbase when `BROWSERBASE_API_KEY` is set and to local otherwise.

### Local mode

- `browse env local` starts a clean isolated local browser
- `browse env local --auto-connect` reuses an already-running debuggable Chrome and falls back to isolated if nothing is available
- `browse env local <port|url>` attaches to a specific CDP target
- Best for: development, localhost, trusted sites, and reproducible runs

### Remote mode (Browserbase)

- `browse env remote` switches the current session to Browserbase
- Without a local override, Browserbase is also the default when `BROWSERBASE_API_KEY` is set
- Provides: anti-bot stealth, automatic CAPTCHA solving, residential proxies, session persistence
- **Use remote mode when:** the target site has bot detection, CAPTCHAs, IP rate limiting, Cloudflare protection, or requires geo-specific access
- Get credentials at https://browserbase.com/settings

### When to choose which

| Scenario | Mode |
|---|---|
| Repeatable local testing / clean state | `browse env local` |
| Reuse your local login/cookies | `browse env local --auto-connect` |
| Simple browsing (docs, wikis, public APIs) | local mode |
| Protected sites (login walls, CAPTCHAs, anti-scraping) | `browse env remote` |
| Local mode fails with bot detection | switch to remote |

---

## Commands

All commands work identically in both modes. The daemon auto-starts on first command.

### Navigation

```bash
browse open <url>                        # Go to URL (aliases: goto)
browse open <url> --context-id <id>      # Load Browserbase context (remote only)
browse open <url> --context-id <id> --persist  # Load context + save changes back
browse reload                            # Reload current page
browse back                              # Go back in history
browse forward                           # Go forward in history
```

### Page state (prefer snapshot over screenshot)

```bash
browse snapshot                          # Get accessibility tree with element refs (fast, structured)
browse screenshot [path]                 # Take visual screenshot (slow, uses vision tokens)
browse get url                           # Get current URL
browse get title                         # Get page title
browse get text <selector>               # Get text content (use "body" for all text)
browse get html <selector>               # Get HTML content of element
browse get value <selector>              # Get form field value
```

Use `browse snapshot` as your default for understanding page state — it returns the
accessibility tree with element refs you can use to interact. Only use `browse screenshot`
when you need visual context (layout, images, debugging).

### Interaction

```bash
browse click <ref>                       # Click element by ref from snapshot (e.g., @0-5)
browse type <text>                       # Type text into focused element
browse fill <selector> <value>           # Fill input and press Enter
browse select <selector> <values...>     # Select dropdown option(s)
browse press <key>                       # Press key (Enter, Tab, Escape, Cmd+A, etc.)
browse drag <fromX> <fromY> <toX> <toY>  # Drag from one point to another
browse scroll <x> <y> <deltaX> <deltaY> # Scroll at coordinates
browse highlight <selector>              # Highlight element on page
browse is visible <selector>             # Check if element is visible
browse is checked <selector>             # Check if element is checked
browse wait <type> [arg]                 # Wait for: load, selector, timeout
```

### Session management

```bash
browse stop                              # Stop the browser daemon
browse status                            # Check daemon status (includes env)
browse env                               # Show current environment
browse pages                             # List all open tabs
browse tab_switch <index>                # Switch to tab by index
browse tab_close [index]                 # Close tab
```

---

## Typical workflow

1. `browse env remote` — switch to Browserbase for Maps/protected sites
2. `browse open <url>` — navigate to the page
3. `browse snapshot` — read the accessibility tree to understand structure and get refs
4. `browse click <ref>` / `browse type <text>` / `browse fill <selector> <value>` — interact
5. `browse snapshot` — confirm the action worked
6. Repeat 4-5 as needed
7. `browse stop` — close the browser when done

### Quick Example — Google Maps Lead Scrape

```bash
browse env remote
browse open "https://www.google.com/maps/search/plumber+near+Dallas+TX"
browse snapshot                          # see listings
browse get text .section-result-content  # extract business info
browse scroll 0 0 0 3000                # scroll to load more
browse stop
```

---

## Mode Comparison

| Feature | Local | Browserbase |
|---|---|---|
| Speed | Faster | Slightly slower |
| Setup | Chrome required | API key required |
| Reuse existing local cookies | With `--auto-connect` | N/A |
| Stealth mode | No | Yes |
| CAPTCHA solving | No | Yes |
| Residential proxies | No | Yes (201 countries) |
| Session persistence | No | Yes (contexts) |
| Best for | Dev/simple pages | Protected sites, production scraping |

---

## Best Practices

1. Use `browse env remote` for all Google Maps scraping — it has bot detection
2. Always `browse open` first before interacting
3. Use `browse snapshot` to check page state — it's fast and gives element refs
4. Only screenshot when visual context is needed
5. Use refs from snapshot to click/interact — e.g., `browse click @0-5`
6. `browse stop` when done to clean up

---

## Troubleshooting

| Error | Fix |
|---|---|
| "No active page" | Run `browse stop`, then retry |
| Chrome not found | Install Chrome or use `browse env remote` |
| Action fails | Run `browse snapshot` to see available elements |
| Browserbase fails | Verify `BROWSERBASE_API_KEY` is set |
| Bot detection / 403 | Switch to `browse env remote` |

---

## Space Age Pipeline Integration

```
browserbase-browser skill
        ↓  browse env remote
browse open "maps.google.com/search/..."
        ↓  browse snapshot → browse scroll → browse get text
raw lead data
        ↓
browserbase-scraper skill (quality scoring + CSV output)
        ↓
lead-to-brief skill
```
