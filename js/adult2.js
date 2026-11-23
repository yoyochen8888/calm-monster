/* v52 大人層：給大人的話跟著「怪獸的大小」改變
   參考（只借概念）：Gottman 情緒教練、Siegel 先連結再引導、正向教養「和善且堅定」、AAP 調節→連結→思考。
   大小 1–2：幫情緒說出名字 ／ 3：先猜感覺 → 停一下 → 界線或二選一（v58）／ 4–5：句子越短越好，只說安全和「我在這裡」
   載入在 clues.js 後面；覆蓋 adultBox()、renderAdultCue()、renderParent()，包住 renderCo()。 */

/* LVSAY[k]=[小, 中, 大] */
const LVSAY={
  angry:['「你嘴巴嘟起來了，是不是覺得不開心？」','「你很生氣，是不是事情跟你想的不一樣？」<i class="lvpause">停一下</i>「可以生氣，但不可以打人。要用力踩腳，還是擠擠枕頭？」','「我在這裡。我會保護你，也不讓你傷到別人。」'],
  defiant:['「你好想贏，結果不一樣，心裡不服氣，對不對？」','「沒有贏，心裡很不服氣，對不對？」<i class="lvpause">停一下</i>「不甘心可以，但不能摔東西。要先休息一下，還是再來一次？」','「我在這裡。先停下來，我們一起慢慢呼吸。」'],
  hyper:['「你好開心喔，身體好像快飛起來了！」','「你好興奮，身體停不下來了，對不對？」<i class="lvpause">停一下</i>「我們一起把引擎調慢：先跳三下，再坐下喝口水。」','「停，我們先到安靜的地方，我陪你慢慢呼吸。」'],
  jealous:['「你一直看著那邊，是不是也想要我陪你？」','「你一直看那邊，是不是也想要我陪你？」<i class="lvpause">停一下</i>「想要我陪可以直接說，但不可以推人。等一下就是我們的時間。」','「我先讓大家都安全。你對我很重要，我馬上來陪你。」'],
  sad:['「你看起來有點失落，是不是發生了什麼事？」','「你看起來好難過，是不是很失望？」<i class="lvpause">停一下</i>「想哭沒關係。你想抱抱，還是想說說看？」','「我在這裡陪你，你想哭多久都可以。」'],
  lonely:['「我注意到你今天比較安靜，是不是想要有人陪？」','「你是不是覺得沒人陪，有點孤單？」<i class="lvpause">停一下</i>「我在這裡。你想一起玩，還是先坐在我旁邊？」','「我在這裡，不會走開。」'],
  wronged:['「你覺得大家沒有聽懂你，對不對？」','「你是不是覺得很委屈，大家沒聽懂你？」<i class="lvpause">停一下</i>「我想聽你的版本。你慢慢說，我聽完再說話。」','「我在這裡。等你準備好，我會好好聽。」'],
  reluctant:['「你好喜歡，還不想結束，對不對？」','「好捨不得，還想再玩，對不對？」<i class="lvpause">停一下</i>「再玩最後一次就說再見。你想先收哪一個？」','「好捨不得，我陪你難過一下，我們慢慢走。」'],
  scared:['「那個聲音好大，嚇了你一跳嗎？」','「你是不是有點擔心、有點怕？」<i class="lvpause">停一下</i>「怕是很正常的。你可以抓著我的手，我們一起看看那是什麼。」','「你很安全，我就在你旁邊，什麼都不用做。」'],
  shy:['「你想先在旁邊看一下，對不對？」','「你是不是有點害羞，想先在旁邊看一下？」<i class="lvpause">停一下</i>「不用急。你想先揮揮手，還是我陪你一起去？」','「沒關係，我們先到旁邊休息一下，我陪你。」'],
  stress:['「你一直在問，是不是心裡有點擔心？」','「事情好多，你是不是覺得壓力好大？」<i class="lvpause">停一下</i>「我們一步一步來，先挑最小的一件。」','「我就在你旁邊，跟著我慢慢吸氣、吐氣。」'],
  stuck:['「這個好像有點難，卡住的感覺很討厭，對不對？」','「試了好多次還是不行，是不是很挫折？」<i class="lvpause">停一下</i>「要先休息一下，還是我示範一次你再試？」','「沒關係，現在先不做了，我陪你，等一下再說。」'],
  guilty:['「你覺得自己做錯了，心裡不舒服，對不對？每個人都會不小心。」','「你是不是覺得自己做錯了，心裡不舒服？」<i class="lvpause">停一下</i>「做錯一件事，不代表你是壞小孩。我們想想看怎麼補救。」','「我還是很愛你。等你準備好，我們再一起處理。」'],
  embarrassed:['「剛剛有點糗，對不對？每個人都會這樣。」','「剛剛有點糗，是不是覺得好丟臉？」<i class="lvpause">停一下</i>「我們到旁邊說。你想自己去說，還是我陪你？」','「不用現在說，我陪你到安靜的地方。」']
};
const LV_TIP=['先幫情緒說出名字，讓孩子知道你看到了','先猜孩子的感覺，說完停幾秒，等他點頭或慢下來，再說界線、給兩個做得到的選擇','句子越短越好。不問為什麼、不講道理，等平靜了再談'];
const LV_NAME=['小','中','大'];
function lvBand(lv){return !lv?1:lv<=2?0:lv===3?1:2}
function lvSay(k,lv){const a=LVSAY[k];return a?a[lvBand(lv)]:''}

