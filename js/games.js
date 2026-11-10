/* 遊戲時間：每天10分鐘、記憶翻牌、烏龜兔子石頭、顏色泡泡、安靜觀察 */
/* ---------- games hub ---------- */
function gameReward(id,label){if(!store.playLog.includes(today()))store.playLog.push(today());store.playLog=store.playLog.slice(-60);
  if(store.gameDay[id]!==today()){store.gameDay[id]=today();gain(label,3)}else{save();toast('今天已經拿過這個遊戲的星星了，再玩也很棒！')}}
const LIB=[
  ['redgreen','🚦','紅綠燈','大人喊「綠燈」就走或跑，喊「紅燈」立刻定住；加「黃燈」就慢慢走。','聽指令、衝動控制、身體煞車','太簡單：黃燈要單腳站；太難：只用紅燈和綠燈。'],
  ['tamb','🥁','鈴鼓快慢走','鈴鼓敲快就快走，敲慢就像烏龜慢慢走，聲音停了就要停。沒有鈴鼓可以拍手。','聽指令、調整速度、自我控制','太簡單：加入「倒退走」；太難：只有快和停。'],
  ['mirror','🪞','鏡子遊戲','大人做慢動作，孩子像鏡子一樣同步模仿，每 30 秒換一個動作，之後交換角色。','視覺專注、觀察、動作控制','太難：動作再慢一點、只動手；太簡單：加入表情。'],
  ['ball','⚽','顏色球接球','滾不同顏色的球，只接指定顏色，其他顏色要放過去。','選擇性注意、忍住不接','太難：只用兩種顏色；太簡單：規則改成「不接紅色」。'],
  ['lr','✋','左右手指令','孩子左右手各拿一樣東西，聽指令：「襪子舉起來、牙刷放下來」。','工作記憶、聽覺專注、左右協調','太簡單：一次說兩個指令；太難：只動一隻手。'],
  ['balloon','🎈','氣球不落地','用手或墊子拍氣球，不讓它掉到地上；熟練後要繞過椅子。','持續注意、手眼協調、情緒調節','太難：兩個人一起拍；太簡單：只能用一隻手。'],
  ['freeze','🎵','音樂定格','音樂播放時跳舞，音樂一停就變成雕像。下面可以直接播音樂！','在興奮和平靜之間切換','太簡單：停的時候要做指定動作；太難：停久一點再開始。'],
  ['bear','🐻','小熊與恐龍','聽到「小熊說」才照做，聽到「恐龍說」不能動；熟練後規則反過來。','忍住習慣反應、規則轉換','太難：先只玩「小熊說」；太簡單：規則反轉。'],
  ['face','🎭','情緒臉譜配對','抽一張怪獸卡，說說「我什麼時候會這樣」，大人也說一次。下面可以直接抽卡！','情緒辨識、說出感覺','太難：大人先說；太簡單：演出那個表情讓對方猜。'],
  ['corner','🛋️','冷靜角落尋寶','一起布置冷靜角：抱枕、圖卡、壓力球、繪本。生氣時去選一樣「冷靜工具」。','主動使用安撫方法','可以把工具裡孩子覺得最有效的方法畫成卡片放進去。'],
  ['carry','🤝','合作運送','兩個人背靠背，或用手肘夾著球，一起把球或枕頭運到終點。','輪流、合作、接受別人的想法','太難：用大一點的枕頭；太簡單：加障礙物。'],
  ['diff','🔍','找不同／迷宮','從簡單的圖卡開始找不同或走迷宮，完成後讓孩子自己指出哪裡不一樣。','持續注意、視覺搜尋','太難：只找 2 個不同；太簡單：限時完成。']
];
function ageTime(){return S.age==='young'?'建議時間：3 歲約 3–5 分鐘、4 歲約 5–8 分鐘、5–6 歲約 8–15 分鐘。一次只玩一種，收起其他玩具。':'建議時間：每次 10–15 分鐘。一次只玩一種，收起其他玩具。'}
function renderGames(){
  $('#gRoutineSub').textContent=store.gameDay.routine===today()?'今天完成了！再玩一次也可以':'熱身 → 專注 → 情緒 → 收尾，一步一步帶你玩';
  $('#gCalmSub').textContent=store.pracDay===today()?'今天練過了，再練也可以':'心情好時先練 +5 ⭐';
  $('#gTime').textContent=ageTime();
  $('#gWatchSub').textContent=`安靜下來，小動物就會出現，拍照收進圖鑑（${critFound()} / ${Object.keys(CRIT).length}）`;
  S.libOpen=S.libOpen||null;
  $('#gLib').innerHTML=LIB.map(([id,ic,nm,how,sk,adj])=>`<div class="pick gcard" style="margin-top:10px" data-lib="${id}"><b>${ic} ${nm}</b><span>練到：${sk}</span>
    ${S.libOpen===id?`<div class="gdetail"><b>怎麼玩</b>：${how}<br><b>調整難度</b>：${adj}<div id="libExtra"></div>
      <div class="row" style="margin-top:8px"><button class="btn small" data-played="${id}">我們玩過了 +3 ⭐</button></div></div>`:''}</div>`).join('');
  $$('[data-lib]').forEach(c=>c.onclick=e=>{if(e.target.closest('button,#libExtra'))return;S.libOpen=S.libOpen===c.dataset.lib?null:c.dataset.lib;stopAct();renderGames()});
  $$('[data-played]').forEach(b=>b.onclick=()=>{const g=LIB.find(x=>x[0]===b.dataset.played);gameReward('lib_'+g[0],'親子遊戲：'+g[2])});
  if(S.libOpen==='freeze')freezeMusic($('#libExtra'));
  if(S.libOpen==='face')faceCard($('#libExtra'));
}
$('#gRoutine').onclick=()=>{S.rStage=0;go(18)};
$('#gMem').onclick=()=>go(19);$('#gTR').onclick=()=>go(20);$('#gColor').onclick=()=>go(21);
$('#gCalm').onclick=()=>startPractice('scared','breathe');
$('#gWatch').onclick=()=>{S.wMode='menu';go(23)};
$('#toCritDex').onclick=()=>{S.wMode='album';go(23)};

