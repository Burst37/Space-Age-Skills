"""GeoFusion X: durable, source-aware business intelligence storage."""
import csv
import hashlib
import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

SOCIAL = ('instagram.com','facebook.com','linkedin.com','tiktok.com','youtube.com','x.com','twitter.com','pinterest.com','threads.net')
FIELDS = ('source','source_id','name','category','address','city','state','postal_code','phone','website','latitude','longitude','rating','review_count','email','social_profiles','source_url','collected_at')

def now(): return datetime.now(timezone.utc).isoformat()
def clean(x): return str(x or '').strip()
def domain(url):
    if not url: return ''
    p=urlparse(url if '://' in url else 'https://'+url)
    return (p.hostname or '').lower().removeprefix('www.')
def normalize(raw, source='import'):
    """Normalize common gosom/third-party CSV headers without inventing fields."""
    aliases={'name':['name','title','business_name'], 'source_id':['source_id','place_id','data_id','cid'],
      'category':['category','type','main_category'], 'address':['address','complete_address','full_address'],
      'city':['city','town'],'state':['state','province'],'postal_code':['postal_code','zip','zip_code'],
      'phone':['phone','phone_number','international_phone_number'], 'website':['website','web_site','site'],
      'latitude':['latitude','lat'], 'longitude':['longitude','longtitude','lng','lon'], 'rating':['rating','review_rating'],
      'review_count':['review_count','reviews','reviews_count','total_reviews'],
      'email':['email','emails'], 'source_url':['source_url','link','url','google_maps_url'],
      'social_profiles':['social_profiles','social_links']}
    row={str(k).lower().strip().replace(' ','_'):v for k,v in raw.items() if k is not None}
    if not row.get('category') and isinstance(row.get('categories'),list): row['category']='; '.join(map(str,row['categories']))
    # GoSom writes 0 for absent ratings/coordinates; absent must stay absent, never become a measured zero.
    for k in ('review_rating','rating','review_count','latitude','longitude','longtitude'):
        if row.get(k) in (0,'0',0.0): row[k]=''
    scalar=lambda v: v not in (None,'') and not isinstance(v,(dict,list))
    rec={k:clean(next((row[a] for a in opts if scalar(row.get(a))),'')) for k,opts in aliases.items()}
    rec['source']=clean(row.get('source') or source)
    rec['collected_at']=clean(row.get('collected_at') or now())
    profiles=raw.get('social_profiles',rec['social_profiles'])
    if profiles and isinstance(profiles,str):
        try: profiles=json.loads(profiles)
        except (ValueError, TypeError): profiles=[p.strip() for p in profiles.split(';') if p.strip()]
    elif not profiles: profiles=[]
    rec['social_profiles']=list(dict.fromkeys(profiles if isinstance(profiles,list) else []))
    if not rec['name'] and not rec['website']: raise ValueError('record needs business name or website')
    if isinstance(raw.get('provenance'),dict): rec['provenance']=raw['provenance']
    return rec

def identity(rec):
    """Prefer source id, then normalized phone + name, then domain + name; avoid merging same-brand branches."""
    norm=lambda s: re.sub(r'[^a-z0-9]','',clean(s).lower())
    if rec.get('source_id'): basis='id|'+clean(rec.get('source'))+'|'+clean(rec['source_id'])
    elif rec.get('phone') and rec.get('name'): basis='phone|'+norm(rec['phone'])+'|'+norm(rec['name'])
    elif rec.get('website') and rec.get('name') and rec.get('address'): basis='siteaddress|'+domain(rec['website'])+'|'+norm(rec['name'])+'|'+norm(rec['address'])
    elif rec.get('website') and not (rec.get('name') or rec.get('address')): basis='site|'+domain(rec['website'])
    else: basis='address|'+norm(rec.get('name'))+'|'+norm(rec.get('address'))+'|'+norm(rec.get('city'))
    return hashlib.sha256(basis.encode()).hexdigest()[:32]

