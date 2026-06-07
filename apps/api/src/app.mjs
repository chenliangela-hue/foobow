import { createServer as createHttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  blessings,
  deedTypes,
  demoProfile,
  donationCampaigns,
  mapSpots,
  nowIso
} from "./fixtures.mjs";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const devBearerToken = "dev-foobow-token";
const securedRoutes = [
  ["GET", "/api/v1/me"],
  ["GET", "/api/v1/today"],
  ["POST", "/api/v1/blessings"],
  ["POST", "/api/v1/checkins"],
  ["POST", "/api/v1/deed-actions"],
  ["POST", "/api/v1/donations"],
  ["POST", "/api/v1/reports"]
];

function page(items, requestUrl) {
  const limit = Math.min(Number(requestUrl.searchParams.get("limit") ?? 25), 50);
  const cursor = Number(requestUrl.searchParams.get("cursor") ?? 0);
  const start = Number.isInteger(cursor) && cursor > 0 ? cursor : 0;
  const end = start + limit;
  const pagedItems = items.slice(start, end);

  return {
    items: pagedItems,
    page_info: {
      next_cursor: end < items.length ? String(end) : null,
      has_next_page: end < items.length
    }
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, jsonHeaders);
  response.end(JSON.stringify(payload));
}

function sendError(response, status, code, message, details = []) {
  sendJson(response, status, {
    error: {
      code,
      message,
      details,
      request_id: `req_${randomUUID()}`
    }
  });
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

function filterByCategory(items, category) {
  if (!category || category === "all") {
    return items;
  }

  return items.filter((item) => item.category === category);
}

function filterMapSpots(items, requestUrl) {
  let filtered = filterByCategory(items, requestUrl.searchParams.get("category"));
  const region = requestUrl.searchParams.get("region");
  if (region) {
    const normalized = region.toLowerCase();
    filtered = filtered.filter((item) => item.region.toLowerCase().includes(normalized));
  }
  return filtered;
}

function isSecuredRoute(method, path) {
  return securedRoutes.some(([routeMethod, routePath]) => routeMethod === method && routePath === path);
}

function isAuthorized(request) {
  return request.headers.authorization === `Bearer ${devBearerToken}`;
}

function selectRecommendedDeed(mood) {
  const moodMap = {
    heavy: "deed_release_fish",
    lonely: "deed_send_blessing",
    anxious: "deed_clean_beach",
    grateful: "deed_elder_crossing",
    hopeful: "deed_clean_beach",
    calm: "deed_send_blessing"
  };

  return deedTypes.find((deed) => deed.id === moodMap[mood]) ?? deedTypes[0];
}

function normalizeAmount(amount) {
  if (typeof amount !== "string" || !/^[0-9]+(\.[0-9]{2})$/.test(amount)) {
    return null;
  }

  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return amount;
}

export function createApp(options = {}) {
  const state = {
    blessings: options.blessings ? structuredClone(options.blessings) : structuredClone(blessings),
    checkins: new Map(),
    deedActions: [],
    donations: new Map(),
    reports: []
  };

  async function handleRequest(request, response) {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const path = requestUrl.pathname;
    const method = request.method ?? "GET";

    if (method === "OPTIONS") {
      response.writeHead(204, {
        ...jsonHeaders,
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": "content-type,authorization,idempotency-key"
      });
      response.end();
      return;
    }

    if (path === "/health" && method === "GET") {
      sendJson(response, 200, {
        status: "ok",
        service: "foobow-api",
        version: "0.1.0",
        time: nowIso
      });
      return;
    }

    if (isSecuredRoute(method, path) && !isAuthorized(request)) {
      sendError(response, 401, "unauthorized", "Bearer authentication is required for this endpoint.");
      return;
    }

    if (path === "/api/v1/me" && method === "GET") {
      sendJson(response, 200, {
        user: {
          id: "user_demo",
          email: "demo@foobow.local",
          account_status: "registered",
          locale: demoProfile.locale,
          timezone: "America/Toronto"
        },
        profile: demoProfile,
        subscription: {
          plan: "free",
          status: "active",
          ads_enabled: true
        }
      });
      return;
    }

    if (path === "/api/v1/today" && method === "GET") {
      sendJson(response, 200, {
        checkin: Array.from(state.checkins.values()).at(-1) ?? null,
        recommended_deed: selectRecommendedDeed("heavy"),
        journal_prompt: "What small kindness would make today feel lighter?",
        active_campaigns: donationCampaigns.filter(
          (campaign) => campaign.status === "active" && campaign.verification_status === "verified"
        ),
        streak: demoProfile.karma.streak_days
      });
      return;
    }

    if (path === "/api/v1/deed-types" && method === "GET") {
      const items = filterByCategory(deedTypes, requestUrl.searchParams.get("category")).filter(
        (deed) => deed.status === "active"
      );
      sendJson(response, 200, page(items, requestUrl));
      return;
    }

    if (path === "/api/v1/map-spots" && method === "GET") {
      const items = filterMapSpots(mapSpots, requestUrl).filter(
        (spot) => spot.status === "active"
      );
      sendJson(response, 200, page(items, requestUrl));
      return;
    }

    if (path === "/api/v1/donation-campaigns" && method === "GET") {
      const items = donationCampaigns.filter(
        (campaign) => campaign.status === "active" && campaign.verification_status === "verified"
      );
      sendJson(response, 200, page(items, requestUrl));
      return;
    }

    if (path === "/api/v1/blessings" && method === "GET") {
      const items = state.blessings.filter((blessing) => blessing.moderation_status === "visible");
      sendJson(response, 200, page(items, requestUrl));
      return;
    }

    if (path === "/api/v1/blessings" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const text = typeof body.body === "string" ? body.body.trim() : "";
      if (text.length < 1 || text.length > 140) {
        sendError(response, 422, "validation_error", "Blessing body must be between 1 and 140 characters.", [
          { field: "body", issue: "length" }
        ]);
        return;
      }
      if (!["anonymous", "public", "private"].includes(body.visibility)) {
        sendError(response, 422, "validation_error", "Blessing visibility is not supported.", [
          { field: "visibility", issue: "unsupported" }
        ]);
        return;
      }

      const blessing = {
        id: `blessing_${randomUUID()}`,
        body: text,
        visibility: body.visibility,
        moderation_status: "visible",
        reactions: { bless: 0, support: 0, thank_you: 0, same_feeling: 0 },
        created_at: new Date().toISOString()
      };
      state.blessings.unshift(blessing);
      sendJson(response, 201, { blessing });
      return;
    }

    if (path === "/api/v1/checkins" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const allowedMoods = new Set(["calm", "heavy", "lonely", "grateful", "hopeful", "anxious"]);
      if (!allowedMoods.has(body.mood)) {
        sendError(response, 422, "validation_error", "Mood is not supported.", [
          { field: "mood", issue: "unsupported" }
        ]);
        return;
      }

      const checkedInOn = new Date().toISOString().slice(0, 10);
      if (state.checkins.has(checkedInOn)) {
        sendError(response, 409, "conflict", "A check-in already exists for this user today.", [
          { field: "checked_in_on", issue: "duplicate" }
        ]);
        return;
      }

      const checkin = {
        id: `checkin_${randomUUID()}`,
        mood: body.mood,
        note: typeof body.note === "string" ? body.note.slice(0, 500) : "",
        checked_in_on: checkedInOn,
        created_at: new Date().toISOString()
      };
      state.checkins.set(checkedInOn, checkin);
      sendJson(response, 201, {
        checkin,
        recommended_deed: selectRecommendedDeed(body.mood),
        streak: demoProfile.karma.streak_days + 1
      });
      return;
    }

    if (path === "/api/v1/deed-actions" && method === "POST") {
      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const deedType = deedTypes.find((deed) => deed.id === body.deed_type_id);
      if (!deedType) {
        sendError(response, 422, "validation_error", "Unknown deed type.", [
          { field: "deed_type_id", issue: "unknown" }
        ]);
        return;
      }
      if (!["started", "completed"].includes(body.status)) {
        sendError(response, 422, "validation_error", "Deed action status is not supported.", [
          { field: "status", issue: "unsupported" }
        ]);
        return;
      }

      const deedAction = {
        id: `action_${randomUUID()}`,
        deed_type_id: deedType.id,
        map_spot_id: body.map_spot_id ?? null,
        status: body.status === "completed" ? "completed" : "started",
        visibility: ["public", "friends_only", "anonymous", "private"].includes(body.visibility)
          ? body.visibility
          : "private",
        completed_at: body.status === "completed" ? new Date().toISOString() : null
      };
      state.deedActions.push(deedAction);

      sendJson(response, 201, {
        deed_action: deedAction,
        karma_event: {
          id: `karma_${randomUUID()}`,
          event_type: "earned",
          points: deedAction.status === "completed" ? deedType.default_karma_points : 0,
          reason: deedType.name
        },
        badges_earned: deedAction.status === "completed" ? [{ id: "badge_daily_light", name: "Daily Light" }] : []
      });
      return;
    }

    if (path === "/api/v1/donations" && method === "POST") {
      const idempotencyKey = request.headers["idempotency-key"];
      if (!idempotencyKey) {
        sendError(response, 422, "validation_error", "Donation creation requires an Idempotency-Key header.", [
          { field: "Idempotency-Key", issue: "required" }
        ]);
        return;
      }

      const body = await readJson(request);
      if (!body) {
        sendError(response, 400, "validation_error", "Request body must be valid JSON.");
        return;
      }

      const amount = normalizeAmount(body.amount);
      if (!amount) {
        sendError(response, 422, "validation_error", "Donation amount must be a positive two-decimal string.", [
          { field: "amount", issue: "invalid" }
        ]);
        return;
      }
      const currency = body.currency ?? "USD";
      if (!["USD", "CAD"].includes(currency)) {
        sendError(response, 422, "validation_error", "Donation currency is not supported.", [
          { field: "currency", issue: "unsupported" }
        ]);
        return;
      }

      const campaign = donationCampaigns.find((item) => item.id === body.campaign_id);
      if (!campaign || campaign.status !== "active" || campaign.verification_status !== "verified") {
        sendError(response, 422, "unverified_campaign", "Donations can only be created for verified active campaigns.", [
          { field: "campaign_id", issue: "not_verified_or_active" }
        ]);
        return;
      }

      const fingerprint = JSON.stringify({
        campaign_id: campaign.id,
        amount,
        currency
      });
      const existing = state.donations.get(idempotencyKey);
      if (existing && existing.fingerprint !== fingerprint) {
        sendError(response, 409, "idempotency_conflict", "Idempotency-Key was reused with a different donation payload.");
        return;
      }
      if (existing) {
        sendJson(response, 200, existing.response);
        return;
      }

      const payload = {
        donation: {
          id: `donation_${randomUUID()}`,
          campaign_id: campaign.id,
          amount,
          currency,
          payment_status: "pending",
          karma_points_awarded: 0
        },
        checkout: {
          url: `https://payments.example.test/checkout/${randomUUID()}`
        },
        transparency_note: "Donation support is separate from symbolic karma and does not buy luck, virtue, or guaranteed outcomes."
      };
      state.donations.set(idempotencyKey, { fingerprint, response: payload });
      sendJson(response, 201, payload);
      return;
    }

    if (path === "/api/v1/reports" && method === "POST") {
      const body = await readJson(request);
      if (!body || !body.target_type || !body.target_id || !body.reason) {
        sendError(response, 422, "validation_error", "Report target and reason are required.");
        return;
      }

      const report = {
        id: `report_${randomUUID()}`,
        target_type: body.target_type,
        target_id: body.target_id,
        reason: body.reason,
        moderation_status: "open",
        created_at: new Date().toISOString()
      };
      state.reports.push(report);
      sendJson(response, 201, { report });
      return;
    }

    sendError(response, 404, "not_found", "Endpoint not found.");
  }

  return {
    handleRequest,
    state
  };
}

export function createServer(options = {}) {
  const app = createApp(options);
  const server = createHttpServer(app.handleRequest);
  server.appState = app.state;
  return server;
}
