/**
 * Khu vực lọc tin — Tỉnh Tây Ninh mới (NQ 202/2025).
 * Sáp nhập Long An + Tây Ninh (cũ) từ 01/7/2025.
 */

export type BrowseZoneGroup = {
  id: string;
  label: string;
  units: readonly string[];
};

export const TAY_NINH_LEGACY_PROVINCE_ALIASES = ["Long An"] as const;

export const TAY_NINH_BROWSE_ZONE_GROUPS: readonly BrowseZoneGroup[] = [
  {
    id: "long-an",
    label: "Vùng Long An cũ",
    units: [
      "Tân An",
      "Đức Hòa",
      "Bến Lức",
      "Cần Giuộc",
      "Mỹ Hạnh Nam",
      "Đức Huệ",
      "Thủ Thừa",
      "Châu Thành",
      "Tân Trụ",
      "Cần Đước",
      "Vĩnh Hưng",
      "Tân Hưng",
    ],
  },
  {
    id: "tay-ninh-old",
    label: "Vùng Tây Ninh cũ",
    units: [
      "Trảng Bàng",
      "Hòa Thành",
      "Tây Ninh",
      "Gò Dầu",
      "Dương Minh Châu",
      "Bến Cầu",
      "Châu Thành",
      "Dầu Tiếng",
    ],
  },
] as const;

export function tayNinhBrowseDistrictFlatList(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of TAY_NINH_BROWSE_ZONE_GROUPS) {
    for (const unit of group.units) {
      if (!seen.has(unit)) {
        seen.add(unit);
        out.push(unit);
      }
    }
  }
  return out;
}

export function tayNinhBrowseDistrictGroups(): BrowseZoneGroup[] {
  return TAY_NINH_BROWSE_ZONE_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    units: [...g.units],
  }));
}

export function provincesMatchingTayNinhMegaProvince(): string[] {
  return ["Tây Ninh", ...TAY_NINH_LEGACY_PROVINCE_ALIASES];
}

export function isTayNinhMegaProvince(province: string | undefined): boolean {
  if (!province) return false;
  return (provincesMatchingTayNinhMegaProvince() as readonly string[]).includes(
    province,
  );
}
