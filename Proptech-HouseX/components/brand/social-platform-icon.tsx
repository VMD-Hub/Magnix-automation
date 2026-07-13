import Image from "next/image";
import type { ProfileSocialIconId } from "@/lib/personal-brand/vu-nguyen/profile-social";
import { cn } from "@/lib/ui/cn";

/** Logo Zalo chính thức — vòng tròn xanh + chữ Zalo (nguồn brand asset). */
export const ZALO_OFFICIAL_LOGO_SRC = "/brand/social/zalo-logo.png" as const;

/** Logo Telegram chính thức — vòng tròn xanh + máy bay giấy (nguồn brand asset). */
export const TELEGRAM_OFFICIAL_LOGO_SRC =
  "/brand/social/telegram-logo.png" as const;

const GLYPH = "h-[1.35rem] w-[1.35rem]";

type Props = {
  id: ProfileSocialIconId;
  className?: string;
};

/** Logo nền tảng — glyph trắng trên nền brand (Simple Icons / brand guidelines). */
export function SocialPlatformIcon({ id, className }: Props) {
  switch (id) {
    case "zalo":
      return (
        <Image
          src={ZALO_OFFICIAL_LOGO_SRC}
          alt=""
          width={44}
          height={44}
          className={cn("h-full w-full object-cover", className)}
          aria-hidden
        />
      );
    case "phone":
      return (
        <svg
          viewBox="0 0 24 24"
          className={cn(GLYPH, className)}
          aria-hidden
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={cn(GLYPH, className)} aria-hidden>
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.78 1.78 0 1 1 0-3.56 1.78 1.78 0 0 1 0 3.56zM7.119 20.452H3.555V9h3.564v11.452z"
          />
        </svg>
      );
    case "telegram":
      return (
        <Image
          src={TELEGRAM_OFFICIAL_LOGO_SRC}
          alt=""
          width={44}
          height={44}
          className={cn("h-full w-full object-cover", className)}
          aria-hidden
        />
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={cn(GLYPH, className)} aria-hidden>
          <path
            fill="currentColor"
            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={cn(GLYPH, className)} aria-hidden>
          <path
            fill="currentColor"
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={cn(GLYPH, className)} aria-hidden>
          <path
            fill="currentColor"
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          />
        </svg>
      );
  }
}

export const SOCIAL_PLATFORM_SHELL: Record<
  ProfileSocialIconId,
  string
> = {
  zalo: "overflow-hidden border-0 bg-transparent p-0 shadow-md hover:shadow-lg",
  phone: "bg-[#34C759] border-[#34C759] text-white hover:bg-[#2db34e]",
  linkedin: "bg-[#0A66C2] border-[#0A66C2] text-white hover:bg-[#095196]",
  telegram:
    "overflow-hidden border-0 bg-transparent p-0 shadow-md hover:shadow-lg",
  facebook: "bg-[#1877F2] border-[#1877F2] text-white hover:bg-[#1467d3]",
  youtube: "bg-[#FF0000] border-[#FF0000] text-white hover:bg-[#e00000]",
  tiktok: "bg-[#000000] border-[#000000] text-white hover:bg-[#1a1a1a]",
};
