/**
 * 17 skeleton NOXH Hà Nội — Phase 5 lite.
 * Nguồn: docs/content/HANOI_NOXH_INVENTORY.md (PDF nội bộ).
 * Không bịa giá / số căn / tiến độ.
 */
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";

type HanoiRow = {
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

/** Placeholder MST — thay khi enrich có MST thật. */
const TAX = {
  udic: "HX-HN-UDIC-DAC",
  hacinco: "HX-HN-HACINCO",
  dongPhat: "HX-HN-DONG-PHAT",
  hoaBinh: "HX-HN-HOA-BINH",
  lungLo5: "HX-HN-LUNG-LO-5",
  haDinh: "HX-HN-HA-DINH-TM",
  mhdi: "HX-HN-MHDI",
  hud: "HX-HN-HUD",
  flcAlaska: "HX-HN-FLC-ALASKA",
  bic: "HX-HN-BIC",
  vinaconex3: "HX-HN-VINACONEX3-PIV",
  tuHiep: "HX-HN-TU-HIEP",
  minhDuc: "HX-HN-MINH-DUC",
  himLam: "HX-HN-HIM-LAM-BIC",
  baoNgoc: "HX-HN-BAO-NGOC",
} as const;

const ROWS: HanoiRow[] = [
  {
    stt: 1,
    slug: "nha-o-xa-hoi-udic-eco-tower-ha-dinh",
    name: "Nhà ở xã hội Udic Eco Tower Hạ Đình",
    commercialName: "Udic Eco Tower Hạ Đình",
    developerName: "Liên danh UDIC – DAC – DACINCO",
    developerTax: TAX.udic,
    district: "Thanh Trì",
    ward: "Tân Triều",
    address: "Ô đất N012, KĐT Hạ Đình, Tân Triều, Thanh Trì, Hà Nội",
    lat: 20.973,
    lng: 105.81,
  },
  {
    stt: 2,
    slug: "nha-o-xa-hoi-hacinco-dai-kim-dinh-cong",
    name: "Nhà ở xã hội Đại Kim – Định Công",
    commercialName: "NOXH Đại Kim – Định Công (Hacinco)",
    developerName: "Công ty CP Đầu tư Xây dựng Hà Nội (Hacinco)",
    developerTax: TAX.hacinco,
    district: "Hoàng Mai",
    ward: "Đại Kim",
    address: "Ô đất NO2, KĐT Đại Kim, Hoàng Mai, Hà Nội",
    lat: 20.976,
    lng: 105.855,
  },
  {
    stt: 3,
    slug: "nha-o-xa-hoi-green-house-vinh-hung",
    name: "Nhà ở xã hội Green House Vĩnh Hưng",
    commercialName: "Green House Vĩnh Hưng",
    developerName: "Công ty TNHH Đầu tư Kinh doanh BĐS Đồng Phát",
    developerTax: TAX.dongPhat,
    district: "Hoàng Mai",
    ward: "Vĩnh Hưng",
    address: "Số 321 Vĩnh Hưng, P. Vĩnh Hưng, Hoàng Mai, Hà Nội",
    lat: 20.983,
    lng: 105.87,
  },
  {
    stt: 4,
    slug: "nha-o-xa-hoi-393-linh-nam",
    name: "Nhà ở xã hội 393 Lĩnh Nam",
    commercialName: "NOXH 393 Lĩnh Nam",
    developerName: "Công ty TNHH Hoà Bình (Hoà Bình Group)",
    developerTax: TAX.hoaBinh,
    district: "Hoàng Mai",
    ward: "Vĩnh Hưng",
    address: "Số 393 Lĩnh Nam, P. Vĩnh Hưng, Hoàng Mai, Hà Nội",
    lat: 20.985,
    lng: 105.875,
  },
  {
    stt: 5,
    slug: "nha-o-xa-hoi-ao-sao-ct1",
    name: "Nhà ở xã hội Ao Sào",
    commercialName: "NOXH Ao Sào CT1",
    developerName: "Công ty CP Đầu tư và Phát triển Lũng Lô 5",
    developerTax: TAX.lungLo5,
    district: "Hoàng Mai",
    ward: "Thịnh Liệt",
    address: "Ô đất CT1, KĐT Ao Sào, P. Thịnh Liệt, Hoàng Mai, Hà Nội",
    lat: 20.97,
    lng: 105.85,
  },
  {
    stt: 6,
    slug: "nha-o-xa-hoi-ct6b-kim-giang",
    name: "Nhà ở xã hội CT6B Kim Giang",
    commercialName: "NOXH CT6B Kim Giang",
    developerName: "Công ty CP Đầu tư & Phát triển Thương mại Hạ Đình",
    developerTax: TAX.haDinh,
    district: "Thanh Xuân",
    ward: "Khương Đình",
    address: "Số 320 Khương Đình (gần Kim Giang), Thanh Xuân, Hà Nội",
    lat: 20.995,
    lng: 105.815,
  },
  {
    stt: 7,
    slug: "nha-o-xa-hoi-x2-dai-kim",
    name: "Nhà ở xã hội X2 Đại Kim",
    commercialName: "NOXH X2 Đại Kim",
    developerName: "Tổng công ty Đầu tư phát triển nhà và đô thị (MHDI)",
    developerTax: TAX.mhdi,
    district: "Hoàng Mai",
    ward: "Đại Kim",
    address: "Ô đất X2, P. Đại Kim, Hoàng Mai, Hà Nội",
    lat: 20.978,
    lng: 105.848,
  },
  {
    stt: 8,
    slug: "nha-o-xa-hoi-hud-van-canh",
    name: "Nhà ở xã hội Vân Canh HUD",
    commercialName: "NOXH Vân Canh HUD",
    developerName: "Tổng công ty Đầu tư phát triển nhà và đô thị (HUD)",
    developerTax: TAX.hud,
    district: "Hoài Đức",
    ward: "Vân Canh",
    address: "Ô đất CT1, KĐT mới Vân Canh, Hoài Đức, Hà Nội",
    lat: 21.035,
    lng: 105.735,
  },
  {
    stt: 9,
    slug: "nha-o-xa-hoi-flc-garden-city-dai-mo",
    name: "Nhà ở xã hội FLC Garden City Đại Mỗ",
    commercialName: "FLC Garden City (tòa HH1/HH4)",
    developerName: "Tập đoàn FLC / Công ty CP Địa ốc Alaska",
    developerTax: TAX.flcAlaska,
    district: "Nam Từ Liêm",
    ward: "Đại Mỗ",
    address: "KĐT FLC Garden City, P. Đại Mỗ, Nam Từ Liêm, Hà Nội",
    lat: 21.01,
    lng: 105.755,
  },
  {
    stt: 10,
    slug: "nha-o-xa-hoi-rice-city-to-huu",
    name: "Nhà ở xã hội Rice City Tố Hữu",
    commercialName: "Rice City Tố Hữu",
    developerName: "Công ty CP BIC Việt Nam",
    developerTax: TAX.bic,
    district: "Nam Từ Liêm",
    ward: "Mễ Trì",
    address: "Đường Tố Hữu, P. Mễ Trì & Trung Văn, Nam Từ Liêm, Hà Nội",
    lat: 21.015,
    lng: 105.78,
  },
  {
    stt: 11,
    slug: "nha-o-xa-hoi-green-tower-me-tri",
    name: "Nhà ở xã hội Green Tower Mễ Trì",
    commercialName: "Green Tower Mễ Trì",
    developerName: "Liên danh Vinaconex 3 & Tổng công ty PIV",
    developerTax: TAX.vinaconex3,
    district: "Nam Từ Liêm",
    ward: "Mễ Trì",
    address: "P. Mễ Trì, Nam Từ Liêm, Hà Nội",
    lat: 21.02,
    lng: 105.775,
  },
  {
    stt: 12,
    slug: "nha-o-xa-hoi-hong-ha-eco-city",
    name: "Nhà ở xã hội Hồng Hà Eco City",
    commercialName: "Hồng Hà Eco City (CT1–CT4)",
    developerName: "Công ty CP Đầu tư Tứ Hiệp",
    developerTax: TAX.tuHiep,
    district: "Thanh Trì",
    ward: "Tứ Hiệp",
    address: "KĐT Hồng Hà Eco City, Tứ Hiệp, Thanh Trì, Hà Nội",
    lat: 20.96,
    lng: 105.845,
  },
  {
    stt: 13,
    slug: "nha-o-xa-hoi-hud-me-linh",
    name: "Nhà ở xã hội HUD Melinh Central",
    commercialName: "HUD Melinh Central",
    developerName: "Tổng công ty Đầu tư phát triển nhà và đô thị (HUD)",
    developerTax: TAX.hud,
    district: "Mê Linh",
    ward: "Thanh Lâm",
    address: "KĐT mới Thanh Lâm – Đại Thịnh 2, Mê Linh, Hà Nội",
    lat: 21.18,
    lng: 105.72,
  },
  {
    stt: 14,
    slug: "nha-o-xa-hoi-minh-duc-me-linh",
    name: "Nhà ở xã hội Minh Đức Mê Linh",
    commercialName: "Minh Đức Mê Linh",
    developerName: "Công ty TNHH Minh Đức",
    developerTax: TAX.minhDuc,
    district: "Mê Linh",
    ward: "Tiền Phong",
    address: "Xã Tiền Phong, huyện Mê Linh, Hà Nội",
    lat: 21.165,
    lng: 105.71,
  },
  {
    stt: 15,
    slug: "nha-o-xa-hoi-him-lam-thuong-thanh",
    name: "Nhà ở xã hội Him Lam Thượng Thanh",
    commercialName: "Him Lam Thượng Thanh",
    developerName: "Liên danh Him Lam Thủ Đô & BIC Việt Nam",
    developerTax: TAX.himLam,
    district: "Long Biên",
    ward: "Thượng Thanh",
    address: "P. Thượng Thanh, Long Biên, Hà Nội",
    lat: 21.055,
    lng: 105.89,
  },
  {
    stt: 16,
    slug: "nha-o-xa-hoi-rice-city-song-hong",
    name: "Nhà ở xã hội Rice City Sông Hồng",
    commercialName: "Rice City Sông Hồng",
    developerName: "Công ty CP BIC Việt Nam",
    developerTax: TAX.bic,
    district: "Long Biên",
    ward: "Thạch Bàn",
    address: "Phường Thạch Bàn, Long Biên, Hà Nội",
    lat: 21.04,
    lng: 105.905,
  },
  {
    stt: 17,
    slug: "nha-o-xa-hoi-bao-ngoc-city",
    name: "Nhà ở xã hội Bảo Ngọc City",
    commercialName: "Bảo Ngọc City (Bảo Ngọc Towers)",
    developerName: "Công ty CP Đầu tư Bảo Ngọc Corp",
    developerTax: TAX.baoNgoc,
    district: "Long Biên",
    ward: "Thạch Bàn",
    address: "Phường Thạch Bàn, Long Biên, Hà Nội",
    lat: 21.038,
    lng: 105.91,
  },
];

function skeletonDef(row: HanoiRow): NoxhLandingDef {
  const seoName = row.commercialName.replace(/^NOXH\s+/i, "");
  return {
    id: `preview-hn-noxh-${row.stt}`,
    slug: row.slug,
    name: row.name,
    commercialName: row.commercialName,
    developerId: `preview-dev-${row.developerTax}`,
    developerName: row.developerName,
    developerTax: row.developerTax,
    projectType: "NHA_O_XA_HOI",
    status: "SAP_MO_BAN",
    province: "TP. Hà Nội",
    district: row.district,
    ward: row.ward,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    description: `${row.name} tại ${row.address}. Chủ đầu tư theo danh mục nội bộ House X: ${row.developerName}. Trang skeleton — giá, số căn và tiến độ sẽ cập nhật khi có công bố chính thức từ CĐT hoặc cơ quan nhà nước. Tư vấn điều kiện / hồ sơ NOXH qua House X.`,
    seoTitle: `${row.name} — Hà Nội | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Hà Nội. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X — chưa công bố bảng giá trên trang này.`,
    heroSubtitle: `${seoName} · ${row.district}, Hà Nội — skeleton catalog House X · cập nhật khi có nguồn chính thức`,
    locationNotes: `${row.name} theo danh mục nội bộ: ${row.address}.

Tọa độ trên bản đồ là ước lượng theo ${row.district} — sẽ chỉnh khi có tọa độ / sơ đồ CĐT.

House X cung cấp wiki điều kiện NOXH, tính trả góp và form tư vấn — không thay thế thông báo mở bán của CĐT / Sở.`,
    highlights: [
      {
        title: "Vị trí Hà Nội",
        text: `${row.address}`,
      },
      {
        title: "Chủ đầu tư (theo danh mục)",
        text: row.developerName,
      },
      {
        title: "Giá & suất",
        text: "Chưa công bố trên House X — liên hệ tư vấn khi CĐT / cơ quan nhà nước mở đợt.",
      },
    ],
    amenities: [
      "Tiện ích nội khu theo công bố CĐT (bổ sung khi research)",
      "Kết nối giao thông khu vực Hà Nội",
    ],
    faqs: [
      {
        q: `${row.name} nằm ở đâu?`,
        a: `Theo danh mục House X: ${row.address}.`,
      },
      {
        q: "Giá bao nhiêu?",
        a: "House X chưa đăng bảng giá — chỉ cập nhật khi có công bố chính thức từ CĐT hoặc cơ quan nhà nước.",
      },
      {
        q: "Làm sao đăng ký tư vấn?",
        a: "Dùng form trên trang dự án hoặc hotline House X. Có thể xem trước điều kiện tại Wiki nhà ở xã hội và công cụ tính trả góp.",
      },
    ],
    heroImage: {
      url: "/images/noxh-stock/hero-generic.jpg",
      alt: `${row.name} — Hà Nội`,
    },
    gallery: [],
    unitTypes: [
      {
        name: "Căn hộ NOXH (diện tích theo CĐT)",
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "chua_xac_minh" }],
  };
}

const DEFS: NoxhLandingDef[] = ROWS.map(skeletonDef);

/** Enrich STT-1 — nguồn UDIC blog-8207 (2026-07-23). */
function enrichUdicEcoTower(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội UDIC EcoTower Hạ Đình",
    commercialName: "UDIC EcoTower (ô đất NO1 Hạ Đình)",
    developerName:
      "Liên danh UDIC – Haweicco – DAC Hà Nội",
    address:
      "Ô đất NO1, khu đô thị mới Hạ Đình, Tân Triều, Thanh Trì, Hà Nội",
    ward: "Tân Triều",
    totalArea: 9305,
    totalUnits: 440,
    blocks: 1,
    handoverDate: new Date("2027-12-31"),
    description:
      "UDIC EcoTower — nhà ở xã hội tại ô đất NO1, KĐT mới Hạ Đình, Tân Triều, Thanh Trì, Hà Nội. Liên danh CĐT: Tổng công ty UDIC, Haweicco và DAC Hà Nội (công bố trên udic.com.vn). Quy mô ~9.305 m² đất, một tòa 5–25 tầng + hầm, 440 căn (365 NOXH + 75 thương mại). Giá NOXH dự kiến ~25 triệu/m² (tạm tính, chờ thẩm định). Hoàn thành dự kiến quý IV/2027. Tư vấn điều kiện / hồ sơ qua House X.",
    seoTitle:
      "Nhà ở xã hội UDIC EcoTower Hạ Đình — 365 căn NOXH | House X",
    seoDesc:
      "UDIC EcoTower (ô NO1 Hạ Đình, Thanh Trì): liên danh UDIC–Haweicco–DAC, 440 căn (365 NOXH), giá dự kiến ~25 tr/m² chờ thẩm định. Tra cứu điều kiện và đăng ký tư vấn trên House X.",
    heroSubtitle:
      "Ô NO1 KĐT Hạ Đình · Thanh Trì — 365 căn NOXH · giá dự kiến ~25 tr/m² (UDIC, chờ thẩm định) · hoàn thành Q4/2027",
    locationNotes: `UDIC EcoTower nằm tại ô đất ký hiệu NO1, khu đô thị mới Hạ Đình, Tân Triều, Thanh Trì, Hà Nội (công bố UDIC).

Chỉ tiêu theo CĐT: đất ~9.305 m² · mật độ 40% · 1 tòa cao 5–25 tầng + 1 hầm · 440 căn (365 nhà ở xã hội, 75 thương mại). Tiến độ hoàn thành dự kiến quý IV/2027.

House X hỗ trợ wiki điều kiện NOXH và form tư vấn — không thay thông báo mở bán / tiếp nhận hồ sơ trên cổng Sở Xây dựng Hà Nội hoặc udic.com.vn.`,
    highlights: [
      {
        title: "365 căn nhà ở xã hội",
        text: "Trong tổng 440 căn: 255 bán · 37 thuê mua · 73 thuê (diện tích NOXH khoảng 70–76,24 m²) — theo công bố UDIC.",
      },
      {
        title: "Giá dự kiến ~25 triệu/m²",
        text: "Mức tạm tính do CĐT công bố; giá chính thức sau khi cơ quan nhà nước thẩm định. Không nhận đặt cọc ngoài kênh chính thức.",
      },
      {
        title: "Liên danh UDIC – Haweicco – DAC",
        text: "Chủ trương đầu tư UBND Hà Nội (QĐ 2784 và điều chỉnh 4185). Khởi công tham chiếu 12/2024 theo báo Kinh tế & Đô thị.",
      },
    ],
    amenities: [
      "Tầng 1–5 dịch vụ / văn phòng / để xe (theo CĐT)",
      "1 tầng hầm để xe",
      "Kết nối Nguyễn Xiển – Linh Đàm – Kim Giang",
    ],
    faqs: [
      {
        q: "UDIC EcoTower Hạ Đình nằm ở đâu?",
        a: "Ô đất NO1, khu đô thị mới Hạ Đình, Tân Triều, Thanh Trì, Hà Nội — theo công bố trên udic.com.vn.",
      },
      {
        q: "Giá nhà ở xã hội UDIC EcoTower bao nhiêu?",
        a: "CĐT công bố giá dự kiến khoảng 25 triệu đồng/m² (tạm tính). Giá chính thức sau thẩm định của cơ quan quản lý nhà nước.",
      },
      {
        q: "Có nên đặt cọc qua môi giới tự do không?",
        a: "UDIC đã cảnh báo dự án từng chưa đủ điều kiện nhận đặt cọc / HĐMB giả mạo. Chỉ đăng ký qua kênh Sở Xây dựng / CĐT công bố; House X hỗ trợ tư vấn điều kiện, không thu đặt cọc thay CĐT.",
      },
    ],
    unitTypes: [
      {
        name: "NOXH ~70–76 m²",
        areaMin: 70,
        areaMax: 76.24,
        bedrooms: 2,
        priceFrom: null,
      },
      {
        name: "Thương mại ~76–90 m²",
        areaMin: 76.24,
        areaMax: 89.82,
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

DEFS[0] = enrichUdicEcoTower(DEFS[0]!);

export function allNoxhHanoiSlugs(): string[] {
  return DEFS.map((d) => d.slug);
}

export function allNoxhHanoiDefs(): NoxhLandingDef[] {
  return DEFS;
}

export function getNoxhHanoiDef(slug: string): NoxhLandingDef | null {
  return DEFS.find((d) => d.slug === slug) ?? null;
}

export function buildNoxhHanoiSeedLanding(slug: string) {
  const def = getNoxhHanoiDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function buildNoxhHanoiMock(slug: string): ProjectDetail | null {
  const def = getNoxhHanoiDef(slug);
  return def ? buildNoxhMock(def) : null;
}
