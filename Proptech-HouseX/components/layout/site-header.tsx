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
    <header className="site-header-bar sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--border)_55%,var(--brand-logo-paper))] print:hidden">
      <div className="mx-auto flex min-h-[4.35rem] max-w-7xl items-center justify-between py-2 container-px">
        <HouseXHeaderLogo href="/" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={PREFETCH_HREFS.has(item.href)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface)] hover:text-brand-700 dark:hover:bg-white/10 dark:hover:text-brand-300"
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
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Mở menu"
          >
            <Icon.Menu className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[var(--border)] bg-[var(--surface-muted)] md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col py-2 container-px">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={PREFETCH_HREFS.has(item.href)}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
