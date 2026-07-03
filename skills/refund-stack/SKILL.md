---
name: refund-stack
description: Catalog of 60 self-hostable open-source repos that replace common paid SaaS tools (email, VPN, HR/payroll, feature flags, analytics, backends, identity, ERP, e-commerce, and more). Use when evaluating whether a paid tool has an open-source self-hosted replacement, or when picking what to deploy next on the VPS.
source: Hyperautomation Labs — "The Refund Stack" field guide, 2026
---

## Overview

Reference list of 60 open-source GitHub repos, each replacing a specific paid tool. Grouped by the part of the guide they came from. Each entry: repo, what it replaces, GitHub link, and the primary way to stand it up. The GitHub link is always the source of truth for current setup steps — commands below were verified July 2026 and may drift.

Use `REPOS.md` in this folder for the full table (grep/lookup friendly). Below is the same data inline for quick reference.

## How to use this list

1. Pick the bill that hurts most — don't migrate everything at once.
2. Spin it up locally first (`docker compose up`) and kick the tires.
3. Move to a cheap VPS (see infra table in root `CLAUDE.md`) + domain + HTTPS.
4. Run in parallel with the paid tool for a month, then cancel.

Heavy ones (Supabase, PostHog, ERPNext, Huly, Nextcloud) want a real VPS with 8GB+ RAM.

Self-hosting saves the license fee, not the work — updates, backups, and security are on you. Treat identity, email, ERP, and payroll as real projects, not an afternoon.

## Part 6 — Deploy this weekend (exact commands)

| Repo | Replaces | GitHub | Command |
|---|---|---|---|
| Firecrawl | Apify / Firecrawl Cloud | github.com/firecrawl/firecrawl | `git clone firecrawl/firecrawl && docker compose up` |
| Postiz | Buffer / Hootsuite | github.com/gitroomhq/postiz-app | `git clone gitroomhq/postiz-docker-compose && docker compose up` |
| Huly | Linear + Slack + Notion | github.com/hcengineering/platform | `git clone hcengineering/huly-selfhost && ./setup.sh` |
| NetBird | Tailscale | github.com/netbirdio/netbird | `export NETBIRD_DOMAIN=vpn.you.com; curl -fsSL .../getting-started.sh \| bash` |
| Stalwart | Google Workspace (email) | github.com/stalwartlabs/stalwart | `docker run -d -p 443:443 -p 8080:8080 stalwartlabs/stalwart` |
| LanguageTool | Grammarly | github.com/languagetool-org/languagetool | `java -cp languagetool-server.jar org.languagetool.server.HTTPServer --port 8081` |
| Rybbit | Plausible Cloud + Hotjar | github.com/rybbit-io/rybbit | `git clone rybbit-io/rybbit && ./setup.sh your.domain` |
| solidtime | Toggl Track / Harvest | github.com/solidtime-io/solidtime | `docker compose up -d` then `artisan migrate` + `admin:user:create` |
| Frappe HR | BambooHR / Gusto | github.com/frappe/hrms | `git clone frappe/hrms && cd hrms/docker && docker-compose up` |
| GrowthBook | LaunchDarkly + Optimizely | github.com/growthbook/growthbook | `git clone growthbook/growthbook && docker compose up -d` |

Notes: Firecrawl is AGPL, self-host skips the cloud-only anti-bot Fire-engine layer. Postiz requires you to create/maintain each platform's OAuth dev app. Huly's hosted cloud shuts down July 20 2026 — self-host unaffected, needs 8GB RAM min (16 rec). NetBird control plane is AGPL, client is BSD-3; needs a public VM + domain + IdP. Stalwart is AGPL core; deliverability (DNS, IP reputation, port 25) is on you. LanguageTool premium AI rewriting is closed-source. Rybbit is AGPL (born Jan 2025), needs a ClickHouse pipeline. solidtime is AGPL, no built-in invoicing yet. Frappe HR is GPL-3.0, computes payroll but does not file taxes. GrowthBook core is MIT, needs event data in a warehouse.

## Part 5 — Enterprise stack

| Repo | Replaces | GitHub | Command |
|---|---|---|---|
| Supabase | Firebase + Auth0 | github.com/supabase/supabase | `git clone`, `cd docker`, `docker compose up -d` |
| Cal.com | Calendly | github.com/calcom/cal.com | `docker run -p 3000:3000 calcom/cal.com` |
| RustDesk | TeamViewer / AnyDesk | github.com/rustdesk/rustdesk | `docker run rustdesk/rustdesk-server hbbs` |
| Strapi | Contentful | github.com/strapi/strapi | `npx create-strapi-app@latest` |
| Gitea | GitHub Enterprise | github.com/go-gitea/gitea | `docker run -p 3000:3000 gitea/gitea` |
| Nextcloud | Dropbox Business | github.com/nextcloud/server | `docker run -d -p 8080:80 nextcloud` |
| Medusa | Shopify Plus | github.com/medusajs/medusa | `npx create-medusa-app@latest` |
| PostHog | Mixpanel / Amplitude | github.com/PostHog/posthog | `docker compose -f docker-compose.hobby.yml up -d` |
| Keycloak | Okta / Auth0 | github.com/keycloak/keycloak | `docker run quay.io/keycloak/keycloak start-dev` |
| ERPNext | NetSuite / SAP | github.com/frappe/erpnext | `docker compose -f pwd.yml up -d` (frappe_docker) |

## Part 4 — Workflow stack

