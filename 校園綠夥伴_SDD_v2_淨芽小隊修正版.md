# SDD v2｜《校園綠夥伴：環境復甦任務》淨芽小隊修正版系統設計文件

> 版本：v2.0  
> 修正方式：在現有程式基礎上增量修改，不重建專案。  
> 對應文件：`校園綠夥伴_SPEC_v2_淨芽小隊修正版.md`  
> 目標：將現有《校園綠夥伴：環境復甦任務》MVP 升級為更接近使用者提供玩法圖的「淨芽小隊：校園健康冒險」遊戲層。

---

## 0. 本次 SDD 修正總則

### 0.1 核心原則

本次不是砍掉重練，而是基於現有程式進行功能擴充與遊戲化強化。

需保留：

1. 既有專案名稱：`校園綠夥伴：環境復甦任務`
2. 既有四週任務邏輯
3. 既有學生端路由與主要頁面
4. 既有教師端路由與主要頁面
5. 既有 Google Sheets / Google Apps Script 後端架構
6. 既有能力值欄位：`stamina`、`scout`、`cleanse`、`wisdom`、`influence`
7. 既有成果卡、任務回報、熱點分析等資料邏輯

本次新增或強化：

1. 學生端遊戲名稱層：`淨芽小隊：校園健康冒險`
2. 六位淨芽精靈角色
3. 步數／探索能量欄位
4. 垃圾辨識與分類任務欄位
5. 校園地圖解鎖感
6. 今日任務卡畫面
7. AI 小隊長提示語與 prompt 生成
8. 成果卡升級為《淨芽小隊守護報告》

### 0.2 開發限制

第一版修正不做以下項目：

1. 不重建整個前端專案
2. 不重做 Google Sheets 資料庫結構
3. 不導入個人帳號登入
4. 不串接 GPS 定位
5. 不串接 iPad 真實健康步數 API
6. 不串接即時 AI 圖像辨識 API
7. 不做複雜動畫或即時多人連線
8. 不移除原本教師端功能

---

## 1. 系統概述

### 1.1 修正後系統定位

本系統為一款支援國小高年級四週校園環境行動課程的網頁式任務遊戲。

原系統主軸為：

> 校園環境觀察、任務回報、綠夥伴養成、成果卡產生。

修正後主軸升級為：

> 接受任務、走出教室、累積步數或探索能量、發現垃圾、拍照紀錄、辨識分類、累積淨芽精靈能量、解鎖地圖、完成守護報告。

### 1.2 系統名稱層次

| 層次 | 名稱 | 用途 |
|---|---|---|
| 正式課程／系統名稱 | 校園綠夥伴：環境復甦任務 | 教案、行政說明、專案主標 |
| 學生端遊戲名稱 | 淨芽小隊：校園健康冒險 | 學生畫面、任務卡、遊戲敘事 |
| 最終成果名稱 | 淨芽小隊守護報告 | 成果卡、展示、發表 |

---

## 2. 技術架構

### 2.1 建議技術棧

| 層級 | 技術 | v2 修正說明 |
|---|---|---|
| 前端 | HTML、CSS、JavaScript | 沿用現有檔案，增量修改 UI、資料結構與文案 |
| 後端 | Google Apps Script Web App | 沿用現有 API Router 與 Service 設計 |
| 資料庫 | Google Sheets | 只新增欄位與設定，不重建舊資料 |
| 部署 | GitHub Pages + GAS API | 沿用現有部署方式 |
| AI 分析 | 手動 prompt 流程 | 第一版不串 API，新增 AI 小隊長 prompt 與提示語 |
| 圖像素材 | 本機 assets 正式角色圖 | 六位角色必須使用提供角色圖裁切、去背後的正式透明 PNG，不以 placeholder、文字、emoji 或假 SVG 替代 |

### 2.2 系統架構圖

```text
學生 iPad / 教師電腦
        ↓
GitHub Pages 前端網頁
        ↓
JavaScript App State / Router
        ↓
Google Apps Script Web App API
        ↓
Google Sheets
        ↓
教師端儀表板 / 統計分析 / AI 小隊長 Prompt
```

### 2.3 修正後資料流

```text
小隊建立
  ↓
選擇隊長精靈
  ↓
查看今日任務卡 / 地圖節點
  ↓
走校園與任務行動
  ↓
提交任務回報：地點、步數、垃圾類型、分類、原因、改善想法
  ↓
後端計算能力值與解鎖狀態
  ↓
前端顯示淨芽小隊基地、精靈能量、徽章、地圖進度
  ↓
第 4 週產生《淨芽小隊守護報告》
```

---

## 3. 系統模組設計

### 3.1 前端模組

