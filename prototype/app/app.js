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
    lamps: Array.isArray(saved.lamps) ? saved.lamps : base.lamps,
    activity: Array.isArray(saved.activity) ? saved.activity : base.activity,
    posts: Array.isArray(saved.posts) ? saved.posts : base.posts,
    muyuTaps: typeof saved.muyuTaps === "number" ? saved.muyuTaps : 0
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

let zenAudioCtx = null;

function getZenAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!zenAudioCtx || zenAudioCtx.state === "closed") {
    zenAudioCtx = new AudioCtx();
  }
  if (zenAudioCtx.state === "suspended") {
    zenAudioCtx.resume().catch(() => {});
  }
  return zenAudioCtx;
}

function playMuyuSound() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  // 1. Resonant hollow wooden block
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(820, t);
  osc1.frequency.exponentialRampToValueAtTime(540, t + 0.08);

  gain1.gain.setValueAtTime(0.65, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(t);
  osc1.stop(t + 0.13);

  // 2. Warm low-mid body resonance
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(360, t);
  osc2.frequency.exponentialRampToValueAtTime(270, t + 0.06);

  gain2.gain.setValueAtTime(0.35, t);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(t);
  osc2.stop(t + 0.1);

  // 3. Crisp mallet impact transient
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = "square";
  osc3.frequency.setValueAtTime(1600, t);
  osc3.frequency.exponentialRampToValueAtTime(450, t + 0.018);

  gain3.gain.setValueAtTime(0.25, t);
  gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start(t);
  osc3.stop(t + 0.02);
}

function playZenChime() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  [523.25, 1046.5, 1567.98].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    const initialGain = 0.14 / (idx + 1);
    gain.gain.setValueAtTime(initialGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.55);
  });
}

function playIncenseChime() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  [659.25, 1318.5, 1975.53].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    const initialGain = 0.12 / (idx + 1);
    gain.gain.setValueAtTime(initialGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 2.25);
  });
}

function playWaterSplash() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(780, t + 0.08);
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.22);
  gain.gain.setValueAtTime(0.22, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.26);
}

function playWheelClick() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(940, t);
  osc.frequency.exponentialRampToValueAtTime(360, t + 0.022);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.025);
}

function playWheelChime() {
  const ctx = getZenAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  [880, 1320, 1760, 2640].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    const initialGain = 0.12 / (idx + 1);
    gain.gain.setValueAtTime(initialGain, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.85);
  });
}

