"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AuthUser = {
  id: string;
  name: string;
  phoneMasked: string;
  email?: string | null;
  emailVerified?: boolean;
  role?: string;
};

export function HeaderAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setUser(j.data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  if (user === undefined) {
    return (
      <span className="hidden h-9 w-16 animate-pulse rounded-lg bg-slate-100 sm:inline-block" />
    );
  }

  if (user) {
    const accountHref =
      user.role === "BROKER" ? "/moi-gioi/tai-khoan" : "/khach-hang/tai-khoan";
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href={accountHref}
          className="max-w-[140px] truncate text-sm font-medium text-slate-700 hover:text-brand-700"
        >
          {user.name}
        </Link>
        <Button type="button" variant="ghost" size="sm" onClick={logout}>
          Thoát
        </Button>
      </div>
    );
  }

  return (
    <Link
      href="/dang-nhap"
      className="hidden text-sm font-semibold text-slate-600 hover:text-slate-900 sm:inline"
    >
      Đăng nhập
    </Link>
  );
}

/** Banner nhắc xác nhận email khi user đã đăng nhập nhưng chưa verify. */
export function EmailVerificationBanner() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setUser(j.data?.user ?? null))
      .finally(() => setLoaded(true));
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
