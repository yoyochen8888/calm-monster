/* 正向情緒夥伴（v25）：開心、驕傲、安心、好奇、感謝。
   怪獸要「冷靜」，夥伴要「品味」：認出來 → 身體的感覺 → 發生了什麼 → 好好記住 → 放進快樂寶盒或說給家人聽。
   情緒沒有好壞，怪獸和夥伴都住在家園裡。 */
const JOY={
  happy:{name:'開心夥伴',short:'開心',cname:'暖黃色',color:'#FFC94D',feel:'好開心',body:'嘴巴笑笑、身體輕輕的、想跳起來',
    whats:['跟家人一起玩','跟朋友玩','吃到好吃的','出去玩','聽到好消息','收到禮物'],
    say:{young:'「你笑得好開心！是什麼讓你這麼開心呀？」',mid:'「看到你這麼開心，我也好開心。可以多說一點嗎？」',old:'「這件事讓你很開心吧？你最喜歡的是哪個部分？」'}},
  proud:{name:'驕傲夥伴',short:'驕傲',cname:'橘金色',color:'#F4A042',feel:'好驕傲，我做到了',body:'抬頭挺胸、心裡滿滿的',
    whats:['自己完成一件事','練習很久終於會了','幫了別人','說出自己的想法','沒有放棄','情緒來了也有照顧好自己'],
    say:{young:'「你做到了！你自己覺得怎麼樣？」',mid:'「你一直練習，終於做到了。你是怎麼辦到的？」',old:'「你對自己很滿意吧？這是你自己努力換來的。」'}},
  safe:{name:'安心夥伴',short:'安心',cname:'薄荷綠',color:'#79D1AE',feel:'好安心、好放鬆',body:'肩膀鬆鬆的、呼吸慢慢的',
    whats:['被抱抱','待在家裡','跟喜歡的人在一起','蓋著軟軟的被子','擔心的事解決了','有人陪我'],
    say:{young:'「你現在覺得好安心，對不對？我們一起慢慢呼吸。」',mid:'「這種安心、放鬆的感覺很好。你覺得是什麼讓你這麼安心？」',old:'「記住這種安心的感覺，緊張的時候可以想起它。」'}},
  curious:{name:'好奇夥伴',short:'好奇',cname:'天空藍',color:'#7CC4F2',feel:'好好奇，想知道更多',body:'眼睛亮亮的、想靠近看看',
    whats:['發現新東西','看到小動物','學到新知識','想試試看新的事','問了一個好問題','讀到有趣的書'],
    say:{young:'「哇，你發現了什麼？帶我看看！」',mid:'「你好想知道喔！我們一起找找答案。」',old:'「這個問題很棒。你覺得可以怎麼查、怎麼試試看？」'}},
  grateful:{name:'感謝夥伴',short:'感謝',cname:'櫻花粉',color:'#F59AB8',feel:'好感謝，心裡暖暖的',body:'心裡暖暖的、想說謝謝',
    whats:['有人幫了我','收到關心','家人照顧我','朋友跟我分享','老師教我','有人陪著我'],
    say:{young:'「你覺得好謝謝他，心裡暖暖的。要不要去跟他說謝謝？」',mid:'「你注意到別人對你的好，這很棒。你想怎麼謝謝他？」',old:'「感謝的感覺可以說出來或寫下來，對方一定會很開心。」'}}
};
/* 依年齡顯示（跟怪獸一樣，已經一起品味過的夥伴一定會顯示） */
const AGE_JOY={young:['happy','proud','safe'],mid:['happy','proud','safe','curious'],old:Object.keys(JOY)};
const JOY_BODY=['嘴巴笑笑的','心裡暖暖的','身體輕輕的','想跳起來','肩膀鬆鬆的','眼睛亮亮的','想抱抱別人','呼吸慢慢的','說不出來'];
const JOY_DAY_MAX=2;/* 每天前 2 次有星星，之後一樣可以存，只是不給星星（不鼓勵為了星星硬找開心） */
function jxpOf(k){return (store.jxp&&store.jxp[k])||0}
function visibleJoy(){const base=AGE_JOY[S.age||'mid']||AGE_JOY.mid;return Object.keys(JOY).filter(k=>base.includes(k)||jxpOf(k)>0)}
function joyLog(){return Array.isArray(store.joyLog)?store.joyLog:(store.joyLog=[])}

