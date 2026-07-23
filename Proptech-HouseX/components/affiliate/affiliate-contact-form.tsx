"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { resolveContactFormIntent } from "@/lib/content/contact-form-routing";

const VERTICAL_OPTIONS = [
  { value: "tai-chinh", label: "Vay vốn / Tài chính ngân hàng" },
  { value: "dinh-gia", label: "Định giá & thẩm định BĐS" },
  { value: "noi-that", label: "Thiết kế & thi công nội thất" },
  { value: "ho-tro", label: "Hỗ trợ / Báo tin sai / Góp ý" },
  { value: "khac", label: "Khác" },
] as const;

const NEED_BY_VERTICAL: Record<string, { value: string; label: string }[]> = {
  "tai-chinh": [
    {
      value: "ra-soat-phap-ly-15-phut",
      label: "Rà soát pháp lý 15 phút (NOXH / BĐS)",
    },
    { value: "can-ho", label: "Vay mua nhà & căn hộ" },
    { value: "vay-the-chap", label: "Vay thế chấp & tái tài trợ" },
    { value: "vay-sxkd", label: "Vay sản xuất kinh doanh" },
    { value: "bao-hiem-tai-san", label: "Bảo hiểm nhà, kho & xe" },
    { value: "tu-van-chung", label: "Chưa rõ — cần tư vấn" },
  ],
  "dinh-gia": [
    { value: "chu-nha", label: "Tra cứu giá cho chủ nhà" },
    { value: "ngan-hang", label: "Thẩm định cho ngân hàng" },
    { value: "chung-thu", label: "Chứng thư định giá" },
    { value: "khac-dg", label: "Mục đích khác" },
  ],
  "noi-that": [
    { value: "thiet-ke", label: "Thiết kế nội thất" },
    { value: "thi-cong", label: "Thi công trọn gói" },
    { value: "thiet-ke-thi-cong", label: "Thiết kế + thi công" },
  ],
  "ho-tro": [
    { value: "bao-cao-tin", label: "Báo tin sai / lừa đảo" },
    { value: "gop-y", label: "Góp ý nội dung / biên tập" },
    { value: "khac-ht", label: "Hỗ trợ khác" },
  ],
};

export function AffiliateContactForm({
  defaultVertical,
  defaultNeed,
  defaultMessage,
  compact = false,
}: {
  defaultVertical?: string;
  defaultNeed?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const formId = useId();
  const intent = resolveContactFormIntent(defaultNeed);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vertical, setVertical] = useState(
    intent?.vertical ?? defaultVertical ?? "tai-chinh",
  );
  const [need, setNeed] = useState(intent?.need ?? defaultNeed ?? "");
  const [message, setMessage] = useState(
    intent?.defaultMessage ?? defaultMessage ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needOptions = NEED_BY_VERTICAL[vertical] ?? [];

  useEffect(() => {
    if (!intent) return;
    setVertical(intent.vertical);
    setNeed(intent.need);
    setMessage((prev) => (prev.trim() ? prev : intent.defaultMessage));
  }, [intent]);

  useEffect(() => {
    if (!defaultNeed && !window.location.hash.includes("tu-van")) return;
    const el = document.getElementById("tu-van");
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [defaultNeed]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact/affiliate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": `${formId}-${phone.trim()}-${vertical}-${need || "general"}`,
        },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          vertical,
          need: need || undefined,
          message: message || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không gửi được yêu cầu.");
        return;
      }
      setDone(true);
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-900">Đã nhận yêu cầu tư vấn</p>
        <p className="mt-2 text-sm text-emerald-800">
          Tư vấn viên HouseX sẽ liên hệ trong giờ làm việc để làm rõ nhu cầu và hướng
          dẫn bước tiếp theo.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {!compact ? (
        <>
          <h2 className="text-lg font-bold text-slate-900">Để lại thông tin tư vấn</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tư vấn viên HouseX sẽ làm rõ nhu cầu và phản hồi trong giờ làm việc — không
            cam kết duyệt vay hay báo giá cố định tại đây.
          </p>
        </>
      ) : null}

      <div className={`grid gap-4 ${compact ? "mt-0" : "mt-5 sm:grid-cols-2"}`}>
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium text-slate-700">Họ tên *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium text-slate-700">Số điện thoại *</span>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Dịch vụ quan tâm</span>
          <select
            value={vertical}
            onChange={(e) => {
              setVertical(e.target.value);
              setNeed("");
            }}
            className={inputCls}
          >
            {VERTICAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {needOptions.length > 0 ? (
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Nhu cầu cụ thể</span>
            <select value={need} onChange={(e) => setNeed(e.target.value)} className={inputCls}>
              <option value="">— Chọn —</option>
              {needOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Ghi chú thêm</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} h-auto py-2`}
            placeholder="VD: Cần vay mua căn hộ Quận 7, thu nhập 30 triệu/tháng…"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={loading}>
        {loading ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
      </Button>
    </form>
  );
}
