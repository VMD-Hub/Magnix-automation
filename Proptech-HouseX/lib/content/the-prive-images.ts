/** Ảnh công bố trên the-prive.vn — admin nên tải về host CDN HouseX trước go-live. */
const CDN = "https://the-prive.vn/wp-content/uploads";

export const THE_PRIVE_IMAGES = {
  hero: {
    url: `${CDN}/2025/03/the-prive.jpg`,
    alt: "Phối cảnh The Privé Nam Rạch Chiếc Quận 2",
  },
  developerLogo: `${CDN}/2025/03/logo-the-prive.png`,
  locationMap: {
    url: `${CDN}/2025/03/vi-tri-du-an-the-Prive-.jpg`,
    alt: "Bản đồ vị trí The Privé tại Nam Rạch Chiếc, An Phú",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo website chủ đầu tư",
  },
  gallery: [
    {
      url: `${CDN}/2025/03/the-prive-4.jpg`,
      caption: "Phối cảnh tổng thể The Privé — công viên mặt nước nội khu",
    },
    {
      url: `${CDN}/2025/05/tien-ich-ho-boi-tai-the-prive-1536x865-1.jpg`,
      caption: "Hồ bơi resort nội khu ~3.300 m²",
    },
    {
      url: `${CDN}/2025/05/tien-ich-1-nhe.jpg`,
      caption: "Tiện ích nội khu — skygarden, clubhouse",
    },
    {
      url: `${CDN}/2025/05/mat-bang-nhe.jpg`,
      caption: "Mặt bằng tổng thể 6,7 ha — 12 tháp",
    },
    {
      url: `${CDN}/2025/11/mat-bang-the-prive-dat-xanh-2-1200x800.jpg`,
      caption: "Mặt bằng tầng điển hình — Tháp giai đoạn 1",
    },
    {
      url: `${CDN}/2026/06/can-ho-the-prive-4-1208x800.jpg`,
      caption: "Nhà mẫu căn hộ The Privé",
    },
    {
      url: `${CDN}/2026/01/hinh-anh-the-prive-dat-xanh-7-1200x800.jpg`,
      caption: "Tiến độ thi công (2026)",
    },
  ],
} as const;
