// The normalized domain shapes the API returns. Every upstream — however messy
// its own payload — is mapped into one of these before it leaves the Worker, so
// the mobile app only ever deals with these types.

export interface CryptoAsset {
  id: string; // CoinGecko id, e.g. "bitcoin"
  symbol: string; // upper-cased ticker, e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  currency: string; // vs-currency the price is quoted in, e.g. "GBP"
  price: number;
  change24hPct: number | null;
  marketCap: number | null;
  volume24h: number | null;
  high24h: number | null;
  low24h: number | null;
  image: string | null;
  updatedAt: string; // ISO 8601
}

export interface StockQuote {
  symbol: string; // e.g. "AAPL"
  name: string;
  exchange: string | null;
  currency: string; // e.g. "USD"
  price: number; // latest close
  previousClose: number | null;
  change: number | null;
  changePct: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  isMarketOpen: boolean | null;
  datetime: string; // e.g. "2026-06-30"
}

export interface FxSnapshot {
  base: string; // e.g. "GBP"
  date: string; // ECB reference date, YYYY-MM-DD
  rates: Record<string, number>; // symbol -> rate, e.g. { USD: 1.3221 }
}

export interface MacroPoint {
  period: string; // e.g. "2026 MAY"
  value: number;
}

export interface MacroIndicator {
  id: string; // our id, e.g. "uk-cpi"
  title: string; // human label
  cdid: string; // ONS series id, e.g. "D7G7"
  unit: string; // e.g. "%"
  latest: MacroPoint;
  releaseDate: string | null; // ISO 8601
  history: MacroPoint[]; // most-recent-last, for a sparkline
}

export interface SourceError {
  source: string; // "crypto" | "fx" | "macro" | ...
  message: string;
}

export interface DashboardResponse {
  generatedAt: string; // ISO 8601
  crypto?: CryptoAsset[];
  markets?: StockQuote[];
  fx?: FxSnapshot;
  macro?: MacroIndicator[];
  errors: SourceError[]; // partial-failure reporting; empty when all sources ok
}

// Bindings and secrets available to the Worker at runtime.
export interface Env {
  CACHE: KVNamespace;
  // Keyed upstreams, added later via `wrangler secret put`. Optional so the
  // keyless subset runs even before they're configured.
  TWELVEDATA_API_KEY?: string;
  FRED_API_KEY?: string;
  NEWS_API_KEY?: string;
}
