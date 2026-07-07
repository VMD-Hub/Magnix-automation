"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { Button } from "@/components/ui/button";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!token) {
      setError("Link không hợp lệ. Vui lòng yêu cầu link mới.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không thể đặt lại mật khẩu.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/dang-nhap"), 2000);
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
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Đặt lại mật khẩu</h1>
        </div>

        {done ? (
          <p className="mt-6 rounded-lg bg-brand-50 p-4 text-center text-sm text-brand-900">
            Mật khẩu đã được cập nhật. Đang chuyển đến trang đăng nhập…
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Mật khẩu mới</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Xác nhận mật khẩu</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
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
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? "Đang lưu…" : "Lưu mật khẩu mới"}
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link href="/quen-mat-khau" className="font-semibold text-brand-700">
            Yêu cầu link mới
          </Link>
        </p>
      </div>
    </div>
  );
}
