"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchAuthUser,
  initialsFromName,
  type ClientAuthUser,
} from "@/lib/auth/client-session";
import {
  accountHomeForRole,
  postListingHrefForSession,
} from "@/lib/auth/redirect";

export type { ClientAuthUser as AuthUser };

export function HeaderAuth({
  user,
  onUserChange,
  postListingHref,
}: {
  /** Khi SiteHeader đã fetch — tránh double request. */
  user?: ClientAuthUser | null | undefined;
  onUserChange?: (user: ClientAuthUser | null) => void;
  /** CTA đăng tin theo role — primary trong menu. */
  postListingHref?: string;
}) {
  const router = useRouter();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [localUser, setLocalUser] = useState<ClientAuthUser | null | undefined>(
    user,
  );
  const [open, setOpen] = useState(false);

  const resolved = user !== undefined ? user : localUser;

  useEffect(() => {
    if (user !== undefined) return;
    fetchAuthUser().then((authUser) => {
      setLocalUser(authUser);
      onUserChange?.(authUser);
    });
  }, [user, onUserChange]);

  useEffect(() => {
    if (user !== undefined) setLocalUser(user);
  }, [user]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setLocalUser(null);
    onUserChange?.(null);
    router.refresh();
  }

  if (resolved === undefined) {
    return <span className="site-header-auth-skeleton" aria-hidden />;
  }

  if (!resolved) {
    return (
      <Link href="/dang-nhap" className="site-header-auth-link">
        Đăng nhập
      </Link>
    );
  }

  const accountHref = accountHomeForRole(resolved.role ?? "CUSTOMER");
  const isBroker = resolved.role === "BROKER";
  const initials = initialsFromName(resolved.name);
  const listingHref =
    postListingHref ?? postListingHrefForSession(resolved.role);

  return (
    <div className="site-header-account" ref={rootRef}>
      <button
        type="button"
        className="site-header-account-trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label="Tài khoản"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="site-header-account-avatar" aria-hidden>
          {initials}
        </span>
        <span className="site-header-account-label">Tài khoản</span>
      </button>
      {open ? (
        <div id={menuId} className="site-header-account-menu" role="menu">
          <p className="site-header-account-menu-name">
            Xin chào, {resolved.name.split(/\s+/).slice(-2).join(" ")}
          </p>
          <p className="site-header-account-menu-group">Chính</p>
          <Link
            href={accountHref}
            role="menuitem"
            className="site-header-account-menu-item"
            onClick={() => setOpen(false)}
          >
            Hồ sơ &amp; hoạt động
          </Link>
          <Link
            href={listingHref}
            role="menuitem"
            className="site-header-account-menu-item"
            onClick={() => setOpen(false)}
          >
            Đăng tin
          </Link>
          {isBroker ? (
            <Link
              href="/moi-gioi/tin-cua-toi"
              role="menuitem"
              className="site-header-account-menu-item"
              onClick={() => setOpen(false)}
            >
              Tin của tôi
            </Link>
          ) : null}
          <div className="site-header-account-menu-divider" role="separator" />
          <p className="site-header-account-menu-group">Khác</p>
          <button
            type="button"
            role="menuitem"
            className="site-header-account-menu-item site-header-account-menu-danger"
            onClick={logout}
          >
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Banner nhắc xác nhận email khi user đã đăng nhập nhưng chưa verify. */
export function EmailVerificationBanner() {
  const [user, setUser] = useState<ClientAuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthUser().then((authUser) => {
      setUser(authUser);
      setLoaded(true);
    });
  }, []);

  if (!loaded || !user || user.emailVerified) return null;

  async function resend() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      setMsg(
        res.ok
          ? "Đã gửi lại email xác nhận."
          : (json?.error?.message ?? "Không gửi được email."),
      );
    } catch {
      setMsg("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900 print:hidden">
      Vui lòng xác nhận email{" "}
      {user.email ? <strong>{user.email}</strong> : null} để nhận thông báo và
      khôi phục mật khẩu.{" "}
      <button
        type="button"
        onClick={resend}
        disabled={loading}
        className="font-semibold text-brand-700 underline hover:text-brand-800"
      >
        {loading ? "Đang gửi…" : "Gửi lại"}
      </button>
      {msg ? <span className="ml-2 text-xs">({msg})</span> : null}
    </div>
  );
}
