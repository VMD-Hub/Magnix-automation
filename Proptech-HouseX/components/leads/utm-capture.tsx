"use client";

import { useEffect } from "react";
import { captureLeadUtmFromLocation } from "@/lib/leads/client-utm";

/** Ghi UTM từ URL vào sessionStorage — chạy một lần mỗi page load. */
export function UtmCapture() {
  useEffect(() => {
    captureLeadUtmFromLocation();
  }, []);
  return null;
}
