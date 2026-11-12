/* 怪獸分家族（v26）：每種情緒都在告訴我們一個「需要」，不同需要用不同方法照顧。
   參考：Gottman 情緒教練（察覺→同理→命名→了解需要→一起解決）、Siegel「先連結，再引導」「說出來才能馴服」。
   🔥 能量太高：先降溫，再用說的（怪獸變小）
   🌧️ 需要安慰：被陪伴、被聽懂（雨會慢慢停，不是要把難過收起來）
   🌀 需要安全感：感覺安全，再試一小步
   🩹 需要修復：原諒自己，把事情補好 */
const FAM={
  hot:{ico:'🔥',name:'能量太高的怪獸',need:'先讓身體降溫，再用說的',ok:'生氣可以，但不能傷害人和東西',
    sizeQ:n=>`${n}有多大？`,go:'我們來讓牠變小',reQ:'怪獸現在變多大了？',reHint:'身體有沒有比較冷靜？',
    body:['squeeze','breathe'],
    causes:['跟我想的不一樣','我覺得不公平','我輸了','東西被拿走了','有人一直吵我','不能做我想做的事','我也不知道'],
    wants:['自己靜一下','有人聽我說','休息一下','再試一次','抱抱'],
    plans:{young:[['紅燈停一下','手腳先停下來'],['用力擠檸檬','把力氣擠出來'],['說「我好生氣」','用說的，不用打的'],['找大人幫忙','大人可以幫你']],
      mid:[['先停三秒','紅燈：停、吸氣、再想'],['用說的','「我很生氣，因為……」'],['先離開一下','走開冷靜，等等再回來'],['把力氣用對地方','擠枕頭、推牆壁']],
      old:[['給自己 10 秒','數到 10 再開口'],['說出我想要什麼','「我希望……」比吼叫更有用'],['先離開現場','冷靜了再回來談'],['找到對的出口','運動、擠壓、寫下來']]}},
  comfort:{ico:'🌧️',name:'需要安慰的怪獸',need:'被陪伴、被聽懂',ok:'哭一哭沒關係',
    sizeQ:()=>'心裡的雨下得多大？',go:'我們來照顧牠',reQ:'心裡有沒有好一點點？',reHint:'好一點點，也算數',
    body:['comfort','butterfly'],
    causes:['想念一個人','捨不得結束','被誤會了','沒人陪我','期待的事沒發生','東西不見或壞了','被拒絕了','我也不知道'],
    wants:['抱抱','有人陪我','哭一下','說給別人聽','抱我的安心物','自己靜一下'],
    plans:{young:[['找大人抱抱','抱一下，雨就會變小'],['說「我好難過」','說出來，大人就知道'],['抱著安心物','小熊、小被被陪著我'],['哭一哭沒關係','哭完會舒服一點']],
      mid:[['說出我的感覺','「我很難過，因為……」'],['找人陪我','跟家人或朋友說'],['做一件安慰自己的事','聽音樂、畫畫、抱抱自己'],['記得雨會停','難過會慢慢變小']],
      old:[['說出來或寫下來','寫日記、畫下來都可以'],['找信任的人聊','不用一個人撐著'],['好好照顧自己','吃飯、睡覺、做喜歡的事'],['打開快樂寶盒','難過時看看好時刻']]}},
  safe:{ico:'🌀',name:'需要安全感的怪獸',need:'感覺安全，再試一小步',ok:'你很安全，我們慢慢來',
    sizeQ:n=>`${n}有多大？`,go:'我們來找回安全感',reQ:'現在有沒有覺得安全一點？',reHint:'再看看你的心裡',
    body:['breathe','senses'],
    causes:['我做不到 / 太難了','要做沒做過的事','怕做錯','要在很多人面前','事情太多了','怕發生不好的事','我也不知道'],
    wants:['有人陪我','先休息一下','有人幫我','先看別人做','再試一次','抱抱'],
    plans:{young:[['吹三口氣','呼——呼——呼——'],['牽著大人的手','有人陪就比較不怕'],['先試一小步','一點點就好'],['說「我還在學」','慢慢來沒關係']],
      mid:[['先呼吸再開始','吸飽一口氣'],['切成小步驟','先做第一步就好'],['說「我還沒做到」','不是做不到，是「還沒」'],['請人幫忙','開口求助也很勇敢']],
      old:[['把擔心寫下來','分成「我能控制」和「不能控制」'],['想一個 Plan B','A 不行時，B 是什麼？'],['一次只做一件事','先做最小的那件'],['休息 10 分鐘再回來','大腦冷卻後更好想']]}},
  repair:{ico:'🩹',name:'需要修復的怪獸',need:'原諒自己，把事情補好',ok:'做錯了可以補救，大家還是一樣愛你',
    sizeQ:()=>'心裡的不舒服有多大？',go:'我們來照顧牠',reQ:'心裡有沒有輕一點？',reHint:'再看看你的心裡',
    body:['butterfly','breathe'],
    causes:['我做錯事了','我弄壞東西了','我讓別人難過了','我出糗了','被別人笑了','我也不知道'],
    wants:['說對不起','想辦法補救','有人陪我','抱抱','自己靜一下'],
    plans:{young:[['說對不起','說完心裡會輕一點'],['一起收拾','把事情變好'],['抱抱自己','每個人都會犯錯'],['找大人說','大人可以幫你']],
      mid:[['對自己說「每個人都會犯錯」','做錯不代表我不好'],['想一個補救的方法','修好、道歉、幫忙'],['笑一笑就過去','出糗很快就會被忘記'],['跟信任的人說','說出來就沒那麼重']],
      old:[['換個說法','不是「我很糟」，是「我做錯了一件事」'],['負起責任去修復','道歉並說明怎麼補救'],['用安慰朋友的話對自己說','你會怎麼安慰好朋友？'],['從這次學一件事','下次可以怎麼做？']]}}
};
const EMO_FAM={angry:'hot',defiant:'hot',hyper:'hot',jealous:'hot',sad:'comfort',lonely:'comfort',wronged:'comfort',reluctant:'comfort',
  scared:'safe',shy:'safe',stress:'safe',stuck:'safe',guilty:'repair',embarrassed:'repair'};
