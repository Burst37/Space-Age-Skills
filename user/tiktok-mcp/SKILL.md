---
name: tiktok-mcp
display_name: "Space Age — TikTok MCP"
version: "1.0"
---

# TikTok MCP

Query TikTok content, retrieve user and video analytics, explore hashtag trends, and post videos — all via the official TikTok for Developers APIs.

## What It Does

This MCP server wraps two TikTok developer APIs:

- **TikTok Research API** — public data: video search, user profiles, comment threads, trending hashtags
- **TikTok Content Posting API** — authenticated actions: initialize video uploads, check publish status, query creator settings

## Trigger Phrases

Use this skill when the user mentions any of:
`TikTok analytics`, `TikTok posting`, `TikTok video research`, `hashtag trends`, `creator stats`

## Install

```bash
pip install -r user/tiktok-mcp/requirements.txt
```

## Config

Add the following to `.claude/settings.json` under the `mcpServers` key:

```json
{
  "mcpServers": {
    "tiktok": {
      "command": "python",
      "args": ["user/tiktok-mcp/server.py"],
      "env": {
        "TIKTOK_CLIENT_KEY": "your_client_key",
        "TIKTOK_CLIENT_SECRET": "your_client_secret",
        "TIKTOK_ACCESS_TOKEN": "your_oauth_access_token"
      }
    }
  }
}
```

A ready-to-paste snippet is also available at `user/tiktok-mcp/claude-config.json`.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TIKTOK_CLIENT_KEY` | Yes | OAuth 2.0 app client key from TikTok Developer Portal |
| `TIKTOK_CLIENT_SECRET` | Yes | OAuth 2.0 app client secret |
| `TIKTOK_ACCESS_TOKEN` | Yes | Bearer token obtained via OAuth 2.0 authorization flow |

### OAuth Flow Note

`TIKTOK_ACCESS_TOKEN` holds the **bearer token** issued after completing TikTok's OAuth 2.0 authorization code flow. The server sends this token as `Authorization: Bearer {token}` on every request. You must obtain this token separately — typically by directing the user through `https://www.tiktok.com/auth/authorize/` and exchanging the returned code at `https://open.tiktokapis.com/v2/oauth/token/`. Tokens expire and must be refreshed using your `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`.

## APIs Used

| API | Base URL | Auth |
|---|---|---|
| TikTok Research API | `https://open.tiktokapis.com/v2/` | Bearer token |
| TikTok Content Posting API | `https://open.tiktokapis.com/v2/post/publish/` | Bearer token |

---

## Tools Reference

### Video Research

#### `tiktok_search_videos`
Search public TikTok videos by keyword with optional filters.

