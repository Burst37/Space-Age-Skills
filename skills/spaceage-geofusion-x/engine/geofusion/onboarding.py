"""Local onboarding configuration for GeoFusion X. No credentials stored."""
import json
import re
from pathlib import Path

# Searchable cross-platform target registry. Registry membership does NOT imply connector support.
PLATFORM_CATEGORIES = {'Maps and local discovery': ['google_maps', 'apple_maps', 'bing_maps', 'openstreetmap', 'yelp', 'tripadvisor', 'foursquare', 'mapquest', 'nextdoor', 'yellow_pages'], 'Mainstream social': ['instagram', 'facebook', 'x', 'tiktok', 'linkedin', 'pinterest', 'lemon8', 'threads', 'snapchat', 'reddit', 'youtube', 'tumblr', 'bluesky', 'mastodon', 'truth_social', 'mewe'], 'Communities and discussion': ['discord', 'telegram', 'whatsapp_channels', 'slack_public', 'quora', 'stack_exchange', 'v2ex', 'hacker_news'], 'Video, creators and streaming': ['twitch', 'kick', 'vimeo', 'dailymotion', 'bilibili', 'douyin', 'kuaishou', 'rumble', 'likee'], 'Visual, lifestyle and regional': ['xiaohongshu', 'weibo', 'wechat_public', 'line_voom', 'vk', 'odnoklassniki', 'bereal', 'pixelfed'], 'Listings and marketplaces': ['google_business_profile', 'bing_places', 'etsy', 'ebay', 'amazon_public', 'trustpilot', 'bbb', 'glassdoor', 'indeed', 'eventbrite'], 'Web and publishing': ['websites', 'rss', 'substack', 'medium', 'wordpress', 'github', 'gitlab', 'product_hunt', 'news_sites', 'forums']}
PLATFORMS = ['google_maps', 'apple_maps', 'bing_maps', 'openstreetmap', 'yelp', 'tripadvisor', 'foursquare', 'mapquest', 'nextdoor', 'yellow_pages', 'instagram', 'facebook', 'x', 'tiktok', 'linkedin', 'pinterest', 'lemon8', 'threads', 'snapchat', 'reddit', 'youtube', 'tumblr', 'bluesky', 'mastodon', 'truth_social', 'mewe', 'discord', 'telegram', 'whatsapp_channels', 'slack_public', 'quora', 'stack_exchange', 'v2ex', 'hacker_news', 'twitch', 'kick', 'vimeo', 'dailymotion', 'bilibili', 'douyin', 'kuaishou', 'rumble', 'likee', 'xiaohongshu', 'weibo', 'wechat_public', 'line_voom', 'vk', 'odnoklassniki', 'bereal', 'pixelfed', 'google_business_profile', 'bing_places', 'etsy', 'ebay', 'amazon_public', 'trustpilot', 'bbb', 'glassdoor', 'indeed', 'eventbrite', 'websites', 'rss', 'substack', 'medium', 'wordpress', 'github', 'gitlab', 'product_hunt', 'news_sites', 'forums']
PLATFORM_READINESS = {'google_maps': 'partial_adapter_available', 'apple_maps': 'requires_connector_validation', 'bing_maps': 'requires_connector_validation', 'openstreetmap': 'requires_connector_validation', 'yelp': 'requires_connector_validation', 'tripadvisor': 'requires_connector_validation', 'foursquare': 'requires_connector_validation', 'mapquest': 'requires_connector_validation', 'nextdoor': 'requires_connector_validation', 'yellow_pages': 'requires_connector_validation', 'instagram': 'agent_reach_channel_documented_not_wired', 'facebook': 'agent_reach_channel_documented_not_wired', 'x': 'agent_reach_channel_documented_not_wired', 'tiktok': 'planned_connector_not_wired', 'linkedin': 'agent_reach_channel_documented_not_wired', 'pinterest': 'planned_connector_not_wired', 'lemon8': 'planned_connector_not_wired', 'threads': 'planned_connector_not_wired', 'snapchat': 'planned_connector_not_wired', 'reddit': 'agent_reach_channel_documented_not_wired', 'youtube': 'agent_reach_channel_documented_not_wired', 'tumblr': 'requires_connector_validation', 'bluesky': 'requires_connector_validation', 'mastodon': 'requires_connector_validation', 'truth_social': 'requires_connector_validation', 'mewe': 'requires_connector_validation', 'discord': 'planned_connector_not_wired', 'telegram': 'planned_connector_not_wired', 'whatsapp_channels': 'requires_connector_validation', 'slack_public': 'requires_connector_validation', 'quora': 'requires_connector_validation', 'stack_exchange': 'requires_connector_validation', 'v2ex': 'agent_reach_channel_documented_not_wired', 'hacker_news': 'requires_connector_validation', 'twitch': 'requires_connector_validation', 'kick': 'requires_connector_validation', 'vimeo': 'requires_connector_validation', 'dailymotion': 'requires_connector_validation', 'bilibili': 'agent_reach_channel_documented_not_wired', 'douyin': 'requires_connector_validation', 'kuaishou': 'requires_connector_validation', 'rumble': 'requires_connector_validation', 'likee': 'requires_connector_validation', 'xiaohongshu': 'agent_reach_channel_documented_not_wired', 'weibo': 'requires_connector_validation', 'wechat_public': 'requires_connector_validation', 'line_voom': 'requires_connector_validation', 'vk': 'requires_connector_validation', 'odnoklassniki': 'requires_connector_validation', 'bereal': 'requires_connector_validation', 'pixelfed': 'requires_connector_validation', 'google_business_profile': 'requires_connector_validation', 'bing_places': 'requires_connector_validation', 'etsy': 'requires_connector_validation', 'ebay': 'requires_connector_validation', 'amazon_public': 'requires_connector_validation', 'trustpilot': 'requires_connector_validation', 'bbb': 'requires_connector_validation', 'glassdoor': 'requires_connector_validation', 'indeed': 'requires_connector_validation', 'eventbrite': 'requires_connector_validation', 'websites': 'partial_adapter_available', 'rss': 'agent_reach_channel_documented_not_wired', 'substack': 'requires_connector_validation', 'medium': 'requires_connector_validation', 'wordpress': 'requires_connector_validation', 'github': 'agent_reach_channel_documented_not_wired', 'gitlab': 'requires_connector_validation', 'product_hunt': 'requires_connector_validation', 'news_sites': 'requires_connector_validation', 'forums': 'requires_connector_validation'}

