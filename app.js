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
    stamina: "體力值",
    scout: "偵查值",
    cleanse: "淨化值",
    wisdom: "智慧值",
    influence: "影響力"
  };
  const stageRank = ["種子期", "幼體期", "成長期", "守護期"];
  const groupOptions = Array.from({ length: 8 }, (_, index) => `第${index + 1}組`);
  const amountOptions = ["少量", "中等", "很多"];
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
        gameTitle: "校園綠夥伴：環境復甦任務"
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
      pets: [
        {
          petId: "pet_leaf_001",
          petName: "小葉靈",
          description: "溫和、愛觀察",
          trait: "偵查值較高",
          active: true
        },
        {
          petId: "pet_step_001",
          petName: "步步獸",
          description: "活潑、愛探索",
          trait: "體力值較高",
          active: true
        },
        {
          petId: "pet_clean_001",
          petName: "淨淨鳥",
          description: "喜歡乾淨",
          trait: "淨化值較高",
          active: true
        },
        {
          petId: "pet_light_001",
          petName: "亮光鹿",
          description: "會發現問題",
          trait: "智慧值較高",
          active: true
        },
        {
          petId: "pet_bud_001",
          petName: "花芽龍",
          description: "成長速度快",
          trait: "影響力較高",
          active: true
        }
      ],
      missions: [
        {
          missionId: "M1",
          week: 1,
          title: "綠夥伴甦醒",
          story: "建立小隊，讓綠夥伴知道誰要一起守護校園。",
          instruction: "選定小隊與綠夥伴後，先預測可能的校園髒亂能量點。",
          unlockCondition: "建立小隊",
          active: true
        },
        {
          missionId: "M2",
          week: 2,
          title: "校園偵查任務",
          story: "走進校園，找出環境問題最明顯的地方。",
          instruction: "到校園指定區域觀察，記錄垃圾類型、數量感受與可能原因。",
          unlockCondition: "完成第 1 週任務",
          active: true
        },
        {
          missionId: "M3",
          week: 3,
          title: "熱點分析任務",
          story: "把觀察變成判斷，找出問題背後的原因。",
          instruction: "選定一個熱點，分析常見垃圾與形成原因，提出具體改善想法。",
          unlockCondition: "完成至少一筆偵查回報",
          active: true
        },
        {
          missionId: "M4",
          week: 4,
          title: "校園守護任務",
          story: "把小隊發現整理成可以讓更多人看見的行動。",
          instruction: "完成宣導口號、行動承諾與成果卡，讓綠夥伴進入守護期。",
          unlockCondition: "完成熱點分析",
          active: true
        }
      ],
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
        pets: saved.pets?.length ? saved.pets : base.pets,
        missions: saved.missions?.length ? saved.missions : base.missions,
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
    state.pets = initialData.pets?.length ? initialData.pets : state.pets;
    state.missions = initialData.missions?.length ? initialData.missions : state.missions;
    if (API_URL) delete state.settings.teacherCode;
    saveState();
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
          missions: activeRows(state.missions)
        };
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
    const selectedPetId = text(payload.selectedPetId);
    const customPetName = text(payload.customPetName);

    if (!className) throw new Error("請選擇班級");
    if (!groupNo) throw new Error("請選擇組別");
    if (!teamName) throw new Error("請輸入小隊名稱");
    if (!selectedPetId) throw new Error("請選擇一位綠夥伴");
    if (!customPetName) throw new Error("請輸入綠夥伴名稱");

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
      customPetName,
      stage: "種子期",
      stamina: 5,
      scout: 0,
      cleanse: 0,
      wisdom: 0,
      influence: 5,
      badges: ["甦醒徽章"],
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
      note: "建立小隊與命名綠夥伴"
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
    if (!text(payload.areaName)) throw new Error("請選擇調查地點");
    if (!text(payload.problemFound)) throw new Error("請填寫發現問題");
    if (!Array.isArray(payload.trashTypes) || payload.trashTypes.length === 0) {
      throw new Error("請選擇垃圾類型");
    }
    if (!text(payload.amountLevel)) throw new Error("請選擇數量感受");
    if (!text(payload.possibleReason)) throw new Error("請填寫可能原因");
    if (!text(payload.improvementIdea)) throw new Error("請填寫改善想法");

    const now = new Date().toISOString();
    const submission = {
      submissionId: makeId("S"),
      createdAt: now,
      teamId: team.teamId,
      className: team.className,
      groupNo: team.groupNo,
      week,
      missionId: payload.missionId || mission.missionId,
      areaName: text(payload.areaName),
      problemFound: text(payload.problemFound),
      trashTypes: payload.trashTypes.map(text).filter(Boolean),
      amountLevel: text(payload.amountLevel),
      possibleReason: text(payload.possibleReason),
      improvementIdea: text(payload.improvementIdea),
      photoNote: text(payload.photoNote),
      photoUrl: text(payload.photoUrl),
      reflection: text(payload.reflection),
      scoreApplied: true
    };

    const delta = calculateSubmissionDelta(submission);
    state.submissions.push(submission);
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
      note: `第 ${week} 週任務回報`
    });
    refreshTeamProgress(team.teamId);
    saveState();
    return { submission, team: decorateTeam(team), delta };
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
      mainArea: text(payload.mainArea),
      mainFinding: text(payload.mainFinding),
      mainReason: text(payload.mainReason),
      proposal: text(payload.proposal),
      slogan: text(payload.slogan),
      commitment: text(payload.commitment),
      finalStage: "守護期",
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
        note: "完成成果卡"
      });
    }

    refreshTeamProgress(team.teamId);
    saveState();
    return { result, team: decorateTeam(team) };
  }

  function calculateSubmissionDelta(submission) {
    return {
      stamina: submission.areaName ? 5 : 0,
      scout: submission.problemFound ? 10 : 0,
      cleanse: submission.improvementIdea ? 10 : 0,
      wisdom: (submission.trashTypes.length ? 5 : 0) + (submission.possibleReason ? 10 : 0),
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
    badges.add("甦醒徽章");

    let stage = "種子期";
    if (submissions.some((item) => Number(item.week) === 2)) {
      stage = "幼體期";
      badges.add("校園偵查徽章");
    }
    if (submissions.some((item) => Number(item.week) === 3)) {
      stage = "成長期";
      badges.add("熱點分析徽章");
    }
    if (submissions.some((item) => text(item.improvementIdea))) {
      badges.add("改善提案徽章");
    }
    if (result) {
      stage = "守護期";
      badges.add("校園守護徽章");
      if (text(result.slogan)) badges.add("影響力徽章");
    }

    team.stage = stage;
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
      badges: parseBadges(team.badges)
    };
    cleanTeam.pet = state.pets.find((pet) => pet.petId === cleanTeam.selectedPetId) || null;
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
    const results = getAllResults().results;
    return {
      summary: {
        teamCount: teams.length,
        submissionCount: submissions.length,
        resultCount: results.length,
        topArea: topName(countBy(submissions, "areaName")),
        topTrash: topName(countTrashTypes(submissions))
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
      classCounts: entriesFromMap(countBy(teams, "className")),
      latestSubmissions: submissions.slice(0, 8)
    };
  }

  function buildStatsData() {
    const submissions = [...state.submissions];
    const teams = state.teams.map((team) => decorateTeam(team));
    return {
      hotspotRanking: entriesFromMap(countBy(submissions, "areaName")),
      trashRanking: entriesFromMap(countTrashTypes(submissions)),
      reasons: submissions.map((item) => item.possibleReason).filter(Boolean),
      improvements: submissions.map((item) => item.improvementIdea).filter(Boolean),
      teamScores: teams
        .map((team) => ({
          teamId: team.teamId,
          className: team.className,
          groupNo: team.groupNo,
          teamName: team.teamName,
          total: abilityOrder.reduce((sum, key) => sum + Number(team[key] || 0), 0),
          stage: team.stage
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
              <div class="eyebrow">四週任務</div>
              <h1>校園綠夥伴：環境復甦任務</h1>
              <p class="lead">建立小隊，帶著綠夥伴完成校園偵查、熱點分析與守護行動。</p>
              <div class="hero-actions">
                <a class="primary-button" href="#/team">建立小隊</a>
                <a class="secondary-button" href="#/teacher">教師端</a>
              </div>
            </div>
            <div class="pet-showcase">${petVisual("pet_leaf_001", "種子期")}</div>
          </div>
          ${renderMissionPreview(null)}
        </section>
      `;
      return;
    }

    app.innerHTML = `
      <section class="page">
        <div class="hero-band">
          <div>
            <div class="eyebrow">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}</div>
            <h1>${escapeHtml(team.teamName)} 與 ${escapeHtml(team.customPetName)} 正在${escapeHtml(team.stage)}</h1>
            <p class="lead">目前已完成 ${team.completedWeeks.length} 個任務節點，下一步可前往任務地圖或查看成長狀態。</p>
            <div class="hero-actions">
              <a class="primary-button" href="#/map">前往任務地圖</a>
              <a class="secondary-button" href="#/growth">查看成長</a>
            </div>
          </div>
          <div class="pet-showcase">${petVisual(team.selectedPetId, team.stage)}</div>
        </div>
        ${renderTeamStrip(team)}
        ${renderMissionPreview(team)}
      </section>
    `;
  }

  function renderTeamPage(team) {
    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">小隊建立</div>
            <h1>選擇班級、組別與綠夥伴</h1>
          </div>
          ${team ? `<a class="secondary-button" href="#/map">回任務地圖</a>` : ""}
        </div>
        <div class="grid two">
          <div class="panel">
            <h2>建立新小隊</h2>
            <form id="createTeamForm">
              <div class="form-grid">
                ${selectField("className", "班級", state.classes.map((item) => item.className), "", true)}
                ${selectField("groupNo", "組別", groupOptions, "", true)}
              </div>
              <div class="form-grid">
                ${inputField("teamName", "小隊名稱", "例如：綠光小隊", "", true)}
                ${inputField("customPetName", "綠夥伴名稱", "例如：阿葉隊長", "", true)}
              </div>
              <fieldset class="field">
                <legend>選擇綠夥伴</legend>
                <div class="pet-grid">
                  ${state.pets.map((pet, index) => `
                    <label class="pet-option">
                      <input type="radio" name="selectedPetId" value="${escapeAttr(pet.petId)}" ${index === 0 ? "checked" : ""}>
                      ${petVisual(pet.petId, "種子期", "small")}
                      <strong>${escapeHtml(pet.petName)}</strong>
                      <span>${escapeHtml(pet.description)}</span>
                      <span>${escapeHtml(pet.trait)}</span>
                    </label>
                  `).join("")}
                </div>
              </fieldset>
              <div class="button-row">
                <button class="primary-button" type="submit">建立小隊</button>
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
        showToast("小隊已建立，甦醒徽章已解鎖");
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
            <div class="eyebrow">任務地圖</div>
            <h1>${escapeHtml(team.teamName)} 的四週進度</h1>
          </div>
          <a class="secondary-button" href="#/growth">成長狀態</a>
        </div>
        ${renderTeamStrip(team)}
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
        <div class="panel">
          <form id="missionForm">
            <div class="form-grid">
              ${selectField("areaName", "調查地點", state.areas.map((item) => item.areaName), "", true)}
              ${selectField("amountLevel", "數量感受", amountOptions, "", true)}
            </div>
            ${textareaField("problemFound", "發現問題", "寫下你們看到的環境問題", "", true)}
            <fieldset class="field">
              <legend>垃圾類型</legend>
              <div class="check-grid">
                ${trashOptions.map((item) => `
                  <label class="check-pill">
                    <input type="checkbox" name="trashTypes" value="${escapeAttr(item)}">
                    <span>${escapeHtml(item)}</span>
                  </label>
                `).join("")}
              </div>
            </fieldset>
            ${textareaField("possibleReason", "可能原因", "你們覺得問題為什麼會發生", "", true)}
            ${textareaField("improvementIdea", "改善想法", "提出一個小隊做得到或能倡議的做法", "", true)}
            <div class="form-grid">
              ${inputField("photoNote", "照片說明", "可留空", "", false)}
              ${inputField("photoUrl", "任務照片連結", "可留空", "", false)}
            </div>
            ${textareaField("reflection", "小組反思", "可留空", "", false)}
            <div class="button-row">
              <button class="primary-button" type="submit">提交任務回報</button>
              ${week === 4 ? `<a class="secondary-button" href="#/result">填寫成果卡</a>` : ""}
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

  function renderGrowthPage(team) {
    if (!team) {
      renderNeedTeam("先建立小隊，再查看綠夥伴成長");
      return;
    }

    app.innerHTML = `
      <section class="page">
        <div class="page-head">
          <div>
            <div class="eyebrow">綠夥伴成長</div>
            <h1>${escapeHtml(team.customPetName)} 目前是${escapeHtml(team.stage)}</h1>
          </div>
          <a class="primary-button" href="#/map">繼續任務</a>
        </div>
        <div class="grid two">
          <div class="panel">
            <div class="pet-showcase">${petVisual(team.selectedPetId, team.stage)}</div>
            <div class="badge-list">${team.badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}</div>
          </div>
          <div class="panel">
            <h2>能力值</h2>
            ${renderMeters(team)}
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
      renderNeedTeam("先建立小隊，再產生成果卡");
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
            <div class="eyebrow">成果卡</div>
            <h1>${escapeHtml(team.teamName)} 的校園綠夥伴成果卡</h1>
          </div>
          <a class="secondary-button" href="#/growth">成長狀態</a>
        </div>
        ${result ? renderResultCard(team, result) : ""}
        <div class="panel">
          <h2>${result ? "更新成果卡" : "建立成果卡"}</h2>
          <form id="resultForm">
            <div class="form-grid">
              ${selectField("mainArea", "主要調查地點", knownAreas, result?.mainArea || "", true)}
              ${inputField("slogan", "宣導口號", "例如：多走三步，校園乾淨一大步", result?.slogan || "", true)}
            </div>
            ${textareaField("mainFinding", "主要發現", "小隊最重要的環境發現", result?.mainFinding || "", true)}
            ${textareaField("mainReason", "可能原因", "小隊分析出的原因", result?.mainReason || "", true)}
            ${textareaField("proposal", "改善提案", "具體可行的改善方法", result?.proposal || "", true)}
            ${textareaField("commitment", "行動承諾", "小隊未來願意持續做到的行動", result?.commitment || "", true)}
            <button class="primary-button" type="submit">${result ? "更新成果卡" : "產生成果卡"}</button>
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
        showToast("成果卡已儲存，綠夥伴進入守護期");
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
            <h1>任務資料總覽</h1>
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
        ${statCard("成果卡", dashboard.summary.resultCount)}
        ${statCard("熱門區域", dashboard.summary.topArea || "尚無")}
        ${statCard("常見垃圾", dashboard.summary.topTrash || "尚無")}
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
          ["班級", "組別", "隊名", "綠夥伴", "階段", "徽章"],
          dashboard.teams.map((team) => [
            team.className,
            team.groupNo,
            team.teamName,
            team.customPetName,
            team.stage,
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
          ["時間", "班級", "組別", "週次", "地點", "垃圾類型", "發現問題", "改善想法"],
          dashboard.submissions.map((item) => [
            dateText(item.createdAt),
            item.className,
            item.groupNo,
            `第 ${item.week} 週`,
            item.areaName,
            ensureArray(item.trashTypes).join("、"),
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
      <div class="panel">
        <h2>各組能力值排行</h2>
        ${renderTable(
          ["班級", "組別", "隊名", "總分", "階段"],
          stats.teamScores.map((team) => [team.className, team.groupNo, team.teamName, team.total, team.stage]),
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
        <h2>成果卡管理</h2>
        ${dashboard.results.length ? dashboard.results.map((result) => renderResultCard(result.team, result)).join("") : `
          <div class="empty-state">目前尚無成果卡</div>
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
        ${petVisual(team.selectedPetId, team.stage, "small")}
        <div>
          <div class="meta">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}</div>
          <h2>${escapeHtml(team.teamName)}｜${escapeHtml(team.customPetName)}</h2>
          <div class="chip-list">
            <span class="chip">${escapeHtml(team.stage)}</span>
            <span class="chip">${team.submissions.length} 筆回報</span>
          </div>
        </div>
        <a class="secondary-button" href="#/growth">成長</a>
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
            <div class="meta">${dateText(item.createdAt)}｜第 ${escapeHtml(item.week)} 週｜${escapeHtml(item.areaName || "")}</div>
            <h3>${escapeHtml(item.problemFound || "")}</h3>
            <div class="chip-list">${ensureArray(item.trashTypes).map((type) => `<span class="chip">${escapeHtml(type)}</span>`).join("")}</div>
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
          ${petVisual(team.selectedPetId, "守護期", "medium")}
          <div>
            <div class="eyebrow">${escapeHtml(team.className)} ${escapeHtml(team.groupNo)}</div>
            <h2>${escapeHtml(team.teamName)}｜${escapeHtml(team.customPetName)}</h2>
            <div class="badge-list">${team.badges.map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}</div>
          </div>
        </div>
        <div class="result-facts">
          ${fact("最終型態", result.finalStage || team.stage)}
          ${fact("主要地點", result.mainArea)}
          ${fact("主要發現", result.mainFinding)}
          ${fact("可能原因", result.mainReason)}
          ${fact("改善提案", result.proposal)}
          ${fact("宣導口號", result.slogan)}
          ${fact("行動承諾", result.commitment)}
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
      ["results", "成果卡", "#/teacher/results"],
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

  function petVisual(petId, stage, size = "") {
    const rank = Math.max(0, stageRank.indexOf(stage));
    const scale = 1 + rank * 0.08;
    const style = {
      pet_leaf_001: ["#6fbd63", "#2f7c52", "#ffdf6d"],
      pet_step_001: ["#83c7df", "#2f7ca8", "#f2c14e"],
      pet_clean_001: ["#f7f8ff", "#6aa1b8", "#f2c14e"],
      pet_light_001: ["#ffe18a", "#bc7b3a", "#ffffff"],
      pet_bud_001: ["#90cf6f", "#d96b5d", "#f4d35e"]
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
    return `${team.teamName} 在${result.mainArea}發現「${result.mainFinding}」，分析原因可能是${result.mainReason}。小隊提出「${result.proposal}」，並用「${result.slogan}」提醒大家一起守護校園。`;
  }

  function buildAiPrompt(submissions) {
    const rows = submissions.map((item, index) => {
      return `${index + 1}. ${item.className} ${item.groupNo}｜第 ${item.week} 週｜地點：${item.areaName}｜垃圾類型：${ensureArray(item.trashTypes).join("、")}｜發現：${item.problemFound}｜原因：${item.possibleReason}｜改善：${item.improvementIdea}`;
    }).join("\n");

    return `你是一位國小高年級環境教育與綜合活動課程顧問。以下是學生在《校園綠夥伴：環境復甦任務》中提交的校園觀察資料。請協助整理：

1. 最常出現垃圾或環境問題的校園區域
2. 最常見的垃圾類型
3. 學生提出的可能原因
4. 學生提出的改善方法
5. 哪些改善方法最具體、最可行
6. 可以提供給學生的回饋與追問
7. 可以作為全校宣導的重點句子

請用繁體中文、國小高年級能理解的方式整理。

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
