/** UTM params chuẩn — lưu trên Lead.sourceMeta và gửi kèm form. */
export type LeadUtm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const satisfies readonly (keyof LeadUtm)[];

function cleanUtmValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 200) : undefined;
}

/** Chuẩn hóa key UTM — lowercase source/medium để so khớp rule. */
export function normalizeLeadUtm(utm: LeadUtm): LeadUtm {
  const out: LeadUtm = {};
  for (const key of UTM_KEYS) {
    const raw = cleanUtmValue(utm[key]);
    if (!raw) continue;
    out[key] =
      key === "utm_source" || key === "utm_medium"
        ? raw.toLowerCase()
        : raw;
  }
  return out;
}

export function hasLeadUtm(utm: LeadUtm | null | undefined): boolean {
  if (!utm) return false;
  return UTM_KEYS.some((k) => !!cleanUtmValue(utm[k]));
}

/** Đọc UTM từ object phẳng (body JSON hoặc search params). */
export function parseLeadUtmFromRecord(
  record: Record<string, unknown>,
): LeadUtm | null {
  const utm: LeadUtm = {};
  for (const key of UTM_KEYS) {
    const value = cleanUtmValue(record[key]);
    if (value) utm[key] = value;
  }
  return hasLeadUtm(utm) ? normalizeLeadUtm(utm) : null;
}

export function parseLeadUtmFromSearchParams(
  params: URLSearchParams,
): LeadUtm | null {
  const record: Record<string, unknown> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) record[key] = value;
  }
  return parseLeadUtmFromRecord(record);
}
