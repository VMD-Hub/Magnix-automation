/** Ảnh chân dung Founder — bật bằng NEXT_PUBLIC_FOUNDER_PORTRAIT_URL. */

export const FOUNDER_PORTRAIT = {
  alt: "Leo Duong — Người sáng lập House X",
  initials: "LD",
} as const;

/** URL ảnh thật; null = hiển thị placeholder initials. */
export function getFounderPortraitSrc(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_FOUNDER_PORTRAIT_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : null;
}
