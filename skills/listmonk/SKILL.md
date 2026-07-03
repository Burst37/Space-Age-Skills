---
name: listmonk
description: Self-hosted Listmonk newsletter/mailing-list manager as a Mailchimp replacement. Use when sending campaigns, managing subscriber lists, or deploying Listmonk on the Space Age VPS.
source: https://github.com/knadh/listmonk
---

## Overview

Listmonk is a single Go binary + Postgres for newsletters and transactional-style mailing lists. Replaces Mailchimp. Verified from the repo's own `docker-compose.yml`.

## Deploy (VPS-tailored)

```bash
mkdir listmonk && cd listmonk
curl -LO https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Edit before first run:
- `hostname: listmonk.example.com` → your real FQDN (recommended, not required)
- Set `LISTMONK_ADMIN_USER` / `LISTMONK_ADMIN_PASSWORD` env vars so the super-admin is created automatically on first boot instead of via the setup wizard.

```bash
LISTMONK_ADMIN_USER=admin LISTMONK_ADMIN_PASSWORD='<strong-password>' docker compose up -d
```

The compose file already runs `--install --idempotent --yes` then `--upgrade --yes` on every start — safe to `docker compose up -d` again after pulling a new image; migrations run automatically.

Front with Caddy:

```
lists.yourdomain.com {
    reverse_proxy localhost:9000
}
```

## Enhancement: sending domain setup

Listmonk itself doesn't send mail — it needs an SMTP relay configured in Admin → Settings → SMTP after first login. Two good options for a self-hosted stack:
1. Point it at your own **Stalwart** instance (see the `stalwart` skill) if you're already self-hosting mail — keeps everything in-house.
2. Use a dedicated transactional relay (SES, Postmark, Resend) for deliverability if you don't want to manage IP reputation for bulk sends — bulk newsletter sending is harder on deliverability than transactional mail from Stalwart alone.

## Gotchas (from source inspection)

- The Postgres port in the default compose is bound to `127.0.0.1:5432` only — correct for security, but means you can't connect to the DB from another host without changing that binding deliberately.
- `LISTMONK_db__max_open`/`max_idle` default to 25 — fine for single-VPS scale, no need to tune unless you're sending very large campaigns.
- No built-in list-cleaning/deliverability tooling — bounce handling requires configuring a bounce mailbox in settings, it's not automatic out of the box.
