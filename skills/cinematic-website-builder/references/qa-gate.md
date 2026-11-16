# Stage 4 — QA Gate (blocking)

A build is **not complete** until it has evidence. "Looks good", "fully tested", "60fps",
"pixel perfect", "production-ready" are banned words unless a report backs them.

## 1. Automated pass — `scripts/verify.mjs`

```bash
node scripts/assemble.mjs site/index.src.html -o site/index.html
node scripts/verify.mjs site/index.html --out site/qa --budget-kb 900
# Behind a TLS-intercepting proxy (e.g. cloud sandboxes): CWB_EXTRA_CA=/path/proxy-ca.pem node scripts/verify.mjs …
# Runtime gallery only: add --skip-aeo. Live preview: --aeo-url https://preview.example.com/
```

Five Chromium passes: **desktop 1440×900 · tablet 768×1024 (touch) · mobile 390×844 (touch) ·
reduced-motion · CDN-blocked (fail-open)**. Each scrolls the full page in 0.6-viewport steps so every
trigger fires, screenshots 0/25/50/75/100 %, then probes the DOM.

Blocking (exit 1): JS/page errors · failed or 4xx/5xx requests · horizontal overflow (names the
culprit elements) · any heading/paragraph/link/button stuck invisible after the scroll-through ·
a module that threw (`.cwb-failed`) · runtime never booted · `cwb-js` still set with CDN blocked ·
native cursor hidden on touch/RM · load-phase CLS > 0.1 · desktop transfer over budget ·
missing `lang`/title/description/viewport/h1 · more than one H1 · unparseable JSON-LD ·
`<img>` without `alt` · presigned/expiring URLs · leftover `{{placeholders}}` ·
SEO/AEO hard gates (see below).

Recorded: LCP, load CLS, scroll-phase CLS, long tasks, transfer KB per pass.

> **Lab-number honesty.** Headless LCP/CLS prove regressions, not field performance. Pinned
> sections flip to `position: fixed` during scripted jumps and register scroll-phase layout-shift
> entries in the lab; that column is evidence, not a verdict. Before quoting performance to a
> client, check field data (CrUX / Vercel Speed Insights / RUM). If field CLS > 0.1, first
> suspect pins: reduce them or set `pinType: 'transform'` under a smooth-scroll setup.


## 1b. SEO/AEO pass — `aeo-check.py` (hooked by verify)

On every client build, `verify.mjs` runs `seo-aeo-optimizer/scripts/aeo-check.py`
against the local preview URL and writes `qa/aeo.json`. Protocol:
`references/seo-aeo-gate.md`.

**Blocking (exit 1):** content missing from the raw HTML · no Organization /
LocalBusiness (or vertical subtype) JSON-LD · no `<h1>` · a retrieval AI bot
blocked in `robots.txt`. Missing `seo-aeo-optimizer` is also blocking unless
`--skip-aeo` was passed (gallery / runtime regression only).

Recorded (non-blocking): automated score /60, question-heading coverage, `sameAs`
count, `llms.txt`, author/date flags. Re-run aeo-check on the live URL at ship.
Field CWV targets remain LCP < 2.5 s, INP < 200 ms, CLS < 0.1 — lab numbers in
this report are regressions, not field claims.

## 2. Visual loop — three passes, every build (director §16)

1. **Defect discovery** — open the screenshots. List what's wrong without defending it.
2. **Correction** — fix blocking/important defects; re-run verify; compare the same states.
3. **Deliberate refinement** — improve at least one of: hierarchy · brand distinction · typography ·
   conversion clarity · media crop · motion continuity · responsive composition · *removing* an effect.

Keep before/after screenshots and a 3-line change log. Feedback must be concrete:
✗ "Make the hero stronger." ✓ "At 390 px the H1 wraps to 6 lines and pushes the CTA below the fold —
drop to `clamp(2.6rem, …)`, tighten measure to 11ch."

For Flagship builds, or when the client supplied a reference site, run `design-loop`
(builder + three fresh-context critics) on the hero and the signature section.

## 3. Rubric — score 0–5 (merged: director §17 + apple-immersive audit)

| Area | 0 | 5 |
|---|---|---|
| 5-second comprehension | can't tell what/for whom | outcome + audience + CTA read instantly |
| Hierarchy & typography | generic, flat, banned faces | optical, fluid, 3 levels, distinctive |
| Brand distinction | could be any template | unmistakably this client |
| Media integrity | stretched, off-palette, drift | crafted, on-palette, text-safe |
| Motion purpose | effects with no job | every effect serves narrative or action |
| Directness | delayed, locked, jumpy | instant, interruptible, reversible |
| Mobile composition | desktop scaled down | recomposed for thumb and 390 px |
| Conversion clarity | spectacle blocks action | CTA reachable without finishing the story |
| Accessibility | motion-only experience | complete parallel experience |
| Performance | jank, oversized media | measured budgets, device degradation |
| AI-slop absence | purple gradients, emoji icons, 3 equal cards, lorem | none of `design-taste-frontend`'s tells |

