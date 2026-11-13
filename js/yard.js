/* =========================================================
   新院子（v33）：從斜上方看進院子，畫面 360×300
   - 地面、鋪磚、圍籬、池塘、菜園、帳篷、鞦韆、路燈：程式畫（下面的 y 開頭函式）
   - 房子、兩棵樹、小熊和小狗主角：Gemini 生成圖（img/yard_*.webp、img/hero_bear1–4、hero_dog1–4）
   - 載入在 home.js 後面，覆蓋 scene()、bindScene()、startWander()、posOf()、hero()
   - 家具位置另外存在 store.ypos（舊的 store.pos 是側面視角的位置，留著不刪）
   想退回舊家園：把 index.html 裡 yard.js 那一行拿掉就好。
   ========================================================= */
/* =========================================================
   新院子（第 0 步試畫）
   視角：從斜上方看進院子。畫面 360×300。
   每樣東西用「腳踩在哪裡」（base，越下面越靠近你）決定誰擋住誰。
   畫法沿用 art.js 的 Clay 工具（左上亮、右下暗），之後可以直接搬進網站。
   ========================================================= */
const ySh=(cx,cy,rx,ry,o=.15)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3F5A30" opacity="${o}"/>`;
const yHl=(cx,cy,rx,ry,o=.45,rot=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}"${rot?` transform="rotate(${rot} ${cx} ${cy})"`:''}/>`;
function yRand(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}

