/* v55 給大人的冰山、手掌小腦袋、什麼時候找專業協助
   參考（只借概念、自己改寫）：行為冰山（看得到的行為／水面下的需要）、Siegel 手掌大腦（簡化比喻）、
   AAP／AACAP 轉介時機；台灣資源：衛福部 1925 安心專線（24 小時免付費）、社區心理衛生中心、衛生局心理諮商據點。
   載入在 co2.js 後面。 */

/* ---------- 1. 一起回顧完成頁：給大人的冰山（選填，只存在紀錄裡） ---------- */
const ICE_UNDER=['累了','餓了','身體不舒服','太吵、太擠','事情太難','轉換太突然','說不出來','擔心、害怕','想要被陪','想被聽懂','想自己決定','覺得不公平','還不知道'];
const ICE_SRC=['孩子自己說的','大人猜的','還不知道'];
const iceSvg=()=>`<svg class="icesvg" viewBox="0 0 220 120" aria-hidden="true">
  <rect x="0" y="44" width="220" height="76" rx="14" fill="#DCEFF8"/>
  <path d="M0 44 Q27 38 55 44 T110 44 T165 44 T220 44" fill="none" stroke="#9CCBE3" stroke-width="2"/>
  <path d="M86 44 L100 18 L112 26 L124 12 L138 44 Z" fill="#FFFDF8" stroke="#B9D7E8" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M70 46 L150 46 L168 82 L140 108 L84 110 L56 80 Z" fill="#EAF6FC" stroke="#B9D7E8" stroke-width="1.5" stroke-linejoin="round" opacity=".95"/>
  <text x="144" y="26" font-size="9" fill="#756353">← 看得到的行為</text>
  <text x="112" y="80" text-anchor="middle" font-size="9" fill="#756353">水面下：累、餓、擔心、需要…</text></svg>`;
function iceHtml(l){const I=l.ice||{};
  return `<details class="adultbox icebox" ${l.ice?'open':''}><summary>👀 給大人：看看冰山下面（選填）</summary>
    ${iceSvg()}
    <p class="iceq"><b>1</b> 看到的行為（只寫動作）</p>
    <input id="iceBeh" class="namein" maxlength="40" placeholder="例如：推開作業本、大叫「我不要」" value="${esc(I.beh||'')}">
    <small class="icenote">寫看得到的動作，不寫「故意」「不乖」。</small>
    <p class="iceq"><b>2</b> 水面下可能是（可以複選）</p>
    <div class="chips" style="justify-content:flex-start">${ICE_UNDER.map(t=>`<button class="chip ${(I.under||[]).includes(t)?'sel':''}" data-iu="${t}">${t}</button>`).join('')}</div>
    <p class="iceq"><b>3</b> 這些是</p>
    <div class="chips" style="justify-content:flex-start">${ICE_SRC.map(t=>`<button class="chip ${I.src===t?'sel':''}" data-is="${t}">${t}</button>`).join('')}</div>
    <p class="iceq"><b>4</b> 可以調整的環境或支持（選填）</p>
    <input id="iceAdj" class="namein" maxlength="50" placeholder="例如：寫作業前先吃點心、難的題目先拆小步" value="${esc(I.adj||'')}">
    <div class="row"><button class="btn small" id="iceSave">存進這次的紀錄</button></div>
    <p class="note">只給大人看。重點是找到可以幫忙的地方，不是找誰的錯。</p></details>`}
function bindIce(l){const I={under:(l.ice&&l.ice.under||[]).slice(),src:l.ice&&l.ice.src||''};
  $$('[data-iu]').forEach(b=>b.onclick=()=>{const t=b.dataset.iu,k=I.under.indexOf(t);k>=0?I.under.splice(k,1):I.under.push(t);b.classList.toggle('sel');tone(600,.08)});
  $$('[data-is]').forEach(b=>b.onclick=()=>{I.src=I.src===b.dataset.is?'':b.dataset.is;$$('[data-is]').forEach(x=>x.classList.toggle('sel',x.dataset.is===I.src));tone(600,.08)});
  $('#iceSave').onclick=()=>{const beh=$('#iceBeh').value.trim(),adj=$('#iceAdj').value.trim();
    if(!beh&&!I.under.length&&!adj){toast('寫一點或選一個再存喔');return}
    l.ice={beh,under:I.under.slice(),src:I.src,adj,t:Date.now()};save();toast('存好了，在情緒紀錄裡看得到');
    $('#iceSave').disabled=true;$('#iceSave').textContent='✓ 存好了'}}
const _renderReviewIce=renderReview;
renderReview=function(){const t=S.rv&&S.rv.t;_renderReviewIce();
  if(!t||!$('#rvHome'))return;const l=store.log.find(x=>x.t===t);if(!l)return;
  $('#rvArea').insertAdjacentHTML('beforeend',iceHtml(l));bindIce(l)};
