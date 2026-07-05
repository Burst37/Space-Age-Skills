# Concept visualization — visualize the idea, not the words

> The single biggest quality gap in educational edits is **text-forwardness**: the
> editor hears a sentence and re-displays the sentence as a styled card. That adds
> emphasis but teaches nothing. For Luuk's channel — which is *educational* — the
> visual must carry information the words alone cannot: the **mechanism**, the
> **relationship**, the **structure**, the **before→after**. This doc is the
> doctrine that makes the planner reach for an *explanatory* visual at the moments
> that matter, and pick the right one.

This is a first-class planning pass, run alongside the [longform template picker](longform_workflow.md)
and the [intro recipe](intro_recipe.md). The picker answers "what surface speech act
is happening?" (a number, a tool name, a list). This doc answers the question the
picker misses: **"is the speaker explaining how something works — and if so, what is
the one visual that would make a muted viewer understand it?"**

---

## 1. The test that gates every educational beat

Before you place ANY visual on an explanation, answer in one sentence:

> **"What does the viewer now understand from this visual that the spoken words alone
> didn't give them?"**

- If the answer restates the sentence ("it shows the words he's saying") → it's a
  **text card**, not a concept visual. Fine for a punchline; useless for teaching.
- If the answer is "they can now see how A leads to B", "they can see the two things
  side by side", "they can see the part inside the whole", "they can see it change" →
  that's a **concept visual**. Build it.

This is the educational sibling of non-negotiable #6. Rule #6 asks *"is this visual
meaningful?"*; this asks the harder question *"does this visual teach?"*

---

## 2. Detecting an "explanation beat"

Walk the transcript. An explanation beat is any stretch where the speaker is making
the viewer understand a *thing*, not just asserting a *claim*. Linguistic tells:

| The speaker is… | Tell phrases | Almost always wants a visual |
|---|---|---|
| Describing a **process / flow** | "first… then… after that", "what happens is", "the way it works", "it goes through", "the pipeline" | yes |
| Describing a **relationship / system** | "talks to", "connects to", "sits on top of", "feeds into", "depends on", "under the hood" | yes |
| Drawing a **contrast** | "the difference is", "old way vs", "instead of X you do Y", "used to… now" | yes |
| Defining **structure / composition** | "there are three parts", "it's made of", "inside the X is", "the anatomy of" | yes |
| Showing **change over time / proof** | "went from… to", "before… after", "grew", "dropped" | yes |
| Naming an **abstraction / metaphor** | "think of it like", "it's basically a", "imagine", "kind of a" | yes — visualize the metaphor |
| Just **asserting an opinion** | "I think", "honestly", "the truth is" | no — leave the speaker, or a text callout |

**The trap:** explanation beats are where the editor is *most tempted* to drop a
`callout` or `kinetic_statement`, because the speaker is saying something quotable.
Resist. A quotable explanation still wants the explanatory visual — the quote can ride
as a caption underneath.

---

## 3. From concept → visual: the decision procedure

Once you've flagged an explanation beat, classify the *shape of the idea* and map it.
This extends the picker with the explanatory lens up front:

1. **Is it a SEQUENCE?** (A happens, then B, then C — order matters)
   → `flow_diagram` (linear pipeline) or `ticker_feed` (events landing in time).

