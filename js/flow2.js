/* v53 冷靜流程：說不出來也可以、再看一次（沒變小不算失敗）、動身體的新方法、事後想一想
   參考（只借概念、自己改寫）：Siegel「動一動才不會失控」、正向教養的好奇式提問、出力工作（heavy work）。
   載入在 adult2.js 後面。新方法：push 推牆壁、dragon 火龍呼吸、snail 蝸牛慢慢走 */

/* ---------- 黏土圖示：牆壁和手、小火堆、蝸牛（跟 icons.js 同一種畫法） ---------- */
Object.assign(CICO,{
  wallpush:C=>`<ellipse cx="34" cy="59" rx="26" ry="3" fill="#B98A4E" opacity=".16"/>
    <rect x="38" y="6" width="22" height="51" rx="5" fill="${C.v('#F2C7A5',.25,-.12)}" stroke="#D9A07A" stroke-width="1.4"/>
    <path d="M38 18.5 H60 M38 31 H60 M38 43.5 H60 M49 6 V18.5 M44 18.5 V31 M54 18.5 V31 M49 31 V43.5 M44 43.5 V57 M54 43.5 V57" stroke="#D9A07A" stroke-width="1.2" opacity=".7"/>
    <ellipse cx="45" cy="11" rx="4" ry="1.6" fill="#fff" opacity=".45"/>
    <g class="hands">
      <path d="M4 22 Q18 20 27 21" stroke="${C.v('#FFD7B8',.2,-.1)}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M4 40 Q18 38 27 39" stroke="${C.v('#FFD7B8',.2,-.1)}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <rect x="26" y="13" width="11" height="16" rx="5.5" fill="${C.g('#FFD7B8',.35,-.12)}" stroke="#E9A985" stroke-width="1.3"/>
      <rect x="26" y="31" width="11" height="16" rx="5.5" fill="${C.g('#FFD7B8',.35,-.12)}" stroke="#E9A985" stroke-width="1.3"/>
      <ellipse cx="29.5" cy="17" rx="2" ry="1.2" fill="#fff" opacity=".6"/><ellipse cx="29.5" cy="35" rx="2" ry="1.2" fill="#fff" opacity=".6"/></g>`,
  campfire:C=>`<ellipse cx="32" cy="58" rx="22" ry="3" fill="#A9684B" opacity=".18"/>
    <g class="flame"><path d="M32 8 C40 18 46 26 44 38 C43 46 38 50 32 50 C26 50 21 46 20 38 C19 30 24 26 27 20 C28 26 30 28 32 28 C31 20 30 14 32 8 Z" fill="${C.g('#FFB25E',.45,-.12)}" stroke="#F08A4B" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M32 26 C36 32 38 36 37 41 C36 45 34 47 32 47 C30 47 27.5 45 27.5 41 C27.5 37 30 34 32 26 Z" fill="${C.g('#FFE08A',.4,-.1)}"/>
      <ellipse cx="26" cy="32" rx="2.4" ry="4.5" transform="rotate(20 26 32)" fill="#fff" opacity=".45"/></g>
    <rect x="12" y="47" width="40" height="8" rx="4" transform="rotate(-10 32 51)" fill="${C.v('#C98B5E',.25,-.15)}" stroke="#A0683F" stroke-width="1.3"/>
    <rect x="12" y="47" width="40" height="8" rx="4" transform="rotate(10 32 51)" fill="${C.v('#D69A6B',.25,-.15)}" stroke="#A0683F" stroke-width="1.3"/>`,
  snail:C=>`<ellipse cx="32" cy="55" rx="24" ry="3" fill="#6E9C6A" opacity=".18"/>
    <path d="M8 52 Q8 44 18 44 L46 44 Q56 44 58 34 Q60 28 55 27 Q51 27 51 33 L50 40 Q46 52 30 52 Z" fill="${C.g('#FFE1B8',.35,-.12)}" stroke="#E2B07A" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M52 27 L50 18 M56 27 L58 18" stroke="#E2B07A" stroke-width="1.6" stroke-linecap="round"/><circle cx="50" cy="17" r="2.2" fill="#E2B07A"/><circle cx="58" cy="17" r="2.2" fill="#E2B07A"/>
    <circle cx="54.5" cy="31" r="1.5" fill="#5C4A3D"/><path d="M53 35.5 q2 1.4 3.6 -.3" fill="none" stroke="#B5814B" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="30" cy="31" r="16" fill="${C.g('#C9A7E8',.4,-.18)}" stroke="#9E7FCB" stroke-width="1.5"/>
    <path d="M30 31 m0 -9 a9 9 0 1 1 -8.5 6 a6 6 0 1 1 9.5 6 a3 3 0 1 1 -3 -4" fill="none" stroke="#9E7FCB" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="23" cy="22" rx="5" ry="2.4" transform="rotate(-30 23 22)" fill="#fff" opacity=".5"/>`
});

