# Money map, 30-day launch, breakdown reel
**Order of income options (unproven, not promised):** Picsart Earn (views/comments/shares of content made with Picsart AI tools; no follower gate per source) → Clients (pilot or monthly animated series about their product) → TikTok Creator rewards (qualified views, original videos > 1 min) → YouTube (Shorts pay cents/1,000 views; long season recuts pay more) → Brands (product placed in your world for 3 s). Finals are most of the cost, hence the passport → reviewed frame → approved draft gate.

## Premise research (before episode 1)
```
you are my showrunner. find me a premise for an animated short series that can make money in its first 30 days.
1. search animated or AI-character shorts posted in the last 30 days that got 10x the views of their account's usual posts. list 10 with links, views, and the format in one sentence (format, not topic).
2. propose 3 premises using a proven format with my own character. for each: logline, engine, 5 episode ideas, and what kind of business could pay for a version of it (bakery, gym, app, clinic...).
3. recommend one in two lines.
never copy a character, a look or a story. only the format.
```
Cadence: 3 episodes/week. One number decides everything: **completion rate** (share who watch to the end). Compare each episode to your own average, never someone else's best.

## Publisher review
```
you are my publisher. this week's numbers per episode: [views, completion rate, saves, shares, comments]
1. rank episodes by completion rate vs our 4-week average.
2. what did the top 2 share in the first 3 seconds? be specific.
3. write 3 hook variations of that shape for next week.
4. flag any episode too similar to the last 10 posted.
5. keep, change or kill the premise, based on how many episodes? say it out loud if fewer than 8.
log the review in log.md.
```

## Breakdown reel (one per episode, post the day after)
Finished shot plays, then comes apart into labelled layers (passport → frame → 480p draft → final), then snaps back. Three rules: **(1)** every hit lands on a beat, 120 BPM = 0.5 s/beat; **(2)** nothing moves linearly: small counter-move before a big move, overshoot after, 3-frame camera shake on impact, squash and stretch; **(3)** last frame = first frame (seamless loop).
```
you are my motion designer. read bible.md, cast/[character]/passport.md and episodes/ep[N]/shots.md.
build a 10 sec breakdown reel for episode [N] as one HTML page, 1920x1080, animated by ONE paused GSAP timeline (no css keyframes, no timers), so every frame is a pure function of time. 120 BPM grid (beat = 0.5 s):
 0.0-1.5  hook: max 6 words slam in on the beats, one highlighted
 1.5-3.0  reveal: the final shot of the episode, big and alive
 3.0-8.0  breakdown: shot explodes into labelled 3D layers (passport.md, frame_01.png, draft_480p, final), something new every beat or two
 8.0-10.0 payoff: layers snap back, a sticker with the real cost from log.md. last frame equals first frame.
draw the character from the passport in SVG with separate parts (head, eyes, arms, antenna) so he can blink, jump with squash and stretch, and react. palette and type from the bible only.
no linear easing: anticipation before a move, overshoot after, a 3-frame camera shake on every impact.
keep text 96 px from the sides and 80 px from top and bottom.
```
For a Reels/TikTok cut, ask for the same reel recomposed 9:16. Pair with `gsap-timeline` / `gsap-core` for the build.