/* ---------- 遠景：一小條天空和遠山，白天黑夜看這裡 ---------- */
function yCloud(C,x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-12" cy="0" r="9" fill="#fff"/><circle cx="2" cy="-5" r="12" fill="#fff"/><circle cx="15" cy="0" r="8" fill="#fff"/><rect x="-20" y="-1" width="42" height="9" rx="4.5" fill="#FBFDFF"/></g>`}
function ySky(C,night){
  let v=`<rect width="360" height="86" fill="${C.lin(night?'skyN':'skyD',night?[[0,'#343A72'],[1,'#5B609C']]:[[0,'#C9E9FF'],[1,'#F3FBFF']])}"/>`;
  if(night){
    v+=[[24,14],[70,26],[118,10],[160,22],[214,12],[262,26],[296,8],[344,34]].map(([x,y],i)=>`<circle class="tw" style="animation-delay:${i*.5}s" cx="${x}" cy="${y}" r="1.5" fill="#FFF8DC"/>`).join('');
    v+=`<circle cx="318" cy="24" r="20" fill="${C.glow('moonG','#FFF3C4')}"/><circle cx="318" cy="24" r="11" fill="${C.g('#FFF3C4',.4)}"/><circle cx="324" cy="20" r="9.5" fill="#3D437E"/>`;
  }else{
    v+=`<circle cx="320" cy="24" r="24" fill="${C.glow('sunG','#FFE7A0')}"/><circle cx="320" cy="24" r="12" fill="${C.g('#FFD978',.5)}"/>${yHl(316,20,4,2.4,.55)}`;
    v+=`<g class="cloud">${yCloud(C,64,22,.8)}</g><g class="cloud" style="animation-delay:-34s">${yCloud(C,196,30,.6)}</g>`;
  }
  v+=`<path d="M0 54 Q50 30 110 46 Q170 22 240 44 Q300 28 360 46 V90 H0Z" fill="${night?'#59619B':'#DCECF4'}"/>`;
  return v}

/* ---------- 院子後面的一排樹叢 ---------- */
function yTreeline(C){const cols=['#A8D99A','#9BD08C','#B5E1A5'];let v='';
  for(let i=0;i<14;i++){const x=-8+i*29,r=17+(i*7%5),y=60-(i%3)*3;v+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.g(cols[i%3],.32,-.12)}"/>`}
  return v}

/* ---------- 地面：修剪過的草皮 ---------- */
function yGround(C){
  let v=`<path d="M0 72 Q90 65 180 69 T360 67 V300 H0Z" fill="${C.lin('grass',[[0,'#D4EFBE'],[1,'#B8E09E']])}"/>`;
  for(let r=0;r<8;r++)for(let c=0;c<10;c++)if((r+c)%2===0)v+=`<rect x="${c*36}" y="${78+r*28}" width="36" height="28" fill="#fff" opacity=".075"/>`;
  const R=yRand(11);
  for(let i=0;i<26;i++){const x=10+R()*340,y=96+R()*190;v+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} q-1.4 -4 -.4 -6 M${(x+2.4).toFixed(1)} ${y.toFixed(1)} q.6 -5 1.8 -7" stroke="#9BCF83" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>`}
  return v}
/* 左右兩邊的矮樹籬 */
function yHedge(C){let v='';
  const cols=['#98D488','#8ACB7B','#A6DB95'],R=yRand(5);
  for(let i=0;i<10;i++){const y=84+i*23;
    v+=`<circle cx="${(1+R()*4).toFixed(1)}" cy="${(y+R()*6).toFixed(1)}" r="${(11+R()*5).toFixed(1)}" fill="${C.g(cols[i%3],.3,-.12)}"/><circle cx="${(355+R()*4).toFixed(1)}" cy="${(y+8+R()*6).toFixed(1)}" r="${(11+R()*5).toFixed(1)}" fill="${C.g(cols[(i+1)%3],.3,-.12)}"/>`}
  return v}

/* ---------- 門口的鋪磚、通往大門的踏石 ---------- */
function yPatio(){const x0=100,y0=153,cw=20,ch=20;
  let v=`<rect x="95" y="149" width="170" height="70" rx="13" fill="#DFC9A9"/><rect x="95" y="149" width="170" height="67" rx="13" fill="#F1E1C8"/>`;
  for(let r=0;r<3;r++)for(let c=0;c<8;c++)v+=`<rect x="${x0+c*cw+1}" y="${y0+r*ch+1}" width="${cw-2}" height="${ch-2}" rx="4.5" fill="${(r+c)%2?'#FCF1DE':'#F8DDCC'}"/>`;
  return v}
function yPath(C){return [[180,228,11,6],[173,243,10,5.4],[184,257,11,6],[178,272,10,5.4],[181,288,11,6]].map(([x,y,rx,ry])=>
  `<ellipse cx="${x}" cy="${y+1.6}" rx="${rx}" ry="${ry}" fill="#CFC2AE"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.g('#EDE4D6',.3,-.08)}"/>`).join('')}

/* ---------- 池塘（從上面看，圓圓的一池水） ---------- */
function yPond(C){const cx=298,cy=190;
  const peb=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;peb.push([cx+Math.cos(a)*45,cy+Math.sin(a)*24.5,3.6+(i%3),2.6+(i%2)*.7,i])}
  return `<ellipse cx="${cx}" cy="${cy+2}" rx="48" ry="27" fill="#3F5A30" opacity=".12"/>
    <ellipse cx="${cx}" cy="${cy}" rx="45" ry="24.5" fill="#B7AE9F"/>
    <ellipse cx="${cx}" cy="${cy}" rx="41" ry="21" fill="${C.lin('water',[[0,'#BDEBF7'],[1,'#73BDE0']])}"/>
    <ellipse cx="${cx-12}" cy="${cy-9}" rx="15" ry="3.4" fill="#fff" opacity=".5"/>
    <g class="fishA"><ellipse cx="${cx-6}" cy="${cy+4}" rx="6" ry="3" fill="${C.g('#FFB25B')}"/><path d="M${cx-12} ${cy+4} l-4.5 -3.2 v6.4z" fill="#FFB25B"/><circle cx="${cx-2.6}" cy="${cy+3.3}" r=".9" fill="#3B2F2A"/></g>
    <g class="fishB"><ellipse cx="${cx+14}" cy="${cy-4}" rx="5" ry="2.5" fill="${C.g('#FF9EC4')}"/><path d="M${cx+19} ${cy-4} l4 -2.8 v5.6z" fill="#FF9EC4"/><circle cx="${cx+11.2}" cy="${cy-4.6}" r=".8" fill="#3B2F2A"/></g>
    <path d="M${cx+22} ${cy+8} a8 5.4 0 1 0 .1 0 l-6 -4.6 Z" fill="${C.g('#7FCB7A',.3)}"/>
    <path d="M${cx-24} ${cy+2} a6 4 0 1 0 .1 0 l4 -3.2 Z" fill="${C.g('#8ED389',.3)}"/>
    <g>${[0,1,2,3,4].map(k=>{const a=k*1.2566;return `<circle cx="${(cx-24+Math.cos(a)*2).toFixed(1)}" cy="${(cy-2+Math.sin(a)*1.6).toFixed(1)}" r="1.8" fill="#FFC4DC"/>`}).join('')}<circle cx="${cx-24}" cy="${cy-2}" r="1.1" fill="#FFE9A0"/></g>
    ${[[cx+4,cy-10],[cx-10,cy+12],[cx+26,cy-2]].map(([x,y],i)=>`<ellipse class="tw" style="animation-delay:${i*.9}s" cx="${x}" cy="${y}" rx="3.4" ry="1" fill="#fff" opacity=".85"/>`).join('')}
    ${peb.map(([x,y,rx,ry,i])=>`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx}" ry="${ry}" fill="${C.g(i%2?'#DAD2E6':'#EAE1D4',.3,-.1)}"/>`).join('')}
    <g id="ripples"></g>`}
function yReeds(){return `<g class="sway"><path d="M330 172 q-2 -12 0 -20 M335 174 q1 -14 4 -20 M326 176 q-4 -8 -5 -14" stroke="#7FCB7A" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="330" cy="151" rx="2" ry="4.4" fill="#B9855A"/><ellipse cx="339.4" cy="153" rx="1.9" ry="4" fill="#B9855A"/></g>`}

/* ---------- 帳篷下面的圓地墊 ---------- */
function yRug(){return `<ellipse cx="298" cy="266" rx="42" ry="13.5" fill="#E8C76A"/><ellipse cx="298" cy="264.6" rx="42" ry="13.5" fill="#FBE3A0"/><ellipse cx="298" cy="264.6" rx="35" ry="10.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 4" opacity=".8"/>`}

/* ---------- 房子：看得到屋頂的上面和正面的牆 ---------- */
function yHouse(C,night){
  const roof='#F4A396',wall='#FFF4E2';
  const scallop=(y,x0,x1,n)=>{const w=(x1-x0)/n;let d=`M${x0} ${y}`;for(let i=0;i<n;i++)d+=` q${w/2} 6 ${w} 0`;return `<path d="${d}" fill="none" stroke="${tint(roof,-.14)}" stroke-width="1.5" stroke-linecap="round" opacity=".75"/>`};
  const win=(x)=>`<rect x="${x}" y="110" width="23" height="20" rx="5.5" fill="${night?C.g('#FFE9A0',.4,-.05):C.v('#BFE6FF',.3)}" stroke="#fff" stroke-width="2.2"/><path d="M${x+11.5} 110 v20 M${x} 120 h23" stroke="#fff" stroke-width="1.3"/>
    <rect x="${x-2}" y="130" width="27" height="6.5" rx="3.2" fill="${C.v('#D9A273',.2)}"/>${[[3,'#FF8A80'],[11.5,'#FFD86B'],[20,'#FFB3D1']].map(([dx,c])=>`<circle cx="${x+dx}" cy="129" r="3" fill="${C.g(c,.35)}"/>`).join('')}`;
  return `${ySh(180,151,74,7,.16)}
    ${[0,2,4].map(d=>`<circle class="smoke" style="animation-delay:${d}s" cx="215" cy="30" r="4" fill="#fff"/>`).join('')}
    <rect x="208" y="30" width="14" height="24" rx="4" fill="${C.v('#E6A57E')}"/><rect x="206" y="28" width="18" height="6" rx="3" fill="${tint('#E6A57E',-.1)}"/>
    <rect x="123" y="94" width="114" height="57" rx="9" fill="${C.v(wall,.3,-.09)}"/>
    <rect x="123" y="142" width="114" height="9" rx="4.5" fill="#EAD7BB"/>
    <path d="M110 100 Q107 106 116 106 H244 Q253 106 250 100 L235 50 Q233 43 224 43 H136 Q127 43 125 50 Z" fill="${C.v(roof,.22,-.12)}"/>
    ${scallop(58,131,229,7)}${scallop(72,127,233,8)}${scallop(86,122,238,8)}
    <rect x="109" y="97" width="142" height="9" rx="4.5" fill="${tint(roof,-.17)}"/>
    ${yHl(152,52,16,3,.3)}
    <circle cx="180" cy="78" r="0" fill="none"/>
    <path d="M169 151 V127 Q169 114 180 114 Q191 114 191 127 V151 Z" fill="${C.v('#D9A273',.22,-.1)}" stroke="#B98558" stroke-width="1.2"/>
    <circle cx="180" cy="124.5" r="3.4" fill="${night?'#FFE9A0':'#FFF4CF'}" stroke="#B98558" stroke-width=".9"/><circle cx="186.6" cy="135" r="1.7" fill="#FFE08A"/>
    ${win(133)}${win(204)}
    <rect x="162" y="148" width="36" height="6.5" rx="3.2" fill="#EADBC6"/>
    <rect x="167" y="157" width="26" height="9.5" rx="3.4" fill="${C.v('#F8B9AE',.2)}"/><path d="M171 160 h18 M171 163.4 h18" stroke="#fff" stroke-width="1.1" opacity=".8" stroke-linecap="round"/>
    <circle cx="197.5" cy="119" r="2.6" fill="${night?'#FFF3B0':'#FFE89A'}"/>`}

/* ---------- 樹（大樹結果子；小樹開花） ---------- */
function yTree(C,x,y,s,fruit){
  return `<g transform="translate(${x} ${y}) scale(${s})">${ySh(0,2,32,7.5)}
    <path d="M-8 0 Q-6 -28 -6.5 -50 L6.5 -50 Q6 -28 8 0 Z" fill="${C.v('#B9855A')}"/>${yHl(-3,-26,1.4,12,.18)}
    <g class="sway"><circle cx="-22" cy="-56" r="22" fill="${C.g('#7FCB7A',.34,-.16)}"/><circle cx="22" cy="-58" r="22" fill="${C.g('#6FBF6E',.34,-.16)}"/>
      <circle cx="0" cy="-78" r="31" fill="${C.g('#86D283',.36,-.16)}"/><circle cx="0" cy="-52" r="19" fill="${C.g('#7CC978',.3,-.14)}"/>${yHl(-11,-93,11,6,.32,-18)}
      ${fruit?[[-13,-80],[15,-66],[-26,-56],[7,-94],[26,-54],[-3,-58]].map(([fx,fy])=>`<circle cx="${fx}" cy="${fy}" r="5" fill="${C.g('#FF8A80',.4,-.12)}"/><circle cx="${fx-1.6}" cy="${fy-1.8}" r="1.3" fill="#fff" opacity=".7"/>`).join('')
        :[[-12,-82],[14,-66],[-24,-58],[6,-92],[24,-54],[-4,-64]].map(([fx,fy])=>`<g>${[0,1,2,3,4].map(k=>`<circle cx="${(fx+Math.cos(k*1.2566)*2.6).toFixed(1)}" cy="${(fy+Math.sin(k*1.2566)*2.6).toFixed(1)}" r="2.3" fill="#FFC4DC"/>`).join('')}<circle cx="${fx}" cy="${fy}" r="1.5" fill="#FFE9A0"/></g>`).join('')}
    </g></g>`}

/* ---------- 鞦韆、帳篷、路燈、信箱 ---------- */
function ySwing(C){return `<g transform="translate(24 160)">${ySh(28,60,32,5)}
    <path d="M3 58 L11 3 M53 58 L45 3" stroke="${tint('#C99467',-.05)}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M8 4 H48" stroke="#C99467" stroke-width="6" stroke-linecap="round"/>${yHl(28,2.4,14,1.2,.3)}
    <g class="swing"><path d="M20 5 V38 M36 5 V38" stroke="#A9A4BF" stroke-width="1.8"/><rect x="14" y="37" width="28" height="7" rx="3.5" fill="${C.v('#FF9EB0')}"/>${yHl(22,39,6,1.3,.5)}</g></g>`}
function yTent(C){return `<g transform="translate(266 220)">${ySh(32,47,34,5)}
    <path d="M2 46 Q-1 46 1 42 L29 3 Q32 -1 35 3 L63 42 Q65 46 62 46 Z" fill="${C.v('#FFC870',.3,-.12)}"/>
    <path d="M32 8 Q27 30 23 46 H41 Q37 30 32 8 Z" fill="${C.v('#E39A3B')}"/>${yHl(21,23,4.6,9,.3,18)}
    <path d="M32 2 V-8" stroke="#B9855A" stroke-width="2" stroke-linecap="round"/><path class="flag" d="M32 -8 L41 -5 L32 -2 Z" fill="#FF9EC4"/></g>`}
function yLamp(C,night){return `<g transform="translate(240 190)">${ySh(0,46,9,2.8)}
    <rect x="-2.5" y="8" width="5" height="38" rx="2.5" fill="${C.v('#8E8AA8')}"/><rect x="-6" y="42" width="12" height="5" rx="2.5" fill="${C.v('#8E8AA8')}"/>
    <circle cx="0" cy="4" r="8.5" fill="${C.g(night?'#FFF0A8':'#FFE89A',.6)}"/>${yHl(-3,0,3,2,.7)}
    <path d="M-7.5 -2 Q0 -9 7.5 -2" stroke="${tint('#8E8AA8',-.1)}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`}
