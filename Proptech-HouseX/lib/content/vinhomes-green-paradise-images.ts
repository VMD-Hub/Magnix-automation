/** Ảnh công bố trên vinhomesvingroup.com.vn — nên host CDN HouseX trước go-live. */
const CDN = "https://vinhomesvingroup.com.vn/wp-content/uploads";

export const VINHOMES_GREEN_PARADISE_IMAGES = {
  hero: {
    url: `${CDN}/2026/04/phoi-canh-vinhomes-can-gio-khu-do-thi-bien-esg.jpg`,
    alt: "Phối cảnh siêu đô thị biển ESG++ Vinhomes Green Paradise Cần Giờ",
  },
  developerLogo: `${CDN}/2026/04/vinhomes-can-gio-logo.png`,
  locationMap: {
    url: `${CDN}/2025/10/ban-do-map-vi-tri-vinhomes-green-paradise-can-gio.jpg`,
    alt: "Bản đồ vị trí Vinhomes Green Paradise tại huyện Cần Giờ, TP.HCM",
    caption:
      "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo quy hoạch hạ tầng",
  },
  gallery: [
    {
      url: `${CDN}/2025/08/tong-quan-khu-do-thi-lan-bien-vinhomes-can-gio.jpg`,
      caption: "Tổng quan khu đô thị lấn biển 2.870 ha — Vinhomes Cần Giờ",
    },
    {
      url: `${CDN}/2025/09/toa-thap-choc-troi-108-tang-top-10-the-gioi-tai-vinhomes-green-paradise-can-gio.png`,
      caption: "Tháp biểu tượng 108 tầng tại mũi Hải Đăng",
    },
    {
      url: `${CDN}/2026/04/bien-ho-nuoc-man-nhan-tao-4-mua-paradise-lagoon-lon-nhat-the-gioi-433ha-su-dung-nuoc-bien-tu-nhien-tai-vinhomes-can-gio.jpg`,
      caption: "Biển hồ Paradise Lagoon ~433 ha — nước biển tự nhiên 4 mùa",
    },
    {
      url: `${CDN}/2026/04/nha-hat-song-xanh-blue-wave-theatre-vinhomes-can-gio.jpg`,
      caption: "Nhà hát Sóng Xanh Blue Wave Theatre — 7 ha, 5.000 chỗ",
    },
    {
      url: `${CDN}/2026/04/4-phan-khu-vinhomes-can-gio.jpg`,
      caption: "Mặt bằng 5 phân khu chức năng",
    },
    {
      url: `${CDN}/2026/04/vi-tri-mat-bang-vinh-tien-the-haven-bay-vinhomes-can-gio.jpg`,
      caption: "Phân khu The Haven Bay — Vịnh Tiên",
    },
    {
      url: `${CDN}/2026/04/vi-tri-mat-bang-vinh-ngoc-the-green-bay-vinhomes-can-gio.jpg`,
      caption: "Phân khu The Green Bay — Vịnh Ngọc",
    },
    {
      url: `${CDN}/2026/04/vi-tri-mat-bang-mui-danh-vong-the-paradise-vinhomes-can-gio.jpg`,
      caption: "Phân khu The Paradise — Mũi Danh Vọng",
    },
    {
      url: `${CDN}/2026/04/vi-tri-mat-bang-dao-mat-troi-the-grand-island-vinhomes-can-gio.jpg`,
      caption: "Phân khu The Grand Island — Đảo Mặt Trời",
    },
    {
      url: `${CDN}/2026/06/tien-do-thi-cong-vinhomes-green-paradise-can-gio-thang-6-2026.jpg`,
      caption: "Tiến độ thi công (6/2026)",
    },
  ],
} as const;
