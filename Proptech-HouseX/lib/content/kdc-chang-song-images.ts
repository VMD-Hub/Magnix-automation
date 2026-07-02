/** Ảnh minh họa khu NOXH Phước Tân (khome.asia) — thay bằng ảnh CĐT Hùng Cường trước go-live. */
const KHOME = "https://khome.asia/wp-content/uploads/2025/12";

export const KDC_CHANG_SONG_IMAGES = {
  hero: {
    url: `${KHOME}/nxh2-1.webp`,
    alt: "Phối cảnh NOXH khu vực Phước Tân, Biên Hòa — minh họa",
  },
  developerLogo: `${KHOME}/an-hung-noxh-1-300x202.webp`,
  locationMap: {
    url: `${KHOME}/nxh2-2.webp`,
    alt: "Khu vực Phước Tân, TP. Biên Hòa — vùng KCN phía Nam",
    caption: "Minh họa bối cảnh khu dân cư Phước Tân — cập nhật bản đồ chính thức khi CĐT công bố",
  },
  gallery: [
    {
      url: `${KHOME}/nxh2-1.webp`,
      caption: "Chung cư NOXH cao tầng — minh họa quy hoạch khu Phước Tân",
    },
    {
      url: `${KHOME}/nxh2-2.webp`,
      caption: "Tổng thể khu dân cư và nhà ở xã hội tại Phước Tân",
    },
    {
      url: `${KHOME}/an-hung-noxh-1-300x202.webp`,
      caption: "Tiến độ triển khai NOXH tại phường Phước Tân (tham khảo khu vực)",
    },
  ],
} as const;
