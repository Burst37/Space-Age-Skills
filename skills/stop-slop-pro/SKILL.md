---
name: stop-slop-pro
description: Detect and remove AI writing tells from prose, with intensity levels, genre presets, a runnable scoring rubric, and a verify-before-ship loop. Use when drafting, editing, reviewing, or grading any text for "AI slop."
metadata:
  trigger: Writing prose, editing drafts, reviewing content, grading writing for AI patterns
  origin: Forked and 10x'd from hardikpandya/stop-slop (MIT). Adds intensity levels (pattern borrowed from caveman), a verify-loop (pattern borrowed from Karpathy guidelines #4 Goal-Driven Execution), and genre presets + self-audit rubric (new).
  license: MIT
---

# Stop Slop Pro

Eliminate predictable AI writing patterns — and prove the result is clean before you ship it.

This is a 10x rework of the original `stop-slop` skill. The original gave you a checklist.
This gives you a checklist **plus** levels of aggressiveness, genre-aware tuning, and a
verification loop so "I think it's clean" becomes "I scored it and it passed."

## 0. Set the Intensity (new)

Borrowed from caveman's intensity-level pattern — slop removal isn't one-size-fits-all.

| Level | What it does | Use for |
|-------|-------------|---------|
| **light** | Cut filler + adverbs + obvious hedging only. Keep voice intact. | Edits to someone else's draft, light copyedit |
| **standard** *(default)* | Full Core Rules pass (see §1) + structure breaking + active voice | Most prose: blog posts, docs, emails |
| **aggressive** | Standard + rewrite every sentence that could be a pull-quote, vary every paragraph length, ban all transitional phrases | Published essays, marketing copy, anything under public scrutiny |
| **forensic** | Aggressive + run the full scoring rubric (§3) on every paragraph individually and report per-paragraph scores | Grading/reviewing someone else's text, high-stakes copy |

State the level you're using before you start: `Running stop-slop at: standard`.

## 1. Core Rules (from the original — keep these, they work)

1. **Cut filler phrases.** Remove throat-clearing openers, emphasis crutches, adverbs. See [references/phrases.md](references/phrases.md).
2. **Break formulaic structures.** Avoid binary contrasts ("not X, it's Y"), negative listings, dramatic fragmentation, rhetorical setups, false agency. See [references/structures.md](references/structures.md).
3. **Use active voice.** Every sentence needs a human subject doing something.
4. **Be specific.** No vague declaratives. Name the thing. No lazy extremes ("always," "never").
5. **Put the reader in the room.** "You" beats "People." Specifics beat abstractions.
6. **Vary rhythm.** Mix sentence lengths. Two items beat three. No em dashes.
7. **Trust readers.** State facts directly. Skip hand-holding.
8. **Cut quotables.** If it sounds like a pull-quote, rewrite it plainer.

## 2. Genre Presets (new — the original was genre-blind)

Slop tells differ by genre. Calibrate before applying §1:

| Genre | Extra watch-fors | Relax on |
|-------|-----------------|----------|
| Technical docs | "Simply," "just," "easy" (insulting to the struggling reader); fake-friendly tone | Sentence-length variety matters less than precision |
| Marketing/landing copy | "Unlock," "elevate," "seamless," "game-changing," triple-rule-of-three headlines | Some rhythm/punch is the point — don't over-flatten |
| Code review / PR comments | Hedge-stacking ("might possibly want to maybe consider"); apology padding | Brevity is a feature, not slop |
| Long-form essay | Meta-commentary ("In this essay I will…"), tidy three-act conclusions | Allow some stylistic flourish if it's earned |
| Email / Slack | "I hope this finds you well," "just circling back," "happy to hop on a call" | Directness over polish |

## 3. Scoring Rubric — Make It Runnable (10x'd from the original table)

The original gave you a table to eyeball. This gives you a **procedure**:

1. Split the text into paragraphs.
2. Score each paragraph 1–10 on each dimension below.
3. Sum per paragraph (max 50). Flag any paragraph scoring **below 35**.
4. Rewrite flagged paragraphs. Re-score. Repeat until every paragraph clears 35, or — at `forensic` level — until the *average* clears 42.

| Dimension | Question | 1 = fails | 10 = passes |
|-----------|----------|-----------|-------------|
| Directness | Statements or announcements? | "It's worth noting that…" | "X happened." |
| Rhythm | Varied or metronomic? | Three same-length sentences in a row | Mixed lengths, intentional fragments |
| Trust | Respects reader intelligence? | Over-explains, hedges, softens | States and moves on |
| Authenticity | Sounds human? | Reads like a press release | Reads like a person who knows the subject |
| Density | Anything cuttable? | Padding, repetition, throat-clearing | Every sentence earns its place |

## 4. Verify-Before-Ship Loop (new — borrowed from Karpathy guidelines §4 "Goal-Driven Execution")

Don't just edit and hand it back. Close the loop:

```
1. Draft/receive text       → verify: read it once for meaning, no edits yet
2. Apply §1 + §2 calibration → verify: re-read aloud (mentally) — does it sound like a person?
3. Score with §3            → verify: every paragraph ≥ 35 (or avg ≥ 42 at forensic level)
4. If any paragraph fails   → rewrite that paragraph only (surgical — don't re-touch passing ones)
5. Re-score only the rewritten paragraphs → verify: now ≥ threshold
6. Report: "Scored N/N paragraphs above threshold. Lowest score: X (paragraph Y)."
```

Step 6 matters: hand back the *evidence*, not just the edited text. That's the difference
between "I cleaned it up" and "here's proof it's clean."

## 5. Examples

See [references/examples.md](references/examples.md) for before/after transformations,
and [references/structures.md](references/structures.md) / [references/phrases.md](references/phrases.md)
for the full banned-pattern reference (carried over from the original skill).

## Attribution

Core rules, banned-phrase/structure references, and base scoring dimensions are from
**hardikpandya/stop-slop** (MIT License, https://github.com/hardikpandya/stop-slop).
This fork adds: intensity levels, genre presets, the runnable scoring procedure, and
the verify-before-ship loop. Redistributed under the same MIT terms.

## License

MIT
