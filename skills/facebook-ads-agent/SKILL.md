---
name: facebook-ads-agent
description: Build and operate an autonomous Facebook/Meta Ads agent — analytics infrastructure, Reddit/Exa pain-point research, AI ad creative generation, the Marketing API, a testing/winners campaign structure, warehouse-backed reporting, and cloud deployment. Use when the user asks to automate Meta ads, wire up the Facebook Marketing API, scale ad creative production, cut CPA, set up ad analytics/reporting, or deploy a marketing agent.
version: 1.0.0
source: "Graphed — Facebook Ads Agent Live Class (Notion): https://app.notion.com/p/graphed/Facebook-Ads-Agent-Live-Class-3a52cdf0baf480599f7bfaa022eca456"
category: marketing-automation
---

# Facebook Ads Agent

A seven-module blueprint for an autonomous Meta Ads agent. The reported result from
the source class: **CPA reduced from $100 to $50 in four weeks.**

> Source fidelity: this skill is derived from the Graphed live-class outline
> (`reference-live-class-notes.md`, the verbatim page content). The module
> structure, core loop, and the Facebook API key procedure are from the source.
> Implementation detail beyond the outline is standard practice, not class material
> — treat it as a starting point, not a transcript.

## Why this system works

Meta's **Andromeda** ranking system changed the strategy: you no longer win by
hand-tuning audiences. **Ads are the new targeting** — the creative itself is the
targeting signal, and the algorithm finds the audience. So the winning move is
creative volume plus fast, ruthless selection.

## The core loop

Everything below serves this loop. Run it continuously:

1. **Make and publish more ads** — volume is the input the algorithm needs.
2. **Prospect for winning formats** — let spend find signal, don't pre-judge.
3. **Trim losers** — kill underperformers fast.
4. **Promote winners** — move proven ads into the scaling campaign.
5. **Iterate on winners** — generate new variants from what won, return to step 1.

An agent that cannot do all five steps is a reporting tool, not an ads agent.

---

## Module 1 — Building analytics infrastructure

Do this first. Every later module reads from what you build here.

- **Google Tag Manager API** — manage tags/triggers programmatically so the agent
  can add tracking without a human in GTM's UI.
- **Data sources to unify:** Facebook Ads, Google Analytics, PostHog, HubSpot, Stripe.
- **Conversion events** — define the event taxonomy once, use the same names everywhere.
  Ambiguous event names are the #1 cause of an agent optimizing toward the wrong thing.
- **Conversions API (CAPI)** — server-side event delivery. Not optional: browser-side
  pixel signal is lossy, and Meta's optimization degrades without CAPI backfill.
  Send a stable `event_id` on both pixel and CAPI events so Meta deduplicates them.
- **Real-time lead scoring** — score leads as they arrive (the source cites an Apify
  example: enrich the lead, score it, feed the score back as a conversion value)
  so you optimize for lead *quality*, not raw lead count.

**Gate:** do not start Module 4 until a conversion event fires end-to-end and lands
in the warehouse. An agent buying media against broken tracking burns real money.

## Module 2 — Researching pain points and desired outcomes

Ad copy comes from the customer's own words, not from the brand's.

- **Scrape Reddit** for pain points and desired outcomes in the target niche.
- **Exa AI** for semantic search and extraction across the wider web.
- **Use the raw source material as ad formats** — the phrasing customers already use
  becomes the hook. Keep a bank of verbatim quotes mapped to pain → outcome pairs.

Output of this module: a structured research file (pain, desired outcome, verbatim
phrasing, source URL) that Module 3 consumes as prompt input.

## Module 3 — Making ads

Generate creative volume from the Module 2 research.

- **Nano Banana** — image ad generation.
- **HeyGen** — AI video / avatar ads.
- **Seedance** — video generation.

Pair each generated asset with a hook line drawn from research. Name assets with a
scheme the agent can parse later (e.g. `{pain}_{format}_{variant}`) so performance
data can be attributed back to a research theme, not just an ad ID.