function iceLine(l){const I=l.ice;if(!I)return '';
  return '冰山：'+[I.beh?`看到「${I.beh}」`:'',I.under&&I.under.length?`可能是${I.under.join('、')}${I.src?`（${I.src}）`:''}`:'',I.adj?`可以調整：${I.adj}`:''].filter(Boolean).join('，')}
const _rvLineIce=rvLine;
rvLine=function(l){const a=_rvLineIce(l),b=iceLine(l);return a&&b?a+'；'+b:a||b};

/* ---------- 2. 手掌小腦袋（遊戲區）：平靜的時候看，不在情緒當下解釋 ---------- */
Object.assign(CICO,{
  hand:C=>`<ellipse cx="32" cy="59" rx="15" ry="2.6" fill="#B98A4E" opacity=".16"/>
    <rect x="22" y="44" width="20" height="13" rx="5" fill="${C.v('#FFD7B8',.2,-.1)}" stroke="#E9A985" stroke-width="1.2"/>
    <path d="M44 34 Q53 28 53 22 Q53 18 49 19 Q45 21 42 28" fill="${C.g('#F8B9AE',.35,-.12)}" stroke="#E29486" stroke-width="1.3"/>
    <rect x="17" y="28" width="30" height="22" rx="9" fill="${C.g('#FFD7B8',.35,-.12)}" stroke="#E9A985" stroke-width="1.3"/>
    ${[17,24.5,32,39.5].map((x,i)=>`<rect x="${x}" y="${[10,6,7,11][i]}" width="7" height="${[22,26,25,21][i]}" rx="3.5" fill="${C.g('#A8DCC5',.35,-.12)}" stroke="#74BFA2" stroke-width="1.2"/>`).join('')}
    <ellipse cx="25" cy="33" rx="4" ry="1.8" fill="#fff" opacity=".5"/>`
});
const HAND_STEPS={
  young:[['open','這是你的「手掌小腦袋」。跟著一起比比看！'],['thumb','大拇指收進手心：這裡住著感覺。'],['fold','四根手指蓋下來：這是「想一想」。'],['flip','情緒太大，蓋子打開了！很難停下來想。'],['fold','先呼吸、動一動，可以幫蓋子慢慢蓋回來。']],
  mid:[['open','這是你的「手掌小腦袋」。伸出手，跟著一起比比看！'],['thumb','大拇指收進手心：這裡住著感覺——開心、生氣、難過、害怕。'],['fold','四根手指蓋下來：這是「想一想」的地方。蓋子蓋好，就能好好想、好好說。'],['flip','情緒太大的時候，蓋子會掀開！很難停下來想。這不是你不好，是蓋子開了。'],['fold','先呼吸、動一動身體，可以幫蓋子慢慢蓋回來。蓋好了，我們再一起說。']]};
HAND_STEPS.old=HAND_STEPS.mid.map((s,i)=>i===3?['flip','情緒太大時，蓋子會掀開：感覺衝上來，「想一想」暫時接不上。這時候說的話、做的事，常常不是你真正想要的。']:s);
const handSvg=()=>`<svg class="handsvg" viewBox="0 0 120 150" aria-hidden="true">
  <ellipse cx="60" cy="144" rx="32" ry="4" fill="#B98A4E" opacity=".14"/>
  <rect x="40" y="104" width="40" height="38" rx="12" fill="#FFE2CB" stroke="#E9A985" stroke-width="1.6"/>
  <rect x="28" y="58" width="64" height="56" rx="20" fill="#FFE2CB" stroke="#E9A985" stroke-width="1.6"/>
  <ellipse cx="44" cy="70" rx="8" ry="3.4" fill="#fff" opacity=".5"/>
  <g class="hthumb"><rect x="86" y="62" width="15" height="38" rx="7.5" fill="#F8B9AE" stroke="#E29486" stroke-width="1.6"/><path d="M90 74 q3.5 3 7 0" fill="none" stroke="#C9705F" stroke-width="1.6" stroke-linecap="round"/></g>
  <g class="hfing">${[30,45,60,75].map((x,i)=>`<rect x="${x}" y="${[22,14,16,26][i]}" width="14" height="${[44,52,50,40][i]}" rx="7" fill="#A8DCC5" stroke="#74BFA2" stroke-width="1.6"/>`).join('')}
    <path d="M37 30 v6 M52 22 v6 M67 24 v6 M82 34 v6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/></g></svg>`;
