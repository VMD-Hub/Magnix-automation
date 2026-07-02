import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { THE_PRIVE_IMAGES } from "@/lib/content/the-prive-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Giá dự kiến tham chiếu theo FAQ website CĐT (7/2026): ~120 triệu/m². */
const PRICE_M2_REF = 120_000_000;

export const THE_PRIVE_PROJECT_NAME = "The Privé Nam Rạch Chiếc";
export const THE_PRIVE_ALIAS = "Gem Riverside";
export const THE_PRIVE_PROJECT_SLUG = "the-prive-nam-rach-chiec";

function buildThePriveLanding() {
  const landing = defaultProjectLanding(THE_PRIVE_PROJECT_NAME);
  landing.heroSubtitle =
    "Bluemarq Group · 6,7 ha ven sông An Phú — 3.175 căn, 12 tháp 32–35 tầng, công viên mặt nước 6,7 ha, bàn giao Q4/2027";
  landing.heroImage = { ...THE_PRIVE_IMAGES.hero };
  landing.locationMapImage = { ...THE_PRIVE_IMAGES.locationMap };
  landing.locationNotes = `The Privé tọa lạc tại Khu đô thị Nam Rạch Chiếc, phường An Phú (nay thuộc phường Bình Trưng), TP. Thủ Đức, TP.HCM — vị trí “Nhất cận thị – Nhị cận giang – Tam cận lộ”, ba mặt giáp sông Giồng Ông Tố và sông Kinh Mương.

Kết nối giao thông:
• Đường song hành cao tốc TP.HCM – Long Thành (đoạn An Phú – Đỗ Xuân Hợp đã thông xe)
• Nguyễn Duy Trinh → Nam Rạch Chiếc; Hầm Thủ Thiêm → nút giao An Phú
• Metro số 1 & 2; cao tốc Long Thành – Dầu Giày, Vành đai 2–3

Hàng xóm & tiện ích lân cận:
• The Global City, Lakeview City, Palm City, Saigon Sport City
• Vincom, bệnh viện quốc tế, trường quốc tế trong bán kính 5–15 phút

Nhà mẫu: 12A Vũ Tông Phan, phường Bình Trưng, TP. Thủ Đức.`;
  landing.highlights = [
    {
      title: "6,7 ha — công viên mặt nước nội khu",
      text: "Quy mô lớn ven sông với mật độ xây dựng ~25%; không gian xanh và mặt nước chiếm phần lớn diện tích — điểm nhấn “resort tại gia” giữa TP. Thủ Đức.",
    },
    {
      title: "3.175 sản phẩm — 12 tháp 32–35 tầng",
      text: "3.045 căn hộ thương mại, 96 penthouse, 34 duplex villa; thiết kế CPG Consultants (Singapore), thi công Hòa Bình, vận hành Savills/CBRE.",
    },
    {
      title: "Chính sách 7/2026 — chiết khấu tới 21,5%",
      text: "Thanh toán 10% ký HĐMB; hỗ trợ vay 70%; full lãi 24 tháng; ân hạn gốc 60 tháng; chiết khấu 9% khi đặt cọc — xác nhận điều kiện áp dụng khi tư vấn.",
    },
    {
      title: "Studio – 3PN & penthouse (49–151 m²)",
      text: "1PN/studio ~49 m²; 2PN 71–85 m²; 3PN ~95 m²; penthouse/duplex 108–151 m². Hoàn thiện cơ bản — nội thất cao cấp (Bosch, Grohe, Duravit…).",
    },
    {
      title: "45+ tiện ích 5 sao nội khu",
      text: "Hồ bơi resort 3.300 m², bến du thuyền, skygarden, skypool, vườn treo Babylon, clubhouse, gym, spa, TTTM, trường mầm non.",
    },
    {
      title: "Bluemarq Group — tên cũ Gem Riverside",
      text: "Chủ đầu tư Bluemarq Group (trước đây Đất Xanh Group). Dự án từng gọi Gem Riverside; pháp lý đầy đủ, dự kiến bàn giao Q4/2027.",
    },
  ];
  landing.amenities = [
    "Công viên mặt nước 6,7 ha",
    "Hồ bơi resort 3.300 m²",
    "Bến du thuyền",
    "Skygarden & skypool",
    "Vườn treo Babylon",
    "Clubhouse cao cấp",
    "Gym & spa",
    "Sân tennis",
    "Trung tâm thương mại nội khu",
    "Trường mầm non",
    "Quảng trường ánh sáng",
    "Rooftop bar",
  ];
  landing.faqs = [
    {
      q: "The Privé nằm ở đâu?",
      a: "Tại Khu đô thị Nam Rạch Chiếc, phường An Phú (nay Bình Trưng), TP. Thủ Đức — ba mặt giáp sông, cạnh The Global City, Palm City và Lakeview City.",
    },
    {
      q: "The Privé có phải dự án Gem Riverside không?",
      a: "Đúng. The Privé là tên mới của dự án từng gọi Gem Riverside, do Bluemarq Group (trước đây Đất Xanh Group) phát triển tại Nam Rạch Chiếc.",
    },
    {
      q: "Giá căn hộ The Privé bao nhiêu?",
      a: "Website chủ đầu tư tham chiếu giá dự kiến khoảng 120 triệu/m² (7/2026); bảng giá chi tiết theo tầng/view đang cập nhật từng đợt mở bán. Liên hệ tư vấn để nhận giỏ hàng và chính sách mới nhất.",
    },
    {
      q: "The Privé có những loại căn hộ nào?",
      a: "Studio/1PN ~49 m²; 2PN 71–85 m²; 3PN ~95 m²; penthouse và duplex villa 108–151 m². Bàn giao hoàn thiện cơ bản với nội thất cao cấp.",
    },
    {
      q: "Chính sách thanh toán The Privé ra sao?",
      a: "Theo chính sách 7/2026: 10% ký HĐMB; hỗ trợ vay tới 70%; full lãi 24 tháng; ân hạn gốc 60 tháng; chiết khấu đặt cọc 9% (tổng ưu đãi có thể tới 21,5%). Ngân hàng: VCB, VietinBank, MB, TPBank, VPBank, MSB.",
    },
    {
      q: "The Privé bàn giao khi nào?",
      a: "Dự kiến bàn giao Quý 4/2027. Tiến độ: đã hoàn thiện móng hầm giai đoạn 1 (3/2025); tháp cao nhất đã lên tầng 19 (6/2026).",
    },
    {
      q: "Pháp lý The Privé thế nào?",
      a: "Website CĐT ghi đã có chấp thuận đầu tư, quy hoạch 1/500, giấy phép xây dựng và giấy phép bán hàng; sổ hồng, sở hữu lâu dài (50 năm đối với người nước ngoài). Chi tiết — xác minh trước giao dịch.",
    },
    {
      q: "Nhà mẫu The Privé ở đâu?",
      a: "12A Vũ Tông Phan, phường Bình Trưng, TP. Thủ Đức — có sa bàn, layout 3D và nhà mẫu thực tế 1–3 phòng ngủ.",
    },
  ];
  landing.gallery = [...THE_PRIVE_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá, chính sách ưu đãi và giỏ hàng The Privé — liên hệ HouseX.";
  return landing;
}

export function buildThePriveMock(): ProjectDetail {
  const landing = buildThePriveLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 3175,
    blocks: 12,
    landing,
  });

  return {
    id: "preview-the-prive",
    developerId: "preview-bluemarq-dev",
    slug: THE_PRIVE_PROJECT_SLUG,
    name: THE_PRIVE_PROJECT_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "TP. Thủ Đức",
    ward: "An Phú",
    address: "Khu đô thị Nam Rạch Chiếc",
    lat: 10.7978,
    lng: 106.7492,
    totalArea: 6.7,
    density: 25,
    handoverDate: new Date("2027-12-31"),
    overviewData,
    description:
      "The Privé là dự án căn hộ cao cấp ven sông do Bluemarq Group phát triển tại Nam Rạch Chiếc, An Phú, TP. Thủ Đức. Quy mô 6,7 ha với công viên mặt nước nội khu, 12 tháp 32–35 tầng, 3.175 sản phẩm. Thiết kế CPG Consultants, thi công Hòa Bình. Sản phẩm studio–penthouse 49–151 m², 45+ tiện ích resort. Dự kiến bàn giao Q4/2027.",
    seoTitle: "The Privé Nam Rạch Chiếc — Căn hộ cao cấp ven sông Quận 2",
    seoDesc:
      "Căn hộ The Privé Bluemarq Group: 6,7 ha Nam Rạch Chiếc, 3.175 căn, 1–3PN & penthouse, công viên mặt nước, chiết khấu tới 21,5%. Bàn giao Q4/2027.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-bluemarq-dev",
      name: "Bluemarq Group",
      taxCode: "0301445678",
      verified: true,
      logoUrl: THE_PRIVE_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-prive-1pn",
        projectId: "preview-the-prive",
        name: "1PN / Studio (~49 m²)",
        areaMin: 49.14,
        areaMax: 49.14,
        bedrooms: 1,
        priceFrom: Math.round(49.14 * PRICE_M2_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-prive-2pn",
        projectId: "preview-the-prive",
        name: "2PN (71–85 m²)",
        areaMin: 71,
        areaMax: 85.06,
        bedrooms: 2,
        priceFrom: Math.round(71 * PRICE_M2_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-prive-3pn",
        projectId: "preview-the-prive",
        name: "3PN (~95 m²)",
        areaMin: 94.93,
        areaMax: 95.01,
        bedrooms: 3,
        priceFrom: Math.round(94.93 * PRICE_M2_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-prive-ph",
        projectId: "preview-the-prive",
        name: "Penthouse / Duplex (108–151 m²)",
        areaMin: 107.78,
        areaMax: 151.19,
        bedrooms: 3,
        priceFrom: Math.round(107.78 * PRICE_M2_REF),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-prive-ld1",
        projectId: "preview-the-prive",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-prive-ld2",
        projectId: "preview-the-prive",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2025-03-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-prive-ld3",
        projectId: "preview-the-prive",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildThePrivePreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-prive-listing-1",
      code: "MX-PRIVE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(76 * PRICE_M2_REF),
      tier: "PREMIUM",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: THE_PRIVE_IMAGES.gallery[5].url }],
    },
    {
      id: "preview-prive-listing-2",
      code: "MX-PRIVE02",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(95 * PRICE_M2_REF),
      tier: "VIP",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: THE_PRIVE_IMAGES.gallery[0].url }],
    },
  ];
}

export function buildThePriveSeedLanding() {
  return buildThePriveLanding();
}
