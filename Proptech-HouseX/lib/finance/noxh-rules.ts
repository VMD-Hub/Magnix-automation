/**
 * Bộ quy tắc điều kiện mua Nhà ở xã hội (NOXH) — TÁCH RIÊNG khỏi logic.
 *
 * Vì quy định thay đổi ~2 lần/năm (NĐ 261/2025 → 54/2026 → 136/2026), TOÀN BỘ
 * ngưỡng số học và danh mục đối tượng phải nằm ở file này. Khi có nghị định mới,
 * chỉ cần thêm một RuleSet mới + trỏ CURRENT_NOXH_RULES sang bản mới; logic ở
 * noxh-eligibility.ts KHÔNG cần đổi.
 *
 * Nguồn hiện hành:
 *  - Luật Nhà ở 2023 (27/2023/QH15): Đ.76 đối tượng, Đ.78 điều kiện.
 *  - NĐ 100/2024/NĐ-CP: Đ.29 điều kiện nhà ở, Đ.30 điều kiện thu nhập.
 *  - Sửa đổi bởi NĐ 261/2025, NĐ 54/2026 và NĐ 136/2026/NĐ-CP (hiệu lực 07/4/2026):
 *    trần thu nhập 25 / 35 / 50 triệu; diện tích tối thiểu 15 m² sàn/người.
 *
 * LƯU Ý: đây là công cụ sàng lọc SƠ BỘ, không thay thế xác nhận của cơ quan có
 * thẩm quyền. Mọi kết quả luôn kèm rulesVersion để truy vết cơ sở pháp lý.
 */

/** Nhóm đối tượng theo Điều 76 Luật Nhà ở 2023 (rút gọn theo mã nội bộ). */
export type NoxhObjectGroupId =
  | "MERIT" // K1: người có công, thân nhân liệt sĩ
  | "POOR_RURAL" // K2,K3: hộ nghèo/cận nghèo nông thôn (gồm vùng thiên tai)
  | "POOR_URBAN" // K4: hộ nghèo/cận nghèo đô thị
  | "LOW_INCOME_URBAN" // K5: người thu nhập thấp tại đô thị
  | "WORKER" // K6: công nhân, người lao động trong/ngoài KCN
  | "ARMED_FORCES" // K7: lực lượng vũ trang, cơ yếu
  | "CIVIL_SERVANT" // K8: cán bộ, công chức, viên chức
  | "RETURNED_OFFICIAL_HOUSING" // K9: người đã trả lại nhà ở công vụ
  | "LAND_RECOVERED" // K10: bị thu hồi đất, giải tỏa chưa được bồi thường nhà/đất
  | "NONE"; // không thuộc nhóm được mua NOXH

export interface NoxhObjectGroup {
  id: NoxhObjectGroupId;
  /** Nhãn hiển thị cho người dùng. */
  label: string;
  /** Có được mua/thuê mua NOXH không. */
  eligibleForPurchase: boolean;
  /**
   * Có phải xét trần thu nhập Đ.30 k1 (15/25/30 hoặc 25/35/50) không.
   * Chỉ K5, K6, K8. K7 dùng Đ.67/mẫu BQP-BCA (requiresIncome=false).
   * K1–K4, K9, K10 miễn trần theo Đ.78 k1 đ.b.
   */
  requiresIncome: boolean;
  /** Ghi chú pháp lý ngắn (hiển thị/để chuyên gia lưu ý). */
  note?: string;
}

