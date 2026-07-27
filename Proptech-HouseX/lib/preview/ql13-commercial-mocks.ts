import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import {
  ASTRAL_CITY_IMAGES,
  AT_SKY_GARDEN_IMAGES,
  EMERALD_68_IMAGES,
  EMERALD_BOULEVARD_IMAGES,
} from "@/lib/content/ql13-commercial-images";

const NOW = new Date("2026-07-27T00:00:00.000Z");

export const EMERALD_68_SLUG = "the-emerald-68-thuan-an";
export const EMERALD_68_NAME = "The Emerald 68";

export const AT_SKY_GARDEN_SLUG = "at-sky-garden-lai-thieu";
export const AT_SKY_GARDEN_NAME = "A&T Sky Garden";

export const ASTRAL_CITY_SLUG = "astral-city-thuan-an";
export const ASTRAL_CITY_NAME = "Astral City";

export const EMERALD_BOULEVARD_SLUG = "the-emerald-boulevard-thuan-an";
export const EMERALD_BOULEVARD_NAME = "The Emerald Boulevard";

export const QL13_COMMERCIAL_SLUGS = [
  EMERALD_68_SLUG,
  AT_SKY_GARDEN_SLUG,
  ASTRAL_CITY_SLUG,
  EMERALD_BOULEVARD_SLUG,
] as const;

type ImgPack = {
  hero: { url: string; alt: string };
  locationMap: { url: string; alt: string; caption: string };
  gallery: readonly { readonly url: string; readonly caption: string }[];
};

function applyCommercialCta(landing: ProjectLanding, projectName: string) {
  landing.ctaLabel = "Nhận bảng giá & tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext = `House X hỗ trợ đối chiếu giỏ căn, tiến độ và phương án tài chính ${projectName} — đăng ký ngay.`;
  return landing;
}

function buildEmerald68Landing(): ProjectLanding {
  const landing = defaultProjectLanding(EMERALD_68_NAME);
  const img = EMERALD_68_IMAGES;
  landing.heroSubtitle =
    "Lê Phong Group · Coteccons — mặt tiền QL13, cửa ngõ Bình Dương giáp Thủ Đức; giá tham chiếu 42–48 triệu/m²; bàn giao ~Q3/2027–2028";
  landing.heroImage = { ...img.hero };
  landing.locationMapImage = { ...img.locationMap };
  landing.locationNotes = `The Emerald 68 (Ngọc Lục Bảo) nằm mặt tiền Quốc lộ 13, phường Vĩnh Phú, Thuận An — sát cổng chào Bình Dương, giáp TP. Thủ Đức.

Điểm kết nối (tham chiếu CĐT / kênh dự án):
• Cửa ngõ gần TP.HCM nhất trên hành lang QL13 đoạn Thuận An
• 3 mặt hướng sông Sài Gòn — phù hợp ở thực và cho chuyên gia thuê
• Hưởng lợi lộ giới QL13 hướng 8 làn và Metro quy hoạch dọc Đại lộ Bình Dương

Nguồn: [theemerald-68.vn](https://theemerald-68.vn/), tổng hợp thị trường 2026.`;
  landing.highlights = [
    {
      title: "Cửa ngõ QL13 — giáp Thủ Đức",
      text: "Vị trí sát cổng chào Bình Dương giúp rút ngắn thời gian về lõi TP.HCM / Thủ Đức so với nhiều dự án sâu hơn về phía Bắc.",
    },
    {
      title: "3 mặt hướng sông Sài Gòn",
      text: "Lợi thế view sông và không khí ven nước — nhóm khách ở thực và chuyên gia thuê thường ưu tiên.",
    },
    {
      title: "Lê Phong · Coteccons",
      text: "Coteccons tham gia với vai trò tổng thầu kiêm đồng phát triển theo công bố kênh dự án — tham chiếu uy tín thi công.",
    },
    {
      title: "Giá tham chiếu 42–48 triệu/m²",
      text: "Mức trần tham khảo thị trường tại thời điểm biên tập — xác nhận bảng giá từng đợt trước khi đặt cọc.",
    },
    {
      title: "Bàn giao ~Q3/2027 hoặc 2028",
      text: "Đang đẩy tiến độ tầng cao; mốc bàn giao theo công bố CĐT — cập nhật theo từng giai.",
    },
  ];
  landing.amenities = [
    "Mặt tiền Quốc lộ 13",
    "View sông Sài Gòn",
    "Tiện ích nội khu cao tầng",
    "Gần sân golf Sông Bé (vùng)",
    "Kết nối Thủ Đức / TP.HCM",
  ];
  landing.faqs = [
    {
      q: "The Emerald 68 nằm ở đâu?",
      a: "Mặt tiền Quốc lộ 13, phường Vĩnh Phú, Thuận An — sát cổng chào Bình Dương, giáp TP. Thủ Đức.",
    },
    {
      q: "Ai là chủ đầu tư The Emerald 68?",
      a: "Lê Phong Group phối hợp Coteccons (tổng thầu kiêm đồng phát triển theo công bố kênh dự án).",
    },
    {
      q: "Giá The Emerald 68 bao nhiêu?",
      a: "Giá trần tham khảo khoảng 42–48 triệu/m². House X hỗ trợ cập nhật bảng giá và giỏ căn — [đăng ký ngay](/lien-he).",
    },
    {
      q: "The Emerald 68 bàn giao khi nào?",
      a: "Tham chiếu công bố CĐT: khoảng Quý 3/2027 hoặc trong năm 2028 — xác nhận theo đợt mở bán.",
    },
  ];
  landing.gallery = img.gallery.map((g) => ({ ...g }));
  return applyCommercialCta(landing, EMERALD_68_NAME);
}

