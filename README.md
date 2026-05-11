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
[STEP 1] lead-to-brief
         ← converts raw CSV row to Build Brief
        ↓
[STEP 2] cinematic-website-builder
         ← generates single-file HTML shell
[STEP 2b] local-business-seo
         ← injects schema.org, NAP, GBP
        ↓
[STEP 3] cinematic-prompt-director
         ← Build Brief → Higgsfield YAML prompt (150-200 word, ultra-detail)
[STEP 3b] SA-higgsfield-operator
         ← fires nano_banana_2 → hero image (4K 16:9)
         ← fires seedance_2_0 → background video loop (1080p)
         ← fires brain_activity → virality score (quality gate)
         ← asset URLs injected into site HTML before deploy
        ↓
[STEP 4] outreach-copywriter
         ← cold email with Higgsfield hero image URL embedded
         ← Vapi phone script
        ↓
[STEP 5] vapi-orchestrator
         ← deploys voice agent + queues outbound call
        ↓
[STEP 6] GitHub → Vercel deploy
         ← live site at custom URL
        ↓
Close: $300-750/site
```

### Why Higgsfield Sits at Step 3

The site HTML is built first (Step 2) with placeholder `<img>` and `<video>` tags.
Higgsfield fires after the build and injects the real asset URLs before the repo is pushed to Vercel.
The hero image URL also feeds directly into the outreach email — one generation, two uses, $0 marginal cost.

### Higgsfield Assets Per Site

| Asset | Model | Spec | Destination |
|---|---|---|---|
| Hero image | `nano_banana_2` | 4K 16:9 | Site hero section + email header |
| BG video loop | `seedance_2_0` | 1080p 5s loop | Site `<video autoplay muted loop>` |
| Virality check | `brain_activity` | Score + report | Quality gate — re-generate if below threshold |

> **Prompt source:** cinematic-prompt-director auto-generates the YAML prompt from the Build Brief (business name, category, location, tone). Zero manual prompt writing per site.

---

## Skill Registry

### Pipeline Skills — Ordered by Execution

| # | Skill | File | Role |
|---|---|---|---|
| 1 | `lead-to-brief` | `user/lead-to-brief/` | CSV row → Build Brief |
| 2 | `cinematic-website-builder` | `user/cinematic-website-builder/` | Build Brief → single-file HTML |
| 2b | `local-business-seo` | `user/local-business-seo/` | Schema.org, NAP, GBP injection |
| 3 | `cinematic-prompt-director` | `user/cinematic-prompt-director/` | Build Brief → Higgsfield YAML prompt |
| 3b | `SA-higgsfield-operator` | `user/SA-higgsfield-operator/` | YAML prompt → hero image + video loop + virality score |
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

## Model Routing (Quick Reference)

### Image
| Need | Model |
|---|---|
| Portrait / character / fashion | `nano_banana_2` (Nano Banana Pro) |
| Typography / text / diagrams | `gpt_image_2` (--quality high --resolution 4k) |
| Style transfer / image editing | `flux_kontext` |
| Face-faithful (Soul ID) | `text2image_soul_v2` |
| DTC branded ad | `dtc_ads` (style_id required) |

### Video
| Need | Model |
|---|---|
| Music video / rhythm / editorial | `seedance_2_0` — Primary |
| Narrative / multi-shot | `kling3_0` — Primary |
| Lipsync / dialogue ONLY | `veo3_1` |
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
