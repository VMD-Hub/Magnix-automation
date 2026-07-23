/**
 * 5 skeleton NOXH Đà Nẵng (+ enrich Đại Địa Bảo) — Phase 5 lite Trung.
 * Nguồn: docs/content/DANANG_NOXH_INVENTORY.md
 * EcoLife Signature (thương mại) — không seed.
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type DnRow = {
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
};

const TAX = {
  ducManh579: "HX-DN-DUC-MANH-579",
  chuongDuong: "HX-DN-CHUONG-DUONG-LD",
  toanCau: "HX-DN-NHA-O-TOAN-CAU",
  capital: "HX-DN-CAPITAL-HOUSE",
  a24: "HX-DN-A2-4-TBD",
} as const;

const ROWS: DnRow[] = [
  {
    stt: 2,
    slug: "nha-o-xa-hoi-dai-dia-bao-son-tra",
    name: "Nhà ở xã hội Đại Địa Bảo",
    commercialName: "Chung cư Đại Địa Bảo",
    developerName: "Liên danh CTCP Đức Mạnh & CTCP ĐTXD 579",
    developerTax: TAX.ducManh579,
    district: "Sơn Trà",
    ward: "Nại Hiên Đông",
    address: "Thửa 7, tờ bản đồ 28, P. Nại Hiên Đông, Sơn Trà, Đà Nẵng",
    lat: 16.084,
    lng: 108.245,
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-eco-residence-nam-cau-cam-le",
    name: "Nhà ở xã hội Eco Residence Nam Cầu Cẩm Lệ",
    commercialName: "Eco Residence (Chung cư số 3 – Khu B)",
    developerName:
      "Liên danh Chương Dương – 525 – NTMER – Như Anh – Asia",
    developerTax: TAX.chuongDuong,
    district: "Cẩm Lệ",
    ward: "Nam Cầu Cẩm Lệ",
    address: "Chung cư số 3, Khu B, KDC Nam Cầu Cẩm Lệ, Đà Nẵng",
    lat: 16.019,
    lng: 108.195,
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-viet-huong-lakeside-cam-le",
    name: "Nhà ở xã hội Việt Hương Lakeside",
    commercialName: "Việt Hương Lakeside (Chung cư số 5 – Khu B)",
    developerName: "Công ty CP Đầu tư Phát triển Nhà ở Toàn Cầu",
    developerTax: TAX.toanCau,
    district: "Cẩm Lệ",
    ward: "Nam Cầu Cẩm Lệ",
    address: "Chung cư số 5, Khu B, KDC Nam Cầu Cẩm Lệ, Đà Nẵng",
    lat: 16.017,
    lng: 108.198,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-ecohome-lien-chieu",
    name: "Nhà ở xã hội EcoHome Liên Chiểu",
    commercialName: "EcoHome Liên Chiểu (Hòa Hiệp)",
    developerName: "Capital House (Tập đoàn Capital House)",
    developerTax: TAX.capital,
    district: "Liên Chiểu",
    ward: "Hòa Hiệp",
    address: "Khu vực Hòa Hiệp, Liên Chiểu, Đà Nẵng",
    lat: 16.1,
    lng: 108.12,
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-a2-4-ngu-hanh-son",
    name: "Nhà ở xã hội khu đất A2-4 Ngũ Hành Sơn",
    commercialName: "NOXH A2-4 Ngũ Hành Sơn",
    developerName: "Đang cập nhật (quy hoạch TP Đà Nẵng)",
    developerTax: TAX.a24,
    district: "Ngũ Hành Sơn",
    ward: "Ngũ Hành Sơn",
    address:
      "Trục đường Ngũ Hành Sơn (hướng cầu Tiên Sơn), P. Ngũ Hành Sơn, Đà Nẵng",
    lat: 16.002,
    lng: 108.263,
  },
];

function skeletonDef(row: DnRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  return {
    id: `preview-dn-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: "SAP_MO_BAN",
    province: "Đà Nẵng",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư theo danh mục House X: ${row.developerName}. Trang skeleton — giá / số căn chi tiết cập nhật khi có công bố Sở Xây dựng Đà Nẵng hoặc CĐT. Tư vấn điều kiện NOXH qua House X.`,
    seoTitle: `${row.name} — Đà Nẵng | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Đà Nẵng. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Đà Nẵng — catalog House X · cập nhật khi có nguồn chính thức`,
    locationNotes: `${row.name}: ${row.address}.

Tọa độ ước lượng theo ${row.district}. Đối chiếu sxd.danang.gov.vn / danang.gov.vn khi nộp hồ sơ.

House X: wiki điều kiện NOXH, tính trả góp, form tư vấn — không thay thông báo CĐT / Sở.`,
    highlights: [
      { title: "Vị trí Đà Nẵng", text: row.address },
      { title: "Chủ đầu tư (danh mục)", text: row.developerName },
      {
        title: "Giá & suất",
        text: "Chưa công bố chính thức trên House X — đối chiếu Sở XD / CĐT từng đợt.",
      },
    ],
    amenities: [
      "Tiện ích nội khu theo công bố CĐT (bổ sung khi research)",
      "Kết nối giao thông Đà Nẵng",
    ],
    faqs: [
      {
        q: `${row.name} nằm ở đâu?`,
        a: `Theo danh mục House X: ${row.address}.`,
      },
      {
        q: "Giá bao nhiêu?",
        a: "House X chỉ đăng giá khi có công bố Sở Xây dựng / CĐT. Danh mục nội bộ có thể ghi mức dự kiến — luôn xác minh trước khi nộp hồ sơ.",
      },
      {
        q: "Đăng ký tư vấn thế nào?",
        a: "Form trên trang dự án hoặc hotline House X. Xem trước điều kiện tại Wiki nhà ở xã hội.",
      },
    ],
    heroImage: {
      url: "/images/hero/housex-hero-slide-01-civic-center-1920.jpg",
      alt: `${row.name} — Đà Nẵng`,
    },
    gallery: [],
    unitTypes: [
      { name: "Căn hộ NOXH (theo CĐT)", bedrooms: 2, priceFrom: null },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich PDF STT-2 — ducmanhgroup.com + báo (2026-07-23). */
