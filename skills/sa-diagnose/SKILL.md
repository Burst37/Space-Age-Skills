---  
name: SA-diagnose  
description: >  
 Disciplined debugging skill for Space Age AI Solutions pipeline, VPS systems, and  
 automation infrastructure. Use IMMEDIATELY when: any script throws an error, the  
 Hermes agent stops responding, n8n/Make workflow breaks, Playwright scraper fails,  
 Vapi call doesn't fire, Telegram webhook goes silent, Shopify Buy Button breaks,  
 API returns unexpected response, or any pipeline step produces wrong output.  
 Trigger on: "it's broken", "this isn't working", "getting an error", "the bot stopped",  
 "the workflow failed", "something's wrong with", "why is X doing Y", "debug this",  
 "diagnose this", "the scraper died", or any pasted error message/stack trace.  
 Runs the Reproduce→Minimise→Hypothesise→Instrument→Fix→Regression-Test loop.  
allowed-tools: Bash, Read  
---  
  
# SA-Diagnose — Space Age Debugging Loop  
  
Adapted from Matt Pocock's `/diagnose` skill. Upgraded with Space Age infrastructure  
context: DO VPS, n8n, Vapi, Playwright, Telegram webhooks, Shopify, Hermes agent.  
  
---  
  
## The Core Loop  
  
```  
REPRODUCE → MINIMISE → HYPOTHESISE → INSTRUMENT → FIX → REGRESSION TEST  
```  
  
Never skip steps. Never jump to "fix" before "hypothesise." Most wasted debugging  
time comes from fixing the wrong thing.  
  
---  
  
## Step 1 — REPRODUCE  
  
First, confirm the bug is real and repeatable.  
  
```bash  
# Establish: does this always fail, or is it intermittent?  
# For VPS issues:  
ssh root@146.190.78.120  
# Check system resources first — don't assume it's code  
free -h && df -h && uptime  
  
# For n8n workflows:  
# Re-trigger the webhook manually with curl  
# For Playwright scraper:  
node scraper.js --debug 2>&1 | head -50  
# For Vapi:  
# Check dashboard → Calls log for the failed call UUID  
```  
  
**Checkpoint:** If you can't reproduce it, it's not a bug yet. Collect logs, timestamps,  
conditions. Don't write fixes for ghosts.  
  
---  
  
## Step 2 — MINIMISE  
  
Reduce the failing case to the smallest possible reproducer.  
  
Rules:  
- Remove all moving parts that aren't directly involved  
- Comment out everything except the failing path  
- If it's a multi-step pipeline, find which single step breaks  
- If it's a script, find which function fails  
  
SA Pipeline Isolation Checklist:  
- Is it the scraper? Test with 1 URL instead of the CSV batch  
- Is it the n8n webhook? Test the trigger node in isolation  
- Is it the Vapi call? Test with the simplest possible assistant config  
- Is it the Hermes agent? Test with a single Telegram command  
- Is it the site build? Test with a single module instead of all 30  
  
---  
  
## Step 3 — HYPOTHESISE  
  
Generate 3 hypotheses before touching any code. Force ranking.  
  
Format:  
```  
H1 (most likely): [cause] — because [evidence]  
H2: [cause] — because [evidence]   
H3: [cause] — because [evidence]  
```  
  
SA Infrastructure Common Causes:  
| System | Common Root Causes |  
|--------|-------------------|  
| DO VPS | Memory ceiling hit, cron not running, env vars not exported, port blocked |  
| n8n | Credential expired, webhook URL changed, node version incompatibility |  
| Playwright | Selector changed on target site, headless timeout, proxy blocked |  
| Vapi | Phone number not assigned, assistant config missing field, TTS quota |  
| Telegram bot | Token revoked, webhook not set, ngrok tunnel expired |  
| Shopify | Theme liquid syntax error, CORS block, CDN cache stale |  
| Claude API | Max tokens hit, context window exceeded, model string wrong |  
| DeepSeek | API key wrong base URL (must be `https://api.deepseek.com/v1`) |  
| Gemini | Free tier quota hit, billing needed for prod |  
  
