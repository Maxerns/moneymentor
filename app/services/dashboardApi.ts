import type { DashboardResponse } from "../types/dashboard";
import { WORKER_URL } from "./config";

// The watchlist expressed as the Worker's query params.
export interface DashboardParams {
  crypto: string[]; // CoinGecko ids
  stocks: string[]; // equity tickers
  fx: { base: string; symbols: string[] };
}

export class DashboardApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardApiError";
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

// Built by hand rather than via URL/URLSearchParams, which are unreliable in the
// React Native runtime without a polyfill.
function buildQuery(params: DashboardParams): string {
  const parts: string[] = [];
  const csv = (values: string[]) => values.map(encodeURIComponent).join(",");
  if (params.crypto.length) parts.push(`ids=${csv(params.crypto)}`);
  if (params.stocks.length) parts.push(`stocks=${csv(params.stocks)}`);
  parts.push(`base=${encodeURIComponent(params.fx.base)}`);
  if (params.fx.symbols.length) parts.push(`symbols=${csv(params.fx.symbols)}`);
  return parts.join("&");
}

// Fetch the aggregated dashboard from the Worker. Throws DashboardApiError for
// config, timeout, network, and non-2xx cases so callers show one error type.
export async function getDashboard(
  params: DashboardParams,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<DashboardResponse> {
  if (!WORKER_URL) {
    throw new DashboardApiError(
      "EXPO_PUBLIC_WORKER_URL is not set — point it at your deployed Worker or local wrangler dev.",
    );
  }

  const base = WORKER_URL.replace(/\/$/, "");
  const url = `${base}/dashboard?${buildQuery(params)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new DashboardApiError(`Worker responded ${res.status}`);
    }
    return (await res.json()) as DashboardResponse;
  } catch (err) {
    if (err instanceof DashboardApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new DashboardApiError("Request timed out");
    }
    throw new DashboardApiError(
      err instanceof Error ? err.message : "Network error",
    );
  } finally {
    clearTimeout(timer);
  }
}
