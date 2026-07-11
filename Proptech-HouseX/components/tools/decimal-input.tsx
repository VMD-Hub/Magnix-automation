"use client";

import { useEffect, useRef, useState } from "react";
import {
  isPartialDecimalInput,
  parseDecimalInput,
} from "@/lib/format/vnd-input";
import { cn } from "@/lib/ui/cn";

type DecimalInputProps = {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  min?: number;
  className?: string;
  "aria-label"?: string;
};

/** Ô % / số thập phân — commit parent khi blur. */
export function DecimalInput({
  value,
  onChange,
  max = 100,
  min = 0,
  className,
  "aria-label": ariaLabel,
}: DecimalInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => String(value));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!focused) {
      setText(value === 0 ? "0" : String(value));
    }
  }, [value, focused]);

  function commit(raw: string) {
    const parsed = parseDecimalInput(raw);
    if (parsed == null) return;
    const capped = Math.min(max, Math.max(min, parsed));
    onChangeRef.current(capped);
    setText(String(capped));
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={ariaLabel}
      value={focused ? text : value === 0 ? "0" : String(value)}
      onFocus={() => {
        setFocused(true);
        setText(value === 0 ? "" : String(value));
      }}
      onChange={(e) => {
        const next = e.target.value.replace(/[^\d.,]/g, "");
        setText(next);
      }}
      onBlur={() => {
        setFocused(false);
        if (isPartialDecimalInput(text)) {
          commit(text.replace(/[.,]$/, ""));
          return;
        }
        const parsed = parseDecimalInput(text);
        if (parsed != null) commit(text);
        else setText(value === 0 ? "0" : String(value));
      }}
      className={cn(className)}
    />
  );
}
