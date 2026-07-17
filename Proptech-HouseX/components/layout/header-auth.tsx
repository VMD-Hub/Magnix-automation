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

let authUserRequest: Promise<AuthUser | null> | null = null;

function fetchAuthUser() {
  if (!authUserRequest) {
    authUserRequest = fetch("/api/auth/me")
      .then((response) => response.json())
      .then((json) => json.data?.user ?? null)
      .catch(() => null)
      .finally(() => {
        authUserRequest = null;
      });
  }

  return authUserRequest;
}

export function HeaderAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    fetchAuthUser().then(setUser);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  if (user === undefined) {
    return <span className="site-header-auth-skeleton" />;
  }

  if (user) {
    const accountHref =
      user.role === "BROKER" ? "/moi-gioi/tai-khoan" : "/khach-hang/tai-khoan";
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link href={accountHref} className="site-header-auth-user">
          {user.name}
        </Link>
        <Button type="button" variant="ghost" size="sm" className="site-header-auth-ghost" onClick={logout}>
          Thoát
        </Button>
      </div>
    );
  }

  return (
    <Link href="/dang-nhap" className="site-header-auth-link hidden sm:inline">
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