| Repo | Replaces | GitHub | Command |
|---|---|---|---|
| n8n | Zapier / Make | github.com/n8n-io/n8n | `docker run docker.n8n.io/n8nio/n8n` |
| NocoDB | Airtable | github.com/nocodb/nocodb | `docker run nocodb/nocodb` |
| Mattermost | Slack | github.com/mattermost/mattermost | `docker run mattermost-team-edition` (Team Edition, not Entry) |
| Hoppscotch | Postman | github.com/hoppscotch/hoppscotch | `docker run hoppscotch/hoppscotch` |
| Plane | Jira / Linear | github.com/makeplane/plane | `./setup.sh` (Community Edition, not prime.plane.so) |
| Ghost | Substack | github.com/TryGhost/Ghost | `docker compose up -d` |
| Stirling-PDF | Adobe Acrobat Pro | github.com/Stirling-Tools/Stirling-PDF | `docker run stirlingtools/stirling-pdf` |
| Meilisearch | Algolia | github.com/meilisearch/meilisearch | `docker run getmeili/meilisearch` |
| SigNoz | Datadog | github.com/SigNoz/signoz | `docker compose up -d` (deploy/) |
| Chatwoot | Zendesk / Intercom | github.com/chatwoot/chatwoot | `docker compose up -d` |

## Part 3 — Business stack

| Repo | Replaces | GitHub | Command |
|---|---|---|---|
| Twenty | Salesforce | github.com/twentyhq/twenty | `git clone`, `docker compose up -d` |
| Appsmith | Retool | github.com/appsmithorg/appsmith | `docker run appsmith/appsmith-ce` |
| Apache Superset | Tableau / Looker | github.com/apache/superset | `docker compose` (image-tag) |
| DocuSeal | DocuSign | github.com/docusealco/docuseal | `docker run docusealco/docuseal` |
| Penpot | Figma | github.com/penpot/penpot | `docker compose up -d` |
| AFFiNE | Notion + Miro | github.com/toeverything/AFFiNE | `docker run ghcr.io/.../affine` |
| Cap | Loom | github.com/CapSoftware/Cap | desktop app + docker share server |
| Listmonk | Mailchimp | github.com/knadh/listmonk | `docker compose` (+ postgres) |
| Qdrant | Pinecone | github.com/qdrant/qdrant | `docker run qdrant/qdrant` |
| Vaultwarden | 1Password Business | github.com/dani-garcia/vaultwarden | `docker run vaultwarden/server` |

Heavier ones here (Superset) want 4GB+ RAM.

## Parts 1 & 2 — Where it started (AI-heavy)

| Repo | Replaces | GitHub | Command |
|---|---|---|---|
| AutoHedge | a quant trading desk | github.com/The-Swarm-Corporation/AutoHedge | `pip install -U autohedge` |
| Vibe-Trading | a pro trading terminal + analyst | github.com/HKUDS/Vibe-Trading | `git clone`, `pip install -r ...` |
| Fincept Terminal | Bloomberg Terminal ($27K/yr) | github.com/Fincept-Corporation/FinceptTerminal | pip / desktop |
| LibreChat | ChatGPT Plus ($20/mo) | github.com/danny-avila/LibreChat | `docker compose up -d` |
| Open Generative AI | Midjourney + Runway + Sora | github.com/Anil-matcha/Open-Generative-AI | `git clone`, docker |
| Open-LLM-VTuber | AI companion apps | github.com/Open-LLM-VTuber/Open-LLM-VTuber | `git clone`, pip / conda |
| Claude Ads | an agency ad audit ($2k–10k) | github.com/AgriciDaniel/claude-ads | Claude Code skill |
| Agentic Inbox | Superhuman ($30/mo) | github.com/cloudflare/agentic-inbox | `wrangler deploy` (Cloudflare) |
| Camofox | stealth-scraping APIs | github.com/jo-inc/camofox-browser | `pip install`, `git clone` |
| Hyperframes | paid video-render SaaS | github.com/heygen-com/hyperframes | `npm i`, `git clone` |
| Odysseus | ChatGPT Plus / Pro | github.com/pewdiepie-archdaemon/odysseus | docker / `git clone` (dev) |
| DeerFlow | ChatGPT Pro deep research ($200/mo) | github.com/bytedance/deer-flow | `git clone`, docker |
| Voicebox | ElevenLabs ($22–99/mo) | github.com/jamiepine/voicebox | desktop app / `git` |
| Open Notebook | NotebookLM / Google AI Pro ($20/mo) | github.com/lfnovo/open-notebook | `docker compose up` |
| Meetily | Otter + Fireflies ($17–18/mo) | github.com/Zackriya-Solutions/meetily | desktop app / docker |

Parts 1 & 2 list only 15 of the 20 original picks as captured in this guide; the remaining 5 weren't included in the source PDF.

## Weekend self-host checklist (applies to almost every repo above)

1. A capable VPS — $10–40/mo, 4–8GB RAM. Big ones (Huly, Supabase, ERPNext) want more.
2. Docker + Docker Compose installed.
3. A domain + HTTPS — subdomain + reverse proxy (Caddy) for automatic TLS.
4. Backups — nightly dump of data volumes to object storage. Don't skip this.
5. One tool at a time — migrate, run parallel a month, then cancel the paid plan.

When NOT to self-host: identity, email, ERP, and payroll are mission-critical — if no one owns uptime/security, the paid plan may be worth it.

## Attribution

Source: Hyperautomation Labs, "The Refund Stack" field guide (2026), hyperautomationlabs.co/free/refund. Verify current setup steps against each repo's own README before deploying — this list is a pointer, not a substitute for the docs.
