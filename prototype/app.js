const data = window.FOOBOW_DATA;
const storageKey = "foobow.prototype.state.v1";

const translations = {
  en: {
    eyebrow: "Virtual good karma map",
    todayEyebrow: "Today",
    todayTitle: "Do one quiet good deed.",
    todayCopy: "Check in, choose a small symbolic action, and leave the day a little lighter.",
    karmaLabel: "karma",
    moodTitle: "How are you arriving?",
    recommended: "Recommended deed",
    recommendedCopy: "A symbolic release that avoids real-world ecological harm.",
    completeDeed: "Complete deed",
    journalTitle: "Karma journal",
    journalPlaceholder: "Today I want to release one worry and do one kind thing.",
    mapEyebrow: "World map",
    mapTitle: "Explore places that need a little light.",
    deedsEyebrow: "Deed catalog",
    deedsTitle: "Small rituals, clear categories.",
    ritualPreview: "Ritual preview",
    performRitual: "Perform ritual",
    communityEyebrow: "Community",
    communityTitle: "A low-pressure kindness wall.",
    blessingPlaceholder: "May your road feel less heavy today.",
    sendBlessing: "Send blessing",
    profileEyebrow: "Profile",
    profileCopy: "Private journal on. Ranking visibility set to quiet mode.",
    badgesTitle: "Badges",
    donate: "Donate",
    settingsTitle: "Enterprise settings",
    settingPrivacy: "Private journal",
    settingQuiet: "Quiet rankings",
    settingReceipts: "Donation receipts",
    exportData: "Export data",
    deleteData: "Delete local data",
    report: "Report",
    reported: "Reported for review",
    dialogEyebrow: "Real impact option",
    dialogTitle: "Support a verified cause",
    dialogCopy: "This donation supports real operating costs or partner campaigns. It does not buy luck, virtue, or guaranteed karma.",
    closeDialog: "Close"
  },
  zh: {
    eyebrow: "\u865a\u62df\u5584\u7f18\u5730\u56fe",
    todayEyebrow: "\u4eca\u65e5",
    todayTitle: "\u505a\u4e00\u4ef6\u5b89\u9759\u7684\u5c0f\u5584\u4e8b\u3002",
    todayCopy: "\u7b7e\u5230\u3001\u9009\u62e9\u4e00\u4e2a\u8c61\u5f81\u6027\u5584\u4e3e\uff0c\u8ba9\u4eca\u5929\u7a0d\u5fae\u8f7b\u4e00\u70b9\u3002",
    karmaLabel: "\u5584\u7f18",
    moodTitle: "\u4eca\u5929\u7684\u5fc3\u60c5\u5982\u4f55\uff1f",
    recommended: "\u63a8\u8350\u5584\u4e3e",
    recommendedCopy: "\u8c61\u5f81\u6027\u653e\u751f\uff0c\u907f\u514d\u771f\u5b9e\u653e\u751f\u5e26\u6765\u7684\u751f\u6001\u98ce\u9669\u3002",
    completeDeed: "\u5b8c\u6210\u5584\u4e3e",
    journalTitle: "\u5584\u7f18\u65e5\u8bb0",
    journalPlaceholder: "\u4eca\u5929\u6211\u60f3\u653e\u4e0b\u4e00\u70b9\u62c5\u5fc3\uff0c\u505a\u4e00\u4ef6\u6e29\u548c\u7684\u5c0f\u4e8b\u3002",
    mapEyebrow: "\u4e16\u754c\u5730\u56fe",
    mapTitle: "\u63a2\u7d22\u9700\u8981\u4e00\u70b9\u5149\u7684\u5730\u65b9\u3002",
    deedsEyebrow: "\u5584\u4e3e\u76ee\u5f55",
    deedsTitle: "\u5c0f\u4eea\u5f0f\uff0c\u6e05\u6670\u5206\u7c7b\u3002",
    ritualPreview: "\u4eea\u5f0f\u9884\u89c8",
    performRitual: "\u6267\u884c\u4eea\u5f0f",
    communityEyebrow: "\u793e\u533a",
    communityTitle: "\u4f4e\u538b\u529b\u7684\u795d\u798f\u5899\u3002",
    blessingPlaceholder: "\u613f\u4f60\u4eca\u5929\u7684\u8def\u4e0d\u90a3\u4e48\u6c89\u91cd\u3002",
    sendBlessing: "\u9001\u51fa\u795d\u798f",
    profileEyebrow: "\u4e2a\u4eba",
    profileCopy: "\u79c1\u4eba\u65e5\u8bb0\u5df2\u5f00\u542f\uff0c\u6392\u540d\u663e\u793a\u4e3a\u5b89\u9759\u6a21\u5f0f\u3002",
    badgesTitle: "\u5fbd\u7ae0",
    donate: "\u6350\u52a9",
    settingsTitle: "\u4f01\u4e1a\u7ea7\u8bbe\u7f6e",
    settingPrivacy: "\u79c1\u4eba\u65e5\u8bb0",
    settingQuiet: "\u5b89\u9759\u6392\u540d",
    settingReceipts: "\u6350\u52a9\u6536\u636e",
    exportData: "\u5bfc\u51fa\u6570\u636e",
    deleteData: "\u5220\u9664\u672c\u5730\u6570\u636e",
    report: "\u4e3e\u62a5",
    reported: "\u5df2\u63d0\u4ea4\u5ba1\u6838",
    dialogEyebrow: "\u771f\u5b9e\u5f71\u54cd\u9009\u9879",
    dialogTitle: "\u652f\u6301\u5df2\u9a8c\u8bc1\u7684\u516c\u76ca\u9879\u76ee",
    dialogCopy: "\u6350\u52a9\u7528\u4e8e\u771f\u5b9e\u8fd0\u8425\u6210\u672c\u6216\u5408\u4f5c\u516c\u76ca\u9879\u76ee\u3002\u5b83\u4e0d\u4f1a\u8d2d\u4e70\u597d\u8fd0\u3001\u7f8e\u5fb7\u6216\u4fdd\u8bc1\u5584\u62a5\u3002",
    closeDialog: "\u5173\u95ed"
  }
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return mergeState(data.defaultState, saved || {});
  } catch {
    return structuredClone(data.defaultState);
  }
}

