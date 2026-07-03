---
name: free-for-dev
description: Curated catalog of infrastructure/developer services with genuine free tiers (cloud, CI/CD, monitoring, APIs, CDN, databases, and more) from the free-for.dev community list. Use when evaluating whether a free tier exists for a service before recommending a paid one, or when picking infra for a new project on a budget.
source: https://github.com/ripienaar/free-for-dev
---

## Overview

`free-for.dev` is a long-running, community-maintained (1600+ contributors) list of SaaS/PaaS/IaaS offerings with genuine free developer tiers — scoped specifically to infrastructure services (cloud, CI/CD, monitoring, databases, APIs, CDN), not general "free software" or self-hosted tools. Per the list's own inclusion bar: a service must offer a free tier (not just a trial), that tier must last at least a year if time-bucketed, and it can't restrict TLS to paid-only.

`REFERENCE.md` in this folder is the full list, mirrored for offline/fast lookup. It changes frequently upstream (add/remove as offerings change) — re-sync periodically:

```bash
curl -s https://raw.githubusercontent.com/ripienaar/free-for-dev/main/README.md -o REFERENCE.md
```

## How to use this

Before recommending a paid tool for infrastructure needs (hosting, CI, monitoring, a database, a CDN, an API), grep `REFERENCE.md` first — there's a real chance a free tier already covers what's needed, especially for early-stage projects or a client's MVP phase:

```bash
grep -i -A2 "cdn\|monitoring\|postgres" skills/free-for-dev/REFERENCE.md
```

Categories covered include: major cloud providers' always-free limits, analytics/events/statistics, APIs/data/ML, artifact repos, BaaS, low-code platforms, CDN and protection, CI/CD, and many more — see the Table of Contents at the top of `REFERENCE.md`.

## Gotchas

- This is specifically about *hosted* free tiers — it explicitly excludes self-hosted software (that's what the `refund-stack` skill in this repo is for instead).
- "Free tier" claims drift — providers change pricing/limits without much notice. Treat entries as a starting point to verify against the provider's current pricing page, not as guaranteed-current fact, especially for anything that's been in `REFERENCE.md` for a while.
