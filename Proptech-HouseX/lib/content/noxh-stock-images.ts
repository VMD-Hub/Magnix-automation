import type { ProjectLanding } from "@/lib/content/project-landing";
import { isSafeImageUrl } from "@/lib/content/safe-image";

/**
 * Ảnh minh hoạ NOXH — CHỈ dùng ảnh local trong /public (không hotlink bên thứ ba,
 * không Unsplash). Trước đây stock dùng Unsplash nhưng nhiều ID đã chết (404) khiến
 * landing "mất ảnh" → nay chốt toàn bộ về ảnh local đã versioned trong repo.
 */
const IMG = {
  civicDay: "/images/hero/housex-hero-slide-01-civic-center-1920.jpg",
  metroHub: "/images/hero/housex-hero-slide-02-metro-hub-1920.jpg",
  skylineDay: "/images/hero/hcmc-skyline-river-day.webp",
  skylineNight: "/images/hero/hcmc-skyline-river-night.webp",
  bitexcoDay: "/images/hero/hcmc-bitexco-metro-day.webp",
  bitexcoNight: "/images/hero/hcmc-bitexco-metro-night.webp",
  thuThiemDay: "/images/hero/housex-thu-thiem-civic-center-day.webp",
  thuThiemNight: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  urbanGolden: "/images/hero/urban-skyline-golden-hour.jpg",
} as const;

type NoxhStockPack = {
  hero: { url: string; alt: string };
  locationMap?: { url: string; alt: string; caption?: string };
  gallery: { url: string; caption?: string }[];
};

