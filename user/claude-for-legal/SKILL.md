---
name: claude-for-legal
version: 1.0
updated: 2026-05-15
description: >
  Full-spectrum legal workflow intelligence for Space Age AI Solutions. Integrates the
  complete anthropics/claude-for-legal plugin suite — commercial, IP, employment, privacy,
  product, regulatory, AI governance, litigation, and corporate legal. Use when any Space Age
  property or client needs contract review, IP protection, dispute drafting, regulatory
  compliance, demand letters, FCRA/FDCPA legal escalation, AI vendor review, or any other
  legal workflow task. Routes automatically to the correct plugin and agent. All output is
  a draft for attorney review — never a final legal position. Load this skill before any
  legal task across the Record Exec, Credit Repair, or agency stacks.
---

# Claude for Legal — Space Age AI Solutions Integration
**Source:** `https://github.com/anthropics/claude-for-legal`
**License:** Apache-2.0 | Copyright 2026 Anthropic PBC
**Integration Owner:** Space Age AI Solutions | Mr. Black

> **All outputs from this skill are drafts for attorney review — not legal advice, not legal conclusions, not a substitute for a lawyer.** A licensed attorney reviews, verifies, and takes professional responsibility for anything that leaves the building. This skill accelerates that review — it does not replace it.

---

## SKILL POSITION IN THE STACK

This skill is a **supporting layer** — load it alongside the domain skill that triggered the legal need.

| Domain Skill Loaded | Legal Trigger | Load This Skill |
|---------------------|--------------|------------------|
| `credit-repair` | Demand letter, CFPB complaint, P4D agreement, bureau lawsuit | ✅ Load `claude-for-legal` |
| `record-exec-in-a-box` | Label deal, DMCA, trademark, vendor MSA, AI platform review | ✅ Load `claude-for-legal` |
| Neither / Agency level | Client service agreement, privacy compliance, AI governance | ✅ Load `claude-for-legal` |

**Never use this skill as the sole loaded skill for a credit repair or artist management task** — it handles legal escalation only, not the domain workflow.

---

## WHAT THIS IS

`claude-for-legal` is Anthropic's official reference suite of legal workflow plugins — 90+ named agents, 100+ slash-command skills, and MCP connectors to major legal systems. It covers every practice area relevant to Space Age AI Solutions operations:

| Plugin | Practice Area |
|--------|--------------|
| `commercial-legal` | Vendor agreements, NDAs, SaaS subscriptions, renewal tracking |
| `ip-legal` | Trademark, copyright, DMCA, FTO, OSS compliance, IP portfolio |
| `employment-legal` | Hire/term review, worker classification, leave, investigations |
| `privacy-legal` | DSAR, DPA review, PIA, GDPR/CCPA triage |
| `product-legal` | Launch review, marketing claims, feature risk |
| `regulatory-legal` | Reg feed watcher, policy diff, NPRM comment tracking |
| `ai-governance-legal` | AI use-case triage, AI impact assessments, vendor AI review |
| `litigation-legal` | Demand letters, claim charts, deposition prep, matter portfolio |
| `corporate-legal` | M&A diligence, closing checklists, board consents, entity compliance |
| `legal-clinic` | Structured intake, deadline tracking, clinic workflows |
| `legal-builder-hub` | Community skill discovery with trust gate |

---

## INSTALLATION

```bash
# Add marketplace
/plugin marketplace add https://github.com/anthropics/claude-for-legal

# Install by stack need (install all or just the ones below)
/plugin install commercial-legal@claude-for-legal
/plugin install ip-legal@claude-for-legal
/plugin install employment-legal@claude-for-legal
/plugin install privacy-legal@claude-for-legal
/plugin install product-legal@claude-for-legal
/plugin install regulatory-legal@claude-for-legal
/plugin install ai-governance-legal@claude-for-legal
/plugin install litigation-legal@claude-for-legal
/plugin install corporate-legal@claude-for-legal

# Cold-start interviews — REQUIRED before any plugin produces non-generic output
# Run once per plugin, seed with real documents from that practice area
/commercial-legal:cold-start-interview
/ip-legal:cold-start-interview
/litigation-legal:cold-start-interview
/regulatory-legal:cold-start-interview
/ai-governance-legal:cold-start-interview

# Updates
/plugin update
```