function getMeritText(delta = 1) {
  const loc = normalizeLocale(state.language);
  const sign = delta >= 0 ? "+" : "";
  if (loc === "zh-Hans") {
    const pool = ["功德 " + sign + delta, "福报 " + sign + delta, "善念 " + sign + delta, "烦恼 -1", "心生欢喜"];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (loc === "ja") return "功徳 " + sign + delta;
  if (loc === "th") return "บุญ " + sign + delta;
  if (loc === "fr") return "Mérite " + sign + delta;
  if (loc === "es") return "Mérito " + sign + delta;
  return "Karma " + sign + delta;
}

function spawnFloatingMerit(targetEl, text) {
  if (!targetEl || typeof targetEl.getBoundingClientRect !== "function") return;
  const rect = targetEl.getBoundingClientRect();
  const span = document.createElement("span");
  span.className = "floating-merit";
  span.textContent = text || getMeritText(1);

  const x = rect.left + rect.width / 2 + (Math.random() * 24 - 12);
  const y = rect.top + rect.height * 0.3 + (Math.random() * 10 - 5);
  span.style.left = x + "px";
  span.style.top = y + "px";

  document.body.appendChild(span);
  window.setTimeout(() => {
    span.remove();
  }, 1000);
}

function updateKarma(delta, sourceEl) {
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
  const anchor = sourceEl || ring;
  if (anchor) {
    spawnFloatingMerit(anchor, getMeritText(delta));
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

// Records what the user just did so the profile can show a gentle history.
// Capped so local storage never grows without bound.
function logActivity(kind) {
  state.activity.unshift({ kind: kind, at: Date.now() });
  if (state.activity.length > 60) state.activity.length = 60;
  saveState();
  renderProfileActivity();
}

const MILESTONES = [10, 25, 50, 75, 100];

function renderProgress() {
  const bar = document.getElementById("progressFill");
  const label = document.getElementById("progressNext");
  if (!bar || !label) return;
  const next = MILESTONES.find((m) => state.karma < m) || MILESTONES[MILESTONES.length - 1];
  const percent = Math.max(0, Math.min(100, (state.karma / next) * 100));
  bar.style.width = percent + "%";
  const remaining = Math.max(0, next - state.karma);
  label.textContent = dictionary().progressNext.replace("%{n}", remaining);

  const row = document.getElementById("milestoneRow");
  if (row) {
    row.replaceChildren();
    MILESTONES.forEach((m) => {
      const chip = document.createElement("span");
      chip.className = "milestone" + (state.karma >= m ? " reached" : "");
      chip.textContent = m;
      row.append(chip);
    });
  }
}

function renderProfileActivity() {
  const list = document.getElementById("activityList");
  if (!list) return;
  const dict = dictionary();
  const labels = { deed: dict.actDeed, blessing: dict.actBlessing, lamp: dict.actLamp, checkin: dict.actCheckin, incense: dict.incenseLight || "Kindled incense" };
  list.replaceChildren();
  if (!state.activity.length) {
    const empty = document.createElement("li");
    empty.className = "activity-empty";
    empty.textContent = dict.activityEmpty;
    list.append(empty);
    return;
  }
  state.activity.slice(0, 8).forEach((entry) => {
    const li = document.createElement("li");
    li.className = "activity-item";
    const dot = document.createElement("span");
    dot.className = "activity-dot";
    dot.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className = "activity-text";
    text.textContent = labels[entry.kind] || entry.kind;
    const when = document.createElement("time");
    when.className = "activity-when";
    when.dateTime = new Date(entry.at).toISOString();
    when.textContent = new Date(entry.at).toLocaleDateString();
    li.append(dot, text, when);
    list.append(li);
  });
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

function categoryLabel(categoryId) {
  const category = data.categories.find((c) => c.id === categoryId);
  if (!category) return categoryId;
  return dictionary()[category.labelKey] || category.label;
}

function buildDeedItem(deed) {
  const item = document.createElement("article");
  item.className = `deed-item${state.selectedDeed === deed.id ? " selected" : ""}`;
  item.tabIndex = 0;
  item.dataset.deedId = deed.id;
  item.setAttribute("role", "button");
  item.setAttribute("aria-pressed", String(state.selectedDeed === deed.id));
  const mark = document.createElement("span");
  mark.className = `deed-mark ${deed.mark}`;
  mark.setAttribute("aria-hidden", "true");
  const text = document.createElement("div");
  const title = document.createElement("h3");
  const copy = dictionary();
  const deedKey = "deed_title_" + deed.id.replace(/-/g, "_");
  const descKey = "deed_short_" + deed.id.replace(/-/g, "_");
  title.textContent = copy[deedKey] || deed.title;
  const desc = document.createElement("p");
  desc.textContent = copy[descKey] || deed.shortDescription;
  text.append(title, desc);
  item.append(mark, text);
  item.addEventListener("click", () => selectDeed(deed.id));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDeed(deed.id);
    }
  });
  return item;
}

// The catalog is grouped into project categories (ODD: Project Category
let deedSearchQuery = "";

// The catalog is grouped into project categories (ODD: Project Category
// groups Deed Types). "All" shows every group; a filter shows just one.
function renderDeeds() {
  const list = document.getElementById("deedList");
  list.replaceChildren();

  const query = (deedSearchQuery || "").trim().toLowerCase();
  const visibleDeeds = data.deeds.filter((deed) => {
    const matchesCategory = state.activeCategory === "all" || deed.categoryKey === state.activeCategory;
    if (!matchesCategory) return false;
    if (!query) return true;
    const titleMatch = (deed.title || "").toLowerCase().includes(query);
    const descMatch = (deed.description || "").toLowerCase().includes(query);
    const shortMatch = (deed.shortDescription || "").toLowerCase().includes(query);
    return titleMatch || descMatch || shortMatch;
  });

  if (!visibleDeeds.some((deed) => deed.id === state.selectedDeed)) {
    state.selectedDeed = visibleDeeds[0]?.id || data.deeds[0].id;
  }

  const groupIds =
    state.activeCategory === "all"
      ? data.categories.filter((c) => c.id !== "all").map((c) => c.id)
      : [state.activeCategory];

  groupIds.forEach((categoryId) => {
    const deeds = visibleDeeds.filter((deed) => deed.categoryKey === categoryId);
    if (!deeds.length) return;
    const category = data.categories.find((c) => c.id === categoryId);

    const group = document.createElement("section");
    group.className = "deed-group";
    group.dataset.category = categoryId;

    const head = document.createElement("div");
    head.className = "deed-group-head";
    const icon = document.createElement("span");
    icon.className = "deed-group-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = (category && category.icon) || "◉";
    const title = document.createElement("h3");
    title.className = "deed-group-title";
    title.textContent = categoryLabel(categoryId);
    const count = document.createElement("span");
    count.className = "deed-group-count";
    count.textContent = String(deeds.length);
    head.append(icon, title, count);
    group.append(head);

    deeds.forEach((deed) => group.append(buildDeedItem(deed)));
    list.append(group);
  });

  const copy = dictionary();
  const countTmpl = copy.deedTypeCountText || "%{count} shown";
  setText("deedTypeCount", countTmpl.replace("%{count}", visibleDeeds.length));
  renderSelectedDeed();
}

function selectDeed(deedId) {
  state.selectedDeed = deedId;
  saveState();
  renderDeeds();
}

function renderSelectedDeed() {
  const deed = data.deeds.find((item) => item.id === state.selectedDeed) || data.deeds[0];
  const copy = dictionary();
  const deedKey = "deed_title_" + deed.id.replace(/-/g, "_");
  const descKey = "deed_desc_" + deed.id.replace(/-/g, "_");
  setText("ritualTitle", copy[deedKey] || deed.title);
  setText("ritualDesc", copy[descKey] || deed.description);
  const dedication = document.getElementById("ritualDedication");
  if (dedication) {
    dedication.hidden = true;
    dedication.classList.remove("active");
  }

  // Dynamic Multi-scene studio layers
  const crosswalk = document.getElementById("sceneCrosswalkLayer");
  const blessing = document.getElementById("sceneBlessingLayer");
  const coastline = document.getElementById("sceneCoastlineLayer");
  if (crosswalk) crosswalk.classList.toggle("active", deed.id === "elder-crosswalk" || deed.categoryKey === "elders");
  if (blessing) blessing.classList.toggle("active", deed.id === "anonymous-blessing" || deed.categoryKey === "support");
  if (coastline) coastline.classList.toggle("active", deed.id === "coastline-cleanup" || deed.categoryKey === "environment");

  renderFocusSession();
}

function renderSoundscapes() {
  const row = document.getElementById("soundscapeRow");
  row.replaceChildren();

  data.soundscapes.forEach((soundscape) => {
    const button = document.createElement("button");
    button.className = `layer${state.soundscape === soundscape.id ? " active" : ""}`;
    button.type = "button";
    const labelKey = "soundscape" + soundscape.id.charAt(0).toUpperCase() + soundscape.id.slice(1);
    button.textContent = dictionary()[labelKey] || soundscape.label;
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
  forest: { noise: "brown", filterType: "bandpass", frequency: 700, q: 0.45, lfoRate: 0.05, lfoDepth: 260, level: 0.1 },
  bell: { noise: "brown", filterType: "lowpass", frequency: 310, q: 1.6, lfoRate: 0.04, lfoDepth: 110, level: 0.14 }
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

function updateSoundscapeVolume() {
  if (!soundscapeAudio) return;
  const slider = document.getElementById("soundscapeVolume");
  if (!slider) return;
  const profile = activeSoundscapeProfile();
  const volMultiplier = Number(slider.value) / 100;
  const effectiveLevel = profile.level * (volMultiplier / 0.7);
  soundscapeAudio.master.gain.cancelScheduledValues(soundscapeAudio.ctx.currentTime);
  soundscapeAudio.master.gain.linearRampToValueAtTime(effectiveLevel, soundscapeAudio.ctx.currentTime + 0.1);
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

  const volumeSlider = document.getElementById("soundscapeVolume");
  const volMultiplier = volumeSlider ? Number(volumeSlider.value) / 100 : 0.7;
  const effectiveLevel = profile.level * (volMultiplier / 0.7);

  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(effectiveLevel, ctx.currentTime + 1.4);
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
  const btn = document.getElementById("completeFocusedRitual");
  playZenChime();
  if (btn) spawnFloatingMerit(btn, dictionary().meritGain || "功德 +7");
  updateKarma(7, btn);
  state.focusProgress = 0;
  state.focusReady = false;
  state.journal = state.journal || "I took a calm moment before completing one symbolic deed.";
  saveState();
  renderAll();
  const scene = document.getElementById("ritualScene");
  if (scene) {
    scene.classList.remove("completed");
    window.requestAnimationFrame(() => scene.classList.add("completed"));
  }
}

function renderSpot(spotId) {
  const spot = data.spots[spotId] || data.spots["east-lake"];
  state.selectedSpot = spotId;
  const copy = dictionary();
  const nameKey = "spot_name_" + spotId.replace(/-/g, "_");
  const catKey = "spot_category_" + spotId.replace(/-/g, "_");
  const descKey = "spot_desc_" + spotId.replace(/-/g, "_");
  setText("spotName", copy[nameKey] || spot.name);
  setText("spotCategory", copy[catKey] || spot.category);
  setText("spotText", copy[descKey] || spot.text);
  const ripplesEl = document.getElementById("spotRipples");
  if (ripplesEl) {
    const ripplesWord = copy.statRipples || "ripples";
    ripplesEl.textContent = `${(spot.ripples || 1000).toLocaleString()} ${ripplesWord}`;
  }
  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.classList.toggle("active", pin.dataset.spotId === spotId);
    pin.setAttribute("aria-pressed", String(pin.dataset.spotId === spotId));
  });

  if (typeof currentMapMode !== "undefined" && currentMapMode === "osm") {
    renderEmbeddedOsmTiles(spot);
  }

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
      button.textContent = dictionary()[category.labelKey] || category.label;
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
  provider: "gemini",
  generate: async function (request) {
    var locale = normalizeLocale(request.locale);
    // 1. Try to fetch live blessing intention from backend API (only if running over HTTP)
    if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
      try {
        var controller = new AbortController();
        var timeoutId = setTimeout(function () { controller.abort(); }, 3500);
        var apiOrigin = window.location.origin || "";
        var res = await fetch(apiOrigin + "/api/v1/blessings/intentions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: request.category,
            recipient: request.recipient,
            message: request.message,
            locale: locale
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          var json = await res.json();
          if (json && json.intention && json.intention.text) {
            return {
              text: json.intention.text,
              provider: json.intention.provider || "gemini",
              model: json.intention.model || "gemini-3.6-flash",
              tokens: json.intention.tokens || { input: 0, output: 0, total: 0 },
              cost_usd: json.intention.cost_usd || 0,
              cached: Boolean(json.intention.cached)
            };
          }
        }
      } catch (_) {
        // Graceful zero-token fallback below
      }
    }

    // 2. Offline fallback to local curated lines (0 tokens)
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
    return Promise.resolve({
      text: text,
      provider: "mock",
      model: "fallback-content-pack",
      tokens: { input: 0, output: 0, total: 0 },
      cost_usd: 0,
      cached: false
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
    var tokenLabel = "";
    if (result.provider === "gemini" && result.tokens && result.tokens.total > 0) {
      tokenLabel = ` · <span class="token-badge">🌿 Gemini · ${result.tokens.total} tok ($${result.cost_usd.toFixed(6)})</span>`;
    } else if (result.cached) {
      tokenLabel = ` · <span class="token-badge">🌿 Gemini (cached · 0 tok)</span>`;
    }
    replySource.innerHTML = dict.blessingReplySource + tokenLabel;
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
    logActivity("blessing");
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
    logActivity("lamp");
    showActionWhisper("lampWhispers");
  });

  setupMuyu();
  setupIncense();
  setupPrayerWheel();
}

let muyuAutoTimer = null;

function setupMuyu() {
  const btn = document.getElementById("muyuBtn");
  const autoBtn = document.getElementById("muyuAutoBtn");
  const countEl = document.getElementById("muyuCount");
  if (!btn) return;

  if (typeof state.muyuTaps !== "number") {
    state.muyuTaps = 0;
  }
  if (countEl) countEl.textContent = String(state.muyuTaps);

  function handleTap() {
    playMuyuSound();
    state.muyuTaps += 1;
    if (state.muyuTaps % 10 === 0) {
      updateKarma(1, btn);
      playZenChime();
    } else {
      spawnFloatingMerit(btn, getMeritText(1));
    }
    saveState();

    if (countEl) countEl.textContent = String(state.muyuTaps);

    btn.classList.remove("tapped");
    void btn.offsetWidth;
    btn.classList.add("tapped");
    window.setTimeout(() => btn.classList.remove("tapped"), 180);

    const mallet = document.getElementById("muyuMallet");
    if (mallet) {
      mallet.classList.remove("striking");
      void mallet.offsetWidth;
      mallet.classList.add("striking");
      window.setTimeout(() => mallet.classList.remove("striking"), 250);
    }

    const ripples = document.getElementById("muyuRipples");
    if (ripples) {
      const ring = document.createElement("span");
      ring.className = "muyu-ripple";
      ripples.appendChild(ring);
      window.setTimeout(() => ring.remove(), 700);
    }
  }

  btn.addEventListener("click", handleTap);

  if (autoBtn) {
    autoBtn.addEventListener("click", () => {
      const dict = dictionary();
      if (muyuAutoTimer) {
        clearInterval(muyuAutoTimer);
        muyuAutoTimer = null;
        autoBtn.textContent = dict.muyuAutoTap || "Auto tap";
        autoBtn.classList.remove("active");
      } else {
        autoBtn.textContent = dict.muyuStopAuto || "Pause auto";
        autoBtn.classList.add("active");
        handleTap();
        muyuAutoTimer = setInterval(handleTap, 1400);
      }
    });
  }

  const karmaRing = document.querySelector(".karma-ring");
  if (karmaRing && !karmaRing.dataset.hasTap) {
    karmaRing.dataset.hasTap = "true";
    karmaRing.setAttribute("title", "Tap for presence");
    karmaRing.addEventListener("click", () => {
      playMuyuSound();
      updateKarma(1, karmaRing);
    });
  }
}

let incenseTimer = null;

function setupIncense() {
  const stage = document.getElementById("incenseStage");
  const btn = document.getElementById("kindleIncenseBtn");
  const countEl = document.getElementById("incenseCount");
  const statusLine = document.getElementById("incenseStatusLine");
  const intentionsRow = document.getElementById("incenseIntentions");
  if (!btn || !stage) return;

  if (typeof state.incenseLitCount !== "number") {
    state.incenseLitCount = 0;
  }
  if (countEl) countEl.textContent = String(state.incenseLitCount);

  if (intentionsRow) {
    intentionsRow.addEventListener("click", (e) => {
      const target = e.target.closest(".choice-pill");
      if (!target) return;
      intentionsRow.querySelectorAll(".choice-pill").forEach((p) => p.classList.remove("active"));
      target.classList.add("active");
    });
  }

  btn.addEventListener("click", () => {
    playIncenseChime();
    state.incenseLitCount += 1;
    updateKarma(1, btn);
    spawnFloatingMerit(btn, getMeritText(1));
    logActivity("incense");
    saveState();

    if (countEl) countEl.textContent = String(state.incenseLitCount);

    stage.classList.add("burning");
    if (statusLine) statusLine.hidden = false;

    if (incenseTimer) clearTimeout(incenseTimer);
    incenseTimer = setTimeout(() => {
      stage.classList.remove("burning");
      if (statusLine) statusLine.hidden = true;
      incenseTimer = null;
    }, 40000);
  });
}

let wheelAngle = 0;
let wheelVelocity = 0;
let isWheelAuto = false;
let wheelAnimFrame = null;
let lastTickAngle = 0;
let lastKarmaAwardTime = 0;

function setupPrayerWheel() {
  const stage = document.getElementById("wheelStage");
  const container = document.getElementById("wheelContainer");
  const drum = document.getElementById("wheelDrum");
  const pendulum = document.getElementById("wheelPendulum");
  const countEl = document.getElementById("wheelCount");
  const autoBtn = document.getElementById("wheelAutoBtn");
  const mantraText = document.getElementById("wheelMantraText");
  if (!stage || !drum) return;

  if (typeof state.wheelTurns !== "number") {
    state.wheelTurns = 0;
  }
  if (countEl) countEl.textContent = String(state.wheelTurns);

  function spinImpulse(amount = 16) {
    wheelVelocity = Math.min(45, wheelVelocity + amount);
    if (!wheelAnimFrame) {
      wheelAnimFrame = requestAnimationFrame(wheelLoop);
    }
  }

  function wheelLoop() {
    if (isWheelAuto) {
      if (wheelVelocity < 5.5) wheelVelocity += 0.4;
    } else {
      wheelVelocity *= 0.962;
    }

    if (Math.abs(wheelVelocity) < 0.05 && !isWheelAuto) {
      wheelVelocity = 0;
      if (pendulum) pendulum.style.transform = "rotate(0deg)";
      wheelAnimFrame = null;
      return;
    }

    const prevAngle = wheelAngle;
    wheelAngle += wheelVelocity;

    // Check full 360-degree revolution
    if (Math.floor(wheelAngle / 360) > Math.floor(prevAngle / 360)) {
      state.wheelTurns += 1;
      if (countEl) countEl.textContent = String(state.wheelTurns);
      playWheelChime();
      const now = Date.now();
      if (now - lastKarmaAwardTime > 2500) {
        lastKarmaAwardTime = now;
        updateKarma(1, drum);
      } else {
        spawnFloatingMerit(drum, getMeritText(1));
      }
      saveState();
    }

    // Ticking sound every 60 degrees of rotation
    if (Math.abs(wheelAngle - lastTickAngle) >= 60) {
      lastTickAngle = wheelAngle;
      playWheelClick();
    }

    // Visual updates
    const rot = wheelAngle % 360;
    drum.style.transform = `rotate(${rot * 0.22}deg)`;
    if (mantraText) {
      const offsetX = 80 + Math.sin((wheelAngle * Math.PI) / 180) * 12;
      mantraText.setAttribute("x", String(offsetX));
    }

    if (pendulum) {
      const swing = Math.min(60, Math.max(-10, wheelVelocity * 2.8));
      pendulum.style.transform = `rotate(${swing}deg)`;
    }

    wheelAnimFrame = requestAnimationFrame(wheelLoop);
  }

  // Pointer drag interactions
  let isDragging = false;
  let startX = 0;
  let lastX = 0;
  let lastTime = 0;

  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    lastX = startX;
    lastTime = Date.now();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = curX - lastX;
    const now = Date.now();
    const dt = Math.max(1, now - lastTime);
    lastX = curX;
    lastTime = now;

    if (deltaX > 0) {
      spinImpulse(Math.min(12, (deltaX / dt) * 15));
    }
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const curX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || lastX;
    const dist = curX - startX;
    if (Math.abs(dist) < 6) {
      spinImpulse(18);
    }
  }

  if (container) {
    container.addEventListener("mousedown", onPointerDown);
    container.addEventListener("touchstart", onPointerDown, { passive: true });
  }
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchend", onPointerUp, { passive: true });

  drum.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      spinImpulse(20);
    }
  });

  if (autoBtn) {
    autoBtn.addEventListener("click", () => {
      const dict = dictionary();
      isWheelAuto = !isWheelAuto;
      if (isWheelAuto) {
        autoBtn.textContent = dict.wheelStopAuto || "Pause auto";
        autoBtn.classList.add("active");
        spinImpulse(8);
      } else {
        autoBtn.textContent = dict.wheelAutoSpin || "Auto spin";
        autoBtn.classList.remove("active");
      }
    });
  }
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

