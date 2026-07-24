import type { ProjectLandingListingCard } from "@/lib/data/listing";
import type { ProjectDetail } from "@/lib/data/project";
import {
  buildNoxhListings,
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";
import {
  NOXH_HAU_NGHIA_IMAGES,
  NOXH_LA_IMAGES,
  NOXH_MY_HANH_IMAGES,
  NOXH_ORI_IMAGES,
  NOXH_PHU_AN_IMAGES,
  NOXH_PVT_IMAGES,
} from "@/lib/content/noxh-long-an-images";
import { applyNoxhEditorial } from "@/lib/preview/noxh-long-an-editorial";

export const LA_HOME_SLUG = "noxh-la-home-luong-hoa-ben-luc";
export const MY_HANH_SLUG = "nha-o-xa-hoi-my-hanh-duc-hoa";
export const ORI_SLUG = "the-ori-phuong-mai-my-hanh";
export const HAU_NGHIA_SLUG = "noxh-kdt-hau-nghia-duc-hoa";
export const PVT_SLUG = "noxh-kdt-phuoc-vinh-tay-can-giuoc";
export const PHU_AN_SLUG = "noxh-phu-an-thanh-ben-luc";

const LA_HOME_DEF: NoxhLandingDef = {
  id: "preview-la-home-noxh",
  slug: LA_HOME_SLUG,
  name: "Nhà ở xã hội LA Home",
  commercialName: "Chung cư NOXH LA Home",
  developerId: "preview-prodezi-la",
  developerName: "Công ty Cổ phần Prodezi Long An",
  developerTax: "1100860594",
  developerLogo: NOXH_LA_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "DANG_BAN",
  province: "Long An",
  district: "Bến Lức",
  ward: "Lương Hòa",
  address: "KĐT sinh thái LA Home, xã Lương Hòa (lô 8C)",
  lat: 10.652,
  lng: 106.498,
  totalArea: 7.103,
  totalUnits: 400,
  blocks: 2,
  handoverDate: new Date("2026-12-31"),
  description:
    "Nhà ở xã hội LA Home do Prodezi Long An phát triển tại KĐT sinh thái Lương Hòa, Bến Lức. 2 block 8 tầng, 400 căn 30–62 m², giá từ ~385 triệu. NOXH đầu tiên khởi công Long An 2025, bàn giao 12/2026.",
  seoTitle: "Nhà ở xã hội LA Home Bến Lức — Giá từ ~385 triệu/căn",
  seoDesc:
    "NOXH LA Home Long An: 400 căn, Block A–B 8 tầng, 14–17 tr/m², KĐT 100 ha Lương Hòa. Prodezi — bàn giao 12/2026.",
  heroSubtitle:
    "LA Home · Lương Hòa Bến Lức — 400 căn, Block A–B 8 tầng, ~14–17 tr/m², công viên 2,2 ha, bàn giao 12/2026",
  heroImage: NOXH_LA_IMAGES.hero,
  locationMapImage: NOXH_LA_IMAGES.map,
  locationNotes: `Nhà ở xã hội LA Home nằm trong Khu đô thị sinh thái LA Home (KDC Lương Hòa, lô 8C), xã Lương Hòa, huyện Bến Lức — cửa ngõ giáp ranh TP.HCM, đối diện KCN Prodezi.

Theo Prodezi & khudothilahome.vn: KĐT quy mô ~100 ha, mật độ xây dựng ~31%, 20% diện tích cảnh quan mặt nước. NOXH gồm 2 block cao 8 tầng trên 7.103 m², 400 căn (30–62 m²), khởi công 3/2025, cất nóc 4/2026, bàn giao dự kiến 12/2026.

Kết nối: Đại lộ Lương Hòa–Bình Chánh, cao tốc Bến Lức–Long Thành, Vành đai 3, Võ Văn Kiệt nối dài.`,
  highlights: [
    {
      title: "400 căn — Block A, B cao 8 tầng",
      text: "NOXH đầu tiên khởi công tại Long An (2025). Diện tích căn 30–62 m²; đảm bảo chỗ ở cho hơn 1.200 lao động vùng KCN.",
    },
    {
      title: "Giá gốc ~14–17 triệu/m²",
      text: "Giá tham chiếu CĐT: từ ~385 triệu/căn (385–800 triệu tùy diện tích). Vay NHCSXH tới 70% theo chương trình 120.000 tỷ.",
    },
    {
      title: "KĐT sinh thái 100 ha",
      text: "Công viên trung tâm ~2,2 ha, trung tâm y tế 0,5 ha, trường liên cấp 4,3 ha, TT thể thao 1 ha — tiện ích đồng bộ.",
    },
    {
      title: "Prodezi + Coteccons",
      text: "CĐT Prodezi Long An; phát triển Hướng Việt Holdings; thi công Coteccons. GPXD & chủ trương đầu tư đã có.",
    },
  ],
  amenities: [
    "Công viên trung tâm 2,2 ha",
    "Trung tâm y tế 0,5 ha",
    "Trường liên cấp 4,3 ha",
    "TT thể thao 1 ha (hồ bơi, tennis, gym)",
    "KCN Prodezi liền kề",
    "Shophouse / TMDV KĐT",
  ],
  faqs: [
    {
      q: "Nhà ở xã hội LA Home nằm ở đâu?",
      a: "Trong KĐT sinh thái LA Home, xã Lương Hòa, huyện Bến Lức, Long An — cửa ngõ kết nối TP.HCM và miền Tây.",
    },
    {
      q: "Giá nhà ở xã hội LA Home bao nhiêu?",
      a: "Tham chiếu CĐT: ~14–17 triệu/m²; căn từ ~385 triệu (30 m²) đến ~800 triệu (62 m²). Giá chính thức theo bảng niêm yết từng đợt mở bán.",
    },
    {
      q: "LA Home bàn giao khi nào?",
      a: "Dự kiến bàn giao tháng 12/2026. Dự án đã cất nóc sớm (4/2026) theo thông tin Prodezi.",
    },
  ],
  gallery: [...NOXH_LA_IMAGES.gallery],
  unitTypes: [
    { name: "Studio / 1PN (~30 m²)", areaMin: 30, areaMax: 35, bedrooms: 1, priceFrom: 385_000_000 },
    { name: "2PN (~45–52 m²)", areaMin: 45, areaMax: 52, bedrooms: 2, priceFrom: 649_000_000 },
    { name: "2PN lớn (~62 m²)", areaMin: 62, areaMax: 62, bedrooms: 2, priceFrom: 800_000_000 },
  ],
  legalDocs: [
    { docType: "chap_thuan_noxh", status: "da_co" },
    { docType: "giay_phep_xay_dung", status: "da_co", issuedDate: new Date("2025-01-01") },
    { docType: "quy_hoach_1_500", status: "da_co" },
  ],
};

const MY_HANH_DEF: NoxhLandingDef = {
  id: "preview-my-hanh-noxh",
  slug: MY_HANH_SLUG,
  name: "Nhà ở xã hội Mỹ Hạnh",
  commercialName: "Bee Home LA",
  developerId: "preview-bee-home",
  developerName: "Công ty CP Đầu tư Thương mại Bee Home Long An",
  developerTax: "1100987654",
  developerLogo: NOXH_MY_HANH_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "DANG_BAN",
  province: "Long An",
  district: "Đức Hòa",
  ward: "Mỹ Hạnh Nam",
  address: "Ấp Mới 2, xã Mỹ Hạnh Nam",
  lat: 10.883,
  lng: 106.405,
  totalArea: 0.1496,
  totalUnits: 166,
  blocks: 1,
  handoverDate: new Date("2026-12-31"),
  description:
    "Nhà ở xã hội Mỹ Hạnh (Bee Home LA) tại Mỹ Hạnh Nam, Đức Hòa. Chung cư 12 tầng, 166 căn 1PN 31–34 m², giá ~31,38 triệu/m² (~1–1,1 tỷ/căn). Khởi công 10/2025.",
  seoTitle: "Nhà ở xã hội Mỹ Hạnh Đức Hòa — Bee Home LA ~1 tỷ/căn",
  seoDesc:
    "NOXH Mỹ Hạnh Long An: 166 căn 1PN 31–34 m², ~31,4 tr/m². Bee Home Long An — gần QL1A, bàn giao 12/2026.",
  heroSubtitle:
    "Bee Home LA · Mỹ Hạnh Nam Đức Hòa — 166 căn 1PN 31–34 m², ~31,4 tr/m², giá ~1–1,1 tỷ",
  heroImage: NOXH_MY_HANH_IMAGES.hero,
  locationMapImage: NOXH_MY_HANH_IMAGES.map,
  locationNotes: `Nhà ở xã hội Mỹ Hạnh (tên thương mại Bee Home LA) tại Ấp Mới 2, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An — gần Quốc lộ 1A, giáp ranh TP.HCM.

Theo Sở Xây dựng (công bố 2026): chung cư 12 tầng trên 1.496 m², 166 căn 1 phòng ngủ (31–34 m²). Giá tạm tính 31.380.000 đ/m² (chưa VAT & phí bảo trì). Khởi công 3/10/2025, hoàn thành dự kiến 12/2026.`,
  highlights: [
    {
      title: "166 căn 1PN — 31–34 m²",
      text: "100% quỹ căn bán NOXH; duy nhất loại 1 phòng ngủ compact phù hợp công nhân và hộ trẻ.",
    },
    {
      title: "Giá ~31,38 triệu/m²",
      text: "Tương đương ~972 triệu – 1,07 tỷ/căn (chưa VAT). Mức giá công bố qua Sở Xây dựng 2026.",
    },
    {
      title: "Chung cư 12 tầng — Bee Home",
      text: "CĐT Bee Home Long An; vị trí Mỹ Hạnh Nam thuộc vùng Đức Hòa — Tây Ninh giáp TP.HCM.",
    },
  ],
  amenities: ["Thang máy", "Bãi đậu xe", "An ninh", "Gần QL1A & KCN vùng liền kề"],
  faqs: [
    {
      q: "Nhà ở xã hội Mỹ Hạnh ở đâu?",
      a: "Ấp Mới 2, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An (Bee Home LA).",
    },
    {
      q: "Giá NOXH Mỹ Hạnh bao nhiêu?",
      a: "31,38 triệu/m² (chưa VAT & bảo trì) — căn ~1–1,1 tỷ tùy diện tích 31–34 m².",
    },
  ],
  gallery: [...NOXH_MY_HANH_IMAGES.gallery],
  unitTypes: [
    { name: "1PN (~31 m²)", areaMin: 31, areaMax: 31, bedrooms: 1, priceFrom: 972_000_000 },
    { name: "1PN (~34 m²)", areaMin: 34, areaMax: 34, bedrooms: 1, priceFrom: 1_067_000_000 },
  ],
  legalDocs: [
    { docType: "chap_thuan_noxh", status: "da_co" },
    { docType: "giay_phep_xay_dung", status: "da_co" },
  ],
};

const ORI_DEF: NoxhLandingDef = {
  id: "preview-ori-noxh",
  slug: ORI_SLUG,
  name: "Nhà ở xã hội The Ori Phương Mai",
  developerId: "preview-phuong-mai-la",
  developerName: "Công ty Cổ phần Phương Mai Long An",
  developerTax: "1101122334",
  developerLogo: NOXH_ORI_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "DANG_BAN",
  province: "Long An",
  district: "Đức Hòa",
  ward: "Mỹ Hạnh Nam",
  address: "Đường Gò Hưu, xã Mỹ Hạnh Nam",
  lat: 10.878,
  lng: 106.412,
  totalArea: 1.76,
  totalUnits: 1646,
  blocks: 3,
  handoverDate: new Date("2027-09-30"),
  description:
    "The Ori Phương Mai — Khu NOXH Gò Hưu, Mỹ Hạnh Nam: 3 tháp 27 tầng, 1.646 căn (1.269 NOXH). CĐT Phương Mai Long An. Giá NOXH dự kiến ~20 tr/m² (~570 tr/căn 50 m²). Bàn giao Q3/2027.",
  seoTitle: "Nhà ở xã hội The Ori Phương Mai — 1.269 căn NOXH Gò Hưu",
  seoDesc:
    "NOXH The Ori Phương Mai Đức Hòa: 3 tháp, 1.269 căn NOXH, ~20 tr/m². Gò Hưu, Mỹ Hạnh — bàn giao Q3/2027.",
  heroSubtitle:
    "The Ori Phương Mai · Gò Hưu Mỹ Hạnh — 3 tháp, 1.269 căn NOXH, ~20 tr/m², bàn giao Q3/2027",
  heroImage: NOXH_ORI_IMAGES.hero,
  locationMapImage: NOXH_ORI_IMAGES.map,
  locationNotes: `The Ori Phương Mai (tên pháp lý: Khu nhà ở xã hội xã Mỹ Hạnh) tại đường Gò Hưu, xã Mỹ Hạnh Nam, huyện Đức Hòa — gần Tỉnh lộ 8, kết nối Củ Chi, Hóc Môn.

Quy mô 1,76 ha: 3 tháp 27 tầng + 1 hầm; 1.646 căn (1.269 NOXH + 377 thương mại). Khởi công 7/10/2025; vốn đầu tư ~1.638 tỷ. Bàn giao dự kiến Q3/2027.`,
  highlights: [
    {
      title: "1.269 căn NOXH — 3 tháp 27 tầng",
      text: "Quy mô lớn nhất vùng Mỹ Hạnh; 2 tháp NOXH + 1 tháp thương mại.",
    },
    {
      title: "Giá dự kiến ~20 triệu/m²",
      text: "Tham chiếu ~570 triệu/căn 50 m² — giá chính thức theo đợt mở bán Sở XD.",
    },
    {
      title: "Gò Hưu — Tỉnh lộ 8",
      text: "Khu dân cư hiện hữu; tiện ích Bách Hóa Xanh, trạm y tế, công viên Trần Anh.",
    },
  ],
  amenities: ["Hầm liên thông", "Công viên nội khu", "Shophouse tầng trệt", "An ninh 24/7"],
  faqs: [
    {
      q: "The Ori Phương Mai nằm ở đâu?",
      a: "Đường Gò Hưu, xã Mỹ Hạnh Nam, huyện Đức Hòa, Long An.",
    },
    {
      q: "Quy mô NOXH The Ori Phương Mai?",
      a: "1.646 căn tổng (1.269 NOXH); 3 tháp cao 27 tầng trên 1,76 ha.",
    },
  ],
  gallery: [...NOXH_ORI_IMAGES.gallery],
  unitTypes: [
    { name: "NOXH ~50 m²", areaMin: 50, areaMax: 50, bedrooms: 2, priceFrom: 570_000_000 },
    { name: "NOXH ~60 m²", areaMin: 60, areaMax: 65, bedrooms: 2, priceFrom: 720_000_000 },
  ],
  legalDocs: [
    { docType: "chap_thuan_noxh", status: "da_co" },
    { docType: "giay_phep_xay_dung", status: "dang_lam" },
  ],
};

const HAU_NGHIA_DEF: NoxhLandingDef = {
  id: "preview-hau-nghia-noxh",
  slug: HAU_NGHIA_SLUG,
  name: "Nhà ở xã hội KĐT mới Hậu Nghĩa",
  commercialName: "Green Nestera · Vinhomes Green City",
  developerId: "preview-green-city",
  developerName: "Công ty CP Phát triển Thành phố Xanh (MIK Group phát triển)",
  developerTax: "1101555666",
  developerLogo: NOXH_HAU_NGHIA_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "DANG_BAN",
  province: "Long An",
  district: "Đức Hòa",
  ward: "Hậu Nghĩa",
  address: "Nguyễn Thị Hạnh, KĐT Vinhomes Green City",
  lat: 10.901,
  lng: 106.381,
  totalArea: 16,
  totalUnits: 6399,
  blocks: 8,
  handoverDate: new Date("2028-12-31"),
  description:
    "NOXH KĐT mới Hậu Nghĩa — quy hoạch 6.399 căn trong quy hoạch tổng thể 16 ha (CĐT Phát triển Thành phố Xanh). Giai đoạn Green Nestera: 8 tháp, 1.467 căn, khởi công 12/2025 trong Vinhomes Green City khoảng 192 ha.",
  seoTitle: "Nhà ở xã hội Hậu Nghĩa — Green Nestera 6.399 căn NOXH",
  seoDesc:
    "NOXH KĐT Hậu Nghĩa Đức Hòa: quy hoạch 6.399 căn, Green Nestera 1.467 căn đang xây. Vinhomes Green City — ~20 tr/m².",
  heroSubtitle:
    "Green Nestera · Hậu Nghĩa Đức Hòa — quy hoạch tổng thể 6.399 căn NOXH, giai đoạn 1: 1.467 căn 8 tháp",
  heroImage: NOXH_HAU_NGHIA_IMAGES.hero,
  locationMapImage: NOXH_HAU_NGHIA_IMAGES.map,
  locationNotes: `Nhà ở xã hội thuộc Khu đô thị mới Hậu Nghĩa – Đức Hòa (nay xã Hậu Nghĩa), do Công ty CP Phát triển Thành phố Xanh làm chủ đầu tư — quy hoạch 16 ha, 6.399 căn NOXH theo kế hoạch tỉnh Long An.

Phân khu Green Nestera (MIK Group phát triển) trong Vinhomes Green City ~192 ha: 8 tháp 8 tầng, 1.467 căn 52–65 m², khởi công 7/12/2025. Vị trí Nguyễn Thị Hạnh — cửa ngõ KĐT.`,
  highlights: [
    {
      title: "Masterplan 6.399 căn NOXH",
      text: "Quy hoạch tổng thể KĐT mới Hậu Nghĩa — một trong các quỹ NOXH lớn nhất Long An.",
    },
    {
      title: "Green Nestera — 1.467 căn (giai đoạn 1)",
      text: "8 tháp 8 tầng; 1PN–2PN 52–65 m²; vốn ~900 tỷ; khởi công 12/2025.",
    },
    {
      title: "Trong Vinhomes Green City ~192 ha",
      text: "Hưởng tiện ích đại đô thị: hồ sinh thái, Vincom, hạ tầng đồng bộ.",
    },
  ],
  amenities: ["Vinhomes Green City", "Hồ sinh thái", "Vincom Mega Mall (quy hoạch)", "Công viên nội khu"],
  faqs: [
    {
      q: "NOXH Hậu Nghĩa có bao nhiêu căn?",
      a: "Masterplan 6.399 căn NOXH trên 16 ha. Giai đoạn Green Nestera đang triển khai: 1.467 căn.",
    },
    {
      q: "Green Nestera là gì?",
      a: "Phân khu NOXH đầu tiên trong Vinhomes Green City Hậu Nghĩa, do MIK Group phát triển.",
    },
  ],
  gallery: [...NOXH_HAU_NGHIA_IMAGES.gallery],
  unitTypes: [
    { name: "1PN (~52 m²)", areaMin: 52, areaMax: 52, bedrooms: 1, priceFrom: 600_000_000 },
    { name: "2PN (~60–65 m²)", areaMin: 60, areaMax: 65, bedrooms: 2, priceFrom: 900_000_000 },
  ],
  legalDocs: [
    { docType: "quy_hoach_1_500", status: "da_co" },
    { docType: "chap_thuan_noxh", status: "da_co" },
  ],
};

const PVT_DEF: NoxhLandingDef = {
  id: "preview-pvt-noxh",
  slug: PVT_SLUG,
  name: "Nhà ở xã hội KĐT mới Phước Vĩnh Tây",
  commercialName: "Vinhomes Phước Vĩnh Tây",
  developerId: "preview-vinhomes-pvt",
  developerName: "Liên danh Vinhomes – VIG",
  developerTax: "1101777888",
  developerLogo: NOXH_PVT_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "SAP_MO_BAN",
  province: "Long An",
  district: "Cần Giuộc",
  ward: "Phước Vĩnh Tây",
  address: "KĐT mới Phước Vĩnh Tây",
  lat: 10.612,
  lng: 106.638,
  totalArea: 1090,
  totalUnits: 13440,
  blocks: 0,
  handoverDate: new Date("2030-12-31"),
  description:
    "NOXH KĐT mới Phước Vĩnh Tây (Cần Giuộc): quy hoạch 13.440 căn chung cư cao 10 tầng trong đại đô thị khoảng 1.090 ha do Vinhomes–VIG. Hoàn thiện quy hoạch tổng thể đến 2030.",
  seoTitle: "Nhà ở xã hội Phước Vĩnh Tây — 13.440 căn NOXH Cần Giuộc",
  seoDesc:
    "NOXH KĐT Phước Vĩnh Tây Long An: 13.440 căn, tháp 10 tầng, ~1.090 ha. Vinhomes–VIG — đang triển khai hạ tầng.",
  heroSubtitle:
    "Phước Vĩnh Tây Cần Giuộc — 13.440 căn NOXH, chung cư 10 tầng, đại đô thị ~1.090 ha",
  heroImage: NOXH_PVT_IMAGES.hero,
  locationMapImage: NOXH_PVT_IMAGES.map,
  locationNotes: `Khu đô thị mới Phước Vĩnh Tây tại xã Phước Vĩnh Tây, huyện Cần Giuộc — quy mô ~1.090 ha, vốn ~80.000 tỷ, liên danh Vinhomes & VIG.

Theo báo cáo ĐTM & báo chí: 13.440 căn hộ NOXH (tháp 10 tầng); 15.244 lô thương mại; 2.370 căn tái định cư. Dân số dự kiến ~90.000 người; hoàn thiện 2030.`,
  highlights: [
    {
      title: "13.440 căn NOXH — siêu quy mô",
      text: "Một trong các quỹ NOXH lớn nhất miền Nam; chung cư cao 10 tầng theo quy hoạch.",
    },
    {
      title: "Đại đô thị ~1.090 ha",
      text: "Vinhomes–VIG; kết hợp nhà thương mại, tái định cư và hạ tầng đồng bộ.",
    },
    {
      title: "Cần Giuộc — ven TP.HCM",
      text: "Khu vực cảng, logistics và KCN phía Nam Long An.",
    },
  ],
  amenities: ["Công viên quy hoạch", "Trường học", "TTTM", "Hạ tầng giao thông KĐT"],
  faqs: [
    {
      q: "NOXH Phước Vĩnh Tây ở đâu?",
      a: "Xã Phước Vĩnh Tây, huyện Cần Giuộc, Long An — KĐT mới Vinhomes–VIG.",
    },
    {
      q: "Bao nhiêu căn NOXH?",
      a: "13.440 căn hộ chung cư NOXH (10 tầng) theo quy hoạch đã công bố.",
    },
  ],
  gallery: [...NOXH_PVT_IMAGES.gallery],
  unitTypes: [
    { name: "NOXH (~50 m²)", areaMin: 50, areaMax: 55, bedrooms: 2, priceFrom: null },
    { name: "NOXH (~60 m²)", areaMin: 60, areaMax: 65, bedrooms: 2, priceFrom: null },
  ],
  legalDocs: [
    { docType: "danh_gia_tac_dong_moi_truong", status: "da_co" },
    { docType: "quy_hoach_1_500", status: "da_co" },
  ],
};

const PHU_AN_DEF: NoxhLandingDef = {
  id: "preview-phu-an-noxh",
  slug: PHU_AN_SLUG,
  name: "Nhà ở xã hội Phú An Thạnh",
  commercialName: "Khu nhà ở chuyên gia Phú An Thạnh",
  developerId: "preview-phu-an-thanh",
  developerName: "Công ty TNHH MTV Phú An Thạnh – Long An",
  developerTax: "1100860593",
  developerLogo: NOXH_PHU_AN_IMAGES.logo,
  projectType: "NHA_O_XA_HOI",
  status: "SAP_MO_BAN",
  province: "Long An",
  district: "Bến Lức",
  ward: "An Thạnh",
  address: "Tỉnh lộ 830, KCN Phú An Thạnh",
  lat: 10.638,
  lng: 106.512,
  totalArea: 29.23,
  totalUnits: 1100,
  blocks: 0,
  handoverDate: null,
  description:
    "Nhà ở xã hội / nhà ở công nhân Phú An Thạnh tại Bến Lức: quy hoạch ~1.100 căn phục vụ chuyên gia & CN KCN Phú An Thạnh (~29 ha). Giai đoạn đầu thấp tầng đã triển khai.",
  seoTitle: "Nhà ở xã hội Phú An Thạnh Bến Lức — ~1.100 căn công nhân",
  seoDesc:
    "NOXH Phú An Thạnh Long An: quy hoạch ~1.100 căn, TL830 Bến Lức, cạnh KCN 1.002 ha. Nhà ở công nhân & chuyên gia.",
  heroSubtitle:
    "Phú An Thạnh · TL830 Bến Lức — quy hoạch ~1.100 căn NOXH/công nhân, KCN 1.002 ha",
  heroImage: NOXH_PHU_AN_IMAGES.hero,
  locationMapImage: NOXH_PHU_AN_IMAGES.map,
  locationNotes: `Khu nhà ở chuyên gia – công nhân và dân cư Phú An Thạnh tại Tỉnh lộ 830, xã An Thạnh, huyện Bến Lức — trong quy hoạch tổng thể KCN Phú An Thạnh (khoảng 1.002 ha).

CĐT Phú An Thạnh (từ 2008). Quy hoạch KDC ~29 ha phục vụ CN & chuyên gia; mục tiêu quỹ nhà ~1.100 căn theo kế hoạch phát triển KCN. Cách cao tốc TP.HCM–Trung Lương ~3 km, QL1A ~6 km.`,
  highlights: [
    {
      title: "Quy hoạch ~1.100 căn",
      text: "Nhà ở phục vụ công nhân & chuyên gia KCN Phú An Thạnh — nhu cầu an cư vùng công nghiệp.",
    },
    {
      title: "KCN 1.002 ha liền kề",
      text: "Hạ tầng KCN đồng bộ; thuận tiện cho người lao động KCN.",
    },
    {
      title: "TL830 — Bến Lức",
      text: "Kết nối cao tốc Trung Lương và QL1A; cửa ngõ Long An–TP.HCM.",
    },
  ],
  amenities: ["KCN Phú An Thạnh", "Hạ tầng KDC", "Dịch vụ nội khu KCN", "Giao thông TL830"],
  faqs: [
    {
      q: "NOXH Phú An Thạnh ở đâu?",
      a: "Tỉnh lộ 830, xã An Thạnh, huyện Bến Lức, Long An — trong KCN Phú An Thạnh.",
    },
    {
      q: "Quy mô bao nhiêu căn?",
      a: "Quy hoạch mục tiêu ~1.100 căn nhà ở công nhân/chuyên gia; chi tiết từng giai đoạn theo tiến độ CĐT.",
    },
  ],
  gallery: [...NOXH_PHU_AN_IMAGES.gallery],
  unitTypes: [
    { name: "Nhà ở thấp tầng (tham khảo)", areaMin: 50, areaMax: 80, bedrooms: 2, priceFrom: null },
  ],
  legalDocs: [{ docType: "quy_hoach_1_500", status: "da_co" }],
};

LA_HOME_DEF.listings = buildNoxhListings(LA_HOME_DEF, [
  { code: "NOX-LAH01", price: 420_000_000, tier: "FREE", image: NOXH_LA_IMAGES.gallery[0].url },
]);

const REGISTRY: Record<string, NoxhLandingDef> = {
  [LA_HOME_SLUG]: applyNoxhEditorial(LA_HOME_DEF),
  [MY_HANH_SLUG]: applyNoxhEditorial(MY_HANH_DEF),
  [ORI_SLUG]: applyNoxhEditorial(ORI_DEF),
  [HAU_NGHIA_SLUG]: applyNoxhEditorial(HAU_NGHIA_DEF),
  [PVT_SLUG]: applyNoxhEditorial(PVT_DEF),
  [PHU_AN_SLUG]: applyNoxhEditorial(PHU_AN_DEF),
};

export function getNoxhLongAnDef(slug: string): NoxhLandingDef | null {
  return REGISTRY[slug] ?? null;
}

export function buildNoxhLongAnMock(slug: string): ProjectDetail | null {
  const def = getNoxhLongAnDef(slug);
  return def ? buildNoxhMock(def) : null;
}

export function buildNoxhLongAnListings(slug: string): ProjectLandingListingCard[] {
  const def = getNoxhLongAnDef(slug);
  return def?.listings ?? [];
}

export function buildNoxhLongAnSeedLanding(slug: string) {
  const def = getNoxhLongAnDef(slug);
  return def ? buildNoxhSeedLanding(def) : null;
}

export function allNoxhLongAnSlugs(): string[] {
  return Object.keys(REGISTRY);
}

export function allNoxhLongAnDefs(): NoxhLandingDef[] {
  return Object.values(REGISTRY);
}
