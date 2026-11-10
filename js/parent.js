/* 使用時間提醒、測試模式、SOS、大人區、計時器 */
/* ---------- 使用時間提醒（避免黏著） ---------- */
function renderNight(){const el=$('#nightChips');if(!el)return;
  el.innerHTML=[[19,'晚上 7 點'],[20,'晚上 8 點'],[21,'晚上 9 點'],[22,'晚上 10 點'],[0,'關閉']].map(([h,t])=>`<button class="chip ${store.nightAt===h?'sel':''}" data-night="${h}">${t}</button>`).join('');
  $$('[data-night]').forEach(b=>b.onclick=()=>{store.nightAt=+b.dataset.night;save();renderNight()});}
function renderLimit(){renderNight();renderMic();const el=$('#limitChips');if(!el)return;
  el.innerHTML=[[10,'10 分鐘'],[20,'20 分鐘'],[30,'30 分鐘'],[0,'關閉']].map(([m,t])=>`<button class="chip ${store.limit===m?'sel':''}" data-lim="${m}">${t}</button>`).join('');
  $$('[data-lim]').forEach(b=>b.onclick=()=>{store.limit=+b.dataset.lim;store.remindAt=0;save();renderLimit()});
  $('#useToday').textContent=`今天已使用約 ${Math.round((store.useDay===today()?store.useSec||0:0)/60)} 分鐘`;}
setInterval(()=>{if(document.visibilityState!=='visible')return;
  if(store.useDay!==today()){store.useDay=today();store.useSec=0;store.remindAt=0}
  store.useSec=(store.useSec||0)+15;
  const lim=(store.limit||0)*60;
  if(lim&&store.useSec>=Math.max(lim,store.remindAt||0)&&!(S.step>=1&&S.step<=8)&&!$('#restOv')){
    store.remindAt=store.useSec+600;showRest()}
  try{localStorage.setItem('calmMonster',JSON.stringify(store))}catch(e){}
},15000);
function showRest(){const m=Math.round(store.useSec/60);const d=document.createElement('div');d.className='restov';d.id='restOv';
  d.innerHTML=`<div class="card"><div style="font-size:2.4rem">😴</div><p class="q" style="font-size:1.2rem">今天已經玩了 ${m} 分鐘囉</p>
    <p>怪獸們要去午睡了。換你去做點真實世界的事吧：<br>喝口水、伸伸懶腰、找家人聊天，或到外面走走。</p>
    <div class="row"><button class="btn" id="restOk">好，我去休息</button><button class="btn ghost" id="restSos">🆘 我需要冷靜</button></div><div class="row" id="restMore"></div></div>`;
  document.body.appendChild(d);speak('今天已經玩了'+m+'分鐘囉。怪獸們要去午睡了，我們也去休息一下吧。');
  $('#restOk').onclick=()=>{d.remove();go(10)};
  $('#restSos').onclick=()=>{d.remove();$('#sos').click()};
  $('#restMore').appendChild(holdBtn('大人按住：再玩 10 分鐘',2000,()=>d.remove()));}

/* ---------- 測試模式（大人用，先備份再還原） ---------- */
const BK='calmMonster_backup';
function inTest(){try{return !!localStorage.getItem(BK)}catch(e){return false}}
function renderTest(){const box=$('#testBox');if(!box)return;box.innerHTML='';
  if(!inTest()){box.appendChild(holdBtn('按住進入測試模式（會先備份）',1500,()=>{
      try{localStorage.setItem(BK,JSON.stringify(store))}catch(e){toast('這個瀏覽器不能備份，先不要測試');return}
      store.stars=9999;save();toast('🧪 測試模式：給你 9999 顆星星',true);renderTest();refreshTest()}));return}
  box.innerHTML=`<p style="font-size:.9rem"><b>測試中</b>：星星 ${store.stars}</p>
    <div class="chips" style="justify-content:flex-start">${[1,2,3,4,5,6].map(l=>`<button class="chip" data-tl="${l}">全部怪獸 Lv.${l}</button>`).join('')}</div>
    <div class="chips" style="justify-content:flex-start">
      <button class="chip" id="tStars">再加 1000 ⭐</button><button class="chip" id="tHero">主角 +300 經驗</button>
      <button class="chip" id="tGrow">菜和花馬上長好</button><button class="chip" id="tDay">重置今天的工作（可再做一次）</button><button class="chip" id="tNight">預覽白天／晚上</button></div>
    <div class="row" style="justify-content:flex-start"><button class="btn small" id="tEnd">結束測試，還原紀錄</button></div>`;
  $$('[data-tl]').forEach(b=>b.onclick=()=>{const t=LEVELS[+b.dataset.tl-1];Object.keys(EMO).forEach(k=>store.xp[k]=Math.max(t,1));save();toast(`全部怪獸變成 Lv.${b.dataset.tl}「${STAGES[stageOf(+b.dataset.tl)-1].n}」`);renderTest()});
  $('#tStars').onclick=()=>{store.stars+=1000;save();renderTest()};
  $('#tHero').onclick=()=>{store.pxp=(store.pxp||0)+300;save();toast('主角經驗 +300')};
  $('#tGrow').onclick=()=>{Object.keys(store.grow).forEach(k=>store.grow[k]=3);if(store.crop)store.crop.st=3;save();toast('都長好了，回家園看看')};
  $('#tNight').onclick=()=>{S.forceNight=!isNight();toast(S.forceNight?'預覽晚上 🌙（重新整理頁面就恢復）':'預覽白天 ☀️');closeP&&closeP();go(10)};
  $('#tDay').onclick=()=>{['waterDay','fishDay','realDay','moodDay','pracDay','watchDay'].forEach(k=>store[k]=null);store.gameDay={};store.day=null;save();toast('今天的工作可以再做一次')};
  $('#tEnd').onclick=()=>{try{const b=JSON.parse(localStorage.getItem(BK));localStorage.removeItem(BK);Object.keys(store).forEach(k=>delete store[k]);Object.assign(store,b);
      store.xp=store.xp||{};store.pos=store.pos||{};save()}catch(e){}
    toast('已還原測試前的紀錄',true);renderTest();refreshTest();go(10)};
}
function refreshTest(){let t=$('#testTag');if(inTest()){if(!t){t=document.createElement('div');t.id='testTag';t.className='testtag';t.textContent='🧪 測試模式（大人區可結束）';document.body.appendChild(t)}}else if(t)t.remove()}
refreshTest();

