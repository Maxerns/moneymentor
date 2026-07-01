import { getCached } from "../cache";
import { TTL } from "../config";
import { json } from "../http";
import { fetchCrypto } from "../sources/coingecko";
import { fetchFx } from "../sources/frankfurter";
import { fetchUkMacro } from "../sources/ukMacro";
import type { DashboardResponse, Env, SourceError } from "../types";
import { cacheKeys, parseList } from "./_shared";

const DEFAULT_IDS = ["bitcoin", "ethereum"];
const DEFAULT_VS = "gbp";
const DEFAULT_BASE = "GBP";
const DEFAULT_SYMBOLS = ["USD", "EUR", "JPY"];

// GET /dashboard — one call that composes every source. Each is fetched through
// the same cache the granular endpoints use, and a single failing upstream
// becomes a partial response with an entry in `errors[]` rather than a 500.
export async function handleDashboard(url: URL, env: Env): Promise<Response> {
  const ids = parseList(url.searchParams.get("ids"), DEFAULT_IDS);
  const vs = (url.searchParams.get("vs") ?? DEFAULT_VS).toLowerCase();
  const base = (url.searchParams.get("base") ?? DEFAULT_BASE).toUpperCase();
  const symbols = parseList(url.searchParams.get("symbols"), DEFAULT_SYMBOLS).map(
    (s) => s.toUpperCase(),
  );

  const [crypto, fx, macro] = await Promise.allSettled([
    getCached(env.CACHE, cacheKeys.crypto(vs, ids), TTL.crypto, () =>
      fetchCrypto(ids, vs),
    ),
    getCached(env.CACHE, cacheKeys.fx(base, symbols), TTL.fx, () =>
      fetchFx(base, symbols),
    ),
    getCached(env.CACHE, cacheKeys.macroUk(), TTL.macro, () => fetchUkMacro()),
  ]);

  const errors: SourceError[] = [];
  const body: DashboardResponse = {
    generatedAt: new Date().toISOString(),
    errors,
  };

  if (crypto.status === "fulfilled") body.crypto = crypto.value.data;
  else errors.push({ source: "crypto", message: messageOf(crypto.reason) });

  if (fx.status === "fulfilled") body.fx = fx.value.data;
  else errors.push({ source: "fx", message: messageOf(fx.reason) });

  if (macro.status === "fulfilled") body.macro = macro.value.data;
  else errors.push({ source: "macro", message: messageOf(macro.reason) });

  // 200 as long as *something* came back; 502 only if every source failed.
  const anyOk = Boolean(body.crypto || body.fx || body.macro);
  return json(body, { status: anyOk ? 200 : 502 });
}

function messageOf(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}
