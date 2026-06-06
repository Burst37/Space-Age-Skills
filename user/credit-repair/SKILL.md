---
name: credit-repair
version: 2.0
updated: 2026-05-15
description: >
  Full end-to-end credit repair workflow for Space Age Credit Repair. Use when a client needs a
  forensic credit report analysis, plan of action, dispute affidavits, bureau response
  handling, FDCPA letters, furnisher disputes, goodwill deletions, pay-for-delete
  negotiations, or secondary bureau freeze guidance. Covers FCRA, FDCPA, Metro 2, UCC,
  and CFPB frameworks. Features elite Anti-OCR affidavit generation with true dynamic
  variability, Chain of Custody challenges, MOV demands, and Conditional Acceptance &
  Estoppel (the poison pill provision). Always load this skill before beginning any
  credit repair task for Space Age Credit Repair clients.
---

# Space Age Credit Repair — Credit Repair Skill
**Brand:** Space Age Credit Repair | **Specialist:** Chuma Black
**Parent Company:** Space Age AI Solutions
**Legal Framework:** FCRA, FDCPA, UCC, Metro 2, CFPB
**Target Timeline:** 10–30 days (fraud cases prioritized)

---

## SKILL LOAD ORDER

Load skills in this sequence for full capability:

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `credit-repair` (this file) | Domain workflow + affidavit generation |
| 2 | `claude-for-legal` | Legal escalation routing — load before any demand letter or CFPB filing |
| 3 | `karpathy-guidelines` | Coding discipline — load before touching any pipeline script |

---

## WORKFLOW OVERVIEW

Execute phases in order. Do not skip phases.

| Phase | Task | Output |
|-------|------|--------|
| 1 | Forensic Credit Report Analysis | Forensic Analysis Document (PDF) |
| 2 | Plan of Action with Fee Breakdown | POA Document (PDF) |
| 3 | Secondary Bureau Freeze Checklist | Checklist delivered to client |
| 4 | Generate Dispute Affidavits | Notarized Affidavit PDFs per bureau |
| 5 | Generate Supplemental Letters | FDCPA / Furnisher / Goodwill / P4D Letters |
| 6 | Package and Deliver | Zipped client folder with instructions |
| 7 | Response Handling | Round 2+ escalation per bureau response |

---

## PHASE 1: FORENSIC CREDIT REPORT ANALYSIS

**Input required:** Client credit report (PDF) + personal info (name, address, SSN, DOB)
**Output template:** `templates/forensic_analysis_template.md`

### Negative Accounts
- Late payments, charge-offs, collections, bankruptcies, judgments, liens
- For each: creditor name, partial account number, balance, open/close date, status
- **Re-aging check:** Date of First Delinquency (DOFD) must be the original date — not
  reset when sold to a collector. Re-aged debts past 7 years from DOFD = FCRA violation.
- **Duplicate entry check:** Same account reported by original creditor AND collector
  simultaneously = double-reporting violation

### Hard Inquiries
- Authorized vs. unauthorized
- Any inquiry older than 2 years must be removed (FCRA limit)
- Verify permissible purpose under 15 U.S.C. § 1681b for each

### Personal Information Errors
- Old addresses, phone numbers, employer names, alternate name spellings
- Each unverified PII variation is a separately disputable item

### Metro 2 Compliance Violations
| Code | Violation | Significance |
|------|-----------|-------------|
| Code 26 | Balance > $0 on a charged-off account | Account should show $0 balance post charge-off |
| Code 05 | Account "transferred" but still showing balance | Transfer severs reporting obligation |
| Code 97 | Unpaid balance on a repossession | Deficiency balance rules vary by state |
| DA field | Missing or incorrect Date of First Delinquency | Drives the 7-year SOL clock — most exploited violation |
| Payment Rating | Inconsistency between payment history and current status | e.g., "never late" history with charge-off status |

### Statute of Limitations Analysis
- **Credit reporting SOL (FCRA):** 7 years from DOFD for most negatives; 10 years for Chapter 7
- **Legal collection SOL:** See `references/statute_of_limitations.md` — varies 3–10 years by state/debt type
- Flag expired-SOL accounts — collector has no standing to sue; use as leverage

