/**
 * Nội thất HouseX — content hub, case studies, inspiration pins.
 * House X kết nối studio đối tác tại TP.HCM & lân cận.
 */

export const NOI_THAT_GEO = "TP.HCM & vùng lân cận";

export const STYLE_PATH_PREFIX = "/noi-that/phong-cach" as const;
export const CASE_STUDY_PATH_PREFIX = "/noi-that/cong-trinh" as const;
export const NHA_DEP_PATH = "/noi-that/nha-dep" as const;

export type InteriorStyleSlug = "hien-dai" | "scandinavian" | "indochine" | "toi-gian";

export const INTERIOR_STYLE_SLUGS: InteriorStyleSlug[] = [
  "hien-dai",
  "scandinavian",
  "indochine",
  "toi-gian",
];

/** Legacy flat URLs → nested paths (301). */
export const NOI_THAT_LEGACY_REDIRECTS: Record<string, string> = {
  "phong-cach-hien-dai": `${STYLE_PATH_PREFIX}/hien-dai`,
  "phong-cach-scandinavian": `${STYLE_PATH_PREFIX}/scandinavian`,
  "phong-cach-indochine": `${STYLE_PATH_PREFIX}/indochine`,
  "phong-cach-toi-gian": `${STYLE_PATH_PREFIX}/toi-gian`,
  "can-ho-dep-y-tuong": NHA_DEP_PATH,
  "thiet-ke-noi-that": `${STYLE_PATH_PREFIX}/hien-dai`,
  "thi-cong-noi-that": NHA_DEP_PATH,
};

export function stylePagePath(slug: string) {
  return `${STYLE_PATH_PREFIX}/${slug}`;
}

export function caseStudyPagePath(slug: string) {
  return `${CASE_STUDY_PATH_PREFIX}/${slug}`;
}

/** Map slug mới → key ảnh card (giữ ảnh Unsplash đã có). */
export const STYLE_IMAGE_KEYS: Record<InteriorStyleSlug, string> = {
  "hien-dai": "phong-cach-hien-dai",
  scandinavian: "phong-cach-scandinavian",
  indochine: "phong-cach-indochine",
  "toi-gian": "phong-cach-toi-gian",
};

export type InteriorMainService = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

export const NOI_THAT_MAIN_SERVICES: InteriorMainService[] = [
  {
    id: "thiet-ke-3d",
    title: "Thiết kế concept & 3D",
    desc: "Brief, phối cảnh 2D/3D và duyệt bản vẽ trước khi thi công — studio đối tác triển khai.",
    icon: "✦",
  },
  {
    id: "thi-cong-tron-goi",
    title: "Thi công trọn gói",
    desc: "Xây dựng, nội thất và hoàn thiện căn hộ, nhà phố tại TP.HCM — quản lý dự án xuyên suốt.",
    icon: "◈",
  },
  {
    id: "hoan-thien-decor",
    title: "Hoàn thiện & decor",
    desc: "Sơn, sàn, tủ bếp, phòng tắm và decor — bàn giao không gian sống hoàn chỉnh.",
    icon: "◇",
  },
  {
    id: "tu-van-bo-tri",
    title: "Tư vấn bố trí không gian",
    desc: "Tối ưu diện tích, ánh sáng và lưu trữ — phù hợp căn nhỏ hoặc nhận nhà bàn giao thô.",
    icon: "○",
  },
];

export type InteriorCaseStudy = {
  slug: string;
  styleSlug: InteriorStyleSlug;
  category: "can-ho" | "nha-pho" | "biet-thu" | "van-phong";
  title: string;
  metaDescription: string;
  h1: string;
  summary: string;
  area: string;
  district: string;
  challenge: string;
  solution: string;
  materials: string;
  timeline: string;
  /** Không công bố giá — chỉ mô tả ước lượng chung. */
  costNote: string;
  imageKey: string;
  galleryKeys: string[];
  isMock: boolean;
};

