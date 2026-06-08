---
name: youtube-mcp
version: 1.0
description: YouTube Data API v3 as Claude tools. Search videos, get channel data, analyze video metrics, and research content for competitive analysis and content strategy.
---

# YOUTUBE MCP v1.0
## Space Age AI Solutions — YouTube Data API Integration

## When to load this skill

- Researching YouTube content for competitive analysis
- Analyzing video performance metrics
- Finding trending content in a niche
- Getting channel statistics for strategy
- Content research before production

---

## AVAILABLE OPERATIONS

```
VIDEO SEARCH:
  - Search by keyword, topic, channel
  - Filter by upload date, duration, definition
  - Sort by relevance, date, viewCount, rating

VIDEO DETAILS:
  - View count, likes, comments, duration
  - Description, tags, categories
  - Thumbnail URLs
  - Statistics over time (channel level)

CHANNEL DATA:
  - Subscriber count
  - Total video count
  - Total view count
  - Recent upload frequency
  - Most popular videos

COMMENT ANALYSIS:
  - Top comments by likes
  - Comment sentiment patterns
  - Audience questions (content ideas)

CAPTIONS:
  - Get transcript/subtitles from any video
  - Auto-generated or manual captions
  - Multiple language support
```

---

## CONTENT RESEARCH WORKFLOWS

### Competitor Analysis
```
1. Get competitor channel ID
2. List their top 20 videos by viewCount
3. Analyze titles, thumbnails, descriptions
4. Extract keywords and topic patterns
5. Feed into ai-content-creator for competing strategy
```

### Trend Research
```
1. Search keyword with filter: order=viewCount, publishedAfter=30days
2. Identify videos with high views relative to channel size
3. Analyze what's working (hook, format, length)
4. Build content plan around identified patterns
```

### Transcript Extraction
```
1. Get video ID from URL
2. Pull captions/transcript
3. Analyze for:
   - Content structure (intro/sections/outro)
   - Key talking points
   - CTA placement
4. Use sa-watch skill for visual analysis
```

---

## INTEGRATION WITH SA PIPELINE

- Research output feeds: `ai-content-creator` (competing content strategy)
- Transcript analysis: `sa-watch` (visual + content combined)
- Content calendar: feed insights into 30-day plan
- Music video research: analyze top music video production techniques
