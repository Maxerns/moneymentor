import { describe, expect, it } from "vitest";
import { fetchUkBaseRate } from "../src/sources/boe";
import { fetchCrypto } from "../src/sources/coingecko";
import { fetchFx } from "../src/sources/frankfurter";
import { fetchUkInflation } from "../src/sources/ons";
import { fetchMarkets } from "../src/sources/twelvedata";

// Real network calls against the keyless upstreams. Skipped unless LIVE=1 so the
// default suite stays offline and deterministic. Run with: `LIVE=1 npm test`.
const live = process.env.LIVE === "1";

describe.runIf(live)("live smoke (LIVE=1)", () => {
  it("CoinGecko returns priced assets", async () => {
    const assets = await fetchCrypto(["bitcoin", "ethereum"], "gbp");
    expect(assets).toHaveLength(2);
    expect(assets[0].price).toBeGreaterThan(0);
    expect(assets[0].symbol).toBe("BTC");
  }, 15000);

  it("Frankfurter returns FX rates", async () => {
    const fx = await fetchFx("GBP", ["USD", "EUR"]);
    expect(fx.base).toBe("GBP");
    expect(fx.rates.USD).toBeGreaterThan(0);
  }, 15000);

  it("ONS returns UK CPI + CPIH as numbers", async () => {
    const macro = await fetchUkInflation();
    expect(macro).toHaveLength(2);
    expect(typeof macro[0].latest.value).toBe("number");
    expect(macro[0].history.length).toBeGreaterThan(0);
  }, 20000);

  it("BoE returns the current Bank Rate with step-change history", async () => {
    const rate = await fetchUkBaseRate();
    expect(rate.id).toBe("uk-base-rate");
    expect(rate.latest.value).toBeGreaterThan(0);
    expect(rate.history.length).toBeGreaterThan(1); // multiple rate steps
  }, 20000);

  // Needs a real key exported: LIVE=1 TWELVEDATA_API_KEY=... npm test
  it.runIf(process.env.TWELVEDATA_API_KEY)(
    "TwelveData returns equity quotes (batch)",
    async () => {
      const quotes = await fetchMarkets(
        ["AAPL", "MSFT"],
        process.env.TWELVEDATA_API_KEY as string,
      );
      expect(quotes.length).toBeGreaterThan(0);
      expect(quotes[0].price).toBeGreaterThan(0);
    },
    15000,
  );
});
