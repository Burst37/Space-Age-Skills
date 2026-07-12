---
name: postiz
description: Self-hosted Postiz social media scheduler (20+ platforms) as a Buffer/Hootsuite replacement. Use when scheduling posts, wiring platform OAuth apps, or deploying/upgrading Postiz on the Space Age VPS.
source: https://github.com/gitroomhq/postiz-app
---

## Overview

Postiz schedules posts across 20+ platforms with AI captions, official-API analytics, team approvals, and a public API (n8n/Zapier compatible). Replaces Buffer ($10/channel/mo) / Hootsuite Pro ($199/mo). AGPL.

Verified from the repo's own `docker-compose.yaml` and `.env.example` — Postiz is not a single container: it ships with Postgres, Redis, and a full Temporal workflow stack (Elasticsearch + Postgres + Temporal server + admin tools + UI) bundled in the compose file. That's heavier than the guide's one-liner suggests — budget for it.

## Deploy (VPS-tailored)

```bash
git clone https://github.com/gitroomhq/postiz-app.git
cd postiz-app
cp .env.example .env
```

Edit `.env` / the compose environment block for your domain instead of localhost:

```
MAIN_URL=https://postiz.yourdomain.com
FRONTEND_URL=https://postiz.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://postiz.yourdomain.com/api
JWT_SECRET=<openssl rand -hex 32>
```

```bash
docker compose up -d
```

Postiz listens on `4007` internally (mapped from container port 5000). Front it with Caddy:

```
postiz.yourdomain.com {
    reverse_proxy localhost:4007
}
```

## Enhancement: trim the Temporal stack for a small VPS

The bundled compose includes `temporal-elasticsearch`, `temporal-postgresql`, `temporal`, `temporal-admin-tools`, and `temporal-ui` — five extra containers just for workflow scheduling. On a small VPS this is the difference between "fits in 4GB" and "doesn't." If you don't need the Temporal admin UI day-to-day, drop `temporal-ui` and `temporal-admin-tools` from the compose file (keep `temporal`, `temporal-postgresql`, `temporal-elasticsearch` — Postiz's scheduler depends on them) and reclaim ~1GB RAM.

## Gotchas (from source inspection)

- AGPL; you must create and maintain each platform's own OAuth developer app (X/Twitter API access costs extra on top).
- `STORAGE_PROVIDER` defaults to `local` — fine for one server, but if you ever move to multi-instance, switch to `CLOUDFLARE_*` (R2) settings, already stubbed in `.env.example`.
- `DISABLE_REGISTRATION` defaults to `false` in the compose file — set it to `true` after creating your admin account, or anyone who finds the URL can sign up.
- Listmonk integration exists out of the box (`LISTMONK_DOMAIN`/`LISTMONK_API_KEY` in `.env.example`) — pairs naturally with the `listmonk` skill in this repo if you self-host both.
