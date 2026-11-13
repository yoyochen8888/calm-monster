/* =========================================================
   院子（v35）：Spark 生成的 2.5D 院子
   - 底圖 img/yard_bg.webp：天空、樹籬、草地、鋪磚、木平台、踏石、白圍籬（畫面 360×300 整張鋪滿）
   - 房子、樹、池塘、菜園、帳篷、鞦韆、路燈、信箱、盆栽、桌椅…：一張一張生成圖（img/y_*.webp），用「腳踩在哪裡」排前後
   - 會動的東西（雲、蝴蝶、螢火蟲、水面閃光、搖晃）還是程式畫
   - 載入在 home.js 後面，覆蓋 scene()、bindScene()、startWander()、posOf()、hero()
   想退回舊家園：把 index.html 裡 yard.js 那一行拿掉就好。
   ========================================================= */
const ySh=(cx,cy,rx,ry,o=.15)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3F5A30" opacity="${o}"/>`;
const yHl=(cx,cy,rx,ry,o=.45,rot=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}"${rot?` transform="rotate(${rot} ${cx} ${cy})"`:''}/>`;
function yCloud(C,x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-12" cy="0" r="9" fill="#fff"/><circle cx="2" cy="-5" r="12" fill="#fff"/><circle cx="15" cy="0" r="8" fill="#fff"/><rect x="-20" y="-1" width="42" height="9" rx="4.5" fill="#FBFDFF"/></g>`}
/* ---------- 菜園：木框裡分成一格一格 ---------- */
function yCrop(C,k,x,y){
  if(k==='carrot')return `<path d="M${x-3} ${y-4} q-3 -8 1 -11 M${x} ${y-4} q0 -10 3 -12 M${x+3} ${y-4} q4 -7 6 -8" stroke="#6FBF6E" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="${x}" cy="${y-3}" rx="4.4" ry="3" fill="${C.g('#FFA552')}"/>`;
  if(k==='tomato')return `<path d="M${x} ${y} v-12" stroke="#5DAF62" stroke-width="2" stroke-linecap="round"/><circle cx="${x-4}" cy="${y-8}" r="4.6" fill="${C.g('#FF7B6B')}"/><circle cx="${x+4}" cy="${y-13}" r="4" fill="${C.g('#FF7B6B')}"/><ellipse cx="${x+4.6}" cy="${y-5}" rx="3.6" ry="1.8" fill="#7FCB7A" transform="rotate(-20 ${x+4.6} ${y-5})"/>`;
  return `<path d="M${x} ${y} v-8" stroke="#5DAF62" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="${x-3.6}" cy="${y-9}" rx="4" ry="2.3" fill="${C.g('#86D283')}" transform="rotate(-24 ${x-3.6} ${y-9})"/><ellipse cx="${x+3.6}" cy="${y-10}" rx="4" ry="2.3" fill="${C.g('#6FBF6E')}" transform="rotate(24 ${x+3.6} ${y-10})"/>`}
/* ---------- 花和小樹叢 ---------- */
const Y_FCOL=['#FF8A80','#FFB3D1','#FFD86B','#B9A0F0','#FFFFFF'];
function yFlower(C,x,y,c,r=4){return `<g class="sway" style="animation-delay:-${(x%7)*.6}s;animation-duration:${4+x%3}s"><path d="M${x} ${y} v${r*2.3}" stroke="#5DAF62" stroke-width="1.7" stroke-linecap="round"/>
    ${[0,1,2,3,4].map(k=>{const a=k*1.2566-1.57;return `<circle cx="${(x+Math.cos(a)*r*.62).toFixed(1)}" cy="${(y+Math.sin(a)*r*.62).toFixed(1)}" r="${r*.5}" fill="${c==='#FFFFFF'?'#fff':C.g(c,.35)}"/>`}).join('')}<circle cx="${x}" cy="${y}" r="${r*.36}" fill="#FFE08A"/></g>`}
/* ---------- 環境小生命：白天蝴蝶、晚上螢火蟲 ---------- */
function yAmbient(C,night){
  const bf=(cls,c)=>`<g class="bfly ${cls}"><g class="flap"><ellipse cx="-3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="3" cy="-1.5" rx="3.2" ry="4" fill="${c}"/><ellipse cx="-2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/><ellipse cx="2.2" cy="3" rx="2.2" ry="2.6" fill="${tint(c,.25)}"/></g><rect x="-.6" y="-3" width="1.2" height="7" rx=".6" fill="#6B5A52"/></g>`;
  if(night)return `<g pointer-events="none">${[[44,170],[112,214],[150,120],[226,176],[300,236],[332,140],[84,262],[204,268]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><g class="ffly" style="animation-delay:-${i*1.3}s;animation-duration:${7+i%4}s"><circle r="5.5" fill="${C.glow('ffG','#FFF59A')}"/><circle r="1.3" fill="#FFFBD0"/></g></g>`).join('')}</g>`;
  return `<g pointer-events="none">${bf('b1','#FFB3D1')}${bf('b2','#B9A0F0')}${bf('b3','#FFD86B')}</g>`}

function yRainbow(){return `<g fill="none" stroke-width="4" stroke-linecap="round" opacity=".6" pointer-events="none">${['#FF9A8E','#FFC27A','#FFE38A','#A6DC94','#9CC2F5','#C6AEF2'].map((c,i)=>`<path d="M${90+i*5} 44 A${90-i*5} ${36-i*4} 0 0 1 ${270-i*5} 44" stroke="${c}"/>`).join('')}</g>`}

/* ---------- 生成圖：每張圖記住原始寬高，畫的時候「腳底中間」對齊 (x,y) ---------- */
const Y_IMG={
  house:['img/yard_house.webp',465,520],apple:['img/yard_tree_apple.webp',449,520],blossom:['img/yard_tree_blossom.webp',432,520],
  pond:['img/y_pond.webp',440,309],garden:['img/y_garden.webp',420,251],tent:['img/y_tent.webp',400,377],swing:['img/y_swing.webp',335,400],
  lamp:['img/y_lamp.webp',114,300],mailbox:['img/y_mailbox.webp',186,240],bench:['img/y_bench.webp',240,196],birdhouse:['img/y_birdhouse.webp',122,240],
  trellis:['img/y_trellis.webp',240,188],table:['img/y_table.webp',240,222],chair:['img/y_chair.webp',163,240],basket:['img/y_basket.webp',215,240],
  bush:['img/y_bush.webp',240,224],pot:['img/y_pot.webp',170,240],flowers:['img/y_flowers.webp',240,163],fern:['img/y_fern.webp',237,240]};
function yImg(k,x,y,w,cls,style){const [src,iw,ih]=Y_IMG[k],h=w*ih/iw;
  const im=`<image href="${src}" x="${(x-w/2).toFixed(1)}" y="${(y-h).toFixed(1)}" width="${w}" height="${h.toFixed(1)}"/>`;
  return cls?`<g class="${cls}"${style?` style="${style}"`:''}>${im}</g>`:im}
/* 接觸陰影：軟軟的一圈，讓東西「站在」草地上 */
function ySoft(cx,cy,rx,ry,o=1){return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#yShG)" opacity="${o}"/>`}
const Y_DEFS=`<defs><radialGradient id="yShG"><stop offset="0" stop-color="#2F4A22" stop-opacity=".34"/><stop offset=".6" stop-color="#2F4A22" stop-opacity=".16"/><stop offset="1" stop-color="#2F4A22" stop-opacity="0"/></radialGradient>
  <radialGradient id="yGlow"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".85"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient></defs>`;

