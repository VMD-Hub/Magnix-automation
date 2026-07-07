"use client";

import { useState } from "react";
import Link from "next/link";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { Button } from "@/components/ui/button";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể gửi yêu cầu.");
        return;
      }
      setSent(true);
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
            Nhập email đã đăng ký — chúng tôi gửi link đặt lại mật khẩu (hiệu lực
            1 giờ).
          </p>
        </div>

        {sent ? (
          <div className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand-900">
            Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại
            mật khẩu. Kiểm tra cả hộp thư spam.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
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
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi…" : "Gửi link đặt lại mật khẩu"}
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
