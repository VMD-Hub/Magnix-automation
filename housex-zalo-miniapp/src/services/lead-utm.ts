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

const UTM_STORAGE_KEY = "housex:lead-utm";

function parseLeadUtmFromSearchParams(params: URLSearchParams): LeadUtm | null {
  const utm: LeadUtm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key] =
        key === "utm_source" || key === "utm_medium"
          ? value.toLowerCase()
          : value;
    }
  }
  return Object.keys(utm).length > 0 ? utm : null;
}

export function captureLeadUtmFromLocation(search?: string): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(search ?? window.location.search);
    const utm = parseLeadUtmFromSearchParams(params);
    if (!utm) return;
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    /* ignore */
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
