"""Website intelligence: static fetch -> browser escalation, multi-page sampling, audit signals, real Lighthouse.

Every signal is measured from fetched HTML; anything not fetched or not run is reported as not measured.
"""
import ipaddress
import json
import os
import re
import shutil
import socket
import subprocess
import tempfile
import time
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener, urlopen
from .core import SOCIAL, domain, now

UA = 'Mozilla/5.0 (compatible; GeoFusionX/0.5; +research audit)'
BUILDER_HOSTS = ('sites.google.com', 'square.site', 'wixsite.com', 'godaddysites.com', 'business.site', 'weebly.com',
                 'webflow.io', 'carrd.co', 'mystrikingly.com', 'jimdosite.com', 'wordpress.com')
THIRD_PARTY_HOSTS = ('squareup.com', 'lawnstarter.com', 'yelp.com', 'nextdoor.com', 'homeadvisor.com', 'angi.com', 'thumbtack.com',
                     'facebook.com', 'instagram.com', 'linktr.ee', 'yourgreenpal.com', 'greenpal.com', 'housecallpro.com', 'jobber.com', 'google.com')
CTA = re.compile(r'\b(free (quote|estimate)|get (a )?(quote|estimate)|request (a )?(quote|estimate)|book (now|online|a)|schedule (now|service|a|an|online)|contact us|call (us|now|today))\b', re.I)
BOOKING = re.compile(r'calendly|housecallpro|getjobber|jobber\.com|squareup\.com/appointments|setmore|acuityscheduling|booking|schedule online', re.I)
CHAT = re.compile(r'tawk\.to|intercom|drift\.com|podium|birdeye|livechat|crisp\.chat|tidio|hubspot.*conversations|messenger', re.I)
TESTIMONIAL = re.compile(r'testimonial|reviews?|what (our )?(customers|clients) say|★|5[- ]star', re.I)
SERVICE = re.compile(r'\b(lawn (care|mowing|service)|mowing|landscap\w*|irrigation|sprinkler|sod|tree (trimming|removal|service)|hardscap\w*|mulch|edging|fertiliz\w*|weed control|aeration|drainage|patio|retaining wall|flower beds?|leaf removal)\b', re.I)
AI_BOTS = ('GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot')


class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.title = ''; self.meta = {}; self.h1 = []; self.jsonld = []; self.text = []
        self.imgs = 0; self.imgs_no_alt = 0; self.forms = 0; self.lang = ''; self.canonical = ''; self.scripts = []
        self._depth = {'title': 0, 'h1': 0, 'script': 0, 'style': 0, 'noscript': 0}; self._in_ld = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self._depth: self._depth[tag] += 1
        if tag == 'h1': self.h1.append('')
        if tag == 'html': self.lang = a.get('lang') or ''
        elif tag == 'a' and a.get('href'): self.links.append(a['href'])
        elif tag == 'meta' and a.get('content') is not None and (a.get('name') or a.get('property')): self.meta[(a.get('name') or a.get('property')).lower()] = a['content']
        elif tag == 'link' and 'canonical' in (a.get('rel') or '').lower(): self.canonical = a.get('href') or ''
        elif tag == 'img': self.imgs += 1; self.imgs_no_alt += not (a.get('alt') or '').strip()
        elif tag == 'form': self.forms += 1
        elif tag in ('script', 'iframe') and a.get('src'): self.scripts.append(a['src'])
        if tag == 'script' and 'ld+json' in (a.get('type') or ''): self.jsonld.append(''); self._in_ld = True
    def handle_endtag(self, tag):
        if tag in self._depth and self._depth[tag]: self._depth[tag] -= 1
        if tag == 'script': self._in_ld = False
    def handle_data(self, data):
        d = self._depth
        if self._in_ld: self.jsonld[-1] += data
        elif d['script'] or d['style'] or d['noscript']: return
        elif d['title']: self.title += data
        else:
            if d['h1'] and self.h1: self.h1[-1] = (self.h1[-1] + ' ' + data.strip()).strip()
            if data.strip(): self.text.append(data.strip())
    def schema_types(self):
        types = set()
        def walk(x):
            if isinstance(x, dict):
                t = x.get('@type'); types.update(t if isinstance(t, list) else [t] if t else []); [walk(v) for v in x.values()]
            elif isinstance(x, list): [walk(v) for v in x]
        for block in self.jsonld:
            try: walk(json.loads(block))
            except ValueError: pass
        return sorted(map(str, types))


def safe_url(url):
    """Trust boundary: Maps-supplied URLs are external input. Allow only public HTTP(S) hosts."""
    if '://' not in url: url = 'https://' + url
    p = urlparse(url)
    if p.scheme not in ('http', 'https') or not p.hostname: raise ValueError('only http(s) URLs are allowed')
    for info in socket.getaddrinfo(p.hostname, None):
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved: raise ValueError(f'non-public address for {p.hostname}')
    return url


