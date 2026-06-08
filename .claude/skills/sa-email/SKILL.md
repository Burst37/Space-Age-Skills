---
name: sa-email
description: >
  Space Age AI Solutions custom email creation engine. Generates production-ready
  HTML emails with brand-voice injection, segment-aware copy, and Klaviyo MCP
  integration. Six intent modes: CAMPAIGN, DRIP_SEQUENCE, RE_ENGAGEMENT,
  PROMOTIONAL, TRANSACTIONAL, AUDIT.
argument-hint: "[intent-mode] [segment] [brand-url-or-btp-path] [goal]"
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion
author: Space Age AI Solutions
version: 1.0.0
user-invocable: true
---

# SA-EMAIL — Space Age Custom Email Creation Engine
**Source workflow:** "How to Design Emails with Claude" (Klaviyo + Claude AI)

## AUTO-TRIGGER RULE

This skill fires automatically when any of these appear:
- "write an email", "design an email", "email template", "email campaign"
- "Klaviyo email", "email sequence", "drip campaign", "re-engagement"
- Any mention of email alongside brand, segment, or audience

## INTENT ENGINE — 6 MODES

| Mode | Trigger Signals | Primary Output |
|------|----------------|----------------|
| `CAMPAIGN` | "email", "campaign", "newsletter" | Single production-ready email (HTML + text + JSON) |
| `DRIP_SEQUENCE` | "sequence", "flow", "drip", "onboarding" | N-email sequence with timing + logic |
| `RE_ENGAGEMENT` | "lapsed", "win-back", "inactive", "churn" | Win-back email with urgency triggers |
| `PROMOTIONAL` | "sale", "discount", "offer", "promo" | Promotional email with CTA hierarchy |
| `TRANSACTIONAL` | "receipt", "confirmation", "order" | Transactional email (CAN-SPAM compliant) |
| `AUDIT` | "review", "improve", "fix", existing HTML | Email QC report + revised version |

## PIPELINE

### Step 0 — Brand Voice Load
1. Check for BTP in session (from `brand-extractor`)
2. Check DESIGN.md on disk
3. URL provided → run brand-extractor Phase 1 inline
4. Fallback: neutral professional tone

### Step 1 — Audience Segmentation
Segments: HIGH_VALUE_ACTIVE, ENGAGED_NON_BUYER, NEW_SUBSCRIBER, LAPSED_CUSTOMER, COLD_LEAD, GENERAL

### Step 2 — Email Architecture (7 layers)
1. ENVELOPE: subject + preview text
2. HEADER: logo + brand bar
3. HERO: image + headline + subheadline
4. BODY: personalization + value/story/offer
5. CTA: primary button + secondary text link
6. FOOTER CONTENT: sign-off + P.S.
7. LEGAL FOOTER: unsubscribe + address

### Step 3 — Copy Generation
- Subject: 30-50 chars, 3 variants (curiosity/benefit/urgency)
- No ALL CAPS, no spam words, no generic CTAs
- P.S. line: high-read zone, include always

### Step 4 — HTML Generation
Email-safe rules:
- Table-based layout (no CSS Grid/Flexbox)
- Inline CSS only (Gmail strips `<style>` blocks)
- Max width 600px
- `<a>` styled as buttons (not `<button>`)
- No JavaScript, no CSS animations

### Step 5 — Output Package
1. HTML email file
2. Campaign JSON (3 subject variants, CTA, QC score)
3. Plain text fallback

### Step 6 — QC Validation (score 0-100, flag <80)
Checks: subject length, preview text, personalization token, single CTA, table layout, unsubscribe link, physical address

## KLAVIYO VARIABLE SYNTAX
```
{{ first_name|default:'Friend' }}
{{ person.first_name }}
{% if person.city %} in {{ person.city }}{% endif %}
```

## SKILL METADATA

```yaml
skill_id: SA-EMAIL
version: 1.0.0
category: email-marketing
auto_trigger: true
upstream: [brand-extractor, sa-design-md, record-exec-in-a-box]
downstream: [ai-content-creator, social-media-designer, sa-orchestrator]
platforms: [klaviyo, mailchimp, sendgrid]
```