### Score Impact Prioritization (Target in This Order)
1. Incorrect negative items — highest priority, easiest win
2. Collections under $1,000 — often uncollectable, collectors frequently don't respond to verification demands
3. Charge-offs with Metro 2 violations — strong legal basis forces bureau action
4. Unauthorized hard inquiries — quick removals with immediate score lift
5. Re-aged items — strong FCRA violation, high deletion rate
6. Late payments on open accounts — hardest to remove; pursue goodwill (Phase 5)

---

## PHASE 2: PLAN OF ACTION (POA)

**Output template:** `templates/plan_of_action_template.md`

### Fee Structure
| Service | Fee | Notes |
|---------|-----|-------|
| Forensic Analysis + POA | $99.00 | One-time, paid upfront |
| First Work Fee | $149.00 | Charged after Round 1 affidavits sent |
| Monthly Retainer | $99.00/month | Ongoing disputes, follow-ups, status updates |
| Per-Deletion Bonus (optional) | $50.00/item | Results-based add-on |
| Couples / Joint Plan | +$75.00/month | Added to monthly retainer |

### Multi-Round Strategy — Define All Rounds Upfront
- **Round 1:** Sniper approach — top 3–5 most legally vulnerable items. Never exceed 5
  to avoid "frivolous" designation under 15 U.S.C. § 1681i(a)(3). PII + inquiry sweep first.
- **Round 2:** Address bureau responses per `references/response_playbook.md`. Escalate
  "verified" items directly to furnisher with § 1681s-2(b) letter. Add next tier of items.
- **Round 3:** Unresolved items → CFPB complaint + State AG complaint. Final demand letter
  with explicit statutory damages notice under § 1681n ($100–$1,000 per willful violation).

---

## PHASE 3: SECONDARY BUREAU FREEZE

Load `references/secondary_bureaus.md` for all direct URLs.

Client action sequence:
1. Freeze Big Three (Equifax, Experian, TransUnion)
2. Freeze all secondary bureaus in reference file
3. Opt out of prescreened offers: https://www.optoutprescreen.com/
4. Create IRS IP PIN: https://www.irs.gov/identity-theft-fraud-scams/get-an-identity-protection-pin
5. Lock SSN: https://www.ssa.gov/myaccount/
6. Lock E-Verify: https://www.e-verify.gov/

---

## PHASE 4: GENERATE DISPUTE AFFIDAVITS

**Input schema:** See `templates/client_intake.json`

```bash
python3 scripts/generate_affidavits.py client_info.json disputes.json [category]
```

**Category options:** `pii` | `inquiry` | `account` | `full`

**Output:** One branded affidavit PDF per bureau, named:
`Affidavit_[Bureau]_[Category]_[ClientLastName]_[ClientFirstName].pdf`

### The Sniper Approach
- Target top 3–5 most legally vulnerable accounts per round
- Never exceed 5 — prevents "frivolous" dismissal under 15 U.S.C. § 1681i(a)(3)
- Run full PII + Inquiry sweep first to sever data links to negative tradelines

### True Anti-OCR Variability
The rebuilt `generate_affidavits.py` implements genuine variability:
- **10–12 phrase variations per section** (was 3)
- **Synonym substitution layer** — legal terms rotated through approved equivalents
- **Sentence structure randomization** — short/punchy vs. long/complex constructions
- **Paragraph reordering** — non-structural sections reordered between documents
- **Citation format rotation** — full USC citation vs. section-only vs. FCRA reference
- **Category-driven content** — PII sections only fire when category = `pii` or `full`;
  inquiry sections only fire when category = `inquiry` or `full`

### 10-Element Affidavit Structure
1. **Notarial Heading** — State, County, Date, Affiant full name, address, SSN last 4, DOB, Notice to Principal/Agent
2. **Declaration of Status** — Natural person protected under federal consumer law
3. **PII Discrepancy Challenge** *(pii/full only)* — Demand deletion of all unverified alternate names, addresses, phones, employers. Cite § 1681e(b).
4. **Hard Inquiry Challenge** *(inquiry/full only)* — Demand permissible purpose proof per § 1681b. Without original contract, inquiry is non-permissible and must be permanently deleted.
5. **Itemized Violations** — Targeted accounts (partially redacted: 1234****) with specific Metro 2/UCC/consumer law violation cited per item
6. **MOV Demand** — Invoke § 1681i(a)(7), demand full verification procedure including furnisher name, address, phone
7. **Chain of Custody Challenge** — Demand forensic proof tradelines were not compromised in CRA data breaches (Equifax, Experian, National Public Data). Without verified chain of custody, data fails § 1681e(b) maximum accuracy standard.
8. **Conditional Acceptance & Estoppel (The Poison Pill)** — 30 days to rebut with wet-ink contracts + Metro 2 Header Records. Failure = waiver of claim + § 1681n statutory damages trigger + permanent estoppel from reinserting disputed data.
9. **Regulatory Escalation Trigger** — Failure to permanently delete within 30 days = immediate CFPB + State AG complaints for deceptive trade practices.
10. **Signature + Jurat Block** — Affiant signature, date, full notary acknowledgment with seal space.

