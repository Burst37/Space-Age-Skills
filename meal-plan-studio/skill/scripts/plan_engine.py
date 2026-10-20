import json, itertools, sys, os
CFG={'client':'Client','cycle':[['MED',60],['LOW',40],['KETO',22],['HIGH',90],['LOW',40],['MED',60],['KETO',22]],'kcal':{'KETO':1600,'LOW':1600,'MED':1650,'HIGH':1750},'min_protein':172}
OUT_DIR='.'
for _i,_a in enumerate(sys.argv):
    if _a=='--config': CFG.update(json.load(open(sys.argv[_i+1])))
    if _a=='--out': OUT_DIR=sys.argv[_i+1]
os.makedirs(OUT_DIR,exist_ok=True)
# Only foods that appear on the client's uric-acid chart (EAT or LIMIT columns).
# per 1 unit: kcal, P, C, F, fiber   (USDA-based estimates)
DB = {
 'yog':   dict(u='cup', n='plain nonfat yogurt', m=(145,25,9,1,0), g='dairy'),
 'cc':    dict(u='cup', n='low-fat cottage cheese', m=(163,28,6,2.3,0), g='dairy'),
 'milk':  dict(u='cup', n='low-fat milk (1%)', m=(102,8.2,12.2,2.4,0), g='dairy'),
 'egg':   dict(u='', n1='large egg', n='large eggs', m=(72,6.3,.4,4.8,0), g='egg'),
 'white': dict(u='cup', n='egg whites', m=(126,26.5,1.8,.2,0), g='egg'),
 'chicken':dict(u='oz', n='chicken breast, baked', m=(47,8.8,0,1,0), g='flesh'),
 'wfish': dict(u='oz', n='white fish, baked', m=(30,6.4,0,.3,0), g='flesh'),
 'salmon':dict(u='oz', n='salmon, baked', m=(52,7.2,0,2.3,0), g='flesh'),
 'tuna':  dict(u='oz', n='tuna (in water)', m=(33,7.2,0,.2,0), g='flesh'),
 'tofu':  dict(u='oz', n='tofu, firm', m=(25,2.8,.7,1.3,.3), g='tofu'),
 'oats':  dict(u='cup', n='oats (dry)', m=(300,10.4,54,5.2,8), g='plant'),
 'quinoa':dict(u='cup', n='cooked quinoa', m=(222,8.2,39.4,3.6,5.2), g='plant'),
 'brice': dict(u='cup', n='cooked brown rice', m=(216,5,44.8,1.8,3.6), g='plant'),
 'sweetp':dict(u='oz', n='baked sweet potato', m=(25.5,.6,5.9,0,.9), g='plant'),
 'bread': dict(u='slice', n='whole-wheat bread', m=(81,4,13.8,1.1,1.9), g='plant'),
 'blueb': dict(u='cup', n='blueberries', m=(84,1.1,21.4,.5,3.6), g='plant'),
 'straw': dict(u='cup', n='sliced strawberries', m=(54,1.2,12.8,.5,3.4), g='plant'),
 'cherry':dict(u='cup', n='cherries, pitted', m=(97,1.6,24.5,.3,3.2), g='plant'),
 'apple': dict(u='', n1='medium apple', n='medium apples', m=(95,.5,25,.3,4.4), g='plant'),
 'banana':dict(u='', n1='medium banana', n='medium bananas', m=(105,1.3,27,.4,3.1), g='plant'),
 'pine':  dict(u='cup', n='pineapple chunks', m=(82,.9,21.7,.2,2.3), g='plant'),
 'peach': dict(u='', n1='medium peach', n='medium peaches', m=(59,1.4,14.3,.4,2.3), g='plant'),
 'pear':  dict(u='', n1='medium pear', n='medium pears', m=(101,.6,27,.2,5.5), g='plant'),
 'broc':  dict(u='cup', n='steamed broccoli', m=(55,3.7,11.2,.6,5.1), g='plant'),
 'zuc':   dict(u='cup', n='zucchini, sautéed', m=(30,2,6,.6,2), g='plant'),
 'pepper':dict(u='cup', n='bell peppers', m=(46,1.5,9,.4,3.1), g='plant'),
 'gbean': dict(u='cup', n='green beans, steamed', m=(44,2.4,9.9,.4,4), g='plant'),
 'carrot':dict(u='cup', n='shredded carrots', m=(52,1.2,12.2,.3,3.6), g='plant'),
 'cuke':  dict(u='cup', n='cucumber', m=(16,.7,3.8,.1,.5), g='plant'),
 'lettuce':dict(u='cup', n='lettuce', m=(8,.6,1.5,.1,1), g='plant'),
 'tomato':dict(u='', n1='medium tomato', n='medium tomatoes', m=(22,1.1,4.8,.2,1.5), g='plant'),
 'dtom':  dict(u='cup', n='diced tomatoes', m=(32,1.6,7,.4,2.2), g='plant'),
 'kale':  dict(u='cup', n='kale, sautéed', m=(36,2.5,7.3,.5,2.6), g='plant'),
 'oil':   dict(u='tsp', n='olive oil', m=(40,0,0,4.5,0), g='fat'),
 'almond':dict(u='oz', n='almonds', m=(164,6,6.1,14.2,3.5), g='fat'),
 'walnut':dict(u='oz', n='walnuts', m=(185,4.3,3.9,18.5,1.9), g='fat'),
 'chia':  dict(u='tbsp', n='chia seeds', m=(58,2,5.1,3.7,4.1), g='fat'),
 'flax':  dict(u='tbsp', n='ground flaxseed', m=(37,1.3,2,2.9,1.9), g='fat'),
 'whey':  dict(u='scoop', n='whey protein isolate', m=(120,25,1,1,0), g='dairy'),
 'mozz':  dict(u='oz', n='part-skim mozzarella', m=(72,7,1,4.5,0), g='dairy'),
 'avo':   dict(u='', n1='¼ medium avocado', n='¼ medium avocado', m=(80,1,4.3,7.3,3.4), g='fat'),
}
FR={.25:'¼',.5:'½',.75:'¾',1/3:'⅓',2/3:'⅔'}
def q2s(q):
    w=int(q); f=q-w
    fs=''
    for k,v in FR.items():
        if abs(f-k)<1e-6: fs=v
    if f and not fs: return str(q)
    return (str(w) if w else '')+fs if (w or fs) else '0'
