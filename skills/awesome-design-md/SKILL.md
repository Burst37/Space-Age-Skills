---
name: awesome-design-md
description: >-
  Library of 85 DESIGN.md design-system analyses (colors, typography, spacing,
  components, do/don't) of well-known product sites (Stripe, Linear, Vercel,
  Notion, Figma, Spotify, Tesla, Airbnb, Apple, SpaceX, Supabase, Ant Design
  and more). Use when the user wants a UI "in the style of" a brand, needs
  concrete design tokens to start a build, asks for a DESIGN.md, or wants to
  compare design systems. Pick 1-2 matching files, read them, apply as
  tokens. Inspired-by only: never reuse logos, trademarks, or copy.
source: https://github.com/VoltAgent/awesome-design-md (MIT, (c) 2026 VoltAgent); design-md/ant-design from ant-design/ant-design (MIT, (c) Ant UED)
version: 1.0.0
---
# Awesome DESIGN.md (vendored)

Each `design-md/<brand>/DESIGN.md` is (in 75 of 85 files) YAML front matter (`colors`, `typography`, `spacing`, `rounded`, `components`...) plus prose; the other 10 (kraken, lamborghini, lovable, mastercard, runwayml, sanity, spotify, starbucks, tesla, theverge) are prose-only with hex values inline on layout, elevation, responsive behaviour and guardrails. Upstream files are verbatim.

## Use
1. Match the request to a brand below; read only that file (they are long). Two max, to blend.
2. Map front-matter tokens to CSS variables / Tailwind theme; follow the prose for hierarchy and do/don't.
3. If the user's own brand exists, their DESIGN.md wins; use these only to fill gaps.
4. Pair with `taste-pro`, `design-review-pro`, `consistent-ui` for review and `extract-design-system` to make a DESIGN.md from a live site.

## Guardrails
Analyses are interpretations of public sites, not official brand guidelines. Take structure and token ideas; do not copy proprietary fonts, logos, imagery or wording. Fonts named (e.g. sohne-var) may be unlicensed: substitute an open font.

