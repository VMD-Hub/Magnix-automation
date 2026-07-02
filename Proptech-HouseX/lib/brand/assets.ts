/**
 * HouseX brand assets — registry tập trung.
 * File vật lý: `public/brand/**` · SVG favicon: `app/icon.svg` (sync qua npm run brand:sync-favicon).
 */

export type BrandRasterAsset = {
  /** URL public, bắt đầu bằng `/brand/…` */
  path: string;
  /** Gợi ý dùng — không ràng buộc runtime */
  usage: string;
  /** Alt rỗng cho decorative images */
  decorative: true;
};

export const BRAND_ASSETS = {
  /** Cỏ bốn lá vàng kim 3D (PNG) — banner / marketing */
  clover: {
    /** 4 lá + cuống xoắn — hero chính, góc phải/trái */
    gold3dStem: {
      path: "/brand/clover/gold-3d-stem.png",
      usage: "Hero banner lớn (sm+), accent luxury có cuống",
      decorative: true,
    },
    /** Chỉ 4 lá, không cuống — accent gọn */
    gold3dPlain: {
      path: "/brand/clover/gold-3d-plain.png",
      usage: "Accent phụ hero, card, watermark nhỏ",
      decorative: true,
    },
  },

  /** HouseX Mark Iteration 3 — vector (SVG), không phải PNG */
  housex: {
    /** Favicon + PWA — sinh từ housex-mark.config */
    favicon: {
      path: "/icon.svg",
      usage: "Tab trình duyệt, shortcut — npm run brand:sync-favicon",
      decorative: true,
    },
  },
} as const satisfies Record<string, Record<string, BrandRasterAsset>>;

/** @deprecated Dùng `BRAND_ASSETS.clover.gold3dStem.path` */
export const CLOVER_LUXURY_IMAGE = BRAND_ASSETS.clover.gold3dStem.path;

/** @deprecated Dùng `BRAND_ASSETS.clover.gold3dPlain.path` */
export const CLOVER_LUXURY_PLAIN_IMAGE = BRAND_ASSETS.clover.gold3dPlain.path;

export function brandAssetPath(
  group: keyof typeof BRAND_ASSETS,
  key: string,
): string {
  const entry = BRAND_ASSETS[group][key as keyof (typeof BRAND_ASSETS)[typeof group]];
  return (entry as BrandRasterAsset).path;
}
