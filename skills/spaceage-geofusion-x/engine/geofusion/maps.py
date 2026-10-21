"""Google Maps collection via the GoSom collector (MIT, github.com/gosom/google-maps-scraper).

GoSom is run as an external binary (built from the pinned commit) or its Docker image; no GoSom code is copied.
Verified 2026-10-18: GoSom's place-page path returned all-empty records in this runtime, so fast mode (search API
payload) is the default. Fast mode returns at most ~20 places per search, which is why the area is tiled.
"""
import hashlib
import json
import math
import os
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from .core import now

GOSOM_COMMIT = 'd0b51bcf3cd56d9a3f71e049cb6e226554e24162'
SOURCE = 'google_maps_gosom'
OMKAR_STATUS = {'provider': 'omkarcloud/google-maps-scraper', 'status': 'not_implemented',
                'reason': 'Upstream repo (commit 828f6d9) ships docs and screenshots only; no executable collector to integrate.'}


def gosom_command():
    """Return the command prefix for the GoSom collector, or raise with install steps."""
    binary = os.environ.get('GEOFUSION_GOSOM_BIN') or shutil.which('google-maps-scraper') or shutil.which('gmaps-scraper')
    if binary: return [binary]
    if shutil.which('docker'): return ['docker', 'run', '--rm', '-v', f'{tempfile.gettempdir()}:{tempfile.gettempdir()}', 'gosom/google-maps-scraper']
    raise RuntimeError(f'GoSom not found. Build it: git clone https://github.com/gosom/google-maps-scraper && git -C google-maps-scraper checkout {GOSOM_COMMIT} '
                       '&& (cd google-maps-scraper && go build -o gmaps-scraper .) then set GEOFUSION_GOSOM_BIN.')


def tiles(bbox, rows, cols):
    """Split 'minLat,minLon,maxLat,maxLon' into rows x cols cell centers plus a radius (m) covering each cell."""
    lat0, lon0, lat1, lon1 = bbox
    if not (lat0 < lat1 and lon0 < lon1) or rows < 1 or cols < 1: raise ValueError('bbox must be minLat,minLon,maxLat,maxLon with rows/cols >= 1')
    dlat, dlon = (lat1 - lat0) / rows, (lon1 - lon0) / cols
    h = dlat * 111_320; w = dlon * 111_320 * math.cos(math.radians((lat0 + lat1) / 2))
    radius = int(math.hypot(h, w) / 2) + 1
    return [(round(lat0 + dlat * (r + .5), 6), round(lon0 + dlon * (c + .5), 6)) for r in range(rows) for c in range(cols)], radius


def place_url(raw):
    return raw.get('link') or (f"https://www.google.com/maps/place/data=!4m2!3m1!1s{raw['data_id']}" if raw.get('data_id') else '')


def parse_results(text):
    """GoSom writes one JSON array per query in fast mode (one per line) and JSON objects per line otherwise."""
    out = []
    for line in text.splitlines():
        if not line.strip(): continue
        item = json.loads(line)
        out.extend(item if isinstance(item, list) else [item])
    return out


def run_tile(queries, geo, radius, raw_dir, zoom=14, timeout=240, runner=subprocess.run):
    """Run GoSom fast mode for one tile; keep the raw output file immutable for provenance."""
    raw_dir = Path(raw_dir); raw_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        qfile = Path(td) / 'queries.txt'; qfile.write_text('\n'.join(queries) + '\n')
        out = Path(td) / 'results.json'
        cmd = gosom_command() + ['-input', str(qfile), '-results', str(out), '-json', '-fast-mode', '-geo', f'{geo[0]},{geo[1]}',
                                 '-zoom', str(zoom), '-radius', str(radius), '-depth', '1', '-c', '2', '-exit-on-inactivity', '1m']
        started = time.monotonic()
        proc = runner(cmd, capture_output=True, text=True, timeout=timeout)
        text = out.read_text() if out.exists() else ''
    if proc.returncode != 0 and not text: raise RuntimeError(f'GoSom exit {proc.returncode}: {proc.stderr[-400:]}')
    digest = hashlib.sha256(text.encode()).hexdigest()
    raw_path = raw_dir / f'gosom_{geo[0]}_{geo[1]}_{digest[:12]}.json'
    if not raw_path.exists(): raw_path.write_text(text)
    return parse_results(text), {'raw_file': str(raw_path), 'raw_sha256': digest, 'seconds': round(time.monotonic() - started, 2)}


def to_record(raw, query_set, geo, meta):
    rec = dict(raw)
    rec['source'] = SOURCE
    rec['source_url'] = place_url(raw)
    rec['provenance'] = {'collector': f'gosom@{GOSOM_COMMIT[:7]}', 'mode': 'fast', 'tile': list(geo), 'queries': query_set,
                         'retrieved_at': now(), 'raw_file': meta['raw_file'], 'raw_sha256': meta['raw_sha256']}
    for k in ('user_reviews', 'user_reviews_extended', 'images', 'popular_times'): rec.pop(k, None)  # bulky; kept in raw file
    return rec


def collect(store, job_id, queries, bbox, rows, cols, raw_dir, zoom=14, max_failures=3, runner=subprocess.run):
    """Collect every tile once; resume skips tiles already done. Returns per-tile receipts."""
    centers, radius = tiles(bbox, rows, cols)
    receipts, failures_in_row = [], 0
    for geo in centers:
        key = f'{geo[0]},{geo[1]}'
        status, payload = store.checkpoint(job_id, 'maps', key)
        if status == 'done':
            receipts.append({'tile': key, 'status': 'skipped_resume', **payload}); continue
        if failures_in_row >= max_failures:  # circuit breaker: stop hammering a failing provider
            store.checkpoint(job_id, 'maps', key, 'blocked', {'error': 'circuit_open'})
            receipts.append({'tile': key, 'status': 'blocked', 'error': 'circuit_open'}); continue
        try:
            results, meta = run_tile(queries, geo, radius, raw_dir, zoom, runner=runner)
            ids = {store.upsert(to_record(r, queries, geo, meta), job_id) for r in results if r.get('title')}
            payload = {**meta, 'places': len(results), 'unique_ids': len(ids)}
            store.checkpoint(job_id, 'maps', key, 'done', payload); failures_in_row = 0
            receipts.append({'tile': key, 'status': 'done', **payload})
        except (RuntimeError, subprocess.TimeoutExpired, ValueError) as e:
            failures_in_row += 1
            store.checkpoint(job_id, 'maps', key, 'failed', {'error': str(e)[:400]})
            receipts.append({'tile': key, 'status': 'failed', 'error': str(e)[:400]})
    return receipts
