import Link from "next/link";
import {
  SOCIAL_PLATFORM_SHELL,
  SocialPlatformIcon,
} from "@/components/brand/social-platform-icon";
import { getVuNguyenProfileSocialLinks } from "@/lib/personal-brand/vu-nguyen/profile-social";
import { cn } from "@/lib/ui/cn";

type Props = {
  className?: string;
};

const ICON_SHELL = cn(
  "inline-flex h-11 w-11 items-center justify-center rounded-full",
  "transition-[transform,box-shadow,background-color]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
);

function iconShellClass(id: Parameters<typeof SocialPlatformIcon>[0]["id"]) {
  return cn(
    ICON_SHELL,
    id === "zalo" || id === "telegram"
      ? "border-0 p-0"
      : "border shadow-sm hover:shadow-md",
    SOCIAL_PLATFORM_SHELL[id],
  );
}

export function ProfileSocialIcons({ className }: Props) {
  const links = getVuNguyenProfileSocialLinks();

  return (
    <nav
      aria-label="Liên hệ & mạng xã hội"
      className={cn("flex flex-wrap justify-center gap-2.5", className)}
    >
      {links.map((link) => {
        if (link.disabled || !link.href) {
          return (
            <span
              key={link.id}
              role="img"
              aria-label={`${link.label} — sắp có`}
              title={`${link.label} — sắp có`}
              className={cn(iconShellClass(link.id), "cursor-default opacity-55")}
            >
              <SocialPlatformIcon id={link.id} />
            </span>
          );
        }

        return (
          <Link
            key={link.id}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            className={cn(iconShellClass(link.id), "hover:scale-105")}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <SocialPlatformIcon id={link.id} />
          </Link>
        );
      })}
    </nav>
  );
}
