"""
TikTok MCP Server — Space Age Skills
Exposes TikTok Research API and Content Posting API as MCP tools.
"""

import asyncio
import os
from typing import Optional

import httpx
from mcp.server.fastmcp import FastMCP

# ── Configuration ──────────────────────────────────────────────────────────────

TIKTOK_CLIENT_KEY = os.environ.get("TIKTOK_CLIENT_KEY", "")
TIKTOK_CLIENT_SECRET = os.environ.get("TIKTOK_CLIENT_SECRET", "")
TIKTOK_ACCESS_TOKEN = os.environ.get("TIKTOK_ACCESS_TOKEN", "")

RESEARCH_BASE = "https://open.tiktokapis.com/v2/"
POSTING_BASE = "https://open.tiktokapis.com/v2/post/publish/"

mcp = FastMCP("tiktok-mcp")

# ── HTTP helpers ───────────────────────────────────────────────────────────────


def _auth_headers() -> dict:
    return {
        "Authorization": f"Bearer {TIKTOK_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


async def _post(url: str, body: dict, retries: int = 2) -> dict:
    """POST with automatic 429 back-off retry."""
    async with httpx.AsyncClient(timeout=30) as client:
        for attempt in range(retries + 1):
            resp = await client.post(url, headers=_auth_headers(), json=body)
            if resp.status_code == 429 and attempt < retries:
                await asyncio.sleep(2)
                continue
            if resp.status_code != 200:
                return {
                    "error": "http_error",
                    "code": resp.status_code,
                    "message": resp.text,
                }
            data = resp.json()
            if data.get("error", {}).get("code", "ok") not in ("ok", ""):
                err = data["error"]
                return {
                    "error": err.get("code"),
                    "code": resp.status_code,
                    "message": err.get("message", ""),
                }
            return data
    return {"error": "max_retries", "code": 429, "message": "Rate limit exceeded after retries"}


async def _get(url: str, params: dict | None = None, retries: int = 2) -> dict:
    """GET with automatic 429 back-off retry."""
    async with httpx.AsyncClient(timeout=30) as client:
        for attempt in range(retries + 1):
            resp = await client.get(url, headers=_auth_headers(), params=params or {})
            if resp.status_code == 429 and attempt < retries:
                await asyncio.sleep(2)
                continue
            if resp.status_code != 200:
                return {
                    "error": "http_error",
                    "code": resp.status_code,
                    "message": resp.text,
                }
            data = resp.json()
            if data.get("error", {}).get("code", "ok") not in ("ok", ""):
                err = data["error"]
                return {
                    "error": err.get("code"),
                    "code": resp.status_code,
                    "message": err.get("message", ""),
                }
            return data
    return {"error": "max_retries", "code": 429, "message": "Rate limit exceeded after retries"}


# ── Video Research Tools ───────────────────────────────────────────────────────


@mcp.tool()
async def tiktok_search_videos(
    query: str,
    max_count: int = 20,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    region_codes: Optional[list[str]] = None,
    hashtag_names: Optional[list[str]] = None,
    min_view_count: Optional[int] = None,
) -> dict:
    """Search TikTok videos using the Research API.

    Args:
        query: Keyword search query.
        max_count: Maximum number of results (1–100, default 20).
        start_date: Filter videos created on or after this date (YYYYMMDD).
        end_date: Filter videos created on or before this date (YYYYMMDD).
        region_codes: List of region/country codes to filter by, e.g. ["US", "GB"].
        hashtag_names: List of hashtag names (without #) to narrow results.
        min_view_count: Minimum view count filter.

    Returns:
        Dict with 'videos' list (id, title, region_code, view_count, like_count,
        comment_count, share_count, create_time, duration, hashtags) and cursor info.
    """
    and_conditions: list[dict] = [
        {"operation": "IN", "field_name": "keyword", "field_values": [query]}
    ]

    if region_codes:
        and_conditions.append(
            {"operation": "IN", "field_name": "region_code", "field_values": region_codes}
        )
    if hashtag_names:
        and_conditions.append(
            {"operation": "IN", "field_name": "hashtag_name", "field_values": hashtag_names}
        )
    if min_view_count is not None:
        and_conditions.append(
            {
                "operation": "GTE",
                "field_name": "view_count",
                "field_values": [str(min_view_count)],
            }
        )

    body: dict = {
        "query": {"and": and_conditions},
        "max_count": min(max_count, 100),
        "fields": "id,title,region_code,view_count,like_count,comment_count,share_count,create_time,duration,hashtag_names",
    }

    if start_date:
        body["start_date"] = start_date
    if end_date:
        body["end_date"] = end_date

    data = await _post(f"{RESEARCH_BASE}research/video/query/", body)
    if "error" in data:
        return data

    videos = data.get("data", {}).get("videos", [])
    return {
        "videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "region_code": v.get("region_code"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "hashtags": v.get("hashtag_names", []),
            }
            for v in videos
        ],
        "cursor": data.get("data", {}).get("cursor"),
        "has_more": data.get("data", {}).get("has_more", False),
        "search_id": data.get("data", {}).get("search_id"),
    }


