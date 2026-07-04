var HEADERS = {
  Settings: ["key", "value", "note"],
  Classes: ["classId", "className", "grade", "active"],
  Areas: ["areaId", "areaName", "description", "active"],
  Pets: ["petId", "petName", "description", "trait", "imageStage1", "imageStage2", "imageStage3", "imageStage4", "active", "spiritRole", "primaryEnergy", "secondaryEnergy", "colorTheme", "icon"],
  Teams: ["teamId", "createdAt", "className", "groupNo", "teamName", "selectedPetId", "customPetName", "stage", "stamina", "scout", "cleanse", "wisdom", "influence", "badges", "lastUpdated", "leaderSpiritId", "unlockedSpirits", "teamLevel", "teamLevelName", "mapProgress", "totalSteps", "completedMapNodes", "lastAiCaptainFeedback"],
  Missions: ["missionId", "week", "title", "story", "instruction", "requiredFields", "unlockCondition", "active", "mapNodeId", "routeName", "stepTarget", "taskType", "aiCaptainHint", "rewardConfig", "unlockMapNode"],
  Submissions: ["submissionId", "createdAt", "teamId", "className", "groupNo", "week", "missionId", "areaName", "problemFound", "trashTypes", "amountLevel", "possibleReason", "improvementIdea", "photoNote", "photoUrl", "reflection", "scoreApplied", "stepCount", "stepTarget", "routeName", "mapNodeId", "photoType", "identifiedItem", "classificationResult", "classificationReason", "aiGuessNote", "aiCaptainHintUsed", "miniChallengeScore", "routeCompleted", "missionCardId"],
  ScoresLog: ["logId", "createdAt", "teamId", "sourceType", "sourceId", "staminaDelta", "scoutDelta", "cleanseDelta", "wisdomDelta", "influenceDelta", "note", "stepDelta", "mapProgressDelta", "spiritEnergyType", "unlockEvent"],
  Results: ["resultId", "createdAt", "teamId", "mainArea", "mainFinding", "mainReason", "proposal", "slogan", "commitment", "finalStage", "summaryText", "reportTitle", "totalSteps", "unlockedSpirits", "exploredAreas", "classificationSummary", "mapProgress", "aiCaptainSummary"],
  MapNodes: ["mapNodeId", "nodeName", "areaName", "week", "routeName", "stepTarget", "description", "unlockCondition", "icon", "active"]
};

