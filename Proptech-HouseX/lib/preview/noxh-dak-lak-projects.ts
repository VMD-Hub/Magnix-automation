/**
 * 5 NOXH Đắk Lắk (Phú Yên cũ) — P0.5 Trung.
 * Nguồn: docs/content/DAK_LAK_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  NOXH_AMENITIES_VERIFYING,
  NOXH_PRICE_FAQ_VERIFYING,
  NOXH_TYPE_VERIFYING,
  NOXH_UPDATING_SOON,
} from "@/lib/content/messaging/noxh-landing-incomplete";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type DlRow = {
  stt: number;
  slug: string;
  name: string;
  commercialName: string;
  developerName: string;
  developerTax: string;
  district: string;
  ward: string;
  address: string;
  lat: number;
  lng: number;
  productHint?: string;
  status?: NoxhLandingDef["status"];
  phuYenLegacy?: boolean;
};

const TAX = {
  anPhu: "HX-DL-AN-PHU",
  namLaGiang: "HX-DL-NAM-LA-GIANG",
  namHungVuong: "HX-DL-NAM-HUNG-VUONG",
  vietThanh: "HX-DL-VIET-THANH",
  kcnPhuYen: "HX-DL-KCN-PHU-YEN",
} as const;

const ROWS: DlRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-an-phu-buon-ma-thuot",
    name: "Nhà ở xã hội Ân Phú Buôn Ma Thuột",
    commercialName: "NOXH Ân Phú Buôn Ma Thuột",
    developerName: "Công ty CP Đầu tư PTĐT Ân Phú",
    developerTax: TAX.anPhu,
    district: "Buôn Ma Thuột",
    ward: "Tân An",
    address: "Đường Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột, Đắk Lắk",
    lat: 12.68,
    lng: 108.04,
    productHint: "9 khối 3 tầng · 330 căn · 50–70 m²",
    status: "DANG_BAN",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-nam-la-giang",
    name: "Nhà ở xã hội Nam La Giang",
    commercialName: "NOXH Nam La Giang",
    developerName: "Công ty TNHH ĐT&XD Nam La Giang",
    developerTax: TAX.namLaGiang,
    district: "Buôn Ma Thuột",
    ward: "Hòa Phú",
    address: "Phường Hòa Phú, TP. Buôn Ma Thuột, Đắk Lắk",
    lat: 12.68,
    lng: 108.04,
    productHint: "~200 căn liền kề",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-nam-hung-vuong-tuy-hoa",
    name: "Nhà ở xã hội Nam Hùng Vương Tuy Hòa",
    commercialName: "NOXH Nam Hùng Vương Tuy Hòa",
    developerName: "Công ty CP ĐT BĐS Nam Hùng Vương",
    developerTax: TAX.namHungVuong,
    district: "Tuy Hòa",
    ward: "Phú Thạnh",
    address:
      "Đường Hùng Vương, Phường Phú Thạnh, TP. Tuy Hòa, Đắk Lắk (Phú Yên cũ)",
    lat: 13.09,
    lng: 109.3,
    productHint: "4 block 9 tầng · 393 căn · ~10,5–12 tr/m²",
    phuYenLegacy: true,
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-kdt-nam-thanh-pho-tuy-hoa",
    name: "Nhà ở xã hội KĐT Nam Thành Phố Tuy Hòa",
    commercialName: "NOXH KĐT Nam Thành Phố Tuy Hòa",
    developerName: "Công ty CP XD BĐS Việt Thành",
    developerTax: TAX.vietThanh,
    district: "Tuy Hòa",
    ward: "Nam Thành Phố",
    address: "KĐT Nam Thành Phố, TP. Tuy Hòa, Đắk Lắk (Phú Yên cũ)",
    lat: 13.09,
    lng: 109.3,
    productHint: "2 block 10 tầng · ~280 căn",
    phuYenLegacy: true,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-kcn-hoa-hiep",
    name: "Nhà ở xã hội KCN Hòa Hiệp",
    commercialName: "NOXH KCN Hòa Hiệp",
    developerName: "Công ty CP ĐT HT KCN Phú Yên",
    developerTax: TAX.kcnPhuYen,
    district: "Đông Hòa",
    ward: "Hòa Hiệp",
    address: "KCN Hòa Hiệp, huyện Đông Hòa, Đắk Lắk (Phú Yên cũ)",
    lat: 12.99,
    lng: 109.35,
    productHint: "~500 căn công nhân KCN",
    phuYenLegacy: true,
  },
];

function skeletonDef(row: DlRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  const legacyNote = row.phuYenLegacy
    ? " Thuộc tỉnh Đắk Lắk sau NQ 2025 (Phú Yên cũ — Tuy Hòa / Đông Hòa)."
    : "";
  return {
    id: `preview-dl-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Đắk Lắk",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}.${legacyNote}${tip} Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — Đắk Lắk | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Đắk Lắk. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Đắk Lắk${tip}`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Phú Yên sáp nhập vào tỉnh Đắk Lắk mới. Vị trí trên bản đồ đang được xác minh.

Đối chiếu soxaydung.daklak.gov.vn / soxaydung.phuyen.gov.vn (legacy). Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
    highlights: [
      { title: "Vị trí", text: row.address },
      { title: "Chủ đầu tư", text: row.developerName },
      {
        title: "Loại hình",
        text: row.productHint
          ? `Đặc thù: ${row.productHint}.`
          : NOXH_TYPE_VERIFYING,
      },
    ],
    amenities: [NOXH_AMENITIES_VERIFYING],
    faqs: [
      {
        q: `${row.name} thuộc Đắk Lắk hay Phú Yên?`,
        a: "Theo House X: Đắk Lắk (sau NQ 2025). Tên Phú Yên / Buôn Ma Thuột / Tuy Hòa vẫn dùng để tìm kiếm.",
      },
      {
        q: "Giá bao nhiêu?",
        a: NOXH_PRICE_FAQ_VERIFYING,
      },
      {
        q: "Tư vấn thế nào?",
        a: "Form trang dự án hoặc hotline House X · Wiki nhà ở xã hội.",
      },
    ],
    heroImage: {
      url: "/images/hero/housex-hero-slide-01-civic-center-1920.jpg",
      alt: `${row.name} — Đắk Lắk`,
    },
    gallery: [],
    unitTypes: [
      {
        name: "Căn hộ NOXH (theo CĐT)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich STT-1 — Ân Phú Buôn Ma Thuột (2026-07-23). */
