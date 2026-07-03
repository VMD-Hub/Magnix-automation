import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { SOLENA_GREEN_TOWN_SLUG } from "@/lib/content/solena-green-town-slug";
import { SOLENA_PUBLISHED_IMAGES } from "@/lib/content/solena-images";

export { SOLENA_GREEN_TOWN_SLUG };

const NOW = new Date("2026-06-29T00:00:00.000Z");

function buildSolenaLanding() {
  const landing = defaultProjectLanding("Solena Green Town Bình Tân");
  landing.heroSubtitle =
    "Booking chỉ từ 50 triệu · Chiết khấu sớm đến 11% · Block B2 — 252 căn, 16 tầng, giá từ 53,9 triệu/m², bàn giao dự kiến Q4/2026";
  landing.heroImage = { ...SOLENA_PUBLISHED_IMAGES.hero };
  landing.locationMapImage = { ...SOLENA_PUBLISHED_IMAGES.locationMap };
  landing.locationNotes = `Phân khu Solena (Block B2 thuộc Green Town Bình Tân) tọa lạc Lô 5, Khu dân cư đô thị Vĩnh Lộc 110ha, phường Bình Hưng Hòa B, Quận Bình Tân, TP.HCM — giao điểm Nguyễn Thị Tú, Lê Trọng Tấn và Quốc lộ 1A.

Kết nối giao thông:
• Trục Cộng Hòa – Trường Chinh và Nguyễn Thị Tú – Quang Trung vào trung tâm
• Đại lộ Đông Tây – Võ Văn Kiệt, đường Âu Cơ
• KCN Vĩnh Lộc, KCN Tân Bình, KCN Tân Tạo trong bán kính ~10 phút

Tiện ích ngoại khu (tham khảo website dự án):
• ~3 phút: trường mầm non, tiểu học quốc tế GIS, THCS Huỳnh Văn Nghệ, THPT Vĩnh Lộc
• ~5 phút: AEON Mall Tân Phú
• ~10 phút: KCN Vĩnh Lộc, KCN Tân Bình, KCN Tân Tạo
• ~20 phút: sân bay Tân Sơn Nhất, Metro Tham Lương, Big C GO Trường Chinh`;
  landing.highlights = [
    {
      title: "Vị trí KDC Vĩnh Lộc — khu Tây Sài Gòn",
      text: "Block B2 nằm tại Lô 5, KDC Vĩnh Lộc 110ha, nút giao Nguyễn Thị Tú – Lê Trọng Tấn – QL1A, thuận tiện an cư và kết nối KCN.",
    },
    {
      title: "Giá từ 53,9 triệu/m²",
      text: "Đơn giá tham chiếu công bố; căn 2PN từ ~2,64 tỷ, 3PN ~4,94 tỷ (chưa VAT, tùy tầng/view). Liên hệ tư vấn để nhận bảng giá block đang mở.",
    },
    {
      title: "252 căn — 16 tầng, mật độ 27,5%",
      text: "Quy mô phân khu gọn, mật độ xây dựng 27,5% trên 3,3ha; thiết kế tối ưu đón sáng gió tự nhiên.",
    },
    {
      title: "Tiện ích nội khu đa lớp",
      text: "Công viên sinh thái, khu thể thao (tennis, cầu lông, bóng đá), shophouse, giáo dục & y tế nội khu, an ninh 24/7.",
    },
    {
      title: "Bàn giao nội thất cơ bản cao cấp",
      text: "Sàn gỗ phòng ngủ, cửa thép chống cháy, trần thạch cao, thiết bị vệ sinh — thương hiệu Caser, Expo, Koler (theo CĐT).",
    },
    {
      title: "Chính sách thanh toán linh hoạt",
      text: "Theo website: 30% ký HĐMB · 20% cất nóc · 45% bàn giao; hoặc 50% đến nhận nhà; hỗ trợ vay tới 70% và HTLS đến Q1/2029 — xác nhận chi tiết khi tư vấn.",
    },
    {
      title: "Đơn vị thi công SaiGon Cons",
      text: "CTXD SaiGon Cons thi công Block B2 — đối tác xây dựng có kinh nghiệm tại TP.HCM, đảm bảo tiến độ và chất lượng công trình.",
    },
  ];
  landing.amenities = [
    "Công viên cây xanh sinh thái",
    "Sân tennis",
    "Sân cầu lông",
    "Sân bóng đá",
    "Shophouse & TTTM khối đế",
    "Trường học nội khu",
    "Phòng khám nội khu",
    "An ninh 24/7",
    "AEON Mall Tân Phú (~5 phút)",
    "Big C GO Trường Chinh",
    "Hệ thống trường quốc tế GIS",
  ];
  landing.faqs = [
    {
      q: "Solena Green Town nằm ở đâu?",
      a: "Phân khu Solena (Block B2) tại Lô 5, KDC Vĩnh Lộc 110ha, phường Bình Hưng Hòa B, Quận Bình Tân, TP.HCM — giao Nguyễn Thị Tú, Lê Trọng Tấn và Quốc lộ 1A.",
    },
    {
      q: "Giá bán Solena Green Town bao nhiêu?",
      a: "Đơn giá tham chiếu 53,9 triệu/m² (website công bố). Căn 2PN 49m² từ ~2,64 tỷ; 3PN 91,74m² ~4,94 tỷ — chưa VAT, biến động theo tầng và view. Liên hệ tư vấn để nhận bảng giá mới nhất.",
    },
    {
      q: "Solena có những loại hình căn hộ nào?",
      a: "2 phòng ngủ (49–71,89 m², 1–2 WC) và 3 phòng ngủ (91,74–92 m², 2 WC) — xem bảng loại hình trên trang dự án.",
    },
    {
      q: "Tiến độ bàn giao Solena Green Town?",
      a: "Block B2 dự kiến bàn giao Quý 4/2026 theo thông tin công bố trên website dự án.",
    },
    {
      q: "Pháp lý Solena Green Town thế nào?",
      a: "Website CĐT ghi đã có quy hoạch 1/500 và Giấy phép xây dựng số 55/QD-SXD-TDDA do Sở Xây dựng TP.HCM cấp. Chi tiết hồ sơ — liên hệ tư vấn để xác minh trước giao dịch.",
    },
    {
      q: "Booking Solena Green Town bao nhiêu?",
      a: "Theo website dự án: booking chỉ từ 50 triệu đồng; chiết khấu sớm lên đến 11% tùy thời điểm ký HĐMB. Liên hệ tư vấn để nhận chính sách áp dụng hiện tại.",
    },
    {
      q: "Chính sách thanh toán Solena ra sao?",
      a: "Theo website: 30% ký HĐMB · 20% cất nóc · 45% bàn giao; hoặc 50% đến nhận nhà tùy đợt; hỗ trợ vay tới 70% và HTLS đến Q1/2029. Liên hệ tư vấn để nhận bảng chính sách áp dụng hiện tại.",
    },
  ];
  landing.gallery = [...SOLENA_PUBLISHED_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

/** Mock / seed Solena — nội dung tham khảo solena.com.vn (admin xác minh trước publish). */
export function buildSolenaGreenTownMock(): ProjectDetail {
  const landing = buildSolenaLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 252,
    blocks: 1,
    landing,
  });

  return {
    id: "preview-solena-green-town",
    developerId: "preview-ide-dev",
    slug: SOLENA_GREEN_TOWN_SLUG,
    name: "Solena Green Town Bình Tân",
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Bình Tân",
    ward: "Bình Hưng Hòa B",
    address: "Lô 5, Khu dân cư đô thị Vĩnh Lộc (110ha)",
    lat: 10.8235,
    lng: 106.5892,
    totalArea: 3.3,
    density: 27.5,
    handoverDate: new Date("2026-12-31"),
    overviewData,
    description:
      "Solena là phân khu Block B2 thuộc dự án Green Town Bình Tân do Tập đoàn IDE Việt Nam phát triển tại KDC Vĩnh Lộc, Quận Bình Tân. Quy mô 252 căn hộ cao 16 tầng trên 3,3ha, mật độ xây dựng 27,5%. Sản phẩm 2–3 phòng ngủ (49–92 m²), đơn giá tham chiếu 53,9 triệu/m², bàn giao nội thất cơ bản cao cấp. Bàn giao dự kiến Q4/2026.",
    seoTitle: "Solena Green Town Bình Tân — Căn hộ từ 53,9 triệu/m²",
    seoDesc:
      "Solena Block B2 Green Town Bình Tân: 252 căn, 16 tầng, 2–3PN 49–92m², giá 53,9 triệu/m². KDC Vĩnh Lộc, IDE Việt Nam. Bàn giao Q4/2026.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-ide-dev",
      name: "Tập đoàn IDE Việt Nam",
      taxCode: "0315000001",
      verified: true,
      logoUrl: SOLENA_PUBLISHED_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-sol-2pn1",
        projectId: "preview-solena-green-town",
        name: "2PN — 1 WC (49m²)",
        areaMin: 49,
        areaMax: 52.7,
        bedrooms: 2,
        priceFrom: 2_640_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-sol-2pn2",
        projectId: "preview-solena-green-town",
        name: "2PN — 2 WC (63–71,89m²)",
        areaMin: 63,
        areaMax: 71.89,
        bedrooms: 2,
        priceFrom: 3_390_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-sol-3pn",
        projectId: "preview-solena-green-town",
        name: "3PN — 2 WC (91,74m²)",
        areaMin: 91.74,
        areaMax: 92,
        bedrooms: 3,
        priceFrom: 4_940_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-sol-ld1",
        projectId: "preview-solena-green-town",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-sol-ld2",
        projectId: "preview-solena-green-town",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildSolenaPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-sol-listing-1",
      code: "MX-SOLPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 2_790_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: SOLENA_PUBLISHED_IMAGES.gallery[3].url }],
    },
    {
      id: "preview-sol-listing-2",
      code: "MX-SOLPRE02",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 3_660_000_000,
      tier: "FREE",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: SOLENA_PUBLISHED_IMAGES.gallery[1].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildSolenaSeedLanding() {
  return buildSolenaLanding();
}
