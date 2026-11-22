/* v57：可以列印的測試包——冷靜角海報、事後回顧單
   - 用途：給家長試用（市場調查 2026-11-22）。情緒來的時候大人看牆上的海報就好，不用開 App；平靜後用回顧單一起聊
   - 海報上「大人先做的三件事」依共同調節（研究依據：強）：大人先穩 → 蹲低、短句說出情緒 → 一起慢慢呼吸或抱抱
   - 回顧單依「發生什麼事 → 有什麼感覺 → 身體有什麼反應 → 下次可以」，給大人的部分沿用 v55 冰山（孩子說的／大人猜的／還不知道）
   - 孩子的方法只放不用看螢幕也能做的（不放戳泡泡、跟青蛙呼吸）
   - #printArea 平常看不到，只有按列印時才出現 */
const PRINT_ACTS=['breathe','push','dragon','turtle','butterfly','squeeze','light','senses','snail','hug'];
const PRINT_NAME={hug:'找大人抱抱'};
const PRINT_ICO={breathe:'breeze',push:'wallpush',dragon:'campfire',turtle:'turtle',senses:'magnify',snail:'snail',hug:'hug'};
const PRINT_EMOJI={breathe:'🌬️',push:'🧱',dragon:'🐉',turtle:'🐢',butterfly:'🦋',squeeze:'🍋',light:'🚦',senses:'🔍',snail:'🐌',hug:'🤗'};
const PRINT_HOW={
  breathe:'吸氣肚子鼓起來，吐氣慢慢的',
  push:'雙手推牆，用力 10 秒，再放鬆',
  dragon:'鼻子吸氣，嘴巴「呼——」慢慢吐',
  turtle:'想「停」，縮進殼裡深呼吸 3 次，再探出頭想辦法',
  butterfly:'雙手交叉放胸前，左右輪流輕輕拍',
  squeeze:'兩手握拳用力擠 4 秒，再放開',
  light:'紅燈停一停、黃燈深呼吸、綠燈想好再做',
  senses:'找找看：看得到、聽得到、摸得到的東西',
  snail:'用最慢的慢動作走幾步',
  hug:'走到大人身邊，抱一下'};
const PRINT_EMO=['angry','sad','stuck','scared','wronged','reluctant'];
/* v58：情境卡（測試包的兩個情境，挑 2 個；預設上學分離＋收玩具，手足撞到暴走小怪獸的主題，留著備用） */
const PRINT_CASES={
  sep:{t:'上學分離',mon:'reluctant',
    pre:['一起讀上學的繪本，先路過幼兒園','照實說：有老師、小朋友，會玩、吃點心、睡午覺','帶一個小玩偶或全家福'],
    say:['「我知道你很捨不得，想哭沒關係。」','「吃完點心、睡完午覺，我就來接你。」','「我們抱三下，掰掰！老師會陪你進去。」'],
    after:['準時接，先抱一下：「我說到做到。」','說出他做到的事：「你早上很想我，還是自己走進教室了。」'],
    no:'不要偷偷溜走、在門口折返、用嚇的或跟別人比。哭的時間通常會一天比一天短；超過 4 週沒改善，或影響睡眠、吃飯，就問兒童心智科或心理師。'},
  toys:{t:'收玩具／關電視',mon:'angry',
    pre:['先預告：「再玩 5 分鐘，計時器響就收。」','先說好「最後一次」，讓結束可以預期'],
    say:['「還想玩，好捨不得，對不對？」','「計時器響了。你收紅色，我收藍色。」','「明天再來玩，我們把它放在這裡等你。」'],
    after:['說出他做到的事：「你雖然捨不得，還是自己把紅色積木收好了。」','還是崩潰就先陪他冷靜（看冷靜角海報），平靜後教他說「再一下下」'],
    no:'不要突然關掉，也不要說「不收就丟掉」。'},
  sib:{t:'手足弄壞東西',mon:'wronged',
    pre:['各自有一個「我的寶貝」盒，先說好哪些可以一起玩'],
    say:['「先停，我不會讓任何人受傷。」','「弟弟弄壞你的積木，你很生氣，對不對？」','「你可以說：『我很生氣，請不要碰我的積木。』」'],
    after:['冷靜後一起修復：遞一塊積木、一起重蓋','練習剛剛那句替代的話'],
    no:'先分開確保安全，不急著判誰對；不要只罰大的。'}};
const PRINT_CASE_KEYS=['sep','toys','sib'];
function printCasesPicked(){const p=(store.printCases||[]).filter(k=>PRINT_CASES[k]);return p.length?p:['sep','toys']}
const PRINT_BODY=['頭','臉','喉嚨','胸口','肚子','手','腳'];

