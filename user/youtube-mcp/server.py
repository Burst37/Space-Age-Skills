"""
YouTube MCP Server — Space Age Skills
Provides tools for searching, analyzing, and managing YouTube content
via the YouTube Data API v3.
"""

import os
from typing import Optional
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("youtube-mcp")

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
BASE_URL = "https://www.googleapis.com/youtube/v3"


def _get(endpoint: str, params: dict) -> dict:
    """Make a GET request to the YouTube Data API v3."""
    if not YOUTUBE_API_KEY:
        return {"error": "YOUTUBE_API_KEY environment variable is not set", "status_code": 401}
    params["key"] = YOUTUBE_API_KEY
    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.get(f"{BASE_URL}/{endpoint}", params=params)
        if resp.status_code != 200:
            return {"error": resp.text, "status_code": resp.status_code}
        return resp.json()
    except httpx.RequestError as exc:
        return {"error": str(exc), "status_code": 0}


def _parse_duration(iso: str) -> str:
    """Convert ISO 8601 duration (PT#H#M#S) to human-readable string."""
    if not iso or not iso.startswith("PT"):
        return iso or ""
    s = iso[2:]
    hours = minutes = seconds = 0
    if "H" in s:
        hours, s = s.split("H", 1)
        hours = int(hours)
    if "M" in s:
        minutes, s = s.split("M", 1)
        minutes = int(minutes)
    if "S" in s:
        seconds = int(s.replace("S", ""))
    parts = []
    if hours:
        parts.append(f"{hours}h")
    if minutes:
        parts.append(f"{minutes}m")
    if seconds or not parts:
        parts.append(f"{seconds}s")
    return " ".join(parts)


def _safe_int(val) -> int:
    try:
        return int(val)
    except (TypeError, ValueError):
        return 0


# ---------------------------------------------------------------------------
# Search & Discovery
# ---------------------------------------------------------------------------

