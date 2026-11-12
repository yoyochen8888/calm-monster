/* 新手引導（v24）：第一次打開時的 4 張說明；大人區可以重看 */
function introSlides(){const m=k=>monster(k,78,'',{level:1,grow:1,eq:{head:null,neck:null}});
  return [
  [`<div class="introrow">${m('angry')}${m('sad')}${m('scared')}</div>`,'歡迎來到情緒怪獸家園',
   '<p>生氣、難過、擔心……每一種情緒都像一隻小怪獸。牠們不是壞東西，只是在說「我不舒服」。</p><p>這裡陪孩子認識牠們，讓大大的情緒慢慢變小。</p>'],
  [`<div class="introrow">${hero('fox',84,{})}</div>`,'孩子可以這樣用',
   '<ul><li><b>情緒來了</b>：到「冷靜站」，一步一步讓怪獸變小</li><li><b>平時</b>：心情打卡、練習冷靜方法、照顧家園的池塘和菜園</li><li><b>星星</b>：面對情緒和練習都會得到，存進願望罐，換真實的活動</li></ul>'],
  [`<div class="introico">🤝</div>`,'大人可以這樣用',
   '<ul><li>右上角「<b>大人看這裡</b>」：每種情緒的引導語、陪伴模式、冷靜計時器</li><li>事情過後：家園會提醒「<b>一起回顧</b>」，帶孩子回頭看</li><li>設定兌換券、看每週回顧，也可以把紀錄複製給老師</li></ul>'],
  [`<div class="introico">🆘</div>`,'情緒很大的時候',
   '<p>按右下角紅色的「<b>🆘 馬上冷靜</b>」。不用選任何東西，直接帶孩子一起呼吸。</p><p>把情緒怪獸家園加到主畫面，需要時一點就開（步驟在「大人看這裡」）。</p><p class="note">這是日常陪伴的小工具，不能取代專業評估。孩子情緒爆發很頻繁、很強烈，或有傷害自己或他人的情形，請找兒童心智科醫師、心理師或學校輔導老師。</p>']]}
function showIntro(){const old=document.querySelector('.introov');if(old)old.remove();
  const S_=introSlides();let i=0;const ov=document.createElement('div');ov.className='introov';document.body.appendChild(ov);
  const done=()=>{ov.remove();if(!store.intro){store.intro=1;save()}};
  const draw=()=>{const s=S_[i];ov.innerHTML=`<div class="introcard">${s[0]}<h2>${s[1]}</h2><div class="introtxt">${s[2]}</div>
      <div class="dots">${S_.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>
      <div class="row">${i?`<button class="btn ghost" id="inBack">上一步</button>`:`<button class="btn ghost" id="inSkip">略過</button>`}<button class="btn" id="inNext">${i===S_.length-1?'開始使用':'下一步'}</button></div></div>`;
    const b=ov.querySelector('#inBack');if(b)b.onclick=()=>{i--;draw()};
    const k=ov.querySelector('#inSkip');if(k)k.onclick=done;
    ov.querySelector('#inNext').onclick=()=>{if(i===S_.length-1)done();else{i++;draw()}}};
  draw()}
(()=>{const b=$('#introAgain');if(b)b.onclick=()=>{closeP();showIntro()}})();