/* music freeze helper */
function freezeMusic(el){
  el.innerHTML=`<div class="row" style="margin-top:8px"><button class="btn small" id="fzPlay">▶ 播放音樂</button><button class="btn small ghost" id="fzStop">停止</button></div><div class="breath-word" id="fzMsg" style="font-size:1.3rem;min-height:1.6em"></div>`;
  let playing=false;const notes=[523,587,659,784,880,784,659,587];
  const loop=(k,left)=>{if(!playing)return;
    if(left<=0){$('#fzMsg').textContent='🗿 定格！變成雕像！';tone(196,.4,'square',.06);later(()=>{if(!playing)return;$('#fzMsg').textContent='💃 跳舞！';loop(0,20+Math.floor(Math.random()*30))},3000+Math.random()*2000);return}
    tone(notes[k%notes.length]*(Math.random()<.3?1.5:1),.18,'triangle',.08);later(()=>loop(k+1,left-1),260)};
  $('#fzPlay').onclick=e=>{e.stopPropagation();ac();if(playing)return;playing=true;$('#fzMsg').textContent='💃 跳舞！';loop(0,20+Math.floor(Math.random()*30))};
  $('#fzStop').onclick=e=>{e.stopPropagation();playing=false;stopAct();$('#fzMsg').textContent=''};
}
/* emotion face card helper */
function faceCard(el,onDraw){
  el.innerHTML=`<div class="stage" id="fcMon" style="min-height:110px"></div><div class="sentence" id="fcQ" style="display:none"></div><div class="row"><button class="btn small" id="fcDraw">抽一張怪獸卡</button></div>`;
  $('#fcDraw').onclick=e=>{e.stopPropagation();const ks=visibleEmo();const k=ks[Math.floor(Math.random()*ks.length)];
    $('#fcMon').innerHTML=monster(k,100,'wobble',{mood:2});$('#fcQ').style.display='';$('#fcQ').innerHTML=`抽到<u>${EMO[k].name}</u>！<br>你什麼時候會覺得<u>${EMO[k].feel.replace(/^好/,'')}</u>？<br><small>說完換大人說一次</small>`;
    tone(660,.15);speak(`抽到${EMO[k].name}。你什麼時候會覺得${EMO[k].feel.replace(/^好/,'')}？`);onDraw&&onDraw()};
}

