---
name: stealth-browser-automation
description: Use when the user wants to automate browsing a website that's hard to script normally — e.g. "scrape this site", "fill out this form on X", "search Google/YouTube/Amazon and pull results", "log into my account on Y and check Z" — and a camofox-browser server is running locally. Always confirm the target site's terms of service permit automated access before scripting it.
---

# Stealth Browser Automation (camofox-browser)

## Overview

[jo-inc/camofox-browser](https://github.com/jo-inc/camofox-browser) runs a Camoufox (anti-detection Firefox) instance behind a REST API on `localhost:9377`, giving agents a tab/snapshot/click/type loop plus search macros (`@google_search`, `@youtube_search`, etc.) for sites that block plain headless browsers. The AGENTS.md documents the API surface but has no guidance on *when not to use it* — anti-detection browsing is dual-use: legitimate for sites with bot-friendly ToS or for the user's own accounts, problematic for sites that explicitly prohibit automation. This skill adds that gate up front, plus a stale-ref recovery pattern (the most common failure mode in the snapshot/click loop).

## When to Use

- Automating interactions with a site that returns CAPTCHAs/bot walls to plain HTTP requests
- Logging into and checking the user's OWN accounts (email, shopping, social) via browser automation
- Search-and-extract tasks across Google/YouTube/Amazon/Reddit/etc. via the built-in macros
- NOT for sites whose ToS explicitly prohibits automated access for the requested purpose — ask the user to confirm or use a different approach (official API) if one exists
- NOT for mass-scale scraping, credential stuffing, or any activity that would constitute unauthorized access to others' accounts

## Core Pattern

**Pre-flight gate**: before scripting against a third-party site, briefly note (a) what data/action is being automated, (b) whether it's the user's own account or public data, and (c) whether the site has an official API that would be a better fit. If the target site's ToS clearly prohibits automation for this use case, say so and ask the user how they want to proceed rather than scripting around it silently.

**Stale-ref recovery** (new): refs (`e1`, `e2`, ...) reset on every navigation and can also go stale after dynamic page updates (infinite scroll, AJAX). If a `/click` or `/type` call fails with an unknown-ref error, re-call `/snapshot` before retrying — never retry the same ref blindly, and never retry more than twice without re-snapshotting.

## Quick Reference

| Action | Endpoint |
|---|---|
| Create tab | `POST /tabs` |
| Navigate / search macro | `POST /tabs/:tabId/navigate` |
| Get accessibility snapshot (refs) | `GET /tabs/:tabId/snapshot` |
| Click | `POST /tabs/:tabId/click` (ref or selector) |
| Type | `POST /tabs/:tabId/type` (ref, text, optional pressEnter) |
| Scroll | `POST /tabs/:tabId/scroll` |
| Get links | `GET /tabs/:tabId/links` |
| Close tab | `DELETE /tabs/:tabId` |
| Wipe session data | `DELETE /sessions/:userId` |

Search macros: `@google_search`, `@youtube_search`, `@amazon_search`, `@reddit_search`, `@wikipedia_search`, `@twitter_search`, `@yelp_search`, `@linkedin_search`.

## Implementation

```
1. Pre-flight gate: confirm target site/use case is appropriate (own account, public
   data, or ToS-permitting). If unsure, ask the user before proceeding.
2. POST /tabs to create a tab (consistent userId/sessionKey for the task).
3. Navigate via /navigate (direct URL or @macro for search engines/sites).
4. GET /snapshot to get current refs + page content.
5. Click/type using refs from the latest snapshot.
6. After EVERY navigation, and after any click that triggers dynamic content load,
   re-snapshot before the next interaction — refs from a prior snapshot are not
   guaranteed valid.
7. On ref-not-found errors: re-snapshot once and retry; if it fails twice, fall back
   to CSS selector-based click/type instead of refs.
8. DELETE /tabs/:tabId when done; DELETE /sessions/:userId if the task is complete
   and no follow-up in this session needs the cookies/storage.
```

## Common Mistakes

- **Scripting a site without checking if automation is appropriate for that use case** — anti-detection browsing exists to handle bot-hostile sites, but that doesn't make every automated use case appropriate; flag ambiguous cases to the user.
- **Reusing refs across navigations** — refs are snapshot-scoped; a ref from before a page load/AJAX update is meaningless after.
- **Retrying a failed click on the same ref repeatedly** — re-snapshot first; the element may have moved, been removed, or the ref may have expired.
- **Leaving sessions open indefinitely** — `userId`/`sessionKey` carry cookies/storage; clean up with `DELETE /sessions/:userId` when a task involving login is done, especially for shared/temporary environments.

## Attribution

Forked from [jo-inc/camofox-browser](https://github.com/jo-inc/camofox-browser) (AGENTS.md API reference). Original documents the raw REST API; this skill adds the ToS/appropriateness pre-flight gate and the stale-ref recovery pattern, both absent from the source docs.
