"use client";

import { useState } from "react";
import Link from "next/link";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { Button } from "@/components/ui/button";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

/** Quên mật khẩu — OTP 6 số qua email (không magic-link). */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, purpose: "RESET_PASSWORD" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể gửi mã.");
        return;
      }
      setOtpSent(true);
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể đặt lại mật khẩu.");
        return;
      }
      setDone(true);
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <HouseXHeaderLogo href="/" priority={false} surface="light" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Quên mật khẩu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Nhận <strong>mã OTP 6 số</strong> qua email (hiệu lực 10 phút). House
            X không yêu cầu bạn bấm link lạ trong email.
          </p>
        </div>

        {done ? (
          <div className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand-900">
            Đã đặt lại mật khẩu.{" "}
            <Link href="/dang-nhap" className="font-semibold underline">
              Đăng nhập
            </Link>
          </div>
        ) : !otpSent ? (
          <form onSubmit={(e) => void sendOtp(e)} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </label>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi…" : "Gửi mã OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={(e) => void reset(e)} className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">
              Nếu email tồn tại, mã đã được gửi tới <strong>{email}</strong>.
            </p>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Mã OTP</span>
              <input
                inputMode="numeric"
                pattern="\d{6}"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Mật khẩu mới
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Xác nhận</span>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputCls}
              />
            </label>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang lưu…" : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link href="/dang-nhap" className="font-semibold text-brand-700">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