| 模組 | 原功能 | v2 修正後功能 |
|---|---|---|
| App Router | 控制頁面切換 | 保留原路由，更新頁面文案與遊戲層命名 |
| Team Module | 建立小隊 | 建立「淨芽小隊」，新增隊長精靈選擇顯示 |
| Pet Module | 綠夥伴選擇 | 改為「淨芽精靈」角色資料，保留原 selectedPetId |
| Mission Module | 四週任務地圖 | 強化為「校園地圖節點＋今日任務卡」 |
| Submission Module | 任務回報表單 | 新增步數、路線、分類結果、分類理由等欄位 |
| Score Module | 顯示能力值 | 顯示為健康、探索、淨化、智慧、守護能量 |
| Badge Module | 徽章解鎖 | 保留原邏輯，更新徽章名稱與條件文案 |
| Spirit Base Module | 無 | 新增：小隊基地，顯示六位淨芽精靈狀態 |
| AI Captain Module | 無或教師端 prompt | 新增：AI 小隊長提示語、任務引導與 prompt 產生器 |
| Result Card Module | 成果卡 | 改為《淨芽小隊守護報告》 |
| Teacher Dashboard Module | 統計與管理 | 新增步數統計、分類統計、任務節點統計 |

### 3.2 後端模組

| 模組 | 原功能 | v2 修正後功能 |
|---|---|---|
| API Router | 接收 GET / POST | 新增 v2 actions，保留舊 action |
| Team Service | 建立與查詢小隊 | 支援隊長精靈、已解鎖精靈欄位 |
| Submission Service | 儲存任務回報 | 支援步數、路線、分類、照片說明等新欄位 |
| Score Service | 計算能力值 | 新增步數、分類正確性、地圖節點的加分來源 |
| Mission Service | 任務週次與狀態 | 新增任務卡、地圖節點、解鎖條件 |
| Map Service | 無 | 新增：校園地圖節點與區域解鎖狀態 |
| Spirit Service | 原 Pet Service | 管理六位淨芽精靈與隊長精靈 |
| Stats Service | 熱點與垃圾類型統計 | 新增步數、分類、路線、能量統計 |
| Result Service | 成果卡 | 產生守護報告資料 |
| AICaptain Service | prompt 產生 | 產生任務提示、分類提醒、成果摘要 prompt |
| Settings Service | 基本設定 | 新增 gameMode、currentMapLevel、stepTarget 等設定 |

---

## 4. 前端頁面與路由設計

### 4.1 路由保留原則

為避免大幅改寫前端，原本路由盡量保留，只修改頁面標題、畫面內容與資料呈現。

| 原路由 | 原頁面 | v2 頁面名稱 | 修正重點 |
|---|---|---|---|
| `/` | 遊戲首頁 | 淨芽小隊首頁 | 加入遊戲循環、AI 小隊長開場、淨芽小隊視覺 |
| `/team` | 小隊建立頁 | 淨芽小隊建立頁 | 新增隊長精靈選擇或導向 `/pet` |
| `/pet` | 綠夥伴選擇頁 | 淨芽精靈選擇頁 | 改為六位淨芽精靈 |
| `/map` | 任務地圖頁 | 校園探索地圖 | 顯示四週任務節點、解鎖狀態、今日任務卡 |
| `/mission/:week` | 任務回報頁 | 校園任務回報頁 | 新增步數、路線、辨識分類欄位 |
| `/growth` | 綠夥伴成長頁 | 小隊基地與能量頁 | 顯示六位精靈、能量條、徽章 |
| `/result` | 成果卡頁 | 淨芽小隊守護報告 | 顯示探索、分類、提案與宣導成果 |
| `/teacher` | 教師端首頁 | 教師儀表板 | 加入步數與分類統計 |
| `/teacher/stats` | 熱點分析 | 熱點與分類分析 | 新增分類正確性、路線、步數統計 |
| `/teacher/results` | 成果卡管理 | 守護報告管理 | 顯示守護報告與 AI 摘要 |

### 4.2 新增或強化頁面：小隊基地

若原 `/growth` 已存在，建議直接強化為「小隊基地」。

小隊基地需顯示：

1. 小隊名稱
2. 隊長精靈
3. 六位淨芽精靈卡片
4. 五種能量條
5. 小隊等級
6. 已獲得徽章
7. 地圖解鎖進度
8. AI 小隊長回饋語

### 4.3 任務卡 UI

任務卡需在首頁、地圖頁或任務回報頁顯示。

任務卡欄位：

| 欄位 | 說明 |
|---|---|
| taskTitle | 任務名稱 |
| taskStory | 任務劇情 |
| routeName | 建議探索路線 |
| stepTarget | 目標步數 |
| targetArea | 目標區域 |
| requiredActions | 需完成動作，例如觀察、拍照、分類、提案 |
| rewardText | 完成獎勵文字 |
| aiCaptainHint | AI 小隊長提示 |

---

## 5. 資料表設計修正

### 5.1 資料庫修正策略

1. 不刪除原欄位。
2. 新欄位一律加在原工作表最後方。
3. 原本 `Pets` 工作表可延續使用，但資料內容改為淨芽精靈。
4. 原本 `Teams.selectedPetId` 保留，意義改為 `leaderSpiritId`。
5. 若程式中不方便改欄位名稱，前端顯示可用新名稱，後端仍用舊欄位。

---

### 5.2 `Settings` 工作表新增設定

| key | value 範例 | 說明 |
|---|---|---|
| gameDisplayName | 淨芽小隊：校園健康冒險 | 學生端遊戲名稱 |
| formalProjectName | 校園綠夥伴：環境復甦任務 | 正式課程名稱 |
| defaultStepTarget | 800 | 預設任務步數 |
| mapUnlockMode | week | 地圖解鎖模式：week / mission |
| aiCaptainName | 紫寶隊長 | AI 小隊長預設名稱 |
| enableManualSteps | true | 是否允許手動輸入步數 |
| enableClassificationChallenge | true | 是否啟用分類挑戰欄位 |

