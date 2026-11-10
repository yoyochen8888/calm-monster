/* 資料、狀態、存檔（所有怪獸、年齡、商店的設定都在這裡） */
/* ---------- data ---------- */
const AGES=[
  {id:'young',ico:'🌱',name:'小小孩',sub:'3–5 歲'},
  {id:'mid',ico:'🌿',name:'小學低年級',sub:'6–8 歲'},
  {id:'old',ico:'🌳',name:'小學中高年級',sub:'9–12 歲'}
];
const EMO={
  angry:{cname:'紅色',name:'生氣怪獸',color:'#F26B5B',feel:'好生氣',body:'臉熱熱、拳頭握緊緊',acts:['bubbles','light','breathe','squeeze'],face:'angry'},
  sad:{cname:'藍色',name:'難過怪獸',color:'#5B8DEF',feel:'好難過',body:'眼睛酸酸、想哭',acts:['breathe','butterfly','senses'],face:'sad'},
  defiant:{cname:'橘色',name:'不服氣怪獸',color:'#F5A524',feel:'好不服氣',body:'心裡悶悶、不甘心',acts:['light','squeeze','breathe','bubbles'],face:'defiant'},
  stuck:{cname:'紫色',name:'做不到怪獸',color:'#9B7BE0',feel:'好挫折，覺得做不到',body:'想放棄、想丟掉',acts:['breathe','squeeze','bubbles'],face:'stuck'},
  scared:{cname:'綠色',name:'擔心怪獸',color:'#3FB6A8',feel:'好擔心',body:'肚子怪怪、心跳很快',acts:['breathe','senses','butterfly'],face:'scared'},
  wronged:{cname:'粉紅色',name:'委屈怪獸',color:'#EC7FB0',feel:'好委屈',body:'想哭又說不出來',acts:['butterfly','breathe','senses'],face:'wronged'},
  reluctant:{cname:'蜂蜜色',name:'捨不得怪獸',color:'#E9B53C',feel:'好捨不得，還想玩、不想分開',body:'想黏著不放手、想哭、腳不想動',acts:['light','breathe','butterfly'],face:'sad'},
  jealous:{cname:'黃綠色',name:'嫉妒怪獸',color:'#9CC93B',feel:'好嫉妒，別人有我沒有',body:'心裡酸酸的、想搶過來',acts:['breathe','squeeze','senses'],face:'defiant'},
  shy:{cname:'桃色',name:'害羞怪獸',color:'#F59A72',feel:'好害羞，不敢說',body:'臉熱熱、想躲到大人後面',acts:['breathe','butterfly','senses'],face:'scared'},
  hyper:{cname:'天藍色',name:'興奮過頭怪獸',color:'#2EB8E0',feel:'好興奮，停不下來',body:'身體一直動、聲音越來越大',acts:['light','breathe','squeeze'],face:'angry'},
  embarrassed:{cname:'梅紅色',name:'尷尬怪獸',color:'#C766B8',feel:'好尷尬、好丟臉',body:'臉紅紅、想消失',acts:['breathe','butterfly','squeeze'],face:'wronged'},
  guilty:{cname:'灰藍色',name:'內疚怪獸',color:'#7C93B5',feel:'好內疚，覺得自己做錯了',body:'心裡沉沉的、不敢看別人',acts:['breathe','butterfly','senses'],face:'sad'},
  lonely:{cname:'靛藍色',name:'孤單怪獸',color:'#4F63B0',feel:'好孤單，好像沒人陪',body:'心裡空空的、提不起勁',acts:['butterfly','breathe','senses'],face:'sad'},
  stress:{cname:'咖啡色',name:'壓力怪獸',color:'#A97B50',feel:'壓力好大，事情好多',body:'肩膀緊緊、頭脹脹、睡不好',acts:['breathe','squeeze','senses'],face:'stuck'}
};
/* 依年齡顯示的怪獸（已經一起冷靜過的怪獸一定會顯示） */
const AGE_EMO={young:['angry','sad','scared','wronged','reluctant'],
  mid:['angry','sad','defiant','stuck','scared','wronged','reluctant','jealous','shy','hyper'],
  old:Object.keys(EMO)};
