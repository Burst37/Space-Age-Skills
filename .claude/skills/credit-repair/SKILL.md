---
name: credit-repair
version: "2.0"
description: Full credit repair workflow for Space Age Credit Repair. Analyzes credit reports, identifies disputes, generates dispute letters, and provides credit-building strategy. Powered by Credit Karma MCP integration.
allowed-tools: Bash, Read, Write
---

# CREDIT REPAIR v2.0
## Space Age Credit Repair — Full Workflow Engine

## When to load this skill

- Client provides a credit report or credit score data
- User asks about disputing items, improving credit, or credit repair strategy
- Credit Karma MCP is active in session
- Any credit-related question from a Space Age Credit Repair client

---

## PHASE 1 — CREDIT ANALYSIS

### 1.1 Load Credit Data

Priority order:
1. Credit Karma MCP (`get_credit_factors`, `get_spending_overview`)
2. Uploaded credit report (PDF or text)
3. Manual data entry from client

### 1.2 Identify Negative Items

Categorize all negative items:
```
COLLECTIONS — third-party debt collectors
LATE PAYMENTS — 30/60/90/120+ day lates
CHARGE-OFFS — written off by original creditor  
JUDGMENTS — court-ordered debts
BANKRUPTCY — Chapter 7 or 13 filings
HARD INQUIRIES — within last 2 years
ERRORS — incorrect information (wrong balance, not yours, duplicate)
```

### 1.3 Dispute Priority Matrix

| Priority | Item Type | Reason |
|----------|-----------|--------|
| 1 | Errors / Not Mine | Highest dispute success rate |
| 2 | Old Collections (4+ years) | Near statute of limitations |
| 3 | Unverifiable Items | Creditor may not respond |
| 4 | Late Payments | Goodwill letter opportunity |
| 5 | Recent Negatives | Build strategy, not disputes |

---

## PHASE 2 — DISPUTE LETTER GENERATION

### FCRA Dispute Letter Template

```
[Client Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Dispute of Inaccurate Information — Account #[XXXX]

Dear Sir or Madam,

Pursuant to my rights under the Fair Credit Reporting Act (FCRA), 
Section 611, I am formally disputing the following item(s) on my 
credit report as [inaccurate / unverifiable / not mine]:

Creditor: [Name]
Account Number: [Last 4 digits]
Reason for Dispute: [Specific reason]

I request that you:
1. Investigate this item within 30 days as required by the FCRA
2. Provide me with the results of your investigation
3. Remove or correct this item if it cannot be verified

Enclosed: [Copy of ID / Copy of credit report with item marked]

Sincerely,
[Client Name]
[SSN Last 4: XXXX]
```

### Goodwill Letter Template (Late Payments)

```
Subject: Goodwill Adjustment Request — Account #[XXXX]

To Whom It May Concern,

I am writing to request a goodwill adjustment to remove the late 
payment(s) recorded on [date(s)] from my credit report.

I have been a customer since [year] and have maintained [X] on-time 
payments. The late payment(s) occurred due to [brief honest explanation]. 
This does not reflect my typical payment behavior.

I respectfully request that you consider removing these late payment 
notations as a goodwill gesture. I understand this is not required, 
but I would greatly appreciate your consideration.

[Client Name]
[Account Number]
[Contact Info]
```

---

## PHASE 3 — CREDIT BUILDING STRATEGY

### Score Improvement Roadmap

Based on credit factors (weighted by FICO):

| Factor | Weight | Quick Win |
|--------|--------|-----------|
| Payment History | 35% | Set all accounts to autopay |
| Credit Utilization | 30% | Pay balances to <10% |
| Credit Age | 15% | Don't close old accounts |
| Credit Mix | 10% | Add installment loan if missing |
| New Credit | 10% | Limit hard inquiries |

### 90-Day Quick Win Plan

```
Month 1:
- Send all verified dispute letters
- Set up autopay on all open accounts
- Pay down highest utilization card first

Month 2:
- Follow up on disputes (30-day mark)
- Apply for secured card if no open revolving credit
- Keep utilization <30% on all cards

Month 3:
- Check results of disputes
- Consider credit builder loan if score <580
- Authorized user strategy on family member's old account
```

---

## PHASE 4 — OUTPUT PACKAGE

Deliver to client:
1. **Credit Analysis Report** — summary of situation, priority items
2. **Dispute Letters** — ready to mail/send to each bureau
3. **90-Day Action Plan** — specific steps with timeline
4. **Tracking Sheet** — columns for each dispute, sent date, response date, result

---

## CREDIT KARMA MCP INTEGRATION

When Credit Karma MCP is active:
```
1. get_credit_factors → pull score and factor breakdown
2. get_spending_overview → identify payment pattern issues
3. Use data to personalize dispute priority and strategy
4. Reference specific account names and balances in letters
```

---

## WHAT TO AVOID

- Don't promise specific score increases (illegal in credit repair)
- Don't advise disputing accurate, verifiable negative items as "errors"
- Don't recommend paying collections without validating debt first
- Always include disclaimer: "Credit repair results vary. No guarantee of specific outcomes."