---

## MASTER ROUTING TABLE

### Commercial / Contracts

| Trigger | Agent | Command |
|---------|-------|-------|
| Inbound NDA from any party | NDA Triager | `/commercial-legal:review` |
| Vendor MSA / distributor agreement | Vendor Agreement Reviewer | `/commercial-legal:review` |
| SaaS subscription review | Vendor Agreement Reviewer | `/commercial-legal:review` |
| Contract amendment tracing | Amendment Tracer | `/commercial-legal:amendment-history` |
| Renewal deadline alert | Renewal Watcher | scheduled |
| Escalation routing for contract issues | Escalation Router | `/commercial-legal:escalation-flagger` |
| P4D agreement (Credit Repair) | Vendor Agreement Reviewer | `/commercial-legal:review` |

### Intellectual Property

| Trigger | Agent | Command |
|---------|-------|-------|
| Artist name / brand trademark clearance | Trademark Clearance Screener | `/ip-legal:clearance` |
| DMCA takedown — send | DMCA Takedown | `/ip-legal:takedown` |
| DMCA takedown — received, need counter-notice | DMCA Takedown | `/ip-legal:takedown` |
| Cease & desist — send or received | C&D Drafter | `/ip-legal:cease-desist` |
| Sample clearance / license type check | OSS Compliance Checker | `/ip-legal:oss-review` |
| IP clause review in any contract | IP Clause Reviewer | `/ip-legal:ip-clause-review` |
| Patent / copyright infringement triage | Infringement Triager | `/ip-legal:infringement-triage` |
| IP portfolio renewal deadlines | IP Renewal Watcher | scheduled |

### Employment / Independent Contractors

| Trigger | Agent | Command |
|---------|-------|-------|
| Session musician / producer classification | Worker Classification Screener | `/employment-legal:worker-classification` |
| Offer letter / restrictive covenant review | Hire Reviewer | `/employment-legal:hiring-review` |
| Termination review | Termination Reviewer | `/employment-legal:termination-review` |
| Policy drafting | Policy Drafter | `/employment-legal:policy-drafting` |
| Internal investigation (misconduct, harassment) | Investigation Lead | `/employment-legal:investigation-open` |
| Adverse action notice (background check) | Hire Reviewer | `/employment-legal:hiring-review` |

### Privacy & Data

| Trigger | Agent | Command |
|---------|-------|-------|
| DSAR from fan / customer | DSAR Responder | `/privacy-legal:dsar-response` |
| DPA review (vendor data processing) | DPA Reviewer | `/privacy-legal:dpa-review` |
| New data handling process (Shopify, email list, app) | PIA Generator | `/privacy-legal:pia-generation` |
| GDPR / CCPA triage | Privacy Triager | `/privacy-legal:use-case-triage` |
| Bureau data breach impact on client file | DSAR Responder | `/privacy-legal:dsar-response` |
| Privacy regulation change | Privacy Reg Gap Checker | `/privacy-legal:reg-gap-analysis` |

### Product & Marketing

| Trigger | Agent | Command |
|---------|-------|-------|
| Shopify product launch review | Launch Reviewer | `/product-legal:launch-review` |
| Marketing copy / ad claims review | Marketing Claims Checker | `/product-legal:marketing-claims-review` |
| Quick "is this a problem?" question | "Is this a problem?" Triage | `/product-legal:is-this-a-problem` |

### Regulatory

| Trigger | Agent | Command |
|---------|-------|-------|
| CFPB/FTC regulatory change monitoring | Reg Feed Watcher | `/regulatory-legal:reg-feed-watcher` |
| Policy gap from new regulation (FCRA, FDCPA, state) | Policy Diff | `/regulatory-legal:policy-diff` |
| Open gaps tracker (unfiled CFPB complaints, unresolved issues) | Gap Tracker | `/regulatory-legal:gaps` |
| NPRM comment period tracking | NPRM Comment Tracker | `/regulatory-legal:comments` |
| Policy redraft to close a compliance gap | Policy Redrafter | `/regulatory-legal:policy-redraft` |

