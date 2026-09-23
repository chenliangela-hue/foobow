export interface GeminiBlessingParams {
  category?: string;
  recipient?: string;
  message?: string;
  locale?: string;
  apiKey?: string;
  model?: string;
}

export interface GeminiBlessingResult {
  text: string;
  provider: string;
  model: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost_usd: number;
  cached: boolean;
  note?: string;
}

export interface GeminiTelemetry {
  callsToday: number;
  tokensToday: number;
  costTodayUsd: string;
  cacheHitRate: string;
}

export function generateBlessingWithGemini(params?: GeminiBlessingParams): Promise<GeminiBlessingResult>;
export function getGeminiTelemetry(): GeminiTelemetry;
