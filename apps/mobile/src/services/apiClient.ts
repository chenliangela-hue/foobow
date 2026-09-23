// Minimal typed HTTP client for the Foobow API.
// Every call resolves — network or server failures become { ok: false }
// so controllers can fall back to bundled sample data offline.

const DEFAULT_API_ORIGIN = "http://localhost:8787";
const API_BASE_PATH = "/api/v1";
const REQUEST_TIMEOUT_MS = 5000;

export const apiConfig = {
  baseUrl: `${process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_ORIGIN}${API_BASE_PATH}`,
  // Dev-only guard token for authed endpoints; never set in production builds.
  devBearerToken: process.env.EXPO_PUBLIC_FOOBOW_DEV_TOKEN ?? ""
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false };

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined)
    };
    if (apiConfig.devBearerToken) {
      headers.Authorization = `Bearer ${apiConfig.devBearerToken}`;
    }
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...init,
      headers,
      signal: controller.signal
    });
    if (!response.ok) {
      return { ok: false };
    }
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export function apiGet<T>(path: string): Promise<ApiResult<T>> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<ApiResult<T>> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body), headers });
}

export interface DonationRequest {
  campaign_id: string;
  amount: string;
  currency?: string;
}

export interface DonationResponse {
  donation: {
    id: string;
    campaign_id: string;
    amount: string;
    currency: string;
    payment_status: string;
    karma_points_awarded: number;
  };
  checkout?: {
    url: string;
  };
  transparency_note: string;
}

export function createDonation(
  req: DonationRequest,
  idempotencyKey?: string
): Promise<ApiResult<DonationResponse>> {
  const key = idempotencyKey || `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return apiPost<DonationResponse>("/donations", req, {
    "Idempotency-Key": key
  });
}


export interface BlessingIntentionRequest {
  category: string;
  recipient?: string;
  message?: string;
  locale?: string;
}

export interface BlessingIntentionResponse {
  intention_id: string;
  category: string;
  recipient: string;
  text: string;
  provider: "gemini" | "cdn" | "mock";
  tokens?: { prompt: number; completion: number; total: number };
  cost_usd: number;
  cached: boolean;
  timestamp: string;
}

export function generateBlessingIntention(
  req: BlessingIntentionRequest
): Promise<ApiResult<BlessingIntentionResponse>> {
  return apiPost<BlessingIntentionResponse>("/blessings/intentions", req);
}

export interface CloudSyncRequest {
  karma?: number;
  streak?: number;
  journal?: string;
  rituals_completed?: string[];
}

export interface CloudSyncResponse {
  status: string;
  server_time: string;
  synced_user_id: string;
  merged: {
    karma: number;
    streak: number;
    journal: string;
    rituals_count: number;
    last_synced_at: string;
  };
}

export function syncCloudState(
  req: CloudSyncRequest
): Promise<ApiResult<CloudSyncResponse>> {
  return apiPost<CloudSyncResponse>("/sync", req);
}


