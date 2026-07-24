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
    calmEyebrow: "Calm ritual",
    calmTitle: "Take a focused moment first.",
    calmCopy: "Use a short presence timer, optional soundscape, and quiet reflection before recording a symbolic deed.",
    guidedStepOne: "Breathe once and name the intention.",
    guidedStepTwo: "Hold the action gently until the timer completes.",
    guidedStepThree: "Record how you feel without pressure.",
    startFocus: "Start 20s focus",
    completeFocused: "Complete with focus",
    calmSafety: "This is symbolic comfort only. It does not guarantee luck, virtue, health, or real-world impact.",
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
    closeDialog: "Close",
    playSoundscape: "Play soundscape",
    stopSoundscape: "Stop sound",
    profileMenuTitle: "Your merit",
    profileMenuStats: "%{karma} karma · %{streak}-day streak",
    profileMenuOpen: "Open profile",
    profileMenuNote: "Sign in for a synced account in the Foobow mobile app.",
    blessingsEyebrow: "Blessings · 祈福",
    blessingsTitle: "Offer a blessing for someone you love.",
    blessingsCopy: "Choose who it is for, add a few words, and receive a warm blessing to hold. Symbolic comfort only — never a promise of luck.",
    blessingsRecipient: "For whom? (optional)",
    blessingsMessage: "A wish or worry you want to release (optional)",
    blessingsReceive: "Receive a blessing",
    blessingsGenerating: "Composing a blessing…",
    blessingsSave: "Keep this blessing",
    blessingsSaved: "Kept ✓",
    blessingReplySource: "A gentle blessing · symbolic comfort",
    prayCatFamily: "Family",
    prayCatHealth: "Health",
    prayCatStudy: "Study",
    prayCatTravel: "Safe travel",
    prayCatRemembrance: "Remembrance",
    prayCatGratitude: "Gratitude",
    lampEyebrow: "Wish lamp · 心灯",
    lampTitle: "Light a small lamp.",
    lampPlaceholder: "A quiet wish...",
    lampLight: "Light the lamp",
    dailyThoughts: [
      "A small kindness is still kindness.",
      "You can begin the day again at any hour.",
      "Let one worry rest; it will keep without you.",
      "Quiet effort counts, even unseen.",
      "Breathe once for yourself, once for someone far away.",
      "Today does not need to be heavy to matter.",
      "One gentle act can soften a whole afternoon.",
      "You are allowed to move slowly.",
      "Light a small lamp; darkness handles itself.",
      "Rest is also a good deed.",
      "Good begets good; blessings flow from kindness.",
      "Gather good virtue, and blessings come.",
      "Plant kind causes, harvest kind fruit.",
      "A spark of kindness blesses a lifetime.",
      "One good deed, one measure of merit."
    ]
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
    calmEyebrow: "\u9759\u5fc3\u4eea\u5f0f",
    calmTitle: "\u5148\u7559\u4e00\u4e2a\u4e13\u6ce8\u7684\u7247\u523b\u3002",
    calmCopy: "\u5728\u8bb0\u5f55\u8c61\u5f81\u6027\u5584\u4e3e\u524d\uff0c\u4f7f\u7528\u77ed\u6682\u8ba1\u65f6\u3001\u53ef\u9009\u58f0\u666f\u548c\u5b89\u9759\u53cd\u601d\u3002",
    guidedStepOne: "\u547c\u5438\u4e00\u6b21\uff0c\u8bf4\u51fa\u4eca\u5929\u7684\u5fc3\u610f\u3002",
    guidedStepTwo: "\u8f7b\u8f7b\u6309\u4f4f\u52a8\u4f5c\uff0c\u76f4\u5230\u8ba1\u65f6\u5b8c\u6210\u3002",
    guidedStepThree: "\u65e0\u538b\u529b\u5730\u8bb0\u5f55\u6b64\u523b\u7684\u611f\u53d7\u3002",
    startFocus: "\u5f00\u59cb 20 \u79d2\u4e13\u6ce8",
    completeFocused: "\u4e13\u6ce8\u5b8c\u6210",
    calmSafety: "\u8fd9\u53ea\u662f\u8c61\u5f81\u6027\u5b89\u6170\uff0c\u4e0d\u4fdd\u8bc1\u597d\u8fd0\u3001\u7f8e\u5fb7\u3001\u5065\u5eb7\u6216\u771f\u5b9e\u5f71\u54cd\u3002",
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
    closeDialog: "\u5173\u95ed",
    playSoundscape: "\u64ad\u653e\u58f0\u666f",
    stopSoundscape: "\u505c\u6b62\u58f0\u97f3",
    profileMenuTitle: "\u4f60\u7684\u798f\u62a5",
    profileMenuStats: "%{karma} \u5584\u7f18 \u00b7 \u8fde\u7eed %{streak} \u5929",
    profileMenuOpen: "\u6253\u5f00\u4e2a\u4eba\u9875",
    profileMenuNote: "\u5728 Foobow \u624b\u673a\u5e94\u7528\u767b\u5f55\uff0c\u5373\u53ef\u540c\u6b65\u8d26\u6237\u3002",
    blessingsEyebrow: "\u7948\u798f \u00b7 Blessings",
    blessingsTitle: "\u4e3a\u4f60\u6240\u7231\u7684\u4eba\uff0c\u9001\u4e0a\u4e00\u4efd\u795d\u798f\u3002",
    blessingsCopy: "\u9009\u62e9\u795d\u798f\u7684\u5bf9\u8c61\uff0c\u5199\u4e0b\u51e0\u53e5\u8bdd\uff0c\u6536\u4e0b\u4e00\u4efd\u53ef\u4ee5\u505c\u7559\u7684\u6e29\u67d4\u795d\u798f\u3002\u4ec5\u4e3a\u8c61\u5f81\u6027\u5b89\u6170\u2014\u2014\u7edd\u4e0d\u627f\u8bfa\u597d\u8fd0\u3002",
    blessingsRecipient: "\u795d\u798f\u7ed9\u8c01\uff1f\uff08\u53ef\u9009\uff09",
    blessingsMessage: "\u60f3\u653e\u4e0b\u7684\u4e00\u4e2a\u5fc3\u613f\u6216\u62c5\u5fc3\uff08\u53ef\u9009\uff09",
    blessingsReceive: "\u6536\u4e0b\u795d\u798f",
    blessingsGenerating: "\u6b63\u5728\u5199\u4e0b\u795d\u798f\u2026\u2026",
    blessingsSave: "\u7559\u4e0b\u8fd9\u4efd\u795d\u798f",
    blessingsSaved: "\u5df2\u7559\u4e0b \u2713",
    blessingReplySource: "\u4e00\u4efd\u6e29\u67d4\u7684\u795d\u798f \u00b7 \u8c61\u5f81\u6027\u5b89\u6170",
    prayCatFamily: "\u5bb6\u4eba",
    prayCatHealth: "\u5065\u5eb7",
    prayCatStudy: "\u5b66\u4e1a",
    prayCatTravel: "\u5e73\u5b89\u51fa\u884c",
    prayCatRemembrance: "\u8ffd\u601d",
    prayCatGratitude: "\u611f\u6069",
    lampEyebrow: "\u5fc3\u706f \u00b7 Wish lamp",
    lampTitle: "\u70b9\u4e00\u76cf\u5c0f\u706f\u3002",
    lampPlaceholder: "\u4e00\u4e2a\u5b89\u9759\u7684\u5fc3\u613f\u2026\u2026",
    lampLight: "\u70b9\u4eae\u5fc3\u706f",
    dailyThoughts: [
      "\u5fae\u5c0f\u7684\u5584\u610f\uff0c\u4e5f\u662f\u5584\u610f\u3002",
      "\u4e00\u5929\u4e2d\u7684\u4efb\u4f55\u65f6\u523b\uff0c\u90fd\u53ef\u4ee5\u91cd\u65b0\u5f00\u59cb\u3002",
      "\u653e\u4e0b\u4e00\u4ef6\u62c5\u5fc3\uff0c\u5b83\u81ea\u5df1\u4f1a\u5b89\u597d\u3002",
      "\u5b89\u9759\u7684\u52aa\u529b\uff0c\u5373\u4f7f\u65e0\u4eba\u770b\u89c1\uff0c\u4e5f\u7b97\u6570\u3002",
      "\u4e3a\u81ea\u5df1\u547c\u5438\u4e00\u6b21\uff0c\u4e5f\u4e3a\u8fdc\u65b9\u7684\u4eba\u547c\u5438\u4e00\u6b21\u3002",
      "\u4eca\u5929\u4e0d\u5fc5\u6c89\u91cd\uff0c\u4e5f\u4e00\u6837\u6709\u610f\u4e49\u3002",
      "\u4e00\u4e2a\u6e29\u548c\u7684\u4e3e\u52a8\uff0c\u80fd\u67d4\u8f6f\u6574\u4e2a\u4e0b\u5348\u3002",
      "\u4f60\u53ef\u4ee5\u6162\u6162\u6765\u3002",
      "\u70b9\u4e00\u76cf\u5c0f\u706f\uff0c\u9ed1\u6697\u81ea\u4f1a\u9000\u8ba9\u3002",
      "\u4f11\u606f\uff0c\u4e5f\u662f\u4e00\u4ef6\u5584\u4e8b\u3002",
      "\u5584\u6709\u5584\u62a5\uff0c\u798f\u4ece\u5584\u6765\u3002",
      "\u79ef\u5584\u5fb7\uff0c\u5f97\u798f\u62a5\u3002",
      "\u79cd\u5584\u56e0\uff0c\u6536\u798f\u679c\u3002",
      "\u5584\u5fc3\u4e00\u70b9\uff0c\u798f\u6cfd\u4e00\u751f\u3002",
      "\u4e00\u5ff5\u5584\u5fc3\uff0c\u4e07\u798f\u4e34\u95e8\u3002"
    ]
  }
};