function renderAlmanac() {
  const dict = dictionary();
  const dateEl = document.getElementById("almanacDate");
  if (dateEl) {
    const today = new Date();
    const options = { month: "short", day: "numeric", weekday: "short" };
    try {
      dateEl.textContent = today.toLocaleDateString(state.language === "zh-Hans" ? "zh-CN" : state.language, options);
    } catch {
      dateEl.textContent = dict.almanacDate || "Mindful Day";
    }
  }
  setText("almanacSuitable1", dict.almanacSuitable1 || "慈心放生 · Release fish");
  setText("almanacSuitable2", dict.almanacSuitable2 || "燃香静坐 · Kindle incense");
  setText("almanacAvoid1", dict.almanacAvoid1 || "浮躁争执 · Impatience");
  setText("almanacAvoid2", dict.almanacAvoid2 || "妄念挂碍 · Attachment");
  setText("almanacVerse", dict.almanacVerse || "善念一动，天地皆宽。Every mindful deed brings boundless calm.");
}

function renderAll() {
  document.body.classList.toggle("dark", state.theme === "dark");
  document.body.classList.toggle("senior-mode", Boolean(state.settings.seniorMode));
  document.getElementById("seniorToggle").setAttribute("aria-pressed", String(Boolean(state.settings.seniorMode)));
  applyTranslations();
  renderDailyThought();
  renderAlmanac();
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
  renderProgress();
  renderProfileActivity();
  // The community feed lives in community.js, which loads after this module.
  if (typeof renderCommunityFeed === "function") renderCommunityFeed();
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

  // Switch to dedicated sanctuary backdrop for the active tab
  document.querySelectorAll(".cinematic-backdrop-layer").forEach((layer) => {
    layer.classList.toggle("active", layer.dataset.tab === target);
  });

  if (target === "map" && typeof currentMapMode !== "undefined" && currentMapMode === "osm") {
    const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
    renderEmbeddedOsmTiles(spot);
  }
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

let selectedMapDeedKey = "release-fish";

function executeMapDeed(deedKey, customX, customY) {
  const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
  const overlay = document.getElementById("mapAnimOverlay");
  const worldMap = document.getElementById("worldMapSurface") || document.querySelector(".world-map");
  const activePin = document.querySelector(`.map-pin[data-spot-id="${state.selectedSpot}"]`);

  let posX = 160;
  let posY = 120;
  if (typeof customX === "number" && typeof customY === "number") {
    posX = customX;
    posY = customY;
  } else if (activePin && worldMap) {
    const mapRect = worldMap.getBoundingClientRect();
    const pinRect = activePin.getBoundingClientRect();
    posX = pinRect.left - mapRect.left + pinRect.width / 2;
    posY = pinRect.top - mapRect.top + pinRect.height / 2;
  }

  // Audio feedback
  if (deedKey === "release-fish") {
    playWaterSplash();
    window.setTimeout(playZenChime, 250);
  } else {
    playZenChime();
  }

  // Animation visual in overlay
  if (overlay) {
    if (deedKey === "release-fish") {
      const koi = document.createElement("div");
      koi.className = "map-koi-sprite";
      koi.style.left = `${posX - 28}px`;
      koi.style.top = `${posY - 28}px`;
      koi.innerHTML = `
        <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
          <path d="M12 20 C18 10 38 12 48 20 C38 28 18 30 12 20 Z" fill="#e0533c"/>
          <path d="M22 14 C28 17 32 17 38 15 C34 22 26 23 22 14 Z" fill="#ffffff" opacity="0.85"/>
          <circle cx="44" cy="18" r="2" fill="#1b0805"/>
          <circle cx="44.5" cy="17.5" r="0.6" fill="#fff"/>
          <path d="M14 20 L2 12 L6 20 L2 28 Z" fill="#e6a15c"/>
          <path d="M28 13 C32 8 36 8 38 12 Z" fill="#fca311" opacity="0.8"/>
          <path d="M28 27 C32 32 36 32 38 28 Z" fill="#fca311" opacity="0.8"/>
        </svg>
      `;
      overlay.appendChild(koi);
      window.setTimeout(() => koi.remove(), 3500);

      [0, 280, 560].forEach((delay) => {
        window.setTimeout(() => {
          const rip = document.createElement("div");
          rip.className = "map-water-ripple";
          rip.style.left = `${posX}px`;
          rip.style.top = `${posY}px`;
          overlay.appendChild(rip);
          window.setTimeout(() => rip.remove(), 2300);
        }, delay);
      });
    } else if (deedKey === "light-lantern") {
      const lantern = document.createElement("div");
      lantern.className = "map-lantern-sprite";
      lantern.style.left = `${posX}px`;
      lantern.style.top = `${posY}px`;
      lantern.innerHTML = `<span style="font-size: 2.2rem; filter: drop-shadow(0 0 10px #ffd97d);">🏮</span>`;
      overlay.appendChild(lantern);
      window.setTimeout(() => lantern.remove(), 3700);
    } else if (deedKey === "feed-birds") {
      const bird = document.createElement("div");
      bird.className = "map-bird-sprite";
      bird.style.left = `${posX}px`;
      bird.style.top = `${posY}px`;
      bird.innerHTML = `<span style="font-size: 2rem; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));">🕊️</span>`;
      overlay.appendChild(bird);
      window.setTimeout(() => bird.remove(), 3300);
    } else if (deedKey === "plant-tree") {
      const tree = document.createElement("div");
      tree.className = "map-tree-sprite";
      tree.style.left = `${posX}px`;
      tree.style.top = `${posY}px`;
      tree.innerHTML = `<span style="font-size: 2.4rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">🌱</span>`;
      overlay.appendChild(tree);
      window.setTimeout(() => tree.remove(), 3100);
    }

    const toast = document.createElement("div");
    toast.className = "map-merit-toast";
    toast.style.left = `${posX}px`;
    toast.style.top = `${posY}px`;
    const dict = dictionary();
    const meritTitles = {
      "release-fish": dict.deckDeedFish || "善念放生",
      "light-lantern": dict.deckDeedLantern || "祈福心灯",
      "feed-birds": dict.deckDeedBirds || "慈心喂鸟",
      "plant-tree": dict.deckDeedTree || "共植绿树"
    };
    toast.textContent = `${meritTitles[deedKey] || "善行圆满"} · 功德 +5`;
    overlay.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2700);
  }

  spot.ripples = (spot.ripples || 1000) + 1;
  const ripplesEl = document.getElementById("spotRipples");
  if (ripplesEl) {
    ripplesEl.textContent = `${spot.ripples.toLocaleString()} ripples`;
    ripplesEl.classList.remove("ripple-bounce");
    void ripplesEl.offsetWidth;
    ripplesEl.classList.add("ripple-bounce");
    window.setTimeout(() => ripplesEl.classList.remove("ripple-bounce"), 450);
  }

  const performBtn = document.getElementById("performMapDeedBtn");
  updateKarma(5, performBtn);
  logActivity("deed");
  showActionWhisper("deedReflections");
  saveState();
}

