import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildBoeUrl,
  fetchUkBaseRate,
  normalizeBoe,
  parseBoeCsv,
  toChangePoints,
} from "../src/sources/boe";
import { makeFetch } from "./helpers";

// Real IADB CSV slice (header + Dec 2025 rows incl. the 4 -> 3.75 step + latest).
const realCsv = readFileSync(
  new URL("./fixtures/boe_bankrate.csv", import.meta.url),
  "utf8",
);

describe("boe", () => {
  it("builds the IADB CSV URL with un-encoded date slashes", () => {
    const url = buildBoeUrl();
    expect(url).toContain("_iadb-fromshowcolumns.asp");
    expect(url).toContain("csv.x=yes");
    expect(url).toContain("SeriesCodes=IUDBEDR");
    expect(url).toContain("Datefrom=01/Jan/2020"); // literal slashes, not %2F
  });

  it("parses date,value rows and skips the header", () => {
    const points = parseBoeCsv(realCsv);
    expect(points.length).toBeGreaterThan(0);
    expect(points.every((p) => typeof p.value === "number")).toBe(true);
    expect(points[0].period).toMatch(/^\d{2} \w{3} \d{4}$/);
  });

  it("collapses the daily series to change-points", () => {
    const changes = toChangePoints(parseBoeCsv(realCsv));
    // The fixture spans one step: 4.0 -> 3.75.
    expect(changes.map((c) => c.value)).toEqual([4, 3.75]);
    expect(changes[1].period).toBe("18 Dec 2025");
  });

  it("normalizes to a MacroIndicator with the latest day as `latest`", () => {
    const indicator = normalizeBoe(realCsv);
    expect(indicator.id).toBe("uk-base-rate");
    expect(indicator.cdid).toBe("IUDBEDR");
    expect(indicator.unit).toBe("%");
    expect(indicator.latest.period).toBe("30 Jun 2026");
    expect(indicator.latest.value).toBeCloseTo(3.75);
  });

  it("fetchUkBaseRate reads text and normalizes; throws on non-OK", async () => {
    const ok = await fetchUkBaseRate(makeFetch(() => ({ body: realCsv })));
    expect(ok.latest.value).toBeCloseTo(3.75);
    await expect(
      fetchUkBaseRate(makeFetch(() => ({ status: 500 }))),
    ).rejects.toThrow(/BoE responded 500/);
  });

  it("throws when the CSV has no data rows", () => {
    expect(() => normalizeBoe("DATE,IUDBEDR\n")).toThrow(/no Bank Rate data/);
  });
});
