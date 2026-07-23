import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  parseProjectOverview,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import {
  buildNoxhMock,
  buildNoxhSeedLanding,
  type NoxhLandingDef,
} from "@/lib/preview/_noxh-landing-factory";
import { getSupportPhoneDisplay } from "@/lib/site-config";

/**
 * Phân khu nhà ở xã hội trong KĐT Hồ Gươm Xanh (TBS Land = CĐT).
 * Liên hệ tư vấn trên House X: hotline House X — không dùng hotline website CĐT.
 * Nguồn công bố: hoguom-xanh.vn — giá/số căn NOXH chưa niêm yết.
 */
export const HGX_PROJECT_NAME = "Nhà ở xã hội Hồ Gươm Xanh";
export const HGX_COMMERCIAL_NAME = "Hồ Gươm Xanh";
export const HGX_PROJECT_SLUG = "nha-o-xa-hoi-ho-guom-xanh-thuan-an";

/** Ảnh local /public — alt/caption chuẩn SEO (từ khóa NOXH + vị trí). */
const HGX_IMAGES = {
  hero: {
    url: "/images/hero/urban-skyline-golden-hour.jpg",
    alt: "Nhà ở xã hội Hồ Gươm Xanh Thuận An Bình Dương — chung cư NOXH 5–12 tầng KĐT TBS Land",
  },
  map: {
    url: "/images/hero/hcmc-skyline-river-night.webp",
    alt: "Bản đồ vị trí nhà ở xã hội Hồ Gươm Xanh — 136 Đại lộ Bình Dương Lái Thiêu Thuận An",
    caption:
      "Vị trí nhà ở xã hội Hồ Gươm Xanh Thuận An — 136 Đại lộ Bình Dương, Lái Thiêu (cập nhật bản đồ CĐT khi có)",
  },
  gallery: [
    {
      url: "/images/hero/urban-skyline-golden-hour.jpg",
      caption:
        "Phối cảnh nhà ở xã hội Hồ Gươm Xanh — phân khu chung cư NOXH 5–12 tầng Thuận An",
    },
    {
      url: "/images/hero/housex-hero-slide-02-metro-hub-1920.jpg",
      caption:
        "Kết nối nhà ở xã hội Hồ Gươm Xanh — Quốc lộ 13 Đại lộ Bình Dương cửa ngõ TP.HCM",
    },
    {
      url: "/images/hero/hcmc-skyline-river-day.webp",
      caption:
        "Tiện ích nhà ở xã hội Hồ Gươm Xanh — hồ cảnh quan công viên nội khu Thuận An",
    },
  ],
} as const;

function housexHotlineCta(landing: ProjectLanding): ProjectLanding {
  const phone = getSupportPhoneDisplay();
  landing.ctaLabel = "Đăng ký tư vấn House X";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext = `Hotline House X ${phone} — tư vấn điều kiện NOXH, hồ sơ và đợt mở bán. Không dùng hotline trên website CĐT.`;
  return landing;
}

