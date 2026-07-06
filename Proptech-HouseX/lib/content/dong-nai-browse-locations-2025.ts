/**
 * Khu vực lọc tin — TP. Đồng Nai (NQ 202/2025).
 * Sáp nhập Đồng Nai + Bình Phước; nâng cấp thành phố trực thuộc trung ương từ 01/7/2025.
 */

export type BrowseZoneGroup = {
  id: string;
  label: string;
  units: readonly string[];
};

/** Tên chính thức mới — dùng làm giá trị lọc canonical trên browse UI. */
export const DONG_NAI_CENTRAL_CITY = "TP. Đồng Nai" as const;

/** Tên tỉnh cũ — tin đăng DB/catalog có thể còn ghi trước sáp nhập. */
export const DONG_NAI_LEGACY_PROVINCE_ALIASES = ["Đồng Nai", "Bình Phước"] as const;

export const DONG_NAI_BROWSE_ZONE_GROUPS: readonly BrowseZoneGroup[] = [
  {
    id: "dong-nai-core",
    label: "Vùng Đồng Nai cũ",
    units: [
      "Biên Hòa",
      "Long Thành",
      "Nhơn Trạch",
      "Trảng Bom",
      "Vĩnh Cửu",
      "Long Khánh",
      "Xuân Lộc",
      "Thống Nhất",
      "Cẩm Mỹ",
      "Định Quán",
      "Tân Phú",
    ],
  },
  {
    id: "binh-phuoc",
    label: "Vùng Bình Phước (TP. Đồng Nai)",
    units: [
      "Đồng Xoài",
      "Bù Đăng",
      "Chơn Thành",
      "Lộc Ninh",
      "Bình Long",
      "Phước Long",
      "Hớn Quản",
      "Đồng Phú",
      "Bù Đốp",
      "Phú Riềng",
    ],
  },
] as const;

export function dongNaiBrowseDistrictFlatList(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of DONG_NAI_BROWSE_ZONE_GROUPS) {
    for (const unit of group.units) {
      if (!seen.has(unit)) {
        seen.add(unit);
        out.push(unit);
      }
    }
  }
  return out;
}

export function dongNaiBrowseDistrictGroups(): BrowseZoneGroup[] {
  return DONG_NAI_BROWSE_ZONE_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    units: [...g.units],
  }));
}

export function provincesMatchingDongNaiMegaCity(): string[] {
  return [DONG_NAI_CENTRAL_CITY, ...DONG_NAI_LEGACY_PROVINCE_ALIASES];
}

export function isDongNaiMegaCityProvince(province: string | undefined): boolean {
  if (!province) return false;
  return (provincesMatchingDongNaiMegaCity() as readonly string[]).includes(province);
}
