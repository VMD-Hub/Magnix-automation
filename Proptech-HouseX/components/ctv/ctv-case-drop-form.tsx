"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/tools/phone-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  DEAL_TIER_OPTIONS,
  type AffiliateDealTier,
} from "@/lib/ctv/deal-tiers";

function defaultConsultLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = {
  /** Prefill B từ Giỏ hàng `?project=`. */
  initialProjectLabel?: string;
  /** Sau tạo: chuyển `/moi-gioi/ho-so/[id]` (trang khai báo). */
  redirectOnSuccess?: boolean;
  onCreated?: (caseId: string) => void;
};

/** Khai báo A+B+C → POST /api/ctv/cases (parity Mini AgentDeclarePage). */
export function CtvCaseDropForm({
  initialProjectLabel = "",
  redirectOnSuccess = false,
  onCreated,
}: Props) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectLabel, setProjectLabel] = useState(initialProjectLabel);
  const [dealTier, setDealTier] = useState<AffiliateDealTier>("CONNECTOR");
  const [message, setMessage] = useState("");
  const [consultAt, setConsultAt] = useState(defaultConsultLocal);
  const [intendToBorrow, setIntendToBorrow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [contractRequired, setContractRequired] = useState(false);

  useEffect(() => {
    if (initialProjectLabel) setProjectLabel(initialProjectLabel);
  }, [initialProjectLabel]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setContractRequired(false);
    setLoading(true);
    try {
      const res = await fetch("/api/ctv/cases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          projectLabel: projectLabel.trim() || undefined,
          dealTier,
          message: message || undefined,
          intendToBorrow,
          consultScheduledAt: consultAt,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json?.error?.code === "CONTRACT_REQUIRED") {
          setContractRequired(true);
        }
        setError(json?.error?.message ?? "Không gửi được khai báo.");
        return;
      }
      const caseId = json?.data?.id as string | undefined;
      setDone(true);
      setCustomerName("");
      setPhone("");
      setMessage("");
      setIntendToBorrow(false);
      setDealTier("CONNECTOR");
      if (!initialProjectLabel) setProjectLabel("");
      if (caseId) onCreated?.(caseId);
      if (redirectOnSuccess && caseId) {
        router.push(`/moi-gioi/ho-so/${caseId}`);
        return;
      }
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
      <h2 className="text-lg font-bold text-slate-900">Khai báo giao dịch</h2>
      <p className="mt-1 text-sm text-slate-500">
        Chọn khách (A), dự án (B) và mức hợp tác (C) — House X bố trí hỗ trợ theo
        lựa chọn của bạn.
      </p>

      {done ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Đã ghi nhận khai báo — theo dõi tiến độ tại hồ sơ.
        </p>
      ) : null}
      {contractRequired ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Cần ký e-contract trước khi khai báo.{" "}
          <Link href="/moi-gioi/e-contract" className="font-medium underline">
            Ký ngay
          </Link>
        </p>
      ) : null}
      {error && !contractRequired ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          A · Họ tên khách
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          A · Số điện thoại
          <PhoneInput
            required
            value={phone}
            onChange={setPhone}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="0901234567"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          B · Dự án / sản phẩm
          <input
            value={projectLabel}
            onChange={(e) => setProjectLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Chọn từ Giỏ hàng hoặc gõ tên"
          />
        </label>

        <div>
          <p className="text-sm font-medium text-slate-700">
            C · Mức hợp tác trên deal này
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {DEAL_TIER_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDealTier(t.id)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition",
                  dealTier === t.id
                    ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span className="block text-sm font-semibold text-slate-900">
                  {t.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {t.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Lịch tư vấn dự kiến
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
        {loading ? "Đang gửi…" : "Gửi khai báo"}
      </Button>

      <p className="mt-3 text-xs text-slate-400">
        Chọn dự án từ{" "}
        <Link href="/moi-gioi/gio-hang" className="text-brand-700 underline">
          Giỏ hàng
        </Link>
        . Đổi mức sau khi Ops đã gọi sẽ bị khóa (SoT).
      </p>
    </form>
  );
}