/* 牠想告訴你（孩子看的一句話，會自動唸出來） */
const EMO_MSG={angry:'有事情不公平，或擋住了你',defiant:'你很在乎，想要做得更好',hyper:'你好開心，只是油門踩太大了',jealous:'你也好想要，這很正常',
  sad:'這件事對你很重要',lonely:'你想要有人陪',wronged:'你想要被好好聽懂',reluctant:'你好喜歡，捨不得說再見',
  scared:'我想保護你的安全',shy:'你需要一點時間暖身',stress:'事情太多了，要一件一件來',stuck:'這件事好難，因為你很想做好',
  guilty:'你很在乎別人的感受',embarrassed:'出糗每個人都會，很快就會過去'};
/* 依家族調整冷靜方法：需要安慰的先「需要什麼」和「陪雨下一會兒」，需要修復的先「對自己說溫柔的話」 */
['sad','lonely','wronged','reluctant'].forEach(k=>{EMO[k].acts=['comfort','rain','butterfly','breathe'].concat(k==='reluctant'?['light']:['fish'])});
['guilty','embarrassed'].forEach(k=>{EMO[k].acts=['kind','butterfly','breathe','senses']});
Object.assign(ACT_NAME,{comfort:'我需要…',rain:'陪雨下一會兒',kind:'溫柔的話'});
function famOf(k){return FAM[EMO_FAM[k]||'hot']}

/* ---------- 新的冷靜方法 ---------- */
/* 我需要…：用大圖選，給孩子和大人具體的下一步 */
const NEEDS=[['hug','🤗','抱抱','請大人抱抱你。','大人：安靜地抱著就好，不用說話，等孩子先放開。'],
  ['toy','🧸','抱安心物','去拿你最喜歡的小熊、小被被，緊緊抱著它。','大人：陪孩子去拿，或坐在旁邊。'],
  ['tell','💬','說給人聽','跟大人說：「我好難過，因為……」','大人：只要聽、點頭，說「原來是這樣」，先不給建議。'],
  ['draw','🎨','畫出來','拿紙和筆，把心裡的感覺畫出來，什麼顏色都可以。','大人：不用評價畫得好不好，可以問「這是什麼顏色的心情？」'],
  ['self','🦋','抱抱自己','兩手交叉抱住自己，輕輕拍。','']];
function actComfort(){const e=EMO[S.emo];
  actSpeech=`${e.name}來了。你現在最需要什麼？抱抱、抱安心物、說給人聽、畫出來，還是抱抱自己？`;
  $('#actHint').textContent='你現在最需要什麼？點一個';
  const A=$('#actArea');
  A.innerHTML=`<div class="needs">${NEEDS.map(([id,ico,t])=>`<button class="need ${S.need===id?'sel':''}" data-need="${id}"><i>${ico}</i><b>${t}</b></button>`).join('')}</div><div id="needDo"></div>`;
  const show=()=>{const n=NEEDS.find(x=>x[0]===S.need);if(!n)return;
    $('#needDo').innerHTML=`<div class="sentence" style="font-size:1.1rem">${n[3]}</div>${n[4]?`<p class="note" style="text-align:center">${n[4]}</p>`:''}<p class="hint">慢慢來，好一點的時候按「我好一點了」</p>`};
  $$('[data-need]').forEach(b=>b.onclick=()=>{S.need=b.dataset.need;tone(560,.12);
    if(S.need==='self'){S.act='butterfly';renderAct();return}
    const n=NEEDS.find(x=>x[0]===S.need);speak(n[3]);$$('[data-need]').forEach(x=>x.classList.toggle('sel',x===b));show()});
  show()}
