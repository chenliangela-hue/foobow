// Community feed module.
//
// ODD objects (see docs/odd-spec.md):
//   Community Post  — a shared good deed or a request for help
//   Post Reply      — a supportive answer to a post
//   Post Reaction   — one press of support per person, never a pile-on count
//   Post Tag        — a project category for browsing
//
// Shape follows conventions common to open-source forums (Discourse, Lemmy):
// a post owns its replies, carries a kind and optional tag, and has a
// moderation status from the start — reporting withdraws it immediately.
//
// Loaded after app.js so it can use `state`, `dictionary()`, `saveState()`
// and `showActionWhisper()` from that module.

const POST_KINDS = ["share", "ask"];
const POST_TAGS = ["animals", "elders", "environment", "community", "learning"];
const FEED_FILTERS = ["all", "share", "ask"];

const MOSAIC_CATEGORIES = [
  { id: "environment", icon: "🌿", count: 18, color: "sage" },
  { id: "community", icon: "🏡", count: 15, color: "coral" },
  { id: "animals", icon: "🐾", count: 13, color: "sky" },
  { id: "elders", icon: "🫶", count: 11, color: "gold" },
  { id: "learning", icon: "📖", count: 9, color: "violet" }
];

const MOSAIC_COPY = {
  en: {
    kicker: "Kindness mosaic", title: "Small acts, seen together.", badge: "Illustrative preview",
    intro: "Explore a sample of how completed deeds could form a shared garden without showing names, messages, or locations.",
    privacy: "Category totals only · community publishing stays off until identity and moderation are ready.",
    sample: "sample acts", categories: "Kindness categories",
    environment: ["Care for the earth", "Small care for trees, waterways, and shared green places."],
    community: ["Help close to home", "Meals, errands, and practical care shared with neighbours."],
    animals: ["Protect living beings", "Gentle support for animals and the places they depend on."],
    elders: ["Stand beside elders", "Patient company, listening, and everyday help across generations."],
    learning: ["Share what you know", "Time given to reading, mentoring, and curious minds."]
  },
  "zh-Hans": {
    kicker: "善意拼图", title: "微小善举，汇成风景。", badge: "示意预览",
    intro: "看看已完成的善举如何在不展示姓名、留言或位置的情况下汇成一座共享花园。",
    privacy: "仅显示分类总数 · 身份与审核机制完善前，社区发布保持关闭。", sample: "件示意善举", categories: "善举分类",
    environment: ["守护自然", "关怀树木、水域和共享绿地。"], community: ["帮助身边的人", "为邻里送上餐食、跑腿与实际关怀。"],
    animals: ["保护生命", "温柔帮助动物和它们赖以生存的地方。"], elders: ["陪伴长辈", "用耐心陪伴、倾听与日常帮助连接世代。"],
    learning: ["分享所知", "把时间送给阅读、辅导与好奇的心。"]
  },
  fr: {
    kicker: "Mosaïque de bonté", title: "De petits gestes, réunis.", badge: "Aperçu illustratif",
    intro: "Découvrez comment des gestes accomplis pourraient former un jardin partagé sans noms, messages ni lieux.",
    privacy: "Totaux par catégorie uniquement · la publication reste fermée avant la mise en place de l'identité et de la modération.", sample: "gestes exemples", categories: "Catégories de bonté",
    environment: ["Prendre soin de la terre", "De petites attentions pour les arbres, l'eau et les espaces verts."], community: ["Aider près de chez soi", "Repas, courses et aide concrète entre voisins."],
    animals: ["Protéger le vivant", "Un soutien doux aux animaux et à leurs habitats."], elders: ["Être présent pour les aînés", "Présence, écoute et entraide entre générations."],
    learning: ["Partager son savoir", "Du temps pour lire, guider et nourrir la curiosité."]
  },
  es: {
    kicker: "Mosaico de bondad", title: "Pequeños actos, juntos.", badge: "Vista ilustrativa",
    intro: "Explora cómo las buenas acciones podrían formar un jardín compartido sin mostrar nombres, mensajes ni ubicaciones.",
    privacy: "Solo totales por categoría · la publicación seguirá cerrada hasta contar con identidad y moderación.", sample: "actos de muestra", categories: "Categorías de bondad",
    environment: ["Cuidar la tierra", "Pequeños cuidados para árboles, agua y espacios verdes."], community: ["Ayudar cerca de casa", "Comidas, recados y ayuda práctica entre vecinos."],
    animals: ["Proteger la vida", "Apoyo amable para animales y sus hábitats."], elders: ["Acompañar a mayores", "Compañía, escucha y ayuda cotidiana entre generaciones."],
    learning: ["Compartir lo que sabes", "Tiempo para leer, orientar y despertar curiosidad."]
  },
  th: {
    kicker: "โมเสกแห่งความเมตตา", title: "ความดีเล็ก ๆ เมื่อมองร่วมกัน", badge: "ตัวอย่างเพื่อการออกแบบ",
    intro: "ดูตัวอย่างว่าความดีที่ทำแล้วจะรวมเป็นสวนร่วมกันได้อย่างไร โดยไม่แสดงชื่อ ข้อความ หรือสถานที่",
    privacy: "แสดงเฉพาะยอดรวมตามหมวด · การเผยแพร่จะยังปิดจนกว่าระบบตัวตนและการดูแลจะพร้อม", sample: "ตัวอย่างความดี", categories: "หมวดความเมตตา",
    environment: ["ดูแลโลก", "ใส่ใจต้นไม้ แหล่งน้ำ และพื้นที่สีเขียวร่วมกัน"], community: ["ช่วยเหลือใกล้บ้าน", "แบ่งปันอาหาร ธุระ และความช่วยเหลือกับเพื่อนบ้าน"],
    animals: ["ปกป้องชีวิต", "ช่วยสัตว์และถิ่นอาศัยของพวกมันอย่างอ่อนโยน"], elders: ["อยู่เคียงข้างผู้สูงวัย", "มอบเวลา รับฟัง และช่วยเหลือกันระหว่างวัย"],
    learning: ["แบ่งปันความรู้", "มอบเวลาให้การอ่าน การแนะนำ และความอยากรู้อยากเห็น"]
  },
  ja: {
    kicker: "やさしさのモザイク", title: "小さな行いを、ひとつの景色に。", badge: "イメージプレビュー",
    intro: "名前・メッセージ・場所を表示せず、完了した善行が共有の庭になる姿を体験できます。",
    privacy: "カテゴリ別合計のみ · 本人確認とモデレーションが整うまで投稿機能は公開しません。", sample: "件のサンプル", categories: "善行カテゴリ",
    environment: ["地球をいたわる", "木々、水辺、みんなの緑地への小さな心配り。"], community: ["身近な人を助ける", "食事、用事、近所で分かち合う実用的な支援。"],
    animals: ["いのちを守る", "動物とその生息地への穏やかな支援。"], elders: ["年長者に寄り添う", "世代をつなぐ傾聴、交流、日々の手助け。"],
    learning: ["知恵を分かち合う", "読書、助言、好奇心のために時間を贈ること。"]
  }
};

