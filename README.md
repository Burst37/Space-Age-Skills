# Space Age AI Solutions — Master Skill Suite

**Owner:** Space Age AI Solutions | **Repo:** `Burst37/Space-Age-Skills` | **Branch:** `main`

---

## Platform Architecture

| Layer | Role | Cost |
|---|---|---|
| Claude (Sonnet 4.6) | Orchestration, planning, prompt engineering | Tokens |
| OpenRouter → DeepSeek V4 Pro | Code execution, logic, scripts | Per-call |
| Higgsfield AI | All image + video generation | Subscription ($0 marginal) |
| n8n | Batch automation, pipeline orchestration | Self-hosted |
| Vapi | Outbound voice agent calls | Per-minute |
| Hermes Agent (VPS) | 24/7 orchestrator, lane routing, self-improving | VPS + API |

---

## Image Model Hierarchy

| Rank | Model | Access | Best For |
|---|---|---|---|
| 1 | **GPT Image 2** (`gpt_image_2`) | Higgsfield subscription | Hero images, product shots, typography — highest realism |
| 2 | **Nano Banana Pro** (`nano_banana_2`) | Higgsfield subscription | Cinematic portraits, characters, fashion |
| 3 | **Flux Kontext** (`flux_kontext`) | Higgsfield subscription | Style transfer, image-to-image editing |
| 4 | **Nano Banana 2** (`nano_banana_flash`) | Higgsfield subscription | Character reference sheets, multi-angle |

> GPT Image 2 is the default hero image model for all pipeline lanes unless the shot is portrait/character — then Nano Banana Pro.

---

## Active Pipeline — Local Business Lead Gen

```
Google Maps Scraper (Playwright)
        ↓
Qualified Leads CSV → Google Sheets
        ↓
[STEP 1] lead-to-brief
         ← converts raw CSV row to Build Brief
        ↓
[STEP 2] cinematic-website-builder
         ← generates single-file HTML shell
[STEP 2b] local-business-seo
         ← injects schema.org, NAP, GBP, AI/LLM optimization, llms.txt
        ↓
[STEP 3] cinematic-prompt-director
         ← Build Brief → Higgsfield YAML prompt (150-200 word, ultra-detail)
[STEP 3b] SA-higgsfield-operator
         ← fires gpt_image_2 → hero image (4K 16:9) [PRIMARY]
         ← fires nano_banana_2 → character/portrait hero (if people-focused)
         ← fires seedance_2_0 → background video loop (1080p)
         ← fires brain_activity → virality score (quality gate)
         ← asset URLs injected into site HTML before deploy
        ↓
[STEP 4] Hermes Agent routes Build Brief to correct execution lane ↓

┌─────────────────────────────────────────────────────────────────────┐
│                     PARALLEL EXECUTION LANES                        │
├──────────────────┬──────────────────┬──────────────┬───────────────┤
│   LANE A         │   LANE B         │   LANE C     │   LANE D      │
│   Google Stack   │   DeepSeek Stack │  Claude Stack│  Minimax Stack│
├──────────────────┼──────────────────┼──────────────┼───────────────┤
│ GPT Image 2      │ GPT Image 2      │ GPT Image 2  │ GPT Image 2   │
│ (hero default)   │ (hero default)   │ (hero)       │ (hero)        │
│        ↓         │        ↓         │      ↓       │       ↓       │
│ Google Stitch    │ Seedance 2.0     │ Kling 3.0    │ Hailuo 2      │
│ (UI prototype)   │ (BG video loop)  │ (premium MV) │ (silent loop) │
│        ↓         │        ↓         │      ↓       │       ↓       │
│ Gemini Flash 3.1 │ DeepSeek V4 Pro  │ Claude       │ Minimax 2.7   │
│ or Gemini Pro    │ via OpenRouter   │ Sonnet 4.6   │ via OpenRouter│
│ (copy/structure) │ (full site code) │ (copy/logic) │ (UI components│
│        ↓         │        ↓         │      ↓       │       ↓       │
│ Antigravity IDE  │ Direct file out  │ OpenAI Codex │ Direct file   │
│ (2M ctx, free)   │ (no IDE needed)  │ + Claude Code│ out           │
│        ↓         │        ↓         │      ↓       │       ↓       │
│ Google Voice     │ Vapi Agent       │ Vapi or      │ Vapi Agent    │
│ Agent (Gemini    │ (outbound +      │ ElevenLabs   │               │
│ TTS)             │ inbound)         │ Voice Agent  │               │
│        ↓         │        ↓         │      ↓       │       ↓       │
│ SEO + AI Layer   │ SEO + AI Layer   │ SEO + AI     │ SEO + AI      │
│        ↓         │        ↓         │ Layer ↓      │ Layer ↓       │
│ Vercel Deploy    │ Vercel Deploy    │ Vercel Deploy│ Vercel Deploy │
├──────────────────┼──────────────────┼──────────────┼───────────────┤
│ HIGH VOLUME      │ PRIMARY LANE     │ PREMIUM      │ OVERFLOW /    │
│ Budget sites     │ Standard closes  │ $750+ closes │ BUDGET        │
│ ~$0/site cost    │ $300-500 closes  │ Multi-file   │ Cost savings  │
│ 80 sites/day cap │ Main volume lane │ projects     │ Lane D        │
└──────────────────┴──────────────────┴──────────────┴───────────────┘

        ↓ (all lanes converge here)
[STEP 5] SEO + AI Optimization Injection (universal — all lanes)
         ← schema.org JSON-LD (LocalBusiness, Service, FAQ, Review)
         ← NAP consistency enforcement
         ← AI/LLM optimization (entity copy, declarative statements)
         ← llms.txt generated and placed at site root
         ← Core Web Vitals compliance check
         ← robots.txt + sitemap.xml auto-generated
         ← GA4 + Search Console tags injected
        ↓
[STEP 6] outreach-copywriter
         ← cold email with GPT Image 2 hero asset URL embedded
         ← Vapi phone script
        ↓
[STEP 7] vapi-orchestrator
         ← deploys voice agent + queues outbound call
        ↓
[STEP 8] GitHub → Vercel deploy
         ← live site at custom URL
        ↓
Close: $300-750/site + SEO retainer upsell
```

