---
name: claude-for-legal
description: Full-spectrum legal workflow skill powered by the anthropics/claude-for-legal plugin. Handles contract review, legal research, document drafting, and compliance analysis.
allowed-tools: Read, Write, Bash
---

# CLAUDE FOR LEGAL
## Space Age AI Solutions — Legal Workflow Engine

**Note:** This skill requires the `anthropics/claude-for-legal` MCP plugin to be active.

## When to load this skill

- Contract review, redlining, or negotiation
- Legal research and case law analysis
- Document drafting (NDAs, terms of service, agreements)
- Compliance analysis (GDPR, CCPA, CAN-SPAM, etc.)
- Legal question answering with citation

---

## LEGAL WORKFLOW MODES

### Mode 1: CONTRACT REVIEW

1. Load contract document (paste or file path)
2. Identify contract type and governing law
3. Flag:
   - Unfavorable clauses (liability caps, IP assignment, non-competes)
   - Missing standard protections
   - Ambiguous language
   - Red flags requiring attorney review
4. Produce summary: risk level, key terms, recommended changes

### Mode 2: DOCUMENT DRAFTING

1. Identify document type needed
2. Gather parties, jurisdiction, key terms
3. Draft using jurisdiction-appropriate language
4. Include standard protections for client's position
5. Flag sections requiring attorney customization

### Mode 3: LEGAL RESEARCH

1. Identify jurisdiction and legal question
2. Search relevant statutes and case law
3. Summarize findings with citations
4. Note splits in authority or unsettled areas
5. Provide practical guidance for the situation

### Mode 4: COMPLIANCE ANALYSIS

1. Identify applicable regulations (GDPR, CCPA, CAN-SPAM, etc.)
2. Analyze current practices or documents against requirements
3. Flag gaps and violations
4. Recommend remediation steps

---

## STANDARD DISCLAIMERS

Always include on legal outputs:
> This analysis is for informational purposes only and does not constitute legal advice. Consult a licensed attorney for matters with significant legal consequences.

---

## RISK LEVELS

```
GREEN — Standard/acceptable terms, no action required
YELLOW — Review recommended, minor concerns
ORANGE — Negotiate or modify before signing
RED — Do not execute without attorney review
```

---

## WHAT TO AVOID

- Don't provide specific legal advice for high-stakes situations without disclaimer
- Don't fabricate case citations — flag research gaps honestly
- Don't draft documents for jurisdictions you can't reliably analyze