class _SafeRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        safe_url(newurl)  # revalidate each hop: a public URL must not redirect into private/link-local space
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch_static(url, timeout=20):
    started = time.monotonic()
    with build_opener(_SafeRedirect).open(Request(safe_url(url), headers={'User-Agent': UA}), timeout=timeout) as r:
        body = r.read(3_000_000).decode('utf-8', 'replace')
        return {'final_url': r.geturl(), 'status': r.status, 'content_type': r.headers.get('Content-Type', ''), 'html': body,
                'seconds': round(time.monotonic() - started, 2), 'mode': 'static'}


def fetch_rendered(url, timeout=45):
    """Browser escalation for JS-built pages (Playwright Chromium)."""
    from playwright.sync_api import sync_playwright
    started = time.monotonic()
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(user_agent=UA)
        def guard(route):  # same trust boundary for every navigation/redirect/subresource
            try: safe_url(route.request.url)
            except ValueError: return route.abort()
            route.continue_()
        pg.route('**/*', guard)
        resp = pg.goto(safe_url(url), wait_until='networkidle', timeout=timeout * 1000)
        html, final = pg.content(), pg.url; b.close()
    return {'final_url': final, 'status': resp.status if resp else 0, 'content_type': 'text/html', 'html': html,
            'seconds': round(time.monotonic() - started, 2), 'mode': 'rendered'}


def parse(html):
    p = Page(); p.feed(html); return p


def needs_js(page):
    return len(' '.join(page.text).split()) < 120


def fetch(url, allow_browser=True):
    """Static first; escalate to a real browser when the page is a JS shell or static fetch fails."""
    try:
        res = fetch_static(url); page = parse(res['html'])
        if allow_browser and needs_js(page):
            try: res = fetch_rendered(url); page = parse(res['html'])
            except Exception as e: res['escalation_error'] = str(e)[:200]
        return res, page
    except Exception as e:
        if not allow_browser: raise
        res = fetch_rendered(url); res['static_error'] = str(e)[:200]
        return res, parse(res['html'])


def site_kind(url):
    host = domain(url)
    if any(host == h or host.endswith('.' + h) for h in BUILDER_HOSTS): return 'builder_subdomain'
    if any(host == h or host.endswith('.' + h) for h in THIRD_PARTY_HOSTS): return 'third_party_page'
    return 'owned_domain'


def digits(s): return re.sub(r'\D', '', s or '')[-10:]


def signals(page, url, maps_phone='', city='', street=''):
    links = [urljoin(url, l) for l in page.links]
    text = ' '.join(page.text); blob = text + ' ' + ' '.join(page.scripts)
    tels = [l for l in page.links if l.lower().startswith('tel:')]
    phone = digits(maps_phone)
    return {
        'title': page.title.strip()[:200], 'meta_description': page.meta.get('description', '')[:300], 'h1_count': len([h for h in page.h1 if h]),
        'viewport': 'width=device-width' in page.meta.get('viewport', ''), 'canonical': bool(page.canonical), 'lang': page.lang,
        'robots_noindex': 'noindex' in page.meta.get('robots', '').lower(), 'schema_types': page.schema_types(),
        'og_tags': sorted(k for k in page.meta if k.startswith('og:')), 'images': page.imgs, 'images_missing_alt': page.imgs_no_alt,
        'forms': page.forms, 'tel_links': len(tels), 'mailto_links': len([l for l in page.links if l.lower().startswith('mailto:')]),
        'cta_phrases': sorted({m.group(0).lower() for m in CTA.finditer(text)})[:10], 'booking_widget': bool(BOOKING.search(blob)),
        'chat_widget': bool(CHAT.search(blob)), 'testimonials': bool(TESTIMONIAL.search(text)), 'faq': 'FAQPage' in page.schema_types() or bool(re.search(r'\bFAQs?\b|frequently asked', text, re.I)),
        'services_mentioned': sorted({m.group(0).lower() for m in SERVICE.finditer(text)})[:20], 'city_mentioned': bool(city) and city.lower() in text.lower(),
        'phone_on_page': bool(phone) and (phone in digits(text) or any(phone in digits(t) for t in tels) or phone in re.sub(r'\D', '', text)),
        'address_on_page': bool(street) and re.sub(r'\W+', ' ', street.lower()).strip() in re.sub(r'\W+', ' ', text.lower()),
        'word_count': len(text.split()), 'copyright_years': sorted({int(y) for y in re.findall(r'(?:©|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d\d)', text, re.I)}),
        'social_links': sorted({l for l in links if any(domain(l) == s or domain(l).endswith('.' + s) for s in SOCIAL)}),
        'internal_links': sorted({l.split('#')[0] for l in links if domain(l) == domain(url)})[:200],
    }


def site_files(url, timeout=10):
    """robots.txt (AI crawler access), sitemap.xml, llms.txt — each fetched, never assumed."""
    base = f'{urlparse(url).scheme}://{urlparse(url).netloc}'
    out = {}
    for name in ('robots.txt', 'sitemap.xml', 'llms.txt'):
        try:
            r = fetch_static(f'{base}/{name}', timeout)
            out[name] = r['status'] == 200 and 'html' not in r['content_type']
            if name == 'robots.txt' and out[name]: out['robots_body'] = r['html'][:5000]
        except Exception as e: out[name] = False; out[name + '_error'] = str(e)[:120]
    body = out.pop('robots_body', '')
    blocked = [bot for bot in AI_BOTS if re.search(rf'User-agent:\s*{re.escape(bot)}\s*\n(?:[^\n]*\n)*?\s*Disallow:\s*/\s*$', body, re.I | re.M)]
    if re.search(r'User-agent:\s*\*\s*\n(?:[^\n]*\n)*?\s*Disallow:\s*/\s*$', body, re.I | re.M): blocked = list(AI_BOTS)
    out['ai_crawlers_blocked'] = blocked
    return out


