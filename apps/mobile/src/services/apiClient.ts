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

export function apiPost<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}