---

### 5.3 `Pets` 工作表修正為 `Spirits` 概念

可保留工作表名稱 `Pets`，但內容改為淨芽精靈。

| 欄位 | 說明 | v2 說明 |
|---|---|---|
| petId | 角色 ID | 建議命名為 spiritId，但可沿用 petId |
| petName | 角色名稱 | 綠芽、水滴、陽光、紫寶、心心、阿栗 |
| description | 角色描述 | 精靈個性與任務定位 |
| trait | 角色特色 | 環境、活力、運動、智慧、情緒、回收 |
| imageStage1 | 圖片 | 正式裁切去背角色圖片路徑 |
| imageStage2 | 圖片 | v2.0 可與 Stage1 相同，仍需使用正式角色圖片 |
| imageStage3 | 圖片 | v2.0 可與 Stage1 相同，仍需使用正式角色圖片 |
| imageStage4 | 圖片 | v2.0 可與 Stage1 相同，仍需使用正式角色圖片 |
| active | 是否啟用 | 保留 |
| spiritRole | 新增 | 環境守衛、活力守衛等 |
| primaryEnergy | 新增 | stamina / scout / cleanse / wisdom / influence |
| colorTheme | 新增 | green / blue / yellow / purple / pink / brown |
| icon | 新增 | emoji 或 icon 名稱 |

#### 預設六位角色資料

| petId | petName | spiritRole | trait | primaryEnergy | colorTheme | icon | imageStage1 |
|---|---|---|---|---|---|---|---|
| spirit_green | 綠芽 | 環境守衛 | 發現垃圾、綠化校園 | scout | green | 🌱 | assets/spirits/green.png |
| spirit_water | 水滴 | 活力守衛 | 補充能量、健康提醒 | stamina | blue | 💧 | assets/spirits/water.png |
| spirit_sun | 陽光 | 運動守衛 | 鼓勵走動、累積步數 | stamina | yellow | ☀️ | assets/spirits/sun.png |
| spirit_purple | 紫寶 | 智慧守衛 | AI 分析、路線建議 | wisdom | purple | 🔮 | assets/spirits/purple.png |
| spirit_heart | 心心 | 情緒守衛 | 鼓勵合作、團隊支持 | influence | pink | 💗 | assets/spirits/heart.png |
| spirit_potato | 阿栗 | 回收守衛 | 垃圾分類、資源回收 | cleanse | brown | 栗 | assets/spirits/potato.png |

#### 角色圖片素材規格

六位淨芽精靈需從使用者提供的角色參考圖中裁切為獨立正式素材。圖片不可整張嵌入遊戲，也不可只用文字、emoji、placeholder、簡化色塊或假 SVG 替代。

| 角色 | 正式素材路徑 |
|---|---|
| 綠芽 | `assets/spirits/green.png` |
| 水滴 | `assets/spirits/water.png` |
| 陽光 | `assets/spirits/sun.png` |
| 紫寶 | `assets/spirits/purple.png` |
| 心心 | `assets/spirits/heart.png` |
| 阿栗 | `assets/spirits/potato.png` |

素材輸出要求：

1. PNG 透明背景。
2. 正方形畫布。
3. 角色完整置中，不裁頭、不裁腳。
4. 不含原圖背景、文字、邊框或隔壁角色碎片。
5. `Pets.imageStage1`～`imageStage4` 沿用既有欄位語意，不新增 Google Sheets 圖片欄位。
6. 初始化資料需填入 `assets/spirits/*.png` 正式路徑。
7. 前端只有在 Sheets 圖片欄位空白時，才可 fallback 到本機 `spiritImageAssets` 對應路徑。

---

### 5.4 `Teams` 工作表新增欄位

保留原欄位，新增以下欄位：

| 欄位 | 類型 | 說明 |
|---|---|---|
| leaderSpiritId | 文字 | 隊長精靈 ID，可同步 selectedPetId |
| unlockedSpirits | JSON / 文字 | 已解鎖精靈列表，V2.0 可預設全部解鎖 |
| teamLevel | 數字 | 小隊等級 1～4 |
| teamLevelName | 文字 | 萌芽級、成長級、茁壯級、守護級 |
| mapProgress | 數字 | 地圖解鎖進度百分比 |
| totalSteps | 數字 | 累積步數 |
| completedMapNodes | JSON / 文字 | 已完成地圖節點 |
| lastAiCaptainFeedback | 文字 | 最近一次 AI 小隊長回饋 |

> 若要最小改動，`leaderSpiritId` 可不新增，直接用既有 `selectedPetId`。但 SPEC 與 SDD 建議新增，方便後續維護。

---

### 5.5 `Missions` 工作表新增欄位

| 欄位 | 類型 | 說明 |
|---|---|---|
| mapNodeId | 文字 | 對應地圖節點 ID |
| routeName | 文字 | 建議路線名稱 |
| stepTarget | 數字 | 任務目標步數 |
| taskType | 文字 | explore / identify / classify / analyze / advocate |
| aiCaptainHint | 文字 | AI 小隊長任務提示 |
| rewardConfig | JSON / 文字 | 任務完成獎勵設定 |
| unlockMapNode | 文字 | 完成後解鎖的地圖節點 |