/* 夥伴的圖：先用程式畫的黏土版（之後可以換成生成圖），一樣隨等級長大、變成熟 */
function friend(k,size=110,cls='',opt={}){const e=JOY[k];const lv=opt.level||lvOf(jxpOf(k));const g=stageOf(lv);
  const w=136*STAGES[g-1].s,x=60-w/2,y=124-w;
  const spark=(sx,sy,r)=>`<path d="M${sx} ${sy-r} L${sx+r*.3} ${sy-r*.3} L${sx+r} ${sy} L${sx+r*.3} ${sy+r*.3} L${sx} ${sy+r} L${sx-r*.3} ${sy+r*.3} L${sx-r} ${sy} L${sx-r*.3} ${sy-r*.3} Z" fill="#FFD166"/>`;
  const sparks=lv>=3?spark(2,34,7)+spark(118,46,6)+(lv>=4?spark(110,110,5)+spark(6,100,5):''):'';
  const aura=lv>=5?`<ellipse cx="60" cy="62" rx="62" ry="60" fill="none" stroke="#FFD166" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`:'';
  return `<svg class="mon ${cls}" width="${size}" height="${size}" viewBox="-8 -22 136 150" aria-label="${e.name} ${STAGES[g-1].n}">${aura}
    <ellipse cx="60" cy="121" rx="${w*.36}" ry="5" fill="${e.color}" opacity=".18"/>${clayMon(e.color,x,y,w,0,k)}${sparks}</svg>`}

