/**
 * 7 NOXH Khánh Hòa / Ninh Thuận cũ — P0.5 Trung.
 * Nguồn: docs/content/KHANH_HOA_NOXH_INVENTORY.md
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

type KhRow = {
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
  muoiCamRanh: "HX-KH-MUOI-CAM-RANH",
  hqc: "HX-KH-HQC",
  phNhaTrang: "HX-KH-PH-NHA-TRANG",
  hoangQuanTv: "HX-KH-HOANG-QUAN-TV",
  lienDanhCamRanh: "HX-KH-LIEN-DANH-CAM-RANH",
  ptnKhanhHoa: "HX-KH-PTN-KHANH-HOA",
  vcn: "HX-KH-VCN",
} as const;

const ROWS: KhRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-happy-home-cam-ranh",
    name: "Nhà ở xã hội Happy Home Cam Ranh",
    commercialName: "Vinhomes Happy Home Cam Ranh (NOXH Cam Nghĩa)",
    developerName: "Công ty CP Muối Cam Ranh (Vinhomes / Vingroup)",
    developerTax: TAX.muoiCamRanh,
    district: "Cam Ranh",
    ward: "Cam Nghĩa",
    address:
      "Phường Cam Nghĩa (Bắc Cam Ranh), TP. Cam Ranh, Khánh Hòa — KĐT ven vịnh, gần QL1A",
    lat: 11.921,
    lng: 109.145,
    productHint: "thấp tầng / liền kề + căn hộ · ~87 ha",
    status: "DANG_BAN",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-hqc-nha-trang",
    name: "Nhà ở xã hội HQC Nha Trang",
    commercialName: "NOXH HQC Nha Trang",
    developerName: "Tập đoàn Hoàng Quân (HQC)",
    developerTax: TAX.hqc,
    district: "Nha Trang",
    ward: "Vĩnh Hòa",
    address: "Khối 4B, Phường Vĩnh Hòa, TP. Nha Trang, Khánh Hòa",
    lat: 12.285,
    lng: 109.195,
    productHint: "4 block 15–18 tầng",
    status: "DA_BAN_GIAO",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-ph-nha-trang",
    name: "Nhà ở xã hội PH Nha Trang",
    commercialName: "NOXH PH Nha Trang",
    developerName: "Công ty CP Thương mại Đầu tư P-H Nha Trang",
    developerTax: TAX.phNhaTrang,
    district: "Nha Trang",
    ward: "Vĩnh Trường",
    address: "Số 11 đường Võ Thị Sáu, P. Vĩnh Trường, TP. Nha Trang, Khánh Hòa",
    lat: 12.21,
    lng: 109.2,
    productHint: "3 tháp ~26 tầng",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-xuan-dinh-vinh-hiep",
    name: "Nhà ở xã hội Xuân Định (Vĩnh Hiệp)",
    commercialName: "NOXH Xuân Định Vĩnh Hiệp",
    developerName:
      "Công ty CP Tư vấn - Thương mại - Dịch vụ BĐS Hoàng Quân",
    developerTax: TAX.hoangQuanTv,
    district: "Nha Trang",
    ward: "Vĩnh Hiệp",
    address: "Xã / khu Vĩnh Hiệp, TP. Nha Trang, Khánh Hòa",
    lat: 12.27,
    lng: 109.16,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-kdt-ven-dam-cam-ranh",
    name: "Nhà ở xã hội KĐT ven đầm Cam Ranh",
    commercialName: "NOXH Cam Ranh (KĐT ven đầm)",
    developerName: "Liên danh nhà đầu tư được phê duyệt",
    developerTax: TAX.lienDanhCamRanh,
    district: "Cam Ranh",
    ward: "Cam Phú",
    address: "Phường Cam Phú & Cam Thuận, TP. Cam Ranh, Khánh Hòa",
    lat: 11.9,
    lng: 109.16,
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-phuoc-long-nha-trang",
    name: "Nhà ở xã hội KĐT mới Phước Long",
    commercialName: "NOXH KĐT mới Phước Long",
    developerName: "Công ty CP Phát triển Nhà Khánh Hòa",
    developerTax: TAX.ptnKhanhHoa,
    district: "Nha Trang",
    ward: "Phước Long",
    address: "Ô đất NOXH KĐT Phước Long, P. Phước Long, TP. Nha Trang, Khánh Hòa",
    lat: 12.24,
    lng: 109.18,
    productHint: "chung cư 10–12 tầng",
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-dien-khanh-nam-song-ca",
    name: "Nhà ở xã hội Diên Khánh (Nam Sông Ca)",
    commercialName: "NOXH Diên Khánh KĐT Nam Sông Ca",
    developerName: "Công ty CP Đầu tư VCN",
    developerTax: TAX.vcn,
    district: "Diên Khánh",
    ward: "Diên Khánh",
    address: "Thị trấn / khu Diên Khánh, huyện Diên Khánh, Khánh Hòa",
    lat: 12.255,
    lng: 109.1,
  },
];

function skeletonDef(row: KhRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-kh-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Khánh Hòa",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}. Thuộc tỉnh Khánh Hòa (Ninh Thuận cũ nếu khu vực Phan Rang / Ninh Chữ).${tip} Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — Khánh Hòa | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Khánh Hòa. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Khánh Hòa${tip}`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Ninh Thuận sáp nhập vào tỉnh Khánh Hòa. Vị trí trên bản đồ đang được xác minh.

Đối chiếu sxd.khanhhoa.gov.vn. Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
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
        q: `${row.name} thuộc Khánh Hòa hay Ninh Thuận?`,
        a: "Theo House X: Khánh Hòa (sau NQ 2025). Tên Ninh Thuận / Nha Trang / Cam Ranh vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Khánh Hòa`,
    },
    gallery: [],
    unitTypes: [
      {
        name: row.productHint?.includes("thấp tầng")
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

/** Enrich STT-1 — Happy Home Cam Ranh / Cam Nghĩa (2026-07-23). */
function enrichHappyHomeCamRanh(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Happy Home Cam Ranh",
    commercialName: "Vinhomes Happy Home Cam Ranh · Khu NOXH phường Cam Nghĩa",
    developerName: "Công ty CP Muối Cam Ranh (thuộc Vinhomes / Tập đoàn Vingroup)",
    address:
      "Phường Cam Nghĩa (Bắc Cam Ranh), TP. Cam Ranh, Khánh Hòa — phân khu 3 KĐT ven vịnh Cam Ranh, gần QL1A",
    totalArea: 876000,
    totalUnits: 3565,
    blocks: undefined,
    status: "DANG_BAN",
    description:
      "Nhà ở xã hội Happy Home Cam Ranh (pháp lý: Khu NOXH phường Cam Nghĩa) do CTCP Muối Cam Ranh — công ty thuộc Vinhomes / Vingroup — làm CĐT. Quy mô đất ~87,6 ha; Sở XD Khánh Hòa (CV 01/2026) ghi ~3.565 căn NOXH; khởi công 01/2024, mục tiêu đưa vào sử dụng khoảng QIV/2026. Vốn đầu tư tham chiếu ~3.756 tỷ đồng. Không nhầm với Happy Home Nhơn Trạch (Đồng Nai). Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội Happy Home Cam Ranh — ~3.565 căn Cam Nghĩa | House X",
    seoDesc:
      "NOXH Happy Home Cam Ranh (Cam Nghĩa, Khánh Hòa): ~87,6 ha, ~3.565 căn, CĐT Muối Cam Ranh / Vinhomes. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Cam Ranh · ~3.565 căn · ~87,6 ha · Muối Cam Ranh (Vinhomes) · mục tiêu ~QIV/2026",
    locationNotes: `Khu NOXH phường Cam Nghĩa / Happy Home Cam Ranh — TP. Cam Ranh, Khánh Hòa, trong KĐT ven vịnh, gần QL1A và sân bay Cam Ranh (theo CĐT).

Tên pháp lý Sở: Khu nhà ở xã hội phường Cam Nghĩa. Thương mại: Vinhomes Happy Home.

House X không thu đặt cọc thay CĐT. Đối chiếu sxd.khanhhoa.gov.vn.`,
    highlights: [
      {
        title: "~3.565 căn · ~87,6 ha",
        text: "Dự án NOXH quy mô lớn tại Cam Ranh theo Sở (01/2026) và công bố CĐT — thấp tầng / liền kề + căn hộ trong đô thị ven vịnh.",
      },
      {
        title: "Muối Cam Ranh · Vinhomes",
        text: "CĐT pháp lý: CTCP Muối Cam Ranh (thuộc Vinhomes). Khởi công 11/1/2024; vốn tham chiếu ~3.756 tỷ.",
      },
      {
        title: "Giá — xác minh Sở",
        text: "Danh mục nội bộ ghi khoảng 8–12 triệu/m²; kênh thương mại có mức theo căn. Chỉ nộp hồ sơ theo bảng / điều kiện Sở hoặc CĐT công bố.",
      },
    ],
    amenities: [
      "Hạ tầng KĐT ven vịnh Cam Ranh",
      "Gần QL1A / kết nối sân bay Cam Ranh",
      "Trường học / tiện ích theo quy hoạch CĐT",
    ],
    faqs: [
      {
        q: "Happy Home Cam Ranh có phải Happy Home Nhơn Trạch không?",
        a: "Không. Đây là NOXH tại Cam Nghĩa, Cam Ranh (Khánh Hòa). Happy Home Nhơn Trạch thuộc Đồng Nai — slug và hub khác.",
      },
      {
        q: "Ai là chủ đầu tư?",
        a: "Pháp lý: Công ty CP Muối Cam Ranh (thuộc Vinhomes / Vingroup). Thương mại thường gắn nhãn Vinhomes Happy Home.",
      },
      {
        q: "Bao nhiêu căn / khi nào vào ở?",
        a: "Sở XD (01/2026): khoảng 3.565 căn; khởi công 01/2024; dự kiến đưa vào sử dụng khoảng quý IV/2026 — xác minh tiến độ trên sxd.khanhhoa.gov.vn.",
      },
    ],
    unitTypes: [
      {
        name: "Nhà / căn hộ NOXH (theo phân kỳ CĐT)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichHappyHomeCamRanh(DEFS[0]!);

export function allNoxhKhanhHoaSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhKhanhHoaDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhKhanhHoaDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhKhanhHoaSeedLanding(slug: string) {
  const def = getNoxhKhanhHoaDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhKhanhHoaMock(slug: string): ProjectDetail | null {
  const def = getNoxhKhanhHoaDef(slug);
  return def ? buildNoxhMock(def) : null;
}
