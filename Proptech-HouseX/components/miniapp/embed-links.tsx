"use client";

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";
import {
  useEmbedAwareHref,
  useMiniAppEmbed,
} from "@/components/miniapp/miniapp-embed-context";
import { goMiniAppHome } from "@/lib/miniapp/request-miniapp-nav";

function onEmbedHomeClick(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  goMiniAppHome();
}

/** Logo / «Trang chủ» — về home Mini App qua postMessage (không zalo.me trong iframe). */
export function EmbedHomeLink({
  children,
  className,
  ariaLabel = "Trang chủ",
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const embed = useMiniAppEmbed();

  if (embed) {
    return (
      <a
        href="/"
        role="link"
        className={className}
        aria-label={ariaLabel}
        onClick={onEmbedHomeClick}
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
  role,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
}) {
  const resolved = useEmbedAwareHref(href);
  const embed = useMiniAppEmbed();

  if (embed && (href === "/" || href.startsWith("/#"))) {
    return (
      <a
        href="/"
        className={className}
        role={role}
        onClick={(e) => {
          e.preventDefault();
          goMiniAppHome();
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  }

  if (embed && resolved.startsWith("http")) {
    return (
      <a href={resolved} className={className} role={role} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={resolved} className={className} role={role} onClick={onClick}>
      {children}
    </Link>
  );
}