### AI Governance

| Trigger | Agent | Command |
|---------|-------|-------|
| New AI tool / vendor onboarding review | Vendor AI Reviewer | `/ai-governance-legal:vendor-ai-review` |
| AI use case classification (approved / conditional / no) | AI Use Case Triager | `/ai-governance-legal:use-case-triage` |
| AI impact assessment for new automation | AI Impact Assessor | `/ai-governance-legal:aia-generation` |
| EU AI Act / state AI reg gap check | AI Reg Gap Checker | `/ai-governance-legal:reg-gap-analysis` |
| Higgsfield / Kling / Seedance vendor terms | Vendor AI Reviewer | `/ai-governance-legal:vendor-ai-review` |

### Litigation & Disputes

| Trigger | Agent | Command |
|---------|-------|-------|
| Demand letter — draft and send | Demand Letter Drafter | `/litigation-legal:demand-draft` |
| Demand letter — received, triage | Demand Received Triage | `/litigation-legal:demand-received` |
| Subpoena received | Subpoena Triage | `/litigation-legal:subpoena-triage` |
| Legal hold on client dispute evidence | Legal Hold | `/litigation-legal:legal-hold` |
| Case chronology (bureau/furnisher response timeline) | Chronology Builder | `/litigation-legal:chronology` |
| Matter intake (formalize new legal matter) | Matter Intake | `/litigation-legal:matter-intake` |
| Portfolio status (all active matters) | Portfolio Status | `/litigation-legal:portfolio-status` |
| Claim chart (patent or civil cause of action) | Claim Chart Builder | `/litigation-legal:claim-chart` |
| Brief section drafting | Brief Section Drafter | `/litigation-legal:brief-section-drafter` |
| Privilege log first-pass review | Privilege Log Reviewer | `/litigation-legal:privilege-log-review` |

---

## SPACE AGE STACK INTEGRATION MAP

### Record Exec in a Box
Primary plugins: `commercial-legal`, `ip-legal`, `employment-legal`, `product-legal`, `ai-governance-legal`

Key use cases:
- Label deal / feature split / sync license review → `/commercial-legal:review`
- Artist name trademark → `/ip-legal:clearance`
- DMCA on sampled track or content takedown → `/ip-legal:takedown`
- Session musician classification → `/employment-legal:worker-classification`
- AI image/video vendor terms (Higgsfield, Kling) → `/ai-governance-legal:vendor-ai-review`
- Shopify merch marketing claims → `/product-legal:marketing-claims-review`

### Credit Repair (Tradeline Express)
Primary plugins: `litigation-legal`, `regulatory-legal`, `privacy-legal`, `employment-legal`, `commercial-legal`

Key use cases:
- Demand letter to collector / bureau → `/litigation-legal:demand-draft`
- Inbound lawsuit / legal threat → `/litigation-legal:demand-received`
- CFPB complaint tracking → `/regulatory-legal:gaps`
- Bureau data breach chain-of-custody → `/privacy-legal:dsar-response`
- Client adverse action (background check) → `/employment-legal:hiring-review`
- P4D agreement execution → `/commercial-legal:review`
- Client matter intake + chronology → `/litigation-legal:matter-intake` + `/litigation-legal:chronology`

### Space Age AI Solutions (Agency)
Primary plugins: `commercial-legal`, `corporate-legal`, `privacy-legal`, `ai-governance-legal`

Key use cases:
- Client service agreements → `/commercial-legal:review`
- Renewal tracking on all client contracts → Renewal Watcher (scheduled)
- Agency privacy compliance (GDPR/CCPA for client data) → `/privacy-legal:pia-generation`
- AI tool vendor review (any new platform onboarded) → `/ai-governance-legal:vendor-ai-review`

---

## MCP CONNECTORS

