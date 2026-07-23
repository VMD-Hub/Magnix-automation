/**
 * 5 NOXH Đắk Lắk (Phú Yên cũ) — P0.5 Trung.
 * Nguồn: docs/content/DAK_LAK_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
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
    description: `${row.name} tại ${row.address}. CĐT theo danh mục House X: ${row.developerName}.${legacyNote}${tip} Skeleton — giá / suất cập nhật khi có Sở XD hoặc CĐT. Tư vấn điều kiện qua House X.`,
    seoTitle: `${row.name} — Đắk Lắk | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Đắk Lắk. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Đắk Lắk${tip} — catalog House X`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Phú Yên sáp nhập vào tỉnh Đắk Lắk mới. Tọa độ ước lượng.

Đối chiếu soxaydung.daklak.gov.vn / soxaydung.phuyen.gov.vn (legacy). House X: wiki NOXH + form tư vấn.`,
    highlights: [
      { title: "Vị trí", text: row.address },
      { title: "Chủ đầu tư (danh mục)", text: row.developerName },
      {
        title: "Loại hình",
        text: row.productHint
          ? `Đặc thù: ${row.productHint}.`
          : "NOXH theo công bố CĐT — bổ sung khi research.",
      },
    ],
    amenities: ["Tiện ích theo công bố CĐT (bổ sung khi research)"],
    faqs: [
      {
        q: `${row.name} thuộc Đắk Lắk hay Phú Yên?`,
        a: "Canonical House X: Đắk Lắk (sau NQ 2025). Tên Phú Yên / Buôn Ma Thuột / Tuy Hòa vẫn dùng để tìm kiếm.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "House X chỉ đăng khi có công bố Sở / CĐT. Xác minh trước khi nộp hồ sơ.",
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
      "Nhà ở xã hội Ân Phú tại Khu dân cư Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột — 9 khối 3 tầng, 330 căn trên ~27.478 m². CĐT CTCP Đầu tư PTĐT Ân Phú (CafeLand / Sở XD): căn 50–70 m², 264 căn bán và 66 căn thuê; giá tham chiếu ~16,6 triệu/m² — đối chiếu Sở trước nộp hồ sơ. Đang bàn giao từng đợt; phần còn lại dự kiến hoàn tất Q3/2026. XH-03: 164 căn đủ điều kiện kinh doanh 2025. Không nhầm Ecohome Harmony Km7 (CĐT khác). Tư vấn điều kiện qua House X — không hotline CĐT.",
    seoTitle:
      "Nhà ở xã hội Ân Phú Buôn Ma Thuột — 330 căn Hà Huy Tập | House X",
    seoDesc:
      "NOXH Ân Phú Buôn Ma Thuột: 9 khối 330 căn (50–70 m²), CĐT Ân Phú, bàn giao từng đợt. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "BMT Tân An · 9 khối · 330 căn · 50–70 m² · bàn giao từng đợt · CĐT Ân Phú",
    locationNotes: `NOXH Ân Phú trên đường Hà Huy Tập, Phường Tân An, TP. Buôn Ma Thuột — KDC Hà Huy Tập.

Quy mô: 9 khối 3 tầng · 330 căn · ~27.478 m² · 264 bán + 66 thuê. Đang bàn giao từng đợt; phần còn lại dự kiến Q3/2026. XH-03: 164 căn đủ ĐKKD 2025.

Không nhầm Ecohome Harmony Km7 (CĐT khác). Nguồn: CafeLand / Sở XD Đắk Lắk.

House X không thu đặt cọc thay CĐT · không công bố hotline CĐT.`,
    highlights: [
      {
        title: "330 căn · 9 khối 3 tầng",
        text: "~27.478 m²; căn 50–70 m²; 264 căn bán và 66 căn thuê theo CafeLand / Sở.",
      },
      {
        title: "CĐT: Ân Phú",
        text: "CTCP Đầu tư PTĐT Ân Phú — KDC Hà Huy Tập. Không nhầm Ecohome Harmony Km7.",
      },
      {
        title: "Bàn giao từng đợt",
        text: "Đang bàn giao; phần còn lại dự kiến Q3/2026. Giá tham chiếu ~16,6 triệu/m² — xác minh Sở trước nộp hồ sơ.",
      },
    ],
    amenities: [
      "KDC Hà Huy Tập · Phường Tân An",
      "264 căn bán · 66 căn thuê",
      "Hạ tầng kỹ thuật theo tiêu chuẩn NOXH",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư NOXH Ân Phú?",
        a: "CTCP Đầu tư PTĐT Ân Phú theo CafeLand / Sở XD. Không nhầm Ecohome Harmony Km7 (CĐT khác). House X tư vấn qua form — không hotline CĐT.",
      },
      {
        q: "Bao nhiêu căn / diện tích?",
        a: "330 căn trên ~27.478 m²; diện tích căn 50–70 m²; 264 căn bán và 66 căn thuê.",
      },
      {
        q: "Đã bàn giao chưa?",
        a: "Đang bàn giao từng đợt; phần còn lại dự kiến hoàn tất Q3/2026. XH-03: 164 căn đủ điều kiện kinh doanh 2025.",
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
