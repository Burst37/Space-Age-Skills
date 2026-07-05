---
name: cinematic-website-prompts
description: Ten copy-paste briefs for building award-winning-style, scroll-driven websites with an AI-generated hero video (Higgsfield MCP, Seedance 2.0) plus a Claude-built Next/React site around it. Covers luxury product, experience/journey, personal portfolio, e-commerce drop, restaurant, real estate, automotive, SaaS launch, agency, and gym/fitness sites. TRIGGER when the user wants a "cinematic website", an "award-winning style site", a scroll-driven/scroll-scrub site, or wants to spin up a client site for a restaurant, realtor, gym, product, or portfolio using AI video. Phrases: 'build me a cinematic website', 'award-winning style site', 'scroll-driven site', 'one-prompt website', 'AI video hero section'.
version: 1.0.0
source: Fable 5 x Higgsfield Website Prompt Pack (Zubair Trabzada, AI Workshop, 2026)
---

# Cinematic Website Prompts

Ten complete, copy-paste briefs that turn one sentence into a full scroll-driven website with an AI-generated cinematic hero video. Each brief specifies the video shots (Higgsfield MCP, Seedance 2.0 model), the site structure, the design direction, and an instruction to launch locally and verify before declaring done. Originally compiled as a free prompt pack by Zubair Trabzada (AI Workshop) — kept here as a reusable skill for future client/portfolio builds.

## Requirements

- Higgsfield MCP connected (`mcp__Higgsfield__generate_video`, `generate_image`) with Seedance 2.0 credits.
- No coding knowledge required from the user — Claude builds the site.

## How to use

1. **Paste the whole brief unedited the first time.** Run it once as-is before customizing anything.
2. **The hero-image trick is what makes it work.** Every brief generates ONE hero image first, then passes it as an image reference to every subsequent video clip. This is what keeps the product/person/place visually identical across all shots — never skip this step.
3. **Chain clips for "one continuous shot" journeys.** Seedance 2.0 takes a start image and an end image. Journey briefs (deep-sea descent, hypercar) use each clip's final frame as the next clip's start frame, so multiple clips scrub like one unbroken camera move.
4. **Control credit spend.** Default to `std` mode, 1080p, ~8s per clip, no audio — the sweet spot for iteration. Only go to 4K for a final showpiece render.
5. **Iterate like a director, not a developer.** After the first build, give feeling-based notes ("make the hero 20% slower", "the section feels flat, add one subtle cursor interaction", "swap the font, it looks generic") and let Claude translate intent into code.
6. **Generate 2–3 takes of the hero clip only.** The hero scrub is ~80% of the wow factor — spend extra credits there, take the first acceptable result everywhere else.
7. **Ask Claude to compress the videos for web** once the edit is locked — typically cuts file size ~90% and keeps scroll buttery on any laptop.
8. **Going live is one more prompt** — "push this to a GitHub repo and walk me through deploying it free on Cloudflare Pages/Vercel, then connecting a custom domain."

## The ten briefs

Each brief below is a complete, paste-ready prompt. `[bracketed]` fields are fill-ins.

### 1. Luxury product reveal (watches, jewelry, audio gear, sneakers)

> Build me an award-winning cinematic "3D scroll" website for AURUM & NOIR — a fictional Swiss luxury watch brand launching its tourbillon chronograph, the "Eclipse."
>
> VISUALS — generate with the Seedance 2.0 model on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip). First generate ONE hero image of the watch — brushed black titanium case, gold tourbillon visible through sapphire glass — and pass it as an image reference to every clip so the product is identical throughout:
> 1. HERO ORBIT — a slow, perfectly smooth 360° studio turntable of the watch floating in a black void, dramatic rim lighting, faint gold dust drifting.
> 2. MACRO FLY-THROUGH — extreme close-up glide across the dial: engraved indices, the tourbillon cage spinning, light rippling across brushed metal.
> 3. EXPLODED ASSEMBLY — the watch assembling itself from floating components — gears, springs, bezel, strap — converging into the finished piece.
>
> WEBSITE — scroll-scrub the hero orbit as a canvas frame sequence so scrolling rotates the watch. Lenis smooth scroll, text reveals pinned to scroll position. Sections: cinematic hero with the brand name tracking in → "Crafted in Darkness" story → macro details scrubbing clip 2 → exploded engineering view with spec callouts (42mm grade-5 titanium, 72h reserve, 217 components) → "Edition of 88 — $48,000" → private waitlist CTA. Off-black background, gold accent, high-contrast serif display + minimal sans. Copy tone: quiet, expensive, very few words. Launch on localhost and verify every scroll animation works before telling me it's done.

