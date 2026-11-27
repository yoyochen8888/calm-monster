準備發布新版本 $ARGUMENTS（例如 v61）。依序做：

1. 把 `sw.js` 的 `VERSION` 和 `js/backup.js` 的 `APP_VER` 都改成 $ARGUMENTS，確認兩個一樣。
2. 用 `git diff --name-only origin/main` 和 `git status` 找出這版新增的檔案，確認每個都在 `sw.js` 的 `FILES` 裡、js／css 也在 `index.html` 裡且順序正確（見 CLAUDE.md）。
3. 跑 /text-check。
4. 起 `python3 -m http.server`，用 Playwright 在 iPad 820×1180、iPhone 390×844、iPhone SE 375×667 截這版改到的畫面，並確認 console 沒有錯誤。
5. commit、push 分支，用 REST 開 PR，PR 內容寫：這版做了什麼（白話）、動到的檔案、怎麼退回、截圖。
6. 回報 PR 連結和截圖給使用者。