function yMailbox(C){return `<g transform="translate(146 262)">${ySh(0,20,8,2.4)}
    <rect x="-2" y="2" width="4" height="18" rx="2" fill="${C.v('#C99467')}"/>
    <rect x="-9" y="-10" width="18" height="13" rx="6" fill="${C.v('#A9D3F2',.3,-.14)}"/>${yHl(-3,-7,4,1.6,.5)}
    <rect x="-4" y="-5.4" width="8" height="1.8" rx=".9" fill="#5E8FB8" opacity=".7"/>
    <path d="M9 -6 v-7 h5 v4 h-5" fill="#FF8A80"/></g>`}

/* ---------- 菜園：木框裡分成一格一格 ---------- */
function yCrop(C,k,x,y){
  if(k==='carrot')return `<path d="M${x-3} ${y-4} q-3 -8 1 -11 M${x} ${y-4} q0 -10 3 -12 M${x+3} ${y-4} q4 -7 6 -8" stroke="#6FBF6E" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y-3}" rx="4.4" ry="3" fill="${C.g('#FFA552')}"/>`;
  if(k==='tomato')return `<path d="M${x} ${y} v-12" stroke="#5DAF62" stroke-width="2" stroke-linecap="round"/><circle cx="${x-4}" cy="${y-8}" r="4.6" fill="${C.g('#FF7B6B')}"/><circle cx="${x+4}" cy="${y-13}" r="4" fill="${C.g('#FF7B6B')}"/><ellipse cx="${x+4.6}" cy="${y-5}" rx="3.6" ry="1.8" fill="#7FCB7A" transform="rotate(-20 ${x+4.6} ${y-5})"/>`;
  return `<path d="M${x} ${y} v-8" stroke="#5DAF62" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="${x-3.6}" cy="${y-9}" rx="4" ry="2.3" fill="${C.g('#86D283')}" transform="rotate(-24 ${x-3.6} ${y-9})"/><ellipse cx="${x+3.6}" cy="${y-10}" rx="4" ry="2.3" fill="${C.g('#6FBF6E')}" transform="rotate(24 ${x+3.6} ${y-10})"/>`}