export const INTERIOR_CASE_STUDIES: InteriorCaseStudy[] = [
  {
    slug: "can-ho-2pn-q1-hien-dai",
    styleSlug: "hien-dai",
    category: "can-ho",
    title: "Căn hộ 2PN Q.1 — Hiện đại",
    metaDescription:
      "Thiết kế & thi công căn hộ 2 phòng ngủ phong cách hiện đại tại Quận 1, TP.HCM. House X kết nối studio đối tác.",
    h1: "Căn hộ 2PN Quận 1 — Phong cách hiện đại",
    summary:
      "Căn 72 m² view nội khu — khách hàng cần không gian mở, tủ âm tường và bếp liền phòng khách.",
    area: "72 m²",
    district: "Quận 1, TP.HCM",
    challenge:
      "Hành lang dài, thiếu ánh sáng tự nhiên ở khu bếp; cần tách khu làm việc tại home không chiếm phòng ngủ.",
    solution:
      "Phá tường bếp–phòng khách có điều kiện BQL; kính cường lực đón sáng; tủ liền tường tích hợp bàn làm việc gập.",
    materials: "Sàn gỗ công nghiệp, đá quartz bếp, kính cường lực, sơn nước Jotun tone trung tính.",
    timeline: "Thiết kế 2 tuần · Thi công 6–8 tuần",
    costNote:
      "Chi phí phụ thuộc hạng mục và vật liệu. Liên hệ House X để nhận ước tính sau khảo sát — không cam kết giá công khai.",
    imageKey: "phong-cach-hien-dai",
    galleryKeys: ["phong-cach-hien-dai", "can-ho-dep-y-tuong"],
    isMock: true,
  },
  {
    slug: "nha-pho-q7-hien-dai",
    styleSlug: "hien-dai",
    category: "nha-pho",
    title: "Nhà phố Q.7 — Hiện đại",
    metaDescription:
      "Thi công nội thất nhà phố 4 tầng phong cách hiện đại tại Quận 7. House X — studio đối tác TP.HCM.",
    h1: "Nhà phố 4 tầng Quận 7 — Hiện đại tối giản",
    summary: "Nhà phố mặt tiền 4 m, 320 m² sàn — cải tạo toàn bộ nội thất tầng 1–3.",
    area: "320 m² sàn",
    district: "Quận 7, TP.HCM",
    challenge: "Mặt tiền hẹp, cầu thang chiếm diện tích; gia đình 2 thế hệ cần zoning riêng.",
    solution:
      "Cầu thang kính + đèn indirect; tầng 1 không gian chung mở; tầng 2–3 phòng ngủ riêng biệt.",
    materials: "Gạch lớn format, lam gỗ trang trí, cửa nhôm Xingfa, nội thất built-in.",
    timeline: "Thiết kế 3 tuần · Thi công 12–16 tuần",
    costNote: "Báo giá chi tiết sau khảo sát hiện trạng — liên hệ House X.",
    imageKey: "phong-cach-hien-dai",
    galleryKeys: ["phong-cach-hien-dai"],
    isMock: true,
  },
  {
    slug: "can-ho-3pn-thu-duc-scandinavian",
    styleSlug: "scandinavian",
    category: "can-ho",
    title: "Căn hộ 3PN Thủ Đức — Scandinavian",
    metaDescription:
      "Nội thất Scandinavian căn hộ 3 phòng ngủ tại TP. Thủ Đức. Palette sáng, gỗ oak — House X.",
    h1: "Căn hộ 3PN Thủ Đức — Scandinavian ấm áp",
    summary: "95 m², gia đình trẻ — tone trắng–be, gỗ sáng và textile ấm.",
    area: "95 m²",
    district: "TP. Thủ Đức",
    challenge: "Khí hậu nhiệt đới — cần vật liệu chống ẩm khu bếp/WC và rèm blackout.",
    solution: "Gỗ công nghiệp chống ẩm; rèm 2 lớp; thông gió chéo; cây xanh nội thất điểm nhấn.",
    materials: "Gỗ oak công nghiệp, sơn trắng matte, đèn pendant, vải linen.",
    timeline: "Thiết kế 2 tuần · Thi công 7–9 tuần",
    costNote: "Ước tính chi tiết qua form liên hệ — minh bạch hạng mục trước khi ký.",
    imageKey: "phong-cach-scandinavian",
    galleryKeys: ["phong-cach-scandinavian", "can-ho-dep-y-tuong"],
    isMock: true,
  },
  {
    slug: "can-ho-1pn-q2-scandinavian",
    styleSlug: "scandinavian",
    category: "can-ho",
    title: "Căn hộ 1PN Q.2 — Scandinavian",
    metaDescription: "Thiết kế căn hộ studio 1 phòng ngủ Scandinavian tại Quận 2 — tối ưu không gian nhỏ.",
    h1: "Căn studio 1PN Quận 2 — Scandinavian",
    summary: "48 m² — dual-purpose phòng khách/ngủ, bếp mở và khu làm việc góc.",
    area: "48 m²",
    district: "Quận 2, TP.HCM",
    challenge: "Diện tích nhỏ, cần cảm giác rộng và đủ storage.",
    solution: "Giường thông minh; tủ cao trần; gương mở rộng thị giác; palette trắng–gỗ sáng.",
    materials: "Gỗ sáng, sơn trắng, kính gương, đèn ấm 3000K.",
    timeline: "Thiết kế 10 ngày · Thi công 4–5 tuần",
    costNote: "Liên hệ để nhận phương án và ước tính phù hợp ngân sách.",
    imageKey: "phong-cach-scandinavian",
    galleryKeys: ["phong-cach-scandinavian"],
    isMock: true,
  },
  {
    slug: "nha-pho-q3-indochine",
    styleSlug: "indochine",
    category: "nha-pho",
    title: "Nhà phố Q.3 — Indochine",
    metaDescription:
      "Cải tạo nội thất nhà phố phong cách Indochine tại Quận 3 — gạch hoa, gỗ tối, đèn lồng.",
    h1: "Nhà phố Quận 3 — Indochine đương đại",
    summary: "Nhà phố cũ 3 tầng — giữ nét cổ, pha hiện đại tiện nghi.",
    area: "180 m² sàn",
    district: "Quận 3, TP.HCM",
    challenge: "Cân bằng không khí Indochine với nhu cầu hiện đại; trần thấp tầng 1.",
    solution: "Tường trắng 70% + điểm nhấn gạch bông; lam gỗ; đèn indirect nâng trần thị giác.",
    materials: "Gạch bông cement, gỗ tếch, đèn đồng mờ, sơn Jotun trắng ngà.",
    timeline: "Thiết kế 3 tuần · Thi công 10–14 tuần",
    costNote: "Chi phí tham khảo qua khảo sát — không cam kết giá trên website.",
    imageKey: "phong-cach-indochine",
    galleryKeys: ["phong-cach-indochine"],
    isMock: true,
  },
  {
    slug: "biet-thu-q2-indochine",
    styleSlug: "indochine",
    category: "biet-thu",
    title: "Biệt thự Q.2 — Indochine",
    metaDescription: "Thiết kế nội thất biệt thự Indochine tại Quận 2 — không gian rộng, gỗ và gạch hoa.",
    h1: "Biệt thự Quận 2 — Indochine sang trọng",
    summary: "450 m² — sảnh double-height, phòng khách mở ra sân vườn.",
    area: "450 m²",
    district: "Quận 2, TP.HCM",
    challenge: "Không gian lớn dễ rời rạc; cần flow liên tục giữa các khu.",
    solution: "Trục nhìn xuyên suốt; repeat motif gạch hoa; furniture scale phù hợp không gian lớn.",
    materials: "Gỗ gụ tông trung, gạch bông handmade, đá marble, rèm vải dày.",
    timeline: "Thiết kế 4 tuần · Thi công 16–20 tuần",
    costNote: "Gửi form — House X kết nối studio báo giá chi tiết sau khảo sát.",
    imageKey: "phong-cach-indochine",
    galleryKeys: ["phong-cach-indochine", "can-ho-dep-y-tuong"],
    isMock: true,
  },
  {
    slug: "can-ho-2pn-q4-toi-gian",
    styleSlug: "toi-gian",
    category: "can-ho",
    title: "Căn hộ 2PN Q.4 — Tối giản",
    metaDescription: "Nội thất minimal căn hộ 2 phòng ngủ Quận 4 — ít đồ, nhiều không gian trống.",
    h1: "Căn hộ 2PN Quận 4 — Minimal",
    summary: "65 m² — chủ nhà thích không gian gọn, dễ vệ sinh, tập trung chất lượng vật liệu.",
    area: "65 m²",
    district: "Quận 4, TP.HCM",
    challenge: "Loại bỏ đồ thừa nhưng vẫn đủ storage cho gia đình 3 người.",
    solution: "Tủ âm tường full-height; nội thất multi-function; palette 2 màu + texture gỗ.",
    materials: "Gỗ veneer, sơn trắng, đá solid surface, inox mờ.",
    timeline: "Thiết kế 2 tuần · Thi công 5–7 tuần",
    costNote: "Ước tính qua liên hệ — minh bạch hạng mục, không giá cam kết online.",
    imageKey: "phong-cach-toi-gian",
    galleryKeys: ["phong-cach-toi-gian"],
    isMock: true,
  },
  {
    slug: "van-phong-q1-toi-gian",
    styleSlug: "toi-gian",
    category: "van-phong",
    title: "Văn phòng Q.1 — Tối giản",
    metaDescription: "Thiết kế văn phòng làm việc phong cách tối giản tại Quận 1 — startup 15 người.",
    h1: "Văn phòng Quận 1 — Minimal workspace",
    summary: "120 m² — open plan, phòng họp kính, khu focus yên tĩnh.",
    area: "120 m²",
    district: "Quận 1, TP.HCM",
    challenge: "Cần acoustic cho phòng họp và ánh sáng làm việc đủ 500 lux.",
    solution: "Kính cách âm phòng họp; đèn panel LED; màu trung tính giảm mỏi mắt.",
    materials: "Sàn vinyl cao cấp, kính cường lực, thạch cao thả, đèn LED panel.",
    timeline: "Thiết kế 2 tuần · Thi công 4–6 tuần",
    costNote: "Báo giá sau khảo sát mặt bằng — liên hệ House X.",
    imageKey: "phong-cach-toi-gian",
    galleryKeys: ["phong-cach-toi-gian", "phong-cach-hien-dai"],
    isMock: true,
  },
];