var DEFAULT_ROWS = {
  Settings: [
    { key: "teacherCode", value: "1234", note: "教師管理碼" },
    { key: "currentWeek", value: "1", note: "目前開放週次" },
    { key: "gameTitle", value: "校園綠夥伴：環境復甦任務", note: "遊戲名稱" },
    { key: "formalProjectName", value: "校園綠夥伴：環境復甦任務", note: "正式課程名稱" },
    { key: "gameDisplayName", value: "淨芽小隊：校園健康冒險", note: "學生端遊戲名稱" },
    { key: "defaultStepTarget", value: "800", note: "預設任務步數" },
    { key: "mapUnlockMode", value: "week", note: "地圖解鎖模式" },
    { key: "aiCaptainName", value: "紫寶隊長", note: "AI 小隊長名稱" },
    { key: "enableManualSteps", value: "true", note: "允許手動輸入步數" },
    { key: "enableClassificationChallenge", value: "true", note: "啟用分類挑戰" }
  ],
  Classes: [
    { classId: "C501", className: "五年一班", grade: "五年級", active: true },
    { classId: "C502", className: "五年二班", grade: "五年級", active: true },
    { classId: "C601", className: "六年一班", grade: "六年級", active: true },
    { classId: "C602", className: "六年二班", grade: "六年級", active: true }
  ],
  Areas: [
    { areaId: "A01", areaName: "操場", description: "戶外活動區", active: true },
    { areaId: "A02", areaName: "走廊", description: "教室周邊動線", active: true },
    { areaId: "A03", areaName: "川堂", description: "主要集合與通行空間", active: true },
    { areaId: "A04", areaName: "花圃", description: "植栽與綠地", active: true },
    { areaId: "A05", areaName: "飲水機旁", description: "補水與休息區", active: true },
    { areaId: "A06", areaName: "遊樂器材區", description: "下課活動區", active: true },
    { areaId: "A07", areaName: "樓梯間", description: "樓層連通處", active: true },
    { areaId: "A08", areaName: "教室外", description: "班級外側空間", active: true },
    { areaId: "A09", areaName: "廁所外", description: "廁所出入口", active: true },
    { areaId: "A10", areaName: "校門口", description: "上下學出入口", active: true },
    { areaId: "A11", areaName: "其他", description: "其他觀察地點", active: true }
  ],
  Pets: [
    { petId: "spirit_green", petName: "綠芽", description: "擅長發現垃圾與守護校園環境。", trait: "發現垃圾、綠化校園", imageStage1: "assets/spirits/green.png", imageStage2: "assets/spirits/green.png", imageStage3: "assets/spirits/green.png", imageStage4: "assets/spirits/green.png", active: true, spiritRole: "環境守衛", primaryEnergy: "scout", secondaryEnergy: "cleanse", colorTheme: "green", icon: "芽" },
    { petId: "spirit_water", petName: "水滴", description: "提醒大家補充水分，保持探索活力。", trait: "補充能量、健康提醒", imageStage1: "assets/spirits/water.png", imageStage2: "assets/spirits/water.png", imageStage3: "assets/spirits/water.png", imageStage4: "assets/spirits/water.png", active: true, spiritRole: "活力守衛", primaryEnergy: "stamina", secondaryEnergy: "", colorTheme: "blue", icon: "水" },
    { petId: "spirit_sun", petName: "陽光", description: "鼓勵大家走出教室，累積健康能量。", trait: "鼓勵走動、累積步數", imageStage1: "assets/spirits/sun.png", imageStage2: "assets/spirits/sun.png", imageStage3: "assets/spirits/sun.png", imageStage4: "assets/spirits/sun.png", active: true, spiritRole: "運動守衛", primaryEnergy: "stamina", secondaryEnergy: "influence", colorTheme: "yellow", icon: "光" },
    { petId: "spirit_purple", petName: "紫寶", description: "像 AI 小隊長一樣，協助分析與提醒。", trait: "AI 分析、路線建議", imageStage1: "assets/spirits/purple.png", imageStage2: "assets/spirits/purple.png", imageStage3: "assets/spirits/purple.png", imageStage4: "assets/spirits/purple.png", active: true, spiritRole: "智慧守衛", primaryEnergy: "wisdom", secondaryEnergy: "", colorTheme: "purple", icon: "智" },
    { petId: "spirit_heart", petName: "心心", description: "鼓勵團隊合作，讓小隊更有凝聚力。", trait: "鼓勵合作、團隊支持", imageStage1: "assets/spirits/heart.png", imageStage2: "assets/spirits/heart.png", imageStage3: "assets/spirits/heart.png", imageStage4: "assets/spirits/heart.png", active: true, spiritRole: "情緒守衛", primaryEnergy: "influence", secondaryEnergy: "", colorTheme: "pink", icon: "心" },
    { petId: "spirit_potato", petName: "土豆", description: "擅長垃圾分類與資源回收挑戰。", trait: "垃圾分類、資源回收", imageStage1: "assets/spirits/potato.png", imageStage2: "assets/spirits/potato.png", imageStage3: "assets/spirits/potato.png", imageStage4: "assets/spirits/potato.png", active: true, spiritRole: "回收守衛", primaryEnergy: "cleanse", secondaryEnergy: "wisdom", colorTheme: "brown", icon: "收" }
  ],
  Missions: [
    { missionId: "M1", week: 1, title: "淨芽小隊集結", story: "建立淨芽小隊，選出隊長精靈，啟動校園健康冒險。", instruction: "認識六位淨芽精靈，完成小隊基地集結。", requiredFields: "reflection", unlockCondition: "建立小隊", active: true, mapNodeId: "node_base", routeName: "小隊基地集結", stepTarget: 0, taskType: "team", aiCaptainHint: "先確認小隊名稱與隊長精靈，之後每次探索都要互相提醒安全。", rewardConfig: "influence+5", unlockMapNode: "node_playground" },
    { missionId: "M2", week: 2, title: "校園健康探索", story: "走出教室，累積步數與探索能量，找出校園環境問題。", instruction: "完成指定路線探索，記錄步數、地點與發現。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea,stepCount,routeName", unlockCondition: "完成第 1 週任務", active: true, mapNodeId: "node_playground", routeName: "操場東側探索路線", stepTarget: 800, taskType: "explore", aiCaptainHint: "走路時請注意安全，也記得觀察垃圾容易出現的位置。", rewardConfig: "stamina+10,scout+10", unlockMapNode: "node_corridor" },
    { missionId: "M3", week: 3, title: "垃圾辨識與分類挑戰", story: "把觀察變成判斷，完成垃圾辨識、分類與原因分析。", instruction: "選定一個熱點，完成分類結果、分類理由與改善想法。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea,classificationResult,classificationReason", unlockCondition: "完成至少一筆偵查回報", active: true, mapNodeId: "node_classify", routeName: "分類挑戰路線", stepTarget: 600, taskType: "classify", aiCaptainHint: "分類前先觀察材質與髒污狀態，不確定時可以先寫下理由。", rewardConfig: "wisdom+10,cleanse+5", unlockMapNode: "node_guardian" },
    { missionId: "M4", week: 4, title: "校園守護發表", story: "整理四週探索成果，完成淨芽小隊守護報告。", instruction: "完成宣導口號、行動承諾與守護報告，讓小隊成為守護級。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea", unlockCondition: "完成熱點分析", active: true, mapNodeId: "node_guardian", routeName: "守護報告路線", stepTarget: 400, taskType: "advocate", aiCaptainHint: "改善提案要具體可行，讓其他同學知道可以怎麼一起做到。", rewardConfig: "influence+20,cleanse+10,wisdom+10", unlockMapNode: "" }
  ],
  MapNodes: [
    { mapNodeId: "node_base", nodeName: "教室基地", areaName: "教室外", week: 1, routeName: "小隊基地集結", stepTarget: 0, description: "建立淨芽小隊，認識六位淨芽精靈。", unlockCondition: "建立小隊", icon: "基地", active: true },
    { mapNodeId: "node_playground", nodeName: "操場探索區", areaName: "操場", week: 2, routeName: "操場東側探索路線", stepTarget: 800, description: "走出教室，累積步數並觀察操場周邊。", unlockCondition: "完成第 1 週任務", icon: "步", active: true },
    { mapNodeId: "node_corridor", nodeName: "走廊川堂偵查區", areaName: "走廊", week: 2, routeName: "走廊與川堂偵查路線", stepTarget: 800, description: "找出人流較多處的垃圾或髒亂能量。", unlockCondition: "完成第 2 週探索", icon: "查", active: true },
    { mapNodeId: "node_classify", nodeName: "分類挑戰區", areaName: "飲水機旁", week: 3, routeName: "分類挑戰路線", stepTarget: 600, description: "辨識垃圾並判斷分類方式。", unlockCondition: "完成垃圾辨識紀錄", icon: "分", active: true },
    { mapNodeId: "node_guardian", nodeName: "守護發表區", areaName: "川堂", week: 4, routeName: "守護報告路線", stepTarget: 400, description: "整理發現、提出提案，完成守護報告。", unlockCondition: "完成第 3 週分析", icon: "守", active: true }
  ]
};

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function initializeSheets() {
  Object.keys(HEADERS).forEach(function(sheetName) {
    prepareSheet_(sheetName);
  });

  Object.keys(DEFAULT_ROWS).forEach(function(sheetName) {
    seedSheet_(sheetName, DEFAULT_ROWS[sheetName]);
  });

  return getInitialData_();
}

