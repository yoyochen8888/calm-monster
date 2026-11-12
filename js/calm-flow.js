/* 冷靜流程：陪伴模式、選年齡/怪獸、情緒溫度計、冷靜活動、說說看、下次怎麼做 */
/* ---------- adult co-regulation mode ---------- */
let coInt=null,coStart=0;
function renderCo(){
  S.usedCo=true;if(!S.lv0)S.lv0=S.lv||5;
  if(!coStart)coStart=Date.now();
  const age=S.age||'mid';
  const ageName={young:'3–5 歲',mid:'6–8 歲',old:'9–12 歲'}[age];
  $('#checks').innerHTML=CO_STEPS.map(([t,d],i)=>`<li data-i="${i}"><span class="bx">✓</span><span class="tx"><b>${i+1}. ${t}</b><br>${d}</span></li>`).join('');
  $$('#checks li').forEach(li=>li.onclick=()=>li.classList.toggle('done'));
  $('#linesTitle').textContent=`可以說的短句（${ageName}）`;
  $('#lines').innerHTML=CO_LINES[age].map(x=>`<div>${x}</div>`).join('');
  $('#outlets').innerHTML=OUTLETS.map(x=>`<button class="chip">${x}</button>`).join('');
  $$('#outlets .chip').forEach(b=>b.onclick=()=>b.classList.toggle('sel'));
  speak('大人來陪你了，你很安全。');
  let w=0;
  const tick=()=>{
    const s=Math.floor((Date.now()-coStart)/1000);
    $('#elapsed').textContent=fmt(s);
    if(s%5===0){$('#coWord').textContent=CO_WORDS[w%CO_WORDS.length];w++}
    const L=$('#longWarn');
    if(s>=1800){L.className='warn hot';L.innerHTML='已經超過 30 分鐘。先確認孩子和大人都安全，可以請另一位大人來換手。如果常常這麼久、一週好幾次，或曾經傷害自己或別人，建議諮詢兒童心智科醫師、心理師或學校輔導老師。'}
    else if(s>=900){L.className='warn';L.textContent='已經 15 分鐘了。可以試著換個環境（到另一個房間、陽台吹吹風、洗把臉），或換另一位大人陪。大人累了也可以先深呼吸幾次。'}
  };
  tick();coInt=setInterval(tick,1000);
}
$('#coCalm').onclick=()=>{if(!S.coRewarded){S.coRewarded=true;gain('請大人陪伴，求助也是勇氣',10,{flow:1})}coStart=0;S.lv2=0;go(4)};
$('#openCo').onclick=()=>{closeP();if(!(S.step>=1&&S.step<=8)){resetFlow();S.hist=[10]}if(!S.emo)S.emo='angry';coStart=0;go(8)};
$$('[data-back]').forEach(b=>b.onclick=()=>go(S.step-1));

