# One-Prompt Website Pack

Ten copy-paste prompts that turn a single sentence into a cinematic, award-winning-style
website — AI-generated video (Seedance 2.0 via the Higgsfield MCP), scroll-driven animation,
launched and verified. Source: *The One-Prompt Website Pack*, Zubair Trabzada / AI Workshop,
2026 edition.

## When to use this skill

Load this whenever a client or internal project needs a cinematic, scroll-driven marketing
site (portfolio, product launch, e-commerce, restaurant, real estate, automotive, SaaS,
agency, gym, or similar) and the plan is to generate hero video/imagery with the Higgsfield
MCP (Seedance 2.0) plus a Claude-built scroll site.

## Requirements

- Claude Code (or Claude desktop/web) with the **Higgsfield MCP** connected
- Higgsfield credits for the **Seedance 2.0** model
- For portfolio-style builds: a well-lit, front-facing reference photo of the subject

## Core technique (applies to every template)

1. **Paste the whole prompt unedited the first time.** Each template is a complete brief —
   video shots, site structure, design direction, and a launch+verify instruction. Run it
   once as-is before customizing.
2. **The hero-image trick.** Every prompt generates ONE hero image first, then passes it as
   an image reference to every subsequent video clip. This is what keeps the product/person/
   place identical across all shots — never skip this step.
3. **Chain clips for "one continuous shot" journeys.** Seedance 2.0 accepts a start image and
   an end image. Journey-style templates (deep-sea descent, hypercar, penthouse) use each
   clip's final frame as the next clip's start frame so multiple clips scrub as one unbroken
   camera move.
4. **Control credit spend.** Default to std mode, 1080p, ~8s per clip, no audio. Only render
   4K for a final showpiece.
5. **Iterate like a director, not a developer.** After the first build, give feeling-based
   notes ("make the hero 20% slower," "swap the font, it looks generic") and let Claude
   translate intent into code.

## Template index

| # | Template | Best for |
|---|----------|----------|
| 01 | [Luxury Product](templates/01-luxury-product.md) | Watches, jewelry, audio gear, sneakers — premium physical products |
| 02 | [Experience / Journey](templates/02-experience-journey.md) | Expeditions, tourism, museums — anything where scroll = a journey |
| 03 | [Personal Portfolio](templates/03-personal-portfolio.md) | Creators, freelancers, consultants, agency owners |
| 04 | [E-Commerce Drop](templates/04-ecommerce-drop.md) | Fashion brands, merch stores, limited-release e-commerce |
| 05 | [Local Business — Restaurant](templates/05-restaurant.md) | Restaurants, cafes, bars |
| 06 | [Real Estate Listing](templates/06-real-estate.md) | Realtors, developers, vacation rentals, hotels |
| 07 | [Automotive / Big Product](templates/07-automotive.md) | Vehicles, drones, bikes, machinery |
| 08 | [SaaS / App Launch](templates/08-saas-app.md) | Software, apps, AI tools, startups |
| 09 | [Agency / Studio](templates/09-agency-studio.md) | Agencies, design studios, production companies |
| 10 | [Fitness / Gym](templates/10-fitness-gym.md) | Gyms, coaches, martial-arts studios, sports brands |

Each template file contains the ready-to-paste prompt plus a "Make it yours" note for
adapting it to a real client.

## Pro tips

1. **Consistency beats quality.** A slightly softer clip where the product looks identical
   across shots reads more expensive than four beautiful but inconsistent clips. Always use
   the hero-image reference.
2. **Spend extra credits on the hero clip only** (2-3 takes). It's ~80% of the wow. Take the
   first acceptable result everywhere else.
3. **Ask Claude to compress the videos for web** — one sentence, typically cuts file size
   ~90% and keeps scroll buttery on any laptop.
4. **Going live is one more prompt:** "Push this to a GitHub repo and walk me through
   deploying it free on Cloudflare Pages, then connecting a custom domain."
5. **The sellable business is templates 05, 06, and 10** (restaurant, real estate, gym).
   Local businesses in most cities have never seen sites like this — build one as a sample
   and pitch $2,000+ deliverables.

## Attribution

Zubair Trabzada — AI Workshop, 2026 edition. YouTube: *Zubair Trabzada | AI Workshop*.
Stored here as an internal reference guide for future Space Age website builds.
