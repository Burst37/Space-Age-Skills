---
name: facebook-ads-agent
description: Build and operate an autonomous Facebook/Meta Ads agent — conversion tracking and CAPI, pain-point research, AI creative at volume, the Marketing API, a testing/winners campaign structure with explicit trim and promote rules, warehouse-backed reporting, and scheduled cloud execution. Use when the user asks to automate Meta ads, wire up the Facebook Marketing API, scale ad creative production, cut CPA/CPL, set up ad analytics and reporting, or deploy a marketing agent.
version: 2.0.0
source: "Graphed — Facebook Ads Agent Live Class (Notion): https://app.notion.com/p/graphed/Facebook-Ads-Agent-Live-Class-3a52cdf0baf480599f7bfaa022eca456"
category: marketing-automation
---

# Facebook Ads Agent

An agent that buys media on Meta: it publishes creative at volume into a testing
campaign, reads performance from a warehouse, kills losers, promotes winners, and
regenerates variants from what won — on a schedule, without a human trigger.

**This skill spends real money.** Every rule below that looks pedantic — the
preflight gate, thresholds in config, the write log, the kill switch — exists
because the failure mode is not a stack trace, it is a drained ad account.

## Provenance

| Part | Where it comes from |
|---|---|
| The loop, the 7 modules, the tool names, the API-key steps, the CPA figures | The Graphed live class (see [`reference-live-class-notes.md`](./reference-live-class-notes.md)) |
| API call shapes, threshold math, config schemas, runbook, failure modes | Standard Meta Marketing API practice, supplied here — **not** class material |