let state = loadState();
let focusTimer = null;

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
    blessings: Array.isArray(saved.blessings) ? saved.blessings : base.blessings,
    keptBlessings: Array.isArray(saved.keptBlessings) ? saved.keptBlessings : base.keptBlessings,
    lamps: Array.isArray(saved.lamps) ? saved.lamps : base.lamps
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

  const ring = document.querySelector(".karma-ring");
  if (ring) {
    ring.classList.remove("glow");
    void ring.offsetWidth;
    ring.classList.add("glow");
    window.setTimeout(() => ring.classList.remove("glow"), 1200);
  }
}

function renderDailyThought() {
  const node = document.getElementById("dailyThought");
  if (!node) return;
  const thoughts = dictionary().dailyThoughts;
  const start = Date.UTC(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  node.textContent = thoughts[dayOfYear % thoughts.length];
}

function renderStats() {
  setText("karmaValue", state.karma);
  setText("deedCount", state.deeds);
  setText("streakLabel", `${state.streak} day streak`);
  const stats = dictionary().profileMenuStats
    .replace("%{karma}", state.karma)
    .replace("%{streak}", state.streak);
  setText("profileMenuStats", stats);
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
  const visibleDeeds = data.deeds.filter((deed) => state.activeCategory === "all" || deed.categoryKey === state.activeCategory);

  if (!visibleDeeds.some((deed) => deed.id === state.selectedDeed)) {
    state.selectedDeed = visibleDeeds[0]?.id || data.deeds[0].id;
  }

  visibleDeeds.forEach((deed) => {
    const item = document.createElement("article");
    item.className = `deed-item${state.selectedDeed === deed.id ? " selected" : ""}`;
    item.tabIndex = 0;
    item.dataset.deedId = deed.id;
    item.setAttribute("role", "button");
    item.setAttribute("aria-pressed", String(state.selectedDeed === deed.id));
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

  setText("deedTypeCount", `${visibleDeeds.length} shown`);
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
  renderFocusSession();
}

function renderSoundscapes() {
  const row = document.getElementById("soundscapeRow");
  row.replaceChildren();

  data.soundscapes.forEach((soundscape) => {
    const button = document.createElement("button");
    button.className = `layer${state.soundscape === soundscape.id ? " active" : ""}`;
    button.type = "button";
    button.textContent = soundscape.label;
    button.title = soundscape.description;
    button.setAttribute("aria-pressed", String(state.soundscape === soundscape.id));
    button.addEventListener("click", () => {
      state.soundscape = soundscape.id;
      saveState();
      renderSoundscapes();
      retuneSoundscapeAudio();
    });
    row.append(button);
  });
}

// --- Ambient soundscape engine -------------------------------------------
// All sound is synthesized with the Web Audio API (filtered noise with a
// slow LFO), so no audio assets are shipped. Playback is strictly opt-in,
// never persisted, and fades in and out gently.

const soundscapeProfiles = {
  water: { noise: "brown", filterType: "lowpass", frequency: 460, q: 0.8, lfoRate: 0.07, lfoDepth: 160, level: 0.12 },
  rain: { noise: "white", filterType: "bandpass", frequency: 2400, q: 0.55, lfoRate: 0.35, lfoDepth: 480, level: 0.05 },
  forest: { noise: "brown", filterType: "bandpass", frequency: 700, q: 0.45, lfoRate: 0.05, lfoDepth: 260, level: 0.1 }
};

let soundscapeAudio = null;
let soundscapePlaying = false;

function buildNoiseBuffer(ctx, kind) {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  let last = 0;
  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1;
    if (kind === "brown") {
      last = (last + 0.02 * white) / 1.02;
      channel[index] = last * 3.5;
    } else {
      channel[index] = white;
    }
  }
  return buffer;
}

function activeSoundscapeProfile() {
  return soundscapeProfiles[state.soundscape] || soundscapeProfiles.water;
}

function retuneSoundscapeAudio() {
  if (!soundscapeAudio) return;
  const profile = activeSoundscapeProfile();
  const { ctx, filter, lfo, lfoGain, master } = soundscapeAudio;

  if (soundscapeAudio.source) {
    try {
      soundscapeAudio.source.stop();
    } catch {
      // Already stopped.
    }
    soundscapeAudio.source.disconnect();
  }

  const source = ctx.createBufferSource();
  source.buffer = buildNoiseBuffer(ctx, profile.noise);
  source.loop = true;
  source.connect(filter);
  filter.type = profile.filterType;
  filter.frequency.value = profile.frequency;
  filter.Q.value = profile.q;
  lfo.frequency.value = profile.lfoRate;
  lfoGain.gain.value = profile.lfoDepth;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(profile.level, ctx.currentTime + 1.4);
  source.start();
  soundscapeAudio.source = source;
}

function startSoundscapeAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  stopSoundscapeAudio();

  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.connect(master);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  soundscapeAudio = { ctx, master, filter, lfo, lfoGain, source: null };
  retuneSoundscapeAudio();

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function stopSoundscapeAudio() {
  if (!soundscapeAudio) return;
  const { ctx, master } = soundscapeAudio;
  try {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
  } catch {
    // Context may already be closed.
  }
  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, 620);
  soundscapeAudio = null;
}

function renderSoundscapeToggle() {
  const toggle = document.getElementById("soundscapeToggle");
  const wave = document.getElementById("soundWave");
  if (!toggle || !wave) return;
  toggle.textContent = dictionary()[soundscapePlaying ? "stopSoundscape" : "playSoundscape"];
  toggle.setAttribute("aria-pressed", String(soundscapePlaying));
  wave.classList.toggle("playing", soundscapePlaying);
}

function renderFocusSession() {
  const progress = Math.max(0, Math.min(100, state.focusProgress || 0));
  const bar = document.getElementById("focusProgress");
  const status = document.getElementById("calmStatus");
  const completeButton = document.getElementById("completeFocusedRitual");

  if (bar) bar.style.width = `${progress}%`;
  if (status) {
    status.textContent = state.focusReady ? "ready" : progress > 0 ? `${progress}%` : "optional";
  }
  if (completeButton) completeButton.disabled = !state.focusReady;
}

function startFocusSession() {
  window.clearInterval(focusTimer);
  state.focusProgress = 0;
  state.focusReady = false;
  renderFocusSession();

  focusTimer = window.setInterval(() => {
    state.focusProgress = Math.min(100, (state.focusProgress || 0) + 20);
    state.focusReady = state.focusProgress >= 100;
    renderFocusSession();
    if (state.focusReady) {
      window.clearInterval(focusTimer);
      saveState();
    }
  }, 600);
}

function completeFocusedRitual() {
  if (!state.focusReady) return;
  updateKarma(7);
  state.focusProgress = 0;
  state.focusReady = false;
  state.journal = state.journal || "I took a calm moment before completing one symbolic deed.";
  saveState();
  renderAll();
  const scene = document.getElementById("ritualScene");
  scene.classList.remove("completed");
  window.requestAnimationFrame(() => scene.classList.add("completed"));
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

function renderMapPins() {
  const visibleSpotIds = Object.entries(data.spots)
    .filter(([, spot]) => state.activeCategory === "all" || spot.categoryKey === state.activeCategory)
    .map(([id]) => id);

  if (!visibleSpotIds.includes(state.selectedSpot)) {
    state.selectedSpot = visibleSpotIds[0] || "east-lake";
  }

  document.querySelectorAll(".map-pin").forEach((pin) => {
    const isVisible = visibleSpotIds.includes(pin.dataset.spotId);
    pin.classList.toggle("hidden", !isVisible);
    pin.disabled = !isVisible;
  });
}

function renderCategoryFilters() {
  ["mapLayerRow", "deedCategoryRow"].forEach((containerId) => {
    const row = document.getElementById(containerId);
    row.replaceChildren();

    data.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = `layer${state.activeCategory === category.id ? " active" : ""}`;
      button.type = "button";
      button.textContent = category.label;
      button.dataset.categoryId = category.id;
      button.setAttribute("aria-pressed", String(state.activeCategory === category.id));
      button.addEventListener("click", () => {
        state.activeCategory = category.id;
        saveState();
        renderAll();
      });
      row.append(button);
    });
  });
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

// --- Blessing engine (祈福) -------------------------------------------------
// Provider-agnostic. In mock mode it composes a warm, symbolic blessing
// locally (no key needed). To use a real model, set an API base + admin token
// and route through the backend: POST {apiBase}/blessings/intentions with
// { category, recipient, message, locale }; the server calls the configured
// provider (Anthropic, OpenAI, or Gemini) and returns the same { text } shape.
// No provider ever promises luck or outcomes — only warm reflection.
const PRAY_CATEGORIES = ["family", "health", "study", "travel", "remembrance", "gratitude"];

const BLESSING_LINES = {
  en: {
    family: [
      "May your home hold a little more warmth tonight.",
      "May the ones you love feel quietly held.",
      "May kindness pass easily between you and yours."
    ],
    health: [
      "May your body find some ease, and your mind a little rest.",
      "May each breath feel a touch lighter.",
      "May gentle days find their way to you."
    ],
    study: [
      "May your focus settle like still water.",
      "May what you learn stay close when you need it.",
      "May effort and calm walk together for you."
    ],
    travel: [
      "May your road be smooth and your return be safe.",
      "May every mile feel a little kinder.",
      "May you arrive rested and whole."
    ],
    remembrance: [
      "May the one you miss feel near in the quiet.",
      "May your memories keep their warmth.",
      "May grief soften, slowly, into gratitude."
    ],
    gratitude: [
      "May the good you have noticed grow roots.",
      "May thankfulness lighten the whole day.",
      "May you feel, for a moment, how much is already enough."
    ],
    close: ["Carry this lightly.", "Rest a moment here.", "You are not carrying it alone.", "Let it be gentle."]
  },
  zh: {
    family: ["愿你的家，今晚多一分温暖。", "愿你所爱的人，被静静地守护。", "愿善意在你们之间轻轻流动。"],
    health: ["愿你的身体得些安适，心得些休息。", "愿每一次呼吸，都轻一点。", "愿温和的日子，慢慢向你走来。"],
    study: ["愿你的专注，如止水般安定。", "愿所学在需要时，仍在身边。", "愿努力与平静，与你同行。"],
    travel: ["愿你一路平顺，归途平安。", "愿每一段路，都温柔一点。", "愿你安然抵达，身心俱全。"],
    remembrance: ["愿你思念的人，在安静里离你很近。", "愿回忆一直温热。", "愿悲伤慢慢，化作感恩。"],
    gratitude: ["愿你留意到的好，慢慢扎根。", "愿感恩，让一整天都轻一些。", "愿你此刻感到，拥有的已经足够。"],
    close: ["轻轻地，把它带着。", "在这里，停一会儿。", "你不是一个人在担着。", "让它温柔地存在。"]
  }
};

function pickFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

var blessingEngine = {
  provider: "mock",
  generate: function (request) {
    var lines = BLESSING_LINES[request.locale] || BLESSING_LINES.en;
    var body = pickFrom(lines[request.category] || lines.family);
    var close = pickFrom(lines.close);
    var who = (request.recipient || "").trim();
    var text;
    if (request.locale === "zh") {
      text = body + close;
      if (who) text = "给" + who + "：" + text;
    } else {
      text = body + " " + close;
      if (who) text = "For " + who + " — " + text;
    }
    // Simulate an async provider call; swap this for a fetch when a key exists.
    return new Promise(function (resolve) {
      window.setTimeout(function () { resolve({ text: text }); }, 850);
    });
  }
};

var lastBlessing = null;

function renderPrayCategories() {
  const row = document.getElementById("prayCats");
  if (!row) return;
  row.replaceChildren();
  PRAY_CATEGORIES.forEach(function (cat) {
    const key = "prayCat" + cat.charAt(0).toUpperCase() + cat.slice(1);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pray-cat" + (state.prayCategory === cat ? " active" : "");
    btn.dataset.category = cat;
    btn.setAttribute("aria-pressed", String(state.prayCategory === cat));
    btn.textContent = dictionary()[key] || cat;
    btn.addEventListener("click", function () {
      state.prayCategory = cat;
      saveState();
      renderPrayCategories();
    });
    row.append(btn);
  });
}

function renderLamps() {
  const list = document.getElementById("lampList");
  const count = document.getElementById("lampCount");
  if (!list) return;
  if (count) count.textContent = String(state.lamps.length);
  list.replaceChildren();
  state.lamps.slice(0, 6).forEach(function (lamp) {
    const li = document.createElement("li");
    li.className = "lamp-item";
    const flame = document.createElement("span");
    flame.className = "lamp-dot";
    flame.setAttribute("aria-hidden", "true");
    flame.textContent = "🪔";
    const text = document.createElement("span");
    text.textContent = lamp.wish || "·";
    li.append(flame, text);
    list.append(li);
  });
}

function setupBlessings() {
  const prayButton = document.getElementById("prayButton");
  const reply = document.getElementById("blessingReply");
  const replyText = document.getElementById("blessingReplyText");
  const replySource = document.getElementById("blessingReplySource");
  const saveButton = document.getElementById("saveBlessing");
  const lightLamp = document.getElementById("lightLamp");
  const lampStage = document.getElementById("lampStage");
  const lampWish = document.getElementById("lampWish");
  if (!prayButton) return;

  prayButton.addEventListener("click", async function () {
    const dict = dictionary();
    reply.hidden = false;
    reply.classList.add("loading");
    replyText.textContent = dict.blessingsGenerating;
    replySource.textContent = "";
    saveButton.hidden = true;
    prayButton.disabled = true;

    const result = await blessingEngine.generate({
      category: state.prayCategory,
      recipient: document.getElementById("prayRecipient").value,
      message: document.getElementById("prayMessage").value,
      locale: state.language
    });

    lastBlessing = result.text;
    reply.classList.remove("loading");
    replyText.textContent = result.text;
    replySource.textContent = dict.blessingReplySource;
    saveButton.hidden = false;
    saveButton.textContent = dict.blessingsSave;
    saveButton.disabled = false;
    prayButton.disabled = false;
  });

  saveButton.addEventListener("click", function () {
    if (!lastBlessing) return;
    state.keptBlessings.unshift({ id: "kept_" + Date.now(), body: lastBlessing });
    updateKarma(1);
    saveState();
    saveButton.textContent = dictionary().blessingsSaved;
    saveButton.disabled = true;
  });

  lightLamp.addEventListener("click", function () {
    const wish = lampWish.value.trim();
    state.lamps.unshift({ id: "lamp_" + Date.now(), wish: wish, litAt: Date.now() });
    lampWish.value = "";
    updateKarma(1);
    saveState();
    lampStage.classList.remove("lit");
    void lampStage.offsetWidth;
    lampStage.classList.add("lit");
    renderLamps();
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
  document.body.classList.toggle("senior-mode", Boolean(state.settings.seniorMode));
  document.getElementById("seniorToggle").setAttribute("aria-pressed", String(Boolean(state.settings.seniorMode)));
  applyTranslations();
  renderDailyThought();
  renderSoundscapeToggle();
  renderStats();
  renderCategoryFilters();
  renderSoundscapes();
  renderMapPins();
  renderMoods();
  renderDeeds();
  renderSpot(state.selectedSpot);
  renderBlessings();
  renderPrayCategories();
  renderLamps();
  renderSettings();
  renderFocusSession();
  document.getElementById("journalEntry").value = state.journal;
  const mood = data.moods.find((item) => item.id === state.mood) || data.moods[0];
  setText("recommendedDeed", mood.deed);
}

function navigateTo(target) {
  document.querySelectorAll(".nav-item, .top-nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.target === target);
  });
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  const screen = document.getElementById(`screen-${target}`);
  if (screen) screen.classList.add("active");
}

// Both the bottom tab bar (buttons) and the top nav (links) drive the same
// single-page navigation and stay in sync.
document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => navigateTo(button.dataset.target));
});

