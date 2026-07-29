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
    option.textContent = deed.title;
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
    title.textContent = deed.title;
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