Object.assign(ACT_NAME,{push:'推牆壁',dragon:'火龍呼吸',snail:'蝸牛慢慢走'});
/* 哪隻怪獸用哪些方法（新方法放前面；舊方法保留） */
Object.assign(EMO.angry,{acts:['dragon','push','light','bubbles','squeeze']});
Object.assign(EMO.defiant,{acts:['push','light','squeeze','dragon','bubbles']});
Object.assign(EMO.hyper,{acts:['snail','light','push','breathe']});
Object.assign(EMO.stuck,{acts:['breathe','push','squeeze','bubbles','fish']});
FAM.hot.body=['push','dragon','squeeze'];
/* 4–5 級只給身體的方法：興奮過頭要先「慢下來」 */
const BODY_EMO={hyper:['snail','push','breathe']};

/* ---------- 推牆壁：用力推 10 秒、放鬆 5 秒，做 3 次 ---------- */
function actPush(){const rounds=3,pushS=10,restS=5;
  actSpeech='推牆壁。兩手撐在牆上，用力推，好像要把牆推走。推十秒，再放鬆五秒，做三次。';
  $('#actHint').textContent='找一面牆，兩手撐好。用力推 10 秒、放鬆 5 秒，做 3 次';
  $('#actArea').innerHTML=`<div class="actpic pushpic" id="pic">${clayIcon('wallpush',190)}</div>
    <div class="breath-word" id="bw">準備好了，就按開始</div><div class="count" id="bc"></div>
    <div class="row"><button class="btn" id="bStart">開始推</button></div>`;
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';let r=0;
    const phase=(push,s)=>{if(!$('#pic'))return;$('#pic').classList.toggle('on',push);
      $('#bw').textContent=push?`用力推～ ${s}`:`放鬆～手軟軟的 ${s}`;
      if(s===(push?pushS:restS))tone(push?220:392,.25,push?'triangle':'sine',.07);
      if(s>1){later(()=>phase(push,s-1),1000);return}
      if(push){later(()=>phase(false,restS),1000);return}
      r++;if(r>=rounds){$('#pic').classList.remove('on');$('#bw').textContent='推完 3 次了。手和肩膀有沒有鬆一點？';$('#bc').textContent='';chime();return}
      $('#bc').textContent=`第 ${r+1} / ${rounds} 次`;later(()=>phase(true,pushS),1000)};
    $('#bc').textContent=`第 1 / ${rounds} 次`;phase(true,pushS)}}

