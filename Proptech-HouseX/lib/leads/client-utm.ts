import type { LeadUtm } from "@/lib/leads/utm";
import { parseLeadUtmFromSearchParams } from "@/lib/leads/utm";

const UTM_STORAGE_KEY = "housex:lead-utm";

/** Lưu UTM lần đầu vào session — giữ qua điều hướng nội bộ trước khi submit form. */
export function captureLeadUtmFromLocation(search?: string): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(search ?? window.location.search);
    const utm = parseLeadUtmFromSearchParams(params);
    if (!utm) return;
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    /* ignore quota / private mode */
  }
}

export function readStoredLeadUtm(): LeadUtm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LeadUtm;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
