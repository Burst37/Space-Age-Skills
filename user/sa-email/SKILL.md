---
name: sa-email
description: >
  Space Age AI Solutions custom email creation engine. Generates production-ready
  HTML emails with brand-voice injection, segment-aware copy, and Klaviyo MCP
  integration. Six intent modes: CAMPAIGN, DRIP_SEQUENCE, RE_ENGAGEMENT,
  PROMOTIONAL, TRANSACTIONAL, AUDIT. Outputs email-safe HTML (table-based,
  inline CSS, responsive), JSON campaign package, and plain-text fallback.
  Auto-triggers on any email creation, redesign, or copy request.
argument-hint: "[intent-mode] [segment] [brand-url-or-btp-path] [goal]"
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion
author: Space Age AI Solutions
version: 1.0.0
user-invocable: true
---

# SA-EMAIL — Space Age Custom Email Creation Engine
**Source workflow:** "How to Design Emails with Claude" (Klaviyo + Claude AI)
**Supercharged by:** Space Age AI Solutions
**Install path:** `~/.claude/skills/user/sa-email/` or `/mnt/skills/user/sa-email/`

---

## AUTO-TRIGGER RULE

This skill fires automatically when any of these appear:

- "write an email", "design an email", "email template", "email campaign"
- "Klaviyo email", "email sequence", "drip campaign", "re-engagement"
- "email copy", "subject line", "email HTML", "email blast"
- A request to improve, redesign, or audit an existing email
- Any mention of email alongside brand, segment, or audience

**Do NOT wait for `/sa-email`.** Classify intent, run the pipeline, deliver output.

---

## INTENT ENGINE — 6 MODES

Classify automatically from context. Default: **CAMPAIGN**.

| Mode | Trigger Signals | Primary Output |
|------|----------------|----------------|
| `CAMPAIGN` | "email", "campaign", "send", "newsletter", "announcement" | Single production-ready email (HTML + text + JSON) |
| `DRIP_SEQUENCE` | "sequence", "flow", "drip", "series", "automation", "onboarding" | N-email sequence with timing + logic |
| `RE_ENGAGEMENT` | "lapsed", "win-back", "inactive", "churn", "bring back" | Win-back email with urgency triggers |
| `PROMOTIONAL` | "sale", "discount", "offer", "promo", "deal", "limited time" | Promotional email with CTA hierarchy |
| `TRANSACTIONAL` | "receipt", "confirmation", "order", "shipping", "password", "account" | Transactional email (CAN-SPAM compliant) |
| `AUDIT` | "review", "improve", "fix", "critique", "score", existing HTML pasted | Email QC report + revised version |

---

## STEP 0 — BRAND VOICE LOAD

Before writing a single word of copy, load brand context. Priority order:

1. **BTP in session** — If brand-extractor was already run this session, use that BTP directly
2. **DESIGN.md on disk** — Check `./DESIGN.md` or `~/DESIGN.md` for brand token package
3. **URL provided** — Run brand-extractor Phase 1 inline (fetch → extract → BTP)
4. **Brand prompt inline** — User describes brand voice in the message
5. **Generic fallback** — Use neutral professional tone, flag that brand voice is absent

**Never write copy without checking Step 0 first.** Generic copy is the enemy.

### Brand Voice Extraction (inline)

If running brand-extractor inline, extract these for email specifically:

```
EMAIL BRAND TOKENS
brand_name:       [name]
tone_primary:     [luxury / startup / corporate / bold / warm / technical]
tone_secondary:   [second adjective]
voice_examples:   [2-3 example phrases that sound like the brand]
forbidden_words:  [words/phrases that break the brand voice]
cta_style:        [imperative / inviting / urgent / soft]
greeting_style:   [Hi {first_name} / Hey {first_name} / Dear {first_name} / none]
sign_off:         [Warmly / Best / Cheers / The [Brand] Team / none]
```

---

## STEP 1 — AUDIENCE SEGMENTATION

Identify the target segment before writing. Segment drives everything: tone, urgency, incentive depth, CTA copy.

### Segment Profiles

| Segment | Characteristics | Email Posture |
|---------|----------------|---------------|
| `HIGH_VALUE_ACTIVE` | 3+ purchases, opened last 3 emails | Loyalty reward, early access, VIP language |
| `ENGAGED_NON_BUYER` | High opens/clicks, zero purchases | Social proof, objection handling, soft CTA |
| `NEW_SUBSCRIBER` | Subscribed <30 days, no purchases | Welcome warmth, brand story, low-pressure CTA |
| `LAPSED_CUSTOMER` | Purchased before, 90+ days inactive | "We miss you" warmth, not desperation |
| `COLD_LEAD` | Low engagement, no purchase history | Pattern interrupt, value-first, curiosity hook |
| `GENERAL` | Mixed / unknown | Balanced tone, clear value prop, single CTA |