---

## Hermes Lane Routing Rules

Hermes reads the Build Brief and scores on two axes: **complexity** and **budget tier**.
Routes to the appropriate lane automatically.

```
IF business_quality_score >= 5 AND market_size = large
    → Lane C (Claude + Codex — premium)
ELIF volume_mode = true AND cost_priority = max
    → Lane A (Google/Antigravity — high volume)
ELIF lanes_saturated = true OR budget_tier = low
    → Lane D (Minimax — overflow)
ELSE
    → Lane B (DeepSeek — primary/default)
```

---

## SEO + AI Optimization Layer (All Lanes)

### Target 1 — Google Search (Traditional)
```
✅ schema.org JSON-LD: LocalBusiness, Service, FAQPage, Review
✅ NAP consistency (Name, Address, Phone — identical everywhere)
✅ Google Business Profile embed
✅ Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
✅ robots.txt + sitemap.xml
✅ Canonical tags
✅ Open Graph + Twitter Card meta
✅ City + service keyword in H1, title, meta description
✅ Local keyword density (3-5x per section)
✅ Google Maps embed
✅ Review schema
✅ Mobile-first responsive
```

### Target 2 — AI/LLM Search (ChatGPT, Perplexity, Claude, Gemini)
```
✅ /llms.txt at site root (structured entity file for AI crawlers)
✅ FAQ section written as direct Q&A (LLMs pull verbatim)
✅ Entity-first copy ("Green Valley Plumbing is a licensed plumber in Mesquite TX...")
✅ Declarative service definitions (no passive voice)
✅ Structured authoritative statements ("We specialize in...", "Our service area covers...")
✅ Business data in JSON-LD mirroring ChatGPT/Perplexity surface format
✅ 300-500 word minimum above-fold copy (not just hero + CTA)
✅ Service specificity ("emergency water heater replacement, same-day, Mesquite TX")
```

### llms.txt Template (Auto-generated Per Site)
```
# [Business Name]
> [One sentence: what they do, where, why they're the authority]

## Services
- [Service 1]: [One sentence description with location]
- [Service 2]: [One sentence description with location]

## Location
[City, State] — serving [radius or surrounding cities]

## Contact
Phone: [number]
Address: [full address]
Hours: [hours]

## Why Choose Us
[3 declarative trust statements — years in business, license, guarantee]
```

---

## Model Quick Reference

### Image (via Higgsfield — $0 marginal)
| Need | Model | job_set_type |
|---|---|---|
| **Hero image — default** | **GPT Image 2** | `gpt_image_2` |
| Portrait / character / fashion | Nano Banana Pro | `nano_banana_2` |
| Style transfer / edit | Flux Kontext | `flux_kontext` |
| Character reference sheet | Nano Banana 2 | `nano_banana_flash` |
| Face-faithful (Soul ID) | Soul V2 | `text2image_soul_v2` |
| DTC branded ad | DTC Ads Engine | `dtc_ads` |