Make it yours: swap the watch for any hero product (headphones, fragrance bottle, sneaker). Keep the orbit + macro + exploded-assembly shot structure — it works for anything with parts.

### 2. Experience / journey (tourism, expeditions, museums)

> Build me an award-winning cinematic "3D scroll" website for ABYSSAL — a fictional deep-sea expedition company that takes 8 civilians per year to the ocean floor aboard its submersible, the EREBUS.
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8–10s per clip). First generate ONE hero image of the EREBUS — sleek deep-black hull, glowing cyan viewport ring, twin floodlights — and reference it in every clip. CRITICAL: generate clips in order and use each clip's FINAL frame as the START image of the next (Seedance start_image / end_image) so all five join into one seamless, unbroken descent:
> 1. THE SURFACE — aerial dawn over open ocean; the EREBUS slips beneath the waves, ending fully submerged in sunlit blue.
> 2. SUNLIT ZONE — descent through god rays and bubble columns, a whale silhouette gliding past; the blue deepens.
> 3. TWILIGHT ZONE — light dies to near-black, ghostly jellyfish drift, the floodlights flicker on.
> 4. MIDNIGHT ZONE — total darkness; bioluminescent creatures spark around the hull like a starfield.
> 5. THE FLOOR — floodlights sweep across hydrothermal vents; the EREBUS holds on a final hero frame.
>
> WEBSITE — concatenate the five clips and scroll-scrub the full descent as a canvas frame sequence: scrolling down IS diving down. Fixed HUD depth meter counting 0m → 3,800m with zone labels. Sections pinned per zone: hero ("How deep will you go?") → one striking fact per zone → EREBUS spec callouts → "8 seats. $250,000. Departing March 2027." → "Join the Manifest" CTA. Background color-grades deep navy → pure black with depth; bioluminescent cyan accent; thin technical sans with HUD micro-details. Launch on localhost and verify the scrub is seamless across all five clips before telling me it's done.

Make it yours: the same chained-descent structure works for a mountain ascent, a rocket launch, a cave tour, or a "journey through our factory" for any brand.

### 3. Personal portfolio (creators, freelancers, consultants, agency owners)

> Build me an award-winning cinematic "3D scroll" PERSONAL PORTFOLIO website for me — [YOUR NAME]. Study the style of the Awwwards Site of the Year 2025 (Lando Norris): huge bold typography, cinematic scroll-driven sequences, and a central 3D element that rotates as you scroll. My version's central element is ME.
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip). First upload my attached photo to Higgsfield and pass it as an identity reference on EVERY generation so my face is consistent. Keep my wardrobe identical throughout: [black t-shirt, dark overshirt]. Three clips:
> 1. HERO ORBIT — I stand confident, arms crossed, in a black-void studio with [emerald] rim lighting; the camera does one slow 360° orbit around me.
> 2. THE BUILDER — I sit at a dark desk surrounded by floating holographic screens showing my work; slow cinematic push-in.
> 3. THE CLOSER — I walk toward camera down a dark gallery lined with glowing screens, stopping in a hero pose.
>
> WEBSITE — scroll-scrub the hero orbit as a canvas frame sequence: "[YOUR NAME]" in massive display type tracks in letter-by-letter, subtitle "[what you do in one line]". Animated stats strip counting up on scroll: [your 3–5 best numbers — subscribers, clients, projects, revenue]. THREE PILLARS section over clip 2 revealing [your three main offers] one at a time. WORK section over clip 3 with cards for [your 3 best projects], each with a one-line pitch and hover motion. FINALE: "[your main CTA]" with two buttons, plus footer links to [your socials]. Ink-black background, [emerald] accent, cream typography, bold condensed display font, kinetic type, subtle grain, Lenis smooth scroll. Launch on localhost and verify the orbit scrub is buttery before telling me it's done.

