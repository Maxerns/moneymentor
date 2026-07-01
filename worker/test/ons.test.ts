import { describe, expect, it } from "vitest";
import {
  buildOnsUrl,
  fetchUkInflation,
  normalizeOns,
} from "../src/sources/ons";
import cpiFixture from "./fixtures/ons_cpi.json";
import cpihFixture from "./fixtures/ons_cpih.json";
import { makeFetch } from "./helpers";

describe("ons", () => {
  it("builds the website /data URL (lower-cased)", () => {
    expect(buildOnsUrl("D7G7", "MM23")).toBe(
      "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7g7/mm23/data",
    );
  });

  it("normalizes string values into numbers and slices history", () => {
    const cpi = normalizeOns(cpiFixture as never, "uk-cpi", 12);
    expect(cpi.id).toBe("uk-cpi");
    expect(cpi.cdid).toBe("D7G7");
    expect(cpi.unit).toBe("%");
    expect(cpi.history).toHaveLength(12);
    // Every history value must be a real number, not the raw ONS string.
    expect(cpi.history.every((p) => typeof p.value === "number")).toBe(true);
    // Latest is the last month in the series.
    expect(cpi.latest.period).toBe("2026 MAY");
    expect(cpi.latest.value).toBeCloseTo(2.8);
  });

  it("fetchUkInflation returns both CPI and CPIH via URL routing", async () => {
    const indicators = await fetchUkInflation(
      makeFetch((url) => ({
        body: url.includes("/l55o/") ? cpihFixture : cpiFixture,
      })),
    );
    const byId = Object.fromEntries(indicators.map((i) => [i.id, i]));
    expect(byId["uk-cpi"].latest.value).toBeCloseTo(2.8);
    expect(byId["uk-cpih"].latest.value).toBeCloseTo(3.0);
  });

  it("throws when a series comes back empty", () => {
    expect(() =>
      normalizeOns({ description: cpiFixture.description, months: [] } as never, "uk-cpi"),
    ).toThrow(/no data/);
  });
});
