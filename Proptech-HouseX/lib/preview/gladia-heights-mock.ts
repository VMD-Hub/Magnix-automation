import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { GLADIA_HEIGHTS_IMAGES } from "@/lib/content/gladia-heights-images";

const NOW = new Date("2026-06-20T00:00:00.000Z");

export const GLADIA_HEIGHTS_NAME = "Gladia Heights";
export const GLADIA_HEIGHTS_SLUG = "gladia-heights-khang-dien-thu-duc";

function buildGladiaHeightsLanding() {
  const landing = defaultProjectLanding(GLADIA_HEIGHTS_NAME);
  landing.heroSubtitle =
    "Khang Điền · Keppel Land — 3 tháp 639 căn 1–4PN, Savills, BCA Green Mark Gold, vốn 30% đến nhận nhà, bàn giao 12/2027";
  landing.heroImage = { ...GLADIA_HEIGHTS_IMAGES.hero };
  landing.locationMapImage = { ...GLADIA_HEIGHTS_IMAGES.locationMap };
  landing.locationNotes = `Gladia Heights tọa lạc tại Võ Chí Công, phường Bình Trưng Đông, TP. Thủ Đức, TP.HCM — trong cụm đô thị tích hợp kế cận Thủ Thiêm, 3 mặt giáp sông, triết lý "Future-First".

Kết nối giao thông (tham khảo website CĐT):
• 10 phút: Khu đô thị Thủ Thiêm (Võ Chí Công → Mai Chí Thọ)
• 15 phút: Trung tâm Quận 1 (Mai Chí Thọ → Hầm Thủ Thiêm)
• 15 phút: Phú Mỹ Hưng (Võ Chí Công → Cầu Phú Mỹ)
• 10 phút: Khu công nghệ cao (Võ Chí Công → Liên Phường)
• 30 phút: Sân bay Long Thành (cao tốc TP.HCM – Long Thành)

Tâm điểm kết nối "5-10-15": 5–10 phút tiện ích đời sống; 10–15 phút Thủ Thiêm, Thảo Điền, AIS/TAS; 15–20 phút Q1, SC VivoCity.`;
  landing.highlights = [
    {
      title: "3 tháp — 639 căn & 26 shophouse",
      text: "Căn hộ cao cấp 1–4 phòng ngủ và duplex; quy hoạch masterplan 11,8 ha với 5 công viên chủ đề (1,25 ha) và cảnh quan 9 ha ven sông.",
    },
    {
      title: "Savills — tiêu chuẩn Estella Heights",
      text: "Vận hành chuẩn quốc tế bởi Savills; sảnh riêng từng tháp, Concierge 24/7, điện dự phòng 100%. Thi công Conteccons.",
    },
    {
      title: "BCA Green Mark Gold — Singapore",
      text: "Chứng nhận công trình xanh BCA Green Mark Gold & Districts; tối ưu không khí, ánh sáng tự nhiên và năng lượng.",
    },
    {
      title: "Hơn 60 tiện ích — resort tại gia",
      text: "Hai hồ bơi Ngân Hà & Ánh Sao dài ~70 m (âm thanh dưới nước, jacuzzi nổi); 2 km đường chạy bộ – đạp xe ven sông; 5 công viên chủ đề.",
    },
    {
      title: "Vốn 30% — chiết khấu tới 12%",
      text: "Thanh toán chuẩn: cọc 100 triệu, ký HĐMB 10% (08/2026), 4 đợt × 5%, bàn giao 12/2027 65%. Gói vay ân hạn gốc 24 tháng; vay chỉ 10% đến nhận nhà.",
    },
    {
      title: "Khang Điền · Keppel Land — sổ hồng lâu dài",
      text: "Liên minh CĐT uy tín; bàn giao hoàn thiện mặt ngoài, thô bên trong. Masterplan cùng phân khu thấp tầng Foresta (biệt thự) trên quỹ đất 11,8 ha.",
    },
  ];
  landing.amenities = [
    "Hồ bơi Ngân Hà & Ánh Sao ~70 m",
    "Jacuzzi nổi & âm thanh dưới nước",
    "5 công viên chủ đề",
    "Cảnh quan 9 ha ven sông",
    "2 km đường chạy bộ – đạp xe",
    "Sảnh đón 5 sao từng tháp",
    "Concierge 24/7",
    "26 shophouse nội khu",
    "Điện dự phòng 100%",
    "BCA Green Mark Gold",
    "Không gian +1 đa chức năng",
    "Ban công rộng — view sông",
  ];
  landing.faqs = [
    {
      q: "Gladia Heights nằm ở đâu?",
      a: "Tại Võ Chí Công, phường Bình Trưng Đông, TP. Thủ Đức, TP.HCM — kế cận Thủ Thiêm, 3 mặt giáp sông, thuận tiện về Phú Mỹ Hưng và cao tốc Long Thành – Dầu Giày.",
    },
    {
      q: "Gladia Heights có những loại căn hộ nào?",
      a: "639 căn hộ từ 1–4 phòng ngủ (gồm duplex 3–4PN) và 26 shophouse tại 3 tháp cao cấp. Thiết kế cửa kính lớn, ban công rộng, trần cao — view sông và công viên.",
    },
    {
      q: "Giá bán Gladia Heights bao nhiêu?",
      a: "Website tham chiếu chưa công bố bảng giá chi tiết dạng text — có chính sách chiết khấu mở bán tới 12%. Liên hệ HouseX để nhận bảng giá và giỏ căn mới nhất.",
    },
    {
      q: "Chính sách thanh toán Gladia Heights ra sao?",
      a: "Thanh toán chuẩn: chỉ 30% đến khi nhận nhà (cọc 100 triệu + 10% HĐMB + 20% theo tiến độ). Thanh toán nhanh 50% (chiết khấu 9%) hoặc 70% (chiết khấu 12%). Gói vay: 10% đến nhận nhà, ngân hàng hỗ trợ 40→35%, ân hạn gốc & lãi 24 tháng.",
    },
    {
      q: "Gladia Heights bàn giao khi nào?",
      a: "Dự kiến bàn giao tháng 12/2027 theo lịch thanh toán chuẩn; cấp GCN quyền sử dụng đất năm 2028. Ký HĐMB dự kiến 08/2026.",
    },
    {
      q: "Ai vận hành Gladia Heights?",
      a: "Quản lý vận hành bởi Savills theo tiêu chuẩn tương đương Estella Heights — sảnh riêng từng tháp, Concierge 24/7. Chủ đầu tư: Khang Điền & Keppel Land.",
    },
    {
      q: "Gladia Heights có phân khu biệt thự không?",
      a: "Masterplan 11,8 ha gồm phân khu thấp tầng Foresta (biệt thự song lập & đơn lập) bên cạnh 3 tháp căn hộ Gladia Heights. Landing này tập trung tòa cao tầng 639 căn — liên hệ để biết thêm Foresta.",
    },
    {
      q: "Gladia Heights có lợi thế xanh gì?",
      a: "Chứng nhận BCA Green Mark Gold (Singapore); 9 ha cảnh quan, 5 công viên chủ đề, mật độ xây dựng 23,3%, tối ưu đối lưu không khí và ánh sáng tự nhiên.",
    },
  ];
  landing.gallery = [...GLADIA_HEIGHTS_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & chính sách";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá, phương án vay 10% và chiết khấu Gladia Heights — liên hệ HouseX.";
  return landing;
}

export function buildGladiaHeightsMock(): ProjectDetail {
  const landing = buildGladiaHeightsLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 639,
    blocks: 3,
    landing,
  });

  return {
    id: "preview-gladia-heights",
    developerId: "preview-khang-dien-dev",
    slug: GLADIA_HEIGHTS_SLUG,
    name: GLADIA_HEIGHTS_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Bình Trưng Đông",
    address: "Võ Chí Công, Bình Trưng Đông, TP. Thủ Đức",
    lat: 10.803,
    lng: 106.762,
    totalArea: 11.8,
    density: 23.3,
    handoverDate: new Date("2027-12-31"),
    overviewData,
    description:
      "Gladia Heights là dự án căn hộ cao cấp do liên minh Khang Điền và Keppel Land phát triển tại Võ Chí Công, Bình Trưng Đông, TP. Thủ Đức. 3 tháp, 639 căn 1–4PN và 26 shophouse; vận hành Savills; chứng nhận BCA Green Mark Gold. Hơn 60 tiện ích, cảnh quan 9 ha ven sông. Vốn 30% đến nhận nhà, chiết khấu tới 12%. Bàn giao 12/2027.",
    seoTitle: "Gladia Heights Khang Điền — Căn hộ Future-First ven sông",
    seoDesc:
      "Gladia Heights TP. Thủ Đức: 3 tháp 639 căn, Savills, Green Mark Gold, vốn 30%, chiết khấu 12%, bàn giao 12/2027.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-khang-dien-dev",
      name: "Khang Điền · Keppel Land",
      taxCode: "0301450877",
      verified: true,
      logoUrl: GLADIA_HEIGHTS_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-gh-1pn",
        projectId: "preview-gladia-heights",
        name: "Căn 1 phòng ngủ",
        areaMin: 45,
        areaMax: 55,
        bedrooms: 1,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-gh-2pn",
        projectId: "preview-gladia-heights",
        name: "Căn 2 phòng ngủ",
        areaMin: 55,
        areaMax: 75,
        bedrooms: 2,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-gh-3pn",
        projectId: "preview-gladia-heights",
        name: "Căn 3 phòng ngủ",
        areaMin: 80,
        areaMax: 110,
        bedrooms: 3,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-gh-4pn-duplex",
        projectId: "preview-gladia-heights",
        name: "Căn 4PN Duplex",
        areaMin: 120,
        areaMax: 160,
        bedrooms: 4,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-gh-ld1",
        projectId: "preview-gladia-heights",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildGladiaHeightsPreviewListings(): ProjectLandingListingCard[] {
  const imgs = GLADIA_HEIGHTS_IMAGES.gallery;
  return [
    {
      id: "preview-gh-listing-1",
      code: "GH-T1-2PN",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[6].url }],
    },
    {
      id: "preview-gh-listing-2",
      code: "GH-T2-3PN",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[7].url }],
    },
  ];
}

export function buildGladiaHeightsSeedLanding() {
  return buildGladiaHeightsLanding();
}
