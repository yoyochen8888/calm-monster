/* 怪獸圖鑑與介紹、主角、家園、大人給星星、商店 */
/* ---------- monster dex ---------- */
function renderDex(){
  $('#dex').innerHTML=visibleEmo().map(k=>[k,EMO[k]]).map(([k,e])=>{const xp=store.xp[k]||0,l=lvOf(xp),nx=nextOf(xp);
    return `<button class="pick" data-md="${k}">${monster(k,80)}<b>${e.name}</b><span class="cname" style="background:${e.color}">${e.cname}</span>
      <span class="lvtag">Lv.${l} ${TITLES[l-1]}</span><div class="xpbar"><i style="width:${nx.pct}%"></i></div><span class="lvtag">點我認識牠 ›</span></button>`}).join('');
  $$('[data-md]').forEach(b=>b.onclick=()=>{S.mdK=b.dataset.md;go(22)});
  const hid=Object.keys(EMO).length-visibleEmo().length;
  $('#dex').insertAdjacentHTML('afterend',hid?`<p class="hint" id="dexMore">還有 ${hid} 隻怪獸，長大一點就會遇到牠們（大人可以在「換主角 / 年齡」調整年齡）</p>`:'');
  $('#critDexSub').textContent=`安靜觀察拍到的小動物：${critFound()} / ${Object.keys(CRIT).length}`;
  const dm=$$('#dexMore');if(dm.length>1)dm.slice(0,-1).forEach(x=>x.remove());
}

/* ---------- hero ---------- */
/* 主角 3D 圖：帽子位置依每隻動物的頭頂調整 [往下移, 放大] */
const HERO_FIT={fox:[-17,1.25],bear:[-23,1.3],rabbit:[-1,0.95],cat:[-19,1.25]};
function hero(type,size=90,eqo){const eq=eqo||store.equip||{};const [hy,hs]=HERO_FIT[type]||[0,1];
  const cape=eq.hback==='cape'?`<path d="M26 58 Q50 50 74 58 L86 114 Q50 124 14 114Z" fill="#E4574B"/><path d="M26 58 Q50 50 74 58" stroke="#B8382F" stroke-width="3" fill="none"/>`:'';
  const pack=eq.hback==='pack'?`<rect x="70" y="58" width="22" height="34" rx="8" fill="#5B8DEF"/><rect x="75" y="66" width="12" height="7" rx="2" fill="#3E6FD0"/>`:'';
  const hat=eq.hhead==='straw'?`<ellipse cx="50" cy="22" rx="34" ry="7" fill="#E9C46A"/><path d="M34 22 Q36 4 50 4 Q64 4 66 22Z" fill="#F2D384"/><rect x="34" y="15" width="32" height="5" fill="#E76F51"/>`
    :eq.hhead==='wizard'?`<path d="M28 24 L54 -14 L72 24Z" fill="#7B5CC9"/><ellipse cx="50" cy="24" rx="27" ry="5" fill="#5E43A8"/><circle cx="54" cy="-13" r="4" fill="#FFD166"/><path d="M50 4 l2 -5 l2 5 l5 1 l-4 3 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -3z" fill="#FFD166"/>`:'';
  return `<svg width="${size}" height="${Math.round(size*1.36)}" viewBox="0 -16 100 136" overflow="visible">${cape}${pack}
    <image href="img/hero_${type}.webp" x="-18" y="-16" width="136" height="136"/>
    ${hat?`<g transform="translate(50 22) scale(${hs}) translate(-50 ${-22+hy/hs})">${hat}</g>`:''}</svg>`;
}
let heroPick=null;
function renderHeroes(){
  heroPick=heroPick||(store.hero&&store.hero.type);
  $('#heroes').innerHTML=Object.entries(HEROES).map(([k,h])=>`<button class="pick ${heroPick===k?'sel':''}" data-hero="${k}">${hero(k,80,{})}<b>${h.name}</b></button>`).join('');
  $$('[data-hero]').forEach(b=>b.onclick=()=>{heroPick=b.dataset.hero;tone(600,.12);renderHeroes()});
  if(store.hero&&!$('#heroNameIn').value)$('#heroNameIn').value=store.hero.name;
  $('#heroOk').disabled=!heroPick;
}
$('#heroOk').onclick=()=>{const nm=$('#heroNameIn').value.trim()||HEROES[heroPick].name;store.hero={type:heroPick,name:nm};save();chime();go(10)};
$('#toAge').onclick=()=>go(0);

/* ---------- home ---------- */
const SPOTS={tree:[[0,0],[250,0],[140,-6]],flowers:[[0,0],[236,0],[120,-22]],tent:[[0,0],[-84,14],[96,22]],lamp:[[0,0],[-204,14],[100,4]],
  swing:[[0,0],[-262,0],[-150,8]],pond:[[0,0],[-178,22],[-86,26]],house:[[0,0],[-236,0],[-128,-6]],garden:[[0,0],[230,0],[110,-4]]};