def disp(key,q):
    d=DB[key]
    if key=='avo': return d['n1'] if q==1 else f"{q2s(q)} × ¼ avocado"
    if d['u']=='':
        return f"{q2s(q)} {d['n1'] if q<=1 else d['n']}"
    u=d['u']
    if u!='oz' and q>1: u=u+'s'
    return f"{q2s(q)} {u} {d['n']}"
def calc(items):
    t=[0,0,0,0,0]
    for k,q in items:
        m=DB[k]['m']
        for i in range(5): t[i]+=m[i]*q
    return t
def meal(name,items,tags=(),free=None):
    its=[(k,q) for k,q in items]
    t=calc(its)
    lines=[disp(k,q) for k,q in its]
    rows=[dict(t=disp(k,q),kcal=round(DB[k]['m'][0]*q),p=round(DB[k]['m'][1]*q,1),c=round(DB[k]['m'][2]*q,1),f=round(DB[k]['m'][3]*q,1)) for k,q in its]
    return dict(name=name,items=its,lines=lines,rows=rows,free='',kcal=round(t[0]),p=round(t[1]),c=round(t[2]),f=round(t[3]),fib=round(t[4]),tags=list(tags))

B={
'B1':meal('Egg & Egg-White Scramble',[('egg',2),('white',1.25),('oil',1),('cc',.25)]),
'B2':meal('Cottage Cheese Chia Bowl',[('cc',.5),('white',1.25),('chia',.5),('walnut',.5)]),
'B3':meal('Walnut Yogurt Parfait',[('yog',.5),('white',.75),('walnut',.75),('flax',.5)]),
'B4':meal('Egg-White Frittata Cups',[('white',1.5),('egg',1),('kale',.25),('oil',1)]),
'B5':meal('Egg-White Scramble & Avocado',[('egg',1),('white',1.5),('oil',1),('avo',1)]),
'B6':meal('Savory Cottage Cheese Plate',[('mozz',1),('cuke',.25),('egg',1),('white',1),('walnut',.5)]),
'B7':meal('Walnut Cottage Cheese Pancakes',[('white',1.5),('cc',.5),('egg',1),('walnut',.75)]),
}
F={
'MF1':meal('Chicken & Zucchini Skillet',[('chicken',4),('zuc',.5),('oil',2)],['chicken']),
'MF2':meal('Baked White Fish & Green Beans',[('wfish',6),('gbean',.25),('oil',2)],['wfish']),
'MF3':meal('Salmon Salad Bowl',[('salmon',4),('lettuce',2),('cuke',.5),('oil',2)],['salmon']),
'MF4':meal('Tuna Lettuce Wraps',[('tuna',4),('lettuce',2),('avo',1),('oil',1)],['tuna']),
'MF5':meal('Chicken & Kale Sauté',[('chicken',4),('kale',.5),('oil',2)],['chicken']),
'MF6':meal('Baked Fish Lettuce Wraps',[('wfish',6),('lettuce',2),('oil',1),('avo',1)],['wfish']),
'MF7':meal('Chicken & Broccoli Bowl',[('chicken',4),('broc',.25),('oil',2),('cc',.25)],['chicken']),
}
N={
'MN1':meal('Tofu & Egg-White Stir-Fry',[('tofu',6),('white',1),('zuc',.25),('oil',2)],['tofu']),
'MN2':meal('Cottage Cheese Plate',[('cc',.5),('mozz',1),('cuke',.25),('walnut',.5),('oil',1),('white',.5)]),
'MN3':meal('Egg-White Veggie Frittata',[('white',2.5),('zuc',.25),('oil',2)]),
'MN4':meal('Tofu Bowl with Yogurt Sauce',[('tofu',6),('cuke',.25),('oil',2),('white',.75)],['tofu']),
'MN5':meal('Cottage Cheese Egg-White Bake',[('white',1.5),('cc',.5),('mozz',1),('oil',1)]),
}
S={
'S1':meal('Walnut Yogurt Cup',[('yog',.25),('white',.5),('walnut',.5)]),
'S2':meal('Mozzarella & Walnut Plate',[('mozz',2),('white',.5),('walnut',.5)]),
'S3':meal('Egg-White Veggie Bites',[('white',1.25),('oil',.5)]),
'S4':meal('Cottage Cheese & Cucumber',[('cc',.5),('cuke',.25),('white',.5),('walnut',.25)]),
'S5':meal('Yogurt Egg-White Shake',[('yog',.25),('white',1),('walnut',.5)]),
'S6':meal('Walnut Whey Yogurt Cup',[('yog',.25),('whey',.5),('walnut',.5)]),
'S7':meal('Avocado Cottage Cheese',[('cc',.5),('avo',1),('white',.5)]),
}
for _D in (B,F,N,S):
    for _k,_v in _D.items(): _v['key']=_k
