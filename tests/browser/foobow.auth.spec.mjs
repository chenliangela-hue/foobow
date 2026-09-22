import { test, expect } from "@playwright/test";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appUrl = pathToFileURL(`${path.resolve(__dirname, "../../prototype/app/index.html")}`).toString();

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator(".app-shell").waitFor();
  await page.locator(".bottom-nav .nav-item[data-target='profile']").click();
  await expect(page.locator("#screen-profile")).toHaveClass(/active/);
});

test.describe("Foobow User Account, SSO & Cloud Sync", () => {
  test("profile screen defaults to guest mode with SSO sign-in options", async ({ page }) => {
    // Profile head defaults
    const profileTitle = page.locator("#profile-title");
    await expect(profileTitle).toContainText("Quiet Helper");

    const profileAvatar = page.locator("#profileAvatar");
    await expect(profileAvatar).toHaveText("F");

    // Account card guest state
    const accountCard = page.locator("#accountCard");
    await expect(accountCard).toBeVisible();

    const statusLabel = page.locator("#accountStatusLabel");
    await expect(statusLabel).toContainText("Guest");

    const syncPill = page.locator("#accountSyncPill");
    await expect(syncPill).toBeHidden();

    // SSO buttons visible
    const googleBtn = page.locator("#ssoGoogleBtn");
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toContainText("Google");

    const appleBtn = page.locator("#ssoAppleBtn");
    await expect(appleBtn).toBeVisible();
    await expect(appleBtn).toContainText("Apple");

    const emailInput = page.locator("#ssoEmailInput");
    await expect(emailInput).toBeVisible();

    const demoBtn = page.locator("#ssoDemoBtn");
    await expect(demoBtn).toBeVisible();
  });

  test("demo sign-in elevates guest to authenticated user with cloud sync", async ({ page }) => {
    // Click demo sign in
    await page.locator("#ssoDemoBtn").click();

    // Account card switches to logged-in view
    const loggedInView = page.locator("#accountLoggedInView");
    await expect(loggedInView).toBeVisible();

    const guestView = page.locator("#accountGuestView");
    await expect(guestView).toBeHidden();

    // User details match demo user
    const userName = page.locator("#accountUserName");
    await expect(userName).toHaveText("Alex Tan");

    const userEmail = page.locator("#accountUserEmail");
    await expect(userEmail).toHaveText("demo@foobow.local");

    const userAvatar = page.locator("#accountUserAvatar");
    await expect(userAvatar).toHaveText("A");

    // Profile header updates
    await expect(page.locator("#profile-title")).toHaveText("Alex Tan");
    await expect(page.locator("#profileAvatar")).toHaveText("A");

    // Sync pill shows active cloud sync
    const syncPill = page.locator("#accountSyncPill");
    await expect(syncPill).toBeVisible();
    await expect(syncPill).toContainText("Synced");

    // Top navigation avatar updates
    await expect(page.locator("#topNavAvatar")).toHaveText("A");

    // Cloud sync action works
    await page.locator("#accountSyncNowBtn").click();
    const syncMsg = page.locator("#accountSyncMessage");
    await expect(syncMsg).toBeVisible();

    // Sign out reverts to guest mode cleanly
    await page.locator("#accountSignOutBtn").click();
    await expect(loggedInView).toBeHidden();
    await expect(guestView).toBeVisible();
    await expect(page.locator("#profile-title")).toHaveText("Quiet Helper");
    await expect(page.locator("#profileAvatar")).toHaveText("F");
    await expect(syncPill).toBeHidden();
  });

  test("email sign-in creates personalized user session", async ({ page }) => {
    // Fill email and submit
    await page.locator("#ssoEmailInput").fill("lotus.friend@example.com");
    await page.locator("#ssoEmailSubmitBtn").click();

    // Logged in view active
    const loggedInView = page.locator("#accountLoggedInView");
    await expect(loggedInView).toBeVisible();

    const userName = page.locator("#accountUserName");
    await expect(userName).toContainText("Lotus Friend");

    const userEmail = page.locator("#accountUserEmail");
    await expect(userEmail).toHaveText("lotus.friend@example.com");

    // Dropdown reflects session
    await page.locator("#profileMenuButton").click();
    const dropdown = page.locator("#profileDropdown");
    await expect(dropdown).toBeVisible();

    const dropdownSignOut = page.locator("#dropdownSignOutBtn");
    await expect(dropdownSignOut).toBeVisible();

    // Dropdown sign out
    await dropdownSignOut.click();
    await expect(loggedInView).toBeHidden();
    await expect(page.locator("#accountGuestView")).toBeVisible();
  });
});
