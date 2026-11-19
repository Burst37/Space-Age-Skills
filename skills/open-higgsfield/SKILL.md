---
name: open-higgsfield
description: Self-hosted OpenHiggsfield studio (Next.js 16) — one prompt bar for 38 image/video models (Soul, Seedance, Kling 3, Wan, Flux, etc.) with gallery, batch, history. Use when the user wants a local/own-key studio instead of the Higgsfield MCP, or wants to extend/deploy it.
---

# open-higgsfield

Source for the open-source Higgsfield-style studio, vendored in `app/`. For one-off generations use `higgsfield-video-studio` (MCP) instead; use this when you need a hosted UI, custom catalog entries, or own-key billing.

## Run
```bash
cd skills/open-higgsfield/app
pnpm install && pnpm dev     # http://localhost:3000
```
Press **Add key**, paste the platform key as `id:secret` (stored in an httpOnly cookie via server action).

## Env (`app/.env.example`)
- `HF_API_BASE_URL` — generation API origin, server only
- `OPEN_HIGGSFIELD_READ_WRITE_TOKEN` — Vercel Blob read-write token (uploads)

Never commit real values; set them in Vercel (MCP/CLI) or `.env.local`.

## Extend
- Models live in `app/src/generation/catalog/`; a new entry appears in the picker with its own settings and media roles. No UI change needed.
- Generate = one object `{ model, prompt, media, settings }` → server action → API mapping. Browser never calls the generation API.
- Stores: 5 small Zustand stores; history in IndexedDB (60 records, favorites exempt).

## Deploy
Vercel (team in CLAUDE.md quick reference). Needs the Blob token above. `pnpm build` verifies.

Not tested here: build and generation were not run in the session that vendored this; run `pnpm build` before relying on it. See `UPSTREAM.md`.
