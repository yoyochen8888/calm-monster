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
