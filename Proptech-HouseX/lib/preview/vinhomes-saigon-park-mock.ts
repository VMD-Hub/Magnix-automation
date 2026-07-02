import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { VINHOMES_SAIGON_PARK_IMAGES } from "@/lib/content/vinhomes-saigon-park-images";

const NOW = new Date("2026-06-15T00:00:00.000Z");

/** Giá tham chiếu giai đoạn đầu theo website quảng cáo (6/2026): từ ~5 tỷ/căn. */
const PRICE_FROM = 5_000_000_000;

export const VINHOMES_SAIGON_PARK_NAME = "Vinhomes Saigon Park";
export const VINHOMES_SAIGON_PARK_SLUG = "vinhomes-saigon-park-hoc-mon";

function buildVinhomesSaigonParkLanding() {
  const landing = defaultProjectLanding(VINHOMES_SAIGON_PARK_NAME);
  landing.heroSubtitle =
    "Vinhomes · 1.080 ha đô thị tri thức Tây Bắc TP.HCM — nhà phố 1 trệt 3 lầu từ 5 tỷ, vốn 30%, HTLS 60 tháng, bàn giao dự kiến 12/2027";
  landing.heroImage = { ...VINHOMES_SAIGON_PARK_IMAGES.hero };
  landing.locationMapImage = { ...VINHOMES_SAIGON_PARK_IMAGES.locationMap };
  landing.locationNotes = `Vinhomes Saigon Park tọa lạc tại xã Xuân Thới Sơn, TP. Hồ Chí Minh (khu vực Hóc Môn) — cửa ngõ Tây Bắc TP.HCM, nằm trong vùng đang có nhiều định hướng phát triển hạ tầng liên vùng và tốc độ đô thị hóa cao.

Hạ tầng tăng tốc (2026–2030):
• 2026: Vành đai 3 & Nguyễn Văn Bứa
• 2027: Cao tốc TP.HCM – Mộc Bài
• 2028: Vành đai 4 & Quốc lộ 22
• 2030: Tuyến Metro số 2 (ga dự kiến tại phân khu Ivy Park)

Điểm nổi bật kết nối:
• Thuận tiện về trung tâm TP.HCM và các khu vực lân cận
• Gần các trục giao thông quan trọng khu Tây Bắc
• Hưởng lợi làn sóng dịch chuyển cư dân về các đô thị quy mô lớn, nhiều tiện ích
• Phù hợp an cư lâu dài hoặc đầu tư theo tiến độ hạ tầng`;
  landing.highlights = [
    {
      title: "1.080 ha — đại đô thị công viên tri thức",
      text: "Quy mô siêu lớn tại Tây Bắc TP.HCM với mật độ xây dựng khoảng 25%; định hướng hình thành không gian sống hiện đại kết hợp nhà ở, thương mại, giáo dục và cảnh quan.",
    },
    {
      title: "5 phân khu chủ đề quốc tế",
      text: "Ivy Park (tri thức), Global Park (quốc tế), Laguna Park (biển xanh), Zen Park (thiền), Golf Park (golf 36 hố) — mỗi phân khu có tiện ích biểu tượng riêng.",
    },
    {
      title: "Nhà phố 1 trệt 3 lầu — từ 5 tỷ/căn",
      text: "Diện tích đất 50–80 m²; DTSD tham khảo 144–198 m². Ba dòng: giãn xây, thô tự hoàn thiện, hoàn thiện CĐT — phù hợp mua ở hoặc khai thác cho thuê.",
    },
    {
      title: "Vốn ban đầu 30% — HTLS tới 60 tháng",
      text: "Chính sách giai đoạn đầu: hỗ trợ lãi suất 0% và ân hạn nợ gốc 36–60 tháng; chiết khấu thanh toán sớm tới 23% tùy phương án (cập nhật 15/06/2026).",
    },
    {
      title: "Hệ sinh thái tiện ích all-in-one",
      text: "Vincom Mega Mall, Vinmec 5 sao, Vinschool, VinWonders Ocean Park, Saigon Park Tower 500 m, Global Village 19,3 ha, sân golf Vinpearl Golf Lê Man 200 ha.",
    },
    {
      title: "Đô thị tri thức — quần thể giáo dục 150 ha",
      text: "Định hướng trung tâm giáo dục, nghiên cứu và phát triển; Startup Village, Education Hub, không gian học tập chuẩn quốc tế — tăng giá trị cộng đồng cư dân.",
    },
  ];
  landing.amenities = [
    "Saigon Park Tower 500 m",
    "Ga Metro số 2 (dự kiến)",
    "Vincom Mega Mall",
    "Bệnh viện Vinmec 5 sao",
    "Hệ thống Vinschool",
    "VinWonders Ocean Park 22,7 ha",
    "Botanica Park 27 ha",
    "Sân golf 36 hố",
    "Global Village 19,3 ha",
    "Kiyomi Park 10 ha",
    "70+ công viên nội khu",
    "Làng ẩm thực Châu Âu",
  ];
  landing.faqs = [
    {
      q: "Vinhomes Saigon Park nằm ở đâu?",
      a: "Tại xã Xuân Thới Sơn, TP. Hồ Chí Minh (khu vực Hóc Môn), cửa ngõ Tây Bắc TP.HCM. Dự án thuộc quy hoạch đại đô thị tri thức quy mô 1.080 ha do Tập đoàn Vingroup phát triển.",
    },
    {
      q: "Vinhomes Saigon Park có những loại sản phẩm nào?",
      a: "Nhà phố liền kề 1 trệt 3 lầu (giãn xây, thô tự hoàn thiện, hoàn thiện CĐT), biệt thự song lập/đơn lập, shophouse và căn hộ. Giai đoạn đầu tập trung nhà phố diện tích đất 50–80 m².",
    },
    {
      q: "Giá nhà phố Vinhomes Saigon Park bao nhiêu?",
      a: "Website tham chiếu giá dự kiến từ khoảng 5 tỷ/căn tùy mã căn, diện tích đất và phương án thanh toán. Liên hệ tư vấn để nhận bảng giá và giỏ căn đợt đầu mới nhất.",
    },
    {
      q: "Chính sách thanh toán Vinhomes Saigon Park ra sao?",
      a: "Vốn ban đầu khoảng 30%; thanh toán theo tiến độ; hỗ trợ HTLS 70% trong 18–36 tháng tùy dòng sản phẩm; ân hạn nợ gốc và chiết khấu thanh toán sớm theo chính sách từng thời điểm (cập nhật 15/06/2026).",
    },
    {
      q: "Vinhomes Saigon Park bàn giao khi nào?",
      a: "Thời gian bàn giao dự kiến tháng 12/2027. Tiến độ và lịch thanh toán có thể thay đổi theo từng phân khu — xác nhận khi tư vấn cụ thể từng mã căn.",
    },
    {
      q: "Vinhomes Saigon Park có những phân khu nào?",
      a: "5 phân khu chủ đề: Ivy Park (tri thức), Global Park (quốc tế), Laguna Park (biển xanh), Zen Park (thiền) và Golf Park (golf). Mỗi phân khu có tiện ích và cảm hứng thiết kế riêng.",
    },
    {
      q: "Ai là chủ đầu tư Vinhomes Saigon Park?",
      a: "Chủ đầu tư là Công ty Cổ phần Vinhomes (Tập đoàn Vingroup). Tổng thầu thi công: Công ty Cổ phần Vinhomes. Sở hữu lâu dài với khách Việt Nam, 50 năm với khách nước ngoài.",
    },
    {
      q: "Hạ tầng xung quanh Vinhomes Saigon Park có gì nổi bật?",
      a: "Theo quy hoạch 2026–2030: Vành đai 3 & 4, cao tốc TP.HCM – Mộc Bài, Quốc lộ 22 và Metro số 2. Hạ tầng đi trước — BĐS tăng giá theo sau là định hướng phát triển khu vực.",
    },
  ];
  landing.gallery = [...VINHOMES_SAIGON_PARK_IMAGES.gallery];
  landing.ctaLabel = "Nhận bảng giá & giỏ căn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn bảng giá, phương án dòng tiền và chính sách HTLS Vinhomes Saigon Park — liên hệ HouseX.";
  return landing;
}

