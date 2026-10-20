import zipfile,sys,re
src,dst=sys.argv[1],sys.argv[2]
zi=zipfile.ZipFile(src)
names=[n for n in zi.namelist() if not n.endswith('/')]
first=['[Content_Types].xml','_rels/.rels','ppt/presentation.xml','ppt/_rels/presentation.xml.rels']
order=[n for n in first if n in names]+sorted(n for n in names if n not in first)
zo=zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED,compresslevel=6)
for n in order:
    d=zi.read(n)
    if n=='[Content_Types].xml':
        d=d.replace(b'ContentType="image/jpg"',b'ContentType="image/jpeg"')
    elif re.match(r'ppt/slides/slide\d+\.xml$',n):
        s=d.decode('utf8')
        s=re.sub(r'(<p:cNvPr id="\d+" name=")([^"]*)(")',lambda m:m.group(1)+m.group(2).replace('|','_')+m.group(3),s)
        d=s.encode('utf8')
    zo.writestr(zipfile.ZipInfo(n,date_time=(2026,10,11,12,0,0)) if False else n,d, zipfile.ZIP_STORED if n.lower().endswith(('.mp4','.m4v','.png','.jpg','.jpeg')) else zipfile.ZIP_DEFLATED)
zo.close()
print(dst,len(order))
