"""GeoFusion X command line."""
import argparse
import json
from .core import Store,import_file
from .adapters import discover_site,gosom_docker,agent_reach_health,firecrawl_site

def run(argv=None):
    p=argparse.ArgumentParser(prog='geofusion',description='GeoFusion X multi-source research engine')
    p.add_argument('--db',default='geofusion.db')
    sub=p.add_subparsers(dest='cmd',required=True)
    imp=sub.add_parser('import');imp.add_argument('file');imp.add_argument('--source',default='import')
    exp=sub.add_parser('export');exp.add_argument('file');exp.add_argument('--format',choices=['csv','json','jsonl'],default='csv')
    site=sub.add_parser('website');site.add_argument('url');site.add_argument('--engine',choices=['stdlib','scrapling','firecrawl'],default='stdlib')
    maps=sub.add_parser('maps');maps.add_argument('query');maps.add_argument('--depth',type=int,default=1);maps.add_argument('--timeout',type=int,default=600)
    board=sub.add_parser('onboard',help='Interactive configuration wizard; does not scrape')
    board.add_argument('--output',default='geofusion.config.json')
    board.add_argument('--force',action='store_true')
    sub.add_parser('stats');sub.add_parser('doctor');sub.add_parser('records')
    job=sub.add_parser('run',help='Durable end-to-end job (resumable by --job)');job.add_argument('config');job.add_argument('--workdir',default='runs');job.add_argument('--job',required=True);job.add_argument('--no-lighthouse',action='store_true')
    rep=sub.add_parser('report',help='Write tabbed CSV/JSONL/XLSX for a finished job');rep.add_argument('--workdir',default='runs');rep.add_argument('--job',required=True);rep.add_argument('--out',default='report');rep.add_argument('--google-sheet',metavar='TITLE')
    aud=sub.add_parser('audit',help='Audit one website (static->browser, Lighthouse)');aud.add_argument('url');aud.add_argument('--phone',default='');aud.add_argument('--city',default='');aud.add_argument('--no-lighthouse',action='store_true')
    bn=sub.add_parser('bench',help='Measured benchmarks for a job');bn.add_argument('--workdir',default='runs');bn.add_argument('--job',required=True);bn.add_argument('--reference',help='JSON list of prior rows {name,phone,website}')
    rd=sub.add_parser('readiness',help='Truthful per-platform social status via Agent Reach doctor');rd.add_argument('platforms')
    args=p.parse_args(argv)
    if args.cmd=='run':
        from .pipeline import run as run_job
        _,meta=run_job(json.loads(open(args.config).read()),args.workdir,args.job,lighthouse=not args.no_lighthouse)
        print(json.dumps({k:meta[k] for k in ('seconds','stats','judge_mode','judgments','escalations')},indent=2));return
    if args.cmd=='report':
        from .export import tabs,write_files,google_sheet
        from pathlib import Path
        rows=tabs(Store(Path(args.workdir)/'geofusion.db'),args.job);out={'xlsx':write_files(rows,args.out),'rows':{k:len(v) for k,v in rows.items()}}
        if args.google_sheet: out['google_sheet']=google_sheet(rows,args.google_sheet)
        print(json.dumps(out,indent=2));return
    if args.cmd=='audit':
        from .web import audit_site
        from .scoring import website_quality,technical_seo,ai_search
        a=audit_site(args.url,args.phone,args.city,run_lighthouse=not args.no_lighthouse)
        print(json.dumps({'audit':a,'website_quality':website_quality(a),'technical_seo':technical_seo(a),'ai_search':ai_search(a)},indent=2));return
    if args.cmd=='bench':
        from .bench import benchmark
        from pathlib import Path
        ref=json.loads(open(args.reference).read()) if args.reference else None
        print(json.dumps(benchmark(Store(Path(args.workdir)/'geofusion.db'),args.job,ref),indent=2,default=str));return
    if args.cmd=='readiness':
        from .social import readiness
        print(json.dumps(readiness([x.strip() for x in args.platforms.split(',') if x.strip()]),indent=2,ensure_ascii=False));return
    db=Store(args.db)
    if args.cmd=='onboard':
        from .onboarding import questionnaire, save_config
        config=questionnaire()
        print(json.dumps({'config_path':save_config(config,args.output,args.force),'status':'configured_not_executed'},indent=2))
    elif args.cmd=='import':print(json.dumps({'imported':len(import_file(args.file,db,args.source)),**db.stats()}))
    elif args.cmd=='export':print(json.dumps({'exported':db.export(args.file,args.format),'path':args.file}))
    elif args.cmd=='website':
        record=firecrawl_site(args.url) if args.engine=='firecrawl' else discover_site(args.url,args.engine)
        print(json.dumps({'id':db.upsert(record),'record':record},indent=2))
    elif args.cmd=='maps':
        import tempfile
        from pathlib import Path
        with tempfile.TemporaryDirectory() as td:
            path=gosom_docker(args.query,Path(td)/'results.csv',args.depth,args.timeout)
            print(json.dumps({'imported':len(import_file(path,db,'google_maps_gosom')),'stats':db.stats()}))
    elif args.cmd=='stats':print(json.dumps(db.stats(),indent=2))
    elif args.cmd=='records':print(json.dumps(list(db.records()),indent=2))
    elif args.cmd=='doctor':
        import shutil,importlib.util,os
        print(json.dumps({'docker':bool(shutil.which('docker')),'scrapling':bool(importlib.util.find_spec('scrapling')),'firecrawl':bool(importlib.util.find_spec('firecrawl')),'firecrawl_key_set':bool(os.getenv('FIRECRAWL_API_KEY')),'agent_reach':agent_reach_health()},indent=2))
if __name__=='__main__':run()
