import { badGateway } from "../http";
import type { MacroIndicator } from "../types";
import { fetchUkBaseRate } from "./boe";
import type { Fetcher } from "./coingecko";
import { fetchUkInflation } from "./ons";

// UK macro strip = ONS inflation (CPI + CPIH) + BoE Bank Rate. Because these are
// two independent upstreams, one being down shouldn't blank the other: we return
// whatever succeeded and only throw if *everything* failed (so the cache's
// serve-stale path can kick in).
export async function fetchUkMacro(
  fetcher: Fetcher = fetch,
): Promise<MacroIndicator[]> {
  const [inflation, rate] = await Promise.allSettled([
    fetchUkInflation(fetcher),
    fetchUkBaseRate(fetcher),
  ]);

  const indicators: MacroIndicator[] = [];
  if (inflation.status === "fulfilled") indicators.push(...inflation.value);
  if (rate.status === "fulfilled") indicators.push(rate.value);

  if (indicators.length === 0) {
    throw badGateway("all UK macro sources failed");
  }
  return indicators;
}