/* 房子坐在鋪磚的後半部；晚上窗戶亮起來的位置是量原圖算出來的 */
const YH={cx:180,base:150,w:122,ow:1013,oh:1135};
function yHouseBox(){const k=YH.w/YH.ow,h=YH.oh*k;return {k,x0:YH.cx-YH.w/2,y0:YH.base-h}}
function yHouseImg(night){const {k,x0,y0}=yHouseBox(),cx=x0+767*k,cy=y0+40*k;
  return `${ySoft(YH.cx,YH.base-2,72,10)}${night?'':[0,2,4].map(d=>`<circle class="smoke" style="animation-delay:${d}s" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.6" fill="#fff"/>`).join('')}
    ${yImg('house',YH.cx,YH.base,YH.w)}`}
function yWinGlow(){const {k,x0,y0}=yHouseBox();return [157,703].map(px=>{const x=x0+px*k,y=y0+873*k,w=152*k,h=79*k;
  return `<rect x="${(x-4).toFixed(1)}" y="${(y-4).toFixed(1)}" width="${(w+8).toFixed(1)}" height="${(h+8).toFixed(1)}" rx="5" fill="#FFE59A" opacity=".25"/><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="#FFE59A"/>`}).join('')}

/* 菜園：木框 6 格，孩子自己種的菜（store.crop：k 種類、st 0–3 長大階段） */
const YG={cx:126,base:252,w:80};
function yGardenCells(){const h=YG.w*251/420,x0=YG.cx-YG.w/2,y0=YG.base-h;
  return [[.2,.3],[.46,.3],[.73,.3],[.2,.62],[.46,.62],[.73,.62]].map(([fx,fy])=>[+(x0+YG.w*fx).toFixed(1),+(y0+h*fy).toFixed(1)])}
function yGardenCrops(C,crop){const cells=yGardenCells();
  if(!crop)return `<text x="${YG.cx-3}" y="${cells[3][1]-6}" text-anchor="middle" font-size="7.4" fill="#FFF4DE" opacity=".95">還沒種東西</text>`;
  const st=crop.st||0,k=crop.k||'carrot',out=[];
  cells.forEach(([x,y])=>{if(st>=3)out.push(yCrop(C,k,x,y));else if(st>=1)out.push(yCrop(C,'sprout',x,y));else out.push(`<ellipse cx="${x}" cy="${y-3}" rx="3" ry="1.6" fill="#B98558"/>`)});
  return `<g class="sway" style="animation-duration:6s">${out.join('')}</g>`}
function yCan(C,x,y){return `<g transform="translate(${x} ${y})">${ySoft(0,2,9,2.6)}<path d="M-6 -8 h11 l1.4 10 h-13.8 Z" fill="${C.v('#A9D3F2',.3,-.14)}"/><path d="M5 -5 q7 -1 8 -6" stroke="#8DBFDD" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-6 -4 q-5 0 -5 4" stroke="#8DBFDD" stroke-width="2" fill="none" stroke-linecap="round"/></g>`}
/* 池塘：圖上再加水面閃光、漣漪 */
const YP={cx:294,base:236,w:88};
function yPondArt(){const h=YP.w*309/440,cy=YP.base-h*.52;
  return `${ySoft(YP.cx,YP.base-4,48,12,.8)}${yImg('pond',YP.cx,YP.base,YP.w)}
    ${[[-14,-6],[8,4],[-2,10]].map(([dx,dy],i)=>`<ellipse class="tw" style="animation-delay:${i*.9}s" cx="${YP.cx+dx}" cy="${(cy+dy).toFixed(1)}" rx="3.2" ry=".9" fill="#fff" opacity=".85"/>`).join('')}<g id="ripples"></g>`}
/* 花圃：買幾次長幾叢 */
const Y_FSPOTS=[[100,184,22],[246,258,22],[224,214,20],[30,140,20],[166,274,18],[320,264,22],[276,182,18],[86,270,18],[228,172,18]];
function yFlowerSpots(n){return Y_FSPOTS.slice(0,Math.min(Y_FSPOTS.length,3+n*2))}
function yFlowerClump(x,y,w,i){return `${ySoft(x,y-1,w*.5,3)}${yImg('flowers',x,y,w,'sway',`animation-delay:-${i*.7}s;animation-duration:${5+i%3}s`)}`}

/* 家具的位置：每樣東西有固定的家，布置時可以拖動（存在 store.ypos，v35 換了新院子，舊的位置清掉重來） */
if(store.yv!==35){store.ypos={};store.yv=35}
store.ypos=store.ypos||{};
function posOf(id){const p=store.ypos[id];return p&&typeof p==='object'?[p.x,p.y]:[0,0]}
const Y_ITEMS={
  house:{base:YH.base,draw:(C,x)=>yHouseImg(x.night)},
  tree:{base:124,draw:(C,x)=>{const s=[.72,.86,1][(x.g.tree||1)-1];return `<g data-kind="tree">${ySoft(50,122,34*s,9*s)}${yImg('apple',50,124,92*s,'sway')}</g>`}},
  swing:{base:268,draw:C=>`${ySoft(62,266,30,6)}${yImg('swing',62,268,50)}`},
  lamp:{base:196,draw:C=>`${ySoft(250,195,8,2.6)}${yImg('lamp',250,196,13)}`},
  tent:{base:194,draw:C=>`${ySoft(58,190,36,8,.7)}${yImg('tent',58,194,70)}`},
  pond:{base:YP.base,draw:()=>yPondArt()},
  garden:{base:YG.base,draw:(C,x)=>`${ySoft(YG.cx,YG.base-2,44,8)}${yImg('garden',YG.cx,YG.base,YG.w)}${yGardenCrops(C,x.crop)}${yCan(C,YG.cx+50,YG.base-2)}`},
  flowers:{split:true}
};
function yWrap(id,inner){const [dx,dy]=posOf(id);return `<g data-it="${id}" transform="translate(${dx} ${dy})" ${S.decor?'class="decor-it"':''}>${inner}</g>`}
/* 一直都在的小擺設（不用買）：桌椅在木平台上、長椅、鳥屋、花架、盆栽、信箱 */
const Y_DECOR=[
  ['trellis',292,98,38],['table',282,136,24],['chair',302,140,13],['basket',272,118,10],
  ['fern',104,104,16],['pot',258,168,11],['bench',120,178,32],['birdhouse',340,176,12],
  ['mailbox',208,266,13],['bush',336,266,20],['bush',24,174,18],['bush',112,268,16]];

/* 主角、怪獸、夥伴：腳底對齊 (x,y) */
const Y_MON_POS=[[218,228],[246,252],[150,194],[100,202],[292,262],[186,252],[64,210],[234,198],[322,240],[146,264],[262,264],[30,236]];
const Y_HERO_HOME=[180,190];
function yScale(y){return (0.8+Math.max(0,Math.min(1,(y-165)/112))*0.32).toFixed(3)}
function yT(x,y){return `translate(${(+x).toFixed(1)}px,${(+y).toFixed(1)}px) scale(${yScale(y)})`}
function yActor(attrs,x,y,inner,cls,delay,extra){return `<g ${attrs} class="actor ${cls||''}" style="transform:${yT(x,y)};${extra||''}"><ellipse cx="0" cy="0" rx="13" ry="3.8" fill="url(#yShG)"/><g class="flip"><g class="act ${isNight()?'sleepy':'bob'}" style="animation-delay:${delay||0}s">${inner}</g></g>${isNight()?`<text class="zzz" x="12" y="-40" font-size="10" fill="#fff">Z<tspan font-size="7" dy="-4">z</tspan></text>`:''}</g>`}
function yMonArt(svg){return `<g transform="translate(-18 -35) scale(.86)">${svg}</g>`}
function yHeroArt(){const t=store.hero.type;return `<g transform="translate(-19.5 -51)">${hero(t,39)}</g>`}

function scene(){
  const o=store.owned,g=store.grow,night=isNight(),C=Clay('yd');
  const ctx={g,night,crop:store.crop,fish:store.fish};
  /* 底圖：整個院子；天空那一條另外加雲、太陽或月亮 */
  let flat=`<image href="img/yard_bg.webp" x="0" y="0" width="360" height="300" preserveAspectRatio="xMidYMid slice"/>`;
  if(!night)flat+=`<g pointer-events="none"><g class="cloud">${yCloud(C,70,16,.55)}</g><g class="cloud" style="animation-delay:-40s">${yCloud(C,200,22,.42)}</g></g>`;
  if(o.includes('rainbowsky'))flat+=yRainbow();
  const L=[];const add=(y,h)=>L.push([y,h]);
  /* 永遠在的：開花小樹、小擺設 */
  add(112,`<g data-kind="tree">${ySoft(330,110,26,7)}${yImg('blossom',330,112,62,'sway')}</g>`);
  Y_DECOR.forEach(([k,x,y,w])=>{const [iw,ih]=Y_IMG[k].slice(1);add(y,`${ySoft(x,y-1,w*.55,Math.max(2,w*.12))}${yImg(k,x,y,w,k==='bush'||k==='fern'?'sway':'',k==='bush'?`animation-duration:${6+x%3}s`:'')}`)});
  Object.entries(Y_ITEMS).forEach(([id,it])=>{if(!o.includes(id))return;
    if(it.split){/* 花一叢一叢分開排前後 */const dy=posOf(id)[1];yFlowerSpots(g.flowers||1).forEach(([x,y,w],i)=>add(y+dy,yWrap(id,yFlowerClump(x,y,w,i))));return}
    add(it.base+posOf(id)[1],yWrap(id,it.draw(C,ctx)))});
  const fr=Object.keys(EMO).filter(k=>(store.xp[k]||0)>0),jf=Object.keys(JOY).filter(k=>jxpOf(k)>0);
  const dim=S.decor?'pointer-events:none;opacity:.55;':'';
  fr.forEach((k,i)=>{const [x,y]=HOME_POS[k]||Y_MON_POS[i%Y_MON_POS.length];add(y,yActor(`data-mon="${k}" data-actor="m"`,x,y,yMonArt(monster(k,42)),'homemon',i*.5,dim))});
  jf.forEach((k,i)=>{const id='j-'+k,j=fr.length+i,[x,y]=HOME_POS[id]||Y_MON_POS[j%Y_MON_POS.length];add(y,yActor(`data-mon="${id}" data-actor="m"`,x,y,yMonArt(friend(k,42)),'homemon',j*.5,dim))});
  if(store.hero){const [x,y]=HOME_POS.hero||Y_HERO_HOME;add(y,yActor('data-actor="h"',x,y,yHeroArt()))}
  /* 每一層用 data-y 記住腳的位置，走路時重新排前後 */
  const sorted=L.sort((a,b)=>a[0]-b[0]).map(([y,h])=>`<g class="yl" data-y="${y}">${h}</g>`).join('');
  let top='';
  if(night){top+=`<rect width="360" height="300" fill="#1F2566" opacity=".48" style="mix-blend-mode:multiply" pointer-events="none"/>
    <g pointer-events="none">${[[24,8],[70,20],[118,6],[160,16],[214,8],[262,20],[300,6]].map(([x,y],i)=>`<circle class="tw" style="animation-delay:${i*.5}s" cx="${x}" cy="${y}" r="1.3" fill="#FFF8DC"/>`).join('')}
    <circle cx="334" cy="17" r="14" fill="url(#yGlow)" opacity=".7"/><path d="M334 9.5 A7.5 7.5 0 1 0 334 24.5 A9 9 0 0 1 334 9.5 Z" fill="#FFF3C4"/>
    ${o.includes('house')?yWinGlow():''}${o.includes('lamp')?`<circle class="twinkle" cx="${250+posOf('lamp')[0]}" cy="${177+posOf('lamp')[1]}" r="34" fill="url(#yGlow)"/><circle cx="${250+posOf('lamp')[0]}" cy="${177+posOf('lamp')[1]}" r="3.4" fill="#FFF3B0"/>`:''}</g>`}
  top+=yAmbient(C,night);
  if(!fr.length&&!jf.length)top+=`<g pointer-events="none"><rect x="70" y="282" width="220" height="15" rx="7.5" fill="#FFFDF8" opacity=".9"/><text x="180" y="292.6" text-anchor="middle" font-size="8.6" fill="#5C4A3D">去冷靜站陪一隻怪獸冷靜，牠就會搬進家園喔</text></g>`;
  return `<svg class="yard" viewBox="0 0 360 300" width="100%" style="display:block;border-radius:18px" role="img" aria-label="家園：從上面看的院子">${C.defs()}${Y_DEFS}${flat}<g id="ysorted">${sorted}</g>${top}</svg>`;
}

/* 可以走的草地；不能走進池塘、菜園、帳篷、鞦韆、房子裡面 */
function yFix(x,y){const o=store.owned,P=id=>posOf(id);
  x=Math.max(24,Math.min(336,x));y=Math.max(172,Math.min(264,y));
  if(o.includes('pond')){const [px,py]=P('pond');const cy=YP.base-30+py;let dx=(x-YP.cx-px)/50,dy=(y-cy)/30,d=Math.hypot(dx,dy);if(d<1){dy=Math.abs(dy)+.25;d=Math.hypot(dx,dy);x=YP.cx+px+dx/d*52;y=cy+dy/d*32}}
  if(o.includes('garden')){const [gx,gy]=P('garden');if(x>YG.cx-46+gx&&x<YG.cx+56+gx&&y>YG.base-52+gy&&y<YG.base+4+gy)y=y<YG.base-24+gy?YG.base-54+gy:YG.base+8+gy}
  if(o.includes('tent')){const [tx,ty]=P('tent');if(x>20+tx&&x<96+tx&&y>150+ty&&y<198+ty)y=202+ty}
  if(o.includes('swing')){const [sx,sy]=P('swing');if(x>34+sx&&x<90+sx&&y>236+sy&&y<272+sy)x=x<62+sx?30+sx:96+sx}
  return [Math.max(24,Math.min(336,x)),Math.max(172,Math.min(264,y))]}

function yResort(root){const L=$(root+' #ysorted');if(!L)return;const kids=[...L.children];
  kids.forEach(k=>{const a=k.querySelector(':scope > .actor');if(a){try{k.dataset.y=new DOMMatrix(getComputedStyle(a).transform).f.toFixed(1)}catch(e){}}});
  const want=kids.slice().sort((p,q)=>p.dataset.y-q.dataset.y);if(want.some((e,i)=>e!==kids[i]))want.forEach(e=>L.appendChild(e))}
function yMoveTo(el,id,nx,ny,speed,root){const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform)||[0,180,200];const x=+m[1],y=+m[2];
  const dist=Math.hypot(nx-x,ny-y),dur=Math.max(.7,dist/speed+.25);/* 正面的角色不翻面（翻面會像對折），改成往要去的方向微微傾身，到了再站直 */
  const fl=el.querySelector('.flip');fl.classList.remove('left');clearTimeout(fl._lt);fl.classList.toggle('leanL',nx<x-2);fl.classList.toggle('leanR',nx>x+2);
  fl._lt=setTimeout(()=>fl.classList.remove('leanL','leanR'),Math.max(300,dur*1000-250));
  el.style.transition=`transform ${dur}s cubic-bezier(.42,0,.36,1)`;el.style.transform=yT(nx,ny);HOME_POS[id]=[nx,ny];
  actDo(el,'ywalk',dur*1000-120);yDust(el,x,y,root);setTimeout(()=>{if(el.isConnected)yDust(el,nx,ny,root)},dur*1000-150);clearTimeout(el._rs);const t0=performance.now(),tick=()=>{yResort(root);if(performance.now()-t0<dur*1000+100)el._rs=setTimeout(tick,120)};tick();return dur}

