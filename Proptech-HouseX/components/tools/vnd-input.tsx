"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatVndInputDisplay,
  parseVndInput,
} from "@/lib/format/vnd-input";
import { cn } from "@/lib/ui/cn";

type VndInputProps = {
  value: number;
  onChange: (n: number) => void;
  id?: string;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
  /** Gọi parent sau N ms khi gõ — mặc định chỉ khi blur. Đặt 0 = chỉ blur. */
  liveDebounceMs?: number;
};

/**
 * Ô nhập VND — gõ chữ số thuần, không format khi focus.
 * Không báo parent mỗi phím (tránh re-render / nhảy số); commit khi blur.
 */
export function VndInput({
  value,
  onChange,
  id,
  className,
  placeholder,
  "aria-label": ariaLabel,
  liveDebounceMs = 0,
}: VndInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => formatVndInputDisplay(value));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!focused) {
      setText(formatVndInputDisplay(value));
    }
  }, [value, focused]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  function pushToParent(raw: string, immediate = false) {
    const n = parseVndInput(raw);
    if (immediate || liveDebounceMs <= 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onChangeRef.current(n);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeRef.current(n);
    }, liveDebounceMs);
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      enterKeyHint="done"
      aria-label={ariaLabel ?? "Số tiền VND"}
      placeholder={placeholder}
      value={focused ? text : formatVndInputDisplay(value)}
      onFocus={() => {
        setFocused(true);
        setText(value > 0 ? String(value) : "");
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d]/g, "");
        setText(raw);
        pushToParent(raw);
      }}
      onBlur={() => {
        setFocused(false);
        pushToParent(text, true);
        const n = parseVndInput(text);
        setText(formatVndInputDisplay(n));
      }}
      className={cn(className)}
    />
  );
}
