# Private Nightclub — Build Progress & Handoff

_Flagship marketing/booking site for Private Nightclub (St. Louis). Lives in this
`private-nightclub/` subfolder; the repo root is a separate app
(`space-age-agent-os`)._

Branch: `claude/trusting-sagan-5z6ux2` · PR #43

---

## ✅ LIVE: https://private-nightclub.vercel.app
Deployed to the Vercel team (project `private-nightclub`) via CLI; all 5 env vars set + encrypted in production; Tory (Gemini) + owner dashboard verified working live. Owner: `/owner` — the passcode lives only in the Vercel `OWNER_PASSCODE` env var (never commit it). Note: deployed via CLI, not git-connected — re-deploy with `vercel deploy --prod` or connect the GitHub repo in Vercel for auto-deploys.

---

## 🚀 Deploy to Vercel (reference — already done once via CLI)

The MCP deploy tool can't target a subfolder or set env vars, so set it up once
in the Vercel dashboard — then every push auto-deploys.

1. **vercel.com → Add New → Project → import `Burst37/Space-Age-Skills`**
2. **Root Directory → `private-nightclub`** ← the critical setting
3. **Environment Variables** (add all three):

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | _from Supabase → Project Settings → API (keep out of git)_ |
   | `SUPABASE_ANON_KEY` | _from Supabase → Project Settings → API (keep out of git)_ |
   | `OWNER_PASSCODE` | _choose your own — this is the real secret_ |
   | `GEMINI_API_KEY` | _Tory's brain. A VALID key is set in the workspace `.env.local` and verified working — paste that same value into Vercel on deploy. (Not committed to git.)_ |
   | `GEMINI_MODEL` | `gemini-2.5-flash` |

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
- **Concierge** — floating bubble with Tory's real headshot + a glass label. Text brain = Gemini. **Live voice = Gemini 3.1 Flash Live (native audio), base voice Charon** steered to a warm St. Louis host (mixed Black/Latino male, early 30s). Tap-to-call mic in the panel; browser connects to Gemini over WebSocket using a short-lived **ephemeral token** minted by `/api/concierge/live-token` (real key never reaches the browser; persona/voice/model locked server-side). Transcripts stream into the chat. **NOT Higgsfield.**
- **JoinList** — email capture section → Supabase
- **Contact / footer** — map, hours, real logo
- **Owner dashboard `/owner`** — passcode-gated (cookie + middleware); metric tiles, ranked menu-engagement bars (Food/Bottle), CTA counts, email list + CSV export. Styled after the Agentic OS mission-control, recolored black + gold. Tracking is engagement (opens), **not POS sales**.
- **Orbiting 3D sphere gallery** ("The room") — 14 real venue photos on a Fibonacci sphere (Three.js): auto-rotate, drag-to-spin, tilt, depth fade, click-to-view; static-grid fallback. _Framing tuned by numbers, not eye — eyeball on deploy and tweak `R`/camera `z`/`CARD_W` in `SphereGallery.tsx` if needed._
- All real assets pulled from the user's Higgsfield account (logo, venue photos, Tory, menu cards).

---

## 🔜 Open / next

- [ ] **Deploy** (above) + change the passcode
- [x] **Orbiting 3D sphere gallery** — built ("The room", Three.js).
- [x] **Tory's brain (text)** — `/api/concierge` uses Gemini (gemini-2.5-flash) grounded in the whole site + menu, Claude + KB fallbacks. ✓ Verified live with a valid key (in workspace `.env.local`; add to Vercel env on deploy).
- [x] **Tory voice** — Gemini 3.1 Flash Live native-audio, two-way conversation, Charon base voice. ✓ Verified end-to-end (token mint + live connect returns audio + transcript). Env: `GEMINI_LIVE_MODEL`, `GEMINI_VOICE` set in `.env.local` + Vercel prod. 15-min audio session cap handled gracefully.
- [ ] **Tory voice (next)** — optional: session-resumption auto-reconnect past the 15-min cap; voice-base A/B (one-line `GEMINI_VOICE` swap) once owner hears Charon.
- [ ] Optional: scrubbing-video hero (needs a dense-keyframe re-encode; no ffmpeg here).

---

## Quick infra ref

| Key | Value |
|---|---|
| Repo | Burst37/Space-Age-Skills |
| App dir | `private-nightclub/` |
| Branch | `claude/trusting-sagan-5z6ux2` |
| Supabase ref | `oczbsvhkgbskxhmtkjnk` |
| Owner page | `/owner` |
