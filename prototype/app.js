const state = {
  karma: 68,
  deeds: 42,
  language: "en",
};

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
    dialogEyebrow: "Real impact option",
    dialogTitle: "Support a verified cause",
    dialogCopy: "This donation supports real operating costs or partner campaigns. It does not buy luck, virtue, or guaranteed karma.",
    closeDialog: "Close",
  },
  zh: {
    eyebrow: "虚拟善缘地图",
    todayEyebrow: "今日",
    todayTitle: "做一件安静的小善事。",
    todayCopy: "签到、选择一个象征性善举，让今天稍微轻一点。",
    karmaLabel: "善缘",
    moodTitle: "今天的心情如何？",
    recommended: "推荐善举",
    recommendedCopy: "象征性放生，避免真实放生带来的生态风险。",
    completeDeed: "完成善举",
    journalTitle: "善缘日记",
    journalPlaceholder: "今天我想放下一点担心，做一件温和的小事。",
    mapEyebrow: "世界地图",
    mapTitle: "探索需要一点光的地方。",
    deedsEyebrow: "善举目录",
    deedsTitle: "小仪式，清晰分类。",
    ritualPreview: "仪式预览",
    performRitual: "执行仪式",
    communityEyebrow: "社区",
    communityTitle: "低压力的祝福墙。",
    blessingPlaceholder: "愿你今天的路不那么沉重。",
    sendBlessing: "送出祝福",
    profileEyebrow: "个人",
    profileCopy: "私人日记已开启，排名显示为安静模式。",
    badgesTitle: "徽章",
    donate: "捐助",
    settingsTitle: "企业级设置",
    settingPrivacy: "私人日记",
    settingQuiet: "安静排名",
    settingReceipts: "捐助收据",
    dialogEyebrow: "真实影响选项",
    dialogTitle: "支持已验证的公益项目",
    dialogCopy: "捐助用于真实运营成本或合作公益项目。它不会购买好运、美德或保证善报。",
    closeDialog: "关闭",
  },
};

function updateKarma(delta) {
  state.karma = Math.min(100, state.karma + delta);
  state.deeds += 1;
  document.getElementById("karmaValue").textContent = state.karma;
  document.getElementById("deedCount").textContent = state.deeds;
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

document.querySelectorAll(".mood").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mood").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    document.getElementById("recommendedDeed").textContent = button.dataset.deed;
  });
});

document.getElementById("completeDaily").addEventListener("click", () => {
  updateKarma(4);
  document.getElementById("streakLabel").textContent = "8 day streak";
  document.getElementById("journalEntry").value = "I completed one quiet deed and chose a lighter next step.";
});

const spotCopy = {
  "East Lake, Wuhan": "Release a digital fish into the lake and add one ripple to the shared kindness map.",
  "Toronto crosswalk": "Guide an elder safely across a winter street and add care to the elder-support layer.",
  "Amazon restoration grove": "Water a young tree in a shared digital forest connected to environmental campaigns.",
  "Night walk corridor": "Light a path for someone walking home with worry, grief, or loneliness.",
};

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    document.querySelectorAll(".map-pin").forEach((item) => item.classList.remove("active"));
    pin.classList.add("active");
    document.getElementById("spotName").textContent = pin.dataset.spot;
    document.getElementById("spotCategory").textContent = pin.dataset.category;
    document.getElementById("spotText").textContent = spotCopy[pin.dataset.spot];
  });
});

document.querySelectorAll(".layer").forEach((layer) => {
  layer.addEventListener("click", () => {
    document.querySelectorAll(".layer").forEach((item) => item.classList.remove("active"));
    layer.classList.add("active");
  });
});

document.querySelectorAll(".deed-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".deed-item").forEach((deed) => deed.classList.remove("selected"));
    item.classList.add("selected");
    document.getElementById("ritualTitle").textContent = item.dataset.title;
    document.getElementById("ritualDesc").textContent = item.dataset.desc;
  });
});

document.getElementById("performRitual").addEventListener("click", () => {
  updateKarma(5);
  document.getElementById("ritualScene").classList.remove("completed");
  window.requestAnimationFrame(() => {
    document.getElementById("ritualScene").classList.add("completed");
  });
});

document.getElementById("blessingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("blessingInput");
  const message = input.value.trim();
  if (!message) return;

  const card = document.createElement("article");
  card.className = "blessing";
  const text = document.createElement("p");
  text.textContent = message;
  const action = document.createElement("button");
  action.type = "button";
  action.textContent = state.language === "en" ? "Thank you" : "谢谢";
  card.append(text, action);
  document.getElementById("blessingList").prepend(card);
  input.value = "";
  updateKarma(2);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("languageToggle").addEventListener("click", () => {
  state.language = state.language === "en" ? "zh" : "en";
  document.documentElement.lang = state.language === "en" ? "en" : "zh-Hans";
  document.getElementById("languageToggle").textContent = state.language === "en" ? "中" : "EN";
  const dictionary = translations[state.language];

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = dictionary[node.dataset.i18n];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = dictionary[node.dataset.i18nPlaceholder];
  });
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
