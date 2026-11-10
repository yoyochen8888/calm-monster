/* 一起回顧（v22）：事情過後、心情平靜時，大人帶孩子回頭看那一次。
   三個問題：發生什麼、身體的感覺、下次怎麼做。可以跳過任何一題，不想做也可以先不用。 */
const RV_BODY=['臉熱熱的','心跳很快','拳頭握緊','想哭','肚子怪怪的','想躲起來','想大叫','身體硬硬的','不知道'];
const RV_Q=[null,
  ['發生了什麼事？','那時候，是什麼讓怪獸跑出來的？'],
  ['身體有什麼感覺？','怪獸來的時候，身體哪裡不一樣？可以選好幾個'],
  ['下次可以怎麼做？','如果怪獸又來了，想先試哪一個？']];
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
  S.rv={t:l.t,i:0,cause:old.cause||l.cause||'',body:(old.body||[]).slice(),plan:old.plan||l.plan||''};go(26)}
function renderReview(){const R=S.rv,l=R&&store.log.find(x=>x.t===R.t);if(!l){go(10,true);return}
  const e=EMO[l.emo],A=$('#rvArea'),nav=$('#rvNav');
  $('#rvDots').innerHTML=[1,2,3].map(i=>`<i class="${R.i===i?'on':''}"></i>`).join('');
  $('#rvDots').style.visibility=R.i>=1&&R.i<=3?'visible':'hidden';
  const next=(label='下一題')=>`<button class="btn" id="rvNext">${label}</button>`;
  const back=`<button class="btn ghost" id="rvBack">上一題</button>`;
  if(R.i===0){
    const good=l.acts&&l.acts.length?`那時候你用了「${l.acts.join('、')}」，怪獸從 ${l.lv0} 變成 ${l.lv2}。`:l.co?'那時候你願意讓大人陪你，這很勇敢。':`那時候怪獸從 ${l.lv0} 變成 ${l.lv2}。`;
    $('#rvTitle').textContent='一起回顧';$('#rvHint').textContent=`${rvWhen(l.t)}，${e.name}來過`;
    A.innerHTML=`<div class="rvmon">${monster(l.emo,110)}</div><p class="rvgood">${good}</p>
      <div class="gdetail"><b>給大人</b>：回顧不是檢討，是一起回頭看看。<br>・挑孩子心情平靜、願意聊的時候<br>・先說一件那次他做得好的事（上面那句可以直接唸）<br>・每一題都可以跳過；孩子不想說就停，下次再試</div>`;
    nav.innerHTML=`<button class="btn ghost" id="rvLater">下次再說</button>`+next('開始');
    $('#rvLater').onclick=()=>go(10);
  } else if(R.i<=3){
    const [q,h]=RV_Q[R.i];$('#rvTitle').textContent=q;$('#rvHint').textContent=h;
    if(R.i===1){A.innerHTML=`<div class="chips">${CAUSES.map(c=>`<button class="chip ${R.cause===c?'sel':''}" data-rv1="${c}">${c}</button>`).join('')}</div>`;
      $$('[data-rv1]').forEach(b=>b.onclick=()=>{R.cause=R.cause===b.dataset.rv1?'':b.dataset.rv1;tone(600,.1);renderReview()})}
    if(R.i===2){A.innerHTML=`<p class="hint" style="margin-bottom:10px">${e.name}常常會讓人：${e.body}</p><div class="chips">${RV_BODY.map(c=>`<button class="chip ${R.body.includes(c)?'sel':''}" data-rv2="${c}">${c}</button>`).join('')}</div>`;
      $$('[data-rv2]').forEach(b=>b.onclick=()=>{const c=b.dataset.rv2,k=R.body.indexOf(c);k>=0?R.body.splice(k,1):R.body.push(c);tone(600,.1);renderReview()})}
    if(R.i===3){A.innerHTML=`<div class="grid g2">${PLANS[S.age||'mid'].map(([t,s])=>`<button class="pick ${R.plan===t?'sel':''}" data-rv3="${t}"><b>${t}</b><span>${s}</span></button>`).join('')}</div>`;
      $$('[data-rv3]').forEach(b=>b.onclick=()=>{R.plan=R.plan===b.dataset.rv3?'':b.dataset.rv3;tone(620,.12);renderReview()})}
    nav.innerHTML=back+`<button class="speak" id="rvSpeak">🔊 唸給我聽</button>`+next(R.i===3?'完成':'下一題');
    $('#rvSpeak').onclick=()=>speak(q+h);
    A.insertAdjacentHTML('beforeend','<p class="note" style="text-align:center;margin-top:10px">不想選也沒關係，可以直接按下一題。</p>');
  } else {
    const first=!(l.rv&&l.rv.t);
    l.rv={t:Date.now(),cause:R.cause,body:R.body.slice(),plan:R.plan};save();
    $('#rvTitle').textContent='謝謝你願意回頭看';$('#rvHint').textContent='回頭看自己的情緒，需要很大的勇氣';
    A.innerHTML=`<div class="rvmon">${monster(l.emo,110)}</div>
      <p class="rvgood">${e.name}來，不是你的錯。${R.plan?`下次牠來的時候，你可以先試試「${R.plan}」。`:'下次牠來的時候，我們再一起想辦法。'}</p>
      <div class="gdetail"><b>給大人</b>：現在可以抱抱孩子，或一起做一件輕鬆的事。這次的回顧已經存在情緒紀錄裡。</div>`;
    nav.innerHTML=`<button class="btn" id="rvHome">回家園</button>`;$('#rvHome').onclick=()=>go(10);
    if(first){gain('一起回顧，願意回頭看',5);chime()}
    S.rv=null;return;
  }
  const n=$('#rvNext');if(n)n.onclick=()=>{R.i++;renderReview();window.scrollTo({top:0,behavior:'smooth'})};
  const b=$('#rvBack');if(b)b.onclick=()=>{R.i--;renderReview()};
}
function rvLine(l){if(!(l.rv&&l.rv.t))return '';const r=l.rv;
  return [r.body&&r.body.length?`身體：${r.body.join('、')}`:'',r.plan?`下次：${r.plan}`:''].filter(Boolean).join('；')||'已回顧'}
