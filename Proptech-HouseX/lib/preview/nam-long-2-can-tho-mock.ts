import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { NAM_LONG_2_CT_IMAGES } from "@/lib/content/nam-long-2-can-tho-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

export const NL2_PROJECT_NAME = "Nhà ở xã hội Nam Long 2 Cần Thơ";
export const NL2_COMMERCIAL_NAME = "Nam Long II Central Lake";
export const NL2_PROJECT_SLUG = "nha-o-xa-hoi-nam-long-2-can-tho";

function buildNamLong2Landing() {
  const landing = defaultProjectLanding(NL2_PROJECT_NAME);
  landing.heroSubtitle =
    "Nam Long II Central Lake · Trần Hoàng Na, Cái Răng — 15,8 tr/m², căn từ ~640 triệu, 38–57 m², giai đoạn 2 bàn giao 2027";
  landing.heroImage = { ...NAM_LONG_2_CT_IMAGES.hero };
  landing.locationMapImage = { ...NAM_LONG_2_CT_IMAGES.locationMap };
  landing.locationNotes = `Nhà ở xã hội Nam Long 2 (tên thương mại Nam Long II Central Lake) tọa lạc mặt tiền đường Trần Hoàng Na, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ — trong quần thể KDC Nam Long 2 (lô 9A).

Kết nối vùng:
• Trần Hoàng Na, Lê Trọng Tấn, Quốc lộ 1A, đường 14B
• Thuận tiện về trung tâm TP. Cần Thơ và các khu đô thị hiện hữu
• Cùng hệ sinh thái Nam Long tại Cần Thơ (Nam Long 1, Nam Long – Hồng Phát)

Quy mô trên hơn 3,8 ha: tổng 1.601 căn. Giai đoạn 1 (block E, F, G, H, K, J — 775 NOXH + 144 thương mại) đã hoàn thành. Giai đoạn 2 (block A, B, C, D — 572 NOXH + 99 thương mại) khởi công cuối 6/2025, dự kiến bàn giao 2027.

CĐT: Công ty Cổ phần Đầu tư Nam Long (Nam Long Group) — dòng Ehome.`;
  landing.highlights = [
    {
      title: "Giá 15,8 triệu/m² — căn từ ~640 triệu",
      text: "Giá chuẩn 15,8 triệu đ/m² (chưa VAT 5% & phí bảo trì 2%). Căn 38 m² ~640 triệu; 44 m² ~743 triệu; 57 m² ~963 triệu (đã gồm VAT & bảo trì theo bảng CĐT).",
    },
    {
      title: "1.601 căn — 10 block trong KDC Nam Long 2",
      text: "Giai đoạn 1 (6 block) đã bàn giao; giai đoạn 2 (4 block A–D) đang thi công — 572 căn NOXH và 99 căn thương mại.",
    },
    {
      title: "Layout 38 – 57 m² (1–2 phòng ngủ)",
      text: "Căn 38 m² (1PN/1WC), 44 m² (2PN/1WC), 57 m² (2PN/2WC). Nhà mẫu 57 m² có thể tham quan tại dự án.",
    },
    {
      title: "Mặt tiền Trần Hoàng Na — Cái Răng",
      text: "Vị trí trung tâm khu Nam Long 2 lô 9A, Hưng Thạnh; kết nối nhanh QL1A và trục vào nội đô Cần Thơ.",
    },
    {
      title: "Nam Long Group — dòng Ehome",
      text: "CĐT hơn 32 năm kinh nghiệm; đã triển khai Ehome 1–5, EhomeS Nam Sài Gòn, EhomeS Phú Hữu và hệ sinh thái Nam Long tại Cần Thơ.",
    },
    {
      title: "Nam Long II Central Lake — tên thương mại",
      text: "Dự án thành phần NOXH trong KDC Nam Long 2; cơ hội an cư cho đối tượng thu nhập thấp và công nhân theo Luật Nhà ở 2023.",
    },
  ];
  landing.amenities = [
    "Công viên & mặt nước nội khu KDC",
    "Trường học trong khu dân cư",
    "Shophouse / TMDV tầng trệt",
    "Hệ thống giao thông nội khu",
    "An ninh khu dân cư",
    "Bãi đậu xe",
    "Khu vui chơi trẻ em",
    "Tiện ích Nam Long II Central Lake",
  ];
  landing.faqs = [
    {
      q: "Nhà ở xã hội Nam Long 2 Cần Thơ nằm ở đâu?",
      a: "Mặt tiền đường Trần Hoàng Na, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ — trong KDC Nam Long 2 (Nam Long II Central Lake), lô 9A.",
    },
    {
      q: "Nam Long II Central Lake có phải nhà ở xã hội Nam Long 2 không?",
      a: "Đúng. Nam Long II Central Lake là tên thương mại của quần thể; dự án thành phần NOXH được gọi Nhà ở xã hội Nam Long 2 do Nam Long Group phát triển.",
    },
    {
      q: "Giá nhà ở xã hội Nam Long 2 bao nhiêu?",
      a: "Giá chuẩn 15,8 triệu đ/m² (chưa VAT & phí bảo trì). Căn 38 m² ~640 triệu; 44 m² ~743 triệu; 57 m² ~963 triệu — đã bao gồm 5% VAT và 2% kinh phí bảo trì theo bảng giá CĐT.",
    },
    {
      q: "Ai được mua nhà ở xã hội Nam Long 2?",
      a: "Đối tượng theo Điều 76 Luật Nhà ở 2023: người thu nhập thấp, hộ nghèo/cận nghèo, công nhân, CBCCVC, người có công… Đồng thời đáp ứng điều kiện nhà ở và thu nhập (độc thân ≤20–30 triệu/tháng; vợ chồng ≤40 triệu/tháng).",
    },
    {
      q: "Nhà ở xã hội Nam Long 2 có những loại căn nào?",
      a: "38 m² (1 phòng ngủ/1 WC), 44 m² (2 phòng ngủ/1 WC), 57 m² (2 phòng ngủ/2 WC). Nhà mẫu 57 m² có thể tham quan trực tiếp tại dự án.",
    },
    {
      q: "Tiến độ bàn giao Nam Long 2 giai đoạn 2?",
      a: "Block A, B, C, D khởi công cuối 6/2025; dự kiến bàn giao 2027. Giai đoạn 1 (block E–K) đã hoàn thành và bàn giao trước đó.",
    },
    {
      q: "Vốn tự có khi vay ngân hàng chính sách xã hội?",
      a: "Theo bảng CĐT (tham khảo): căn 38 m² vốn tự có ~126 triệu; 44 m² ~146 triệu; 57 m² ~190 triệu khi vay ngân hàng chính sách xã hội. Xác nhận chính sách hiện hành khi tư vấn.",
    },
  ];
  landing.gallery = [...NAM_LONG_2_CT_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn điều kiện NOXH, hồ sơ đăng ký và tiến độ thanh toán — liên hệ HouseX.";
  return landing;
}

export function buildNamLong2CanThoMock(): ProjectDetail {
  const landing = buildNamLong2Landing();
  const overviewData = buildOverviewData(null, {
    totalUnits: 1601,
    blocks: 10,
    landing,
  });

  return {
    id: "preview-nam-long-2-ct",
    developerId: "preview-nam-long-dev",
    slug: NL2_PROJECT_SLUG,
    name: NL2_PROJECT_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "Cần Thơ",
    district: "Cái Răng",
    ward: "Hưng Thạnh",
    address: "Mặt tiền Trần Hoàng Na, KDC Nam Long 2 (lô 9A)",
    lat: 10.0078,
    lng: 105.7525,
    totalArea: 3.8,
    density: null,
    handoverDate: new Date("2027-12-31"),
    overviewData,
    description:
      "Nhà ở xã hội Nam Long 2 Cần Thơ (Nam Long II Central Lake) do Nam Long Group phát triển tại Trần Hoàng Na, Cái Răng. Quy mô 1.601 căn trên 3,8+ ha; giá 15,8 triệu/m², căn 38–57 m² từ ~640 triệu. Giai đoạn 2 (block A–D) dự kiến bàn giao 2027.",
    seoTitle: "Nhà ở xã hội Nam Long 2 Cần Thơ — Giá từ 640 triệu/căn",
    seoDesc:
      "NOXH Nam Long 2 Cái Răng: 15,8 tr/m², 38–57 m², từ ~640 triệu. Nam Long Group, KDC Nam Long II Central Lake. Giai đoạn 2 bàn giao 2027.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-nam-long-dev",
      name: "Nam Long Group",
      taxCode: "0301237890",
      verified: true,
      logoUrl: NAM_LONG_2_CT_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-nl2-38",
        projectId: "preview-nam-long-2-ct",
        name: "1PN — 38 m² (1WC)",
        areaMin: 38,
        areaMax: 38,
        bedrooms: 1,
        priceFrom: 640_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nl2-44",
        projectId: "preview-nam-long-2-ct",
        name: "2PN — 44 m² (1WC)",
        areaMin: 44,
        areaMax: 44,
        bedrooms: 2,
        priceFrom: 743_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nl2-57",
        projectId: "preview-nam-long-2-ct",
        name: "2PN — 57 m² (2WC)",
        areaMin: 57,
        areaMax: 57,
        bedrooms: 2,
        priceFrom: 963_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-nl2-ld1",
        projectId: "preview-nam-long-2-ct",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2023-06-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nl2-ld2",
        projectId: "preview-nam-long-2-ct",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nl2-ld3",
        projectId: "preview-nam-long-2-ct",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2023-12-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildNamLong2PreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-nl2-listing-1",
      code: "NOX-NL2PRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 640_000_000,
      tier: "FREE",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: NAM_LONG_2_CT_IMAGES.gallery[4].url }],
    },
    {
      id: "preview-nl2-listing-2",
      code: "NOX-NL2PRE02",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 963_000_000,
      tier: "VIP",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: NAM_LONG_2_CT_IMAGES.gallery[0].url }],
    },
  ];
}

export function buildNamLong2SeedLanding() {
  return buildNamLong2Landing();
}
