/* 怪獸圖鑑與介紹、主角、家園、大人給星星、商店 */
/* ---------- monster dex ---------- */
function renderDex(){
  $('#dex').innerHTML=visibleEmo().map(k=>[k,EMO[k]]).map(([k,e])=>{const xp=store.xp[k]||0,l=lvOf(xp),nx=nextOf(xp);
    return `<button class="pick" data-md="${k}">${monster(k,80)}<b>${e.name}</b>
      <span class="lvtag">Lv.${l} ${TITLES[l-1]}</span><div class="xpbar"><i style="width:${nx.pct}%"></i></div><span class="lvtag">點我認識牠 ›</span></button>`}).join('');
  $$('[data-md]').forEach(b=>b.onclick=()=>{S.mdK=b.dataset.md;go(22)});
  const hid=Object.keys(EMO).length-visibleEmo().length;
  $('#dex').insertAdjacentHTML('afterend',hid?`<p class="hint" id="dexMore">還有 ${hid} 隻怪獸，長大一點就會遇到牠們（大人可以在「換主角 / 年齡」調整年齡）</p>`:'');
  $('#critDexSub').textContent=`安靜觀察拍到的小動物：${critFound()} / ${Object.keys(CRIT).length}`;
  const dm=$$('#dexMore');if(dm.length>1)dm.slice(0,-1).forEach(x=>x.remove());
  renderJoyDex();
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
const JOY_PEP=['想到開心的事，我就會出現喔','謝謝你注意到我！','好的感覺也要好好記住'];
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
function cornerSvg(k,C){const c=CORNERS[k],col=EMO[k].color;if(C)return clayCornerSign(C,c.x,c.y,col,c.ico);
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
function startWander(root='#scene'){clearInterval(wanderT);if(RM||isNight()||S.decor)return;
  const actors=$$(root+' .actor');actors.forEach(el=>{el._next=performance.now()+800+Math.random()*2500});
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
  const night=isNight();const C=Clay('hs');
  let v=claySky(C,night,store.equip.bg,o.includes('rainbowsky'));
  /* 前後層次（v19）：腳的位置越下面，畫在越前面 */
  const L=[];const add=(y,h)=>L.push([y,h]);
  const ctx={g,night,crop:store.crop,fish:store.fish,seed:store.seed||7};
  HOME_ITEMS.forEach(it=>{if(o.includes(it.id))add(it.base+posOf(it.id)[1],wrapIt(it.id,artImg(it.id,it.draw(C,ctx),it.k?it.k(ctx):1)))});
  clayProps(C,ctx.seed).forEach(p=>add(p[0],p[1]));
  /* v20：冷靜角落招牌拿掉（容易誤觸），Lv.4 的「拿手方法」改放在怪獸圖鑑 */
  // 情緒怪獸入住：一起冷靜過（有經驗）就搬進來
  const fr=Object.keys(EMO).filter(k=>(store.xp[k]||0)>0);
  const pos=[[96,150],[216,152],[70,186],[244,190],[124,196],[182,200],[40,160],[290,170],[150,214],[260,214],[20,214],[310,150],[200,176],[100,222]];
  fr.forEach((k,i)=>{const [px,py]=HOME_POS[k]||pos[i];add(py+42,`<g data-mon="${k}" data-actor="m" class="homemon actor" style="transform:translate(${px}px,${py}px);${S.decor?'pointer-events:none;opacity:.55':''}"><g class="flip"><g class="act ${night?'sleepy':'bob'}" style="animation-delay:${i*.5}s">${monster(k,42)}</g></g>${night?`<text class="zzz" x="34" y="6" font-size="10" fill="#fff">Z<tspan font-size="7" dy="-4">z</tspan></text>`:''}</g>`)});
  /* 情緒夥伴（v25）：一起品味過就搬進來 */
  const jf=Object.keys(JOY).filter(k=>jxpOf(k)>0);
  jf.forEach((k,i)=>{const id='j-'+k,[px,py]=HOME_POS[id]||pos[(fr.length+i)%pos.length].map((v,j)=>v+(fr.length+i>=pos.length?(j?6:14):0));add(py+42,`<g data-mon="${id}" data-actor="m" class="homemon actor" style="transform:translate(${px}px,${py}px);${S.decor?'pointer-events:none;opacity:.55':''}"><g class="flip"><g class="act ${night?'sleepy':'bob'}" style="animation-delay:${(fr.length+i)*.5}s">${friend(k,42)}</g></g>${night?`<text class="zzz" x="34" y="6" font-size="10" fill="#fff">Z<tspan font-size="7" dy="-4">z</tspan></text>`:''}</g>`)});
  if(store.hero){const [hx,hy]=HOME_POS.hero||[150,102];add(hy+56,`<g data-actor="h" class="actor" style="pointer-events:none;transform:translate(${hx}px,${hy}px)"><g class="flip"><g class="act ${night?'sleepy':'bob'}">${hero(store.hero.type,56)}</g></g></g>`)}
  v+=L.sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join('')+clayAmbient(C,night);
  if(night)v+=`<rect width="360" height="250" fill="#1A1F45" opacity=".22" pointer-events="none"/>`;
  if(!fr.length&&!jf.length)v+=`<text x="180" y="244" text-anchor="middle" font-size="11" fill="#5A7A50">去冷靜站陪一隻怪獸冷靜，牠就會搬進家園喔</text>`;
  return `<svg viewBox="0 0 360 250" width="100%" style="display:block;border-radius:18px">${C.defs()}`+v+`</svg>`;
}
function bindScene(){
  const svg=$('#scene svg');
  if(S.decor&&svg){svg.style.touchAction='none';
    $$('#scene [data-it]').forEach(el=>{el.onpointerdown=ev=>{ev.preventDefault();const id=el.dataset.it;const [x0,y0]=posOf(id);
      const k=360/svg.getBoundingClientRect().width,sx=ev.clientX,sy=ev.clientY;let nx=x0,ny=y0;try{el.setPointerCapture(ev.pointerId)}catch(e){}el.classList.add('dragging');
      el.onpointermove=e=>{nx=Math.max(-330,Math.min(330,x0+(e.clientX-sx)*k));ny=Math.max(-180,Math.min(120,y0+(e.clientY-sy)*k));el.setAttribute('transform',`translate(${nx.toFixed(1)} ${ny.toFixed(1)})`)};
      el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;el.classList.remove('dragging');store.pos[id]={x:Math.round(nx),y:Math.round(ny)};save();tone(520,.06)}}})}
  [['pond',24],['garden',25],['flowers',25]].forEach(([id,st])=>{const el=$(`#scene [data-it="${id}"]`);if(el)el.onclick=()=>{if(S.decor)return;
    if(isNight()){toast('晚上了，大家都在睡覺，明天再來吧 🌙');return}go(st)}});
  $$('#scene [data-mon]').forEach(el=>el.onclick=()=>{if(S.decor)return;const k=el.dataset.mon;
    if(k.startsWith('j-')){const j=JOY[k.slice(2)];const line=JOY_PEP[Math.floor(Math.random()*JOY_PEP.length)];toast(`${j.name}：「${line}」`);speak(line);actDo(el,'hop',900);return}
    const e=EMO[k],l=lvOf(store.xp[k]||0),b=BADGE[k];
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
  $('#quietScene').innerHTML='';$('#scene').innerHTML=scene();bindScene();
  $('#decorBar').style.display=S.decor?'':'none';
  $('#hWater').textContent=S.decor?'🪄 布置中…':'🪄 布置';
  renderChores();renderReviewCard();renderWishCard();
  const vb=$('#voucherBox');vb.innerHTML='';
  store.vouchers.forEach(v=>{const d=document.createElement('div');d.className='task';d.style.background='#EAF6F3';
    d.innerHTML=`<span>🎟 兌換券：<b>${v.name}</b></span>`;
    d.appendChild(holdBtn('大人按住確認已兌現',2000,()=>{store.vouchers=store.vouchers.filter(x=>x.id!==v.id);save();chime();toast(`兌現了：${v.name}！`);renderHome()}));
    vb.appendChild(d)});

  const rb=$('#repairBox');rb.innerHTML='';
  store.repairs.forEach(r=>{const d=document.createElement('div');d.className='task';
    d.innerHTML=`<span>🔧 修復任務：<b>${r.text}</b></span>`;
    d.appendChild(holdBtn('大人按住確認完成',2000,()=>{store.repairs=store.repairs.filter(x=>x.id!==r.id);save();gain('負起責任，完成修復',15);renderHome()}));
    rb.appendChild(d)});
  /* 心情打卡（v28）：每天第一次打開時的問候，打卡後就收起來 */
  $('#moodCard').style.display=(store.moodDay!==today()||S.moodShow)&&!S.decor?'':'none';if(!S.moodShow)$('#moodMsg').innerHTML='';
  renderToday();
  const md=store.moodDay===today()?store.mood:null;
  $('#moods').innerHTML=MOODS.map(([f,t])=>`<button class="${md===t?'sel':''}" data-mood="${t}">${f}<span>${t}</span></button>`).join('');
  $$('[data-mood]').forEach(b=>b.onclick=()=>{const m=MOODS.find(x=>x[1]===b.dataset.mood);
    if(store.moodDay!==today()){store.moodDay=today();store.mood=m[1];store.moodLog.push({d:today(),m:m[1]});store.moodLog=store.moodLog.slice(-90);save();gain('心情打卡',3)}else{store.mood=m[1];save()}
    renderHome();
    S.moodShow=true;$('#moodCard').style.display='';
    $('#moodMsg').innerHTML=(m[2]?`太好了！要不要把這個好心情存進快樂寶盒？<br><button class="btn small" id="moodJoy" style="margin-top:8px">✨ 存起來</button>`:`謝謝你說出來。要不要去冷靜站，讓${m[1]}的怪獸變小？<br><button class="btn small" id="moodGo" style="margin-top:8px">去冷靜站</button>`)+` <button class="chip" id="moodOk" style="margin-top:8px">好</button>`;
    $('#moodOk').onclick=()=>{S.moodShow=false;$('#moodCard').style.display='none'};
    const g=$('#moodGo');if(g)g.onclick=startFlow;const mj=$('#moodJoy');if(mj)mj.onclick=()=>startJoy(m[1]==='平靜'?'safe':'happy');});
}
$('#hStart').onclick=startFlow;
$('#hJoy').onclick=()=>startJoy();
$('#hQuiet').onclick=()=>go(27);
function startPractice(emo,act){resetFlow();store.day.n--;save();S.practice=true;S.emo=emo||'scared';S.act=act||'breathe';go(3)}
/* 家園減法（v28）：今天的小事收進「今天」，需要時再打開 */
$('#hToday').onclick=()=>{S.todayOpen=!S.todayOpen;tone(520,.08);renderToday()};
$('#hWater').onclick=()=>{const has=SHOP.some(x=>x.cat==='home'&&SPOTS[x.id]&&store.owned.includes(x.id));
  if(!has){toast('先去商店買家具，才能布置喔');S.shopCat='home';go(11);return}
  if(isNight()){toast('晚上了，大家都在睡覺，明天再布置吧 🌙');return}
  S.decor=!S.decor;renderHome();if(S.decor)toast('用手指按住家具，拖到你喜歡的地方')};
$('#decorDone').onclick=()=>{S.decor=false;renderHome();toast('布置好了！')};
/* 家園小工作：每天各一次、幾秒鐘就做完；不做也不會枯萎或生病（不製造焦慮） */
function renderChores(){
  const o=store.owned,t=today(),box=$('#chores');const rows=[];
  if(isNight()){box.innerHTML=`<p class="choreh">🌙 晚上了</p><p class="hint" style="text-align:left;margin:4px 0">怪獸們和${store.hero?store.hero.name:'你'}都睡了，家園工作明天再做。<br>需要冷靜的時候，冷靜站和「🆘 馬上冷靜」都還可以用。晚安！</p>`;return}
  const plants=SHOP.filter(x=>x.plant&&o.includes(x.id));const hasG=o.includes('garden');
  /* 池塘、菜園是療癒小角落（v17）：隨時可以去，照顧過也還能去看看 */
  if(o.includes('pond'))rows.push(['🐟','池塘',store.fishDay===t?'今天餵過了，也可以去看看魚 ✓':'去看看魚、碰碰水面','pond',store.fishDay===t]);
  if(plants.length||hasG){const c=store.crop;
    const sub=store.waterDay===t?(c&&(c.st||0)>=3?`${CROPS[c.k][1]}長好了，可以分給怪獸吃 ✓`:'今天澆過水了，可以去摸摸葉子 ✓')
      :hasG&&!c?'選一種種子種下去':c&&(c.st||0)>=3?`${CROPS[c.k][1]}長好了！`:'慢慢澆水，看泥土變深';
    rows.push([c?CROPS[c.k][0]:'🌱',hasG?'菜園':'花草',sub,'garden',store.waterDay===t&&!(c&&(c.st||0)>=3)])}
  const rt=REAL_TASKS[(new Date().getDate()+(store.rtOff||0))%REAL_TASKS.length];
  rows.push(store.realDay===t?['🏡','真實家事','今天做到了 ✓',null]:['🏡','真實家事',`今天試試：${rt}`,'real']);
  const left=rows.filter(r=>r[3]&&!r[4]).length;
  box.innerHTML=`<p class="choreh">🧺 今天的家園小工作</p>`+rows.map(r=>`<div class="chore ${r[3]&&!r[4]?'':'done'}"><span class="ci">${r[0]}</span><span class="ct"><b>${r[1]}</b><small>${r[2]}</small></span>${r[3]==='real'?'<span class="slot"></span>':r[3]?`<button class="btn small ${r[4]?'ghost':''}" data-ch="${r[3]}">去看看</button>`:''}</div>`).join('')
    +(left===0?`<p class="hint choredone">🌞 今天的家園工作都完成了！怪獸們要去休息了，你也去玩真的遊戲、找家人說說話吧。</p>`:'')
    +(!plants.length&&!hasG&&!o.includes('pond')?`<p class="hint">在商店買小菜園、池塘或植物，就有更多家園工作可以做。</p>`:'');
  const slot=box.querySelector('.slot');if(slot){slot.appendChild(holdBtn('大人按住確認',1500,()=>{store.realDay=t;save();gain('在家裡幫忙',5);chime();renderHome()}))}
  box.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{const k=b.dataset.ch;
    if(k==='pond'){go(24);return}
    if(k==='garden'){go(25);return}
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
      <button class="btn small" data-cpn="${i}" ${store.stars<c.cost?'disabled':''}>${c.cost} ⭐ 換</button>
      ${store.wish&&store.wish.name===c.name?`<span class="wishtag">🫙 我的願望</span>`:`<button class="chip wishset" data-wish="${i}">🫙 設為願望</button>`}</div>`).join('')+
      `<div class="pick" style="cursor:default;display:flex;align-items:center;justify-content:center"><span>兌換券由大人在「大人看這裡」設定</span></div>`;
    $$('[data-cpn]').forEach(b=>b.onclick=()=>{const c=cp[+b.dataset.cpn];if(store.stars<c.cost)return;
      wishGuard(c.name,c.cost,()=>{redeemCoupon(c);renderShop()})});
    $$('[data-wish]').forEach(b=>b.onclick=()=>{setWish(cp[+b.dataset.wish]);renderShop()});
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
    wishGuard(it.name,it.cost,()=>{store.stars-=it.cost;store.owned.push(it.id);if(it.slot)store.equip[it.slot]=it.id;if(it.plant)store.grow[it.id]=1;save();chime();
    toast(it.cat==='home'?`${it.name}放進家園了！`:`買到${it.name}了！`);renderShop()})});
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
  $('#mdName').innerHTML=`<i class="cdot" style="background:${e.color}"></i>${e.name}`;
  $('#mdLv').textContent=`Lv.${l} ${TITLES[l-1]}・${STAGES[stageOf(l)-1].n}`+(nx.need?`・再 ${nx.need} 經驗升級`:'');
  const cur=stageOf(l);
  const L=store.log.filter(x=>x.emo===k);const ae={};L.forEach(x=>x.acts.forEach(a=>{ae[a]=ae[a]||[0,0];ae[a][0]+=x.lv0-x.lv2;ae[a][1]++}));
  const best=Object.entries(ae).sort((a,b)=>b[1][0]/b[1][1]-a[1][0]/a[1][1])[0];
  const cc={};L.forEach(x=>{if(x.cause)cc[x.cause]=(cc[x.cause]||0)+1});const topC=Object.entries(cc).sort((a,b)=>b[1]-a[1])[0];
  const age=S.age||'mid';
  const fm=famOf(k);
  $('#mdBody').innerHTML=`<div class="monmsg" style="--mc:${e.color}"><small>${fm.ico} ${fm.name}</small><b>「${EMO_MSG[k]}」</b><span>牠需要：${fm.need}</span></div><h4>🌱 成長進化</h4><div class="evorow">${STAGES.map((t,i)=>`<div class="evocell ${i+1>cur?'lock':''} ${i+1===cur?'now':''}">${monster(k,66,'',{grow:i+1,level:1,eq:{head:null,neck:null}})}<small>${t.n}</small><small>${i+1>cur?'🔒 Lv.'+t.from:i+1===cur?'現在':'✓'}</small></div>`).join('')}</div>
    <p class="hint" style="text-align:left">${lvOf(store.xp[k]||0)>=CORNER_LV?'':`到 Lv.${CORNER_LV}，牠會教你牠的拿手方法。`}每次陪牠冷靜，牠就會長大、變得更成熟。長大後會學會「${BADGE[k][0]} ${BADGE[k][1]}」：${BADGE[k][2]}。</p>
    <h4>🌡️ 牠變大的時候</h4><div class="evorow">${SIZES.map((t,i)=>`<div class="evocell mood">${monster(k,58,'',{mood:i+1,level:1,eq:{head:null,neck:null}})}<small>${t.n}</small></div>`).join('')}<div class="evocell calm">${HASART.has(k)?`<svg class="mon" width="58" height="58" viewBox="-8 -22 136 150"><image href="img/${k}0.webp" x="-4" y="-8" width="128" height="128"/></svg>`:monster(k,58,'',{grow:1,level:1,eq:{head:null,neck:null}})}<small>冷靜下來</small></div></div>
    <p class="hint" style="text-align:left">情緒越大，牠看起來越兇，這是在告訴你「我很不舒服」。冷靜下來，牠就會變回溫柔的樣子。</p>
    <h4>🔎 牠什麼時候會出現？</h4><p>${when}</p>
    <h4>🫀 牠來的時候，身體會怎樣？</h4><p>${body}</p>
    <h4>💬 牠想告訴你什麼？</h4><p>${why}</p>
    <h4>🛠️ 怎麼跟牠相處？</h4><p>${how}</p>
    ${lvOf(store.xp[k]||0)>=CORNER_LV?`<div class="skillbox"><b>⭐ 牠的拿手方法：${CORNERS[k].ico} ${CORNERS[k].name}</b><span>一起練習「${ACT_NAME[CORNERS[k].act]}」</span><button class="btn small" data-mdact="${CORNERS[k].act}">一起練習</button></div>`:''}
    <div class="chips" style="justify-content:flex-start">${e.acts.map(a=>`<button class="chip" data-mdact="${a}">練習${ACT_NAME[a]}</button>`).join('')}</div>
    <h4>📊 你和${e.name}</h4><p>${L.length?`一起冷靜過 <b>${L.length}</b> 次。`+(best?`對你最有效的是 <b>${best[0]}</b>（平均變小 ${(best[1][0]/best[1][1]).toFixed(1)} 級）。`:'')+(topC?`最常因為「${topC[0]}」出現。`:''):'還沒有一起冷靜的紀錄。下次牠來的時候，去冷靜站找牠吧！'}</p>
    <h4>⭐ 我的冷靜秘訣</h4><p class="hint" style="text-align:left;margin:0 0 6px">寫下（或請大人幫你寫）對付${e.name}最有用的方法</p>
    <textarea id="mdTip" style="width:100%;min-height:70px;border:2px solid var(--line);border-radius:12px;padding:8px 10px;font:inherit" placeholder="例如：抱著小熊數到 10">${store.tips[k]||''}</textarea>
    <div class="gdetail"><b>給大人</b>：${PARENT[k].say[age]}<br><small>${PARENT[k].after}</small></div>`;
  $('#mdTip').onchange=()=>{store.tips[k]=$('#mdTip').value;save();toast('秘訣存好了')};
  $$('[data-mdact]').forEach(b=>b.onclick=()=>startPractice(k,b.dataset.mdact));
}


/* 「今天」抽屜（v28）：一起回顧、願望罐、家園小工作、修復任務、兌換券 */
function renderToday(){const box=$('#todayBox');if(!box)return;
  const n=($('#reviewBox').innerHTML?1:0)+$$('#chores .chore:not(.done)').length+$$('#repairBox .task').length+$$('#voucherBox .task').length+($('#wishBox .wishcard.full')?1:0);
  $('#hTodaySub').textContent=S.todayOpen?'收起來':n?`${n} 件小事`:'都完成了 🌞';
  $('#hToday').classList.toggle('has',!!n&&!S.todayOpen);$('#hToday').classList.toggle('on',!!S.todayOpen);
  box.style.display=S.todayOpen&&!S.decor?'':'none'}
