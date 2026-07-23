/**
 * 8 NOXH Bắc Ninh (Bắc Giang cũ) — P0.5 Bắc.
 * Nguồn: docs/content/BAC_NINH_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type BnRow = {
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
  catTuong: "HX-BN-CAT-TUONG",
  viglacera: "HX-BN-VIGLACERA",
  thongNhat: "HX-BN-THONG-NHAT",
  saoHong: "HX-BN-SAO-HONG",
  kimDiamond: "HX-BN-KIM-DIAMOND",
  kinhBac: "HX-BN-KINH-BAC",
  dabaco: "HX-BN-DABACO",
  hud2: "HX-BN-HUD2",
} as const;

const ROWS: BnRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-cat-tuong-smart-city",
    name: "Nhà ở xã hội Cát Tường Smart City",
    commercialName: "NOXH Cát Tường Smart City",
    developerName: "Công ty CP Cát Tường",
    developerTax: TAX.catTuong,
    district: "Yên Phong",
    ward: "Yên Trung",
    address:
      "Xã Yên Trung và Thụy Hòa, huyện Yên Phong, Bắc Ninh (gần KCN Yên Phong)",
    lat: 21.2,
    lng: 105.97,
    productHint: "5 block 9 tầng · ~1.000 căn · 45–70 m² · ~9,5–11,5 tr/m²",
    status: "DANG_BAN",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-viglacera-yen-phong",
    name: "Nhà ở xã hội Viglacera Yên Phong",
    commercialName: "NOXH Viglacera Yên Phong",
    developerName: "Tổng Công ty Viglacera",
    developerTax: TAX.viglacera,
    district: "Yên Phong",
    ward: "Đông Tiến",
    address: "Xã Đông Tiến, huyện Yên Phong, Bắc Ninh (KCN Yên Phong)",
    lat: 21.2,
    lng: 105.97,
    productHint: "~1.200 căn · 9–12 tầng · ~8,5–10,5 tr/m²",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-thong-nhat-smart-city",
    name: "Nhà ở xã hội Thống Nhất Smart City",
    commercialName: "NOXH Thống Nhất Smart City",
    developerName: "Công ty CP Thống Nhất",
    developerTax: TAX.thongNhat,
    district: "Yên Phong",
    ward: "Yên Trung",
    address: "Xã Yên Trung, huyện Yên Phong, Bắc Ninh",
    lat: 21.2,
    lng: 105.97,
    productHint: "4 block · ~800 căn",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-sao-hong-que-vo",
    name: "Nhà ở xã hội Sao Hồng Quế Võ",
    commercialName: "NOXH Sao Hồng Quế Võ",
    developerName: "Công ty CP ĐT Sao Hồng",
    developerTax: TAX.saoHong,
    district: "Quế Võ",
    ward: "Phương Liễu",
    address: "Xã Phương Liễu, huyện Quế Võ, Bắc Ninh",
    lat: 21.15,
    lng: 106.15,
    productHint: "3 block 11–15 tầng · ~790 căn · 40–68 m²",
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-golden-park-que-vo",
    name: "Nhà ở xã hội Golden Park Quế Võ",
    commercialName: "NOXH Golden Park Quế Võ",
    developerName: "Công ty TNHH ĐT&TM Kim Diamond",
    developerTax: TAX.kimDiamond,
    district: "Quế Võ",
    ward: "Phương Liễu",
    address: "Xã Phương Liễu, huyện Quế Võ, Bắc Ninh",
    lat: 21.15,
    lng: 106.15,
    productHint: "4 block 18 tầng · ~1.400 căn",
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-kinh-bac-plaza",
    name: "Nhà ở xã hội Kinh Bắc Plaza",
    commercialName: "NOXH Kinh Bắc Plaza",
    developerName: "Công ty CP ĐT BĐS Kinh Bắc",
    developerTax: TAX.kinhBac,
    district: "TP. Bắc Ninh",
    ward: "Vũ Ninh",
    address: "Phường Vũ Ninh, TP. Bắc Ninh, Bắc Ninh",
    lat: 21.186,
    lng: 106.076,
    productHint: "2 block 19 tầng · ~600 căn",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-dabaco-khac-niem",
    name: "Nhà ở xã hội Dabaco Khắc Niệm",
    commercialName: "NOXH Dabaco Khắc Niệm",
    developerName: "Tập đoàn Dabaco",
    developerTax: TAX.dabaco,
    district: "TP. Bắc Ninh",
    ward: "Khắc Niệm",
    address: "Phường Khắc Niệm, TP. Bắc Ninh, Bắc Ninh",
    lat: 21.186,
    lng: 106.076,
    productHint: "2 block 19 tầng · ~480 căn",
  },
  {
    stt: 8,
    slug: "nha-o-xa-hoi-evergreen-bac-ninh",
    name: "Nhà ở xã hội Evergreen Bắc Ninh",
    commercialName: "NOXH Evergreen Bắc Ninh",
    developerName: "Công ty CP HUD2",
    developerTax: TAX.hud2,
    district: "Tiên Du",
    ward: "Đại Đồng",
    address: "Xã Đại Đồng, huyện Tiên Du, Bắc Ninh (VSIP)",
    lat: 21.12,
    lng: 106.0,
    productHint: "5 block 11 tầng · ~1.100 căn",
  },
];

function skeletonDef(row: BnRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-bn-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Bắc Ninh",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. CĐT theo danh mục House X: ${row.developerName}. Thuộc tỉnh Bắc Ninh sau NQ 2025 (Bắc Giang cũ).${tip} Skeleton — giá / suất cập nhật khi có Sở XD hoặc CĐT. Tư vấn điều kiện qua House X.`,
    seoTitle: `${row.name} — Bắc Ninh | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Bắc Ninh. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Bắc Ninh${tip} — catalog House X`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Bắc Giang sáp nhập vào tỉnh Bắc Ninh mới. Cụm KCN Yên Phong (Samsung corridor) · Quế Võ · VSIP Tiên Du. Tọa độ ước lượng.

Đối chiếu soxaydung.bacninh.gov.vn / soxaydung.bacgiang.gov.vn (legacy). House X: wiki NOXH + form tư vấn.`,
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
        q: `${row.name} thuộc Bắc Ninh hay Bắc Giang?`,
        a: "Canonical House X: Bắc Ninh (sau NQ 2025). Tên Bắc Giang / Yên Phong / Quế Võ vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Bắc Ninh`,
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

/** Enrich STT-1 — Cát Tường Smart City (2026-07-23). Sở / CĐT > PDF giá. */
function enrichCatTuong(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Cát Tường Smart City",
    commercialName: "NOXH Cát Tường Smart City · Yên Phong",
    developerName: "Công ty CP Cát Tường",
    address:
      "Xã Yên Trung và Thụy Hòa (Tam Đa), huyện Yên Phong, Bắc Ninh — gần KCN Yên Phong",
    totalArea: 94075,
    totalUnits: 1040,
    blocks: 9,
    status: "DANG_BAN",
    description:
      "Nhà ở xã hội Cát Tường Smart City tại Yên Trung & Thụy Hòa, Yên Phong — hành lang Samsung · KCN Yên Phong. CĐT CTCP Cát Tường. Sở/CĐT: ~9,4 ha (~94.075 m²), 9 khối K–T, ~1.040 căn (PDF inventory ghi 5 block ~1.000). Giá Sở công bố một số đợt ~15,4–16,3 triệu/m² (PDF nội bộ ~9,5–11,5 — ưu tiên Sở). Đang mở bán theo đợt. Tư vấn điều kiện qua House X — không công bố số điện thoại CĐT.",
    seoTitle:
      "Nhà ở xã hội Cát Tường Smart City — ~1.040 căn Yên Phong | House X",
    seoDesc:
      "NOXH Cát Tường Smart City Yên Phong: 9 khối ~1.040 căn, gần KCN Yên Phong. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Yên Phong · Samsung corridor · 9 khối · ~1.040 căn · đang mở bán theo đợt",
    locationNotes: `NOXH Cát Tường Smart City tại xã Yên Trung & Thụy Hòa, huyện Yên Phong, Bắc Ninh — cạnh hành lang công nghiệp Samsung · KCN Yên Phong.

Quy mô Sở/CĐT: 9 khối K–T · ~1.040 căn · ~94.075 m². Giá một số đợt Sở công bố ~15,4–16,3 triệu/m² (chưa VAT & phí bảo trì) — xác minh thông báo mới nhất trước nộp hồ sơ.

House X không thu đặt cọc thay CĐT · không công bố số điện thoại CĐT.`,
    highlights: [
      {
        title: "~1.040 căn · 9 khối K–T",
        text: "~9,4 ha tại Yên Phong · gần KCN Yên Phong. PDF inventory ghi ~5 block / ~1.000 — House X ưu tiên công bố Sở / CĐT.",
      },
      {
        title: "CĐT: Cát Tường",
        text: "CTCP Cát Tường — vốn tham chiếu ~1.778 tỷ. Hành lang Samsung Yên Phong.",
      },
      {
        title: "Giá — xác minh Sở",
        text: "Một số đợt Sở công bố ~15,4–16,3 triệu/m². Danh mục PDF ghi ~9,5–11,5 — không dùng làm bảng giá nộp hồ sơ.",
      },
    ],
    amenities: [
      "KCN Yên Phong · hành lang Samsung",
      "Hạ tầng kỹ thuật theo tiêu chuẩn NOXH",
      "Trường / y tế theo quy hoạch (theo dõi GPMB)",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư?",
        a: "CTCP Cát Tường. House X tư vấn qua form — không công bố số điện thoại CĐT.",
      },
      {
        q: "Bao nhiêu căn?",
        a: "Theo Sở / CĐT: khoảng 1.040 căn trên 9 khối (K–T). Đang mở bán theo đợt.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Đối chiếu thông báo Sở XD Bắc Ninh mới nhất (một số đợt ~15,4–16,3 triệu/m²). Không dựa vào mức PDF nội bộ thấp hơn.",
      },
    ],
    unitTypes: [
      {
        name: "Căn NOXH (theo đợt Sở)",
        areaMin: 45,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichCatTuong(DEFS[0]!);

export function allNoxhBacNinhSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhBacNinhDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhBacNinhDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhBacNinhSeedLanding(slug: string) {
  const def = getNoxhBacNinhDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhBacNinhMock(slug: string): ProjectDetail | null {
  const def = getNoxhBacNinhDef(slug);
  return def ? buildNoxhMock(def) : null;
}
