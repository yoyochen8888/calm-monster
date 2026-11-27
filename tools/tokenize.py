"""把某一區專屬規則裡寫死的值，保守地換成 tokens.css 變數。
用法：python3 tools/tokenize.py 區域名稱   （flow｜adult｜games｜home）
規則：顏色只換跟基準完全一樣的；圓角差 4px 內、字級差 0.06rem 內才收斂；其他保留原值。"""
import re,glob,sys
sys.path.insert(0,'/home/claude/tools')
AREAS={'flow':['breath','weather','wx','unsure','tlight','turtle','tstop','tsteps','trystep','snail','push','sense','plan','think','tbnote','tlegs','actpic','levelup','sosadult','wing','lvpause','ghost','calmrow','flowstep','focus','size','sizekey','step-dots','kidq','flowbar','calmbtn','mdots','dragon','squeeze','bubble','lemon','tryStep','coGate'],
 'adult':['adultbox','adultcue','adultfive','iceq','icebox','icenote','icesvg','namein','avoid','tellbox','swaps','swapbox','swap','speak','safefirst','probox','lvtip','lvsay','lvrows','lvnote','lvfirst','lvbox','lvask','hthumb','hfing','helpsig','helpbox','handtx','parent','pbody','ptab'],
 'games':['mcard','mflip','mface','mback','mfront','memtable','memhero','memGrid','memMode','memMsg','memScore','trk2','trcmd','trFlag','trLegend','trRun','trTap','cbcmd','cbtag','cbCmd','cbPond','bpop','gsask','gsopts','clue','cluemore','gcard','gdetail','gico','wscene','wtop','wmeter','wbreath','lvtag','sentence','vocab'],
 'home':['yard','yflag','yswing','yl','homemon','monmsg','evo','evocell','evorow','shopicon','shopitem','swatch','xpbar','skillbox','decor-it','choredone','choreh','pondcv','pondframe','gardensvg','hold-water','g2-','wishask','wishcard','wishset','wishtag','jbitem','jyglow','jymon','jysavor','logitem','realchk','rv-','rvchip','rvdone','rvgood','rvmon','sharemon','share','drawer','today','greet','dex','mdcard','ticket','heroPick','heroOk','heroNameIn']}
FLOW=AREAS[sys.argv[1] if len(sys.argv)>1 else 'flow']
COL={'#EAF5FC':'--t-sky-l','#FFFDF8':'--t-paper','#7DBFA3':'--t-mint-d','#8DBFDD':'--t-sky-d','#F8B9AE':'--t-coral','#E29486':'--t-coral-d',
     '#A8DCC5':'--t-mint','#FFF6DA':'--t-butter-l','#E3D3B8':'--t-line-2','#FFFFFF':'--t-paper','#FFF':'--t-paper','#5C4A3D':'--t-ink','#756353':'--t-ink-soft',
     '#FDFBF7':'--t-bg','#FFFCF4':'--t-card','#EEE3CF':'--t-line','#FBE3A0':'--t-butter','#E3C266':'--t-butter-d','#E6F5EE':'--t-mint-l','#FFEDE8':'--t-coral-l',
     '#B9DDF2':'--t-sky','#F4EEFA':'--t-lilac-l','#D9CCEF':'--t-lilac','#B6A3D9':'--t-lilac-d','#3F7F68':'--t-accent'}
RAD=[(12,'--t-r-s'),(18,'--t-r-m'),(26,'--t-r-l')]
FS=[(.78,'--t-fs-xs'),(.9,'--t-fs-s'),(1.0,'--t-fs-m'),(1.15,'--t-fs-l'),(1.45,'--t-fs-xl'),(1.8,'--t-fs-2xl')]
rx_rule=re.compile(r'([^{}]+)\{([^{}]*)\}')
def flow_sel(sel):return any(re.search(r'[.#-]'+k,sel,re.I) for k in FLOW)
stats={'color':0,'radius':0,'font':0,'kept':[]}
def fix_body(body):
  def col(m):
    c=m.group(0).upper()
    if c in COL: stats['color']+=1; return f'var({COL[c]})'
    return m.group(0)
  body=re.sub(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b',col,body)
  def rad(m):
    v=m.group(1).strip();imp=' !important' if '!important' in v else '';v=v.replace('!important','').strip()
    if v=='999px': stats['radius']+=1; return f'border-radius:var(--t-r-pill){imp}'
    if v=='50%': stats['radius']+=1; return f'border-radius:var(--t-r-round){imp}'
    mm=re.fullmatch(r'(\d+(?:\.\d+)?)px',v)
    if mm:
      n=float(mm.group(1));best=min(RAD,key=lambda t:abs(t[0]-n))
      if abs(best[0]-n)<=4: stats['radius']+=1; return f'border-radius:var({best[1]}){imp}'
    stats['kept'].append('radius '+v); return m.group(0)
  body=re.sub(r'border-radius:\s*([^;}]+)',rad,body)
  def fs(m):
    v=m.group(1).strip();imp=' !important' if '!important' in v else '';v=v.replace('!important','').strip()
    mm=re.fullmatch(r'(\d*\.?\d+)rem',v)
    if mm:
      n=float(mm.group(1));best=min(FS,key=lambda t:abs(t[0]-n))
      if abs(best[0]-n)<=0.06: stats['font']+=1; return f'font-size:var({best[1]}){imp}'
    stats['kept'].append('font '+v); return m.group(0)
  body=re.sub(r'font-size:\s*([^;}]+)',fs,body)
  return body
for f in sorted(glob.glob('css/*.css')):
  if f.endswith('tokens.css'):continue
  s=open(f,encoding='utf-8').read();out=[];last=0;changed=False
  for m in rx_rule.finditer(s):
    sel,body=m.group(1),m.group(2)
    selc=re.sub(r'/\*.*?\*/','',sel,flags=re.S).strip()
    if selc.startswith('@') or not flow_sel(selc):continue
    nb=fix_body(body)
    if nb!=body:
      out.append(s[last:m.start(2)]);out.append(nb);last=m.end(2);changed=True
  if changed:
    out.append(s[last:]);open(f,'w',encoding='utf-8').write(''.join(out));print('改了',f)
print('顏色',stats['color'],'圓角',stats['radius'],'字級',stats['font'])
print('保留原值：',sorted(set(stats['kept'])))
