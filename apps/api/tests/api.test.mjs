import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createServer } from "../src/app.mjs";

let server;
let baseUrl;

async function request(path, options = {}) {
  const authHeaders = options.auth === false ? {} : { authorization: "Bearer dev-foobow-token" };
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "content-type": "application/json",
      ...authHeaders,
      ...(options.headers ?? {})
    },
    method: options.method,
    body: options.body
  });
  const json = await response.json();
  return { response, json };
}

describe("Foobow API runtime", () => {
  before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("returns health metadata", async () => {
    const { response, json } = await request("/health", { auth: false });

    assert.equal(response.status, 200);
    assert.equal(json.status, "ok");
    assert.equal(json.service, "foobow-api");
  });

  it("rejects anonymous access to secured endpoints", async () => {
    const { response, json } = await request("/api/v1/me", { auth: false });

    assert.equal(response.status, 401);
    assert.equal(json.error.code, "unauthorized");
  });

  it("returns user, profile, and subscription account shape", async () => {
    const { response, json } = await request("/api/v1/me");

    assert.equal(response.status, 200);
    assert.equal(json.user.account_status, "registered");
    assert.equal(json.profile.privacy_mode, "private");
    assert.equal(json.subscription.plan, "free");
  });

  it("lists active deed types with category filtering and pagination shape", async () => {
    const { response, json } = await request("/api/v1/deed-types?category=animals");

    assert.equal(response.status, 200);
    assert.equal(json.page_info.has_next_page, false);
    assert.ok(json.items.length >= 1);
    assert.ok(json.items.every((item) => item.category === "animals"));
  });

  it("lists map spots with category and region filtering", async () => {
    const { response, json } = await request("/api/v1/map-spots?category=elders&region=Tokyo");

    assert.equal(response.status, 200);
    assert.equal(json.items[0].category, "elders");
    assert.equal(json.items[0].region, "Tokyo, Japan");
    assert.equal(typeof json.items[0].impact.collective_points, "number");
  });

  it("creates mood check-ins with a recommended deed", async () => {
    const { response, json } = await request("/api/v1/checkins", {
      method: "POST",
      body: JSON.stringify({ mood: "lonely", note: "Need something quiet today." })
    });

    assert.equal(response.status, 201);
    assert.equal(json.checkin.mood, "lonely");
    assert.equal(json.recommended_deed.id, "deed_send_blessing");
  });

  it("returns conflict for duplicate daily check-ins", async () => {
    const { response, json } = await request("/api/v1/checkins", {
      method: "POST",
      body: JSON.stringify({ mood: "heavy" })
    });

    assert.equal(response.status, 409);
    assert.equal(json.error.code, "conflict");
  });

  it("completes a deed action and returns symbolic karma without payment coupling", async () => {
    const { response, json } = await request("/api/v1/deed-actions", {
      method: "POST",
      body: JSON.stringify({
        deed_type_id: "deed_elder_crossing",
        map_spot_id: "spot_shibuya_crossing",
        status: "completed",
        visibility: "anonymous"
      })
    });

    assert.equal(response.status, 201);
    assert.equal(json.deed_action.status, "completed");
    assert.equal(json.karma_event.points, 7);
    assert.equal(json.badges_earned[0].name, "Daily Light");
  });

  it("creates and returns moderated blessings", async () => {
    const created = await request("/api/v1/blessings", {
      method: "POST",
      body: JSON.stringify({ body: "May your next hour feel calm.", visibility: "private" })
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.json.blessing.moderation_status, "visible");
    assert.equal(created.json.blessing.visibility, "private");

    const listed = await request("/api/v1/blessings");
    assert.equal(listed.response.status, 200);
    assert.equal(listed.json.items[0].body, "May your next hour feel calm.");
  });

  it("rejects OpenAPI-invalid blessing and donation payloads", async () => {
    const longBlessing = await request("/api/v1/blessings", {
      method: "POST",
      body: JSON.stringify({ body: "x".repeat(141), visibility: "anonymous" })
    });
    assert.equal(longBlessing.response.status, 422);

    const badAmount = await request("/api/v1/donations", {
      method: "POST",
      headers: { "Idempotency-Key": "donation-bad-amount-1" },
      body: JSON.stringify({
        campaign_id: "campaign_operating_support",
        amount: "3",
        currency: "USD"
      })
    });
    assert.equal(badAmount.response.status, 422);

    const badCurrency = await request("/api/v1/donations", {
      method: "POST",
      headers: { "Idempotency-Key": "donation-bad-currency-1" },
      body: JSON.stringify({
        campaign_id: "campaign_operating_support",
        amount: "3.00",
        currency: "EUR"
      })
    });
    assert.equal(badCurrency.response.status, 422);
  });

  it("creates moderation reports with open status", async () => {
    const { response, json } = await request("/api/v1/reports", {
      method: "POST",
      body: JSON.stringify({
        target_type: "blessing",
        target_id: "blessing_001",
        reason: "unsafe_content"
      })
    });

    assert.equal(response.status, 201);
    assert.equal(json.report.target_type, "blessing");
    assert.equal(json.report.moderation_status, "open");
  });

  it("only exposes verified active donation campaigns", async () => {
    const { response, json } = await request("/api/v1/donation-campaigns");

    assert.equal(response.status, 200);
    assert.ok(json.items.length >= 1);
    assert.ok(json.items.every((item) => item.status === "active"));
    assert.ok(json.items.every((item) => item.verification_status === "verified"));
  });

  it("requires donation idempotency keys", async () => {
    const { response, json } = await request("/api/v1/donations", {
      method: "POST",
      body: JSON.stringify({
        campaign_id: "campaign_operating_support",
        amount: "3.00",
        currency: "USD"
      })
    });

    assert.equal(response.status, 422);
    assert.equal(json.error.code, "validation_error");
  });

  it("rejects unverified donation campaigns", async () => {
    const { response, json } = await request("/api/v1/donations", {
      method: "POST",
      headers: { "Idempotency-Key": "donation-unverified-1" },
      body: JSON.stringify({
        campaign_id: "campaign_unverified_school",
        amount: "3.00",
        currency: "USD"
      })
    });

    assert.equal(response.status, 422);
    assert.equal(json.error.code, "unverified_campaign");
  });

  it("makes donation creation idempotent and keeps karma separate", async () => {
    const payload = {
      campaign_id: "campaign_operating_support",
      amount: "3.00",
      currency: "USD"
    };
    const first = await request("/api/v1/donations", {
      method: "POST",
      headers: { "Idempotency-Key": "donation-stable-1" },
      body: JSON.stringify(payload)
    });
    const second = await request("/api/v1/donations", {
      method: "POST",
      headers: { "Idempotency-Key": "donation-stable-1" },
      body: JSON.stringify(payload)
    });

    assert.equal(first.response.status, 201);
    assert.equal(second.response.status, 200);
    assert.equal(first.json.donation.id, second.json.donation.id);
    assert.equal(first.json.donation.karma_points_awarded, 0);
    assert.match(first.json.transparency_note, /does not buy luck/i);
  });

  it("returns request IDs in standard error payloads", async () => {
    const { response, json } = await request("/api/v1/unknown");

    assert.equal(response.status, 404);
    assert.equal(json.error.code, "not_found");
    assert.match(json.error.request_id, /^req_/);
  });

  it("generates bounded AI blessing intentions with token accounting and caching", async () => {
    const payload = {
      category: "health",
      recipient: "grandmother",
      message: "wishing peaceful recovery",
      locale: "en"
    };

    const first = await request("/api/v1/blessings/intentions", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    assert.equal(first.response.status, 201);
    assert.ok(first.json.intention.id);
    assert.ok(first.json.intention.text.length > 0);
    assert.equal(typeof first.json.intention.tokens.total, "number");
    assert.equal(typeof first.json.intention.cost_usd, "number");

    // Identical call should leverage cache to spend 0 tokens
    const second = await request("/api/v1/blessings/intentions", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    assert.equal(second.response.status, 201);
    assert.equal(second.json.intention.cached, true);
    assert.equal(second.json.intention.tokens.total, 0);
    assert.equal(second.json.intention.cost_usd, 0);
  });

  it("synchronizes user karma, streak, and rituals via /api/v1/sync", async () => {
    const payload = {
      karma: 88,
      streak: 12,
      journal: "Cultivating peace through mindful release.",
      rituals_completed: ["fish", "lantern", "muyu"]
    };

    const res = await request("/api/v1/sync", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    assert.equal(res.response.status, 200);
    assert.equal(res.json.status, "synced");
    assert.equal(res.json.synced_user_id, "user_demo");
    assert.ok(res.json.merged.karma >= 88);
    assert.ok(res.json.merged.streak >= 12);
    assert.equal(res.json.merged.journal, payload.journal);
    assert.equal(res.json.merged.rituals_count, 3);
  });

  it("tracks calm focus session start and completion with karma reward", async () => {
    const started = await request("/api/v1/focus-sessions", {
      method: "POST",
      body: JSON.stringify({
        soundscape_slug: "temple_bell",
        target_duration_seconds: 20
      })
    });

    assert.equal(started.response.status, 201);
    assert.match(started.json.focus_session.id, /^focus_/);
    assert.equal(started.json.focus_session.status, "started");

    const completed = await request(`/api/v1/focus-sessions/${started.json.focus_session.id}/complete`, {
      method: "POST",
      body: JSON.stringify({
        elapsed_seconds: 20,
        reflection_mood: "calm",
        reflection_body: "Feeling grounded."
      })
    });

    assert.equal(completed.response.status, 200);
    assert.equal(completed.json.focus_session.status, "completed");
    assert.equal(completed.json.karma_event.points, 5);
    assert.equal(completed.json.reflection.mood, "calm");
  });

  it("serves live admin overview telemetry and handles order actions", async () => {
    const overview = await request("/admin/overview", { auth: false });
    assert.equal(overview.response.status, 200);
    assert.ok(overview.json.metrics);
    assert.ok(overview.json.metrics.incomeToday !== undefined);
    assert.ok(overview.json.metrics.aiTokensToday !== undefined);
    assert.ok(Array.isArray(overview.json.orders));

    const pendingOrder = overview.json.orders.find((o) => o.review === "pending");
    assert.ok(pendingOrder);

    const approveRes = await request(`/admin/orders/${pendingOrder.id}/action`, {
      method: "POST",
      auth: false,
      body: JSON.stringify({ action: "approve" })
    });

    assert.equal(approveRes.response.status, 200);
    assert.equal(approveRes.json.status, "ok");
    assert.equal(approveRes.json.review, "approved");

    const reportsRes = await request("/admin/moderation", { auth: false });
    assert.equal(reportsRes.response.status, 200);
    assert.ok(Array.isArray(reportsRes.json.reports));
  });
});

