# Framework library

Short working summaries of public frameworks. Each: **when to use → core idea → how to apply.** Credit the originator when you cite one. Extend this file freely — add your own frameworks under the right heading in the same shape.

---

## sales

### Value Equation (Alex Hormozi, *$100M Offers*)
- **Use:** pricing, weak offers, "people say it's too expensive".
- **Core:** Value = (Dream Outcome × Perceived Likelihood of Achievement) ÷ (Time Delay × Effort & Sacrifice).
- **Apply:** score the current offer 1-10 on each of the four; fix the lowest lever first. Raise the top with proof, guarantees, specificity; cut the bottom with done-for-you, speed, templates.

### Grand Slam Offer (Hormozi)
- **Use:** building an offer people feel stupid saying no to.
- **Core:** list every problem the buyer hits before/during/after → turn each into a solution → bundle the high-value/low-cost ones; add scarcity, urgency, bonuses, guarantee, and a name.
- **Apply:** produce the problem→solution list, the bundle, the guarantee, and the price anchored to value delivered (aim for 10× value-to-price).

### Value-Based Pricing
- **Use:** setting or raising price.
- **Core:** price from the economic value to the buyer, not your cost or competitors.
- **Apply:** quantify outcome value (revenue gained, cost saved, time saved × rate) → price at 10-20% of first-year value → test with 3 tiers (good/better/best); most buy the middle.

### SPIN Selling (Neil Rackham)
- **Use:** discovery calls, B2B sales.
- **Core:** ask Situation → Problem → Implication → Need-payoff questions; the buyer sells themselves.
- **Apply:** write 2 questions per stage for their specific buyer.

### CLOSER (Hormozi)
- **Use:** sales call script.
- **Core:** Clarify why they're here, Label the problem, Overview past pain, Sell the vacation (outcome), Explain away concerns, Reinforce the decision.

---

## marketing

### Jobs to Be Done (Clayton Christensen)
- **Use:** positioning, messaging, finding who really buys.
- **Core:** people "hire" products to make progress in a specific circumstance.
- **Apply:** write the job statement "When ___, I want to ___, so I can ___"; mine reviews/interviews for the struggling moment.

### Obviously Awesome positioning (April Dunford)
- **Use:** "nobody gets what we do", repositioning.
- **Core:** competitive alternatives → unique attributes → value they enable → who cares most → market category.
- **Apply:** fill the five in order; pick the category that makes your strengths obvious.

### Core Four lead gen (Hormozi, *$100M Leads*)
- **Use:** "how do I get customers".
- **Core:** warm outreach, cold outreach, free content, paid ads — then leverage via referrals, employees, agencies, affiliates.
- **Apply:** pick ONE channel matching current assets; set a daily volume ("100 outreaches/day"); measure for 30 days.

### Bullseye / Traction (Weinberg & Mares)
- **Use:** choosing channels.
- **Core:** brainstorm all 19 channels → test 3 promising cheaply in parallel → double down on the one that works.

### Launch sequence (Jeff Walker, *Launch*)
- **Use:** product or course launch.
- **Core:** pre-pre-launch (build anticipation) → pre-launch (3 value pieces: opportunity, transformation, ownership) → open cart (short window) → close (real deadline).

### AARRR Pirate Metrics (Dave McClure)
- **Use:** where the funnel leaks.
- **Core:** Acquisition, Activation, Retention, Referral, Revenue. Fix the leakiest stage first, usually activation or retention.

---

## content

### Hook → Retain → Reward
- **Use:** short/long video, posts.
- **Core:** first 1-3 seconds earn attention (pattern interrupt, curiosity, stakes), structure retains (open loops, progression), ending pays off the promise.
- **Apply:** write 5 hook variants; the title/thumbnail promise must match the payoff.

### Content Pillars + Repurposing
- **Use:** consistency, "what do I post".
- **Core:** 3-5 pillars tied to the offer; one long-form piece/week → 5-10 short derivatives.

### Storytelling: Story Brand (Donald Miller)
- **Use:** brand messaging, website copy.
- **Core:** customer is the hero with a problem → meets a guide (you) with empathy + authority → gets a plan → called to action → avoids failure, achieves success.

### Pixar story spine
- **Core:** Once upon a time… Every day… One day… Because of that… Because of that… Until finally… Ever since then…

### Newsletter growth
- **Core:** one clear promise + consistent schedule + lead magnet + cross-promotion/recommendations. Measure open rate and replies, not just subs.

---

## product

### Lean Startup / Build-Measure-Learn (Eric Ries)
- **Use:** MVP scope, "should I build X".
- **Core:** smallest experiment that tests the riskiest assumption; validated learning over output.
- **Apply:** name the riskiest assumption → design a test that could kill it this week → define pass/fail before running.

### The Mom Test (Rob Fitzpatrick)
- **Use:** customer interviews.
- **Core:** ask about their life and past behavior, not your idea. "When did that last happen? What did you do? What did it cost?" Compliments are noise; commitments (time, money, intro) are signal.

