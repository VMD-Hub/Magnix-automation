/** Ảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — đã nội bộ hóa vào /public. */
const BASE = "/images/projects/phu-tho-dmc";

export const PHU_THO_DMC_IMAGES = {
  hero: {
    url: `${BASE}/hero.jpg`,
    alt: "Phối cảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — Quận 10",
  },
  developerLogo: `${BASE}/logo.jpg`,
  locationMap: {
    url: `${BASE}/vi-tri.jpg`,
    alt: "Bản đồ vị trí Nhà ở xã hội Lý Thường Kiệt — 324 Lý Thường Kiệt Q10",
    caption: "Phú Thọ DMC — đối diện Nhà thi đấu Phú Thọ và Bệnh viện Trưng Vương",
  },
  gallery: [
    {
      url: `${BASE}/hero.jpg`,
      caption: "Phối cảnh Nhà ở xã hội Lý Thường Kiệt — 4 block 25 tầng",
    },
    {
      url: `${BASE}/mat-tien.webp`,
      caption: "Thiết kế mặt tiền Phú Thọ DMC (Lý Thường Kiệt)",
    },
    {
      url: `${BASE}/thiet-ke.jpg`,
      caption: "Thiết kế căn hộ — ban công, thông tầng, ánh sáng tự nhiên",
    },
    {
      url: `${BASE}/thiet-ke-1.jpg`,
      caption: "Nội thất mẫu căn hộ NOXH",
    },
    {
      url: `${BASE}/mat-bang.jpg`,
      caption: "Mặt bằng tầng điển hình",
    },
    {
      url: `${BASE}/mat-bang-1.jpg`,
      caption: "Layout căn Studio / 1PN / 2PN — Nhà ở xã hội Lý Thường Kiệt",
    },
    {
      url: `${BASE}/tien-ich.jpg`,
      caption: "Tiện ích nội khu dự án",
    },
    {
      url: `${BASE}/vi-tri-1.jpg`,
      caption: "Kết nối vùng trung tâm Quận 10",
    },
  ],
} as const;