/* SOS quick path */
$('#sos').onclick=()=>{ac();if(!S.age)S.age='mid';if(!(S.step>=1&&S.step<=8)){resetFlow();S.hist=[10]}if(!S.emo){S.sos=true;S.emo='scared'}S.lv=S.lv||4;S.lv0=S.lv0||S.lv;S.act='breathe';speak('沒關係，我在這裡。我們先一起呼吸。');go(3)};

/* ---------- parent drawer ---------- */
let pEmo='angry';
function renderParent(){
  if(S.emo)pEmo=pEmo||S.emo;
  $('#pTabs').innerHTML=Object.entries(EMO).map(([k,e])=>`<button class="chip ${pEmo===k?'sel':''}" data-pe="${k}">${e.name.replace('怪獸','')}</button>`).join('');
  $$('[data-pe]').forEach(b=>b.onclick=()=>{pEmo=b.dataset.pe;renderParent()});
  const p=PARENT[pEmo];const ageName={young:'3–5 歲',mid:'6–8 歲',old:'9–12 歲'};
  const order=S.age?[S.age,...['young','mid','old'].filter(a=>a!==S.age)]:['young','mid','old'];
  $('#pBody').innerHTML=`<h3>先做</h3><p>${p.first}</p>
    <h3>可以這樣說</h3>${order.map(a=>`<div class="say"><b>${ageName[a]}</b>　${p.say[a]}</div>`).join('')}
    <h3>盡量避免</h3><div class="avoid">${p.avoid}</div>
    <h3>冷靜之後</h3><p>${p.after}</p>`;
}
let resetArm=false;
$('#resetAll').onclick=()=>{if(!resetArm){resetArm=true;$('#resetAll').textContent='再按一次確認重設（無法復原）';return}
  Object.assign(store,{stars:0,xp:{},pxp:0,owned:[],equip:{},grow:{},repairs:[],vouchers:[],week:{},tough:0,day:null,pday:null,badges:0});save();resetArm=false;$('#resetAll').textContent='已重設';};
function renderToughNote(){const t=store.toughAt&&Date.now()-store.toughAt<14*864e5;
  $('#toughNote').innerHTML=t?`<div class="warn">最近兩週內，孩子有連續 3 次練習時怪獸都沒有變小。不用擔心「工具沒效」，這通常代表孩子最近壓力比較大。可以找個平靜的時間，聊聊最近在學校或家裡發生的事；如果持續一段時間，可以諮詢學校輔導老師。</div>`:'';}