function handleRequest_(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents || "{}");
    }
    var action = body.action || (e && e.parameter && e.parameter.action) || "getInitialData";
    var payload = body.payload || parsePayload_(e);
    var data = dispatch_(action, payload);
    return json_({ success: true, data: data, message: "" });
  } catch (error) {
    return json_({ success: false, data: null, message: error.message || String(error) });
  }
}

function dispatch_(action, payload) {
  if (action === "initializeSheets") return initializeSheets();
  initializeSheets();

  switch (action) {
    case "getInitialData":
      return getInitialData_();
    case "getMapNodes":
      return { mapNodes: activeRows_(readRows_("MapNodes")) };
    case "createTeam":
      return createTeam_(payload);
    case "getTeam":
      return getTeam_(payload.teamId);
    case "getTeamByClassGroup":
      return getTeamByClassGroup_(payload.className, payload.groupNo);
    case "submitMission":
      return submitMission_(payload);
    case "getTeamSubmissions":
      return getTeamSubmissions_(payload.teamId);
    case "getDashboardData":
      requireTeacherCode_(payload);
      return getDashboardData_();
    case "getStats":
      requireTeacherCode_(payload);
      return getStats_();
    case "createResultCard":
      return createResultCard_(payload);
    case "getAllResults":
      requireTeacherCode_(payload);
      return getAllResults_();
    case "checkTeacherCode":
      return { ok: String(payload.code || "") === String(settingsObject_().teacherCode || "1234") };
    case "updateSettings":
      requireTeacherCode_(payload);
      return updateSettings_(payload);
    default:
      throw new Error("action 不存在");
  }
}

function getInitialData_() {
  var spirits = activeRows_(readRows_("Pets")).filter(function(pet) {
    return String(pet.petId || "").indexOf("spirit_") === 0;
  });
  if (!spirits.length) spirits = activeRows_(readRows_("Pets"));

  return {
    settings: publicSettings_(),
    classes: activeRows_(readRows_("Classes")),
    areas: activeRows_(readRows_("Areas")),
    pets: spirits,
    spirits: spirits,
    missions: activeRows_(readRows_("Missions")).sort(function(a, b) { return Number(a.week) - Number(b.week); }),
    mapNodes: activeRows_(readRows_("MapNodes")),
    energyLabels: energyLabels_()
  };
}

function publicSettings_() {
  var settings = settingsObject_();
  delete settings.teacherCode;
  return settings;
}

function requireTeacherCode_(payload) {
  if (String((payload || {}).code || "") !== String(settingsObject_().teacherCode || "1234")) {
    throw new Error("教師管理碼不正確或已失效，請重新登入教師端");
  }
}

function createTeam_(payload) {
  var className = text_(payload.className);
  var groupNo = text_(payload.groupNo);
  var teamName = text_(payload.teamName);
  var selectedPetId = text_(payload.leaderSpiritId || payload.selectedPetId);
  var customPetName = text_(payload.customPetName);

  if (!className) throw new Error("請選擇班級");
  if (!groupNo) throw new Error("請選擇組別");
  if (!teamName) throw new Error("請輸入小隊名稱");
  if (!selectedPetId) throw new Error("請選擇一位隊長精靈");
  if (!customPetName) throw new Error("請輸入隊長精靈名稱");

  var duplicate = readRows_("Teams").some(function(team) {
    return team.className === className && team.groupNo === groupNo;
  });
  if (duplicate) throw new Error("這個班級與組別已經有小隊，請使用找回小隊");

  var now = now_();
  var team = {
    teamId: makeId_("T"),
    createdAt: now,
    className: className,
    groupNo: groupNo,
    teamName: teamName,
    selectedPetId: selectedPetId,
    leaderSpiritId: selectedPetId,
    customPetName: customPetName,
    unlockedSpirits: ["spirit_green", "spirit_water", "spirit_sun", "spirit_purple", "spirit_heart", "spirit_potato"],
    stage: "萌芽級",
    teamLevel: 1,
    teamLevelName: "萌芽級",
    mapProgress: 20,
    totalSteps: 0,
    completedMapNodes: ["node_base"],
    lastAiCaptainFeedback: "紫寶隊長提醒：先建立默契，下一次探索時一起注意安全與環境。",
    stamina: 5,
    scout: 0,
    cleanse: 0,
    wisdom: 0,
    influence: 5,
    badges: ["淨芽集結徽章"],
    lastUpdated: now
  };

  appendObject_("Teams", team);
  appendObject_("ScoresLog", {
    logId: makeId_("L"),
    createdAt: now,
    teamId: team.teamId,
    sourceType: "teamCreated",
    sourceId: team.teamId,
    staminaDelta: 5,
    scoutDelta: 0,
    cleanseDelta: 0,
    wisdomDelta: 0,
    influenceDelta: 5,
    note: "建立淨芽小隊與命名隊長精靈",
    stepDelta: 0,
    mapProgressDelta: 20,
    spiritEnergyType: "influence",
    unlockEvent: "node_base"
  });

  return { team: decorateTeam_(team) };
}

function getTeam_(teamId) {
  var team = findObjectByKey_("Teams", "teamId", teamId);
  if (!team) throw new Error("小隊不存在");
  return { team: decorateTeam_(team) };
}