Make it yours: everything in `[brackets]` is a fill-in. Requires a well-lit, front-facing photo attached first. Generate 2–3 takes of the hero orbit and keep the one where the likeness holds through the full rotation.

### 4. E-commerce drop (fashion, merch, limited releases)

> Build me an award-winning cinematic e-commerce website for ONYX SUPPLY — a fictional premium streetwear label releasing its "Midnight Drop": a heavyweight hoodie, cargo pants, and a chrome-accent puffer jacket.
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, no audio). First generate ONE lookbook image of a model wearing the full fit — matte black garments, chrome zipper accents, shot on a foggy rooftop at night — and reference it in every clip for garment consistency:
> 1. HERO — 16:9, the model walks slowly toward camera through rooftop fog, neon city glow behind, wind moving the fabric.
> 2. PRODUCT SPINS — three separate 1:1 clips: each garment on an invisible mannequin doing a clean 360° turntable on a concrete-gray studio background.
> 3. FABRIC MACRO — 16:9 extreme close-up traveling across stitching, zipper teeth, and embossed logo.
>
> WEBSITE — hero scroll-scrubs the model walk with "ONYX SUPPLY — MIDNIGHT DROP" in massive type and a live countdown timer to the drop. Product grid: three cards that autoplay their spin clips on hover, each with name, price ($180 / $210 / $340), size selector, and "Add to Cart" (non-functional demo checkout drawer is fine). Fabric-macro section with a "Built heavy. Cut clean." quality manifesto. Sticky cart icon, marquee strip of product names between sections, "Notify me" email capture for sold-out sizes. Design: concrete gray + matte black, one acid-green accent, brutalist condensed type. Launch on localhost and verify hover-to-play works on every product card before telling me it's done.

Make it yours: for a real store, replace the generated garments with photos of the actual products as image references — Seedance animates the real product, not an invented one.

### 5. Local business — restaurant (sellable client work)

> Build me an award-winning cinematic website for EMBER & OAK — a fictional wood-fire steakhouse in [CITY].
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip):
> 1. HERO — slow-motion macro of a ribeye searing over open flame, embers rising into darkness, cinematic amber light.
> 2. THE ROOM — a slow dolly through a moody dining room at golden hour: leather booths, candlelight, a bartender stirring a cocktail in the background.
> 3. THE CRAFT — overhead shot of a chef's hands plating a dish, steam curling up, dark slate table.
>
> WEBSITE — full-bleed hero scroll-scrubbing the fire clip with "EMBER & OAK" in an elegant serif tracking in and "Wood fire. Nothing else." beneath. Sections: story section over clip 2 with restrained copy ("Six dishes. One fire.") → menu section with two columns (Fire / Field), dish names and prices in refined typography → private dining section over clip 3 → hours + map + "Reserve a Table" CTA with a simple date/party-size form. Design: near-black background, warm cream text, ember-orange accent, film grain overlay, slow parallax on section images. Copy tone: sparse, confident, sensory. Mobile pass: collapse the menu into a single elegant column. Launch on localhost and verify the hero scrub and reservation form render correctly before telling me it's done.

Make it yours (or sell it): swap EMBER & OAK for a real local restaurant, feed Claude their actual menu, and use their food photos as image references — this exact site is a $2,000–$5,000 deliverable for a local business.

### 6. Real estate — single-property listing

