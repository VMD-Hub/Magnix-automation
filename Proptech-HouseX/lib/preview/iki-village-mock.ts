import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { IKI_VILLAGE_PUBLISHED_IMAGES } from "@/lib/content/iki-village-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

function buildIkiLanding() {
  const landing = defaultProjectLanding("IKI Village");
  landing.heroSubtitle =
    "Căn hộ wellness 100% sân vườn riêng — Sky Garden, Duplex, Sky Villa & Penthouse tại Vành đai 3, Lò Lu nối dài";
  landing.heroImage = { ...IKI_VILLAGE_PUBLISHED_IMAGES.hero };
  landing.locationMapImage = { ...IKI_VILLAGE_PUBLISHED_IMAGES.locationMap };
  landing.locationNotes = `IKI Village tọa lạc mặt tiền đường Vành đai 3 — Lò Lu nối dài, TP.HCM, trong bối cảnh khu vực phát triển hạ tầng và cộng đồng dân cư hiện hữu.

Vị trí chiến lược (theo website dự án):
• Giao điểm Vành đai 3 và nút giao Gò Công 4 tầng — kết nối đa hướng
• Thuận tiện đến khu làm việc, trung tâm thương mại, trường học và y tế
• Hơn 90% căn hộ hướng sông; công viên ven sông 1ha do Belt Collins thiết kế

Tiện ích ngoại khu: giáo dục các cấp, bệnh viện/phòng khám, chợ/siêu thị và khu giải trí trong bán kính di chuyển hợp lý — phù hợp an cư lâu dài và cho thuê.`;
  landing.highlights = [
    {
      title: "100% căn hộ có sân vườn riêng",
      text: "Mỗi căn sở hữu sân vườn 25–40 m², bàn giao hoàn thiện theo thiết kế; trải nghiệm sống gần thiên nhiên giữa đô thị.",
    },
    {
      title: "Triết lý IKIGAI — chuẩn sống wellness",
      text: "Dự án định hướng wellness trị liệu, cân bằng thân – tâm; hệ sinh thái chăm sóc sức khỏe và cộng đồng gắn kết.",
    },
    {
      title: "Vị trí Vành đai 3 — Lò Lu nối dài",
      text: "Kết nối trực tiếp Vành đai 3 và nút giao Gò Công 4 tầng; thuận tiện di chuyển đến trung tâm và các khu chức năng.",
    },
    {
      title: "Hơn 90% căn view sông",
      text: "Tầm nhìn hướng sông, không gian thoáng đãng; công viên ven sông 1ha trong khuôn viên.",
    },
    {
      title: "Thiết kế quốc tế — đối tác uy tín",
      text: "Kiến trúc nagecco; cảnh quan Belt Collins; quản lý vận hành CBRE; thi công móng Bachy Soletanche (theo website).",
    },
    {
      title: "Đa dạng loại hình cao cấp",
      text: "Sky Garden 126–163 m², Duplex Garden 223–227 m², Sky Villa 281–288 m², Penthouse 288–349 m² — phù hợp an cư và đầu tư cho thuê.",
    },
  ];
  landing.amenities = [
    "Công viên ven sông 1ha",
    "Hệ sinh thái wellness trị liệu",
    "Khu thể thao & gym ngoài trời",
    "Hồ bơi tháp Harmonie",
    "Khu vui chơi trẻ em",
    "Khu sinh hoạt cộng đồng",
    "Không gian thư giãn & pergola",
    "Shophouse & dịch vụ",
    "An ninh 24/7",
    "Chỗ đậu ô tô riêng/căn",
    "Thang máy riêng/căn (theo CĐT)",
    "Thang rác riêng biệt",
  ];
  landing.faqs = [
    {
      q: "IKI Village nằm ở đâu?",
      a: "Dự án tại mặt tiền đường Vành đai 3 — Lò Lu nối dài, TP.HCM. Vị trí giao Vành đai 3 và nút giao Gò Công 4 tầng theo thông tin website dự án.",
    },
    {
      q: "IKI Village có những loại hình nào?",
      a: "Sky Garden (126–163 m²), Duplex Garden (223–227 m²), Sky Villa Residences (281–288 m²) và Penthouse (288–349 m²) — xem bảng loại hình trên trang dự án.",
    },
    {
      q: "Điểm khác biệt của IKI Village là gì?",
      a: "100% căn hộ có sân vườn riêng 25–40 m²; định hướng wellness/IKIGAI; hơn 90% căn view sông; công viên ven sông 1ha và hệ tiện ích nội khu đồng bộ.",
    },
    {
      q: "Chủ đầu tư IKI Village là ai?",
      a: "Theo website: Công ty Cổ phần Đầu tư An Khải Hưng phát triển dự án; đối tác thiết kế, thi công và vận hành gồm nagecco, Belt Collins, CBRE, Bachy Soletanche.",
    },
    {
      q: "Giá bán IKI Village bao nhiêu?",
      a: "Website chưa công bố bảng giá chi tiết công khai. Liên hệ tư vấn để nhận báo giá và chính sách thanh toán mới nhất theo từng loại căn.",
    },
    {
      q: "IKI Village phù hợp đầu tư cho thuê không?",
      a: "Theo định hướng website: vị trí thuận tiện, tiện ích đầy đủ, sản phẩm wellness khác biệt — phù hợp an cư lẫn khai thác cho thuê dài hạn. Liên hệ tư vấn để phân tích dòng tiền cụ thể.",
    },
  ];
  landing.gallery = [...IKI_VILLAGE_PUBLISHED_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildIkiVillageMock(): ProjectDetail {
  const landing = buildIkiLanding();
  const overviewData = buildOverviewData(null, {
    blocks: 2,
    landing,
  });

  return {
    id: "preview-iki-village",
    developerId: "preview-an-khai-hung",
    slug: "iki-village",
    name: "IKI Village",
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "TP. Hồ Chí Minh",
    ward: null,
    address: "Mặt tiền Vành đai 3 — Lò Lu nối dài",
    lat: 10.765,
    lng: 106.545,
    totalArea: 5.1,
    density: 40,
    handoverDate: null,
    overviewData,
    description:
      "IKI Village là dự án căn hộ cao cấp định hướng wellness do Công ty Cổ phần Đầu tư An Khải Hưng phát triển tại mặt tiền Vành đai 3 — Lò Lu nối dài, TP.HCM. Quy mô 5,1 ha, mật độ xây dựng 40%. 100% căn hộ có sân vườn riêng; sản phẩm Sky Garden, Duplex Garden, Sky Villa và Penthouse (126–349 m²). Lấy cảm hứng triết lý IKIGAI, tích hợp công viên ven sông 1ha và hệ sinh thái tiện ích wellness.",
    seoTitle: "IKI Village — Căn hộ wellness sân vườn riêng, Vành đai 3",
    seoDesc:
      "Căn hộ IKI Village TP.HCM: 100% sân vườn riêng, view sông, Sky Garden đến Penthouse 126–349m². Wellness living tại Vành đai 3.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-an-khai-hung",
      name: "Công ty Cổ phần Đầu tư An Khải Hưng",
      taxCode: "0316000002",
      verified: true,
      logoUrl: IKI_VILLAGE_PUBLISHED_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-iki-sky",
        projectId: "preview-iki-village",
        name: "Sky Garden",
        areaMin: 126,
        areaMax: 163,
        bedrooms: 2,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-iki-duplex",
        projectId: "preview-iki-village",
        name: "Duplex Garden",
        areaMin: 223,
        areaMax: 227,
        bedrooms: 3,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-iki-villa",
        projectId: "preview-iki-village",
        name: "Sky Villa Residences",
        areaMin: 281,
        areaMax: 288,
        bedrooms: 4,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-iki-pent",
        projectId: "preview-iki-village",
        name: "Penthouse",
        areaMin: 288,
        areaMax: 349,
        bedrooms: 4,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [],
  } as unknown as ProjectDetail;
}

export function buildIkiPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-iki-l1",
      code: "MX-IKIPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 0,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: IKI_VILLAGE_PUBLISHED_IMAGES.gallery[2].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildIkiSeedLanding() {
  return buildIkiLanding();
}
