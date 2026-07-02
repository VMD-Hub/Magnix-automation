/** Ảnh minh hoạ Riverside — admin thay bằng ảnh CĐT trên CDN trước go-live. */
function u(photoId: string, w: number, h: number) {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

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
