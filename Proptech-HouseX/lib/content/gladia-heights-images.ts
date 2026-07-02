/** Ảnh công bố trên gladiaheights.info.vn — nên host CDN HouseX trước go-live. */
const CDN = "https://gladiaheights.info.vn/wp-content/uploads";

export const GLADIA_HEIGHTS_IMAGES = {
  hero: {
    url: `${CDN}/2026/06/Gladia-Heights-scaled-1.webp`,
    alt: "Phối cảnh Gladia Heights Khang Điền tại Võ Chí Công, Bình Trưng Đông",
  },
  developerLogo: `${CDN}/2026/06/logo-gladia-khang-dien-ux-600x220-1.webp`,
  locationMap: {
    url: `${CDN}/2026/06/vi-tri-gladia-heights-2048x1051-1.webp`,
    alt: "Bản đồ vị trí Gladia Heights — kế cận Thủ Thiêm, Phú Mỹ Hưng",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo website dự án (5-10-15 phút)",
  },
  gallery: [
    {
      url: `${CDN}/2026/06/gladia-heights.jpg`,
      caption: "Gladia Heights — chuẩn sống Future-First ven sông",
    },
    {
      url: `${CDN}/2026/06/view-gladia-heights.webp`,
      caption: "Tầm nhìn hướng sông — 3 mặt giáp nước",
    },
    {
      url: `${CDN}/2026/06/tam-diem-ket-noi.webp`,
      caption: "Tâm điểm kết nối 5-10-15 phút",
    },
    {
      url: `${CDN}/2026/06/tien-ich-gladia-heights-1-2048x780-1.webp`,
      caption: "Hơn 60 tiện ích nội khu — hồ bơi Ngân Hà & Ánh Sao ~70 m",
    },
    {
      url: `${CDN}/2026/06/tien-ich-gladia-heights-2-2048x818-1.webp`,
      caption: "Cảnh quan 9 ha — 5 công viên chủ đề",
    },
    {
      url: `${CDN}/2026/06/So-do-can-ho-2048x1265-1.webp`,
      caption: "Sơ đồ 3 tháp — 639 căn & 26 shophouse",
    },
    {
      url: `${CDN}/2026/06/Layout-1PN-2PN-2048x1131-1.webp`,
      caption: "Layout căn hộ 1PN & 2PN",
    },
    {
      url: `${CDN}/2026/06/Layout-3PN-4PN-2048x1127-1.webp`,
      caption: "Layout căn 3PN & 4PN Duplex",
    },
    {
      url: `${CDN}/2026/06/tuong-lai-con-tre-bat-dau-tu-moi-truong-song-hom-nay-1.jpg`,
      caption: "Căn hộ mẫu — không gian sáng, ban công rộng",
    },
    {
      url: `${CDN}/2026/06/tuong-lai-con-tre-bat-dau-tu-moi-truong-song-hom-nay-2.jpg`,
      caption: "Thiết kế Future-First — BCA Green Mark Gold",
    },
  ],
} as const;
