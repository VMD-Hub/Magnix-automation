/**
 * 6 NOXH Đồng Tháp / Tiền Giang cũ — P0.2.
 * Nguồn: docs/content/DONG_THAP_NOXH_INVENTORY.md
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  NOXH_AMENITIES_VERIFYING,
  NOXH_PRICE_FAQ_VERIFYING,
  NOXH_UPDATING_SOON,
} from "@/lib/content/messaging/noxh-landing-incomplete";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type DtRow = {
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
  longGiang: "HX-DT-LONG-GIANG-TMG",
  hqc: "HX-DT-HQC",
  nguyenTrai: "HX-DT-NGUYEN-TRAI-TBD",
  binhThanh: "HX-DT-BINH-THANH-2-TBD",
  congDoan: "HX-DT-CONG-DOAN",
} as const;

const ROWS: DtRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-rivera-garden-my-tho",
    name: "Nhà ở xã hội Rivera Garden Mỹ Tho",
    commercialName: "Rivera Garden Mỹ Tho (NOXH Nguyễn Tri Phương)",
    developerName: "Liên danh Long Giang Land & TMG Lục Nam",
    developerTax: TAX.longGiang,
    district: "Mỹ Tho",
    ward: "Mỹ Tho",
    address: "Số 45–47 Nguyễn Tri Phương, P. Mỹ Tho, Đồng Tháp (Tiền Giang cũ)",
    lat: 10.36,
    lng: 106.36,
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-hqc-my-tho",
    name: "Nhà ở xã hội HQC Mỹ Tho",
    commercialName: "NOXH HQC Mỹ Tho",
    developerName: "Tập đoàn Hoàng Quân (HQC)",
    developerTax: TAX.hqc,
    district: "Mỹ Tho",
    ward: "Phường 3",
    address: "Đường Nguyễn Trung Trực, P. 3, TP. Mỹ Tho, Đồng Tháp (Tiền Giang cũ)",
    lat: 10.355,
    lng: 106.365,
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-hqc-tan-huong",
    name: "Nhà ở xã hội HQC Tân Hương",
    commercialName: "NOXH HQC Tân Hương",
    developerName: "Tập đoàn Hoàng Quân (HQC)",
    developerTax: TAX.hqc,
    district: "Châu Thành",
    ward: "Tân Hương",
    address: "Xã Tân Hương, Châu Thành, Đồng Tháp (Tiền Giang cũ) — gần KCN Tân Hương",
    lat: 10.4,
    lng: 106.3,
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-nguyen-trai-noi-dai-go-cong",
    name: "Nhà ở xã hội Nguyễn Trãi Nối Dài",
    commercialName: "NOXH Nguyễn Trãi Nối Dài",
    developerName: "Đang lựa chọn nhà đầu tư",
    developerTax: TAX.nguyenTrai,
    district: "Gò Công",
    ward: "Long Hưng",
    address: "P. Long Hưng, TP. Gò Công, Đồng Tháp (Tiền Giang cũ)",
    lat: 10.365,
    lng: 106.675,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-binh-thanh-2",
    name: "Nhà ở xã hội Bình Thành 2",
    commercialName: "NOXH Bình Thành 2",
    developerName: "Đang công bố thông tin đầu tư",
    developerTax: TAX.binhThanh,
    district: "Bình Thành",
    ward: "Bình Thành",
    address: "Xã Bình Thành, Đồng Tháp",
    lat: 10.45,
    lng: 105.65,
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-cong-doan-dong-thap",
    name: "Nhà ở xã hội Công đoàn Đồng Tháp",
    commercialName: "NOXH Công đoàn Đồng Tháp",
    developerName: "Tổng Liên đoàn Lao động Việt Nam",
    developerTax: TAX.congDoan,
    district: "Đồng Tháp",
    ward: "—",
    address: "Tỉnh Đồng Tháp (vị trí chi tiết cập nhật khi CĐT / Sở công bố)",
    lat: 10.452,
    lng: 105.632,
  },
];

function skeletonDef(row: DtRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  return {
    id: `preview-dt-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: "SAP_MO_BAN",
    province: "Đồng Tháp",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}. Thuộc địa giới Đồng Tháp sau sắp xếp (trước thuộc Tiền Giang nếu ghi Mỹ Tho / Gò Công). Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — Đồng Tháp | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Đồng Tháp. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Đồng Tháp`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Tiền Giang sáp nhập vào tỉnh Đồng Tháp mới. Vị trí trên bản đồ đang được xác minh.

Đối chiếu sxd.dongthap.gov.vn. Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
    highlights: [
      { title: "Vị trí", text: row.address },
      { title: "Chủ đầu tư", text: row.developerName },
      {
        title: "Giá & suất",
        text: `Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
      },
    ],
    amenities: [NOXH_AMENITIES_VERIFYING],
    faqs: [
      {
        q: `${row.name} thuộc tỉnh nào?`,
        a: "Theo House X: Đồng Tháp (sau sắp xếp 2025). Tên Tiền Giang / Mỹ Tho vẫn dùng để tìm kiếm.",
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
      alt: `${row.name} — Đồng Tháp`,
    },
    gallery: [],
    unitTypes: [
      { name: "Căn hộ NOXH (theo CĐT)", bedrooms: 2, priceFrom: null },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich STT-1 — longgiangland.com.vn + Báo Xây dựng (2026-07-23). */
