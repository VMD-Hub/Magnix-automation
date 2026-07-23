/**
 * Registry địa giới NOXH P0 — NQ 202/2025/QH15 (hiệu lực sắp xếp 01/7/2025).
 *
 * Canonical = tên mới (URL hub, H1, schema).
 * aliasesOld = tên cũ còn search / tin đăng legacy / địa chỉ song song.
 *
 * Đồng bộ pattern với:
 * - lib/content/hcm-browse-locations-2025.ts
 * - lib/content/dong-nai-browse-locations-2025.ts
 * - lib/content/can-tho-browse-locations-2025.ts
 * - lib/content/tay-ninh-browse-locations-2025.ts
 */

export type NoxhSalesRegion = "south" | "central" | "north";

/** Prisma `SalesRegion` enum — cùng nghĩa, UPPERCASE. */
export type PrismaSalesRegion = "SOUTH" | "CENTRAL" | "NORTH";

export function toPrismaSalesRegion(
  region: NoxhSalesRegion | null | undefined,
): PrismaSalesRegion | null {
  if (!region) return null;
  if (region === "south") return "SOUTH";
  if (region === "central") return "CENTRAL";
  return "NORTH";
}

/** Suy ra SalesRegion Prisma từ chuỗi province DB (registry P0). */
export function inferPrismaSalesRegionFromProvince(
  provinceRaw: string | null | undefined,
): PrismaSalesRegion | null {
  const entry = resolveNoxhProvinceCanonical(provinceRaw);
  return toPrismaSalesRegion(entry?.salesRegion);
}

/**
 * Kế hoạch backfill ops: chỉ set khi null (hoặc --force khi khác suy luận).
 * Province ngoài registry → skip (không xóa salesRegion hiện có).
 */
export function planProjectSalesRegionBackfill(
  province: string,
  current: PrismaSalesRegion | null,
  opts?: { force?: boolean },
):
  | { action: "set"; next: PrismaSalesRegion }
  | { action: "skip"; reason: "already_ok" | "no_infer" | "keep_existing" } {
  const inferred = inferPrismaSalesRegionFromProvince(province);
  if (!inferred) {
    return { action: "skip", reason: "no_infer" };
  }
  if (current === inferred) {
    return { action: "skip", reason: "already_ok" };
  }
  if (current == null) {
    return { action: "set", next: inferred };
  }
  if (opts?.force) {
    return { action: "set", next: inferred };
  }
  return { action: "skip", reason: "keep_existing" };
}

export type NoxhProvinceEntry = {
  /** Segment URL hub: /du-an/nha-o-xa-hoi/{slug} */
  slug: string;
  /** Tên hiển thị canonical (mới) */
  nameNew: string;
  /** Biến thể tên canonical thường gặp trong DB / copy */
  nameNewVariants: readonly string[];
  /** Tên tỉnh/thành cũ — SEO alias + địa chỉ song song + match tin legacy */
  aliasesOld: readonly string[];
  /** Biến thể viết tắt / không dấu / phổ thể alias cũ */
  aliasesOldVariants?: readonly string[];
  /** Vùng bán nội bộ — không render public */
  salesRegion: NoxhSalesRegion;
  /**
   * true = được phép mở hub tỉnh public.
   * P0.1 = true; P0.2 = false đến khi đủ inventory.
   */
  hubEnabled: boolean;
  /** Nguồn pháp lý sáp nhập (ghi chú biên tập) */
  legalNote: string;
  /** Cụm search SEO gợi ý (không phải URL) */
  searchKeys: readonly string[];
};

/** Prefix catalog NOXH */
export const NOXH_PROVINCE_HUB_BASE = "/du-an/nha-o-xa-hoi" as const;

/**
 * P0 — miền Nam / ĐBSCL sau sắp xếp.
 * P0.1 hubEnabled: HCM, Đồng Nai, Cần Thơ, Tây Ninh.
 * P0.2 hub Đồng Tháp + An Giang bật khi có inventory.
 * P0.5 hub Bắc: Hà Nội; hub Trung: Đà Nẵng + Khánh Hòa (inventory skeleton).
 */