function setupMapDeck() {
  const deckBtns = document.querySelectorAll(".deck-deed-btn");
  deckBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      deckBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMapDeedKey = btn.dataset.deed || "release-fish";
    });
  });

  const performBtn = document.getElementById("performMapDeedBtn");
  if (performBtn) {
    performBtn.addEventListener("click", () => {
      executeMapDeed(selectedMapDeedKey);
    });
  }

  const worldMap = document.getElementById("worldMapSurface");
  if (worldMap) {
    worldMap.addEventListener("click", (event) => {
      if (event.target.closest(".map-pin")) return;
      const rect = worldMap.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      executeMapDeed(selectedMapDeedKey, clickX, clickY);
    });
  }
}

const spotActionBtn = document.getElementById("spotActionBtn");
if (spotActionBtn) {
  spotActionBtn.addEventListener("click", () => {
    const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
    if (spot && spot.deedId) {
      selectDeed(spot.deedId);
    }
    navigateTo("deeds");
  });
}

document.getElementById("completeDaily").addEventListener("click", () => {
  const btn = document.getElementById("completeDaily");
  updateKarma(4, btn);
  logActivity("checkin");
  state.streak += 1;
  state.journal = state.journal || "I completed one quiet deed and chose a lighter next step.";
  saveState();
  renderAll();
});