let activeMosaicCategory = "environment";

function renderKindnessMosaic() {
  const root = document.getElementById("kindnessMosaic");
  const list = document.getElementById("mosaicCategoryList");
  const field = document.getElementById("mosaicTileField");
  if (!root || !list || !field) return;
  const copy = MOSAIC_COPY[normalizeLocale(state.language)] || MOSAIC_COPY.en;
  const active = MOSAIC_CATEGORIES.find((item) => item.id === activeMosaicCategory) || MOSAIC_CATEGORIES[0];

  document.getElementById("kindnessMosaicKicker").textContent = copy.kicker;
  document.getElementById("kindnessMosaicTitle").textContent = copy.title;
  document.getElementById("kindnessMosaicBadge").textContent = copy.badge;
  document.getElementById("kindnessMosaicIntro").textContent = copy.intro;
  document.getElementById("kindnessMosaicPrivacy").textContent = copy.privacy;
  list.setAttribute("aria-label", copy.categories);
  list.replaceChildren();

  MOSAIC_CATEGORIES.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mosaic-category-card ${category.color}${category.id === active.id ? " active" : ""}`;
    button.dataset.mosaicCategory = category.id;
    button.setAttribute("aria-pressed", String(category.id === active.id));
    button.innerHTML = `<span class="mosaic-category-icon" aria-hidden="true">${category.icon}</span><span><strong>${copy[category.id][0]}</strong><small>${category.count} ${copy.sample}</small></span>`;
    button.addEventListener("click", () => {
      activeMosaicCategory = category.id;
      renderKindnessMosaic();
      window.FOOBOW_RITUAL_ENGINE?.audio?.playWaterRipple?.();
    });
    list.append(button);
  });

  field.replaceChildren();
  MOSAIC_CATEGORIES.forEach((category, categoryIndex) => {
    const tileCount = Math.ceil(category.count / 3);
    for (let index = 0; index < tileCount; index += 1) {
      const tile = document.createElement("span");
      tile.className = `mosaic-tile ${category.color}${category.id === active.id ? " active" : ""}`;
      tile.style.setProperty("--tile-delay", `${(categoryIndex * 4 + index) * 24}ms`);
      tile.textContent = index === 0 ? category.icon : "";
      field.append(tile);
    }
  });

  document.getElementById("mosaicDetailIcon").textContent = active.icon;
  document.getElementById("mosaicDetailCount").textContent = `${active.count} ${copy.sample}`;
  document.getElementById("mosaicDetailTitle").textContent = copy[active.id][0];
  document.getElementById("mosaicDetailCopy").textContent = copy[active.id][1];
  root.dataset.activeCategory = active.id;
}

function tagLabel(tag) {
  const key = "tag" + tag.charAt(0).toUpperCase() + tag.slice(1);
  return dictionary()[key] || tag;
}

function renderPostKinds() {
  const row = document.getElementById("postKindRow");
  if (!row) return;
  const dict = dictionary();
  row.replaceChildren();
  POST_KINDS.forEach((kind) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `post-kind${state.postKind === kind ? " active" : ""}`;
    btn.dataset.kind = kind;
    btn.setAttribute("aria-pressed", String(state.postKind === kind));
    btn.textContent = kind === "share" ? dict.postCtaShare : dict.postCtaAsk;
    btn.addEventListener("click", () => {
      state.postKind = kind;
      saveState();
      renderPostKinds();
      renderComposerMode();
    });
    row.append(btn);
  });
}

// Pre-publish content filter. Free text (an optional note or a question) may
// not contain links — the biggest spam/scam vector — and is length-capped.
// See docs/community-safety.md. The client check is advisory; a real backend
// must re-run it on submit.
const URL_PATTERN = /(https?:\/\/|www\.|\b[\w-]+\.(com|net|org|io|cn|co|ru|xyz|link)\b)/i;

function sanitizeText(text, maxLength) {
  const trimmed = (text || "").trim().slice(0, maxLength);
  if (URL_PATTERN.test(trimmed)) return null; // reject: contains a link
  return trimmed;
}

// The primary shared object is a Kindness Card built from an app deed, not an
// upload. Share mode swaps the free-text box for a deed picker + short note.
function renderComposerMode() {
  const select = document.getElementById("postDeedSelect");
  const body = document.getElementById("postBody");
  const label = document.getElementById("postDeedLabel");
  if (!select || !body) return;
  const dict = dictionary();
  const sharing = state.postKind === "share";

  if (label) label.hidden = !sharing;
  select.hidden = !sharing;
  select.replaceChildren();
  data.deeds.forEach((deed) => {
    const option = document.createElement("option");
    option.value = deed.id;
    const deedKey = "deed_title_" + deed.id.replace(/-/g, "_");
    option.textContent = dict[deedKey] || deed.title;
    select.append(option);
  });

  body.placeholder = sharing ? dict.postNotePlaceholder : dict.postPlaceholder;
  body.rows = sharing ? 2 : 3;
}

function renderPostTags() {
  const row = document.getElementById("postTagRow");
  if (!row) return;
  row.replaceChildren();
  POST_TAGS.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `post-tag${state.postTag === tag ? " active" : ""}`;
    btn.dataset.tag = tag;
    btn.setAttribute("aria-pressed", String(state.postTag === tag));
    btn.textContent = tagLabel(tag);
    btn.addEventListener("click", () => {
      // Tapping the active tag clears it — tags are optional.
      state.postTag = state.postTag === tag ? null : tag;
      saveState();
      renderPostTags();
    });
    row.append(btn);
  });
}

function renderFeedFilters() {
  const row = document.getElementById("feedFilterRow");
  if (!row) return;
  const dict = dictionary();
  const labels = { all: dict.feedAll, share: dict.postCtaShare, ask: dict.postCtaAsk };
  row.replaceChildren();
  FEED_FILTERS.forEach((filter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `feed-filter${state.feedFilter === filter ? " active" : ""}`;
    btn.dataset.filter = filter;
    btn.setAttribute("aria-pressed", String(state.feedFilter === filter));
    btn.textContent = labels[filter];
    btn.addEventListener("click", () => {
      state.feedFilter = filter;
      saveState();
      renderCommunityFeed();
    });
    row.append(btn);
  });
}

function visiblePosts() {
  return state.posts.filter((post) => {
    if (post.status !== "visible") return false;
    return state.feedFilter === "all" || post.kind === state.feedFilter;
  });
}

function buildPostCard(post, dict) {
  const deed = post.deedId ? data.deeds.find((d) => d.id === post.deedId) : null;
  const card = document.createElement("article");
  card.className = `feed-post${deed ? " kindness-card" : ""}`;
  card.dataset.postId = post.id;

  const head = document.createElement("div");
  head.className = "post-head";
  const kind = document.createElement("span");
  kind.className = `post-kind-badge ${post.kind}`;
  kind.textContent = deed ? dict.postKindCard : post.kind === "share" ? dict.postKindShare : dict.postKindAsk;
  head.append(kind);
  // A Kindness Card carries the deed's own category; free posts use the chosen tag.
  const tagValue = deed ? deed.categoryKey : post.tag;
  if (tagValue) {
    const tag = document.createElement("span");
    tag.className = "post-tag-badge";
    tag.textContent = deed ? categoryLabel(tagValue) : tagLabel(tagValue);
    head.append(tag);
  }
  const when = document.createElement("time");
  when.className = "post-when";
  when.dateTime = new Date(post.createdAt).toISOString();
  when.textContent = new Date(post.createdAt).toLocaleDateString();
  head.append(when);

  // For a deed share the "content" is the app-generated card art + title;
  // any user note is a short caption below it.
  let body;
  if (deed) {
    const visual = document.createElement("div");
    visual.className = "kindness-card-visual";
    const mark = document.createElement("span");
    mark.className = `kindness-card-mark deed-mark ${deed.mark}`;
    mark.setAttribute("aria-hidden", "true");
    const title = document.createElement("p");
    title.className = "kindness-card-title";
    const deedKey = "deed_title_" + deed.id.replace(/-/g, "_");
    title.textContent = dict[deedKey] || deed.title;
    visual.append(mark, title);
    body = document.createElement("div");
    body.append(visual);
    if (post.body) {
      const note = document.createElement("p");
      note.className = "kindness-card-note";
      note.textContent = post.body;
      body.append(note);
    }
  } else {
    body = document.createElement("p");
    body.className = "post-body";
    body.textContent = post.body;
  }

  const actions = document.createElement("div");
  actions.className = "post-actions";

  const support = document.createElement("button");
  support.type = "button";
  support.className = `post-support${post.supported ? " active" : ""}`;
  support.setAttribute("aria-pressed", String(Boolean(post.supported)));
  const supportLabel = document.createElement("span");
  supportLabel.textContent = `${dict.postSupport} `;
  const supportCount = document.createElement("span");
  supportCount.className = "post-support-count";
  supportCount.textContent = String(post.supportCount || 0);
  support.append(supportLabel, supportCount);
  support.addEventListener("click", () => {
    post.supported = !post.supported;
    post.supportCount = Math.max(0, (post.supportCount || 0) + (post.supported ? 1 : -1));
    if (post.supported) {
      if (typeof playZenChime === "function") playZenChime();
      if (typeof spawnFloatingMerit === "function") {
        spawnFloatingMerit(support, typeof getMeritText === "function" ? getMeritText(1) : "功德 +1");
      }
    }
    saveState();
    renderCommunityFeed();
  });

  const replyToggle = document.createElement("button");
  replyToggle.type = "button";
  replyToggle.className = "post-reply-toggle";
  const replyLabel = document.createElement("span");
  replyLabel.textContent = `${dict.postReplyToggle} `;
  const replyCount = document.createElement("span");
  replyCount.className = "post-reply-count";
  replyCount.textContent = String((post.replies || []).length);
  replyToggle.append(replyLabel, replyCount);

  const report = document.createElement("button");
  report.type = "button";
  report.className = "post-report";
  report.textContent = dict.postReport;
  report.addEventListener("click", () => {
    post.status = "reported";
    saveState();
    renderCommunityFeed();
  });

  actions.append(support, replyToggle, report);

  const replyList = document.createElement("div");
  replyList.className = "post-reply-list";
  (post.replies || []).forEach((reply) => {
    const item = document.createElement("p");
    item.className = "post-reply";
    item.textContent = reply.body;
    replyList.append(item);
  });

  const replyForm = document.createElement("div");
  replyForm.className = "post-reply-form";
  replyForm.hidden = true;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "reply-input";
  input.maxLength = 240;
  input.placeholder = dict.postReplyPlaceholder;
  const send = document.createElement("button");
  send.type = "button";
  send.className = "reply-submit";
  send.textContent = dict.postReplySend;
  send.addEventListener("click", () => {
    const text = sanitizeText(input.value, 240);
    if (!text) return; // empty or contains a link — reject
    post.replies = post.replies || [];
    post.replies.push({ id: `reply_${Date.now()}`, body: text, at: Date.now() });
    saveState();
    renderCommunityFeed();
  });
  replyForm.append(input, send);

  replyToggle.addEventListener("click", () => {
    replyForm.hidden = !replyForm.hidden;
    if (!replyForm.hidden) input.focus();
  });

  card.append(head, body, actions, replyList, replyForm);
  return card;
}

function renderCommunityFeed() {
  const list = document.getElementById("feedList");
  if (!list) return;
  const dict = dictionary();
  renderKindnessMosaic();
  renderPostKinds();
  renderPostTags();
  renderComposerMode();
  renderFeedFilters();
  list.replaceChildren();

  const posts = visiblePosts();
  if (!posts.length) {
    const empty = document.createElement("p");
    empty.className = "feed-empty";
    empty.textContent = dict.feedEmpty;
    list.append(empty);
    return;
  }
  posts.forEach((post) => list.append(buildPostCard(post, dict)));
}

function submitPost() {
  const field = document.getElementById("postBody");
  if (!field) return;
  const sharing = state.postKind === "share";

  // Free text passes the pre-publish filter (no links, length-capped).
  // A rejected note/question blocks the whole post — pre-moderation, not cleanup.
  const rawText = field.value.trim();
  let note = "";
  if (rawText) {
    const clean = sanitizeText(rawText, 140);
    if (clean === null) return; // contains a link — reject
    note = clean;
  }

  const post = {
    id: `post_${Date.now()}`,
    kind: state.postKind,
    tag: state.postTag,
    body: note,
    createdAt: Date.now(),
    supported: false,
    supportCount: 0,
    replies: [],
    status: "visible"
  };

  if (sharing) {
    // The shared object is an app-generated Kindness Card built from a deed.
    const select = document.getElementById("postDeedSelect");
    post.deedId = select ? select.value : data.deeds[0].id;
  } else if (!note) {
    return; // a question needs text
  }

  state.posts.unshift(post);
  field.value = "";
  state.postTag = null;
  saveState();
  renderCommunityFeed();
  showActionWhisper("deedReflections");
}

function setupCommunityFeed() {
  const submit = document.getElementById("postSubmit");
  if (!submit) return;
  submit.addEventListener("click", submitPost);
}

setupCommunityFeed();
renderCommunityFeed();
