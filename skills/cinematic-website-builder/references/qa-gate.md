# Stage 4 — QA Gate (blocking)

A build is **not complete** until it has evidence. "Looks good", "fully tested", "60fps",
"pixel perfect", "production-ready" are banned words unless a report backs them.

## 1. Automated pass — `scripts/verify.mjs`

```bash
node scripts/assemble.mjs site/index.src.html -o site/index.html
node scripts/verify.mjs site/index.html --out site/qa --budget-kb 900
# Behind a TLS-intercepting proxy (e.g. cloud sandboxes): CWB_EXTRA_CA=/path/proxy-ca.pem node scripts/verify.mjs …
```

Five Chromium passes: **desktop 1440×900 · tablet 768×1024 (touch) · mobile 390×844 (touch) ·
reduced-motion · CDN-blocked (fail-open)**. Each scrolls the full page in 0.6-viewport steps so every
trigger fires, screenshots 0/25/50/75/100 %, then probes the DOM.

Blocking (exit 1): JS/page errors · failed or 4xx/5xx requests · horizontal overflow (names the
culprit elements) · any heading/paragraph/link/button stuck invisible after the scroll-through ·
a module that threw (`.cwb-failed`) · runtime never booted · `cwb-js` still set with CDN blocked ·
native cursor hidden on touch/RM · load-phase CLS > 0.1 · desktop transfer over budget ·
missing `lang`/title/description/viewport/h1 · more than one H1 · unparseable JSON-LD ·
`<img>` without `alt` · presigned/expiring URLs · leftover `{{placeholders}}`.

Recorded: LCP, load CLS, scroll-phase CLS, long tasks, transfer KB per pass.

> **Lab-number honesty.** Headless LCP/CLS prove regressions, not field performance. Pinned
> sections flip to `position: fixed` during scripted jumps and register scroll-phase layout-shift
> entries in the lab; that column is evidence, not a verdict. Before quoting performance to a
> client, check field data (CrUX / Vercel Speed Insights / RUM). If field CLS > 0.1, first
> suspect pins: reduce them or set `pinType: 'transform'` under a smooth-scroll setup.

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
- [ ] `sa-local-seo-geo`: JSON-LD validates in Rich Results Test; robots.txt allows AI crawlers.
- [ ] Forms/booking reach their real endpoint boundary (never claim a service works because its shell renders).
- [ ] No secrets in client code; external links `rel="noopener"`; asset licences known.

## 5. Completion gate

Complete only when: verify passes · visual loop done with evidence · rubric meets tier threshold ·
manual checks recorded (unresolved items disclosed, not hidden) · assets re-hosted ·
deployment verified when deploy was requested.

## 6. Delivery package

```
/site/index.html          single file (assembled)
/site/assets/…            re-hosted media, OG image, favicon
/site/qa/REPORT.md        verify output + screenshots
/site/build-manifest.yaml tier, modules, cost, budgets, open issues
```
Hand off to `sa-deploy-operator` (Stage 5). Log the build to Drive SESSION_MEMORY via `sa-obsidian-vault-ops`.

## 7. Rescue trigger

Same test fails twice · same visual defect survives two targeted fixes · a technique can't meet
the budget on target devices → stop patching. Write the rescue bundle (goal, current state, exact
failure, attempts, diff, screenshots) and change approach — downgrade the tier, drop the module —
without silently changing the approved direction.
