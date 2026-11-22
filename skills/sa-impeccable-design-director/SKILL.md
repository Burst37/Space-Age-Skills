---
name: sa-impeccable-design-director
description: Design vocabulary + reviewer for frontends: init, critique, audit, polish, bolder, quieter, distill, harden, animate, typeset, colorize, new-work, plus a 62-rule AI-slop detector. Use when the user says impeccable, critique this page, audit the UI, polish, make it bolder/quieter, de-slop, or design a new surface with a strong POV.
---

# SA Impeccable Design Director
Paul Bakaus's Impeccable: one design skill with ~45 command playbooks and a deterministic slop detector (62 rules, no LLM).

## Install
`npx impeccable install` in the project root, reload the agent, then `/impeccable init` (writes PRODUCT.md). `/impeccable document` writes DESIGN.md.

## Workflow
1. `scripts/impeccable context` once per session (upstream launcher; if unavailable, read PRODUCT.md/DESIGN.md yourself and say so).
2. Pick the mode: Persuade (landing/marketing), Operate (app UI), Read (docs), Experience (portfolio).
3. Load the command playbook from the Commands table (Appendix B): `critique`, `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `animate`, `typeset`, `colorize`, `layout`, `delight`, `adapt`, `onboard`, `optimize`, `overdrive`; new surface → `new-work.md`.
4. Read `craft-floor.md` right before any UI edit.
5. Verify by looking: `scripts/impeccable shot <page>`; batch fixes before the next look.
- Commands: `/impeccable critique the pricing cards`, `/impeccable quieter the landing page`, `/impeccable harden checkout`.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).
- Client websites: top-3 competitor teardown + SEO/AEO blueprint (seo-aeo-optimizer) first, then an approved moodboard, before any site code. AEO is equal to SEO.
- No liquid-glass or 3D goo type on law, SaaS, medical or home-healthcare sites.

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| impeccable | Use to design, redesign, critique, audit, polish or animate a frontend: websites, landing pages, dashboards, app UI, components, native iOS/Android screens, or a design system (DESIGN.md). | `plugin/skills/impeccable/SKILL.md` |

## Appendix B — Core skill

### `plugin/skills/impeccable/SKILL.md`
_Use to design, redesign, critique, audit, polish or animate a frontend: websites, landing pages, dashboards, app UI, components, native iOS/Android screens, or a design system (DESIGN.md)._

This skill gives you the tools and permission to make design that earns the name out-of-distribution craft. Work as an award-winning design director would: production-grade code, a clear POV, a deep grasp of what the client and its users need, and exceptional craft.

Core principles:
- Finish the job. No hedging, no shortcuts: the deliverable is complete, except assets the user must provide.
- Scale ambition to the surface's mode (see Modes). Persuade and Experience get full commitment: bold, distinct work with a point of view. On Operate and Read, ambition shows as precision and restraint, and patterns the visitor already knows earn their place.
- Verify by looking at the rendered result at the sizes it ships at (web: `"${CLAUDE_SKILL_DIR}/scripts/impeccable" shot <page>`), and batch the checks: fix what one look shows before looking again.

##### Setup

1. Run `"${CLAUDE_SKILL_DIR}/scripts/impeccable" context` once per session, where `${CLAUDE_SKILL_DIR}` is the directory that contains this SKILL.md (the skill folder, not a plugin root two levels above it); keep cwd at the user's project. Every `"${CLAUDE_SKILL_DIR}/scripts/impeccable" <verb>` command in this skill and its references resolves against that base directory. In reference files, replace the skill-base-dir placeholder with this directory before running commands; it is not a shell variable. On a Windows shell without `sh`, call `& "${CLAUDE_SKILL_DIR}/scripts/impeccable.cmd"` instead. The launcher runs a self-contained binary that ships next to it or is downloaded once on first run; no Node or other runtime is required. Pass a named source file or route as `--target <path>`. It loads PRODUCT.md and DESIGN.md (long ones as a map: read the sections your task needs), the matching surface brief, and native-platform guidance when applicable; follow its directives and do not rerun it.
2. Load the request's playbook: its Commands-table reference for an explicit/implied sub-command, or [reference/new-work.md](reference/new-work.md) for a new surface, a replacement visual world, or a build from an approved comp. Some playbooks come in parts; read the part this request needs in the same step: [reference/new-work-world.md](reference/new-work-world.md) when a visual world is created or replaced (a redesign, a new look, or no established world), [reference/new-work-comp.md](reference/new-work-comp.md) for a build from an approved comp or on a comp-led build path, and [reference/critique-rubric.md](reference/critique-rubric.md) for a critique whose Assessment A runs in this context (a native platform, or no sub-agent tool); a delegated Assessment A gets the rubric's path in its prompt instead. Inspect target and incumbent visual truth before editing. When the app cannot run, start with committed visual-regression goldens or screenshot fixtures; verify target and freshness against current tokens, CSS, components, or assets, resolve conflicts, and compare theme/variant captures.
3. After resolving analysis and direction, read [reference/craft-floor.md](reference/craft-floor.md) immediately before any UI edit, including small refinements. It carries the quality floor, the absolute bans, and the reflexes no detector catches. Do not load it for planning-only work.

**Launcher unavailable:** On the first refusal or failure, don’t retry; send a separate message **before the next tool call**: “Context loading did not run; I’ll read the existing project context directly.” Then read existing PRODUCT.md and DESIGN.md without inventing missing context, follow applicable steps 2–3, including reading [reference/craft-floor.md](reference/craft-floor.md) immediately before any UI edit, and continue through permitted tools. This applies to planning and editing; launcher failure alone does not block either.

##### How to design

- **The brief wins.** Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning. Redirecting a clear brief toward your taste is failure.
- **Refinement preserves; redesign replaces.** Refinement keeps the incumbent identity, behavior, copy, and everything outside scope. Ask before replacing factual copy or adding claims. Redesign keeps product truth, content, function, native affordances, and constraints, but treats the old look as evidence and anti-reference; choose a replacement world in new-work and replace DESIGN.md. Never split the difference into polish on the discarded look.
- **Loaded symbols stay out of the decoration.** A subject's world does not license emblems tied to militarism, supremacy, or hate movements as motifs, badges, or ornament, such as the Rising Sun flag's rays, the Confederate battle flag, or Nazi-era insignia and their stylised variants; reach for that world's neutral forms instead. Content that documents such a symbol as fact stays as it is.
- **Visual authority is evidence, not a filename.** Missing DESIGN.md alone does not make a project greenfield; new-work decides whether to preserve, expand, or replace the incumbent world.

##### Modes

The mode names what the visitor's success looks like on this surface.

- **Persuade:** the visitor decides and acts; design is the product. Landing pages, marketing, campaigns, pricing. Earn attention and action. Ship real imagery when the brief needs it; follow the committed world, not category habit.
- **Operate:** the visitor completes a task. App UI, dashboards, editors, admin, settings, tools. Scanability, consistency, native expectations, and the real usage scene outrank expression. Brand lives in precise details.
- **Read:** the visitor understands something. Docs, articles, guides, help, changelogs. Structure for comprehension, then make the reading experience worth staying in.
- **Experience:** the visitor is inside the work itself. Portfolios, galleries, showcases. Let the artifact lead from the first viewport; the interface recedes.

Choose the mode from the requested surface, not the product, and persist it only in that surface brief. A tool's landing page is still Persuade; a fashion house's documentation is still Read; a docs index is Read, not Persuade. See [new-work.md](reference/new-work.md) for new surfaces and [operate.md](reference/operate.md) for deeper Operate/Read guidance.

##### Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Deprecated alias for an ordinary new-work request | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Capture durable product context in PRODUCT.md | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](reference/audit.md) · native: [reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](reference/adapt.md) · native: [reference/adapt.native.md](reference/adapt.native.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](reference/optimize.md) |
| `live` | Iterate | Visual variant mode: pick elements in the browser, iterate on alternatives | [reference/live.md](reference/live.md) |
| `generate [n] [action] [element]` | Iterate | Variants, versions, or alternatives of a named element to choose from in the live browser; no manual picking | [reference/generate.md](reference/generate.md) |

Routing:

- **No argument:** read [routing.md](reference/routing.md) and present its context-aware menu; never auto-run a command.
- **Explicit or clearly implied request to run a command:** load its reference (native variant on native platforms) and follow it. Ask once if two commands fit.
- **Workflow or command-selection question:** read [Workflow questions](reference/routing.md#workflow-questions).
- **Otherwise:** treat the request as general design work. Missing PRODUCT.md routes a new surface or replacement world through init, then new-work; a narrow refinement of existing code proceeds on the incumbent implementation as `impeccable context` directs, offering init afterward rather than blocking on it.
- `teach` aliases `init`. `craft` is a deprecated alias for ordinary new-work and adds nothing. `shape` owns task discovery, then enters new-work only for visual-world and surface-concept decisions.

After init writes PRODUCT.md, resume without rerunning `impeccable context`; init loads the native platform reference itself when the platform it recorded is `ios`, `android`, or `adaptive`.

**Pin / Unpin:** `"${CLAUDE_SKILL_DIR}/scripts/impeccable" pin <pin|unpin> <command>` creates or removes a standalone `/<command>` shortcut. Report the script's result concisely; relay stderr verbatim on error.

**Hooks:** `/impeccable hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` manages the design detector hook for this project (auto-runs the detector after UI file edits and surfaces findings). Load [reference/hooks.md](reference/hooks.md) when the user invokes it with any argument.

**Doctor:** `/impeccable doctor` reports and repairs drift between this project's Impeccable artifacts (PRODUCT.md, DESIGN.md and its sidecar, config, surface briefs, the hook) and what this version reads. Load [reference/doctor.md](reference/doctor.md) when the user invokes it, or when they ask what is out of date, stale, or needs refreshing. A `CONTEXT_STALE` directive in Setup's output is the cheap subset of the same report; act on it there per its own instructions rather than running doctor unasked.

**Foundations:** `/impeccable foundations` runs `"${CLAUDE_SKILL_DIR}/scripts/impeccable" foundations` and walks the user through the product-foundations roadmap (secrets, 404 page, icons, CI and more); `/impeccable foundations <id>` fixes that one item. Load [reference/foundations.md](reference/foundations.md) when the user invokes it.

**Never repair drift as a side effect of a design task.** A `CONTEXT_STALE` finding is reported, not acted on, unless the user asks. The one exception is a finding marked `auto`, which the next write to that file performs anyway.

## Appendix C — Playbooks (priority order)

### `plugin/skills/impeccable/reference/craft-floor.md`
#### Craft floor

Load this after the direction is settled, and build without announcing the checklist. A pinned brief or the committed visual world overrides anything here except a line marked as a ban; your own habit does not. When the design hook is active it already enforces the mechanical checks below as you edit: act on its findings instead of re-auditing each rule.

##### Verify

Each of these is a check on the built result, not an intention. Run them together in each batched look at the render (on the web, one `"<skill-base-dir>/scripts/impeccable" shot <page or url>`), not as separate screenshot trips; the checks share one render.

- **Contrast:** body and placeholder text ≥4.5:1, large text ≥3:1. On colored surfaces tint secondary text from that hue or the foreground; never gray.
- **Depth:** shadows carry an offset and a soft blur. A zero-offset colored halo is decoration.
- **Spacing:** tight groups, generous separation, more space above a heading than below it. Read the computed values.
- **Type:** body measure 65–75ch, display max 6rem, tracking floor -0.04em, balanced headings, obvious scale and weight steps. Run the real copy at every breakpoint and fix what overflows.
- **Motion:** one authored moment, not scattered effects and not one identical entrance on every section. Exponential ease-out from an already-visible default. Reach past transform and opacity: blur, backdrop-filter, clip-path, mask, and shadow belong to the palette when they stay smooth.
- **States:** hover, disabled, loading, error, empty. Plus real content, working controls, responsive composition, keyboard focus.
- **Browser surfaces:** the parts you did not draw still carry the design. Text selection, the caret, custom scrollbars, focus rings, underline offset, and the numerals in tabular data all ship with browser defaults that belong to no design system. Theme them from the palette. This is the cheapest signal that a page was built rather than assembled, and the one models skip most reliably.
- **Copy:** the product's own language. Controls name their action; errors name the problem and the recovery.
- **Coverage:** every brief requirement present and findable within seconds.

##### Refuse

These are the category's defaults, not bans: the brief's own words can earn any of them. Reaching for one when the axis is free means you were not deciding; recognizing that means rewriting the element, not softening it.

Page scaffolds:

- Same-size cards of icon plus heading plus text as the page structure. Cards are the lazy container; nested cards are always wrong.
- The hero-metric template: big number, small label, supporting stats, accent.
- A kicker or eyebrow above a heading. This one is a ban, not a default: no brief earns it back. The heading carries its own weight; delete the label and let the heading speak.
- Section numbers (01 / 02 / 03) unless the sequence itself carries information the reader needs.
- A modal for a task that needs neither interruption nor protected focus.

Surface habits:

- Gradient text. Emphasis comes from weight or size.
- Glass and blur as decoration rather than as a specific effect.
- A bar down one side of a rounded box (a one-sided border, inset shadow or pseudo-element), any colour or state. Use a full border, a tint, or a leading icon or label.
- Hard offset shadows (`box-shadow: 4px 4px 0`) outside a world that is actually neobrutalist. The zero-blur block shadow is a costume, not a depth system; a world that did not choose it never earns it as a default.
- Sparklines, progress rings, and soft-shadowed rounded rectangles standing in for content.
- Monospace as a costume for "technical" rather than for code, data, or measurement.
- A system display face (Impact, Arial Black, the platform sans) as the display voice of an own-world page. Source and self-host a face whose character matches the approved lettering (Google: `"<skill-base-dir>/scripts/impeccable" font-fetch <Family>`); the closest installed font is a failure, not a fallback.
- Unicode glyphs or emoji standing in for an icon system. Icons are drawn, from a real library or authored SVG, in one consistent stroke and weight.
- Geometric masks standing in for organic contours. A circle, polygon, or radial-gradient cutout approximating a photographic subject's edge is the cheap version of the effect and reads worse than omitting it. Derive an alpha matte from the actual image, or produce a cut-out asset.
- Light or dark picked by category. Pick it from the use scene: who, where, under what ambient light.

The floor holds the mechanics; it never picks the direction. With every check green, spend the page on the committed world, and when torn between refined and committed, commit.

### `plugin/skills/impeccable/reference/new-work.md`
#### New visual work

Use this flow for a new surface or a replacement visual identity. PRODUCT.md owns product truth. DESIGN.md owns durable visual decisions. A surface brief keeps strategy that belongs to one route or artifact. Complete [init.md](init.md) first when PRODUCT.md is missing; a missing DESIGN.md does not route back to init.

For a chosen comp’s region map, see [region-map.md](region-map.md) for the command sequence and schema.

##### 1. Decide what is already true

Read DESIGN.md, representative code, tokens, components, and assets.

- **Redesign:** preserve product truth, content, function, constraints, and explicit brand commitments; replace the old visual world rather than polishing it. The old look is evidence of what the subject is, not authority over what it becomes.
- **Established world:** inherit it. A missing DESIGN.md does not erase a coherent identity already in code; document that identity instead of inventing a replacement.
- **Incomplete brand:** preserve confirmed assets and recognizable traits, then expand the system with the user for this surface.
- **Seeded world:** DESIGN.md's frontmatter names a catalog `world:` (written by `impeccable world <id>`) and no code carries it yet; styles that predate the seed, such as a starter template's CSS, do not carry it. The person already chose this world, so it is the established world even when the boot reports no visual authority: never roll, re-pick, or invent a replacement on your own initiative, but an explicit request from the person for a redesign or a different world overrides this and is a redesign (step 4 of **Create or replace the visual world**, in [new-work-world.md](new-work-world.md)). Its prose and colours are direction rather than finished tokens; the first build resolves them and `document` records the real system afterwards. The surface roll then deals structures only and names the seeded world; it prints no other worlds. A whole new surface follows the established-world path below, and with no page to screenshot yet, the world's `Reference image:` line in DESIGN.md is the comps' anchor. A code-led build has no comps, so look at that image before writing code: download it into the workspace under `.impeccable/reference/` (never `.impeccable/mocks/`, where every image counts as a comp) and open the relative path, since a viewer that only reads files or runs sandboxed never receives a URL. It is the one picture of this world.
- **No visual authority:** create a new world with the user.

A section, component, feature, or state inside an established surface inherits that surface. Never turn a local addition into a new identity exercise.

##### 2. Ask what will change the work

Before implementation, get the user's answer through the structured question tool when available. Ask two or three related questions; a precise request needs only a compact confirmation. Skip settled facts, not the confirmation: DESIGN.md settles the visual world, not this surface's purpose or concept.

- **Persuade:** who must act, what they should believe, which real proof, content, or assets earn that belief.
- **Operate:** the task, information, important states, frequency, constraints.
- **Read:** the reader's question, source material, structure, wayfinding.
- **Experience:** what leads, how exploration unfolds, which interaction or transition matters.

Across modes, ask what success looks like, what must remain untouched, and what would make a polished result feel wrong. Never ask for CSS values or canned aesthetic lanes. On a new or replacement world these are product questions only: propose no look of your own before concept-seed has run, because a direction named in a question is the one the answer confirms.

##### 3. Choose the right amount of invention

###### Extend an existing surface

Inherit its world and composition. Resolve only the new purpose, content, hierarchy, states, interaction, and how the addition joins the surrounding experience. No concept tournament, and no DESIGN.md change unless the user approves a durable system change.

###### Create a whole surface inside an established world

Keep the visual system fixed. Derive five to seven materially different structures from the content, task, and user behavior, ordered by resonance. For a genuinely open whole page, screen, or flow, run:

`"<skill-base-dir>/scripts/impeccable" concept-seed --scope surface --mode <mode>`

The script deals three of your structures; the dice pick which three reach the user, breaking the ranking rut while the user keeps a real choice. Present them on the decision page as full cards of equal salience, the dealt lead under kicker THE ROLL, with steer and re-roll; the user locks one. Each card declares `kind`: `assigned` on the dealt lead, `dealt` on the other dealt structures, and `challenger` with its `catalogId` (the SOURCE ID) on a challenger that won its place. No canon card and no pick card at surface scope: the world is settled, so every card visualizes composition, not identity. With image generation and a comp-led build path (the path the PRESENTATION block printed for this surface; **The build path of a decision round** below), each card declares a `comp` under `.impeccable/mocks/decision/`, generated after serving, in reading order, under [visualize.md](visualize.md)'s comp discipline and the MODE RULES block concept-seed printed for this surface. Anchor each comp on the established identity: pass a screenshot of a representative existing page (on a seeded world with no page yet, the image its DESIGN.md names under `Reference image:`) as a reference image (the harness image tool's input image, or `impeccable generate-image --ref`) with a short prompt in visualize.md's shape; prose paraphrases of a design system drift, pixel references do not. Without image generation, or on a code-led round, each card carries an HTML sketch of the first viewport, declared as its `html`, which the page draws as a skeleton; the PRESENTATION block names its shape, and a card without one falls back to a `wireframe` schematic (`impeccable serve-question --schema`). Locking a card is the approval and sets the build path: a locked comp builds comp-led with that comp as the approved comp, discharging [visualize.md](visualize.md)'s three-option round with no second approval point; a locked sketch or wireframe builds code-led, its ambition carried by the direction contract, and a locked sketch is the composition the build matches. Never run the script for a local extension or a precisely specified narrow request; shape those directly.

###### Create or replace the visual world

Read [new-work-world.md](new-work-world.md) now and follow it: this path's steps, the roll and the decision page live there. Come back for step 4 once a direction is locked.

###### The build path of a decision round

The execution contract, comp-led or code-led, is never asked inside a round; the page's toggle handles the exception. An Operate or Read surface is code-led whatever the project records: working screens and documents come out better built than pictured. A Persuade or Experience surface takes the recorded default: read it from `.impeccable/config.json` (`buildPath`), the gitignored `.impeccable/config.local.json` winning where one machine differs from the team's committed value; with neither, comp-led is the default whenever image generation exists. concept-seed's PRESENTATION block prints the path for the surface in hand; follow that line. Author every direction and surface payload with `buildPath: { "value": <default>, "toggle": true }`; the page renders a footer toggle with the trade stated beside it, and the ANSWER returns `buildPath` plus `buildPathFlipped`. A flipped value binds that session only and is never written back, with one exception, the only question this preference ever earns inside a round (init records it up front on projects that get the chance): when `buildPathFlipped` comes back true on a Persuade or Experience surface in a project that records no `buildPath` at all, ask once after the round closes whether to keep it as the standing default; a flip on an Operate or Read surface is one round's choice and is never offered for recording. Either answer writes `.impeccable/config.json`; the answer picks the value, never whether to record one. Yes writes the flipped value; "no, just this once" writes the value they flipped away from, the standing default they just confirmed by declining. Ask on the flip, never on the untouched default: a user who left the toggle alone told you nothing. A declined offer nothing writes down is an offer the next session makes again. When the user asks in words to change the standing default, update the file without asking. **Comp-led**: the chosen card's comp is law, generated before building when it does not yet exist, and the finish review audits the build against it; boldest composition on the table, fix rounds expected, and the comp is non-optional, no silent skipping. **Code-led**: no comp of this page and no apology for it; each card's HTML sketch is what the user chooses from, and the picked one is the composition the build matches and the finish review audits; the QUALITY BAR boards still calibrate finish, and the ambition moves into the written contract, the FIRST VIEWPORT block plus a named signature interaction and motion grammar, which the finish reviewer audits in behavior; code-led is not a discount on commitment. A code-led round still declares each card's comp path as a flip reserve: when the user flips the toggle to comp mid-round, `--wait` returns once with BUILD PATH FLIPPED while the page shimmers the slots; generate each open card's comp into its declared path then, lead first, and wait again. The flip back is free, and a comp that already rendered rides at the finish review as the critique reference. Without image generation there is no toggle and no choice: code-led is the only path, stated in one line rather than asked. The structured-tool fallback has no toggle either: it builds on the path the PRESENTATION block printed for the surface and asks nothing about the build path. The old two-card execution-contract round is retired; `followup: true` remains the general mechanism for delivering any later round over the same table via `--update`.

##### 4. Commit the world

Pick a color strategy before picking colors: Restrained (neutrals tinted from the world plus one accent; common on screens people operate or read, where the mode's rules still ask colour to do real jobs), Committed (one saturated color carries 30-60% of the surface), Full palette (3-4 named roles), or Drenched (the surface IS the color). Persuade and Experience surfaces have permission for the bolder strategies; take them when the brief allows. Color commits at page scale: fields that own whole regions, not accents scattered over a neutral ground. Dark or light is never a default: write one sentence of physical scene (who uses this, where, under what light) and let it force the answer.

Choose faces like objects from the subject's world, in the mode's register. Operate and Read surfaces are well served by system stacks and workhorse UI faces; Persuade and Experience surfaces want faces with a point of view, and these training-data defaults mean you stopped looking: Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space Grotesk, Space Mono, IBM Plex, Inter-as-display, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans. Naming one of these faces anyway requires a reason no other face could satisfy, and a subject association is never that reason: books wanting a serif, bookshops wanting hand-lettering, and tech wanting a mono are the associations the list exists to break.

Calibration: AI-generated interfaces cluster around a few looks regardless of subject: warm cream ground, high-contrast serif display, and a terracotta or signal-red accent; near-black with one neon accent and glowing edges; broadsheet-editorial hairlines, italic display serif, and small tracked mono labels; flat saturated ink with black boxes, hard offset shadows, and heavy condensed display type. All are legitimate when the brief calls for them. Where the brief leaves the aesthetic free, landing in one means the self-check failed: if someone could guess your aesthetic from the category alone, or from category-plus-avoidance, rework until neither answer is obvious. Energy is not the enemy of trust: a brief's negative constraints (no gamification, no hype) rule out those devices, not exuberance, and adjectives describing the product's behavior (quiet support, calm coaching) do not dictate the surface's energy. A bookish, warm, or child-facing subject does not soften the calibration: book cloth, thread, jackets, endpapers, and shelf ephemera span the whole saturated spectrum, and cream paper is the smallest corner of that world; landing on cream plus serif for a book subject is the default wearing the subject's clothes. A brief-pinned world pins the world, not its softest rendition: the pinned world's full material range stays in play, and a rendition matching what any model ships for that world failed the self-check at execution rather than selection.

Your measured rendition prior: warm, bookish, family, and child-facing subjects come out as cream grounds, serif display with italic accents, and lamplight, even when the assigned direction never asked for them. Treat that first palette as already spent. Before writing code, reread your OWN-WORLD block: when it says cream, paper, parchment, ivory, or lamplight for a Persuade surface the brief did not pin, the rendition failed and you rework it from the world's saturated materials first. The same subject renders as bookcloth, thread, jacket, and endpaper color on other models; nothing about the subject requires your default.

##### 5. Record the decision

Before code, record the chosen direction as a development-only contract under `## Direction contract` in the relevant surface brief. A direction contract is durable route or artifact strategy, so create or update the brief even when no other surface strategy needs persistence. Use six short blocks, roughly 150 words; do not spend tool calls counting words. THESIS: the one idea this surface owns and the category-default arrangement it refuses. OWN-WORLD: the palette and component language, specific enough to be recognizable with all content removed. STORY: what the visitor understands, believes, and does. FIRST VIEWPORT: the exact composition, what is where and at what scale, and where the primary action sits. FORM: the chosen form, its position on your ordered list, and the SEED REFERENCE concept-seed printed (`seed:` and 16 hex), never the raw seed key: the brief is committed, and on this machine the reference stands in for the key wherever a command takes one. When the roll printed SEED REFERENCE unavailable, write `seed: none (unavailable)` instead, and nothing else. When a direction pinned whole skipped the roll, write `seed: none (pinned)` in place of both the list position and the reference, followed by the quoted words that pin it. Close with one more line, FINISH: the run's exit condition, verbatim "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance". The surface brief is the reminder later agents reload across edits and sessions: a page that looks complete with the FINISH line undischarged is not done, it is abandoned at the finish line. If a block reads like a mood, the direction is not decided yet; the finishing review audits the render against this contract.