## Index
| Brand dir | Summary |
|---|---|
| `1win` | An analysis of 1win's design language — a near-black crypto casino and sportsbook built on Inter at heavy weights, where a vivid green actio |
| `airbnb` | A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries ev |
| `airtable` | A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signatu |
| `aljazeera` | An analysis of Al Jazeera's design language — a hard-news editorial system built on flat white paper and dense Roboto headline stacks, signe |
| `ant-design` | Enterprise-grade React UI design system from Ant Group, built around the values Natural, Certain, Meaningful, and Growing. |
| `apple` | A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, fram |
| `binance` | A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary |
| `bmw-m` | A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE.  |
| `bmw` | BMW's corporate site — distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On |
| `bugatti` | An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive pho |
| `cal` | A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The syst |
| `claude` | A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines,  |
| `clay` | A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTA |
| `clickhouse` | A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in conf |
| `cohere` | Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, sof |
| `coinbase` | An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is p |
| `composio` | A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-elec |
| `cursor` | An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7 |
| `dell-1996` | Dell.com's 1996 design language — a catalog-era enterprise web design built around a literal black page frame, vivid flat color-block "ribbo |
| `dji` | An analysis of DJI's design language — a product-photography showroom for drones and cameras, where full-bleed studio renders sit in square, |
| `elevenlabs` | A voice-AI brand whose marketing surfaces read like a quietly editorial print magazine. The base canvas is off-white (`#f5f5f5`) holding war |
| `expo` | A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white wi |
| `ferrari` | A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is **near-black** (`#181818`) holding pure w |
| `figma` | A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monoc |
| `framer` | A confident dark-canvas builder marketing site that treats the page like a working artboard — pure black surfaces, white display type set in |
| `hashicorp` | An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors — Terrafo |
| `hp` | HP's design language — a white-paper enterprise-consumer system anchored by HP Electric Blue (`#024ad8`) as the lone signal CTA, near-black  |
| `ibm` | An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident a |
| `intercom` | An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary ge |
| `jobright` | An analysis of Jobright's design language — an AI job-hunting platform built on an energetic spring-mint green against black and white, with |
| `kraken` | Kraken's website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The design operates on white backgr |
| `lamborghini` | Lamborghini's website is a cathedral of darkness — a digital stage where jet-black surfaces stretch infinitely and every element emerges fro |
| `linear.app` | A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray tex |
| `lovable` | Lovable's website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (`#f7f4ed`) that immediate |
| `mastercard` | Mastercard's experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (`# |
| `mercury` | An analysis of Mercury's design language — a fintech system that moves between a deep ink-violet night world on the homepage and a pale, nea |
| `meta` | Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising v |
| `minimax` | MiniMax presents itself as a premium AI infrastructure brand through a striking duality — bold black-pill CTAs and stark white canvas for ma |
| `mintlify` | Mintlify presents documentation infrastructure with a dual-mode aesthetic — atmospheric sky-gradient marketing heroes (cloud illustration ba |
| `miro` | Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice — anchored by its signature canary y |
| `mistral.ai` | Mistral AI brands itself with a singular signature — atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mo |
| `mongodb` | MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired  |
| `mydealz` | An analysis of mydealz's design language — a high-density German deals-community system built on a confident brand green, where a stacked wh |
| `nerdwallet` | An analysis of NerdWallet's design language — a personal-finance comparison platform built almost entirely from one deep green and a ladder  |
| `nike` | / |
| `nintendo-2001` | An analysis of Nintendo.com's 2001 design language — a brushed-periwinkle "console chrome" interface where every panel is a beveled metal pl |
| `notion` | Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice — anchored by a deep navy hero band ({ |
| `nvidia` | / |
| `ollama` | / |
| `opencode.ai` | / |
| `oracle` | An analysis of Oracle's design language — an enterprise system built on a warm neutral ladder rather than a colour palette. Six numbered gre |
| `oura` | An analysis of Oura's design language — a warm-paper wellness system that pairs a high-contrast Editorial serif with a quiet grotesque sans, |
| `pinterest` | / |
| `playstation` | / |
| `posthog` | / |
| `raycast` | / |
| `renault` | / |
| `replicate` | / |
| `resend` | / |
| `revolut` | / |
| `runwayml` | Runway's interface is a cinematic reel brought to life as a website — a dark, editorial, film-production-grade design where full-bleed photo |
| `sanity` | Sanity's website is a developer-content platform rendered as a nocturnal command center -- dark, precise, and deeply structured. The entire  |
| `sap` | An analysis of SAP's design language — an enterprise system that keeps almost everything on white and spends its structure on two greys and  |
| `sentry` | Sentri's design language — a developer-tools brand built on a deep purple-violet midnight canvas, electric lime accents, and a slightly subv |
| `shopify` | Shopifi's design language — a cinematic commerce platform that runs two parallel design tracks. The marketing-hero and product-narrative pag |
| `slack` | Slacc's design language — a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero gradients, blue inline lin |
| `spacex` | Spasex's design language — a mission-oriented aerospace brand built on pure black canvas, full-bleed photographic and video heroes of rocket |
| `spotify` | Spotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (`#121212`, `#181818`, `#1f1f1f`) wher |
| `starbucks` | Starbucks' design system is a **warm, confident retail flagship** wearing the green of their storefront apron across every surface. The canv |
| `stripe` | Stripi's design language — a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a recurring atmospheri |
| `supabase` | Supabaze's design language — an open-source database platform built on a clean white-and-near-black system with a single signature emerald-g |
| `superhuman` | Superhumon's design language — a fast-email productivity brand split between an editorial dark hero (deep indigo navy with violet-sky atmosp |
| `tesla` | Tesla's website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothi |
| `theverge` | The Verge's 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (`#131313`),  |
| `together.ai` | Together AI's design language — an AI infrastructure platform whose surface alternates between near-black hero bands (with a three-color ora |
| `uber` | Uber's design language — a transportation-and-delivery super-app brand whose web surface is a black-and-white duet, framed by a custom geome |
| `vercel` | Vercel's design language — a developer-platform brand whose surface is a stark black-and-ink duet on near-white canvas, broken at hero scale |
| `vodafone` | Vodafone's design language — a telecom super-brand whose web surface alternates between editorial photography hero bands with massive upperc |
| `voltagent` | Voltagent's design language — a developer-focused AI agent engineering platform whose surface is an unrelenting near-black canvas broken onl |
| `warp` | Warp's design language — an agentic terminal-and-development-environment brand whose surface is a warm near-charcoal canvas (a tint warmer t |
| `webflow` | Webflow's design language — a visual web development platform whose surface contrasts a deep near-black `#080808` primary against a generous |
| `wired` | Wired's design language — a flagship technology-magazine brand whose surface is a strict editorial duet of stark black wordmark on white can |
| `wise` | Wise's design language — a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64–1 |
| `x.ai` | xAI's design language — Elon Musk's frontier-AI company whose web surface is a strict near-black canvas broken only by white pill outlines,  |
| `zapier` | Zapier's design language — a workflow-automation platform whose surface combines warm-cream neutrals (`#fffefb` canvas, `#f8f4f0` soft cream |
