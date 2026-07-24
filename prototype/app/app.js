const data = window.FOOBOW_DATA;
const storageKey = "foobow.prototype.state.v1";

const I18N = window.FOOBOW_APP_I18N;
const translations = I18N.ui;

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

// Legacy saved states used "zh"; normalize to the full locale set.
function normalizeLocale(locale) {
  if (locale === "zh") return "zh-Hans";
  return I18N.locales.indexOf(locale) === -1 ? "en" : locale;
}

function dictionary() {
  return translations[normalizeLocale(state.language)];
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
  setText("streakLabel", dictionary().streakLabel.replace("%{count}", state.streak));
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
    const moodKey = "mood" + mood.id.charAt(0).toUpperCase() + mood.id.slice(1);
    button.textContent = dictionary()[moodKey] || mood.label;
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

const BLESSING_LINES = I18N.blessingLines;

function pickFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

var blessingEngine = {
  provider: "mock",
  generate: function (request) {
    var locale = normalizeLocale(request.locale);
    var lines = BLESSING_LINES[locale] || BLESSING_LINES.en;
    var body = pickFrom(lines[request.category] || lines.family);
    var close = pickFrom(lines.close);
    var who = (request.recipient || "").trim();
    var joiner = I18N.noSpaceJoin.indexOf(locale) === -1 ? " " : "";
    var text = body + joiner + close;
    if (who) {
      var prefix = I18N.recipientPrefix[locale] || I18N.recipientPrefix.en;
      text = prefix(who, text);
    }
    // Simulate an async provider call; swap this for a fetch when a key exists.
    return new Promise(function (resolve) {
      window.setTimeout(function () { resolve({ text: text }); }, 850);
    });
  }
};

var lastBlessing = null;

// --- Pre-generated content pack -------------------------------------------
// Authored once (see content/blessing-pack.v1.json) and served from the
// public-assets bucket over CDN, so runtime AI token spend stays at zero.
// Loading is best-effort: if the CDN is unreachable the app simply shows no
// extra line, and nothing else changes.
var CONTENT_PACK_URL =
  "https://ifujcchqlotxenuitrey.supabase.co/storage/v1/object/public/public-assets/content/blessing-pack.v1.json";
var contentPack = null;
var contentPackReady = null;

function loadContentPack() {
  contentPackReady = fetch(CONTENT_PACK_URL)
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (pack) { contentPack = pack; })
    .catch(function () { contentPack = null; });
  return contentPackReady;
}

function packLine(group) {
  if (!contentPack || !contentPack[group]) return "";
  var lines = contentPack[group][normalizeLocale(state.language)];
  return Array.isArray(lines) && lines.length ? pickFrom(lines) : "";
}

// Shows a short, warm line in response to something the user just did.
// Waits for an in-flight pack load so an early tap still gets its line.
function showActionWhisper(group) {
  Promise.resolve(contentPackReady).then(function () {
    renderActionWhisper(group);
  });
}

function renderActionWhisper(group) {
  var line = packLine(group);
  if (!line) return;
  var node = document.getElementById("actionWhisper");
  if (!node) return;
  node.textContent = line;
  node.classList.remove("show");
  void node.offsetWidth;
  node.classList.add("show");
  window.clearTimeout(node.dataset.timer);
  node.dataset.timer = window.setTimeout(function () {
    node.classList.remove("show");
  }, 4200);
}

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
    showActionWhisper("lampWhispers");
  });
}

function applyTranslations() {
  const locale = normalizeLocale(state.language);
  const copy = dictionary();
  document.documentElement.lang = I18N.htmlLang[locale] || "en";

  const select = document.getElementById("languageSelect");
  if (select) {
    if (select.options.length !== I18N.locales.length) {
      select.replaceChildren();
      I18N.locales.forEach((code) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = I18N.langNames[code];
        select.append(option);
      });
    }
    select.value = locale;
    select.setAttribute("aria-label", copy.langLabel);
  }

  // Navigation labels live in both the top and bottom bars.
  document.querySelectorAll(".nav-item, .top-nav-item").forEach((item) => {
    const key = "nav" + item.dataset.target.charAt(0).toUpperCase() + item.dataset.target.slice(1);
    if (copy[key]) item.textContent = copy[key];
  });

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
    reaction: dictionary().thankYou,
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

document.getElementById("languageSelect").addEventListener("change", (event) => {
  state.language = normalizeLocale(event.target.value);
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
loadContentPack();
renderAll();
