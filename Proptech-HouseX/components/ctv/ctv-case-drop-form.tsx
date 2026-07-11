"use client";

import { PhoneInput } from "@/components/tools/phone-input";
import { Button } from "@/components/ui/button";

function defaultConsultLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CtvCaseDropForm({ onCreated }: { onCreated?: () => void }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consultAt, setConsultAt] = useState(defaultConsultLocal);
  const [intendToBorrow, setIntendToBorrow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ctv/cases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          message: message || undefined,
          intendToBorrow,
          consultScheduledAt: consultAt,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không gửi được lead.");
        return;
      }
      setDone(true);
      setCustomerName("");
      setPhone("");
      setMessage("");
      setIntendToBorrow(false);
      onCreated?.();
      setTimeout(() => setDone(false), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">Thả lead mới</h2>
      <p className="mt-1 text-sm text-slate-500">
        Chỉ cần tên và SĐT — chuyên viên HouseX tư vấn hộ. Bạn theo dõi tiến độ
        tại đây.
      </p>

      {done ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Đã ghi nhận lead — HouseX sẽ liên hệ khách trong giờ làm việc.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Họ tên khách
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nguyễn Văn A"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Số điện thoại
          <PhoneInput
            required
            value={phone}
            onChange={setPhone}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="0901234567"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Lịch tư vấn dự kiến *
          <input
            required
            type="datetime-local"
            value={consultAt}
            onChange={(e) => setConsultAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ghi chú (tuỳ chọn)
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Khách quan tâm dự án..."
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={intendToBorrow}
            onChange={(e) => setIntendToBorrow(e.target.checked)}
          />
          Khách dự định vay mua NOXH
        </label>
      </div>

      <Button type="submit" className="mt-4 w-full" disabled={loading}>
        {loading ? "Đang gửi…" : "Gửi lead"}
      </Button>

      <p className="mt-3 text-xs text-slate-400">
        Mọi tư vấn pháp lý do chuyên viên HouseX phụ trách — bạn không cần gọi
        trực tiếp khách.
      </p>
    </form>
  );
}
