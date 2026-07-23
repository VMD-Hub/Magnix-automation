/**
 * Khu vực lọc tin — TP. Cần Thơ mới (NQ 202/2025).
 * Sáp nhập Cần Thơ + Hậu Giang + Sóc Trăng từ 01/7/2025.
 */

export type BrowseZoneGroup = {
  id: string;
  label: string;
  units: readonly string[];
};

export const CAN_THO_LEGACY_PROVINCE_ALIASES = ["Hậu Giang", "Sóc Trăng"] as const;

/** Canonical display — TP trực thuộc TW */
export const CAN_THO_CENTRAL_CITY = "TP. Cần Thơ" as const;

export const CAN_THO_BROWSE_ZONE_GROUPS: readonly BrowseZoneGroup[] = [
  {
    id: "can-tho-core",
    label: "TP. Cần Thơ cũ",
    units: [
      "Ninh Kiều",
      "Cái Răng",
      "Ô Môn",
      "Thốt Nốt",
      "Bình Thủy",
      "Cờ Đỏ",
      "Phong Điền",
      "Thới Lai",
    ],
  },
  {
    id: "hau-giang",
    label: "Vùng Hậu Giang (TP. Cần Thơ)",
    units: [
      "Vị Thanh",
      "Ngã Bảy",
      "Long Mỹ",
      "Châu Thành",
      "Châu Thành A",
      "Phụng Hiệp",
      "Vị Thủy",
    ],
  },
  {
    id: "soc-trang",
    label: "Vùng Sóc Trăng (TP. Cần Thơ)",
    units: [
      "Sóc Trăng",
      "Vĩnh Châu",
      "Ngã Năm",
      "Mỹ Tú",
      "Mỹ Xuyên",
      "Kế Sách",
      "Long Phú",
      "Cù lao Dung",
      "Thạnh Trị",
    ],
  },
] as const;

export function canThoBrowseDistrictFlatList(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of CAN_THO_BROWSE_ZONE_GROUPS) {
    for (const unit of group.units) {
      if (!seen.has(unit)) {
        seen.add(unit);
        out.push(unit);
      }
    }
  }
  return out;
}

export function canThoBrowseDistrictGroups(): BrowseZoneGroup[] {
  return CAN_THO_BROWSE_ZONE_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    units: [...g.units],
  }));
}

export function provincesMatchingCanThoMegaCity(): string[] {
  return [CAN_THO_CENTRAL_CITY, "Cần Thơ", ...CAN_THO_LEGACY_PROVINCE_ALIASES];
}

export function isCanThoMegaCityProvince(province: string | undefined): boolean {
  if (!province) return false;
  return (provincesMatchingCanThoMegaCity() as readonly string[]).includes(province);
}
