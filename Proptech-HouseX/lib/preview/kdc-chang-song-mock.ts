import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { KDC_CHANG_SONG_IMAGES } from "@/lib/content/kdc-chang-song-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Từ khóa SEO chính. */
export const CS_PROJECT_NAME = "Nhà ở xã hội KDC Chàng Sông";
export const CS_PROJECT_SLUG = "noxh-kdc-chang-song-phuoc-tan";

function buildChangSongLanding() {
  const landing = defaultProjectLanding(CS_PROJECT_NAME);
  landing.heroSubtitle =
    "Phước Tân, Biên Hòa — NOXH thấp tầng & cao tầng trong KDC quy hoạch mới, vùng KCN phía Nam · CĐT Hùng Cường";
  landing.heroImage = { ...KDC_CHANG_SONG_IMAGES.hero };
  landing.locationMapImage = { ...KDC_CHANG_SONG_IMAGES.locationMap };
  landing.locationNotes = `Nhà ở xã hội KDC Chàng Sông thuộc khu dân cư quy hoạch mới tại phường Phước Tân, TP. Biên Hòa, tỉnh Đồng Nai — vùng phát triển công nghiệp năng động phía Nam thành phố.

Kết nối vùng:
• Gần các khu công nghiệp và cụm doanh nghiệp phía Nam Biên Hòa
• Thuận tiện di chuyển tới cao tốc Biên Hòa – Vũng Tàu và trục giao thông liên vùng
• Cùng địa bàn với các dự án tái định cư, nhà ở xã hội đang triển khai tại Phước Tân

Quy hoạch tổng thể bố trí block chung cư NOXH cao tầng xen kẽ tiện ích trường học, công viên trong KDC. Dự án do Công ty Cổ phần Hợp tác Quốc tế Hùng Cường phát triển.

Tiến độ (6/2026): Đang san lấp, hoàn thiện hạ tầng kỹ thuật nội khu và xây dựng phần móng. CĐT phối hợp địa phương rà soát đối tượng ưu tiên trước khi công bố đóng tiền đợt 1. Cập nhật qua cổng thông tin tỉnh hoặc hungcuonggroup.com.`;
  landing.highlights = [
    {
      title: "NOXH thấp tầng & cao tầng — KDC Chàng Sông",
      text: "Sản phẩm đa tầng trong tổng thể khu dân cư quy hoạch mới Phước Tân; block chung cư NOXH cao tầng kết hợp tiện ích cộng đồng.",
    },
    {
      title: "Vùng KCN phía Nam Biên Hòa",
      text: "Phù hợp công nhân, người lao động và gia đình trẻ làm việc tại các khu công nghiệp Đồng Nai — an cư gần nơi làm việc.",
    },
    {
      title: "Tiện ích trường học & công viên nội khu",
      text: "Masterplan bố trí trường học, công viên xen kẽ block NOXH — hướng tới khu dân cư đồng bộ, văn minh.",
    },
    {
      title: "Pháp lý: đã có ĐTM & TKKT thi công",
      text: "Đã có quyết định phê duyệt báo cáo đánh giá tác động môi trường (ĐTM) và phê duyệt thiết kế kỹ thuật thi công.",
    },
    {
      title: "Giai đoạn hạ tầng & móng (2026)",
      text: "San lấp, hoàn thiện hạ tầng kỹ thuật nội khu, thi công phần móng. Chưa công bố giá và đóng tiền đợt 1 — đang rà soát đối tượng ưu tiên.",
    },
    {
      title: "CĐT Công ty CP Hợp tác Quốc tế Hùng Cường",
      text: "Theo dõi tiến độ qua hungcuonggroup.com hoặc cổng thông tin điện tử tỉnh Đồng Nai.",
    },
  ];
  landing.amenities = [
    "Trường học trong khu dân cư",
    "Công viên cây xanh",
    "Hạ tầng giao thông nội khu",
    "Shophouse / TMDV tầng trệt (theo quy hoạch)",
    "Hệ thống thoát nước & điện chiếu sáng",
    "Khu vui chơi trẻ em",
    "An ninh khu dân cư",
    "Bãi đậu xe (theo thiết kế block)",
  ];
  landing.faqs = [
    {
      q: "Nhà ở xã hội KDC Chàng Sông nằm ở đâu?",
      a: "Trong khu dân cư Chàng Sông, phường Phước Tân, TP. Biên Hòa, tỉnh Đồng Nai — vùng phát triển công nghiệp phía Nam thành phố.",
    },
    {
      q: "Chủ đầu tư dự án KDC Chàng Sông là ai?",
      a: "Công ty Cổ phần Hợp tác Quốc tế Hùng Cường (Hùng Cường Group). Cập nhật tiến độ qua hungcuonggroup.com.",
    },
    {
      q: "Dự án KDC Chàng Sông có những loại hình nào?",
      a: "NOXH thấp tầng và cao tầng trong tổng thể KDC quy hoạch mới: block chung cư NOXH cao tầng xen kẽ trường học, công viên. Chi tiết mặt bằng và diện tích căn sẽ công bố khi mở đăng ký.",
    },
    {
      q: "Giá nhà ở xã hội KDC Chàng Sông bao nhiêu?",
      a: "Chưa công bố giá bán và đóng tiền đợt 1 (6/2026). CĐT đang phối hợp địa phương rà soát danh sách đối tượng ưu tiên theo quy định NOXH. Liên hệ HouseX để nhận thông báo khi có bảng giá chính thức.",
    },
    {
      q: "Pháp lý dự án KDC Chàng Sông đến đâu?",
      a: "Đã có quyết định phê duyệt báo cáo đánh giá tác động môi trường (ĐTM) và phê duyệt thiết kế kỹ thuật thi công. Dự án đang giai đoạn san lấp, hạ tầng nội khu và thi công móng.",
    },
    {
      q: "Ai được đăng ký mua nhà ở xã hội KDC Chàng Sông?",
      a: "Theo Luật Nhà ở — đối tượng thu nhập thấp, công nhân, cán bộ công chức và các nhóm NOXH theo quy định. CĐT đang phối hợp địa phương lập danh sách rà soát ưu tiên trước đợt đóng tiền 1.",
    },
    {
      q: "Theo dõi tiến độ KDC Chàng Sông ở đâu?",
      a: "Qua cổng thông tin điện tử tỉnh Đồng Nai (Sở Xây dựng) hoặc trang đại diện hungcuonggroup.com. HouseX cập nhật landing khi có thông tin mở bán chính thức.",
    },
  ];
  landing.gallery = [...KDC_CHANG_SONG_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Đăng ký quan tâm NOXH KDC Chàng Sông — nhận thông báo giá và lịch nộp hồ sơ.";
  return landing;
}

export function buildKdcChangSongMock(): ProjectDetail {
  const landing = buildChangSongLanding();
  const overviewData = buildOverviewData(null, { landing });

  return {
    id: "preview-kdc-chang-song",
    developerId: "preview-hung-cuong",
    slug: CS_PROJECT_SLUG,
    name: CS_PROJECT_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "SAP_MO_BAN",
    province: "TP. Đồng Nai",
    district: "Biên Hòa",
    ward: "Phước Tân",
    address: "KDC Chàng Sông, phường Phước Tân",
    lat: 10.9285,
    lng: 106.915,
    totalArea: null,
    density: null,
    handoverDate: null,
    overviewData,
    description:
      "Nhà ở xã hội KDC Chàng Sông — NOXH thấp tầng & cao tầng tại Phước Tân, Biên Hòa do Công ty CP Hợp tác Quốc tế Hùng Cường phát triển. Đang triển khai hạ tầng và móng; chưa công bố giá.",
    seoTitle: "Nhà ở xã hội KDC Chàng Sông — NOXH Phước Tân Biên Hòa",
    seoDesc:
      "NOXH KDC Chàng Sông Phước Tân, Biên Hòa: thấp tầng & cao tầng, vùng KCN phía Nam. CĐT Hùng Cường — đang triển khai, liên hệ tư vấn.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-hung-cuong",
      name: "Công ty Cổ phần Hợp tác Quốc tế Hùng Cường",
      taxCode: "0322000001",
      verified: true,
      logoUrl: KDC_CHANG_SONG_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-cs-cao-tang",
        projectId: "preview-kdc-chang-song",
        name: "Căn hộ NOXH cao tầng",
        areaMin: null,
        areaMax: null,
        bedrooms: null,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-cs-thap-tang",
        projectId: "preview-kdc-chang-song",
        name: "Nhà ở NOXH thấp tầng",
        areaMin: null,
        areaMax: null,
        bedrooms: null,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-cs-ld-1",
        projectId: "preview-kdc-chang-song",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2025-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-cs-ld-2",
        projectId: "preview-kdc-chang-song",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: new Date("2024-06-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-cs-ld-3",
        projectId: "preview-kdc-chang-song",
        docType: "danh_gia_tac_dong_moi_truong",
        status: "da_co",
        issuedDate: new Date("2025-06-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-cs-ld-4",
        projectId: "preview-kdc-chang-song",
        docType: "pheduyet_thiet_ke_ky_thuat",
        status: "da_co",
        issuedDate: new Date("2025-09-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-cs-ld-5",
        projectId: "preview-kdc-chang-song",
        docType: "giay_phep_xay_dung",
        status: "dang_lam",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildKdcChangSongPreviewListings(): ProjectLandingListingCard[] {
  return [];
}

export function buildKdcChangSongSeedLanding() {
  return buildChangSongLanding();
}