If segment is not specified, ask ONE question: "Who is this email going to?"

---

## STEP 2 — EMAIL ARCHITECTURE

Every email has the same 7-layer structure. Build all 7 before writing HTML.

```
┌─────────────────────────────────────┐
│  LAYER 1: ENVELOPE                  │
│  Subject line (primary)             │
│  Preview text (preheader)           │
├─────────────────────────────────────┤
│  LAYER 2: HEADER                    │
│  Logo + brand bar                   │
├─────────────────────────────────────┤
│  LAYER 3: HERO                      │
│  Hero image or graphic (optional)   │
│  Hero headline                      │
│  Hero subheadline                   │
├─────────────────────────────────────┤
│  LAYER 4: BODY                      │
│  Opening personalization            │
│  Core value / story / offer         │
│  Supporting details or social proof │
├─────────────────────────────────────┤
│  LAYER 5: CTA                       │
│  Primary CTA button                 │
│  Secondary CTA (optional text link) │
├─────────────────────────────────────┤
│  LAYER 6: FOOTER CONTENT            │
│  Sign-off + sender name             │
│  P.S. line (optional — high read)   │
├─────────────────────────────────────┤
│  LAYER 7: LEGAL FOOTER              │
│  Unsubscribe link                   │
│  Physical address (CAN-SPAM)        │
│  View in browser link               │
└─────────────────────────────────────┘
```

---

## STEP 3 — COPY GENERATION

Generate copy before HTML. Lock words before building structure.

### Prompt Formula (6 components)

Every copy generation pass uses this structure internally:

1. **Role** — "You are an expert email copywriter for [brand_name]."
2. **Audience** — Segment profile + behavioral context
3. **Contact data** — Personalization fields available: `{first_name}`, `{last_purchase_date}`, `{product_name}`, etc.
4. **Goal** — What should the reader do after reading?
5. **Voice** — Brand tone tokens from Step 0
6. **Format** — Request JSON output: `subject_line`, `preview_text`, `headline`, `body_copy`, `cta_text`, `ps_line`

### Subject Line Rules

- Length: 30–50 characters (sweet spot for mobile)
- Hard max: 60 characters
- No ALL CAPS (spam signal)
- No more than one emoji (if brand permits)
- Test 3 variants: curiosity / benefit / urgency
- Preview text must not repeat subject — extend the thought

### Copy Anti-Patterns (never write these)

```
BAD: "Don't miss out!" → generic urgency
BAD: "We wanted to reach out..." → passive, corporate
BAD: "As a valued customer..." → hollow flattery
BAD: "Click here" → weak CTA
BAD: "Just checking in" → no value signal

GOOD: "Your cart has been patient" → specific, voice-driven
GOOD: "[first_name], here's what you missed" → personal + curiosity
GOOD: "Still thinking about [product]?" → mirrors purchase intent
GOOD: "Get [specific benefit] →" → clear CTA with directional
```

---

## STEP 4 — HTML GENERATION

### Email-Safe HTML Rules (non-negotiable)

```
✅ Table-based layout (not CSS Grid, not Flexbox)
✅ Inline CSS only (no <style> blocks — Gmail strips them)
✅ Max width: 600px container
✅ All images have alt="" attributes
✅ Images have explicit width and height attributes
✅ Buttons built as <a> tags styled as buttons, NOT <button>
✅ Font stack: system-safe + web font fallback
✅ Line-height in px, not unitless (Outlook compat)
✅ Padding on <td>, not margin (Outlook compat)
✅ No JavaScript
✅ No CSS animations
✅ No position: absolute or relative
✅ No negative margins
✅ No shorthand CSS (use individual properties)
```

### Responsive Breakpoint (600px)

```html
<!-- Media query in <head> for clients that support it -->
<style type="text/css">
  @media only screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .email-column { width: 100% !important; display: block !important; }
    .hide-mobile { display: none !important; }
    .btn { width: 100% !important; text-align: center !important; }
  }
</style>
```

### Klaviyo Variable Syntax

Use Klaviyo's native variable syntax when targeting Klaviyo:

```
{{ first_name|default:'Friend' }}
{{ person.first_name }}
{{ event.extra.product_name }}
{% if person.city %} in {{ person.city }}{% endif %}
```

For generic platforms, use `{first_name}` placeholder notation and note substitution required.

---

