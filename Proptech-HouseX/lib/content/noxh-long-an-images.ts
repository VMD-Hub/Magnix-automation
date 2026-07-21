/**
 * Ảnh minh hoạ NOXH Long An. Các bộ đã tải về /public (LA Home, Nam Long/Mỹ Hạnh)
 * dùng đường dẫn local; các bộ chưa tải được vẫn để URL nguồn nhưng được
 * ensureNoxhLandingMedia tự thay bằng ảnh stock khi render (không bao giờ vỡ ảnh).
 */
export const NOXH_LA_IMAGES = {
  hero: {
    url: "/images/projects/la-home/hero.jpg",
    alt: "Nhà ở xã hội LA Home Bến Lức",
  },
  logo: "/images/projects/la-home/logo.png",
  map: {
    url: "/images/projects/la-home/map.webp",
    alt: "Vị trí NOXH LA Home Lương Hòa",
    caption: "KĐT sinh thái LA Home — cửa ngõ Bến Lức giáp TP.HCM",
  },
  gallery: [
    {
      url: "/images/projects/la-home/gallery-1.jpg",
      caption: "Block A, B — 8 tầng",
    },
    {
      url: "/images/projects/la-home/gallery-2.jpg",
      caption: "Tiện ích KĐT 100 ha",
    },
  ],
} as const;

export const NOXH_MY_HANH_IMAGES = {
  hero: {
    url: "/images/projects/nam-long-can-tho/hero.jpg",
    alt: "Nhà ở xã hội Mỹ Hạnh — minh hoạ chung cư NOXH",
  },
  logo: null,
  map: {
    url: "/images/projects/nam-long-can-tho/map.webp",
    alt: "Khu vực Mỹ Hạnh Nam, Đức Hòa",
    caption: "Gần QL1A — giáp ranh TP.HCM (minh hoạ khu vực)",
  },
  gallery: [
    {
      url: "/images/projects/nam-long-can-tho/layout-1.jpg",
      caption: "Layout căn 1PN ~31–34 m² (tham khảo)",
    },
  ],
} as const;

export const NOXH_ORI_IMAGES = {
  hero: {
    url: "https://bhsmiennam.vn/wp-content/uploads/2025/10/the-ori-phuong-mai-khoi-cong.jpg",
    alt: "The Ori Phương Mai khởi công",
  },
  logo: null,
  map: {
    url: "https://tinbds.com/wp-content/uploads/2024/12/the-ori-phuong-mai-vi-tri.jpg",
    alt: "Vị trí The Ori Phương Mai đường Gò Hưu",
    caption: "Gò Hưu, Mỹ Hạnh — gần Tỉnh lộ 8",
  },
  gallery: [
    {
      url: "https://bhsmiennam.vn/wp-content/uploads/2025/10/the-ori-phuong-mai-khoi-cong.jpg",
      caption: "Lễ khởi công 07/10/2025",
    },
  ],
} as const;

export const NOXH_HAU_NGHIA_IMAGES = {
  hero: {
    url: "https://odt.vn/wp-content/uploads/2025/12/green-nestera-vinhomes-hau-nghia.jpg",
    alt: "Green Nestera — NOXH Vinhomes Hậu Nghĩa",
  },
  logo: null,
  map: {
    url: "https://vinhomegreencity.com.vn/wp-content/uploads/2024/08/vinhomes-green-city-hau-nghia-ban-do.jpg",
    alt: "Vinhomes Green City Hậu Nghĩa",
    caption: "Nguyễn Thị Hạnh — cửa ngõ KĐT ~192 ha",
  },
  gallery: [
    {
      url: "https://odt.vn/wp-content/uploads/2025/12/green-nestera-vinhomes-hau-nghia.jpg",
      caption: "Phân khu Green Nestera — khởi công 12/2025",
    },
  ],
} as const;

export const NOXH_PVT_IMAGES = {
  hero: {
    url: "https://vin.city/wp-content/uploads/2024/06/khu-do-thi-moi-phuoc-vinh-tay-vinhomes.jpg",
    alt: "KĐT mới Phước Vĩnh Tây",
  },
  logo: null,
  map: {
    url: "https://vin.city/wp-content/uploads/2024/06/khu-do-thi-moi-phuoc-vinh-tay-vinhomes.jpg",
    alt: "Quy hoạch KĐT Phước Vĩnh Tây Cần Giuộc",
    caption: "Quy mô ~1.090 ha — Vinhomes & VIG",
  },
  gallery: [
    {
      url: "https://vin.city/wp-content/uploads/2024/06/khu-do-thi-moi-phuoc-vinh-tay-vinhomes.jpg",
      caption: "Masterplan KĐT Phước Vĩnh Tây",
    },
  ],
} as const;

export const NOXH_PHU_AN_IMAGES = {
  hero: {
    url: "http://khudancuphuanthanh.com/images/slide/slide1.jpg",
    alt: "Khu nhà ở chuyên gia Phú An Thạnh",
  },
  logo: null,
  map: {
    url: "http://khudancuphuanthanh.com/images/slide/slide1.jpg",
    alt: "KDC Phú An Thạnh — Tỉnh lộ 830",
    caption: "Cạnh KCN Phú An Thạnh, Bến Lức",
  },
  gallery: [
    {
      url: "http://khudancuphuanthanh.com/images/slide/slide1.jpg",
      caption: "Khu nhà ở chuyên gia — công nhân KCN",
    },
  ],
} as const;
