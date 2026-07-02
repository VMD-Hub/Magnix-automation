import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { VICTORIA_VILLAGE_IMAGES } from "@/lib/content/victoria-village-images";

const NOW = new Date("2026-06-19T00:00:00.000Z");

/** Giá chuyển nhượng tham chiếu theo victoriavillages.com (2026). */
const PRICE_1PN = 5_300_000_000;
const PRICE_2PN = 6_600_000_000;
const PRICE_3PN = 8_450_000_000;

export const VICTORIA_VILLAGE_NAME = "Victoria Village";
export const VICTORIA_VILLAGE_SLUG = "victoria-village-thanh-my-loi";

function buildVictoriaVillageLanding() {
  const landing = defaultProjectLanding(VICTORIA_VILLAGE_NAME);
  landing.heroSubtitle =
    "Novaland · 4,27 ha Thạnh Mỹ Lợi — 4 tháp 1.044 căn, 92 thấp tầng, công viên 5.000 m², hồ bơi 750 m², bàn giao 5–6/2026";
  landing.heroImage = { ...VICTORIA_VILLAGE_IMAGES.hero };
  landing.locationMapImage = { ...VICTORIA_VILLAGE_IMAGES.locationMap };
  landing.locationNotes = `Victoria Village tọa lạc mặt tiền Đồng Văn Cống, phường Thạnh Mỹ Lợi, TP. Thủ Đức — 4 mặt tiền huyết mạch: Đồng Văn Cống, Trương Văn Bang, Lâm Quang Ky, Nguyễn Mộng Tuân.

Kết nối "tam giác vàng":
• 2 phút: TT hành chính TP. Thủ Đức, BV Phúc An Khang
• 3–5 phút: Thủ Thiêm, Cát Lái, An Phú – Thảo Điền
• 10 phút: Quận 1, Q4, Bình Thạnh, KCN TP.HCM (hầm sông Sài Gòn)
• 15 phút: Phú Mỹ Hưng (Võ Chí Công – Cầu Phú Mỹ)

Hạ tầng 2025–2026: Đồng Văn Cống mở rộng; nút giao Mỹ Thủy (Q3/2026); nút giao An Phú (Q2/2026); cầu Nam Lý thông xe.`;
  landing.highlights = [
    {
      title: "4,27 ha — 1.044 căn & 92 thấp tầng",
      text: "4 tháp 24–25 tầng + 1 hầm 15.500 m²; 92 sản phẩm thấp tầng (27 nhà phố, 49 biệt thự song lập, 16 biệt thự đơn lập). Bố trí 4 tháp chữ U — tránh nắng Tây, view sông.",
    },
    {
      title: "Công viên 5.000 m² & hồ bơi 750 m²",
      text: "Quảng trường công viên trung tâm — lá phổi xanh; hồ bơi vô cực tràn bờ tầng 2 phong cách resort; gym, yoga, BBQ, khu trẻ em.",
    },
    {
      title: "Shophouse & VISAHO — chuẩn Nhật",
      text: "Đại lộ thương mại tầng trệt–2; vận hành VISAHO (tiêu chuẩn Nhật Bản) cùng Novaland — an ninh 24/7, camera, cảnh quan.",
    },
    {
      title: "Căn hộ từ 5,3 tỷ — chuyển nhượng 2026",
      text: "1+1 ~47,5 m² từ 5,3 tỷ; 2PN ~64–67 m² từ 6,6 tỷ; 3PN ~79–82 m² từ 8,45 tỷ (giá tham chiếu rổ chuyển nhượng). Nhà phố từ ~19,5 tỷ.",
    },
    {
      title: "Bàn giao 5–6/2026 — pháp lý rõ",
      text: "Tháp cao tầng đang hoàn thiện mặt ngoài; bàn giao dự kiến tháng 5–6/2026. Sổ hồng lâu dài (VN); người nước ngoài tối đa 50 năm.",
    },
    {
      title: "Novaland · Ricons — Phố Âu thu nhỏ",
      text: "Chủ đầu tư Tập đoàn Novaland; thi công Ricons. Concept \"Phố Âu\" giữa Thạnh Mỹ Lợi — tiện ích 5 sao nội–ngoại khu đồng bộ.",
    },
  ];
  landing.amenities = [
    "Công viên trung tâm 5.000 m²",
    "Hồ bơi vô cực 750 m²",
    "Gym & Yoga chuẩn quốc tế",
    "Khu BBQ ngoài trời",
    "Khu vui chơi trẻ em",
    "Phòng sinh hoạt cộng đồng",
    "Đại lộ shophouse",
    "Quán cà phê nội khu",
    "Hầm xe 15.500 m²",
    "VISAHO quản lý vận hành",
    "An ninh camera 24/7",
    "View sông Sài Gòn",
  ];
  landing.faqs = [
    {
      q: "Victoria Village nằm ở đâu?",
      a: "Mặt tiền Đồng Văn Cống, phường Thạnh Mỹ Lợi, TP. Thủ Đức (Quận 2 cũ) — 4 mặt tiền đường, tam giác vàng Thủ Thiêm – Thạnh Mỹ Lợi – Phú Mỹ Hưng.",
    },
    {
      q: "Victoria Village có những sản phẩm nào?",
      a: "Cao tầng: 1.044 căn 1–3PN (1+1 ~48 m², 2PN 67–73 m², 3PN 88–95 m²). Thấp tầng: 27 nhà phố, 49 biệt thự song lập, 16 biệt thự đơn lập, shophouse.",
    },
    {
      q: "Giá căn hộ Victoria Village bao nhiêu?",
      a: "Rổ chuyển nhượng 2026 (tham chiếu): 1+1 47,5 m² ~5,3 tỷ; 2PN 64,6 m² ~6,6 tỷ; 3PN 81,8 m² ~8,45 tỷ (đã VAT). Giá thay đổi theo tầng, view — liên hệ nhận báo giá cập nhật.",
    },
    {
      q: "Victoria Village bàn giao khi nào?",
      a: "Các tháp cao tầng dự kiến bàn giao từ tháng 5 đến tháng 6/2026. Tiến độ 06/2026: hoàn thiện mặt ngoài 4 tòa tháp.",
    },
    {
      q: "Ai là chủ đầu tư Victoria Village?",
      a: "Tập đoàn Novaland. Đơn vị xây dựng: Ricons. Vận hành: VISAHO (tiêu chuẩn Nhật Bản) và Novaland.",
    },
    {
      q: "Pháp lý Victoria Village ra sao?",
      a: "Người Việt Nam sở hữu lâu dài; người nước ngoài tối đa 50 năm theo luật hiện hành. Sản phẩm thấp tầng chuyển nhượng đã có sổ hồng.",
    },
    {
      q: "Tiện ích nội khu Victoria Village có gì?",
      a: "Công viên 5.000 m², hồ bơi tràn 750 m², gym, yoga, BBQ, khu trẻ em, shophouse; thừa hưởng Phúc An Khang, AIS, Vincom Mega Mall Thảo Điền trong 5–10 phút.",
    },
    {
      q: "Victoria Village có phù hợp đầu tư không?",
      a: "Vị trí 4 mặt tiền Thạnh Mỹ Lợi, hạ tầng 2026 (Mỹ Thủy, An Phú, Đồng Văn Cống) và tiến độ bàn giao gần — cần phân tích dòng tiền cụ thể từng mã căn.",
    },
  ];
  landing.gallery = [...VICTORIA_VILLAGE_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & giỏ căn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn giá chuyển nhượng, nhà phố/biệt thự và lịch bàn giao Victoria Village — liên hệ HouseX.";
  return landing;
}

export function buildVictoriaVillageMock(): ProjectDetail {
  const landing = buildVictoriaVillageLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 1136,
    blocks: 4,
    landing,
  });

  return {
    id: "preview-victoria-village",
    developerId: "preview-novaland-dev",
    slug: VICTORIA_VILLAGE_SLUG,
    name: VICTORIA_VILLAGE_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Thạnh Mỹ Lợi",
    address: "Đồng Văn Cống, Thạnh Mỹ Lợi, TP. Thủ Đức",
    lat: 10.776,
    lng: 106.765,
    totalArea: 4.27,
    density: 35,
    handoverDate: new Date("2026-06-30"),
    overviewData,
    description:
      "Victoria Village là khu đô thị cao cấp do Novaland phát triển tại Đồng Văn Cống, Thạnh Mỹ Lợi, TP. Thủ Đức. Quy mô 4,27 ha: 4 tháp 1.044 căn hộ 1–3PN và 92 sản phẩm thấp tầng. Tiện ích: công viên 5.000 m², hồ bơi 750 m², shophouse; vận hành VISAHO. Giá chuyển nhượng tham chiếu từ ~5,3 tỷ. Bàn giao 5–6/2026.",
    seoTitle: "Victoria Village Thạnh Mỹ Lợi — Căn hộ Novaland từ 5,3 tỷ",
    seoDesc:
      "Victoria Village TP. Thủ Đức: 4 tháp 1.044 căn, công viên 5.000 m², hồ bơi 750 m², bàn giao 6/2026, sổ hồng lâu dài.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-novaland-dev",
      name: "Tập đoàn Novaland",
      taxCode: "0301430819",
      verified: true,
      logoUrl: VICTORIA_VILLAGE_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-vv-1pn",
        projectId: "preview-victoria-village",
        name: "Căn 1+1 (~47,5 m²)",
        areaMin: 48,
        areaMax: 53,
        bedrooms: 1,
        priceFrom: PRICE_1PN,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vv-2pn",
        projectId: "preview-victoria-village",
        name: "Căn 2PN (67–73 m²)",
        areaMin: 64,
        areaMax: 73,
        bedrooms: 2,
        priceFrom: PRICE_2PN,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vv-3pn",
        projectId: "preview-victoria-village",
        name: "Căn 3PN (88–95 m²)",
        areaMin: 79,
        areaMax: 95,
        bedrooms: 3,
        priceFrom: PRICE_3PN,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vv-nha-pho",
        projectId: "preview-victoria-village",
        name: "Nhà phố liền kề (107–110 m² đất)",
        areaMin: 107,
        areaMax: 110,
        bedrooms: 4,
        priceFrom: 19_500_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-vv-ld1",
        projectId: "preview-victoria-village",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildVictoriaVillagePreviewListings(): ProjectLandingListingCard[] {
  const imgs = VICTORIA_VILLAGE_IMAGES.gallery;
  return [
    {
      id: "preview-vv-listing-1",
      code: "VTV.3-1X.01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 5_300_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[6].url }],
    },
    {
      id: "preview-vv-listing-2",
      code: "VTV.1-2X.01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 6_600_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[7].url }],
    },
    {
      id: "preview-vv-listing-3",
      code: "VTV.4-0X.09",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 8_450_000_000,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: imgs[2].url }],
    },
  ];
}

export function buildVictoriaVillageSeedLanding() {
  return buildVictoriaVillageLanding();
}
