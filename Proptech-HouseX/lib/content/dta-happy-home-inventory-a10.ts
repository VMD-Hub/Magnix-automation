/** Giỏ hàng chung Block A10 — bảng giá CĐT DTA Happy Home (giá chính thức). */
export type DtaHappyHomeUnitRow = {
  unitCode: string;
  netAreaM2: number;
  floor: number;
  doorDirection: "Tây Nam" | "Đông Bắc";
  view: "Nội khu" | "Công viên";
  priceVnd: number;
};

export const DTA_HAPPY_HOME_BLOCK_A10 = "A10" as const;
export const DTA_HAPPY_HOME_HANDOVER_LABEL = "Quý IV / 2027" as const;

export const DTA_HAPPY_HOME_INVENTORY_A10: readonly DtaHappyHomeUnitRow[] = [
  { unitCode: "A10-201", netAreaM2: 34.9, floor: 2, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 616_890_976 },
  { unitCode: "A10-203", netAreaM2: 36.18, floor: 2, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 599_952_429 },
  { unitCode: "A10-209", netAreaM2: 32.85, floor: 2, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 544_219_143 },
  { unitCode: "A10-210", netAreaM2: 32.85, floor: 2, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 544_219_143 },
  { unitCode: "A10-212", netAreaM2: 32.85, floor: 2, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 544_219_143 },
  { unitCode: "A10-214", netAreaM2: 32.85, floor: 2, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 544_219_143 },
  { unitCode: "A10-216", netAreaM2: 32.85, floor: 2, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 544_219_143 },
  { unitCode: "A10-221", netAreaM2: 32.85, floor: 2, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 544_219_143 },
  { unitCode: "A10-227", netAreaM2: 36.18, floor: 2, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 599_952_429 },
  { unitCode: "A10-303", netAreaM2: 36.18, floor: 3, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 599_782_500 },
  { unitCode: "A10-310", netAreaM2: 32.85, floor: 3, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 544_065_000 },
  { unitCode: "A10-319", netAreaM2: 32.85, floor: 3, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 544_065_000 },
  { unitCode: "A10-326", netAreaM2: 36.18, floor: 3, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 599_782_500 },
  { unitCode: "A10-401", netAreaM2: 34.9, floor: 4, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 612_240_571 },
  { unitCode: "A10-404", netAreaM2: 36.18, floor: 4, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 595_429_714 },
  { unitCode: "A10-412", netAreaM2: 32.85, floor: 4, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 540_116_571 },
  { unitCode: "A10-414", netAreaM2: 32.85, floor: 4, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 540_116_571 },
  { unitCode: "A10-418", netAreaM2: 32.85, floor: 4, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 540_116_571 },
  { unitCode: "A10-425", netAreaM2: 50.68, floor: 4, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 754_861_714 },
  { unitCode: "A10-429", netAreaM2: 34.9, floor: 4, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 612_240_571 },
  { unitCode: "A10-501", netAreaM2: 34.9, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 594_887_429 },
  { unitCode: "A10-503", netAreaM2: 36.18, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 589_464_571 },
  { unitCode: "A10-511", netAreaM2: 32.85, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 535_236_000 },
  { unitCode: "A10-512", netAreaM2: 32.85, floor: 5, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 535_236_000 },
  { unitCode: "A10-514", netAreaM2: 32.85, floor: 5, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 535_236_000 },
  { unitCode: "A10-517", netAreaM2: 32.85, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 535_236_000 },
  { unitCode: "A10-519", netAreaM2: 32.85, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 535_236_000 },
  { unitCode: "A10-520", netAreaM2: 32.85, floor: 5, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 535_236_000 },
  { unitCode: "A10-521", netAreaM2: 32.85, floor: 5, doorDirection: "Tây Nam", view: "Nội khu", priceVnd: 535_236_000 },
  { unitCode: "A10-526", netAreaM2: 36.18, floor: 5, doorDirection: "Đông Bắc", view: "Công viên", priceVnd: 589_464_571 },
] as const;

export function dtaListingCode(unitCode: string): string {
  return `DTA-HH-${unitCode.replace(/-/g, "")}`;
}

export function findDtaInventoryUnit(
  unitCodeOrListingCode: string,
): DtaHappyHomeUnitRow | null {
  const fromListing = unitCodeOrListingCode.match(/^DTA-HH-A10(\d{3})$/i);
  const unitCode = fromListing
    ? `A10-${fromListing[1]}`
    : unitCodeOrListingCode.match(/^A10-\d{3}$/)
      ? unitCodeOrListingCode
      : null;
  if (!unitCode) return null;
  return DTA_HAPPY_HOME_INVENTORY_A10.find((u) => u.unitCode === unitCode) ?? null;
}
