import {
  BRAND_TAGLINE,
  BRAND_TAGLINE_HEADER,
} from "@/lib/content/messaging/brand";
import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";

/** Tên thương hiệu — luôn có khoảng trắng: House X (tránh đọc nhầm). */
export const BRAND_NAME = "House X" as const;

export { BRAND_TAGLINE, BRAND_TAGLINE_HEADER };

export function getBrandName(): string {
  return BRAND_NAME;
}

export function getBrandTagline(): string {
  return process.env.NEXT_PUBLIC_BRAND_TAGLINE?.trim() || BRAND_TAGLINE;
}

export function getBrandTaglineHeader(): string {
  return (
    process.env.NEXT_PUBLIC_BRAND_TAGLINE_HEADER?.trim() || BRAND_TAGLINE_HEADER
  );
}

/** Hero trang chủ — poster tĩnh (slide 1). Override: NEXT_PUBLIC_HERO_IMAGE_URL */
const DEFAULT_HERO_IMAGE = HOUSEX_HERO_SLIDES[0]!.jpg;

/** @deprecated Dùng getHeroSlides() — giữ tương thích env cũ. */
export const CINEMATIC_HERO_DAY = HOUSEX_HERO_SLIDES[0]!.jpg;
export const CINEMATIC_HERO_NIGHT = HOUSEX_HERO_SLIDES[0]!.jpg;
export const CINEMATIC_HERO_DAY_WEBP = HOUSEX_HERO_SLIDES[0]!.webp;
export const CINEMATIC_HERO_NIGHT_WEBP = HOUSEX_HERO_SLIDES[0]!.webp;
export const CINEMATIC_HERO_POSTER = CINEMATIC_HERO_DAY;

export function getHeroSlides() {
  return HOUSEX_HERO_SLIDES;
}

export function getHeroBackgroundImage(): string {
  return process.env.NEXT_PUBLIC_HERO_IMAGE_URL?.trim() || DEFAULT_HERO_IMAGE;
}

export function getCinematicHeroDay(): string {
  return (
    process.env.NEXT_PUBLIC_CINEMATIC_HERO_DAY?.trim() || CINEMATIC_HERO_DAY
  );
}

export function getCinematicHeroNight(): string {
  return (
    process.env.NEXT_PUBLIC_CINEMATIC_HERO_NIGHT?.trim() || CINEMATIC_HERO_NIGHT
  );
}

export function getCinematicHeroDayWebp(): string {
  return (
    process.env.NEXT_PUBLIC_CINEMATIC_HERO_DAY_WEBP?.trim() ||
    CINEMATIC_HERO_DAY_WEBP
  );
}

export function getCinematicHeroNightWebp(): string {
  return (
    process.env.NEXT_PUBLIC_CINEMATIC_HERO_NIGHT_WEBP?.trim() ||
    CINEMATIC_HERO_NIGHT_WEBP
  );
}

/** Fallback một URL — trả về ảnh ngày. */
export function getCinematicHeroPoster(): string {
  return (
    process.env.NEXT_PUBLIC_CINEMATIC_HERO_POSTER?.trim() ||
    getCinematicHeroDay()
  );
}

/** Domain production mặc định khi chưa có housex.vn. */
const PRODUCTION_SITE_URL = "https://timnhaxahoi.com";

/** URL gốc site — canonical, OG, sitemap, JSON-LD, QR danh thiếp. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const normalized = fromEnv.replace(/\/$/, "");
    if (
      process.env.NODE_ENV === "production" &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)
    ) {
      return PRODUCTION_SITE_URL;
    }
    return normalized;
  }
  if (process.env.NODE_ENV === "production") return PRODUCTION_SITE_URL;
  return "http://localhost:3000";
}

export function getSiteHostname(): string {
  try {
    return new URL(getSiteUrl()).hostname;
  } catch {
    return "timnhaxahoi.com";
  }
}

const DEFAULT_SUPPORT_EMAIL = "vunguyen@timnhaxahoi.com";
const DEFAULT_SUPPORT_PHONE_DISPLAY = "0826 600 800";
const DEFAULT_SUPPORT_PHONE_TEL = "0826600800";

/** Email hỗ trợ hiển thị public (footer, liên hệ, bảo mật). */
export function getSupportEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_SUPPORT_EMAIL;
}

