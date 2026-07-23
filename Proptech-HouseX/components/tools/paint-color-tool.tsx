"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PAINT_COLOR_DISCLAIMER,
  suggestPaintColors,
} from "@/lib/feng-shui/ngu-hanh-colors";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i);

export function PaintColorTool() {
  const [birthYear, setBirthYear] = useState(1990);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? suggestPaintColors(birthYear) : null),
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
        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          Xem màu sơn hợp mệnh
        </Button>
      </form>

      {result ? (
        <div className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase text-brand-600">
            Mệnh {result.hanh.name} · sinh {result.birthYear}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Bảng màu gợi ý</h3>
          <p className="mt-2 text-sm text-slate-600">{result.hanh.tips}</p>

          <ColorBlock title="Ngoại thất — nên dùng" colors={result.exterior.recommended} tone="good" />
          <ColorBlock title="Điểm nhấn / tương sinh" colors={result.exterior.accent} tone="accent" />
          <ColorBlock title="Nên tránh (tương khắc)" colors={result.exterior.avoid} tone="avoid" />

          <div className="mt-4 space-y-2 text-sm">
            <p><span className="font-semibold text-slate-800">Phòng khách:</span> {result.interior.living}</p>
            <p><span className="font-semibold text-slate-800">Phòng ngủ:</span> {result.interior.bedroom}</p>
            <p><span className="font-semibold text-slate-800">Bếp:</span> {result.interior.kitchen}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/thiet-ke-thi-cong-noi-that" className="text-sm font-semibold text-brand-700 hover:underline">
              Khám phá phong cách nội thất →
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">{PAINT_COLOR_DISCLAIMER}</p>
        </div>
      ) : null}
    </div>
  );
}

function ColorBlock({
  title,
  colors,
  tone,
}: {
  title: string;
  colors: string[];
  tone: "good" | "accent" | "avoid";
}) {
  const bg = tone === "avoid" ? "bg-red-50 border-red-100" : tone === "accent" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100";
  return (
    <div className={`mt-4 rounded-xl border p-4 ${bg}`}>
      <p className="text-xs font-semibold uppercase text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {colors.map((c) => (
          <span key={c} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