function buildAtSkyGardenLanding(): ProjectLanding {
  const landing = defaultProjectLanding(AT_SKY_GARDEN_NAME);
  const img = AT_SKY_GARDEN_IMAGES;
  landing.heroSubtitle =
    "A&T Group — lõi Lái Thiêu sát Hồ Gươm Xanh; 3 mặt hướng thủy; giá tham chiếu 31–35 triệu/m²; bàn giao ~Q1/2026";
  landing.heroImage = { ...img.hero };
  landing.locationMapImage = { ...img.locationMap };
  landing.locationNotes = `A&T Sky Garden cách mặt tiền Quốc lộ 13 chỉ vài bước chân, ngay lõi trung tâm Lái Thiêu — sát khu đô thị Hồ Gươm Xanh.

Định vị “3 mặt hướng thủy”: sông Sài Gòn, sông Lái Thiêu và hồ cảnh quan Hồ Gươm Xanh (tham chiếu kênh thị trường). Đang thi công phần thân cao tầng; chính sách thanh toán giãn theo từng đợt bung tháp.`;
  landing.highlights = [
    {
      title: "Lõi Lái Thiêu — sát Hồ Gươm Xanh",
      text: "Vị trí trung tâm phường, gần mặt tiền QL13 và tổ hợp đô thị TBS Land.",
    },
    {
      title: "3 mặt hướng thủy",
      text: "Sông Sài Gòn, sông Lái Thiêu và hồ Hồ Gươm Xanh — định vị sinh thái trong lõi đô thị.",
    },
    {
      title: "Giá tham chiếu 31–35 triệu/m²",
      text: "Mức cạnh tranh trong nhóm cao cấp đang mở bán trên trục — xác nhận từng đợt.",
    },
    {
      title: "Bàn giao tham chiếu Q1/2026",
      text: "Theo tổng hợp thị trường tại thời điểm biên tập — đối chiếu tiến độ thực tế trước khi ký.",
    },
  ];
  landing.amenities = [
    "Gần mặt tiền QL13",
    "View thủy / cảnh quan",
    "Thanh toán giãn theo tháp",
    "Tiện ích nội khu",
    "Kết nối lõi Lái Thiêu",
  ];
  landing.faqs = [
    {
      q: "A&T Sky Garden nằm ở đâu?",
      a: "Lõi trung tâm Lái Thiêu, Thuận An — cách mặt tiền Quốc lộ 13 rất gần, sát khu đô thị Hồ Gươm Xanh.",
    },
    {
      q: "Giá A&T Sky Garden bao nhiêu?",
      a: "Giá trần tham khảo khoảng 31–35 triệu/m². [Đăng ký ngay](/lien-he) để nhận bảng giá cập nhật.",
    },
    {
      q: "A&T Sky Garden bàn giao khi nào?",
      a: "Tham chiếu thị trường: khoảng Quý 1/2026 — xác nhận theo tiến độ từng tháp.",
    },
  ];
  landing.gallery = img.gallery.map((g) => ({ ...g }));
  return applyCommercialCta(landing, AT_SKY_GARDEN_NAME);
}

