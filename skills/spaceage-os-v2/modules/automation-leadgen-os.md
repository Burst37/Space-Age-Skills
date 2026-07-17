# Space Age Automation Leadgen OS

## Role

Turn local-business prospects into enriched leads, personalized landing pages, cold outreach, voice-agent calls, and booked appointments.

## Pipeline

```yaml
pipeline:
  1_google_maps_scrape:
    output: raw lead rows
  2_lead_scoring:
    criteria:
      - no website
      - weak website
      - low review response quality
      - outdated branding
      - poor mobile UX
  3_firecrawl_enrichment:
    output: brand + business intelligence
  4_build_brief:
    output: YAML landing page and offer brief
  5_site_or_mockup:
    output: preview landing page
  6_outreach:
    output: cold email + SMS + Vapi script
  7_voice_agent:
    output: appointment setter
  8_crm_followup:
    output: GoHighLevel pipeline
  9_close:
    pricing: anchor 750, floor 300 unless project tier says otherwise
```

## Lead Score Schema

```yaml
lead_score:
  website_quality: 0-25
  offer_fit: 0-20
  local_intent: 0-15
  automation_fit: 0-20
  decision_maker_access: 0-10
  urgency: 0-10
  total: 0-100
```

## Vapi Agent Seed

```yaml
voice_agent:
  persona: calm, direct, helpful business development assistant
  objective: book discovery call
  qualification:
    - current website status
    - lead volume problem
    - interest in AI receptionist or landing page
    - decision timeline
  close: offer specific appointment slots
```

## Automation Blueprint Output

```yaml
automation_blueprint:
  trigger:
  data_sources:
  enrichment_steps:
  crm_fields:
  ai_agent_script:
  followup_sequence:
  failure_handling:
  analytics:
```
