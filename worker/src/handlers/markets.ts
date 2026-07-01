import { getCached } from "../cache";
import { TTL } from "../config";
import { HttpError } from "../http";
import { fetchMarkets } from "../sources/twelvedata";
import type { Env } from "../types";
import { cacheKeys, cachedJson, parseList } from "./_shared";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT"];

// GET /markets?symbols=AAPL,MSFT — equity quotes via TwelveData (keyed).
// Returns 501 until TWELVEDATA_API_KEY is set as a Worker secret, so the rest of
// the API keeps working before the key is configured.
export async function handleMarkets(url: URL, env: Env): Promise<Response> {
  if (!env.TWELVEDATA_API_KEY) {
    throw new HttpError(
      501,
      "markets (TwelveData) not configured — set TWELVEDATA_API_KEY",
      "not_implemented",
    );
  }
  const symbols = parseList(url.searchParams.get("symbols"), DEFAULT_SYMBOLS).map(
    (s) => s.toUpperCase(),
  );
  const apiKey = env.TWELVEDATA_API_KEY;

  const result = await getCached(
    env.CACHE,
    cacheKeys.markets(symbols),
    TTL.markets,
    () => fetchMarkets(symbols, apiKey),
  );
  return cachedJson(result, TTL.markets);
}
