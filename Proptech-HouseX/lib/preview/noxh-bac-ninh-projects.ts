/**
 * 8 BN cũ + 7 BG cũ — NOXH hub Bắc Ninh (P0.5 Bắc).
 * Nguồn: docs/content/BAC_NINH_NOXH_INVENTORY.md
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
  evergreenVt: "HX-BN-EVERGREEN-VT",
  lamSon: "HX-BN-LAM-SON",
  apec: "HX-BN-APEC",
  vjs: "HX-BN-VJS",
  nlx: "HX-BN-NLX",
  hoaPhu: "HX-BN-HOA-PHU",
  nenh: "HX-BN-NENH",
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
  {
    stt: 9,
    slug: "nha-o-xa-hoi-evergreen-bac-giang-van-trung",
    name: "Nhà ở xã hội Evergreen Bắc Giang",
    commercialName: "NOXH Evergreen Bắc Giang · KĐT Nếnh",
    developerName:
      "Liên danh KCN Sài Gòn-Hải Phòng + ĐT PT bền vững Evergreen Bắc Giang",
    developerTax: TAX.evergreenVt,
    district: "Việt Yên",
    ward: "Nếnh",
    address:
      "Phường Nếnh (KĐT mới thị trấn Nếnh), Bắc Ninh (Bắc Giang cũ) — gần KCN Vân Trung / Đình Trám",
    lat: 21.27,
    lng: 106.1,
    productHint: "10 block 20 tầng · ~3.300 căn · 28–70 m² · ~12–13,5 tr/m²",
    status: "DANG_BAN",
  },
  {
    stt: 10,
    slug: "nha-o-xa-hoi-dinh-tram-sen-ho",
    name: "Nhà ở xã hội Đình Trám Sen Hồ",
    commercialName: "NOXH Đình Trám Sen Hồ",
    developerName: "Lam Sơn",
    developerTax: TAX.lamSon,
    district: "Việt Yên",
    ward: "Hồng Thái",
    address: "Xã Hồng Thái, huyện Việt Yên, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.27,
    lng: 106.1,
    productHint: "4 block 18 tầng · ~2.400 căn",
  },
  {
    stt: 11,
    slug: "nha-o-xa-hoi-quang-chau-cong-nhan",
    name: "Nhà ở xã hội Công nhân Quang Châu",
    commercialName: "NOXH Công nhân Quang Châu",
    developerName: "APEC",
    developerTax: TAX.apec,
    district: "Việt Yên",
    ward: "Quang Châu",
    address: "Xã Quang Châu, huyện Việt Yên, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.27,
    lng: 106.1,
    productHint: "~1.500 căn",
  },
  {
    stt: 12,
    slug: "nha-o-xa-hoi-noi-hoang",
    name: "Nhà ở xã hội Nội Hoàng",
    commercialName: "NOXH Nội Hoàng",
    developerName: "VJS",
    developerTax: TAX.vjs,
    district: "Yên Dũng",
    ward: "Nội Hoàng",
    address: "Xã Nội Hoàng, huyện Yên Dũng, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.2,
    lng: 106.25,
    productHint: "4 block 18 tầng · ~1.600 căn",
  },
  {
    stt: 13,
    slug: "nha-o-xa-hoi-nang-luong-xanh-bac-giang",
    name: "Nhà ở xã hội Năng Lượng Xanh Bắc Giang",
    commercialName: "NOXH Năng Lượng Xanh Bắc Giang",
    developerName: "NLX Bắc Giang",
    developerTax: TAX.nlx,
    district: "TP. Bắc Giang",
    ward: "Xương Giang",
    address: "Phường Xương Giang, TP. Bắc Giang, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.27,
    lng: 106.19,
    productHint: "2 block 19 tầng · ~700 căn",
  },
  {
    stt: 14,
    slug: "nha-o-xa-hoi-kcn-hoa-phu-hiep-hoa",
    name: "Nhà ở xã hội KCN Hòa Phú",
    commercialName: "NOXH KCN Hòa Phú",
    developerName: "ĐT Hòa Phú",
    developerTax: TAX.hoaPhu,
    district: "Hiệp Hòa",
    ward: "Mai Đình",
    address: "Xã Mai Đình, huyện Hiệp Hòa, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.35,
    lng: 105.95,
    productHint: "~1.200 căn",
  },
  {
    stt: 15,
    slug: "nha-o-xa-hoi-kdt-nenh",
    name: "Nhà ở xã hội KĐT Nếnh",
    commercialName: "NOXH KĐT Nếnh",
    developerName: "Liên danh",
    developerTax: TAX.nenh,
    district: "Việt Yên",
    ward: "Nếnh",
    address: "Xã Nếnh, huyện Việt Yên, Bắc Ninh (Bắc Giang cũ)",
    lat: 21.27,
    lng: 106.1,
    productHint: "~2.000 căn",
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
    description: `${row.name} tại ${row.address}. Chủ đầu tư: ${row.developerName}. Thuộc tỉnh Bắc Ninh sau NQ 2025 (Bắc Giang cũ).${tip} Giá và suất đang được xác minh. ${NOXH_UPDATING_SOON}`,
    seoTitle: `${row.name} — Bắc Ninh | House X`,
    seoDesc: `Nhà ở xã hội ${seoName} tại ${row.district}, Bắc Ninh. CĐT: ${row.developerName}. Tra cứu điều kiện mua và đăng ký tư vấn trên House X.`,
    heroSubtitle: `${seoName} · ${row.district}, Bắc Ninh${tip}`,
    locationNotes: `${row.name}: ${row.address}.

Sau NQ 2025, Bắc Giang sáp nhập vào tỉnh Bắc Ninh mới. Cụm KCN Yên Phong (Samsung) · Quế Võ · VSIP Tiên Du. Vị trí trên bản đồ đang được xác minh.

Đối chiếu soxaydung.bacninh.gov.vn / soxaydung.bacgiang.gov.vn (legacy). Xem Wiki nhà ở xã hội hoặc để lại thông tin tư vấn trên House X.`,
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
        q: `${row.name} thuộc Bắc Ninh hay Bắc Giang?`,
        a: "Theo House X: Bắc Ninh (sau NQ 2025). Tên Bắc Giang / Yên Phong / Quế Võ vẫn dùng để tìm kiếm.",
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
      "Nhà ở xã hội Cát Tường Smart City tại Yên Trung & Thụy Hòa, Yên Phong — gần hành lang Samsung · KCN Yên Phong. Chủ đầu tư CTCP Cát Tường. Theo Sở / chủ đầu tư: khoảng 9,4 ha (~94.075 m²), 9 khối K–T, khoảng 1.040 căn. Giá một số đợt Sở công bố khoảng 15,4–16,3 triệu/m² — ưu tiên thông báo Sở mới nhất trước khi nộp hồ sơ. Đang mở bán theo đợt. Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội Cát Tường Smart City — ~1.040 căn Yên Phong | House X",
    seoDesc:
      "NOXH Cát Tường Smart City Yên Phong: 9 khối khoảng 1.040 căn, gần KCN Yên Phong. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Yên Phong · gần KCN Samsung · 9 khối · khoảng 1.040 căn · đang mở bán theo đợt",
    locationNotes: `NOXH Cát Tường Smart City tại xã Yên Trung & Thụy Hòa, huyện Yên Phong, Bắc Ninh — cạnh hành lang công nghiệp Samsung · KCN Yên Phong.

Quy mô theo Sở / chủ đầu tư: 9 khối K–T · khoảng 1.040 căn · khoảng 94.075 m². Giá một số đợt Sở công bố khoảng 15,4–16,3 triệu/m² (chưa VAT & phí bảo trì) — xác minh thông báo mới nhất trước khi nộp hồ sơ.

House X không thu đặt cọc thay chủ đầu tư.`,
    highlights: [
      {
        title: "Khoảng 1.040 căn · 9 khối K–T",
        text: "Khoảng 9,4 ha tại Yên Phong · gần KCN Yên Phong. Quy mô theo công bố Sở / chủ đầu tư.",
      },
      {
        title: "Chủ đầu tư: Cát Tường",
        text: "CTCP Cát Tường — vốn tham chiếu khoảng 1.778 tỷ. Gần hành lang Samsung Yên Phong.",
      },
      {
        title: "Giá — xác minh Sở",
        text: "Một số đợt Sở công bố khoảng 15,4–16,3 triệu/m². Không dùng mức tham chiếu thấp hơn trên tài liệu cũ làm bảng giá nộp hồ sơ.",
      },
    ],
    amenities: [
      "KCN Yên Phong · hành lang Samsung",
      "Hạ tầng kỹ thuật theo tiêu chuẩn nhà ở xã hội",
      "Trường / y tế theo quy hoạch (theo dõi giải phóng mặt bằng)",
    ],
    faqs: [
      {
        q: "Ai là chủ đầu tư?",
        a: "CTCP Cát Tường. House X tư vấn qua form trên trang dự án.",
      },
      {
        q: "Bao nhiêu căn?",
        a: "Theo Sở / chủ đầu tư: khoảng 1.040 căn trên 9 khối (K–T). Đang mở bán theo đợt.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Đối chiếu thông báo Sở Xây dựng Bắc Ninh mới nhất (một số đợt khoảng 15,4–16,3 triệu/m²).",
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

/** Enrich STT-9 — Evergreen Bắc Giang @ Nếnh (2026-07-23). Sở / CĐT > PDF. */
function enrichEvergreenVanTrung(def: NoxhLandingDef): NoxhLandingDef {
  return {
    ...def,
    name: "Nhà ở xã hội Evergreen Bắc Giang",
    commercialName: "NOXH Evergreen Bắc Giang · KĐT Nếnh",
    developerName:
      "Liên danh KCN Sài Gòn-Hải Phòng + ĐT PT bền vững Evergreen Bắc Giang",
    ward: "Nếnh",
    address:
      "Phường Nếnh (KĐT mới thị trấn Nếnh), Bắc Ninh (Bắc Giang cũ) — gần KCN Vân Trung / Đình Trám / Quang Châu",
    totalArea: 32271,
    totalUnits: 3300,
    blocks: 10,
    status: "DANG_BAN",
    description:
      "Nhà ở xã hội Evergreen Bắc Giang tại khu đô thị mới thị trấn Nếnh (phường Nếnh), Việt Yên — gần cụm KCN Vân Trung / Đình Trám / Quang Châu (Bắc Giang cũ, thuộc Bắc Ninh trên House X). Chủ đầu tư liên danh KCN Sài Gòn-Hải Phòng và Đầu tư phát triển bền vững Evergreen Bắc Giang. Quy mô tham chiếu: khoảng 3,2 ha · 10 block 20 tầng · khoảng 3.300 căn · 28–70 m². Giá tham chiếu khoảng 12–13,5 triệu/m² — xác minh Sở trước khi nộp hồ sơ. Đang mở bán theo đợt. Tư vấn điều kiện qua House X.",
    seoTitle:
      "Nhà ở xã hội Evergreen Bắc Giang — ~3.300 căn KĐT Nếnh | House X",
    seoDesc:
      "NOXH Evergreen Bắc Giang tại Nếnh Việt Yên: khoảng 10 block, khoảng 3.300 căn, gần KCN Vân Trung. Tra cứu điều kiện và tư vấn trên House X.",
    heroSubtitle:
      "Nếnh · Việt Yên · gần KCN Vân Trung · khoảng 10 block 20 tầng · khoảng 3.300 căn · đang mở bán",
    locationNotes: `NOXH Evergreen Bắc Giang tại phường Nếnh (khu đô thị mới thị trấn Nếnh), Bắc Ninh (Bắc Giang cũ) — gần KCN Vân Trung / Đình Trám / Quang Châu.

Một số tài liệu còn ghi địa điểm Vân Trung; công bố chủ đầu tư / Sở ưu tiên khu đô thị Nếnh. Quy mô tham chiếu khoảng 3,2 ha · 10 block 20 tầng · khoảng 3.300 căn · 28–70 m². Giá tham chiếu khoảng 12–13,5 triệu/m² — đối chiếu thông báo Sở Xây dựng Bắc Ninh trước khi nộp hồ sơ.

House X không thu đặt cọc thay chủ đầu tư.`,
    highlights: [
      {
        title: "Khoảng 3.300 căn · 10 block 20 tầng",
        text: "Khu đô thị Nếnh · gần cụm KCN Việt Yên (Bắc Giang cũ). Vị trí theo công bố chủ đầu tư tại Nếnh.",
      },
      {
        title: "Chủ đầu tư: Sài Gòn-Hải Phòng + Evergreen Bắc Giang",
        text: "Liên danh KCN Sài Gòn-Hải Phòng và Đầu tư phát triển bền vững Evergreen Bắc Giang — nhà ở xã hội phục vụ khu công nghiệp.",
      },
      {
        title: "Giá — xác minh Sở",
        text: "Giá tham chiếu khoảng 12–13,5 triệu/m². Đối chiếu Sở Xây dựng trước khi nộp hồ sơ.",
      },
    ],
    amenities: [
      "Khu đô thị Nếnh · gần KCN Vân Trung / Đình Trám",
      "Hạ tầng kỹ thuật theo tiêu chuẩn nhà ở xã hội",
      NOXH_AMENITIES_VERIFYING,
    ],
    faqs: [
      {
        q: "Khác gì Evergreen Bắc Ninh (HUD2 Tiên Du)?",
        a: "Đây là Evergreen Bắc Giang tại Nếnh (liên danh Sài Gòn-Hải Phòng + Evergreen Bắc Giang). Evergreen Bắc Ninh HUD2 tại Đại Đồng, Tiên Du là dự án riêng.",
      },
      {
        q: "Ở Vân Trung hay Nếnh?",
        a: "Một số tài liệu ghi Vân Trung; công bố chủ đầu tư / Sở: khu đô thị mới thị trấn Nếnh (phường Nếnh). Dự án gần cụm KCN Vân Trung.",
      },
      {
        q: "Bao nhiêu căn?",
        a: "Tham chiếu khoảng 3.300 căn trên khoảng 10 block 20 tầng. Đang mở bán theo đợt — xác minh thông báo mới nhất.",
      },
      {
        q: "Giá bao nhiêu?",
        a: "Tham chiếu khoảng 12–13,5 triệu/m². Xác minh thông báo Sở Xây dựng mới nhất trước khi nộp hồ sơ.",
      },
    ],
    unitTypes: [
      {
        name: "Căn NOXH (28–70 m²)",
        areaMin: 28,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: null,
      },
    ],
    legalDocs: [{ docType: "chap_thuan_noxh", status: "da_co" }],
  };
}

DEFS[8] = enrichEvergreenVanTrung(DEFS[8]!);

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