WF=[['MF1','MF2','MF5','MF3','MF6','MF7','MF4'],['MF7','MF6','MF1','MF4','MF2','MF5','MF3'],['MF5','MF3','MF6','MF1','MF4','MF2','MF7'],['MF2','MF4','MF7','MF6','MF3','MF1','MF5'],['MF1','MF3']]
WN=[['MN2','MN1','MN3','MN5','MN4','MN3','MN2'],['MN5','MN3','MN1','MN2','MN3','MN4','MN5'],['MN3','MN2','MN4','MN3','MN1','MN5','MN2'],['MN1','MN5','MN2','MN4','MN3','MN5','MN2'],['MN3','MN1']]
flatF=[x for w in WF for x in w]; flatN=[x for w in WN for x in w]

import copy, itertools
def cups(m,key): return sum(q for k,q in m['items'] if k==key)
LD=lambda k:(F.get(k) or N.get(k))
def extend(m,adds):
    its=list(m['items'])+list(adds)
    n=meal(m['name'],its); n['key']=m['key']; n['tags']=m.get('tags',[])
    base_lines=[disp(k,q) for k,q in m['items']]
    n['lines']=base_lines+['<b>+ '+disp(k,q)+'</b>' for k,q in adds]
    n['adds']=[disp(k,q) for k,q in adds]
    return n
