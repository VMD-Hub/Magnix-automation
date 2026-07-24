/**
 * 8 NOXH An Giang / Kiên Giang cũ — P0.2.
 * Nguồn: docs/content/AN_GIANG_NOXH_INVENTORY.md
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

type AgRow = {
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
};

const TAX = {
  cic: "HX-AG-CIC-GROUP",
  phuCuong: "HX-AG-PHU-CUONG-HOANG-GIA",
  cityland: "HX-AG-CITYLAND",
  nhatLan: "HX-AG-NHAT-LAN-PHUOC",
  xayLap: "HX-AG-XAY-LAP-AN-GIANG",
} as const;

const ROWS: AgRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-cic-lan-bien-tay-bac-rach-gia",
    name: "Nhà ở xã hội CIC lấn biển Tây Bắc Rạch Giá",
    commercialName: "NOXH KĐT lấn biển Tây Bắc Rạch Giá",
    developerName: "Tập đoàn CIC (CIC Group)",
    developerTax: TAX.cic,
    district: "Rạch Giá",
    ward: "Vĩnh Quang",
    address:
      "Khu C & D, KĐT mới lấn biển Tây Bắc, TP. Rạch Giá, An Giang (Kiên Giang cũ)",
    lat: 10.012,
    lng: 105.081,
    productHint: "liền kề trệt + 1 lầu",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-phu-cuong-phu-quy-rach-gia",
    name: "Nhà ở xã hội Phú Cường Phú Quý",
    commercialName: "NOXH KĐT Phú Cường Phú Quý",
    developerName: "Công ty CP Phú Cường Hoàng Gia",
    developerTax: TAX.phuCuong,
    district: "Rạch Giá",
    ward: "Rạch Giá",
    address: "Lô S, KĐT Phú Cường Phú Quý, TP. Rạch Giá, An Giang (Kiên Giang cũ)",
    lat: 10.015,
    lng: 105.085,
    productHint: "liền kề thấp tầng",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-cic-boulevard-rach-gia",
    name: "Nhà ở xã hội CIC Boulevard Rạch Giá",
    commercialName: "NOXH CIC Boulevard Rạch Giá",
    developerName: "Tập đoàn CIC (CIC Group)",
    developerTax: TAX.cic,
    district: "Rạch Giá",
    ward: "Vĩnh Quang",
    address: "Tuyến đường số 2, P. Vĩnh Quang, TP. Rạch Giá, An Giang (Kiên Giang cũ)",
    lat: 10.018,
    lng: 105.09,
    productHint: "liền kề trệt + 1 lầu",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-444-ngo-quyen-rach-gia",
    name: "Nhà ở xã hội 444 Ngô Quyền",
    commercialName: "NOXH 444 Ngô Quyền",
    developerName: "Tập đoàn CIC (CIC Group)",
    developerTax: TAX.cic,
    district: "Rạch Giá",
    ward: "Rạch Giá",
    address: "Số 444 đường Ngô Quyền, TP. Rạch Giá, An Giang (Kiên Giang cũ)",
    lat: 10.01,
    lng: 105.088,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-rach-tram-phu-quoc",
    name: "Nhà ở xã hội Rạch Tràm Phú Quốc",
    commercialName: "NOXH Rạch Tràm Phú Quốc",
    developerName: "CityLand (CTCP Đầu tư Địa ốc Thành phố)",
    developerTax: TAX.cityland,
    district: "Phú Quốc",
    ward: "Bãi Thơm",
    address: "KDC Rạch Tràm, xã Bãi Thơm, TP. Phú Quốc, An Giang (Kiên Giang cũ)",
    lat: 10.35,
    lng: 104.05,
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-golden-city-long-xuyen",
    name: "Nhà ở xã hội Golden City Long Xuyên",
    commercialName: "NOXH Golden City Long Xuyên",
    developerName: "CTCP Dịch vụ Thương mại & Đầu tư Nhất Lan Phước",
    developerTax: TAX.nhatLan,
    district: "Long Xuyên",
    ward: "Mỹ Hòa",
    address: "Phường Mỹ Hòa, TP. Long Xuyên, An Giang",
    lat: 10.386,
    lng: 105.435,
    productHint: "chung cư cao tầng",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-tay-dai-hoc-long-xuyen",
    name: "Nhà ở xã hội Tây Đại Học Long Xuyên",
    commercialName: "NOXH Tây Đại Học Long Xuyên",
    developerName: "Công ty CP Xây lắp An Giang",
    developerTax: TAX.xayLap,
    district: "Long Xuyên",
    ward: "Mỹ Hòa",
    address: "Phường Mỹ Hòa, TP. Long Xuyên, An Giang",
    lat: 10.39,
    lng: 105.43,
  },
  {
    stt: 8,
    slug: "nha-o-xa-hoi-binh-khanh-long-xuyen",
    name: "Nhà ở xã hội Bình Khánh",
    commercialName: "NOXH Bình Khánh Long Xuyên",
    developerName: "Công ty Cổ phần Xây lắp An Giang",
    developerTax: TAX.xayLap,
    district: "Long Xuyên",
    ward: "Bình Khánh",
    address: "Phường Bình Khánh, TP. Long Xuyên, An Giang",
    lat: 10.38,
    lng: 105.44,
  },
];

function skeletonDef(row: AgRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-ag-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: "SAP_MO_BAN",
    province: "An Giang",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}. Thuộc tỉnh An Giang sau sắp xếp (Kiên Giang cũ nếu Rạch Giá / Phú Quốc).${tip} Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — An Giang | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, An Giang. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, An Giang${tip}`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Kiên Giang sáp nhập vào tỉnh An Giang mới. Vị trí trên bản đồ đang được xác minh.

Đối chiếu soxaydung.angiang.gov.vn. Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
    highlights: [
      { title: "Vị trí", text: row.address },
      { title: "Chủ đầu tư", text: row.developerName },
      {
        title: "Loại hình",
        text: row.productHint
          ? `Đặc thù khu vực: ${row.productHint}.`
          : NOXH_TYPE_VERIFYING,
      },
    ],
    amenities: [NOXH_AMENITIES_VERIFYING],
    faqs: [
      {
        q: `${row.name} thuộc An Giang hay Kiên Giang?`,
        a: "Theo House X: An Giang (sau NQ 2025). Tên Kiên Giang / Rạch Giá / Phú Quốc vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — An Giang`,
    },
    gallery: [],
    unitTypes: [
      {
        name: row.productHint?.includes("liền kề")
          ? "Nhà liền kề NOXH (trệt + 1 lầu)"
          : "Căn hộ / nhà NOXH (theo CĐT)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich STT-1 — cicgroups.com (2026-07-23). */
