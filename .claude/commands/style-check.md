檢查樣式有沒有照 CLAUDE.md 的「樣式基準」。

1. 統計 css/ 和 js/ 裡寫死的色碼、border-radius、font-size 種類數，跟上次比較（v67 起點：色碼 162、圓角 38、字級 67、JS 內 style="" 173 處）。
2. 列出這一版新增或修改的樣式裡，沒有用 `var(--t-…)`／`var(--m-…)` 的地方。
3. 對照 docs/角色規格.md，檢查這一版新加的角色圖（尺寸、頂滿高度、ASPECT、用 tools/tone.py --dry 看亮度和對比）。
4. 用 Playwright 在 iPhone 390×844、iPad 820×1180 截改到的畫面，確認冷靜流程沒有 Q 彈或閃爍。
5. 列出問題和建議，等使用者同意再改。