---  
  
## Step 4 — INSTRUMENT  
  
Add targeted logging to confirm/deny H1 before fixing.  
  
```bash  
# Log the exact input/output at the failing boundary  
console.log('[DEBUG] Input to X:', JSON.stringify(input, null, 2))  
console.log('[DEBUG] Output of X:', JSON.stringify(output, null, 2))  
  
# For VPS — check logs at the relevant time window  
journalctl -u hermes --since "10 minutes ago"  
tail -100 /var/log/n8n/output.log  
  
# For API calls — log the full request before it fires  
console.log('[DEBUG] API call:', method, url, JSON.stringify(body))  
```  
  
Never instrument randomly. Target the boundary between "last known good" and "first known bad."  
  
---  
  
## Step 5 — FIX  
  
Fix H1 only. Apply the minimum change that resolves the confirmed cause.  
  
Rules:  
- No refactoring during bug fixes — keep scope tight  
- One change at a time  
- Comment what you changed and why: `// FIX: [cause] — [solution]`  
- If H1 fix doesn't work, check H2. Don't add more fixes on top of the first.  
  
---  
  
## Step 6 — REGRESSION TEST  
  
After fix, verify two things:  
  
1. The specific failure no longer reproduces  
2. Nothing adjacent broke  
  
```bash  
# Re-run the original failing case  
# Then run the integration test if one exists  
# If no test exists, create a minimal one now:  
# - Input that previously triggered the bug  
# - Assert expected output  
# - Commit as regression guard  
```  
  
**For SA Pipeline:** After any fix to a pipeline step, run a 3-lead end-to-end test  
(scrape → brief → build → outreach) before restoring full batch processing.  
  
---  
  
## SA-Specific Debugging Playbooks  
  
### Hermes Agent Down  
```bash  
ssh root@146.190.78.120  
ps aux | grep hermes  
# If dead: restart  
pm2 restart hermes  
# Check last exit:  
pm2 logs hermes --lines 50  
```  
  
### Playwright Scraper Failing  
```bash  
# Run single URL, verbose mode  
node scraper.js --url "https://maps.google.com/..." --debug  
# Check: is the target element still on the page?  
# Capture screenshot at failure point:  
await page.screenshot({ path: 'debug.png' })  
```  
  
### Vapi Call Not Firing  
```  
1. Check assistant UUID is correct  
2. Check phone number is assigned to the assistant  
3. Verify VAPI_API_KEY env var is set correctly  
4. Check call logs in Vapi dashboard for the attempt  
5. If number not provisioned, provision first via POST /phone-numbers  
```  
  
### n8n Webhook Silent  
```bash  
# Check if n8n is running:  
curl http://localhost:5678/healthz  
# Re-test webhook manually:  
curl -X POST http://localhost:5678/webhook/[id] -d '{"test":true}'  
# Check execution log in n8n UI for error details  
```  
  
### DeepSeek API Error  
```  
Common: wrong base URL — must be https://api.deepseek.com/v1 (not OpenAI URL)  
Model string: deepseek-v4-pro (not "deepseek-chat" — legacy, deprecated July 24 2026)  
Check: the key in VPS ~/.env is still valid — never hardcode the value here  
```  
  
---  
  
## When to Escalate vs. Debug  
  
| Signal | Action |  
|--------|--------|  
| Same bug after 3 hypothesis cycles | Stop. Describe symptom to fresh Claude session |  
| External API returning 5xx | Check provider status page. Not your code. Wait. |  
| VPS unreachable | Check DO dashboard. Reboot if frozen. Don't debug remotely. |  
| Intermittent only under load | It's a race condition or memory issue. Profile, don't patch. |  
| Bug appeared after a deploy | `git bisect` to find the commit. Revert first, diagnose second. |  
