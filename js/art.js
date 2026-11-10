/* 黏土感畫風（v18）：圓潤、粉嫩、柔和的光影。家園、菜園、暫代怪獸共用。

   ===== 之後換成自己的圖（例如 Gemini 生的）=====
   1. 把圖存成 .webp 或 .png（背景透明），放進 img/ 資料夾
   2. 在下面的 ART 裡加一行，例如：
        tree:'img/home_tree.webp',
      這樣家園裡的小樹就會換成那張圖，位置、大小、拖拉布置都照舊。
   3. 圖太大或太小、位置偏了，可以改成：
        tree:{src:'img/home_tree.webp',scale:1.1,dx:0,dy:-4},
   可以換的名字：tree flowers tent lamp swing garden pond house
   （每個名字預設的位置和大小在 ART_BOX）                                  */
const ART={
};
/* 每樣東西在家園畫面（360×250）裡的預設框：x, y, 寬, 高 */
const ART_BOX={tree:[10,56,84,106],flowers:[8,188,92,34],tent:[92,100,72,58],lamp:[204,84,44,84],swing:[290,138,72,78],
  garden:[12,214,82,34],pond:[200,186,100,38],house:[240,60,98,96]};
function artImg(id,fallback,k=1){const a=ART[id];if(!a)return fallback;const o=typeof a==='string'?{src:a}:a;const b=ART_BOX[id];if(!b)return fallback;
  const s=(o.scale||1)*k,w=b[2]*s,h=b[3]*s,x=b[0]+(b[2]-w)/2+(o.dx||0),y=b[1]+(b[3]-h)+(o.dy||0);
  return `<image href="${o.src}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="xMidYMax meet"/>`}

