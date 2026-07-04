# 校園綠夥伴：環境復甦任務

這是依照 `校園綠夥伴_SPEC.md`、`校園綠夥伴_SDD.md` 與 v2「淨芽小隊」修正版文件製作的教學示範作品。

學生端遊戲層名稱：

```text
淨芽小隊：校園健康冒險
```

## 已建立檔案

- `index.html`：網頁入口
- `styles.css`：畫面樣式
- `app.js`：學生端、教師端、任務、計分、徽章、地圖與守護報告邏輯
- `apps-script/Code.gs`：Google Apps Script 後端與 Google Sheets 初始化程式
- `assets/spirits/`：六位淨芽精靈透明角色圖
- `assets/ui/`：任務循環、校園地圖、小隊基地與 AI 小隊長視覺素材

## 本機試跑

直接用瀏覽器開啟 `index.html` 即可試用。未連接 Google Sheets 時，資料會先存在同一台裝置的瀏覽器中。

預設教師管理碼：

```text
1234
```

## 學生端功能

- 建立小隊
- 找回小隊
- 選擇六位淨芽精靈中的隊長
- 查看任務地圖與解鎖節點
- 提交小隊集結、健康探索、分類挑戰與守護發表回報
- 輸入步數、路線、垃圾辨識、分類結果與分類理由
- 自動計算五種精靈能量
- 自動解鎖徽章
- 查看小隊基地與精靈狀態
- 建立與更新淨芽小隊守護報告

## 教師端功能

- 查看小隊總數、回報數、守護報告數
- 查看小隊列表
- 查看任務回報
- 查看熱點、步數、垃圾類型與分類結果統計
- 查看守護報告
- 複製 AI 分析 prompt
- 設定目前開放週次與教師管理碼

## 接 Google Sheets

1. 建立一份 Google 試算表。
2. 在試算表中開啟 Apps Script。
3. 將 `apps-script/Code.gs` 的內容貼入 Apps Script 編輯器。
4. 執行或由 Web App 第一次請求觸發 `initializeSheets()`，授權後會建立必要工作表、補齊 v2 欄位與預設資料。
5. 部署為 Web App，權限需允許前端寫入指定試算表。
6. 將部署網址填入 `index.html` 的 `window.GREEN_PARTNER_API_URL`。

```js
window.GREEN_PARTNER_API_URL = "你的 Google Apps Script Web App 網址";
```

目前 GitHub Pages 版本使用 `index.html` 內的公開 Web App URL。教師端操作仍需教師管理碼；示範版預設為 `1234`，正式上課前可在教師端設定頁修改。

## 備註

本版不使用學生個人帳號、不使用 GPS、不串接真實步數 API、不做即時 AI 圖像辨識、不做防作弊或排行榜。教師端的 AI 功能採手動複製資料到 ChatGPT 的流程。