### RICE prioritization
- **Use:** roadmap choices.
- **Core:** (Reach × Impact × Confidence) ÷ Effort. Score, sort, sanity-check.

### Hooked model (Nir Eyal)
- **Use:** retention, habit.
- **Core:** Trigger → Action → Variable reward → Investment.

### Activation "aha moment"
- **Core:** find the action that correlates with retention; shorten time-to-aha; remove every step before it that isn't required.

---

## business-strategy

### Leverage (Naval Ravikant)
- **Use:** scaling yourself.
- **Core:** labor, capital, code, media. Code and media are permissionless and scale at zero marginal cost.
- **Apply:** for each recurring task, ask: can code (automation/AI) or media (content) do it once for many?

### 7 Powers (Hamilton Helmer)
- **Use:** moats.
- **Core:** scale economies, network effects, counter-positioning, switching costs, branding, cornered resource, process power.

### Blue Ocean / ERRC (Kim & Mauborgne)
- **Core:** Eliminate, Reduce, Raise, Create — redraw the competitive factors instead of competing on them.

### Niche down / Category of one
- **Core:** narrow audience × specific problem × unique mechanism → pricing power. "Who exactly, with what problem, solved how differently?"

### Theory of Constraints (Goldratt)
- **Use:** "everything is a priority", growth stalled.
- **Core:** the system's output is set by one bottleneck; find it, exploit it, subordinate everything else, elevate it, repeat.

---

## ai-automation

### Automate → Augment → Assist ladder
- **Use:** "what should I automate with AI".
- **Core:** list recurring tasks with frequency × time × error cost. Deterministic + frequent → script it. Judgment-heavy → AI drafts, human approves. Rare/high-stakes → AI assists only.

### Workflow before agent (Anthropic, "Building effective agents")
- **Core:** start with the simplest pattern that works: single prompt → prompt chaining → routing → parallelization → orchestrator-workers → evaluator-optimizer → autonomous agent. Add complexity only when measured to help.

### Context engineering
- **Core:** the model only knows what's in its context. Put durable rules in a project instruction file (CLAUDE.md etc.), procedures in skills, live data via tools/MCP. Keep always-loaded context small; load the rest on demand.

### Eval-first prompting
- **Core:** write 5-20 real test cases with expected outputs before tuning a prompt; change one thing at a time; keep the ones that score better.

### Human-in-the-loop gates
- **Core:** anything irreversible or outward-facing (send, pay, delete, publish) gets an approval step.

---

## persuasion

### Influence: 7 principles (Robert Cialdini)
- **Core:** reciprocity, commitment & consistency, social proof, authority, liking, scarcity, unity.
- **Apply:** audit the page/pitch for each; add the 2 that are missing and honest.

### Never Split the Difference (Chris Voss)
- **Use:** negotiation.
- **Core:** tactical empathy, mirroring (repeat last 1-3 words), labeling ("It seems like…"), calibrated questions ("How am I supposed to do that?"), get to "that's right", accusation audit up front.

### Fogg Behavior Model (BJ Fogg)
- **Core:** Behavior = Motivation × Ability × Prompt. If they don't act, make it easier before trying to motivate harder.

---

## copywriting

### PAS / AIDA / BAB
- **PAS:** Problem → Agitate → Solve.
- **AIDA:** Attention → Interest → Desire → Action.
- **BAB:** Before → After → Bridge.

### 4 U's headlines
- **Core:** Useful, Urgent, Unique, Ultra-specific. Write 10, score each 1-4 per U, keep the top 2 to test.

### Landing page skeleton
- **Core:** headline (outcome) → subhead (how/for whom) → proof → problem → solution/mechanism → offer stack → objections/FAQ → guarantee → CTA repeated.

### Awareness levels (Eugene Schwartz)
- **Core:** unaware → problem-aware → solution-aware → product-aware → most aware. Match the opening to their level; the less aware, the more you lead with the problem/story.

### Email: one idea, one CTA
- **Core:** subject earns the open, first line earns the read, one ask.

---

## mindset

### Reversible vs irreversible decisions (Jeff Bezos)
- **Core:** two-way doors → decide fast with ~70% info; one-way doors → slow down, get more data.

### Regret Minimization (Bezos)
- **Core:** project to age 80 — which choice minimizes regret?

### Inversion (Charlie Munger)
- **Core:** "How would I guarantee failure?" — then avoid those things.

### Second-order thinking
- **Core:** "And then what?" — trace consequences two or three steps out.

### Pre-mortem (Gary Klein)
- **Core:** assume it failed in 6 months; list why; mitigate the top 3 now.

### Expected value
- **Core:** Σ (probability × payoff); weigh against downside you can't survive (ruin risk).

### Atomic Habits (James Clear)
- **Core:** make it obvious, attractive, easy, satisfying; identity-based ("I'm the kind of person who…"); 2-minute rule to start.