/* ---------- 顏色工具 ---------- */
function hx(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
function tint(h,t){/* t>0 變亮，t<0 變暗 */const c=hx(h);return '#'+c.map(v=>Math.round(t>0?v+(255-v)*t:v*(1+t)).toString(16).padStart(2,'0')).join('')}

/* ---------- 黏土工具：每張 svg 一個，收集需要的漸層與陰影 ---------- */
function Clay(p){const D=[],seen={};
  const add=(id,s)=>{if(!seen[id]){seen[id]=1;D.push(s)}return `url(#${id})`};
  return {
    /* 立體球面：左上亮、右下暗 */
    g(base,hi=.42,lo=-.2){const id=`${p}r${base.slice(1)}${Math.round(hi*100)}`;
      return add(id,`<radialGradient id="${id}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="${tint(base,hi)}"/><stop offset=".55" stop-color="${base}"/><stop offset="1" stop-color="${tint(base,lo)}"/></radialGradient>`)},
    /* 上亮下暗 */
    v(base,hi=.3,lo=-.15){const id=`${p}v${base.slice(1)}${Math.round(hi*100)}`;
      return add(id,`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tint(base,hi)}"/><stop offset="1" stop-color="${tint(base,lo)}"/></linearGradient>`)},
    lin(id,stops,vert=true){return add(p+id,`<linearGradient id="${p+id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`)},
    glow(id,c){return add(p+id,`<radialGradient id="${p+id}"><stop offset="0" stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`)},
    sh:`filter="url(#${p}sh)"`,
    defs(){return `<defs><filter id="${p}sh" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="1.8" stdDeviation="1.4" flood-color="#6B4A35" flood-opacity=".22"/></filter>
      <filter id="${p}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>${D.join('')}</defs>`},
    blur:`filter="url(#${p}blur)"`}}
/* 地上的影子 */
const groundSh=(C,cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4E6B3A" opacity=".16" ${C.blur}/>`;
/* 亮點（黏土的反光） */
const shine=(cx,cy,rx,ry,o=.45)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}"/>`;

/* ---------- 家園物件（座標跟 v17 以前相同，布置位置不會跑掉） ---------- */
function clayTree(C,st){const sc=[.6,.8,1][st-1];
  return `<g transform="translate(52 162) scale(${sc})">${groundSh(C,0,2,30,6)}
    <path d="M-8 0 Q-6 -30 -6 -52 L6 -52 Q6 -30 8 0 Z" fill="${C.v('#B9855A')}" ${C.sh}/>
    <g class="amb-sway"><circle cx="-20" cy="-58" r="21" fill="${C.g('#7FCB7A')}" ${C.sh}/><circle cx="20" cy="-60" r="21" fill="${C.g('#6FBF6E')}" ${C.sh}/>
    <circle cx="0" cy="-78" r="30" fill="${C.g('#86D283')}" ${C.sh}/>${shine(-10,-92,10,6,.35)}
    ${st>=3?`<circle cx="-12" cy="-80" r="5.5" fill="${C.g('#FF8A80')}"/><circle cx="14" cy="-66" r="5.5" fill="${C.g('#FF8A80')}"/><circle cx="-24" cy="-58" r="5" fill="${C.g('#FF8A80')}"/>`:''}</g></g>`}
function clayHouse(C){return `<g transform="translate(246 62)">${groundSh(C,43,88,48,6)}
    ${[0,2,4].map(d=>`<circle class="amb-smoke" style="animation-delay:${d}s" cx="69.5" cy="12" r="4" fill="#fff"/>`).join('')}
    <rect x="64" y="16" width="11" height="16" rx="4" fill="${C.v('#E6A57E')}" ${C.sh}/>
    <rect x="8" y="32" width="70" height="56" rx="9" fill="${C.v('#FFF1DC',.4,-.08)}" ${C.sh}/>
    <path d="M3 40 Q0 38 4 34 L39 7 Q43 4 47 7 L82 34 Q86 38 83 40 Z" fill="${C.v('#F59B8E',.25,-.12)}" ${C.sh}/>${shine(30,20,12,4,.35)}
    <path d="M34 88 V66 Q34 56 43 56 Q52 56 52 66 V88 Z" fill="${C.v('#C99467')}"/><circle cx="48" cy="73" r="1.8" fill="#FFE08A"/>
    <rect x="14" y="48" width="15" height="13" rx="4" fill="${C.v('#BFE6FF',.3)}" stroke="#fff" stroke-width="1.6"/><rect x="57" y="48" width="15" height="13" rx="4" fill="${C.v('#BFE6FF',.3)}" stroke="#fff" stroke-width="1.6"/>
    <path d="M21.5 48 v13 M14 54.5 h15 M64.5 48 v13 M57 54.5 h15" stroke="#fff" stroke-width="1.2"/></g>`}
function clayTent(C){return `<g transform="translate(96 112)">${groundSh(C,32,46,36,5)}
    <path d="M2 46 Q-1 46 1 42 L29 3 Q32 -1 35 3 L63 42 Q65 46 62 46 Z" fill="${C.v('#FFC870',.3,-.12)}" ${C.sh}/>
    <path d="M32 8 Q27 30 23 46 H41 Q37 30 32 8 Z" fill="${C.v('#E39A3B')}"/>${shine(22,22,5,9,.3)}
    <path d="M32 2 V-8" stroke="#B9855A" stroke-width="2" stroke-linecap="round"/><path class="amb-flag" d="M32 -8 L41 -5 L32 -2 Z" fill="#FF9EC4"/></g>`}
function clayLamp(C,night){return `<g transform="translate(226 98)"><circle class="${night?'amb-glow':''}" cx="0" cy="8" r="${night?30:20}" fill="${C.glow('lampglow','#FFE9A0')}"/>
    ${groundSh(C,0,68,10,3)}<rect x="-2.5" y="12" width="5" height="56" rx="2.5" fill="${C.v('#8E8AA8')}" ${C.sh}/>
    <rect x="-6" y="64" width="12" height="5" rx="2.5" fill="${C.v('#8E8AA8')}"/>
    <circle cx="0" cy="8" r="9" fill="${C.g('#FFE89A',.6)}" ${C.sh}/>${shine(-3,4,3,2,.7)}
    <path d="M-8 2 Q0 -5 8 2" stroke="${tint('#8E8AA8',-.1)}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`}
function claySwing(C){return `<g transform="translate(296 140)">${groundSh(C,28,72,34,5)}
    <path d="M2 70 L10 2 M54 70 L46 2" stroke="${tint('#C99467',-.05)}" stroke-width="6" stroke-linecap="round" fill="none" ${C.sh}/>
    <path d="M7 3 H49" stroke="#C99467" stroke-width="6" stroke-linecap="round" ${C.sh}/>
    <path d="M20 4 V46 M36 4 V46" stroke="#A9A4BF" stroke-width="1.8"/>
    <rect x="14" y="45" width="28" height="7" rx="3.5" fill="${C.v('#FF9EB0')}" ${C.sh}/>${shine(22,47,6,1.4,.5)}</g>`}
const FISH_COL=['#FFB25B','#FF8A80','#FFD86B','#FFA8CF','#B9A0F0'];
function clayPond(C,n){let f='';for(let i=0;i<n;i++){const x=228+i*11,y=203+(i%2)*6,c=FISH_COL[i%5];
    f+=`<g class="fish" style="animation-delay:${i*.6}s"><ellipse cx="${x+5}" cy="${y}" rx="5.5" ry="2.8" fill="${C.g(c)}"/><path d="M${x} ${y} l-4 -3 v6z" fill="${c}"/><circle cx="${x+8}" cy="${y-.6}" r=".9" fill="#3B2F2A"/></g>`}
  const peb=[[208,204],[214,214],[226,219],[244,221],[262,220],[278,216],[290,208],[288,198],[212,196]];
  return `<ellipse cx="250" cy="207" rx="46" ry="15.5" fill="${C.v('#9C8FB5')}" opacity=".35"/>
    <ellipse cx="250" cy="206" rx="43" ry="13.5" fill="${C.lin('water',[[0,'#B5E6F5'],[1,'#6FB9DE']])}"/>
    <ellipse cx="236" cy="202" rx="13" ry="3" fill="#fff" opacity=".55"/>${f}
    ${[[262,200],[244,211],[272,210]].map(([x,y],i)=>`<ellipse class="twinkle" style="animation-delay:${i*.9}s" cx="${x}" cy="${y}" rx="3" ry=".9" fill="#fff" opacity=".8"/>`).join('')}
    <path d="M275 205 a6 3 0 1 0 0.1 0 Z" fill="${C.g('#7FCB7A')}"/>
    ${peb.map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="${3.5+i%3}" ry="${2.4+i%2*.6}" fill="${C.g(i%2?'#D8D0E6':'#E8DFD2')}"/>`).join('')}`}
/* 蔬菜：黏土版（取代 emoji） */
function clayCrop(C,k,x,y,s=1){const t=`transform="translate(${x} ${y}) scale(${s})"`;
  if(k==='carrot')return `<g ${t}><g transform="translate(0 9)"><path d="M-3 -16 Q-6 -24 -2 -27 M0 -16 Q0 -26 3 -28 M3 -16 Q7 -23 9 -24" stroke="#6FBF6E" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M-6 -16 Q0 -19 6 -16 Q4 -4 0 2 Q-4 -4 -6 -16 Z" fill="${C.g('#FFA552')}" ${C.sh}/><path d="M-3 -11 h3 M-1 -6 h3" stroke="${tint('#FFA552',-.2)}" stroke-width="1" stroke-linecap="round"/></g></g>`;
  if(k==='tomato')return `<g ${t}><circle cx="0" cy="-8" r="8.5" fill="${C.g('#FF7B6B')}" ${C.sh}/>${shine(-3,-12,2.6,1.6,.6)}
    <path d="M-5 -16 L0 -14 L5 -16 L2 -13 L0 -17 L-2 -13 Z" fill="#6FBF6E" stroke="#6FBF6E" stroke-width="1.4" stroke-linejoin="round"/></g>`;
  return `<g ${t}><path d="M-6 0 Q-9 -14 -2 -24 Q-1 -12 0 0 Z" fill="${C.g('#86D283')}"/><path d="M6 0 Q9 -14 2 -24 Q1 -12 0 0 Z" fill="${C.g('#7FCB7A')}"/>
    <ellipse cx="0" cy="-12" rx="4.6" ry="11" fill="${C.g('#FFD86B')}" ${C.sh}/>${shine(-1.6,-17,1.4,3,.55)}</g>`}