function yDust(el,x,y,root){if(RM)return;const L=$(root+' svg.yard');if(!L)return;const ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('class','ydust');g.setAttribute('pointer-events','none');
  g.innerHTML=[-7,0,7].map((dx,i)=>`<circle cx="${(x+dx).toFixed(1)}" cy="${(y-1).toFixed(1)}" r="${2.4-i%2*.6}" fill="#FFFDF5" style="animation-delay:${i*.05}s"/>`).join('');L.appendChild(g);setTimeout(()=>g.remove(),800)}
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
      el.onpointermove=e=>{nx=Math.max(-300,Math.min(300,x0+(e.clientX-sx)*k));ny=Math.max(-120,Math.min(110,y0+(e.clientY-sy)*k));$$(`#scene [data-it="${id}"]`).forEach(e2=>e2.setAttribute('transform',`translate(${nx.toFixed(1)} ${ny.toFixed(1)})`))};
      el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;el.classList.remove('dragging');store.ypos[id]={x:Math.round(nx),y:Math.round(ny)};save();tone(520,.06)}}});
    return}
  /* 點池塘、菜園、花：去那個小角落（跟以前一樣） */
  [['pond',24],['garden',25],['flowers',25]].forEach(([id,st])=>$$(`#scene [data-it="${id}"]`).forEach(el=>el.onclick=ev=>{ev.stopPropagation();
    if(isNight()){toast('晚上了，大家都在睡覺，明天再來吧 🌙');return}go(st)}));
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

