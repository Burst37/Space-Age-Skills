---
name: browserbase-browser
description: Browser automation via the browse CLI. Use for interactive browser sessions, form filling, web scraping with JavaScript execution, and authenticated site access.
allowed-tools: Bash
---

# BROWSERBASE BROWSER
## Space Age AI Solutions — Automated Browser Skill

## When to load this skill

- Need to interact with JavaScript-heavy sites
- Form filling or button clicking required
- Authenticated access to web apps
- Screenshots of live pages
- Multi-step web workflows

---

## BROWSE CLI BASICS

```bash
# Navigate to URL
browse open https://example.com

# Take screenshot
browse screenshot https://example.com --output page.png

# Click element
browse click "button[data-id='submit']"

# Fill form
browse fill "input[name='email']" "user@example.com"
browse fill "input[name='password']" "$PASSWORD"
browse click "button[type='submit']"

# Extract text
browse extract "h1" --format text

# Run JavaScript
browse eval "document.title"

# Wait for element
browse wait "[data-loaded='true']" --timeout 10000
```

---

## AUTHENTICATED SCRAPING

```bash
# Session with cookies
browse session start
browse open https://app.example.com/login
browse fill "[name='username']" "$USERNAME"
browse fill "[name='password']" "$PASSWORD"
browse click "button[type='submit']"
browse wait ".dashboard" --timeout 10000
browse extract ".user-data" --format json
browse session end
```

---

## LEAD GEN USE CASE

For production pipeline Phase 0 supplement:
```bash
# Scrape business details from site
browse open "$BUSINESS_URL"
browse extract "[itemtype='LocalBusiness']" --format json
browse extract "a[href^='tel:']" --format text  # phone
browse extract "a[href^='mailto:']" --format text  # email
browse screenshot --output site-preview.png
```

---

## WHAT TO AVOID

- Don't use for sites that prohibit automated access in their TOS
- Don't run concurrent sessions without confirming session limits
- Don't store credentials in scripts — use environment variables
