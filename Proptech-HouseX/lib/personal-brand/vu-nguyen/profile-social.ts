/**
 * Liên kết icon trên digital name card — chỉ hiển thị khi có URL.
 */

import { getVuNguyenZaloUrl } from "@/lib/personal-brand/vu-nguyen/profile-content";
import { getSocialChannels, getSupportPhoneTel } from "@/lib/site-config";

export type ProfileSocialIconId =
  | "zalo"
  | "phone"
  | "linkedin"
  | "telegram"
  | "facebook"
  | "youtube"
  | "tiktok";

export type ProfileSocialLink = {
  id: ProfileSocialIconId;
  label: string;
  href?: string;
  external?: boolean;
  /** Chưa cấu hình URL — hiển thị logo, không click. */
  disabled?: boolean;
};

function getLinkedInUrl(): string | null {
  const fromVu = process.env.NEXT_PUBLIC_VU_NGUYEN_LINKEDIN_URL?.trim();
  if (fromVu) return fromVu;
  const fromSocial = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL?.trim();
  return fromSocial || null;
}

function getTelegramUrl(): string | null {
  const fromVu = process.env.NEXT_PUBLIC_VU_NGUYEN_TELEGRAM_URL?.trim();
  if (fromVu) return fromVu;
  const fromSocial = process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM_URL?.trim();
  return fromSocial || null;
}

/** Hàng icon — luôn hiện Điện thoại · Zalo · Telegram · LinkedIn; MXH khác khi có URL. */
export function getVuNguyenProfileSocialLinks(): ProfileSocialLink[] {
  const socialById = new Map(
    getSocialChannels().map((ch) => [ch.id, ch.href] as const),
  );

  const linkedin = getLinkedInUrl();
  const telegram = getTelegramUrl();

  const links: ProfileSocialLink[] = [
    {
      id: "phone",
      label: "Gọi điện",
      href: `tel:${getSupportPhoneTel()}`,
    },
    {
      id: "zalo",
      label: "Zalo",
      href: getVuNguyenZaloUrl(),
      external: true,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: telegram ?? undefined,
      external: true,
      disabled: !telegram,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: linkedin ?? undefined,
      external: true,
      disabled: !linkedin,
    },
  ];

  const facebook = socialById.get("facebook");
  if (facebook) {
    links.push({
      id: "facebook",
      label: "Facebook",
      href: facebook,
      external: true,
    });
  }

  const youtube = socialById.get("youtube");
  if (youtube) {
    links.push({
      id: "youtube",
      label: "YouTube",
      href: youtube,
      external: true,
    });
  }

  const tiktok = socialById.get("tiktok");
  if (tiktok) {
    links.push({
      id: "tiktok",
      label: "TikTok",
      href: tiktok,
      external: true,
    });
  }

  return links;
}
