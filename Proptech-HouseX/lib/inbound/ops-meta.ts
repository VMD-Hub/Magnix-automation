export const INBOUND_OPS_STATUSES = [
  "pending",
  "reviewing",
  "contacted",
  "converted",
  "dismissed",
] as const;

export type InboundOpsStatus = (typeof INBOUND_OPS_STATUSES)[number];

export type InboundOpsMeta = {
  ops_status: InboundOpsStatus;
  ops_note: string | null;
  platform_lead_id: string | null;
  noxh_case_id: string | null;
  noxh_case_code: string | null;
};

export function readInboundOpsMeta(meta: unknown): InboundOpsMeta {
  const m =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? (meta as Record<string, unknown>)
      : {};

  const rawStatus = m.ops_status;
  const ops_status = INBOUND_OPS_STATUSES.includes(rawStatus as InboundOpsStatus)
    ? (rawStatus as InboundOpsStatus)
    : "pending";

  return {
    ops_status,
    ops_note: typeof m.ops_note === "string" ? m.ops_note : null,
    platform_lead_id:
      typeof m.platform_lead_id === "string" ? m.platform_lead_id : null,
    noxh_case_id:
      typeof m.noxh_case_id === "string" ? m.noxh_case_id : null,
    noxh_case_code:
      typeof m.noxh_case_code === "string" ? m.noxh_case_code : null,
  };
}

export function mergeInboundOpsMeta(
  meta: unknown,
  patch: Partial<InboundOpsMeta>,
): Record<string, unknown> {
  const base =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? { ...(meta as Record<string, unknown>) }
      : {};

  if (patch.ops_status !== undefined) base.ops_status = patch.ops_status;
  if (patch.ops_note !== undefined) base.ops_note = patch.ops_note;
  if (patch.platform_lead_id !== undefined) {
    base.platform_lead_id = patch.platform_lead_id;
  }
  if (patch.noxh_case_id !== undefined) {
    base.noxh_case_id = patch.noxh_case_id;
  }
  if (patch.noxh_case_code !== undefined) {
    base.noxh_case_code = patch.noxh_case_code;
  }

  return base;
}

/** Mask UID for ops UI — không log PII đầy đủ. */
export function maskInboundUid(uid: string): string {
  const s = String(uid).trim();
  if (s.length <= 6) return "***";
  return `${s.slice(0, 3)}***${s.slice(-2)}`;
}
