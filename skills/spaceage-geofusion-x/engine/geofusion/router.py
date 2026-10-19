"""Capability registry + deterministic policy gates + optional TypeSafe Jev for narrow semantic judgments.

Follows Space-Age-Skills/skills/build-partner/references/jev-routing.md: code for known rules, Jev only for bounded semantic
choices over already-gathered state, a confidence floor per action, timeout + bypass, escalation to a frontier model,
and every judgment logged. Jev never authorizes an action on its own.
"""
import json
import os
import re
import time
from dataclasses import dataclass
from urllib.request import Request, urlopen
from .core import now

JEV_URL = 'https://api.typesafe.ai/v1/systemone'
# All Jev questions and thresholds live here so they can be reviewed together (TypeSafe skill guidance).
# Pinned to a versioned model: the floor is tuned against it; switch deliberately, not via the moving `jev-latest` alias.
JEV_MODEL = 'jev-1.13.0'
# Choice: returned confidence. Noul: 2*|p-0.5| (uncertainty proxy, not calibrated) — scales differ, floors are per question.
FLOORS = {'category_relevance': 0.75, 'intent': 0.75, 'source_fit': 0.5}  # below -> escalate to human/frontier review
QUESTIONS = {
    'category_relevance': lambda target: {
        'type': 'choice',
        'instructions': f'Using `business_name` and `maps_categories`, is this business a {target} provider for homeowners or businesses?',
        'criteria': {'relevant': f'Primarily sells or performs {target} services',
                     'adjacent': f'A related trade (e.g. supplier, general contractor, cleaning) that may sometimes do {target} work',
                     'unrelated': f'Not a {target} provider'}},
    # scrape: which record kind the user wants from the source they named (options come from scrape.INTENTS)
    'intent': lambda source, options: {
        'type': 'choice',
        'instructions': f'Using `what` and `where`, which kind of {source} records is the user asking for?',
        'criteria': options},
    # scrape: advisory only — never switches the user's source, only adds a hint to the summary
    'source_fit': lambda source: {
        'type': 'noul',
        'instructions': f'Using `what` and `where`, is {source} a place where these records are likely to be found publicly?'},
}


@dataclass
class Capability:
    name: str
    provider: str
    platforms: list
    operations: list
    auth: str  # none | user_session | api_key
    deployment: str
    unit_cost_usd: float
    latency_s: float
    rate_limit: str
    health: str = 'unknown'  # live | configuration_missing | requires_auth | broken | not_implemented
    restrictions: str = ''
    observed_success: float = None
    output_schema: str = 'canonical business / social item with provenance'


