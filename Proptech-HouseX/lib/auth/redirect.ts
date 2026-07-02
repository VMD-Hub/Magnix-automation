/** Chỉ cho phép redirect nội bộ (chống open redirect). */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}