function claySprout(C,x,base,st,big=1){const h=(4+st*4)*big,lw=(2.2+st)*big,lh=(1.5+st*.6)*big;
  return `<path d="M${x} ${base} v-${h}" stroke="#5DAF62" stroke-width="${2.4*big}" stroke-linecap="round"/>
    <ellipse cx="${x-lw*.9}" cy="${base-h+lh}" rx="${lw}" ry="${lh}" fill="${C.g('#86D283')}" transform="rotate(-22 ${x-lw*.9} ${base-h+lh})"/>
    <ellipse cx="${x+lw*.9}" cy="${base-h+lh*1.3}" rx="${lw}" ry="${lh}" fill="${C.g('#6FBF6E')}" transform="rotate(22 ${x+lw*.9} ${base-h+lh*1.3})"/>`}
function clayGardenBed(C,crop){let pl='';
  if(crop){const st=crop.st||0;for(let i=0;i<3;i++){const x=34+i*20;pl+=st>=3?clayCrop(C,crop.k,x,236,.75):claySprout(C,x,234,st)}}
  return `${groundSh(C,52,244,40,4)}<rect x="16" y="226" width="72" height="18" rx="7" fill="${C.v('#C99467',.2)}" ${C.sh}/>
    <rect x="20" y="228.5" width="64" height="8" rx="4" fill="${C.v('#8A5E3F',.1)}"/>${pl}`}
