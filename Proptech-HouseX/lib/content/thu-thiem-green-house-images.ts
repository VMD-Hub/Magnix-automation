/** Ảnh công bố trên thuthiemgreenhouses.vn — admin host CDN HouseX trước go-live. */
const CDN = "https://thuthiemgreenhouses.vn/uploads";

export const THU_THIEM_GREEN_HOUSE_IMAGES = {
  hero: {
    url: `${CDN}/banner-thu-thiem-green-house-quan-2.jpg`,
    alt: "Phối cảnh Thủ Thiêm Green House — NOXH mặt tiền Võ Chí Công",
  },
  developerLogo: `${CDN}/hinhanh_1/logo-thu-thiem-green-house-png-20230217095645nH6Th7CXh.png`,
  locationMap: {
    url: `${CDN}/vi-tri-du-an-thu-thiem-green-house.jpg`,
    alt: "Bản đồ vị trí Thủ Thiêm Green House — Võ Chí Công, Thạnh Mỹ Lợi",
    caption: "Minh hoạ kết nối vùng — tham khảo theo website dự án",
  },
  gallery: [
    {
      url: `${CDN}/thu-thiem-green-house-1.jpg`,
      caption: "Tổng quan dự án Thủ Thiêm Green House",
    },
    {
      url: `${CDN}/1-can-ho-thu-duc-green-house.jpg`,
      caption: "Phối cảnh tổng thể 3 block A–B–C",
    },
    {
      url: `${CDN}/tien-ich-thu-thiem-green-house/ho-boi-du-an-thu-thiem-green-house.jpg`,
      caption: "Hồ bơi nội khu",
    },
    {
      url: `${CDN}/tien-ich-thu-thiem-green-house/cong-vien-thu-thiem-green-house.jpg`,
      caption: "Công viên cảnh quan",
    },
    {
      url: `${CDN}/mat-bang-tang-1-du-an-thu-thiem-green-house-quan-2.jpg`,
      caption: "Mặt bằng tầng 1 dự án",
    },
    {
      url: `${CDN}/tien-do-xay-du-du-an-noxh-thu-thiem-green-house-5-1024x609.jpg`,
      caption: "Tiến độ thi công dự án",
    },
  ],
} as const;
