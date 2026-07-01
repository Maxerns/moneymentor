// Presentation helpers. Deliberately avoid Intl / toLocaleString(options),
// which are unreliable on Hermes (Android), in favour of manual formatting.

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  JPY: "¥",
};

export function currencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? "";
}

// Fixed decimals + thousands separators, engine-safe.
export function formatNumber(value: number, decimals: number): string {
  const [intPart, dec] = value.toFixed(decimals).split(".");
  const withSeparators = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withSeparators}.${dec}` : withSeparators;
}

// Adapt precision to magnitude: whole numbers for big prices, more decimals for
// sub-£1 tokens.
export function formatMoney(value: number, currency: string): string {
  const decimals = value >= 1000 ? 0 : value >= 1 ? 2 : 4;
  return `${currencySymbol(currency)}${formatNumber(value, decimals)}`;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : ""; // negatives already carry "-"
  return `${sign}${value.toFixed(2)}%`;
}

// "2026 MAY" -> "May 2026"; leaves other formats (e.g. BoE "30 Jun 2026") as-is.
export function prettyPeriod(period: string): string {
  const match = period.match(/^(\d{4})\s+([A-Za-z]{3,})$/);
  if (!match) return period;
  const month = match[2][0].toUpperCase() + match[2].slice(1).toLowerCase();
  return `${month} ${match[1]}`;
}

// ISO timestamp -> "14:32" (local), engine-safe.
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const MACRO_LABELS: Record<string, string> = {
  "uk-cpi": "Inflation · CPI",
  "uk-cpih": "Inflation · CPIH",
  "uk-base-rate": "Bank Rate",
};

export function macroLabel(id: string, fallback: string): string {
  return MACRO_LABELS[id] ?? fallback;
}