**Gate:** accessibility, performance, directness, conversion ≥ 4; nothing below 3;
Factory tier average ≥ 3.5, Enhanced ≥ 4.0, Cinematic/Flagship ≥ 4.3.

## 4. Manual checks the harness can't do

- [ ] Keyboard only: Tab through the whole page — focus always visible, never lost inside a pin, dialog traps and returns focus, Esc closes overlays.
- [ ] Screen reader spot check (VoiceOver/NVDA) on hero, one split-text heading, counters, carousel.
- [ ] Real phone: iOS Safari + Android Chrome. Pins absent on phones, no scroll-jacking, hero CTA in first viewport.
- [ ] Contrast of every color-shift scene and every text-over-media state (busiest frame, not the calm one).
- [ ] Flashing: nothing flashes > 3×/s (glitch is one-shot).
- [ ] Copy passes `stop-slop-pro` (no AI tells), claims are the client's real numbers, NAP matches GBP.
- [ ] `seo-aeo-optimizer` / `sa-local-seo-geo`: JSON-LD validates in Rich Results Test; NAP matches GBP; robots.txt allows retrieval AI bots; optional llms.txt; sitemap submitted; IndexNow on deploy.
- [ ] Service pages have question-shaped H2s with 40–60 word answers in the initial HTML (not JS-injected).
- [ ] No liquid-glass or 3D goo type on law, SaaS, medical or home-healthcare sites.
- [ ] Forms/booking reach their real endpoint boundary (never claim a service works because its shell renders).
- [ ] No secrets in client code; external links `rel="noopener"`; asset licences known.

## 5. Completion gate

Complete only when: verify passes (including SEO/AEO hard gates) · visual loop done with evidence ·
rubric meets tier threshold · manual checks recorded (unresolved items disclosed, not hidden) ·
assets re-hosted · robots.txt / sitemap / IndexNow handled on ship ·
deployment verified when deploy was requested.

## 6. Delivery package

```
/site/index.html          single file (assembled)
/site/assets/…            re-hosted media, OG image, favicon
/site/robots.txt          retrieval AI bots allowed
/site/sitemap.xml         indexable 200s only
/site/llms.txt            optional
/site/qa/REPORT.md        verify output + screenshots
/site/qa/aeo.json         aeo-check.py report
/handoff/                 brief.md · design-spec.md · page-text.md · wireframe.yaml · motion-plan.yaml · type/ · greybox/ · sections/
/site/seo/                teardown + blueprint (from seo-aeo-optimizer)
```
Hand off to `sa-deploy-operator` (Stage 5). Log the build to Drive SESSION_MEMORY via `sa-obsidian-vault-ops`.

## 7. Rescue trigger

Same test fails twice · same visual defect survives two targeted fixes · a technique can't meet
the budget on target devices → stop patching. Write the rescue bundle (goal, current state, exact
failure, attempts, diff, screenshots) and change approach — downgrade the tier, drop the module —
without silently changing the approved direction.

## v3.3 automated checks (verify.mjs)

| Check | Blocks on | Flag |
|---|---|---|
| Passes | desktop, tablet, mobile, reduced (axe here), offline (CDN blocked), wide-1920, wide-2560, narrow-320 (pages with jumbo/custom type) | `--skip-offline`, `--skip-wide`, `--all-passes` |
| Kernel | page uses `data-cwb` but the runtime never booted; fail-open broken offline | — |
| Invisible text | text stuck at opacity < 0.1 (ignores collapsed accordions, `inert`, `hidden`, closed `details`, aria-controls regions) | — |
| axe | serious/critical WCAG 2.2 AA violations | `--skip-axe` |
| Motion plan | planned library / module (`data-cwb-live`) / CSS timeline missing; > 1 video playing with video-per-section | `--motion-plan` |
| Type | undeclared family/weight loaded; heading in an undeclared or unloaded (fallback) family; body contrast < 4.5:1 | `--type` |
| Spacing | text < 16px from the edge on phones; tap targets < 44px; (warn) px paddings outside tokens, off-rhythm section padding | — |
| Jumbo / custom type | no real DOM text; overflow at 320/390/1440/2560 | — |
| AI lettering | `<img data-ai-word>` not pass/confirmed in letter-check | `--letters` |
| Wide | readable text wider than 2400px | — |
| Weight | desktop first-load KB > budget (lazy media counted per step, not the whole scroll); logo > cap | `--budget-kb`, `--logo-kb` |
| Head | theme-color, apple-touch-icon, favicon resolving | — |
| Section diff | rendered section vs `handoff/sections/*.png` mismatch > 12% | `--sections`, `--diff-threshold` |
| AEO | aeo-check hard gates on money pages | `--money`, `--skip-aeo` |

After verify: `launch-check.mjs` on the live domain (`references/launch-gate.md`).
