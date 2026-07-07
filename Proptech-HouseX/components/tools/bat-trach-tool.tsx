"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";
import {
  EightTrigramStrip,
  TrigramEmblem,
} from "@/components/feng-shui/trigram-emblem";
import { TRIGRAM_HAN } from "@/lib/feng-shui/luo-pan-symbols";
import {
  BAT_TRACH_DISCLAIMER,
  calcBatTrach,
  GENDER_LABEL,
  groupGoodDirectionNames,
  menhGroupLabel,
  trachGroupLabel,
  type BatTrachResult,
  type DirectionKey,
  type DirectionResult,
  type Gender,
  type StarKey,
} from "@/lib/feng-shui/bat-trach";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i);

/** Vị trí ô trong lưới cửu cung — Bắc trên, Đông phải (như bản đồ). */
const GRID_LAYOUT: DirectionKey[] = ["NW", "N", "NE", "W", "E", "SW", "S", "SE"];

const STAR_STYLE: Record<
  StarKey,
  { chip: string; ring: string; dot: string; text: string }
> = {
  SINH_KHI: { chip: "bg-emerald-600 text-white", ring: "border-emerald-300 bg-emerald-50", dot: "bg-emerald-600", text: "text-emerald-800" },
  THIEN_Y: { chip: "bg-emerald-500 text-white", ring: "border-emerald-200 bg-emerald-50/70", dot: "bg-emerald-500", text: "text-emerald-800" },
  DIEN_NIEN: { chip: "bg-teal-500 text-white", ring: "border-teal-200 bg-teal-50/70", dot: "bg-teal-500", text: "text-teal-800" },
  PHUC_VI: { chip: "bg-sky-500 text-white", ring: "border-sky-200 bg-sky-50/70", dot: "bg-sky-500", text: "text-sky-800" },
  HOA_HAI: { chip: "bg-amber-500 text-white", ring: "border-amber-200 bg-amber-50/70", dot: "bg-amber-500", text: "text-amber-800" },
  LUC_SAT: { chip: "bg-orange-500 text-white", ring: "border-orange-200 bg-orange-50/70", dot: "bg-orange-500", text: "text-orange-800" },
  NGU_QUY: { chip: "bg-red-500 text-white", ring: "border-red-200 bg-red-50/70", dot: "bg-red-500", text: "text-red-800" },
  TUYET_MENH: { chip: "bg-red-600 text-white", ring: "border-red-300 bg-red-50", dot: "bg-red-600", text: "text-red-800" },
};

export function BatTrachTool() {
  const [gender, setGender] = useState<Gender>("MALE");
  const [birthYear, setBirthYear] = useState(1990);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () => (submitted ? calcBatTrach(birthYear, gender) : null),
    [submitted, birthYear, gender],
  );

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="proptech-ruby-soft-panel p-5 sm:p-6"
        data-track="bat-trach-form"
      >
        <p className="text-sm font-medium text-slate-700">Giới tính gia chủ</p>
        <div className="mt-2 flex gap-2">
          {(["MALE", "FEMALE"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGender(g);
                setSubmitted(false);
              }}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                gender === g
                  ? "border-brand-400 bg-brand-50 text-brand-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-200",
              )}
            >
              {GENDER_LABEL[g]}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Năm sinh (âm lịch)</span>
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
          <span className="mt-1.5 block text-xs text-slate-400">
            Sinh trước Tết Nguyên đán thì lùi 1 năm. Dữ liệu chỉ tính trên thiết bị của bạn.
          </span>
        </label>

        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          Xem hướng nhà hợp tuổi
        </Button>
      </form>

      {result ? <BatTrachResultView result={result} /> : null}
    </div>
  );
}

