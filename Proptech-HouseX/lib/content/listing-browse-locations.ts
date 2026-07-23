import { listCatalogSaleListingCards } from "@/lib/preview/catalog-listings";
import {
  canThoBrowseDistrictFlatList,
  canThoBrowseDistrictGroups,
  CAN_THO_CENTRAL_CITY,
  CAN_THO_LEGACY_PROVINCE_ALIASES,
  isCanThoMegaCityProvince,
  provincesMatchingCanThoMegaCity,
} from "@/lib/content/can-tho-browse-locations-2025";
import {
  DONG_NAI_CENTRAL_CITY,
  DONG_NAI_LEGACY_PROVINCE_ALIASES,
  dongNaiBrowseDistrictFlatList,
  dongNaiBrowseDistrictGroups,
  isDongNaiMegaCityProvince,
  provincesMatchingDongNaiMegaCity,
} from "@/lib/content/dong-nai-browse-locations-2025";
import {
  hcmBrowseDistrictFlatList,
  hcmBrowseDistrictGroups,
  HCM_LEGACY_PROVINCE_ALIASES,
  isHcmMegaCityProvince,
  provincesMatchingHcmMegaCity,
} from "@/lib/content/hcm-browse-locations-2025";
import { canonicalBrowseProvinceName } from "@/lib/content/mega-province-browse";
import {
  isTayNinhMegaProvince,
  provincesMatchingTayNinhMegaProvince,
  TAY_NINH_LEGACY_PROVINCE_ALIASES,
  tayNinhBrowseDistrictFlatList,
  tayNinhBrowseDistrictGroups,
} from "@/lib/content/tay-ninh-browse-locations-2025";

/** Nhóm quận/huyện theo vùng — dùng optgroup trên UI. */
export type ListingBrowseDistrictGroup = {
  id: string;
  label: string;
  districts: readonly string[];
};

/** Tỉnh/thành HouseX mở rộng — đồng bộ với listing.province trong DB/catalog. */
export type ListingBrowseProvince = {
  /** Query ?province= */
  slug: string;
  label: string;
  /** Giá trị khớp listing.province */
  province: string;
  districts: string[];
  /** Nhóm khu vực (TP.HCM mới) — ưu tiên hiển thị optgroup. */
  districtGroups?: ListingBrowseDistrictGroup[];
};
/** Registry cố định — bổ sung thêm quận/huyện từ catalog khi có tin mới. */
export const LISTING_BROWSE_PROVINCES: ListingBrowseProvince[] = [
  {
    slug: "tp-hcm",
    label: "TP. Hồ Chí Minh",
    province: "TP. Hồ Chí Minh",
    districts: hcmBrowseDistrictFlatList(),
    districtGroups: hcmBrowseDistrictGroups().map((g) => ({
      id: g.id,
      label: g.label,
      districts: g.units,
    })),
  },
  {
    slug: "dong-nai",
    label: DONG_NAI_CENTRAL_CITY,
    province: DONG_NAI_CENTRAL_CITY,
    districts: dongNaiBrowseDistrictFlatList(),
    districtGroups: dongNaiBrowseDistrictGroups().map((g) => ({
      id: g.id,
      label: g.label,
      districts: g.units,
    })),
  },
  {
    slug: "can-tho",
    label: CAN_THO_CENTRAL_CITY,
    province: CAN_THO_CENTRAL_CITY,
    districts: canThoBrowseDistrictFlatList(),
    districtGroups: canThoBrowseDistrictGroups().map((g) => ({
      id: g.id,
      label: g.label,
      districts: g.units,
    })),
  },
  {
    slug: "tay-ninh",
    label: "Tây Ninh",
    province: "Tây Ninh",
    districts: tayNinhBrowseDistrictFlatList(),
    districtGroups: tayNinhBrowseDistrictGroups().map((g) => ({
      id: g.id,
      label: g.label,
      districts: g.units,
    })),
  },
  {
    slug: "binh-thuan",
    label: "Bình Thuận",
    province: "Bình Thuận",
    districts: ["Phan Thiết", "La Gi", "Hàm Thuận Nam", "Bắc Bình"],
  },
];

export type ListingBrowseLocationParams = {
  province?: string;
  district?: string;
};

export type ResolvedListingBrowseLocation = {
  provinceSlug?: string;
  province?: string;
  provinceLabel?: string;
  district?: string;
};

function cloneProvinces(): ListingBrowseProvince[] {
  return LISTING_BROWSE_PROVINCES.map((p) => ({
    ...p,
    districts: [...p.districts],
    districtGroups: p.districtGroups?.map((g) => ({
      ...g,
      districts: [...g.districts],
    })),
  }));
}