2. **Is it a NETWORK?** (things connect/talk, order doesn't matter, topology does)
   → `network_diagram` with `flowing: true` on edges where data moves.

3. **Is it a CONTRAST?** (two or more options weighed)
   → 2 sides → `vs_split`; 3+ options × features → `comparison_grid`;
   visual before/after of a real screen → `split_reveal`.

4. **Is it a STRUCTURE / COMPOSITION?** (parts inside a whole, anatomy, layers)
   → `concept_build` (the layered annotated build — see §5), or `network_diagram`
   with a containing node. This is the case the old library handled WORST.

5. **Is it a MAGNITUDE / CHANGE?** (a number that should be felt, growth, a drop)
   → `metric_reveal` (single number, earned) or `bar_chart` (compare magnitudes).

6. **Is it a POINT-AT?** (a specific region of a real UI matters)
   → `annotated_screenshot` with `highlights[]` + `zoom_to_highlights`.

7. **Is it an ABSTRACTION with no real referent?** (a metaphor, "the funnel", "guardrails")
   → `concept_build` with a metaphor canvas, or a generated `ai_image_on_grid`
   ONLY when the metaphor is a concrete single object. Prefer the *built* version —
   a metaphor that animates into being teaches more than a static illustration.

8. **None of the above — it's genuinely just a strong line.**
   → `callout` / `kinetic_statement`. This is the *fallback*, not the default.

> **Rule of thumb for the whole channel:** on any 60-second stretch of explanation-heavy
> content, at least one beat should be a §3.1–§3.7 *concept* visual, not a text card.
> If a whole chapter is nothing but callouts and stat_punches, the edit is text-forward
> and has failed the brief — go back and find the mechanism to draw.

---

## 4. "More than a diagram" — the four richer registers

The user's explicit ask: concept visuals should be *creative and novel*, not just a box-and-arrow
diagram every time. Four registers, roughly in increasing ambition:

1. **Progressive build** — don't reveal a finished diagram; *construct* it in sync with
   the narration. Each node/label/connector lands on the exact word that introduces it
   (`appear_sec` from `words.json`). The viewer's understanding assembles WITH the
   speaker's sentence. Every diagram template already supports per-element `appear_sec` —
   USE IT; never dump a complete diagram at `start_sec`.

2. **Presenter + canvas** — keep the speaker IN frame (follow-cam, biased to one third)
   while the concept builds in the *other* two-thirds, like a keynote. Goes beyond a
   takeover because it preserves the human while teaching. Use for the most important
   mechanism in a chapter — the moment you most want to feel "he's explaining this TO me".
   (Compositional; see §6 for status.)

3. **Metaphor canvas** — visualize the *analogy* the speaker reaches for. "The context
   window is like a desk that only fits so much" → a desk filling with papers. "Guardrails"
   → a path with rails. The `concept_build` primitive (§5) is the vehicle: place simple
   shapes/glyphs + labels and animate them to enact the metaphor. Novel, memorable, and
   it's what separates a $10k explainer from a slideshow.

4. **Annotated walkthrough** — over a real screenshot or generated frame, *progressively*
   draw attention: bracket region 1 as it's named, dim it, bracket region 2, etc.
   `annotated_screenshot` does this for real UIs; `concept_build` does it for anything.

The throughline: **the visual unfolds in time, locked to the voice.** A static visual
that's just *there* is a slide. A visual that *builds as he speaks* is editing.

---

## 5. `concept_build` — the flagship explainer primitive

A free-form, VO-synced explainer canvas. Where `flow_diagram`/`network_diagram` impose a
fixed layout, `concept_build` lets you place labeled **elements** (boxes, chips, glyph
tiles, or a containing "frame") at arbitrary positions and **connectors** between them,
and reveals each one on its spoken beat — so you can build *structure*, *composition*,
*metaphor*, or *annotation*, not just a pipeline.

See [template_library.md](template_library.md) row 29 for the schema. Core idea:

- `elements[]`: each has `label`, optional `glyph`/`sublabel`, a position (`x`,`y` as
  0–1 fractions, or a named slot), a `variant` (`box` | `chip` | `tile` | `frame` |
  `note`), optional `emphasis` (lime), and `appear_sec`.
- `connectors[]`: `from`/`to` element ids, optional `label`, optional `flowing`,
  `appear_sec` — drawn with the premium animated edge.
- Elements with `variant: "frame"` render as a containing outline behind others, so you
  can show "these three things live INSIDE the agent".

Use it when §3.4 (structure), §3.7 (abstraction/metaphor), or a build that doesn't fit
the rigid sequence/topology templates. **Always stagger `appear_sec` to the words** —
the whole point is the live build.

---

## 6. Quality bar (so concept visuals look top-notch, not like clip-art)

Every explainer template now shares the cinematic Layer-0 motion vocabulary
([motion.ts](../remotion/src/templates/motion.ts)). When authoring or extending one:

- **On-brand dark canvas.** Concept visuals render on `DarkGridBg` (raisin black + lime
  grid), never a white/light slide background — that tonal break is what made the old
  `flow_diagram`/`comparison_grid` look cheap. Light cards may sit *on* the dark canvas,
  but the canvas is dark.
- **Build, don't appear.** Elements enter with the motion-blur settle (`useWordReveal`
  drives opacity + a resolving blur + a short rise), not a hard cut. Connectors *draw*.
- **Living hold.** The whole canvas keeps a slow `useLivingHold` drift so it's never a
  frozen frame.
- **Choreographed exit.** Dissolve-forward via `useChoreographedExit`, never a hard cut.
- **One lime accent per frame** (rule §4f) — the emphasized element/connector only.
- **Depth + glow** on the emphasized element (soft shadow on neutrals, lime glow on the
  accent) so it reads as the subject.

If a concept visual looks like a PowerPoint SmartArt graphic, it's wrong. It should look
like a motion-designed keynote build.

---

## 7. Self-check for educational edits

- [ ] Every explanation beat (§2) was classified by *shape of idea* (§3), not by surface speech act.
- [ ] At least one true concept visual (not a text card) per ~60s of explanation-heavy content.
- [ ] Diagrams BUILD in sync with the words (`appear_sec` staggered), never dumped whole.
- [ ] No explainer renders on a light/white background.
- [ ] Every concept visual passes the §1 test: it teaches something the words didn't.
- [ ] Text cards (`callout`/`kinetic_statement`) are the fallback for genuine one-liners, not the default for explanations.
