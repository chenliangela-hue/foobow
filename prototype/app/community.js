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
    });
    row.append(btn);
  });
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
  const card = document.createElement("article");
  card.className = "feed-post";
  card.dataset.postId = post.id;

  const head = document.createElement("div");
  head.className = "post-head";
  const kind = document.createElement("span");
  kind.className = `post-kind-badge ${post.kind}`;
  kind.textContent = post.kind === "share" ? dict.postKindShare : dict.postKindAsk;
  head.append(kind);
  if (post.tag) {
    const tag = document.createElement("span");
    tag.className = "post-tag-badge";
    tag.textContent = tagLabel(post.tag);
    head.append(tag);
  }
  const when = document.createElement("time");
  when.className = "post-when";
  when.dateTime = new Date(post.createdAt).toISOString();
  when.textContent = new Date(post.createdAt).toLocaleDateString();
  head.append(when);

  const body = document.createElement("p");
  body.className = "post-body";
  body.textContent = post.body;

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
    const text = input.value.trim();
    if (!text) return;
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
  const body = field.value.trim();
  if (!body) return;
  state.posts.unshift({
    id: `post_${Date.now()}`,
    kind: state.postKind,
    tag: state.postTag,
    body,
    createdAt: Date.now(),
    supported: false,
    supportCount: 0,
    replies: [],
    status: "visible"
  });
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
