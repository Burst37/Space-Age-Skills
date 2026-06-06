---
name: youtube-mcp
display_name: "Space Age — YouTube MCP"
version: "1.0"
---

# YouTube MCP

A production MCP server that exposes the YouTube Data API v3 as Claude tools. Search for videos, inspect channel analytics, browse playlists, read comments, and run multi-video intelligence comparisons — all directly from Claude Code.

## What it does

- **Search & Discovery** — full-text video search with filtering by date, region, and sort order; trending video charts by country and category
- **Video Details** — fetch full metadata, statistics (views, likes, comments), duration, tags, and captions for one or many videos at once
- **Channel Intelligence** — retrieve channel profile, subscriber/view/video counts, and the channel's upload history
- **Playlist Management** — list playlists for a channel, get playlist metadata, and enumerate the videos inside any playlist
- **Comment Reading** — top-level comments with author, like count, and reply count; drill into reply threads for any comment
- **Content Intelligence** — side-by-side video stat comparisons with engagement-rate calculation; composite channel analysis combining channel stats with recent-video performance

## Install

```bash
pip install -r user/youtube-mcp/requirements.txt
```

## Config

Add the following to your `.claude/settings.json` under `mcpServers`:

```json
{
  "mcpServers": {
    "youtube": {
      "command": "python",
      "args": ["user/youtube-mcp/server.py"],
      "env": {
        "YOUTUBE_API_KEY": "AIzaSy...",
        "YOUTUBE_OAUTH_CREDENTIALS_FILE": "/path/to/oauth-credentials.json"
      }
    }
  }
}
```

| Environment variable | Required | Purpose |
|---|---|---|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key — covers all read / public operations |
| `YOUTUBE_OAUTH_CREDENTIALS_FILE` | For write ops | Path to an OAuth 2.0 credentials JSON file — required for write operations and channel management (posting, updating, deleting) |

Get an API key at <https://console.cloud.google.com/apis/credentials> after enabling the **YouTube Data API v3**.

## Tools

### Search & Discovery

#### `youtube_search`
Search YouTube for videos, channels, or playlists.

| Param | Type | Default | Description |
|---|---|---|---|
| `query` | str | — | Search query string |
| `max_results` | int | 10 | Number of results (1–50) |
| `order` | str | `"relevance"` | Sort order: `relevance`, `date`, `rating`, `viewCount`, `title` |
| `type` | str | `"video"` | Resource type: `video`, `channel`, `playlist` |
| `published_after` | str | None | ISO 8601 datetime string — only return results after this time (e.g. `"2024-01-01T00:00:00Z"`) |
| `region_code` | str | `"US"` | ISO 3166-1 alpha-2 country code |

Returns a list of result dicts with `videoId`, `title`, `description`, `channelTitle`, `publishedAt`, and `thumbnails`.

---

#### `youtube_trending`
Fetch currently trending videos on YouTube.

| Param | Type | Default | Description |
|---|---|---|---|
| `region_code` | str | `"US"` | ISO 3166-1 alpha-2 country code |
| `category_id` | str | `"0"` | YouTube category ID — `0`=all, `10`=Music, `17`=Sports, `20`=Gaming, `24`=Entertainment |
| `max_results` | int | 10 | Number of results (1–50) |

Returns a list of trending video dicts with id, title, channel, view/like/comment counts, and duration.

---

#### `youtube_get_video`
Retrieve full details for a single YouTube video.

| Param | Type | Description |
|---|---|---|
| `video_id` | str | YouTube video ID (e.g. `"dQw4w9WgXcQ"`) |

Returns a dict with title, description, tags, statistics (views, likes, comments, favorites), duration, categoryId, captions flag, privacyStatus, and thumbnails.

---

#### `youtube_get_multiple_videos`
Batch-fetch details for multiple YouTube videos in a single API call.

| Param | Type | Description |
|---|---|---|
| `video_ids` | list[str] | List of video IDs (up to 50) |

Returns a list of video detail dicts (same structure as `youtube_get_video`).

---

### Channel

#### `youtube_get_channel`
Retrieve full details for a YouTube channel.

| Param | Type | Default | Description |
|---|---|---|---|
| `channel_id` | str | None | Channel unique ID (e.g. `"UCxxxxxx"`) |
| `username` | str | None | Legacy username / handle (e.g. `"MrBeast"`) |

