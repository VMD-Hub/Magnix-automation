"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";

type IntegerInputProps = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
  "aria-label"?: string;
};

/** Ô số nguyên — commit parent khi blur. */
export function IntegerInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  className,
  "aria-label": ariaLabel,
}: IntegerInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => String(value));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  function commit(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    const n = digits ? Number(digits) : min;
    const capped = Math.min(max, Math.max(min, n));
    onChangeRef.current(capped);
    setText(String(capped));
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={ariaLabel}
      value={focused ? text : String(value)}
      onFocus={() => {
        setFocused(true);
        setText(String(value));
      }}
      onChange={(e) => {
        setText(e.target.value.replace(/[^\d]/g, ""));
      }}
      onBlur={() => {
        setFocused(false);
        commit(text);
      }}
      className={cn(className)}
    />
  );
}
