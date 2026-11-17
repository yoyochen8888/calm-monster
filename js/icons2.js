/* v42：圖示統一（第二批黏土圖示）
   今天心情、遊戲區、安靜觀察、商店的家園物品，原本用系統表情符號，每台裝置長得不一樣。
   這裡換成自己畫的黏土圖示（跟 icons.js 同一種畫法：左上亮、右下暗、軟陰影）；
   家園物品直接用院子裡真的那張生成圖，買到什麼就看到什麼。畫不出來時 emoji 會留著。 */

/* 今天心情：同一張圓臉，換顏色和表情 */
function moodFace(C,col,edge,eyes,mouth,extra=''){return `<ellipse cx="32" cy="58" rx="15" ry="2.8" fill="#B98A4E" opacity=".16"/>
  <circle cx="32" cy="32" r="23" fill="${C.g(col,.42,-.14)}" stroke="${edge}" stroke-width="1.6"/>
  <ellipse cx="23" cy="20" rx="7" ry="3.6" transform="rotate(-30 23 20)" fill="#fff" opacity=".55"/>
  <circle cx="19.5" cy="38" r="3.6" fill="#FF9A8A" opacity=".42"/><circle cx="44.5" cy="38" r="3.6" fill="#FF9A8A" opacity=".42"/>
  <g fill="none" stroke="#5C4A3D" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${eyes}${mouth}</g>${extra}`}
