import { getCached } from "../cache";
import { TTL } from "../config";
import { fetchUkMacro } from "../sources/ukMacro";
import type { Env } from "../types";
import { cacheKeys, cachedJson } from "./_shared";

// GET /macro/uk  — UK CPI + CPIH annual inflation (ONS) + Bank Rate (BoE).
export async function handleMacroUk(_url: URL, env: Env): Promise<Response> {
  const result = await getCached(env.CACHE, cacheKeys.macroUk(), TTL.macro, () =>
    fetchUkMacro(),
  );
  return cachedJson(result, TTL.macro);
}
