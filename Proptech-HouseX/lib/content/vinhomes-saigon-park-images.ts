/** Ảnh công bố trên vinhomessaigonpark-hcm.com — nên host CDN HouseX trước go-live. */
const CDN = "https://vinhomessaigonpark-hcm.com/wp-content/uploads";

export const VINHOMES_SAIGON_PARK_IMAGES = {
  hero: {
    url: `${CDN}/2026/06/bg-Vinhomes-Sai-Gon-Park_desktop_final.webp`,
    alt: "Phối cảnh tổng quan Vinhomes Saigon Park tại Tây Bắc TP.HCM",
  },
  developerLogo: `${CDN}/2026/06/logo-vinhomes-sai-gon-park-1.webp`,
  locationMap: {
    url: `${CDN}/2026/06/vi-tri-du-an-vinhomes-SGP.webp`,
    alt: "Bản đồ vị trí Vinhomes Saigon Park tại xã Xuân Thới Sơn, Hóc Môn",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo quy hoạch hạ tầng 2026–2030",
  },
  gallery: [
    {
      url: `${CDN}/2026/06/Vinhomes-Saigon-Park_1920.webp`,
      caption: "Phối cảnh đại đô thị Vinhomes Saigon Park — 1.080 ha",
    },
    {
      url: `${CDN}/2026/05/phoi-canh-vinhomes-sai-gon-park-2.webp`,
      caption: "Không gian đô thị tri thức tại cửa ngõ Tây Bắc TP.HCM",
    },
    {
      url: `${CDN}/2026/05/PHAN-KHU-1.webp`,
      caption: "Phân khu Ivy Park — Công viên tri thức",
    },
    {
      url: `${CDN}/2026/05/PHAN-KHU-3.webp`,
      caption: "Phân khu Laguna Park — Công viên biển xanh",
    },
    {
      url: `${CDN}/2026/05/PHAN-KHU-5.webp`,
      caption: "Phân khu Golf Park — Sân golf 36 hố",
    },
    {
      url: `${CDN}/2026/06/mau-nha-vinhomes-saigon-park-1.webp`,
      caption: "Mẫu nhà phố kiến trúc Tân Cổ Điển CH-08",
    },
    {
      url: `${CDN}/2026/06/mau-nha-vinhomes-saigon-park-7.webp`,
      caption: "Mẫu nhà phố kiến trúc Nhật Bản CH-29",
    },
    {
      url: `${CDN}/2026/06/Layout-Dien-Hinh-0606_Page_02.webp`,
      caption: "Layout điển hình nhà phố liền kề 5×10",
    },
    {
      url: `${CDN}/2026/06/map-vinhomes-hoc-mon.webp`,
      caption: "Mặt bằng 5 phân khu chủ đề",
    },
    {
      url: `${CDN}/2026/05/truong-hoc-quoc-te.webp`,
      caption: "Quần thể giáo dục quy mô 150 ha",
    },
  ],
} as const;
