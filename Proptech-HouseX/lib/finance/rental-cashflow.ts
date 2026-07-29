/**
 * ADR-018 Wave 1 — ước tính dòng tiền cho thuê + thuế tham chiếu.
 * Không thay thế tư vấn thuế / quyết định cơ quan thuế.
 */

export const DEFAULT_RENTAL_TAX_RATE = 0.1; // ~10% GTGT+TNCN tham chiếu phổ biến cá nhân

export type RentalCashflowInput = {
  /** Giá thuê thu về / tháng (VND) */
  rentMonthly: number;
  /** Chi phí vận hành / tháng (phí DV, điện nước ước tính, internet…) */
  opexMonthly: number;
  /** Số tháng trống / năm (0–12) */
  vacancyMonthsPerYear?: number;
  /** Thuế ước tính trên doanh thu thuê gộp (0–1) */
  taxRate?: number;
};

export type RentalCashflowResult = {
  rentMonthly: number;
  opexMonthly: number;
  vacancyMonthsPerYear: number;
  taxRate: number;
  /** Doanh thu thuê sau trống căn / tháng TB */
  effectiveRentMonthly: number;
  /** Thuế ước tính / tháng trên doanh thu hiệu dụng */
  taxMonthly: number;
  /** Dòng tiền ròng / tháng sau opex + thuế */
  netMonthly: number;
  grossAnnual: number;
  netAnnual: number;
  /** (netAnnual / (rentMonthly * 12)) nếu rent > 0 */
  netMarginOnGrossRent: number | null;
};

export function calculateRentalCashflow(
  input: RentalCashflowInput,
): RentalCashflowResult {
  const rentMonthly = Math.max(0, input.rentMonthly || 0);
  const opexMonthly = Math.max(0, input.opexMonthly || 0);
  const vacancyRaw = input.vacancyMonthsPerYear ?? 1;
  const vacancyMonthsPerYear = Math.min(12, Math.max(0, vacancyRaw));
  const taxRate =
    input.taxRate == null
      ? DEFAULT_RENTAL_TAX_RATE
      : Math.min(1, Math.max(0, input.taxRate));

  const occupiedFraction = (12 - vacancyMonthsPerYear) / 12;
  const effectiveRentMonthly = rentMonthly * occupiedFraction;
  const taxMonthly = effectiveRentMonthly * taxRate;
  const netMonthly = effectiveRentMonthly - opexMonthly - taxMonthly;
  const grossAnnual = rentMonthly * 12;
  const netAnnual = netMonthly * 12;
  const netMarginOnGrossRent =
    grossAnnual > 0 ? netAnnual / grossAnnual : null;

  return {
    rentMonthly,
    opexMonthly,
    vacancyMonthsPerYear,
    taxRate,
    effectiveRentMonthly,
    taxMonthly,
    netMonthly,
    grossAnnual,
    netAnnual,
    netMarginOnGrossRent,
  };
}
