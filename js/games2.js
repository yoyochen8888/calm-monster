/* v41：小遊戲畫面美化（記憶翻牌、烏龜兔子石頭、顏色泡泡）
   只改「看起來和動起來的樣子」，規則和星星都沒有變。
   圖示自己畫（跟 icons.js 同一種黏土畫法），不用系統表情符號，每台裝置看到的都一樣。 */
Object.assign(CICO,{
  /* 兔子：快快點 */
  rabbit:C=>`<ellipse cx="32" cy="59" rx="15" ry="2.8" fill="#B98A4E" opacity=".16"/>
    <path d="M22 30 C16 14 19 4 24.5 4.5 C30 5 30 18 29 30 Z" fill="${C.g('#FFF6EE',.3,-.1)}" stroke="#E7C9B4" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M42 30 C48 14 45 4 39.5 4.5 C34 5 34 18 35 30 Z" fill="${C.g('#FFF6EE',.3,-.1)}" stroke="#E7C9B4" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M24 26 C21.5 16 22.5 9.5 24.6 9.6 C26.6 9.8 26.6 18 26.4 26 Z" fill="#FFC2CF"/><path d="M40 26 C42.5 16 41.5 9.5 39.4 9.6 C37.4 9.8 37.4 18 37.6 26 Z" fill="#FFC2CF"/>
    <ellipse cx="32" cy="40" rx="18" ry="16" fill="${C.g('#FFF6EE',.3,-.12)}" stroke="#E7C9B4" stroke-width="1.5"/>
    <ellipse cx="24" cy="31" rx="5" ry="2.6" transform="rotate(-24 24 31)" fill="#fff" opacity=".8"/>
    <circle cx="25" cy="39" r="2.4" fill="#5C4A3D"/><circle cx="39" cy="39" r="2.4" fill="#5C4A3D"/><circle cx="25.8" cy="38.2" r=".8" fill="#fff"/><circle cx="39.8" cy="38.2" r=".8" fill="#fff"/>
    <path d="M30 44 h4 l-2 2.4 Z" fill="#F08FA6"/><path d="M32 46.4 q-3 3.4 -6 1.4 M32 46.4 q3 3.4 6 1.4" fill="none" stroke="#8A6A55" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="19.5" cy="45" r="3.2" fill="#FF9A8A" opacity=".45"/><circle cx="44.5" cy="45" r="3.2" fill="#FF9A8A" opacity=".45"/>`,
  /* 烏龜：慢慢點 */
  turtle:C=>`<ellipse cx="32" cy="57" rx="22" ry="3" fill="#6E9C6A" opacity=".18"/>
    <ellipse cx="15" cy="50" rx="6" ry="4.6" fill="${C.g('#B7E08F',.35,-.14)}" stroke="#86B85A" stroke-width="1.3"/><ellipse cx="42" cy="51" rx="6" ry="4.6" fill="${C.g('#B7E08F',.35,-.14)}" stroke="#86B85A" stroke-width="1.3"/>
    <circle cx="52" cy="36" r="9" fill="${C.g('#C4E89C',.35,-.14)}" stroke="#86B85A" stroke-width="1.5"/>
    <path d="M6 48 C6 26 20 16 30 16 C40 16 50 26 50 48 Q28 54 6 48 Z" fill="${C.g('#7CC6A4',.4,-.2)}" stroke="#4E9F7E" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M28 22 l8 5 v9 l-8 5 l-8 -5 v-9 Z" fill="${C.g('#A7E0C4',.35,-.1)}" stroke="#4E9F7E" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M20 27 l-8 4 M36 27 l8 3 M20 36 l-9 6 M36 36 l9 5 M28 41 v8" stroke="#4E9F7E" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="18" cy="24" rx="6" ry="2.6" transform="rotate(-30 18 24)" fill="#fff" opacity=".5"/>
    <circle cx="55" cy="34.5" r="1.9" fill="#5C4A3D"/><circle cx="55.6" cy="33.9" r=".6" fill="#fff"/><path d="M52.5 40 q3 2 5.4 -.4" fill="none" stroke="#5C7A3D" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="50.5" cy="38.6" r="2" fill="#FF9A8A" opacity=".45"/>`,
  /* 石頭：停住不能動（閉著眼睛、安安靜靜） */
  stone:C=>`<ellipse cx="32" cy="57" rx="23" ry="3.2" fill="#7B7290" opacity=".2"/>
    <path d="M8 46 C5 30 16 14 31 13 C47 12 59 28 57 44 C56 54 44 56 32 56 C20 56 10 55 8 46 Z" fill="${C.g('#C9C2D8',.4,-.2)}" stroke="#9A91AF" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="22" cy="23" rx="8" ry="3.6" transform="rotate(-28 22 23)" fill="#fff" opacity=".55"/>
    <path d="M21 38 q3.2 2.8 6.4 0 M37 38 q3.2 2.8 6.4 0" fill="none" stroke="#5C4A3D" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M29 45 q3 2 6 0" fill="none" stroke="#5C4A3D" stroke-width="2" stroke-linecap="round"/>
    <circle cx="18.5" cy="43" r="3" fill="#FF9A8A" opacity=".35"/><circle cx="45.5" cy="43" r="3" fill="#FF9A8A" opacity=".35"/>
    <path d="M44 20 l3 2 M48 26 l2 3" stroke="#9A91AF" stroke-width="1.6" stroke-linecap="round"/>`,
  /* 終點旗 */
  flag:C=>`<ellipse cx="22" cy="58" rx="12" ry="2.6" fill="#B98A4E" opacity=".18"/>
    <rect x="15" y="8" width="5" height="50" rx="2.5" fill="${C.v('#E7C58F',.3,-.15)}" stroke="#C79A55" stroke-width="1.2"/>
    <path d="M20 11 Q34 5 44 12 Q52 17 58 12 V36 Q52 41 44 36 Q34 29 20 35 Z" fill="${C.v('#FFFDF6',.1,-.06)}" stroke="#C9BBA4" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M20 11 Q26.5 8.3 32.6 8.6 V20.6 Q26.5 20.3 20 23 Z M32.6 20.6 Q39 21 44.5 24.3 V12.3 Q39 9 32.6 8.6 Z M44.5 24.3 Q51 28 58 24 V36 Q52 41 44.5 36.3 Z M32.6 20.6 V32.6 Q26.5 32.3 20 35 V23 Q26.5 20.3 32.6 20.6 Z" fill="none"/>
    <path d="M20 11 Q26.5 8.3 32.6 8.6 V20.6 Q26.5 20.3 20 23 Z M32.6 20.6 Q39 21 44.5 24.3 V36.3 Q39 33 32.6 32.6 Z M44.5 12.3 Q51 16 58 12 V24 Q51 28 44.5 24.3 Z" fill="#6B5A4D" opacity=".82"/>
    <circle cx="17.5" cy="8" r="3.6" fill="${C.g('#FFD45E',.45,-.12)}" stroke="#EBB12A" stroke-width="1"/>`,
  /* 牌背上的小葉子 */
  leaf:C=>`<path d="M32 8 C50 14 54 36 32 56 C10 36 14 14 32 8 Z" fill="${C.g('#9EDCC6',.45,-.16)}" stroke="#6FBFA3" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M32 14 V50 M32 24 l-8 -5 M32 24 l8 -5 M32 34 l-10 -5 M32 34 l10 -5 M32 44 l-7 -4 M32 44 l7 -4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".75"/>
    <ellipse cx="24" cy="20" rx="5" ry="2.4" transform="rotate(-40 24 20)" fill="#fff" opacity=".5"/>`
});
function gIcon(n,size,fallback){return (typeof clayIcon==='function'&&clayIcon(n,size))||fallback||''}

