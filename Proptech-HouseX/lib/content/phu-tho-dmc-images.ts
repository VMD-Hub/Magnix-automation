/** Ảnh tham khảo odt.vn / khome.asia — admin host CDN HouseX trước go-live. */
const ODT = "https://odt.vn/storage/03-2026";
const KHOME = "https://khome.asia/wp-content/uploads/2026/02";

export const PHU_THO_DMC_IMAGES = {
  hero: {
    url: `${ODT}/phu-tho-dmc-phoi-canh-1.jpg`,
    alt: "Phối cảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — Quận 10",
  },
  developerLogo: `${KHOME}/nha-o-xa-hoi-ly-thuong-kiet-phu-.jpg`,
  locationMap: {
    url: `${ODT}/phu-tho-dmc-vi-tri.jpg`,
    alt: "Bản đồ vị trí Nhà ở xã hội Lý Thường Kiệt — 324 Lý Thường Kiệt Q10",
    caption: "Phú Thọ DMC — đối diện Nhà thi đấu Phú Thọ và Bệnh viện Trưng Vương",
  },
  gallery: [
    {
      url: `${ODT}/phu-tho-dmc-phoi-canh-1.jpg`,
      caption: "Phối cảnh Nhà ở xã hội Lý Thường Kiệt — 4 block 25 tầng",
    },
    {
      url: `${KHOME}/noxh-ly-thuong-kiet-1.webp`,
      caption: "Thiết kế mặt tiền Phú Thọ DMC (Lý Thường Kiệt)",
    },
    {
      url: `${ODT}/phu-tho-dmc-thiet-ke.jpg`,
      caption: "Thiết kế căn hộ — ban công, thông tầng, ánh sáng tự nhiên",
    },
    {
      url: `${ODT}/phu-tho-dmc-thiet-ke-1.jpg`,
      caption: "Nội thất mẫu căn hộ NOXH",
    },
    {
      url: `${ODT}/phu-tho-dmc-mat-bang.jpg`,
      caption: "Mặt bằng tầng điển hình",
    },
    {
      url: `${ODT}/phu-tho-dmc-mat-bang-1.jpg`,
      caption: "Layout căn Studio / 1PN / 2PN — Nhà ở xã hội Lý Thường Kiệt",
    },
    {
      url: `${ODT}/phu-tho-dmc-tien-ich.jpg`,
      caption: "Tiện ích nội khu dự án",
    },
    {
      url: `${ODT}/phu-tho-dmc-vi-tri-1.jpg`,
      caption: "Kết nối vùng trung tâm Quận 10",
    },
  ],
} as const;