function buildAstralCityLanding(): ProjectLanding {
  const landing = defaultProjectLanding(ASTRAL_CITY_NAME);
  const img = ASTRAL_CITY_IMAGES;
  landing.heroSubtitle =
    "Phát Đạt & Danh Khôi — QL13 Bình Hòa gần Lotte Mart; phức hợp ~3,7 ha; giá tham chiếu 48–55 triệu/m²";
  landing.heroImage = { ...img.hero };
  landing.locationMapImage = { ...img.locationMap };
  landing.locationNotes = `Astral City mặt tiền Quốc lộ 13, phường Bình Hòa, Thuận An — gần Lotte Mart. Sau tái khởi động và cơ cấu lại, dự án đang mở bán các block tháp trung tâm cao cấp còn lại.

Phức hợp thương mại – căn hộ quy mô lớn trên trục (~3,7 ha) với tuyến phố đi bộ mua sắm nội khu dài khoảng 300 m (tham chiếu kênh thị trường).`;
  landing.highlights = [
    {
      title: "Phức hợp ~3,7 ha trên QL13",
      text: "Quy mô lớn nhất nhóm đang mở bán trên trục theo các tổng hợp thị trường gần đây.",
    },
    {
      title: "Phố đi bộ nội khu ~300 m",
      text: "Tuyến mua sắm – đi bộ trong khu hỗ trợ trải nghiệm ở thực và khai thác thương mại.",
    },
    {
      title: "Gần Lotte Mart Bình Hòa",
      text: "Tiện ích ngoại khu sẵn có — siêu thị, dịch vụ hàng ngày trong bán kính ngắn.",
    },
    {
      title: "Giá tham chiếu 48–55 triệu/m²",
      text: "Phân khúc cao hơn nhóm A&T — phù hợp người ưu tiên tiện ích phức hợp và vị trí Lotte.",
    },
  ];
  landing.amenities = [
    "Mặt tiền Quốc lộ 13",
    "Phố đi bộ nội khu",
    "Phức hợp thương mại",
    "Gần Lotte Mart",
    "Tháp cao cấp trung tâm",
  ];
  landing.faqs = [
    {
      q: "Astral City nằm ở đâu?",
      a: "Mặt tiền Quốc lộ 13, phường Bình Hòa, Thuận An — gần Lotte Mart.",
    },
    {
      q: "Ai phát triển Astral City?",
      a: "Phát Đạt và Danh Khôi theo các kênh công bố dự án.",
    },
    {
      q: "Giá Astral City bao nhiêu?",
      a: "Giá trần tham khảo khoảng 48–55 triệu/m². House X hỗ trợ đối chiếu giỏ căn — [đăng ký ngay](/lien-he).",
    },
  ];
  landing.gallery = img.gallery.map((g) => ({ ...g }));
  return applyCommercialCta(landing, ASTRAL_CITY_NAME);
}

function buildEmeraldBoulevardLanding(): ProjectLanding {
  const landing = defaultProjectLanding(EMERALD_BOULEVARD_NAME);
  const img = EMERALD_BOULEVARD_IMAGES;
  landing.heroSubtitle =
    "Lê Phong Group — sắp mở bán; đối diện sân golf Sông Bé 104 ha; giá dự kiến từ ~62 triệu/m²";
  landing.heroImage = { ...img.hero };
  landing.locationMapImage = { ...img.locationMap };
  landing.locationNotes = `The Emerald Boulevard (tên cũ thường nhắc: The Emerald 2) mặt tiền Quốc lộ 13, Thuận An — đoạn đối diện sân golf Sông Bé.

Trạng thái: đang hoàn thiện thủ tục pháp lý cuối để mở bán giai đoạn 1 (tham chiếu thị trường). Định vị hạng sang với tầm nhìn trực diện mảng xanh sân golf ~104 ha. Giá trần dự kiến từ khoảng 62 triệu/m².`;
  landing.highlights = [
    {
      title: "Đối diện sân golf Sông Bé",
      text: "View xanh quy mô lớn — định vị phân khúc hạng sang trên trục QL13.",
    },
    {
      title: "Sắp mở bán giai đoạn 1",
      text: "Đang hoàn thiện pháp lý — nhận đặt chỗ / cập nhật lịch mở bán qua House X.",
    },
    {
      title: "Giá dự kiến từ ~62 triệu/m²",
      text: "Mức tham chiếu thị trường trước mở bán chính thức — chưa phải bảng giá niêm yết cuối.",
    },
  ];
  landing.amenities = [
    "View sân golf Sông Bé",
    "Mặt tiền Quốc lộ 13",
    "Phân khúc hạng sang",
    "Giai đoạn 1 sắp mở bán",
  ];
  landing.faqs = [
    {
      q: "The Emerald Boulevard khác The Emerald 68 chỗ nào?",
      a: "Emerald 68 đang thi công tại Vĩnh Phú (cửa ngõ). Emerald Boulevard (ex Emerald 2) đối diện sân golf Sông Bé, sắp mở bán, định vị giá cao hơn.",
    },
    {
      q: "Khi nào mở bán The Emerald Boulevard?",
      a: "Đang hoàn thiện pháp lý cuối theo tổng hợp thị trường. [Đăng ký ngay](/lien-he) để nhận lịch mở bán giai đoạn 1.",
    },
    {
      q: "Giá The Emerald Boulevard bao nhiêu?",
      a: "Giá trần dự kiến từ khoảng 62 triệu/m² — xác nhận khi CĐT công bố bảng giá chính thức.",
    },
  ];
  landing.gallery = img.gallery.map((g) => ({ ...g }));
  return applyCommercialCta(landing, EMERALD_BOULEVARD_NAME);
}