function yGardenBed(C){return `<rect x="19" y="239" width="86" height="46" rx="9" fill="#3F5A30" opacity=".13"/>
    <rect x="19" y="236" width="86" height="46" rx="9" fill="${C.v('#D0A073',.2,-.14)}"/>
    <rect x="24" y="240.5" width="76" height="36" rx="6" fill="${C.v('#8A5E3F',.08,-.1)}"/>
    <path d="M24 258.5 h76 M49.3 240.5 v36 M74.6 240.5 v36" stroke="#D0A073" stroke-width="2.6"/>`}
function yGardenPlants(C){return `<g class="sway" style="animation-duration:6s">${yCrop(C,'carrot',36.5,256)}${yCrop(C,'tomato',62,256)}${yCrop(C,'sprout',87.5,255)}</g>
    ${yCrop(C,'sprout',36.5,274)}${yCrop(C,'carrot',62,274)}${yCrop(C,'tomato',87.5,274)}
    <g transform="translate(118 250)">${ySh(0,3,8,2.2)}<path d="M-6 -8 h11 l1.4 10 h-13.8 Z" fill="${C.v('#A9D3F2',.3,-.14)}"/><path d="M5 -5 q7 -1 8 -6" stroke="#8DBFDD" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 -4 q-5 0 -5 4" stroke="#8DBFDD" stroke-width="2" fill="none" stroke-linecap="round"/></g>`}

/* ---------- 花和小樹叢 ---------- */
const Y_FCOL=['#FF8A80','#FFB3D1','#FFD86B','#B9A0F0','#FFFFFF'];
function yFlower(C,x,y,c,r=4){return `<g class="sway" style="animation-delay:-${(x%7)*.6}s;animation-duration:${4+x%3}s"><path d="M${x} ${y} v${r*2.3}" stroke="#5DAF62" stroke-width="1.7" stroke-linecap="round"/>
    ${[0,1,2,3,4].map(k=>{const a=k*1.2566-1.57;return `<circle cx="${(x+Math.cos(a)*r*.62).toFixed(1)}" cy="${(y+Math.sin(a)*r*.62).toFixed(1)}" r="${r*.5}" fill="${c==='#FFFFFF'?'#fff':C.g(c,.35)}"/>`}).join('')}<circle cx="${x}" cy="${y}" r="${r*.36}" fill="#FFE08A"/></g>`}
function yBush(C,x,y,r,c='#98D488'){return `${ySh(x+r*.3,y+r*.75,r*1.3,r*.3,.12)}<circle cx="${x-r*.5}" cy="${y}" r="${r*.8}" fill="${C.g(tint(c,-.06),.3,-.12)}"/><circle cx="${x+r*.5}" cy="${y-r*.15}" r="${r}" fill="${C.g(c,.3,-.12)}"/>${yHl(x+r*.2,y-r*.6,r*.36,r*.2,.3)}`}

/* ---------- 前面的白色矮圍籬，中間留一個門口 ---------- */
function yFence(C){const pk=(x)=>`<rect x="${x}" y="281" width="5.4" height="15" rx="2.7" fill="${C.v('#FFFBF2',.1,-.08)}" stroke="#E3D3B8" stroke-width=".7"/>`;
  let v=`<path d="M14 288 H160 M200 288 H346" stroke="#EADBC6" stroke-width="3" stroke-linecap="round"/><path d="M14 293.5 H160 M200 293.5 H346" stroke="#E3D3B8" stroke-width="2.4" stroke-linecap="round"/>`;
  for(let x=16;x<=150;x+=9.6)v+=pk(x);for(let x=206;x<=341;x+=9.6)v+=pk(x);
  const post=(x)=>`<rect x="${x-3.6}" y="275" width="7.2" height="22" rx="3" fill="${C.v('#FFFBF2',.1,-.1)}" stroke="#E3D3B8" stroke-width=".8"/><circle cx="${x}" cy="274" r="4.2" fill="${C.g('#FFF6E4',.3,-.1)}" stroke="#E3D3B8" stroke-width=".7"/>`;
  return v+post(160)+post(200)}