> Build me an award-winning cinematic single-property website for THE MERIDIAN — a fictional $12.5M penthouse on the 60th floor in [CITY].
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8–10s per clip). Generate ONE hero image of the tower at dusk first and keep its architecture consistent across clips. Chain clips 2–4 using each clip's final frame as the next clip's start frame for one continuous tour:
> 1. THE APPROACH — aerial drone shot curving around the glass tower at dusk, city lights igniting below.
> 2. THE ARRIVAL — camera glides from the private elevator into a vast living room: floor-to-ceiling windows, Italian marble, a fireplace flickering on.
> 3. THE FLOW — continuous move through the chef's kitchen and primary suite toward glowing terrace doors.
> 4. THE TERRACE — out onto the wraparound terrace at night: infinity pool reflecting the skyline, timelapse clouds.
>
> WEBSITE — scroll-scrub the chained tour so scrolling walks the buyer through the home. Fixed elegant progress indicator naming each space as you pass it. Sections: hero ("Sixty floors above everything") → residence facts strip (4 bed · 5.5 bath · 7,200 sq ft · private elevator) → gallery section → amenities list with reveal animations → "$12,500,000" price section → "Request a Private Showing" form with agent card. Design: ink background, champagne-gold accent, thin elegant serif, generous whitespace. Launch on localhost and verify the tour scrub feels continuous before telling me it's done.

Make it yours: for real listings, use the property's actual photos as start frames — Seedance turns still listing photos into cinematic movement.

### 7. Automotive / big product (vehicles, drones, bikes, machinery)

> Build me an award-winning cinematic "3D scroll" website for VANTA — a fictional 1,200-horsepower electric hypercar. Model the experience on the Scout Motors Site-of-the-Year style: the product moving through real terrain as you scroll, not sitting in a studio.
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip). Generate ONE hero image of the car first — low, wide, matte obsidian body, thin light-bar face — and reference it everywhere. Chain the drive clips start-to-end frame so the journey is continuous:
> 1. REVEAL — dust settles in a white-sand desert at dawn to reveal the VANTA motionless; light-bar ignites.
> 2. THE RUN — low tracking shot as it launches across the desert flats, sand ribboning off the wheels.
> 3. THE CANYON — it threads a red-rock canyon at speed, camera whipping around a corner to follow.
> 4. NIGHT MODE — full dark; only its light signature and taillight trails carving through dunes under stars.
>
> WEBSITE — scroll-scrub the chained run so scrolling drives the car. Speed-style HUD in the corner that climbs 0 → 250 mph with scroll progress. Sections: hero with "VANTA" in ultrawide type → performance stats that count up (0–60 in 1.9s · 1,200 hp · 520 mi range) → design section with macro stills → night-mode section → configurator teaser with three paint options that recolor a hero still → "Reserve — $1,000 deposit" CTA. Design: black on black, electric-cyan accent, ultrawide condensed type, subtle motion blur transitions. Launch on localhost and verify the HUD syncs to scroll before telling me it's done.

Make it yours: works for anything that moves — e-bikes, boats, drones. Keep the reveal → run → environment → night structure.

### 8. SaaS / app product launch

> Build me an award-winning cinematic landing page for PULSE — a fictional AI analytics platform that predicts customer churn before it happens.
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip):
> 1. HERO — a dark void where thousands of glowing data particles swirl and assemble themselves into a clean, floating dashboard UI with a rising graph; the graph pulses like a heartbeat.
> 2. THE SIGNAL — macro camera glide across holographic charts and streaming numbers, one red anomaly lighting up and being caught.
> 3. THE CALM — the dashboard on a laptop in a bright minimal office, coffee steam drifting, everything under control.
>
> WEBSITE — scroll-scrub the particle-assembly hero so the dashboard literally builds itself as the visitor scrolls, with "See churn coming." in massive type and a "Start free" button. Sections: social-proof logo strip → three feature blocks pinned over clip 2, each revealing one line (Predict · Explain · Prevent) → animated metrics counters (94% prediction accuracy · 12,000 teams · $40M revenue saved) → product screenshot section with a browser-frame mockup and soft shadow → pricing table, three tiers with the middle tier highlighted → FAQ accordion → final CTA over clip 3. Design: near-black hero fading to white for the body, single violet accent, crisp geometric sans, glassmorphism cards. Launch on localhost and verify the hero assembly scrub and the pricing toggle work before telling me it's done.