function enrichCicTayBac(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội CIC lấn biển Tây Bắc Rạch Giá",
    commercialName: "NOXH KĐT mới lấn biển Tây Bắc · Khu C & D",
    developerName: "Công ty CP Tập đoàn CIC (CIC Group)",
    address:
      "Khu C & D, KĐT mới lấn biển Tây Bắc, TP. Rạch Giá, An Giang (Kiên Giang cũ)",
    totalArea: 70466.09,
    totalUnits: 1011,
    blocks: 2,
    description:
      "Nhà ở xã hội tại KĐT mới lấn biển Tây Bắc TP. Rạch Giá (Khu C & D) do CIC Group làm CĐT (cicgroups.com). Quy mô ~70.466 m², 1.011 căn liền kề thấp tầng (trệt + 1 lầu), diện tích sàn ~114–141 m²/căn, vốn đầu tư xây dựng ~1.562 tỷ đồng. Giá bán tham chiếu CĐT từ ~1,5 tỷ/căn. Dự án NOXH thấp tầng liền kề đầu tiên của tỉnh Kiên Giang (cũ). Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội CIC Tây Bắc Rạch Giá — 1.011 căn liền kề | House X",
    seoDesc:
      "NOXH CIC lấn biển Tây Bắc (Rạch Giá, An Giang): 1.011 căn trệt+1 lầu, từ ~1,5 tỷ/căn (CĐT). Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Rạch Giá · 1.011 căn liền kề trệt+1 lầu · từ ~1,5 tỷ/căn (CIC) · Khu C & D Tây Bắc",
    locationNotes: `NOXH KĐT lấn biển Tây Bắc tại Khu C & D, TP. Rạch Giá — trong quy hoạch đô thị Tây Bắc, gần cảng hành khách Rạch Giá (theo CIC).

Theo địa giới hiện hành: An Giang (sau sáp nhập Kiên Giang). Nguồn: cicgroups.com — đối chiếu Sở Xây dựng trước khi nộp hồ sơ.

House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "1.011 căn liền kề trệt + 1 lầu",
        text: "Theo CIC: diện tích sàn xây dựng ~114,4–141,2 m²/căn — NOXH thấp tầng liền kề đầu tiên của Kiên Giang (cũ).",
      },
      {
        title: "Giá từ ~1,5 tỷ/căn",
        text: "Tham chiếu website chủ đầu tư khoảng từ 1,5 tỷ/căn — xác minh bảng niêm yết / Sở trước khi nộp hồ sơ.",
      },
      {
        title: "CIC Group · KĐT Tây Bắc",
        text: "Thụ hưởng tiện ích đô thị Tây Bắc: công viên, TTTM, kết nối cảng hành khách (theo CĐT).",
      },
    ],
    amenities: [
      "Công viên / cây xanh KĐT Tây Bắc",
      "Gần cảng hành khách Rạch Giá",
      "Kết nối đường Lý Thường Kiệt / nội khu",
    ],
    faqs: [
      {
        q: "NOXH CIC Tây Bắc thuộc An Giang hay Kiên Giang?",
        a: "Theo House X: An Giang. Địa chỉ: TP. Rạch Giá — trước thuộc tỉnh Kiên Giang.",
      },
      {
        q: "Đây là chung cư hay nhà liền kề?",
        a: "Theo CIC: nhà ở xã hội liền kề thấp tầng (trệt + 1 lầu), không phải chung cư cao tầng.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "CĐT công bố từ khoảng 1,5 tỷ đồng/căn. Xác minh bảng giá / điều kiện đối tượng trên kênh Sở XD hoặc CIC.",
      },
    ],
    unitTypes: [
      {
        name: "Liền kề NOXH trệt + 1 lầu (~114–141 m² sàn)",
        areaMin: 114.4,
        areaMax: 141.2,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichCicTayBac(DEFS[0]!);

export function allNoxhAnGiangSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhAnGiangDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhAnGiangDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhAnGiangSeedLanding(slug: string) {
  const def = getNoxhAnGiangDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhAnGiangMock(slug: string): ProjectDetail | null {
  const def = getNoxhAnGiangDef(slug);
  return def ? buildNoxhMock(def) : null;
}
