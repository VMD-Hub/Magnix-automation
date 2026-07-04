"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LISTING_REPORT_REASON_OPTIONS } from "@/lib/email/listing-report-reasons";
import type { ListingReportReasonCode } from "@/lib/email/listing-report-reasons";
import { cn } from "@/lib/ui/cn";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function ListingReportForm({
  listingCode,
  className,
}: {
  listingCode: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState<ListingReportReasonCode>("incorrect_price");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/listings/${listingCode}/report`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reasonCode,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không gửi được báo cáo.");
        return;
      }
      setSuccess(
        json.data?.message ??
          "Đã ghi nhận. House X sẽ xác nhận trong 24 giờ làm việc.",
      );
      setMessage("");
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <div className={className}>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          Báo cáo tin
        </Button>
        <p className="mt-2 text-xs text-slate-500">
          Sai giá, sai ảnh, trùng lặp hoặc nghi ngờ lừa đảo — xử lý theo{" "}
          <a href="/chinh-sach-khieu-nai" className="text-brand-700 underline">
            chính sách khiếu nại
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <section className={cn("lux-detail-panel p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Báo cáo tin đăng</h2>
          <p className="mt-1 text-sm text-slate-600">
            Mã tin: <span className="font-mono font-semibold">{listingCode}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
            setSuccess(null);
          }}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Đóng
        </button>
      </div>

      {success ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Lý do</span>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value as ListingReportReasonCode)}
              className={inputCls}
            >
              {LISTING_REPORT_REASON_OPTIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.labelVi}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Mô tả chi tiết</span>
            <textarea
              required
              minLength={10}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={cn(inputCls, "min-h-[88px] py-3")}
              placeholder="Ghi rõ điểm sai: giá, ảnh, vị trí, dấu hiệu lừa đảo…"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Họ tên</span>
              <input
                required
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">SĐT</span>
              <input
                required
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Email (nhận xác nhận)</span>
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tuỳ chọn — khuyến nghị để nhận phản hồi"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi…" : "Gửi báo cáo"}
          </Button>
        </form>
      )}
    </section>
  );
}
