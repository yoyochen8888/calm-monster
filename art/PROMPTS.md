# 情緒怪獸冷靜站：生圖提示詞與素材紀錄

這份檔案記錄所有角色圖是怎麼做出來的，方便之後補圖、改圖，也當作人類創作過程的紀錄。

## 製作方式
- 角色設定、名稱、情緒與成長的設計：由專案作者構思
- 圖片：專案作者用 Google Gemini 依下面的提示詞生成，挑選、要求修改後定稿
- 切圖、去背、放進工具：Claude 協助處理
- 原始圖檔：`art/source/`；工具使用的圖：`img/`

## 共用風格（每段提示詞前面都可以加）
```
Style: 3D animated children's TV look, soft matte clay-like texture, smooth rounded shapes, no harsh lines, warm soft ambient lighting, pastel color palette, cozy and gentle mood.
```
規則：
- 不寫品牌名稱（Disney、Pixar 等），不模仿現有作品的角色
- 除了家園背景，一律：plain light cream background, full body, front view, spaced apart, no text
- 圖上不要文字（AI 寫中文字容易變亂碼），需要符號時用圖案（例如腳印）

## 參考圖怎麼給
- 新對話：上傳「主角群 3D 圖」（風格）＋「情緒怪獸水彩版」（形狀顏色），開頭加：
```
Image 1 is the style reference: match its 3D clay look, lighting and proportions. Image 2 is the character reference: keep the [monster]'s shape and color. Do not copy the animals from image 1.
```
- 同一個對話裡接著畫下一隻：不用再上傳，用文字說是哪一隻
- 不要給「成長進化水彩版」（越大越兇，會帶偏）
- 存圖：長按「儲存影像」或下載鍵，不要截圖

## 每隻怪獸 3 張
### 1. 情緒大小（4 隻，給「多大」用）
```
Now do the [外型] from the original reference, same 3D clay style. Show 4 emotion sizes in a row: [程度1], [程度2], [程度3], [程度4]. Still cute and child-friendly, not scary. Full body, front view, spaced apart, plain light cream background, no text.
```
### 2. 冷靜下來（1 隻）
```
Same [外型]. Calmed down: [冷靜姿勢]. Full body, front view, plain light cream background, no text.
```
### 3. 成長成熟（4 隻，給等級用，都要溫和）
```
Same [外型]. 4 growth stages in a row, all calm and kind, never [情緒]: baby (tiny, hugging knees), child (standing, curious smile), teen (taller, confident smile, [徽章] on chest), adult (tallest, warm gentle smile, holding [道具]). Growing more mature, not scarier. Full body, front view, spaced apart, plain light cream background, no text.
```

## 各怪獸填空
| 怪獸 | 外型 | 情緒大小 1→4 | 冷靜姿勢 | 徽章 → 道具 | 狀態 |
|---|---|---|---|---|---|
| 生氣 angry | red fluffy flame-topped monster | 抱胸嘟嘴 → 咬牙 → 握拳大吼 → 舉手大吼 | eyes closed, peaceful smile, hands on belly | traffic-light badge → small traffic-light sign | ✅ 完成 |
| 難過 sad | blue water-drop monster | pouting → teary → crying → crying a lot with a puddle | hugging a small heart | small umbrella badge → small umbrella | ✅ 完成 |
| 不服氣 defiant | orange spiky sun-like monster | grumpy side-eye → arms crossed → stomping, puffed cheeks → arms crossed tightly with steam | arms relaxed, accepting smile, thumbs up | small gold medal badge → holding up a gold medal | ✅ 完成 |
| 做不到 stuck | purple tangled-yarn monster | small frown → dizzy swirl eyes → holding head → slumped, wants to give up | yarn neat, arms raised "I can do it" | small flag badge → flag with footprint steps | ✅ 完成 |
| 擔心 scared | green fuzzy monster | a little nervous → worried biting nails → shaking, covering face → very scared hiding | relaxed shoulders, soft smile, one hand on chest breathing | small shield badge → small shield | ✅ 完成 |
| 委屈 wronged | pink round fluffy monster | lips pressed, teary eyes → holding back tears → tears falling → hugging knees crying | soft smile, holding a heart speech bubble | speech-bubble badge → heart speech bubble | ✅ 完成 |
| 捨不得 reluctant（3–5 歲起） | honey-yellow soft gooey monster with sticky little hands | holding onto a toy, pouting → clinging tightly, teary → stretched out not wanting to let go → crying and stuck to the floor | waving goodbye with a gentle smile, small hourglass beside it | small hourglass badge → holding a small hourglass | 待做 |
| 嫉妒 jealous（6–8 歲起） | yellow-green small hedgehog-like monster with soft spikes | side-eye glance → arms crossed, sulking → spikes puffed up, grumpy → stomping, turning away | proud gentle smile, hand on its own chest | small star badge → holding a shining star | 待做 |
| 害羞 shy（6–8 歲起） | peach-colored round monster that can tuck into itself | small blush, looking down → hiding half its face → peeking from behind its hands → curled up into a ball | small brave smile, waving one hand hello | waving-hand badge → wearing a soft waving mitten | 待做 |
| 興奮過頭 hyper（6–8 歲起） | sky-blue bouncy springy monster | very happy, bouncing → jumping with arms flailing → spinning fast with motion lines → bouncing wildly, a bit dizzy | slow calm smile, sitting with a little snail friend | snail badge → holding a little snail | 待做 |
| 尷尬 embarrassed（9–12 歲） | plum-pink cloud-shaped monster | small blush, awkward smile → red cheeks, covering mouth → very red, hiding face → wanting to disappear, half fading | relaxed smile, laughing it off | smiley sticker badge → holding a smiley sticker | 待做 |
| 內疚 guilty（9–12 歲） | grey-blue small round stone-like monster | looking down → heavy shoulders, sad eyes → sitting with head down → curled up, heavy and droopy | holding a bandage, kind relieved smile | bandage badge → holding a big bandage | 待做 |
| 孤單 lonely（9–12 歲） | indigo blue little lantern-shaped monster with a soft glow | sitting alone, small frown → hugging knees → dim glow, looking far away → very dim, curled up alone | glowing warmly, waving to a friend | lantern badge → holding a glowing lantern | 待做 |
| 壓力 stress（9–12 歲） | brown monster shaped like an overstuffed little backpack | a bit tense → sweating, too many things → squished, papers flying → overwhelmed, about to burst | relaxed, backpack set down, stretching | checklist badge → holding a short checklist | 待做 |