/* step 0 */
function renderAges(){
  $('#ages').innerHTML=AGES.map(a=>`<button class="pick ${S.age===a.id?'sel':''}" data-age="${a.id}">
    <div class="age-ico">${a.ico}</div><b>${a.name}</b><span>${a.sub}</span></button>`).join('');
  $$('[data-age]').forEach(b=>b.onclick=()=>{S.age=b.dataset.age;store.age=S.age;save();tone(600,.12);go(store.hero?10:12)});
}
/* step 1 */
function renderMonsters(){
  $('#monQ').textContent=S.sos?'你好一點了！剛剛是哪一隻怪獸來找你？':'現在，你心裡住著哪一隻怪獸？';
  $('#monJoy').style.display=S.sos?'none':'';renderAdultCue();
  $('#monHint').textContent=S.sos?'點一隻最像剛剛的感覺，我們再看看牠現在多大':'點一隻最像你的';
  $('#monsters').innerHTML=visibleEmo().map(k=>[k,EMO[k]]).map(([k,e])=>`<button class="pick ${S.emo===k?'sel':''}" data-emo="${k}">
    ${monster(k,84,'',{mood:2})}<b>${e.name}</b><span class="cname" style="background:${e.color}">${e.cname}</span><span class="lvtag">Lv.${lvOf(store.xp[k]||0)} ${TITLES[lvOf(store.xp[k]||0)-1]}</span></button>`).join('');
  $$('[data-emo]').forEach(b=>b.onclick=()=>{S.emo=b.dataset.emo;tone(500,.12);speak('我是'+EMO[S.emo].name);
    if(S.sos){S.sos=false;S.lv0=4;S.lv=4;S.lv2=0;if(S.sosDone&&S.actRewards<2){S.actRewards++;gain('完成冷靜活動',5,{flow:1,quiet:1})}S.sosDone=0;go(4)}else go(2)});
}
/* thermometer */
function thermo(el,stage,key,onPick){
  const c=EMO[S.emo].color;
  el.innerHTML=LV.map(l=>`<button class="lv ${S[key]===l.n?'sel':''}" style="--mc:${c}" data-lv="${l.n}">
    ${monster(S.emo,18+l.n*8,'',{mood:moodOf(l.n)})}<small>${l.t}</small><i class="heat" style="background:${l.h}"></i></button>`).join('')
    +`<div style="flex-basis:100%;height:0"></div>`;
  let prev=S[key]||3;const draw=()=>{const n=S[key]||3;
    stage.innerHTML=`<div class="${n<prev?'shrinkIn':n>prev?'growIn':''}" style="--from:${((60+prev*28)/(60+n*28)).toFixed(2)}">${monster(S.emo,60+n*28,'wobble',{mood:moodOf(n)})}</div>`;prev=n};
  draw();
  el.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{S[key]=+b.dataset.lv;tone(300+S[key]*90,.15);
    el.querySelectorAll('.lv').forEach(x=>x.classList.toggle('sel',x===b));draw();onPick&&onPick()});
}
function renderSize(){
  const e=EMO[S.emo],f=famOf(S.emo);
  $('#sizeQ').textContent=f.sizeQ(e.name);
  $('#sizeKey').textContent=EMO_FAM[S.emo]==='hot'?'🟢 平靜　🟡 有點煩　🔴 快爆炸':'🟢 一點點　🟡 中中的　🔴 好強烈';
  $('#sizeHint').textContent=`你${e.feel}。身體可能會${e.body}。`;
  $('#sizeMsg').innerHTML=`<div class="monmsg" style="--mc:${e.color}"><small>${e.name}想告訴你</small><b>「${EMO_MSG[S.emo]}」</b><span>${f.ok}</span></div>`;
  if(S.sizeSpoke!==S.emo){S.sizeSpoke=S.emo;setTimeout(()=>{if(S.step===2)speak(`${e.name}想告訴你：${EMO_MSG[S.emo]}。${f.ok}。`)},700)}
  const upd=()=>{
    $('#toCalm').disabled=!S.lv;
    const big=S.lv===5;
    $('#toCalm').textContent=big?'請大人來陪我':f.go;
    $('#selfTry').style.display=big?'':'none';
    if(big)$('#sizeHint').textContent='怪獸超級大！先請大人來陪你。';
    else $('#sizeHint').textContent=`你${e.feel}。身體可能會${e.body}。`;
  };
  thermo($('#thermo'),$('#sizeStage'),'lv',upd);
  upd();
}
$('#toCalm').onclick=()=>{S.lv0=S.lv;S.tries=0;S.act=null;if(S.lv===5){coStart=0;go(8)}else go(3)};
$('#selfTry').onclick=()=>{S.lv0=S.lv;S.tries=0;S.act=null;go(3)};

/* ---------- activities ---------- */
let timers=[];let raf=null;
function later(fn,ms){timers.push(setTimeout(fn,ms))}
function stopAct(){timers.forEach(clearTimeout);timers=[];if(raf)cancelAnimationFrame(raf);raf=null;if(typeof stopCorners==='function')stopCorners();try{speechSynthesis.cancel()}catch(e){}}