# weekly carb cycle (Mon..Sun): MED, LOW, KETO, HIGH, LOW, MED, KETO
CYCLE=[tuple(c) for c in CFG['cycle']]
KCAL=CFG['kcal']
ADD_B=[None,('straw',.5),('straw',1),('blueb',.5),('oats',1/3),('bread',1)]
ADD_L=[None,('carrot',.5),('sweetp',2),('sweetp',3),('quinoa',.25),('quinoa',.5),('brice',.5)]
ADD_S=[None,('blueb',.5),('cherry',.5),('banana',.5),('peach',1),('pine',.5),('apple',1),('pear',1)]
FATTOP=[('walnut',.5),('walnut',1),('walnut',1.5),('avo',1),('avo',2),('almond',.5)]
OILTOP=[('oil',1),('oil',2),('oil',3)]
last_b={}; last_s={}; last_add={}; oats_days=[]
days=[]
for i in range(30):
    tier,tc=CYCLE[i%7]
    f=flatF[i]; n=flatN[i]
    lunch,dinner=(f,n) if i%2==0 else (n,f)
    mains=[LD(lunch),LD(dinner)]
    best=None
    for b in B:
        if i-last_b.get(b,-99)<3: continue
        for s_ in S:
            if i-last_s.get(s_,-99)<2: continue
            ms=[B[b],S[s_]]+mains
            eggs=sum(cups(m,'egg') for m in ms)
            base_c=sum(m['c'] for m in ms)
            if eggs>2: continue
            if tier=='KETO' and base_c>22.5: continue
            sc=-(min(i-last_b.get(b,-99),9)+min(i-last_s.get(s_,-99),9))+base_c*0.35
            if tier!='KETO' and base_c>min(tc-8,34): continue
            if best is None or sc<best[0]: best=(sc,b,s_)
    if best is None:
        # relax: pick lowest-carb legal combo ignoring recency
        for b in B:
            for s_ in S:
                ms=[B[b],S[s_]]+mains
                if sum(cups(m,'egg') for m in ms)>2: continue
                sc=sum(m['c'] for m in ms)
                if best is None or sc<best[0]: best=(sc,b,s_)
    _,b,s_=best; last_b[b]=i; last_s[s_]=i
    bm,sm,m1,m2=B[b],S[s_],mains[0],mains[1]
    base_c=bm['c']+sm['c']+m1['c']+m2['c']
    if tier!='KETO':
        need=tc-base_c; pick=None
        for ab,al,ad,asn in itertools.product(ADD_B,ADD_L,ADD_L,ADD_S):
            adds=[ab,al,ad,asn]; c=sum(calc([a])[2] for a in adds if a)
            if ab and ab[0]=='oats' and sum(1 for d in oats_days if i-d<7)>=2: continue
            if sum(1 for a in adds if a)>3: continue
            rep=sum(1 for a in adds if a and last_add.get(a,-99)>=i-2)
            if al and ad and al==ad: continue
            sc=abs(c-need)+rep*3+sum(1 for a in adds if a)*0.8
            if pick is None or sc<pick[0]: pick=(sc,adds)
        adds=pick[1]
        for a in adds:
            if a: last_add[a]=i
        if adds[0] and adds[0][0]=='oats': oats_days.append(i)
        if adds[0]: bm=extend(bm,[adds[0]])
        if adds[1]: m1=extend(m1,[adds[1]])
        if adds[2]: m2=extend(m2,[adds[2]])
        if adds[3]: sm=extend(sm,[adds[3]])
    else:
        bm=extend(bm,[]); sm=extend(sm,[]); m1=extend(m1,[]); m2=extend(m2,[])
    # protein top-up (egg whites) to >=172 g
    P=bm['p']+sm['p']+m1['p']+m2['p']
    if P<CFG['min_protein']:
        need_cups=(CFG['min_protein']-P)/26.5
        q=min([.5,1,1.5],key=lambda x:abs(x*25-(CFG['min_protein']-P)))
        sm=extend(sm,[('whey',q)])
    # calorie top-ups: oil on dinner, nuts/avo on snack
    kc=bm['kcal']+sm['kcal']+m1['kcal']+m2['kcal']; gap=KCAL[tier]-kc
    if tier=='KETO' and gap>=35:
        half=gap/2
        t1=min(OILTOP,key=lambda t:abs(calc([t])[0]-half)); m1=extend(m1,[t1]); gap-=calc([t1])[0]
        if gap>=35:
            t2=min(OILTOP,key=lambda t:abs(calc([t])[0]-gap)); m2=extend(m2,[t2])
    elif gap>=35:
        have=[k for k,_ in sm['items']]
        cand=[t for t in FATTOP if t[0] not in have]
        t1=min(cand,key=lambda t:abs(calc([t])[0]-gap))
        if gap>=100 and abs(calc([t1])[0]-gap)>=60:
            # oil on dinner for remainder
            sm=extend(sm,[t1]); gap-=calc([t1])[0]
            if gap>=35:
                t2=min(OILTOP,key=lambda t:abs(calc([t])[0]-gap))
                m2=extend(m2,[t2])
        else:
            sm=extend(sm,[t1])
    meals=[('Breakfast','8:00 AM',bm),('Lunch','12:30 PM',m1),('Snack / Pre-Workout','4:30 PM',sm),('Dinner','7:30 PM',m2)]
    tot=[sum(m[k] for _,_,m in meals) for k in ('kcal','p','c','f','fib')]
    days.append(dict(day=i+1,tier=tier,ctarget=tc,meals=[dict(slot=a,time=t,**m) for a,t,m in meals],kcal=tot[0],p=tot[1],c=tot[2],f=tot[3],fib=tot[4]))
