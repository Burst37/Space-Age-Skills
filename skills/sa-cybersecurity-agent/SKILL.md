---  
name: sa-cybersecurity-agent  
description: >  
 SA-supercharged version of mukul975/Anthropic-Cybersecurity-Skills (754  
 security skills across 26 domains). Extends the base library with Space  
 Age-specific security concerns: VPS hardening (DigitalOcean 146.190.78.120),  
 API key rotation and .env security, Hermes Agent Telegram bot attack surface,  
 Shopify store security, client data protection (credit repair records), and  
 pipeline integrity monitoring. All 754 base skills map to 5 frameworks  
 (MITRE ATT\&CK, NIST CSF 2.0, MITRE ATLAS, MITRE D3FEND, NIST AI RMF).  
 SA adds: AI-specific attack surface coverage for the 5-agent swarm, prompt  
 injection defense, and agent misuse detection. Use when: hardening VPS,  
 auditing pipeline security, reviewing API key exposure, client data handling,  
 or any security review request. Trigger: "secure this", "harden the VPS",  
 "audit security", "check for vulnerabilities", "protect the pipeline",  
 "api key exposed", "is this safe".  
license: Space Age AI Solutions — internal use  
---  
  
# SA Cybersecurity Agent Skill  
## Base: mukul975/Anthropic-Cybersecurity-Skills | SA-extended May 2026  
  
---  
  
## INSTALL  
  
```bash  
# Install base library (26 platforms supported)  
npx skills add mukul975/Anthropic-Cybersecurity-Skills .  
  
# Verify install  
claude /list-skills | grep security  
```  
  
---  
  
## 26 SECURITY DOMAINS (Base Library)  
  
| Domain | Skill Count | SA Priority |  
|--------|-------------|-------------|  
| Cloud Security | ~30 | HIGH (VPS) |  
| Threat Hunting | ~28 | HIGH |  
| Threat Intel | ~32 | MEDIUM |  
| Web App Security | ~35 | HIGH (Shopify/sites) |  
| Malware Analysis | ~25 | LOW |  
| Digital Forensics | ~28 | MEDIUM |  
| Incident Response | ~30 | HIGH |  
| Network Security | ~27 | HIGH (VPS) |  
| Identity & Access Mgmt | ~29 | HIGH (API keys) |  
| Vulnerability Mgmt | ~28 | HIGH |  
| Security Operations | ~30 | MEDIUM |  
| AI/ML Security | ~25 | CRITICAL (SA) |  
| API Security | ~22 | CRITICAL (SA) |  
| Container Security | ~20 | HIGH (Docker) |  
| Data Security | ~18 | HIGH (credit data) |  
| + 11 more domains | ~199 | VARIES |  
  
---  
  
## SA PRIORITY SECURITY MODULES  
  
### MODULE 1: VPS Hardening (DigitalOcean 146.190.78.120)  
  
```bash  
# SA VPS Security Baseline  
  
# 1. Firewall rules (UFW)  
ufw default deny incoming  
ufw default allow outgoing  
ufw allow 22/tcp # SSH (change to non-standard port after)  
ufw allow 8501/tcp # MoneyPrinter UI (restrict to SA IP only)  
ufw allow 3000/tcp # Hermes Agent webhook  
ufw enable  
  
# 2. SSH hardening  
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config  
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config  
systemctl restart sshd  
  
# 3. Fail2Ban for brute force  
apt install fail2ban -y  
systemctl enable fail2ban  
systemctl start fail2ban  
  
# 4. Auto-updates  
apt install unattended-upgrades -y  
dpkg-reconfigure -plow unattended-upgrades  
  
# 5. Process monitoring  
apt install htop nethogs -y  
```  
  
### MODULE 2: API Key Security  
  
```bash  
# Audit all API keys in .env  
# NEVER commit .env to GitHub  
  
# .gitignore enforcement  
echo ".env" >> .gitignore  
echo ".env.local" >> .gitignore  
echo "*.env" >> .gitignore  
  
# Rotate if exposed — check each provider's dashboard for the current key,
# never write the value itself into a skill file or commit:  
# DeepSeek → rotate at: platform.deepseek.com  
# OpenRouter → rotate at: openrouter.ai/keys  
# Gemini → rotate at: console.cloud.google.com  
# Higgsfield → rotate at: higgsfield.ai/settings  
# Vapi → rotate at: vapi.ai/dashboard  
  
# Environment variable validation script  
python3 -c "  
import os  
required_keys = ['DEEPSEEK_API_KEY', 'OPENROUTER_API_KEY', 'GEMINI_API_KEY']  
for key in required_keys:  
 val = os.getenv(key, '')  
 if not val:  
 print(f'MISSING: {key}')  
 elif len(val) < 20:  
 print(f'SUSPICIOUS (too short): {key}')  
 else:  
 print(f'OK: {key[:8]}...')  
"  
```  
  
### MODULE 3: Hermes Agent Security (Telegram Bot)  
  