def registry(env=None, social_ready=None, gosom_ok=None, tools=None):
    """Capabilities with health filled from real probes passed in by the caller (never assumed). tools: {probe_name: bool}."""
    env = env if env is not None else os.environ
    social_ready, tools = social_ready or {}, tools or {}
    def th(name, missing='configuration_missing'): return 'live' if tools.get(name) else missing
    def sh(p): return {'supported': 'live'}.get(social_ready.get(p, {}).get('status'), social_ready.get(p, {}).get('status', 'unknown'))
    return [
        Capability('maps.gosom.fast', 'gosom', ['google_maps'], ['search', 'tile'], 'none', 'local binary/docker', 0.0, 8, '1 tile at a time',
                   'live' if gosom_ok else 'configuration_missing', 'Maps ToS: low volume, research use; place-page mode broken in this runtime'),
        Capability('maps.omkar', 'omkarcloud', ['google_maps'], [], 'none', 'n/a', 0.0, 0, '', 'not_implemented', 'upstream has no executable code'),
        Capability('web.static', 'stdlib', ['websites'], ['fetch', 'audit'], 'none', 'local', 0.0, 2, 'per-domain sequential', 'live'),
        Capability('web.browser', 'playwright', ['websites'], ['fetch', 'audit'], 'none', 'local chromium', 0.0, 8, 'per-domain sequential', 'live'),
        Capability('web.lighthouse', 'lighthouse', ['websites'], ['performance_audit'], 'none', 'local CLI', 0.0, 30, '1 at a time', 'unknown'),
        Capability('web.firecrawl', 'firecrawl', ['websites', 'web_search'], ['scrape', 'search', 'crawl', 'fetch'], 'api_key', 'SaaS', 0.001, 5, 'plan limits',
                   'live' if env.get('FIRECRAWL_API_KEY') else 'configuration_missing', 'billable credits'),
        Capability('search.exa', 'agent-reach/exa', ['web_search'], ['search'], 'none', 'hosted MCP', 0.0, 4, 'free tier', th('mcporter', 'unknown')),
        # merged web-scraping skills (Space-Age-Skills/skills/<name>) as page collectors; cheapest live one wins, the rest are fallbacks
        Capability('web.defuddle', 'defuddle', ['websites'], ['fetch'], 'none', 'local CLI', 0.0, 1.5, 'per-domain sequential', th('defuddle'), 'clean markdown = fewest tokens'),
        Capability('web.scrapling', 'scrapling', ['websites'], ['fetch'], 'none', 'local python', 0.0, 4, 'per-domain sequential', th('scrapling')),
        Capability('web.camofox', 'stealth-browser-automation', ['websites'], ['fetch'], 'none', 'localhost:9377', 0.0, 10, 'per-domain sequential', th('camofox'),
                   'only where the site ToS permits automation; no CAPTCHA/login bypass'),
        Capability('web.browserbase', 'browserbase-scraper', ['websites', 'web_search'], ['fetch', 'search'], 'api_key', 'SaaS', 0.002, 6, 'plan limits',
                   'live' if env.get('BROWSERBASE_API_KEY') else 'configuration_missing', 'billable'),
        Capability('web.scrapegraph', 'scrapegraph-ai', ['websites'], ['fetch'], 'api_key', 'local python + LLM', 0.003, 15, 'LLM limits',
                   'live' if tools.get('scrapegraph') and env.get('OPENAI_API_KEY') else 'configuration_missing', 'LLM extraction guided by <what>; billable'),
        Capability('social.youtube', 'agent-reach/yt-dlp', ['youtube'], ['search', 'posts', 'profile'], 'none', 'local CLI', 0.0, 5, 'polite', sh('youtube')),
        *[Capability(f'social.{p}', 'agent-reach', [p], ['profile', 'search', 'posts', 'comments'], 'user_session', 'local CLI', 0.0, 5, 'platform limits', sh(p),
                     'user-authorized session only; no MFA/CAPTCHA bypass') for p in ('x', 'facebook', 'instagram', 'reddit', 'linkedin', 'xiaohongshu')],
        Capability('judge.jev', 'typesafe', ['semantic_choice'], ['choice', 'score', 'noul'], 'api_key', 'SaaS', 0.042e-6, 0.4, '1200 req/min (unstable)',
                   'live' if env.get('TYPESAFE_API_KEY') else 'configuration_missing', 'advisory only; never authorizes actions'),
    ]


def route(job, caps, max_cost_usd=0.0, authorized=False):
    """Deterministic gates first (platform, operation, health, auth, budget), then cheapest/fastest. No model involved."""
    def gate(c):
        if job['platform'] not in c.platforms or job['operation'] not in c.operations: return 'unsupported'
        if c.health != 'live': return c.health
        if c.auth == 'user_session' and not authorized: return 'requires_authorization'
        if c.unit_cost_usd * job.get('units', 1) > max_cost_usd and c.unit_cost_usd > 0: return 'over_budget'
        return ''
    ranked = sorted(caps, key=lambda c: (c.unit_cost_usd, c.latency_s))
    ok = [c for c in ranked if not gate(c)]
    rejected = {c.name: gate(c) for c in ranked if gate(c) and gate(c) != 'unsupported'}
    if not ok:
        return {'selected_capability': None, 'fallback_chain': [], 'rationale': f'no eligible capability; rejected={rejected}', 'estimated_cost': 0.0,
                'confidence': 1.0, 'escalation_required': True}
    return {'selected_capability': ok[0].name, 'fallback_chain': [c.name for c in ok[1:]], 'rationale': f'cheapest live capability passing gates; rejected={rejected}',
            'estimated_cost': ok[0].unit_cost_usd * job.get('units', 1), 'confidence': 1.0, 'escalation_required': False}


