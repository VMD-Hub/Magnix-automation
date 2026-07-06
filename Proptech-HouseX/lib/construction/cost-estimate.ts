/**
 * Ước tính & dự toán chi phí xây nhà theo m² — tham chiếu công thức batdongsan/wiki.
 * Chi phí = Tổng DT xây dựng quy đổi × Đơn giá/m².
 */

export type BuildPackage = "THO" | "CO_BAN" | "TRON_GOI" | "CAO_CAP";

export type FoundationType = "DON" | "BANG" | "COC";

export type RoofType = "NGOI" | "TON" | "BTCT";

export type RegionKey = "TPHCM" | "HA_NOI" | "TINH";

export type QuickEstimateInput = {
  floorAreaM2: number;
  floors: number;
  package: BuildPackage;
  region: RegionKey;
  hasBalcony?: boolean;
  balconyM2?: number;
};

export type DetailEstimateInput = QuickEstimateInput & {
  foundation: FoundationType;
  roof: RoofType;
  wallThicknessMm: 110 | 220;
  includeElevator?: boolean;
};

export type CostLineItem = {
  label: string;
  areaM2: number;
  coefficient: string;
  subtotalM2: number;
};

export type EstimateResult = {
  totalBuiltAreaM2: number;
  unitPricePerM2: number;
  subtotal: number;
  contingency10: number;
  totalWithContingency: number;
  lines: CostLineItem[];
  packageLabel: string;
  regionLabel: string;
  notes: string[];
};

const PACKAGE_LABEL: Record<BuildPackage, string> = {
  THO: "Phần thô",
  CO_BAN: "Hoàn thiện cơ bản",
  TRON_GOI: "Trọn gói tiêu chuẩn",
  CAO_CAP: "Trọn gói cao cấp",
};

const REGION_LABEL: Record<RegionKey, string> = {
  TPHCM: "TP.HCM",
  HA_NOI: "Hà Nội",
  TINH: "Tỉnh/thành khác",
};

/** Đơn giá tham chiếu triệu VNĐ/m² (2026). */
const UNIT_PRICE: Record<RegionKey, Record<BuildPackage, number>> = {
  TPHCM: { THO: 4.2, CO_BAN: 5.8, TRON_GOI: 7.5, CAO_CAP: 10.5 },
  HA_NOI: { THO: 4.0, CO_BAN: 5.5, TRON_GOI: 7.0, CAO_CAP: 9.8 },
  TINH: { THO: 3.5, CO_BAN: 4.8, TRON_GOI: 6.2, CAO_CAP: 8.5 },
};

const FOUNDATION_COEF: Record<FoundationType, number> = {
  DON: 0.3,
  BANG: 0.45,
  COC: 0.55,
};

const ROOF_COEF: Record<RoofType, number> = {
  NGOI: 0.25,
  TON: 0.15,
  BTCT: 0.2,
};

function calcBuiltArea(input: QuickEstimateInput | DetailEstimateInput): CostLineItem[] {
  const { floorAreaM2, floors } = input;
  const foundation =
    "foundation" in input ? FOUNDATION_COEF[input.foundation] : 0.4;
  const roof = "roof" in input ? ROOF_COEF[input.roof] : 0.2;

  const floorLine: CostLineItem = {
    label: "Diện tích sàn các tầng",
    areaM2: floorAreaM2,
    coefficient: `× ${floors} tầng`,
    subtotalM2: floorAreaM2 * floors,
  };

  const foundationLine: CostLineItem = {
    label: "Móng (quy đổi)",
    areaM2: floorAreaM2,
    coefficient: `× ${Math.round(foundation * 100)}%`,
    subtotalM2: floorAreaM2 * foundation,
  };

  const roofLine: CostLineItem = {
    label: "Mái (quy đổi)",
    areaM2: floorAreaM2,
    coefficient: `× ${Math.round(roof * 100)}%`,
    subtotalM2: floorAreaM2 * roof,
  };

  const lines = [floorLine, foundationLine, roofLine];

  if (input.hasBalcony && input.balconyM2) {
    lines.push({
      label: "Ban công/loggia",
      areaM2: input.balconyM2,
      coefficient: "× 50%",
      subtotalM2: input.balconyM2 * 0.5,
    });
  }

  if ("includeElevator" in input && input.includeElevator) {
    lines.push({
      label: "Thang máy (quy đổi)",
      areaM2: 5,
      coefficient: "× 1 hệ",
      subtotalM2: 15,
    });
  }

  return lines;
}

function buildResult(
  input: QuickEstimateInput | DetailEstimateInput,
  lines: CostLineItem[],
): EstimateResult {
  const totalBuiltAreaM2 = lines.reduce((s, l) => s + l.subtotalM2, 0);
  const unitPricePerM2 = UNIT_PRICE[input.region][input.package] * 1_000_000;
  const subtotal = Math.round(totalBuiltAreaM2 * unitPricePerM2);
  const contingency10 = Math.round(subtotal * 0.1);
  const notes = [
    "Đơn giá tham chiếu thị trường 2026 — thay đổi theo nhà thầu và vật liệu.",
    "Nên dự phòng thêm 10% cho phát sinh (điều kiện thi công, thay đổi thiết kế).",
    "Dự toán chi tiết nên có bản vẽ và bóc khối lượng từ nhà thầu.",
  ];

  if ("wallThicknessMm" in input && input.wallThicknessMm === 220) {
    notes.push("Tường 220mm — chi phí có thể cao hơn ~8–12% so vưới tường 110mm.");
  }

  return {
    totalBuiltAreaM2: Math.round(totalBuiltAreaM2 * 10) / 10,
    unitPricePerM2,
    subtotal,
    contingency10,
    totalWithContingency: subtotal + contingency10,
    lines,
    packageLabel: PACKAGE_LABEL[input.package],
    regionLabel: REGION_LABEL[input.region],
    notes,
  };
}

export function estimateQuick(input: QuickEstimateInput): EstimateResult {
  return buildResult(input, calcBuiltArea(input));
}

export function estimateDetail(input: DetailEstimateInput): EstimateResult {
  return buildResult(input, calcBuiltArea(input));
}

export function formatVnd(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

export const COST_ESTIMATE_DISCLAIMER =
  "Kết quả ước tính sơ bộ theo diện tích quy đổi × đơn giá/m² — không thay báo giá nhà thầu. Liên hệ đơn vị thi công để có dự toán bóc tách chính xác.";
