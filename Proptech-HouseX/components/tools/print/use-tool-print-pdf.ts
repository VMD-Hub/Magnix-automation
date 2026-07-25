"use client";

import { useCallback } from "react";

const QR_SRC = "/api/brand/zalo-oa-qr";

/** Prefetch QR rồi mở hộp thoại in (Save as PDF). */
export function useToolPrintPdf() {
  return useCallback((opts?: { beforePrint?: () => void }) => {
    opts?.beforePrint?.();
    const img = new window.Image();
    img.src = QR_SRC;
    requestAnimationFrame(() => {
      window.setTimeout(() => window.print(), 80);
    });
  }, []);
}
