# Template library

The complete starter pack of programmatic overlay templates. All rendered in Remotion at the source's aspect ratio (default 9:16), all on-brand by construction (raisin black + silver + neo lime + Space Grotesk Bold).

When planning a video, pick the template whose "when to use" matches what the speaker is doing in that beat. If multiple feel right, prefer the more specific one (e.g. `stat_punch` over `callout` when there's a hero number).

| # | Kind | When to use | Hold | Component |
|---|------|-------------|------|-----------|
| 01 | `title_card` | Section/chapter opener. Big number + bold uppercase title. Hook lines like "5 things" / "3 lessons." | 2.5–4s | [TitleCard.tsx](../remotion/src/templates/TitleCard.tsx) |
| 02 | `vertical_timeline` | Walking through 3–5 sequential steps with heading + one-line description. Items reveal in sync with speaker. Best for processes, methodologies, frameworks. | 6–10s | [VerticalTimeline.tsx](../remotion/src/templates/VerticalTimeline.tsx) |
| 03 | `callout` | A single statement with one phrase highlighted in lime. The "remember this line" moment, the punchline beat. | 2.5–4s | [Callout.tsx](../remotion/src/templates/Callout.tsx) |
| 04 | `stat_punch` | One huge number anchored center, supporting caption below. Mid-sentence on a landing word ("73 percent…", "$10K MRR…"). | 1.5–2.5s | [StatPunch.tsx](../remotion/src/templates/StatPunch.tsx) |
| 05 | `quote_pull` | Reading a tweet, comment, or customer line verbatim. Lime quote glyph + attribution. The "receipt" beat. | 3–5s | [QuotePull.tsx](../remotion/src/templates/QuotePull.tsx) |
| 06 | `vs_split` | Stacked top/bottom contrast (old/new, before/after, X/Y). Lime accent goes on the winning side. The "argue two options in one shot" template. | 3–5s | [VsSplit.tsx](../remotion/src/templates/VsSplit.tsx) |
| 07 | `keyword_chips` | Pill-shaped tags pop in as speaker name-drops 4–8 short tokens (tools, frameworks, vocabulary). | 2.5–4s | [KeywordChips.tsx](../remotion/src/templates/KeywordChips.tsx) |
| 08 | `progress_steps` | Vertical numbered chain that fills with lime as the speaker walks through 3–5 named steps. Glanceable pipeline recap. | 3–5s | [ProgressSteps.tsx](../remotion/src/templates/ProgressSteps.tsx) |
| 09 | `chapter_bar` | Persistent chapter marker pinned bottom-third over the speaker. Editorial "what part is this" tag — NOT a name/title chyron. | 6–10s | [ChapterBar.tsx](../remotion/src/templates/ChapterBar.tsx) |
| 10 | `ai_image_on_grid` | Generated AI subject (database, key, chart) composited over the brand grid background. Same grid as the templates, so the video stays unified across programmatic + AI beats. | 2.5–4s | [AIImageOnGrid.tsx](../remotion/src/templates/AIImageOnGrid.tsx) |
| 11 | `list` (existing) | Simple numbered list with per-item appear-on-cue timing. Less structured than `vertical_timeline` (no descriptions). | 3–6s | [EditedVideo.tsx ListOverlay](../remotion/src/EditedVideo.tsx) |
| 12 | `static` | Real screenshot, AI-generated image, or branded asset. Defaults to full-bleed; pass `inset: 0.10` for a smaller "card on the brand grid" look (preserves edges, no Ken Burns crop). | 2.5–4s standalone, 2.5–3.0s with inset | [EditedVideo.tsx StaticOverlay](../remotion/src/EditedVideo.tsx) |
| 13 | `icon` | Floating brand mark / logo over the speaker. **`bare: true`** = just image with rounded corners + drop-shadow, no white card (use for branded assets that already have their own background). Otherwise wraps in a white rounded card. | 0.8–2.0s | [EditedVideo.tsx IconOverlay](../remotion/src/EditedVideo.tsx) |
| 14 | `horizontal_timeline` | **Static** N-card strip across the frame for "what you'll learn" / chapter previews. Cards reveal in sequence at their `appear_sec` then **stay locked in place** — never panning. Each card has a number chip + bold heading + one-line description. Auto-fits 3–5 cards across the frame. | 4.5–6.0s | [HorizontalTimeline.tsx](../remotion/src/templates/HorizontalTimeline.tsx) |
| 15 | `captions` (auto) | NOT a per-beat kind — generated automatically from `words.json` for 16:9 sources. Lower-third phrase-level lines (currently-spoken word lit lime), plus large-center cinematic emphasis pop-ups for phrases marked via `CAPTION_EMPHASIS`. Filtered out automatically when a takeover beat is on screen. | continuous | [Captions.tsx](../remotion/src/templates/Captions.tsx) |
| 16 | `metric_reveal` | Animated count-up from 0 → `target` with optional `prefix` (lime, on raisin chip) and `suffix` (lime, on raisin chip), `pre_label` above, caption beneath. Auto-fits hero font size, tabular nums so digits don't shift width. Counter eases into landing, then settle-zoom 1.0 → 1.025. **Use for growth / revenue / retention reveals** — the magnitude lands during the count, not before. Richer than `stat_punch` for any number that should feel earned. | 3–4s | [MetricReveal.tsx](../remotion/src/templates/MetricReveal.tsx) |
| 17 | `notification_toast` | iOS/macOS-style push notification slides in from top, holds, slides out. **PARTIAL overlay** — speaker stays visible behind it; component renders NO backdrop of its own. Lime app-icon square with `✦` mark (or pass `app_icon` for a real image), `app_name` uppercase, `title` bold, `body` clamped to 2 lines, `time` right-aligned. Anchor `top-right` (default) or `top-center`. **Use for "I got a Slack saying X" / "my routine pinged me" beats.** | 2.5–3.5s | [NotificationToast.tsx](../remotion/src/templates/NotificationToast.tsx) |
| 18 | `chat_message` | iMessage-style speech-bubble conversation. Bubbles pop in sequentially: `user` right (raisin black bg, white text), `agent` left (lime bg, raisin text), `other` left (raisin-steel bg, white text). Optional `name` label above each bubble (auto-hides for consecutive same-role bubbles). Multi-line text via `\n`, max 5 lines per bubble with ellipsis. **Use for "I asked Claude X and it said Y" / agent dialogues / customer conversations.** | 4–6s (depends on bubble count) | [ChatMessage.tsx](../remotion/src/templates/ChatMessage.tsx) |
| 19 | `stat_grid` | 1×N or 2×N grid of mini-stat cards (each with hero value + label + optional `+delta` chip). Auto-picks layout for 1–6 stats. Each cell pops in at its own `appear_sec`. Positive deltas (`+`, `↑`) get a lime chip; neutral get grey. **Use when speaker rattles off multiple numbers** ("12 schedules, 18 routines, 22 skills, 48 edge fns"). | 3.5–5.0s | [StatGrid.tsx](../remotion/src/templates/StatGrid.tsx) |
| 20 | `flow_diagram` | Horizontal pipeline of 2–5 nodes connected by arrows. Each node has optional `glyph` (emoji), bold `label`, optional `description`. Nodes pop in left-to-right; arrows wipe between them. Mark one node `highlight: true` for the lime fill (the "current" or "winning" node). **Use for showing a workflow / data pipeline / decision sequence** ("trigger → fetch → score → send"). | 4.5–6.0s | [FlowDiagram.tsx](../remotion/src/templates/FlowDiagram.tsx) |
| 21 | `bulleted_list` | Vertical list with semantic glyph chips: `check` (lime ✓), `x` (raisin ✗), `dot` (lime •), `arrow` (lime →), `warn` (amber !). Items reveal one at a time, slide in from left. **Use for yes/no checklists, requirements lists, single-column pros/cons.** Richer than `list` (which has just numbered items) when the glyphs themselves carry meaning. | 3.5–5.0s | [BulletedList.tsx](../remotion/src/templates/BulletedList.tsx) |
| 22 | `comparison_grid` | 2–4 column × 2–6 row feature matrix. Headers fade in left-to-right; rows reveal top-to-bottom. Boolean cells render ✓ (lime circle) or ✗ (grey circle); strings render verbatim with 2-line clamp. Mark one column `winner: true` for the lime header. **Goes beyond `vs_split`** (which only handles 2 sides) — use when the speaker compares 3+ options on the same set of features. | 5.0–7.0s | [ComparisonGrid.tsx](../remotion/src/templates/ComparisonGrid.tsx) |
| 23 | `bar_chart` | Animated horizontal/vertical bars that grow from 0 → value over ~0.75s with smooth ease. Value labels tick up in sync with the bar (the digit reads land WITH the bar tip, not before/after). Highlight one bar with the lime accent. Auto-axis scaling. **Use for growth comparisons, rankings, before/after metrics, multi-option stats where size differences need to be FELT.** | 4.5–6.5s | [BarChart.tsx](../remotion/src/templates/BarChart.tsx) |
| 24 | `network_diagram` | Circular nodes connected by animated edges. Nodes pop in sequence; edges draw left-to-right with arrowheads, optional `flowing: true` adds a marching-ants packet traveling along the edge to suggest data movement. Optional edge labels in lime pills. Manual `x,y` positioning (0–1 fraction) or auto-layout. **Use for system topology, agent maps, decision branches, anything where RELATIONSHIPS matter beyond simple sequence** (use `flow_diagram` for sequential pipelines). | 5.5–8.0s | [NetworkDiagram.tsx](../remotion/src/templates/NetworkDiagram.tsx) |
| 25 | `annotated_screenshot` | Real screenshot with lime corner-brackets that draw in around specific UI regions, plus optional callout pill labels. A vignette darkens everything OUTSIDE the active highlights; the highlighted regions stay full-brightness. Optional `zoom_to_highlights: true` — after all annotations land, the camera pans + zooms toward the union of highlights. **Use for "look at THIS specific button on the dashboard", drawing the eye to a tiny part of a complex UI.** | 5.0–8.0s | [AnnotatedScreenshot.tsx](../remotion/src/templates/AnnotatedScreenshot.tsx) |
| 26 | `cinematic_title` | Chapter divider for longform: curtain wipe → kicker → big lime chapter number slams in from below → lime divider line wipes → title slides in from the right → subtitle fades up beneath. **The "we're moving on to a new section" beat between major chapters of a 5+ min video.** Don't overuse — once per major section, max ~4 in a 15min video. | 3.0–4.5s | [CinematicTitle.tsx](../remotion/src/templates/CinematicTitle.tsx) |
| 27 | `ticker_feed` | Live activity feed — newest item appears at TOP, older items slide DOWN, after 5 visible items the oldest fades off the bottom. Each row has a lime border-left that lights up on entrance then dims as the row ages. Optional emoji glyph, lime label, body text (2-line clamp), monospace timestamp. **Use for automation event logs, build-step progress, transaction feeds, "here's what my routine just did" beats.** | 5.0–8.0s | [TickerFeed.tsx](../remotion/src/templates/TickerFeed.tsx) |
| 29 | `concept_build` | **Flagship "more than a diagram" explainer.** Free-form VO-synced canvas: place labeled `elements` (`box` / `chip` / `tile` / `frame` / `note`) at arbitrary `x,y` positions and `connectors` between them; each piece reveals (motion-blur settle) on its spoken `appear_sec`, so the mental model assembles WITH the narration. `frame` elements render as a containing outline behind others (show "X lives INSIDE Y"). Use for **structure / composition / metaphor** builds the rigid `flow_diagram` (sequence) and `network_diagram` (topology) can't express. Dark canvas, living hold, choreographed exit. See [concept_visualization.md](concept_visualization.md). | 4.5–8.0s | [ConceptBuild.tsx](../remotion/src/templates/ConceptBuild.tsx) |
| 28 | `split_reveal` | Cinematic before/after wipe. Before image renders first, AFTER image clipped to the wipe edge. A glowing lime divider line + drag-handle marker travels left → right, revealing the after image. "BEFORE" chip bottom-left (raisin), "AFTER" chip bottom-right (lime). Settle-zoom on the after image once the wipe completes. **Use for visual proof of an actual change** (messy inbox → empty inbox; old dashboard → new dashboard). Both images should share aspect ratio + framing. | 3.0–5.0s | [SplitReveal.tsx](../remotion/src/templates/SplitReveal.tsx) |

## Choosing the right one — decision tree

1. **Is the speaker dropping a single number?** → `stat_punch`
2. **Is the speaker reading someone else's words?** → `quote_pull`
3. **Is the speaker arguing X vs Y?** → `vs_split`
4. **Is the speaker name-dropping tools/terms?** → `keyword_chips`
5. **Is the speaker walking through ordered steps with descriptions?** → `vertical_timeline`
6. **…or just naming the steps quickly?** → `progress_steps`
7. **Is the speaker enumerating short items (no descriptions)?** → `list`
8. **Is this a chapter / section opener?** → `title_card`
9. **Does this section need a persistent context tag while speaker talks?** → `chapter_bar`
10. **Is the speaker describing one specific concrete thing (a database, a key, a chart)?** → `ai_image_on_grid` or `static` (real screenshot if a real product)
11. **Is the speaker delivering the punchline of the section?** → `callout`
12. **Is the speaker dropping a number that should FEEL big as it lands** (revenue, growth, retention, count)? → `metric_reveal` (animated count-up beats `stat_punch`'s static reveal here)
13. **Is the speaker quoting an inbound message** ("I got a Slack saying X", "my routine pinged me", "I got an email")? → `notification_toast` (partial overlay, speaker stays visible)
14. **Is the speaker quoting a back-and-forth conversation** ("I asked Claude X and it said Y")? → `chat_message`
15. **Is the speaker rattling off multiple numbers in sequence** (dashboard / KPI roundup)? → `stat_grid`
16. **Is the speaker walking through a workflow / pipeline** with named stages? → `flow_diagram`
17. **Is the speaker running a yes/no checklist** ("does it repeat? ✓ predictable? ✓ has fallback? ✗")? → `bulleted_list` with mixed glyphs
18. **Is the speaker comparing 3 or 4 options across multiple features**? → `comparison_grid` (use `vs_split` for exactly 2)
19. **Are the magnitudes of multiple numbers the point** (week 1 → 4 growth, this vs that revenue)? → `bar_chart`
20. **Is the speaker explaining how SYSTEMS connect** (cron → fetch → score → send, agents that talk to each other, branching decisions)? → `network_diagram` (with `flowing: true` on edges where data is moving)
21. **Is the speaker pointing at something tiny in a screenshot** ("look at this button", "see this status indicator")? → `annotated_screenshot` with `highlights[]` + optional `zoom_to_highlights: true`
22. **Are we transitioning to a new MAJOR section** of a 5+ min longform? → `cinematic_title` with chapter / title / subtitle (use sparingly — max once per real chapter)
23. **Is the speaker walking through a sequence of EVENTS happening in time** ("the routine triggered, then fetched, then scored, then sent")? → `ticker_feed` (kinetic — items slide as new ones land)
24. **Is the speaker showing visual PROOF of a change** (before/after dashboard, messy → clean inbox, old UI → new UI)? → `split_reveal` (need two screenshots with same framing)

## Don't add to the library

- Lower-thirds with name + title (chyron) — not the editorial register
- Countdown timers — gimmicky
- Kinetic word-by-word text — fights the burned-in caption track
- 3D perspective effects — wrong aesthetic
- Animated arrow-callouts pointing at things — lower-third territory

## Aspect ratio

All templates auto-size to the source's aspect ratio via `useVideoConfig`. **Type sizes anchor on `useTypeBase()` = `min(width, height)`** so the same template reads at the same balance in both 9:16 and 16:9. (The previous "bump font sizes 1.4× in 16:9" rule is obsolete — `useTypeBase` does it automatically. See [motion.ts](../remotion/src/templates/motion.ts).)

When you add new templates, use `useTypeBase()` for any font-size calculation and `useVideoConfig().width` / `.height` for layout dimensions (padding, gap, card width). Don't mix the two — `width * X` for a font size will look oversized in landscape.

## Word breaking — never hyphenate

All text in templates uses:

```css
overflowWrap: "break-word",
wordBreak: "normal",
hyphens: "manual",
```

**Never `hyphens: "auto"`** — it produces broken visuals like "actu-ally" / "deter-ministic". Words wrap on whitespace only. Heading clamps to 2 lines, description to 3, with `text-overflow: ellipsis` so impossibly-long copy truncates rather than overflows the card.

## Static `inset` mode

`static` beats accept an optional `inset: 0.10` (or any 0–0.40 value). When set:
- Image renders at `(1 − 2·inset)` of frame, centered
- Backdrop swaps to the on-brand `DarkGridBg` (raisin gradient + lime grid lines)
- Ken Burns breathing is DISABLED (so dashboard edges don't crop on the way through)
- Image gets soft drop-shadow, NO wrapping card (per the May 2026 fix)

Use for screenshots where every pixel matters (dashboards, IDE views, settings panels). Default (no inset) is full-bleed with breathing — used for hero illustrations.

## Icon `bare` mode

`icon` beats accept `bare: true`. When set:
- Image is centered with `objectFit: contain`, NO white card wrapper
- Rounded corners applied directly to the image
- Soft drop-shadow lifts it off the speaker
- Pair with `aspect: <image_w/image_h>` so the bounding box matches the image and there's no letterboxing

Use for brand logos / marks that already have their own background. Default (no `bare`) is the legacy white-card icon, used for tool icons / single emoji-like assets.

## Adding a new template

1. Create `templates/<Name>.tsx`. Follow the conventions:
   - Take typed props.
   - Use `useVideoConfig` for sizing — never hard-code pixel dimensions.
   - Use `Easing.bezier(0.4, 0, 0.2, 1)` (Material standard) or `spring()` for entrances.
   - Single neo-lime accent per frame (rule §4f).
   - No `position: absolute` per-item if you can use flow layout (rule §4l).
2. Add a section to `StyleShowcase.tsx` with a `SectionTag` that includes a "when to use" description.
3. Add a row to the table above.
4. Update `EditedVideo.tsx` `BRoll` type to include the new `kind`, and the kind dispatcher in the Sequence map.
