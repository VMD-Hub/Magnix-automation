import {
  hasLeadUtm,
  normalizeLeadUtm,
  type LeadUtm,
} from "@/lib/leads/utm";

/** Nguồn lead Ops — xem docs/LEAD_ATTRIBUTION_CONFLICT_RULES.md §3. */
export const LEAD_SOURCE = {
  ZALO_ADS: "zalo_ads",
  FANPAGE: "fanpage",
  TOOL_NOXH_CHECK: "tool:noxh-check",
  TOOL_NOXH_LOAN_QUICK: "tool:noxh-loan-quick-check",
  MINIAPP_CONSULT: "miniapp:consult",
  WEB_LEAD: "web:lead",
  OPS_MANUAL: "ops:manual",
  REFERRAL: "referral",
  CTV_CLAIM: "ctv_claim",
  /** Legacy — map sang web:lead khi ingest form web. */
  ORGANIC: "organic",
} as const;

export type LeadSourceChannel = "web" | "miniapp" | "api";

export type LeadSourceMeta = {
  utm?: LeadUtm;
  /** Giá trị `source` client gửi trước khi chuẩn hóa — audit/debug. */
  rawSource?: string;
  channel?: LeadSourceChannel;
};

export type ResolveLeadSourceInput = {
  bodySource?: string;
  utm?: LeadUtm | null;
  channel?: LeadSourceChannel;
  referralAssigned: boolean;
};

export type ResolvedLeadSource = {
  source: string;
  sourceMeta: LeadSourceMeta | null;
};

const ZALO_ADS_SOURCES = new Set([
  "zalo",
  "zalo_ads",
  "zaloads",
  "zalo-ads",
]);

const PAID_MEDIA = new Set([
  "cpc",
  "cpm",
  "paid",
  "ads",
  "display",
  "banner",
]);

const FANPAGE_SOURCES = new Set(["facebook", "fb", "fanpage", "meta"]);

const KNOWN_SOURCES = new Set<string>([
  LEAD_SOURCE.ZALO_ADS,
  LEAD_SOURCE.FANPAGE,
  LEAD_SOURCE.TOOL_NOXH_CHECK,
  LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK,
  LEAD_SOURCE.MINIAPP_CONSULT,
  LEAD_SOURCE.WEB_LEAD,
  LEAD_SOURCE.OPS_MANUAL,
  LEAD_SOURCE.REFERRAL,
  LEAD_SOURCE.CTV_CLAIM,
  LEAD_SOURCE.ORGANIC,
]);

const LEGACY_SOURCE_MAP: Record<string, string> = {
  organic: LEAD_SOURCE.WEB_LEAD,
  zalo_miniapp: LEAD_SOURCE.MINIAPP_CONSULT,
  web: LEAD_SOURCE.WEB_LEAD,
};

export function magnixInboundSource(uidSource: string): string {
  const slug = uidSource.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
  return `magnix:${slug || "unknown"}`;
}

/** UTM từ landing Zalo Ads (utm_source=zalo + medium paid). */
export function isZaloAdsUtm(utm: LeadUtm | null | undefined): boolean {
  if (!utm?.utm_source) return false;
  const src = utm.utm_source;
  if (src === "campaign_lane") return false;
  if (!ZALO_ADS_SOURCES.has(src)) return false;

  const med = utm.utm_medium;
  if (!med) return true;
  if (PAID_MEDIA.has(med)) return true;
  if (med.includes("zalo")) return true;
  return false;
}

export function isFanpageUtm(utm: LeadUtm | null | undefined): boolean {
  if (!utm?.utm_source) return false;
  return FANPAGE_SOURCES.has(utm.utm_source);
}

function normalizeBodySource(
  bodySource: string | undefined,
  channel: LeadSourceChannel,
): string | undefined {
  const raw = bodySource?.trim();
  if (!raw) return undefined;

  const mapped = LEGACY_SOURCE_MAP[raw.toLowerCase()] ?? raw;
  if (KNOWN_SOURCES.has(mapped) || mapped.includes(":")) {
    return mapped;
  }

  if (channel === "miniapp") return LEAD_SOURCE.MINIAPP_CONSULT;
  return mapped;
}

function defaultSourceForChannel(channel: LeadSourceChannel): string {
  return channel === "miniapp"
    ? LEAD_SOURCE.MINIAPP_CONSULT
    : LEAD_SOURCE.WEB_LEAD;
}

function buildSourceMeta(input: ResolveLeadSourceInput): LeadSourceMeta | null {
  const utm = input.utm && hasLeadUtm(input.utm) ? input.utm : undefined;
  const rawSource = input.bodySource?.trim();
  const channel = input.channel;

  if (!utm && !rawSource && !channel) return null;

  return {
    ...(utm ? { utm } : {}),
    ...(rawSource ? { rawSource } : {}),
    ...(channel ? { channel } : {}),
  };
}

/**
 * Suy ra `Lead.source` + meta UTM.
 * Thứ tự: referral → UTM paid (Zalo/Fanpage) → body source → default theo channel.
 */
export function resolveLeadSource(
  input: ResolveLeadSourceInput,
): ResolvedLeadSource {
  const channel = input.channel ?? "web";
  const utm =
    input.utm && hasLeadUtm(input.utm) ? normalizeLeadUtm(input.utm) : null;
  const withChannel = { ...input, utm, channel };

  if (input.referralAssigned) {
    return {
      source: LEAD_SOURCE.REFERRAL,
      sourceMeta: buildSourceMeta(withChannel),
    };
  }

  if (utm && isZaloAdsUtm(utm)) {
    return {
      source: LEAD_SOURCE.ZALO_ADS,
      sourceMeta: buildSourceMeta(withChannel),
    };
  }

  if (utm && isFanpageUtm(utm)) {
    return {
      source: LEAD_SOURCE.FANPAGE,
      sourceMeta: buildSourceMeta(withChannel),
    };
  }

  const fromBody = normalizeBodySource(input.bodySource, channel);
  if (fromBody) {
    return {
      source: fromBody,
      sourceMeta: buildSourceMeta(withChannel),
    };
  }

  const fallback = defaultSourceForChannel(channel);
  return {
    source: fallback,
    sourceMeta: buildSourceMeta(withChannel),
  };
}

/** Header client gửi để phân biệt Mini App vs web form. */
export const LEAD_CHANNEL_HEADER = "x-housex-channel";

export function parseLeadChannelHeader(
  value: string | null,
): LeadSourceChannel | undefined {
  const v = value?.trim().toLowerCase();
  if (v === "miniapp" || v === "web" || v === "api") return v;
  return undefined;
}
