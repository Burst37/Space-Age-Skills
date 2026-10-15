---  
name: superpowers-verification  
display_name: "SPACE AGE — Verification Before Completion"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use before claiming ANY work is complete, fixed, or passing. Requires running  
 actual verification commands and showing output before making success claims.  
 Trigger: about to say done, fixed, complete, working, passing, ready, finished,  
 good to go, or committing/pushing/deploying anything.  
---  
  
# Verification Before Completion  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## THE IRON LAW  
```  
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE  
Run the command. Read the output. THEN claim the result.  
```  
  
## The Gate (5 Steps — All Required)  
1. IDENTIFY — what command proves this claim?  
2. RUN — execute it fresh, right now  
3. READ — full output, check exit code  
4. VERIFY — does output confirm the claim?  
5. CLAIM — only now state the result with evidence  
  
## Space Age Verification Commands  
  
### Cinematic Website Builder  
```bash  
# Does it open without console errors?  
open index.html # visual check  
# Does scroll work?  
# Does cursor reactive work?  
# Does mobile layout hold?  
# Does prefers-reduced-motion disable animations?  
```  
  
### LoyaltyBot  
```bash  
# Test single enrollment before batch  
node bot.js --test-single --site [sitename]  
# Check CSV output has correct columns  
head -5 results.csv  
# Verify worker count stays at 2  
cat logs/workers.log | grep "worker"  
```  
  
### Shopify Theme  
```bash  
shopify theme dev # no liquid errors?  
# Check all section settings appear in customizer  
# Verify mobile breakpoints  
```  
  
### Claude Code / Skills  
```bash  
# Skill description under 1024 chars?  
python3 -c "print(len('DESCRIPTION_HERE'))"  
# SKILL.md valid YAML frontmatter?  
python3 -c "import yaml; yaml.safe_load(open('SKILL.md').read().split('---')[1])"  
```  
  
### General Code  
```bash  
npm test # all tests pass?  
npm run build # build succeeds?  
npm run lint # no lint errors?  
git diff # what actually changed?  
```  
  
## What "Verified" Means Per Claim  
  
| Claim | Required Evidence |  
|---|---|  
| Tests pass | Test command output: 0 failures |  
| Bug fixed | Test original symptom: passes |  
| Build succeeds | Build command: exit 0 |  
| Site works | Browser open, no console errors |  
| Bot enrolls | Single enrollment success in log |  
| Skill valid | Char count + YAML parse both pass |  
  
## Red Flag Words — Run Verification First  
"should work", "probably", "seems to", "looks good",  
"I think it's fixed", "that should do it", "done!", "complete!", "perfect!"  
  
Any of these → STOP → run verification → THEN claim  
