---
name: open-generative-ai
description: Self-hosted Open Generative AI studio (image/video/audio UI) positioned against Midjourney/Runway/Sora. Use when deploying it and to understand it's a UI over the paid MuAPI backend, not free local generation.
source: https://github.com/Anil-matcha/Open-Generative-AI
---

## Overview

Open Generative AI is a self-hostable UI for image/video/audio generation (200+ models: Flux, Midjourney, Kling, Sora, Veo, Seedream, and more). Verified from the repo's own `docker-compose.yml` and README.

**Read this before deploying — it changes what "replaces Midjourney+Runway+Sora" actually means:** the app itself is open-source and self-hostable, but every generation call is routed through **MuAPI**, a paid third-party API (the README badges "Powered by MuAPI" throughout, and the maintainer has referral/discount links to it). This replaces the *subscription* model of Midjourney/Runway/Sora with *pay-per-generation* credits on MuAPI — it does not make image/video generation free. Set expectations with whoever you're deploying this for.

## Deploy (VPS-tailored)

```bash
git clone https://github.com/Anil-matcha/Open-Generative-AI.git
cd Open-Generative-AI
docker compose up -d
```

The stock compose is minimal (single Node service, port 3001→3000, `NODE_ENV=production`). Front with Caddy:

```
studio.yourdomain.com {
    reverse_proxy localhost:3001
}
```

Per the README, API keys are entered per-user in the browser and stored in `localStorage` — there's no server-side key you need to provision for a shared deploy; each user brings their own MuAPI key.

## Enhancement: add HTTPS + basic auth if sharing team-wide

Since API keys live in browser localStorage per the README, and the compose file has no auth layer, put basic auth in Caddy if more than one person will use this on a shared subdomain, so random visitors can't burn someone else's stored key by session-hijacking an unauthenticated page:

```
studio.yourdomain.com {
    basicauth {
        team JDJhJDEwJC4uLg==
    }
    reverse_proxy localhost:3001
}
```
(Generate the hash with `caddy hash-password`.)

## Gotchas (from source inspection)

- Not a subscription-free replacement — ongoing cost moves from "Midjourney/Runway monthly fee" to "MuAPI usage credits." Compare actual per-generation MuAPI pricing against what you're currently paying before assuming savings.
- No content filtering by design (README states this explicitly) — if this will be used by a team/client-facing, that's a policy decision to make deliberately, not a default to inherit silently.
- Desktop Electron builds exist too (macOS/Windows/Linux installers) if a given user just wants a local app instead of hitting a shared server.
