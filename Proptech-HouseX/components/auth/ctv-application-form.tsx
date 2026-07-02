"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

type AppState = {
  brokerType: string;
  ctvCode: string | null;
  ctvApplication: {
    id: string;
    status: string;
    rejectReason: string | null;
  } | null;
} | null;

export function CtvApplicationForm() {
  const [state, setState] = useState<AppState | undefined>(undefined);
  const [idNumber, setIdNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [region, setRegion] = useState("");
  const [motivation, setMotivation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/brokers/ctv-application")
      .then(async (res) => {
        if (res.status === 401) {
          setState(null);
          return;
        }
        const json = await res.json();
        setState(json.data?.broker ?? null);
      })
      .catch(() => setState(null));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/brokers/ctv-application", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idNumber, experience, region, motivation }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message ?? "Không gửi được đơn.");
        return;
      }
      setDone(true);
      setState((s) =>
        s
          ? {
              ...s,
              ctvApplication: { id: json.data.id, status: "PENDING", rejectReason: null },
            }
          : s,
      );
    } catch {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  if (state === undefined) {
    return <p className="text-center text-slate-500">Đang tải…</p>;
  }

  if (state === null) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">
          Bạn cần{" "}
          <Link href="/dang-ky/moi-gioi" className="font-semibold text-brand-700">
            tài khoản môi giới đăng tin
          </Link>{" "}
          trước khi đăng ký CTV.
        </p>
        <ButtonLink href="/dang-nhap?next=/moi-gioi/dang-ky-ctv" className="mt-4">
          Đăng nhập môi giới
        </ButtonLink>
      </div>
    );
  }

  if (state.ctvCode) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <Icon.BadgeCheck className="mx-auto text-4xl text-brand-600" />
        <h2 className="mt-3 text-xl font-bold text-slate-900">Bạn đã là CTV</h2>
        <p className="mt-2 text-2xl font-mono font-bold text-brand-700">{state.ctvCode}</p>
        <p className="mt-2 text-sm text-slate-600">
          Dùng mã này khi tham gia chương trình affiliate / bán sản phẩm liên kết.
        </p>
      </div>
    );
  }

  if (state.ctvApplication?.status === "PENDING" || done) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Đơn đang chờ duyệt</h2>
        <p className="mt-2 text-sm text-slate-600">
          Admin sẽ xem xét hồ sơ. Bạn cần hoàn thành khóa đào tạo hội nhập trước khi
          được duyệt CTV và nhận mã tại đây.
        </p>
      </div>
    );
  }

  if (state.ctvApplication?.status === "REJECTED") {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Đơn trước bị từ chối: {state.ctvApplication.rejectReason ?? "—"}. Bạn có thể
          nộp lại.
        </div>
        <Form
          {...{ idNumber, setIdNumber, experience, setExperience, region, setRegion, motivation, setMotivation, error, loading, submit }}
        />
      </div>
    );
  }

  return (
    <Form
      {...{ idNumber, setIdNumber, experience, setExperience, region, setRegion, motivation, setMotivation, error, loading, submit }}
    />
  );
}

function Form(props: {
  idNumber: string;
  setIdNumber: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
  motivation: string;
  setMotivation: (v: string) => void;
  error: string | null;
  loading: boolean;
  submit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={props.submit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Số CMND/CCCD</span>
        <input
          required
          value={props.idNumber}
          onChange={(e) => props.setIdNumber(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Khu vực hoạt động</span>
        <input
          required
          value={props.region}
          onChange={(e) => props.setRegion(e.target.value)}
          className={inputCls}
          placeholder="VD: TP.HCM — Quận 7, Nhà Bè"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Kinh nghiệm môi giới BĐS</span>
        <textarea
          required
          rows={3}
          value={props.experience}
          onChange={(e) => props.setExperience(e.target.value)}
          className={`${inputCls} h-auto py-2`}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Lý do đăng ký CTV</span>
        <textarea
          required
          rows={3}
          value={props.motivation}
          onChange={(e) => props.setMotivation(e.target.value)}
          className={`${inputCls} h-auto py-2`}
        />
      </label>
      {props.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{props.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={props.loading}>
        {props.loading ? "Đang gửi…" : "Gửi đơn đăng ký CTV"}
      </Button>
    </form>
  );
}

function ButtonLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
