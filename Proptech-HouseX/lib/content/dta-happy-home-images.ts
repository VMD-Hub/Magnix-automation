/**
 * Ảnh landing DTA Happy Home — ĐÃ NỘI BỘ HÓA vào /public.
 *
 * Trước đây hotlink trực tiếp từ dtanhontrach.com (WordPress wp-content) nên ảnh
 * dễ "mất" khi CĐT đổi đường dẫn / chặn hotlink / site sập. Nay ảnh nằm trong repo
 * tại `public/images/projects/dta-happy-home/`, phục vụ ổn định và versioned trong git.
 *
 * Cập nhật ảnh: tải lại từ nguồn CĐT rồi ghi đè file trong thư mục trên
 * (xem script `npm run db:reseed:dta` / README). Nguồn gốc: https://dtanhontrach.com
 */
const BASE = "/images/projects/dta-happy-home";

export const DTA_HAPPY_HOME_IMAGES = {
  developerLogo: `${BASE}/happyhome-logo.png`,
  hero: {
    url: `${BASE}/hero.webp`,
    alt: "Phối cảnh DTA Happy Home Nhơn Trạch — Khu đô thị DTA City",
  },
  locationMap: {
    url: `${BASE}/ban-do.png`,
    alt: "Bản đồ kết nối DTA Happy Home tới cao tốc, sân bay Long Thành và khu công nghiệp",
    caption: "Kết nối vùng — nguồn: CĐT Đệ Tam (DTA)",
  },
  floorPlans: {
    master: {
      url: `${BASE}/mb-tong-the.webp`,
      caption: "Mặt bằng tổng thể dự án Happy Home",
    },
    typicalBlock: {
      url: `${BASE}/mb-block.webp`,
      caption: "Mặt bằng block điển hình",
    },
    typicalFloor: {
      url: `${BASE}/mb-tang.webp`,
      caption: "Mặt bằng tầng điển hình",
    },
  },
  showUnits: [
    {
      url: `${BASE}/nha-mau-1.webp`,
      caption: "Nhà mẫu — căn 1 phòng ngủ",
    },
    {
      url: `${BASE}/nha-mau-2.webp`,
      caption: "Nhà mẫu — căn 2 phòng ngủ (compact)",
    },
    {
      url: `${BASE}/nha-mau-3.webp`,
      caption: "Nhà mẫu — phòng khách & bếp",
    },
    {
      url: `${BASE}/nha-mau-4.webp`,
      caption: "Nhà mẫu — không gian sinh hoạt",
    },
  ],
  paymentPlans: [
    {
      url: `${BASE}/thanh-toan-1.webp`,
      caption: "Phương thức 1 — Thanh toán theo tiến độ (không vay)",
    },
    {
      url: `${BASE}/thanh-toan-2.webp`,
      caption: "Phương thức 2 — Thanh toán khi tham gia vay ngân hàng",
    },
    {
      url: `${BASE}/thanh-toan-3.webp`,
      caption: "Phương thức 3 — Lịch thanh toán linh hoạt theo block",
    },
  ],
  progress: [
    { url: `${BASE}/tien-do-1.jpg`, caption: "Tiến độ thi công — giai đoạn 1" },
    { url: `${BASE}/tien-do-2.jpg`, caption: "Tiến độ thi công — giai đoạn 2" },
    { url: `${BASE}/tien-do-3.jpg`, caption: "Tiến độ thi công — giai đoạn 3" },
    { url: `${BASE}/tien-do-4.jpg`, caption: "Tiến độ thi công — giai đoạn 4" },
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