function getTeamByClassGroup_(className, groupNo) {
  var team = readRows_("Teams").filter(function(item) {
    return item.className === text_(className) && item.groupNo === text_(groupNo);
  })[0];
  if (!team) throw new Error("找不到這個班級組別的小隊");
  return { team: decorateTeam_(team) };
}

function submitMission_(payload) {
  var teamRow = findRowByKey_("Teams", "teamId", payload.teamId);
  if (!teamRow) throw new Error("小隊不存在");

  var team = teamRow.object;
  var week = Number(payload.week);
  var mission = readRows_("Missions").filter(function(item) {
    return Number(item.week) === week;
  })[0];
  if (!mission) throw new Error("找不到任務資料");

  var trashTypes = ensureArray_(payload.trashTypes);
  var taskType = missionTaskType_(mission);
  validateMissionPayload_(payload, mission);

  var now = now_();
  var submission = {
    submissionId: makeId_("S"),
    createdAt: now,
    teamId: team.teamId,
    className: team.className,
    groupNo: team.groupNo,
    week: week,
    missionId: payload.missionId || mission.missionId,
    missionCardId: text_(payload.missionCardId || mission.missionId),
    areaName: text_(payload.areaName) || missionAreaName_(mission),
    mapNodeId: text_(payload.mapNodeId || mission.mapNodeId),
    routeName: text_(payload.routeName || mission.routeName),
    stepCount: numberValue_(payload.stepCount),
    stepTarget: stepTargetValue_(payload.stepTarget, mission.stepTarget, settingsObject_().defaultStepTarget, 800),
    problemFound: text_(payload.problemFound) || defaultProblemForMission_(taskType),
    trashTypes: trashTypes,
    identifiedItem: text_(payload.identifiedItem),
    classificationResult: text_(payload.classificationResult || payload.classificationType),
    classificationReason: text_(payload.classificationReason),
    aiGuessNote: text_(payload.aiGuessNote),
    aiCaptainHintUsed: text_(payload.aiCaptainHintUsed || mission.aiCaptainHint),
    miniChallengeScore: text_(payload.classificationResult || payload.classificationType) ? 1 : 0,
    routeCompleted: Boolean(text_(payload.routeName || mission.routeName) || numberValue_(payload.stepCount) > 0),
    amountLevel: text_(payload.amountLevel) || "少量",
    possibleReason: text_(payload.possibleReason) || defaultReasonForMission_(taskType),
    improvementIdea: text_(payload.improvementIdea) || defaultImprovementForMission_(taskType),
    photoNote: text_(payload.photoNote),
    photoUrl: text_(payload.photoUrl),
    reflection: text_(payload.reflection),
    scoreApplied: true
  };

  var delta = calculateSubmissionDelta_(submission);
  appendObject_("Submissions", submission);
  team.totalSteps = Number(team.totalSteps || 0) + Number(submission.stepCount || 0);
  team.lastAiCaptainFeedback = buildAICaptainFeedback_(team, submission);
  applyDelta_(team, delta);
  writeObjectAtRow_("Teams", teamRow.row, team);
  appendObject_("ScoresLog", {
    logId: makeId_("L"),
    createdAt: now,
    teamId: team.teamId,
    sourceType: "submission",
    sourceId: submission.submissionId,
    staminaDelta: delta.stamina,
    scoutDelta: delta.scout,
    cleanseDelta: delta.cleanse,
    wisdomDelta: delta.wisdom,
    influenceDelta: delta.influence,
    note: "第 " + week + " 週任務回報",
    stepDelta: submission.stepCount,
    mapProgressDelta: 0,
    spiritEnergyType: mainDeltaKey_(delta),
    unlockEvent: ""
  });

  updateTeamProgress_(team.teamId);
  return { submission: submission, team: getTeam_(team.teamId).team, delta: delta };
}

function validateMissionPayload_(payload, mission) {
  var taskType = missionTaskType_(mission);
  if (taskType === "team") return;

  if (!text_(payload.areaName)) throw new Error("請選擇調查地點");
  if (!text_(payload.problemFound)) throw new Error(taskType === "advocate" ? "請填寫主要行動或發現" : "請填寫發現問題");
  if (!text_(payload.amountLevel)) throw new Error("請選擇數量感受");
  if (!text_(payload.possibleReason)) throw new Error("請填寫可能原因");
  if (!text_(payload.improvementIdea)) throw new Error(taskType === "advocate" ? "請填寫宣導或改善行動" : "請填寫改善想法");

  if (taskType === "classify") {
    if (!text_(payload.identifiedItem)) throw new Error("請填寫辨識物品");
    if (!text_(payload.classificationResult || payload.classificationType)) throw new Error("請選擇垃圾分類結果");
    if (!text_(payload.classificationReason)) throw new Error("請填寫分類理由");
  }
}

function missionTaskType_(mission) {
  if (mission && mission.taskType) return String(mission.taskType);
  var week = Number((mission || {}).week || 0);
  if (week === 1) return "team";
  if (week === 3) return "classify";
  if (week === 4) return "advocate";
  return "explore";
}

function missionAreaName_(mission) {
  var node = findObjectByKey_("MapNodes", "mapNodeId", (mission || {}).mapNodeId);
  return (node && node.areaName) || "校園";
}

function defaultProblemForMission_(taskType) {
  if (taskType === "team") return "完成淨芽小隊集結";
  if (taskType === "advocate") return "整理小隊守護行動與發表重點";
  return "";
}

function defaultReasonForMission_(taskType) {
  if (taskType === "team") return "小隊已完成角色分工與任務約定";
  return "";
}

function defaultImprovementForMission_(taskType) {
  if (taskType === "team") return "一起遵守安全提醒，開始校園健康冒險";
  return "";
}

