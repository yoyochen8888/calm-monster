/* 療癒小角落（v17）：池塘、菜園，以及冷靜站的「跟青蛙呼吸」（v47 起池塘換成 pond/ 軟陶魚池）
   原則：慢慢的、沒有倒數、沒有進度數字；照顧每天第一次 +1 星；畫面會自己慢慢收尾 */

/* ---------- 聲音：雨聲（白噪音＋低通）、水滴 ---------- */
let rainNode=null;
function rainStart(){const a=ac();if(!a||rainNode)return;try{
  const len=a.sampleRate*2,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  const src=a.createBufferSource();src.buffer=buf;src.loop=true;
  const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=900;
  const g=a.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(.05,a.currentTime+.6);
  src.connect(f);f.connect(g);g.connect(a.destination);src.start();rainNode={src,g}}catch(e){}}
function rainStop(){if(!rainNode)return;const a=ac(),r=rainNode;rainNode=null;
  try{r.g.gain.cancelScheduledValues(a.currentTime);r.g.gain.setValueAtTime(r.g.gain.value,a.currentTime);r.g.gain.linearRampToValueAtTime(0,a.currentTime+.5);setTimeout(()=>{try{r.src.stop()}catch(e){}},600)}catch(e){}}
const PENTA=[392,440,523,587,659,784];
function drip(){tone(PENTA[Math.floor(Math.random()*PENTA.length)],.5,'sine',.06)}
function stopCorners(){rainStop();closePondOverlay()}

/* ---------- 池塘（v47）：軟陶魚池 pond/index.html ----------
   家園的池塘（step 24）用全螢幕開啟；冷靜站的「跟青蛙呼吸」放在活動區裡。
   池塘頁面透過 window.pondHost 讀寫家園的存檔（store.pond、store.fish、fishDay、fed）和星星（gain）。 */
window.pondHost={get store(){return store},save,gain,closePond(){closePondOverlay();go(10)}};
function closePondOverlay(){const o=document.getElementById('pondOverlay');if(o)o.remove();document.body.classList.remove('pondopen')}
function renderPond(){
  stopAct();
  $('#pondHint').textContent='';$('#pondMsg').textContent='';
  $('#pondBtns').innerHTML=`<button class="btn" id="pOpen">打開池塘</button><button class="btn ghost" id="pHome">回家園</button>`;
  $('#pOpen').onclick=renderPond;$('#pHome').onclick=()=>go(10);
  const o=document.createElement('div');o.id='pondOverlay';o.className='pondov';
  o.innerHTML='<iframe src="pond/index.html?mode=home" title="池塘"></iframe>';
  document.body.appendChild(o);document.body.classList.add('pondopen');
}

