/**
 * Fallback catalog demo — chỉ dev/staging. Production luôn dùng Postgres.
 */
export function allowDemoProjectFallback(): boolean {
  return process.env.NODE_ENV !== "production";
}
