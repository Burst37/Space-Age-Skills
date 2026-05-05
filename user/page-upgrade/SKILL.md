---
name: page-upgrade
description: >
  Client existing page audit and upgrade workflow.
---

# PAGE UPGRADE SKILL
## Space Age AI Solutions — Existing Page Audit and Upgrade Service

## THE AUDIT UPGRADE PIPELINE
STEP 1 INTAKE → STEP 2 VISUAL AUDIT → STEP 3 BRAND EXTRACTION → STEP 4 UPGRADE STRATEGY → STEP 5 PRODUCTION BUILD

## STEP 1 — INTAKE AND DISCOVERY
1. What is the URL?
2. What platform is it built on? (Shopify / WordPress / Webflow / Squarespace / HTML / Wix)
3. What is NOT working about it right now?
4. What is the number 1 goal of the page?
5. Who is the target customer?
6. Do you have brand guidelines / logo / color codes?
7. What is the budget type? (Quick upgrade / full redesign / ongoing retainer)
8. Deadline?
9. Can you edit the existing platform yourself?
10. Are there pages performing well that we should NOT touch?

## STEP 2 — VISUAL AUDIT
Score the existing site on 8 axes (1-10 each):
- first_impression: Does it communicate value in 3 seconds?
- typography: Are fonts intentional, readable, and on-brand?
- color_system: Is there a clear palette?
- hierarchy: Do you know what to read first, second, third?
- mobile_experience: Does it work on phone?
- photography_quality: Are images sharp, consistent, and on-brand?
- whitespace_rhythm: Is there breathing room?
- conversion_clarity: Is the CTA obvious?
- total_score: /80

Score Interpretation:
60-80: Polish needed — animations, micro-interactions, typography refinement
40-59: Moderate upgrade — visual system rebuild while keeping structure
20-39: Major redesign — rebuild sections, not just style updates
0-19:  Full rebuild recommended — framework is broken

## STEP 3 — BRAND EXTRACTION
Run brand-extractor skill on the client live URL.
Pull: exact hex colors, font families and weights, spacing patterns, button styles, border radius, shadow styles, image treatment patterns.

## STEP 4 — UPGRADE STRATEGY
Impact vs Effort Matrix — Do HIGH IMPACT / LOW EFFORT first.

HIGH IMPACT / LOW EFFORT (Always do these first):
1. Typography swap — Replace system fonts with premium pair via Bunny Fonts. Time: 30 min. Impact: Instantly looks 3x more professional.
2. CSS variable injection — Add --color-primary, --color-accent, --color-bg to :root. Time: 1 hour.
3. Button upgrade — Border radius, font-weight, transition on hover, padding. Time: 30 min.
4. Hero headline rewrite — Clearer value prop, larger font size, better contrast. Time: 1 hour.
5. Section spacing — Add consistent padding-top/bottom to all sections. Time: 30 min.

## STEP 5 — PRODUCTION BUILD BY PLATFORM

SHOPIFY UPGRADE PATH:
1. Admin → Themes → Actions → Edit Code
2. Add Bunny Fonts link in theme.liquid head
3. Add GSAP CDN scripts before closing body tag
4. Add CSS variables to base.css or theme.css
5. Add data-animate attributes to section elements
6. Inject GSAP init script

WORDPRESS UPGRADE:
Add to header.php before closing head:
- Bunny Fonts link
- GSAP CDN scripts
- CSS variables style block

Add to footer.php before closing body:
- GSAP init script targeting data-animate elements

STANDALONE HTML UPGRADE:
Inject at top of head:
- Bunny Fonts
- GSAP CDN
- CSS variables
- Font override styles

Inject before closing body:
- GSAP registerPlugin and scroll animation init

WEBFLOW: Custom Code tab — Head Code and Footer Code
SQUARESPACE: Settings → Advanced → Code Injection

## UPGRADE PACKAGES

Package 1 — Quick Glow Up ($200-$400) — 2-4 hours
- Full visual audit scored on 8 axes
- Typography upgrade
- CSS variable system
- Button hover effects
- Scroll animations
- Mobile quick fixes

Package 2 — Section Rebuild ($400-$800 per section) — 4-8 hours
- Brand token extraction
- 1-3 sections rebuilt as cinematic modules
- Mobile-responsive, animation-ready

Package 3 — Full Homepage Overhaul ($1,500-$3,000) — 1-2 weeks
- Full audit + brand extraction
- Complete homepage rebuild
- New design system
- All cinematic effects
- Mobile + desktop QA

Package 4 — Ongoing Upgrade Retainer ($500-$1,500/month)
- 2-4 section upgrades per month
- New landing pages as needed
- Social media graphics
- Monthly audit report

## CROSS-SKILL CONNECTIONS
After brand extraction → brand-extractor skill
For Shopify stores → shopify-cinematic-builder skill
For full rebuilds → ui-ux-designer → google-stitch → cinematic-website-builder pipeline
For social content → social-media-designer skill