/* 說法換一換：常見的回應，改成這樣說（家長抽屜） */
const SAY_SWAP=[
  ['說沒什麼','「這沒什麼，別哭了」','「這對你很重要，難怪你會難過。」'],
  ['用處罰擋情緒','「再哭就處罰」','「你可以哭，我陪你。等一下我們再想辦法。」'],
  ['只接住、沒界線','（孩子打人時只說「你很生氣」）','「生氣可以，但不能打人。你還可以怎麼做？」'],
  ['一直保證','第十次說「不會有事啦」','「這個我們說過了，我相信你能陪著這份擔心。」'],
  ['只給信心','「你就是要撐過去」','「這很難，你有力量撐過去，我陪你。」'],
  ['情緒大時講道理','一直說明為什麼不可以','少說話、多聽，說出你聽到的。'],
  ['問「為什麼」','「你為什麼又這樣？」','「剛剛發生了什麼事？」']
];

/* ---------- 冷靜方法頁的「給大人」 ---------- */
function adultBox(k){const p=PARENT[k],f=famOf(k),age=S.age||'mid';if(!p)return '';
  const lv=S.lv||3,b=lvBand(lv),say=lvSay(k,lv);
  /* 4–5 級的生氣家族：安全放最前面，而且不收起來 */
  const safe=b===2&&EMO_FAM[k]==='hot'?`<div class="safefirst">🛡️ 先確保安全：移開會丟、會傷人的東西，拉開一點距離，再說下面那句話。</div>`:'';
  const ask=b===0&&age!=='young'?`<p class="lvask">說完可以多問一句：「你覺得可以怎麼做？」讓孩子自己想辦法。</p>`:'';
  return `${safe}<details class="adultbox lvbox"><summary>👀 給大人（怪獸${LV_NAME[b]}）：<span class="lvsay">${say||p.say[age]}</span></summary>
    <p class="lvtip">${LV_TIP[b]}</p>${ask}
    <p><b>${f.ico} 牠需要</b>：${f.need}</p>
    <p><b>先做</b>：${p.first}</p>
    ${b===2?'':`<p><b>也可以說</b>：${p.say[age]}</p>`}
    <p><b>避免</b>：${p.avoid}</p></details>`}

/* ---------- 大人先穩住：一句提醒＋需要時陪大人呼吸一分鐘 ---------- */
let aBreathT=null;
function renderAdultCue(){const el=$('#adultCue');if(!el)return;clearInterval(aBreathT);
  if(S.sos||S.cueDone){el.innerHTML='';return}
  el.innerHTML=`<div class="adultcue"><span>👀 大人：先深呼吸一次，蹲到孩子的高度，放慢說話。</span><span class="cuebtns"><button class="chip" id="cueMin">我也需要一分鐘</button><button class="chip" id="cueOk">好了</button></span></div>`;
  $('#cueOk').onclick=()=>{S.cueDone=true;tone(520,.1);renderAdultCue()};
  $('#cueMin').onclick=()=>{tone(440,.1);adultMinute(el)}}
