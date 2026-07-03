/**
 * Tracker funnel nhẹ — đẩy sự kiện vào window.dataLayer (chuẩn GTM/GA4).
 *
 * Nguyên tắc: CHỈ gửi metadata funnel (bước, tier, trạng thái) — KHÔNG gửi PII
 * (tên, SĐT, email, thu nhập). No-op an toàn khi chạy SSR hoặc chưa gắn GTM.
 */

type Primitive = string | number | boolean | undefined;

export function track(
  event: string,
  params?: Record<string, Primitive>,
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, params ?? {});
  }
}
