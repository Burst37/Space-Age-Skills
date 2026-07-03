---
name: stalwart
description: Self-hosted Stalwart mail server (SMTP/IMAP/JMAP/POP3 + CalDAV/CardDAV/WebDAV) as a Google Workspace email replacement. Use when standing up or troubleshooting email hosting on the Space Age VPS.
source: https://github.com/stalwartlabs/stalwart
---

## Overview

Stalwart is the whole mail stack (SMTP, IMAP, JMAP, POP3, plus CalDAV/CardDAV/WebDAV) as one Rust binary/container, with a built-in spam filter and a web admin (OIDC/LDAP/2FA). Replaces Google Workspace email (~$14/user/mo Business Standard). AGPL core.

Verified by cloning `stalwartlabs/stalwart` directly — the repo's Dockerfile is a multi-stage cargo-chef build (features: `sqlite postgres mysql rocks s3 redis azure nats enterprise`); you don't need to build it yourself, use the published image.

## Deploy (VPS-tailored)

Stalwart needs a public VM with real DNS control — it will not work behind NAT for inbound SMTP (port 25). On the Space Age VPS (146.190.78.120):

```yaml
# docker-compose.yml
services:
  stalwart:
    image: stalwartlabs/stalwart:latest
    container_name: stalwart
    restart: unless-stopped
    ports:
      - "25:25"     # SMTP
      - "465:465"   # SMTPS
      - "587:587"   # Submission
      - "143:143"   # IMAP
      - "993:993"   # IMAPS
      - "4190:4190" # ManageSieve
      - "8080:8080" # Web admin / JMAP
    volumes:
      - stalwart-data:/opt/stalwart
volumes:
  stalwart-data:
```

```bash
docker compose up -d
# First run creates an admin password — check container logs:
docker compose logs stalwart | grep -i "admin"
```

### DNS records required (this is the real work, not the container)

- `MX` → mail.yourdomain.com
- `A`/`AAAA` → mail.yourdomain.com → 146.190.78.120
- `SPF` (TXT) → `v=spf1 mx ~all`
- `DKIM` — generate in the Stalwart admin UI (Settings → DKIM), publish the TXT record it gives you
- `DMARC` (TXT on `_dmarc`) → start with `p=none` while testing, tighten later
- Reverse DNS (PTR) for 146.190.78.120 → mail.yourdomain.com — set this at the VPS provider (DigitalOcean), not in your DNS zone. Missing PTR is the #1 reason mail lands in spam.

## Enhancement: Caddy front for the web admin only

Don't put Caddy in front of SMTP/IMAP ports — only the web admin (8080) benefits from a friendly HTTPS domain:

```
mail-admin.yourdomain.com {
    reverse_proxy localhost:8080
}
```

## Gotchas (from source inspection)

- AGPL core license — the "enterprise" cargo feature is compiled in by the official image but enterprise features are licensed separately; core mail serving is free.
- Deliverability is entirely on you: no PTR record, no DKIM, or a fresh untrusted IP will get you spam-boxed by Gmail/Outlook regardless of how correct the server config is.
- Warm up a new sending IP gradually (start with low volume) if 146.190.78.120 hasn't sent mail before.
