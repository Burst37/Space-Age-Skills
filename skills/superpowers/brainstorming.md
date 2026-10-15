---  
name: superpowers-brainstorming  
display_name: "SPACE AGE — Brainstorming & Design Gate"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use BEFORE any creative or build work — features, websites, tools, components,  
 products. Explores intent and requirements through dialogue before any code or  
 implementation. Hard-gates all action until a design is approved. Trigger when  
 user says: build this, create this, make me a, I want to build, let's make,  
 new feature, new project, or any creative request lacking a confirmed spec.  
---  
  
# Brainstorming — Design-First Gate  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## THE IRON RULE  
<HARD-GATE>  
Do NOT write code, scaffold, or implement ANYTHING until:  
1. Design has been presented  
2. User has explicitly approved it  
This applies to every project, no matter how simple.  
</HARD-GATE>  
  
## Space Age Enhancement: Product Context  
Before asking clarifying questions, check which Space Age product this relates to:  
- **LoyaltyBot** → 2 worker max, Playwright, CSV pipeline concerns  
- **Cinematic Website Builder** → which moodboard A–N, which of the 30 modules  
- **Record Exec in a Box** → artist name, content type, platform target  
- **Shopify eCommerce** → client revenue tier, theme, conversion goal  
- **Credit Repair** → FCRA/Metro 2 mode, dispute type, client bureau  
- **New product** → full design flow below  
  
## The Process (9 Steps — In Order)  
  
1. **Explore project context** — read files, docs, recent commits  
2. **Identify Space Age product context** — see above  
3. **Offer visual companion** if visual questions ahead (own message only)  
4. **Ask clarifying questions** — ONE at a time, multiple choice preferred  
5. **Propose 2–3 approaches** with tradeoffs and recommendation  
6. **Present design** — sections scaled to complexity, approve each section  
7. **Write design doc** → `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`  
8. **Spec self-review** — scan for placeholders, contradictions, scope issues  
9. **Transition** → invoke `superpowers-writing-plans` skill ONLY  
  
## Key Principles  
- YAGNI ruthlessly — cut features that aren't needed now  
- One question per message — no question dumps  
- Multiple choice > open-ended  
- Simple designs can be 3 sentences — but still need approval  
- NEVER jump to implementation without the gate passing  
  
## Anti-Patterns to Reject  
- "This is too simple to need a design" → wrong, do it anyway  
- "Let me just start coding and we'll figure it out" → hard no  
- Combining the visual companion offer with a question → own message only  
- Asking multiple questions at once → one at a time only  
  
## After Design Approval  
Write spec to `docs/superpowers/specs/` → commit → ask user to review →  
then invoke `superpowers-writing-plans`. No other skill. No code.  
