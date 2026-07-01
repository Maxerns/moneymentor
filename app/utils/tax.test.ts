import { estimateIncomeTax } from "./tax";

const round = (n: number) => Math.round(n);

describe("estimateIncomeTax (UK 2025/26, England & NI)", () => {
  it("basic-rate income (£30k)", () => {
    expect(round(estimateIncomeTax({ income: 30000 }))).toBe(3486);
  });

  it("higher-rate income (£60k)", () => {
    expect(round(estimateIncomeTax({ income: 60000 }))).toBe(11432);
  });

  it("additional-rate income with fully-tapered allowance (£130k)", () => {
    expect(round(estimateIncomeTax({ income: 130000 }))).toBe(44703);
  });

  it("income within the personal allowance is tax-free", () => {
    expect(estimateIncomeTax({ income: 12570 })).toBe(0);
  });

  it("allowance is fully withdrawn by £125,140", () => {
    // PA = 0 here: 20% on £37,700 then 40% up to the threshold.
    expect(estimateIncomeTax({ income: 125140 })).toBeCloseTo(
      37700 * 0.2 + (125140 - 37700) * 0.4,
      5,
    );
  });

  it("deductions reduce taxable income", () => {
    expect(round(estimateIncomeTax({ income: 60000, deductions: 10000 }))).toBe(
      round(estimateIncomeTax({ income: 50000 })),
    );
  });

  it("returns 0 for non-positive income", () => {
    expect(estimateIncomeTax({ income: 0 })).toBe(0);
    expect(estimateIncomeTax({ income: -5 })).toBe(0);
  });
});
