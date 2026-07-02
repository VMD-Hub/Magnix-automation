/** Ảnh công bố trên victoriavillages.com — nên host CDN HouseX trước go-live. */
const CDN = "https://victoriavillages.com/wp-content/uploads";

export const VICTORIA_VILLAGE_IMAGES = {
  hero: {
    url: `${CDN}/2026/03/du-an-victoria-village-dong-van-cong-thanh-my-loi-quan-2-khu-do-thi-cao-cap-novaland.jpg`,
    alt: "Phối cảnh Victoria Village Novaland tại Đồng Văn Cống, Thạnh Mỹ Lợi",
  },
  developerLogo: `${CDN}/2026/03/Logo-Victoria-Village-440x152-1.png`,
  locationMap: {
    url: `${CDN}/2026/03/vi-tri-du-an-victoria-village-novaland-dong-van-cong-thanh-my-loi-ket-noi-thu-thiem-quan-1-cao-toc-long-thanh-dau-giay.jpg`,
    alt: "Bản đồ vị trí Victoria Village — 4 mặt tiền huyết mạch Thạnh Mỹ Lợi",
    caption:
      "Minh hoạ kết nối vùng — Thủ Thiêm, Quận 1, cao tốc Long Thành – Dầu Giày",
  },
  gallery: [
    {
      url: `${CDN}/2026/03/vi-tri-victoria-village-thanh-my-loi-thu-duc-gan-mai-chi-tho-va-khu-do-thi-thu-thiem.jpg`,
      caption: "Vị trí tam giác vàng — Thủ Thiêm · Thạnh Mỹ Lợi · Phú Mỹ Hưng",
    },
    {
      url: `${CDN}/2026/03/Mat-bang-tong-the-du-an-Victoria-Village-duoc-Novaland-phat-trien-tai-Dao-Kim-Cuong-Quan-2.jpg`,
      caption: "Mặt bằng tổng thể 4,27 ha — 4 tháp & khu thấp tầng",
    },
    {
      url: `${CDN}/2026/03/tien-ich-cong-vien-hoang-gia-tai-du-an-victoria-village-thanh-my-loi-thu-duc-khong-gian-xanh-loi-dao-bo-thu-gian.jpg`,
      caption: "Quảng trường công viên 5.000 m²",
    },
    {
      url: `${CDN}/2026/03/tien-ich-ho-boi-tran-victoria-village-phong-cach-nghi-duong-khong-gian-xanh-thanh-my-loi-thu-duc.jpg`,
      caption: "Hồ bơi vô cực tràn bờ 750 m²",
    },
    {
      url: `${CDN}/2026/03/Mat-bang-dien-hinh-tang-3-Victoria-Village-cua-chu-dau-tu-NovaLand.jpg`,
      caption: "Mặt bằng tầng 3 — 4 tháp bố trí chữ U",
    },
    {
      url: `${CDN}/2026/03/Mat-bang-dien-hinh-tang-4-24-Victoria-Village-cua-chu-dau-tu-NovaLand.jpg`,
      caption: "Mặt bằng tầng 4–24 điển hình",
    },
    {
      url: `${CDN}/2026/03/Layout-thiet-ke-can-ho-11phong-ngu-va-2-phong-ngu-Victoria-Village-dien-tich-48m2-61m2.jpg`,
      caption: "Layout căn 1+1 & 2PN (48–61 m²)",
    },
    {
      url: `${CDN}/2026/03/Layout-thiet-ke-can-ho-2phong-ngu-va-3-phong-ngu-Victoria-Village-dien-tich-67m2-82m2.jpg`,
      caption: "Layout căn 2PN & 3PN (67–82 m²)",
    },
    {
      url: `${CDN}/2026/06/tien-do-xay-dung-victoria-village-thang-6-nam-2026-toan-canh-4-toa-thap.jpg`,
      caption: "Tiến độ thi công 06/2026 — 4 tháp cao tầng",
    },
    {
      url: `${CDN}/2026/03/he-thong-tien-ich-ngoai-khu-victoria-village-gan-khu-do-thi-thu-thiem-trung-tam-hanh-chinh-thu-duc-dich-vu-hien-dai.jpg`,
      caption: "Tiện ích ngoại khu — Thủ Thiêm & TT hành chính Thủ Đức",
    },
  ],
} as const;