/* ---------- 主角：五隻都換成新比例的生成圖，可以換 4 套衣服 ---------- */
HEROES.dog=HEROES.dog||{name:'小狗',c:'#D9824A'};
/* 每張圖：[寬(高都是300), 腳縫開始的高度, 兩腳中間, 腳的左邊, 腳的右邊]（比例，程式量出來的） */
const Y_HM={bear1:[188,0.89,0.5,0.229,0.766],bear2:[187,0.89,0.497,0.23,0.765],bear3:[188,0.89,0.5,0.229,0.766],bear4:[187,0.89,0.497,0.23,0.765],dog1:[213,0.883,0.5,0.258,0.742],dog2:[214,0.88,0.5,0.257,0.743],dog3:[213,0.883,0.495,0.254,0.742],dog4:[214,0.883,0.498,0.252,0.738],rabbit1:[130,0.913,0.5,0.2,0.792],rabbit2:[130,0.913,0.5,0.2,0.792],rabbit3:[130,0.913,0.496,0.2,0.792],rabbit4:[129,0.913,0.5,0.202,0.798],cat1:[191,0.893,0.563,0.309,0.812],cat2:[191,0.893,0.563,0.309,0.812],cat3:[191,0.893,0.56,0.309,0.812],cat4:[191,0.893,0.56,0.309,0.806],fox1:[186,0.897,0.5,0.253,0.747],fox2:[186,0.897,0.505,0.253,0.753],fox3:[186,0.897,0.5,0.253,0.747],fox4:[186,0.897,0.5,0.247,0.747]};
const Y_HERO_NEW={bear:1,dog:1,fox:1,rabbit:1,cat:1};
/* 帽子戴在哪：頭頂離圖最上面多遠（兔子有長耳朵，頭比較低）、頭寬是圖寬的幾成 */
const Y_HEAD={bear:[.03,.8],dog:[.04,.6],fox:[.05,.66],rabbit:[.28,.78],cat:[.05,.66]};
let yClipN=0;
const Y_OUTFITS=[['橘色圍巾','#F2A65A'],['薄荷點點','#93D8BF'],['鵝黃條紋','#FBD56E'],['天空格子','#9CCBEF']];
const yHeroOld=hero;
hero=function(type,size=90,eqo){
  if(!Y_HERO_NEW[type])return yHeroOld(type,size,eqo);
  const eq=eqo||store.equip||{};const of=Math.max(1,Math.min(4,(eqo?1:(store.hero&&store.hero.type===type&&store.hero.outfit)||1)));
  const M=Y_HM[type+of]||Y_HM[type+'1'],h=124,w=h*M[0]/300,x0=50-w/2,y0=-6;
  /* 紙偶走路：同一張圖剪成身體＋左腳＋右腳，走路時兩腳輪流抬起（腳畫在身體後面，抬起來會藏進身體） */
  const cy=y0+h*M[1],gx=x0+w*M[2],l0=x0+w*M[3],l1=x0+w*M[4],yb=y0+h+2,id='yhc'+(++yClipN),href=`img/hero_${type}${of}.webp`;
  const im=c=>`<image href="${href}" x="${x0.toFixed(1)}" y="${y0}" width="${w.toFixed(1)}" height="${h}" clip-path="url(#${id}${c})"/>`;
  const art=`<defs><clipPath id="${id}b"><rect x="-60" y="-80" width="220" height="${(cy+80).toFixed(1)}"/><rect x="-60" y="${cy.toFixed(1)}" width="${(l0+60).toFixed(1)}" height="60"/><rect x="${l1.toFixed(1)}" y="${cy.toFixed(1)}" width="${(160-l1).toFixed(1)}" height="60"/></clipPath>
    <clipPath id="${id}l"><rect x="${l0.toFixed(1)}" y="${(cy-3).toFixed(1)}" width="${(gx-l0).toFixed(1)}" height="${(yb-cy+3).toFixed(1)}"/></clipPath><clipPath id="${id}r"><rect x="${gx.toFixed(1)}" y="${(cy-3).toFixed(1)}" width="${(l1-gx).toFixed(1)}" height="${(yb-cy+3).toFixed(1)}"/></clipPath></defs>
    <g class="hleg hlegL">${im('l')}</g><g class="hleg hlegR">${im('r')}</g>${im('b')}`;
  /* 頭頂大約在圖的最上面往下一點，頭寬依動物不同 */
  const [ht,hr]=Y_HEAD[type]||[.04,.7],hw=w*hr,hs=hw/60,top=-6+h*ht;
  const cape=eq.hback==='cape'?`<path d="M28 62 Q50 54 72 62 L84 114 Q50 122 16 114Z" fill="#E4574B"/><path d="M28 62 Q50 54 72 62" stroke="#B8382F" stroke-width="3" fill="none"/>`:'';
  const pack=eq.hback==='pack'?`<rect x="68" y="66" width="20" height="30" rx="8" fill="#5B8DEF"/><rect x="72" y="73" width="12" height="7" rx="2" fill="#3E6FD0"/>`:'';
  const hat=eq.hhead==='straw'?`<ellipse cx="50" cy="22" rx="34" ry="7" fill="#E9C46A"/><path d="M34 22 Q36 4 50 4 Q64 4 66 22Z" fill="#F2D384"/><rect x="34" y="15" width="32" height="5" fill="#E76F51"/>`
    :eq.hhead==='wizard'?`<path d="M28 24 L54 -14 L72 24Z" fill="#7B5CC9"/><ellipse cx="50" cy="24" rx="27" ry="5" fill="#5E43A8"/><circle cx="54" cy="-13" r="4" fill="#FFD166"/><path d="M50 4 l2 -5 l2 5 l5 1 l-4 3 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -3z" fill="#FFD166"/>`:'';
  return `<svg width="${size}" height="${Math.round(size*1.36)}" viewBox="0 -16 100 136" overflow="visible">${cape}${pack}
    ${art}
    ${hat?`<g transform="translate(50 ${top.toFixed(1)}) scale(${hs.toFixed(2)}) translate(-50 -22)">${hat}</g>`:''}</svg>`};