OUTPUTS = ['csv','json','jsonl']
OBJECTIVES = ['business','social','competitive','reviews','contacts','general']
ACCESS_METHODS = ['public','authorized_session','approved_api','existing_export']


def parse_csv(value, allowed=None):
    values = [v.strip().lower() for v in value.split(',') if v.strip()]
    if allowed and any(v not in allowed and not (v.startswith('custom:') and re.fullmatch(r'custom:[a-z0-9][a-z0-9_-]{{1,63}}',v)) for v in values):
        raise ValueError('Unknown platform: choose a catalog entry or custom:<platform-name>')
    return list(dict.fromkeys(values))


def make_config(goal, platforms, location='', fields=None, access='public', max_records=100,
                max_minutes=30, max_cost_usd=0.0, output='csv', authorization=False):
    if not goal.strip():
        raise ValueError('A research objective is required')
    if not platforms:
        raise ValueError('At least one platform is required')
    if any(p not in PLATFORMS and not (isinstance(p,str) and re.fullmatch(r'custom:[a-z0-9][a-z0-9_-]{1,63}',p)) for p in platforms):
        raise ValueError('Unknown platform; use custom:<name> for additional services')
    methods = parse_csv(access) if isinstance(access,str) else list(access)
    if not methods or not set(methods).issubset(ACCESS_METHODS):
        raise ValueError('Invalid access method')
    if set(methods).intersection(('authorized_session','approved_api')) and not authorization:
        raise ValueError('Confirm platform-specific authorization before selecting authenticated access')
    if max_records < 1 or max_minutes < 1 or max_cost_usd < 0:
        raise ValueError('Records/minutes must be positive; budget cannot be negative')
    if output not in OUTPUTS:
        raise ValueError('Invalid export format')
    goals = parse_csv(goal) if isinstance(goal,str) else list(goal)
    if not goals or not set(goals).issubset(OBJECTIVES):
        raise ValueError('Invalid research objectives')
    return {'schema_version':2,'goals':goals,'platforms':platforms,'location_or_scope':location.strip(),
            'fields':fields or ['business_name','address','phone','website','social_profiles'],
            'access_methods':methods,'authorization_confirmed':bool(authorization),
            'limits':{'max_records':max_records,'max_minutes':max_minutes,'max_cost_usd':max_cost_usd},
            'output_format':output,'platform_readiness':{platform: PLATFORM_READINESS.get(platform,'needs_custom_connector') for platform in platforms},'phase':'configured_not_executed'}


def questionnaire(input_fn=input, output_fn=print):
    output_fn('GeoFusion X onboarding — configuration only; no scraping will start.')
    ask=lambda text, default='': (input_fn(f'{text} [{default}]: ').strip() or default)
    goal=ask('Research objectives (comma separated: business,social,competitive,reviews,contacts,general)','business')
    output_fn('Platforms by category (select any number; use custom:<name> for more):')
    for category, choices in PLATFORM_CATEGORIES.items():
        output_fn('  '+category+': '+', '.join(choices))
    platforms=parse_csv(ask('Platforms (comma separated)', 'google_maps,websites'),PLATFORMS)
    scope=ask('Geographic area, search scope, or target URLs', '')
    fields=parse_csv(ask('Requested data fields (comma separated)', 'business_name,address,phone,website,social_profiles'))
    access=parse_csv(ask('Access methods (comma separated: public,authorized_session,approved_api,existing_export)','public'),ACCESS_METHODS)
    authorized=False
    if set(access).intersection(('authorized_session','approved_api')):
        authorized=ask('Confirm you have permission for automated collection under applicable platform rules (yes/no)','no').lower()=='yes'
    count=int(ask('Maximum records','100'))
    minutes=int(ask('Maximum runtime (minutes)','30'))
    cost=float(ask('Maximum external API spend in USD','0'))
    fmt=ask('Output (csv/json/jsonl)','csv').lower()
    return make_config(goal,platforms,scope,fields,access,count,minutes,cost,fmt,authorized)


def save_config(config,path,overwrite=False):
    target=Path(path)
    if target.exists() and not overwrite:
        raise FileExistsError(f'{target} exists; pass --force to overwrite')
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(config,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    return str(target)
