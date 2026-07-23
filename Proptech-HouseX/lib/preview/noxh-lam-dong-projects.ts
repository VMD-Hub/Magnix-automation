/**
 * 6 NOXH Lâm Đồng (Đắk Nông + Bình Thuận cũ) — P0.5.
 * Nguồn: docs/content/LAM_DONG_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type LdRow = {
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
  kimDong: "HX-LD-NNP-MINH-TRI",
  xd579: "HX-LD-XD-579",
  tienPhat: "HX-LD-TIEN-PHAT",
  namLong: "HX-LD-NAM-LONG",
  binhTan: "HX-LD-BINH-TAN",
  giaNghia: "HX-LD-GIA-NGHIA-TBD",
} as const;

const ROWS: LdRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-kim-dong-da-lat",
    name: "Nhà ở xã hội Kim Đồng Đà Lạt",
    commercialName: "NOXH Kim Đồng Đà Lạt",
    developerName: "Liên danh CTCP Đầu tư NNP & CTCP Đầu tư Minh Trí Thuận An",
    developerTax: TAX.kimDong,
    district: "Đà Lạt",
    ward: "Phường 6",
    address: "Đường Kim Đồng, Phường 6, TP. Đà Lạt, Lâm Đồng",
    lat: 11.94,
    lng: 108.44,
    productHint: "chung cư trung tâm Đà Lạt",
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-sao-nam-da-lat",
    name: "Nhà ở xã hội Sào Nam Đà Lạt",
    commercialName: "NOXH Sào Nam Đà Lạt",
    developerName: "Công ty CP Đầu tư & Xây dựng 579",
    developerTax: TAX.xd579,
    district: "Đà Lạt",
    ward: "Phường 11",
    address: "Đường Sào Nam, Phường 11, TP. Đà Lạt, Lâm Đồng",
    lat: 11.95,
    lng: 108.45,
    productHint: "3 block · ~250 căn",
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-tien-phat-phan-thiet",
    name: "Nhà ở xã hội Tiến Phát Phan Thiết",
    commercialName: "NOXH Tiến Phát Phan Thiết",
    developerName: "Công ty TNHH Đầu tư Tiến Phát",
    developerTax: TAX.tienPhat,
    district: "Phan Thiết",
    ward: "Phú Tài",
    address: "Phường Phú Tài, TP. Phan Thiết, Lâm Đồng (Bình Thuận cũ)",
    lat: 10.93,
    lng: 108.1,
    productHint: "2 khối 9 tầng",
    status: "DA_BAN_GIAO",
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-nam-long-phan-thiet",
    name: "Nhà ở xã hội Nam Long Phan Thiết",
    commercialName: "NOXH Nam Long Phan Thiết",
    developerName: "Tập đoàn Nam Long / CĐT liên danh",
    developerTax: TAX.namLong,
    district: "Phan Thiết",
    ward: "Xuân An",
    address: "Phường Xuân An, TP. Phan Thiết, Lâm Đồng (Bình Thuận cũ)",
    lat: 10.94,
    lng: 108.12,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-kcn-ham-kiem-1",
    name: "Nhà ở xã hội KCN Hàm Kiệm 1",
    commercialName: "NOXH KCN Hàm Kiệm 1",
    developerName: "Công ty CP Đầu tư Bình Tân",
    developerTax: TAX.binhTan,
    district: "Hàm Thuận Nam",
    ward: "Hàm Kiệm",
    address: "KCN Hàm Kiệm 1, huyện Hàm Thuận Nam, Lâm Đồng (Bình Thuận cũ)",
    lat: 10.85,
    lng: 107.95,
    productHint: "9 block · công nhân KCN",
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-gia-nghia",
    name: "Nhà ở xã hội Gia Nghĩa",
    commercialName: "NOXH Gia Nghĩa",
    developerName: "Liên danh nhà đầu tư được phê duyệt",
    developerTax: TAX.giaNghia,
    district: "Gia Nghĩa",
    ward: "Gia Nghĩa",
    address: "TP. Gia Nghĩa, Lâm Đồng (Đắk Nông cũ)",
    lat: 12.0,
    lng: 107.69,
  },
];

function skeletonDef(row: LdRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  const tip = row.productHint ? ` · ${row.productHint}` : "";
  return {
    id: `preview-ld-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: row.status ?? "SAP_MO_BAN",
    province: "Lâm Đồng",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. CĐT theo danh mục House X: ${row.developerName}. Thuộc tỉnh Lâm Đồng sau sắp xếp (Bình Thuận / Đắk Nông cũ nếu Phan Thiết, Hàm Kiệm, Gia Nghĩa).${tip} Skeleton — giá / suất cập nhật khi có Sở XD hoặc CĐT. Tư vấn điều kiện qua House X.`,
    seoTitle: `${row.name} — Lâm Đồng | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Lâm Đồng. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Lâm Đồng${tip} — catalog House X`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Đắk Nông và Bình Thuận sáp nhập vào tỉnh Lâm Đồng mới. Tọa độ ước lượng.

Đối chiếu soxaydung.lamdong.gov.vn. House X: wiki NOXH + form tư vấn.`,
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
        q: `${row.name} thuộc Lâm Đồng, Bình Thuận hay Đắk Nông?`,
        a: "Canonical House X: Lâm Đồng (sau NQ 2025). Tên Bình Thuận / Đắk Nông / Đà Lạt / Phan Thiết vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Lâm Đồng`,
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

/** Enrich STT-1 — Kim Đồng Đà Lạt (2026-07-23). */
function enrichKimDong(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Kim Đồng Đà Lạt",
    commercialName: "NOXH Kim Đồng · Phường 6 Đà Lạt",
    developerName:
      "Liên danh Công ty CP Đầu tư NNP & Công ty CP Đầu tư Minh Trí Thuận An",
    address: "Đường Kim Đồng, Phường 6, TP. Đà Lạt, Lâm Đồng",
    totalArea: 3317,
    totalUnits: 94,
    blocks: 1,
    description:
      "Nhà ở xã hội Kim Đồng tại đường Kim Đồng, Phường 6, TP. Đà Lạt — một trong ít dự án NOXH gần trung tâm Đà Lạt. CĐT theo kết quả lựa chọn nhà đầu tư (25/12/2024): liên danh CTCP Đầu tư NNP và CTCP Đầu tư Minh Trí Thuận An (danh mục PDF ghi Khải Thịnh — không khớp nguồn mở). Quy mô 94 căn (~75 bán, ~19 thuê), diện tích đất 3.317 m², căn hộ ~43–70 m², vốn ~99,8 tỷ (chưa GPMB). Tiến độ pháp lý 24 tháng từ QĐ lựa chọn NĐT; vẫn cần theo dõi GPMB. Tư vấn điều kiện qua House X.",
    seoTitle: "Nhà ở xã hội Kim Đồng Đà Lạt — 94 căn Phường 6 | House X",
    seoDesc:
      "NOXH Kim Đồng Đà Lạt: 94 căn (~43–70 m²), CĐT liên danh NNP + Minh Trí Thuận An. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Đà Lạt P.6 · 94 căn · ~43–70 m² · liên danh NNP + Minh Trí · trung tâm cao nguyên",
    locationNotes: `NOXH Kim Đồng trên đường Kim Đồng, Phường 6, TP. Đà Lạt — vị trí trung tâm cao nguyên trong tỉnh Lâm Đồng mới.

Nguồn: Báo Đấu Thầu / VietnamNet (kết quả lựa chọn NĐT). Đối chiếu soxaydung.lamdong.gov.vn — GPMB còn là điểm nghẽn theo báo chí.

House X không thu đặt cọc thay CĐT.`,
    highlights: [
      {
        title: "94 căn trung tâm Đà Lạt",
        text: "Đất 3.317 m²; căn hộ ~43–70 m²; khoảng 75 căn bán và 19 căn thuê theo công bố lựa chọn NĐT.",
      },
      {
        title: "CĐT: NNP + Minh Trí Thuận An",
        text: "Liên danh được phê duyệt 25/12/2024. Danh mục nội bộ PDF ghi Khải Thịnh — House X ưu tiên nguồn Sở / báo đấu thầu.",
      },
      {
        title: "Theo dõi GPMB",
        text: "Vốn ~99,8 tỷ (chưa chi phí bồi thường). Báo chí ghi còn vướng mặt bằng — xác minh tiến độ trước khi nộp hồ sơ.",
      },
    ],
    amenities: [
      "Gần trung tâm TP. Đà Lạt",
      "Sinh hoạt cộng đồng / để xe theo thiết kế",
      "Hạ tầng kỹ thuật theo tiêu chuẩn NOXH",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư NOXH Kim Đồng?",
        a: "Theo kết quả lựa chọn nhà đầu tư: liên danh CTCP Đầu tư NNP và CTCP Đầu tư Minh Trí Thuận An. Không dùng hotline CĐT trên House X — tư vấn qua form House X.",
      },
      {
        q: "Bao nhiêu căn / diện tích?",
        a: "94 căn trên ~3.317 m² đất; diện tích căn khoảng 43–70 m² (nguồn báo / QĐ lựa chọn NĐT).",
      },
      {
        q: "Đã mở bán chưa?",
        a: "Dự án đã có nhà đầu tư; tiến độ xây dựng phụ thuộc GPMB. Theo dõi Sở XD Lâm Đồng trước khi nộp hồ sơ.",
      },
    ],
    unitTypes: [
      {
        name: "Căn hộ NOXH (~43–70 m²)",
        areaMin: 43,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[0] = enrichKimDong(DEFS[0]!);

export function allNoxhLamDongSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhLamDongDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhLamDongDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhLamDongSeedLanding(slug: string) {
  const def = getNoxhLamDongDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhLamDongMock(slug: string): ProjectDetail | null {
  const def = getNoxhLamDongDef(slug);
  return def ? buildNoxhMock(def) : null;
}