**NEVER USE IN ANY DOCUMENT:** "Poison Pill," "Self-Executing Contract," or "Silence is Admission"

---

## PHASE 5: SUPPLEMENTAL LETTERS

```bash
python3 scripts/generate_letters.py client_info.json disputes.json [letter_type]
```

| Type | Use Case | Legal Basis |
|------|----------|------------|
| `fdcpa_validation` | Collection account — demand collector prove debt validity | FDCPA § 1692g |
| `furnisher_dispute` | Direct dispute to original creditor, bypasses bureau | FCRA § 1681s-2(b) |
| `goodwill` | Paid account — request goodwill deletion | Relationship appeal |
| `pay_for_delete` | Active collection — payment in exchange for deletion | Negotiation |

**When to use each:**
- **FDCPA Validation** — Send within 30 days of first collector contact. Forces cease of all
  collection activity until debt is verified. If collector can't verify → must delete.
- **Furnisher Dispute** — When bureau returns "verified." Go directly to original creditor.
  § 1681s-2(b) creates an independent legal obligation to investigate. Second pressure point.
- **Goodwill** — Late payments on otherwise clean accounts the client has paid. No legal
  leverage; pure relationship appeal. Best on accounts 2+ years old with no recent lates.
- **Pay-for-Delete** — Legitimate debt within SOL. **Get written P4D agreement BEFORE any
  payment.** Once paid without agreement, all deletion leverage is permanently gone.

---

## PHASE 6: PACKAGE AND DELIVER

1. Compile all documents into folder: `[ClientLastName]_[ClientFirstName]_Round[N]`
2. Include `INSTRUCTIONS.md` with notarization steps and mailing addresses
3. Zip and deliver to client
4. Log round number, date sent, items disputed in case tracker

**Case Tracker — Minimum Required Fields per Round:**

| Field | Description |
|-------|-------------|
| `client_id` | Unique identifier tied to `client_intake.json` |
| `round_number` | Integer starting at 1 |
| `date_sent` | ISO 8601 — `YYYY-MM-DD` |
| `bureau` | `equifax` \| `experian` \| `transunion` |
| `items_disputed` | Array of account identifiers targeted this round |
| `category` | `pii` \| `inquiry` \| `account` \| `full` |
| `30_day_deadline` | Auto-calculated: `date_sent + 30 days` — triggers CFPB escalation if no response |
| `status` | `sent` \| `response_received` \| `escalated` \| `resolved` |

**Bureau Certified Mail Addresses:**
- **Equifax:** P.O. Box 740256, Atlanta, GA 30374
- **Experian:** P.O. Box 4500, Allen, TX 75013
- **TransUnion:** P.O. Box 2000, Chester, PA 19016

Send via **USPS Certified Mail, Return Receipt Requested** — creates the legal paper trail
required for § 1681n willful violation claims if bureau fails to respond.

---

## PHASE 7: RESPONSE HANDLING

Load `references/response_playbook.md` for complete decision trees.

| Bureau Response | Immediate Action |
|----------------|----------------|
| "Deleted" | Log win, update score tracker, advance to next item |
| "Updated" | Verify update is accurate. If still negative → treat as "Verified" |
| "Verified" | Send furnisher dispute (Phase 5) + escalate to Round 2 |
| "Frivolous/Irrelevant" | Counter with unique legal basis + new evidence + prior dispute history |
| No response in 30 days | Bureau violated § 1681i(a)(1) — file CFPB complaint immediately |
| Re-insertion after deletion | Willful violation of § 1681i(a)(5)(B) — pursue § 1681n damages |

---

## REFERENCE FILES

| File | Load When |
|------|----------|
| `references/secondary_bureaus.md` | Phase 3 — freeze checklist |
| `references/response_playbook.md` | Phase 7 — response handling |
| `references/statute_of_limitations.md` | Phase 1 — SOL analysis |

