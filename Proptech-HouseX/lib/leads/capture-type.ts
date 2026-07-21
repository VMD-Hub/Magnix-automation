/**
 * ADR-016 P1 — Interest capture type + channel preference.
 * Stored on Lead.opsMeta (additive); source `waitlist:project` for pool filters.
 */

export const LEAD_CAPTURE_TYPES = [
  "waitlist",
  "consult_request",
  "hot_manual",
] as const;

export type LeadCaptureType = (typeof LEAD_CAPTURE_TYPES)[number];

export const LEAD_CHANNEL_PREFERENCES = [
  "in_app",
  "oa",
  "sms",
  "email",
  "voice_call",
] as const;

export type LeadChannelPreference = (typeof LEAD_CHANNEL_PREFERENCES)[number];

/** Lead.source when captureType=waitlist (Ops pool / notify filters). */
export const WAITLIST_LEAD_SOURCE = "waitlist:project";

export function parseLeadCaptureType(
  raw: unknown,
): LeadCaptureType | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  if ((LEAD_CAPTURE_TYPES as readonly string[]).includes(v)) {
    return v as LeadCaptureType;
  }
  return null;
}

export function parseChannelPreferences(
  raw: unknown,
): LeadChannelPreference[] {
  if (!Array.isArray(raw)) return [];
  const out: LeadChannelPreference[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const v = item.trim().toLowerCase();
    if (
      (LEAD_CHANNEL_PREFERENCES as readonly string[]).includes(v) &&
      !out.includes(v as LeadChannelPreference)
    ) {
      out.push(v as LeadChannelPreference);
    }
  }
  return out;
}

export function defaultChannelPreferencesForCapture(
  captureType: LeadCaptureType,
): LeadChannelPreference[] {
  if (captureType === "waitlist") return ["in_app"];
  return ["voice_call", "in_app"];
}

/** Waitlist / no cold-call — không SLA gọi nóng, không push Telegram hot. */
export function isWaitlistCapture(
  captureType: LeadCaptureType | null | undefined,
  source?: string | null,
): boolean {
  if (captureType === "waitlist") return true;
  if (source === WAITLIST_LEAD_SOURCE) return true;
  return false;
}

export function voiceCallAllowedForCapture(
  captureType: LeadCaptureType | null | undefined,
  source?: string | null,
): boolean {
  return !isWaitlistCapture(captureType, source);
}
