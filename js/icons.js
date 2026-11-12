/* 黏土圖示（v32）：家園三個入口、心裡的天氣。
   跟底部導覽列的小圖示同一種畫法（art.js 的 Clay 工具：左上亮、右下暗），
   取代原本的 emoji，讓每台裝置看到的樣子都一樣。
   用法：clayIcon('heart',52) 會回傳一段 svg。 */
let cicoN=0;
const CICO={
  /* 冷靜站：一顆安靜微笑的心 */
  heart:C=>`<ellipse cx="32" cy="58" rx="16" ry="3" fill="#B98A4E" opacity=".16"/>
    <path d="M32 54 C12 40 6 28 12.5 17.5 C18 9 28.5 11 32 19 C35.5 11 46 9 51.5 17.5 C58 28 52 40 32 54 Z" fill="${C.g('#FFC94D',.5,-.14)}" stroke="#EBA91F" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="20.5" cy="20" rx="6" ry="3.4" transform="rotate(-32 20.5 20)" fill="#fff" opacity=".6"/>
    <path d="M22.5 31 q3 3.2 6 0 M35.5 31 q3 3.2 6 0" fill="none" stroke="#8A5A12" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M28.5 38.5 q3.5 3 7 0" fill="none" stroke="#8A5A12" stroke-width="2.3" stroke-linecap="round"/>
    <circle cx="19.5" cy="36.5" r="3.2" fill="#FF9A8A" opacity=".5"/><circle cx="44.5" cy="36.5" r="3.2" fill="#FF9A8A" opacity=".5"/>`,
  /* 開心的事：閃亮亮的星光 */
  joy:C=>`<ellipse cx="30" cy="59" rx="13" ry="2.6" fill="#B98A4E" opacity=".14"/>
    <path d="M30 11 C32 26 38 32 53 34 C38 36 32 42 30 57 C28 42 22 36 7 34 C22 32 28 26 30 11 Z" fill="${C.g('#FFD45E',.5,-.12)}" stroke="#EBB12A" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="25.5" cy="29" rx="3.4" ry="5.6" transform="rotate(28 25.5 29)" fill="#fff" opacity=".6"/>
    <path d="M50 5 C51 11 53 13 59 14 C53 15 51 17 50 23 C49 17 47 15 41 14 C47 13 49 11 50 5 Z" fill="${C.g('#FFA9CB',.45,-.1)}" stroke="#F086B2" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="13" cy="51" r="3.4" fill="${C.g('#9EDCC6',.45,-.1)}"/><circle cx="52" cy="50" r="2.4" fill="${C.g('#B9DDF2',.45,-.1)}"/>`,
  /* 今天：小小的待辦板 */
  today:C=>`<ellipse cx="32" cy="59" rx="17" ry="2.8" fill="#6E9C8A" opacity=".16"/>
    <rect x="13" y="11" width="38" height="45" rx="9" fill="${C.g('#8FD3BE',.42,-.14)}" stroke="#5FB69B" stroke-width="1.5"/>
    <rect x="18" y="18" width="28" height="33" rx="5" fill="#FFFDF6"/>
    <rect x="24" y="6" width="16" height="11" rx="5.5" fill="${C.v('#F9CF7F',.35,-.12)}" stroke="#E0A63F" stroke-width="1.3"/>
    <ellipse cx="29" cy="9.6" rx="3" ry="1.3" fill="#fff" opacity=".6"/>
    <path d="M21.5 27 l2.6 2.6 l4.6 -5.2 M21.5 35.5 l2.6 2.6 l4.6 -5.2" fill="none" stroke="#5FB69B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="25" cy="44.5" r="2.6" fill="none" stroke="#D9CDB8" stroke-width="2"/>
    <path d="M33 27.5 h9 M33 36 h9 M33 44.5 h6" stroke="#E2D6C0" stroke-width="2.6" stroke-linecap="round"/>`,
  /* 像火山：好熱、好想爆炸 */
  volcano:C=>`<ellipse cx="32" cy="57" rx="25" ry="3.4" fill="#A9684B" opacity=".18"/>
    <circle cx="23" cy="13" r="5" fill="${C.g('#FFD9C2',.4,-.08)}"/><circle cx="41" cy="12" r="5.6" fill="${C.g('#FFD9C2',.4,-.08)}"/><circle cx="32" cy="9" r="7" fill="${C.g('#FFC3A6',.4,-.08)}"/>
    <path d="M7 55 L23 25 Q32 19 41 25 L57 55 Q32 60 7 55 Z" fill="${C.g('#D9A183',.38,-.2)}" stroke="#B97C5C" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M21 29 Q23 19 32 19 Q41 19 43 29 Q41.5 36 38.5 30 Q37 39 33.5 31 Q31 41 28 31 Q25 36 21 29 Z" fill="${C.g('#FF8E6E',.45,-.14)}" stroke="#E96A4B" stroke-width="1.3" stroke-linejoin="round"/>
    <ellipse cx="27.5" cy="23.5" rx="3.6" ry="1.7" transform="rotate(-18 27.5 23.5)" fill="#fff" opacity=".55"/>
    <ellipse cx="18" cy="44" rx="2.4" ry="5" transform="rotate(28 18 44)" fill="#fff" opacity=".22"/>
    <circle cx="13" cy="8" r="2" fill="#FFD45E"/><circle cx="52" cy="6" r="1.7" fill="#FFD45E"/><circle cx="50" cy="20" r="1.4" fill="#FFB199"/>`,
  /* 像下雨：想哭、心裡重重的 */
  rain:C=>`<path d="M17 38 C8 38 6.5 27.5 15 24.5 C15 14.5 27 12 31 18.5 C35.5 9 51 12.5 49.5 24 C58.5 25.5 58 38 48 38 Z" fill="${C.g('#DCEBFA',.6,-.16)}" stroke="#A3C4E8" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="24" cy="20.5" rx="5.4" ry="2.6" transform="rotate(-20 24 20.5)" fill="#fff" opacity=".8"/>
    <path d="M21 43 q-4.6 6.6 0 9.4 q4.6 -2.8 0 -9.4 Z" fill="${C.g('#86BBF0',.45,-.12)}" stroke="#6CA3DE" stroke-width="1"/>
    <path d="M32 47 q-4.6 6.6 0 9.4 q4.6 -2.8 0 -9.4 Z" fill="${C.g('#86BBF0',.45,-.12)}" stroke="#6CA3DE" stroke-width="1"/>
    <path d="M43 43 q-4.6 6.6 0 9.4 q4.6 -2.8 0 -9.4 Z" fill="${C.g('#86BBF0',.45,-.12)}" stroke="#6CA3DE" stroke-width="1"/>`,
  /* 像颳大風：心跳快、怕怕的、亂亂的 */
  wind:C=>{const st=(d,w,c)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    const a='M7 25 H35 a7.5 7.5 0 1 0 -7.5 -7.5',b='M7 37 H45 a8.5 8.5 0 1 1 -8.5 8.5',c='M15 48.5 H25';
    return st(a,8,'#4FA98C')+st(b,8,'#4FA98C')+st(c,8,'#4FA98C')+st(a,5.4,'#8AD3BB')+st(b,5.4,'#8AD3BB')+st(c,5.4,'#8AD3BB')
      +`<path d="M10 23.6 H33 M10 35.6 H42 M17 47.2 H24" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
      <g transform="translate(51 21) rotate(28)"><path d="M0 -8 C7 -5 7 5 0 8 C-7 5 -7 -5 0 -8 Z" fill="${C.g('#B7DF8B',.45,-.14)}" stroke="#8CBF5C" stroke-width="1.2"/><path d="M0 -5 V6" stroke="#8CBF5C" stroke-width="1.2" stroke-linecap="round"/></g>
      <circle cx="54" cy="52" r="2" fill="#C9E9DC"/><circle cx="8" cy="12" r="1.8" fill="#C9E9DC"/>`},
  /* 像受傷了：貼著 OK 繃的心 */
  mend:C=>`<ellipse cx="32" cy="58" rx="16" ry="3" fill="#A9799A" opacity=".16"/>
    <path d="M32 54 C12 40 6 28 12.5 17.5 C18 9 28.5 11 32 19 C35.5 11 46 9 51.5 17.5 C58 28 52 40 32 54 Z" fill="${C.g('#F4B3CB',.5,-.14)}" stroke="#DE8BAC" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="20.5" cy="20" rx="6" ry="3.4" transform="rotate(-32 20.5 20)" fill="#fff" opacity=".6"/>
    <g transform="rotate(-24 33 33)"><rect x="15" y="27" width="36" height="13" rx="6.5" fill="${C.v('#FFEBCF',.4,-.1)}" stroke="#E6C08F" stroke-width="1.3"/>
      <rect x="27" y="28.6" width="12" height="9.8" rx="2.4" fill="#FFF8EA" stroke="#EBD0A8" stroke-width="1"/>
      <circle cx="20.5" cy="31" r=".9" fill="#E6C08F"/><circle cx="20.5" cy="36" r=".9" fill="#E6C08F"/><circle cx="23.6" cy="33.5" r=".9" fill="#E6C08F"/>
      <circle cx="45.5" cy="31" r=".9" fill="#E6C08F"/><circle cx="45.5" cy="36" r=".9" fill="#E6C08F"/><circle cx="42.4" cy="33.5" r=".9" fill="#E6C08F"/></g>`
};
function clayIcon(name,size=56){const draw=CICO[name];if(!draw||typeof Clay!=='function')return '';
  const C=Clay('ci'+(++cicoN)+'_');const body=draw(C);
  return `<svg class="cico" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${C.defs()}${body}</svg>`}
/* 把 index.html 裡固定的 emoji 換成黏土圖示（畫不出來時 emoji 會留著） */
function paintIcons(){[['#hStart','heart'],['#hJoy','joy'],['#hToday','today']].forEach(([sel,n])=>{
  const i=document.querySelector(sel+' i');const s=clayIcon(n,54);if(i&&s)i.innerHTML=s})}