function showHand(){const old=$('.handov');if(old)old.remove();const steps=HAND_STEPS[S.age||'mid'];let i=0;
  const d=document.createElement('div');d.className='restov handov';
  d.innerHTML=`<div class="card handcard"><p class="q" style="margin:0">✋ 手掌小腦袋</p>
    <div class="handstage" id="hStage">${handSvg()}</div>
    <div class="handkey"><span><i style="background:#F8B9AE"></i>大拇指＝感覺</span><span><i style="background:#A8DCC5"></i>四根手指＝想一想</span></div>
    <p class="handtx" id="hTx"></p><div class="dots" id="hDots"></div>
    <div class="row"><button class="btn ghost small" id="hPrev">上一步</button><button class="speak" id="hSay">🔊</button><button class="btn small" id="hNext">下一步</button></div>
    <details class="adultbox" style="text-align:left"><summary>👀 給大人</summary>
      <p>這是 Daniel Siegel「手掌大腦」的<b>簡化比喻</b>，不是真的大腦構造。用來和孩子建立共同語言：「蓋子打開了」。</p>
      <p>孩子掀蓋的時候，先陪冷靜、不講道理；蓋回來了再談。這頁請在平靜的時候一起看，不要在情緒當下解釋。</p>
      <p>大人也會掀蓋。可以跟孩子說：「我剛剛蓋子也打開了，我先呼吸一下。」</p></details>
    <div class="row"><button class="btn ghost small" id="hClose">關閉</button></div></div>`;
  document.body.appendChild(d);
  const draw=()=>{const [st,tx]=steps[i];$('#hStage').className='handstage s-'+st;$('#hTx').textContent=tx;
    $('#hDots').innerHTML=steps.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('');
    $('#hPrev').style.visibility=i?'visible':'hidden';$('#hNext').textContent=i===steps.length-1?'再看一次':'下一步';speak(tx)};
  $('#hNext').onclick=()=>{i=i===steps.length-1?0:i+1;tone(520+i*40,.1);draw()};
  $('#hPrev').onclick=()=>{if(i){i--;draw()}};
  $('#hSay').onclick=()=>speak(steps[i][1]);
  $('#hClose').onclick=()=>{try{speechSynthesis.cancel()}catch(e){}d.remove()};
  draw()}
GAME_ICO.gHand='hand';
{const g=$('#gHand');if(g)g.onclick=showHand}

/* ---------- 3. 什麼時候找專業協助（週回顧給大人、大人抽屜） ---------- */
const HELP_WHEN=['常常打人、丟東西，或可能傷到自己或別人','說出傷害自己的話','常常很久都平復不下來（例如超過 25 分鐘），或一週好幾次','難過、易怒或對什麼都提不起勁，持續大約兩週以上','睡覺、吃飯明顯改變，或已經影響上學、家裡的生活','越來越頻繁、越來越強，大人也越來越撐不住'];
const HELP_WHO=['<b>學校輔導老師、幼兒園老師</b>：先聊聊孩子在學校的樣子','<b>兒科醫師</b>，或<b>兒童心智科／兒童青少年精神科</b>門診','<b>各縣市社區心理衛生中心</b>、<b>衛生局的心理諮商據點</b>：可以打電話給當地衛生局詢問','<b>衛福部 1925 安心專線</b>：24 小時、免付費。大人自己撐不住的時候也可以打','<b>113 保護專線</b>：24 小時。孩子說被大人不當對待、被要求保守祕密時打'];
function helpHtml(){return `<details class="adultbox helpbox"><summary>👀 什麼時候可以找專業協助？</summary>
  <p>這是日常陪伴的小工具，不能取代專業評估。有下面的情形，可以找專業的人一起看看：</p>
  <ul>${HELP_WHEN.map(t=>`<li>${t}</li>`).join('')}</ul>
  <p><b>可以找誰</b></p><ul>${HELP_WHO.map(t=>`<li>${t}</li>`).join('')}</ul>
  <p class="note">有立即危險的時候，請撥 119 或 110。找專業協助不是失敗，是多一個人一起陪孩子。</p></details>`}
function helpSignal(){const now=Date.now(),L14=store.log.filter(l=>now-l.t<14*864e5),big=L14.filter(l=>l.lv0>=4).length,co=L14.filter(l=>l.co).length;
  return big>=6||co>=4?{big,co}:null}
const _reviewHtmlHelp=reviewHtml;
reviewHtml=function(off){let h=_reviewHtmlHelp(off);if(off)return h;const s=helpSignal();
  const card=s?`<div class="warn helpsig">最近兩週，開始時就很大（4–5 級）的有 <b>${s.big}</b> 次${s.co?`、請大人陪伴 <b>${s.co}</b> 次`:''}。這不代表工具沒用或孩子有問題，可能是最近壓力比較大。可以找個平靜的時間聊聊最近的生活；如果一直這樣，可以找專業的人一起看看。</div>`:'';
  return h.replace(/<\/div>\s*$/,'')+card+helpHtml()+'</div>'};
{const tn=$('#toughNote');if(tn&&!$('#helpDrawer')){const x=document.createElement('div');x.id='helpDrawer';x.innerHTML=helpHtml();tn.after(x)}}
