/* v39：三條線索、大小的樣子、我的工具箱、猜猜是誰
   想法：先幫孩子從「臉、身體、想做什麼」認出情緒，再選方法。
   句子都用「可能會」：每個人的感覺不一樣，沒有標準答案。 */

/* 每隻怪獸的三條線索：[臉, 身體, 想做什麼] */
const CLUES={
  angry:['眉毛皺緊緊、眼睛瞪大大、牙齒咬緊','臉熱熱、心跳變快、拳頭握緊','想大叫、想丟東西、想推開'],
  sad:['眉毛垂下來、嘴角往下、眼睛濕濕的','眼睛酸酸、喉嚨緊緊、沒有力氣','想哭、想找人抱、不想說話'],
  defiant:['眉毛皺皺、嘴巴嘟起來、下巴抬高','心裡悶悶的、胸口脹脹的','想爭辯、想說「再來一次」'],
  stuck:['眉頭皺皺、嘴巴抿緊緊、一直嘆氣','肩膀緊緊、臉熱熱、呼吸變快','想放棄、想把東西推開'],
  scared:['眉毛變成八字、眼睛睜大大、咬嘴唇','肚子怪怪的、心跳很快、手心濕濕的','想躲起來、想拉著大人'],
  wronged:['嘴巴扁扁的、眼眶紅紅、低著頭','胸口悶悶的、喉嚨卡卡的','想哭又說不出來、想被聽見'],
  reluctant:['嘴巴扁扁的、眼睛一直看著捨不得的東西','心裡揪揪的、腳重重的','想黏著不放手、想說「再一下下」'],
  jealous:['嘴巴嘟嘟的、眼睛偷偷看別人的東西','心裡酸酸的、胸口悶悶的','想搶過來、想說「我才不稀罕」'],
  shy:['眼睛看地上、臉紅紅、嘴巴閉緊緊','臉熱熱、聲音變小、心跳快快的','想躲到大人後面'],
  hyper:['眼睛亮亮的、嘴巴笑得好大','身體停不下來、聲音越來越大','想跑、想跳、想大叫'],
  embarrassed:['臉紅紅、眼睛不敢看人、用手遮住臉','臉燙燙的、耳朵熱熱的','好想消失、想躲起來'],
  guilty:['低著頭、眼睛不敢看別人','心裡沉沉的、肚子悶悶的','想躲起來、想把事情補好'],
  lonely:['眼睛垂垂的、嘴角往下、一直看別人玩','心裡空空的、沒有力氣','不想說話、想有人陪'],
  stress:['眉頭皺皺、眼睛累累的','肩膀緊緊、頭脹脹的、睡不好','容易發脾氣、什麼都不想做']
};
const CLUE_LABEL=[['🙂','臉'],['🫀','身體'],['🏃','想做的事']];
/* 也可以這樣說（擴充情緒詞彙，6 歲以上顯示）：失望、緊張不另外做怪獸，放在這裡 */
const VOCAB={angry:['不高興','火大'],sad:['失望','傷心'],stuck:['挫折','卡住了'],scared:['緊張','害怕'],defiant:['不甘心'],
  wronged:['被誤會'],jealous:['羨慕'],stress:['好累','喘不過氣'],lonely:['寂寞'],embarrassed:['丟臉']};

function clueCard(k,i){return `<div class="clue"><i>${CLUE_LABEL[i][0]}</i><b>${CLUE_LABEL[i][1]}</b><span>可能會${CLUES[k][i]}</span></div>`}
function cluesHtml(k){if(!CLUES[k])return '';const young=S.age==='young';const v=VOCAB[k];
  return `<h4>🔍 怎麼認出牠？</h4><p class="hint" style="text-align:left;margin:0 0 8px">每個人不一樣，這些是「可能」的線索</p>`
    +(young?`<div class="clues one">${clueCard(k,1)}</div><details class="cluemore"><summary>再看兩條線索</summary><div class="clues">${clueCard(k,0)}${clueCard(k,2)}</div></details>`
      :`<div class="clues">${[0,1,2].map(i=>clueCard(k,i)).join('')}</div>`+(v?`<p class="vocab">也可以這樣說：${v.map(t=>`<b>${t}</b>`).join('、')}</p>`:''))}

