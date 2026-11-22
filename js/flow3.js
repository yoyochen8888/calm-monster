/* v58 冷靜流程第三層：依 2026-11-22 Gemini 查核過的研究依據調整
   - 烏龜法（Pyramid Model 幼兒教材的原版四步，用自己的文字和角色）：說出感覺 → 想「停！」→ 縮進殼裡深呼吸 3 次 → 探出頭想辦法
     對象 3–5 歲，可延伸到 6–8 歲；9–12 歲不顯示（calm-flow.js renderAct 有過濾）
   - 轉移注意力分情境（Hermens 2025）：等待、捨不得時有用 → 捨不得怪獸先「找找看」；
     挫折時效果差 → 做不到怪獸當下改成自己安撫（呼吸、擠檸檬、推牆），戳泡泡和跟青蛙呼吸留在平時練習，結束頁提醒「回去試一小步」
   - 🆘 馬上冷靜：上方先給大人三句話（共同調節：大人先穩 → 說出感覺 → 一起呼吸）
   載入在 co2.js 後面、games2.js 前面 */

/* ---------- 黏土烏龜（頭和腳可以縮進殼裡） ---------- */
Object.assign(CICO,{
  tuck:C=>`<ellipse cx="32" cy="57" rx="22" ry="3" fill="#6E9C6A" opacity=".18"/>
    <g class="tlegs"><ellipse cx="15" cy="50" rx="6" ry="4.6" fill="${C.g('#B7E08F',.35,-.14)}" stroke="#86B85A" stroke-width="1.3"/><ellipse cx="42" cy="51" rx="6" ry="4.6" fill="${C.g('#B7E08F',.35,-.14)}" stroke="#86B85A" stroke-width="1.3"/></g>
    <g class="thead"><circle cx="52" cy="36" r="9" fill="${C.g('#C4E89C',.35,-.14)}" stroke="#86B85A" stroke-width="1.5"/>
      <circle cx="55" cy="34.5" r="1.9" fill="#5C4A3D"/><circle cx="55.6" cy="33.9" r=".6" fill="#fff"/><path d="M52.5 40 q3 2 5.4 -.4" fill="none" stroke="#5C7A3D" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="50.5" cy="38.6" r="2" fill="#FF9A8A" opacity=".45"/></g>
    <path d="M6 48 C6 26 20 16 30 16 C40 16 50 26 50 48 Q28 54 6 48 Z" fill="${C.g('#7CC6A4',.4,-.2)}" stroke="#4E9F7E" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M28 22 l8 5 v9 l-8 5 l-8 -5 v-9 Z" fill="${C.g('#A7E0C4',.35,-.1)}" stroke="#4E9F7E" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M20 27 l-8 4 M36 27 l8 3 M20 36 l-9 6 M36 36 l9 5 M28 41 v8" stroke="#4E9F7E" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="18" cy="24" rx="6" ry="2.6" transform="rotate(-30 18 24)" fill="#fff" opacity=".5"/>`
});
Object.assign(ACT_NAME,{turtle:'烏龜法'});

/* ---------- 哪隻怪獸用哪些方法 ---------- */
Object.assign(EMO.angry,{acts:['dragon','turtle','push','light','bubbles','squeeze']});
Object.assign(EMO.defiant,{acts:['push','turtle','light','squeeze','dragon','bubbles']});
Object.assign(EMO.stuck,{acts:['breathe','squeeze','push']});
Object.assign(EMO.reluctant,{acts:['senses','comfort','rain','butterfly','breathe','light']});
/* 怪獸頁的「練習」多放幾個：情緒來的時候不用，平常可以練 */
const PRAC_EXTRA={stuck:['bubbles','fish']};