if __name__=='__main__':
    for d in days: print(d['day'],d['tier'],d['kcal'],d['p'],d['c'],d['f'],d['fib'],[m['key'] for m in d['meals']])
    nn=len(days)
    print('avg',[round(sum(d[k] for d in days)/nn) for k in ('kcal','p','c','f','fib')])

# ---------- export ----------
import math
def day_checks(d):
    flesh={}; eggs=0; tofu=0; yog=0; cc=0
    for m in d['meals']:
        for k,q in m['items']:
            g=DB[k]['g']
            if g=='flesh': flesh[k]=flesh.get(k,0)+q
            if k=='egg': eggs+=q
            if k=='tofu': tofu+=q
    return flesh,eggs,tofu
NAMES={'chicken':'chicken','wfish':'white fish','salmon':'salmon','tuna':'tuna'}
for d in days:
    fl,eggs,tofu=day_checks(d)
    parts=[f"{NAMES[k]} {int(v)} oz" for k,v in fl.items()]
    if tofu: parts.append(f"tofu {int(tofu)} oz")
    d['check']=' · '.join(parts+[f"whole eggs {int(eggs)}/2"]) 
    d['week']=(d['day']-1)//7+1
# protein by source (avg g/day)
grp={'dairy':'Low-fat dairy & whey','egg':'Egg whites & eggs','flesh':'Chicken & fish (capped)','tofu':'Tofu','plant':'Grains, produce & nuts'}
ps={k:0 for k in grp}
for d in days:
    for m in d['meals']:
        for k,q in m['items']:
            g=DB[k]['g']; g='plant' if g in('fat',) else g
            ps[g]+=DB[k]['m'][1]*q
