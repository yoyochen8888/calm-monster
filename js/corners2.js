/* =========================================================
   小角落 v38：池塘和花園重新做得更生動
   結構（每個角落都分四層）：
     1. 遠景：池塘外的草地／花園的天空、遠山、圍籬
     2. 場景：池岸石頭、水底沙和小石子／木頭菜圃、花圃、小路
     3. 小生命：錦鯉、青蛙、蜻蜓、花瓣／蝴蝶、蜜蜂、瓢蟲、蝸牛、小鳥
     4. 互動：碰水面、撒飼料、點青蛙／按住澆水（小雲朵來下雨）、摸葉子
   小生命是「偶爾會出現」，不能收集、沒有數量，看到了就是剛好遇到。
   載入在 corners.js 後面，覆蓋 pondCanvas()、gardenSvg()；原本的流程（餵魚、澆水、分給怪獸）都不變。
   想退回舊的小角落：把 index.html 裡 corners2.js 那一行拿掉。
   ========================================================= */

/* ---------- 池塘 ---------- */
const KOI={'#FFB25B':['#FF9A4D','#FFF7EE',null],'#FF8A80':['#FFF6EC','#FF6F5E',null],'#FFD86B':['#FFD25E','#FFF3C7',null],
  '#FFA8CF':['#FFF6EC','#FF9A4D','#7A6A86'],'#B9A0F0':['#CDB8F5','#FFF6EC',null]};