Make it yours: swap PULSE's premise for the real tool and replace clip 3 with a real screen recording of the product — generated hero + real product shots is the credibility combo.

### 9. Agency / studio

> Build me an award-winning cinematic website for NOIR&CO — a fictional creative studio that designs brands "for companies that refuse to be ignored."
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip):
> 1. HERO — black ink blooming and morphing through water in extreme slow motion, occasionally flashing into gold.
> 2. THE WORK — a stylized showreel shot: oversized posters and screens with bold typography sliding past on gallery walls, camera dollying sideways.
> 3. THE PEOPLE — silhouettes of a small team working late in a moody studio, city bokeh through the window.
>
> WEBSITE — hero scroll-scrubs the ink bloom behind "NOIR&CO" set in enormous type that fills 80% of the viewport, with the manifesto line typing itself beneath. Sections: kinetic manifesto section where each scroll step slams one word on screen (LOUD. PRECISE. UNFORGETTABLE.) → selected-work grid of 4 fictional case studies with hover video reveals using clip 2 crops → services list in an editorial two-column layout → team section over clip 3 → oversized footer: "Got a brand worth fighting for?" with email and socials. Design: pure black and bone white, gold accent used exactly three times on the whole site, mix of a brutalist display face and a refined serif for body. Cursor becomes a small gold dot with a trailing ring. Launch on localhost and verify the kinetic text section and hover reveals work before telling me it's done.

Make it yours: this is the template for an agency's own site once selling AI websites — replace the fictional case studies with the sites actually built from this pack.

### 10. Fitness / local business — gym

> Build me an award-winning cinematic website for FORGE — a fictional strength gym in [CITY] with the motto "Earn it."
>
> VISUALS — Seedance 2.0 on the Higgsfield MCP (std mode, 1080p, 16:9, no audio, ~8s per clip):
> 1. HERO — slow motion: an athlete claps chalked hands in a dark gym, the chalk cloud blooming through a single overhead shaft of light.
> 2. THE IRON — macro tracking shot along a loaded barbell as hands grip it, knurling and chalk in sharp detail, plates settling.
> 3. THE GRIND — a runner sprinting on an outdoor track at dawn, breath visible, camera tracking low and fast alongside.
>
> WEBSITE — scroll-scrub the chalk-cloud hero with "FORGE" in massive industrial type punching in and "Earn it." beneath. Sections: philosophy section with one line per scroll step ("No mirrors. No machines that do the work for you.") → training programs grid (Strength / Conditioning / Team) with hover states → coaches section with card hover lift → results strip with counters (members, PRs this month, years open) → membership pricing, three tiers, middle highlighted, "First week free" CTA → schedule table + map + signup form. Design: charcoal background, bone-white type, one blood-red accent, heavy condensed display font, grain and vignette on all imagery. Mobile pass: programs grid becomes swipeable cards. Launch on localhost and verify the hero scrub and pricing section render correctly before telling me it's done.

Make it yours (or sell it): every element maps to a real local gym — swap the name, drop in their schedule and prices, use photos of their actual space as references.

## Pro tips

1. **Consistency beats quality.** A slightly softer clip where the product looks identical across shots feels more expensive than four beautiful clips of four slightly different products. Always use the hero-image reference.
2. **Generate 2–3 takes of the hero clip only.** It's ~80% of the wow — spend extra credits there, take the first acceptable result everywhere else.
3. **Ask Claude to compress the videos for web** once the edit is locked.
4. **Going live is one more prompt** — push to GitHub, deploy free on Cloudflare Pages/Vercel, connect a custom domain.
5. **The real business is prompts 5, 6, and 10** (restaurant, real estate, gym) — local businesses rarely have sites this polished. Build one as a sample, show it to five businesses, charge $2,000+.