function createResultCard_(payload) {
  var teamRow = findRowByKey_("Teams", "teamId", payload.teamId);
  if (!teamRow) throw new Error("小隊不存在");
  var team = teamRow.object;

  if (!text_(payload.mainArea)) throw new Error("請選擇主要調查地點");
  if (!text_(payload.mainFinding)) throw new Error("請填寫主要發現");
  if (!text_(payload.mainReason)) throw new Error("請填寫可能原因");
  if (!text_(payload.proposal)) throw new Error("請填寫改善提案");
  if (!text_(payload.slogan)) throw new Error("請填寫宣導口號");
  if (!text_(payload.commitment)) throw new Error("請填寫行動承諾");

  var now = now_();
  var existingRow = findRowByKey_("Results", "teamId", team.teamId);
  var submissions = getTeamSubmissions_(team.teamId);
  var result = {
    resultId: existingRow ? existingRow.object.resultId : makeId_("R"),
    createdAt: existingRow ? existingRow.object.createdAt : now,
    teamId: team.teamId,
    reportTitle: team.teamName + " 淨芽小隊守護報告",
    mainArea: text_(payload.mainArea),
    mainFinding: text_(payload.mainFinding),
    mainReason: text_(payload.mainReason),
    proposal: text_(payload.proposal),
    slogan: text_(payload.slogan),
    commitment: text_(payload.commitment),
    finalStage: "守護級",
    totalSteps: Number(team.totalSteps || 0),
    unlockedSpirits: spiritNamesFromIds_(ensureArray_(team.unlockedSpirits)).join("、"),
    exploredAreas: unique_(submissions.map(function(item) { return item.areaName; }).filter(Boolean)).join("、"),
    classificationSummary: buildClassificationSummary_(submissions),
    mapProgress: Number(team.mapProgress || 0),
    aiCaptainSummary: text_(payload.aiCaptainSummary) || buildAICaptainReportSummary_(team, payload),
    summaryText: buildResultSummary_(team, payload)
  };

  if (existingRow) {
    writeObjectAtRow_("Results", existingRow.row, result);
  } else {
    appendObject_("Results", result);
    var delta = calculateResultDelta_(result);
    applyDelta_(team, delta);
    writeObjectAtRow_("Teams", teamRow.row, team);
    appendObject_("ScoresLog", {
      logId: makeId_("L"),
      createdAt: now,
      teamId: team.teamId,
      sourceType: "finalResult",
      sourceId: result.resultId,
      staminaDelta: delta.stamina,
      scoutDelta: delta.scout,
      cleanseDelta: delta.cleanse,
      wisdomDelta: delta.wisdom,
      influenceDelta: delta.influence,
      note: "完成淨芽小隊守護報告",
      stepDelta: 0,
      mapProgressDelta: 100 - Number(team.mapProgress || 0),
      spiritEnergyType: "influence",
      unlockEvent: "守護級"
    });
  }

  updateTeamProgress_(team.teamId);
  return { result: result, team: getTeam_(team.teamId).team };
}

function getTeamSubmissions_(teamId) {
  return readRows_("Submissions")
    .filter(function(item) { return item.teamId === teamId; })
    .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
}

function getDashboardData_() {
  var teams = readRows_("Teams").map(function(team) { return decorateTeam_(team); });
  var submissions = readRows_("Submissions").sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  var classifiedSubmissions = submissions.filter(function(item) {
    return item.classificationResult || item.classificationType;
  });
  var results = getAllResults_().results;
  var totalSteps = submissions.reduce(function(sum, item) {
    return sum + Number(item.stepCount || 0);
  }, 0);

  return {
    summary: {
      teamCount: teams.length,
      submissionCount: submissions.length,
      resultCount: results.length,
      totalSteps: totalSteps,
      averageSteps: teams.length ? Math.round(totalSteps / teams.length) : 0,
      classificationCount: classifiedSubmissions.length,
      averageMapProgress: teams.length ? Math.round(teams.reduce(function(sum, team) {
        return sum + Number(team.mapProgress || 0);
      }, 0) / teams.length) : 0,
      topArea: topName_(countBy_(submissions, "areaName")),
      topTrash: topName_(countTrashTypes_(submissions)),
      topClassification: topName_(countBy_(classifiedSubmissions, "classificationResult"))
    },
    teams: teams,
    submissions: submissions,
    results: results,
    weekCounts: entriesFromMap_(countBy_(submissions, "week")).map(function(item) {
      return { name: "第 " + item.name + " 週", count: item.count };
    }),
    areaCounts: entriesFromMap_(countBy_(submissions, "areaName")),
    trashCounts: entriesFromMap_(countTrashTypes_(submissions)),
    classificationCounts: entriesFromMap_(countBy_(classifiedSubmissions, "classificationResult")),
    routeCounts: entriesFromMap_(countBy_(submissions, "routeName")),
    levelCounts: entriesFromMap_(countBy_(teams, "teamLevelName")),
    classCounts: entriesFromMap_(countBy_(teams, "className")),
    latestSubmissions: submissions.slice(0, 8)
  };
}

