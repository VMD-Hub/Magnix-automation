import type { LeadSegment } from "@prisma/client";
import { resolveNurtureScriptId } from "@/lib/leads/nurture-scripts";

/** Kênh liên hệ phục vụ nurture — không thay SĐT khóa chính trên Customer. */
export type LeadContactChannels = {
  phone?: string | null;
  zalo?: string | null;
  email?: string | null;
  facebook?: string | null;
};

export type LeadOpsMeta = {
  channels: LeadContactChannels;
  nurtureScriptId: string | null;
  opsNote: string | null;
};

const EMPTY_CHANNELS: LeadContactChannels = {};

function readChannels(raw: unknown): LeadContactChannels {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...EMPTY_CHANNELS };
  }
  const c = raw as Record<string, unknown>;
  const out: LeadContactChannels = {};
  for (const key of ["phone", "zalo", "email", "facebook"] as const) {
    const v = c[key];
    if (typeof v === "string" || v === null) out[key] = v;
  }
  return out;
}

export function readLeadOpsMeta(meta: unknown): LeadOpsMeta {
  const m =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? (meta as Record<string, unknown>)
      : {};

  return {
    channels: readChannels(m.channels),
    nurtureScriptId:
      typeof m.nurtureScriptId === "string"
        ? m.nurtureScriptId
        : m.nurtureScriptId === null
          ? null
          : null,
    opsNote: typeof m.opsNote === "string" ? m.opsNote : null,
  };
}

export function mergeLeadOpsMeta(
  meta: unknown,
  patch: Partial<{
    channels: Partial<LeadContactChannels>;
    nurtureScriptId: string | null;
    opsNote: string | null;
  }>,
): Record<string, unknown> {
  const current = readLeadOpsMeta(meta);
  const base =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? { ...(meta as Record<string, unknown>) }
      : {};

  if (patch.channels !== undefined) {
    const next = { ...current.channels };
    for (const [key, value] of Object.entries(patch.channels)) {
      if (value === undefined) continue;
      (next as Record<string, string | null>)[key] = value;
    }
    base.channels = next;
  }
  if (patch.nurtureScriptId !== undefined) {
    base.nurtureScriptId = patch.nurtureScriptId;
  }
  if (patch.opsNote !== undefined) {
    base.opsNote = patch.opsNote;
  }

  return base;
}

export function buildInitialLeadOpsMeta(input: {
  phone: string;
  email?: string | null;
  segment: LeadSegment | null;
  source: string;
}): Record<string, unknown> {
  return {
    channels: {
      phone: input.phone,
      ...(input.email ? { email: input.email } : {}),
    },
    nurtureScriptId: resolveNurtureScriptId({
      segment: input.segment,
      source: input.source,
    }),
    opsNote: null,
  };
}

/** Mask SĐT cho UI admin — không log PII đầy đủ. */
export function maskLeadPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const s = String(phone).replace(/\s/g, "");
  if (s.length <= 6) return "***";
  return `${s.slice(0, 3)}***${s.slice(-2)}`;
}
