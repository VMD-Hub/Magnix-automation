import type { ProjectLanding } from "@/lib/content/project-landing";

/** Ảnh minh hoạ NOXH host sẵn — Unsplash + hero HouseX (không hotlink CĐT dễ gãy). */
function u(photoId: string, w: number, h: number) {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

const LOCAL_HERO_1 = "/images/hero/housex-hero-slide-01-civic-center-1920.jpg";
const LOCAL_HERO_2 = "/images/hero/housex-hero-slide-02-metro-hub-1920.jpg";

type NoxhStockPack = {
  hero: { url: string; alt: string };
  locationMap?: { url: string; alt: string; caption?: string };
  gallery: { url: string; caption?: string }[];
};

function pack(
  heroUrl: string,
  heroAlt: string,
  gallery: { url: string; caption: string }[],
  mapUrl = u("photo-1477959856447-4f5c817a4a3f", 1200, 900),
): NoxhStockPack {
  return {
    hero: { url: heroUrl, alt: heroAlt },
    locationMap: {
      url: mapUrl,
      alt: `Minh hoạ kết nối vùng — ${heroAlt}`,
      caption: "Minh hoạ kết nối vùng — cập nhật bản đồ chính thức khi CĐT công bố",
    },
    gallery,
  };
}

/** Mỗi slug NOXH có bộ ảnh riêng — tránh thẻ catalog trùng một hình. */
export const NOXH_STOCK_BY_SLUG: Record<string, NoxhStockPack> = {
  "eco-residence-long-binh-tan": pack(
    u("photo-1600566753190-17f0baa2a6a3", 1920, 720),
    "Eco Residence Long Bình Tân — nhà ở xã hội Biên Hòa",
    [
      { url: u("photo-1600566753190-17f0baa2a6a3", 1600, 900), caption: "Phối cảnh khu NOXH" },
      { url: u("photo-1600047509800-ba3955280484", 1600, 900), caption: "Không gian xanh nội khu" },
      { url: u("photo-1600585154340-be6161a56a0c", 1600, 900), caption: "Block căn hộ NOXH" },
    ],
  ),
  "chung-cu-phuc-loc-tho-noxh": pack(
    u("photo-1600047509358-52dc686375e8", 1920, 720),
    "Chung cư Phúc Lộc Thọ — NOXH Thủ Đức",
    [
      { url: u("photo-1600047509358-52dc686375e8", 1600, 900), caption: "Mặt tiền chung cư NOXH" },
      { url: u("photo-1600607687939-ce8a6c25118c", 1600, 900), caption: "Nhà mẫu căn hộ" },
    ],
  ),
  "dragon-e-home-phu-huu": pack(
    u("photo-1600607687939-ce8a6c25118c", 1920, 720),
    "Dragon E-Home — NOXH Dragon Village",
    [
      { url: u("photo-1600607687939-ce8a6c25118c", 1600, 900), caption: "Phối cảnh dự án" },
      { url: u("photo-1600585154526-990dced4db0d", 1600, 900), caption: "Không gian sống" },
    ],
  ),
  "thu-thiem-green-house-thu-duc": pack(
    u("photo-1600047509800-ba3955280484", 1920, 720),
    "Thủ Thiêm Green House — NOXH Quận 2",
    [
      { url: u("photo-1600047509800-ba3955280484", 1600, 900), caption: "Phối cảnh Green House" },
      { url: u("photo-1600566752354-46a8b8f8dfc0", 1600, 900), caption: "Cảnh quan nội khu" },
    ],
  ),
  "nha-o-xa-hoi-ly-thuong-kiet": pack(
    u("photo-1600210492486-724fe641c782", 1920, 720),
    "Nhà ở xã hội Lý Thường Kiệt — Quận 10",
    [
      { url: u("photo-1600210492486-724fe641c782", 1600, 900), caption: "Phối cảnh NOXH trung tâm" },
      { url: u("photo-1600585154340-be6161a56a0c", 1600, 900), caption: "Mặt bằng block cao tầng" },
    ],
  ),
  "noxh-kdc-chang-song-phuoc-tan": pack(
    u("photo-1600585154526-990dced4db0d", 1920, 720),
    "NOXH KDC Chàng Sông — Phước Tân Biên Hòa",
    [
      { url: u("photo-1600585154526-990dced4db0d", 1600, 900), caption: "Khu NOXH Phước Tân" },
      { url: u("photo-1600566753190-17f0baa2a6a3", 1600, 900), caption: "Quy hoạch khu dân cư" },
    ],
  ),
  "nha-o-xa-hoi-nam-long-2-can-tho": pack(
    u("photo-1600585154340-be6161a56a0c", 1920, 720),
    "Nhà ở xã hội Nam Long 2 — Cần Thơ",
    [
      { url: u("photo-1600585154340-be6161a56a0c", 1600, 900), caption: "Block NOXH Nam Long 2" },
      { url: u("photo-1600047509358-52dc686375e8", 1600, 900), caption: "Mặt bằng tầng điển hình" },
    ],
  ),
  "nha-o-xa-hoi-nam-long-hong-phat-can-tho": pack(
    u("photo-1600566752354-46a8b8f8dfc0", 1920, 720),
    "Nhà ở xã hội Nam Long – Hồng Phát Cần Thơ",
    [
      { url: u("photo-1600566752354-46a8b8f8dfc0", 1600, 900), caption: "Chung cư NOXH Cái Răng" },
      { url: u("photo-1600607687939-ce8a6c25118c", 1600, 900), caption: "Layout căn hộ mẫu" },
    ],
  ),
  "noxh-la-home-luong-hoa-ben-luc": pack(
    LOCAL_HERO_2,
    "NOXH LA Home — KĐT sinh thái Bến Lức",
    [
      { url: LOCAL_HERO_2, caption: "Phân khu NOXH LA Home" },
      { url: u("photo-1600585154526-990dced4db0d", 1600, 900), caption: "Block căn hộ 8 tầng" },
    ],
  ),
  "nha-o-xa-hoi-my-hanh-duc-hoa": pack(
    u("photo-1600047509358-52dc686375e8", 1920, 720),
    "NOXH Mỹ Hạnh Nam — Đức Hòa Long An",
    [
      { url: u("photo-1600047509358-52dc686375e8", 1600, 900), caption: "Chung cư NOXH Mỹ Hạnh" },
      { url: u("photo-1600585154340-be6161a56a0c", 1600, 900), caption: "Mặt bằng căn điển hình" },
    ],
  ),
  "the-ori-phuong-mai-my-hanh": pack(
    u("photo-1600566753190-17f0baa2a6a3", 1920, 720),
    "The Ori Phương Mai — NOXH Mỹ Hạnh Nam",
    [
      { url: u("photo-1600566753190-17f0baa2a6a3", 1600, 900), caption: "Phối cảnh The Ori Phương Mai" },
      { url: u("photo-1600607687939-ce8a6c25118c", 1600, 900), caption: "Tiến độ triển khai NOXH" },
    ],
  ),
  "noxh-kdt-hau-nghia-duc-hoa": pack(
    LOCAL_HERO_1,
    "NOXH Green Nestera — Vinhomes Hậu Nghĩa",
    [
      { url: LOCAL_HERO_1, caption: "Phân khu Green Nestera Hậu Nghĩa" },
      { url: u("photo-1600047509800-ba3955280484", 1600, 900), caption: "Masterplan KĐT NOXH" },
    ],
  ),
  "noxh-kdt-phuoc-vinh-tay-can-giuoc": pack(
    u("photo-1600585154526-990dced4db0d", 1920, 720),
    "NOXH Phước Vĩnh Tây — Cần Giuộc Long An",
    [
      { url: u("photo-1600585154526-990dced4db0d", 1600, 900), caption: "Đại đô thị Phước Vĩnh Tây" },
      { url: u("photo-1600566752354-46a8b8f8dfc0", 1600, 900), caption: "Quy hoạch NOXH cao tầng" },
    ],
  ),
  "noxh-phu-an-thanh-ben-luc": pack(
    u("photo-1600210492486-724fe641c782", 1920, 720),
    "NOXH Phú An Thạnh — Bến Lức Long An",
    [
      { url: u("photo-1600210492486-724fe641c782", 1600, 900), caption: "Khu nhà ở công nhân Phú An Thạnh" },
      { url: u("photo-1600585154340-be6161a56a0c", 1600, 900), caption: "An cư gần KCN" },
    ],
  ),
};

/** Host/domain ảnh CĐT thường trả HTML hoặc 404 khi hotlink. */
const RISKY_IMAGE_PATTERNS = [
  /^http:\/\//i,
  /bhsmiennam\.vn/i,
  /tinbds\.com/i,
  /khudancuphuanthanh\.com/i,
  /vin\.city/i,
  /odt\.vn\/wp-content/i,
];

export function isRiskyNoxhImageUrl(url: string | undefined): boolean {
  if (!url?.trim()) return true;
  return RISKY_IMAGE_PATTERNS.some((re) => re.test(url));
}

/** DTA giữ ảnh CĐT đã xác minh wp-content. */
export function ensureNoxhLandingMedia(
  landing: ProjectLanding,
  slug: string,
): ProjectLanding {
  if (slug === "dta-happy-home-nhon-trach") return landing;

  const stock = NOXH_STOCK_BY_SLUG[slug];
  if (!stock) return landing;

  const next: ProjectLanding = { ...landing, gallery: [...landing.gallery] };

  if (isRiskyNoxhImageUrl(next.heroImage?.url)) {
    next.heroImage = { ...stock.hero };
  }

  if (isRiskyNoxhImageUrl(next.locationMapImage?.url) && stock.locationMap) {
    next.locationMapImage = { ...stock.locationMap };
  }

  const galleryOk =
    next.gallery.length >= 2 &&
    next.gallery.every((g) => !isRiskyNoxhImageUrl(g.url));

  if (!galleryOk) {
    next.gallery = stock.gallery.map((g) => ({ ...g }));
  }

  return next;
}

export function getNoxhStockHeroUrl(slug: string): string | null {
  if (slug === "dta-happy-home-nhon-trach") return null;
  return NOXH_STOCK_BY_SLUG[slug]?.hero.url ?? null;
}
