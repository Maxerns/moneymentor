import { UPSTREAM } from "../config";
import { badGateway } from "../http";
import type { CryptoAsset } from "../types";

// A fetch-shaped function, injectable so sources are unit-testable without network.
export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

// Only the fields we consume from CoinGecko's /coins/markets rows.
interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  current_price: number;
  market_cap: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
  last_updated: string;
}

export function normalizeCoinGecko(
  rows: CoinGeckoMarket[],
  currency: string,
): CryptoAsset[] {
  return rows.map((row) => ({
    id: row.id,
    symbol: row.symbol.toUpperCase(),
    name: row.name,
    currency: currency.toUpperCase(),
    price: row.current_price,
    change24hPct: row.price_change_percentage_24h ?? null,
    marketCap: row.market_cap ?? null,
    volume24h: row.total_volume ?? null,
    high24h: row.high_24h ?? null,
    low24h: row.low_24h ?? null,
    image: row.image ?? null,
    updatedAt: row.last_updated,
  }));
}

export function buildCoinGeckoUrl(ids: string[], currency: string): string {
  const params = new URLSearchParams({
    vs_currency: currency.toLowerCase(),
    ids: ids.join(","),
    price_change_percentage: "24h",
    sparkline: "false",
  });
  return `${UPSTREAM.coingecko}/coins/markets?${params.toString()}`;
}

export async function fetchCrypto(
  ids: string[],
  currency: string,
  fetcher: Fetcher = fetch,
): Promise<CryptoAsset[]> {
  const res = await fetcher(buildCoinGeckoUrl(ids, currency));
  if (!res.ok) {
    throw badGateway(`CoinGecko responded ${res.status}`);
  }
  const rows = (await res.json()) as CoinGeckoMarket[];
  return normalizeCoinGecko(rows, currency);
}
