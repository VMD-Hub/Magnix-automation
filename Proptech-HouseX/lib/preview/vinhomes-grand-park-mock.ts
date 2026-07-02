import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { VINHOMES_GRAND_PARK_IMAGES } from "@/lib/content/vinhomes-grand-park-images";

const NOW = new Date("2026-06-15T00:00:00.000Z");

/** Giá tham chiếu The Rainbow theo vinhomesland.vn: từ ~900 triệu/căn (30–40 tr/m²). */
const PRICE_FROM = 900_000_000;

export const VINHOMES_GRAND_PARK_NAME = "Vinhomes Grand Park";
export const VINHOMES_GRAND_PARK_SLUG = "vinhomes-grand-park-quan-9";

function buildVinhomesGrandParkLanding() {
  const landing = defaultProjectLanding(VINHOMES_GRAND_PARK_NAME);
  landing.heroSubtitle =
    "Vinhomes · 271,8 ha đại đô thị thông minh Quận 9 — 71 tòa căn hộ, công viên 36 ha, Vincom Mega Mall & Vinmec; căn hộ từ ~900 triệu, sổ đỏ lâu dài";
  landing.heroImage = { ...VINHOMES_GRAND_PARK_IMAGES.hero };
  landing.locationMapImage = { ...VINHOMES_GRAND_PARK_IMAGES.locationMap };
  landing.locationNotes = `Vinhomes Grand Park tọa lạc trên đường Nguyễn Xiển, phường Long Thạnh Mỹ, TP. Thủ Đức (Quận 9 cũ), TP.HCM — “tọa độ vàng” ôm trọn sông Đồng Nai và sông Tắc, thừa hưởng không gian xanh rộng mở.

Kết nối giao thông:
• Vành đai 3, Xa Lộ Hà Nội — vào trung tâm TP.HCM thuận tiện
• Cao tốc Long Thành – Dầu Giày → Bình Dương, Đồng Nai, Vũng Tàu
• Metro Bến Thành – Suối Tiên (Suối Tiên gần khu vực) — lợi thế di chuyển công cộng
• Gần khu công nghệ cao, khu đô thị mới phía Đông TP.HCM

Vị thế nội khu:
• 6 phân khu căn hộ cao tầng dọc Vành đai 3: The Rainbow, The Origami, The Beverly, The Beverly Solari, Masteri Centre Point, Lumiere Boulevard
• 3 phân khu thấp tầng: The Manhattan, The Manhattan Glory, The Rivus Elie Saab
• Trung tâm đại công viên ven sông 36 ha — cảm hứng Gardens by the Bay (Singapore)`;
  landing.highlights = [
    {
      title: "271,8 ha — đại đô thị thông minh đầu tiên TP.HCM",
      text: "Mật độ xây dựng 22,53%; 71 tòa căn hộ và ~1.600 căn thấp tầng. Hệ sinh thái smart city 4 trục: vận hành – an ninh – cộng đồng – căn hộ thông minh.",
    },
    {
      title: "Công viên ven sông 36 ha — 15 công viên chủ đề",
      text: "Lớn nhất Việt Nam theo quy hoạch dự án; công viên ánh sáng (supertree grove), golf mini, gym, aerobic, BBQ, bãi cát trắng — phong cách resort tại gia.",
    },
    {
      title: "6 phân khu căn hộ — từ phổ thông đến cao cấp",
      text: "The Rainbow (900 triệu+), The Origami, The Beverly, The Beverly Solari, Masteri Centre Point, Lumiere Boulevard. Studio–3PN+1, diện tích 27–120 m².",
    },
    {
      title: "Tiện ích quốc tế: Vincom Mega Mall & Vinmec",
      text: "Vincom Mega Mall ~48.000 m² sàn — lớn nhất TP.HCM; Vinmec ~36.000 m²; Vinschool liên cấp quốc tế; hàng chục hồ bơi resort, sân thể thao đa dạng.",
    },
    {
      title: "Thấp tầng thượng lưu — Manhattan & Rivus Elie Saab",
      text: "~1.600 căn biệt thự, shophouse, boutique villa phong cách Địa Trung Hải, Đông Dương; The Rivus Elie Saab 118 dinh thự ven sông do Masterise phát triển.",
    },
    {
      title: "Sổ đỏ lâu dài — dự án đã bàn giao nhiều phân khu",
      text: "The Rainbow (2020), The Origami (2021), The Manhattan (2021) đã vận hành ổn định; The Beverly, Masteri, Lumiere bàn giao 2023–2024 — cộng đồng cư dân đông đúc.",
    },
  ];
  landing.amenities = [
    "Đại công viên ven sông 36 ha",
    "Vincom Mega Mall 48.000 m²",
    "Bệnh viện Vinmec 36.000 m²",
    "Hệ thống Vinschool",
    "Công viên ánh sáng Supertree",
    "Hồ bơi resort ngoài trời",
    "Sân tennis, bóng rổ, cầu lông",
    "Sân golf mini",
    "Vườn nướng BBQ",
    "Đường dạo bộ ven sông",
    "Smart city — vận hành thông minh",
    "An ninh thông minh 24/7",
  ];
  landing.faqs = [
    {
      q: "Vinhomes Grand Park nằm ở đâu?",
      a: "Tại đường Nguyễn Xiển, phường Long Thạnh Mỹ, TP. Thủ Đức (Quận 9 cũ), TP.HCM. Dự án giáp sông Đồng Nai và sông Tắc, nằm cạnh Vành đai 3.",
    },
    {
      q: "Vinhomes Grand Park có quy mô bao nhiêu?",
      a: "Tổng diện tích 271,8 ha, mật độ xây dựng 22,53%. Gồm 71 tòa căn hộ cao tầng và khoảng 1.600 căn nhà ở thấp tầng, do Công ty Cổ phần Vinhomes (Vingroup) làm chủ đầu tư.",
    },
    {
      q: "Vinhomes Grand Park có những phân khu căn hộ nào?",
      a: "6 phân khu cao tầng: The Rainbow, The Origami, The Beverly, The Beverly Solari, Masteri Centre Point và Lumiere Boulevard. 3 phân khu thấp tầng: The Manhattan, The Manhattan Glory, The Rivus Elie Saab.",
    },
    {
      q: "Giá căn hộ Vinhomes Grand Park bao nhiêu?",
      a: "Theo tham chiếu vinhomesland.vn: The Rainbow từ ~30–40 triệu/m² (từ ~900 triệu/căn); The Origami 45–70 triệu/m²; The Beverly 65–100 triệu/m²; Masteri/Lumiere 55–100 triệu/m² tùy phân khu. Giá thứ cấp thay đổi — liên hệ tư vấn để nhận giỏ hàng mới nhất.",
    },
    {
      q: "Vinhomes Grand Park có những loại căn hộ nào?",
      a: "Studio, 1PN, 1PN+1, 2PN, 2PN+1, 3PN, 3PN+1 (diện tích ~27–120 m²). Thấp tầng: biệt thự đơn lập, song lập, shophouse, boutique villa, dinh thự.",
    },
    {
      q: "Tiện ích nổi bật tại Vinhomes Grand Park?",
      a: "Công viên ven sông 36 ha với 15 công viên chủ đề, Vincom Mega Mall, Vinmec, Vinschool, hồ bơi resort, sân thể thao, BBQ và hệ thống smart city 4 trụ cột.",
    },
    {
      q: "Vinhomes Grand Park bàn giao khi nào?",
      a: "Khởi công 2018; The Rainbow bàn giao Q2/2020, The Origami cuối 2021, The Manhattan Q2/2021. The Beverly, Masteri Centre Point bàn giao 2023; Lumiere Boulevard Q1/2024; The Rivus Elie Saab dự kiến 2025.",
    },
    {
      q: "Pháp lý Vinhomes Grand Park thế nào?",
      a: "Hình thức sổ đỏ sở hữu lâu dài. Dự án đại đô thị thương mại đã triển khai nhiều giai đoạn — xác minh pháp lý cụ thể theo từng sản phẩm khi giao dịch.",
    },
  ];
  landing.gallery = [...VINHOMES_GRAND_PARK_IMAGES.gallery];
  landing.ctaLabel = "Nhận tư vấn & bảng giá";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn phân khu, giá thứ cấp và căn đang chuyển nhượng Vinhomes Grand Park — liên hệ HouseX.";
  return landing;
}

