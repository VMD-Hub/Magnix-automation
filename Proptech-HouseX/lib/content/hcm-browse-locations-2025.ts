/**
 * Khu vực lọc tin — TP.HCM mới (NQ 202/2025, NQ 1685/2025).
 * Sáp nhập Bình Dương + Bà Rịa-Vũng Tàu vào TP.HCM từ 01/7/2025.
 * 168 đơn vị cấp xã; dropdown dùng nhóm vùng + tên quận/huyện cũ (tương thích tin đăng).
 */

export type HcmBrowseZoneGroup = {
  id: string;
  label: string;
  units: readonly string[];
};

/** Tên tỉnh cũ — tin đăng có thể còn ghi trước sáp nhập. */
export const HCM_LEGACY_PROVINCE_ALIASES = [
  "Bình Dương",
  "Bà Rịa - Vũng Tàu",
] as const;

export const HCM_BROWSE_ZONE_GROUPS: readonly HcmBrowseZoneGroup[] = [
  {
    id: "legacy-quan",
    label: "Quận / thành phố cũ (tin đăng hiện có)",
    units: [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Bình Thạnh",
      "Gò Vấp",
      "Phú Nhuận",
      "Tân Bình",
      "Tân Phú",
      "Thủ Đức",
      "Nhà Bè",
      "Bình Chánh",
      "Hóc Môn",
      "Củ Chi",
      "Cần Giờ",
    ],
  },
  {
    id: "inner-new",
    label: "Nội thành (phường mới)",
    units: [
      "Phường Sài Gòn",
      "Phường Bến Thành",
      "Phường Tân Định",
      "Phường Cầu Ông Lãnh",
      "Phường Bàn Cơ",
      "Phường Nhiêu Lộc",
      "Phường Chợ Lớn",
      "Phường Bình Thạnh",
      "Phường Gia Định",
      "Phường Gò Vấp",
      "Phường Tân Sơn Nhất",
      "Phường Tân Thuận",
    ],
  },
  {
    id: "east-thu-duc",
    label: "Khu Đông (Thủ Đức)",
    units: [
      "Phường Thủ Đức",
      "Phường Hiệp Bình",
      "Phường Linh Xuân",
      "Phường Long Bình",
      "Phường Long Phước",
      "Phường Cát Lái",
      "Phường Bình Trưng",
      "Phường Tăng Nhơn Phú",
    ],
  },
  {
    id: "west-south",
    label: "Tây & Nam Sài Gòn",
    units: [
      "Phường Bình Tân",
      "Phường An Lạc",
      "Phường Tân Tạo",
      "Phường Bình Chánh",
      "Phường Nhà Bè",
      "Xã Cần Giờ",
      "Xã Hóc Môn",
      "Xã Củ Chi",
      "Phường Vĩnh Lộc",
    ],
  },
  {
    id: "binh-duong",
    label: "Vùng Bình Dương (TP.HCM)",
    units: [
      "Thủ Dầu Một",
      "Phường Thủ Dầu Một",
      "Dĩ An",
      "Phường Dĩ An",
      "Thuận An",
      "Phường Thuận An",
      "Phường Thuận Giao",
      "Tân Uyên",
      "Phường Tân Uyên",
      "Bến Cát",
      "Phường Bến Cát",
      "Phường Lái Thiêu",
      "Phường Bình Dương",
      "Phường Vĩnh Tân",
    ],
  },
  {
    id: "brvt",
    label: "Vùng Bà Rịa – Vũng Tàu (TP.HCM)",
    units: [
      "Vũng Tàu",
      "Phường Vũng Tàu",
      "Bà Rịa",
      "Phường Bà Rịa",
      "Phường Tam Thắng",
      "Phường Rạch Dừa",
      "Phường Phước Thắng",
      "Phường Long Hương",
      "Phường Phú Mỹ",
      "Phường Tân Thành",
      "Phường Tam Long",
      "Xã Long Sơn",
      "Xã Hòa Hiệp",
      "Xã Bình Châu",
      "Xã Thạnh An",
    ],
  },
  {
    id: "con-dao",
    label: "Côn Đảo & hải đảo",
    units: ["Đặc khu Côn Đảo", "Côn Đảo", "Phường Thới Hòa"],
  },
] as const;

/** Danh sách phẳng — dedupe, dùng resolve district. */
export function hcmBrowseDistrictFlatList(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of HCM_BROWSE_ZONE_GROUPS) {
    for (const unit of group.units) {
      if (!seen.has(unit)) {
        seen.add(unit);
        out.push(unit);
      }
    }
  }
  return out;
}

export function hcmBrowseDistrictGroups(): HcmBrowseZoneGroup[] {
  return HCM_BROWSE_ZONE_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    units: [...g.units],
  }));
}

/** TP.HCM mới gồm cả tên tỉnh cũ (tin chưa cập nhật). */
export function provincesMatchingHcmMegaCity(): string[] {
  return ["TP. Hồ Chí Minh", ...HCM_LEGACY_PROVINCE_ALIASES];
}

export function isHcmMegaCityProvince(province: string | undefined): boolean {
  if (!province) return false;
  return (provincesMatchingHcmMegaCity() as readonly string[]).includes(province);
}
