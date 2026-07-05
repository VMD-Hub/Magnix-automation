/** Ảnh minh hoạ Nam Long – Hồng Phát Cần Thơ — đã nội bộ hóa vào /public. */
const BASE = "/images/projects/nam-long-can-tho";

export const NAM_LONG_HP_IMAGES = {
  hero: {
    url: `${BASE}/hero.jpg`,
    alt: "Chung cư Nam Long – Hồng Phát Cần Thơ",
  },
  developerLogo: null,
  locationMap: {
    url: `${BASE}/map.jpg`,
    alt: "Vị trí Nhà ở xã hội Nam Long – Hồng Phát tại KDC lô 8C, Cái Răng",
    caption: "Minh hoạ kết nối vùng — tham khảo theo tài liệu dự án",
  },
  gallery: [
    {
      url: `${BASE}/hero.jpg`,
      caption: "Phối cảnh chung cư 7 tầng — KDC Nam Long lô 8C",
    },
    {
      url: `${BASE}/layout-1.jpg`,
      caption: "Thiết kế căn hộ ~39–41 m²",
    },
    {
      url: `${BASE}/map.jpg`,
      caption: "Vị trí KDC Nam Long lô 8C — Cái Răng, Cần Thơ",
    },
  ],
} as const;
