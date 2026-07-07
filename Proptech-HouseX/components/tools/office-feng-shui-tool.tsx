"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  BAT_TRACH_DISCLAIMER,
  calcBatTrach,
  GENDER_LABEL,
  menhGroupLabel,
  type BatTrachResult,
  type DirectionResult,
  type Gender,
} from "@/lib/feng-shui/bat-trach";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i);

const OFFICE_TIPS: Record<string, string> = {
  SINH_KHI: "Ngồi quay mặt về hướng này — tốt cho thăng tiến, đàm phán.",
  THIEN_Y: "Hợp hướng cửa phòng hoặc đặt cây xanh phía trước bàn.",
  DIEN_NIEN: "Hợp bàn họp, làm việc nhóm — tăng hòa hợp đồng nghiệp.",
  PHUC_VI: "Hợp góc yên tĩnh, tủ tài liệu — tập trung công việc chi tiết.",
  HOA_HAI: "Tránh ngồi quay mặt trực tiếp; có thể đặt tủ che.",
  LUC_SAT: "Không đặt bàn làm việc chính; phù hợp khu vực in ấn/phụ.",
  NGU_QUY: "Đặt máy in, thiết bị ồn — tránh ghế chủ trì.",
  TUYET_MENH: "Tuyệt đối tránh bàn làm việc và cửa chính phòng.",
};

export function OfficeFengShuiTool() {
  const [gender, setGender] = useState<Gender>("MALE");
  const [birthYear, setBirthYear] = useState(1990);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? calcBatTrach(birthYear, gender) : null),
    [submitted, birthYear, gender],
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
        <p className="text-sm font-medium text-slate-700">Giới tính</p>
        <div className="mt-2 flex gap-2">
          {(["MALE", "FEMALE"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { setGender(g); setSubmitted(false); }}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold",
                gender === g ? "border-brand-400 bg-brand-50 text-brand-800" : "border-slate-200 bg-white text-slate-600",
              )}
            >
              {GENDER_LABEL[g]}
            </button>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Năm sinh (âm lịch)</span>
          <select value={birthYear} onChange={(e) => { setBirthYear(Number(e.target.value)); setSubmitted(false); }} className={inputCls}>
            {BIRTH_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">Xem phong thủy bàn làm việc</Button>
      </form>

      {result ? <OfficeResult result={result} /> : null}
    </div>
  );
}

function OfficeResult({ result }: { result: BatTrachResult }) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase text-brand-600">
        Cung {result.trigram.name} · {menhGroupLabel(result.group)}
      </p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">
        Hướng ngồi tốt nhất: {result.bestDirection.direction.name} ({result.bestDirection.star.name})
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Quay mặt bàn về hướng cát; lưng ghế nên có tường hoặc vách vững — tránh ngồi quay lưng ra cửa chính.
      </p>

      <h4 className="mt-5 text-sm font-bold uppercase text-emerald-700">4 hướng tốt cho bàn làm việc</h4>
      <ul className="mt-2 space-y-2">
        {result.goodDirections.map((d) => (
          <DirectionOfficeRow key={d.direction.key} item={d} />
        ))}
      </ul>

      <h4 className="mt-5 text-sm font-bold uppercase text-red-700">4 hướng nên tránh</h4>
      <ul className="mt-2 space-y-2">
        {result.badDirections.map((d) => (
          <DirectionOfficeRow key={d.direction.key} item={d} />
        ))}
      </ul>

      <p className="mt-4 text-xs text-slate-500">{BAT_TRACH_DISCLAIMER}</p>
    </div>
  );
}

function DirectionOfficeRow({ item }: { item: DirectionResult }) {
  return (
    <li className="rounded-lg border border-slate-200 p-3 text-sm">
      <span className="font-bold text-slate-900">{item.direction.name}</span>
      <span className={item.star.auspicious ? " text-emerald-700" : " text-red-700"}>
        {" "}· {item.star.name}
      </span>
      <p className="mt-1 text-xs text-slate-600">{OFFICE_TIPS[item.star.key]}</p>
    </li>
  );
}