function pack(
  heroUrl: string,
  heroAlt: string,
  gallery: { url: string; caption: string }[],
  mapUrl: string = IMG.skylineNight,
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
    IMG.skylineDay,
    "Eco Residence Long Bình Tân — nhà ở xã hội Biên Hòa",
    [
      { url: IMG.skylineDay, caption: "Phối cảnh khu NOXH" },
      { url: IMG.urbanGolden, caption: "Không gian xanh nội khu" },
      { url: IMG.metroHub, caption: "Block căn hộ NOXH" },
    ],
  ),
  "chung-cu-phuc-loc-tho-noxh": pack(
    IMG.bitexcoDay,
    "Chung cư Phúc Lộc Thọ — NOXH Thủ Đức",
    [
      { url: IMG.bitexcoDay, caption: "Mặt tiền chung cư NOXH" },
      { url: IMG.thuThiemDay, caption: "Nhà mẫu căn hộ" },
    ],
  ),
  "dragon-e-home-phu-huu": pack(
    IMG.metroHub,
    "Dragon E-Home — NOXH Dragon Village",
    [
      { url: IMG.metroHub, caption: "Phối cảnh dự án" },
      { url: IMG.skylineNight, caption: "Không gian sống" },
    ],
  ),
  "thu-thiem-green-house-thu-duc": pack(
    IMG.thuThiemDay,
    "Thủ Thiêm Green House — NOXH Quận 2",
    [
      { url: IMG.thuThiemDay, caption: "Phối cảnh Green House" },
      { url: IMG.thuThiemNight, caption: "Cảnh quan nội khu" },
    ],
  ),
  "nha-o-xa-hoi-ly-thuong-kiet": pack(
    IMG.civicDay,
    "Nhà ở xã hội Lý Thường Kiệt — Quận 10",
    [
      { url: IMG.civicDay, caption: "Phối cảnh NOXH trung tâm" },
      { url: IMG.bitexcoNight, caption: "Mặt bằng block cao tầng" },
    ],
  ),
  "noxh-kdc-chang-song-phuoc-tan": pack(
    IMG.urbanGolden,
    "NOXH KDC Chàng Sông — Phước Tân Biên Hòa",
    [
      { url: IMG.urbanGolden, caption: "Khu NOXH Phước Tân" },
      { url: IMG.skylineDay, caption: "Quy hoạch khu dân cư" },
    ],
  ),
  "nha-o-xa-hoi-nam-long-2-can-tho": pack(
    IMG.skylineNight,
    "Nhà ở xã hội Nam Long 2 — Cần Thơ",
    [
      { url: IMG.skylineNight, caption: "Block NOXH Nam Long 2" },
      { url: IMG.bitexcoDay, caption: "Mặt bằng tầng điển hình" },
    ],
  ),
  "nha-o-xa-hoi-nam-long-hong-phat-can-tho": pack(
    IMG.bitexcoNight,
    "Nhà ở xã hội Nam Long – Hồng Phát Cần Thơ",
    [
      { url: IMG.bitexcoNight, caption: "Chung cư NOXH Cái Răng" },
      { url: IMG.metroHub, caption: "Layout căn hộ mẫu" },
    ],
  ),
  "noxh-la-home-luong-hoa-ben-luc": pack(
    IMG.metroHub,
    "NOXH LA Home — KĐT sinh thái Bến Lức",
    [
      { url: IMG.metroHub, caption: "Phân khu NOXH LA Home" },
      { url: IMG.skylineDay, caption: "Block căn hộ 8 tầng" },
    ],
  ),
  "nha-o-xa-hoi-my-hanh-duc-hoa": pack(
    IMG.bitexcoDay,
    "NOXH Mỹ Hạnh Nam — Đức Hòa Long An",
    [
      { url: IMG.bitexcoDay, caption: "Chung cư NOXH Mỹ Hạnh" },
      { url: IMG.civicDay, caption: "Mặt bằng căn điển hình" },
    ],
  ),
  "the-ori-phuong-mai-my-hanh": pack(
    IMG.thuThiemNight,
    "The Ori Phương Mai — NOXH Mỹ Hạnh Nam",
    [
      { url: IMG.thuThiemNight, caption: "Phối cảnh The Ori Phương Mai" },
      { url: IMG.metroHub, caption: "Tiến độ triển khai NOXH" },
    ],
  ),
  "noxh-kdt-hau-nghia-duc-hoa": pack(
    IMG.civicDay,
    "NOXH Green Nestera — Vinhomes Hậu Nghĩa",
    [
      { url: IMG.civicDay, caption: "Phân khu Green Nestera Hậu Nghĩa" },
      { url: IMG.skylineNight, caption: "Masterplan KĐT NOXH" },
    ],
  ),
  "noxh-kdt-phuoc-vinh-tay-can-giuoc": pack(
    IMG.skylineDay,
    "NOXH Phước Vĩnh Tây — Cần Giuộc Long An",
    [
      { url: IMG.skylineDay, caption: "Đại đô thị Phước Vĩnh Tây" },
      { url: IMG.bitexcoNight, caption: "Quy hoạch NOXH cao tầng" },
    ],
  ),
  "noxh-phu-an-thanh-ben-luc": pack(
    IMG.urbanGolden,
    "NOXH Phú An Thạnh — Bến Lức Long An",
    [
      { url: IMG.urbanGolden, caption: "Khu nhà ở công nhân Phú An Thạnh" },
      { url: IMG.thuThiemDay, caption: "An cư gần KCN" },
    ],
  ),
  "nha-o-xa-hoi-ho-guom-xanh-thuan-an": pack(
    IMG.urbanGolden,
    "Nhà ở xã hội Hồ Gươm Xanh Thuận An Bình Dương — chung cư NOXH 5–12 tầng",
    [
      {
        url: IMG.urbanGolden,
        caption:
          "Phối cảnh nhà ở xã hội Hồ Gươm Xanh — phân khu chung cư NOXH 5–12 tầng Thuận An",
      },
      {
        url: IMG.metroHub,
        caption:
          "Kết nối nhà ở xã hội Hồ Gươm Xanh — Quốc lộ 13 Đại lộ Bình Dương cửa ngõ TP.HCM",
      },
      {
        url: IMG.skylineDay,
        caption:
          "Tiện ích nhà ở xã hội Hồ Gươm Xanh — hồ cảnh quan công viên nội khu Thuận An",
      },
    ],
  ),
};

/**
 * Rủi ro = KHÔNG nằm trong allowlist ảnh an toàn (xem `lib/content/safe-image.ts`).
 * Mọi hotlink CĐT bên thứ ba / http:// / domain lạ đều rủi ro → tự thay bằng stock.
 */
export function isRiskyNoxhImageUrl(url: string | undefined): boolean {
  return !isSafeImageUrl(url);
}

/** Bộ ảnh stock mặc định — dùng cho slug NOXH chưa có bộ riêng, để KHÔNG bao giờ mất ảnh. */
const DEFAULT_NOXH_STOCK: NoxhStockPack = pack(
  IMG.skylineDay,
  "Dự án nhà ở xã hội",
  [
    { url: IMG.skylineDay, caption: "Phối cảnh khu nhà ở xã hội" },
    { url: IMG.urbanGolden, caption: "Không gian sống nội khu" },
    { url: IMG.metroHub, caption: "Block căn hộ NOXH" },
  ],
);

/** DTA giữ ảnh đã nội bộ hóa trong /public (không cần thay bằng stock). */
export function ensureNoxhLandingMedia(
  landing: ProjectLanding,
  slug: string,
): ProjectLanding {
  if (slug === "dta-happy-home-nhon-trach") return landing;

  const stock = NOXH_STOCK_BY_SLUG[slug] ?? DEFAULT_NOXH_STOCK;

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
