/* 環境音（v24，預設關閉）＋「靜靜看」
   聲音全部由程式合成，不下載音檔：白天風聲和偶爾的鳥叫、晚上蟲鳴、池塘水聲。都很小聲。 */
let AMB=null;
function ambNoise(a){const len=a.sampleRate*2,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}/* 褐噪音，比較柔 */
  const s=a.createBufferSource();s.buffer=buf;s.loop=true;return s}
function ambStop(){if(!AMB)return;const A=AMB;AMB=null;A.timers.forEach(clearTimeout);
  try{const a=ac();A.master.gain.cancelScheduledValues(a.currentTime);A.master.gain.setValueAtTime(A.master.gain.value,a.currentTime);A.master.gain.linearRampToValueAtTime(0,a.currentTime+.8);
    setTimeout(()=>{A.nodes.forEach(n=>{try{n.stop()}catch(e){}});try{A.master.disconnect()}catch(e){}},900)}catch(e){}}
function ambStart(mode){if(AMB&&AMB.mode===mode)return;ambStop();const a=ac();if(!a)return;try{
  const master=a.createGain();master.gain.value=0;master.gain.linearRampToValueAtTime(1,a.currentTime+1.5);master.connect(a.destination);
  const A={mode,master,nodes:[],timers:[]};AMB=A;
  /* 底層：風聲或水聲，音量慢慢起伏 */
  const n=ambNoise(a),f=a.createBiquadFilter(),g=a.createGain(),lfo=a.createOscillator(),lg=a.createGain();
  f.type=mode==='pond'?'bandpass':'lowpass';f.frequency.value=mode==='pond'?700:mode==='night'?260:420;
  g.gain.value=mode==='pond'?.05:.035;lfo.frequency.value=mode==='pond'?.35:.09;lg.gain.value=g.gain.value*.45;
  lfo.connect(lg);lg.connect(g.gain);n.connect(f);f.connect(g);g.connect(master);n.start();lfo.start();A.nodes.push(n,lfo);
  const blip=(freqs,dur,vol,type='sine')=>{if(AMB!==A)return;const t=a.currentTime,o=a.createOscillator(),e=a.createGain();o.type=type;
    o.frequency.setValueAtTime(freqs[0],t);freqs.slice(1).forEach((fq,i)=>o.frequency.linearRampToValueAtTime(fq,t+dur*(i+1)/(freqs.length-1)));
    e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(vol,t+dur*.2);e.gain.linearRampToValueAtTime(0,t+dur);o.connect(e);e.connect(master);o.start(t);o.stop(t+dur+.02)};
  const loop=(fn,min,max)=>{const go=()=>{if(AMB!==A)return;fn();A.timers.push(setTimeout(go,min+Math.random()*(max-min)))};A.timers.push(setTimeout(go,min*.5+Math.random()*min))};
  if(mode==='day')loop(()=>{const base=2100+Math.random()*900,k=2+Math.floor(Math.random()*2);for(let i=0;i<k;i++)A.timers.push(setTimeout(()=>blip([base,base*1.25,base*1.05],.13,.02),i*170))},5000,11000);
  if(mode==='night')loop(()=>{for(let i=0;i<4;i++)A.timers.push(setTimeout(()=>blip([4300,4300],.045,.009),i*75))},1600,3200);
  if(mode==='pond')loop(()=>blip([900+Math.random()*500,500],.18,.025),3500,8000);
}catch(e){AMB=null}}
function ambSync(){const st=S.step;
  const want=!store.sound?null:(st===10||st===27)?(isNight()?'night':'day'):(st===24||(st===3&&S.act==='fish'))?'pond':null;
  if(want)ambStart(want);else ambStop()}
/* 瀏覽器要等使用者碰過畫面才能出聲 */
document.addEventListener('pointerdown',()=>{if(store.sound){ac();ambSync()}},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)ambStop();else ambSync()});
function setSound(on){store.sound=!!on;save();if(on)ac();ambSync();renderSound()}
function renderSound(){const b=$('#soundBox');if(b){b.innerHTML=`<p style="font-size:.9rem">家園、靜靜看、池塘會有很輕的風聲、鳥叫、蟲鳴和水聲。冷靜流程中（除了看魚呼吸）不會有環境音。</p>
    <div class="chips" style="justify-content:flex-start"><button class="chip ${store.sound?'sel':''}" data-snd="1">開</button><button class="chip ${store.sound?'':'sel'}" data-snd="0">關</button></div>`;
    $$('[data-snd]').forEach(x=>x.onclick=()=>setSound(x.dataset.snd==='1'))}
  const q=$('#qSound');if(q)q.textContent=store.sound?'🔈 聲音：開':'🔇 聲音：關'}

/* ---------- 靜靜看（step 27）：只有風景，沒有任務、星星 ---------- */
function renderQuiet(){document.body.classList.add('quietmode');
  $('#scene').innerHTML='';/* 同一個畫面不能同時存在兩份，漸層會互相打架 */
  const was=S.decor;S.decor=false;$('#quietScene').innerHTML=scene()+`<div class="qring ${S.qBreath?'on':''}"></div>`;S.decor=was;
  startWander('#quietScene');
  $('#quietBtns').innerHTML=`<button class="chip ${S.qBreath?'sel':''}" id="qBreath">🫧 跟著呼吸</button><button class="chip" id="qSound"></button><button class="btn ghost small" id="qHome">回家園</button>`;
  renderSound();
  const word=$('#quietWord');word.textContent=S.qBreath?'':'靜靜看一會兒，沒有要做的事。';
  $('#qBreath').onclick=()=>{S.qBreath=!S.qBreath;stopAct();renderQuiet()};
  $('#qSound').onclick=()=>setSound(!store.sound);
  $('#qHome').onclick=()=>go(10);
  if(S.qBreath){const cyc=()=>{const w=$('#quietWord');if(!w||S.step!==27||!S.qBreath)return;w.textContent='吸氣……';later(()=>{const w2=$('#quietWord');if(w2&&S.step===27&&S.qBreath)w2.textContent='慢慢吐氣……'},4000);later(cyc,10000)};cyc()}
}
