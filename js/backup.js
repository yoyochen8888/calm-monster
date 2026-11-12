/* 加到主畫面、離線可用、備份與還原（v21） */

/* ---------- 離線：註冊 service worker（預覽環境不支援時安靜略過） ---------- */
let swState='none';
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  try{navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{swState='ready';renderApp()}).catch(()=>{swState='fail'})}catch(e){swState='fail'}}
function isStandalone(){try{return navigator.standalone===true||matchMedia('(display-mode: standalone)').matches}catch(e){return false}}
function renderApp(){const box=$('#appBox');if(!box)return;
  const off=swState==='ready'?'✅ 這台裝置已經存好，沒有網路也能開。':swState==='fail'?'這個瀏覽器目前不能離線使用（需要網路才能開）。':'離線功能準備中，或這個環境不支援。';
  box.innerHTML=isStandalone()
    ?`<p style="font-size:.9rem">✅ 已經從主畫面開啟。${off}</p>`
    :`<p style="font-size:.9rem">把情緒怪獸家園放到主畫面，孩子情緒來的時候一點就開，不用找網址。${off}</p>
      <ol style="font-size:.9rem;margin:4px 0 6px;padding-left:1.3em;line-height:1.8"><li>iPad／iPhone：用 <b>Safari</b> 開這個網頁，按上方的「分享」<b>⬆️</b></li><li>選「<b>加入主畫面</b>」</li><li>Android：瀏覽器選單 →「加到主畫面」或「安裝應用程式」</li></ol>
      <p class="note" style="margin:0 0 6px">⚠️ 在 iPad／iPhone，主畫面版本的紀錄和 Safari 是<b>分開</b>的。想把現在的星星和紀錄帶過去：先在這裡按「備份」，到主畫面版本再按「還原」。</p>`}

/* ---------- 備份與還原 ---------- */
const BK_PREV='calmMonster_prev';
/* 把記憶體裡的資料也換掉，避免重新整理前被舊資料蓋回去 */
function swapStore(d){Object.keys(store).forEach(k=>delete store[k]);Object.assign(store,d)}
function backupText(){return JSON.stringify({app:'calm-monster',v:1,at:new Date().toISOString(),data:store})}
function readBackup(txt){let o;try{o=JSON.parse(txt)}catch(e){return null}
  const d=o&&o.app==='calm-monster'&&o.data?o.data:o;/* 也接受只有資料的舊格式 */
  if(!d||typeof d!=='object'||Array.isArray(d))return null;
  if(typeof d.xp!=='object'||!Array.isArray(d.log))return null;
  return {data:d,at:o.at||''}}
function bkSummary(d){const mons=Object.keys(d.xp||{}).filter(k=>d.xp[k]>0).length;
  return `${d.hero&&d.hero.name?d.hero.name+'，':''}⭐ ${d.stars||0}、${mons} 隻怪獸、${(d.log||[]).length} 筆情緒紀錄`}
function renderBackup(){const box=$('#bkBox');if(!box)return;
  if(typeof inTest==='function'&&inTest()){box.innerHTML='<p class="note">測試模式中不能備份或還原，請先結束測試。</p>';return}
  box.innerHTML=`<p style="font-size:.9rem">紀錄只存在這台裝置的瀏覽器裡，清除瀏覽資料或換裝置就會不見。建議偶爾備份一次。${store.lastBackup?`<br>上次備份：${store.lastBackup}`:'<br>還沒有備份過。'}</p>
    <div class="chips" style="justify-content:flex-start"><button class="chip" id="bkSave">💾 備份成檔案</button><button class="chip" id="bkCopy">📋 複製備份文字</button><button class="chip" id="bkOpen">📂 還原…</button></div>
    <div id="bkRestore" style="display:none">
      <p style="font-size:.9rem;margin:6px 0">選備份檔，或把備份文字貼在下面：</p>
      <input type="file" id="bkFile" accept=".json,application/json,text/plain" style="font:inherit;font-size:.85rem;max-width:100%">
      <textarea id="bkText" placeholder="把備份文字貼在這裡" style="width:100%;min-height:70px;margin-top:6px;border-radius:12px;border:2px solid var(--line);padding:8px;font:inherit;font-size:.8rem"></textarea>
      <div id="bkCheck"></div>
    </div>
    <textarea id="bkOut" readonly style="display:none;width:100%;min-height:90px;margin-top:6px;border-radius:12px;border:2px solid var(--line);padding:8px;font:inherit;font-size:.75rem"></textarea>`;
  const mark=()=>{store.lastBackup=today();save()};
  const showOut=t=>{const o=$('#bkOut');o.style.display='';o.value=t;o.focus();o.select()};
  $('#bkSave').onclick=()=>{mark();const t=backupText();
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=`怪獸家園備份-${today()}.json`;document.body.appendChild(a);a.click();a.remove();
      toast('已經存成檔案（在「檔案」App 的下載項目）。<br>沒看到的話，改用「複製備份文字」');}
    catch(e){showOut(t);toast('這裡不能存檔，請長按下方文字複製，貼到備忘錄')}renderBackupLine()};
  $('#bkCopy').onclick=async()=>{mark();const t=backupText();
    try{await navigator.clipboard.writeText(t);toast('已複製備份文字，可以貼到備忘錄或傳給自己')}catch(e){showOut(t);toast('請長按下方文字選取後複製')}renderBackupLine()};
  $('#bkOpen').onclick=()=>{const r=$('#bkRestore');r.style.display=r.style.display==='none'?'':'none'};
  const check=txt=>{const c=$('#bkCheck');c.innerHTML='';if(!txt.trim())return;const b=readBackup(txt);
    if(!b){c.innerHTML='<p class="note" style="color:var(--warn)">這不是情緒怪獸家園的備份，沒有做任何更動。</p>';return}
    c.innerHTML=`<p style="font-size:.9rem;margin:6px 0">備份內容${b.at?`（${b.at.slice(0,10)}）`:''}：<b>${bkSummary(b.data)}</b><br>這台裝置現在：${bkSummary(store)}<br>還原後，這台裝置現在的紀錄會被備份<b>取代</b>。</p>`;
    c.appendChild(holdBtn('按住確認還原',2000,()=>{
      try{localStorage.setItem(BK_PREV,JSON.stringify(store));localStorage.setItem('calmMonster',JSON.stringify(b.data))}catch(e){toast('還原失敗：這個瀏覽器不能儲存');return}
      swapStore(b.data);
      toast('還原好了，重新整理中…',true);setTimeout(()=>location.reload(),900)}))};
  $('#bkText').oninput=()=>check($('#bkText').value);
  $('#bkFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{$('#bkText').value=String(rd.result);check(String(rd.result))};rd.readAsText(f)};
  let prev=null;try{prev=localStorage.getItem(BK_PREV)}catch(e){}
  if(prev){const u=document.createElement('button');u.className='chip';u.style.marginTop='6px';u.textContent='↩️ 還原錯了？換回還原前的紀錄';
    u.onclick=()=>{try{const cur=JSON.stringify(store);localStorage.setItem('calmMonster',prev);localStorage.setItem(BK_PREV,cur);swapStore(JSON.parse(prev))}catch(e){return}toast('已換回，重新整理中…',true);setTimeout(()=>location.reload(),900)};box.appendChild(u)}
}
function renderBackupLine(){/* 更新「上次備份」那行，不收起已展開的區塊 */const p=$('#bkBox p');if(p&&store.lastBackup)p.innerHTML=p.innerHTML.replace(/<br>.*$/,`<br>上次備份：${store.lastBackup}`)}