/* 每個大小「可能像這樣」：讓孩子用看得見的樣子來選，不是只選數字 */
const SIZE_DESC={
  hot:['皺皺眉，有一點不舒服','嘟著嘴，開始覺得煩','握緊拳頭，聲音變大','想跺腳、想大叫','想丟東西、想打人，停不下來'],
  comfort:['心裡有一點悶悶的','嘴巴扁扁的，不太想說話','眼睛濕濕的，想哭','哭出來了，想要人抱','哭得停不下來'],
  safe:['有一點不確定','肚子怪怪的，想先看一下','心跳變快，不太敢試','想躲起來、想拉著大人','身體僵住，什麼都做不了'],
  repair:['心裡有一點怪怪的','不太敢看別人','臉熱熱的，心裡沉沉的','好想躲起來','覺得自己很糟，好想消失']
};
const SIZE_DESC_EMO={
  stuck:['有一點卡卡的','皺眉頭、嘆氣','握拳、肩膀緊緊的','想放棄、想把東西推開','想丟東西、大叫「我不要做了」'],
  hyper:['好開心，還聽得到別人說話','身體開始動來動去','聲音越來越大','停不下來，聽不到別人說話','撞來撞去，快要有人受傷']
};
function sizeDesc(k,lv){const a=SIZE_DESC_EMO[k]||SIZE_DESC[EMO_FAM[k]||'hot'];return a&&a[lv-1]||''}

/* 我的工具箱：從紀錄裡找出「用了以後怪獸有變小」的方法（最多 3 個） */
function toolbox(k){const id={};Object.keys(ACT_NAME).forEach(a=>id[ACT_NAME[a]]=a);const st={};
  (store.log||[]).filter(x=>x.emo===k&&x.lv2<x.lv0).forEach(x=>(x.acts||[]).forEach(n=>{const a=id[n];if(!a)return;st[a]=st[a]||[0,0];st[a][0]+=x.lv0-x.lv2;st[a][1]++}));
  return Object.keys(st).sort((a,b)=>st[b][0]/st[b][1]-st[a][0]/st[a][1]||st[b][1]-st[a][1]).slice(0,3)}
function toolboxHtml(k){const tb=toolbox(k);
  return tb.length?`<p style="margin:0 0 6px">這些方法用了以後，${EMO[k].name}有變小：</p><div class="chips" style="justify-content:flex-start">${tb.map(a=>`<button class="chip tool" data-mdact="${a}">🧰 ${ACT_NAME[a]}</button>`).join('')}</div>`
    :`<p class="hint" style="text-align:left;margin:0">還是空的。陪${EMO[k].name}冷靜以後，對你有用的方法會自己放進來。</p>`}

/* ---------- 猜猜是誰（step 30） ---------- */
const HELP={hot:['🧊','給他一點空間，等他冷靜再說'],comfort:['🤗','陪在旁邊，聽他說'],safe:['🤝','牽著他，陪他試一小步'],repair:['🩹','說「沒關係」，一起把事情弄好']};
const GS_ROUNDS=5;
function gsShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function gsNew(){const G=S.gs,vis=visibleEmo().filter(k=>CLUES[k]);
  let pool=vis.filter(k=>k!==G.k);if(!pool.length)pool=vis;
  const k=pool[Math.floor(Math.random()*pool.length)];G.k=k;G.shown=1;G.right=false;G.miss=null;G.said=false;
  G.order=S.age==='young'?[1,0,2]:gsShuffle([0,1,2]);
  if(G.mode==='who'){/* 另外兩隻盡量選不同家族，線索才不會太像 */
    const others=gsShuffle(vis.filter(x=>x!==k));const far=others.filter(x=>EMO_FAM[x]!==EMO_FAM[k]);
    const pick=[];far.concat(others).forEach(x=>{if(pick.length<2&&!pick.includes(x)&&!pick.some(p=>EMO_FAM[p]===EMO_FAM[x]&&far.length>1))pick.push(x)});
    others.forEach(x=>{if(pick.length<2&&!pick.includes(x))pick.push(x)});
    G.opts=gsShuffle([k].concat(pick))}
  else G.opts=gsShuffle(Object.keys(FAM).filter(f=>vis.some(x=>EMO_FAM[x]===f)))}
