import { MACRO_HISTORY_MONTHS, UPSTREAM } from "../config";
import { badGateway } from "../http";
import type { MacroIndicator, MacroPoint } from "../types";
import { defaultFetcher, type Fetcher } from "./coingecko";

// The two UK inflation series we surface, both from ONS dataset MM23.
const SERIES = [
  { id: "uk-cpi", cdid: "d7g7", dataset: "mm23" }, // CPI annual rate (headline)
  { id: "uk-cpih", cdid: "l55o", dataset: "mm23" }, // CPIH annual rate
] as const;

interface OnsMonth {
  date: string; // e.g. "2026 MAY"
  value: string; // numbers arrive as strings, e.g. "3.0"
}

interface OnsResponse {
  description: {
    title: string;
    cdid: string;
    unit: string;
    releaseDate?: string | null;
  };
  months?: OnsMonth[];
}

export function normalizeOns(
  raw: OnsResponse,
  id: string,
  historyMonths: number = MACRO_HISTORY_MONTHS,
): MacroIndicator {
  const months = raw.months ?? [];
  if (months.length === 0) {
    throw badGateway(`ONS series ${raw.description.cdid} returned no data`);
  }
  const history: MacroPoint[] = months
    .slice(-historyMonths)
    .map((m) => ({ period: m.date, value: parseFloat(m.value) }));

  return {
    id,
    title: raw.description.title,
    cdid: raw.description.cdid,
    unit: raw.description.unit,
    latest: history[history.length - 1],
    releaseDate: raw.description.releaseDate ?? null,
    history,
  };
}

export function buildOnsUrl(cdid: string, dataset: string): string {
  return `${UPSTREAM.ons}/${cdid.toLowerCase()}/${dataset.toLowerCase()}/data`;
}

async function fetchOnsSeries(
  series: { id: string; cdid: string; dataset: string },
  fetcher: Fetcher,
): Promise<MacroIndicator> {
  const res = await fetcher(buildOnsUrl(series.cdid, series.dataset));
  if (!res.ok) {
    throw badGateway(`ONS responded ${res.status} for ${series.cdid}`);
  }
  const raw = (await res.json()) as OnsResponse;
  return normalizeOns(raw, series.id);
}

export async function fetchUkInflation(
  fetcher: Fetcher = defaultFetcher,
): Promise<MacroIndicator[]> {
  return Promise.all(SERIES.map((series) => fetchOnsSeries(series, fetcher)));
}
