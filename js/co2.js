/* v54 陪伴模式（4–5 級）分流：先看孩子「能不能互動」，再看身體需要
   參考（只借概念、自己改寫）：AAP 調節→連結→思考；不要求先停止哭，用「能不能互動」分流。
   載入在 flow2.js 後面；再包一層 renderCo()（adult2.js 已經包過一層）。 */

Object.assign(CICO,{
  cup:C=>`<ellipse cx="30" cy="58" rx="17" ry="2.8" fill="#6E8C9C" opacity=".16"/>
    <path d="M14 20 H44 L41 52 Q40 56 36 56 H22 Q18 56 17 52 Z" fill="${C.v('#CDE8F6',.3,-.1)}" stroke="#8DBFDD" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M16.5 30 H41.5 L39.6 51 Q39 54 36 54 H22 Q19 54 18.4 51 Z" fill="${C.v('#8FCDEB',.25,-.1)}" opacity=".85"/>
    <path d="M44 26 Q54 26 53 35 Q52 43 42 43" fill="none" stroke="#8DBFDD" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="22" cy="25" rx="3" ry="1.4" fill="#fff" opacity=".7"/><ellipse cx="21" cy="40" rx="1.6" ry="5" fill="#fff" opacity=".45"/>`,
  hug:C=>`<ellipse cx="32" cy="58" rx="18" ry="3" fill="#B98A4E" opacity=".16"/>
    <path d="M32 50 C16 39 11 29 16 21 C20 15 28 16 32 23 C36 16 44 15 48 21 C53 29 48 39 32 50 Z" fill="${C.g('#FFB4A8',.45,-.14)}" stroke="#E98E80" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="22" cy="23" rx="4.5" ry="2.4" transform="rotate(-30 22 23)" fill="#fff" opacity=".55"/>
    <path d="M6 30 Q10 46 30 47" fill="none" stroke="${C.v('#FFD7B8',.2,-.1)}" stroke-width="7" stroke-linecap="round"/>
    <path d="M58 30 Q54 46 34 47" fill="none" stroke="${C.v('#FFD7B8',.2,-.1)}" stroke-width="7" stroke-linecap="round"/>`
});

const CO_CAN=['能點頭、指圖，或用短短的話說想要什麼','能接受大人在旁邊，或清楚表示要空間','聽得進一句短短的話，不會更激動'];
/* 孩子看的選擇卡：[id, 圖示, 字, 唸出來的話, 給大人] */
const CO_KID=[
  ['near','heart','陪我','好，我就在你旁邊。','坐在旁邊就好，不用說話。'],
  ['space','breeze','給我一點空間','好，我在附近等你。','退開一點，待在看得到的地方；孩子安全就好。'],
  ['hug','hug','抱一下','好，來抱抱。','孩子靠過來再抱；抱緊一點、慢慢呼吸。孩子推開就放開。'],
  ['water','cup','喝口水','好，我們去喝口水。','陪孩子去喝水或洗把臉，換個地方也會慢下來。']];
/* 身體需要：[字, 給大人] */
const CO_BODY=[
  ['餓了','先吃點東西、喝水，事情等吃完再說。'],
  ['累了、想睡','先休息。重要的事明天精神好的時候再談。'],
  ['哪裡痛','先看看哪裡痛、處理身體，情緒常常跟著小一點。'],
  ['太吵','帶到安靜的地方，關掉聲音，大人也放低音量。'],
  ['太亮、太多東西','調暗燈光、收起畫面，讓眼睛休息。'],
  ['太多人、太擠','帶到人少的地方，請旁人先離開一下。'],
  ['太熱','到涼一點的地方，脫件外套、洗把臉。']];

const _resetFlowCo=resetFlow;
resetFlow=function(){_resetFlowCo();S.coOk=[];S.coKid=null;S.coBody=[]};

const _renderCoGate=renderCo;
renderCo=function(){_renderCoGate();
  S.coOk=S.coOk||[];S.coBody=S.coBody||[];
  let kid=$('#coKid');if(!kid){kid=document.createElement('div');kid.id='coKid';$('#coWord').after(kid)}
  let gate=$('#coGate');if(!gate){gate=document.createElement('div');gate.id='coGate';$('.adult .adult-head').nextElementSibling.after(gate)}
  drawCoGate()};

function coCan(){return S.coOk.length===CO_CAN.length}
function drawCoGate(){const can=coCan();
  $('#coGate').innerHTML=`<h4>先看一下：孩子現在能不能互動？</h4>
    <div class="cogate">${CO_CAN.map((t,i)=>`<button class="cocan ${S.coOk.includes(i)?'on':''}" data-can="${i}"><i>✓</i>${t}</button>`).join('')}</div>
    <div class="costate ${can?'go':'wait'}">${can
      ?'<b>可以試著說一句話了</b>先說你看到的，再猜一猜，讓孩子修正：「我看到＿＿。你可能覺得＿＿，也可能不是，你可以告訴我。」上面的畫面也給孩子四個選擇。'
      :'<b>還不行也沒關係：繼續陪著</b>少說話、少要求。不用強迫孩子呼吸、抱抱或回答，也不用先讓他停止哭。孩子拒絕或更激動，就退回來，安靜陪著。'}</div>
    <h4>身體需要先照顧嗎？（看起來像的都可以點）</h4>
    <div class="chips cobody">${CO_BODY.map(([t],i)=>`<button class="chip ${S.coBody.includes(i)?'sel':''}" data-cob="${i}">${t}</button>`).join('')}</div>
    <div class="cobodytips">${S.coBody.map(i=>`<div><b>${CO_BODY[i][0]}</b>：${CO_BODY[i][1]}</div>`).join('')}</div>`;
  $$('[data-can]').forEach(b=>b.onclick=()=>{const i=+b.dataset.can,k=S.coOk.indexOf(i);k>=0?S.coOk.splice(k,1):S.coOk.push(i);tone(520,.1);drawCoGate()});
  $$('[data-cob]').forEach(b=>b.onclick=()=>{const i=+b.dataset.cob,k=S.coBody.indexOf(i);k>=0?S.coBody.splice(k,1):S.coBody.push(i);tone(560,.1);drawCoGate()});
  drawCoKid()}
function drawCoKid(){const el=$('#coKid');if(!el)return;
  if(!coCan()){el.innerHTML='';return}
  const sel=CO_KID.find(c=>c[0]===S.coKid);
  el.innerHTML=`<p class="cokidq">你現在想要……</p>
    <div class="cokid">${CO_KID.map(([id,ic,t])=>`<button class="pick ${S.coKid===id?'sel':''}" data-ck="${id}"><i>${clayIcon(ic,54)}</i><b>${t}</b></button>`).join('')}</div>
    ${sel?`<p class="cokidtip">👀 大人：${sel[4]}</p>`:''}`;
  $$('[data-ck]').forEach(b=>b.onclick=()=>{S.coKid=b.dataset.ck;const c=CO_KID.find(x=>x[0]===S.coKid);tone(560,.12);speak(c[3]);drawCoKid()})}
