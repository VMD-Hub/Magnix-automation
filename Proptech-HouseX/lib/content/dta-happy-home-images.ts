/** Ảnh công khai từ website CĐT — admin host CDN HouseX khi ổn định. */
const CDN = "https://dtanhontrach.com";

function asset(path: string) {
  return `${CDN}${path.startsWith("/") ? path : `/${path}`}`;
}

export const DTA_HAPPY_HOME_IMAGES = {
  developerLogo: asset("/2018/01/happyhome-logo.png"),
  hero: {
    url: asset("/2018/01/header-bg-1.jpg.webp"),
    alt: "Phối cảnh DTA Happy Home Nhơn Trạch — Khu đô thị DTA City",
  },
  locationMap: {
    url: asset("/template/img/ban_do.png"),
    alt: "Bản đồ kết nối DTA Happy Home tới cao tốc, sân bay Long Thành và khu công nghiệp",
    caption: "Kết nối vùng — nguồn: CĐT Đệ Tam (DTA)",
  },
  floorPlans: {
    master: {
      url: asset("/template/img/mb_duan.jpg.webp"),
      caption: "Mặt bằng tổng thể dự án Happy Home",
    },
    typicalBlock: {
      url: asset("/template/img/mb_tang_1.jpg.webp"),
      caption: "Mặt bằng block điển hình",
    },
    typicalFloor: {
      url: asset("/template/img/mb_tang_2.jpg.webp"),
      caption: "Mặt bằng tầng điển hình",
    },
  },
  showUnits: [
    {
      url: asset("/template/img/mau1.jpg.webp"),
      caption: "Nhà mẫu — căn 1 phòng ngủ",
    },
    {
      url: asset("/template/img/mau2.jpg.webp"),
      caption: "Nhà mẫu — căn 2 phòng ngủ (compact)",
    },
    {
      url: asset("/template/img/mau3.jpg.webp"),
      caption: "Nhà mẫu — phòng khách & bếp",
    },
    {
      url: asset("/template/img/mau4.jpg.webp"),
      caption: "Nhà mẫu — không gian sinh hoạt",
    },
  ],
  paymentPlans: [
    {
      url: asset("/template/img/pt1.jpg.webp"),
      caption: "Phương thức 1 — Thanh toán theo tiến độ (không vay)",
    },
    {
      url: asset("/template/img/pt2.jpg.webp"),
      caption: "Phương thức 2 — Thanh toán khi tham gia vay ngân hàng",
    },
    {
      url: asset("/template/img/pt3.jpg.webp"),
      caption: "Phương thức 3 — Lịch thanh toán linh hoạt theo block",
    },
  ],
  progress: [
    { url: asset("/2018/01/tdo1-1024x576.jpg"), caption: "Tiến độ thi công — giai đoạn 1" },
    { url: asset("/2018/01/tdo2-1024x576.jpg"), caption: "Tiến độ thi công — giai đoạn 2" },
    { url: asset("/2018/01/tdo3-1024x576.jpg"), caption: "Tiến độ thi công — giai đoạn 3" },
    { url: asset("/2018/01/tdo4-1024x576.jpg"), caption: "Tiến độ thi công — giai đoạn 4" },
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
