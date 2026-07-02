"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AccountRole } from "@prisma/client";
import { HouseXLogo } from "@/components/brand/housex-logo";
import { Button } from "@/components/ui/button";
import { safeNextPath } from "@/lib/auth/redirect";
import { BUYER_REGISTER } from "@/lib/content/messaging/buyer-discovery";
import { BROKER_REGISTER } from "@/lib/content/messaging/broker-supply";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

const ROLE_COPY: Record<
  AccountRole,
  { title: string; subtitle: string; badge: string }
> = {
  CUSTOMER: BUYER_REGISTER,
  BROKER: BROKER_REGISTER,
};

export function AuthForm({
  role,
  nextPath,
}: {
  role: AccountRole;
  nextPath: string;
}) {
  const router = useRouter();
  const copy = ROLE_COPY[role];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registerDone, setRegisterDone] = useState<{
    email: string;
    emailSent: boolean;
  } | null>(null);

  const redirectTo = safeNextPath(nextPath);
  const revealSuffix = redirectTo.includes("?") ? "&reveal=1" : "?reveal=1";
  const afterCustomer =
    redirectTo.startsWith("/tin-dang/") ? `${redirectTo}${revealSuffix}` : redirectTo;
  const afterBroker = "/moi-gioi/tai-khoan";

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể đăng nhập.");
        return;
      }
      const userRole = json.data?.user?.role as AccountRole | undefined;
      const dest =
        userRole === "BROKER"
          ? role === "BROKER"
            ? afterBroker
            : redirectTo
          : role === "CUSTOMER"
            ? afterCustomer
            : redirectTo;
      router.push(dest);
      router.refresh();
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          role,
          name,
          phone,
          email,
          password,
          marketingOptIn,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể đăng ký.");
        return;
      }
      setRegisterDone({
        email: json.data?.email ?? email,
        emailSent: json.data?.emailSent ?? false,
      });
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  const [mode, setMode] = useState<"register" | "login">("register");

  if (registerDone) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Đăng ký thành công</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tài khoản <strong>{copy.badge}</strong> đã được tạo.
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {registerDone.emailSent ? (
              <p>
                Email xác nhận đã gửi tới{" "}
                <strong>{registerDone.email}</strong>. Kiểm tra hộp thư (và spam).
              </p>
            ) : (
              <p className="rounded-lg bg-amber-50 p-3 text-amber-900">
                Chưa gửi được email xác nhận — bạn có thể gửi lại sau khi đăng nhập.
              </p>
            )}
          </div>
          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => {
              router.push(role === "BROKER" ? afterBroker : afterCustomer);
              router.refresh();
            }}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <HouseXLogo className="mx-auto justify-center" iconClassName="text-3xl" />
          <span className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {copy.badge}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
        </div>

        <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Đăng ký
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Đăng nhập
          </button>
        </div>

        <form
          onSubmit={mode === "register" ? submitRegister : submitLogin}
          className="space-y-4"
        >
          {mode === "register" ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Họ và tên</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Số điện thoại</span>
            <input
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              placeholder="0901234567"
            />
          </label>

          {mode === "register" ? (
            <>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="email@example.com"
                />
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-1 accent-brand-600"
                />
                <span>
                  Nhận email nhắc tin, thông báo và thông tin hữu ích từ HouseX.
                </span>
              </label>
            </>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mật khẩu</span>
            <input
              type="password"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="Tối thiểu 6 ký tự"
            />
          </label>

          {mode === "login" ? (
            <p className="text-right text-sm">
              <Link href="/quen-mat-khau" className="font-semibold text-brand-700">
                Quên mật khẩu?
              </Link>
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang xử lý…" : mode === "register" ? "Đăng ký" : "Đăng nhập"}
          </Button>
        </form>

        {role === "BROKER" ? (
          <p className="mt-4 text-center text-xs text-slate-500">
            Đã có tài khoản môi giới và muốn bán sản phẩm liên kết?{" "}
            <Link href="/moi-gioi/dang-ky-ctv" className="font-semibold text-brand-700">
              Đăng ký CTV
            </Link>
          </p>
        ) : null}

        <p className="mt-4 text-center text-sm text-slate-500">
          {role === "CUSTOMER" ? (
            <>
              Bạn là môi giới?{" "}
              <Link href="/dang-ky/moi-gioi" className="font-semibold text-brand-700">
                Đăng ký đăng tin
              </Link>
            </>
          ) : (
            <>
              Bạn tìm mua/thuê?{" "}
              <Link href="/dang-ky/khach-hang" className="font-semibold text-brand-700">
                Đăng ký khách hàng
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
