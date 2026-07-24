/**
 * Con số nổi bật — cập nhật qua env hoặc sửa fallback tại đây.
 *
 * NEXT_PUBLIC_METRIC_VERIFIED_LISTINGS  — tin đã kiểm chứng
 * NEXT_PUBLIC_METRIC_MONTHLY_USERS      — người dùng / tháng
 * NEXT_PUBLIC_METRIC_ACTIVE_PROJECTS    — dự án trên sàn
 * NEXT_PUBLIC_METRIC_BROKER_PARTNERS    — môi giới / đối tác đăng tin
 *
 * Fallback = số đại diện (ước lượng) cho UI — không phải KPI đã audit.
 */

export type PlatformMetric = { value: string; label: string };

function metricFromEnv(envKey: string, fallback: string): string {
  const v = process.env[envKey]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/** Gọi tại build/runtime — env ghi đè fallback đại diện. */
export function getPlatformMetrics(): PlatformMetric[] {
  return [
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_VERIFIED_LISTINGS", "1.200+"),
      label: "Tin đã kiểm chứng",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_MONTHLY_USERS", "5.000+"),
      label: "Người dùng / tháng",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_ACTIVE_PROJECTS", "80+"),
      label: "Dự án trên sàn",
    },
    {
      value: metricFromEnv("NEXT_PUBLIC_METRIC_BROKER_PARTNERS", "50+"),
      label: "Môi giới & đối tác",
    },
  ];
}