const FLOWER_COL=['#FF8A80','#FFB3D1','#FFD86B','#B9A0F0'];
function clayFlower(C,x,y,c,r=5){return `<g class="amb-sway" style="animation-delay:-${(x%7)*.6}s;animation-duration:${4+x%3}s"><path d="M${x} ${y} q-1 ${r*1.6} 0 ${r*2.8}" stroke="#5DAF62" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="${x+r*.7}" cy="${y+r*2}" rx="${r*.55}" ry="${r*.28}" fill="#7FCB7A" transform="rotate(-30 ${x+r*.7} ${y+r*2})"/>
    ${[0,1,2,3,4].map(k=>{const a=k*1.2566-1.57;return `<circle cx="${(x+Math.cos(a)*r*.62).toFixed(1)}" cy="${(y+Math.sin(a)*r*.62).toFixed(1)}" r="${r*.5}" fill="${C.g(c,.35)}"/>`}).join('')}
    <circle cx="${x}" cy="${y}" r="${r*.36}" fill="${C.g('#FFE9A0',.5)}"/></g>`}
function clayFlowers(C,n){let f='';for(let i=0;i<n;i++)f+=clayFlower(C,16+i*15,206-(i%2)*6,FLOWER_COL[i%4]);return f}
function clayCloud(C,x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95"><ellipse cx="0" cy="4" rx="26" ry="7" fill="#C9DDF0" opacity=".5" ${C.blur}/>
    <circle cx="-12" cy="0" r="9" fill="${C.g('#FFFFFF',0,-.06)}"/><circle cx="2" cy="-5" r="12" fill="${C.g('#FFFFFF',0,-.06)}"/><circle cx="15" cy="0" r="8" fill="${C.g('#FFFFFF',0,-.06)}"/>
    <rect x="-20" y="-1" width="42" height="9" rx="4.5" fill="#FBFDFF"/></g>`}
function claySky(C,night,bg,rainbow){
  const sky=night?[['0','#3A3F78'],['1','#5A5E9A']]:bg==='rainbow'?[['0','#FFE3EA'],['.5','#FFF3D6'],['1','#E9F7E1']]:bg==='night'?[['0','#CFC6F5'],['1','#EDE8FF']]:bg==='sky'?[['0','#BFE3FF'],['1','#EAF6FF']]:[['0','#D6EEFF'],['1','#F2FAFF']];
  let v=`<rect width="360" height="250" fill="${C.lin('sky'+(night?'n':bg||''),sky)}"/>`;
  if(night)v+=[[30,30],[90,18],[150,40],[210,20],[260,50],[40,80],[120,70],[300,80],[340,24]].map(([x,y],i)=>`<circle class="twinkle" style="animation-delay:${i*.4}s" cx="${x}" cy="${y}" r="1.8" fill="#FFF8DC"/>`).join('')
    +`<circle cx="318" cy="38" r="20" fill="${C.glow('moonglow','#FFF3C4')}"/><circle cx="318" cy="38" r="15" fill="${C.g('#FFF3C4',.4)}"/><circle cx="326" cy="32" r="13" fill="#454A86"/>`;
  else if(bg==='night')v+=[[30,30],[90,18],[150,40],[210,20],[260,50],[40,80],[120,70]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('');
  if(!night&&bg!=='night')v+=`<circle class="amb-glow" cx="322" cy="34" r="30" fill="${C.glow('sunglow','#FFE7A0')}"/><circle cx="322" cy="34" r="17" fill="${C.g('#FFD978',.5)}" ${C.sh}/>
    <g class="bird"><path class="flapy" d="M-5 0 q2.5 -4 5 0 q2.5 -4 5 0" stroke="#8C93B8" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><g class="bird" style="animation-delay:-1.2s"><path class="flapy" d="M-16 7 q2 -3 4 0 q2 -3 4 0" stroke="#8C93B8" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>${shine(316,28,5,3,.55)}
    <g class="cloud">${clayCloud(C,60,40)}</g><g class="cloud" style="animation-delay:-22s;animation-duration:55s">${clayCloud(C,160,62,.7)}</g>`;
  if(rainbow)v+=`<g fill="none" stroke-width="7" stroke-linecap="round" opacity=".8">${['#FF9A8E','#FFC27A','#FFE38A','#A6DC94','#9CC2F5','#C6AEF2'].map((c,i)=>`<path d="M${60+i*8} 130 A${120-i*8} ${100-i*8} 0 0 1 ${300-i*8} 130" stroke="${c}"/>`).join('')}</g>`;
  /* 遠景：淡淡的遠山和小樹林，顏色越遠越淡 */
  v+=`<path d="M0 138 Q50 96 110 124 Q170 84 240 122 Q300 98 360 126 V160 H0Z" fill="${night?'#5E659F':'#DDEBF3'}" opacity=".9"/>
    <path d="M0 146 Q70 118 140 138 Q220 112 290 134 Q330 124 360 132 V170 H0Z" fill="${night?'#56709A':'#D3ECCB'}"/>
    ${[[14,136,7],[30,132,9],[118,130,7],[132,133,5],[168,126,8],[184,130,6],[232,124,7],[340,128,8]].map(([x,y,r])=>`<rect x="${x-.8}" y="${y}" width="1.6" height="${r}" fill="${night?'#4B5F86':'#B9C9A8'}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${night?'#4F6B90':'#BFE0B8'}"/>`).join('')}`;
  v+=`<path d="M0 150 Q90 128 180 146 T360 140 V250 H0Z" fill="${C.lin('hill1',[[0,'#CDEBB5'],[1,'#B5DE9B']])}"/>
    <path d="M0 176 Q120 160 240 172 T360 168 V250 H0Z" fill="${C.lin('hill2',[[0,'#B9E2A0'],[1,'#9FD488']])}"/>
    ${[[20,172,9],[338,166,8],[196,168,6]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.g('#98D488',.3)}"/><circle cx="${x+r*.9}" cy="${y+2}" r="${r*.7}" fill="${C.g('#8ACB7B',.3)}"/>`).join('')}
    ${[[70,200],[150,186],[300,230],[230,240],[120,230]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="1.6" fill="#8ACB7B" opacity=".45"/>`).join('')}`;
  return v}
function clayCornerSign(C,x,y,col,ico){return `<g transform="translate(${x} ${y+3}) scale(.8)">${groundSh(C,0,14,13,3)}
    <rect x="-2.2" y="-6" width="4.4" height="20" rx="2.2" fill="${C.v('#C99467')}" ${C.sh}/>
    <rect x="-15" y="-25" width="30" height="23" rx="9" fill="${C.v('#FFFBF2',.3,-.06)}" stroke="${tint(col,.15)}" stroke-width="2.6" ${C.sh}/>
    <text x="0" y="-8.5" text-anchor="middle" font-size="14">${ico}</text></g>`}

/* ---------- 暫代怪獸（還沒有 3D 圖的 8 隻）：黏土版 ---------- */
function clayMon(c,x,y,w,mood){const cx=x+w/2,cy=y+w*.58,r=w*.36,C=Clay('pm'+c.slice(1));
  const ink='#4A3A33';
  const mouth=mood?`<path d="M${cx-r*.26} ${cy+r*.42} Q${cx} ${cy+r*.2} ${cx+r*.26} ${cy+r*.42}" stroke="${ink}" stroke-width="${r*.08}" fill="none" stroke-linecap="round"/>`
    :`<path d="M${cx-r*.26} ${cy+r*.26} Q${cx} ${cy+r*.52} ${cx+r*.26} ${cy+r*.26}" stroke="${ink}" stroke-width="${r*.08}" fill="none" stroke-linecap="round"/>`;
  const brow=mood?`<path d="M${cx-r*.5} ${cy-r*.32} l${r*.28} ${r*.1} M${cx+r*.5} ${cy-r*.32} l${-r*.28} ${r*.1}" stroke="${ink}" stroke-width="${r*.07}" stroke-linecap="round"/>`:'';
  const body=`<path d="M${cx-r} ${cy+r*.15} Q${cx-r} ${cy-r*1.1} ${cx} ${cy-r*1.08} Q${cx+r} ${cy-r*1.1} ${cx+r} ${cy+r*.15} Q${cx+r*1.02} ${cy+r} ${cx} ${cy+r*1.02} Q${cx-r*1.02} ${cy+r} ${cx-r} ${cy+r*.15} Z" fill="${C.g(c,.4,-.18)}" ${C.sh}/>`;
  const out=`${body}
    <ellipse cx="${cx-r*.92}" cy="${cy+r*.2}" rx="${r*.18}" ry="${r*.3}" fill="${C.g(c,.3,-.2)}" transform="rotate(20 ${cx-r*.92} ${cy+r*.2})"/>
    <ellipse cx="${cx+r*.92}" cy="${cy+r*.2}" rx="${r*.18}" ry="${r*.3}" fill="${C.g(c,.3,-.2)}" transform="rotate(-20 ${cx+r*.92} ${cy+r*.2})"/>
    <ellipse cx="${cx-r*.42}" cy="${cy+r*1.0}" rx="${r*.24}" ry="${r*.12}" fill="${tint(c,-.12)}"/><ellipse cx="${cx+r*.42}" cy="${cy+r*1.0}" rx="${r*.24}" ry="${r*.12}" fill="${tint(c,-.12)}"/>
    <ellipse cx="${cx}" cy="${cy+r*.45}" rx="${r*.5}" ry="${r*.4}" fill="${tint(c,.45)}" opacity=".55"/>
    ${shine(cx-r*.38,cy-r*.62,r*.3,r*.16,.45)}
    <ellipse cx="${cx-r*.32}" cy="${cy-r*.06}" rx="${r*.14}" ry="${r*.17}" fill="${ink}"/><ellipse cx="${cx+r*.32}" cy="${cy-r*.06}" rx="${r*.14}" ry="${r*.17}" fill="${ink}"/>
    <circle cx="${cx-r*.27}" cy="${cy-r*.12}" r="${r*.05}" fill="#fff"/><circle cx="${cx+r*.37}" cy="${cy-r*.12}" r="${r*.05}" fill="#fff"/>
    <ellipse cx="${cx-r*.62}" cy="${cy+r*.22}" rx="${r*.14}" ry="${r*.09}" fill="#FF8FA8" opacity=".5"/><ellipse cx="${cx+r*.62}" cy="${cy+r*.22}" rx="${r*.14}" ry="${r*.09}" fill="#FF8FA8" opacity=".5"/>${brow}${mouth}`;
  return C.defs()+out}

/* ---------- 環境小生命（v19）：白天蝴蝶、晚上螢火蟲；畫在最前面，不擋手指 ---------- */
function clayAmbient(C,night){
  const bf=(cls,c)=>`<g class="bfly ${cls}"><g class="flap"><ellipse cx="-3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="-2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/><ellipse cx="2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/></g><rect x="-.6" y="-3" width="1.2" height="7" rx=".6" fill="#6B5A52"/></g>`;
  if(night)return `<g pointer-events="none">${[[40,150],[110,190],[170,140],[230,170],[300,200],[330,150],[80,225]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><g class="ffly" style="animation-delay:-${i*1.3}s;animation-duration:${7+i%4}s"><circle r="5" fill="${C.glow('ffglow','#FFF59A')}"/><circle r="1.3" fill="#FFFBD0"/></g></g>`).join('')}</g>`;
  return `<g pointer-events="none">${bf('b1','#FFB3D1')}${bf('b2','#B9A0F0')}${bf('b3','#FFD86B')}</g>`}
