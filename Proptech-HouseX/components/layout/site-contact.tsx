import type { ReactNode } from "react";
import {
  getSocialChannels,
  getSupportEmail,
  getSupportPhoneDisplay,
  getSupportPhoneTel,
} from "@/lib/site-config";
import { SocialConnect } from "@/components/ui/social-connect";
import { cn } from "@/lib/ui/cn";

type SiteContactProps = {
  variant?: "light" | "dark" | "footerRuby";
  showSocial?: boolean;
  className?: string;
};

function ContactRow({
  icon,
  label,
  children,
  variant,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  variant: "light" | "dark" | "footerRuby";
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm",
          variant === "footerRuby"
            ? "bg-gold-500/15 text-gold-400 ring-1 ring-gold-400/35"
            : variant === "dark"
            ? "bg-white/5 text-brand-300 ring-1 ring-white/10"
            : "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <p
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            variant === "footerRuby"
              ? "text-gold-500"
              : variant === "dark"
              ? "text-slate-500"
              : "text-slate-400",
          )}
        >
          {label}
        </p>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function SiteContact({
  variant = "light",
  showSocial = true,
  className,
}: SiteContactProps) {
  const email = getSupportEmail();
  const phoneDisplay = getSupportPhoneDisplay();
  const phoneTel = getSupportPhoneTel();
  const channels = getSocialChannels();

  const linkClass =
    variant === "footerRuby"
      ? "font-semibold text-white hover:text-gold-300 transition-colors"
      : variant === "dark"
      ? "font-semibold text-white hover:text-brand-300 transition-colors"
      : "font-semibold text-slate-900 hover:text-brand-700 transition-colors";

  const emailClass =
    variant === "footerRuby"
      ? "text-gold-300 hover:text-gold-200 transition-colors break-all"
      : variant === "dark"
      ? "text-brand-300 hover:text-brand-200 transition-colors break-all"
      : "text-brand-700 hover:text-brand-800 transition-colors break-all";

  return (
    <div className={cn("space-y-4", className)}>
      <ContactRow icon="☎" label="Hotline" variant={variant}>
        <a href={`tel:${phoneTel}`} className={linkClass}>
          {phoneDisplay}
        </a>
      </ContactRow>
      <ContactRow icon="✉" label="Email" variant={variant}>
        <a href={`mailto:${email}`} className={emailClass}>
          {email}
        </a>
      </ContactRow>

      {showSocial ? (
        <SocialConnect
          channels={channels}
          variant={variant === "footerRuby" ? "dark" : variant}
          className="pt-1"
        />
      ) : null}
    </div>
  );
}
