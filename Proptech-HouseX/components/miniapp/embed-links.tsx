"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  useEmbedAwareHref,
  useEmbedHomeHref,
  useMiniAppEmbed,
} from "@/components/miniapp/miniapp-embed-context";
import { getHouseXMiniAppEntryUrl } from "@/lib/personal-brand/vu-nguyen/channel-links";

/** Logo / «Trang chủ» — về Mini App khi đang xem từ Zalo webview. */
export function EmbedHomeLink({
  children,
  className,
  ariaLabel = "Trang chủ",
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const href = useEmbedHomeHref("/");
  const embed = useMiniAppEmbed();

  if (embed) {
    return (
      <a
        href={href}
        className={className}
        aria-label={`${ariaLabel} — House X Mini App`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href="/" className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** Link nội bộ giữ ?hx_embed=miniapp trong phiên Mini App. */
export function EmbedAwareLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const resolved = useEmbedAwareHref(href);
  const embed = useMiniAppEmbed();

  if (embed && (href === "/" || resolved.startsWith("https://zalo.me/"))) {
    return (
      <a
        href={getHouseXMiniAppEntryUrl()}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (embed && resolved.startsWith("http")) {
    return (
      <a href={resolved} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={resolved} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
