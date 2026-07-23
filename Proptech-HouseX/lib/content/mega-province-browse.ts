import {
  CAN_THO_CENTRAL_CITY,
  isCanThoMegaCityProvince,
  provincesMatchingCanThoMegaCity,
} from "@/lib/content/can-tho-browse-locations-2025";
import {
  DONG_NAI_CENTRAL_CITY,
  isDongNaiMegaCityProvince,
  provincesMatchingDongNaiMegaCity,
} from "@/lib/content/dong-nai-browse-locations-2025";
import {
  isHcmMegaCityProvince,
  provincesMatchingHcmMegaCity,
} from "@/lib/content/hcm-browse-locations-2025";
import {
  isTayNinhMegaProvince,
  provincesMatchingTayNinhMegaProvince,
} from "@/lib/content/tay-ninh-browse-locations-2025";

/** Tên tỉnh canonical trong registry → danh sách province DB/catalog khớp lọc. */
export function provincesMatchingBrowseFilter(
  canonicalProvince: string,
): string[] | undefined {
  switch (canonicalProvince) {
    case "TP. Hồ Chí Minh":
      return provincesMatchingHcmMegaCity();
    case DONG_NAI_CENTRAL_CITY:
      return provincesMatchingDongNaiMegaCity();
    case CAN_THO_CENTRAL_CITY:
    case "Cần Thơ":
      return provincesMatchingCanThoMegaCity();
    case "Tây Ninh":
      return provincesMatchingTayNinhMegaProvince();
    default:
      return undefined;
  }
}

export function isMegaProvinceBrowseEntry(province: string | undefined): boolean {
  return (
    isHcmMegaCityProvince(province) ||
    isDongNaiMegaCityProvince(province) ||
    isCanThoMegaCityProvince(province) ||
    isTayNinhMegaProvince(province)
  );
}

/** Gom tin catalog có tỉnh cũ vào entry mới trong registry. */
export function canonicalBrowseProvinceName(province: string): string {
  if (isHcmMegaCityProvince(province)) return "TP. Hồ Chí Minh";
  if (isDongNaiMegaCityProvince(province)) return DONG_NAI_CENTRAL_CITY;
  if (isCanThoMegaCityProvince(province)) return CAN_THO_CENTRAL_CITY;
  if (isTayNinhMegaProvince(province)) return "Tây Ninh";
  return province;
}

export function listingMatchesBrowseProvince(
  listingProvince: string,
  filterProvince: string,
): boolean {
  const expanded = provincesMatchingBrowseFilter(filterProvince);
  if (expanded) return expanded.includes(listingProvince);
  return listingProvince === filterProvince;
}