const CASES=[
  ['收玩具就崩潰','<b>情境</b>：玩到一半說要收玩具，孩子大哭、把積木丟一地。<br><b>做法</b>：先預告「再玩 5 分鐘，計時器響就收」；把任務切小「你收紅色，我收藍色」；做到時具體稱讚「你自己把紅色積木收好了」；還是崩潰就先陪他冷靜，事後教他可以說「再一下下」。'],
  ['排隊等不到就推人','<b>情境</b>：溜滑梯等太久，推了前面的小朋友。<br><b>做法</b>：立刻擋下並帶到旁邊：「我不能讓你推人，我們先冷靜。」冷靜後演練「可以問『換我了嗎？』」；回去前先數到 10 再排隊；做到等待時馬上稱讚。'],
  ['被糾正就大哭','<b>情境</b>：建議「這裡可以再塗滿一點」，孩子撕掉紙說「我不會畫」。<br><b>做法</b>：先接住情緒：「聽到要修改，覺得很挫折？」改成先肯定再給一個小建議；把任務切成一小格；完成後說「你沒有撕紙，還完成了，進步好多」。'],
  ['睡前太興奮、發脾氣','<b>情境</b>：睡前跑跳不肯刷牙，一被要求就哭。<br><b>做法</b>：固定睡前順序（洗澡→刷牙→兩本繪本→關燈）；做成圖卡讓孩子自己貼貼紙；睡前半小時少螢幕和激烈遊戲；給二選一「自己刷還是我幫你刷？」'],
  ['輸了就崩潰','<b>情境</b>：玩遊戲輸了就大哭、翻桌、說不玩了（3–6 歲很常見）。<br><b>做法</b>：遊戲前先說好規則「有時候贏、有時候輸，輸了可以說『再玩一次』」；大人偶爾故意輸，示範「我輸了，有點可惜，我們再來」；孩子崩潰就先暫停比賽：「你很想贏，輸了很生氣，我們先深呼吸」；平靜後回到遊戲，馬上稱讚「你剛剛很生氣，但願意再玩一次，好了不起」。工具裡的「記憶翻牌」可以跟主角比賽練習，也可以切換成合作模式。'],
  ['手足衝突就動手','<b>情境</b>：弟弟弄壞積木，哥哥立刻推弟弟。<br><b>做法</b>：先分開確保安全，不急著判誰對；幫大孩子說出感受「弟弟弄壞你的積木，你很生氣」；教替代句「我很生氣，請不要碰我的積木」；冷靜後練習修復（遞一塊積木、說對不起），重點是練習替代行為，不只是處罰。']
];
let caseI=0;
function renderCases(){$('#caseTabs').innerHTML=CASES.map((c,i)=>`<button class="chip ${i===caseI?'sel':''}" data-case="${i}">${c[0]}</button>`).join('');
  $$('[data-case]').forEach(b=>b.onclick=()=>{caseI=+b.dataset.case;renderCases()});$('#caseBody').innerHTML=CASES[caseI][1]}
$('#dOpenLog').onclick=()=>{closeP();go(14)};$('#dOpenWeek').onclick=()=>{closeP();go(15)};$('#dOpenCpn').onclick=()=>{closeP();cpnDraft=null;go(16)};
function renderPNotes(){$('#pNotes').value=store.pnotes||'';$('#commUrl').value=store.commUrl||'';renderComm()}
function renderComm(){const u=(store.commUrl||'').trim();$('#commLink').innerHTML=/^https?:\/\//.test(u)?`<a class="btn small" href="${u.replace(/"/g,'%22')}" target="_blank" rel="noopener">🔗 打開家長交流</a>`:''}
$('#pNotes').onchange=()=>{store.pnotes=$('#pNotes').value;save()};
$('#commUrl').onchange=()=>{store.commUrl=$('#commUrl').value.trim();save();renderComm()};
$('#pNotesCopy').onclick=async()=>{store.pnotes=$('#pNotes').value;save();
  let t='我們家的心得筆記\n'+(store.pnotes||'（還沒寫）')+'\n\n孩子的冷靜秘訣\n'+(Object.entries(store.tips).filter(([k,v])=>v&&v.trim()).map(([k,v])=>`${EMO[k].name}：${v}`).join('\n')||'（還沒寫）');
  try{await navigator.clipboard.writeText(t);toast('已複製')}catch(e){toast('無法自動複製，請長按文字框選取複製')}};
const openP=()=>{renderApp();renderBackup();renderLimit();renderTest();renderCases();renderPNotes();if(S.emo)pEmo=S.emo;renderParent();renderToughNote();resetArm=false;$('#resetAll').textContent='重設星星與等級';$('#drawer').classList.add('on');$('#dbg').style.display='block'};
const closeP=()=>{$('#drawer').classList.remove('on');$('#dbg').style.display='none'};
$('#openParent').onclick=openP;$('#closeParent').onclick=closeP;$('#dbg').onclick=closeP;

/* timer */
let tInt=null;
function fmt(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
$$('[data-min]').forEach(b=>b.onclick=()=>{ac();clearInterval(tInt);let s=+b.dataset.min*60;$('#tShow').textContent=fmt(s);
  tInt=setInterval(()=>{s--;$('#tShow').textContent=fmt(s);if(s<=0){clearInterval(tInt);chime();$('#tShow').textContent='時間到';}},1000)});
$('#tStop').onclick=()=>{clearInterval(tInt);$('#tShow').textContent='0:00'};

