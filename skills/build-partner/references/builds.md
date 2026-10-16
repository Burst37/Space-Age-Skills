# Build recipes

Proven Guided Build plans. Use one when the goal matches; adapt each step to the user's stack and skip steps their setup already covers. Every step has an observable **verify**. If no recipe fits, plan from scratch per `guided-build.md`.

---

## 1. Self-improving AI workspace
**Outcome:** the assistant knows the project, follows its rules, and gets better every week.
1. **Write project instructions** — create/trim `CLAUDE.md` (or `AGENTS.md`): what the project is, commands, conventions, never-dos. Keep under ~150 lines. *Verify:* file exists, has commands + conventions sections.
2. **Move procedures into skills** — any multi-step how-to living in the instruction file becomes `skills/<name>/SKILL.md`. *Verify:* instruction file no longer contains step-by-step procedures; skill files exist with frontmatter.
3. **Create a knowledge folder** — `knowledge/experiences/` + the Build Partner profile. *Verify:* folders exist; profile filled for Who/Offer/Goals.
4. **Add a lessons loop** — rule in instructions: "When a correction recurs, propose adding it as a rule." *Verify:* rule present.
5. **Schedule the review** — weekly reminder (calendar, cron, or session-start hook) to run Improve System → Session Review. *Verify:* reminder exists and shows the next run date.

## 2. Offer rebuild
**Outcome:** a written offer scoring ≥ 7/10 on every Value Equation lever.
1. **Capture current offer + numbers** into the profile. *Verify:* Offer and Numbers sections filled.
2. **Score the Value Equation** 1-10 per lever with evidence. *Verify:* table with 4 scores and reasons.
3. **Problem → solution list** (≥ 15 buyer problems). *Verify:* list exists in `knowledge/offer.md`.
4. **Bundle, guarantee, name, price** (Grand Slam Offer). *Verify:* one-page offer doc with all five.
5. **Test it** — send to 5 real prospects or past customers; log responses. *Verify:* 5 logged responses.

## 3. Lead engine (one channel, 30 days)
**Outcome:** a daily, measured lead-gen routine on one channel.
1. **Pick the channel** with Core Four based on current assets. *Verify:* channel + daily volume written.
2. **Build the list/source** (contacts, topics, or audience). *Verify:* ≥ 100 targets or 30 topics.
3. **Write the scripts/templates** (3 variants). *Verify:* 3 variants saved.
4. **Tracking sheet** — date, volume, replies, calls, sales. *Verify:* sheet exists with headers and day 1 row.
5. **Automate the grind** — draft generation or scheduling with AI; human approves sends. *Verify:* dry run produces drafts, nothing sent without approval.

## 4. Content repurposing pipeline
**Outcome:** one long piece/week becomes 5-10 short pieces with minimal effort.
1. **Define pillars** (3-5) tied to the offer. *Verify:* pillars listed in profile.
2. **Source folder + naming** (`content/YYYY-MM-DD-slug/`). *Verify:* folder with template.
3. **Transcribe/extract** step (tool or prompt) producing key points + quotes. *Verify:* runs on one real piece.
4. **Derivative prompts** — hooks, posts, thread, email, short-video script, each with 5 hook variants. *Verify:* one real piece → ≥ 5 derivatives saved.
5. **Calendar** — schedule for the week. *Verify:* items scheduled or in a dated queue.

## 5. AI automation for one recurring task
**Outcome:** one recurring task runs with AI and a human gate, measured against the manual baseline.
1. **Pick the task** (frequency × minutes × error cost; highest score). *Verify:* scored list, one chosen.
2. **Write 5-10 real test cases** with expected outputs. *Verify:* `evals/` file exists.
3. **Simplest version** — single prompt or script. *Verify:* passes ≥ 70% of cases.
4. **Improve one change at a time** until ≥ 90% or stuck. *Verify:* score log shows progress.
5. **Wire it in** with an approval step for anything outward-facing. *Verify:* end-to-end run on real input, approval required before send.

## 6. Launch in 14 days
**Outcome:** a dated launch plan with assets ready.
1. **Pre-mortem** — top 3 risks + mitigations. *Verify:* written.
2. **Waitlist / interest capture** live. *Verify:* URL works, test signup recorded.
3. **Three pre-launch pieces** (opportunity, transformation, ownership). *Verify:* drafted and scheduled.
4. **Sales page** via landing page skeleton. *Verify:* page live with every section.
5. **Open/close dates + email sequence** (open, mid, last 24h, closed). *Verify:* emails scheduled with real deadline.
