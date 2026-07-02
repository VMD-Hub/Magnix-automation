/** Ảnh công bố trên hpdgroup.vn/eco-residence — admin host CDN HouseX trước go-live. */
const CDN = "https://hpdgroup.vn/wp-content/uploads";

export const ECO_RESIDENCE_PUBLISHED_IMAGES = {
  hero: {
    url: `${CDN}/2025/08/Phoi-canh-1.jpg`,
    alt: "Phối cảnh dự án Eco Residence — Nhà ở xã hội Long Bình Tân",
  },
  developerLogo: `${CDN}/2025/08/cdc_logo_thunho1.jpg`,
  locationMap: {
    url: `${CDN}/2025/01/vi-tri-ke-noi-nha-o-xa-hoi-long-binh-tan.jpg`,
    alt: "Bản đồ kết nối Eco Residence — Long Bình Tân, Biên Hòa",
    caption: "Minh hoạ kết nối vùng — tham khảo theo website dự án",
  },
  gallery: [
    {
      url: `${CDN}/2025/01/phoi-canh-du-an-nha-o-xa-hoi-long-binh-tan-2.jpg`,
      caption: "Phối cảnh tổng thể Eco Residence",
    },
    {
      url: `${CDN}/2025/01/Long-Binh-Tan-3-01-1.jpg`,
      caption: "Tổng quan quy hoạch dự án",
    },
    {
      url: `${CDN}/2025/08/Toan-canh-cong-vien-noi-khu-e1756106819134.jpg`,
      caption: "Công viên cảnh quan nội khu",
    },
    {
      url: `${CDN}/2025/01/tien-ich-nha-o-xa-hoi-long-binh-tan.png`,
      caption: "Hệ sinh thái tiện ích nội khu",
    },
    {
      url: `${CDN}/2025/01/Long-Binh-Tan-6-1.jpg`,
      caption: "Mặt bằng & mẫu căn hộ",
    },
    {
      url: `${CDN}/2025/01/tien-do-duans-nha-o-xa-hoi-long-binh-tan-750x422-1.jpg`,
      caption: "Tiến độ thi công dự án",
    },
  ],
} as const;
