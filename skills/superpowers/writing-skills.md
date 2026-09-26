---  
name: superpowers-writing-skills  
display_name: "SPACE AGE — Skill Writer & Validator"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use when creating new Claude skills, editing existing skills, or validating  
 skills work before saving. Enforces the 1024-char description limit, proper  
 YAML frontmatter, and Space Age naming convention. Trigger: write a skill,  
 create a skill, make a SKILL.md, new skill for X, skill that does Y, save  
 this as a skill, turn this into a skill.  
---  
  
# Skill Writer & Validator  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## Space Age Skill Rules (Non-Negotiable)  
  
### 1. Naming Convention  
```  
File: SKILL--[what-it-does].md (for download/storage)  
Folder: /mnt/skills/user/[skill-name]/ (for Claude Code)  
name: [skill-name] (YAML frontmatter)  
display_name: "SPACE AGE — [Human Name]"  
```  
  
### 2. Description Field — 1024 Char Hard Limit  
```python  
# Always verify before saving:  
desc = "your description here"  
print(f"{len(desc)} chars — {'OK' if len(desc) <= 1024 else 'OVER by ' + str(len(desc)-1024)}")  
```  
  
The description is a TRIGGER, not documentation.  
It answers: when should this skill activate?  
All operational instructions go in the SKILL.md body.  
  
### 3. Required YAML Frontmatter  
```yaml  
---  
name: skill-name  
display_name: "SPACE AGE — Human Readable Name"  
version: "1.0"  
last_updated: "YYYY-MM"  
description: >  
 [Under 1024 chars. Trigger phrases. What it does. When to use.]  
---  
```  
  
### 4. Body Structure  
```markdown  
# Skill Title  
**Space Age AI Solutions** | Version X.X  
  
## ROLE / PURPOSE  
One paragraph: what this skill makes Claude do.  
  
## [MAIN CONTENT]  
All the intelligence, protocols, code, checklists.  
  
## OUTPUT FORMAT  
What does it produce? Format? Location?  
  
## INTEGRATION  
Which other skills does it connect to?  
```  
  
## The TDD Process for Skills  
  
### Red Phase: Write Test Cases  
Before writing the skill, write 3 pressure scenarios:  
```  
Scenario 1: [Trigger phrase that SHOULD activate skill]  
Scenario 2: [Edge case — harder trigger]  
Scenario 3: [False positive — should NOT activate]  
```  
  
### Green Phase: Write the Skill  
Write SKILL.md. Verify description triggers all scenarios 1 and 2.  
Verify scenario 3 does NOT trigger.  
  
### Refactor Phase: Optimize Description  
Tighten trigger phrases. Remove redundancy.  
Add specific phrase examples that will reliably activate.  
  
## Validation Checklist  
```  
[ ] name: field present and matches folder name  
[ ] display_name: set with "SPACE AGE —" prefix  
[ ] description: under 1024 chars  
[ ] description: contains trigger phrases (when to use)  
[ ] YAML frontmatter: valid (no tabs, proper quotes)  
[ ] File named: SKILL--[descriptive-name].md  
[ ] Body: has ROLE/PURPOSE section  
[ ] Body: has operational instructions  
[ ] Body: has output format specification  
[ ] Integration: notes which other skills connect  
```  
  
## Where to Save  
```  
Download/storage: /mnt/user-data/outputs/SPACE-AGE-SKILLS/SKILL--[name].md  
Claude Code: /mnt/skills/user/[name]/SKILL.md  
```  