| Connector | Status | Use |
|-----------|--------|-----|
| Google Drive | ✅ Connected | Contract storage, client files, dispute docs |
| DocuSign | Available | Service agreements, P4D execution, artist contracts |
| Slack | Available | Deadline alerts, legal hold notifications |
| CourtListener | Free / optional key | Federal FCRA/FDCPA/copyright case research |
| Trellis | Subscription | State court docket monitoring |
| Ironclad | Subscription | CLM if contract volume requires it |

Configure connectors in each plugin's `.mcp.json` or via `claude mcp`.

---

## REPOSITORY LAYOUT

```
commercial-legal/         # vendor/NDA/SaaS review, renewals, escalations
corporate-legal/          # M&A diligence, closing checklists, board consents
employment-legal/         # hire/term review, worker classification, leave
privacy-legal/            # DPA, DSAR, PIA, privacy triage
product-legal/            # launch review, marketing claims
regulatory-legal/         # reg feed watcher, policy diff, gap tracker
ai-governance-legal/      # AI use-case triage, AIAs, vendor AI review
ip-legal/                 # trademark, FTO, C&D, DMCA, OSS, portfolio
litigation-legal/         # matters, holds, demands, claim charts, depo prep
legal-clinic/             # intake, deadlines, memos (adapt for client intake)
legal-builder-hub/        # community skill discovery with trust gate
external_plugins/
  cocounsel-legal/        # Thomson Reuters Westlaw Deep Research (subscription)
managed-agent-cookbooks/  # headless deployment templates
scripts/                  # deploy-managed-agent.sh, validate.py, orchestrate.py
```

---

## MANAGED AGENT DEPLOYMENT (Scheduled Agents)

For always-on pipeline agents running on VPS (146.190.78.120):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
scripts/deploy-managed-agent.sh renewal-watcher     # contract renewal alerts
scripts/deploy-managed-agent.sh reg-monitor         # FCRA/FDCPA regulatory feed
scripts/deploy-managed-agent.sh docket-watcher      # court docket monitoring
scripts/deploy-managed-agent.sh launch-radar        # product launch review queue
```

Each deployed agent uses the same system prompt and skills as its plugin counterpart.
Routing via `scripts/orchestrate.py` — handles `handoff_request` events between agents.

---

## OPERATING RULES (NON-NEGOTIABLE)

1. **Draft only.** Every output is a draft. Never present as final legal position.
2. **Cold-start first.** Run `/<plugin>:cold-start-interview` before any plugin produces non-generic output. Seed with real documents.
3. **Research connector required for trusted citations.** Without CourtListener / Trellis, citations are flagged `[verify]`. Surface this to reviewing attorney.
4. **Send gate is enforced.** No demand letter, complaint, notice, or agreement leaves without attorney sign-off. This applies to Credit Repair demand letters, Record Exec C&D drafts, and all agency contracts.
5. **UPL protection.** Tradeline Express is not a law firm. All client-facing legal documents are "draft for your attorney's review" — never "here is your legal document."
6. **Privilege framing.** Internal case memos and investigation notes are drafted attorney-client privileged. Do not include in client deliverables without counsel review.
7. **P4D agreements are contracts.** Route through `/commercial-legal:review` before execution. Written agreement before any payment — non-negotiable.
8. **AI vendor review before onboarding.** Any new AI platform (image, video, automation) gets `/ai-governance-legal:vendor-ai-review` before production use.
9. **Renewal watcher runs weekly.** All active contracts (artist agreements, vendor MSAs, client retainers) feed the renewal register. Missing a cancel-by window = full liability.
10. **Everything is markdown and JSON.** No build step. Fork skills freely — every skill is a `.md` file under `skills/`.

---

## REFERENCES

- Full README: `https://github.com/anthropics/claude-for-legal/blob/main/README.md`
- Quickstart (60 seconds): `https://github.com/anthropics/claude-for-legal/blob/main/QUICKSTART.md`
- Connectors guide: `https://github.com/anthropics/claude-for-legal/blob/main/CONNECTORS.md`
- Contributing: `https://github.com/anthropics/claude-for-legal/blob/main/CONTRIBUTING.md`
- License: Apache-2.0 — `https://github.com/anthropics/claude-for-legal/blob/main/LICENSE`
