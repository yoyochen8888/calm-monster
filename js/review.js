/* 一起回顧（v22）：事情過後、心情平靜時，大人帶孩子回頭看那一次。
   三個問題：發生什麼、身體的感覺、下次怎麼做。可以跳過任何一題，不想做也可以先不用。 */
const RV_BODY=['臉熱熱的','心跳很快','拳頭握緊','想哭','肚子怪怪的','想躲起來','想大叫','身體硬硬的','不知道'];
const RV_Q=[null,
  ['發生了什麼事？','那時候，是什麼讓怪獸跑出來的？'],
  ['身體有什麼感覺？','怪獸來的時候，身體哪裡不一樣？可以選好幾個'],
  ['下次可以怎麼做？','如果怪獸又來了，想先試哪一個？'],
  ['想法偵探','那時候，腦袋裡冒出什麼想法？還有沒有別的想法？']];
/* 依年齡的題目（v31）：3–5 歲只問一題「下次可以」，9–12 歲多一題「想法偵探」 */
function rvSeq(){return S.age==='young'?[3]:S.age==='old'?[1,2,4,3]:[1,2,3]}
/* 想法偵探：常見的「卡住的想法」→ 換個想法 */
const THOUGHTS=[['我什麼都做不好','我這次沒做好，但我會的事很多'],['大家都討厭我','有人不開心，不代表大家都討厭我'],['這太不公平了','也許可以說出來，一起想辦法'],
  ['一定會很糟','最可能發生的是什麼？真的發生了我可以怎麼辦？'],['沒有人懂我','我可以說給一個信任的人聽'],['都是我的錯','我做錯了一件事，我可以補救']];
const ADULT_GOOD=['我有先穩住自己','我有蹲下來、放慢說話','我沒有吼或威脅','我有先抱抱、先陪伴','我有等孩子冷靜再談'];
/* 等事情過去至少一小時、四天內，才會在家園輕輕提醒一次 */
function rvPending(){const now=Date.now();return store.log.find(l=>!l.rv&&now-l.t>36e5&&now-l.t<4*864e5)}
function rvWhen(t){const d0=new Date();d0.setHours(0,0,0,0);const d1=new Date(t);d1.setHours(0,0,0,0);const n=Math.round((d0-d1)/864e5);
  return (n<=0?'今天':n===1?'昨天':n===2?'前天':n+' 天前')+partOf(t)}
function renderReviewCard(){const box=$('#reviewBox');if(!box)return;const l=rvPending();
  if(!l||S.decor){box.innerHTML='';return}
  box.innerHTML=`<div class="rvcard"><div><b>💬 一起回顧</b><span>${rvWhen(l.t)}，${EMO[l.emo].name}來過。現在心情平靜的話，請大人陪你一起回頭看看。</span></div>
    <div class="rvbtns"><button class="btn small" id="rvGo">一起回顧</button><button class="chip" id="rvSkip">這次先不用</button></div></div>`;
  $('#rvGo').onclick=()=>startReview(l.t);
  $('#rvSkip').onclick=()=>{l.rv={skip:1};save();renderReviewCard()};}
function startReview(t){const l=store.log.find(x=>x.t===+t);if(!l)return;
  const old=l.rv&&l.rv.t?l.rv:{};
  S.rv={t:l.t,i:0,seq:rvSeq(),cause:old.cause||l.cause||'',body:(old.body||[]).slice(),plan:old.plan||l.plan||'',th:old.th||'',alt:old.alt||''};go(26)}