const prName=a=>PRINT_NAME[a]||ACT_NAME[a]||a;
const prIco=(a,s)=>(PRINT_ICO[a]&&typeof clayIcon==='function'&&clayIcon(PRINT_ICO[a],s))||`<span class="pr-emo" style="font-size:${Math.round(s*.62)}px">${PRINT_EMOJI[a]||'⭐'}</span>`;
const prMon=k=>HASART.has(k)?`<img src="img/${k}0.webp" alt="">`:monster(k,80,'',{grow:1,level:1});

/* 預設勾選：先用工具箱裡對孩子有用的方法（不分怪獸），不夠再補呼吸、推牆、蝴蝶抱 */
function printDefaults(){const id={};Object.keys(ACT_NAME).forEach(a=>id[ACT_NAME[a]]=a);const st={};
  (store.log||[]).filter(x=>x.lv2<x.lv0).forEach(x=>(x.acts||[]).forEach(n=>{const a=id[n];if(a&&PRINT_ACTS.includes(a))st[a]=(st[a]||0)+1}));
  const pick=Object.keys(st).sort((a,b)=>st[b]-st[a]).slice(0,3);
  ['breathe','push','butterfly'].forEach(a=>{if(pick.length<3&&!pick.includes(a))pick.push(a)});
  return pick}
function printPicked(){const p=(store.printActs||[]).filter(a=>PRINT_ACTS.includes(a));return p.length?p:printDefaults()}

function renderPrintPick(){const box=$('#printPick');if(!box)return;const sel=printPicked();
  box.innerHTML=`<p class="pr-tip">先跟孩子一起挑 <b>3 個</b>放在海報上的冷靜方法（已經先勾好對孩子有用的）：</p>
    <div class="chips" style="justify-content:flex-start">${PRINT_ACTS.map(a=>`<button class="chip ${sel.includes(a)?'sel':''}" data-pa="${a}">${PRINT_EMOJI[a]} ${prName(a)}</button>`).join('')}</div>
    <div class="row" style="justify-content:flex-start;margin-top:10px">
      <button class="btn small" id="prPoster">🖨️ 列印冷靜角海報</button>
      <button class="btn small" id="prSheet">🖨️ 列印事後回顧單</button></div>
    <p class="pr-tip" style="margin-top:12px">情境卡（挑 2 個，印在同一張）：</p>
    <div class="chips" style="justify-content:flex-start">${PRINT_CASE_KEYS.map(k=>`<button class="chip ${printCasesPicked().includes(k)?'sel':''}" data-pc="${k}">${PRINT_CASES[k].t}</button>`).join('')}</div>
    <div class="row" style="justify-content:flex-start;margin-top:10px"><button class="btn small" id="prCases">🖨️ 列印情境卡</button></div>
    <p class="pr-tip">iPad／iPhone：按下後會跳出列印畫面，可以用 AirPrint 印，或用兩指放大預覽圖，再按分享存成 PDF。如果加到主畫面後按了沒反應，請用 Safari 打開這個網址再按一次。</p>`;
  $$('[data-pa]').forEach(b=>b.onclick=()=>{let p=printPicked().slice();const a=b.dataset.pa;
    if(p.includes(a))p=p.filter(x=>x!==a);else{if(p.length>=3){toast('最多 3 個，先取消一個再選');return}p.push(a)}
    store.printActs=p;save();renderPrintPick()});
  $('#prPoster').onclick=()=>{const p=printPicked();if(p.length<1){toast('先挑至少 1 個方法');return}doPrint(posterHtml(p))};
  $('#prSheet').onclick=()=>doPrint(sheetHtml());
  $$('[data-pc]').forEach(b=>b.onclick=()=>{let p=printCasesPicked().slice();const k=b.dataset.pc;
    if(p.includes(k))p=p.filter(x=>x!==k);else{if(p.length>=2){toast('最多 2 個，先取消一個再選');return}p.push(k)}
    store.printCases=p;save();renderPrintPick()});
  $('#prCases').onclick=()=>doPrint(casesHtml(printCasesPicked()))}

