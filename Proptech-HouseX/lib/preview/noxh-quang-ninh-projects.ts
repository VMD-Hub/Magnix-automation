/**
 * 7 NOXH Quảng Ninh — P0.5 Bắc (standalone, không sáp nhập NQ 2025).
 * Nguồn: docs/content/QUANG_NINH_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type QnRow = {
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
  doiNganHang: "HX-QN-TOAN-CAU-NHA6",
  dongBacI: "HX-QN-DONG-BAC-I",
  amata: "HX-QN-AMATA",
  viglaceraHt: "HX-QN-VIGLACERA-HT",
  bdsCamPha: "HX-QN-BDS-CAM-PHA",
  viglaceraKcn: "HX-QN-VIGLACERA-KCN",
  dongBac: "HX-QN-DONG-BAC",
} as const;

const ROWS: QnRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-doi-ngan-hang-ha-long",
    name: "Nhà ở xã hội Đồi Ngân Hàng Hạ Long",
    commercialName: "NOXH Đồi Ngân Hàng · GHomes Hạ Long",
    developerName:
      "Liên danh Tư vấn ĐT TC Toàn Cầu + ĐT PT nhà số 6 Hà Nội",
    developerTax: TAX.doiNganHang,
    district: "TP. Hạ Long",
    ward: "Hồng Hải & Cao Thắng",
    address:
      "Phường Hồng Hải và Cao Thắng, TP. Hạ Long, Quảng Ninh (Đồi Ngân Hàng / GHomes)",
    lat: 20.95,
    lng: 107.08,
    productHint: "3 block · ~986 căn · ~25.900 m² · 45–70 m² · ~16,2 tr/m²",
    status: "DANG_BAN",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-kdt-kim-son-dong-trieu",
    name: "Nhà ở xã hội KĐT Kim Sơn Đông Triều",
    commercialName: "NOXH KĐT Kim Sơn",
    developerName: "Tổng Công ty Đông Bắc I",
    developerTax: TAX.dongBacI,
    district: "TP. Đông Triều",
    ward: "Kim Sơn",
    address: "Phường Kim Sơn, TP. Đông Triều, Quảng Ninh",
    lat: 21.07,
    lng: 106.52,
    productHint: "2 block 9 tầng · ~180 căn · ~11–12,5 tr/m²",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-kcn-song-khoai-amata",
    name: "Nhà ở xã hội KCN Sông Khoai Amata",
    commercialName: "NOXH KCN Sông Khoai Amata",
    developerName: "Amata + liên danh",
    developerTax: TAX.amata,
    district: "TP. Quảng Yên",
    ward: "Sông Khoai",
    address: "KCN Sông Khoai, TP. Quảng Yên, Quảng Ninh",
    lat: 20.93,
    lng: 106.85,
    productHint: "~1.200 căn công nhân KCN",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-ha-khanh-ha-long",
    name: "Nhà ở xã hội Hà Khánh Hạ Long",
    commercialName: "NOXH Hà Khánh Hạ Long",
    developerName: "Tổng Công ty Viglacera (HT)",
    developerTax: TAX.viglaceraHt,
    district: "TP. Hạ Long",
    ward: "Hà Khánh",
    address: "Phường Hà Khánh, TP. Hạ Long, Quảng Ninh",
    lat: 20.95,
    lng: 107.08,
    productHint: "2 block 12 tầng · ~600 căn",
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-cam-binh-cam-pha",
    name: "Nhà ở xã hội Cẩm Bình Cẩm Phả",
    commercialName: "NOXH Cẩm Bình Cẩm Phả",
    developerName: "Công ty BĐS Cẩm Phả",
    developerTax: TAX.bdsCamPha,
    district: "TP. Cẩm Phả",
    ward: "Cẩm Bình",
    address: "Phường Cẩm Bình, TP. Cẩm Phả, Quảng Ninh",
    lat: 21.02,
    lng: 107.3,
    productHint: "~500 căn",
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-kcn-dong-mai",
    name: "Nhà ở xã hội KCN Đông Mai",
    commercialName: "NOXH KCN Đông Mai",
    developerName: "Viglacera đô thị KCN",
    developerTax: TAX.viglaceraKcn,
    district: "TP. Quảng Yên",
    ward: "Đông Mai",
    address: "KCN Đông Mai, TP. Quảng Yên, Quảng Ninh",
    lat: 20.93,
    lng: 106.85,
    productHint: "~1.000 căn công nhân KCN",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-tam-hop-cam-pha",
    name: "Nhà ở xã hội Tam Hợp Cẩm Phả",
    commercialName: "NOXH Tam Hợp Cẩm Phả",
    developerName: "Tổng Công ty Đông Bắc",
    developerTax: TAX.dongBac,
    district: "TP. Cẩm Phả",
    ward: "Cẩm Tây",
    address: "Phường Cẩm Tây, TP. Cẩm Phả, Quảng Ninh",
    lat: 21.02,
    lng: 107.3,
    productHint: "~400 căn",
  },
];

function skeletonDef(row: QnRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-qn-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Quảng Ninh",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. CĐT theo danh mục House X: ${row.developerName}. Tỉnh Quảng Ninh — không sáp nhập NQ 2025.${tip} Skeleton — giá / suất cập nhật khi có Sở XD hoặc CĐT. Tư vấn điều kiện qua House X.`,
    seoTitle: `${row.name} — Quảng Ninh | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Quảng Ninh. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Quảng Ninh${tip} — catalog House X`,
    locationNotes: `${row.name}: ${row.address}.

Quảng Ninh standalone (NQ 202/2025 — không sáp nhập cấp tỉnh). Cụm Hạ Long · Cẩm Phả · Quảng Yên · Đông Triều. Tọa độ ước lượng.

Đối chiếu soxaydung.quangninh.gov.vn. House X: wiki NOXH + form tư vấn.`,
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
        q: `${row.name} thuộc tỉnh nào?`,
        a: "Canonical House X: Quảng Ninh. Tên Hạ Long / Cẩm Phả / Quảng Yên / Đông Triều vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Quảng Ninh`,
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

/** Enrich STT-1 — Đồi Ngân Hàng / GHomes Hạ Long (2026-07-23). Sở / CĐT > PDF. */
function enrichDoiNganHang(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Đồi Ngân Hàng Hạ Long",
    commercialName: "NOXH Đồi Ngân Hàng · GHomes Hạ Long",
    developerName:
      "Liên danh Tư vấn ĐT TC Toàn Cầu + ĐT PT nhà số 6 Hà Nội",
    ward: "Hồng Hải & Cao Thắng",
    address:
      "Phường Hồng Hải và Cao Thắng, TP. Hạ Long, Quảng Ninh — Đồi Ngân Hàng / GHomes",
    totalArea: 25900,
    totalUnits: 986,
    blocks: 3,
    status: "DANG_BAN",
    description:
      "Nhà ở xã hội Đồi Ngân Hàng (GHomes Hạ Long) tại phường Hồng Hải & Cao Thắng, TP. Hạ Long — ~25.900 m², 3 khối (~986 căn). CĐT liên danh Tư vấn ĐT TC Toàn Cầu (Global Invest) + ĐT PT nhà số 6 Hà Nội (PDF ghi TTH+NHP / Hồng Hà — ưu tiên Sở / CĐT). Diện tích căn 45–70 m²; giá tham chiếu đợt Sở ~16,2 triệu/m² — đối chiếu thông báo mới nhất trước nộp hồ sơ. Đang mở bán theo đợt. Tư vấn điều kiện qua House X — không công bố số điện thoại CĐT.",
    seoTitle:
      "Nhà ở xã hội Đồi Ngân Hàng Hạ Long — ~986 căn GHomes | House X",
    seoDesc:
      "NOXH Đồi Ngân Hàng Hạ Long: 3 khối ~986 căn, Toàn Cầu + Nhà số 6, Hồng Hải & Cao Thắng. Tra cứu điều kiện trên House X.",
    heroSubtitle:
      "Hạ Long · Hồng Hải & Cao Thắng · 3 khối · ~986 căn · ~16,2 tr/m² · GHomes",
    locationNotes: `NOXH Đồi Ngân Hàng (GHomes) tại phường Hồng Hải & Cao Thắng, TP. Hạ Long, Quảng Ninh.

Quy mô: ~25.900 m² · 3 khối · ~986 căn · căn 45–70 m². Giá tham chiếu đợt Sở ~16,2 triệu/m² — xác minh thông báo Sở XD Quảng Ninh mới nhất trước nộp hồ sơ.

House X không thu đặt cọc thay CĐT · không công bố số điện thoại CĐT.`,
    highlights: [
      {
        title: "~986 căn · ~25.900 m²",
        text: "Đồi Ngân Hàng / GHomes tại Hồng Hải & Cao Thắng, TP. Hạ Long. 3 khối chung cư.",
      },
      {
        title: "CĐT: Toàn Cầu + Nhà số 6 Hà Nội",
        text: "Liên danh Tư vấn ĐT TC Toàn Cầu + ĐT PT nhà số 6 Hà Nội — thương hiệu GHomes Hạ Long.",
      },
      {
        title: "Giá — xác minh Sở",
        text: "Một số đợt Sở / truyền thông ~16,2 triệu/m² (45–70 m²). Đối chiếu Sở XD Quảng Ninh trước nộp hồ sơ.",
      },
    ],
    amenities: [
      "TP. Hạ Long · Hồng Hải & Cao Thắng",
      "Hạ tầng kỹ thuật theo tiêu chuẩn NOXH",
      "Tiện ích theo công bố CĐT (bổ sung khi research)",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư?",
        a: "Liên danh Tư vấn ĐT TC Toàn Cầu + ĐT PT nhà số 6 Hà Nội (GHomes Hạ Long). House X tư vấn qua form — không công bố số điện thoại CĐT.",
      },
      {
        q: "Bao nhiêu căn?",
        a: "Theo CĐT / Sở: khoảng 986 căn trên 3 khối. Đang mở bán theo đợt.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Một số đợt ~16,2 triệu/m² (45–70 m²). Đối chiếu thông báo Sở XD Quảng Ninh mới nhất trước nộp hồ sơ.",
      },
    ],
    unitTypes: [
      {
        name: "Căn NOXH (45–70 m²)",
        areaMin: 45,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichDoiNganHang(DEFS[0]!);

export function allNoxhQuangNinhSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhQuangNinhDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhQuangNinhDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhQuangNinhSeedLanding(slug: string) {
  const def = getNoxhQuangNinhDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhQuangNinhMock(slug: string): ProjectDetail | null {
  const def = getNoxhQuangNinhDef(slug);
  return def ? buildNoxhMock(def) : null;
}