function asProject(
  opts: {
    id: string;
    slug: string;
    name: string;
    status: "DANG_BAN" | "SAP_MO_BAN";
    district: string;
    ward: string;
    address: string;
    lat: number;
    lng: number;
    totalArea: number | null;
    handoverDate: Date | null;
    description: string;
    seoTitle: string;
    seoDesc: string;
    developerName: string;
    developerId: string;
    landing: ProjectLanding;
    totalUnits?: number;
    blocks?: number;
  },
): ProjectDetail {
  const overviewData = buildOverviewData(null, {
    totalUnits: opts.totalUnits,
    blocks: opts.blocks,
    landing: opts.landing,
  });
  return {
    id: opts.id,
    developerId: opts.developerId,
    slug: opts.slug,
    name: opts.name,
    projectType: "THUONG_MAI",
    status: opts.status,
    province: "Bình Dương",
    district: opts.district,
    ward: opts.ward,
    address: opts.address,
    lat: opts.lat,
    lng: opts.lng,
    totalArea: opts.totalArea,
    density: null,
    handoverDate: opts.handoverDate,
    overviewData,
    description: opts.description,
    seoTitle: opts.seoTitle,
    seoDesc: opts.seoDesc,
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: opts.developerId,
      name: opts.developerName,
      taxCode: null,
      verified: true,
      logoUrl: null,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: `${opts.id}-2pn`,
        projectId: opts.id,
        name: "Căn 2 phòng ngủ",
        areaMin: 55,
        areaMax: 75,
        bedrooms: 2,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: `${opts.id}-3pn`,
        projectId: opts.id,
        name: "Căn 3 phòng ngủ",
        areaMin: 80,
        areaMax: 100,
        bedrooms: 3,
        priceFrom: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: `${opts.id}-ld1`,
        projectId: opts.id,
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildEmerald68Mock(): ProjectDetail {
  return asProject({
    id: "preview-emerald-68",
    slug: EMERALD_68_SLUG,
    name: EMERALD_68_NAME,
    status: "DANG_BAN",
    district: "Thuận An",
    ward: "Vĩnh Phú",
    address: "Quốc lộ 13, Vĩnh Phú, Thuận An, Bình Dương",
    lat: 10.905,
    lng: 106.705,
    totalArea: null,
    handoverDate: new Date("2027-09-30"),
    description:
      "The Emerald 68 (Ngọc Lục Bảo) — Lê Phong Group & Coteccons, mặt tiền QL13 Vĩnh Phú sát cổng chào Bình Dương. Giá tham chiếu 42–48 triệu/m²; bàn giao ~Q3/2027–2028.",
    seoTitle: "The Emerald 68 Thuận An — Căn hộ QL13 cửa ngõ Bình Dương",
    seoDesc:
      "Emerald 68: Lê Phong · Coteccons, QL13 Vĩnh Phú, view sông, giá 42–48 tr/m², bàn giao ~2027–2028.",
    developerName: "Lê Phong Group · Coteccons",
    developerId: "preview-le-phong-dev",
    landing: buildEmerald68Landing(),
  });
}

export function buildAtSkyGardenMock(): ProjectDetail {
  return asProject({
    id: "preview-at-sky-garden",
    slug: AT_SKY_GARDEN_SLUG,
    name: AT_SKY_GARDEN_NAME,
    status: "DANG_BAN",
    district: "Thuận An",
    ward: "Lái Thiêu",
    address: "Lõi Lái Thiêu, gần Quốc lộ 13, Thuận An, Bình Dương",
    lat: 10.912,
    lng: 106.712,
    totalArea: null,
    handoverDate: new Date("2026-03-31"),
    description:
      "A&T Sky Garden — A&T Group tại lõi Lái Thiêu sát Hồ Gươm Xanh. 3 mặt hướng thủy; giá tham chiếu 31–35 triệu/m²; bàn giao ~Q1/2026.",
    seoTitle: "A&T Sky Garden Lái Thiêu — Căn hộ 3 mặt hướng thủy",
    seoDesc:
      "A&T Sky Garden: lõi Lái Thiêu sát Hồ Gươm Xanh, giá 31–35 tr/m², bàn giao ~Q1/2026.",
    developerName: "A&T Group",
    developerId: "preview-at-group-dev",
    landing: buildAtSkyGardenLanding(),
  });
}

export function buildAstralCityMock(): ProjectDetail {
  return asProject({
    id: "preview-astral-city",
    slug: ASTRAL_CITY_SLUG,
    name: ASTRAL_CITY_NAME,
    status: "DANG_BAN",
    district: "Thuận An",
    ward: "Bình Hòa",
    address: "Quốc lộ 13, Bình Hòa, Thuận An, Bình Dương",
    lat: 10.895,
    lng: 106.702,
    totalArea: 3.7,
    handoverDate: null,
    description:
      "Astral City — Phát Đạt & Danh Khôi, mặt tiền QL13 Bình Hòa gần Lotte Mart. Phức hợp ~3,7 ha; giá tham chiếu 48–55 triệu/m².",
    seoTitle: "Astral City Thuận An — Phức hợp căn hộ QL13 gần Lotte",
    seoDesc:
      "Astral City: Phát Đạt · Danh Khôi, ~3,7 ha, phố đi bộ 300 m, giá 48–55 tr/m².",
    developerName: "Phát Đạt · Danh Khôi",
    developerId: "preview-phat-dat-astral-dev",
    landing: buildAstralCityLanding(),
    totalUnits: undefined,
    blocks: undefined,
  });
}

export function buildEmeraldBoulevardMock(): ProjectDetail {
  return asProject({
    id: "preview-emerald-boulevard",
    slug: EMERALD_BOULEVARD_SLUG,
    name: EMERALD_BOULEVARD_NAME,
    status: "SAP_MO_BAN",
    district: "Thuận An",
    ward: "Lái Thiêu",
    address: "Quốc lộ 13, đối diện sân golf Sông Bé, Thuận An",
    lat: 10.918,
    lng: 106.708,
    totalArea: null,
    handoverDate: null,
    description:
      "The Emerald Boulevard (ex Emerald 2) — Lê Phong Group, sắp mở bán. Đối diện sân golf Sông Bé; giá dự kiến từ ~62 triệu/m².",
    seoTitle: "The Emerald Boulevard — Sắp mở bán view sân golf Sông Bé",
    seoDesc:
      "Emerald Boulevard Thuận An: Lê Phong, đối diện sân golf Sông Bé, giá dự kiến từ 62 tr/m², sắp mở bán GĐ1.",
    developerName: "Lê Phong Group",
    developerId: "preview-le-phong-dev",
    landing: buildEmeraldBoulevardLanding(),
  });
}

function previewListings(
  idPrefix: string,
  imgs: readonly { readonly url: string; readonly caption: string }[],
): ProjectLandingListingCard[] {
  return [
    {
      id: `${idPrefix}-l1`,
      code: `${idPrefix.toUpperCase()}-2PN`,
      transactionType: "SALE",
      propertyType: "can_ho",
      price: null,
      tier: "VIP",
      broker: { fullName: "Tư vấn House X" },
      media: [{ url: imgs[0]!.url }],
    },
  ];
}

export function buildEmerald68PreviewListings() {
  return previewListings("e68", EMERALD_68_IMAGES.gallery);
}
export function buildAtSkyGardenPreviewListings() {
  return previewListings("atsg", AT_SKY_GARDEN_IMAGES.gallery);
}
export function buildAstralCityPreviewListings() {
  return previewListings("astral", ASTRAL_CITY_IMAGES.gallery);
}
export function buildEmeraldBoulevardPreviewListings() {
  return previewListings("ebd", EMERALD_BOULEVARD_IMAGES.gallery);
}

export function buildEmerald68SeedLanding() {
  return buildEmerald68Landing();
}
export function buildAtSkyGardenSeedLanding() {
  return buildAtSkyGardenLanding();
}
export function buildAstralCitySeedLanding() {
  return buildAstralCityLanding();
}
export function buildEmeraldBoulevardSeedLanding() {
  return buildEmeraldBoulevardLanding();
}