> Space Age note: `higgsfield-video-studio`, `banana-pro-director-30`, and
> `seedance-2-5-prompting` in this repo cover the generation side in depth.

## Module 4 — Facebook Ads Marketing API

- Manage the ad account through the Marketing API.
- **Upload** ads via API; **manage** (pause, budget, status) via API.
- Pull **analytics through the data warehouse**, not by hammering the Insights API.
- **Separate the ad-management path from the analytics path for TOS compliance** —
  keep automated account actions on their own credential and audit trail.

### How to get a Facebook Ads API key

The exact sequence from the source. Skipping a step here is the usual reason a token
"works" in Graph API Explorer and then 403s in production.

1. Use a Facebook Business Portfolio / Business Manager.
2. Create a Meta Developer App from the sidebar.
3. Add privacy policy + terms to the app.
4. Publish / configure the app.
5. Create a **System User**.
6. Assign the System User access to:
   - the dev app
   - the Facebook Page
   - the ad account
   - the Instagram account, if needed
7. Generate a **never-expiring token** from the System User.
8. Use that token in the agent.
9. Validate the token and discover IDs via the Graph API.
10. Run read/write API tests **before** using it in production.

Store the token as a secret (env var / secret manager). Never commit it, never put
it in a prompt, never log it.

## Module 5 — Ad campaign structure

Two campaigns, one flow between them:

| Campaign | Purpose | Agent action |
|---|---|---|
| **Testing** | Prospect new creative for winners | Publish new ads here at a fixed cadence |
| **Winners** | Scale what proved out | Receive promoted ads, hold budget |

- **Trimming losers** — define the kill rule *before* launch: a spend threshold and a
  CPA/CTR bar. Below bar past threshold → pause. No discretionary saves.
- **Promoting winners** — define the promotion rule the same way: sustained
  performance above bar over a minimum spend → duplicate into the winners campaign.

Write both rules as explicit thresholds in config, not as prose in a prompt. This is
what makes the agent auditable and its decisions reproducible.

## Module 6 — Analytics and reporting

- **Unify data** with a pipeline into a warehouse (the single source of truth).
- **Give your agent warehouse access** — read-only, scoped to the marketing schema.
- **Conversational analytics** — the agent answers "why did CPA move last week?"
  against the warehouse rather than a dashboard screenshot.
- **Live reporting dashboards** for the go-to-market motions.

## Module 7 — Deploying autonomous agents

- **What an autonomous agent is here:** one that runs on a schedule against live
  data and takes account actions within its rules, without a human trigger.
- **Give it a live data stream** — the warehouse plus fresh Insights, on a cadence
  that matches the decision (daily for trim/promote, not hourly).
- **Deploy to the cloud** — a persistent host with the token in a secret store,
  scheduled runs, and a log of every write action it takes against the ad account.

---

## Challenges you're going to face

Named in the source as the real friction points:

- Setting up the data pipeline and warehouse.
- Building an instance to host the agents.
- Making your data visible to your agents.
- Having the system evolve over time.

## Operating checklist

- [ ] Conversion events defined and firing end-to-end into the warehouse
- [ ] CAPI live with pixel/CAPI event deduplication verified
- [ ] Research bank populated (pain → outcome → verbatim phrasing)
- [ ] Creative pipeline producing volume with parseable asset naming
- [ ] System User token generated, validated, read/write-tested, stored as a secret
- [ ] Testing and Winners campaigns live
- [ ] Trim and promote thresholds written as config, not prose
- [ ] Warehouse read access scoped for the agent
- [ ] Cloud deployment with scheduled runs and a write-action audit log

## Attribution

Derived from the **Graphed — Facebook Ads Agent Live Class** Notion page.
Graphed deploys marketing agents (Facebook ads, Google ads, SEO/AI search, social
media management) and go-to-market reporting dashboards: [graphed.com](http://graphed.com),
will@graphed.com.

Full verbatim source outline: [`reference-live-class-notes.md`](./reference-live-class-notes.md)
