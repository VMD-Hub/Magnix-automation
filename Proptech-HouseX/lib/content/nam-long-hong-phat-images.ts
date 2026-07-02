/** Ảnh minh hoạ dự án — tham khảo namphuoc.net; admin host CDN & xác minh trước go-live. */
const CDN = "https://namphuoc.net/wp-content/uploads/2022/02";

export const NAM_LONG_HP_IMAGES = {
  hero: {
    url: `${CDN}/chung-cu-nam-long-can-tho.jpg`,
    alt: "Chung cư Nam Long – Hồng Phát Cần Thơ",
  },
  developerLogo:
    "https://namlongcantho.com.vn/wp-content/uploads/2023/12/9d608d00d053780d2142.jpg",
  locationMap: {
    url: `${CDN}/vi-tri-chung-cu-nam-long-can-tho.jpg`,
    alt: "Vị trí Nhà ở xã hội Nam Long – Hồng Phát tại KDC lô 8C, Cái Răng",
    caption:
      "Minh hoạ kết nối vùng — tham khảo theo tài liệu dự án",
  },
  gallery: [
    {
      url: `${CDN}/chung-cu-nam-long-can-tho-1068x800.jpg`,
      caption: "Phối cảnh chung cư 7 tầng — KDC Nam Long lô 8C",
    },
    {
      url: `${CDN}/mat-bang-chung-cu-nam-long-can-tho.jpg`,
      caption: "Mặt bằng tầng điển hình — 187 căn",
    },
    {
      url: `${CDN}/thiet-ke-can-ho-chung-cu-nam-long-can-tho.jpg`,
      caption: "Layout căn tiêu chuẩn ~39–41 m²",
    },
    {
      url: `${CDN}/thiet-ke-can-ho-chung-cu-nam-long-can-tho-2-1067x800.jpg`,
      caption: "Layout căn 2 phòng ngủ",
    },
    {
      url: `${CDN}/thiet-ke-can-ho-chung-cu-nam-long-can-tho-3-1067x800.jpg`,
      caption: "Layout căn góc ~68–70 m²",
    },
  ],
} as const;