function visibleEmo(){const base=AGE_EMO[S.age||'mid']||AGE_EMO.mid;return Object.keys(EMO).filter(k=>base.includes(k)||(store.xp&&store.xp[k]>0))}
/* 有 3D 圖的怪獸；其他先用簡單圖形頂著 */
const HASART=new Set(['angry','sad','defiant','stuck','scared','wronged']);
const LV=[
  {n:1,t:'小小的',h:'#6CCB70'},{n:2,t:'有一點',h:'#A8D86B'},{n:3,t:'中中的',h:'#F7D046'},{n:4,t:'很大',h:'#F5A524'},{n:5,t:'超級大',h:'#F26B5B'}
];
const ACT_NAME={light:'紅綠燈',breathe:'呼吸',bubbles:'戳泡泡',squeeze:'擠檸檬',senses:'找找看',butterfly:'蝴蝶抱'};
const CAUSES=['我做不到 / 太難了','我輸了','跟我想的不一樣','我覺得不公平','我被說 / 被罵','不能再玩了','東西壞掉了','被別人誤會','我也不知道'];
const WANTS=['抱抱','自己靜一下','再試一次','有人幫我','休息一下','說給別人聽'];
const PLANS={
  young:[
    ['吹三口氣','像吹蠟燭一樣，呼——呼——呼——'],
    ['說魔法話','「我還在學。」'],
    ['找大人抱抱','抱一下，怪獸就變小'],
    ['喝口水再回來','休息一下，等一下再試']
  ],
  mid:[
    ['說「我還沒做到」','不是做不到，是「還沒」'],
    ['切成小步驟','先做第一步就好'],
    ['換個方法試試','這招不行，換一招'],
    ['請人幫忙','開口求助也很勇敢']
  ],
  old:[
    ['想一個 Plan B','A 不行時，B 是什麼？'],
    ['跟昨天的自己比','我比上次進步了哪裡？'],
    ['休息 10 分鐘再回來','大腦冷卻後更好想'],
    ['寫下來或畫下來','把怪獸放到紙上']
  ]
};
const PARENT={
  angry:{first:'先確保安全，放低音量，蹲到孩子眼睛的高度。這時候先不講道理。',
    say:{young:'「你好生氣，生氣怪獸好大。我在這裡陪你，我們一起吹吹氣。」',
         mid:'「你很生氣，因為事情跟你想的不一樣。生氣可以，但不可以打人或丟東西。我們先讓身體冷靜。」',
         old:'「看起來你真的很火。你想自己冷靜幾分鐘，還是要我陪你？等你準備好我們再談。」'},
    avoid:'「不准生氣！」「這有什麼好氣的」「再這樣我就……」',
    after:'冷靜後一起回顧：發生了什麼、身體有什麼感覺、下次可以先做哪件事。'},
  sad:{first:'陪伴比解決更重要。可以靠近、抱一抱，不急著讓孩子「不哭」。',
    say:{young:'「你好難過，要不要抱抱？難過的時候哭一哭沒關係。」',
         mid:'「這件事讓你好失望，對不對？你很用心，所以才會這麼難過。」',
         old:'「這真的很讓人失望。想說說看嗎？不想說也沒關係，我就在旁邊。」'},
    avoid:'「這有什麼好哭的」「別難過了，又沒什麼」',
    after:'孩子平靜後問：「你需要我幫什麼忙？」讓孩子自己選。'},
  defiant:{first:'不服氣背後常是「很在乎、想做好」。先肯定這份在乎，再談輸贏。',
    say:{young:'「你好想贏，輸了好不甘心。想贏的心很棒喔！」',
         mid:'「你覺得不公平、不服氣，代表你很在乎。冷靜一下，我們再看看哪裡可以練習。」',
         old:'「不甘心代表你有企圖心。你想再挑戰一次，還是先分析看看差在哪裡？」'},
    avoid:'「你就是輸不起」「你看人家都……」（和別人比較）',
    after:'把「輸贏」轉成「進步」：跟昨天的自己比，找出一個進步的地方。'},
  stuck:{first:'這是「期待和能力的落差」：孩子以為自己應該會，結果做不到。先承認這個落差。',
    say:{young:'「好難喔，你已經試好多次了。我們先休息一下，等一下再一起試一小步。」',
         mid:'「你是『還沒』做到，不是做不到。我們把它切成小步驟，先做第一步就好。」',
         old:'「卡住真的很煩。你已經會哪些部分？卡在哪一步？要不要換個方法，或休息十分鐘再回來？」'},
    avoid:'「這麼簡單也不會」「算了我來就好」（直接幫孩子做完）',
    after:'稱讚過程：「你剛剛換了方法」「你願意再試一次」，比稱讚結果更有力量。'},
  scared:{first:'先讓孩子感覺安全：靠近、放慢語速、一起深呼吸。',
    say:{young:'「你有點怕怕的，我在這裡。我們一起吸一口氣，你很安全。」',
         mid:'「擔心是身體在保護你。我們想想：最可能發生什麼？如果真的發生了可以怎麼辦？」',
         old:'「緊張很正常，代表你在乎。先把擔心的事寫下來，再看看哪些是你能控制的。」'},
    avoid:'「這有什麼好怕的」「膽小鬼」',
    after:'用小步驟慢慢嘗試，事後一起回顧：「其實你做到了。」'},
  wronged:{first:'先完整聽孩子說完，不急著判斷誰對誰錯。',
    say:{young:'「你覺得好委屈，好像沒人懂你。我想聽你說。」',
         mid:'「你覺得被誤會了，好委屈。你慢慢說，我會聽完再說話。」',
         old:'「被誤會真的很不舒服。我想先聽聽你的版本。」'},
    avoid:'「你一定也有錯」「不要找藉口」',
    after:'如果是大人誤會了，願意說對不起，就是給孩子最好的示範。'}
};

