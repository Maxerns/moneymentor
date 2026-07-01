import { getCached } from "../cache";
import { TTL } from "../config";
import { fetchFx } from "../sources/frankfurter";
import type { Env } from "../types";
import { cacheKeys, cachedJson, parseList } from "./_shared";

const DEFAULT_BASE = "GBP";
const DEFAULT_SYMBOLS = ["USD", "EUR", "JPY"];

// GET /fx?base=GBP&symbols=USD,EUR,JPY
export async function handleFx(url: URL, env: Env): Promise<Response> {
  const base = (url.searchParams.get("base") ?? DEFAULT_BASE).toUpperCase();
  const symbols = parseList(url.searchParams.get("symbols"), DEFAULT_SYMBOLS).map(
    (s) => s.toUpperCase(),
  );

  const result = await getCached(env.CACHE, cacheKeys.fx(base, symbols), TTL.fx, () =>
    fetchFx(base, symbols),
  );
  return cachedJson(result, TTL.fx);
}