function casesHtml(keys){
  return `<div class="pr-page pr-cases">
    <header class="pr-head small"><h1>情境卡：照著說就好</h1><p>情緒很大的時候，看「當下三句話」就好；其他的平常先看過</p></header>
    ${keys.map(k=>{const c=PRINT_CASES[k];return `<section class="pr-case">
      <div class="pr-case-t">${prMon(c.mon)}<h2>${c.t}</h2></div>
      <div class="pr-case-say"><b>👀 當下三句話</b>${c.say.map((s,i)=>`<p><i>${i+1}</i>${s}</p>`).join('')}</div>
      <div class="pr-case-cols"><div><b>事前</b><ul>${c.pre.map(x=>`<li>${x}</li>`).join('')}</ul></div>
        <div><b>平靜以後</b><ul>${c.after.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>
      <p class="pr-case-no">⚠️ ${c.no}</p></section>`}).join('')}
  </div>`}

function doPrint(html){let area=$('#printArea');
  if(!area){area=document.createElement('div');area.id='printArea';document.body.appendChild(area)}
  area.innerHTML=html;document.body.classList.add('cm-print');
  /* 等圖片載好再列印，iPad 才不會印出空白的怪獸 */
  const imgs=[...area.querySelectorAll('img')].filter(i=>!i.complete);
  Promise.all(imgs.map(i=>new Promise(r=>{i.onload=i.onerror=r}))).then(()=>setTimeout(()=>{try{window.print()}catch(e){toast('這個瀏覽器不能直接列印，請用 Safari 打開再試一次')}},150))}

function posterHtml(acts){
  const lines=[
    ['heart','先穩住自己','先吸一口氣，再蹲低、放慢聲音。大人先慢下來，孩子才跟得上。'],
    ['hug','說出感覺','「你好＿＿＿，我在這裡。」先接住感覺，不急著講道理。'],
    ['breeze','一起慢慢呼吸，或抱抱','慢慢吸、慢慢吐。等冷靜下來，再一起想下次怎麼做。']];
  return `<div class="pr-page pr-poster">
    <header class="pr-head"><h1>我們的冷靜角</h1><p>情緒怪獸來了，我們一起慢慢來</p></header>
    <section class="pr-adult"><h2>👀 給大人：先做這三件事</h2>
      ${lines.map(([ic,t,s],i)=>`<div class="pr-line"><b class="pr-n">${i+1}</b><i class="pr-ic">${clayIcon(ic,64)||''}</i><div><b>${t}</b><span>${s}</span></div></div>`).join('')}
      <p class="pr-safe">⚠️ 有人可能受傷時：先把大家分開、確保安全，再做上面三件事。</p></section>
    <section class="pr-kid"><h2>🌟 我的冷靜方法</h2>
      <div class="pr-acts">${acts.map(a=>`<div class="pr-act"><i>${prIco(a,72)}</i><b>${prName(a)}</b><span>${PRINT_HOW[a]||''}</span></div>`).join('')}</div>
      <p class="pr-self">我想對自己說：<u></u></p></section>
    <footer class="pr-foot"><div class="pr-mons">${PRINT_EMO.map(prMon).join('')}</div><p>感受都可以，行為有界線。｜情緒怪獸家園</p></footer>
  </div>`}

function sheetHtml(){
  const L=n=>'<i class="pr-l"></i>'.repeat(n);
  return `<div class="pr-page pr-sheet">
    <header class="pr-head small"><h1>事後一起聊聊</h1><p>日期：<u class="short"></u>　　一起聊的人：<u class="short"></u></p></header>
    <p class="pr-intro">👀 等大家都冷靜下來再聊。孩子說不出來也沒關係，可以用指的、用畫的；大人幫忙寫字。</p>
    <section class="pr-q grow"><h3><b>1</b>發生了什麼事？</h3><div class="pr-draw"><small>寫字或畫畫都可以</small></div></section>
    <section class="pr-q"><h3><b>2</b>那時候是哪一隻怪獸？（圈起來）</h3>
      <div class="pr-feel">${PRINT_EMO.map(k=>`<div>${prMon(k)}<small>${EMO[k].name.replace('怪獸','')}</small></div>`).join('')}<div class="pr-other"><span>其他</span><u></u></div></div></section>
    <section class="pr-q pr-two">
      <div><h3><b>3</b>有多大？（圈起來）</h3><div class="pr-size"><span class="s1">小</span><span class="s2">中</span><span class="s3">大</span></div></div>
      <div><h3><b>4</b>身體哪裡有感覺？</h3><div class="pr-body">${PRINT_BODY.map(b=>`<span>□ ${b}</span>`).join('')}</div></div></section>
    <section class="pr-q"><h3><b>5</b>我用了什麼方法？</h3>${L(1)}</section>
    <section class="pr-q"><h3><b>6</b>下次怪獸來的時候，我想先試：</h3>${L(1)}</section>
    <section class="pr-adultbox"><h3>👀 給大人（孩子不用看）</h3>
      <p>我看到的行為（只寫看得到的，例如「把積木推倒」）：</p>${L(1)}
      <p>可能的原因：□ 孩子自己說的　□ 大人猜的　□ 還不知道</p>${L(1)}
      <p>下次可以調整的（作息、環境、提早提醒、陪伴）：</p>${L(1)}</section>
  </div>`}

/* 打開「給大人」時一起更新勾選（包住 renderToughNote，openP 每次都會叫它） */
if(typeof renderToughNote==='function'){const _rtnV57=renderToughNote;renderToughNote=function(){_rtnV57.apply(this,arguments);renderPrintPick()}}
/* cm-print 只在列印時有作用，不拿掉（iPad 的 afterprint 有時太早觸發，拿掉會印出整個 App） */
renderPrintPick();
