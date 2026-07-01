import { UPSTREAM } from "../config";
import { badGateway } from "../http";
import type { StockQuote } from "../types";
import { defaultFetcher, type Fetcher } from "./coingecko";

// TwelveData /quote fields we use. Numeric fields arrive as strings.
interface TwelveDataQuote {
  symbol: string;
  name?: string;
  exchange?: string;
  currency?: string;
  close?: string;
  previous_close?: string;
  change?: string;
  percent_change?: string;
  high?: string;
  low?: string;
  volume?: string;
  is_market_open?: boolean;
  datetime?: string;
}

// TwelveData error shape (a whole-response error, or a per-symbol entry in a
// batch response).
interface TwelveDataError {
  code?: number;
  message?: string;
  status?: string;
}

function num(value: string | undefined): number | null {
  if (value === undefined) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function isError(value: unknown): value is TwelveDataError {
  return (
    typeof value === "object" &&
    value !== null &&
    ((value as TwelveDataError).status === "error" || "code" in value)
  );
}

export function normalizeQuote(raw: TwelveDataQuote): StockQuote {
  return {
    symbol: raw.symbol,
    name: raw.name ?? raw.symbol,
    exchange: raw.exchange ?? null,
    currency: raw.currency ?? "",
    price: num(raw.close) ?? 0,
    previousClose: num(raw.previous_close),
    change: num(raw.change),
    changePct: num(raw.percent_change),
    high: num(raw.high),
    low: num(raw.low),
    volume: num(raw.volume),
    isMarketOpen:
      typeof raw.is_market_open === "boolean" ? raw.is_market_open : null,
    datetime: raw.datetime ?? "",
  };
}

// TwelveData returns a *flat* quote object for a single symbol but an object
// *keyed by symbol* for several — and any symbol can come back as an error
// entry. Handle all three: whole-response error (throw), single (wrap), keyed
// (map, skipping error entries).
export function normalizeMarkets(raw: unknown): StockQuote[] {
  if (isError(raw)) {
    throw badGateway(`TwelveData error: ${raw.message ?? "unknown"}`);
  }
  if (typeof (raw as TwelveDataQuote).symbol === "string") {
    return [normalizeQuote(raw as TwelveDataQuote)];
  }
  const quotes: StockQuote[] = [];
  for (const value of Object.values(raw as Record<string, unknown>)) {
    if (!isError(value) && typeof (value as TwelveDataQuote).symbol === "string") {
      quotes.push(normalizeQuote(value as TwelveDataQuote));
    }
  }
  if (quotes.length === 0) {
    throw badGateway("TwelveData returned no valid quotes");
  }
  return quotes;
}

export function buildQuoteUrl(symbols: string[], apikey: string): string {
  const symbolParam = symbols.map((s) => encodeURIComponent(s)).join(",");
  return `${UPSTREAM.twelvedata}/quote?symbol=${symbolParam}&apikey=${encodeURIComponent(apikey)}`;
}

export async function fetchMarkets(
  symbols: string[],
  apikey: string,
  fetcher: Fetcher = defaultFetcher,
): Promise<StockQuote[]> {
  if (!apikey) {
    throw badGateway("TwelveData API key not configured");
  }
  const res = await fetcher(buildQuoteUrl(symbols, apikey));
  if (!res.ok) {
    throw badGateway(`TwelveData responded ${res.status}`);
  }
  return normalizeMarkets(await res.json());
}
