"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { HeaderAuth } from "@/components/layout/header-auth";
import { EmbedAwareLink } from "@/components/miniapp/embed-links";
import {
  fetchAuthUser,
  type ClientAuthUser,
} from "@/lib/auth/client-session";
import {
  accountHomeForRole,
  postListingHrefForSession,
} from "@/lib/auth/redirect";
import { NAV_MORE, NAV_PRIMARY } from "@/lib/content/site-nav";
import { cn } from "@/lib/ui/cn";

export function SiteHeader() {
  const router = useRouter();
  const moreId = useId();
  const moreRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useState<ClientAuthUser | null | undefined>(undefined);

  useEffect(() => {
    fetchAuthUser().then(setUser);
  }, []);

  const onUserChange = useCallback((next: ClientAuthUser | null) => {
    setUser(next);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const postHref = postListingHrefForSession(user?.role);
  const accountHref =
    user?.role != null ? accountHomeForRole(user.role) : "/dang-nhap";

  async function logoutMobile() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <header className="site-header-bar proptech-header-ruby sticky top-0 z-50 print:hidden">
      <div className="mx-auto flex min-h-[4.35rem] max-w-7xl items-center justify-between gap-3 py-2 container-px">
        <HouseXHeaderLogo href="/" surface="ruby" />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Chính">
          {NAV_PRIMARY.map((item) => (
            <EmbedAwareLink
              key={item.href}
              href={item.href}
              className="site-header-nav-link"
            >
              {item.label}
            </EmbedAwareLink>
          ))}
          <div className="site-header-more" ref={moreRef}>
            <button
              type="button"
              className="site-header-nav-link site-header-more-trigger"
              aria-expanded={moreOpen}
              aria-controls={moreId}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((v) => !v)}
            >
              Thêm
            </button>
            {moreOpen ? (
              <div id={moreId} className="site-header-more-menu" role="menu">
                {NAV_MORE.map((item) => (
                  <EmbedAwareLink
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="site-header-more-item"
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </EmbedAwareLink>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuth
            user={user}
            onUserChange={onUserChange}
            postListingHref={postHref}
          />
          <ButtonLink
            href={postHref}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Đăng tin
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="site-header-menu-btn lg:hidden"
            aria-label="Mở menu"
          >
            <Icon.Menu className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "site-header-mobile-panel lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col py-2 container-px">
          <p className="site-header-mobile-section">Khám phá</p>
          {NAV_PRIMARY.map((item) => (
            <EmbedAwareLink
              key={item.href}
              href={item.href}
              className="site-header-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </EmbedAwareLink>
          ))}
          <p className="site-header-mobile-section">Thêm</p>
          {NAV_MORE.map((item) => (
            <EmbedAwareLink
              key={item.href}
              href={item.href}
              className="site-header-mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </EmbedAwareLink>
          ))}
          <ButtonLink
            href={postHref}
            size="sm"
            className="mt-3"
            onClick={() => setOpen(false)}
          >
            Đăng tin
          </ButtonLink>
          {user ? (
            <>
              <p className="site-header-mobile-section">Tài khoản</p>
              <Link
                href={accountHref}
                onClick={() => setOpen(false)}
                className="site-header-mobile-link"
              >
                Hồ sơ &amp; hoạt động
              </Link>
              {user.role === "BROKER" ? (
                <Link
                  href="/moi-gioi/tin-cua-toi"
                  onClick={() => setOpen(false)}
                  className="site-header-mobile-link"
                >
                  Tin của tôi
                </Link>
              ) : null}
              <button
                type="button"
                onClick={logoutMobile}
                className="site-header-mobile-link site-header-mobile-danger text-left"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/dang-nhap"
              onClick={() => setOpen(false)}
              className="site-header-mobile-link mt-2"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