### Video (via Higgsfield — $0 marginal)
| Need | Model | job_set_type |
|---|---|---|
| Music video / editorial | Seedance 2.0 | `seedance_2_0` |
| Narrative / cinematic | Kling v3.0 | `kling3_0` |
| Lipsync / dialogue ONLY | Veo 3.1 | `veo3_1` |
| Silent B-roll / budget | Minimax Hailuo | `minimax_hailuo` |
| UGC ad video | Marketing Studio Video | `marketing_studio_video` |
| Virality analysis | Virality Predictor | `brain_activity` |

### Code Execution by Lane
| Lane | Model | Via | IDE/Env |
|---|---|---|---|
| A | Gemini Flash 3.1 / Pro | Google AI | Antigravity IDE (2M ctx, free) |
| B | DeepSeek V4 Pro | OpenRouter | Direct file output |
| C | Claude Sonnet 4.6 + OpenAI Codex | Anthropic / OpenAI | Claude Code |
| D | Minimax 2.7 | OpenRouter | Direct file output |

---

## Skill Registry

### Pipeline Skills — Ordered by Execution

| # | Skill | File | Role |
|---|---|---|---|
| 1 | `lead-to-brief` | `user/lead-to-brief/` | CSV row → Build Brief |
| 2 | `cinematic-website-builder` | `user/cinematic-website-builder/` | Build Brief → single-file HTML |
| 2b | `local-business-seo` | `user/local-business-seo/` | Schema.org, NAP, GBP, AI/LLM optimization, llms.txt |
| 3 | `cinematic-prompt-director` | `user/cinematic-prompt-director/` | Build Brief → Higgsfield YAML prompt |
| 3b | `SA-higgsfield-operator` | `user/SA-higgsfield-operator/` | YAML → GPT Image 2 hero + video loop + virality score |
| 4 | `outreach-copywriter` | `user/outreach-copywriter/` | Email HTML (with asset URL) + Vapi script |
| 5 | `vapi-orchestrator` | `user/vapi-orchestrator/` | Deploy voice agent + queue call |
| 6 | `n8n-pipeline-architect` | `user/n8n-pipeline-architect/` | Full automation topology |

### Production Skills

| Skill | File | Trigger |
|---|---|---|
| `SA-higgsfield-operator` | `user/SA-higgsfield-operator/` | All image/video — 18 image + 17 video models |
| `cinematic-prompt-director` | `user/cinematic-prompt-director/` | Any prompt engineering request |
| `ai-content-creator` | `user/ai-content-creator/` | Record Exec artist prompts |
| `shopify-cinematic-builder` | `user/shopify-cinematic-builder/` | Shopify OS 2.0 store builds |
| `ui-ux-designer` | `user/ui-ux-designer/` | Design direction before any build |
| `brand-extractor` | `user/brand-extractor/` | Client URL → Brand Token Package |
| `social-media-designer` | `user/social-media-designer/` | Instagram, TikTok, LinkedIn assets |
| `page-upgrade` | `user/page-upgrade/` | Existing site audit + redesign |

### Business System Skills

| Skill | File | Trigger |
|---|---|---|
| `record-exec-in-a-box` | `user/record-exec-in-a-box/` | Artist onboarding, EPK, campaigns |
| `credit-repair` | `user/credit-repair/` | Dispute letters, affidavits, FCRA |
| `loyaltybot` | `user/loyaltybot/` | Playwright auto-enrollment bot |
| `music-visualizer` | `user/music-visualizer/` | Audio-reactive video loops |

### Intelligence Skills

| Skill | File | Trigger |
|---|---|---|
| `sa-watch` | `user/sa-watch/` | Any video URL — auto-trigger |
| `sa-video-skill-extractor` | `user/sa-video-skill-extractor/` | Video → SKILL.md extraction |

---

## Deployment

```bash
# Clone skills into Claude Code session
git clone https://github.com/Burst37/Space-Age-Skills.git /mnt/skills/user

# Push updated skill
git add user/[skill-name]/
git commit -m "feat: [description]"
git push
```

---

## API Keys (Claude Code env)

```bash
DEEPSEEK_API_KEY=sk-d8a3140240b7434e95d2ef9d08fea00c
OPENROUTER_API_KEY=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
GOOGLE_DRIVE_SKILLS_FOLDER=1XWYm8AhG83vMn1p3RpM1UAkmiKcsnoC9
```