function enrichAnPhu(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Ân Phú Buôn Ma Thuột",
    commercialName: "NOXH Ân Phú · KDC Hà Huy Tập",
    developerName: "Công ty CP Đầu tư PTĐT Ân Phú",
    address: "Đường Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột, Đắk Lắk",
    totalArea: 27478.6,
    totalUnits: 330,
    blocks: 9,
    status: "DANG_BAN",
    description:
      "Nhà ở xã hội Ân Phú tại Khu dân cư Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột — 9 khối 3 tầng, 330 căn trên khoảng 27.478 m². Chủ đầu tư CTCP Đầu tư PTĐT Ân Phú: căn 50–70 m², 264 căn bán và 66 căn thuê; giá tham chiếu khoảng 16,6 triệu/m² — đối chiếu Sở trước khi nộp hồ sơ. Đang bàn giao từng đợt; phần còn lại dự kiến hoàn tất quý III/2026. Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội Ân Phú Buôn Ma Thuột — 330 căn Hà Huy Tập | House X",
    seoDesc:
      "Nhà ở xã hội Ân Phú Buôn Ma Thuột: 9 khối 330 căn (50–70 m²), chủ đầu tư Ân Phú, bàn giao từng đợt. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Buôn Ma Thuột Tân An · 9 khối · 330 căn · 50–70 m² · bàn giao từng đợt · chủ đầu tư Ân Phú",
    locationNotes: `Nhà ở xã hội Ân Phú trên đường Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột — khu dân cư Hà Huy Tập.

Quy mô: 9 khối 3 tầng · 330 căn · khoảng 27.478 m² · 264 căn bán và 66 căn thuê. Đang bàn giao từng đợt; phần còn lại dự kiến quý III/2026.

House X không thu đặt cọc thay chủ đầu tư.`,
    highlights: [
      {
        title: "330 căn · 9 khối 3 tầng",
        text: "Khoảng 27.478 m²; căn 50–70 m²; 264 căn bán và 66 căn thuê theo công bố công khai.",
      },
      {
        title: "Chủ đầu tư: Ân Phú",
        text: "CTCP Đầu tư PTĐT Ân Phú — khu dân cư Hà Huy Tập, TP. Buôn Ma Thuột.",
      },
      {
        title: "Bàn giao từng đợt",
        text: "Đang bàn giao; phần còn lại dự kiến quý III/2026. Giá tham chiếu khoảng 16,6 triệu/m² — xác minh Sở trước khi nộp hồ sơ.",
      },
    ],
    amenities: [
      "Khu dân cư Hà Huy Tập · Phường Tân An",
      "264 căn bán · 66 căn thuê",
      "Hạ tầng kỹ thuật theo tiêu chuẩn nhà ở xã hội",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư nhà ở xã hội Ân Phú?",
        a: "CTCP Đầu tư PTĐT Ân Phú. House X tư vấn qua form trên trang dự án.",
      },
      {
        q: "Bao nhiêu căn / diện tích?",
        a: "330 căn trên khoảng 27.478 m²; diện tích căn 50–70 m²; 264 căn bán và 66 căn thuê.",
      },
      {
        q: "Đã bàn giao chưa?",
        a: "Đang bàn giao từng đợt; phần còn lại dự kiến hoàn tất quý III/2026.",
      },
    ],
    unitTypes: [
      {
        name: "Căn NOXH (50–70 m²)",
        areaMin: 50,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichAnPhu(DEFS[0]!);

export function allNoxhDakLakSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhDakLakDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhDakLakDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhDakLakSeedLanding(slug: string) {
  const def = getNoxhDakLakDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhDakLakMock(slug: string): ProjectDetail | null {
  const def = getNoxhDakLakDef(slug);
  return def ? buildNoxhMock(def) : null;
}
