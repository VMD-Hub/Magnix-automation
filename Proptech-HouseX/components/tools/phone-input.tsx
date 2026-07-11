"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";

const DEFAULT_MAX_LEN = 12;

function digitsOnly(raw: string, maxLen: number): string {
  return raw.replace(/\D/g, "").slice(0, maxLen);
}

type PhoneInputProps = {
  value: string;
  onChange: (phone: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  "aria-label"?: string;
};

/**
 * SĐT VN — chỉ chữ số, không type=tel (tránh format OS trên mobile).
 * Commit parent khi blur; không re-render form mỗi phím.
 */
export function PhoneInput({
  value,
  onChange,
  id,
  className,
  placeholder = "0901234567",
  maxLength = DEFAULT_MAX_LEN,
  required,
  "aria-label": ariaLabel,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => digitsOnly(value, maxLength));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!focused) {
      setText(digitsOnly(value, maxLength));
    }
  }, [value, focused, maxLength]);

  return (
    <input
      id={id}
      type="text"
      inputMode="tel"
      autoComplete="tel"
      enterKeyHint="done"
      required={required}
      aria-label={ariaLabel ?? "Số điện thoại"}
      placeholder={placeholder}
      maxLength={maxLength}
      value={focused ? text : digitsOnly(value, maxLength)}
      onFocus={() => {
        setFocused(true);
        setText(digitsOnly(value, maxLength));
      }}
      onChange={(e) => {
        setText(digitsOnly(e.target.value, maxLength));
      }}
      onBlur={() => {
        setFocused(false);
        const d = digitsOnly(text, maxLength);
        setText(d);
        onChangeRef.current(d);
      }}
      className={cn(className)}
    />
  );
}
