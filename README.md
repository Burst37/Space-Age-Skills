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

---

## Active Pipeline — Local Business Lead Gen

```
Google Maps Scraper (Playwright)
        ↓
Qualified Leads CSV → Google Sheets
        ↓
lead-to-brief          ← converts raw CSV row to Build Brief
        ↓
cinematic-website-builder + local-business-seo  ← generates single-file HTML
        ↓
outreach-copywriter    ← cold email + Vapi phone script
        ↓
vapi-orchestrator      ← deploys voice agent + queues outbound call
        ↓
GitHub → Vercel deploy ← live site at custom URL
        ↓
Close: $300–750/site
```

---

## Skill Registry

### Pipeline Skills (Lead Gen)

| Skill | File | Role in Pipeline |
|---|---|---|
| `lead-to-brief` | `user/lead-to-brief/` | CSV row → Build Brief |
| `cinematic-website-builder` | `user/cinematic-website-builder/` | Build Brief → single-file HTML |
| `local-business-seo` | `user/local-business-seo/` | Schema.org, NAP, GBP injection |
| `outreach-copywriter` | `user/outreach-copywriter/` | Email HTML + Vapi script |
| `vapi-orchestrator` | `user/vapi-orchestrator/` | Deploy agent + queue call |
| `n8n-pipeline-architect` | `user/n8n-pipeline-architect/` | Full automation topology |

### Production Skills

| Skill | File | Trigger |
|---|---|---|
| `SA-higgsfield-operator` | `user/SA-higgsfield-operator/` | All image/video generation — 18 image + 17 video models |
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

## Model Routing (Quick Reference)

### Image
| Need | Model |
|---|---|
| Portrait / character / fashion | `nano_banana_2` (Nano Banana Pro) |
| Typography / text-in-image / diagrams | `gpt_image_2` (GPT Image 2, --quality high) |
| Style transfer / image editing | `flux_kontext` (Flux Kontext) |
| Face-faithful (Soul ID) | `text2image_soul_v2` |
| DTC branded ad | `dtc_ads` (style_id required) |

### Video
| Need | Model |
|---|---|
| Music video / rhythm / editorial | `seedance_2_0` (Seedance 2.0) — Primary |
| Narrative / multi-shot | `kling3_0` (Kling v3.0) — Primary |
| Lipsync / dialogue ONLY | `veo3_1` (Veo 3.1) |
| Silent B-roll / cost saving | `minimax_hailuo` |
| UGC marketing ad | `marketing_studio_video` |

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