Provide `channel_id` or `username` — not both. Returns channelId, title, description, customUrl, subscriberCount, viewCount, videoCount, country, and thumbnails.

---

#### `youtube_get_channel_videos`
List videos uploaded by a channel.

| Param | Type | Default | Description |
|---|---|---|---|
| `channel_id` | str | — | Channel unique ID |
| `max_results` | int | 10 | Number of videos to return (1–50) |
| `order` | str | `"date"` | Sort order: `date`, `rating`, `relevance`, `title`, `viewCount` |

Returns a list of video dicts with videoId, title, description, publishedAt, and thumbnails.

---

#### `youtube_get_channel_stats`
Retrieve subscriber count, total views, and video count for a channel.

| Param | Type | Description |
|---|---|---|
| `channel_id` | str | Channel unique ID |

Returns a dict with channelId, title, subscriberCount, viewCount, videoCount, and hiddenSubscriberCount.

---

### Playlists

#### `youtube_get_playlist`
Retrieve details for a YouTube playlist.

| Param | Type | Description |
|---|---|---|
| `playlist_id` | str | Playlist unique ID (e.g. `"PLxxxxxx"`) |

Returns playlistId, title, description, channelTitle, publishedAt, itemCount, privacyStatus, and thumbnails.

---

#### `youtube_list_playlist_items`
List videos inside a YouTube playlist.

| Param | Type | Default | Description |
|---|---|---|---|
| `playlist_id` | str | — | Playlist unique ID |
| `max_results` | int | 10 | Number of items to return (1–50) |

Returns a list of item dicts with videoId, title, description, publishedAt, position, and thumbnails.

---

#### `youtube_get_channel_playlists`
List all playlists created by a channel.

| Param | Type | Default | Description |
|---|---|---|---|
| `channel_id` | str | — | Channel unique ID |
| `max_results` | int | 10 | Number of playlists to return (1–50) |

Returns a list of playlist dicts with playlistId, title, description, publishedAt, itemCount, and thumbnails.

---

### Comments

#### `youtube_get_comments`
Retrieve top-level comments for a YouTube video.

| Param | Type | Default | Description |
|---|---|---|---|
| `video_id` | str | — | YouTube video ID |
| `max_results` | int | 20 | Number of comments to return (1–100) |
| `order` | str | `"relevance"` | Sort order: `relevance` or `time` |

Returns a list of comment dicts with commentId, text, authorName, likeCount, publishedAt, updatedAt, and replyCount.

---

#### `youtube_get_comment_replies`
Retrieve replies to a specific YouTube comment.

| Param | Type | Default | Description |
|---|---|---|---|
| `comment_id` | str | — | Parent comment ID |
| `max_results` | int | 10 | Number of replies to return (1–100) |

Returns a list of reply dicts with replyId, text, authorName, likeCount, publishedAt, and updatedAt.

---

### Content Intelligence

#### `youtube_get_video_captions`
List available caption tracks for a YouTube video.

| Param | Type | Description |
|---|---|---|
| `video_id` | str | YouTube video ID |

Returns a list of caption track dicts with captionId, language, name, kind, isDefault, isAutoSynced, status, and trackKind.

---

#### `youtube_compare_videos`
Side-by-side statistics comparison for multiple YouTube videos.

| Param | Type | Description |
|---|---|---|
| `video_ids` | list[str] | List of 2–50 YouTube video IDs to compare |

Returns a list sorted by viewCount descending. Each entry includes videoId, title, channelTitle, publishedAt, viewCount, likeCount, commentCount, duration, and `engagement_rate` (likes + comments / views × 100, as a percentage).

---

#### `youtube_analyze_channel`
Composite channel analysis — channel stats, last 10 videos with individual stats, and average engagement rate.

| Param | Type | Description |
|---|---|---|
| `channel_id` | str | Channel unique ID |

Returns a dict with:
- `channel` — title, subscriberCount, viewCount, videoCount, description, customUrl, country
- `recent_videos` — list of up to 10 videos each with viewCount, likeCount, commentCount, duration, and engagement_rate
- `avg_engagement_rate` — average engagement rate across those videos (percentage)

---

## Trigger phrases

Use this MCP for any request involving:

- YouTube search, video lookup, or video details
- Channel analytics, channel stats, or subscriber counts
- Playlist management or playlist contents
- Comment reading or comment replies
- Trending videos on YouTube
- Video engagement rate, comparison, or performance analysis
- Caption track availability for a video
