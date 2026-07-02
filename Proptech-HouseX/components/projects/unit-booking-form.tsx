"use client";

import { useState } from "react";

type Props = {
  projectSlug: string;
  unitCode: string;
  unitLabel: string;
};

export function UnitBookingForm({ projectSlug, unitCode, unitLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(projectSlug)}/units/${encodeURIComponent(unitCode)}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            message: message.trim() || undefined,
          }),
        },
      );
      const json = (await res.json()) as {
        data?: { code: string };
        error?: { message: string };
      };
      if (!res.ok) {
        setError(json.error?.message ?? "Không gửi được yêu cầu giữ suất.");
        return;
      }
      setSuccessCode(json.data?.code ?? null);
      setOpen(false);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (successCode) {
    return (
      <p className="text-xs font-medium text-emerald-700">
        Đã giữ suất {successCode}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-500"
      >
        Giữ suất
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-2 min-w-[240px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-left shadow-sm"
    >
      <p className="text-xs font-semibold text-slate-800">Giữ suất — {unitLabel}</p>
      <p className="mt-1 text-[11px] leading-snug text-slate-500">
        Ghi nhận suất mua, không khóa căn. Nhiều khách có thể giữ suất cùng lúc.
        Chuyển cọc do vận hành xử lý thủ công.
      </p>
      <label className="mt-2 block text-[11px] font-medium text-slate-600">
        Họ tên
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="mt-2 block text-[11px] font-medium text-slate-600">
        Số điện thoại
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="mt-2 block text-[11px] font-medium text-slate-600">
        Email (tuỳ chọn)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="mt-2 block text-[11px] font-medium text-slate-600">
        Ghi chú
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang gửi…" : "Gửi giữ suất"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
