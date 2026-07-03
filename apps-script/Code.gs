var HEADERS = {
  Settings: ["key", "value", "note"],
  Classes: ["classId", "className", "grade", "active"],
  Areas: ["areaId", "areaName", "description", "active"],
  Pets: ["petId", "petName", "description", "trait", "imageStage1", "imageStage2", "imageStage3", "imageStage4", "active"],
  Teams: ["teamId", "createdAt", "className", "groupNo", "teamName", "selectedPetId", "customPetName", "stage", "stamina", "scout", "cleanse", "wisdom", "influence", "badges", "lastUpdated"],
  Missions: ["missionId", "week", "title", "story", "instruction", "requiredFields", "unlockCondition", "active"],
  Submissions: ["submissionId", "createdAt", "teamId", "className", "groupNo", "week", "missionId", "areaName", "problemFound", "trashTypes", "amountLevel", "possibleReason", "improvementIdea", "photoNote", "photoUrl", "reflection", "scoreApplied"],
  ScoresLog: ["logId", "createdAt", "teamId", "sourceType", "sourceId", "staminaDelta", "scoutDelta", "cleanseDelta", "wisdomDelta", "influenceDelta", "note"],
  Results: ["resultId", "createdAt", "teamId", "mainArea", "mainFinding", "mainReason", "proposal", "slogan", "commitment", "finalStage", "summaryText"]
};

