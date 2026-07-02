"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Đăng nhập thất bại.");
        return;
      }
      router.push("/admin/ctv");
      router.refresh();
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-slate-600">
        Nhập <code className="rounded bg-slate-100 px-1">ADMIN_SECRET</code> từ
        biến môi trường. Phiên hết hạn sau 8 giờ.
      </p>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Mật khẩu admin</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>
      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang đăng nhập…" : "Vào admin"}
      </Button>
    </form>
  );
}
