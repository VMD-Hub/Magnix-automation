/** Ảnh công bố trên namlongcantho.com.vn — admin nên tải về host CDN HouseX trước go-live. */
const CDN = "https://namlongcantho.com.vn/wp-content/uploads";

export const NAM_LONG_2_CT_IMAGES = {
  hero: {
    url: `${CDN}/2025/04/nha-o-xa-hoi-nam-long-2-can-tho.jpg`,
    alt: "Phối cảnh Nhà ở xã hội Nam Long 2 Cần Thơ",
  },
  developerLogo: `${CDN}/2023/12/9d608d00d053780d2142.jpg`,
  locationMap: {
    url: `${CDN}/2025/02/vi-tri-du-an-nam-long-2-can-tho-1400x788.jpg`,
    alt: "Bản đồ vị trí Nhà ở xã hội Nam Long 2 tại Cái Răng, Cần Thơ",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo website dự án",
  },
  gallery: [
    {
      url: `${CDN}/2024/08/nha-o-xa-hoi-nam-long-2-5-1400x788.jpg`,
      caption: "Quy mô dự án — giai đoạn 1 (6 block E–K)",
    },
    {
      url: `${CDN}/2025/11/nha-o-xa-hoi-nam-long-2-phase-2-1400x788.jpg`,
      caption: "Giai đoạn 2 — Block A, B, C, D (khởi công 6/2025)",
    },
    {
      url: `${CDN}/2025/04/nha-o-xa-hoi-nam-long-2-1400x788.jpg`,
      caption: "Tổng thể KDC Nam Long 2 lô 9A",
    },
    {
      url: `${CDN}/2024/08/nha-o-xa-hoi-nam-long-2-4-1400x788.jpg`,
      caption: "Block căn hộ NOXH Nam Long 2",
    },
    {
      url: `${CDN}/2024/01/nha-o-xa-hoi-nam-long-2.png`,
      caption: "Nhà mẫu căn 57 m² (2PN/2WC)",
    },
    {
      url: `${CDN}/2025/04/tien-do-thanh-toan-38m2-nha-o-xa-hoi-nam-long-2-1-1400x431.jpg`,
      caption: "Tiến độ thanh toán căn 38 m² (tham khảo)",
    },
  ],
} as const;
