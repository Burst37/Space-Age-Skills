---
name: google-maps-scraper
version: 1.0.0
description: Reusable Google Maps business lead scraping workflow adapted from the uploaded google-maps-scraper-kit for Codex and Space Age Website Factory lead generation.
---
# Google Maps Scraper — Codex Skill

## Use when
Collecting local-business leads by vertical + geography for research, qualification, outreach, or Website Factory intake.

## Workflow
1. Define business category, geography, result target, and required fields.
2. Prefer approved/local scraper tooling from the source kit; inspect setup before running.
3. Capture business name, address, phone, website, rating, review count and source URL when available.
4. Normalize and deduplicate records.
5. Validate URLs/phones where practical.
6. Export structured CSV/JSON/Sheet-ready rows.
7. For Website Factory, hand results to secondary website crawl and viability scoring.

## Safety/reliability
Respect site terms, robots/access restrictions, rate limits, and applicable law. Never fabricate missing business data. Mark unavailable fields null. Keep raw source separately from normalized output.

## Output contract
Return query, geography, timestamp, raw count, deduped count, failures, and structured records.
