---
name: sa-cybersecurity-agent
description: >
  SA-supercharged version of mukul975/Anthropic-Cybersecurity-Skills (754
  security skills across 26 domains). Extends the base library with Space
  Age-specific security: VPS hardening (DigitalOcean 146.190.78.120), API key
  rotation and .env security, Hermes Agent Telegram bot attack surface, Shopify
  store security, client data protection (credit repair records), and pipeline
  integrity monitoring. All 754 base skills map to 5 frameworks (MITRE ATT&CK,
  NIST CSF 2.0, MITRE ATLAS, MITRE D3FEND, NIST AI RMF). SA adds AI-specific
  attack surface coverage for the 5-agent swarm, prompt injection defense, and
  agent misuse detection. Trigger: "secure this", "harden the VPS", "audit
  security", "check for vulnerabilities", "protect the pipeline", "api key
  exposed", "is this safe".
license: Space Age AI Solutions — internal use
---

# SA Cybersecurity Agent Skill
## Base: mukul975/Anthropic-Cybersecurity-Skills | SA-extended May 2026

---

## INSTALL
```bash
npx skills add mukul975/Anthropic-Cybersecurity-Skills .
claude /list-skills | grep security
```

---

## 26 DOMAINS — SA PRIORITY MAP

| Domain | SA Priority | Reason |
|--------|-------------|--------|
| Cloud Security | CRITICAL | VPS + Docker |
| API Security | CRITICAL | 6 active API keys |
| AI/ML Security | CRITICAL | 5-agent swarm |
| Web App Security | HIGH | Shopify + client sites |
| Identity & Access | HIGH | API keys + Telegram |
| Incident Response | HIGH | Pipeline failures |
| Network Security | HIGH | VPS exposure |
| Container Security | HIGH | Docker deployments |
| Data Security | HIGH | Credit repair PII |
| Threat Hunting | MEDIUM | VPS monitoring |

---

## MODULE 1: VPS Hardening (146.190.78.120)

```bash
# Firewall
ufw default deny incoming && ufw default allow outgoing
ufw allow 22/tcp
ufw allow 8501/tcp   # MoneyPrinter (restrict to SA IP)
ufw allow 3000/tcp   # Hermes webhook
ufw enable

# SSH hardening
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd

# Brute force protection
apt install fail2ban -y && systemctl enable fail2ban
```

---

## MODULE 2: API Key Security

```bash
# .gitignore enforcement
echo ".env" >> .gitignore && echo "*.env" >> .gitignore

# Key rotation endpoints:
# DeepSeek → platform.deepseek.com
# OpenRouter → openrouter.ai/keys
# Gemini → console.cloud.google.com
# Higgsfield → higgsfield.ai/settings
# Vapi → vapi.ai/dashboard
```

```python
# Validate all keys are present and not corrupted
import os
required = ['DEEPSEEK_API_KEY','OPENROUTER_API_KEY','GEMINI_API_KEY','VAPI_API_KEY']
for key in required:
    val = os.getenv(key, '')
    status = 'OK' if len(val) > 20 else 'MISSING/SHORT'
    print(f"{status}: {key[:12]}...")
```

---

## MODULE 3: Hermes Agent Security

```python
# Whitelist — Only your Telegram ID
ALLOWED_TELEGRAM_IDS = []  # Add your ID from @userinfobot

def check_auth(user_id: int) -> bool:
    return user_id in ALLOWED_TELEGRAM_IDS

# Rate limiting — 10 commands/minute
from collections import defaultdict
import time
timestamps = defaultdict(list)

def rate_ok(uid: int) -> bool:
    now = time.time()
    ts = [t for t in timestamps[uid] if now-t < 60]
    timestamps[uid] = ts
    if len(ts) >= 10: return False
    ts.append(now); return True

# Never pass raw Telegram input to shell
import shlex
def safe(cmd: str) -> str:
    return shlex.quote(cmd)
```

---

## MODULE 4: Prompt Injection Defense (Agent Swarm)

```python
INJECTION_PATTERNS = [
    "ignore previous instructions","ignore all instructions",
    "you are now","new persona","system prompt","jailbreak",
    r"<\|.*?\|>", r"\[INST\]", r"###\s*System"
]
import re

def detect_injection(text: str) -> bool:
    for p in INJECTION_PATTERNS:
        if re.search(p, text, re.IGNORECASE): return True
    return False

def safe_agent_input(lead_data: dict) -> dict:
    for k, v in lead_data.items():
        if isinstance(v, str) and detect_injection(v):
            lead_data[k] = "[SANITIZED]"
            print(f"WARNING: Injection in field: {k}")
    return lead_data
```

---

## MODULE 5: Shopify Security

```python
# Webhook signature verification
import hashlib, hmac, base64

def verify_shopify_webhook(data: bytes, hmac_header: str, secret: str) -> bool:
    digest = hmac.new(secret.encode(), data, hashlib.sha256).digest()
    computed = base64.b64encode(digest).decode()
    return hmac.compare_digest(computed, hmac_header)
```

---

## MODULE 6: Credit Repair Data Protection

```python
# Hash all sensitive identifiers
import hashlib
def hash_sensitive(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

# File naming — zero PII in filenames
# BAD:  JohnSmith_SSN123_Experian.pdf
# GOOD: client_0047_dispute_experian_2026-05-29.pdf

# Retention: dispute docs 7 years (FCRA), PII delete 30 days post-case
```

---

## WEEKLY SECURITY AUDIT

```
[ ] Check fail2ban logs for blocked IPs
[ ] Review /var/log/hermes-agent.log
[ ] Verify no unknown processes on VPS
[ ] Confirm .env absent from all git history
[ ] Audit running Docker containers
[ ] Review Shopify app permissions
[ ] Test injection detection on swarm inputs
[ ] Verify Google Drive sharing settings
```

---

## 5-FRAMEWORK MAP

| Framework | Coverage |
|-----------|----------|
| MITRE ATT&CK | Adversary tactics |
| NIST CSF 2.0 | Govern/Identify/Protect/Detect/Respond/Recover |
| MITRE ATLAS | AI-specific adversarial attacks |
| MITRE D3FEND | Defensive countermeasures |
| NIST AI RMF | AI risk management |

---

## REPO

- https://github.com/mukul975/Anthropic-Cybersecurity-Skills (754 skills ⭐)