let actSpeech='';
function renderAct(){
  const e=EMO[S.emo];
  /* 4–5 級（v26）：只給身體的方法，選項少、不用想 */
  const big=!S.sos&&!S.practice&&S.lv>=4;
  const list=S.sos?['breathe','butterfly','squeeze']:S.practice?['breathe','light','bubbles','squeeze','senses','butterfly','fish','rain','kind']:big?famOf(S.emo).body.slice():e.acts.slice();
  if(!S.act||!list.includes(S.act))S.act=list[0];
  $('#actTabs').innerHTML=list.map(a=>`<button class="chip ${S.act===a?'sel':''}" data-act="${a}">${ACT_NAME[a]}</button>`).join('');
  $$('[data-act]').forEach(b=>b.onclick=()=>{S.act=b.dataset.act;stopAct();renderAct();ambSync()});
  $('#actTitle').textContent=S.sos?'🆘 先一起呼吸，不用想是哪隻怪獸':S.practice?'平時練習：心情好的時候先練起來':big?(EMO_FAM[S.emo]==='comfort'?'先讓人陪著你':'先照顧身體'):'冷靜時間';
  $('#actAdult').innerHTML=S.sos||S.practice?'':adultBox(S.emo);
  ({light:actLight,breathe:actBreathe,bubbles:actBubbles,squeeze:actSqueeze,senses:actSenses,butterfly:actButterfly,fish:actFish,comfort:actComfort,rain:actRain,kind:actKind})[S.act]();
}
$('#speakAct').onclick=()=>speak(actSpeech);
$('#actDone').onclick=()=>{
  if(S.practice){
    if(store.pracDay!==today()){store.pracDay=today();store.pracLog.push(today());store.pracLog=store.pracLog.slice(-60);gain('平時練習',5)}else toast('今天已經練習過了，你好認真！');
    S.practice=false;const bk=S.hist.pop();go(bk!==undefined?bk:17,true);return}
  S.actsDone=S.actsDone||[];if(!S.actsDone.includes(S.act))S.actsDone.push(S.act);
  if(S.sos){S.sosDone=1;go(1);return}
  if(S.actRewards<2){S.actRewards++;gain('完成冷靜活動',5,{flow:1,quiet:1})}
  S.lv2=0;go(4)};

function actBreathe(){
  const c=EMO[S.emo].color;const A=$('#actArea');
  if(S.age==='old'){
    actSpeech='方塊呼吸。吸氣四秒，停四秒，吐氣四秒，再停四秒。跟著小圓點繞方塊走。';
    $('#actHint').textContent='方塊呼吸：跟著小圓點，吸 4、停 4、吐 4、停 4';
    A.innerHTML=`<div class="breath-box"><div class="square" style="--mc:${c}"><div class="dot" id="dot"></div></div></div>
      <div class="breath-word" id="bw">準備好了嗎？</div><div class="count" id="bc"></div>
      <div class="row"><button class="btn" id="bStart">開始</button></div>`;
    $('#bStart').onclick=()=>{$('#bStart').style.display='none';boxRun(0)};
  } else {
    const young=S.age==='young';
    actSpeech=young?'我們來聞花、吹泡泡。用鼻子聞聞花香，吸——。再用嘴巴慢慢吹泡泡，呼——。':'我們來吹氣球。用鼻子慢慢吸氣，肚子像氣球一樣變大。再用嘴巴慢慢吐氣，氣球變小。';
    $('#actHint').textContent=young?'聞聞花香（吸 3 秒）、慢慢吹泡泡（吐 5 秒），做 5 次':'吹氣球呼吸：吸氣時氣球變大，吐氣時變小，做 5 次';
    A.innerHTML=`<div class="breath-box"><div class="ball" id="ball" style="--mc:${c}">${young?'🌸':''}</div></div>
      <div class="breath-word" id="bw">準備好了嗎？</div><div class="count" id="bc"></div>
      <div class="row"><button class="btn" id="bStart">開始</button></div>`;
    $('#bStart').onclick=()=>{$('#bStart').style.display='none';ballRun(0,young)};
  }
}
function ballRun(i,young){
  const ball=$('#ball'),bw=$('#bw'),bc=$('#bc');if(!ball)return;
  const total=5,inT=3000+(young?0:1000),outT=5000;
  if(i>=total){bw.textContent='好棒！你做完了 5 次';bc.textContent='';chime();ball.style.transform='scale(1)';return}
  bc.textContent=`第 ${i+1} / ${total} 次`;
  ball.style.transitionDuration=inT+'ms';ball.style.transform='scale(2.1)';
  bw.textContent=young?'聞聞花香～吸～':'鼻子吸氣～氣球變大';
  if(young)ball.textContent='🌸';tone(392,.3,'sine',.08);
  later(()=>{ball.style.transitionDuration=outT+'ms';ball.style.transform='scale(1)';
    bw.textContent=young?'吹泡泡～慢慢呼～～':'嘴巴吐氣～慢慢變小';if(young)ball.textContent='🫧';tone(294,.3,'sine',.08);
    later(()=>ballRun(i+1,young),outT+400)},inT);
}
function boxRun(i){
  const dot=$('#dot'),bw=$('#bw'),bc=$('#bc');if(!dot)return;
  const rounds=4;if(i>=rounds*4){bw.textContent='完成 4 圈，做得很好';chime();return}
  const side=i%4;const pos=[[-15,-15],[185,-15],[185,185],[-15,185]];
  const to=pos[(side+1)%4];const words=['吸氣 ↑','停住','吐氣 ↓','停住'];
  bc.textContent=`第 ${Math.floor(i/4)+1} / ${rounds} 圈`;
  dot.style.transition='left 4s linear, top 4s linear';dot.style.left=to[0]+'px';dot.style.top=to[1]+'px';
  let s=4;bw.textContent=words[side]+' 4';if(side===0)tone(392,.25,'sine',.07);if(side===2)tone(294,.25,'sine',.07);
  const tick=()=>{s--;if(s>0){bw.textContent=words[side]+' '+s;later(tick,1000)}};later(tick,1000);
  later(()=>boxRun(i+1),4000);
}

