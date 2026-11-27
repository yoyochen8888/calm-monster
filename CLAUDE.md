# 情緒怪獸家園（calm-monster）— 給 Claude Code 的工作說明

給 3–12 歲孩子和陪伴大人用的情緒學習小工具。純前端（HTML／CSS／JS，沒有建置工具），GitHub Pages 發布：https://yoyochen8888.github.io/calm-monster/
使用者主要用 iPad，也用 iPhone。使用者說中文（繁體），回覆、註解、介面文字都用繁體中文。

## 每次改版一定要做
1. 版本號**三處一起改**：`sw.js` 的 `VERSION`、`js/backup.js` 的 `APP_VER`（兩個要一樣，例如 `v61`）。
2. 新增的檔案（js、css、圖）加進 `sw.js` 的 `FILES`，不然離線快取拿不到。
3. 新 js／css 加進 `index.html`，**放在正確的載入順序**（見下）。
4. 開分支 → 開 PR → 附前後截圖。不要直接推 main。
5. 開 PR、合併都用 REST（`gh pr create` 的 GraphQL 不能用）：
   - 開：`gh api repos/yoyochen8888/calm-monster/pulls -f title=... -f head=分支 -f base=main -f body=...`
   - 合併：`gh api -X PUT repos/yoyochen8888/calm-monster/pulls/N/merge`
   - 使用者已同意由 Claude 直接合併，合併後把成果給使用者看。
6. 一版只做一件事（使用者偏好一版一版做）。

## 載入順序（v67）
程式：data → family → art → icons → core → calm-flow → home → records → games → corners → corners2 → parent → ambient → intro → wish → review → joy → clues → adult2 → emo4 → emo8 → emo12 → emo14 → flow2 → co2 → flow3 → games2 → icons2 → learn2 → yard → season → print → backup → main
樣式：tokens → style → clay → corners2 → games2 → adult2 → flow2 → co2 → flow3 → learn2 → season → print → phone（phone 永遠最後）

- 後面的檔案用「覆蓋或包住前面的函式」的方式加功能（例如 `const _old=renderX; renderX=function(){...}`）。新功能優先開新檔，不大改舊檔，方便單獨拿掉。
- learn2 用到 icons2 的 `GAME_ICO`，要放在 icons2 後面。
- emo4 要在 adult2 後面，emo8 在 emo4 後面，emo12 在 emo8 後面，emo14 在 emo12 後面。

## 檔案地圖（重點）
- `js/data.js` 資料與存檔（localStorage `calmMonster`）；`js/family.js` 怪獸家族、方法、給大人卡片
- `js/calm-flow.js` 冷靜流程；`js/flow2.js`、`js/flow3.js` 新方法（推牆、噴火龍、蝸牛、烏龜法）
- `js/adult2.js` 大人話術 `LVSAY`、`renderParent()`；`js/emo4.js` 捨不得／委屈／嫉妒／擔心、`js/emo8.js` 害羞／孤單／做不到／壓力、`js/emo12.js` 內疚／尷尬／不服氣／興奮過頭、`js/emo14.js` 生氣／難過（含 `FAM.hot.plans` 說法）的特有應對（`tell`、`pro`）
- `js/clues.js` 三條線索、詞彙、工具箱、猜猜是誰、三小步
- `js/co2.js` 陪伴模式；`js/learn2.js` 學習區、求助；`js/print.js` 列印測試包
- `js/yard.js` 2.5D 院子與主角；`js/season.js` 四季；`js/corners.js`、`js/corners2.js` 小角落；`pond/` 全螢幕軟陶魚池
- `js/icons.js`、`js/icons2.js` 自己畫的黏土圖示（`CICO`、`clayIcon()`）

## 設計原則（改文字和畫面前先對照）
- **鼓勵用描述的，不用評價的**：工具自己不說「好棒、好乖、好聰明、了不起、好厲害、好孩子、好專心、好認真、很善良」。這些字只能出現在「盡量避免」的說明裡。
- 不貼標籤、不叫停或貶低情緒、不威脅、不隔離、不承諾效果；腦科學只當比喻。
- 時間要具體（「點心後」「等我忙完這件事」），不說模糊的「等一下」。
- 認出情緒一律說「可能會」，不說「一定會」。
- App 裡不寫研究或課程名稱；不用四色區、不用現成 SEL 課程的名稱、配色、角色。
- **不新增怪獸**：新情緒詞用「也可以這樣說」「從小到大」帶。
- 年齡分層：3–5 歲流程最短，新步驟和詞彙先只給 6 歲以上。
- 情緒當下畫面越少越好，一個畫面一個主要動作；孩子層大圖短句自動唸，大人層 👀 收合。
- 兩種動態：平常畫面和小遊戲可以 Q 彈；**冷靜流程不彈、不閃**。
- 不黏著：沒有連續天數、不會枯萎、晚上休息、每日星星上限；小生命只是偶遇、不能收集；家園不放直接跳進練習的按鈕。
- 外觀：動森式療癒、圓潤、有厚度的黏土感。色彩：奶油底 #FDFBF7、卡片 #FFFCF4、字 #5C4A3D、提示字 #756353；薄荷 #A8DCC5、鵝黃 #FBE3A0、珊瑚 #F8B9AE；不用純黑純白。不用品牌、不模仿現有角色。

## 樣式基準（v67 起）
- `css/tokens.css` 是全站設計基準（顏色、怪獸色、圓角 4 階、字級 6 階、間距、黏土光影、動態曲線），最先載入
- **新的樣式一律用 `var(--t-…)`／`var(--m-…)`，不要新增寫死的色碼、圓角、字級**；改舊樣式時順手換成變數
- 預覽：`docs/style-sample.html`（線上 /docs/style-sample.html）
- 角色圖：照 `docs/角色規格.md`；新圖用 `tools/tone.py` 調到同一個色調
- 一版一區把舊樣式換成 tokens（冷靜流程 → 大人區 → 小遊戲 → 家園），畫面要一樣或更整齊，功能不變
- 用 `/style-check` 檢查

## 測試
- `python3 -m http.server` ＋ Playwright（Chromium）。尺寸：iPad 820×1180、iPhone 390×844、iPhone SE 375×667；版面改動加測 360×740。
- 晚上測試先設 `S.forceNight=false`。
- 整頁截圖（full_page）會把固定導覽列疊在中間，用一般截圖＋捲動。
- 測試環境載不到網路字型（粉圓體），字型看起來不同是正常的。
- 🆘 的「開始」在 390×844 第一個畫面要看得到。

## 生圖素材
使用者用 Gemini／Gemini Spark 生圖，Claude 負責去背、裁切、轉 webp、放進 `img/`。背景一律綠 #00FF00（綠色物件用洋紅 #FF00FF）、沒有影子；角色圖上方偶爾有模糊殘影頭，去背時丟掉。

## 詳細紀錄
版本紀錄與每版改了什麼在 claude.ai Project「03-1 情緒怪獸」的〈情緒怪獸冷靜站-專案說明〉與〈情緒怪獸-Notion資料優化規劃〉。