Object.assign(PARENT,{
  reluctant:{first:'先承認「好捨不得」，再給可以預期的結束：倒數、最後一次、約好下次。分離時說再見要短而溫暖，不要偷偷溜走。',
    say:{young:'「你好捨不得，還想再玩。我們再玩最後一次，然後跟玩具說再見。」','mid':'「你還想玩，我懂。再五分鐘，計時器響了我們就收。你想先收哪一個？」',old:'「停下來真的很難。我們先約好下次什麼時候可以再玩，你覺得呢？」'},
    avoid:'「再不走我就自己走了」「哭什麼，又不是不回來」（威脅、偷偷離開）',
    after:'平常就用固定的說再見小儀式（抱一下、擊掌、說「下次見」），提前 5 分鐘提醒，孩子會越來越能接受轉換。'},
  jealous:{first:'嫉妒代表孩子很想要、很在乎。先接住感覺，不急著說「不可以嫉妒」。',
    say:{young:'「你也好想要那個，對不對？想要是可以的。」',mid:'「看到別人有，你心裡酸酸的。我們來想想你自己有什麼好的地方。」',old:'「羨慕別人很正常。你最想要的是什麼？有沒有可以自己努力的部分？」'},
    avoid:'「你看人家多好」「你怎麼這麼小氣」（比較、貼標籤）',
    after:'跟孩子一起列出「我的好」，也練習說「恭喜你」。'},
  shy:{first:'害羞是氣質，不是缺點。先給時間暖身，不要在別人面前催孩子。',
    say:{young:'「你有點害羞，沒關係。我們先揮揮手就好。」',mid:'「你想先在旁邊看一下，還是我陪你一起去說？」',old:'「緊張的時候可以先準備一句話，例如『嗨，我叫…』，我們練習一次。」'},
    avoid:'「快叫人啊」「你怎麼這麼膽小」（當眾催促、貼標籤）',
    after:'事後稱讚小小的勇敢：「你剛剛有揮手，好棒。」'},
  hyper:{first:'興奮過頭不是故意的，是身體油門踩太大。大人先放慢、放低聲音，幫孩子「踩煞車」。',
    say:{young:'「你好開心，身體跑好快！我們像蝸牛一樣慢慢走三步。」',mid:'「你現在像開到最快的車，我們一起踩煞車：紅燈停、深呼吸。」',old:'「你的能量很高，先去喝口水、做 10 下深呼吸，再回來繼續。」'},
    avoid:'「冷靜一點！」大聲吼、在很多人面前責罵',
    after:'平常練習「快、慢、停」的遊戲；在容易太嗨的活動前，先約好「降速信號」。'},
  embarrassed:{first:'先保護孩子的面子，私下說，不要在別人面前提。',
    say:{young:'「剛剛有點糗，沒關係，每個人都會這樣。」',mid:'「你覺得好丟臉，對不對？我小時候也發生過。」',old:'「尷尬的感覺很快就會過去，大家其實沒有記那麼久。想聊聊嗎？」'},
    avoid:'當眾笑孩子、轉述給別人聽、「這有什麼好丟臉的」',
    after:'分享大人自己出糗的故事，讓孩子知道出糗是正常的。'},
  guilty:{first:'內疚代表孩子知道在乎別人。重點放在「怎麼修復」，不要一直責備。',
    say:{young:'「你覺得自己做錯了，心裡不舒服。我們一起去說對不起。」',mid:'「做錯事會難過，代表你很善良。你想怎麼補救？」',old:'「每個人都會犯錯。重要的是接下來怎麼做，你覺得可以怎麼修復？」'},
    avoid:'「你看你做的好事」「你就是壞孩子」（翻舊帳、否定孩子本人）',
    after:'可以用工具裡的「修復任務」，完成後一起確認，讓孩子學會負責而不是一直自責。'},
  lonely:{first:'先陪著，讓孩子知道你在。孤單常常說不出來，可以用「我注意到…」開頭。',
    say:{young:'「你一個人有點孤單嗎？要不要一起玩？」',mid:'「我注意到你今天比較安靜，是不是覺得沒人陪？」',old:'「被冷落的感覺很難受。你想找誰聊聊，或是要我陪你一下？」'},
    avoid:'「你自己去找朋友啊」「這有什麼好難過的」',
    after:'一起想一個可以主動邀請的人，或安排固定的親子特別時光。'},
  stress:{first:'壓力大時，先幫孩子把事情「放下來」：寫下來、排順序，一次只看一件。',
    say:{young:'「事情好多，好累喔。我們先做一件就好。」',mid:'「我們把要做的事寫下來，先挑最小的一件開始。」',old:'「你最近壓力很大。哪些是一定要做的？哪些可以先放下或找人幫忙？」'},
    avoid:'「這有什麼好壓力的」「別人都做得到」',
    after:'留意睡眠、休息和玩的時間；壓力長期很大時，可以和老師或輔導老師聊聊。'}
});
const CO_STEPS=[
  ['先顧安全','移開危險物品，必要時帶到安靜角落。孩子要打人時，溫和而堅定地擋住：「我不會讓你打人。」'],
  ['話越少越好','只說短句。不講道理、不問為什麼、不威脅、不談條件。'],
  ['大人先穩住','蹲低、放低音量，自己跟著上面的圓圈慢慢呼吸。孩子會跟著大人的節奏慢慢平靜。'],
  ['降低刺激','關掉電視、請旁人先離開、燈光調暗。這時平板也可以先放下，只留大人陪著。'],
  ['給身體一個出口','喝冷水、用力抱枕頭、推牆壁、包毯子。要不要抱抱讓孩子決定。'],
  ['等高峰過去','不急著讓情緒停下來，陪著就好。孩子推開你時，就在附近安靜等。'],
  ['平靜後修復關係','先抱一下，說「剛剛好辛苦」。發生什麼事、下次怎麼做，等之後再談。']
];
const CO_LINES={
  young:['「我在這裡。」','「你很安全。」','「我們一起呼吸。」','「要抱抱的時候跟我說。」'],
  mid:['「我在這裡陪你。」','「你可以生氣，但我不會讓你打人。」','「等你準備好，我們再說。」','「要我抱你，還是坐在旁邊？」'],
  old:['「我在旁邊，需要我就說。」','「你想要我陪著，還是先自己靜一下？」','「等你好一點我們再談，不急。」','「我不會走開。」']
};
const OUTLETS=['喝冷水','用力抱枕頭','推牆壁','包毯子','緊緊抱住（孩子同意時）','在安全角落自己待一下','洗把臉'];
const CO_WORDS=['我在這裡，你很安全','圓圈變大，吸～','圓圈變小，呼～～','不用急，慢慢來','大人陪著你'];