function enrichDaiDiaBao(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Đại Địa Bảo",
    commercialName: "Chung cư Đại Địa Bảo (Khu TĐC Đại Địa Bảo)",
    developerName: "Liên doanh CTCP Đức Mạnh & CTCP ĐTXD 579 (DMC-579)",
    address:
      "Thửa đất số 7, tờ bản đồ số 28, P. Nại Hiên Đông, Sơn Trà, Đà Nẵng",
    totalUnits: 739,
    blocks: 3,
    description:
      "Nhà ở xã hội Đại Địa Bảo (chung cư cho người thu nhập thấp tại Khu TĐC Đại Địa Bảo), Sơn Trà, Đà Nẵng. Liên doanh CĐT Đức Mạnh – ĐTXD 579 (công bố ducmanhgroup.com): 3 block 9 tầng, 739 căn hộ + 28 ki-ốt. Block A/B đã đưa vào sử dụng; Block C (237 căn + 28 ki-ốt) là đợt đang / vừa tiếp nhận hồ sơ theo báo chí 2026. Giá dự kiến danh mục nội bộ ~17 triệu/m² — đối chiếu Sở XD Đà Nẵng. Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội Đại Địa Bảo Sơn Trà — 739 căn | House X",
    seoDesc:
      "NOXH Đại Địa Bảo (Nại Hiên Đông, Sơn Trà): liên doanh Đức Mạnh–579, 3 block 9 tầng, 739 căn. Block C 237 căn — tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Sơn Trà · 3 block 9 tầng · 739 căn (+28 ki-ốt) · Block C 237 căn — CĐT Đức Mạnh–579",
    locationNotes: `Đại Địa Bảo tại thửa 7, tờ bản đồ 28, Nại Hiên Đông, Sơn Trà — 4 mặt tiền, gần cầu Thuận Phước / sông Hàn (theo CĐT Đức Mạnh).

Quy mô: 3 block 9 tầng · 739 căn hộ · 28 ki-ốt. Block B (~2013), Block A (~2016) đã sử dụng; Block C đang / vừa mở đợt hồ sơ.

Nguồn: ducmanhgroup.com · đối chiếu sxd.danang.gov.vn. House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "739 căn · 3 block 9 tầng",
        text: "Theo CĐT: Block A/B đã bàn giao; Block C 237 căn + 28 ki-ốt thương mại — đợt hồ sơ tham chiếu 5–6/2026 (báo chí).",
      },
      {
        title: "Liên doanh Đức Mạnh – 579",
        text: "CĐT công bố trên ducmanhgroup.com (DMC-579). Vị trí Sơn Trà gần trung tâm / bán đảo.",
      },
      {
        title: "Giá dự kiến ~17 triệu/m²",
        text: "Theo danh mục nội bộ House X — xác minh mức phê duyệt tại Sở Xây dựng Đà Nẵng trước khi nộp hồ sơ.",
      },
    ],
    amenities: [
      "Ki-ốt thương mại Block C (28 căn)",
      "Gần cầu Thuận Phước / sông Hàn",
      "Kết nối trung tâm hành chính ~2 km (theo CĐT)",
    ],
    faqs: [
      {
        q: "Đại Địa Bảo nằm ở đâu?",
        a: "Thửa 7, tờ bản đồ 28, phường Nại Hiên Đông, quận Sơn Trà, Đà Nẵng — theo công bố Đức Mạnh.",
      },
      {
        q: "Còn suất Block C không?",
        a: "Đợt tiếp nhận hồ sơ Block C được báo chí ghi nhận khoảng 5–6/2026. Kiểm tra thông báo mới nhất trên CĐT / Sở XD; House X hỗ trợ tư vấn điều kiện.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Danh mục nội bộ ghi ~17 triệu/m² (dự kiến). Giá chính thức theo phê duyệt Sở Xây dựng / bảng CĐT từng đợt.",
      },
    ],
    unitTypes: [
      {
        name: "NOXH Block C (~căn hộ 9 tầng)",
        bedrooms: 2,
        priceFrom: null,
      },
      {
        name: "Ki-ốt thương mại Block C",
        bedrooms: 0,
        priceFrom: null,
      },
    ],
    legalDocs: [
      { docType: "chap_thuan_noxh", status: "da_co" },
    ],
  };
}

DEFS[0] = enrichDaiDiaBao(DEFS[0]!);

export function allNoxhDanangSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhDanangDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhDanangDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhDanangSeedLanding(slug: string) {
  const def = getNoxhDanangDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhDanangMock(slug: string): ProjectDetail | null {
  const def = getNoxhDanangDef(slug);
  return def ? buildNoxhMock(def) : null;
}