@mcp.tool()
def youtube_search(
    query: str,
    max_results: int = 10,
    order: str = "relevance",
    type: str = "video",
    published_after: Optional[str] = None,
    region_code: str = "US",
) -> list:
    """
    Search YouTube for videos, channels, or playlists.

    Args:
        query: Search query string.
        max_results: Number of results to return (1–50, default 10).
        order: Sort order — relevance, date, rating, viewCount, title.
        type: Resource type — video, channel, playlist.
        published_after: ISO 8601 date-time string (e.g. "2024-01-01T00:00:00Z").
                         Only return results published after this time.
        region_code: ISO 3166-1 alpha-2 country code (default "US").

    Returns:
        List of result dicts with videoId, title, description, channelTitle,
        publishedAt, and thumbnails.
    """
    params: dict = {
        "part": "snippet",
        "q": query,
        "maxResults": min(max(1, max_results), 50),
        "order": order,
        "type": type,
        "regionCode": region_code,
    }
    if published_after:
        params["publishedAfter"] = published_after

    data = _get("search", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        id_block = item.get("id", {})
        results.append({
            "videoId": id_block.get("videoId") or id_block.get("channelId") or id_block.get("playlistId"),
            "kind": id_block.get("kind", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "channelTitle": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "thumbnails": snippet.get("thumbnails", {}),
        })
    return results


@mcp.tool()
def youtube_trending(
    region_code: str = "US",
    category_id: str = "0",
    max_results: int = 10,
) -> list:
    """
    Fetch currently trending videos on YouTube.

    Args:
        region_code: ISO 3166-1 alpha-2 country code (default "US").
        category_id: YouTube video category ID (default "0" = all categories).
                     Common IDs: 0=all, 10=Music, 17=Sports, 20=Gaming, 24=Entertainment.
        max_results: Number of results to return (1–50, default 10).

    Returns:
        List of trending video dicts with id, title, channelTitle, viewCount,
        likeCount, commentCount, duration, and publishedAt.
    """
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "regionCode": region_code,
        "videoCategoryId": category_id,
        "maxResults": min(max(1, max_results), 50),
    }
    data = _get("videos", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content = item.get("contentDetails", {})
        results.append({
            "videoId": item.get("id", ""),
            "title": snippet.get("title", ""),
            "channelTitle": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "description": snippet.get("description", ""),
            "thumbnails": snippet.get("thumbnails", {}),
            "viewCount": _safe_int(stats.get("viewCount")),
            "likeCount": _safe_int(stats.get("likeCount")),
            "commentCount": _safe_int(stats.get("commentCount")),
            "duration": _parse_duration(content.get("duration", "")),
            "duration_iso": content.get("duration", ""),
        })
    return results


@mcp.tool()
def youtube_get_video(video_id: str) -> dict:
    """
    Retrieve full details for a single YouTube video.

    Args:
        video_id: The YouTube video ID (e.g. "dQw4w9WgXcQ").

    Returns:
        Dict with title, description, tags, statistics (views, likes, comments,
        favorites), duration, category, defaultLanguage, thumbnails, channelTitle,
        channelId, publishedAt, and liveBroadcastContent.
    """
    params = {
        "part": "snippet,statistics,contentDetails,status",
        "id": video_id,
    }
    data = _get("videos", params)
    if "error" in data:
        return data

    items = data.get("items", [])
    if not items:
        return {"error": f"Video '{video_id}' not found", "status_code": 404}

    item = items[0]
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})
    content = item.get("contentDetails", {})
    status = item.get("status", {})

    return {
        "videoId": item.get("id", ""),
        "title": snippet.get("title", ""),
        "description": snippet.get("description", ""),
        "tags": snippet.get("tags", []),
        "channelId": snippet.get("channelId", ""),
        "channelTitle": snippet.get("channelTitle", ""),
        "publishedAt": snippet.get("publishedAt", ""),
        "categoryId": snippet.get("categoryId", ""),
        "defaultLanguage": snippet.get("defaultLanguage", ""),
        "defaultAudioLanguage": snippet.get("defaultAudioLanguage", ""),
        "liveBroadcastContent": snippet.get("liveBroadcastContent", ""),
        "thumbnails": snippet.get("thumbnails", {}),
        "duration": _parse_duration(content.get("duration", "")),
        "duration_iso": content.get("duration", ""),
        "caption": content.get("caption", "false"),
        "definition": content.get("definition", ""),
        "privacyStatus": status.get("privacyStatus", ""),
        "statistics": {
            "viewCount": _safe_int(stats.get("viewCount")),
            "likeCount": _safe_int(stats.get("likeCount")),
            "favoriteCount": _safe_int(stats.get("favoriteCount")),
            "commentCount": _safe_int(stats.get("commentCount")),
        },
    }


