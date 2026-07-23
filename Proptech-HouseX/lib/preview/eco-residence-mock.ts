import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { ECO_RESIDENCE_PUBLISHED_IMAGES } from "@/lib/content/eco-residence-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Giá tham chiếu 24 triệu/m² (website công bố 24–25 triệu/m²). */
const PRICE_PER_SQM = 24_000_000;

function buildEcoLanding() {
  const landing = defaultProjectLanding("Eco Residence");
  landing.heroSubtitle =
    "Nhà ở xã hội Long Bình Tân — 1.098 căn, 3 block 20 tầng, tiêu chuẩn EDGE xanh, giá từ 24 triệu/m², bàn giao Q4/2026";
  landing.heroImage = { ...ECO_RESIDENCE_PUBLISHED_IMAGES.hero };
  landing.locationMapImage = { ...ECO_RESIDENCE_PUBLISHED_IMAGES.locationMap };
  landing.locationNotes = `Eco Residence (tên thương mại của Nhà ở xã hội Long Bình Tân) tọa lạc tại 52 Nguyễn Văn Tỏ, phường Long Hưng, TP. Biên Hòa, Đồng Nai — cửa ngõ phía đông TP.HCM, thuộc vùng kinh tế trọng điểm phía Nam.

Kết nối & tiện ích ngoại khu (theo website dự án):
• Trường Cao đẳng Công nghệ và Quản trị Sonadezi
• Khu công nghiệp Biên Hòa 2
• Big C Biên Hòa và hệ thống hạ tầng điện — đường — trường — trạm đồng bộ

Phù hợp công nhân, người lao động KCN và các nhóm đối tượng NOXH theo Luật Nhà ở số 27/2023/QH15.`;
  landing.highlights = [
    {
      title: "NOXH đúng chính sách — sổ hồng lâu dài",
      text: "1.098 căn hộ nhà ở xã hội, 100% chung cư; pháp lý sở hữu lâu dài theo thông tin CĐT. Nhận hồ sơ từ 10/11/2025.",
    },
    {
      title: "Giá từ 24 triệu/m² — vay tới 70%",
      text: "Đơn giá tham chiếu 24–25 triệu/m²; trả trước 30% (khoảng 300–500 triệu), vay 70% với lãi suất ưu đãi 5,4–5,9%/năm, tối đa 25 năm.",
    },
    {
      title: "Tiêu chuẩn EDGE — công trình xanh",
      text: "Thiết kế theo tiêu chuẩn EDGE, kiến trúc xanh bền vững; hướng tới môi trường sống hiện đại, tiết kiệm năng lượng.",
    },
    {
      title: "3 block cao 20 tầng + hầm 9.500 m²",
      text: "Quy mô 1,4 ha; 03 block 20 tầng và 01 tầng hầm rộng 9.500 m²; khởi công 05/2024, bàn giao dự kiến Q4/2026.",
    },
    {
      title: "Tiện ích nội khu đầy đủ",
      text: "Hồ bơi, TTTM, trường học, công viên, khu thể thao giải trí, vườn cảnh quan — chăm sóc tỉ mỉ cho cộng đồng cư dân.",
    },
    {
      title: "Ngân hàng liên kết NOXH",
      text: "MB Bank, Ngân hàng CSXH Đồng Nai và BIDV hỗ trợ tài chính với lãi suất ưu đãi dành riêng cho nhà ở xã hội.",
    },
  ];
  landing.amenities = [
    "Hồ bơi",
    "Trung tâm thương mại",
    "Trường học nội khu",
    "Công viên cảnh quan",
    "Khu thể thao giải trí",
    "Vườn cảnh quan",
    "Tiện ích tầng 1 & 2",
    "Hầm đậu xe 9.500 m²",
    "An ninh 24/7",
    "Hệ thống PCCC",
    "Khu vui chơi trẻ em",
    "Shophouse & dịch vụ",
  ];
  landing.faqs = [
    {
      q: "Eco Residence có phải nhà ở xã hội không?",
      a: "Đúng. Eco Residence là tên thương mại của dự án Nhà ở xã hội Long Bình Tân do Công ty Cổ phần Chương Dương Homeland làm chủ đầu tư, HPD GROUP triển khai phân phối.",
    },
    {
      q: "Ai được mua Eco Residence?",
      a: "Người thuộc 12 nhóm đối tượng NOXH theo Luật Nhà ở 27/2023/QH15 (công nhân KCN, người thu nhập thấp, CBCCVC, hộ nghèo/cận nghèo…). Điều kiện thu nhập: độc thân ≤20 triệu/tháng; có con dưới thành niên ≤30 triệu; vợ chồng ≤40 triệu/tháng (12 tháng liền kề).",
    },
    {
      q: "Điều kiện về nhà ở khi mua Eco Residence?",
      a: "Không sở hữu nhà, đất tại Đồng Nai; chưa mua/thuê/thuê mua NOXH hoặc hưởng hỗ trợ nhà đất tại nơi sinh sống; hoặc đã có nhà nhưng diện tích bình quân dưới 15 m²/người.",
    },
    {
      q: "Giá Eco Residence bao nhiêu?",
      a: "Website công bố giá tham chiếu 24–25 triệu/m². Trả trước 30% (khoảng 300–500 triệu), vay 70% với lãi suất ưu đãi 5,4–5,9%/năm. Liên hệ tư vấn để nhận bảng giá theo loại căn.",
    },
    {
      q: "Eco Residence bàn giao khi nào?",
      a: "Khởi công 05/2024; tiến độ thi công đến sàn tầng 6 (12/2025). Bàn giao dự kiến Quý 04/2026 theo thông tin website.",
    },
    {
      q: "Pháp lý Eco Residence thế nào?",
      a: "Theo website: sổ hồng sở hữu lâu dài; CĐT đang hoàn tất các thủ tục pháp lý liên quan. Liên hệ tư vấn để cập nhật hồ sơ mới nhất.",
    },
  ];
  landing.gallery = [...ECO_RESIDENCE_PUBLISHED_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildEcoResidenceMock(): ProjectDetail {
  const landing = buildEcoLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 1098,
    blocks: 3,
    landing,
  });

  return {
    id: "preview-eco-residence",
    developerId: "preview-chuong-duong-homeland",
    slug: "eco-residence-long-binh-tan",
    name: "Eco Residence — Nhà Ở Xã Hội Long Bình Tân",
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Đồng Nai",
    district: "Biên Hòa",
    ward: "Long Hưng",
    address: "52 Nguyễn Văn Tỏ, phường Long Hưng",
    lat: 10.927,
    lng: 106.879,
    totalArea: 1.4,
    density: null,
    handoverDate: new Date("2026-12-31"),
    overviewData,
    description:
      "Eco Residence là tên thương mại của dự án Nhà ở xã hội Long Bình Tân do Công ty Cổ phần Chương Dương Homeland phát triển tại 52 Nguyễn Văn Tỏ, phường Long Hưng, TP. Biên Hòa, Đồng Nai. Quy mô 1,4 ha, 3 block 20 tầng, 1.098 căn; tiêu chuẩn EDGE xanh; giá 24–25 triệu/m²; hỗ trợ vay 70% qua MB Bank, CSXH Đồng Nai, BIDV. Bàn giao dự kiến Q4/2026.",
    seoTitle: "Eco Residence — NOXH Long Bình Tân từ 24 triệu/m²",
    seoDesc:
      "Nhà ở xã hội Eco Residence Biên Hòa: 1.098 căn, 3 block 20 tầng, EDGE xanh, giá 24–25 triệu/m². Vay 70%, bàn giao Q4/2026.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-chuong-duong-homeland",
      name: "Công ty Cổ phần Chương Dương Homeland",
      taxCode: "0317000001",
      verified: true,
      logoUrl: ECO_RESIDENCE_PUBLISHED_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-eco-2pn-s",
        projectId: "preview-eco-residence",
        name: "Căn 2PN (~45 m²)",
        areaMin: 43,
        areaMax: 47,
        bedrooms: 2,
        priceFrom: Math.round(45 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-eco-2pn-l",
        projectId: "preview-eco-residence",
        name: "Căn 2PN (~55 m²)",
        areaMin: 52,
        areaMax: 58,
        bedrooms: 2,
        priceFrom: Math.round(55 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-eco-3pn",
        projectId: "preview-eco-residence",
        name: "Căn 3PN (~65 m²)",
        areaMin: 62,
        areaMax: 68,
        bedrooms: 3,
        priceFrom: Math.round(65 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-eco-ld-1",
        projectId: "preview-eco-residence",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2024-05-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-eco-ld-2",
        projectId: "preview-eco-residence",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2024-05-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildEcoPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-eco-l1",
      code: "MX-ECOPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(45 * PRICE_PER_SQM),
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: ECO_RESIDENCE_PUBLISHED_IMAGES.gallery[0].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildEcoSeedLanding() {
  return buildEcoLanding();
}
