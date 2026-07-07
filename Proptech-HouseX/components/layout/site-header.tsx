"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { HeaderAuth } from "@/components/layout/header-auth";
import { cn } from "@/lib/ui/cn";

const NAV = [
  { label: "Mua bán", href: "/mua-ban" },
  { label: "Cho thuê", href: "/cho-thue" },
  { label: "Dự án", href: "/du-an" },
  { label: "Khuyến mãi", href: "/khuyen-mai" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Công cụ", href: "/cong-cu" },
  { label: "Tin tức", href: "/tin-tuc" },
] as const;

/** Prefetch các trang catalog chính — phản hồi nhanh khi chuyển tab header. */
const PREFETCH_HREFS = new Set<string>(["/mua-ban", "/cho-thue", "/du-an", "/cong-cu", "/dich-vu"]);

export function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    for (const item of NAV) {
      if (PREFETCH_HREFS.has(item.href)) {
        router.prefetch(item.href);
      }
    }
  }, [router]);

  return (
    <header className="site-header-bar proptech-header-ruby sticky top-0 z-50 print:hidden">
      <div className="mx-auto flex min-h-[4.35rem] max-w-7xl items-center justify-between py-2 container-px">
        <HouseXHeaderLogo href="/" surface="ruby" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={PREFETCH_HREFS.has(item.href)}
              className="site-header-nav-link"
            >
              {item.label}
            </Link>
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
            <Link
              key={item.href}
              href={item.href}
              prefetch={PREFETCH_HREFS.has(item.href)}
              onClick={() => setOpen(false)}
              className="site-header-mobile-link"
            >
              {item.label}
            </Link>
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