---

### 5.6 `Submissions` 工作表新增欄位

| 欄位 | 類型 | 說明 |
|---|---|---|
| stepCount | 數字 | 本次探索步數，可手動輸入 |
| routeName | 文字 | 本次探索路線 |
| mapNodeId | 文字 | 對應地圖節點 |
| photoType | 文字 | none / note / url / upload，MVP 可用 note 或 url |
| identifiedItem | 文字 | 學生辨識出的垃圾或環境問題 |
| classificationResult | 文字 | 一般垃圾、資源回收、紙類、塑膠類等 |
| classificationReason | 文字 | 為什麼這樣分類 |
| aiCaptainHintUsed | 文字 | 本次任務使用的 AI 提示 |
| miniChallengeScore | 數字 | 分類小挑戰得分，MVP 可選填 |
| routeCompleted | 布林 | 是否完成路線任務 |

---

### 5.7 `ScoresLog` 工作表新增欄位

| 欄位 | 類型 | 說明 |
|---|---|---|
| stepDelta | 數字 | 本次步數 |
| mapProgressDelta | 數字 | 地圖進度變化 |
| spiritEnergyType | 文字 | 主要加成精靈能量類型 |
| unlockEvent | 文字 | 是否觸發升級、徽章或地圖解鎖 |

---

### 5.8 新增 `MapNodes` 工作表

用途：管理校園地圖節點與解鎖狀態。

| 欄位 | 說明 |
|---|---|
| mapNodeId | 地圖節點 ID |
| nodeName | 節點名稱，例如操場東側、川堂、走廊 |
| areaName | 對應校園區域 |
| week | 對應週次 |
| routeName | 建議路線 |
| stepTarget | 目標步數 |
| description | 節點說明 |
| unlockCondition | 解鎖條件 |
| icon | 圖示 |
| active | 是否啟用 |

---

### 5.9 `Results` 工作表新增欄位

| 欄位 | 類型 | 說明 |
|---|---|---|
| reportTitle | 文字 | 淨芽小隊守護報告標題 |
| totalSteps | 數字 | 小隊累積步數 |
| unlockedSpirits | 文字 | 已解鎖精靈 |
| exploredAreas | 文字 | 探索過的區域 |
| classificationSummary | 文字 | 垃圾辨識與分類摘要 |
| mapProgress | 數字 | 地圖解鎖進度 |
| aiCaptainSummary | 文字 | AI 小隊長成果摘要 |

---

## 6. API 設計修正

### 6.1 API 修正原則

1. 保留原 action 名稱。
2. 新增 action 不取代舊 action。
3. 舊 action 回傳資料中可增加新欄位。
4. 前端需能處理新舊資料並存。

### 6.2 新增或擴充 Actions

| Action | 類型 | 說明 |
|---|---|---|
| `getInitialData` | 擴充 | 回傳 spirits、mapNodes、v2 settings |
| `createTeam` | 擴充 | 支援 leaderSpiritId、teamLevel 初始值 |
| `getTeam` | 擴充 | 回傳小隊等級、總步數、地圖進度、AI 回饋 |
| `submitMission` | 擴充 | 支援步數、分類、路線、地圖節點 |
| `getMapNodes` | 新增 | 回傳地圖節點設定 |
| `getTeamMapProgress` | 新增 | 回傳小隊地圖解鎖進度 |
| `getAICaptainPrompt` | 新增 | 產生 AI 小隊長 prompt |
| `generateAICaptainFeedback` | 新增或半自動 | MVP 可只產生模板文字，不串 AI API |
| `createResultCard` | 擴充 | 改為建立守護報告欄位 |
| `getDashboardData` | 擴充 | 加入步數、分類、地圖解鎖統計 |
| `getStats` | 擴充 | 加入步數排行、分類統計、路線統計 |

---

## 7. API 詳細設計

### 7.1 `getInitialData`

#### 回傳新增資料

```json
{
  "success": true,
  "data": {
    "settings": {},
    "classes": [],
    "areas": [],
    "spirits": [],
    "missions": [],
    "mapNodes": [],
    "energyLabels": {
      "stamina": "健康能量",
      "scout": "探索能量",
      "cleanse": "淨化能量",
      "wisdom": "智慧能量",
      "influence": "守護能量"
    }
  }
}
```

---

### 7.2 `createTeam` 擴充

#### 輸入

```json
{
  "className": "六年一班",
  "groupNo": "第1組",
  "teamName": "綠光小隊",
  "selectedPetId": "spirit_green",
  "leaderSpiritId": "spirit_green",
  "customPetName": "綠芽隊長"
}
```

#### 處理邏輯

1. 建立 teamId。
2. 寫入原本 Teams 欄位。
3. 新增 `leaderSpiritId`，若沒有傳入則使用 `selectedPetId`。
4. 初始化 `teamLevel = 1`。
5. 初始化 `teamLevelName = 萌芽級`。
6. 初始化 `totalSteps = 0`。
7. 初始化 `mapProgress = 0`。
8. 初始化 `unlockedSpirits`：V2.0 可預設六位精靈全部解鎖。
9. 解鎖「淨芽集結徽章」。

---