export const NOXH_OBJECT_GROUPS: Record<NoxhObjectGroupId, NoxhObjectGroup> = {
  MERIT: {
    id: "MERIT",
    label:
      "Người có công / anh hùng LLVT / thương binh / thân nhân liệt sĩ",
    eligibleForPurchase: true,
    requiresIncome: false,
    note: "Miễn trần thu nhập Đ.30 k1 — không cần Mẫu xác nhận thu nhập dân sự; dùng giấy chứng nhận NCC.",
  },
  POOR_RURAL: {
    id: "POOR_RURAL",
    label: "Hộ nghèo, cận nghèo khu vực nông thôn",
    eligibleForPurchase: true,
    requiresIncome: false,
  },
  POOR_URBAN: {
    id: "POOR_URBAN",
    label: "Hộ nghèo, cận nghèo khu vực đô thị",
    eligibleForPurchase: true,
    requiresIncome: false,
  },
  LOW_INCOME_URBAN: {
    id: "LOW_INCOME_URBAN",
    label: "Người thu nhập thấp tại khu vực đô thị",
    eligibleForPurchase: true,
    requiresIncome: true,
  },
  WORKER: {
    id: "WORKER",
    label: "Công nhân, người lao động (trong/ngoài khu công nghiệp)",
    eligibleForPurchase: true,
    requiresIncome: true,
  },
  ARMED_FORCES: {
    id: "ARMED_FORCES",
    label:
      "Sĩ quan, QNCN, công nhân quốc phòng, cán bộ/công chức quốc phòng, công an, cơ yếu (đương nhiệm)",
    eligibleForPurchase: true,
    // K7 Đ.76: không áp trần 25/35/50 — Đ.30 k4 NĐ 100 → Đ.67 (mức Đại tá),
    // mẫu biểu BQP/BCA; đơn vị xác nhận trạng thái công tác & nhà ở.
    requiresIncome: false,
    note: "Không dùng trần 25/35/50 triệu. Xác nhận thu nhập theo Điều 67 NĐ 100/2024 và mẫu đơn vị BQP/BCA. Anh hùng LLVT/thương binh/NCC chọn nhóm 'Người có công'.",
  },
  CIVIL_SERVANT: {
    id: "CIVIL_SERVANT",
    label: "Cán bộ, công chức, viên chức",
    eligibleForPurchase: true,
    requiresIncome: true,
  },
  RETURNED_OFFICIAL_HOUSING: {
    id: "RETURNED_OFFICIAL_HOUSING",
    label: "Người đã trả lại nhà ở công vụ",
    eligibleForPurchase: true,
    requiresIncome: false,
  },
  LAND_RECOVERED: {
    id: "LAND_RECOVERED",
    label: "Hộ bị thu hồi đất, giải tỏa chưa được bồi thường nhà/đất",
    eligibleForPurchase: true,
    requiresIncome: false,
    note: "Miễn trần thu nhập — nộp Quyết định thu hồi đất và xác nhận UBND thay Mẫu thu nhập dân sự.",
  },
  NONE: {
    id: "NONE",
    label: "Không thuộc các nhóm trên",
    eligibleForPurchase: false,
    requiresIncome: false,
  },
};

/** Ngưỡng thu nhập theo tình trạng hôn nhân (VND/tháng, thực nhận bình quân). */
export interface IncomeCeilings {
  /** Độc thân / chưa kết hôn. */
  single: number;
  /** Độc thân đang nuôi con dưới tuổi thành niên. */
  singleWithMinor: number;
  /** Đã kết hôn — tổng thu nhập hai vợ chồng. */
  married: number;
}

export interface NoxhRuleSet {
  /** Mã phiên bản để truy vết. */
  version: string;
  /** Ngày bắt đầu hiệu lực (ISO). */
  effectiveFrom: string;
  /** Danh sách văn bản pháp lý làm cơ sở. */
  legalBasis: string[];
  /** Trần thu nhập theo Đ.30 (áp dụng nhóm requiresIncome). */
  incomeCeilings: IncomeCeilings;
  /** Diện tích nhà ở bình quân tối thiểu (m² sàn/người) — Đ.29. */
  minAreaPerPersonSqm: number;
  /** Số tháng liền kề dùng để tính thu nhập bình quân. */
  incomeLookbackMonths: number;
  /**
   * Biên "sát trần": thu nhập trong khoảng (ceiling * (1 - margin), ceiling]
   * vẫn ĐẠT nhưng được đánh dấu cần lưu ý (dễ vượt khi xác minh 12 tháng).
   */
  incomeNearCeilingMargin: number;
}

/** Bản quy tắc hiện hành — NĐ 136/2026/NĐ-CP (hiệu lực 07/4/2026). */
export const NOXH_RULES_2026_04: NoxhRuleSet = {
  version: "2026-04-ND136",
  effectiveFrom: "2026-04-07",
  legalBasis: [
    "Luật Nhà ở 2023 (27/2023/QH15) — Điều 76, Điều 78",
    "Nghị định 100/2024/NĐ-CP — Điều 29, Điều 30",
    "Nghị định 261/2025/NĐ-CP",
    "Nghị định 54/2026/NĐ-CP",
    "Nghị định 136/2026/NĐ-CP (hiệu lực 07/4/2026)",
  ],
  incomeCeilings: {
    single: 25_000_000,
    singleWithMinor: 35_000_000,
    married: 50_000_000,
  },
  minAreaPerPersonSqm: 15,
  incomeLookbackMonths: 12,
  incomeNearCeilingMargin: 0.1,
};

/** Con trỏ tới bản quy tắc đang áp dụng. Đổi 1 dòng khi có nghị định mới. */
export const CURRENT_NOXH_RULES: NoxhRuleSet = NOXH_RULES_2026_04;
