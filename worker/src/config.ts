// Per-domain cache TTLs (seconds) and upstream base URLs. TTLs reflect how
// often each source actually changes: crypto ticks constantly, ECB FX is set
// once a working day, ONS inflation is monthly.
export const TTL = {
  crypto: 60, // 1 minute
  fx: 12 * 60 * 60, // 12 hours
  macro: 24 * 60 * 60, // 24 hours
} as const;

// How long a "stale" copy is kept for serve-stale-on-upstream-error. Much longer
// than any fresh TTL — a slightly old number beats a broken dashboard.
export const STALE_TTL = 7 * 24 * 60 * 60; // 7 days

export const UPSTREAM = {
  coingecko: "https://api.coingecko.com/api/v3",
  frankfurter: "https://api.frankfurter.dev/v1",
  // ONS's dedicated API was retired 25/11/2024; the website serves the same
  // series as JSON when you append /data to a timeseries URL.
  ons: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries",
  // Bank of England Interactive Database (IADB) CSV export. Only the
  // `_iadb-fromshowcolumns.asp` path honours `csv.x=yes`; the sibling
  // `fromshowcolumns.asp` returns the HTML page instead.
  boe: "https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp",
} as const;

// Number of trailing months to include in a macro sparkline.
export const MACRO_HISTORY_MONTHS = 24;