## STEP 5 — OUTPUT PACKAGE

Deliver three artifacts simultaneously:

### Artifact 1 — HTML Email File
```
email_[campaign-name]_[segment]_[date].html
```
- Complete, self-contained HTML
- Opens correctly in browser for preview
- Klaviyo-paste-ready

### Artifact 2 — Campaign JSON
```json
{
  "campaign_name": "",
  "intent_mode": "",
  "segment": "",
  "brand": "",
  "subject_lines": [
    { "variant": "A", "text": "", "char_count": 0 },
    { "variant": "B", "text": "", "char_count": 0 },
    { "variant": "C", "text": "", "char_count": 0 }
  ],
  "preview_text": "",
  "headline": "",
  "cta_text": "",
  "cta_url": "[PLACEHOLDER]",
  "personalization_fields": [],
  "qc_score": 0,
  "qc_flags": [],
  "platform": "klaviyo",
  "created": ""
}
```

### Artifact 3 — Plain Text Fallback
```
Subject: [subject]

[First name],

[Body in plain prose, no HTML]

[CTA as URL]

[Sign-off]

Unsubscribe: [unsubscribe_url]
[Physical address]
```

---

## STEP 6 — QC VALIDATION

Run before delivering. Score 0–100. Flag anything below 80.

### QC Checklist

```
ENVELOPE
[ ] Subject line: 30–60 chars                    +10
[ ] No ALL CAPS in subject                       +5
[ ] Preview text present and ≠ subject           +10
[ ] 3 subject line variants provided             +5

COPY
[ ] Personalization token in first 50 words      +10
[ ] Single primary CTA (no CTA confusion)        +10
[ ] No spam trigger words present                +10
[ ] CTA text is action-specific (not "Click")    +5
[ ] P.S. line present (optional +bonus)          +5

TECHNICAL
[ ] Table-based layout confirmed                 +10
[ ] All images have alt text                     +5
[ ] Unsubscribe link present                     +10
[ ] Physical address present                     +5
[ ] Max width ≤ 600px                            +5
[ ] No inline JavaScript                         +5
```

### QC Output Format

```
QC REPORT — [email name]
Score: [X]/100

PASSED:
✅ [item]

FAILED:
❌ [item] — [fix]

WARNINGS:
⚠️  [item] — [risk]

SA RECOMMENDATION:
[One sentence on what to fix before sending]
```

---

## INTENT-SPECIFIC PROTOCOLS

### CAMPAIGN Protocol

Standard single send. Full 7-layer architecture. 3 subject variants. QC must pass before delivery.

### DRIP_SEQUENCE Protocol

For automation flows:

1. Map the sequence: Email 1 (Day 0) → Email 2 (Day X) → Email N (Day Y)
2. Each email must stand alone (assume reader missed previous)
3. Shared brand voice, escalating personalization depth
4. Timing recommendations per email:

| Email # | Typical Delay | Goal |
|---------|--------------|------|
| 1 | Immediate | Welcome / hook |
| 2 | Day 2–3 | Value delivery |
| 3 | Day 5–7 | Social proof / objection |
| 4 | Day 10–14 | Soft CTA |
| 5 | Day 21+ | Hard CTA / last chance |

Output: One HTML file + JSON per email in sequence, plus a SEQUENCE_MAP.json with timing logic.

### RE_ENGAGEMENT Protocol

For lapsed audiences — handle with care:

- **Do not** lead with a discount (conditions the segment to wait for deals)
- **Do** lead with a curiosity hook or "we noticed" opener
- Reference their last purchase/interaction if personalization data exists
- Single question hook: "Is everything okay?" / "Did we do something wrong?"
- Offer in email 2 or 3 of the sequence, not email 1
- Sunset path: email 4 is explicit opt-out / keep-me-on-list CTA

### PROMOTIONAL Protocol

Sale/offer emails:

- Urgency must be real (specific deadline, specific quantity)
- Never "Up to X% off" — always "X% off [specific product/category]"
- Hero section: offer value proposition in 7 words or fewer
- Secondary offer or cross-sell below primary CTA
- Countdown timer note (Klaviyo supports live timers via blocks)

### TRANSACTIONAL Protocol

- CAN-SPAM and GDPR compliant by default
- No promotional content in transactional context
- Clear transactional purpose in subject: "Your order #12345 is confirmed"
- Machine-readable data formatting for order details
- Reply-to address must be functional (note if using noreply)

### AUDIT Protocol

When reviewing an existing email:

1. Run full QC checklist → score it
2. Identify top 3 issues by impact
3. Rewrite subject line (3 variants)
4. Identify copy anti-patterns → replace each
5. Flag technical HTML issues
6. Deliver: audit report + revised version side-by-side

