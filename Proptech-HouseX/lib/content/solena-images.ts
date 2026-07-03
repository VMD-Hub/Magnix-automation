/** Ảnh công bố trên solena.com.vn — admin nên tải về host CDN HouseX trước go-live. */
const CDN = "https://solena.com.vn/wp-content/uploads/2026/06";

export const SOLENA_PUBLISHED_IMAGES = {
  hero: {
    url: `${CDN}/phoi-canh-solena-green-town-binh-tan.jpg`,
    alt: "Phối cảnh Solena Green Town Block B2 Bình Tân",
  },
  developerLogo: `${CDN}/logo-chu-dau-tu-solena-green-town-binh-tan.png`,
  locationMap: {
    url: `${CDN}/vi-tri-solena-green-town-binh-tan.jpg`,
    alt: "Bản đồ vị trí Solena Green Town tại KDC Vĩnh Lộc Bình Tân",
    caption: "Minh hoạ kết nối vùng — thời gian di chuyển tham khảo theo website dự án",
  },
  gallery: [
    {
      url: `${CDN}/phoi-canh-solena-green-town-binh-tan-1.jpg`,
      caption: "Phối cảnh phân khu Solena (Block B2)",
    },
    {
      url: `${CDN}/mat-bang-tang-dien-hinh-solena-green-town-binh-tan.jpg`,
      caption: "Mặt bằng tầng điển hình",
    },
    {
      url: `${CDN}/tien-ich-solena-green-town-binh-tan-1.jpg`,
      caption: "Tiện ích nội khu",
    },
    {
      url: `${CDN}/layout-can-ho-solena-green-town-binh-tan-1.jpg`,
      caption: "Layout căn 2 phòng ngủ — 1 WC",
    },
    {
      url: `${CDN}/layout-can-ho-solena-green-town-binh-tan-2.jpg`,
      caption: "Layout căn 2 phòng ngủ — 2 WC",
    },
    {
      url: `${CDN}/layout-can-ho-solena-green-town-binh-tan-3.jpg`,
      caption: "Layout căn 2 phòng ngủ — 2 WC (biến thể)",
    },
    {
      url: `${CDN}/layout-can-ho-solena-green-town-binh-tan-4.jpg`,
      caption: "Layout căn 3 phòng ngủ — 2 WC",
    },
    {
      url: `${CDN}/tien-do-solena-green-town-binh-tan.jpg`,
      caption: "Tiến độ thi công (06/2026)",
    },
  ],
} as const;
