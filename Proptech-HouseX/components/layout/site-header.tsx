"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { HeaderAuth } from "@/components/layout/header-auth";
import { EmbedAwareLink } from "@/components/miniapp/embed-links";
import { NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";
import { NOXH_HANDBOOK_TITLE } from "@/lib/content/messaging/noxh-public";
import { cn } from "@/lib/ui/cn";

const NAV = [
  { label: "Mua bán", href: "/mua-ban" },
  { label: "Cho thuê", href: "/cho-thue" },
  { label: "Dự án", href: "/du-an" },
  { label: "Vay", href: "/tai-chinh" },
  { label: "Định giá", href: "/dinh-gia" },
  { label: "Khuyến mãi", href: "/khuyen-mai" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Công cụ", href: "/cong-cu" },
  { label: NOXH_HANDBOOK_TITLE, href: NOXH_HANDBOOK_PATH },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header-bar proptech-header-ruby sticky top-0 z-50 print:hidden">
      <div className="mx-auto flex min-h-[4.35rem] max-w-7xl items-center justify-between py-2 container-px">
        <HouseXHeaderLogo href="/" surface="ruby" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <EmbedAwareLink
              key={item.href}
              href={item.href}
              className="site-header-nav-link"
            >
              {item.label}
            </EmbedAwareLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuth />
          <ButtonLink href="/dang-ky/moi-gioi" size="sm" className="hidden sm:inline-flex">
            Đăng tin
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="site-header-menu-btn md:hidden"
            aria-label="Mở menu"
          >
            <Icon.Menu className="text-2xl" />
          </button>
        </div>
      </div>

      <div className={cn("site-header-mobile-panel md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col py-2 container-px">
          {NAV.map((item) => (
            <EmbedAwareLink
              key={item.href}
              href={item.href}
              className="site-header-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </EmbedAwareLink>
          ))}
          <ButtonLink href="/dang-tin" size="sm" className="mt-2">
            Đăng tin
          </ButtonLink>
          <Link
            href="/dang-nhap"
            onClick={() => setOpen(false)}
            className="site-header-mobile-link mt-1"
          >
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
