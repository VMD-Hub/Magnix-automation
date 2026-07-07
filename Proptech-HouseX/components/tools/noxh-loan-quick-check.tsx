"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { articlePath } from "@/lib/content/article-routes";
import { cn } from "@/lib/ui/cn";
import {
  ageScreenStatusLabel,
  salutationLabel,
  screenLoanAge,
  type AgeScreenResult,
  type AgeScreenStatus,
  type Salutation,
} from "@/lib/finance/noxh-loan-age-screen";
import { NOXH_LOAN_QUICK_CHECKLIST } from "@/lib/content/noxh-loan-quick-check-copy";

const STATUS_STYLE: Record<
  AgeScreenStatus,
  { ring: string; badge: string }
> = {
  PROCEED: {
    ring: "border-emerald-200 bg-emerald-50/80",
    badge: "bg-emerald-100 text-emerald-800",
  },
  NEEDS_REVIEW: {
    ring: "border-amber-200 bg-amber-50/80",
    badge: "bg-amber-100 text-amber-800",
  },
  NOT_SUITABLE: {
    ring: "border-red-200 bg-red-50/80",
    badge: "bg-red-100 text-red-800",
  },
};

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: CURRENT_YEAR - 1945 - 17 }, (_, i) =>
  CURRENT_YEAR - 18 - i,
);

