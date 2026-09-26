# Direction Intake — questionnaire + reference analysis (Phase P0)

Replaces the old Google Stitch step. The client (or Mr. Black) answers a structured
questionnaire and **attaches references — images, links, videos — as the design and UI/UX
direction.** Claude analyzes every reference, extracts what is actually liked about it, and
compiles one **Direction Brief** (`templates/direction-brief.yaml`) that P1 locks into tokens.

**This is always the first step of every build — nothing is designed, generated or coded before it.**
If a lead brief, Brand Token Package or `ui-ux-designer` Handoff Package already exists, use it to
pre-fill answers and only ask what's missing or unconfirmed — the intake is shortened, never skipped.

---

## How to run it

1. **Send the questionnaire in rounds, not as one wall.** Round 1 = Sections A–C. Round 2 = D–F.
   Round 3 = G–H. Each round is one message; the person answers in one reply and attaches files there.
2. **Uploads:** in chat, drag files in (images, screenshots, PDFs, short video clips) or paste links
   (websites, YouTube, Instagram, TikTok, Dribbble, Behance, Pinterest, Figma, Google Drive, Loom).
   In Claude Code, file paths or a folder (`./references/`) work too.
3. **Every reference needs a note:** "what I like about this" and, if any, "what I don't". A reference
   with no note is ambiguous — ask once: *"What should I take from this one — the colors, the
   layout, the motion, the type, or the overall feel?"*
4. Tag each reference with what it's for: `LOOK` (color/type/texture), `LAYOUT` (structure/grid),
   `MOTION` (animation/scroll), `COPY` (tone), `FEATURE` (a specific interaction), `AVOID`.
5. Required questions are marked ●. Unanswered optional ones get sensible defaults — never block on them.

---

## The questionnaire

### Section A — The business (●)
1. ● Business name, what you sell/do, and where (city/service area or online).
2. ● Who is the ideal customer? (age, income, what they care about, how they find you)
3. ● The single action a visitor should take (book, call, buy, sign up, request a quote, join a list).
4. ● What makes you different from the three competitors a customer would compare you with?
5. Price position: budget · mid-market · premium · luxury.
6. Existing site URL, logo files, brand guide, Google Business Profile link. *(upload / link)*

### Section B — Proof you actually have (●)
7. ● Real reviews/testimonials you can use (paste or screenshot) and their source.
8. Real numbers you can stand behind (years, clients, results, ratings). **No invented stats.**
9. Photos/video of your actual work, team, space or product. *(upload)*
10. Press, awards, certifications, partner logos. *(upload / link)*

### Section C — Feeling and personality (●)
11. ● Three words the site should feel like (e.g. *calm, expensive, precise*).
12. ● Three words it must **never** feel like (e.g. *cheap, corporate, cluttered*).
13. ● The one feeling in the first 3 seconds: awe · trust · excitement · calm · intrigue · hunger · status.
14. If your brand were a film, car, hotel or fashion house, which one and why?
15. Light or dark, or no preference? Any colors you love or will not accept?

### Section D — Visual references (● at least 3, up to 12)
16. ● **Websites you love** — links. For each: what exactly you like (hero? scroll feel? type? colors?).
17. **Images** — screenshots, moodboards, Pinterest pins, photography, packaging, interiors, posters. *(upload)*
18. **Competitor or peer sites** — links, marked `LOOK`, `LAYOUT` or `AVOID`.
19. **Anything you dislike** — sites/images that feel wrong for you, and why. *(upload / link, tag `AVOID`)*

### Section E — Motion and interaction references
20. **Videos or screen recordings** of sites/apps whose motion you love — Loom, MP4/MOV, YouTube/IG/TikTok links. Say the timestamp if it's one moment ("0:14, the way the photos fan out").
21. Motion level: 1 still and quiet → 5 cinematic, scroll-driven, immersive.
22. Any effect you already have in mind? Describe it in plain words (Claude names it via `animation-vocabulary`).
23. Anything that annoys you on other sites (autoplay video, popups, heavy scroll-jacking, slow loading)?