/* ---------- 10-minute routine ---------- */
const RSTAGES=[['熱身',120],['專注',240],['情緒',180],['收尾',60]];
const WINS=['我等到了','我沒有丟玩具','輸了也說再玩一次','我用說的','我有專心玩完','我幫忙了','我自己冷靜下來'];
function renderRoutine(){
  const st=S.rStage||0;
  $('#rStages').innerHTML=RSTAGES.map(([n,t],i)=>`<span class="${i+1===st?'on':i+1<st?'done':''}">${n} ${t/60} 分</span>`).join('');
  const B=$('#rBody');$('#rTimer').textContent='';
  const next=lbl=>`<div class="row"><button class="btn" id="rNext">${lbl||'下一步 →'}</button></div>`;
  const timer=()=>{if(!S.rEnd)S.rEnd=Date.now()+RSTAGES[st-1][1]*1000;
    const tk=()=>{const left=Math.max(0,Math.round((S.rEnd-Date.now())/1000));$('#rTimer').textContent=left?`⏱ ${fmt(left)}`:'⏰ 時間到，可以進下一步了';if(left===0&&!S.rRang){S.rRang=true;chime()}if(left>0)later(tk,1000)};tk()};
  const bindNext=()=>{$('#rNext').onclick=()=>{S.rStage=st+1;S.rEnd=0;S.rRang=false;stopAct();renderRoutine();window.scrollTo({top:0})}};
  if(st===0){B.innerHTML=`<div class="intro"><p>每天固定一個時間，例如晚餐後，跟大人一起玩 10 分鐘：</p>
    <p>1️⃣ <b>熱身 2 分鐘</b>：音樂定格或紅綠燈，先動一動<br>2️⃣ <b>專注 4 分鐘</b>：記憶翻牌、烏龜兔子、顏色泡泡<br>3️⃣ <b>情緒 3 分鐘</b>：抽怪獸卡、說一件今天的事、吹泡泡呼吸<br>4️⃣ <b>收尾 1 分鐘</b>：說一件「今天我做到的事」</p>
    <p class="hint" style="text-align:left">${ageTime()}時間只是參考，孩子玩得開心比準時重要。</p></div>`+next('開始！');bindNext();return}
  if(st===1){timer();B.innerHTML=`<p class="hint">一起動一動！選一個玩：</p><div class="gdetail"><b>🎵 音樂定格</b>：音樂播放就跳舞，一停就變雕像<div id="rFz"></div></div>
    <div class="gdetail"><b>🚦 紅綠燈</b>：大人喊「綠燈」走，「紅燈」定住，「黃燈」慢慢走</div>`+next();freezeMusic($('#rFz'));bindNext();return}
  if(st===2){timer();B.innerHTML=`<p class="hint">選一個專注遊戲，玩完按「上一步」回來這裡</p><div class="grid g2">
    <button class="pick" id="rMem"><b>🃏 記憶翻牌</b></button><button class="pick" id="rTR"><b>🐰 烏龜兔子石頭</b></button>
    <button class="pick" id="rCB"><b>🫧 顏色泡泡</b></button><button class="pick" id="rLR"><b>✋ 左右手指令</b><span>大人帶著玩</span></button></div>
    <div class="gdetail" id="rLRd" style="display:none">兩手各拿一樣東西，聽大人說：「襪子舉起來、牙刷放下來」。</div>`+next();
    $('#rMem').onclick=()=>go(19);$('#rTR').onclick=()=>go(20);$('#rCB').onclick=()=>go(21);$('#rLR').onclick=()=>$('#rLRd').style.display='';bindNext();return}
  if(st===3){timer();B.innerHTML=`<p class="hint">① 抽一張怪獸卡，說一件今天的事</p><div id="rFace"></div>
    <p class="hint" style="margin-top:14px">② 吹泡泡呼吸 3 次：吸 3 秒，慢慢吐 5 秒</p>
    <div class="breath-box" style="height:200px"><div class="ball" id="rBall" style="--mc:#8FC9C0">🫧</div></div><div class="breath-word" id="rBw"></div>
    <div class="row"><button class="btn small" id="rBreath">開始呼吸</button></div>`+next();
    faceCard($('#rFace'));
    $('#rBreath').onclick=()=>{$('#rBreath').style.display='none';let i=0;const ball=$('#rBall');
      const go1=()=>{if(i>=3){$('#rBw').textContent='好棒，身體變平靜了';chime();ball.style.transform='scale(1)';return}
        ball.style.transitionDuration='3000ms';ball.style.transform='scale(1.8)';$('#rBw').textContent=`第 ${i+1} 次：吸～`;
        later(()=>{ball.style.transitionDuration='5000ms';ball.style.transform='scale(1)';$('#rBw').textContent=`第 ${i+1} 次：慢慢吹泡泡～`;i++;later(go1,5300)},3000)};go1()};
    bindNext();return}
  if(st===4){timer();B.innerHTML=`<p class="q" style="font-size:1.2rem">今天我做到的一件事</p><div class="chips" id="rWins"></div>
    <input id="rWinIn" class="namein" style="margin-top:10px;width:260px" maxlength="20" placeholder="或自己寫">
    <p class="hint" style="margin-top:10px">大人可以具體說出看到的：「你剛剛聽到紅燈就停住了！」</p>`+next('完成今天的遊戲時間！');
    $('#rWins').innerHTML=WINS.map(w=>`<button class="chip ${S.rWin===w?'sel':''}">${w}</button>`).join('');
    $$('#rWins .chip').forEach(b=>b.onclick=()=>{S.rWin=b.textContent;$('#rWinIn').value='';$$('#rWins .chip').forEach(x=>x.classList.toggle('sel',x===b))});
    $('#rNext').onclick=()=>{const w=$('#rWinIn').value.trim()||S.rWin;if(!w){toast('先選一件今天做到的事');return}
      store.wins.unshift({t:Date.now(),text:w});store.wins=store.wins.slice(0,200);
      if(!store.playLog.includes(today()))store.playLog.push(today());
      if(store.gameDay.routine!==today()){store.gameDay.routine=today();gain('完成 10 分鐘遊戲時間',10)}else save();
      S.rStage=5;S.rWin=null;S.rEnd=0;renderRoutine()};return}
  B.innerHTML=`<div class="stage">${store.hero?hero(store.hero.type,110):''}</div><p class="q">今天的遊戲時間完成了！</p><p class="hint">明天同一個時間再一起玩吧</p>
    <div class="row"><button class="btn" id="rHome">🏠 回家園</button></div>`;$('#rHome').onclick=()=>go(10);chime();
}

