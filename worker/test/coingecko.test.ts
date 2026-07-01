import { describe, expect, it } from "vitest";
import {
  buildCoinGeckoUrl,
  fetchCrypto,
  normalizeCoinGecko,
} from "../src/sources/coingecko";
import fixture from "./fixtures/coingecko_markets.json";
import { makeFetch } from "./helpers";

describe("coingecko", () => {
  it("builds a markets URL with vs currency and ids", () => {
    const url = buildCoinGeckoUrl(["bitcoin", "ethereum"], "GBP");
    expect(url).toContain("vs_currency=gbp");
    expect(url).toContain("ids=bitcoin%2Cethereum");
    expect(url).toContain("price_change_percentage=24h");
  });

  it("normalizes rows into CryptoAssets (real payload shape)", () => {
    const assets = normalizeCoinGecko(fixture as never, "gbp");
    const btc = assets[0];
    expect(btc.id).toBe("bitcoin");
    expect(btc.symbol).toBe("BTC"); // upper-cased
    expect(btc.name).toBe("Bitcoin");
    expect(btc.currency).toBe("GBP");
    expect(typeof btc.price).toBe("number");
    expect(typeof btc.change24hPct).toBe("number");
    expect(btc.image).toMatch(/^https:/);
    expect(() => new Date(btc.updatedAt).toISOString()).not.toThrow();
  });

  it("fetchCrypto calls the fetcher and returns normalized assets", async () => {
    const assets = await fetchCrypto(
      ["bitcoin", "ethereum"],
      "gbp",
      makeFetch(() => ({ body: fixture })),
    );
    expect(assets).toHaveLength(2);
    expect(assets.map((a) => a.symbol)).toContain("ETH");
  });

  it("throws a 502-style error on a non-OK upstream", async () => {
    await expect(
      fetchCrypto(["bitcoin"], "gbp", makeFetch(() => ({ status: 429 }))),
    ).rejects.toThrow(/CoinGecko responded 429/);
  });
});
