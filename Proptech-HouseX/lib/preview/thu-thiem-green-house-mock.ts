import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { THU_THIEM_GREEN_HOUSE_IMAGES } from "@/lib/content/thu-thiem-green-house-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Giá tham chiếu CĐT (2026): 1,5 – 2,5 tỷ/căn tùy loại hình. */
const PRICE_MIN = 1_500_000_000;
const PRICE_MID = 2_000_000_000;
const PRICE_MAX = 2_500_000_000;

function buildGreenHouseLanding() {
  const landing = defaultProjectLanding("Thủ Thiêm Green House");
  landing.heroSubtitle =
    "NOXH mặt tiền Võ Chí Công — 1.040 căn, 3 block 8 tầng, 1–2PN 25–68 m², giá 1,5 – 2,5 tỷ/căn, chân cầu Phú Mỹ";
  landing.heroImage = { ...THU_THIEM_GREEN_HOUSE_IMAGES.hero };
  landing.locationMapImage = { ...THU_THIEM_GREEN_HOUSE_IMAGES.locationMap };
  landing.locationNotes = `Thủ Thiêm Green House tọa lạc mặt tiền đường Võ Chí Công, ngay chân cầu Phú Mỹ, phường Thạnh Mỹ Lợi, TP. Thủ Đức (trước Quận 2) — vị trí trung tâm kết nối Thủ Đức và Quận 7.

Kết nối vùng (theo website dự án):
• ~10 phút tới Bến Thành · ~13 km sân bay Tân Sơn Nhất
• ~5 phút trung tâm Quận 1 · ~20 phút bến xe Miền Tây
• Gần cầu Thủ Thiêm 2, Mai Chí Thọ, cao tốc Long Thành – Dầu Giày, dự án cầu Cát Lái

Tiện ích ngoại khu: Khu đô thị Thủ Thiêm, Phú Mỹ Hưng, EMART, trường học quốc tế, bệnh viện trong bán kính di chuyển hợp lý.

Dự án do Thủ Thiêm Group phát triển; tổng thầu Phước Thành Cons; thiết kế Green Design. Khởi công 10/2021, bàn giao dự kiến Q4/2024.`;
  landing.highlights = [
    {
      title: "1.040 căn NOXH — 3 block A, B, C",
      text: "Quy mô 20.875 m², 3 tòa cao 8 tầng; Block A 368 căn, Block B & C mỗi block 336 căn (theo thuthiemgreenhouses.vn).",
    },
    {
      title: "Giá 1,5 – 2,5 tỷ/căn",
      text: "Mức giá CĐT công bố hiện tại dao động 1,5 – 2,5 tỷ/căn tùy loại hình và vị trí; hỗ trợ vay ngân hàng tới 60% giá trị BĐS theo chính sách dự án.",
    },
    {
      title: "Mặt tiền Võ Chí Công — chân cầu Phú Mỹ",
      text: "Vị trí trục huyết mạng khu Đông; kết nối Thủ Đức – Quận 7 – trung tâm TP.HCM thuận tiện.",
    },
    {
      title: "Diện tích đa dạng 25–68 m²",
      text: "1PN 25–36,42 m² · 1PN+ 50,67–60,3 m² · 2PN 51,55–68,21 m² — phù hợp người thu nhập thấp và gia đình trẻ.",
    },
    {
      title: "Tiện ích nội khu đầy đủ",
      text: "Hồ bơi, quảng trường, hồ cảnh quan, sân thể thao, BBQ, vườn bốn mùa, khu vui chơi trẻ em, shophouse chân đế.",
    },
    {
      title: "CĐT Thủ Thiêm Group — 20 năm kinh nghiệm",
      text: "Công ty Cổ phần Thủ Thiêm; kinh nghiệm phát triển BĐS tại TP.HCM, đặc biệt khu vực Quận 2/Thủ Đức.",
    },
  ];
  landing.amenities = [
    "Hồ bơi",
    "Quảng trường & hồ cảnh quan",
    "Công viên cây xanh 4.175 m²",
    "Sân thể thao đa năng",
    "Sân bóng rổ & cầu lông",
    "Khu BBQ ngoài trời",
    "Khu vui chơi trẻ em",
    "Vườn dạo thú cưng",
    "Quảng trường nước",
    "Shophouse chân đế",
    "Khu tập thể hình ngoài trời",
    "An ninh 24/7",
  ];
  landing.faqs = [
    {
      q: "Thủ Thiêm Green House nằm ở đâu?",
      a: "Mặt tiền đường Võ Chí Công, ngay chân cầu Phú Mỹ, phường Thạnh Mỹ Lợi, TP. Thủ Đức (trước Quận 2).",
    },
    {
      q: "Chủ đầu tư Thủ Thiêm Green House là ai?",
      a: "Công ty Cổ phần Thủ Thiêm (Thủ Thiêm Group) — tổng thầu thi công Phước Thành Cons; thiết kế Green Design (theo website dự án).",
    },
    {
      q: "Giá Thủ Thiêm Green House bao nhiêu?",
      a: "Theo thông tin CĐT hiện tại, giá căn hộ dao động khoảng 1,5 – 2,5 tỷ/căn tùy loại hình (1PN, 1PN+, 2PN) và vị trí. Liên hệ tư vấn để nhận bảng giá chi tiết mới nhất.",
    },
    {
      q: "Ai được mua nhà ở xã hội Thủ Thiêm Green House?",
      a: "Người thu nhập thấp, hộ nghèo/cận nghèo tại đô thị; công nhân KCN; CBCCVC; người có công; và các nhóm đối tượng NOXH theo Luật Nhà ở (theo website dự án).",
    },
    {
      q: "Thủ Thiêm Green House bàn giao khi nào?",
      a: "Khởi công 10/2021; bàn giao dự kiến Quý IV/2024 theo thông tin website. Liên hệ tư vấn để cập nhật tiến độ hiện tại.",
    },
    {
      q: "Có những loại căn nào?",
      a: "1PN 25–36,42 m²; 1PN+ 50,67–60,3 m²; 2PN 51,55–68,21 m²; shophouse chân đế 55–88 m² (theo mặt bằng website).",
    },
  ];
  landing.gallery = [...THU_THIEM_GREEN_HOUSE_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildThuThiemGreenHouseMock(): ProjectDetail {
  const landing = buildGreenHouseLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 1040,
    blocks: 3,
    landing,
  });

  return {
    id: "preview-thu-thiem-green-house",
    developerId: "preview-thu-thiem-group",
    slug: "thu-thiem-green-house-thu-duc",
    name: "Thủ Thiêm Green House",
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Thạnh Mỹ Lợi",
    address: "Mặt tiền Võ Chí Công, chân cầu Phú Mỹ",
    lat: 10.757,
    lng: 106.751,
    totalArea: 2.0875,
    density: 60,
    handoverDate: new Date("2024-12-31"),
    overviewData,
    description:
      "Thủ Thiêm Green House là dự án nhà ở xã hội do Công ty Cổ phần Thủ Thiêm (Thủ Thiêm Group) phát triển tại mặt tiền Võ Chí Công, phường Thạnh Mỹ Lợi, TP. Thủ Đức. Quy mô 20.875 m², 3 block 8 tầng, 1.040 căn; diện tích 25–68 m²; giá 1,5 – 2,5 tỷ/căn. Tổng thầu Phước Thành Cons.",
    seoTitle: "Thủ Thiêm Green House — NOXH Võ Chí Công từ 1,5 tỷ",
    seoDesc:
      "NOXH Thủ Thiêm Green House Thủ Đức: 1.040 căn, 1–2PN 25–68m², giá 1,5–2,5 tỷ/căn. Võ Chí Công chân cầu Phú Mỹ.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-thu-thiem-group",
      name: "Công ty Cổ phần Thủ Thiêm (Thủ Thiêm Group)",
      taxCode: "0320000001",
      verified: true,
      logoUrl: THU_THIEM_GREEN_HOUSE_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-ttgh-1pn",
        projectId: "preview-thu-thiem-green-house",
        name: "Căn 1PN",
        areaMin: 25,
        areaMax: 36.42,
        bedrooms: 1,
        priceFrom: PRICE_MIN,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ttgh-1pn-plus",
        projectId: "preview-thu-thiem-green-house",
        name: "Căn 1PN+",
        areaMin: 50.67,
        areaMax: 60.3,
        bedrooms: 1,
        priceFrom: PRICE_MID,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ttgh-2pn",
        projectId: "preview-thu-thiem-green-house",
        name: "Căn 2PN",
        areaMin: 51.55,
        areaMax: 68.21,
        bedrooms: 2,
        priceFrom: PRICE_MAX,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-ttgh-ld-1",
        projectId: "preview-thu-thiem-green-house",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2021-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ttgh-ld-2",
        projectId: "preview-thu-thiem-green-house",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2021-10-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildThuThiemGreenHousePreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-ttgh-l1",
      code: "MX-TTGHPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: PRICE_MID,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: THU_THIEM_GREEN_HOUSE_IMAGES.gallery[1].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildThuThiemGreenHouseSeedLanding() {
  return buildGreenHouseLanding();
}
