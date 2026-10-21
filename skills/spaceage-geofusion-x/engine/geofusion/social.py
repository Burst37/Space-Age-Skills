"""Social intelligence through Agent Reach (MIT, github.com/Panniantong/Agent-Reach, vendored at Space-Age-Skills/skills/agent-reach).

Agent Reach is the channel manager: `agent-reach doctor --json` decides readiness, and reads go through the backend it
reports (yt-dlp, Jina Reader, Exa via mcporter, ...). Login-backed channels stay `requires_auth` until the user configures
their own session locally; this module never asks for, reads, logs or exports cookies or tokens.
"""
import json
import os
import re
import shutil
import subprocess
import time
from pathlib import Path
from .core import now

STATUSES = ('supported', 'requires_auth', 'policy_blocked', 'configuration_missing', 'broken', 'not_implemented')
LOGIN_CHANNELS = {'twitter', 'reddit', 'facebook', 'instagram', 'linkedin', 'xiaohongshu', 'boss', 'xueqiu'}
ALIASES = {'x': 'twitter', 'google_maps': None, 'websites': 'web'}
# Platforms Agent Reach (1.5.0 @ 94f06c1) has no channel for. Approved paths are noted, not implemented.
NO_CHANNEL = {
    'tiktok': 'no Agent Reach channel; approved path is TikTok Research/Display API (application required)',
    'pinterest': 'no Agent Reach channel; approved path is Pinterest API v5 (app review required)',
    'lemon8': 'no Agent Reach channel and no public API; automation not permitted by available terms',
    'threads': 'no Agent Reach channel; approved path is Meta Threads API (app review required)',
    'discord': 'no Agent Reach channel in doctor output; approved path is a bot added to the server by its admins',
    'telegram': 'no Agent Reach channel in doctor output; approved path is Telegram Bot API for public channels',
}


class SocialUnavailable(RuntimeError):
    def __init__(self, platform, status, detail):
        super().__init__(f'{platform}: {status} — {detail}'); self.platform, self.status, self.detail = platform, status, detail


def doctor(runner=subprocess.run):
    if not shutil.which('agent-reach'): return {}
    r = runner(['agent-reach', 'doctor', '--json'], capture_output=True, text=True, timeout=120)
    try: return json.loads(r.stdout)
    except ValueError: return {}


NOT_INSTALLED = re.compile(r'未安装|未配置|未发现|not installed|not configured', re.I)


def readiness(platforms, report=None):
    """Per-platform truthful status. Selection in onboarding is not support."""
    report = doctor() if report is None else report
    out = {}
    for p in platforms:
        ch = ALIASES.get(p, p)
        if p in NO_CHANNEL: out[p] = {'status': 'policy_blocked' if p == 'lemon8' else 'not_implemented', 'detail': NO_CHANNEL[p]}
        elif ch is None: out[p] = {'status': 'supported', 'detail': 'handled by GoSom Maps collector, not Agent Reach'}
        elif not report: out[p] = {'status': 'configuration_missing', 'detail': 'agent-reach not installed: pip install -e Space-Age-Skills/skills/agent-reach'}
        elif ch not in report: out[p] = {'status': 'not_implemented', 'detail': 'no Agent Reach channel for this platform'}
        else:
            c = report[ch]
            if c.get('status') == 'ok' and c.get('active_backend'): st = 'supported'
            # gap fix: doctor reports a missing backend on login channels as an auth problem; installing comes before logging in
            elif ch in LOGIN_CHANNELS and not NOT_INSTALLED.search(c.get('message') or ''): st = 'requires_auth'
            else: st = 'configuration_missing'
            out[p] = {'status': st, 'backend': c.get('active_backend'), 'detail': (c.get('message') or '')[:300]}
    return out


def _yt(args, timeout=120, runner=subprocess.run):
    r = runner(['yt-dlp', '--js-runtimes', 'node', '-J', '--flat-playlist', *args], capture_output=True, text=True, timeout=timeout)
    if r.returncode: raise SocialUnavailable('youtube', 'broken', r.stderr[-300:])
    return json.loads(r.stdout)


