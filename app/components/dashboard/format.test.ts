import {
  currencySymbol,
  formatMoney,
  formatNumber,
  formatPercent,
  macroLabel,
  prettyPeriod,
} from "./format";

describe("format", () => {
  it("formatNumber adds thousands separators and fixes decimals", () => {
    expect(formatNumber(44384, 0)).toBe("44,384");
    expect(formatNumber(1234.5, 2)).toBe("1,234.50");
    expect(formatNumber(0.1234, 4)).toBe("0.1234");
  });

  it("formatMoney adapts precision to magnitude and prefixes the symbol", () => {
    expect(formatMoney(44384, "GBP")).toBe("£44,384"); // >=1000 -> 0 dp
    expect(formatMoney(2.5, "USD")).toBe("$2.50"); // >=1 -> 2 dp
    expect(formatMoney(0.42, "EUR")).toBe("€0.4200"); // <1 -> 4 dp
  });

  it("formatPercent signs positives and keeps negatives", () => {
    expect(formatPercent(2.7)).toBe("+2.70%");
    expect(formatPercent(-1.5)).toBe("-1.50%");
    expect(formatPercent(0)).toBe("0.00%");
  });

  it("prettyPeriod humanizes ONS periods and leaves others alone", () => {
    expect(prettyPeriod("2026 MAY")).toBe("May 2026");
    expect(prettyPeriod("30 Jun 2026")).toBe("30 Jun 2026");
  });

  it("macroLabel maps known ids and falls back otherwise", () => {
    expect(macroLabel("uk-cpi", "x")).toBe("Inflation · CPI");
    expect(macroLabel("uk-base-rate", "x")).toBe("Bank Rate");
    expect(macroLabel("unknown", "Fallback")).toBe("Fallback");
  });

  it("currencySymbol maps known codes, empty otherwise", () => {
    expect(currencySymbol("gbp")).toBe("£");
    expect(currencySymbol("XYZ")).toBe("");
  });
});