/* ---------- memory game ---------- */
function renderMemory(fresh){
  if(fresh||!S.mem){const n=S.age==='young'?3:S.age==='old'?6:4;const ks=visibleEmo().sort(()=>Math.random()-.5).slice(0,n);
    const cards=[...ks,...ks].sort(()=>Math.random()-.5);
    S.mem={cards,up:[],ok:new Set(),turn:'kid',score:{kid:0,hero:0},lock:false,moves:0,seen:{},mode:(S.mem&&S.mem.mode)||'vs',over:false}}
  const M=S.mem;const cols=M.cards.length<=6?3:4;
  $('#memMode').innerHTML=[['vs','和主角比賽'],['coop','一起合作']].map(([k,t])=>`<button class="chip ${M.mode===k?'sel':''}" data-mm="${k}">${t}</button>`).join('');
  $$('[data-mm]').forEach(b=>b.onclick=()=>{S.mem.mode=b.dataset.mm;stopAct();renderMemory(true)});
  const hn=store.hero?store.hero.name:'主角';
  $('#memScore').innerHTML=M.mode==='vs'?`<span class="who ${M.turn==='kid'&&!M.over?'turn':''}">🙋 你 ${M.score.kid}</span><span class="who ${M.turn==='hero'&&!M.over?'turn':''}">${store.hero?hero(store.hero.type,22,{}):''} ${hn} ${M.score.hero}</span>`
    :`<span class="who turn">🤝 一起翻了 ${M.moves} 次</span>`;
  const G=$('#memGrid');G.style.gridTemplateColumns=`repeat(${cols},1fr)`;
  G.innerHTML=M.cards.map((k,i)=>{const up=M.up.includes(i)||M.ok.has(i);return `<button class="mcard ${up?'up':''} ${M.ok.has(i)?'ok':''}" data-mc="${i}">${up?monster(k,60,'',{mood:2,level:1,eq:{}}):'★'}</button>`}).join('');
  $$('[data-mc]').forEach(b=>b.onclick=()=>{if(M.turn!=='kid'||M.lock||M.over)return;flipCard(+b.dataset.mc)});
  if(!fresh&&M.turn==='hero'&&!M.lock&&!M.over)later(heroTurn,700);
  if(fresh)$('#memMsg').style.display='none';
}
function flipCard(i){const M=S.mem;if(M.up.includes(i)||M.ok.has(i)||M.up.length>=2)return;
  M.up.push(i);M.seen[i]=M.cards[i];tone(520+M.up.length*80,.08);renderMemory();
  if(M.up.length<2)return;
  M.lock=true;M.moves++;const [a,b]=M.up;
  if(M.cards[a]===M.cards[b]){later(()=>{M.ok.add(a);M.ok.add(b);M.up=[];M.lock=false;if(M.mode==='vs')M.score[M.turn]++;chime();
      if(M.ok.size===M.cards.length){endMemory();return}renderMemory();if(M.turn==='hero')later(heroTurn,800)},600)}
  else later(()=>{M.up=[];M.lock=false;if(M.mode==='vs')M.turn=M.turn==='kid'?'hero':'kid';renderMemory();if(M.turn==='hero')later(heroTurn,800)},1000)}
function heroTurn(){const M=S.mem;if(M.over||M.turn!=='hero')return;
  const memP=S.age==='young'?.3:S.age==='old'?.7:.5;
  const hidden=M.cards.map((_,i)=>i).filter(i=>!M.ok.has(i));
  const known=hidden.filter(i=>M.seen[i]!==undefined);
  let pair=null;if(Math.random()<memP){for(const i of known){const j=known.find(j=>j!==i&&M.seen[j]===M.seen[i]);if(j!==undefined){pair=[i,j];break}}}
  const pick1=pair?pair[0]:hidden[Math.floor(Math.random()*hidden.length)];
  flipCard(pick1);
  later(()=>{let j;if(pair)j=pair[1];else{const m=known.find(x=>x!==pick1&&M.seen[x]===M.cards[pick1]);j=(m!==undefined&&Math.random()<memP)?m:hidden.filter(x=>x!==pick1)[Math.floor(Math.random()*(hidden.length-1))]}flipCard(j)},800)}
function endMemory(){const M=S.mem;M.over=true;renderMemory();const hn=store.hero?store.hero.name:'主角';const m=$('#memMsg');m.style.display='';
  let t;if(M.mode==='coop')t=`🤝 你們一起用了 ${M.moves} 次就全部找到了！合作好棒！`;
  else if(M.score.kid>M.score.hero)t=`🎉 你贏了！<br>${hn}：「我輸了，有點可惜……但是跟你玩好開心！我們再來一次？」`;
  else if(M.score.kid<M.score.hero)t=`${hn}這次贏了。<br>${hn}：「你很想贏，輸了有點不服氣對不對？我們先吹一口氣～呼～。有時候贏、有時候輸，輸了可以說『再玩一次』！」`;
  else t=`平手！你們都好厲害！`;
  m.innerHTML=t+`<div class="row" style="margin-top:10px"><button class="btn small" id="memAgain">再玩一次</button>${M.mode==='vs'&&M.score.kid<M.score.hero?'<button class="btn small ghost" id="memCalm">去冷靜站</button>':''}</div>`;
  $('#memAgain').onclick=()=>renderMemory(true);const c=$('#memCalm');if(c)c.onclick=startFlow;
  gameReward('memory','記憶翻牌');}
$('#memNew').onclick=()=>{stopAct();renderMemory(true)};

/* ---------- turtle rabbit stone ---------- */
const TRC={rabbit:['🐰 兔子！快快點','#FFE1EC'],turtle:['🐢 烏龜…慢慢點','#E3F6E8'],stone:['🪨 石頭！停住！','#E9E4F2']};
function renderTR(){S.tr={p:0,running:false,cmd:null,last:0,stoneOk:0,stoneTap:0,tapped:false};
  $('#trCmd').textContent='準備好了嗎？';$('#trCmd').style.background='#FFF3DF';$('#trBar').style.width='0';
  $('#trRun').style.left='0';$('#trRun').innerHTML=store.hero?hero(store.hero.type,40):'🏃';$('#trTap').textContent='開始';$('#trInfo').textContent='聽到指令就照做，石頭的時候要忍住不點喔！'}