function actBubbles(){
  const e=EMO[S.emo];const goal=S.age==='young'?10:15;
  actSpeech=`把${e.name}的泡泡一顆一顆戳破。每戳一顆，怪獸就小一點。`;
  $('#actHint').textContent=`把「${e.feel}」的泡泡戳破，戳 ${goal} 顆！`;
  const A=$('#actArea');
  A.innerHTML=`<div class="pond" id="pond"></div><div class="count" id="bc" style="margin-top:10px">0 / ${goal}</div>`;
  let n=0;const pond=$('#pond');
  const spawn=()=>{
    if(!document.getElementById('pond'))return;
    const b=document.createElement('div');b.className='bub';
    const sz=S.age==='young'?70+Math.random()*30:48+Math.random()*34;
    b.style.width=b.style.height=sz+'px';b.style.left=Math.random()*(pond.clientWidth-sz)+'px';
    b.style.top=(340)+'px';b.style.setProperty('--bc',e.color+'88');
    const dur=(S.age==='old'?5:7)+Math.random()*3;b.style.animationDuration=dur+'s';
    b.addEventListener('pointerdown',ev=>{
      ev.preventDefault();n++;tone(700+Math.random()*400,.08,'triangle',.12);
      const p=document.createElement('div');p.className='pop';p.textContent='啵！';
      const r=b.getBoundingClientRect(),pr=pond.getBoundingClientRect();
      p.style.left=(r.left-pr.left+sz/3)+'px';p.style.top=(r.top-pr.top+sz/3)+'px';pond.appendChild(p);later(()=>p.remove(),600);
      b.remove();$('#bc').textContent=`${Math.min(n,goal)} / ${goal}`;
      if(n===goal){chime();$('#bc').textContent=`全部戳破了！怪獸變小了`;}
    });
    b.addEventListener('animationend',()=>b.remove());
    pond.appendChild(b);
    if(n<goal)later(spawn,S.age==='young'?900:650);
  };
  spawn();
}

function actSqueeze(){
  const rounds=3;let done=0;
  actSpeech='兩手用力擠檸檬！按住黃色檸檬，用力、用力、再用力。放開的時候，手變得軟軟的，好放鬆。';
  $('#actHint').textContent=`按住檸檬，同時兩手握拳用力擠 4 秒，放開放鬆。做 ${rounds} 次`;
  $('#actArea').innerHTML=`<button class="lemon" id="lemon">按住我<br>用力擠！</button>
    <div class="breath-word" id="bw" style="font-size:1.3rem">0 / ${rounds}</div>`;
  const L=$('#lemon');let start=0,holding=false;
  const loop=()=>{if(!holding)return;const p=Math.min(100,(performance.now()-start)/40);L.style.setProperty('--p',p+'%');
    if(p>=100){holding=false;L.classList.remove('hold');done++;chime();
      $('#bw').textContent=done>=rounds?'好棒！手手軟軟的，好放鬆～':`放鬆～手變軟軟的（${done} / ${rounds}）`;
      L.innerHTML=done>=rounds?'完成！':'放開<br>休息一下';
      later(()=>{L.style.setProperty('--p','0%');if(done<rounds)L.innerHTML='再擠<br>一次！'},1800);return}
    raf=requestAnimationFrame(loop)};
  L.addEventListener('pointerdown',ev=>{if(done>=rounds)return;ev.preventDefault();ac();holding=true;start=performance.now();L.classList.add('hold');L.innerHTML='用力～<br>擠擠擠！';tone(220,.2,'sawtooth',.05);loop()});
  const up=()=>{if(!holding)return;holding=false;L.classList.remove('hold');L.style.setProperty('--p','0%');L.innerHTML='再久一點喔<br>按住我';};
  L.addEventListener('pointerup',up);L.addEventListener('pointerleave',up);L.addEventListener('pointercancel',up);
}