function adultMinute(el){let s=60,t=0;clearInterval(aBreathT);
  el.innerHTML=`<div class="adultcue amin"><div class="aminball" id="aBall"></div><div class="amintx"><b id="aWord">吸氣……</b><small>大人先穩住，孩子會跟著慢下來。孩子安全的話，可以先在旁邊陪著。</small><small id="aLeft">還有 60 秒</small></div><button class="chip" id="aEnd">好了</button></div>`;
  $('#aEnd').onclick=()=>{clearInterval(aBreathT);S.cueDone=true;renderAdultCue()};
  /* 吸 4 秒、吐 5 秒 */
  const step=()=>{if(!$('#aWord')){clearInterval(aBreathT);return}
    const ph=t%9,inh=ph<4;$('#aWord').textContent=inh?'吸氣……':'慢慢吐氣……';
    $('#aBall').classList.toggle('in',inh);$('#aLeft').textContent=s>0?`還有 ${s} 秒`:'一分鐘到了';
    t++;s--;if(s<0){clearInterval(aBreathT);$('#aWord').textContent='好了，回到孩子身邊吧';chime()}};
  step();aBreathT=setInterval(step,1000)}

/* ---------- 陪伴模式（4–5 級）：最上面先放這隻怪獸「大」的那句 ---------- */
const _renderCo=renderCo;
renderCo=function(){_renderCo();const k=S.emo;if(!k||!LVSAY[k]||S.sos)return;
  const L=$('#lines');if(L)L.insertAdjacentHTML('afterbegin',`<div class="lvfirst"><small>${EMO[k].name}很大的時候</small>${LVSAY[k][2]}</div>`)};

/* ---------- 家長抽屜：每隻怪獸的三種大小＋說法換一換 ---------- */
let pSwapOpen=false;
function renderParent(){
  if(S.emo)pEmo=pEmo||S.emo;
  $('#pTabs').innerHTML=Object.entries(EMO).map(([k,e])=>`<button class="chip ${pEmo===k?'sel':''}" data-pe="${k}">${e.name.replace('怪獸','')}</button>`).join('');
  $$('[data-pe]').forEach(b=>b.onclick=()=>{pEmo=b.dataset.pe;renderParent()});
  const p=PARENT[pEmo],L=LVSAY[pEmo]||[];const ageName={young:'3–5 歲',mid:'6–8 歲',old:'9–12 歲'};
  const order=S.age?[S.age,...['young','mid','old'].filter(a=>a!==S.age)]:['young','mid','old'];
  $('#pBody').innerHTML=`<h3>先做</h3><p>${p.first}</p>
    <h3>看怪獸多大，換一種說法</h3>
    <div class="lvrows">${['1–2 小','3 中','4–5 大'].map((n,i)=>`<div class="lvrow lv${i}"><b>${n}</b><div>${L[i]||''}<small>${LV_TIP[i]}</small></div></div>`).join('')}</div>
    ${EMO_FAM[pEmo]==='hot'?'<p class="lvnote">打人、丟東西時，安全界線不用等孩子平靜：先擋住、移開危險物，句子要短。</p>':''}
    <details class="adultbox"><summary>依年齡的說法</summary>${order.map(a=>`<div class="say"><b>${ageName[a]}</b>　${p.say[a]}</div>`).join('')}</details>
    <h3>盡量避免</h3><div class="avoid">${p.avoid}</div>
    ${p.tell?`<h3>容易搞混</h3><p class="tellbox">${p.tell}</p>`:''}
    <details class="adultbox swapbox" ${pSwapOpen?'open':''}><summary>常見說法，換成這樣說</summary>
      <div class="swaps">${SAY_SWAP.map(([t,a,b])=>`<div class="swap"><small>${t}</small><s>${a}</s><b>→ ${b}</b></div>`).join('')}</div></details>
    <h3>冷靜之後</h3><p>${p.after}</p>
    ${p.pro?`<h3>什麼時候找專業</h3><p class="probox">${p.pro}</p>`:''}`;
  const sb=$('#pBody .swapbox');if(sb)sb.ontoggle=()=>{pSwapOpen=sb.open};
}
