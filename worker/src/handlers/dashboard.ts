import { type CacheResult, getCached } from "../cache";
import { TTL } from "../config";
import { json } from "../http";
import { fetchCrypto } from "../sources/coingecko";
import { fetchFx } from "../sources/frankfurter";
import { fetchMarkets } from "../sources/twelvedata";
import { fetchUkMacro } from "../sources/ukMacro";
import type { DashboardResponse, Env, SourceError } from "../types";
import { cacheKeys, parseList } from "./_shared";

const DEFAULT_IDS = ["bitcoin", "ethereum"];
const DEFAULT_VS = "gbp";
const DEFAULT_STOCKS = ["AAPL", "MSFT"];
const DEFAULT_BASE = "GBP";
const DEFAULT_SYMBOLS = ["USD", "EUR", "JPY"];

// One source's slot in the fan-out: its label, the cached promise, and how its
// data lands on the response body. Keeping them together lets us build the job
// list dynamically (e.g. only include markets when a key is configured).
interface Job {
  source: SourceError["source"];
  promise: Promise<CacheResult<unknown>>;
  assign: (body: DashboardResponse, data: unknown) => void;
}

// GET /dashboard — one call that composes every source. Each is fetched through
// the same cache the granular endpoints use, and a single failing upstream
// becomes a partial response with an entry in `errors[]` rather than a 500.
export async function handleDashboard(url: URL, env: Env): Promise<Response> {
  // CoinGecko ids are case-sensitive/lowercase; FX + stock symbols upper-case.
  const ids = parseList(url.searchParams.get("ids"), DEFAULT_IDS).map((id) =>
    id.toLowerCase(),
  );
  const vs = (url.searchParams.get("vs") ?? DEFAULT_VS).toLowerCase();
  const base = (url.searchParams.get("base") ?? DEFAULT_BASE).toUpperCase();
  const symbols = parseList(url.searchParams.get("symbols"), DEFAULT_SYMBOLS).map(
    (s) => s.toUpperCase(),
  );
  const stocks = parseList(url.searchParams.get("stocks"), DEFAULT_STOCKS).map(
    (s) => s.toUpperCase(),
  );

  const jobs: Job[] = [
    {
      source: "crypto",
      promise: getCached(env.CACHE, cacheKeys.crypto(vs, ids), TTL.crypto, () =>
        fetchCrypto(ids, vs),
      ),
      assign: (body, data) => {
        body.crypto = data as DashboardResponse["crypto"];
      },
    },
    {
      source: "fx",
      promise: getCached(env.CACHE, cacheKeys.fx(base, symbols), TTL.fx, () =>
        fetchFx(base, symbols),
      ),
      assign: (body, data) => {
        body.fx = data as DashboardResponse["fx"];
      },
    },
    {
      source: "macro",
      promise: getCached(env.CACHE, cacheKeys.macroUk(), TTL.macro, () =>
        fetchUkMacro(),
      ),
      assign: (body, data) => {
        body.macro = data as DashboardResponse["macro"];
      },
    },
  ];

  // Markets only joins the fan-out when the TwelveData key is configured.
  if (env.TWELVEDATA_API_KEY) {
    const apiKey = env.TWELVEDATA_API_KEY;
    jobs.push({
      source: "markets",
      promise: getCached(env.CACHE, cacheKeys.markets(stocks), TTL.markets, () =>
        fetchMarkets(stocks, apiKey),
      ),
      assign: (body, data) => {
        body.markets = data as DashboardResponse["markets"];
      },
    });
  }

  const settled = await Promise.allSettled(jobs.map((job) => job.promise));

  const errors: SourceError[] = [];
  const body: DashboardResponse = { generatedAt: new Date().toISOString(), errors };

  settled.forEach((result, i) => {
    const { source, assign } = jobs[i];
    if (result.status === "fulfilled") assign(body, result.value.data);
    else errors.push({ source, message: messageOf(result.reason) });
  });

  // 200 as long as *something* came back; 502 only if every source failed.
  const anyOk = errors.length < jobs.length;
  return json(body, { status: anyOk ? 200 : 502 });
}

function messageOf(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}
