// Client-side mirror of the Worker's normalized response shapes. These are the
// shared contract between the app and worker/src/types.ts — keep them in sync.

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currency: string;
  price: number;
  change24hPct: number | null;
  marketCap: number | null;
  volume24h: number | null;
  high24h: number | null;
  low24h: number | null;
  image: string | null;
  updatedAt: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string | null;
  currency: string;
  price: number;
  previousClose: number | null;
  change: number | null;
  changePct: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  isMarketOpen: boolean | null;
  datetime: string;
}

export interface FxSnapshot {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface MacroPoint {
  period: string;
  value: number;
}

export interface MacroIndicator {
  id: string;
  title: string;
  cdid: string;
  unit: string;
  latest: MacroPoint;
  releaseDate: string | null;
  history: MacroPoint[];
}

export interface SourceError {
  source: string;
  message: string;
}

export interface DashboardResponse {
  generatedAt: string;
  crypto?: CryptoAsset[];
  markets?: StockQuote[];
  fx?: FxSnapshot;
  macro?: MacroIndicator[];
  errors: SourceError[];
}