### 7.3 `submitMission` 擴充

#### 輸入新增欄位

```json
{
  "teamId": "T202607030001",
  "week": 2,
  "missionId": "M2",
  "areaName": "操場",
  "mapNodeId": "node_playground_east",
  "routeName": "操場東側探索路線",
  "stepCount": 850,
  "problemFound": "操場旁有飲料杯和包裝紙",
  "trashTypes": ["飲料杯", "食物包裝"],
  "identifiedItem": "飲料杯",
  "classificationResult": "資源回收",
  "classificationReason": "飲料杯清空後可以依材質回收，但如果有髒污需要先處理",
  "amountLevel": "中等",
  "possibleReason": "下課時人很多，垃圾桶距離比較遠",
  "improvementIdea": "在操場入口設置提醒標語",
  "photoNote": "照片中可看到操場旁的飲料杯",
  "photoUrl": "",
  "reflection": "我們發現人多的地方比較容易有垃圾"
}
```

#### 處理邏輯

1. 寫入 `Submissions`。
2. 將 `stepCount` 加入小隊 `totalSteps`。
3. 根據任務內容呼叫 `calculateV2Score`。
4. 更新五種能力值。
5. 更新 `mapProgress`。
6. 檢查徽章。
7. 檢查小隊等級。
8. 產生 AI 小隊長回饋模板。
9. 回傳更新後的 team data。

---

### 7.4 `getMapNodes`

#### 用途

回傳可顯示於校園地圖的任務節點。

#### 回傳

```json
{
  "success": true,
  "data": [
    {
      "mapNodeId": "node_playground_east",
      "nodeName": "操場東側",
      "areaName": "操場",
      "week": 2,
      "routeName": "操場東側探索路線",
      "stepTarget": 800,
      "description": "觀察操場旁是否有飲料杯、包裝紙或其他垃圾",
      "unlockCondition": "week>=2",
      "icon": "🏃",
      "active": true
    }
  ]
}
```

---

### 7.5 `getAICaptainPrompt`

#### 用途

根據任務資料產生可複製到 ChatGPT 的 prompt。

#### 輸入

```json
{
  "type": "mission_feedback",
  "teamId": "T202607030001",
  "submissionId": "S202607030001"
}
```

#### 回傳

```json
{
  "success": true,
  "data": {
    "prompt": "你是國小高年級校園健康冒險遊戲中的 AI 小隊長……"
  }
}
```

---

## 8. 計分與升級邏輯

### 8.1 能量名稱對應

內部仍使用原能力值欄位。

| 內部欄位 | 學生端顯示 | 對應精靈 |
|---|---|---|
| `stamina` | 健康能量 | 水滴、陽光 |
| `scout` | 探索能量 | 綠芽 |
| `cleanse` | 淨化能量 | 綠芽、阿栗 |
| `wisdom` | 智慧能量 | 紫寶、阿栗 |
| `influence` | 守護能量 | 心心 |

### 8.2 `calculateV2Score` 建議邏輯

```text
建立小隊：
  stamina +5
  influence +5

提交任務：
  有調查地點：stamina +5
  有 stepCount：stamina + floor(stepCount / 200)，最高 +10
  有 routeName：scout +5
  有發現問題：scout +10
  有垃圾類型：wisdom +5
  有 identifiedItem：wisdom +5
  有 classificationResult：cleanse +5
  有 classificationReason：wisdom +5
  有可能原因：wisdom +10
  有改善想法：cleanse +10
  有反思：influence +5

成果報告：
  有主要發現：scout +10
  有分類摘要：wisdom +10
  有改善提案：cleanse +15
  有宣導口號：influence +15
  有行動承諾：influence +10
```

### 8.3 小隊等級規則

| 等級 | 名稱 | 條件 |
|---|---|---|
| Lv.1 | 萌芽級 | 小隊建立完成 |
| Lv.2 | 成長級 | 完成第 2 週至少 1 筆探索任務 |
| Lv.3 | 茁壯級 | 完成第 3 週至少 1 筆分類或分析任務 |
| Lv.4 | 守護級 | 完成守護報告 |

### 8.4 地圖解鎖規則

V2.0 建議採簡化週次解鎖：

| 條件 | 解鎖 |
|---|---|
| 小隊建立 | 小隊基地 |
| currentWeek >= 2 | 校園探索節點 |
| 完成第 2 週任務 | 分類挑戰節點 |
| 完成第 3 週任務 | 守護報告節點 |
| 完成守護報告 | 全地圖完成狀態 |

### 8.5 徽章更新

| 原徽章 | v2 顯示名稱 | 條件 |
|---|---|---|
| 甦醒徽章 | 淨芽集結徽章 | 建立小隊 |
| 校園偵查徽章 | 校園探索徽章 | 完成探索任務 |
| 熱點分析徽章 | 熱點分析徽章 | 完成原因分析 |
| 改善提案徽章 | 淨化提案徽章 | 提出改善想法 |
| 校園守護徽章 | 校園守護徽章 | 完成守護報告 |
| 影響力徽章 | 守護倡議徽章 | 完成宣導口號或發表 |

---

## 9. AI 小隊長設計

### 9.1 AI 小隊長定位

AI 小隊長不是即時聊天機器人，而是系統中用於提供任務提示、回饋語與分析 prompt 的角色。