function actSenses(){
  const young=S.age==='young';
  const steps=young?[
    ['找找看，身邊有 3 個「紅色」的東西',3],['仔細聽，有 2 種聲音',2],['摸摸看 1 個軟軟的東西',1]
  ]:[
    ['看看四周，找出 5 樣看得到的東西',5],['摸摸看 4 樣東西（衣服、桌子……）',4],['仔細聽 3 種聲音',3],['聞聞看 2 種味道',2],['說出 1 件讓你開心的事',1]
  ];
  actSpeech=young?'我們來玩找找看。找到一個就點一下圓圈。':'五四三二一感官遊戲。把注意力放到身邊，每找到一個就點一下圓圈。';
  $('#actHint').textContent=young?'找到一個就點一個圈圈':'5-4-3-2-1 感官遊戲：把注意力帶回身邊';
  let i=0;const A=$('#actArea');
  const draw=()=>{
    if(i>=steps.length){A.innerHTML=`<div class="breath-word">你把注意力找回來了！</div>`;chime();return}
    const [t,c]=steps[i];
    A.innerHTML=`<div class="count">${i+1} / ${steps.length}</div><div class="sense">${t}</div>
      <div class="taps">${Array.from({length:c},(_,k)=>`<button class="tap" data-k="${k}">${k+1}</button>`).join('')}</div>`;
    speak(t);
    A.querySelectorAll('.tap').forEach(b=>b.onclick=()=>{b.classList.add('done');b.textContent='✓';tone(520+80*i,.1);
      if(A.querySelectorAll('.tap.done').length===c){i++;later(draw,700)}});
  };
  draw();
}

function actButterfly(){
  actSpeech='蝴蝶抱。兩手交叉放在胸前，像蝴蝶的翅膀。左邊拍一下，右邊拍一下，慢慢地，跟著亮起來的翅膀拍。';
  $('#actHint').textContent='雙手交叉放胸前，跟著亮起來的翅膀，左右輪流輕輕拍';
  $('#actArea').innerHTML=`<div class="wings"><div class="wing" id="wl">左</div><div class="wing" id="wr">右</div></div>
    <div class="breath-word" id="bw" style="font-size:1.2rem">一邊拍，一邊慢慢呼吸</div><div class="count" id="bc"></div>
    <div class="row"><button class="btn" id="bStart">開始拍拍</button></div>`;
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';let k=0;const total=24;
    const beat=()=>{if(!$('#wl'))return;if(k>=total){$('#wl').classList.remove('on');$('#wr').classList.remove('on');$('#bw').textContent='抱抱自己，你做得很好';chime();return}
      const L=k%2===0;$('#wl').classList.toggle('on',L);$('#wr').classList.toggle('on',!L);tone(L?440:494,.12,'sine',.07);
      $('#bc').textContent=`${k+1} / ${total}`;k++;later(beat,1100)};beat()};
}

/* step 4 */
/* 3–5 歲（v26）：再看一次大小就完成，「發生什麼、下次怎麼做」留給事後的一起回顧 */
function toTalk(){if(S.age==='young')$('#finish').onclick();else go(5)}
function renderRe(){
  const f=famOf(S.emo),cf=EMO_FAM[S.emo]==='comfort';
  $('#reQ').textContent=f.reQ;$('#reHint').textContent=f.reHint;
  $('#reMsg').textContent='';$('#reBtns').innerHTML='';
  const talk=S.age==='young'?'完成':'好，說說看';
  thermo($('#thermo2'),$('#reStage'),'lv2',()=>{
    const d=S.lv-S.lv2;const msg=$('#reMsg');
    if(S.lv2<=2){msg.textContent=cf?(d>0?'心裡的雨變小了，你把自己照顧得很好。':'好一點點了，你很棒。'):d>0?`哇！怪獸從 ${S.lv} 變成 ${S.lv2} 了，你好厲害。`:'怪獸已經小小的了。';
      $('#reBtns').innerHTML=`<button class="btn" id="goTalk">${talk}</button>`;$('#goTalk').onclick=toTalk;}
    else if(S.lv2>=4 || S.tries>=1){
      msg.textContent=cf?'還是好難過，沒關係。請大人來陪你、抱抱你。':S.lv2>=4?'怪獸還很大，沒關係，先請大人來陪你。':'試了好幾種方法，怪獸還在。我們請大人來陪你。';
      $('#reBtns').innerHTML=`<button class="btn ghost" id="again">再試一個方法</button><button class="btn" id="needAdult">請大人來陪我</button>`;
      $('#again').onclick=()=>{nextAct();go(3)};
      $('#needAdult').onclick=()=>{coStart=0;go(8)};}
    else{msg.textContent=cf?'心裡還有一點雨，沒關係。可以再試一個方法，或請大人陪你。':'怪獸還有點大，沒關係，我們再試一個方法，或請大人陪你。';
      $('#reBtns').innerHTML=`<button class="btn ghost" id="again">換一個方法</button><button class="btn" id="goTalk">${S.age==='young'?'完成':'我想說說看'}</button>`;
      $('#again').onclick=()=>{nextAct();go(3)};
      $('#goTalk').onclick=toTalk;}
  });
}

