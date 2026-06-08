---
name: tiktok-mcp
version: 1.0
description: TikTok Research API and Content Posting API tools. Use for TikTok analytics, content research, trending topics, and automated posting workflows.
---

# TIKTOK MCP v1.0
## Space Age AI Solutions — TikTok API Integration

## When to load this skill

- Researching TikTok trends for content strategy
- Analyzing TikTok competitor content
- Automating TikTok content posting
- Getting TikTok analytics data

---

## TIKTOK RESEARCH API

Available via TikTok Research API (requires approved access):

```
VIDEO QUERIES:
  - Search videos by keyword
  - Get video details (views, likes, shares, comments)
  - Trending videos by hashtag or keyword

USER QUERIES:
  - Public user profile data
  - User video list
  - Follower/following counts

HASHTAG QUERIES:
  - Hashtag video count
  - Trending hashtags by category

COMMENT QUERIES:
  - Video comment data
  - Comment sentiment patterns
```

---

## CONTENT POSTING API

For automated content scheduling:

```
DIRECT POST:
  - Upload video directly to TikTok
  - Set caption, hashtags, mentions
  - Schedule publish time

INBOX POST:
  - Send video to creator's inbox for review
  - Creator approves before publishing
  - Recommended for client accounts
```

---

## CONTENT STRATEGY USE CASES

### Trend Research Workflow
1. Query trending hashtags in niche
2. Pull top 20 videos by view count
3. Analyze hooks, captions, video length
4. Extract patterns for `ai-content-creator`

### Competitor Analysis Workflow
1. Pull competitor's recent 30 videos
2. Identify highest-performing content
3. Analyze what formats/topics drive views
4. Build competing content strategy

### Posting Automation Workflow
1. Generate content via `ai-content-creator`
2. Generate video via `cinematic-video-architect` + Higgsfield
3. Schedule post via TikTok Content Posting API
4. Track performance via Research API

---

## WHAT TO AVOID

- Don't use Research API without confirming access credentials
- Don't auto-post without client approval (use inbox post for client accounts)
- Don't ignore TikTok's rate limits on Research API queries