/* ---------- 烏龜法 ---------- */
const TURTLE_IDEAS=['輪流','用說的','找大人幫忙'];
function actTurtle(){
  const e=EMO[S.emo]||EMO.angry;const feel='我'+(e.feel||'好生氣').split('，')[0]+'！';
  actSpeech='烏龜法。先說出你的感覺，心裡想：停！然後像烏龜一樣縮進殼裡，抱住自己，深呼吸三次。冷靜了，再慢慢探出頭，想一個辦法。';
  $('#actHint').textContent='說出感覺 → 想「停！」→ 縮進殼裡深呼吸 3 次 → 探出頭想辦法';
  $('#actArea').innerHTML=`<div class="actpic turtlepic" id="pic">${clayIcon('tuck',180)}<b class="tstop" id="tStop">停！</b></div>
    <div class="tsteps">${['說出感覺','想「停！」','縮進殼裡','探出頭'].map((t,i)=>`<i data-ts="${i}"><b>${i+1}</b>${t}</i>`).join('')}</div>
    <div class="breath-word" id="bw">① 先說出來：「${feel}」</div><div class="count" id="bc"></div>
    <div class="row"><button class="btn" id="tNext">說好了</button></div><div id="tIdeas"></div>`;
  const B=$('#tNext'),pic=$('#pic');
  const mark=i=>$$('.tsteps i').forEach((x,k)=>{x.classList.toggle('on',k===i);x.classList.toggle('done',k<i)});
  mark(0);
  B.onclick=()=>{tone(520,.12);mark(1);pic.classList.add('stop');$('#bw').textContent='② 心裡想：停！手腳先停下來';
    B.textContent='停好了';B.onclick=tuck};
  const tuck=()=>{tone(440,.12);mark(2);pic.classList.remove('stop');pic.classList.add('in');B.style.display='none';
    $('#bw').textContent='③ 縮進殼裡：雙手抱住自己';let k=0;
    const go3=()=>{if(!$('#bw'))return;
      if(k>=3){$('#bc').textContent='';out();return}
      $('#bc').textContent=`深呼吸 ${k+1} / 3`;$('#bw').textContent='在殼裡慢慢吸氣～';tone(392,.4,'sine',.05);
      later(()=>{if(!$('#bw'))return;$('#bw').textContent='慢慢吐氣～';tone(330,.5,'sine',.05);k++;later(go3,4500)},3500)};
    later(go3,1800)};
  const out=()=>{mark(3);pic.classList.remove('in');chime();
    $('#bw').textContent='④ 慢慢探出頭，想一個辦法：';
    $('#tIdeas').innerHTML=`<div class="chips">${TURTLE_IDEAS.map(t=>`<button class="chip" data-ti="${t}">${t}</button>`).join('')}</div>
      <p class="hint">想好了，就按下面的「我好一點了」</p>`;
    $$('[data-ti]').forEach(b=>b.onclick=()=>{$$('[data-ti]').forEach(x=>x.classList.toggle('sel',x===b));tone(620,.12);speak(b.dataset.ti)})};
}

/* ---------- 🆘 馬上冷靜：上方先給大人三句話 ---------- */
const SOS_ADULT=['先吸一口氣，蹲低、放慢聲音','「你好＿＿，我在這裡。」','一起慢慢吸、慢慢吐，等平靜了再說'];
const _renderActV58=renderAct;
renderAct=function(){_renderActV58.apply(this,arguments);
  let box=$('#sosAdult');
  if(!box){box=document.createElement('div');box.id='sosAdult';const t=$('#actTabs');if(t)t.before(box)}
  box.innerHTML=S.sos?`<div class="sosadult"><b>👀 給大人：先做這三件事</b><ol>${SOS_ADULT.map(x=>`<li>${x}</li>`).join('')}</ol><small>有人可能受傷時，先把大家分開、確保安全。</small></div>`:''};

/* ---------- 做不到怪獸：冷靜完，回去試一小步 ---------- */
const _finishV58=$('#finish').onclick;
$('#finish').onclick=function(){_finishV58.apply(this,arguments);
  let box=$('#tryStep');
  if(!box){box=document.createElement('div');box.id='tryStep';const t=$('#toughMsg');if(t)t.after(box)}
  box.innerHTML=S.emo==='stuck'?`<div class="trystep">🧩 <b>回去試一小步</b>：請大人陪你，先做最小的那一步。<br><small>不是「做不到」，是「還沒做到」。</small></div>`:''};