/* ---------- 記憶翻牌：牌會真的翻過來、配對成功會亮一下 ---------- */
function renderMemory(fresh){
  if(fresh||!S.mem){const n=S.age==='young'?3:S.age==='old'?6:4;const ks=visibleEmo().sort(()=>Math.random()-.5).slice(0,n);
    const cards=[...ks,...ks].sort(()=>Math.random()-.5);
    S.mem={cards,up:[],ok:new Set(),turn:'kid',score:{kid:0,hero:0},lock:false,moves:0,seen:{},mode:(S.mem&&S.mem.mode)||'vs',over:false,sig:'m'+Date.now()}}
  const M=S.mem;const cols=M.cards.length<=6?3:4;
  $('#memMode').innerHTML=[['vs','和主角比賽'],['coop','一起合作']].map(([k,t])=>`<button class="chip ${M.mode===k?'sel':''}" data-mm="${k}">${t}</button>`).join('');
  $$('[data-mm]').forEach(b=>b.onclick=()=>{S.mem.mode=b.dataset.mm;stopAct();renderMemory(true)});
  const hn=store.hero?store.hero.name:'主角';
  $('#memScore').innerHTML=M.mode==='vs'?`<span class="who ${M.turn==='kid'&&!M.over?'turn':''}"><b>你</b> ${M.score.kid}</span><span class="who ${M.turn==='hero'&&!M.over?'turn':''}">${store.hero?hero(store.hero.type,24,{}):''} <b>${hn}</b> ${M.score.hero}</span>`
    :`<span class="who turn">一起翻了 <b>${M.moves}</b> 次</span>`;
  const G=$('#memGrid');G.style.gridTemplateColumns=`repeat(${cols},1fr)`;G.classList.add('memtable');
  if(G.dataset.sig!==M.sig){G.dataset.sig=M.sig;const back=gIcon('leaf',34,'★');
    G.innerHTML=M.cards.map((k,i)=>`<button class="mcard2" data-mc="${i}" style="--i:${i}" aria-label="牌"><span class="mflip"><span class="mface mback">${back}</span><span class="mface mfront">${monster(k,60,'',{mood:2,level:1,eq:{}})}</span></span></button>`).join('');
    $$('[data-mc]').forEach(b=>b.onclick=()=>{const m=S.mem;if(m.turn!=='kid'||m.lock||m.over)return;flipCard(+b.dataset.mc)})}
  [...G.children].forEach((c,i)=>{const ok=M.ok.has(i);c.classList.toggle('up',ok||M.up.includes(i));if(ok&&!c.classList.contains('ok'))c.classList.add('ok','pop')});
  G.classList.toggle('heroturn',M.mode==='vs'&&M.turn==='hero'&&!M.over);
  if(!fresh&&M.turn==='hero'&&!M.lock&&!M.over)later(heroTurn,700);
  if(fresh)$('#memMsg').style.display='none';
}

