/* 願望罐（v23）：練習延遲滿足。
   孩子先選一張兌換券當願望，看著罐子慢慢裝滿；想買別的東西時，會先看到「願望要再等多久」，自己決定。
   等待不會多給星星（避免變成算計），而是被看見：等了幾天會記在「做到的事」。 */
function wishNow(){const w=store.wish;if(!w)return null;
  const c=coupons().find(x=>x.name===w.name);if(!c){store.wish=null;save();return null}
  w.cost=c.cost;return w}
function wishDays(w){return Math.max(0,Math.floor((Date.now()-(w.t||Date.now()))/864e5))}
function jarSvg(pct,size=92){const C=Clay('wj'),p=Math.max(0,Math.min(1,pct)),top=34,bot=104,y=bot-(bot-top)*p;
  const star=(x,yy,r,rot)=>{let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5+rot,rr=i%2?r*.48:r;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(yy+Math.sin(a)*rr).toFixed(1)}return `<path d="${d}Z" fill="#FFCB45" stroke="#EBA91F" stroke-width=".9" stroke-linejoin="round"/>`};
  const spots=[[36,97,.2],[52,98,-.3],[66,96,.5],[44,86,-.1],[60,85,.3],[30,84,.6],[72,83,-.4],[50,74,.1],[38,71,-.5],[64,72,.4],[32,60,.2],[56,61,-.2],[70,59,.5],[44,49,-.3],[60,47,.1],[34,44,.4]];
  const n=Math.round(spots.length*p);
  return `<svg class="jar ${p>=1?'full':''}" width="${size}" height="${size*1.15}" viewBox="0 0 100 115">${C.defs()}
    <ellipse cx="50" cy="109" rx="30" ry="4" fill="#6B4A35" opacity=".12"/>
    <clipPath id="wjclip"><rect x="22" y="28" width="56" height="78" rx="18"/></clipPath>
    <rect x="22" y="28" width="56" height="78" rx="18" fill="#EAF6FB"/>
    <g clip-path="url(#wjclip)"><rect x="22" y="${y.toFixed(1)}" width="56" height="${(bot-y+4).toFixed(1)}" fill="#FFE9A0" opacity=".55"/>${spots.slice(0,n).map(s=>star(s[0],s[1],7.5,s[2])).join('')}</g>
    <rect x="22" y="28" width="56" height="78" rx="18" fill="none" stroke="#BFDDEA" stroke-width="3"/>
    <rect x="28" y="36" width="6" height="40" rx="3" fill="#fff" opacity=".7"/>
    <rect x="28" y="16" width="44" height="14" rx="6" fill="${C.v('#E6A57E',.25)}" ${C.sh}/><rect x="33" y="19" width="16" height="3" rx="1.5" fill="#fff" opacity=".4"/></svg>`}
function renderWishCard(){const box=$('#wishBox');if(!box)return;if(S.decor||isNight()){box.innerHTML='';return}
  const w=wishNow(),st=store.stars||0;
  if(!w){box.innerHTML=`<div class="wishcard"><div class="wj">${jarSvg(0,56)}</div><div class="wt"><b>🫙 願望罐</b><span>選一個最想換的願望，把星星慢慢存起來。</span></div><div class="wb"><button class="btn small" id="wPick">選願望</button></div></div>`;
    $('#wPick').onclick=()=>{S.shopCat='reward';go(11)};return}
  const full=st>=w.cost,d=wishDays(w);
  box.innerHTML=`<div class="wishcard ${full?'full':''}"><div class="wj">${jarSvg(st/w.cost,72)}</div>
    <div class="wt"><b>🫙 我的願望：${w.name}</b>
      <span>${full?(w.hold===today()?'罐子裝滿了，想換的時候再換。願意等，也是一種力量 💛':'罐子裝滿了！你一顆一顆存到了。'):`已經存了 ${Math.min(st,w.cost)} 顆，還差 <b>${w.cost-st}</b> 顆。慢慢來，不用急。`}${d>=1?`<br><small>已經為這個願望存了 ${d} 天</small>`:''}</span></div>
    <div class="wb">${full?`<button class="btn small" id="wGet">現在換</button>${w.hold===today()?'':`<button class="chip" id="wHold">再等等</button>`}`:`<button class="chip" id="wChange">換一個願望</button>`}</div></div>`;
  const g=$('#wGet');if(g)g.onclick=()=>{redeemCoupon({name:w.name,cost:w.cost});renderHome()};
  const h=$('#wHold');if(h)h.onclick=()=>{w.hold=today();save();tone(520,.2);renderWishCard()};
  const c=$('#wChange');if(c)c.onclick=()=>{S.shopCat='reward';go(11)};}
function setWish(c){store.wish={name:c.name,cost:c.cost,t:Date.now()};save();tone(660,.15);toast(`願望罐的願望：${c.name} 🫙<br>回家園可以看到罐子`)}
function redeemCoupon(c){if(store.stars<c.cost)return;const w=store.wish;
  store.stars-=c.cost;store.vouchers.push({id:Date.now(),name:c.name});
  let extra='';
  if(w&&w.name===c.name){const d=wishDays(w);if(d>=1){store.wins.push({t:Date.now(),text:`為了願望等了 ${d} 天`});extra=`<br>你為了這個願望等了 ${d} 天，好有耐心！`}store.wish=null}
  save();chime();toast(`換到「${c.name}」！拿給大人看，請大人兌現${extra}`,true)}
/* 想買別的東西、而且買了之後願望會變遠：先讓孩子看到，再自己決定 */
function wishGuard(name,cost,fn){const w=wishNow();
  if(!w||w.name===name||store.stars-cost>=w.cost){fn();return}
  const after=w.cost-(store.stars-cost),now=Math.max(0,w.cost-store.stars);
  const ov=document.createElement('div');ov.className='wishov';
  ov.innerHTML=`<div class="wishask"><div class="wj">${jarSvg(store.stars/w.cost,84)}</div>
    <p><b>想一想再決定</b></p>
    <p>「${name}」要 ${cost} 顆星星。<br>買了之後，願望「${w.name}」${now?`會從還差 ${now} 顆，變成`:'本來已經存夠了，會變成'}還差 <b>${after}</b> 顆。</p>
    <p class="note">兩個選擇都可以，沒有對或錯。</p>
    <div class="row"><button class="btn" id="wKeep">先存願望</button><button class="btn ghost" id="wBuy">還是要買</button></div></div>`;
  document.body.appendChild(ov);
  ov.querySelector('#wKeep').onclick=()=>{ov.remove();tone(520,.2);toast('你選擇先等一等，願望罐還在慢慢變滿 💛')};
  ov.querySelector('#wBuy').onclick=()=>{ov.remove();fn()};}
