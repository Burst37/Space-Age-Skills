"""Optional live adapters. Never scrape unsupported sources silently."""
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlparse
from urllib.request import Request,urlopen
from .core import SOCIAL,domain,normalize

class Extractor(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.title='';self._title=False;self.meta={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag=='title':self._title=True
        if tag=='meta' and a.get('content') and (a.get('name') or a.get('property')):
            self.meta[(a.get('name') or a.get('property')).lower()]=a['content']
    def handle_endtag(self,tag):
        if tag=='title':self._title=False
    def handle_data(self,data):
        if self._title:self.title+=data

def discover_site(url,engine='stdlib',timeout=15):
    if not urlparse(url).scheme:url='https://'+url
    if urlparse(url).scheme not in ('https','http'):raise ValueError('Only HTTP(S) URLs are permitted')
    if engine=='scrapling':
        try:from scrapling.fetchers import Fetcher
        except ImportError as e:raise RuntimeError('Scrapling not installed: pip install scrapling') from e
        page=Fetcher.get(url,timeout=timeout)
        html=str(page.html_content if hasattr(page,'html_content') else page.body)
    elif engine=='stdlib':
        request=Request(url,headers={'User-Agent':'GeoFusionX/0.1 (research client)'})
        with urlopen(request,timeout=timeout) as response:
            if 'html' not in response.headers.get('Content-Type','').lower():raise ValueError('URL did not return HTML')
            html=response.read(2_000_000).decode('utf-8','replace')
    else:raise ValueError('Unknown engine')
    parser=Extractor();parser.feed(html)
    links=[urljoin(url,l) for l in parser.links]
    socials=sorted(set(l for l in links if any(domain(l)==s or domain(l).endswith('.'+s) for s in SOCIAL)))
    # Email collection is restricted to explicitly published mailto links.
    emails=sorted(set(l[7:].split('?')[0] for l in parser.links if l.lower().startswith('mailto:')))
    name=parser.meta.get('og:site_name') or parser.title.strip() or domain(url)
    return normalize({'name':name,'website':url,'email':';'.join(emails), 'social_profiles':socials,'source_url':url},source='website')

def gosom_docker(query,output,depth=1,timeout=600):
    """Invoke documented upstream Docker CLI, explicitly opt-in due to live access/cost."""
    if not shutil.which('docker'):raise RuntimeError('Docker not available. Install Docker and pull gosom/google-maps-scraper.')
    out=Path(output).resolve();out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        inp=Path(td)/'queries.txt';inp.write_text(query.strip()+'\n')
        cmd=['docker','run','--rm','-v',f'{inp}:/queries.txt:ro','-v',f'{out.parent}:/out','gosom/google-maps-scraper','-input','/queries.txt','-results',f'/out/{out.name}','-depth',str(depth),'-exit-on-inactivity','3m']
        subprocess.run(cmd,check=True,timeout=timeout)
    if not out.exists():raise RuntimeError('Upstream collector completed without results file')
    return out

def agent_reach_health():
    binary=shutil.which('agent-reach')
    if not binary:return {'installed':False,'detail':'Install Agent Reach and configure channels separately'}
    r=subprocess.run([binary,'doctor'],capture_output=True,text=True,timeout=45)
    return {'installed':True,'exit_code':r.returncode,'diagnostics':(r.stdout+'\n'+r.stderr)[-6000:]}

def firecrawl_site(url):
    """Optional official Firecrawl SDK; key stays in environment, not logs."""
    if not os.environ.get('FIRECRAWL_API_KEY'):raise RuntimeError('FIRECRAWL_API_KEY is required')
    try:from firecrawl import Firecrawl
    except ImportError as e:raise RuntimeError('Install Firecrawl SDK: pip install firecrawl-py') from e
    app=Firecrawl(api_key=os.environ['FIRECRAWL_API_KEY'])
    data=app.scrape(url,formats=['markdown','links'])
    # Tool APIs evolve: accept both object and dict response formats.
    links=data.get('links',[]) if isinstance(data,dict) else getattr(data,'links',[])
    links=links or []
    socials=[l for l in links if any(domain(l)==s or domain(l).endswith('.'+s) for s in SOCIAL)]
    return normalize({'name':domain(url),'website':url,'social_profiles':socials,'source_url':url},source='firecrawl')