var DEFAULT_ROWS = {
  Settings: [
    { key: "teacherCode", value: "1234", note: "教師管理碼" },
    { key: "currentWeek", value: "1", note: "目前開放週次" },
    { key: "gameTitle", value: "校園綠夥伴：環境復甦任務", note: "遊戲名稱" }
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
    { petId: "pet_leaf_001", petName: "小葉靈", description: "溫和、愛觀察", trait: "偵查值較高", imageStage1: "", imageStage2: "", imageStage3: "", imageStage4: "", active: true },
    { petId: "pet_step_001", petName: "步步獸", description: "活潑、愛探索", trait: "體力值較高", imageStage1: "", imageStage2: "", imageStage3: "", imageStage4: "", active: true },
    { petId: "pet_clean_001", petName: "淨淨鳥", description: "喜歡乾淨", trait: "淨化值較高", imageStage1: "", imageStage2: "", imageStage3: "", imageStage4: "", active: true },
    { petId: "pet_light_001", petName: "亮光鹿", description: "會發現問題", trait: "智慧值較高", imageStage1: "", imageStage2: "", imageStage3: "", imageStage4: "", active: true },
    { petId: "pet_bud_001", petName: "花芽龍", description: "成長速度快", trait: "影響力較高", imageStage1: "", imageStage2: "", imageStage3: "", imageStage4: "", active: true }
  ],
  Missions: [
    { missionId: "M1", week: 1, title: "綠夥伴甦醒", story: "建立小隊，讓綠夥伴知道誰要一起守護校園。", instruction: "選定小隊與綠夥伴後，先預測可能的校園髒亂能量點。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea", unlockCondition: "建立小隊", active: true },
    { missionId: "M2", week: 2, title: "校園偵查任務", story: "走進校園，找出環境問題最明顯的地方。", instruction: "到校園指定區域觀察，記錄垃圾類型、數量感受與可能原因。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea", unlockCondition: "完成第 1 週任務", active: true },
    { missionId: "M3", week: 3, title: "熱點分析任務", story: "把觀察變成判斷，找出問題背後的原因。", instruction: "選定一個熱點，分析常見垃圾與形成原因，提出具體改善想法。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea", unlockCondition: "完成至少一筆偵查回報", active: true },
    { missionId: "M4", week: 4, title: "校園守護任務", story: "把小隊發現整理成可以讓更多人看見的行動。", instruction: "完成宣導口號、行動承諾與成果卡，讓綠夥伴進入守護期。", requiredFields: "areaName,problemFound,trashTypes,amountLevel,possibleReason,improvementIdea", unlockCondition: "完成熱點分析", active: true }
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
  return {
    settings: publicSettings_(),
    classes: activeRows_(readRows_("Classes")),
    areas: activeRows_(readRows_("Areas")),
    pets: activeRows_(readRows_("Pets")),
    missions: activeRows_(readRows_("Missions")).sort(function(a, b) { return Number(a.week) - Number(b.week); })
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
  var selectedPetId = text_(payload.selectedPetId);
  var customPetName = text_(payload.customPetName);

  if (!className) throw new Error("請選擇班級");
  if (!groupNo) throw new Error("請選擇組別");
  if (!teamName) throw new Error("請輸入小隊名稱");
  if (!selectedPetId) throw new Error("請選擇一位綠夥伴");
  if (!customPetName) throw new Error("請輸入綠夥伴名稱");

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
    customPetName: customPetName,
    stage: "種子期",
    stamina: 5,
    scout: 0,
    cleanse: 0,
    wisdom: 0,
    influence: 5,
    badges: ["甦醒徽章"],
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
    note: "建立小隊與命名綠夥伴"
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
  if (!text_(payload.areaName)) throw new Error("請選擇調查地點");
  if (!text_(payload.problemFound)) throw new Error("請填寫發現問題");
  if (!trashTypes.length) throw new Error("請選擇垃圾類型");
  if (!text_(payload.amountLevel)) throw new Error("請選擇數量感受");
  if (!text_(payload.possibleReason)) throw new Error("請填寫可能原因");
  if (!text_(payload.improvementIdea)) throw new Error("請填寫改善想法");

  var now = now_();
  var submission = {
    submissionId: makeId_("S"),
    createdAt: now,
    teamId: team.teamId,
    className: team.className,
    groupNo: team.groupNo,
    week: week,
    missionId: payload.missionId || mission.missionId,
    areaName: text_(payload.areaName),
    problemFound: text_(payload.problemFound),
    trashTypes: trashTypes,
    amountLevel: text_(payload.amountLevel),
    possibleReason: text_(payload.possibleReason),
    improvementIdea: text_(payload.improvementIdea),
    photoNote: text_(payload.photoNote),
    photoUrl: text_(payload.photoUrl),
    reflection: text_(payload.reflection),
    scoreApplied: true
  };

  var delta = calculateSubmissionDelta_(submission);
  appendObject_("Submissions", submission);
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
    note: "第 " + week + " 週任務回報"
  });

  updateTeamProgress_(team.teamId);
  return { submission: submission, team: getTeam_(team.teamId).team, delta: delta };
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
  var result = {
    resultId: existingRow ? existingRow.object.resultId : makeId_("R"),
    createdAt: existingRow ? existingRow.object.createdAt : now,
    teamId: team.teamId,
    mainArea: text_(payload.mainArea),
    mainFinding: text_(payload.mainFinding),
    mainReason: text_(payload.mainReason),
    proposal: text_(payload.proposal),
    slogan: text_(payload.slogan),
    commitment: text_(payload.commitment),
    finalStage: "守護期",
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
      note: "完成成果卡"
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
  var results = getAllResults_().results;

  return {
    summary: {
      teamCount: teams.length,
      submissionCount: submissions.length,
      resultCount: results.length,
      topArea: topName_(countBy_(submissions, "areaName")),
      topTrash: topName_(countTrashTypes_(submissions))
    },
    teams: teams,
    submissions: submissions,
    results: results,
    weekCounts: entriesFromMap_(countBy_(submissions, "week")).map(function(item) {
      return { name: "第 " + item.name + " 週", count: item.count };
    }),
    areaCounts: entriesFromMap_(countBy_(submissions, "areaName")),
    trashCounts: entriesFromMap_(countTrashTypes_(submissions)),
    classCounts: entriesFromMap_(countBy_(teams, "className")),
    latestSubmissions: submissions.slice(0, 8)
  };
}

function getStats_() {
  var submissions = readRows_("Submissions");
  var teams = readRows_("Teams").map(function(team) { return decorateTeam_(team); });

  return {
    hotspotRanking: entriesFromMap_(countBy_(submissions, "areaName")),
    trashRanking: entriesFromMap_(countTrashTypes_(submissions)),
    reasons: submissions.map(function(item) { return item.possibleReason; }).filter(Boolean),
    improvements: submissions.map(function(item) { return item.improvementIdea; }).filter(Boolean),
    teamScores: teams.map(function(team) {
      return {
        teamId: team.teamId,
        className: team.className,
        groupNo: team.groupNo,
        teamName: team.teamName,
        total: Number(team.stamina || 0) + Number(team.scout || 0) + Number(team.cleanse || 0) + Number(team.wisdom || 0) + Number(team.influence || 0),
        stage: team.stage
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
  badges["甦醒徽章"] = true;

  var stage = "種子期";
  if (submissions.some(function(item) { return Number(item.week) === 2; })) {
    stage = "幼體期";
    badges["校園偵查徽章"] = true;
  }
  if (submissions.some(function(item) { return Number(item.week) === 3; })) {
    stage = "成長期";
    badges["熱點分析徽章"] = true;
  }
  if (submissions.some(function(item) { return text_(item.improvementIdea); })) {
    badges["改善提案徽章"] = true;
  }
  if (result) {
    stage = "守護期";
    badges["校園守護徽章"] = true;
    if (text_(result.slogan)) badges["影響力徽章"] = true;
  }

  team.stage = stage;
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
  copy.pet = findObjectByKey_("Pets", "petId", copy.selectedPetId);
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
  return {
    stamina: submission.areaName ? 5 : 0,
    scout: submission.problemFound ? 10 : 0,
    cleanse: submission.improvementIdea ? 10 : 0,
    wisdom: (submission.trashTypes.length ? 5 : 0) + (submission.possibleReason ? 10 : 0),
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

function prepareSheet_(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS[sheetName].length).setValues([HEADERS[sheetName]]);
    sheet.setFrozenRows(1);
  }
}

function seedSheet_(sheetName, rows) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet.getLastRow() > 1) return;
  rows.forEach(function(row) {
    appendObject_(sheetName, row);
  });
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
  if (header === "badges" || header === "trashTypes") return ensureArray_(value);
  if (header === "active" || header === "scoreApplied") return value === true || String(value).toLowerCase() === "true";
  if (["week", "stamina", "scout", "cleanse", "wisdom", "influence", "staminaDelta", "scoutDelta", "cleanseDelta", "wisdomDelta", "influenceDelta"].indexOf(header) !== -1) {
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