/* v44：池塘換成生成圖（底圖、錦鯉、睡蓮、青蛙、蜻蜓、花瓣）。圖還沒載入時，先用原本程式畫的。 */
const PSP={};['bg','koi_orange','koi_white','koi_gold','pad_big','pad_small','pad_flower','dfly','frog','petal'].forEach(n=>{const i=new Image();i.src=`img/p_${n}.webp`;PSP[n]=i});
const pOk=n=>PSP[n]&&PSP[n].complete&&PSP[n].naturalWidth>0;
const KOI_SP={'#FFB25B':'koi_orange','#FF8A80':'koi_white','#FFD86B':'koi_gold','#FFA8CF':'koi_white','#B9A0F0':'koi_orange'};
function pondCanvas(A,nFish){
  const calm=A.id==='fishPond';/* 冷靜流程裡的看魚呼吸：少一點小驚喜，安安靜靜 */
  A.innerHTML=`<canvas class="pondcv"></canvas>`;const cv=A.querySelector('canvas');
  const W=Math.min(A.clientWidth||340,560),H=Math.round(W*.72),dpr=window.devicePixelRatio||1;
  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';
  const x=cv.getContext('2d');x.scale(dpr,dpr);
  const P={W,H,cv,food:[],rip:[],ring:null,rest:false,onEat:null,speed:1,t0:performance.now()};
  /* 池子的形狀：圓圓的、有一點不規則 */
  const cx=W*.5,cy=H*.53,rx=W*.42,ry=H*.39;
  const bl=a=>1+.05*Math.sin(3*a+.6)+.035*Math.cos(5*a);
  const edge=(a,k=1)=>[cx+Math.cos(a)*rx*bl(a)*k,cy+Math.sin(a)*ry*bl(a)*k];
  const inside=(px,py,k=1)=>{const a=Math.atan2((py-cy)/ry,(px-cx)/rx);return Math.hypot((px-cx)/rx,(py-cy)/ry)<bl(a)*k};
  const blob=(c,k)=>{c.beginPath();for(let i=0;i<=72;i++){const [ex,ey]=edge(i/72*6.283,k);i?c.lineTo(ex,ey):c.moveTo(ex,ey)}c.closePath()};
  const off=()=>{const c=document.createElement('canvas');c.width=W*dpr;c.height=H*dpr;const g=c.getContext('2d');g.scale(dpr,dpr);return [c,g]};
  let seed=7;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;

  /* 1. 底圖（只畫一次）：草地、水底的沙和小石子、水的深淺 */
  const [bgC,b]=off();
  let gg=b.createLinearGradient(0,0,0,H);gg.addColorStop(0,'#C9E8A8');gg.addColorStop(1,'#A9D88C');b.fillStyle=gg;b.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const tx=rnd()*W,ty=rnd()*H;if(inside(tx,ty,1.12))continue;b.strokeStyle=rnd()<.5?'#93C878':'#B7E09A';b.lineWidth=1.4;b.lineCap='round';
    for(let k=-1;k<=1;k++){b.beginPath();b.moveTo(tx+k*2,ty);b.quadraticCurveTo(tx+k*3,ty-4,tx+k*4.5,ty-7);b.stroke()}}
  b.save();blob(b,.97);b.clip();
  gg=b.createRadialGradient(cx-rx*.1,cy-ry*.05,4,cx,cy,rx*1.05);gg.addColorStop(0,'#5FB7C9');gg.addColorStop(.55,'#7FCBD3');gg.addColorStop(.85,'#A9DCCF');gg.addColorStop(1,'#CDE7C6');
  b.fillStyle=gg;b.fillRect(0,0,W,H);
  for(let i=0;i<38;i++){const a=rnd()*6.28,k=.55+rnd()*.42,[px,py]=edge(a,k),r=W*(.006+rnd()*.012);
    const pc=['#E9DCC4','#F2D6CC','#D7E3E8','#EFE4C2','#D9E8D2'][i%5];
    b.fillStyle='rgba(30,80,90,.12)';b.beginPath();b.ellipse(px+1.5,py+2,r,r*.75,0,0,6.28);b.fill();
    b.fillStyle=pc;b.globalAlpha=.4+(1-k)*.5;b.beginPath();b.ellipse(px,py,r,r*.75,a,0,6.28);b.fill();b.globalAlpha=1}
  b.fillStyle='rgba(120,190,140,.35)';for(let i=0;i<9;i++){const [px,py]=edge(rnd()*6.28,.8+rnd()*.12);b.beginPath();b.ellipse(px,py,W*.03,W*.012,rnd()*3,0,6.28);b.fill()}
  b.restore();
  /* 2. 前景（只畫一次）：池岸一圈圓石頭、角落的草和小花 */
  const [fgC,f]=off();
  const SC=['#F1E8DA','#F6DCD2','#DCE7EC','#F3E9C9','#E4E0F0','#DDEBD8'];
  const stones=[];for(let i=0;i<34;i++){const a=i/34*6.283+rnd()*.08,[px,py]=edge(a,1.02+rnd()*.03);stones.push([px,py,W*(.032+rnd()*.016),SC[Math.floor(rnd()*6)],a])}
  stones.sort((p,q)=>p[1]-q[1]).forEach(([px,py,r,c])=>{
    f.fillStyle='rgba(50,80,40,.22)';f.beginPath();f.ellipse(px+1.5,py+r*.45,r*1.05,r*.6,0,0,6.28);f.fill();
    const sg=f.createRadialGradient(px-r*.35,py-r*.45,r*.1,px,py,r*1.1);sg.addColorStop(0,tint(c,.55));sg.addColorStop(.6,c);sg.addColorStop(1,tint(c,-.14));
    f.fillStyle=sg;f.beginPath();f.ellipse(px,py,r,r*.78,0,0,6.28);f.fill()});
  const tuft=(tx,ty,s)=>{for(let k=0;k<7;k++){const a=-1.57+(k-3)*.22;f.strokeStyle=k%2?'#7DBF6A':'#9AD47F';f.lineWidth=2.2*s;f.lineCap='round';f.beginPath();f.moveTo(tx,ty);f.quadraticCurveTo(tx+Math.cos(a)*8*s,ty+Math.sin(a)*10*s,tx+Math.cos(a)*14*s,ty+Math.sin(a)*18*s);f.stroke()}};
  const flw=(tx,ty,c,s)=>{for(let k=0;k<5;k++){const a=k*1.2566;f.fillStyle=c;f.beginPath();f.arc(tx+Math.cos(a)*3.4*s,ty+Math.sin(a)*3.4*s,2.8*s,0,6.28);f.fill()}f.fillStyle='#FFE08A';f.beginPath();f.arc(tx,ty,2*s,0,6.28);f.fill()};
  tuft(W*.9,H*.97,1.1);tuft(W*.96,H*.9,.9);tuft(W*.05,H*.98,1);tuft(W*.14,H*1.0,.8);tuft(W*.93,H*.12,.8);
  flw(W*.86,H*.93,'#FFB3D1',1);flw(W*.95,H*.98,'#fff',.9);flw(W*.08,H*.92,'#FFD86B',.9);flw(W*.9,H*.08,'#B9A0F0',.8);flw(W*.04,H*.06,'#FFB3D1',.9);

  /* 3. 睡蓮葉（會輕輕晃，被碰到會搖一下）、花、花苞 */
  const pads=[[W*.31,H*.38,W*.072],[W*.69,H*.68,W*.085],[W*.65,H*.31,W*.05],[W*.38,H*.72,W*.038]];
  P.pads=pads;pads.forEach((p,i)=>{p.rot=i*2.1+.4;p.kick=0});
  function drawPad(p,i,t){const [px,py,r]=p;const k=p.kick*Math.sin((t-p.kt||0)*9)*Math.exp(-(t-(p.kt||0))*1.6);
    const rot=p.rot+Math.sin(t*.35+i)*.05+(isFinite(k)?k*.25:0),ox=Math.sin(t*.4+i*2)*1.2;
    x.fillStyle='rgba(20,70,80,.16)';x.beginPath();x.ellipse(px+5+ox,py+8,r,r*.92,0,0,6.28);x.fill();
    const sp=i===2?'pad_flower':i===3?'pad_small':'pad_big';
    if(pOk(sp)){const im=PSP[sp],d=r*2.15*(i===2?1.25:1),dh=d*im.naturalHeight/im.naturalWidth;x.save();x.translate(px+ox,py);x.rotate(rot);x.drawImage(im,-d/2,-dh/2,d,dh);x.restore();return null}
    const pg=x.createRadialGradient(px-r*.35,py-r*.4,r*.1,px,py,r);pg.addColorStop(0,'#B4E39C');pg.addColorStop(.7,'#7CC873');pg.addColorStop(1,'#62B262');
    x.fillStyle=pg;x.beginPath();x.moveTo(px+ox,py);x.arc(px+ox,py,r,rot+.16,rot+6.12);x.closePath();x.fill();
    x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=1.1;for(let v=0;v<7;v++){const a=rot+.5+v*.82;x.beginPath();x.moveTo(px+ox,py);x.lineTo(px+ox+Math.cos(a)*r*.82,py+Math.sin(a)*r*.82);x.stroke()}
    x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.ellipse(px+ox-r*.32,py-r*.34,r*.28,r*.16,-.5,0,6.28);x.fill();return ox}
  function lotus(px,py,s,t){const br=1+Math.sin(t*.8)*.03;
    for(let k=0;k<8;k++){const a=k*.785+.2;x.fillStyle=k%2?'#FFC3DA':'#FFD6E6';x.beginPath();x.ellipse(px+Math.cos(a)*7*s,py+Math.sin(a)*7*s,7*s*br,3.6*s,a,0,6.28);x.fill()}
    for(let k=0;k<6;k++){const a=k*1.047;x.fillStyle='#FF9EC4';x.beginPath();x.ellipse(px+Math.cos(a)*4*s,py+Math.sin(a)*4*s,4.6*s,2.6*s,a,0,6.28);x.fill()}
    x.fillStyle='#FFE08A';x.beginPath();x.arc(px,py,2.8*s,0,6.28);x.fill()}
  function bud(px,py,s){x.fillStyle='#F7A8C8';x.beginPath();x.ellipse(px,py,3.4*s,5*s,.4,0,6.28);x.fill();x.fillStyle='#FFD0E2';x.beginPath();x.ellipse(px-1*s,py-1.4*s,1.4*s,2.6*s,.4,0,6.28);x.fill()}

  /* 4. 錦鯉：身體會彎、尾巴會擺，每條花色不一樣 */
  P.fish=[...Array(nFish)].map((_,i)=>{let fx,fy;do{fx=W*(.2+.6*Math.random());fy=H*(.25+.5*Math.random())}while(!inside(fx,fy,.75));
    return {x:fx,y:fy,a:Math.random()*6.28,s:.35+Math.random()*.2,c:FISH_C[i%5],len:W*(.085+Math.random()*.025),tx:fx,ty:fy,w:Math.random()*6,pick:0}});
  function spots(f){if(f.sp)return f.sp;let s=(f.c.charCodeAt(1)*7+Math.round(f.len*10))%97;const r=()=>(s=(s*37+11)%97)/97;
    f.sp=[...Array(4)].map(()=>[.35-r()*.75,(r()-.5)*.5,.12+r()*.12,r()<.3?2:1]);return f.sp}
  /* 生成圖的魚：切成直條，一條一條往上下錯開，看起來身體在彎、尾巴在擺 */
  function drawFishImg(f,im){const L=f.len*1.25,h=L*im.naturalHeight/im.naturalWidth,N=12,sw=im.naturalWidth/N,dw=L/N;
    x.save();x.translate(f.x,f.y);x.rotate(f.a);
    x.fillStyle='rgba(20,60,80,.16)';x.beginPath();x.ellipse(7,10,L*.42,h*.3,0,0,6.28);x.fill();
    for(let j=0;j<N;j++){const u=1-(j+.5)/N;/* u：0 是頭、1 是尾巴 */
      const oy=Math.sin(f.w-u*2.4)*L*.09*Math.pow(u,1.4);
      x.drawImage(im,j*sw,0,sw+1,im.naturalHeight,-L/2+j*dw,-h/2+oy,dw+.6,h)}
    x.restore()}
  function drawFish(f,t){const sp=KOI_SP[f.c];if(sp&&pOk(sp))return drawFishImg(f,PSP[sp]);const L=f.len,[base,patch,dark]=KOI[f.c]||[f.c,'#FFF6EC',null],N=9,pts=[];
    for(let i=0;i<N;i++){const u=i/(N-1);pts.push([L*.5-u*L,Math.sin(f.w-u*2.4)*L*.11*Math.pow(u,1.4)])}
    const wid=u=>L*.22*Math.sin(Math.PI*Math.min(1,u*.9+.08))*(u>.75?1-(u-.75)*1.6:1);
    x.save();x.translate(f.x,f.y);x.rotate(f.a);
    /* 水底的影子 */
    x.save();x.translate(7,10);x.fillStyle='rgba(20,60,80,.16)';x.beginPath();x.ellipse(0,0,L*.5,L*.16,0,0,6.28);x.fill();x.restore();
    const tp=pts[N-1],tw=Math.sin(f.w-2.6)*.5;
    /* 尾巴：兩片軟軟的 */
    x.fillStyle=tint(base,.25);x.globalAlpha=.85;
    [[-1],[1]].forEach(([sd])=>{x.beginPath();x.moveTo(tp[0]+L*.06,tp[1]);x.quadraticCurveTo(tp[0]-L*.12,tp[1]+sd*L*.05+tw*L*.1,tp[0]-L*.26,tp[1]+sd*L*.2+tw*L*.18);
      x.quadraticCurveTo(tp[0]-L*.14,tp[1]+tw*L*.08,tp[0]+L*.06,tp[1]);x.fill()});
    /* 胸鰭 */
    [-1,1].forEach(sd=>{x.beginPath();x.ellipse(L*.18,sd*L*.17,L*.12,L*.05,sd*(.9+Math.sin(f.w*1.3)*.25),0,6.28);x.fill()});x.globalAlpha=1;
    /* 身體 */
    const body=()=>{x.beginPath();pts.forEach(([px,py],i)=>{const w=wid(i/(N-1));i?x.lineTo(px,py-w):x.moveTo(px,py-w)});
      for(let i=N-1;i>=0;i--){const [px,py]=pts[i],w=wid(i/(N-1));x.lineTo(px,py+w)}x.closePath()};
    const bg=x.createLinearGradient(0,-L*.2,0,L*.2);bg.addColorStop(0,tint(base,.35));bg.addColorStop(.5,base);bg.addColorStop(1,tint(base,-.1));
    x.fillStyle=bg;body();x.fill();
    x.save();body();x.clip();spots(f).forEach(([u,v,r,kind])=>{const i=Math.max(0,Math.min(N-1,Math.round((.5-u)*(N-1))));x.fillStyle=kind===2&&dark?dark:patch;x.globalAlpha=.9;
      x.beginPath();x.ellipse(L*u,pts[i][1]+v*L*.3,L*r,L*r*.7,0,0,6.28);x.fill()});x.globalAlpha=1;
    x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(L*.1,-L*.06,L*.26,L*.04,0,0,6.28);x.fill();x.restore();
    /* 眼睛 */
    [-1,1].forEach(sd=>{x.fillStyle='#4A3B3B';x.beginPath();x.arc(L*.38,sd*L*.085,L*.028,0,6.28);x.fill()});
    x.restore()}

  /* 5. 小生命：青蛙（點牠會跳進水裡，過一會兒爬回葉子上）、蜻蜓（偶爾飛來停一下）、飄過的花瓣 */
  const frog={pad:0,st:'sit',t:0,blink:0,x:0,y:0};
  function frogAt(){const p=pads[frog.pad];return [p[0]-p[2]*.1,p[1]-p[2]*.1]}
  function drawFrog(px,py,s,t,eyesClosed){
    if(pOk('frog')){const im=PSP.frog,d=30*s,dh=d*im.naturalHeight/im.naturalWidth,br=1+Math.sin(t*2.2)*.025;
      x.fillStyle='rgba(20,70,60,.2)';x.beginPath();x.ellipse(px+2*s,py+dh*.38,d*.42,d*.2,0,0,6.28);x.fill();
      x.save();x.translate(px,py+dh*.45);x.scale(1/br,br*(eyesClosed?.96:1));x.drawImage(im,-d/2,-dh,d,dh);x.restore();return}
    x.save();x.translate(px,py);x.scale(s,s);
    x.fillStyle='rgba(20,70,60,.2)';x.beginPath();x.ellipse(2,6,13,8,0,0,6.28);x.fill();
    x.fillStyle='#7CCB6B';[[-10,6],[10,6]].forEach(([fx,fy])=>{x.beginPath();x.ellipse(fx,fy,5,3,fx<0?.5:-.5,0,6.28);x.fill()});
    const g=x.createRadialGradient(-4,-4,1,0,0,14);g.addColorStop(0,'#B9EBA0');g.addColorStop(1,'#78C566');x.fillStyle=g;x.beginPath();x.ellipse(0,0,12,10,0,0,6.28);x.fill();
    [[-6,-8],[6,-8]].forEach(([ex,ey])=>{x.fillStyle='#8AD677';x.beginPath();x.arc(ex,ey,5,0,6.28);x.fill();
      if(eyesClosed){x.strokeStyle='#4A3B3B';x.lineWidth=1.3;x.beginPath();x.arc(ex,ey,2.4,.2,2.94);x.stroke()}
      else{x.fillStyle='#fff';x.beginPath();x.arc(ex,ey,3.4,0,6.28);x.fill();x.fillStyle='#4A3B3B';x.beginPath();x.arc(ex+.3,ey+.4,1.9,0,6.28);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex-.5,ey-.6,.7,0,6.28);x.fill()}});
    x.fillStyle='rgba(255,150,160,.55)';[[-7,0],[7,0]].forEach(([ex,ey])=>{x.beginPath();x.ellipse(ex,ey,2.4,1.4,0,0,6.28);x.fill()});
    x.strokeStyle='#4A7A3E';x.lineWidth=1.2;x.lineCap='round';x.beginPath();x.arc(0,-1,3.2,.4,2.74);x.stroke();x.restore()}
  const reed=[W*.1,H*.2];/* 左上角的蘆葦，蜻蜓有時候停在上面 */
  function drawReeds(t){const [rx0,ry0]=reed;x.lineCap='round';
    [[-8,-30,0],[0,-40,1],[9,-34,2],[16,-24,3]].forEach(([dx,dy,i])=>{const sw=Math.sin(t*.9+i)*2.4,tx=rx0+dx+sw,ty=ry0+dy;
      x.strokeStyle='#86BE6A';x.lineWidth=2.2;x.beginPath();x.moveTo(rx0+dx*.4,ry0+6);x.quadraticCurveTo(rx0+dx*.7,ry0+dy*.5,tx,ty);x.stroke();
      if(i%2===1){x.fillStyle='#B98A5E';x.beginPath();x.ellipse(tx,ty+4,2.6,6,sw*.03,0,6.28);x.fill();x.strokeStyle='#86BE6A';x.lineWidth=1.2;x.beginPath();x.moveTo(tx,ty-2);x.lineTo(tx+sw*.3,ty-7);x.stroke()}
      else{x.fillStyle='#9AD47F';x.beginPath();x.ellipse(tx-2,ty+10,2,8,-.4,0,6.28);x.fill()}});
    return [rx0+Math.sin(t*.9+1)*2.4,ry0-46]}
  const dfly={st:'away',t:performance.now()+(calm?1e12:6000+Math.random()*8000),x:-20,y:H*.3,sx:0,sy:0,tx:0,ty:0,ang:0};
  function drawDfly(t,flying){x.save();x.translate(dfly.x,dfly.y);x.rotate(dfly.ang);
    if(pOk('dfly')){const im=PSP.dfly,d=34*W/340,dh=d*im.naturalHeight/im.naturalWidth,fl=flying?.72+.28*Math.abs(Math.sin(t*40)):1;
      x.rotate(Math.PI/2);x.fillStyle='rgba(20,60,80,.12)';x.beginPath();x.ellipse(5,9,d*.3,dh*.3,0,0,6.28);x.fill();
      x.scale(fl,1);x.drawImage(im,-d/2,-dh/2,d,dh);x.restore();return}
    const fl=flying?Math.abs(Math.sin(t*60)):.15;x.fillStyle=`rgba(210,235,255,${.45+fl*.25})`;x.strokeStyle='rgba(140,180,220,.5)';x.lineWidth=.6;
    [[-2,-1],[-2,1],[2,-1],[2,1]].forEach(([wx,sd])=>{x.beginPath();x.ellipse(wx,sd*8,3,8+(flying?fl*1.5:0),sd*(wx<0?.25:-.25),0,6.28);x.fill();x.stroke()});
    x.fillStyle='#7EC8E3';x.beginPath();x.ellipse(-9,0,10,1.8,0,0,6.28);x.fill();x.fillStyle='#5BB4D6';x.beginPath();x.ellipse(2,0,4,2.6,0,0,6.28);x.fill();
    x.fillStyle='#3E8FB3';x.beginPath();x.arc(6,-1.6,1.8,0,6.28);x.arc(6,1.6,1.8,0,6.28);x.fill();x.restore()}
  function dflyTick(now,t){if(dfly.st==='away'){if(now>dfly.t){const land=!pOk('bg')&&Math.random()<.5?'reed':'pad';dfly.land=land;
      dfly.st='in';dfly.sx=Math.random()<.5?-20:W+20;dfly.sy=H*(.15+Math.random()*.5);dfly.x=dfly.sx;dfly.y=dfly.sy;dfly.t0=now}return}
    const tgt=dfly.land==='reed'?P.reedTip:[pads[2][0]+pads[2][2]*.4,pads[2][1]-pads[2][2]*.3];
    if(dfly.st==='in'){const k=Math.min(1,(now-dfly.t0)/3200),e=1-Math.pow(1-k,3);const nx=dfly.sx+(tgt[0]-dfly.sx)*e+Math.sin(k*9)*12*(1-k),ny=dfly.sy+(tgt[1]-dfly.sy)*e+Math.cos(k*7)*10*(1-k);
      dfly.ang=Math.atan2(ny-dfly.y,nx-dfly.x)||dfly.ang;dfly.x=nx;dfly.y=ny;if(k>=1){dfly.st='rest';dfly.t=now+4000+Math.random()*5000;dfly.ang=dfly.land==='reed'?-1.2:.3}drawDfly(t,true);return}
    if(dfly.st==='rest'){dfly.x=tgt[0];dfly.y=tgt[1];if(now>dfly.t){dfly.st='out';dfly.t0=now;dfly.sx=dfly.x;dfly.sy=dfly.y;dfly.ex=Math.random()<.5?-30:W+30;dfly.ey=H*(.1+Math.random()*.3)}drawDfly(t,false);return}
    const k=Math.min(1,(now-dfly.t0)/2600),e=k*k;const nx=dfly.sx+(dfly.ex-dfly.sx)*e+Math.sin(k*8)*10,ny=dfly.sy+(dfly.ey-dfly.sy)*e;
    dfly.ang=Math.atan2(ny-dfly.y,nx-dfly.x)||dfly.ang;dfly.x=nx;dfly.y=ny;drawDfly(t,true);if(k>=1){dfly.st='away';dfly.t=now+18000+Math.random()*16000}}
  const petals=[];let petalAt=performance.now()+(calm?1e12:9000);
  function petalTick(now){if(now>petalAt){petalAt=now+14000+Math.random()*12000;const [sx,sy]=edge(Math.PI*(.85+Math.random()*.3),.85);petals.push({x:sx,y:sy,vx:.12+Math.random()*.08,vy:(Math.random()-.5)*.05,r:Math.random()*6,born:now})}
    for(let i=petals.length-1;i>=0;i--){const p=petals[i];p.x+=p.vx;p.y+=p.vy+Math.sin((now-p.born)/1400)*.04;p.r+=.004;
      if(!inside(p.x,p.y,.9)||now-p.born>60000){petals.splice(i,1);continue}
      if(Math.random()<.004)P.rip.push({x:p.x,y:p.y,r:2,a:.25,m:W*.05});
      x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle='rgba(30,80,90,.12)';x.beginPath();x.ellipse(2,3,5,3,0,0,6.28);x.fill();
      if(pOk('petal')){const d=13*W/340;x.drawImage(PSP.petal,-d/2,-d/2,d,d*PSP.petal.naturalHeight/PSP.petal.naturalWidth);x.restore();continue}
      x.fillStyle='#FFC6DC';x.beginPath();x.ellipse(0,0,5.4,3.2,0,0,6.28);x.fill();x.fillStyle='#FFE1EC';x.beginPath();x.ellipse(-1.2,-.6,2.6,1.2,0,0,6.28);x.fill();x.restore()}}

  /* 碰水面：漣漪＋水滴聲；碰到葉子會搖；碰到青蛙牠會跳進水裡 */
  P.ripple=(px,py,big)=>P.rip.push({x:px,y:py,r:2,a:big?.7:.5,m:big?W*.22:W*.14});
  cv.addEventListener('pointerdown',e=>{const bb=cv.getBoundingClientRect();const px=(e.clientX-bb.left)*W/bb.width,py=(e.clientY-bb.top)*H/bb.height;ac();
    if(!calm&&frog.st==='sit'){const [fx,fy]=frogAt();if(Math.hypot(px-fx,py-fy)<W*.06){frogJump();return}}
    const t=(performance.now()-P.t0)/1000;let hitPad=false;
    pads.forEach(p=>{if(Math.hypot(px-p[0],py-p[1])<p[2]){p.kick=1;p.kt=t;hitPad=true}});
    if(!inside(px,py,1))return;
    P.ripple(px,py);drip();
    if(!P.rest&&!hitPad)P.fish.forEach(f=>{if(Math.hypot(f.x-px,f.y-py)<W*.35){f.tx=px+(Math.random()-.5)*30;f.ty=py+(Math.random()-.5)*30;f.pick=performance.now()+2500}})});
  function frogJump(){frog.st='jump';frog.t=performance.now();const [fx,fy]=frogAt();frog.sx=fx;frog.sy=fy;
    let tx,ty;do{tx=cx+(Math.random()-.5)*rx;ty=cy+(Math.random()-.5)*ry}while(!inside(tx,ty,.6)||pads.some(p=>Math.hypot(tx-p[0],ty-p[1])<p[2]*1.4));frog.ex=tx;frog.ey=ty;
    tone(520,.08,'triangle',.05);setTimeout(()=>tone(680,.08,'triangle',.04),90)}
  function frogTick(now,t){if(calm)return;const s=W/340;
    if(frog.st==='sit'){const [fx,fy]=frogAt();const p=pads[frog.pad];const ox=Math.sin(t*.4+frog.pad*2)*1.2;
      if(now>frog.blink)frog.blink=now+2500+Math.random()*4000;drawFrog(fx+ox,fy,s,t,frog.blink-now<160);return}
    if(frog.st==='jump'){const k=Math.min(1,(now-frog.t)/650);const px=frog.sx+(frog.ex-frog.sx)*k,py=frog.sy+(frog.ey-frog.sy)*k-Math.sin(k*Math.PI)*H*.12;
      drawFrog(px,py,s*(1+Math.sin(k*Math.PI)*.25),t,false);
      if(k>=1){frog.st='swim';frog.t=now;P.ripple(frog.ex,frog.ey,true);P.ripple(frog.ex+6,frog.ey+3);tone(240,.18,'sine',.06);drip()}return}
    if(frog.st==='swim'){const k=(now-frog.t)/1000;/* 在水裡只看到兩顆眼睛慢慢游 */
      const np=frog.pad===0?1:0,p=pads[np];
      const sp=Math.min(1,k/9),ex=frog.ex+(p[0]-frog.ex)*sp,ey=frog.ey+(p[1]-frog.ey)*sp;
      if(k>1.5&&k<9){x.fillStyle='#8AD677';[-4,4].forEach(d=>{x.beginPath();x.arc(ex+d*s,ey,2.8*s,0,6.28);x.fill()});x.fillStyle='#4A3B3B';[-4,4].forEach(d=>{x.beginPath();x.arc(ex+d*s,ey,1.3*s,0,6.28);x.fill()});
        if(Math.random()<.03)P.rip.push({x:ex,y:ey+3,r:3,a:.3,m:W*.05})}
      if(k>9.5){frog.pad=np;frog.st='sit';P.ripple(p[0],p[1])}}}

  function newTarget(f){if(P.rest){const p=pads[1];f.tx=p[0]+(Math.random()-.5)*p[2]*1.2;f.ty=p[1]+(Math.random()-.5)*p[2]*.8;return}
    do{f.tx=cx+(Math.random()-.5)*rx*1.7;f.ty=cy+(Math.random()-.5)*ry*1.7}while(!inside(f.tx,f.ty,.78))}
  function frame(now){if(!cv.isConnected)return;
    const t=(now-P.t0)/1000;
    const img=pOk('bg');
    if(img){const im=PSP.bg,k=Math.max(W/im.naturalWidth,H/im.naturalHeight),iw=im.naturalWidth*k,ih=im.naturalHeight*k;x.drawImage(im,(W-iw)/2,(H-ih)/2,iw,ih)}else x.drawImage(bgC,0,0,W,H);
    x.save();blob(x,.97);x.clip();
    /* 水底的光紋，慢慢流動 */
    x.strokeStyle=`rgba(255,255,255,${img?.05:.09})`;x.lineWidth=2.2;
    for(let i=0;i<7;i++){x.beginPath();for(let s=0;s<=20;s++){const u=s/20,px=u*W,py=H*(i/6)+Math.sin(u*7+t*.8+i)*9+Math.sin(u*3-t*.5+i*2)*6;s?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
    for(let i=0;i<7;i++){x.beginPath();for(let s=0;s<=20;s++){const u=s/20,py=u*H,px=W*(i/6)+Math.sin(u*6-t*.7+i*1.3)*11+Math.sin(u*11+t*.4)*4;s?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
    if(P.ring){const R=P.ring;x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=4;x.beginPath();x.arc(W/2,H/2,R.r,0,6.28);x.stroke();
      x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(W/2,H/2,R.r,0,6.28);x.fill()}
    P.food=P.food.filter(p=>now-p.t<25000);
    P.fish.forEach(f=>{let tx=f.tx,ty=f.ty;
      if(P.food.length&&!P.rest){let best=null,bd=1e9;P.food.forEach(p=>{const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<bd){bd=d;best=p}});tx=best.x;ty=best.y;
        if(bd<f.len*.45){P.food.splice(P.food.indexOf(best),1);tone(300+Math.random()*60,.12,'sine',.05);P.rip.push({x:f.x+Math.cos(f.a)*f.len*.5,y:f.y+Math.sin(f.a)*f.len*.5,r:2,a:.45,m:W*.06});f.w+=3;if(!P.food.length&&P.onEat)P.onEat()}}
      else if(Math.hypot(tx-f.x,ty-f.y)<12&&now>f.pick)newTarget(f);
      if(!inside(f.x,f.y,.85)){tx=cx;ty=cy}
      const want=Math.atan2(ty-f.y,tx-f.x);let da=want-f.a;while(da>Math.PI)da-=6.28;while(da<-Math.PI)da+=6.28;
      f.a+=Math.max(-.03,Math.min(.03,da));
      const sp=f.s*P.speed*(P.food.length&&!P.rest?1.8:1)*(P.rest?.9:1);
      f.x+=Math.cos(f.a)*sp;f.y+=Math.sin(f.a)*sp;f.w+=(.07+sp*.12)*P.speed;drawFish(f,t)});
    /* 水面上的東西 */
    P.food.forEach(p=>{p.y+=.02;p.x+=Math.sin(now/900+p.x)*.05;x.fillStyle='rgba(20,60,80,.15)';x.beginPath();x.arc(p.x+2,p.y+3,3,0,6.28);x.fill();
      x.fillStyle='#C99A5E';x.beginPath();x.arc(p.x,p.y,3,0,6.28);x.fill();x.fillStyle='#E9C48E';x.beginPath();x.arc(p.x-.8,p.y-.8,1.1,0,6.28);x.fill()});
    pads.forEach((p,i)=>{const ox=drawPad(p,i,t);if(ox===null)return;if(i===2)lotus(p[0]+ox+p[2]*.15,p[1]-p[2]*.1,W/420,t);if(i===3)bud(p[0]+ox,p[1]-p[2]*.2,W/380)});
    frogTick(now,t);
    if(!calm)petalTick(now);
    P.rip=P.rip.filter(r=>r.a>0.02);P.rip.forEach(r=>{r.r+=.9;r.a*=.975;x.strokeStyle=`rgba(255,255,255,${r.a})`;x.lineWidth=2;x.beginPath();x.ellipse(r.x,r.y,r.r,r.r*.86,0,0,6.28);x.stroke();
      if(r.r>8){x.strokeStyle=`rgba(255,255,255,${r.a*.45})`;x.lineWidth=1.2;x.beginPath();x.ellipse(r.x,r.y,r.r*.62,r.r*.53,0,0,6.28);x.stroke()}if(r.r>r.m)r.a*=.9});
    /* 天空倒影的亮光、閃閃的小光點 */
    x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.ellipse(cx-rx*.35+Math.sin(t*.2)*6,cy-ry*.55,rx*.32,ry*.08,-.15,0,6.28);x.fill();
    for(let i=0;i<5;i++){const a=Math.max(0,Math.sin(t*1.3+i*2.1));if(a<.2)continue;const [gx,gy]=edge(i*1.3+.4,.55+(i%3)*.12);x.fillStyle=`rgba(255,255,255,${a*.8})`;x.beginPath();x.ellipse(gx,gy,4*a,1.1,0,0,6.28);x.fill()}
    x.restore();
    if(img)P.reedTip=[W*.12,H*.2];else{x.drawImage(fgC,0,0,W,H);P.reedTip=drawReeds(t)}
    dflyTick(now,t);
    raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
  P.feed=()=>{for(let i=0;i<5;i++){let px,py;do{px=cx+(Math.random()-.5)*rx;py=cy+(Math.random()-.5)*ry}while(!inside(px,py,.6));P.food.push({x:px,y:py,t:performance.now()})}P.ripple(cx,cy,true);drip()};
  return P}

/* ---------- 花園（原本的菜園）：天空和遠山 → 白圍籬 → 花圃、菜圃、小樹 → 小生命 ---------- */
const G2_FCOL=['#FF8A80','#FFB3D1','#FFD86B','#B9A0F0','#9CC2F5','#FFA552'];
function g2Cloud(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="28" ry="5" fill="#D6E6F2" opacity=".6"/><circle cx="-14" cy="0" r="10" fill="#fff"/><circle cx="2" cy="-6" r="13" fill="#fff"/><circle cx="17" cy="0" r="9" fill="#fff"/><rect x="-24" y="0" width="50" height="8" rx="4" fill="#FBFDFF"/></g>`}
function g2Bfly(c){return `<g class="g2-flap"><ellipse cx="-3.2" cy="-1.5" rx="3.4" ry="4.2" fill="${c}"/><ellipse cx="3.2" cy="-1.5" rx="3.4" ry="4.2" fill="${c}"/><ellipse cx="-2.3" cy="3.2" rx="2.3" ry="2.7" fill="${tint(c,.3)}"/><ellipse cx="2.3" cy="3.2" rx="2.3" ry="2.7" fill="${tint(c,.3)}"/></g><rect x="-.6" y="-3.4" width="1.2" height="7.6" rx=".6" fill="#6B5A52"/>`}
function gardenSvg(m,sway){
  const o=store.owned,c=store.crop,g=store.grow,C=Clay('gd'),sd=store.seed||0;
  const soil=`rgb(${Math.round(185-75*m)},${Math.round(138-64*m)},${Math.round(94-48*m)})`;
  const lf=(x,base,inner)=>`<g class="leaf ${sway?'sway':''}" data-leaf="1" style="transform-origin:${x}px ${base}px">${inner}</g>`;
  const sh=(cx,cy,rx,ry,op=.18)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4E6B3A" opacity="${op}"/>`;
  let seed=11+sd;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  /* 1. 遠景 */
  let s=`<rect width="360" height="250" fill="${C.lin('sky2',[[0,'#CBE8FF'],[.7,'#EEF8FF'],[1,'#FFF8EC']])}"/>
    <g transform="translate(328 30)"><circle r="30" fill="${C.glow('sun2','#FFE7A0')}"/><g class="g2-rays">${[...Array(10)].map((_,i)=>`<rect x="-1.4" y="-25" width="2.8" height="6" rx="1.4" fill="#FFE29A" transform="rotate(${i*36})"/>`).join('')}</g><circle r="14" fill="${C.g('#FFD978',.5)}"/></g>
    <g class="g2-cloud">${g2Cloud(70,34,.8)}</g><g class="g2-cloud" style="animation-delay:-55s;animation-duration:120s">${g2Cloud(220,20,.55)}</g>
    <path d="M0 112 Q60 90 130 104 T260 96 T360 104 V150 H0Z" fill="#D9F0C8"/>
    ${[[34,100],[52,98],[196,101],[300,99],[318,101]].map(([x,y],i)=>`<rect x="${x-1}" y="${y-2}" width="2" height="6" fill="#B9A58C"/><circle cx="${x}" cy="${y-6}" r="${5+i%2*1.5}" fill="${i%2?'#B5DE9E':'#A6D68F'}"/>`).join('')}
    <path d="M0 126 Q100 110 200 122 T360 118 V160 H0Z" fill="#C6E8AD"/>`;
  /* 白圍籬＋爬藤小花＋停在柱子上的小鳥 */
  let fence=`<rect x="0" y="128" width="360" height="5" rx="2.5" fill="#F3E7D3"/><rect x="0" y="142" width="360" height="5" rx="2.5" fill="#F3E7D3"/>`;
  for(let x=4;x<360;x+=17)fence+=`<path d="M${x} 154 V122 Q${x} 116 ${x+5} 114 Q${x+10} 116 ${x+10} 122 V154 Z" fill="${C.v('#FFFAF1',.2,-.06)}"/><path d="M${x+7.5} 121 V152" stroke="#EADCC5" stroke-width="1.2"/>`;
  fence+=`<path d="M0 131 Q20 124 40 131 T80 131 T120 131" stroke="#86C66F" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M236 131 Q256 124 276 131 T316 131 T360 128" stroke="#86C66F" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  fence+=[[12,128,'#FFB3D1'],[34,126,'#fff'],[58,130,'#FFB3D1'],[88,128,'#FFD86B'],[110,130,'#fff'],[250,127,'#B9A0F0'],[272,130,'#fff'],[300,127,'#FFB3D1'],[338,127,'#FFD86B']].map(([x,y,c])=>`<g>${[0,1,2,3,4].map(k=>`<circle cx="${(x+Math.cos(k*1.2566)*2.3).toFixed(1)}" cy="${(y+Math.sin(k*1.2566)*2.3).toFixed(1)}" r="1.9" fill="${c}"/>`).join('')}<circle cx="${x}" cy="${y}" r="1.2" fill="#FFE08A"/></g>`).join('')
    +[[24,133],[70,129],[262,133],[318,130]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="3.2" ry="1.7" fill="#9AD47F" transform="rotate(${i%2?30:-30} ${x} ${y})"/>`).join('');
  const bird=`<g transform="translate(201 114)"><g class="g2-bird"><ellipse cx="0" cy="-6" rx="7" ry="6" fill="${C.g('#9CC2F5',.35)}"/><circle cx="4" cy="-11" r="4.6" fill="${C.g('#9CC2F5',.35)}"/><path d="M8 -11.5 l4 1 -4 1.4z" fill="#FFB25B"/><circle cx="5.4" cy="-12" r=".9" fill="#4A3B3B"/><ellipse cx="2" cy="-4" rx="3.6" ry="3" fill="#FFF6EC"/><path d="M-6 -7 q-6 1 -8 -3 q5 -1 8 0z" fill="#7FA9DE"/><path d="M-1 0 v2 M2 0 v2" stroke="#E0A060" stroke-width="1"/></g></g>`;
  /* 草地 */
  let ground=`<path d="M0 150 Q180 144 360 150 V250 H0Z" fill="${C.lin('grass2',[[0,'#C4E8A8'],[1,'#A2D486']])}"/>`;
  for(let i=0;i<34;i++){const tx=rnd()*360,ty=160+rnd()*88;ground+=`<path d="M${(tx-3).toFixed(1)} ${ty.toFixed(1)} q-1 -4 -2 -6 M${tx.toFixed(1)} ${ty.toFixed(1)} q0 -5 1 -8 M${(tx+3).toFixed(1)} ${ty.toFixed(1)} q2 -4 3 -6" stroke="${i%2?'#8EC473':'#B2DE96'}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`}
  ground+=[[20,232],[44,246],[300,248],[340,226],[200,248]].map(([x,y],i)=>`<g>${[0,1,2,3,4].map(k=>`<circle cx="${(x+Math.cos(k*1.2566)*1.9).toFixed(1)}" cy="${(y+Math.sin(k*1.2566)*1.9).toFixed(1)}" r="1.5" fill="${i%2?'#fff':'#FFD86B'}"/>`).join('')}</g>`).join('');
  ground+=[[30,214,13],[52,232,12],[24,246,11]].map(([x,y,r])=>`${sh(x+1,y+2,r,r*.42,.14)}<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.45}" fill="${C.v('#EFE6D6',.3,-.08)}"/>`).join('');
  /* 2. 場景：向日葵（一直都在）、小樹、花圃 */
  const sun=(x,base,h,i)=>`<g class="amb-sway" style="animation-delay:-${i*1.7}s;animation-duration:6s"><path d="M${x} ${base} V${base-h}" stroke="#6FB866" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="${x+5}" cy="${base-h*.45}" rx="6" ry="2.6" fill="#86CC77" transform="rotate(-25 ${x+5} ${base-h*.45})"/><ellipse cx="${x-5}" cy="${base-h*.65}" rx="5" ry="2.3" fill="#7CC36D" transform="rotate(25 ${x-5} ${base-h*.65})"/>${[...Array(12)].map((_,k)=>`<ellipse cx="${x}" cy="${base-h-7}" rx="2.4" ry="5" fill="#FFCF4A" transform="rotate(${k*30} ${x} ${base-h})"/>`).join('')}<circle cx="${x}" cy="${base-h}" r="5" fill="${C.g('#A0703F',.3)}"/></g>`;
  let mid=sun(150,160,40,0)+sun(166,158,32,1)+sun(232,160,36,2);
  if(o.includes('tree')){const st=g.tree||1;mid+=lf(320,172,`<g transform="translate(268 10)">${clayTree(C,st,(store.seed||7)%2)}</g>`)}
  if(o.includes('flowers')){const n=[4,7,10][Math.max(0,Math.min(2,(g.flowers||1)-1))];
    mid+=`${sh(64,186,58,9,.16)}<ellipse cx="62" cy="181" rx="56" ry="13" fill="${C.v('#B98A62',.15,-.1)}"/>${[...Array(13)].map((_,i)=>{const a=Math.PI*(.02+i*.08);return `<ellipse cx="${(62-Math.cos(a)*55).toFixed(1)}" cy="${(184+Math.sin(a)*8).toFixed(1)}" rx="5" ry="3" fill="${C.g(['#F1E8DA','#F6DCD2','#DCE7EC'][i%3],.4)}"/>`}).join('')}`;
    const fl=[];for(let i=0;i<n;i++){const row=i%2,x=16+((i*9.3)%92)+row*5,base=row?186:176;fl.push([base,x,i])}
    fl.sort((p,q)=>p[0]-q[0]).forEach(([base,x,i])=>{const r=5.6+(i%3)*.7,tp=(i+sd)%3,col=G2_FCOL[(i+sd)%6];mid+=lf(x,base,clayFlower(C,x,base-r*2.8,col,r,tp))})}
  /* 菜圃：木頭框，前面的木板看得到板子的縫 */
  let bed='';
  if(o.includes('garden')){
    bed=`${sh(190,244,112,8,.2)}<path d="M84 196 Q84 188 92 188 H288 Q296 188 296 196 V230 H84Z" fill="${C.v('#C99467',.25,-.05)}"/>
      <rect x="92" y="193" width="196" height="38" rx="8" fill="${soil}" id="soil"/>
      <rect x="92" y="193" width="196" height="38" rx="8" fill="${C.lin('soil2',[[0,'rgba(0,0,0,.14)'],[.3,'rgba(0,0,0,0)'],[1,'rgba(255,255,255,.06)']])}"/>
      ${[204,222].map(y=>`<path d="M100 ${y} Q190 ${y-3} 280 ${y}" stroke="rgba(60,30,10,.16)" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}
      ${[[110,214],[150,200],[200,226],[246,212],[270,226],[132,228]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.3" fill="rgba(255,255,255,.18)"/>`).join('')}`;
    let pl='';
    const spots=[[126,207,0],[190,205,0],[254,207,0],[158,220,1],[222,220,1]];
    if(c){const st=c.st||0;spots.forEach(([x,base,front])=>{pl+=lf(x,base,`${sh(x,base+1,9,2.4,.18)}${st>=3?clayCrop(C,c.k,x,base+2,front?1.55:1.4):st>=1?claySprout(C,x,base,st,front?2.2:2):`<ellipse cx="${x}" cy="${base-1}" rx="5" ry="2.4" fill="#8A5E3F"/><ellipse cx="${x-1}" cy="${base-2}" rx="1.8" ry="1" fill="#E9D3A8"/>`}`)})}
    else pl+=`<text x="190" y="219" text-anchor="middle" font-size="13" fill="#FFF4DE">還沒有種東西</text>`;
    /* 前面那片木板＋小牌子 */
    const front=`<rect x="80" y="226" width="220" height="18" rx="6" fill="${C.v('#D7A577',.25,-.12)}"/>${[124,168,212,256].map(x=>`<path d="M${x} 228 v14" stroke="rgba(110,70,40,.25)" stroke-width="1.4"/>`).join('')}
      ${[86,294].map(x=>`<circle cx="${x}" cy="235" r="1.4" fill="rgba(110,70,40,.35)"/>`).join('')}<rect x="84" y="227" width="212" height="3" rx="1.5" fill="rgba(255,255,255,.3)"/>`;
    const sign=`<g transform="translate(306 214)">${sh(0,26,6,2)}<rect x="-1.6" y="4" width="3.2" height="22" rx="1.4" fill="#B98A5E"/><rect x="-12" y="-9" width="24" height="16" rx="4" fill="${C.v('#F3D9AE',.3,-.08)}"/>${c?`<text x="0" y="3.6" text-anchor="middle" font-size="10">${CROPS[c.k][0]}</text>`:`<text x="0" y="3" text-anchor="middle" font-size="8" fill="#9C7A55">?</text>`}</g>`;
    bed+=pl+front+sign}
  /* 澆水壺（擺著的），下雨的小雲朵（按住澆水時才出來） */
  const can=`<g transform="translate(336 240)">${sh(0,4,11,3)}<path d="M-8 -12 h14 l2 14 h-18 Z" fill="${C.v('#A9D3F2',.35,-.12)}"/><path d="M6 -8 q9 -2 11 -9" stroke="#8DBFDD" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-8 -7 q-6 0 -6 6" stroke="#8DBFDD" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="-3" cy="-6" rx="2" ry="4" fill="#fff" opacity=".4"/></g>`;
  const rain=`<g class="g2-rain" pointer-events="none">${g2Cloud(130,106,1.05)}${g2Cloud(196,98,1.2)}${g2Cloud(262,106,1.05)}</g>`;
  /* 3. 小生命：兩隻蝴蝶、一隻蜜蜂、木板上的瓢蟲、草地上慢慢爬的蝸牛 */
  const life=`<g pointer-events="none">
    <g class="g2-bx1"><g class="g2-by1">${g2Bfly('#FFB3D1')}</g></g><g class="g2-bx2"><g class="g2-by2">${g2Bfly('#B9A0F0')}</g></g>
    <g class="g2-bee"><g transform="scale(.9)"><ellipse cx="-1" cy="-5" rx="3" ry="2" fill="#fff" opacity=".8" class="g2-flap"/><ellipse cx="2" cy="-5" rx="3" ry="2" fill="#fff" opacity=".8" class="g2-flap"/><ellipse cx="0" cy="0" rx="5.4" ry="4" fill="#FFD25E"/><path d="M-1.5 -3.8 v7.6 M1.6 -3.8 v7.6" stroke="#6B5A52" stroke-width="1.3"/><circle cx="4.4" cy="-.6" r="1" fill="#4A3B3B"/></g></g>
    ${o.includes('garden')?`<g transform="translate(110 227)"><g class="g2-lady"><ellipse cx="0" cy="0" rx="4" ry="3.2" fill="#FF6F5E"/><path d="M0 -3 v6" stroke="#6B3A32" stroke-width=".7"/><circle cx="3.6" cy="0" r="1.8" fill="#4A3B3B"/><circle cx="-1.6" cy="-1.2" r=".8" fill="#4A3B3B"/><circle cx="-1.4" cy="1.4" r=".8" fill="#4A3B3B"/><circle cx="1.4" cy="-1.4" r=".7" fill="#4A3B3B"/></g></g>`:''}
    <g transform="translate(70 247)"><g class="g2-snail"><path d="M-8 0 Q-9 -3 -4 -3 H6 Q10 -3 11 -8 M8 -3.5 l1 -5" stroke="#E9C9A0" stroke-width="2.4" fill="#F3DDBE" stroke-linecap="round"/><circle cx="-1" cy="-7" r="6" fill="${C.g('#E9A87C',.35)}"/><path d="M-1 -7 m-3 0 a3 3 0 1 1 3 3" stroke="#C7865E" stroke-width="1.1" fill="none"/></g></g>
  </g>`;
  /* 澆過水：葉子上亮晶晶的小水珠 */
  const dew=m>=1&&o.includes('garden')?`<g pointer-events="none">${[[120,196],[186,194],[250,198],[156,214],[226,212]].map(([x,y],i)=>`<circle class="g2-tw" style="animation-delay:${i*.5}s" cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join('')}</g>`:'';
  return `<svg viewBox="0 0 360 250" width="100%" class="gardensvg g2">${C.defs()}${s}${fence}${bird}${ground}${mid}${can}${bed}${dew}${life}${rain}<g id="drops"></g></svg>`}
/* 按住澆水時，小雲朵飄過來下雨（renderGarden 不用改） */
(function(){const area=()=>document.querySelector('#gdArea svg');
  document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('#gWater')){const s=area();if(s)s.classList.add('pour')}});
  const off=()=>{const s=area();if(s)s.classList.remove('pour')};
  ['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,off));
  document.addEventListener('pointerleave',e=>{if(e.target&&e.target.id==='gWater')off()},true)})();