@mcp.tool()
def youtube_get_multiple_videos(video_ids: list[str]) -> list:
    """
    Batch-fetch details for multiple YouTube videos in a single API call.

    Args:
        video_ids: List of YouTube video IDs (up to 50).

    Returns:
        List of video detail dicts (same structure as youtube_get_video).
    """
    if not video_ids:
        return []
    ids = video_ids[:50]
    params = {
        "part": "snippet,statistics,contentDetails",
        "id": ",".join(ids),
    }
    data = _get("videos", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content = item.get("contentDetails", {})
        results.append({
            "videoId": item.get("id", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "tags": snippet.get("tags", []),
            "channelId": snippet.get("channelId", ""),
            "channelTitle": snippet.get("channelTitle", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "categoryId": snippet.get("categoryId", ""),
            "thumbnails": snippet.get("thumbnails", {}),
            "duration": _parse_duration(content.get("duration", "")),
            "duration_iso": content.get("duration", ""),
            "statistics": {
                "viewCount": _safe_int(stats.get("viewCount")),
                "likeCount": _safe_int(stats.get("likeCount")),
                "favoriteCount": _safe_int(stats.get("favoriteCount")),
                "commentCount": _safe_int(stats.get("commentCount")),
            },
        })
    return results


# ---------------------------------------------------------------------------
# Channel
# ---------------------------------------------------------------------------

@mcp.tool()
def youtube_get_channel(
    channel_id: Optional[str] = None,
    username: Optional[str] = None,
) -> dict:
    """
    Retrieve details for a YouTube channel by ID or username.

    Args:
        channel_id: The channel's unique ID (e.g. "UCxxxxxx"). Provide this
                    OR username — not both.
        username:   The channel's legacy username / handle (e.g. "MrBeast").

    Returns:
        Dict with channelId, title, description, customUrl, publishedAt,
        country, subscriberCount, viewCount, videoCount, and thumbnails.
    """
    if not channel_id and not username:
        return {"error": "Provide channel_id or username", "status_code": 400}

    params: dict = {"part": "snippet,statistics,brandingSettings"}
    if channel_id:
        params["id"] = channel_id
    else:
        params["forUsername"] = username

    data = _get("channels", params)
    if "error" in data:
        return data

    items = data.get("items", [])
    if not items:
        return {"error": "Channel not found", "status_code": 404}

    item = items[0]
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})

    return {
        "channelId": item.get("id", ""),
        "title": snippet.get("title", ""),
        "description": snippet.get("description", ""),
        "customUrl": snippet.get("customUrl", ""),
        "publishedAt": snippet.get("publishedAt", ""),
        "country": snippet.get("country", ""),
        "thumbnails": snippet.get("thumbnails", {}),
        "subscriberCount": _safe_int(stats.get("subscriberCount")),
        "viewCount": _safe_int(stats.get("viewCount")),
        "videoCount": _safe_int(stats.get("videoCount")),
        "hiddenSubscriberCount": stats.get("hiddenSubscriberCount", False),
    }


@mcp.tool()
def youtube_get_channel_videos(
    channel_id: str,
    max_results: int = 10,
    order: str = "date",
) -> list:
    """
    List videos uploaded by a channel.

    Args:
        channel_id: The channel's unique ID.
        max_results: Number of videos to return (1–50, default 10).
        order: Sort order — date, rating, relevance, title, viewCount.

    Returns:
        List of video dicts with videoId, title, description, publishedAt,
        and thumbnails.
    """
    # First, get the uploads playlist ID for the channel
    ch_params = {"part": "contentDetails", "id": channel_id}
    ch_data = _get("channels", ch_params)
    if "error" in ch_data:
        return [ch_data]

    items = ch_data.get("items", [])
    if not items:
        return [{"error": "Channel not found", "status_code": 404}]

    uploads_playlist = (
        items[0]
        .get("contentDetails", {})
        .get("relatedPlaylists", {})
        .get("uploads", "")
    )
    if not uploads_playlist:
        return [{"error": "Could not find uploads playlist for channel", "status_code": 404}]

    pl_params = {
        "part": "snippet",
        "playlistId": uploads_playlist,
        "maxResults": min(max(1, max_results), 50),
    }
    pl_data = _get("playlistItems", pl_params)
    if "error" in pl_data:
        return [pl_data]

    results = []
    for item in pl_data.get("items", []):
        snippet = item.get("snippet", {})
        resource = snippet.get("resourceId", {})
        results.append({
            "videoId": resource.get("videoId", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "position": snippet.get("position", 0),
            "thumbnails": snippet.get("thumbnails", {}),
        })
    return results


@mcp.tool()
def youtube_get_channel_stats(channel_id: str) -> dict:
    """
    Retrieve subscriber count, total views, and video count for a channel.

    Args:
        channel_id: The channel's unique ID.

    Returns:
        Dict with channelId, title, subscriberCount, viewCount, videoCount,
        and hiddenSubscriberCount.
    """
    params = {"part": "snippet,statistics", "id": channel_id}
    data = _get("channels", params)
    if "error" in data:
        return data

    items = data.get("items", [])
    if not items:
        return {"error": "Channel not found", "status_code": 404}

    item = items[0]
    stats = item.get("statistics", {})
    return {
        "channelId": item.get("id", ""),
        "title": item.get("snippet", {}).get("title", ""),
        "subscriberCount": _safe_int(stats.get("subscriberCount")),
        "viewCount": _safe_int(stats.get("viewCount")),
        "videoCount": _safe_int(stats.get("videoCount")),
        "hiddenSubscriberCount": stats.get("hiddenSubscriberCount", False),
    }


# ---------------------------------------------------------------------------
# Playlists
# ---------------------------------------------------------------------------

@mcp.tool()
def youtube_get_playlist(playlist_id: str) -> dict:
    """
    Retrieve details for a YouTube playlist.

    Args:
        playlist_id: The playlist's unique ID (e.g. "PLxxxxxx").

    Returns:
        Dict with playlistId, title, description, channelTitle, publishedAt,
        itemCount, privacyStatus, and thumbnails.
    """
    params = {
        "part": "snippet,contentDetails,status",
        "id": playlist_id,
    }
    data = _get("playlists", params)
    if "error" in data:
        return data

    items = data.get("items", [])
    if not items:
        return {"error": f"Playlist '{playlist_id}' not found", "status_code": 404}

    item = items[0]
    snippet = item.get("snippet", {})
    return {
        "playlistId": item.get("id", ""),
        "title": snippet.get("title", ""),
        "description": snippet.get("description", ""),
        "channelId": snippet.get("channelId", ""),
        "channelTitle": snippet.get("channelTitle", ""),
        "publishedAt": snippet.get("publishedAt", ""),
        "thumbnails": snippet.get("thumbnails", {}),
        "itemCount": item.get("contentDetails", {}).get("itemCount", 0),
        "privacyStatus": item.get("status", {}).get("privacyStatus", ""),
    }


@mcp.tool()
def youtube_list_playlist_items(
    playlist_id: str,
    max_results: int = 10,
) -> list:
    """
    List videos inside a YouTube playlist.

    Args:
        playlist_id: The playlist's unique ID.
        max_results: Number of items to return (1–50, default 10).

    Returns:
        List of item dicts with videoId, title, description, publishedAt,
        position, and thumbnails.
    """
    params = {
        "part": "snippet,contentDetails",
        "playlistId": playlist_id,
        "maxResults": min(max(1, max_results), 50),
    }
    data = _get("playlistItems", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        resource = snippet.get("resourceId", {})
        results.append({
            "videoId": resource.get("videoId", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "position": snippet.get("position", 0),
            "thumbnails": snippet.get("thumbnails", {}),
            "videoOwnerChannelTitle": snippet.get("videoOwnerChannelTitle", ""),
            "videoOwnerChannelId": snippet.get("videoOwnerChannelId", ""),
        })
    return results


@mcp.tool()
def youtube_get_channel_playlists(
    channel_id: str,
    max_results: int = 10,
) -> list:
    """
    List all playlists created by a channel.

    Args:
        channel_id: The channel's unique ID.
        max_results: Number of playlists to return (1–50, default 10).

    Returns:
        List of playlist dicts with playlistId, title, description,
        publishedAt, itemCount, and thumbnails.
    """
    params = {
        "part": "snippet,contentDetails",
        "channelId": channel_id,
        "maxResults": min(max(1, max_results), 50),
    }
    data = _get("playlists", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        results.append({
            "playlistId": item.get("id", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "thumbnails": snippet.get("thumbnails", {}),
            "itemCount": item.get("contentDetails", {}).get("itemCount", 0),
        })
    return results


# ---------------------------------------------------------------------------
# Comments
# ---------------------------------------------------------------------------

@mcp.tool()
def youtube_get_comments(
    video_id: str,
    max_results: int = 20,
    order: str = "relevance",
) -> list:
    """
    Retrieve top-level comments for a YouTube video.

    Args:
        video_id: The YouTube video ID.
        max_results: Number of comments to return (1–100, default 20).
        order: Sort order — relevance or time.

    Returns:
        List of comment dicts with commentId, text, authorName, authorChannelId,
        likeCount, publishedAt, updatedAt, and replyCount.
    """
    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": min(max(1, max_results), 100),
        "order": order,
    }
    data = _get("commentThreads", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        top_comment = snippet.get("topLevelComment", {}).get("snippet", {})
        results.append({
            "commentId": item.get("id", ""),
            "text": top_comment.get("textDisplay", ""),
            "textOriginal": top_comment.get("textOriginal", ""),
            "authorName": top_comment.get("authorDisplayName", ""),
            "authorChannelId": top_comment.get("authorChannelId", {}).get("value", ""),
            "authorProfileImageUrl": top_comment.get("authorProfileImageUrl", ""),
            "likeCount": _safe_int(top_comment.get("likeCount")),
            "publishedAt": top_comment.get("publishedAt", ""),
            "updatedAt": top_comment.get("updatedAt", ""),
            "replyCount": _safe_int(snippet.get("totalReplyCount")),
            "videoId": snippet.get("videoId", ""),
        })
    return results


@mcp.tool()
def youtube_get_comment_replies(
    comment_id: str,
    max_results: int = 10,
) -> list:
    """
    Retrieve replies to a specific YouTube comment.

    Args:
        comment_id: The parent comment's ID.
        max_results: Number of replies to return (1–100, default 10).

    Returns:
        List of reply dicts with replyId, text, authorName, likeCount,
        publishedAt, and updatedAt.
    """
    params = {
        "part": "snippet",
        "parentId": comment_id,
        "maxResults": min(max(1, max_results), 100),
    }
    data = _get("comments", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        results.append({
            "replyId": item.get("id", ""),
            "text": snippet.get("textDisplay", ""),
            "textOriginal": snippet.get("textOriginal", ""),
            "authorName": snippet.get("authorDisplayName", ""),
            "authorChannelId": snippet.get("authorChannelId", {}).get("value", ""),
            "authorProfileImageUrl": snippet.get("authorProfileImageUrl", ""),
            "likeCount": _safe_int(snippet.get("likeCount")),
            "publishedAt": snippet.get("publishedAt", ""),
            "updatedAt": snippet.get("updatedAt", ""),
            "parentId": snippet.get("parentId", ""),
        })
    return results


# ---------------------------------------------------------------------------
# Content Intelligence
# ---------------------------------------------------------------------------

@mcp.tool()
def youtube_get_video_captions(video_id: str) -> list:
    """
    List available caption tracks for a YouTube video.

    Note: This endpoint requires OAuth 2.0 for videos you own, but public
    caption track metadata (language, kind) is returned for all videos.

    Args:
        video_id: The YouTube video ID.

    Returns:
        List of caption track dicts with captionId, language, name, kind,
        isDefault, isAutoSynced, and status.
    """
    params = {
        "part": "snippet",
        "videoId": video_id,
    }
    data = _get("captions", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        results.append({
            "captionId": item.get("id", ""),
            "videoId": snippet.get("videoId", ""),
            "language": snippet.get("language", ""),
            "name": snippet.get("name", ""),
            "kind": snippet.get("kind", ""),
            "isDefault": snippet.get("isDefault", False),
            "isAutoSynced": snippet.get("isAutoSynced", False),
            "status": snippet.get("status", ""),
            "trackKind": snippet.get("trackKind", ""),
        })
    return results


@mcp.tool()
def youtube_compare_videos(video_ids: list[str]) -> list:
    """
    Side-by-side statistics comparison for multiple YouTube videos.

    Args:
        video_ids: List of 2–50 YouTube video IDs to compare.

    Returns:
        List of comparison dicts sorted by viewCount descending. Each entry
        includes videoId, title, channelTitle, publishedAt, viewCount,
        likeCount, commentCount, duration, and engagement_rate (likes + comments
        divided by views, as a percentage).
    """
    if not video_ids:
        return [{"error": "Provide at least one video_id", "status_code": 400}]

    ids = video_ids[:50]
    params = {
        "part": "snippet,statistics,contentDetails",
        "id": ",".join(ids),
    }
    data = _get("videos", params)
    if "error" in data:
        return [data]

    results = []
    for item in data.get("items", []):
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content = item.get("contentDetails", {})
        views = _safe_int(stats.get("viewCount"))
        likes = _safe_int(stats.get("likeCount"))
        comments = _safe_int(stats.get("commentCount"))
        engagement_rate = round((likes + comments) / views * 100, 4) if views > 0 else 0.0
        results.append({
            "videoId": item.get("id", ""),
            "title": snippet.get("title", ""),
            "channelTitle": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "duration": _parse_duration(content.get("duration", "")),
            "duration_iso": content.get("duration", ""),
            "viewCount": views,
            "likeCount": likes,
            "commentCount": comments,
            "favoriteCount": _safe_int(stats.get("favoriteCount")),
            "engagement_rate": engagement_rate,
        })

    results.sort(key=lambda x: x["viewCount"], reverse=True)
    return results


@mcp.tool()
def youtube_analyze_channel(channel_id: str) -> dict:
    """
    Composite channel analysis: channel stats + last 10 videos with their
    individual stats + average engagement rate across those videos.

    Args:
        channel_id: The channel's unique ID.

    Returns:
        Dict with channel (title, subscriberCount, viewCount, videoCount),
        recent_videos (list of up to 10 video dicts with stats), and
        avg_engagement_rate (average engagement rate across recent videos).
    """
    # 1. Channel stats
    ch_params = {"part": "snippet,statistics,contentDetails", "id": channel_id}
    ch_data = _get("channels", ch_params)
    if "error" in ch_data:
        return ch_data

    ch_items = ch_data.get("items", [])
    if not ch_items:
        return {"error": "Channel not found", "status_code": 404}

    ch_item = ch_items[0]
    ch_snippet = ch_item.get("snippet", {})
    ch_stats = ch_item.get("statistics", {})
    uploads_playlist = (
        ch_item.get("contentDetails", {})
        .get("relatedPlaylists", {})
        .get("uploads", "")
    )

    channel_info = {
        "channelId": ch_item.get("id", ""),
        "title": ch_snippet.get("title", ""),
        "description": ch_snippet.get("description", ""),
        "customUrl": ch_snippet.get("customUrl", ""),
        "publishedAt": ch_snippet.get("publishedAt", ""),
        "country": ch_snippet.get("country", ""),
        "subscriberCount": _safe_int(ch_stats.get("subscriberCount")),
        "viewCount": _safe_int(ch_stats.get("viewCount")),
        "videoCount": _safe_int(ch_stats.get("videoCount")),
        "hiddenSubscriberCount": ch_stats.get("hiddenSubscriberCount", False),
    }

    if not uploads_playlist:
        return {"channel": channel_info, "recent_videos": [], "avg_engagement_rate": 0.0}

    # 2. Last 10 videos from uploads playlist
    pl_params = {
        "part": "snippet",
        "playlistId": uploads_playlist,
        "maxResults": 10,
    }
    pl_data = _get("playlistItems", pl_params)
    if "error" in pl_data:
        return {"channel": channel_info, "recent_videos": [], "avg_engagement_rate": 0.0,
                "warning": pl_data.get("error")}

    video_ids = [
        item.get("snippet", {}).get("resourceId", {}).get("videoId", "")
        for item in pl_data.get("items", [])
        if item.get("snippet", {}).get("resourceId", {}).get("videoId")
    ]

    if not video_ids:
        return {"channel": channel_info, "recent_videos": [], "avg_engagement_rate": 0.0}

    # 3. Video details with stats
    vid_params = {
        "part": "snippet,statistics,contentDetails",
        "id": ",".join(video_ids),
    }
    vid_data = _get("videos", vid_params)
    if "error" in vid_data:
        return {"channel": channel_info, "recent_videos": [], "avg_engagement_rate": 0.0,
                "warning": vid_data.get("error")}

    recent_videos = []
    engagement_rates = []

    for item in vid_data.get("items", []):
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content = item.get("contentDetails", {})
        views = _safe_int(stats.get("viewCount"))
        likes = _safe_int(stats.get("likeCount"))
        comments = _safe_int(stats.get("commentCount"))
        rate = round((likes + comments) / views * 100, 4) if views > 0 else 0.0
        engagement_rates.append(rate)
        recent_videos.append({
            "videoId": item.get("id", ""),
            "title": snippet.get("title", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "duration": _parse_duration(content.get("duration", "")),
            "duration_iso": content.get("duration", ""),
            "thumbnails": snippet.get("thumbnails", {}),
            "viewCount": views,
            "likeCount": likes,
            "commentCount": comments,
            "engagement_rate": rate,
        })

    avg_engagement = round(sum(engagement_rates) / len(engagement_rates), 4) if engagement_rates else 0.0

    return {
        "channel": channel_info,
        "recent_videos": recent_videos,
        "avg_engagement_rate": avg_engagement,
    }


if __name__ == "__main__":
    mcp.run()
