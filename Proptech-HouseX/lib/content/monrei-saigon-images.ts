/** Ảnh công bố trên saigonmonrei.vn — nên host CDN HouseX trước go-live. */
const CDN = "https://saigonmonrei.vn/wp-content/uploads";

export const MONREI_SAIGON_IMAGES = {
  hero: {
    url: `${CDN}/2026/05/PC-Tong-Monrei.jpg`,
    alt: "Phối cảnh tổng thể Monrei Saigon — Thành phố nước thủy liệu Thuận Giao",
  },
  developerLogo: `${CDN}/2026/05/monrei-trang-nhat-logo.png`,
  locationMap: {
    url: `${CDN}/2026/05/vi-tri-can-ho-monrei-saigon.jpg`,
    alt: "Bản đồ vị trí Monrei Saigon tại Nguyễn Thị Minh Khai, Thuận Giao, TP.HCM",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo website dự án (Metro 1 & 2, Vành đai 3)",
  },
  gallery: [
    {
      url: `${CDN}/2026/05/Monrei.Ho-thuy-luc.jpg`,
      caption: "Thành phố nước — 6.500 m² mặt nước, 88 m sông lười",
    },
    {
      url: `${CDN}/2026/05/Monrei.Water-Landscape.jpg`,
      caption: "Cảnh quan thủy liệu — 5 tầng cảnh quan biophilic",
    },
    {
      url: `${CDN}/2026/05/Monrei.Lazy-river-with-kayak.jpg`,
      caption: "Dòng sông lười và cầu đi bộ nội khu",
    },
    {
      url: `${CDN}/2026/05/Sanh-thong-tang-9m.jpg`,
      caption: "Sảnh đón thông tầng 9 m — tiêu chuẩn resort 5 sao",
    },
    {
      url: `${CDN}/2026/05/Long-Pool-T20-2.jpg`,
      caption: "Sky Pool tầng 20 — tầm nhìn panorama",
    },
    {
      url: `${CDN}/2026/05/Monrei.PC-topdown.jpg`,
      caption: "Mặt bằng tổng thể 4,6 ha — 3 tòa tháp",
    },
    {
      url: `${CDN}/2026/06/mat-bang-tang-dien-hing.jpg`,
      caption: "Mặt bằng tầng điển hình tòa M1 Onsen",
    },
    {
      url: `${CDN}/2026/05/can-studio-1.jpg`,
      caption: "Layout căn studio 34–38 m²",
    },
    {
      url: `${CDN}/2026/05/3-nha-phat-trien-du-an-monrei-sg.jpg`,
      caption: "Liên doanh Mitsubishi · Tokyu Land · Phát Đạt",
    },
    {
      url: `${CDN}/2026/05/hinh-anh-tien-do-du-an-monrei-saigon-FILEminimizer.jpg`,
      caption: "Tiến độ thi công (cập nhật 06/2026)",
    },
  ],
} as const;
