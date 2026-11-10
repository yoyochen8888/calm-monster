/* 療癒小角落（v17）：池塘、菜園，以及冷靜站的「看魚呼吸」
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
function stopCorners(){rainStop()}

/* ---------- 池塘畫布（家園的池塘和看魚呼吸共用） ---------- */
const FISH_C=['#FFB25B','#FF8A80','#FFD86B','#FFA8CF','#B9A0F0'];
function pondCanvas(A,nFish){
  A.innerHTML=`<canvas class="pondcv"></canvas>`;const cv=A.querySelector('canvas');
  const W=Math.min(A.clientWidth||340,560),H=Math.round(W*.72),dpr=window.devicePixelRatio||1;
  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';
  const x=cv.getContext('2d');x.scale(dpr,dpr);
  const P={W,H,cv,food:[],rip:[],ring:null,rest:false,onEat:null,speed:1,t0:performance.now()};
  const pads=[[W*.16,H*.22,W*.07],[W*.83,H*.8,W*.085],[W*.76,H*.18,W*.05]];
  P.pads=pads;
  P.fish=[...Array(nFish)].map((_,i)=>({x:W*(.25+.5*Math.random()),y:H*(.3+.4*Math.random()),a:Math.random()*6.28,
    s:.35+Math.random()*.2,c:FISH_C[i%5],len:W*(.055+Math.random()*.02),tx:0,ty:0,w:Math.random()*6,pick:0}));
  P.fish.forEach(f=>{f.tx=f.x;f.ty=f.y});
  P.ripple=(px,py,big)=>P.rip.push({x:px,y:py,r:2,a:big?.7:.5,m:big?W*.22:W*.14});
  cv.addEventListener('pointerdown',e=>{const b=cv.getBoundingClientRect();const px=(e.clientX-b.left)*W/b.width,py=(e.clientY-b.top)*H/b.height;
    ac();P.ripple(px,py);drip();
    if(!P.rest)P.fish.forEach(f=>{if(Math.hypot(f.x-px,f.y-py)<W*.35){f.tx=px+(Math.random()-.5)*30;f.ty=py+(Math.random()-.5)*30;f.pick=performance.now()+2500}})});
  function newTarget(f){if(P.rest){const p=pads[1];f.tx=p[0]+(Math.random()-.5)*p[2]*1.4;f.ty=p[1]+(Math.random()-.5)*p[2]*.8;return}
    f.tx=W*(.1+.8*Math.random());f.ty=H*(.15+.7*Math.random())}
  function drawFish(f){x.save();x.translate(f.x,f.y);x.rotate(f.a);const L=f.len,sw=Math.sin(f.w)*.35;
    x.fillStyle='rgba(20,60,90,.15)';x.beginPath();x.ellipse(3,5,L*.55,L*.24,0,0,6.28);x.fill();
    const bg=x.createRadialGradient(-L*.15,-L*.12,L*.02,0,0,L*.6);bg.addColorStop(0,tint(f.c,.5));bg.addColorStop(.6,f.c);bg.addColorStop(1,tint(f.c,-.15));
    x.fillStyle=bg;x.beginPath();x.ellipse(0,0,L*.55,L*.25,0,0,6.28);x.fill();x.fillStyle=f.c;
    x.beginPath();x.moveTo(-L*.45,0);x.lineTo(-L*.85,-L*.25+sw*L*.2);x.lineTo(-L*.85,L*.25+sw*L*.2);x.closePath();x.fill();
    x.fillStyle='#fff';x.beginPath();x.arc(L*.3,-L*.07,L*.07,0,6.28);x.fill();
    x.fillStyle='#333';x.beginPath();x.arc(L*.32,-L*.07,L*.035,0,6.28);x.fill();x.restore()}
  function frame(now){if(!cv.isConnected)return;
    const t=(now-P.t0)/1000;
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#B5E6F5');g.addColorStop(1,'#6FB9DE');x.fillStyle=g;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(255,255,255,.10)';for(let i=0;i<6;i++){const cx=(W*(i/6)+t*8*(i%2?1:-1)+W)%W,cy=H*(.2+.12*i)+Math.sin(t*.5+i)*6;x.beginPath();x.ellipse(cx,cy,W*.12,H*.025,0,0,6.28);x.fill()}
    if(P.ring){const R=P.ring;x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=4;x.beginPath();x.arc(W/2,H/2,R.r,0,6.28);x.stroke();
      x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(W/2,H/2,R.r,0,6.28);x.fill()}
    P.food=P.food.filter(p=>now-p.t<25000);
    P.food.forEach(p=>{p.y+=.04;p.x+=Math.sin(now/900+p.x)*.05;x.fillStyle='#B9874B';x.beginPath();x.arc(p.x,p.y,3,0,6.28);x.fill()});
    P.fish.forEach(f=>{let tx=f.tx,ty=f.ty;
      if(P.food.length&&!P.rest){let best=null,bd=1e9;P.food.forEach(p=>{const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<bd){bd=d;best=p}});tx=best.x;ty=best.y;
        if(bd<f.len*.5){P.food.splice(P.food.indexOf(best),1);tone(300+Math.random()*60,.12,'sine',.05);f.w+=3;if(!P.food.length&&P.onEat)P.onEat()}}
      else if(Math.hypot(tx-f.x,ty-f.y)<12&&now>f.pick)newTarget(f);
      const want=Math.atan2(ty-f.y,tx-f.x);let da=want-f.a;while(da>Math.PI)da-=6.28;while(da<-Math.PI)da+=6.28;
      f.a+=Math.max(-.03,Math.min(.03,da));
      const sp=f.s*P.speed*(P.food.length&&!P.rest?1.8:1)*(P.rest?.9:1);
      f.x+=Math.cos(f.a)*sp;f.y+=Math.sin(f.a)*sp;f.w+=.08*P.speed;
      f.x=Math.max(10,Math.min(W-10,f.x));f.y=Math.max(10,Math.min(H-10,f.y));drawFish(f)});
    pads.forEach(([px,py,r],i)=>{x.fillStyle='rgba(40,90,120,.12)';x.beginPath();x.ellipse(px+3,py+5,r,r*.9,0,0,6.28);x.fill();
      const pg=x.createRadialGradient(px-r*.35,py-r*.35,r*.1,px,py,r);pg.addColorStop(0,'#A6DC94');pg.addColorStop(1,i===1&&P.rest?'#5FB06A':'#6FBF6E');x.fillStyle=pg;x.beginPath();x.moveTo(px,py);const rot=i*2.1+Math.sin(t*.3+i)*.05;x.arc(px,py,r,rot+.12,rot+6.16);x.closePath();x.fill();
      x.fillStyle='rgba(255,255,255,.15)';x.beginPath();x.arc(px-r*.3,py-r*.3,r*.25,0,6.28);x.fill()});
    if(!pads[2].flower){x.fillStyle='#FFB3D1';const [px,py]=pads[2];for(let k=0;k<5;k++){x.beginPath();x.ellipse(px+Math.cos(k*1.26)*6,py+Math.sin(k*1.26)*6,5,3,k*1.26,0,6.28);x.fill()}x.fillStyle='#F7D046';x.beginPath();x.arc(px,py,3,0,6.28);x.fill()}
    P.rip=P.rip.filter(r=>r.a>0.02);P.rip.forEach(r=>{r.r+=.9;r.a*=.975;x.strokeStyle=`rgba(255,255,255,${r.a})`;x.lineWidth=2;x.beginPath();x.arc(r.x,r.y,r.r,0,6.28);x.stroke();
      if(r.r>r.m)r.a*=.9});
    raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
  P.feed=()=>{for(let i=0;i<5;i++)P.food.push({x:W*(.25+.5*Math.random()),y:H*(.25+.45*Math.random()),t:performance.now()});P.ripple(W/2,H/2,true);drip()};
  return P}