class Store:
    def __init__(self,path):
        self.path=Path(path);self.path.parent.mkdir(parents=True,exist_ok=True)
        self.db=sqlite3.connect(self.path)
        self.db.row_factory=sqlite3.Row
        self.db.execute('PRAGMA journal_mode=WAL')
        self.db.executescript('''CREATE TABLE IF NOT EXISTS businesses (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS observations (id INTEGER PRIMARY KEY AUTOINCREMENT, business_id TEXT NOT NULL, source TEXT NOT NULL, source_url TEXT, observed_at TEXT NOT NULL, payload TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS observation_business_idx ON observations(business_id);
        CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, status TEXT NOT NULL, created_at TEXT NOT NULL, metadata TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS checkpoints (job_id TEXT NOT NULL, step TEXT NOT NULL, key TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(job_id,step,key));
        CREATE TABLE IF NOT EXISTS audits (business_id TEXT NOT NULL, kind TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY(business_id,kind));
        CREATE TABLE IF NOT EXISTS job_businesses (job_id TEXT NOT NULL, business_id TEXT NOT NULL, PRIMARY KEY(job_id,business_id));''')
        self.db.commit()
    def upsert(self,rec,job_id=None):
        rec=normalize(rec,rec.get('source','import'))
        key=identity(rec);observed=json.dumps(rec,ensure_ascii=False)
        old=self.db.execute('SELECT payload FROM businesses WHERE id=?',(key,)).fetchone()
        if old:
            previous=json.loads(old['payload'])
            merged={**previous,**{k:v for k,v in rec.items() if v not in ('',None,[])}}
            merged['social_profiles']=sorted(set(previous.get('social_profiles',[]))|set(rec.get('social_profiles',[])))
            rec=merged
        self.db.execute('INSERT INTO businesses VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at',(key,json.dumps(rec,ensure_ascii=False),now()))
        self.db.execute('INSERT INTO observations(business_id,source,source_url,observed_at,payload) VALUES(?,?,?,?,?)',(key,rec['source'],rec.get('source_url',''),now(),observed))
        if job_id: self.db.execute('INSERT OR IGNORE INTO job_businesses VALUES(?,?)',(job_id,key))
        self.db.commit()
        return key
    def job(self,job_id,status,metadata=None):
        old=self.db.execute('SELECT metadata FROM jobs WHERE id=?',(job_id,)).fetchone()
        meta={**(json.loads(old['metadata']) if old else {}),**(metadata or {})}
        self.db.execute('INSERT INTO jobs VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,metadata=excluded.metadata',(job_id,status,now(),json.dumps(meta,ensure_ascii=False)))
        self.db.commit(); return meta
    def checkpoint(self,job_id,step,key,status=None,payload=None):
        """Read (status=None) or write a resumable step marker; done steps are skipped on resume."""
        if status is None:
            row=self.db.execute('SELECT status,payload FROM checkpoints WHERE job_id=? AND step=? AND key=?',(job_id,step,key)).fetchone()
            return (row['status'],json.loads(row['payload'])) if row else (None,None)
        self.db.execute('INSERT INTO checkpoints VALUES(?,?,?,?,?,?) ON CONFLICT(job_id,step,key) DO UPDATE SET status=excluded.status,payload=excluded.payload,updated_at=excluded.updated_at',(job_id,step,key,status,json.dumps(payload or {},ensure_ascii=False),now()))
        self.db.commit()
    def checkpoints(self,job_id,step=None):
        q='SELECT step,key,status,payload FROM checkpoints WHERE job_id=?'+(' AND step=?' if step else '')
        return [{'step':r['step'],'key':r['key'],'status':r['status'],**json.loads(r['payload'])} for r in self.db.execute(q,(job_id,step) if step else (job_id,))]
    def save_audit(self,business_id,kind,payload,job_id=None):
        if job_id: kind=f'{kind}@{job_id}'  # audits are per job so one job never overwrites another's scores
        self.db.execute('INSERT INTO audits VALUES(?,?,?,?) ON CONFLICT(business_id,kind) DO UPDATE SET payload=excluded.payload,created_at=excluded.created_at',(business_id,kind,json.dumps(payload,ensure_ascii=False),now()))
        self.db.commit()
    def audit(self,business_id,kind,job_id=None):
        if job_id: kind=f'{kind}@{job_id}'
        row=self.db.execute('SELECT payload FROM audits WHERE business_id=? AND kind=?',(business_id,kind)).fetchone()
        return json.loads(row['payload']) if row else None
    def records(self,job_id=None):
        q='SELECT id,payload FROM businesses ORDER BY id' if not job_id else 'SELECT b.id,b.payload FROM businesses b JOIN job_businesses j ON j.business_id=b.id WHERE j.job_id=? ORDER BY b.id'
        for row in self.db.execute(q,(job_id,) if job_id else ()):
            yield {'id':row['id'],**json.loads(row['payload'])}
    def stats(self):
        return {'unique_businesses':self.db.execute('SELECT COUNT(*) FROM businesses').fetchone()[0],
                'observations':self.db.execute('SELECT COUNT(*) FROM observations').fetchone()[0]}
    def export(self,path,format='csv'):
        records=list(self.records()); dest=Path(path);dest.parent.mkdir(parents=True,exist_ok=True)
        if format=='json':dest.write_text(json.dumps(records,indent=2,ensure_ascii=False),encoding='utf-8')
        elif format=='jsonl':dest.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in records),encoding='utf-8')
        elif format=='csv':
            with dest.open('w',newline='',encoding='utf-8') as out:
                writer=csv.DictWriter(out,fieldnames=('id',)+FIELDS,extrasaction='ignore');writer.writeheader()
                for r in records:
                    row=dict(r);row['social_profiles']=json.dumps(row.get('social_profiles',[]),ensure_ascii=False);writer.writerow(row)
        else:raise ValueError('format must be csv/json/jsonl')
        return len(records)

def import_file(path,store,source='import'):
    p=Path(path)
    if p.suffix.lower()=='.csv':
        with p.open(encoding='utf-8-sig',newline='') as f: return [store.upsert(row|{'source':source}) for row in csv.DictReader(f)]
    if p.suffix.lower()=='.jsonl': records=[json.loads(line) for line in p.read_text().splitlines() if line.strip()]
    elif p.suffix.lower()=='.json':
        records=json.loads(p.read_text(encoding='utf-8'))
        if isinstance(records,dict): records=records.get('results',records.get('data',[]))
    else:raise ValueError('Use CSV, JSON, or JSONL')
    return [store.upsert(row|{'source':source}) for row in records]