Never copy the direction contract into implementation source or any browser-delivered artifact. This includes HTML or framework comments, hidden DOM, `<template>` elements, `data-*` attributes, rendered JSX or TSX output, serialized props or state, React Server Component payloads, client bundles, metadata or JSON-LD, accessibility-only text, and files served beside the artifact. A compiler or optimizer removing development metadata is not a safety boundary. Reviewers and documenters receive the contract from the surface brief.

On a new or replacement world, DESIGN.md is written at finish, from the built world, by the shipped documenter (section 7); a rulebook written before the build gets defended against reality instead of describing it, and hands the design-system detector an unstable target. A new world shipped with no DESIGN.md is still an incomplete run. An ordinary extension does not rewrite DESIGN.md.

Read the existing surface brief before updating it:

`"<skill-base-dir>/scripts/impeccable" surface-brief read <primary-target>`

`"<skill-base-dir>/scripts/impeccable" surface-brief write <primary-target> <body-file> [related-target ...]`

After writing, read the brief once more and verify that all six contract blocks and the seed reference (or `seed: none (unavailable)` when the roll printed that, or `seed: none (pinned)` when a direction pinned whole skipped it) are present before building.

Keep the brief small: scope and visitor mode; audience, job, action/task, proof/content, and constraints; chosen direction and memorable moment; unresolved decisions. Do not copy global product truth or DESIGN.md tokens into it.

On a comp-led build, whenever any image generation is available (a harness-native tool or the API fallback `impeccable context` reports), the locked direction is visualized before it is built, never skipped: load [visualize.md](visualize.md) and follow it, three compositional options put before the user for approval, the chosen card's decision comp plus two variations. This step is proven to produce the most compositional and ambitious work. A comp locked in a surface-scope structure round has already discharged this round (Create a whole surface inside an established world, above). On a code-led build the comp round is skipped by contract, never by drift: the ambition it would have carried lives in the direction contract's FIRST VIEWPORT block and named signature interaction, and the finish reviewer audits those promises in behavior.

For `shape`, return the selected direction to [shape.md](shape.md) and stop before persistence or implementation.

##### 6. Build with full commitment

Build the assigned direction, not a safer interpretation of it. The form supplies structure, reading order, component conventions, and native motion; the product supplies every fact. Commit every atom: nav, buttons, inputs, and links are rebuilt in the form's vocabulary, and a stock component inside a committed form is a lapse. Land the first build fully committed; the passes that follow exist to make the committed thing clear and effective, never to dilute it. In unattended work, the safe rendition is the known risk.

###### Comp-led: the comp is a measured contract

On a comp-led build, read [new-work-comp.md](new-work-comp.md) before writing the spec or any code, and follow it: the measured contract, the spec, and the build-phase gates live there.

###### Both paths

- **The first viewport is a thesis, not a header.** Demonstrate the mechanism immediately, at the scale the form has in life; do not trap the concept inside a standard hero or card shell. The memory test: if someone left after one viewport, what would they describe an hour later? If the honest answer is a mood, the concept has not committed yet.
- **Prove, don't claim.** Show the subject doing its job: the interface at work, the mechanism dramatized, specifics a competitor could not copy-paste. Demonstration data is design material: author it at full fidelity and label it synthetic; claims stay uninventable.
- **Author the assets; never substitute chrome.** Great surfaces live on carefully made content: names, entries, copy, covers, thumbnails, textures. In greenfield work every blank the ask round left open is yours to author at production fidelity; content is authorable, claims are labelable, no section is omittable. Gradients, glass, generic icon tiles, and many-vertex `clip-path` polygons where an authored asset belongs are the gap wearing chrome; the detector flags the last two.
- **Draw a print material in its own technique.** On a code-led build, a world whose illustration is engraved, etched, or pen-and-ink is drawn as line: strokes carry the form, hatching (SVG patterns clipped to each shape) carries the tone, and colour sits inside the lines as a translucent wash. Flat fills under a thin outline read as clip-art, which the finish reviewer sends back for a rebuild. Use the world's own assets or one drawn subject per plate; never write a drawing engine.
- **Build the form's web leverage.** When the chosen world names a technique (canvas, WebGL, view transitions, generative motion), build the technique itself, not a static imitation of it.
- **Pace the scroll like a studio.** Vary density, scale, image, motion, and quiet inside one grammar; a dense passage earns a quiet one, and the page ends anchored by a real close. One spacing rhythm throughout, with more space above a heading than below it.
- **Use real, verified imagery when the brief implies it.** Search for the subject's physical object rather than the category; one decisive photo beats five mediocre ones. Verify stock URLs resolve.
- **Author motion as material.** Give the page the form's native motion once, orchestrated, rather than scattered hover effects. Bound expensive effects and keep content visible by default.

Preserve semantics, accessibility, performance, responsiveness, project conventions, and working behavior.

##### 7. Inspect and finish

Inspect the surface's target sizes in one capture pass per breakpoint. On the web, `"<skill-base-dir>/scripts/impeccable" first-viewport <page> --thesis <FIRST VIEWPORT's selector> --action <primary action's selector> --capture .impeccable/review` is that pass: it writes `desktop.png` and `mobile.png` and checks the fold, gaps, sample labels (`--figures-supplied` for figures the user gave) and a dead action; build no screenshot harness of your own. On a native platform (`ios` / `android` / `adaptive`), the shipped device classes per OS, captured from the simulator or emulator the way the platform reference's Verifying the build section describes. When the harness reports the user's actual viewport (an in-app browser's size, a named resolution), add that width to the set: the width that breaks is the one the user sees first. On anything interactive, one more pass drives every interaction and reachable state (open, closed, hover, focus, error, empty, overlong content) and checks each for overlap and clipping, not only the resting screen. Critique the render against the user's request, then walk the direction contract over the captures, as the finish reviewer will: first-viewport passes; every action STORY promises has a working element; every subject drawn in code reads at a glance, at its shipped size, as what it depicts. Fix material gaps in one batch, then confirm once: rerun first-viewport on the web, recapture once on native; no per-tweak captures. No inspection limit closes an open build-phase gate: it stays open until it passes or the route it names is taken. On a comp-led build, run `"<skill-base-dir>/scripts/impeccable" comp-diff --comp <approved comp> --build .impeccable/review/desktop.png --spec .impeccable/build/spec.json --out-dir .impeccable/review/diff/final` and read its region rows and paired crops as the critique: a region it scores missing or contradicted is a fix whatever the page looks like from memory. Never judge fidelity from one full-page thumbnail; it hides exactly the failures that matter. On a Persuade surface, verify the mode did its job: a first-time visitor should know what this is, why it matters, and what to do within seconds, in the form's own vocabulary.

A capture is evidence only when it is valid, and you validate before you send. Settle or disable entrance motion first: an element hidden by animation timing reads as a missing element and gets fixed into a regression. Capture full-page shots from the document top. Capture the comp comparison at the comp's own pixel dimensions. Then open every file once and confirm it shows what its name claims: no black or blank regions, no wrong section behind a right filename, no half-loaded state. A malformed capture sent onward costs the whole round; the reviewer answers it with `disposition: recapture` and nothing it reviewed binds.

