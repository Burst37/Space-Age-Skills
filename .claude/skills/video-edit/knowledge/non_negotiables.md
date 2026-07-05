# Non-negotiables for every short-form video

These are HARD rules. Every render must respect them. If a plan violates one, fix the plan, don't ship.

## 1. Hook visible in the first frame

A visual must be on screen within **0.5 seconds**. Not "wait for it" — the thumbnail-frame matters as much as the spoken hook.

Implementation:
- The first b-roll (or static composition takeover, or icon overlay) should start at `start_sec: 0.0`
- The asset must be a **real promise or pattern interrupt** that maps to the spoken hook (e.g., if the speaker opens with "An AI agent deleted a production database", show the database/error icon immediately)
- Hook intro flash + slow scale-out are already in the comp — they support but don't replace this rule

## 2. Zoom punches on key words

Subtle **1.05x → 1.15x** scale-ups on important words. The `zoom_plan.py` script already picks emphasis moments (numbers, named tools, pivots) — keep that. The scale curve must be ease-in-ease-out (cubic bezier 0.4, 0, 0.2, 1), never linear. Confirmed in `EditedVideo.tsx > useGlobalZoom`.

The default scale of 1.06 is fine; numbers and named brands get boosted to 1.08. Cap at 1.15 — beyond looks try-hard.

## 3. B-roll over every claim — 70%+ runtime coverage

If the speaker says "I built three products this year", show the three products. Talking-head-only is dead.

Target: **visual content on screen for ≥70% of total runtime** (icons + takeovers combined).

For a 46s video that means ≥32s of visual coverage. After building the broll plan, add up `(end_sec - start_sec)` for all entries — if under 70%, add more icons until you hit it. Long stretches of just-a-face are forbidden.

## 4. Audio ducked properly

Background music required, NOT optional. Levels:
- **10–15%** while the speaker is talking
- **40–60%** during transitions / non-speech moments

Music fighting the voice kills retention faster than anything else.

A pool of 10 royalty-free tracks lives in `~/.claude/skills/video-edit/music/`. Pick one per video. Use ffmpeg's `sidechaincompress` filter or the Remotion `<Audio volume={...}>` curve to duck.

(See `knowledge/music_library.md` for the curated 10-track list and licensing notes.)

## 5. Loop OR strong CTA at the end — never both, never soft

Pick one:
- **Loop**: the last frame leads back into the first (silent loop on Reels/Shorts/TikTok algorithms love this — bumps watch-time per session).
- **Strong CTA**: one clear ask. Examples: "Subscribe for the full breakdown", "Comment which one you'd build first", "DM me [keyword] to get the script."

Forbidden: soft "let me know what you think", "thanks for watching", trailing-off energy. The last word should land like a punch.

## 6. Every visual must be MEANINGFUL — no decorative filler

If you can't say in one sentence "this visual makes the speaker's claim more concrete", DROP it. Abstract icons that "feel related" are noise.

**Hierarchy of meaning** (use the highest tier you can):

1. **Real brand asset** — when a named tool/product/site is mentioned, show its REAL logo or interface screenshot, not a generated icon. "Claude" → Anthropic logo. "Hacker News" → real HN screenshot. "Stripe Dashboard" → real dashboard screenshot. See `brand_assets.json` and `scripts/fetch_brands.py`.
2. **Specific generated illustration** — when no real asset exists, generate something that depicts the EXACT thing said. "deleted database" → red database with X. "process bug not model bug" → gears with warning, NOT a generic warning sign.
3. **Structured layout (list/timeline/comparison)** — when the speaker enumerates ("3 things", "Wednesday/Thursday/Friday", "old way vs new way"), show the structure. Reference: the Wednesday/Thursday/Friday timeline image with neo-lime nodes — generated as a single still or built programmatically with `kind: "list"`.
4. **Skip** — if it doesn't fit any of the above, leave the speaker on screen.

Do not place a visual just because there's a gap. Coverage targets (rule #3) only apply when each visual is truly load-bearing.

## 7. Center placement is the default for icon overlays

Icons go in the **center of the upper 60% of the frame**, not in a corner. Default `anchor: "center"`. Bigger (size 0.55–0.7), feels like a deliberate cut-in. Corner anchors are reserved for *additive* visuals where the speaker stays the focus.

## 8. Vertical 9:16, safe zones respected

- **Top 10%** of frame is platform UI (status bar / handles)
- **Bottom 20%** is platform UI (captions / engagement bar / username)
- Important text and the speaker's face stay in the **middle 70%**

For our overlays:
- Icon overlays at `top-right` anchor with default `size: 0.55` already sit at ~4–55% from top — within the safe zone
- Captions are burned into the source so we don't control them, but we should NOT place icons in the bottom 20% to avoid colliding with platform UI

If a beat needs an icon at the bottom of the screen, use `anchor: "bottom-left"` or `bottom-right` and verify the icon ends above 80% Y position (the comp's `bottom-*` anchors set Y=55%, so icon-bottom lands around 55% + 55% × size = ~85% — already too low for size 0.55). **Default to `top-*` anchors for icons.**

## 9. Subscribe bug after the midpoint

Every short gets the channel subscribe animation composited in **exactly once**.

Asset: `~/.claude/skills/video-edit/assets/subscribe-bug.mp4` — a 5s clip of Luuk's branded card with the cursor clicking **Subscribe → Subscribed** (lime avatar, "Luuk Alleman", "17K subscribers").

- **Placement**: appears once, somewhere between **~60–80% of total runtime** — after the middle, *before* the final CTA beat. Never overlaps rule #5's end CTA — it's a separate, earlier moment.
- **Size / anchor**: small **corner bug** (~25–30% of frame width), `top-right` or `bottom-right`. Keep it inside the **middle-70% safe zone** (rule #8) — never in the top 10% or bottom 20% platform-UI strips.
- **Motion**: slide in, hold ~4–5s for the full click animation to play through, slide out. Don't freeze on a still.
- **Audio**: mute the clip's own click-pop, OR keep it at **≤10%** under the voice — it must never spike over the speaker.
- **Additive only**: the speaker stays the focus. Don't pause b-roll, kill a zoom, or cut away for it — it sits *on top of* whatever beat is already running.

It's subtle and ambient on purpose — a soft reminder mid-video, not a hard interrupt.

## Self-check before reporting done

- [ ] First b-roll starts at `start_sec: 0.0`
- [ ] Coverage = sum(end - start) ≥ 0.7 × duration
- [ ] Final beat is either a loop frame OR a strong CTA visual
- [ ] Subscribe bug composited once, between 60–80% runtime, as a small corner overlay
- [ ] No icons placed in bottom 20% of frame
- [ ] Background music track selected and ducked
