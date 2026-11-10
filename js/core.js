/* 音效、語音、怪獸圖、換頁 */
/* ---------- audio & speech ---------- */
let AC=null;
function ac(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){}return AC}
function tone(f=520,d=.15,type='sine',vol=.15){const a=ac();if(!a)return;try{
  const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);
  o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+d);}catch(e){}}
function chime(){tone(660,.6);setTimeout(()=>tone(880,.8),250);setTimeout(()=>tone(990,1),500)}
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='zh-TW';u.rate=.85;u.pitch=1.1;speechSynthesis.speak(u)}catch(e){}}

/* ---------- monster svg ---------- */
/* 新怪獸還沒有 3D 圖前的暫代圖：圓圓的身體＋表情（情緒時皺眉，平常微笑） */
function placeholderMon(c,x,y,w,mood){const cx=x+w/2,cy=y+w*.58,r=w*.36;
  const mouth=mood?`<path d="M${cx-r*.28} ${cy+r*.42} Q${cx} ${cy+r*.18} ${cx+r*.28} ${cy+r*.42}" stroke="#3B2F2A" stroke-width="${r*.08}" fill="none" stroke-linecap="round"/>`
    :`<path d="M${cx-r*.28} ${cy+r*.25} Q${cx} ${cy+r*.5} ${cx+r*.28} ${cy+r*.25}" stroke="#3B2F2A" stroke-width="${r*.08}" fill="none" stroke-linecap="round"/>`;
  const brow=mood?`<path d="M${cx-r*.5} ${cy-r*.3} l${r*.3} ${r*.1} M${cx+r*.5} ${cy-r*.3} l${-r*.3} ${r*.1}" stroke="#3B2F2A" stroke-width="${r*.07}" stroke-linecap="round"/>`:'';
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r*1.05}" fill="${c}"/><ellipse cx="${cx-r*.25}" cy="${cy-r*.45}" rx="${r*.35}" ry="${r*.25}" fill="#fff" opacity=".25"/>
    <ellipse cx="${cx-r*.45}" cy="${cy+r*.98}" rx="${r*.22}" ry="${r*.1}" fill="${c}"/><ellipse cx="${cx+r*.45}" cy="${cy+r*.98}" rx="${r*.22}" ry="${r*.1}" fill="${c}"/>
    <circle cx="${cx-r*.33}" cy="${cy-r*.05}" r="${r*.16}" fill="#fff"/><circle cx="${cx+r*.33}" cy="${cy-r*.05}" r="${r*.16}" fill="#fff"/>
    <circle cx="${cx-r*.33}" cy="${cy-r*.02}" r="${r*.09}" fill="#3B2F2A"/><circle cx="${cx+r*.33}" cy="${cy-r*.02}" r="${r*.09}" fill="#3B2F2A"/>
    <circle cx="${cx-r*.6}" cy="${cy+r*.25}" r="${r*.12}" fill="#FF8FA8" opacity=".45"/><circle cx="${cx+r*.6}" cy="${cy+r*.25}" r="${r*.12}" fill="#FF8FA8" opacity=".45"/>${brow}${mouth}`}
function monster(kind,size=110,cls='',opt={}){
  const e=EMO[kind];const c=e.color;
  const level=opt.level!==undefined?opt.level:lvOf(store.xp[kind]||0);
  const eq=Object.assign({},store.equip||{},opt.eq||{});
  const spark=(x,y,r)=>`<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3} Z" fill="#FFD166"/>`;
  const aura=level>=5?`<ellipse cx="60" cy="62" rx="62" ry="60" fill="none" stroke="#FFD166" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`:'';
  const sparks=level>=3?spark(2,34,7)+spark(118,46,6)+(level>=4?spark(110,110,5)+spark(6,100,5):''):'';
  const mood=opt.mood||0;const grow=mood?0:(opt.grow||stageOf(level));
  const st=mood;const sc=mood?SIZES[mood-1].s:STAGES[grow-1].s;const w=136*sc,x=60-w/2,y=124-w;
  const dy=y+w*.17-10;
  const bd=BADGE[kind];const badge=grow>=2&&bd&&!GROWN.has(kind)?`<g transform="translate(${(60+w*.3).toFixed(1)} ${(124-w*.3).toFixed(1)}) scale(${grow>=4?1.25:grow>=3?1.1:1})"><circle r="13" fill="#fff" stroke="${c}" stroke-width="3"/><text y="5.5" text-anchor="middle" font-size="15">${bd[0]}</text></g>`:'';
  return `<svg class="mon ${cls}" width="${size}" height="${size}" viewBox="-8 -22 136 150" aria-label="${e.name}${mood?' '+SIZES[mood-1].n:' '+STAGES[grow-1].n}">
    ${aura}
    <ellipse cx="60" cy="121" rx="${w*.36}" ry="5" fill="${c}" opacity=".18"/>
    ${HASART.has(kind)?(()=>{const f=mood||!GROWN.has(kind)?`${kind}${st}`:`${kind}g${grow}`;const ar=ASPECT[f]||1;return `<image href="img/${f}.webp" x="${(60-w*ar/2).toFixed(1)}" y="${y}" width="${(w*ar).toFixed(1)}" height="${w}"/>`})():clayMon(c,x,y,w,mood)}
    <g transform="translate(0 ${dy.toFixed(1)})">${eq.neck&&ACC[eq.neck]?`<g transform="translate(0 ${(w*.5).toFixed(1)})">${ACC[eq.neck]}</g>`:''}${eq.head&&ACC[eq.head]?ACC[eq.head]:''}</g>${badge}${sparks}
  </svg>`;
}

