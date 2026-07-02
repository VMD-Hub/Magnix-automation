import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { MONREI_SAIGON_IMAGES } from "@/lib/content/monrei-saigon-images";

const NOW = new Date("2026-06-25T00:00:00.000Z");

/** Giá đợt 1 theo saigonmonrei.vn (mở bán 25/6/2026): studio từ ~1,58 tỷ. */
const PRICE_FROM = 1_580_000_000;

export const MONREI_SAIGON_NAME = "Monrei Saigon";
export const MONREI_SAIGON_SLUG = "monrei-saigon-thuan-giao";

function buildMonreiSaigonLanding() {
  const landing = defaultProjectLanding(MONREI_SAIGON_NAME);
  landing.heroSubtitle =
    "Mitsubishi · Tokyu Land · Phát Đạt — Thành phố nước thủy liệu đầu tiên tại VN: 4,6 ha, 3 tháp, 2.717 căn, studio từ 1,58 tỷ, bàn giao Q1/2028";
  landing.heroImage = { ...MONREI_SAIGON_IMAGES.hero };
  landing.locationMapImage = { ...MONREI_SAIGON_IMAGES.locationMap };
  landing.locationNotes = `Monrei Saigon tọa lạc tại Nguyễn Thị Minh Khai, phường Thuận Giao, TP. Hồ Chí Minh (khu vực trung tâm Thuận Giao — Bình Dương cũ), liền kề nút giao Quốc lộ 13 và Vành đai 3.

Kết nối giao thông:
• ~30 phút về trung tâm TP.HCM; ~40 phút sân bay Tân Sơn Nhất & Long Thành
• 5 phút đi bộ đến ga Metro số 2 (C6); 5 phút xe máy đến ga Metro số 1 (S8)
• Trong bán kính 2 km: Aeon Mall, Mega Market, bệnh viện quốc tế, sân golf, trường quốc tế
• Lõi "vành đai công nghiệp" — kết nối 5 cụm KCN Bình Dương trong bán kính 5–25 km

Nhà mẫu: Mega Market, Song Hành, An Phú, TP.HCM. Văn phòng bán hàng dự án: 39 Nguyễn Thị Minh Khai, Thuận Giao.`;
  landing.highlights = [
    {
      title: "Thành phố nước — thủy liệu chuẩn Nhật",
      text: "Concept độc đáo đầu tiên tại Việt Nam: 6.500 m² mặt nước, 88 m sông lười, Onsen suối khoáng nóng, 5 phòng Detox xông hơi và Aquatonic massage thủy lực — 5 tầng cảnh quan biophilic.",
    },
    {
      title: "Liên doanh Mitsubishi · Tokyu Land · Phát Đạt",
      text: "Mitsubishi Corporation (56%) — lần đầu đứng tên phát triển BĐS tại VN; hợp tác Tokyu Land (24%) và Phát Đạt (20%). Thi công Centralcons, vận hành CBRE.",
    },
    {
      title: "4,6 ha — 3 tháp, 2.717 sản phẩm",
      text: "Tòa Wellness Onsen (36 tầng, 1.106 căn + 9 shophouse), Detox 1 & 2 (39 tầng, 825 + 753 căn). Tầng điển hình 34 căn/tầng, 14 thang máy.",
    },
    {
      title: "Studio từ 1,58 tỷ — đợt 1 ~45 tr/m²",
      text: "Mở bán tòa M1 Onsen 25/6/2026: studio 1,58 tỷ; 2PN+1WC từ 1,98 tỷ; 2PN+2WC từ 2,52 tỷ; 3PN từ 3,95 tỷ. Bàn giao full nội thất cao cấp.",
    },
    {
      title: "Vốn 15% — HTLS đến nhận nhà",
      text: "Đặt cọc 50 triệu; ký HĐMB thanh toán 15%; hỗ trợ vay ngân hàng (Vietcombank, BIDV, MB Bank…); ân hạn nợ gốc tới 60 tháng; ưu đãi phí quản lý 2 năm đầu 5.000 đ/m².",
    },
    {
      title: "Pháp lý minh bạch — sổ hồng lâu dài",
      text: "Đủ giấy phép bán hàng, ký HĐMB ngay theo Luật Nhà ở; bảo lãnh tiến độ xây dựng và cho vay ngân hàng. Tiến độ 06/2026: tòa Onsen thi công tầng 12 (~33%).",
    },
  ];
  landing.amenities = [
    "Onsen suối khoáng nóng",
    "5 phòng Detox xông hơi",
    "Aquatonic massage thủy lực",
    "6.500 m² mặt nước bơi lội",
    "88 m sông lười",
    "Sky Pool tầng 20",
    "Sky Garden tầng mái",
    "Sảnh thông tầng 9 m",
    "Hệ thống an ninh 4 lớp",
    "Indoor gym & spa",
    "Private dining & lounge",
    "9 shophouse nội khu",
  ];
  landing.faqs = [
    {
      q: "Monrei Saigon nằm ở đâu?",
      a: "Tại Nguyễn Thị Minh Khai, phường Thuận Giao, TP. Hồ Chí Minh — trung tâm Thuận Giao, liền kề Metro số 1 & 2 và Vành đai 3. Dự án thuộc khu vực đang đầu tư hạ tầng mạnh (metro, vành đai, cao tốc).",
    },
    {
      q: "Monrei Saigon có những loại căn hộ nào?",
      a: "Studio (34–38 m²), căn 2PN+1WC (51–55 m²), 2PN+2WC (64–66 m²), 3PN (88 m²), garden house và shophouse. Cơ cấu tòa Onsen: studio ~21%, 2PN+1WC ~42%, 2PN+2WC ~31%, 3PN ~5%.",
    },
    {
      q: "Giá bán Monrei Saigon đợt 1 bao nhiêu?",
      a: "Theo công bố mở bán tòa M1 (25/6/2026): giá tham chiếu từ ~45 triệu/m²; studio từ 1,58 tỷ; 2PN+1WC từ 1,98 tỷ; 2PN+2WC từ 2,52 tỷ; 3PN từ 3,95 tỷ. Liên hệ để nhận bảng giá và giỏ căn cập nhật.",
    },
    {
      q: "Chính sách thanh toán Monrei Saigon ra sao?",
      a: "Đặt cọc 50 triệu; ký HĐMB thanh toán 15% giá trị căn; phần còn lại vay ngân hàng với hỗ trợ lãi suất đến khi nhận nhà và ân hạn nợ gốc tới 60 tháng. Có phương án thanh toán chuẩn (~2,2%/tháng) và thanh toán nhanh 50%.",
    },
    {
      q: "Monrei Saigon bàn giao khi nào?",
      a: "Dự kiến Q1/2028 bàn giao tòa đầu tiên (Onsen); Q4/2028 bàn giao toàn dự án. Tiến độ thi công 06/2026: tòa Onsen xây thô đến tầng 12.",
    },
    {
      q: "Pháp lý Monrei Saigon có đầy đủ không?",
      a: "Dự án có giấy phép bán hàng, ký HĐMB ngay theo quy định; sở hữu lâu dài với khách Việt Nam. Có bảo lãnh tiến độ xây dựng và cho vay từ các ngân hàng lớn.",
    },
    {
      q: "Chủ đầu tư Monrei Saigon là ai?",
      a: "Liên doanh Mitsubishi Corporation (56%), Tokyu Land Corporation (24%) và Phát Đạt Corporation (20%). Đơn vị thi công Centralcons; quản lý vận hành CBRE.",
    },
    {
      q: "Monrei Saigon có gì khác biệt so với căn hộ thông thường?",
      a: "Concept thành phố nước — thủy liệu theo tiêu chuẩn Nhật Bản: Onsen, Detox, Aquatonic, 5 tầng cảnh quan, vận hành resort 5 sao. Phí quản lý cao hơn bình thường do tiêu chuẩn vận hành — cần cân nhắc khi mua ở hoặc cho thuê.",
    },
  ];
  landing.gallery = [...MONREI_SAIGON_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & giỏ căn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá, phương án vay 15% và chính sách ưu đãi Monrei Saigon — liên hệ HouseX.";
  return landing;
}

export function buildMonreiSaigonMock(): ProjectDetail {
  const landing = buildMonreiSaigonLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 2717,
    blocks: 3,
    landing,
  });

  return {
    id: "preview-monrei-saigon",
    developerId: "preview-monrei-dev",
    slug: MONREI_SAIGON_SLUG,
    name: MONREI_SAIGON_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thuận Giao",
    ward: "Thuận Giao",
    address: "Nguyễn Thị Minh Khai, Thuận Giao, TP.HCM",
    lat: 10.9725,
    lng: 106.6923,
    totalArea: 4.6,
    density: 30,
    handoverDate: new Date("2028-03-31"),
    overviewData,
    description:
      "Monrei Saigon là dự án căn hộ cao cấp concept thành phố nước — thủy liệu đầu tiên tại Việt Nam, do liên doanh Mitsubishi Corporation, Tokyu Land và Phát Đạt phát triển tại Thuận Giao, TP.HCM. Quy mô 4,6 ha, 3 tòa tháp (Onsen, Detox 1 & 2), 2.717 căn hộ và shophouse. Nổi bật 6.500 m² mặt nước, Onsen, Detox, Aquatonic và 5 tầng cảnh quan biophilic. Giá đợt 1 từ ~1,58 tỷ (studio); vốn 15%, HTLS đến nhận nhà. Bàn giao dự kiến Q1/2028.",
    seoTitle: "Monrei Saigon Thuận Giao — Căn hộ thủy liệu từ 1,58 tỷ",
    seoDesc:
      "Monrei Saigon TP.HCM: Mitsubishi · Tokyu · Phát Đạt, thành phố nước 4,6 ha, studio từ 1,58 tỷ, vốn 15%, sổ hồng lâu dài, bàn giao Q1/2028.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-monrei-dev",
      name: "Monrei Saigon — Mitsubishi · Tokyu Land · Phát Đạt",
      taxCode: "0301450897",
      verified: true,
      logoUrl: MONREI_SAIGON_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-monrei-studio",
        projectId: "preview-monrei-saigon",
        name: "Studio (34–38 m²)",
        areaMin: 34,
        areaMax: 38,
        bedrooms: 0,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-monrei-2pn1wc",
        projectId: "preview-monrei-saigon",
        name: "2PN + 1WC (51–55 m²)",
        areaMin: 51,
        areaMax: 55,
        bedrooms: 2,
        priceFrom: 1_980_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-monrei-2pn2wc",
        projectId: "preview-monrei-saigon",
        name: "2PN + 2WC (64–66 m²)",
        areaMin: 64,
        areaMax: 66,
        bedrooms: 2,
        priceFrom: 2_520_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-monrei-3pn",
        projectId: "preview-monrei-saigon",
        name: "3PN (88 m²)",
        areaMin: 88,
        areaMax: 88,
        bedrooms: 3,
        priceFrom: 3_950_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-monrei-ld1",
        projectId: "preview-monrei-saigon",
        docType: "giay_phep_ban_hang",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-monrei-ld2",
        projectId: "preview-monrei-saigon",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-monrei-ld3",
        projectId: "preview-monrei-saigon",
        docType: "bao_lanh_ngan_hang",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildMonreiSaigonPreviewListings(): ProjectLandingListingCard[] {
  const imgs = MONREI_SAIGON_IMAGES.gallery;
  return [
    {
      id: "preview-monrei-listing-1",
      code: "M1-ST-12",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 1_580_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[7].url }],
    },
    {
      id: "preview-monrei-listing-2",
      code: "M1-2PN1-08",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 1_980_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[6].url }],
    },
    {
      id: "preview-monrei-listing-3",
      code: "M1-2PN2-15",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 2_520_000_000,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: imgs[0].url }],
    },
    {
      id: "preview-monrei-listing-4",
      code: "M1-3PN-03",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 3_950_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Phạm Thị D — Môi giới" },
      media: [{ url: imgs[1].url }],
    },
  ];
}

export function buildMonreiSaigonSeedLanding() {
  return buildMonreiSaigonLanding();
}