## BRANDING
- **Business:** Space Age Credit Repair | **Parent:** Space Age AI Solutions | **Specialist:** Chuma Black
- **Space Age Credit Repair Logo: `templates/space_age_credit_repair_logo.png`
- **Space Age Logo:** `templates/space_age_logo.png`
- **Colors:** Navy `#0F172A` | Amber `#B45309` | White body text

---

## MODULE: CLAUDE FOR LEGAL INTEGRATION
**Source:** `https://github.com/anthropics/claude-for-legal`
**Integration Version:** As-Is | Apache-2.0 License

> **All outputs from this module are drafts for attorney review — not legal advice, not legal conclusions, not a substitute for a lawyer.** A licensed attorney reviews, verifies, and takes professional responsibility for anything that leaves the building. This module accelerates that review — it does not replace it.

### WHEN TO TRIGGER THIS MODULE

| Trigger | Applicable Plugin(s) |
|---------|---------------------|
| Client needs a formal demand letter to a collector, bureau, or furnisher | `litigation-legal` |
| FDCPA lawsuit threat or client has received a debt collection lawsuit | `litigation-legal` |
| Regulatory complaint drafting (CFPB, State AG, FTC) | `regulatory-legal` |
| Client's data was compromised in a bureau breach (Equifax, NPD, etc.) | `privacy-legal` |
| Employment consequences of credit issues (background check disputes, adverse action notices) | `employment-legal` |
| Space Age Credit Repair vendor contracts, affiliate agreements, or client service agreements | `commercial-legal` |
| AI governance for credit repair automation tools (FCRA + ECOA compliance for AI-assisted decisioning) | `ai-governance-legal` |

### AGENT ROUTING — CREDIT REPAIR CONTEXT

| Scenario | Agent | Command |
|----------|-------|-------|
| Draft demand letter to collector/bureau | Demand Letter Drafter | `/litigation-legal:demand-draft` |
| Triage an inbound demand, lawsuit, or legal threat from collector | Demand Received Triage | `/litigation-legal:demand-received` |
| Subpoena received (e.g., from collector litigation) | Subpoena Triage | `/litigation-legal:subpoena-triage` |
| CFPB / State AG complaint — track open regulatory actions | Gap Tracker | `/regulatory-legal:gaps` |
| Regulatory change affecting FCRA/FDCPA compliance posture | Policy Diff | `/regulatory-legal:policy-diff` |
| Data breach impact on client's credit file (chain of custody challenge support) | DSAR Responder | `/privacy-legal:dsar-response` |
| Privacy Impact Assessment for any new client data handling process | PIA Generator | `/privacy-legal:pia-generation` |
| Client adverse action notice dispute (employment background check) | Hire Reviewer | `/employment-legal:hiring-review` |
| Vendor/affiliate MSA for Space Age Credit Repair partnerships | Vendor Agreement Reviewer | `/commercial-legal:review` |
| AI credit repair tool vendor terms review (ECOA, FCRA compliance) | Vendor AI Reviewer | `/ai-governance-legal:vendor-ai-review` |
| Chronology of bureau/furnisher responses across all dispute rounds | Chronology Builder | `/litigation-legal:chronology` |
| Open matter portfolio status (active client cases) | Portfolio Status | `/litigation-legal:portfolio-status` |
| Client file intake as a formal legal matter | Matter Intake | `/litigation-legal:matter-intake` |

### CONNECTORS AVAILABLE (from claude-for-legal)

| Connector | Relevance to Credit Repair |
|-----------|---------------------------|
| Google Drive | Client file storage, affidavit archive, dispute round tracking |
| DocuSign / DocuSign CLM | Client service agreements, P4D agreement execution |
| Slack | Internal ops alerts on 30-day response deadlines, CFPB complaint triggers |
| CourtListener | Federal FCRA/FDCPA case research for escalation arguments |
| Trellis | State court docket monitoring for active collector litigation |

### SKILL INSTALLATION (Claude Code / Cowork)

```bash
# Install once per environment
/plugin marketplace add https://github.com/anthropics/claude-for-legal

# Install relevant plugins for Credit Repair stack
/plugin install litigation-legal@claude-for-legal
/plugin install regulatory-legal@claude-for-legal
/plugin install privacy-legal@claude-for-legal
/plugin install employment-legal@claude-for-legal
/plugin install commercial-legal@claude-for-legal
/plugin install ai-governance-legal@claude-for-legal

# Run cold-start for each (required — tailors to your practice profile)
/litigation-legal:cold-start-interview
/regulatory-legal:cold-start-interview
```

