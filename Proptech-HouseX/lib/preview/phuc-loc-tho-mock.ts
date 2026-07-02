import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { PHUC_LOC_THO_PUBLISHED_IMAGES } from "@/lib/content/phuc-loc-tho-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

/** Giá bình quân công bố ~35,35 triệu/m² (đã VAT, chưa phí bảo trì 2%) — VnExpress/UBND TP.HCM. */
const PRICE_PER_SQM = 35_349_299;

function buildPhucLocThoLanding() {
  const landing = defaultProjectLanding("Chung cư Phúc Lộc Thọ");
  landing.heroSubtitle =
    "NOXH Block C — 140 căn tại 35 Lê Văn Chí, Linh Xuân · giá ~35,3 triệu/m² · diện tích 40–75 m² · căn từ ~1,4 tỷ";
  landing.heroImage = { ...PHUC_LOC_THO_PUBLISHED_IMAGES.hero };
  landing.locationMapImage = { ...PHUC_LOC_THO_PUBLISHED_IMAGES.locationMap };
  landing.locationNotes = `Chung cư Phúc Lộc Thọ (tên thương mại từng giao dịch: Emerald Apartment) tại số 35 Lê Văn Chí, phường Linh Xuân (trước đây Linh Trung), TP. Thủ Đức — ngay khu vực ngã tư Thủ Đức, mặt tiền đường Lê Văn Chí rộng ~30 m.

Kết nối giao thông (tham khảo tư liệu dự án):
• Cách ngã tư Thủ Đức ~400 m · trung tâm quận Thủ Đức ~300 m
• Gần Xa lộ Hà Nội, Xa lộ Xuyên Á, vành đai ngoài ~1 km
• ~25 phút tới trung tâm TP.HCM · gần tuyến metro (ga số 12)

Tiện ích ngoại khu: BV Đa khoa Thủ Đức, Co.op Mart Xa Lộ Hà Nội, trường TH Hoàng Diệu, THCS Bình Thọ, ĐH Sư phạm Kỹ thuật, ĐH Quốc gia TP.HCM, KCN Linh Trung, Khu CNC Quận 9.

Phân khu NOXH được quy hoạch tại Block C theo phê duyệt UBND TP.HCM (Quyết định điều chỉnh cơ cấu căn hộ, chuyển một phần sang nhà ở xã hội).`;
  landing.highlights = [
    {
      title: "140 căn NOXH Block C — UBND TP.HCM phê duyệt",
      text: "Theo công bố giá sau thẩm tra: 140 căn nhà ở xã hội tại Block C, diện tích 40–75 m², thuộc chung cư cao tầng số 35 Lê Văn Chí.",
    },
    {
      title: "Giá ~35,3 triệu/m² (đã VAT)",
      text: "Giá bán bình quân 35.349.299 đồng/m², đã gồm VAT, chưa gồm 2% phí bảo trì và hệ số điều chỉnh theo vị trí căn (theo VnExpress/UBND TP.HCM).",
    },
    {
      title: "Giá căn từ ~1,4 đến ~2,65 tỷ",
      text: "Ước tính theo diện tích NOXH 40–75 m²; phù hợp an cư nội thành phía Đông TP.HCM so với căn thương mại xung quanh.",
    },
    {
      title: "Vị trí ngã tư Thủ Đức — Lê Văn Chí",
      text: "Mặt tiền Lê Văn Chí, khu dân cư hiện hữu, thuận tiện KCN Linh Trung, ĐH Quốc gia và các trục Xa lộ Hà Nội — Xuyên Á.",
    },
    {
      title: "3 block cao 16 tầng — quy mô 452 căn",
      text: "Khu đất 8.637 m², mật độ xây dựng 39%; Block A 202 căn, Block B 125 căn, Block C 125 căn (trong đó 140 căn NOXH theo phê duyệt).",
    },
    {
      title: "CĐT Phúc Lộc Thọ — thi công Tabudec",
      text: "Chủ đầu tư Công ty TNHH Phúc Lộc Thọ; thi công Tổng công ty Tabudec; thầu chính Phát Hưng (theo tư liệu công khai dự án).",
    },
  ];
  landing.amenities = [
    "Trung tâm thương mại tầng thấp",
    "Công viên cây xanh nội khu",
    "Trường mầm non",
    "Bãi đậu xe",
    "An ninh 24/7",
    "Thang máy",
    "Phòng sinh hoạt cộng đồng",
    "Hệ thống PCCC",
    "Internet & truyền hình cáp",
    "Gym & spa (theo tư liệu dự án)",
    "Khu BBQ",
    "Sân chơi trẻ em",
  ];
  landing.faqs = [
    {
      q: "Chung cư Phúc Lộc Thọ có phải nhà ở xã hội không?",
      a: "Dự án gốc là chung cư cao tầng Phúc Lộc Thọ (Emerald Apartment). Một phần Block C đã được UBND TP.HCM phê duyệt chuyển sang nhà ở xã hội — 140 căn NOXH đang được Công ty TNHH Phúc Lộc Thọ công bố giá bán.",
    },
    {
      q: "Giá NOXH Phúc Lộc Thọ bao nhiêu?",
      a: "Giá bán bình quân ~35,3 triệu/m² (đã VAT, chưa 2% phí bảo trì). Căn NOXH 40–75 m² ước tính ~1,4–2,65 tỷ, chưa gồm phí quản lý và hệ số điều chỉnh vị trí.",
    },
    {
      q: "Ai được mua NOXH tại Block C?",
      a: "Người thuộc các nhóm đối tượng NOXH theo Luật Nhà ở 27/2023/QH15 (công nhân KCN, người thu nhập thấp tại đô thị, CBCCVC, hộ nghèo/cận nghèo…). Liên hệ tư vấn để kiểm tra điều kiện cụ thể tại TP.HCM.",
    },
    {
      q: "NOXH Block C nằm ở đâu trong dự án?",
      a: "Block C thuộc chung cư cao tầng số 35 Lê Văn Chí, phường Linh Xuân, TP. Thủ Đức. Dự án có 3 block A, B, C cao 16 tầng trên khu đất 8.637 m².",
    },
    {
      q: "Phúc Lộc Thọ khác Emerald Apartment thế nào?",
      a: "Emerald Apartment là tên thương mại từng giao dịch trên thị trường cho cùng dự án tại 35 Lê Văn Chí do Công ty TNHH Phúc Lộc Thọ làm chủ đầu tư. Phần NOXH là Block C theo quyết định điều chỉnh của UBND TP.HCM.",
    },
    {
      q: "Dự án đã bàn giao chưa?",
      a: "Chung cư Phúc Lộc Thọ (Emerald) đã hoàn thiện và bàn giao từ trước (khoảng 2013). Phần NOXH Block C là cơ cấu căn hộ được chuyển đổi theo chính sách — liên hệ tư vấn để biết tiến độ mở bán và thủ tục mua NOXH.",
    },
  ];
  landing.gallery = [...PHUC_LOC_THO_PUBLISHED_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";
  return landing;
}

export function buildPhucLocThoMock(): ProjectDetail {
  const landing = buildPhucLocThoLanding();
  const overviewData = buildOverviewData(null, {
    totalUnits: 140,
    blocks: 1,
    landing,
  });

  return {
    id: "preview-phuc-loc-tho",
    developerId: "preview-phuc-loc-tho-dev",
    slug: "chung-cu-phuc-loc-tho-noxh",
    name: "Chung cư Phúc Lộc Thọ — NOXH Block C",
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    ward: "Linh Xuân",
    address: "35 Lê Văn Chí, phường Linh Xuân",
    lat: 10.8628,
    lng: 106.7625,
    totalArea: 0.8637,
    density: 39,
    handoverDate: null,
    overviewData,
    description:
      "Chung cư Phúc Lộc Thọ tại 35 Lê Văn Chí, phường Linh Xuân, TP. Thủ Đức do Công ty TNHH Phúc Lộc Thọ làm chủ đầu tư. UBND TP.HCM phê duyệt 140 căn nhà ở xã hội tại Block C; giá bình quân ~35,3 triệu/m² (đã VAT); diện tích 40–75 m²; giá căn ~1,4–2,65 tỷ. Dự án 3 block 16 tầng trên 8.637 m², mật độ 39%.",
    seoTitle: "Chung cư Phúc Lộc Thọ NOXH — Block C từ ~1,4 tỷ",
    seoDesc:
      "NOXH Phúc Lộc Thọ Block C, 35 Lê Văn Chí Thủ Đức: 140 căn, giá ~35,3 triệu/m², 40–75m². CĐT Phúc Lộc Thọ.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-phuc-loc-tho-dev",
      name: "Công ty TNHH Phúc Lộc Thọ",
      taxCode: "0318000001",
      verified: true,
      logoUrl: PHUC_LOC_THO_PUBLISHED_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-plt-40",
        projectId: "preview-phuc-loc-tho",
        name: "NOXH ~40 m²",
        areaMin: 40,
        areaMax: 45,
        bedrooms: 1,
        priceFrom: Math.round(40 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-plt-55",
        projectId: "preview-phuc-loc-tho",
        name: "NOXH ~55 m²",
        areaMin: 50,
        areaMax: 58,
        bedrooms: 2,
        priceFrom: Math.round(55 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-plt-75",
        projectId: "preview-phuc-loc-tho",
        name: "NOXH ~75 m²",
        areaMin: 68,
        areaMax: 75,
        bedrooms: 2,
        priceFrom: Math.round(75 * PRICE_PER_SQM),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-plt-ld-1",
        projectId: "preview-phuc-loc-tho",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2024-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-plt-ld-2",
        projectId: "preview-phuc-loc-tho",
        docType: "giay_phep_xay_dung",
        status: "da_co",
        issuedDate: new Date("2010-01-01"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildPhucLocThoPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-plt-l1",
      code: "MX-PLTPRE01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: Math.round(55 * PRICE_PER_SQM),
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: PHUC_LOC_THO_PUBLISHED_IMAGES.gallery[1].url }],
    },
  ];
}

/** Dùng chung cho prisma seed. */
export function buildPhucLocThoSeedLanding() {
  return buildPhucLocThoLanding();
}