建議預設名稱：`紫寶隊長`。

### 9.2 AI 小隊長出現位置

| 頁面 | 功能 |
|---|---|
| 首頁 | 任務開場與故事引導 |
| 任務卡 | 今日任務提示 |
| 任務回報頁 | 填寫提醒與分類提示 |
| 小隊基地 | 完成任務後的鼓勵語 |
| 教師端 | 產生分析 prompt |
| 守護報告 | 產生成果摘要 prompt |

### 9.3 AI 小隊長回饋模板

```text
{teamName} 完成了 {areaName} 的探索任務！
你們累積了 {stepCount} 步，發現了「{identifiedItem}」，並判斷它屬於「{classificationResult}」。
紫寶隊長提醒你們：接下來可以想想，為什麼這個垃圾會出現在這裡？有沒有方法讓它下次不要再出現？
```

### 9.4 教師端 AI 分析 Prompt

```text
你是一位國小高年級「淨芽小隊：校園健康冒險」課程顧問。
以下是學生提交的校園探索、步數、垃圾辨識、分類與改善想法資料。
請協助整理：

1. 最常出現垃圾或環境問題的校園區域
2. 學生累積最多探索行動的路線或區域
3. 最常見的垃圾類型
4. 學生垃圾分類判斷中常見的正確觀念與可能迷思
5. 學生提出的可能原因
6. 學生提出的改善方法
7. 最具體、最可行的改善提案
8. 給國小高年級學生的回饋與追問
9. 可作為全校宣導的 5 句口號

請用繁體中文，語氣適合國小高年級。
```

---

## 10. 教師端修正設計

### 10.1 儀表板新增指標

| 指標 | 說明 |
|---|---|
| 小隊總數 | 沿用原統計 |
| 任務回報總數 | 沿用原統計 |
| 守護報告完成數 | 原成果卡數 |
| 累積步數總和 | 加總 Submissions.stepCount |
| 平均每組步數 | totalSteps / teams |
| 熱點最多區域 | areaName 統計 |
| 常見垃圾類型 | trashTypes / identifiedItem 統計 |
| 常見分類結果 | classificationResult 統計 |
| 地圖節點完成率 | completedMapNodes / totalMapNodes |
| 小隊等級分布 | teamLevel 統計 |

### 10.2 回報紀錄頁新增欄位顯示

新增顯示：

1. 步數
2. 路線
3. 地圖節點
4. 辨識物品
5. 分類結果
6. 分類理由
7. AI 小隊長提示

### 10.3 熱點分析頁新增圖表／表格

若現有系統已使用文字統計，可先以表格呈現。

| 統計 | 資料來源 |
|---|---|
| 區域熱點排行 | Submissions.areaName |
| 垃圾類型排行 | Submissions.trashTypes + identifiedItem |
| 分類結果統計 | Submissions.classificationResult |
| 路線探索統計 | Submissions.routeName |
| 步數排行 | Teams.totalSteps 或 Submissions.stepCount |
| 提案關鍵字整理 | Submissions.improvementIdea |

---

## 11. 初始化函式修正

### 11.1 `initializeSheets()` 需新增或更新

需確保以下內容存在：

1. 新版 Settings keys
2. 六位淨芽精靈資料
3. 預設 MapNodes
4. Missions 新欄位
5. Teams 新欄位
6. Submissions 新欄位
7. Results 新欄位

### 11.2 欄位升級策略

`initializeSheets()` 不應清空舊資料。建議改為：

1. 檢查工作表是否存在，不存在才建立。
2. 檢查標題列是否缺少欄位，缺少才 append。
3. 檢查預設資料是否存在，不存在才新增。
4. 不覆蓋已存在的小隊與學生任務資料。

### 11.3 建議新增函式

| 函式 | 用途 |
|---|---|
| `migrateToV2()` | 對舊資料表補齊 v2 欄位與預設資料 |
| `seedDefaultSpirits()` | 寫入六位淨芽精靈 |
| `seedDefaultMapNodes()` | 寫入預設校園地圖節點 |
| `ensureColumns(sheetName, columns)` | 檢查並新增欄位 |
| `calculateV2Score(payload)` | 新版能力值計算 |
| `updateTeamLevel(teamId)` | 更新小隊等級 |
| `updateMapProgress(teamId)` | 更新地圖進度 |
| `buildAICaptainPrompt(type, data)` | 建立 AI 小隊長 prompt |

---

## 12. 前端資料結構建議

### 12.1 精靈資料結構

