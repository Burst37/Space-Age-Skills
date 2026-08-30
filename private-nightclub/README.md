# Private Nightclub — St. Louis After Dark

A cinematic flagship website for a luxury nightlife venue. Built to feel like a
nightlife trailer and a reservation engine at the same time: video-led hero,
GSAP scroll choreography, smooth scrolling, and conversion-focused VIP and
guestlist flows that are never buried.

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for layout and design tokens
- **GSAP + ScrollTrigger** for the major scroll modules (hero, pinned story, split showcase, counters)
- **Lenis** smooth scroll, synced to the GSAP ticker
- **Framer Motion** for discrete UI motion (cards, menu, forms, concierge)
- Self-hosted fonts via `next/font` (Cormorant Garamond display, Outfit UI) — no runtime font CDN
- Vercel-ready, zero required environment variables

GSAP and Framer Motion are intentionally kept in separate component trees, never
mixed in the same one.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build and run production:

```bash
npm run build
npm run start
```

## Project structure

```
public/video/
  hero.mp4            # 21:9 cinematic hero (Escalade arrival -> club reveal)
  club-ambience.mp4   # ambience footage behind the pinned typography
  poster.svg          # cinematic poster / video fallback
src/
  app/
    layout.tsx        # fonts, metadata, smooth-scroll provider
    page.tsx          # section composition + JSON-LD structured data
    globals.css       # design tokens, base styles, reduced-motion mandate
    api/
      reservations/   # VIP form handler
      guestlist/      # guestlist form handler
      concierge/      # AI concierge (knowledge base + optional live model)
  components/         # one file per section + ui/ primitives
  lib/
    site.ts           # all venue content (events, hours, FAQ, menu, tiers)
    gsap.ts           # registers ScrollTrigger once
    motion.ts         # spring tokens + reduced-motion / touch helpers
    submit.ts         # shared form submission + webhook forwarding
```

## Sections

Hero, pinned typography story, split-screen showcase (VIP / Bottle / Events /
Membership), floating experience gallery, events, VIP reservations, guestlist,
DJs / music, food and drinks, Black Card membership, social proof with animated
counters, dress code / parking / hours / FAQ, contact with map, and a floating
AI concierge.

## Editing content

All copy lives in `src/lib/site.ts`. Change events, hours, the menu, FAQ,
membership tiers, testimonials, and contact details there and the whole site
updates. There is no lorem ipsum anywhere.

## Forms

`VipReservation` and `Guestlist` are frontend-ready. They POST JSON to
`/api/reservations` and `/api/guestlist`. Each handler validates the required
fields and, if a webhook URL is configured, forwards the submission; otherwise
it logs server-side and still acknowledges the guest. Wire a real CRM or email
by setting:

```
RESERVATIONS_WEBHOOK_URL=...
GUESTLIST_WEBHOOK_URL=...
```

(for example a Make / Zapier / n8n webhook). No code change required.

## AI concierge

`/api/concierge` answers from a built-in venue knowledge base with **no API key
required** — pricing posture, dress code, parking, hours, events, birthdays,
guestlist, and membership. To upgrade to free-form answers from a live model,
set `CONCIERGE_API_KEY` (and optionally `CONCIERGE_MODEL`); it falls back to the
knowledge base on any failure.

Copy `.env.example` to `.env.local` to configure any of the optional values.

## Motion and accessibility

- Every motion module checks `prefers-reduced-motion`; GSAP contexts revert on
  cleanup, and Lenis is disabled so the browser scrolls natively.
- Parallax, pinning, custom tilt, and the magnetic cursor are disabled on touch
  and small screens.
- The hero ships a poster fallback and loads the video with `preload="metadata"`;
  below-fold video uses `preload="none"`.
- Major scroll modules are capped to stay within a healthy ScrollTrigger budget.

## Deploy to Vercel

Push the repo and import it in Vercel (root directory: `private-nightclub`). No
environment variables are required for a working deploy; add the optional ones
above to enable webhooks or the live concierge.

```bash
npx vercel
npx vercel --prod
```

## Replacing the hero video

Drop a new `hero.mp4` into `public/video/` (21:9 recommended, H.264, web-
optimized, with the `moov` atom at the front for fast start). Update the
`poster.svg` or swap in a JPG poster of the same dimensions if you prefer a photo
fallback.