document.getElementById("performRitual").addEventListener("click", () => {
  logActivity("deed");
  const btn = document.getElementById("performRitual");
  playMuyuSound();
  playWaterSplash();
  window.setTimeout(playZenChime, 240);
  if (btn) spawnFloatingMerit(btn, dictionary().meritGain || "功德 +5");
  updateKarma(5, btn);
  const scene = document.getElementById("ritualScene");
  if (scene) {
    scene.classList.remove("completed");
    window.requestAnimationFrame(() => scene.classList.add("completed"));
  }
  const dedication = document.getElementById("ritualDedication");
  if (dedication) {
    dedication.textContent = dictionary().ritualDedication || "A gentle deed in the stream ripples into an ocean of peace. (Merit +5)";
    dedication.hidden = false;
    dedication.classList.remove("active");
    window.requestAnimationFrame(() => dedication.classList.add("active"));
  }
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
  const submitBtn = event.target.querySelector("button");
  updateKarma(2, submitBtn);
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

const volumeSlider = document.getElementById("soundscapeVolume");
if (volumeSlider) {
  volumeSlider.addEventListener("input", updateSoundscapeVolume);
}

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

// --- OpenStreetMap Live Sanctuary Cartography ---
function setupLiveMap() {
  const liveMapDialog = document.getElementById("liveMapDialog");
  const openBtn = document.getElementById("openLiveMapBtn");
  const closeBtn = document.getElementById("closeLiveMapBtn");
  const closeTopBtn = document.getElementById("closeLiveMapTopBtn");
  const zoomInBtn = document.getElementById("liveMapZoomIn");
  const zoomOutBtn = document.getElementById("liveMapZoomOut");
  const tilesContainer = document.getElementById("liveMapTiles");
  const dedicateBtn = document.getElementById("dedicateLiveRippleBtn");

  if (!liveMapDialog) return;

  let currentZoom = 14;

  function renderTiles(spot) {
    if (!spot || !tilesContainer) return;
    const lat = spot.lat || 30.5539;
    const lng = spot.lng || 114.3644;
    const z = currentZoom;

    // Convert lat/lng to OpenStreetMap slippy tile numbers
    const n = Math.pow(2, z);
    const tileX = Math.floor(((lng + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const tileY = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
    );

    tilesContainer.innerHTML = "";
    // Create 3x3 grid around the center tile
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tx = tileX + dx;
        const ty = tileY + dy;
        const img = document.createElement("img");
        img.className = "osm-tile";
        img.alt = `Tile ${z}/${tx}/${ty}`;
        img.loading = "lazy";
        img.src = `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
        img.onerror = () => {
          // Graceful Buddhist parchment fallback when offline or file:// protocol blocks external images
          img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="%23f7f3eb" stroke="%23e4dac9"/><circle cx="128" cy="128" r="90" fill="none" stroke="%23dfd4c0" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="128" cy="128" r="50" fill="none" stroke="%23dfd4c0" stroke-width="1"/><path d="M 0,128 Q 64,110 128,128 T 256,128" fill="none" stroke="%23d8c8ae" stroke-width="1"/><text x="128" y="136" font-family="serif" font-size="20" fill="%23c69b3f" text-anchor="middle">🪷</text><text x="128" y="240" font-family="sans-serif" font-size="9" fill="%239e9484" text-anchor="middle">OSM Sanctuary · ${z}/${tx}/${ty}</text></svg>`;
        };
        tilesContainer.appendChild(img);
      }
    }
  }

  function updateLiveMapModal() {
    const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
    currentZoom = spot.zoom || 14;

    const title = document.getElementById("liveMapTitle");
    const ripples = document.getElementById("liveMapRipples");
    const coords = document.getElementById("liveMapCoords");
    const desc = document.getElementById("liveMapDesc");

    if (title) title.textContent = spot.sanctuary || spot.name;
    if (ripples) ripples.textContent = `${(spot.ripples || 1280).toLocaleString()} ripples dedicated`;
    if (coords) coords.textContent = `📍 ${spot.coordinates || "30.5539° N, 114.3644° E"}`;
    if (desc) desc.textContent = spot.environment || spot.text;

    renderTiles(spot);
  }

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      updateLiveMapModal();
      if (typeof liveMapDialog.showModal === "function") {
        liveMapDialog.showModal();
      } else {
        liveMapDialog.setAttribute("open", "");
      }
    });
  }

  function closeLiveMap() {
    if (typeof liveMapDialog.close === "function") {
      liveMapDialog.close();
    } else {
      liveMapDialog.removeAttribute("open");
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLiveMap);
  if (closeTopBtn) closeTopBtn.addEventListener("click", closeLiveMap);

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      if (currentZoom < 18) {
        currentZoom++;
        const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
        renderTiles(spot);
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      if (currentZoom > 4) {
        currentZoom--;
        const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
        renderTiles(spot);
      }
    });
  }

  if (dedicateBtn) {
    dedicateBtn.addEventListener("click", () => {
      const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
      spot.ripples = (spot.ripples || 1280) + 1;
      state.karma += 1;
      pushActivity(`Dedicated a ripple of kindness to ${spot.name}`);

      const ripples = document.getElementById("liveMapRipples");
      if (ripples) ripples.textContent = `${spot.ripples.toLocaleString()} ripples dedicated`;
      const spotRipples = document.getElementById("spotRipples");
      if (spotRipples) spotRipples.textContent = `${spot.ripples.toLocaleString()} ripples`;

      saveState();
      renderToday();
      renderMap();
      renderProfile();

      showActionWhisper(`Dedicated a ripple of kindness to ${spot.name} (+1 karma)`);
    });
  }
}