/* ---------- 菜園（step 25） ---------- */
function gardenSvg(m,sway){
  const o=store.owned,c=store.crop,g=store.grow,C=Clay('gd');
  const soil=`rgb(${Math.round(185-75*m)},${Math.round(138-64*m)},${Math.round(94-48*m)})`;
  const lf=(x,inner)=>`<g class="leaf ${sway?'sway':''}" data-leaf="1" style="transform-origin:${x}px 204px">${inner}</g>`;
  let pl='';
  if(o.includes('garden')){
    if(c){const st=c.st||0;for(let i=0;i<3;i++){const x=110+i*70;pl+=lf(x,st>=3?clayCrop(C,c.k,x,206,2.1):claySprout(C,x,202,st,2.6))}}
    else pl+=`<text x="180" y="221" text-anchor="middle" font-size="14" fill="#fff">還沒有種東西</text>`}
  if(o.includes('flowers')){const n=(g.flowers||1)*2;for(let i=0;i<n;i++){const x=24+i*14,y=146-(i%2)*8;pl+=lf(x,clayFlower(C,x,y,FLOWER_COL[(i+(store.seed||0))%4],6.5,(i+(store.seed||0))%3))}}
  if(o.includes('tree')){const st=g.tree||1;pl+=lf(320,`<g transform="translate(268 10)">${clayTree(C,st,(store.seed||7)%2)}</g>`)}
  const sky=`<rect width="360" height="250" fill="${C.lin('sky',[[0,'#D6EEFF'],[1,'#F2FAFF']])}"/>
    <circle cx="322" cy="34" r="26" fill="${C.glow('sunglow','#FFE7A0')}"/><circle cx="322" cy="34" r="15" fill="${C.g('#FFD978',.5)}"/>${clayCloud(C,70,44)}
    <path d="M0 150 Q90 132 180 146 T360 140 V250 H0Z" fill="${C.lin('hill',[[0,'#CDEBB5'],[1,'#A9D98F']])}"/>`;
  const bed=`<ellipse cx="180" cy="242" rx="120" ry="7" fill="#4E6B3A" opacity=".16" ${C.blur}/>
    <rect x="62" y="190" width="236" height="52" rx="16" fill="${C.v('#C99467',.2)}" ${C.sh}/>
    <rect x="72" y="196" width="216" height="40" rx="12" fill="${soil}" id="soil"/>
    <rect x="72" y="196" width="216" height="40" rx="12" fill="${C.lin('soilsh',[[0,'rgba(255,255,255,.14)'],[1,'rgba(0,0,0,.12)']])}"/>
    ${[90,130,170,210,250].map(x=>`<ellipse cx="${x}" cy="${222+(x%3)}" rx="4" ry="1.6" fill="rgba(0,0,0,.10)"/>`).join('')}`;
  return `<svg viewBox="0 0 360 250" width="100%" class="gardensvg">${C.defs()}${sky}${bed}${pl}<g id="drops"></g></svg>`}