```js
const spirits = [
  {
    id: 'spirit_green',
    name: '綠芽',
    role: '環境守衛',
    description: '擅長發現垃圾與守護校園環境。',
    primaryEnergy: 'scout',
    secondaryEnergy: 'cleanse',
    colorTheme: 'green',
    icon: '🌱'
  },
  {
    id: 'spirit_water',
    name: '水滴',
    role: '活力守衛',
    description: '提醒大家補充水分，保持探索活力。',
    primaryEnergy: 'stamina',
    colorTheme: 'blue',
    icon: '💧'
  },
  {
    id: 'spirit_sun',
    name: '陽光',
    role: '運動守衛',
    description: '鼓勵大家走出教室，累積健康能量。',
    primaryEnergy: 'stamina',
    colorTheme: 'yellow',
    icon: '☀️'
  },
  {
    id: 'spirit_purple',
    name: '紫寶',
    role: '智慧守衛',
    description: '像 AI 小隊長一樣，協助分析與提醒。',
    primaryEnergy: 'wisdom',
    colorTheme: 'purple',
    icon: '🔮'
  },
  {
    id: 'spirit_heart',
    name: '心心',
    role: '情緒守衛',
    description: '鼓勵團隊合作，讓小隊更有凝聚力。',
    primaryEnergy: 'influence',
    colorTheme: 'pink',
    icon: '💗'
  },
  {
    id: 'spirit_potato',
    name: '阿栗',
    role: '回收守衛',
    description: '擅長垃圾分類與資源回收挑戰。',
    primaryEnergy: 'cleanse',
    secondaryEnergy: 'wisdom',
    colorTheme: 'brown',
    icon: '🥔'
  }
];
```

### 12.2 能量標籤

```js
const energyLabels = {
  stamina: '健康能量',
  scout: '探索能量',
  cleanse: '淨化能量',
  wisdom: '智慧能量',
  influence: '守護能量'
};
```

### 12.3 等級標籤

```js
const teamLevels = [
  { level: 1, name: '萌芽級', condition: '建立小隊' },
  { level: 2, name: '成長級', condition: '完成校園探索' },
  { level: 3, name: '茁壯級', condition: '完成垃圾辨識與分類' },
  { level: 4, name: '守護級', condition: '完成守護報告' }
];
```

---

## 13. UI 設計修正

### 13.1 視覺方向

依使用者提供之角色圖，v2 UI 應更像「國小學生會想玩的任務遊戲」。

| 元素 | 設計方向 |
|---|---|
| 色彩 | 綠、藍、黃、紫、粉、棕等精靈色系 |
| 首頁 | 校園健康冒險感、任務啟動感 |
| 任務卡 | 大標題、清楚目標、獎勵提示 |
| 小隊基地 | 卡片式角色、能量條、徽章 |
| 地圖頁 | 節點式地圖、未解鎖/已完成狀態 |
| 回報頁 | 表單不要過長，分段呈現 |
| 教師端 | 保持清楚、可管理，不需過度遊戲化 |

### 13.1.1 圖片容器與活潑 UI 規格

學生端視覺需以國小學生為主要使用者，畫面要活潑、可愛、有遊戲感，但操作仍需清楚可讀。首頁、小隊建立頁、小隊基地、任務地圖、任務回報與守護報告都需使用角色或任務視覺素材，不可只留下文字卡片。

圖片容器規格：

1. 角色圖片一律以等同 `object-fit: contain` 的方式呈現。
2. 首頁大角色圖需有固定最大寬高，建議約 160～190px，不得撐爆首屏。
3. 角色卡小圖需大小一致，建議約 72～88px，文字不得被圖片壓住。
4. 小隊基地中圖需有固定最大寬高，建議約 120～160px，並保留能量條與徽章空間。
5. 任務地圖與任務循環圖示不可因圖片過大造成水平溢出。
6. 手機與 iPad 版需使用 responsive max-width / max-height，避免裁切、變形、重疊或遮擋文字。
7. 不得把整張角色參考圖塞入容器；需使用裁切去背後的單一角色素材。

### 13.2 任務回報頁分段

任務回報頁建議分為：

1. 探索紀錄：地點、路線、步數
2. 發現紀錄：看到什麼問題、垃圾類型
3. 辨識分類：辨識物品、分類結果、分類理由
4. 改善想法：原因、改善方法、反思
5. 送出後回饋：能力值增加、精靈回饋、地圖進度

### 13.3 手機／iPad 使用考量

1. 表單欄位使用大按鈕與下拉選單。
2. 文字輸入區不要一次太多。
3. 任務說明短句化。
4. 送出後一定要有動畫或清楚回饋。
5. 所有重要按鈕需支援 iPad 觸控。

---

## 14. 相容性與資料遷移

### 14.1 舊資料相容

若舊 `Teams` 沒有 v2 欄位：

| 欄位 | 預設值 |
|---|---|
| leaderSpiritId | selectedPetId |
| unlockedSpirits | 全部六位精靈 |
| teamLevel | 依 stage 或任務完成狀態推算 |
| teamLevelName | 依 teamLevel 對應 |
| mapProgress | 依任務完成狀態推算 |
| totalSteps | 0 |
| completedMapNodes | 空陣列 |
| lastAiCaptainFeedback | 空字串 |

### 14.2 舊任務回報相容

若舊 `Submissions` 沒有 v2 欄位：

| 欄位 | 預設值 |
|---|---|
| stepCount | 0 |
| routeName | 空字串 |
| mapNodeId | 空字串 |
| identifiedItem | 空字串 |
| classificationResult | 空字串 |
| classificationReason | 空字串 |
| miniChallengeScore | 0 |
| routeCompleted | false |

### 14.3 前端防呆

所有 v2 欄位都需支援缺省值，避免舊資料造成頁面錯誤。

---

## 15. 測試項目

### 15.1 學生端測試

