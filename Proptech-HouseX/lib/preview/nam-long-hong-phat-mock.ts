import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { NAM_LONG_HP_IMAGES } from "@/lib/content/nam-long-hong-phat-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

export const NLHP_PROJECT_NAME = "Nhà ở xã hội Nam Long – Hồng Phát";
export const NLHP_COMMERCIAL_NAME = "Chung cư Nam Long – Hồng Phát";
export const NLHP_PROJECT_SLUG = "nha-o-xa-hoi-nam-long-hong-phat-can-tho";

function buildNamLongHongPhatLanding() {
  const landing = defaultProjectLanding(NLHP_PROJECT_NAME);
  landing.heroSubtitle =
    "Chung cư Nam Long – Hồng Phát · KDC lô 8C Cái Răng — 187 căn, 7 tầng, 35–70 m², bàn giao 2020, chuyển nhượng ~800 tr – 1,2 tỷ";
  landing.heroImage = { ...NAM_LONG_HP_IMAGES.hero };
  landing.locationMapImage = { ...NAM_LONG_HP_IMAGES.locationMap };
  landing.locationNotes = `Nhà ở xã hội Nam Long – Hồng Phát (Chung cư Nam Long – Hồng Phát) tọa lạc đường số 2 & 4, Khu dân cư Nam Long lô 8C, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ — thuộc tổng thể quy hoạch khu đô thị Nam Cần Thơ (KDC lô 8C ~15,4 ha).

Theo Giấy phép xây dựng số 50/GPXD (12/9/2019) của Sở Xây dựng TP. Cần Thơ: thửa đất số 2452, tờ bản đồ số 7; khối nhà 1 trệt + 5 lầu + mái che (7 tầng), tổng diện tích khu đất 3.800 m².

Kết nối vùng:
• Trần Hoàng Na, Lê Trọng Tấn, Quốc lộ 1A, đường 14B
• Cùng hệ sinh thái Nam Long tại Cần Thơ (Nam Long 1, Nam Long 2 lô 9A)

Dự án NOXH đầu tiên tại Cần Thơ (2019), khởi công 9/2019, bàn giao 2020. CĐT: Công ty Cổ phần Nam Long – Hồng Phát — dòng sản phẩm Ehome.`;
  landing.highlights = [
    {
      title: "187 căn — 7 tầng, NOXH + thương mại",
      text: "Tổng 187 căn hộ (~80% NOXH, ~20% thương mại). 3 thang máy; diện tích sàn công trình chính ~9.640 m² theo GPXD.",
    },
    {
      title: "Giá chuyển nhượng ~800 tr – 1,2 tỷ (2026)",
      text: "Thị trường thứ cấp tham chiếu 800 triệu – 1,2 tỷ/căn tùy diện tích và vị trí. Giá gốc NOXH ban đầu theo thẩm định Sở Xây dựng Cần Thơ.",
    },
    {
      title: "Layout 35 – 70 m² (Ehome)",
      text: "Căn tiêu chuẩn ~39–41 m²; mỗi tầng có căn góc ~68–70 m². Phù hợp cặp vợ chồng trẻ, công nhân và đối tượng NOXH.",
    },
    {
      title: "Đã bàn giao 2020 — an cư ngay",
      text: "Dự án hoàn thành và đưa vào sử dụng năm 2020; cư dân đã sinh sống ổn định, pháp lý sổ hồng theo quy định NOXH.",
    },
    {
      title: "Tiện ích nội khu đầy đủ",
      text: "Câu lạc bộ, bãi đậu xe, công viên lớn, sân chơi trẻ em — trong KDC Nam Long lô 8C quy hoạch đồng bộ.",
    },
    {
      title: "Nam Long – Hồng Phát — NOXH đầu tiên Cần Thơ",
      text: "Liên doanh Nam Long Group tại thị trường Cần Thơ; tiền thân của hệ sinh thái Ehome/Nam Long tại miền Tây.",
    },
  ];
  landing.amenities = [
    "Câu lạc bộ cư dân",
    "Bãi đậu xe",
    "Công viên nội khu",
    "Sân chơi trẻ em",
    "3 thang máy",
    "Shophouse / TMDV tầng trệt",
    "An ninh khu dân cư",
    "Hạ tầng KDC Nam Long lô 8C",
  ];
  landing.faqs = [
    {
      q: "Nhà ở xã hội Nam Long – Hồng Phát nằm ở đâu?",
      a: "Đường số 2 & 4, KDC Nam Long lô 8C, phường Hưng Thạnh, quận Cái Răng, TP. Cần Thơ — trong quy hoạch khu đô thị Nam Cần Thơ.",
    },
    {
      q: "Chung cư Nam Long – Hồng Phát có phải nhà ở xã hội Nam Long – Hồng Phát không?",
      a: "Đúng. Chung cư Nam Long – Hồng Phát là tên gọi thương mại; dự án gồm NOXH và ~20% căn thương mại do Công ty CP Nam Long – Hồng Phát phát triển.",
    },
    {
      q: "Giá chung cư Nam Long – Hồng Phát bao nhiêu?",
      a: "Giá chuyển nhượng tham chiếu 2026 khoảng 800 triệu – 1,2 tỷ/căn (35–70 m²). Giá gốc NOXH khi mua đợt đầu theo giá thẩm định Sở Xây dựng TP. Cần Thơ — liên hệ tư vấn để cập nhật giỏ hàng thứ cấp.",
    },
    {
      q: "Dự án có những loại căn hộ nào?",
      a: "Diện tích 35–70 m²: căn tiêu chuẩn ~39–41 m² (1–2 phòng ngủ); căn góc mỗi tầng ~68–70 m². Tổng 187 căn trên 7 tầng.",
    },
    {
      q: "Nam Long – Hồng Phát bàn giao khi nào?",
      a: "Khởi công tháng 9/2019, hoàn thành và bàn giao năm 2020. Dự án đã đi vào vận hành ổn định.",
    },
    {
      q: "Pháp lý dự án Nam Long – Hồng Phát thế nào?",
      a: "Sở Xây dựng TP. Cần Thơ cấp GPXD số 50/GPXD ngày 12/9/2019. Đối tượng mua NOXH theo Nghị định 100/NĐ-CP (thời điểm triển khai); giá bán theo thẩm định Sở Xây dựng.",
    },
    {
      q: "Ai được mua nhà ở xã hội Nam Long – Hồng Phát?",
      a: "Đối tượng thu nhập thấp, công nhân, CBCCVC và các nhóm NOXH theo Luật Nhà ở. Hiện dự án đã bàn giao — chủ yếu giao dịch chuyển nhượng trên thị trường thứ cấp (cần đáp ứng điều kiện chuyển nhượng NOXH).",
    },
    {
      q: "Nam Long – Hồng Phát khác Nam Long 2 thế nào?",
      a: "Nam Long – Hồng Phát (lô 8C) là dự án 7 tầng 187 căn, bàn giao 2020. Nam Long 2 (lô 9A) là quần thể lớn hơn (~1.601 căn) tại Hưng Thạnh — đang mở bán giai đoạn 2.",
    },
  ];
  landing.gallery = [...NAM_LONG_HP_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn căn chuyển nhượng, pháp lý NOXH và giá thị trường — liên hệ HouseX.";
  return landing;
}

export function buildNamLongHongPhatMock(): ProjectDetail {
  const landing = buildNamLongHongPhatLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 187,
    blocks: 1,
    landing,
  });

  return {
    id: "preview-nam-long-hp",
    developerId: "preview-nam-long-hp-dev",
    slug: NLHP_PROJECT_SLUG,
    name: NLHP_PROJECT_NAME,
    projectType: "NHA_O_XA_HOI",
    status: "DA_BAN_GIAO",
    province: "TP. Cần Thơ",
    district: "Cái Răng",
    ward: "Hưng Thạnh",
    address: "Đường số 2 & 4, KDC Nam Long lô 8C",
    lat: 10.0345,
    lng: 105.7842,
    totalArea: 3.8,
    density: null,
    handoverDate: new Date("2020-12-31"),
    overviewData,
    description:
      "Nhà ở xã hội Nam Long – Hồng Phát (Chung cư Nam Long – Hồng Phát) do Công ty CP Nam Long – Hồng Phát phát triển tại KDC lô 8C, Cái Răng, Cần Thơ. Quy mô 187 căn, 7 tầng, diện tích 35–70 m², dòng Ehome. Bàn giao 2020; giá chuyển nhượng tham chiếu 800 triệu – 1,2 tỷ.",
    seoTitle: "Nhà ở xã hội Nam Long – Hồng Phát Cần Thơ — Giá ~800 tr – 1,2 tỷ",
    seoDesc:
      "NOXH Nam Long – Hồng Phát Cái Răng: 187 căn, 7 tầng, 35–70 m², bàn giao 2020. Chuyển nhượng ~800 tr – 1,2 tỷ. Ehome Nam Long Cần Thơ.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-nam-long-hp-dev",
      name: "Công ty Cổ phần Nam Long – Hồng Phát",
      taxCode: "1801234567",
      verified: true,
      logoUrl: NAM_LONG_HP_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-nlhp-std",
        projectId: "preview-nam-long-hp",
        name: "Căn tiêu chuẩn (~39–41 m²)",
        areaMin: 39,
        areaMax: 41,
        bedrooms: 1,
        priceFrom: 800_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nlhp-mid",
        projectId: "preview-nam-long-hp",
        name: "Căn 2PN (~44–57 m²)",
        areaMin: 44,
        areaMax: 57,
        bedrooms: 2,
        priceFrom: 950_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nlhp-corner",
        projectId: "preview-nam-long-hp",
        name: "Căn góc (~68–70 m²)",
        areaMin: 68,
        areaMax: 70,
        bedrooms: 2,
        priceFrom: 1_200_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-nlhp-ld1",
        projectId: "preview-nam-long-hp",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2019-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nlhp-ld2",
        projectId: "preview-nam-long-hp",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2019-09-12"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-nlhp-ld3",
        projectId: "preview-nam-long-hp",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildNamLongHongPhatPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-nlhp-listing-1",
      code: "NOX-NLHPPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 820_000_000,
      tier: "FREE",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: NAM_LONG_HP_IMAGES.gallery[2].url }],
    },
    {
      id: "preview-nlhp-listing-2",
      code: "NOX-NLHPPRE02",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 1_150_000_000,
      tier: "VIP",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: NAM_LONG_HP_IMAGES.gallery[0].url }],
    },
  ];
}

export function buildNamLongHongPhatSeedLanding() {
  return buildNamLongHongPhatLanding();
}