function mergeState(base, saved) {
  return {
    ...structuredClone(base),
    ...saved,
    settings: {
      ...base.settings,
      ...(saved.settings || {})
    },
    blessings: Array.isArray(saved.blessings) ? saved.blessings : base.blessings
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function dictionary() {
  return translations[state.language];
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function updateKarma(delta) {
  state.karma = Math.min(100, state.karma + delta);
  state.deeds += 1;
  saveState();
  renderStats();
}

function renderStats() {
  setText("karmaValue", state.karma);
  setText("deedCount", state.deeds);
  setText("streakLabel", `${state.streak} day streak`);
}

function renderMoods() {
  const grid = document.getElementById("moodGrid");
  grid.replaceChildren();

  data.moods.forEach((mood) => {
    const button = document.createElement("button");
    button.className = `mood${state.mood === mood.id ? " selected" : ""}`;
    button.type = "button";
    button.dataset.mood = mood.id;
    button.dataset.deed = mood.deed;
    button.textContent = mood.label;
    button.setAttribute("aria-pressed", String(state.mood === mood.id));
    button.addEventListener("click", () => {
      state.mood = mood.id;
      state.selectedDeed = mood.id === "grateful" ? "elder-crosswalk" : state.selectedDeed;
      setText("recommendedDeed", mood.deed);
      saveState();
      renderMoods();
    });
    grid.append(button);
  });
}

function renderDeeds() {
  const list = document.getElementById("deedList");
  list.replaceChildren();

  data.deeds.forEach((deed) => {
    const item = document.createElement("article");
    item.className = `deed-item${state.selectedDeed === deed.id ? " selected" : ""}`;
    item.tabIndex = 0;
    item.dataset.deedId = deed.id;
    item.innerHTML = `
      <span class="deed-mark ${deed.mark}"></span>
      <div>
        <h3></h3>
        <p></p>
      </div>
    `;
    item.querySelector("h3").textContent = deed.title;
    item.querySelector("p").textContent = deed.shortDescription;
    item.addEventListener("click", () => selectDeed(deed.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDeed(deed.id);
      }
    });
    list.append(item);
  });

  renderSelectedDeed();
}

function selectDeed(deedId) {
  state.selectedDeed = deedId;
  saveState();
  renderDeeds();
}

function renderSelectedDeed() {
  const deed = data.deeds.find((item) => item.id === state.selectedDeed) || data.deeds[0];
  setText("ritualTitle", deed.title);
  setText("ritualDesc", deed.description);
}

function renderSpot(spotId) {
  const spot = data.spots[spotId] || data.spots["east-lake"];
  state.selectedSpot = spotId;
  setText("spotName", spot.name);
  setText("spotCategory", spot.category);
  setText("spotText", spot.text);
  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.classList.toggle("active", pin.dataset.spotId === spotId);
    pin.setAttribute("aria-pressed", String(pin.dataset.spotId === spotId));
  });
  saveState();
}