export function buildVinhomesGrandParkMock(): ProjectDetail {
  const landing = buildVinhomesGrandParkLanding();
  const overviewData = buildOverviewData(null, {
    blocks: 71,
    landing,
  });

  return {
    id: "preview-vinhomes-grand-park",
    developerId: "preview-vinhomes-dev",
    slug: VINHOMES_GRAND_PARK_SLUG,
    name: VINHOMES_GRAND_PARK_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    ward: "Long Thạnh Mỹ",
    address: "Đường Nguyễn Xiển, Vinhomes Grand Park",
    lat: 10.835,
    lng: 106.83,
    totalArea: 271.8,
    density: 22.53,
    handoverDate: new Date("2020-06-30"),
    overviewData,
    description:
      "Vinhomes Grand Park là đại đô thị thông minh đẳng cấp quốc tế đầu tiên tại TP.HCM do Vinhomes phát triển, quy mô 271,8 ha tại Long Thạnh Mỹ, Quận 9. Dự án ôm trọn sông Đồng Nai và sông Tắc với đại công viên ven sông 36 ha (15 công viên chủ đề), 71 tòa căn hộ và ~1.600 căn thấp tầng. Hệ sinh thái smart city 4 trụ cột; tiện ích Vincom Mega Mall 48.000 m², Vinmec, Vinschool. Giá tham chiếu từ ~900 triệu/căn (The Rainbow). Sổ đỏ lâu dài.",
    seoTitle: "Vinhomes Grand Park Quận 9 — Căn hộ thông minh từ 900 triệu",
    seoDesc:
      "Vinhomes Grand Park TP. Thủ Đức: 271,8 ha, công viên 36 ha, 71 tòa căn hộ, Vincom Mega Mall. Căn hộ từ ~900 triệu, sổ đỏ lâu dài.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-vinhomes-dev",
      name: "Công ty Cổ phần Vinhomes",
      taxCode: "0102110108",
      verified: true,
      logoUrl: VINHOMES_GRAND_PARK_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-vgpk-rainbow",
        projectId: "preview-vinhomes-grand-park",
        name: "The Rainbow (28–76 m²)",
        areaMin: 28,
        areaMax: 76,
        bedrooms: 2,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-origami",
        projectId: "preview-vinhomes-grand-park",
        name: "The Origami (27–108 m²)",
        areaMin: 27,
        areaMax: 108,
        bedrooms: 3,
        priceFrom: 1_500_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-beverly",
        projectId: "preview-vinhomes-grand-park",
        name: "The Beverly (28–120 m²)",
        areaMin: 28,
        areaMax: 120,
        bedrooms: 3,
        priceFrom: 2_500_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-masteri",
        projectId: "preview-vinhomes-grand-park",
        name: "Masteri Centre Point (47–91 m²)",
        areaMin: 47,
        areaMax: 91,
        bedrooms: 3,
        priceFrom: 3_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-manhattan",
        projectId: "preview-vinhomes-grand-park",
        name: "The Manhattan — shophouse / biệt thự",
        areaMin: 120,
        areaMax: 300,
        bedrooms: 4,
        priceFrom: 8_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-vgpk-ld1",
        projectId: "preview-vinhomes-grand-park",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-ld2",
        projectId: "preview-vinhomes-grand-park",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgpk-ld3",
        projectId: "preview-vinhomes-grand-park",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2018-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildVinhomesGrandParkPreviewListings(): ProjectLandingListingCard[] {
  const imgs = VINHOMES_GRAND_PARK_IMAGES.gallery;
  return [
    {
      id: "preview-vgpk-listing-1",
      code: "MX-VGPQ901",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 950_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[3].url }],
    },
    {
      id: "preview-vgpk-listing-2",
      code: "MX-VGPQ902",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 1_850_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[4].url }],
    },
    {
      id: "preview-vgpk-listing-3",
      code: "MX-VGPQ903",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 3_200_000_000,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: imgs[5].url }],
    },
    {
      id: "preview-vgpk-listing-4",
      code: "MX-VGPQ904",
      transactionType: "SALE",
      propertyType: "shophouse",
      price: 9_500_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Phạm Thị D — Môi giới" },
      media: [{ url: imgs[9].url }],
    },
  ];
}

export function buildVinhomesGrandParkSeedLanding() {
  return buildVinhomesGrandParkLanding();
}