/* ---------- 火龍呼吸：鼻子吸 4 秒，嘴巴呼——5 秒，把火慢慢吹小，做 6 次 ---------- */
function actDragon(){const total=S.age==='young'?4:6;
  actSpeech='火龍呼吸。用鼻子吸氣，再用嘴巴慢慢呼——，把火吹小。每吹一次，火就小一點。';
  $('#actHint').textContent=`鼻子吸氣 4 秒，嘴巴「呼——」5 秒，把火慢慢吹小。做 ${total} 次`;
  $('#actArea').innerHTML=`<div class="actpic firepic" id="pic" style="--f:1">${clayIcon('campfire',180)}</div>
    <div class="breath-word" id="bw">準備好了，就按開始</div><div class="count" id="bc"></div>
    <div class="row"><button class="btn" id="bStart">開始</button></div>`;
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';let i=0;
    const run=()=>{const P=$('#pic');if(!P)return;
      if(i>=total){P.classList.add('out');$('#bw').textContent='火變得小小的了。身體有沒有涼一點？';$('#bc').textContent='';chime();return}
      $('#bc').textContent=`第 ${i+1} / ${total} 次`;P.classList.remove('blow');
      $('#bw').textContent='鼻子吸氣～';tone(392,.3,'sine',.07);
      later(()=>{if(!$('#pic'))return;P.classList.add('blow');$('#bw').textContent='嘴巴呼～～把火吹小';tone(294,.3,'sine',.07);
        P.style.setProperty('--f',(1-(i+1)/total*.75).toFixed(2));
        later(()=>{i++;run()},5000)},4000)};
    run()}}

/* ---------- 蝸牛慢慢走：慢動作走 10 步，再慢慢呼吸 3 次 ---------- */
function actSnail(){const steps=S.age==='young'?6:10;let n=0;
  actSpeech='蝸牛慢慢走。跟著蝸牛，用最慢最慢的動作走一步。腳慢慢抬起來，慢慢放下去。';
  $('#actHint').textContent=`跟著蝸牛，用慢動作走 ${steps} 步。每走一步，按一下「走一步」`;
  $('#actArea').innerHTML=`<div class="snailpath" id="pic"><div class="snailgo" id="sn">${clayIcon('snail',84)}</div>
    <div class="snailsteps">${Array.from({length:steps},(_,k)=>`<i data-k="${k}"></i>`).join('')}</div></div>
    <div class="breath-word" id="bw">準備好了，就按「走一步」</div><div class="count" id="bc">0 / ${steps}</div>
    <div class="row"><button class="btn" id="bStep">走一步</button></div>`;
  const B=$('#bStep');
  B.onclick=()=>{if(B.disabled)return;n++;B.disabled=true;tone(330+n*20,.2,'sine',.06);
    $('#sn').style.left=`calc(${(n/steps*100).toFixed(1)}% - ${(n/steps*84).toFixed(1)}px)`;
    $$('#pic .snailsteps i').forEach((x,k)=>x.classList.toggle('on',k<n));
    $('#bc').textContent=`${n} / ${steps}`;$('#bw').textContent='腳慢慢抬起來……慢慢放下去……';
    if(n>=steps){B.style.display='none';breathe3();return}
    later(()=>{if($('#bStep')){B.disabled=false;$('#bw').textContent='好，再慢慢走一步'}},2600)};
  const breathe3=()=>{let k=0;const go3=()=>{if(!$('#bw'))return;
      if(k>=3){$('#bw').textContent='走完了。身體有沒有變慢一點？';$('#bc').textContent='';chime();return}
      $('#bc').textContent=`慢慢呼吸 ${k+1} / 3`;$('#bw').textContent='慢慢吸氣～';
      later(()=>{if($('#bw'))$('#bw').textContent='慢慢吐氣～～';later(()=>{k++;go3()},5000)},4000)};
    later(go3,800)}}