### PHASE INTEGRATION MAP

How claude-for-legal agents slot into the existing 7-phase workflow:

| Phase | Existing Workflow | claude-for-legal Augmentation |
|-------|------------------|-------------------------------|
| Phase 1 | Forensic Analysis | `/litigation-legal:chronology` — builds a source-cited timeline of bureau/furnisher actions |
| Phase 2 | Plan of Action | `/litigation-legal:matter-intake` — formalizes each client as a tracked matter |
| Phase 4 | Dispute Affidavits | `/litigation-legal:demand-draft` — escalation-ready demand if affidavit cycle fails |
| Phase 5 | Supplemental Letters | `/litigation-legal:demand-draft` + FRE 408 gate for any settlement-related correspondence |
| Phase 7 | Response Handling | `/litigation-legal:demand-received` for inbound legal threats; `/regulatory-legal:gaps` for CFPB tracking |
| All Phases | — | `/litigation-legal:legal-hold` — preserves all client dispute evidence chain for potential litigation |

### OPERATING RULES FOR THIS MODULE

1. **Always present output as a draft for attorney review** — never as a final legal position.
2. **Litigation-first routing.** Most escalated credit repair scenarios require `/litigation-legal` as the primary plugin. Default there unless the trigger clearly maps to regulatory or privacy.
3. **Cold-start interview is mandatory** — seed it with sample FCRA demand letters, prior CFPB complaints, and your escalation attorney contact.
4. **Citations without a research connector (CourtListener, Trellis) are flagged `[verify]`** — surface this to the reviewing attorney before any demand is sent.
5. **The send gate is non-negotiable.** No demand letter, complaint filing, or legal notice leaves without attorney sign-off. This protects both the client and Space Age Credit Repair from UPL exposure.
6. **P4D agreements go through `/commercial-legal:review` before execution** — a P4D is a binding contract; treat it as one.
7. **Privilege framing on all investigation memos.** Any internal case analysis memo is drafted attorney-client privileged. Do not include in client-facing deliverables without counsel review.

---

## MODULE: KARPATHY CODING GUIDELINES
**Source:** `https://github.com/multica-ai/andrej-karpathy-skills`
**License:** MIT | Derived from Andrej Karpathy's LLM coding observations

> Applies to ALL code generated within or for the Credit Repair stack — affidavit generation scripts, letter automation, PDF pipeline, case tracker, bureau response tooling, and any Space Age Credit Repair client-facing automation.

### THE FOUR PRINCIPLES (ENFORCED)

**1. THINK BEFORE CODING** — Never assume client data schema, bureau response format, or affidavit category without confirmation. A wrong assumption in `generate_affidavits.py` produces a misfiled document that goes to the wrong bureau with the wrong account numbers. Ask first.

**2. SIMPLICITY FIRST** — The affidavit pipeline has one job: produce correctly variabilized, correctly categorized PDFs per bureau. It does not need a plugin system, a configuration API, or a strategy pattern for letter types. `python3 scripts/generate_letters.py client_info.json disputes.json fdcpa_validation` is already the interface — keep it that way.

**3. SURGICAL CHANGES** — When editing `generate_affidavits.py`, `generate_letters.py`, or any template: change only the section that addresses the request. The 10-element affidavit structure, the variability engine, and the citation rotation system are production-tested. Do not refactor them while fixing an unrelated bug.

**4. GOAL-DRIVEN EXECUTION** — Define success criteria before executing. "Fix the affidavit generator" is not a goal. "Run `python3 scripts/generate_affidavits.py test_client.json test_disputes.json full` → 3 PDFs produced (one per bureau) → each PDF contains all 10 elements → no duplicate phrase patterns between bureaus → confirmed by reading Section 5 of each output" is a goal.

### CREDIT REPAIR ANTI-PATTERNS TO ELIMINATE

| Anti-Pattern | Correct Approach |
|-------------|----------------|
| Refactoring the variability engine while fixing a formatting bug | Fix only the formatting section |
| Adding a new letter type without a defined trigger condition | Define the trigger in the routing table first |
| Assuming client's SSN, DOFD, or account number format | Check `templates/client_intake.json` schema first |
| "Improving" goodwill letter tone while fixing FDCPA validation wording | One letter type per task |
| Building a web UI for the pipeline before the CLI is fully tested | CLI first, always |
