---
name: sa-knowledge-work-plugins
description: >
  SA-enhanced version of Anthropic's official knowledge-work-plugins library
  (anthropics/knowledge-work-plugins, ~16.2k stars). Covers all 11 official
  role plugins (Sales, Product Management, Marketing, Legal, Finance, Data,
  Customer Support, Enterprise Search, Bio Research + 2 more) PLUS Space Age
  custom plugins for: Cinematic Web Production, Lead Gen Pipeline Operator,
  Record Exec in a Box, Credit Repair Agent, and Social Media Director.
  Use when: deploying Claude for a specific client role, installing plugins
  into Claude Code or Claude Cowork, building a custom plugin for a new
  Space Age service vertical, or When a client needs a "specialist" Claude
  that knows their domain out of the box. One-line install for any role.
  All plugins are markdown + JSON — no code, no infra.
license: Space Age AI Solutions — internal use
---

# SA Knowledge Work Plugins Skill
## Base: anthropics/knowledge-work-plugins | SA-extended May 2026

---

## WHAT THIS SKILL DOES

Turns Claude into a domain specialist for any business role. Each plugin
bundles: slash commands, tool connections, terminology dictionaries,
decision frameworks, and workflow automations specific to that role.
Works in Claude Code, Claude Cowork, and API system prompts.

---

## OFFICIAL ANTHROPIC PLUGINS (11)

### Install (Claude Code)
```bash
# Individual install
claude plugin install sales@knowledge-work-plugins
claude plugin install product-management@knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins
claude plugin install legal@knowledge-work-plugins
claude plugin install finance@knowledge-work-plugins
claude plugin install data@knowledge-work-plugins
claude plugin install customer-support@knowledge-work-plugins
claude plugin install enterprise-search@knowledge-work-plugins
claude plugin install bio-research@knowledge-work-plugins

# Install all
claude plugin install --all anthropics/knowledge-work-plugins
```

### Plugin Tool Connections Matrix

| Plugin | Connected Tools | SA Relevance |
|--------|----------------|--------------|
| Sales | HubSpot, Close, Clay, ZoomInfo | Lead gen pipeline CRM |
| Marketing | Buffer, Canva, Analytics APIs | Social media + content |
| Legal | Box, Egnyte, DocuSign | Credit repair docs |
| Finance | QuickBooks, Stripe, Plaid | Space Age billing |
| Data | Snowflake, Databricks, BigQuery | Lead data warehouse |
| Product Mgmt | Linear, Jira, Notion | Sub-brand roadmaps |
| Customer Support | Intercom, Zendesk, Freshdesk | Encore, client support |
| Enterprise Search | Elasticsearch, Pinecone | Knowledge graph queries |
| Bio Research | PubMed, UniProt, ChEMBL | N/A |

---

## SA CUSTOM PLUGINS (Space Age Extensions)

### Plugin: sa-lead-gen-operator
Specialist for the Space Age Google Maps lead gen pipeline
Slash commands: /scan-lead, /build-brief, /write-outreach, /deploy-vapi, /check-pipeline-status
Tool connections: google-maps-api, firecrawl, vapi-api, airtable
Skills loaded: lead-to-brief, outreach-copywriter, vapi-orchestrator
Context: Knows the $300-750 offer, local business psychology, 5-agent swarm

### Plugin: sa-cinematic-web
Web production specialist for Space Age cinematic sites
Slash commands: /build-site, /audit-site, /upgrade-site, /extract-brand, /deploy-site
Tool connections, firecrawl, digitalocean-api, github-api
Skills loaded: cinematic-website-builder, brand-extractor, ui-ux-designer, local-business-seo
Context: GSAP + ScrollTrigger, VL-01 Dark Glassmorphism, 33-moodboard library

### Plugin: sa-record-exec
Record Exec in a Box specialist agent
Slash commands: /onboard-artist, /generate-epk, /schedule-content, /generate-image, /run-weekly
Tool connections: higgsfield-mcp, canva-mcp, spotify-api, shopify-api
Skills loaded: record-exec-in-a-box, ai-content-creator, social-media-designer

### Plugin: sa-credit-repair
Tradeline Express credit repair specialist
Slash commands: /analyze-report, /generate-dispute, /write-affidavit, /respond-to-bureau, /negotiate-pay-delete
Tool connections: docusign-mcp, gmail-mcp
Skills loaded: credit-repair
Context: Accelerated Pressure Protocol Mode 3 always active. FCRA, FDCPA, Metro 2, UCC, CFPB.

---

## PLUGIN STRUCTURE

sa-plugin-name/
├── PLUGIN.md
├── slash_commands.json
├── tools.json
├── context.md
├── workflows/
└── templates/

---

## SA DEPLOYMENT PROTOCOL

1. git clone https://github.com/anthropics/knowledge-work-plugins
2. Copy relevant plugin folder
3. Add SA custom context to context.md
4. Add Space Age slash commands
5. Wire SA skills in tools.json
6. claude plugin install ./sa-custom-plugin
7. Test with /[command] test
8. Back up to Google Drive: 1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9

---

## REPO

- https://github.com/anthropics/knowledge-work-plugins (~16.2k stars)