function nextAct(){const l=EMO[S.emo].acts;S.act=l[(l.indexOf(S.act)+1)%l.length];S.lv=S.lv2;S.tries++}

/* step 5 */
function renderTalk(){
  const mk=(id,arr,key)=>{$(id).innerHTML=arr.map(x=>`<button class="chip ${S[key]===x?'sel':''}">${x}</button>`).join('');
    $(id).querySelectorAll('.chip').forEach(b=>b.onclick=()=>{S[key]=b.textContent;tone(560,.1);renderTalk()})};
  const F=famOf(S.emo);mk('#causes',F.causes,'cause');mk('#wants',F.wants,'want');mk('#dmg',['沒有','有'],'dmg');
  if(S.dmg==='有'){$('#repairOpts').innerHTML=`<p style="margin:10px 0 6px">沒關係，我們可以想辦法修補。你願意做哪一件事？</p><div class="chips" id="repList" style="justify-content:flex-start"></div>`;
    mk('#repList',REPAIRS[S.age||'mid'],'repair');}
  else {$('#repairOpts').innerHTML='';S.repair=null;}
  const e=EMO[S.emo];
  const c=S.cause?S.cause.replace(/^我/,'').replace(' / ','、'):'＿＿＿';
  const w=S.want||'＿＿＿';
  $('#sentence').innerHTML=`我覺得<u>${e.feel}</u>，<br>因為<u>${c}</u>。<br>我現在想要<u>${w}</u>。`;
}
$('#speakSent').onclick=()=>speak($('#sentence').textContent);
$('#toNext').onclick=()=>{if(S.cause&&!S.talkRewarded){S.talkRewarded=true;gain('把感覺說出來',5,{flow:1,quiet:1})}go(6)};

/* step 6 */
function renderPlans(){
  const list=famOf(S.emo).plans[S.age||'mid'];
  $('#plans').innerHTML=list.map(([t,s])=>`<button class="pick ${S.plan===t?'sel':''}" data-plan="${t}"><b>${t}</b><span>${s}</span></button>`).join('');
  $$('[data-plan]').forEach(b=>b.onclick=()=>{S.plan=b.dataset.plan;tone(620,.12);speak(b.textContent);renderPlans();$('#finish').disabled=false});
  $('#finish').disabled=!S.plan;
}
function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function toast(html,big){const t=document.createElement('div');t.className='toast'+(big?' big':'');t.innerHTML=html;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),3100)}
function gain(label,n,opt={}){
  if(opt.flow&&S.capped){if(!S.capToasted){S.capToasted=true;toast('今天的星星拿滿了，明天再來拿！你還是很棒')}return 0}
  const mon=opt.flow?S.emo:null;
  const p0=lvIn(PLV,store.pxp||0);let m0=0,m1=0;
  store.stars=(store.stars||0)+n;store.pxp=(store.pxp||0)+n;
  if(mon){m0=lvOf(store.xp[mon]||0);store.xp[mon]=(store.xp[mon]||0)+n;m1=lvOf(store.xp[mon])}
  save();
  if(opt.flow)S.earned.push([label,n]);
  let up='';
  if(mon&&m1>m0){up=`${EMO[mon].name}升到 Lv.${m1}「${TITLES[m1-1]}」`;S.monUp={from:m0,to:m1}}
  const p1=lvIn(PLV,store.pxp);if(p1>p0)up+=(up?'<br>':'')+`主角升到 Lv.${p1}「${PTITLES[p1-1]}」`;
  /* 冷靜流程中（v26）：不跳星星和升級通知，結束頁再一起看 */
  if(opt.flow){if(p1>p0)S.heroUp=p1;return n}
  if(!opt.quiet||up)toast(opt.quiet?`<b>🎉 ${up}！</b>`:`+${n} ⭐ ${label}<br><small>經驗值 +${n}</small>`+(up?`<br><b>🎉 ${up}！</b>`:''),!!up);
  tone(880,.12,'triangle',.1);if(up)setTimeout(()=>{tone(784,.2);setTimeout(()=>tone(1046,.5),180)},350);
  return n;
}
function resetFlow(){Object.assign(S,{sos:false,sosDone:0,emo:null,lv:0,lv0:0,lv2:0,act:null,cause:null,want:null,plan:null,usedCo:false,tries:0,earned:[],actRewards:0,coRewarded:false,talkRewarded:false,practice:false,sizeSpoke:null,need:null,cueDone:false,dmg:null,repair:null,actsDone:[],monUp:null,heroUp:null,capToasted:false});
  const d=today();if(!store.day||store.day.d!==d)store.day={d,n:0};S.capped=store.day.n>=5;store.day.n++;save()}