/* ---------- state ---------- */
const S={step:0,age:null,emo:null,lv:0,lv2:0,act:null,cause:null,want:null,plan:null,tries:0};
let store={};
try{store=JSON.parse(localStorage.getItem('calmMonster')||'{}')}catch(e){store={}}
function save(){try{localStorage.setItem('calmMonster',JSON.stringify(store))}catch(e){}refreshHdr()}
store.xp=store.xp||{};store.pxp=store.pxp||0;store.grow=store.grow||{};store.repairs=store.repairs||[];store.log=store.log||[];store.moodLog=store.moodLog||[];store.pracLog=store.pracLog||[];store.vouchers=store.vouchers||[];store.week=store.week||{};store.playLog=store.playLog||[];store.gameDay=store.gameDay||{};store.wins=store.wins||[];store.tips=store.tips||{};store.owned=store.owned||[];store.equip=store.equip||{};store.stars=store.stars||0;store.pos=store.pos||{};if(store.limit===undefined)store.limit=20;if(store.nightAt===undefined)store.nightAt=20;
const LEVELS=[0,30,80,150,250,400];
const TITLES=['初次見面','認識你了','好朋友','好夥伴','默契搭檔','情緒小達人'];
function lvOf(xp){let l=0;LEVELS.forEach((t,i)=>{if(xp>=t)l=i});return l+1}
/* 成長階段（等級）：越來越成熟、溫和，不會變兇。Lv.1 小不點、Lv.2–3 小幫手、Lv.4–5 冷靜高手、Lv.6 情緒守護者 */
const STAGES=[{n:'小不點',from:1,s:.72},{n:'小幫手',from:2,s:.84},{n:'冷靜高手',from:4,s:.95},{n:'情緒守護者',from:6,s:1.06}];
function stageOf(lv){let i=0;STAGES.forEach((t,j)=>{if(lv>=t.from)i=j});return i+1}
/* 情緒大小（只在「多大」時用）：1 小小的 → 4 很大，越大越兇，冷靜後變回平復後 */
const SIZES=[{n:'小小的',s:.74},{n:'有一點',s:.86},{n:'中中的',s:.96},{n:'很大',s:1.06}];
const moodOf=n=>[1,1,2,3,4,4][n]||3;
const BADGE={angry:['🚦','紅綠燈徽章','生氣時會先停一下'],sad:['☂️','小雨傘','難過時會照顧自己'],defiant:['🏅','進步獎牌','跟昨天的自己比'],
  stuck:['🚩','一步一步旗','把難事切成小步驟'],scared:['🛡️','勇氣盾牌','先試一小步'],wronged:['💬','說話泡泡','說出自己的想法'],
  reluctant:['⏳','再見沙漏','好好說再見，下次再來'],jealous:['⭐','我的好星星','我也有我的好'],shy:['👋','招手手套','先打個招呼'],
  hyper:['🐌','蝸牛煞車','慢慢降速'],embarrassed:['😊','沒關係貼紙','每個人都會出糗'],guilty:['🩹','修復 OK 繃','說對不起，再去修復'],
  lonely:['🏮','小燈籠','主動找一個人'],stress:['📋','一件事清單','一次只做一件事']};
