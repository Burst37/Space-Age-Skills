---  
name: superpowers-finish-branch  
display_name: "SPACE AGE — Finish Dev Branch & Ship"  
version: "1.0 (enhanced from obra/superpowers)"  
description: >  
 Use when implementation is complete and tests pass — guides the final steps  
 to merge, PR, or deploy. Trigger: implementation done, ready to merge, ship  
 this, create PR, push to main, deploy to Vercel, push to Shopify, release.  
---  
  
# Finish Dev Branch & Ship  
**Source**: obra/superpowers (enhanced for Space Age AI Solutions)  
  
## Announce at Start  
"I'm using the superpowers-finish-branch skill to complete this work."  
  
## Step 1: Verify Tests Pass  
Run full test suite. Show output. If any failures → stop, debug first.  
  
## Step 2: Present Options  
  
### Option A: Direct Merge to Main  
For: small fixes, solo work, personal projects  
```bash  
git checkout main  
git merge [branch]  
git push origin main  
```  
  
### Option B: Pull Request  
For: team review, client approval, staged deployment  
```bash  
git push origin [branch]  
gh pr create --title "[title]" --body "[description]"  
```  
  
### Option C: Deploy Without Merge (Preview)  
For: client review before merge  
- **Vercel**: `vercel deploy` → gets preview URL  
- **Shopify**: `shopify theme push --theme [preview-id]`  
  
## Space Age Deployment Checklists  
  
### Cinematic Website Builder → Client Delivery  
- [ ] Single HTML file confirmed  
- [ ] All CDN links working (GSAP, fonts)  
- [ ] Mobile layout tested  
- [ ] prefers-reduced-motion tested  
- [ ] File size reasonable  
- [ ] Delivered to /mnt/user-data/outputs/  
  
### LoyaltyBot → Production  
- [ ] Single-site test passed  
- [ ] Worker count confirmed max 2  
- [ ] CSV output format correct  
- [ ] Error handling tested (bad site, captcha, timeout)  
- [ ] Results file path correct  
  
### Shopify Theme → Live  
- [ ] shopify theme dev ran clean  
- [ ] All customizer settings appear  
- [ ] Mobile breakpoints verified  
- [ ] Performance score acceptable  
- [ ] `shopify theme push --live` with confirmation  
  
### Skill Files → Skill Library  
- [ ] Description under 1024 chars  
- [ ] YAML frontmatter valid  
- [ ] File named descriptively (SKILL--[what-it-does].md)  
- [ ] display_name set  
- [ ] Copied to /mnt/user-data/outputs/SPACE-AGE-SKILLS/  
  
## Step 3: Cleanup  
- Delete feature branch after merge  
- Close related issues  
- Update any docs that changed  
- Commit final state  
  
## Step 4: Confirm Ship  
Run `superpowers-verification` before announcing anything is live.  
