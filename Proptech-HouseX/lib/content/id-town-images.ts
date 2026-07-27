/**
 * Ảnh landing ID Town Long Thành — đã nội bộ hóa vào /public.
 *
 * Nguồn gốc: https://id-town.com.vn (wp-content/uploads/2025/08).
 * Hotlink CĐT dễ gãy → ảnh nằm trong repo tại `public/images/projects/id-town/`.
 */
const BASE = "/images/projects/id-town";

export const ID_TOWN_IMAGES = {
  developerLogo: `${BASE}/logo.png`,
  hero: {
    url: `${BASE}/hero.jpg`,
    alt: "Phối cảnh nhà ở xã hội ID Town Long Thành — khu đô thị iD Junction",
  },
  locationMap: {
    url: `${BASE}/ban-do.jpg`,
    alt: "Quy hoạch khu đô thị iD Junction và vị trí ID Town Long Thành",
    caption: "Quy hoạch iD Junction — nguồn: id-town.com.vn",
  },
  gallery: [
    {
      url: `${BASE}/phoi-canh-1.jpg`,
      caption: "Phối cảnh tổng thể ID Town Long Thành",
    },
    {
      url: `${BASE}/phoi-canh-2.jpg`,
      caption: "Không gian sống thấp tầng trong iD Junction",
    },
    {
      url: `${BASE}/tien-ich-1.jpg`,
      caption: "Tiện ích nội khu — hồ bơi & cảnh quan",
    },
    {
      url: `${BASE}/tien-ich-2.jpg`,
      caption: "Quảng trường và không gian cộng đồng",
    },
    {
      url: `${BASE}/tien-ich-3.jpg`,
      caption: "Mảng xanh nội khu ID Town",
    },
    {
      url: `${BASE}/mat-bang-1.jpg`,
      caption: "Mặt bằng tầng điển hình",
    },
    {
      url: `${BASE}/mat-bang-2.jpg`,
      caption: "Mặt bằng block căn hộ",
    },
    {
      url: `${BASE}/mat-bang-3.jpg`,
      caption: "Bố trí căn hộ 2 phòng ngủ",
    },
    {
      url: `${BASE}/tien-do-1.jpg`,
      caption: "Tiến độ thi công dự án",
    },
    {
      url: `${BASE}/tien-do-2.jpg`,
      caption: "Cất nóc & hoàn thiện các block",
    },
  ],
} as const;