function enrichRiveraGarden(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Rivera Garden Mỹ Tho",
    commercialName: "Rivera Garden Mỹ Tho · Khu NOXH Nguyễn Tri Phương",
    developerName:
      "Liên danh Long Giang Land & CTCP Đầu tư Hạ tầng TMG Lục Nam",
    address:
      "Số 45–47 đường Nguyễn Tri Phương, phường Mỹ Tho, tỉnh Đồng Tháp (TP. Mỹ Tho, Tiền Giang cũ)",
    totalArea: 3236.5,
    totalUnits: 216,
    blocks: 1,
    handoverDate: new Date("2027-09-30"),
    description:
      "Rivera Garden Mỹ Tho (pháp lý: Khu nhà ở xã hội Nguyễn Tri Phương) tại 45–47 Nguyễn Tri Phương, phường Mỹ Tho, Đồng Tháp. Liên danh CĐT Long Giang Land – TMG Lục Nam (longgiangland.com.vn): đất ~3.236,5 m², một tòa 15 tầng, 216 căn, khởi công 17/6/2026, bàn giao dự kiến quý III/2027. Tổng mức đầu tư tham chiếu CĐT >238 tỷ đồng. Tư vấn điều kiện NOXH qua House X.",
    seoTitle:
      "Nhà ở xã hội Rivera Garden Mỹ Tho — 216 căn | House X",
    seoDesc:
      "NOXH Rivera Garden (Nguyễn Tri Phương, Mỹ Tho, Đồng Tháp): Long Giang Land–TMG Lục Nam, 15 tầng, 216 căn, khởi công 6/2026, bàn giao Q3/2027. Tư vấn điều kiện trên House X.",
    heroSubtitle:
      "Mỹ Tho · 15 tầng · 216 căn · KC 17/6/2026 · bàn giao Q3/2027 — Long Giang Land & TMG Lục Nam",
    locationNotes: `Rivera Garden / NOXH Nguyễn Tri Phương tại 45–47 Nguyễn Tri Phương, phường Mỹ Tho, Đồng Tháp — ven sông Bảo Định, trung tâm đô thị (theo CĐT).

Trước sắp xếp thuộc TP. Mỹ Tho, Tiền Giang. Chủ trương đầu tư tham chiếu QĐ 1815/QĐ-UBND (Tiền Giang, 26/6/2025) và quyết định giao liên danh NĐT của Đồng Tháp (9/2025) theo CafeLand / báo chí.

Nguồn ưu tiên: longgiangland.com.vn · sxd.dongthap.gov.vn.`,
    highlights: [
      {
        title: "216 căn · 15 tầng",
        text: "Một tòa trên ~3.236,5 m² đất — theo Long Giang Land. Khởi công 17/6/2026, hoàn thành dự kiến quý III/2027.",
      },
      {
        title: "Long Giang Land – TMG Lục Nam",
        text: "Liên danh CĐT được giao theo chính sách đặc thù NOXH. Rivera Garden là dự án NOXH thứ ba tại Mỹ Tho (theo CĐT).",
      },
      {
        title: "Vị trí trung tâm Mỹ Tho",
        text: "Ven sông Bảo Định, kết nối QL1 / QL60 / cầu Mỹ Tho — theo công bố khởi công.",
      },
    ],
    amenities: [
      "Hạ tầng kỹ thuật đồng bộ (theo CĐT)",
      "Ven sông Bảo Định",
      "Gần khu hành chính / giáo dục / y tế địa phương",
    ],
    faqs: [
      {
        q: "Rivera Garden Mỹ Tho thuộc Đồng Tháp hay Tiền Giang?",
        a: "Theo House X: Đồng Tháp (sau NQ 2025). Địa chỉ: phường Mỹ Tho — trước thuộc tỉnh Tiền Giang.",
      },
      {
        q: "Khi nào bàn giao?",
        a: "Theo Long Giang Land: dự kiến quý III/2027. Khởi công 17/6/2026.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "House X chưa đăng bảng giá chính thức. Theo dõi Sở Xây dựng Đồng Tháp / CĐT khi mở bán hồ sơ.",
      },
    ],
    unitTypes: [
      {
        name: "Căn hộ NOXH (tòa 15 tầng)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [
      { docType: "chap_thuan_noxh", status: "da_co" },
      { docType: "chu_truong_dau_tu", status: "da_co" },
    ],
  };
}

DEFS[0] = enrichRiveraGarden(DEFS[0]!);

export function allNoxhDongThapSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhDongThapDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhDongThapDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhDongThapSeedLanding(slug: string) {
  const def = getNoxhDongThapDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhDongThapMock(slug: string): ProjectDetail | null {
  const def = getNoxhDongThapDef(slug);
  return def ? buildNoxhMock(def) : null;
}
