import { describe, expect, it } from "vitest";
import {
  buildFrankfurterUrl,
  fetchFx,
  normalizeFrankfurter,
} from "../src/sources/frankfurter";
import fixture from "./fixtures/frankfurter_latest.json";
import { makeFetch } from "./helpers";

describe("frankfurter", () => {
  it("builds a latest URL with base and symbols", () => {
    const url = buildFrankfurterUrl("gbp", ["usd", "eur"]);
    expect(url).toContain("base=GBP");
    expect(url).toContain("symbols=USD%2CEUR");
  });

  it("normalizes the latest payload (real shape)", () => {
    const snapshot = normalizeFrankfurter(fixture as never);
    expect(snapshot.base).toBe("GBP");
    expect(snapshot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof snapshot.rates.USD).toBe("number");
  });

  it("fetchFx returns a normalized snapshot", async () => {
    const snapshot = await fetchFx(
      "GBP",
      ["USD", "EUR", "JPY"],
      makeFetch(() => ({ body: fixture })),
    );
    expect(Object.keys(snapshot.rates)).toContain("JPY");
  });

  it("throws on a non-OK upstream", async () => {
    await expect(
      fetchFx("GBP", ["USD"], makeFetch(() => ({ status: 503 }))),
    ).rejects.toThrow(/Frankfurter responded 503/);
  });
});
