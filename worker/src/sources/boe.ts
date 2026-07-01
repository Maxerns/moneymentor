import { UPSTREAM } from "../config";
import { badGateway } from "../http";
import type { MacroIndicator, MacroPoint } from "../types";
import type { Fetcher } from "./coingecko";

const BANK_RATE_SERIES = "IUDBEDR"; // BoE official Bank Rate (daily)

// Built by hand rather than with URLSearchParams: the IADB rejects the
// percent-encoded slashes that URLSearchParams would produce for "01/Jan/2020".
// All inputs here are fixed constants, so manual concatenation is safe.
export function buildBoeUrl(
  seriesCode: string = BANK_RATE_SERIES,
  from = "01/Jan/2020",
): string {
  const query = [
    "csv.x=yes",
    `Datefrom=${from}`,
    "Dateto=now",
    `SeriesCodes=${seriesCode}`,
    "CSVF=TN",
    "UsingCodes=Y",
    "VPD=Y",
    "VFD=N",
  ].join("&");
  return `${UPSTREAM.boe}?${query}`;
}

// The IADB CSV is `DATE,IUDBEDR` then rows like `18 Dec 2025,3.75`. Anything
// that isn't a date,value row (header, blank lines, footers) is skipped.
export function parseBoeCsv(csv: string): MacroPoint[] {
  const points: MacroPoint[] = [];
  for (const line of csv.split(/\r?\n/)) {
    const match = line.match(/^(\d{1,2}\s+\w{3}\s+\d{4})\s*,\s*([\d.]+)\s*$/);
    if (match) {
      points.push({ period: match[1], value: parseFloat(match[2]) });
    }
  }
  return points;
}

// A policy rate steps rarely, so the daily series is mostly repeats. Collapse it
// to the points where the rate actually changed (keeping the first date at each
// new level) — a compact, faithful step history for a sparkline.
export function toChangePoints(points: MacroPoint[]): MacroPoint[] {
  const changes: MacroPoint[] = [];
  let previous: number | null = null;
  for (const point of points) {
    if (point.value !== previous) {
      changes.push(point);
      previous = point.value;
    }
  }
  return changes;
}

export function normalizeBoe(csv: string): MacroIndicator {
  const points = parseBoeCsv(csv);
  if (points.length === 0) {
    throw badGateway("BoE returned no Bank Rate data");
  }
  return {
    id: "uk-base-rate",
    title: "Bank of England Bank Rate",
    cdid: BANK_RATE_SERIES,
    unit: "%",
    latest: points[points.length - 1], // the actual most-recent day
    releaseDate: null,
    history: toChangePoints(points),
  };
}

export async function fetchUkBaseRate(
  fetcher: Fetcher = fetch,
): Promise<MacroIndicator> {
  const res = await fetcher(buildBoeUrl());
  if (!res.ok) {
    throw badGateway(`BoE responded ${res.status}`);
  }
  const csv = await res.text();
  return normalizeBoe(csv);
}