function startFlow(){if(!S.age){go(0);return}resetFlow();S.hist=[10];go(1,true)}
function holdBtn(label,ms,cb){const b=document.createElement('button');b.className='hold';b.innerHTML=`<i></i><span>${label}</span>`;
  let t0=0,on=false;const f=b.querySelector('i');
  const loop=()=>{if(!on)return;const p=Math.min(1,(performance.now()-t0)/ms);f.style.width=p*100+'%';if(p>=1){on=false;cb();return}requestAnimationFrame(loop)};
  b.addEventListener('pointerdown',e=>{e.preventDefault();ac();on=true;t0=performance.now();loop()});
  const up=()=>{on=false;f.style.width='0'};['pointerup','pointerleave','pointercancel'].forEach(x=>b.addEventListener(x,up));
  return b}

$('#finish').onclick=()=>{
  const e=EMO[S.emo];
  const lv0=S.lv0||S.lv||3, lv2=S.lv2||lv0, shrink=lv0-lv2;
  gain('勇敢面對怪獸',10,{flow:1,quiet:1});
  if(shrink>0)gain(EMO_FAM[S.emo]==='comfort'?`心裡好了 ${shrink} 級`:`怪獸變小了 ${shrink} 級`,shrink*5,{flow:1,quiet:1});
  if(S.plan)gain('想好下次的方法',5,{flow:1,quiet:1});
  let tough='';
  if(shrink<=0){store.tough=(store.tough||0)+1;
    tough='今天的怪獸特別大，沒有變小也沒關係。你願意來面對它，就是很大的勇氣。';
    if(store.tough>=3){gain('堅持不放棄',15,{flow:1,quiet:1});store.tough=0;store.toughAt=Date.now();
      tough='最近怪獸常常很大，你還是一次又一次來面對，真的很不簡單！可以跟大人說說最近發生了什麼事，讓大人一起幫你。';}
  } else store.tough=0;
  if(S.repair){store.repairs.push({id:Date.now(),text:S.repair,emo:S.emo});}
  store.log.unshift({t:Date.now(),emo:S.emo,lv0,lv2,cause:S.cause||'',want:S.want||'',acts:(S.actsDone||[]).map(a=>ACT_NAME[a]),co:!!S.usedCo,plan:S.plan||'',repair:S.repair||'',note:''});
  store.log=store.log.slice(0,300);
  store.badges=(store.badges||0)+1;save();
  const xp=store.xp[S.emo]||0,lv=lvOf(xp),nx=nextOf(xp);
  go(7);
  $('#winQ').textContent={hot:`你陪${e.name}冷靜下來了！`,comfort:`你好好照顧了${e.name}！`,safe:`你陪${e.name}找回安全感了！`,repair:`你好好照顧了自己！`}[EMO_FAM[S.emo]||'hot'];
  $('#winMon').innerHTML=`<div class="morph"><div class="m-a">${monster(S.emo,150,'',{mood:moodOf(S.lv0||3)})}</div><div class="m-b">${monster(S.emo,150,'wobble')}</div></div>`;
  $('#winLv').textContent=`${e.name} Lv.${lv} ${TITLES[lv-1]}`+(nx.need?`（再 ${nx.need} 經驗升級）`:'（最高等級！）');
  setTimeout(()=>$('#winXp').style.width=nx.pct+'%',100);
  $('#levelUp').innerHTML=S.monUp?`${S.monUp.from<CORNER_LV&&S.monUp.to>=CORNER_LV?`<div class="levelup">⭐ ${EMO[S.emo].name}教你牠的拿手方法：${CORNERS[S.emo].ico} ${CORNERS[S.emo].name}！到圖鑑就可以一起練習</div>`:''}<div class="levelup">🎉 升級了！${e.name}變成 <b>Lv.${S.monUp.to}「${TITLES[S.monUp.to-1]}」</b><br><small>${stageOf(S.monUp.to)>stageOf(S.monUp.from)?`✨ 長大成「${STAGES[stageOf(S.monUp.to)-1].n}」，學會了${BADGE[S.emo][1]}：${BADGE[S.emo][2]}！`:S.monUp.to>=5?'身上出現了金色光環':S.monUp.to>=3?'身邊開始閃閃發亮':'又長大了一點'}</small>${stageOf(S.monUp.to)>stageOf(S.monUp.from)?`<div class="evo">${monster(S.emo,70,'',{level:S.monUp.from})}<b>➜</b>${monster(S.emo,96,'wobble',{level:S.monUp.to})}</div>`:''}</div>`:'';
  if(S.heroUp)$('#levelUp').insertAdjacentHTML('beforeend',`<div class="levelup">🎉 ${store.hero?store.hero.name:'主角'}升到 Lv.${S.heroUp}「${PTITLES[S.heroUp-1]}」！</div>`);
  const total=S.earned.reduce((a,b)=>a+b[1],0);
  $('#rewardList').innerHTML=S.capped?`<li>今天已經練習 5 次以上了，星星明天再來拿。你還是很棒！</li>`
    :S.earned.map(([t,n])=>`<li><span>${t}</span><b>+${n} ⭐</b></li>`).join('')+`<li class="total"><span>這次一共拿到</span><b>${total} ⭐</b></li>`;
  $('#toughMsg').style.display=tough?'':'none';$('#toughMsg').textContent=tough;
  $('#planShow').style.display=S.plan||S.repair?'':'none';$('#planShow').innerHTML=(S.plan?`下次${e.name}來的時候，<br>我要試試：<u>${S.plan}</u>`:'')+(S.repair?`<br><br>🔧 修復任務：<u>${S.repair}</u><br><small>做完後請大人在家園確認，可以拿到 15 顆星星</small>`:'');
  chime();
};
$('#restart').onclick=()=>go(10);
$('#winDex').onclick=()=>go(11);