function getStats_() {
  var submissions = readRows_("Submissions");
  var classifiedSubmissions = submissions.filter(function(item) {
    return item.classificationResult || item.classificationType;
  });
  var teams = readRows_("Teams").map(function(team) { return decorateTeam_(team); });

  return {
    hotspotRanking: entriesFromMap_(countBy_(submissions, "areaName")),
    trashRanking: entriesFromMap_(countTrashTypes_(submissions)),
    classificationRanking: entriesFromMap_(countBy_(classifiedSubmissions, "classificationResult")),
    routeRanking: entriesFromMap_(countBy_(submissions, "routeName")),
    stepRanking: teams
      .map(function(team) {
        return { name: team.className + " " + team.groupNo + " " + team.teamName, count: Number(team.totalSteps || 0) };
      })
      .sort(function(a, b) { return b.count - a.count; }),
    levelRanking: entriesFromMap_(countBy_(teams, "teamLevelName")),
    reasons: submissions.map(function(item) { return item.possibleReason; }).filter(Boolean),
    improvements: submissions.map(function(item) { return item.improvementIdea; }).filter(Boolean),
    teamScores: teams.map(function(team) {
      return {
        teamId: team.teamId,
        className: team.className,
        groupNo: team.groupNo,
        teamName: team.teamName,
        total: Number(team.stamina || 0) + Number(team.scout || 0) + Number(team.cleanse || 0) + Number(team.wisdom || 0) + Number(team.influence || 0),
        stage: team.stage,
        teamLevelName: team.teamLevelName,
        totalSteps: team.totalSteps
      };
    }).sort(function(a, b) {
      return b.total - a.total;
    }),
    submissions: submissions
  };
}

function getAllResults_() {
  var teams = readRows_("Teams");
  var results = readRows_("Results").map(function(result) {
    var team = teams.filter(function(item) { return item.teamId === result.teamId; })[0];
    var enriched = Object.assign({}, result);
    enriched.team = team ? decorateTeam_(team) : null;
    return enriched;
  });
  return { results: results };
}

function updateSettings_(payload) {
  var updates = {};
  if (payload.currentWeek) updates.currentWeek = text_(payload.currentWeek);
  if (payload.newTeacherCode) updates.teacherCode = text_(payload.newTeacherCode);

  Object.keys(updates).forEach(function(key) {
    var row = findRowByKey_("Settings", "key", key);
    if (row) {
      row.object.value = updates[key];
      writeObjectAtRow_("Settings", row.row, row.object);
    } else {
      appendObject_("Settings", { key: key, value: updates[key], note: "" });
    }
  });

  return { settings: settingsObject_() };
}

function updateTeamProgress_(teamId) {
  var row = findRowByKey_("Teams", "teamId", teamId);
  if (!row) return null;

  var team = row.object;
  var submissions = getTeamSubmissions_(teamId);
  var result = findObjectByKey_("Results", "teamId", teamId);
  var badges = {};
  parseBadges_(team.badges).forEach(function(badge) { badges[badge] = true; });
  badges["淨芽集結徽章"] = true;

  var level = 1;
  var stage = "萌芽級";
  var completedNodes = {};
  ensureArray_(team.completedMapNodes).forEach(function(nodeId) { completedNodes[nodeId] = true; });
  completedNodes.node_base = true;
  if (submissions.some(function(item) { return Number(item.week) === 2; })) {
    level = Math.max(level, 2);
    stage = "成長級";
    completedNodes.node_playground = true;
    badges["校園探索徽章"] = true;
    badges["出發徽章"] = true;
  }
  if (submissions.some(function(item) { return Number(item.week) === 3; })) {
    level = Math.max(level, 3);
    stage = "茁壯級";
    completedNodes.node_classify = true;
    badges["熱點分析徽章"] = true;
  }
  submissions.forEach(function(submission) {
    if (submission.mapNodeId) completedNodes[submission.mapNodeId] = true;
    var target = stepTargetValue_(submission.stepTarget, settingsObject_().defaultStepTarget, 800);
    if (target > 0 && Number(submission.stepCount || 0) >= target) {
      badges["步行能量徽章"] = true;
    }
    if (submission.identifiedItem || submission.aiGuessNote) badges["垃圾辨識徽章"] = true;
    if (submission.classificationResult && submission.classificationReason) badges["分類達人徽章"] = true;
    if (submission.reflection) badges["團隊合作徽章"] = true;
    if (submission.aiCaptainHintUsed) badges["AI 智慧徽章"] = true;
  });
  if (submissions.some(function(item) { return text_(item.improvementIdea); })) {
    badges["淨化提案徽章"] = true;
  }
  if (result) {
    level = 4;
    stage = "守護級";
    completedNodes.node_guardian = true;
    badges["校園守護徽章"] = true;
    if (text_(result.slogan)) badges["守護倡議徽章"] = true;
  }
  var completedNodeIds = Object.keys(completedNodes);
  if (completedNodeIds.length >= 2) badges["地圖開拓徽章"] = true;

  team.stage = stage;
  team.teamLevel = level;
  team.teamLevelName = stage;
  team.completedMapNodes = completedNodeIds;
  team.mapProgress = Math.min(100, Math.round((completedNodeIds.length / Math.max(1, activeRows_(readRows_("MapNodes")).length)) * 100));
  team.badges = Object.keys(badges);
  team.lastUpdated = now_();
  writeObjectAtRow_("Teams", row.row, team);
  return team;
}

function decorateTeam_(team) {
  var copy = Object.assign({}, team);
  copy.stamina = Number(copy.stamina || 0);
  copy.scout = Number(copy.scout || 0);
  copy.cleanse = Number(copy.cleanse || 0);
  copy.wisdom = Number(copy.wisdom || 0);
  copy.influence = Number(copy.influence || 0);
  copy.badges = parseBadges_(copy.badges);
  copy.totalSteps = Number(copy.totalSteps || 0);
  copy.leaderSpiritId = copy.leaderSpiritId || copy.selectedPetId;
  copy.teamLevel = Number(copy.teamLevel || teamLevelFromStage_(copy.stage));
  copy.teamLevelName = copy.teamLevelName || copy.stage || "萌芽級";
  copy.mapProgress = Number(copy.mapProgress || 0);
  copy.unlockedSpirits = ensureArray_(copy.unlockedSpirits);
  if (!copy.unlockedSpirits.length) {
    copy.unlockedSpirits = ["spirit_green", "spirit_water", "spirit_sun", "spirit_purple", "spirit_heart", "spirit_potato"];
  }
  copy.completedMapNodes = ensureArray_(copy.completedMapNodes);
  copy.lastAiCaptainFeedback = copy.lastAiCaptainFeedback || "";
  copy.pet = findObjectByKey_("Pets", "petId", copy.leaderSpiritId) || findObjectByKey_("Pets", "petId", copy.selectedPetId);
  copy.submissions = getTeamSubmissions_(copy.teamId);
  copy.result = findObjectByKey_("Results", "teamId", copy.teamId);
  copy.completedWeeks = completedWeeks_(copy);
  return copy;
}