After that confirmation the build thread's polishing is over: no further defect hunts, micro-edit scripts, or rebuilds here (an open build-phase gate is not a defect hunt; it closes as above); whatever remains ships through the handoffs, where a fresh context does the finding better and cheaper. On the web, where this harness runs no design hook, run `"<skill-base-dir>/scripts/impeccable" detect --json` on the changed targets once here, fix what is mechanical, and pass the remaining findings to the reviewer; a hookless web build that skips this ships every tell the hook exists to catch. A native platform skips the detector entirely: it reads HTML and CSS and has no verdict on native code, so the reviewer's floor check is the only slop gate and the input packet says so. Capture the screenshots into `.impeccable/review/`, one file per captured viewport (on the web, `desktop.png` and `mobile.png`, plus `user-<width>.png` whenever the user's viewport joined the inspected set; on native, one per device class, such as `phone.png` and `tablet.png`, suffixed per OS on adaptive), creating that directory when the harness does not; the paths you pass the reviewer are its spec, every viewport you inspected is named required in the packet, and that directory is where it looks when a passed path is missing.

Then spawn the shipped finish reviewer, `impeccable-finish-reviewer` (`impeccable_finish_reviewer` in codex; `/impeccable-finish-reviewer` in Cursor; on GitHub Copilot say "Use the impeccable-finish-reviewer agent"), with the original request, confirmed answers, the artifact path, the screenshot paths, the direction contract, existing hook findings, the QUALITY BAR card and approved comp paths (a code-led build has no approved comp; the chosen decision comp rides in that slot as the critique reference, named as such), on a comp-led build the build state (`.impeccable/build/state.json`), the spec, and the diff directories (`.impeccable/review/diff/hero/` and `.impeccable/review/diff/final/`, whose side-by-side, heatmap, region pairs, and `report.json` are the fidelity evidence), the craft-floor reference path, one line saying whether the build was code-led and whether image generation existed, and on a native platform the platform reference path(s), [ios.md](ios.md) / [android.md](android.md), both on adaptive, plus one line saying no detector ran, so the reviewer judges in the platform's conventions rather than the web's. The reviewer has no browser; screenshots you fail to pass are checks it cannot run. Never read the shipped agents' definition files before spawning; the harness loads them at spawn, and you owe only the input packet. Wait on any agent with one long timeout rather than a loop of short polls, and spend the wait on the next independent step. Verify the return carries the five contract sections (a recapture return carries one, its recapture list); on an empty or thrashed return, respawn once with the same inputs. This review never runs inside the build thread and never inherits it: spawn the reviewer fresh, with no forked conversation history (`fork_turns: 0` in codex); a reviewer that inherits your transcript inherits your framing, your optimism, and your abstractions, and everything it needs travels in the inputs above. Only a harness with no subagent capability at all substitutes a fresh in-thread pass after stepping fully out of the build context, run from [degraded/finish-reviewer.md](degraded/finish-reviewer.md), and a substituted or failed-and-replaced review is disclosed in one line at finish, never silently.

Act on the disposition word; there are exactly four. **recapture**: the evidence failed, not the build. Recapture what the return names under the capture-validity rules, then run a full review over the new evidence. A review conducted on invalid evidence binds nothing, and a verdict pass may never follow it. **rebuild**: fidelity failed wholesale, not in patches. Skip the fix batch and execute the rebuild immediately: re-derive the named regions, produce the named assets, and send the result back for a fresh full review, never a verdict pass; a rebuild replaces regions wholesale, so the whole matrix runs again over the recaptures. Tell the user what is happening rather than asking permission to fix a failure. Consult the user only on a second rebuild directive, both verdicts on the table, or when rebuilding would discard content the user approved. **ship**: nothing is owed; report the verdict at its scope and continue to the documenter. **fix**: apply the material fixes in one batch, rebuild once, and recapture the same viewports over the same files. On a comp-led build the batch keeps its gates passing: while a phase is open, rerun `"<skill-base-dir>/scripts/impeccable" build-phase advance` after it. Once all are closed, the final `finish --disposition ship`, recorded only on the reviewer's ship verdict, rechecks the page and reopens responsive when it no longer holds. A recapture measures positions, loading, and overflow; it cannot measure whether a fix reached the quality the finding named, so send the recaptured screenshots back to the same reviewer for a verdict scoring every material fix resolved, partial, or unresolved (through the harness's agent continuation; without one, run the scoring fresh from [degraded/finish-reviewer.md](degraded/finish-reviewer.md)'s Verdict Pass). An unattended run (headless, or no question tool, so nobody can fund another round) gets one correction round, a fix batch or a rebuild, and the review that follows it is final whatever its word, a second rebuild included: report what the verdict leaves open instead of starting a second round: a verdict scoring fixes partial ends the run as surely as a ship. In an attended session the ceiling belongs to the user: fixes scored partial or unresolved get another batch, recapture, and verdict, and when the second verdict still lists open items, put the table in front of them and let them choose between shipping as it stands and funding another round. Whoever decides, stop the moment a round resolves nothing, and the reviewer's findings are the only list you work from, never your own re-opened hunt. Do not run a second detector.

A rebuild and a fix round share one asset rule: a raster either round creates or replaces is still asset work under [visualize.md](visualize.md)'s Produce section and keeps its **provenance** like every build raster, and a raster the round abandons is deleted in the same batch. Before either round's result goes back for review or verdict, run `"<skill-base-dir>/scripts/impeccable" embed-prompt --scan <asset-dir...>` over the directories the artifact's rasters ship from and clear every file it reports by embedding what it is missing: the exact generation prompt for a produced raster, the origin for a sourced, stock, or pre-existing one. The scan only reads; deletion is reserved for rasters the round abandoned, never for a file the scan flagged.

Report the final verdict under the reviewer's own disposition word and at its actual scope. A verdict pass scores the listed fixes and nothing else: "the reviewer scored all three fixes resolved" is a claim it supports, "no material issues remain" is not. A table with open material findings is never announced as a pass, never softened, and never dressed as whole-surface approval when only a fix list was scored. When the user answers a ship with evidence against it, their own screenshot, a named mismatch with the comp, that evidence outranks every capture you made: put their material in the packet and spawn a fresh reviewer for a new full review. Patching inline and self-certifying is how a rejected page ships twice.

After the last correction, on a new or replacement world or an approved system change where a DESIGN.md already exists at the write boundary, collect the choice [document.md](document.md) requires: show the user the existing file. Ask with the AskUserQuestion tool and wait for the answer before continuing. Offer refresh, overwrite, or merge. A seeded world's first build asks nothing: a seed exists to be replaced by the system the build resolved, so the choice is refresh, keeping the frontmatter's `world:` line and the `seededFrom` key in the sidecar. Then spawn the shipped documenter, `impeccable-documenter` (`impeccable_documenter` in codex); spawn it in the same message as the verdict or full-review request that follows the correction round rather than waiting for that return (if the request already went out alone, spawn it at once), and spawn it again after any later correction batch, once the earlier documenter has returned so its write never lands last, with the project root, artifact path, direction contract, PRODUCT.md, [document.md](document.md), write boundary, and that choice; the documenter cannot ask and writes nothing over an existing DESIGN.md without it. Without subagents, load [degraded/documenter.md](degraded/documenter.md) and [document.md](document.md) before writing. Verify the outcome: new worlds, a seeded world's first build, and approved system changes require token-bearing DESIGN.md **and** `.impeccable/design.json`, not prose alone. Ordinary extensions compare the finished build against the incumbent system, preserve its files, and report the evidence checked; report pre-existing drift without repairing it unasked. Recheck after later edits. Finish only when review and documentation are complete.

On a comp-led build, record the final review disposition with `"<skill-base-dir>/scripts/impeccable" build-phase finish --disposition <ship|fix|rebuild|recapture>` before the final response. A refused `ship` is an unfinished build; report the outstanding phase with the verdict. Any edit after the last captured gate, a fix for a hook finding after `ship` included, voids that capture: run `finish --disposition ship` again before you stop, which rechecks the current files against the gate and names any recapture it needs. Never record `fix` to end a run over an open gate: take the route the gate names, and when the user leaves it open, report that phase as open.

The final response opens with the result, not the process: when the build finished, one line saying the page is ready and exactly how to open it (the running dev server's URL, else the command that serves it, else the file path), then the verdict at its scope; when it did not, that line says what is left and still how to open what exists. Report only findings on files that ship; comps, mocks and snapshots under `.impeccable/` are working material and never carry findings.

### `plugin/skills/impeccable/reference/critique.md`
###### Purpose

Resolve one stable target, run two independent assessments, synthesize a design critique, persist a snapshot, and ask the user what to improve next. The chat response is the primary deliverable; the snapshot is an archive of that run.

###### Hard Invariants

- Assessment A (design review) and Assessment B (detector/browser evidence) are both required, except on a native platform (see Assessment Orchestration).
- Assessment A and B MUST run as two isolated sub-agents whenever a sub-agent/Task tool is exposed. Running them inline in this context is "possible" but is NOT permitted; it is a degraded run. Inline is allowed ONLY when no sub-agent tool exists (or the user declined, on harnesses that ask). Native platforms run A alone (see Assessment Orchestration).
- If you degrade for any reason, the report's first line MUST be a banner: `⚠️ DEGRADED: single-context (<reason>)`. A silent degraded critique is a failed critique.
- Assessment A must finish before detector findings enter the parent synthesis context. Detector output is deterministic, but it still anchors judgment.
- A skipped detector is a failed critique run unless `impeccable detect` is missing or crashes after a real attempt, or the platform is native (see Assessment Orchestration).
- Viewable targets require browser inspection when available.
- Any local server started only for critique visualization must run in the background, have a recorded stop method, and be stopped before final reporting unless the user asks to keep it.
- Do not claim a user-visible overlay exists unless script injection succeeded and the detector ran in the page.
- The question is the LAST thing in the response. Write the entire report out first, then ask; nothing follows the question. Prose emitted after a structured question is withheld until the user answers it, so a report written after the question reads as if the critique never ran.
- A run that ends with neither the targeted questions nor a literal `Questions skipped: <reason>` line is an incomplete run. The report is not the finish; the close is.

###### Setup

1. **Resolve the target** to a concrete file path or URL. Prefer a source path over a dev-server URL when both identify the same surface; ports drift, paths do not.
   - "the homepage" -> `site/pages/index.astro` or `index.html`
   - "the settings modal" -> the primary component file
   - "this page" -> the current URL or source file
2. **Confirm the target slugs cleanly**:
   ```bash
   "<skill-base-dir>/scripts/impeccable" critique-storage slug "<resolved-path-or-url>"
   ```
   Every later command also accepts the resolved target directly and derives the same slug internally; never hand-write a slug. If this exits non-zero, skip persistence and trend for this run, but continue the critique.
3. **Read `.impeccable/critique/ignore.md`** if it exists. Drop matching findings silently; it is the only prior-run input critique consumes.

###### Assessment Orchestration

**Native platforms** (`ios` / `android` / `adaptive`): Assessment B does not apply, because `impeccable detect` and the browser overlay read only web markup. Run Assessment A alone in this context and skip both sub-agent gates below, the Codex permission question included: with no B there is nothing to isolate A from, so this is the complete native method and carries no degraded banner. Do not run `impeccable detect` on native source; its empty result reads as clean.

Delegate Assessment A and Assessment B to separate sub-agents. They must not see each other's output. Do not show findings to the user until synthesis.

Sub-agent gate (all harnesses):
- Unless a harness-specific gate below overrides this, spawn A and B as two isolated, parallel sub-agents whenever a sub-agent/Task tool is exposed. This is the default and is mandatory; do not run them inline because it is faster.
- Desktop apps (see **Desktop apps** under Assessment B) are the one exception to parallel: both sub-agents would drive the app's single window at once. Seed the window, spawn A, wait until it has finished and put the window back, then spawn B. They are still two isolated sub-agents, so this is not the degraded path.
- "Unavailable" means exactly one thing: no sub-agent/Task tool is exposed in this session (or, on harnesses that ask, the user declined). It does not mean inconvenient.
- If and only if sub-agents are unavailable, fall back sequentially: read [critique-rubric.md](critique-rubric.md) now, finish and record Assessment A, then run Assessment B, then synthesize, and emit the degraded banner.
- Whichever path you take, declare it in the report header (see Report header provenance). Skipping sub-agents without the banner is the most common failure of this command.

**Read-only or delegated run.** When this critique runs where it cannot spawn agents, write inside the reviewed repository, or ask anyone (a delegated subagent, CI, a headless call), run it this way rather than improvising (native platforms keep their own path above, which has no banner): read [critique-rubric.md](critique-rubric.md), then Assessment A inline, led by `⚠️ DEGRADED: single-context (delegated read-only run)`; Assessment B as `detect --json` on the sources plus `detect --json <url> --viewport <WxH>` at each target viewport (390x844 for phone), with no live-server or overlay; no Persist the Snapshot, said in Run Notes; and `Questions skipped: delegated run` in place of Ask the User.

If browser automation is available, each assessment creates its own new tab. Never reuse an existing tab, even if it is already at the right URL. Desktop apps are the exception (see **Desktop apps** under Assessment B).

###### Assessment A: Design Review

Read relevant source files and visually inspect the live page when browser automation is available. Think like a design director.

Evaluate:
- **Design specificity**: Is the composition, interaction, and visual language grounded in this product, or could an unrelated product use it unchanged? Make this judgment before seeing detector output.
- **Holistic design**: hierarchy, IA, emotional fit, discoverability, composition, typography, color, accessibility, states, copy, and edge cases.
- **Cognitive load**: consult the Cognitive Load Assessment in [critique-rubric.md](critique-rubric.md); report checklist failures and decision points with >4 visible options.
- **Emotional journey**: peak-end rule, emotional valleys, reassurance at high-stakes moments.
- **Nielsen heuristics**: consult the Heuristics Scoring Guide in [critique-rubric.md](critique-rubric.md); score all 10 heuristics 0-4, marking any heuristic the mode-applicability rule allows as `n/a` instead of forcing a number.

- **Persona red flags**: select personas with the Selecting Personas table in [critique-rubric.md](critique-rubric.md), plus 1-2 project-specific ones from PRODUCT.md's `## Users` when it has one, and walk each through the primary action.

Read critique-rubric.md as part of Assessment A. When a sub-agent runs A, give it the file's path so it reads the rubric itself, and the parent does not load it. When A runs in this context (native critiques, or the single-context fallback), read the rubric here before scoring.

Return: design-specificity verdict, heuristic scores, cognitive load, emotional journey, 2-3 strengths, 3-5 priority issues, persona red flags, minor observations, and provocative questions.

###### Assessment B: Detector + Browser Evidence

Run the bundled detector and browser visualization evidence. On web, Assessment B is mandatory and must remain isolated from Assessment A until both are complete.

CLI scan:
```bash
"<skill-base-dir>/scripts/impeccable" detect --json [target]
```

- Pass markup files/directories as `[target]`; do not pass CSS-only files.
- For URLs, skip CLI scan and use browser visualization.
- For very large trees (500+ scannable files), narrow scope or ask.
- Exit code 0 = no findings; 2 = findings. Report an empty result with what was scanned (files, URLs, viewports), never as clean: the detector does not judge layout.
- If the detector entrypoint is missing or fails to load, report deterministic scan unavailable and continue with browser/manual review.

Browser visualization is required for a viewable target when browser automation is available. Use a localhost dev/static URL for local files; avoid `file://` unless the available browser explicitly supports this workflow. Overlay flow:

1. Create a fresh tab and navigate. Prefer the harness's native/browser-canvas screenshot path before hand-rolling a Playwright/Puppeteer script; only fall back to a custom script when no native browser tool is exposed.
2. Preflight mutable injection by setting `document.title` and appending a `<script>` tag. Read-only evaluate APIs do not count.
3. If mutation is unavailable, skip live server, browser presentation, and injection; report fallback signal.
4. If mutation is available, start `"<skill-base-dir>/scripts/impeccable" live-server --background`, present the browser if supported, label `[Human]`, scroll top, inject `http://localhost:PORT/detect.js`, wait 2-3 seconds, read `impeccable` console messages, then run `"<skill-base-dir>/scripts/impeccable" live-server stop --keep-inject`. The overlay went in through the browser, so the project's HTML has no script tag to strip; a bare `stop` also runs `live-inject --remove` against the project's entry file, an edit a read-only critique should not make.
5. For multi-view targets, inject on 3-5 representative pages.

**Desktop apps** (Electron, NW.js, CEF, WebView2): there is no URL to open, so Assessment B attaches to the running app instead.

1. Launch the app with a local DevTools port: `--remote-debugging-port=9222` (Electron, NW.js, CEF), or `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` for WebView2. Keep the port on 127.0.0.1 and never expose it beyond this machine; prefer a test profile and test data.
2. Seed the state under review (route, open panel, theme, data). The scan reads the window as it stands. Keep the window on screen: a minimized or hidden window scans without the pixel contrast reads.
3. Run `"<skill-base-dir>/scripts/impeccable" detect --cdp 9222 --target <part of the page URL or title> --json`. It returns the same JSON as a URL scan and leaves the page as found. With several pages open it fails and lists them; rerun with a `--target` that names one.
4. Take screenshots through the harness's CDP tooling (`Page.captureScreenshot` on the same target). Skip the live-server overlay: there is no `[Human]` tab.

The app has one window, so the assessments take turns in it instead of opening tabs (A, then B; see the sub-agent gate), and each must leave it as found: put back any route, scroll, theme, or panel it changed. Tauri on macOS (WKWebView) and on Linux (WebKitGTK) expose no CDP: run Assessment A and the source scan only, and say so in Run Notes.

Return: CLI findings JSON/counts, browser console findings if applicable, false positives, and skipped/failed browser steps with concrete reasons.

After Assessment B returns usable CLI findings, reuse them. Do not rerun `impeccable detect` in the parent unless Assessment B failed, was truncated, or omitted count, rule names, or file locations.

###### Generate Combined Critique Report

Synthesize both assessments into a single report. Do not simply concatenate. Weave the findings together, noting where the LLM review and detector agree, where the detector caught issues the LLM missed, and where detector findings are false positives.

The chat response is the primary user-facing deliverable. Present the full structured critique below in chat; do not replace it with a summary and a link. The persisted snapshot is an archive of that run.

Structure your feedback as a design director would:

###### Report header provenance

The report's first line MUST declare how the assessments were run, so a degraded run is never silent:
- Dual-agent: `Method: dual-agent (A: <agent-id> · B: <agent-id>)`
- Degraded: `⚠️ DEGRADED: single-context (<reason, e.g. no sub-agent tool exposed>)`
- Native: `Method: design review only (detector not applicable, native platform)`

###### Design Health Score
> *Use Assessment A's scores; the bands are under [Scoring the report](#scoring-the-report) below.*

Present the Nielsen's 10 heuristics scores as a table:

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | ? | [specific finding or "n/a" if solid] |
| 2 | Match System / Real World | ? | |
| 3 | User Control and Freedom | ? | |
| 4 | Consistency and Standards | ? | |
| 5 | Error Prevention | ? | |
| 6 | Recognition Rather Than Recall | ? | |
| 7 | Flexibility and Efficiency | ? | |
| 8 | Aesthetic and Minimalist Design | ? | |
| 9 | Error Recovery | ? | |
| 10 | Help and Documentation | ? | |
| **Total** | | **??/[applicable max]** | **[Rating band]** |

The applicable maximum is 4 times the number of heuristics you actually scored: **/40** when all ten apply, **/32** when two are `n/a`. Never print `/40` over a partial set.

Be honest with scores. A 4 means genuinely excellent. Most real interfaces score 20-32 out of 40.

**Mode applicability**: heuristics 7 (Flexibility and Efficiency) and 10 (Help and Documentation) may be scored `n/a` on Persuade and Experience surfaces (landing pages, campaigns, portfolios, bodies of work), as may any other heuristic that genuinely cannot apply to the surface under review. Write `n/a` in the Score cell with a one-line reason, and renormalize the total to the applicable maximum (e.g. **24/32** when two heuristics are n/a) so the rating band stays proportional. The persisted snapshot must record the applicable maximum and which heuristics were scored n/a.

###### Design Specificity Verdict

**Start here.** Does the result feel authored for this product, or category-interchangeable?

**LLM assessment**: Your unanchored evaluation of design specificity. Cover overall coherence, structural sameness, category-interchangeable choices, and missed opportunities for product character.

**Deterministic scan**: Summarize what the automated detector found, with counts and file locations. Note any additional issues the detector caught that you missed, and flag any false positives. On a native platform, write `not applicable (native platform)` instead.

**Visual overlays** (if injection succeeded): Tell the user that overlays are now visible in the **[Human]** tab in their browser, highlighting the detected issues. Summarize what the console output reported. If browser visualization was attempted but injection failed, say that no reliable user-visible overlay is available and report the fallback signal instead.

###### Overall Impression
A brief gut reaction: what works, what doesn't, and the single biggest opportunity.

###### What's Working
Highlight 2-3 things done well. Be specific about why they work.

###### Priority Issues
The 3-5 most impactful design problems, ordered by importance.

For each issue, tag with **P0-P3 severity** (see [Issue Severity below](#issue-severity-p0p3) for definitions):
- **[P?] What**: Name the problem clearly
- **Why it matters**: How this hurts users or undermines goals
- **Fix**: What to do about it (be concrete)
- **Suggested command**: Which command could address this (from: /impeccable adapt, /impeccable animate, /impeccable audit, /impeccable bolder, /impeccable clarify, /impeccable colorize, /impeccable critique, /impeccable delight, /impeccable distill, /impeccable document, /impeccable harden, /impeccable layout, /impeccable onboard, /impeccable optimize, /impeccable overdrive, /impeccable polish, /impeccable quieter, /impeccable shape, /impeccable typeset)

###### Persona Red Flags
> *Use Assessment A's persona red flags; it selected the personas from [critique-rubric.md](critique-rubric.md).*

Assessment A selected 2-3 personas most relevant to this interface type (the selection table in critique-rubric.md). If PRODUCT.md has a `## Users` section, also generate 1-2 project-specific personas from it and from `## Brand Commitments`.

For each selected persona, walk through the primary user action and list specific red flags found:

**Alex (Power User)**: No keyboard shortcuts detected. Form requires 8 clicks for primary action. Forced modal onboarding. High abandonment risk.

**Jordan (First-Timer)**: Icon-only nav in sidebar. Technical jargon in error messages ("404 Not Found"). No visible help. Will abandon at step 2.

Be specific. Name the exact elements and interactions that fail each persona. Don't write generic persona descriptions; write what broke for them.

###### Minor Observations
Quick notes on smaller issues worth addressing.

###### Questions to Consider
Provocative questions that might unlock better solutions:
- "What if the primary action were more prominent?"
- "Does this need to feel this complex?"
- "What would a confident version of this look like?"

**Remember**:
- Be direct. Vague feedback wastes everyone's time.
- Be specific. "The submit button," not "some elements."
- Say what's wrong AND why it matters to users.
- Give concrete suggestions. Cut "consider exploring..." entirely.
- Prioritize ruthlessly. If everything is important, nothing is.
- Don't soften criticism. Developers need honest feedback to ship great design.

###### Deliver the Report

Write the full report into the chat response now, before any persistence work. This is the deliverable; everything below it is bookkeeping.

Do this first because the alternative is the most common way this command fails: the report gets composed once, straight into the persistence heredoc, and the run ends with a perfect archive nobody has read. Composing it into a file is not delivering it. If the report exists only in `.impeccable/critique/`, the run produced nothing.

Persistence is not the end of the run. After it, the response continues with the trend line and the close.

###### Persist the Snapshot

Once the report above is finalized, write it to `.impeccable/critique/` so the user can refer back, and so `/impeccable polish` can pick up the priority issues without a copy-paste.

Skip this step if the Setup slug was null (vague or root-level target), and say why in one line of the close: "Not saved: critique one page, component or file to keep its history."

1. **Write the body to a temp file** so you can pipe it to the helper. Use the full critique report (heuristic table, design-specificity verdict, priority issues, persona red flags, minor observations, and questions), but stop before the "Ask the User" / "Recommended Actions" sections that come later.

   This is a copy of the report you already delivered above, for later commands to read. It is not delivery. If you find yourself composing the report for the first time inside this heredoc, you have skipped Deliver the Report; go back and send it.

2. **Pass the structured metadata** through `IMPECCABLE_CRITIQUE_META` (JSON), then run the write command:
   ```bash
   IMPECCABLE_CRITIQUE_META='{"target":"<user phrasing>","total_score":<n>,"max_score":<n>,"na_heuristics":"<comma-separated numbers, or empty>","p0_count":<n>,"p1_count":<n>}' \
     "<skill-base-dir>/scripts/impeccable" critique-storage write "<resolved target>" <body-file>
   ```
   `max_score` is the applicable maximum from the heuristic table (40 when every heuristic applied), so a later run can tell a renormalized total from a full one. For a local file target, the helper also records an exact content fingerprint so polish can distinguish the assessed bytes from later edits without relying on Git state or timestamps. The helper prints the absolute path it wrote, and sometimes one more line (`Saved to Impeccable: <link>`, `Not saved to Impeccable: <reason>` or `Keep this critique's history: impeccable login`); put that line in the close word for word. Leave that file on disk. Polish closes it; this run does not. `REPORTS OFF:` instead means the project opted out of saved reports: skip the trend read and carry on.

3. **Delete the temp body file** after the write attempt completes, whether the write succeeded or failed. If deletion fails, mention `temp-file cleanup failed: <reason>` briefly in the final output, but do not block the critique.

4. **Read the trend** for context:
   ```bash
   "<skill-base-dir>/scripts/impeccable" critique-storage trend "<resolved target>" 5
   ```
   This returns a JSON array of the last 5 frontmatter entries (including the one you just wrote).

5. **Append a single line to the user-visible output**, after the report and before the questions:

   > **Trend for `<slug>` (last 5 runs): 24 → 28 → 32 → 29 → 32 (out of 40)**
   > Wrote `.impeccable/critique/<filename>`.

   Read `max_score` on each trend entry. When every entry shares one maximum, state it once as above. When they differ, print each score with its own denominator (`24/32 → 30/40`) and note that the runs scored different heuristic sets, so the line is not a like-for-like comparison. Treat a missing `max_score` on an older entry as 40.

   If this is the first run for the slug, the trend is just one score; say so: "First run for this target, no trend yet."

6. **Close the run.** Go to Ask the User below and emit the questions, or the `Questions skipped: <reason>` line when the count allows it. The run is not complete until you do. Persistence is bookkeeping and cleanup is not an ending; stopping here leaves the user with a report and no way forward, and leaves `/impeccable polish` with no priorities to inherit.

This is fire-and-forget. Do not show the user the helper's JSON output; only the human-readable trend line, the written path, and the helper's Impeccable line. Failures here should not block the rest of the flow; print the error and move on.

###### Ask the User

**After presenting findings**, use targeted questions based on what was actually found. Ask with the AskUserQuestion tool and wait for the answer before continuing. These answers will shape the action plan.

Ask in the same message that carries the report, with the report written out first and the question last. Do not split the two across turns: a turn that ends on the report is a turn that ends, and the questions never arrive. Order within the message is what matters, because prose emitted after a structured question is withheld until the user answers.

Ask questions along these lines (adapt to the specific findings; do not ask generic questions):

1. **Priority direction**: Based on the issues found, ask which category matters most to the user right now. For example: "I found problems with visual hierarchy, color usage, and information overload. Which area should we tackle first?" Offer the top 2-3 issue categories as options.

2. **Design intent**: If the critique found a tonal mismatch, ask whether it was intentional. For example: "The interface feels clinical and corporate. Is that the intended tone, or should it feel warmer/bolder/more playful?" Offer 2-3 tonal directions as options based on what would fix the issues found.

3. **Scope**: Ask how much the user wants to take on. For example: "I found N issues. Want to address everything, or focus on the top 3?" Offer scope options like "Top 3 only", "All issues", "Critical issues only".

4. **Constraints** (optional; only ask if relevant): If the findings touch many areas, ask if anything is off-limits. For example: "Should any sections stay as-is?" This prevents the plan from touching things the user considers done.

**Rules for questions**:
- Every question must reference specific findings from the report. Never ask generic "who is your audience?" questions.
- Keep it to 2-4 questions maximum. Respect the user's time.
- Offer concrete options, not open-ended prompts.
- Skipping is allowed only when the report listed **fewer than 3 Priority Issues**, or on a read-only or delegated run. Count them; do not judge the findings "straightforward" by feel. At 3 or more on an interactive run, the questions are required.

**Final-question gate.** The user-visible response must either include the targeted questions or carry the literal line `Questions skipped: <reason>` naming the count or the delegated run that permitted the skip. Each question must include 2-3 concrete answer options tied to the actual critique findings. Do not end with only open-ended questions, and do not end with neither: stopping after the report, having asked nothing and printed no skip line, is the most common way this command fails.

###### Recommended Actions

**After receiving the user's answers**, present a prioritized action summary reflecting the user's priorities and scope from Ask the User.

###### Action Summary

List recommended commands in priority order, based on the user's answers:

1. **`/command-name`**: Brief description of what to fix (specific context from critique findings)
2. **`/command-name`**: Brief description (specific context)
...

**Rules for recommendations**:
- Only recommend commands from: /impeccable adapt, /impeccable animate, /impeccable audit, /impeccable bolder, /impeccable clarify, /impeccable colorize, /impeccable critique, /impeccable delight, /impeccable distill, /impeccable document, /impeccable harden, /impeccable layout, /impeccable onboard, /impeccable optimize, /impeccable overdrive, /impeccable polish, /impeccable quieter, /impeccable shape, /impeccable typeset
- Order by the user's stated priorities first, then by impact
- Each item's description should carry enough context that the command knows what to focus on
- Map each Priority Issue to the appropriate command
- Skip commands that would address zero issues
- If the user chose a limited scope, only include items within that scope
- If the user marked areas as off-limits, exclude commands that would touch those areas
- End with `/impeccable polish` as the final step if any fixes were recommended

After presenting the summary, tell the user:

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/impeccable critique` after fixes to see your score improve.

---

##### Reference Material

Assessment A scores against [critique-rubric.md](critique-rubric.md): the cognitive load checklist, the heuristic scoring guide, and the personas. The report uses the bands and severities below.

###### Scoring the report

###### Score Summary

**Total possible**: 40 points (10 heuristics × 4 max)

| Score Range | Rating | What It Means |
|-------------|--------|---------------|
| 36–40 | Excellent | Minor polish only; ship it |
| 28–35 | Good | Address weak areas, solid foundation |
| 20–27 | Acceptable | Significant improvements needed before users are happy |
| 12–19 | Poor | Major UX overhaul required; core experience broken |
| 0–11 | Critical | Redesign needed; unusable in current state |

When heuristics were scored `n/a`, the maximum is lower than 40; read the band off the percentage instead of the raw number (90%+ Excellent, 70%+ Good, 50%+ Acceptable, 30%+ Poor, below that Critical). 24/32 is 75%, so Good.

---

###### Issue Severity (P0–P3)

Tag each individual issue found during scoring with a priority level:

| Priority | Name | Description | Action |
|----------|------|-------------|--------|
| **P0** | Blocking | Prevents task completion entirely | Fix immediately; this is a showstopper |
| **P1** | Major | Causes significant difficulty or confusion | Fix before release |
| **P2** | Minor | Annoyance, but workaround exists | Fix in next pass |
| **P3** | Polish | Nice-to-fix, no real user impact | Fix if time permits |

**Tip**: If you're unsure between two levels, ask: "Would a user contact support about this?" If yes, it's at least P1.

### `plugin/skills/impeccable/reference/critique-rubric.md`
#### Critique rubric

Assessment A's rubric in [critique.md](critique.md): cognitive load, the heuristic scores, and personas. The score bands and P0 to P3 severity stay in critique.md, where the report uses them.

###### Cognitive Load Assessment

Cognitive load is the total mental effort required to use an interface. Overloaded users make mistakes, get frustrated, and leave. This reference helps identify and fix cognitive overload.

---

###### Three Types of Cognitive Load

###### Intrinsic Load: The Task Itself
Complexity inherent to what the user is trying to do. You can't eliminate this, but you can structure it.

**Manage it by**:
- Breaking complex tasks into discrete steps
- Providing scaffolding (templates, defaults, examples)
- Progressive disclosure: show what's needed now, hide the rest
- Grouping related decisions together

###### Extraneous Load: Bad Design
Mental effort caused by poor design choices. **Eliminate this ruthlessly.** It's pure waste.

**Common sources**:
- Confusing navigation that requires mental mapping
- Unclear labels that force users to guess meaning
- Visual clutter competing for attention
- Inconsistent patterns that prevent learning
- Unnecessary steps between user intent and result

###### Germane Load: Learning Effort
Mental effort spent building understanding. This is *good* cognitive load; it leads to mastery.

**Support it by**:
- Progressive disclosure that reveals complexity gradually
- Consistent patterns that reward learning
- Feedback that confirms correct understanding
- Onboarding that teaches through action, not walls of text

---

###### Cognitive Load Checklist

Evaluate the interface against these 8 items:

- [ ] **Single focus**: Can the user complete their primary task without distraction from competing elements?
- [ ] **Chunking**: Is information presented in digestible groups (≤4 items per group)?
- [ ] **Grouping**: Are related items visually grouped together (proximity, borders, shared background)?
- [ ] **Visual hierarchy**: Is it immediately clear what's most important on the screen?
- [ ] **One thing at a time**: Can the user focus on a single decision before moving to the next?
- [ ] **Minimal choices**: Are decisions simplified (≤4 visible options at any decision point)?
- [ ] **Working memory**: Does the user need to remember information from a previous screen to act on the current one?
- [ ] **Progressive disclosure**: Is complexity revealed only when the user needs it?

**Scoring**: Count the failed items. 0–1 failures = low cognitive load (good). 2–3 = moderate (address soon). 4+ = high cognitive load (critical fix needed).

---

###### The Working Memory Rule

**Humans can hold ≤4 items in working memory at once** (Miller's Law revised by Cowan, 2001).

At any decision point, count the number of distinct options, actions, or pieces of information a user must simultaneously consider:
- **≤4 items**: Within working memory limits, manageable
- **5–7 items**: Pushing the boundary; consider grouping or progressive disclosure
- **8+ items**: Overloaded; users will skip, misclick, or abandon

**Practical applications**:
- Action buttons: 1 primary, 1–2 secondary, group the rest in a menu
- Navigation menus: ≤5 top-level items (group the rest under clear categories)
- Long-form articles: one reading path; gather related links into a single block at the end instead of scattering them mid-flow
- Documentation sidebars: ≤4 sibling choices visible per level before grouping kicks in
- Portfolio and gallery indexes: one decision per screen (which piece to open), not filter, sort, and tag controls all at once

---

###### Common Cognitive Load Violations

###### 1. The Wall of Options
**Problem**: Presenting 10+ choices at once with no hierarchy.
**Fix**: Group into categories, highlight recommended, use progressive disclosure.

###### 2. The Memory Bridge
**Problem**: User must remember info from step 1 to complete step 3.
**Fix**: Keep relevant context visible, or repeat it where it's needed.

###### 3. The Hidden Navigation
**Problem**: User must build a mental map of where things are.
**Fix**: Always show current location (breadcrumbs, active states, progress indicators).

###### 4. The Jargon Barrier
**Problem**: Technical or domain language forces translation effort.
**Fix**: Use plain language. If domain terms are unavoidable, define them inline.

###### 5. The Visual Noise Floor
**Problem**: Every element has the same visual weight; nothing stands out.
**Fix**: Establish clear hierarchy: one primary element, 2–3 secondary, everything else muted.

###### 6. The Inconsistent Pattern
**Problem**: Similar actions work differently in different places.
**Fix**: Standardize interaction patterns. Same type of action = same type of UI.

###### 7. The Multi-Task Demand
**Problem**: Interface requires processing multiple simultaneous inputs (reading + deciding + navigating).
**Fix**: Sequence the steps. Let the user do one thing at a time.

###### 8. The Context Switch
**Problem**: User must jump between screens/tabs/modals to gather info for a single decision.
**Fix**: Co-locate the information needed for each decision. Reduce back-and-forth.

###### Heuristics Scoring Guide

Score each of Nielsen's 10 Usability Heuristics on a 0–4 scale. Be honest: a 4 means genuinely excellent, not "good enough."

###### Nielsen's 10 Heuristics

###### 1. Visibility of System Status

Keep users informed about what's happening through timely, appropriate feedback.

**Check for**:
- Loading indicators during async operations
- Confirmation of user actions (save, submit, delete)
- Progress indicators for multi-step processes
- Current location in navigation (breadcrumbs, active states)
- Form validation feedback (inline, not just on submit)

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | No feedback; user is guessing what happened |
| 1 | Rare feedback; most actions produce no visible response |
| 2 | Partial; some states communicated, major gaps remain |
| 3 | Good; most operations give clear feedback, minor gaps |
| 4 | Excellent; every action confirms, progress is always visible |

###### 2. Match Between System and Real World

Speak the user's language. Follow real-world conventions. Information appears in natural, logical order.

**Check for**:
- Familiar terminology (no unexplained jargon)
- Logical information order matching user expectations
- Recognizable icons and metaphors
- Domain-appropriate language for the target audience
- Natural reading flow (left-to-right, top-to-bottom priority)

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Pure tech jargon, alien to users |
| 1 | Mostly confusing; requires domain expertise to navigate |
| 2 | Mixed; some plain language, some jargon leaks through |
| 3 | Mostly natural; occasional term needs context |
| 4 | Speaks the user's language fluently throughout |

###### 3. User Control and Freedom

Users need a clear "emergency exit" from unwanted states without extended dialogue.

**Check for**:
- Undo/redo functionality
- Cancel buttons on forms and modals
- Clear navigation back to safety (home, previous)
- Easy way to clear filters, search, selections
- Escape from long or multi-step processes

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Users get trapped; no way out without refreshing |
| 1 | Difficult exits; must find obscure paths to escape |
| 2 | Some exits; main flows have escape, edge cases don't |
| 3 | Good control; users can exit and undo most actions |
| 4 | Full control; undo, cancel, back, and escape everywhere |

###### 4. Consistency and Standards

Users shouldn't wonder whether different words, situations, or actions mean the same thing.

**Check for**:
- Consistent terminology throughout the interface
- Same actions produce same results everywhere
- Platform conventions followed (standard UI patterns)
- Visual consistency (colors, typography, spacing, components)
- Consistent interaction patterns (same gesture = same behavior)

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Inconsistent everywhere; feels like different products stitched together |
| 1 | Many inconsistencies; similar things look/behave differently |
| 2 | Partially consistent; main flows match, details diverge |
| 3 | Mostly consistent; occasional deviation, nothing confusing |
| 4 | Fully consistent; cohesive system, predictable behavior |

###### 5. Error Prevention

Better than good error messages is a design that prevents problems in the first place.

**Check for**:
- Confirmation before destructive actions (delete, overwrite)
- Constraints preventing invalid input (date pickers, dropdowns)
- Smart defaults that reduce errors
- Clear labels that prevent misunderstanding
- Autosave and draft recovery

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Errors easy to make; no guardrails anywhere |
| 1 | Few safeguards; some inputs validated, most aren't |
| 2 | Partial prevention; common errors caught, edge cases slip |
| 3 | Good prevention; most error paths blocked proactively |
| 4 | Excellent; errors nearly impossible through smart constraints |

###### 6. Recognition Rather Than Recall

Minimize memory load. Make objects, actions, and options visible or easily retrievable.

**Check for**:
- Visible options (not buried in hidden menus)
- Contextual help when needed (tooltips, inline hints)
- Recent items and history
- Autocomplete and suggestions
- Labels on icons (not icon-only navigation)

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Heavy memorization; users must remember paths and commands |
| 1 | Mostly recall; many hidden features, few visible cues |
| 2 | Some aids; main actions visible, secondary features hidden |
| 3 | Good recognition; most things discoverable, few memory demands |
| 4 | Everything discoverable; users never need to memorize |

###### 7. Flexibility and Efficiency of Use

Accelerators, invisible to novices, speed up expert interaction.

**Check for**:
- Keyboard shortcuts for common actions
- Customizable interface elements
- Recent items and favorites
- Bulk/batch actions
- Power user features that don't complicate the basics

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | One rigid path; no shortcuts or alternatives |
| 1 | Limited flexibility; few alternatives to the main path |
| 2 | Some shortcuts; basic keyboard support, limited bulk actions |
| 3 | Good accelerators; keyboard nav, some customization |
| 4 | Highly flexible; multiple paths, power features, customizable |

###### 8. Aesthetic and Minimalist Design

Interfaces should not contain irrelevant or rarely needed information. Every element should serve a purpose.

**Check for**:
- Only necessary information visible at each step
- Clear visual hierarchy directing attention
- Purposeful use of color and emphasis
- No decorative clutter competing for attention
- Focused, uncluttered layouts

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Overwhelming; everything competes for attention equally |
| 1 | Cluttered; too much noise, hard to find what matters |
| 2 | Some clutter; main content clear, periphery noisy |
| 3 | Mostly clean; focused design, minor visual noise |
| 4 | Perfectly minimal; every element earns its pixel |

###### 9. Help Users Recognize, Diagnose, and Recover from Errors

Error messages should use plain language, precisely indicate the problem, and constructively suggest a solution.

**Check for**:
- Plain language error messages (no error codes for users)
- Specific problem identification ("Email is missing @" not "Invalid input")
- Actionable recovery suggestions
- Errors displayed near the source of the problem
- Non-blocking error handling (don't wipe the form)

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | Cryptic errors; codes, jargon, or no message at all |
| 1 | Vague errors; "Something went wrong" with no guidance |
| 2 | Clear but unhelpful; names the problem but not the fix |
| 3 | Clear with suggestions; identifies problem and offers next steps |
| 4 | Perfect recovery; pinpoints issue, suggests fix, preserves user work |

###### 10. Help and Documentation

Even if the system is usable without docs, help should be easy to find, task-focused, and concise.

**Check for**:
- Searchable help or documentation
- Contextual help (tooltips, inline hints, guided tours)
- Task-focused organization (not feature-organized)
- Concise, scannable content
- Easy access without leaving current context

**Scoring**:
| Score | Criteria |
|-------|----------|
| 0 | No help available anywhere |
| 1 | Help exists but hard to find or irrelevant |
| 2 | Basic help; FAQ or docs exist, not contextual |
| 3 | Good documentation; searchable, mostly task-focused |
| 4 | Excellent contextual help; right info at the right moment |

###### Persona-Based Design Testing

Test the interface through the eyes of 5 distinct user archetypes. Each persona exposes different failure modes that a single "design director" perspective would miss.

**How to use**: Select 2–3 personas most relevant to the interface being critiqued. Walk through the primary user action as each persona. Report specific red flags, not generic concerns.

---

###### 1. Impatient Power User: "Alex"


**Profile**: Expert with similar products. Expects efficiency, hates hand-holding. Will find shortcuts or leave.

**Behaviors**:
- Skips all onboarding and instructions
- Looks for keyboard shortcuts immediately
- Tries to bulk-select, batch-edit, and automate
- Gets frustrated by required steps that feel unnecessary
- Abandons if anything feels slow or patronizing

**Test Questions**:
- Can Alex complete the core task in under 60 seconds?
- Are there keyboard shortcuts for common actions?
- Can onboarding be skipped entirely?
- Do modals have keyboard dismiss (Esc)?
- Is there a "power user" path (shortcuts, bulk actions)?

**Red Flags** (report these specifically):
- Forced tutorials or unskippable onboarding
- No keyboard navigation for primary actions
- Slow animations that can't be skipped
- One-item-at-a-time workflows where batch would be natural
- Redundant confirmation steps for low-risk actions

---

###### 2. Confused First-Timer: "Jordan"

**Profile**: Never used this type of product. Needs guidance at every step. Will abandon rather than figure it out.

**Behaviors**:
- Reads all instructions carefully
- Hesitates before clicking anything unfamiliar
- Looks for help or support constantly
- Misunderstands jargon and abbreviations
- Takes the most literal interpretation of any label

**Test Questions**:
- Is the first action obviously clear within 5 seconds?
- Are all icons labeled with text?
- Is there contextual help at decision points?
- Does terminology assume prior knowledge?
- Is there a clear "back" or "undo" at every step?

**Red Flags** (report these specifically):
- Icon-only navigation with no labels
- Technical jargon without explanation
- No visible help option or guidance
- Ambiguous next steps after completing an action
- No confirmation that an action succeeded

---

###### 3. Accessibility-Dependent User: "Sam"

**Profile**: Uses screen reader (VoiceOver/NVDA), keyboard-only navigation. May have low vision, motor impairment, or cognitive differences.

**Behaviors**:
- Tabs through the interface linearly
- Relies on ARIA labels and heading structure
- Cannot see hover states or visual-only indicators
- Needs adequate color contrast (4.5:1 minimum)
- May use browser zoom up to 200%

**Test Questions**:
- Can the entire primary flow be completed keyboard-only?
- Are all interactive elements focusable with visible focus indicators?
- Do images have meaningful alt text?
- Is color contrast WCAG AA compliant (4.5:1 for text)?
- Does the screen reader announce state changes (loading, success, errors)?

**Red Flags** (report these specifically):
- Click-only interactions with no keyboard alternative
- Missing or invisible focus indicators
- Meaning conveyed by color alone (red = error, green = success)
- Unlabeled form fields or buttons
- Time-limited actions without extension option
- Custom components that break screen reader flow

---

###### 4. Deliberate Stress Tester: "Riley"

**Profile**: Methodical user who pushes interfaces beyond the happy path. Tests edge cases, tries unexpected inputs, and probes for gaps in the experience.

**Behaviors**:
- Tests edge cases intentionally (empty states, long strings, special characters)
- Submits forms with unexpected data (emoji, RTL text, very long values)
- Tries to break workflows by navigating backwards, refreshing mid-flow, or opening in multiple tabs
- Looks for inconsistencies between what the UI promises and what actually happens
- Documents problems methodically

**Test Questions**:
- What happens at the edges (0 items, 1000 items, very long text)?
- Do error states recover gracefully or leave the UI in a broken state?
- What happens on refresh mid-workflow? Is state preserved?
- Are there features that appear to work but produce broken results?
- How does the UI handle unexpected input (emoji, special chars, paste from Excel)?

**Red Flags** (report these specifically):
- Features that appear to work but silently fail or produce wrong results
- Error handling that exposes technical details or leaves UI in a broken state
- Empty states that show nothing useful ("No results" with no guidance)
- Workflows that lose user data on refresh or navigation
- Inconsistent behavior between similar interactions in different parts of the UI

---

###### 5. Distracted Mobile User: "Casey"

**Profile**: Using phone one-handed on the go. Frequently interrupted. Possibly on a slow connection.

**Behaviors**:
- Uses thumb only; prefers bottom-of-screen actions
- Gets interrupted mid-flow and returns later
- Switches between apps frequently
- Has limited attention span and low patience
- Types as little as possible, prefers taps and selections

**Test Questions**:
- Are primary actions in the thumb zone (bottom half of screen)?
- Is state preserved if the user leaves and returns?
- Does it work on slow connections (3G)?
- Can forms use autocomplete and smart defaults?
- Are touch targets at least 44×44pt?

**Red Flags** (report these specifically):
- Important actions positioned at the top of the screen (unreachable by thumb)
- No state persistence; progress lost on tab switch or interruption
- Large text inputs required where selection would work
- Heavy assets loading on every page (no lazy loading)
- Tiny tap targets or targets too close together

---

###### Selecting Personas

Choose personas based on the interface type:

| Interface Type | Primary Personas | Why |
|---------------|-----------------|-----|
| Landing page / marketing | Jordan, Riley, Casey | First impressions, trust, mobile |
| Dashboard / admin | Alex, Sam | Power users, accessibility |
| E-commerce / checkout | Casey, Riley, Jordan | Mobile, edge cases, clarity |
| Onboarding flow | Jordan, Casey | Confusion, interruption |
| Data-heavy / analytics | Alex, Sam | Efficiency, keyboard nav |
| Form-heavy / wizard | Jordan, Sam, Casey | Clarity, accessibility, mobile |

---

###### Project-Specific Personas

If PRODUCT.md has a `## Users` section (written by `impeccable init`), derive 1–2 additional personas from it and from `## Brand Commitments`:

1. Read the target audience description
2. Identify the primary user archetype not covered by the 5 predefined personas
3. Create a persona following this template:

```
##### [Role]: "[Name]"

**Profile**: [2-3 key characteristics derived from PRODUCT.md]

**Behaviors**: [3-4 specific behaviors based on the described audience]

**Red Flags**: [3-4 things that would alienate this specific user type]
```

Only generate project-specific personas when PRODUCT.md describes real users. Don't invent audience details; use the 5 predefined personas when no context exists.

### `plugin/skills/impeccable/reference/audit.md`
Run systematic **technical** quality checks and generate a comprehensive report. Don't fix issues; document them for other commands to address.

This is a code-level audit, not a design critique. Check what's measurable and verifiable in the implementation.

**Web only.** Native platforms (`ios` / `android` / `adaptive`) route to [audit.native.md](audit.native.md) instead; if the project is native, switch to it now.

##### Diagnostic Scan

Run comprehensive checks across 5 dimensions. Score each dimension 0-4 using the criteria below.

###### 1. Accessibility (A11y)

**Check for**:
- **Contrast issues**: Text contrast ratios < 4.5:1, or < 3:1 for large text (or 7:1 for AAA)
- **Motion sensitivity**: `prefers-reduced-motion` needs an intentional alternative that preserves state change and hierarchy; flag a global `0.01ms` kill that destroys useful feedback, flashing above threshold, and motion that blocks focus, reading, or task completion
- **Missing ARIA**: Interactive elements without proper roles, labels, or states
- **Keyboard navigation**: Missing focus indicators, illogical tab order, keyboard traps
- **Semantic HTML**: Improper heading hierarchy, missing landmarks, divs instead of buttons
- **Alt text**: Missing or poor image descriptions
- **Form issues**: Inputs without labels, poor error messaging, missing required indicators

**Score 0-4**: 0=Inaccessible (fails WCAG A), 1=Major gaps (few ARIA labels, no keyboard nav), 2=Partial (some a11y effort, significant gaps), 3=Good (WCAG AA mostly met, minor gaps), 4=Excellent (WCAG AA fully met, approaches AAA)

###### 2. Performance

**Check for**:
- **Layout thrashing**: Reading/writing layout properties in loops
- **Expensive animations**: Casual layout-property animation, unbounded blur/filter/shadow effects, or effects that visibly drop frames
- **Missing optimization**: Images without lazy loading, unoptimized assets
- **will-change overuse**: `will-change` applied broadly or left on at rest (it is a targeted hint for known expensive animations, not a baseline requirement)
- **Bundle size**: Unnecessary imports, unused dependencies
- **Render performance**: Unnecessary re-renders, missing memoization

**Score 0-4**: 0=Severe issues (layout thrash, unoptimized everything), 1=Major problems (no lazy loading, expensive animations), 2=Partial (some optimization, gaps remain), 3=Good (mostly optimized, minor improvements possible), 4=Excellent (fast, lean, well-optimized)

###### 3. Theming

**Check for**:
- **Hard-coded colors**: Colors not using design tokens
- **Broken dark mode**: Missing dark mode variants, poor contrast in dark theme
- **Inconsistent tokens**: Using wrong tokens, mixing token types
- **Theme switching issues**: Values that don't update on theme change

**Score 0-4**: 0=No theming (hard-coded everything), 1=Minimal tokens (mostly hard-coded), 2=Partial (tokens exist but inconsistently used), 3=Good (tokens used, minor hard-coded values), 4=Excellent (full token system, dark mode works perfectly)

###### 4. Responsive Design

**Check for**:
- **Fixed widths**: Hard-coded widths that break on mobile
- **Touch targets**: Interactive elements < 44x44px. WCAG AA (SC 2.5.8) requires at least 24x24 CSS px unless an exception applies: spacing, an equivalent control, inline text, user-agent styling, or an essential size. Spacing passes when a 24 CSS px circle centered on the target's bounding box overlaps no other target and no other undersized target's circle
- **Broken touch interaction**: Custom sliders, drag surfaces, and scrollable control strips whose primary gesture fails under touch, that swallow page scroll or lose the drag to it, or that stay stuck after an interrupted gesture. Code tells: mouse-only handlers, no `touch-action` on a pointer-event drag surface, drag state that nothing clears on cancel, lost capture, or blur. Exercise the gesture when a browser tool can synthesize touch (a rendered viewport proves layout, not the gesture), then say what produced the evidence (emulated viewport, synthesized touch, which engine, physical device) and what stayed untested
- **Horizontal scroll**: Content overflow on narrow viewports
- **Text scaling**: Layouts that break when text size increases
- **Missing breakpoints**: No mobile/tablet variants

On RTL-declared pages, each of the following is a signal to verify the rendered result, not a defect in itself; flag only where the rendering is actually wrong:
- **Physical directional properties**: `margin-left/right`, `padding-left/right`, `text-align: left/right`, `float: left/right`, `border-left/right` where logical equivalents (`margin-inline-start/end`, `padding-inline-start/end`, `text-align: start/end`, `float: inline-start/end`, `border-inline-start/end`) would be expected. A direction-scoped override like `[dir="rtl"] .x { margin-right:1rem }` is correct only when it also clears the conflicting base property (e.g. `margin-left: 0`); without that, both margins apply
- **Physical positioning on positioned elements**: `left:` or `right:` instead of `inset-inline-start` / `inset-inline-end`. Note: `left:50%; transform:translateX(-50%)` is a direction-agnostic centering pattern that works correctly in both LTR and RTL; replacing `left` with `inset-inline-start` there breaks the centering because `translateX` is physical and does not mirror
- **Directional icons and assets**: arrows, chevrons, and navigation icons that point the wrong direction for the reading order. An RTL-only page may ship assets already drawn correctly without a `[dir="rtl"]` flip; verify the rendered icon rather than assuming a missing `transform: scaleX(-1)` is a defect

**RTL scope**: flag physical directional properties only on pages that declare `dir="rtl"` on the `<html>` or `<body>` element. A `lang` attribute alone does not set direction (browsers take direction from `dir`, never from `lang`), but treat an RTL-script `lang` (`ar`, `fa`, `ur`, `ps`, `ckb`, `he`, `yi`, `ug`, `sd`, `dv`) without an explicit `dir` as a signal worth noting.

**Score 0-4**: 0=Desktop-only (breaks on mobile), 1=Major issues (some breakpoints, many failures), 2=Partial (works on mobile, rough edges), 3=Good (responsive, minor touch target or overflow issues), 4=Excellent (fluid, all viewports, proper touch targets, gestures work under touch). On RTL-declared pages, reduce by 1 for pervasive rendered RTL failures

###### 5. Implementation Integrity (CRITICAL)

Run the bundled detector and verify each finding in context. Look for repeated implementation shortcuts, design-system drift, misleading or decorative content, and structure that is interchangeable with an unrelated product. Keep deterministic findings separate from visual judgment and call out false positives.

**Desktop apps** (Electron, NW.js, CEF, WebView2): launch the app with a local DevTools port (`--remote-debugging-port=9222`, or `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222` for WebView2; keep it on 127.0.0.1, never exposed), seed the state to audit, keep the window on screen (a hidden one skips the pixel contrast reads), then run `"<skill-base-dir>/scripts/impeccable" detect --cdp 9222 --target <part of the page URL or title> --json`. It returns the same JSON as a URL scan and leaves the window as found. Take screenshots through the harness's CDP tooling, and leave the window as you found it too. Tauri on macOS (WKWebView) and on Linux (WebKitGTK) expose no CDP: scan the source and say the rendered check did not run.

**Score 0-4**: 0=systemic drift, 1=major repeated failures, 2=several verified issues, 3=minor isolated issues, 4=coherent and intentional

##### Generate Report

###### Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | ? | [most critical a11y issue or "--"] |
| 2 | Performance | ? | |
| 3 | Theming | ? | |
| 4 | Responsive Design | ? | |
| 5 | Implementation Integrity | ? | |
| **Total** | | **??/20** | **[Rating band]** |

**Rating bands**: 18-20 Excellent (minor polish), 14-17 Good (address weak dimensions), 10-13 Acceptable (significant work needed), 6-9 Poor (major overhaul), 0-5 Critical (fundamental issues)

###### Implementation Integrity Verdict
**Start here.** Pass/fail: does the implementation express a coherent product-specific system? Cite verified evidence and detector findings.

###### Executive Summary
- Audit Health Score: **??/20** ([rating band])
- Total issues found (count by severity: P0/P1/P2/P3)
- Top 3-5 critical issues
- Recommended next steps

###### Detailed Findings by Severity

Tag every issue with **P0-P3 severity**:
- **P0 Blocking**: Prevents task completion. Fix immediately
- **P1 Major**: Significant difficulty or WCAG AA violation. Fix before release
- **P2 Minor**: Annoyance, workaround exists. Fix in next pass
- **P3 Polish**: Nice-to-fix, no real user impact. Fix if time permits

For each issue, document:
- **[P?] Issue name**
- **Location**: Component, file, line
- **Category**: Accessibility / Performance / Theming / Responsive / Implementation Integrity
- **Impact**: How it affects users
- **WCAG/Standard**: Which standard it violates (if applicable)
- **Recommendation**: How to fix it
- **Suggested command**: Which command to use (prefer: /impeccable adapt, /impeccable animate, /impeccable audit, /impeccable bolder, /impeccable clarify, /impeccable colorize, /impeccable critique, /impeccable delight, /impeccable distill, /impeccable document, /impeccable harden, /impeccable layout, /impeccable onboard, /impeccable optimize, /impeccable overdrive, /impeccable polish, /impeccable quieter, /impeccable shape, /impeccable typeset)

###### Patterns & Systemic Issues

Identify recurring problems that indicate systemic gaps rather than one-off mistakes:
- "Hard-coded colors appear in 15+ components, should use design tokens"
- "Touch targets consistently too small (<44px) throughout mobile experience"

###### Positive Findings

Note what's working well: good practices to maintain and replicate.

##### Recommended Actions

List recommended commands in priority order (P0 first, then P1, then P2):

1. **[P?] `/command-name`**: Brief description (specific context from audit findings)
2. **[P?] `/command-name`**: Brief description (specific context)

**Rules**: Only recommend commands from: /impeccable adapt, /impeccable animate, /impeccable audit, /impeccable bolder, /impeccable clarify, /impeccable colorize, /impeccable critique, /impeccable delight, /impeccable distill, /impeccable document, /impeccable harden, /impeccable layout, /impeccable onboard, /impeccable optimize, /impeccable overdrive, /impeccable polish, /impeccable quieter, /impeccable shape, /impeccable typeset. Map findings to the most appropriate command. End with `/impeccable polish` as the final step if any fixes were recommended.

After presenting the summary, tell the user:

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `/impeccable audit` after fixes to see your score improve.

Keep P3s few: a long tail of minor issues buries the ones that matter.

**Avoid**:
- Report issues without explaining impact (why does this matter?)
- Provide generic recommendations (be specific and actionable)
- Skip positive findings (celebrate what works)
- Forget to prioritize (everything can't be P0)
- Report false positives without verification

##### Save the Report

After the report is delivered, save a copy so the findings outlive this conversation: write it, from the score table through Recommended Actions, to a temp file, then run the write command with the scores as metadata and delete the temp file:

```bash
IMPECCABLE_REPORT_META='{"target":"<user phrasing, or .>","total_score":<n>,"max_score":20,"p0_count":<n>,"p1_count":<n>,"p2_count":<n>,"p3_count":<n>}' \
  "<skill-base-dir>/scripts/impeccable" audit-storage write "<resolved target, or . for the whole project>" <temp-file>
```

The helper prints the path it wrote, which you mention in one line; `REPORTS OFF:` means the project opted out, and you mention nothing. Saving never replaces delivering: the user reads the report in chat first.

### `plugin/skills/impeccable/reference/polish.md`
> **Additional context needed**: quality bar and shipping constraints.

Polish is refinement, never concealed redesign. Preserve the incumbent visual world, content, behavior, and everything outside scope. If the concept itself is wrong, say so and recommend redesign or `bolder` instead of smuggling in a replacement.

A detector result is defect evidence, not proof of quality. Inspect the rendered experience and real interaction path.

##### 1. Establish the system

Read DESIGN.md and representative tokens, shared components, patterns, and neighboring flows. If no formal system exists, use coherent project conventions.

Classify each drift before fixing it:

- **missing token:** the system needs a reusable value;
- **one-off implementation:** an existing shared component or pattern should replace it;
- **conceptual mismatch:** the flow, information architecture, or hierarchy differs from comparable product areas;
- **local defect:** the implementation is simply incomplete or inconsistent.

Fix the cause at the narrowest correct level. Ask when a binding system principle cannot be inferred.

##### 2. Gather the evidence

Use the feature yourself at the surface's representative sizes: desktop and mobile on the web (`"<skill-base-dir>/scripts/impeccable" shot <page or url>` captures both); on a native platform (`ios` / `android` / `adaptive`), the shipped device classes on the simulator, emulator, or hardware, captured per the platform reference's Verifying the build section. Determine:

- whether the path is functionally complete;
- the intended quality bar and time available;
- known constraints or deliberately unfinished work;
- the states, content lengths, roles, and input methods users will actually encounter.

If a prior critique exists, use it as one input:

```bash
"<skill-base-dir>/scripts/impeccable" critique-storage latest "<resolved target>" --json
```

Exit 0 returns JSON with the latest snapshot's `body` and an exact `snapshot_file` identity. Retain `snapshot_file` until the end of the pass. For a local file target, the helper compares the file's exact current content fingerprint with the fingerprint captured by critique. Unchanged staged, unstaged, or untracked content remains current; any byte change, deletion, or replacement with a non-file closes the backlog it identified while preserving its trend history and exits 2. A URL target has no local fingerprint and remains current until explicitly closed. When current, incorporate relevant P0/P1 findings from `body` and name the snapshot read. Exit 2 means none exists or the target changed. Perform an independent pass either way.

##### 3. Triage

Separate functional defects from cosmetic ones and fix in this order:

1. broken or blocked tasks, data loss, misleading state, and inaccessible paths;
2. missing loading, empty, error, success, disabled, and permission states;
3. flow, hierarchy, responsive, and design-system drift;
4. visual and motion inconsistencies;
5. code and asset cleanup.

Do not perfect one corner while leaving the rest below the same quality bar.

##### 4. Polish the whole path

###### Flow and hierarchy

- Match neighboring mental models, terminology, disclosure, routing, save behavior, and optimistic or pessimistic patterns.
- Make the primary task and current state obvious without flattening every element to equal weight.
- Ensure arrival, transition, empty, and recovery paths connect instead of behaving as isolated screens.

###### Layout and type

- Align to the project's grid and spacing scale; fix optical as well as mathematical alignment.
- Group related content tightly and separate distinct groups generously.
- Keep same-role typography consistent; test measure, wrapping, localization expansion, zoom, and font loading.
- Verify every supported viewport rather than correcting only the current screenshot.

###### Color, imagery, and icons

- Use semantic tokens and stable color meanings across themes.
- Verify text, control, and focus contrast in every state.
- Keep icon families, stroke/weight, sizing, and optical alignment coherent.
- Prevent image layout shift; use correct aspect ratios, responsive sources, and useful alt text.

###### Interaction and state

- Every control needs appropriate default, hover, focus, active, disabled, loading, error, and success behavior.
- Preserve visible keyboard focus, logical tab order, labels, and platform-appropriate touch targets.
- Keep motion coherent, interruptible, and performant. Do not add animation merely to make polish visible.
- Validate long, missing, localized, offline, slow, and permission-limited content where the product can encounter it.

###### Content and code

- Keep terminology, capitalization, punctuation, and factual copy consistent. Ask before changing claims.
- Remove debug output, dead code, unused imports, obsolete styles, and polish-created duplication.
- Replace custom implementations with shared components where the system owns the pattern.
- Promote genuinely reusable values to tokens; do not create a system abstraction for one local exception.

##### 5. Verify and finish

Walk the complete path again with mouse, keyboard, and touch where applicable. Check:

- mobile, intermediate, and wide layouts on the web; phone and tablet size classes in both supported orientations on native;
- loading, empty, error, success, disabled, long-content, and missing-content states;
- zoom, contrast, focus, semantics, and screen-reader names;
- console errors, layout shift, interaction latency, and image loading everywhere; supported browsers on the web; supported OS versions, runtime warnings, and dropped frames on native;
- agreement with DESIGN.md, neighboring features, and the user's scope.

Follow the quality guidance supplied by `impeccable context` and hooks, then run any other relevant QA commands. Context requests a manual scan only when no automatic detector is active; never add another detector pass. Fix real defects and document only narrow intentional exceptions. A clean scan does not replace visual judgment.

Finish with a source diff: remove accidental churn, orphaned code, redundant values, and temporary artifacts. Ship only when the feature is functionally complete and consistently finished across the path.

When this pass clears every Priority Issue it took from a snapshot, close that snapshot:

```bash
"<skill-base-dir>/scripts/impeccable" critique-storage close "<resolved target>" "<snapshot_file returned by latest>"
```

This closes only the snapshot this pass actually processed; if a newer critique landed meanwhile, its backlog stays live. Do not close when no snapshot was read, when `snapshot_file` was not retained, or when Priority Issues remain.

### `plugin/skills/impeccable/reference/foundations.md`
#### /impeccable foundations

Walk the user through the product foundations every shipped project needs, and fix one at a time. This is a roadmap, not a design task: do not redesign anything on the way.

##### Without an argument: the roadmap

Run:

```
"<skill-base-dir>/scripts/impeccable" foundations
```

It checks the project's own files (and runs the design detector) offline and prints a count, the **Next up** item with why it matters, and every other item: `✓` in place, `✗` to fix, `·` not checked (it needs the network, or the project gives no evidence either way). Pass a path for one app in a monorepo.

Relay the count and the Next up item in two or three sentences, then offer to fix that item now. List the other `✗` items in one line by name. Do not explain the `·` items unless asked. If it prints `Nothing to check yet`, say so and stop. If the next item is `secrets-out-of-repo`, the output names the file and line of each key: never print, copy or quote the key itself.

##### With an id: fix that one item

`/impeccable foundations <id>` fixes one item. Read what "done" means for that id below, look at the project to find the smallest change that gets there, make it in the project's own stack and conventions, then re-run `"<skill-base-dir>/scripts/impeccable" foundations --json` and confirm `items["<id>"]` is `"checked"`. If it is, say so in one short line and name the new Next up. If it is still `"failing"`, say what the check still misses and fix that; do not game the check with an empty file or a stub that does nothing. If the id is absent from `items` (the CLI can't judge it here: `real-packages`, `current-dependencies`, or contrast in an app whose components only the regex engine reads), verify the definition below yourself, say what you checked, and don't claim the CLI confirmed it.

Ask before anything that needs the user: an account (Sentry, a host), a key, legal wording, or a product decision. Write placeholders they must fill in only when they agree, and say exactly which lines.

##### What "done" means

Web items (`app-icons`, `not-found-page`, `social-previews`, `legal-pages`, `error-tracking`) need a web UI. Server frameworks need markup templates or served markup pages; an API-only server sends none of them. Rails with `config.api_only = true` is never web.

- **secrets-out-of-repo**: no tracked file holds a private key or a key in a known format. Public Firebase client config does not count as a Google-key leak; other key formats in that file still count. Tracked env files fail on real values under `_`-separated secret name segments (KEY, SECRET, TOKEN, PASSWORD, PASSWD, PWD, CREDENTIAL, PRIVATE), or URLs with passwords. Public-prefixed names, variable references and obvious placeholders do not count. A DSN or URL without a password is not secret evidence. Example/sample/template env files do not count as tracked env leaks. Move real secrets to an untracked env file or the host's secret store. Rotate any exposed credential; deleting it does not remove it from history. Never repeat its value.
- **readable-contrast**: the detector finds no low-contrast text in the full scan. Run `"<skill-base-dir>/scripts/impeccable" detect --json .`, fix each `low-contrast` finding at its token or style, and prefer darkening a shared token over one-off overrides. A pass is sent only when every page's styles are in the files scanned: a page that runs a script, or takes a stylesheet from another host (linked or `@import`ed), sends nothing, and so does a project too large to walk in full.
- **no-generic-ai-patterns**: the detector finds none of its generic-AI pattern rules. Fix the findings from `"<skill-base-dir>/scripts/impeccable" detect --json .` in the project's own design language; PRODUCT.md and DESIGN.md say what that is.
- **not-found-page**: the framework's own not-found page exists: Next `app/not-found.tsx` (or `pages/404`), SvelteKit `src/routes/+error.svelte`, Nuxt `error.vue`, Astro or Gatsby `src/pages/404`, Remix or React Router an `ErrorBoundary` in `app/root` or a `$.tsx` splat route, a client-routed SPA a catch-all `path="*"` route, a static or Hugo or Jekyll site a `404.html`. It says what happened and links home, in the product's voice.
- **app-icons**: a favicon and a large app icon, as image files in the public folders (including `public/icons/`, `static/icons/`, `public/images/`), or local images linked by `rel="icon"`, `rel="apple-touch-icon"` or a web manifest. Source components do not count. Ask for the logo if there is none; never invent a brand mark.
- **social-previews**: a share image in `og:image`, `twitter:image`, framework metadata (including Nuxt `ogImage` and Next `generateMetadata` with `openGraph.images`), or an `opengraph-image` file. `twitter:card` alone and comments do not count. Aim for 1200×630.
- **legal-pages**: a privacy page and a terms page, as routes or files named `privacy` and `terms` (or `tos`), linked from the footer. Draft them only if the user asks, mark them as drafts for their review, and never present generated text as legal advice.
- **readme-runs**: notes-only repos send nothing. Otherwise, install and run commands for this project appear in README code blocks or code spans, and every named package script exists. Scaffolding commands such as `npx create-next-app` do not count.
- **ci-runs-tests**: a CI command runs tests on pushes or pull requests. Common package managers and test runners count; comments do not. Notes-only repos send nothing. Missing CI, checkout/setup alone, or only recognised non-test commands (install, build, lint, format, typecheck, deploy, echo) fails. An unclassified command sends nothing.
- **design-tokens**: a project colour custom property is defined and used through `var()`, or there is a recognised tokens file or theme source. Unused definitions and third-party variables do not count. HTML entities are not hex colours.
- **reduced-motion**: motion has a real reduced-motion guard. CSS animation, transitions, Web Animations, Svelte directives, Motion components and Tailwind `animate-*` count as motion; commented guards do not.
- **real-packages**: not checked by the CLI (needs the network). Confirm each dependency exists on its registry and is the package you meant.
- **dependency-scanning**: Dependabot (`.github/dependabot.yml`) or Renovate is configured for the project's package managers.
- **error-tracking**: an error-tracking SDK (Sentry, Bugsnag, Rollbar, Honeybadger, Highlight, LogRocket, Datadog RUM) is a dependency and initialised at the app's entry. The user creates the account; read the DSN from the environment.
- **reversible-migrations**: every migration has a down step the tool can run: knex, Sequelize, TypeORM or umzug files export `down`, Rails uses `def change` or `def down`, Laravel has `down()`, golang-migrate has a `.down.sql` beside each `.up.sql`, dbmate and goose have a non-empty down section.
- **no-giant-files**: no hand-written source file is over 1,000 lines. Split along the seams the file already has; change no behaviour while doing it.
- **current-dependencies**: not checked by the CLI (needs the network). `npm outdated` or the ecosystem's equivalent shows what is far behind.
- **infrastructure-as-code**: the hosting setup lives in the repo (`wrangler.toml`, `vercel.json`, a `Dockerfile`, Terraform, and the like). A package library without app evidence and a notes-only repo send nothing when hosting config is absent. An Expo app uses `eas.json`, and fails without it; a bare React Native app without one sends nothing.

### `plugin/skills/impeccable/reference/adapt.md`
> **Additional context needed**: target platforms/devices and usage contexts.

Adapt an existing design to a different context: another screen size, device, platform, or use case. The trap is treating adaptation as scaling. The job is rethinking the experience for the new context.

**Web only** (mobile web included). Native platforms (`ios` / `android` / `adaptive`) route to [adapt.native.md](adapt.native.md) instead; if the project is native, switch to it now.

---

##### Assess Adaptation Challenge

Understand what needs adaptation and why:

1. **Identify the source context**:
   - What was it designed for originally? (Desktop web? Mobile app?)
   - What assumptions were made? (Large screen? Mouse input? Fast connection?)
   - What works well in current context?

2. **Understand target context**:
   - **Device**: Mobile, tablet, desktop, TV, watch, print?
   - **Input method**: Touch, mouse, keyboard, voice, gamepad?
   - **Screen constraints**: Size, resolution, orientation?
   - **Connection**: Fast wifi, slow 3G, offline?
   - **Usage context**: On-the-go vs desk, quick glance vs focused reading?
   - **User expectations**: What do users expect on this platform?

3. **Identify adaptation challenges**:
   - What won't fit? (Content, navigation, features)
   - What won't work? (Hover states on touch, tiny touch targets)
   - What's inappropriate? (Desktop patterns on mobile, mobile patterns on desktop)

Adaptation is rethinking the experience for the new context, not scaling pixels.

##### Plan Adaptation Strategy

Create context-appropriate strategy:

###### Mobile Adaptation (Desktop → Mobile)

**Layout Strategy**:
- Single column instead of multi-column
- Vertical stacking instead of side-by-side
- Full-width components instead of fixed widths
- Bottom navigation instead of top/side navigation

**Interaction Strategy**:
- Touch targets 44x44px minimum (not hover-dependent)
- Swipe gestures where appropriate (lists, carousels)
- Bottom sheets instead of dropdowns
- Thumbs-first design (controls within thumb reach)
- Larger tap areas with more spacing

**Content Strategy**:
- Progressive disclosure (don't show everything at once)
- Prioritize primary content (secondary content in tabs/accordions)
- Shorter text (more concise)
- Larger text (16px minimum)

**Navigation Strategy**:
- Hamburger menu or bottom navigation
- Reduce navigation complexity
- Sticky headers for context
- Back button in navigation flow

###### Tablet Adaptation (Hybrid Approach)

**Layout Strategy**:
- Two-column layouts (not single or three-column)
- Side panels for secondary content
- Master-detail views (list + detail)
- Adaptive based on orientation (portrait vs landscape)

**Interaction Strategy**:
- Support both touch and pointer
- Touch targets 44x44px but allow denser layouts than phone
- Side navigation drawers
- Multi-column forms where appropriate

###### Desktop Adaptation (Mobile → Desktop)

**Layout Strategy**:
- Multi-column layouts (use horizontal space)
- Side navigation always visible
- Multiple information panels simultaneously
- Fixed widths with max-width constraints (don't stretch to 4K)

**Interaction Strategy**:
- Hover states for additional information
- Keyboard shortcuts
- Right-click context menus
- Drag and drop where helpful
- Multi-select with Shift/Cmd

**Content Strategy**:
- Show more information upfront (less progressive disclosure)
- Data tables with many columns
- Richer visualizations
- More detailed descriptions

###### Print Adaptation (Screen → Print)

**Layout Strategy**:
- Page breaks at logical points
- Remove navigation, footer, interactive elements
- Black and white (or limited color)
- Proper margins for binding

**Content Strategy**:
- Expand shortened content (show full URLs, hidden sections)
- Add page numbers, headers, footers
- Include metadata (print date, page title)
- Convert charts to print-friendly versions

###### Email Adaptation (Web → Email)

**Layout Strategy**:
- Narrow width (600px max)
- Single column only
- Inline CSS (no external stylesheets)
- Table-based layouts (for email client compatibility)

**Interaction Strategy**:
- Large, obvious CTAs (buttons not text links)
- No hover states (not reliable)
- Deep links to web app for complex interactions

##### Implement Adaptations

Apply changes systematically:

###### Responsive Breakpoints

Choose appropriate breakpoints:
- Mobile: 320px-767px
- Tablet: 768px-1023px
- Desktop: 1024px+
- Or content-driven breakpoints (where design breaks)

###### Layout Adaptation Techniques

- **CSS Grid/Flexbox**: Reflow layouts automatically
- **Container Queries**: Adapt based on container, not viewport
- **`clamp()`**: Fluid sizing between min and max
- **Media queries**: Different styles for different contexts
- **Display properties**: Show/hide elements per context

###### Touch Adaptation

- Increase touch target sizes (44x44px minimum)
- Add more spacing between interactive elements
- Remove hover-dependent interactions
- Add touch feedback (ripples, highlights)
- Consider thumb zones (easier to reach bottom than top)

###### Content Adaptation

- Use `display: none` sparingly (still downloads)
- Progressive enhancement (core content first, enhancements on larger screens)
- Lazy loading for off-screen content
- Responsive images (`srcset`, `picture` element)

###### Navigation Adaptation

- Transform complex nav to hamburger/drawer on mobile
- Bottom nav bar for mobile web
- Persistent side navigation on desktop
- Breadcrumbs on smaller screens for context

Test on real devices. DevTools emulation is a useful first pass but misses real touch, performance, and browser chrome.

**Avoid**:
- Hide core functionality on mobile (if it matters, make it work)
- Assume desktop = powerful device (consider accessibility, older machines)
- Use different information architecture across contexts (confusing)
- Break user expectations for platform (mobile users expect mobile patterns)
- Forget landscape orientation on mobile/tablet
- Use generic breakpoints blindly (use content-driven breakpoints)
- Ignore touch on desktop (many desktop devices have touch)

##### Verify Adaptations

Test thoroughly across contexts:

- **Real devices**: Test on actual phones, tablets, desktops
- **Different orientations**: Portrait and landscape
- **Different browsers**: Safari, Chrome, Firefox, Edge
- **Different OS**: iOS, Android, Windows, macOS
- **Different input methods**: Touch, mouse, keyboard
- **Edge cases**: Very small screens (320px), very large screens (4K)
- **Slow connections**: Test on throttled network

**Custom controls** (sliders, drag surfaces, scrollable control strips): a before/after slider can pass every width check above and still refuse to drag on iOS, so exercise each one in scope in the same batched round as the checks above:

- **Primary gesture**: Tap it and confirm it responds as designed, then drag it with the target input method; the drag must complete, not just start
- **Scroll across it**: A swipe along the page's scroll axis across the control scrolls the page or container without activating it; a drag that starts on the control along its axis moves the control, not the page. Neither failure throws an error, so try both
- **Evidence**: Say what produced the evidence: an emulated viewport, synthesized touch input through a browser tool, which engine ran it (Chromium is not Safari), or a physical device. Screenshots and resized viewports verify layout, never a gesture. Name what stayed untested and move on; unreachable hardware is a reported gap, not a blocker

When the adaptation feels native to each context, hand off to `/impeccable polish` for the final pass.

---

##### Reference Material

The sections below were previously `responsive-design.md` and live inline now so the adapt flow has its deep responsive reference in one place.

###### Responsive Design

###### Mobile-First: Write It Right

Start with base styles for mobile, use `min-width` queries to layer complexity. Desktop-first (`max-width`) means mobile loads unnecessary styles first.

###### Breakpoints: Content-Driven

Don't chase device sizes; let content tell you where to break. Start narrow, stretch until design breaks, add breakpoint there. Three breakpoints usually suffice (640, 768, 1024px). Use `clamp()` for fluid values without breakpoints.

###### Detect Input Method, Not Just Screen Size

**Screen size doesn't tell you input method.** A laptop with touchscreen, a tablet with keyboard. Use pointer and hover queries:

```css
/* Fine pointer (mouse, trackpad) */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
}

/* Coarse pointer (touch, stylus) */
@media (pointer: coarse) {
  .button { padding: 12px 20px; }  /* Larger touch target */
}

/* Device supports hover */
@media (hover: hover) {
  .card:hover .card-surface { transform: translateY(-2px); }  /* Lift a child; the card stays the hit area */
}

/* Device doesn't support hover (touch) */
@media (hover: none) {
  .card { /* No hover state - use active instead */ }
}
```

**Critical**: Don't rely on hover for functionality. Touch users can't hover.

###### Safe Areas: Handle the Notch

Modern phones have notches, rounded corners, and home indicators. Use `env()`:

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* With fallback */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

**Enable viewport-fit** in your meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

###### Responsive Images: Get It Right

###### srcset with Width Descriptors

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
>
```

**How it works**:
- `srcset` lists available images with their actual widths (`w` descriptors)
- `sizes` tells the browser how wide the image will display
- Browser picks the best file based on viewport width AND device pixel ratio

###### Picture Element for Art Direction

When you need different crops/compositions (not just resolutions):

```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

###### Layout Adaptation Patterns

**Navigation**: Three stages: hamburger + drawer on mobile, horizontal compact on tablet, full with labels on desktop. **Tables**: Transform to cards on mobile using `display: block` and `data-label` attributes. **Progressive disclosure**: Use `<details>/<summary>` for content that can collapse on mobile.

###### Testing: Don't Trust DevTools Alone

DevTools device emulation is useful for layout but misses:

- Actual touch interactions
- Real CPU/memory constraints
- Network latency patterns
- Font rendering differences
- Browser chrome/keyboard appearances

**Test on at least**: One real iPhone, one real Android, a tablet if relevant. Cheap Android phones reveal performance issues you'll never see on simulators.

---

**Avoid**: Desktop-first design. Device detection instead of feature detection. Separate mobile/desktop codebases. Ignoring tablet and landscape. Assuming all mobile devices are powerful.

### `plugin/skills/impeccable/reference/adapt.native.md`
> **Additional context needed**: target platforms/devices and usage contexts.

Adapt an existing **native** design (`ios` / `android` / `adaptive`) to a different context: another device class, orientation, platform, or origin. The trap is treating adaptation as scaling. The job is rethinking the experience for the new context, inside the platform conventions of [ios.md](ios.md) / [android.md](android.md); read the target platform's reference before planning if Setup hasn't already.

##### Assess Adaptation Challenge

1. **Source context**: what was it designed for, and what assumptions did it make? (Phone-only? Portrait-only? One platform's idioms? A website?)
2. **Target context**: which device class (phone, tablet, foldable), orientation, platform, and usage posture (one-handed on the go vs two-handed at rest)?
3. **What breaks**: navigation that doesn't fit the target, layouts that stretch instead of restructure, gestures or controls that don't exist there?

##### Adaptation Strategies

###### Phone → Tablet (iPad / large screens)

- **Restructure, don't stretch.** A scaled-up phone UI on a tablet is the failure mode. Use size classes (iOS) / window size classes (Android) to switch structure.
- **Navigation changes shape**: tab bar stays or becomes a sidebar on iPad; Android navigation bar becomes a rail or drawer on expanded width.
- **Use the width**: split view / master-detail (list + detail side by side), multi-column grids, popovers where phones used sheets.
- **Multitasking is a size, not an edge case**: iPad Split View and Android multi-window can hand you a phone-width window on a tablet; size-class-driven layout handles both for free.

###### Orientation & foldables

- Landscape restructures (side-by-side panes, repositioned controls); never clip or letterbox. Lock orientation only when the task truly demands it.
- Foldables (Android): react to posture and hinge via window size classes; test folded, unfolded, and tabletop.

###### Platform → platform (iOS ↔ Android)

Translate idioms; never transplant them:

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail / drawer |
| Edge-swipe back, back chevron | Predictive Back gesture / button |
| Switch, segmented control, system pickers | Material switch, chips, Material pickers |
| Action sheet | Bottom sheet / Material dialog |
| SF Symbols, SF Pro, Dynamic Type | Material Symbols, Roboto, sp scaling |
| Semantic system colors, materials | Material color roles, tonal elevation |
| System push/sheet transitions | Container transform, shared-axis, fade-through |

Rebuild navigation and controls in the target's vocabulary; carry over the brand's expressive layer (palette intent, type accent, motion personality) through the target's theming system.

###### Web → native (porting a website or web app)

Reconform, don't reflow. Replace web navigation with the platform's model, HTML-shaped controls with platform controls, hover affordances with touch-first ones, and px-based type with Dynamic Type / sp. Then treat the result to the full platform reference; the slop test there is the acceptance bar.

##### Implement & Verify

- Drive structure from **size classes / window size classes**, never from device-model checks.
- Respect safe areas and window insets in every new configuration (notch, hinge, status bar, keyboard).
- Test on simulators for breadth, then real hardware for truth: at least one phone and one tablet per shipped platform, both orientations, split-screen where supported.

When the adaptation feels native to each context, hand off to `/impeccable polish` for the final pass.

**Avoid**:
- Ship a stretched phone layout on a tablet
- Port one platform's controls or navigation onto the other
- Hide core functionality on smaller devices (if it matters, make it work)
- Lock orientation to dodge a layout bug
- Trust simulators alone (posture, gestures, and performance need hardware)

### `plugin/skills/impeccable/reference/android.md`
#### Android platform

For native Android apps: Jetpack Compose, Android Views, React Native, Expo, Flutter shipping to Android hardware.

On native, the visitor mode narrows what expression may override. Material Design 3 governs structure, navigation, and interaction in every mode; brand expresses through Material's theming (color roles, type scale, shape, motion). A Material-everywhere cross-platform app that also ships to iPhone still owes iOS its OS guarantees on that hardware: safe-area insets, Reduce Motion, edge-swipe back.

##### The Android slop test

Would a fluent Android user trust this app, or trip on off-spec components? The most common tell is an iOS app wearing Android's skin: a bottom-only navigation copied from iPhone, a back arrow that ignores the system Back gesture, Cupertino-shaped switches and dialogs. Material 3 is the rulebook; follow its components and theme the brand through it.

##### Layout & structure

- **Material navigation, matched to size.** Navigation bar (bottom, 3–5 destinations) on compact width; navigation rail or drawer on expanded width. Never ship a phone bottom-bar untouched on a tablet.
- **System Back always works.** Honor the predictive Back gesture and Back button; never trap the user or hijack the gesture.
- **Edge-to-edge with window insets.** Apply the status bar, navigation bar, display cutout, and IME insets so content never hides behind system bars or the keyboard.
- **Top app bar for screen context**; pair with a FAB when the screen has a single primary action.

##### Touch targets

- **48×48 dp minimum** for every touch target, with at least 8 dp between them.

##### Typography

- **Material type scale.** Display, Headline, Title, Body, Label roles (large/medium/small each). Map text to roles; never hand-pick sizes per screen.
- **Roboto is the system face**; theme a brand face in through the type scale, keeping body, labels, and controls legible and consistent.
- **sp units, never fixed px**, so type follows the system font-size setting.

##### Color & theming

- **Material color roles** (primary, on-primary, surface, surface-variant, secondary-container, outline, error). Role tokens resolve light/dark and contrast variants automatically; raw hex breaks there.
- **Dynamic Color (Material You)** where it fits: derive the scheme from the user's wallpaper on Android 12+, with a static fallback.
- **Dark theme is a first-class scheme.** Design and test it; never a quick invert.
- **Tonal elevation.** Convey elevation through the standard surface tonal levels (plus shadow where appropriate); no arbitrary drop shadows.

##### Components & motion

- **Material components.** Buttons (filled / tonal / outlined / text), FAB, switches, chips, snackbars, bottom sheets, Material dialogs, navigation bar/rail/drawer. Never port iOS controls or invent equivalents.
- **One FAB, one primary action.** Never stack FABs or spend one on a secondary task.
- **Snackbars for transient feedback** (actionable when useful, never a toast for that); dialogs only for decisions that must interrupt.
- **Material motion patterns.** Container transform, shared-axis, fade-through, with standard easing and durations; honor the system Remove animations setting with a crossfade or instant cut.

##### Verifying the build

- **Screenshots come from the emulator or a connected device, never a browser.** Build and install, then capture with `adb exec-out screencap -p > <path>` (pick a device with `adb -s <serial>` when several are attached). Capture every device class the app ships to, at least one phone and, when tablets are a target, one tablet, and write the files where the review flow expects them.
- **Dark theme and font scale belong in the pass.** `adb shell cmd uimode night yes` flips the theme; `adb shell settings put system font_scale 1.3` (read both settings first with `adb shell cmd uimode night` and `adb shell settings get system font_scale`, and restore them after) catches the clipped labels a fixed layout hides; with several targets attached, the capture's `-s <serial>` goes on these commands too.
- **Emulators give breadth; gestures, refresh rates, and performance need hardware.** Say which one produced the evidence.

### `plugin/skills/impeccable/reference/animate.md`
> **Additional context needed**: performance constraints.

Use motion to explain state, relationship, and hierarchy, or to create one authored moment the surface has earned. Decoration without purpose is animation debt.

---

##### Visitor mode

- **Persuade + Experience:** motion may carry the voice. Prefer one rehearsed focal sequence to repeated section reveals.
- **Operate + Read:** motion serves feedback, state, and continuity. Keep routine transitions fast and do not make users wait through page-load choreography.
- **Native (`ios` / `android` / `adaptive`):** follow the Motion section of [ios.md](ios.md) or [android.md](android.md), including the platform's Reduce Motion behavior. Do not apply the web tooling below.

##### Find the job

Inspect the existing motion language, interaction states, target devices, and performance budget. Find only the places where motion would:

- acknowledge an action;
- make a state change or spatial relationship legible;
- preserve continuity through navigation or layout change;
- direct attention at a meaningful moment;
- embody the selected visual world.

Ask only when a material constraint cannot be inferred. Do not animate a static area merely because it exists.

##### Set the motion thesis

Write a short plan before implementation:

- **Focal moment:** the one sequence or interaction that deserves authorship, if any.
- **Continuity:** the state, layout, or navigation changes that need explanation.
- **Feedback:** the controls and outcomes that need acknowledgment.
- **Budget:** which effects may be expensive and how often they run.

The focal moment must come from this product and surface concept. A generic fade-and-rise, hover lift, parallax layer, or scroll reveal is not a thesis.

##### Choose material by meaning

Transform and opacity are reliable foundations, not the entire palette. Choose properties for what the transition communicates:

- **Continuity and relationship:** shared-element motion, FLIP-style transforms, view transitions, or deliberate spatial movement.
- **Focus and depth:** bounded blur, filter, backdrop, light, or shadow changes.
- **Reveal and composition:** masks, clip paths, cropping, or controlled occlusion.
- **Material and energy:** color, gradient position, texture, distortion, or shader effects when the world and runtime support them.
- **State and feedback:** the smallest change that makes cause and result unmistakable.

Do not stack techniques for spectacle. One strong material idea, carried through the focal sequence and quiet supporting states, is usually enough.

Sibling stagger is appropriate when a list appears as a list. Cap the total delay, and never reinterpret every scrolled section as a staggered list.

##### Timing and easing

Timing should express distance and consequence:

| Duration | Typical use |
|---|---|
| 100–150 ms | immediate feedback |
| 150–300 ms | routine state change |
| 300–500 ms | layout, overlay, or view transition |
| 500–800 ms | a deliberately authored focal entrance |

Exit faster than entrance. Use natural deceleration such as `cubic-bezier(0.16, 1, 0.3, 1)` for confident arrivals; do not use bounce or elastic curves by reflex. Long feedback feels like latency.

##### Hover

Hover motion never moves a neighbor or takes its pointer target. Keep the hovered element still and let a child carry the motion (`.card:hover .card-surface { transform: translateY(-2px) }`). An element that moves itself slides out from under a pointer near its edge and flickers. Optional previews wait for the pointer to settle: for a CSS reveal, set `transition-delay` on the hover state only, so leaving is not delayed.

##### Implement to the runtime

- Use CSS transitions and keyframes for declarative state and bounded sequences.
- Use Web Animations API or the project's existing motion library for interruption, sequencing, and dynamic values.
- Use View Transitions or shared-element techniques when continuity across states is the point.
- Use scroll-driven motion only when the scroll relationship itself carries meaning, with a robust fallback.
- Do not add a dependency for an effect the existing stack can express cleanly.

Keep content visible in the default state so failed scripts do not hide the page. Avoid casually animating layout-driving properties such as `width`, `height`, `top`, `left`, and margins; use FLIP, transforms, or grid techniques when appropriate. Bound blur, filter, shadow, canvas, and shader work to isolated regions. Apply `will-change` only during known animation. Measure on target viewports and devices rather than assuming transform means fast.

##### Accessibility and control

Respect autoplay and sound preferences. Any nonessential loop must stop when offscreen or hidden.

Every web animation needs a `prefers-reduced-motion` path with an intentional alternative. Remove or reduce spatial movement while preserving opacity, color, and state transitions that carry meaning. Reduced motion means fewer and gentler animations, not disabling all motion; feedback that confirms an action should remain legible.

##### Verify

On the web, capture implemented motion before calling it smooth. Use the skill-internal measuring verb (not a separate user command), once normally and once with reduced motion, with the same URL, interaction, and region:

```sh
"<skill-base-dir>/scripts/impeccable" motion-capture <url> --click '<selector>' --region '<region-selector>' --out-dir .impeccable/review/motion/normal
"<skill-base-dir>/scripts/impeccable" motion-capture <url> --click '<selector>' --region '<region-selector>' --reduced-motion --out-dir .impeccable/review/motion/reduced
```

For keyboard or multi-step interactions pass `--steps <json-file>` instead of `--click`, such as `[{"click":"#toggle"},{"press":"Enter"}]`; steps are click, hover, press (navigation keys), and wait (milliseconds). Capture each entrance and exit separately: for an exit, `--setup <json-file>` runs the same kind of steps and lets them settle before the first frame, such as opening the panel whose close is under review. The fixed capture points are before, first animated, evenly spaced middle, last animated, and settled frames. Inspect each directory's frame PNGs, `filmstrip.png`, and `report.json` before sending it: blank, wrong-region, stale, or missing evidence requires recapture. The report's limitations are unmeasured checks, not a clean result. Never judge motion by a single element or a single screenshot.

Spawn the shipped `impeccable-motion-reviewer` fresh (`impeccable_motion_reviewer` in Codex; `/impeccable-motion-reviewer` in Cursor; on GitHub Copilot say "Use the impeccable-motion-reviewer agent"), with no forked conversation history. Pass the original request, the motion thesis above, both capture directories (plus entrance and exit captures where applicable), DESIGN.md's motion rules if any, and the craft-floor reference path. The reviewer has no browser and reviews only the provided evidence. Never read its agent definition before spawning; the harness loads it. Wait with one long timeout; verify a disposition-first return with `continuity`, `craft`, `reduced_motion`, `material_fixes`, and `keep`. Respawn an empty or incomplete return once with the same packet. Only when the harness has no subagent capability, run a separate fresh pass from [degraded/motion-reviewer.md](degraded/motion-reviewer.md), and disclose the substitution at finish.

Act on the disposition. **recapture:** repair the named evidence and request a full review; invalid evidence binds no verdict. **fix:** apply the ordered material fixes in one batch, recapture normal and reduced motion over the same files, and continue the same reviewer for a verdict pass scoring each fix resolved, partial, or unresolved. Without continuation, pass the prior findings and new captures to a fresh reviewer. **ship:** report that word at the scope the reviewer actually checked. Two rounds maximum (initial review, then post-fix verdict); stop if a round resolves nothing. Report remaining fixes or missing evidence honestly at the ceiling; never turn a partial or unresolved verdict into a claim of smoothness.

- The focal motion is specific to the selected world and surface.
- Every supporting animation explains feedback, state, or relationship.
- Interruption and repeated use behave correctly.
- Desktop, mobile, and keyboard paths remain usable.
- The `prefers-reduced-motion` path reduces movement without erasing meaningful feedback or state changes.
- Expensive effects stay smooth on the target device.
- Removing an animation would lose meaning or authored character, not merely decoration.

When motion earns its place, hand off to `/impeccable polish` for the final pass.

### `plugin/skills/impeccable/reference/craft.md`
#### Craft (deprecated alias)

`craft` is a deprecated alias for an ordinary request to make new visual work. It adds no setup, interview, checkpoint, tool, or quality behavior. Apply SKILL.md's normal routing: create missing PRODUCT.md through [init.md](init.md), then follow [new-work.md](new-work.md) for visual authority, world and surface decisions, implementation, and finish.

Do not tell users they need to invoke `craft`. Natural requests such as “build this feature,” “make a landing page,” or “redesign this screen” use the same flow.

## Appendix D — Not inlined (size budget), read from source when needed
- [`plugin/skills/impeccable/reference/audit.native.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/audit.native.md)
- [`plugin/skills/impeccable/reference/bolder.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/bolder.md)
- [`plugin/skills/impeccable/reference/clarify.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/clarify.md)
- [`plugin/skills/impeccable/reference/colorize.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/colorize.md)
- [`plugin/skills/impeccable/reference/component-review.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/component-review.md)
- [`plugin/skills/impeccable/reference/delight.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/delight.md)
- [`plugin/skills/impeccable/reference/distill.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/distill.md)
- [`plugin/skills/impeccable/reference/doctor.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/doctor.md)
- [`plugin/skills/impeccable/reference/document.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/document.md)
- [`plugin/skills/impeccable/reference/extract.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/extract.md)
- [`plugin/skills/impeccable/reference/generate.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/generate.md)
- [`plugin/skills/impeccable/reference/harden.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/harden.md)
- [`plugin/skills/impeccable/reference/hooks.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/hooks.md)
- [`plugin/skills/impeccable/reference/init.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/init.md)
- [`plugin/skills/impeccable/reference/ios.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/ios.md)
- [`plugin/skills/impeccable/reference/layout.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/layout.md)
- [`plugin/skills/impeccable/reference/live-setup.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/live-setup.md)
- [`plugin/skills/impeccable/reference/live.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/live.md)
- [`plugin/skills/impeccable/reference/mode-operate.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/mode-operate.md)
- [`plugin/skills/impeccable/reference/mode-persuade.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/mode-persuade.md)
- [`plugin/skills/impeccable/reference/mode-read.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/mode-read.md)
- [`plugin/skills/impeccable/reference/new-work-comp.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/new-work-comp.md)
- [`plugin/skills/impeccable/reference/new-work-world.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/new-work-world.md)
- [`plugin/skills/impeccable/reference/onboard.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/onboard.md)
- [`plugin/skills/impeccable/reference/operate.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/operate.md)
- [`plugin/skills/impeccable/reference/optimize.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/optimize.md)
- [`plugin/skills/impeccable/reference/overdrive.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/overdrive.md)
- [`plugin/skills/impeccable/reference/quieter.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/quieter.md)
- [`plugin/skills/impeccable/reference/region-map.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/region-map.md)
- [`plugin/skills/impeccable/reference/routing.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/routing.md)
- [`plugin/skills/impeccable/reference/shape.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/shape.md)
- [`plugin/skills/impeccable/reference/typeset.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/typeset.md)
- [`plugin/skills/impeccable/reference/visualize.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/visualize.md)
- [`plugin/skills/impeccable/reference/degraded/asset-producer.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/degraded/asset-producer.md)
- [`plugin/skills/impeccable/reference/degraded/documenter.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/degraded/documenter.md)
- [`plugin/skills/impeccable/reference/degraded/finish-reviewer.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/degraded/finish-reviewer.md)
- [`plugin/skills/impeccable/reference/degraded/manual-edit-applier.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/degraded/manual-edit-applier.md)
- [`plugin/skills/impeccable/reference/degraded/motion-reviewer.md`](https://github.com/pbakaus/impeccable/blob/b49177d/plugin/skills/impeccable/reference/degraded/motion-reviewer.md)

---
**Source & credit:** [pbakaus/impeccable](https://github.com/pbakaus/impeccable) @ `b49177d` (cloned 2026-11-22). License: Apache-2.0. All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
