export interface TaxInput {
  income: number;
  deductions?: number;
  selfEmployed?: boolean;
  taxCredits?: boolean;
}

// UK income tax estimate — England & Northern Ireland, 2025/26 tax year.
// Simplified (no National Insurance, no Scottish bands). Extracted from the Tax
// Estimator screen so the band logic can be unit-tested.
//
// - Personal allowance £12,570, tapered £1 per £2 over £100,000 (gone at £125,140)
// - 20% on the next £37,700, 40% up to £125,140, 45% above.
export function estimateIncomeTax({
  income,
  deductions = 0,
  selfEmployed = false,
  taxCredits = false,
}: TaxInput): number {
  let taxableIncome = income - deductions;
  if (selfEmployed) {
    taxableIncome = taxableIncome * 0.95; // rough self-employed adjustment
  }
  if (taxableIncome <= 0) return 0;

  const additionalRateThreshold = 125140;

  let personalAllowance = 12570;
  if (taxableIncome > 100000) {
    personalAllowance = Math.max(0, 12570 - (taxableIncome - 100000) / 2);
  }

  const basicRateCeiling = personalAllowance + 37700;

  if (taxCredits) {
    taxableIncome -= 1000;
  }

  let tax = 0;
  if (taxableIncome > personalAllowance) {
    const basicRateAmount =
      Math.min(taxableIncome, basicRateCeiling) - personalAllowance;
    tax += basicRateAmount > 0 ? basicRateAmount * 0.2 : 0;

    if (taxableIncome > basicRateCeiling) {
      const higherRateAmount =
        Math.min(taxableIncome, additionalRateThreshold) - basicRateCeiling;
      tax += higherRateAmount > 0 ? higherRateAmount * 0.4 : 0;

      if (taxableIncome > additionalRateThreshold) {
        tax += (taxableIncome - additionalRateThreshold) * 0.45;
      }
    }
  }
  return tax > 0 ? tax : 0;
}
