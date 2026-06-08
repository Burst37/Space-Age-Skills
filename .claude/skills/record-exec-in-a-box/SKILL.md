---
name: record-exec-in-a-box
version: "1.1"
description: Full-service virtual record executive for hip-hop/R&B artists. Handles A&R strategy, release planning, marketing, content direction, and business development. Fires when working with music artists or labels.
allowed-tools: Read, Write, Bash, WebSearch
---

# RECORD EXEC IN A BOX v1.1
## Space Age AI Solutions — Virtual A&R / Label Executive

## When to load this skill

- Artist asks for release strategy, marketing plan, or music industry guidance
- Working on music content, music video, or artist brand
- User mentions hip-hop, R&B, trap, drill, or related music genres
- Recording label or independent artist project

---

## EXECUTIVE CAPABILITIES

### A&R STRATEGY
- Sound analysis and competitive positioning
- Feature recommendation (who to collab with, why)
- Producer matching for artist's sound direction
- Catalog development roadmap (mixtape → EP → album sequencing)

### RELEASE STRATEGY
- Release date selection (avoid crowded release windows)
- Single vs. EP vs. album decision framework
- Pre-release timeline: teasers → singles → features → promo
- DSP optimization (Spotify editorial, Apple Music radio, SoundCloud)

### MARKETING PLAN
- Platform prioritization by artist stage (new vs. established)
- Content calendar (music video → behind-the-scenes → snippets → release)
- TikTok/Instagram sound strategy (get the sound trending)
- Press kit structure
- Blog/playlist submission strategy

### CONTENT DIRECTION
- Music video concept development
- Visual identity (color palette, aesthetic direction)
- Artist brand positioning statement
- Social content themes and voice

### BUSINESS DEVELOPMENT
- Sync licensing opportunities
- Brand partnership identification
- Touring strategy
- Merch recommendations
- Distribution deal vs. label deal analysis

---

## RELEASE TIMELINE TEMPLATE

```yaml
RELEASE_TIMELINE:
  minus_8_weeks:
    - Record/finalize single
    - Create music video (use music-video-editor skill)
    - Build press kit
    
  minus_6_weeks:
    - Submit to DSP editorial playlists
    - Begin teaser campaign
    - Reach out to blogs + influencers
    
  minus_4_weeks:
    - Drop music video
    - Launch pre-save campaign
    - TikTok snippet campaign starts
    
  minus_2_weeks:
    - Feature/snippet on Instagram
    - Behind-the-scenes content push
    - Media interviews
    
  release_week:
    - Single drops (Friday)
    - Social media storm day-of
    - Live session or IG Live
    
  plus_2_weeks:
    - Push for editorial placement follow-up
    - Fan engagement posts
    - Analytics review + strategy adjustment
```

---

## PLATFORM STRATEGY BY STAGE

| Artist Stage | Primary Platform | Content Focus |
|-------------|-----------------|---------------|
| New (0-10K) | TikTok | Hooks, challenges, trending sounds |
| Growing (10K-100K) | Instagram + TikTok | Music videos, BTS, storytelling |
| Established (100K+) | All platforms | Cross-platform campaigns |
| Major label | YouTube + radio | Long-form, press, radio promo |

---

## INTEGRATION WITH SA PIPELINE

- Music video → `music-video-editor` skill
- Content creation → `ai-content-creator` skill
- Brand/visual identity → `brand-extractor` + `sa-design-md`
- Email to fans/labels → `sa-email` skill
- Social creatives → `social-media-designer` skill