PRIORITY = re.compile(r'contact|service|about|faq|quote|estimate|area|location', re.I)


def lighthouse(url, preset='mobile', timeout=180):
    """Run the real Lighthouse CLI. Returns {'not_measured_reason': ...} when it cannot run."""
    lh = os.environ.get('GEOFUSION_LIGHTHOUSE') or shutil.which('lighthouse')
    if not lh: return {'not_measured_reason': 'lighthouse CLI not installed (npm i -g lighthouse@12.8.2)'}
    with tempfile.TemporaryDirectory() as td:
        out = os.path.join(td, 'lh.json')
        cmd = [lh, url, '--quiet', '--output=json', f'--output-path={out}', '--chrome-flags=--headless=new --no-sandbox',
               '--only-categories=performance,accessibility,best-practices,seo'] + (['--preset=desktop'] if preset == 'desktop' else [])
        env = {**os.environ, 'CHROME_PATH': os.environ.get('CHROME_PATH') or chrome_path()}
        try: subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=env)
        except subprocess.TimeoutExpired: return {'not_measured_reason': f'lighthouse timed out after {timeout}s'}
        if not os.path.exists(out): return {'not_measured_reason': 'lighthouse produced no report'}
        d = json.load(open(out))
    if d.get('runtimeError'): return {'not_measured_reason': f"lighthouse runtime error: {d['runtimeError'].get('code')}"}
    a = d['audits']
    return {'preset': preset, 'lighthouse_version': d['lighthouseVersion'], 'fetched_at': d['fetchTime'], 'final_url': d.get('finalDisplayedUrl') or d.get('finalUrl'),
            'scores': {k: v['score'] for k, v in d['categories'].items()},
            'metrics': {m: a[m].get('numericValue') for m in ('largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'first-contentful-paint', 'speed-index') if m in a}}


def chrome_path():
    for p in ('/opt/pw-browsers/chromium-1194/chrome-linux/chrome', shutil.which('chromium') or '', shutil.which('google-chrome') or ''):
        if p and os.path.exists(p): return p
    return ''


def audit_site(url, maps_phone='', city='', street='', max_pages=4, run_lighthouse=True):
    """Audit homepage plus up to max_pages-1 priority internal pages. Returns evidence-rich, timestamped results."""
    started = now(); pages = []
    res, page = fetch(url)
    if not 200 <= (res['status'] or 0) < 400: raise RuntimeError(f"homepage returned HTTP {res['status']}; not auditing an error page")
    home = signals(page, res['final_url'], maps_phone, city, street)
    pages.append({'url': res['final_url'], 'mode': res['mode'], 'status': res['status'], 'seconds': res['seconds'], **{k: res[k] for k in ('static_error', 'escalation_error') if k in res}})
    agg = dict(home)
    for link in [l for l in home['internal_links'] if PRIORITY.search(urlparse(l).path)][:max_pages - 1]:
        try:
            r, pg = fetch(link)
            s = signals(pg, r['final_url'], maps_phone, city, street)
            pages.append({'url': r['final_url'], 'mode': r['mode'], 'status': r['status'], 'seconds': r['seconds']})
            for k in ('forms', 'tel_links', 'mailto_links', 'word_count'): agg[k] += s[k]
            for k in ('booking_widget', 'chat_widget', 'testimonials', 'faq', 'city_mentioned', 'phone_on_page', 'address_on_page'): agg[k] = agg[k] or s[k]
            for k in ('schema_types', 'cta_phrases', 'services_mentioned', 'social_links'): agg[k] = sorted(set(agg[k]) | set(s[k]))
        except Exception as e:
            pages.append({'url': link, 'error': str(e)[:200]})
    agg.pop('internal_links')
    agg['about_page'] = any('about' in urlparse(p['url']).path.lower() for p in pages if 'error' not in p) or any('about' in urlparse(l).path.lower() for l in home['internal_links'])
    agg['service_area_page'] = any(re.search(r'area|location|serv(e|ing)', urlparse(l).path, re.I) for l in home['internal_links'])
    agg['https'] = res['final_url'].startswith('https://')
    files = site_files(res['final_url'])
    lh = {p: lighthouse(res['final_url'], p) if run_lighthouse else {'not_measured_reason': 'lighthouse disabled for this run'} for p in ('mobile', 'desktop')}
    return {'url': url, 'final_url': res['final_url'], 'site_kind': site_kind(res['final_url']), 'audited_at': started, 'pages': pages,
            'signals': agg, 'files': files, 'lighthouse': lh, 'method': 'static fetch with Playwright escalation; HTML parse; Lighthouse CLI'}
