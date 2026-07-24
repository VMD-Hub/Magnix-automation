/**
 * 7 NOXH Gia Lai (Bình Định cũ) — P0.5 Trung.
 * Nguồn: docs/content/GIA_LAI_NOXH_INVENTORY.md
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

type GlRow = {
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
};

const TAX = {
  tanDaiPhat: "HX-GL-TAN-DAI-PHAT",
  ecohomeNhonBinh: "HX-GL-ECOHOME-NB",
  phuTaiLoc: "HX-GL-PHU-TAI-LOC",
  langChaiNhonLy: "HX-GL-LANG-CHAI-NL",
  nhonPhu: "HX-GL-NHON-PHU",
  bongHong: "HX-GL-BONG-HONG",
  nhonHung: "HX-GL-NHON-HUNG",
} as const;

const ROWS: GlRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-tan-dai-phat-pleiku",
    name: "Nhà ở xã hội Tân Đại Phát Pleiku",
    commercialName: "NOXH Tân Đại Phát Pleiku",
    developerName: "Công ty TNHH Tân Đại Phát",
    developerTax: TAX.tanDaiPhat,
    district: "Pleiku",
    ward: "Hội Phú",
    address: "Đường Nguyễn Huệ, Phường Hội Phú, TP. Pleiku, Gia Lai",
    lat: 13.98,
    lng: 108.0,
    productHint: "2 block · 120 căn · 45–65 m²",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-ecohome-nhon-binh",
    name: "Nhà ở xã hội Ecohome Nhơn Bình",
    commercialName: "NOXH Ecohome Nhơn Bình",
    developerName: "Capital House / CTNHH Ecohome Nhơn Bình",
    developerTax: TAX.ecohomeNhonBinh,
    district: "Quy Nhơn",
    ward: "Nhơn Bình",
    address: "Phường Nhơn Bình, TP. Quy Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.79,
    lng: 109.21,
    productHint: "5 block 13–16 tầng · 1.380 căn",
    status: "DA_BAN_GIAO",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-phu-tai-loc",
    name: "Nhà ở xã hội Phú Tài Lộc",
    commercialName: "NOXH Phú Tài Lộc",
    developerName: "Công ty TNHH SX TM DV Phú Tài",
    developerTax: TAX.phuTaiLoc,
    district: "Quy Nhơn",
    ward: "Trần Quang Diệu",
    address: "Đường Trần Quang Diệu, TP. Quy Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.78,
    lng: 109.22,
    productHint: "1 block 18 tầng · 273 căn",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-lang-chai-nhon-ly",
    name: "Nhà ở xã hội Làng Chài Nhơn Lý",
    commercialName: "NOXH Làng Chài Nhơn Lý",
    developerName: "Công ty CP Đầu tư BĐS Nhơn Lý",
    developerTax: TAX.langChaiNhonLy,
    district: "Quy Nhơn",
    ward: "Nhơn Lý",
    address: "Khu Nhơn Lý, TP. Quy Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.77,
    lng: 109.24,
    productHint: "~300 căn thấp tầng",
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-nhon-phu",
    name: "Nhà ở xã hội Nhơn Phú",
    commercialName: "NOXH Nhơn Phú Quy Nhơn",
    developerName: "Công ty CP ĐTXD Nhơn Phú",
    developerTax: TAX.nhonPhu,
    district: "Quy Nhơn",
    ward: "Nhơn Phú",
    address: "Phường Nhơn Phú, TP. Quy Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.76,
    lng: 109.23,
    productHint: "2 block 12 tầng · 382 căn",
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-bong-hong-quy-nhon",
    name: "Nhà ở xã hội Bông Hồng Quy Nhơn",
    commercialName: "NOXH Bông Hồng Ghềnh Ráng",
    developerName: "Công ty CP BĐS Bông Hồng",
    developerTax: TAX.bongHong,
    district: "Quy Nhơn",
    ward: "Ghềnh Ráng",
    address: "Khu Ghềnh Ráng, TP. Quy Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.75,
    lng: 109.22,
    productHint: "2 khối · ~800 căn",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-nhon-hung-an-nhon",
    name: "Nhà ở xã hội Nhơn Hưng An Nhơn",
    commercialName: "NOXH Nhơn Hưng An Nhơn",
    developerName: "Công ty CP ĐT&XD An Nhơn",
    developerTax: TAX.nhonHung,
    district: "An Nhơn",
    ward: "Nhơn Hưng",
    address: "Phường Nhơn Hưng, TP. An Nhơn, Gia Lai (Bình Định cũ)",
    lat: 13.88,
    lng: 109.1,
    productHint: "~200 căn liền kề",
  },
];

function skeletonDef(row: GlRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-gl-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Gia Lai",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}. Thuộc tỉnh Gia Lai sau sắp xếp (Bình Định cũ nếu Quy Nhơn / An Nhơn).${tip} Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — Gia Lai | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Gia Lai. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Gia Lai${tip}`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Bình Định sáp nhập vào tỉnh Gia Lai mới. Vị trí trên bản đồ đang được xác minh.

Đối chiếu soxaydung.gialai.gov.vn. Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
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
        q: `${row.name} thuộc Gia Lai hay Bình Định?`,
        a: "Theo House X: Gia Lai (sau NQ 2025). Tên Bình Định / Quy Nhơn / Pleiku / An Nhơn vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Gia Lai`,
    },
    gallery: [],
    unitTypes: [
      {
        name: row.productHint?.includes("liền kề") || row.productHint?.includes("thấp tầng")
          ? "Nhà thấp tầng / liền kề NOXH"
          : "Căn hộ NOXH (theo CĐT)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich STT-2 — Ecohome Nhơn Bình (2026-07-23). */