/* ---------- 烏龜兔子石頭：指令卡有圖、跑道有風景、主角會跳 ---------- */
const TR_WORD={rabbit:'兔子！快快點',turtle:'烏龜…慢慢點',stone:'石頭！停住！',flag:'到終點了！'};
function trCmdHtml(cmd){return `<span class="trcmd">${gIcon(cmd,54)}<b>${TR_WORD[cmd]||''}</b></span>`}
function trHop(cmd){const r=$('#trRun');if(!r)return;r.classList.remove('hop','step');void r.offsetWidth;r.classList.add(cmd==='rabbit'?'hop':'step')}
(()=>{const rt=renderTR;renderTR=function(){rt();
  const L=$('#trLegend');if(L)L.innerHTML=[['rabbit','兔子','快快點'],['turtle','烏龜','慢慢點'],['stone','石頭','停住不點']].map(([k,a,b])=>`<span class="trleg trleg-${k}">${gIcon(k,34)}<span><b>${a}</b>${b}</span></span>`).join('');
  const f=$('#trFlag');if(f)f.innerHTML=gIcon('flag',40,'🏁');
  const t=$('#trTap');if(t)t.dataset.cmd='';}})();

/* ---------- 顏色泡泡：有天空草地的場景、泡泡有光澤、戳到會「啵」一下 ---------- */
function cbSetTarget(){const C=S.cb;C.target=C.ks[Math.floor(Math.random()*C.ks.length)];const e=EMO[C.target];
  $('#cbCmd').innerHTML=`<span class="cbcmd">只戳<span class="cbtag" style="--bc:${e.color}">${monster(C.target,34,'',{mood:1,level:1,eq:{}})}${e.cname}</span>的泡泡</span>`;
  speak('只戳'+e.cname+'的泡泡');tone(600,.15);const p=$('#cbPond');if(p)p.style.setProperty('--tc',e.color)}
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest&&ev.target.closest('#cbPond .bub');if(!b||!S.cb||!S.cb.run)return;
  const col=b.style.getPropertyValue('--bc').trim();if(col.toLowerCase()!==EMO[S.cb.target].color.toLowerCase())return;
  const pond=$('#cbPond'),pr=pond.getBoundingClientRect(),r=b.getBoundingClientRect();
  const p=document.createElement('div');p.className='bpop';p.style.cssText=`left:${r.left-pr.left+r.width/2}px;top:${r.top-pr.top+r.height/2}px;--bc:${col};--sz:${r.width}px`;
  p.innerHTML='<i></i>'+Array.from({length:6},(_,i)=>`<b style="--a:${i*60}deg"></b>`).join('');pond.appendChild(p);setTimeout(()=>p.remove(),520)},true);