/* ---------- 環境小生命：白天蝴蝶、晚上螢火蟲 ---------- */
function yAmbient(C,night){
  const bf=(cls,c)=>`<g class="bfly ${cls}"><g class="flap"><ellipse cx="-3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="-2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/><ellipse cx="2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/></g><rect x="-.6" y="-3" width="1.2" height="7" rx=".6" fill="#6B5A52"/></g>`;
  if(night)return `<g pointer-events="none">${[[44,170],[112,214],[150,120],[226,176],[300,236],[332,140],[84,262],[204,268]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><g class="ffly" style="animation-delay:-${i*1.3}s;animation-duration:${7+i%4}s"><circle r="5.5" fill="${C.glow('ffG','#FFF59A')}"/><circle r="1.3" fill="#FFFBD0"/></g></g>`).join('')}</g>`;
  return `<g pointer-events="none">${bf('b1','#FFB3D1')}${bf('b2','#B9A0F0')}${bf('b3','#FFD86B')}</g>`}


/* ---------- 生成圖 ---------- */
const Y_IMG={house:['img/yard_house.webp',465,520],apple:['img/yard_tree_apple.webp',449,520],blossom:['img/yard_tree_blossom.webp',432,520]};
function yImg(k,x,y,w){const [src,iw,ih]=Y_IMG[k],h=w*ih/iw;return `<image href="${src}" x="${(x-w/2).toFixed(1)}" y="${(y-h).toFixed(1)}" width="${w}" height="${h.toFixed(1)}"/>`}
/* 房子：生成圖；晚上窗戶亮起來的位置是量原圖算出來的 */
const YH={x0:110,w:140,ow:1013,oh:1135};
function yHouseImg(night){const k=YH.w/YH.ow,y0=166-YH.oh*k,cx=YH.x0+767*k,cy=y0+40*k;
  return `${ySh(180,165,78,7,.16)}${night?'':[0,2,4].map(d=>`<circle class="smoke" style="animation-delay:${d}s" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="#fff"/>`).join('')}
    <image href="${Y_IMG.house[0]}" x="${YH.x0}" y="${y0.toFixed(1)}" width="${YH.w}" height="${(YH.oh*k).toFixed(1)}"/>`}
function yWinGlow(){const k=YH.w/YH.ow,y0=166-YH.oh*k;return [157,703].map(px=>{const x=YH.x0+px*k,y=y0+873*k,w=152*k,h=79*k;
  return `<rect x="${(x-4).toFixed(1)}" y="${(y-4).toFixed(1)}" width="${(w+8).toFixed(1)}" height="${(h+8).toFixed(1)}" rx="5" fill="#FFE59A" opacity=".25"/><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#FFE59A"/>`}).join('')}

/* 菜園裡長的是孩子自己種的菜（store.crop：k 種類、st 0–3 長大階段） */
function yGardenCrops(C,crop){if(!crop)return `<text x="62" y="263" text-anchor="middle" font-size="8" fill="#F1E1C8" opacity=".9">還沒種東西</text>`;
  const st=crop.st||0,k=crop.k||'carrot',out=[];
  [[36.5,256],[62,256],[87.5,256],[36.5,274],[62,274],[87.5,274]].forEach(([x,y])=>{
    if(st>=3)out.push(yCrop(C,k,x,y));
    else if(st>=1)out.push(yCrop(C,'sprout',x,y));
    else out.push(`<ellipse cx="${x}" cy="${y-3}" rx="3" ry="1.6" fill="#B98558"/>`)});
  return `<g class="sway" style="animation-duration:6s">${out.join('')}</g>`}
function yCan(C){return `<g transform="translate(118 250)">${ySh(0,3,8,2.2)}<path d="M-6 -8 h11 l1.4 10 h-13.8 Z" fill="${C.v('#A9D3F2',.3,-.14)}"/><path d="M5 -5 q7 -1 8 -6" stroke="#8DBFDD" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 -4 q-5 0 -5 4" stroke="#8DBFDD" stroke-width="2" fill="none" stroke-linecap="round"/></g>`}
/* 花圃：買幾次長幾叢 */
function yFlowerBed(C,n){const spots=[[116,140,'#FFB3D1'],[99,143,'#FFD86B'],[244,140,'#FF8A80'],[262,143,'#B9A0F0'],[122,270,'#FF8A80'],[132,273,'#FFD86B'],[214,271,'#FFB3D1'],[224,274,'#B9A0F0'],[236,270,'#FFD86B']];
  return spots.slice(0,Math.min(spots.length,3+n*3)).map(([x,y,c])=>yFlower(C,x,y,c)).join('')}
function yRainbow(){return `<g fill="none" stroke-width="5" stroke-linecap="round" opacity=".7">${['#FF9A8E','#FFC27A','#FFE38A','#A6DC94','#9CC2F5','#C6AEF2'].map((c,i)=>`<path d="M${70+i*6} 66 A${110-i*6} ${52-i*5} 0 0 1 ${290-i*6} 66" stroke="${c}"/>`).join('')}</g>`}