class YouTube:
    """Public YouTube reads via Agent Reach's yt-dlp backend. Stable IDs: video id, channel id."""
    platform = 'youtube'
    def __init__(self, runner=subprocess.run): self.runner = runner
    def _prov(self, cmd): return {'platform': 'youtube', 'backend': 'agent-reach:yt-dlp', 'request': cmd, 'retrieved_at': now()}
    def search(self, query, limit=10):
        d = _yt([f'ytsearch{limit}:{query}'], runner=self.runner)
        return [{'id': e['id'], 'url': f"https://www.youtube.com/watch?v={e['id']}", 'title': e.get('title'), 'channel': e.get('channel'),
                 'channel_id': e.get('channel_id'), 'published': e.get('timestamp') or e.get('upload_date'), 'provenance': self._prov(f'ytsearch{limit}:{query}')} for e in d.get('entries', [])]
    def posts(self, channel_url, limit=10):
        d = _yt(['--playlist-end', str(limit), channel_url.rstrip('/') + '/videos'], runner=self.runner)
        return {'channel': d.get('channel') or d.get('uploader'), 'channel_id': d.get('channel_id'), 'followers': d.get('channel_follower_count'),
                'videos': [{'id': e['id'], 'title': e.get('title'), 'views': e.get('view_count'), 'duration': e.get('duration')} for e in d.get('entries', [])],
                'provenance': self._prov(channel_url)}
    def video(self, video_id):
        r = self.runner(['yt-dlp', '--js-runtimes', 'node', '-J', '--skip-download', f'https://www.youtube.com/watch?v={video_id}'], capture_output=True, text=True, timeout=120)
        if r.returncode: raise SocialUnavailable('youtube', 'broken', r.stderr[-300:])
        d = json.loads(r.stdout)
        return {'id': d['id'], 'title': d.get('title'), 'channel_id': d.get('channel_id'), 'upload_date': d.get('upload_date'), 'views': d.get('view_count'),
                'comments': d.get('comment_count'), 'provenance': self._prov(video_id)}


def adapter(platform, ready):
    """Return a live adapter or raise SocialUnavailable with the truthful status."""
    st = ready.get(platform, {'status': 'not_implemented', 'detail': 'not selected'})
    if st['status'] != 'supported': raise SocialUnavailable(platform, st['status'], st.get('detail', ''))
    if platform == 'youtube': return YouTube()
    raise SocialUnavailable(platform, 'not_implemented', 'Agent Reach backend is live but GeoFusion has no typed reader for it yet')


def exa_search(query, limit=5, config=None, runner=subprocess.run, sleep=time.sleep, backoff=30):
    """Web search through Agent Reach's Exa channel (mcporter + hosted Exa MCP, no key needed for the free tier)."""
    if not shutil.which('mcporter'): raise SocialUnavailable('exa_search', 'configuration_missing', 'npm i -g mcporter && mcporter config add exa https://mcp.exa.ai/mcp')
    cfg = config or os.environ.get('GEOFUSION_MCPORTER_CONFIG') or str(Path.home() / '.geofusion' / 'mcporter.json')
    if not Path(cfg).exists():
        Path(cfg).parent.mkdir(parents=True, exist_ok=True)
        # Optional EXA_API_KEY lifts the free-tier limit; it stays in the local config file and is never logged.
        url = 'https://mcp.exa.ai/mcp' + (f"?exaApiKey={os.environ['EXA_API_KEY']}" if os.environ.get('EXA_API_KEY') else '')
        runner(['mcporter', '--config', cfg, 'config', 'add', 'exa', url], capture_output=True, text=True, timeout=60)
    for attempt in range(3):
        r = runner(['mcporter', '--config', cfg, 'call', 'exa.web_search_exa', f'query={query}', f'numResults={limit}'], capture_output=True, text=True, timeout=90)
        if 'rate limit' not in (r.stdout + r.stderr).lower(): break
        if attempt < 2: sleep(backoff * (attempt + 1))
    else: raise SocialUnavailable('exa_search', 'rate_limited', 'Exa free MCP tier rate limit; set EXA_API_KEY for higher limits')
    if r.returncode: raise SocialUnavailable('exa_search', 'broken', (r.stderr or r.stdout)[-300:])
    hits = []
    for block in re.split(r'\n(?=Title: )', r.stdout):
        t = re.search(r'^Title: (.*)$', block, re.M); u = re.search(r'^URL: (\S+)', block, re.M)
        if u: hits.append({'title': t.group(1).strip() if t else '', 'url': u.group(1), 'text': block[:4000]})
    return {'query': query, 'results': hits, 'provenance': {'backend': 'agent-reach:exa(mcporter)', 'retrieved_at': now()}}


def norm_name(s): return re.sub(r'\b(llc|inc|co|company|the|and|services?)\b|[^a-z0-9 ]', '', (s or '').lower()).split()


def youtube_match(yt, name, city):
    """Attribute a channel only when all name tokens appear in the channel name. Otherwise report no match."""
    want = set(norm_name(name))
    if not want: return None, []
    hits = yt.search(f'{name} {city}', 5)
    for h in hits:
        if want <= set(norm_name(h.get('channel'))): return h, hits
    return None, hits
