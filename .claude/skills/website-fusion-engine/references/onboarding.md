# Onboarding (load only at intake)

Ask only what the tier needs. Convert answers → `docs/intake/project-manifest.json` (stub from `fusion.mjs init`). Any `UNDECIDED` critical field blocks the build.

## Tier → questions to ask

- **quick**: identity (name, domain, purpose), authorization, 1 source + role, brand (colors/fonts/logo), pages, mode.
- **standard**: + per-category KEEP/ADAPT/REPLACE/DROP table, asset sources, content origin, applications, target stack/host, acceptance.
- **flagship**: + full motion direction, multi-source roles, per-app keep/adapt/replace/drop, batch rules, deliverables list.

## Authorization (always)

1. Own / have permission? `owned | client-approved | licensed | inspiration-only`
2. Retain exact layout? motion? copy? images/video?
3. Remove all logos/names/trademarks?

`faithful-recreation` needs owned/client-approved/licensed. `inspiration-only` → principles only, no retained logos/copy/private data.

## Source block (repeat per source)

`url|file · label · role(s) [layout|motion|type|nav|gallery|content|forms|...] · priority [primary|secondary|optional] · exactness [exact|close|conceptual]`

## KEEP / ADAPT / REPLACE / DROP categories

page structure · header/nav · fullscreen menu · hero layout · hero motion · type system · palette · image composition · scroll behavior · scroll reveals · pinned sections · horizontal scroll · parallax · custom cursor · hover · page transitions · kinetic type · galleries · video · forms · booking · payments · CMS · SEO · analytics · mobile · a11y. Mark each. `UNDECIDED` = blocker.

## Brand

name shown · tagline · logo source · primary/secondary hex · forbidden colors · fonts · type direction (minimal|editorial|luxury|industrial|kinetic|futuristic|streetwear|corporate) · match reference proportions? · mood · "must NOT become" words.

## Assets

sources (chat upload|Drive|Dropbox|local|existing site|generate) · use existing before generating? · mandatory · forbidden · edits allowed? · generation allowed? · aspect ratios · hero media (image|video|canvas|webgl|none).

## Content

existing copy vs rewrite vs new · who supplies facts · pages · sections · CTAs · social · contact · legal · testimonials (user-supplied only).

## Motion (flagship)

closeness (frame-close|behavior-close|same-technique-new-timing|inspired) · intensity (subtle|standard|premium|flagship) · additions · removals · smooth scroll? · mobile motion (full|reduced|minimal|none) · max intro ms · max route-transition ms · forbidden motion.

## Applications (keep/adapt/replace/drop each)

CMS · forms · email · CRM · booking · payments · ecommerce · chat · analytics · pixels · maps · media host · auth · portal.

## Technical

stack · agent · host · CMS target · repo · browser support · perf target · a11y target · SEO target · environments · tests · deadline · cost cap · batch count.

## Acceptance

must match exactly · must look different · must behave different · instant-reject conditions · final approver · deliverables (code|repo|zip|preview|prod|forensic|motion-map|asset-ledger|design-system|QA|walkthrough).
