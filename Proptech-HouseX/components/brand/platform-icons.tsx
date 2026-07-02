import type { ReactNode } from "react";
import type { SocialChannel } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

type IconProps = { className?: string };

/** Màu chuẩn thương hiệu — không pha gradient tùy ý. */
export const PLATFORM_BRAND_COLORS = {
  zalo: "#0068FF",
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
  tiktokCyan: "#25F4EE",
  tiktokPink: "#FE2C55",
} as const;

export function ZaloIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.76 1.5 5.22 3.86 6.78L5 22l4.89-2.7c.68.1 1.38.15 2.11.15 5.52 0 10-3.82 10-8.5S17.52 2 12 2zm-1.1 11.5H8.4V8.9h2.5v4.6zm3.2 0h-2.5V8.9h2.5v4.6zm3.2 0h-2.5V8.9h2.5v4.6z" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.6 5.82s.51.5 3.4 1.46V9.9c-.96-.03-1.92-.28-2.76-.72v6.83a5.28 5.28 0 1 1-5.24-5.33c.11 0 .22.01.33.02v2.65a2.63 2.63 0 1 0 1.88 2.52V2h2.79a4.02 4.02 0 0 0 3.6 3.82z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M21.58 7.2a2.75 2.75 0 0 0-1.94-1.95C18.25 5 12 5 12 5s-6.25 0-7.64.25A2.75 2.75 0 0 0 2.42 7.2 28.8 28.8 0 0 0 2.17 12a28.8 28.8 0 0 0 .25 4.8 2.75 2.75 0 0 0 1.94 1.95C5.75 19 12 19 12 19s6.25 0 7.64-.25a2.75 2.75 0 0 0 1.94-1.95A28.8 28.8 0 0 0 21.83 12a28.8 28.8 0 0 0-.25-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.75-1.6 1.5V12H16l-.5 3h-2.5v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

const PLATFORM_STYLE: Record<
  SocialChannel["id"],
  { bg: string; text: string; glow: string; Icon: (props: IconProps) => ReactNode }
> = {
  zalo: {
    bg: "bg-[#0068FF]",
    text: "text-white",
    glow: "hover:shadow-[#0068FF40]",
    Icon: ZaloIcon,
  },
  tiktok: {
    bg: "bg-[#000000] ring-1 ring-[#25F4EE]/30",
    text: "text-white",
    glow: "hover:shadow-[#FE2C5540]",
    Icon: TikTokIcon,
  },
  youtube: {
    bg: "bg-[#FF0000]",
    text: "text-white",
    glow: "hover:shadow-[#FF000040]",
    Icon: YouTubeIcon,
  },
  facebook: {
    bg: "bg-[#1877F2]",
    text: "text-white",
    glow: "hover:shadow-[#1877F240]",
    Icon: FacebookIcon,
  },
};

export function SocialPlatformIcon({
  id,
  className,
}: {
  id: SocialChannel["id"];
  className?: string;
}) {
  const { Icon } = PLATFORM_STYLE[id];
  return <Icon className={className} />;
}

export function socialPlatformStyle(id: SocialChannel["id"]) {
  return PLATFORM_STYLE[id];
}