/* ---------- traffic light activity ---------- */
function actLight(){
  actSpeech='紅綠燈遊戲。紅燈，停！手腳停下來。黃燈，慢慢深呼吸。綠燈，想一個好方法再做。';
  $('#actHint').textContent='紅燈：停一停　黃燈：深呼吸　綠燈：想好方法再做';
  const A=$('#actArea');
  A.innerHTML=`<div class="tlight"><i id="lr"></i><i id="ly"></i><i id="lg"></i></div>
    <div class="breath-word" id="bw">準備好了嗎？</div><div id="lgOpts"></div>
    <div class="row"><button class="btn" id="bStart">開始</button></div>`;
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';
    const on=id=>['lr','ly','lg'].forEach(x=>$('#'+x).classList.toggle('on',x===id));
    on('lr');let c=4;$('#bw').textContent=`紅燈：停！手腳停下來 ${c}`;tone(330,.3);speak('紅燈，停！');
    const tk=()=>{c--;if(c>0){$('#bw').textContent=`紅燈：停！手腳停下來 ${c}`;later(tk,1000)}else yellow()};later(tk,1000);
    const yellow=()=>{on('ly');tone(440,.3);speak('黃燈，深呼吸');let i=0;
      const br=()=>{if(i>=4){green();return}$('#bw').textContent=i%2===0?'黃燈：鼻子吸氣～':'黃燈：嘴巴吐氣～～';i++;later(br,i%2?3500:4500)};br()};
    const green=()=>{on('lg');tone(523,.3);speak('綠燈，想一個好方法');$('#bw').textContent='綠燈：選一個好方法';
      $('#lgOpts').innerHTML=`<div class="chips">${['用說的','請大人幫忙','先離開一下','再試一次','換個方法'].map(x=>`<button class="chip">${x}</button>`).join('')}</div>`;
      $$('#lgOpts .chip').forEach(b=>b.onclick=()=>{$$('#lgOpts .chip').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');chime();$('#bw').textContent=`好方法：${b.textContent}！`})};
  };
}