/* 家具的位置：每樣東西有固定的家，布置時可以拖動（存在 store.ypos） */
store.ypos=store.ypos||{};
function posOf(id){const p=store.ypos[id];return p&&typeof p==='object'?[p.x,p.y]:[0,0]}
const Y_ITEMS={
  house:{base:151,draw:(C,x)=>yHouseImg(x.night),box:[104,4,152,166]},
  tree:{base:138,draw:(C,x)=>{const s=[.72,.86,1][(x.g.tree||1)-1];return `<g data-kind="tree">${ySh(44,139,36*s,8*s)}<g class="sway">${yImg('apple',44,142,98*s)}</g></g>`}},
  swing:{base:220,draw:C=>ySwing(C)},
  lamp:{base:236,draw:(C,x)=>yLamp(C,x.night)},
  tent:{base:268,draw:C=>yRug()+yTent(C)},
  pond:{base:190,flat:true,draw:(C,x)=>yPond(C)+yReeds()},
  garden:{base:270,flat:true,draw:(C,x)=>yGardenBed(C)+yGardenCrops(C,x.crop)+yCan(C)},
  flowers:{base:284,draw:(C,x)=>yFlowerBed(C,x.g.flowers||1)}
};
function yWrap(id,inner){const [dx,dy]=posOf(id);return `<g data-it="${id}" transform="translate(${dx} ${dy})" ${S.decor?'class="decor-it"':''}>${inner}</g>`}

/* 主角、怪獸、夥伴：腳底對齊 (x,y) */
const Y_MON_POS=[[130,218],[210,256],[86,236],[264,236],[156,262],[300,262],[60,200],[236,214],[110,264],[324,214],[196,226],[44,264]];
const Y_HERO_HOME=[180,198];
function yActor(attrs,x,y,inner,cls,delay,extra){return `<g ${attrs} class="actor ${cls||''}" style="transform:translate(${x}px,${y}px);${extra||''}"><ellipse cx="0" cy="0" rx="12" ry="3.6" fill="#3F5A30" opacity=".2"/><g class="flip"><g class="act ${isNight()?'sleepy':'bob'}" style="animation-delay:${delay||0}s">${inner}</g></g>${isNight()?`<text class="zzz" x="12" y="-40" font-size="10" fill="#fff">Z<tspan font-size="7" dy="-4">z</tspan></text>`:''}</g>`}
function yMonArt(svg){return `<g transform="translate(-21 -41)">${svg}</g>`}
function yHeroArt(){const t=store.hero.type;return `<g transform="translate(-23 -60)">${hero(t,46)}</g>`}

function scene(){
  const o=store.owned,g=store.grow,night=isNight(),C=Clay('yd');
  const ctx={g,night,crop:store.crop,fish:store.fish};
  let flat=ySky(C,night)+(o.includes('rainbowsky')?yRainbow():'')+yTreeline(C)+yGround(C)+yHedge(C)+yPatio()+yPath(C)
    +[[112,208],[132,252],[252,248],[332,226],[22,152],[94,176]].map(([x,y])=>yFlower(C,x,y-6,'#FFFFFF',3.4)).join('');
  const L=[];const add=(y,h)=>L.push([y,h]);
  /* 永遠在的小東西：開花小樹、樹叢、信箱、圍籬 */
  add(128,`<g data-kind="tree">${ySh(318,129,26,6)}<g class="sway">${yImg('blossom',318,131,70)}</g></g>`);
  add(139,yBush(C,100,130,9)+yBush(C,266,132,9,'#8ACB7B'));
  add(152,yBush(C,108,146,8)+yBush(C,252,146,8,'#8ACB7B'));
  add(283,yMailbox(C));add(284,yBush(C,348,262,8));add(299,yFence(C));
  Object.entries(Y_ITEMS).forEach(([id,it])=>{if(!o.includes(id))return;const h=yWrap(id,it.draw(C,ctx));
    if(it.flat&&!S.decor)flat+=h;else add(it.base+posOf(id)[1],h)});
  const fr=Object.keys(EMO).filter(k=>(store.xp[k]||0)>0),jf=Object.keys(JOY).filter(k=>jxpOf(k)>0);
  const dim=S.decor?'pointer-events:none;opacity:.55;':'';
  fr.forEach((k,i)=>{const [x,y]=HOME_POS[k]||Y_MON_POS[i%Y_MON_POS.length];add(y,yActor(`data-mon="${k}" data-actor="m"`,x,y,yMonArt(monster(k,42)),'homemon',i*.5,dim))});
  jf.forEach((k,i)=>{const id='j-'+k,j=fr.length+i,[x,y]=HOME_POS[id]||Y_MON_POS[j%Y_MON_POS.length];add(y,yActor(`data-mon="${id}" data-actor="m"`,x,y,yMonArt(friend(k,42)),'homemon',j*.5,dim))});
  if(store.hero){const [x,y]=HOME_POS.hero||Y_HERO_HOME;add(y,yActor('data-actor="h"',x,y,yHeroArt()))}
  /* 每一層用 data-y 記住腳的位置，走路時重新排前後 */
  const sorted=L.sort((a,b)=>a[0]-b[0]).map(([y,h])=>`<g class="yl" data-y="${y}">${h}</g>`).join('');
  let top='';
  if(night)top+=`<rect width="360" height="300" fill="#1F2566" opacity=".46" style="mix-blend-mode:multiply" pointer-events="none"/>
    <g pointer-events="none">${o.includes('house')?yWinGlow():''}${o.includes('lamp')?`<circle class="twinkle" cx="${240+posOf('lamp')[0]}" cy="${196+posOf('lamp')[1]}" r="42" fill="${C.glow('lampG','#FFE9A0')}"/>`:''}</g>`;
  top+=yAmbient(C,night);
  if(!fr.length&&!jf.length)top+=`<g pointer-events="none"><rect x="70" y="282" width="220" height="15" rx="7.5" fill="#FFFDF8" opacity=".85"/><text x="180" y="292.6" text-anchor="middle" font-size="8.6" fill="#5C4A3D">去冷靜站陪一隻怪獸冷靜，牠就會搬進家園喔</text></g>`;
  return `<svg class="yard" viewBox="0 0 360 300" width="100%" style="display:block;border-radius:18px" role="img" aria-label="家園：從上面看的院子">${C.defs()}${flat}<g id="ysorted">${sorted}</g>${top}</svg>`;
}