---

## KLAVIYO MCP INTEGRATION

When Klaviyo MCP is active in the session:

```
# Check for active Klaviyo connection
# If mcp__klaviyo tools are available:

1. Pull segment definition from Klaviyo
   → Use segment size and characteristics to calibrate tone

2. Pull recent campaign performance (last 30 days)
   → Use open rate + CTR benchmarks to calibrate subject strategy

3. Generate HTML email
   → Use Klaviyo variable syntax {{ }}

4. Save as draft template in Klaviyo
   → Upload via Klaviyo API if integration active

5. Return template ID for review in Klaviyo dashboard
```

If Klaviyo MCP is NOT active, deliver standalone HTML with `{variable}` placeholder notation and a note: "Swap to Klaviyo `{{ }}` syntax before uploading."

---

## SA PIPELINE INTEGRATION

### Upstream Inputs (feeds into sa-email)

| Source Skill | What It Provides |
|-------------|------------------|
| `brand-extractor` | BTP — color tokens, typography, tone, voice examples |
| `sa-design-md` | DESIGN.md — full visual system + brand guidelines |
| `sa-watch` | Video analysis — competitor email design patterns, motion |
| `record-exec-in-a-box` | Artist/label context — audience profile, release context |

### Downstream Outputs (sa-email feeds into)

| Target Skill | What It Receives |
|-------------|------------------|
| `ai-content-creator` | Email copy as content asset for repurposing |
| `social-media-designer` | Email hero/CTA repurposed for social creatives |
| `sa-orchestrator` | Campaign JSON for multi-channel coordination |

### Lead Gen Pipeline Usage

For the 5-agent swarm — email as part of lead-to-client flow:

```
Step 1: sa-watch analyzes competitor site/video
Step 2: brand-extractor pulls BTP from competitor + client
Step 3: sa-email generates outreach email using client BTP + competitor insight
Step 4: email goes into Apollo sequence via apollo_emailer_campaigns
Step 5: ai-content-creator repurposes email copy for LinkedIn + Instagram
```

---

## FAILURE HANDLING

| Failure | Response |
|---------|----------|
| No brand context available | Deliver email with generic professional tone. Append: "⚠️ No brand voice loaded — run brand-extractor for on-brand copy." |
| Segment not specified | Ask ONE question. Do not assume. |
| No CTA URL provided | Use `[CTA_URL]` placeholder. Note it in JSON. |
| Copy fails QC (score < 80) | Do not deliver. Fix and re-run QC silently. Deliver only when passing. |
| User pastes HTML with issues | Audit mode — score it, fix it, return revised. |
| Klaviyo MCP unavailable | Deliver standalone HTML with substitution notes. |

---

## QUICK REFERENCE — COMMON INVOCATIONS

```
# Standard campaign email
/sa-email CAMPAIGN lapsed-customers klaviyo.com/brand "Re-engage 90-day inactive list"

# Drip sequence (5-email onboarding)
/sa-email DRIP_SEQUENCE new-subscribers [BTP from session] "Onboard new email list"

# Promotional email
/sa-email PROMOTIONAL general [brand-url] "Summer sale, 30% off, ends Friday"

# Re-engagement
/sa-email RE_ENGAGEMENT lapsed-customers [brand-url] "Win back buyers inactive 120+ days"

# Audit existing email
/sa-email AUDIT [paste HTML or path/to/email.html]

# Quick one-liner (auto-classifies)
"Write a welcome email for new Klaviyo subscribers in a luxury skincare brand voice"
```

---

## SKILL METADATA

```yaml
skill_id: SA-EMAIL
version: 1.0.0
category: email-marketing
intent_modes:
  - CAMPAIGN
  - DRIP_SEQUENCE
  - RE_ENGAGEMENT
  - PROMOTIONAL
  - TRANSACTIONAL
  - AUDIT
auto_trigger: true
upstream_skills:
  - brand-extractor
  - sa-design-md
  - sa-watch
  - record-exec-in-a-box
downstream_skills:
  - ai-content-creator
  - social-media-designer
  - sa-orchestrator
platform_integrations:
  - klaviyo (MCP)
  - mailchimp (export)
  - sendgrid (export)
output_formats:
  - html (email-safe, table-based)
  - json (campaign package)
  - txt (plain-text fallback)
install_paths:
  - ~/.claude/skills/user/sa-email/SKILL.md
  - /mnt/skills/user/sa-email/SKILL.md
source_video: https://youtu.be/wPwbItL3_hU
```
