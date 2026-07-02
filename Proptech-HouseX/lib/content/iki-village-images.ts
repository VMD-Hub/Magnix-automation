/** Ảnh công bố trên ikivillage.net — admin host CDN HouseX trước go-live. */
const CDN = "https://ikivillage.net/wp-content/uploads";

export const IKI_VILLAGE_PUBLISHED_IMAGES = {
  hero: {
    url: `${CDN}/2026/01/Anh-2-_AKH_IKI-VILLAGE_C01_Final_CUT-3.jpg`,
    alt: "Phối cảnh dự án căn hộ IKI Village — không gian sống wellness",
  },
  developerLogo: `${CDN}/2026/04/667389849_122172054908783989_4108176394304270937_n-scaled-e1775834528263-1024x356.jpg`,
  locationMap: {
    url: `${CDN}/2026/06/screenshot_1781193794.png`,
    alt: "Bản đồ vị trí IKI Village — Vành đai 3, Lò Lu nối dài",
    caption: "Minh hoạ kết nối vùng — tham khảo theo website dự án",
  },
  gallery: [
    {
      url: `${CDN}/2026/06/709005530_122176897040783989_7658233593627485797_n.jpg`,
      caption: "Tổng quan dự án IKI Village",
    },
    {
      url: `${CDN}/2026/06/Daotaosanphamduan_IKI_Village-84.jpg`,
      caption: "Không gian sống lấy cảm hứng triết lý IKIGAI",
    },
    {
      url: `${CDN}/2026/06/01.-TIENICH_CongVien_View17-scaled.jpg`,
      caption: "Công viên ven sông nội khu",
    },
    {
      url: `${CDN}/2026/06/01.-TIENICH_HoBoi_Harmonie_View03-scaled.jpg`,
      caption: "Hồ bơi tháp Harmonie",
    },
    {
      url: `${CDN}/2026/06/page_047.jpg`,
      caption: "Mặt bằng tháp Vitalis",
    },
    {
      url: `${CDN}/2026/06/Tien-Ich-IKI.png`,
      caption: "Hệ sinh thái tiện ích IKI Village",
    },
  ],
} as const;