function trNext(){const T=S.tr;if(!T.running)return;
  if(T.cmd==='stone'&&!T.tapped){T.stoneOk++;toast('定住了！好厲害 🪨')}
  const young=S.age==='young';const opts=T.cmd==='stone'?['rabbit','turtle']:['rabbit','turtle','stone','stone'];
  T.cmd=opts[Math.floor(Math.random()*opts.length)];T.tapped=false;
  const [txt,bg]=TRC[T.cmd];$('#trCmd').textContent=txt;$('#trCmd').style.background=bg;speak(txt.replace(/[^一-鿿！…]/g,''));
  tone(T.cmd==='stone'?220:T.cmd==='turtle'?330:660,.2);
  later(trNext,(young?4000:3000)+Math.random()*(young?2500:2000))}
$('#trTap').addEventListener('pointerdown',e=>{e.preventDefault();ac();const T=S.tr;if(!T)return;
  if(!T.running){if(T.p>=100){renderTR();return}T.running=true;$('#trTap').textContent='點我！';trNext();return}
  const now=performance.now(),info=$('#trInfo');
  if(T.cmd==='stone'){T.tapped=true;T.stoneTap++;info.textContent='噢！石頭不能動喔，忍住～';$('#trCmd').classList.remove('shake');void $('#trCmd').offsetWidth;$('#trCmd').classList.add('shake');return}
  if(T.cmd==='turtle'&&now-T.last<800){info.textContent='慢一點～像烏龜一樣';T.last=now;return}
  T.last=now;T.p=Math.min(100,T.p+(T.cmd==='rabbit'?(S.age==='young'?5:3):4));info.textContent=T.cmd==='rabbit'?'衝啊！':'慢慢的，很好';
  $('#trBar').style.width=T.p+'%';$('#trRun').style.left=`calc(${T.p}% - ${T.p*0.4}px)`;tone(700,.05,'triangle',.06);
  if(T.p>=100){T.running=false;stopAct();$('#trCmd').textContent='🏁 到終點了！';$('#trCmd').style.background='#FFF3C4';
    info.textContent=`石頭時定住成功 ${T.stoneOk} 次！${T.stoneTap?'下次試試看石頭時一次都不動。':'完全沒有偷動，煞車好厲害！'}`;$('#trTap').textContent='再玩一次';chime();gameReward('tr','烏龜兔子石頭')}});

/* ---------- color bubbles ---------- */
function renderCB(){const young=S.age==='young';const ks=young?['angry','sad','defiant']:['angry','sad','defiant','stuck','scared'];
  S.cb={ks,goal:young?10:S.age==='old'?20:15,n:0,target:ks[0],run:false};
  $('#cbHint').textContent=`只戳指定顏色的泡泡，其他顏色要放過！戳到 ${S.cb.goal} 顆就成功`;
  $('#cbCmd').innerHTML='';$('#cbPond').innerHTML='';$('#cbCount').textContent='';$('#cbStart').style.display='';}
function cbSetTarget(){const C=S.cb;C.target=C.ks[Math.floor(Math.random()*C.ks.length)];const e=EMO[C.target];
  $('#cbCmd').innerHTML=`只戳 <span style="background:${e.color};color:#fff;padding:2px 14px;border-radius:999px">${e.cname}</span> 的泡泡！`;speak('只戳'+e.cname+'的泡泡');tone(600,.15)}
$('#cbStart').onclick=()=>{ac();const C=S.cb;C.run=true;$('#cbStart').style.display='none';cbSetTarget();
  const pond=$('#cbPond');const young=S.age==='young';
  const spawn=()=>{if(!C.run||!document.getElementById('cbPond'))return;const b=document.createElement('div');b.className='bub';
    const k=Math.random()<.45?C.target:C.ks[Math.floor(Math.random()*C.ks.length)];
    const sz=young?66+Math.random()*26:48+Math.random()*30;b.style.width=b.style.height=sz+'px';b.style.left=Math.random()*(pond.clientWidth-sz)+'px';b.style.top='340px';
    b.style.setProperty('--bc',EMO[k].color);b.style.animationDuration=(young?7:5.5)+Math.random()*2.5+'s';
    b.addEventListener('pointerdown',ev=>{ev.preventDefault();if(k===C.target){C.n++;tone(800+Math.random()*300,.08,'triangle',.12);b.remove();
        $('#cbCount').textContent=`${C.n} / ${C.goal}`;
        if(C.n>=C.goal){C.run=false;stopAct();pond.innerHTML='';$('#cbCmd').textContent='🎉 全部完成！眼睛好專心！';chime();$('#cbStart').style.display='';$('#cbStart').textContent='再玩一次';gameReward('color','顏色泡泡');S.cb.n=0;return}
        if(C.n%5===0)cbSetTarget();}
      else{b.classList.add('shake');tone(200,.12,'sine',.08);$('#cbCount').textContent=`不是這個顏色喔～（${C.n} / ${C.goal}）`}});
    b.addEventListener('animationend',e=>{if(e.animationName==='rise')b.remove()});pond.appendChild(b);later(spawn,young?850:600)};
  spawn()};

