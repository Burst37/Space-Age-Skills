---
name: medusa
description: Self-hosted Medusa commerce backend as a Shopify Plus replacement. Use when scaffolding, deploying, or customizing a Medusa store on the Space Age VPS.
source: https://github.com/medusajs/medusa
---

## Overview

Medusa is a headless commerce framework/backend (Shopify Plus replacement). Verified against the actual repo: `medusajs/medusa` is the **framework source**, not a deployable template — it ships no `docker-compose.yml` of its own. The real getting-started path (per the repo's own README) is the CLI scaffolder, `npx create-medusa-app@latest`, which generates a new project with its own config.

## Deploy (VPS-tailored)

```bash
npx create-medusa-app@latest my-store
cd my-store
```

The scaffolder asks for a Postgres connection string and optionally seeds demo data. For the VPS, stand up Postgres + Redis alongside it:

```yaml
# docker-compose.yml (added to the scaffolded project — Medusa doesn't ship one)
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: <strong-password>
      POSTGRES_DB: medusa
    volumes:
      - medusa-pg:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - medusa-redis:/data

volumes:
  medusa-pg:
  medusa-redis:
```

Set `DATABASE_URL` and `REDIS_URL` in the scaffolded project's `.env` to point at these, then build and run the server per the CLI's own output (`npm run build && npm run start` in production, behind a process manager like `pm2` or a systemd unit — Medusa doesn't daemonize itself).

Front with Caddy:

```
store-api.yourdomain.com {
    reverse_proxy localhost:9000
}
```

## Enhancement: separate the admin dashboard

The scaffolder bundles the admin UI with the server by default. For a real store, consider deploying the storefront (Next.js starter, separate repo `medusajs/nextjs-starter-medusa`) on its own subdomain, keeping the Medusa server as a pure API behind `store-api.yourdomain.com` — matches how Shopify itself separates storefront from backend.

## Gotchas (from source inspection)

- MIT license — genuinely free, no catch here beyond the operational work of running Postgres/Redis yourself.
- There is a paid "Medusa Cloud" the README leads with first — the self-host path is one paragraph down (`docs.medusajs.com/learn`). Don't follow the Cloud CTA if the goal is self-hosting.
- Because it's a framework, not an app, "customizing" Medusa means writing modules/plugins in your scaffolded project — there's no config-only path to deep customization the way there is with, say, Listmonk or Postiz.
