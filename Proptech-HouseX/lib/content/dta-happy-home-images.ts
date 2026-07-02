/**
 * Ảnh công khai từ website CĐT (WordPress wp-content).
 * Short paths (/template/..., /2018/...) trả HTML — phải dùng đường dẫn đầy đủ.
 * Nguồn: https://dtanhontrach.com
 */
const CDN = "https://dtanhontrach.com";
const UPLOADS_2018 = `${CDN}/wp-content/uploads/2018/01`;
const THEME_IMG = `${CDN}/wp-content/themes/template/img`;
const WEBP_THEME = `${CDN}/wp-content/webp-express/webp-images/themes/template/img`;

function webpTheme(filename: string) {
  return `${WEBP_THEME}/${filename}`;
}

export const DTA_HAPPY_HOME_IMAGES = {
  developerLogo: `${UPLOADS_2018}/happyhome-logo.png`,
  hero: {
    url: `${UPLOADS_2018}/header-bg-1.jpg.webp`,
    alt: "Phối cảnh DTA Happy Home Nhơn Trạch — Khu đô thị DTA City",
  },
  locationMap: {
    url: `${THEME_IMG}/ban_do.png`,
    alt: "Bản đồ kết nối DTA Happy Home tới cao tốc, sân bay Long Thành và khu công nghiệp",
    caption: "Kết nối vùng — nguồn: CĐT Đệ Tam (DTA)",
  },
  floorPlans: {
    master: {
      url: webpTheme("mb_duan.jpg.webp"),
      caption: "Mặt bằng tổng thể dự án Happy Home",
    },
    typicalBlock: {
      url: webpTheme("mb_tang_1.jpg.webp"),
      caption: "Mặt bằng block điển hình",
    },
    typicalFloor: {
      url: webpTheme("mb_tang_2.jpg.webp"),
      caption: "Mặt bằng tầng điển hình",
    },
  },
  showUnits: [
    {
      url: webpTheme("mau1.jpg.webp"),
      caption: "Nhà mẫu — căn 1 phòng ngủ",
    },
    {
      url: webpTheme("mau2.jpg.webp"),
      caption: "Nhà mẫu — căn 2 phòng ngủ (compact)",
    },
    {
      url: webpTheme("mau3.jpg.webp"),
      caption: "Nhà mẫu — phòng khách & bếp",
    },
    {
      url: webpTheme("mau4.jpg.webp"),
      caption: "Nhà mẫu — không gian sinh hoạt",
    },
  ],
  paymentPlans: [
    {
      url: webpTheme("pt1.jpg.webp"),
      caption: "Phương thức 1 — Thanh toán theo tiến độ (không vay)",
    },
    {
      url: webpTheme("pt2.jpg.webp"),
      caption: "Phương thức 2 — Thanh toán khi tham gia vay ngân hàng",
    },
    {
      url: webpTheme("pt3.jpg.webp"),
      caption: "Phương thức 3 — Lịch thanh toán linh hoạt theo block",
    },
  ],
  progress: [
    { url: `${UPLOADS_2018}/tdo1-1024x576.jpg`, caption: "Tiến độ thi công — giai đoạn 1" },
    { url: `${UPLOADS_2018}/tdo2-1024x576.jpg`, caption: "Tiến độ thi công — giai đoạn 2" },
    { url: `${UPLOADS_2018}/tdo3-1024x576.jpg`, caption: "Tiến độ thi công — giai đoạn 3" },
    { url: `${UPLOADS_2018}/tdo4-1024x576.jpg`, caption: "Tiến độ thi công — giai đoạn 4" },
  ],
} as const;

/** Gallery landing — mặt bằng, nhà mẫu, thanh toán, tiến độ. */
export function dtaHappyHomeGallery() {
  const { floorPlans, showUnits, paymentPlans, progress } = DTA_HAPPY_HOME_IMAGES;
  return [
    floorPlans.master,
    floorPlans.typicalBlock,
    floorPlans.typicalFloor,
    ...showUnits,
    ...paymentPlans,
    ...progress,
  ];
}

/** @deprecated Dùng DTA_HAPPY_HOME_IMAGES — alias cho seed/import cũ. */
export const DTA_HAPPY_HOME_DEMO_IMAGES = {
  hero: DTA_HAPPY_HOME_IMAGES.hero,
  locationMap: DTA_HAPPY_HOME_IMAGES.locationMap,
  gallery: dtaHappyHomeGallery(),
};