The class page is an agenda, not a transcript. Where it names a step without
explaining it, this skill supplies a defensible default and says so. Verify API
specifics against [Meta's current Marketing API docs](https://developers.facebook.com/docs/marketing-apis/)
— versions deprecate roughly every 3 months and field names move.

## What the source evidence actually shows

The class headlines **"CPA reduced from $100 to $50 in 4 weeks."** Its one
screenshot ([`source-performance-screenshot.png`](./source-performance-screenshot.png)),
Last 30 days, Jun 16 – Jul 15 2026:

| Metric | Value |
|---|---|
| Website Leads | 75 |
| Cost per lead (30-day average) | $94.43 |
| Amount spent | $7,082.55 |
| Cost per lead, final week (Jul 14) | $53.63 |

Read the curve before you promise anyone a number. Cost per lead opens near $62,
**spikes to roughly $183 on Jun 23**, dips to ~$68, rises to ~$107, and lands at
$53.63. The "$100 → $50" framing measures a mid-run peak against the final point;
the period average is $94.43.

The end state and the downward trend are real. The spike is the more useful
lesson: **volume prospecting costs more before it costs less**, because you are
paying for the losers that identify the winners. Budget for the spike, and treat
your trim rule as the thing that pays it back down. An agent without a hard trim
rule does not descend from that peak — it just lives there.

---

# Part 1 — The operating model

## Why volume beats targeting

Meta's **Andromeda** retrieval system changed what the operator controls. You no
longer win by hand-slicing audiences; the system finds the audience from the
creative itself. **Ads are the new targeting.** So the lever that still moves is
creative throughput plus fast, unsentimental selection.

## The loop

```
        ┌──────────────────────────────────────────┐
        │                                          │
   generate ──▶ publish to TESTING ──▶ let spend accumulate
        ▲                                          │
        │                                          ▼
   iterate on winners ◀── promote to WINNERS ◀── evaluate
                                    │
                                    └── trim losers (pause)
```

Five steps, from the class:

1. **Make and publish more ads** — throughput is the input the system needs.
2. **Prospect for winning formats** — let spend find signal; don't pre-judge.
3. **Trim losers** — pause fast, on a rule, without discretion.
4. **Promote winners** — move proven ads into the scaling campaign.
5. **Iterate on winners** — generate variants of what won; back to step 1.

An agent that cannot do all five is a reporting tool, not an ads agent. Steps 3
and 4 are where agents usually fail: they generate happily and never kill
anything, so spend fans out across mediocrity forever.

## Preflight gate

The agent gets no write credential until **all** of these pass. This is the single
highest-value rule in the skill.

- [ ] A test conversion fires end-to-end: browser → CAPI → warehouse row
- [ ] Pixel and CAPI events for the same conversion **deduplicate** (matched `event_id`)
- [ ] Warehouse spend for yesterday reconciles with Ads Manager within ~2%
- [ ] `trim` and `promote` thresholds exist in config with committed values
- [ ] A daily spend cap is set at the campaign level, not just trusted to the agent
- [ ] A kill switch exists that a human can hit without the agent's cooperation
- [ ] Read/write API tests pass against a **paused** campaign

Buying media against broken tracking optimizes toward a number that isn't real.
That is worse than not running: it spends and it teaches you the wrong thing.

---

# Part 2 — Build stages

## Stage 1 — Conversion infrastructure

*Class module 1. Do this first; everything downstream reads from it.*

**Sources to unify:** Facebook Ads, Google Analytics, PostHog, HubSpot, Stripe.
**Tooling named:** Google Tag Manager API (manage tags/triggers programmatically,
so the agent adds tracking without a human in the GTM UI).

**Define the event taxonomy once.** Same event names in the pixel, CAPI, the
warehouse, and the agent's config. Ambiguous names are the most common reason an
agent optimizes toward the wrong outcome.

**Conversions API is not optional.** Browser signal is lossy (blockers, ITP,
consent). Send server-side and deduplicate:

```jsonc
// POST https://graph.facebook.com/v23.0/<PIXEL_ID>/events?access_token=<TOKEN>
{
  "data": [{
    "event_name": "Lead",
    "event_time": 1755302400,          // unix seconds, within 7 days
    "event_id": "lead_8f21c0a4",       // MUST match the pixel's eventID
    "action_source": "website",
    "event_source_url": "https://example.com/thanks",
    "user_data": {
      "em": ["<sha256 of lowercased trimmed email>"],
      "ph": ["<sha256 of E.164 digits only>"],
      "client_ip_address": "203.0.113.4",
      "client_user_agent": "<verbatim UA>",
      "fbc": "fb.1.1755302000.AbCd",   // from _fbc cookie
      "fbp": "fb.1.1755301000.1234"    // from _fbp cookie
    },
    "custom_data": { "value": 120.00, "currency": "USD" }
  }]
}
```

Deduplication requires the **same `event_id` on both** the pixel `fbq('track',
'Lead', {...}, {eventID: 'lead_8f21c0a4'})` and the CAPI payload. Hash PII with
SHA-256; never send raw email or phone. `fbc`/`fbp` materially lift match quality
— pass them through.

**Real-time lead scoring** (class cites an Apify example): enrich each lead on
arrival, score it, and send the score as the conversion `value`. This is what
makes the agent optimize for lead *quality* instead of lead *count* — without it,
"cheaper CPL" and "worse business" are indistinguishable to the optimizer.

## Stage 2 — Research: pain points and desired outcomes

*Class module 2.*

Ad copy comes from the customer's language, not the brand's.

- **Scrape Reddit** for pain points and desired outcomes in the niche.
- **Exa AI** for semantic search and extraction across the wider web.
- **Use the source material as ad formats** — the phrasing people already use is
  the hook.

Output a structured bank the creative stage consumes:

```yaml
- theme_id: onboarding_time
  pain: "took three weeks to get our first report out"
  desired_outcome: "live dashboard on day one"
  verbatim: "we spent almost a month just wiring up the data"
  source: https://reddit.com/r/.../comment/...
  captured: 2026-07-02
```

Keep `verbatim` intact. Paraphrasing is where the customer's voice leaks out and
generic ad copy leaks in.

## Stage 3 — Creative at volume

*Class module 3. Tools named: Nano Banana (images), HeyGen (video/avatar), Seedance (video).*

Pair every generated asset with a hook drawn from a `theme_id`. **Name assets so
performance attributes back to a research theme**, not just an ad ID:

```
{theme_id}__{format}__{variant}__{yyyymmdd}
onboarding_time__static__v03__20260702
```

The agent parses this from `ad.name` at analysis time, which lets it answer "which
*pain point* is working" — the question that drives step 5 of the loop. Without it
you can only answer "which ad ID is working", and you cannot iterate deliberately.

> Related skills in this repo: `higgsfield-video-studio`, `banana-pro-director-30`,
> `seedance-2-5-prompting`, `cinematic-prompt-director`.

## Stage 4 — Marketing API

*Class module 4.*

### Getting the API key

The class's exact sequence. Skipping a step here is the usual reason a token works
in Graph API Explorer and then 403s in production:

1. Use a Facebook Business Portfolio / Business Manager.
2. Create a Meta Developer App from the sidebar.
3. Add privacy policy + terms to the app.
4. Publish / configure the app.
5. Create a **System User**.
6. Assign the System User access to: the dev app, the Facebook Page, the ad
   account, and the Instagram account if needed.
7. Generate a **never-expiring token** from the System User.
8. Use that token in the agent.
9. Validate the token and discover IDs via the Graph API.
10. Run read/write API tests **before** production.

Store the token in a secret manager. Never commit it, never put it in a prompt,
never log it. Scope it to `ads_management`, `ads_read`, `business_management` —
and no more.

Validate before trusting:

```bash
# Token identity + scopes
curl -s "https://graph.facebook.com/v23.0/debug_token?input_token=$TOKEN&access_token=$TOKEN"

# Ad accounts the System User can actually reach
curl -s "https://graph.facebook.com/v23.0/me/adaccounts?fields=name,account_status,currency&access_token=$TOKEN"
```

`account_status` must be `1` (active). A disabled account returns plausible reads
and fails every write.

### Publishing an ad

Four objects, parent to child. Create the campaign and ad set **paused**, verify,
then activate.

```bash
# 1. Campaign
curl -X POST "https://graph.facebook.com/v23.0/act_$AD_ACCOUNT_ID/campaigns" \
  -F "name=TESTING — prospecting" \
  -F "objective=OUTCOME_LEADS" \
  -F "status=PAUSED" \
  -F "special_ad_categories=[]" \
  -F "access_token=$TOKEN"

# 2. Ad set  — budget in MINOR units (cents). 5000 = $50.00
curl -X POST "https://graph.facebook.com/v23.0/act_$AD_ACCOUNT_ID/adsets" \
  -F "name=TESTING — broad" \
  -F "campaign_id=$CAMPAIGN_ID" \
  -F "daily_budget=5000" \
  -F "billing_event=IMPRESSIONS" \
  -F "optimization_goal=OFFSITE_CONVERSIONS" \
  -F "bid_strategy=LOWEST_COST_WITHOUT_CAP" \
  -F "promoted_object={'pixel_id':'$PIXEL_ID','custom_event_type':'LEAD'}" \
  -F "targeting={'geo_locations':{'countries':['US']},'age_min':25}" \
  -F "status=PAUSED" \
  -F "access_token=$TOKEN"

# 3. Creative
curl -X POST "https://graph.facebook.com/v23.0/act_$AD_ACCOUNT_ID/adcreatives" \
  -F "name=onboarding_time__static__v03__20260702" \
  -F "object_story_spec={'page_id':'$PAGE_ID','link_data':{'image_hash':'$IMAGE_HASH','link':'https://example.com','message':'<hook from research bank>','call_to_action':{'type':'LEARN_MORE'}}}" \
  -F "access_token=$TOKEN"

# 4. Ad
curl -X POST "https://graph.facebook.com/v23.0/act_$AD_ACCOUNT_ID/ads" \
  -F "name=onboarding_time__static__v03__20260702" \
  -F "adset_id=$ADSET_ID" \
  -F "creative={'creative_id':'$CREATIVE_ID'}" \
  -F "status=PAUSED" \
  -F "access_token=$TOKEN"
```

Notes that cost people money:

- **Budgets are in minor currency units.** `daily_budget=5000` is $50, not $5,000.
  Assert on this in code; a factor-of-100 error is a very expensive typo.
- **Keep targeting broad.** Under Andromeda, narrow targeting fights the system.
  The creative is the targeting.
- **Upload images first** via `POST /act_<id>/adimages` to get the `image_hash`.
- **`special_ad_categories` is mandatory.** Credit, employment, housing, social
  issues, elections have legal restrictions — declare honestly or the account is at risk.

### Reading performance

Pull insights and land them in the warehouse. Don't compute decisions off live API
responses — you want the history.

```bash
curl -s -G "https://graph.facebook.com/v23.0/act_$AD_ACCOUNT_ID/insights" \
  -d "level=ad" \
  -d "fields=ad_id,ad_name,spend,impressions,clicks,ctr,actions,cost_per_action_type" \
  -d "date_preset=last_7d" \
  -d "time_increment=1" \
  -d "access_token=$TOKEN"
```

`actions` is an array of `{action_type, value}` — find your conversion (e.g.
`offsite_conversion.fb_pixel_lead`) rather than assuming position. Insights are
**attributed and retroactive**: yesterday's numbers keep moving for days. Never
make a trim decision off a partial day.

### TOS separation

The class calls for **separating account management from analytics for TOS
compliance**. Concretely: a write-scoped credential for account actions with its
own audit trail, a read-only path for analytics, and every automated write logged
with actor, timestamp, object ID, before/after. If Meta asks what your automation
did, that log is the answer.

## Stage 5 — Campaign structure

*Class module 5.*

| Campaign | Role | Agent action |
|---|---|---|
| **TESTING** | Prospect new creative | Publish N new ads per cycle; evaluate; pause losers |
| **WINNERS** | Scale what proved out | Receive promoted ads; hold the larger budget |

Rules go in config as numbers, not in a prompt as prose. This is what makes the
agent auditable and its decisions reproducible:

```yaml
decision_rules:
  currency: USD
  attribution_window: 7d_click_1d_view
  min_evaluation_age_hours: 72      # don't judge before learning settles

  trim:                              # pause an ad when ALL are true
    min_spend: 75.00                 # ~1.5x target CPL: enough to be real
    max_cost_per_lead: 140.00        # ~1.5x target
    OR_zero_conversions_above_spend: 110.00   # spent 2x target, nothing

  promote:                           # duplicate into WINNERS when ALL are true
    min_spend: 150.00
    min_conversions: 3               # 1 lead is luck, not signal
    max_cost_per_lead: 70.00
    min_sustained_days: 3

  guardrails:
    max_daily_spend_testing: 200.00
    max_daily_spend_winners: 600.00
    max_pauses_per_run: 10           # a mass-pause means the data is wrong
    max_new_ads_per_run: 12
```

Set `min_spend` relative to your target CPL, not as a round number. Judging an ad
on $20 of spend when leads cost $90 is judging noise. `min_conversions: 3` exists
for the same reason — a single cheap lead is variance.

`max_pauses_per_run` is a circuit breaker: if the agent wants to pause everything,
the likeliest explanation is broken tracking, not universally bad creative. Halt
and alert instead of executing.

## Stage 6 — Analytics and reporting

*Class module 6.*

- **Unify** all sources into the warehouse — the single source of truth.
- **Give the agent read-only access**, scoped to the marketing schema.
- **Conversational analytics** — the agent answers "why did CPL move last week?"
  against the warehouse, not a dashboard screenshot.
- **Live dashboards** for the go-to-market motions.

Model at the grain of `(date, ad_id)` and join creative naming so you can group by
`theme_id`. That join is what makes step 5 of the loop possible.

## Stage 7 — Deployment

*Class module 7.*

An autonomous agent here = runs on a schedule against live data and takes account
actions within its rules, with no human trigger.

- **Cadence matches the decision.** Trim/promote is a daily job — attribution
  hasn't settled at hourly, and you would be reacting to noise.
- **Secrets in a secret store**, injected at runtime.
- **Every write logged**, append-only.
- **Kill switch** independent of the agent: pause the campaigns via a separate
  credential a human holds.

---

# Part 3 — The daily run

```python
def daily_cycle(cfg):
    # 1. TRUST THE DATA FIRST — never act on unverified numbers
    if not warehouse_fresh(hours=26):          halt("stale warehouse")
    if not spend_reconciles(tolerance=0.02):   halt("spend mismatch vs Ads Manager")

    ads = warehouse.ads_performance(
        window=cfg.attribution_window,
        min_age_hours=cfg.min_evaluation_age_hours,   # exclude ads still learning
    )

    # 2. TRIM
    losers = [a for a in ads if is_loser(a, cfg.trim)]
    if len(losers) > cfg.guardrails.max_pauses_per_run:
        halt(f"{len(losers)} ads flagged — suspect tracking, not creative")
    for ad in losers:
        api.pause(ad.id); log_write("pause", ad.id, reason=ad.metrics)

    # 3. PROMOTE
    for ad in [a for a in ads if is_winner(a, cfg.promote)]:
        new_id = api.duplicate(ad.id, into=cfg.winners_adset_id)
        log_write("promote", ad.id, new_id=new_id, reason=ad.metrics)

    # 4. ITERATE — variants of what won, from the same research theme
    for theme in winning_themes(ads, top_n=3):
        for asset in generate_variants(theme, n=cfg.variants_per_theme):
            publish(asset, into=cfg.testing_adset_id, status="PAUSED")

    # 5. ACTIVATE + REPORT
    activate_verified_drafts()
    report(pauses=losers, promotions=..., new_ads=..., spend=today_spend())
```

Order matters. Trim before promote before generate: you free budget before you
spend it, and you generate from a winner list that reflects today's trims.

---

## Failure modes

| Symptom | Real cause | Fix |
|---|---|---|
| CPL looks great, business is flat | Optimizing for lead count, not quality | Send lead score as conversion `value` (Stage 1) |
| Agent pauses nearly everything | Tracking broke; conversions stopped landing | `max_pauses_per_run` circuit breaker; verify the pipeline |
| Winners stop winning after promotion | Creative fatigue, or a bigger budget hitting a wider audience | Cap frequency; expect regression; keep generating |
| Spend spikes, no ads changed | Learning phase reset by an edit | Duplicate to change a winner; don't edit it |
| Numbers disagree with Ads Manager | Attribution window mismatch, or judging a partial day | Pin the window in config; exclude today |
| Token 403s in production, fine in Explorer | System User missing an asset assignment | Re-walk API-key step 6 |
| Two campaigns bidding on the same audience | Testing and Winners overlapping | Accept some overlap, or split by placement/geo |

## Operating checklist

- [ ] Event taxonomy defined once, identical across pixel / CAPI / warehouse / config
- [ ] CAPI live, `event_id` deduplication verified against real traffic
- [ ] Lead scoring feeding conversion `value`
- [ ] Research bank populated with verbatim phrasing and `theme_id`s
- [ ] Creative pipeline producing volume with parseable asset names
- [ ] System User token generated, scoped, read/write-tested, in a secret store
- [ ] TESTING and WINNERS campaigns live with campaign-level daily caps
- [ ] `trim` / `promote` thresholds committed as config with real numbers
- [ ] Circuit breakers set (`max_pauses_per_run`, `max_new_ads_per_run`)
- [ ] Warehouse read access scoped read-only to the marketing schema
- [ ] Scheduled daily run, append-only write log, human-held kill switch
- [ ] **Preflight gate passed** before the write credential was issued

## Challenges you're going to face

Named in the source, and each is a real week of work:

- Setting up the data pipeline and warehouse.
- Building an instance to host the agents.
- Making your data visible to your agents.
- Having the system evolve.

## Attribution

Derived from the **Graphed — Facebook Ads Agent Live Class** Notion page. Graphed
deploys marketing agents (Facebook ads, Google ads, SEO/AI search, social media
management) and go-to-market reporting dashboards: [graphed.com](http://graphed.com),
will@graphed.com.

Source files:

- [`reference-live-class-notes.md`](./reference-live-class-notes.md) — verbatim page outline
- [`source-performance-screenshot.png`](./source-performance-screenshot.png) — the Ads Manager
  panel behind the CPA claim