export const NOXH_PROVINCE_REGISTRY_P0 = [
  {
    slug: "tp-ho-chi-minh",
    nameNew: "TP. Hồ Chí Minh",
    nameNewVariants: [
      "Thành phố Hồ Chí Minh",
      "TP.HCM",
      "TPHCM",
      "Hồ Chí Minh",
    ],
    aliasesOld: ["Bình Dương", "Bà Rịa - Vũng Tàu"],
    aliasesOldVariants: [
      "Ba Ria - Vung Tau",
      "Bà Rịa – Vũng Tàu",
      "BR-VT",
      "Vũng Tàu",
      "Bà Rịa",
      "Binh Duong",
    ],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 + NQ 1685/2025 — sáp nhập Bình Dương và Bà Rịa-Vũng Tàu vào TP.HCM (từ 01/7/2025).",
    searchKeys: [
      "nhà ở xã hội TP.HCM",
      "nhà ở xã hội Hồ Chí Minh",
      "NOXH TP.HCM",
      "nhà ở xã hội Bình Dương",
      "NOXH Bình Dương",
      "nhà ở xã hội Vũng Tàu",
      "nhà ở xã hội Bà Rịa",
      "NOXH Bà Rịa Vũng Tàu",
    ],
  },
  {
    slug: "dong-nai",
    nameNew: "TP. Đồng Nai",
    nameNewVariants: ["Đồng Nai", "Thành phố Đồng Nai"],
    aliasesOld: ["Đồng Nai", "Bình Phước"],
    aliasesOldVariants: ["Dong Nai", "Binh Phuoc"],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Đồng Nai + Bình Phước thành TP. Đồng Nai (từ 01/7/2025). Alias \"Đồng Nai\" giữ cho tin/search cũ.",
    searchKeys: [
      "nhà ở xã hội Đồng Nai",
      "nhà ở xã hội TP. Đồng Nai",
      "NOXH Đồng Nai",
      "nhà ở xã hội Bình Phước",
      "NOXH Bình Phước",
      "NOXH Nhơn Trạch",
      "NOXH Long Thành",
    ],
  },
  {
    slug: "can-tho",
    nameNew: "Cần Thơ",
    nameNewVariants: ["TP. Cần Thơ", "Thành phố Cần Thơ"],
    aliasesOld: ["Hậu Giang", "Sóc Trăng"],
    aliasesOldVariants: ["Hau Giang", "Soc Trang"],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Cần Thơ + Hậu Giang + Sóc Trăng thành TP. Cần Thơ mới (từ 01/7/2025).",
    searchKeys: [
      "nhà ở xã hội Cần Thơ",
      "NOXH Cần Thơ",
      "nhà ở xã hội Hậu Giang",
      "nhà ở xã hội Sóc Trăng",
      "NOXH Nam Long Cần Thơ",
    ],
  },
  {
    slug: "tay-ninh",
    nameNew: "Tây Ninh",
    nameNewVariants: ["Tỉnh Tây Ninh"],
    aliasesOld: ["Long An"],
    aliasesOldVariants: ["Long An cũ", "LongAn"],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Tây Ninh + Long An thành tỉnh Tây Ninh mới (từ 01/7/2025). Query \"NOXH Long An\" trỏ alias về hub này.",
    searchKeys: [
      "nhà ở xã hội Tây Ninh",
      "NOXH Tây Ninh",
      "nhà ở xã hội Long An",
      "NOXH Long An",
      "NOXH Đức Hòa",
      "NOXH Bến Lức",
      "NOXH Cần Giuộc",
    ],
  },
  {
    slug: "dong-thap",
    nameNew: "Đồng Tháp",
    nameNewVariants: ["Tỉnh Đồng Tháp"],
    aliasesOld: ["Tiền Giang"],
    aliasesOldVariants: ["Tien Giang", "Đồng Tháp cũ", "Mỹ Tho"],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Tiền Giang + Đồng Tháp thành tỉnh Đồng Tháp mới. Hub P0.2 bật với inventory NOXH Mỹ Tho / Đồng Tháp (Phase 5 lite).",
    searchKeys: [
      "nhà ở xã hội Đồng Tháp",
      "NOXH Đồng Tháp",
      "nhà ở xã hội Tiền Giang",
      "NOXH Tiền Giang",
      "NOXH Mỹ Tho",
      "Rivera Garden Mỹ Tho",
      "NOXH HQC Mỹ Tho",
      "NOXH Gò Công",
    ],
  },
  {
    slug: "an-giang",
    nameNew: "An Giang",
    nameNewVariants: ["Tỉnh An Giang"],
    aliasesOld: ["Kiên Giang"],
    aliasesOldVariants: [
      "Kien Giang",
      "An Giang cũ",
      "Rạch Giá",
      "Phú Quốc",
    ],
    salesRegion: "south",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Kiên Giang + An Giang thành tỉnh An Giang mới. Hub P0.2 bật với inventory NOXH Rạch Giá / Long Xuyên / Phú Quốc.",
    searchKeys: [
      "nhà ở xã hội An Giang",
      "NOXH An Giang",
      "nhà ở xã hội Kiên Giang",
      "NOXH Kiên Giang",
      "NOXH Rạch Giá",
      "NOXH Long Xuyên",
      "NOXH Phú Quốc",
      "NOXH CIC Tây Bắc",
    ],
  },
  {
    slug: "ha-noi",
    nameNew: "Hà Nội",
    nameNewVariants: ["Thành phố Hà Nội", "TP. Hà Nội", "Ha Noi"],
    aliasesOld: [],
    aliasesOldVariants: ["thủ đô", "Thu do"],
    salesRegion: "north",
    hubEnabled: true,
    legalNote:
      "Hub Bắc P0.5 — inventory skeleton 17 dự án NOXH từ danh sách nội bộ House X (Phase 5 lite). Enrich từng dự án khi có nguồn CĐT / Sở.",
    searchKeys: [
      "nhà ở xã hội Hà Nội",
      "NOXH Hà Nội",
      "nhà ở xã hội thủ đô",
      "NOXH Hoàng Mai",
      "NOXH Nam Từ Liêm",
      "NOXH Long Biên",
      "NOXH Thanh Trì",
      "NOXH Mê Linh",
    ],
  },
  {
    slug: "da-nang",
    nameNew: "Đà Nẵng",
    nameNewVariants: ["Thành phố Đà Nẵng", "TP. Đà Nẵng", "Da Nang"],
    aliasesOld: [],
    aliasesOldVariants: ["Danang"],
    salesRegion: "central",
    hubEnabled: true,
    legalNote:
      "Hub Trung P0.5 — inventory skeleton NOXH Đà Nẵng từ danh sách nội bộ House X. Enrich từng dự án khi có nguồn CĐT / Sở XD Đà Nẵng.",
    searchKeys: [
      "nhà ở xã hội Đà Nẵng",
      "NOXH Đà Nẵng",
      "NOXH Sơn Trà",
      "NOXH Cẩm Lệ",
      "NOXH Liên Chiểu",
      "NOXH Ngũ Hành Sơn",
      "NOXH Nam Cầu Cẩm Lệ",
    ],
  },
  {
    slug: "khanh-hoa",
    nameNew: "Khánh Hòa",
    nameNewVariants: ["Tỉnh Khánh Hòa", "Khanh Hoa"],
    aliasesOld: ["Ninh Thuận"],
    aliasesOldVariants: [
      "Ninh Thuan",
      "Nha Trang",
      "Cam Ranh",
      "Diên Khánh",
      "Dien Khanh",
      "Phan Rang",
      "Phan Rang - Tháp Chàm",
    ],
    salesRegion: "central",
    hubEnabled: true,
    legalNote:
      "NQ 202/2025 — sáp nhập Ninh Thuận vào Khánh Hòa. Hub P0.5 Trung bật với inventory NOXH Nha Trang / Cam Ranh / Diên Khánh (+ Ninh Thuận cũ).",
    searchKeys: [
      "nhà ở xã hội Khánh Hòa",
      "NOXH Khánh Hòa",
      "nhà ở xã hội Nha Trang",
      "NOXH Nha Trang",
      "NOXH Cam Ranh",
      "Happy Home Cam Ranh",
      "NOXH Ninh Thuận",
      "NOXH Diên Khánh",
    ],
  },
] as const satisfies readonly NoxhProvinceEntry[];