const DOT='#5C4A3D';
Object.assign(CICO,{
  m_happy:C=>moodFace(C,'#FFD45E','#EBB12A','<path d="M21 29 q3.5 -4 7 0 M36 29 q3.5 -4 7 0"/>','<path d="M24 38 q8 8 16 0"/>'),
  m_calm:C=>moodFace(C,'#A8DCC5','#74BFA2','<path d="M21 30 q3.5 3 7 0 M36 30 q3.5 3 7 0"/>','<path d="M27 39 q5 3.4 10 0"/>'),
  m_sad:C=>moodFace(C,'#B9D3F2','#86AEDF','<path d="M21 28.6 q3 -2.6 6 -3.6 M43 28.6 q-3 -2.6 -6 -3.6"/><circle cx="24.5" cy="32" r="1.6" fill="'+DOT+'"/><circle cx="39.5" cy="32" r="1.6" fill="'+DOT+'"/>','<path d="M26 42 q6 -5 12 0"/>',
    `<path d="M41.5 35.5 q-2.6 3.8 0 5.4 q2.6 -1.6 0 -5.4 Z" fill="#7FB4EE"/>`),
  m_angry:C=>moodFace(C,'#F8B9AE','#E8907F','<path d="M20 26 l8 3.4 M44 26 l-8 3.4"/><circle cx="24.5" cy="32.5" r="1.8" fill="'+DOT+'"/><circle cx="39.5" cy="32.5" r="1.8" fill="'+DOT+'"/>','<path d="M26 42 h12"/>'),
  m_worry:C=>moodFace(C,'#D9CDEF','#AE9CD6','<path d="M21 28.5 l6 -2.6 M43 28.5 l-6 -2.6"/><circle cx="24.5" cy="33" r="1.8" fill="'+DOT+'"/><circle cx="39.5" cy="33" r="1.8" fill="'+DOT+'"/>','<path d="M26 42 q2 -2 4 0 q2 2 4 0 q2 -2 4 0"/>'),

  /* 遊戲區 */
  clock:C=>`<ellipse cx="32" cy="58" rx="16" ry="2.8" fill="#6E9C8A" opacity=".16"/>
    <circle cx="18" cy="12" r="6" fill="${C.g('#F9CF7F',.4,-.12)}" stroke="#E0A63F" stroke-width="1.3"/><circle cx="46" cy="12" r="6" fill="${C.g('#F9CF7F',.4,-.12)}" stroke="#E0A63F" stroke-width="1.3"/>
    <circle cx="32" cy="34" r="22" fill="${C.g('#8FD3BE',.42,-.16)}" stroke="#5FB69B" stroke-width="1.6"/>
    <circle cx="32" cy="34" r="16" fill="#FFFDF6"/>
    <path d="M32 22 v3 M32 43 v3 M20 34 h3 M41 34 h3" stroke="#D9CDB8" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M32 34 V26 M32 34 l6 4" stroke="#5C4A3D" stroke-width="2.6" stroke-linecap="round"/><circle cx="32" cy="34" r="2.2" fill="#F08F7A"/>
    <ellipse cx="22" cy="21" rx="5" ry="2.4" transform="rotate(-35 22 21)" fill="#fff" opacity=".55"/>`,
  scope:C=>`<ellipse cx="32" cy="58" rx="17" ry="2.8" fill="#6E9C6A" opacity=".16"/>
    <path d="M24 40 l-8 16 M40 40 l8 16 M32 40 v16" stroke="#C79A55" stroke-width="3" stroke-linecap="round"/>
    <g transform="rotate(-28 32 30)"><rect x="10" y="22" width="44" height="15" rx="7.5" fill="${C.v('#9FD3E8',.4,-.18)}" stroke="#6BAFCB" stroke-width="1.5"/>
      <rect x="48" y="19" width="9" height="21" rx="4" fill="${C.g('#F9CF7F',.4,-.12)}" stroke="#E0A63F" stroke-width="1.3"/>
      <rect x="6" y="25" width="6" height="9" rx="2.5" fill="${C.g('#F9CF7F',.4,-.12)}" stroke="#E0A63F" stroke-width="1.2"/>
      <rect x="16" y="24.6" width="22" height="3.4" rx="1.7" fill="#fff" opacity=".55"/></g>
    <circle cx="51" cy="50" r="2" fill="#FFD45E"/><circle cx="56" cy="44" r="1.4" fill="#FFD45E"/>`,
  magnify:C=>`<ellipse cx="30" cy="58" rx="16" ry="2.8" fill="#B98A4E" opacity=".16"/>
    <path d="M40 40 L54 54" stroke="#C79A55" stroke-width="8" stroke-linecap="round"/><path d="M40 40 L54 54" stroke="#E9C58A" stroke-width="4.4" stroke-linecap="round"/>
    <circle cx="27" cy="27" r="17" fill="${C.g('#FFD45E',.4,-.14)}" stroke="#EBB12A" stroke-width="1.6"/>
    <circle cx="27" cy="27" r="11.5" fill="#E6F5FB"/><path d="M20 22 q4 -5 10 -3" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M23 30 q4 4 8 0" fill="none" stroke="#86AEDF" stroke-width="2" stroke-linecap="round"/>`,
  cards:C=>`<ellipse cx="32" cy="58" rx="18" ry="2.8" fill="#B98A4E" opacity=".16"/>
    <g transform="rotate(-12 24 34)"><rect x="9" y="14" width="27" height="38" rx="6" fill="${C.v('#FFE9B8',.3,-.1)}" stroke="#E3C282" stroke-width="1.5"/>
      <path d="M22.5 25 C29 27 30 36 22.5 43 C15 36 16 27 22.5 25 Z" fill="${C.g('#9EDCC6',.45,-.16)}"/></g>
    <g transform="rotate(10 42 34)"><rect x="28" y="12" width="27" height="38" rx="6" fill="#FFFCF4" stroke="#E3D6C0" stroke-width="1.5"/>
      <circle cx="41.5" cy="31" r="9" fill="${C.g('#F8B9AE',.42,-.14)}"/><circle cx="38.6" cy="30" r="1.3" fill="${DOT}"/><circle cx="44.4" cy="30" r="1.3" fill="${DOT}"/>
      <path d="M39 34 q2.5 2 5 0" fill="none" stroke="${DOT}" stroke-width="1.5" stroke-linecap="round"/></g>`,
  bubbles:C=>`<ellipse cx="30" cy="59" rx="14" ry="2.6" fill="#86AEDF" opacity=".16"/>
    ${[[26,36,17,'#B9D3F2'],[48,18,10,'#F4B3CB'],[49,46,8,'#A8DCC5'],[13,13,6,'#FBE3A0']].map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.g(c,.5,-.1)}" stroke="#fff" stroke-width="1.4" opacity=".95"/>
      <ellipse cx="${x-r*.38}" cy="${y-r*.4}" rx="${r*.3}" ry="${r*.17}" transform="rotate(-35 ${x-r*.38} ${y-r*.4})" fill="#fff" opacity=".85"/>`).join('')}`,
  breeze:C=>`<ellipse cx="32" cy="58" rx="18" ry="2.8" fill="#6E9C8A" opacity=".16"/>
    <path d="M32 54 C22 50 12 42 10 30 C18 30 26 35 32 44 C38 35 46 30 54 30 C52 42 42 50 32 54 Z" fill="${C.g('#A8DCC5',.4,-.16)}" stroke="#74BFA2" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M32 46 C26 38 25 24 32 12 C39 24 38 38 32 46 Z" fill="${C.g('#F4B3CB',.45,-.14)}" stroke="#DE8BAC" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M32 44 C24 38 20 30 21 22 C27 26 30 31 32 38 C34 31 37 26 43 22 C44 30 40 38 32 44 Z" fill="${C.g('#FAD0DE',.4,-.1)}" stroke="#E7A3BE" stroke-width="1.2" stroke-linejoin="round"/>
    <ellipse cx="29" cy="20" rx="1.6" ry="4" fill="#fff" opacity=".6"/>`,

  /* 安靜觀察的三個地方 */
  pine:C=>`<ellipse cx="32" cy="58" rx="15" ry="2.8" fill="#6E9C6A" opacity=".18"/>
    <rect x="28.5" y="44" width="7" height="12" rx="2.5" fill="${C.v('#C99A66',.3,-.15)}"/>
    ${[[46,16,10],[36,12,18],[26,8,25]].map(([y,h,w])=>`<path d="M32 ${y-h-6} Q${32+w*.2} ${y-h*.4} ${32+w} ${y} Q32 ${y+5} ${32-w} ${y} Q${32-w*.2} ${y-h*.4} 32 ${y-h-6} Z" fill="${C.g('#8DCF9A',.4,-.2)}" stroke="#5FAE72" stroke-width="1.4" stroke-linejoin="round"/>`).reverse().join('')}
    <ellipse cx="26" cy="22" rx="3" ry="1.6" transform="rotate(-30 26 22)" fill="#fff" opacity=".5"/>`,
  lotus:C=>`<ellipse cx="32" cy="48" rx="26" ry="9" fill="${C.v('#A8D8EC',.3,-.12)}" stroke="#7CBFDB" stroke-width="1.3"/>
    <ellipse cx="18" cy="46" rx="9" ry="4" fill="${C.g('#9ED39A',.35,-.14)}"/>
    <path d="M32 46 C24 44 18 38 18 30 C24 31 29 35 32 40 C35 35 40 31 46 30 C46 38 40 44 32 46 Z" fill="${C.g('#F4B3CB',.45,-.14)}" stroke="#DE8BAC" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M32 42 C27 36 27 26 32 18 C37 26 37 36 32 42 Z" fill="${C.g('#FAD0DE',.45,-.1)}" stroke="#E7A3BE" stroke-width="1.3" stroke-linejoin="round"/>
    <circle cx="32" cy="38" r="2.4" fill="#FFD45E"/>`,
  wave:C=>`<ellipse cx="32" cy="58" rx="20" ry="2.8" fill="#6E8FB0" opacity=".16"/>
    <path d="M6 46 C10 26 26 14 42 18 C52 21 56 30 50 36 C46 40 40 37 42 32 C44 27 37 26 34 31 C30 38 36 48 46 50 L58 50 Q58 56 52 56 H10 Q6 56 6 46 Z" fill="${C.g('#86C3EA',.42,-.18)}" stroke="#5DA6D6" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M14 40 C18 30 28 23 38 23" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
    <circle cx="51" cy="12" r="2.2" fill="#C9E4F6"/><circle cx="57" cy="20" r="1.6" fill="#C9E4F6"/>`,

  /* 商店 */
  rainbow:C=>`<ellipse cx="32" cy="56" rx="24" ry="2.6" fill="#B98A4E" opacity=".14"/>
    ${[['#F8B9AE',24],['#FBE3A0',19],['#A8DCC5',14],['#B9D3F2',9]].map(([c,r])=>`<path d="M${32-r} 46 A${r} ${r} 0 0 1 ${32+r} 46" fill="none" stroke="${c}" stroke-width="5.4" stroke-linecap="round"/>`).join('')}
    <circle cx="11" cy="47" r="6" fill="${C.g('#FFFFFF',.1,-.08)}"/><circle cx="16" cy="49" r="4.6" fill="#fff"/>
    <circle cx="53" cy="47" r="6" fill="${C.g('#FFFFFF',.1,-.08)}"/><circle cx="48" cy="49" r="4.6" fill="#fff"/>`,
  ticket:C=>`<ellipse cx="32" cy="56" rx="22" ry="2.6" fill="#B98A4E" opacity=".14"/>
    <path d="M8 18 H56 V27 a5 5 0 0 0 0 10 V46 H8 V37 a5 5 0 0 0 0 -10 Z" fill="${C.v('#FBE3A0',.3,-.12)}" stroke="#E0B85A" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M42 21 V43" stroke="#E0B85A" stroke-width="1.6" stroke-dasharray="3 3"/>
    <path d="M24 26 l2.4 5 5.4 .7 -4 3.7 1 5.4 -4.8 -2.6 -4.8 2.6 1 -5.4 -4 -3.7 5.4 -.7 Z" fill="${C.g('#F8B9AE',.4,-.12)}" stroke="#E8907F" stroke-width="1" stroke-linejoin="round"/>`
});

const MOOD_ICO={開心:'m_happy',平靜:'m_calm',難過:'m_sad',生氣:'m_angry',擔心:'m_worry'};
const GAME_ICO={gRoutine:'clock',gWatch:'scope',gGuess:'magnify',gMem:'cards',gTR:'rabbit',gColor:'bubbles',gCalm:'breeze'};
const WS_ICO={forest:'pine',pond:'lotus',sea:'wave'};
const SHOP_IMG={tree:'img/yard_tree_apple.webp',flowers:'img/y_flowers.webp',tent:'img/y_tent.webp',lamp:'img/y_lamp.webp',swing:'img/y_swing.webp',
  garden:'img/y_garden.webp',pond:'img/y_pond.webp',house:'img/yard_house.webp'};
function ci(n,s){return (typeof clayIcon==='function'&&clayIcon(n,s))||''}

/* 遊戲區：按鈕標題前面的 emoji 換成圖示（只換一次） */
function paintGames(){Object.entries(GAME_ICO).forEach(([id,n])=>{const b=document.querySelector('#'+id+' b');if(!b||b.querySelector('.gico'))return;
  const s=ci(n,id==='gRoutine'||id==='gWatch'?40:46);if(!s)return;
  b.innerHTML=`<i class="gico">${s}</i>`+b.innerHTML.replace(/^\s*\S+\s/,'');b.parentElement.classList.add('hasgico')})}
(()=>{const rg=renderGames;renderGames=function(){rg();paintGames()}})();

/* 今天心情 */
(()=>{const rh=renderHome;renderHome=function(){rh();
  $$('#moods [data-mood]').forEach(b=>{const n=MOOD_ICO[b.dataset.mood],s=n&&ci(n,40);if(!s)return;const t=b.querySelector('span');b.innerHTML=s;if(t)b.appendChild(t);b.classList.add('cmood')})}})();

/* 安靜觀察：選地方 */
(()=>{const rw=renderWatch;renderWatch=function(){rw();
  $$('[data-ws]').forEach(b=>{const n=WS_ICO[b.dataset.ws],s=n&&ci(n,52),f=b.querySelector('b');if(s&&f&&!f.querySelector('svg')){f.innerHTML=s;f.classList.add('wsico')}});
  $$('.secttl').forEach(p=>{const k=Object.keys(WSCENES).find(k=>p.textContent.trim()===WSCENES[k].ico+' '+WSCENES[k].name);if(k){const s=ci(WS_ICO[k],30);if(s)p.innerHTML=`<i class="tico">${s}</i>${WSCENES[k].name}`}});
  const t=$('#wTitle');if(t&&S.wScene&&WS_ICO[S.wScene]){const s=ci(WS_ICO[S.wScene],34);if(s)t.innerHTML=`<i class="tico">${s}</i>${WSCENES[S.wScene].name}`}}})();

/* 商店：家園物品用院子裡真的那張圖；兌換券用票券圖示 */
(()=>{const rs=renderShop;renderShop=function(){rs();
  $$('#shop .shopitem').forEach(card=>{const ic=card.querySelector('.shopicon');if(!ic)return;
    const buy=card.querySelector('[data-buy]'),name=card.querySelector('b')&&card.querySelector('b').textContent;
    const it=buy?SHOP.find(x=>x.id===buy.dataset.buy):SHOP.find(x=>x.name===name);
    if(it&&SHOP_IMG[it.id]){ic.innerHTML=`<img src="${SHOP_IMG[it.id]}" alt="">`;ic.classList.add('shopimg')}
    else if(it&&it.id==='rainbowsky'){ic.innerHTML=ci('rainbow',72);ic.classList.add('shopimg')}
    else if(S.shopCat==='reward'){const s=ci('ticket',64);if(s){ic.innerHTML=s;ic.classList.add('shopimg')}}})}})();