export function buildVinhomesSaigonParkMock(): ProjectDetail {
  const landing = buildVinhomesSaigonParkLanding();
  const overviewData = buildOverviewData(null, {
    blocks: 5,
    landing,
  });

  return {
    id: "preview-vinhomes-saigon-park",
    developerId: "preview-vinhomes-dev",
    slug: VINHOMES_SAIGON_PARK_SLUG,
    name: VINHOMES_SAIGON_PARK_NAME,
    projectType: "THUONG_MAI",
    status: "DANG_BAN",
    province: "TP. Hồ Chí Minh",
    district: "Hóc Môn",
    ward: "Xuân Thới Sơn",
    address: "Xã Xuân Thới Sơn, cửa ngõ Tây Bắc TP.HCM",
    lat: 10.884,
    lng: 106.595,
    totalArea: 1080,
    density: 25,
    handoverDate: new Date("2027-12-31"),
    overviewData,
    description:
      "Vinhomes Saigon Park là đại đô thị tri thức quy mô 1.080 ha do Công ty Cổ phần Vinhomes (Vingroup) phát triển tại xã Xuân Thới Sơn, TP.HCM. Dự án gồm 5 phân khu chủ đề quốc tế với hệ sinh thái tiện ích all-in-one: Vincom Mega Mall, Vinmec, Vinschool, VinWonders, sân golf 36 hố và quần thể giáo dục 150 ha. Sản phẩm giai đoạn đầu: nhà phố 1 trệt 3 lầu (giãn xây, thô, hoàn thiện) diện tích đất 50–80 m², giá từ ~5 tỷ/căn. Vốn ban đầu 30%, HTLS tới 60 tháng. Bàn giao dự kiến 12/2027.",
    seoTitle: "Vinhomes Saigon Park Hóc Môn — Nhà phố từ 5 tỷ, HTLS 60 tháng",
    seoDesc:
      "Nhà phố Vinhomes Saigon Park Tây Bắc TP.HCM: 1.080 ha đô thị tri thức, 5 phân khu, vốn 30%, ưu đãi tới 23%, bàn giao 12/2027.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-vinhomes-dev",
      name: "Công ty Cổ phần Vinhomes",
      taxCode: "0102110108",
      verified: true,
      logoUrl: VINHOMES_SAIGON_PARK_IMAGES.developerLogo,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-vsp-gian-xay",
        projectId: "preview-vinhomes-saigon-park",
        name: "Nhà phố giãn xây (50–80 m² đất)",
        areaMin: 50,
        areaMax: 80,
        bedrooms: 4,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vsp-tho",
        projectId: "preview-vinhomes-saigon-park",
        name: "Thô tự hoàn thiện (50–80 m² đất)",
        areaMin: 50,
        areaMax: 80,
        bedrooms: 4,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vsp-hoan-thien",
        projectId: "preview-vinhomes-saigon-park",
        name: "Hoàn thiện CĐT (50–80 m² đất)",
        areaMin: 50,
        areaMax: 80,
        bedrooms: 4,
        priceFrom: PRICE_FROM,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vsp-biet-thu",
        projectId: "preview-vinhomes-saigon-park",
        name: "Biệt thự song lập / đơn lập",
        areaMin: 112,
        areaMax: 200,
        bedrooms: 5,
        priceFrom: 8_000_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-vsp-ld1",
        projectId: "preview-vinhomes-saigon-park",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-vsp-ld2",
        projectId: "preview-vinhomes-saigon-park",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: null,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

export function buildVinhomesSaigonParkPreviewListings(): ProjectLandingListingCard[] {
  const imgs = VINHOMES_SAIGON_PARK_IMAGES.gallery;
  return [
    {
      id: "preview-vsp-listing-1",
      code: "AS82-38",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 5_200_000_000,
      tier: "VIP",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: imgs[5].url }],
    },
    {
      id: "preview-vsp-listing-2",
      code: "TL8-77",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 5_100_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: imgs[6].url }],
    },
    {
      id: "preview-vsp-listing-3",
      code: "TL11-93",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 6_500_000_000,
      tier: "VIP",
      broker: { fullName: "Lê Văn C — CTV HouseX" },
      media: [{ url: imgs[7].url }],
    },
    {
      id: "preview-vsp-listing-4",
      code: "AS70-21",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 5_800_000_000,
      tier: "PREMIUM",
      broker: { fullName: "Phạm Thị D — Môi giới" },
      media: [{ url: imgs[1].url }],
    },
    {
      id: "preview-vsp-listing-5",
      code: "TL-06",
      transactionType: "SALE",
      propertyType: "nha_pho",
      price: 9_500_000_000,
      tier: "VIP",
      broker: { fullName: "Hoàng Văn E — CTV HouseX" },
      media: [{ url: imgs[0].url }],
    },
  ];
}

export function buildVinhomesSaigonParkSeedLanding() {
  return buildVinhomesSaigonParkLanding();
}
