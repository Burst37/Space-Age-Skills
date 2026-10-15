---
name: design-loop
description: Takes a goal and a real-world reference, extracts what actually makes the reference good, then runs a builder and three fresh-context critics on every piece until all three agree ours wins. Triggers on "/design-loop", "design loop", "run the critic loop", "loop this against".
---

# Design Loop

Five phases: interview, preflight, teardown, loop, integration. Do not skip ahead. Do not start building during phases 1 to 3.

## Phase 1: Interview

Ask exactly these three, together, then stop and wait.

1. What are you building, and how long or how big?
2. Name something that already does this brilliantly. A site, a video, a doc, anything I can open. If nothing comes to mind, say skip.
3. Any files I should work from? Design system, brand doc, script, existing draft.

If they name something vague ("Apple's website", "good SaaS design"), push once for the specific page or file. A vague bar is the number one reason this method fails: the critic invents a comparison and approves everything on round one.

If they say skip on question 2, propose three candidate bars, one line each on why, and wait. If they do not answer, take the hardest one.

If they don't name a round ceiling here, ask once: "How many rounds before I check in with you?" A default of 5 if they wave it off — see Phase 4's stall rule for why an unbounded loop is not actually safe just because it sounds principled.

## Phase 2: Preflight

A check, not a question. Run it before any work and report in one block.

- Fetch the bar now. Screenshot the URL or read the file. If it is blocked or missing, say so and ask for another.
- Confirm you can render our output: screenshots for a site, a filmstrip of frames for animation, a PDF render for a doc. No render means no craft critic.
- Name any generation tools the goal needs (image, video, voice) and confirm they are connected.
- Confirm the input files exist: design-system.md, brand doc, script.
- Name where the live progress page will live (an Artifact, in this environment) and confirm you can publish to it.

Then print: what is working, what is missing, and **which critic goes blind** if something is missing. Never carry on quietly with a critic that cannot see.

## Phase 3: Teardown

Read the reference properly and write 5 to 7 mechanisms to `bar.md`.

Mechanisms, not adjectives. "Feels premium" is useless. These are useful:
- headline is 5x body size, three type sizes total
- one accent colour, used at most twice per screen
- motion always resolves in one direction
- nothing animates for under 400ms
- whitespace above the fold is at least 40% of the frame

Every line must be something a critic can check by looking. Show `bar.md` to the user before continuing.

**Mechanisms only, never assets.** Describe what the reference does structurally; never copy its literal copy, imagery, markup, or code into our output. If a mechanism can't be stated without quoting the reference verbatim, it isn't a mechanism yet — keep abstracting until it is.

`bar.md` is a living document, not a snapshot. If a round's craft critic surfaces a mechanism the teardown missed, add it to `bar.md` with a note on which round surfaced it, and re-state it to the user in that round's progress update. Don't silently retrofit it into the definition of "won" for rounds already passed.

## Phase 4: Loop

Split the goal into the smallest pieces that can be improved and judged on their own. You choose the pieces. Keep it to three or four unless told otherwise, because every extra piece multiplies the run.

For each piece: fan out a builder, then three critics, each with fresh context and no knowledge of how the builder worked.

**Fresh context is a mechanism, not a promise.** In this environment, dispatch each critic as its own `Agent` call — never as three personas played out in one continuation. Each critic's prompt is self-contained: the piece to judge, its rendered output, and only the one document it judges against (goal statement / `design-system.md` / `bar.md` + reference render). Never give a critic the builder's reasoning, the other critics' verdicts, or prior rounds' history — that's how a critic starts grading intent instead of result.

- **Brief critic** judges against the stated goal only. Does it do the thing? Ignore aesthetics.
- **System critic** judges against `design-system.md` only. Objective adherence.
- **Craft critic** judges against `bar.md` and rendered output only. Put ours next to the reference blind: strip filenames and labels, and randomize which side is which per round so the critic can't learn "ours is always on the left." Say which is better, name the single biggest gap.

Write each critic's brief yourself, adapted to this specific goal. Do not reuse generic wording across different goals. Rotate a fourth, adversarial-only critic in every third round or so — briefed to find the harshest plausible objection, not to be balanced — so the builder is optimizing for the bar, not for three familiar personalities.

Rules:
- Critics are harsh. Praise is not useful.
- Critics judge rendered output, never the code. Reading the implementation makes a critic evaluate intent instead of result.
- Binary verdicts, not scores. Scores drift upward every round.
- All three must pass. Any fail goes back to the builder with the single biggest gap named.
- **Synthesize the gap before handing it to the builder.** Don't paste the critic's raw verdict text into the builder's brief — restate it as the outcome that's missing ("the CTA doesn't read as the single focal point on the fold") not the critic's exact phrasing. A builder handed the literal complaint will patch the complaint; a builder handed the outcome has to actually fix the thing.
- No fixed round count. The exit is winning, or the user stopping the run — but not forever:
  - **Stall rule:** if the same piece fails on the same named gap two rounds running, stop looping it silently. Report the stall to the user with what's been tried and ask whether to keep going, change the bar, or accept a documented gap.
  - **Ceiling checkpoint:** at the round count the user set in Phase 1 (default 5), pause and ask before continuing, same as a user-named cost ceiling below.

Keep a live progress page updating as work evolves: piece status, each critic's verdict, gap history, round count. Publish it as an Artifact and update it in place — don't recreate it each round.

## Phase 5: Integration

Once every piece has won standalone, run one whole-artifact craft pass: render the assembled result in full and put it against the reference the same way the craft critic did per-piece — blind, labels stripped. A piece that won in isolation can still clash with another piece that also won in isolation (a color choice, a pacing mismatch, a redundant CTA). Fix what's found here with the smallest possible change to the pieces already won — don't reopen a piece's full loop for an integration nit unless the fix genuinely requires it.

## Cost

There is no reliable self-reported token cost, so do not pretend to show one. Show round count and elapsed pieces instead.

If the user names a ceiling, treat it as a checkpoint: pause and ask before continuing past it. Tell them plainly that the real brake is them watching and stopping the run.

## What breaks this

- A vague bar. By far the most common failure.
- The builder judging its own work. Critics need fresh context — enforced by isolated agent dispatch, not just instructed.
- A soft critic. Binary job, not a score.
- A fixed round count in one direction, and an unbounded one in the other — both fail. Use the stall rule and the ceiling checkpoint.
- Handing the builder the critic's literal words instead of the synthesized gap — invites patching the complaint instead of the problem.
- Grading pieces in isolation and skipping the integration pass — a set of individually-approved pieces is not an approved whole.
- Copying the reference's actual assets or code instead of its mechanisms. That's not a win, it's a liability.
- Over-specifying. Every extra instruction is one fewer decision the model makes with its own judgment.