export type NoxhProvinceSlug = (typeof NOXH_PROVINCE_REGISTRY_P0)[number]["slug"];

/** Bản JSON-serializable (export docs / admin). */
export const NOXH_PROVINCE_REGISTRY_P0_JSON = NOXH_PROVINCE_REGISTRY_P0.map((e) => ({
  ...e,
  nameNewVariants: [...e.nameNewVariants],
  aliasesOld: [...e.aliasesOld],
  aliasesOldVariants: e.aliasesOldVariants ? [...e.aliasesOldVariants] : [],
  searchKeys: [...e.searchKeys],
}));

function normalizeGeoToken(raw: string): string {
  return raw
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/–|—/g, "-")
    .replace(/\./g, "");
}

function entryMatchTokens(entry: NoxhProvinceEntry): string[] {
  const tokens = [
    entry.nameNew,
    ...entry.nameNewVariants,
    ...entry.aliasesOld,
    ...(entry.aliasesOldVariants ?? []),
  ];
  return tokens.map(normalizeGeoToken);
}

export function getNoxhProvinceBySlug(
  slug: string,
): (typeof NOXH_PROVINCE_REGISTRY_P0)[number] | undefined {
  return NOXH_PROVINCE_REGISTRY_P0.find((e) => e.slug === slug);
}

/** Chỉ hub được phép public. */
export function listNoxhProvinceHubsEnabled() {
  return NOXH_PROVINCE_REGISTRY_P0.filter((e) => e.hubEnabled);
}

export function noxhProvinceHubPath(slug: string): string {
  return `${NOXH_PROVINCE_HUB_BASE}/${slug}`;
}

