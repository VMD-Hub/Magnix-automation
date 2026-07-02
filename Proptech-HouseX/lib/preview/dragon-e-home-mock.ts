import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { DRAGON_E_HOME_PUBLISHED_IMAGES } from "@/lib/content/dragon-e-home-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/**
 * Giá tham chiếu dự kiến ~30 triệu/m² (nguồn thứ cấp 2026).
 * Website CĐT chưa công bố bảng giá công khai — liên hệ Phú Long để cập nhật chính sách.
 */
const PRICE_PER_SQM_REF = 30_000_000;

function buildDragonLanding() {
  const landing = defaultProjectLanding("Dragon E-Home");
  landing.heroSubtitle =
    "NOXH thế hệ mới tại Dragon Village — 764 căn, 6 tòa 8 tầng, studio–69 m², thiết kế Surbana Jurong · Nguyễn Thị Tư, Long Trường";
  landing.heroImage = { ...DRAGON_E_HOME_PUBLISHED_IMAGES.hero };
  landing.locationMapImage = { ...DRAGON_E_HOME_PUBLISHED_IMAGES.locationMap };
  landing.locationNotes = `Dragon E-Home tọa lạc tại đường Nguyễn Thị Tư (đường 990), phường Long Trường, TP. Thủ Đức (trước đây phường Phú Hữu), thuộc Khu đô thị Dragon Village 21 ha do Công ty Cổ phần Địa ốc Phú Long phát triển.

Kết nối giao thông (theo website CĐT):
• Metro số 1 (Bến Thành – Suối Tiên) — ga Khu CNC gần khu vực
• Cao tốc TP.HCM – Long Thành – Dầu Giày
• Vành đai 3, Nguyễn Duy Trinh, Võ Chí Công, Song Hành, Xa Lộ Hà Nội

Tiện ích ngoại khu: Khu CNC TP.HCM, Samsung/Intel, ĐH Fulbright, Suối Tiên; thừa hưởng tiện ích Dragon Village (TTTM, clubhouse, trường học, hồ bơi, thể thao).

Dự án khởi công 22/06/2026 theo báo chí nhà nước — nhà ở xã hội thế hệ mới hướng tới người lao động khu Đông TP.HCM.`;
  landing.highlights = [
    {
      title: "NOXH thế hệ mới — 764 căn hộ",
      text: "Quy mô 18.920,99 m² trong Dragon Village; 6 tòa C1–C5, mỗi tòa 8 tầng; 764 căn NOXH + 34 căn thương mại dịch vụ (theo phulong.com).",
    },
    {
      title: "Thiết kế Surbana Jurong & Ong & Ong",
      text: "Đối tác quy hoạch, kiến trúc và cảnh quan quốc tế; tổng đại lý Smile Living — chuẩn sống hiện đại cho NOXH thế hệ mới.",
    },
    {
      title: "Đa dạng loại hình 25–69 m²",
      text: "Studio 25 m², 1PN 41 m², 1PN+ 47 m², 2PN/2PN+/Dual Key 69 m² — tối ưu cho người trẻ, gia đình nhỏ và công nhân KCN.",
    },
    {
      title: "Vị trí Nguyễn Thị Tư — khu Đông TP.HCM",
      text: "Trong Dragon Village, phường Long Trường (trước Phú Hữu); gần CNC, metro, cao tốc Long Thành — thuận tiện an cư và làm việc.",
    },
    {
      title: "3 lớp tiện ích nội – ngoại – Dragon Village",
      text: "Hồ bơi, công viên ven sông, TMDV tầng 1, nhà trẻ; kết nối clubhouse, thư viện, thể thao, trường học trong tổng khu 21 ha.",
    },
    {
      title: "CĐT Phú Long — thuộc hệ sinh thái Sovico",
      text: "Hơn 16 năm phát triển BĐS; Dragon Village, Dragon Hill, Kim Long, Ngân Long — uy tín triển khai NOXH tại TP.HCM.",
    },
  ];
  landing.amenities = [
    "Hồ bơi nội khu",
    "Công viên ven sông",
    "Công viên nội khu & lối dạo bộ",
    "Khu thương mại dịch vụ tầng 1",
    "Nhà trẻ",
    "Khu vui chơi trẻ em",
    "Chòi nghỉ chân",
    "Clubhouse Dragon Village",
    "Trung tâm thể thao",
    "Thư viện & khu yoga",
    "Trường mẫu giáo & tiểu học (Dragon Village)",
    "Bãi đậu xe",
  ];
  landing.faqs = [
    {
      q: "Dragon E-Home nằm ở đâu?",
      a: "Tại đường Nguyễn Thị Tư (đường 990), phường Long Trường, TP. Thủ Đức — trong Khu đô thị Dragon Village. Trước sáp nhập phường thuộc Phú Hữu, Quận 9.",
    },
    {
      q: "Chủ đầu tư Dragon E-Home là ai?",
      a: "Công ty Cổ phần Địa ốc Phú Long — thành viên hệ sinh thái Sovico Holdings. Website chính thức: phulong.com/du-an/dragon-e-home.",
    },
    {
      q: "Dragon E-Home có những loại căn nào?",
      a: "Theo website CĐT: Studio 25 m²; 1PN 41 m²; 1PN+ 47 m²; 2PN, 2PN+ và Dual Key 69 m². Tầng 1 một số tòa có TMDV 47–104 m².",
    },
    {
      q: "Giá bán Dragon E-Home bao nhiêu?",
      a: "Phú Long công bố chính sách bán hàng qua hotline 19001899 và các sàn giao dịch — chưa niêm yết giá công khai trên website. Liên hệ tư vấn HouseX để được hướng dẫn đăng ký và cập nhật bảng giá mới nhất.",
    },
    {
      q: "Ai được mua nhà ở xã hội Dragon E-Home?",
      a: "Người thuộc các nhóm đối tượng NOXH theo Luật Nhà ở 27/2023/QH15 (công nhân KCN, người thu nhập thấp tại đô thị, CBCCVC…). Cần xác nhận thu nhập và tình trạng nhà ở theo quy định hiện hành.",
    },
    {
      q: "Tiến độ Dragon E-Home?",
      a: "Lễ khởi công 22/06/2026 (Tuổi Trẻ/UBND TP.HCM). Dự án đang triển khai xây dựng — liên hệ CĐT để biết lịch mở bán, nộp hồ sơ và bàn giao dự kiến.",
    },
  ];
  landing.gallery = [...DRAGON_E_HOME_PUBLISHED_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildDragonEHomeMock(): ProjectDetail {
  const landing = buildDragonLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 764,
    blocks: 6,
    landing,
  });

  return {
    id: "preview-dragon-e-home",
    developerId: "preview-phu-long",
    slug: "dragon-e-home-phu-huu",
    name: "Dragon E-Home",
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Long Trường",
    address: "Nguyễn Thị Tư (đường 990), KĐT Dragon Village",
    lat: 10.803,
    lng: 106.789,
    totalArea: 1.892,
    density: 40,
    handoverDate: new Date("2027-03-31"),
    overviewData,
    description:
      "Dragon E-Home là khu nhà ở xã hội thế hệ mới do Công ty Cổ phần Địa ốc Phú Long phát triển tại Nguyễn Thị Tư, phường Long Trường, TP. Thủ Đức, trong Khu đô thị Dragon Village 21 ha. Quy mô 18.920,99 m², 6 tòa 8 tầng, 764 căn hộ (25–69 m²) và 34 căn TMDV. Thiết kế bởi Surbana Jurong, Ong & Ong. Khởi công 06/2026.",
    seoTitle: "Dragon E-Home — NOXH thế hệ mới Dragon Village, Thủ Đức",
    seoDesc:
      "Nhà ở xã hội Dragon E-Home Phú Long: 764 căn, studio–69m², Nguyễn Thị Tư Long Trường. NOXH thế hệ mới khu Đông TP.HCM.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-phu-long",
      name: "Công ty Cổ phần Địa ốc Phú Long",
      taxCode: "0319000001",
      verified: true,
      logoUrl: DRAGON_E_HOME_PUBLISHED_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-deh-studio",
        projectId: "preview-dragon-e-home",
        name: "Studio",
        areaMin: 25,
        areaMax: 25,
        bedrooms: 0,
        priceFrom: Math.round(25 * PRICE_PER_SQM_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-deh-1pn",
        projectId: "preview-dragon-e-home",
        name: "1 phòng ngủ",
        areaMin: 41,
        areaMax: 47,
        bedrooms: 1,
        priceFrom: Math.round(41 * PRICE_PER_SQM_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-deh-2pn",
        projectId: "preview-dragon-e-home",
        name: "2 phòng ngủ / Dual Key",
        areaMin: 69,
        areaMax: 69,
        bedrooms: 2,
        priceFrom: Math.round(69 * PRICE_PER_SQM_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-deh-ld-1",
        projectId: "preview-dragon-e-home",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2025-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-deh-ld-2",
        projectId: "preview-dragon-e-home",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2026-06-22"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildDragonEHomePreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-deh-l1",
      code: "MX-DEHPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(41 * PRICE_PER_SQM_REF),
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: DRAGON_E_HOME_PUBLISHED_IMAGES.gallery[0].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildDragonEHomeSeedLanding() {
  return buildDragonLanding();
}