### Section F — Content and structure
24. ● Pages or sections you need (home, services, menu, gallery, pricing, about, FAQ, contact, booking…).
25. Do you have copy, or should it be written? Tone: formal · warm · bold · playful · technical.
26. Hero media: photo, looping video, product render, illustration, AI-generated scene, or type-only?
27. Should we generate custom imagery/video (Higgsfield)? Any people, products or locations that must appear? *(upload anchors)*
28. Integrations: booking tool, shop, forms/CRM, chat/voice agent, analytics, newsletter.

### Section G — Practical
29. ● Deadline and launch date.
30. Tier: Factory · Enhanced · Cinematic · Flagship (Claude recommends one if blank — see playbook §3).
31. Domain and hosting (or deploy with `sa-deploy-operator` to Vercel).
32. Accessibility or legal must-haves (ADA/WCAG, cookie consent, medical/financial disclaimers).

### Section H — Final check
33. Anything we haven't asked that matters?
34. Who approves the design, and how many revision rounds are expected?

---

## Reference analysis protocol

Run for every reference before writing the Direction Brief. Record findings per reference
(`references[]` in the brief) — observations, not adjectives.

| Reference type | How to analyze | Extract |
|---|---|---|
| **Image / screenshot** | View it directly. | Dominant + accent colors (approximate OKLCH/hex), contrast level, type style (serif/grotesk/display, weight, case, tracking), composition (grid, symmetry, negative space, focal point), texture (grain, glass, gradients, photography style, lighting), density. |
| **Website link** | `brand-extractor` (Brand Token Package) or `extract-design-system` for tokens; `defuddle` / `firecrawl-mcp` for content structure; screenshot it at 1440 and 390 with `scripts/verify.mjs`-style Playwright capture when motion or layout matters. | Palette, fonts actually loaded, section order, hero pattern, nav pattern, CTA placement, motion inventory (what moves, when, how — name each with `animation-vocabulary`), what it does on mobile. |
| **Video file / screen recording** | Pull frames: `ffmpeg -i ref.mp4 -vf "fps=2,scale=960:-2" frames/f_%03d.jpg`, view the key frames around any timestamp given; or `mcp__Higgsfield__video_analysis_create` for a written breakdown. | The motion itself: trigger (load / scroll / hover / click), duration, easing feel (snappy, floaty, springy), choreography (stagger, sequence, parallax depth), transitions between sections. Map each to a catalog module or flag it as custom. |
| **YouTube / social video link** | `sa-watch` or `sa-video-skill-extractor`; `sa-youtube-cli` for metadata/transcripts. | Same as video file; plus any technique the video teaches. |
| **Dribbble / Behance / Pinterest / Mobbin** | View the images; `mobbin-operator` for app flows. | Treat as images — and note it's a static concept (motion must be designed, not copied). |
| **Figma link** | Figma MCP `get_design_context` / `get_variable_defs` / `get_screenshot`. | Real tokens, components, spacing, frames per section. |
| **PDF brand guide** | Read it. | Locked logo usage, colors, fonts, voice. These override everything except legal. |

**Synthesis rules**
- Look for what **repeats** across references — that's the real taste. One-off traits are optional.
- Resolve conflicts by the note the person wrote; if two references contradict, ask once and show both.
- `AVOID` references create hard bans in the brief (e.g. "no neon gradients", "no auto-playing video").
- Never copy a reference's layout, copy, imagery or brand. Extract principles; build original work.
- Check every extracted font against `design-taste-frontend`'s banned list; propose the closest allowed alternative.
- Map every motion reference to catalog modules (`references/modules.md`) and cost it against the tier budget.

---

## Output — the Direction Brief

Fill `templates/direction-brief.yaml`, then show the person a **one-screen summary** before building:

> **Direction:** calm, expensive, precise — "Aesop meets a Swiss watch boutique".
> **Look:** warm off-black, bone text, one brass accent; editorial serif display + quiet grotesk.
> **Layout:** asymmetric editorial grid, huge type, lots of air (from refs 2, 5).
> **Motion (Enhanced, 32/45 pts):** masked line reveals, sticky product story, one horizontal gallery — the signature moment (from video ref 1 @0:14).
> **Avoid:** glass cards, neon, autoplay sound, stock photos (refs 7, 9).
> **Open questions:** 1) Are the review numbers verifiable? 2) Booking via Square or Calendly?

Proceed to P1 only after the person confirms or corrects the summary (one round).
