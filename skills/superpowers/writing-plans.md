---  
name: superpowers-writing-plans  
display_name: "SPACE AGE — Implementation Plan Writer"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use when you have a spec or approved design and need a step-by-step  
 implementation plan before touching code. Runs after brainstorming approval.  
 Trigger: "write the plan", "create implementation plan", approved design doc  
 exists, ready to build, moving from design to execution.  
---  
  
# Implementation Plan Writer  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## PURPOSE  
Turn an approved spec into a bite-sized, engineer-ready implementation plan  
that assumes zero codebase familiarity. Every task self-contained.  
  
## Announce at Start  
"I'm using the superpowers-writing-plans skill to create the implementation plan."  
  
## Space Age Plan Templates  
  
### Cinematic Website Builder Plan  
```  
Task 1: Set up HTML shell — doctype, viewport, Google Fonts CDN, GSAP CDN  
Task 2: CSS variables at :root — brand colors, fonts, spacing  
Task 3: Implement [Module #] — HTML structure + CSS + JS  
Task 4: Implement [Module #] — HTML structure + CSS + JS  
Task 5: Mobile responsiveness — touch events, cursor disable on mobile  
Task 6: prefers-reduced-motion wrapper on all GSAP calls  
Task 7: Quality check — 7 items from OUTPUT STANDARDS  
```  
  
### LoyaltyBot Plan  
```  
Task 1: Identify target site structure — selectors, form fields  
Task 2: Write Playwright script for single enrollment  
Task 3: Test single enrollment — verify success detection  
Task 4: Add to CSV pipeline — input/output format  
Task 5: Parallel worker integration — max 2 workers  
Task 6: Error handling — captcha, timeout, rate limit  
Task 7: Results logging — CSV output format  
```  
  
### Shopify Theme Plan  
```  
Task 1: section .liquid file — schema + HTML structure  
Task 2: /assets/ CSS file — styles + CSS variables  
Task 3: /assets/ JS file — interactions + animations  
Task 4: Schema settings — customizer fields  
Task 5: Mobile breakpoints  
Task 6: Theme editor preview test  
```  
  
## Plan Requirements  
Every plan must include:  
- **Which files to touch** for each task (exact paths)  
- **Code samples** for complex tasks  
- **Test command** to verify each task  
- **Commit point** after each logical chunk — frequent commits  
- **DRY / YAGNI flags** — note anything that might be over-engineered  
  
## Plan Format  
```markdown  
# Implementation Plan: [Feature Name]  
Date: YYYY-MM-DD  
Spec: docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md  
  
## Prerequisites  
- [list dependencies, env vars, tools needed]  
  
## Tasks  
  
### Task 1: [Name]  
Files: [exact file paths]  
What: [what to do]  
How: [code sample or steps]  
Test: [command to verify]  
Commit: "feat: [description]"  
  
### Task 2: [Name]  
...  
```  
  
## Save Location  
`docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`  
Commit to git immediately.  
  
## After Writing Plan  
Invoke `superpowers-subagent-driven-development` or `superpowers-executing-plans`.  
