/**
 * P4 — subdomain campaign → hub lane trên domain chính.
 * Ví dụ: noxh.timnhaxahoi.com → /du-an/nha-o-xa-hoi
 */

export const DEFAULT_CAMPAIGN_LANE_HOSTS: Record<string, string> = {
  "noxh.timnhaxahoi.com": "/du-an/nha-o-xa-hoi",
  "cctm.timnhaxahoi.com": "/du-an/thuong-mai",
};

/** Đường dẫn đích trên site chính; null nếu không phải host campaign. */
export function resolveCampaignLanePath(host: string): string | null {
  const normalized = host.split(":")[0]?.trim().toLowerCase() ?? "";
  if (!normalized) return null;

  const extra = process.env.CAMPAIGN_LANE_HOSTS?.trim();
  if (extra) {
    for (const part of extra.split(",")) {
      const [h, path] = part.split("=").map((s) => s.trim());
      if (h?.toLowerCase() === normalized && path?.startsWith("/")) {
        return path;
      }
    }
  }

  return DEFAULT_CAMPAIGN_LANE_HOSTS[normalized] ?? null;
}

/** URL redirect 308 về canonical site (utm campaign). */
export function buildCampaignLaneRedirectUrl(
  host: string,
  siteUrl?: string,
): URL | null {
  const path = resolveCampaignLanePath(host);
  if (!path) return null;

  const base = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://timnhaxahoi.com")
    .trim()
    .replace(/\/$/, "");

  const url = new URL(path, `${base}/`);
  url.searchParams.set("utm_source", "campaign_lane");
  url.searchParams.set("utm_medium", host.split(".")[0]?.toLowerCase() ?? "lane");
  return url;
}