/* 已換成 3D 新圖、有 4 階段成長圖的怪獸（徽章已畫在圖裡，不再疊 emoji） */
const GROWN=new Set(['angry','sad','defiant','stuck','scared','wronged']);
/* 比較寬的圖（手拿旗子、張開手臂）：寬高比，讓身體高度跟其他階段一致 */
const ASPECT={stuck2:1.03,stuck4:1.11,stuck0:1.18,stuckg2:1.15,stuckg4:1.11};
const IMG=(k,st)=>`img/${k}${st}.webp`;
function nextOf(xp){const l=lvOf(xp);if(l>=LEVELS.length)return {pct:100,need:0};const a=LEVELS[l-1],b=LEVELS[l];return {pct:Math.round((xp-a)/(b-a)*100),need:b-xp}}
const HEROES={fox:{name:'小狐狸',c:'#F39A4B'},bear:{name:'小熊',c:'#B07A52'},rabbit:{name:'小兔子',c:'#E9DDF2'},cat:{name:'小貓',c:'#9AA3B5'}};
const PLV=[0,50,150,300,500,800,1200];
const PTITLES=['新手冒險家','情緒探險家','冷靜小勇士','情緒守護者','家園小主人','情緒魔法師','情緒大師'];
function lvIn(a,x){let l=0;a.forEach((t,i)=>{if(x>=t)l=i});return l+1}
function nextIn(a,x){const l=lvIn(a,x);if(l>=a.length)return {pct:100,need:0};return {pct:Math.round((x-a[l-1])/(a[l]-a[l-1])*100),need:a[l]-x}}
const SHOP_CATS=[['reward','兌換券'],['home','家園'],['hero','主角'],['monster','怪獸'],['bg','背景']];
const SHOP_HINT={reward:'換真的活動和特權！買了之後請大人兌現',home:'買了會放進家園，植物要每天照顧才會長大',hero:'幫主角換裝扮',monster:'所有怪獸會一起穿上',bg:'整個畫面的背景'};
const GOODS=['生氣時用說的，沒有動手','自己想到深呼吸','輸了也能說恭喜','做不到時請人幫忙','願意再試一次','主動道歉或修復','說出自己難過的感覺','等待、輪流很有耐心'];
const REPAIRS={young:['說對不起','一起收拾','畫一張道歉卡','抱抱對方'],mid:['說對不起','一起收拾乾淨','幫忙修好','做一件事來彌補'],old:['好好道歉並說明','收拾或修好','用做家事或零用錢補償','跟對方討論怎麼彌補']};
const MOODS=[['😊','開心',1],['😌','平靜',1],['😢','難過',0],['😠','生氣',0],['😟','擔心',0]];
const SHOP=[
  {id:'tree',cat:'home',name:'小樹',cost:40,ico:'🌳',plant:1},
  {id:'flowers',cat:'home',name:'花圃',cost:30,ico:'🌷',plant:1},
  {id:'tent',cat:'home',name:'帳篷',cost:60,ico:'⛺'},
  {id:'lamp',cat:'home',name:'路燈',cost:50,ico:'💡'},
  {id:'swing',cat:'home',name:'鞦韆',cost:80,ico:'🪢'},
  {id:'garden',cat:'home',name:'小菜園',cost:50,ico:'🥕'},
  {id:'pond',cat:'home',name:'小池塘（送一條魚）',cost:100,ico:'🐟'},
  {id:'house',cat:'home',name:'小房子',cost:150,ico:'🏠'},
  {id:'rainbowsky',cat:'home',name:'天空彩虹',cost:200,ico:'🌈'},
  {id:'straw',cat:'hero',slot:'hhead',name:'草帽',cost:40},
  {id:'pack',cat:'hero',slot:'hback',name:'小背包',cost:50},
  {id:'cape',cat:'hero',slot:'hback',name:'披風',cost:60},
  {id:'wizard',cat:'hero',slot:'hhead',name:'魔法帽',cost:100},
  {id:'party',cat:'monster',slot:'head',name:'派對帽',cost:30},
  {id:'flower',cat:'monster',slot:'head',name:'小花',cost:30},
  {id:'bow',cat:'monster',slot:'head',name:'蝴蝶結',cost:40},
  {id:'scarf',cat:'monster',slot:'neck',name:'圍巾',cost:50},
  {id:'bowtie',cat:'monster',slot:'neck',name:'領結',cost:50},
  {id:'sky',cat:'bg',slot:'bg',name:'藍天背景',cost:60,sw:'linear-gradient(#D7EEFF,#FFF8EE)'},
  {id:'rainbow',cat:'bg',slot:'bg',name:'彩虹背景',cost:90,sw:'linear-gradient(#FFE0E0,#FFF1CC,#E3F8DA,#DDEFFF,#F0E4FF)'},
  {id:'night',cat:'bg',slot:'bg',name:'星空背景',cost:120,sw:'radial-gradient(#fff 1.5px,transparent 2px) 0 0/16px 16px,linear-gradient(#CFC6F5,#EDE8FF)'},
  {id:'crown',cat:'monster',slot:'head',name:'皇冠',cost:150}
];
const ACC={
  party:`<path d="M46 16 L60 -16 L74 16 Z" fill="#FFD166" stroke="#fff" stroke-width="2"/><path d="M50 8 L70 8" stroke="#5B8DEF" stroke-width="3"/><circle cx="60" cy="-17" r="5" fill="#F26B5B"/>`,
  flower:`<g transform="translate(30 16)"><circle cx="0" cy="-8" r="6" fill="#FFB3D1"/><circle cx="8" cy="0" r="6" fill="#FFB3D1"/><circle cx="0" cy="8" r="6" fill="#FFB3D1"/><circle cx="-8" cy="0" r="6" fill="#FFB3D1"/><circle r="5" fill="#FFD166"/></g>`,
  bow:`<path d="M82 12 L68 2 L68 22 Z M82 12 L96 2 L96 22 Z" fill="#EC4F8F"/><circle cx="82" cy="12" r="4.5" fill="#C2185B"/>`,
  crown:`<path d="M40 16 L42 -8 L52 6 L60 -14 L68 6 L78 -8 L80 16 Z" fill="#FFC531" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="4" r="3.5" fill="#F26B5B"/><circle cx="47" cy="10" r="2.5" fill="#5B8DEF"/><circle cx="73" cy="10" r="2.5" fill="#5B8DEF"/>`,
  scarf:`<path d="M24 90 Q60 106 96 90 L98 101 Q60 118 22 101 Z" fill="#2F8F83"/><path d="M76 102 L80 124 L91 121 L87 100 Z" fill="#26766C"/>`,
  bowtie:`<path d="M60 101 L45 92 L45 110 Z M60 101 L75 92 L75 110 Z" fill="#3B2F2A"/><circle cx="60" cy="101" r="4" fill="#F26B5B"/>`
};
function refreshHdr(){const el=document.getElementById('hdrStars');if(el)el.textContent=store.stars||0;
  document.body.classList.remove('bg-sky','bg-rainbow','bg-night');if(store.equip&&store.equip.bg)document.body.classList.add('bg-'+store.equip.bg)}
if(store.age)S.age=store.age;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

