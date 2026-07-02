import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { NOBLE_CRYSTAL_RIVERSIDE_IMAGES } from "@/lib/content/noble-crystal-riverside-images";

const NOW = new Date("2026-07-01T00:00:00.000Z");

export const NOBLE_CRYSTAL_RIVERSIDE_NAME = "Noble Crystal Riverside";
export const NOBLE_CRYSTAL_RIVERSIDE_SLUG = "noble-crystal-riverside-quan-7";

function buildNobleCrystalRiversideLanding() {
  const landing = defaultProjectLanding(NOBLE_CRYSTAL_RIVERSIDE_NAME);
  landing.heroSubtitle =
    "Sunshine Group · Compound ven sông 422 Đào Trí Q7 — 12 tháp 38–40 tầng, 3 mặt giáp sông, full nội thất cao cấp, resort 4.0 hơn 100 tiện ích";
  landing.heroImage = { ...NOBLE_CRYSTAL_RIVERSIDE_IMAGES.hero };
  landing.locationMapImage = { ...NOBLE_CRYSTAL_RIVERSIDE_IMAGES.locationMap };
  landing.locationNotes = `Noble Crystal Riverside tọa lạc tại số 422 đường Đào Trí, phường Phú Thuận (Quận 7 cũ), TP. Hồ Chí Minh — vị trí 3 mặt giáp sông Sài Gòn và sông Đồng Nai trên "cung đường tỷ đô" Nam Sài Gòn.

Kết nối giao thông:
• ~5 phút đến Phú Mỹ Hưng (Crescent Mall, SC VivoCity, bệnh viện FV, trường quốc tế)
• ~10 phút đến Thủ Thiêm khi cầu Thủ Thiêm 4 hoàn thành (vốn đầu tư >2.160 tỷ)
• Hưởng lợi hầm chui – cầu vượt Nguyễn Văn Linh – Nguyễn Hữu Thọ (2.600 tỷ)
• Đào Trí quy hoạch mở rộng lộ giới 40 m — trục ven sông hiện đại

100% căn hộ view panorama sông Sài Gòn, cầu Phú Mỹ, Q1 và Thủ Thiêm — không bị che chắn.`;
  landing.highlights = [
    {
      title: "Compound ven sông — 3 mặt giáp nước",
      text: "Vị trí độc tôn trên cung đường Đào Trí: 112.585 m² khu đất, mật độ xây dựng 23,6%; ~70% diện tích dành cho cảnh quan, mặt nước và công trình công cộng.",
    },
    {
      title: "12 tháp cao tầng — resort 4.0",
      text: "38–40 tầng + hầm bãi xe rộng; hơn 100 tiện ích nội khu: 13+12 bể bơi (mặt nước >4.000 m²), sông Venice, thác tràn, Sky Bar, golf trên cao, rạp chiếu phim QLED.",
    },
    {
      title: "2PN–4PN · Duplex · Sky Villas · Sky Garden",
      text: "Căn 2PN (92,6–123 m²), 3PN (~143 m²), 4–5PN đa thế hệ; duplex thông tầng, biệt thự trên không và căn sân vườn trên cao. 100% căn có vườn treo nhiệt đới riêng.",
    },
    {
      title: "Full nội thất nhập khẩu Châu Âu",
      text: "Bàn giao liền tường: kính Low-E tràn viền, Duravit, Hansgrohe, Kohler, Franke, vòi mạ vàng tiêu chuẩn hoàng gia — dọn vào ở ngay.",
    },
    {
      title: "Sunshine Group — Smart Living",
      text: "Chủ đầu tư Sunshine Group (từ 2016); hệ sinh thái đa ngành BĐS, công nghệ, giáo dục (Sunshine Maple Bear). Bảo lãnh và cho vay VPBank.",
    },
    {
      title: "Pháp lý minh bạch — sổ hồng lâu dài",
      text: "Chứng thư bảo lãnh VPBank khi ký HĐMB; hỗ trợ chuyển nhượng thuận lợi. Tiến độ 06/2026: thi công phần móng — cọc D1500 sâu 16–80 m.",
    },
  ];
  landing.amenities = [
    "13 bể bơi tầng đế + 12 bể mái",
    "Sông cảnh quan Venice",
    "Thác tràn nghệ thuật",
    "Sky Bar & Rooftop Café",
    "Sân golf trên cao AI",
    "Rạp chiếu phim QLED Dolby",
    "Disney Land & The Snow Queen",
    "Tini World & Kidzone 2.000 m²",
    "Sunshine Maple Bear",
    "TTTM & siêu thị nội khu",
    "Smart Living tích hợp",
    "An ninh đa lớp thông minh",
  ];
  landing.faqs = [
    {
      q: "Noble Crystal Riverside nằm ở đâu?",
      a: "Tại số 422 đường Đào Trí, phường Phú Thuận, Quận 7, TP.HCM — 3 mặt giáp sông, liền kề Phú Mỹ Hưng và cung đường tỷ đô Nam Sài Gòn. Không nằm tại Dĩ An hay Bình Dương.",
    },
    {
      q: "Noble Crystal Riverside có những loại căn hộ nào?",
      a: "Căn hộ cao cấp 2–4 phòng ngủ, duplex thông tầng, Sky Villas (biệt thự trên không) và Sky Garden (sân vườn trên cao). Nhà mẫu tham khảo: 2PN+2WC ~123 m², 3PN+2WC ~155 m².",
    },
    {
      q: "Giá bán Noble Crystal Riverside bao nhiêu?",
      a: "Chủ đầu tư công bố bảng giá khảo sát theo từng tòa (A, D…) trên website chính thức — mức giá phụ thuộc tầng, view và diện tích. Liên hệ HouseX để nhận bảng giá và chính sách ưu đãi mới nhất.",
    },
    {
      q: "Chính sách thanh toán Noble Crystal Riverside ra sao?",
      a: "Hợp tác bảo lãnh và cho vay VPBank; vay 20–30 năm tùy tòa; từng có chương trình 30 tháng không trả gốc, không trả lãi; miễn phí trả nợ trước hạn 1 lần/căn. Xác nhận điều kiện áp dụng khi tư vấn.",
    },
    {
      q: "Noble Crystal Riverside bàn giao thế nào?",
      a: "Bàn giao full nội thất cao cấp nhập khẩu (Duravit, Hansgrohe, Kohler, Franke…). Lịch bàn giao theo từng tòa — liên hệ để nhận tiến độ và lịch thanh toán cụ thể.",
    },
    {
      q: "Pháp lý Noble Crystal Riverside có an tâm không?",
      a: "Sunshine Group cam kết pháp lý minh bạch; sổ hồng lâu dài với công dân Việt Nam. Khi ký HĐMB khách nhận Chứng thư bảo lãnh VPBank đảm bảo nghĩa vụ bàn giao của CĐT.",
    },
    {
      q: "Tiện ích nội khu Noble Crystal Riverside nổi bật gì?",
      a: "Resort 4.0 với hơn 100 tiện ích: 25 bể bơi tổng mặt nước >4.000 m², sông Venice, thác tràn, golf trên cao, rạp phim, khu tuyết The Snow Queen, Sky Bar và hệ thống Smart Living.",
    },
    {
      q: "Noble Crystal Riverside có phù hợp đầu tư cho thuê không?",
      a: "Vị trí ven sông Q7 gần Phú Mỹ Hưng và KCN Nam TP.HCM; sản phẩm full nội thất cao cấp hướng tệp chuyên gia nước ngoài và quản lý cấp cao. Khả năng cho thuê phụ thuộc chất lượng vận hành thực tế — cần phân tích dòng tiền cụ thể.",
    },
  ];
  landing.gallery = [...NOBLE_CRYSTAL_RIVERSIDE_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & chính sách";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá tòa A/D, phương án vay VPBank và giỏ căn Noble Crystal Riverside — liên hệ HouseX.";
  return landing;
}

export function buildNobleCrystalRiversideMock(): ProjectDetail {
  const landing = buildNobleCrystalRiversideLanding();
  const overviewData = buildOverviewData(null, {
    blocks: 12,
    landing,
  });

  return {
    id: "preview-noble-crystal",
    developerId: "preview-sunshine-dev",
    slug: NOBLE_CRYSTAL_RIVERSIDE_SLUG,
    name: NOBLE_CRYSTAL_RIVERSIDE_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Quận 7",
    ward: "Phú Thuận",
    address: "422 Đào Trí, Phú Thuận, Quận 7, TP.HCM",
    lat: 10.7294,
    lng: 106.7412,
    totalArea: 11.26,
    density: 23.6,
    handoverDate: null,
    overviewData,
    description:
      "Noble Crystal Riverside là khu căn hộ compound ven sông cao cấp do Sunshine Group phát triển tại 422 Đào Trí, Quận 7, TP.HCM. Quy mô 112.585 m² (11,26 ha), 12 tháp 38–40 tầng, mật độ 23,6%, 3 mặt giáp sông. Sản phẩm 2–4PN, Duplex, Sky Villas, Sky Garden; bàn giao full nội thất Duravit, Hansgrohe, Kohler. Hơn 100 tiện ích resort 4.0; bảo lãnh VPBank; sổ hồng lâu dài.",
    seoTitle: "Noble Crystal Riverside Q7 — Compound ven sông Sunshine Group",
    seoDesc:
      "Căn hộ Noble Crystal Riverside 422 Đào Trí Q7: 12 tháp, 3 mặt sông, full nội thất cao cấp, resort 4.0, VPBank, sổ hồng lâu dài.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-sunshine-dev",
      name: "Tập đoàn Sunshine (Sunshine Group)",
      taxCode: "0315133728",
      verified: true,
      logoUrl: NOBLE_CRYSTAL_RIVERSIDE_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-ncr-2pn",
        projectId: "preview-noble-crystal",
        name: "2PN (92,6–123 m²)",
        areaMin: 93,
        areaMax: 123,
        bedrooms: 2,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ncr-3pn",
        projectId: "preview-noble-crystal",
        name: "3PN (~143 m²)",
        areaMin: 143,
        areaMax: 155,
        bedrooms: 3,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ncr-4pn",
        projectId: "preview-noble-crystal",
        name: "4PN đa thế hệ",
        areaMin: 160,
        areaMax: 220,
        bedrooms: 4,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ncr-duplex",
        projectId: "preview-noble-crystal",
        name: "Duplex / Sky Villa / Sky Garden",
        areaMin: 200,
        areaMax: 400,
        bedrooms: 4,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-ncr-ld1",
        projectId: "preview-noble-crystal",
        docType: "giay_phep_ban_hang",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ncr-ld2",
        projectId: "preview-noble-crystal",
        docType: "bao_lanh_ngan_hang",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildNobleCrystalRiversidePreviewListings(): ProjectLandingListingCard[] {
  const imgs = NOBLE_CRYSTAL_RIVERSIDE_IMAGES.gallery;
  return [
    {
      id: "preview-ncr-listing-1",
      code: "A-2PN-18",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[6].url }],
    },
    {
      id: "preview-ncr-listing-2",
      code: "A-3PN-22",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[7].url }],
    },
    {
      id: "preview-ncr-listing-3",
      code: "D-2PN-05",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: imgs[0].url }],
    },
  ];
}

export function buildNobleCrystalRiversideSeedLanding() {
  return buildNobleCrystalRiversideLanding();
}