```python  
# Telegram bot attack surface hardening  
  
# 1. Whitelist allowed user IDs  
ALLOWED_TELEGRAM_IDS = [  
 # Your Telegram user ID only  
 # Find it: @userinfobot  
]  
  
def check_authorization(user_id: int) -> bool:  
 return user_id in ALLOWED_TELEGRAM_IDS  
  
# 2. Command injection prevention  
import shlex  
  
def sanitize_command(cmd: str) -> str:  
 # Never pass raw Telegram input to shell  
 # Use shlex.quote for any path/filename from user  
 return shlex.quote(cmd)  
  
# 3. Rate limiting  
from collections import defaultdict  
import time  
  
command_timestamps = defaultdict(list)  
RATE_LIMIT = 10 # commands per minute  
  
def rate_limit_check(user_id: int) -> bool:  
 now = time.time()  
 timestamps = command_timestamps[user_id]  
 timestamps = [t for t in timestamps if now - t < 60]  
 command_timestamps[user_id] = timestamps  
 if len(timestamps) >= RATE_LIMIT:  
 return False  
 timestamps.append(now)  
 return True  
  
# 4. Log all commands  
import logging  
logging.basicConfig(  
 filename='/var/log/hermes-agent.log',  
 level=logging.INFO,  
 format='%(asctime)s %(user_id)s %(command)s'  
)  
```  
  
### MODULE 4: Prompt Injection Defense (5-Agent Swarm)  
  
```python  
# Prompt injection detection for agent inputs  
  
INJECTION_PATTERNS = [  
 "ignore previous instructions",  
 "ignore all instructions",  
 "disregard",  
 "you are now",  
 "new persona",  
 "system prompt",  
 "jailbreak",  
 "forget everything",  
 r"<|.*?|>", # token injection  
 r"\\[INST\\]", # llama-style injection  
 r"###\\s*System", # markdown injection  
]  
  
import re  
  
def detect_injection(text: str) -> bool:  
 text_lower = text.lower()  
 for pattern in INJECTION_PATTERNS:  
 if re.search(pattern, text_lower, re.IGNORECASE):  
 return True  
 return False  
  
def safe_agent_input(lead_data: dict) -> dict:  
 """Sanitize lead data before passing to any agent"""  
 for key, value in lead_data.items():  
 if isinstance(value, str) and detect_injection(value):  
 lead_data[key] = "[SANITIZED]"  
 print(f"WARNING: Injection detected in field: {key}")  
 return lead_data  
```  
  
### MODULE 5: Shopify Store Security  
  
```bash  
# Shopify security checklist for TheOtherLevel + WYSIWYG  
  
# 1. API scope audit — no over-permissioned apps  
# Admin panel → Apps → View permissions → revoke unused scopes  
  
# 2. Webhook signature verification  
import hashlib, hmac, base64  
  
def verify_shopify_webhook(data: bytes, hmac_header: str, secret: str) -> bool:  
 digest = hmac.new(secret.encode('utf-8'), data, hashlib.sha256).digest()  
 computed_hmac = base64.b64encode(digest).decode()  
 return hmac.compare_digest(computed_hmac, hmac_header)  
  
# 3. CSP headers for custom themes  
# In theme.liquid <head>:  
# <meta http-equiv="Content-Security-Policy"   
# content="default-src 'self' *.shopify.com *.shopifycdn.com *.higgsfield.ai">  
```  
  
### MODULE 6: Credit Repair Data Protection  
  
```python  
# Client PII handling for Space Age Credit Repair  
  
# Data minimization — only collect what's needed  
ALLOWED_CREDIT_FIELDS = [  
 "full_name", "ssn_last4", "dispute_accounts",  
 "bureau_names", "case_status", "dispute_date"  
]  
  
# NEVER store in plain text  
import hashlib  
  
def hash_sensitive(value: str) -> str:  
 """Hash SSN and other sensitive identifiers"""  
 return hashlib.sha256(value.encode()).hexdigest()  
  
# File naming — no PII in filenames  
# BAD: JohnSmith_SSN123_Experian_Dispute.pdf  
# GOOD: client_0047_dispute_experian_2026-05-29.pdf  
  
# Retention policy  
# Dispute docs: 7 years (FCRA requirement)  
# Client PII: delete 30 days after case closed  
```  
  
---  
  
## SA SECURITY AUDIT CHECKLIST  
  
Weekly review protocol for Space Age infrastructure:  
  
```  
[ ] VPS: Check fail2ban logs for blocked IPs  
[ ] VPS: Review /var/log/hermes-agent.log for anomalies  
[ ] VPS: Verify no new processes running unexpectedly  
[ ] API Keys: Confirm none appear in git history  
[ ] Docker: Check running containers, kill unrecognized  
[ ] Shopify: Review app permissions, revoke unused  
[ ] Telegram Bot: Verify only whitelisted IDs can execute commands  
[ ] Agent Swarm: Test injection detection on sample inputs  
[ ] Google Drive: Audit shared files, revoke stale access  
[ ] Env vars: Verify .env not in any public repos  
```  
  
---  
  
## 5-FRAMEWORK MAPPING (Per Skill)  
  
Every SA security action maps to:  
| Framework | What It Covers |  
|-----------|----------------|  
| MITRE ATT\&CK | Adversary tactics and techniques |  
| NIST CSF 2.0 | Govern/Identify/Protect/Detect/Respond/Recover |  
| MITRE ATLAS | AI-specific adversarial ML attacks |  
| MITRE D3FEND | Defensive countermeasures |  
| NIST AI RMF | AI risk management framework |  
  
---  
  
## REPO  
  
- https://github.com/mukul975/Anthropic-Cybersecurity-Skills (754 skills, 26 domains ⭐)  