/* ---------- 選怪獸：都不像、說不出來也可以 ---------- */
const _resetFlow=resetFlow;
resetFlow=function(){_resetFlow();S.unsure=null};
const _renderMonsters=renderMonsters;
renderMonsters=function(){
  if(S.unsure&&!S.sos){renderUnsure();return}
  _renderMonsters();const M=$('#monsters');if(!M||(M.className==='weather'&&!S.sos))return;
  const row=document.createElement('div');row.className='row unsurerow';row.style.gridColumn='1/-1';
  if(S.sos){row.innerHTML=`<button class="chip" id="unsureOk">還是說不出來，也沒關係</button>`;M.appendChild(row);
    $('#unsureOk').onclick=()=>{
      S.sos=false;S.sosDone=0;speak('說不出來也沒關係。你已經讓身體慢下來了。');toast('說不出來也沒關係，你已經讓身體慢下來了');go(10)};return}
  row.innerHTML=`<button class="chip" id="unsureBtn">都不像／說不出來</button>`;M.appendChild(row);
  $('#unsureBtn').onclick=()=>{S.unsure='menu';tone(480,.1);renderMonsters()}};
function renderUnsure(){const M=$('#monsters');
  $('#monQ').textContent='說不出來也沒關係';
  if(S.unsure==='adult'){
    $('#monHint').textContent='請大人陪你一起猜';
    M.className='unsure';
    M.innerHTML=`<div class="adultbox unsureadult"><b>👀 給大人：陪孩子猜一猜</b>
      <p>先描述你看到的，再給兩三個可能，讓孩子修正：</p>
      <div class="say">「我看到你＿＿（握拳、一直看著門口…）。你可能覺得＿＿，也可能不是，你可以告訴我。」</div>
      <p>可以看三條線索：臉、身體、想做的事。孩子說「都不是」「現在不想說」也可以，先陪著就好。</p></div>
      <div class="row"><button class="btn" id="unsureBack">一起去看怪獸</button><button class="btn ghost" id="unsureBody">先讓身體冷靜</button></div>`;
    $('#unsureBack').onclick=()=>{S.unsure=null;S.pickAll=true;S.fam=null;renderMonsters()};
    $('#unsureBody').onclick=unsureCalm;return}
  $('#monHint').textContent='有時候感覺說不出名字。你想先做哪一個？';
  M.className='unsure';
  M.innerHTML=`<div class="unsurepick"><button class="pick" id="uBody"><i class="uico">${clayIcon('bubbles',64)||'🫧'}</i><b>先讓身體冷靜</b><span>不用選怪獸，先一起呼吸</span></button>
    <button class="pick" id="uAdult"><i class="uico">${clayIcon('heart',64)||'🤝'}</i><b>請大人陪我猜</b><span>一起看看是哪一隻</span></button></div>
    <div class="row"><button class="chip" id="uBack">← 回去選怪獸</button></div>`;
  speak('說不出來也沒關係。你想先讓身體冷靜，還是請大人陪你猜？');
  $('#uBody').onclick=unsureCalm;
  $('#uAdult').onclick=()=>{S.unsure='adult';tone(520,.1);renderMonsters()};
  $('#uBack').onclick=()=>{S.unsure=null;renderMonsters()}}
function unsureCalm(){S.unsure=null;S.sos=true;S.emo='scared';S.lv=S.lv0=4;S.act='breathe';tone(520,.1);speak('沒關係，我們先一起呼吸。');go(3)}

/* ---------- 再看一次：沒變小不是失敗，回去換一個方法 ---------- */
const _renderRe=renderRe;
renderRe=function(){_renderRe();
  const T=$('#thermo2');if(!T)return;
  T.querySelectorAll('[data-lv]').forEach(b=>b.addEventListener('click',()=>{
    const cf=EMO_FAM[S.emo]==='comfort';
    /* 只改「中間大小、還沒變小、第一次試」：先換方法，說說看等怪獸小一點再來 */
    if(S.lv2===3&&S.lv-S.lv2<=0&&S.tries<1){
      $('#reMsg').textContent=cf?'心裡的雨還在下，沒關係，這不是失敗。我們再試一個方法陪陪自己。':'怪獸還沒變小，沒關係，這不是失敗。有時候要多試一個方法。';
      $('#reBtns').innerHTML=`<button class="btn" id="again">換一個方法</button><button class="btn ghost" id="needAdult">請大人陪我</button>`;
      $('#again').onclick=()=>{nextAct();go(3)};$('#needAdult').onclick=()=>{coStart=0;go(8)}}
    if(S.lv2>=4&&!cf)$('#reMsg').textContent='怪獸還很大，沒關係，這不是失敗。先請大人來陪你。'}))};


