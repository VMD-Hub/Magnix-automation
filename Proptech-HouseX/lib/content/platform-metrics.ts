/**
 * Con số nổi bật — cập nhật qua env hoặc sửa fallback tại đây.
 *
 * NEXT_PUBLIC_METRIC_VERIFIED_LISTINGS  — tin đã kiểm chứng
 * NEXT_PUBLIC_METRIC_MONTHLY_USERS      — người dùng / tháng
 * NEXT_PUBLIC_METRIC_ACTIVE_PROJECTS    — dự án trên sàn
 * NEXT_PUBLIC_METRIC_BROKER_PARTNERS    — môi giới / đối tác đăng tin
 */

export type PlatformMetric = { value: string; label: string };

function metricFromEnv(envKey: string, fallback: string): string {
  const v = process.env[envKey]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/** Gọi tại build/runtime — fallback "—" để team chèn số liệu thật sau. */
export function getPlatformMetrics(): PlatformMetric[] {
  return [
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_VERIFIED_LISTINGS", "—"),
      label: "Tin đã kiểm chứng",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_MONTHLY_USERS", "—"),
      label: "Người dùng / tháng",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_ACTIVE_PROJECTS", "—"),
      label: "Dự án trên sàn",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_BROKER_PARTNERS", "—"),
      label: "Môi giới & đối tác",
    },
  ];
}
