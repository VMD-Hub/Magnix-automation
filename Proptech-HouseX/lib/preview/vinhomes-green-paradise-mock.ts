import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { VINHOMES_GREEN_PARADISE_IMAGES } from "@/lib/content/vinhomes-green-paradise-images";

const NOW = new Date("2026-06-15T00:00:00.000Z");

/** Giá tham chiếu The Haven Bay theo website (6/2026): từ ~12,9 tỷ/căn. */
const PRICE_FROM = 12_900_000_000;

export const VINHOMES_GREEN_PARADISE_NAME = "Vinhomes Green Paradise Cần Giờ";
export const VINHOMES_GREEN_PARADISE_SLUG = "vinhomes-green-paradise-can-gio";

function buildVinhomesGreenParadiseLanding() {
  const landing = defaultProjectLanding(VINHOMES_GREEN_PARADISE_NAME);
  landing.heroSubtitle =
    "Vingroup · 2.870 ha siêu đô thị biển ESG++ — nhà phố & biệt thự từ 12,9 tỷ, 23 km bờ biền, tháp 108 tầng, biển hồ 433 ha, vốn đầu tư 11 tỷ USD";
  landing.heroImage = { ...VINHOMES_GREEN_PARADISE_IMAGES.hero };
  landing.locationMapImage = { ...VINHOMES_GREEN_PARADISE_IMAGES.locationMap };
  landing.locationNotes = `Vinhomes Green Paradise (Vinhomes Cần Giờ) tọa lạc tại xã Long Hòa và thị trấn Cần Thạnh, huyện Cần Giờ, TP. Hồ Chí Minh — huyện ven biển duy nhất của thành phố, ôm trọn 23 km bờ biển và liền kề Khu dự trữ sinh quyển thế giới UNESCO rừng ngập mặn Cần Giờ (~75.000 ha).

Kết nối giao thông:
• Cách trung tâm TP.HCM ~50 km đường bộ; chợ Bến Thành ~55 km
• Cầu Cần Giờ dự kiến khởi công 2026–2028 (dài ~7,3 km) — rút ngắn kết nối khu Nam TP.HCM
• Tuyến đường sắt cao tốc Phú Mỹ Hưng – Cần Giờ dài 48,5 km (350 km/h) — tham chiếu ~12 phút từ TP.HCM
• Cao tốc Bến Lức – Long Thành, Vành đai 3 & 4, sân bay Long Thành
• Cảng trung chuyển quốc tế Cần Giờ; cảng Tân Cảng ~110 km

Vị thế độc tôn:
• Phía Bắc giáp hành lang cây xanh ven biển; Nam & Đông giáp biển Đông
• “Lưng tựa sơn, mặt hướng thủy” — kết hợp rừng ngập mặn và biển xanh
• Phù hợp an cư, nghỉ dưỡng thứ hai hoặc đầu tư dài hạn theo sóng hạ tầng biển`;
  landing.highlights = [
    {
      title: "2.870 ha — siêu đô thị biển ESG++ đầu tiên Việt Nam",
      text: "Quy mô gấp ~5 lần Palm Jumeirah (Dubai) và Sentosa (Singapore); vốn đầu tư lên tới 11 tỷ USD. Mô hình xanh – thông minh – sinh thái & tái sinh, tư vấn bởi Boston Consulting Group.",
    },
    {
      title: "5 phân khu chức năng — từ giải trí đến tài chính",
      text: "The Haven Bay (Vịnh Tiên), The Green Bay (Vịnh Ngọc), The Paradise (Mũi Danh Vọng), The Grand Island (Đảo Mặt Trời) và khu trung tâm — mỗi phân khu một vai trò riêng trong đại đô thị biển.",
    },
    {
      title: "Kỳ quan quốc tế ngay trong nội khu",
      text: "Tháp 108 tầng top 10 thế giới; biển hồ Paradise Lagoon ~433 ha; Nhà hát Sóng Xanh 7 ha (5.000 chỗ); 2 sân golf 18 lỗ; Vinpearl Safari 122 ha; Winter Wonderland 30.000 m².",
    },
    {
      title: "Giao thông xanh & năng lượng tái tạo",
      text: "Ưu tiên xe điện, xe đạp, người đi bộ; điện gió ngoài khơi cách bờ 10 km; năng lượng mặt trời, lưới điện ngầm thông minh — hướng tới đô thị carbon thấp.",
    },
    {
      title: "Sản phẩm đa dạng — từ 12,9 tỷ/căn",
      text: "Nhà phố, biệt thự, shophouse, căn hộ cao tầng, officetel, khách sạn. The Haven Bay tham chiếu giá từ 12,9 tỷ/căn — phù hợp ở, kinh doanh và đầu tư nghỉ dưỡng.",
    },
    {
      title: "Hạ tầng bứt phá — đón sóng thành phố biển",
      text: "Cầu Cần Giờ, metro/đường sắt cao tốc PMH – Cần Giờ, cảng quốc tế — biến Cần Giờ thành cửa ngõ kinh tế – du lịch biển của siêu thành phố tỷ đô TP.HCM.",
    },
  ];
  landing.amenities = [
    "Tháp biểu tượng 108 tầng",
    "Paradise Lagoon ~433 ha",
    "Nhà hát Sóng Xanh Blue Wave",
    "2 sân golf 18 lỗ quốc tế",
    "Vinpearl Safari 122 ha",
    "Cảng du thuyền Landmark Harbour",
    "Vincom Mega Mall",
    "Bệnh viện Vinmec & Cleveland Clinic",
    "Hệ thống Vinschool",
    "Winter Wonderland 30.000 m²",
    "Quảng trường 50.000 người",
    "Khu triển lãm 45.000 m²",
  ];
  landing.faqs = [
    {
      q: "Vinhomes Green Paradise Cần Giờ nằm ở đâu?",
      a: "Tại xã Long Hòa và thị trấn Cần Thạnh, huyện Cần Giờ, TP. Hồ Chí Minh — mặt tiền biển, cách trung tâm Sài Gòn khoảng 50 km. Dự án giáp Khu dự trữ sinh quyển UNESCO rừng ngập mặn Cần Giờ.",
    },
    {
      q: "Vinhomes Green Paradise có phải Vinhomes Cần Giờ không?",
      a: "Đúng. Vinhomes Green Paradise là tên thương mại của siêu đô thị lấn biển Vinhomes Cần Giờ do Tập đoàn Vingroup phát triển, quy mô 2.870 ha ven biển phía Đông Nam TP.HCM.",
    },
    {
      q: "Quy mô Vinhomes Green Paradise bao nhiêu?",
      a: "Tổng diện tích 2.870 ha, bờ biển dài khoảng 23 km, vốn đầu tư lên tới 11 tỷ USD. Quy hoạch gồm 5 phân khu chức năng và hàng chục nghìn sản phẩm nhà ở, thương mại, nghỉ dưỡng.",
    },
    {
      q: "Vinhomes Green Paradise có những phân khu nào?",
      a: "The Haven Bay (Vịnh Tiên — giải trí & nghỉ dưỡng), The Green Bay (Vịnh Ngọc — thành phố sức khỏe xanh), The Paradise (Mũi Danh Vọng — tài chính & cảng), The Grand Island (Đảo Mặt Trời — lễ hội biển) và khu trung tâm.",
    },
    {
      q: "Giá nhà phố Vinhomes Green Paradise bao nhiêu?",
      a: "Website tham chiếu phân khu The Haven Bay giá từ khoảng 12,9 tỷ/căn tùy loại hình và diện tích. Bảng giá chi tiết theo từng đợt mở bán — liên hệ tư vấn để nhận giỏ hàng mới nhất.",
    },
    {
      q: "Vinhomes Green Paradise có những loại sản phẩm nào?",
      a: "Nhà phố, biệt thự, shophouse, căn hộ cao tầng, officetel, khách sạn và các hạng mục thương mại – dịch vụ. Bộ sưu tập kiến trúc phủ xanh với hơn 60 mẫu nhà thấp tầng.",
    },
    {
      q: "Tiện ích nổi bật tại Vinhomes Green Paradise?",
      a: "Tháp 108 tầng, biển hồ Paradise Lagoon ~433 ha, Nhà hát Sóng Xanh 5.000 chỗ, 2 sân golf 18 lỗ, Vinpearl Safari 122 ha, cảng du thuyền quốc tế, Vinmec hợp tác Cleveland Clinic và hơn 100+ tiện ích khác.",
    },
    {
      q: "Hạ tầng kết nối Vinhomes Green Paradise ra sao?",
      a: "Theo quy hoạch: Cầu Cần Giờ (2026–2028), tuyến đường sắt cao tốc Phú Mỹ Hưng – Cần Giờ 48,5 km, cảng trung chuyển quốc tế, cao tốc Bến Lức – Long Thành và Vành đai 3–4. Thông tin tham khảo — xác nhận tiến độ tại thời điểm giao dịch.",
    },
  ];
  landing.gallery = [...VINHOMES_GREEN_PARADISE_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn phân khu, bảng giá và phương án thanh toán Vinhomes Green Paradise — liên hệ HouseX.";
  return landing;
}

export function buildVinhomesGreenParadiseMock(): ProjectDetail {
  const landing = buildVinhomesGreenParadiseLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 63790,
    blocks: 5,
    landing,
  });

  return {
    id: "preview-vinhomes-green-paradise",
    developerId: "preview-vinhomes-dev",
    slug: VINHOMES_GREEN_PARADISE_SLUG,
    name: VINHOMES_GREEN_PARADISE_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Cần Giờ",
    ward: "Long Hòa",
    address: "Xã Long Hòa & thị trấn Cần Thạnh, mặt tiền biển Cần Giờ",
    lat: 10.411,
    lng: 106.955,
    totalArea: 2870,
    density: 20,
    handoverDate: null,
    overviewData,
    description:
      "Vinhomes Green Paradise Cần Giờ là siêu đô thị biển ESG++ quy mô 2.870 ha do Tập đoàn Vingroup phát triển tại huyện Cần Giờ, TP.HCM — huyện ven biển duy nhất của thành phố. Dự án ôm trọn 23 km bờ biển, liền kề rừng ngập mặn UNESCO 75.000 ha, vốn đầu tư 11 tỷ USD. Nổi bật với tháp 108 tầng, biển hồ Paradise Lagoon ~433 ha, Nhà hát Sóng Xanh, 2 sân golf, Vinpearl Safari 122 ha. Sản phẩm: nhà phố, biệt thự, shophouse, căn hộ, officetel — giá tham chiếu từ 12,9 tỷ/căn (The Haven Bay).",
    seoTitle: "Vinhomes Green Paradise Cần Giờ — Siêu đô thị biển ESG++ 2.870 ha",
    seoDesc:
      "Vinhomes Green Paradise Cần Giờ: 2.870 ha lấn biển, tháp 108 tầng, biển hồ 433 ha, nhà phố từ 12,9 tỷ. Hạ tầng Cầu Cần Giờ & metro cao tốc.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-vinhomes-dev",
      name: "Công ty Cổ phần Vinhomes",
      taxCode: "0102110108",
      verified: true,
      logoUrl: VINHOMES_GREEN_PARADISE_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-vgp-nha-pho",
        projectId: "preview-vinhomes-green-paradise",
        name: "Nhà phố phủ xanh (The Haven Bay)",
        areaMin: 90,
        areaMax: 150,
        bedrooms: 4,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgp-biet-thu",
        projectId: "preview-vinhomes-green-paradise",
        name: "Biệt thự nghỉ dưỡng",
        areaMin: 200,
        areaMax: 500,
        bedrooms: 5,
        priceFrom: 25_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgp-shophouse",
        projectId: "preview-vinhomes-green-paradise",
        name: "Shophouse thương mại",
        areaMin: 120,
        areaMax: 250,
        bedrooms: 0,
        priceFrom: 15_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgp-can-ho",
        projectId: "preview-vinhomes-green-paradise",
        name: "Căn hộ cao tầng (tới 39 tầng)",
        areaMin: 55,
        areaMax: 120,
        bedrooms: 3,
        priceFrom: 8_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-vgp-ld1",
        projectId: "preview-vinhomes-green-paradise",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: new Date("2021-02-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vgp-ld2",
        projectId: "preview-vinhomes-green-paradise",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildVinhomesGreenParadisePreviewListings(): ProjectLandingListingCard[] {
  const imgs = VINHOMES_GREEN_PARADISE_IMAGES.gallery;
  return [
    {
      id: "preview-vgp-listing-1",
      code: "MX-VGP01",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 12_900_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[5].url }],
    },
    {
      id: "preview-vgp-listing-2",
      code: "MX-VGP02",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 14_500_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[0].url }],
    },
    {
      id: "preview-vgp-listing-3",
      code: "MX-VGP03",
      transactionType: "SALE",
      propertyType: "biet_thu",
      price: 28_000_000_000,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: `${VINHOMES_GREEN_PARADISE_IMAGES.hero.url}` }],
    },
    {
      id: "preview-vgp-listing-4",
      code: "MX-VGP04",
      transactionType: "SALE",
      propertyType: "shophouse",
      price: 16_800_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Phạm Thị D — Môi giới" },
      media: [{ url: imgs[3].url }],
    },
  ];
}

export function buildVinhomesGreenParadiseSeedLanding() {
  return buildVinhomesGreenParadiseLanding();
}
