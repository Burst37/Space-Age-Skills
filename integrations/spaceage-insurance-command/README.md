# Space Age Insurance Intelligence — Liquid Glass Dashboard

A **runnable static frontend prototype**, designed for Space Age's insurance lead workflow. Open `index.html` in any modern browser. It works without dependencies.

## What works now
- Five responsive liquid-glass screens and neumorphic controls.
- Configure a commercial prospect search and **download a machine-readable scraping job manifest**.
- Import business prospect CSV, add records, deduplicate by business name, search/filter, mark leads for review, export CSV.
- Local session metrics, scoring pipeline visualization and activity feed.
- Preliminary non-sensitive auto quote intake and handoff summary.
- Skill integration readiness list and implementation checklist.

**What is not connected**: live scrapers, a production database, voice bot, consent management, CRM, carrier comparative rater, or agency licensing workflow. Numbers begin at zero, not fabricated. Imported records live in memory only and reset on refresh.

## CSV schema
`name,city,type,phone,website,score,status`

## Adapter manifest
The Discovery screen emits JSON with a target market, geographic scope, business category, desired adapter, result limit and scoring threshold. Build an authenticated backend job worker to consume it.

Suggested server API design:
- `POST /api/discovery/jobs` — submit an authenticated, rate-limited prospect discovery job.
- `GET /api/discovery/jobs/:id` — report status and evidence.
- `GET /api/leads` — list permitted public business leads.
- `POST /api/leads/import` — validate import and source provenance.
- `POST /api/quote-sessions` — issue short-lived, privacy-preserving handoff URL.
- `POST /api/quotes/submit` — via licensed agency's approved rating integration only.
- `POST /api/consents` — store consumer consent evidence.

## Connecting existing skills
The UI contains named adapters for the Space Age decision router, Google Maps discovery, Firecrawl and Playwright fallbacks, plus an orchestrator hook. The correct production integration is a backend worker/service adapter, **not** executing arbitrary Google Drive Markdown skills directly from the browser. Confirm actual skill version and supported command schemas, then implement per-source adapters.

## Privacy/security boundaries
- Discovery jobs collect only public business metadata, not driver's licenses, SSNs, DOB, or other sensitive personal data.
- Do not put driver's license data into CSV, localStorage, analytics, AI transcripts or client-side logs.
- Obtain affirmative informed consumer authorization for quote prefill/underwriting where required.
- Use carrier/agency approved secure intake systems; a properly secured backend; strict access controls; encryption; audit trail; retention policy.
- Insurance rate returns require carrier/rater contracts, permissions and licensed agency review. Quotes in this UI are **not real-time**.
- Apply TCPA, DNC, CAN-SPAM and relevant federal/state insurance laws as applicable, with legal review prior to production outreach.

## Production upgrade
Convert this static prototype to Next.js + authenticated Supabase or Postgres with row-level permissions, background job queue (e.g., BullMQ), adapters for scraping, licensed agency comparative-rater integration, consent recording, CRM connector, and end-to-end tests. Never expose scraping credentials or rating credentials in frontend source.
