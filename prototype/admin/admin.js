(function () {
  "use strict";

  var ADMIN = window.FOOBOW_ADMIN;
  var LOCALE_KEY = "foobow.admin.locale";
  var API_URL_KEY = "foobow.admin.apiUrl";
  var API_TOKEN_KEY = "foobow.admin.apiToken";

  var NAV = [
    { id: "dashboard", ico: "📊" },
    { id: "orders", ico: "🧾" },
    { id: "users", ico: "👥" },
    { id: "pricing", ico: "🏷️" },
    { id: "audit", ico: "📜" },
    { id: "settings", ico: "⚙️" }
  ];

  function readStore(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Non-fatal.
    }
  }

  var state = {
    locale: (function () {
      var saved = readStore(LOCALE_KEY, null);
      if (saved && ADMIN.locales.indexOf(saved) !== -1) return saved;
      return (navigator.language || "en").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
    })(),
    view: "dashboard",
    data: null,
    live: false
  };

  function t() {
    return ADMIN.i18n[state.locale] || ADMIN.i18n.en;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // --- Data loading: live API when configured, else demo -------------------
  async function loadData() {
    var apiUrl = readStore(API_URL_KEY, "").trim();
    var token = readStore(API_TOKEN_KEY, "").trim();
    if (apiUrl) {
      try {
        var response = await fetch(apiUrl.replace(/\/$/, "") + "/admin/overview", {
          headers: token ? { Authorization: "Bearer " + token } : {}
        });
        if (response.ok) {
          var payload = await response.json();
          state.data = payload;
          state.live = true;
          return;
        }
      } catch (error) {
        // Fall through to demo data.
      }
    }
    state.data = ADMIN.demo;
    state.live = false;
  }

  function money(value) {
    return state.data.metrics.currency + Number(value).toFixed(2);
  }

  // --- Views ---------------------------------------------------------------
  function viewDashboard() {
    var c = t().dashboard;
    var m = state.data.metrics;
    var wrap = el("div");

    var incomeRow = el("div", "income-row");
    [
      { cls: "today", label: c.incomeToday, value: money(m.incomeToday), icon: "👛" },
      { cls: "total", label: c.incomeTotal, value: money(m.incomeTotal), icon: "📈" }
    ].forEach(function (card) {
      var box = el("div", "income-card " + card.cls);
      box.append(el("span", "income-icon", card.icon));
      box.append(el("p", "income-label", card.label));
      box.append(el("p", "income-value", card.value));
      incomeRow.append(box);
    });
    wrap.append(incomeRow);
    wrap.append(el("p", "income-note", c.incomeNote));

    wrap.append(el("p", "group-label", c.usersGroup));
    var userRow = el("div", "stat-row");
    [
      { label: c.usersTotal, value: m.usersTotal, cls: "" },
      { label: c.usersActive, value: m.usersActive, cls: "" },
      { label: c.usersHistory, value: m.usersHistory, cls: "" },
      { label: c.usersNew, value: m.usersNew, cls: "" }
    ].forEach(function (tile) {
      var box = el("div", "stat-tile");
      box.append(el("p", "label", tile.label));
      box.append(el("p", "value " + tile.cls, String(tile.value)));
      userRow.append(box);
    });
    wrap.append(userRow);

    wrap.append(el("p", "group-label", c.ordersGroup));
    var orderRow = el("div", "stat-row");
    [
      { label: c.ordersTotal, value: m.ordersTotal, cls: "" },
      { label: c.ordersPaid, value: m.ordersPaid, cls: "positive" },
      { label: c.ordersPending, value: m.ordersPending, cls: "amber" },
      { label: c.ordersReview, value: m.ordersReview, cls: "review" }
    ].forEach(function (tile) {
      var box = el("div", "stat-tile");
      box.append(el("p", "label", tile.label));
      box.append(el("p", "value " + tile.cls, String(tile.value)));
      orderRow.append(box);
    });
    wrap.append(orderRow);
    return wrap;
  }

  function buildTable(headers, rows) {
    var wrap = el("div", "table-wrap");
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var htr = document.createElement("tr");
    headers.forEach(function (h) { htr.append(el("th", null, h)); });
    thead.append(htr);
    table.append(thead);
    var tbody = document.createElement("tbody");
    rows.forEach(function (cells) {
      var tr = document.createElement("tr");
      cells.forEach(function (cell) {
        var td = document.createElement("td");
        if (typeof cell === "string" || typeof cell === "number") {
          td.textContent = String(cell);
        } else if (cell) {
          td.append(cell);
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);
    wrap.append(table);
    return wrap;
  }

  function statusPill(kind, label) {
    return el("span", "pill " + kind, label);
  }

  function viewOrders() {
    var c = t().orders;
    var st = t().status;
    var kinds = t().kinds;
    var wrap = el("div");
    var pending = state.data.orders.filter(function (o) { return o.review === "pending"; });
    if (pending.length === 0) {
      wrap.append(el("p", "empty-note", c.empty));
      return wrap;
    }
    var rows = pending.map(function (order) {
      var actions = el("div", "row-actions");
      var approve = el("button", "mini-btn approve", c.approve);
      var reject = el("button", "mini-btn reject", c.reject);
      approve.addEventListener("click", function () {
        order.review = "approved";
        approve.disabled = true; reject.disabled = true;
        approve.textContent = c.approved;
        render();
      });
      reject.addEventListener("click", function () {
        order.review = "rejected";
        approve.disabled = true; reject.disabled = true;
        reject.textContent = c.rejected;
        render();
      });
      actions.append(approve, reject);
      return [
        order.id,
        kinds[order.item] || order.item,
        money(order.amount),
        order.provider,
        statusPill("review", st.review),
        actions
      ];
    });
    wrap.append(buildTable(
      [c.colId, c.colItem, c.colAmount, c.colProvider, c.colStatus, c.colAction],
      rows
    ));
    return wrap;
  }

  function viewUsers() {
    var c = t().users;
    var rows = state.data.users.map(function (u) {
      return [u.name, u.locale, String(u.streak), String(u.karma), u.joined];
    });
    return buildTable([c.colName, c.colLocale, c.colStreak, c.colKarma, c.colJoined], rows);
  }

  function viewPricing() {
    var c = t().pricing;
    var st = t().status;
    var kinds = t().kinds;
    var wrap = el("div");
    wrap.append(el("p", "section-note", c.note));
    var rows = state.data.catalog.map(function (item) {
      return [
        item.name,
        kinds[item.kind] || item.kind,
        money(item.price),
        statusPill(item.status, st[item.status] || item.status)
      ];
    });
    wrap.append(buildTable([c.colName, c.colKind, c.colPrice, c.colStatus], rows));
    return wrap;
  }

  function viewAudit() {
    var c = t().audit;
    var rows = state.data.audit.map(function (a) {
      return [a.time, a.actor, a.action, a.target];
    });
    return buildTable([c.colTime, c.colActor, c.colAction, c.colTarget], rows);
  }

  function viewSettings() {
    var c = t().settings;
    var wrap = el("div");

    var api = el("div", "settings-card");
    api.append(el("h2", null, c.apiTitle));
    api.append(el("p", null, c.apiDesc));

    var urlField = el("div", "field");
    urlField.append(el("label", null, c.apiUrl));
    var urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.id = "apiUrlInput";
    urlInput.value = readStore(API_URL_KEY, "");
    urlInput.placeholder = "https://api.foobow.com/api/v1";
    urlField.append(urlInput);
    api.append(urlField);

    var tokenField = el("div", "field");
    tokenField.append(el("label", null, c.apiToken));
    var tokenInput = document.createElement("input");
    tokenInput.type = "password";
    tokenInput.id = "apiTokenInput";
    tokenInput.value = readStore(API_TOKEN_KEY, "");
    tokenField.append(tokenInput);
    api.append(tokenField);

    var save = el("button", "primary-btn", c.save);
    save.addEventListener("click", async function () {
      writeStore(API_URL_KEY, urlInput.value.trim());
      writeStore(API_TOKEN_KEY, tokenInput.value.trim());
      save.textContent = c.saved;
      await loadData();
      window.setTimeout(function () { save.textContent = c.save; }, 1200);
      updateDemoBadge();
    });
    api.append(save);
    wrap.append(api);

    var security = el("div", "settings-card");
    security.append(el("h2", null, c.securityTitle));
    security.append(el("p", null, c.securityDesc));
    wrap.append(security);
    return wrap;
  }

  var VIEWS = {
    dashboard: viewDashboard,
    orders: viewOrders,
    users: viewUsers,
    pricing: viewPricing,
    audit: viewAudit,
    settings: viewSettings
  };

  // --- Chrome --------------------------------------------------------------
  function buildLangSelect() {
    var select = document.getElementById("langSelect");
    select.replaceChildren();
    ADMIN.locales.forEach(function (code) {
      var option = document.createElement("option");
      option.value = code;
      option.textContent = ADMIN.langNames[code];
      if (code === state.locale) option.selected = true;
      select.append(option);
    });
    select.addEventListener("change", function () {
      state.locale = select.value;
      writeStore(LOCALE_KEY, state.locale);
      render();
    });
  }

  function buildNav() {
    var nav = document.getElementById("sideNav");
    nav.replaceChildren();
    NAV.forEach(function (item) {
      var btn = el("button", "side-item" + (item.id === state.view ? " active" : ""));
      btn.type = "button";
      btn.dataset.view = item.id;
      var ico = el("span", "ico", item.ico);
      ico.setAttribute("aria-hidden", "true");
      btn.append(ico);
      btn.append(el("span", null, t().nav[item.id]));
      btn.addEventListener("click", function () {
        state.view = item.id;
        render();
      });
      nav.append(btn);
    });
  }

  function updateDemoBadge() {
    var badge = document.getElementById("demoBadge");
    badge.textContent = t().demoBadge;
    badge.hidden = state.live;
  }

  function render() {
    var strings = t();
    document.documentElement.lang = strings.htmlLang;
    document.getElementById("brandName").textContent = strings.brand;
    document.getElementById("brandSub").textContent = strings.brandSub;
    document.getElementById("refreshBtn").textContent = strings.refresh;
    document.getElementById("viewTitle").textContent = strings[state.view].title;

    buildNav();
    updateDemoBadge();

    var container = document.getElementById("adminView");
    container.replaceChildren((VIEWS[state.view] || viewDashboard)());
  }

  async function refresh() {
    await loadData();
    render();
  }

  async function init() {
    buildLangSelect();
    document.getElementById("refreshBtn").addEventListener("click", refresh);
    await loadData();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