/* ---------- 家園的池塘（step 24） ---------- */
function renderPond(){
  stopAct();const t=today();let fedThisVisit=0;
  const P=pondCanvas($('#pondArea'),Math.max(1,store.fish||1));
  $('#pondHint').textContent='用手指輕輕碰水面，魚會好奇地游過來。想看多久都可以。';
  const btns=$('#pondBtns'),msg=$('#pondMsg');msg.textContent='';
  const draw=()=>{btns.innerHTML=(fedThisVisit<2?`<button class="btn" id="pFeed">🍞 撒一點飼料</button>`:'')+`<button class="btn ghost" id="pHome">回家園</button>`;
    const f=$('#pFeed');if(f)f.onclick=feed;$('#pHome').onclick=()=>go(10)};
  function ending(){/* 自然收尾：魚游到荷葉下休息，不強迫離開 */
    if(P.rest||!$('#pondArea').isConnected)return;P.rest=true;P.fish.forEach(f=>f.pick=0);
    msg.innerHTML='魚兒吃飽了，慢慢游到荷葉下面休息了。<br>跟牠們說再見吧 👋';}
  function feed(){ac();P.feed();fedThisVisit++;draw();
    if(store.fishDay!==t){store.fishDay=t;store.fed=(store.fed||0)+1;let nf=false;
      if(store.fed>=3&&(store.fish||1)<5){store.fed=0;store.fish=(store.fish||1)+1;nf=true}
      save();gain('照顧池塘',1);
      if(nf)later(()=>{msg.textContent='咦？池塘裡來了一條新的小魚 🐟';P.fish.push({x:10,y:P.H*.5,a:0,s:.4,c:FISH_C[(store.fish-1)%5],len:P.W*.05,tx:P.W*.4,ty:P.H*.5,w:0,pick:0})},4000)}
    P.onEat=()=>{if(fedThisVisit>=2)later(ending,2500);else if(!msg.textContent)msg.textContent='魚兒吃得好開心。'};}
  draw();
  later(ending,120000);/* 兩分鐘後魚兒自己去休息 */
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
  if(o.includes('flowers')){const n=(g.flowers||1)*2;for(let i=0;i<n;i++){const x=24+i*14,y=146-(i%2)*8;pl+=lf(x,clayFlower(C,x,y,FLOWER_COL[i%4],6.5))}}
  if(o.includes('tree')){const st=g.tree||1;pl+=lf(320,`<g transform="translate(268 10)">${clayTree(C,st)}</g>`)}
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

/* ---------- 冷靜站：看魚呼吸 ---------- */
function actFish(){
  const young=S.age==='young',inT=young?3000:4000,outT=young?5000:6000,total=5;
  actSpeech='我們來看魚呼吸。吸氣的時候，白色的圈圈慢慢變大，魚兒游過來。吐氣的時候，圈圈慢慢變小，魚兒慢慢游走。';
  $('#actHint').textContent=`看著池塘：圈圈變大時吸氣（${inT/1000} 秒），變小時慢慢吐氣（${outT/1000} 秒），做 ${total} 次`;
  const A=$('#actArea');A.innerHTML=`<div id="fishPond"></div><div class="breath-word" id="bw">準備好了嗎？也可以先摸摸水面</div><div class="count" id="bc"></div><div class="row"><button class="btn" id="bStart">開始</button></div>`;
  const P=pondCanvas($('#fishPond'),Math.max(3,store.fish||1));const r0=P.W*.08,r1=P.W*.26;P.ring={r:r0};
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';ac();run(0)};
  function anim(from,to,ms){const s=performance.now();const f=now=>{if(!P.cv.isConnected||!P.ring)return;const k=Math.min(1,(now-s)/ms),e=.5-Math.cos(k*Math.PI)/2;P.ring.r=from+(to-from)*e;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
  function run(i){const bw=$('#bw'),bc=$('#bc');if(!bw)return;
    if(i>=total){bw.textContent='好棒！你陪魚兒呼吸了 5 次';bc.textContent='';chime();P.speed=.8;return}
    bc.textContent=`第 ${i+1} / ${total} 次`;
    bw.textContent='吸～ 圈圈變大，魚兒游過來';P.speed=1.3;P.fish.forEach(f=>{f.tx=P.W/2+(Math.random()-.5)*P.W*.2;f.ty=P.H/2+(Math.random()-.5)*P.H*.2;f.pick=performance.now()+inT});
    anim(r0,r1,inT);tone(392,.3,'sine',.05);
    later(()=>{const bw2=$('#bw');if(!bw2)return;bw2.textContent='呼～～ 圈圈變小，魚兒慢慢游';P.speed=.6;P.fish.forEach(f=>f.pick=0);anim(r1,r0,outT);tone(294,.3,'sine',.05);
      later(()=>run(i+1),outT)},inT)}
}