/* ---------- 說說看：想一想（6 歲以上，只用「什麼／怎麼」來問，不問「為什麼」） ---------- */
const THINK={
  hot:['身體最先在哪裡感覺到牠？','下次牠快變大的時候，你想先用哪一招？','那時候，對方可能覺得怎樣？'],
  comfort:['你最在意、最捨不得的是什麼？','如果心裡是一種天氣，現在是什麼天氣？跟剛剛比有變嗎？','帶著這份心情，還可以做哪一件喜歡的小事？'],
  safe:['最擔心會發生什麼？後來真的發生了什麼？','這次你做了哪一件勇敢的小事？','下次可以先試哪一小步？'],
  repair:['如果好朋友遇到一樣的事，你會怎麼安慰他？','你想怎麼讓事情變好一點？','下次可以先做什麼？']};
const THINK_EMO={
  scared:['如果擔心是一個角色，牠長什麼樣子？常常跟你說什麼？'],stress:['如果壓力是一個角色，牠長什麼樣子？常常跟你說什麼？'],
  stuck:['哪裡最卡？哪裡其實你已經會了？','下次想換什麼方法？需要誰幫忙？'],
  hyper:['身體什麼時候會覺得「太快了」？','哪一個動作最能讓你的引擎慢下來？'],
  jealous:['你希望大人怎麼讓你知道，你也一樣重要？']};
function thinkList(k){return (THINK_EMO[k]||[]).concat(THINK[EMO_FAM[k]||'hot'])}
const _renderTalk=renderTalk;
renderTalk=function(){_renderTalk();let box=$('#thinkBox');
  if(S.talkPh||S.age==='young'){if(box)box.remove();return}
  if(!box){box=document.createElement('div');box.id='thinkBox';$('#sentence').after(box)}
  const L=thinkList(S.emo);if(S.thinkI==null||S.thinkK!==S.emo){S.thinkI=0;S.thinkK=S.emo}
  const q=L[S.thinkI%L.length];
  box.innerHTML=`<div class="thinkq"><small>💭 想一想（說出來就好，不用寫）</small><b>${q}</b>
    <span class="thinkbtns"><button class="chip" id="thinkSay">🔊 唸給我聽</button>${L.length>1?'<button class="chip" id="thinkNext">換一題</button>':''}</span></div>`;
  $('#thinkSay').onclick=()=>speak(q);
  const nx=$('#thinkNext');if(nx)nx.onclick=()=>{S.thinkI++;tone(560,.1);renderTalk()}};

/* ---------- 興奮過頭的介紹頁：平常玩烏龜兔子石頭練習「快、慢、停」 ---------- */
const _renderMD=renderMD;
renderMD=function(){_renderMD();if((S.mdK||'angry')!=='hyper')return;
  const how=[...$$('#mdBody h4')].find(h=>h.textContent.includes('怎麼跟牠相處'));
  const box=document.createElement('div');box.className='soft mdgame';
  box.innerHTML=`<b>🐢 平常可以練習「快、慢、停」</b><br><small>玩「烏龜兔子石頭」：聽到兔子就快、烏龜就慢、石頭就停。平常練熟了，興奮過頭的時候比較踩得住煞車。</small>
    <div class="row" style="justify-content:flex-start"><button class="btn small" id="mdTR">去玩烏龜兔子石頭</button></div>`;
  (how&&how.nextElementSibling?how.nextElementSibling:$('#mdBody').lastElementChild).after(box);
  $('#mdTR').onclick=()=>go(20)};