function BatTrachResultView({ result }: { result: BatTrachResult }) {
  const byDir = useMemo(() => {
    const map = new Map<DirectionKey, DirectionResult>();
    result.directions.forEach((d) => map.set(d.direction.key, d));
    return map;
  }, [result]);

  const groupNames = groupGoodDirectionNames(result.group).join(", ");

  return (
    <div
      className="space-y-8"
      data-track="bat-trach-result"
      data-menh={result.trigram.key}
      data-group={result.group}
    >
      <div className="proptech-ruby-soft-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <TrigramEmblem trigram={result.trigram} size="lg" active />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {GENDER_LABEL[result.gender]} · sinh năm {result.birthYear} (âm lịch)
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                Cung {result.trigram.name}{" "}
                <span className="font-serif text-brand-800">{TRIGRAM_HAN[result.trigram.key]}</span>
                <span className="text-lg font-semibold text-slate-500">
                  {" "}
                  — {menhGroupLabel(result.group)}
                </span>
              </h3>
            </div>
          </div>
          <div className="flex gap-2 text-center">
            <Badge label="Quái số" value={String(result.rawKua)} />
            <Badge label="Ngũ hành" value={result.trigram.element} />
          </div>
        </div>
        <EightTrigramStrip activeKey={result.trigram.key} className="mt-5" />
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Bạn thuộc <strong>{menhGroupLabel(result.group)}</strong>, hợp{" "}
          <strong>{trachGroupLabel(result.group)}</strong>. Bốn hướng tốt của nhóm:{" "}
          <strong>{groupNames}</strong>. Đặt cửa chính, giường ngủ và bàn thờ về các hướng cát;
          dành hướng hung cho bếp và nhà vệ sinh.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Sơ đồ la bàn 8 hướng
          </h4>
          <Compass
            byDir={byDir}
            menhName={result.trigram.name}
            group={result.group}
            trigramKey={result.trigram.key}
          />
          <p className="mt-3 text-center text-xs text-slate-400">
            Bắc ở trên · Đông bên phải — như bản đồ thông thường.
          </p>
        </div>

        <div className="space-y-5">
          <DirectionGroup
            title="4 hướng TỐT nên dùng"
            tone="good"
            items={result.goodDirections}
          />
          <DirectionGroup
            title="4 hướng XẤU nên tránh"
            tone="bad"
            items={result.badDirections}
          />
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        {BAT_TRACH_DISCLAIMER}
      </p>
    </div>
  );
}

function Compass({
  byDir,
  menhName,
  group,
  trigramKey,
}: {
  byDir: Map<DirectionKey, DirectionResult>;
  menhName: string;
  group: BatTrachResult["group"];
  trigramKey: BatTrachResult["trigram"]["key"];
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {GRID_LAYOUT.map((key, idx) => {
        // Chèn ô tâm vào giữa lưới (vị trí thứ 5).
        if (idx === 4) {
          return (
            <div key="center-and-e" className="contents">
              <CenterCell menhName={menhName} group={group} trigramKey={trigramKey} />
              <DirectionCell cell={byDir.get(key)!} />
            </div>
          );
        }
        return <DirectionCell key={key} cell={byDir.get(key)!} />;
      })}
    </div>
  );
}

function CenterCell({
  menhName,
  group,
  trigramKey,
}: {
  menhName: string;
  group: BatTrachResult["group"];
  trigramKey: BatTrachResult["trigram"]["key"];
}) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-xl bg-ink-900 p-1.5 text-center text-white ring-1 ring-gold-500/30">
      <span className="font-serif text-lg leading-none text-gold-300 sm:text-xl">
        {TRIGRAM_HAN[trigramKey]}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-gold-400">Cung</span>
      <span className="text-sm font-extrabold leading-tight sm:text-base">{menhName}</span>
      <span className="mt-0.5 text-[9px] leading-tight text-silver-200">
        {menhGroupLabel(group)}
      </span>
    </div>
  );
}

function DirectionCell({ cell }: { cell: DirectionResult }) {
  const style = STAR_STYLE[cell.star.key];
  return (
    <div
      className={cn(
        "flex aspect-square flex-col items-center justify-center rounded-xl border p-1.5 text-center",
        style.ring,
      )}
    >
      <span className="text-xs font-bold text-slate-800 sm:text-sm">
        {cell.direction.name}
      </span>
      <span
        className={cn(
          "mt-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-tight sm:text-xs",
          style.chip,
        )}
      >
        {cell.star.name}
      </span>
      <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {cell.star.auspicious ? "Cát" : "Hung"}
      </span>
    </div>
  );
}

function DirectionGroup({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "good" | "bad";
  items: DirectionResult[];
}) {
  return (
    <div>
      <h4
        className={cn(
          "mb-3 text-sm font-bold uppercase tracking-wide",
          tone === "good" ? "text-emerald-700" : "text-red-700",
        )}
      >
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => {
          const style = STAR_STYLE[item.star.key];
          return (
            <li
              key={item.direction.key}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-center text-white",
                  style.dot,
                )}
              >
                <span className="text-[11px] font-bold leading-none">
                  {item.direction.short}
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  {item.direction.name}{" "}
                  <span className={cn("font-semibold", style.text)}>
                    · {item.star.name}
                  </span>
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                  {item.star.meaning}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-600">Bố trí:</span>{" "}
                  {item.star.usage}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-brand-200 bg-white px-3 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
