/**
 * Dự trù vật liệu xây dựng — hệ số tham chiếu theo DT sàn (industry norms VN).
 */

export type MaterialEstimateInput = {
  floorAreaM2: number;
  floors: number;
  wallThicknessMm: 110 | 220;
};

export type MaterialLine = {
  name: string;
  unit: string;
  quantity: number;
  note: string;
};

export type MaterialEstimateResult = {
  builtFloorM2: number;
  items: MaterialLine[];
  notes: string[];
};

/** Hệ số vật liệu / m² sàn (nhà dân dụng 1–3 tầng, tham chiếu). */
export function estimateMaterials(input: MaterialEstimateInput): MaterialEstimateResult {
  const builtFloorM2 = input.floorAreaM2 * input.floors;
  const wallFactor = input.wallThicknessMm === 220 ? 1.15 : 1;

  const items: MaterialLine[] = [
    {
      name: "Xi măng PCB40",
      unit: "bao (50kg)",
      quantity: Math.ceil(builtFloorM2 * 0.18 * wallFactor),
      note: "Móng + cột + dầm + tường",
    },
    {
      name: "Cát vàng",
      unit: "m³",
      quantity: Math.ceil(builtFloorM2 * 0.045 * wallFactor),
      note: "Vữa, trát, láng nền",
    },
    {
      name: "Đá 1×2",
      unit: "m³",
      quantity: Math.ceil(builtFloorM2 * 0.055 * wallFactor),
      note: "Bê tông móng, sàn",
    },
    {
      name: "Gạch ống 8×8×18",
      unit: "viên",
      quantity: Math.ceil(builtFloorM2 * 55 * wallFactor),
      note: "Xây tường bao che",
    },
    {
      name: "Thép CB300/CB400",
      unit: "kg",
      quantity: Math.ceil(builtFloorM2 * 22),
      note: "Móng + khung + sàn (~22kg/m² sàn)",
    },
    {
      name: "Gạch ốp lát (tham chiếu)",
      unit: "m²",
      quantity: Math.ceil(builtFloorM2 * 0.75),
      note: "Sàn + WC (ước 75% diện tích sàn)",
    },
    {
      name: "Sơn nước nội/ngoại thất",
      unit: "lít",
      quantity: Math.ceil(builtFloorM2 * 0.35),
      note: "2 lớp — tùy loại sơn và số lớp",
    },
  ];

  return {
    builtFloorM2,
    items,
    notes: [
      "Khối lượng tham chiếu cho lập kế hoạch mua sắm sơ bộ — không thay bóc tách khối lượng.",
      "Hao hụt thực tế 3–5% (xi măng, cát) và 5–8% (gạch, sơn) nên được cộng thêm.",
      "Liên hệ nhà thầu để có bảng dự trù theo bản vẽ thiết kế.",
    ],
  };
}

export const MATERIAL_ESTIMATE_DISCLAIMER =
  "Dự trù theo hệ số/m² sàn — chỉ mang tính tham khảo. Khối lượng thực tế phụ thuộc thiết kế, móng, mái và địa hình.";