export const HGX_DEF: NoxhLandingDef = {
  id: "preview-ho-guom-xanh-noxh",
  slug: HGX_PROJECT_SLUG,
  name: HGX_PROJECT_NAME,
  commercialName: HGX_COMMERCIAL_NAME,
  developerId: "preview-tbs-land",
  developerName: "Công ty Cổ phần Đầu tư TBS Land (TBS Group)",
  developerTax: "3700987654",
  projectType: "NHA_O_XA_HOI",
  status: "SAP_MO_BAN",
  province: "Bình Dương",
  district: "Thuận An",
  ward: "Lái Thiêu",
  address: "136 Đại lộ Bình Dương",
  lat: 10.9047,
  lng: 106.7005,
  totalArea: 26.4,
  handoverDate: new Date("2028-12-31"),
  description:
    "Nhà ở xã hội Hồ Gươm Xanh — phân khu chung cư NOXH 5–12 tầng trong KĐT ~26,4 ha tại 136 Đại lộ Bình Dương, Lái Thiêu, Thuận An do TBS Land phát triển. Khởi công 6/2025; giá & đợt mở bán NOXH đang cập nhật. Tư vấn qua hotline House X.",
  seoTitle: "Nhà ở xã hội Hồ Gươm Xanh Thuận An — TBS Land · NOXH 5–12 tầng",
  seoDesc:
    "NOXH Hồ Gươm Xanh (Thuận An, Bình Dương): chung cư 5–12 tầng trong KĐT 26,4 ha TBS Land, mặt tiền Đại lộ Bình Dương. Tư vấn hotline House X — giá & điều kiện đang cập nhật.",
  heroSubtitle:
    "Hồ Gươm Xanh · Lái Thiêu Thuận An — chung cư NOXH 5–12 tầng trong KĐT 26,4 ha, mặt tiền Đại lộ Bình Dương · tư vấn House X",
  heroImage: { ...HGX_IMAGES.hero },
  locationMapImage: { ...HGX_IMAGES.map },
  locationNotes: `Nhà ở xã hội Hồ Gươm Xanh nằm trong Khu đô thị Hồ Gươm Xanh (tên thương mại Thuận An City) tại số 136 Đại lộ Bình Dương, phường Lái Thiêu, TP. Thuận An, tỉnh Bình Dương — trục Quốc lộ 13 kết nối TP.HCM – Bình Dương – Thủ Dầu Một.

Theo công bố CĐT TBS Land (hoguom-xanh.vn và tài liệu đối tác): KĐT quy mô khoảng 26,4 ha, mô hình “city within a city”, hơn 4.200 sản phẩm (nhà thấp tầng, chung cư thương mại và chung cư nhà ở xã hội), dân số ước tính khi lấp đầy khoảng 10.500 người. Phân khu nhà ở xã hội là các block chung cư cao 5–12 tầng, song song với cụm cao tầng thương mại (tới ~40 tầng) và tổ hợp khách sạn–trung tâm thương mại (~24 tầng).

Kết nối ngoại khu (tham chiếu CĐT):
• Mặt tiền Đại lộ Bình Dương / Quốc lộ 13 — huyết mạch Thuận An
• Gần Phạm Văn Đồng, Quốc lộ 1K, Quốc lộ 1A; di chuyển về trung tâm TP.HCM theo công bố CĐT khoảng dưới 30 phút (tùy giờ)
• Tiện ích ngoại khu lân cận: trung tâm mua sắm, công viên bờ kè Lái Thiêu, hạ tầng đô thị Thuận An

Điểm nhấn cảnh quan nội khu: hồ trung tâm mô phỏng không gian Hồ Gươm, công viên, phố đi bộ và tiện ích giáo dục–thương mại–thể thao trong masterplan.

Tiến độ (tham chiếu công khai 2025–2026): khởi công khoảng 27/06/2025; bàn giao tham chiếu khoảng 2028. Bảng giá và điều kiện mua nhà ở xã hội chưa công bố công khai — người mua cần đủ điều kiện đối tượng theo Luật Nhà ở và thông báo từng đợt của cơ quan NN / CĐT. Tư vấn điều kiện và theo dõi đợt mở bán: hotline House X (không dùng số trên website CĐT).`,
  highlights: [
    {
      title: "Chung cư NOXH 5–12 tầng trong đại đô thị",
      text: "Phân khu nhà ở xã hội nằm trong KĐT ~26,4 ha TBS Land — cư dân NOXH tiếp cận tiện ích đô thị đồng bộ (hồ cảnh quan, công viên, giáo dục, thương mại) theo masterplan.",
    },
    {
      title: "Mặt tiền Đại lộ Bình Dương — cửa ngõ TP.HCM",
      text: "136 Đại lộ Bình Dương, Lái Thiêu, Thuận An: trục QL13 huyết mạch Bình Dương–TP.HCM; thuận an cư cho người làm việc vùng Đông Bắc TP.HCM và Bình Dương.",
    },
    {
      title: "Quy hoạch 1/500 — khởi công 6/2025",
      text: "Theo CĐT / đối tác: quy hoạch chi tiết 1/500 đã phê duyệt; khởi công khoảng 27/06/2025. Bàn giao tham chiếu khoảng 2028 — cập nhật theo tiến độ thực tế.",
    },
    {
      title: "Tách rõ NOXH và sản phẩm thương mại",
      text: "KĐT còn nhà phố, biệt thự, căn hộ cao cấp — giá và điều kiện khác NOXH. Landing House X tập trung tư vấn điều kiện, hồ sơ và đợt mở bán nhà ở xã hội.",
    },
    {
      title: "Giá NOXH đang cập nhật — gọi House X",
      text: `Website CĐT chưa niêm yết bảng giá nhà ở xã hội. Không dùng số liệu thị trường thương mại làm giá NOXH. Hotline House X ${getSupportPhoneDisplay()} khi cần cập nhật đợt mở bán.`,
    },
  ],
  amenities: [
    "Hồ cảnh quan trung tâm (Hồ Gươm nội khu)",
    "Công viên & đường chạy bộ ven hồ",
    "Hồ bơi / khu thể thao (gym, spa, yoga)",
    "Trường mầm non & tiểu học (theo masterplan)",
    "Khu vui chơi trẻ em",
    "Shophouse / khối đế thương mại",
    "Phòng sinh hoạt cộng đồng",
    "Quảng trường & khu ẩm thực",
    "An ninh & hạ tầng đô thị đồng bộ",
  ],
  faqs: [
    {
      q: "Nhà ở xã hội Hồ Gươm Xanh nằm ở đâu?",
      a: "Trong Khu đô thị Hồ Gươm Xanh tại số 136 Đại lộ Bình Dương, phường Lái Thiêu, TP. Thuận An, tỉnh Bình Dương — mặt tiền trục Quốc lộ 13 / Đại lộ Bình Dương.",
    },
    {
      q: "Hồ Gươm Xanh có nhà ở xã hội không?",
      a: "Có. Theo công bố quy hoạch CĐT TBS Land, KĐT gồm chung cư nhà ở xã hội cao 5–12 tầng bên cạnh sản phẩm thương mại (nhà phố, biệt thự, căn hộ cao tầng).",
    },
    {
      q: "Giá nhà ở xã hội Hồ Gươm Xanh bao nhiêu?",
      a: `Chưa có bảng giá NOXH công bố công khai. Giá thương mại (nếu có trên thị trường) không áp dụng cho đối tượng mua NOXH. Gọi hotline House X ${getSupportPhoneDisplay()} để được cập nhật khi CĐT / cơ quan NN công bố đợt.`,
    },
    {
      q: "Ai được mua nhà ở xã hội tại Hồ Gươm Xanh?",
      a: "Người mua phải thuộc đối tượng và đủ điều kiện thu nhập, nhà ở, cư trú theo Luật Nhà ở và hướng dẫn địa phương. Hồ sơ đăng ký theo từng đợt do CĐT / cơ quan NN thông báo — không mua theo cơ chế căn hộ thương mại.",
    },
    {
      q: "Quy mô KĐT Hồ Gươm Xanh thế nào?",
      a: "Khoảng 26,4 ha; hơn 4.200 sản phẩm (thấp tầng, chung cư và NOXH); dân số ước ~10.500 khi lấp đầy. Có tổ hợp khách sạn–TTTM ~24 tầng và cụm cao tầng tới ~40 tầng theo công bố CĐT.",
    },
    {
      q: "Dự án khởi công và bàn giao khi nào?",
      a: "Tham chiếu công khai: khởi công khoảng 27/06/2025; bàn giao tham chiếu khoảng 2028. Tiến độ phân khu NOXH có thể khác phân khu thương mại — cần xác nhận từng đợt.",
    },
    {
      q: "Chủ đầu tư Hồ Gươm Xanh là ai?",
      a: "TBS Land (thành viên TBS Group) là chủ đầu tư dự án. House X không thay thế CĐT — chỉ hỗ trợ tư vấn điều kiện NOXH và theo dõi thông tin công bố.",
    },
    {
      q: "Liên hệ tư vấn nhà ở xã hội Hồ Gươm Xanh ở đâu?",
      a: `Qua hotline House X ${getSupportPhoneDisplay()} hoặc form Liên hệ trên House X (timnhaxahoi.com). Không dùng hotline / số điện thoại trên website CĐT TBS Land để tư vấn qua kênh House X.`,
    },
  ],
  gallery: HGX_IMAGES.gallery.map((g) => ({ ...g })),
  unitTypes: [
    {
      name: "Chung cư NOXH (block 5–12 tầng)",
      areaMin: undefined,
      areaMax: undefined,
      bedrooms: undefined,
      priceFrom: null,
    },
  ],
  legalDocs: [
    { docType: "quy_hoach_1_500", status: "da_co" },
    { docType: "chap_thuan_noxh", status: "dang_lam" },
  ],
};

export function buildHoGuomXanhMock(): ProjectDetail {
  const project = buildNoxhMock(HGX_DEF);
  const overview = parseProjectOverview(project.overviewData);
  if (overview.landing) {
    housexHotlineCta(overview.landing);
    project.overviewData = buildOverviewData(null, {
      totalUnits: overview.totalUnits,
      ...(overview.blocks != null ? { blocks: overview.blocks } : {}),
      landing: overview.landing,
    }) as ProjectDetail["overviewData"];
  }
  return project;
}

export function buildHoGuomXanhSeedLanding() {
  return housexHotlineCta(buildNoxhSeedLanding(HGX_DEF));
}

export function buildHoGuomXanhPreviewListings(): ProjectLandingListingCard[] {
  return [];
}