let currentMapMode = "global";
let embeddedOsmZoom = 14;

function renderEmbeddedOsmTiles(spot) {
  const container = document.getElementById("embeddedOsmTiles");
  if (!spot || !container) return;
  const lat = spot.lat || 30.5539;
  const lng = spot.lng || 114.3644;
  const z = embeddedOsmZoom;

  const n = Math.pow(2, z);
  const tileX = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );

  container.innerHTML = "";
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const tx = tileX + dx;
      const ty = tileY + dy;
      const img = document.createElement("img");
      img.className = "embedded-osm-tile";
      img.alt = `Tile ${z}/${tx}/${ty}`;
      img.loading = "lazy";
      img.src = `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
      img.onerror = () => {
        img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="%23052f31" stroke="%230e5254"/><circle cx="128" cy="128" r="90" fill="none" stroke="%231a696c" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="128" cy="128" r="50" fill="none" stroke="%231a696c" stroke-width="1"/><text x="128" y="136" font-family="serif" font-size="22" fill="%23efc978" text-anchor="middle">🪷</text><text x="128" y="240" font-family="sans-serif" font-size="9" fill="%2370d6b0" text-anchor="middle">OSM Sanctuary · ${z}/${tx}/${ty}</text></svg>`;
      };
      container.appendChild(img);
    }
  }
}

function setupEmbeddedMapMode() {
  const globalBtn = document.getElementById("mapModeGlobalBtn");
  const osmBtn = document.getElementById("mapModeOsmBtn");
  const globeWrap = document.getElementById("mapGlobalGlobeWrap");
  const osmViewport = document.getElementById("embeddedOsmViewport");
  const zoomIn = document.getElementById("osmZoomInBtn");
  const zoomOut = document.getElementById("osmZoomOutBtn");

  function setMode(mode) {
    currentMapMode = mode;
    if (globalBtn) globalBtn.classList.toggle("active", mode === "global");
    if (osmBtn) osmBtn.classList.toggle("active", mode === "osm");
    if (globeWrap) globeWrap.hidden = (mode === "osm");
    if (osmViewport) osmViewport.hidden = (mode !== "osm");

    if (mode === "osm") {
      const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
      embeddedOsmZoom = spot.zoom || 14;
      renderEmbeddedOsmTiles(spot);
    }
  }

  if (globalBtn) globalBtn.addEventListener("click", () => setMode("global"));
  if (osmBtn) osmBtn.addEventListener("click", () => setMode("osm"));

  if (zoomIn) {
    zoomIn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (embeddedOsmZoom < 18) {
        embeddedOsmZoom++;
        const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
        renderEmbeddedOsmTiles(spot);
      }
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", (e) => {
      e.stopPropagation();
      if (embeddedOsmZoom > 4) {
        embeddedOsmZoom--;
        const spot = data.spots[state.selectedSpot] || data.spots["east-lake"];
        renderEmbeddedOsmTiles(spot);
      }
    });
  }
}

function setupDeedSearch() {
  const searchInput = document.getElementById("deedSearchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    deedSearchQuery = e.target.value;
    renderDeeds();
  });
}