/** Hotline hiển thị (có thể override bằng NEXT_PUBLIC_SUPPORT_PHONE). */
export function getSupportPhoneDisplay(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_SUPPORT_PHONE_DISPLAY;
}

/** Số gọi tel: — NEXT_PUBLIC_SUPPORT_PHONE_TEL hoặc rút từ SUPPORT_PHONE. */
export function getSupportPhoneTel(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE_TEL?.trim() ||
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\D/g, "");
  const digits = (fromEnv || DEFAULT_SUPPORT_PHONE_TEL).replace(/\D/g, "");
  if (digits.startsWith("84")) return `+${digits}`;
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  return `+84${digits}`;
}

export type SocialChannel = {
  id: "zalo" | "tiktok" | "youtube" | "facebook";
  label: string;
  href: string | null;
};

function firstNonEmpty(...candidates: Array<string | undefined | null>): string | null {
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return null;
}

function asHttpUrlOrId(raw: string, idToUrl: (id: string) => string): string {
  if (/^https?:\/\//i.test(raw)) return raw;
  return idToUrl(raw.replace(/^\/+/, ""));
}

/**
 * Link công khai Zalo OA (footer / Kết nối).
 * Không dùng ZALO_APP_ID (đó là App developers, không phải link OA).
 */
export function getHouseXZaloOaPublicUrl(): string | null {
  const full = firstNonEmpty(
    process.env.NEXT_PUBLIC_SOCIAL_ZALO_URL,
    process.env.NEXT_PUBLIC_ZALO_OA_PUBLIC_URL,
    process.env.SOCIAL_ZALO_URL,
    process.env.ZALO_OA_PUBLIC_URL,
  );
  if (full) return asHttpUrlOrId(full, (id) => `https://zalo.me/${id}`);

  const id = firstNonEmpty(
    process.env.NEXT_PUBLIC_ZALO_OA_ID,
    process.env.ZALO_OA_ID,
  );
  if (!id) return null;
  return asHttpUrlOrId(id, (oaId) => `https://zalo.me/${oaId}`);
}

/**
 * Link Fanpage Facebook (footer).
 * Chấp nhận URL đầy đủ hoặc page id / username.
 * Fallback công khai: page timnhaxahoi (không phải secret).
 */
const DEFAULT_FACEBOOK_PAGE_URL =
  "https://www.facebook.com/timnhaxahoi" as const;

export function getHouseXFacebookPageUrl(): string | null {
  const full = firstNonEmpty(
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL,
    process.env.SOCIAL_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL,
    process.env.FACEBOOK_PAGE_URL,
    process.env.NEXT_PUBLIC_FANPAGE_URL,
    process.env.FANPAGE_URL,
  );
  if (full) {
    return asHttpUrlOrId(full, (id) => `https://www.facebook.com/${id}`);
  }

  const id = firstNonEmpty(
    process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
    process.env.FACEBOOK_PAGE_ID,
    process.env.NEXT_PUBLIC_FB_PAGE_ID,
    process.env.FB_PAGE_ID,
    process.env.NEXT_PUBLIC_FANPAGE_ID,
    process.env.FANPAGE_ID,
    process.env.META_PAGE_ID,
  );
  if (id) {
    return asHttpUrlOrId(id, (pageId) => `https://www.facebook.com/${pageId}`);
  }

  return DEFAULT_FACEBOOK_PAGE_URL;
}

/** Liên kết mạng xã hội — bổ sung URL/ID trong env khi sẵn sàng. */
export function getSocialChannels(): SocialChannel[] {
  return [
    {
      id: "zalo",
      label: "Zalo OA",
      href: getHouseXZaloOaPublicUrl(),
    },
    {
      id: "facebook",
      label: "Fanpage",
      href: getHouseXFacebookPageUrl(),
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: firstNonEmpty(
        process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL,
        process.env.SOCIAL_TIKTOK_URL,
      ),
    },
    {
      id: "youtube",
      label: "YouTube",
      href: firstNonEmpty(
        process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL,
        process.env.SOCIAL_YOUTUBE_URL,
      ),
    },
  ];
}

/** From header gửi email transactional (Resend / webhook). */
export function getNoreplyFrom(): string {
  const fromEnv = process.env.EMAIL_FROM?.trim();
  if (fromEnv) return fromEnv;
  return `House X <noreply@${getSiteHostname()}>`;
}