/* 不能走進池塘、菜園、帳篷、鞦韆裡面 */
function yFix(x,y){x=Math.max(22,Math.min(338,x));y=Math.max(170,Math.min(276,y));
  const o=store.owned,P=id=>posOf(id);
  if(o.includes('pond')){const [px,py]=P('pond');let dx=(x-298-px)/52,dy=(y-190-py)/31,d=Math.hypot(dx,dy);if(d<1){dy=Math.abs(dy)+.25;d=Math.hypot(dx,dy);x=298+px+dx/d*54;y=190+py+dy/d*33}}
  if(o.includes('garden')){const [gx,gy]=P('garden');if(x>12+gx&&x<124+gx&&y>230+gy&&y<288+gy)y=228+gy}
  if(o.includes('tent')){const [tx,ty]=P('tent');if(x>256+tx&&x<340+tx&&y>214+ty&&y<280+ty)y=Math.min(276,282+ty)}
  if(o.includes('swing')){const [sx,sy]=P('swing');if(x>18+sx&&x<86+sx&&y>194+sy&&y<224+sy)y=227+sy}
  return [Math.max(22,Math.min(338,x)),Math.max(170,Math.min(276,y))]}
function yResort(root){const L=$(root+' #ysorted');if(!L)return;const kids=[...L.children];
  kids.forEach(k=>{const a=k.querySelector(':scope > .actor');if(a){const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(a.style.transform);if(m)k.dataset.y=m[2]}});
  const want=kids.slice().sort((p,q)=>p.dataset.y-q.dataset.y);if(want.some((e,i)=>e!==kids[i]))want.forEach(e=>L.appendChild(e))}
function yMoveTo(el,id,nx,ny,speed,root){const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform)||[0,180,200];const x=+m[1],y=+m[2];
  const dist=Math.hypot(nx-x,ny-y),dur=Math.max(.6,dist/speed);el.querySelector('.flip').classList.toggle('left',nx<x);
  el.style.transition=`transform ${dur}s linear`;el.style.transform=`translate(${nx.toFixed(1)}px,${ny.toFixed(1)}px)`;HOME_POS[id]=[nx,ny];
  actDo(el,'walk',dur*1000);clearTimeout(el._rs);const t0=performance.now(),tick=()=>{yResort(root);if(performance.now()-t0<dur*1000+100)el._rs=setTimeout(tick,120)};tick();return dur}

/* 主角和怪獸在院子裡慢慢晃（晚上睡覺、布置時暫停） */
function startWander(root='#scene'){clearInterval(wanderT);if(RM||isNight()||S.decor)return;
  const actors=$$(root+' .actor');actors.forEach(el=>{el._next=performance.now()+1200+Math.random()*2500});
  wanderT=setInterval(()=>{if(!actors.length||!actors[0].isConnected){clearInterval(wanderT);return}
    const now=performance.now();
    actors.forEach(el=>{if(now<el._next)return;const isHero=el.dataset.actor==='h';if(isHero&&el._busy>now)return;const r=Math.random();
      const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform)||[0,180,200];const x=+m[1],y=+m[2];
      if(r<.45){const [nx,ny]=yFix(x+(Math.random()*90-45),y+(Math.random()*30-15));const id=isHero?'hero':el.dataset.mon;
        const dur=yMoveTo(el,id,nx,ny,isHero?26:18,root);el._next=now+dur*1000+2000+Math.random()*3000}
      else if(r<.7){actDo(el,'rest',5000);el._next=now+6000+Math.random()*3000}
      else if(r<.85){actDo(el,'hop',1000);el._next=now+2500+Math.random()*2500}
      else{actDo(el,'look',2400);el._next=now+3500+Math.random()*2500}})},400)}

function bindScene(){
  const svg=$('#scene svg');if(!svg)return;
  const toPt=ev=>{const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())};
  if(S.decor){svg.style.touchAction='none';
    $$('#scene [data-it]').forEach(el=>{el.onpointerdown=ev=>{ev.preventDefault();const id=el.dataset.it;const [x0,y0]=posOf(id);
      const k=360/svg.getBoundingClientRect().width,sx=ev.clientX,sy=ev.clientY;let nx=x0,ny=y0;try{el.setPointerCapture(ev.pointerId)}catch(e){}el.classList.add('dragging');
      el.onpointermove=e=>{nx=Math.max(-300,Math.min(300,x0+(e.clientX-sx)*k));ny=Math.max(-120,Math.min(110,y0+(e.clientY-sy)*k));el.setAttribute('transform',`translate(${nx.toFixed(1)} ${ny.toFixed(1)})`)};
      el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;el.classList.remove('dragging');store.ypos[id]={x:Math.round(nx),y:Math.round(ny)};save();tone(520,.06)}}});
    return}
  /* 點池塘、菜園、花：去那個小角落（跟以前一樣） */
  [['pond',24],['garden',25],['flowers',25]].forEach(([id,st])=>{const el=$(`#scene [data-it="${id}"]`);if(el)el.onclick=ev=>{ev.stopPropagation();
    if(isNight()){toast('晚上了，大家都在睡覺，明天再來吧 🌙');return}go(st)}});
  $$('#scene [data-mon]').forEach(el=>el.onclick=ev=>{ev.stopPropagation();const k=el.dataset.mon;
    if(k.startsWith('j-')){const j=JOY[k.slice(2)];const line=JOY_PEP[Math.floor(Math.random()*JOY_PEP.length)];toast(`${j.name}：「${line}」`);speak(line);actDo(el,'hop',900);return}
    const e=EMO[k],l=lvOf(store.xp[k]||0),b=BADGE[k];
    const line=stageOf(l)>=2?`我學會了${b[1]}：${b[2]}！`:HOME_PEP[Math.floor(Math.random()*HOME_PEP.length)];
    toast(`${e.name}：「${line}」`);speak(line);actDo(el,'hop',900)});
  /* 點地面：主角走過去；走到怪獸旁邊，牠會跳一下 */
  svg.onclick=ev=>{if(isNight())return;const q=toPt(ev);
    const tr=ev.target.closest('[data-kind="tree"]');if(tr&&!RM){const s=tr.querySelector('.sway');if(s){s.classList.remove('shake');void s.getBBox();s.classList.add('shake')}}
    const h=$('#scene [data-actor="h"]');if(!h||q.y<90)return;
    let [x,y]=yFix(q.x,q.y);
    $$('#scene [data-mon]').forEach(m=>{const mm=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(m.style.transform);if(mm&&Math.hypot(x-mm[1],(y-mm[2])*1.5)<22){x=+mm[1]+(x<+mm[1]?-24:24);y=+mm[2]+2}});
    const dur=yMoveTo(h,'hero',x,y,70,'#scene');h._busy=performance.now()+dur*1000+4000;
    setTimeout(()=>{if(!h.isConnected)return;$$('#scene [data-mon]').forEach(m=>{const mm=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(m.style.transform);if(mm&&Math.hypot(x-mm[1],y-mm[2])<36)actDo(m,'hop',900)})},dur*1000)};
  startWander();
}

