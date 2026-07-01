import { UPSTREAM } from "../config";
import { badGateway } from "../http";
import type { FxSnapshot } from "../types";
import { defaultFetcher, type Fetcher } from "./coingecko";

// Frankfurter's /latest payload: { amount, base, date, rates: { SYM: rate } }.
interface FrankfurterLatest {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export function normalizeFrankfurter(raw: FrankfurterLatest): FxSnapshot {
  return {
    base: raw.base,
    date: raw.date,
    rates: raw.rates,
  };
}

export function buildFrankfurterUrl(base: string, symbols: string[]): string {
  const params = new URLSearchParams({ base: base.toUpperCase() });
  if (symbols.length > 0) {
    params.set("symbols", symbols.map((s) => s.toUpperCase()).join(","));
  }
  return `${UPSTREAM.frankfurter}/latest?${params.toString()}`;
}

export async function fetchFx(
  base: string,
  symbols: string[],
  fetcher: Fetcher = defaultFetcher,
): Promise<FxSnapshot> {
  const res = await fetcher(buildFrankfurterUrl(base, symbols));
  if (!res.ok) {
    throw badGateway(`Frankfurter responded ${res.status}`);
  }
  const raw = (await res.json()) as FrankfurterLatest;
  return normalizeFrankfurter(raw);
}
