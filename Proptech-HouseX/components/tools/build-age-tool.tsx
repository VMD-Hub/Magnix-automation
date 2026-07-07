"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  BUILD_AGE_DISCLAIMER,
  buildAgeStatusLabel,
  screenBuildAge,
  suggestGoodYears,
  type BuildAgeScreenResult,
} from "@/lib/feng-shui/build-age-screen";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i);
const BUILD_YEARS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR + i);

const STATUS_STYLE = {
  OK: { ring: "border-emerald-200 bg-emerald-50/80", badge: "bg-emerald-100 text-emerald-800" },
  CAUTION: { ring: "border-amber-200 bg-amber-50/80", badge: "bg-amber-100 text-amber-800" },
  AVOID: { ring: "border-red-200 bg-red-50/80", badge: "bg-red-100 text-red-800" },
};

export function BuildAgeTool() {
  const [birthYear, setBirthYear] = useState(1990);
  const [buildYear, setBuildYear] = useState(CURRENT_YEAR);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? screenBuildAge(birthYear, buildYear) : null),
    [submitted, birthYear, buildYear],
  );

  const goodYears = useMemo(
    () => (submitted ? suggestGoodYears(birthYear, CURRENT_YEAR) : []),
    [submitted, birthYear],
  );

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="proptech-ruby-soft-panel p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-slate-700">Năm sinh gia chủ (âm lịch)</span>
            <select
              value={birthYear}
              onChange={(e) => {
                setBirthYear(Number(e.target.value));
                setSubmitted(false);
              }}
              className={inputCls}
            >
              {BIRTH_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Năm dự kiến xây/sửa</span>
            <select
              value={buildYear}
              onChange={(e) => {
                setBuildYear(Number(e.target.value));
                setSubmitted(false);
              }}
              className={inputCls}
            >
              {BUILD_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          Kiểm tra tuổi làm nhà
        </Button>
      </form>

      {result ? <BuildAgeResult result={result} goodYears={goodYears} /> : null}
    </div>
  );
}

function BuildAgeResult({
  result,
  goodYears,
}: {
  result: BuildAgeScreenResult;
  goodYears: number[];
}) {
  const style = STATUS_STYLE[result.overall];

  return (
    <div className={cn("rounded-2xl border p-5 sm:p-6", style.ring)}>
      <span className={cn("inline-block rounded-lg px-2.5 py-1 text-xs font-bold uppercase", style.badge)}>
        {buildAgeStatusLabel(result.overall)}
      </span>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{result.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.summary}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <CheckItem label="Tam Tai" ok={!result.tamTai.hit} detail={result.tamTai.meaning} />
        <CheckItem label="Kim Lâu" ok={!result.kimLau.hit} detail={result.kimLau.hit ? result.kimLau.detail!.harm : "Không phạm Kim Lâu"} />
        <CheckItem label="Hoang Ốc" ok={result.hoangOc.auspicious} detail={`${result.hoangOc.label} — ${result.hoangOc.meaning}`} />
      </div>

      {goodYears.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Năm hợp tuổi gần đây</p>
          <p className="mt-1 text-sm text-slate-700">{goodYears.join(", ")}</p>
        </div>
      ) : null}

      {result.remedies.length > 0 ? (
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          {result.remedies.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <ToolLink href="/cong-cu/xem-huong-nha" label="Xem hướng nhà" />
        <ToolLink href="/cong-cu/uoc-tinh-chi-phi-xay-nha" label="Ước tính chi phí" />
      </div>

      <p className="mt-4 text-xs text-slate-500">{BUILD_AGE_DISCLAIMER}</p>
    </div>
  );
}

function CheckItem({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <div className={cn("rounded-lg border p-3 text-sm", ok ? "border-emerald-200 bg-white" : "border-red-200 bg-white")}>
      <p className="font-bold text-slate-800">{ok ? "✓" : "✗"} {label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{detail}</p>
    </div>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex h-9 items-center rounded-lg border border-brand-200 px-3 text-xs font-semibold text-brand-700 hover:bg-brand-50">
      {label} →
    </Link>
  );
}