function enrichEcohomeNhonBinh(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Ecohome Nhơn Bình",
    commercialName: "Ecohome Nhơn Bình · P. Nhơn Bình Quy Nhơn",
    developerName: "Capital House / CTNHH Ecohome Nhơn Bình (CH Group)",
    status: "DA_BAN_GIAO",
    totalArea: 46034,
    totalUnits: 1380,
    blocks: 5,
    description:
      "Nhà ở xã hội Ecohome Nhơn Bình tại Phường Nhơn Bình, TP. Quy Nhơn — dự án chung cư NOXH quy mô lớn của Capital House / CH Group trên ~4,6 ha. 5 tòa 13–16 tầng, 1.380 căn (35,1–76,9 m²), chứng nhận EDGE green; khởi công 2020 và đã bàn giao vận hành. Mức giá công bố tham chiếu ~12–14 tr/m² (thị trường thứ cấp — xác minh trước giao dịch). Không nhầm với Ecohome Harmony Đắk Lắk. Tư vấn điều kiện qua House X.",
    seoTitle: "Ecohome Nhơn Bình — 1.380 căn NOXH Quy Nhơn | House X",
    seoDesc:
      "NOXH Ecohome Nhơn Bình: 1.380 căn, 5 tòa EDGE green, Capital House / CH Group. Đã bàn giao — tra cứu điều kiện trên House X.",
    heroSubtitle:
      "Quy Nhơn Nhơn Bình · 1.380 căn · 5 tòa EDGE · Capital House · đã bàn giao",
    locationNotes: `Ecohome Nhơn Bình trên ~4,6 ha tại Phường Nhơn Bình, TP. Quy Nhơn — thuộc tỉnh Gia Lai mới (Bình Định cũ).

Nguồn: docs/content/ECOHOME_NHON_BINH_NOXH_LANDING.md · CH Group / Capital House. Đối chiếu Sở XD Gia Lai.

House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "1.380 căn · 5 tòa",
        text: "5 block 13–16 tầng trên ~46.034 m²; căn hộ 35,1–76,9 m²; đã bàn giao vận hành.",
      },
      {
        title: "Capital House / CH Group",
        text: "CTNHH Ecohome Nhơn Bình — chứng nhận EDGE green building.",
      },
      {
        title: "Không nhầm Harmony Đắk Lắk",
        text: "Ecohome Nhơn Bình tại Quy Nhơn khác Ecohome Harmony (Buôn Ma Thuột / Tuy Hòa, Đắk Lắk).",
      },
    ],
    amenities: [
      "EDGE green building",
      "Tiện ích cộng đồng theo thiết kế Capital House",
      "Hạ tầng kỹ thuật chung cư NOXH",
    ],
    faqs: [
      {
        q: "Ecohome Nhơn Bình có phải Ecohome Harmony Đắk Lắk không?",
        a: "Không. Ecohome Nhơn Bình tại P. Nhơn Bình, Quy Nhơn (Gia Lai). Ecohome Harmony nằm ở Đắk Lắk (Buôn Ma Thuột / Tuy Hòa) — dự án khác.",
      },
      {
        q: "Dự án đã bàn giao chưa?",
        a: "Theo công bố CĐT / báo: khởi công 2020, đã bàn giao vận hành. Suất còn lại (nếu có) xác minh trực tiếp Sở / CĐT.",
      },
      {
        q: "Quy mô và diện tích căn?",
        a: "1.380 căn trên 5 tòa; diện tích căn khoảng 35,1–76,9 m² theo công bố CĐT.",
      },
    ],
    unitTypes: [
      {
        name: "Căn hộ NOXH (35,1–76,9 m²)",
        areaMin: 35.1,
        areaMax: 76.9,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[1] = enrichEcohomeNhonBinh(DEFS[1]!);

export function allNoxhGiaLaiSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhGiaLaiDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhGiaLaiDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhGiaLaiSeedLanding(slug: string) {
  const def = getNoxhGiaLaiDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhGiaLaiMock(slug: string): ProjectDetail | null {
  const def = getNoxhGiaLaiDef(slug);
  return def ? buildNoxhMock(def) : null;
}
