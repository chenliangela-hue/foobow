(function () {
  "use strict";

  var I18N = window.FOOBOW_LANDING_I18N;
  var STORAGE_KEY = "foobow.locale.v1";
  var ROTATE_MS = 6000;

  function resolveInitialLocale() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && I18N.locales.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (error) {
      // Storage may be unavailable; fall through to detection.
    }
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("zh") === 0) return "zh-Hans";
    for (var i = 0; i < I18N.locales.length; i += 1) {
      if (nav.indexOf(I18N.locales[i].toLowerCase().slice(0, 2)) === 0) {
        return I18N.locales[i];
      }
    }
    return "en";
  }

  function dailyIndex(length) {
    var start = Date.UTC(new Date().getFullYear(), 0, 0);
    var day = Math.floor((Date.now() - start) / 86400000);
    return ((day % length) + length) % length;
  }

  var state = {
    locale: resolveInitialLocale(),
    phraseIndex: 0
  };

  function copy() {
    return I18N.ui[state.locale] || I18N.ui.en;
  }

  function buildLangSwitcher() {
    var select = document.getElementById("langSelect");
    select.replaceChildren();
    I18N.locales.forEach(function (code) {
      var option = document.createElement("option");
      option.value = code;
      option.textContent = I18N.langNames[code];
      if (code === state.locale) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      setLocale(select.value);
    });
  }

  function applyText() {
    var ui = copy();
    document.documentElement.lang = ui.htmlLang;
    document.title = ui.metaTitle;
    var meta = document.getElementById("metaDescription");
    if (meta) meta.setAttribute("content", ui.metaDescription);
    document.getElementById("coupletTagline").textContent = I18N.coupletTagline;

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var value = ui[node.dataset.i18n];
      if (typeof value === "string") node.textContent = value;
    });
  }

  function buildGates() {
    var ui = copy();
    var grid = document.getElementById("gateGrid");
    grid.replaceChildren();
    I18N.gates.forEach(function (gate) {
      var card = document.createElement("article");
      card.className = "gate-card";

      var badge = document.createElement("span");
      badge.className = "gate-badge " + (gate.soon ? "soon" : "now");
      badge.textContent = gate.soon ? ui.comingSoon : ui.available;

      var icon = document.createElement("div");
      icon.className = "gate-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = gate.icon;

      var zh = document.createElement("p");
      zh.className = "gate-zh";
      zh.textContent = gate.zh;

      var name = document.createElement("p");
      name.className = "gate-name";
      name.textContent = gate.name[state.locale] || gate.name.en;

      var desc = document.createElement("p");
      desc.className = "gate-desc";
      desc.textContent = gate.desc[state.locale] || gate.desc.en;

      card.append(badge, icon, zh, name, desc);
      grid.appendChild(card);
    });
  }

  function buildSteps() {
    var ui = copy();
    var list = document.getElementById("stepList");
    list.replaceChildren();
    (ui.steps || []).forEach(function (step) {
      var li = document.createElement("li");
      var h3 = document.createElement("h3");
      h3.textContent = step.t;
      var p = document.createElement("p");
      p.textContent = step.d;
      li.append(h3, p);
      list.appendChild(li);
    });
  }

  function buildPhraseWall() {
    var wall = document.getElementById("phraseWall");
    wall.replaceChildren();
    I18N.phrases.forEach(function (phrase) {
      var chip = document.createElement("figure");
      chip.className = "phrase-chip";
      var zh = document.createElement("p");
      zh.className = "zh";
      zh.textContent = phrase.zh;
      var gloss = document.createElement("figcaption");
      gloss.className = "gloss";
      gloss.textContent = phrase.gloss[state.locale] || phrase.gloss.en;
      chip.append(zh, gloss);
      wall.appendChild(chip);
    });
  }

  function renderRotator() {
    var phrase = I18N.phrases[state.phraseIndex];
    document.getElementById("phraseZh").textContent = phrase.zh;
    document.getElementById("phraseGloss").textContent =
      phrase.gloss[state.locale] || phrase.gloss.en;
  }

  function advanceRotator() {
    var rotator = document.querySelector(".phrase-rotator");
    rotator.classList.add("fade");
    window.setTimeout(function () {
      state.phraseIndex = (state.phraseIndex + 1) % I18N.phrases.length;
      renderRotator();
      rotator.classList.remove("fade");
    }, 650);
  }

  function setLocale(locale) {
    if (I18N.locales.indexOf(locale) === -1) return;
    state.locale = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (error) {
      // Non-fatal if storage is blocked.
    }
    render();
  }

  function render() {
    applyText();
    buildGates();
    buildSteps();
    buildPhraseWall();
    renderRotator();
  }

  function init() {
    state.phraseIndex = dailyIndex(I18N.phrases.length);
    buildLangSwitcher();
    render();
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      window.setInterval(advanceRotator, ROTATE_MS);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
