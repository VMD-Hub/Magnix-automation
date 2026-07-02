/** Ảnh minh hoạ tạm (Unsplash) — admin thay bằng ảnh CĐT trên CDN trước go-live. */
function u(photoId: string, w: number, h: number) {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

export const DTA_HAPPY_HOME_DEMO_IMAGES = {
  hero: {
    url: u("photo-1600585154526-990dced4db0d", 1920, 720),
    alt: "Khu căn hộ NOXH hiện đại — minh hoạ DTA Happy Home Nhơn Trạch",
  },
  locationMap: {
    url: u("photo-1477959856447-4f5c817a4a3f", 1200, 900),
    alt: "Minh hoạ kết nối vùng DTA Happy Home tới cao tốc và khu công nghiệp",
    caption: "Minh hoạ kết nối vùng — thay bằng bản đồ thiết kế từ CĐT",
  },
  gallery: [
    {
      url: u("photo-1600585154340-be6161a56a0c", 1920, 1080),
      caption: "Phối cảnh khu dân cư hiện đại — thay ảnh CĐT",
    },
    {
      url: u("photo-1600047509358-52dc686375e8", 1920, 1080),
      caption: "Mặt tiền block căn hộ — thay ảnh CĐT",
    },
    {
      url: u("photo-1600607687939-ce8a6c25118c", 1920, 1080),
      caption: "Nhà mẫu 2 phòng ngủ — thay ảnh CĐT",
    },
    {
      url: u("photo-1600047509800-ba3955280484", 1920, 1080),
      caption: "Không gian công viên nội khu — thay ảnh CĐT",
    },
  ],
} as const;

export const HOUSEX_RIVERSIDE_DEMO_IMAGES = {
  hero: {
    url: u("photo-1613490493576-7fde63acd811", 1920, 720),
    alt: "Căn hộ ven sông cao cấp — minh hoạ HouseX Riverside",
  },
  locationMap: {
    url: u("photo-1512917774080-9991f1c4c750", 1200, 900),
    alt: "Minh hoạ kết nối HouseX Riverside tới Phú Mỹ Hưng và Quận 1",
    caption: "Minh hoạ bán kính ~5 km — thay bản đồ thiết kế",
  },
  gallery: [
    {
      url: u("photo-1512917774080-9991f1c4c750", 1920, 1080),
      caption: "View sông buổi tối",
    },
    {
      url: u("photo-1600596542815-ffad4c1539a9", 1920, 1080),
      caption: "Phối cảnh căn hộ cao cấp",
    },
    {
      url: u("photo-1600566752354-46a8b8f8dfc0", 1920, 1080),
      caption: "Không gian sống ven sông",
    },
  ],
} as const;
