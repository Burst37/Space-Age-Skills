---
name: scrapling-web-scraping
version: 1.0.0
description: Adaptive web scraping and extraction workflow based on the uploaded Scrapling repository and its packaged agent skill. Use for static, dynamic, stealth-aware, spider, parsing, and RAG ingestion tasks.
---
# Scrapling Web Scraping — Codex Skill

## Route by page type
- static HTML: lightweight fetcher
- JavaScript/dynamic: browser/dynamic fetcher
- blocking/anti-bot conditions: stealth-capable route only when authorized
- many related pages: spider/crawl architecture

## Workflow
1. Define target, fields, scope, and legal/access constraints.
2. Inspect page structure before writing selectors.
3. Choose the least expensive fetch strategy that works.
4. Parse into explicit schemas.
5. Normalize and deduplicate.
6. Preserve provenance/source URLs.
7. Add retries/backoff for transient failures; do not blindly retry blocks.
8. Validate representative samples before scaling.
9. Export structured data for downstream agents/RAG/lead qualification.

## Rules
Never bypass authentication or access controls without authorization. Do not fabricate missing fields. Separate extraction failures from true null values.