export type NhaDepPin = {
  slug: string;
  title: string;
  image: string;
  tags: string[];
  span: "normal" | "tall" | "wide";
};

/** Pin inspiration — local assets only (Ahrefs: Unsplash IDs chết → 404). */
const INTERIOR_PIN_IMAGES = [
  "/images/tools/interior-hub.webp",
  "/images/hero/urban-skyline-golden-hour.jpg",
  "/images/hero/housex-thu-thiem-civic-center-day.webp",
  "/images/hero/housex-hero-slide-02-metro-hub.webp",
  "/images/hero/hcmc-skyline-river-day.webp",
  "/images/hero/housex-hero-slide-01-civic-center.webp",
  "/images/hero/hcmc-skyline-river-night.webp",
  "/images/hero/housex-thu-thiem-civic-center-night.webp",
] as const;

export const NHA_DEP_PINS: NhaDepPin[] = [
  { slug: "phong-khach-sang", title: "Phòng khách sáng", image: INTERIOR_PIN_IMAGES[0], tags: ["Phòng khách", "Hiện đại"], span: "wide" },
  { slug: "bep-lien-thong", title: "Bếp liên thông", image: INTERIOR_PIN_IMAGES[1], tags: ["Bếp", "Scandinavian"], span: "normal" },
  { slug: "pn-master-be", title: "Phòng ngủ master tone be", image: INTERIOR_PIN_IMAGES[2], tags: ["Phòng ngủ", "Indochine"], span: "tall" },
  { slug: "wc-toi-gian", title: "WC tối giản", image: INTERIOR_PIN_IMAGES[3], tags: ["Phòng tắm", "Minimal"], span: "normal" },
  { slug: "ban-cong-xanh", title: "Ban công xanh", image: INTERIOR_PIN_IMAGES[4], tags: ["Ban công", "Decor"], span: "normal" },
  { slug: "phong-lam-viec", title: "Góc làm việc tại nhà", image: INTERIOR_PIN_IMAGES[5], tags: ["Workspace", "Căn hộ"], span: "wide" },
  { slug: "sanh-nha-pho", title: "Sảnh nhà phố", image: INTERIOR_PIN_IMAGES[6], tags: ["Nhà phố", "Hiện đại"], span: "tall" },
  { slug: "phong-an-gia-dinh", title: "Phòng ăn gia đình", image: INTERIOR_PIN_IMAGES[7], tags: ["Phòng ăn", "Scandinavian"], span: "normal" },
  { slug: "phong-khach-indochine", title: "Salon Indochine", image: INTERIOR_PIN_IMAGES[2], tags: ["Phòng khách", "Indochine"], span: "wide" },
  { slug: "tre-trang-tri", title: "Decor cây xanh", image: INTERIOR_PIN_IMAGES[0], tags: ["Decor", "Scandinavian"], span: "normal" },
  { slug: "phong-ngu-nho", title: "Phòng ngủ căn nhỏ", image: INTERIOR_PIN_IMAGES[1], tags: ["Phòng ngủ", "Căn hộ"], span: "normal" },
  { slug: "ke-sach-tuong", title: "Kệ sách âm tường", image: INTERIOR_PIN_IMAGES[3], tags: ["Storage", "Minimal"], span: "tall" },
];

export const NHA_DEP_TAGS = [
  "Tất cả",
  "Phòng khách",
  "Phòng ngủ",
  "Bếp",
  "Căn hộ",
  "Scandinavian",
  "Hiện đại",
  "Indochine",
  "Minimal",
] as const;

export function getCaseStudy(slug: string) {
  return INTERIOR_CASE_STUDIES.find((c) => c.slug === slug);
}

export function getCaseStudiesByStyle(styleSlug: InteriorStyleSlug) {
  return INTERIOR_CASE_STUDIES.filter((c) => c.styleSlug === styleSlug);
}

export function getFeaturedCaseStudies(limit = 6) {
  return INTERIOR_CASE_STUDIES.slice(0, limit);
}
