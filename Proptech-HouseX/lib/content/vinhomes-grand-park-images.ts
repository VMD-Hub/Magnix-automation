/** Ảnh công bố trên vinhomesland.vn — nên host CDN HouseX trước go-live. */
const CDN = "https://vinhomesland.vn/wp-content/uploads";

export const VINHOMES_GRAND_PARK_IMAGES = {
  hero: {
    url: `${CDN}/2022/11/toan-canh-vinhomes-grand-park.jpg`,
    alt: "Toàn cảnh đại đô thị thông minh Vinhomes Grand Park Quận 9",
  },
  developerLogo: `${CDN}/2020/04/vinhomes-land-logo.png`,
  locationMap: {
    url: `${CDN}/2020/07/vi-tri-vinhomes-grand-park.jpg`,
    alt: "Bản đồ vị trí Vinhomes Grand Park tại Long Thạnh Mỹ, Quận 9",
    caption:
      "Minh hoạ kết nối vùng — ôm trọn sông Đồng Nai và sông Tắc, gần Vành đai 3",
  },
  gallery: [
    {
      url: `${CDN}/2020/03/vinhomes-grand-park.jpg`,
      caption: "Phối cảnh tổng thể Vinhomes Grand Park",
    },
    {
      url: `${CDN}/2022/11/mat-bang-tong-the-vinhomes-grand-park.jpg`,
      caption: "Mặt bằng tổng thể 271,8 ha",
    },
    {
      url: `${CDN}/2019/06/cong-vien-vinhomes-grand-park.jpg`,
      caption: "Đại công viên ven sông 36 ha — 15 công viên chủ đề",
    },
    {
      url: `${CDN}/2021/04/phan-khu-the-rainbow-vinhomes-grand-park.jpg`,
      caption: "Phân khu căn hộ The Rainbow",
    },
    {
      url: `${CDN}/2021/04/phan-khu-the-origami-vinhomes-grand-park.jpg`,
      caption: "Phân khu căn hộ The Origami — vườn Nhật Bản",
    },
    {
      url: `${CDN}/2022/11/phan-khu-the-beverly-vinhomes-grand-park.jpg`,
      caption: "Phân khu căn hộ The Beverly — view công viên 36 ha",
    },
    {
      url: `${CDN}/2022/11/phan-khu-the-beverly-solari-vinhomes-grand-park.jpg`,
      caption: "Phân khu The Beverly Solari",
    },
    {
      url: `${CDN}/2021/03/masteri-centre-point.jpg`,
      caption: "Masteri Centre Point — trung tâm đại đô thị",
    },
    {
      url: `${CDN}/2022/11/lumiere-boulevard.jpg`,
      caption: "Lumiere Boulevard — vườn treo Babylon",
    },
    {
      url: `${CDN}/2020/07/phan-khu-the-manhattan-vinhomes-grand-park.jpg`,
      caption: "The Manhattan — biệt thự & shophouse Địa Trung Hải",
    },
    {
      url: `${CDN}/2022/11/the-rivus-elie-saab.jpg`,
      caption: "The Rivus Elie Saab — dinh thự ven sông",
    },
  ],
} as const;