@mcp.tool()
async def tiktok_get_video_info(video_ids: list[str]) -> dict:
    """Get detailed information for specific TikTok video IDs.

    Args:
        video_ids: List of TikTok video IDs (max 20 per request).

    Returns:
        Dict with 'videos' list containing full metadata for each video.
    """
    body = {
        "query": {
            "and": [
                {"operation": "IN", "field_name": "video_id", "field_values": video_ids[:20]}
            ]
        },
        "max_count": len(video_ids[:20]),
        "fields": "id,title,region_code,view_count,like_count,comment_count,share_count,create_time,duration,hashtag_names,video_description,share_url",
    }

    data = await _post(f"{RESEARCH_BASE}research/video/query/", body)
    if "error" in data:
        return data

    videos = data.get("data", {}).get("videos", [])
    return {
        "videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "description": v.get("video_description"),
                "region_code": v.get("region_code"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "hashtags": v.get("hashtag_names", []),
                "share_url": v.get("share_url"),
            }
            for v in videos
        ]
    }


@mcp.tool()
async def tiktok_get_user_info(username: str) -> dict:
    """Get public profile information for a TikTok user.

    Args:
        username: TikTok username (without @).

    Returns:
        Dict with display_name, bio_description, avatar_url, follower_count,
        following_count, likes_count, video_count.
    """
    body = {
        "username": username,
        "fields": "display_name,bio_description,avatar_url,is_verified,follower_count,following_count,likes_count,video_count",
    }

    data = await _post(f"{RESEARCH_BASE}research/user/info/", body)
    if "error" in data:
        return data

    user = data.get("data", {})
    return {
        "username": username,
        "display_name": user.get("display_name"),
        "bio": user.get("bio_description"),
        "avatar_url": user.get("avatar_url"),
        "is_verified": user.get("is_verified"),
        "follower_count": user.get("follower_count"),
        "following_count": user.get("following_count"),
        "likes_count": user.get("likes_count"),
        "video_count": user.get("video_count"),
    }


@mcp.tool()
async def tiktok_get_user_videos(
    username: str,
    max_count: int = 20,
    cursor: int = 0,
) -> dict:
    """Get videos posted by a specific TikTok user.

    Args:
        username: TikTok username (without @).
        max_count: Maximum number of videos to return (1–35, default 20).
        cursor: Pagination cursor for fetching subsequent pages.

    Returns:
        Dict with 'videos' list and pagination info.
    """
    body = {
        "username": username,
        "max_count": min(max_count, 35),
        "cursor": cursor,
        "fields": "id,title,create_time,duration,view_count,like_count,comment_count,share_count,hashtag_names",
    }

    data = await _post(f"{RESEARCH_BASE}research/user/videos/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    videos = d.get("user_videos", [])
    return {
        "username": username,
        "videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "hashtags": v.get("hashtag_names", []),
            }
            for v in videos
        ],
        "cursor": d.get("cursor"),
        "has_more": d.get("has_more", False),
    }


@mcp.tool()
async def tiktok_get_user_liked_videos(
    username: str,
    max_count: int = 20,
    cursor: int = 0,
) -> dict:
    """Get videos liked by a specific TikTok user.

    Args:
        username: TikTok username (without @).
        max_count: Maximum number of videos to return (1–35, default 20).
        cursor: Pagination cursor.

    Returns:
        Dict with 'videos' list and pagination info.
    """
    body = {
        "username": username,
        "max_count": min(max_count, 35),
        "cursor": cursor,
        "fields": "id,title,create_time,duration,view_count,like_count,comment_count,share_count,hashtag_names",
    }

    data = await _post(f"{RESEARCH_BASE}research/user/liked_videos/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    videos = d.get("user_liked_videos", [])
    return {
        "username": username,
        "liked_videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "hashtags": v.get("hashtag_names", []),
            }
            for v in videos
        ],
        "cursor": d.get("cursor"),
        "has_more": d.get("has_more", False),
    }