/* ---------- 主角：小熊、小狗換成新比例的生成圖，可以換 4 套衣服 ---------- */
HEROES.dog=HEROES.dog||{name:'小狗',c:'#D9824A'};
const Y_HERO_NEW={bear:[[152,260],[162,260],[162,260],[155,260]],dog:[[169,260],[194,260],[194,260],[173,260]]};
const Y_OUTFITS=[['粉紅毛衣','#F5A9B8'],['薄荷點點','#93D8BF'],['鵝黃條紋','#FBD56E'],['天空格子','#9CCBEF']];
const yHeroOld=hero;
hero=function(type,size=90,eqo){
  if(!Y_HERO_NEW[type])return yHeroOld(type,size,eqo);
  const eq=eqo||store.equip||{};const of=Math.max(1,Math.min(4,(eqo?1:(store.hero&&store.hero.type===type&&store.hero.outfit)||1)));
  const [iw,ih]=Y_HERO_NEW[type][of-1],h=124,w=h*iw/ih;
  /* 頭頂大約在圖的最上面往下 6%，頭寬大約是圖寬的 70%（小狗的耳朵比較寬，頭寬抓 60%） */
  const hw=w*(type==='dog'?.6:.7),hs=hw/60,top=-6+h*.04;
  const cape=eq.hback==='cape'?`<path d="M28 62 Q50 54 72 62 L84 114 Q50 122 16 114Z" fill="#E4574B"/><path d="M28 62 Q50 54 72 62" stroke="#B8382F" stroke-width="3" fill="none"/>`:'';
  const pack=eq.hback==='pack'?`<rect x="68" y="66" width="20" height="30" rx="8" fill="#5B8DEF"/><rect x="72" y="73" width="12" height="7" rx="2" fill="#3E6FD0"/>`:'';
  const hat=eq.hhead==='straw'?`<ellipse cx="50" cy="22" rx="34" ry="7" fill="#E9C46A"/><path d="M34 22 Q36 4 50 4 Q64 4 66 22Z" fill="#F2D384"/><rect x="34" y="15" width="32" height="5" fill="#E76F51"/>`
    :eq.hhead==='wizard'?`<path d="M28 24 L54 -14 L72 24Z" fill="#7B5CC9"/><ellipse cx="50" cy="24" rx="27" ry="5" fill="#5E43A8"/><circle cx="54" cy="-13" r="4" fill="#FFD166"/><path d="M50 4 l2 -5 l2 5 l5 1 l-4 3 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -3z" fill="#FFD166"/>`:'';
  return `<svg width="${size}" height="${Math.round(size*1.36)}" viewBox="0 -16 100 136" overflow="visible">${cape}${pack}
    <image href="img/hero_${type}${of}.webp" x="${(50-w/2).toFixed(1)}" y="-6" width="${w.toFixed(1)}" height="${h}"/>
    ${hat?`<g transform="translate(50 ${top.toFixed(1)}) scale(${hs.toFixed(2)}) translate(-50 -22)">${hat}</g>`:''}</svg>`};

/* 選主角的頁面：小熊、小狗多一排衣服可以選 */
const yRenderHeroesOld=renderHeroes;
renderHeroes=function(){yRenderHeroesOld();let box=$('#yOutfits');
  if(!box){box=document.createElement('div');box.id='yOutfits';box.className='chips';box.style.marginTop='10px';$('#heroes').after(box)}
  const t=heroPick;if(!Y_HERO_NEW[t]){box.innerHTML='';return}
  const cur=(store.hero&&store.hero.type===t&&store.hero.outfit)||S.yOutfit||1;S.yOutfit=cur;
  box.innerHTML=`<p class="hint" style="width:100%;margin:0 0 4px">選一件衣服</p>`+Y_OUTFITS.map(([n,c],i)=>`<button class="chip ${cur===i+1?'sel':''}" data-of="${i+1}"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${c};vertical-align:-3px;margin-right:6px"></i>${n}</button>`).join('');
  $$('#yOutfits [data-of]').forEach(b=>b.onclick=()=>{S.yOutfit=+b.dataset.of;if(store.hero&&store.hero.type===t){store.hero.outfit=S.yOutfit;save()}tone(600,.1);renderHeroes()});
  const sel=$(`[data-hero="${t}"] svg image`);if(sel)sel.setAttribute('href',`img/hero_${t}${cur}.webp`)};
$('#heroOk').onclick=()=>{const nm=$('#heroNameIn').value.trim()||HEROES[heroPick].name;store.hero={type:heroPick,name:nm};if(Y_HERO_NEW[heroPick])store.hero.outfit=S.yOutfit||1;save();chime();go(10)};
