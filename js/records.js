/* 情緒紀錄、一週練習表、兌換券、成果 */
/* ---------- log ---------- */
function fmtT(t){const d=new Date(t);return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}
function monday(d=new Date()){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function dkey(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function logRange(){const r=S.logRange||'week';
  if(r==='week')return store.log.filter(l=>l.t>=monday().getTime());
  if(r==='lastweek'){const m=monday().getTime();return store.log.filter(l=>l.t>=m-7*864e5&&l.t<m)}
  if(r==='month')return store.log.filter(l=>l.t>=Date.now()-30*864e5);
  return store.log}
function summarize(L){
  if(!L.length)return null;
  const byE={};L.forEach(l=>byE[l.emo]=(byE[l.emo]||0)+1);
  const avg=(L.reduce((a,l)=>a+(l.lv0-l.lv2),0)/L.length).toFixed(1);
  const cc={};L.forEach(l=>{if(l.cause)cc[l.cause]=(cc[l.cause]||0)+1});
  const topC=Object.entries(cc).sort((a,b)=>b[1]-a[1])[0];
  const ae={};L.forEach(l=>l.acts.forEach(a=>{ae[a]=ae[a]||[0,0];ae[a][0]+=l.lv0-l.lv2;ae[a][1]++}));
  const best=Object.entries(ae).filter(x=>x[1][1]>=1).sort((a,b)=>b[1][0]/b[1][1]-a[1][0]/a[1][1])[0];
  return {byE,avg,topC,best,co:L.filter(l=>l.co).length,rep:L.filter(l=>l.repair).length}}
/* ---------- 週回顧（v16）：本週／上週，跟前一週比較 ---------- */
const DAYPART=[['早上',5,11],['中午',11,14],['下午',14,17],['傍晚',17,20],['晚上',20,29]];
function partOf(t){let h=new Date(t).getHours();if(h<5)h+=24;const p=DAYPART.find(x=>h>=x[1]&&h<x[2]);return p?p[0]:'晚上'}
function weekData(off){/* off=0 本週，1 上週，2 上上週 */
  const m=monday();m.setDate(m.getDate()-7*off);const a=m.getTime(),b=a+7*864e5;
  const days=[...Array(7)].map((_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return dkey(d)});
  const L=store.log.filter(l=>l.t>=a&&l.t<b);
  const W=store.wins.filter(w=>w.t>=a&&w.t<b);
  const moods={};store.moodLog.forEach(x=>{if(days.includes(x.d))moods[x.d]=x.m});
  const prac=days.filter(d=>store.pracLog.includes(d)).length;
  const play=days.filter(d=>store.playLog.includes(d)).length;
  const perDay=days.map(d=>L.filter(l=>dkey(new Date(l.t))===d));
  const avg=L.length?L.reduce((s,l)=>s+(l.lv0-l.lv2),0)/L.length:0;
  const big=L.filter(l=>l.lv0>=4).length;
  const parts={};L.forEach(l=>{const p=partOf(l.t);parts[p]=(parts[p]||0)+1});
  const topP=Object.entries(parts).sort((x,y)=>y[1]-x[1])[0];
  const plans={};L.forEach(l=>{if(l.plan)plans[l.plan]=(plans[l.plan]||0)+1});
  const topPlan=Object.entries(plans).sort((x,y)=>y[1]-x[1])[0];
  return {a,days,L,W,moods,prac,play,perDay,avg,big,topP,topPlan,sm:summarize(L)}}
function cmp(now,before,unit){/* 跟上週比的一句話，用中性的說法 */
  const d=Math.round((now-before)*10)/10;if(!d)return '跟上週一樣';
  return `比上週${d>0?'多':'少'} ${Math.abs(d)} ${unit}`}
function reviewHtml(off){
  const w=weekData(off),p=weekData(off+1);
  const who=(store.hero&&store.hero.name)||'你';const wd=['一','二','三','四','五','六','日'];
  const MO={};MOODS.forEach(x=>MO[x[1]]=x[0]);
  /* 給孩子看：只說做到的事，不比較、不扣分 */
  const kid=[];
  if(w.L.length){kid.push(`陪怪獸冷靜了 <b>${w.L.length}</b> 次`);
    if(w.avg>=0.5)kid.push(`怪獸平均變小了 <b>${w.avg.toFixed(1)}</b> 級`);
    if(w.sm.best)kid.push(`最有用的方法是「<b>${w.sm.best[0]}</b>」`);
    if(w.L.some(l=>l.co))kid.push('需要的時候會請大人幫忙，這也是勇氣');
    if(w.L.some(l=>l.repair))kid.push('做錯事會想辦法彌補');}
  if(w.W.length)kid.push(`做到了：${w.W.slice(0,4).map(x=>`<b>${x.text}</b>`).join('、')}`);
  if(w.prac)kid.push(`平時練習了 <b>${w.prac}</b> 天`);
  const mdays=Object.keys(w.moods).length;if(mdays)kid.push(`說出自己的心情 <b>${mdays}</b> 天`);
  const kidHtml=kid.length?`<ul class="rv-list">${kid.map(x=>`<li>${x}</li>`).join('')}</ul>`
    :`<p>${off?'上週':'這週'}還沒有用冷靜站。想練習的時候，隨時都可以來。</p>`;
  /* 七天一覽：心情＋冷靜次數 */
  const td=today();
  const strip=`<div class="rv-days">${w.days.map((d,i)=>{const n=w.perDay[i];
    return `<div class="${d===td?'today':''}"><small>${wd[i]}</small><span>${w.moods[d]?MO[w.moods[d]]||'·':'·'}</span>
      <em>${n.map(l=>`<i style="background:${EMO[l.emo].color}"></i>`).join('')||'&nbsp;'}</em></div>`}).join('')}</div>
    <p class="rv-key">上面是心情打卡，下面的圓點是用冷靜站（顏色＝哪隻怪獸）</p>`;
  /* 給大人看 */
  const ad=[];
  if(w.L.length||p.L.length){
    ad.push(`冷靜站 <b>${w.L.length}</b> 次（${cmp(w.L.length,p.L.length,'次')}）`);
    if(w.L.length)ad.push(`平均變小 <b>${w.avg.toFixed(1)}</b> 級${p.L.length?`（上週 ${p.avg.toFixed(1)} 級）`:''}`);
    if(w.big)ad.push(`開始時就很大（4–5 級）：${w.big} 次${p.L.length?`（上週 ${p.big} 次）`:''}`);}
  if(w.topP&&w.topP[1]>=2)ad.push(`比較常發生在<b>${w.topP[0]}</b>（${w.topP[1]} 次）`);
  if(w.topPlan)ad.push(`孩子選的「下次可以」：${w.topPlan[0]}`);
  ad.push(`平時練習 ${w.prac} 天、遊戲時間 ${w.play} 天、心情打卡 ${mdays} 天`);
  const adHtml=`<ul class="rv-list">${ad.map(x=>`<li>${x}</li>`).join('')}</ul>`+
    (w.L.length&&p.L.length&&w.L.length>p.L.length?'<p class="rv-key">次數變多不一定是變差，也可能是孩子更願意用冷靜站了；可以一起看看「平均變小」和「4–5 級」的次數。</p>':'');
  return `<div class="rv-kid"><b>🌟 ${who}${off?'上週':'這週'}做到的事</b>${kidHtml}</div>${strip}
    <div class="rv-adult"><b>📊 給大人看的重點</b>${adHtml}</div>`}
function reviewText(off){const w=weekData(off),p=weekData(off+1);const wd=['一','二','三','四','五','六','日'];
  const mdays=Object.keys(w.moods).length;
  let t=`【${off?'上週':'本週'}回顧】${fmtT(w.a).split(' ')[0]} 起\n`;
  t+=`冷靜站 ${w.L.length} 次（${cmp(w.L.length,p.L.length,'次')}）`+(w.L.length?`，平均變小 ${w.avg.toFixed(1)} 級`:'')+(w.big?`，開始時 4–5 級 ${w.big} 次`:'')+'\n';
  if(w.topP&&w.topP[1]>=2)t+=`比較常發生在${w.topP[0]}\n`;
  t+=`平時練習 ${w.prac} 天、遊戲時間 ${w.play} 天、心情打卡 ${mdays} 天\n`;
  t+='每天：'+w.days.map((d,i)=>`${wd[i]}${w.moods[d]?w.moods[d]:''}${w.perDay[i].length?`（冷靜站${w.perDay[i].length}次）`:''}`).join('、')+'\n\n';
  return t}
function renderLog(){
  S.logRange=S.logRange||'week';
  $('#logTabs').innerHTML=[['week','本週'],['lastweek','上週'],['month','近 30 天'],['all','全部']].map(([k,t])=>`<button class="chip ${S.logRange===k?'sel':''}" data-lr="${k}">${t}</button>`).join('');
  $$('[data-lr]').forEach(b=>b.onclick=()=>{S.logRange=b.dataset.lr;$('#logText').style.display='none';renderLog()});
  const L=logRange(),sm=summarize(L);
  const off={week:0,lastweek:1}[S.logRange];const rv=off===undefined?'':`<div class="review">${reviewHtml(off)}</div>`;
  $('#logRv').innerHTML=rv;$('#logRv').style.display=rv?'':'none';
  $('#logSum').style.display='';
  if(!sm){if(rv)$('#logSum').style.display='none';$('#logSum').innerHTML='這段時間還沒有冷靜站紀錄。用完冷靜站後會自動記錄。'+winsHtml();$('#logList').innerHTML='';return}
  const mx=Math.max(...Object.values(sm.byE));
  const bars=`<div class="bars">${Object.entries(sm.byE).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<div><span style="width:84px">${EMO[k].name}</span><b style="width:${n/mx*150}px;background:${EMO[k].color}"></b>${n}</div>`).join('')}</div>`;
  const topC=sm.topC?`<div>最常見的原因：<b>${sm.topC[0]}</b>（${sm.topC[1]} 次）</div>`:'';
  if(rv){$('#logSum').innerHTML=`<b>哪隻怪獸來了</b>${bars}${topC}`}else
  $('#logSum').innerHTML=`<b>共 ${L.length} 次</b>　平均怪獸變小 <b>${sm.avg}</b> 級
    ${bars}
    ${sm.topC?`<div>最常見的原因：<b>${sm.topC[0]}</b>（${sm.topC[1]} 次）</div>`:''}
    ${sm.best?`<div>效果最好的方法：<b>${sm.best[0]}</b>（平均變小 ${(sm.best[1][0]/sm.best[1][1]).toFixed(1)} 級）</div>`:''}
    ${sm.co?`<div>請大人陪伴：${sm.co} 次</div>`:''}${sm.rep?`<div>修復任務：${sm.rep} 次</div>`:''}`+winsHtml();
  $('#logList').innerHTML=L.map(l=>{const e=EMO[l.emo];return `<div class="logitem">
    <div class="top"><b><span class="cname" style="background:${e.color};margin:0 6px 0 0">${e.cname}</span>${e.name}</b><span style="color:var(--soft)">${fmtT(l.t)}</span></div>
    <div>大小：${l.lv0} → ${l.lv2}${l.co?'（大人陪伴）':''}</div>
    ${l.cause?`<div>原因：${l.cause}${l.want?`；想要：${l.want}`:''}</div>`:''}
    ${l.acts.length?`<div>用了：${l.acts.join('、')}</div>`:''}
    ${l.plan?`<div>下次：${l.plan}</div>`:''}${l.repair?`<div>修復：${l.repair}</div>`:''}
    ${l.rv&&l.rv.t?`<div class="rvdone">💬 回顧：${rvLine(l)}</div>`:''}<button class="chip rvchip" data-rv="${l.t}">💬 ${l.rv&&l.rv.t?'再回顧一次':'一起回顧'}</button>
    <textarea data-note="${l.t}" placeholder="大人備註（例如：在哪裡發生、怎麼結束的）">${l.note||''}</textarea></div>`}).join('');
  $$('[data-rv]').forEach(b=>b.onclick=()=>startReview(b.dataset.rv));
  $$('[data-note]').forEach(t=>t.onchange=()=>{const l=store.log.find(x=>x.t===+t.dataset.note);if(l){l.note=t.value;save()}});
}
function logAsText(){const L=logRange(),sm=summarize(L);
  const off={week:0,lastweek:1}[S.logRange];const rt=off===undefined?'':reviewText(off);
  if(!sm)return rt;
  const name={week:'本週',lastweek:'上週',month:'近 30 天',all:'全部'}[S.logRange];
  let t=rt+`情緒紀錄（${name}，共 ${L.length} 次，平均變小 ${sm.avg} 級）\n`;
  t+=Object.entries(sm.byE).map(([k,n])=>`${EMO[k].cname}${EMO[k].name} ${n} 次`).join('、')+'\n';
  const W=winsRange();if(W.length)t+=`做到的事：${W.map(w=>w.text).join('、')}\n`;
  if(sm.topC)t+=`最常見原因：${sm.topC[0]}\n`;if(sm.best)t+=`效果最好的方法：${sm.best[0]}\n`;
  t+='\n'+L.slice().reverse().map(l=>`${fmtT(l.t)}｜${EMO[l.emo].name} ${l.lv0}→${l.lv2}${l.co?'（大人陪伴）':''}`+(l.cause?`｜原因：${l.cause}`:'')+(l.acts.length?`｜用了：${l.acts.join('、')}`:'')+(l.plan?`｜下次：${l.plan}`:'')+(l.repair?`｜修復：${l.repair}`:'')+(l.rv&&l.rv.t?`｜回顧：${rvLine(l)}`:'')+(l.note?`｜備註：${l.note}`:'')).join('\n');
  return t}
$('#logCopy').onclick=async()=>{const t=logAsText();if(!t){toast('這段時間還沒有紀錄');return}
  try{await navigator.clipboard.writeText(t);toast('已複製，可以貼到 LINE 或 email')}
  catch(e){const ta=$('#logText');ta.style.display='';ta.value=t;ta.select();toast('請長按下方文字選取後複製')}};
let logArm=false;
$('#logClear').onclick=()=>{if(!logArm){logArm=true;$('#logClear').textContent='再按一次確認刪除（無法復原）';return}
  store.log=[];save();logArm=false;$('#logClear').textContent='刪除全部紀錄';renderLog()};

/* ---------- week practice ---------- */
const WTASKS={
  young:[['mood','情緒臉譜打卡','家園選心情',1],['prac','吹泡泡呼吸','平時練習',1],['game','遊戲時間','小遊戲或親子遊戲',1],['role','玩偶角色扮演','演一個情境'],['time','大人陪玩 15 分鐘','孩子決定玩什麼']],
  mid:[['mood','心情打卡','家園選心情',1],['prac','平時練習','任一個冷靜活動',1],['game','遊戲時間','小遊戲或親子遊戲',1],['role','角色扮演練習','演一個情境'],['time','特別時光 15 分鐘','孩子決定玩什麼']],
  old:[['mood','心情打卡','家園選心情',1],['prac','平時練習','任一個冷靜活動',1],['game','遊戲時間','小遊戲或親子遊戲',1],['write','寫或畫一句心情','用說的也可以'],['role','想一想 Plan B','練習一個情境'],['time','家人特別時光','15 分鐘不看手機']]
};
const ROLES=[['玩具被搶走','「這是我在玩的，請還給我。」或請大人幫忙'],['玩遊戲輸了','「好可惜！恭喜你，下次我再試試。」'],['想加入卻被拒絕','「好吧，那我先玩別的，等一下再問。」'],['排隊等很久','「換我了嗎？」然後數到 10'],['作品被說要修改','「我先改一小塊就好。」'],['積木被弄倒','「我很生氣，請不要碰我的積木。」'],['要收玩具了','「可以再一下下嗎？計時器響我就收。」']];
function weekInfo(){const m=monday(),key=dkey(m);if(store.week.key!==key)store.week={key,ticks:{},claimed:false};
  const days=[...Array(7)].map((_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return dkey(d)});
  const tasks=WTASKS[S.age||'mid'];
  const isDone=(t,d)=>t[3]?(t[0]==='mood'?store.moodLog.some(x=>x.d===d):t[0]==='game'?store.playLog.includes(d):store.pracLog.includes(d)):!!(store.week.ticks[t[0]]&&store.week.ticks[t[0]][d]);
  let doneCells=0,goodDays=0;
  days.forEach(d=>{const n=tasks.filter(t=>isDone(t,d)).length;doneCells+=n;if(n>=3)goodDays++});
  return {days,tasks,isDone,doneCells,goodDays}}
function renderWeek(){
  const w=weekInfo(),td=today();const wd=['一','二','三','四','五','六','日'];
  $('#wkTable').innerHTML=`<tr><th></th>${w.days.map((d,i)=>`<th class="${d===td?'today':''}">${wd[i]}</th>`).join('')}</tr>`+
    w.tasks.map(t=>`<tr><td class="tn">${t[1]}<small>${t[3]?'自動打勾':t[2]}</small></td>${w.days.map(d=>{const done=w.isDone(t,d),fut=d>td&&d!==td&&new Date(d.replace(/-/g,'/'))>new Date();
      return `<td><button class="cell ${done?'done':''} ${d===td&&!t[3]?'today':''} ${fut?'future':''}" ${d===td&&!t[3]?`data-tick="${t[0]}"`:''}>${done?'✓':''}</button></td>`}).join('')}</tr>`).join('');
  $$('[data-tick]').forEach(b=>b.onclick=()=>{const id=b.dataset.tick;store.week.ticks[id]=store.week.ticks[id]||{};
    if(store.week.ticks[id][td]){toast('今天這格已經完成囉');return}
    store.week.ticks[id][td]=true;save();gain('完成練習任務',2);renderWeek()});
  const goal=5;
  $('#wkSum').innerHTML=`本週完成 <b>${w.doneCells}</b> 格，有 <b>${w.goodDays}</b> 天完成 3 格以上。<br>目標：${goal} 天都完成 3 格以上，可以領 <b>+30 ⭐</b> 一週達成獎勵！`+
    (w.goodDays>=goal&&!store.week.claimed?`<div class="row"><button class="btn" id="wkClaim">領取 +30 ⭐</button></div>`:store.week.claimed?'<div>✅ 本週獎勵已領取</div>':'');
  const c=$('#wkClaim');if(c)c.onclick=()=>{store.week.claimed=true;save();gain('一週練習達成',30);renderWeek()};
  S.roleI=S.roleI||0;const r=ROLES[S.roleI%ROLES.length];
  $('#rolePlay').innerHTML=`<b>🎭 角色扮演題目</b>：${r[0]}<br>可以這樣說：${r[1]}<br><small>大人先演一次，再換孩子演；也可以用玩偶。</small><div class="row" style="margin-top:8px"><button class="btn small ghost" id="roleNext">換一題</button></div>`;
  $('#roleNext').onclick=()=>{S.roleI++;renderWeek()};
}

/* ---------- coupons ---------- */
const DEF_CPN=[{name:'多聽一本故事',cost:40},{name:'選今天晚餐的一道菜',cost:50},{name:'和爸媽玩桌遊 15 分鐘',cost:60},{name:'選一部家庭電影',cost:80},{name:'週末去公園玩',cost:100},{name:'當一天家庭小隊長',cost:120}];
function coupons(){return store.coupons&&store.coupons.length?store.coupons:DEF_CPN}
let cpnDraft=null;
function renderCpn(){cpnDraft=cpnDraft||coupons().map(c=>({...c}));
  $('#cpnList').innerHTML=cpnDraft.map((c,i)=>`<div class="cpn"><input class="nm" data-cn="${i}" value="${c.name.replace(/"/g,'&quot;')}" maxlength="20"><input class="pr" type="number" min="1" data-cp="${i}" value="${c.cost}"><span>⭐</span><button class="chip" data-cd="${i}">刪除</button></div>`).join('')
    +`<p class="note">例子：多講一個故事、晚 10 分鐘睡覺、選週末活動、跟爸爸單獨約會、邀朋友來家裡玩。</p>`;
  $$('[data-cn]').forEach(x=>x.oninput=()=>cpnDraft[+x.dataset.cn].name=x.value);
  $$('[data-cp]').forEach(x=>x.oninput=()=>cpnDraft[+x.dataset.cp].cost=Math.max(1,parseInt(x.value)||1));
  $$('[data-cd]').forEach(x=>x.onclick=()=>{cpnDraft.splice(+x.dataset.cd,1);renderCpn()});
}
$('#cpnAdd').onclick=()=>{cpnDraft.push({name:'新的兌換券',cost:50});renderCpn()};
$('#cpnSave').onclick=()=>{store.coupons=cpnDraft.filter(c=>c.name.trim()).map(c=>({name:c.name.trim(),cost:c.cost}));save();cpnDraft=null;toast('兌換券已儲存');go(11);S.shopCat='reward';renderShop()};

/* ---------- wins (10-min routine closing) ---------- */
function winsRange(){const r=S.logRange||'week';const m=monday().getTime();
  return store.wins.filter(w=>r==='week'?w.t>=m:r==='lastweek'?(w.t>=m-7*864e5&&w.t<m):r==='month'?w.t>=Date.now()-30*864e5:true)}
function winsHtml(){const W=winsRange();return W.length?`<div style="margin-top:6px">🌟 做到的事：${W.map(w=>`<b>${w.text}</b>`).join('、')}</div>`:''}