protein_by_source={grp[k]:round(v/30,1) for k,v in ps.items()}
# slot averages
slots={}
for d in days:
    for m in d['meals']:
        s=slots.setdefault(m['slot'],[0,0,0,0])
        for i,k in enumerate(('kcal','p','c','f')): s[i]+=m[k]/30
slot_avg={k:[round(x) for x in v] for k,v in slots.items()}
# groceries
def groc(dlist):
    tot={}
    for d in dlist:
        for m in d['meals']:
            for k,q in m['items']: tot[k]=tot.get(k,0)+q
    out={'Proteins & dairy':[],'Vegetables':[],'Fruit, nuts & seeds':[],'Grains & pantry':[]}
    def add(cat,label,txt): out[cat].append([label,txt])
    c=math.ceil
    P='Proteins & dairy'; V='Vegetables'; G='Grains & pantry'; FR='Fruit, nuts & seeds'
    for k in ('chicken',):
        if k in tot: add(P,'Chicken breast',f"{tot[k]*1.33/16:.1f} lb raw")
    if 'wfish' in tot: add(P,'White fish fillets',f"{tot['wfish']*1.25/16:.1f} lb raw")
    if 'salmon' in tot: add(P,'Salmon',f"{tot['salmon']*1.25/16:.1f} lb raw")
    if 'tuna' in tot: add(P,'Tuna (in water)',f"{tot['tuna']:.0f} oz")
    if 'tofu' in tot: add(P,'Tofu, firm',f"{tot['tofu']:.0f} oz")
    if 'yog' in tot: add(P,'Plain nonfat yogurt',f"{c(tot['yog'])} cups")
    if 'cc' in tot: add(P,'Low-fat cottage cheese',f"{c(tot['cc'])} cups")
    if 'milk' in tot: add(P,'Low-fat milk',f"{c(tot['milk']*4)/4:.2g} cups")
    if 'white' in tot: add(P,'Egg whites',f"{c(tot['white']*4)/4:.2g} cups")
    if 'egg' in tot: add(P,'Eggs',f"{c(tot['egg'])}")
    for k,lab,u in (('broc','Broccoli','cups'),('zuc','Zucchini','cups'),('pepper','Bell peppers','cups'),('gbean','Green beans','cups'),('kale','Kale','cups'),('carrot','Carrots','cups'),('cuke','Cucumber','cups'),('lettuce','Lettuce','cups'),('dtom','Diced tomatoes','cups')):
        if k in tot: add(V,lab,f"{c(tot[k])} {u}")
    if 'tomato' in tot: add(V,'Tomatoes',f"{c(tot['tomato'])}")
    if 'sweetp' in tot: add(V,'Sweet potatoes',f"{tot['sweetp']*1.0/16:.1f} lb")
    if 'avo' in tot: add(V,'Avocado',f"{c(tot['avo']/4)}")
    for k,lab,u in (('blueb','Blueberries','cups'),('straw','Strawberries','cups'),('cherry','Cherries','cups'),('pine','Pineapple','cups')):
        if k in tot: add(FR,lab,f"{c(tot[k])} {u}")
    for k,lab in (('apple','Apples'),('banana','Bananas'),('peach','Peaches'),('pear','Pears')):
        if k in tot: add(FR,lab,f"{c(tot[k])}")
    if 'oats' in tot: add(G,'Rolled oats',f"{tot['oats']:.1f} cups dry")
    if 'quinoa' in tot: add(G,'Quinoa',f"{tot['quinoa']/3:.1f} cups dry")
    if 'brice' in tot: add(G,'Brown rice',f"{tot['brice']/3:.1f} cups dry")
    if 'bread' in tot: add(G,'Whole-wheat bread',f"{c(tot['bread'])} slices")
    if 'oil' in tot: add(G,'Olive oil',f"{c(tot['oil'])} tsp")
    if 'almond' in tot: add(FR,'Almonds',f"{tot['almond']:.1f} oz")
    if 'walnut' in tot: add(FR,'Walnuts',f"{tot['walnut']:.1f} oz")
    if 'chia' in tot: add(FR,'Chia seeds',f"{c(tot['chia'])} tbsp")
    if 'flax' in tot: add(FR,'Ground flax',f"{c(tot['flax'])} tbsp")
    return out