/** Gắn thêm quận/huyện từ tin catalog go-live — tránh sót khu vực mới. */
export function mergeCatalogLocations(
  provinces: ListingBrowseProvince[],
): ListingBrowseProvince[] {
  const byProvince = new Map(provinces.map((p) => [p.province, p]));

  for (const card of listCatalogSaleListingCards()) {
    if (!card.province?.trim() || !card.district?.trim()) continue;
    const canonical = canonicalBrowseProvinceName(card.province);
    let entry = byProvince.get(canonical);
    if (!entry) {
      entry = {
        slug: provinceToSlug(canonical) ?? slugifyProvince(canonical),
        label: canonical,
        province: canonical,
        districts: [],
      };
      byProvince.set(canonical, entry);
      provinces.push(entry);
    }
    if (!entry.districts.includes(card.district)) {
      entry.districts.push(card.district);
    }
  }

  for (const p of provinces) {
    p.districts.sort((a, b) => a.localeCompare(b, "vi"));
  }

  return provinces;
}

export function getListingBrowseProvinces(): ListingBrowseProvince[] {
  return mergeCatalogLocations(cloneProvinces());
}

/** Slug cũ → entry mới sau sáp nhập đơn vị hành chính. */
const LEGACY_PROVINCE_SLUG_ALIASES: Record<string, string> = {
  "long-an": "tay-ninh",
  "binh-phuoc": "dong-nai",
};

export function findProvinceBySlug(slug: string): ListingBrowseProvince | undefined {
  const resolved = LEGACY_PROVINCE_SLUG_ALIASES[slug] ?? slug;
  return getListingBrowseProvinces().find((p) => p.slug === resolved);
}

export function findProvinceByName(name: string): ListingBrowseProvince | undefined {
  if (isHcmMegaCityProvince(name)) {
    return getListingBrowseProvinces().find((p) => p.slug === "tp-hcm");
  }
  if (isCanThoMegaCityProvince(name)) {
    return getListingBrowseProvinces().find((p) => p.slug === "can-tho");
  }
  if (isTayNinhMegaProvince(name)) {
    return getListingBrowseProvinces().find((p) => p.slug === "tay-ninh");
  }
  if (isDongNaiMegaCityProvince(name)) {
    return getListingBrowseProvinces().find((p) => p.slug === "dong-nai");
  }
  return getListingBrowseProvinces().find((p) => p.province === name);
}

export function findProvinceByDistrict(district: string): ListingBrowseProvince | undefined {
  return getListingBrowseProvinces().find((p) => p.districts.includes(district));
}

function slugifyProvince(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function provinceToSlug(province: string): string | undefined {
  const canonical = canonicalBrowseProvinceName(province);
  const found = LISTING_BROWSE_PROVINCES.find((p) => p.province === canonical);
  return found?.slug ?? slugifyProvince(canonical);
}

export function provinceFromSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return findProvinceBySlug(slug)?.province;
}

/** Chuẩn hoá query ?province=&district= — hỗ trợ URL cũ chỉ có district. */
export function resolveListingBrowseLocation(
  params: ListingBrowseLocationParams,
): ResolvedListingBrowseLocation {
  const fromSlug = params.province
    ? findProvinceBySlug(params.province)
    : undefined;

  if (fromSlug) {
    return {
      provinceSlug: fromSlug.slug,
      province: fromSlug.province,
      provinceLabel: fromSlug.label,
      district: params.district,
    };
  }

  if (params.district) {
    const owner = findProvinceByDistrict(params.district);
    if (owner) {
      return {
        provinceSlug: owner.slug,
        province: owner.province,
        provinceLabel: owner.label,
        district: params.district,
      };
    }
    return { district: params.district };
  }

  return {};
}

export function formatListingBrowseLocationLabel(
  loc: ResolvedListingBrowseLocation,
): string | undefined {
  if (loc.district && loc.provinceLabel) {
    return `${loc.district}, ${loc.provinceLabel}`;
  }
  if (loc.district) return loc.district;
  if (loc.provinceLabel) return loc.provinceLabel;
  return undefined;
}

export function listingBrowseRegionSummary(): string {
  return getListingBrowseProvinces()
    .map((p) => p.label.replace(/^TP\. /, "TP."))
    .join(", ");
}

export {
  CAN_THO_LEGACY_PROVINCE_ALIASES,
  DONG_NAI_CENTRAL_CITY,
  DONG_NAI_LEGACY_PROVINCE_ALIASES,
  HCM_LEGACY_PROVINCE_ALIASES,
  TAY_NINH_LEGACY_PROVINCE_ALIASES,
  isCanThoMegaCityProvince,
  isDongNaiMegaCityProvince,
  isHcmMegaCityProvince,
  isTayNinhMegaProvince,
  provincesMatchingCanThoMegaCity,
  provincesMatchingDongNaiMegaCity,
  provincesMatchingHcmMegaCity,
  provincesMatchingTayNinhMegaProvince,
};