/* ---------- navigation ---------- */
S.hist=[];S.earned=[];
function go(n,noPush){
  if(n!==10)clearInterval(wanderT);
  if(n!==23)stopWatch();
  if(isNight()&&([11,17,18,19,20,21,24,25].includes(n)||(n===23&&S.wMode!=='album'))){toast('晚上了，遊戲和商店明天再開 🌙<br>需要冷靜時，冷靜站還是可以用');if(S.step===10)return;n=10}
  stopAct();clearInterval(coInt);
  if(!noPush&&S.step!==undefined&&S.step!==n)S.hist.push(S.step);
  if(n===7||n===10)S.hist=[];
  S.step=n;
  $('#dots').style.display=(n>=1&&n<=7)?'':'none';
  $('#navrow').style.display=(n===0||n===7||n===10)?'none':'';
  $('#navBack').style.visibility=S.hist.length?'visible':'hidden';
  const tab=(n>=1&&n<=8)?1:((n>=18&&n<=21)||n===23)?17:n===22?9:(n===24||n===25||n===26)?10:n;
  $$('[data-tab]').forEach(b=>b.classList.toggle('on',+b.dataset.tab===tab));
  $$('.step').forEach(s=>s.classList.toggle('on',+s.dataset.step===n));
  $('#dots').innerHTML=Array.from({length:8},(_,i)=>`<i class="${i===n?'on':''}"></i>`).join('');
  window.scrollTo({top:0,behavior:'smooth'});
  if(n===1)renderMonsters();
  if(n===2)renderSize();
  if(n===3)renderAct();
  if(n===4)renderRe();
  if(n===5)renderTalk();
  if(n===6)renderPlans();
  if(n===8)renderCo();
  if(n===9)renderDex();
  if(n===10)renderHome();
  if(n===11)renderShop();
  if(n===12)renderHeroes();
  if(n===13)renderGoods();
  if(n===14)renderLog();
  if(n===15)renderWeek();
  if(n===16)renderCpn();
  if(n===17)renderGames();
  if(n===18)renderRoutine();
  if(n===19)renderMemory(true);
  if(n===20)renderTR();
  if(n===21)renderCB();
  if(n===22)renderMD();
  if(n===23)renderWatch();
  if(n===24)renderPond();
  if(n===25)renderGarden();
  if(n===26)renderReview();
}