const CROPS={carrot:['🥕','紅蘿蔔'],tomato:['🍅','番茄'],corn:['🌽','玉米']};
const REAL_TASKS=['幫家裡的植物澆水','幫忙擺碗筷','把自己的玩具收好','幫忙洗一樣菜或水果','跟家人說一件今天開心的事','抱抱家人說謝謝','自己把書包整理好','幫忙把衣服放進洗衣籃'];
const HOME_PEP=['謝謝你照顧我們！','我今天也有好好呼吸喔','我們一起住在這裡真好'];
function posOf(id){const p=store.pos[id];if(p&&typeof p==='object')return [p.x,p.y];const sp=SPOTS[id];return sp?sp[(p||0)%sp.length]:[0,0]}
/* 冷靜角落：怪獸 Lv.4（冷靜高手）解鎖，點了直接練習那個方法 */
const CORNERS={angry:{ico:'🚦',name:'紅綠燈小路',act:'light',x:30,y:150},sad:{ico:'☂️',name:'雨傘小涼亭',act:'butterfly',x:84,y:132},
  defiant:{ico:'🏅',name:'小頒獎台',act:'squeeze',x:196,y:128},stuck:{ico:'👣',name:'腳印小徑',act:'breathe',x:150,y:226},
  scared:{ico:'🛡️',name:'安心樹屋',act:'senses',x:312,y:122},wronged:{ico:'💬',name:'說話小信箱',act:'butterfly',x:236,y:226},
  reluctant:{ico:'⏳',name:'說再見小站',act:'light',x:62,y:214},jealous:{ico:'⭐',name:'我的好星星牆',act:'breathe',x:272,y:140},
  shy:{ico:'🐢',name:'小烏龜殼屋',act:'butterfly',x:122,y:126},hyper:{ico:'🐌',name:'蝸牛慢慢道',act:'light',x:338,y:204},
  embarrassed:{ico:'🎭',name:'沒關係小舞台',act:'squeeze',x:20,y:196},guilty:{ico:'🩹',name:'修復小站',act:'breathe',x:300,y:236},
  lonely:{ico:'🏮',name:'小燈籠亭',act:'butterfly',x:180,y:236},stress:{ico:'🎒',name:'放下背包椅',act:'squeeze',x:106,y:236}};
const CORNER_LV=4;
function cornersOpen(){return Object.keys(CORNERS).filter(k=>lvOf(store.xp[k]||0)>=CORNER_LV)}
function cornerSvg(k){const c=CORNERS[k],col=EMO[k].color;
  return `<g transform="translate(${c.x} ${c.y})"><ellipse cx="0" cy="14" rx="17" ry="4" fill="#000" opacity=".12"/>
    <rect x="-2" y="-6" width="4" height="20" rx="1.5" fill="#B07A52"/>
    <rect x="-15" y="-24" width="30" height="22" rx="7" fill="#FFF8EC" stroke="${col}" stroke-width="2.5"/>
    <text x="0" y="-8" text-anchor="middle" font-size="14">${c.ico}</text></g>`}
/* 晚上睡覺模式 */
function isNight(){if(S.forceNight!==undefined)return S.forceNight;const n=store.nightAt;if(!n)return false;const h=new Date().getHours();return h>=n||h<7}
function wrapIt(id,inner){const [dx,dy]=posOf(id);const ed=S.decor;
  return `<g data-it="${id}" transform="translate(${dx} ${dy})" ${ed?'class="decor-it"':''}>${inner}</g>`}
/* ---------- 家園小動態：走動、休息、跳一跳、東張西望（晚上睡覺、布置時暫停） ---------- */
const HOME_POS={};let wanderT=null;
const RM=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
function actDo(el,cls,ms){const a=el.querySelector('.act');if(!a)return;a.classList.remove('bob','walk','rest','hop','look');void a.getBoundingClientRect();a.classList.add(cls);
  if(ms)setTimeout(()=>{if(a.isConnected&&a.classList.contains(cls)){a.classList.remove(cls);a.classList.add('bob')}},ms)}
function startWander(){clearInterval(wanderT);if(RM||isNight()||S.decor)return;
  const actors=$$('#scene .actor');actors.forEach(el=>{el._next=performance.now()+800+Math.random()*2500});
  wanderT=setInterval(()=>{if(!actors.length||!actors[0].isConnected){clearInterval(wanderT);return}
    const now=performance.now();
    actors.forEach(el=>{if(now<el._next)return;const isHero=el.dataset.actor==='h';const r=Math.random();
      const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform)||[0,146,96];let x=+m[1],y=+m[2];
      if(r<.5){/* 走到附近 */const nx=Math.max(isHero?40:10,Math.min(isHero?250:300,x+(Math.random()*140-70))),ny=Math.max(isHero?84:146,Math.min(isHero?120:206,y+(Math.random()*40-20)));
        const dist=Math.hypot(nx-x,ny-y),dur=Math.max(1.2,dist/22);
        el.querySelector('.flip').classList.toggle('left',nx<x);
        el.style.transition=`transform ${dur}s linear`;el.style.transform=`translate(${nx.toFixed(1)}px,${ny.toFixed(1)}px)`;
        HOME_POS[isHero?'hero':el.dataset.mon]=[nx,ny];actDo(el,'walk',dur*1000);el._next=now+dur*1000+1500+Math.random()*3000}
      else if(r<.72){actDo(el,'rest',5000);el._next=now+6000+Math.random()*3000}
      else if(r<.86){actDo(el,'hop',1000);el._next=now+2500+Math.random()*2500}
      else{actDo(el,'look',2400);el._next=now+3500+Math.random()*2500}})},400)}
