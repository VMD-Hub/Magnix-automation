"use client";

import { useState } from "react";
import {
  formatPercentInput,
  isPartialPercentInput,
  parsePercentInput,
} from "@/lib/format/percent";
import { cn } from "@/lib/ui/cn";

type PercentInputProps = {
  value: number;
  onChange: (n: number) => void;
  id?: string;
  "aria-label"?: string;
  max?: number;
  step?: number;
};

const STEP_BTN =
  "flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold leading-none text-slate-600 touch-manipulation hover:bg-slate-50 active:bg-slate-100 sm:w-11 sm:text-xl";

const INPUT_BASE =
  "h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 pr-9 text-base text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 sm:text-sm";

export function PercentInput({
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  max = 100,
  step = 0.1,
}: PercentInputProps) {
  const [text, setText] = useState(() => formatPercentInput(value));

  function apply(next: number) {
    const capped = Math.max(0, Math.min(Math.round(next * 1000) / 1000, max));
    onChange(capped);
    setText(formatPercentInput(capped));
  }

  function commit(raw: string) {
    const parsed = parsePercentInput(raw);
    if (parsed == null) return;
    apply(parsed);
  }

  function adjust(delta: number) {
    apply(value + delta);
  }

  return (
    <div className="mt-1 w-full min-w-0 max-w-full">
      <div className="flex w-full min-w-0 items-stretch gap-1 sm:gap-2">
      <button
        type="button"
        className={STEP_BTN}
        aria-label="Giảm lãi suất"
        onClick={() => adjust(-step)}
      >
        −
      </button>
      <div className="relative min-w-0 flex-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          aria-label={ariaLabel ?? "Lãi suất phần trăm mỗi năm"}
          value={text}
          onChange={(e) => {
            const next = e.target.value.replace(/[^\d.,%]/g, "");
            setText(next);
            if (isPartialPercentInput(next)) return;
            const parsed = parsePercentInput(next);
            if (parsed != null) onChange(Math.min(parsed, max));
          }}
          onBlur={() => {
            if (isPartialPercentInput(text)) {
              commit(text.replace(/[.,]$/, ""));
              return;
            }
            const parsed = parsePercentInput(text);
            if (parsed != null) {
              commit(text);
              return;
            }
            setText(formatPercentInput(value));
          }}
          className={cn(INPUT_BASE, "w-full")}
        />
        <span
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400"
          aria-hidden
        >
          %
        </span>
      </div>
      <button
        type="button"
        className={STEP_BTN}
        aria-label="Tăng lãi suất"
        onClick={() => adjust(step)}
      >
        +
      </button>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-slate-400 sm:text-xs">
        Lãi hiện tại: <span className="font-semibold text-slate-600">{formatPercentInput(value)}%/năm</span>
        {" · "}
        Gõ số hoặc bấm − / +
      </p>
    </div>
  );
}