/* ---------- 安靜觀察＋生物圖鑑（v14）：安靜越久，越少見的小動物越會出來；點一下拍照 ---------- */
const WSCENES={
  forest:{name:'森林',ico:'🌲',bg:'linear-gradient(#DDF1FF 0%,#EAF6FF 42%,#CFE8C4 42%,#B9DDAA 100%)',
    deco:[['☁️',22,12,34],['🌳',10,46,70],['🌲',86,42,76],['🌲',72,50,52],['🌳',36,40,46],['🍄',24,86,26],['🌿',60,88,30],['🪨',48,80,26]]},
  pond:{name:'池塘',ico:'🪷',bg:'radial-gradient(ellipse 62% 24% at 50% 70%,#A8D8EC 0 97%,transparent 100%),linear-gradient(#E3F3FF 0%,#E3F3FF 36%,#CFE8C4 36%,#B9DDAA 100%)',
    deco:[['☁️',70,12,30],['🌾',10,58,46],['🌾',90,60,46],['🪷',38,72,30],['🪷',64,64,24],['🌼',20,90,22],['🌸',82,88,22]]},
  sea:{name:'海邊',ico:'🌊',bg:'linear-gradient(#E3F3FF 0%,#E3F3FF 26%,#9ED3EA 26%,#7DC0DE 64%,#F3E2BC 64%,#EED7A6 100%)',
    deco:[['☁️',24,10,32],['☁️',62,14,24],['🌴',90,58,66],['🪨',10,80,30],['🌊',40,60,22]]}
};
/* id:[場景, 圖示, 名字, 稀有度 1–3, 出現高度範圍 %, 小知識] */
const CRIT={
  butterfly:['forest','🦋','蝴蝶',1,[18,40],'蝴蝶在安靜的花叢裡，慢慢地喝花蜜。'],
  squirrel:['forest','🐿️','松鼠',1,[58,78],'松鼠很怕吵，安靜的時候才敢出來找松果。'],
  hedgehog:['forest','🦔','刺蝟',2,[70,86],'刺蝟害怕時會縮成一顆球，放心了才慢慢打開。'],
  deer:['forest','🦌','小鹿',2,[52,72],'小鹿耳朵很靈，一點點聲音就會豎起來聽。'],
  owl:['forest','🦉','貓頭鷹',3,[16,36],'貓頭鷹可以安安靜靜地停在樹上好久好久。'],
  frog:['pond','🐸','青蛙',1,[58,80],'青蛙安靜地坐在荷葉上，等小蟲飛過來。'],
  snail:['pond','🐌','蝸牛',1,[78,90],'蝸牛慢慢爬，一點也不急。'],
  duck:['pond','🦆','小鴨',2,[60,74],'小鴨在水面輕輕地划，水波一圈一圈散開。'],
  turtle:['pond','🐢','烏龜',2,[64,80],'烏龜覺得安全的時候，才會把頭伸出來曬太陽。'],
  otter:['pond','🦦','水獺',3,[60,78],'水獺很害羞，要非常安靜才看得到牠。'],
  crab:['sea','🦀','螃蟹',1,[74,90],'螃蟹聽到腳步聲，就會躲進沙子裡。'],
  hermit:['sea','🐚','寄居蟹',1,[76,90],'寄居蟹背著殼，安靜的時候才會探出頭來。'],
  octopus:['sea','🐙','章魚',2,[44,58],'章魚放鬆的時候，身體軟軟的、慢慢地漂。'],
  dolphin:['sea','🐬','海豚',2,[34,50],'海豚會用聲音跟朋友說話，也會安靜地游。'],
  whale:['sea','🐋','鯨魚',3,[34,50],'鯨魚會慢慢浮上來，長長地吐一口氣。']
};
const WDAY_MAX=3;
const TIER_HINT=['','安靜一下就會出現','要再安靜久一點','要非常非常安靜才會出現'];
store.critters=store.critters||{};
function critFound(){return Object.keys(CRIT).filter(k=>store.critters[k]).length}
function watchLeft(){const w=store.watchDay;return WDAY_MAX-((w&&w.d===today())?w.n:0)}
function wTiers(){return S.age==='young'?[4,10,20]:S.age==='old'?[6,18,36]:[5,14,28]}
function wLen(){return S.age==='young'?120:180}
let wInt=null;
function stopWatch(){clearInterval(wInt);wInt=null;const m=S.w&&S.w.mic;if(m){try{m.stream.getTracks().forEach(t=>t.stop())}catch(e){}try{m.src.disconnect()}catch(e){}S.w.mic=null}}
function renderWatch(){
  stopWatch();const B=$('#wBody');const mode=S.wMode||'menu';const total=Object.keys(CRIT).length;
  if(mode==='album'){$('#wTitle').textContent='🐾 生物圖鑑';
    B.innerHTML=`<p class="hint">已經拍到 <b>${critFound()} / ${total}</b> 種小動物。在「安靜觀察」裡安安靜靜地等，就有機會遇到牠們</p>`+
      Object.entries(WSCENES).map(([sk,sc])=>`<p class="q secttl">${sc.ico} ${sc.name}</p><div class="grid g3 alb">`+
        Object.entries(CRIT).filter(([,c])=>c[0]===sk).map(([k,c])=>{const f=store.critters[k];
          return f?`<div class="pick"><span class="big">${c[1]}</span><b>${c[2]}</b><span class="lvtag">拍到 ${f.n} 次</span><span class="fact">${c[5]}</span></div>`
            :`<div class="pick unk"><span class="big">${c[1]}</span><b>？？？</b><span class="fact">${'⭐'.repeat(c[3])}<br>${TIER_HINT[c[3]]}</span></div>`}).join('')+`</div>`).join('')+
      `<div class="row"><button class="btn" id="wGo">🔭 去安靜觀察</button></div>`;
    $('#wGo').onclick=()=>{S.wMode='menu';go(23)};return}
  if(mode==='menu'){$('#wTitle').textContent='🔭 安靜觀察';const left=watchLeft();
    B.innerHTML=`<p class="hint">選一個地方，安安靜靜地等。<br>越安靜、等越久，越少見的小動物就會出來。看到了，輕輕點一下就能拍照！</p>
      <div class="grid g3">${Object.entries(WSCENES).map(([k,sc])=>{const all=Object.keys(CRIT).filter(c=>CRIT[c][0]===k);
        return `<button class="pick" data-ws="${k}" ${left>0?'':'disabled'}><b style="font-size:1.8rem">${sc.ico}</b><b>${sc.name}</b><span>${all.filter(c=>store.critters[c]).length} / ${all.length}</span></button>`}).join('')}</div>
      <p class="hint" style="margin-top:12px">${left>0?`今天還可以觀察 <b>${left}</b> 次，每次約 ${wLen()/60} 分鐘`:'今天觀察 3 次了，小動物們明天再出來 🌿'}</p>
      <p class="hint">${store.mic?'👂 會用麥克風聽周圍安不安靜（只聽大小聲，不錄音）':'✋ 手放好、不碰螢幕，就是安靜（大人可以在大人區開麥克風模式）'}</p>
      <div class="row"><button class="btn ghost" id="wAlb">🐾 生物圖鑑 ${critFound()} / ${total}</button></div>`;
    $$('[data-ws]').forEach(b=>b.onclick=()=>{if(watchLeft()<=0)return;S.wScene=b.dataset.ws;S.wMode='watch';ac();go(23)});
    $('#wAlb').onclick=()=>{S.wMode='album';go(23)};return}
  if(mode==='done'){const w=S.w||{shots:[]};$('#wTitle').textContent='🔭 觀察結束';
    const uniq=[...new Set(w.shots)];
    B.innerHTML=`<div class="stage" style="min-height:90px;font-size:3rem">${uniq.length?uniq.map(k=>CRIT[k][1]).join(' '):'🌿'}</div>
      <p class="q" style="font-size:1.2rem">${uniq.length?`你拍到了 ${w.shots.length} 張照片！`:'這次小動物有點害羞'}</p>
      <p class="hint">${w.news&&w.news.length?`新發現：<b>${w.news.map(k=>CRIT[k][2]).join('、')}</b>！<br>`:''}${uniq.length?'你安靜等待的樣子，就像在練習冷靜。':'沒關係，下次再安靜久一點，牠們就會出來。'}</p>
      <div class="row"><button class="btn ghost" id="wAlb">🐾 看圖鑑</button><button class="btn" id="wBack">回遊戲時間</button></div>`;
    if(uniq.length&&!w.paid){w.paid=true;gameReward('watch','安靜觀察')}
    $('#wAlb').onclick=()=>{S.wMode='album';go(23)};$('#wBack').onclick=()=>go(17);return}
  /* watch */
  const sk=S.wScene||'forest',sc=WSCENES[sk],T=wTiers();
  const w=S.w={scene:sk,quiet:0,t0:Date.now(),vis:{},shots:[],news:[],lastSpawn:0,noisy:0,msgAt:0,mic:null};
  store.watchDay={d:today(),n:(store.watchDay&&store.watchDay.d===today()?store.watchDay.n:0)+1};save();
  $('#wTitle').textContent=`${sc.ico} ${sc.name}`;
  B.innerHTML=`<div class="wtop"><span id="wTime"></span><span id="wEar"></span></div>
    <div class="wmeter"><i id="wMeter"></i>${T.slice(0,2).map(t=>`<b style="left:${t/T[2]*100}%"></b>`).join('')}<span>安靜能量</span></div>
    <div class="wscene" id="wScene" style="background:${sc.bg}">${sc.deco.map(([e,x,y,f])=>`<span class="deco" style="left:${x}%;top:${y}%;font-size:${f}px">${e}</span>`).join('')}
      <div class="wbreath" id="wBreath"><i></i><b>吸氣</b></div><div class="vf"><i></i><i></i><i></i><i></i></div><div class="flash" id="wFlash"></div></div>
    <p class="hint" id="wMsg" style="min-height:2.6em">${store.mic?'安安靜靜地等，小動物聽到很安靜，就會出來':'手放在腿上，安安靜靜地等，小動物就會出來'}</p>
    <div class="row"><button class="btn ghost small" id="wStop">結束觀察</button></div>`;
  speak(`我們來${sc.name}安靜觀察。跟著圓圈慢慢呼吸，安安靜靜地等，小動物就會出來。`);
  const msg=(t,force)=>{if(!force&&Date.now()-w.msgAt<3500)return;w.msgAt=Date.now();$('#wMsg').innerHTML=t};
  const scene=$('#wScene');
  scene.addEventListener('pointerdown',e=>{if(e.target.closest('.crit'))return;w.quiet=Math.max(0,w.quiet-3);msg('噓……手放好，輕輕的，牠們就快出來了')});
  const finish=()=>{stopWatch();S.wMode='done';renderWatch()};
  $('#wStop').onclick=finish;
  const leave=(k,fast)=>{const v=w.vis[k];if(!v)return;delete w.vis[k];v.el.classList.remove('on');setTimeout(()=>v.el.remove(),fast?600:1500)};
  const snap=k=>{const v=w.vis[k];if(!v||v.shot)return;v.shot=true;const c=CRIT[k];
    const f=$('#wFlash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');tone(1400,.05,'square',.05);setTimeout(()=>tone(900,.08,'square',.04),70);
    const isNew=!store.critters[k];store.critters[k]={n:(store.critters[k]?store.critters[k].n:0)+1,first:(store.critters[k]&&store.critters[k].first)||today()};save();
    w.shots.push(k);if(isNew)w.news.push(k);
    v.el.classList.add('snap');delete w.vis[k];setTimeout(()=>v.el.remove(),1300);
    if(isNew){toast(`📷 新發現：${c[1]} ${c[2]}！`,true);speak(`新發現，${c[2]}！${c[5]}`)}else toast(`📷 ${c[1]} ${c[2]}（第 ${store.critters[k].n} 張）`);
    msg(`${c[1]} ${c[5]}`,true)};
  const spawn=()=>{const tier=T.filter(t=>w.quiet>=t).length;if(!tier)return;
    const pool=Object.keys(CRIT).filter(k=>CRIT[k][0]===sk&&CRIT[k][3]<=tier&&!w.vis[k]);if(!pool.length)return;
    const wt=k=>(store.critters[k]?1:3)*(CRIT[k][3]===tier?2:1);let r=Math.random()*pool.reduce((a,k)=>a+wt(k),0),k=pool[0];
    for(const p of pool){r-=wt(p);if(r<=0){k=p;break}}
    const c=CRIT[k],[y0,y1]=c[4];const el=document.createElement('button');el.className='crit'+(RM?'':' peek');el.textContent=c[1];el.setAttribute('aria-label','拍下'+c[2]);
    el.style.left=(12+Math.random()*64)+'%';el.style.top=(y0+Math.random()*(y1-y0))+'%';
    el.onclick=e=>{e.stopPropagation();snap(k)};scene.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('on')));
    w.vis[k]={el,until:Date.now()+(c[3]===3?6500:8500)};tone(c[3]===3?880:700,.25,'sine',.04);
    if(c[3]===3)msg('✨ 好少見的小動物出來了！輕輕點一下拍照',true);else msg('有小動物出來了，輕輕點一下拍照')};
  /* microphone (optional, volume only) */
  if(store.mic&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(stream=>{
      if(S.w!==w||!wInt){stream.getTracks().forEach(t=>t.stop());return}
      const a=ac();const src=a.createMediaStreamSource(stream),an=a.createAnalyser();an.fftSize=1024;src.connect(an);
      w.mic={stream,src,an,buf:new Float32Array(an.fftSize),cal:[],thr:0}}).catch(()=>{msg('麥克風沒有打開，改用「手放好、不碰螢幕」來代表安靜',true)})}
  wInt=setInterval(()=>{
    const el=Date.now()-w.t0,left=Math.max(0,wLen()-Math.floor(el/1000));
    $('#wTime').textContent=`⏱ ${fmt(left)}`;
    const ph=Math.floor(el/4000)%2;const br=$('#wBreath');br.classList.toggle('in',ph===0&&!RM);br.querySelector('b').textContent=ph===0?'吸氣':'吐氣';
    let noisy=false;const m=w.mic;
    if(m){m.an.getFloatTimeDomainData(m.buf);let q=0;for(let i=0;i<m.buf.length;i++)q+=m.buf[i]*m.buf[i];const rms=Math.sqrt(q/m.buf.length);
      if(m.cal.length<6){m.cal.push(rms);if(m.cal.length===6){const base=Math.min(.03,m.cal.reduce((a,b)=>a+b,0)/6);m.thr=Math.max(.025,base*3)}}
      else{noisy=rms>m.thr;$('#wEar').innerHTML=`👂<span class="ear"><i style="width:${Math.min(100,rms/m.thr*60)}%;background:${noisy?'#E4574B':'#7CC3B0'}"></i></span>`}}
    if(noisy){w.noisy++;w.quiet=Math.max(0,w.quiet-.75);
      if(w.noisy>=3){const ks=Object.keys(w.vis);if(ks.length){leave(ks[0],true);msg('噓……聲音太大，小動物躲起來了。深呼吸，再等等',true)}else msg('有一點大聲喔，跟著圓圈慢慢呼吸');w.noisy=0}}
    else{w.noisy=0;w.quiet+=.25}
    $('#wMeter').style.width=Math.min(100,w.quiet/T[2]*100)+'%';
    Object.entries(w.vis).forEach(([k,v])=>{if(Date.now()>v.until)leave(k)});
    if(Object.keys(w.vis).length<2&&Date.now()-w.lastSpawn>3000&&w.quiet>=T[0]&&Math.random()<.35){w.lastSpawn=Date.now();spawn()}
    if(left<=0)finish();
  },250);
}
function renderMic(){const el=$('#micChips');if(!el)return;
  el.innerHTML=[[false,'不用麥克風（手放好代表安靜）'],[true,'用麥克風聽安靜']].map(([v,t])=>`<button class="chip ${!!store.mic===v?'sel':''}" data-mic="${v}">${t}</button>`).join('');
  $$('[data-mic]').forEach(b=>b.onclick=()=>{store.mic=b.dataset.mic==='true';save();renderMic()});}

