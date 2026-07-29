import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

// TDD: these specs were written before the community feed existed. They
// describe the ODD objects — Community Post, Post Reply, Post Reaction,
// Post Tag — through the behaviour a user can observe.

const appUrl = pathToFileURL(`${process.cwd()}/prototype/app/index.html`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
  await page.locator(".bottom-nav .nav-item[data-target='community']").click();
  await expect(page.locator("#screen-community")).toHaveClass(/active/);
});

async function composePost(page, { kind, body, tag }) {
  await page.locator(`#postKindRow .post-kind[data-kind="${kind}"]`).click();
  if (tag) await page.locator(`#postTagRow .post-tag[data-tag="${tag}"]`).click();
  await page.locator("#postBody").fill(body);
  await page.locator("#postSubmit").click();
}

test("sharing a good deed publishes an app-generated card with an optional note", async ({ page }) => {
  // Share mode builds a Kindness Card from the selected deed; the note is a
  // short caption. The default selected deed is the first in the catalog.
  await composePost(page, { kind: "share", body: "A quiet morning by the water." });

  const first = page.locator(".feed-post").first();
  await expect(first).toHaveClass(/kindness-card/);
  await expect(first).toContainText("A quiet morning by the water.");
  await expect(first.locator(".post-kind-badge")).toHaveText("Shared a kindness");
  await expect(first.locator(".kindness-card-title")).not.toBeEmpty();
  // The composer resets so the next post starts clean.
  await expect(page.locator("#postBody")).toHaveValue("");
});

test("a question can be asked and answered with a reply", async ({ page }) => {
  await composePost(page, { kind: "ask", body: "How do I help an elderly neighbour without intruding?" });

  const post = page.locator(".feed-post").first();
  await expect(post.locator(".post-kind-badge")).toHaveText("Asked for help");

  await post.locator(".post-reply-toggle").click();
  await post.locator(".reply-input").fill("Offer once, kindly, and accept either answer.");
  await post.locator(".reply-submit").click();

  await expect(post.locator(".post-reply")).toHaveCount(1);
  await expect(post.locator(".post-reply").first()).toContainText("Offer once, kindly");
  await expect(post.locator(".post-reply-count")).toHaveText("1");
});

test("supporting a post counts once per person", async ({ page }) => {
  await composePost(page, { kind: "share", body: "Picked up litter at the park." });
  const support = page.locator(".feed-post").first().locator(".post-support");

  await expect(support).toHaveAttribute("aria-pressed", "false");
  await support.click();
  await expect(support).toHaveAttribute("aria-pressed", "true");
  await expect(support.locator(".post-support-count")).toHaveText("1");

  // Pressing again withdraws support rather than double-counting.
  await support.click();
  await expect(support).toHaveAttribute("aria-pressed", "false");
  await expect(support.locator(".post-support-count")).toHaveText("0");
});

test("the feed can be filtered by kind", async ({ page }) => {
  await composePost(page, { kind: "share", body: "Shared a warm meal." });
  await composePost(page, { kind: "ask", body: "Where can I volunteer weekly?" });
  await expect(page.locator(".feed-post")).toHaveCount(2);

  await page.locator("#feedFilterRow .feed-filter[data-filter='ask']").click();
  await expect(page.locator(".feed-post")).toHaveCount(1);
  await expect(page.locator(".feed-post").first()).toContainText("Where can I volunteer weekly?");

  await page.locator("#feedFilterRow .feed-filter[data-filter='all']").click();
  await expect(page.locator(".feed-post")).toHaveCount(2);
});

test("a reported post is withdrawn from the feed", async ({ page }) => {
  await composePost(page, { kind: "share", body: "Something that needs review." });
  await expect(page.locator(".feed-post")).toHaveCount(1);

  await page.locator(".feed-post").first().locator(".post-report").click();
  await expect(page.locator(".feed-post")).toHaveCount(0);
});

test("posts and replies persist across reload", async ({ page }) => {
  await composePost(page, { kind: "share", body: "A quiet good deed to remember." });
  await page.locator(".feed-post").first().locator(".post-reply-toggle").click();
  await page.locator(".feed-post").first().locator(".reply-input").fill("Lovely.");
  await page.locator(".feed-post").first().locator(".reply-submit").click();
  await expect(page.locator(".post-reply")).toHaveCount(1);

  await page.reload();
  await page.locator(".bottom-nav .nav-item[data-target='community']").click();
  await expect(page.locator(".feed-post")).toHaveCount(1);
  await expect(page.locator(".feed-post").first()).toContainText("A quiet good deed to remember.");
  await expect(page.locator(".post-reply-count")).toHaveText("1");
});

test("empty questions are rejected without breaking the feed", async ({ page }) => {
  // A question needs text (a share, by contrast, always has its deed card).
  await page.locator("#postKindRow .post-kind[data-kind='ask']").click();
  await page.locator("#postBody").fill("   ");
  await page.locator("#postSubmit").click();
  await expect(page.locator(".feed-post")).toHaveCount(0);
});

// Safety-by-design (see docs/community-safety.md): the primary shared object
// is an app-generated Kindness Card, not a free upload.
test("sharing a deed produces an app-generated kindness card, with no image upload", async ({ page }) => {
  // Share mode is default; the deed picker replaces free text.
  await expect(page.locator("#postDeedSelect")).toBeVisible();
  // There is no way to upload an image anywhere in the composer.
  await expect(page.locator("#screen-community input[type='file']")).toHaveCount(0);

  await page.selectOption("#postDeedSelect", { label: "Plant a tree" });
  await page.locator("#postBody").fill("Planted one by the river.");
  await page.locator("#postSubmit").click();

  const card = page.locator(".feed-post.kindness-card").first();
  await expect(card).toBeVisible();
  await expect(card.locator(".kindness-card-title")).toHaveText("Plant a tree");
  await expect(card.locator(".kindness-card-mark")).toBeVisible();
  await expect(card.locator(".post-tag-badge")).toHaveText("Environment");
  await expect(card).toContainText("Planted one by the river.");
});

test("asking for help uses short text, not a kindness card", async ({ page }) => {
  await page.locator("#postKindRow .post-kind[data-kind='ask']").click();
  await expect(page.locator("#postDeedSelect")).toBeHidden();
  await page.locator("#postBody").fill("Any tips for visiting a care home?");
  await page.locator("#postSubmit").click();

  const post = page.locator(".feed-post").first();
  await expect(post).not.toHaveClass(/kindness-card/);
  await expect(post).toContainText("Any tips for visiting a care home?");
});

test("posts and replies reject links to limit spam and scams", async ({ page }) => {
  await page.locator("#postKindRow .post-kind[data-kind='ask']").click();
  await page.locator("#postBody").fill("Free money at http://spam.example now");
  await page.locator("#postSubmit").click();
  // A link makes the post fail the pre-publish filter — nothing is created.
  await expect(page.locator(".feed-post")).toHaveCount(0);
});