class Judge:
    """Our judge() wrapper (swap the vendor in one place). mode: 'baseline' (code only) or 'jev'."""
    def __init__(self, log_path=None, mode=None, floor=None, timeout=4.0, poster=None):
        self.mode = mode or ('jev' if os.environ.get('TYPESAFE_API_KEY') else 'baseline')
        self.floor, self.timeout, self.log_path, self.poster = floor, timeout, log_path, poster or self._post
        self.log = []
    def _post(self, body):
        req = Request(JEV_URL, data=json.dumps(body).encode(), headers={'Authorization': f"Bearer {os.environ['TYPESAFE_API_KEY']}", 'Content-Type': 'application/json'})
        with urlopen(req, timeout=self.timeout) as r: return json.loads(r.read())
    def choice(self, name, state, question, baseline):
        """baseline: the deterministic answer or None when code cannot decide. Returns a logged decision (Choice, Noul or Score)."""
        floor = self.floor if self.floor is not None else FLOORS[name]
        rec = {'judgment': name, 'state': state, 'at': now(), 'baseline': baseline}
        if baseline is not None: rec.update(answer=baseline, by='code', confidence=1.0)
        elif self.mode != 'jev': rec.update(answer=None, by='none', escalate=True, reason='ambiguous for code; Jev disabled -> human/frontier review')
        else:
            t = time.monotonic()
            try:
                resp = self.poster({'state': state, 'model': JEV_MODEL, 'questions': {name: question}})
                a = resp['answers'][name]
                if 'noul' in a: answer, conf = a['noul'], round(2 * abs(a['noul'] - 0.5), 3)
                else: answer, conf = a.get('choice', a.get('score')), a.get('confidence')
                rec.update(answer=answer, by='jev', model=resp.get('model'), confidence=conf, probabilities=a.get('probabilities'), ms=round(1000 * (time.monotonic() - t)))
                if (conf or 0) < floor: rec.update(escalate=True, reason=f'confidence below floor {floor}')
            except Exception as e:  # availability blip: bypass, never block or fail closed
                rec.update(answer=None, by='bypass', escalate=True, reason=f'jev unavailable: {str(e)[:120]}')
        self.log.append(rec)
        if self.log_path:
            with open(self.log_path, 'a', encoding='utf-8') as f: f.write(json.dumps(rec, ensure_ascii=False) + '\n')
        return rec


RELEVANT = re.compile(r'landscap|lawn|garden|turf|sod\b|irrigation|sprinkler|hardscap|tree (service|trimming|removal)|arborist|yard|mowing', re.I)
SUPPLIER = re.compile(r'supply|supplier|wholesale|nursery', re.I)
UNRELATED = re.compile(r'restaurant|dentist|auto|bank|church|school|insurance|real estate|salon|hotel|plumb|roof|hvac', re.I)


def category_relevance(judge, target, name, category):
    """Is a Maps result in the requested category? Code decides clear cases; only the ambiguous rest goes to Jev."""
    text = f'{name} | {category}'
    primary = (category or '').split(';')[0]
    if SUPPLIER.search(primary): base = 'adjacent'  # primary category is a supplier, not a service provider
    else: base = 'relevant' if RELEVANT.search(text) else 'unrelated' if UNRELATED.search(category or '') else None
    return judge.choice('category_relevance', {'business_name': name, 'maps_categories': category}, QUESTIONS['category_relevance'](target), base)