function completedWeeks_(team) {
  var weeks = { 1: true };
  getTeamSubmissions_(team.teamId).forEach(function(submission) {
    weeks[Number(submission.week)] = true;
  });
  if (findObjectByKey_("Results", "teamId", team.teamId)) {
    weeks[4] = true;
  }
  return Object.keys(weeks).map(Number);
}

function calculateSubmissionDelta_(submission) {
  if (Number(submission.week) === 1) {
    return { stamina: 0, scout: 0, cleanse: 0, wisdom: 0, influence: 5 };
  }
  var stepBonus = Math.min(10, Math.floor(Number(submission.stepCount || 0) / 200));
  return {
    stamina: (submission.areaName ? 5 : 0) + stepBonus,
    scout: (submission.routeName ? 5 : 0) + (submission.problemFound ? 10 : 0) + (submission.photoNote || submission.photoUrl ? 5 : 0),
    cleanse: (submission.classificationResult ? 5 : 0) + (submission.improvementIdea ? 10 : 0),
    wisdom: (submission.trashTypes.length ? 5 : 0) + (submission.identifiedItem ? 5 : 0) + (submission.classificationReason ? 5 : 0) + (submission.possibleReason ? 10 : 0),
    influence: submission.reflection ? 5 : 0
  };
}

function calculateResultDelta_(result) {
  return {
    stamina: 0,
    scout: result.mainFinding ? 10 : 0,
    cleanse: result.proposal ? 15 : 0,
    wisdom: result.mainReason ? 10 : 0,
    influence: (result.slogan ? 15 : 0) + (result.commitment ? 10 : 0)
  };
}

function applyDelta_(team, delta) {
  team.stamina = Number(team.stamina || 0) + Number(delta.stamina || 0);
  team.scout = Number(team.scout || 0) + Number(delta.scout || 0);
  team.cleanse = Number(team.cleanse || 0) + Number(delta.cleanse || 0);
  team.wisdom = Number(team.wisdom || 0) + Number(delta.wisdom || 0);
  team.influence = Number(team.influence || 0) + Number(delta.influence || 0);
  team.lastUpdated = now_();
}

function buildResultSummary_(team, result) {
  return team.teamName + " 在" + result.mainArea + "發現「" + result.mainFinding + "」，分析原因可能是" + result.mainReason + "。小隊提出「" + result.proposal + "」，並用「" + result.slogan + "」提醒大家一起守護校園。";
}

function buildClassificationSummary_(submissions) {
  var parts = submissions
    .filter(function(item) { return item.classificationResult || item.identifiedItem; })
    .map(function(item) {
      return (item.identifiedItem || ensureArray_(item.trashTypes)[0] || "垃圾") + "：" + (item.classificationResult || "未分類");
    });
  return parts.length ? parts.join("；") : "尚未完成垃圾辨識分類";
}

function buildAICaptainFeedback_(team, submission) {
  var classificationText = submission.classificationResult ? "，並判斷它屬於「" + submission.classificationResult + "」" : "";
  return team.teamName + " 完成了 " + (submission.areaName || "校園") + " 的探索任務！你們累積了 " + Number(submission.stepCount || 0) + " 步，發現了「" + (submission.identifiedItem || submission.problemFound || "環境問題") + "」" + classificationText + "。紫寶隊長提醒：下一步可以想想問題為什麼會出現在這裡，以及怎麼讓它下次不要再出現。";
}

function buildAICaptainReportSummary_(team, result) {
  return "紫寶隊長回饋：" + team.teamName + " 已整理出主要發現與改善提案，可以把「" + (result.slogan || "一起守護校園") + "」作為宣導重點，邀請更多同學一起行動。";
}

function energyLabels_() {
  return {
    stamina: "健康能量",
    scout: "探索能量",
    cleanse: "淨化能量",
    wisdom: "智慧能量",
    influence: "守護能量"
  };
}

function teamLevelFromStage_(stage) {
  var rank = ["萌芽級", "成長級", "茁壯級", "守護級"];
  var index = rank.indexOf(String(stage || ""));
  return index >= 0 ? index + 1 : 1;
}