weeks=[]
for w in range(5):
    dl=days[w*7:(w+1)*7]
    weeks.append(dict(week=w+1,days=[d['day'] for d in dl],avg={k:round(sum(d[k] for d in dl)/len(dl)) for k in ('kcal','p','c','f','fib')},groc=groc(dl)))
avg={k:round(sum(d[k] for d in days)/30) for k in ('kcal','p','c','f','fib')}
json.dump(dict(days=days,weeks=weeks,avg=avg,protein_by_source=protein_by_source,slot_avg=slot_avg,
  minmax=dict(kmin=min(d['kcal'] for d in days),kmax=max(d['kcal'] for d in days),pmin=min(d['p'] for d in days),pmax=max(d['p'] for d in days),cmin=min(d['c'] for d in days),cmax=max(d['c'] for d in days))),
  open(os.path.join(OUT_DIR,'plan.json'),'w'),ensure_ascii=False,indent=1)
t=open(os.path.join(OUT_DIR,'plan.json')).read().replace('"1 cups"','"1 cup"'); open(os.path.join(OUT_DIR,'plan.json'),'w').write(t)
print(avg,protein_by_source,slot_avg)
for d in days[:8]: print(d['day'],d['check'])
for w in weeks[:1]: print(json.dumps(w['groc'],ensure_ascii=False))

# ---------- swap database for the web app ----------
_cat={}
for _k in ('yog','cc','egg','white','chicken','wfish','salmon','tuna','tofu','whey','mozz'): _cat[_k]='protein'
for _k in ('oats','quinoa','brice','sweetp','bread','blueb','straw','cherry','apple','banana','pine','peach','pear'): _cat[_k]='carb'
for _k in ('broc','zuc','pepper','gbean','carrot','cuke','lettuce','tomato','dtom','kale'): _cat[_k]='veg'
for _k in ('oil','almond','walnut','chia','flax','avo'): _cat[_k]='fat'
_db={}
for _k,_v in DB.items():
    if _k in _cat: _db[_k]=dict(n=_v['n'],n1=_v.get('n1',_v['n']),u=_v['u'],cat=_cat[_k],g=_v['g'],m=list(_v['m']))
_db['cabbage']=dict(n='shredded cabbage',n1='shredded cabbage',u='cup',cat='veg',g='plant',m=[22,1.1,5.2,.1,2.2])
_db['celery']=dict(n='celery',n1='celery',u='cup',cat='veg',g='plant',m=[16,.7,3.0,.2,1.6])
_db['radish']=dict(n='sliced radishes',n1='sliced radishes',u='cup',cat='veg',g='plant',m=[19,.8,4.0,.1,1.9])
_step={'cup':.25,'oz':.5,'tsp':.5,'tbsp':.5,'scoop':.5,'slice':1,'':.5}
for _k,_v in _db.items():
    _v['step']=_step.get(_v['u'],.5)
    if _k in ('egg','avo'): _v['step']=1
    if _k in ('walnut','almond'): _v['step']=.25
    if _k=='tomato': _v['vol']=.75
for _k,_f in {'chicken':1.33,'wfish':1.25,'salmon':1.25}.items(): _db[_k]['lbf']=_f; _db[_k]['raw']=1
_db['sweetp']['lbf']=1.0
for _k in ('quinoa','brice'): _db[_k]['dry']=3
for _k,_c in {'chicken':4,'wfish':6,'salmon':4,'tuna':4,'tofu':6,'egg':2}.items(): _db[_k]['cap']=_c
json.dump(_db,open(os.path.join(OUT_DIR,'db.json'),'w'),ensure_ascii=False)
print('wrote',OUT_DIR)
