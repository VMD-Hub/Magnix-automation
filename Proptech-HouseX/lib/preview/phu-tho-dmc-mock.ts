import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { PHU_THO_DMC_IMAGES } from "@/lib/content/phu-tho-dmc-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Giá chính thức 6/2026: 23.251.398 đ/m² (đã VAT, chưa 2% bảo trì + hệ số vị trí). */
const PRICE_M2 = 23_251_398;
const PRICE_STUDIO = Math.round(34.5 * PRICE_M2);
const PRICE_1PN = Math.round(45 * PRICE_M2);
const PRICE_2PN = Math.round(77 * PRICE_M2);

/** Từ khóa tìm kiếm chính — ưu tiên trước tên thương mại Phú Thọ DMC. */
export const LTK_PROJECT_NAME = "Nhà ở xã hội Lý Thường Kiệt";
export const LTK_COMMERCIAL_NAME = "Phú Thọ DMC";
export const LTK_PROJECT_SLUG = "nha-o-xa-hoi-ly-thuong-kiet";

function buildPhuThoDmcLanding() {
  const landing = defaultProjectLanding(LTK_PROJECT_NAME);
  landing.heroSubtitle =
    "Phú Thọ DMC · 324 Lý Thường Kiệt Q10 — 755 căn NOXH, ~23,25 tr/m², Studio–2PN 34,5–77 m², bàn giao 08/2026";
  landing.heroImage = { ...PHU_THO_DMC_IMAGES.hero };
  landing.locationMapImage = { ...PHU_THO_DMC_IMAGES.locationMap };
  landing.locationNotes = `Nhà ở xã hội Lý Thường Kiệt (tên thương mại Phú Thọ DMC) tọa lạc số 324 đường Lý Thường Kiệt, phường Diên Hồng (trước Phường 14), Quận 10, TP.HCM — vị trí đất vàng trung tâm nội thành.

Kết nối ngoại khu:
• Đối diện Nhà thi đấu Phú Thọ và Bệnh viện Trưng Vương
• Gần chợ Hòa Bình, ĐH Y Dược, Bệnh viện Chợ Rẫy, các tuyến metro tương lai
• Thuận tiện di chuyển tới Quận 1, Quận 3, Quận 5 và sân bay Tân Sơn Nhất

Dự án do Công ty Cổ phần Đức Mạnh (Đức Mạnh Group) phát triển. Cuối 6/2026, Sở Xây dựng TP.HCM và CĐT đã công bố phương án giá bán chính thức. Công trình đang hoàn thiện cuối, dự kiến nghiệm thu bàn giao khoảng tháng 8/2026.`;
  landing.highlights = [
    {
      title: "Giá ~23,25 triệu/m² — đất vàng Q10",
      text: "Mức giá chính thức 23.251.398 đ/m² (đã VAT, chưa 2% phí bảo trì và hệ số điều chỉnh vị trí). Căn hộ tham chiếu khoảng 800 triệu – 1,8 tỷ tùy diện tích.",
    },
    {
      title: "755 căn NOXH mở bán + 270 căn cho thuê",
      text: "Tổng 1.254 căn (1.025 NOXH); mở bán khối A1, A2 và một phần B2. Hơn 12.000 hồ sơ đăng ký nhu cầu mua/thuê từ các đợt rà soát trước.",
    },
    {
      title: "4 block cao 25 tầng — 14.703 m²",
      text: "Quy mô 4 tòa chung cư 25 tầng trên diện tích đất hơn 14.700 m², mật độ xây dựng 36%.",
    },
    {
      title: "Layout Studio – 2PN (34,5–77 m²)",
      text: "Thiết kế ban công, thông tầng, tối ưu ánh sáng tự nhiên; bàn giao hoàn thiện cơ bản. Mặt bằng tầng điển hình có trên gallery.",
    },
    {
      title: "Vị trí đối diện NTD Phú Thọ",
      text: "324 Lý Thường Kiệt, Quận 10 — đối diện Nhà thi đấu Phú Thọ, cạnh Bệnh viện Trưng Vương; tiện ích y tế – giáo dục – thương mại dày đặc.",
    },
    {
      title: "Phú Thọ DMC — tên thương mại dự án",
      text: "Dự án còn được gọi Phú Thọ DMC (Đức Mạnh Group) — một trong các NOXH được tìm kiếm nhiều nhất nội thành TP.HCM 2025–2026.",
    },
  ];
  landing.amenities = [
    "Hồ bơi nội khu",
    "Khu thể dục thể thao",
    "Công viên cây xanh",
    "Sân chơi trẻ em",
    "Shophouse tầng trệt",
    "Hầm để xe",
    "Phòng sinh hoạt cộng đồng",
    "An ninh 24/7",
    "Thang máy hiện đại",
    "Hệ thống PCCC tiêu chuẩn",
  ];
  landing.faqs = [
    {
      q: "Nhà ở xã hội Lý Thường Kiệt nằm ở đâu?",
      a: "Số 324 đường Lý Thường Kiệt, phường Diên Hồng, Quận 10, TP.HCM — đối diện Nhà thi đấu Phú Thọ và Bệnh viện Trưng Vương. Dự án còn được biết đến với tên thương mại Phú Thọ DMC.",
    },
    {
      q: "Phú Thọ DMC có phải nhà ở xã hội Lý Thường Kiệt không?",
      a: "Đúng. Phú Thọ DMC là tên thương mại của dự án Nhà ở xã hội Lý Thường Kiệt do Công ty Cổ phần Đức Mạnh (Đức Mạnh Group) phát triển tại 324 Lý Thường Kiệt, Quận 10.",
    },
    {
      q: "Giá nhà ở xã hội Lý Thường Kiệt bao nhiêu?",
      a: "Giá chính thức công bố cuối 6/2026: 23.251.398 đồng/m² (đã VAT, chưa gồm 2% phí bảo trì và hệ số điều chỉnh theo vị trí căn). Căn Studio ~34,5 m² tham chiếu khoảng 800 triệu; căn lớn ~77 m² khoảng 1,8 tỷ.",
    },
    {
      q: "Nhà ở xã hội Lý Thường Kiệt có những loại căn nào?",
      a: "Diện tích dao động 34,5–77 m²: căn Studio, 1 phòng ngủ và 2 phòng ngủ. Thiết kế ban công, thông tầng; bàn giao hoàn thiện cơ bản.",
    },
    {
      q: "Layout căn hộ nhà ở xã hội Lý Thường Kiệt như thế nào?",
      a: "Căn hộ Phú Thọ DMC được bố trí ban công thoáng, thông tầng tối ưu ánh sáng tự nhiên. Mặt bằng tầng điển hình và phân khu Studio/1PN/2PN được minh hoạ trên gallery trang dự án.",
    },
    {
      q: "Ai được mua nhà ở xã hội Lý Thường Kiệt?",
      a: "Người nộp hồ sơ phải đáp ứng tiêu chuẩn đối tượng thu nhập thấp, điều kiện nhà ở và cư trú theo Luật Nhà ở. Dự án đã thu hút hơn 12.000 hồ sơ đăng ký từ các đợt rà soát.",
    },
    {
      q: "Nhà ở xã hội Lý Thường Kiệt bàn giao khi nào?",
      a: "Công trình đang giai đoạn hoàn thiện cuối. Dự kiến nghiệm thu và bàn giao đưa vào sử dụng khoảng tháng 8/2026.",
    },
  ];
  landing.gallery = [...PHU_THO_DMC_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn điều kiện NOXH, layout căn hộ và tiến độ bàn giao — liên hệ HouseX.";
  return landing;
}

export function buildPhuThoDmcMock(): ProjectDetail {
  const landing = buildPhuThoDmcLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 1254,
    blocks: 4,
    landing,
  });

  return {
    id: "preview-phu-tho-dmc",
    developerId: "preview-duc-manh",
    slug: LTK_PROJECT_SLUG,
    name: LTK_PROJECT_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Quận 10",
    ward: "Diên Hồng",
    address: "324 Lý Thường Kiệt",
    lat: 10.7751,
    lng: 106.6593,
    totalArea: 1.47033,
    density: 36,
    handoverDate: new Date("2026-08-31"),
    overviewData,
    description:
      "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — NOXH 324 Lý Thường Kiệt, Quận 10 do Đức Mạnh Group phát triển. 4 block 25 tầng, 1.254 căn; giá ~23,25 tr/m²; Studio–2PN 34,5–77 m²; bàn giao dự kiến 08/2026.",
    seoTitle:
      "Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) Q10 — giá ~23,25 tr/m²",
    seoDesc:
      "Nhà ở xã hội Lý Thường Kiệt Quận 10 (Phú Thọ DMC): 755 căn bán, ~23,25 tr/m², Studio–2PN 34,5–77m². 324 Lý Thường Kiệt, bàn giao 08/2026.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-duc-manh",
      name: "Công ty Cổ phần Đức Mạnh (Đức Mạnh Group)",
      taxCode: "0321000001",
      verified: true,
      logoUrl: PHU_THO_DMC_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-ptdmc-studio",
        projectId: "preview-phu-tho-dmc",
        name: "Studio",
        areaMin: 34.5,
        areaMax: 40,
        bedrooms: 0,
        priceFrom: PRICE_STUDIO,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ptdmc-1pn",
        projectId: "preview-phu-tho-dmc",
        name: "Căn 1 phòng ngủ",
        areaMin: 40,
        areaMax: 55,
        bedrooms: 1,
        priceFrom: PRICE_1PN,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ptdmc-2pn",
        projectId: "preview-phu-tho-dmc",
        name: "Căn 2 phòng ngủ",
        areaMin: 55,
        areaMax: 77,
        bedrooms: 2,
        priceFrom: PRICE_2PN,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-ptdmc-ld-1",
        projectId: "preview-phu-tho-dmc",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2024-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ptdmc-ld-2",
        projectId: "preview-phu-tho-dmc",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2024-06-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildPhuThoDmcPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-ptdmc-l1",
      code: "MX-PTDMCPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: PRICE_1PN,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: PHU_THO_DMC_IMAGES.gallery[4].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildPhuThoDmcSeedLanding() {
  return buildPhuThoDmcLanding();
}