export function NoxhLoanQuickCheck({
  onScreenComplete,
}: {
  onScreenComplete?: (payload: {
    birthYear: number;
    salutation: Salutation;
    status: AgeScreenStatus;
  }) => void;
}) {
  const [salutation, setSalutation] = useState<Salutation>("BAN");
  const [birthYear, setBirthYear] = useState(1990);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? screenLoanAge({ birthYear, salutation }) : null),
    [submitted, birthYear, salutation],
  );

  useEffect(() => {
    if (result && onScreenComplete) {
      onScreenComplete({
        birthYear,
        salutation,
        status: result.status,
      });
    }
  }, [result, birthYear, salutation, onScreenComplete]);

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="space-y-6">
      <form
        id="kiem-tra"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="proptech-ruby-soft-panel p-5 sm:p-6"
        data-track="noxh-loan-quick-form"
      >
        <p className="text-sm font-medium text-slate-700">Xưng hô</p>
        <div className="mt-2 flex gap-2">
          {(
            [
              ["ANH", "Anh"],
              ["CHI", "Chị"],
              ["BAN", "Bạn"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setSalutation(val)}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                salutation === val
                  ? "border-brand-400 bg-brand-50 text-brand-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Năm sinh</span>
          <select
            value={birthYear}
            onChange={(e) => {
              setBirthYear(Number(e.target.value));
              setSubmitted(false);
            }}
            className={inputCls}
          >
            {BIRTH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-400">
            Chỉ dùng để ước tính tuổi vay trên thiết bị của bạn.
          </span>
        </label>

        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          Xem kết quả sơ bộ
        </Button>
      </form>

      {result ? (
        <QuickCheckResult result={result} onReset={() => setSubmitted(false)} />
      ) : null}
    </div>
  );
}

function QuickCheckResult({
  result,
  onReset,
}: {
  result: AgeScreenResult;
  onReset: () => void;
}) {
  const style = STATUS_STYLE[result.status];
  const label = salutationLabel(result.salutation);

  return (
    <div
      className={cn("rounded-2xl border p-5 sm:p-6", style.ring)}
      data-track="noxh-loan-quick-result"
      data-status={result.status}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
              style.badge,
            )}
          >
            {ageScreenStatusLabel(result.status)}
          </span>
          <h3 className="mt-3 text-lg font-bold text-slate-900">{result.headline}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.summary}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-slate-500 hover:text-brand-700"
        >
          Nhập lại
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Tuổi hiện tại" value={`~${result.currentAge}`} />
        <Stat label="Cuối kỳ vay" value={`~${result.ageAtLoanEnd}`} />
        <Stat label="Thời hạn tham chiếu" value={`${result.loanYears} năm`} />
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
        {result.reasons.map((r) => (
          <li key={r}>· {r}</li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bước tiếp theo
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {result.nextSteps.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <ToolLink href="/cong-cu/dieu-kien-noxh" label="Kiểm tra NOXH" />
          <ToolLink href="/cong-cu/tinh-han-muc-vay" label="Tính hạn mức vay" />
          <ToolLink href={articlePath("cach-tra-cic-an-toan-truoc-khi-vay")} label="Tra CIC" />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {label} ơi, đây chỉ là ước tính sơ bộ — không thay thế thẩm định ngân hàng.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/80 px-2 py-2 text-center">
      <p className="text-[10px] uppercase text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  const cls =
    "inline-flex h-9 items-center rounded-lg border border-brand-200 px-3 text-xs font-semibold text-brand-700 hover:bg-brand-50";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label} ↗
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label} →
    </Link>
  );
}

export function NoxhLoanQuickChecklist() {
  return (
    <ul className="space-y-3">
      {NOXH_LOAN_QUICK_CHECKLIST.map((item) => {
        const external = item.href.startsWith("http");
        const cls =
          "flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-brand-200 hover:bg-brand-50/50";
        return (
          <li key={item.item}>
            {external ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {item.item}
                <span className="text-brand-600">↗</span>
              </a>
            ) : (
              <Link href={item.href} className={cls}>
                {item.item}
                <span className="text-brand-600">→</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function NoxhLoanAdvisoryForm({
  birthYear,
  salutation,
  ageStatus,
}: {
  birthYear: number;
  salutation: Salutation;
  ageStatus: AgeScreenStatus;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("UNSURE");
  const [housingType, setHousingType] = useState("NOXH");
  const [incomeBand, setIncomeBand] = useState("UNSURE");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        const u = j.data?.user;
        if (!u) return;
        if (u.name) setName(u.name);
        if (u.phone) setPhone(u.phone);
        if (u.email) setEmail(u.email);
      })
      .catch(() => {});
  }, []);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!consent) {
        setError("Vui lòng đồng ý nhận tư vấn qua email.");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/tools/noxh-loan-quick-check", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": `${formId}-${phone}-${birthYear}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            region,
            housingType,
            incomeBand,
            birthYear,
            salutation,
            ageStatus,
            message: message.trim() || undefined,
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
    },
    [
      consent,
      formId,
      phone,
      birthYear,
      name,
      email,
      region,
      housingType,
      incomeBand,
      salutation,
      ageStatus,
      message,
    ],
  );

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-900">Đã ghi nhận yêu cầu đồng hành</p>
        <p className="mt-2 text-sm text-emerald-800">
          Chúng tôi sẽ gửi lộ trình và tư vấn chi tiết qua email — miễn phí, không cam kết duyệt
          vay.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      data-track="noxh-loan-advisory-form"
    >
      <h3 className="text-lg font-bold text-slate-900">Nhờ chuyên gia đồng hành rà soát</h3>
      <p className="mt-1 text-sm text-slate-600">
        Điền thông tin — chúng tôi gửi phân tích và tư vấn chi tiết qua email, không gọi làm phiền
        trừ khi bạn chủ động yêu cầu.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Họ tên *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Số điện thoại *</span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-slate-700">Email (để nhận tư vấn) *</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-slate-700">Khu vực quan tâm</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputCls}>
            <option value="TPHCM">TP.HCM</option>
            <option value="HA_NOI">Hà Nội</option>
            <option value="LONG_AN">Long An</option>
            <option value="DONG_NAI">Đồng Nai</option>
            <option value="CAN_THO">Cần Thơ</option>
            <option value="OTHER">Khu vực khác</option>
            <option value="UNSURE">Chưa rõ</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Loại nhà</span>
          <select
            value={housingType}
            onChange={(e) => setHousingType(e.target.value)}
            className={inputCls}
          >
            <option value="NOXH">Mua NOXH</option>
            <option value="NOXH_RENT_TO_OWN">Thuê mua NOXH</option>
            <option value="UNSURE">Chưa rõ</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-700">Thu nhập ước tính/tháng</span>
          <select
            value={incomeBand}
            onChange={(e) => setIncomeBand(e.target.value)}
            className={inputCls}
          >
            <option value="UNDER_15M">Dưới 15 triệu</option>
            <option value="15_25M">15–25 triệu</option>
            <option value="25_35M">25–35 triệu</option>
            <option value="35_50M">35–50 triệu</option>
            <option value="OVER_50M">Trên 50 triệu</option>
            <option value="UNSURE">Chưa rõ</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium text-slate-700">Ghi chú (tuỳ chọn)</span>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-slate-300"
        />
        <span>
          Tôi đồng ý HouseX gửi tư vấn qua email (
          <Link href="/bao-mat" className="text-brand-700 underline">
            bảo mật
          </Link>
          ).
        </span>
      </label>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      <Button type="submit" disabled={loading} className="mt-5">
        {loading ? "Đang gửi…" : "Nhận tư vấn chi tiết qua email"}
      </Button>
    </form>
  );
}
