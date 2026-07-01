import type { CacheResult } from "../cache";
import { json } from "../http";

// Parse a comma-separated query param into a trimmed list, falling back to a
// default when it's absent or empty.
export function parseList(value: string | null, fallback: string[]): string[] {
  if (!value) return fallback;
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

// Cache keys are versioned (`v1:`) and sorted so the same request always maps to
// the same key regardless of param order. Shared between the granular handlers
// and the /dashboard aggregate so they hit the *same* cached entries.
export const cacheKeys = {
  crypto: (vs: string, ids: string[]) =>
    `v1:crypto:${vs}:${[...ids].sort().join(",")}`,
  fx: (base: string, symbols: string[]) =>
    `v1:fx:${base}:${[...symbols].sort().join(",")}`,
  macroUk: () => "v1:macro:uk",
};

// Turn a cache result into a JSON response, exposing cache state to the client
// via headers (handy when debugging with curl -i).
export function cachedJson<T>(
  result: CacheResult<T>,
  ttlSeconds: number,
): Response {
  return json(result.data, {
    headers: {
      "X-Cache": result.status,
      "X-Data-Timestamp": result.storedAt,
      "Cache-Control": `public, max-age=${ttlSeconds}`,
    },
  });
}