/* ---------- 品味流程（step 28） ---------- */
function startJoy(k){S.jy={i:k?1:0,k:k||null,body:[],what:'',note:'',how:''};go(28)}
function joyStarsToday(){const d=today();if(!store.joyDay||store.joyDay.d!==d)store.joyDay={d,n:0};return store.joyDay.n}
function renderJoy(){const R=S.jy;if(!R){go(10,true);return}
  const A=$('#jyArea'),nav=$('#jyNav'),age=S.age||'mid';const e=R.k?JOY[R.k]:null;
  $('#jyDots').innerHTML=[1,2,3].map(i=>`<i class="${R.i===i?'on':''}"></i>`).join('');
  $('#jyDots').style.visibility=R.i>=1&&R.i<=3?'visible':'hidden';
  const next=(label='下一步')=>`<button class="btn" id="jyNext">${label}</button>`;
  const back=`<button class="btn ghost" id="jyBack">上一步</button>`;
  const speakBtn=`<button class="speak" id="jySpeak">🔊 唸給我聽</button>`;
  let say='';
  if(R.i===0){
    $('#jyTitle').textContent='是哪一個情緒夥伴來了？';$('#jyHint').textContent='好的感覺也值得被看見，點一個最像你的';say='是哪一個情緒夥伴來了？';
    A.innerHTML=`<div class="grid g3">${visibleJoy().map(k=>`<button class="pick ${R.k===k?'sel':''}" data-jk="${k}">${friend(k,80)}<b>${JOY[k].short}</b><span>${JOY[k].feel}</span></button>`).join('')}</div>`;
    $$('[data-jk]').forEach(b=>b.onclick=()=>{R.k=b.dataset.jk;R.i=1;tone(660,.12);speak('我是'+JOY[R.k].name);renderJoy()});
    nav.innerHTML=`<button class="btn ghost" id="jyHome">回家園</button>`;$('#jyHome').onclick=()=>go(10);
  } else if(R.i===1){
    $('#jyTitle').textContent='身體有什麼感覺？';$('#jyHint').textContent='可以選好幾個';say=`${e.name}來了！你的身體有什麼感覺？`;
    A.innerHTML=`<div class="rvmon">${friend(R.k,110,'wobble')}</div><p class="hint" style="margin-bottom:10px">${e.name}來的時候，常常會：${e.body}</p>
      <div class="chips">${JOY_BODY.map(c=>`<button class="chip ${R.body.includes(c)?'sel':''}" data-jb="${c}">${c}</button>`).join('')}</div>`;
    $$('[data-jb]').forEach(b=>b.onclick=()=>{const c=b.dataset.jb,i=R.body.indexOf(c);i>=0?R.body.splice(i,1):R.body.push(c);tone(620,.1);renderJoy()});
    nav.innerHTML=back+speakBtn+next();
  } else if(R.i===2){
    $('#jyTitle').textContent='發生了什麼事？';$('#jyHint').textContent=`是什麼讓${e.short}夥伴來找你？`;say=`發生了什麼事？是什麼讓${e.short}夥伴來找你？`;
    A.innerHTML=`<div class="chips">${e.whats.map(c=>`<button class="chip ${R.what===c?'sel':''}" data-jw="${c}">${c}</button>`).join('')}</div>
      <p class="hint" style="margin:14px 0 6px">${age==='young'?'想多說一點的話，請大人幫你寫下來':'想多寫一點也可以（大人也可以幫忙寫）'}</p>
      <textarea id="jyNote" maxlength="120" placeholder="例如：今天跟爸爸去公園，盪鞦韆盪好高" style="width:100%;min-height:64px;border-radius:12px;border:2px solid var(--line);padding:10px;font:inherit;font-size:.95rem">${R.note}</textarea>`;
    $$('[data-jw]').forEach(b=>b.onclick=()=>{R.what=R.what===b.dataset.jw?'':b.dataset.jw;R.note=$('#jyNote').value;tone(620,.1);renderJoy()});
    $('#jyNote').oninput=ev=>{R.note=ev.target.value};
    nav.innerHTML=back+speakBtn+next();
  } else if(R.i===3){
    $('#jyTitle').textContent='把這個感覺好好記住';$('#jyHint').textContent='閉上眼睛，想著那個畫面，跟著光慢慢呼吸三次';
    say='閉上眼睛，想著那個畫面。跟著光，慢慢吸氣，慢慢吐氣。';
    const what=R.note.trim()||R.what;
    A.innerHTML=`<div class="jysavor" style="--jc:${e.color}"><div class="jyglow"></div><div class="jymon">${friend(R.k,120)}</div></div>
      ${what?`<p class="rvgood">「${esc(what)}」</p>`:''}
      <p class="hint" style="margin-top:10px">記住了嗎？想把它放在哪裡？</p>
      <div class="grid g2"><button class="pick" data-jh="box"><b>🎁 放進快樂寶盒</b><span>以後可以打開來看</span></button>
        <button class="pick" data-jh="tell"><b>💬 說給家人聽</b><span>開心分享出去會變更大</span></button></div>`;
    $$('[data-jh]').forEach(b=>b.onclick=()=>{R.how=b.dataset.jh;R.i=4;renderJoy();window.scrollTo({top:0,behavior:'smooth'})});
    nav.innerHTML=back+speakBtn;
  } else {
    /* 存起來、給星星、夥伴成長 */
    const what=R.note.trim()||R.what;
    joyLog().push({t:Date.now(),k:R.k,body:R.body.slice(),what:R.what,note:R.note.trim(),how:R.how});
    store.joyLog=joyLog().slice(-200);
    const n=joyStarsToday();let up='';
    if(n<JOY_DAY_MAX){store.joyDay.n++;store.jxp=store.jxp||{};const l0=lvOf(jxpOf(R.k));store.jxp[R.k]=jxpOf(R.k)+4;const l1=lvOf(store.jxp[R.k]);
      gain(R.how==='tell'?'說出開心的事':'把好感覺存起來',4);
      if(l1>l0)up=`<div class="levelup">🎉 ${e.name}升到 <b>Lv.${l1}「${TITLES[l1-1]}」</b>${stageOf(l1)>stageOf(l0)?`<br><small>✨ 長大成「${STAGES[stageOf(l1)-1].n}」</small><div class="evo">${friend(R.k,70,'',{level:l0})}<b>➜</b>${friend(R.k,96,'wobble',{level:l1})}</div>`:''}</div>`}
    else save();
    chime();
    $('#jyTitle').textContent=R.how==='tell'?'去說給家人聽吧！':'放進快樂寶盒了';
    $('#jyHint').textContent=R.how==='tell'?'說完也會留在快樂寶盒裡':`快樂寶盒裡已經有 ${joyLog().length} 個好時刻`;
    say=R.how==='tell'?'去說給家人聽吧！':'放進快樂寶盒了。';
    A.innerHTML=`<div class="rvmon">${friend(R.k,120,'wobble')}</div>
      <p class="rvgood">${e.name}說：「謝謝你注意到我！」${what?`<br><small>${esc(what)}</small>`:''}</p>${up}
      ${n>=JOY_DAY_MAX?'<p class="note" style="text-align:center">今天的開心星星拿滿了，好時刻一樣有存起來喔。</p>':''}
      <div class="gdetail"><b>給大人</b>：可以這樣回應：${e.say[age]}<br>・跟著孩子一起開心就好，不用加上「所以以後要……」<br>・問「你最喜歡哪個部分？」可以讓好感覺留得更久</div>`;
    nav.innerHTML=`<button class="btn ghost" id="jyBox">看快樂寶盒</button><button class="btn" id="jyHome">回家園</button>`;
    $('#jyBox').onclick=()=>go(29);$('#jyHome').onclick=()=>go(10);
    S.jy=null;speak(say);return;
  }
  const sp=$('#jySpeak');if(sp)sp.onclick=()=>speak(say);
  const nx=$('#jyNext');if(nx)nx.onclick=()=>{R.i++;renderJoy();window.scrollTo({top:0,behavior:'smooth'})};
  const bk=$('#jyBack');if(bk)bk.onclick=()=>{R.i=R.k&&R.i===1?0:R.i-1;renderJoy()};
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

/* ---------- 快樂寶盒（step 29）：存起來的好時刻，可以打開來再看一次 ---------- */
/* 勇氣時刻（v30）用怪獸的圖；其他用夥伴 */
function joyLabel(j){return j.k==='brave'?'勇氣':(JOY[j.k]||JOY.happy).short}
function joyPic(j,size){return j.k==='brave'&&EMO[j.emo]?monster(j.emo,size):friend(JOY[j.k]?j.k:'happy',size)}
function joyColor(j){return j.k==='brave'&&EMO[j.emo]?EMO[j.emo].color:(JOY[j.k]||JOY.happy).color}
function joyLine(j){return [j.note||j.what,j.body&&j.body.length?`身體：${j.body.join('、')}`:''].filter(Boolean).join('｜')||'（沒有寫，但有好好記住）'}
function renderJoyBox(){const L=joyLog().slice().reverse();
  const nb=L.filter(j=>j.k==='brave').length;
  $('#jbSub').textContent=L.length?`裡面有 ${L.length-nb} 個好時刻、${nb} 個勇氣時刻。難過或睡前的時候，也可以打開來看看。`:'還是空的。開心、驕傲、安心的時候，或陪怪獸冷靜之後，來把它存起來吧！';
  $('#jbList').innerHTML=L.slice(0,60).map(j=>`<button class="jbitem" data-jt="${j.t}" style="--jc:${joyColor(j)}">${joyPic(j,46)}<span><b>${j.k==='brave'?'💪 ':''}${joyLabel(j)}・${rvWhen(j.t)}</b>${esc(joyLine(j))}</span></button>`).join('');
  $$('[data-jt]').forEach(b=>b.onclick=()=>{const j=joyLog().find(x=>x.t===+b.dataset.jt);if(!j)return;
    speak(j.k==='brave'?`${rvWhen(j.t)}，你很勇敢。${j.what}`:`${rvWhen(j.t)}，${joyLabel(j)}夥伴來過。${j.note||j.what||''}`);b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop')});
}
$('#jbNew').onclick=()=>startJoy();
/* 冷靜站第一頁的入口：不算一次冷靜站 */
$('#toJoy').onclick=()=>{if(store.day&&store.day.n>0)store.day.n--;save();startJoy()};

/* ---------- 圖鑑裡的情緒夥伴 ---------- */
function renderJoyDex(){const box=$('#jdex');if(!box)return;
  box.innerHTML=visibleJoy().map(k=>{const e=JOY[k],xp=jxpOf(k),l=lvOf(xp),nx=nextOf(xp);
    return `<button class="pick" data-jd="${k}">${friend(k,80)}<b>${e.name}</b>
      <span class="lvtag">Lv.${l} ${TITLES[l-1]}</span><div class="xpbar"><i style="width:${nx.pct}%"></i></div><span class="lvtag">${e.feel}</span></button>`}).join('');
  $$('[data-jd]').forEach(b=>b.onclick=()=>startJoy(b.dataset.jd));
  $('#jbOpen').querySelector('span').textContent=`存起來的好時刻：${joyLog().length} 個`;
}
$('#jbOpen').onclick=()=>go(29);

/* ---------- 週回顧用：這週的好時刻 ---------- */
function joyWeek(a){const b=a+7*864e5;return joyLog().filter(j=>j.t>=a&&j.t<b)}
