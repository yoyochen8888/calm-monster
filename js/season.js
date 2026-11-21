/* v56：四季院子＋會動的家具
   - 院子依「真實月份」換季：3–5 春、6–8 夏、9–11 秋、12–2 冬。不靠花時間解鎖，也不跟孩子的情緒連動
     （心裡的天氣留在冷靜流程裡）。
   - 底圖、兩棵樹跟著季節換圖；冬天不放蝴蝶。
   - 每一季有一點點飄落的小東西（春花瓣、秋葉子、冬雪），很少、很慢；減少動態時全部停下。
   - 鞦韆拆成「架子＋座椅」，座椅慢慢盪；帳篷拆成「帳篷＋小旗子」，旗子輕輕飄。
   載入在 yard.js 後面。拿掉這個檔案和 css/season.css，院子就回到原本的春天樣子。 */

function season(){const m=new Date().getMonth()+1;
  return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'}
const SEASON_BG={spring:'img/yard_bg.webp',summer:'img/yard_bg_summer.webp',autumn:'img/yard_bg_autumn.webp',winter:'img/yard_bg_winter.webp'};

/* 樹：四季圖跟原圖同樣大小（449×520、432×520），擺位不用改 */
function seasonTrees(){const s=season();
  Y_IMG.apple[0]=`img/yard_tree_apple_${s}.webp`;Y_IMG.blossom[0]=`img/yard_tree_blossom_${s}.webp`}

/* 會動的家具：圖跟原本的鞦韆（335×400）、帳篷一樣的框，座椅用同一個框疊上去 */
Object.assign(Y_IMG,{swingFrame:['img/y_swing_frame.webp',335,400],swingSeat:['img/y_swing_seat.webp',335,400],
  tentBody:['img/y_tent_body.webp',400,355],tentFlag:['img/y_tent_flag.webp',44,71]});
/* 鞦韆：座椅繞著橫桿中間（原圖 169,39）慢慢盪，座椅畫在架子後面，繩子上端藏在橫桿裡 */
Y_ITEMS.swing.draw=C=>{const w=50,k=w/335,h=400*k,x0=62-w/2,y0=268-h,px=(x0+169*k).toFixed(1),py=(y0+39*k).toFixed(1);
  return `${ySoft(62,266,30,6)}<g class="yswing" style="transform-origin:${px}px ${py}px">${yImg('swingSeat',62,268,w)}</g>${yImg('swingFrame',62,268,w)}`};
/* 帳篷：旗桿插在帳篷尖上（帳篷圖 x200 y0），旗子從旗桿那邊輕輕飄 */
Y_ITEMS.tent.draw=C=>{const w=70,k=w/400,h=355*k,ax=58,ay=194-h,fw=44*k*1.1,fh=71*k*1.1;
  const fx=ax-fw*.12,fy=ay-fh*.88;
  return `${ySoft(58,190,36,8,.7)}${yImg('tentBody',58,194,w)}<g class="yflag" style="transform-origin:${fx.toFixed(1)}px ${(fy+fh).toFixed(1)}px"><image href="img/y_tent_flag.webp" x="${(fx-fw*.08).toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}"/></g>`};

/* 季節的小東西：只有幾片，慢慢飄，不能點、不能收集 */
function seasonFall(night){const s=season();if(s==='summer')return '';
  const n=s==='winter'?9:5;
  const one=(i)=>{const x=20+((i*73)%320),d=(i*2.3)%9,dur=s==='winter'?14+i%5:18+i%6;
    const art=s==='winter'?`<circle r="${1.4+(i%3)*.5}" fill="#fff" opacity=".9"/>`
      :s==='autumn'?`<path d="M0 -3 C3 -2 3 2 0 3 C-3 2 -3 -2 0 -3Z" fill="${['#F2A65A','#E9845C','#F4C35E'][i%3]}"/>`
      :`<ellipse rx="2.4" ry="1.5" fill="#FFC6D6"/>`;
    return `<g transform="translate(${x} -8)"><g class="yfall ${s}" style="animation-duration:${dur}s;animation-delay:-${d}s">${art}</g></g>`};
  if(night&&s!=='winter')return '';
  return `<g pointer-events="none">${Array.from({length:n},(_,i)=>one(i)).join('')}</g>`}

(()=>{
  const sc=scene;scene=function(){seasonTrees();const s=season();
    let h=sc().replace('href="img/yard_bg.webp"',`href="${SEASON_BG[s]}"`);
    return h.replace('<svg class="yard"',`<svg class="yard s-${s}"`).replace(/<\/svg>$/,seasonFall(isNight())+'</svg>')};
  const ya=yAmbient;yAmbient=function(C,night){return season()==='winter'&&!night?'':ya(C,night)};
})();
