---
name: sa-open-design-workspace
description: OpenDesign router: 169 design skills, 115 design templates and 151 design systems (decks, landing pages, posters, social cards, motion frames, docs) composed with a DESIGN.md. Use when the user says open design, OpenDesign, od, use the Linear design system, make a deck/poster/one-pager/social card, or pick a design template.
---

# SA OpenDesign Workspace
OpenDesign (nexu-io) = local-first AI design workspace: brief → functional skill or design template + DESIGN.md → prototype files with preview. Exports HTML, PDF, PPTX, ZIP, Markdown.

## Setup
- Agent mode (no UI): `od mcp install <agent>` (claude|codex|cursor|copilot|...). macOS/WSL: `/usr/bin/od` may shadow it; use the desktop app's Settings → MCP server snippet.
- Docker: `git clone https://github.com/nexu-io/open-design && cd open-design/deploy && cp .env.example .env && docker compose up -d`.
- Desktop app: open-design.ai (Mac/Win). Linux: run from source (`pnpm i`, see QUICKSTART.md).
- OpenDesign Go/Cloud credits are paid; ask first. BYOK keys only with his OK.

## Workflow
1. Write or pick a DESIGN.md (design-md skill, or one of 151 systems in `design-systems/`).
2. Pick ONE functional skill from Appendix A (deck-*, poster-hero, card-*, frame-*, doc-*, web-*) or a template from `design-templates/`.
3. Prompt: "Use open-design to generate a landing page with the Linear design system". Local CLI runs write project files; plain-API runs return one `<artifact>`.
4. Review with design-review / impeccable-design-polish sections, export.
- Overlaps: his gsap-*, frontend-design, ui-ux-pro-max, figma-*, remotion, threejs skills exist separately; prefer his versions for those.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).
- Client websites: top-3 competitor teardown + SEO/AEO blueprint (seo-aeo-optimizer) first, then an approved moodboard, before any site code. AEO is equal to SEO.
- No liquid-glass or 3D goo type on law, SaaS, medical or home-healthcare sites.
- Video generation: never a Grok video model (grok-imagine-video, "Grok Video"). Use Seedance 2.5/2.0 in Dreamina, Kling 4.0 or MiniMax H3. If the upstream text names Grok video, swap in one of those.

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| 8-bit-orbit-video-template | Hyperframes-based video template for retro pixel deck motion design. Use when users want a high-fidelity, multi-scene HTML-to-video composition with advanced transitions, interactive preview controls, and ready-to-ren... | `skills/8-bit-orbit-video-template/SKILL.md` |
| ad-creative | Generate and iterate ad creative including headlines, descriptions, and primary text. Useful for paid social and search ad iteration. | `skills/ad-creative/SKILL.md` |
| after-hours-editorial-template | Luxury dark-editorial HyperFrames template for three-page cinematic storyboards, inspired by haute couture title cards and magazine chapter spreads. Use when the user asks for premium fashion-style motion pages, moody... | `skills/after-hours-editorial-template/SKILL.md` |
| agent-browser | Browser automation CLI for AI agents. Use when the user needs to inspect, test, or automate browser behavior: navigating pages, filling forms, clicking buttons, taking screenshots, extracting page data, reading select... | `skills/agent-browser/SKILL.md` |
| ai-music-album | Full-lifecycle AI music album production — concept, lyric drafting, track sequencing, and export. Useful for indie album experiments and brand soundtracks. | `skills/ai-music-album/SKILL.md` |
| algorithmic-art | Create generative art using p5.js with seeded randomness so every render is reproducible. Useful for procedural posters, motion-style stills, and artistic frame studies. | `skills/algorithmic-art/SKILL.md` |
| animate | Implement purposeful interface animations: easing, springs, interruption, exits, and reduced motion. Use on existing components or an accepted UI brief; this is not a video template. | `skills/animate/SKILL.md` |
| apple-hig | Apple Human Interface Guidelines as 14 agent skills covering platforms, foundations, components, patterns, inputs, and technologies for iOS, macOS, visionOS, watchOS, and tvOS. | `skills/apple-hig/SKILL.md` |
| article-magazine | Huashu / huashu-md-html-inspired magazine article layout for turning Markdown or notes into a polished long-form HTML essay. | `skills/article-magazine/SKILL.md` |
| artifacts-builder | Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). | `skills/artifacts-builder/SKILL.md` |
| brainstorming | Transform rough ideas into fully-formed designs through structured questioning and alternative exploration. Useful early in concept work. | `skills/brainstorming/SKILL.md` |
| brand-extract | Extract a complete Brand Kit from a live website by driving the in-app browser. Use when a brand-extraction project opens with a site in the Browser tab, or when the user asks to "extract a brand", "pull the brand fro... | `skills/brand-extract/SKILL.md` |
| brand-guidelines | Apply Anthropic's official brand colors and typography to artifacts for consistent visual identity and professional design standards. A reference for shaping your own. | `skills/brand-guidelines/SKILL.md` |
| brandkit | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. Trained for minimalist, cinematic, editorial, dark-tech, luxury, cu... | `skills/brandkit/SKILL.md` |
| industrial-brutalist-ui | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolio... | `skills/brutalist-skill/SKILL.md` |
| canvas-design | Create beautiful visual art in PNG and PDF documents using design philosophy and aesthetic principles for posters, illustrations, and static pieces. | `skills/canvas-design/SKILL.md` |
| card-twitter | Twitter quote or data card designed to pair with a post. | `skills/card-twitter/SKILL.md` |
| card-xiaohongshu | Xiaohongshu-style knowledge cards, arranged as a swipeable multi-card carousel. | `skills/card-xiaohongshu/SKILL.md` |
| chat-motion-overlay | Generate configurable chat motion overlays from a transcript or screenshot, including plain bubble scenes, app-style chat containers, optional device frames, preset or uploaded avatars, nickname display rules, and tra... | `skills/chat-motion-overlay/SKILL.md` |
| color-expert | Color science expert skill with 286K words of reference material covering OKLCH/OKLAB, palette generation, accessibility/contrast, color naming, pigment mixing, and historical color theory. | `skills/color-expert/SKILL.md` |
| competitive-ads-extractor | Extract and analyze competitors' ads from ad libraries to understand messaging and creative approaches that resonate. | `skills/competitive-ads-extractor/SKILL.md` |
| copywriting | Write and rewrite marketing copy for landing pages, homepages, and ads. Useful as a copy chief partner during launches. | `skills/copywriting/SKILL.md` |
| creative-director | AI creative director with recursive self-assessment: 20+ methodologies (SIT, TRIZ, Bisociation, SCAMPER, Synectics), 3-axis evaluation calibrated against Cannes/D&AD/HumanKind, 5-phase process from brief to presentation. | `skills/creative-director/SKILL.md` |
| d3-visualization | Teaches the agent to produce D3 charts and interactive data visualizations. A comprehensive D3.js skill with examples across chart types and techniques giving the agent expert-level knowledge to generate complex, inte... | `skills/d3-visualization/SKILL.md` |
| data-report | Turns CSV, Excel, or JSON data into a polished visual report page. | `skills/data-report/SKILL.md` |
| deck-guizang-editorial | Editorial magazine meets e-ink: 10 layouts and 5 palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune). | `skills/deck-guizang-editorial/SKILL.md` |
| deck-open-slide-canvas | Locked 1920x1080 canvas deck with React component-level free composition, not bound to a fixed template. | `skills/deck-open-slide-canvas/SKILL.md` |
| deck-swiss-international | 16-column grid, one saturated accent, and 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange). | `skills/deck-swiss-international/SKILL.md` |
| design-brief | Parse a structured design brief written in I-Lang protocol format into a concrete design spec. Eliminates ambiguity from vague requests like "make it professional" by requiring explicit dimensions: palette, typography... | `skills/design-brief/SKILL.md` |
| design-consultation | Build a complete design system from scratch with creative risks and realistic product mockups. Useful for kickoff workshops and brand-from-zero work. | `skills/design-consultation/SKILL.md` |
| design-md | Create and manage DESIGN.md files. Useful for capturing design direction, tokens, and visual rules in a single source of truth. | `skills/design-md/SKILL.md` |
| design-review | Designer Who Codes: visual audit then fixes with atomic commits and before/after screenshots. Useful for tightening shipped UI before launch. | `skills/design-review/SKILL.md` |
| digits-fintech-swiss-template | Swiss-grid fintech deck template in black / warm paper / neon-lime contrast. Use when users ask for premium data-story slides with strict modular layout, bold numeric cards, restrained motion, and keyboard/click navig... | `skills/digits-fintech-swiss-template/SKILL.md` |
| doc-kami-parchment | Warm parchment canvas (#f5f4ed), monochrome ink-blue accent (#1B365D), one serif family, and editorial-grade typography. | `skills/doc-kami-parchment/SKILL.md` |
| doc | Read, create, and edit .docx documents with formatting and layout fidelity via OpenAI's document skill. | `skills/doc/SKILL.md` |
| docx | Create, edit, and analyze Word documents with tracked changes, comments, and formatting. Useful for design briefs, copy docs, and review-ready deliverables. | `skills/docx/SKILL.md` |
| domain-name-brainstormer | Generate creative domain name ideas and check availability across multiple TLDs including .com, .io, .dev, and .ai. | `skills/domain-name-brainstormer/SKILL.md` |
| ecommerce-image-workflow | Reference-product ecommerce image workflow for generating a compact set of product-faithful main, feature, and lifestyle images from real product reference photos. V1 requires uploaded product imagery and intentionall... | `skills/ecommerce-image-workflow/SKILL.md` |
| editorial-burgundy-principles-template | Editorial studio deck template in burgundy / blush / muted-gold palette. Use when users ask for premium manifesto or culture slides with pill tags, large typographic statements, principle cards, and guided keyboard/cl... | `skills/editorial-burgundy-principles-template/SKILL.md` |
| emil-design-eng | This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great. | `skills/emil-design-eng/SKILL.md` |
| emilkowalski-motion | Motion-design follow-up skill inspired by Emil Kowalski's animation guidance. Use after an interface exists to add tasteful micro-interactions, state transitions, and page motion with product-grade restraint. | `skills/emilkowalski-motion/SKILL.md` |
| enhance-prompt | Improve prompts with design specs and UI/UX vocabulary. Useful for design-to-code workflows and clarifying requests for visual output. | `skills/enhance-prompt/SKILL.md` |
| export-download-debugging | Diagnose and fix browser, preview, or Electron export/download failures, especially image export issues involving Save As, Blob/Data URLs, the File System Access API, createWritable failures, and 0 KB files. | `skills/export-download-debugging/SKILL.md` |
| faq-page | A Frequently Asked Questions (FAQ) page with collapsible accordion sections, search functionality, and category filtering. Use when the brief asks for "FAQ", "help center", "questions", or "support page". | `skills/faq-page/SKILL.md` |
| field-notes-editorial-template | Editorial "Field Notes" report template with soft paper background, serif hero typography, rounded pastel insight cards, and a retention chart panel. Use when users ask for a premium magazine-style business report, bo... | `skills/field-notes-editorial-template/SKILL.md` |
| flutter-animating-apps | Implement animated effects, transitions, and motion in Flutter apps. Useful for native iOS/Android motion design. | `skills/flutter-animating-apps/SKILL.md` |
| frame-data-chart-nyt | NYT-newsroom typography, staggered reveal animation, and editorial-grade charts (line, bar, or range band). | `skills/frame-data-chart-nyt/SKILL.md` |
| frame-flowchart-sticky | SVG curve connectors, sticky-note nodes, and cursor interaction with a whiteboard-brainstorm feel. | `skills/frame-flowchart-sticky/SKILL.md` |
| frame-glitch-title | Digital glitch, chromatic offset, and data-corruption title frame for video transitions or cyberpunk heroes. | `skills/frame-glitch-title/SKILL.md` |
| frame-light-leak-cinema | Film light leaks, grain, 16:9 letterbox, and large serif type for cinematic openings or chapter cards. | `skills/frame-light-leak-cinema/SKILL.md` |
| frame-liquid-bg-hero | WebGL-style fluid displacement background with a quote overlay, suited to video intros, landing heroes, or posters. | `skills/frame-liquid-bg-hero/SKILL.md` |
| frame-logo-outro | Segmented logo assembly, glow bloom, and tagline reveal for video outros or brand closing frames. | `skills/frame-logo-outro/SKILL.md` |
| frame-macos-notification | Realistic macOS notification banner with app icon, title, and body, suited to video overlays or product teasers. | `skills/frame-macos-notification/SKILL.md` |
| frontend-design | Create distinctive, production-grade frontend interfaces with strong visual direction, polished typography, considered layout, and working HTML/CSS/JS or framework code. Use for websites, landing pages, dashboards, Re... | `skills/frontend-design/SKILL.md` |
| frontend-dev | Full-stack frontend with cinematic animations, AI-generated media via MiniMax API, and generative art. Useful for hero pages and showcase sites. | `skills/frontend-dev/SKILL.md` |
| frontend-skill | Create visually strong landing pages, websites, and app UIs with restrained composition. OpenAI's production frontend playbook. | `skills/frontend-skill/SKILL.md` |
| frontend-slides | Generate animation-rich HTML presentations with visual style previews. Useful for online keynotes, embedded talks, and interactive briefs. | `skills/frontend-slides/SKILL.md` |
| full-page-screenshot | Capture full-page screenshots of web pages via Chrome DevTools Protocol with zero dependencies. Useful for portfolios, case studies, and audit reports. | `skills/full-page-screenshot/SKILL.md` |
| gif-sticker-maker | Convert photos into animated GIF stickers in Funko Pop / Pop Mart style via the MiniMax API. Useful for personalized chat stickers and avatar packs. | `skills/gif-sticker-maker/SKILL.md` |
| gpt-taste | Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP S... | `skills/gpt-tasteskill/SKILL.md` |
| hand-drawn-diagrams | Generate hand-drawn Excalidraw diagrams from a prompt — animated SVG, hosted edit link, and PNG export. Works with Claude Code, Codex, Gemini CLI, and any agent supporting standard skill paths. | `skills/hand-drawn-diagrams/SKILL.md` |
| hatch-pet | Create, repair, validate, preview, and package Codex-compatible animated pet spritesheets from character art, screenshots, generated images, or visual references. Use when a user wants to hatch a Codex pet, create a c... | `skills/hatch-pet/SKILL.md` |
| html-ppt-retro-quarterly-review | Retro Quarterly Review presentation template in a bold blue + orange editorial language. Use when users ask for a high-impact quarterly review / roadmap deck with heavyweight slab headlines, clean cream paper sections... | `skills/html-ppt-retro-quarterly-review/SKILL.md` |
| huashu-art-motion | 辅助艺术动画与解说任务：35 种艺术风格配方、9 种解说语法、分镜与确定性 Canvas 绘制工具。按宿主时间轴实现，素材与导出使用宿主能力。 | `skills/huashu-art-motion/SKILL.md` |
| image-enhancer | Improve image and screenshot quality by enhancing resolution, sharpness, and clarity for professional presentations and documentation. | `skills/image-enhancer/SKILL.md` |
| image-to-code | Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. I... | `skills/image-to-code-skill/SKILL.md` |
| imagegen-frontend-mobile | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text... | `skills/imagegen-frontend-mobile/SKILL.md` |
| imagegen-frontend-web | Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections ... | `skills/imagegen-frontend-web/SKILL.md` |
| imagegen | Generate and edit images using OpenAI's Image API for project assets — UI mockups, icons, illustrations, social cards, and visual references. | `skills/imagegen/SKILL.md` |
| imagen | Generate images using Google Gemini's image generation API for UI mockups, icons, illustrations, and visual assets. | `skills/imagen/SKILL.md` |
| impeccable-design-polish | Follow-up design polish skill inspired by Impeccable. Use after a web or HTML artifact exists to audit, critique, polish, animate, harden, and prepare the page for a live/share pass. | `skills/impeccable-design-polish/SKILL.md` |
| library-curator | Search the OD Library (the global asset registry) and apply matching assets into the current project mid-task. Use when the user asks to reuse an image they captured/uploaded earlier, "pull a logo/screenshot from my l... | `skills/library-curator/SKILL.md` |
| login-flow | Mobile login and authentication flow screens | `skills/login-flow/SKILL.md` |
| marketing-psychology | Apply psychological principles and behavioral science to copy and design. Useful for tightening hooks, framing, and pricing presentation. | `skills/marketing-psychology/SKILL.md` |
| minimalist-ui | Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. | `skills/minimalist-skill/SKILL.md` |
| minimax-docx | Professional DOCX document creation and editing using OpenXML SDK. Useful for branded reports, polished proposals, and template-based authoring. | `skills/minimax-docx/SKILL.md` |
| minimax-pdf | Generate, fill, and reformat PDFs with a token-based design system and 15 cover styles. Useful for branded PDFs, e-guides, and reports. | `skills/minimax-pdf/SKILL.md` |
| mockup-device-3d | Static iPhone and MacBook 3D-style showcase with real HTML embedded on screens, glass-lens refraction, and 360-degree turntable composition. | `skills/mockup-device-3d/SKILL.md` |
| motion-design | Apply motion craft to an active task: refine a brief, beat map, visual continuity, typography, pacing, and timeline implementation. Use when planning or improving motion graphics; the host task owns artifact creation,... | `skills/motion-design/SKILL.md` |
| motion-lab | 为当前网页或组件查找、选型和改造动效。包含 160 个案例的 HTML/CSS/JS、参数与中英文索引，覆盖基础、文字、交互和高级动效。 | `skills/motion-lab/SKILL.md` |
| nanobanana-ppt | AI-powered PPT generation with document analysis and styled images via the NanoBanana stack. Combines image generation with structured deck output. | `skills/nanobanana-ppt/SKILL.md` |
| od-next-media-inputs | Prepare required media inputs within an existing OD Next plan. Reuse capability evidence, acquire and measure assets efficiently, and resolve asynchronous jobs without removing required content or weakening quality st... | `skills/od-next-media-inputs/SKILL.md` |
| oil-motion | 处理视频和序列帧，编译滚动、指针、拖动与状态驱动的网页动效；内含本地媒体处理脚本和运行时。新素材生成使用宿主工具。 | `skills/oil-motion/SKILL.md` |
| full-output-enforcement | Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output. | `skills/output-skill/SKILL.md` |
| paywall-upgrade-cro | Design and optimize upgrade screens, paywalls, and upsell modals. Useful for SaaS conversion design and pricing-page experiments. | `skills/paywall-upgrade-cro/SKILL.md` |
| pdf | Extract text, create PDFs, and handle forms. Useful for press releases, branded one-pagers, and printable design deliverables. | `skills/pdf/SKILL.md` |
| pixelbin-media | Generate and edit images and videos with an 85+ API portfolio and build visually appealing website pages via Pixelbin. | `skills/pixelbin-media/SKILL.md` |
| plan-design-review | Senior Designer review: rates each design dimension 0-10, explains what a 10 looks like, and flags AI Slop signals. Useful as a gate before merging UI work. | `skills/plan-design-review/SKILL.md` |
| platform-design | 300+ design rules from Apple HIG, Material Design 3, and WCAG 2.2 for cross-platform apps. Useful when shipping a single design across iOS, Android, and the web. | `skills/platform-design/SKILL.md` |
| poster-hero | Vertical poster or Moments-style share image with strong visual impact. | `skills/poster-hero/SKILL.md` |
| ppt-keynote | Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation. | `skills/ppt-keynote/SKILL.md` |
| pptx-generator | Create and edit PowerPoint presentations from scratch with PptxGenJS — MiniMax's production-tested deck pipeline. | `skills/pptx-generator/SKILL.md` |
| pptx-html-fidelity-audit | Audit a python-pptx export against its source HTML deck, identify layout/content drift (footer overflow, cropped content, missing italic/em, lost styling, off-rhythm spacing), and re-export with strict footer-rail + c... | `skills/pptx-html-fidelity-audit/SKILL.md` |
| pptx | Read, generate, and adjust PowerPoint slides, layouts, and templates. Useful for executive decks, training material, and product reviews. | `skills/pptx/SKILL.md` |
| pr-feedback-quality-gate | Safely track pull request feedback, resolve review comments or merge conflicts, validate fixes, and use a read-only cross-review before committing or pushing follow-up changes. | `skills/pr-feedback-quality-gate/SKILL.md` |
| redesign-existing-projects | Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vani... | `skills/redesign-skill/SKILL.md` |
| reference-design-contract | Turn vague taste, screenshots, URLs, product notes, or "make it feel like this" references into a grounded DESIGN.md plus an implementation handoff. Use it before prototypes, decks, redesigns, or image remix work when... | `skills/reference-design-contract/SKILL.md` |
| release-notes-one-pager | Release notes one-page HTML with highlights, Added, Fixed, Breaking changes, Known issues, and Upgrade note. Writes explicit "None" style sections whenever the user does not provide details. | `skills/release-notes-one-pager/SKILL.md` |
| remotion | Programmatic video creation with React. Useful for branded explainers, social cuts, dashboards-to-video, and reproducible motion graphics. | `skills/remotion/SKILL.md` |
| replicate | Discover, compare, and run AI models using Replicate's API. Strong fit for image, audio, and video generation pipelines that swap models frequently. | `skills/replicate/SKILL.md` |
| research-decision-room | Turn messy user research notes, interviews, support tickets, surveys, and product context into an evidence-backed decision room: a single HTML artifact with an evidence ledger, theme map, confidence heatmap, opportuni... | `skills/research-decision-room/SKILL.md` |
| resume-modern | Modern minimal resume, single A4 page, ready for print or PDF export. | `skills/resume-modern/SKILL.md` |
| review-animations | Reviews animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy. Default to flagging; approval is earned. | `skills/review-animations/SKILL.md` |
| screenshot | Capture desktop, app windows, or pixel regions across OS platforms. Useful for marketing screenshots, design reviews, and bug reports. | `skills/screenshot/SKILL.md` |
| screenshots-marketing | Generate marketing screenshots with Playwright. Useful for landing-page hero shots, App Store screenshots, and changelog visuals. | `skills/screenshots-marketing/SKILL.md` |
| shadcn-ui | Build UI components with shadcn/ui. Pairs with the Stitch design loop to ship structured, accessible components quickly. | `skills/shadcn-ui/SKILL.md` |
| shader-dev | GLSL shader techniques for ray marching, fluid simulation, particle systems, and procedural generation. Useful for hero visuals and motion stills. | `skills/shader-dev/SKILL.md` |
| slack-gif-creator | Create animated GIFs optimized for Slack with validators for size constraints and composable animation primitives. | `skills/slack-gif-creator/SKILL.md` |
| slides | Create and edit .pptx presentation decks with PptxGenJS. Useful for sales decks, kickoff briefs, and design-system showcases. | `skills/slides/SKILL.md` |
| social-reddit-card | Realistic Reddit post card with vote rail and comment count, suited to video overlays or story sharing. | `skills/social-reddit-card/SKILL.md` |
| social-spotify-card | Spotify Now Playing-style card with album art, progress bar, and playback controls, suited to video overlays or personal homepages. | `skills/social-spotify-card/SKILL.md` |
| social-x-post-card | Realistic X post card with engagement metrics (likes, reposts, views), suited to video overlays or shareable image cards. | `skills/social-x-post-card/SKILL.md` |
| high-end-visual-design | Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look ... | `skills/soft-skill/SKILL.md` |
| speech | Generate spoken audio from text using OpenAI's API with built-in voices. Useful for narrated explainers, lecture audio, and quick voiceover tracks. | `skills/speech/SKILL.md` |
| stitch-loop | Iterative design-to-code feedback loop. Critique → adjust → ship cycle for tightening visual fidelity between brief and built UI. | `skills/stitch-loop/SKILL.md` |
| stitch-design-taste | Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motio... | `skills/stitch-skill/SKILL.md` |
| swiftui-design | SwiftUI 前端设计 skill — anti AI-slop rules, design direction advisor, brand asset protocol, and five-dimension review. Works with Claude Code, Cursor, Codex, and OpenCode. | `skills/swiftui-design/SKILL.md` |
| swiss-creative-mode-template | Swiss-inspired creative-mode presentation template skill with bold editorial typography, high-contrast geometric cards, interactive slide navigation, theme switching, hotspot overlays, and palette choreography in a si... | `skills/swiss-creative-mode-template/SKILL.md` |
| swiss-user-research-video-template | Swiss-style user-research narrative template in warm-paper editorial aesthetics. Use when users ask for a premium research deck or story-first live artifact with minimalist typography, high-clarity layout, subtle moti... | `skills/swiss-user-research-video-template/SKILL.md` |
| design-taste-frontend-v1 | The original v1 taste-skill, preserved for projects depending on its exact behavior. The current default is `design-taste-frontend` (v2 experimental), which is a substantial rewrite. Use this v1 install name only if y... | `skills/taste-skill-v1/SKILL.md` |
| design-taste-frontend | Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable... | `skills/taste-skill/SKILL.md` |
| theme-factory | Apply professional font and color themes to artifacts including slides, docs, reports, and HTML landing pages. Ships 10 pre-set themes. | `skills/theme-factory/SKILL.md` |
| threejs | Three.js skills for creating 3D elements and interactive experiences in the browser — scenes, materials, controls, and post-processing. | `skills/threejs/SKILL.md` |
| ui-animation | Implement, review, and measure UI motion. Reconstruct easing, springs and gestures from a recording using bundled frame extraction, tracking and curve-fitting tools when available. | `skills/ui-animation/SKILL.md` |
| ui-skills | Opinionated, evolving constraints to guide agents when building interfaces. Useful for keeping output coherent across many small UI pieces. | `skills/ui-skills/SKILL.md` |
| ui-ux-pro-max | Catalog-only UI/UX Pro Max entry. The full upstream templates, data, and search workflow are not bundled in OpenDesign. | `skills/ui-ux-pro-max/SKILL.md` |
| vfx-text-cursor | Cursor light trail, chromatic rays, and directional flares for word-by-word quote reveals in video intros. | `skills/vfx-text-cursor/SKILL.md` |
| video-downloader | Download videos from YouTube and other platforms for offline viewing, editing, or archival with support for various formats and quality options. | `skills/video-downloader/SKILL.md` |
| video-hyperframes | Hyperframes / Remotion-compatible continuous frame animation with autoplay support. | `skills/video-hyperframes/SKILL.md` |
| web-artifacts-builder | Build complex claude.ai HTML artifacts with React and Tailwind. Anthropic's reference workflow for shipping rich, embeddable artifacts. | `skills/web-artifacts-builder/SKILL.md` |
| web-clone | 网站复刻 / 克隆方法论。USE WHEN 用户说 复刻网站、克隆网站、clone website、抄个站、仿站、 照着这个站做一个、reproduce site、还原某个网页效果、把这个站搬下来改成我的、 复刻某个交互/WebGL/Canvas/Three.js 效果。提供「先拿真源码 → 判路径 → 逆向拆解 → 搭工程 → 替换内容」的可移植决策树，覆盖静态站 / React-Vue-Next 内容站 / WebGL-Can... | `skills/web-clone/SKILL.md` |
| web-design-guidelines | Review UI code for Web Interface Guidelines compliance by the Vercel engineering team. Covers layout, typography, color, motion, and accessibility for product UI. | `skills/web-design-guidelines/SKILL.md` |
| weread-year-in-review-video-template | WeRead-inspired HyperFrames video template for vertical annual reading reports, personal reading dashboards, book-note recaps, and shareable year-in-review stories. Use when users want a 9:16 HTML-to-MP4 reading repor... | `skills/weread-year-in-review-video-template/SKILL.md` |
| wpds | WordPress Design System. Apply WordPress's official design tokens, typography, and component patterns to themes and sites. | `skills/wpds/SKILL.md` |
| writing-guidelines | Review docs/prose for Writing Guidelines compliance. Use when asked to "review my docs", "check writing style", "audit prose", "review docs voice and tone", or "check this page against the writing handbook". | `skills/writing-guidelines/SKILL.md` |
| youtube-clipper | YouTube clip generation and editing with automated workflows — pull source video, slice highlights, add captions, and export. | `skills/youtube-clipper/SKILL.md` |

## Appendix B — Workspace contract

### `skills/README.md`
#### Skills

This directory contains **functional skills**: capabilities the agent invokes to do work on user input, such as briefs, audits, utilities, and asset packagers. Each folder has a `SKILL.md` and may include `assets/` or `references/`.

Rendering shapes for prototypes, decks, documents, images, video, and audio belong in [`design-templates/`](../design-templates/), not here. The classification rule and migration history live in [`specs/current/skills-and-design-templates.md`](../specs/current/skills-and-design-templates.md).

##### Adding a skill

Read [`docs/skills-protocol.md`](../docs/skills-protocol.md) for frontmatter, discovery, precedence, and mode semantics. Copy the closest functional skill, keep the folder self-contained, and use an explicit `od.mode` appropriate for work performed on user input.

For a rendering template, follow [`docs/skills-contributing.md`](../docs/skills-contributing.md) and [`design-templates/AGENTS.md`](../design-templates/AGENTS.md) instead.

##### License

Skills in this directory are Apache-2.0 unless their own `LICENSE` says otherwise. [`web-clone/`](web-clone/) is adapted from [Jane-xiaoer/claude-skill-web-clone](https://github.com/Jane-xiaoer/claude-skill-web-clone). The MIT-licensed `guizang-ppt` rendering template lives under [`design-templates/guizang-ppt/`](../design-templates/guizang-ppt/).

### `skills/AGENTS.md`
#### skills

This directory holds **functional skills** — capabilities the agent
invokes mid-task to do work on user input. Each skill is a folder with a
`SKILL.md` (frontmatter + body) and any side files (`assets/`,
`references/`, scripts, …) the workflow needs.

If the entry primarily *renders* a design artifact (deck, prototype,
image/video/audio template) it belongs under `../design-templates/`
instead. See `specs/current/skills-and-design-templates.md` for the
full split.

##### Daemon plumbing

- Listed under `/api/skills` (functional only). User-imported skills
  shadow built-in entries with the same frontmatter `name`.
- Asset routes (`/api/skills/:id/example`, `/api/skills/:id/assets/*`)
  span both functional skills and design templates so existing
  `srcdoc`-rewritten URLs keep resolving after the split.
- Integrations → Skills surfaces this directory only. Renderable templates are
  read from the design-templates registry by the New project "Start from" rails;
  the redesigned home no longer has a top-level Templates tab.

##### Adding a skill

1. Create `skills/<my-skill>/SKILL.md` with `name`, `description`,
   `triggers`, and `od.mode: utility` (or `design-system`) frontmatter.
2. Drop any side files alongside; reference them from the body using
   the relative-from-skill-root paths the daemon advertises in the
   skill preamble.
3. The daemon's lazy scanner picks the entry up on the next
   `/api/skills` request — no rebuild required during local dev.

##### Curated design / creative catalogue

This directory also ships a curated catalogue of design and creative
skills hand-picked from `VoltAgent/awesome-agent-skills` and
`ComposioHQ/awesome-claude-skills`. Each entry is a lightweight stub —
frontmatter + a short body that points at the upstream repo — so the
Integrations → Skills surfaces a rich, filterable list out of the box
without vendoring every upstream workflow.

- `od.category` on these stubs powers the new category filter row in
  Integrations → Skills (e.g. `image-generation`, `video-generation`,
  `audio-music`, `slides`, `documents`, `design-systems`, `figma`,
  `animation-motion`, `3d-shaders`, `diagrams`, `creative-direction`,
  `marketing-creative`, `screenshots`, `web-artifacts`).
- The seed script lives at `scripts/seed-curated-design-skills.ts` and
  is **idempotent**: running it again only creates folders that don't
  already exist, so a hand-edited stub is never overwritten. Delete the
  folder under `skills/` and re-run the script to refresh an entry.
- Stubs intentionally do not vendor upstream assets. To run an upstream
  workflow with its original scripts and references, copy the upstream
  folder into your active agent's skills directory (Claude Code, Codex,
  Cursor, etc.) — the body of each stub explains how.

### `QUICKSTART.md`
#### Quickstart

<p align="center"><b>English</b> · <a href="docs/i18n/QUICKSTART.pt-BR.md">Português (Brasil)</a> · <a href="docs/i18n/QUICKSTART.de.md">Deutsch</a> · <a href="docs/i18n/QUICKSTART.fr.md">Français</a> · <a href="docs/i18n/QUICKSTART.ja-JP.md">日本語</a> · <a href="docs/i18n/QUICKSTART.ko.md">한국어</a> · <a href="docs/i18n/QUICKSTART.zh-CN.md">简体中文</a> · <a href="docs/i18n/QUICKSTART.zh-TW.md">繁體中文</a> · <a href="docs/i18n/QUICKSTART.th.md">ภาษาไทย</a></p>

Run the full product locally.

##### Environment requirements

- **Node.js:** `~24` (Node 24.x). The repo enforces this through `package.json#engines`.
- **pnpm:** `10.33.x`. The repo pins `pnpm@10.33.2` through `packageManager`; use Corepack so the pinned version is selected automatically.
- **OS:** macOS, Linux, and WSL2 are the primary paths. If your agent CLIs run inside WSL2, use the [`WSL2 setup guide`](docs/wsl-setup.md). Windows native is supported; see [`docs/windows-troubleshooting.md`](docs/windows-troubleshooting.md) for common PowerShell setup gotchas.
- **Optional local agent CLI:** OpenDesign supports a registry of local runtimes, including Claude Code, Codex, Devin for Terminal, OpenCode, Cursor Agent, Qwen, Qoder CLI, GitHub Copilot CLI, and others. The current list lives in [`apps/daemon/src/runtimes/registry.ts`](apps/daemon/src/runtimes/registry.ts). If none are installed, use a BYOK runtime configured in Settings.

###### Local agent CLI and PATH

The daemon scans your **`PATH`** (plus common user toolchain directories). If you install a CLI with **`npm install -g`** or **Homebrew** and OpenDesign still shows it as *not installed*, the GUI may be starting with a minimal `PATH` that does not include your global npm or Homebrew `bin` directory (common on macOS when the app is not launched from a full login shell). Ensure the executable’s directory is on `PATH` for the process that runs the daemon, then use **Rescan** in **Models & providers → Local CLI**.

[`nvm`](https://github.com/nvm-sh/nvm) / [`fnm`](https://github.com/Schniz/fnm) are optional convenience tools, not required project setup. If you use one, install/select Node 24 before running pnpm:

```bash
# nvm
nvm install 24
nvm use 24

# fnm
fnm install 24
fnm use 24
```

Then enable Corepack and let the repo select pnpm:

```bash
corepack enable
corepack pnpm --version   # should print 10.33.2
```

##### Docker Setup

Run OpenDesign in a fully containerised environment without installing Node.js or pnpm locally.

###### Requirements

* Docker Desktop
* Docker Compose v2

Verify Docker is installed correctly:

```bash
docker compose version
```

---

##### Start OpenDesign

From the repository root:

1. Change to the deploy directory and copy the environment template:

   ```bash
   cd deploy
   cp .env.example .env
   ```

2. Generate a secure token:

   ```bash
   openssl rand -hex 32
   ```

3. Open `.env` in your editor, find `OD_API_TOKEN=`, and paste the generated token there.

Then start the service:

```bash
docker compose up -d
```

Open the app in your browser:

```text
http://127.0.0.1:7456
```

The first startup may take a few seconds while Docker pulls the latest image.

---

##### Common Docker Commands

###### View logs

```bash
docker compose logs -f
```

###### Restart containers

```bash
docker compose restart
```

###### Stop containers

```bash
docker compose down
```

###### Pull the latest image

```bash
docker compose pull
docker compose up -d
```

###### Remove all local app data

```bash
docker compose down -v
```

---

##### Environment Configuration

Create a `deploy/.env` file to override the default configuration. Start from the provided example:

```bash
cp deploy/.env.example deploy/.env
```

Edit `deploy/.env` to set your own token and adjust other values as needed:

```env
# Port exposed on the host
OPEN_DESIGN_PORT=7456

# Container memory limit
OPEN_DESIGN_MEM_LIMIT=384m

# Allowed CORS origins
OPEN_DESIGN_ALLOWED_ORIGINS=https://yourdomain.com

# Docker image tag
OPEN_DESIGN_IMAGE=ghcr.io/nexu-io/od:latest

# Required API token for daemon security
# Generate one with: openssl rand -hex 32
OD_API_TOKEN=
```

---

##### Persistent Storage

Before documenting, changing, or choosing any persistent daemon storage path,
you MUST read the root `AGENTS.md` section **Daemon data directory contract**.
This Quickstart MUST NOT restate that contract or define storage paths.

---

##### Notes

* Docker mode is ideal for contributors who do not want a local Node.js or pnpm setup.
* The container exposes the production daemon build directly on port `7456`.
* For development workflows and advanced local setup, see the rest of this Quickstart guide.

---

##### One-shot (dev mode)

```bash
corepack enable
pnpm install
pnpm tools-dev run web # starts daemon + web in the foreground
# open the web URL printed by tools-dev
```

For the desktop shell and all managed sidecars in the background:

```bash
pnpm tools-dev # starts daemon + web + desktop in the background
```

On first load, the app detects the available local runtimes and also offers BYOK runtimes configured in Settings. Choose a runtime, a design template, and a design system, then type a prompt and hit **Send**. Structured local runtimes write canonical project files and stream file/tool events; the file workspace and preview update from those writes. Plain text-only and BYOK runs instead return a complete `<artifact>` block for the host to parse. Before documenting or changing any artifact storage path, you MUST read `AGENTS.md` → **Daemon data directory contract**.

The **Design systems** catalog is loaded from the `DESIGN.md` packages in [`design-systems/`](design-systems/). Pick one to apply that brand's visual language to the artifact.

The **Templates** catalog comes from [`design-templates/`](design-templates/) and groups artifact formats for prototypes, decks, documents, images, video, and audio. [`skills/`](skills/) is reserved for functional capabilities that the agent invokes while it works. Pair a template with a design system to produce an artifact in the chosen visual language.

##### Other scripts

```bash
pnpm tools-dev                 # daemon + web + desktop in the background
pnpm tools-dev start web       # daemon + web in the background
pnpm tools-dev run web         # daemon + web in the foreground (e2e/dev server)
pnpm tools-dev restart         # restart daemon + web + desktop
pnpm tools-dev restart --daemon-port 7457 --web-port 5175
pnpm tools-dev status          # inspect managed runtimes
pnpm tools-dev logs            # show daemon/web/desktop logs
pnpm tools-dev check           # status + recent logs + common diagnostics
pnpm tools-dev stop            # stop managed runtimes
pnpm --filter @open-design/daemon build  # build apps/daemon/dist/cli.js for `od`
pnpm --filter @open-design/web build     # build the web package when needed
pnpm typecheck                 # workspace typecheck
```

`pnpm tools-dev` is the only local lifecycle entry point. Do not use the removed legacy root aliases (`pnpm dev`, `pnpm dev:all`, `pnpm daemon`, `pnpm preview`, `pnpm start`).

`tools-dev` automatically loads workspace env files before resolving ports, namespaces, and child process environments. Default precedence is `.env.development.local`, then `.env.local`, then `.env.development`, then `.env`; env files override ambient shell exports so project-local config wins. Use `--no-env-file` to disable loading or repeat `--env-file <path>` to use explicit env files instead.

The development daemon defaults to the workspace-pinned Vela CLI installed by `pnpm install`, including its matching OpenCode companion. This prevents an older global `vela` from accepting sign-in but failing workspace billing or task launch. An explicit `VELA_BIN` or Settings → CLI env selection still takes precedence. Startup prints the selected workspace binary; if the optional package is absent it warns before falling back to PATH.

During local development, `tools-dev` starts the daemon first, passes its port into `apps/web`, and `apps/web/next.config.ts` rewrites `/api/*`, `/artifacts/*`, and `/frames/*` to that daemon port so the App Router app can talk to the sibling Express process without CORS setup.

##### Media generation / agent dispatcher checks

Image, video, audio, and HyperFrames skills call the local `od` CLI through environment variables injected by the daemon when it spawns an agent:

- `OD_BIN` — absolute path to `apps/daemon/dist/cli.js`.
- `OD_DAEMON_URL` — the running daemon URL.
- `OD_PROJECT_ID` — the active project id.
- `OD_PROJECT_DIR` — the active project's file directory.

If media generation fails with `OD_BIN: parameter not set`, `apps/daemon/dist/cli.js` missing, or `failed to reach daemon at http://127.0.0.1:0`, rebuild the daemon CLI and restart the managed runtime:

```bash
pnpm --filter @open-design/daemon build
pnpm tools-dev restart --daemon-port 7457 --web-port 5175
ls -la apps/daemon/dist/cli.js
curl -s http://127.0.0.1:7457/api/health
```

Then open the project from the OpenDesign app again instead of resuming an old terminal agent session. A daemon-spawned agent should see values like:

```bash
echo "OD_BIN=$OD_BIN"
echo "OD_PROJECT_ID=$OD_PROJECT_ID"
echo "OD_PROJECT_DIR=$OD_PROJECT_DIR"
echo "OD_DAEMON_URL=$OD_DAEMON_URL"
ls -la "$OD_BIN"
```

`OD_DAEMON_URL` must be a real daemon port such as `http://127.0.0.1:7457`, not `http://127.0.0.1:0`. The `:0` value is only an internal "pick a free port" launch hint and should not leak into agent sessions.

For the daemon-only production mode, the daemon serves the static Next.js export itself at `http://127.0.0.1:7456`, so no reverse proxy is involved.

If you place nginx in front of the daemon, keep SSE routes unbuffered and uncompressed. A common failure is the browser console showing `net::ERR_INCOMPLETE_CHUNKED_ENCODING 200 (OK)` after 80-90 seconds because nginx `gzip on` buffers chunked SSE responses even when the daemon sends `X-Accel-Buffering: no`.

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:7456;

    proxy_buffering off;
    gzip off;

    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
    proxy_http_version 1.1;
    proxy_set_header Connection "";

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

##### Two execution modes

| Mode | Picker value | How a request flows |
|---|---|---|
| **Local CLI** (default when daemon detects an agent) | "Local CLI" | Frontend → daemon `/api/chat` → `spawn(<agent>, ...)` → structured tool/file events over SSE → project files → preview. Plain-stream CLIs use the text-artifact path instead. |
| **API mode** (fallback / no CLI) | "Anthropic API" / "OpenAI API" / "Atlas Cloud" / "Azure OpenAI" / "Google Gemini" | Frontend → daemon `/api/proxy/{provider}/stream` → provider SSE normalized to `delta/end/error` → `<artifact>` parser → preview |

Both modes end in the same file workspace and sandboxed preview, but their handoff contracts differ. Filesystem-capable runtimes write the canonical files and must not echo their source in `<artifact>`; plain/text-only and BYOK runs have no file tools, so their canonical deliverable is the complete HTML inside `<artifact>`. The execution profile is selected from the runtime transport, and local CLIs receive the composed prompt through the invocation shape declared by their runtime definition.

##### Prompt composition

For every send, the app builds a system prompt from three layers and sends it to the provider:

```
BASE_SYSTEM_PROMPT   (execution-profile-specific file or <artifact> handoff)
   + active design system body  (DESIGN.md — palette/type/layout)
   + active skill body          (SKILL.md — workflow and output rules)
```

Swap the skill or the design system in the top bar and the next send uses the new stack. Bodies are cached in-memory per session so this is a single daemon fetch per pick.

##### File map

```
open-design/
├── apps/
│   ├── daemon/                # Node/Express — spawns local agents + serves APIs
│   │   └── src/
│   │       ├── cli.ts             # `od` bin entry
│   │       ├── server.ts          # /api/* + static serving
│   │       ├── agents.ts          # compatibility exports for the runtime modules
│   │       ├── runtimes/
│   │       │   ├── registry.ts    # supported runtime registry
│   │       │   └── defs/          # per-runtime launch and argument definitions
│   │       ├── skills.ts          # SKILL.md loader (frontmatter parser)
│   │       └── design-systems/    # DESIGN.md loader and services
│   │   ├── sidecar/           # tools-dev daemon sidecar wrapper
│   │   └── tests/             # daemon package tests
│   ├── web/                   # Next.js 16 App Router + React client
│       ├── app/               # App Router entrypoints
│       ├── src/               # React + TypeScript client/runtime modules
│       │   ├── App.tsx        # orchestrates mode / skill / DS pickers + send
│       │   ├── providers/     # daemon + BYOK API transports
│       │   ├── prompts/       # system, discovery, directions, deck framework
│       │   ├── artifacts/     # text-artifact parsing + artifact manifests
│       │   ├── runtime/       # iframe srcdoc, markdown, export helpers
│       │   └── state/         # localStorage + daemon-backed project state
│       ├── sidecar/           # tools-dev web sidecar wrapper
│       └── next.config.ts     # tools-dev rewrites + prod apps/web/out export config
│   └── desktop/               # Electron runtime, launched/inspected by tools-dev
├── packages/
│   ├── contracts/             # shared web/daemon app contracts
│   ├── sidecar-proto/         # OpenDesign sidecar protocol contract
│   ├── sidecar/               # generic sidecar runtime primitives
│   └── platform/              # generic process/platform primitives
├── tools/dev/                 # `pnpm tools-dev` lifecycle and inspect CLI
├── e2e/                       # Playwright UI + external integration/Vitest harness
├── skills/                    # functional capabilities invoked mid-task
├── design-templates/          # rendering catalog for prototypes, decks, docs, and media
├── design-systems/            # brand packages rooted at DESIGN.md
├── scripts/sync-design-systems.ts    # re-import from upstream getdesign tarball
├── docs/                      # product vision + spec
├── pnpm-workspace.yaml        # apps/* + packages/* + tools/* + e2e
└── package.json               # root quality scripts + `od` bin
```

##### Troubleshooting

- **`better-sqlite3` fails to load / ABI mismatch after a Node.js version change** — `pnpm install` re-runs `postinstall` automatically and rebuilds the native addon for the current Node.js. To rebuild manually or verify the fix: `pnpm --filter @open-design/daemon rebuild better-sqlite3` then `pnpm --filter @open-design/daemon exec node -e "require('better-sqlite3')"`. Requires build tools: `python3`, `make`, `g++` (or `clang++`). If you use `ignore-scripts=true` in your `.npmrc` (common for AUR packages), run `pnpm bootstrap` after `pnpm install`.
- **"no agents found on PATH"** — install one of the local runtimes registered in [`apps/daemon/src/runtimes/registry.ts`](apps/daemon/src/runtimes/registry.ts), make sure its executable is visible to the daemon, then use **Rescan** in **Models & providers → Local CLI**. Or configure a BYOK runtime in Settings.
- **Claude Code exits with code 1** — OpenDesign was able to start `claude`, but the spawned non-interactive run failed before producing a response. From the same shell or app environment that starts OpenDesign, check:
  ```bash
  claude --version
  claude auth status --text
  printf 'hello' | claude -p --output-format stream-json --verbose --permission-mode bypassPermissions
  ```
  If the smoke test reports `401`, `apiKeySource: "none"`, or another auth error without a custom endpoint, run `claude`, use `/login`, exit Claude, and retry OpenDesign. If you use multiple Claude profiles, set **Models & providers → Local CLI → Claude Code config directory** to the profile path such as `~/.claude-2`. If `ANTHROPIC_BASE_URL` or a proxy is set, check the endpoint URL, proxy credentials, endpoint auth environment, and model access; remove the custom endpoint only if you want to retry with standard Claude Code auth. On Windows, native PowerShell and WSL use separate Claude installs and credential stores; re-authenticate in the same environment OpenDesign uses, and check Windows Credential Manager if `/login` does not repair native Windows credentials.
- **daemon 500 on /api/chat** — check the daemon terminal for the stderr tail; usually the CLI rejected its args. Different CLIs take different argv shapes; inspect the matching definition in `apps/daemon/src/runtimes/defs/` if you need to adjust one.
- **media generation says `OD_BIN` is missing or daemon URL is `:0`** — run the media dispatcher checks above. Do not resume the old CLI session; reopen the project from the OpenDesign app so the daemon can inject fresh `OD_*` variables.
- **Codex loads too much plugin context** — start OpenDesign with `OD_CODEX_DISABLE_PLUGINS=1 pnpm tools-dev` to make daemon-spawned Codex processes run with `--disable plugins`.
- **artifact never renders** — first identify the run's handoff profile. For a filesystem-capable local runtime, confirm the agent created a previewable project file and that file-write events reached the daemon; it should not emit source in `<artifact>`. For a plain/text-only or BYOK run, confirm the response contains one complete `<artifact>` block. Check daemon logs for the first failed boundary instead of asking a filesystem runtime to fall back to inline source.
- **Browser authentication prompt on macOS** — keep Docker Desktop's default bridge networking. Sign in with username `open-design` and the `OD_API_TOKEN` value from `deploy/.env` as the password. Host networking is not required. See [`deploy/README.md` — Docker Desktop on macOS](deploy/README.md#docker-desktop-on-macos).

##### Mapping back to the vision

This Quickstart is the runnable seed of the spec in [`docs/`](docs/). The spec describes where this grows (see [`docs/roadmap.md`](docs/roadmap.md)). Highlights:

- `docs/architecture.md` describes the shipped stack: Next.js 16 App Router in front, local daemon behind it, and `apps/web/next.config.ts` rewrites in dev to keep the browser talking to the same `/api` surface.
- `docs/skills-protocol.md` describes the current `SKILL.md`/`od:` frontmatter and the split between functional skills and rendering templates. The parser and normalization source of truth is `apps/daemon/src/skills.ts`.
- `docs/agent-adapters.md` describes the adapter contract. Runtime-specific launch, argument, model, and stream settings live in `apps/daemon/src/runtimes/defs/`, with registration in `apps/daemon/src/runtimes/registry.ts`; `apps/daemon/src/agents.ts` is a compatibility export surface.
- `docs/modes.md` distinguishes the six New Project tabs from the seven normalized registry modes (`prototype`, `deck`, `template`, `design-system`, `image`, `video`, and `audio`).

## Appendix C — Core design skills (full)

### `skills/design-brief/SKILL.md`
_Parse a structured design brief written in I-Lang protocol format into a concrete design spec. Eliminates ambiguity from vague requests like "make it professional" by requiring explicit dimensions: palette, typography, layout, mood, density, and constraints. Trigger keywords: "design brief", "create a design brief", "ilang brief", "structured brief"._

#### Design Brief Skill

Parse a structured design brief into a concrete DESIGN.md and optional visual preview. Agent, follow this workflow exactly.

##### Background

The 8 dimensions in this skill were derived from OpenDesign's original 71-system catalog; 71 is the research sample, not the current bundled-system count. Every `DESIGN.md` in `design-systems/` still resolves at minimum: color palette, accent, typography, display font, layout model, and component style. We distilled these into 8 orthogonal dimensions that cover the decisions a designer makes before any pixel is placed. Mood and density were added because they are the two most common sources of ambiguity in natural language briefs ("make it clean" means different things to different people).

Dimensions intentionally excluded from the brief level: animation timing, responsive strategy, and accessibility contrast. These are enforced at the template level by individual skills (e.g., `saas-landing` handles its own responsive logic), though the generated DESIGN.md includes sensible breakpoint defaults for downstream consumption.

##### 1. Accept input

The user provides a design brief in one of two formats:

###### Option A: I-Lang structured brief

```
[PLAN:@DESIGN|type=saas_landing]
  |palette=navy_and_white|accent=coral
  |typography=inter|display=space_grotesk
  |layout=single_column|max_width=1200px
  |mood=professional_minimal
  |density=spacious|section_gap=96px
  |hero=headline+subhead+cta
  |sections=features,pricing,testimonials,footer
  |exclude=animations,parallax,gradients
  |responsive=mobile_first
```

###### Option B: Natural language

> "I need a landing page for a developer tool. Clean, minimal, dark mode. Inter font. No flashy animations."

If the user provides Option B, convert it to the structured format using the mapping table below, then proceed. Identify every dimension explicitly stated and flag dimensions that were left unspecified.

###### Natural language → I-Lang mapping

For each sentence in the natural language input, identify dimension keywords and map to the closest structured value:

| Natural language phrase | Dimension | I-Lang value |
|------------------------|-----------|-------------|
| "dark mode", "dark theme" | palette | `monochrome_dark` |
| "light", "white background" | palette | `light_clean` |
| "earthy", "warm tones" | palette | `earth_tones` |
| "pop of color", "vibrant" | accent | `electric_blue` (default) or `coral` |
| "subtle accent" | accent | `muted_sage` (default) or `slate` |
| "clean", "minimal", "simple" | mood | `professional_minimal` |
| "playful", "fun", "friendly" | mood | `playful` |
| "bold", "brutalist", "raw" | mood | `brutalist` |
| "editorial", "magazine-like" | mood | `editorial` |
| "spacious", "lots of whitespace" | density | `spacious` |
| "compact", "dense", "information-rich" | density | `compact` |
| "Inter", "system font" | typography | `inter` (default) or `system_ui` |
| "serif", "traditional" | typography | `georgia` (default) or `playfair` |
| "monospace", "code-like" | typography | `jetbrains_mono` |
| "no animations", "static" | exclude | `animations` |
| "no gradients" | exclude | `gradients` |
| "no stock photos" | exclude | `stock_photos` |
| "single page" | layout | `single_column` |
| "two columns", "sidebar" | layout | `two_column` |
| "mobile first" | responsive | `mobile_first` |

When a phrase maps to multiple dimensions (e.g. "clean dark landing page" → mood=professional_minimal + palette=monochrome_dark + layout=single_column), resolve each dimension independently. When multiple values are listed for a single mapping, the first is the default; the agent may select the alternative only if surrounding context strongly favors it.

##### 2. Validate dimensions

Every design brief must resolve these 8 dimensions. If any are missing from the input, select sensible defaults using the rules in Section 2.2.

The values listed below form a closed vocabulary. Only values in this table have concrete token mappings in Section 2.1. If the user provides a value not listed here, the agent must prompt for clarification rather than guessing.

| # | Dimension | Key | Example values |
|---|-----------|-----|---------------|
| 1 | Color palette | `palette` | navy_and_white, earth_tones, monochrome_dark, light_clean |
| 2 | Accent color | `accent` | coral, electric_blue, emerald, muted_sage |
| 3 | Body typography | `typography` | inter, system_ui, dm_sans, georgia |
| 4 | Display typography | `display` | space_grotesk, clash_display, same_as_body, playfair |
| 5 | Layout model | `layout` | single_column, two_column, asymmetric |
| 6 | Mood | `mood` | professional_minimal, playful, brutalist, editorial |
| 7 | Density | `density` | compact, balanced, spacious |
| 8 | Constraints | `exclude` | animations, gradients, stock_photos, carousel |


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/design-brief/SKILL.md_

### `skills/design-md/SKILL.md`
_Create and manage DESIGN.md files. Useful for capturing design direction, tokens, and visual rules in a single source of truth._

#### design-md

> Curated from Google Labs (Stitch).

##### What it does

Create and manage DESIGN.md files. Useful for capturing design direction, tokens, and visual rules in a single source of truth.

##### Source

- Upstream: https://github.com/google-labs-code/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/google-labs-code/skills
```

Then ask the agent to invoke this skill by name (`design-md`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/creative-director/SKILL.md`
_AI creative director with recursive self-assessment: 20+ methodologies (SIT, TRIZ, Bisociation, SCAMPER, Synectics), 3-axis evaluation calibrated against Cannes/D&AD/HumanKind, 5-phase process from brief to presentation._

#### creative-director

> Curated from @smixs.

##### What it does

AI creative director with recursive self-assessment: 20+ methodologies (SIT, TRIZ, Bisociation, SCAMPER, Synectics), 3-axis evaluation calibrated against Cannes/D&AD/HumanKind, 5-phase process from brief to presentation.

##### OpenDesign orchestration mode

When this skill is invoked inside OpenDesign, treat it as the design-flow
director, not as a single polish checklist.

1. Define what "good-looking" means before changing pixels: audience, product
   goal, brand posture, style references, information density, typography,
   palette, motion tone, asset needs, and explicit anti-patterns such as
   generic AI gradients, empty cards, vague copy, and template symmetry.
2. Inspect the current target: HTML/page element, browser tab, design file,
   active design system, attached image, or project folder.
3. Search across every available OpenDesign resource, not only this skill:
   skills, plugins, MCP servers and templates, connected connectors, design
   files, active browser/context, and user-provided assets.
4. Match resources into a staged workflow. Typical lanes are critique,
   style-direction selection, visual asset generation, motion, data/proof
   grounding, implementation polish, responsive/accessibility hardening, and
   final verification.
5. When the design target or aesthetic bar is ambiguous, present a small
   guided UI-style choice set or form with a recommended default. Continue the
   workflow after the choice instead of stopping at a generic question.
6. If the best resource is not configured yet, explain why it is needed and
   guide setup; otherwise use the closest configured alternative and mark the
   tradeoff.

##### Source

- Upstream: https://github.com/smixs/creative-director-skill
- Category: `creative-direction`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/smixs/creative-director-skill
```

Then ask the agent to invoke this skill by name (`creative-director`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/reference-design-contract/SKILL.md`
_Turn vague taste, screenshots, URLs, product notes, or "make it feel like this" references into a grounded DESIGN.md plus an implementation handoff. Use it before prototypes, decks, redesigns, or image remix work when the user needs a reusable visual direction rather than a one-off prompt._

#### Reference Design Contract

Use this skill when the user has taste signals, references, or a rough "like
this" request and needs a reusable design contract before generation. The goal
is not to write a longer prompt. The goal is to make design decisions explicit
enough that a later prototype, deck, redesign, or image-remix run can execute
without guessing.

##### What this skill produces

Create three files:

1. `DESIGN.md` — the reusable visual direction, following OpenDesign's
   standard nine-section design-system shape.
2. `design-contract.md` — the decision record: evidence used, keep/change
   boundaries, rationale, risks, and quality gate.
3. `implementation-handoff.md` — concise build instructions for the next
   artifact-producing skill or coding agent.

If a preview is useful, also create `example.html` as a small hand-built
contract preview. Do not make it the main deliverable.

##### Workflow

1. **Lock the job.** Identify target artifact type, audience, brand/product
   context, references, and constraints. Ask at most two questions only when a
   missing answer would change the direction. Otherwise choose a sensible
   default and label it as inferred.
2. **Read evidence.** Use provided screenshots, URLs, existing `DESIGN.md`,
   brand docs, image artifacts, or user notes. If evidence is missing, say so
   and base the contract on the brief only; do not invent brand facts.
3. **Separate reference semantics.** For every reference, split it into:
   - `Keep`: qualities to preserve, such as density, composition, material,
     typography rhythm, color temperature, or motion attitude.
   - `Change`: subject matter, copy, brand marks, exact layout, protected
     assets, and anything the user wants adapted.
   - `Do not copy`: literal screenshots, logos, claims, pricing, proprietary
     UI, or exact prompt wording from examples.
4. **Freeze the direction.** Choose one coherent visual stance. Do not provide
   five unrelated moodboards. If there are genuinely competing directions,
   name them briefly, pick the recommended one, and continue.
5. **Write `DESIGN.md`.** Use these nine headings exactly:
   - `## 1. Visual Theme & Atmosphere`
   - `## 2. Color`
   - `## 3. Typography`
   - `## 4. Spacing & Grid`
   - `## 5. Layout & Composition`
   - `## 6. Components`
   - `## 7. Motion & Interaction`
   - `## 8. Voice & Brand`
   - `## 9. Anti-patterns`
6. **Write `design-contract.md`.** Include:
   - goal and target artifact
   - evidence table with confidence (`observed`, `provided`, `inferred`)
   - keep/change/do-not-copy table
   - final design stance in one paragraph
   - risks and explicit unknowns
   - quality gate checklist
7. **Write `implementation-handoff.md`.** Keep it short and operational:
   - files to read
   - token/palette/type/layout constraints
   - asset rules
   - responsive requirements
   - "first artifact should prove..." acceptance notes
8. **Validate.** Read `references/checklist.md` and satisfy every P0 gate
   before final handoff.

##### Output rules

- Make every claim traceable to user input, observed reference evidence, or an
  explicitly labeled inference.
- Prefer concrete constraints over adjectives: "one warm accent, no purple or
  blue glow" beats "premium".
- Treat "do the same style" as "borrow controllable qualities", not "clone the
  original subject or prompt".
- If the user asks for immediate UI generation too, finish these contract files
  first, then hand off to the appropriate artifact skill in the next step.

### `skills/design-review/SKILL.md`
_Designer Who Codes: visual audit then fixes with atomic commits and before/after screenshots. Useful for tightening shipped UI before launch._

#### design-review

> Curated from Garry Tan (gstack).

##### What it does

Designer Who Codes: visual audit then fixes with atomic commits and before/after screenshots. Useful for tightening shipped UI before launch.

##### Source

- Upstream: https://github.com/garrytan/gstack
- Category: `creative-direction`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/garrytan/gstack
```

Then ask the agent to invoke this skill by name (`design-review`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/plan-design-review/SKILL.md`
_Senior Designer review: rates each design dimension 0-10, explains what a 10 looks like, and flags AI Slop signals. Useful as a gate before merging UI work._

#### plan-design-review

> Curated from Garry Tan (gstack).

##### What it does

Senior Designer review: rates each design dimension 0-10, explains what a 10 looks like, and flags AI Slop signals. Useful as a gate before merging UI work.

##### Source

- Upstream: https://github.com/garrytan/gstack
- Category: `creative-direction`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/garrytan/gstack
```

Then ask the agent to invoke this skill by name (`plan-design-review`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/impeccable-design-polish/SKILL.md`
_Follow-up design polish skill inspired by Impeccable. Use after a web or HTML artifact exists to audit, critique, polish, animate, harden, and prepare the page for a live/share pass._

#### Impeccable Design Polish

Use this skill as the post-generation pass for an existing design. It should not restart the project from scratch; it should make the current artifact sharper, more usable, and closer to something a designer would ship.

##### Follow-Up Modes

- **Audit**: identify the highest-impact issues in hierarchy, spacing, color, type, interaction states, responsiveness, and accessibility.
- **Critique**: explain what feels generic, overdesigned, underdesigned, or inconsistent.
- **Polish**: directly edit the artifact to improve the top issues while preserving the user's intent.
- **Animate**: add restrained, useful motion only where it improves feedback or storytelling.
- **Harden**: repair mobile overflow, text clipping, contrast problems, missing states, broken links, and fragile layout assumptions.
- **Live**: prepare the artifact for presentation or sharing, including final visual QA and clear next actions.

##### Operating Rules

1. Inspect the current HTML/page before editing. Do not guess from the prompt alone.
2. Keep the existing content, brand, and scenario unless the user explicitly asks to change them.
3. Prefer a few decisive fixes over broad cosmetic churn.
4. Remove common AI tells:
   - purple-blue glow gradients with no product reason
   - generic 3-card feature rows
   - oversized rounded cards everywhere
   - empty marketing adjectives
   - inconsistent spacing and type scale
   - decorative effects that do not support comprehension
5. Preserve accessibility: focus states, contrast, semantic controls, readable text, and reduced-motion fallbacks.
6. Finish with the artifact in a better runnable state, not just a critique list.

##### Best Pairings

- Pair with `design-taste-frontend` or `gpt-taste` for stronger anti-slop redesign work.
- Pair with `emilkowalski-motion` or GSAP skills for motion-specific polish.
- Pair with image/video skills when the artifact needs real visual assets rather than CSS-only decoration.

### `skills/taste-skill/SKILL.md`
_Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check._

#### tasteskill: Anti-Slop Frontend Skill

> Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI.
> Every rule below is **contextual**. None of it fires automatically. First read the brief, then pull only what fits.

---

##### 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code or tweaking dials, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

###### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "serious B2B", "editorial", "agency-y", "glassy", "dark tech".
3. **Reference signals** - URLs they linked, screenshots they pasted, products they named, brands they're competing with.
4. **Audience** - B2B procurement panel vs. design-conscious consumer vs. recruiter scanning a portfolio. The audience picks the aesthetic, not your taste.
5. **Brand assets that already exist** - logo, color, type, photography. For redesigns, these are starting material, not optional input (see Section 11).
6. **Quiet constraints** - accessibility-first audiences, public-sector, regulated industries, trust-first commerce, kids' products. These constraints OVERRIDE aesthetic preference.

###### 0.B Output a one-line "Design Read" before generating
Before any code, state in one line: **"Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<design system or aesthetic family>."**

Example reads:
- *"Reading this as: B2B SaaS landing for technical buyers, with a Linear-style minimalist language, leaning toward Tailwind utilities + Geist + restrained motion."*
- *"Reading this as: solo designer portfolio for hiring managers, with an editorial / kinetic-type language, leaning toward native CSS + scroll-driven animation + custom typography."*
- *"Reading this as: redesign of a public-sector service site, with a trust-first language, leaning toward GOV.UK Frontend or USWDS."*

###### 0.C If the brief is ambiguous, ask one question, do not guess
Ask exactly **one** clarifying question - never a multi-question dump - and only when the design read genuinely diverges. Example: *"Should this feel closer to Linear-clean or Awwwards-experimental?"*

If you can confidently infer from context, **do not ask**. Just declare the design read and proceed.

###### 0.D Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. These are the LLM defaults. Reach past them deliberately based on the design read.

---

##### 1. THE THREE DIALS (Core Configuration)

After the design read, set three dials. Every layout, motion, and density decision below is gated by these.

* **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
* **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Use these unless the design read overrides them. Do not ask the user to edit this file - overrides happen conversationally.

###### 1.A Dial Inference (design read → dial values)
| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Dribbble / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / regulated / accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "redesign - preserve" | match existing | +1 | match existing |
| "redesign - overhaul" | +2 | +2 | match existing |

###### 1.B Use-Case Presets
| Use case | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| Landing (SaaS, mainstream) | 7 | 6 | 4 |
| Landing (Agency / creative) | 9 | 8 | 3 |
| Landing (Premium consumer) | 7 | 6 | 3 |
| Portfolio (Designer / studio) | 8 | 7 | 3 |
| Portfolio (Developer) | 6 | 5 | 4 |
| Editorial / Blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |
| Redesign - preserve | match | match+1 | match |
| Redesign - overhaul | +2 | +2 | match |

###### 1.C How the Dials Drive Output
Use these (or user-overridden values) as global variables. Cross-references throughout this document refer to these exact variable names - never invent aliases like `LAYOUT_VARIANCE` or `ANIM_LEVEL`.

---

##### 2. BRIEF → DESIGN SYSTEM MAP

Once you have the design read (Section 0) and dials (Section 1), pick the right foundation. Do not invent CSS for things that have an official package. Do not pretend an aesthetic trend is an official system.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/taste-skill/SKILL.md_

### `skills/brand-extract/SKILL.md`
_Extract a complete Brand Kit from a live website by driving the in-app browser. Use when a brand-extraction project opens with a site in the Browser tab, or when the user asks to "extract a brand", "pull the brand from <url>", "get the colors/fonts/logo from this site", or build a brand/design system from a reference website. Pairs with the agent-browser tool for measurement and pauses for the user when an anti-bot wall blocks the page._

#### brand-extract

Turn a live website into a complete, machine-consumable **Brand Kit** —
identity, semantic color palette, typography, voice — by **measuring** the real
page, not guessing from memory. This is the methodology behind a brand-extraction
project: the target site is open in a secondary in-app **Browser** tab, and you
drive it with the `agent-browser` tool.

###### The live kit page (`brand.html`)

The extraction project opens with **`brand.html` as the active tab** — a
self-contained brand-kit page (template:
`brand-extract/templates/brand-kit.html`) that the daemon renders from
`brand.json`. The daemon **pre-seeds** it with a deterministic first paint — a
harvested logo, an approximate palette, font families, and a few cover images —
so it is NOT all-skeleton when it opens. Your job is to **replace that seed with
measured truth** and fill in the rest, **progressively**, so the user watches it
complete module by module. You never hand-edit it: you write `brand.json`, then
run `od brand preview <brandId>` and the daemon re-renders the page (the page
soft-reloads itself while extracting). Optimize for **fast first paint and
progressive fill-in** — write a partial `brand.json` and preview it the moment
you have a name, a couple of colors, and a logo, then preview again after each
field group rather than batching the whole kit to the end.

> The trap to avoid: an LLM left alone regresses to the mean — Inter, an indigo
> accent, a purple gradient. That is off-brand for everyone. Every value you emit
> must trace to something you **measured** on the page.

##### The three-step chain

Work in order. Skipping straight to writing `brand.json` is how off-brand,
hallucinated kits happen.

###### 1. Measure (drive the open Browser tab)

Use `agent-browser` against the **selected** browser tab (its URL/title are in
your run context — treat "this page" / "the site" as that tab):

1. `agent-browser get url` / `get title` to confirm the target.
2. `agent-browser snapshot` before extracting anything.
3. Harvest the real design language from the DOM/CSS, not the screenshot alone:
   - **Colors** — frequency-rank color literals and resolve the seven semantic
     roles: `background`, `surface`, `foreground`, `muted`, `border`, `accent`,
     `accent-secondary`. The most frequent near-white/cream is usually the
     background; the most frequent chromatic mid-saturation color is usually the
     accent.
   - **Typography** — the `@font-face` names and `font-family` declarations for
     display, body, and (if present) mono. Note weights actually used.
   - **Logo (save MULTIPLE candidates)** — extract every logo asset you find and
     save each as a file under `logos/`: the inline header/nav `<svg>` (write the
     literal `<svg>…</svg>` markup verbatim to `logos/header.svg` — do not just
     reference it), any `<img>` logo, `apple-touch-icon`, favicon, and
     `og:image`. Fetch the asset URLs directly — **never leave `logo.primary`
     empty when the site has any mark**. Set `logo.primary` to the best vector /
     transparent lockup (SVG wordmark > apple-touch-icon > favicon > og:image)
     and list the rest in `logo.alternates`; the kit page renders them as
     switchable thumbnails. (The daemon auto-fetches a favicon/og:image fallback
     into `logos/` so the page is never logo-less, but that safety net is no
     substitute for saving the real wordmark.)
   - **Imagery (save 6–8 of the site's LARGE / COVER / HERO images)** — this is
     the Images module. Harvest the site's actual big representative pictures and
     save them into `imagery/`: the `og:image`/`twitter:image` social card, the
     hero/banner art, the largest `<img>` (resolve the highest-res `srcset` /
     `<picture>` source), CSS `background-image` hero blocks, product or app
     screenshots, and illustration/photography samples. Filter by **rendered
     size** — keep only big images (roughly ≥320px on the long edge) and drop
     icons, sprites, logos, avatars, and tracking pixels. List them in
     `brand.json` as `imagery.samples` (see shape below); the kit page renders
     them as a clean labeled Images gallery (a thumbnail grid). Pick 6–8 varied,
     on-brand images — never UI chrome or icons. (The daemon runs a deterministic
     cover/hero-image fallback at finalize so the gallery is rarely empty, but
     that safety net is no substitute for picking the real hero images.)
   - **Voice** — representative headings, taglines, and body copy to ground the
     voice; quote-level fidelity, not generic marketing speak.
4. Save any self-hosted webfont files you can fetch into `fonts/`.
5. Capture one page screenshot as visual evidence when it helps.

###### Anti-bot wall → ask the user (do NOT bypass)

If the page is an anti-bot interstitial instead of the real site — Cloudflare
"Just a moment…", "Verify you are human", "Attention Required", DataDome,
PerimeterX, Incapsula — **stop measuring** and emit a `<question-form>` asking
the user to clear it by hand in the Browser tab:

```
<question-form id="cf-verify" title="Verify in the browser">
[
  {
    "id": "ready",
    "type": "radio",
    "label": "The site is behind a verification wall. Please complete the check in the Browser tab on the right, then choose Continue.",
    "options": ["Continue — I cleared the wall", "Skip — extract from public knowledge instead"]
  }
]
</question-form>
```

Then end the turn. When the user submits the form, re-run
`agent-browser snapshot` on the now-unblocked tab and resume measuring. Never
attempt to solve CAPTCHAs or bypass the wall yourself. If the user picks
"Skip", fall back to your knowledge of the brand's public identity and clearly
mark each such value `(from brand knowledge)` in its `usage`/`notes`.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/brand-extract/SKILL.md_

### `skills/web-clone/SKILL.md`
_网站复刻 / 克隆方法论。USE WHEN 用户说 复刻网站、克隆网站、clone website、抄个站、仿站、 照着这个站做一个、reproduce site、还原某个网页效果、把这个站搬下来改成我的、 复刻某个交互/WebGL/Canvas/Three.js 效果。提供「先拿真源码 → 判路径 → 逆向拆解 → 搭工程 → 替换内容」的可移植决策树，覆盖静态站 / React-Vue-Next 内容站 / WebGL-Canvas 重前端站三大分支，并强制核对任何 AI 二手分析里的可执行代码。_

#### Web Clone · 网站复刻方法论

把"复刻一个网站"做成可重复的流程。在 OpenDesign 中，默认在当前项目目录工作：`NOTES.md`、`RECON/`、`CLONE_REPORT.md`、`CLONE_AUDIT.md` 和最终可预览的 `index.html` 都应写在当前项目内，除非用户明确指定外部工作目录。

**OpenDesign 环境准备（跑任何 `scripts/` 前先看）**：
- 本 skill 的脚本会被 stage 到项目内 `.od-skills/<插件目录>/scripts/`（skill 前言里有确切路径）。文中命令写的 `node scripts/xxx.mjs` 按该路径解析，例如 `node .od-skills/<插件目录>/scripts/recon-site.mjs ...`；`RECON/`、`assets/` 等产物仍写到项目根。
- 脚本内置基于 Chrome DevTools Protocol 的零依赖控制层，直接复用系统已有的 Chrome、Edge 或 Chromium；无需启动 Electron 客户端，也支持纯 `od` CLI。Agent 沙箱内会通过本地 daemon 创建临时 CDP 会话，避免沙箱阻止 Chrome 子进程。**禁止在用户项目里执行 `npm install playwright` 或下载 Chromium。** 若预检报告没有兼容浏览器，直接说明缺少系统浏览器或通过 `OD_BROWSER_EXECUTABLE_PATH` 指定路径，不要改为目测，也不要反复安装依赖。源码开发环境若已经提供 `OD_PLAYWRIGHT_PACKAGE`，脚本仍兼容该运行时，但它不是产品链路的前置条件。

##### 头号铁律：真源码至上，绝不信 AI 推测的代码

> 任何 AI 生成的"复刻分析/施工图"，**正文的概念骨架可以参考，但里面的可执行代码块默认全是臆造的**，必须逐行用真源码核对，否则照抄必崩。

**实证（marbles 案例）**：一份 AI 分析文档把原站"解析法求光线-球体交点 + 把光学结果编码成位移图、交给 SVG `feDisplacementMap` 去扭曲真实 DOM"的真架构，臆造成了"ray-marching + SDF + 把 DOM 当纹理采样"——两套完全不同的实现，照抄做不出原效果且慢 N 倍。详见 `references/marbles-case.md`。

所以第一动作永远是：**拿到真源码**。

##### 决策树（按顺序走，不许跳）

###### Step 0 · 先建标准工程骨架

```bash
node scripts/init-clone.mjs <站名> --url <原站URL> --in-place
```

该脚本会在当前项目内创建 `NOTES.md`、`RECON/screenshots/`，避免每次手工漏掉产物。

###### Step 1 · 先去 GitHub 搜源码，别急着抓站

```bash
unset SSL_CERT_FILE   # macOS 怪癖，bash 前先解
# 按站名/产品名搜
SSL_CERT_FILE=/etc/ssl/cert.pem gh api "search/repositories?q=<关键词>" \
  | jq -r '.items[] | "\(.full_name) ⭐\(.stargazers_count) \(.description)"' | head -10
# vercel.app/netlify.app/github.io 的 URL slug 常常就是 仓库名 / 部署者用户名
```
- 单文件站（github.io / 纯 HTML）→ 直接抓 raw：`curl -sL https://raw.githubusercontent.com/<user>/<repo>/main/index.html`
- **找到源码且许可允许 → 跳 Step 4 直接 clone。** 教训：先搜 GitHub 能省 30 分钟弯路。

###### Step 2 · 没找到源码 → 浏览器侦察（探针）

使用内置的零依赖 CDP 浏览器控制层跑探针抽信号（框架 / `window.THREE` / canvas 数 / 平滑滚动库 / 字体 / scrollHeight）。截图 1440/768/390 三档 + 侦察 JSON 存 `RECON/`。

优先用内置脚本跑标准侦察：

```bash
node scripts/recon-site.mjs \
  --url <原站URL> \
  --out RECON \
  --label original

# 真浏览器全程滚动，把页面真实用到的图片/字体/媒体（含第三方 CDN、防盗链资产）
# 全部拔到本地，并生成 assets/fonts/fonts.css（自托管 @font-face）+ URL→本地路径映射。
node scripts/asset-harvest.mjs \
  --url <原站URL> \
  --recon RECON/original-recon.json \
  --out assets \
  --manifest RECON/asset-manifest.json

node scripts/network-capture.mjs \
  --url <原站URL> \
  --out RECON/network \
  --label original

node scripts/route-crawl.mjs \
  --url <原站URL> \
  --out RECON/routes \
  --label original \
  --max-pages 25 \
  --max-depth 2

node scripts/interaction-probe.mjs \
  --url <原站URL> \
  --out RECON/interactions \
  --label original

node scripts/sourcemap-hunt.mjs \
  --recon RECON/original-recon.json \
  --out RECON/sourcemaps
```

`--wait` 仅表示页面导航完成后的额外稳定等待，不是导航超时。导航超时只可用 `--navigation-timeout <毫秒>` 调整；同一错误不要通过增大 `--wait` 盲目重试。

> 登录态私域站需要使用当前环境里已登录的浏览器上下文；localhost / 无登录公开站直接用内置 CDP 探针。

###### Step 2.5 · 先给复杂度定级，别盲目承诺

根据侦察结果先写一版"复刻前预判"：复杂度 L1-L6、推荐模式（忠实复刻 / 视觉复刻 / 内容爆改）、预计可还原范围、明确不克隆的部分。分级和评分规则见 `references/assessment.md`。

**模式选择纪律（用户没回答确认项时的默认）**：用户说的是"复刻/克隆这个网站"，默认就是**忠实复刻**——还原度是这个场景的第一目标。不许因为"原站是商业站/有版权内容"就自作主张降级成视觉复刻、换占位品牌、用排版块替代摄影图：那会被用户直接感知为"图片没抓下来、字体不对、颜色不还原"。正确姿势是**先忠实复刻到位**（真图真字体真色值全部落地），把版权/商标风险写进 NOTES.md 的"部署前须替换清单"，替换动作留给 Step 6 由用户决定。只有用户明确要"做我自己的站/换成我的品牌"时才走视觉复刻/内容爆改。同理，**不许因为"目标站是风控敏感的 SPA"就跳过脚本侦察**——`recon-site.mjs`/`asset-harvest.mjs` 用的就是真浏览器，先跑再说，跑不通再降级并如实记录。

**若模式是「视觉复刻」或「内容爆改」** → 顺手产出结构化设计身份 `design-dna.json`，把"那个站的感觉"变成可版本化、可对照的 token 规范，让 Step 6 替换时"DNA 留着、内容换掉"有据可依：

```bash
node scripts/dna-scaffold.mjs \
  --recon RECON/original-recon.json \
  --out   RECON/design-dna.json \
  --name  "<站名>"
```

脚本会把侦察到的字体/色候选/框架特效信号 best-effort 预填，其余字段人工 Analyze 补全。三维结构（design_system / design_style / visual_effects）、完整 schema、适用边界见 `references/design-dna.md`。
> ⚠️ **「忠实复刻」分支不要用 DNA**：真源码就是真相，别让"近似风格"的 DNA 稀释逐字节铁律。

###### Step 3 · 按侦察结果选路径

| 侦察结果 | 走哪条路 |
|---|---|
| 静态 HTML/CSS，无框架 | `wget --mirror` 抓镜像 → 删追踪脚本 → 改文案 |
| React / Vue / Next（内容为主） | 重建模板（如 `ai-website-cloner-template`，Node 24+），灌内容 |
| SPA / SaaS / 数据驱动页面 | 先跑 `network-capture.mjs` 保存 API fixtures → 本地 JSON/mock server 替身 |
| 多页面官网 / 产品站 | 先跑 `route-crawl.mjs` 做路由地图 → 每类页面抽模板 → 统一替换内容 |
| 复杂交互站 | 先跑 `interaction-probe.mjs` 记录 hover/click/scroll/canvas drag 状态 → 按状态补交互，不许只截首屏 |
| **WebGL / Canvas / Three.js 重前端** | **深度逆向真源码（见下）→ 忠实复刻 或 找同类开源 3D 模板换内容**。单文件原生站常常逐字节保留=最忠实复刻。**找不到真源码时走运行时帧捕获 + baseline 闸门**，纪律见 `references/effect-extraction.md`（可委托 web-shader-extractor） |
| **静态构建站（Astro/Vite SSG/Hugo），含重 WebGL** | **`mirror-site.mjs` 全量镜像部署资产 → 自托管字体 + 删追踪 → 本地 web 根服务 = 真源码 1:1 忠实复刻**。对静态站，"拿到真源码"="镜像部署资产整套"。配方见 `references/static-mirror.md`。范例：oryzo.ai（Lusion，L6，高斯泼溅，hero 像素 diff 5/5） |
| 用现成开源主题的站（Astro/Hugo 主题） | 去对应主题市场找源主题（**仅限套用现成主题的站**；定制站走上一行的全量镜像，别来这行） |

L4-L6 复杂站按 `references/complex-playbooks.md` 走，不要只用普通官网流程。

###### Step 4 · 在当前项目里搭工程

```bash
# 当前 OpenDesign 项目目录就是复刻工作区。
pwd
# git 源码：clone 到 source/ 或直接放入当前目录；单文件：放进来。原始源码留一份只读基准 index-original.html
# 检查 Node 版本（package.json engines），nvm use 对应版本，钉 .nvmrc
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/web-clone/SKILL.md_

### `skills/slides/SKILL.md`
_Create and edit .pptx presentation decks with PptxGenJS. Useful for sales decks, kickoff briefs, and design-system showcases._

#### slides

> Curated from OpenAI's skills repository.

##### What it does

Create and edit .pptx presentation decks with PptxGenJS. Useful for sales decks, kickoff briefs, and design-system showcases.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `slides`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/openai/skills
```

Then ask the agent to invoke this skill by name (`slides`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/deck-swiss-international/SKILL.md`
_16-column grid, one saturated accent, and 22 locked layouts (Klein Blue, Lemon, Mint, Safety Orange)._

【模板: 瑞士国际主义 Deck (Swiss International)】
【意图】事实、产品、分析、方法论表达。极度冷静、理性、学院派, 没有任何手绘 / 噪点 / 装饰。Inspired by op7418/guizang-ppt-skill Style B。

【主题】**只能从下面 4 套二选一, 不许混用、不许改 hex**:
- 🔵 **Klein Blue (IKB)** — accent `#002FA7`, paper `#fafaf8`, ink `#0a0a0a`. 商业 / AI / 设计场景。
- 🟡 **Lemon Yellow** — accent `#FFD500`, paper `#f7f5ee` (淡奶油), ink `#0a0a0a`. 年轻 / 零售 / 体育。文字必须用黑色 (不能白色)。
- 🟢 **Lemon Green / Neon** — accent `#C5E803`, paper `#f7f5ee`, ink `#0a0a0a`. 可持续 / 科技初创 / Gen-Z 品牌。文字必须用黑色。
- 🟠 **Safety Orange** — accent `#FF6B35`, paper `#f7f5ee`, ink `#0a0a0a`. 工业 / 汽车 / 紧急消息。文字用白色 + bold ≥ 600。

【布局 — 22 个可复用版式池, 不许新增或改造版式; **数量由内容决定**, 把【用户内容】完整覆盖完为止 (短内容 6-10 张起步, 长内容应远超此范围, 同一版式可在不同章节重复使用)】
- **S01 Cover** — 全屏 accent + ASCII 呼吸点阵 + 反白标题 + 元数据 chrome (date / № / topic)。
- **S02 Vertical Timeline** — 左侧虚线轴 + 圆点; 右侧节点 = 年份 + KPI + 描述。
- **S03 Statement** — 9.6vw 居中巨字 + 左侧大段留白 + 底部 hairline + 注释。
- **S04 Six Cells** — 2×3 网格, 每格: icon + 编号 + 短标题 + 单行描述。
- **S05 Three Sub-cards** — 左侧 hero 标题 + 右侧 3 张水平堆叠的灰色卡。
- **S06 KPI Tower** — 4 列变高蓝色柱状; 柱顶 icon; 柱底大数字 + 标签。
- **S07 H-Bar Chart** — 水平排名横条, 宽度反映数据, 末端标数字。
- **S08 Duo Compare** — 垂直分割线; 左 Before / 右 After。
- **S09 Closing Manifesto** — 左 IKB 块 + ASCII 点阵 + 宣言; 右白底 + 3 条要点。
- **S10 Dot Matrix Statement** — 居中宣言 + 角落几何点矩阵 / 圆环矩阵。
- **S11 Horizontal Timeline** — 顶部 headline, 中部 hairline 轴, 等距节点, 节点下方步骤名。
- **S12 Manifesto + Ink Banner** — 上半 headline + 解释; 下半全宽黑色横幅 + 反白小字。
- **S13 Three Forces Cards** — 左 ink hero 块; 右 3 张灰色卡, 每卡: 大数字 + 文本。
- **S14 Loop Diagram** — 左编号步骤; 右 SVG 同心环; 中心 "LOOP" 标签。
- **S15 Image Matrix + Hero Stat** — 4×3 等高卡片 (12 项) + 底部 summary 大数字 + 标签。
- **S16 Multi-card Brief** — 3×2 微卡; 主文左上, 注脚右下, 单卡 accent 高亮。
- **S17 System Diagram** — 左 headline + 3 段描述; 右 SVG 三同心圆 + 外部标签。
- **S18 Why Now** — 3 列, 每列: category label + headline + 描述 + 底部数字 (最后一列 accent)。
- **S19 Four Cards** — 顶部 accent hairline + headline + 4 张等宽卡 (元数据 / 标题 / 正文)。
- **S20 Stacked KPI Ledger** — 垂直行 + hairline 分隔; 左大数字 / 中标签 / 右 icon。
- **S21 Tech Spec Sheet** — 左标题块 / 中 3 个 KPI hairline / 右变高柱 / 底数据。
- **S22 Image Hero** — 上 60% 全宽图 + 白色标题块覆盖; 下 40% 解释 + 3 列 KPI。

【设计细节 — 绝对铁律】
- **只用直角**: 全程 `border-radius: 0`。圆角 = 立刻违反。
- **1px hairline borders**, 黑色或 accent; 严禁阴影 / 渐变 / blur。
- **16 列网格**: `grid-template-columns: repeat(16, 1fr); gap: 0`。
- **字体**: Inter Tight (Latin display) / Inter (body) / Noto Sans SC (中文) / JetBrains Mono (数据); 严禁衬线、严禁装饰字体。
- **字号极端反差**: cover 用 9.6vw display, body 14-16px, label 11px uppercase letterspacing 0.08em。
- **键盘 ← / → 切换 + hash 同步**; 角标固定: `№N/N` 右下, topic 标签左下。
- **不许编造**: 数字必须来自用户输入, 图表柱高 = 真实数据按比例。
- 输出单文件 HTML, 不用任何外部图片 URL; 装饰几何 (ASCII 矩阵 / 同心圆) 用纯 CSS 或内联 SVG。

### `skills/poster-hero/SKILL.md`
_Vertical poster or Moments-style share image with strong visual impact._

【模板: 营销海报】
- 容器 `w-[1080px] h-[1920px] mx-auto`, 全屏渐变 / mesh 背景。
- 上部 30% 留白 + 一个大 emoji 或抽象几何图形。
- 中部主标题占视觉中心 (text-8xl, font-black), 一句话副标题。
- 下部信息卡片: 3-5 条核心要点用图标 + 短句。
- 底部右下角放品牌 / 二维码 (用 SVG 占位)。
- 使用大胆的色彩: 渐变背景 (from-violet-500 via-fuchsia-500 to-indigo-500 之类), 文字白色 + 1 个对比色高亮。
- 使用 SVG 做装饰性元素 (圆 / 三角 / 波浪 / 噪点纹理)。

### `skills/motion-design/SKILL.md`
_Apply motion craft to an active task: refine a brief, beat map, visual continuity, typography, pacing, and timeline implementation. Use when planning or improving motion graphics; the host task owns artifact creation, output format, and export._

#### Motion Design

Use this functional helper to refine the user's brief or work in progress with
one clear idea expressed through composition, transformation, rhythm, and appropriate sound unless the user requires silence. Apply the relevant craft guidance within the current task; this
skill is not a rendering template and does not create a project or choose an
output format. The Motion Design creation route owns those decisions. Quality
means viewers understand and remember the idea while wanting to watch it move.

##### Execution context

Follow the active host's task route, stage, capability, and delivery contract.
This skill supplies motion craft; it does not create tool access or change the
host's workflow. In OD Next, retain its Core, general orchestration, keyed
production-ready marker, and ship-on-write default. Plan in ordinary language;
author during production. Never emit Plan Contract or Runtime State blocks,
request protocol repair, or claim a host-frozen delivery contract. Only actual
user-requested video-motion production, when the host Core authorizes it,
permits the bounded video check below. For a video brief (a timed
film, promo, explainer or showreel), declare BOTH editable HTML source and MP4
as required deliverables. Rendering the MP4 is Build production and must finish
before delivery. For pointer/scroll-driven interaction or UI micro-animation,
deliver runnable HTML/code instead; do not flatten the requested interaction
into video. Never describe an unrendered video file as complete.

Where the active task's tools and scope permit visual iteration, examine the
opening, key transformation, transition,
text hold and ending at intended size, plus continuous playback. Correct the
largest observable defect, then revisit only affected moments. A runnable file
alone is not proof of successful motion. Distinguish what was observed from
what was only specified; never invent quality measurements.

##### Resolve the brief without stalling

Use the user's assets, references, script and previous decisions first. Resolve:
message and audience; destination/aspect; duration; exact copy; must-show assets;
visual direction; audio; and required output. Ask only when missing information
would change the story or make the result misleading. Otherwise choose a coherent
direction and state the meaningful assumption briefly. Do not impose three
style options or an approval round on a user who asked you to make the piece.

For an unconstrained short film, a useful starting point is 12–18 seconds,
16:9, 1920×1080, 30fps, no invented voiceover, and a replayable source. A portrait
social brief calls for 9:16. Existing brand, timing, platform and copy override
these defaults. Do not invent product claims, metrics, testimonials or assets.

Create a compact beat map as part of the existing plan, not a second document:
`time → viewer takeaway → focal object → transformation → copy/audio → exit`.
Time budget includes entrances, reading holds and exits. Choose a recurring
object, shape, line or typographic motif that connects the beats.

Example mechanism for a focus product (adapt, do not copy as a universal style):
scattered words orbit → one word attracts the others → orbit becomes a timer →
timer completes and becomes the wordmark. Each movement changes the meaning;
four unrelated title cards would lose the mechanism.

##### Art direction before adding movement

Resolve one strong representative frame in the composition before expanding
all scenes. Choose the actual hierarchy, crop, type, palette, texture and focal
object. A weak still will not be rescued by particles, camera shake or effects.
When planning-only, describe this frame; do not create an artifact early.

- Use a specific visual premise tied to the subject. "Premium", "cinematic"
  and "modern" alone are not art directions. Define what fills the frame,
  where attention rests, the material language and the contrast structure.
- Typography is a graphic object. Compose with scale, alignment, line breaks,
  negative space and font character. Choose fonts that cover the actual
  language; use tested fallbacks and wait for font readiness before capture.
- Prefer a small palette with intentional contrast. No default neon gradient,
  glass cards, glowing orb or beige background independent of the brief.
- Choose one material/world logic: editorial ink, precise instrument, folded
  paper, tactile collage, vector geometry, painterly field, or another justified
  system. Carry its lighting, edges and textures through the film.
- A scene may be asymmetric, full-bleed or sparse. Avoid repeatedly centering
  a headline above three cards. Keep subtitles and platform chrome out of the
  focal area; use destination-specific safe margins, not one universal ratio.
- Supplied product screens and logos retain their proportions and content.
  Crop deliberately rather than stretching. Keep data axes, units and values
  correct through their entire animation.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/motion-design/SKILL.md_

### `skills/copywriting/SKILL.md`
_Write and rewrite marketing copy for landing pages, homepages, and ads. Useful as a copy chief partner during launches._

#### copywriting

> Curated from Corey Haines.

##### What it does

Write and rewrite marketing copy for landing pages, homepages, and ads. Useful as a copy chief partner during launches.

##### Source

- Upstream: https://github.com/coreyhaines31/marketingskills
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
# Inspect the upstream README for exact paths
open https://github.com/coreyhaines31/marketingskills
```

Then ask the agent to invoke this skill by name (`copywriting`) or with
one of the trigger phrases listed in this skill's frontmatter.

### `skills/writing-guidelines/SKILL.md`
_Review docs/prose for Writing Guidelines compliance. Use when asked to "review my docs", "check writing style", "audit prose", "review docs voice and tone", or "check this page against the writing handbook"._

#### Writing Guidelines

Review files for compliance with Writing Guidelines.

##### How It Works

1. Load the pinned guidelines from [`references/guidelines.md`](references/guidelines.md) — this is the default, reproducible execution path
2. Optionally, fetch the latest guidelines from the upstream URL below and diff against the pinned snapshot to see if anything has changed
3. Read the specified files (or prompt user for files/pattern)
4. Check against all rules in the guidelines
5. Output findings in the terse `file:line` format

##### Guidelines Source

**Default (pinned):** The vendored copy at [`references/guidelines.md`](references/guidelines.md) is the default execution path. It is a pinned snapshot of the upstream guidelines and guarantees the skill produces reproducible results in any runtime environment.

**Upstream (live):** For users who want the very latest rules, the live source is available at:

```
https://raw.githubusercontent.com/vercel-labs/writing-guidelines/main/command.md
```

Fetching the live version is optional — the pinned snapshot is always the baseline.

##### Usage

When a user provides a file or pattern argument:
1. Load [`references/guidelines.md`](references/guidelines.md) as the default source
2. Optionally fetch the upstream URL to check for updates
3. Read the specified files
4. Apply all rules from the guidelines
5. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

### `skills/oil-motion/SKILL.md`
_处理视频和序列帧，编译滚动、指针、拖动与状态驱动的网页动效；内含本地媒体处理脚本和运行时。新素材生成使用宿主工具。_

##### Open Design 宿主约定

这是当前任务中的功能技能。保留用户选定的任务类型、品牌、技术栈、当前阶段和交付格式；不要因为 @ 选择而改成视频项目。规划阶段只规划，实现阶段才写代码。检查、渲染和导出仅在宿主当前阶段允许且工具真实可用时执行；技能不能额外开启独立 Agent、强制审批或绕过宿主交付边界。

附属文件相对当前技能包根目录读取，按当前问题选读，不把全部参考文档粘入提示词。不读取其他 Agent 的全局配置。素材优先用用户已有文件；需要新图片、视频或音频时使用当前宿主实际提供且用户允许的工具。缺少生成、测量或导出能力时说明具体缺口，交付可验证部分，不声称完成未执行的步骤。遵循当前任务的输出路径，不覆盖输入或历史产物。


#### Oil Motion

把用户的交互意图转换为可验收的动画素材、时间轴清单和网页运行时。AI 生成负责肢体、结构、材质、遮挡等语义变化；程序负责输入映射、播放控制、媒体处理和性能。

本适配包包含本地媒体处理脚本和网页控制器。运行 Python 脚本前检查 Python 3.10+、支持 `-fps_mode` 的 FFmpeg / ffprobe、Pillow、NumPy、PyYAML；缺少依赖时仅在任务隔离环境中按 `scripts/requirements.txt` 安装，不修改全局环境。纯本地处理不需要 API Key。

运行参考命令前，将 `OIL_MOTION` 设为本次实际加载的技能目录：

```bash
OIL_MOTION="<本次 SKILL.md 所在绝对目录>"
```

图片／视频生成交给宿主已有工具。此包不包含上游的生成服务、Keychain 或凭据配置页面；不要尝试调用它们。

##### 四个唯一事实源

每项信息只保存在一个位置，其他文件引用它，不复制：

1. `source/concept-contract.yaml`：用户明确要求的对象、视觉、交互和连续性。
2. `source/motion-brief.yaml`：由合同派生的关键帧、片段和生产计划。
3. `build/timeline.json`：成片的实际帧率、段落边界、停帧和播放曲线。
4. `build/motion-budget.json`：交付格式与运行时控制器的自动选择结果。

##### 主流程

###### 1. 锁定用户意图

用户只有模糊目标时，先读 [references/concepts.md](references/concepts.md)，给出最多三个真正不同的方向；要求已经明确时直接写 Concept Contract。

需要外部案例启发时，按表达目的选读 [references/motion-patterns.md](references/motion-patterns.md)。先分清哪些变化属于素材本身、哪些只是容器编排或 UI 状态，只有前者进入生成流程。

```yaml
subject_count: <number>
subjects:
  - identity: <可验证的身份或外观锚点>
style: <用户原词>
motion_intent: <动作及视觉结果>
background_owner: video | page
scene: <背景属于视频时的场景、镜头和光线要求>
driver: scroll | pointer | drag | touch | orientation | audio | data | state | time
input_semantics: continuous | step | event
time_control: scrub | segment-play | autonomous
navigation: continuous | paged | none
clip_continuity: chain | independent
continuity: [<必须保持不变或连续的内容>]
aspect_ratio: 16:9 | 9:16 | 1:1 | 21:9 | custom
destination: <页面位置、最大显示尺寸和目标设备>
```

判断规则：

- `aspect_ratio` 取自 `destination` 的真实容器：横向全屏或 Hero 通常是 `16:9`，竖屏全屏是 `9:16`，卡片、头像等方形视窗是 `1:1`；不要未经确认就默认 `1:1`。容器比例与生成比例不一致时，在合同中写明裁切或补边策略。锁定后关键帧尺寸、视频画幅和编译输出都沿用同一比例，尺寸对照见 [references/prompting.md](references/prompting.md)。
- `scrub`：输入值与时间轴位置持续对应，输入停止时画面停在当前位置。
- `segment-play`：输入选择下一状态，片段随后按时间播放；反向输入应从当前画面撤回，不得换源硬切。
- `autonomous`：动画由时间推进，交互只负责开始、暂停或切换状态。
- `navigation` 只描述页面如何移动，不决定视频如何播放；分页页面也可以使用连续时间轴。
- 镜头、环境光、接触阴影、景深或背景连续性重要时使用 `background_owner: video`。只有主体必须透明复用在页面背景上时使用 `page`。
- 用户已说清的内容直接记录，不改写、不扩写。缺项会改变可生成性、可验收结果或生产路线时，必须先补齐。

###### 2. 建立生产计划

Motion Brief 只保存派生计划，不复制合同字段：

```yaml
concept_contract: source/concept-contract.yaml
identity_bible: source/identity-bible.md | null
parameter_space: linear | circular | 2d | discrete
media_access: sequential | random
gesture_policy:
  unit: continuous | one-gesture-one-step
  inertia: coalesce | preserve
  while_active: retarget | queue | ignore
  boundary: clamp | loop
  programmatic_navigation: ignore | observe
storyboard: <有序视觉阶段>
keyframes: <K0…Kn>
clip_chain: <每段使用的相邻关键帧>
rest_state: <初始及失去输入时的状态>
loop: open | closed | none
anchor: fixed-body | center | bottom | free
scene_continuity: <仅背景属于视频时填写>
frame_policy: native | interpolate
target_fps: <由源素材和运行时需求决定>
quality_target: <分辨率、DPR 和文件预算>
pixel_dimensions: <宽x高，由合同的 aspect_ratio 与 DPR 派生>
reduced_motion: <静态替代状态>
```

`parameter_space` 描述素材时间轴，不描述页面布局：`linear` 是有起止的时间轴，`circular` 是闭环，`2d` 是二维采样，`discrete` 是互不连续的状态。不要把二维或无序状态压成一条线性视频。

`frame_policy` 与 `target_fps` 的取舍标准见 [references/optimization.md](references/optimization.md)。

整组位移、缩放、旋转、裁切和时间映射由程序完成；关节、结构、材质、接触和遮挡变化由生成模型完成。如果只移动整张图不能保持自然，就生成完整动作，不继续叠加 CSS 补丁。

###### 3. 自动选择交付与运行时

在宿主允许运行工具的阶段，用 Brief 中的计划帧数、显示尺寸和参数空间运行 `motion_budget.py --strict`，显式传入合同中的 `background_owner` 和 `time_control`，保存 `build/motion-budget.json`。Pilot 按这个结果挂载到真实页面；之后帧数或尺寸变化就重新预算。脚本分别返回：

- `delivery.selected`：`baked-video | chroma-video | alpha-atlas`。
- `runtime.controller`：`frame-scrub | segment-playback | autonomous-playback`。

格式选择与播放方式是两件事，不得互相推断。命令和决策顺序见 [references/delivery-selection.md](references/delivery-selection.md)。按结果只读取一条媒体路线：

- `alpha-atlas`：[references/alpha-atlas.md](references/alpha-atlas.md)
- `chroma-video`：[references/chroma-video.md](references/chroma-video.md)
- `baked-video`：[references/baked-video.md](references/baked-video.md)

###### 4. 制作关键帧

1. 有角色或需要身份一致时，先写 Identity Bible。
2. 生成并验收 `K0…Kn`；每段只承担一个主要语义变化，片段 `i` 使用 `Ki → Ki+1`。`clip_continuity: chain` 时，第 2 段起的首帧改用上一段验收后的实际尾帧，尾帧仍是计划关键帧。
3. 用宿主可用图片工具生成关键帧：按 `aspect_ratio` 传尺寸，并核对脚本报告的实际宽高比；尺寸至少覆盖最大 CSS 尺寸乘目标 DPR。真实产品、既定角色或上一张关键帧用 `--image` 作为参考输入，不只凭文字描述。
4. `background_owner: page` 请求透明输出，并实际检查 Alpha 通道；不得先生成色底再反向抠图。视频模型需要色键输入时，由 `composite_alpha_keyframe.py` 从透明源合成副本。`background_owner: video` 使用不透明场景输出，场景直接画进关键帧。
5. 命令、尺寸对照、提示词、首尾帧模式和提交方式见 [references/prompting.md](references/prompting.md)。宿主自带的图片工具同样能输出真实 Alpha 并接受参考图时也可以使用，验收标准不变。已有视频或序列帧时跳过生成，保留原始素材并从分析开始。

###### 5. 先做 Pilot

批量生成前，只完成第一组关键帧、第一段视频，并按已选路线挂载到真实页面。按 [references/qa.md](references/qa.md) 通过 Pilot 硬门后才能量产；失败就修正上游，不在运行时掩盖。

###### 6. 生成并逐段验收

按 [references/prompting.md](references/prompting.md) 生成母版，按 [references/qa.md](references/qa.md) 验收内容与连续帧链。`chain` 模式必须同时验证生成输入接力和相邻成片解码后的输出接缝；任一失败都停止后续生产。

###### 7. 帧准备、清理与编译时间轴

按 [references/optimization.md](references/optimization.md) 执行 `frame_policy`（插帧出现重影或伪影时退回 `native` 或重新生成），再按已选媒体路线清理和编译。所有裁剪和拼接都要检查新产生的相邻帧；不得用一次远距离跳帧替代缓慢尾部变化。

编译后生成 `build/timeline.json`，字段语义只以 [references/runtime.md](references/runtime.md) 的时间轴规范为准。时间值必须由最终编译结果生成，不手工抄写。

###### 8. 接入运行时

从 [assets/interactive-motion.ts](assets/interactive-motion.ts) 的对应控制器开始实现（`frame-scrub` 管理随动与最短环形距离，`segment-playback` 管理分段与反向）；分步手势使用 [assets/step-gesture.ts](assets/step-gesture.ts)。输入映射、分段播放、反向、取消、预加载和降级只以 [references/runtime.md](references/runtime.md) 为准。

###### 9. 最终验收

按 [references/qa.md](references/qa.md) 在目标 CSS 尺寸、DPR、冷缓存、快速反向、移动端和资源失败条件下验收。页面导航、时间控制、媒体格式和连续性分别检查，不用一种检查代替另一种。

需要动画原理展示页时，读 [references/explainer.md](references/explainer.md) 并使用 `create_explainer.py`。

##### 交付

保留 `source/`、`pilot/`、`build/`、`qa/` 和 `final/`。`final/` 只包含选中的主资源、静态降级和运行时入口；同时按宿主交付契约附上四个事实源及可复现的处理命令。



_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/oil-motion/SKILL.md_

### `skills/video-hyperframes/SKILL.md`
_Hyperframes / Remotion-compatible continuous frame animation with autoplay support._

【模板: Hyperframes 视频帧】
- 输出 N 个连续 `<section class="frame">`, 每个 `w-[1920px] h-[1080px]`; N 由【用户内容】信息密度决定 (短脚本 6-10 帧起步, 长脚本应更多, 每帧只承载一个镜头/概念)。
- 每帧表达一个镜头/概念: 文字 + 视觉构图 (中央构图 / 黄金分割 / 三分法)。
- 每帧底部隐藏标记 `<!-- frame:N duration:3000 transition:fade -->` 供后续 Remotion / Hyperframes 渲染脚本读取。
- 顶部加一段 JavaScript 自动播放: 每 3 秒切换到下一帧, 也支持点击 / 方向键控制; 角落显示进度条。
- 第 1 帧是 hook (一个数据 / 一个反常识 / 一个问题), 第 2-N 是论证, 最后是结论 + CTA。
- 字号巨大 (text-9xl), 一句话即可, 不要堆砌。
- 配色统一一套电影感 (深色背景 + 1 个霓虹强调色)。
- 输出最后包含一段简短注释 `<!-- HYPERFRAMES_META: ... -->`, 包含每帧 duration / transition / sceneSummary 的 JSON 元数据, 用于后续转 Remotion。

## Appendix D — Other skills (condensed)

### `skills/8-bit-orbit-video-template/SKILL.md`
_Hyperframes-based video template for retro pixel deck motion design. Use when users want a high-fidelity, multi-scene HTML-to-video composition with advanced transitions, interactive preview controls, and ready-to-render default style._

#### Hyperframes Video Template

Ship a premium template-mode Hyperframes composition with a ready default showcase and deterministic timeline behavior.

##### Resource map

```text
8-bit-orbit-video-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```

The rendered MP4 showcase used by `example.html` is hosted at
`https://repo-assets.open-design.ai/resources/videos/skills/8-bit-orbit-video-template/default-showcase.mp4`.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/8-bit-orbit-video-template/SKILL.md_

### `skills/ad-creative/SKILL.md`
_Generate and iterate ad creative including headlines, descriptions, and primary text. Useful for paid social and search ad iteration._

#### ad-creative

> Curated from Corey Haines.

##### What it does

Generate and iterate ad creative including headlines, descriptions, and primary text. Useful for paid social and search ad iteration.

##### Source

- Upstream: https://github.com/coreyhaines31/marketingskills
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ad-creative/SKILL.md_

### `skills/after-hours-editorial-template/SKILL.md`
_Luxury dark-editorial HyperFrames template for three-page cinematic storyboards, inspired by haute couture title cards and magazine chapter spreads. Use when the user asks for premium fashion-style motion pages, moody serif-led storytelling, or a high-end dark presentation aesthetic with rich transitions._

#### After Hours Editorial Template

Produce a self-contained HTML editorial motion artifact in a dark luxury style,
with three short pages, cinematic typography, and premium transition language.

##### Resource map

```text
after-hours-editorial-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/after-hours-editorial-template/SKILL.md_

### `skills/agent-browser/SKILL.md`
_Browser automation CLI for AI agents. Use when the user needs to inspect, test, or automate browser behavior: navigating pages, filling forms, clicking buttons, taking screenshots, extracting page data, reading selected OpenDesign browser-tab context, testing web apps, dogfooding OpenDesign previews, QA, bug hunts, or reviewing app quality. Prefer local OpenDesign preview URLs unless the user explicitly asks for external browsing._

#### Agent Browser

Use `agent-browser` for local OpenDesign preview validation: inspect rendered
state, click/type when requested, and capture one screenshot when visual evidence
matters. Keep the browser local-first unless the user explicitly asks for
external browsing.

When the run prompt contains selected workspace context, prefer the selected
`browser` tab URL/title as the target. Treat user phrases like "this page",
"the current browser", "right-side tab", "extract the logo", "get the palette",
"take an element screenshot", or "check OG/a11y" as requests about that selected
tab unless the user names another target.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/agent-browser/SKILL.md_

### `skills/ai-music-album/SKILL.md`
_Full-lifecycle AI music album production — concept, lyric drafting, track sequencing, and export. Useful for indie album experiments and brand soundtracks._

#### ai-music-album

> Curated from bitwize-music-studio.

##### What it does

Full-lifecycle AI music album production — concept, lyric drafting, track sequencing, and export. Useful for indie album experiments and brand soundtracks.

##### Source

- Upstream: https://github.com/bitwize-music-studio/claude-ai-music-skills
- Category: `audio-music`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ai-music-album/SKILL.md_

### `skills/algorithmic-art/SKILL.md`
_Create generative art using p5.js with seeded randomness so every render is reproducible. Useful for procedural posters, motion-style stills, and artistic frame studies._

#### algorithmic-art

> Curated from Anthropic's official skills repository.

##### What it does

Create generative art using p5.js with seeded randomness so every render is reproducible. Useful for procedural posters, motion-style stills, and artistic frame studies.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/algorithmic-art
- Category: `image-generation`


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/algorithmic-art/SKILL.md_

### `skills/animate/SKILL.md`
_Implement purposeful interface animations: easing, springs, interruption, exits, and reduced motion. Use on existing components or an accepted UI brief; this is not a video template._

#### Building Animations

##### Open Design execution context

Use this as a functional helper on the user's current interface or accepted
brief. Keep the host's task route, current stage, tool availability, and output
contract. Planning describes the motion; implementation happens only in the
host's authoring stage. Do not add an extra review, recording, rendering, or
approval phase when the host disallows it. Reuse the project's existing stack
and motion tokens. Companion skills are optional: use them only if installed;
otherwise apply the relevant guidance here without inventing a tool invocation.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/animate/SKILL.md_

### `skills/apple-hig/SKILL.md`
_Apple Human Interface Guidelines as 14 agent skills covering platforms, foundations, components, patterns, inputs, and technologies for iOS, macOS, visionOS, watchOS, and tvOS._

#### apple-hig

> Curated from raintree-technology.

##### What it does

Apple Human Interface Guidelines as 14 agent skills covering platforms, foundations, components, patterns, inputs, and technologies for iOS, macOS, visionOS, watchOS, and tvOS.

##### Source

- Upstream: https://github.com/raintree-technology/apple-hig-skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/apple-hig/SKILL.md_

### `skills/article-magazine/SKILL.md`
_Huashu / huashu-md-html-inspired magazine article layout for turning Markdown or notes into a polished long-form HTML essay._

【模板: 杂志文章】
- 顶部 hero: 大标题 (text-5xl/6xl) + 可选副标题 + 作者 / 阅读时间 / 日期元数据。
- 正文: 单栏, 最大宽度约 700px, 居中。段落 `text-lg leading-relaxed text-neutral-700 dark:text-neutral-300`。
- H2 / H3 标题用 serif 字体, 让正文与标题有视觉对比。
- 引用块使用左侧粗 accent 色边线 + 斜体。
- 代码块: 圆角 + 深色背景 + 浅色文字, 显示语言标签。
- 列表项使用自定义 bullet（小方块 / accent 圆点）。
- 章节之间用 `<hr>` 分隔, 但样式做成中央居中的小 ornament。
- 文末加一个简单的 "如果觉得有用，欢迎转发" 行动卡片。

### `skills/artifacts-builder/SKILL.md`
_Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui)._

#### artifacts-builder

> Curated from ComposioHQ awesome-claude-skills.

##### What it does

Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui).

##### Source

- Upstream: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/artifacts-builder
- Category: `web-artifacts`


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/artifacts-builder/SKILL.md_

### `skills/brainstorming/SKILL.md`
_Transform rough ideas into fully-formed designs through structured questioning and alternative exploration. Useful early in concept work._

#### brainstorming

> Curated from @obra.

##### What it does

Transform rough ideas into fully-formed designs through structured questioning and alternative exploration. Useful early in concept work.

##### Source

- Upstream: https://github.com/obra/superpowers
- Category: `creative-direction`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/brainstorming/SKILL.md_

### `skills/brand-guidelines/SKILL.md`
_Apply Anthropic's official brand colors and typography to artifacts for consistent visual identity and professional design standards. A reference for shaping your own._

#### brand-guidelines

> Curated from Anthropic's official skills repository.

##### What it does

Apply Anthropic's official brand colors and typography to artifacts for consistent visual identity and professional design standards. A reference for shaping your own.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/brand-guidelines
- Category: `design-systems`


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/brand-guidelines/SKILL.md_

### `skills/brandkit/SKILL.md`
_Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. Trained for minimalist, cinematic, editorial, dark-tech, luxury, cultural, security, gaming, developer-tool, and consumer-app brand systems. Optimized for intentional logo concepting, refined composition, sparse typography, strong symbolic meaning, premium mockups, art-directed imagery, and flexible grid layouts._

#### BRANDKIT IMAGE GENERATION SKILL

You are an elite brand identity art director, logo designer, visual-system strategist, and presentation designer.

Your job is to generate premium brand-kit images that feel like they came from a serious identity studio.

The output must feel:
- intentional
- premium
- minimal
- coherent
- strategic
- visually expensive
- brand-system driven
- presentation-ready

Do not generate generic logos.
Do not generate random mockups.
Do not generate messy AI moodboards.

Create a complete brand world in one image.

---


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/brandkit/SKILL.md_

### `skills/brutalist-skill/SKILL.md`
_Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites that need to feel like declassified blueprints._

#### SKILL: Industrial Brutalism & Tactical Telemetry UI

##### 1. Skill Meta
**Name:** Industrial Brutalism & Tactical Telemetry Interface Engineering

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/brutalist-skill/SKILL.md_

### `skills/canvas-design/SKILL.md`
_Create beautiful visual art in PNG and PDF documents using design philosophy and aesthetic principles for posters, illustrations, and static pieces._

#### canvas-design

> Curated from Anthropic's official skills repository.

##### What it does

Create beautiful visual art in PNG and PDF documents using design philosophy and aesthetic principles for posters, illustrations, and static pieces.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/canvas-design
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/canvas-design/SKILL.md_

### `skills/card-twitter/SKILL.md`
_Twitter quote or data card designed to pair with a post._

【模板: Twitter 分享卡】
- 容器 `w-[1600px] h-[900px]`, 暗色 / 亮色二选一根据内容情绪。
- 中央一句 hero 金句 (text-6xl, font-semibold, 限 2-3 行)。
- 下方作者署名 + 头像占位 + handle。
- 左上角小标签 (类型: "Insight" / "Data" / "Quote")。
- 右下角品牌水印。
- 整张卡片有微妙的纹理 (grid 网格 / noise / dot pattern)。
- 截图后可直接配推文发出, 视觉简洁有力。

### `skills/card-xiaohongshu/SKILL.md`
_Xiaohongshu-style knowledge cards, arranged as a swipeable multi-card carousel._

【模板: 小红书图文卡片】
- 输出 N 张连续卡片, 每张 `w-[1080px] h-[1440px]`, 用 flex 纵向排列方便整体截图也方便单张截图。N 由【用户内容】信息量决定: 短内容 3-6 张起步, 长内容应更多 (小红书平台单帖最多 18 图, 通常 9 张以内最佳); 一张卡只承载一个核心观点。
- 第一张是封面: 巨大的标题 + 1 行副标题 + 一个吸引人的标签 (类似 "干货预警" / "建议收藏")。
- 中间几张展开正文, 每张一个核心观点, 配 emoji + 短句 + 1-2 个例子。
- 最后一张是总结 + 行动号召 (关注 / 收藏 / 评论)。
- 配色: 选择柔和的莫兰迪色或粉色系; 元素圆润, 大量留白。
- 字号大、行距宽、对比强（小红书在手机上看, 小字根本看不清）。
- 每张卡片右下角小水印 (作者名 / 日期)。

### `skills/chat-motion-overlay/SKILL.md`
_Generate configurable chat motion overlays from a transcript or screenshot, including plain bubble scenes, app-style chat containers, optional device frames, preset or uploaded avatars, nickname display rules, and transparent-video-ready Remotion bundles. Use when Codex needs to create reusable short-form chat clips for Douyin, demo videos, story reenactments, social-message proof scenes, or embeddable alpha overlays for Hyperframe and Remotion workflows._

#### Chat Motion Overlay

Turn chat content into a configurable motion overlay clip instead of a single hard-coded WeChat mock.

##### Workflow

1. Normalize the chat input.
   - If the user gives a screenshot, extract the visible messages into the transcript format in `references/input-format.md`.
   - If the user gives plain text, keep one message per beat and preserve exact wording when authenticity matters.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/chat-motion-overlay/SKILL.md_

### `skills/color-expert/SKILL.md`
_Color science expert skill with 286K words of reference material covering OKLCH/OKLAB, palette generation, accessibility/contrast, color naming, pigment mixing, and historical color theory._

#### color-expert

> Curated from @meodai.

##### What it does

Color science expert skill with 286K words of reference material covering OKLCH/OKLAB, palette generation, accessibility/contrast, color naming, pigment mixing, and historical color theory.

##### Source

- Upstream: https://github.com/meodai/skill.color-expert
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/color-expert/SKILL.md_

### `skills/competitive-ads-extractor/SKILL.md`
_Extract and analyze competitors' ads from ad libraries to understand messaging and creative approaches that resonate._

#### competitive-ads-extractor

> Curated from ComposioHQ awesome-claude-skills.

##### What it does

Extract and analyze competitors' ads from ad libraries to understand messaging and creative approaches that resonate.

##### Source

- Upstream: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/competitive-ads-extractor
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/competitive-ads-extractor/SKILL.md_

### `skills/d3-visualization/SKILL.md`
_Teaches the agent to produce D3 charts and interactive data visualizations. A comprehensive D3.js skill with examples across chart types and techniques giving the agent expert-level knowledge to generate complex, interactive visualizations. Useful for editorial dashboards, reports, data-rich prototypes, and explanatory graphics._

#### d3-visualization

> Curated from @jiannanya.

##### What it does

Teaches the agent to produce D3 charts and interactive data visualizations. A comprehensive D3.js skill with examples across chart types and techniques giving the agent expert-level knowledge to generate complex, interactive visualizations. Useful for editorial dashboards, reports, data-rich prototypes, and explanatory graphics.

##### Source

- Upstream: https://github.com/jiannanya/snow-d3/
- Category: `diagrams`


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/d3-visualization/SKILL.md_

### `skills/data-report/SKILL.md`
_Turns CSV, Excel, or JSON data into a polished visual report page._

【模板: 数据可视化报告】
- 头部: 报告标题 + 时间区间 + 数据来源说明。
- KPI 卡片网格: 3-5 个最重要指标, 每个卡片显示数值 + 同比变化 + 微型趋势线。
- 主图表区: 至少 2 个图表 (柱状 / 折线 / 饼 / 散点), 使用 Chart.js 或 ECharts (jsdelivr CDN 引入), 数据从用户输入解析得到。
- **图表容器必须有固定高度**: 每个 `<canvas>` 外层包一个 `<div style="position:relative;height:NNNpx">` (KPI 迷你图 ~40px, 主图表 ~240–280px)。Chart.js 用 `responsive:true, maintainAspectRatio:false` 时若父容器没有显式高度, 会陷入 ResizeObserver 死循环, 图表无限增高直至卡死浏览器。**绝对不要**直接给 canvas 写 `height=` 属性当布局, 那个只是初始值。
- 数据表格: 用户原始数据节选, 使用 `<table>` + 现代化样式 (zebra stripe, hover, sticky header)。
- 洞察块: 3-5 条文字洞察, 用 emoji 开头, 像产品周报。
- 底部"方法论"折叠区。
- 配色克制专业: 主色 1 + 中性色阶, 图表用调色板。
- **必须解析用户提供的实际数据**, 不要捏造。

### `skills/deck-guizang-editorial/SKILL.md`
_Editorial magazine meets e-ink: 10 layouts and 5 palettes (Ink, Indigo Porcelain, Forest Ink, Kraft Paper, Dune)._

【模板: 归藏编辑墨水 Deck (Editorial × E-Ink)】
【意图】叙事、观点、分享、个人风格表达。墨纸印刷感, 不要科技感。Inspired by op7418/guizang-ppt-skill Style A。

【调色板 — 5 选 1, 严禁改 hex、严禁混用】
- 🖋 **墨水经典 Monocle** — ink `#0a0a0b`, paper `#f1efea`, paper-tint `#e8e5de`, ink-tint `#18181a`. 默认 / 通用商业 / 科技。
- 🌊 **靛蓝瓷 Indigo Porcelain** — ink `#0a1f3d`, paper `#f1f3f5`, paper-tint `#e4e8ec`, ink-tint `#152a4a`. 科技 / 研究 / 数据。
- 🌿 **森林墨 Forest Ink** — ink `#1a2e1f`, paper `#f5f1e8`, paper-tint `#ece7da`, ink-tint `#253d2c`. 自然 / 可持续 / 文化。
- 🍂 **牛皮纸 Kraft Paper** — ink `#2a1e13`, paper `#eedfc7`, paper-tint `#e0d0b6`, ink-tint `#3a2a1d`. 怀旧 / 人文 / 文学。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/deck-guizang-editorial/SKILL.md_

### `skills/deck-open-slide-canvas/SKILL.md`
_Locked 1920x1080 canvas deck with React component-level free composition, not bound to a fixed template._

【模板: 1920 画布自由 Deck】
【意图】不想被模板束缚的场景 (个人作品集、奇特演讲、艺术 / 设计课 deck)。给一个固定 1920×1080 画布 + 极强的类型 / 调色约束, 让 agent 像写 React 组件一样按内容自由排布每一页。Inspired by 1weiho/open-slide。

【硬性技术规格】
- 画布: 每页严格 `width: 1920px; height: 1080px;` 用 `transform: scale(...)` 适配视窗 (默认 `scale(0.7)` 居中)。
- **绝对禁止 overflow**: 每页内容必须 fit in 1920×1080, 不许滚动条出现。
- 字号 type scale (px): `2xs:18 · xs:22 · sm:28 · md:36 · lg:48 · xl:64 · 2xl:88 · 3xl:120 · 4xl:160 · 5xl:220`。
- 边距 padding: 96 / 128 / 160 三档之一。
- 每页有 `<section class="slide" data-slide-id="<n>">`。

【调色板 — 每个 deck 选 1 套, 全程不改】
- 🌫 **Ash & Lime** — bg `#f1efea`, ink `#161616`, accent `#c5e803`。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/deck-open-slide-canvas/SKILL.md_

### `skills/design-consultation/SKILL.md`
_Build a complete design system from scratch with creative risks and realistic product mockups. Useful for kickoff workshops and brand-from-zero work._

#### design-consultation

> Curated from Garry Tan (gstack).

##### What it does

Build a complete design system from scratch with creative risks and realistic product mockups. Useful for kickoff workshops and brand-from-zero work.

##### Source

- Upstream: https://github.com/garrytan/gstack
- Category: `creative-direction`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/design-consultation/SKILL.md_

### `skills/digits-fintech-swiss-template/SKILL.md`
_Swiss-grid fintech deck template in black / warm paper / neon-lime contrast. Use when users ask for premium data-story slides with strict modular layout, bold numeric cards, restrained motion, and keyboard/click navigation in one HTML file._

#### Digits Fintech Swiss Template

A premium three-slide live-artifact template for data-storytelling in a Swiss grid language.

##### Resource map

```text
digits-fintech-swiss-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```

##### Workflow

1. Start from `assets/template.html` and keep the three-slide structure intact.
2. Replace copy and metric values while preserving card hierarchy and reading order.
3. Keep interactions:
   - Prev / Next buttons
   - keyboard navigation (`ArrowLeft` / `ArrowRight`)
   - dot navigation
4. Keep motion subtle (slide fade + tiny hover lift only).

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/digits-fintech-swiss-template/SKILL.md_

### `skills/doc-kami-parchment/SKILL.md`
_Warm parchment canvas (#f5f4ed), monochrome ink-blue accent (#1B365D), one serif family, and editorial-grade typography._

【模板: Kami 羊皮纸文档】
【意图】严肃排版文档: one-pager / 长报告 / 信函 / 简历 / 财报 / changelog / portfolio。Inspired by tw93/kami。强调"写得像被排过版的纸", 不是 dashboard, 不是网页。

【硬性视觉签名 — 不许改】
- **画布**: 暖羊皮纸 `#f5f4ed` (永远不用纯白 `#fff`)。次级背景 `#efeee5`。
- **墨色**: 主文字 `#1f1d18` (近黑暖灰, 不用纯黑 `#000`)。次文字 `#6b665b`。
- **唯一色彩**: 墨蓝 `#1B365D` ——所有 accent (链接、tag 描边、重点数字、引用左 rule) 只能用这一个色, 严禁多色。
- **字体**: 一种语言一种衬线, 全文不混用:
  - 英文: `Charter` (fallback: `Source Serif Pro`, `Iowan Old Style`)
  - 中文: `TsangerJinKai02 W04` (fallback: `Noto Serif SC`)
  - 日文: `YuMincho` (fallback: `Noto Serif JP`)
  - Body 400, Heading 500 (不要 700/800/900)。
- **行高**: 标题 1.1–1.3, 紧凑正文 1.4–1.45, 阅读型正文 1.5–1.55。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/doc-kami-parchment/SKILL.md_

### `skills/doc/SKILL.md`
_Read, create, and edit .docx documents with formatting and layout fidelity via OpenAI's document skill._

#### doc

> Curated from OpenAI's skills repository.

##### What it does

Read, create, and edit .docx documents with formatting and layout fidelity via OpenAI's document skill.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `documents`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/doc/SKILL.md_

### `skills/docx/SKILL.md`
_Create, edit, and analyze Word documents with tracked changes, comments, and formatting. Useful for design briefs, copy docs, and review-ready deliverables._

#### docx

> Curated from Anthropic's official skills repository.

##### What it does

Create, edit, and analyze Word documents with tracked changes, comments, and formatting. Useful for design briefs, copy docs, and review-ready deliverables.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/docx
- Category: `documents`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/docx/SKILL.md_

### `skills/domain-name-brainstormer/SKILL.md`
_Generate creative domain name ideas and check availability across multiple TLDs including .com, .io, .dev, and .ai._

#### domain-name-brainstormer

> Curated from ComposioHQ awesome-claude-skills.

##### What it does

Generate creative domain name ideas and check availability across multiple TLDs including .com, .io, .dev, and .ai.

##### Source

- Upstream: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/domain-name-brainstormer
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/domain-name-brainstormer/SKILL.md_

### `skills/ecommerce-image-workflow/SKILL.md`
_Reference-product ecommerce image workflow for generating a compact set of product-faithful main, feature, and lifestyle images from real product reference photos. V1 requires uploaded product imagery and intentionally defers brief-only concept generation and platform-specific batch exports._

#### Ecommerce Image Workflow

Create a compact ecommerce image set from real product reference imagery.
This V1 skill is intentionally narrow: it supports **reference-product mode
only**. If the user only describes a product and does not provide a product
photo, ask for one and stop. Do not create a brief-only concept product in
this version.

##### Resource map

```text
ecommerce-image-workflow/
|-- SKILL.md
|-- example.html
`-- references/
    `-- checklist.md
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ecommerce-image-workflow/SKILL.md_

### `skills/editorial-burgundy-principles-template/SKILL.md`
_Editorial studio deck template in burgundy / blush / muted-gold palette. Use when users ask for premium manifesto or culture slides with pill tags, large typographic statements, principle cards, and guided keyboard/click navigation._

#### Editorial Burgundy Principles Template

A three-slide editorial deck for culture narratives, strategy storytelling, and internal manifestos.

##### Resource map

```text
editorial-burgundy-principles-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```

##### Workflow

1. Start from `assets/template.html`.
2. Keep the 3-slide sequence:
   - numeric headline
   - studio tags + title lockup
   - eight-principles card grid
3. Replace copy while preserving card and tag hierarchy.
4. Keep interactions:
   - Prev / Next buttons
   - dot navigation

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/editorial-burgundy-principles-template/SKILL.md_

### `skills/emil-design-eng/SKILL.md`
_This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great._

#### Design Engineering

##### Initial Response

When this skill is first invoked without a specific question, respond only with:

> I'm ready to help you build interfaces that feel right, my knowledge comes from Emil Kowalski's design engineering philosophy. If you want to dive even deeper, check out Emil’s course: [animations.dev](https://animations.dev/).

Do not provide any other information until the user asks a question.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/emil-design-eng/SKILL.md_

### `skills/emilkowalski-motion/SKILL.md`
_Motion-design follow-up skill inspired by Emil Kowalski's animation guidance. Use after an interface exists to add tasteful micro-interactions, state transitions, and page motion with product-grade restraint._

#### Emil Kowalski Motion Follow-Up

Use this skill after a design artifact already exists. The goal is to make the interface feel alive without turning it into a motion demo.

##### Workflow

1. Inspect the current HTML, component, or selected page element before adding animation.
2. Pick the smallest set of motion moments that clarify state or hierarchy:
   - entry reveal for the primary content
   - hover / active feedback for important controls
   - transition between UI states
   - scroll reveal only when it helps the story
3. Prefer `transform` and `opacity`. Avoid animating layout properties such as `top`, `left`, `width`, or `height`.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/emilkowalski-motion/SKILL.md_

### `skills/enhance-prompt/SKILL.md`
_Improve prompts with design specs and UI/UX vocabulary. Useful for design-to-code workflows and clarifying requests for visual output._

#### enhance-prompt

> Curated from Google Labs (Stitch).

##### What it does

Improve prompts with design specs and UI/UX vocabulary. Useful for design-to-code workflows and clarifying requests for visual output.

##### Source

- Upstream: https://github.com/google-labs-code/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/enhance-prompt/SKILL.md_

### `skills/export-download-debugging/SKILL.md`
_Diagnose and fix browser, preview, or Electron export/download failures, especially image export issues involving Save As, Blob/Data URLs, the File System Access API, createWritable failures, and 0 KB files._

#### Export Download Debugging

Use this when an export or download appears to run but produces an empty,
missing, or unusable file. It is tuned for browser previews, iframe capture,
and Electron shells.

##### Core rule

Separate capture from save. Prove the export payload has non-zero bytes before
debugging the destination path. A 0 KB file often means the native picker or
host created the target file, then the write failed or was blocked.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/export-download-debugging/SKILL.md_

### `skills/faq-page/SKILL.md`
_A Frequently Asked Questions (FAQ) page with collapsible accordion sections, search functionality, and category filtering. Use when the brief asks for "FAQ", "help center", "questions", or "support page"._

#### FAQ Page Skill

Produce a single FAQ page with collapsible accordion sections, search, and category filtering.

##### Workflow

1. **Read the active DESIGN.md** (injected above). Use the component tokens for
   interactive elements (accordion headers, search input, category pills).
2. **Pick the domain** from the brief (e.g., SaaS product, e-commerce, service)
   and write 12–18 real FAQ entries across 3–4 categories.
   - **Edge cases**:
     - If the brief provides fewer than 8 FAQs, ask for more content or generate
       realistic questions based on the domain.
     - For 1–5 FAQs, skip categories and search; show a simple list.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/faq-page/SKILL.md_

### `skills/field-notes-editorial-template/SKILL.md`
_Editorial "Field Notes" report template with soft paper background, serif hero typography, rounded pastel insight cards, and a retention chart panel. Use when users ask for a premium magazine-style business report, board memo one-pager, or elegant data storytelling layout._

#### Field Notes Editorial Template

Produce a premium editorial data report in a single self-contained HTML file.

##### Resource map

```text
field-notes-editorial-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```

##### Workflow

1. Read active `DESIGN.md` and map palette/typography to root CSS variables.
2. Copy `assets/template.html` to `index.html` as the working artifact.
3. Keep the editorial frame language:
   - paper-like background and subtle vignette
   - serif display headlines plus clean sans-serif body copy
   - rounded pastel metric / insight cards

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/field-notes-editorial-template/SKILL.md_

### `skills/flutter-animating-apps/SKILL.md`
_Implement animated effects, transitions, and motion in Flutter apps. Useful for native iOS/Android motion design._

#### flutter-animating-apps

> Curated from the Flutter team.

##### What it does

Implement animated effects, transitions, and motion in Flutter apps. Useful for native iOS/Android motion design.

##### Source

- Upstream: https://github.com/flutter/skills
- Category: `animation-motion`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/flutter-animating-apps/SKILL.md_

### `skills/frame-data-chart-nyt/SKILL.md`
_NYT-newsroom typography, staggered reveal animation, and editorial-grade charts (line, bar, or range band)._

【模板: NYT 风数据图表帧】
【意图】把一段数据 (CSV / JSON / 一句结论) 做成《纽约时报》专栏感的单帧/动画图表, 适合视频片段或推特卡。Inspired by hyperframes data-chart。

【画布】1920×1080, 暖白底 `#f7f5ee` 或墨黑底 `#0e0e0e` 二选一; 文字色和背景相反。

【布局】
- **顶部 kicker** (11px uppercase letterspace 0.14em, 颜色 = accent 红 `#a91d1d` 或 mint `#5fb38a`): 数据来源 + 类目, 如 "GLOBAL · WEEKLY ACTIVE USERS · 2018–2026"。
- **大字标题** (Cheltenham / Playfair / Source Serif Pro, 5.6vw, italic 副标可选): 一句结论。**结论必须从用户数据中提炼**, 不是描述图。
- **图表区** (占画布 55-65%):
  - 折线: 1-2 条线, 主线 ink 实心 2.5px, 次线 dashed 1.5px; 数据点用 6px 实心圆; 关键点旁标注 `2024 · 412M` 黑色 mono 小字。
  - 柱状: 全部 ink 单色或加 1 道 accent 高亮柱; 柱顶大数字; 柱底类目斜体 (Cheltenham italic)。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-data-chart-nyt/SKILL.md_

### `skills/frame-flowchart-sticky/SKILL.md`
_SVG curve connectors, sticky-note nodes, and cursor interaction with a whiteboard-brainstorm feel._

【模板: 便利贴流程图帧 (Sticky Flowchart)】
【意图】把一个流程 / 系统 / 工作流画成"白板 + 便利贴"的样子, 适合 onboarding 视频、运营流程说明、系统架构讲解。Inspired by hyperframes flowchart。

【画布】1920×1080。背景: 米黄白板纸 `#f4ede1` 或冷灰白板 `#f0f2f4`; 加非常浅的 hex grid `rgba(0,0,0,0.04)` 让它有白板感。

【节点 (Sticky Notes)】
- 每节点 = 一张 240×180px 便利贴, 4 套颜色随机分配: 黄 `#fcd34d` / 桃 `#fca5a5` / 薄荷 `#a7f3d0` / 天 `#a5b4fc`。
- 便利贴有轻微旋转 `transform: rotate(±2deg)` 不一致, 投影 `drop-shadow(0 6px 14px rgba(0,0,0,0.12))`, 顶部胶带 `linear-gradient(...)` 装饰。
- 节点内容: 1 个 emoji 或单线 SVG icon + 大字标题 (16-20px) + 一行描述 (12px)。
- 节点字体: `Kalam` / `Caveat` / `Patrick Hand` 手写感字体 (中文用 `霞鹜文楷` 或 `LXGW WenKai Screen`)。

【连接线 (SVG)】

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-flowchart-sticky/SKILL.md_

### `skills/frame-glitch-title/SKILL.md`
_Digital glitch, chromatic offset, and data-corruption title frame for video transitions or cyberpunk heroes._

【模板: 故障艺术标题帧 (Glitch Title)】
【意图】单帧 hero / 视频转场 / cyberpunk 风格标题。Inspired by hyperframes glitch。

【画布】1920×1080, 背景 `#070708` 近黑或 CRT 暗灰 `#0d0e10`; 加 56px 网格 (透明 5%) + scanlines 横线 (透明 8%, 2px 间隔)。

【主标题】
- 居中, 6-9vw, weight 800/900, 字体 `Space Grotesk Bold` / `Inter Tight Black` / `JetBrains Mono Bold`。
- 颜色: 主层 `#f5f5f7`; 后面套 2 层伪影:
  - cyan `#00f0ff` translate(`-3px`, `1px`)。
  - magenta `#ff2bd6` translate(`3px`, `-1px`)。
- 整层加 clip-path 切片 5-8 段, 每段 `@keyframes` 随机 translateX -10px → 10px, 持续 80-160ms, 错峰播放, 营造 "data corruption" 像散。
- 每隔 1.5s 触发一次"重故障" — 整个标题被 horizontal smear 1 frame, 用 `filter: url(#displacementFilter)` 或简单 CSS 平移。


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-glitch-title/SKILL.md_

### `skills/frame-light-leak-cinema/SKILL.md`
_Film light leaks, grain, 16:9 letterbox, and large serif type for cinematic openings or chapter cards._

【模板: 胶片漏光电影帧】
【意图】纪录片 / 个人短片 / 视频章节卡的开场单帧 —— 暖橙漏光 + 35mm 颗粒 + 衬线大字, 古典胶片质感。Inspired by hyperframes light-leak。

【画布】
- **2.39:1 letterbox** (推荐): 1920×800, 上下黑边各 140px (`#000`)。
- 或 16:9: 1920×1080, 无 letterbox。

【背景】
- 底层: 深暖色 (深红棕 `#1a0d08` / 墨绿 `#0a1410` / 蓝紫 `#0d0e1a`) 或场景描绘 (CSS gradient 模拟天空 / 室内 / 室外)。
- **胶片漏光 (Light Leak)**: 2-3 个大 `radial-gradient(ellipse at top right, #ffb547 0%, transparent 50%)` + 1 个底部 `linear-gradient(to top, #d97757 0%, transparent 30%)`; 颜色取暖橙 / 桃 / 玫红 / 暗黄, **不要冷蓝**。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-light-leak-cinema/SKILL.md_

### `skills/frame-liquid-bg-hero/SKILL.md`
_WebGL-style fluid displacement background with a quote overlay, suited to video intros, landing heroes, or posters._

【模板: 流体背景 Hero】
【意图】可作为视频片头帧、SaaS landing 顶部 hero、海报底图。WebGL 流体感, 但用 CSS / canvas 退化绘制, 确保单文件可双击打开。Inspired by hyperframes vfx-liquid-background。

【画布】1920×1080 (横) 或 1080×1920 (竖), 二选一。背景占满。

【流体背景 — 3 种实现, 按用户偏好选】
1. **CSS 多层 radial-gradient 错位呼吸** (最稳, 默认推荐):
   - 3-5 个大椭圆 `radial-gradient(...)`, 颜色取自调色板。
   - 每个椭圆套 `@keyframes` 平移 + scale + hue-rotate, 周期 8-14s, 错峰; 整个画面叠 `mix-blend-mode: screen` 或 `overlay`。
   - 顶层加 1 层 `backdrop-filter: blur(80px)` 让边缘更糊。
2. **Canvas + simple perlin noise** (中阶):
   - 80 行 inline JS, 用 `requestAnimationFrame` 画 metaballs 或 simplex noise field。
   - 性能允许时启用, `prefers-reduced-motion` 时降回静态截图。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-liquid-bg-hero/SKILL.md_

### `skills/frame-logo-outro/SKILL.md`
_Segmented logo assembly, glow bloom, and tagline reveal for video outros or brand closing frames._

【模板: Logo 收尾帧 (Logo Outro)】
【意图】视频结尾的品牌 reveal 帧 —— logo 分块拼装 + glow bloom + tagline 上浮 + CTA。Inspired by hyperframes logo-outro。

【画布】1920×1080, 黑色 `#08090c` 或品牌深色背景; 加微妙 vignette `radial-gradient(...)` 让中心更亮。

【布局】
- **中心 Logo**: 用 CSS / 内联 SVG 绘制; 由 4-8 个几何块 (圆 / 方 / 三角 / hairline) 组成。
  - 入场动画: 每个块从屏幕外滑入 (±100px 不同方向) + scale 1.4→1.0 + opacity 0→1, 错峰 80ms; 总时长 1.2s。
  - 入场完成后, 整个 logo 加 glow bloom: `filter: drop-shadow(0 0 24px <accent>40)`; 同时一道 shimmer `mask-image` 横扫 logo (500ms)。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-logo-outro/SKILL.md_

### `skills/frame-macos-notification/SKILL.md`
_Realistic macOS notification banner with app icon, title, and body, suited to video overlays or product teasers._

【模板: macOS 通知横幅】
【意图】把一段公告 / 消息 / 提示渲染成 macOS Big Sur+ 风格的通知横幅, 适合视频角落叠加、产品发布预告、社媒图。Inspired by hyperframes macos-notification。

【画布】两种用法:
- 视频叠加 1920×1080, 通知放右上角, 周围透明。
- 单独 banner 480×120, 居中输出。

【横幅结构】
- 外框: 圆角 14px (macOS Big Sur 标准), 480×120 (或更长 480×180 含正文), 12-16px 内边距。
- 背景: **frosted glass** 效果 — `background: rgba(245,245,247,0.78)` + `backdrop-filter: blur(40px) saturate(180%)`; 暗色版 `rgba(28,28,30,0.78)`。
- 边框: 1px `rgba(0,0,0,0.06)` (light) / `rgba(255,255,255,0.08)` (dark); 顶部加 1px 亮 highlight `rgba(255,255,255,0.5)`。
- 阴影: `0 10px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)`。

【内容】

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frame-macos-notification/SKILL.md_

### `skills/frontend-design/SKILL.md`
_Create distinctive, production-grade frontend interfaces with strong visual direction, polished typography, considered layout, and working HTML/CSS/JS or framework code. Use for websites, landing pages, dashboards, React components, application screens, and UI beautification._

#### frontend-design

> Adapted from Anthropic's official `frontend-design` skill for OpenDesign.

Use this skill when the user asks to build or improve a frontend interface: a website, landing page, dashboard, application screen, HTML/CSS artifact, React/Vue/Svelte component, or a visual redesign of an existing UI.

The goal is not just "make it nicer." The goal is to ship working frontend code with a clear design point of view, strong craft, and enough product detail that the result feels designed for the user's actual context.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frontend-design/SKILL.md_

### `skills/frontend-dev/SKILL.md`
_Full-stack frontend with cinematic animations, AI-generated media via MiniMax API, and generative art. Useful for hero pages and showcase sites._

#### frontend-dev

> Curated from the MiniMax AI team.

##### What it does

Full-stack frontend with cinematic animations, AI-generated media via MiniMax API, and generative art. Useful for hero pages and showcase sites.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `web-artifacts`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frontend-dev/SKILL.md_

### `skills/frontend-skill/SKILL.md`
_Create visually strong landing pages, websites, and app UIs with restrained composition. OpenAI's production frontend playbook._

#### frontend-skill

> Curated from OpenAI's skills repository.

##### What it does

Create visually strong landing pages, websites, and app UIs with restrained composition. OpenAI's production frontend playbook.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frontend-skill/SKILL.md_

### `skills/frontend-slides/SKILL.md`
_Generate animation-rich HTML presentations with visual style previews. Useful for online keynotes, embedded talks, and interactive briefs._

#### frontend-slides

> Curated from @zarazhangrui.

##### What it does

Generate animation-rich HTML presentations with visual style previews. Useful for online keynotes, embedded talks, and interactive briefs.

##### Source

- Upstream: https://github.com/zarazhangrui/frontend-slides
- Category: `slides`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/frontend-slides/SKILL.md_

### `skills/full-page-screenshot/SKILL.md`
_Capture full-page screenshots of web pages via Chrome DevTools Protocol with zero dependencies. Useful for portfolios, case studies, and audit reports._

#### full-page-screenshot

> Curated from @LewisLiu007.

##### What it does

Capture full-page screenshots of web pages via Chrome DevTools Protocol with zero dependencies. Useful for portfolios, case studies, and audit reports.

##### Source

- Upstream: https://github.com/LewisLiu007/full-page-screenshot
- Category: `screenshots`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/full-page-screenshot/SKILL.md_

### `skills/gif-sticker-maker/SKILL.md`
_Convert photos into animated GIF stickers in Funko Pop / Pop Mart style via the MiniMax API. Useful for personalized chat stickers and avatar packs._

#### gif-sticker-maker

> Curated from MiniMax AI team.

##### What it does

Convert photos into animated GIF stickers in Funko Pop / Pop Mart style via the MiniMax API. Useful for personalized chat stickers and avatar packs.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/gif-sticker-maker/SKILL.md_

### `skills/gpt-tasteskill/SKILL.md`
_Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP ScrollTriggers (pinning, stacking, scrubbing), inline micro-images, and massive section spacing._

#### CORE DIRECTIVE: AWWWARDS-LEVEL DESIGN ENGINEERING
You are an elite, award-winning frontend design engineer. Standard LLMs possess severe statistical biases: they generate massive 6-line wrapped headings by using narrow containers, leave ugly empty gaps in bento grids, use cheap meta-labels ("QUESTION 05", "SECTION 01"), output invisible button text, and endlessly repeat the same Left/Right layouts.

Your goal is to aggressively break these defaults. Your outputs must be highly creative, perfectly spaced, motion-rich (GSAP), mathematically flawless in grid execution, and heavily rely on varied, high-end assets.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/gpt-tasteskill/SKILL.md_

### `skills/hand-drawn-diagrams/SKILL.md`
_Generate hand-drawn Excalidraw diagrams from a prompt — animated SVG, hosted edit link, and PNG export. Works with Claude Code, Codex, Gemini CLI, and any agent supporting standard skill paths._

#### hand-drawn-diagrams

> Curated from @muthuishere.

##### What it does

Generate hand-drawn Excalidraw diagrams from a prompt — animated SVG, hosted edit link, and PNG export. Works with Claude Code, Codex, Gemini CLI, and any agent supporting standard skill paths.

##### Source

- Upstream: https://github.com/muthuishere/hand-drawn-diagrams
- Category: `diagrams`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/hand-drawn-diagrams/SKILL.md_

### `skills/hatch-pet/SKILL.md`
_Create, repair, validate, preview, and package Codex-compatible animated pet spritesheets from character art, screenshots, generated images, or visual references. Use when a user wants to hatch a Codex pet, create a custom animated pet, or build a built-in pet asset with an 8x9 atlas, transparent unused cells, row-by-row animation prompts, QA contact sheets, preview videos, and pet.json packaging. This skill composes the installed $imagegen system skill for visual generation and uses bundled scripts for deterministic spritesheet assembly._

#### Hatch Pet

> **OpenDesign integration.** This is the unmodified Codex `hatch-pet` skill,
> vendored under `skills/hatch-pet/` so any OpenDesign agent can run it. After
> the skill finishes packaging, the resulting `spritesheet.webp` (under
> `${CODEX_HOME:-$HOME/.codex}/pets/<pet-name>/`) can be imported into the
> floating pet companion via **Settings → General → Pets → Import Codex sprite**. The
> import flow auto-detects the 8×9 / `192×208` atlas and lets the user pick
> which animation row to play (idle, running-right, waving, …).



_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/hatch-pet/SKILL.md_

### `skills/html-ppt-retro-quarterly-review/SKILL.md`
_Retro Quarterly Review presentation template in a bold blue + orange editorial language. Use when users ask for a high-impact quarterly review / roadmap deck with heavyweight slab headlines, clean cream paper sections, structured grids, and fast premium motion pacing (3 slides, each hold under 3s in video mode)._

#### Retro Quarterly Review Template

A high-contrast, print-inspired quarterly review template with three cinematic
slides:

1. Cover (hero title lockup)
2. Three priorities (triptych grid)
3. Roadmap timeline + KPI strip

##### Resource map

```text
html-ppt-retro-quarterly-review/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/html-ppt-retro-quarterly-review/SKILL.md_

### `skills/huashu-art-motion/SKILL.md`
_辅助艺术动画与解说任务：35 种艺术风格配方、9 种解说语法、分镜与确定性 Canvas 绘制工具。按宿主时间轴实现，素材与导出使用宿主能力。_

##### Open Design 宿主约定

这是当前任务中的功能技能。保留用户选定的任务类型、品牌、技术栈、当前阶段和交付格式；不要因为 @ 选择而改成视频项目。规划阶段只规划，实现阶段才写代码。检查、渲染和导出仅在宿主当前阶段允许且工具真实可用时执行；技能不能额外开启独立 Agent、强制审批或绕过宿主交付边界。

附属文件相对当前技能包根目录读取，按当前问题选读，不把全部参考文档粘入提示词。不读取其他 Agent 的全局配置。素材优先用用户已有文件；需要新图片、视频或音频时使用当前宿主实际提供且用户允许的工具。缺少生成、测量或导出能力时说明具体缺口，交付可验证部分，不声称完成未执行的步骤。遵循当前任务的输出路径，不覆盖输入或历史产物。
#### 花叔艺术动画：Open Design 适配

##### 适用范围与包边界

在现有任务中拆解参考动画、选择艺术材料、设计分镜、编排画面内运动，或实现解说中的一个镜头。此包提供完整的 35 张艺术配方、9 张解说语法卡和八个通用 Canvas 工具模块源码；它不安装上游整片渲染器、35 支样片、角色帧、字体、声音克隆或独立凭据系统。选择此技能不意味着 MP4 已可导出。


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/huashu-art-motion/SKILL.md_

### `skills/image-enhancer/SKILL.md`
_Improve image and screenshot quality by enhancing resolution, sharpness, and clarity for professional presentations and documentation._

#### image-enhancer

> Curated from ComposioHQ awesome-claude-skills.

##### What it does

Improve image and screenshot quality by enhancing resolution, sharpness, and clarity for professional presentations and documentation.

##### Source

- Upstream: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/image-enhancer
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/image-enhancer/SKILL.md_

### `skills/image-to-code-skill/SKILL.md`
_Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. In Codex, it must prefer large, readable, section-specific images instead of tiny compressed boards, generate fresh standalone images for sections or detail views instead of cropping old ones, avoid lazy under-generation, avoid cards-inside-cards-inside-cards UI, and keep the hero clean, spacious, readable, and visible on a small laptop._

#### CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE
You are an elite web design art director and implementation strategist.

Your job is not to generate generic website mockups.
Your job is to generate premium, artistic, implementation-friendly website section references and then turn them into real frontend.

This skill is for:
- hero sections
- landing pages
- marketing sites
- startup sites
- editorial brand pages
- product pages
- portfolio websites
- premium multi-section websites
- redesigns where visual quality matters

Standard AI output tends to collapse into repetitive defaults:

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/image-to-code-skill/SKILL.md_

### `skills/imagegen-frontend-mobile/SKILL.md`
_Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text, strong multi-screen consistency, controlled color palettes, non-generic creative direction, textured surfaces, image-led composition, tasteful custom iconography, and clean phone mockup framing. By default, screens should be shown inside a subtle premium iPhone or similar phone mockup with a visible frame, while the main focus stays on the app content itself. This skill generates images only. It does not write code._

#### CORE DIRECTIVE: PREMIUM MOBILE APP IMAGE DIRECTION
You are an elite mobile product design art director.

Your job is not to generate generic app mockups.
Your job is to generate premium, app-native, highly readable mobile app screen images and flow images.

This skill is for:
- onboarding flows
- auth flows
- home dashboards
- profile screens
- settings screens
- chat screens
- ecommerce screens
- fintech screens
- health and fitness screens
- productivity apps
- social apps
- utilities
- multi-screen app concepts
- premium mobile redesigns

This skill is not for:
- websites
- landing pages
- desktop dashboards
- image-to-code

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/imagegen-frontend-mobile/SKILL.md_

### `skills/imagegen-frontend-web/SKILL.md`
_Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections produces 8 images. Never compress multiple sections into one image. Enforces composition variety (not always left-text / right-image), background-image freedom, varied CTAs, varied hero scales (giant / mid / mini minimalist), narrative concept spine, second-read moments, and a single consistent palette across all images. Optimized for landing pages, marketing sites, and product comps that developers or coding models can accurately recreate._

#### HARD OUTPUT RULE — READ FIRST

**Generate one separate horizontal image PER section. Always. No exceptions.**

- 1 section requested -> 1 image
- 4 sections requested -> 4 images
- 8 sections requested -> 8 images
- 12 sections requested -> 12 images
- "landing page" with no count -> default to 6 sections -> 6 images
- "full website template" -> default to 8 sections -> 8 images

Each image is one section, generated as its own image call. Never combine multiple sections into one frame. Never return a single tall image that contains the whole page.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/imagegen-frontend-web/SKILL.md_

### `skills/imagegen/SKILL.md`
_Generate and edit images using OpenAI's Image API for project assets — UI mockups, icons, illustrations, social cards, and visual references._

#### imagegen

> Curated from OpenAI's skills repository.

##### What it does

Generate and edit images using OpenAI's Image API for project assets — UI mockups, icons, illustrations, social cards, and visual references.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/imagegen/SKILL.md_

### `skills/imagen/SKILL.md`
_Generate images using Google Gemini's image generation API for UI mockups, icons, illustrations, and visual assets._

#### imagen

> Curated from @sanjay3290.

##### What it does

Generate images using Google Gemini's image generation API for UI mockups, icons, illustrations, and visual assets.

##### Source

- Upstream: https://github.com/sanjay3290/imagen
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/imagen/SKILL.md_

### `skills/library-curator/SKILL.md`
_Search the OD Library (the global asset registry) and apply matching assets into the current project mid-task. Use when the user asks to reuse an image they captured/uploaded earlier, "pull a logo/screenshot from my library", or to find and drop a stored asset into the page being built._

#### library-curator

Reuse assets that already live in the user's OD Library — images captured with
the OD Clipper, manual uploads, agent-generated media, and design-system
material — without asking the user to re-upload them.

##### When to use

- The user references an asset they already have ("the screenshot I clipped",
  "my logo", "that hero image from earlier").
- You need an image for the page you're building and the user prefers their own
  library over freshly generated media.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/library-curator/SKILL.md_

### `skills/login-flow/SKILL.md`
_Mobile login and authentication flow screens_

#### Login Flow Skill

A skill for generating mobile-first login and authentication screens. Use this when the user wants a sign-in experience for a mobile app, including phone + SMS verification, password-based login, and social SSO options.

##### Workflow

1. **Read reference files first** (see below)
2. **Clarify auth method**: phone/SMS, password, or social SSO
3. **Checklist gate** — verify P0 items before emitting `<artifact>`
4. **Build the HTML prototype** with proper states (default, loading, error)
5. **Wrap in `<artifact>` tag** referencing the output file

##### Side Files

- `references/checklist.md` — P0/P1 acceptance criteria


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/login-flow/SKILL.md_

### `skills/marketing-psychology/SKILL.md`
_Apply psychological principles and behavioral science to copy and design. Useful for tightening hooks, framing, and pricing presentation._

#### marketing-psychology

> Curated from Corey Haines.

##### What it does

Apply psychological principles and behavioral science to copy and design. Useful for tightening hooks, framing, and pricing presentation.

##### Source

- Upstream: https://github.com/coreyhaines31/marketingskills
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/marketing-psychology/SKILL.md_

### `skills/minimalist-skill/SKILL.md`
_Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows._

#### Protocol: Premium Utilitarian Minimalism UI Architect

##### 1. Protocol Overview
Name: Premium Utilitarian Minimalism & Editorial UI
Description: An advanced frontend engineering directive for generating highly refined, ultra-minimalist, "document-style" web interfaces analogous to top-tier workspace platforms. This protocol strictly enforces a high-contrast warm monochrome palette, bespoke typographic hierarchies, meticulous structural macro-whitespace, bento-grid layouts, and an ultra-flat component architecture with deliberate muted pastel accents. It actively rejects standard generic SaaS design trends.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/minimalist-skill/SKILL.md_

### `skills/minimax-docx/SKILL.md`
_Professional DOCX document creation and editing using OpenXML SDK. Useful for branded reports, polished proposals, and template-based authoring._

#### minimax-docx

> Curated from the MiniMax AI team.

##### What it does

Professional DOCX document creation and editing using OpenXML SDK. Useful for branded reports, polished proposals, and template-based authoring.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `documents`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/minimax-docx/SKILL.md_

### `skills/minimax-pdf/SKILL.md`
_Generate, fill, and reformat PDFs with a token-based design system and 15 cover styles. Useful for branded PDFs, e-guides, and reports._

#### minimax-pdf

> Curated from the MiniMax AI team.

##### What it does

Generate, fill, and reformat PDFs with a token-based design system and 15 cover styles. Useful for branded PDFs, e-guides, and reports.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `documents`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/minimax-pdf/SKILL.md_

### `skills/mockup-device-3d/SKILL.md`
_Static iPhone and MacBook 3D-style showcase with real HTML embedded on screens, glass-lens refraction, and 360-degree turntable composition._

【模板: 设备 3D 展架 (Device 3D Showcase / HTML-in-Canvas)】
【意图】产品发布、App 演示、设计稿展示。把用户提供的 UI 内容真实渲染到 iPhone / MacBook "屏幕"里, 周围用 CSS 3D transform 模拟 GLTF 模型的玻璃 / 高光 / 折射。Inspired by hyperframes vfx-iphone-device。

【硬性构图】
- **画布**: 1920×1080, 暖灰渐变背景 `radial-gradient(#1a1a1f → #0a0a0f)`, 底部反射地面 (mirror gradient)。
- **iPhone 15 Pro 模型**: 左侧 / 中部, `transform: rotateY(-12deg) rotateX(4deg) translateZ(40px)`; 边框钛金属银 `#a8a8ad` (实心 4px) + 屏幕圆角 56px; 屏幕内嵌 iframe-like div, 真实渲染用户的 HTML 内容 (mobile viewport 375×812)。
- **MacBook Pro 14"** (可选第二台): 右侧, 略小, `rotateY(8deg)`; 上盖屏幕嵌入桌面 viewport 内容 (1440×900 缩放); 底座键盘 + trackpad 用 CSS 阴影线条绘制 (不画键帽细节)。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/mockup-device-3d/SKILL.md_

### `skills/motion-lab/SKILL.md`
_为当前网页或组件查找、选型和改造动效。包含 160 个案例的 HTML/CSS/JS、参数与中英文索引，覆盖基础、文字、交互和高级动效。_

##### Open Design 宿主约定

这是当前任务中的功能技能。保留用户选定的任务类型、品牌、技术栈、当前阶段和交付格式；不要因为 @ 选择而改成视频项目。规划阶段只规划，实现阶段才写代码。检查、渲染和导出仅在宿主当前阶段允许且工具真实可用时执行；技能不能额外开启独立 Agent、强制审批或绕过宿主交付边界。

附属文件相对当前技能包根目录读取，按当前问题选读，不把全部参考文档粘入提示词。不读取其他 Agent 的全局配置。素材优先用用户已有文件；需要新图片、视频或音频时使用当前宿主实际提供且用户允许的工具。缺少生成、测量或导出能力时说明具体缺口，交付可验证部分，不声称完成未执行的步骤。遵循当前任务的输出路径，不覆盖输入或历史产物。
#### Motion.Lab 动效案例库


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/motion-lab/SKILL.md_

### `skills/nanobanana-ppt/SKILL.md`
_AI-powered PPT generation with document analysis and styled images via the NanoBanana stack. Combines image generation with structured deck output._

#### nanobanana-ppt

> Curated from @op7418.

##### What it does

AI-powered PPT generation with document analysis and styled images via the NanoBanana stack. Combines image generation with structured deck output.

##### Source

- Upstream: https://github.com/op7418/NanoBanana-PPT-Skills
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/nanobanana-ppt/SKILL.md_

### `skills/od-next-media-inputs/SKILL.md`
_Prepare required media inputs within an existing OD Next plan. Reuse capability evidence, acquire and measure assets efficiently, and resolve asynchronous jobs without removing required content or weakening quality standards._

#### OD Next Media Inputs

Use only when the current task needs media inputs. Reuse these instructions
while applicable; do not load them for tasks without asset work. Follow the
current route, stage, frozen plan, and delivery boundary. During
`contract_repair`, make no tool calls. Finish required input work before the
deliverable write that depends on it. Never label post-write artifact
inspection, rendering, validation, or repair as input preparation to bypass
ship-on-write.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/od-next-media-inputs/SKILL.md_

### `skills/output-skill/SKILL.md`
_Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output._

#### Full-Output Enforcement

##### Baseline

Treat every task as production-critical. A partial output is a broken output. Do not optimize for brevity — optimize for completeness. If the user asks for a full file, deliver the full file. If the user asks for 5 components, deliver 5 components. No exceptions.

##### Banned Output Patterns

The following patterns are hard failures. Never produce them:

**In code blocks:** `// ...`, `// rest of code`, `// implement here`, `// TODO`, `/* ... */`, `// similar to above`, `// continue pattern`, `// add more as needed`, bare `...` standing in for omitted code


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/output-skill/SKILL.md_

### `skills/paywall-upgrade-cro/SKILL.md`
_Design and optimize upgrade screens, paywalls, and upsell modals. Useful for SaaS conversion design and pricing-page experiments._

#### paywall-upgrade-cro

> Curated from Corey Haines.

##### What it does

Design and optimize upgrade screens, paywalls, and upsell modals. Useful for SaaS conversion design and pricing-page experiments.

##### Source

- Upstream: https://github.com/coreyhaines31/marketingskills
- Category: `marketing-creative`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/paywall-upgrade-cro/SKILL.md_

### `skills/pdf/SKILL.md`
_Extract text, create PDFs, and handle forms. Useful for press releases, branded one-pagers, and printable design deliverables._

#### pdf

> Curated from Anthropic's official skills repository.

##### What it does

Extract text, create PDFs, and handle forms. Useful for press releases, branded one-pagers, and printable design deliverables.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/pdf
- Category: `documents`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pdf/SKILL.md_

### `skills/pixelbin-media/SKILL.md`
_Generate and edit images and videos with an 85+ API portfolio and build visually appealing website pages via Pixelbin._

#### pixelbin-media

> Curated from Pixelbin.

##### What it does

Generate and edit images and videos with an 85+ API portfolio and build visually appealing website pages via Pixelbin.

##### Source

- Upstream: https://github.com/pixelbin-dev/skills
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pixelbin-media/SKILL.md_

### `skills/platform-design/SKILL.md`
_300+ design rules from Apple HIG, Material Design 3, and WCAG 2.2 for cross-platform apps. Useful when shipping a single design across iOS, Android, and the web._

#### platform-design

> Curated from @ehmo.

##### What it does

300+ design rules from Apple HIG, Material Design 3, and WCAG 2.2 for cross-platform apps. Useful when shipping a single design across iOS, Android, and the web.

##### Source

- Upstream: https://github.com/ehmo/platform-design-skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/platform-design/SKILL.md_

### `skills/ppt-keynote/SKILL.md`
_Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation._

【模板: Keynote 风格 PPT】
- 每张幻灯片是一个 `<section class="slide">`, 整体宽 1280 高 720, 居中显示, 背景渐变。
- 单页内容极简: 大标题 + 1-3 行支持文字; 或一张数据图; 或一个金句。
- 字号: 标题 `text-7xl font-semibold tracking-tight`, 副标题 `text-2xl text-neutral-500`。
- 第一页是封面 (主题 + 演讲者 / 日期), 最后一页是 "Thanks." 或行动号召。
- 顶部右上角小指示器: 当前页 / 总页数。
- 加一段 JavaScript 监听 ArrowLeft / ArrowRight / 空格键切换 slide; 同时维护 hash (#/3)。
- 每页之间用 fade-in 动画。
- 保持留白, 数据卡片用 grid 布局对齐, 颜色克制。

### `skills/pptx-generator/SKILL.md`
_Create and edit PowerPoint presentations from scratch with PptxGenJS — MiniMax's production-tested deck pipeline._

#### pptx-generator

> Curated from the MiniMax AI team.

##### What it does

Create and edit PowerPoint presentations from scratch with PptxGenJS — MiniMax's production-tested deck pipeline.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `slides`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pptx-generator/SKILL.md_

### `skills/pptx-html-fidelity-audit/SKILL.md`
_Audit a python-pptx export against its source HTML deck, identify layout/content drift (footer overflow, cropped content, missing italic/em, lost styling, off-rhythm spacing), and re-export with strict footer-rail + cursor-flow layout discipline. Use this skill whenever the user has a .pptx that was generated from an HTML slide deck and asks to compare/audit/verify/fix the export — including phrases like "compare ppt with html", "fidelity audit", "fix the pptx", "ppt is cut off", "footer overlap", "italic missing in pptx", "re-export the deck", "pptx-html-fidelity-audit", or any case where a python-pptx → HTML round-trip needs verification or repair. Also trigger when the user shows you a deck.html and a deck.pptx side by side and is debugging visual differences._

#### PPTX ↔ HTML Fidelity Audit

A repeatable workflow for catching the ways a `python-pptx` export silently drifts from its HTML source — and fixing them with a layout discipline that prevents the same regressions on the next pass.

##### When this skill applies

The user has:

- A source HTML slide deck (typically a single-file deck with `<section class="slide">` blocks):

  ```html
  <section class="slide light">
    <div class="chrome">2026 · Q2 review</div>
    <span class="kicker">Pillar 03</span>
    <h2 class="h-xl">Shipping <em>velocity</em> doubled</h2>
    <p class="lead">…</p>
    <div class="foot">page 5 / 14</div>
  </section>
  ```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pptx-html-fidelity-audit/SKILL.md_

### `skills/pptx/SKILL.md`
_Read, generate, and adjust PowerPoint slides, layouts, and templates. Useful for executive decks, training material, and product reviews._

#### pptx

> Curated from Anthropic's official skills repository.

##### What it does

Read, generate, and adjust PowerPoint slides, layouts, and templates. Useful for executive decks, training material, and product reviews.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/pptx
- Category: `slides`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pptx/SKILL.md_

### `skills/pr-feedback-quality-gate/SKILL.md`
_Safely track pull request feedback, resolve review comments or merge conflicts, validate fixes, and use a read-only cross-review before committing or pushing follow-up changes._

#### PR Feedback Quality Gate

Use this when a PR has review feedback, merge conflicts, pending checks, or
needs a monitored follow-up after a fix.

##### Workflow

1. Inspect PR state first: comments, reviews, mergeability, checks, branch, and
   local worktree status. Keep unrelated local changes out of the PR.
2. Use an isolated worktree for review fixes or conflict resolution when the
   main checkout is dirty, behind remote, or being used by another agent.
3. Make the smallest safe fix. Preserve the original bug invariant and any
   newer upstream structure introduced by `main`.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/pr-feedback-quality-gate/SKILL.md_

### `skills/redesign-skill/SKILL.md`
_Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS._

#### Redesign Skill

##### How This Works

When applied to an existing project, follow this sequence:

1. **Scan** — Read the codebase. Identify the framework, styling method (Tailwind, vanilla CSS, styled-components, etc.), and current design patterns.
2. **Diagnose** — Run through the audit below. List every generic pattern, weak point, and missing state you find.
3. **Fix** — Apply targeted upgrades working with the existing stack. Do not rewrite from scratch. Improve what's there.

##### Design Audit


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/redesign-skill/SKILL.md_

### `skills/release-notes-one-pager/SKILL.md`
_Release notes one-page HTML with highlights, Added, Fixed, Breaking changes, Known issues, and Upgrade note. Writes explicit "None" style sections whenever the user does not provide details._

#### Release Notes One-Pager Skill

Produce a single-page release notes document in HTML.

##### Resource map

```
release-notes-one-pager/
├── SKILL.md                    ← this file
├── example.html                ← quality bar and style reference
├── assets/
│   └── template.html           ← local seed file to copy to project index.html
└── references/
    ├── checklist.md            ← P0 / P1 / P2 gates
    └── layouts.md              ← local section skeletons
```

Do not write CSS from scratch unless the user explicitly asks for a bespoke structure.

##### Workflow


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/release-notes-one-pager/SKILL.md_

### `skills/remotion/SKILL.md`
_Programmatic video creation with React. Useful for branded explainers, social cuts, dashboards-to-video, and reproducible motion graphics._

#### remotion

> Curated from the Remotion team.

##### What it does

Programmatic video creation with React. Useful for branded explainers, social cuts, dashboards-to-video, and reproducible motion graphics.

##### Source

- Upstream: https://github.com/remotion-dev/remotion
- Category: `video-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/remotion/SKILL.md_

### `skills/replicate/SKILL.md`
_Discover, compare, and run AI models using Replicate's API. Strong fit for image, audio, and video generation pipelines that swap models frequently._

#### replicate

> Curated from Replicate.

##### What it does

Discover, compare, and run AI models using Replicate's API. Strong fit for image, audio, and video generation pipelines that swap models frequently.

##### Source

- Upstream: https://github.com/replicate/skills
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/replicate/SKILL.md_

### `skills/research-decision-room/SKILL.md`
_Turn messy user research notes, interviews, support tickets, surveys, and product context into an evidence-backed decision room: a single HTML artifact with an evidence ledger, theme map, confidence heatmap, opportunity matrix, decision memo, and experiment queue. Use when teams need to move from qualitative signals to product or design decisions without fabricating certainty._

#### Research Decision Room Skill

Create a single-page HTML decision artifact that helps a product or design team
turn messy evidence into a clear next move. The output is not a decorative
research deck. It is a working room for debate: evidence, themes, confidence,
tradeoffs, and recommended experiments stay visible together.

##### Resource map

```text
research-decision-room/
├── SKILL.md
├── example.html
└── references/
    ├── checklist.md
    └── evidence-model.md
```

Read `references/evidence-model.md` before synthesis and run
`references/checklist.md` before emitting the artifact.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/research-decision-room/SKILL.md_

### `skills/resume-modern/SKILL.md`
_Modern minimal resume, single A4 page, ready for print or PDF export._

【模板: 现代极简简历】
- 容器宽度模拟 A4: `w-[210mm] min-h-[297mm] mx-auto`, 内边距 16-20mm。
- 顶部姓名巨大 (text-4xl), 底下一行 contact (邮箱 / 电话 / 城市 / GitHub / LinkedIn), 中间用细竖线分隔。
- 主体两栏可选: 左 60% 主线（经历/项目/教育）, 右 40% 副线（技能/语言/获奖）。
- 章节标题: small caps 风格, 上方一条短 accent 线 (w-8 h-0.5)。
- 经历每条: 公司 + 职位 + 时间区间 (右对齐), 下方 1-3 条 bullet 用动词开头。
- 不使用花哨颜色, 黑白灰 + 1 个 accent (深蓝 / 墨绿)。
- 添加 @media print 样式, 隐藏不必要的元素, 颜色保留。

### `skills/review-animations/SKILL.md`
_Reviews animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy. Default to flagging; approval is earned._

#### Reviewing Animations

A specialized review skill. It does ONE thing: review animation and motion code against a high craft bar. It does not write features, fix unrelated bugs, or review non-motion code. If asked to review general code, decline and point to a general review skill.

##### Operating Posture

You are a senior motion-design reviewer with a brutal eye for craft. Your bias is toward **motion that feels right**, not motion that merely runs. A transition that "works" but feels sluggish, lands from the wrong origin, fires too often, or drops frames is a regression, not a pass. Default to flagging. Approval is earned, not assumed.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/review-animations/SKILL.md_

### `skills/screenshot/SKILL.md`
_Capture desktop, app windows, or pixel regions across OS platforms. Useful for marketing screenshots, design reviews, and bug reports._

#### screenshot

> Curated from OpenAI's skills repository.

##### What it does

Capture desktop, app windows, or pixel regions across OS platforms. Useful for marketing screenshots, design reviews, and bug reports.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `screenshots`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/screenshot/SKILL.md_

### `skills/screenshots-marketing/SKILL.md`
_Generate marketing screenshots with Playwright. Useful for landing-page hero shots, App Store screenshots, and changelog visuals._

#### screenshots-marketing

> Curated from @Shpigford.

##### What it does

Generate marketing screenshots with Playwright. Useful for landing-page hero shots, App Store screenshots, and changelog visuals.

##### Source

- Upstream: https://github.com/Shpigford/screenshots
- Category: `screenshots`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/screenshots-marketing/SKILL.md_

### `skills/shadcn-ui/SKILL.md`
_Build UI components with shadcn/ui. Pairs with the Stitch design loop to ship structured, accessible components quickly._

#### shadcn-ui

> Curated from Google Labs (Stitch).

##### What it does

Build UI components with shadcn/ui. Pairs with the Stitch design loop to ship structured, accessible components quickly.

##### Source

- Upstream: https://github.com/google-labs-code/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/shadcn-ui/SKILL.md_

### `skills/shader-dev/SKILL.md`
_GLSL shader techniques for ray marching, fluid simulation, particle systems, and procedural generation. Useful for hero visuals and motion stills._

#### shader-dev

> Curated from the MiniMax AI team.

##### What it does

GLSL shader techniques for ray marching, fluid simulation, particle systems, and procedural generation. Useful for hero visuals and motion stills.

##### Source

- Upstream: https://github.com/MiniMax-AI/skills
- Category: `3d-shaders`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/shader-dev/SKILL.md_

### `skills/slack-gif-creator/SKILL.md`
_Create animated GIFs optimized for Slack with validators for size constraints and composable animation primitives._

#### slack-gif-creator

> Curated from Anthropic's official skills repository.

##### What it does

Create animated GIFs optimized for Slack with validators for size constraints and composable animation primitives.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator
- Category: `image-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/slack-gif-creator/SKILL.md_

### `skills/social-reddit-card/SKILL.md`
_Realistic Reddit post card with vote rail and comment count, suited to video overlays or story sharing._

【模板: Reddit 帖子卡】
【意图】把一段故事 / 提问 / 段子, 渲染成 Reddit 帖子卡片, 用于视频叠加、社媒故事分享。Inspired by hyperframes reddit-post。

【画布】1280×720 (视频叠加) 或 800×600 (单卡分享); 背景透明或暗色 `#0b1416`。

【卡片结构】
- 外框: 圆角 16px, bg 白 `#ffffff` (light) 或 `#1a1a1b` (dark, 推荐 video overlay), border 1px `#edeff1` / `#343536`。
- 左侧 **vote rail** (40-56px 宽):
  - 上箭头 ▲ (16px, `#878a8c`, hover 变橙 `#ff4500`)。
  - 票数 (Inter, 17px, weight 700, 居中, 颜色: 0 灰 / 正橙 / 负蓝); 大数字用 `12.3k` 格式。
  - 下箭头 ▼ (hover 变蓝 `#7193ff`)。
- 主体区:
  - 顶部 meta row: 子版块图标 (CSS 圆形 + 字母) + `r/subreddit` (粗) + `· Posted by u/username · 3h` (小字灰)。
  - **标题** (Inter / IBM Plex Sans, 22-28px, weight 500, dark text)。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/social-reddit-card/SKILL.md_

### `skills/social-spotify-card/SKILL.md`
_Spotify Now Playing-style card with album art, progress bar, and playback controls, suited to video overlays or personal homepages._

【模板: Spotify Now-Playing 卡】
【意图】把一首歌、一段播客、或一段个人介绍渲染成 Spotify 正在播放卡, 适合 video overlay / 个人 about page / 创作者 hero。Inspired by hyperframes spotify-card。

【画布】两个尺寸:
- 横版视频叠加: 1280×720, 卡片居中或左下角浮动。
- 紧凑横条 widget: 600×200, 可嵌入到任何 hero。

【卡片结构】
- 外框: 圆角 12-16px; bg 用专辑封面色提取的暗渐变 (e.g. `linear-gradient(135deg, #1e3264 0%, #0d1f3d 100%)`) 或 Spotify 经典 `#121212`; 边缘有 1px subtle border。
- 左侧: **专辑封面** (CSS 渐变 + 大字 monogram 或抽象几何描绘, 不能外链图片), 圆角 6px, 60-200px 方形。
- 右侧:
  - 顶部 `NOW PLAYING` (uppercase letterspace 0.14em, 11px, 绿色 `#1DB954`)。
  - **歌名 / 标题** (Inter / Spotify Circular, 22-28px, weight 700, 白色)。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/social-spotify-card/SKILL.md_

### `skills/social-x-post-card/SKILL.md`
_Realistic X post card with engagement metrics (likes, reposts, views), suited to video overlays or shareable image cards._

【模板: X (Twitter) 帖子卡】
【意图】把一段推文内容 (或用户的金句) 渲染成一张拟真度极高的 X 帖子卡片, 用于视频叠加、推特发图、知识沉淀。Inspired by hyperframes x-post。

【画布】1280×720 或 1080×1080, 暗背景 `#0f1419` 或亮背景 `#ffffff` (按 X 主题); 卡片居中, 阴影柔和。

【卡片结构】
- 外框: 圆角 16px, 1px border `#2f3336` (dark) / `#eff3f4` (light), 内边距 16px。
- 顶部 row: 头像 (48×48 圆形, 用 CSS gradient 占位) + 用户名 + handle `@username` + verified 蓝勾 + 时间 (mono, 12px, 灰)。
- 正文: 17-22px, 字重 400; 链接用 X 蓝 `#1d9bf0`; hashtag 同色; mention 同色; 段落间空 0.6em。
- 可选: 引用卡 (小卡内嵌, 灰底, 圆角 12px)。
- 可选: 1 张图 (CSS 渐变 + 描述占位, 不能外链图片), 比例 16:9, 圆角 12px。
- 互动 row: 4 个 icon + 数字 (回复 / 转推 / 引用 / 点赞), icon 用 inline SVG (X 官方风格), 灰色, hover 时变色。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/social-x-post-card/SKILL.md_

### `skills/soft-skill/SKILL.md`
_Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic._

#### Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)

##### 1. Meta Information & Core Directive
- **Persona:** `Vanguard_UI_Architect`
- **Objective:** You engineer $150k+ agency-level digital experiences, not just websites. Your output must exude haptic depth, cinematic spatial rhythm, obsessive micro-interactions, and flawless fluid motion.
- **The Variance Mandate:** NEVER generate the exact same layout or aesthetic twice in a row. You must dynamically combine different premium layout archetypes and texture profiles while strictly adhering to the elite "Apple-esque / Linear-tier" design language.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/soft-skill/SKILL.md_

### `skills/speech/SKILL.md`
_Generate spoken audio from text using OpenAI's API with built-in voices. Useful for narrated explainers, lecture audio, and quick voiceover tracks._

#### speech

> Curated from OpenAI's skills repository.

##### What it does

Generate spoken audio from text using OpenAI's API with built-in voices. Useful for narrated explainers, lecture audio, and quick voiceover tracks.

##### Source

- Upstream: https://github.com/openai/skills
- Category: `audio-music`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/speech/SKILL.md_

### `skills/stitch-loop/SKILL.md`
_Iterative design-to-code feedback loop. Critique → adjust → ship cycle for tightening visual fidelity between brief and built UI._

#### stitch-loop

> Curated from Google Labs (Stitch).

##### What it does

Iterative design-to-code feedback loop. Critique → adjust → ship cycle for tightening visual fidelity between brief and built UI.

##### Source

- Upstream: https://github.com/google-labs-code/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/stitch-loop/SKILL.md_

### `skills/stitch-skill/SKILL.md`
_Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-accelerated performance._

#### Stitch Design Taste — Semantic Design System Skill

##### Overview
This skill generates `DESIGN.md` files optimized for Google Stitch screen generation. It translates the battle-tested anti-slop frontend engineering directives into Stitch's native semantic design language — descriptive, natural-language rules paired with precise values that Stitch's AI agent can interpret to produce premium, non-generic interfaces.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/stitch-skill/SKILL.md_

### `skills/swiftui-design/SKILL.md`
_SwiftUI 前端设计 skill — anti AI-slop rules, design direction advisor, brand asset protocol, and five-dimension review. Works with Claude Code, Cursor, Codex, and OpenCode._

#### swiftui-design

> Curated from @wholiver.

##### What it does

SwiftUI 前端设计 skill — anti AI-slop rules, design direction advisor, brand asset protocol, and five-dimension review. Works with Claude Code, Cursor, Codex, and OpenCode.

##### Source

- Upstream: https://github.com/wholiver/swiftui-design-skill
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/swiftui-design/SKILL.md_

### `skills/swiss-creative-mode-template/SKILL.md`
_Swiss-inspired creative-mode presentation template skill with bold editorial typography, high-contrast geometric cards, interactive slide navigation, theme switching, hotspot overlays, and palette choreography in a single-file HTML artifact. Use when users ask for a premium presentation-style landing, a Swiss/brutalist deck look, or a creative launch page with rich interactions._

#### Swiss Creative Mode Template

Produce a premium Swiss/editorial-style HTML template with strong visual rhythm
and meaningful interactions, then emit it as a single-file artifact.

##### Resource map

```text
swiss-creative-mode-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/swiss-creative-mode-template/SKILL.md_

### `skills/swiss-user-research-video-template/SKILL.md`
_Swiss-style user-research narrative template in warm-paper editorial aesthetics. Use when users ask for a premium research deck or story-first live artifact with minimalist typography, high-clarity layout, subtle motion, donut breakdowns, and keyboard/click navigation across slides in a single HTML file._

#### Swiss User Research Video Template

A premium Swiss-editorial user research template for narrative-heavy live artifacts.
The visual language is warm paper, strict spacing rhythm, thin rules, and restrained
micro-interactions that keep attention on the story.

##### Resource map

```text
swiss-user-research-video-template/
├── SKILL.md
├── assets/
│   └── template.html
├── references/
│   └── checklist.md
└── example.html
```


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/swiss-user-research-video-template/SKILL.md_

### `skills/taste-skill-v1/SKILL.md`
_The original v1 taste-skill, preserved for projects depending on its exact behavior. The current default is `design-taste-frontend` (v2 experimental), which is a substantial rewrite. Use this v1 install name only if you need exact backward compatibility._

#### High-Agency Frontend Skill

##### 1. ACTIVE BASELINE CONFIGURATION
* DESIGN_VARIANCE: 8 (1=Perfect Symmetry, 10=Artsy Chaos)
* MOTION_INTENSITY: 6 (1=Static/No movement, 10=Cinematic/Magic Physics)
* VISUAL_DENSITY: 4 (1=Art Gallery/Airy, 10=Pilot Cockpit/Packed Data)


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/taste-skill-v1/SKILL.md_

### `skills/theme-factory/SKILL.md`
_Apply professional font and color themes to artifacts including slides, docs, reports, and HTML landing pages. Ships 10 pre-set themes._

#### theme-factory

> Curated from Anthropic's official skills repository.

##### What it does

Apply professional font and color themes to artifacts including slides, docs, reports, and HTML landing pages. Ships 10 pre-set themes.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/theme-factory
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/theme-factory/SKILL.md_

### `skills/threejs/SKILL.md`
_Three.js skills for creating 3D elements and interactive experiences in the browser — scenes, materials, controls, and post-processing._

#### threejs

> Curated from CloudAI-X.

##### What it does

Three.js skills for creating 3D elements and interactive experiences in the browser — scenes, materials, controls, and post-processing.

##### Source

- Upstream: https://github.com/CloudAI-X/threejs-skills
- Category: `3d-shaders`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/threejs/SKILL.md_

### `skills/ui-animation/SKILL.md`
_Implement, review, and measure UI motion. Reconstruct easing, springs and gestures from a recording using bundled frame extraction, tracking and curve-fitting tools when available._

#### UI Animation

##### Open Design execution context

Use this as a functional helper on the user's current interface or accepted
brief. Keep the host's task route, current stage, tool availability, and output
contract. Planning describes the motion; implementation happens only in the
host's authoring stage. Do not add an extra review, recording, rendering, or
approval phase when the host disallows it. Reuse the project's existing stack
and motion tokens. Companion skills are optional: use them only if installed;
otherwise apply the relevant guidance here without inventing a tool invocation.

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ui-animation/SKILL.md_

### `skills/ui-skills/SKILL.md`
_Opinionated, evolving constraints to guide agents when building interfaces. Useful for keeping output coherent across many small UI pieces._

#### ui-skills

> Curated from @ibelick.

##### What it does

Opinionated, evolving constraints to guide agents when building interfaces. Useful for keeping output coherent across many small UI pieces.

##### Source

- Upstream: https://github.com/ibelick/ui-skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ui-skills/SKILL.md_

### `skills/ui-ux-pro-max/SKILL.md`
_Catalog-only UI/UX Pro Max entry. The full upstream templates, data, and search workflow are not bundled in OpenDesign._

#### ui-ux-pro-max

> Curated from @nextlevelbuilder.

##### What it does

Catalog-only UI/UX Pro Max entry. The full upstream templates, data, and search workflow are not bundled in OpenDesign.

##### Current OpenDesign scope

OpenDesign currently ships this entry as discovery metadata only. If this `SKILL.md`
is the only file under `skills/ui-ux-pro-max/`, the upstream UI/UX Pro Max
workflow is not available locally.

The full upstream workflow expects additional assets such as the searchable
`data` CSVs, the `scripts/search.py` helper, reference material, templates, and

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/ui-ux-pro-max/SKILL.md_

### `skills/vfx-text-cursor/SKILL.md`
_Cursor light trail, chromatic rays, and directional flares for word-by-word quote reveals in video intros._

【模板: VFX 文字光标 (Text Cursor)】
【意图】视频开场/Hero 帧 —— 光标在画布上"打字", 文字逐字浮现, 后面拖着彩色像散尾迹 + 定向光斑。Inspired by hyperframes vfx-text-cursor。

【画布】1920×1080, 背景 `#06070a` 暗哑黑 或 `#0a0d12` (有暖偏蓝); 加微妙 vignette。

【内容】
- 一句金句 (中英不限), 居中, 字号 6-8vw, weight 700, 字体 `Inter Tight` / `Source Sans 3` / `Noto Sans SC`。
- 逐字揭示, 每个字符 80ms 间隔; 当前字符后面跟着一个 cursor `▍` (或细 vertical bar)。
- 已揭示文字默认白色 `#f5f5f7`, opacity 1; 即将揭示位置加 chromatic ghost: 一份 `text-shadow: 2px 0 #ff3b6f, -2px 0 #00d4ff` 在 reveal 瞬间, 200ms 内收敛回正常。

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/vfx-text-cursor/SKILL.md_

### `skills/video-downloader/SKILL.md`
_Download videos from YouTube and other platforms for offline viewing, editing, or archival with support for various formats and quality options._

#### video-downloader

> Curated from ComposioHQ awesome-claude-skills.

##### What it does

Download videos from YouTube and other platforms for offline viewing, editing, or archival with support for various formats and quality options.

##### Source

- Upstream: https://github.com/ComposioHQ/awesome-claude-skills/tree/master/video-downloader
- Category: `video-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/video-downloader/SKILL.md_

### `skills/web-artifacts-builder/SKILL.md`
_Build complex claude.ai HTML artifacts with React and Tailwind. Anthropic's reference workflow for shipping rich, embeddable artifacts._

#### web-artifacts-builder

> Curated from Anthropic's official skills repository.

##### What it does

Build complex claude.ai HTML artifacts with React and Tailwind. Anthropic's reference workflow for shipping rich, embeddable artifacts.

##### Source

- Upstream: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
- Category: `web-artifacts`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/web-artifacts-builder/SKILL.md_

### `skills/web-design-guidelines/SKILL.md`
_Review UI code for Web Interface Guidelines compliance by the Vercel engineering team. Covers layout, typography, color, motion, and accessibility for product UI._

#### Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

##### How It Works

1. Load the pinned guidelines from [`references/guidelines.md`](references/guidelines.md) — this is the default, reproducible execution path
2. Optionally, fetch the latest guidelines from the upstream URL below and diff against the pinned snapshot to see if anything has changed
3. Read the specified files (or prompt user for files/pattern)
4. Check against all rules in the guidelines
5. Output findings in the terse `file:line` format


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/web-design-guidelines/SKILL.md_

### `skills/weread-year-in-review-video-template/SKILL.md`
_WeRead-inspired HyperFrames video template for vertical annual reading reports, personal reading dashboards, book-note recaps, and shareable year-in-review stories. Use when users want a 9:16 HTML-to-MP4 reading report with warm paper texture, editorial Chinese typography, book-page metaphors, data highlights, and deterministic motion._

#### WeRead Year in Review Video Template

Create a vertical HyperFrames composition for annual reading reports: WeRead,
Goodreads, Readwise, Notion reading logs, book clubs, or personal learning
recaps. The template turns reading time, active days, bookshelf assets, notes,
keywords, and a reading persona into a shareable 9:16 video.


_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/weread-year-in-review-video-template/SKILL.md_

### `skills/wpds/SKILL.md`
_WordPress Design System. Apply WordPress's official design tokens, typography, and component patterns to themes and sites._

#### wpds

> Curated from the WordPress development team.

##### What it does

WordPress Design System. Apply WordPress's official design tokens, typography, and component patterns to themes and sites.

##### Source

- Upstream: https://github.com/WordPress/skills
- Category: `design-systems`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/wpds/SKILL.md_

### `skills/youtube-clipper/SKILL.md`
_YouTube clip generation and editing with automated workflows — pull source video, slice highlights, add captions, and export._

#### youtube-clipper

> Curated from @op7418.

##### What it does

YouTube clip generation and editing with automated workflows — pull source video, slice highlights, add captions, and export.

##### Source

- Upstream: https://github.com/op7418/Youtube-clipper-skill
- Category: `video-generation`

##### How to use

This catalogue entry advertises the skill in OpenDesign so the agent
discovers it during planning. To run the full upstream workflow with
its original assets, scripts, and references, install the upstream
bundle into your active agent's skills directory:

```bash
```

_…condensed; full text: https://github.com/nexu-io/open-design/blob/e033aad/skills/youtube-clipper/SKILL.md_

## Appendix E — Design templates index

### `design-templates/AGENTS.md`
#### design-templates

This directory holds **design templates** — packaged "shapes" the agent
renders into a project artifact (decks, prototypes, image/video/audio
templates, …). Each entry is a folder with a `SKILL.md` (same shape as
functional skills) plus rendering side files (`example.html`,
`assets/`, `references/`, …).

If the entry primarily *does work* on user input — utilities, briefs,
asset packagers, fidelity audits — it belongs under `../skills/`
instead. See `specs/current/skills-and-design-templates.md` for the
full split.

##### Daemon plumbing

- Listed under `/api/design-templates`. The shape mirrors `/api/skills`
  (same `SkillSummary`/`SkillDetail` types) so the web client can
  reuse a single `SkillSummary[]` consumer for both surfaces.
- Asset and example routes (`/api/skills/:id/example`,
  `/api/skills/:id/assets/*`) intentionally span both registries — the
  example HTML rewrites to `/api/skills/<id>/...` regardless of which
  root owns the folder, so URLs keep resolving after the split.
- Surfaced in the New-project panel's per-mode "Start from" rail as the
  rendering catalogue; the redesigned home has no top-level Templates tab.

##### Adding a design template

1. Create `design-templates/<my-template>/SKILL.md` with `name`,
   `description`, `triggers`, and an explicit `od.mode` (one of
   `prototype`, `deck`, `template`, `image`, `video`, `audio`).
2. Ship a baked `example.html` (and any side files) so the shared example and
   asset routes have preview content to serve.
3. Optionally drop additional baked samples under `examples/<key>.html`
   to surface them as derived `<parent>:<key>` cards.

##### Deck preview navigation contract

Any template with `od.mode: deck` must make its baked `example.html`
usable inside the gallery iframe without relying on the host app to add
navigation. Use a shared deck runtime where one is available; otherwise
ship a tiny local runtime with the same minimum behavior.

- **Keyboard:** `ArrowRight` / `ArrowDown` / `PageDown` / `Space` move to
  the next slide; `ArrowLeft` / `ArrowUp` / `PageUp` move to the previous
  slide; `Home` and `End` jump to the first and last slide. Ignore events
  from inputs, selects, textareas, and editable regions.
- **Wheel / trackpad:** accumulated `deltaX + deltaY` past a small threshold
  moves exactly one slide, then resets quickly so a single gesture does not
  overshoot.
- **Touch:** a horizontal swipe of roughly 50px or more, greater than the
  vertical movement, moves previous / next.
- **Dots:** render one clickable button per slide, update the active dot on
  every navigation path, and mark it with `aria-current="true"`.
- **Active slide state:** keep the visible slide marked with
  `.slide.active`; adding `.is-active` as a compatibility alias is fine.
  OpenDesign's preview bridge reads this state for the host slide counter,
  so it must stay in sync with keyboard, wheel, touch, and dot navigation.
- **Iframe safety:** focus the deck on load / pointer interaction so keyboard
  navigation works after the gallery preview appears. Avoid
  `scrollIntoView()` because it can move the parent page instead of the deck.
- **Fallbacks:** no-script and print output should still expose every slide.
  Hide non-active slides only after the runtime has booted.

---
**Source & credit:** [nexu-io/open-design](https://github.com/nexu-io/open-design) @ `e033aad` (cloned 2026-11-22). License: Apache-2.0 (bundled third-party skills keep their own licenses). All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