function renderGuess(){
  if(!S.gs){S.gs={mode:'who',n:0};gsNew()}
  const G=S.gs,k=G.k,e=EMO[k],young=S.age==='young';
  $('#gsQ').textContent=G.mode==='who'?'猜猜是誰':'怎麼陪他？';
  $('#gsModes').innerHTML=young?'':[['who','🔍 猜猜是誰'],['help','🤝 怎麼陪他？']].map(([m,t])=>`<button class="chip ${G.mode===m?'sel':''}" data-gsm="${m}">${t}</button>`).join('');
  $$('[data-gsm]').forEach(b=>b.onclick=()=>{if(G.mode===b.dataset.gsm)return;S.gs={mode:b.dataset.gsm,n:0};gsNew();tone(520,.1);renderGuess()});
  const B=$('#gsBody');
  if(G.n>=GS_ROUNDS){$('#gsHint').textContent='';
    B.innerHTML=`<div class="sentence">${G.mode==='who'?`玩完 ${GS_ROUNDS} 題了。<br>你今天從臉、身體、想做的事，認出了 ${GS_ROUNDS} 隻怪獸`:`玩完 ${GS_ROUNDS} 題了。<br>你想了 ${GS_ROUNDS} 種陪朋友的方法`}</div>
      <div class="row"><button class="btn" id="gsAgain">再玩一次</button><button class="btn ghost" id="gsBack">回遊戲</button></div>`;
    $('#gsAgain').onclick=()=>{S.gs={mode:G.mode,n:0};gsNew();renderGuess()};$('#gsBack').onclick=()=>go(17,true);return}
  $('#gsHint').textContent=`第 ${G.n+1} / ${GS_ROUNDS} 題`;
  if(G.right){const f=famOf(k);
    B.innerHTML=`<div class="stage" style="min-height:130px">${monster(k,120,'wobble',{mood:1})}</div>
      <div class="sentence">${G.mode==='who'?`是<u>${e.name}</u>！<br>牠想告訴你：「${EMO_MSG[k]}」`:`${f.ico} ${e.name}需要「${f.need}」<br>${HELP[EMO_FAM[k]][1]}，他會覺得有人懂`}</div>
      <p class="hint">${G.mode==='who'?'你有過這樣的感覺嗎？說給大人聽，大人也說一次':'你難過或生氣的時候，希望別人怎麼陪你？'}</p>
      <div class="row"><button class="btn" id="gsNext">${G.n+1>=GS_ROUNDS?'完成':'下一題'}</button></div>`;
    $('#gsNext').onclick=()=>{G.n++;if(G.n>=GS_ROUNDS)gameReward('guess','猜猜是誰');else gsNew();renderGuess()};return}
  if(G.mode==='who'){
    B.innerHTML=`<p class="gsask">有一隻怪獸來了。牠是誰？</p><div class="clues">${G.order.slice(0,G.shown).map(i=>clueCard(k,i)).join('')}</div>
      ${G.shown<3?`<div class="row"><button class="chip" id="gsMore">再給我一條線索</button></div>`:''}
      <div class="grid g3 gsopts">${G.opts.map(o=>`<button class="pick ${G.miss===o?'gswrong':''}" data-gso="${o}">${monster(o,young?84:72,'',{mood:2})}<b>${EMO[o].name}</b></button>`).join('')}</div>
      ${G.miss?`<p class="hint">再看看線索，想一想</p>`:''}`;
    const m=$('#gsMore');if(m)m.onclick=()=>{G.shown++;G.miss=null;tone(480,.1);renderGuess();gsSay()};
  }else{
    B.innerHTML=`<div class="stage" style="min-height:120px">${monster(k,110,'wobble',{mood:2})}</div>
      <div class="sentence">朋友的心裡來了<u>${e.name}</u>。<br>他的臉可能${CLUES[k][0]}。</div>
      <p class="gsask">你可以怎麼陪他？</p>
      <div class="needs kind">${G.opts.map(f=>`<button class="need ${G.miss===f?'gswrong':''}" data-gso="${f}"><i>${HELP[f][0]}</i><b>${HELP[f][1]}</b></button>`).join('')}</div>
      ${G.miss?`<p class="hint">這個方法可以留給別的怪獸。再想想，${e.name}最需要什麼？</p>`:''}`;
  }
  $$('[data-gso]').forEach(b=>b.onclick=()=>{const o=b.dataset.gso,ok=G.mode==='who'?o===k:o===EMO_FAM[k];
    if(ok){G.right=true;chime();speak(G.mode==='who'?`是${e.name}。牠想告訴你：${EMO_MSG[k]}`:`${e.name}需要${famOf(k).need}`)}
    else{G.miss=o;tone(220,.12,'sine',.08);if(G.mode==='who'&&G.shown<3)G.shown++}
    renderGuess();if(!ok&&G.mode==='who')gsSay()});
  if(!G.said){G.said=true;gsSay()}
}
/* 把最新的一條線索唸出來（小小孩不用自己讀） */
function gsSay(){const G=S.gs;if(!G||G.right||G.n>=GS_ROUNDS)return;
  if(G.mode==='who'){const i=G.order[G.shown-1];speak(`牠的${CLUE_LABEL[i][1]}，可能會${CLUES[G.k][i]}。牠是誰？`)}
  else speak(`朋友的心裡來了${EMO[G.k].name}。你可以怎麼陪他？`)}