/**
 * Resolve chuỗi province từ DB/form → entry canonical.
 * Ưu tiên khớp nameNew / variants, rồi aliasesOld.
 */
export function resolveNoxhProvinceCanonical(
  raw: string | null | undefined,
): (typeof NOXH_PROVINCE_REGISTRY_P0)[number] | undefined {
  if (!raw?.trim()) return undefined;
  const needle = normalizeGeoToken(raw);
  for (const entry of NOXH_PROVINCE_REGISTRY_P0) {
    if (entryMatchTokens(entry).includes(needle)) return entry;
  }
  return undefined;
}

/** Mọi nhãn province (mới + cũ) dùng để filter DB/listProjects. */
export function provincesMatchingNoxhHub(slug: string): string[] {
  const entry = getNoxhProvinceBySlug(slug);
  if (!entry) return [];
  return [
    entry.nameNew,
    ...entry.nameNewVariants,
    ...entry.aliasesOld,
    ...(entry.aliasesOldVariants ?? []),
  ];
}

/**
 * Alias slug cũ → hub mới (308).
 * Ví dụ: binh-duong → tp-ho-chi-minh; long-an → tay-ninh.
 */
export const NOXH_LEGACY_HUB_REDIRECTS: Readonly<Record<string, NoxhProvinceSlug>> =
  {
    "binh-duong": "tp-ho-chi-minh",
    "ba-ria-vung-tau": "tp-ho-chi-minh",
    "vung-tau": "tp-ho-chi-minh",
    "ba-ria": "tp-ho-chi-minh",
    "binh-phuoc": "dong-nai",
    "hau-giang": "can-tho",
    "soc-trang": "can-tho",
    "long-an": "tay-ninh",
    "tien-giang": "dong-thap",
    "kien-giang": "an-giang",
    "ninh-thuan": "khanh-hoa",
  };

export function resolveLegacyNoxhHubRedirect(
  legacySlug: string,
): NoxhProvinceSlug | undefined {
  return NOXH_LEGACY_HUB_REDIRECTS[legacySlug];
}

/**
 * Path 308 cho slug hub cũ.
 * Target hubEnabled → hub mới; không thì về hub quốc gia.
 */
export function resolveNoxhLegacyHubRedirectPath(legacySlug: string): string {
  const target = resolveLegacyNoxhHubRedirect(legacySlug);
  if (!target) return NOXH_PROVINCE_HUB_BASE;
  const entry = getNoxhProvinceBySlug(target);
  if (!entry?.hubEnabled) return NOXH_PROVINCE_HUB_BASE;
  return noxhProvinceHubPath(target);
}

export type DualAddressInput = {
  /** Địa chỉ / đơn vị theo địa giới mới (canonical) */
  addressNew: string;
  /** Địa chỉ / đơn vị theo địa giới cũ (nếu khác) */
  addressLegacy?: string | null;
};

/** Copy địa chỉ 2 lớp — public UX. */
export function formatDualAddress(input: DualAddressInput): {
  primary: string;
  legacyLine: string | null;
  compact: string;
} {
  const primary = input.addressNew.trim();
  const legacy = input.addressLegacy?.trim() || null;
  if (!legacy || normalizeGeoToken(legacy) === normalizeGeoToken(primary)) {
    return { primary, legacyLine: null, compact: primary };
  }
  return {
    primary,
    legacyLine: `Trước đây / quen gọi: ${legacy}`,
    compact: `${primary} (trước thuộc ${legacy})`,
  };
}

/**
 * Gợi ý dòng địa chỉ song song từ province raw trong DB.
 * Ví dụ raw="Bình Dương" → primary dùng nameNew TP.HCM, legacy = Bình Dương.
 */
export function dualAddressFromProvinceRaw(
  provinceRaw: string,
  localityParts: {
    address?: string | null;
    ward?: string | null;
    district?: string | null;
  } = {},
): DualAddressInput {
  const entry = resolveNoxhProvinceCanonical(provinceRaw);
  const locality = [localityParts.address, localityParts.ward, localityParts.district]
    .filter(Boolean)
    .join(", ");

  if (!entry) {
    const fallback = [locality, provinceRaw].filter(Boolean).join(", ");
    return { addressNew: fallback, addressLegacy: null };
  }

  const isLegacyName = entry.aliasesOld.some(
    (a) => normalizeGeoToken(a) === normalizeGeoToken(provinceRaw),
  );

  const addressNew = [locality, entry.nameNew].filter(Boolean).join(", ");
  const addressLegacy = isLegacyName
    ? [locality, provinceRaw].filter(Boolean).join(", ")
    : null;

  return { addressNew, addressLegacy };
}
