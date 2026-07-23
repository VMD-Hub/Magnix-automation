/**
 * 26 NOXH TP.HCM mega-city (HCM + Bình Dương + BR-VT cũ) — P0.5.
 * Nguồn: docs/content/HCM_MEGA_NOXH_INVENTORY.md
 * HGX (`nha-o-xa-hoi-ho-guom-xanh-thuan-an`) seed riêng qua db:seed:hgx.
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type HcmRow = {
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
  legacyNote?: string;
};

const TAX = {
  vinhomes: "HX-HCM-VINHOMES",
  leThanh: "HX-HCM-LE-THANH",
  xuanMaiSg: "HX-HCM-XUAN-MAI-SG",
  ducKhai: "HX-HCM-DUC-KHAI",
  namLong: "HX-HCM-NAM-LONG",
  thuducHouse: "HX-HCM-THUDUC-HOUSE",
  tanimex: "HX-HCM-TANIMEX",
  hiepPhuoc: "HX-HCM-HIEP-PHUOC",
  cc1: "HX-HCM-CC1",
  hungThinh: "HX-HCM-HUNG-THINH",
  suoiTien: "HX-HCM-SUOI-TIEN",
  lienDanh: "HX-HCM-LIEN-DANH",
  vinhLoc: "HX-HCM-VINH-LOC",
  maySaiGon: "HX-HCM-MAY-SG",
  phucDat: "HX-HCM-PHUC-DAT",
  hud: "HX-HCM-HUD",
  kimOanh: "HX-HCM-KIM-OANH",
  becamex: "HX-HCM-BECAMEX",
  hodeco: "HX-HCM-HODECO",
  sonadezi: "HX-HCM-SONADEZI",
  adec: "HX-HCM-ADEC",
  gateTowers: "HX-HCM-GATE-TOWERS",
  goCat: "HX-HCM-GO-CAT",
} as const;

const ROWS: HcmRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-happy-home-long-phuoc",
    name: "Nhà ở xã hội Happy Home Long Phước",
    commercialName: "Thành Phố Xanh · Happy Home Long Phước",
    developerName: "Vinhomes (Tập đoàn Vingroup)",
    developerTax: TAX.vinhomes,
    district: "TP. Thủ Đức",
    ward: "Long Phước",
    address: "Long Phước, TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.84,
    lng: 106.88,
    productHint: "KĐT ~44 ha · Thành Phố Xanh",
    status: "SAP_MO_BAN",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-le-thanh-tan-kien",
    name: "Nhà ở xã hội Lê Thành Tân Kiên",
    commercialName: "NOXH Lê Thành Tân Kiên",
    developerName: "Công ty CP Đầu tư Xây dựng Lê Thành",
    developerTax: TAX.leThanh,
    district: "Bình Chánh",
    ward: "Tân Kiên",
    address: "Tân Kiên, huyện Bình Chánh, TP. Hồ Chí Minh",
    lat: 10.72,
    lng: 106.58,
    productHint: "~1.456 căn",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-mr1-tan-thuan-tay",
    name: "Nhà ở xã hội MR1 Tân Thuận Tây",
    commercialName: "NOXH MR1 Tân Thuận Tây",
    developerName: "Công ty CP Xuân Mai Sài Gòn",
    developerTax: TAX.xuanMaiSg,
    district: "Quận 7",
    ward: "Tân Thuận Tây",
    address: "Phường Tân Thuận Tây, Quận 7, TP. Hồ Chí Minh",
    lat: 10.74,
    lng: 106.71,
    productHint: "715 căn",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-ly-thuong-kiet",
    name: "Nhà ở xã hội Lý Thường Kiệt",
    commercialName: "NOXH Lý Thường Kiệt",
    developerName: "Công ty CP Đầu tư Đức Khải",
    developerTax: TAX.ducKhai,
    district: "Quận 10",
    ward: "Phường 15",
    address: "260 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh",
    lat: 10.77,
    lng: 106.66,
    productHint: "~1.200 căn",
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-le-thanh-le-minh-xuan",
    name: "Nhà ở xã hội Lê Thành Lê Minh Xuân",
    commercialName: "NOXH Lê Thành Lê Minh Xuân",
    developerName: "Công ty CP Đầu tư Xây dựng Lê Thành",
    developerTax: TAX.leThanh,
    district: "Bình Chánh",
    ward: "Lê Minh Xuân",
    address: "Lê Minh Xuân, huyện Bình Chánh, TP. Hồ Chí Minh",
    lat: 10.7,
    lng: 106.6,
    productHint: "~600 căn",
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-nguyen-son-mizuki-gd2",
    name: "Nhà ở xã hội Nguyên Sơn Mizuki GĐ2",
    commercialName: "EHomeS Mizuki · KDC Nguyên Sơn GĐ2",
    developerName: "Tập đoàn Nam Long",
    developerTax: TAX.namLong,
    district: "Bình Chánh",
    ward: "Bình Hưng",
    address: "Bình Hưng, huyện Bình Chánh, TP. Hồ Chí Minh",
    lat: 10.72,
    lng: 106.68,
    productHint: "KDC Nguyên Sơn giai đoạn 2",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-kho-cang-truong-tho",
    name: "Nhà ở xã hội Kho Cảng Trường Thọ",
    commercialName: "NOXH Kho Cảng Trường Thọ",
    developerName: "Công ty CP Thuduc House",
    developerTax: TAX.thuducHouse,
    district: "TP. Thủ Đức",
    ward: "Trường Thọ",
    address: "Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.85,
    lng: 106.75,
    productHint: "~1.000 căn",
  },
  {
    stt: 8,
    slug: "nha-o-xa-hoi-kcn-tan-binh",
    name: "Nhà ở xã hội KCN Tân Bình",
    commercialName: "NOXH KCN Tân Bình",
    developerName: "Công ty CP Tanimex",
    developerTax: TAX.tanimex,
    district: "Tân Phú",
    ward: "Tây Thạnh",
    address: "Tây Thạnh, quận Tân Phú, TP. Hồ Chí Minh",
    lat: 10.79,
    lng: 106.63,
    productHint: "~300 căn · công nhân KCN",
  },
  {
    stt: 9,
    slug: "nha-o-xa-hoi-hiep-phuoc",
    name: "Nhà ở xã hội Hiệp Phước",
    commercialName: "NOXH Hiệp Phước",
    developerName: "CTCP Phát triển Hạ tầng KCN Hiệp Phước",
    developerTax: TAX.hiepPhuoc,
    district: "Nhà Bè",
    ward: "Hiệp Phước",
    address: "Hiệp Phước, huyện Nhà Bè, TP. Hồ Chí Minh",
    lat: 10.65,
    lng: 106.72,
    productHint: "~1.500 căn",
  },
  {
    stt: 10,
    slug: "nha-o-xa-hoi-cc1-binh-dang",
    name: "Nhà ở xã hội CC1 Bình Đăng",
    commercialName: "NOXH CC1 Bình Đăng",
    developerName: "Tổng Công ty CP Xây dựng số 1 (CC1)",
    developerTax: TAX.cc1,
    district: "Quận 8",
    ward: "Phường 6",
    address: "Quốc lộ 50, Phường 6, Quận 8, TP. Hồ Chí Minh",
    lat: 10.74,
    lng: 106.65,
  },
  {
    stt: 11,
    slug: "nha-o-xa-hoi-9x-quy-duc",
    name: "Nhà ở xã hội 9X Quy Đức",
    commercialName: "NOXH 9X Quy Đức",
    developerName: "Công ty CP Hưng Thịnh",
    developerTax: TAX.hungThinh,
    district: "Bình Chánh",
    ward: "Quy Đức",
    address: "Quy Đức, huyện Bình Chánh, TP. Hồ Chí Minh",
    lat: 10.68,
    lng: 106.62,
  },
  {
    stt: 12,
    slug: "nha-o-xa-hoi-suoi-tien",
    name: "Nhà ở xã hội Suối Tiên",
    commercialName: "NOXH Suối Tiên",
    developerName: "CTCP Suối Tiên",
    developerTax: TAX.suoiTien,
    district: "TP. Thủ Đức",
    ward: "Tân Phú",
    address: "Tân Phú, TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.87,
    lng: 106.82,
    productHint: "~800 căn",
  },
  {
    stt: 13,
    slug: "nha-o-xa-hoi-long-binh-thu-duc",
    name: "Nhà ở xã hội Long Bình Thủ Đức",
    commercialName: "NOXH Long Bình",
    developerName: "Liên danh nhà đầu tư được phê duyệt",
    developerTax: TAX.lienDanh,
    district: "TP. Thủ Đức",
    ward: "Long Bình",
    address: "Long Bình, TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.88,
    lng: 106.84,
  },
  {
    stt: 14,
    slug: "nha-o-xa-hoi-vinh-loc-b",
    name: "Nhà ở xã hội Vĩnh Lộc B",
    commercialName: "NOXH Vĩnh Lộc B",
    developerName: "Công ty CP Địa ốc Vĩnh Lộc",
    developerTax: TAX.vinhLoc,
    district: "Bình Tân",
    ward: "Vĩnh Lộc B",
    address: "Vĩnh Lộc B, quận Bình Tân, TP. Hồ Chí Minh",
    lat: 10.82,
    lng: 106.58,
  },
  {
    stt: 15,
    slug: "nha-o-xa-hoi-linh-trung",
    name: "Nhà ở xã hội Linh Trung",
    commercialName: "NOXH Linh Trung",
    developerName: "Công ty CP May Sài Gòn",
    developerTax: TAX.maySaiGon,
    district: "TP. Thủ Đức",
    ward: "Linh Trung",
    address: "Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.85,
    lng: 106.72,
  },
  {
    stt: 16,
    slug: "nha-o-xa-hoi-phuc-dat-tan-uyen",
    name: "Nhà ở xã hội Phúc Đạt Tân Uyên",
    commercialName: "NOXH Phúc Đạt Tân Uyên",
    developerName: "Công ty CP Phúc Đạt",
    developerTax: TAX.phucDat,
    district: "Tân Uyên",
    ward: "Tân Hiệp",
    address:
      "Tân Hiệp, TP. Tân Uyên, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 11.05,
    lng: 106.78,
    productHint: "936 căn · 3 block 18 tầng",
    status: "DANG_BAN",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 17,
    slug: "nha-o-xa-hoi-an-sinh-chanh-my",
    name: "Nhà ở xã hội An Sinh Chánh Mỹ HUD",
    commercialName: "NOXH An Sinh Chánh Mỹ",
    developerName: "Tổng Công ty HUD",
    developerTax: TAX.hud,
    district: "Thủ Dầu Một",
    ward: "Chánh Mỹ",
    address:
      "Chánh Mỹ, TP. Thủ Dầu Một, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 11.0,
    lng: 106.65,
    productHint: "978 căn",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 18,
    slug: "nha-o-xa-hoi-khome-new-city-hoa-phu",
    name: "Nhà ở xã hội K-Home New City Hòa Phú",
    commercialName: "K-Home New City Hòa Phú",
    developerName: "Công ty CP Kim Oanh",
    developerTax: TAX.kimOanh,
    district: "Thủ Dầu Một",
    ward: "Hòa Phú",
    address:
      "Hòa Phú, TP. Thủ Dầu Một, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 10.98,
    lng: 106.68,
    productHint: "~3.000 căn",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 19,
    slug: "nha-o-xa-hoi-becamex-hoa-loi",
    name: "Nhà ở xã hội Becamex Bến Cát Hòa Lợi",
    commercialName: "NOXH Becamex Hòa Lợi",
    developerName: "Tổng Công ty Becamex IDC",
    developerTax: TAX.becamex,
    district: "Bến Cát",
    ward: "Hòa Lợi",
    address:
      "Hòa Lợi, TP. Bến Cát, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 11.15,
    lng: 106.6,
    productHint: "~1.500 căn",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 20,
    slug: "nha-o-xa-hoi-becamex-bau-bang",
    name: "Nhà ở xã hội Becamex Bàu Bàng",
    commercialName: "NOXH Becamex Bàu Bàng",
    developerName: "Tổng Công ty Becamex IDC",
    developerTax: TAX.becamex,
    district: "Bàu Bàng",
    ward: "Bàu Bàng",
    address:
      "TP. Bàu Bàng, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 11.25,
    lng: 106.55,
    productHint: "~1.000 căn",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 21,
    slug: "nha-o-xa-hoi-kim-oanh-ben-cat",
    name: "Nhà ở xã hội Kim Oanh Bến Cát",
    commercialName: "NOXH Kim Oanh Bến Cát",
    developerName: "Công ty CP Kim Oanh",
    developerTax: TAX.kimOanh,
    district: "Bến Cát",
    ward: "Mỹ Phước",
    address:
      "Mỹ Phước, TP. Bến Cát, TP. Hồ Chí Minh (Bình Dương cũ)",
    lat: 11.12,
    lng: 106.58,
    productHint: "~1.200 căn",
    legacyNote: "Bình Dương cũ",
  },
  {
    stt: 22,
    slug: "nha-o-xa-hoi-eco-home-1-phu-my",
    name: "Nhà ở xã hội Eco Home 1 Phú Mỹ",
    commercialName: "Eco Home 1 (CC1) Hodeco",
    developerName: "Công ty CP Hodeco",
    developerTax: TAX.hodeco,
    district: "Phú Mỹ",
    ward: "Phú Mỹ",
    address:
      "TP. Phú Mỹ, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    lat: 10.58,
    lng: 107.05,
    productHint: "340 căn · 32–59 m²",
    status: "DANG_BAN",
    legacyNote: "BR-VT cũ",
  },
  {
    stt: 23,
    slug: "nha-o-xa-hoi-sonadezi-huu-phuoc",
    name: "Nhà ở xã hội Sonadezi Hữu Phước",
    commercialName: "NOXH Sonadezi Hữu Phước",
    developerName: "Tổng Công ty Sonadezi",
    developerTax: TAX.sonadezi,
    district: "Châu Đức",
    ward: "Hữu Phước",
    address:
      "Hữu Phước, huyện Châu Đức, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    lat: 10.65,
    lng: 107.25,
    legacyNote: "BR-VT cũ",
  },
  {
    stt: 24,
    slug: "nha-o-xa-hoi-cc2-phu-my",
    name: "Nhà ở xã hội CC2 Phú Mỹ",
    commercialName: "NOXH CC2 Phú Mỹ",
    developerName: "Công ty CP ADEC",
    developerTax: TAX.adec,
    district: "Phú Mỹ",
    ward: "Phú Mỹ",
    address:
      "TP. Phú Mỹ, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    lat: 10.57,
    lng: 107.04,
    productHint: "~914 căn",
    legacyNote: "BR-VT cũ",
  },
  {
    stt: 25,
    slug: "nha-o-xa-hoi-gate-towers-phu-my",
    name: "Nhà ở xã hội Gate Towers Phú Mỹ",
    commercialName: "NOXH Gate Towers Phú Mỹ",
    developerName: "Chủ đầu tư được phê duyệt",
    developerTax: TAX.gateTowers,
    district: "Phú Mỹ",
    ward: "Phú Mỹ",
    address:
      "TP. Phú Mỹ, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    lat: 10.59,
    lng: 107.06,
    productHint: "~2.184 căn",
    legacyNote: "BR-VT cũ",
  },
  {
    stt: 26,
    slug: "nha-o-xa-hoi-go-cat-2-ba-ria",
    name: "Nhà ở xã hội Gò Cát 2 Bà Rịa",
    commercialName: "NOXH Gò Cát 2",
    developerName: "Chủ đầu tư được phê duyệt",
    developerTax: TAX.goCat,
    district: "Bà Rịa",
    ward: "Gò Cát",
    address:
      "Gò Cát, TP. Bà Rịa, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    lat: 10.5,
    lng: 107.17,
    productHint: "~600 căn",
    legacyNote: "BR-VT cũ",
  },
];

function skeletonDef(row: HcmRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  const legacy =
    row.legacyNote != null
      ? ` Thuộc mega-city TP.HCM sau NQ 2025 (${row.legacyNote}).`
      : "";
  return {
    id: `preview-hcm-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "TP. Hồ Chí Minh",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. CĐT theo danh mục House X: ${row.developerName}.${legacy}${tip} Skeleton — giá / suất cập nhật khi có Sở XD hoặc CĐT. Tư vấn điều kiện qua House X.`,
    seoTitle: `${row.name} — TP.HCM | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, TP. Hồ Chí Minh. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, TP.HCM${tip} — catalog House X`,
    locationNotes: `${row.name}: ${row.address}.

Canonical House X: tỉnh **TP. Hồ Chí Minh** (mega-city).${legacy ? ` Địa chỉ kép giữ tên ${row.legacyNote} để tra cứu.` : ""} Tọa độ ước lượng.

Đối chiếu soxaydung.hochiminhcity.gov.vn. House X: wiki NOXH + form tư vấn.`,
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
        q: `${row.name} thuộc tỉnh nào trên House X?`,
        a: "Canonical: TP. Hồ Chí Minh (mega-city sau NQ 2025). Tên Bình Dương / BR-VT / quận-huyện cũ vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — TP.HCM`,
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

/** Enrich STT-1 — Happy Home Long Phước (2026-07-23). */
function enrichHappyHomeLongPhuoc(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    commercialName: "Thành Phố Xanh · Happy Home Long Phước",
    developerName: "Vinhomes (Tập đoàn Vingroup)",
    totalArea: 441600,
    description:
      "Nhà ở xã hội Happy Home Long Phước (Thành Phố Xanh) tại Long Phước, TP. Thủ Đức — dự án Vinhomes trong cụm NOXH Đông TP.HCM. Quy mô đất ~44,16 ha (441.600 m²). PDF nội bộ ghi “Grand Park / Long Thạnh Mỹ ~4.300 căn” — House X chưa xác minh số căn, không invent totalUnits. Không nhầm với Happy Home Cam Ranh (Khánh Hòa) hay Happy Home Nhơn Trạch (Đồng Nai). Tư vấn điều kiện qua House X.",
    seoTitle:
      "Happy Home Long Phước — Thành Phố Xanh Vinhomes · 44 ha | House X",
    seoDesc:
      "NOXH Happy Home Long Phước (Vinhomes): KĐT ~44 ha Long Phước, Thủ Đức. Khác Happy Home Cam Ranh. Tra cứu điều kiện trên House X.",
    heroSubtitle:
      "Thành Phố Xanh · Long Phước · ~44 ha · Vinhomes — không nhầm Cam Ranh",
    locationNotes: `Happy Home Long Phước (Thành Phố Xanh) tại Long Phước, TP. Thủ Đức, TP. Hồ Chí Minh.

PDF danh mục ghi tên “Happy Home Grand Park / Long Thạnh Mỹ” — research ưu tiên **Long Phước / Thành Phố Xanh**. Quy mô đất ~44,16 ha. Số căn PDF ~4.300 chưa được House X xác minh độc lập.

Phân biệt: nha-o-xa-hoi-happy-home-cam-ranh (Khánh Hòa) là dự án Vinhomes khác hẳn.

House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "KĐT ~44,16 ha Long Phước",
        text: "Diện tích đất ~441.600 m² theo research. Số căn PDF ~4.300 — chưa xác minh; không hiển thị totalUnits cho đến khi có Sở / CĐT.",
      },
      {
        title: "Vinhomes · Thành Phố Xanh",
        text: "CĐT Vinhomes (Vingroup). Tên thương mại ưu tiên Thành Phố Xanh / Happy Home Long Phước — không dùng nhầm Grand Park Cam Ranh.",
      },
      {
        title: "PDF vs research",
        text: "PDF ghi Long Thạnh Mỹ / Grand Park — đối chiếu Sở XD TP.HCM trước khi nộp hồ sơ.",
      },
    ],
    amenities: [
      "Hạ tầng KĐT theo masterplan Vinhomes",
      "Kết nối Long Phước — cửa ngõ Đông TP.HCM",
      "Tiện ích NOXH theo công bố CĐT (bổ sung khi research)",
    ],
    faqs: [
      {
        q: "Happy Home Long Phước có phải Happy Home Cam Ranh không?",
        a: "Không. Cam Ranh (Khánh Hòa) slug nha-o-xa-hoi-happy-home-cam-ranh. Long Phước (Thủ Đức, TP.HCM) là dự án riêng.",
      },
      {
        q: "Bao nhiêu căn?",
        a: "PDF nội bộ ~4.300 căn — House X chưa xác minh. Không invent số liệu trên landing.",
      },
      {
        q: "Grand Park là gì?",
        a: "PDF danh mục dùng tên Grand Park / Long Thạnh Mỹ. Research ưu tiên Long Phước · Thành Phố Xanh.",
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "dang_lam" }],
  };
}

/** Enrich STT-16 — Phúc Đạt Tân Uyên (2026-07-23). */
function enrichPhucDatTanUyen(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    status: "DANG_BAN",
    totalUnits: 936,
    blocks: 3,
    totalArea: 11440.8,
    description:
      "Nhà ở xã hội Phúc Đạt Tân Uyên tại Tân Hiệp, TP. Tân Uyên — canonical TP.HCM (Bình Dương cũ). CĐT Phúc Đạt: 936 căn, 3 block 18 tầng trên ~11.440,8 m² đất; căn hộ ~32–62 m²; vốn ~1.300 tỷ theo công bố / báo. Đang bán theo danh mục Sở. Tư vấn điều kiện qua House X — đối chiếu phucdat.vn và Sở XD.",
    seoTitle:
      "NOXH Phúc Đạt Tân Uyên — 936 căn · 3×18 tầng | House X",
    seoDesc:
      "Phúc Đạt Tân Uyên: 936 căn NOXH, 3 block 18 tầng, ~32–62 m², Tân Uyên (Bình Dương cũ). Tra cứu điều kiện trên House X.",
    heroSubtitle:
      "Phúc Đạt · Tân Uyên · 936 căn · 3 block 18 tầng · ~32–62 m² · DANG_BAN",
    locationNotes: `NOXH Phúc Đạt Tân Uyên — Tân Hiệp, TP. Tân Uyên, TP. Hồ Chí Minh (Bình Dương cũ).

Quy mô: 936 căn · 3 block cao 18 tầng · diện tích đất 11.440,8 m² · căn hộ ~32–62 m² · vốn ~1.300 tỷ.

Nguồn: phucdat.vn · CafeF · Sở Xây dựng TP.HCM. House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "936 căn · 3 block 18 tầng",
        text: "Quy mô theo danh mục NOXH và công bố CĐT Phúc Đạt.",
      },
      {
        title: "11.440,8 m² · ~32–62 m²/căn",
        text: "Diện tích đất và loại căn theo research / Sở.",
      },
      {
        title: "Bình Dương cũ — hub TP.HCM",
        text: "Canonical province TP.HCM; địa chỉ kép giữ Tân Uyên (Bình Dương cũ) để tra cứu.",
      },
    ],
    unitTypes: [
      {
        name: "Căn hộ NOXH (~32–62 m²)",
        areaMin: 32,
        areaMax: 62,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

/** Enrich STT-22 — Eco Home 1 Phú Mỹ (2026-07-23). */
function enrichEcoHome1PhuMy(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    status: "DANG_BAN",
    totalUnits: 340,
    totalArea: 3767.5,
    address:
      "TP. Phú Mỹ, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ)",
    description:
      "Nhà ở xã hội Eco Home 1 (CC1) do Hodeco phát triển tại **Phú Mỹ** — canonical TP.HCM (BR-VT cũ). PDF danh mục ghi sai P.11 Vũng Tàu; research xác nhận Phú Mỹ. 340 căn trên ~3.767,5 m²; diện tích căn 32,32–59,41 m²; giá tham chiếu ~19,87 tr/m² (xác minh Sở). Khởi công 11/2024. Tư vấn điều kiện qua House X.",
    seoTitle: "Eco Home 1 Phú Mỹ — 340 căn Hodeco · 32–59 m² | House X",
    seoDesc:
      "NOXH Eco Home 1 Phú Mỹ (Hodeco): 340 căn, 32–59 m², ~19,87 tr/m². Sửa PDF P.11 VT → Phú Mỹ. Tra cứu trên House X.",
    heroSubtitle:
      "Hodeco · Phú Mỹ · 340 căn · 32–59 m² · khởi công 11/2024 · không phải P.11 VT",
    locationNotes: `Eco Home 1 (CC1) Hodeco — **TP. Phú Mỹ**, TP. Hồ Chí Minh (Bà Rịa – Vũng Tàu cũ).

PDF nội bộ ghi nhầm P.11 Vũng Tàu — House X canonical **Phú Mỹ**.

340 căn · đất 3.767,5 m² · căn 32,32–59,41 m² · giá tham chiếu ~19,87 tr/m² · khởi công 11/2024.

House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "340 căn · Phú Mỹ (sửa PDF)",
        text: "PDF sai P.11 Vũng Tàu — vị trí đúng TP. Phú Mỹ, BR-VT cũ.",
      },
      {
        title: "32,32–59,41 m² · ~19,87 tr/m²",
        text: "Diện tích và giá tham chiếu báo — xác minh Sở trước nộp hồ sơ.",
      },
      {
        title: "Khởi công 11/2024",
        text: "Tiến độ thi công theo báo địa phương — cập nhật theo CĐT.",
      },
    ],
    unitTypes: [
      {
        name: "Căn hộ NOXH (32,32–59,41 m²)",
        areaMin: 32.32,
        areaMax: 59.41,
        bedrooms: 2,
        priceFrom: 19870000,
      },
    ],
    faqs: [
      {
        q: "Eco Home 1 ở Vũng Tàu hay Phú Mỹ?",
        a: "Phú Mỹ (BR-VT cũ). PDF danh mục ghi P.11 Vũng Tàu — House X sửa theo research.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Tham chiếu ~19,87 tr/m² theo báo — xác minh Sở / CĐT trước khi nộp hồ sơ.",
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichHappyHomeLongPhuoc(DEFS[0]!);
DEFS[15] = enrichPhucDatTanUyen(DEFS[15]!);
DEFS[21] = enrichEcoHome1PhuMy(DEFS[21]!);

export function allNoxhHcmSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhHcmDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhHcmDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhHcmSeedLanding(slug: string) {
  const def = getNoxhHcmDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhHcmMock(slug: string): ProjectDetail | null {
  const def = getNoxhHcmDef(slug);
  return def ? buildNoxhMock(def) : null;
}
