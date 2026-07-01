import { describe, expect, it } from "vitest";
import {
  buildQuoteUrl,
  fetchMarkets,
  normalizeMarkets,
} from "../src/sources/twelvedata";
import single from "./fixtures/twelvedata_quote_single.json";
import multi from "./fixtures/twelvedata_quote_multi.json";
import { makeFetch } from "./helpers";

describe("twelvedata", () => {
  it("builds a quote URL with comma-joined symbols and the key", () => {
    const url = buildQuoteUrl(["AAPL", "MSFT"], "SECRET");
    expect(url).toContain("symbol=AAPL,MSFT");
    expect(url).toContain("apikey=SECRET");
  });

  it("normalizes a single (flat) quote, coercing string fields", () => {
    const quotes = normalizeMarkets(single);
    expect(quotes).toHaveLength(1);
    expect(quotes[0].symbol).toBe("AAPL");
    expect(quotes[0].price).toBeCloseTo(289.35999);
    expect(quotes[0].changePct).toBeCloseTo(2.70462);
    expect(quotes[0].isMarketOpen).toBe(false);
  });

  it("normalizes a keyed (multi) response and skips error entries", () => {
    const quotes = normalizeMarkets(multi);
    expect(quotes.map((q) => q.symbol)).toEqual(["AAPL", "MSFT"]); // NOPE skipped
    expect(quotes[1].price).toBeCloseTo(512.10001);
  });

  it("throws on a whole-response error (rate limit / auth)", () => {
    expect(() =>
      normalizeMarkets({ code: 429, message: "rate limit", status: "error" }),
    ).toThrow(/TwelveData error/);
  });

  it("fetchMarkets requires a key and surfaces non-OK responses", async () => {
    await expect(fetchMarkets(["AAPL"], "")).rejects.toThrow(/not configured/);
    await expect(
      fetchMarkets(["AAPL"], "K", makeFetch(() => ({ status: 429 }))),
    ).rejects.toThrow(/TwelveData responded 429/);
    const ok = await fetchMarkets(
      ["AAPL", "MSFT"],
      "K",
      makeFetch(() => ({ body: multi })),
    );
    expect(ok).toHaveLength(2);
  });
});