function renderGarden(){
  stopAct();const t=today(),o=store.owned;const A=$('#gdArea'),btns=$('#gdBtns'),msg=$('#gdMsg');msg.textContent='';
  const watered=store.waterDay===t;let m=watered?1:0,done=watered;
  const plants=SHOP.filter(x=>x.plant&&o.includes(x.id));
  if(!o.includes('garden')&&!plants.length){A.innerHTML='';$('#gdHint').textContent='在商店買小菜園或花草，就可以來這裡照顧它們。';
    btns.innerHTML=`<button class="btn" id="gShop">去商店看看</button>`;$('#gShop').onclick=()=>{S.shopCat='home';go(11)};return}
  const c=store.crop;
  /* 長好了：分給怪獸吃 */
  if(c&&(c.st||0)>=3){A.innerHTML=gardenSvg(1,true);bindLeaves();
    const fr=Object.keys(EMO).filter(k=>(store.xp[k]||0)>0);
    $('#gdHint').textContent=`${CROPS[c.k][1]}長好了！要分給誰吃呢？`;
    btns.innerHTML=(fr.length?fr:['hero']).map(k=>`<button class="chip" data-share="${k}">${k==='hero'?(store.hero?store.hero.name:'自己'):EMO[k].name}</button>`).join('');
    $$('[data-share]').forEach(b=>b.onclick=()=>{const k=b.dataset.share;ac();chime();store.crop=null;save();
      const who=k==='hero'?hero(store.hero.type,110):monster(k,110);
      A.innerHTML=`<div class="share"><div class="sharemon">${who}</div><div class="bubble">謝謝你！${CROPS[c.k][0]} 好好吃～</div></div>`;
      $('#gdHint').textContent='一起分享，大家都很開心。';
      btns.innerHTML=`<button class="btn" id="gAgain">再種一次</button><button class="btn ghost" id="gHome">回家園</button>`;
      $('#gAgain').onclick=renderGarden;$('#gHome').onclick=()=>go(10)});return}
  /* 還沒種：選種子 */
  if(o.includes('garden')&&!c){A.innerHTML=gardenSvg(0,false);$('#gdHint').textContent='選一種種子，種下去吧。';
    btns.innerHTML=Object.entries(CROPS).map(([id,cc])=>`<button class="chip" data-seed="${id}">${cc[0]} ${cc[1]}</button>`).join('');
    $$('[data-seed]').forEach(x=>x.onclick=()=>{store.crop={k:x.dataset.seed,st:0};save();tone(600,.12);drip();renderGarden()});return}
  /* 澆水 */
  A.innerHTML=gardenSvg(m,false);bindLeaves();
  $('#gdHint').textContent=watered?'今天已經澆過水了，土還濕濕的。可以摸摸葉子，聽它沙沙響。':'按住下面的水壺，慢慢澆水。不用急，土會一點一點變深。';
  btns.innerHTML=(watered?'':`<button class="btn hold-water" id="gWater">💧 按住澆水</button>`)+`<button class="btn ghost" id="gHome">回家園</button>`;
  $('#gHome').onclick=()=>go(10);
  const wb=$('#gWater');if(!wb)return;
  let holding=false,last=0,dropT=0;
  const step=now=>{if(!holding||!$('#soil'))return;const dt=Math.min(100,now-last);last=now;
    m=Math.min(1,m+dt/5000);const s=$('#soil');s.setAttribute('fill',`rgb(${Math.round(185-75*m)},${Math.round(138-64*m)},${Math.round(94-48*m)})`);
    if(now>dropT){dropT=now+90;const d=document.createElementNS('http://www.w3.org/2000/svg','circle');d.setAttribute('cx',80+Math.random()*200);d.setAttribute('cy',120+Math.random()*20);
      d.setAttribute('r',2.5);d.setAttribute('fill','#7CC5F0');d.setAttribute('class','drop');$('#drops').appendChild(d);setTimeout(()=>d.remove(),900)}
    if(m>=1&&!done){finish();return}
    raf=requestAnimationFrame(step)};
  const start=e=>{e.preventDefault();if(done)return;ac();holding=true;last=performance.now();rainStart();raf=requestAnimationFrame(step)};
  const end=()=>{holding=false;rainStop()};
  wb.addEventListener('pointerdown',start);wb.addEventListener('pointerup',end);wb.addEventListener('pointerleave',end);wb.addEventListener('pointercancel',end);
  function finish(){done=true;holding=false;rainStop();
    if(store.waterDay!==t){store.waterDay=t;plants.forEach(p=>store.grow[p.id]=Math.min(3,(store.grow[p.id]||1)+1));
      if(store.crop)store.crop.st=Math.min(3,(store.crop.st||0)+1);save();gain('照顧菜園',1)}
    A.innerHTML=gardenSvg(1,true);bindLeaves();chime();
    const ready=store.crop&&store.crop.st>=3;
    msg.textContent=ready?`${CROPS[store.crop.k][1]}長好了！可以分給怪獸吃了 🌱`:store.crop?'菜喝飽水，長大了一點，它說謝謝你 🌱':'花草喝飽水了，它們說謝謝你 🌱';
    $('#gdHint').textContent='今天的菜園照顧好了，明天再來看看它。';
    btns.innerHTML=(ready?`<button class="btn" id="gShare">分給怪獸吃</button>`:'')+`<button class="btn ghost" id="gHome">回家園</button>`;
    $('#gHome').onclick=()=>go(10);const sh=$('#gShare');if(sh)sh.onclick=renderGarden}
}
function bindLeaves(){$$('#gdArea [data-leaf]').forEach(l=>l.onclick=()=>{ac();l.classList.remove('sway','touch');void l.getBoundingClientRect();l.classList.add('touch');tone(700+Math.random()*200,.08,'triangle',.03)})}

/* ---------- 冷靜站：跟青蛙呼吸（v47，取代舊的看魚呼吸） ---------- */
function actFish(){
  const young=S.age==='young',inT=young?3:4,outT=young?5:6,total=5;
  actSpeech='我們跟青蛙一起呼吸。吸氣的時候，青蛙的肚子慢慢鼓起來，魚兒游過來。吐氣的時候，肚子慢慢消下去。';
  $('#actHint').textContent=`跟著青蛙：肚子鼓起來時吸氣（${inT} 秒），消下去時慢慢吐氣（${outT} 秒），做 ${total} 次`;
  $('#actArea').innerHTML=`<iframe class="pondframe" src="pond/index.html?mode=breath&in=${inT}&out=${outT}&n=${total}" title="跟青蛙呼吸"></iframe>`;
}