| Param | Type | Default | Description |
|---|---|---|---|
| `query` | str | required | Keyword search string |
| `max_count` | int | 20 | Max results (1–100) |
| `start_date` | str | None | Start date filter `YYYYMMDD` |
| `end_date` | str | None | End date filter `YYYYMMDD` |
| `region_codes` | list[str] | None | Country codes e.g. `["US","GB"]` |
| `hashtag_names` | list[str] | None | Hashtag names (without #) |
| `min_view_count` | int | None | Minimum view count threshold |

Returns: list of videos with `id`, `title`, `region_code`, `view_count`, `like_count`, `comment_count`, `share_count`, `create_time`, `duration`, `hashtags`.

---

#### `tiktok_get_video_info`
Fetch detailed metadata for up to 20 video IDs in one call.

| Param | Type | Description |
|---|---|---|
| `video_ids` | list[str] | List of TikTok video IDs (max 20) |

---

#### `tiktok_get_user_info`
Get a public TikTok user's profile.

| Param | Type | Description |
|---|---|---|
| `username` | str | TikTok username without @ |

Returns: `display_name`, `bio`, `avatar_url`, `is_verified`, `follower_count`, `following_count`, `likes_count`, `video_count`.

---

#### `tiktok_get_user_videos`
List videos posted by a user, with pagination.

| Param | Type | Default | Description |
|---|---|---|---|
| `username` | str | required | TikTok username |
| `max_count` | int | 20 | Max videos (1–35) |
| `cursor` | int | 0 | Pagination cursor |

---

#### `tiktok_get_user_liked_videos`
List videos liked by a user.

| Param | Type | Default | Description |
|---|---|---|---|
| `username` | str | required | TikTok username |
| `max_count` | int | 20 | Max videos (1–35) |
| `cursor` | int | 0 | Pagination cursor |

---

#### `tiktok_get_user_pinned_videos`
Fetch a user's pinned videos.

| Param | Type | Description |
|---|---|---|
| `username` | str | TikTok username |

---

#### `tiktok_get_video_comments`
Retrieve comments on a video with pagination.

| Param | Type | Default | Description |
|---|---|---|---|
| `video_id` | str | required | TikTok video ID |
| `max_count` | int | 20 | Max comments (1–30) |
| `cursor` | int | 0 | Pagination cursor |

Returns: list of comments with `text`, `like_count`, `reply_count`, `create_time`.

---

#### `tiktok_get_comment_replies`
Fetch replies to a specific comment.

| Param | Type | Default | Description |
|---|---|---|---|
| `video_id` | str | required | TikTok video ID |
| `comment_id` | str | required | Parent comment ID |
| `max_count` | int | 20 | Max replies (1–30) |

---

### Hashtag & Trend Research

#### `tiktok_get_trending_hashtags`
Get trending hashtags for a country.

| Param | Type | Default | Description |
|---|---|---|---|
| `country_code` | str | `"US"` | ISO two-letter country code |
| `count` | int | 30 | Number of hashtags to return |

Returns: list of hashtags with `name`, `video_count`, `view_count`.

---

#### `tiktok_search_hashtag_videos`
Find top videos for a specific hashtag.

| Param | Type | Default | Description |
|---|---|---|---|
| `hashtag_name` | str | required | Hashtag name without # |
| `max_count` | int | 20 | Max results (1–100) |

---

### Content Posting

#### `tiktok_init_video_upload`
Initialize a video upload to post to the creator's inbox.

| Param | Type | Default | Description |
|---|---|---|---|
| `source` | str | `"URL_UPLOAD"` | `"URL_UPLOAD"` or `"FILE_UPLOAD"` |
| `video_url` | str | None | Public video URL (URL_UPLOAD only) |
| `video_size` | int | None | File size in bytes (FILE_UPLOAD only) |
| `chunk_size` | int | None | Chunk size in bytes (FILE_UPLOAD only) |
| `total_chunk_count` | int | None | Number of chunks (FILE_UPLOAD only) |

Returns: `publish_id`, `upload_url` (FILE_UPLOAD only).

---

#### `tiktok_check_upload_status`
Poll publish status for an in-progress upload.

| Param | Type | Description |
|---|---|---|
| `publish_id` | str | ID returned by `tiktok_init_video_upload` |

Returns: `status` (`PROCESSING_UPLOAD`, `SEND_TO_USER_INBOX`, `PUBLISH_COMPLETE`, `FAILED`), `fail_reason`, byte progress.

---

#### `tiktok_get_creator_info`
Get the authenticated creator's posting eligibility and privacy options.

No parameters required.

Returns: `creator_username`, `creator_nickname`, `privacy_level_options`, `comment_disabled`, `duet_disabled`, `stitch_disabled`, `max_video_post_duration_sec`.

---

### Analytics Helpers

#### `tiktok_analyze_account`
Composite account analysis: profile + last 20 videos + engagement rate + top 3 videos.

| Param | Type | Description |
|---|---|---|
| `username` | str | TikTok username |

**Engagement rate** = `(likes + comments + shares) / views × 100` averaged across all fetched videos.

---

#### `tiktok_compare_hashtags`
Side-by-side comparison of multiple hashtags by video count and total views.

| Param | Type | Description |
|---|---|---|
| `hashtag_names` | list[str] | Hashtag names to compare (without #) |

Returns: ranked list with `hashtag`, `video_count`, `view_count`, `in_trending` flag.