## 家園（v12 起）
家園已經有：冷靜角落（Lv.4 解鎖）、晚上睡覺模式、自由拖拉布置。目前是簡單圖形，等下面的圖畫好再換。
同一個 Gemini 對話裡畫，開頭都可以加：`Same 3D clay style as the characters.`

### 1. 白天背景（不放家具）
```
Wide cozy garden landscape for a children's game, soft green grassy hills with a gentle flat open area in the front half for placing items, a soft blue sky with a soft sun and fluffy clouds, a few tiny distant trees on the far hills. No characters, no buildings, no furniture, no path. 3D clay style, warm soft lighting, pastel colors. Landscape 16:9, no text.
```
### 2. 晚上背景（同一個構圖）
```
The exact same garden landscape at night: deep calm blue sky, a soft crescent moon, gentle stars, hills in cool moonlight, peaceful and sleepy mood. Same composition. No characters, no buildings, no text.
```
### 3. 家具物品表
```
Game item sheet in the same 3D clay style, each item separate and evenly spaced in rows, all front view and the same lighting: a small cozy cottage, a round tree with red apples, a flower bed, a small round pond, a wooden vegetable garden plot (empty soil), a small tent, a street lamp, a wooden swing, a small slide. Plain light cream background, no text.
```
### 4. 冷靜角落（6 個）
```
Game item sheet in the same 3D clay style, 6 small cozy garden spots, separate and evenly spaced: a short stepping path with a tiny traffic light, a small round gazebo with an umbrella roof, a small three-step winner podium, a curvy path of stepping stones shaped like footprints, a small treehouse with a shield sign, a cute mailbox with a heart speech bubble. Plain light cream background, no text.
```
### 5. 菜和魚
```
Game item sheet in the same 3D clay style, separate and evenly spaced: row 1 a seedling growing in 3 stages (sprout, small plant, big leafy plant); row 2 a carrot, a tomato, an ear of corn; row 3 three small cute fish in orange, pink and yellow. Plain light cream background, no text.
```
### 6. 主角
主角群已完成（`art/source/01-主角群-3D.jpg`），家園換新圖時一起換上。

## 去哪裡找更多提示詞
- 直接請 Claude 或 Gemini 依這份風格寫新的提示詞最穩
- 也可以參考 Gemini 內建的範例、或搜尋「3D clay character prompt」，看到喜歡的再改成自己的角色
- 找到的提示詞記得拿掉品牌或作品名稱，只留風格描述

## 家園物件（v18 起是程式畫的黏土風，可以逐一換成生成圖）
目前家園的樹、花圃、帳篷、路燈、鞦韆、菜園、池塘、小房子是用程式畫的（`js/art.js`）。想換成生成圖時，一次換一樣就好，其他的會照舊。

步驟：
1. 用上面的「共用風格」生圖，背景要透明，或是淺色、方便去背
2. 存成 `img/home_名字.webp`（例如 `img/home_tree.webp`）
3. 打開 `js/art.js`，在最上面的 `ART` 裡加一行：`tree:'img/home_tree.webp',`
4. 大小、位置不對，就改成 `tree:{src:'img/home_tree.webp',scale:1.1,dx:0,dy:-4},`

| 名字 | 東西 | 建議比例（寬:高） | 提示詞重點 |
|---|---|---|---|
| tree | 小樹 | 4:5 | small round cartoon tree, soft green leaves, short brown trunk |
| flowers | 花圃 | 3:1 | a short row of small pastel flowers on stems |
| tent | 帳篷 | 5:4 | small cozy mustard-yellow camping tent with a tiny pink flag |
| lamp | 路燈 | 1:2 | short garden lamp post with a warm glowing round bulb |
| swing | 鞦韆 | 1:1 | small wooden swing set with a pastel pink seat |
| garden | 菜園 | 5:2 | small wooden raised garden bed with dark soil, empty（蔬菜會由程式畫上去） |
| pond | 池塘 | 5:2 | small oval pond seen from the front, light blue water, round pebbles around the edge, empty（魚會由程式畫上去） |
| house | 小房子 | 1:1 | small cozy cottage, cream walls, coral-pink roof, round-top door, two small windows |

小提醒：會動的東西（魚、水波、菜長大、葉子搖）建議繼續由程式畫，生成圖只換「不會動的底」，例如池塘、菜園的木框。
