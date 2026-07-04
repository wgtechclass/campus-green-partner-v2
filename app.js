(() => {
  const API_URL = (window.GREEN_PARTNER_API_URL || "").trim();
  const STORAGE_KEY = "greenPartner_mvp_state_v1";
  const TEAM_ID_KEY = "greenPartner_teamId";
  const CLASS_KEY = "greenPartner_className";
  const GROUP_KEY = "greenPartner_groupNo";
  const TEAM_NAME_KEY = "greenPartner_teamName";
  const TEACHER_CODE_KEY = "greenPartner_teacherCode";
  const API_RETRY_LIMIT = 2;
  const API_RETRY_DELAY_MS = 900;
  const API_TIMEOUT_MS = 12000;

  const app = document.querySelector("#app");
  const toast = document.querySelector("#toast");
  const abilityOrder = ["stamina", "scout", "cleanse", "wisdom", "influence"];
  const abilityLabels = {
    stamina: "健康能量",
    scout: "探索能量",
    cleanse: "淨化能量",
    wisdom: "智慧能量",
    influence: "守護能量"
  };
  const gameDisplayName = "淨芽小隊：校園健康冒險";
  const formalProjectName = "校園綠夥伴：環境復甦任務";
  const stageRank = ["萌芽級", "成長級", "茁壯級", "守護級"];
  const teamLevels = [
    { level: 1, name: "萌芽級", condition: "建立淨芽小隊" },
    { level: 2, name: "成長級", condition: "完成校園健康探索" },
    { level: 3, name: "茁壯級", condition: "完成垃圾辨識與分類" },
    { level: 4, name: "守護級", condition: "完成守護報告" }
  ];
  const groupOptions = Array.from({ length: 8 }, (_, index) => `第${index + 1}組`);
  const amountOptions = ["少量", "中等", "很多"];
  const classificationOptions = ["一般垃圾", "資源回收", "廚餘", "有害垃圾", "不確定，需要查詢"];
  const spiritImageAssets = {
    spirit_green: "assets/spirits/green.png",
    spirit_water: "assets/spirits/water.png",
    spirit_sun: "assets/spirits/sun.png",
    spirit_purple: "assets/spirits/purple.png",
    spirit_heart: "assets/spirits/heart.png",
    spirit_potato: "assets/spirits/potato.png"
  };
  const uiAssets = {
    aiCaptain: "assets/ui/ai-captain.png",
    campusBase: "assets/ui/campus-base.png",
    campusMap: "assets/ui/campus-map.svg",
    missionLoop: "assets/ui/mission-loop.svg"
  };
  const trashOptions = [
    "紙類",
    "塑膠袋",
    "飲料杯",
    "吸管或杯套",
    "食物包裝",
    "鉛筆屑或橡皮擦屑",
    "寶特瓶",
    "其他"
  ];
  const defaultSpirits = [
    { petId: "spirit_green", petName: "綠芽", description: "擅長發現垃圾與守護校園環境。", trait: "發現垃圾、綠化校園", spiritRole: "環境守衛", primaryEnergy: "scout", secondaryEnergy: "cleanse", colorTheme: "green", icon: "芽", imageStage1: spiritImageAssets.spirit_green, active: true },
    { petId: "spirit_water", petName: "水滴", description: "提醒大家補充水分，保持探索活力。", trait: "補充能量、健康提醒", spiritRole: "活力守衛", primaryEnergy: "stamina", secondaryEnergy: "", colorTheme: "blue", icon: "水", imageStage1: spiritImageAssets.spirit_water, active: true },
    { petId: "spirit_sun", petName: "陽光", description: "鼓勵大家走出教室，累積健康能量。", trait: "鼓勵走動、累積步數", spiritRole: "運動守衛", primaryEnergy: "stamina", secondaryEnergy: "influence", colorTheme: "yellow", icon: "光", imageStage1: spiritImageAssets.spirit_sun, active: true },
    { petId: "spirit_purple", petName: "紫寶", description: "像 AI 小隊長一樣，協助分析與提醒。", trait: "AI 分析、路線建議", spiritRole: "智慧守衛", primaryEnergy: "wisdom", secondaryEnergy: "", colorTheme: "purple", icon: "智", imageStage1: spiritImageAssets.spirit_purple, active: true },
    { petId: "spirit_heart", petName: "心心", description: "鼓勵團隊合作，讓小隊更有凝聚力。", trait: "鼓勵合作、團隊支持", spiritRole: "情緒守衛", primaryEnergy: "influence", secondaryEnergy: "", colorTheme: "pink", icon: "心", imageStage1: spiritImageAssets.spirit_heart, active: true },
    { petId: "spirit_potato", petName: "阿栗", description: "擅長垃圾分類與資源回收挑戰。", trait: "垃圾分類、資源回收", spiritRole: "回收守衛", primaryEnergy: "cleanse", secondaryEnergy: "wisdom", colorTheme: "brown", icon: "栗", imageStage1: spiritImageAssets.spirit_potato, active: true }
  ];
  const defaultMapNodes = [
    { mapNodeId: "node_base", nodeName: "教室基地", areaName: "教室外", week: 1, routeName: "小隊基地集結", stepTarget: 0, description: "建立淨芽小隊，認識六位淨芽精靈。", unlockCondition: "建立小隊", icon: "基地", active: true },
    { mapNodeId: "node_playground", nodeName: "操場探索區", areaName: "操場", week: 2, routeName: "操場東側探索路線", stepTarget: 800, description: "走出教室，累積步數並觀察操場周邊。", unlockCondition: "完成第 1 週任務", icon: "步", active: true },
    { mapNodeId: "node_corridor", nodeName: "走廊川堂偵查區", areaName: "走廊", week: 2, routeName: "走廊與川堂偵查路線", stepTarget: 800, description: "找出人流較多處的垃圾或髒亂能量。", unlockCondition: "完成第 2 週探索", icon: "查", active: true },
    { mapNodeId: "node_classify", nodeName: "分類挑戰區", areaName: "飲水機旁", week: 3, routeName: "分類挑戰路線", stepTarget: 600, description: "辨識垃圾並判斷分類方式。", unlockCondition: "完成垃圾辨識紀錄", icon: "分", active: true },
    { mapNodeId: "node_guardian", nodeName: "守護發表區", areaName: "川堂", week: 4, routeName: "守護報告路線", stepTarget: 400, description: "整理發現、提出提案，完成守護報告。", unlockCondition: "完成第 3 週分析", icon: "守", active: true }
  ];

  let teacherSessionCode = safeSessionStorageGet(TEACHER_CODE_KEY);
  let state = loadState();
  if (API_URL) delete state.settings.teacherCode;
  let renderToken = 0;

  document.querySelector("#clearTeamButton").addEventListener("click", () => {
    setCurrentTeam(null);
    showToast("已清除這台裝置的小隊記錄");
    render();
  });

  app.innerHTML = renderLoading();
  window.addEventListener("hashchange", render);
  hydrateInitialData().then(render).catch((error) => {
    showToast(error.message || "資料同步較慢，先使用預設設定");
    render();
  });

  function makeDefaultState() {
    return {
      settings: {
        teacherCode: "1234",
        currentWeek: "1",
        gameTitle: formalProjectName,
        formalProjectName,
        gameDisplayName,
        defaultStepTarget: "800",
        aiCaptainName: "紫寶隊長",
        enableManualSteps: "true",
        enableClassificationChallenge: "true"
      },
      classes: [
        { classId: "C501", className: "五年一班", grade: "五年級", active: true },
        { classId: "C502", className: "五年二班", grade: "五年級", active: true },
        { classId: "C601", className: "六年一班", grade: "六年級", active: true },
        { classId: "C602", className: "六年二班", grade: "六年級", active: true }
      ],
      areas: [
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
      pets: defaultSpirits.map((spirit) => ({ ...spirit })),
      missions: [
        {
          missionId: "M1",
          week: 1,
          title: "淨芽小隊集結",
          story: "建立淨芽小隊，選出隊長精靈，啟動校園健康冒險。",
          instruction: "認識六位淨芽精靈，完成小隊基地集結。",
          mapNodeId: "node_base",
          routeName: "小隊基地集結",
          stepTarget: 0,
          taskType: "team",
          aiCaptainHint: "先確認小隊名稱與隊長精靈，之後每次探索都要互相提醒安全。",
          unlockCondition: "建立小隊",
          active: true
        },
        {
          missionId: "M2",
          week: 2,
          title: "校園健康探索",
          story: "走出教室，累積步數與探索能量，找出校園環境問題。",
          instruction: "完成指定路線探索，記錄步數、地點與發現。",
          mapNodeId: "node_playground",
          routeName: "操場東側探索路線",
          stepTarget: 800,
          taskType: "explore",
          aiCaptainHint: "走路時請注意安全，也記得觀察垃圾容易出現的位置。",
          unlockCondition: "完成第 1 週任務",
          active: true
        },
        {
          missionId: "M3",
          week: 3,
          title: "垃圾辨識與分類挑戰",
          story: "把觀察變成判斷，完成垃圾辨識、分類與原因分析。",
          instruction: "選定一個熱點，完成分類結果、分類理由與改善想法。",
          mapNodeId: "node_classify",
          routeName: "分類挑戰路線",
          stepTarget: 600,
          taskType: "classify",
          aiCaptainHint: "分類前先觀察材質與髒污狀態，不確定時可以先寫下理由。",
          unlockCondition: "完成至少一筆偵查回報",
          active: true
        },
        {
          missionId: "M4",
          week: 4,
          title: "校園守護發表",
          story: "整理四週探索成果，完成淨芽小隊守護報告。",
          instruction: "完成宣導口號、行動承諾與守護報告，讓小隊成為守護級。",
          mapNodeId: "node_guardian",
          routeName: "守護報告路線",
          stepTarget: 400,
          taskType: "advocate",
          aiCaptainHint: "改善提案要具體可行，讓其他同學知道可以怎麼一起做到。",
          unlockCondition: "完成熱點分析",
          active: true
        }
      ],
      mapNodes: defaultMapNodes.map((node) => ({ ...node })),
      teams: [],
      submissions: [],
      scoresLog: [],
      results: [],
      currentTeamId: safeStorageGet(TEAM_ID_KEY) || "",
      teacherUnlocked: false
    };
  }

  function loadState() {
    const base = makeDefaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        ...base,
        ...saved,
        settings: { ...base.settings, ...(saved.settings || {}) },
        classes: saved.classes?.length ? saved.classes : base.classes,
        areas: saved.areas?.length ? saved.areas : base.areas,
        pets: isV2SpiritSet(saved.pets) ? saved.pets : base.pets,
        missions: isV2MissionSet(saved.missions) ? saved.missions : base.missions,
        mapNodes: saved.mapNodes?.length ? saved.mapNodes : base.mapNodes,
        teams: saved.teams || [],
        submissions: saved.submissions || [],
        scoresLog: saved.scoresLog || [],
        results: saved.results || [],
        currentTeamId: saved.currentTeamId || safeStorageGet(TEAM_ID_KEY) || "",
        teacherUnlocked: Boolean(saved.teacherUnlocked && teacherSessionCode)
      };
    } catch {
      return base;
    }
  }

  async function hydrateInitialData() {
    const initialData = await api("getInitialData", {}, { retryLimit: 0, timeoutMs: 9000 });
    state.settings = { ...state.settings, ...(initialData.settings || {}) };
    state.classes = initialData.classes?.length ? initialData.classes : state.classes;
    state.areas = initialData.areas?.length ? initialData.areas : state.areas;
    const incomingSpirits = initialData.spirits?.length ? initialData.spirits : initialData.pets;
    state.pets = isV2SpiritSet(incomingSpirits) ? incomingSpirits : state.pets;
    state.missions = isV2MissionSet(initialData.missions) ? initialData.missions : state.missions;
    state.mapNodes = initialData.mapNodes?.length ? initialData.mapNodes : state.mapNodes;
    Object.assign(abilityLabels, initialData.energyLabels || {});
    if (API_URL) delete state.settings.teacherCode;
    saveState();
  }

  function isV2SpiritSet(pets) {
    return Array.isArray(pets) && pets.some((pet) => String(pet.petId || "").startsWith("spirit_"));
  }

  function isV2MissionSet(missions) {
    return Array.isArray(missions) && missions.some((mission) => mission.mapNodeId || mission.stepTarget || mission.aiCaptainHint);
  }

  async function api(action, payload = {}, options = {}) {
    if (!API_URL) {
      return localApi(action, payload);
    }

    const retryLimit = options.retryLimit ?? API_RETRY_LIMIT;
    const timeoutMs = options.timeoutMs ?? API_TIMEOUT_MS;
    let lastError;
    for (let attempt = 0; attempt <= retryLimit; attempt += 1) {
      try {
        return await remoteApi(action, payload, timeoutMs);
      } catch (error) {
        lastError = normalizeApiError(error);
        if (!lastError.retryable || attempt === retryLimit) break;
        await sleep(API_RETRY_DELAY_MS * (attempt + 1));
      }
    }

    throw new Error(lastError?.userMessage || "資料連線暫時不穩，請重新整理後再試");
  }

  async function remoteApi(action, payload, timeoutMs) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    let response;
    let text;

    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload }),
        signal: controller.signal
      });
      text = await response.text();
    } finally {
      window.clearTimeout(timer);
    }

    if (!response.ok) {
      throw makeApiError(`後端連線失敗（${response.status}），請稍後重新整理`, response.status >= 500 || response.status === 429);
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      const isHtml = text.trim().startsWith("<");
      throw makeApiError(
        isHtml ? "資料連線暫時不穩，請重新整理後再試" : "後端回傳格式異常，請重新整理後再試",
        true
      );
    }

    if (!json || typeof json !== "object" || typeof json.success === "undefined") {
      throw makeApiError("後端回傳格式異常，請重新整理後再試", true);
    }

    if (!json.success) {
      throw makeApiError(json.message || "資料處理失敗", false);
    }

    return json.data;
  }

  function normalizeApiError(error) {
    if (error?.userMessage) return error;
    if (error?.name === "AbortError") {
      return makeApiError("資料連線逾時，請重新整理後再試", true);
    }
    if (error instanceof TypeError) {
      return makeApiError("資料連線暫時不穩，請重新整理後再試", true);
    }
    return makeApiError(error?.message || "資料處理失敗", false);
  }

  function makeApiError(message, retryable) {
    const error = new Error(message);
    error.userMessage = message;
    error.retryable = retryable;
    return error;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function localApi(action, payload = {}) {
    switch (action) {
      case "getInitialData":
        return {
          settings: publicSettings(state.settings),
          classes: activeRows(state.classes),
          areas: activeRows(state.areas),
          pets: activeRows(state.pets),
          spirits: activeRows(state.pets),
          missions: activeRows(state.missions),
          mapNodes: activeRows(state.mapNodes || []),
          energyLabels: abilityLabels
        };
      case "getMapNodes":
        return { mapNodes: activeRows(state.mapNodes || []) };
      case "createTeam":
        return createLocalTeam(payload);
      case "getTeam":
        return getLocalTeam(payload.teamId);
      case "getTeamByClassGroup":
        return getLocalTeamByClassGroup(payload.className, payload.groupNo);
      case "submitMission":
        return submitLocalMission(payload);
      case "getTeamSubmissions":
        return getSubmissionsForTeam(payload.teamId);
      case "getDashboardData":
        requireLocalTeacherCode(payload);
        return buildDashboardData();
      case "getStats":
        requireLocalTeacherCode(payload);
        return buildStatsData();
      case "createResultCard":
        return createLocalResultCard(payload);
      case "getAllResults":
        requireLocalTeacherCode(payload);
        return getAllResults();
      case "checkTeacherCode":
        return { ok: String(payload.code || "") === String(state.settings.teacherCode || "1234") };
      case "updateSettings":
        requireLocalTeacherCode(payload);
        if (payload.currentWeek) state.settings.currentWeek = payload.currentWeek;
        if (payload.newTeacherCode) state.settings.teacherCode = payload.newTeacherCode;
        saveState();
        return { settings: publicSettings(state.settings) };
      default:
        throw new Error("找不到這個操作");
    }
  }

  function publicSettings(settings) {
    const { teacherCode, ...visibleSettings } = settings || {};
    return visibleSettings;
  }

  function teacherPayload(payload = {}) {
    return { ...payload, code: teacherSessionCode };
  }

  function requireLocalTeacherCode(payload) {
    if (String(payload.code || "") !== String(state.settings.teacherCode || "1234")) {
      throw new Error("教師管理碼不正確或已失效，請重新登入教師端");
    }
  }

  function createLocalTeam(payload) {
    const className = text(payload.className);
    const groupNo = text(payload.groupNo);
    const teamName = text(payload.teamName);
    const selectedPetId = text(payload.leaderSpiritId || payload.selectedPetId);
    const customPetName = text(payload.customPetName);

    if (!className) throw new Error("請選擇班級");
    if (!groupNo) throw new Error("請選擇組別");
    if (!teamName) throw new Error("請輸入小隊名稱");
    if (!selectedPetId) throw new Error("請選擇一位隊長精靈");
    if (!customPetName) throw new Error("請輸入隊長精靈名稱");

    const duplicate = state.teams.find((team) => (
      team.className === className && team.groupNo === groupNo
    ));
    if (duplicate) {
      throw new Error("這個班級與組別已經有小隊，請使用找回小隊");
    }

    const now = new Date().toISOString();
    const team = {
      teamId: makeId("T"),
      createdAt: now,
      className,
      groupNo,
      teamName,
      selectedPetId,
      leaderSpiritId: selectedPetId,
      customPetName,
      unlockedSpirits: defaultSpirits.map((spirit) => spirit.petId),
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

    state.teams.push(team);
    state.scoresLog.push({
      logId: makeId("L"),
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
      unlockEvent: "淨芽集結徽章"
    });
    saveState();
    return { team: decorateTeam(team) };
  }

  function getLocalTeam(teamId) {
    const team = state.teams.find((item) => item.teamId === teamId);
    if (!team) {
      throw new Error("找不到小隊資料");
    }
    return { team: decorateTeam(team) };
  }

  function getLocalTeamByClassGroup(className, groupNo) {
    const team = state.teams.find((item) => (
      item.className === text(className) && item.groupNo === text(groupNo)
    ));
    if (!team) {
      throw new Error("找不到這個班級組別的小隊");
    }
    return { team: decorateTeam(team) };
  }

  function submitLocalMission(payload) {
    const team = state.teams.find((item) => item.teamId === payload.teamId);
    if (!team) throw new Error("找不到小隊資料");

    const week = Number(payload.week);
    const mission = state.missions.find((item) => Number(item.week) === week);
    if (!mission) throw new Error("找不到任務資料");
    const taskType = missionTaskType(mission);
    validateMissionPayload(payload, mission);
    const trashTypes = Array.isArray(payload.trashTypes) ? payload.trashTypes : ensureArray(payload.trashTypes);

    const now = new Date().toISOString();
    const submission = {
      submissionId: makeId("S"),
      createdAt: now,
      teamId: team.teamId,
      className: team.className,
      groupNo: team.groupNo,
      week,
      missionId: payload.missionId || mission.missionId,
      missionCardId: text(payload.missionCardId || mission.missionId),
      areaName: text(payload.areaName) || missionAreaName(mission),
      mapNodeId: text(payload.mapNodeId || mission.mapNodeId),
      routeName: text(payload.routeName || mission.routeName),
      stepCount: numberValue(payload.stepCount),
      stepTarget: stepTargetValue(payload.stepTarget, mission.stepTarget, state.settings.defaultStepTarget, 800),
      problemFound: text(payload.problemFound) || defaultProblemForMission(taskType),
      trashTypes: trashTypes.map(text).filter(Boolean),
      identifiedItem: text(payload.identifiedItem),
      classificationResult: text(payload.classificationResult || payload.classificationType),
      classificationReason: text(payload.classificationReason),
      aiGuessNote: text(payload.aiGuessNote),
      aiCaptainHintUsed: text(payload.aiCaptainHintUsed || mission.aiCaptainHint),
      miniChallengeScore: text(payload.classificationResult || payload.classificationType) ? 1 : 0,
      routeCompleted: Boolean(text(payload.routeName || mission.routeName) || numberValue(payload.stepCount) > 0),
      amountLevel: text(payload.amountLevel) || "少量",
      possibleReason: text(payload.possibleReason) || defaultReasonForMission(taskType),
      improvementIdea: text(payload.improvementIdea) || defaultImprovementForMission(taskType),
      photoNote: text(payload.photoNote),
      photoUrl: text(payload.photoUrl),
      reflection: text(payload.reflection),
      scoreApplied: true
    };

    const delta = calculateSubmissionDelta(submission);
    state.submissions.push(submission);
    team.totalSteps = Number(team.totalSteps || 0) + Number(submission.stepCount || 0);
    team.lastAiCaptainFeedback = buildAICaptainFeedback(team, submission);
    applyDelta(team, delta);
    state.scoresLog.push({
      logId: makeId("L"),
      createdAt: now,
      teamId: team.teamId,
      sourceType: "submission",
      sourceId: submission.submissionId,
      staminaDelta: delta.stamina,
      scoutDelta: delta.scout,
      cleanseDelta: delta.cleanse,
      wisdomDelta: delta.wisdom,
      influenceDelta: delta.influence,
      note: `第 ${week} 週任務回報`,
      stepDelta: submission.stepCount,
      mapProgressDelta: 0,
      spiritEnergyType: mainDeltaKey(delta),
      unlockEvent: ""
    });
    refreshTeamProgress(team.teamId);
    saveState();
    return { submission, team: decorateTeam(team), delta };
  }

  function validateMissionPayload(payload, mission) {
    const taskType = missionTaskType(mission);
    if (taskType === "team") return;

    if (!text(payload.areaName)) throw new Error("請選擇調查地點");
    if (!text(payload.problemFound)) throw new Error(taskType === "advocate" ? "請填寫主要行動或發現" : "請填寫發現問題");
    if (!text(payload.amountLevel)) throw new Error("請選擇數量感受");
    if (!text(payload.possibleReason)) throw new Error("請填寫可能原因");
    if (!text(payload.improvementIdea)) throw new Error(taskType === "advocate" ? "請填寫宣導或改善行動" : "請填寫改善想法");

    if (taskType === "classify") {
      if (!text(payload.identifiedItem)) throw new Error("請填寫辨識物品");
      if (!text(payload.classificationResult || payload.classificationType)) throw new Error("請選擇垃圾分類結果");
      if (!text(payload.classificationReason)) throw new Error("請填寫分類理由");
    }
  }

  function missionTaskType(mission) {
    if (mission?.taskType) return String(mission.taskType);
    const week = Number(mission?.week || 0);
    if (week === 1) return "team";
    if (week === 3) return "classify";
    if (week === 4) return "advocate";
    return "explore";
  }

  function missionAreaName(mission) {
    return mapNodeForMission(mission)?.areaName || "校園";
  }

  function defaultProblemForMission(taskType) {
    if (taskType === "team") return "完成淨芽小隊集結";
    if (taskType === "advocate") return "整理小隊守護行動與發表重點";
    return "";
  }

  function defaultReasonForMission(taskType) {
    if (taskType === "team") return "小隊已完成角色分工與任務約定";
    return "";
  }

  function defaultImprovementForMission(taskType) {
    if (taskType === "team") return "一起遵守安全提醒，開始校園健康冒險";
    return "";
  }

  function createLocalResultCard(payload) {
    const team = state.teams.find((item) => item.teamId === payload.teamId);
    if (!team) throw new Error("找不到小隊資料");
    if (!text(payload.mainArea)) throw new Error("請選擇主要調查地點");
    if (!text(payload.mainFinding)) throw new Error("請填寫主要發現");
    if (!text(payload.mainReason)) throw new Error("請填寫可能原因");
    if (!text(payload.proposal)) throw new Error("請填寫改善提案");
    if (!text(payload.slogan)) throw new Error("請填寫宣導口號");
    if (!text(payload.commitment)) throw new Error("請填寫行動承諾");

    const existing = state.results.find((item) => item.teamId === team.teamId);
    const now = new Date().toISOString();
    const result = {
      resultId: existing?.resultId || makeId("R"),
      createdAt: existing?.createdAt || now,
      teamId: team.teamId,
      reportTitle: `${team.teamName} 淨芽小隊守護報告`,
      mainArea: text(payload.mainArea),
      mainFinding: text(payload.mainFinding),
      mainReason: text(payload.mainReason),
      proposal: text(payload.proposal),
      slogan: text(payload.slogan),
      commitment: text(payload.commitment),
      finalStage: "守護級",
      totalSteps: Number(team.totalSteps || 0),
      unlockedSpirits: ensureArray(team.unlockedSpirits).length ? ensureArray(team.unlockedSpirits).join("、") : defaultSpirits.map((spirit) => spirit.petName).join("、"),
      exploredAreas: unique(getSubmissionsForTeam(team.teamId).map((item) => item.areaName).filter(Boolean)).join("、"),
      classificationSummary: buildClassificationSummary(getSubmissionsForTeam(team.teamId)),
      mapProgress: Number(team.mapProgress || 0),
      aiCaptainSummary: text(payload.aiCaptainSummary) || buildAICaptainReportSummary(team, payload),
      summaryText: buildResultSummary(team, payload)
    };

    if (existing) {
      Object.assign(existing, result);
    } else {
      state.results.push(result);
      const delta = calculateResultDelta(result);
      applyDelta(team, delta);
      state.scoresLog.push({
        logId: makeId("L"),
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

    refreshTeamProgress(team.teamId);
    saveState();
    return { result, team: decorateTeam(team) };
  }

  function calculateSubmissionDelta(submission) {
    if (Number(submission.week) === 1) {
      return { stamina: 0, scout: 0, cleanse: 0, wisdom: 0, influence: 5 };
    }
    const stepBonus = Math.min(10, Math.floor(Number(submission.stepCount || 0) / 200));
    return {
      stamina: (submission.areaName ? 5 : 0) + stepBonus,
      scout: (submission.routeName ? 5 : 0) + (submission.problemFound ? 10 : 0) + (submission.photoNote || submission.photoUrl ? 5 : 0),
      cleanse: (submission.classificationResult ? 5 : 0) + (submission.improvementIdea ? 10 : 0),
      wisdom: (submission.trashTypes.length ? 5 : 0) + (submission.identifiedItem ? 5 : 0) + (submission.classificationReason ? 5 : 0) + (submission.possibleReason ? 10 : 0),
      influence: submission.reflection ? 5 : 0
    };
  }

  function calculateResultDelta(result) {
    return {
      stamina: 0,
      scout: result.mainFinding ? 10 : 0,
      cleanse: result.proposal ? 15 : 0,
      wisdom: result.mainReason ? 10 : 0,
      influence: (result.slogan ? 15 : 0) + (result.commitment ? 10 : 0)
    };
  }

  function applyDelta(team, delta) {
    abilityOrder.forEach((key) => {
      team[key] = Number(team[key] || 0) + Number(delta[key] || 0);
    });
    team.lastUpdated = new Date().toISOString();
  }

  function refreshTeamProgress(teamId) {
    const team = state.teams.find((item) => item.teamId === teamId);
    if (!team) return null;
    const submissions = getSubmissionsForTeam(teamId);
    const result = state.results.find((item) => item.teamId === teamId);
    const badges = new Set(parseBadges(team.badges));
    badges.add("淨芽集結徽章");

    let level = 1;
    let stage = "萌芽級";
    const completedNodes = new Set(ensureArray(team.completedMapNodes));
    completedNodes.add("node_base");
    if (submissions.some((item) => Number(item.week) === 2)) {
      level = Math.max(level, 2);
      stage = "成長級";
      completedNodes.add("node_playground");
      badges.add("校園探索徽章");
      badges.add("出發徽章");
    }
    if (submissions.some((item) => Number(item.week) === 3)) {
      level = Math.max(level, 3);
      stage = "茁壯級";
      completedNodes.add("node_classify");
      badges.add("熱點分析徽章");
    }
    submissions.forEach((submission) => {
      if (submission.mapNodeId) completedNodes.add(submission.mapNodeId);
      const target = stepTargetValue(submission.stepTarget, state.settings.defaultStepTarget, 800);
      if (target > 0 && Number(submission.stepCount || 0) >= target) {
        badges.add("步行能量徽章");
      }
      if (submission.identifiedItem || submission.aiGuessNote) badges.add("垃圾辨識徽章");
      if (submission.classificationResult && submission.classificationReason) badges.add("分類達人徽章");
      if (submission.reflection) badges.add("團隊合作徽章");
      if (submission.aiCaptainHintUsed) badges.add("AI 智慧徽章");
    });
    if (submissions.some((item) => text(item.improvementIdea))) {
      badges.add("淨化提案徽章");
    }
    if (result) {
      level = 4;
      stage = "守護級";
      completedNodes.add("node_guardian");
      badges.add("校園守護徽章");
      if (text(result.slogan)) badges.add("守護倡議徽章");
    }
    if (completedNodes.size >= 2) badges.add("地圖開拓徽章");

    team.stage = stage;
    team.teamLevel = level;
    team.teamLevelName = stage;
    team.completedMapNodes = Array.from(completedNodes);
    team.mapProgress = Math.min(100, Math.round((completedNodes.size / Math.max(1, activeRows(state.mapNodes || []).length)) * 100));
    team.badges = Array.from(badges);
    team.lastUpdated = new Date().toISOString();
    return team;
  }

  function decorateTeam(team) {
    const cleanTeam = {
      ...team,
      stamina: Number(team.stamina || 0),
      scout: Number(team.scout || 0),
      cleanse: Number(team.cleanse || 0),
      wisdom: Number(team.wisdom || 0),
      influence: Number(team.influence || 0),
      badges: parseBadges(team.badges),
      totalSteps: Number(team.totalSteps || 0),
      leaderSpiritId: team.leaderSpiritId || team.selectedPetId,
      teamLevel: Number(team.teamLevel || teamLevelFromStage(team.stage)),
      teamLevelName: team.teamLevelName || team.stage || "萌芽級",
      mapProgress: Number(team.mapProgress || 0),
      unlockedSpirits: ensureArray(team.unlockedSpirits).length ? ensureArray(team.unlockedSpirits) : defaultSpirits.map((spirit) => spirit.petId),
      completedMapNodes: ensureArray(team.completedMapNodes),
      lastAiCaptainFeedback: team.lastAiCaptainFeedback || ""
    };
    cleanTeam.pet = state.pets.find((pet) => pet.petId === cleanTeam.leaderSpiritId || pet.petId === cleanTeam.selectedPetId) || null;
    cleanTeam.submissions = getSubmissionsForTeam(cleanTeam.teamId);
    cleanTeam.result = state.results.find((result) => result.teamId === cleanTeam.teamId) || null;
    cleanTeam.completedWeeks = getCompletedWeeks(cleanTeam);
    return cleanTeam;
  }

  function getSubmissionsForTeam(teamId) {
    return state.submissions
      .filter((submission) => submission.teamId === teamId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function getCompletedWeeks(team) {
    const weeks = new Set([1]);
    getSubmissionsForTeam(team.teamId).forEach((submission) => weeks.add(Number(submission.week)));
    if (state.results.some((result) => result.teamId === team.teamId)) {
      weeks.add(4);
    }
    return Array.from(weeks);
  }

  function buildDashboardData() {
    const teams = state.teams.map((team) => decorateTeam(team));
    const submissions = [...state.submissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const classifiedSubmissions = submissions.filter((item) => item.classificationResult || item.classificationType);
    const results = getAllResults().results;
    const totalSteps = submissions.reduce((sum, item) => sum + Number(item.stepCount || 0), 0);
    return {
      summary: {
        teamCount: teams.length,
        submissionCount: submissions.length,
        resultCount: results.length,
        totalSteps,
        averageSteps: teams.length ? Math.round(totalSteps / teams.length) : 0,
        classificationCount: classifiedSubmissions.length,
        averageMapProgress: teams.length ? Math.round(teams.reduce((sum, team) => sum + Number(team.mapProgress || 0), 0) / teams.length) : 0,
        topArea: topName(countBy(submissions, "areaName")),
        topTrash: topName(countTrashTypes(submissions)),
        topClassification: topName(countBy(classifiedSubmissions, "classificationResult"))
      },
      teams,
      submissions,
      results,
      weekCounts: entriesFromMap(countBy(submissions, "week")).map((item) => ({
        name: `第 ${item.name} 週`,
        count: item.count
      })),
      areaCounts: entriesFromMap(countBy(submissions, "areaName")),
      trashCounts: entriesFromMap(countTrashTypes(submissions)),
      classificationCounts: entriesFromMap(countBy(classifiedSubmissions, "classificationResult")),
      routeCounts: entriesFromMap(countBy(submissions, "routeName")),
      levelCounts: entriesFromMap(countBy(teams, "teamLevelName")),
      classCounts: entriesFromMap(countBy(teams, "className")),
      latestSubmissions: submissions.slice(0, 8)
    };
  }

  function buildStatsData() {
    const submissions = [...state.submissions];
    const classifiedSubmissions = submissions.filter((item) => item.classificationResult || item.classificationType);
    const teams = state.teams.map((team) => decorateTeam(team));
    return {
      hotspotRanking: entriesFromMap(countBy(submissions, "areaName")),
      trashRanking: entriesFromMap(countTrashTypes(submissions)),
      classificationRanking: entriesFromMap(countBy(classifiedSubmissions, "classificationResult")),
      routeRanking: entriesFromMap(countBy(submissions, "routeName")),
      stepRanking: teams
        .map((team) => ({ name: `${team.className} ${team.groupNo} ${team.teamName}`, count: Number(team.totalSteps || 0) }))
        .sort((a, b) => b.count - a.count),
      levelRanking: entriesFromMap(countBy(teams, "teamLevelName")),
      reasons: submissions.map((item) => item.possibleReason).filter(Boolean),
      improvements: submissions.map((item) => item.improvementIdea).filter(Boolean),
      teamScores: teams
        .map((team) => ({
          teamId: team.teamId,
          className: team.className,
          groupNo: team.groupNo,
          teamName: team.teamName,
          total: abilityOrder.reduce((sum, key) => sum + Number(team[key] || 0), 0),
          stage: team.stage,
          teamLevelName: team.teamLevelName,
          totalSteps: team.totalSteps
        }))
        .sort((a, b) => b.total - a.total),
      submissions
    };
  }

  function getAllResults() {
    const results = state.results.map((result) => {
      const team = state.teams.find((item) => item.teamId === result.teamId);
      return {
        ...result,
        team: team ? decorateTeam(team) : null
      };
    });
    return { results };
  }

  async function getCurrentTeam() {
    const teamId = state.currentTeamId || safeStorageGet(TEAM_ID_KEY);
    if (!teamId) return null;
    try {
      const data = await api("getTeam", { teamId });
      return data.team;
    } catch {
      return null;
    }
  }

  async function render() {
    const token = ++renderToken;
    const route = getRoute();
    app.innerHTML = `<div class="empty-state">載入中...</div>`;
    const team = await getCurrentTeam();
    if (token !== renderToken) return;

    updateNav(route, team);

    if (route.startsWith("/mission/")) {
      const week = Number(route.split("/").pop());
      renderMissionPage(week, team);
      return;
    }

    if (route.startsWith("/teacher")) {
      renderTeacherPage(route);
      return;
    }

    switch (route) {
      case "/team":
        renderTeamPage(team);
        break;
      case "/map":
        renderMapPage(team);
        break;
      case "/growth":
        renderGrowthPage(team);
        break;
      case "/result":
        renderResultPage(team);
        break;
      default:
        renderHomePage(team);
        break;
    }
  }

  function renderHomePage(team) {
    if (!team) {
      app.innerHTML = `
        <section class="page">
          <div class="hero-band">
            <div>
              <div class="eyebrow">${formalProjectName}</div>
              <h1>${gameDisplayName}</h1>
              <p class="lead">接受任務、走出教室、累積步數、辨識分類垃圾，讓淨芽精靈恢復能量並解鎖校園地圖。</p>
              <div class="hero-actions">
                <a class="primary-button" href="#/team">建立淨芽小隊</a>
                <a class="secondary-button" href="#/teacher">教師端</a>
              </div>
            </div>
            <div class="pet-showcase">${petVisual("spirit_green", "萌芽級")}</div>
          </div>
          ${renderGameLoop()}
          ${renderAICaptainBox("紫寶隊長發布今日任務：先建立小隊基地，再一起探索校園角落。記得走路注意安全，發現垃圾時要完成辨識與分類。")}
          ${renderMissionPreview(null)}
        </section>
      `;
      return;
    }

    app.innerHTML = `
      <section class="page">
        <div class="hero-band">
          <div>
            <div class="eyebrow">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}｜${gameDisplayName}</div>
            <h1>${escapeHtml(team.teamName)} 正在${escapeHtml(team.teamLevelName || team.stage)}</h1>
            <p class="lead">隊長精靈 ${escapeHtml(team.customPetName)} 已累積 ${Number(team.totalSteps || 0)} 步，地圖進度 ${Number(team.mapProgress || 0)}%。下一步可前往任務地圖或小隊基地。</p>
            <div class="hero-actions">
              <a class="primary-button" href="#/map">前往任務地圖</a>
              <a class="secondary-button" href="#/growth">小隊基地</a>
            </div>
          </div>
          <div class="pet-showcase">${petVisual(team.leaderSpiritId || team.selectedPetId, team.stage)}</div>
        </div>
        ${renderTeamStrip(team)}
        ${renderAICaptainBox(team.lastAiCaptainFeedback || "紫寶隊長提醒：今天先確認任務卡，再決定要走哪一條校園探索路線。")}
        ${renderMissionPreview(team)}
      </section>
    `;
  }

  function renderTeamPage(team) {
    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">淨芽小隊建立</div>
            <h1>選擇班級、組別與隊長精靈</h1>
          </div>
          ${team ? `<a class="secondary-button" href="#/map">回任務地圖</a>` : ""}
        </div>
        <div class="grid two">
          <div class="panel">
            <h2>建立淨芽小隊</h2>
            <form id="createTeamForm">
              <div class="form-grid">
                ${selectField("className", "班級", state.classes.map((item) => item.className), "", true)}
                ${selectField("groupNo", "組別", groupOptions, "", true)}
              </div>
              <div class="form-grid">
                ${inputField("teamName", "小隊名稱", "例如：綠光小隊", "", true)}
                ${inputField("customPetName", "隊長精靈暱稱", "例如：綠芽隊長", "", true)}
              </div>
              <fieldset class="field">
                <legend>選擇隊長精靈</legend>
                <div class="pet-grid">
                  ${state.pets.map((pet, index) => `
                    <label class="pet-option">
                      <input type="radio" name="selectedPetId" value="${escapeAttr(pet.petId)}" ${index === 0 ? "checked" : ""}>
                      ${petVisual(pet.petId, "萌芽級", "small")}
                      <strong>${escapeHtml(pet.petName)}</strong>
                      <span class="chip">${escapeHtml(pet.spiritRole || "淨芽精靈")}</span>
                      <span>${escapeHtml(pet.description)}</span>
                      <span>${escapeHtml(pet.trait)}</span>
                    </label>
                  `).join("")}
                </div>
              </fieldset>
              <div class="button-row">
                <button class="primary-button" type="submit">建立淨芽小隊</button>
              </div>
            </form>
          </div>
          <div class="panel">
            <h2>找回小隊</h2>
            <form id="loadTeamForm">
              <div class="form-grid">
                ${selectField("loadClassName", "班級", state.classes.map((item) => item.className), "", true)}
                ${selectField("loadGroupNo", "組別", groupOptions, "", true)}
              </div>
              <div class="button-row">
                <button class="secondary-button" type="submit">載入小隊</button>
              </div>
            </form>
            ${team ? `<div class="current-team-slot">${renderTeamStrip(team)}</div>` : ""}
          </div>
        </div>
      </section>
    `;

    document.querySelector("#createTeamForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await withAction(async () => {
        const form = new FormData(event.currentTarget);
        const data = await api("createTeam", Object.fromEntries(form.entries()));
        setCurrentTeam(data.team);
        showToast("淨芽小隊已建立，淨芽集結徽章已解鎖");
        location.hash = "#/map";
      });
    });

    document.querySelector("#loadTeamForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await withAction(async () => {
        const form = new FormData(event.currentTarget);
        const data = await api("getTeamByClassGroup", {
          className: form.get("loadClassName"),
          groupNo: form.get("loadGroupNo")
        });
        setCurrentTeam(data.team);
        showToast("已載入小隊");
        location.hash = "#/map";
      });
    });
  }

  function renderMapPage(team) {
    if (!team) {
      renderNeedTeam("先建立小隊，再開始任務地圖");
      return;
    }

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">校園探索地圖</div>
            <h1>${escapeHtml(team.teamName)} 的地圖節點與任務卡</h1>
          </div>
          <a class="secondary-button" href="#/growth">小隊基地</a>
        </div>
        ${renderTeamStrip(team)}
        ${renderTodayTaskCard(team)}
        <div class="panel">
          <div class="page-head compact">
            <div>
              <h2>校園地圖節點</h2>
              <p class="meta">已解鎖區域會隨任務與小隊等級逐步增加。</p>
            </div>
            <span class="chip">地圖進度 ${Number(team.mapProgress || 0)}%</span>
          </div>
          <img class="map-visual" src="${escapeAttr(uiAssets.campusMap)}" alt="" loading="lazy">
          <div class="map-node-grid">
            ${activeRows(state.mapNodes || []).map((node) => renderMapNode(node, team)).join("")}
          </div>
        </div>
        <div class="mission-grid">
          ${state.missions.map((mission) => renderMissionCard(mission, team)).join("")}
        </div>
      </section>
    `;
  }

  function renderMissionPage(week, team) {
    if (!team) {
      renderNeedTeam("先建立小隊，再提交任務回報");
      return;
    }

    const mission = state.missions.find((item) => Number(item.week) === week);
    if (!mission) {
      app.innerHTML = renderError("找不到這個任務");
      return;
    }

    const currentWeek = Number(state.settings.currentWeek || 1);
    const locked = week > currentWeek;
    if (locked) {
      app.innerHTML = `
        <section class="page">
          <div class="empty-state">
            <h2>第 ${week} 週尚未開放</h2>
            <p>目前開放到第 ${currentWeek} 週。</p>
            <a class="secondary-button" href="#/map">回任務地圖</a>
          </div>
        </section>
      `;
      return;
    }
    const taskType = missionTaskType(mission);

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">第 ${week} 週</div>
            <h1>${escapeHtml(mission.title)}</h1>
            <p class="lead">${escapeHtml(mission.instruction)}</p>
          </div>
          <a class="secondary-button" href="#/map">回地圖</a>
        </div>
        ${renderTeamStrip(team)}
        ${renderMissionTaskCard(mission, team)}
        ${renderAICaptainBox(mission.aiCaptainHint || "先確認地點、路線與分類目標，再開始填寫任務回報。")}
        <div class="panel">
          <form id="missionForm">
            <input type="hidden" name="missionCardId" value="${escapeAttr(mission.missionId)}">
            <input type="hidden" name="mapNodeId" value="${escapeAttr(mission.mapNodeId || "")}">
            <input type="hidden" name="stepTarget" value="${escapeAttr(stepTargetValue(mission.stepTarget, state.settings.defaultStepTarget, 800))}">
            <input type="hidden" name="aiCaptainHintUsed" value="${escapeAttr(mission.aiCaptainHint || "")}">
            <input type="hidden" name="taskType" value="${escapeAttr(taskType)}">
            ${renderMissionFormFields(mission, week)}
            <div class="button-row">
              <button class="primary-button" type="submit">${taskType === "team" ? "完成小隊集結" : "提交任務回報"}</button>
              ${week === 4 ? `<a class="secondary-button" href="#/result">填寫守護報告</a>` : ""}
            </div>
          </form>
        </div>
      </section>
    `;

    document.querySelector("#missionForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await withAction(async () => {
        const form = new FormData(event.currentTarget);
        const payload = Object.fromEntries(form.entries());
        payload.teamId = team.teamId;
        payload.week = week;
        payload.missionId = mission.missionId;
        payload.trashTypes = form.getAll("trashTypes");
        const data = await api("submitMission", payload);
        setCurrentTeam(data.team);
        showToast(`任務已提交，${formatDelta(data.delta)}`);
        location.hash = "#/growth";
      });
    });
  }

  function renderMissionFormFields(mission, week) {
    const taskType = missionTaskType(mission);
    const target = stepTargetValue(mission.stepTarget, state.settings.defaultStepTarget, 800);
    if (taskType === "team") {
      return `
        <input type="hidden" name="areaName" value="${escapeAttr(missionAreaName(mission))}">
        <input type="hidden" name="routeName" value="${escapeAttr(mission.routeName || "小隊基地集結")}">
        <input type="hidden" name="amountLevel" value="少量">
        <input type="hidden" name="problemFound" value="完成淨芽小隊集結">
        <input type="hidden" name="possibleReason" value="小隊已完成角色分工與任務約定">
        <input type="hidden" name="improvementIdea" value="一起遵守安全提醒，開始校園健康冒險">
        <div class="mission-complete-card">
          <strong>小隊基地已啟動</strong>
          <p>你們已經建立淨芽小隊並選好隊長精靈。按下完成後，系統會記錄第 1 週集結任務，下一步就能依教師開放週次前往校園探索。</p>
        </div>
        ${textareaField("reflection", "小隊約定", "例如：走路注意安全、看到垃圾先觀察再分類、大家輪流記錄。", "", false)}
      `;
    }

    const explorationBlock = `
      <h2>探索紀錄</h2>
      <div class="form-grid">
        ${selectField("areaName", "調查地點", state.areas.map((item) => item.areaName), "", true)}
        ${inputField("routeName", "探索路線", mission.routeName || "例如：操場東側探索路線", mission.routeName || "", false)}
        ${inputField("stepCount", "本次步數", target ? `目標 ${target} 步` : "可留空", "", false, "number")}
        ${selectField("amountLevel", "數量感受", amountOptions, "", true)}
      </div>
    `;
    const discoveryBlock = `
      <h2>${taskType === "advocate" ? "守護行動紀錄" : "發現紀錄"}</h2>
      ${textareaField("problemFound", taskType === "advocate" ? "主要行動或發現" : "發現問題", "寫下你們看到的環境問題或守護行動", "", true)}
      <fieldset class="field">
        <legend>垃圾或問題類型</legend>
        <div class="check-grid">
          ${trashOptions.map((item) => `
            <label class="check-pill">
              <input type="checkbox" name="trashTypes" value="${escapeAttr(item)}">
              <span>${escapeHtml(item)}</span>
            </label>
          `).join("")}
        </div>
      </fieldset>
    `;
    const classificationBlock = taskType === "classify" ? `
      <h2>垃圾辨識與分類挑戰</h2>
      ${inputField("identifiedItem", "辨識物品", "例如：寶特瓶、飲料杯、包裝紙", "", true)}
      ${selectField("classificationResult", "分類結果", classificationOptions, "", true)}
      ${textareaField("classificationReason", "分類理由", "為什麼這樣分類？如果不確定，也請寫下判斷依據。", "", true)}
      ${inputField("aiGuessNote", "AI 或小組辨識說明", "可寫：小組判斷為寶特瓶；AI 小隊長提醒需清空再回收", "", false)}
      <div class="challenge-box">
        <strong>分類小挑戰</strong>
        <span>如果看到乾淨寶特瓶，通常可以選「資源回收」。若有嚴重髒污，請在分類理由補充處理方式。</span>
      </div>
    ` : `
      <div class="challenge-box">
        <strong>${taskType === "advocate" ? "守護報告提醒" : "紫寶隊長提醒"}</strong>
        <span>${taskType === "advocate" ? "第 4 週重點是整理成果與提出倡議。完成這筆行動紀錄後，記得產生淨芽小隊守護報告。" : "這一週先專心觀察路線、步數與環境問題；垃圾分類挑戰會在第 3 週正式進行。"}</span>
      </div>
    `;
    return `
      ${explorationBlock}
      ${discoveryBlock}
      ${classificationBlock}
      <h2>改善想法與反思</h2>
      ${textareaField("possibleReason", "可能原因", "你們覺得問題為什麼會發生", "", true)}
      ${textareaField("improvementIdea", taskType === "advocate" ? "宣導或改善行動" : "改善想法", "提出一個小隊做得到或能倡議的做法", "", true)}
      <div class="form-grid">
        ${inputField("photoNote", "照片說明", "可留空", "", false)}
        ${inputField("photoUrl", "任務照片連結", "可留空", "", false)}
      </div>
      ${textareaField("reflection", "小組反思", week === 4 ? "可寫下發表前想提醒全校同學的話" : "可留空", "", false)}
    `;
  }

  function renderGrowthPage(team) {
    if (!team) {
      renderNeedTeam("先建立小隊，再查看小隊基地");
      return;
    }

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">小隊基地</div>
            <h1>${escapeHtml(team.teamName)}｜${escapeHtml(team.teamLevelName || team.stage)}</h1>
            <p class="lead">累積 ${Number(team.totalSteps || 0)} 步，地圖進度 ${Number(team.mapProgress || 0)}%。</p>
          </div>
          <a class="primary-button" href="#/map">繼續任務</a>
        </div>
        <div class="grid two">
          <div class="panel">
            <h2>隊長精靈</h2>
            <div class="pet-showcase">${petVisual(team.leaderSpiritId || team.selectedPetId, team.stage)}</div>
            <p class="lead">${escapeHtml(team.customPetName)}｜${escapeHtml(team.pet?.spiritRole || "淨芽精靈")}</p>
            <div class="badge-list">${team.badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}</div>
          </div>
          <div class="panel">
            <h2>精靈能量</h2>
            <img class="base-visual" src="${escapeAttr(uiAssets.campusBase)}" alt="" loading="lazy">
            ${renderMeters(team)}
          </div>
        </div>
        ${renderAICaptainBox(team.lastAiCaptainFeedback || "紫寶隊長提醒：完成任務後，記得把步數、分類理由和改善想法寫清楚。")}
        <div class="panel">
          <h2>六位淨芽精靈</h2>
          <div class="spirit-roster">
            ${state.pets.map((pet) => renderSpiritCard(pet, team)).join("")}
          </div>
        </div>
        <div class="panel">
          <h2>地圖解鎖進度</h2>
          <div class="map-node-grid">
            ${activeRows(state.mapNodes || []).map((node) => renderMapNode(node, team)).join("")}
          </div>
        </div>
        <div class="panel">
          <h2>任務回報紀錄</h2>
          ${renderSubmissionList(team.submissions)}
        </div>
      </section>
    `;
  }

  function renderResultPage(team) {
    if (!team) {
      renderNeedTeam("先建立小隊，再產生守護報告");
      return;
    }

    const result = team.result;
    const knownAreas = unique(team.submissions.map((item) => item.areaName)).length
      ? unique(team.submissions.map((item) => item.areaName))
      : state.areas.map((item) => item.areaName);

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">淨芽小隊守護報告</div>
            <h1>${escapeHtml(team.teamName)} 的校園守護成果</h1>
          </div>
          <a class="secondary-button" href="#/growth">小隊基地</a>
        </div>
        ${result ? renderResultCard(team, result) : ""}
        <div class="panel">
          <h2>${result ? "更新守護報告" : "建立守護報告"}</h2>
          <form id="resultForm">
            <div class="form-grid">
              ${selectField("mainArea", "主要調查地點", knownAreas, result?.mainArea || "", true)}
              ${inputField("slogan", "宣導口號", "例如：多走三步，校園乾淨一大步", result?.slogan || "", true)}
            </div>
            ${textareaField("mainFinding", "主要發現", "小隊最重要的環境發現", result?.mainFinding || "", true)}
            ${textareaField("mainReason", "可能原因", "小隊分析出的原因", result?.mainReason || "", true)}
            ${textareaField("proposal", "改善提案", "具體可行的改善方法", result?.proposal || "", true)}
            ${textareaField("commitment", "行動承諾", "小隊未來願意持續做到的行動", result?.commitment || "", true)}
            ${textareaField("aiCaptainSummary", "AI 小隊長回饋", "可留空，系統會依資料產生摘要", result?.aiCaptainSummary || "", false)}
            <button class="primary-button" type="submit">${result ? "更新守護報告" : "產生守護報告"}</button>
          </form>
        </div>
      </section>
    `;

    document.querySelector("#resultForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await withAction(async () => {
        const form = new FormData(event.currentTarget);
        const payload = Object.fromEntries(form.entries());
        payload.teamId = team.teamId;
        const data = await api("createResultCard", payload);
        setCurrentTeam(data.team);
        showToast("守護報告已儲存，淨芽小隊進入守護級");
        render();
      });
    });
  }

  async function renderTeacherPage(route) {
    const tab = route.split("/")[2] || "dashboard";
    if (!state.teacherUnlocked) {
      app.innerHTML = `
        <section class="page">
          <div class="page-head">
            <div>
              <div class="eyebrow">教師端</div>
              <h1>輸入教師管理碼</h1>
            </div>
          </div>
          <div class="panel">
            <form id="teacherLoginForm">
              ${inputField("code", "教師管理碼", "請輸入教師管理碼", "", true, "password")}
              <button class="primary-button" type="submit">進入教師端</button>
            </form>
          </div>
        </section>
      `;
      document.querySelector("#teacherLoginForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        await withAction(async () => {
          const code = new FormData(event.currentTarget).get("code");
          const data = await api("checkTeacherCode", { code });
          if (!data.ok) throw new Error("管理碼不正確");
          teacherSessionCode = code;
          safeSessionStorageSet(TEACHER_CODE_KEY, code);
          state.teacherUnlocked = true;
          saveState();
          showToast("已進入教師端");
          render();
        });
      });
      return;
    }

    app.innerHTML = `<section class="page"><div class="empty-state">載入教師資料...</div></section>`;
    const dashboard = await api("getDashboardData", teacherPayload());

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">教師端</div>
            <h1>淨芽小隊任務資料總覽</h1>
          </div>
          <button class="secondary-button" id="teacherLogoutButton" type="button">離開教師端</button>
        </div>
        ${renderTeacherTabs(tab)}
        <div id="teacherContent"></div>
      </section>
    `;

    document.querySelector("#teacherLogoutButton").addEventListener("click", () => {
      teacherSessionCode = "";
      safeSessionStorageRemove(TEACHER_CODE_KEY);
      state.teacherUnlocked = false;
      saveState();
      showToast("已離開教師端");
      render();
    });

    if (tab === "teams") renderTeacherTeams(dashboard);
    else if (tab === "submissions") renderTeacherSubmissions(dashboard);
    else if (tab === "stats") await renderTeacherStats();
    else if (tab === "results") renderTeacherResults(dashboard);
    else if (tab === "settings") renderTeacherSettings();
    else renderTeacherDashboard(dashboard);
  }

  function renderTeacherDashboard(dashboard) {
    document.querySelector("#teacherContent").innerHTML = `
      <div class="stat-row">
        ${statCard("小隊總數", dashboard.summary.teamCount)}
        ${statCard("任務回報", dashboard.summary.submissionCount)}
        ${statCard("守護報告", dashboard.summary.resultCount)}
        ${statCard("累積步數", dashboard.summary.totalSteps || 0)}
        ${statCard("平均步數", dashboard.summary.averageSteps || 0)}
        ${statCard("分類任務", dashboard.summary.classificationCount || 0)}
        ${statCard("地圖進度", `${dashboard.summary.averageMapProgress || 0}%`)}
        ${statCard("熱門區域", dashboard.summary.topArea || "尚無")}
        ${statCard("常見分類", dashboard.summary.topClassification || "尚無")}
      </div>
      <div class="grid two">
        <div class="panel">
          <h2>各週完成數</h2>
          ${renderCountList(dashboard.weekCounts)}
        </div>
        <div class="panel">
          <h2>最新回報</h2>
          ${renderSubmissionList(dashboard.latestSubmissions)}
        </div>
      </div>
    `;
  }

  function renderTeacherTeams(dashboard) {
    document.querySelector("#teacherContent").innerHTML = `
      <div class="panel">
        <h2>小隊管理</h2>
        ${renderTable(
          ["班級", "組別", "隊名", "隊長精靈", "小隊等級", "累積步數", "地圖進度", "徽章"],
          dashboard.teams.map((team) => [
            team.className,
            team.groupNo,
            team.teamName,
            team.customPetName,
            team.teamLevelName || team.stage,
            team.totalSteps || 0,
            `${team.mapProgress || 0}%`,
            team.badges.join("、")
          ]),
          "目前尚無小隊"
        )}
      </div>
    `;
  }

  function renderTeacherSubmissions(dashboard) {
    document.querySelector("#teacherContent").innerHTML = `
      <div class="panel">
        <h2>回報紀錄</h2>
        ${renderTable(
          ["時間", "班級", "組別", "週次", "地點", "路線", "步數", "分類結果", "分類理由", "發現問題", "改善想法"],
          dashboard.submissions.map((item) => [
            dateText(item.createdAt),
            item.className,
            item.groupNo,
            `第 ${item.week} 週`,
            item.areaName,
            item.routeName || "",
            item.stepCount || 0,
            item.classificationResult || item.classificationType || "",
            item.classificationReason || "",
            item.problemFound,
            item.improvementIdea
          ]),
          "目前尚無回報"
        )}
      </div>
    `;
  }

  async function renderTeacherStats() {
    const stats = await api("getStats", teacherPayload());
    const prompt = buildAiPrompt(stats.submissions);
    document.querySelector("#teacherContent").innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>校園區域熱點</h2>
          ${renderCountList(stats.hotspotRanking)}
        </div>
        <div class="panel">
          <h2>垃圾類型排行</h2>
          ${renderCountList(stats.trashRanking)}
        </div>
      </div>
      <div class="grid two">
        <div class="panel">
          <h2>分類結果統計</h2>
          ${renderCountList(stats.classificationRanking)}
        </div>
        <div class="panel">
          <h2>探索路線統計</h2>
          ${renderCountList(stats.routeRanking)}
        </div>
      </div>
      <div class="panel">
        <h2>各組能量與步數排行</h2>
        ${renderTable(
          ["班級", "組別", "隊名", "總能量", "步數", "等級"],
          stats.teamScores.map((team) => [team.className, team.groupNo, team.teamName, team.total, team.totalSteps || 0, team.teamLevelName || team.stage]),
          "目前尚無分數"
        )}
      </div>
      <div class="panel">
        <div class="page-head">
          <div>
            <h2>AI 分析文字</h2>
            <p class="meta">可複製後貼到 ChatGPT。</p>
          </div>
          <button class="secondary-button" id="copyAiPromptButton" type="button">複製給 AI 分析</button>
        </div>
        <textarea class="copy-box" readonly>${escapeHtml(prompt)}</textarea>
      </div>
    `;
    document.querySelector("#copyAiPromptButton").addEventListener("click", () => copyText(prompt));
  }

  function renderTeacherResults(dashboard) {
    document.querySelector("#teacherContent").innerHTML = `
      <div class="panel">
        <h2>守護報告管理</h2>
        ${dashboard.results.length ? dashboard.results.map((result) => renderResultCard(result.team, result)).join("") : `
          <div class="empty-state">目前尚無守護報告</div>
        `}
      </div>
    `;
  }

  function renderTeacherSettings() {
    document.querySelector("#teacherContent").innerHTML = `
      <div class="panel">
        <h2>系統設定</h2>
        <form id="settingsForm">
          <div class="form-grid">
            ${selectField("currentWeek", "目前開放週次", ["1", "2", "3", "4"], String(state.settings.currentWeek || "1"), true)}
            ${inputField("newTeacherCode", "變更教師管理碼", "留空則不變", "", false, "password")}
          </div>
          <button class="primary-button" type="submit">儲存設定</button>
        </form>
      </div>
      <div class="grid two">
        <div class="panel">
          <h2>班級選項</h2>
          <div class="chip-list">${state.classes.map((item) => `<span class="chip">${escapeHtml(item.className)}</span>`).join("")}</div>
        </div>
        <div class="panel">
          <h2>校園區域</h2>
          <div class="chip-list">${state.areas.map((item) => `<span class="chip">${escapeHtml(item.areaName)}</span>`).join("")}</div>
        </div>
        <div class="panel">
          <h2>地圖節點</h2>
          <div class="chip-list">${activeRows(state.mapNodes || []).map((item) => `<span class="chip">${escapeHtml(item.nodeName)}｜${escapeHtml(item.routeName || "")}</span>`).join("")}</div>
        </div>
      </div>
    `;

    document.querySelector("#settingsForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await withAction(async () => {
        const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
        const data = await api("updateSettings", teacherPayload(payload));
        if (payload.newTeacherCode) {
          teacherSessionCode = payload.newTeacherCode;
          safeSessionStorageSet(TEACHER_CODE_KEY, payload.newTeacherCode);
        }
        state.settings = { ...state.settings, ...data.settings };
        saveState();
        showToast("設定已儲存");
        render();
      });
    });
  }

  function renderGameLoop() {
    const steps = ["接受任務", "走出教室", "累積步數", "遇見垃圾", "拍照辨識", "撿拾分類", "精靈得能量", "解鎖新地圖"];
    return `
      <div class="loop-panel">
        <img class="loop-visual" src="${escapeAttr(uiAssets.missionLoop)}" alt="" loading="lazy">
        <div class="loop-strip">
          ${steps.map((step, index) => `
            <div class="loop-step">
              <span>${index + 1}</span>
              <strong>${escapeHtml(step)}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderAICaptainBox(message) {
    return `
      <div class="ai-captain">
        <img class="captain-avatar image-avatar" src="${escapeAttr(uiAssets.aiCaptain)}" alt="" loading="lazy">
        <div>
          <strong>${escapeHtml(state.settings.aiCaptainName || "紫寶隊長")}</strong>
          <p>${escapeHtml(message)}</p>
        </div>
      </div>
    `;
  }

  function renderTodayTaskCard(team) {
    const currentWeek = Number(state.settings.currentWeek || 1);
    const openMissions = state.missions.filter((mission) => Number(mission.week) <= currentWeek);
    const nextMission = openMissions.find((mission) => !team.completedWeeks.includes(Number(mission.week)))
      || state.missions.find((mission) => Number(mission.week) === currentWeek)
      || state.missions[0];
    return renderMissionTaskCard(nextMission, team);
  }

  function renderMissionTaskCard(mission, team) {
    if (!mission) return "";
    const target = stepTargetValue(mission.stepTarget, state.settings.defaultStepTarget, 800);
    const locked = team && Number(mission.week) > Number(state.settings.currentWeek || 1);
    return `
      <article class="task-card">
        <div>
          <div class="eyebrow">今日任務卡</div>
          <h2>${escapeHtml(mission.title)}</h2>
          <p>${escapeHtml(mission.story)}</p>
        </div>
        <div class="task-facts">
          ${fact("任務路線", mission.routeName || "依教師指示")}
          ${fact("目標步數", target ? `${target} 步` : "建立小隊")}
          ${fact("任務地點", mapNodeForMission(mission)?.areaName || mission.mapNodeId || "校園")}
          ${fact("獎勵能量", rewardTextForMission(mission))}
        </div>
        ${renderAICaptainBox(mission.aiCaptainHint || "完成任務後，請把步數、分類與改善想法寫清楚。")}
        ${team
          ? locked
            ? `<span class="chip">尚未開放</span>`
            : `<a class="primary-button mini" href="#/mission/${mission.week}">${missionTaskType(mission) === "team" ? "完成集結" : "前往回報"}</a>`
          : `<a class="primary-button mini" href="#/team">建立小隊</a>`}
      </article>
    `;
  }

  function renderMapNode(node, team) {
    const completed = team.completedMapNodes.includes(node.mapNodeId);
    const unlocked = isMapNodeUnlocked(node, team);
    return `
      <article class="map-node ${completed ? "complete" : unlocked ? "" : "locked"}">
        <div class="node-icon">${escapeHtml(node.icon || "點")}</div>
        <div>
          <h3>${escapeHtml(node.nodeName)}</h3>
          <p>${escapeHtml(node.description || "")}</p>
          <div class="chip-list">
            <span class="chip">第 ${escapeHtml(node.week || "-")} 週</span>
            <span class="chip">${escapeHtml(node.routeName || "校園路線")}</span>
            ${node.stepTarget ? `<span class="chip">${escapeHtml(node.stepTarget)} 步</span>` : ""}
            <span class="chip">${completed ? "已完成" : unlocked ? "已解鎖" : "未解鎖"}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderSpiritCard(pet, team) {
    const active = (team.unlockedSpirits || []).includes(pet.petId);
    const isLeader = team.leaderSpiritId === pet.petId || team.selectedPetId === pet.petId;
    return `
      <article class="spirit-card ${active ? "" : "locked"} ${isLeader ? "leader" : ""}">
        ${petVisual(pet.petId, team.stage, "small")}
        <div>
          <h3>${escapeHtml(pet.petName)} ${isLeader ? "｜隊長" : ""}</h3>
          <p class="meta">${escapeHtml(pet.spiritRole || "淨芽精靈")}｜${escapeHtml(abilityLabels[pet.primaryEnergy] || pet.primaryEnergy || "")}</p>
          <p>${escapeHtml(pet.description || pet.trait || "")}</p>
        </div>
      </article>
    `;
  }

  function isMapNodeUnlocked(node, team) {
    const week = Number(node.week || 1);
    return week <= Number(state.settings.currentWeek || 1) || team.completedMapNodes.includes(node.mapNodeId) || Number(team.teamLevel || 1) >= Math.max(1, week - 1);
  }

  function mapNodeForMission(mission) {
    return activeRows(state.mapNodes || []).find((node) => node.mapNodeId === mission.mapNodeId) || null;
  }

  function rewardTextForMission(mission) {
    const type = mission.taskType || "";
    if (type === "explore") return "健康能量、探索能量";
    if (type === "classify") return "智慧能量、淨化能量";
    if (type === "advocate") return "守護能量、淨化能量";
    return "守護能量";
  }

  function renderMissionPreview(team) {
    return `
      <div class="mission-grid">
        ${state.missions.map((mission) => renderMissionCard(mission, team)).join("")}
      </div>
    `;
  }

  function renderMissionCard(mission, team) {
    const currentWeek = Number(state.settings.currentWeek || 1);
    const completed = team ? team.completedWeeks.includes(Number(mission.week)) : false;
    const locked = team ? Number(mission.week) > currentWeek : Number(mission.week) > 1;
    const statusClass = completed ? "complete" : locked ? "locked" : "";
    const statusText = completed ? "已完成" : locked ? "尚未開放" : "可進行";
    return `
      <article class="mission-card ${statusClass}">
        <div class="mission-number">${mission.week}</div>
        <h3>${escapeHtml(mission.title)}</h3>
        <p class="meta">${escapeHtml(mission.story)}</p>
        <p class="meta">路線：${escapeHtml(mission.routeName || "依任務指示")}｜${stepTargetValue(mission.stepTarget, state.settings.defaultStepTarget, 800) ? `目標 ${escapeHtml(stepTargetValue(mission.stepTarget, state.settings.defaultStepTarget, 800))} 步` : "小隊集結"}</p>
        <span class="chip">${statusText}</span>
        ${team && !locked
          ? `<a class="primary-button mini" href="#/mission/${mission.week}">${completed ? "新增回報" : "開始任務"}</a>`
          : `<a class="secondary-button mini" href="${team ? "#/map" : "#/team"}">${team ? "查看地圖" : "建立小隊"}</a>`}
      </article>
    `;
  }

  function renderTeamStrip(team) {
    return `
      <div class="team-strip card">
        ${petVisual(team.leaderSpiritId || team.selectedPetId, team.stage, "small")}
        <div>
          <div class="meta">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}</div>
          <h2>${escapeHtml(team.teamName)}｜${escapeHtml(team.customPetName)}</h2>
          <div class="chip-list">
            <span class="chip">${escapeHtml(team.teamLevelName || team.stage)}</span>
            <span class="chip">${team.submissions.length} 筆回報</span>
            <span class="chip">${Number(team.totalSteps || 0)} 步</span>
            <span class="chip">地圖 ${Number(team.mapProgress || 0)}%</span>
          </div>
        </div>
        <a class="secondary-button" href="#/growth">基地</a>
      </div>
    `;
  }

  function renderMeters(team) {
    const max = Math.max(60, ...abilityOrder.map((key) => Number(team[key] || 0)));
    return `
      <div class="meter-list">
        ${abilityOrder.map((key) => {
          const value = Number(team[key] || 0);
          const percent = Math.min(100, Math.round((value / max) * 100));
          return `
            <div class="meter">
              <label><span>${abilityLabels[key]}</span><strong>${value}</strong></label>
              <div class="meter-track"><div class="meter-fill" style="--value:${percent}%"></div></div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSubmissionList(submissions) {
    if (!submissions.length) {
      return `<div class="empty-state">目前尚無任務回報</div>`;
    }
    return `
      <div class="grid">
        ${submissions.map((item) => `
          <article class="card">
            <div class="meta">${dateText(item.createdAt)}｜第 ${escapeHtml(item.week)} 週｜${escapeHtml(item.areaName || "")}｜${escapeHtml(item.routeName || "未填路線")}</div>
            <h3>${escapeHtml(item.problemFound || "")}</h3>
            <div class="chip-list">
              ${ensureArray(item.trashTypes).map((type) => `<span class="chip">${escapeHtml(type)}</span>`).join("")}
              ${item.classificationResult ? `<span class="chip">${escapeHtml(item.classificationResult)}</span>` : ""}
              ${item.stepCount ? `<span class="chip">${escapeHtml(item.stepCount)} 步</span>` : ""}
            </div>
            ${item.classificationReason ? `<p class="meta">分類理由：${escapeHtml(item.classificationReason)}</p>` : ""}
            <p>${escapeHtml(item.improvementIdea || "")}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderResultCard(team, result) {
    if (!team || !result) return "";
    return `
      <article class="result-card">
        <div class="result-head">
          ${petVisual(team.leaderSpiritId || team.selectedPetId, "守護級", "medium")}
          <div>
            <div class="eyebrow">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}</div>
            <h2>${escapeHtml(result.reportTitle || `${team.teamName} 淨芽小隊守護報告`)}</h2>
            <div class="badge-list">${team.badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}</div>
          </div>
        </div>
        <div class="result-facts">
          ${fact("小隊等級", result.finalStage || team.teamLevelName || team.stage)}
          ${fact("累積步數", result.totalSteps || team.totalSteps || 0)}
          ${fact("解鎖地圖", result.exploredAreas || unique(team.submissions.map((item) => item.areaName)).join("、"))}
          ${fact("主要地點", result.mainArea)}
          ${fact("主要發現", result.mainFinding)}
          ${fact("垃圾辨識結果", result.classificationSummary || buildClassificationSummary(team.submissions))}
          ${fact("可能原因", result.mainReason)}
          ${fact("改善提案", result.proposal)}
          ${fact("宣導口號", result.slogan)}
          ${fact("行動承諾", result.commitment)}
          ${fact("AI 小隊長回饋", result.aiCaptainSummary)}
          ${fact("成果摘要", result.summaryText)}
        </div>
      </article>
    `;
  }

  function renderNeedTeam(message) {
    app.innerHTML = `
      <section class="page">
        <div class="empty-state">
          <h2>${escapeHtml(message)}</h2>
          <a class="primary-button" href="#/team">前往小隊頁</a>
        </div>
      </section>
    `;
  }

  function renderTeacherTabs(tab) {
    const tabs = [
      ["dashboard", "儀表板", "#/teacher"],
      ["teams", "小隊", "#/teacher/teams"],
      ["submissions", "回報", "#/teacher/submissions"],
      ["stats", "熱點分析", "#/teacher/stats"],
      ["results", "守護報告", "#/teacher/results"],
      ["settings", "設定", "#/teacher/settings"]
    ];
    return `
      <div class="teacher-tabs">
        ${tabs.map(([id, label, href]) => `
          <a class="secondary-button mini ${tab === id ? "active" : ""}" href="${href}">${label}</a>
        `).join("")}
      </div>
    `;
  }

  function renderCountList(items) {
    if (!items.length) return `<div class="empty-state">目前尚無資料</div>`;
    return `
      <div class="grid">
        ${items.map((item) => `
          <div class="team-strip card">
            <div class="mission-number">${escapeHtml(item.count)}</div>
            <div>
              <h3>${escapeHtml(item.name || "未填寫")}</h3>
              <p class="meta">${escapeHtml(item.count)} 筆</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderTable(headers, rows, emptyText) {
    if (!rows.length) return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function statCard(label, value) {
    return `<div class="stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  function fact(label, value) {
    return `<div class="fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "尚未填寫")}</strong></div>`;
  }

  function selectField(name, label, options, value = "", required = false) {
    return `
      <div class="field">
        <label for="${escapeAttr(name)}">${escapeHtml(label)}</label>
        <select id="${escapeAttr(name)}" name="${escapeAttr(name)}" ${required ? "required" : ""}>
          <option value="">請選擇</option>
          ${options.map((option) => `
            <option value="${escapeAttr(option)}" ${String(option) === String(value) ? "selected" : ""}>${escapeHtml(option)}</option>
          `).join("")}
        </select>
      </div>
    `;
  }

  function inputField(name, label, placeholder, value = "", required = false, type = "text") {
    return `
      <div class="field">
        <label for="${escapeAttr(name)}">${escapeHtml(label)}</label>
        <input id="${escapeAttr(name)}" name="${escapeAttr(name)}" type="${escapeAttr(type)}" value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder)}" ${required ? "required" : ""}>
      </div>
    `;
  }

  function textareaField(name, label, placeholder, value = "", required = false) {
    return `
      <div class="field">
        <label for="${escapeAttr(name)}">${escapeHtml(label)}</label>
        <textarea id="${escapeAttr(name)}" name="${escapeAttr(name)}" placeholder="${escapeAttr(placeholder)}" ${required ? "required" : ""}>${escapeHtml(value)}</textarea>
      </div>
    `;
  }

  function spiritAssetFor(petId, stage) {
    const pet = state?.pets?.find((item) => item.petId === petId) || {};
    const stageIndex = Math.max(1, stageRank.indexOf(stage) + 1);
    return pet[`imageStage${stageIndex}`] || pet.imageStage1 || spiritImageAssets[petId] || "";
  }

  function petVisual(petId, stage, size = "") {
    const imageSrc = spiritAssetFor(petId, stage);
    if (imageSrc) {
      const pet = state?.pets?.find((item) => item.petId === petId);
      return `
        <div class="pet-visual image ${escapeAttr(size)}" aria-hidden="true">
          <img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(pet?.petName || "淨芽精靈")}" loading="lazy">
        </div>
      `;
    }

    const rank = Math.max(0, stageRank.indexOf(stage));
    const scale = 1 + rank * 0.08;
    const style = {
      pet_leaf_001: ["#6fbd63", "#2f7c52", "#ffdf6d"],
      pet_step_001: ["#83c7df", "#2f7ca8", "#f2c14e"],
      pet_clean_001: ["#f7f8ff", "#6aa1b8", "#f2c14e"],
      pet_light_001: ["#ffe18a", "#bc7b3a", "#ffffff"],
      pet_bud_001: ["#90cf6f", "#d96b5d", "#f4d35e"],
      spirit_green: ["#6fcf79", "#2f7c52", "#dff7b7"],
      spirit_water: ["#86d7f6", "#2f7ca8", "#e3f7ff"],
      spirit_sun: ["#ffd86a", "#bc7b3a", "#fff3a6"],
      spirit_purple: ["#a884df", "#5f3c95", "#f1e7ff"],
      spirit_heart: ["#f59ac2", "#b64f7b", "#ffe1ed"],
      spirit_potato: ["#b98a5b", "#744a2f", "#f5deb8"]
    }[petId] || ["#83c66b", "#2e7d59", "#f2c14e"];
    const [body, accent, glow] = style;
    const horns = rank >= 2 ? `<path d="M84 62c-21-23-25-45-13-58 15 16 22 33 21 55M174 62c21-23 25-45 13-58-15 16-22 33-21 55" fill="${accent}" opacity=".86"/>` : "";
    const wings = petId === "pet_clean_001" || rank >= 3
      ? `<path d="M67 126c-37-10-50-37-44-67 31 7 51 29 57 60M191 126c37-10 50-37 44-67-31 7-51 29-57 60" fill="#dff4ff" stroke="${accent}" stroke-width="5"/>`
      : "";
    const feet = rank >= 1 ? `<ellipse cx="92" cy="211" rx="25" ry="13" fill="${accent}" opacity=".7"/><ellipse cx="166" cy="211" rx="25" ry="13" fill="${accent}" opacity=".7"/>` : "";
    const crown = rank >= 3 ? `<path d="M99 48l29-31 29 31-29 16z" fill="${glow}" stroke="${accent}" stroke-width="5"/>` : "";
    return `
      <div class="pet-visual ${escapeAttr(size)}" aria-hidden="true">
        <svg viewBox="0 0 256 256" role="img">
          <circle cx="128" cy="132" r="101" fill="${glow}" opacity=".18"/>
          ${wings}
          ${horns}
          ${crown}
          <g transform="translate(${128 - 128 * scale} ${148 - 148 * scale}) scale(${scale})">
            <path d="M61 143c0-54 32-91 67-91s67 37 67 91c0 47-29 79-67 79s-67-32-67-79z" fill="${body}" stroke="${accent}" stroke-width="7"/>
            <path d="M93 83c-4-27 10-49 33-64 7 31-1 54-25 72z" fill="${body}" stroke="${accent}" stroke-width="6"/>
            <circle cx="104" cy="137" r="9" fill="#1d2a2e"/>
            <circle cx="152" cy="137" r="9" fill="#1d2a2e"/>
            <path d="M111 166c12 11 24 11 36 0" fill="none" stroke="#1d2a2e" stroke-width="6" stroke-linecap="round"/>
            <circle cx="87" cy="154" r="12" fill="#fff" opacity=".3"/>
            <circle cx="169" cy="154" r="12" fill="#fff" opacity=".3"/>
          </g>
          ${feet}
        </svg>
      </div>
    `;
  }

  function buildResultSummary(team, result) {
    return `${team.teamName} 累積 ${Number(team.totalSteps || 0)} 步，在${result.mainArea}發現「${result.mainFinding}」，分析原因可能是${result.mainReason}。小隊提出「${result.proposal}」，並用「${result.slogan}」提醒大家一起守護校園。`;
  }

  function buildClassificationSummary(submissions) {
    const parts = submissions
      .filter((item) => item.classificationResult || item.identifiedItem)
      .map((item) => `${item.identifiedItem || ensureArray(item.trashTypes)[0] || "垃圾"}：${item.classificationResult || "未分類"}`);
    return parts.length ? parts.join("；") : "尚未完成垃圾辨識分類";
  }

  function buildAICaptainFeedback(team, submission) {
    const classificationText = submission.classificationResult
      ? `，並判斷它屬於「${submission.classificationResult}」`
      : "";
    return `${team.teamName} 完成了 ${submission.areaName || "校園"} 的探索任務！你們累積了 ${Number(submission.stepCount || 0)} 步，發現了「${submission.identifiedItem || submission.problemFound || "環境問題"}」${classificationText}。紫寶隊長提醒：下一步可以想想問題為什麼會出現在這裡，以及怎麼讓它下次不要再出現。`;
  }

  function buildAICaptainReportSummary(team, result) {
    return `紫寶隊長回饋：${team.teamName} 已整理出主要發現與改善提案，可以把「${result.slogan || "一起守護校園"}」作為宣導重點，邀請更多同學一起行動。`;
  }

  function teamLevelFromStage(stage) {
    const index = stageRank.indexOf(stage);
    return index >= 0 ? index + 1 : 1;
  }

  function numberValue(value) {
    const numeric = Number(value || 0);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
  }

  function stepTargetValue(...values) {
    const raw = values.find((value) => value !== undefined && value !== null && value !== "");
    return numberValue(raw);
  }

  function mainDeltaKey(delta) {
    return abilityOrder.reduce((best, key) => Number(delta[key] || 0) > Number(delta[best] || 0) ? key : best, abilityOrder[0]);
  }

  function buildAiPrompt(submissions) {
    const rows = submissions.map((item, index) => {
      return `${index + 1}. ${item.className} ${item.groupNo}｜第 ${item.week} 週｜地點：${item.areaName}｜路線：${item.routeName || "未填"}｜步數：${item.stepCount || 0}｜垃圾類型：${ensureArray(item.trashTypes).join("、")}｜辨識：${item.identifiedItem || "未填"}｜分類：${item.classificationResult || "未填"}｜分類理由：${item.classificationReason || "未填"}｜發現：${item.problemFound}｜原因：${item.possibleReason}｜改善：${item.improvementIdea}`;
    }).join("\n");

    return `你是一位國小高年級「淨芽小隊：校園健康冒險」課程顧問。以下是學生在《校園綠夥伴：環境復甦任務／淨芽小隊：校園健康冒險》中提交的校園探索、步數、垃圾辨識、分類與改善想法資料。請協助整理：

1. 最常出現垃圾或環境問題的校園區域
2. 學生累積步數與校園探索情形如何
3. 最常見的垃圾類型有哪些
4. 學生的分類判斷是否合理，有哪些需要提醒
5. 學生提出的可能原因有哪些共通點
6. 學生提出的改善方法中，哪些最具體、最可行
7. 各小隊的精靈能量或能力值可以給予什麼回饋
8. 可以提供哪些適合國小學生理解的健康與環境提醒
9. 可以整理成哪些全校宣導重點
10. 請生成一段可放入「淨芽小隊守護報告」的成果摘要

請用繁體中文、國小高年級能理解的語氣，並保持鼓勵、具體、可行。

學生資料：
${rows || "目前尚無學生回報資料。"}`;
  }

  async function withAction(fn) {
    try {
      await fn();
    } catch (error) {
      showToast(error.message || "資料處理失敗");
    }
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast("已複製");
    } catch {
      showToast("無法自動複製，可直接選取文字");
    }
  }

  function setCurrentTeam(team) {
    if (!team) {
      state.currentTeamId = "";
      safeStorageRemove(TEAM_ID_KEY);
      safeStorageRemove(CLASS_KEY);
      safeStorageRemove(GROUP_KEY);
      safeStorageRemove(TEAM_NAME_KEY);
      saveState();
      return;
    }
    state.currentTeamId = team.teamId;
    safeStorageSet(TEAM_ID_KEY, team.teamId);
    safeStorageSet(CLASS_KEY, team.className);
    safeStorageSet(GROUP_KEY, team.groupNo);
    safeStorageSet(TEAM_NAME_KEY, team.teamName);
    saveState();
  }

  function saveState() {
    try {
      const storedState = {
        ...state,
        settings: publicSettings(state.settings)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
    } catch {
      // localStorage may be unavailable in strict private browsing.
    }
  }

  function updateNav(route, team) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const target = link.getAttribute("data-nav");
      const active = target === "/" ? route === "/" : route.startsWith(target);
      link.classList.toggle("active", active);
    });

    document.querySelectorAll("[data-week-link]").forEach((link) => {
      const week = Number(link.getAttribute("data-week-link"));
      const completed = team ? team.completedWeeks.includes(week) : false;
      const locked = team ? week > Number(state.settings.currentWeek || 1) : week > 1;
      link.classList.toggle("complete", completed);
      link.classList.toggle("locked", locked);
    });
  }

  function getRoute() {
    const route = decodeURI(location.hash.replace(/^#/, "")) || "/";
    return route.startsWith("/") ? route : `/${route}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function renderError(message) {
    const canRetry = /連線|後端|載入|資料/.test(message);
    return `
      <section class="page">
        <div class="empty-state">
          <h2>${escapeHtml(message)}</h2>
          ${canRetry ? `<button class="primary-button" type="button" onclick="location.reload()">重新整理</button>` : ""}
        </div>
      </section>
    `;
  }

  function renderLoading() {
    return `
      <section class="page">
        <div class="empty-state">
          <h2>正在載入資料...</h2>
        </div>
      </section>
    `;
  }

  function formatDelta(delta = {}) {
    const parts = abilityOrder
      .filter((key) => Number(delta[key] || 0) > 0)
      .map((key) => `${abilityLabels[key]} +${delta[key]}`);
    return parts.length ? parts.join("、") : "能力值未變動";
  }

  function activeRows(rows) {
    return rows.filter((item) => item.active !== false && String(item.active).toLowerCase() !== "false");
  }

  function parseBadges(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return String(value).split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  }

  function ensureArray(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return String(value).split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  }

  function countBy(rows, key) {
    return rows.reduce((map, row) => {
      const name = row[key] || "未填寫";
      map.set(String(name), (map.get(String(name)) || 0) + 1);
      return map;
    }, new Map());
  }

  function countTrashTypes(rows) {
    return rows.reduce((map, row) => {
      ensureArray(row.trashTypes).forEach((type) => {
        map.set(type, (map.get(type) || 0) + 1);
      });
      return map;
    }, new Map());
  }

  function entriesFromMap(map) {
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name), "zh-Hant"));
  }

  function topName(map) {
    return entriesFromMap(map)[0]?.name || "";
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function makeId(prefix) {
    const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}${stamp}${random}`;
  }

  function dateText(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("zh-Hant-TW", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function text(value) {
    return String(value || "").trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return "";
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage may be unavailable.
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage may be unavailable.
    }
  }

  function safeSessionStorageGet(key) {
    try {
      return sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function safeSessionStorageSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // sessionStorage may be unavailable.
    }
  }

  function safeSessionStorageRemove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // sessionStorage may be unavailable.
    }
  }
})();