function scene(){
  const o=store.owned,g=store.grow;
  const night=isNight();
  const sky=night?'#2F3566':({sky:'#CFE9FF',rainbow:'#FFEFD6',night:'#D4CCF6'}[store.equip.bg]||'#E3F2FF');
  let v=`<svg viewBox="0 0 360 250" width="100%" style="display:block;border-radius:18px"><rect width="360" height="250" fill="${sky}"/>`;
  if(night)v+=[[30,30],[90,18],[150,40],[210,20],[260,50],[40,80],[120,70],[300,80],[340,24]].map(([x,y],i)=>`<circle class="twinkle" style="animation-delay:${i*.4}s" cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')+`<circle cx="318" cy="38" r="16" fill="#FFF3C4"/><circle cx="326" cy="32" r="14" fill="#2F3566"/>`;
  else if(store.equip.bg==='night')v+=[[30,30],[90,18],[150,40],[210,20],[260,50],[40,80],[120,70]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('');
  if(!night&&store.equip.bg!=='night')v+=`<circle cx="322" cy="34" r="18" fill="#FFE08A"/><g class="cloud"><ellipse cx="60" cy="40" rx="22" ry="8" fill="#fff" opacity=".8"/><ellipse cx="74" cy="34" rx="14" ry="8" fill="#fff" opacity=".8"/></g>`;
  if(o.includes('rainbowsky'))v+=`<g fill="none" stroke-width="7" opacity=".85">${['#F26B5B','#F5A524','#F7D046','#7CC47C','#5B8DEF','#9B7BE0'].map((c,i)=>`<path d="M${60+i*8} 130 A${120-i*8} ${100-i*8} 0 0 1 ${300-i*8} 130" stroke="${c}"/>`).join('')}</g>`;
  v+=`<path d="M0 150 Q90 128 180 146 T360 140 V250 H0Z" fill="#BFE3A6"/><path d="M0 176 Q120 160 240 172 T360 168 V250 H0Z" fill="#A6D68C"/>`;
  if(o.includes('house'))v+=wrapIt('house',`<g transform="translate(246 62)"><rect x="8" y="34" width="70" height="52" fill="#FBE3C4"/><path d="M0 38 L43 4 L86 38Z" fill="#E4574B"/><rect x="34" y="56" width="18" height="30" fill="#B07A52"/><rect x="14" y="46" width="14" height="12" fill="#BFE3FF"/><rect x="58" y="46" width="14" height="12" fill="#BFE3FF"/></g>`);
  if(o.includes('tree')){const st=g.tree||1,sc=[.6,.8,1][st-1];v+=wrapIt('tree',`<g transform="translate(52 162) scale(${sc})"><rect x="-7" y="-52" width="14" height="52" fill="#9C6B3C"/><circle cx="0" cy="-74" r="32" fill="#5DBB63"/><circle cx="-20" cy="-58" r="20" fill="#6CCB70"/><circle cx="20" cy="-60" r="20" fill="#4FAE55"/>${st>=3?`<circle cx="-12" cy="-80" r="5" fill="#F26B5B"/><circle cx="14" cy="-68" r="5" fill="#F26B5B"/>`:''}</g>`)}
  if(o.includes('tent'))v+=wrapIt('tent',`<g transform="translate(96 112)"><path d="M0 46 L32 0 L64 46Z" fill="#F5A524"/><path d="M32 0 L22 46 H42Z" fill="#C97F0B"/></g>`);
  if(o.includes('lamp'))v+=wrapIt('lamp',`<g transform="translate(226 98)"><circle cx="0" cy="8" r="17" fill="#FFE89A" opacity=".35"/><rect x="-2" y="12" width="4" height="56" fill="#666"/><circle cx="0" cy="8" r="9" fill="#FFE89A"/></g>`);
  if(o.includes('swing'))v+=wrapIt('swing',`<g transform="translate(296 140)"><path d="M0 70 L8 0 L48 0 L56 70" stroke="#9C6B3C" stroke-width="5" fill="none"/><path d="M20 0 V48 M36 0 V48" stroke="#777" stroke-width="2"/><rect x="15" y="46" width="26" height="6" rx="2" fill="#E4574B"/></g>`);
  if(o.includes('pond')){const n=Math.max(1,store.fish||1);let f='';for(let i=0;i<n;i++){const x=226+i*11,y=203+(i%2)*6,c=['#F5A524','#F26B5B','#F7D046','#FF9EC4','#9B7BE0'][i%5];
      f+=`<g class="fish" style="animation-delay:${i*.6}s"><path d="M${x} ${y} q5 -4 10 0 q-5 4 -10 0z M${x+10} ${y} l4 -3 v6z" fill="${c}"/></g>`}
    v+=wrapIt('pond',`<ellipse cx="250" cy="206" rx="44" ry="14" fill="#7CC5F0"/><ellipse cx="236" cy="202" rx="13" ry="3" fill="#fff" opacity=".6"/>${f}`)}
  if(o.includes('garden')){const c=store.crop;let pl='';
    if(c){const st=c.st||0;for(let i=0;i<3;i++){const x=34+i*20;pl+=st>=3?`<text x="${x}" y="236" text-anchor="middle" font-size="15">${CROPS[c.k][0]}</text>`
      :`<path d="M${x} 236 v-${4+st*4}" stroke="#3E9B47" stroke-width="2.5"/><ellipse cx="${x-3}" cy="${232-st*4}" rx="${2+st}" ry="${1.5+st*.6}" fill="#5DBB63"/><ellipse cx="${x+3}" cy="${232-st*4}" rx="${2+st}" ry="${1.5+st*.6}" fill="#4FAE55"/>`}}
    v+=wrapIt('garden',`<rect x="16" y="226" width="72" height="18" rx="6" fill="#9C6B3C"/><path d="M22 232 H82 M22 238 H82" stroke="#7A5230" stroke-width="1.5"/>${pl}`)}
  if(o.includes('flowers')){const n=(g.flowers||1)*2;let f='';for(let i=0;i<n;i++){const x=16+i*15,y=206-(i%2)*6,c=['#F26B5B','#FFB3D1','#F7D046','#9B7BE0'][i%4];
    f+=`<path d="M${x} ${y} v14" stroke="#4FAE55" stroke-width="2"/><circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`}v+=wrapIt('flowers',f)}
  cornersOpen().forEach(k=>{v+=wrapIt('c_'+k,`<g data-corner="${k}" class="corner">${cornerSvg(k)}</g>`)});
  // 情緒怪獸入住：一起冷靜過（有經驗）就搬進來
  const fr=Object.keys(EMO).filter(k=>(store.xp[k]||0)>0);
  const pos=[[96,150],[216,152],[70,186],[244,190],[124,196],[182,200],[40,160],[290,170],[150,214],[260,214],[20,214],[310,150],[200,176],[100,222]];
  fr.forEach((k,i)=>{const [px,py]=HOME_POS[k]||pos[i];v+=`<g data-mon="${k}" data-actor="m" class="homemon actor" style="transform:translate(${px}px,${py}px);${S.decor?'pointer-events:none;opacity:.55':''}"><g class="flip"><g class="act ${night?'sleepy':'bob'}" style="animation-delay:${i*.5}s">${monster(k,42)}</g></g>${night?`<text class="zzz" x="34" y="6" font-size="10" fill="#fff">Z<tspan font-size="7" dy="-4">z</tspan></text>`:''}</g>`});
  if(store.hero){const [hx,hy]=HOME_POS.hero||[146,96];v+=`<g data-actor="h" class="actor" style="pointer-events:none;transform:translate(${hx}px,${hy}px)"><g class="flip"><g class="act ${night?'sleepy':'bob'}">${hero(store.hero.type,64)}</g></g></g>`;}
  if(night)v+=`<rect width="360" height="250" fill="#1A1F45" opacity=".28" pointer-events="none"/>`;
  if(!fr.length)v+=`<text x="180" y="244" text-anchor="middle" font-size="11" fill="#5A7A50">去冷靜站陪一隻怪獸冷靜，牠就會搬進家園喔</text>`;
  return v+`</svg>`;
}
function bindScene(){
  const svg=$('#scene svg');
  if(S.decor&&svg){svg.style.touchAction='none';
    $$('#scene [data-it]').forEach(el=>{el.onpointerdown=ev=>{ev.preventDefault();const id=el.dataset.it;const [x0,y0]=posOf(id);
      const k=360/svg.getBoundingClientRect().width,sx=ev.clientX,sy=ev.clientY;let nx=x0,ny=y0;try{el.setPointerCapture(ev.pointerId)}catch(e){}el.classList.add('dragging');
      el.onpointermove=e=>{nx=Math.max(-330,Math.min(330,x0+(e.clientX-sx)*k));ny=Math.max(-180,Math.min(120,y0+(e.clientY-sy)*k));el.setAttribute('transform',`translate(${nx.toFixed(1)} ${ny.toFixed(1)})`)};
      el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;el.classList.remove('dragging');store.pos[id]={x:Math.round(nx),y:Math.round(ny)};save();tone(520,.06)}}})}
  $$('#scene [data-corner]').forEach(el=>el.onclick=()=>{if(S.decor)return;const k=el.dataset.corner,c=CORNERS[k];
    toast(`${c.ico} ${EMO[k].name}的${c.name}：一起練習${ACT_NAME[c.act]}`);startPractice(k,c.act)});
  $$('#scene [data-mon]').forEach(el=>el.onclick=()=>{if(S.decor)return;const k=el.dataset.mon,e=EMO[k],l=lvOf(store.xp[k]||0),b=BADGE[k];
    const line=stageOf(l)>=2?`我學會了${b[1]}：${b[2]}！`:HOME_PEP[Math.floor(Math.random()*HOME_PEP.length)];
    toast(`${e.name}：「${line}」`);speak(line);actDo(el,'hop',900)});
  startWander();
}
function renderHome(){
  if(!store.hero){go(12,true);return}
  const px=store.pxp||0,pl=lvIn(PLV,px),pn=nextIn(PLV,px);
  $('#heroName').textContent=store.hero.name;
  $('#heroLv').textContent=`Lv.${pl} ${PTITLES[pl-1]}`+(pn.need?`・再 ${pn.need} 經驗升級`:'');
  $('#heroXp').style.width=pn.pct+'%';$('#homeStars').textContent=store.stars||0;
  $('#scene').innerHTML=scene();bindScene();
  $('#decorBar').style.display=S.decor?'':'none';
  $('#hWaterSub').textContent=S.decor?'布置中…':'拖拉家具換位置';
  renderChores();
  $('#hGamesSub').textContent=store.gameDay.routine===today()?'今天玩過了，再玩也可以':'小遊戲和親子遊戲';
  const vb=$('#voucherBox');vb.innerHTML='';
  store.vouchers.forEach(v=>{const d=document.createElement('div');d.className='task';d.style.background='#EAF6F3';
    d.innerHTML=`<span>🎟 兌換券：<b>${v.name}</b></span>`;
    d.appendChild(holdBtn('大人按住確認已兌現',2000,()=>{store.vouchers=store.vouchers.filter(x=>x.id!==v.id);save();chime();toast(`兌現了：${v.name}！`);renderHome()}));
    vb.appendChild(d)});
  const wk=weekInfo();$('#hWeekSub').textContent=`本週完成 ${wk.doneCells} 格`;
  const rb=$('#repairBox');rb.innerHTML='';
  store.repairs.forEach(r=>{const d=document.createElement('div');d.className='task';
    d.innerHTML=`<span>🔧 修復任務：<b>${r.text}</b></span>`;
    d.appendChild(holdBtn('大人按住確認完成',2000,()=>{store.repairs=store.repairs.filter(x=>x.id!==r.id);save();gain('負起責任，完成修復',15);renderHome()}));
    rb.appendChild(d)});
  const md=store.moodDay===today()?store.mood:null;
  $('#moods').innerHTML=MOODS.map(([f,t])=>`<button class="${md===t?'sel':''}" data-mood="${t}">${f}<span>${t}</span></button>`).join('');
  $$('[data-mood]').forEach(b=>b.onclick=()=>{const m=MOODS.find(x=>x[1]===b.dataset.mood);
    if(store.moodDay!==today()){store.moodDay=today();store.mood=m[1];store.moodLog.push({d:today(),m:m[1]});store.moodLog=store.moodLog.slice(-90);save();gain('心情打卡',3)}else{store.mood=m[1];save()}
    renderHome();
    $('#moodMsg').innerHTML=m[2]?'太好了！把好心情存起來。心情好的時候，也可以先「平時練習」喔。':`謝謝你說出來。要不要去冷靜站，讓${m[1]}的怪獸變小？<br><button class="btn small" id="moodGo" style="margin-top:8px">去冷靜站</button>`;
    const g=$('#moodGo');if(g)g.onclick=startFlow;});
}
$('#hStart').onclick=startFlow;
function startPractice(emo,act){resetFlow();store.day.n--;save();S.practice=true;S.emo=emo||'scared';S.act=act||'breathe';go(3)}
$('#hGames').onclick=()=>go(17);
$('#hWater').onclick=()=>{const has=SHOP.some(x=>x.cat==='home'&&SPOTS[x.id]&&store.owned.includes(x.id))||cornersOpen().length;
  if(!has){toast('先去商店買家具，才能布置喔');S.shopCat='home';go(11);return}
  if(isNight()){toast('晚上了，大家都在睡覺，明天再布置吧 🌙');return}
  S.decor=!S.decor;renderHome();if(S.decor)toast('用手指按住家具，拖到你喜歡的地方')};
$('#decorDone').onclick=()=>{S.decor=false;renderHome();toast('布置好了！')};
/* 家園小工作：每天各一次、幾秒鐘就做完；不做也不會枯萎或生病（不製造焦慮） */
function renderChores(){
  const o=store.owned,t=today(),box=$('#chores');const rows=[];
  if(isNight()){box.innerHTML=`<p class="choreh">🌙 晚上了</p><p class="hint" style="text-align:left;margin:4px 0">怪獸們和${store.hero?store.hero.name:'你'}都睡了，家園工作明天再做。<br>需要冷靜的時候，冷靜站和「🆘 馬上冷靜」都還可以用。晚安！</p>`;return}
  const plants=SHOP.filter(x=>x.plant&&o.includes(x.id));const hasG=o.includes('garden');
  if(plants.length||hasG)rows.push(store.waterDay===t?['💧','澆水','今天澆過了 ✓',null]:['💧','澆水','花草和菜都會長大一點','water']);
  if(o.includes('pond'))rows.push(store.fishDay===t?['🐟','餵魚',`吃飽了 ✓（${store.fish||1} 條魚）`,null]:['🐟','餵魚',`餵 3 天會多一條魚（${store.fish||1}/5）`,'feed']);
  if(hasG){const c=store.crop;
    if(!c)rows.push(['🌱','種菜','選一種種子種下去','seed']);
    else if((c.st||0)>=3)rows.push([CROPS[c.k][0],'收成',`${CROPS[c.k][1]}長好了！`,'harvest']);
    else rows.push([CROPS[c.k][0],CROPS[c.k][1],`再澆 ${3-(c.st||0)} 天水就能收成`,null]);}
  const rt=REAL_TASKS[(new Date().getDate()+(store.rtOff||0))%REAL_TASKS.length];
  rows.push(store.realDay===t?['🏡','真實家事','今天做到了 ✓',null]:['🏡','真實家事',`今天試試：${rt}`,'real']);
  const left=rows.filter(r=>r[3]).length;
  box.innerHTML=`<p class="choreh">🧺 今天的家園小工作</p>`+rows.map(r=>`<div class="chore ${r[3]?'':'done'}"><span class="ci">${r[0]}</span><span class="ct"><b>${r[1]}</b><small>${r[2]}</small></span>${r[3]==='real'?'<span class="slot"></span>':r[3]?`<button class="btn small" data-ch="${r[3]}">${r[3]==='seed'?'種':r[3]==='harvest'?'收成':'做'}</button>`:''}</div>`).join('')
    +(left===0?`<p class="hint choredone">🌞 今天的家園工作都完成了！怪獸們要去休息了，你也去玩真的遊戲、找家人說說話吧。</p>`:'')
    +(!plants.length&&!hasG&&!o.includes('pond')?`<p class="hint">在商店買小菜園、池塘或植物，就有更多家園工作可以做。</p>`:'');
  const slot=box.querySelector('.slot');if(slot){slot.appendChild(holdBtn('大人按住確認',1500,()=>{store.realDay=t;save();gain('在家裡幫忙',5);chime();renderHome()}))}
  box.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{const k=b.dataset.ch;
    if(k==='water'){store.waterDay=t;plants.forEach(p=>store.grow[p.id]=Math.min(3,(store.grow[p.id]||1)+1));if(store.crop)store.crop.st=Math.min(3,(store.crop.st||0)+1);save();gain('照顧家園',2);tone(520,.15)}
    if(k==='feed'){store.fishDay=t;store.fed=(store.fed||0)+1;if(store.fed>=3&&(store.fish||1)<5){store.fed=0;store.fish=(store.fish||1)+1;toast('🐟 池塘裡多了一條小魚！')}save();gain('照顧家園',2)}
    if(k==='seed'){box.querySelector(`[data-ch="seed"]`).parentElement.insertAdjacentHTML('afterend',`<div class="chips" id="seedPick">${Object.entries(CROPS).map(([id,c])=>`<button class="chip" data-seed="${id}">${c[0]} ${c[1]}</button>`).join('')}</div>`);
      b.remove();$$('[data-seed]').forEach(x=>x.onclick=()=>{store.crop={k:x.dataset.seed,st:0};save();tone(600,.12);toast(`種下${CROPS[x.dataset.seed][1]}了，每天澆水它會慢慢長大`);renderHome()});return}
    if(k==='harvest'){const c=store.crop;store.basket=store.basket||{};store.basket[c.k]=(store.basket[c.k]||0)+1;store.crop=null;save();gain('收成',5);chime();
      toast(`收成${CROPS[c.k][1]}！照顧需要耐心，就像陪情緒怪獸一樣 💛`,true)}
    renderHome()});
}
$('#hParent').onclick=()=>go(13);
$('#hWeek').onclick=()=>go(15);
$('#hLog').onclick=()=>go(14);
$('#hEdit').onclick=()=>go(12);

/* ---------- parent gives stars ---------- */
let goodPick=null;
function renderGoods(){
  const d=today();if(!store.pday||store.pday.d!==d)store.pday={d,n:0};
  const left=3-store.pday.n;
  $('#goods').innerHTML=GOODS.map(g=>`<button class="pick ${goodPick===g?'sel':''}" data-good="${g}" ${left<=0?'disabled':''}><b style="font-size:1rem">${g}</b></button>`).join('');
  $$('[data-good]').forEach(b=>b.onclick=()=>{goodPick=b.dataset.good;tone(600,.1);renderGoods()});
  const cb=$('#confirmBox');cb.innerHTML='';
  if(left<=0){cb.innerHTML='<p class="hint">今天已經給了 3 次星星，明天再繼續！也可以直接口頭稱讚孩子喔。</p>';return}
  if(goodPick){cb.innerHTML=`<p class="hint">今天還可以給 ${left} 次。說出具體的事，例如「你剛剛生氣時用說的，好棒」。</p>`;
    cb.appendChild(holdBtn('大人按住 2 秒確認 +10 ⭐',2000,()=>{store.pday.n++;save();gain(goodPick,10);goodPick=null;renderGoods()}))}
  else cb.innerHTML='<p class="hint">先選一件孩子做到的事</p>';
}

/* ---------- shop ---------- */
function renderShop(){
  S.shopCat=S.shopCat||'home';
  $('#shopStars').textContent=store.stars||0;
  $('#shopTabs').innerHTML=SHOP_CATS.map(([k,t])=>`<button class="chip ${S.shopCat===k?'sel':''}" data-cat="${k}">${t}</button>`).join('');
  $$('[data-cat]').forEach(b=>b.onclick=()=>{S.shopCat=b.dataset.cat;renderShop()});
  $('#shopHint').textContent=SHOP_HINT[S.shopCat];
  if(S.shopCat==='reward'){
    const cp=coupons();
    $('#shop').innerHTML=cp.map((c,i)=>`<div class="pick shopitem" style="cursor:default"><div class="shopicon">🎟</div><b style="font-size:1rem">${c.name}</b>
      <button class="btn small" data-cpn="${i}" ${store.stars<c.cost?'disabled':''}>${c.cost} ⭐ 換</button></div>`).join('')+
      `<div class="pick" style="cursor:default;display:flex;align-items:center;justify-content:center"><span>兌換券由大人在「大人看這裡」設定</span></div>`;
    $$('[data-cpn]').forEach(b=>b.onclick=()=>{const c=cp[+b.dataset.cpn];if(store.stars<c.cost)return;
      store.stars-=c.cost;store.vouchers.push({id:Date.now(),name:c.name});save();chime();toast(`換到「${c.name}」！拿給大人看，請大人兌現`,true);renderShop()});
    return;
  }
  const ht=store.hero?store.hero.type:'fox';
  $('#shop').innerHTML=SHOP.filter(it=>it.cat===S.shopCat).map(it=>{
    const own=store.owned.includes(it.id),on=it.slot&&store.equip[it.slot]===it.id;
    const prev=it.cat==='bg'?`<div class="swatch" style="background:${it.sw}"></div>`
      :it.cat==='home'?`<div class="shopicon">${it.ico}</div>`
      :it.cat==='hero'?hero(ht,62,{[it.slot]:it.id})
      :monster('angry',80,'',{eq:{head:null,neck:null,[it.slot]:it.id},level:1});
    const btn=it.cat==='home'?(own?`<button class="btn small ghost" disabled>已放進家園</button>`:`<button class="btn small" data-buy="${it.id}" ${store.stars<it.cost?'disabled':''}>${it.cost} ⭐ 買</button>`)
      :own?`<button class="btn small ${on?'':'ghost'}" data-eq="${it.id}">${on?'使用中':'使用'}</button>`
      :`<button class="btn small" data-buy="${it.id}" ${store.stars<it.cost?'disabled':''}>${it.cost} ⭐ 買</button>`;
    return `<div class="pick shopitem" style="cursor:default">${prev}<b>${it.name}</b>${btn}</div>`}).join('');
  $$('[data-buy]').forEach(b=>b.onclick=()=>{const it=SHOP.find(x=>x.id===b.dataset.buy);if(store.stars<it.cost)return;
    store.stars-=it.cost;store.owned.push(it.id);if(it.slot)store.equip[it.slot]=it.id;if(it.plant)store.grow[it.id]=1;save();chime();
    toast(it.cat==='home'?`${it.name}放進家園了！`:`買到${it.name}了！`);renderShop()});
  $$('[data-eq]').forEach(b=>b.onclick=()=>{const it=SHOP.find(x=>x.id===b.dataset.eq);
    store.equip[it.slot]=store.equip[it.slot]===it.id?null:it.id;save();tone(620,.12);renderShop()});
}
$('#openDex').onclick=()=>go(11);
$$('[data-tab]').forEach(b=>b.onclick=()=>{const t=+b.dataset.tab;if(t===1){startFlow();return}S.hist=[];go(t,true)});
$('#navBack').onclick=()=>{const p=S.hist.pop();go(p!==undefined?p:10,true)};
$('#navHome').onclick=()=>go(10);

/* ---------- monster detail ---------- */
const INTRO={
  angry:['當事情「不公平」、被打斷、東西被拿走，或事情不照你想的時候，牠就會跑出來。','臉熱熱、心跳變快、拳頭握緊、想大叫或想丟東西。','牠其實是在保護你，告訴你「有件事讓我很不舒服」。生氣沒有錯，但不可以傷害別人和東西。','先讓身體停下來（紅綠燈），把力氣用在安全的地方（戳泡泡、擠檸檬、打枕頭），等身體冷靜了再用說的。'],
  sad:['失去喜歡的東西、很期待的事沒有發生、被拒絕，或想念一個人的時候。','眼睛酸酸、喉嚨緊緊、沒有力氣、想哭。','牠在告訴你「這件事對我很重要」。難過的時候哭一哭沒關係。','慢慢呼吸、蝴蝶抱抱自己、找一個人抱抱，或把難過說出來、畫出來。'],
  defiant:['輸了、被比下去、覺得「我明明可以」或覺得不公平的時候。','心裡悶悶的、想爭辯、不想認輸、想再來一次。','牠代表你很在乎、很想做好。這份在乎是很棒的力量！','先擠檸檬把力氣放掉，跟昨天的自己比，說「再玩一次」，想想哪裡可以再練習。'],
  stuck:['事情太難、試了好幾次還是做不到，或跟你想的不一樣的時候。','想放棄、想把東西丟掉、覺得自己很笨。','牠想說的是「這件事有點難」，不是「你很笨」。你只是「還沒」做到。','先休息一下再回來，把事情切成小步驟，說「我還沒做到」，也可以請人幫忙。'],
  scared:['遇到新的事、不知道會發生什麼、怕犯錯或怕被罵的時候。','肚子怪怪的、心跳很快、手冰冰的、想躲起來。','牠想保護你，提醒你要小心一點。','慢慢呼吸、用五感找找身邊的東西、跟大人說你在擔心什麼，然後先試一小步。'],
  wronged:['被誤會、被冤枉、覺得沒有人聽你說的時候。','想哭又說不出來、胸口悶悶的、覺得好不公平。','牠想讓別人聽見你的想法。','先蝴蝶抱抱自己，找一個信任的人說出你的版本，或把事情畫下來。']
};
Object.assign(INTRO,{
  reluctant:['正在玩喜歡的東西要停下來、要離開好玩的地方，或要跟爸爸媽媽分開的時候。','想黏著不放手、腳不想動、想哭，或一直說「再一下下」。','牠想說「這個時光對我很重要」。捨不得代表你很喜歡。','先聽倒數提醒，玩最後一次，跟玩具或大人好好說再見，再約好下次。'],
  jealous:['看到別人有你想要的東西、別人被稱讚、或大人好像比較疼別人的時候。','心裡酸酸的、想把東西搶過來、說「我才不稀罕」。','牠想說「我也好想要」。想要不是壞事。','深呼吸，想想「我也有我的好」，也可以試著說「恭喜你」。'],
  shy:['見到不認識的人、要上台、要在很多人面前說話的時候。','臉熱熱的、聲音變小、想躲到大人後面。','牠想說「我需要一點時間熟悉」。害羞不是錯。','先在旁邊看一下，深呼吸，然後先揮揮手或說一個字就好。'],
  hyper:['玩得太開心、很多人一起鬧、等很久終於可以玩的時候。','身體停不下來、聲音越來越大、聽不到別人說話。','牠想說「我好開心」，只是油門踩太大了。','像紅綠燈一樣先停下來，像蝸牛一樣慢慢呼吸，喝口水再回來。'],
  embarrassed:['在別人面前出糗、說錯話、被笑的時候。','臉紅紅、好想消失、不想再去那個地方。','牠想說「我很在意別人怎麼看我」。','記得每個人都會出糗，深呼吸，笑一笑說「沒關係」，或找信任的人說說。'],
  guilty:['做錯事、弄壞東西、讓別人難過的時候。','心裡沉沉的、不敢看別人、想躲起來。','牠想說「我在乎別人」。知道自己做錯，代表你很善良。','先冷靜，說對不起，再想一個修復的方法去做。'],
  lonely:['沒有人跟你玩、被排擠、或想念不在身邊的人的時候。','心裡空空的、提不起勁、不想說話。','牠想說「我需要有人陪」。','抱抱自己，找一個信任的人說說，或主動邀請一個人一起玩。'],
  stress:['功課太多、考試快到了、很多事情同時要做的時候。','肩膀緊緊、頭脹脹的、睡不好、容易發脾氣。','牠想說「我需要休息一下」。','把事情寫下來，一次只做一件，做完一件就休息一下，也可以請人幫忙。']
});
function renderMD(){const k=S.mdK||'angry',e=EMO[k],xp=store.xp[k]||0,l=lvOf(xp),nx=nextOf(xp);const [when,body,why,how]=INTRO[k];
  $('#mdMon').innerHTML=monster(k,140,'wobble');
  $('#mdName').innerHTML=`<span class="cname" style="background:${e.color};font-size:.9rem;vertical-align:middle">${e.cname}</span> ${e.name}`;
  $('#mdLv').textContent=`Lv.${l} ${TITLES[l-1]}・${STAGES[stageOf(l)-1].n}`+(nx.need?`・再 ${nx.need} 經驗升級`:'');
  const cur=stageOf(l);
  const L=store.log.filter(x=>x.emo===k);const ae={};L.forEach(x=>x.acts.forEach(a=>{ae[a]=ae[a]||[0,0];ae[a][0]+=x.lv0-x.lv2;ae[a][1]++}));
  const best=Object.entries(ae).sort((a,b)=>b[1][0]/b[1][1]-a[1][0]/a[1][1])[0];
  const cc={};L.forEach(x=>{if(x.cause)cc[x.cause]=(cc[x.cause]||0)+1});const topC=Object.entries(cc).sort((a,b)=>b[1]-a[1])[0];
  const age=S.age||'mid';
  $('#mdBody').innerHTML=`<h4>🌱 成長進化</h4><div class="evorow">${STAGES.map((t,i)=>`<div class="evocell ${i+1>cur?'lock':''} ${i+1===cur?'now':''}">${monster(k,66,'',{grow:i+1,level:1,eq:{head:null,neck:null}})}<small>${t.n}</small><small>${i+1>cur?'🔒 Lv.'+t.from:i+1===cur?'現在':'✓'}</small></div>`).join('')}</div>
    <p class="hint" style="text-align:left">${lvOf(store.xp[k]||0)>=CORNER_LV?`🏡 已解鎖家園冷靜角落：${CORNERS[k].ico} ${CORNERS[k].name}。`:`Lv.${CORNER_LV} 會在家園解鎖冷靜角落：${CORNERS[k].ico} ${CORNERS[k].name}。`}每次陪牠冷靜，牠就會長大、變得更成熟。長大後會學會「${BADGE[k][0]} ${BADGE[k][1]}」：${BADGE[k][2]}。</p>
    <h4>🌡️ 牠變大的時候</h4><div class="evorow">${SIZES.map((t,i)=>`<div class="evocell mood">${monster(k,58,'',{mood:i+1,level:1,eq:{head:null,neck:null}})}<small>${t.n}</small></div>`).join('')}<div class="evocell calm">${HASART.has(k)?`<svg class="mon" width="58" height="58" viewBox="-8 -22 136 150"><image href="img/${k}0.webp" x="-4" y="-8" width="128" height="128"/></svg>`:monster(k,58,'',{grow:1,level:1,eq:{head:null,neck:null}})}<small>冷靜下來</small></div></div>
    <p class="hint" style="text-align:left">情緒越大，牠看起來越兇，這是在告訴你「我很不舒服」。冷靜下來，牠就會變回溫柔的樣子。</p>
    <h4>🔎 牠什麼時候會出現？</h4><p>${when}</p>
    <h4>🫀 牠來的時候，身體會怎樣？</h4><p>${body}</p>
    <h4>💬 牠想告訴你什麼？</h4><p>${why}</p>
    <h4>🛠️ 怎麼跟牠相處？</h4><p>${how}</p>
    <div class="chips" style="justify-content:flex-start">${e.acts.map(a=>`<button class="chip" data-mdact="${a}">練習${ACT_NAME[a]}</button>`).join('')}</div>
    <h4>📊 你和${e.name}</h4><p>${L.length?`一起冷靜過 <b>${L.length}</b> 次。`+(best?`對你最有效的是 <b>${best[0]}</b>（平均變小 ${(best[1][0]/best[1][1]).toFixed(1)} 級）。`:'')+(topC?`最常因為「${topC[0]}」出現。`:''):'還沒有一起冷靜的紀錄。下次牠來的時候，去冷靜站找牠吧！'}</p>
    <h4>⭐ 我的冷靜秘訣</h4><p class="hint" style="text-align:left;margin:0 0 6px">寫下（或請大人幫你寫）對付${e.name}最有用的方法</p>
    <textarea id="mdTip" style="width:100%;min-height:70px;border:2px solid var(--line);border-radius:12px;padding:8px 10px;font:inherit" placeholder="例如：抱著小熊數到 10">${store.tips[k]||''}</textarea>
    <div class="gdetail"><b>給大人</b>：${PARENT[k].say[age]}<br><small>${PARENT[k].after}</small></div>`;
  $('#mdTip').onchange=()=>{store.tips[k]=$('#mdTip').value;save();toast('秘訣存好了')};
  $$('[data-mdact]').forEach(b=>b.onclick=()=>startPractice(k,b.dataset.mdact));
}

