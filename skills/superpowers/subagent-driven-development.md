---  
name: superpowers-subagent-development  
display_name: "SPACE AGE — Subagent-Driven Development"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use when executing implementation plans with independent tasks in the current  
 session. Dispatches fresh subagents per task with two-stage review after each.  
 Trigger: have a plan, ready to execute, implement the plan, build from spec,  
 execute tasks, let's build this, start implementation.  
---  
  
# Subagent-Driven Development  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## Core Principle  
Fresh subagent per task + two-stage review (spec compliance → code quality) =  
high quality, fast iteration.  
  
**Why subagents**: Isolated context per task. No history bleed. Focused work.  
  
## Announce at Start  
"I'm using the superpowers-subagent-development skill to execute this plan."  
  
## The Loop (Repeat Per Task)  
  
```  
FOR EACH task in plan:  
 1. Dispatch fresh subagent with:  
 - Task description (from plan)  
 - Relevant files only (not entire codebase)  
 - Exact success criteria  
 - NO session history  
  
2. Subagent executes task  
  
3. Stage 1 Review — Spec Compliance:  
 "Does the output match the spec requirements?"  
 Pass → Stage 2 | Fail → Dispatch fix subagent  
  
4. Stage 2 Review — Code Quality:  
 "Is the code clean, minimal, correct patterns?"  
 Pass → Commit | Fail → Dispatch quality fix  
  
5. Commit task result  
  
6. Report completion → next task  
```  
  
## Subagent Dispatch Template  
```  
TASK: [exact task name from plan]  
FILES: [only the files this task needs]  
SPEC: [relevant section of spec]  
SUCCESS CRITERIA: [what done looks like]  
CONSTRAINTS:  
 - [Space Age constraint 1, e.g., "max 2 Playwright workers"]  
 - [constraint 2]  
DO NOT: [anti-patterns to avoid]  
DELIVER: [exact output format]  
```  
  
## Space Age Constraints to Include in Every Dispatch  
  
**Cinematic Builder tasks:**  
- Single-file HTML output only  
- GSAP + ScrollTrigger from cdnjs CDN only  
- No frameworks, no build step  
- prefers-reduced-motion wrapper required  
  
**LoyaltyBot tasks:**  
- Maximum 2 parallel Playwright workers  
- Intel Pentium Silver N6000 hardware limit  
- CapSolver integration required for CAPTCHAs  
- Results must write to CSV  
  
**Credit Repair tasks:**  
- FCRA citations required  
- No softened language (Accelerated Pressure Protocol Mode 3)  
- Affidavit format with tacit agreement structure  
  
## Two-Stage Review Checklist  
  
### Stage 1: Spec Compliance  
- [ ] Does output match spec requirements line by line?  
- [ ] Are all required fields/features present?  
- [ ] Are constraints respected?  
  
### Stage 2: Code Quality   
- [ ] No unnecessary complexity  
- [ ] Follows existing patterns in codebase  
- [ ] Error handling present  
- [ ] No hardcoded values that should be config  