| 測試項目 | 預期結果 |
|---|---|
| 首頁顯示 | 出現「淨芽小隊：校園健康冒險」遊戲層名稱 |
| 建立小隊 | 可建立小隊並選隊長精靈 |
| 精靈選擇 | 六位精靈皆可顯示 |
| 任務地圖 | 可看到四週任務節點與解鎖狀態 |
| 任務回報 | 可輸入步數、路線、辨識物品、分類結果 |
| 任務送出 | 能力值與能量名稱更新正確 |
| 小隊基地 | 顯示隊長精靈、六位精靈、能量條、徽章 |
| 成果頁 | 顯示《淨芽小隊守護報告》 |
| 角色圖片素材 | 六位角色皆為透明背景、完整顯示，不帶背景或其他角色碎片 |
| 圖片容器 | 首頁、角色卡、小隊基地、地圖、守護報告圖片皆不裁切、不變形、不遮擋文字 |
| 活潑 UI | 學生端有國小學生取向的遊戲感、色彩與角色存在感，但文字仍清楚可讀 |
| 響應式視覺 | 桌機、iPad、手機都沒有水平溢出、圖片爆版或內容重疊 |

### 15.2 教師端測試

| 測試項目 | 預期結果 |
|---|---|
| 儀表板 | 顯示小隊、回報、守護報告數 |
| 步數統計 | 能加總 stepCount |
| 分類統計 | 能統計 classificationResult |
| 熱點分析 | 仍可分析 areaName 與 trashTypes |
| 小隊列表 | 顯示隊長精靈與小隊等級 |
| 成果管理 | 顯示守護報告欄位 |
| AI prompt | 可產生淨芽小隊版 prompt |

### 15.3 後端測試

| 測試項目 | 預期結果 |
|---|---|
| initializeSheets | 不清空舊資料，能補齊新欄位 |
| migrateToV2 | 舊資料可補上預設值 |
| getInitialData | 回傳 spirits、mapNodes、energyLabels |
| createTeam | 可寫入 leaderSpiritId 與 teamLevel |
| submitMission | 可寫入 v2 欄位並計算分數 |
| getStats | 可回傳步數與分類統計 |
| createResultCard | 可建立守護報告 |

---

## 16. 開發順序建議

### Phase 1：資料結構與初始化

1. 更新 `initializeSheets()`，新增 v2 欄位。
2. 新增 `migrateToV2()`。
3. 新增六位淨芽精靈預設資料。
4. 新增 MapNodes 預設資料。
5. 確保舊資料不被清空。

### Phase 2：學生端視覺與角色

1. 更新首頁名稱與遊戲故事。
2. 將提供角色圖裁切、去背為六位獨立透明 PNG。
3. 更新角色選擇頁為六位淨芽精靈，角色卡圖片大小一致且不壓住文字。
4. 更新成長頁為小隊基地，使用正式角色圖、能量條與徽章。
5. 更新首頁、任務地圖與守護報告的角色或任務視覺素材。
6. 更新能力值顯示名稱。

### Phase 3：任務地圖與任務卡

1. 地圖頁加入節點卡與解鎖狀態。
2. 新增今日任務卡。
3. 任務卡顯示步數目標、路線、獎勵。
4. 任務文案改為淨芽小隊語氣。

### Phase 4：任務回報表單

1. 新增 stepCount。
2. 新增 routeName。
3. 新增 identifiedItem。
4. 新增 classificationResult。
5. 新增 classificationReason。
6. 送出後更新能量、地圖進度、AI 回饋語。

### Phase 5：教師端統計

1. 儀表板加入步數統計。
2. 熱點分析加入分類統計。
3. 小隊列表顯示小隊等級與隊長精靈。
4. 更新 AI prompt 為淨芽小隊版。

### Phase 6：守護報告

1. 成果卡頁改名為守護報告。
2. 顯示累積步數、解鎖精靈、分類摘要、地圖進度。
3. 教師端成果管理同步更新。

---

## 17. 給 AI Coding 工具的執行指令摘要

```text
請根據本 SDD v2，在現有 campus-green-partner 專案上進行增量修改，不要重建專案。

請保留現有架構：index.html、styles.css、app.js、apps-script/Code.gs、Google Sheets 後端、學生端與教師端功能。

請優先完成：
1. 六位淨芽精靈資料結構與角色選擇頁更新
2. 能力值顯示名稱改為健康能量、探索能量、淨化能量、智慧能量、守護能量
3. 任務地圖改為校園探索節點與今日任務卡
4. 任務回報表單新增步數、路線、辨識物品、分類結果、分類理由
5. 小隊基地顯示精靈、能量、徽章與等級
6. 成果卡改為《淨芽小隊守護報告》
7. 教師端新增步數與分類統計
8. Google Apps Script 初始化與遷移函式需保留舊資料，只補欄位，不清空資料

暫時不要加入 GPS、真實步數 API、即時 AI 圖像辨識、複雜動畫或重新設計資料庫。
```

---

## 18. 結語

本次 SDD v2 的重點是把現有《校園綠夥伴：環境復甦任務》MVP，升級為更有遊戲感的「淨芽小隊：校園健康冒險」體驗。

系統核心不變：學生透過校園行動、環境觀察、垃圾分類與改善提案完成學習。  
修正重點在於：更明確的任務循環、更可愛的角色系統、更清楚的能量回饋、更像遊戲的地圖與成果報告。