/* 選主角的頁面：多一排衣服可以選 */
const yRenderHeroesOld=renderHeroes;
renderHeroes=function(){yRenderHeroesOld();let box=$('#yOutfits');
  if(!box){box=document.createElement('div');box.id='yOutfits';box.className='chips';box.style.marginTop='10px';$('#heroes').after(box)}
  const t=heroPick;if(!Y_HERO_NEW[t]){box.innerHTML='';return}
  const cur=(store.hero&&store.hero.type===t&&store.hero.outfit)||S.yOutfit||1;S.yOutfit=cur;
  box.innerHTML=`<p class="hint" style="width:100%;margin:0 0 4px">選一件衣服</p>`+Y_OUTFITS.map(([n,c],i)=>`<button class="chip ${cur===i+1?'sel':''}" data-of="${i+1}"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${c};vertical-align:-3px;margin-right:6px"></i>${n}</button>`).join('');
  $$('#yOutfits [data-of]').forEach(b=>b.onclick=()=>{S.yOutfit=+b.dataset.of;if(store.hero&&store.hero.type===t){store.hero.outfit=S.yOutfit;save()}tone(600,.1);renderHeroes()});
  $$(`[data-hero="${t}"] svg image`).forEach(im=>im.setAttribute('href',`img/hero_${t}${cur}.webp`))};
$('#heroOk').onclick=()=>{const nm=$('#heroNameIn').value.trim()||HEROES[heroPick].name;store.hero={type:heroPick,name:nm};if(Y_HERO_NEW[heroPick])store.hero.outfit=S.yOutfit||1;save();chime();go(10)};
