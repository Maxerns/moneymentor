import { getCached } from "../cache";
import { TTL } from "../config";
import { fetchCrypto } from "../sources/coingecko";
import type { Env } from "../types";
import { cacheKeys, cachedJson, parseList } from "./_shared";

const DEFAULT_IDS = ["bitcoin", "ethereum"];
const DEFAULT_VS = "gbp";

// GET /crypto?ids=bitcoin,ethereum&vs=gbp
export async function handleCrypto(url: URL, env: Env): Promise<Response> {
  // CoinGecko IDs are case-sensitive and lowercase, so normalize before both
  // the upstream call and the cache key (keeps ?ids=Bitcoin from missing
  // upstream and from forking the cache by casing).
  const ids = parseList(url.searchParams.get("ids"), DEFAULT_IDS).map((id) =>
    id.toLowerCase(),
  );
  const vs = (url.searchParams.get("vs") ?? DEFAULT_VS).toLowerCase();

  const result = await getCached(env.CACHE, cacheKeys.crypto(vs, ids), TTL.crypto, () =>
    fetchCrypto(ids, vs),
  );
  return cachedJson(result, TTL.crypto);
}