// --- Voluntary Ethical Support & Checkout ---
function setupImpactDialog() {
  const impactDialog = document.getElementById("impactDialog");
  const openBtn = document.getElementById("donateButton");
  const closeBtn = document.getElementById("closeDialog");
  const closeTopBtn = document.getElementById("closeImpactTopBtn");
  const submitBtn = document.getElementById("submitDonationBtn");
  const receiptArea = document.getElementById("donationReceiptArea");
  const receiptCode = document.getElementById("receiptCode");
  const receiptDetails = document.getElementById("receiptDetails");
  const receiptDedication = document.getElementById("receiptDedication");
  const dedicationInput = document.getElementById("donationDedication");
  const tierBtns = document.querySelectorAll(".donation-tier");
  const methodChips = document.querySelectorAll(".pay-method-chip");

  if (!impactDialog) return;

  let selectedAmount = 3;
  let selectedMethod = "stripe";

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (receiptArea) receiptArea.style.display = "none";
      if (submitBtn) {
        submitBtn.textContent = `Support $${selectedAmount}.00 USD (Test Checkout)`;
        submitBtn.disabled = false;
      }
      if (typeof impactDialog.showModal === "function") {
        impactDialog.showModal();
      } else {
        impactDialog.setAttribute("open", "");
      }
    });
  }

  function closeImpact() {
    if (typeof impactDialog.close === "function") {
      impactDialog.close();
    } else {
      impactDialog.removeAttribute("open");
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeImpact);
  if (closeTopBtn) closeTopBtn.addEventListener("click", closeImpact);

  tierBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tierBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedAmount = Number(btn.getAttribute("data-amount") || 3);
      if (submitBtn && (!receiptArea || receiptArea.style.display === "none")) {
        submitBtn.textContent = `Support $${selectedAmount}.00 USD (Test Checkout)`;
      }
    });
  });

  methodChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      methodChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      selectedMethod = chip.getAttribute("data-method") || "stripe";
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const dedication = (dedicationInput && dedicationInput.value.trim()) || "Dedicated to all sentient beings (回向众生)";
      const code = `#FOB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      if (receiptCode) receiptCode.textContent = code;
      if (receiptDetails) {
        receiptDetails.textContent = `Campaign: Foobow Operating Support · Amount: $${selectedAmount}.00 USD · Method: ${selectedMethod.toUpperCase()}`;
      }
      if (receiptDedication) receiptDedication.textContent = dedication;
      if (receiptArea) receiptArea.style.display = "block";

      submitBtn.textContent = "Support Confirmed · 感谢随喜护持";
      submitBtn.disabled = true;

      pushActivity(`Offered voluntary support ($${selectedAmount}.00 USD, 0 karma awarded)`);
      saveState();
      renderProfile();

      showActionWhisper("Voluntary support received. 0 karma awarded (Pure Giving Decoupled).");
    });
  }
}

// --- Sanskrit Chants & Meditation Engine --------------------------------
const sanskritTracks = window.FOOBOW_SANSKRIT_TRACKS || [];
let currentChantIndex = 0;
let chantPlaying = false;
let chantElapsed = 0;
let chantDuration = 0;
let chantMeditationSeconds = 0;
let chantTimerInterval = null;

function getSanskritAudioEl() {
  return document.getElementById("sanskritAudio");
}

function updateMiniPlayerUI() {
  const track = sanskritTracks[currentChantIndex] || sanskritTracks[0];
  if (!track) return;
  const copy = dictionary();
  const title = copy[track.titleKey] || track.titleDefault;
  setText("miniTrackTitle", title);
  setText("miniTrackStatus", chantPlaying ? (copy.chantsMiniPlaying || "Playing") : (copy.chantsMiniPaused || "Paused"));
  const miniPlayer = document.getElementById("zenMiniPlayer");
  if (miniPlayer) {
    miniPlayer.classList.toggle("playing", chantPlaying);
  }
  const playBtn = document.getElementById("miniPlayPauseBtn");
  if (playBtn) {
    playBtn.textContent = chantPlaying ? "⏸" : "▶";
    playBtn.setAttribute("aria-label", chantPlaying ? (copy.chantsPause || "Pause") : (copy.chantsPlay || "Play"));
  }
  const disc = document.getElementById("miniDiscIcon");
  if (disc) disc.textContent = track.icon || "📿";
  const progressFill = document.getElementById("miniProgressFill");
  if (progressFill) {
    const total = chantDuration || track.duration || 1;
    const pct = total > 0 ? Math.min(100, (chantElapsed / total) * 100) : 0;
    progressFill.style.width = `${pct}%`;
  }
}

function updateChantsDialogUI() {
  const track = sanskritTracks[currentChantIndex] || sanskritTracks[0];
  if (!track) return;
  const copy = dictionary();
  const title = copy[track.titleKey] || track.titleDefault;
  setText("chantsHeroTitle", title);
  setText("chantsHeroSubtitle", track.subtitleDefault);
  const diskIcon = document.getElementById("chantsDiskIcon");
  if (diskIcon) diskIcon.textContent = track.icon || "📿";
  const dialog = document.getElementById("chantsDialog");
  if (dialog) dialog.classList.toggle("playing", chantPlaying);
  const heroPlayBtn = document.getElementById("chantsHeroPlayBtn");
  if (heroPlayBtn) {
    heroPlayBtn.textContent = chantPlaying ? "⏸" : "▶";
  }
  const elapsedEl = document.getElementById("chantsTimeElapsed");
  if (elapsedEl) elapsedEl.textContent = formatDuration(chantElapsed);
  const totalEl = document.getElementById("chantsTimeTotal");
  if (totalEl) totalEl.textContent = formatDuration(chantDuration || track.duration);

  const fill = document.getElementById("chantsScrubberFill");
  const thumb = document.getElementById("chantsScrubberThumb");
  const total = chantDuration || track.duration || 1;
  const pct = total > 0 ? Math.min(100, (chantElapsed / total) * 100) : 0;
  if (fill) fill.style.width = `${pct}%`;
  if (thumb) thumb.style.left = `${pct}%`;

  const sessionText = document.getElementById("chantsSessionDurationText");
  if (sessionText) {
    const mins = Math.floor(chantMeditationSeconds / 60);
    const secs = Math.floor(chantMeditationSeconds % 60);
    sessionText.textContent = `${copy.chantsNav || "Meditation"}: ${mins}m ${secs}s`;
  }

  document.querySelectorAll(".chant-track-card").forEach((card) => {
    const isActive = card.dataset.trackIndex === String(currentChantIndex);
    card.classList.toggle("active", isActive);
  });
}

function formatDuration(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function playChantTrack(index) {
  if (index >= 0 && index < sanskritTracks.length) {
    currentChantIndex = index;
  }
  const track = sanskritTracks[currentChantIndex];
  const audio = getSanskritAudioEl();
  if (!audio || !track) return;
  if (audio.src !== track.url) {
    audio.src = track.url;
    audio.load();
  }
  audio.play().then(() => {
    chantPlaying = true;
    startChantTimer();
    updateMiniPlayerUI();
    updateChantsDialogUI();
  }).catch((err) => {
    console.warn("Audio play prevented or error:", err);
  });
}

function toggleChantPlayback() {
  const audio = getSanskritAudioEl();
  if (!audio) return;
  const track = sanskritTracks[currentChantIndex];
  if (!audio.src || audio.src === window.location.href) {
    playChantTrack(currentChantIndex);
    return;
  }
  if (audio.paused) {
    audio.play().then(() => {
      chantPlaying = true;
      startChantTimer();
      updateMiniPlayerUI();
      updateChantsDialogUI();
    }).catch(() => {});
  } else {
    audio.pause();
    chantPlaying = false;
    stopChantTimer();
    updateMiniPlayerUI();
    updateChantsDialogUI();
  }
}

function startChantTimer() {
  if (chantTimerInterval) clearInterval(chantTimerInterval);
  chantTimerInterval = setInterval(() => {
    if (chantPlaying) {
      chantMeditationSeconds += 1;
      const sessionText = document.getElementById("chantsSessionDurationText");
      if (sessionText) {
        const copy = dictionary();
        const mins = Math.floor(chantMeditationSeconds / 60);
        const secs = Math.floor(chantMeditationSeconds % 60);
        sessionText.textContent = `${copy.chantsNav || "Meditation"}: ${mins}m ${secs}s`;
      }
    }
  }, 1000);
}

function stopChantTimer() {
  if (chantTimerInterval) {
    clearInterval(chantTimerInterval);
    chantTimerInterval = null;
  }
}

function spawnRisingLotusFlowers(count = 7) {
  const container = document.getElementById("zenLotusRiseContainer");
  if (!container) return;
  const lotusEmojis = ["🪷", "🌸", "✨", "🪷", "🌟"];
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "zen-rising-lotus";
    span.textContent = lotusEmojis[i % lotusEmojis.length];
    const leftPct = 10 + Math.random() * 80;
    const delay = i * 0.2;
    span.style.left = `${leftPct}%`;
    span.style.bottom = "0px";
    span.style.animationDelay = `${delay}s`;
    container.appendChild(span);
    setTimeout(() => {
      span.remove();
    }, 4200);
  }
}

function setupSanskritPlayer() {
  const audio = getSanskritAudioEl();
  if (audio) {
    audio.addEventListener("timeupdate", () => {
      chantElapsed = audio.currentTime;
      chantDuration = audio.duration || sanskritTracks[currentChantIndex]?.duration || 0;
      updateMiniPlayerUI();
      updateChantsDialogUI();
    });
    audio.addEventListener("loadedmetadata", () => {
      chantDuration = audio.duration;
      updateMiniPlayerUI();
      updateChantsDialogUI();
    });
    audio.addEventListener("ended", () => {
      const nextIndex = (currentChantIndex + 1) % sanskritTracks.length;
      playChantTrack(nextIndex);
    });
  }

  const miniPlayBtn = document.getElementById("miniPlayPauseBtn");
  if (miniPlayBtn) {
    miniPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleChantPlayback();
    });
  }
  const miniTrackBtn = document.getElementById("miniPlayerTrackBtn");
  const miniOpenFullBtn = document.getElementById("miniOpenFullBtn");
  const openHeaderBtn = document.getElementById("openChantsHeaderBtn");
  const chantsDialog = document.getElementById("chantsDialog");

  const openChantsModal = () => {
    if (chantsDialog && typeof chantsDialog.showModal === "function") {
      updateChantsDialogUI();
      chantsDialog.showModal();
    }
  };

  if (miniTrackBtn) miniTrackBtn.addEventListener("click", openChantsModal);
  if (miniOpenFullBtn) miniOpenFullBtn.addEventListener("click", openChantsModal);
  if (openHeaderBtn) openHeaderBtn.addEventListener("click", openChantsModal);

  const closeBtn = document.getElementById("closeChantsBtn");
  const closeBottomBtn = document.getElementById("closeChantsBottomBtn");
  const closeChantsModal = () => {
    if (chantsDialog) chantsDialog.close();
  };
  if (closeBtn) closeBtn.addEventListener("click", closeChantsModal);
  if (closeBottomBtn) closeBottomBtn.addEventListener("click", closeChantsModal);

  const heroPlayBtn = document.getElementById("chantsHeroPlayBtn");
  if (heroPlayBtn) heroPlayBtn.addEventListener("click", toggleChantPlayback);

  const prevBtn = document.getElementById("chantsPrevBtn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const prevIndex = (currentChantIndex - 1 + sanskritTracks.length) % sanskritTracks.length;
      playChantTrack(prevIndex);
    });
  }

  const nextBtn = document.getElementById("chantsNextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIndex = (currentChantIndex + 1) % sanskritTracks.length;
      playChantTrack(nextIndex);
    });
  }

  const scrubber = document.getElementById("chantsScrubber");
  if (scrubber) {
    scrubber.addEventListener("click", (e) => {
      const rect = scrubber.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const total = chantDuration || sanskritTracks[currentChantIndex]?.duration || 0;
      if (audio && total > 0) {
        audio.currentTime = pos * total;
        chantElapsed = audio.currentTime;
        updateChantsDialogUI();
        updateMiniPlayerUI();
      }
    });
  }

  const volSlider = document.getElementById("chantsVolumeSlider");
  const volVal = document.getElementById("chantsVolumeValue");
  if (volSlider) {
    volSlider.addEventListener("input", (e) => {
      const vol = Number(e.target.value) / 100;
      if (audio) audio.volume = vol;
      if (volVal) volVal.textContent = `${Math.round(vol * 100)}%`;
    });
  }

  const completeBtn = document.getElementById("chantsCompleteSessionBtn");
  const meritToast = document.getElementById("chantsMeritToast");
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      const copy = dictionary();
      if (chantMeditationSeconds >= 30) {
        state.karma = (state.karma || 0) + 10;
        state.deeds = (state.deeds || 0) + 1;
        saveState();
        renderStats();
        if (meritToast) {
          meritToast.textContent = copy.chantsCompleteSuccess || "本次禅修圆满，功德 +10";
          meritToast.hidden = false;
          setTimeout(() => { meritToast.hidden = true; }, 4000);
        }
        spawnRisingLotusFlowers(9);
        playZenChime();
        pushActivity("Completed Sanskrit Chants meditation session (+10 karma)");
        chantMeditationSeconds = 0;
      } else {
        if (meritToast) {
          meritToast.textContent = copy.chantsCompleteShort || "禅坐时间不足 30 秒，下次更专注一些～";
          meritToast.hidden = false;
          setTimeout(() => { meritToast.hidden = true; }, 3500);
        }
      }
    });
  }

  const playlistEl = document.getElementById("chantsPlaylist");
  if (playlistEl) {
    playlistEl.replaceChildren();
    const copy = dictionary();
    sanskritTracks.forEach((track, idx) => {
      const card = document.createElement("button");
      card.className = `chant-track-card${idx === currentChantIndex ? " active" : ""}`;
      card.type = "button";
      card.dataset.trackIndex = String(idx);
      const title = copy[track.titleKey] || track.titleDefault;

      card.innerHTML = `
        <span class="chant-track-icon">${track.icon || "📿"}</span>
        <div class="chant-track-texts">
          <span class="chant-track-name">${title}</span>
          <span class="chant-track-time">${formatDuration(track.duration)}</span>
        </div>
      `;
      card.addEventListener("click", () => {
        playChantTrack(idx);
      });
      playlistEl.appendChild(card);
    });
  }

  updateMiniPlayerUI();
}

function setupTiltCards() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || window.innerWidth < 800) return;

  const cardSelectors = [
    ".hero-panel",
    ".panel",
    ".deed-focus",
    ".pray-card",
    ".lamp-card",
    ".incense-card",
    ".muyu-card",
    ".wheel-card",
    ".almanac-panel",
    ".global-kindness-card"
  ];

  document.querySelectorAll(cardSelectors.join(",")).forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupWaterRipples() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  document.addEventListener("click", (e) => {
    const target = e.target.closest(".primary-action, .lamp-stage, #muyuBtn");
    if (!target) return;

    const ripple = document.createElement("span");
    ripple.className = "water-click-ripple";
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    target.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 900);
  });
}

setupBlessings();
setupLiveMap();
setupEmbeddedMapMode();
setupMapDeck();
setupDeedSearch();
setupImpactDialog();
setupSanskritPlayer();
loadContentPack();
renderAll();
setupTiltCards();
setupWaterRipples();