/* 陪雨下一會兒：哭一哭沒關係，雨會慢慢變小、停下來 */
function actRain(){
  actSpeech='哭一哭沒關係。我們一起看雨，雨下一會兒，就會慢慢變小，慢慢停下來。';
  $('#actHint').textContent='哭一哭沒關係。看著雨，慢慢呼吸，雨會慢慢停';
  const A=$('#actArea');const reduce=RM;
  A.innerHTML=`<div class="rainbox" id="rainbox"><div class="raincloud">☁️</div><div class="rainmon">${monster(S.emo,96,'',{mood:2})}</div>${reduce?'':Array.from({length:22},(_,i)=>`<i class="drop" style="left:${4+i*4.3}%;animation-delay:-${(i*.37)%1.4}s;animation-duration:${1+(i%5)*.12}s"></i>`).join('')}</div>
    <div class="breath-word" id="bw" style="font-size:1.2rem">準備好了，就按開始</div>
    <div class="row"><button class="btn" id="bStart">開始看雨</button></div>`;
  $('#rainbox').classList.add('paused');
  $('#bStart').onclick=()=>{$('#bStart').style.display='none';const box=$('#rainbox');box.classList.remove('paused');rainStart();
    const lines=['雨在下，哭一哭沒關係','我在這裡陪你','慢慢吸氣……慢慢吐氣……','雨慢慢變小了','快要停了……'];let i=0;
    const step=()=>{if(!$('#rainbox'))return;
      if(i<lines.length){$('#bw').textContent=lines[i];const drops=$$('#rainbox .drop');drops.slice(0,Math.round(drops.length*i/lines.length)).forEach(d=>d.style.display='none');i++;later(step,7000)}
      else{rainStop();$$('#rainbox .drop').forEach(d=>d.style.display='none');box.classList.add('sunny');
        $('#rainbox .raincloud').textContent='🌤️';$('#rainbox .rainmon').innerHTML=monster(S.emo,96,'wobble');
        $('#bw').textContent='雨停了。你陪自己度過了';chime();speak('雨停了。你陪自己度過了。')}};
    step()}}
/* 溫柔的話：做錯事、出糗時，用對好朋友的方式對自己說話（自我疼惜） */
const KIND={young:['每個人都會犯錯','我可以說對不起','我還是好孩子','大人會幫我'],
  mid:['每個人都會犯錯','做錯了可以補救','我還是很好的人','我正在學習'],
  old:['我做錯了一件事，不代表我很糟','我可以負責、去補救','這件事很快就會過去','我會怎麼安慰好朋友，就怎麼對自己說']};
function actKind(){
  actSpeech='把手放在心上，選一句溫柔的話，慢慢對自己說。';
  $('#actHint').textContent='把手放在心上，選一句話，慢慢對自己說三次';
  const A=$('#actArea');
  A.innerHTML=`<div class="stage">${monster(S.emo,110,'wobble')}</div><div class="needs kind">${KIND[S.age||'mid'].map(t=>`<button class="need" data-kind="${t}"><b>${t}</b></button>`).join('')}</div>
    <div class="breath-word" id="bw" style="font-size:1.15rem"></div>`;
  $$('[data-kind]').forEach(b=>b.onclick=()=>{$$('[data-kind]').forEach(x=>x.classList.toggle('sel',x===b));const t=b.dataset.kind;let n=0;
    const say=()=>{if(!$('#bw'))return;n++;$('#bw').textContent=`「${t}」 ${n} / 3`;speak(t);tone(440+n*60,.2,'sine',.07);if(n<3)later(say,3200);else later(()=>{if($('#bw')){$('#bw').textContent='你對自己好溫柔';chime()}},3000)};
    timers.forEach(clearTimeout);timers=[];say()})}

/* ---------- 給大人（收起來，需要時再打開） ---------- */
function adultBox(k){const p=PARENT[k],f=famOf(k),age=S.age||'mid';if(!p)return '';
  return `<details class="adultbox"><summary>👀 給大人：${f.ico} ${f.name.replace('的怪獸','')}，牠需要「${f.need}」</summary>
    <p><b>先做</b>：${p.first}</p><p><b>可以說</b>：${p.say[age]}</p><p><b>避免</b>：${p.avoid}</p></details>`}

/* 大人先穩住（B1）：進冷靜站時，給大人的一句提醒，按一下就收起來 */
function renderAdultCue(){const el=$('#adultCue');if(!el)return;
  if(S.sos||S.cueDone){el.innerHTML='';return}
  el.innerHTML=`<div class="adultcue"><span>👀 大人：先深呼吸一次，蹲到孩子的高度，放慢說話。</span><button class="chip" id="cueOk">好了</button></div>`;
  $('#cueOk').onclick=()=>{S.cueDone=true;tone(520,.1);renderAdultCue()}}
