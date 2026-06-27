# Private Nightclub — Build Progress & Handoff

_Flagship marketing/booking site for Private Nightclub (St. Louis). Lives in this
`private-nightclub/` subfolder; the repo root is a separate app
(`space-age-agent-os`)._

Branch: `claude/trusting-sagan-5z6ux2` · PR #43

---

## 🚀 Deploy to Vercel (do this to make the site + /owner dashboard live)

The MCP deploy tool can't target a subfolder or set env vars, so set it up once
in the Vercel dashboard — then every push auto-deploys.

1. **vercel.com → Add New → Project → import `Burst37/Space-Age-Skills`**
2. **Root Directory → `private-nightclub`** ← the critical setting
3. **Environment Variables** (add all three):

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | `https://oczbsvhkgbskxhmtkjnk.supabase.co` |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jemJzdmhrZ2Jza3hobXRram5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1Nzk1NTgsImV4cCI6MjA5ODE1NTU1OH0.kLJyq-1DEXIw2O_y3UUMiQi-rvKCB4uEMqTJ9qooQjg` |
   | `OWNER_PASSCODE` | _choose your own — this is the real secret_ |

4. **Deploy.**

> **Security:** the `SUPABASE_ANON_KEY` is RLS-bound (insert/select only on the
> three dashboard tables) and low-sensitivity. If this repo is ever public,
> rotate it in Supabase → Project Settings → API. The **passcode is the secret
> that matters** — pick a strong one, never reuse a real password.

---

## 🗄️ Supabase

- Project: **private-nightclub** · ref `oczbsvhkgbskxhmtkjnk` · org "Space Age AI Solutions" · region us-east-2 · free tier ($0/mo)
- Tables (RLS on; anon insert/select via policies, key used server-side only):
  - `menu_opens(item, category, tab, created_at)` — one row per menu-card open
  - `cta_clicks(label, created_at)` — Reserve / Guestlist clicks
  - `signups(email unique, name, source, created_at)` — email list
- Local secrets live in `private-nightclub/.env.local` (gitignored).

---

## ✅ Built & verified

- **Hero** — full-screen Escalade video + transparent amber liquid-glass jumbo type
- **Nav** — centered real gold logo, minimal links, Reserve/Guestlist CTAs
- **Intro** — split: headline + stat counters / real venue arrival photo
- **Services** — alternating cards (Bottle Service, Private Events, VIP Tables) with real venue photos + ken-burns on scroll
- **Menu** — bento court of branded food/bottle cards → **split-screen detail on tap** (name·category·price·note, prev/next). All 47 cards mapped to correct names/prices.
- **Concierge** — floating bubble with Tory's real headshot (backend = future Gemini Flash TTS agent)
- **JoinList** — email capture section → Supabase
- **Contact / footer** — map, hours, real logo
- **Owner dashboard `/owner`** — passcode-gated (cookie + middleware); metric tiles, ranked menu-engagement bars (Food/Bottle), CTA counts, email list + CSV export. Styled after the Agentic OS mission-control, recolored black + gold. Tracking is engagement (opens), **not POS sales**.
- **Orbiting 3D sphere gallery** ("The room") — 14 real venue photos on a Fibonacci sphere (Three.js): auto-rotate, drag-to-spin, tilt, depth fade, click-to-view; static-grid fallback. _Framing tuned by numbers, not eye — eyeball on deploy and tweak `R`/camera `z`/`CARD_W` in `SphereGallery.tsx` if needed._
- All real assets pulled from the user's Higgsfield account (logo, venue photos, Tory, menu cards).

---

## 🔜 Open / next

- [ ] **Deploy** (above) + change the passcode
- [ ] **Orbiting 3D sphere gallery** (Ruben Stom technique, Three.js) — venue/event photos. _Approved direction; not yet built._
- [ ] **Tory's brain** — wire `/api/concierge` to a real Gemini Flash TTS voice agent
- [ ] Optional: scrubbing-video hero, knockout text reveal (Ruben techniques on hand in scratch)

---

## Quick infra ref

| Key | Value |
|---|---|
| Repo | Burst37/Space-Age-Skills |
| App dir | `private-nightclub/` |
| Branch | `claude/trusting-sagan-5z6ux2` |
| Supabase ref | `oczbsvhkgbskxhmtkjnk` |
| Owner page | `/owner` |
