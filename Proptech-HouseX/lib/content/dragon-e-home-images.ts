/** Ảnh công bố trên phulong.com/du-an/dragon-e-home — admin host CDN HouseX trước go-live. */
const CDN = "https://phulong.com/wp-content/uploads";

export const DRAGON_E_HOME_PUBLISHED_IMAGES = {
  hero: {
    url: `${CDN}/2026/03/Tong-The-Ban-Ngay.jpeg`,
    alt: "Phối cảnh Dragon E-Home — nhà ở xã hội thế hệ mới tại Dragon Village",
  },
  developerLogo: `${CDN}/2024/09/logo-2.png`,
  projectLogo: `${CDN}/2024/09/Logo-Dragon-E-Home-final.png`,
  locationMap: {
    url: `${CDN}/2026/03/DE-Ban-do-vi-tri.jpeg`,
    alt: "Bản đồ vị trí Dragon E-Home — Nguyễn Thị Tư, Dragon Village, Thủ Đức",
    caption: "Minh hoạ kết nối vùng — theo website CĐT Phú Long",
  },
  gallery: [
    {
      url: `${CDN}/2026/03/Tong-The-Ngang.jpeg`,
      caption: "Tổng thể dự án Dragon E-Home ban ngày",
    },
    {
      url: `${CDN}/2026/03/DE-Tong-The-Ban-Dem.jpeg`,
      caption: "Phối cảnh ban đêm — 6 tòa C1–C5",
    },
    {
      url: `${CDN}/2026/03/Chan-Toa-Nha.jpeg`,
      caption: "Chân tòa nhà & không gian cảnh quan",
    },
    {
      url: `${CDN}/2026/03/DE-Ho-Boi-eyes-view.jpg`,
      caption: "Hồ bơi nội khu",
    },
    {
      url: `${CDN}/2026/03/DE-Cong-Vien-Nho.jpg`,
      caption: "Công viên nội khu",
    },
    {
      url: `${CDN}/2026/03/DE-Mat-bang-3-8-C1.png`,
      caption: "Mặt bằng tầng 3–8 tòa C1",
    },
  ],
} as const;