function renderReview(){const R=S.rv,l=R&&store.log.find(x=>x.t===R.t);if(!l){go(10,true);return}
  const e=EMO[l.emo],A=$('#rvArea'),nav=$('#rvNav');
  const seq=R.seq||[1,2,3],q0=R.i>=1&&R.i<=seq.length?seq[R.i-1]:0;
  $('#rvDots').innerHTML=seq.map((_,i)=>`<i class="${R.i===i+1?'on':''}"></i>`).join('');
  $('#rvDots').style.visibility=q0?'visible':'hidden';
  const next=(label='下一題')=>`<button class="btn" id="rvNext">${label}</button>`;
  const back=`<button class="btn ghost" id="rvBack">上一題</button>`;
  if(R.i===0){
    const good=l.acts&&l.acts.length?`那時候你用了「${l.acts.join('、')}」，怪獸從 ${l.lv0} 變成 ${l.lv2}。`:l.co?'那時候你願意讓大人陪你，這很勇敢。':`那時候怪獸從 ${l.lv0} 變成 ${l.lv2}。`;
    $('#rvTitle').textContent='一起回顧';$('#rvHint').textContent=`${rvWhen(l.t)}，${e.name}來過`;
    A.innerHTML=`<div class="rvmon">${monster(l.emo,110)}</div><p class="rvgood">${good}</p>
      <div class="gdetail"><b>給大人</b>：回顧不是檢討，是一起回頭看看。<br>・挑孩子心情平靜、願意聊的時候<br>・先說一件那次他做得好的事（上面那句可以直接唸）<br>・每一題都可以跳過；孩子不想說就停，下次再試</div>`;
    nav.innerHTML=`<button class="btn ghost" id="rvLater">下次再說</button>`+next('開始');
    $('#rvLater').onclick=()=>go(10);
  } else if(q0){
    const [q,h]=RV_Q[q0];const F=famOf(l.emo);$('#rvTitle').textContent=q;$('#rvHint').textContent=h;
    if(q0===1){A.innerHTML=`<div class="chips">${F.causes.map(c=>`<button class="chip ${R.cause===c?'sel':''}" data-rv1="${c}">${c}</button>`).join('')}</div>`;
      $$('[data-rv1]').forEach(b=>b.onclick=()=>{R.cause=R.cause===b.dataset.rv1?'':b.dataset.rv1;tone(600,.1);renderReview()})}
    if(q0===2){A.innerHTML=`<p class="hint" style="margin-bottom:10px">${e.name}常常會讓人：${e.body}</p><div class="chips">${RV_BODY.map(c=>`<button class="chip ${R.body.includes(c)?'sel':''}" data-rv2="${c}">${c}</button>`).join('')}</div>`;
      $$('[data-rv2]').forEach(b=>b.onclick=()=>{const c=b.dataset.rv2,k=R.body.indexOf(c);k>=0?R.body.splice(k,1):R.body.push(c);tone(600,.1);renderReview()})}
    if(q0===3){A.innerHTML=`<div class="grid g2">${F.plans[S.age||'mid'].map(([t,s])=>`<button class="pick ${R.plan===t?'sel':''}" data-rv3="${t}"><b>${t}</b><span>${s}</span></button>`).join('')}</div>`;
      $$('[data-rv3]').forEach(b=>b.onclick=()=>{R.plan=R.plan===b.dataset.rv3?'':b.dataset.rv3;tone(620,.12);renderReview()})}
    if(q0===4){const alt=(THOUGHTS.find(t=>t[0]===R.th)||[])[1];
      A.innerHTML=`<p class="hint" style="margin-bottom:8px">那時候腦袋裡的想法比較像哪一個？</p><div class="chips">${THOUGHTS.map(t=>`<button class="chip ${R.th===t[0]?'sel':''}" data-rv4="${t[0]}">「${t[0]}」</button>`).join('')}</div>
        ${alt?`<div class="sentence" style="font-size:1.05rem">🔍 換個想法看看：<br><u>${alt}</u></div><p class="hint">偵探的工作是找證據：這個想法一定是真的嗎？</p>`:''}`;
      $$('[data-rv4]').forEach(b=>b.onclick=()=>{R.th=R.th===b.dataset.rv4?'':b.dataset.rv4;R.alt=(THOUGHTS.find(t=>t[0]===R.th)||[])[1]||'';tone(600,.1);renderReview()})}
    nav.innerHTML=(R.i>1?back:'')+`<button class="speak" id="rvSpeak">🔊 唸給我聽</button>`+next(R.i===seq.length?'完成':'下一題');
    $('#rvSpeak').onclick=()=>speak(q+h);
    A.insertAdjacentHTML('beforeend','<p class="note" style="text-align:center;margin-top:10px">不想選也沒關係，可以直接按下一題。</p>');
  } else {
    const first=!(l.rv&&l.rv.t);
    l.rv={t:Date.now(),cause:R.cause,body:R.body.slice(),plan:R.plan,th:R.th,alt:R.alt};save();
    $('#rvTitle').textContent='謝謝你願意回頭看';$('#rvHint').textContent='回頭看自己的情緒，需要很大的勇氣';
    A.innerHTML=`<div class="rvmon">${monster(l.emo,110)}</div>
      <p class="rvgood">${e.name}來，不是你的錯。${R.plan?`下次牠來的時候，你可以先試試「${R.plan}」。`:'下次牠來的時候，我們再一起想辦法。'}</p>
      <div class="gdetail"><b>給大人</b>：現在可以抱抱孩子，或一起做一件輕鬆的事。這次的回顧已經存在情緒紀錄裡。</div>
      <details class="adultbox"><summary>👀 給大人：也回頭看看自己（選填）</summary>
        <p>這次我做得好的地方：</p><div class="chips" style="justify-content:flex-start">${ADULT_GOOD.map(t=>`<button class="chip" data-ag="${t}">${t}</button>`).join('')}</div>
        <p style="margin-top:8px">下次我想試試：</p><input id="agNext" class="namein" maxlength="40" placeholder="例如：先喝口水再開口" style="width:100%">
        <div class="row"><button class="btn small" id="agSave">存到大人區的心得筆記</button></div>
        <p class="note">每個大人也都在學。這裡只存在大人區，不會給孩子看到。</p></details>`;
    const ag=new Set();$$('[data-ag]').forEach(b=>b.onclick=()=>{const t=b.dataset.ag;ag.has(t)?ag.delete(t):ag.add(t);b.classList.toggle('sel')});
    $('#agSave').onclick=()=>{const nx=$('#agNext').value.trim();if(!ag.size&&!nx){toast('選一個或寫一句再存喔');return}
      store.pnotes=(store.pnotes?store.pnotes+'\n':'')+`${fmtT(Date.now()).split(' ')[0]} ${e.name}：`+[ag.size?`做得好：${[...ag].join('、')}`:'',nx?`下次試試：${nx}`:''].filter(Boolean).join('；');
      save();toast('存好了，在「給大人」的心得筆記裡');$('#agSave').disabled=true;$('#agSave').textContent='✓ 存好了'};
    nav.innerHTML=`<button class="btn" id="rvHome">回家園</button>`;$('#rvHome').onclick=()=>go(10);
    if(first){gain('一起回顧，願意回頭看',5);chime()}
    S.rv=null;return;
  }
  const n=$('#rvNext');if(n)n.onclick=()=>{R.i++;renderReview();window.scrollTo({top:0,behavior:'smooth'})};
  const b=$('#rvBack');if(b)b.onclick=()=>{R.i--;renderReview()};
}
function rvLine(l){if(!(l.rv&&l.rv.t))return '';const r=l.rv;
  return [r.body&&r.body.length?`身體：${r.body.join('、')}`:'',r.th?`想法：${r.th}→${r.alt}`:'',r.plan?`下次：${r.plan}`:''].filter(Boolean).join('；')||'已回顧'}