function numberValue_(value) {
  var numeric = Number(value || 0);
  return isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function stepTargetValue_() {
  for (var i = 0; i < arguments.length; i += 1) {
    var value = arguments[i];
    if (value !== undefined && value !== null && value !== "") return numberValue_(value);
  }
  return 0;
}

function mainDeltaKey_(delta) {
  return ["stamina", "scout", "cleanse", "wisdom", "influence"].reduce(function(best, key) {
    return Number(delta[key] || 0) > Number(delta[best] || 0) ? key : best;
  }, "stamina");
}

function unique_(items) {
  var seen = {};
  return items.filter(function(item) {
    var key = String(item || "");
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function spiritNamesFromIds_(ids) {
  var selected = ensureArray_(ids);
  if (!selected.length) {
    selected = ["spirit_green", "spirit_water", "spirit_sun", "spirit_purple", "spirit_heart", "spirit_potato"];
  }
  return selected.map(function(id) {
    var spirit = findObjectByKey_("Pets", "petId", id);
    return spirit ? spirit.petName : id;
  }).filter(Boolean);
}

function prepareSheet_(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS[sheetName].length).setValues([HEADERS[sheetName]]);
    sheet.setFrozenRows(1);
    return;
  }
  ensureSheetColumns_(sheetName, sheet);
}

function seedSheet_(sheetName, rows) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var key = primaryKeyForSheet_(sheetName);
  if (!key) {
    if (sheet.getLastRow() > 1) return;
    rows.forEach(function(row) {
      appendObject_(sheetName, row);
    });
    return;
  }

  rows.forEach(function(row) {
    var existing = findRowByKey_(sheetName, key, row[key]);
    if (existing) {
      if (shouldRefreshDefaultRow_(sheetName)) {
        writeObjectAtRow_(sheetName, existing.row, Object.assign({}, existing.object, row));
      }
      return;
    }
    appendObject_(sheetName, row);
  });
}

function ensureSheetColumns_(sheetName, sheet) {
  var expected = HEADERS[sheetName];
  var lastColumn = sheet.getLastColumn();
  if (!lastColumn) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    sheet.setFrozenRows(1);
    return;
  }

  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(header) {
    return String(header || "").trim();
  });
  var missing = expected.filter(function(header) {
    return headers.indexOf(header) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, lastColumn + 1, 1, missing.length).setValues([missing]);
  }
  sheet.setFrozenRows(1);
}

function primaryKeyForSheet_(sheetName) {
  return {
    Settings: "key",
    Classes: "classId",
    Areas: "areaId",
    Pets: "petId",
    Missions: "missionId",
    MapNodes: "mapNodeId"
  }[sheetName] || "";
}

function shouldRefreshDefaultRow_(sheetName) {
  return ["Pets", "Missions", "MapNodes"].indexOf(sheetName) !== -1;
}

function readRows_(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  return values.filter(function(row) {
    return row.some(function(cell) { return cell !== ""; });
  }).map(function(row) {
    var object = {};
    headers.forEach(function(header, index) {
      object[header] = parseCell_(header, row[index]);
    });
    return object;
  });
}

function appendObject_(sheetName, object) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var headers = HEADERS[sheetName];
  sheet.appendRow(headers.map(function(header) {
    return serializeCell_(object[header]);
  }));
}

function writeObjectAtRow_(sheetName, rowNumber, object) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var headers = HEADERS[sheetName];
  var values = headers.map(function(header) {
    return serializeCell_(object[header]);
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
}

function findObjectByKey_(sheetName, key, value) {
  var row = findRowByKey_(sheetName, key, value);
  return row ? row.object : null;
}

function findRowByKey_(sheetName, key, value) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var keyIndex = headers.indexOf(key);
  if (keyIndex === -1) return null;

  for (var i = 1; i < values.length; i += 1) {
    if (String(values[i][keyIndex]) === String(value)) {
      var object = {};
      headers.forEach(function(header, index) {
        object[header] = parseCell_(header, values[i][index]);
      });
      return { row: i + 1, object: object };
    }
  }
  return null;
}

function settingsObject_() {
  var settings = {};
  readRows_("Settings").forEach(function(row) {
    settings[row.key] = row.value;
  });
  return settings;
}

function activeRows_(rows) {
  return rows.filter(function(row) {
    return row.active !== false && String(row.active).toLowerCase() !== "false";
  });
}

function countBy_(rows, field) {
  return rows.reduce(function(map, row) {
    var name = String(row[field] || "未填寫");
    map[name] = (map[name] || 0) + 1;
    return map;
  }, {});
}

function countTrashTypes_(rows) {
  return rows.reduce(function(map, row) {
    ensureArray_(row.trashTypes).forEach(function(type) {
      map[type] = (map[type] || 0) + 1;
    });
    return map;
  }, {});
}

function entriesFromMap_(map) {
  return Object.keys(map).map(function(name) {
    return { name: name, count: map[name] };
  }).sort(function(a, b) {
    if (b.count !== a.count) return b.count - a.count;
    return String(a.name).localeCompare(String(b.name), "zh-Hant");
  });
}

function topName_(map) {
  var entries = entriesFromMap_(map);
  return entries.length ? entries[0].name : "";
}

function parsePayload_(e) {
  if (!e || !e.parameter || !e.parameter.payload) return {};
  try {
    return JSON.parse(e.parameter.payload);
  } catch (error) {
    return {};
  }
}

function parseCell_(header, value) {
  if (["badges", "trashTypes", "unlockedSpirits", "completedMapNodes"].indexOf(header) !== -1) return ensureArray_(value);
  if (["active", "scoreApplied", "routeCompleted"].indexOf(header) !== -1) return value === true || String(value).toLowerCase() === "true";
  if (["week", "stamina", "scout", "cleanse", "wisdom", "influence", "staminaDelta", "scoutDelta", "cleanseDelta", "wisdomDelta", "influenceDelta", "stepCount", "stepTarget", "miniChallengeScore", "teamLevel", "mapProgress", "totalSteps", "stepDelta", "mapProgressDelta"].indexOf(header) !== -1) {
    return Number(value || 0);
  }
  return value;
}

function serializeCell_(value) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value);
  }
  return value === undefined || value === null ? "" : value;
}

function ensureArray_(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  try {
    var parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (error) {
    return String(value).split(",").map(function(item) { return item.trim(); }).filter(Boolean);
  }
  return [];
}

function parseBadges_(value) {
  return ensureArray_(value);
}

function makeId_(prefix) {
  return prefix + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss") + Utilities.getUuid().slice(0, 4).toUpperCase();
}

function now_() {
  return new Date().toISOString();
}

function text_(value) {
  return String(value || "").trim();
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
