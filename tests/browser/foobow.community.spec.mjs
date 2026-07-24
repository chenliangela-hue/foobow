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

test("sharing a good deed publishes it to the feed", async ({ page }) => {
  await composePost(page, { kind: "share", body: "Walked a neighbour's dog today.", tag: "animals" });

  const first = page.locator(".feed-post").first();
  await expect(first).toContainText("Walked a neighbour's dog today.");
  await expect(first.locator(".post-kind-badge")).toHaveText("Shared a deed");
  await expect(first.locator(".post-tag-badge")).toHaveText("Animals");
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

test("empty posts are rejected without breaking the feed", async ({ page }) => {
  await page.locator("#postBody").fill("   ");
  await page.locator("#postSubmit").click();
  await expect(page.locator(".feed-post")).toHaveCount(0);
});