function renderBlessings() {
  const list = document.getElementById("blessingList");
  list.replaceChildren();

  state.blessings.forEach((blessing) => {
    const card = document.createElement("article");
    card.className = `blessing${blessing.reported ? " reported" : ""}`;

    const text = document.createElement("p");
    text.textContent = blessing.body;

    const actions = document.createElement("div");
    actions.className = "blessing-actions";

    const reaction = document.createElement("button");
    reaction.type = "button";
    reaction.textContent = blessing.reaction;
    reaction.addEventListener("click", () => updateKarma(1));

    const report = document.createElement("button");
    report.type = "button";
    report.textContent = blessing.reported ? dictionary().reported : dictionary().report;
    report.disabled = blessing.reported;
    report.addEventListener("click", () => {
      blessing.reported = true;
      saveState();
      renderBlessings();
    });

    actions.append(reaction, report);
    card.append(text, actions);
    list.append(card);
  });
}

function applyTranslations() {
  const copy = dictionary();
  document.documentElement.lang = state.language === "en" ? "en" : "zh-Hans";
  document.getElementById("languageToggle").textContent = state.language === "en" ? "\u4e2d" : "EN";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = copy[node.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = copy[node.dataset.i18nPlaceholder];
  });
}

function renderSettings() {
  document.getElementById("settingPrivateJournal").checked = state.settings.privateJournal;
  document.getElementById("settingQuietRanking").checked = state.settings.quietRanking;
  document.getElementById("settingDonationReceipts").checked = state.settings.donationReceipts;
}

function renderAll() {
  document.body.classList.toggle("dark", state.theme === "dark");
  applyTranslations();
  renderStats();
  renderMoods();
  renderDeeds();
  renderSpot(state.selectedSpot);
  renderBlessings();
  renderSettings();
  document.getElementById("journalEntry").value = state.journal;
  const mood = data.moods.find((item) => item.id === state.mood) || data.moods[0];
  setText("recommendedDeed", mood.deed);
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(`screen-${target}`).classList.add("active");
  });
});

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => renderSpot(pin.dataset.spotId));
});

document.querySelectorAll(".layer").forEach((layer) => {
  layer.addEventListener("click", () => {
    document.querySelectorAll(".layer").forEach((item) => item.classList.remove("active"));
    layer.classList.add("active");
  });
});

document.getElementById("completeDaily").addEventListener("click", () => {
  updateKarma(4);
  state.streak += 1;
  state.journal = state.journal || "I completed one quiet deed and chose a lighter next step.";
  saveState();
  renderAll();
});

document.getElementById("performRitual").addEventListener("click", () => {
  updateKarma(5);
  const scene = document.getElementById("ritualScene");
  scene.classList.remove("completed");
  window.requestAnimationFrame(() => scene.classList.add("completed"));
});

document.getElementById("journalEntry").addEventListener("input", (event) => {
  state.journal = event.target.value;
  saveState();
});

document.getElementById("blessingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("blessingInput");
  const message = input.value.trim();
  if (!message) return;

  state.blessings.unshift({
    id: `local-${Date.now()}`,
    body: message,
    reaction: state.language === "en" ? "Thank you" : "\u8c22\u8c22",
    reported: false
  });
  input.value = "";
  updateKarma(2);
  saveState();
  renderBlessings();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  renderAll();
});

document.getElementById("languageToggle").addEventListener("click", () => {
  state.language = state.language === "en" ? "zh" : "en";
  saveState();
  renderAll();
});

["settingPrivateJournal", "settingQuietRanking", "settingDonationReceipts"].forEach((id) => {
  document.getElementById(id).addEventListener("change", (event) => {
    const key = event.target.dataset.settingKey;
    state.settings[key] = event.target.checked;
    saveState();
  });
});

document.getElementById("exportDataButton").addEventListener("click", () => {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "foobow-local-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

document.getElementById("deleteDataButton").addEventListener("click", () => {
  const confirmed = window.confirm("Delete local prototype data on this device?");
  if (!confirmed) return;
  localStorage.removeItem(storageKey);
  state = structuredClone(data.defaultState);
  renderAll();
});

const dialog = document.getElementById("impactDialog");
document.getElementById("donateButton").addEventListener("click", () => {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
});

document.getElementById("closeDialog").addEventListener("click", () => {
  dialog.close();
});

renderAll();
