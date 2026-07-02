import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
} from "@/lib/content/project-landing";
import { DTA_HAPPY_HOME_DEMO_IMAGES } from "@/lib/content/project-landing-demo-images";

const NOW = new Date("2026-03-29T00:00:00.000Z");

/** Mock DTA Happy Home — cùng nội dung seed, dùng cho `/preview` không cần Postgres. */
export function buildDtaHappyHomeMock(): ProjectDetail {
  const landing = defaultProjectLanding("DTA Happy Home Nhơn Trạch");
  landing.heroSubtitle =
    "Khu căn hộ NOXH trong DTA City — 2.192 căn, tiện ích nội khu đầy đủ, giá từ 448 triệu, hỗ trợ vay ngân hàng liên kết";
  landing.heroImage = { ...DTA_HAPPY_HOME_DEMO_IMAGES.hero };
  landing.locationMapImage = { ...DTA_HAPPY_HOME_DEMO_IMAGES.locationMap };
  landing.locationNotes = `DTA Happy Home nằm trong Khu đô thị DTA City, mặt tiền đường Nguyễn Văn Cừ, xã Phước An, huyện Nhơn Trạch — cửa ngõ khu công nghiệp Nhơn Trạch – Đồng Nai, thuận tiện cho công nhân và người lao động an cư gần nơi làm việc.

Kết nối giao thông:
• Cao tốc Biên Hòa – Vũng Tàu: khoảng 10 phút
• Quốc lộ 51: khoảng 15 phút
• Đường 25C (Nguyễn Ái Quốc) → Sân bay Long Thành: khoảng 20 phút
• Hướng TP.HCM (Quận 2): khoảng 40 phút

Tiện ích ngoại khu DTA City: chợ truyền thống DTA, Bệnh viện Đa khoa Quốc tế DTA, Trường Mầm non & Tiểu học Quốc tế DTA.`;
  landing.highlights = [
    {
      title: "NOXH đúng chính sách — sổ hồng lâu dài",
      text: "Dự án nhà ở xã hội trong DTA City, phục vụ công nhân KCN và các nhóm đối tượng theo Luật Nhà ở. Căn 30–52 m², thiết kế tối ưu cho gia đình trẻ.",
    },
    {
      title: "Giá từ 448 triệu — vay tới 70%",
      text: "Giá 448–700 triệu/căn; vốn tự có từ 30%, vay tối đa 70%, thời hạn tối đa 20 năm theo chính sách ngân hàng liên kết.",
    },
    {
      title: "Tiện ích nội khu + hệ sinh thái DTA",
      text: "TTTM 4 tầng, nhà trẻ, SH cộng đồng, công viên, 2 thang máy/tòa, an ninh 24/7, nhà xe 3 tầng; ngoại khu có BV, trường học, chợ DTA.",
    },
    {
      title: "2.192 căn — bàn giao từng giai đoạn",
      text: "16 block cao 5 tầng; đã bàn giao 4 block (560 căn), tiếp tục triển khai thêm khoảng 1.600 căn.",
    },
    {
      title: "Gần khu công nghiệp Nhơn Trạch",
      text: "Phù hợp an cư gần nơi làm việc, giảm chi phí đi lại so với thuê trọ dài hạn.",
    },
  ];
  landing.amenities = [
    "Trung tâm thương mại 4 tầng",
    "Nhà trẻ",
    "Phòng sinh hoạt cộng đồng",
    "Công viên cây xanh",
    "Khu vui chơi trẻ em",
    "2 thang máy/tòa",
    "An ninh 24/7",
    "Nhà xe cao 3 tầng",
    "Chợ truyền thống DTA",
    "Bệnh viện Quốc tế DTA",
    "Trường Mầm non & Tiểu học Quốc tế DTA",
  ];
  landing.faqs = [
    {
      q: "DTA Happy Home có phải nhà ở xã hội không?",
      a: "Đúng. Happy Home là dự án nhà ở xã hội thuộc Khu đô thị DTA City do Công ty Cổ phần Đệ Tam làm chủ đầu tư, dành cho công nhân KCN, người thu nhập thấp và các nhóm đối tượng theo Luật Nhà ở.",
    },
    {
      q: "Ai được mua DTA Happy Home?",
      a: "Người thuộc các nhóm đối tượng NOXH theo quy định (công nhân trong/ngoài KCN, người thu nhập thấp tại đô thị, hộ nghèo/cận nghèo, CBCCVC…). Mỗi hộ/cá nhân chỉ đăng ký một dự án NOXH.",
    },
    {
      q: "Giá DTA Happy Home bao nhiêu?",
      a: "Giá bán khoảng 448–700 triệu/căn tùy diện tích. Liên hệ tư vấn để nhận bảng giá và chính sách thanh toán mới nhất theo block đang mở bán.",
    },
    {
      q: "DTA Happy Home hỗ trợ vay thế nào?",
      a: "Vốn tự có từ 30%, vay tối đa 70% giá trị căn, thời hạn tối đa 20 năm; lãi suất ưu đãi giai đoạn đầu theo ngân hàng liên kết.",
    },
    {
      q: "Tiến độ bàn giao DTA Happy Home?",
      a: "Đã bàn giao 4 block (560 căn); tiếp tục triển khai thêm khoảng 1.600 căn trong tổng 2.192 căn, 16 block cao 5 tầng.",
    },
    {
      q: "Diện tích căn hộ DTA Happy Home?",
      a: "Khoảng 30–52 m² (1PN và 2PN), mật độ xây dựng dự án 38%. Xem bảng loại hình trên trang dự án.",
    },
  ];
  landing.gallery = [...DTA_HAPPY_HOME_DEMO_IMAGES.gallery];
  landing.ctaLabel = "Liên hệ tư vấn";
  landing.ctaHref = "/lien-he";
  landing.ctaSubtext =
    "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.";

  const overviewData = buildOverviewData(null, {
    totalUnits: 2192,
    blocks: 16,
    landing,
  });

  return {
    id: "preview-dta-happy-home",
    developerId: "preview-dta-dev",
    slug: "dta-happy-home-nhon-trach",
    name: "DTA Happy Home Nhơn Trạch",
    projectType: "NHA_O_XA_HOI",
    status: "DANG_BAN",
    province: "Đồng Nai",
    district: "Nhơn Trạch",
    ward: "Phước An",
    address: "Đường Nguyễn Văn Cừ, Khu đô thị DTA City",
    lat: 10.697,
    lng: 106.934,
    totalArea: 5.143,
    density: 38,
    handoverDate: new Date("2026-03-31"),
    overviewData,
    description:
      "DTA Happy Home là dự án nhà ở xã hội do Công ty Cổ phần Đệ Tam triển khai tại Khu đô thị DTA City Nhơn Trạch, mặt tiền đường Nguyễn Văn Cừ, xã Phước An. Dự án hướng tới người lao động, công nhân khu công nghiệp và các nhóm đối tượng NOXH theo Luật Nhà ở — 16 block cao 5 tầng, 2.192 căn, diện tích 30–52 m². Giá 448–700 triệu/căn; đã bàn giao 4 block (560 căn). Hỗ trợ vay tới 70% giá trị căn.",
    seoTitle: "DTA Happy Home Nhơn Trạch — Nhà ở xã hội từ 448 triệu",
    seoDesc:
      "Nhà ở xã hội Happy Home DTA Nhơn Trạch: 2.192 căn, 16 block 5 tầng, giá 448–700 triệu/căn.",
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: "preview-dta-dev",
      name: "Công ty Cổ phần Đệ Tam (DTA)",
      taxCode: "0314567890",
      verified: true,
      logoUrl: "https://placehold.co/400x400/0f766e/ffffff?text=DTA",
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: [
      {
        id: "preview-ut-1",
        projectId: "preview-dta-happy-home",
        name: "Căn 1 phòng ngủ",
        areaMin: 30,
        areaMax: 35,
        bedrooms: 1,
        priceFrom: 448_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ut-2",
        projectId: "preview-dta-happy-home",
        name: "Căn 2 phòng ngủ (compact)",
        areaMin: 32,
        areaMax: 35,
        bedrooms: 2,
        priceFrom: 520_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ut-3",
        projectId: "preview-dta-happy-home",
        name: "Căn 2 phòng ngủ",
        areaMin: 48,
        areaMax: 52,
        bedrooms: 2,
        priceFrom: 700_000_000,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    legalDocs: [
      {
        id: "preview-ld-1",
        projectId: "preview-dta-happy-home",
        docType: "giay_chung_nhan_dau_tu",
        status: "da_co",
        issuedDate: new Date("2007-08-06"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-2",
        projectId: "preview-dta-happy-home",
        docType: "quy_hoach_1_500",
        status: "da_co",
        issuedDate: new Date("2006-12-19"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-3",
        projectId: "preview-dta-happy-home",
        docType: "chap_thuan_noxh",
        status: "da_co",
        issuedDate: new Date("2014-10-14"),
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "preview-ld-4",
        projectId: "preview-dta-happy-home",
        docType: "dieu_kien_kinh_doanh_bdshtl",
        status: "da_co",
        issuedDate: new Date("2025-12-31"),
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
  } as unknown as ProjectDetail;
}

/** Tin ký gửi mẫu — chỉ hiển thị trên trang preview. */
export function buildDtaPreviewListings(): ProjectLandingListingCard[] {
  return [
    {
      id: "preview-listing-1",
      code: "MX-PREVIEW01",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 520_000_000,
      tier: "FREE",
      broker: { fullName: "Nguyễn Văn A — CTV HouseX" },
      media: [{ url: DTA_HAPPY_HOME_DEMO_IMAGES.gallery[2].url }],
    },
    {
      id: "preview-listing-2",
      code: "MX-PREVIEW02",
      transactionType: "SALE",
      propertyType: "can_ho",
      price: 448_000_000,
      tier: "VIP",
      broker: { fullName: "Trần Thị B — Môi giới" },
      media: [{ url: DTA_HAPPY_HOME_DEMO_IMAGES.gallery[1].url }],
    },
  ];
}
