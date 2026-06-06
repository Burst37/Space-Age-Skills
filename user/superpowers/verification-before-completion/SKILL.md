---
name: verification-before-completion
description: Use before declaring any task done — evidence must precede completion claims. No exceptions.
source: https://github.com/obra/superpowers
license: MIT
---

# Verification Before Completion

**Mandate:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

This applies universally — no exceptions based on confidence, fatigue, or circumstances.

## The Verification Process

Before asserting any positive status, follow these steps in order:

1. **Identify** the command that proves your claim
2. **Execute** it completely and freshly (not a cached result)
3. **Read** the full output and exit codes
4. **Verify** whether results match your assertion
5. **Only then** state your claim with the supporting evidence

## What Disqualifies Claims

- Using hedging language: "should", "probably", "seems"
- Expressing satisfaction before running verification
- Trusting agent self-reports without independent confirmation
- Relying on partial checks or related-but-different evidence
- Claiming build success based solely on linter output
- "I tested this manually" without running the automated suite

## Examples

**Wrong:**
> "The tests should pass now — I fixed the null check."

**Right:**
```bash
npm test
# PASS — 47 tests, 0 failures
```
> "Tests pass: 47/47."

**Wrong:**
> "The scraper is working, I can see results in the console."

**Right:**
```bash
node scraper.js --category plumber --city Dallas --state TX --max-results 5
# → leads_Dallas_plumber_1716000000.csv (5 rows)
wc -l leads_Dallas_plumber_1716000000.csv
# 6
```
> "Scraper confirmed working: 5 leads written to CSV."

## Space Age Application

Before reporting any pipeline step complete:
- Browserbase scraper → show the CSV row count
- Image generation → show the result URL
- Site deploy → show the live Vercel URL
- Voice agent deploy → show the Vapi agent ID

**If you cannot show the evidence, the task is not done.**