@mcp.tool()
async def tiktok_get_user_pinned_videos(username: str) -> dict:
    """Get pinned videos for a specific TikTok user.

    Args:
        username: TikTok username (without @).

    Returns:
        Dict with 'pinned_videos' list containing video metadata.
    """
    body = {
        "username": username,
        "fields": "id,title,create_time,duration,view_count,like_count,comment_count,share_count,hashtag_names",
    }

    data = await _post(f"{RESEARCH_BASE}research/user/pinned_videos/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    videos = d.get("pinned_videos_list", [])
    return {
        "username": username,
        "pinned_videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "hashtags": v.get("hashtag_names", []),
            }
            for v in videos
        ],
    }


@mcp.tool()
async def tiktok_get_video_comments(
    video_id: str,
    max_count: int = 20,
    cursor: int = 0,
) -> dict:
    """Get comments for a TikTok video.

    Args:
        video_id: TikTok video ID.
        max_count: Maximum number of comments to return (1–30, default 20).
        cursor: Pagination cursor.

    Returns:
        Dict with 'comments' list (text, like_count, reply_count, create_time) and pagination info.
    """
    body = {
        "video_id": video_id,
        "max_count": min(max_count, 30),
        "cursor": cursor,
        "fields": "id,text,like_count,reply_count,create_time,parent_comment_id",
    }

    data = await _post(f"{RESEARCH_BASE}research/video/comment/list/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    comments = d.get("comments", [])
    return {
        "video_id": video_id,
        "comments": [
            {
                "id": c.get("id"),
                "text": c.get("text"),
                "like_count": c.get("like_count"),
                "reply_count": c.get("reply_count"),
                "create_time": c.get("create_time"),
            }
            for c in comments
        ],
        "cursor": d.get("cursor"),
        "has_more": d.get("has_more", False),
        "total_count": d.get("total_count"),
    }


@mcp.tool()
async def tiktok_get_comment_replies(
    video_id: str,
    comment_id: str,
    max_count: int = 20,
) -> dict:
    """Get replies to a specific comment on a TikTok video.

    Args:
        video_id: TikTok video ID.
        comment_id: Comment ID to fetch replies for.
        max_count: Maximum number of replies to return (1–30, default 20).

    Returns:
        Dict with 'replies' list.
    """
    body = {
        "video_id": video_id,
        "comment_id": comment_id,
        "max_count": min(max_count, 30),
        "fields": "id,text,like_count,reply_count,create_time,parent_comment_id",
    }

    data = await _post(f"{RESEARCH_BASE}research/video/comment/reply/list/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    replies = d.get("replies", [])
    return {
        "video_id": video_id,
        "comment_id": comment_id,
        "replies": [
            {
                "id": r.get("id"),
                "text": r.get("text"),
                "like_count": r.get("like_count"),
                "create_time": r.get("create_time"),
            }
            for r in replies
        ],
        "cursor": d.get("cursor"),
        "has_more": d.get("has_more", False),
    }


# ── Hashtag & Trend Research Tools ────────────────────────────────────────────


@mcp.tool()
async def tiktok_get_trending_hashtags(
    country_code: str = "US",
    count: int = 30,
) -> dict:
    """Get currently trending hashtags on TikTok for a given country.

    Args:
        country_code: Two-letter ISO country code (default "US").
        count: Number of trending hashtags to return (default 30).

    Returns:
        Dict with 'hashtags' list (name, video_count, view_count).
    """
    params = {"country_code": country_code, "count": count}
    data = await _get(f"{RESEARCH_BASE}research/trending/hashtag/", params=params)
    if "error" in data:
        return data

    hashtags = data.get("data", {}).get("hashtag_list", [])
    return {
        "country_code": country_code,
        "hashtags": [
            {
                "name": h.get("hashtag_name"),
                "video_count": h.get("video_count"),
                "view_count": h.get("view_count"),
                "publish_cnt": h.get("publish_cnt"),
            }
            for h in hashtags
        ],
    }


@mcp.tool()
async def tiktok_search_hashtag_videos(
    hashtag_name: str,
    max_count: int = 20,
) -> dict:
    """Search for top TikTok videos using a specific hashtag.

    Args:
        hashtag_name: Hashtag name without the # symbol.
        max_count: Maximum number of videos to return (1–100, default 20).

    Returns:
        Dict with 'videos' list sorted by relevance/popularity.
    """
    body = {
        "query": {
            "and": [
                {
                    "operation": "IN",
                    "field_name": "hashtag_name",
                    "field_values": [hashtag_name],
                }
            ]
        },
        "max_count": min(max_count, 100),
        "fields": "id,title,region_code,view_count,like_count,comment_count,share_count,create_time,duration,hashtag_names",
    }

    data = await _post(f"{RESEARCH_BASE}research/video/query/", body)
    if "error" in data:
        return data

    videos = data.get("data", {}).get("videos", [])
    return {
        "hashtag": hashtag_name,
        "videos": [
            {
                "id": v.get("id"),
                "title": v.get("title"),
                "region_code": v.get("region_code"),
                "view_count": v.get("view_count"),
                "like_count": v.get("like_count"),
                "comment_count": v.get("comment_count"),
                "share_count": v.get("share_count"),
                "create_time": v.get("create_time"),
                "duration": v.get("duration"),
                "hashtags": v.get("hashtag_names", []),
            }
            for v in videos
        ],
        "cursor": data.get("data", {}).get("cursor"),
        "has_more": data.get("data", {}).get("has_more", False),
    }


# ── Content Posting Tools ──────────────────────────────────────────────────────


@mcp.tool()
async def tiktok_init_video_upload(
    video_url: Optional[str] = None,
    video_size: Optional[int] = None,
    chunk_size: Optional[int] = None,
    total_chunk_count: Optional[int] = None,
    source: str = "URL_UPLOAD",
) -> dict:
    """Initialize a TikTok video upload (direct post to creator inbox).

    Args:
        video_url: Publicly accessible URL of the video (required for URL_UPLOAD).
        video_size: Total size of the video file in bytes (required for FILE_UPLOAD).
        chunk_size: Size of each upload chunk in bytes (required for FILE_UPLOAD).
        total_chunk_count: Total number of chunks (required for FILE_UPLOAD).
        source: Upload source type — "URL_UPLOAD" or "FILE_UPLOAD" (default "URL_UPLOAD").

    Returns:
        Dict with publish_id and upload_url (for FILE_UPLOAD) to track the upload.
    """
    post_info: dict = {
        "privacy_level": "SELF_ONLY",
        "disable_duet": False,
        "disable_comment": False,
        "disable_stitch": False,
        "video_cover_timestamp_ms": 1000,
    }

    if source == "URL_UPLOAD":
        if not video_url:
            return {"error": "missing_param", "code": 400, "message": "video_url is required for URL_UPLOAD"}
        body = {
            "post_info": post_info,
            "source_info": {
                "source": "URL_UPLOAD",
                "video_url": video_url,
            },
        }
    else:
        if video_size is None or chunk_size is None or total_chunk_count is None:
            return {
                "error": "missing_params",
                "code": 400,
                "message": "video_size, chunk_size, and total_chunk_count are required for FILE_UPLOAD",
            }
        body = {
            "post_info": post_info,
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": video_size,
                "chunk_size": chunk_size,
                "total_chunk_count": total_chunk_count,
            },
        }

    data = await _post(f"{POSTING_BASE}video/init/", body)
    if "error" in data:
        return data

    d = data.get("data", {})
    return {
        "publish_id": d.get("publish_id"),
        "upload_url": d.get("upload_url"),
    }


@mcp.tool()
async def tiktok_check_upload_status(publish_id: str) -> dict:
    """Check the publish/upload status of a TikTok video.

    Args:
        publish_id: The publish_id returned by tiktok_init_video_upload.

    Returns:
        Dict with status (PROCESSING_UPLOAD, SEND_TO_USER_INBOX, FAILED, PUBLISH_COMPLETE),
        fail_reason if applicable, and uploaded/total bytes info.
    """
    body = {"publish_id": publish_id}
    data = await _post(f"{POSTING_BASE}status/fetch/", body)
    if "error" in data:
        return data

    d = data.get("data", {}).get("process_info", {})
    return {
        "publish_id": publish_id,
        "status": d.get("status"),
        "fail_reason": d.get("fail_reason"),
        "uploaded_bytes": d.get("uploaded_bytes"),
        "total_bytes": d.get("total_bytes"),
    }


@mcp.tool()
async def tiktok_get_creator_info() -> dict:
    """Get the authenticated creator's posting eligibility and settings.

    Returns:
        Dict with creator_avatar_url, creator_username, creator_nickname,
        privacy_level_options, comment_disabled, duet_disabled, stitch_disabled,
        max_video_post_duration_sec.
    """
    data = await _get(f"{POSTING_BASE}creator_info/query/")
    if "error" in data:
        return data

    d = data.get("data", {})
    return {
        "creator_avatar_url": d.get("creator_avatar_url"),
        "creator_username": d.get("creator_username"),
        "creator_nickname": d.get("creator_nickname"),
        "privacy_level_options": d.get("privacy_level_options", []),
        "comment_disabled": d.get("comment_disabled"),
        "duet_disabled": d.get("duet_disabled"),
        "stitch_disabled": d.get("stitch_disabled"),
        "max_video_post_duration_sec": d.get("max_video_post_duration_sec"),
    }


# ── Analytics Helper Tools ─────────────────────────────────────────────────────


@mcp.tool()
async def tiktok_analyze_account(username: str) -> dict:
    """Perform a composite account analysis for a TikTok creator.

    Fetches user profile, most recent videos, calculates average engagement rate,
    and identifies the top 3 performing videos by view count.

    Args:
        username: TikTok username (without @).

    Returns:
        Dict with user profile, engagement_rate (%), top_videos, and recent_videos summary.
    """
    user_result, videos_result = await asyncio.gather(
        tiktok_get_user_info(username),
        tiktok_get_user_videos(username, max_count=20),
    )

    if "error" in user_result:
        return user_result
    if "error" in videos_result:
        return videos_result

    videos = videos_result.get("videos", [])

    # Compute average engagement rate across all fetched videos
    engagement_rates = []
    for v in videos:
        views = v.get("view_count") or 0
        if views > 0:
            interactions = (
                (v.get("like_count") or 0)
                + (v.get("comment_count") or 0)
                + (v.get("share_count") or 0)
            )
            engagement_rates.append(interactions / views * 100)

    avg_engagement = round(sum(engagement_rates) / len(engagement_rates), 4) if engagement_rates else 0.0

    # Top 3 videos by view count
    top_videos = sorted(videos, key=lambda v: v.get("view_count") or 0, reverse=True)[:3]

    return {
        "profile": user_result,
        "avg_engagement_rate_pct": avg_engagement,
        "top_3_videos": top_videos,
        "recent_videos_count": len(videos),
        "recent_videos": videos,
    }


@mcp.tool()
async def tiktok_compare_hashtags(hashtag_names: list[str]) -> dict:
    """Compare multiple TikTok hashtags side by side.

    Queries trending data for each hashtag and returns a ranked comparison
    by video count and view totals.

    Args:
        hashtag_names: List of hashtag names to compare (without #), e.g. ["fyp", "viral", "dance"].

    Returns:
        Dict with 'comparison' list sorted by video_count descending, each entry containing
        hashtag name, video_count, and view_count.
    """
    # Fetch trending hashtags to find the ones in our list
    trending_result = await tiktok_get_trending_hashtags(count=100)

    if "error" in trending_result:
        return trending_result

    trending_map = {
        h["name"].lower(): h for h in trending_result.get("hashtags", []) if h.get("name")
    }

    comparison = []
    for name in hashtag_names:
        key = name.lower().lstrip("#")
        if key in trending_map:
            entry = trending_map[key]
            comparison.append(
                {
                    "hashtag": name,
                    "video_count": entry.get("video_count"),
                    "view_count": entry.get("view_count"),
                    "in_trending": True,
                }
            )
        else:
            # Fall back to video search to at least count results
            search_result = await tiktok_search_hashtag_videos(key, max_count=1)
            if "error" not in search_result:
                comparison.append(
                    {
                        "hashtag": name,
                        "video_count": None,
                        "view_count": None,
                        "in_trending": False,
                        "note": "Not in current trending list; search results available",
                    }
                )
            else:
                comparison.append(
                    {
                        "hashtag": name,
                        "video_count": None,
                        "view_count": None,
                        "in_trending": False,
                        "note": "Could not retrieve data",
                    }
                )

    comparison.sort(
        key=lambda x: x.get("video_count") or 0,
        reverse=True,
    )

    return {"comparison": comparison}


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run()
