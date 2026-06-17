  (() => {
    const tokenKey = "demoapp-jwt";
    const guestKey = "demoapp-guest";
    const sessionUserKey = "demoapp-session-user";
    const languageKey = "demoapp-language";
    const avatarKey = "demoapp-player-avatar";

  const supportedLanguages = ["uk", "en", "de"];
  let translations = {};

  async function loadTranslations(language) {
    const normalized = supportedLanguages.includes(language) ? language : "uk";
    const fallbackResponse = await fetch("/locales/uk.json");
    const fallbackTranslations = await fallbackResponse.json();

    if (normalized === "uk") {
      translations = { uk: fallbackTranslations };
      return normalized;
    }

    try {
      const response = await fetch(`/locales/${normalized}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load locale ${normalized}`);
      }

      const localeTranslations = await response.json();
      translations = {
        uk: fallbackTranslations,
        [normalized]: localeTranslations
      };
      return normalized;
    } catch (_) {
      translations = { uk: fallbackTranslations };
      return "uk";
    }
  }

    const state = {
      currentGame: null,
      currentBoard: null,
      selectedQuestion: null,
      currentPlayerId: null,
      liveClient: null,
      cameraStream: null,
      cameraMode: null,
      refreshTimerId: null,
      firstBuzzPlayerId: null,
      finalSubmissions: [],
    eventLog: [],
    currentMenuView: "home",
    sessionMode: "anonymous",
    currentBuilderPack: null,
    currentBuilderBoard: null,
    currentBuilderRoundId: null,
    currentLanguage: localStorage.getItem(languageKey) || "en"
  };

  const authScreen = document.getElementById("auth-screen");
  const menuScreen = document.getElementById("menu-screen");
  const sessionTitle = document.getElementById("session-title");
  const sessionStatus = document.getElementById("session-status");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const guestForm = document.getElementById("guest-form");
  const languageSelect = document.getElementById("language-select");
  const logoutBtn = document.getElementById("logout-btn");
  const playerForm = document.getElementById("player-form");
  const stagePlayerForm = document.getElementById("stage-player-form");
    const stagePlayerNameInput = document.getElementById("stage-player-name-input");
    const hostStageBackBtn = document.getElementById("host-stage-back-btn");
    const hostAvatar = document.getElementById("host-avatar");
    const hostAvatarNote = document.getElementById("host-avatar-note");
    const hostCameraToggleBtn = document.getElementById("host-camera-toggle-btn");
    const hostDisplayName = document.getElementById("host-display-name");
    const hostDisplayRole = document.getElementById("host-display-role");
    const hostConsoleGameName = document.getElementById("host-console-game-name");
  const hostConsoleGameMeta = document.getElementById("host-console-game-meta");
  const hostQuestionPrice = document.getElementById("host-question-price");
    const hostQuestionText = document.getElementById("host-question-text");
    const hostAnswerPreview = document.getElementById("host-answer-preview");
    const hostAnsweringPlayer = document.getElementById("host-answering-player");
    const hostAnswerActions = document.getElementById("host-answer-actions");
    const finalSubmissionsPanel = document.getElementById("final-submissions-panel");
    const playerOpenQuestionBtn = document.getElementById("player-open-question-btn");
      const hostCorrectBtn = document.getElementById("host-correct-btn");
      const hostIncorrectBtn = document.getElementById("host-incorrect-btn");
    const hostBoard = document.getElementById("host-board");
    const hostBoardEmpty = document.getElementById("host-board-empty");
    const hostPlayersRow = document.getElementById("host-players-row");
    const playerStageBackBtn = document.getElementById("player-stage-back-btn");
    const playerAvatar = document.getElementById("player-avatar");
    const playerDisplayName = document.getElementById("player-display-name");
    const playerDisplayRole = document.getElementById("player-display-role");
    const playerCameraToggleBtn = document.getElementById("player-camera-toggle-btn");
    const playerQuestionPrice = document.getElementById("player-question-price");
    const playerQuestionText = document.getElementById("player-question-text");
    const finalAnswerForm = document.getElementById("final-answer-form");
    const finalWagerInput = document.getElementById("final-wager-input");
    const finalAnswerInput = document.getElementById("final-answer-input");
    const finalAnswerStatus = document.getElementById("final-answer-status");
    const playerPlayersRow = document.getElementById("player-players-row");

  const menuCreateGameBtn = document.getElementById("menu-create-game-btn");
  const menuJoinGameBtn = document.getElementById("menu-join-game-btn");
  const menuPackBuilderBtn = document.getElementById("menu-pack-builder-btn");
  const menuCommunityPacksBtn = document.getElementById("menu-community-packs-btn");
  const menuSettingsBtn = document.getElementById("menu-settings-btn");
  const menuExitBtn = document.getElementById("menu-exit-btn");
  const backMenuButtons = document.querySelectorAll(".back-menu-btn");

  const menuViews = {
    home: document.getElementById("home-view"),
      createGame: document.getElementById("create-game-view"),
      hostStage: document.getElementById("host-stage-view"),
      joinGame: document.getElementById("join-game-view"),
      playerStage: document.getElementById("player-stage-view"),
      packBuilder: document.getElementById("pack-builder-view"),
    communityPacks: document.getElementById("community-packs-view"),
    settings: document.getElementById("settings-view")
    };

    const packSelect = document.getElementById("pack-select");
    const joinCodeInput = document.getElementById("join-code-input");
    const playerNameInput = document.getElementById("player-name-input");
    const currentGameCard = document.getElementById("current-game-card");
  const currentGameName = document.getElementById("current-game-name");
  const currentGameMeta = document.getElementById("current-game-meta");
  const playerGameName = document.getElementById("player-game-name");
  const playerGameMeta = document.getElementById("player-game-meta");
  const scoreboard = document.getElementById("scoreboard");
  const scoreboardEmpty = document.getElementById("scoreboard-empty");
  const playerSelect = document.getElementById("player-select");
  const liveStatus = document.getElementById("live-status");
  const firstBuzzDisplay = document.getElementById("first-buzz-display");
  const lastEventDisplay = document.getElementById("last-event-display");
  const eventLog = document.getElementById("event-log");
  const board = document.getElementById("board");
  const boardEmpty = document.getElementById("board-empty");
  const playerBoard = document.getElementById("player-board");
  const playerBoardEmpty = document.getElementById("player-board-empty");
  const packSummary = document.getElementById("pack-summary");
  const packName = document.getElementById("pack-name");
  const packDescription = document.getElementById("pack-description");

    const createGameBtn = document.getElementById("create-game-btn");
    const reloadBoardBtn = document.getElementById("reload-board-btn");
    const findGameBtn = document.getElementById("find-game-btn");
    const connectLiveBtn = document.getElementById("connect-live-btn");
  const buzzBtn = document.getElementById("buzz-btn");

  const modal = document.getElementById("question-modal");
  const modalCategory = document.getElementById("modal-category");
  const modalPrice = document.getElementById("modal-price");
  const modalMedia = document.getElementById("modal-media");
  const modalQuestionText = document.getElementById("modal-question-text");
    const modalAnswerBlock = document.getElementById("modal-answer-block");
    const modalAnswerText = document.getElementById("modal-answer-text");
  const modalPlayerTools = document.getElementById("modal-player-tools");
  const modalBuzzBtn = document.getElementById("modal-buzz-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const showAnswerBtn = document.getElementById("show-answer-btn");
  const markUsedBtn = document.getElementById("mark-used-btn");
  const toast = document.getElementById("toast");

  const builderLoadPacksBtn = document.getElementById("builder-load-packs-btn");
  const builderPackSelect = document.getElementById("builder-pack-select");
  const builderPackForm = document.getElementById("builder-pack-form");
  const builderPackNameInput = document.getElementById("builder-pack-name-input");
  const builderPackDescriptionInput = document.getElementById("builder-pack-description-input");
  const builderRoundSelect = document.getElementById("builder-round-select");
  const builderRoundForm = document.getElementById("builder-round-form");
  const builderRoundNameInput = document.getElementById("builder-round-name-input");
  const builderRoundOrderInput = document.getElementById("builder-round-order-input");
  const builderRoundTypeSelect = document.getElementById("builder-round-type-select");
  const builderCurrentPackName = document.getElementById("builder-current-pack-name");
  const builderCurrentPackMeta = document.getElementById("builder-current-pack-meta");
  const builderCategoryForm = document.getElementById("builder-category-form");
  const builderCategoryNameInput = document.getElementById("builder-category-name-input");
  const builderCategoryOrderInput = document.getElementById("builder-category-order-input");
  const builderQuestionForm = document.getElementById("builder-question-form");
  const builderQuestionCategorySelect = document.getElementById("builder-question-category-select");
  const builderQuestionTextInput = document.getElementById("builder-question-text-input");
  const builderQuestionAnswerInput = document.getElementById("builder-question-answer-input");
  const builderQuestionPriceInput = document.getElementById("builder-question-price-input");
  const builderQuestionOrderInput = document.getElementById("builder-question-order-input");
  const builderQuestionMediaUrlInput = document.getElementById("builder-question-media-url-input");
  const builderQuestionMediaTypeInput = document.getElementById("builder-question-media-type-input");
  const builderBoard = document.getElementById("builder-board");
  const builderBoardEmpty = document.getElementById("builder-board-empty");
  const avatarSettingsForm = document.getElementById("avatar-settings-form");
  const settingsAvatarInput = document.getElementById("settings-avatar-input");
  const settingsAvatarPreview = document.getElementById("settings-avatar-preview");
  const settingsAvatarStatus = document.getElementById("settings-avatar-status");
  const settingsRemoveAvatarBtn = document.getElementById("settings-remove-avatar-btn");

  function t(key, vars = {}) {
    const fallbackLocale = translations.uk || {};
    const locale = translations[state.currentLanguage] || fallbackLocale;
    let value = locale[key] ?? fallbackLocale[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }

  function isFinalRound(boardDto = state.currentBoard) {
    return boardDto?.roundType === "FINAL";
  }

  function getCurrentPlayer() {
    return state.currentGame?.players?.find((player) => player.id === state.currentPlayerId) || null;
  }

  async function setLanguage(language) {
    const loadedLanguage = await loadTranslations(language);
    state.currentLanguage = loadedLanguage;
    localStorage.setItem(languageKey, state.currentLanguage);
    applyTranslations();
  }

  function applyTranslations() {
    document.documentElement.lang = t("htmlLang");
    document.title = t("pageTitle");
    languageSelect.value = state.currentLanguage;

    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };
    const setLabelText = (selector, value) => {
      const element = document.querySelector(selector);
      if (!element) {
        return;
      }

      const firstTextNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (firstTextNode) {
        firstTextNode.textContent = `${value}\n`;
        return;
      }

      element.prepend(document.createTextNode(`${value}\n`));
    };
    const setPlaceholder = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) {
        element.placeholder = value;
      }
    };

    setText(".hero h1", t("heroTitle"));
    setText(".hero-copy", t("heroCopy"));
    setText(".language-switch span", t("languageLabel"));
    setText(".hero-badge span", t("stageLabel"));
    setText(".hero-badge strong", t("stageValue"));
    setText("#auth-screen .panel-heading h2", t("authTitle"));
    setText("#auth-screen .panel-heading p", t("authSubtitle"));
    setText("#register-form h3", t("registerTitle"));
    setText("#register-form .auth-card-head p", t("registerSubtitle"));
    setLabelText("#register-form label:nth-of-type(1)", t("usernameLabel"));
    setLabelText("#register-form label:nth-of-type(2)", t("passwordLabel"));
    setText("#register-form button", t("createAccount"));
    setText("#login-form h3", t("loginTitle"));
    setText("#login-form .auth-card-head p", t("loginSubtitle"));
    setLabelText("#login-form label:nth-of-type(1)", t("usernameLabel"));
    setLabelText("#login-form label:nth-of-type(2)", t("passwordLabel"));
    setText("#login-form button", t("loginButton"));
    setText("#guest-form h3", t("guestTitle"));
    setText("#guest-form .auth-card-head p", t("guestSubtitle"));
    setLabelText("#guest-form label", t("nicknameLabel"));
    setText("#guest-note", t("guestNote"));
    setText("#register-password-note", t("registerPasswordNote"));
    setText("#guest-form button", t("guestButton"));
    setPlaceholder("#guest-nickname", t("guestPlaceholder"));
    setText(".start-feature-card:nth-of-type(1) h3", t("startPackBuilderTitle"));
    setText(".start-feature-card:nth-of-type(1) p", t("startPackBuilderText"));
    setText(".start-feature-card:nth-of-type(2) h3", t("startCommunityTitle"));
    setText(".start-feature-card:nth-of-type(2) p", t("startCommunityText"));
    setText(".start-feature-card:nth-of-type(3) h3", t("startCompeteTitle"));
    setText(".start-feature-card:nth-of-type(3) p", t("startCompeteText"));
    setText(".topbar-panel .eyebrow", t("mainMenuEyebrow"));
    setText("#logout-btn", t("logout"));
    setText(".menu-panel h3", t("menuTitle"));
    setText("#menu-create-game-btn", t("menuCreateGame"));
    setText("#menu-join-game-btn", t("menuJoinGame"));
    setText("#menu-pack-builder-btn", t("menuPackBuilder"));
    setText("#menu-community-packs-btn", t("menuCommunityPacks"));
    setText("#menu-settings-btn", t("menuSettings"));
    setText("#menu-exit-btn", t("logout"));
    setText("#home-view .panel-heading h2", t("homeTitle"));
    setText("#home-view .panel-heading p", t("homeSubtitle"));
    setText("#home-view .menu-card:nth-of-type(1) h3", t("homeCard1Title"));
    setText("#home-view .menu-card:nth-of-type(1) p", t("homeCard1Text"));
    setText("#home-view .menu-card:nth-of-type(2) h3", t("homeCard2Title"));
    setText("#home-view .menu-card:nth-of-type(2) p", t("homeCard2Text"));
    setText("#home-view .menu-card:nth-of-type(3) h3", t("homeCard3Title"));
    setText("#home-view .menu-card:nth-of-type(3) p", t("homeCard3Text"));
      setText("#create-game-view .subscreen-header .eyebrow", t("hostEyebrow"));
      setText("#create-game-view .subscreen-header h2", t("createGameTitle"));
      setText("#create-game-view .panel-heading h2", t("createGamePanelTitle"));
      setText("#create-game-view .panel-heading p", t("createGamePanelText"));
      setText("#host-stage-eyebrow", t("hostStageEyebrow"));
      setText("#host-stage-title", t("hostStageTitle"));
      setText("#host-stage-back-btn", t("hostStageBack"));
      setText("#host-console-chip", t("hostConsoleChip"));
      setText("#host-avatar-note", t("hostAvatarNote"));
      setText("#host-display-role", t("hostRole"));
      setText("#host-question-chip", t("hostQuestionChip"));
    setText("#host-correct-btn", t("hostCorrect"));
    setText("#host-incorrect-btn", t("hostIncorrect"));
    setText("#stage-add-player-title", t("addPlayerTitle"));
    setText("#stage-player-name-label", t("playerNameLabel"));
    setText("#stage-add-player-btn", t("addPlayerButton"));
    document.querySelectorAll(".back-menu-btn").forEach((btn) => btn.textContent = t("backToMenu"));
    setText("#create-game-view .game-setup-panel .panel-heading h2", t("newGameTitle"));
    setText("#create-game-view .game-setup-panel .panel-heading p", t("newGameText"));
    setText("#load-packs-btn", t("loadPacks"));
      setLabelText("#create-game-view label:nth-of-type(1)", t("packLabel"));
      setText("#create-game-btn", t("createGameButton"));
    setText("#current-game-card .game-chip", t("currentGameChip"));
    setText("#player-form h3", t("addPlayerTitle"));
    setLabelText("#player-form label", t("playerNameLabel"));
    setPlaceholder("#player-name-input", t("playerNamePlaceholder"));
    setText("#add-player-btn", t("addPlayerButton"));
    setText(".scoreboard-panel .panel-heading h2", t("scoreboardTitle"));
    setText(".scoreboard-panel .panel-heading p", t("scoreboardText"));
    setText("#board-empty", t("boardEmpty"));
    setText("#scoreboard-empty", t("scoreboardEmpty"));
    setText(".board-panel .panel-heading h2", t("hostBoardTitle"));
    setText(".board-panel .panel-heading p", t("hostBoardText"));
    setText("#reload-board-btn", t("reloadBoard"));
      setText("#join-game-view .subscreen-header .eyebrow", t("playerEyebrow"));
      setText("#join-game-view .subscreen-header h2", t("joinGameTitle"));
      setText(".join-code-panel .panel-heading h2", t("connectTitle"));
      setText(".join-code-panel .panel-heading p", t("connectText"));
      setText("#find-game-btn", t("findGameByCode"));
      setLabelText(".join-code-panel label:nth-of-type(1)", t("joinCodeLabel"));
      setPlaceholder("#join-code-input", t("joinCodePlaceholder"));
      setText("#player-stage-eyebrow", t("playerStageEyebrow"));
      setText("#player-stage-title", t("playerStageTitle"));
      setText("#player-stage-back-btn", t("playerStageBack"));
      setText("#player-console-chip", t("hostConsoleChip"));
      setText("#player-display-role", t("playerRole"));
      setText("#player-question-chip", t("playerQuestionChip"));
      setText("#buzz-btn", t("buzzButton"));
      setText("#player-open-question-btn", t("openQuestionButton"));
      setText("#modal-buzz-btn", t("buzzButton"));
      setText(".buzz-card:nth-of-type(1) .buzz-label", t("firstBuzzLabel"));
      setText(".buzz-card:nth-of-type(2) .buzz-label", t("lastEventLabel"));
    setText("#player-board-empty", t("playerBoardEmpty"));
    setText(".event-log-panel .panel-heading h2", t("eventLogTitle"));
    setText(".event-log-panel .panel-heading p", t("eventLogText"));
    setText("#pack-builder-view .subscreen-header .eyebrow", t("packBuilderEyebrow"));
    setText("#pack-builder-view .subscreen-header h2", t("packBuilderTitle"));
    setText("#pack-builder-view .placeholder-panel h3", t("nextStepTitle"));
    setText("#pack-builder-view .placeholder-panel p", t("packBuilderText"));
    setText("#builder-pack-section-title", t("builderPackSectionTitle"));
    setText("#builder-pack-section-text", t("builderPackSectionText"));
    setText("#builder-load-packs-btn", t("builderLoadPacks"));
    setText("#builder-existing-pack-label", t("builderExistingPack"));
    setText("#builder-pack-name-label", t("builderPackName"));
    setText("#builder-pack-description-label", t("builderPackDescription"));
    setText("#builder-create-pack-btn", t("builderCreatePack"));
    setText("#builder-round-section-title", t("builderRoundSectionTitle"));
    setText("#builder-round-section-text", t("builderRoundSectionText"));
    setText("#builder-existing-round-label", t("builderExistingRound"));
    setText("#builder-round-name-label", t("builderRoundName"));
    setText("#builder-round-order-label", t("builderOrder"));
    setText("#builder-round-type-label", t("builderRoundType"));
    setText("#builder-create-round-btn", t("builderCreateRound"));
    setText("#builder-category-section-title", t("builderCategorySectionTitle"));
    setText("#builder-category-section-text", t("builderCategorySectionText"));
    setText("#builder-category-name-label", t("builderCategoryName"));
    setText("#builder-category-order-label", t("builderOrder"));
    setText("#builder-add-category-btn", t("builderAddCategory"));
    setText("#builder-question-section-title", t("builderQuestionSectionTitle"));
    setText("#builder-question-section-text", t("builderQuestionSectionText"));
    setText("#builder-question-category-label", t("builderQuestionCategory"));
    setText("#builder-question-text-label", t("builderQuestionText"));
    setText("#builder-question-answer-label", t("builderQuestionAnswer"));
    setText("#builder-question-price-label", t("builderQuestionPrice"));
    setText("#builder-question-order-label", t("builderOrder"));
    setText("#builder-question-media-url-label", t("builderMediaUrl"));
    setText("#builder-question-media-type-label", t("builderMediaType"));
    setText("#builder-add-question-btn", t("builderAddQuestion"));
    setText("#builder-current-chip", t("builderCurrentPackChip"));
    setText("#builder-board-title", t("builderBoardTitle"));
    setText("#builder-board-text", t("builderBoardText"));
    setText("#final-wager-label", t("finalWagerShort"));
    setText("#final-answer-label", t("answerLabel"));
    setText("#final-submit-answer-btn", t("finalSubmitAnswerButton"));
    setText("#community-packs-view .subscreen-header .eyebrow", t("communityEyebrow"));
    setText("#community-packs-view .subscreen-header h2", t("communityTitle"));
    setText("#community-packs-view .placeholder-panel h3", t("nextStepTitle"));
    setText("#community-packs-view .placeholder-panel p", t("communityText"));
    setText("#settings-view .subscreen-header .eyebrow", t("settingsEyebrow"));
    setText("#settings-view .subscreen-header h2", t("settingsTitle"));
    setText("#settings-avatar-title", t("settingsAvatarTitle"));
    setText("#settings-avatar-text", t("settingsAvatarText"));
    setText("#settings-avatar-file-label", t("settingsAvatarFile"));
    setText("#settings-save-avatar-btn", t("settingsSaveAvatar"));
    setText("#settings-remove-avatar-btn", t("settingsRemoveAvatar"));
    updateCameraButtons();
      setText("#modal-category", t("modalCategory"));
      setText(".answer-label", t("answerLabel"));
      setText("#show-answer-btn", t("showAnswer"));
      setText("#mark-used-btn", t("markUsed"));

    updateSessionTexts();
    updateDynamicPlaceholders();
    renderBuilderBoard();
    renderEventLog();
  }

  function updateSessionTexts() {
    const nickname = getGuestNickname();
    if (state.sessionMode === "user") {
      sessionTitle.textContent = t("signedInMenu");
      sessionStatus.textContent = t("signedInStatus");
    } else if (state.sessionMode === "guest") {
      sessionTitle.textContent = t("guestTitleDynamic", { nickname: nickname || "Guest" });
      sessionStatus.textContent = t("guestStatus");
    } else {
      sessionTitle.textContent = t("welcomeTitle");
      sessionStatus.textContent = t("notSignedIn");
    }
  }

  function updateDynamicPlaceholders() {
    if (!state.currentGame) {
      currentGameName.textContent = t("currentGameNameEmpty");
      currentGameMeta.textContent = t("currentGameMetaEmpty");
      playerGameName.textContent = t("playerGameNameEmpty");
      playerGameMeta.textContent = t("playerGameMetaEmpty");
    }
    if (!state.firstBuzzPlayerId) {
      firstBuzzDisplay.textContent = t("nobodyBuzzed");
    }
    if (!state.eventLog.length) {
      lastEventDisplay.textContent = t("waitingStart");
      liveStatus.textContent = t("liveInactive");
    }
    if (!state.currentBoard) {
      packName.textContent = t("packNameEmpty");
      packDescription.textContent = t("packDescriptionEmpty");
    }
    if (!state.currentBuilderBoard) {
      builderCurrentPackName.textContent = t("builderNoPackSelected");
      builderCurrentPackMeta.textContent = t("builderNoPackMeta");
      builderBoardEmpty.textContent = t("builderBoardEmpty");
    }
  }

  function getToken() {
    return localStorage.getItem(tokenKey);
  }

  function setToken(token) {
    localStorage.setItem(tokenKey, token);
  }

    function clearToken() {
      localStorage.removeItem(tokenKey);
    }

    function getSessionUserName() {
      return localStorage.getItem(sessionUserKey);
    }

    function setSessionUserName(username) {
      localStorage.setItem(sessionUserKey, username);
    }

    function clearSessionUserName() {
      localStorage.removeItem(sessionUserKey);
    }

    function getGuestNickname() {
      return localStorage.getItem(guestKey);
  }

  function setGuestNickname(nickname) {
    localStorage.setItem(guestKey, nickname);
  }

  function clearGuestNickname() {
    localStorage.removeItem(guestKey);
  }

  function getLocalAvatarUrl() {
    return localStorage.getItem(avatarKey);
  }

  function setLocalAvatarUrl(avatarUrl) {
    localStorage.setItem(avatarKey, avatarUrl);
  }

  function clearLocalAvatarUrl() {
    localStorage.removeItem(avatarKey);
  }

  function renderAvatarElement(element, name, avatarUrl) {
    element.innerHTML = "";
    element.classList.remove("has-webcam");
    element.classList.toggle("has-avatar-image", Boolean(avatarUrl));
    if (avatarUrl) {
      const image = document.createElement("img");
      image.src = avatarUrl;
      image.alt = name || t("playerLabel");
      element.appendChild(image);
      return;
    }
    element.textContent = (name || "?").trim().slice(0, 1).toUpperCase() || "?";
  }

  function renderCameraElement(element) {
    element.innerHTML = "";
    element.classList.add("has-avatar-image", "has-webcam");
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = state.cameraStream;
    element.appendChild(video);
  }

  function cameraIsActive(mode) {
    return state.cameraStream && state.cameraMode === mode;
  }

  function updateCameraButtons() {
    const active = Boolean(state.cameraStream);
    hostCameraToggleBtn.textContent = cameraIsActive("host") ? t("cameraDisable") : t("cameraEnableHost");
    playerCameraToggleBtn.textContent = cameraIsActive("player") ? t("cameraDisable") : t("cameraEnablePlayer");
    hostCameraToggleBtn.classList.toggle("camera-active", cameraIsActive("host"));
    playerCameraToggleBtn.classList.toggle("camera-active", cameraIsActive("player"));
    hostCameraToggleBtn.disabled = active && !cameraIsActive("host");
    playerCameraToggleBtn.disabled = active && !cameraIsActive("player");
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((track) => track.stop());
    }
    state.cameraStream = null;
    state.cameraMode = null;
    updateCameraButtons();
    renderHostStage();
    renderPlayerStage();
  }

  async function toggleCamera(mode) {
    if (cameraIsActive(mode)) {
      stopCamera();
      showToast(t("cameraDisabled"));
      return;
    }
    if (state.cameraStream) {
      stopCamera();
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast(t("cameraUnsupported"), true);
      return;
    }

    try {
      state.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false
      });
      state.cameraStream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => stopCamera());
      });
      state.cameraMode = mode;
      updateCameraButtons();
      renderHostStage();
      renderPlayerStage();
      showToast(t("cameraEnabled"));
    } catch (_) {
      state.cameraStream = null;
      state.cameraMode = null;
      updateCameraButtons();
      showToast(t("cameraPermissionDenied"), true);
    }
  }

  function getPlayerAvatarUrl(player) {
    if (player?.avatarUrl) {
      return player.avatarUrl;
    }
    if (player?.id && player.id === state.currentPlayerId) {
      return getLocalAvatarUrl();
    }
    return null;
  }

  function getPlayerAvatarMarkup(player) {
    if (cameraIsActive("player") && player?.id === state.currentPlayerId) {
      return `<video class="player-card-webcam" autoplay muted playsinline></video>`;
    }
    const avatarUrl = getPlayerAvatarUrl(player);
    if (avatarUrl) {
      return `<img src="${escapeAttribute(avatarUrl)}" alt="${escapeAttribute(player?.name || t("playerLabel"))}">`;
    }
    return escapeHtml(getPlayerAvatarLabel(player));
  }

  function attachPlayerCardWebcams(container) {
    if (!cameraIsActive("player")) {
      return;
    }
    container.querySelectorAll(".player-card-webcam").forEach((video) => {
      video.srcObject = state.cameraStream;
    });
  }

  function renderSettingsAvatar() {
    const avatarUrl = getLocalAvatarUrl();
    renderAvatarElement(settingsAvatarPreview, getSessionPlayerName() || t("playerLabel"), avatarUrl);
    settingsAvatarStatus.textContent = avatarUrl ? t("settingsAvatarSaved") : t("settingsAvatarEmpty");
  }

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.remove("hidden", "toast-error");
    if (isError) {
      toast.classList.add("toast-error");
    }

    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => toast.classList.add("hidden"), 3200);
  }

  async function readErrorMessage(response, fallbackMessage) {
    try {
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const payload = await response.json();
        return payload.detail || payload.message || payload.error || fallbackMessage;
      }
      return await response.text() || fallbackMessage;
    } catch (_) {
      return fallbackMessage;
    }
  }

  async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      clearToken();
      state.sessionMode = getGuestNickname() ? "guest" : "anonymous";
      updateSessionUi();
      throw new Error(t("needSignIn"));
    }
    return response;
  }

  function setSessionMode(mode) {
    state.sessionMode = mode;
    const nickname = getGuestNickname();

    if (mode === "user") {
      sessionTitle.textContent = t("signedInMenu");
      sessionStatus.textContent = t("signedInStatus");
    } else if (mode === "guest") {
      sessionTitle.textContent = t("guestTitleDynamic", { nickname: nickname || "Guest" });
      sessionStatus.textContent = t("guestStatus");
    } else {
      sessionTitle.textContent = t("welcomeTitle");
      sessionStatus.textContent = t("notSignedIn");
    }
  }

  function updateSessionUi() {
    if (getToken()) {
      setSessionMode("user");
      showMenuScreen();
      return;
    }
    if (getGuestNickname()) {
      setSessionMode("guest");
      showMenuScreen();
      return;
    }
    setSessionMode("anonymous");
    showAuthScreen();
  }

  function showAuthScreen() {
    authScreen.classList.remove("hidden");
    menuScreen.classList.add("hidden");
  }

  function showMenuScreen() {
    authScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  }

    function switchMenuView(viewName) {
      state.currentMenuView = viewName;
      document.body.classList.toggle("host-stage-mode", viewName === "hostStage");
      document.body.classList.toggle("player-stage-mode", viewName === "playerStage");
      Object.entries(menuViews).forEach(([name, element]) => {
        element.classList.toggle("hidden", name !== viewName);
      });
      if (viewName === "createGame") {
        loadPacks(false);
      }
      if (viewName === "packBuilder" && !state.currentBuilderBoard) {
        loadBuilderPacks();
      }
      if (viewName === "settings") {
        renderSettingsAvatar();
      }
      updateGameRefreshLoop();
    }

    function stopGameRefreshLoop() {
      if (state.refreshTimerId) {
        window.clearInterval(state.refreshTimerId);
        state.refreshTimerId = null;
      }
    }

    function updateGameRefreshLoop() {
      stopGameRefreshLoop();
      if (!state.currentGame?.id || !["hostStage", "playerStage"].includes(state.currentMenuView)) {
        return;
      }
      if (state.liveClient?.connected) {
        return;
      }
      state.refreshTimerId = window.setInterval(() => {
        refreshCurrentGameState();
      }, 5000);
    }

  function pushEventLog(message) {
    state.eventLog.unshift({ id: Date.now() + Math.random(), message });
    state.eventLog = state.eventLog.slice(0, 12);
    renderEventLog();
    lastEventDisplay.textContent = message;
  }

  function renderEventLog() {
    if (!state.eventLog.length) {
      eventLog.innerHTML = `<p class='event-log-empty'>${t("eventLogEmpty")}</p>`;
      return;
    }
    eventLog.innerHTML = state.eventLog.map((entry) => `<div class="event-entry">${entry.message}</div>`).join("");
  }

  function resetBoards() {
    board.innerHTML = "";
    board.classList.add("hidden");
    boardEmpty.classList.remove("hidden");
    hostBoard.innerHTML = "";
    hostBoard.classList.add("hidden");
    hostBoardEmpty.classList.remove("hidden");
    packSummary.classList.add("hidden");
    playerBoard.innerHTML = "";
    playerBoard.classList.add("hidden");
    playerBoardEmpty.classList.remove("hidden");
  }

  function resetGameState() {
    state.currentGame = null;
    state.currentBoard = null;
    state.selectedQuestion = null;
    state.currentPlayerId = null;
    stopCamera();
    state.firstBuzzPlayerId = null;
    state.finalSubmissions = [];
    state.eventLog = [];
    currentGameCard.classList.add("hidden");
    currentGameName.textContent = t("currentGameNameEmpty");
    currentGameMeta.textContent = t("currentGameMetaEmpty");
    playerGameName.textContent = t("playerGameNameEmpty");
    playerGameMeta.textContent = t("playerGameMetaEmpty");
    firstBuzzDisplay.textContent = t("nobodyBuzzed");
    lastEventDisplay.textContent = t("waitingStart");
    renderEventLog();
    renderScoreboard();
    renderPlayerSelect();
    resetBoards();
    renderHostStage();
    renderPlayerStage();
  }

  function getGameMetaText(game) {
    return t("gameMeta", {
      pack: game.pack.name,
      status: game.status,
      code: game.joinCode || "------"
    });
  }

  function renderCurrentGame() {
    if (!state.currentGame) {
      currentGameCard.classList.add("hidden");
      playerGameName.textContent = t("playerGameNameEmpty");
      playerGameMeta.textContent = t("playerGameMetaEmpty");
      return;
    }
    currentGameName.textContent = state.currentGame.name;
    currentGameMeta.textContent = getGameMetaText(state.currentGame);
    currentGameCard.classList.remove("hidden");
    hostConsoleGameName.textContent = state.currentGame.name;
    hostConsoleGameMeta.textContent = getGameMetaText(state.currentGame);
    playerGameName.textContent = state.currentGame.name;
    playerGameMeta.textContent = getGameMetaText(state.currentGame);
  }

  function renderScoreboard() {
    const players = state.currentGame?.players || [];
    if (!players.length) {
      scoreboard.innerHTML = "";
      scoreboard.classList.add("hidden");
      scoreboardEmpty.classList.remove("hidden");
      return;
    }
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    scoreboard.innerHTML = sortedPlayers.map((player) => `
      <article class="score-card">
        <div class="score-head">
          <h3>${player.name}</h3>
          <strong>${player.score}</strong>
        </div>
        <div class="score-actions">
          <button type="button" data-player-id="${player.id}" data-score-change="100">+100</button>
          <button type="button" data-player-id="${player.id}" data-score-change="-100" class="secondary-button">-100</button>
          <button type="button" data-player-id="${player.id}" data-score-change="200">+200</button>
          <button type="button" data-player-id="${player.id}" data-score-change="-200" class="secondary-button">-200</button>
        </div>
      </article>
    `).join("");
    scoreboard.classList.remove("hidden");
    scoreboardEmpty.classList.add("hidden");
  }

  function renderPlayerSelect() {
    const players = state.currentGame?.players || [];
    playerSelect.innerHTML = "";
    if (!players.length) {
      playerSelect.innerHTML = `<option value=''>${t("playerSelectBeforeGame")}</option>`;
      state.currentPlayerId = null;
        updateBuzzButtons();
        return;
    }
    playerSelect.innerHTML = `<option value=''>${t("choosePlayer")}</option>`;
    players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = `${player.name} (${player.score})`;
      playerSelect.appendChild(option);
    });
    if (state.currentPlayerId) {
      playerSelect.value = String(state.currentPlayerId);
    }
    updateBuzzButtons();
  }

    function getPlayerAvatarLabel(player) {
      return (player?.name || "?").trim().slice(0, 1).toUpperCase() || "?";
    }

    function getHostDisplayName() {
      return getSessionUserName() || getGuestNickname() || t("hostFallbackName");
    }

    function getSessionPlayerName() {
      return getSessionUserName() || getGuestNickname() || "";
    }

  function getAnsweringPlayer() {
    if (state.currentGame?.activePlayer) {
      return state.currentGame.activePlayer;
    }
    if (!state.firstBuzzPlayerId) {
      return null;
    }
    return state.currentGame?.players?.find((player) => player.id === state.firstBuzzPlayerId) || null;
  }

  function renderHostPlayers() {
      const players = state.currentGame?.players || [];
      const answeringPlayerId = getAnsweringPlayer()?.id;
      if (!players.length) {
        hostPlayersRow.innerHTML = `<div class="host-player-empty">${t("stageNoPlayers")}</div>`;
        return;
    }

      hostPlayersRow.innerHTML = players.map((player) => {
        const isAnswering = player.id === answeringPlayerId;
        return `
          <article class="host-player-card ${isAnswering ? "host-player-active" : ""}">
            <div class="host-player-avatar">${getPlayerAvatarMarkup(player)}</div>
            <div class="host-player-copy">
              <h3>${escapeHtml(player.name)}</h3>
              <div class="host-player-score-row">
                <p>${escapeHtml(player.score)} ${t("stagePoints")}</p>
                <button type="button" class="host-score-edit-button" data-edit-player-id="${player.id}">
                  ${escapeHtml(t("editScoreButton"))}
                </button>
              </div>
            </div>
          </article>
        `;
      }).join("");
      attachPlayerCardWebcams(hostPlayersRow);
    }

  function renderHostQuestionPanel() {
    if (!state.selectedQuestion) {
      hostQuestionPrice.textContent = "-";
      hostQuestionText.textContent = t("stageChooseQuestion");
      hostAnswerPreview.textContent = "";
      hostAnswerPreview.classList.add("hidden");
      hostAnsweringPlayer.textContent = t("stageWaitingBuzz");
      hostAnswerActions.classList.add("hidden");
      finalSubmissionsPanel.classList.add("hidden");
      return;
    }

    const answeringPlayer = getAnsweringPlayer();
    const finalRound = isFinalRound();
    hostQuestionPrice.textContent = finalRound ? "FINAL" : `${state.selectedQuestion.price}`;
    hostQuestionText.textContent = state.selectedQuestion.text;
    hostAnswerPreview.textContent = `${t("answerLabel")}: ${state.selectedQuestion.answer || t("questionNoAnswer")}`;
    hostAnswerPreview.classList.remove("hidden");

    if (finalRound) {
      hostAnsweringPlayer.textContent = t("finalWaitingAnswers");
      hostAnswerActions.classList.add("hidden");
      renderFinalSubmissions();
      return;
    }

    finalSubmissionsPanel.classList.add("hidden");
    if (answeringPlayer) {
      hostAnsweringPlayer.textContent = t("stageAnsweringPlayer", { name: answeringPlayer.name });
      hostAnswerActions.classList.remove("hidden");
    } else {
      hostAnsweringPlayer.textContent = t("stageWaitingBuzz");
      hostAnswerActions.classList.add("hidden");
    }
  }

  function renderFinalSubmissions() {
    if (!isFinalRound() || !state.selectedQuestion) {
      finalSubmissionsPanel.classList.add("hidden");
      return;
    }

    const submissions = state.finalSubmissions || [];
    const submittedPlayerIds = new Set(submissions.map((submission) => submission.playerId));
    const waitingPlayers = (state.currentGame?.players || [])
      .filter((player) => !submittedPlayerIds.has(player.id))
      .map((player) => player.name);

    const submissionCards = submissions.length
      ? submissions.map((submission) => `
        <article class="final-submission-card ${submission.judged ? "final-submission-judged" : ""}">
          <div>
            <strong>${escapeHtml(submission.playerName)}</strong>
            <span>${t("finalWagerShort")}: ${escapeHtml(submission.wager)}</span>
          </div>
          <p>${escapeHtml(submission.answer)}</p>
          ${submission.judged
            ? `<small>${submission.correct ? t("finalJudgedCorrect") : t("finalJudgedIncorrect")}</small>`
            : `<div class="final-submission-actions">
                <button type="button" class="host-correct-btn" data-final-judge-id="${submission.id}" data-final-correct="true">${t("correctButton")}</button>
                <button type="button" class="host-incorrect-btn" data-final-judge-id="${submission.id}" data-final-correct="false">${t("incorrectButton")}</button>
              </div>`}
        </article>
      `).join("")
      : `<p class="final-submission-empty">${t("finalNoAnswersYet")}</p>`;

    finalSubmissionsPanel.innerHTML = `
      <div class="final-submissions-head">
        <strong>${t("finalAnswersTitle")}</strong>
        <button type="button" class="secondary-button" data-final-refresh="true">${t("refreshButton")}</button>
      </div>
      ${waitingPlayers.length ? `<p class="final-waiting">${t("finalWaitingFor", { players: waitingPlayers.join(", ") })}</p>` : ""}
      <div class="final-submissions-list">${submissionCards}</div>
    `;
    finalSubmissionsPanel.classList.remove("hidden");
  }

  function getStageBoardData() {
    const boardDto = state.currentBoard;
    if (!boardDto) {
      return null;
    }

    if (isFinalRound(boardDto)) {
      return {
        categories: [],
        questions: [...boardDto.questions].sort((a, b) => a.displayOrder - b.displayOrder)
      };
    }

    if (!boardDto.categories.length) {
      return null;
    }

    const categories = [...boardDto.categories].sort((a, b) => a.displayOrder - b.displayOrder);
    const questions = [...boardDto.questions].sort((a, b) => {
      if (a.categoryId === b.categoryId) {
        return a.price - b.price || a.displayOrder - b.displayOrder;
      }
      return (a.categoryId || 0) - (b.categoryId || 0);
    });

    return { categories, questions };
  }

  function renderStageBoard(container, emptyElement, interactive) {
    const boardData = getStageBoardData();
    if (!boardData) {
      container.innerHTML = "";
      container.classList.add("hidden");
      emptyElement.textContent = t("stageBoardEmpty");
      emptyElement.classList.remove("hidden");
      return;
    }

    const { categories, questions } = boardData;
    if (isFinalRound()) {
      const question = questions[0];
      if (!question) {
        container.innerHTML = "";
        container.classList.add("hidden");
        emptyElement.textContent = t("finalBoardEmpty");
        emptyElement.classList.remove("hidden");
        return;
      }

      const isUsed = state.currentGame?.usedQuestionIds?.includes(question.id);
      const isActive = state.currentGame?.currentQuestion?.id === question.id;
      container.innerHTML = `
        <div class="host-final-board">
          ${isUsed
            ? `<div class="host-final-card host-board-used">${t("finalQuestionPlayed")}</div>`
            : interactive
              ? `<button class="host-final-card host-board-question ${isActive ? "host-board-active" : ""}" type="button" data-question-id="${question.id}">
                  <span>${t("finalQuestionTitle")}</span>
                  <strong>${escapeHtml(question.price)}</strong>
                </button>`
              : `<div class="host-final-card host-board-question ${isActive ? "host-board-active" : ""}">
                  <span>${t("finalQuestionTitle")}</span>
                  <strong>${escapeHtml(question.price)}</strong>
                </div>`}
        </div>
      `;
      container.classList.remove("hidden");
      emptyElement.classList.add("hidden");
      return;
    }

    const maxRows = Math.max(
      ...categories.map((category) => questions.filter((question) => question.categoryId === category.id).length),
      0
    );

    const headers = categories.map((category) => `
      <div class="host-board-category">${escapeHtml(category.name)}</div>
    `).join("");

    const rows = Array.from({ length: maxRows }).map((_, rowIndex) => {
      const cells = categories.map((category) => {
        const categoryQuestions = questions.filter((question) => question.categoryId === category.id);
        const question = categoryQuestions[rowIndex];
        if (!question) {
          return `<div class="host-board-cell host-board-gap"></div>`;
        }

        const isUsed = state.currentGame?.usedQuestionIds?.includes(question.id);
        const isActive = state.currentGame?.currentQuestion?.id === question.id;
        if (isUsed) {
          return `<div class="host-board-cell host-board-used"></div>`;
        }

        if (!interactive) {
          return `
            <div class="host-board-cell host-board-question ${isActive ? "host-board-active" : ""}">
              ${escapeHtml(question.price)}
            </div>
          `;
        }

        return `
          <button
            class="host-board-cell host-board-question ${isActive ? "host-board-active" : ""}"
            type="button"
            data-question-id="${question.id}"
          >
            ${escapeHtml(question.price)}
          </button>
        `;
      }).join("");
      return `<div class="host-board-row">${cells}</div>`;
    }).join("");

    container.style.setProperty("--host-board-columns", categories.length);
    container.innerHTML = `
      <div class="host-board-header">${headers}</div>
      ${rows}
    `;
    container.classList.remove("hidden");
    emptyElement.classList.add("hidden");
  }

  function renderHostBoard() {
    renderStageBoard(hostBoard, hostBoardEmpty, true);
  }

    function renderHostStage() {
      const hostName = state.currentGame?.hostName || getHostDisplayName();
      const hostAvatarUrl = state.currentGame?.hostAvatarUrl || getLocalAvatarUrl();
      hostDisplayName.textContent = hostName;
      if (cameraIsActive("host")) {
        renderCameraElement(hostAvatar);
      } else {
        renderAvatarElement(hostAvatar, hostName, hostAvatarUrl);
      }
      updateCameraButtons();
      if (!state.currentGame) {
        hostConsoleGameName.textContent = t("currentGameNameEmpty");
        hostConsoleGameMeta.textContent = t("currentGameMetaEmpty");
      } else {
        hostConsoleGameName.textContent = state.currentGame.name;
        hostConsoleGameMeta.textContent = getGameMetaText(state.currentGame);
      }
      renderHostQuestionPanel();
      renderHostBoard();
      renderHostPlayers();
  }

  function getCurrentPlayer() {
    return state.currentGame?.players?.find((player) => player.id === state.currentPlayerId) || null;
  }

  function renderPlayerStagePlayers() {
    const players = state.currentGame?.players || [];
    const answeringPlayerId = getAnsweringPlayer()?.id;
    if (!players.length) {
      playerPlayersRow.innerHTML = `<div class="host-player-empty">${t("stageNoPlayers")}</div>`;
      return;
    }

    const playerCards = players.map((player) => {
      const isCurrent = player.id === state.currentPlayerId;
      const isAnswering = player.id === answeringPlayerId;
      return `
        <article class="host-player-card ${isCurrent || isAnswering ? "host-player-active" : ""}">
          <div class="host-player-avatar">${getPlayerAvatarMarkup(player)}</div>
          <div class="host-player-copy">
            <h3>${escapeHtml(player.name)}</h3>
            <div class="host-player-score-row">
              <p>${escapeHtml(player.score)} ${t("stagePoints")}</p>
            </div>
          </div>
        </article>
      `;
    }).join("");

    playerPlayersRow.innerHTML = playerCards;
    attachPlayerCardWebcams(playerPlayersRow);
  }

    function renderPlayerQuestionPanel() {
      const hasQuestion = Boolean(state.selectedQuestion);
      const finalRound = isFinalRound();
      playerQuestionPrice.classList.toggle("hidden", !hasQuestion);
      playerQuestionText.classList.toggle("hidden", !hasQuestion);
      playerOpenQuestionBtn.classList.toggle("hidden", !hasQuestion);
      buzzBtn.classList.toggle("hidden", finalRound);
      finalAnswerForm.classList.toggle("hidden", !hasQuestion || !finalRound);

      if (!hasQuestion) {
        playerQuestionPrice.textContent = "-";
        playerQuestionText.textContent = t("playerWaitingQuestion");
        finalAnswerStatus.textContent = "";
        return;
      }

      playerQuestionPrice.textContent = finalRound ? "FINAL" : `${state.selectedQuestion.price}`;
      playerQuestionText.textContent = state.selectedQuestion.text;
      if (finalRound) {
        const player = getCurrentPlayer();
        const maxWager = Math.max(0, player?.score || 0);
        finalWagerInput.max = String(maxWager);
        finalWagerInput.placeholder = `0-${maxWager}`;
      }
    }

  function renderPlayerStage() {
      const hostName = state.currentGame?.hostName || t("hostFallbackName");
    playerDisplayName.textContent = hostName;
    playerDisplayRole.textContent = t("hostRole");
    renderAvatarElement(playerAvatar, hostName, state.currentGame?.hostAvatarUrl || null);

    if (!state.currentGame) {
      playerGameName.textContent = t("playerGameNameEmpty");
      playerGameMeta.textContent = t("playerGameMetaEmpty");
    } else {
      playerGameName.textContent = state.currentGame.name;
      playerGameMeta.textContent = getGameMetaText(state.currentGame);
    }

    renderPlayerQuestionPanel();
    renderPlayerStagePlayers();
  }

  function renderBoardInto(container, emptyElement, interactive) {
    const boardDto = state.currentBoard;
    if (!boardDto) {
      container.innerHTML = "";
      container.classList.add("hidden");
      emptyElement.classList.remove("hidden");
      return;
    }

    if (isFinalRound(boardDto)) {
      const question = [...boardDto.questions].sort((a, b) => a.displayOrder - b.displayOrder)[0];
      if (!question) {
        container.innerHTML = "";
        container.classList.add("hidden");
        emptyElement.textContent = t("finalBoardEmpty");
        emptyElement.classList.remove("hidden");
        return;
      }
      const isUsed = state.currentGame?.usedQuestionIds?.includes(question.id);
      const isActive = state.currentGame?.currentQuestion?.id === question.id;
      container.innerHTML = `
        <article class="board-column final-board-column">
          <h3>${t("finalQuestionTitle")}</h3>
          <button
            class="question-card ${isUsed ? "question-card-used" : ""} ${isActive ? "question-card-active" : ""}"
            type="button"
            ${interactive && !isUsed ? `data-question-id="${question.id}"` : ""}
            ${!interactive || isUsed ? "disabled" : ""}
          >
            <span class="question-price">${escapeHtml(question.price)}</span>
          </button>
        </article>
      `;
      container.classList.remove("hidden");
      emptyElement.classList.add("hidden");
      return;
    }

    if (!boardDto.categories.length) {
      container.innerHTML = "";
      container.classList.add("hidden");
      emptyElement.classList.remove("hidden");
      return;
    }

    const categories = [...boardDto.categories].sort((a, b) => a.displayOrder - b.displayOrder);
    const questions = [...boardDto.questions].sort((a, b) => {
      if (a.categoryId === b.categoryId) {
        return a.displayOrder - b.displayOrder;
      }
      return (a.categoryId || 0) - (b.categoryId || 0);
    });

    container.innerHTML = categories.map((category) => {
      const categoryQuestions = questions.filter((question) => question.categoryId === category.id);
      const cards = categoryQuestions.length
        ? categoryQuestions.map((question) => {
          const isUsed = state.currentGame?.usedQuestionIds?.includes(question.id);
          const isActive = state.currentGame?.currentQuestion?.id === question.id;
          return `
            <button
              class="question-card ${isUsed ? "question-card-used" : ""} ${isActive ? "question-card-active" : ""}"
              type="button"
              ${interactive && !isUsed ? `data-question-id="${question.id}"` : ""}
              ${!interactive || isUsed ? "disabled" : ""}
            >
              <span class="question-price">${question.price}</span>
            </button>
          `;
        }).join("")
        : `<div class='question-placeholder'>${t("noPacksYet")}</div>`;

      return `
        <article class="board-column">
          <h3>${category.name}</h3>
          <div class="question-stack">${cards}</div>
        </article>
      `;
    }).join("");

    container.classList.remove("hidden");
    emptyElement.classList.add("hidden");
  }

  function renderAllBoards() {
    if (state.currentBoard) {
      packName.textContent = state.currentBoard.name;
      packDescription.textContent = state.currentBoard.description;
      packSummary.classList.remove("hidden");
    } else {
      packSummary.classList.add("hidden");
    }
    renderStageBoard(board, boardEmpty, true);
    renderStageBoard(playerBoard, playerBoardEmpty, false);
    renderHostStage();
    renderPlayerStage();
  }

  function renderBuilderPackSelect(packs) {
    builderPackSelect.innerHTML = "";
    if (!packs.length) {
      builderPackSelect.innerHTML = `<option value="">${t("builderNoPacksYet")}</option>`;
      return;
    }

    builderPackSelect.innerHTML = `<option value="">${t("builderChoosePack")}</option>`;
    packs.forEach((pack) => {
      const option = document.createElement("option");
      option.value = pack.id;
      option.textContent = pack.name;
      builderPackSelect.appendChild(option);
    });

    if (state.currentBuilderPack?.id) {
      builderPackSelect.value = String(state.currentBuilderPack.id);
    }
  }

  function renderBuilderCategorySelect() {
    if (isFinalRound(state.currentBuilderBoard)) {
      builderQuestionCategorySelect.innerHTML = `<option value="">${t("builderFinalNoCategory")}</option>`;
      builderQuestionCategorySelect.disabled = true;
      return;
    }

    builderQuestionCategorySelect.disabled = false;
    const categories = [...(state.currentBuilderBoard?.categories || [])]
      .sort((a, b) => a.displayOrder - b.displayOrder);

    builderQuestionCategorySelect.innerHTML = "";
    if (!categories.length) {
      builderQuestionCategorySelect.innerHTML = `<option value="">${t("builderChooseCategoryFirst")}</option>`;
      return;
    }

    builderQuestionCategorySelect.innerHTML = `<option value="">${t("builderChooseCategory")}</option>`;
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      builderQuestionCategorySelect.appendChild(option);
    });
  }

  function renderBuilderRoundSelect(rounds = state.currentBuilderBoard?.rounds || []) {
    builderRoundSelect.innerHTML = "";
    if (!state.currentBuilderPack?.id) {
      builderRoundSelect.innerHTML = `<option value="">${t("builderChoosePackFirst")}</option>`;
      return;
    }
    if (!rounds.length) {
      builderRoundSelect.innerHTML = `<option value="">${t("builderNoRoundsYet")}</option>`;
      return;
    }

    rounds.forEach((round) => {
      const option = document.createElement("option");
      option.value = round.id;
      const typeLabel = round.roundType === "FINAL" ? ` (${t("finalQuestionTitle")})` : "";
      option.textContent = `${round.displayOrder}. ${round.name}${typeLabel}`;
      builderRoundSelect.appendChild(option);
    });
    builderRoundSelect.value = String(state.currentBuilderRoundId || rounds[0].id);
  }

  function renderBuilderBoard() {
    const boardDto = state.currentBuilderBoard;
    if (!boardDto) {
      builderCurrentPackName.textContent = t("builderNoPackSelected");
      builderCurrentPackMeta.textContent = t("builderNoPackMeta");
      builderBoard.innerHTML = "";
      builderBoard.classList.add("hidden");
      builderBoardEmpty.textContent = t("builderBoardEmpty");
      builderBoardEmpty.classList.remove("hidden");
      renderBuilderRoundSelect([]);
      renderBuilderCategorySelect();
      return;
    }

    const categories = [...boardDto.categories].sort((a, b) => a.displayOrder - b.displayOrder);
    const questions = [...boardDto.questions].sort((a, b) => {
      if (a.categoryId === b.categoryId) {
        return a.displayOrder - b.displayOrder;
      }
      return (a.categoryId || 0) - (b.categoryId || 0);
    });

    builderCurrentPackName.textContent = boardDto.name;
    builderCurrentPackMeta.textContent = t("builderPackMeta", {
      round: boardDto.roundName || t("builderRoundFallback"),
      categories: categories.length,
      questions: questions.length
    });
    state.currentBuilderRoundId = boardDto.roundId;
    renderBuilderRoundSelect(boardDto.rounds || []);
    renderBuilderCategorySelect();

    if (isFinalRound(boardDto)) {
      builderBoard.innerHTML = questions.length
        ? questions.map((question) => `
          <article class="builder-question-card builder-final-question-card">
            <strong>${escapeHtml(question.price)}</strong>
            <span>${escapeHtml(question.text)}</span>
            <button
              type="button"
              class="builder-question-delete-button"
              data-delete-question-id="${question.id}"
            >
              ${escapeHtml(t("builderDeleteQuestion"))}
            </button>
          </article>
        `).join("")
        : `<div class="builder-question-empty">${t("builderFinalNoQuestionYet")}</div>`;
      builderBoard.classList.remove("hidden");
      builderBoardEmpty.classList.add("hidden");
      return;
    }

    if (!categories.length) {
      builderBoard.innerHTML = "";
      builderBoard.classList.add("hidden");
      builderBoardEmpty.textContent = t("builderBoardEmpty");
      builderBoardEmpty.classList.remove("hidden");
      return;
    }

    builderBoard.innerHTML = categories.map((category) => {
      const categoryQuestions = questions.filter((question) => question.categoryId === category.id);
      const cards = categoryQuestions.length
        ? categoryQuestions.map((question) => `
          <article class="builder-question-card">
            <strong>${escapeHtml(question.price)}</strong>
            <span>${escapeHtml(question.text)}</span>
            <button
              type="button"
              class="builder-question-delete-button"
              data-delete-question-id="${question.id}"
            >
              ${escapeHtml(t("builderDeleteQuestion"))}
            </button>
          </article>
        `).join("")
        : `<div class="builder-question-empty">${t("builderNoQuestionsYet")}</div>`;

      return `
        <article class="builder-category-card">
          <h3>${escapeHtml(category.name)}</h3>
          <div class="builder-question-stack">${cards}</div>
        </article>
      `;
    }).join("");
    builderBoard.classList.remove("hidden");
    builderBoardEmpty.classList.add("hidden");
  }

  async function loadBuilderPacks(selectedPackId = null) {
    try {
      const response = await apiFetch("/packs");
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("loadPacksFailed")));
      }
      const packs = await response.json();
      renderBuilderPackSelect(packs);

      const idToSelect = selectedPackId || state.currentBuilderPack?.id;
      if (idToSelect) {
        builderPackSelect.value = String(idToSelect);
      }
      showToast(t("packsUpdated"));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function loadBuilderBoard(packId) {
    if (!packId) {
      state.currentBuilderPack = null;
      state.currentBuilderBoard = null;
      state.currentBuilderRoundId = null;
      renderBuilderBoard();
      return;
    }

    try {
      const roundPath = state.currentBuilderRoundId
        ? `/rounds/${encodeURIComponent(state.currentBuilderRoundId)}/board`
        : "/board";
      const response = await apiFetch(`/packs/${encodeURIComponent(packId)}${roundPath}`);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("builderLoadPackFailed")));
      }
      state.currentBuilderBoard = await response.json();
      state.currentBuilderPack = {
        id: state.currentBuilderBoard.id,
        name: state.currentBuilderBoard.name,
        description: state.currentBuilderBoard.description
      };
      state.currentBuilderRoundId = state.currentBuilderBoard.roundId;
      renderBuilderBoard();
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function createBuilderRound(event) {
    event.preventDefault();
    if (!state.currentBuilderPack?.id) {
      showToast(t("builderChoosePackFirst"), true);
      return;
    }
    if (!state.currentBuilderRoundId) {
      showToast(t("builderNoRoundsYet"), true);
      return;
    }

    const payload = {
      name: builderRoundNameInput.value.trim(),
      displayOrder: Number(builderRoundOrderInput.value) || ((state.currentBuilderBoard?.rounds || []).length + 1),
      roundType: builderRoundTypeSelect.value || "BOARD"
    };

    try {
      const response = await apiFetch(`/packs/${encodeURIComponent(state.currentBuilderPack.id)}/rounds`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("builderCreateRoundFailed")));
      }
      const round = await response.json();
      builderRoundForm.reset();
      builderRoundOrderInput.value = String((state.currentBuilderBoard?.rounds || []).length + 2);
      builderRoundTypeSelect.value = "BOARD";
      state.currentBuilderRoundId = round.id;
      await loadBuilderBoard(state.currentBuilderPack.id);
      showToast(t("builderRoundCreated", { name: round.name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function createBuilderPack(event) {
    event.preventDefault();
    const payload = {
      name: builderPackNameInput.value.trim(),
      description: builderPackDescriptionInput.value.trim()
    };

    try {
      const response = await apiFetch("/packs", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("builderCreatePackFailed")));
      }
      const pack = await response.json();
      builderPackForm.reset();
      state.currentBuilderRoundId = null;
      await loadBuilderPacks(pack.id);
      await loadBuilderBoard(pack.id);
      showToast(t("builderPackCreated", { name: pack.name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function addBuilderCategory(event) {
    event.preventDefault();
    if (!state.currentBuilderPack?.id) {
      showToast(t("builderChoosePackFirst"), true);
      return;
    }
    if (!state.currentBuilderRoundId) {
      showToast(t("builderNoRoundsYet"), true);
      return;
    }
    if (isFinalRound(state.currentBuilderBoard)) {
      showToast(t("builderFinalNoCategories"), true);
      return;
    }
    if ((state.currentBuilderBoard?.categories || []).length >= 6) {
      showToast(t("builderCategoryLimitReached"), true);
      return;
    }

    const payload = {
      name: builderCategoryNameInput.value.trim(),
      displayOrder: Number(builderCategoryOrderInput.value) || 1
    };

    try {
      const createResponse = await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!createResponse.ok) {
        throw new Error(await readErrorMessage(createResponse, t("builderCreateCategoryFailed")));
      }
      const category = await createResponse.json();

      const linkResponse = await apiFetch(`/packs/${encodeURIComponent(state.currentBuilderPack.id)}/rounds/${encodeURIComponent(state.currentBuilderRoundId)}/categories/${encodeURIComponent(category.id)}`, {
        method: "POST"
      });
      if (!linkResponse.ok) {
        throw new Error(await readErrorMessage(linkResponse, t("builderLinkCategoryFailed")));
      }

      builderCategoryForm.reset();
      builderCategoryOrderInput.value = String((state.currentBuilderBoard?.categories.length || 0) + 2);
      await loadBuilderBoard(state.currentBuilderPack.id);
      showToast(t("builderCategoryAdded", { name: category.name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function addBuilderQuestion(event) {
    event.preventDefault();
    if (!state.currentBuilderPack?.id) {
      showToast(t("builderChoosePackFirst"), true);
      return;
    }
    if (!state.currentBuilderRoundId) {
      showToast(t("builderNoRoundsYet"), true);
      return;
    }
    const finalBuilderRound = isFinalRound(state.currentBuilderBoard);
    if (finalBuilderRound && (state.currentBuilderBoard?.questions || []).length >= 1) {
      showToast(t("builderFinalQuestionLimitReached"), true);
      return;
    }
    if (!finalBuilderRound && !builderQuestionCategorySelect.value) {
      showToast(t("builderChooseCategoryFirst"), true);
      return;
    }
    const selectedCategoryId = builderQuestionCategorySelect.value;
    const questionsInCategory = (state.currentBuilderBoard?.questions || [])
      .filter((item) => String(item.categoryId) === selectedCategoryId).length;
    if (!finalBuilderRound && questionsInCategory >= 5) {
      showToast(t("builderQuestionLimitReached"), true);
      return;
    }

    const payload = {
      text: builderQuestionTextInput.value.trim(),
      answer: builderQuestionAnswerInput.value.trim(),
      price: Number(builderQuestionPriceInput.value),
      displayOrder: Number(builderQuestionOrderInput.value) || 1,
      mediaUrl: builderQuestionMediaUrlInput.value.trim() || null,
      mediaType: builderQuestionMediaTypeInput.value.trim() || null
    };

    try {
      const createResponse = await apiFetch("/questions", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!createResponse.ok) {
        throw new Error(await readErrorMessage(createResponse, t("builderCreateQuestionFailed")));
      }
      const question = await createResponse.json();

      if (!finalBuilderRound) {
        const categoryResponse = await apiFetch(`/categories/${encodeURIComponent(selectedCategoryId)}/questions/${encodeURIComponent(question.id)}`, {
          method: "POST"
        });
        if (!categoryResponse.ok) {
          throw new Error(await readErrorMessage(categoryResponse, t("builderLinkQuestionFailed")));
        }
      }

      const packResponse = await apiFetch(`/packs/${encodeURIComponent(state.currentBuilderPack.id)}/rounds/${encodeURIComponent(state.currentBuilderRoundId)}/questions/${encodeURIComponent(question.id)}`, {
        method: "POST"
      });
      if (!packResponse.ok) {
        throw new Error(await readErrorMessage(packResponse, t("builderLinkQuestionFailed")));
      }

        builderQuestionForm.reset();
        builderQuestionCategorySelect.value = finalBuilderRound ? "" : selectedCategoryId;
        builderQuestionPriceInput.value = "100";
        builderQuestionOrderInput.value = String(finalBuilderRound ? 1 : questionsInCategory + 2);
        await loadBuilderBoard(state.currentBuilderPack.id);
        showToast(t("builderQuestionAdded"));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function deleteBuilderQuestion(questionId) {
    if (!state.currentBuilderPack?.id || !state.currentBuilderRoundId) {
      showToast(t("builderChoosePackFirst"), true);
      return;
    }

    if (!window.confirm(t("builderDeleteQuestionConfirm"))) {
      return;
    }

    try {
      const response = await apiFetch(
        `/packs/${encodeURIComponent(state.currentBuilderPack.id)}/rounds/${encodeURIComponent(state.currentBuilderRoundId)}/questions/${encodeURIComponent(questionId)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("builderDeleteQuestionFailed")));
      }

      await loadBuilderBoard(state.currentBuilderPack.id);
      showToast(t("builderQuestionDeleted"));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function findCategory(categoryId) {
    return state.currentBoard?.categories.find((category) => category.id === categoryId) || null;
  }

    function closeQuestionModal() {
      modalMedia.innerHTML = "";
      modalMedia.classList.add("hidden");
      modalAnswerText.textContent = "";
      modalAnswerBlock.classList.add("hidden");
      if (modal.open) {
        modal.close();
      }
    }

    function updateBuzzButtons() {
      const answeringPlayer = getAnsweringPlayer();
      const disabled = isFinalRound()
        || !state.currentPlayerId
        || !state.liveClient?.connected
        || (!!answeringPlayer && answeringPlayer.id !== state.currentPlayerId);
      buzzBtn.disabled = disabled;
      if (modalBuzzBtn) {
        modalBuzzBtn.disabled = disabled;
      }
    }

    function updateQuestionModalState() {
      const isHostStage = state.currentMenuView === "hostStage";
      modalPlayerTools.classList.toggle("hidden", !state.selectedQuestion || isHostStage || isFinalRound());
      showAnswerBtn.classList.toggle("hidden", !isHostStage);
      markUsedBtn.classList.toggle("hidden", !isHostStage);
      updateBuzzButtons();
    }

    function openQuestionModal() {
      if (!state.selectedQuestion) {
        return;
      }
      updateQuestionModalState();
      if (!modal.open) {
        modal.showModal();
      }
    }

    async function loadQuestionIntoStage(questionId, openModal = true) {
      const questionResponse = await apiFetch(`/questions/${encodeURIComponent(questionId)}`);
      if (!questionResponse.ok) {
        throw new Error(await readErrorMessage(questionResponse, "Не вдалося завантажити питання"));
      }

      const question = await questionResponse.json();
      const category = findCategory(question.category?.id ?? question.categoryId);
      state.selectedQuestion = question;
      modalCategory.textContent = category ? category.name : "Без категорії";
      modalPrice.textContent = `${question.price}`;
      modalQuestionText.textContent = question.text;
      modalAnswerText.textContent = question.answer || t("questionNoAnswer");
      modalAnswerBlock.classList.add("hidden");
      renderQuestionMedia(question);
      if (isFinalRound()) {
        await loadFinalSubmissions(true);
      }
      renderHostStage();
      renderPlayerStage();
      if (openModal) {
        openQuestionModal();
      }
    }

  async function loadFinalSubmissions(silent = false) {
    if (!state.currentGame?.id || !isFinalRound()) {
      state.finalSubmissions = [];
      renderFinalSubmissions();
      return;
    }

    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/final/submissions`);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("finalLoadFailed")));
      }
      state.finalSubmissions = await response.json();
      renderFinalSubmissions();
    } catch (error) {
      if (!silent) {
        showToast(error.message, true);
      }
    }
  }

  async function submitFinalAnswer(event) {
    event.preventDefault();
    if (!state.currentGame?.id || !state.selectedQuestion || !state.currentPlayerId) {
      showToast(t("finalChoosePlayerFirst"), true);
      return;
    }

    const payload = {
      playerId: state.currentPlayerId,
      wager: Number(finalWagerInput.value),
      answer: finalAnswerInput.value.trim()
    };

    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/final/submissions`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("finalSubmitFailed")));
      }
      await response.json();
      finalAnswerForm.reset();
      finalAnswerStatus.textContent = t("finalAnswerSubmitted");
      showToast(t("finalAnswerSubmitted"));
    } catch (error) {
      finalAnswerStatus.textContent = error.message;
      showToast(error.message, true);
    }
  }

  async function syncCurrentPlayerAvatar() {
    if (!state.currentGame?.id || !state.currentPlayerId) {
      return;
    }

    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/players/${encodeURIComponent(state.currentPlayerId)}/avatar`, {
        method: "POST",
        body: JSON.stringify({ avatarUrl: getLocalAvatarUrl() })
      });
      if (response.ok) {
        state.currentGame = await response.json();
        renderCurrentGame();
        renderScoreboard();
        renderPlayerSelect();
        renderHostStage();
        renderPlayerStage();
      }
    } catch (_) {
      // Avatar sync is a convenience; the local preview still stays saved.
    }
  }

  function saveAvatarFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error(t("settingsAvatarChooseFile")));
        return;
      }
      if (!file.type.startsWith("image/")) {
        reject(new Error(t("settingsAvatarInvalid")));
        return;
      }
      if (file.size > 250 * 1024) {
        reject(new Error(t("settingsAvatarTooLarge")));
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", () => reject(new Error(t("settingsAvatarReadFailed"))));
      reader.readAsDataURL(file);
    });
  }

  async function saveAvatarSettings(event) {
    event.preventDefault();
    try {
      const avatarUrl = await saveAvatarFromFile(settingsAvatarInput.files[0]);
      setLocalAvatarUrl(avatarUrl);
      renderSettingsAvatar();
      await syncCurrentPlayerAvatar();
      showToast(t("settingsAvatarSaved"));
    } catch (error) {
      settingsAvatarStatus.textContent = error.message;
      showToast(error.message, true);
    }
  }

  async function removeAvatarSettings() {
    clearLocalAvatarUrl();
    settingsAvatarInput.value = "";
    renderSettingsAvatar();
    await syncCurrentPlayerAvatar();
    showToast(t("settingsAvatarRemoved"));
  }

  async function judgeFinalSubmission(submissionId, correct) {
    if (!state.currentGame?.id) {
      return;
    }

    try {
      const submission = state.finalSubmissions.find((item) => item.id === submissionId);
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/final/submissions/${encodeURIComponent(submissionId)}/judge`, {
        method: "POST",
        body: JSON.stringify({ correct })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("finalJudgeFailed")));
      }
      state.currentGame = await response.json();
      await loadFinalSubmissions(true);
      renderCurrentGame();
      renderHostStage();
      renderPlayerStage();
      if (submission) {
        const delta = correct ? submission.wager : -submission.wager;
        showToast(t("scoreUpdated", { delta }));
      } else {
        showToast(t("scoreUpdated", { delta: 0 }));
      }
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function renderQuestionMedia(question) {
    modalMedia.innerHTML = "";
    modalMedia.classList.add("hidden");
    if (!question.mediaUrl) {
      return;
    }
    if ((question.mediaType || "").startsWith("image/")) {
      modalMedia.innerHTML = `<img src="${question.mediaUrl}" alt="question media">`;
    } else if ((question.mediaType || "").startsWith("audio/")) {
      modalMedia.innerHTML = `<audio controls src="${question.mediaUrl}"></audio>`;
    } else if ((question.mediaType || "").startsWith("video/")) {
      modalMedia.innerHTML = `<video controls src="${question.mediaUrl}"></video>`;
    } else {
      modalMedia.innerHTML = `<a href="${question.mediaUrl}" target="_blank" rel="noreferrer">${t("openAttachedFile")}</a>`;
    }
    modalMedia.classList.remove("hidden");
  }

  async function registerUser(event) {
    event.preventDefault();
    const payload = {
      username: document.getElementById("register-username").value.trim(),
      password: document.getElementById("register-password").value
    };
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("createAccountFailed")));
      }
      document.getElementById("login-username").value = payload.username;
      document.getElementById("login-password").value = payload.password;
      registerForm.reset();
      showToast(t("accountCreatedSigningIn"));
      await loginWithCredentials(payload);
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function loginUser(event) {
    event.preventDefault();
    await loginWithCredentials({
      username: document.getElementById("login-username").value.trim(),
      password: document.getElementById("login-password").value
    });
  }

  async function loginWithCredentials(payload) {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
        if (!response.ok) {
          throw new Error(await readErrorMessage(response, t("loginFailed")));
        }
        const auth = await response.json();
        clearGuestNickname();
        setSessionUserName(payload.username);
        setToken(auth.token);
        loginForm.reset();
      updateSessionUi();
      switchMenuView("home");
      showToast(t("loginSuccess"));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function enterAsGuest(event) {
    event.preventDefault();
    const nickname = document.getElementById("guest-nickname").value.trim();
    if (!nickname) {
      showToast(t("guestNeedNickname"), true);
      return;
      }
      clearToken();
      clearSessionUserName();
      setGuestNickname(nickname);
      updateSessionUi();
    switchMenuView("home");
    guestForm.reset();
    showToast(t("guestEnabled", { nickname }));
  }

  async function loadPacks(showFeedback = true) {
    try {
      const response = await apiFetch("/packs");
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("loadPacksFailed")));
      }
      const packs = await response.json();
      packSelect.innerHTML = `<option value=''>${t("packSelectInitial")}</option>`;
      packs.forEach((pack) => {
        const option = document.createElement("option");
        option.value = pack.id;
        option.textContent = pack.name;
        packSelect.appendChild(option);
      });
      if (!packs.length) {
        packSelect.innerHTML = `<option value=''>${t("noPacksYet")}</option>`;
      }
      if (showFeedback) {
        showToast(t("packsUpdated"));
      }
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function createGame() {
    const packId = Number(packSelect.value);
    if (!packId) {
      showToast(t("choosePackFirst"), true);
      return;
    }
    try {
      const response = await apiFetch("/games", {
        method: "POST",
        body: JSON.stringify({ packId, hostAvatarUrl: getLocalAvatarUrl() })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося створити гру"));
      }
      state.currentGame = await response.json();
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      await loadBoardForCurrentGame();
      switchMenuView("hostStage");
      connectLive(true);
      showToast(t("gameCreated", { name: state.currentGame.name, code: state.currentGame.joinCode }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function loadGameById(gameId) {
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(gameId)}`);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося завантажити гру"));
      }
      state.currentGame = await response.json();
      state.firstBuzzPlayerId = state.currentGame?.activePlayer?.id ?? null;
      firstBuzzDisplay.textContent = state.currentGame?.activePlayer?.name || t("nobodyBuzzed");
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      await loadBoardForCurrentGame();
      updateGameRefreshLoop();
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function refreshCurrentGameState() {
    if (!state.currentGame?.id) {
      return;
    }
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}`);
      if (!response.ok) {
        return;
      }
      const refreshedGame = await response.json();
      const previousRoundId = state.currentGame?.currentRound?.id;
      state.currentGame = refreshedGame;
      state.firstBuzzPlayerId = state.currentGame?.activePlayer?.id ?? null;
      firstBuzzDisplay.textContent = state.currentGame?.activePlayer?.name || t("nobodyBuzzed");
      if (previousRoundId !== state.currentGame?.currentRound?.id) {
        await loadBoardForCurrentGame();
        return;
      }
      const currentQuestionId = state.currentGame?.currentQuestion?.id ?? null;
      const selectedQuestionId = state.selectedQuestion?.id ?? null;
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      renderAllBoards();
      if (currentQuestionId && currentQuestionId !== selectedQuestionId) {
        await loadQuestionIntoStage(currentQuestionId, !isFinalRound());
        return;
      }
      if (!currentQuestionId && state.selectedQuestion) {
        state.selectedQuestion = null;
        closeQuestionModal();
        renderHostStage();
        renderPlayerStage();
      }
    } catch (_) {
      // keep silent during passive refresh
    }
  }

  async function loadGameByJoinCode() {
    const joinCode = (joinCodeInput.value || "").replace(/\D/g, "").slice(0, 6);
    joinCodeInput.value = joinCode;
    if (joinCode.length !== 6) {
      showToast(t("joinCodeRequired"), true);
      return;
    }
    const playerName = getSessionPlayerName().trim();
    if (!playerName) {
      showToast(t("needIdentityBeforeJoin"), true);
      return;
    }
    try {
      const response = await apiFetch(`/games/code/${encodeURIComponent(joinCode)}/join`, {
        method: "POST",
        body: JSON.stringify({ name: playerName, avatarUrl: getLocalAvatarUrl() })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, t("loadGameByCodeFailed")));
      }
      const joined = await response.json();
      if (state.liveClient?.connected) {
        state.liveClient.disconnect(() => {});
        state.liveClient = null;
      }
      state.currentGame = joined.game;
      state.currentPlayerId = joined.playerId;
      state.firstBuzzPlayerId = state.currentGame?.activePlayer?.id ?? null;
      firstBuzzDisplay.textContent = state.currentGame?.activePlayer?.name || t("nobodyBuzzed");
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      await loadBoardForCurrentGame();
      connectLive(true);
      switchMenuView("playerStage");
      updateGameRefreshLoop();
      showToast(t("gameFoundByCode", { code: joinCode }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function loadBoardForCurrentGame() {
    if (!state.currentGame?.pack?.id) {
      resetBoards();
      return;
    }
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/board`);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося завантажити дошку"));
      }
      state.currentBoard = await response.json();
      renderAllBoards();
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function addPlayer(event) {
    event.preventDefault();
    if (!state.currentGame?.id) {
      showToast(t("chooseOrCreateGameFirst"), true);
      return;
    }
    const name = playerNameInput.value.trim();
    if (!name) {
      showToast(t("playerNameRequired"), true);
      return;
    }
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/players`, {
        method: "POST",
        body: JSON.stringify({ name })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося додати гравця"));
      }
      state.currentGame = await response.json();
      playerForm.reset();
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      renderHostStage();
      showToast(t("playerAdded", { name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  async function addStagePlayer(event) {
    event.preventDefault();
    if (!state.currentGame?.id) {
      showToast(t("chooseOrCreateGameFirst"), true);
      return;
    }
    const name = stagePlayerNameInput.value.trim();
    if (!name) {
      showToast(t("playerNameLabel"), true);
      return;
    }
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/players`, {
        method: "POST",
        body: JSON.stringify({ name })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося додати гравця"));
      }
      state.currentGame = await response.json();
      stagePlayerForm.reset();
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      renderHostStage();
      showToast(t("playerAdded", { name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

    async function updatePlayerScore(playerId, scoreChange) {
        if (!state.currentGame?.id) {
          showToast(t("chooseOrCreateGameFirst"), true);
          return;
        }
      try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/players/${encodeURIComponent(playerId)}/score`, {
        method: "POST",
        body: JSON.stringify({ scoreChange })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося оновити рахунок"));
      }
        state.currentGame = await response.json();
        renderCurrentGame();
        renderScoreboard();
        renderPlayerSelect();
        renderHostStage();
        renderPlayerStage();
        pushEventLog(t("scoreUpdated", { delta: `${scoreChange > 0 ? "+" : ""}${scoreChange}` }));
      } catch (error) {
          showToast(error.message, true);
        }
      }

    async function editPlayerScore(playerId) {
      const player = state.currentGame?.players?.find((item) => item.id === playerId);
      if (!player) {
        return;
      }
      const nextValue = window.prompt(t("editScorePrompt", { name: player.name }), player.score);
      if (nextValue === null) {
        return;
      }
      const parsed = Number(nextValue);
      if (!Number.isFinite(parsed)) {
        showToast(t("editScoreInvalid"), true);
        return;
      }
      await updatePlayerScore(playerId, parsed - player.score);
    }

  async function adjudicateAnswer(isCorrect) {
    const answeringPlayer = getAnsweringPlayer();
    if (!state.selectedQuestion || !answeringPlayer) {
      showToast(t("stageNoAnsweringPlayer"), true);
      return;
    }

    const delta = isCorrect ? state.selectedQuestion.price : -state.selectedQuestion.price;

    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/questions/${encodeURIComponent(state.selectedQuestion.id)}/judge`, {
        method: "POST",
        body: JSON.stringify({ correct: isCorrect })
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Не вдалося оцінити відповідь"));
      }

      state.currentGame = await response.json();
      state.firstBuzzPlayerId = state.currentGame?.activePlayer?.id ?? null;
      firstBuzzDisplay.textContent = state.currentGame?.activePlayer?.name || t("nobodyBuzzed");
      renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      renderHostStage();
      renderPlayerStage();

      if (isCorrect) {
        state.selectedQuestion = null;
        await loadBoardForCurrentGame();
        closeQuestionModal();
        pushEventLog(t("roundCompleted"));
        showToast(t("questionMarkedUsed"));
        return;
      }

      updateBuzzButtons();
      pushEventLog(t("stageAnswerReopened", { name: answeringPlayer.name }));
    } catch (error) {
      showToast(error.message, true);
    }
  }

    async function selectQuestion(questionId) {
      if (!state.currentGame?.id) {
        showToast(t("chooseOrCreateGameFirst"), true);
        return;
      }
      const boardQuestion = state.currentBoard?.questions?.find((item) => item.id === questionId);
      try {
      const selectResponse = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/questions/${encodeURIComponent(questionId)}/select`, {
        method: "POST"
      });
      if (!selectResponse.ok) {
        throw new Error(await readErrorMessage(selectResponse, "Не вдалося активувати питання"));
      }
      state.currentGame = await selectResponse.json();
      state.firstBuzzPlayerId = null;
      renderCurrentGame();
      renderScoreboard();
        renderPlayerSelect();
        renderAllBoards();
        firstBuzzDisplay.textContent = t("nobodyBuzzed");
        await loadQuestionIntoStage(questionId, true);
        pushEventLog(t("hostOpenedQuestion", { price: boardQuestion?.price ?? questionId }));
      } catch (error) {
        showToast(error.message, true);
      }
    }

  async function completeQuestion() {
    if (!state.selectedQuestion || !state.currentGame?.id) {
      return;
    }
    try {
      const response = await apiFetch(`/games/${encodeURIComponent(state.currentGame.id)}/questions/${encodeURIComponent(state.selectedQuestion.id)}/complete`, {
        method: "POST"
      });
        if (!response.ok) {
          throw new Error(await readErrorMessage(response, "Не вдалося завершити питання"));
        }
        state.currentGame = await response.json();
        state.selectedQuestion = null;
        state.firstBuzzPlayerId = null;
        await loadBoardForCurrentGame();
        renderCurrentGame();
      renderScoreboard();
      renderPlayerSelect();
      firstBuzzDisplay.textContent = t("nobodyBuzzed");
      closeQuestionModal();
      pushEventLog(t("roundCompleted"));
      showToast(t("questionMarkedUsed"));
    } catch (error) {
      showToast(error.message, true);
    }
  }

  function connectLive(silent = false) {
    if (!state.currentGame?.id) {
      if (!silent) {
        showToast(t("chooseOrCreateGameToConnect"), true);
      }
      return;
    }
    const sessionPlayerName = getSessionPlayerName().trim();
    const token = getToken();
    if (!token && !sessionPlayerName) {
      liveStatus.textContent = t("liveGuestUnavailable");
      updateBuzzButtons();
      if (!silent) {
        showToast(t("authRequiredLive"), true);
      }
      return;
    }
    if (state.liveClient?.connected) {
      liveStatus.textContent = t("liveAlreadyConnected");
      return;
    }
    const socketQuery = token
      ? `token=${encodeURIComponent(token)}`
      : `username=${encodeURIComponent(sessionPlayerName)}`;
    const socket = new SockJS(`/ws?${socketQuery}`);
    const client = Stomp.over(socket);
      client.debug = () => {};
      client.connect({}, () => {
          state.liveClient = client;
          liveStatus.textContent = t("liveConnected", { id: state.currentGame.id });
        updateBuzzButtons();
        updateGameRefreshLoop();
        subscribeToGameTopics();
        pushEventLog(t("liveActiveEvent"));
      }, () => {
          liveStatus.textContent = t("liveConnectionFailed");
        updateBuzzButtons();
        updateGameRefreshLoop();
    });
  }

  function subscribeToGameTopics() {
    if (!state.liveClient?.connected || !state.currentGame?.id) {
      return;
    }
    const gameId = state.currentGame.id;
    state.liveClient.subscribe(`/topic/game/${gameId}/buzz`, (frame) => handleBuzzMessage(JSON.parse(frame.body)));
    state.liveClient.subscribe(`/topic/game/${gameId}/select`, (frame) => handleSelectMessage(JSON.parse(frame.body)));
    state.liveClient.subscribe(`/topic/game/${gameId}/score`, (frame) => handleScoreMessage(JSON.parse(frame.body)));
    state.liveClient.subscribe(`/topic/game/${gameId}/final`, (frame) => handleFinalRoundMessage(JSON.parse(frame.body)));
    state.liveClient.subscribe(`/topic/game/${gameId}/state`, (frame) => handleGameStateMessage(JSON.parse(frame.body)));
  }

  function sendLiveMessage(destination, payload) {
    if (state.liveClient?.connected) {
      state.liveClient.send(destination, {}, JSON.stringify(payload));
    }
  }

  function handleBuzzMessage(message) {
    state.firstBuzzPlayerId = message.playerId;
    if (state.currentGame?.players?.length) {
      state.currentGame.activePlayer = state.currentGame.players.find((item) => item.id === message.playerId) || null;
    }
    const player = state.currentGame?.players?.find((item) => item.id === message.playerId);
    const playerName = player?.name || message.by || `Player #${message.playerId}`;
    firstBuzzDisplay.textContent = playerName;
    updateBuzzButtons();
    renderHostStage();
    renderPlayerStage();
    pushEventLog(`${playerName} натиснув Buzz першим.`);
  }

    function handleSelectMessage(message) {
      const question = state.currentBoard?.questions?.find((item) => item.id === message.questionId);
      pushEventLog(`${message.by || "Хост"} відкрив питання ${question?.price ?? `#${message.questionId}`}.`);
      if (state.selectedQuestion?.id === message.questionId && modal.open) {
        return;
      }
      loadQuestionIntoStage(message.questionId, !isFinalRound()).catch(() => {});
    }

  function handleScoreMessage(message) {
    refreshCurrentGameState().catch(() => {});
    if (message.playerId == null) {
      state.selectedQuestion = null;
      if (state.currentGame) {
        state.currentGame.activePlayer = null;
      }
      state.firstBuzzPlayerId = null;
      closeQuestionModal();
      loadBoardForCurrentGame().catch(() => {
        renderPlayerStage();
        renderHostStage();
      });
      pushEventLog(t("roundCompleted"));
      return;
    }
    const player = state.currentGame?.players?.find((item) => item.id === message.playerId);
    const playerName = player?.name || message.by || `Player #${message.playerId}`;
    const delta = message.delta > 0 ? `+${message.delta}` : `${message.delta}`;
    pushEventLog(`${playerName}: ${delta} очок.`);
  }

  function handleFinalRoundMessage(message) {
    refreshCurrentGameState().catch(() => {});
    loadFinalSubmissions(true).catch(() => {});
    const player = state.currentGame?.players?.find((item) => item.id === message.playerId);
    const playerName = player?.name || message.by || `Player #${message.playerId}`;

    if (message.action === "submitted") {
      pushEventLog(`${playerName} надіслав фінальну відповідь.`);
      return;
    }

    if (message.action === "judged") {
      pushEventLog(`${message.by || "Host"} оцінив фінальну відповідь ${playerName}.`);
    }
  }

  function handleGameStateMessage(message) {
    refreshCurrentGameState()
      .then(async () => {
        if (message.refreshBoard) {
          await loadBoardForCurrentGame();
        }
        if (message.refreshFinalSubmissions) {
          await loadFinalSubmissions(true);
        }
      })
      .catch(() => {});

    if (message.action === "player_joined") {
      pushEventLog(`${message.by || "Player"} приєднався до гри.`);
      return;
    }

    if (message.action === "avatar_updated") {
      pushEventLog(`${message.by || "Player"} оновив аватар.`);
      return;
    }

    if (message.action === "question_completed") {
      pushEventLog(t("roundCompleted"));
      return;
    }

    if (message.action === "game_started") {
      pushEventLog(t("gameStartedEvent"));
      return;
    }

    if (message.action === "round_changed") {
      pushEventLog(t("roundChangedEvent", { round: message.roundName || t("builderRoundFallback") }));
      return;
    }

    if (message.action === "final_round_opened") {
      pushEventLog(t("finalRoundOpenedEvent"));
      return;
    }

    if (message.action === "game_finished") {
      pushEventLog(t("gameFinishedEvent"));
      return;
    }

    if (message.action === "answer_judged") {
      pushEventLog(`${message.by || "Host"} оцінив відповідь.`);
      return;
    }

    if (message.action === "final_submitted") {
      pushEventLog(`${message.by || "Player"} надіслав фінальну відповідь.`);
      return;
    }

    if (message.action === "final_judged") {
      pushEventLog(`${message.by || "Host"} завершив оцінювання фінальної відповіді.`);
    }
  }

  function buzz() {
    if (!state.currentGame?.id || !state.currentPlayerId) {
      showToast(t("choosePlayerForBuzz"), true);
      return;
    }
    if (!state.liveClient?.connected) {
      showToast(t("connectLiveFirst"), true);
      return;
    }
    const answeringPlayer = getAnsweringPlayer();
    if (answeringPlayer && answeringPlayer.id !== state.currentPlayerId) {
      showToast(t("stageAnotherPlayerAnswering", { name: answeringPlayer.name }), true);
      return;
    }
    sendLiveMessage(`/app/game/${state.currentGame.id}/buzz`, { playerId: Number(state.currentPlayerId) });
  }

    function logout() {
      clearToken();
      clearGuestNickname();
      clearSessionUserName();
      if (state.liveClient?.connected) {
        state.liveClient.disconnect(() => {});
      }
      state.liveClient = null;
      stopGameRefreshLoop();
    packSelect.innerHTML = `<option value=''>${t("packSelectInitial")}</option>`;
    joinCodeInput.value = "";
      playerNameInput.value = "";
      liveStatus.textContent = t("liveInactive");
    updateBuzzButtons();
    resetGameState();
    updateSessionUi();
    switchMenuView("home");
    showToast(t("sessionCleared"));
  }

  registerForm.addEventListener("submit", registerUser);
  loginForm.addEventListener("submit", loginUser);
  guestForm.addEventListener("submit", enterAsGuest);
  logoutBtn.addEventListener("click", logout);
  menuExitBtn.addEventListener("click", logout);
  playerForm.addEventListener("submit", addPlayer);
  builderPackForm.addEventListener("submit", createBuilderPack);
  builderRoundForm.addEventListener("submit", createBuilderRound);
  builderCategoryForm.addEventListener("submit", addBuilderCategory);
  builderQuestionForm.addEventListener("submit", addBuilderQuestion);
  avatarSettingsForm.addEventListener("submit", saveAvatarSettings);
  settingsRemoveAvatarBtn.addEventListener("click", removeAvatarSettings);
  settingsAvatarInput.addEventListener("change", async () => {
    const file = settingsAvatarInput.files[0];
    if (!file) {
      renderSettingsAvatar();
      return;
    }
    try {
      const avatarUrl = await saveAvatarFromFile(file);
      renderAvatarElement(settingsAvatarPreview, getSessionPlayerName() || t("playerLabel"), avatarUrl);
      settingsAvatarStatus.textContent = t("settingsAvatarReady");
    } catch (error) {
      settingsAvatarStatus.textContent = error.message;
    }
  });
  finalAnswerForm.addEventListener("submit", submitFinalAnswer);
  hostCameraToggleBtn.addEventListener("click", () => toggleCamera("host"));
  playerCameraToggleBtn.addEventListener("click", () => toggleCamera("player"));
  finalSubmissionsPanel.addEventListener("click", async (event) => {
    const refreshButton = event.target.closest("[data-final-refresh]");
    if (refreshButton) {
      await loadFinalSubmissions();
      return;
    }

    const judgeButton = event.target.closest("[data-final-judge-id]");
    if (!judgeButton) {
      return;
    }
    await judgeFinalSubmission(Number(judgeButton.dataset.finalJudgeId), judgeButton.dataset.finalCorrect === "true");
  });
  builderLoadPacksBtn.addEventListener("click", () => loadBuilderPacks());
  createGameBtn.addEventListener("click", createGame);
  reloadBoardBtn.addEventListener("click", loadBoardForCurrentGame);
  findGameBtn.addEventListener("click", loadGameByJoinCode);
  connectLiveBtn.addEventListener("click", connectLive);
    buzzBtn.addEventListener("click", buzz);
    modalBuzzBtn.addEventListener("click", buzz);
    playerOpenQuestionBtn.addEventListener("click", openQuestionModal);

  menuCreateGameBtn.addEventListener("click", () => switchMenuView("createGame"));
  menuJoinGameBtn.addEventListener("click", () => switchMenuView("joinGame"));
  menuPackBuilderBtn.addEventListener("click", () => switchMenuView("packBuilder"));
  menuCommunityPacksBtn.addEventListener("click", () => switchMenuView("communityPacks"));
  menuSettingsBtn.addEventListener("click", () => switchMenuView("settings"));
  backMenuButtons.forEach((button) => button.addEventListener("click", () => switchMenuView("home")));
  builderRoundSelect.addEventListener("change", async () => {
    state.currentBuilderRoundId = Number(builderRoundSelect.value);
    await loadBuilderBoard(state.currentBuilderPack?.id);
  });
    hostStageBackBtn.addEventListener("click", () => switchMenuView("createGame"));
    playerStageBackBtn.addEventListener("click", () => {
      if (state.liveClient?.connected) {
        state.liveClient.disconnect(() => {});
      }
      state.liveClient = null;
      stopGameRefreshLoop();
      stopCamera();
        state.currentPlayerId = null;
        updateBuzzButtons();
      liveStatus.textContent = t("liveInactive");
      switchMenuView("joinGame");
    });
      stagePlayerForm.addEventListener("submit", addStagePlayer);
    hostCorrectBtn.addEventListener("click", () => adjudicateAnswer(true));
    hostIncorrectBtn.addEventListener("click", () => adjudicateAnswer(false));
    hostPlayersRow.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-edit-player-id]");
      if (!button) {
        return;
      }
      await editPlayerScore(Number(button.dataset.editPlayerId));
    });

  builderPackSelect.addEventListener("change", async () => {
    state.currentBuilderRoundId = null;
    await loadBuilderBoard(Number(builderPackSelect.value));
  });

  joinCodeInput.addEventListener("input", () => {
    joinCodeInput.value = joinCodeInput.value.replace(/\D/g, "").slice(0, 6);
  });
  joinCodeInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    await loadGameByJoinCode();
  });

  playerSelect.addEventListener("change", () => {
      state.currentPlayerId = playerSelect.value ? Number(playerSelect.value) : null;
      updateBuzzButtons();
  });

    scoreboard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-player-id][data-score-change]");
      if (!button) {
        return;
      }
      updatePlayerScore(Number(button.dataset.playerId), Number(button.dataset.scoreChange));
    });

    builderBoard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete-question-id]");
      if (!button) {
        return;
      }
      deleteBuilderQuestion(Number(button.dataset.deleteQuestionId));
    });

  board.addEventListener("click", (event) => {
    const card = event.target.closest("[data-question-id]");
    if (!card || card.disabled) {
      return;
    }
    selectQuestion(Number(card.dataset.questionId));
  });

  hostBoard.addEventListener("click", (event) => {
    const card = event.target.closest("[data-question-id]");
    if (!card || card.disabled) {
      return;
    }
    selectQuestion(Number(card.dataset.questionId));
  });

  closeModalBtn.addEventListener("click", closeQuestionModal);
  showAnswerBtn.addEventListener("click", () => modalAnswerBlock.classList.remove("hidden"));
  markUsedBtn.addEventListener("click", completeQuestion);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeQuestionModal();
    }
  });

  languageSelect.addEventListener("change", async () => {
    await setLanguage(languageSelect.value);
  });

  async function init() {
    await setLanguage(state.currentLanguage);
    resetGameState();
    updateSessionUi();
    switchMenuView("home");
  }

  init();
})();