document.querySelectorAll(".top-nav-item").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo(link.dataset.target);
  });
});

// Profile menu (top-right): opens on click, closes on outside click or Escape.
(function setupProfileMenu() {
  const trigger = document.getElementById("profileMenuButton");
  const dropdown = document.getElementById("profileDropdown");
  if (!trigger || !dropdown) return;

  function setOpen(open) {
    dropdown.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(dropdown.hidden);
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.hidden && !dropdown.contains(event.target) && event.target !== trigger) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  const openProfile = document.getElementById("openProfileMenuItem");
  if (openProfile) {
    openProfile.addEventListener("click", () => {
      navigateTo("profile");
      setOpen(false);
    });
  }
})();

document.querySelectorAll(".map-pin").forEach((pin) => {
  pin.addEventListener("click", () => renderSpot(pin.dataset.spotId));
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

document.getElementById("startFocusSession").addEventListener("click", startFocusSession);
document.getElementById("completeFocusedRitual").addEventListener("click", completeFocusedRitual);

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

document.getElementById("seniorToggle").addEventListener("click", () => {
  state.settings.seniorMode = !state.settings.seniorMode;
  saveState();
  renderAll();
});

document.getElementById("soundscapeToggle").addEventListener("click", () => {
  soundscapePlaying = !soundscapePlaying;
  if (soundscapePlaying) {
    startSoundscapeAudio();
  } else {
    stopSoundscapeAudio();
  }
  renderSoundscapeToggle();
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

setupBlessings();
renderAll();
